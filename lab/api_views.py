from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Dataset,
    DatasetFold,
    Experiment,
    ExperimentArtifact,
    ExperimentLog,
    ExperimentMetric,
    ExperimentRun,
)
from .serializers import (
    DatasetFoldSerializer,
    DatasetSerializer,
    ExperimentArtifactSerializer,
    ExperimentLogSerializer,
    ExperimentMetricSerializer,
    ExperimentRunCreateSerializer,
    ExperimentRunSerializer,
    ExperimentSerializer,
)


class AuthenticatedAPIView(APIView):
    permission_classes = [IsAuthenticated]


class DatasetListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DatasetSerializer

    def get_queryset(self):
        return Dataset.objects.filter(is_active=True).prefetch_related("folds")


class DatasetFoldListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DatasetFoldSerializer

    def get_queryset(self):
        dataset_id = self.kwargs["dataset_id"]

        dataset = get_object_or_404(
            Dataset,
            pk=dataset_id,
            is_active=True,
        )

        return DatasetFold.objects.filter(
            dataset=dataset,
            is_active=True,
        )


class ExperimentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExperimentSerializer

    def get_queryset(self):
        queryset = Experiment.objects.filter(
            owner=self.request.user,
        )

        archived = self.request.query_params.get("archived")

        if archived == "true":
            queryset = queryset.filter(is_archived=True)
        elif archived == "false":
            queryset = queryset.filter(is_archived=False)

        return queryset.prefetch_related("runs")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ExperimentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExperimentSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Experiment.objects.filter(
            owner=self.request.user,
        ).prefetch_related("runs")


class ExperimentRunListCreateView(AuthenticatedAPIView):
    def get_experiment(self):
        return get_object_or_404(
            Experiment,
            id=self.kwargs["experiment_id"],
            owner=self.request.user,
        )

    def get(self, request, *args, **kwargs):
        experiment = self.get_experiment()

        runs = ExperimentRun.objects.filter(
            experiment=experiment,
        ).select_related(
            "dataset_fold",
            "dataset_fold__dataset",
        )

        serializer = ExperimentRunSerializer(runs, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        experiment = self.get_experiment()

        serializer = ExperimentRunCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        fold = serializer.validated_data["dataset_fold"]

        run = serializer.save(
            experiment=experiment,
            status=ExperimentRun.Status.PENDING,
            dataset_version_snapshot=fold.dataset.version,
            fold_index_snapshot=fold.fold_index,
        )

        from .worker_dispatch import enqueue_run

        try:
            enqueue_run(run)
        except RuntimeError:
            run.refresh_from_db()
            return Response(
                {
                    "detail": run.error_message,
                    "run": ExperimentRunSerializer(run).data,
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        run.refresh_from_db()
        return Response(
            {
                "detail": "Run queued for SCIR worker execution.",
                "run": ExperimentRunSerializer(run).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ExperimentRunDetailView(AuthenticatedAPIView):
    def get(self, request, run_id):
        run = get_object_or_404(
            ExperimentRun.objects.select_related(
                "experiment",
                "dataset_fold",
                "dataset_fold__dataset",
            ),
            id=run_id,
            experiment__owner=request.user,
        )

        return Response(ExperimentRunSerializer(run).data)


class RunRelatedListView(AuthenticatedAPIView):
    related_name = None
    serializer_class = None

    def get(self, request, run_id):
        run = get_object_or_404(
            ExperimentRun,
            id=run_id,
            experiment__owner=request.user,
        )

        queryset = getattr(run, self.related_name).all()

        limit = request.query_params.get("limit", "200")
        try:
            limit = max(1, min(int(limit), 500))
        except (TypeError, ValueError):
            limit = 200

        queryset = queryset[:limit]

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class RunMetricListView(RunRelatedListView):
    related_name = "metrics"
    serializer_class = ExperimentMetricSerializer


class RunArtifactListView(RunRelatedListView):
    related_name = "artifacts"
    serializer_class = ExperimentArtifactSerializer


class RunLogListView(RunRelatedListView):
    related_name = "logs"
    serializer_class = ExperimentLogSerializer
