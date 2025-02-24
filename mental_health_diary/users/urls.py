from backend.urls import path
from users.views import LoginView, RegisterView, LogoutView, user_profile_data, change_password, check_if_authenticated

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user_data/', user_profile_data, name='user_profile_data'),
    path('change_password/', change_password, name='change_password'),
    path('is_authenticated/', check_if_authenticated, name='check_if_authenticated'),
]