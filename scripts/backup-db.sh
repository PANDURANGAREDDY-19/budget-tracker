#!/bin/bash

# Database Backup Script
# Creates automated backups of PostgreSQL database
# Usage: ./backup-db.sh [backup-name]

set -e

# Configuration
BACKUP_DIR="./Database/backups"
DB_CONTAINER="budget-tracker-db"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-budget_tracker}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="${1:-backup_${TIMESTAMP}}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
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

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log_info "Starting database backup: $BACKUP_NAME"

# Check if Docker container is running
if ! docker ps | grep -q "$DB_CONTAINER"; then
    log_error "Database container '$DB_CONTAINER' is not running"
    exit 1
fi

# Perform backup
BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.sql"

log_info "Backing up database to: $BACKUP_FILE"

docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    log_success "Backup completed: $BACKUP_FILE"
    
    # Compress backup
    log_info "Compressing backup..."
    gzip "$BACKUP_FILE"
    log_success "Compressed backup: ${BACKUP_FILE}.gz"
    
    # Display backup info
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    log_info "Backup size: $BACKUP_SIZE"
    
    # Cleanup old backups (keep only last 7 days)
    log_info "Cleaning up old backups (older than 7 days)..."
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
    log_success "Old backups cleaned"
    
else
    log_error "Backup failed"
    exit 1
fi
