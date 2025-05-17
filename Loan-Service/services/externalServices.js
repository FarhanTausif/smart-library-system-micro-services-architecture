import dotenv from 'dotenv';
import { userServiceClient, bookServiceClient } from './httpClient.js';
import CircuitBreaker from 'opossum';

dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8081';
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://book-service:8082';

// Circuit breaker options
const circuitBreakerOptions = {
  timeout: 5000, // 5 seconds timeout for requests
  errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
  resetTimeout: 10000 // 10 seconds before trying again
};

// Circuit breakers for User-Service and Book-Service
export const userServiceBreaker = new CircuitBreaker(async (userId) => {
  const response = await userServiceClient.get(`/api/users/${userId}`);
  return response.data;
}, circuitBreakerOptions);

export const bookServiceBreaker = new CircuitBreaker(async (bookId) => {
  const response = await bookServiceClient.get(`/api/books/${bookId}`);
  return response.data;
}, circuitBreakerOptions);

export const bookAvailabilityBreaker = new CircuitBreaker(async (bookId, operation) => {
  await bookServiceClient.patch(`/api/books/${bookId}/availability`, { operation });
}, circuitBreakerOptions);
