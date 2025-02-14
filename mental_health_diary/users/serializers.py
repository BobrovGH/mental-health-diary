from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ProfilePic

class UserProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ['username', 'first_name', 'last_name', 'email', 'date_joined', 'profile_pic']

    def get_profile_pic(self, obj):
        try:
            return obj.profilepic.profile_pic.url
        except ProfilePic.DoesNotExist:
            return None