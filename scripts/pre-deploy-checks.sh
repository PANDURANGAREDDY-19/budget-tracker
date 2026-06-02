#!/bin/bash

# Pre-deployment Checks
# Validates environment before deployment
# Usage: ./pre-deploy-checks.sh [environment]

set -e

ENVIRONMENT=${1:-local}

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

PASSED=0
FAILED=0

echo "Budget Tracker Pre-Deployment Checks"
echo "Environment: $ENVIRONMENT"
echo ""

# Check Docker
log_info "Checking Docker installation..."
if command -v docker &> /dev/null; then
    log_success "Docker is installed"
    ((PASSED++))
else
    log_error "Docker is not installed"
    ((FAILED++))
fi

# Check Docker Compose
log_info "Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    log_success "Docker Compose is installed"
    ((PASSED++))
else
    log_error "Docker Compose is not installed"
    ((FAILED++))
fi

# Check environment file
log_info "Checking environment file..."
ENV_FILE=".env.${ENVIRONMENT}"
if [ -f "$ENV_FILE" ]; then
    log_success "Environment file found: $ENV_FILE"
    ((PASSED++))
    
    # Check required variables
    log_info "Checking required environment variables..."
    REQUIRED_VARS=("DB_USER" "DB_PASSWORD" "DB_NAME" "GOOGLE_API_KEY")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" "$ENV_FILE"; then
            VALUE=$(grep "^${var}=" "$ENV_FILE" | cut -d'=' -f2)
            if [ ! -z "$VALUE" ] && [[ ! "$VALUE" =~ "your_" ]]; then
                log_success "Variable $var is set"
                ((PASSED++))
            else
                log_warn "Variable $var is not configured (placeholder value)"
                ((FAILED++))
            fi
        else
            log_warn "Variable $var is missing"
            ((FAILED++))
        fi
    done
else
    log_error "Environment file not found: $ENV_FILE"
    ((FAILED++))
fi

# Check docker-compose file
log_info "Checking docker-compose file..."
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"
if [ -f "$COMPOSE_FILE" ]; then
    log_success "Docker Compose file found: $COMPOSE_FILE"
    ((PASSED++))
else
    log_error "Docker Compose file not found: $COMPOSE_FILE"
    ((FAILED++))
fi

# Check required source directories
log_info "Checking source directories..."
REQUIRED_DIRS=("Frontend" "Integration" "Database")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        log_success "Directory found: $dir"
        ((PASSED++))
    else
        log_error "Directory not found: $dir"
        ((FAILED++))
    fi
done

# Check Dockerfile
log_info "Checking Dockerfiles..."
REQUIRED_DOCKERFILES=("Dockerfile" "Dockerfile.backend" "Dockerfile.frontend")
for dockerfile in "${REQUIRED_DOCKERFILES[@]}"; do
    if [ -f "$dockerfile" ]; then
        log_success "Dockerfile found: $dockerfile"
        ((PASSED++))
    else
        log_error "Dockerfile not found: $dockerfile"
        ((FAILED++))
    fi
done

# Check disk space
log_info "Checking disk space..."
AVAILABLE_SPACE=$(df /tmp | awk 'NR==2 {print $4}')
if [ "$AVAILABLE_SPACE" -gt 5242880 ]; then  # 5GB in KB
    log_success "Sufficient disk space available: $((AVAILABLE_SPACE / 1048576))GB"
    ((PASSED++))
else
    log_warn "Low disk space available: $((AVAILABLE_SPACE / 1048576))GB"
    ((FAILED++))
fi

# Summary
echo ""
echo "========================================="
echo "Pre-Deployment Check Summary"
echo "========================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "========================================="

if [ $FAILED -eq 0 ]; then
    log_success "All checks passed! Ready for deployment."
    exit 0
else
    log_error "Some checks failed. Please fix the issues before deploying."
    exit 1
fi
