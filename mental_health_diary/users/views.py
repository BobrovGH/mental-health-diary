from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser #for profile pic
from django.contrib.auth import get_user_model, authenticate
from .models import ProfilePic
from .serializers import UserProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from .utils import register_user


User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # Authenticate user using username and password
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError('Invalid username or password')

        attrs['user'] = user
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username  # Add username to the token
        return token

# Login view
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the refresh token from the request data
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            access_token = request.data.get('access_token')
            if access_token:
                pass

            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class RegisterView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser]

    def post(self, request):
        response = register_user(
            email=request.data.get('email'),
            username=request.data.get('username'),
            first_name=request.data.get('first_name', ''),
            last_name=request.data.get('last_name', ''),
            password=request.data.get('password'),
            profile_pic=request.FILES.get('profile_pic')
        )

        status_code = status.HTTP_201_CREATED if "message" in response else status.HTTP_400_BAD_REQUEST
        return Response(response, status=status_code)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_data(request):
    user = request.user
    serializer = UserProfileSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user  # Get the authenticated user
    data = request.data

    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    # Validate old password using check_password
    if not user.check_password(old_password):  # Use the method provided by Django's User model
        return Response({"error": "Неверный старый пароль"}, status=status.HTTP_400_BAD_REQUEST)

    # Validate new password confirmation
    if new_password != confirm_password:
        return Response({"error": "Новые пароли не совпадают"}, status=status.HTTP_400_BAD_REQUEST)

    # Update the password
    user.set_password(new_password)
    user.save()

    return Response({"success": "Пароль успешно изменен"}, status=status.HTTP_200_OK)
