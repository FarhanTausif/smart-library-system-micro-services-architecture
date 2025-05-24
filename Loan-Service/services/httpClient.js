import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
// Create an HTTP client for User-Service
export const userServiceClient = axios.create({
  baseURL: process.env.BASE_URL || 'http://user-service:8081',
  timeout: 5000 // 5 seconds timeout
});

// Create an HTTP client for Book-Service
export const bookServiceClient = axios.create({
  baseURL: process.env.BASE_URL || 'http://book-service:8082',
  timeout: 5000 // 5 seconds timeout
});
