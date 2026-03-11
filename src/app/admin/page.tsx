import { Users, CreditCard, TrendingUp, AlertCircle, Search, BookOpen, ArrowRight, BarChart } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
    // fetching real counts from DB
    const totalActiveStudents = await prisma.user.count({ where: { role: "STUDENT", isActive: true } });
    const totalStudentRecords = await prisma.student.findMany();
    const globalTotalFees = totalStudentRecords.reduce((acc, s) => acc + s.totalFees, 0);
    const globalTotalDue = totalStudentRecords.reduce((acc, s) => acc + (s.dueFees || 0), 0);

    const recentPayments = await prisma.payment.findMany({
        include: { student: { include: { user: true } } },
        take: 5,
        orderBy: { paymentDate: "desc" }
    });

    const stats = [
        { label: "Active Students", value: totalActiveStudents.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Revenue", value: `₹${(globalTotalFees - globalTotalDue).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Pending Fees", value: `₹${globalTotalDue.toLocaleString()}`, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
        { label: "Total Students", value: totalStudentRecords.length.toString(), icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-50" },
    ];

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight underline-offset-8 decoration-indigo-600">
                        Institute Overview
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Snapshot of your institute's key metrics.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <form action="/admin/students" method="GET" className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 font-bold" />
                        <input
                            name="search"
                            placeholder="Find Pupil..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </form>
                    <Link href="/admin/reports" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">
                        <BarChart className="h-4 w-4" />
                        <span>Reports</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-indigo-100/30">
                        <div className="flex items-center gap-4">
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-black text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                        <Link href="/admin/payments" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
                    </div>
                    <div className="space-y-6">
                        {recentPayments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center font-bold text-xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors uppercase">
                                        {p.student.user.name ? p.student.user.name[0] : p.student.user.username[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase">{p.student.user.name || p.student.user.username}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{new Date(p.paymentDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900 uppercase">₹{p.amount.toLocaleString()}</p>
                                    <ArrowRight className="h-3 w-3 text-gray-300 ml-auto group-hover:text-indigo-400 transition-colors" />
                                </div>
                            </div>
                        ))}
                        {recentPayments.length === 0 && (
                            <p className="text-gray-400 text-center py-12 italic">No recent transactions to display.</p>
                        )}
                    </div>
                </div>

                {/* Revenue Overview */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Revenue Ledger</h2>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp className="h-3 w-3" />
                            Overall
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Total Fee Collection</p>
                                <p className="text-3xl font-black text-gray-900 leading-none">₹{globalTotalFees.toLocaleString()}</p>
                            </div>
                            <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                <div
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                    style={{ width: `${globalTotalFees > 0 ? ((globalTotalFees - globalTotalDue) / globalTotalFees) * 100 : 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                                <span className="text-indigo-600">₹{(globalTotalFees - globalTotalDue).toLocaleString()} Collected</span>
                                <span className="text-rose-500">₹{globalTotalDue.toLocaleString()} Pending</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <Link href="/admin/reports" className="block w-full py-4 text-center text-xs font-black text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all uppercase tracking-widest">
                                Analyze Performance
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
