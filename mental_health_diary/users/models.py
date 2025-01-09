from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class UserEmailAuth(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'username'
    #REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
