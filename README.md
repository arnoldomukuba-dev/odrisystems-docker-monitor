# ODRISYSTEMS Dockerized Service Monitor

A production-grade, real-time Docker container & service infrastructure monitoring platform built with **FastAPI**, **React (TypeScript + Vite)**, **PostgreSQL**, **Nginx**, and **Docker Compose**.

## Features

- 🐳 **Real-Time Docker Monitoring**: Inspect running containers, CPU/RAM resource graphs, container logs, and health status directly via the Docker socket.
- 🌐 **Service Health Checks**: Monitor HTTP/TCP external services with automated background polling and uptime metrics.
- ⚡ **WebSocket Live Streaming**: High-frequency metric streaming for dashboard widgets.
- 🔒 **Secure Auth & RBAC**: JWT authentication for system security.
- 🛡️ **Containerized Architecture**: Single-command deployment via Docker Compose with Nginx reverse proxy.

## Architecture

- **Backend**: FastAPI + SQLAlchemy (Async) + Alembic + Docker SDK
- **Frontend**: React + TypeScript + Vite + Tailwind CSS / Lucide Icons + Recharts
- **Database**: PostgreSQL 16
- **Proxy**: Nginx Gateway (`:80`)

## Quick Start

```bash
# 1. Clone & copy environment template
cp .env.example .env

# 2. Build and launch services
docker compose up --build -d

# 3. Access Dashboard
# Open http://localhost in your browser
```
