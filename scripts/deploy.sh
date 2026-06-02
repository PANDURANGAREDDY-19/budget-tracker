#!/bin/bash

# Budget Tracker Deployment Script
# This script handles deployment to different environments
# Usage: ./deploy.sh [environment] [action]
#
# Environments: local, staging, production
# Actions: setup, build, start, stop, restart, logs, status

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="budget-tracker"
ENVIRONMENTS=("local" "staging" "production")
ACTIONS=("setup" "build" "start" "stop" "restart" "logs" "status")

# ========== HELPER FUNCTIONS ==========

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    log_success "Docker is installed"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    log_success "Docker Compose is installed"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed"
        exit 1
    fi
    log_success "Git is installed"
}

load_environment() {
    local env=$1
    local env_file=".env.${env}"
    
    if [ ! -f "$env_file" ]; then
        log_warn "Environment file $env_file not found, using .env.example as template"
        if [ ! -f ".env.example" ]; then
            log_error ".env.example not found"
            exit 1
        fi
        cp .env.example "$env_file"
        log_info "Created $env_file from .env.example - please update with actual values"
    fi
    
    export $(cat "$env_file" | grep -v '#' | xargs)
}

build_images() {
    local env=$1
    log_info "Building Docker images for $env..."
    
    docker-compose -f docker-compose.${env}.yml build --no-cache
    
    log_success "Images built successfully"
}

start_services() {
    local env=$1
    log_info "Starting services for $env..."
    
    docker-compose -f docker-compose.${env}.yml up -d
    
    sleep 5
    
    log_success "Services started"
    show_status "$env"
}

stop_services() {
    local env=$1
    log_info "Stopping services for $env..."
    
    docker-compose -f docker-compose.${env}.yml down
    
    log_success "Services stopped"
}

restart_services() {
    local env=$1
    log_info "Restarting services for $env..."
    
    docker-compose -f docker-compose.${env}.yml restart
    
    sleep 5
    
    log_success "Services restarted"
}

show_logs() {
    local env=$1
    log_info "Showing logs for $env..."
    
    docker-compose -f docker-compose.${env}.yml logs -f
}

show_status() {
    local env=$1
    log_info "Service status for $env:"
    
    docker-compose -f docker-compose.${env}.yml ps
}

setup_environment() {
    local env=$1
    
    log_info "Setting up environment: $env"
    
    # Load environment variables
    load_environment "$env"
    
    # Check prerequisites
    check_prerequisites
    
    # Create necessary directories
    log_info "Creating directories..."
    mkdir -p logs backups
    
    # Build images
    build_images "$env"
    
    # Initialize database
    if [ "$env" != "local" ]; then
        log_info "Initializing database..."
        docker-compose -f docker-compose.${env}.yml exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -f /docker-entrypoint-initdb.d/init.sql || true
    fi
    
    log_success "Environment $env setup complete!"
}

validate_environment() {
    local env=$1
    
    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${env} " ]]; then
        log_error "Invalid environment: $env"
        echo "Valid environments: ${ENVIRONMENTS[@]}"
        exit 1
    fi
}

validate_action() {
    local action=$1
    
    if [[ ! " ${ACTIONS[@]} " =~ " ${action} " ]]; then
        log_error "Invalid action: $action"
        echo "Valid actions: ${ACTIONS[@]}"
        exit 1
    fi
}

# ========== MAIN EXECUTION ==========

main() {
    local environment=${1:-local}
    local action=${2:-start}
    
    # Validate inputs
    validate_environment "$environment"
    validate_action "$action"
    
    log_info "Budget Tracker Deployment Tool"
    log_info "Environment: $environment"
    log_info "Action: $action"
    echo ""
    
    # Execute action
    case $action in
        setup)
            setup_environment "$environment"
            ;;
        build)
            load_environment "$environment"
            build_images "$environment"
            ;;
        start)
            load_environment "$environment"
            start_services "$environment"
            ;;
        stop)
            stop_services "$environment"
            ;;
        restart)
            load_environment "$environment"
            restart_services "$environment"
            ;;
        logs)
            show_logs "$environment"
            ;;
        status)
            show_status "$environment"
            ;;
        *)
            log_error "Unknown action: $action"
            exit 1
            ;;
    esac
}

# Print usage
if [ "$1" == "--help" ] || [ "$1" == "-h" ] || [ "$#" -eq 0 ]; then
    echo "Budget Tracker Deployment Script"
    echo ""
    echo "Usage: ./scripts/deploy.sh [ENVIRONMENT] [ACTION]"
    echo ""
    echo "Environments:"
    echo "  local       - Local development environment (default)"
    echo "  staging     - Staging environment"
    echo "  production  - Production environment"
    echo ""
    echo "Actions:"
    echo "  setup       - Initialize environment (install, build, configure)"
    echo "  build       - Build Docker images"
    echo "  start       - Start all services"
    echo "  stop        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  logs        - View service logs"
    echo "  status      - Show service status"
    echo ""
    echo "Examples:"
    echo "  ./scripts/deploy.sh local setup          # Setup local environment"
    echo "  ./scripts/deploy.sh local start          # Start local services"
    echo "  ./scripts/deploy.sh staging build        # Build staging images"
    echo "  ./scripts/deploy.sh production start     # Start production services"
    echo ""
    exit 0
fi

main "$@"
