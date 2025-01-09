from backend.urls import path
from .views import LoginView, RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register')
]
