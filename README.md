# PG Management Backend

## Overview
A complete backend for PG/hostel management, built with Node.js, Express, PostgreSQL (Supabase), and Prisma ORM. Supports tenants, rooms, payments, complaints, staff, and document uploads.

---

## Features
- Node.js + Express REST API
- PostgreSQL (Supabase free cloud DB)
- Prisma ORM v7
- Multer for file uploads
- CORS enabled
- Sample data seeding
- All core entities: tenants, rooms, payments, complaints, staff, documents
- Demo authentication endpoint
- Dashboard stats endpoint

---

## Database Schema
- **Tenants**: id, name, phone, idProofType, idProofNumber, joiningDate, roomId, rentAmount, advancePaid, isActive
- **Rooms**: id, roomNumber, bedCount, status
- **Payments**: id, tenantId, month, year, amount, dueDate, paidDate, status
- **Complaints**: id, tenantId, roomId, title, description, status, createdAt, updatedAt
- **Staff**: id, name, role, phone, shift
- **Documents**: id, tenantId, fileUrl, fileType, uploadedAt

---

## API Endpoints
- `POST /auth/login` — Demo login (username: admin, password: admin123)
- `GET /tenants`, `POST /tenants`, `GET /tenants/:id`, `PUT /tenants/:id`, `DELETE /tenants/:id`
- `GET /rooms`, `POST /rooms`, `GET /rooms/:id`, `PUT /rooms/:id`
- `GET /payments`, `POST /payments`, `PUT /payments/:id`, `GET /tenants/:id/payments`
- `GET /complaints`, `POST /complaints`, `PUT /complaints/:id`
- `GET /staff`, `POST /staff`, `PUT /staff/:id`, `DELETE /staff/:id`
- `GET /stats/overview` — Dashboard stats
- `POST /tenants/:id/documents` — File upload (multipart/form-data)
- `GET /tenants/:id/documents`, `DELETE /documents/:id`

---

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up `.env` with your Supabase PostgreSQL connection string.
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Seed sample data:
   ```bash
   node prisma/seed.js
   ```
5. Start the server:
   ```bash
   node index.js
   ```
6. API runs at `http://localhost:4000`

---

## File Uploads
- Upload documents for tenants via `POST /tenants/:id/documents` (field: `file`)
- Files are stored in `/uploads` and served at `/uploads/<filename>`

---

## Demo Credentials
- Username: `admin`
- Password: `admin123`

---

## Deployment
- Can be deployed to Render, Railway, Heroku, Vercel, or any VPS
- Uses free cloud PostgreSQL (Supabase)

---

## License
MIT
