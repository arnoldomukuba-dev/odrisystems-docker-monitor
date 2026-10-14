import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fetchMetricsHistory } from '../services/api';
import { SystemMetricHistory } from '../types';

export const MetricsPage: React.FC = () => {
  const [history, setHistory] = useState<SystemMetricHistory[]>([]);

  useEffect(() => {
    fetchMetricsHistory(50).then(setHistory).catch(console.error);
  }, []);

  const chartData = history.map((m) => ({
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    cpu: m.cpu_percent,
    memory: m.memory_percent,
    disk: m.disk_percent,
    containers: m.running_containers,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Host CPU & Memory History (%)</h2>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
              <XAxis dataKey="time" stroke="#4b5563" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#4b5563" fontSize={11} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
              <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} dot={false} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#3b82f6" strokeWidth={2} dot={false} name="Memory %" />
              <Line type="monotone" dataKey="disk" stroke="#a855f7" strokeWidth={2} dot={false} name="Disk %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Running Containers Trend</h2>
        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
              <XAxis dataKey="time" stroke="#4b5563" fontSize={11} />
              <YAxis stroke="#4b5563" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
              <Line type="step" dataKey="containers" stroke="#10b981" strokeWidth={2} dot={false} name="Active Containers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
