import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookOpen, Phone, Calendar, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function StudentDashboard() {
    const session = await getServerSession(authOptions);

    const studentData = await prisma.student.findUnique({
        where: { userId: (session?.user as any)?.id as string },
        include: {
            user: true,
            payments: { take: 10, orderBy: { paymentDate: 'desc' } }
        }
    }) as any;

    if (!studentData) {
        return <div className="p-12 text-center text-gray-500">Profile data not found (ID: {(session?.user as any)?.id}). Please contact admin.</div>;
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight underline-offset-8 decoration-indigo-600">
                        Welcome, {studentData.user.name || studentData.user.username}!
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your courses and fee details here.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4">
                            <div className="bg-indigo-50 p-4 rounded-2xl">
                                <BookOpen className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Enrolled Course</p>
                                <p className="text-xl font-bold text-gray-900">{studentData.course}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4">
                            <div className="bg-emerald-50 p-4 rounded-2xl">
                                <Phone className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Mobile Number</p>
                                <p className="text-xl font-bold text-gray-900">{studentData.mobileNo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment History Card */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm font-bold">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="pb-4 font-bold">Date</th>
                                        <th className="pb-4 font-bold">Amount</th>
                                        <th className="pb-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {studentData.payments.map((p: any, i: number) => (
                                        <tr key={i} className="text-gray-700">
                                            <td className="py-4">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                            <td className="py-4">₹{p.amount.toLocaleString()}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {studentData.payments.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-gray-400 italic">No payments found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Fees Info Sidebar */}
                <div className="space-y-8">
                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                        <CreditCard className="h-10 w-10 text-indigo-200 mb-6" />
                        <h3 className="text-lg font-bold opacity-80 mb-2">Total Outstanding</h3>
                        <div className="text-4xl font-black mb-10">₹{studentData.dueFees.toLocaleString()}</div>

                        <div className="space-y-4 pt-6 border-t border-indigo-500/50">
                            <div className="flex justify-between items-center">
                                <span className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Next Due Date</span>
                                <span className="font-bold flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {studentData.dueDate ? new Date(studentData.dueDate).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Total Course Fee</span>
                                <span className="font-bold">₹{studentData.totalFees.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${studentData.status === 'Course Completed' ? 'bg-indigo-600' : 'bg-emerald-600'} p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-4 text-white transition-all`}>
                        <CheckCircle2 className="h-8 w-8 text-white/80" />
                        <div>
                            <p className="font-bold text-lg">{studentData.status || "Active Status"}</p>
                            <p className="text-white/80 text-sm opacity-90 leading-tight">
                                {studentData.status === 'Course Completed'
                                    ? "Congratulations! You have successfully completed your course."
                                    : "Your account is fully active and compliant."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
