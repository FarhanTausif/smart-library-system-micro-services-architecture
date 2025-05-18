#!/bin/bash

# Kill any process using ports 8081, 8082, 8083
for port in 8081 8082 8083; do
  fuser -k ${port}/tcp 2>/dev/null || true
done

# Start User-Service
(
  echo "Starting User-Service..."
  cd User-Service
  npm install
  npm run dev
) &

# Start Book-Service
(
  echo "Starting Book-Service..."
  cd Book-Service
  npm install
  npm run dev
) &

# Start Loan-Service
(
  echo "Starting Loan-Service..."
  cd Loan-Service
  npm install
  npm run dev
) &

# Wait for all services to start
echo "All services are starting..."
wait