import axios from 'axios';
import { ContainerInfo, ContainerStats, ServiceCheck, SystemMetricHistory, AlertLog, SystemStats } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchContainers = async (): Promise<ContainerInfo[]> => {
  const resp = await api.get('/containers');
  return resp.data;
};

export const fetchContainerStats = async (id: string): Promise<ContainerStats> => {
  const resp = await api.get(`/containers/${id}/stats`);
  return resp.data;
};

export const fetchContainerLogs = async (id: string, tail: number = 100): Promise<string> => {
  const resp = await api.get(`/containers/${id}/logs?tail=${tail}`);
  return resp.data.logs;
};

export const performContainerAction = async (id: string, action: 'start' | 'stop' | 'restart'): Promise<{ success: boolean; message: string }> => {
  const resp = await api.post(`/containers/${id}/action`, { action });
  return resp.data;
};

export const fetchServices = async (): Promise<ServiceCheck[]> => {
  const resp = await api.get('/services');
  return resp.data;
};

export const createService = async (service: { name: string; target_url: string; check_type?: string; interval_seconds?: number; expected_status_code?: number }): Promise<ServiceCheck> => {
  const resp = await api.post('/services', service);
  return resp.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`/services/${id}`);
};

export const fetchSystemStats = async (): Promise<SystemStats> => {
  const resp = await api.get('/metrics/system');
  return resp.data;
};

export const fetchMetricsHistory = async (limit: number = 30): Promise<SystemMetricHistory[]> => {
  const resp = await api.get(`/metrics/history?limit=${limit}`);
  return resp.data;
};

export const fetchAlerts = async (limit: number = 50): Promise<AlertLog[]> => {
  const resp = await api.get('/alerts');
  return resp.data;
};
