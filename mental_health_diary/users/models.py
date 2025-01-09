from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class UserEmailAuth(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.email

class ProfilePic(models.Model):
    user = models.OneToOneField(UserEmailAuth, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='profile_pics', null=True, blank=True)