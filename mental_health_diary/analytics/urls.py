from django.urls import path
from .views import note_frequency, mood_trends, emotion_analysis, oldest_note_date

urlpatterns = [
    path("note-frequency/", note_frequency, name="note-frequency"),
    path("mood-trends/", mood_trends, name="mood-trends"),
    path("emotion-analysis/", emotion_analysis, name="emotion-analysis"),
    path("oldest-note/", oldest_note_date, name='oldest-note'),
]