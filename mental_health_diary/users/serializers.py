from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ProfilePic

class UserProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ['username', 'first_name', 'last_name', 'email', 'date_joined', 'profile_pic']

    def get_profile_pic(self, obj):
        request = self.context.get('request')
        try:
            if obj.profilepic.profile_pic:
                url = obj.profilepic.profile_pic.url
                return request.build_absolute_uri(url) if request else url
        except ProfilePic.DoesNotExist:
            return None
        return None