from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Lesson, UserLessonProgress, UserFavoriteLesson
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lessons(request):
    lessons = [{
        "id": lesson.id,
        "title": lesson.title,
        "cover": request.build_absolute_uri(lesson.cover.url) if lesson.cover else None,
        "description": lesson.description,
        "is_favorite": UserFavoriteLesson.objects.filter(
            user=request.user,
            lesson=lesson
        ).exists(),
        "is_completed": UserLessonProgress.objects.filter(
            user=request.user,
            lesson=lesson
        ).exists()
    } for lesson in Lesson.objects.all()]
    return Response({"lessons": lessons})

@api_view(['GET'])
def get_lesson_data(request, lesson_id):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        data = {
            "id": lesson.id,
            "title": lesson.title,
            "cover": request.build_absolute_uri(lesson.cover.url) if lesson.cover else None,
            "description": lesson.description,
            "materials": lesson.materials,
            "process": lesson.process,
            "recommendations": lesson.recommendations,
            "comments": lesson.comments
        }
        return Response(data)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    favorite, created = UserFavoriteLesson.objects.get_or_create(
        user=request.user,
        lesson=lesson
    )
    
    if not created:
        favorite.delete()
        return Response({'status': 'removed', 'is_favorite': False})
    
    return Response({'status': 'added', 'is_favorite': True})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_completed(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    progress, created = UserLessonProgress.objects.get_or_create(
        user=request.user,
        lesson=lesson,
        defaults={'is_completed': True, 'completed_at': timezone.now()}
    )
    
    if not created:
        progress.delete()
        return Response({'status': 'removed', 'is_completed': False})
    
    return Response({'status': 'added', 'is_completed': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_lessons(request):
    lessons = Lesson.objects.all()
    response_data = []
    
    for lesson in lessons:
        is_favorite = UserFavoriteLesson.objects.filter(
            user=request.user,
            lesson=lesson
        ).exists()
        
        progress = UserLessonProgress.objects.filter(
            user=request.user,
            lesson=lesson
        ).first()
        
        response_data.append({
            **LessonSerializer(lesson).data,
            'is_favorite': is_favorite,
            'is_completed': progress.is_completed if progress else False
        })
    
    return Response({'lessons': response_data})