import React from 'react';
import { LayoutDashboard, Box, Activity, Bell, Server, Terminal, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  containerCount: number;
  serviceCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  containerCount,
  serviceCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'containers', label: 'Docker Containers', icon: Box, count: containerCount },
    { id: 'services', label: 'Services & Uptime', icon: Server, count: serviceCount },
    { id: 'metrics', label: 'Metrics History', icon: Activity },
    { id: 'alerts', label: 'Alert Center', icon: ShieldAlert },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0d1322',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px 16px',
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
        }}>
          <Terminal size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>ODRISYSTEMS</h1>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Docker Service Monitor</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: isActive ? '#60a5fa' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={isActive ? '#60a5fa' : '#9ca3af'} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? '#2563eb' : '#1f293d',
                  color: '#ffffff',
                  fontWeight: 600
                }}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Version Footer */}
      <div style={{
        padding: '12px 14px',
        backgroundColor: '#111827',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Version</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>v1.0.0</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Stack</span>
          <span style={{ color: '#34d399', fontWeight: 600 }}>FastAPI + React</span>
        </div>
      </div>
    </aside>
  );
};
