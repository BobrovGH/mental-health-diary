from django.contrib.auth import get_user_model, authenticate
from .models import ProfilePic

User = get_user_model()

def register_user(email, username, first_name, last_name, password, profile_pic=None):
    if User.objects.filter(email=email).exists():
        return {"error": "Email already exists."}
    
    user = User.objects.create_user(
        email=email,
        username=username,
        first_name=first_name,
        last_name=last_name,
        password=password
    )
    
    if profile_pic:
        ProfilePic.objects.create(user=user, profile_pic=profile_pic)

    return {"message": "User registered successfully."}

def login_user(username, password):
    user = authenticate(username=username, password=password)
    if not user:
        return {"error": "Invalid username or password"}
    return user