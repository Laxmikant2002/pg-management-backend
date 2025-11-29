const { PrismaClient } = require('@prisma/client');
const { Pool } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');

// Create the database adapter
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
