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
2. Set up `.env` with your Supabase PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Seed sample data:
   ```bash
   node prisma/seed.js
   ```
6. Start the server:
   ```bash
   npm start
   ```
7. API runs at `http://localhost:4000`

---

## File Uploads
- Upload documents for tenants via `POST /tenants/:id/documents` (field: `file`)
- Files are stored in `/uploads` and served at `/uploads/<filename>`

---

## Demo Credentials
- Username: `admin`
- Password: `admin123`

---

## Deployment to Render

### Prerequisites
- GitHub repository with your code pushed
- Supabase PostgreSQL database (free tier)

### Steps
1. **Create a New Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `pg-management-backend` repository

2. **Configure the Service**
   - **Name**: `pg-management-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**
   - Click "Environment" tab
   - Add the following:
     - `DATABASE_URL`: Your Supabase PostgreSQL connection string
     - `NODE_ENV`: `production`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Your API will be available at `https://your-service-name.onrender.com`

5. **Post-Deployment**
   - Seed data (if needed): Connect to Render Shell and run `npm run seed`
   - Test your endpoints using the live URL

### Important Notes
- Free tier services may spin down after inactivity (cold starts)
- The `render.yaml` file is already configured for automatic deployment
- Render automatically runs migrations during build (`npm run build`)
- Make sure your Supabase database allows connections from Render's IP addresses

---

## Alternative Deployment Platforms
- **Railway**: Similar setup, connect GitHub and add DATABASE_URL
- **Heroku**: Use Heroku Postgres or external Supabase
- **Vercel**: Deploy as serverless functions (requires code modifications)
- **VPS**: Use PM2 or systemd for process management

---

## License
MIT
