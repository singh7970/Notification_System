from django.db import models

class Trigger(models.Model):
    name = models.CharField(max_length=100)
    key = models.CharField(max_length=50, unique=True, help_text="Unique identifier like 'login', 'logout'")
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.key})"


class NotificationTemplate(models.Model):
    CHANNEL_CHOICES = [
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
        ('web_push', 'Web Push'),
    ]

    trigger = models.ForeignKey(Trigger, related_name='templates', on_delete=models.CASCADE)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    subject_or_title = models.CharField(max_length=200, blank=True, default='', help_text="Email Subject or Web Push Title")
    body = models.TextField(help_text="Message body with variables like {user_name}, {time}, {order_id}")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('trigger', 'channel')

    def __str__(self):
        return f"{self.trigger.name} - {self.get_channel_display()} ({'Active' if self.is_active else 'Inactive'})"


class NotificationLog(models.Model):
    STATUS_CHOICES = [
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('SANDBOX_SIMULATED', 'Sandbox Simulated'),
    ]

    trigger_name = models.CharField(max_length=100)
    channel = models.CharField(max_length=20)
    recipient = models.CharField(max_length=200)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES)
    message_preview = models.TextField(blank=True, default='')
    response_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M:%S')}] {self.trigger_name} | {self.channel} -> {self.recipient} ({self.status})"


class UserPushSubscription(models.Model):
    user_identifier = models.CharField(max_length=100, default='guest')
    endpoint = models.TextField(blank=True, default='')
    p256dh = models.TextField(blank=True, default='')
    auth = models.TextField(blank=True, default='')
    onesignal_player_id = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Push Subscription for {self.user_identifier}"
