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

## Demo User

For testing purposes, you can register with:
- **Email:** demo@around.com
- **Password:** demo123

Or create your own account via the Register page.

### Testing User with Sample Cards

If you want to test the complete functionality including card rendering, likes, and all features, we have a pre-populated user:
- **Email:** renata@example.com
- **Password:** renata123

This user includes 6 sample cards to test all the rendering and interaction features.

## Deployment

### Production Server

- **Frontend:** [Coming Soon - Add your domain here]
- **Backend API:** [Coming Soon - Add your API domain here]

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
