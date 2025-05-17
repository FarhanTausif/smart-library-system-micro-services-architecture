#!/bin/bash

# Start User-Service
echo "Starting User-Service..."
cd User-Service &&
npm install &&
npm run dev &
cd ..

# Start Book-Service
echo "Starting Book-Service..."
cd Book-Service &&
npm install &&
npm run dev &
cd ..

# Start Loan-Service
echo "Starting Loan-Service..."
cd Loan-Service &&
npm install &&
npm run dev &
cd ..

# Wait for all services to start
echo "All services are starting..."
wait