from django.core.management.base import BaseCommand
from notifications.models import Trigger, NotificationTemplate

class Command(BaseCommand):
    help = 'Seeds initial triggers and default templates for WhatsApp, Email, and Web Push'

    def handle(self, *args, **options):
        initial_triggers = [
            {
                'name': 'Login',
                'key': 'login',
                'description': 'Fires when a user signs in to the platform',
                'templates': {
                    'whatsapp': {'subject': 'Welcome Back', 'body': 'Welcome back, {user_name}! You signed in successfully at {time}.'},
                    'email': {'subject': 'Security Alert: User Login', 'body': 'Hello {user_name},\n\nWe noticed a new login to your account at {time}. If this was you, no action is needed.'},
                    'web_push': {'subject': 'Welcome Back!', 'body': 'Hi {user_name}, welcome back to the portal!'},
                }
            },
            {
                'name': 'Logout',
                'key': 'logout',
                'description': 'Fires when a user signs out of the platform',
                'templates': {
                    'whatsapp': {'subject': 'Logged Out', 'body': 'Goodbye {user_name}, you have been safely logged out.'},
                    'email': {'subject': 'Session Ended', 'body': 'Hi {user_name},\n\nYour session was ended successfully at {time}. Have a great day!'},
                    'web_push': {'subject': 'Logged Out Successfully', 'body': 'See you next time, {user_name}!'},
                }
            },
            {
                'name': 'Not Logged In 1 Day',
                'key': 'not_logged_in_1_day',
                'description': 'Fires when user has been inactive for 24 hours',
                'templates': {
                    'whatsapp': {'subject': 'We miss you', 'body': 'Hey {user_name}, check out what is new today on our store!'},
                    'email': {'subject': 'Daily Catch-Up', 'body': 'Hi {user_name},\n\nYou missed some updates! Log in today to claim your daily reward.'},
                    'web_push': {'subject': 'Daily Alert', 'body': 'Don\'t forget to check your daily activity dashboard!'},
                }
            },
            {
                'name': 'Not Logged In 1 Week',
                'key': 'not_logged_in_1_week',
                'description': 'Fires when user has been inactive for 7 days',
                'templates': {
                    'whatsapp': {'subject': 'Special Offer', 'body': 'We miss you, {user_name}! Come back this week and get 20% off.'},
                    'email': {'subject': 'It\'s been a week...', 'body': 'Hello {user_name},\n\nWe haven\'t seen you in a week! We\'ve saved your favorite items.'},
                    'web_push': {'subject': 'Come visit us again', 'body': 'Special 20% discount waiting for you, {user_name}!'},
                }
            },
            {
                'name': 'Password Reset',
                'key': 'password_reset',
                'description': 'Fires when a user requests password reset',
                'templates': {
                    'whatsapp': {'subject': 'Reset Code', 'body': 'Hi {user_name}, your security reset verification code is 849201.'},
                    'email': {'subject': 'Password Reset Request', 'body': 'Hello {user_name},\n\nClick the link to reset your password or use code 849201.'},
                    'web_push': {'subject': 'Password Reset Alert', 'body': 'Security code sent to your email.'},
                }
            },
            {
                'name': 'Order Placed',
                'key': 'order_placed',
                'description': 'Fires when user completes a purchase',
                'templates': {
                    'whatsapp': {'subject': 'Order Confirmation', 'body': 'Thanks {user_name}! Order #{order_id} for {amount} is confirmed.'},
                    'email': {'subject': 'Order Receipt #{order_id}', 'body': 'Hi {user_name},\n\nThank you for your order #{order_id} totaling {amount}.'},
                    'web_push': {'subject': 'Order Confirmed!', 'body': 'Order #{order_id} is being processed.'},
                }
            }
        ]

        created_triggers = 0
        created_templates = 0

        for t_data in initial_triggers:
            trigger_obj, created = Trigger.objects.get_or_create(
                key=t_data['key'],
                defaults={'name': t_data['name'], 'description': t_data['description']}
            )
            if created:
                created_triggers += 1

            for channel, tpl in t_data['templates'].items():
                _, tpl_created = NotificationTemplate.objects.get_or_create(
                    trigger=trigger_obj,
                    channel=channel,
                    defaults={
                        'subject_or_title': tpl['subject'],
                        'body': tpl['body'],
                        'is_active': True
                    }
                )
                if tpl_created:
                    created_templates += 1

        self.stdout.write(self.style.SUCCESS(
            f'Seeding completed successfully! Created {created_triggers} triggers and {created_templates} templates.'
        ))
