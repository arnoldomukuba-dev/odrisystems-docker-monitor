import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertOctagon, Info, CheckCircle2 } from 'lucide-react';
import { AlertLog } from '../types';
import { fetchAlerts } from '../services/api';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertLog[]>([]);

  useEffect(() => {
    fetchAlerts(50).then(setAlerts).catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>System & Service Alerts</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Historical notification log of downtime incidents and system events</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShieldAlert size={40} color="var(--border-highlight)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '15px', fontWeight: 600 }}>No system alert events recorded.</p>
          </div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              className="glass-panel"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${a.severity === 'CRITICAL' ? '#f43f5e' : a.severity === 'WARNING' ? '#f59e0b' : '#3b82f6'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {a.severity === 'CRITICAL' ? (
                  <AlertOctagon size={20} color="#f43f5e" />
                ) : a.severity === 'WARNING' ? (
                  <ShieldAlert size={20} color="#f59e0b" />
                ) : (
                  <Info size={20} color="#3b82f6" />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{a.target}</h4>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: a.severity === 'CRITICAL' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: a.severity === 'CRITICAL' ? '#fb7185' : '#60a5fa'
                    }}>
                      {a.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {a.message}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(a.created_at).toLocaleString()}
                </span>
                {a.is_resolved && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399', fontSize: '11px', fontWeight: 600, justifyContent: 'flex-end', marginTop: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>RESOLVED</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
