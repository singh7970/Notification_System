import React, { useState, useEffect } from 'react';
import { History, RefreshCw, Smartphone, Mail, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';
import { fetchNotificationLogs } from '../api';

export function NotificationLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotificationLogs();
      setLogs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} color="#6366f1" /> Notification Audit Trail
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Real-time audit log of all dispatched WhatsApp, Email, and Web Push notifications
          </p>
        </div>

        <button onClick={loadLogs} className="btn btn-secondary">
          <RefreshCw size={16} /> Refresh Logs
        </button>
      </div>

      {error && (
        <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#f87171', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ marginBottom: '12px' }} />
          <p>Loading audit trail...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No notification logs found yet. Fire an event from the Website Sandbox or send a Test notification!
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Timestamp</th>
                <th style={{ padding: '12px' }}>Trigger</th>
                <th style={{ padding: '12px' }}>Channel</th>
                <th style={{ padding: '12px' }}>Recipient</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Message Preview</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.775rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#fff' }}>
                    {log.trigger_name}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize', fontWeight: 600 }}>
                      {log.channel === 'whatsapp' && <Smartphone size={15} color="#34d399" />}
                      {log.channel === 'email' && <Mail size={15} color="#a78bfa" />}
                      {log.channel === 'web_push' && <Bell size={15} color="#38bdf8" />}
                      {log.channel}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#a5b4fc', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {log.recipient}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${log.status === 'SUCCESS' ? 'badge-success' : log.status === 'SANDBOX_SIMULATED' ? 'badge-simulated' : 'badge-failed'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', maxWidth: '320px' }}>
                    <div style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem'
                    }}>
                      {log.message_preview}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
