import React, { useState } from 'react';
import { BookOpen, Bell, Key, Smartphone, Mail, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { subscribeWebPush } from '../api';

export function SandboxDocs() {
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subMsg, setSubMsg] = useState('');

  const handleSubscribeBrowserPush = async () => {
    setSubLoading(true);
    setSubMsg('');
    try {
      if (!('Notification' in window)) {
        throw new Error('This browser does not support web push notifications');
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const dummyPlayerId = 'player_' + Math.random().toString(36).substring(2, 11);
        await subscribeWebPush({
          user_identifier: 'candidate_browser',
          onesignal_player_id: dummyPlayerId,
          endpoint: window.location.origin
        });

        // Trigger local notification preview
        new Notification('Web Push Subscribed!', {
          body: 'You have successfully enabled browser Web Push notifications!',
          icon: '/favicon.ico'
        });

        setSubscribed(true);
        setSubMsg(`Browser subscribed! Simulated Player ID: ${dummyPlayerId}`);
      } else {
        throw new Error('Notification permission was denied');
      }
    } catch (err) {
      setSubMsg('Error: ' + err.message);
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <BookOpen size={28} color="#6366f1" /> Candidate Sandbox & Interview Guide
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '8px auto 0 auto' }}>
          Environment setup credentials guide and quick answers to assignment Section 5 Task D!
        </p>
      </div>

      {/* Web Push Subscription Action */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', border: '1px solid rgba(14, 165, 233, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', marginBottom: '4px' }}>
              BROWSER FEATURE
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Enable Browser Web Push Notification</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Click to grant browser notification permission and test Web Push trigger pop-ups directly in your browser.
            </p>
          </div>
          <button
            onClick={handleSubscribeBrowserPush}
            disabled={subLoading}
            className="btn btn-push"
            style={{ padding: '10px 20px' }}
          >
            <Bell size={18} /> {subLoading ? 'Requesting...' : 'Subscribe Browser Push'}
          </button>
        </div>
        {subMsg && (
          <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', fontSize: '0.85rem', color: '#38bdf8' }}>
            {subMsg}
          </div>
        )}
      </div>

      {/* Environment Config Cards */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
        🔑 Environment Variables Configuration (.env)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {/* WhatsApp Meta */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#34d399', fontWeight: 700 }}>
            <Smartphone size={20} /> 1. Meta WhatsApp Sandbox
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Sign up at Meta for Developers, create app, add WhatsApp product, use test phone number and token.
          </p>
          <div className="code-preview">
            WHATSAPP_ACCESS_TOKEN=your_test_token<br />
            PHONE_NUMBER_ID=your_test_phone_id
          </div>
        </div>

        {/* Postmark Email */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#a78bfa', fontWeight: 700 }}>
            <Mail size={20} /> 2. Postmark Developer Server
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Sign up at PostmarkApp.com, create a developer server (200 free emails), and verify sender email.
          </p>
          <div className="code-preview">
            POSTMARKAPP_TOKEN=your_server_token<br />
            POSTMARK_FROM_EMAIL=your_email@domain.com
          </div>
        </div>

        {/* OneSignal Web Push */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8', fontWeight: 700 }}>
            <Bell size={20} /> 3. OneSignal Web Push
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Sign up at OneSignal.com, create website app, enable Web Push, and obtain App ID and REST API Key.
          </p>
          <div className="code-preview">
            ONESIGNAL_APP_ID=your_app_id<br />
            ONESIGNAL_REST_API_KEY=your_api_key
          </div>
        </div>
      </div>

      {/* Task D Explanation Answers */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <HelpCircle size={20} color="#fbbf24" /> Task D — Interviewer Questions & Answers
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '6px' }}>
            1. What is a trigger? Give 3 examples (not only login).
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>
            <strong>Answer:</strong> A trigger is a website or application event condition that automatically initiates a notification dispatch.
            <br />
            <em>Examples:</em> <strong>1. Password Reset Request</strong>, <strong>2. Order Placed / Checkout Completed</strong>, <strong>3. User Inactive for 7 Days</strong>.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '6px' }}>
            2. What are the three channels?
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>
            <strong>Answer:</strong> The three delivery channels are:
            <br />
            <strong>WhatsApp</strong> (sent via Meta WhatsApp Cloud API), <strong>Email</strong> (sent via Postmark API), and <strong>Web Push</strong> (browser pop-up notification).
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '6px' }}>
            3. Why create templates in the admin panel instead of Postmark / WhatsApp website?
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>
            <strong>Answer:</strong> Centralized administration! Managing templates in a unified admin panel allows admins to control, toggle ON/OFF, dynamic variable mapping, and test send all notification channels from a single matrix without opening three separate third-party vendor dashboards.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '6px' }}>
            4. What is Web Push?
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>
            <strong>Answer:</strong> Web Push allows websites to send push notification pop-ups directly to a user's web browser, even when the user is not actively viewing the website page at that moment.
          </p>
        </div>
      </div>
    </div>
  );
}
