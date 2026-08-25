import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { updateTemplate } from '../api';

export function EditTemplateModal({ template, triggerName, onClose, onSaved }) {
  const [subjectOrTitle, setSubjectOrTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (template) {
      setSubjectOrTitle(template.subject_or_title || '');
      setBody(template.body || '');
    }
  }, [template]);

  if (!template) return null;

  const insertVariable = (varName) => {
    setBody((prev) => `${prev}{${varName}}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateTemplate(template.id, {
        subject_or_title: subjectOrTitle,
        body: body
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', marginBottom: '4px' }}>
              {template.channel.toUpperCase()} TEMPLATE
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Edit Template: <span style={{ color: '#818cf8' }}>{triggerName}</span>
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {template.channel !== 'whatsapp' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {template.channel === 'email' ? 'Email Subject' : 'Push Notification Title'}
              </label>
              <input
                type="text"
                value={subjectOrTitle}
                onChange={(e) => setSubjectOrTitle(e.target.value)}
                placeholder="e.g. Security Alert: User Login"
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
          )}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Message Body
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginRight: '4px' }}>Add variable:</span>
                {['user_name', 'time', 'order_id', 'amount'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    style={{
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: '#a5b4fc',
                      cursor: 'pointer'
                    }}
                  >
                    +{v}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter message text with placeholders like {user_name}..."
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} /> {loading ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
