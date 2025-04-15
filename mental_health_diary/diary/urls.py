from django.urls import path
from diary.views import get_diary_data, create_note, get_user_notes, delete_note

urlpatterns = [
    path('data/', get_diary_data, name='diary_data'),
    path('create_note/', create_note, name='create_note'),
    path('get_notes/', get_user_notes, name='get_user_notes'),
    path("delete_note/<int:note_id>/", delete_note, name="delete_note"),
]