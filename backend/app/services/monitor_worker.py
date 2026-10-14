import asyncio
import time
import httpx
from datetime import datetime
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.service import ServiceCheck
from app.models.metric import SystemMetric
from app.models.alert import AlertLog
from app.services.docker_service import docker_service


async def check_single_service(service: ServiceCheck) -> dict:
    """Executes a single HTTP service check."""
    start_time = time.time()
    status = "OFFLINE"
    response_time = 0.0

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(service.target_url)
            elapsed = (time.time() - start_time) * 1000.0
            response_time = round(elapsed, 2)

            if resp.status_code == service.expected_status_code:
                status = "ONLINE"
            else:
                status = "DEGRADED"
    except Exception as e:
        status = "OFFLINE"
        response_time = 0.0

    return {
        "status": status,
        "response_time_ms": response_time
    }


async def service_monitor_task():
    """Background task for periodically checking service health and recording system metrics."""
    while True:
        try:
            async with AsyncSessionLocal() as session:
                # 1. Record System Metrics to DB
                sys_stats = docker_service.get_host_system_stats()
                metric = SystemMetric(
                    cpu_percent=sys_stats["cpu_percent"],
                    memory_percent=sys_stats["memory_percent"],
                    memory_used_mb=sys_stats["memory_used_mb"],
                    disk_percent=sys_stats["disk_percent"],
                    active_containers=sys_stats["active_containers"],
                    running_containers=sys_stats["running_containers"],
                    stopped_containers=sys_stats["stopped_containers"],
                    timestamp=datetime.utcnow()
                )
                session.add(metric)

                # 2. Check Service Health
                result = await session.execute(select(ServiceCheck))
                services = result.scalars().all()

                for svc in services:
                    res = await check_single_service(svc)
                    prev_status = svc.status
                    svc.status = res["status"]
                    svc.last_response_time_ms = res["response_time_ms"]
                    svc.last_check_at = datetime.utcnow()

                    # Trigger alert log on status change
                    if prev_status != "UNKNOWN" and prev_status != svc.status and svc.status == "OFFLINE":
                        alert = AlertLog(
                            severity="CRITICAL",
                            target=svc.name,
                            message=f"Service '{svc.name}' is now OFFLINE! Target: {svc.target_url}",
                            is_resolved=False
                        )
                        session.add(alert)
                    elif prev_status == "OFFLINE" and svc.status == "ONLINE":
                        alert = AlertLog(
                            severity="INFO",
                            target=svc.name,
                            message=f"Service '{svc.name}' has recovered and is now ONLINE.",
                            is_resolved=True
                        )
                        session.add(alert)

                await session.commit()
        except Exception as e:
            print(f"Error in service monitor background task: {e}")

        await asyncio.sleep(15)  # Run healthchecks every 15 seconds
