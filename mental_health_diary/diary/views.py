from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Note, Mood, Emotion, Influence
from rest_framework import status

# Create your views here.
# get moods, emotions and influences to display at create note page
@api_view(['GET'])
def get_diary_data(request):
    moods = [{"id": mood.id, "name": mood.mood_name} for mood in Mood.objects.all()]
    
    emotions = [{"id": emotion.id, "name": emotion.emotion_name, "type": emotion.emotion_type, "icon": emotion.icon.url if emotion.icon else None} for emotion in Emotion.objects.all()]
    
    positive_emotions = [e for e in emotions if e["type"] == "Позитивные эмоции"]
    negative_emotions = [e for e in emotions if e["type"] == "Негативные эмоции"]
    energy = [e for e in emotions if e["type"] == "Энергия"]

    influences = [{ "id": influence.id, "name": influence.influence_name, "type": influence.influence_type, "icon": influence.icon.url if influence.icon else None} for influence in Influence.objects.all()]

    return Response({"moods": moods, "positive_emotions": positive_emotions, "negative_emotions": negative_emotions, "energy": energy, "influences": influences})

# save data from create note page in the db
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_note(request):
    user = request.user
    data = request.data

    try:
        date = data.get('date')  # YYYY-MM-DD
        time = data.get('time')  # HH:MM or None
        gotten_mood = data.get('mood')

        mood = Mood.objects.get(id=gotten_mood) if gotten_mood else None
        emotions = Emotion.objects.filter(id__in=data.get('emotions', []))
        influences = Influence.objects.filter(id__in=data.get('influences', []))

        # Create and save the note
        note = Note.objects.create(
            user=user,
            date=date,
            time=time,
            mood=mood,
            text_note=data.get('text_note', '')
        )

        note.emotions.set(emotions)
        note.influences.set(influences)
        note.save()

        return Response({'message': 'Note created successfully!'}, status=status.HTTP_201_CREATED)

    except Mood.DoesNotExist:
        return Response({'error': 'Invalid mood selected.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# get user notes to dispay them on notes page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_notes(request):
    user = request.user
    notes = (
        Note.objects.filter(user=user)
        .prefetch_related('emotions', 'influences', 'mood')
        .order_by('-date', 'time')  # Sorts by date descending, then time ascending
    )

    data = {}
    for note in notes:
        date_str = str(note.date)  # Already in YYYY-MM-DD format
        
        if date_str not in data:
            data[date_str] = []

        data[date_str].append({
            "id": note.id,
            "time": str(note.time)[:-3] if note.time else None,  # Time is already in HH:MM:SS format
            "mood": note.mood.mood_name if note.mood else None,
            "emotions": [{"name": emotion.emotion_name, "icon": emotion.icon.url} for emotion in note.emotions.all()],
            "influences": [{"name": influence.influence_name, "icon": influence.icon.url} for influence in note.influences.all()],
            "text_note": note.text_note,
        })

    return Response(data)

# delete a note from the db
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_note(request, note_id):
    print(note_id)
    note = Note.objects.get(id=note_id)
    note.delete()
    
    return Response({'message': 'Note deleted successfully!'}, status=status.HTTP_201_CREATED)

