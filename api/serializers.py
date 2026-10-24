from rest_framework import serializers
from .models import B2BRequest

class B2BRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = B2BRequest
        fields = '__all__'
