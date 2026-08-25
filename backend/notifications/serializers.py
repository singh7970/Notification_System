from rest_framework import serializers
from .models import Trigger, NotificationTemplate, NotificationLog, UserPushSubscription

class NotificationTemplateSerializer(serializers.ModelSerializer):
    channel_display = serializers.CharField(source='get_channel_display', read_only=True)

    class Meta:
        model = NotificationTemplate
        fields = ['id', 'trigger', 'channel', 'channel_display', 'subject_or_title', 'body', 'is_active', 'updated_at']


class TriggerSerializer(serializers.ModelSerializer):
    templates = NotificationTemplateSerializer(many=True, read_only=True)

    class Meta:
        model = Trigger
        fields = ['id', 'name', 'key', 'description', 'templates', 'created_at', 'updated_at']


class NotificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationLog
        fields = '__all__'


class UserPushSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPushSubscription
        fields = '__all__'


class TestSendSerializer(serializers.Serializer):
    recipient = serializers.CharField(required=False, default='test@example.com')
    subject_or_title = serializers.CharField(required=False, default='')
    body = serializers.CharField(required=False, default='')
