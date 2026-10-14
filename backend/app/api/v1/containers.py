from fastapi import APIRouter, HTTPException
from typing import List
from app.services.docker_service import docker_service
from app.schemas.container import ContainerInfo, ContainerStats, ContainerActionRequest

router = APIRouter()


@router.get("", response_model=List[ContainerInfo])
async def list_containers():
    """Retrieve all Docker containers on the host machine."""
    return docker_service.list_containers(all_containers=True)


@router.get("/{container_id}/stats", response_model=ContainerStats)
async def get_container_stats(container_id: str):
    """Retrieve live CPU, Memory, and Network stats for a specific container."""
    stats = docker_service.get_container_stats(container_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Container not found or stats unavailable")
    return stats


@router.get("/{container_id}/logs")
async def get_container_logs(container_id: str, tail: int = 100):
    """Retrieve recent log output for a container."""
    logs = docker_service.get_container_logs(container_id, tail=tail)
    return {"logs": logs}


@router.post("/{container_id}/action")
async def perform_container_action(container_id: str, req: ContainerActionRequest):
    """Start, Stop, or Restart a Docker container."""
    res = docker_service.container_action(container_id, req.action)
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("message"))
    return res
