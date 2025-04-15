from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Lesson(models.Model):
    title = models.CharField(max_length=255)
    cover = models.ImageField(upload_to='lesson_covers')
    description = models.TextField(blank=True, null=True)
    materials = models.TextField(blank=True, null=True)
    process = models.TextField(blank=True, null=True)
    recommendations = models.TextField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class UserLessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

    class Meta:
        unique_together = ('user', 'lesson')  # Prevents duplicate progress entries

class UserFavoriteLesson(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"

    class Meta:
        unique_together = ('user', 'lesson')  # Prevents duplicate favorites