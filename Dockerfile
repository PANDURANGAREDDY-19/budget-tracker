# Multi-stage Dockerfile for Budget Tracker Application
# Backend + Database + Reverse Proxy

# ========== STAGE 1: Python Backend Build ==========
FROM python:3.11-slim AS backend-builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY Integration/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY Integration/ /app/Integration/
COPY Database/ /app/Database/

# ========== STAGE 2: Node.js Frontend Build ==========
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY Frontend/package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY Frontend/ .

# Build frontend
RUN npm run build

# ========== STAGE 3: Production Runtime ==========
FROM python:3.11-slim AS runtime

WORKDIR /app

# Install system dependencies for runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    curl \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# Copy application code
COPY --from=backend-builder /app/Integration /app/Integration
COPY --from=backend-builder /app/Database /app/Database
COPY Integration/requirements.txt /app/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Configure Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/sites-available/default

# Setup supervisord for process management
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create app directory structure
RUN mkdir -p /app/logs \
    && chmod -R 755 /app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose ports
EXPOSE 80 8000 5432

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Run supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
