export interface ContainerPort {
  private_port: number;
  public_port?: number;
  host_ip?: string;
}

export interface ContainerInfo {
  id: str;
  full_id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  created: string;
  ports: ContainerPort[];
  labels: Record<string, string>;
}

export interface ContainerStats {
  id: string;
  name: string;
  cpu_percent: number;
  memory_usage_mb: number;
  memory_limit_mb: number;
  memory_percent: number;
  network_rx_kb: number;
  network_tx_kb: number;
}

export interface SystemStats {
  cpu_percent: number;
  memory_percent: number;
  memory_used_mb: number;
  memory_total_mb: number;
  disk_percent: number;
  active_containers: number;
  running_containers: number;
  stopped_containers: number;
}

export interface ServiceCheck {
  id: string;
  name: string;
  target_url: string;
  check_type: string;
  interval_seconds: number;
  expected_status_code: number;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'UNKNOWN';
  last_response_time_ms?: number;
  last_check_at?: string;
  created_at: string;
}

export interface SystemMetricHistory {
  id: string;
  cpu_percent: number;
  memory_percent: number;
  memory_used_mb: number;
  disk_percent: number;
  active_containers: number;
  running_containers: number;
  stopped_containers: number;
  timestamp: string;
}

export interface AlertLog {
  id: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  target: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
}
