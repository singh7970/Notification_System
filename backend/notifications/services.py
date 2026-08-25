import requests
from django.conf import settings
from .models import NotificationTemplate, NotificationLog, UserPushSubscription

class WhatsAppService:
    @staticmethod
    def send_message(recipient_phone, message):
        token = settings.WHATSAPP_ACCESS_TOKEN
        phone_id = settings.PHONE_NUMBER_ID

        if not token or not phone_id or token.startswith('your_'):
            # Sandbox Simulation
            return {
                'status': 'SANDBOX_SIMULATED',
                'details': 'WhatsApp Sandbox Token or Phone ID not set in .env. Message simulated successfully.',
                'simulated_payload': {'recipient': recipient_phone, 'message': message}
            }

        url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": recipient_phone,
            "type": "text",
            "text": {"body": message}
        }

        try:
            res = requests.post(url, json=payload, headers=headers, timeout=10)
            if res.status_code in [200, 201]:
                return {'status': 'SUCCESS', 'details': res.json()}
            else:
                return {'status': 'FAILED', 'details': res.json(), 'error_code': res.status_code}
        except Exception as e:
            return {'status': 'FAILED', 'details': str(e)}


class PostmarkEmailService:
    @staticmethod
    def send_email(to_email, subject, body):
        token = settings.POSTMARKAPP_TOKEN
        from_email = settings.POSTMARK_FROM_EMAIL

        if not token or token.startswith('your_'):
            return {
                'status': 'SANDBOX_SIMULATED',
                'details': 'Postmark Server Token not set in .env. Email simulated successfully.',
                'simulated_payload': {'to': to_email, 'subject': subject, 'body': body}
            }

        url = "https://api.postmarkapp.com/email"
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Postmark-Server-Token": token
        }
        payload = {
            "From": from_email,
            "To": to_email,
            "Subject": subject or "Notification",
            "TextBody": body,
            "HtmlBody": f"<div>{body}</div>"
        }

        try:
            res = requests.post(url, json=payload, headers=headers, timeout=10)
            if res.status_code == 200:
                return {'status': 'SUCCESS', 'details': res.json()}
            else:
                return {'status': 'FAILED', 'details': res.json(), 'error_code': res.status_code}
        except Exception as e:
            return {'status': 'FAILED', 'details': str(e)}


class WebPushService:
    @staticmethod
    def send_push(title, body, player_id=None):
        app_id = settings.ONESIGNAL_APP_ID
        rest_api_key = settings.ONESIGNAL_REST_API_KEY

        if not app_id or not rest_api_key or app_id.startswith('your_'):
            return {
                'status': 'SANDBOX_SIMULATED',
                'details': 'OneSignal App ID or REST API Key not configured. Push notification simulated.',
                'simulated_payload': {'title': title, 'body': body}
            }

        url = "https://onesignal.com/api/v1/notifications"
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": f"Basic {rest_api_key}"
        }
        payload = {
            "app_id": app_id,
            "headings": {"en": title or "Web Push Alert"},
            "contents": {"en": body},
        }

        if player_id:
            payload["include_player_ids"] = [player_id]
        else:
            payload["included_segments"] = ["Subscribed Users"]

        try:
            res = requests.post(url, json=payload, headers=headers, timeout=10)
            if res.status_code == 200:
                return {'status': 'SUCCESS', 'details': res.json()}
            else:
                return {'status': 'FAILED', 'details': res.json(), 'error_code': res.status_code}
        except Exception as e:
            return {'status': 'FAILED', 'details': str(e)}


class NotificationDispatcher:
    @staticmethod
    def render_template(text, context):
        if not text:
            return ""
        rendered = text
        for key, val in context.items():
            rendered = rendered.replace(f"{{{key}}}", str(val))
        return rendered

    @classmethod
    def dispatch_trigger(cls, trigger_obj, recipient_info=None, context=None):
        """
        Dispatches all active channel templates associated with the trigger.
        """
        if context is None:
            context = {}

        if recipient_info is None:
            recipient_info = {
                'email': 'user@example.com',
                'phone': '+1234567890',
                'user_name': 'Valued User'
            }

        # Merge user context
        if 'user_name' not in context:
            context['user_name'] = recipient_info.get('user_name', 'Valued User')

        templates = NotificationTemplate.objects.filter(trigger=trigger_obj, is_active=True)
        results = []

        for tpl in templates:
            rendered_body = cls.render_template(tpl.body, context)
            rendered_title = cls.render_template(tpl.subject_or_title, context)

            if tpl.channel == 'whatsapp':
                recipient = recipient_info.get('phone', '+1234567890')
                res = WhatsAppService.send_message(recipient, rendered_body)
            elif tpl.channel == 'email':
                recipient = recipient_info.get('email', 'user@example.com')
                res = PostmarkEmailService.send_email(recipient, rendered_title, rendered_body)
            elif tpl.channel == 'web_push':
                recipient = recipient_info.get('player_id', 'Web Browser')
                res = WebPushService.send_push(rendered_title, rendered_body, player_id=recipient_info.get('player_id'))
            else:
                continue

            log_entry = NotificationLog.objects.create(
                trigger_name=trigger_obj.name,
                channel=tpl.channel,
                recipient=str(recipient),
                status=res['status'],
                message_preview=rendered_body[:250],
                response_data=res.get('details', {})
            )
            results.append({
                'channel': tpl.channel,
                'status': res['status'],
                'log_id': log_entry.id,
                'details': res
            })

        return results
