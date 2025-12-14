# Around - Full Stack Project

Full stack application with authentication and authorization.

## Structure

```
/backend  - Node.js + Express API
/frontend - React application
```

## Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Requirements

- Node.js
- MongoDB running on `mongodb://localhost:27017/aroundb`

## Test Users

To populate the database with test users and sample data, run the seed script:

```bash
cd backend
node seed-data.js
```

This creates two test accounts:
- demo@around.com / demo123
- renata@example.com / renata123

The renata account includes 6 sample cards for testing.

## Deployment

### Production Server

- **Frontend:** https://tigre-around.duckdns.org
- **Backend API:** https://tigre-around.duckdns.org/api

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

## Features

- User registration and login
- JWT authentication
- Protected routes
- User profiles
- Card management (CRUD)
- Like functionality
- Centralized error handling
- Request/Error logging
- Input validation with Celebrate
- Password hashing with bcrypt
- Auto-restart with PM2
- HTTPS with SSL certificates
