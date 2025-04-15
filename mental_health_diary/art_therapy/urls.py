from django.urls import path
from art_therapy.views import get_lessons, get_lesson_data, toggle_favorite, toggle_completed

urlpatterns = [
    path('lessons/', get_lessons, name='get-lessons'),
    path('lessons/<int:lesson_id>/', get_lesson_data, name='lesson-data'),
    path('lessons/<int:lesson_id>/favorite/', toggle_favorite, name='toggle-favorite'),
    path('lessons/<int:lesson_id>/complete/', toggle_completed, name='mark-completed'),
]