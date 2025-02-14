from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
User = get_user_model()

class ProfilePic(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='profile_pics', null=True, blank=True)