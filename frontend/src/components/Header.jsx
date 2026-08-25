import React from 'react';
import { Bell, Sliders, PlayCircle, History, BookOpen, ShieldCheck } from 'lucide-react';

export function Header({ activeTab, setActiveTab }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Bell size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Notifier Admin
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Unified Multi-Channel Trigger Matrix (WhatsApp • Email • Web Push)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`btn ${activeTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px', fontSize: '0.825rem' }}
          >
            <Sliders size={16} /> Matrix Admin
          </button>
          <button
            onClick={() => setActiveTab('user_sandbox')}
            className={`btn ${activeTab === 'user_sandbox' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px', fontSize: '0.825rem' }}
          >
            <PlayCircle size={16} /> Website Sandbox
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px', fontSize: '0.825rem' }}
          >
            <History size={16} /> Delivery Logs
          </button>
          <button
            onClick={() => setActiveTab('sandbox_docs')}
            className={`btn ${activeTab === 'sandbox_docs' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px', fontSize: '0.825rem' }}
          >
            <BookOpen size={16} /> Sandbox Setup
          </button>
        </nav>

        {/* System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} /> Backend Connected
          </span>
        </div>
      </div>
    </header>
  );
}
