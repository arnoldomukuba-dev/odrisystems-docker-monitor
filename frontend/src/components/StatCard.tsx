import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  progress?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  progress,
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>{title}</span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${color}30`
        }}>
          <Icon size={18} color={color} />
        </div>
      </div>

      <div style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
        {value}
      </div>

      {subtitle && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{subtitle}</p>
      )}

      {progress !== undefined && (
        <div style={{ marginTop: '12px', width: '100%', height: '6px', backgroundColor: '#1f293d', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
            backgroundColor: color,
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      )}
    </div>
  );
};
