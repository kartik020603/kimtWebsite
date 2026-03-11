"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createStudent(formData: FormData) {
    console.log("Creating student with data:", Object.fromEntries(formData));
    const username = formData.get("username") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const course = formData.get("course") as string;
    const mobileNo = formData.get("mobileNo") as string;
    const totalFees = parseFloat(formData.get("totalFees") as string || "0");
    const dueFees = parseFloat(formData.get("dueFees") as string || "0");
    const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role: "STUDENT",
                isActive: true,
                student: {
                    create: {
                        course,
                        mobileNo,
                        totalFees,
                        dueFees,
                        dueDate,
                    }
                }
            }
        });

        console.log("Student created successfully:", newUser.username);

        revalidatePath("/admin/students");
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Error in createStudent:", error);
        if (error.code === 'P2002') {
            return { error: "Student ID (username) already exists." };
        }
        return { error: "Failed to create student: " + (error.message || "Unknown error") };
    }
}

export async function toggleStudentStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.user.update({
            where: { id },
            data: { isActive: !currentStatus }
        });
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status." };
    }
}

export async function deleteStudent(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete student." };
    }
}

export async function recordPayment(formData: FormData) {
    console.log("Recording payment:", Object.fromEntries(formData));
    const studentId = formData.get("studentId") as string;
    const amountStr = formData.get("amount") as string;
    const amount = parseFloat(amountStr);
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;

    if (!studentId || isNaN(amount)) {
        console.error("Invalid payment data:", { studentId, amountStr });
        return { error: "Invalid payment data." };
    }

    try {
        // 1. Record the payment
        const payment = await prisma.payment.create({
            data: {
                studentId,
                amount,
                description,
                status,
            }
        });

        console.log("Payment created:", payment.id);

        // 2. Update the student's due fees if successful and status is PAID
        if (status === "PAID") {
            await prisma.student.update({
                where: { id: studentId },
                data: {
                    dueFees: {
                        decrement: amount
                    }
                }
            });
            console.log("Student dues updated for studentId:", studentId);
        }

        revalidatePath("/admin/payments");
        revalidatePath("/admin");
        revalidatePath("/student");
        return { success: true };
    } catch (error: any) {
        console.error("Error recording payment:", error);
        return { error: "Failed to record payment: " + error.message };
    }
}

export async function resetPassword(id: string, newPassword: string) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
        return { success: true };
    } catch (error) {
        return { error: "Failed to reset password." };
    }
}

export async function deletePayment(paymentId: string) {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { student: true }
        });

        if (!payment) return { error: "Payment not found" };

        // If it was a PAID payment, we need to add the amount back to student dues
        if (payment.status === "PAID") {
            await prisma.student.update({
                where: { id: payment.studentId },
                data: {
                    dueFees: {
                        increment: payment.amount
                    }
                }
            });
        }

        await prisma.payment.delete({
            where: { id: paymentId }
        });

        revalidatePath("/admin/payments");
        revalidatePath("/admin/reports");
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        return { error: "Failed to delete payment: " + error.message };
    }
}

export async function updatePayment(formData: FormData) {
    const paymentId = formData.get("paymentId") as string;
    const newAmount = parseFloat(formData.get("amount") as string);
    const newStatus = formData.get("status") as string;
    const description = formData.get("description") as string;

    try {
        const oldPayment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { student: true }
        });

        if (!oldPayment) return { error: "Payment not found" };

        // Revert old payment influence on dues
        if (oldPayment.status === "PAID") {
            await prisma.student.update({
                where: { id: oldPayment.studentId },
                data: { dueFees: { increment: oldPayment.amount } }
            });
        }

        // Apply new payment influence
        if (newStatus === "PAID") {
            await prisma.student.update({
                where: { id: oldPayment.studentId },
                data: { dueFees: { decrement: newAmount } }
            });
        }

        await prisma.payment.update({
            where: { id: paymentId },
            data: {
                amount: newAmount,
                status: newStatus,
                description
            }
        });

        revalidatePath("/admin/payments");
        revalidatePath("/admin/reports");
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        return { error: "Failed to update payment: " + error.message };
    }
}
export async function updateStudent(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const course = formData.get("course") as string;
    const mobileNo = formData.get("mobileNo") as string;
    const status = formData.get("status") as string;
    const totalFees = parseFloat(formData.get("totalFees") as string || "0");
    const dueFees = parseFloat(formData.get("dueFees") as string || "0");
    const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null;

    try {
        // Update User table
        await prisma.user.update({
            where: { id },
            data: { name, username }
        });

        // Update Student table using raw SQL to bypass stale Prisma client issues
        // This is a workaround for the 'Unknown argument status' error when prisma generate fails due to file locks
        await prisma.$executeRawUnsafe(
            `UPDATE Student SET course = ?, mobileNo = ?, status = ?, totalFees = ?, dueFees = ?, dueDate = ? WHERE userId = ?`,
            course, mobileNo, status, totalFees, dueFees, dueDate ? dueDate.toISOString() : null, id
        );

        revalidatePath("/admin/students");
        revalidatePath("/admin");
        revalidatePath("/student");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating student:", error);
        return { error: "Failed to update student: " + error.message };
    }
}
