from django.utils import timezone
from celery import current_app


def enqueue_run(run):
    """Dispatch a persisted ExperimentRun to the independent SCIR worker."""
    run.status = run.Status.QUEUED
    run.queued_at = timezone.now()
    run.stage = "queued"
    run.error_code = ""
    run.error_message = ""
    run.save(update_fields=[
        "status", "queued_at", "stage", "error_code",
        "error_message", "updated_at",
    ])

    try:
        result = current_app.send_task(
            "scir_worker.tasks.execute_run",
            args=[str(run.pk)],
            queue="scir",
        )
    except Exception as exc:
        run.status = run.Status.FAILED
        run.stage = "queue_error"
        run.error_code = "QUEUE_UNAVAILABLE"
        run.error_message = (
            "The experiment could not be submitted to the worker queue. "
            "Check the Redis connection and worker configuration."
        )
        run.finished_at = timezone.now()
        run.save(update_fields=[
            "status", "stage", "error_code", "error_message",
            "finished_at", "updated_at",
        ])
        raise RuntimeError("SCIR task queue is unavailable") from exc

    run.celery_task_id = result.id
    run.save(update_fields=["celery_task_id", "updated_at"])
    return result.id
