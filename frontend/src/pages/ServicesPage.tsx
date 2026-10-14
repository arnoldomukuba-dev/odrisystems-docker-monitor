import React, { useEffect, useState } from 'react';
import { Server, Plus, Trash2, Globe, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ServiceCheck } from '../types';
import { fetchServices, deleteService } from '../services/api';

interface ServicesPageProps {
  onOpenAddService: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenAddService }) => {
  const [services, setServices] = useState<ServiceCheck[]>([]);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadServices();
    const interval = setInterval(loadServices, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteService(id);
    loadServices();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>Service Health Monitors</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Automated HTTP and TCP endpoint health tracking</p>
        </div>
        <button
          onClick={onOpenAddService}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: '#2563eb',
            border: 'none',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>Add New Monitor</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {services.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Server size={40} color="var(--border-highlight)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '15px', fontWeight: 600 }}>No health monitors registered yet.</p>
          </div>
        ) : (
          services.map((s) => (
            <div key={s.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>{s.name}</h3>
                  <span className={`badge ${s.status === 'ONLINE' ? 'badge-online' : s.status === 'OFFLINE' ? 'badge-offline' : 'badge-degraded'}`}>
                    {s.status === 'ONLINE' && <CheckCircle size={12} />}
                    {s.status === 'OFFLINE' && <XCircle size={12} />}
                    {s.status === 'DEGRADED' && <AlertTriangle size={12} />}
                    {s.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  {s.target_url}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} />
                  <span>Check Interval: <strong>{s.interval_seconds}s</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>Latency: <strong style={{ color: s.last_response_time_ms ? '#34d399' : 'inherit' }}>{s.last_response_time_ms ? `${s.last_response_time_ms} ms` : 'N/A'}</strong></span>
                  <button onClick={() => handleDelete(s.id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
