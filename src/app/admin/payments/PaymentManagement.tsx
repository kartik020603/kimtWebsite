"use client";

import { Plus, CreditCard, Filter, ChevronDown, CheckCircle, Clock, X, Loader2, Search, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordPayment, updatePayment, deletePayment } from "../actions";

export default function PaymentManagement({ students, initialPayments }: { students: any[], initialPayments: any[] }) {
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [listSearchTerm, setListSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmPaymentId, setConfirmPaymentId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const itemsPerPage = 10;

    const filteredStudents = students.filter(s =>
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student?.mobileNo.includes(searchTerm)
    );

    const filteredPayments = initialPayments.filter(p =>
        p.student.user.username.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
        p.student.user.name?.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
        p.student.mobileNo.includes(listSearchTerm)
    );

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Calculate Collection Overview
    const clearedTotal = initialPayments
        .filter(p => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0);
    const pendingTotal = initialPayments
        .filter(p => p.status === "PENDING")
        .reduce((sum, p) => sum + p.amount, 0);

    async function handleRecordPayment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await recordPayment(formData);
        setLoading(false);
        if (res.success) {
            setIsAddModalOpen(false);
            router.refresh();
        } else {
            setErrorMsg(res.error || "Failed to record payment.");
        }
    }

    async function handleUpdatePayment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await updatePayment(formData);
        setLoading(false);
        if (res.success) {
            setIsEditModalOpen(false);
            router.refresh();
        } else {
            setErrorMsg(res.error || "Failed to update payment.");
        }
    }

    async function confirmDeletePayment() {
        if (!confirmPaymentId) return;
        setLoading(true);
        const res = await deletePayment(confirmPaymentId);
        setLoading(false);
        setConfirmPaymentId(null);
        if (res.success) {
            router.refresh();
        } else {
            setErrorMsg(res.error || "Failed to delete payment.");
        }
    }

    return (
        <div className="space-y-10">
            {/* Toast Notification */}
            {errorMsg && (
                <div className="fixed top-6 right-6 z-[200] bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 flex items-start gap-4 max-w-sm">
                    <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className="flex-1 font-bold text-gray-900 text-sm">{errorMsg}</p>
                    <button type="button" onClick={() => setErrorMsg(null)} className="text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>
                </div>
            )}

            {/* Delete Confirm Dialog */}
            {confirmPaymentId && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="font-black text-gray-900">Delete Payment Record?</p>
                                <p className="text-sm text-gray-500 font-medium">This payment will be permanently removed and balances adjusted.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setConfirmPaymentId(null)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                            <button type="button" onClick={confirmDeletePayment} disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Ledger</h1>
                    <p className="text-gray-500 font-medium mt-1">Record and track student payments accurately.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus className="h-5 w-5" />
                    Record Payment
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between bg-gray-50/30 gap-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Filter className="h-5 w-5 text-indigo-600" />
                                Recent Transactions
                            </h3>
                            <div className="relative max-w-xs w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by ID, Name or Mobile..."
                                    value={listSearchTerm}
                                    onChange={(e) => {
                                        setListSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="px-8 py-6 font-bold">Student</th>
                                        <th className="px-8 py-6 font-bold">Amount</th>
                                        <th className="px-8 py-6 font-bold">Date</th>
                                        <th className="px-8 py-6 font-bold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedPayments.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{p.student.user.name || "N/A"}</span>
                                                    <span className="text-xs text-gray-400 font-medium">{p.student.user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-indigo-600">₹{p.amount.toLocaleString()}</span>
                                                    <span className={`text-[10px] font-bold ${p.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-gray-500 font-medium">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSelectedPayment(p); setIsEditModalOpen(true); }}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Edit Payment"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmPaymentId(p.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Payment"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedPayments.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center text-gray-400 italic font-medium">
                                                No transactions found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                    {filteredPayments.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center text-gray-400 italic">
                                                No historical transactions to display currently.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="p-6 border-t border-gray-50 bg-gray-50/20 flex flex-col md:flex-row items-center justify-between gap-4 font-bold">
                                <p className="text-sm text-gray-500">
                                    Page <span className="text-indigo-600 font-bold">{currentPage}</span> of <span className="text-indigo-600 font-bold">{totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">Collection Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                    <span className="text-sm font-bold text-emerald-900 opacity-70">Cleared</span>
                                </div>
                                <span className="font-black text-emerald-700">₹{clearedTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-amber-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                    <span className="text-sm font-bold text-amber-900 opacity-70">Awaiting</span>
                                </div>
                                <span className="font-black text-amber-700">₹{pendingTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-900 p-8 rounded-[2rem] text-white relative overflow-hidden transition-all hover:scale-105 cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                        <div className="bg-indigo-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-indigo-700 shadow-inner">
                            <CreditCard className="h-7 w-7 text-indigo-200" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 relative z-10">Ledger Security</h3>
                        <p className="text-sm text-indigo-200/80 relative z-10 leading-relaxed font-medium">
                            All payments are encrypted and logged with timestamps to ensure complete financial transparency for the institute.
                        </p>
                    </div>
                </div>
            </div>

            {/* Record Payment Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X />
                        </button>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Record Fee Payment</h2>
                        <p className="text-gray-500 font-medium mb-8">Search for a student and record their transaction.</p>

                        <form onSubmit={handleRecordPayment} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Select Student</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Type to filter list..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none font-medium mb-2"
                                    />
                                </div>
                                <select name="studentId" required className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 bg-gray-50/50">
                                    <option value="">-- Choose Student --</option>
                                    {filteredStudents.map(s => (
                                        <option key={s.id} value={s.student?.id}>{s.name || s.username} ({s.username}) - {s.student?.course}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Amount Paid (₹)</label>
                                    <input name="amount" type="number" required className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-indigo-600 text-lg" placeholder="5000" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Status</label>
                                    <select name="status" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600">
                                        <option value="PAID">PAID (Adjust Dues)</option>
                                        <option value="PENDING">PENDING (Log Only)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Transaction Notes</label>
                                <input name="description" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="Monthly installment / Admission fee" />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Transaction"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Payment Modal */}
            {isEditModalOpen && selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X />
                        </button>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Edit Payment Entry</h2>
                        <p className="text-gray-500 font-medium mb-8">Adjust record for <span className="text-indigo-600">{selectedPayment.student.user.name}</span></p>

                        <form onSubmit={handleUpdatePayment} className="space-y-6">
                            <input type="hidden" name="paymentId" value={selectedPayment.id} />

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Correct Amount (₹)</label>
                                    <input name="amount" type="number" required defaultValue={selectedPayment.amount} className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-indigo-600 text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Status</label>
                                    <select name="status" defaultValue={selectedPayment.status} className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600">
                                        <option value="PAID">PAID (Adjust Dues)</option>
                                        <option value="PENDING">PENDING (Log Only)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Update Notes</label>
                                <input name="description" defaultValue={selectedPayment.description} className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
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
