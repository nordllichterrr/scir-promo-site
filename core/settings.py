import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Берем секретный ключ из переменных окружения (на Railway мы его зададим)
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-dev-only-key')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

# Railway требует этот заголовок для SSL
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Должен быть выше CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Для статики на Railway
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# База данных: Railway передаст DATABASE_URL, локально будет SQLite
DATABASES = {
    'default': dj_database_url.config(default='sqlite:///db.sqlite3')
}

# CORS: разрешаем твой Vercel-домен (чтобы браузер не блокировал форму)
CORS_ALLOWED_ORIGINS = [
    "https://scir-promo-site-frontend-blue.vercel.app", # Твой текущий домен
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True

# CSRF: доверяем Vercel-домену
CSRF_TRUSTED_ORIGINS = [
    "https://scir-promo-site-frontend-blue.vercel.app",
    "http://localhost:3000",
]

# Статика (картинки, CSS)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
