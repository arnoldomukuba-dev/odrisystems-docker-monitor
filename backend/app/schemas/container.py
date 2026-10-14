from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ContainerPort(BaseModel):
    private_port: int
    public_port: Optional[int] = None
    type: str


class ContainerInfo(BaseModel):
    id: str
    name: str
    image: str
    status: str
    state: str
    created: str
    ports: List[Dict[str, Any]] = []
    labels: Dict[str, str] = {}


class ContainerStats(BaseModel):
    id: str
    name: str
    cpu_percent: float
    memory_usage_mb: float
    memory_limit_mb: float
    memory_percent: float
    network_rx_kb: float
    network_tx_kb: float


class ContainerActionRequest(BaseModel):
    action: str  # start, stop, restart
