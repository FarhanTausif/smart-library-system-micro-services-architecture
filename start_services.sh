#!/bin/bash

### Before dockerizing the services, npm cmd was used to run the system.

# # Kill any process using ports 8081, 8082, 8083
# for port in 8081 8082 8083; do
#   fuser -k ${port}/tcp 2>/dev/null || true
# done

# # Start User-Service
# (
#   echo "Starting User-Service..."
#   cd User-Service
#   npm install
#   npm run dev
# ) &

# # Start Book-Service
# (
#   echo "Starting Book-Service..."
#   cd Book-Service
#   npm install
#   npm run dev
# ) &

# # Start Loan-Service
# (
#   echo "Starting Loan-Service..."
#   cd Loan-Service
#   npm install
#   npm run dev
# ) &

# # Wait for all services to start
# echo "All services are starting..."
# wait


sudo systemctl stop nginx
docker compose down
docker compose build 
docker compose up -d
# Wait for a few seconds to ensure services are up
sleep 2
# Check if services are running
if docker ps | grep -q 'smart-library-system'; then
  echo "All services are Up and Running."
else
  echo "Some services failed to start."
fi