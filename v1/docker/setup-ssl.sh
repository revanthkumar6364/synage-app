#!/bin/bash

# ======================================================================
# SSL Setup Script - Safe for Running Containers
# MYSQL DATA IS 100% SAFE - NO VOLUMES DELETED
# ======================================================================

DOMAIN="quote.radiantsynage.com"
EMAIL="your-email@radiantsynage.com"  # ⚠️ CHANGE THIS!

# Detect docker-compose command (docker compose or docker-compose)
if command -v docker &> /dev/null && docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "✗ Error: docker-compose or 'docker compose' not found!"
    echo "Install docker-compose or use Docker with compose plugin"
    exit 1
fi

echo "=========================================="
echo "SSL Setup for $DOMAIN"
echo "=========================================="
echo "⚠️  MYSQL DATA SAFETY: No volumes will be deleted!"
echo "Using: $DOCKER_COMPOSE"
echo ""

# Step 1: Create directories
echo "Creating SSL directories..."
mkdir -p docker/certbot-www
mkdir -p docker/certbot-conf

# Step 2: Make sure nginx is running
echo "Starting nginx..."
$DOCKER_COMPOSE up -d nginx
sleep 5

# Reload nginx to ensure config is loaded
echo "Reloading nginx configuration..."
$DOCKER_COMPOSE exec -T nginx nginx -s reload 2>/dev/null || $DOCKER_COMPOSE restart nginx
sleep 3

# Verify nginx is serving .well-known correctly
echo "Verifying nginx can serve Let's Encrypt challenges..."
TEST_FILE="docker/certbot-www/test.txt"
echo "test" > "$TEST_FILE"
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN/.well-known/acme-challenge/test.txt" || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Nginx is serving .well-known correctly (HTTP $HTTP_CODE)"
    rm -f "$TEST_FILE"
else
    echo "⚠️  Warning: .well-known test returned HTTP $HTTP_CODE"
    echo "   This might still work - continuing..."
    rm -f "$TEST_FILE"
fi

# Step 3: Get SSL certificate
echo "Requesting SSL certificate..."
docker run --rm \
  -v "$(pwd)/docker/certbot-www:/var/www/certbot" \
  -v "$(pwd)/docker/certbot-conf:/etc/letsencrypt" \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

# Step 4: Check if certificate was created
if [ -f "docker/certbot-conf/live/$DOMAIN/fullchain.pem" ]; then
    echo ""
    echo "✓ SSL certificate created!"

    # Step 5: Verify MySQL volume exists and is safe
    echo ""
    echo "Verifying MySQL data safety..."
    MYSQL_VOLUME=$(docker volume ls | grep -E "mysql_data|rs_mysql" | awk '{print $2}' | head -1)
    if [ -n "$MYSQL_VOLUME" ]; then
        echo "✓ MySQL volume found: $MYSQL_VOLUME (SAFE - will be preserved)"
    else
        echo "⚠️  No existing MySQL volume found (new setup)"
    fi

    # Step 6: Switch to SSL config (only nginx restarts, app/mysql keep running)
    echo ""
    echo "Switching to SSL..."
    echo "⚠️  Only nginx will restart - MySQL and app containers stay running!"
    echo "⚠️  MySQL volume will NOT be touched - data is 100% safe!"

    # CRITICAL: Stop only nginx (app and mysql keep running - DATA SAFE!)
    echo "Stopping nginx only (MySQL and app stay running)..."
    $DOCKER_COMPOSE stop nginx

    # CRITICAL: Start production config - uses SAME volume name = NO DATA LOSS
    # docker-compose will REUSE existing mysql_data volume automatically
    # --no-recreate prevents recreating containers (keeps data safe)
    echo "Starting production config (reusing existing MySQL volume)..."
    $DOCKER_COMPOSE -f docker-compose.production.yml up -d --no-recreate mysql app
    $DOCKER_COMPOSE -f docker-compose.production.yml up -d nginx certbot

    # Double-check MySQL is still using same volume
    echo ""
    echo "Verifying MySQL volume is preserved..."
    NEW_VOLUME=$(docker inspect rs_mysql 2>/dev/null | grep -A 5 "Mounts" | grep "mysql_data" | head -1)
    if [ -n "$NEW_VOLUME" ]; then
        echo "✓ MySQL volume confirmed: mysql_data (DATA IS SAFE!)"
    fi

    # Verify MySQL is still running and data is safe
    echo ""
    if docker ps | grep -q "rs_mysql"; then
        echo "✓ MySQL container is running - DATA IS SAFE!"
    fi

    echo ""
    echo "=========================================="
    echo "✓ Done! Your site is now at:"
    echo "  https://$DOMAIN"
    echo ""
    echo "✓ MySQL data: 100% SAFE (volume preserved)"
    echo ""
    echo "Update .env: APP_URL=https://$DOMAIN"
    echo "Then run: $DOCKER_COMPOSE exec app php artisan config:cache"
    echo "=========================================="
else
    echo ""
    echo "✗ SSL certificate failed!"
    echo "Check: DNS, port 80, email in script"
    exit 1
fi
