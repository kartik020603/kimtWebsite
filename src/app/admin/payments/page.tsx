import prisma from "@/lib/prisma";
import PaymentManagement from "./PaymentManagement";

export default async function PaymentsPage() {
    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: { student: true }
    });

    const payments = await prisma.payment.findMany({
        include: { student: { include: { user: true } } },
        orderBy: { paymentDate: "desc" }
    });

    return <PaymentManagement students={students} initialPayments={payments} />;
}
