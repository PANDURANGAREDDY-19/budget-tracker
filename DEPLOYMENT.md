# Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Civic Budget Transparency & Project Accountability Platform to different environments (local, staging, production). The deployment uses Docker, Docker Compose, and a GitLab CI/CD pipeline for automated testing and deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Staging Deployment](#staging-deployment)
4. [Production Deployment](#production-deployment)
5. [GitLab CI/CD Pipeline](#gitlab-cicd-pipeline)
6. [Backup & Recovery](#backup--recovery)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
8. [Security Checklist](#security-checklist)

---

## Prerequisites

### System Requirements

- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: Version 2.30+
- **Disk Space**: Minimum 10GB available
- **Memory**: Minimum 4GB RAM
- **Operating System**: Linux, macOS, or Windows (WSL2)

### Required Tools

```bash
# Verify installation
docker --version
docker-compose --version
git --version
```

### Environment Variables

Create a `.env.local` file from the template:

```bash
cp .env.example .env.local
```

Update the following critical variables:

```env
# Database
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=budget_tracker

# API Keys
GOOGLE_API_KEY=your_google_gemini_api_key

# Security
SECRET_KEY=your_secret_key_here

# Domain
DOMAIN=localhost
HTTPS_ENABLED=false
```

---

## Local Development Setup

### Quick Start

```bash
# 1. Clone the repository
git clone https://gitlab.com/your-org/public-budget-tracker.git
cd public-budget-tracker

# 2. Setup pre-commit hooks (optional but recommended)
pre-commit install

# 3. Run pre-deployment checks
./scripts/pre-deploy-checks.sh local

# 4. Initialize and start the application
./scripts/deploy.sh local setup
./scripts/deploy.sh local start
```

### Verification

Once deployed, verify the application:

```bash
# Check service status
./scripts/deploy.sh local status

# View logs
./scripts/deploy.sh local logs

# Test endpoints
curl http://localhost:8000/health          # Backend
curl http://localhost:3000                 # Frontend
curl http://localhost/health               # Nginx
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Nginx**: http://localhost

### Development Commands

```bash
# Stop all services
./scripts/deploy.sh local stop

# Restart all services
./scripts/deploy.sh local restart

# View live logs
./scripts/deploy.sh local logs

# Access database
docker-compose exec postgres psql -U postgres -d budget_tracker

# Database backup
./scripts/backup-db.sh my_backup

# Database restore
./scripts/restore-db.sh ./Database/backups/my_backup.sql.gz
```

---

## Staging Deployment

### Prerequisites

- Staging server with public IP
- Domain name (e.g., `staging-budget-tracker.example.com`)
- SSL certificate or Let's Encrypt setup
- SSH access to staging server

### Deployment Steps

#### 1. Prepare Staging Server

```bash
# SSH into staging server
ssh user@staging.example.com

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /opt/budget-tracker
sudo chown $USER:$USER /opt/budget-tracker
```

#### 2. Clone and Setup

```bash
cd /opt/budget-tracker

# Clone repository
git clone https://gitlab.com/your-org/public-budget-tracker.git .

# Create environment file
cp .env.example .env.staging

# Update environment variables
nano .env.staging

# Update values:
# DB_USER, DB_PASSWORD, DB_NAME, GOOGLE_API_KEY, DOMAIN
```

#### 3. Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d staging-budget-tracker.example.com

# The certificate will be at:
# /etc/letsencrypt/live/staging-budget-tracker.example.com/
```

#### 4. Deploy Application

```bash
# Run pre-deployment checks
./scripts/pre-deploy-checks.sh staging

# Setup staging environment
./scripts/deploy.sh staging setup

# Start services
./scripts/deploy.sh staging start

# Verify deployment
./scripts/deploy.sh staging status
```

#### 5. Configure Nginx (with SSL)

Create `/opt/budget-tracker/nginx-prod.conf`:

```nginx
# See nginx-staging.conf for reference
# Update server_name and SSL paths
```

Restart Nginx:

```bash
./scripts/deploy.sh staging restart
```

#### 6. Setup Automated Backups

```bash
# Create backup directory
mkdir -p ./Database/backups

# Add to crontab
crontab -e

# Add this line to backup daily at 2 AM
0 2 * * * cd /opt/budget-tracker && ./scripts/backup-db.sh >> ./logs/backup.log 2>&1
```

### Monitoring Staging

```bash
# View logs
./scripts/deploy.sh staging logs

# Check service health
curl https://staging-budget-tracker.example.com/health

# Monitor disk usage
df -h ./Database/backups

# Check container resources
docker stats
```

---

## Production Deployment

### Prerequisites

- Production server with high availability setup
- Load balancer (optional)
- Domain name with DNS configured
- SSL certificate (production-grade)
- Monitoring and alerting system
- Backup infrastructure

### Deployment Steps

#### 1. Production Server Setup

```bash
# SSH into production server
ssh user@prod.example.com

# Install required tools (same as staging)
# ... (see staging steps above)

# Create production directories
sudo mkdir -p /opt/budget-tracker
sudo mkdir -p /var/log/budget-tracker
sudo mkdir -p /data/budget-tracker/backups
sudo chown -R appuser:appuser /opt/budget-tracker
```

#### 2. Clone Repository

```bash
cd /opt/budget-tracker
git clone https://gitlab.com/your-org/public-budget-tracker.git .

# Checkout specific release tag (recommended for production)
git checkout v0.1.0  # Use appropriate version tag
```

#### 3. Configure Environment

```bash
cp .env.example .env.production

# Edit with production values
nano .env.production

# CRITICAL SETTINGS:
# DEBUG=false
# LOG_LEVEL=warning
# ENVIRONMENT=production
# Use strong DB_PASSWORD
# Configure GOOGLE_API_KEY
# Set proper DOMAIN
# HTTPS_ENABLED=true
```

#### 4. Setup SSL (Let's Encrypt)

```bash
# Setup wildcard SSL for *.budget-tracker.gov
sudo certbot certonly --standalone -d budget-tracker.gov -d "*.budget-tracker.gov"

# Or use DNS validation for better security
sudo certbot certonly --dns-<provider> -d budget-tracker.gov -d "*.budget-tracker.gov"
```

#### 5. Database Setup

```bash
# Create database backup directory
sudo mkdir -p /data/budget-tracker/backups
sudo chown postgres:postgres /data/budget-tracker/backups

# Initialize database
./scripts/deploy.sh production setup

# Verify database connection
docker-compose -f docker-compose.production.yml exec postgres pg_isready
```

#### 6. Deploy Application

```bash
# Pre-deployment checks
./scripts/pre-deploy-checks.sh production

# Deploy
./scripts/deploy.sh production setup
./scripts/deploy.sh production start

# Verify all services
./scripts/deploy.sh production status

# Health checks
curl https://budget-tracker.gov/health
curl https://budget-tracker.gov/api/health
```

#### 7. Setup Monitoring & Logging

```bash
# Create log directory
mkdir -p /var/log/budget-tracker
chmod 755 /var/log/budget-tracker

# Configure log rotation
sudo tee /etc/logrotate.d/budget-tracker > /dev/null <<EOF
/var/log/budget-tracker/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
EOF
```

#### 8. Setup Automated Backups

```bash
# Create backup schedule
crontab -e

# Add backup jobs
0 2 * * * cd /opt/budget-tracker && ./scripts/backup-db.sh >> /var/log/budget-tracker/backup.log 2>&1
0 3 * * 0 cd /opt/budget-tracker && tar -czf /data/budget-tracker/backups/app_backup_$(date +\%Y\%m\%d).tar.gz /opt/budget-tracker

# Store off-site backups
# Configure S3/GCS/Azure Storage for off-site backup replication
```

#### 9. Setup Uptime Monitoring

```bash
# Install monitoring agent (example: DataDog)
DD_AGENT_MAJOR_VERSION=7 DD_API_KEY=<key> DD_SITE=datadoghq.com bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_agent.sh)"

# Or use open-source monitoring (Prometheus, Grafana, etc.)
# Configure alerts for:
# - Service down
# - High CPU/Memory usage
# - Database errors
# - Disk space low
```

---

## GitLab CI/CD Pipeline

### Pipeline Overview

The project includes a comprehensive `.gitlab-ci.yml` with the following stages:

1. **Validate** - Code quality checks (linting, type checking)
2. **Test** - Unit tests and coverage reports
3. **Security** - Secret scanning, dependency audits
4. **Build** - Docker image creation
5. **Deploy** - Automated or manual deployment to staging/production

### Pipeline Stages

#### 1. Validation Stage

Runs automatically on every push:
- **Ruff** - Python linting
- **Mypy** - Python type checking
- **ESLint** - JavaScript linting
- **YAML validation**

#### 2. Test Stage

Runs after validation:
- Python unit tests with coverage
- Frontend build verification
- Coverage reports in HTML format

#### 3. Security Stage

Security scanning:
- **Gitleaks** - Secret detection
- **pip-audit** - Python dependency vulnerabilities
- **npm audit** - JavaScript vulnerabilities
- **Bandit** - Python code security issues

#### 4. Build Stage

Docker image creation (on main/develop branches):
- Builds backend image
- Builds frontend image
- Pushes to registry

#### 5. Deploy Stage

Manual deployment triggers:
- **Staging** - Deploy to staging environment
- **Production** - Deploy to production (main branch only)

### Triggering Deployments

#### Manual Deployment

```bash
# 1. Go to GitLab project -> CI/CD -> Pipelines
# 2. Find the pipeline for your commit
# 3. Click the play button next to the deployment job
# 4. Confirm deployment
```

#### Automatic Deployment (Optional)

To enable automatic production deployment:

```yaml
# Modify .gitlab-ci.yml
deploy:production:
  when: on_success  # Change from manual to automatic
```

### CI/CD Variables

Configure in GitLab project settings:
- `DOCKER_REGISTRY_USER` - Docker registry username
- `DOCKER_REGISTRY_PASSWORD` - Docker registry password
- `DOCKER_REGISTRY` - Docker registry URL
- `DB_PASSWORD` - Production database password
- `GOOGLE_API_KEY` - Gemini API key
- `DEPLOY_KEY` - SSH key for production server
- `DEPLOY_USER` - SSH user for production server
- `PRODUCTION_HOST` - Production server IP/domain
- `PRODUCTION_PATH` - Path on production server

### Monitoring Pipeline

```bash
# View pipeline status
# Navigate to: Project -> CI/CD -> Pipelines

# View detailed logs
# Click on a job name to see full output

# Check coverage reports
# Each test job generates coverage HTML report
```

---

## Backup & Recovery

### Automated Backups

The deployment includes automated backup scripts:

```bash
# Manual backup
./scripts/backup-db.sh my_backup_name

# Automatic backups (via cron)
# Configured in server crontab
# Runs daily at 2 AM
```

### Backup Contents

- PostgreSQL database dump
- Application configuration
- Uploaded files and evidence

### Restore from Backup

```bash
# List available backups
ls ./Database/backups/

# Restore from backup
./scripts/restore-db.sh ./Database/backups/backup_20240602.sql.gz

# Verify restoration
docker-compose exec postgres psql -U postgres -d budget_tracker -c "SELECT COUNT(*) FROM public.projects;"
```

### Off-Site Backup Strategy

```bash
# Upload backups to S3
aws s3 cp ./Database/backups/ s3://my-backup-bucket/ --recursive

# Restore from S3
aws s3 cp s3://my-backup-bucket/backup_20240602.sql.gz ./Database/backups/
./scripts/restore-db.sh ./Database/backups/backup_20240602.sql.gz
```

---

## Monitoring & Troubleshooting

### Health Checks

```bash
# Check all services
./scripts/deploy.sh [env] status

# Individual service checks
curl http://localhost:8000/health      # Backend
curl http://localhost:3000             # Frontend
curl http://localhost:80/health        # Nginx

# Database connectivity
docker-compose exec postgres pg_isready
```

### Common Issues

#### Service Not Starting

```bash
# Check logs
./scripts/deploy.sh [env] logs

# Common causes:
# 1. Port already in use
# 2. Insufficient disk space
# 3. Database connection error
# 4. Missing environment variables

# Solution:
./scripts/deploy.sh [env] restart
```

#### Database Connection Error

```bash
# Check database container
docker ps | grep postgres

# Check database logs
docker logs budget-tracker-db

# Reset database
docker-compose down -v  # WARNING: Deletes data
./scripts/deploy.sh [env] setup
```

#### High Disk Usage

```bash
# Check disk space
df -h

# Check container sizes
docker system df

# Clean up old logs
find ./logs -name "*.log" -mtime +30 -delete

# Clean up Docker
docker system prune -a
```

### Performance Monitoring

```bash
# Monitor CPU and memory
docker stats

# Check database performance
docker-compose exec postgres psql -U postgres -d budget_tracker -c "\dt+"

# View slow queries (if enabled)
docker-compose exec postgres tail -f /var/log/postgresql/postgresql.log
```

### Log Files

```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Nginx logs
docker-compose logs nginx

# Database logs
docker-compose logs postgres
```

---

## Security Checklist

### Pre-Deployment

- [ ] Changed all default passwords
- [ ] Set strong `SECRET_KEY` and `DB_PASSWORD`
- [ ] Configured SSL/TLS certificates
- [ ] Reviewed and updated `ALLOWED_HOSTS`
- [ ] Configured CORS properly
- [ ] Set `DEBUG=false` in production
- [ ] Enabled HTTPS enforcement
- [ ] Configured firewall rules

### During Deployment

- [ ] Verified `.env.production` has no sample values
- [ ] Tested database connectivity
- [ ] Verified all environment variables are set
- [ ] Checked SSL certificate validity
- [ ] Confirmed backup system is working
- [ ] Verified monitoring is active

### Post-Deployment

- [ ] Tested application functionality
- [ ] Verified SSL certificate (check browser)
- [ ] Confirmed health check endpoints respond
- [ ] Tested user authentication
- [ ] Verified file upload functionality
- [ ] Checked API endpoint access
- [ ] Reviewed application logs for errors
- [ ] Set up monitoring and alerts

### Ongoing Security

- [ ] Keep Docker images updated
- [ ] Monitor security advisories
- [ ] Run `pip-audit` and `npm audit` regularly
- [ ] Rotate SSL certificates before expiry
- [ ] Review access logs for anomalies
- [ ] Keep backup copies off-site
- [ ] Test disaster recovery procedures

---

## Troubleshooting Guide

### Problem: "Port already in use"

```bash
# Find process using port
lsof -i :8000
lsof -i :3000
lsof -i :80

# Kill process (if safe)
kill -9 <PID>

# Or use different port in docker-compose
```

### Problem: "Out of disk space"

```bash
# Clean up Docker images
docker system prune -a

# Clean up old backups
find ./Database/backups -name "*.sql.gz" -mtime +30 -delete

# Check large directories
du -sh ./Database/backups
du -sh ./logs
```

### Problem: "Database connection refused"

```bash
# Verify database is running
docker-compose ps | grep postgres

# Check database logs
docker-compose logs postgres

# Verify credentials in .env file
cat .env.local | grep DB_

# Try connecting directly
docker-compose exec postgres psql -U postgres
```

### Problem: "Frontend not loading"

```bash
# Check Nginx logs
docker-compose logs nginx

# Verify frontend service is running
docker-compose ps | grep frontend

# Check browser console for errors
# Open browser DevTools (F12) and check Console tab

# Verify API connection
curl http://localhost:8000/health
```

---

## Support and Documentation

- **Documentation**: See [README.md](README.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **User Manual**: See [USER_MANUAL.md](USER_MANUAL.md)
- **Security**: See [SECURITY.md](SECURITY.md)
- **GitLab Issues**: Create an issue in the project repository

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Last Updated**: June 2, 2024  
**Version**: 1.0  
**Author**: KOTTE PANDURANGAREDDY
