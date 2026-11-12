import json

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import Dataset, DatasetFold, Experiment, ExperimentArtifact, ExperimentRun


@override_settings(WORKER_API_TOKEN="test-worker-secret")
@override_settings(SECURE_SSL_REDIRECT=False)
class WorkerAPITests(TestCase):
    def setUp(self):
        user = get_user_model().objects.create_user(
            username="worker_test_user",
            password="test-password-123",
        )

        dataset = Dataset.objects.create(
            slug="worker-test",
            name="Worker Test Dataset",
        )

        fold = DatasetFold.objects.create(
            dataset=dataset,
            split_type="user_kfold",
            fold_index=0,
            split_seed=42,
        )

        experiment = Experiment.objects.create(
            owner=user,
            name="Worker API Test",
        )

        self.run = ExperimentRun.objects.create(
            experiment=experiment,
            dataset_fold=fold,
            status=ExperimentRun.Status.SUCCEEDED,
            progress=100,
        )

        self.url = reverse(
            "lab-worker-run",
            kwargs={"run_id": self.run.pk},
        )

    def worker_post(self, payload, token="test-worker-secret"):
        return self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_X_WORKER_TOKEN=token,
        )

    def test_worker_endpoint_rejects_missing_token(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 404)

    def test_worker_endpoint_rejects_invalid_token(self):
        response = self.client.get(
            self.url,
            HTTP_X_WORKER_TOKEN="invalid-token",
        )

        self.assertEqual(response.status_code, 404)

    def test_worker_endpoint_accepts_valid_token(self):
        response = self.client.get(
            self.url,
            HTTP_X_WORKER_TOKEN="test-worker-secret",
        )

        self.assertEqual(response.status_code, 200)

    def test_worker_rejects_invalid_json(self):
        response = self.client.generic(
            "POST",
            self.url,
            data=b"{invalid-json",
            content_type="application/json",
            HTTP_X_WORKER_TOKEN="test-worker-secret",
        )

        self.assertEqual(response.status_code, 400)

    def test_worker_cannot_change_terminal_run_status(self):
        response = self.worker_post({
            "status": "failed",
            "progress": 0,
            "error_code": "LATE_FAILURE",
            "error_message": "Late result",
        })

        self.assertEqual(response.status_code, 409)

        self.run.refresh_from_db()

        self.assertEqual(
            self.run.status,
            ExperimentRun.Status.SUCCEEDED,
        )
        self.assertEqual(self.run.progress, 100)

    def test_repeated_terminal_result_is_idempotent(self):
        response = self.worker_post({
            "status": "succeeded",
            "progress": 50,
            "metrics": [{
                "name": "ndcg_at_10",
                "value": 0.99,
            }],
            "logs": [{
                "sequence": 1,
                "message": "Late duplicate result",
            }],
        })

        self.assertEqual(response.status_code, 200)

        self.run.refresh_from_db()
        self.assertEqual(self.run.status, ExperimentRun.Status.SUCCEEDED)
        self.assertEqual(self.run.progress, 100)
        self.assertEqual(self.run.metrics.count(), 0)
        self.assertEqual(self.run.logs.count(), 0)

    def test_worker_rejects_non_object_json_payload(self):
        response = self.client.generic(
            "POST",
            self.url,
            data=b"[]",
            content_type="application/json",
            HTTP_X_WORKER_TOKEN="test-worker-secret",
        )

        self.assertEqual(response.status_code, 400)

    def test_worker_rejects_invalid_progress(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=['status'])
        response = self.worker_post({"status": "running", "progress": "abc"})
        self.assertEqual(response.status_code, 400)

    def test_worker_rejects_invalid_artifact_size(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=['status'])
        response = self.worker_post({
            "status": "running",
            "artifacts": [{
                "storage_key": "test/invalid-size",
                "size_bytes": "abc",
            }],
        })
        self.assertEqual(response.status_code, 400)

    def test_worker_rejects_invalid_log_sequence(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=['status'])
        response = self.worker_post({
            "status": "running",
            "logs": [{
                "sequence": "abc",
                "message": "Test log",
            }],
        })
        self.assertEqual(response.status_code, 400)

    def test_worker_rejects_numeric_boundary_violations(self):
        invalid_payloads = [
            {"status": "running", "progress": -1},
            {"status": "running", "progress": 101},
            {"status": "running", "progress": True},
            {"status": "running", "artifacts": [{
                "storage_key": "test/negative-size",
                "size_bytes": -1,
            }]},
            {"status": "running", "logs": [{
                "sequence": -1,
                "message": "Invalid sequence",
            }]},
            {"status": "running", "metrics": [{
                "name": "negative_sample_count",
                "sample_count": -1,
            }]},
            {"status": "running", "metrics": [{
                "name": "nan_metric",
                "value": float("nan"),
            }]},
            {"status": "running", "metrics": [{
                "name": "infinite_metric",
                "value": float("inf"),
            }]},
        ]

        for payload in invalid_payloads:
            with self.subTest(payload=payload):
                response = self.worker_post(payload)
                self.assertEqual(response.status_code, 400)

    def test_be04_rejects_malformed_worker_payloads(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=["status"])

        invalid_payloads = [
            {"status": []},
            {"status": {}},
            {"status": "running", "metrics": {}},
            {"status": "running", "artifacts": "not-an-array"},
            {"status": "running", "logs": None},
            {"status": "running", "metrics": ["not-an-object"]},
            {"status": "running", "artifacts": [None]},
            {"status": "running", "logs": [123]},
            {"status": "running", "metrics": [{"value": 0.5}]},
            {"status": "running", "artifacts": [{}]},
            {"status": "running", "logs": [{}]},
            {"status": "running", "metrics": [{
                "name": "bad_stage",
                "stage": "invalid",
            }]},
            {"status": "running", "metrics": [{
                "name": "bad_dimension",
                "dimension": "invalid",
            }]},
            {"status": "running", "artifacts": [{
                "storage_key": "test/invalid-kind",
                "kind": "invalid",
            }]},
            {"status": "running", "logs": [{
                "message": "bad level",
                "level": "invalid",
            }]},
        ]

        for payload in invalid_payloads:
            with self.subTest(payload=payload):
                response = self.worker_post(payload)
                self.assertEqual(response.status_code, 400)

        self.assertEqual(self.run.metrics.count(), 0)
        self.assertEqual(self.run.artifacts.count(), 0)
        self.assertEqual(self.run.logs.count(), 0)

    def test_be04_rejects_extremely_large_metric_number(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=["status"])

        response = self.worker_post({
            "status": "running",
            "metrics": [{
                "name": "overflow_metric",
                "value": 10 ** 1000,
            }],
        })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.run.metrics.count(), 0)

    def test_be04_rejects_collection_limit_violations(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=["status"])

        invalid_payloads = [
            {
                "status": "running",
                "metrics": [
                    {"name": f"metric_{i}"} for i in range(5001)
                ],
            },
            {
                "status": "running",
                "artifacts": [
                    {"storage_key": f"test/artifact_{i}"}
                    for i in range(21)
                ],
            },
            {
                "status": "running",
                "logs": [
                    {"message": f"log_{i}"} for i in range(101)
                ],
            },
        ]

        for payload in invalid_payloads:
            with self.subTest(field=next(
                key for key in ("metrics", "artifacts", "logs")
                if key in payload
            )):
                response = self.worker_post(payload)
                self.assertEqual(response.status_code, 400)

        self.assertEqual(self.run.metrics.count(), 0)
        self.assertEqual(self.run.artifacts.count(), 0)
        self.assertEqual(self.run.logs.count(), 0)

    def test_be04_rejects_oversized_request_body(self):
        body = b"x" * (5 * 1024 * 1024 + 1)

        response = self.client.generic(
            "POST",
            self.url,
            data=body,
            content_type="application/json",
            HTTP_X_WORKER_TOKEN="test-worker-secret",
        )

        self.assertEqual(response.status_code, 413)

    def test_be04_rejects_invalid_metadata_types(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=["status"])

        invalid_payloads = [
            {
                "status": "running",
                "metrics": [{
                    "name": "bad_metadata",
                    "metadata": [],
                }],
            },
            {
                "status": "running",
                "artifacts": [{
                    "storage_key": "test/bad-metadata",
                    "metadata": [],
                }],
            },
            {
                "status": "running",
                "logs": [{
                    "message": "bad metadata",
                    "metadata": [],
                }],
            },
            {
                "status": "running",
                "environment_snapshot": [],
            },
        ]

        for payload in invalid_payloads:
            with self.subTest(payload=payload):
                response = self.worker_post(payload)
                self.assertEqual(response.status_code, 400)

    def test_be05_rejects_unsafe_artifact_storage_keys(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=["status"])

        unsafe_keys = [
            "../escape",
            "/absolute/path",
            "folder//file",
            "folder/./file",
            "folder/../file",
            "folder\\file",
            "C:/temp/file",
        ]

        for storage_key in unsafe_keys:
            with self.subTest(storage_key=storage_key):
                response = self.worker_post({
                    "status": "running",
                    "artifacts": [{"storage_key": storage_key}],
                })
                self.assertEqual(response.status_code, 400)

        self.assertEqual(self.run.artifacts.count(), 0)

    def test_be05_rejects_artifact_owned_by_another_run(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.progress = 10
        self.run.save(update_fields=["status", "progress"])

        other_experiment = Experiment.objects.create(
            owner=self.run.experiment.owner,
            name="Other Worker API Test",
        )
        other_run = ExperimentRun.objects.create(
            experiment=other_experiment,
            dataset_fold=self.run.dataset_fold,
            status=ExperimentRun.Status.RUNNING,
            progress=25,
        )
        artifact = ExperimentArtifact.objects.create(
            run=other_run,
            name="Existing artifact",
            kind="other",
            storage_key="shared/results.json",
        )

        response = self.worker_post({
            "status": "running",
            "progress": 80,
            "artifacts": [{"storage_key": "shared/results.json"}],
        })

        self.assertEqual(response.status_code, 409)

        self.run.refresh_from_db()
        artifact.refresh_from_db()

        self.assertEqual(self.run.status, ExperimentRun.Status.RUNNING)
        self.assertEqual(self.run.progress, 10)
        self.assertEqual(artifact.run_id, other_run.pk)

    def test_be05_accepts_valid_artifact_storage_key(self):
        self.run.status = ExperimentRun.Status.RUNNING
        self.run.save(update_fields=["status"])

        response = self.worker_post({
            "status": "running",
            "artifacts": [{
                "storage_key": "results/fold_0/metrics.json",
                "name": "Metrics",
                "kind": "other",
            }],
        })

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            self.run.artifacts.filter(
                storage_key="results/fold_0/metrics.json"
            ).exists()
        )
