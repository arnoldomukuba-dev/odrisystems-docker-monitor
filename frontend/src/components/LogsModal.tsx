import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Copy, Check } from 'lucide-react';
import { fetchContainerLogs } from '../services/api';

interface LogsModalProps {
  containerId: string | null;
  containerName: string | null;
  onClose: () => void;
}

export const LogsModal: React.FC<LogsModalProps> = ({
  containerId,
  containerName,
  onClose,
}) => {
  const [logs, setLogs] = useState<string>('Loading container logs...');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const loadLogs = async () => {
    if (!containerId) return;
    setLoading(true);
    try {
      const data = await fetchContainerLogs(containerId, 150);
      setLogs(data || 'No log output available.');
    } catch (err) {
      setLogs(`Error loading container logs: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [containerId]);

  if (!containerId) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(logs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0d1322',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>
              Container Logs: <span style={{ color: 'var(--accent-cyan)' }}>{containerName}</span>
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ID: {containerId}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCopy}
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
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Logs'}</span>
            </button>
            <button
              onClick={loadLogs}
              style={{
                padding: '6px',
                borderRadius: '6px',
                backgroundColor: '#1f293d',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '6px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Terminal */}
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <pre className="terminal-box">
            {logs}
          </pre>
        </div>
      </div>
    </div>
  );
};
