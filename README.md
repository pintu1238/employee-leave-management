# Employee Management

A MERN-style employee management application with separate frontend and backend projects.

## Project Structure

- `backend/` - Node.js + Express backend
- `frontend/` - React + Vite frontend

> **Tech stack:** PostgreSQL · Node.js · Express.js · JWT · bcryptjs · React · TailwindCSS

---

## Features

###  Admin
- Sign in to admin dashboard
- View department-wise leave summary
- **Manage Employees** — Add, Edit, Delete (+ auto-removes their login account)
- **Manage Leave Requests** — View all, filter by status/department, Approve / Reject with notes, Delete
- View Reports per department

###  Employee
- Self-registration (Sign Up) with department selection
- Sign in and see personal dashboard with leave statistics
- Apply for leave (with date validation and auto day count)
- View all own leave requests with admin notes
- Cancel own PENDING requests
- Edit profile (phone, designation)

---

## Project Structure

```
leave-app/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   └── employeeController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   └── employee.js
│   │   ├── middleware/
│   │   │   ├── auth.js          ← JWT verify + role guard
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   └── db/
│   │       ├── schema.sql
│   │       └── seed.js
│   ├── .env.example
│   └── package.json
└── frontend/
    └── src/
        ├── api/client.js        ← API wrapper with JWT header
        ├── context/AuthContext  ← Global auth state
        ├── pages/auth/          ← Login, Signup
        ├── pages/admin/         ← Dashboard, Employees, Leaves, Reports
        └── pages/employee/      ← Dashboard, MyLeaves, NewLeave, Profile
```

---

## Setup Guide

### 1. Create the database

```bash
psql -U postgres
CREATE DATABASE leave_app_db;
\q
```

### 2. Run the schema

```bash
psql -U postgres -d leave_app_db -f backend/src/db/schema.sql
```

### 3. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env with your postgres credentials + a strong JWT_SECRET
```

### 4. Install & seed

```bash
cd backend
npm install
npm run seed
```

Seed creates:
- **Admin:** `admin@example.com` / `admin`



### 5. Start backend

```bash
cd backend
npm run dev      # development (nodemon)
# or
npm start        # production
```

Runs at **http://localhost:5000**

### 6. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:5173** (Vite proxy forwards `/api` → `:5000`)

---

## API Reference

### Auth (public)
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Employee self-registration |
| POST | `/api/auth/signin` | Sign in (returns JWT) |
| GET  | `/api/auth/me` | Get current user (auth required) |

### Admin (JWT required, role=ADMIN)
| Method | Route | Description |
|---|---|---|
| GET    | `/api/admin/departments` | List departments |
| GET    | `/api/admin/employees` | List employees (search, filter, paginate) |
| POST   | `/api/admin/employees` | Create employee + user account |
| PUT    | `/api/admin/employees/:id` | Update employee |
| DELETE | `/api/admin/employees/:id` | Delete employee (cascade) |
| GET    | `/api/admin/leave-requests` | List all leave requests |
| PATCH  | `/api/admin/leave-requests/:id/status` | Approve or Reject |
| DELETE | `/api/admin/leave-requests/:id` | Delete request |
| GET    | `/api/admin/reports/department-leaves` | Dept-wise summary |

### Employee (JWT required, role=EMPLOYEE)
| Method | Route | Description |
|---|---|---|
| GET    | `/api/employee/dashboard` | Leave stats |
| GET    | `/api/employee/profile` | Own profile |
| PUT    | `/api/employee/profile` | Update phone / designation |
| GET    | `/api/employee/leave-requests` | Own leave requests |
| POST   | `/api/employee/leave-requests` | Apply for leave |
| DELETE | `/api/employee/leave-requests/:id` | Cancel PENDING request |

---

## Default Credentials (after seed)

| Role | Email | Password |
|---|---|---|
| Admin | admin@company.com | Admin@123 |
| Employee | amit.sharma1@company.com | Emp@1234 |

---

## Assumptions

- JWT is stored in `localStorage`. For production, consider `httpOnly` cookies.
- Admin accounts are not created via signup — only via seed or direct DB insert.
- `total_days` = end_date − start_date + 1 (calendar days, no holiday logic).
- Employee code is auto-generated sequentially (EMP001, EMP002 …).




