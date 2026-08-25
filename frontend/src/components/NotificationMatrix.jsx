import React, { useState, useEffect } from 'react';
import { Smartphone, Mail, Bell, Edit3, Send, Plus, RefreshCw } from 'lucide-react';
import { fetchTriggers, toggleTemplate } from '../api';
import { EditTemplateModal } from './EditTemplateModal';
import { TestSendModal } from './TestSendModal';
import { CreateTriggerModal } from './CreateTriggerModal';

export function NotificationMatrix({ onLogUpdate }) {
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingTriggerName, setEditingTriggerName] = useState('');
  const [testingTemplate, setTestingTemplate] = useState(null);
  const [testingTriggerName, setTestingTriggerName] = useState('');
  const [showCreateTrigger, setShowCreateTrigger] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTriggers();
      setTriggers(data);
    } catch (err) {
      setError(err.message || 'Failed to load triggers matrix');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (templateId) => {
    try {
      await toggleTemplate(templateId);
      await loadData();
    } catch (err) {
      alert('Error toggling template: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Notification Control Matrix
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage triggers and channel templates from a single screen. (1 Row = 1 Trigger, 1 Column = 1 Channel)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={loadData} className="btn btn-secondary">
            <RefreshCw size={16} /> Refresh Matrix
          </button>
          <button onClick={() => setShowCreateTrigger(true)} className="btn btn-primary">
            <Plus size={16} /> Add New Trigger
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#f87171', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ marginBottom: '12px' }} />
          <p>Loading notification matrix...</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '20px' }}>
          <table className="matrix-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Trigger Event</th>
                <th style={{ width: '26%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                    <Smartphone size={18} /> WhatsApp (Meta)
                  </div>
                </th>
                <th style={{ width: '26%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa' }}>
                    <Mail size={18} /> Email (Postmark)
                  </div>
                </th>
                <th style={{ width: '26%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                    <Bell size={18} /> Web Push (Browser)
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {triggers.map((trig) => {
                const getChannelTemplate = (channelName) => {
                  return (trig.templates || []).find((t) => t.channel === channelName);
                };

                const whatsappTpl = getChannelTemplate('whatsapp');
                const emailTpl = getChannelTemplate('email');
                const webPushTpl = getChannelTemplate('web_push');

                return (
                  <tr key={trig.id}>
                    {/* Trigger Info Column */}
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{ padding: '8px 0' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                          {trig.name}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '6px' }}>
                          key: {trig.key}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                          {trig.description || 'System event trigger'}
                        </div>
                      </div>
                    </td>

                    {/* WhatsApp Channel Cell */}
                    <td>
                      <CellContent
                        template={whatsappTpl}
                        triggerName={trig.name}
                        channel="whatsapp"
                        onEdit={() => { setEditingTemplate(whatsappTpl); setEditingTriggerName(trig.name); }}
                        onToggle={() => whatsappTpl && handleToggle(whatsappTpl.id)}
                        onTestSend={() => { setTestingTemplate(whatsappTpl); setTestingTriggerName(trig.name); }}
                      />
                    </td>

                    {/* Email Channel Cell */}
                    <td>
                      <CellContent
                        template={emailTpl}
                        triggerName={trig.name}
                        channel="email"
                        onEdit={() => { setEditingTemplate(emailTpl); setEditingTriggerName(trig.name); }}
                        onToggle={() => emailTpl && handleToggle(emailTpl.id)}
                        onTestSend={() => { setTestingTemplate(emailTpl); setTestingTriggerName(trig.name); }}
                      />
                    </td>

                    {/* Web Push Channel Cell */}
                    <td>
                      <CellContent
                        template={webPushTpl}
                        triggerName={trig.name}
                        channel="web_push"
                        onEdit={() => { setEditingTemplate(webPushTpl); setEditingTriggerName(trig.name); }}
                        onToggle={() => webPushTpl && handleToggle(webPushTpl.id)}
                        onTestSend={() => { setTestingTemplate(webPushTpl); setTestingTriggerName(trig.name); }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          triggerName={editingTriggerName}
          onClose={() => setEditingTemplate(null)}
          onSaved={loadData}
        />
      )}

      {/* Test Send Modal */}
      {testingTemplate && (
        <TestSendModal
          template={testingTemplate}
          triggerName={testingTriggerName}
          onClose={() => setTestingTemplate(null)}
          onTestComplete={onLogUpdate}
        />
      )}

      {/* Create Trigger Modal */}
      {showCreateTrigger && (
        <CreateTriggerModal
          onClose={() => setShowCreateTrigger(false)}
          onCreated={loadData}
        />
      )}
    </div>
  );
}

function CellContent({ template, triggerName, channel, onEdit, onToggle, onTestSend }) {
  if (!template) {
    return (
      <div className="matrix-cell" style={{ justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' }}>
        <button onClick={onEdit} className="btn btn-secondary btn-sm">
          <Plus size={14} /> Setup Template
        </button>
      </div>
    );
  }

  const isWhatsApp = channel === 'whatsapp';
  const isEmail = channel === 'email';

  return (
    <div className={`matrix-cell ${!template.is_active ? 'inactive' : ''}`}>
      {/* Header: Status + Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span className={`badge ${template.is_active ? 'badge-success' : ''}`} style={{
          background: template.is_active ? (isWhatsApp ? 'rgba(16, 185, 129, 0.2)' : isEmail ? 'rgba(139, 92, 246, 0.2)' : 'rgba(14, 165, 233, 0.2)') : 'rgba(255,255,255,0.08)',
          color: template.is_active ? (isWhatsApp ? '#34d399' : isEmail ? '#a78bfa' : '#38bdf8') : 'var(--text-muted)'
        }}>
          {template.is_active ? 'ENABLED' : 'DISABLED'}
        </span>

        {/* Toggle Switch */}
        <label className="switch" title="Toggle On/Off">
          <input
            type="checkbox"
            checked={template.is_active}
            onChange={onToggle}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* Title / Subject if present */}
      {template.subject_or_title && (
        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {template.subject_or_title}
        </div>
      )}

      {/* Body Snippet */}
      <div className="code-preview" style={{ flexGrow: 1, marginBottom: '10px' }}>
        {template.body}
      </div>

      {/* Footer Controls */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <button
          onClick={onEdit}
          className="btn btn-secondary btn-sm"
          title="Edit Template"
        >
          <Edit3 size={13} /> Edit
        </button>
        <button
          onClick={onTestSend}
          disabled={!template.is_active}
          className={`btn btn-sm ${isWhatsApp ? 'btn-whatsapp' : isEmail ? 'btn-email' : 'btn-push'}`}
          title="Test Send"
        >
          <Send size={13} /> Test
        </button>
      </div>
    </div>
  );
}
