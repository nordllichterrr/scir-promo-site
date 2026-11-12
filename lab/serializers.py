import json

from rest_framework import serializers

from .models import (
    Dataset,
    DatasetFold,
    Experiment,
    ExperimentArtifact,
    ExperimentLog,
    ExperimentMetric,
    ExperimentRun,
)


class DatasetFoldSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetFold
        fields = [
            "id",
            "split_type",
            "fold_index",
            "split_seed",
            "train_count",
            "validation_count",
            "test_count",
            "test_users_count",
            "test_targets_count",
            "metadata",
        ]


class DatasetSerializer(serializers.ModelSerializer):
    folds_count = serializers.SerializerMethodField()

    class Meta:
        model = Dataset
        fields = [
            "id",
            "slug",
            "name",
            "description",
            "version",
            "source",
            "metadata",
            "folds_count",
            "created_at",
            "updated_at",
        ]

    def get_folds_count(self, obj):
        return obj.folds.filter(is_active=True).count()


class ExperimentSerializer(serializers.ModelSerializer):
    owner_id = serializers.IntegerField(read_only=True)
    runs_count = serializers.SerializerMethodField()

    class Meta:
        model = Experiment
        fields = [
            "id",
            "owner_id",
            "name",
            "description",
            "draft_config",
            "is_archived",
            "runs_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner_id",
            "runs_count",
            "created_at",
            "updated_at",
        ]

    def get_runs_count(self, obj):
        return obj.runs.count()


class ExperimentRunCreateSerializer(serializers.ModelSerializer):
    dataset_fold = serializers.PrimaryKeyRelatedField(
        queryset=DatasetFold.objects.filter(
            is_active=True,
            dataset__is_active=True,
        )
    )

    class Meta:
        model = ExperimentRun
        fields = [
            "id",
            "dataset_fold",
            "config_snapshot",
            "seed",
            "split_seed",
            "init_seed",
            "n_users",
            "topk",
        ]
        read_only_fields = ["id"]

    MAX_N_USERS = 500
    MAX_TOPK = 100
    MAX_CONFIG_BYTES = 64 * 1024

    def validate_topk(self, value):
        if value < 1 or value > self.MAX_TOPK:
            raise serializers.ValidationError(
                f"topk must be between 1 and {self.MAX_TOPK}."
            )
        return value

    def validate_n_users(self, value):
        if value is not None and not 1 <= value <= self.MAX_N_USERS:
            raise serializers.ValidationError(
                f"n_users must be between 1 and {self.MAX_N_USERS}."
            )
        return value

    def validate_config_snapshot(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                "config_snapshot must be a JSON object."
            )

        try:
            encoded = json.dumps(
                value,
                ensure_ascii=False,
                allow_nan=False,
                separators=(",", ":"),
            ).encode("utf-8")
        except (TypeError, ValueError, RecursionError):
            raise serializers.ValidationError(
                "config_snapshot must contain valid JSON values."
            )

        if len(encoded) > self.MAX_CONFIG_BYTES:
            raise serializers.ValidationError(
                "config_snapshot exceeds the 64 KiB limit."
            )

        return value


class ExperimentRunSerializer(serializers.ModelSerializer):
    dataset_name = serializers.CharField(
        source="dataset_fold.dataset.name",
        read_only=True,
    )
    dataset_slug = serializers.CharField(
        source="dataset_fold.dataset.slug",
        read_only=True,
    )
    fold_index = serializers.IntegerField(
        source="dataset_fold.fold_index",
        read_only=True,
    )

    class Meta:
        model = ExperimentRun
        fields = [
            "id",
            "experiment",
            "dataset_fold",
            "dataset_name",
            "dataset_slug",
            "fold_index",
            "status",
            "progress",
            "stage",
            "config_snapshot",
            "environment_snapshot",
            "dataset_version_snapshot",
            "fold_index_snapshot",
            "algorithm_commit",
            "algorithm_version",
            "worker_version",
            "seed",
            "split_seed",
            "init_seed",
            "n_users",
            "topk",
            "error_code",
            "error_message",
            "queued_at",
            "started_at",
            "finished_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class ExperimentMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperimentMetric
        fields = [
            "id",
            "name",
            "stage",
            "dimension",
            "dimension_key",
            "value",
            "std",
            "ci95_low",
            "ci95_high",
            "sample_count",
            "metadata",
            "created_at",
        ]


class ExperimentArtifactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperimentArtifact
        fields = [
            "id",
            "name",
            "kind",
            "mime_type",
            "size_bytes",
            "sha256",
            "metadata",
            "created_at",
        ]


class ExperimentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperimentLog
        fields = [
            "id",
            "sequence",
            "level",
            "stage",
            "message",
            "metadata",
            "created_at",
        ]
