# FullStack Store Rating Application

A full-stack web application for discovering stores and submitting ratings, featuring role-based access control for **Admin**, **Store Owner**, and **Normal User** roles. Built with Node.js, Express, PostgreSQL, React.js, and Vite.

**Developed by**: [**Siddhi Shendkar**](https://github.com/Siddhi2695) (`shendkarsiddhi2695@gmail.com`)

---

## Features

### 🔑 Authentication & Authorization
- Unified JWT authentication for all user roles.
- Password hashing using **bcrypt**.
- Strict validation for Name (20-60 chars), Password (8-16 chars, 1 uppercase, 1 special char), Address (max 400 chars), and Email.
- Public registration creates **Normal User** accounts only (Admin accounts cannot be publicly registered).

### 👑 Admin Functionality
- **Admin Dashboard**: Real-time stats for Total System Users, Total Stores, and Total Submitted Ratings.
- **User Management**: Add new users (Admin, Store Owner, or Normal User). View full user list with live search, role filtering, and sorting (ASC/DESC on Name, Email, Role).
- **User Details View**: View detailed user profile. For Store Owners, displays their assigned store details and average rating.
- **Store Management**: Register new stores and assign store owners. View store list with search, sorting, and overall ratings.

### 👤 Normal User Functionality
- **Store Browser**: View all registered stores with store name, physical address, and overall average rating.
- **Rating System**: Submit a rating from **1 to 5 stars** for any store. Each user is restricted to **1 rating per store**.
- **Modify Rating**: Edit/update an existing submitted rating at any time.
- **Search & Sorting**: Search stores by Name or Address and sort by Name or Rating score.

### 🏪 Store Owner Functionality
- **Store Owner Dashboard**: View average customer rating score and total reviews count for their assigned store.
- **Rating Reviews List**: View list of customers who rated their store, including Customer Name, Email, Submitted Rating (1-5 stars), and Submission Date.
- **Search & Sorting**: Search reviews by customer Name or Email, with sorting by Name, Rating, or Date.

---

## Tech Stack

- **Frontend**: React.js 18, Vite 6, React Router 7, Axios, Lucide Icons, Custom CSS Design System (Vanilla CSS with Glassmorphism)
- **Backend**: Node.js 24, Express.js 5, REST API, JWT (`jsonwebtoken`), `bcrypt` password hashing
- **Database**: PostgreSQL 18 (with Embedded PostgreSQL server integration for zero-config native execution on Windows)

---

## Project Structure

```
store-rating-app/
├── backend/
│   ├── config/          # Database connection & init scripts
│   ├── controllers/     # Auth, Admin, User, Owner controllers
│   ├── middleware/      # JWT auth, Role authorization, & Validator middleware
│   ├── routes/          # Express route definitions
│   ├── server.js        # Express app entry point & Embedded PostgreSQL runner
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios client with JWT interceptor
│   │   ├── components/  # Navbar, Sidebar, StarRating, Modal, ProtectedRoute
│   │   ├── context/     # AuthContext (state & JWT handling)
│   │   ├── pages/       # Login, Signup, Admin/Owner/User Dashboards, ChangePassword
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql       # PostgreSQL relational schema SQL
│   └── seed.sql         # Initial database seed script
└── README.md
```

---

## Environment Variables

Create `.env` inside `backend/`:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=storeratingdb
DB_USER=postgres
DB_PASSWORD=postgresPassword123!
JWT_SECRET=super_secret_jwt_key_store_rating_app_2026!
```

---

## Seeded Demo Credentials

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@storerating.com` | `AdminPass123!` | System Administrator Account |
| **Store Owner** | `owner@storerating.com` | `OwnerPass123!` | Johnathan Store Owner Person |
| **Normal User** | `user@storerating.com` | `UserPass123!` | Alexander Normal User Customer |

---

## Installation & Running Locally

### 1. Backend & Database Setup
```bash
cd backend
npm install
node server.js
```
*Note: The backend automatically initializes and manages local PostgreSQL tables and seeds demo accounts.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## API Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register normal user account |
| `POST` | `/api/auth/login` | Public | Login all user roles |
| `PUT` | `/api/auth/password` | Authenticated | Update user password |
| `GET` | `/api/admin/dashboard` | Admin | Get system statistics |
| `GET` | `/api/admin/users` | Admin | List users with search/filter/sort |
| `POST` | `/api/admin/users` | Admin | Create new user account |
| `GET` | `/api/admin/stores` | Admin | List stores with overall ratings |
| `POST` | `/api/admin/stores` | Admin | Register new store |
| `GET` | `/api/stores` | Authenticated | View all stores and user ratings |
| `POST` | `/api/ratings` | User | Submit store rating (1-5) |
| `PUT` | `/api/ratings/:id` | User | Modify existing rating |
| `GET` | `/api/owner/dashboard` | Store Owner | View store rating stats |
| `GET` | `/api/owner/ratings` | Store Owner | View users who rated store |
