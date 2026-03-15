const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('admin3626', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
            role: 'ADMIN',
            isActive: true,
        },
    });

    console.log('Admin account created:', admin.username);

    // Create Test Student
    const studentUser = await prisma.user.upsert({
        where: { username: 'student' },
        update: {},
        create: {
            username: 'student',
            password: studentPassword,
            role: 'STUDENT',
            isActive: true,
            student: {
                create: {
                    mobileNo: '9876543210',
                    course: 'Full Stack Development',
                    totalFees: 50000,
                    dueFees: 15000,
                    dueDate: new Date('2026-04-10'),
                    payments: {
                        create: [
                            { amount: 20000, status: 'PAID', description: 'Admission Fee' },
                            { amount: 15000, status: 'PAID', description: 'First Installment' },
                        ]
                    }
                }
            }
        },
    });

    console.log('Student account created:', studentUser.username);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
