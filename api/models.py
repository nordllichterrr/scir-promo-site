from django.db import models

class B2BRequest(models.Model):
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=150)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.company}"
