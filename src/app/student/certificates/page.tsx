import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Award } from "lucide-react";
import CertificateCard from "@/components/CertificateCard";

export default async function StudentCertificatesPage() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const student = await prisma.student.findUnique({
        where: { userId },
        include: {
            certificates: {
                orderBy: { issuedAt: "desc" }
            },
            user: true
        }
    });

    const certificates = student?.certificates || [];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Certificates</h1>
                <p className="text-gray-500 font-medium mt-1">Your officially issued certificates from KIMT.</p>
            </div>

            {certificates.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-20 text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 bg-indigo-50 rounded-3xl mb-6">
                        <Award className="h-10 w-10 text-indigo-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-600 mb-2">No Certificates Yet</h2>
                    <p className="text-gray-400 font-medium">Your certificates will appear here once issued by the institute.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {certificates.map((cert: any) => (
                        <CertificateCard key={cert.id} certificate={cert} student={student} />
                    ))}
                </div>
            )}
        </div>
    );
}
