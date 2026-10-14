import React, { useState } from 'react';
import { Search, Filter, Box } from 'lucide-react';
import { ContainerCard } from '../components/ContainerCard';
import { ContainerInfo } from '../types';
import { performContainerAction } from '../services/api';

interface ContainersPageProps {
  containers: ContainerInfo[];
  onViewLogs: (id: string, name: string) => void;
  onRefresh: () => void;
}

export const ContainersPage: React.FC<ContainersPageProps> = ({
  containers,
  onViewLogs,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleAction = async (id: string, action: 'start' | 'stop' | 'restart') => {
    await performContainerAction(id, action);
    onRefresh();
  };

  const filtered = containers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.image.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'running') return matchesSearch && (c.status.includes('running') || c.state === 'running');
    if (statusFilter === 'stopped') return matchesSearch && (!c.status.includes('running') && c.state !== 'running');
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search containers by name or image..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: '8px',
              backgroundColor: '#111827',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          {['all', 'running', 'stopped'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: statusFilter === f ? '#2563eb' : '#111827',
                color: statusFilter === f ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Containers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Box size={40} color="var(--border-highlight)" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '15px', fontWeight: 600 }}>No Docker containers found matching criteria.</p>
          </div>
        ) : (
          filtered.map((c) => (
            <ContainerCard
              key={c.id}
              container={c}
              onAction={handleAction}
              onViewLogs={onViewLogs}
            />
          ))
        )}
      </div>
    </div>
  );
};
