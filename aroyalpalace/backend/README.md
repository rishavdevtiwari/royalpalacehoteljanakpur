
# A Royal Palace Hotel Management System - Backend

This directory contains the Node.js backend API for the hotel management system.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up the database:
   ```
   npm run db:setup
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
PORT=3001
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

## API Endpoints

- `/api/auth`: Authentication routes (login, register, logout)
- `/api/rooms`: Room management
- `/api/bookings`: Booking management
- `/api/contact`: Contact form submission
- `/api/users`: User management (admin only)

## Technologies Used

- Node.js
- Express
- Prisma (ORM)
- PostgreSQL database
- JSON Web Tokens for authentication
