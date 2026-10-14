import React, { useEffect, useState } from 'react';
import { Cpu, Server, Box, ShieldAlert, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { StatCard } from '../components/StatCard';
import { ContainerCard } from '../components/ContainerCard';
import { SystemStats, ContainerInfo, ServiceCheck, SystemMetricHistory, AlertLog } from '../types';
import { fetchMetricsHistory, fetchServices, fetchAlerts, deleteService, performContainerAction } from '../services/api';

interface DashboardPageProps {
  systemStats: SystemStats | null;
  containers: ContainerInfo[];
  onViewLogs: (id: string, name: string) => void;
  onOpenAddService: () => void;
  onRefresh: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  systemStats,
  containers,
  onViewLogs,
  onOpenAddService,
  onRefresh,
}) => {
  const [metricsHistory, setMetricsHistory] = useState<SystemMetricHistory[]>([]);
  const [services, setServices] = useState<ServiceCheck[]>([]);
  const [alerts, setAlerts] = useState<AlertLog[]>([]);

  const loadData = async () => {
    try {
      const [historyData, servicesData, alertsData] = await Promise.all([
        fetchMetricsHistory(20),
        fetchServices(),
        fetchAlerts(10),
      ]);
      setMetricsHistory(historyData);
      setServices(servicesData);
      setAlerts(alertsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleContainerAction = async (id: string, action: 'start' | 'stop' | 'restart') => {
    await performContainerAction(id, action);
    onRefresh();
  };

  const handleDeleteService = async (id: string) => {
    await deleteService(id);
    loadData();
  };

  const chartData = metricsHistory.map((m) => ({
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    cpu: m.cpu_percent,
    memory: m.memory_percent,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          title="CPU Usage"
          value={`${systemStats?.cpu_percent ?? 0}%`}
          subtitle="Host System Load"
          icon={Cpu}
          color="#06b6d4"
          progress={systemStats?.cpu_percent ?? 0}
        />
        <StatCard
          title="Memory Usage"
          value={`${systemStats?.memory_percent ?? 0}%`}
          subtitle={`${systemStats?.memory_used_mb ?? 0} MB / ${systemStats?.memory_total_mb ?? 0} MB`}
          icon={Server}
          color="#3b82f6"
          progress={systemStats?.memory_percent ?? 0}
        />
        <StatCard
          title="Active Containers"
          value={systemStats?.active_containers ?? 0}
          subtitle={`${systemStats?.running_containers ?? 0} Running | ${systemStats?.stopped_containers ?? 0} Stopped`}
          icon={Box}
          color="#10b981"
        />
        <StatCard
          title="Active Alerts"
          value={alerts.filter((a) => !a.is_resolved).length}
          subtitle={`${alerts.length} Total Logged`}
          icon={ShieldAlert}
          color="#f43f5e"
        />
      </div>

      {/* Resource History Chart */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>Live Resource Metrics History</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time CPU and Memory utilization timeline</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06b6d4', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4' }} /> CPU %
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} /> Memory %
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#4b5563" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#4b5563" fontSize={11} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#ffffff' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
              <Area type="monotone" dataKey="memory" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Split: Docker Containers & Service Health Monitors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Docker Containers Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Docker Containers</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{containers.length} Total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {containers.length === 0 ? (
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No Docker containers detected on host machine.
              </div>
            ) : (
              containers.slice(0, 4).map((c) => (
                <ContainerCard
                  key={c.id}
                  container={c}
                  onAction={handleContainerAction}
                  onViewLogs={onViewLogs}
                />
              ))
            )}
          </div>
        </div>

        {/* Service Checks Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Service Health Checks</h3>
            <button
              onClick={onOpenAddService}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: '#2563eb',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Add Service</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.length === 0 ? (
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No external HTTP services monitored yet. Click "Add Service" to start tracking endpoints.
              </div>
            ) : (
              services.map((s) => (
                <div key={s.id} className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{s.name}</h4>
                      <span className={`badge ${s.status === 'ONLINE' ? 'badge-online' : s.status === 'OFFLINE' ? 'badge-offline' : 'badge-degraded'}`}>
                        {s.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      {s.target_url}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: s.last_response_time_ms ? '#34d399' : 'var(--text-muted)' }}>
                        {s.last_response_time_ms ? `${s.last_response_time_ms} ms` : 'N/A'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Latency</span>
                    </div>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
