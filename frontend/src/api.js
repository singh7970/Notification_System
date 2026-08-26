const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const fetchTriggers = async () => {
  const res = await fetch(`${API_BASE}/triggers/`);
  if (!res.ok) throw new Error('Failed to fetch triggers');
  return res.json();
};

export const createTrigger = async (triggerData) => {
  const res = await fetch(`${API_BASE}/triggers/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(triggerData)
  });
  if (!res.ok) throw new Error('Failed to create trigger');
  return res.json();
};

export const updateTemplate = async (templateId, data) => {
  const res = await fetch(`${API_BASE}/templates/${templateId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update template');
  return res.json();
};

export const toggleTemplate = async (templateId) => {
  const res = await fetch(`${API_BASE}/templates/${templateId}/toggle/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to toggle template');
  return res.json();
};

export const testSendTemplate = async (templateId, testData) => {
  const res = await fetch(`${API_BASE}/templates/${templateId}/test_send/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
  });
  if (!res.ok) throw new Error('Failed to send test notification');
  return res.json();
};

export const fireEventTrigger = async (triggerKey, recipientInfo, context) => {
  const res = await fetch(`${API_BASE}/events/fire/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      trigger_key: triggerKey,
      recipient_info: recipientInfo,
      context: context
    })
  });
  if (!res.ok) throw new Error('Failed to fire trigger event');
  return res.json();
};

export const fetchNotificationLogs = async () => {
  const res = await fetch(`${API_BASE}/logs/`);
  if (!res.ok) throw new Error('Failed to fetch notification logs');
  return res.json();
};

export const subscribeWebPush = async (subscriptionData) => {
  const res = await fetch(`${API_BASE}/push/subscribe/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscriptionData)
  });
  if (!res.ok) throw new Error('Failed to save push subscription');
  return res.json();
};

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health/`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch (e) {
    return false;
  }
};

