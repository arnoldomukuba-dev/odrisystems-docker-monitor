import docker
from typing import List, Dict, Any, Optional
import psutil
from app.core.config import settings


class DockerService:
    def __init__(self):
        self._client = None

    def get_client(self) -> Optional[docker.DockerClient]:
        if self._client is None:
            try:
                self._client = docker.DockerClient(base_url=settings.DOCKER_HOST)
            except Exception as e:
                print(f"Warning: Could not connect to Docker socket at {settings.DOCKER_HOST}: {e}")
                self._client = None
        return self._client

    def list_containers(self, all_containers: bool = True) -> List[Dict[str, Any]]:
        client = self.get_client()
        if not client:
            return []

        containers_data = []
        try:
            for c in client.containers.list(all=all_containers):
                ports_list = []
                if c.attrs and "NetworkSettings" in c.attrs and "Ports" in c.attrs["NetworkSettings"]:
                    for container_port, host_bindings in (c.attrs["NetworkSettings"]["Ports"] or {}).items():
                        if host_bindings:
                            for binding in host_bindings:
                                ports_list.append({
                                    "private_port": container_port,
                                    "public_port": binding.get("HostPort"),
                                    "host_ip": binding.get("HostIp")
                                })
                        else:
                            ports_list.append({"private_port": container_port, "public_port": None})

                containers_data.append({
                    "id": c.short_id,
                    "full_id": c.id,
                    "name": c.name.lstrip('/'),
                    "image": c.image.tags[0] if c.image.tags else c.image.short_id,
                    "status": c.status,
                    "state": c.attrs.get("State", {}).get("Status", c.status),
                    "created": c.attrs.get("Created", ""),
                    "ports": ports_list,
                    "labels": c.labels or {}
                })
        except Exception as e:
            print(f"Error listing Docker containers: {e}")

        return containers_data

    def get_container_stats(self, container_id: str) -> Optional[Dict[str, Any]]:
        client = self.get_client()
        if not client:
            return None

        try:
            container = client.containers.get(container_id)
            stats = container.stats(stream=False)
            
            # Calculate CPU percentage
            cpu_delta = stats["cpu_stats"]["cpu_usage"]["total_usage"] - stats["precpu_stats"]["cpu_usage"]["total_usage"]
            system_delta = stats["cpu_stats"].get("system_cpu_usage", 0) - stats["precpu_stats"].get("system_cpu_usage", 0)
            online_cpus = stats["cpu_stats"].get("online_cpus", len(stats["cpu_stats"]["cpu_usage"].get("percpu_usage") or [1]))
            
            cpu_percent = 0.0
            if system_delta > 0.0 and cpu_delta > 0.0:
                cpu_percent = (cpu_delta / system_delta) * online_cpus * 100.0

            # Calculate Memory percentage
            mem_usage = stats["memory_stats"].get("usage", 0)
            mem_limit = stats["memory_stats"].get("limit", 1)
            mem_used_mb = mem_usage / (1024 * 1024)
            mem_limit_mb = mem_limit / (1024 * 1024)
            mem_percent = (mem_usage / mem_limit) * 100.0 if mem_limit > 0 else 0.0

            return {
                "id": container.short_id,
                "name": container.name.lstrip('/'),
                "cpu_percent": round(cpu_percent, 2),
                "memory_usage_mb": round(mem_used_mb, 2),
                "memory_limit_mb": round(mem_limit_mb, 2),
                "memory_percent": round(mem_percent, 2),
                "network_rx_kb": 0.0,
                "network_tx_kb": 0.0
            }
        except Exception as e:
            print(f"Error getting container stats for {container_id}: {e}")
            return None

    def container_action(self, container_id: str, action: str) -> Dict[str, Any]:
        client = self.get_client()
        if not client:
            return {"success": False, "message": "Docker client unavailable"}

        try:
            container = client.containers.get(container_id)
            if action == "start":
                container.start()
            elif action == "stop":
                container.stop()
            elif action == "restart":
                container.restart()
            else:
                return {"success": False, "message": f"Unsupported action '{action}'"}

            return {"success": True, "message": f"Container {container.name} {action}ed successfully"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def get_container_logs(self, container_id: str, tail: int = 100) -> str:
        client = self.get_client()
        if not client:
            return "Docker client unavailable"

        try:
            container = client.containers.get(container_id)
            logs = container.logs(tail=tail, timestamps=True)
            return logs.decode("utf-8", errors="replace")
        except Exception as e:
            return f"Error fetching logs: {str(e)}"

    def get_host_system_stats((self)) -> Dict[str, Any]:
        cpu_pct = psutil.cpu_percent(interval=None)
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        containers = self.list_containers(all_containers=True)
        running = sum(1 for c in containers if c["status"] == "running")
        stopped = len(containers) - running

        return {
            "cpu_percent": round(cpu_pct, 1),
            "memory_percent": round(mem.percent, 1),
            "memory_used_mb": round(mem.used / (1024 * 1024), 1),
            "memory_total_mb": round(mem.total / (1024 * 1024), 1),
            "disk_percent": round(disk.percent, 1),
            "active_containers": len(containers),
            "running_containers": running,
            "stopped_containers": stopped
        }


docker_service = DockerService()
