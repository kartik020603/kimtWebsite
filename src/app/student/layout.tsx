import StudentSidebar from "@/components/StudentSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "STUDENT") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <StudentSidebar />
            <div className="flex-1 lg:ml-72 p-8 lg:p-12">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
