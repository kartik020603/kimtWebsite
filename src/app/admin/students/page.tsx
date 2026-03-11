import prisma from "@/lib/prisma";
import StudentManagement from "./StudentManagement";

export default async function StudentsPage() {
    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: { student: true },
        orderBy: { createdAt: "desc" }
    });

    return <StudentManagement initialStudents={students} />;
}
