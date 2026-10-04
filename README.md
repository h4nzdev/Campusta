# CAMPUSTA: Smart Campus Maintenance and Service Management System

> **University of Southern Philippines Foundation (USPF) — College of Computer Studies**  
> *Web Systems and Technologies 2 • Project-Based Learning*

---

## 📌 Project Overview

**CAMPUSTA** is a web-based campus maintenance and service management platform designed to streamline concern reporting, ticket routing, and resolution verification across USPF. By replacing informal verbal and message-based reporting with centralized **QR-based location identification**, **role-based access control (RBAC)**, and **ticket lifecycle workflows**, CAMPUSTA ensures campus issues are systematically tracked, resolved, and verified.

---

## 🚀 Key Features

### 1. 🔐 Role-Based Access Control (RBAC) & Authentication
- **PHP 8.1+ Enums & Laravel Sanctum**: Strict role enforcement (`Student`, `Faculty`, `Maintenance`, `Admin`) at database, backend middleware (`RoleMiddleware`), and frontend routing levels (`AuthContext` + `RoleRoute`).
- **Flexible Login Interface**: Supports login via **University Email** (`@uspf.edu.ph`) or **Student ID Number** with credential validation.

### 2. 📱 QR Code Generation & Auto-Identification
- **Admin QR Creator**: Administrators can generate and print formatted QR badges for any building, floor, room, or laboratory (e.g. `QR-ITBU-ROOM302`).
- **Scan-to-Report**: Interactive camera scanner and direct scan links (`/report?qr=...`) that automatically detect and pin the exact campus location in the reporting form.

### 3. 🎫 End-to-End Ticket Lifecycle
- **Status Workflow**: `Open` ➔ `In Progress` ➔ `Resolved` ➔ `Closed` (or `Rejected`).
- **Priority Levels**: `Low`, `Medium`, `High`, `Urgent`.
- **Reporter Verification**: When maintenance marks a ticket as resolved, the reporting student or faculty member is prompted to verify whether the fix is satisfactory or request a follow-up inspection.
- **Audit History**: Complete event trail for every ticket assignment, status transition, resolution note, and photo attachment.

### 4. 📊 Admin Analytics & Reporting
- Visual progress charts powered by **Recharts** displaying issue breakdowns by category, building resolution rates, response time benchmarks, and urgent ticket queues.

### 5. 🔔 Notifications & Queue System
- In-system notifications for status transitions, maintenance assignments, and resolution verifications.
- Campus queue management interface for high-traffic student services.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios (configured with Sanctum Bearer Token interceptors)

### Backend
- **Framework**: Laravel 12 (PHP 8.2+)
- **Authentication**: Laravel Sanctum (API Token Auth)
- **Database**: MySQL (Port 3307 / 3306)
- **Architecture**: RESTful API with PHP Enums & Policy Middleware

---

## 👥 User Roles & Seeded Accounts

All seeded demo accounts use the default password: `password`

| Role | Username / ID | University Email | Sample Duties |
| :--- | :--- | :--- | :--- |
| **Student** | `2023-00123` (`hanz_student`) | `hanz.student@uspf.edu.ph` | Submit reports, scan QR codes, verify completed fixes |
| **Faculty** | `2018-00456` (`prof_davis`) | `prof.davis@uspf.edu.ph` | Priority classroom/lab concern reporting, track requests |
| **Maintenance** | `raniel_maintenance` | `raniel.maintenance@uspf.edu.ph` | Accept assignments, update progress, log work notes & resolution photos |
| **Admin** | `admin_uspf` | `admin@uspf.edu.ph` | Assign tickets, manage campus QR locations, view analytics, user management |

---

## 📂 Project Structure

```text
CAMPUSTA/
├── backend/                  # Laravel 12 API Backend
│   ├── app/
│   │   ├── Enums/            # UserRole, TicketStatus, TicketPriority
│   │   ├── Http/Controllers/ # Auth, Location, Ticket, Category, Notification
│   │   ├── Http/Middleware/  # RoleMiddleware (RBAC)
│   │   └── Models/           # User, Ticket, Location, Category, Notification
│   ├── database/
│   │   ├── migrations/       # MySQL Schema Migrations
│   │   └── seeders/          # DatabaseSeeder with initial users, tickets & locations
│   └── routes/
│       └── api.php           # Sanctum-protected REST API endpoints
│
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, Layout, Protected Routes
│   │   ├── context/          # AuthContext (API state + local fallback)
│   │   ├── pages/            # Student, Faculty, Maintenance, Admin views
│   │   └── utils/            # Axios API client & helpers
│   └── package.json
│
├── Proposal.md               # Project Concept Brief & System Requirements
└── README.md                 # Project Documentation
```

---

## ⚡ Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **PHP** (v8.2+) & **Composer**
- **MySQL Database Server** (e.g. XAMPP / Laragon / MariaDB)

---

### 2. Backend Setup (Laravel)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install PHP dependencies
composer install

# 3. Configure environment file
cp .env.example .env
php artisan key:generate

# 4. Configure your MySQL database settings in .env
# Example:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3307  (or 3306)
# DB_DATABASE=campusta
# DB_USERNAME=root
# DB_PASSWORD=

# 5. Run migrations & seed demo records
php artisan migrate:fresh --seed

# 6. Create storage symlink for uploaded photos
php artisan storage:link

# 7. Start the backend API server
php artisan serve --port=8000
```
*API Base URL:* `http://127.0.0.1:8000/api`

---

### 3. Frontend Setup (React + Vite)

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```
*Frontend Application:* `http://localhost:5173`

---

## 📡 API Endpoints Summary

### Authentication
- `POST /api/login` - Authenticate user & issue Sanctum Bearer token
- `POST /api/logout` - Revoke current token (Authenticated)
- `GET /api/user` - Fetch authenticated user profile

### Locations & QR Codes
- `GET /api/locations` - List all campus buildings and rooms
- `GET /api/locations/qr/{qrCode}` - Find location by QR code identifier
- `POST /api/locations` - Register new campus location & QR tag *(Admin only)*
- `DELETE /api/locations/{id}` - Delete campus location *(Admin only)*

### Tickets & Concerns
- `GET /api/tickets` - Role-filtered ticket list
- `POST /api/tickets` - Submit new ticket with attachments *(Student/Faculty/Admin)*
- `GET /api/tickets/{id}` - View ticket details and history audit log
- `PUT /api/tickets/{id}/status` - Update ticket status & work notes *(Maintenance/Admin)*
- `PUT /api/tickets/{id}/verify` - Confirm fix resolution *(Reporter/Admin)*
- `GET /api/admin/stats` - Summary statistics for dashboard *(Admin only)*

---

## 🔄 System Workflow

```
[ Campus User / Student / Faculty ]
                 │
      Scans QR Code at Location (or manually selects)
                 │
                 ▼
  Submits Maintenance Report (Category, Description, Photo)
                 │
                 ▼
    [ System Generates Ticket: Status "Open" ]
                 │
                 ▼
   [ Administrator Reviews & Assigns to Personnel ]
                 │
                 ▼
[ Maintenance Receives Task ➔ Status: "In Progress" ]
                 │
                 ▼
[ Maintenance Adds Resolution Notes ➔ Status: "Resolved" ]
                 │
                 ▼
   [ Reporter Verifies Resolution ]
          │                   │
  (Fix Confirmed)     (Issue Still Persists)
          │                   │
          ▼                   ▼
  Status: "Closed"     Re-opened for Inspection
```

---

## 👨‍💻 Development Team & Roles

| Team Member | Role & Responsibilities |
| :--- | :--- |
| **Hanz Magbal** | Front-End Development & UI/UX Design |
| **Raniel Pianar** | Back-End Development & API Architecture |
| **Davis Sentillas** | Database Architecture & System Integration |

---

## 📄 License

This project is developed as an academic project for **Web Systems and Technologies 2** at the **University of Southern Philippines Foundation (USPF)**. All rights reserved.
