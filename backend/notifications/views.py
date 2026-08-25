from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from datetime import datetime

from .models import Trigger, NotificationTemplate, NotificationLog, UserPushSubscription
from .serializers import (
    TriggerSerializer, NotificationTemplateSerializer, 
    NotificationLogSerializer, UserPushSubscriptionSerializer
)
from .services import NotificationDispatcher, WhatsAppService, PostmarkEmailService, WebPushService


class TriggerViewSet(viewsets.ModelViewSet):
    queryset = Trigger.objects.all().order_by('id')
    serializer_class = TriggerSerializer


class NotificationTemplateViewSet(viewsets.ModelViewSet):
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        template = self.get_object()
        template.is_active = not template.is_active
        template.save()
        return Response({
            'id': template.id,
            'channel': template.channel,
            'is_active': template.is_active,
            'message': f"Template {'enabled' if template.is_active else 'disabled'} successfully."
        })

    @action(detail=True, methods=['post'])
    def test_send(self, request, pk=None):
        template = self.get_object()
        recipient = request.data.get('recipient')
        user_name = request.data.get('user_name', 'Test User')
        
        context = {
            'user_name': user_name,
            'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'order_id': 'ORD-99823',
            'amount': '$49.99'
        }

        rendered_body = NotificationDispatcher.render_template(template.body, context)
        rendered_title = NotificationDispatcher.render_template(template.subject_or_title, context)

        if template.channel == 'whatsapp':
            target_phone = recipient or '+1234567890'
            res = WhatsAppService.send_message(target_phone, rendered_body)
            target = target_phone
        elif template.channel == 'email':
            target_email = recipient or 'testuser@example.com'
            res = PostmarkEmailService.send_email(target_email, rendered_title, rendered_body)
            target = target_email
        elif template.channel == 'web_push':
            res = WebPushService.send_push(rendered_title, rendered_body)
            target = 'Browser Push'
        else:
            return Response({'error': 'Invalid channel'}, status=status.HTTP_400_BAD_REQUEST)

        log = NotificationLog.objects.create(
            trigger_name=f"[TEST] {template.trigger.name}",
            channel=template.channel,
            recipient=str(target),
            status=res['status'],
            message_preview=rendered_body[:250],
            response_data=res.get('details', {})
        )

        return Response({
            'status': res['status'],
            'recipient': target,
            'rendered_title': rendered_title,
            'rendered_body': rendered_body,
            'details': res,
            'log_id': log.id
        })


class FireEventView(APIView):
    def post(self, request):
        trigger_key = request.data.get('trigger_key')
        if not trigger_key:
            return Response({'error': 'trigger_key is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            trigger = Trigger.objects.get(key=trigger_key)
        except Trigger.DoesNotExist:
            return Response({'error': f"Trigger with key '{trigger_key}' not found"}, status=status.HTTP_404_NOT_FOUND)

        recipient_info = request.data.get('recipient_info', {
            'email': 'alex@example.com',
            'phone': '+1987654321',
            'user_name': 'Alex Johnson'
        })
        
        context = request.data.get('context', {
            'user_name': recipient_info.get('user_name', 'Alex Johnson'),
            'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'order_id': 'ORD-10042',
            'amount': '$120.00'
        })

        results = NotificationDispatcher.dispatch_trigger(trigger, recipient_info, context)

        return Response({
            'message': f"Trigger '{trigger.name}' fired successfully.",
            'trigger_key': trigger.key,
            'dispatches': results
        })


class NotificationLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NotificationLog.objects.all().order_by('-created_at')
    serializer_class = NotificationLogSerializer


class PushSubscriptionView(APIView):
    def post(self, request):
        serializer = UserPushSubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Push subscription saved successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok', 'service': 'Notification System Backend', 'version': '1.0.0'})
