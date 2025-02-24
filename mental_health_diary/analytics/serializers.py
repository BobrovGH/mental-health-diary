from rest_framework import serializers

# Count number of notes for dates
class NoteFrequencySerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()

# Count number of each emotion
class CountEmotionsSerializer(serializers.Serializer):
    emotion_name = serializers.CharField(source="emotions__emotion_name")
    emotion_color = serializers.CharField(source="emotions__color")
    count = serializers.IntegerField()