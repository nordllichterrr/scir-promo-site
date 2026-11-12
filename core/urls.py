from django.contrib import admin
from django.urls import include, path
from api.views import B2BRequestCreateView

urlpatterns = [
    path('api/lab/v1/', include('lab.urls')),
    path('admin/', admin.site.urls),
    path('api/b2b/', B2BRequestCreateView.as_view()),
]
