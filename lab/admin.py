from django.contrib import admin

from .models import (
    Dataset,
    DatasetFold,
    Experiment,
    ExperimentArtifact,
    ExperimentLog,
    ExperimentMetric,
    ExperimentRun,
)


class DatasetFoldInline(admin.TabularInline):
    model = DatasetFold
    extra = 0


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "version", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    inlines = [DatasetFoldInline]


@admin.register(DatasetFold)
class DatasetFoldAdmin(admin.ModelAdmin):
    list_display = (
        "dataset",
        "fold_index",
        "split_seed",
        "is_active",
        "test_users_count",
    )
    list_filter = ("dataset", "is_active")
    search_fields = ("dataset__name", "dataset__slug")


class ExperimentRunInline(admin.TabularInline):
    model = ExperimentRun
    extra = 0
    show_change_link = True
    fields = ("id", "status", "progress", "created_at")
    readonly_fields = fields


@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "is_archived", "created_at")
    list_filter = ("is_archived", "created_at")
    search_fields = ("name", "owner__username", "owner__email")
    inlines = [ExperimentRunInline]


@admin.register(ExperimentRun)
class ExperimentRunAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "experiment",
        "status",
        "progress",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "id",
        "experiment__name",
        "external_run_id",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
        "started_at",
        "finished_at",
    )


@admin.register(ExperimentMetric)
class ExperimentMetricAdmin(admin.ModelAdmin):
    list_display = (
        "run",
        "name",
        "stage",
        "dimension",
        "dimension_key",
        "value",
    )
    list_filter = ("stage", "dimension", "name")
    search_fields = ("name", "dimension_key")


@admin.register(ExperimentArtifact)
class ExperimentArtifactAdmin(admin.ModelAdmin):
    list_display = ("name", "run", "kind", "size_bytes", "created_at")
    list_filter = ("kind", "created_at")
    search_fields = ("name", "storage_key")


@admin.register(ExperimentLog)
class ExperimentLogAdmin(admin.ModelAdmin):
    list_display = ("run", "sequence", "level", "stage", "created_at")
    list_filter = ("level", "stage", "created_at")
    search_fields = ("message",)
