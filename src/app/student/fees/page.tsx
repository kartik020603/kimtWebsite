import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreditCard, Calendar, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function StudentFeesPage() {
    const session = await getServerSession(authOptions);
    const studentData = await prisma.student.findUnique({
        where: { userId: (session?.user as any)?.id as string },
    }) as any;

    if (!studentData) return <div className="p-12 text-center text-gray-400 font-bold">Data not found.</div>;

    const stats = [
        { label: "Total Committed", value: `₹${studentData.totalFees.toLocaleString()}`, icon: Sparkles, color: "text-blue-600" },
        { label: "Currently Due", value: `₹${studentData.dueFees.toLocaleString()}`, icon: CreditCard, color: "text-rose-600" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-12 px-6">
            <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
                    <CreditCard className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Fees & Financials</h1>
                    <p className="text-gray-500 font-medium">Keep track of your educational investment and upcoming dues.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:scale-105">
                        <stat.icon className={`h-8 w-8 ${stat.color} mb-6`} />
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-blue-900 p-10 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="bg-white/10 w-fit px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-blue-200">Payment Deadline</div>
                        <h2 className="text-3xl font-black tracking-tight">Your next installment is expected by:</h2>
                        <div className="flex items-center gap-3 text-2xl font-bold bg-white/10 w-fit px-6 py-3 rounded-2xl border border-white/10">
                            <Calendar className="h-6 w-6 text-blue-300" />
                            {studentData.dueDate ? new Date(studentData.dueDate).toLocaleDateString() : 'To be assigned'}
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-blue-200 text-sm font-medium mb-4 max-w-xs ml-auto">Please ensure timely payments to maintain access to your study materials and certificates.</p>
                        <button className="bg-white text-blue-900 font-black px-10 py-4 rounded-2xl shadow-2xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
                            Contact Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
