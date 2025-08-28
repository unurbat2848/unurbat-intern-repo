# Docker Setup Demo for NestJS

## Files Created

### 1. Dockerfile (Multi-stage build)
```dockerfile
# Stage 1: Build stage
FROM node:18-alpine AS builder
# ... build application

# Stage 2: Production stage  
FROM node:18-alpine AS production
# ... copy built files, create user, run app
```

### 2. docker-compose.yml
Defines three services:
- **nestjs-app**: Our NestJS application (port 3000)
- **postgres**: PostgreSQL database (port 5432)
- **pgadmin**: Database management UI (port 5050)

### 3. Supporting files
- `.dockerignore`: Excludes unnecessary files
- `healthcheck.js`: Docker health check script
- `init-db.sql`: Database initialization script
- `package.json` & `tsconfig.json`: Node.js configuration

## Docker Commands Used

```bash
# Check Docker installation
docker --version
docker-compose --version

# Validate docker-compose.yml
docker-compose config --quiet

# Build and run containers
docker-compose up --build

# Run in background
docker-compose up -d

# Stop containers
docker-compose down
```

## Container Structure

```
nestjs-demo (app container)
├── Node.js 18 Alpine
├── NestJS application
├── Health check
└── Port 3000

postgres-db (database container)  
├── PostgreSQL 15 Alpine
├── Sample data
└── Port 5432

pgadmin (admin container)
├── pgAdmin web UI
└── Port 5050
```

This setup demonstrates how Docker containers work together!