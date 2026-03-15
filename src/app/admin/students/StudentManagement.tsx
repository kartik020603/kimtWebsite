"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, UserPlus, ShieldOff, ShieldCheck, Key, X, Loader2, AlertTriangle, Edit } from "lucide-react";
import { createStudent, toggleStudentStatus, deleteStudent, resetPassword, updateStudent } from "../actions";

export default function StudentManagement({ initialStudents }: { initialStudents: any[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmData, setConfirmData] = useState<{ type: "delete" | "toggle", student: any } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const itemsPerPage = 10;

    const filteredStudents = initialStudents.filter(s =>
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student?.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student?.mobileNo.includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    async function handleAddStudent(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await createStudent(formData);
        setLoading(false);
        if (res.success) {
            setIsAddModalOpen(false);
            (e.target as HTMLFormElement).reset();
            router.refresh();
        } else {
            setErrorMsg(res.error || "Failed to create student.");
        }
    }

    async function handleEditStudent(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await updateStudent(formData);
        setLoading(false);
        if (res.success) {
            setIsEditModalOpen(false);
            router.refresh();
        } else {
            setErrorMsg(res.error || "Failed to update student.");
        }
    }

    async function confirmAction() {
        if (!confirmData) return;
        setLoading(true);
        let res: any;
        if (confirmData.type === "delete") {
            res = await deleteStudent(confirmData.student.id);
        } else {
            res = await toggleStudentStatus(confirmData.student.id, confirmData.student.isActive);
        }
        setLoading(false);
        setConfirmData(null);
        if (res?.error) {
            setErrorMsg(res.error);
        } else {
            router.refresh();
        }
    }

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedStudent || !newPassword) return;
        setLoading(true);
        const res = await resetPassword(selectedStudent.id, newPassword);
        setLoading(false);
        if (res.success) {
            setIsResetModalOpen(false);
            setNewPassword("");
            setErrorMsg("Password updated successfully!");
        } else {
            setErrorMsg(res.error || "Failed to reset password.");
        }
    }

    return (
        <div className="space-y-8">
            {/* Error/Success Notification */}
            {errorMsg && (
                <div className="fixed top-6 right-6 z-[200] bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 flex items-start gap-4 max-w-sm animate-in slide-in-from-top-2 duration-300">
                    <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{errorMsg}</p>
                    </div>
                    <button type="button" onClick={() => setErrorMsg(null)} className="text-gray-400 hover:text-gray-700">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Confirm Dialog */}
            {confirmData && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${confirmData.type === 'delete' ? 'bg-red-100' : 'bg-amber-100'}`}>
                                {confirmData.type === 'delete' ? <Trash2 className="h-6 w-6 text-red-600" /> : <ShieldOff className="h-6 w-6 text-amber-600" />}
                            </div>
                            <div>
                                <p className="font-black text-gray-900">
                                    {confirmData.type === 'delete' ? 'Delete Student?' : 'Toggle Status?'}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    {confirmData.type === 'delete'
                                        ? `"${confirmData.student.username}" will be permanently deleted.`
                                        : `Change status for "${confirmData.student.username}"?`}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setConfirmData(null)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                            <button type="button" onClick={confirmAction} disabled={loading}
                                className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${confirmData.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (confirmData.type === 'delete' ? 'Yes, Delete' : 'Yes, Change')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Management</h1>
                    <p className="text-gray-500 font-medium mt-1">Control access using Student IDs as usernames.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <UserPlus className="h-5 w-5" />
                    Add Student
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, Name, Mobile or Course..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 text-sm uppercase tracking-wider">
                                <th className="px-8 py-6 font-bold">Student</th>
                                <th className="px-8 py-6 font-bold">Details</th>
                                <th className="px-8 py-6 font-bold">Enrolled Course</th>
                                <th className="px-8 py-6 font-bold">Status</th>
                                <th className="px-8 py-6 font-bold">Fees Status</th>
                                <th className="px-8 py-6 text-center font-bold">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedStudents.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase transition-transform group-hover:scale-110">
                                                {s.name ? s.name[0] : s.username[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{s.name || "N/A"}</span>
                                                <span className="text-xs text-gray-400 font-medium">{s.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-700 text-sm">{s.student?.mobileNo}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-gray-700">{s.student?.course}</td>
                                    <td className="px-8 py-6">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmData({ type: 'toggle', student: s })}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 ${s.isActive ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                                        >
                                            {s.isActive ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                                            {s.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-gray-900 tracking-tight">
                                        <div className="flex flex-col">
                                            <span className="text-red-500 text-sm italic">Due: ₹{s.student?.dueFees.toLocaleString()}</span>
                                            <span className="text-blue-600 text-[10px] uppercase">Total: ₹{s.student?.totalFees.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => { setSelectedStudent(s); setIsEditModalOpen(true); }}
                                                title="Edit Student"
                                                className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setSelectedStudent(s); setIsResetModalOpen(true); }}
                                                title="Reset Password"
                                                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Key className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmData({ type: 'delete', student: s })}
                                                title="Delete Student"
                                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedStudents.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="p-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between bg-gray-50/30 gap-4">
                        <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                            Showing <span className="text-blue-600 font-bold">{Math.min(filteredStudents.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-blue-600 font-bold">{Math.min(filteredStudents.length, currentPage * itemsPerPage)}</span> of <span className="text-blue-600 font-bold">{filteredStudents.length}</span> students
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] md:max-w-none">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 flex-shrink-0 text-sm font-bold rounded-xl transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-500'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X />
                        </button>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Register New Student</h2>
                        <p className="text-gray-500 font-medium mb-8">The Student ID will serve as their username.</p>

                        <form onSubmit={handleAddStudent} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                <input name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="Ex: John Doe" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Student ID (Username)</label>
                                    <input name="username" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="KIMT-2026-001" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Initial Password</label>
                                    <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="••••••••" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Enrolled Course</label>
                                    <input name="course" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="e.g. AI & ML" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Mobile Number</label>
                                    <input name="mobileNo" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="98XXXXXXXX" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Total Fees (₹)</label>
                                    <input name="totalFees" type="number" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-blue-600" defaultValue="0" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Due Amount (₹)</label>
                                    <input name="dueFees" type="number" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-red-600" defaultValue="0" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Next Payment Due Date</label>
                                <input name="dueDate" type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Registration"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
                        <button
                            onClick={() => setIsResetModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X />
                        </button>
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Reset Password</h2>
                        <p className="text-gray-500 font-medium mb-6">Change password for <span className="text-blue-600 font-bold">{selectedStudent?.username}</span></p>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {isEditModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X />
                        </button>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Edit Student</h2>
                        <p className="text-gray-500 font-medium mb-8">Update information for {selectedStudent.username}</p>

                        <form onSubmit={handleEditStudent} className="space-y-6">
                            <input type="hidden" name="id" value={selectedStudent.id} />
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                <input name="name" required defaultValue={selectedStudent.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Student ID (Username)</label>
                                    <input name="username" required defaultValue={selectedStudent.username} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Mobile Number</label>
                                    <input name="mobileNo" required defaultValue={selectedStudent.student?.mobileNo} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Enrolled Course</label>
                                    <input name="course" required defaultValue={selectedStudent.student?.course} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Status</label>
                                    <select name="status" defaultValue={selectedStudent.student?.status || "Active"} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium bg-white">
                                        <option value="Active">Active</option>
                                        <option value="Course Completed">Course Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Total Fees (₹)</label>
                                    <input name="totalFees" type="number" required defaultValue={selectedStudent.student?.totalFees} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-blue-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Due Amount (₹)</label>
                                    <input name="dueFees" type="number" required defaultValue={selectedStudent.student?.dueFees} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-red-600" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Next Payment Due Date</label>
                                <input name="dueDate" type="date" defaultValue={selectedStudent.student?.dueDate ? new Date(selectedStudent.student.dueDate).toISOString().split('T')[0] : ""} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
