const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        role: true,
        isActive: true
      }
    });
    console.log('--- REMOTE USERS ---');
    console.table(users);
    console.log('--------------------');
  } catch (err) {
    console.error('Error connecting to remote DB:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
