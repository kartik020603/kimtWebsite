import prisma from "@/lib/prisma";
import CertificateManagement from "./CertificateManagement";

export default async function CertificatesPage() {
    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: { student: true },
        orderBy: { name: "asc" }
    });

    const certificates = await prisma.certificate.findMany({
        include: {
            student: {
                include: { user: true }
            }
        },
        orderBy: { issuedAt: "desc" }
    });

    return <CertificateManagement students={students} initialCertificates={certificates} />;
}
