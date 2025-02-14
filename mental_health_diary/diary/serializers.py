from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format=None)
    
    class Meta:
        model = Note
        fields = '__all__'