import json

from django.test import TestCase, Client, override_settings
from django.contrib.auth.models import User
from axes.models import AccessAttempt


@override_settings(SECURE_SSL_REDIRECT=False)
class AxesLoginProtectionTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="axes_test_user",
            email="axes-test@example.com",
            password="A-Strong-Test-Password-2026!",
        )

    def test_repeated_invalid_passwords_trigger_lockout(self):
        statuses = []

        for _ in range(6):
            response = self.client.post(
                "/api/lab/v1/auth/login/",
                data={
                    "username": self.user.username,
                    "password": "Definitely-Wrong-Password!",
                },
                content_type="application/json",
            )
            statuses.append(response.status_code)

        self.assertEqual(statuses[:4], [401] * 4)
        self.assertEqual(statuses[4:], [429, 429])
        self.assertTrue(AccessAttempt.objects.exists())


@override_settings(SECURE_SSL_REDIRECT=False)
class RegistrationValidationTests(TestCase):
    url = "/api/lab/v1/auth/register/"

    def post_registration(self, payload):
        return self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )

    def valid_payload(self):
        return {
            "username": "new_registration_user",
            "email": "new-registration@example.com",
            "password": "Saffron!Orbit#72_Meadow",
            "password_confirm": "Saffron!Orbit#72_Meadow",
        }

    def test_rejects_weak_password(self):
        payload = self.valid_payload()
        payload["password"] = "password123456"
        payload["password_confirm"] = "password123456"

        response = self.post_registration(payload)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            User.objects.filter(username=payload["username"]).exists()
        )

    def test_rejects_non_string_registration_field(self):
        payload = self.valid_payload()
        payload["password"] = 123456789012

        response = self.post_registration(payload)

        self.assertEqual(response.status_code, 400)

    def test_rejects_password_confirmation_mismatch(self):
        payload = self.valid_payload()
        payload["password_confirm"] = "Different-Password-2026!"

        response = self.post_registration(payload)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            User.objects.filter(username=payload["username"]).exists()
        )

    def test_successful_registration_creates_authenticated_session(self):
        payload = self.valid_payload()

        response = self.post_registration(payload)

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            User.objects.filter(username=payload["username"]).exists()
        )
        self.assertIn("sessionid", response.cookies)
        self.assertEqual(
            self.client.get("/api/lab/v1/auth/me/").status_code,
            200,
        )


@override_settings(SECURE_SSL_REDIRECT=False)
class AuthSessionCsrfTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.user = User.objects.create_user(
            username="session_test_user",
            email="session-test@example.com",
            password="Strong-Session-Password-2026!",
        )

    def csrf_headers(self):
        response = self.client.get("/api/lab/v1/auth/csrf/")
        self.assertEqual(response.status_code, 200)
        token = response.cookies["csrftoken"].value
        return {"HTTP_X_CSRFTOKEN": token}

    def test_registration_rejects_missing_csrf_token(self):
        response = self.client.post(
            "/api/lab/v1/auth/register/",
            data=json.dumps({
                "username": "csrf_register_user",
                "email": "csrf-register@example.com",
                "password": "Strong-Register-Password-2026!",
                "password_confirm": "Strong-Register-Password-2026!",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)
        self.assertFalse(User.objects.filter(username="csrf_register_user").exists())

    def test_registration_accepts_valid_csrf_token(self):
        headers = self.csrf_headers()
        response = self.client.post(
            "/api/lab/v1/auth/register/",
            data=json.dumps({
                "username": "csrf_valid_register",
                "email": "csrf-valid-register@example.com",
                "password": "Strong-Register-Password-2026!",
                "password_confirm": "Strong-Register-Password-2026!",
            }),
            content_type="application/json",
            **headers,
        )
        self.assertEqual(response.status_code, 201)

    def test_login_rejects_missing_csrf_token(self):
        response = self.client.post(
            "/api/lab/v1/auth/login/",
            data=json.dumps({
                "username": self.user.username,
                "password": "Strong-Session-Password-2026!",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)

    def test_login_rotates_session_key(self):
        session = self.client.session
        session["pre_auth_marker"] = "present"
        session.save()
        old_session_key = session.session_key

        headers = self.csrf_headers()
        response = self.client.post(
            "/api/lab/v1/auth/login/",
            data=json.dumps({
                "username": self.user.username,
                "password": "Strong-Session-Password-2026!",
            }),
            content_type="application/json",
            **headers,
        )

        self.assertEqual(response.status_code, 200)
        new_session_key = self.client.session.session_key
        self.assertIsNotNone(new_session_key)
        self.assertNotEqual(old_session_key, new_session_key)
        self.assertEqual(
            self.client.get("/api/lab/v1/auth/me/").status_code,
            200,
        )

    def test_logout_rejects_missing_csrf_token(self):
        self.client.force_login(self.user)
        response = self.client.post("/api/lab/v1/auth/logout/")
        self.assertEqual(response.status_code, 403)

    def test_logout_flushes_session(self):
        self.client.force_login(self.user)
        headers = self.csrf_headers()

        response = self.client.post(
            "/api/lab/v1/auth/logout/",
            data=json.dumps({}),
            content_type="application/json",
            **headers,
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            self.client.get("/api/lab/v1/auth/me/").status_code,
            401,
        )


@override_settings(SECURE_SSL_REDIRECT=False)
class LoginInputValidationTests(TestCase):
    url = "/api/lab/v1/auth/login/"

    def test_rejects_non_string_username(self):
        for value in (None, 123, ["user"]):
            with self.subTest(value=value):
                response = self.client.post(
                    self.url,
                    data=json.dumps({
                        "username": value,
                        "password": "Some-Password-2026!",
                    }),
                    content_type="application/json",
                )
                self.assertEqual(response.status_code, 400)

    def test_rejects_non_string_password(self):
        for value in (None, 123, ["password"]):
            with self.subTest(value=value):
                response = self.client.post(
                    self.url,
                    data=json.dumps({
                        "username": "some_user",
                        "password": value,
                    }),
                    content_type="application/json",
                )
                self.assertEqual(response.status_code, 400)

    def test_rejects_blank_username(self):
        response = self.client.post(
            self.url,
            data=json.dumps({
                "username": "   ",
                "password": "Some-Password-2026!",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
