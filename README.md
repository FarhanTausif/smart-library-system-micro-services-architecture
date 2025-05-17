# Smart Library System - Microservices Architecture

This project is a **Smart Library System** built using a microservices architecture. It consists of three main services:

1. **User-Service**: Manages user registration, profile management, and user-related queries.
2. **Book-Service**: Handles book inventory, search, and updates to availability.
3. **Loan-Service**: Manages book loans, returns, and overdue tracking.

## Features
- **Microservices Architecture**: Each service is independent and communicates via REST APIs.
- **MongoDB Integration**: Each service uses MongoDB for data storage.
- **Circuit Breakers**: Resilient inter-service communication using the `opossum` library.
- **Environment Configuration**: `.env` files for service-specific configurations.
- **Shell Scripts**: Scripts to start and stop all services.

## Services Overview

### 1. User-Service
- **Base Path**: `/api/users`
- **Endpoints**:
  - `POST /api/users`: Register a new user.
  - `GET /api/users/:id`: Fetch user profile by ID.
  - `PUT /api/users/:id`: Update user information.
- **Database**: `user_db` (Collection: `users`)

### 2. Book-Service
- **Base Path**: `/api/books`
- **Endpoints**:
  - `POST /api/books`: Add a new book.
  - `GET /api/books`: Search for books by title, author, or keyword.
  - `GET /api/books/:id`: Retrieve detailed information about a specific book.
  - `PATCH /api/books/:id/availability`: Update a book's available copies.
- **Database**: `book_db` (Collection: `books`)

### 3. Loan-Service
- **Base Path**: `/api/loans`
- **Endpoints**:
  - `POST /api/loans`: Create a new loan.
  - `POST /api/returns`: Return a borrowed book.
  - `GET /api/loans/user/:user_id`: Get a user's loan history.
  - `GET /api/loans/:id`: Get details of a specific loan.
  - `GET /api/loans/overdue`: List all overdue loans.
  - `PUT /api/loans/:id/extend`: Extend the due date for a loan.
- **Database**: `loan_db` (Collection: `loans`)

## Prerequisites
- **Node.js**: v16 or later
- **MongoDB**: A running MongoDB instance or cluster

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://FarhanTausif/smart-library-system-micro-services-architecture.git
cd smart-library-system-micro-services-architecture
```

### 2. Configure Environment Variables
- Copy the `.env.example` file in each service directory to `.env` and update the values.

### 3. Install Dependencies
Run the following command in each service directory:
```bash
npm install
```

### 4. Start All Services
Use the provided shell script to start all services:
```bash
./start_services.sh
```

### 5. Stop All Services
To stop all running services, use:
```bash
./stop_services.sh
```

## Testing the APIs
You can test the APIs using `curl` or tools like Postman. Example `curl` commands are provided below:

### Create a Loan
```bash
curl -X POST http://localhost:8083/api/loans \
-H "Content-Type: application/json" \
-d '{
  "user_id": "USER_OBJECT_ID",
  "book_id": "BOOK_OBJECT_ID",
  "due_date": "2025-05-24T00:00:00.000Z"
}'
```

### Get Overdue Loans
```bash
curl -X GET http://localhost:8083/api/loans/overdue
```

## Project Structure
```
smart-library-system-micro-services-architecture/
├── User-Service/
│   ├── app.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── services/
├── Book-Service/
│   ├── app.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── services/
├── Loan-Service/
│   ├── app.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── services/
├── start_services.sh
├── stop_services.sh
└── README.md
```

## Contributing
1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b <branch-name>
   ```
2. Commit your changes:
   ```bash
   git commit -m "<commit-message>"
   ```
3. Push to the branch:
   ```bash
   git push origin <branch-name>
   ```
4. Open a pull request.