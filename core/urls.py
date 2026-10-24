from django.contrib import admin
from django.urls import path
from api.views import B2BRequestCreateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/b2b/', B2BRequestCreateView.as_view()),
]
