#!/bin/bash

# Fix permissions for Laravel storage and cache directories
# Run this on the server after git operations

echo "Fixing Laravel permissions..."

# Get current user
CURRENT_USER=$(whoami)

# Fix ownership
sudo chown -R $CURRENT_USER:$CURRENT_USER storage bootstrap/cache

# Fix permissions
chmod -R 775 storage bootstrap/cache
find storage -type f -exec chmod 664 {} \;
find storage -type d -exec chmod 775 {} \;
find bootstrap/cache -type f -exec chmod 664 {} \;
find bootstrap/cache -type d -exec chmod 775 {} \;

echo "✓ Permissions fixed!"
echo ""
echo "Now you can run: git reset --hard"
