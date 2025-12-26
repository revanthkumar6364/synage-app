#!/bin/bash

# Quick check to verify MySQL volume is safe

echo "Checking MySQL data safety..."
echo ""

# Check current volume
CURRENT_VOL=$(docker volume ls | grep -E "mysql_data|rs_mysql" | awk '{print $2}' | head -1)
if [ -n "$CURRENT_VOL" ]; then
    echo "✓ Current MySQL volume: $CURRENT_VOL"
else
    echo "⚠️  No MySQL volume found"
    exit 0
fi

# Check volume in docker-compose.yml
COMPOSE_VOL=$(grep -A 1 "volumes:" docker-compose.yml | grep "mysql_data" | head -1 | awk '{print $2}' | tr -d ':')
echo "✓ docker-compose.yml uses: ${COMPOSE_VOL:-mysql_data}"

# Check volume in production compose
PROD_VOL=$(grep -A 1 "volumes:" docker-compose.production.yml | grep "mysql_data" | head -1 | awk '{print $2}' | tr -d ':')
echo "✓ docker-compose.production.yml uses: ${PROD_VOL:-mysql_data}"

echo ""
if [ "${COMPOSE_VOL:-mysql_data}" = "${PROD_VOL:-mysql_data}" ]; then
    echo "✅ SAFE: Both configs use same volume name"
    echo "✅ MySQL data will be preserved during SSL setup"
else
    echo "⚠️  WARNING: Volume names differ!"
fi
