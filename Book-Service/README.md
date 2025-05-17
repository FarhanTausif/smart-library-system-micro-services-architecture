# Book Service

Manages book inventory, search, and updates to availability.

- REST Base Path: /api/books
- Database: book_db (table: books)

## Development

1. Install dependencies:
   npm install
2. Start service:
   npm start

## Endpoints
- GET /api/books
- GET /api/books/:id
- POST /api/books
- PATCH /api/books/:id/availability

## To Do
- Implement book inventory
- Implement search
- Add database schema
