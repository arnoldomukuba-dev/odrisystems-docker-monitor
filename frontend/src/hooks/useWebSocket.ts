import { useEffect, useState, useRef } from 'react';
import { SystemStats, ContainerInfo } from '../types';

interface WSData {
  system: SystemStats | null;
  containers: ContainerInfo[];
  isConnected: boolean;
}

export const useWebSocket = () => {
  const [data, setData] = useState<WSData>({
    system: null,
    containers: [],
    isConnected: false,
  });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected to ODRISYSTEMS monitor server');
      setData((prev) => ({ ...prev, isConnected: true }));
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'metrics_update') {
          setData({
            system: payload.system,
            containers: payload.containers || [],
            isConnected: true,
          });
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setData((prev) => ({ ...prev, isConnected: false }));
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setData((prev) => ({ ...prev, isConnected: false }));
    };

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, []);

  return data;
};
