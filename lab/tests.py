from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.test import override_settings

from .serializers import ExperimentRunCreateSerializer

from .models import (
    Dataset,
    DatasetFold,
    Experiment,
    ExperimentArtifact,
    ExperimentLog,
    ExperimentMetric,
    ExperimentRun,
)


User = get_user_model()


@override_settings(SECURE_SSL_REDIRECT=False)
class LabAPIAccessTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="researcher_a",
            email="a@example.com",
            password="test-password-a-123",
        )
        self.user_b = User.objects.create_user(
            username="researcher_b",
            email="b@example.com",
            password="test-password-b-123",
        )

        self.dataset = Dataset.objects.create(
            slug="test-serendipity",
            name="Test Serendipity",
        )
        self.fold = DatasetFold.objects.create(
            dataset=self.dataset,
            split_type="user_kfold",
            fold_index=0,
            split_seed=42,
        )

        self.experiment_a = Experiment.objects.create(
            owner=self.user_a,
            name="Experiment A",
            draft_config={"seed": 42},
        )
        self.experiment_b = Experiment.objects.create(
            owner=self.user_b,
            name="Experiment B",
            draft_config={"seed": 7},
        )

        self.run_b = ExperimentRun.objects.create(
            experiment=self.experiment_b,
            dataset_fold=self.fold,
            status=ExperimentRun.Status.SUCCEEDED,
            config_snapshot={"test": True},
        )

        self.metric_b = ExperimentMetric.objects.create(
            run=self.run_b,
            name="ndcg_at_10",
            value=0.75,
        )
        self.artifact_b = ExperimentArtifact.objects.create(
            run=self.run_b,
            name="summary.json",
            kind=ExperimentArtifact.Kind.SUMMARY,
            storage_key="test/summary.json",
        )
        self.log_b = ExperimentLog.objects.create(
            run=self.run_b,
            sequence=1,
            level=ExperimentLog.Level.INFO,
            message="Test log entry",
        )

        self.experiments_url = reverse("lab-experiments")
        self.experiment_a_url = reverse(
            "lab-experiment-detail",
            kwargs={"id": self.experiment_a.id},
        )
        self.experiment_b_url = reverse(
            "lab-experiment-detail",
            kwargs={"id": self.experiment_b.id},
        )
        self.run_list_b_url = reverse(
            "lab-experiment-runs",
            kwargs={"experiment_id": self.experiment_b.id},
        )
        self.run_b_url = reverse(
            "lab-run-detail",
            kwargs={"run_id": self.run_b.id},
        )

    def authenticate_as(self, user):
        self.client.force_authenticate(user=user)

    def test_unauthenticated_user_cannot_access_lab_api(self):
        urls = [
            self.experiments_url,
            reverse("lab-datasets"),
            self.experiment_a_url,
            self.run_list_b_url,
            self.run_b_url,
        ]

        for url in urls:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertIn(
                    response.status_code,
                    (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
                )

    def test_user_sees_only_own_experiments(self):
        self.authenticate_as(self.user_a)

        response = self.client.get(self.experiments_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        returned_ids = {item["id"] for item in response.data}

        self.assertIn(str(self.experiment_a.id), returned_ids)
        self.assertNotIn(str(self.experiment_b.id), returned_ids)

    def test_user_cannot_read_another_users_experiment(self):
        self.authenticate_as(self.user_a)

        response = self.client.get(self.experiment_b_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_modify_another_users_experiment(self):
        self.authenticate_as(self.user_a)

        response = self.client.patch(
            self.experiment_b_url,
            {"name": "Unauthorized modification"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.experiment_b.refresh_from_db()
        self.assertEqual(self.experiment_b.name, "Experiment B")

    def test_user_cannot_delete_another_users_experiment(self):
        self.authenticate_as(self.user_a)

        response = self.client.delete(self.experiment_b_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(
            Experiment.objects.filter(id=self.experiment_b.id).exists()
        )

    def test_user_can_update_own_draft_configuration(self):
        self.authenticate_as(self.user_a)

        response = self.client.patch(
            self.experiment_a_url,
            {"draft_config": {"seed": 123, "dataset_id": self.dataset.id}},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.experiment_a.refresh_from_db()
        self.assertEqual(self.experiment_a.draft_config["seed"], 123)
        self.assertEqual(
            self.experiment_a.draft_config["dataset_id"],
            self.dataset.id,
        )

    def test_user_can_create_own_experiment(self):
        self.authenticate_as(self.user_a)

        response = self.client.post(
            self.experiments_url,
            {
                "name": "New API Experiment",
                "description": "Created in an API test",
                "draft_config": {"seed": 99},
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        created = Experiment.objects.get(id=response.data["id"])
        self.assertEqual(created.owner, self.user_a)

    def test_user_cannot_list_another_users_runs(self):
        self.authenticate_as(self.user_a)

        response = self.client.get(self.run_list_b_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_read_another_users_run(self):
        self.authenticate_as(self.user_a)

        response = self.client.get(self.run_b_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_read_another_users_run_related_data(self):
        self.authenticate_as(self.user_a)

        urls = [
            reverse("lab-run-metrics", kwargs={"run_id": self.run_b.id}),
            reverse("lab-run-artifacts", kwargs={"run_id": self.run_b.id}),
            reverse("lab-run-logs", kwargs={"run_id": self.run_b.id}),
        ]

        for url in urls:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertEqual(
                    response.status_code,
                    status.HTTP_404_NOT_FOUND,
                )

    def test_user_can_access_own_run_and_related_data(self):
        self.authenticate_as(self.user_a)

        own_run = ExperimentRun.objects.create(
            experiment=self.experiment_a,
            dataset_fold=self.fold,
            status=ExperimentRun.Status.SUCCEEDED,
            config_snapshot={"test": True},
        )

        ExperimentMetric.objects.create(
            run=own_run,
            name="ndcg_at_10",
            value=0.85,
        )
        ExperimentArtifact.objects.create(
            run=own_run,
            name="own-summary.json",
            kind=ExperimentArtifact.Kind.SUMMARY,
            storage_key="test/own-summary.json",
        )
        ExperimentLog.objects.create(
            run=own_run,
            sequence=1,
            level=ExperimentLog.Level.INFO,
            message="Own test log",
        )

        urls = [
            reverse("lab-run-detail", kwargs={"run_id": own_run.id}),
            reverse("lab-run-metrics", kwargs={"run_id": own_run.id}),
            reverse("lab-run-artifacts", kwargs={"run_id": own_run.id}),
            reverse("lab-run-logs", kwargs={"run_id": own_run.id}),
        ]

        for url in urls:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertEqual(response.status_code, status.HTTP_200_OK)


@override_settings(SECURE_SSL_REDIRECT=False)
class ExperimentRunResourceLimitTests(APITestCase):
    def setUp(self):
        self.dataset = Dataset.objects.create(
            slug="resource-limit-test",
            name="Resource Limit Test",
        )
        self.fold = DatasetFold.objects.create(
            dataset=self.dataset,
            split_type="user_kfold",
            fold_index=0,
            split_seed=42,
        )

    def make_serializer(self, **overrides):
        data = {
            "dataset_fold": self.fold.pk,
            "config_snapshot": {"seed": 42},
            "seed": 42,
            "split_seed": 42,
            "init_seed": 42,
            "n_users": 500,
            "topk": 20,
        }
        data.update(overrides)
        return ExperimentRunCreateSerializer(data=data)

    def test_accepts_resource_limit_boundaries(self):
        serializer = self.make_serializer(n_users=500, topk=100)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_accepts_null_n_users(self):
        serializer = self.make_serializer(n_users=None)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_rejects_n_users_above_limit(self):
        serializer = self.make_serializer(n_users=501)
        self.assertFalse(serializer.is_valid())
        self.assertIn("n_users", serializer.errors)

    def test_rejects_zero_n_users(self):
        serializer = self.make_serializer(n_users=0)
        self.assertFalse(serializer.is_valid())
        self.assertIn("n_users", serializer.errors)

    def test_rejects_topk_above_limit(self):
        serializer = self.make_serializer(topk=101)
        self.assertFalse(serializer.is_valid())
        self.assertIn("topk", serializer.errors)

    def test_rejects_zero_topk(self):
        serializer = self.make_serializer(topk=0)
        self.assertFalse(serializer.is_valid())
        self.assertIn("topk", serializer.errors)

    def test_rejects_non_object_config_snapshot(self):
        serializer = self.make_serializer(config_snapshot=["invalid"])
        self.assertFalse(serializer.is_valid())
        self.assertIn("config_snapshot", serializer.errors)

    def test_rejects_oversized_config_snapshot(self):
        serializer = self.make_serializer(
            config_snapshot={"payload": "x" * (64 * 1024)}
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("config_snapshot", serializer.errors)

    def test_rejects_non_finite_config_values(self):
        serializer = self.make_serializer(
            config_snapshot={"score": float("nan")}
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("config_snapshot", serializer.errors)


@override_settings(SECURE_SSL_REDIRECT=False)
class ExperimentRunResourceLimitAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="resource_api_user",
            password="test-password-123",
        )
        self.dataset = Dataset.objects.create(
            slug="resource-api-test",
            name="Resource API Test",
        )
        self.fold = DatasetFold.objects.create(
            dataset=self.dataset,
            split_type="user_kfold",
            fold_index=0,
            split_seed=42,
        )
        self.experiment = Experiment.objects.create(
            owner=self.user,
            name="Resource API Experiment",
            draft_config={"seed": 42},
        )
        self.url = reverse(
            "lab-experiment-runs",
            kwargs={"experiment_id": self.experiment.id},
        )
        self.client.force_authenticate(user=self.user)
        self.payload = {
            "dataset_fold": self.fold.pk,
            "config_snapshot": {"seed": 42},
            "seed": 42,
            "split_seed": 42,
            "init_seed": 42,
            "n_users": 500,
            "topk": 100,
        }

    def test_api_rejects_resource_limit_violations_without_creating_run(self):
        invalid_payloads = [
            {"n_users": 501},
            {"topk": 101},
            {"config_snapshot": ["not", "an", "object"]},
            {"config_snapshot": {"payload": "x" * (64 * 1024)}},
        ]

        for overrides in invalid_payloads:
            with self.subTest(overrides=list(overrides)):
                payload = {**self.payload, **overrides}
                response = self.client.post(
                    self.url,
                    payload,
                    format="json",
                )
                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST,
                )

        self.assertEqual(
            ExperimentRun.objects.filter(experiment=self.experiment).count(),
            0,
        )

    @patch("lab.worker_dispatch.enqueue_run")
    def test_api_accepts_resource_limit_boundaries(self, enqueue_mock):
        enqueue_mock.return_value = "test-celery-task-id"

        response = self.client.post(
            self.url,
            self.payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.data,
        )
        self.assertEqual(
            ExperimentRun.objects.filter(experiment=self.experiment).count(),
            1,
        )
        enqueue_mock.assert_called_once()
