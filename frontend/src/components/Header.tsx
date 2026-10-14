import React from 'react';
import { RefreshCw, Radio, Server, Cpu, HardDrive } from 'lucide-react';
import { SystemStats } from '../types';

interface HeaderProps {
  systemStats: SystemStats | null;
  isConnected: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ systemStats, isConnected, onRefresh }) => {
  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(13, 19, 34, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Status Live Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '20px',
          backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          fontSize: '12px',
          fontWeight: 600,
          color: isConnected ? '#34d399' : '#fb7185'
        }}>
          <span className={isConnected ? 'pulse-emerald' : ''} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#10b981' : '#f43f5e'
          }} />
          {isConnected ? 'LIVE MONITOR STREAM' : 'DISCONNECTED'}
        </div>
      </div>

      {/* Quick Metrics Header Strip */}
      {systemStats && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Cpu size={16} color="#06b6d4" />
            <span>CPU: <strong style={{ color: '#ffffff' }}>{systemStats.cpu_percent}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Server size={16} color="#3b82f6" />
            <span>RAM: <strong style={{ color: '#ffffff' }}>{systemStats.memory_percent}%</strong> ({systemStats.memory_used_mb} MB)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <HardDrive size={16} color="#a855f7" />
            <span>Disk: <strong style={{ color: '#ffffff' }}>{systemStats.disk_percent}%</strong></span>
          </div>
        </div>
      )}

      {/* Manual Refresh Action */}
      <button
        onClick={onRefresh}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '8px',
          backgroundColor: '#111827',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <RefreshCw size={14} />
        <span>Refresh</span>
      </button>
    </header>
  );
};
