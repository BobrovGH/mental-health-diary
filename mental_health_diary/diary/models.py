from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
User = get_user_model()

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField(blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True)
    mood = models.ForeignKey('Mood', on_delete=models.CASCADE, blank=True, null=True)
    emotions = models.ManyToManyField('Emotion', blank=True)
    influences = models.ManyToManyField('Influence', blank=True)
    text_note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} was {self.mood} on {self.added_on}"

class Mood(models.Model):
    mood_name = models.CharField(max_length=50)

    def __str__(self):
        return self.mood_name

class Emotion(models.Model):
    emotion_name = models.CharField(max_length=50)
    emotion_type = models.CharField(max_length=50)
    icon = models.ImageField(upload_to='mood_icons/')

    def __str__(self):
        return self.emotion_name

class Influence(models.Model):
    influence_name = models.CharField(max_length=50)
    icon = models.ImageField(upload_to='influence_icons/')

    def __str__(self):
        return self.influence_name