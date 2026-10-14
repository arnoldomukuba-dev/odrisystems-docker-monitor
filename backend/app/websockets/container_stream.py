import asyncio
import json
from typing import List
from fastapi import WebSocket, WebSocketDisconnect
from app.services.docker_service import docker_service


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)

        for conn in disconnected:
            self.disconnect(conn)


manager = ConnectionManager()


async def metrics_broadcaster_task():
    """Background loop that periodically broadcasts host and container metrics to active WebSockets."""
    while True:
        try:
            if manager.active_connections:
                host_stats = docker_service.get_host_system_stats()
                containers = docker_service.list_containers()
                
                payload = {
                    "type": "metrics_update",
                    "system": host_stats,
                    "containers": containers
                }
                await manager.broadcast(payload)
        except Exception as e:
            print(f"Error in metrics broadcaster: {e}")

        await asyncio.sleep(2)  # Stream every 2 seconds
