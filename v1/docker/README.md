# SSL Setup - Simple Guide

## Quick Setup (3 Steps)

### 1. Update Email
Edit `docker/setup-ssl.sh` line 7:
```bash
EMAIL="your-email@radiantsynage.com"  # Change this!
```

### 2. Run Script
```bash
./docker/setup-ssl.sh
```

### 3. Update Laravel Config
Edit `.env`:
```env
APP_URL=https://quote.radiantsynage.com
```

Then:
```bash
docker-compose exec app php artisan config:cache
```

## That's It!

Your data is safe - only nginx restarts, app and mysql keep running.

## Files You Need

- `docker/setup-ssl.sh` - Run this
- `docker-compose.production.yml` - Auto-used by script
- `docker/nginx-ssl.conf` - SSL config (auto-used)

## Troubleshooting

**Certificate fails?**
- Check DNS: `dig quote.radiantsynage.com`
- Check port 80: `curl -I http://quote.radiantsynage.com`
- Update email in script

**Need to rollback?**
```bash
docker-compose stop nginx
docker-compose up -d
```
