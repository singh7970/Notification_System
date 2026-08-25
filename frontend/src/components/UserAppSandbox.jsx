import React, { useState } from 'react';
import { LogIn, LogOut, KeyRound, ShoppingBag, Clock, Calendar, CheckCircle, Smartphone, Mail, Bell, Sparkles } from 'lucide-react';
import { fireEventTrigger } from '../api';

export function UserAppSandbox({ onLogUpdate }) {
  const [userName, setUserName] = useState('Priyanshu Singh');
  const [userEmail, setUserEmail] = useState('priyanshu@example.com');
  const [userPhone, setUserPhone] = useState('+14155238886');
  const [activeTrigger, setActiveTrigger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fireResult, setFireResult] = useState(null);

  const handleFireEvent = async (triggerKey, triggerName) => {
    setActiveTrigger(triggerKey);
    setLoading(true);
    setFireResult(null);

    try {
      const res = await fireEventTrigger(
        triggerKey,
        {
          email: userEmail,
          phone: userPhone,
          user_name: userName
        },
        {
          user_name: userName,
          time: new Date().toLocaleTimeString(),
          order_id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          amount: '$' + (Math.random() * 150 + 20).toFixed(2)
        }
      );
      setFireResult(res);
      if (onLogUpdate) onLogUpdate();
    } catch (err) {
      alert('Error triggering event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge badge-success" style={{ marginBottom: '8px', padding: '6px 12px' }}>
          USER WEBSITE SANDBOX
        </span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
          Simulated User Website Actions
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '8px auto 0 auto' }}>
          Perform user actions below. When an action occurs, the website fires the backend trigger, which automatically dispatches enabled channels (WhatsApp, Email, Web Push)!
        </p>
      </div>

      {/* User Profile Config */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          👤 Simulated User Credentials
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              User Full Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Target Email Address (Postmark)
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Target WhatsApp Phone (Meta Cloud)
            </label>
            <input
              type="text"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </div>
        </div>
      </div>

      {/* Website Action Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Login Trigger */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#34d399' }}>
                <LogIn size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trigger: Login</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>User signs in on website</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleFireEvent('login', 'User Login')}
            disabled={loading && activeTrigger === 'login'}
            className="btn btn-whatsapp"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
          >
            {loading && activeTrigger === 'login' ? 'Firing...' : '🔑 Simulate User Login'}
          </button>
        </div>

        {/* Logout Trigger */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#f87171' }}>
                <LogOut size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trigger: Logout</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>User signs out of account</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleFireEvent('logout', 'User Logout')}
            disabled={loading && activeTrigger === 'logout'}
            className="btn btn-danger"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
          >
            {loading && activeTrigger === 'logout' ? 'Firing...' : '🚪 Simulate User Logout'}
          </button>
        </div>

        {/* Password Reset */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fbbf24' }}>
                <KeyRound size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trigger: Password Reset</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>User requests password reset</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleFireEvent('password_reset', 'Password Reset')}
            disabled={loading && activeTrigger === 'password_reset'}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
          >
            {loading && activeTrigger === 'password_reset' ? 'Firing...' : '🔒 Simulate Reset Request'}
          </button>
        </div>

        {/* Order Placed */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '10px', color: '#a78bfa' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trigger: Order Placed</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>User completes checkout</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleFireEvent('order_placed', 'Order Placed')}
            disabled={loading && activeTrigger === 'order_placed'}
            className="btn btn-email"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
          >
            {loading && activeTrigger === 'order_placed' ? 'Firing...' : '🛒 Simulate Order Purchase'}
          </button>
        </div>

        {/* Inactive 1 Day */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(14, 165, 233, 0.2)', borderRadius: '10px', color: '#38bdf8' }}>
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trigger: 1-Day Inactive</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>User away for 24 hours</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleFireEvent('not_logged_in_1_day', 'Not Logged In 1 Day')}
            disabled={loading && activeTrigger === 'not_logged_in_1_day'}
            className="btn btn-push"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
          >
            {loading && activeTrigger === 'not_logged_in_1_day' ? 'Firing...' : '⏰ Fire 1-Day Inactive Event'}
          </button>
        </div>

        {/* Inactive 1 Week */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '10px', color: '#f472b6' }}>
                <Calendar size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trigger: 1-Week Inactive</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>User away for 7 days</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleFireEvent('not_logged_in_1_week', 'Not Logged In 1 Week')}
            disabled={loading && activeTrigger === 'not_logged_in_1_week'}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px', borderColor: 'rgba(236, 72, 153, 0.4)', color: '#f472b6' }}
          >
            {loading && activeTrigger === 'not_logged_in_1_week' ? 'Firing...' : '📅 Fire 1-Week Inactive Event'}
          </button>
        </div>
      </div>

      {/* Real-time Dispatch Results */}
      {fireResult && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <CheckCircle size={24} color="#34d399" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>
                {fireResult.message}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Evaluated trigger key: <code>{fireResult.trigger_key}</code>
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px' }}>
            {fireResult.dispatches && fireResult.dispatches.length > 0 ? (
              fireResult.dispatches.map((d, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, textTransform: 'capitalize' }}>
                      {d.channel === 'whatsapp' && <Smartphone size={16} color="#34d399" />}
                      {d.channel === 'email' && <Mail size={16} color="#a78bfa" />}
                      {d.channel === 'web_push' && <Bell size={16} color="#38bdf8" />}
                      {d.channel}
                    </div>
                    <span className={`badge ${d.status === 'SUCCESS' ? 'badge-success' : 'badge-simulated'}`}>
                      {d.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    {d.details?.details?.details || d.details?.details || 'Notification dispatched.'}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active templates were enabled for this trigger. Enable channels in the Matrix Admin panel!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
