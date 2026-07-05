# Employee Management

A MERN-style employee management application with separate frontend and backend projects.

## Project Structure

- `backend/` - Node.js + Express backend
- `frontend/` - React + Vite frontend

## Features

- Employee login and registration
- Admin and employee role-based dashboards
- Department management
- Leave requests and admin leave approval
- Employee list pagination for admin

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, PostgreSQL (`pg`), JWT auth, bcrypt

## Setup

### Backend

1. Open terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with values like:
   ```env
   PORT=3000
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=postgres
   PGDATABASE=employee
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Open terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

### Access

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## Notes

- The backend auto-creates PostgreSQL tables if they do not already exist.
- Keep environment secrets out of Git by using `.env` files.

## License

This repository is provided as-is.
