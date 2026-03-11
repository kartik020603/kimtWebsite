import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import PaymentHistoryClient from "./PaymentHistoryClient";

export default async function PaymentHistoryPage() {
    const session = await getServerSession(authOptions);
    const studentData = await prisma.student.findUnique({
        where: { userId: (session?.user as any)?.id as string },
        include: {
            user: true,
            payments: { orderBy: { paymentDate: 'desc' } }
        }
    }) as any;

    if (!studentData) return <div className="p-12 text-center text-gray-400 font-bold">Data not found.</div>;

    return <PaymentHistoryClient studentData={studentData} />;
}
