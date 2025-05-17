# Loan Service

Issues and returns books by communicating with both User Service and Book Service.

- REST Base Path: /api/loans
- Database: loan_db (table: loans)

## Development

1. Install dependencies:
   npm install
2. Start service:
   npm start

## Endpoints
- GET /api/loans
- GET /api/loans/:id
- POST /api/loans

## To Do
- Implement loan creation
- Implement return flow
- Add inter-service HTTP calls
- Add database schema
