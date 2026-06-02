#!/bin/bash

# Database Restore Script
# Restores PostgreSQL database from backup
# Usage: ./restore-db.sh [backup-file]

set -e

# Configuration
BACKUP_DIR="./Database/backups"
DB_CONTAINER="budget-tracker-db"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-budget_tracker}"

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

# Validate backup file argument
if [ -z "$1" ]; then
    log_error "No backup file specified"
    echo ""
    echo "Usage: ./restore-db.sh [backup-file]"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR" 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    log_info "Decompressing backup file..."
    TEMP_FILE=$(mktemp)
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    BACKUP_FILE=$TEMP_FILE
fi

# Confirm restoration
log_warn "This will overwrite the existing database: $DB_NAME"
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    log_info "Restoration cancelled"
    exit 0
fi

# Check if Docker container is running
if ! docker ps | grep -q "$DB_CONTAINER"; then
    log_error "Database container '$DB_CONTAINER' is not running"
    exit 1
fi

log_info "Starting database restoration: $BACKUP_FILE"

# Drop and recreate database
log_info "Dropping existing database..."
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS \"$DB_NAME\";" || true

log_info "Creating new database..."
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -c "CREATE DATABASE \"$DB_NAME\";"

# Restore database
log_info "Restoring database from backup..."
cat "$BACKUP_FILE" | docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME"

if [ $? -eq 0 ]; then
    log_success "Database restoration completed successfully"
else
    log_error "Database restoration failed"
    exit 1
fi

# Cleanup temp file if it was decompressed
if [ ! -z "$TEMP_FILE" ] && [ -f "$TEMP_FILE" ]; then
    rm "$TEMP_FILE"
fi
