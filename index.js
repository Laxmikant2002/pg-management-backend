require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'PG Management API is running!' });
});

// Auth endpoint (demo - hardcoded for testing)
app.post('/auth/login', (req, res) => {
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required in JSON body.' });
  }
  // Demo credentials - in production, use proper authentication
  if (username === 'admin' && password === 'admin123') {
    res.json({
      token: 'demo-jwt-token-' + Date.now(),
      user: { id: 1, username: 'admin', role: 'admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Simple stats endpoint
app.get('/stats/overview', async (req, res) => {
  try {
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({ where: { status: 'OCCUPIED' } });
    const vacantRooms = totalRooms - occupiedRooms;
    
    // sum collected this month (example)
    const collected = await prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true }
    });
    
    const pending = await prisma.payment.aggregate({
      where: { status: 'UNPAID' },
      _sum: { amount: true }
    });
    
    res.json({
      totalRooms,
      occupiedRooms,
      vacantRooms,
      totalCollectedThisMonth: collected._sum.amount || 0,
      totalPendingThisMonth: pending._sum.amount || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tenants CRUD
app.get('/tenants', async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: { payments: true, room: true, complaints: true }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tenants/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { payments: true, room: true, complaints: true }
    });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tenants', async (req, res) => {
  try {
    const t = await prisma.tenant.create({ data: req.body });
    res.json(t);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/tenants/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const t = await prisma.tenant.update({ where: { id }, data: req.body });
    res.json(t);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/tenants/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.tenant.delete({ where: { id } });
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rooms
app.get('/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({ include: { tenants: true } });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/rooms/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const room = await prisma.room.findUnique({
      where: { id },
      include: { tenants: true }
    });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/rooms', async (req, res) => {
  try {
    const room = await prisma.room.create({ data: req.body });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/rooms/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const r = await prisma.room.update({ where: { id }, data: req.body });
    res.json(r);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payments
app.get('/payments', async (req, res) => {
  try {
    const { tenantId, month, year } = req.query;
    const where = {};
    
    if (tenantId) where.tenantId = Number(tenantId);
    if (month) where.month = Number(month);
    if (year) where.year = Number(year);
    
    const payments = await prisma.payment.findMany({
      where,
      include: { tenant: true }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tenants/:id/payments', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const payments = await prisma.payment.findMany({ where: { tenantId: id } });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/payments', async (req, res) => {
  try {
    const p = await prisma.payment.create({ data: req.body });
    res.json(p);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/payments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const payment = await prisma.payment.update({
      where: { id },
      data: req.body
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complaints
app.get('/complaints', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: { tenant: true }
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/complaints', async (req, res) => {
  try {
    const complaint = await prisma.complaint.create({ data: req.body });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/complaints/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const complaint = await prisma.complaint.update({
      where: { id },
      data: req.body
    });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Staff
app.get('/staff', async (req, res) => {
  try {
    const staff = await prisma.staff.findMany();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/staff', async (req, res) => {
  try {
    const staff = await prisma.staff.create({ data: req.body });
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/staff/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const staff = await prisma.staff.update({
      where: { id },
      data: req.body
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/staff/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.staff.delete({ where: { id } });
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
