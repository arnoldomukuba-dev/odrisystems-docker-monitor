import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.api import api_router
from app.websockets.container_stream import manager, metrics_broadcaster_task
from app.services.monitor_worker import service_monitor_task


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables automatically if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Start background tasks
    broadcaster = asyncio.create_task(metrics_broadcaster_task())
    monitor = asyncio.create_task(service_monitor_task())

    yield

    # Shutdown: Cancel background tasks
    broadcaster.cancel()
    monitor.cancel()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include V1 API Routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep socket alive and receive client messages if any
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
