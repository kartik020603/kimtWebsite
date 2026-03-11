import { Users, TrendingUp, BookOpen, Filter, BarChart } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ReportsPage({
    searchParams
}: {
    searchParams: Promise<{ month?: string, year?: string, course?: string, page?: string }>
}) {
    const params = await searchParams;
    const selectedMonth = params.month ? parseInt(params.month) : undefined;
    const selectedYear = params.year ? parseInt(params.year) : new Date().getFullYear();
    const selectedCourse = params.course;
    const currentPage = params.page ? parseInt(params.page) : 1;
    const itemsPerPage = 10;

    // Fetch unique courses for filter
    const courses = await prisma.student.findMany({
        select: { course: true },
        distinct: ['course']
    });

    // Date range for filtering
    const startDate = selectedMonth !== undefined
        ? new Date(selectedYear, selectedMonth - 1, 1)
        : new Date(selectedYear, 0, 1);
    const endDate = selectedMonth !== undefined
        ? new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999)
        : new Date(selectedYear, 11, 31, 23, 59, 59, 999);

    // Filtering conditions
    const studentsWhere: any = { role: "STUDENT" };
    const paymentsWhere: any = { paymentDate: { gte: startDate, lte: endDate } };

    if (selectedCourse) {
        studentsWhere.student = { course: selectedCourse };
        paymentsWhere.student = { course: selectedCourse };
    }
    studentsWhere.createdAt = { gte: startDate, lte: endDate };

    // Filtered Stats for Summary Panel
    const filteredNewStudents = await prisma.user.count({ where: studentsWhere });
    const filteredPayments = await prisma.payment.findMany({
        where: paymentsWhere,
        include: { student: { include: { user: true } } },
    });
    const filteredRevenue = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

    // Course Breakdown - Filtered by Month/Year/Course
    const courseStats = await Promise.all(courses
        .filter(c => !selectedCourse || c.course === selectedCourse)
        .map(async ({ course }) => {
            const count = await prisma.student.count({
                where: {
                    course,
                    user: {
                        createdAt: { gte: startDate, lte: endDate }
                    }
                }
            });
            const payments = await prisma.payment.findMany({
                where: {
                    student: { course },
                    paymentDate: { gte: startDate, lte: endDate }
                }
            });
            const revenue = payments.reduce((acc, p) => acc + p.amount, 0);
            return { course, count, revenue };
        }));

    // Detailed Student List for Selected Period
    const enrollmentConditions = {
        user: {
            createdAt: { gte: startDate, lte: endDate }
        },
        ...(selectedCourse ? { course: selectedCourse } : {})
    };

    const totalEnrollments = await prisma.student.count({
        where: enrollmentConditions
    });

    const enrollmentDetails = await prisma.student.findMany({
        where: enrollmentConditions,
        include: { user: true },
        orderBy: { user: { createdAt: 'desc' } },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage
    });

    const totalPages = Math.ceil(totalEnrollments / itemsPerPage);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight underline-offset-8 decoration-indigo-600">
                        Detailed Reports
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Independent analysis of enrollment and revenue.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
                    <Filter className="h-4 w-4" />
                    Filter Reports
                </div>
                <form className="flex flex-wrap items-center gap-4 flex-1">
                    <select name="month" className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">All Months</option>
                        {months.map((m, i) => (
                            <option key={m} value={i + 1} selected={selectedMonth === i + 1}>{m}</option>
                        ))}
                    </select>
                    <select name="year" className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500">
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y} selected={selectedYear === y}>{y}</option>
                        ))}
                    </select>
                    <select name="course" className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">All Courses</option>
                        {courses.map(c => (
                            <option key={c.course} value={c.course} selected={selectedCourse === c.course}>{c.course}</option>
                        ))}
                    </select>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">
                        Apply Reports
                    </button>
                    {(selectedMonth || selectedCourse) && (
                        <a href="/admin/reports" className="text-gray-400 text-sm font-bold hover:text-gray-600">Clear</a>
                    )}
                </form>
            </div>

            {/* Filtered Summary Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-indigo-100 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Selected Period Revenue</p>
                            <h2 className="text-5xl font-black mb-1">₹{filteredRevenue.toLocaleString()}</h2>
                            <p className="text-indigo-200 font-medium">From {filteredPayments.length} transactions {selectedMonth ? `in ${months[selectedMonth - 1]}` : 'in the year'}</p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-indigo-100 font-bold">
                            <TrendingUp className="h-5 w-5" />
                            <span>Revenue Analysis Complete</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">New Enrollments</p>
                            <h2 className="text-4xl font-black text-gray-900">{filteredNewStudents} Pupils</h2>
                        </div>
                        <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Users className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span className="text-sm font-bold text-gray-500">Course Focus</span>
                            <span className="text-sm font-black text-indigo-600 truncate max-w-[150px]">{selectedCourse || "All Courses"}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Showing data for {selectedMonth ? months[selectedMonth - 1] : "the year"} {selectedYear}.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content: Course Stats & Enrollment Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Breakdown Table */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="text-lg font-black text-gray-900 leading-tight">Course Breakdown</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Enrollment & Revenue</p>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {courseStats.map((cs) => (
                                <div key={cs.course} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-900 text-base truncate pr-2">{cs.course}</span>
                                        <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">₹{cs.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${Math.min(100, (cs.count / (filteredNewStudents || 1)) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-gray-400 whitespace-nowrap">{cs.count} Pupils</span>
                                    </div>
                                </div>
                            ))}
                            {courseStats.length === 0 && (
                                <p className="p-8 text-center text-gray-400 italic text-sm">No courses matching filters.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Enrollment List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-px">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 leading-tight">Enrollment History</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Students Joined in Period</p>
                            </div>
                            <BookOpen className="h-6 w-6 text-gray-200" />
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-white border-b border-gray-50">
                                    <tr className="text-gray-400 text-xs font-black uppercase tracking-widest">
                                        <th className="px-8 py-5">Student</th>
                                        <th className="px-8 py-5">Course</th>
                                        <th className="px-8 py-5 text-right">Join Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {enrollmentDetails.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                                                        {s.user.name ? s.user.name[0] : s.user.username[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900 text-base">{s.user.name || "N/A"}</span>
                                                        <span className="text-xs text-gray-400 font-medium">{s.user.username}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-bold text-gray-600">{s.course}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="text-xs font-bold text-gray-400">
                                                    {new Date(s.user.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrollmentDetails.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic text-sm">
                                                No enrollments found for the selected filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination UI for Enrollment History */}
                        {totalPages > 1 && (
                            <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/30 font-bold">
                                <p className="text-sm text-gray-500 uppercase tracking-widest">
                                    Page <span className="text-indigo-600 font-black">{currentPage}</span> / {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    {currentPage > 1 && (
                                        <a
                                            href={`/admin/reports?month=${params.month || ''}&year=${params.year || ''}&course=${params.course || ''}&page=${currentPage - 1}`}
                                            className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                                        >
                                            PREV
                                        </a>
                                    )}
                                    {currentPage < totalPages && (
                                        <a
                                            href={`/admin/reports?month=${params.month || ''}&year=${params.year || ''}&course=${params.course || ''}&page=${currentPage + 1}`}
                                            className="px-6 py-2.5 bg-indigo-600 border border-indigo-600 rounded-xl text-xs font-black text-white hover:bg-indigo-700 transition-all shadow-md"
                                        >
                                            NEXT
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
