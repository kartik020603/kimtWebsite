"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function issueCertificate(formData: FormData) {
    const certificateId = (formData.get("certificateId") as string)?.trim().toUpperCase();
    const studentId = formData.get("studentId") as string;
    const courseName = formData.get("courseName") as string;
    const completionDate = formData.get("completionDate") as string;
    const duration = formData.get("duration") as string;
    const fathersName = formData.get("fathersName") as string;
    const photo = formData.get("photo") as string | null;

    if (!certificateId || !studentId || !courseName || !completionDate || !duration || !fathersName) {
        return { error: "All fields are required." };
    }

    try {
        // Check uniqueness
        const existing = await prisma.certificate.findUnique({ where: { certificateId } });
        if (existing) {
            return { error: `Certificate ID "${certificateId}" already exists. Please use a different ID.` };
        }

        await prisma.certificate.create({
            data: {
                certificateId,
                studentId,
                courseName,
                completionDate: new Date(completionDate),
                duration,
                fathersName,
                photo: photo || null,
            }
        });

        revalidatePath("/admin/certificates");
        return { success: true };
    } catch (error: any) {
        console.error("Error issuing certificate:", error);
        return { error: "Failed to issue certificate: " + (error.message || "Unknown error") };
    }
}

export async function deleteCertificate(id: string) {
    try {
        await prisma.certificate.delete({ where: { id } });
        revalidatePath("/admin/certificates");
        return { success: true };
    } catch (error: any) {
        return { error: "Failed to delete certificate: " + error.message };
    }
}
