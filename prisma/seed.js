require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create Rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: { roomNumber: '101', bedCount: 2, status: 'VACANT' }
    }),
    prisma.room.create({
      data: { roomNumber: '102', bedCount: 3, status: 'OCCUPIED' }
    }),
    prisma.room.create({
      data: { roomNumber: '103', bedCount: 1, status: 'OCCUPIED' }
    }),
    prisma.room.create({
      data: { roomNumber: '104', bedCount: 2, status: 'VACANT' }
    }),
    prisma.room.create({
      data: { roomNumber: '105', bedCount: 4, status: 'MAINTENANCE' }
    })
  ]);
  console.log('✅ Created 5 rooms');

  // Create Tenants
  const tenants = await Promise.all([
    prisma.tenant.create({
      data: {
        name: 'Rahul Sharma',
        phone: '9876543210',
        idProofType: 'Aadhar',
        idProofNumber: '1234-5678-9012',
        joiningDate: new Date('2024-01-15'),
        roomId: rooms[1].id,
        rentAmount: 5000,
        advancePaid: 10000,
        isActive: true
      }
    }),
    prisma.tenant.create({
      data: {
        name: 'Priya Patel',
        phone: '9876543211',
        idProofType: 'PAN',
        idProofNumber: 'ABCDE1234F',
        joiningDate: new Date('2024-02-01'),
        roomId: rooms[1].id,
        rentAmount: 5000,
        advancePaid: 10000,
        isActive: true
      }
    }),
    prisma.tenant.create({
      data: {
        name: 'Amit Kumar',
        phone: '9876543212',
        idProofType: 'Aadhar',
        idProofNumber: '9876-5432-1098',
        joiningDate: new Date('2024-03-10'),
        roomId: rooms[2].id,
        rentAmount: 4500,
        advancePaid: 9000,
        isActive: true
      }
    })
  ]);
  console.log('✅ Created 3 tenants');

  // Create Payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        tenantId: tenants[0].id,
        month: 10,
        year: 2024,
        amount: 5000,
        dueDate: new Date('2024-10-05'),
        paidDate: new Date('2024-10-03'),
        status: 'PAID'
      }
    }),
    prisma.payment.create({
      data: {
        tenantId: tenants[0].id,
        month: 11,
        year: 2024,
        amount: 5000,
        dueDate: new Date('2024-11-05'),
        paidDate: new Date('2024-11-02'),
        status: 'PAID'
      }
    }),
    prisma.payment.create({
      data: {
        tenantId: tenants[1].id,
        month: 11,
        year: 2024,
        amount: 5000,
        dueDate: new Date('2024-11-05'),
        status: 'UNPAID'
      }
    }),
    prisma.payment.create({
      data: {
        tenantId: tenants[2].id,
        month: 11,
        year: 2024,
        amount: 4500,
        dueDate: new Date('2024-11-05'),
        paidDate: new Date('2024-11-04'),
        status: 'PAID'
      }
    })
  ]);
  console.log('✅ Created 4 payments');

  // Create Complaints
  await prisma.complaint.create({
    data: {
      tenantId: tenants[0].id,
      roomId: rooms[1].id,
      title: 'AC not working',
      description: 'The air conditioner in room 102 has stopped working',
      status: 'OPEN'
    }
  });
  await prisma.complaint.create({
    data: {
      tenantId: tenants[2].id,
      roomId: rooms[2].id,
      title: 'Water leakage',
      description: 'There is water leakage from the bathroom ceiling',
      status: 'IN_PROGRESS'
    }
  });
  console.log('✅ Created 2 complaints');

  // Create Staff
  await Promise.all([
    prisma.staff.create({
      data: {
        name: 'Ravi Singh',
        role: 'Watchman',
        phone: '9876543220',
        shift: 'Night'
      }
    }),
    prisma.staff.create({
      data: {
        name: 'Sunita Devi',
        role: 'Cleaning Staff',
        phone: '9876543221',
        shift: 'Morning'
      }
    })
  ]);
  console.log('✅ Created 2 staff members');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
