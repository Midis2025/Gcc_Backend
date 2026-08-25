# GCC Contact Backend API & Admin CMS (Next.js)

Production-ready Next.js backend and Admin CMS Portal implementing the **Controllers ➔ Middlewares ➔ Services ➔ Repositories** design pattern with MongoDB Atlas, Resend email notifications, and Super Admin user governance.

---

## 📁 Clean Architecture & Directory Structure

```
src/
├── app/
│   ├── admin/                       # 🎨 CMS Admin Dashboard Frontend (Next.js App Router)
│   │   ├── layout.tsx               # Admin layout & header navigation
│   │   ├── login/page.tsx           # Admin Login Screen (http://localhost:3000/admin/login)
│   │   ├── register/page.tsx        # Admin Register (1st user = Auto Super Admin)
│   │   ├── dashboard/page.tsx       # Analytics Overview Cards & Recent Submissions
│   │   ├── enquiries/page.tsx       # Data Table, Search, Status Filter & 1-Click Video Calls
│   │   └── users/page.tsx           # Super Admin User Approvals & Governance
│   └── api/                         # ⚙️ REST API Endpoints
│       ├── health/
│       │   └── route.ts             # GET /api/health (Health check)
│       ├── contact/                 # 📩 Public Contact Form Endpoint
│       │   └── route.ts             # POST /api/contact (submit enquiry)
│       ├── auth/                    # 🔑 Admin Authentication
│       │   ├── register/route.ts    # POST /api/auth/register (1st user = SUPER_ADMIN)
│       │   ├── login/route.ts       # POST /api/auth/login
│       │   └── me/route.ts          # GET /api/auth/me
│       └── admin/                   # 🛡️ CMS Admin Endpoints (Auth Guarded)
│           ├── stats/route.ts       # GET /api/admin/stats (Dashboard overview metrics)
│           ├── enquiries/           # CMS Contact Enquiries Management
│           │   ├── route.ts         # GET /api/admin/enquiries (Search, Filter, Paginate)
│           │   └── [id]/route.ts    # GET, PATCH, DELETE /api/admin/enquiries/:id
│           └── users/               # Super Admin User Governance
│               ├── route.ts         # GET /api/admin/users (List all admins)
│               └── [id]/route.ts    # PATCH & DELETE /api/admin/users/:id
│
├── components/                      # UI Components
│   └── admin-navbar.tsx             # CMS Navigation Bar with User Profile Badge
│
├── controllers/                     # Layer 1: HTTP Handlers & Payload Validation
│   ├── admin.controller.ts
│   └── contact.controller.ts
│
├── middlewares/                     # Layer 2: Interceptors & Error Boundary
│   ├── auth.middleware.ts           # JWT token verification & requireSuperAdmin guard
│   ├── logger.middleware.ts
│   └── error.middleware.ts
│
├── services/                        # Layer 3: Core Business Logic
│   ├── admin.service.ts             # First-User Super Admin logic, password hashing, JWT
│   ├── contact.service.ts           # CMS Filtering & Analytics aggregation
│   └── mail.service.ts
│
├── repositories/                    # Layer 4: Data Access & Persistence
│   ├── admin.repository.ts          # Admin Mongoose model
│   ├── base.repository.ts
│   └── contact.repository.ts        # Mongoose filter queries & MongoDB Atlas stats
│
├── models/                          # Data Models & Zod Validation Schemas
│   ├── admin.model.ts
│   └── contact.model.ts
│
├── config/                          # Configuration & Database Setup
│   ├── db.ts                        # MongoDB Atlas connection wrapper
│   └── env.ts
│
└── utils/                           # Shared Utilities
    ├── api-response.ts
    ├── auth-utils.ts                # Client token helper & apiFetch wrapper
    └── errors.ts
```

---

## 🎨 CMS Portal URLs

| Page | URL | Description |
|---|---|---|
| **Admin Login** | `http://localhost:3000/admin/login` | Sign in to CMS portal |
| **Admin Register** | `http://localhost:3000/admin/register` | Register admin (1st user = Auto Super Admin) |
| **CMS Dashboard** | `http://localhost:3000/admin/dashboard` | Real-time analytics & metrics cards |
| **Enquiries Table** | `http://localhost:3000/admin/enquiries` | Search, filter, status toggles & **1-click video calls** |
| **Admin Users** | `http://localhost:3000/admin/users` | `SUPER_ADMIN` user approval & role management |

---

## 🚀 Running locally

```bash
npm run dev
```
