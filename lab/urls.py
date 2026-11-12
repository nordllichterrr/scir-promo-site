from django.urls import path

from .auth_views import (
    csrf_token_view,
    login_view,
    logout_view,
    me_view,
    register_view,
)
from .api_views import (
    DatasetFoldListView,
    DatasetListView,
    ExperimentDetailView,
    ExperimentListCreateView,
    ExperimentRunDetailView,
    ExperimentRunListCreateView,
    RunArtifactListView,
    RunLogListView,
    RunMetricListView,
)
from .views import health_check
from .worker_api_views import worker_run_endpoint, worker_health_endpoint


urlpatterns = [
    # Internal worker API (requires X-Worker-Token)
    path("internal/worker/health/", worker_health_endpoint, name="lab-worker-health"),
    path("internal/worker/runs/<uuid:run_id>/", worker_run_endpoint, name="lab-worker-run"),

    # Health
    path("health/", health_check, name="lab-health"),

    # Authentication
    path("auth/csrf/", csrf_token_view, name="lab-auth-csrf"),
    path("auth/register/", register_view, name="lab-auth-register"),
    path("auth/login/", login_view, name="lab-auth-login"),
    path("auth/logout/", logout_view, name="lab-auth-logout"),
    path("auth/me/", me_view, name="lab-auth-me"),

    # Dataset registry
    path("datasets/", DatasetListView.as_view(), name="lab-datasets"),
    path(
        "datasets/<int:dataset_id>/folds/",
        DatasetFoldListView.as_view(),
        name="lab-dataset-folds",
    ),

    # Experiments
    path(
        "experiments/",
        ExperimentListCreateView.as_view(),
        name="lab-experiments",
    ),
    path(
        "experiments/<uuid:id>/",
        ExperimentDetailView.as_view(),
        name="lab-experiment-detail",
    ),

    # Runs
    path(
        "experiments/<uuid:experiment_id>/runs/",
        ExperimentRunListCreateView.as_view(),
        name="lab-experiment-runs",
    ),
    path(
        "runs/<uuid:run_id>/",
        ExperimentRunDetailView.as_view(),
        name="lab-run-detail",
    ),
    path(
        "runs/<uuid:run_id>/metrics/",
        RunMetricListView.as_view(),
        name="lab-run-metrics",
    ),
    path(
        "runs/<uuid:run_id>/artifacts/",
        RunArtifactListView.as_view(),
        name="lab-run-artifacts",
    ),
    path(
        "runs/<uuid:run_id>/logs/",
        RunLogListView.as_view(),
        name="lab-run-logs",
    ),
]
