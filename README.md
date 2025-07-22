# Node.js Backend for React Course Testing

## Overview

This is a Node.js backend using Express and MongoDB to support testing of frontend features such as fetch, AbortController, Axios interceptors, and authentication.

## Features

- User registration and login with JWT access and refresh tokens
- Protected routes via middleware
- Token refresh and logout endpoints
- Delayed response endpoint for testing fetch AbortController

## Setup

1. Navigate into the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy and configure your environment variables:
   ```bash
   cp .env.example .env
   # then edit .env with your MongoDB URI and JWT secrets
   ```
4. Start the server:
   - Development: `npm run dev`
   - Production:  `npm start`

By default the server will run on `http://localhost:5000`.

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register` – Register user. Body: `{ name, lastName, email, password, role }`
- `POST /login` – Login user. Body: `{ email, password }`. Returns `{ accessToken }` and sets `refreshToken` cookie.
- `POST /refresh` – Refresh access token. Requires `refreshToken` cookie. Returns `{ accessToken }`.
- `POST /logout` – Logout user. Clears refresh token cookie.

### User Routes (`/api/users`)
- `GET /me` – Get current user profile. Requires `Authorization: Bearer <accessToken>`.

### Test Routes (`/api/test`)
- `GET /delay?ms=number` – Delayed response by `ms` milliseconds (default 5000) for testing AbortController.

## CORS

Configured to allow requests from `http://localhost:3000`. Adjust in `src/index.js` if needed.
