from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from notifications.views import (
    TriggerViewSet, NotificationTemplateViewSet, 
    NotificationLogViewSet, FireEventView, PushSubscriptionView, health_check
)

router = DefaultRouter()
router.register(r'triggers', TriggerViewSet, basename='trigger')
router.register(r'templates', NotificationTemplateViewSet, basename='template')
router.register(r'logs', NotificationLogViewSet, basename='log')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/events/fire/', FireEventView.as_view(), name='fire_event'),
    path('api/push/subscribe/', PushSubscriptionView.as_view(), name='push_subscribe'),
    path('api/health/', health_check, name='health_check'),
]
