import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Dataset(models.Model):
    """A dataset available in the SCIR Lab registry."""

    slug = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    version = models.CharField(max_length=50, default="1.0")
    source = models.CharField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["is_active", "slug"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.version})"


class DatasetFold(models.Model):
    """A predefined data split belonging to a registered dataset."""

    dataset = models.ForeignKey(
        Dataset,
        on_delete=models.PROTECT,
        related_name="folds",
    )
    split_type = models.CharField(
        max_length=32,
        default="standard",
        choices=[
            ("standard", "Standard"),
            ("user_kfold", "User K-Fold"),
            ("item_kfold", "Item K-Fold"),
            ("both_kfold", "Both K-Fold"),
        ],
    )
    fold_index = models.PositiveSmallIntegerField()
    split_seed = models.IntegerField(default=42)

    train_count = models.PositiveBigIntegerField(null=True, blank=True)
    validation_count = models.PositiveBigIntegerField(null=True, blank=True)
    test_count = models.PositiveBigIntegerField(null=True, blank=True)
    test_users_count = models.PositiveIntegerField(null=True, blank=True)
    test_targets_count = models.PositiveBigIntegerField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["dataset", "fold_index"]
        constraints = [
            models.UniqueConstraint(
                fields=["dataset", "split_type", "fold_index"],
                name="unique_dataset_split_fold",
            ),
        ]
        indexes = [
            models.Index(fields=["dataset", "is_active"]),
        ]

    def __str__(self):
        return f"{self.dataset.slug} / {self.split_type} / fold_{self.fold_index}"


class Experiment(models.Model):
    """A research experiment owned by a registered user."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="scir_experiments",
    )

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    draft_config = models.JSONField(default=dict, blank=True)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["owner", "-updated_at"]),
            models.Index(fields=["owner", "is_archived"]),
        ]

    def __str__(self):
        return self.name


class ExperimentRun(models.Model):
    """One execution of an experiment."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        QUEUED = "queued", "Queued"
        RUNNING = "running", "Running"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    experiment = models.ForeignKey(
        Experiment,
        on_delete=models.CASCADE,
        related_name="runs",
    )
    dataset_fold = models.ForeignKey(
        DatasetFold,
        on_delete=models.PROTECT,
        related_name="runs",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )
    progress = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    stage = models.CharField(max_length=100, blank=True)

    # Effective configuration used by the algorithm.
    config_snapshot = models.JSONField(default=dict, blank=True)
    environment_snapshot = models.JSONField(default=dict, blank=True)

    # Reproducibility information.
    dataset_version_snapshot = models.CharField(max_length=50, blank=True)
    fold_index_snapshot = models.PositiveSmallIntegerField(null=True, blank=True)
    algorithm_commit = models.CharField(max_length=100, blank=True)
    algorithm_version = models.CharField(max_length=100, blank=True)
    worker_version = models.CharField(max_length=100, blank=True)

    seed = models.IntegerField(default=42)
    split_seed = models.IntegerField(default=42)
    init_seed = models.IntegerField(default=42)
    n_users = models.PositiveIntegerField(null=True, blank=True)
    topk = models.PositiveIntegerField(
        default=10,
        validators=[MinValueValidator(1)],
    )

    # External execution identifiers.
    celery_task_id = models.CharField(
        max_length=255,
        blank=True,
        db_index=True,
    )
    external_run_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
    )

    error_code = models.CharField(max_length=100, blank=True)
    error_message = models.TextField(blank=True)

    cancel_requested_at = models.DateTimeField(null=True, blank=True)
    queued_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["experiment", "-created_at"]),
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["dataset_fold", "status"]),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(topk__gte=1),
                name="run_topk_gte_1",
            ),
        ]

    def __str__(self):
        return f"Run {self.id} ({self.status})"


class ExperimentMetric(models.Model):
    """An aggregated metric or diagnostic value for an experiment run."""

    class Stage(models.TextChoices):
        OVERALL = "overall", "Overall"
        PRE = "pre", "Before reranking"
        POST = "post", "After reranking"

    class Dimension(models.TextChoices):
        GLOBAL = "global", "Global"
        BUCKET = "bucket", "Interaction bucket"
        SCENARIO = "scenario", "Cold-start scenario"

    run = models.ForeignKey(
        ExperimentRun,
        on_delete=models.CASCADE,
        related_name="metrics",
    )

    name = models.CharField(max_length=150)
    stage = models.CharField(
        max_length=20,
        choices=Stage.choices,
        default=Stage.OVERALL,
    )
    dimension = models.CharField(
        max_length=20,
        choices=Dimension.choices,
        default=Dimension.GLOBAL,
    )
    dimension_key = models.CharField(max_length=100, blank=True, default="")

    value = models.FloatField(null=True, blank=True)
    std = models.FloatField(null=True, blank=True)
    ci95_low = models.FloatField(null=True, blank=True)
    ci95_high = models.FloatField(null=True, blank=True)
    sample_count = models.PositiveIntegerField(null=True, blank=True)

    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name", "stage", "dimension", "dimension_key"]
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "run",
                    "name",
                    "stage",
                    "dimension",
                    "dimension_key",
                ],
                name="unique_run_metric_dimension",
            ),
        ]
        indexes = [
            models.Index(fields=["run", "name"]),
            models.Index(fields=["name", "stage"]),
        ]

    def __str__(self):
        return f"{self.name} [{self.stage}]"


class ExperimentArtifact(models.Model):
    """A file produced during an experiment run."""

    class Kind(models.TextChoices):
        SUMMARY = "summary", "Summary"
        RESULTS = "results", "Recommendations"
        PER_USER = "per_user", "Per-user metrics"
        CANDIDATE_POOLS = "candidate_pools", "Candidate pools"
        CONFIG = "config", "Configuration"
        PLOT = "plot", "Plot"
        LOG = "log", "Log"
        OTHER = "other", "Other"

    run = models.ForeignKey(
        ExperimentRun,
        on_delete=models.CASCADE,
        related_name="artifacts",
    )

    name = models.CharField(max_length=255)
    kind = models.CharField(max_length=30, choices=Kind.choices)
    storage_key = models.CharField(max_length=500, unique=True)
    mime_type = models.CharField(max_length=150, blank=True)
    size_bytes = models.PositiveBigIntegerField(default=0)
    sha256 = models.CharField(max_length=64, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["run", "kind"]),
        ]

    def __str__(self):
        return self.name


class ExperimentLog(models.Model):
    """An ordered log entry produced during an experiment run."""

    class Level(models.TextChoices):
        DEBUG = "debug", "Debug"
        INFO = "info", "Info"
        WARNING = "warning", "Warning"
        ERROR = "error", "Error"
        CRITICAL = "critical", "Critical"

    run = models.ForeignKey(
        ExperimentRun,
        on_delete=models.CASCADE,
        related_name="logs",
    )

    sequence = models.PositiveIntegerField()
    level = models.CharField(
        max_length=20,
        choices=Level.choices,
        default=Level.INFO,
    )
    stage = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sequence"]
        constraints = [
            models.UniqueConstraint(
                fields=["run", "sequence"],
                name="unique_run_log_sequence",
            ),
        ]
        indexes = [
            models.Index(fields=["run", "created_at"]),
            models.Index(fields=["run", "level"]),
        ]

    def __str__(self):
        return f"{self.level.upper()}: {self.message[:80]}"
