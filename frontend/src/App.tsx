import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LogsModal } from './components/LogsModal';
import { AddServiceModal } from './components/AddServiceModal';
import { DashboardPage } from './pages/DashboardPage';
import { ContainersPage } from './pages/ContainersPage';
import { ServicesPage } from './pages/ServicesPage';
import { MetricsPage } from './pages/MetricsPage';
import { AlertsPage } from './pages/AlertsPage';
import { useWebSocket } from './hooks/useWebSocket';
import { fetchContainers, fetchServices } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Modal states
  const [logContainer, setLogContainer] = useState<{ id: string; name: string } | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState<boolean>(false);

  // Real-time WebSocket hook
  const { system, containers: wsContainers, isConnected } = useWebSocket();

  // Fallback / Refresh state
  const [manualContainers, setManualContainers] = useState<any[]>([]);
  const [serviceCount, setServiceCount] = useState<number>(0);

  const activeContainers = wsContainers.length > 0 ? wsContainers : manualContainers;

  const handleRefresh = async () => {
    try {
      const [cData, sData] = await Promise.all([fetchContainers(), fetchServices()]);
      setManualContainers(cData);
      setServiceCount(sData.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenLogs = (id: string, name: string) => {
    setLogContainer({ id, name });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        containerCount={activeContainers.length}
        serviceCount={serviceCount}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          systemStats={system}
          isConnected={isConnected}
          onRefresh={handleRefresh}
        />

        <main style={{ flex: 1, padding: '28px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          {activeTab === 'dashboard' && (
            <DashboardPage
              systemStats={system}
              containers={activeContainers}
              onViewLogs={handleOpenLogs}
              onOpenAddService={() => setIsAddServiceOpen(true)}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'containers' && (
            <ContainersPage
              containers={activeContainers}
              onViewLogs={handleOpenLogs}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'services' && (
            <ServicesPage
              onOpenAddService={() => setIsAddServiceOpen(true)}
            />
          )}

          {activeTab === 'metrics' && <MetricsPage />}

          {activeTab === 'alerts' && <AlertsPage />}
        </main>
      </div>

      {/* Modals */}
      <LogsModal
        containerId={logContainer?.id ?? null}
        containerName={logContainer?.name ?? null}
        onClose={() => setLogContainer(null)}
      />

      <AddServiceModal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default App;
