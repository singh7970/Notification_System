import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertTriangle, Smartphone, Mail, Bell } from 'lucide-react';
import { testSendTemplate } from '../api';

export function TestSendModal({ template, triggerName, onClose, onTestComplete }) {
  const [recipient, setRecipient] = useState('');
  const [userName, setUserName] = useState('Priyanshu (Tester)');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!template) return null;

  const defaultPlaceholder = template.channel === 'whatsapp' 
    ? '+14155238886 (WhatsApp Test Phone)' 
    : template.channel === 'email' 
    ? 'candidate@example.com' 
    : 'Browser Device Subscribed';

  const handleTestSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await testSendTemplate(template.id, {
        recipient: recipient || (template.channel === 'whatsapp' ? '+14155238886' : 'candidate@example.com'),
        user_name: userName
      });
      setResult(res);
      if (onTestComplete) onTestComplete();
    } catch (err) {
      setError(err.message || 'Failed to send test message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-container" style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', marginBottom: '4px' }}>
              TEST DISPATCH
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Test Send: <span style={{ color: '#38bdf8' }}>{template.channel.toUpperCase()}</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trigger: {triggerName}</p>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleTestSend}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Simulated User Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. John Doe"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {template.channel === 'whatsapp' ? 'Recipient WhatsApp Phone Number' : template.channel === 'email' ? 'Recipient Email Address' : 'Push Notification Target'}
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={defaultPlaceholder}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {result && (
            <div style={{
              padding: '14px',
              background: result.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${result.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {result.status === 'SUCCESS' ? <CheckCircle2 size={18} color="#34d399" /> : <AlertTriangle size={18} color="#fbbf24" />}
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: result.status === 'SUCCESS' ? '#34d399' : '#fbbf24' }}>
                  Dispatch Status: {result.status}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Recipient: <strong>{result.recipient}</strong>
              </p>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 600, color: '#a5b4fc', marginBottom: '4px' }}>Rendered Message Preview:</div>
                <div style={{ color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>{result.rendered_body}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Close
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Send size={16} /> {loading ? 'Dispatching...' : 'Send Test Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
