import React, { useState } from 'react';
import { Header } from './components/Header';
import { NotificationMatrix } from './components/NotificationMatrix';
import { UserAppSandbox } from './components/UserAppSandbox';
import { NotificationLogs } from './components/NotificationLogs';
import { SandboxDocs } from './components/SandboxDocs';

export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [logRefreshKey, setLogRefreshKey] = useState(0);

  const triggerLogUpdate = () => {
    setLogRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flexGrow: 1 }}>
        {activeTab === 'matrix' && (
          <NotificationMatrix onLogUpdate={triggerLogUpdate} />
        )}

        {activeTab === 'user_sandbox' && (
          <UserAppSandbox onLogUpdate={triggerLogUpdate} />
        )}

        {activeTab === 'logs' && (
          <NotificationLogs key={logRefreshKey} />
        )}

        {activeTab === 'sandbox_docs' && (
          <SandboxDocs />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        marginTop: 'auto'
      }}>
        Notification System Admin • Built with Django REST Framework & React Vite
      </footer>
    </div>
  );
}
