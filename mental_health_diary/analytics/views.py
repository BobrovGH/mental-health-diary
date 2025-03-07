from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from diary.models import Note
from django.db.models import Count
from .serializers import NoteFrequencySerializer, CountEmotionsSerializer

# apply two dates from request as period for db query  
def filter_by_user_and_period(request, model_data):
    user_id = request.user.id
    start_date = request.GET.get("startDate", "2025-01-01")
    end_date = request.GET.get("endDate", "2025-01-01") 
    return model_data.filter(user_id=user_id, date__range=[start_date, end_date])

# get user's oldest note
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def oldest_note_date(request):
    user_id = request.user.id
    oldest_note = Note.objects.filter(user_id=user_id).order_by("date").values_list("date", flat=True).first()
    print(oldest_note)
    return Response({"oldestNoteDate": str(oldest_note) if oldest_note else ""})

# get frequency of users' notes
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def note_frequency(request):
    notes = filter_by_user_and_period(request, Note.objects)
    data = notes.values("date").annotate(count=Count("id")).order_by("date")

    serializer = NoteFrequencySerializer(data, many=True)
    return Response({"data": serializer.data})

# get mood and energy trends of users' notes
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mood_trends(request):
    notes = filter_by_user_and_period(request, Note.objects)

    mood_data = notes.values("mood__mood_name", "mood__color").annotate(count=Count("id")).order_by("mood_id")
    energy_data = notes.filter(emotions__emotion_type="Энергия").values("emotions__emotion_name", "emotions__color").annotate(count=Count("id")).order_by("emotions__id")

    return Response({
        "moodTrends": list(mood_data),  
        "energyTrends": list(energy_data)
    })

# get frequency of emotions in users' notes
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def emotion_analysis(request):
    emotion_type = request.GET.get("type")
    notes = filter_by_user_and_period(request, Note.objects.filter(emotions__emotion_type=emotion_type))

    emotion_data = notes.values("emotions__emotion_name", "emotions__color").annotate(count=Count("id")).order_by("-count")

    serializer = CountEmotionsSerializer(emotion_data, many=True)
    return Response({"data": serializer.data})