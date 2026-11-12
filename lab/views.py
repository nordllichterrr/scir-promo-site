from django.http import JsonResponse


def health_check(request):
    return JsonResponse({
        "service": "scir-lab-api",
        "status": "ok",
        "version": "v1",
    })
