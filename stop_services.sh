#!/bin/bash

### Before dockerizing the services.
# Stop all services
# pkill -f "npm run dev"


sudo systemctl stop nginx
docker compose down
# Wait for a few seconds to ensure services are stopped
sleep 2
# Check if services are stopped 
if ! docker ps | grep -q 'smart-library-system'; then
  echo "All services are stopped successfully."
else
  echo "Some services are still running."
fi
