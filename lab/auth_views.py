import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError, transaction
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST


logger = logging.getLogger(__name__)


def parse_json(request):
    try:
        data = json.loads(request.body or b"{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None

    return data if isinstance(data, dict) else None


def user_payload(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }


@require_GET
@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({
        "csrfToken": get_token(request),
    })


@require_POST
@csrf_protect
def register_view(request):
    data = parse_json(request)

    if data is None:
        return JsonResponse(
            {"detail": "A valid JSON object is required."},
            status=400,
        )

    username_value = data.get("username", "")
    email_value = data.get("email", "")
    password = data.get("password", "")
    password_confirm = data.get("password_confirm", "")

    if not all(isinstance(value, str) for value in (
        username_value, email_value, password, password_confirm
    )):
        return JsonResponse(
            {"detail": "All registration fields must be strings."},
            status=400,
        )

    username = username_value.strip()
    email = email_value.strip().lower()

    if not username or not email or not password:
        return JsonResponse(
            {"detail": "Username, email and password are required."},
            status=400,
        )

    if len(username) > 150:
        return JsonResponse(
            {"detail": "Username must not exceed 150 characters."},
            status=400,
        )

    if password != password_confirm:
        return JsonResponse(
            {"detail": "Passwords do not match."},
            status=400,
        )

    candidate_user = User(username=username, email=email)
    try:
        validate_password(password, user=candidate_user)
    except ValidationError as exc:
        return JsonResponse(
            {"detail": "Password validation failed.", "errors": exc.messages},
            status=400,
        )

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse(
            {"detail": "Enter a valid email address."},
            status=400,
        )

    if User.objects.filter(username__iexact=username).exists():
        return JsonResponse(
            {"detail": "This username is already taken."},
            status=409,
        )

    if User.objects.filter(email__iexact=email).exists():
        return JsonResponse(
            {"detail": "This email is already registered."},
            status=409,
        )

    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
            )
    except IntegrityError:
        return JsonResponse(
            {"detail": "This username or email is already registered."},
            status=409,
        )

    login(request, user, backend="django.contrib.auth.backends.ModelBackend")

    return JsonResponse(
        {
            "user": user_payload(user),
            "detail": "Registration successful.",
        },
        status=201,
    )


@require_POST
@csrf_protect
def login_view(request):
    data = parse_json(request)

    if data is None:
        return JsonResponse(
            {"detail": "A valid JSON object is required."},
            status=400,
        )

    username_value = data.get("username", "")
    password = data.get("password", "")

    if not isinstance(username_value, str) or not isinstance(password, str):
        return JsonResponse(
            {"detail": "Username and password must be strings."},
            status=400,
        )

    username = username_value.strip()
    if not username or not password:
        return JsonResponse(
            {"detail": "Username and password are required."},
            status=400,
        )

    try:
        user = authenticate(
            request,
            username=username,
            password=password,
        )

        if user is None:
            return JsonResponse(
                {"detail": "Invalid username or password."},
                status=401,
            )

        login(request, user)

        return JsonResponse({
            "user": user_payload(user),
            "detail": "Login successful.",
        })
    except Exception:
        logger.exception("SCIR_LAB_LOGIN_FAILED")
        raise


@require_POST
@csrf_protect
def logout_view(request):
    logout(request)

    return JsonResponse({
        "detail": "Logout successful.",
    })


@require_GET
def me_view(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {"authenticated": False},
            status=401,
        )

    return JsonResponse({
        "authenticated": True,
        "user": user_payload(request.user),
    })
