# Around API

Backend for Around project with authentication.

## Setup

```bash
cd backend
npm install
npm run dev
```

## Environment

MongoDB required at `mongodb://localhost:27017/aroundb`

## Endpoints

### Public
- POST `/signup` - Register
- POST `/signin` - Login

### Protected (require JWT in Authorization header)
- GET `/users` - All users
- GET `/users/me` - Current user
- GET `/users/:id` - User by ID
- PATCH `/users/me` - Update profile
- PATCH `/users/me/avatar` - Update avatar
- GET `/cards` - All cards
- POST `/cards` - Create card
- DELETE `/cards/:cardId` - Delete card (owner only)
- PUT `/cards/:cardId/likes` - Like card
- DELETE `/cards/:cardId/likes` - Unlike card
