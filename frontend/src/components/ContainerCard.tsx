import React, { useState } from 'react';
import { Play, Square, RotateCw, Terminal, Box, Globe } from 'lucide-react';
import { ContainerInfo } from '../types';

interface ContainerCardProps {
  container: ContainerInfo;
  onAction: (id: string, action: 'start' | 'stop' | 'restart') => Promise<void>;
  onViewLogs: (id: string, name: string) => void;
}

export const ContainerCard: React.FC<ContainerCardProps> = ({
  container,
  onAction,
  onViewLogs,
}) => {
  const [loading, setLoading] = useState(false);

  const isRunning = container.status.toLowerCase().includes('running') || container.state === 'running';

  const handleAction = async (action: 'start' | 'stop' | 'restart') => {
    setLoading(true);
    try {
      await onAction(container.id, action);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#1f293d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}>
              <Box size={18} color="#60a5fa" />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', wordBreak: 'break-all' }}>
                {container.name}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {container.image}
              </span>
            </div>
          </div>
          <span className={`badge ${isRunning ? 'badge-running' : 'badge-stopped'}`}>
            {isRunning ? 'RUNNING' : 'STOPPED'}
          </span>
        </div>

        {/* Exposed Ports */}
        {container.ports.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
            <Globe size={12} color="var(--text-muted)" />
            {container.ports.map((p, idx) => (
              <span key={idx} style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: '#111827',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                color: 'var(--accent-cyan)'
              }}>
                {p.public_port ? `${p.public_port}:${p.private_port}` : p.private_port}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Control Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={() => onViewLogs(container.id, container.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#1f293d',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Terminal size={14} />
          <span>Logs</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isRunning ? (
            <>
              <button
                disabled={loading}
                onClick={() => handleAction('restart')}
                title="Restart Container"
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                <RotateCw size={14} />
              </button>
              <button
                disabled={loading}
                onClick={() => handleAction('stop')}
                title="Stop Container"
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                <Square size={14} />
              </button>
            </>
          ) : (
            <button
              disabled={loading}
              onClick={() => handleAction('start')}
              title="Start Container"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '12px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <Play size={14} />
              <span>Start</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
