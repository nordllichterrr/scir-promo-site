import json
import math
import secrets
from datetime import datetime, timezone as dt_timezone

from django.conf import settings
from django.core.exceptions import RequestDataTooBig
from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import (
    DatasetFold,
    ExperimentArtifact,
    ExperimentLog,
    ExperimentMetric,
    ExperimentRun,
)


MAX_WORKER_PAYLOAD_BYTES = 5 * 1024 * 1024
MAX_WORKER_METRICS = 5000
MAX_WORKER_ARTIFACTS = 20
MAX_WORKER_LOGS = 100


def _authorized(request):
    expected = getattr(settings, "WORKER_API_TOKEN", "")
    supplied = request.headers.get("X-Worker-Token", "")
    return bool(expected and supplied and secrets.compare_digest(expected, supplied))


def _json_body(request):
    try:
        return json.loads(request.body or b"{}")
    except (TypeError, ValueError):
        return None


def _valid_integer(value, minimum=0, maximum=None):
    if isinstance(value, bool) or not isinstance(value, int):
        return False
    if value < minimum:
        return False
    return maximum is None or value <= maximum


def _valid_finite_number(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return False
    try:
        return math.isfinite(value)
    except (OverflowError, TypeError, ValueError):
        return False


def _valid_storage_key(value):
    if not isinstance(value, str) or not value or len(value) > 500:
        return False
    if "\x00" in value or "\\" in value or value.startswith("/") or ":" in value:
        return False
    parts = value.split("/")
    return all(part not in ("", ".", "..") for part in parts)


def _validate_worker_collections(data):
    limits = {
        "metrics": MAX_WORKER_METRICS,
        "artifacts": MAX_WORKER_ARTIFACTS,
        "logs": MAX_WORKER_LOGS,
    }

    for field, limit in limits.items():
        items = data.get(field, [])
        if not isinstance(items, list):
            return f"{field} must be an array."
        if len(items) > limit:
            return f"{field} exceeds the maximum of {limit} entries."
        if any(not isinstance(item, dict) for item in items):
            return f"Every {field} entry must be an object."

    for item in data.get("metrics", []):
        if not isinstance(item.get("name"), str) or not item["name"].strip():
            return "metrics.name must be a non-empty string."
        if item.get("stage", "overall") not in ExperimentMetric.Stage.values:
            return "metrics.stage is invalid."
        if item.get("dimension", "global") not in ExperimentMetric.Dimension.values:
            return "metrics.dimension is invalid."
        if not isinstance(item.get("dimension_key", ""), str):
            return "metrics.dimension_key must be a string."
        if not isinstance(item.get("metadata", {}), dict):
            return "metrics.metadata must be an object."

    for item in data.get("artifacts", []):
        if not _valid_storage_key(item.get("storage_key")):
            return "artifacts.storage_key is invalid."
        if item.get("kind", "other") not in ExperimentArtifact.Kind.values:
            return "artifacts.kind is invalid."
        for field in ("name", "mime_type", "sha256"):
            if field in item and not isinstance(item[field], str):
                return f"artifacts.{field} must be a string."
        if not isinstance(item.get("metadata", {}), dict):
            return "artifacts.metadata must be an object."

    for item in data.get("logs", []):
        if not isinstance(item.get("message"), str) or not item["message"]:
            return "logs.message must be a non-empty string."
        if item.get("level", "info") not in ExperimentLog.Level.values:
            return "logs.level is invalid."
        if "stage" in item and not isinstance(item["stage"], str):
            return "logs.stage must be a string."
        if not isinstance(item.get("metadata", {}), dict):
            return "logs.metadata must be an object."

    if "environment_snapshot" in data and not isinstance(
        data["environment_snapshot"], dict
    ):
        return "environment_snapshot must be an object."

    return None


def _validate_numeric_payload(data):
    if "progress" in data and not _valid_integer(
        data["progress"], minimum=0, maximum=100
    ):
        return "progress must be an integer between 0 and 100."

    for item in data.get("metrics", []):
        if not isinstance(item, dict):
            continue
        for field in ("value", "std", "ci95_low", "ci95_high"):
            value = item.get(field)
            if value is not None and not _valid_finite_number(value):
                return f"metrics.{field} must be a finite number or null."
        sample_count = item.get("sample_count")
        if sample_count is not None and not _valid_integer(
            sample_count, maximum=2147483647
        ):
            return "metrics.sample_count must be a non-negative integer or null."

    for item in data.get("artifacts", []):
        if not isinstance(item, dict):
            continue
        if not _valid_integer(
            item.get("size_bytes", 0), maximum=9223372036854775807
        ):
            return "artifacts.size_bytes must be a non-negative integer."

    for item in data.get("logs", []):
        if not isinstance(item, dict):
            continue
        if not _valid_integer(
            item.get("sequence", 0), maximum=2147483647
        ):
            return "logs.sequence must be a non-negative integer."

    return None


@csrf_exempt
@require_http_methods(["GET", "POST"])
def worker_run_endpoint(request, run_id):
    if not _authorized(request):
        return JsonResponse({"detail": "Not found."}, status=404)

    if request.method == "GET":
        try:
            run = ExperimentRun.objects.select_related(
                "experiment", "dataset_fold__dataset"
            ).get(pk=run_id)
        except ExperimentRun.DoesNotExist:
            return JsonResponse({"detail": "Run not found."}, status=404)

        fold = run.dataset_fold
        return JsonResponse({
            "id": str(run.pk),
            "experiment_id": str(run.experiment_id),
            "experiment_name": run.experiment.name,
            "dataset_slug": fold.dataset.slug,
            "dataset_version": fold.dataset.version,
            "fold_index": fold.fold_index,
            "fold_split_seed": fold.split_seed,
            "fold_metadata": fold.metadata,
            "config_snapshot": run.config_snapshot or {},
            "seed": run.seed,
            "split_seed": run.split_seed,
            "init_seed": run.init_seed,
            "n_users": run.n_users,
            "topk": run.topk,
            "status": run.status,
        })

    content_length = request.META.get("CONTENT_LENGTH")
    if content_length:
        try:
            if int(content_length) > MAX_WORKER_PAYLOAD_BYTES:
                return JsonResponse(
                    {"detail": "Worker payload is too large."},
                    status=413,
                )
        except (TypeError, ValueError):
            return JsonResponse(
                {"detail": "Invalid Content-Length header."},
                status=400,
            )

    try:
        if len(request.body) > MAX_WORKER_PAYLOAD_BYTES:
            return JsonResponse(
                {"detail": "Worker payload is too large."},
                status=413,
            )
    except RequestDataTooBig:
        return JsonResponse(
            {"detail": "Worker payload is too large."},
            status=413,
        )

    data = _json_body(request)
    if not isinstance(data, dict):
        return JsonResponse(
            {"detail": "JSON body must be an object."},
            status=400,
        )

    allowed_statuses = {
        ExperimentRun.Status.RUNNING,
        ExperimentRun.Status.SUCCEEDED,
        ExperimentRun.Status.FAILED,
        ExperimentRun.Status.CANCELLED,
    }
    status = data.get("status")
    if not isinstance(status, str) or status not in allowed_statuses:
        return JsonResponse({"detail": "Invalid worker status."}, status=400)

    collection_error = _validate_worker_collections(data)
    if collection_error:
        return JsonResponse({"detail": collection_error}, status=400)

    numeric_error = _validate_numeric_payload(data)
    if numeric_error:
        return JsonResponse({"detail": numeric_error}, status=400)

    with transaction.atomic():
        try:
            run = ExperimentRun.objects.select_for_update().get(pk=run_id)
        except ExperimentRun.DoesNotExist:
            return JsonResponse({"detail": "Run not found."}, status=404)

        terminal_statuses = {
            ExperimentRun.Status.SUCCEEDED,
            ExperimentRun.Status.FAILED,
            ExperimentRun.Status.CANCELLED,
        }

        # Terminal runs are immutable. A repeated delivery of the same
        # terminal status is acknowledged without modifying stored results.
        if run.status in terminal_statuses:
            if status == run.status:
                return JsonResponse({"ok": True, "status": run.status})
            return JsonResponse(
                {"detail": "Run is already in a terminal state."},
                status=409,
            )

        # A cancellation request must not be overwritten by a late heartbeat.
        if run.cancel_requested_at and status == ExperimentRun.Status.RUNNING:
            return JsonResponse({"detail": "Cancellation requested."}, status=409)
        for item in data.get("artifacts", []):
            key = item["storage_key"]
            if ExperimentArtifact.objects.filter(
                storage_key=key
            ).exclude(run=run).exists():
                return JsonResponse(
                    {"detail": "Artifact storage_key belongs to another run."},
                    status=409,
                )

        run.status = status
        run.progress = max(0, min(100, int(data.get("progress", run.progress))))
        run.stage = str(data.get("stage", run.stage))[:100]

        if status == ExperimentRun.Status.RUNNING and not run.started_at:
            run.started_at = timezone.now()

        if status in {
            ExperimentRun.Status.SUCCEEDED,
            ExperimentRun.Status.FAILED,
            ExperimentRun.Status.CANCELLED,
        }:
            run.finished_at = timezone.now()

        if status == ExperimentRun.Status.SUCCEEDED:
            run.progress = 100
            run.error_code = ""
            run.error_message = ""

        if status == ExperimentRun.Status.FAILED:
            run.error_code = str(data.get("error_code", "WORKER_ERROR"))[:100]
            run.error_message = str(data.get("error_message", "Worker execution failed."))[:5000]

        env = data.get("environment_snapshot")
        if isinstance(env, dict):
            run.environment_snapshot = env
        if data.get("worker_version"):
            run.worker_version = str(data["worker_version"])[:100]

        run.save()

        for item in data.get("metrics", []):
            if not isinstance(item, dict) or not item.get("name"):
                continue
            ExperimentMetric.objects.update_or_create(
                run=run,
                name=str(item["name"])[:150],
                stage=item.get("stage", "overall"),
                dimension=item.get("dimension", "global"),
                dimension_key=str(item.get("dimension_key", ""))[:100],
                defaults={
                    "value": item.get("value"),
                    "std": item.get("std"),
                    "ci95_low": item.get("ci95_low"),
                    "ci95_high": item.get("ci95_high"),
                    "sample_count": item.get("sample_count"),
                    "metadata": item.get("metadata") or {},
                },
            )

        for item in data.get("artifacts", []):
            if not isinstance(item, dict) or not item.get("storage_key"):
                continue
            ExperimentArtifact.objects.update_or_create(
                run=run,
                storage_key=item["storage_key"],
                defaults={
                    "name": str(item.get("name", "Artifact"))[:255],
                    "kind": item.get("kind", "other"),
                    "mime_type": str(item.get("mime_type", ""))[:150],
                    "size_bytes": max(0, int(item.get("size_bytes", 0))),
                    "sha256": str(item.get("sha256", ""))[:64],
                    "metadata": item.get("metadata") or {},
                },
            )

        for item in data.get("logs", []):
            if not isinstance(item, dict) or not item.get("message"):
                continue
            sequence = int(item.get("sequence", 0))
            if sequence <= 0:
                sequence = (run.logs.order_by("-sequence").values_list(
                    "sequence", flat=True
                ).first() or 0) + 1
            ExperimentLog.objects.update_or_create(
                run=run,
                sequence=sequence,
                defaults={
                    "level": item.get("level", "info"),
                    "stage": str(item.get("stage", ""))[:100],
                    "message": str(item["message"])[:10000],
                    "metadata": item.get("metadata") or {},
                },
            )

    return JsonResponse({"ok": True, "status": run.status})


@csrf_exempt
@require_http_methods(["POST"])
def worker_health_endpoint(request):
    if not _authorized(request):
        return JsonResponse({"detail": "Not found."}, status=404)
    return JsonResponse({"ok": True, "service": "scir-worker"})
