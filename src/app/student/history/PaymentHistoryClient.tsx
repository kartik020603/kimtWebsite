"use client";

import { useState } from "react";
import { History, Clock, FileText, Download } from "lucide-react";
import Receipt from "@/components/Receipt";

export default function PaymentHistoryClient({ studentData }: { studentData: any }) {
    const [selectedPayment, setSelectedPayment] = useState<any>(null);

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-10">
            <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
                    <History className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Transaction History</h1>
                    <p className="text-gray-500 font-medium">Review all your previous fee payments.</p>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in duration-500">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="pb-6 font-bold">Date</th>
                                <th className="pb-6 font-bold">Transaction ID</th>
                                <th className="pb-6 font-bold">Amount</th>
                                <th className="pb-6 font-bold">Status</th>
                                <th className="pb-6 font-bold text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {studentData.payments.map((p: any) => (
                                <tr key={p.id} className="text-gray-700 hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-6 font-medium">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                    <td className="py-6 font-mono text-xs text-gray-400">{p.id.substring(0, 12)}...</td>
                                    <td className="py-6 font-black text-blue-600 text-lg">₹{p.amount.toLocaleString()}</td>
                                    <td className="py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-6 text-center">
                                        <button
                                            onClick={() => setSelectedPayment(p)}
                                            className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-100"
                                            title="View Receipt"
                                        >
                                            <FileText className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {studentData.payments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Clock className="h-12 w-12 text-gray-200 mb-4" />
                                            <p className="text-gray-400 font-bold italic">No payment records available yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedPayment && (
                <Receipt
                    payment={selectedPayment}
                    student={studentData}
                    onClose={() => setSelectedPayment(null)}
                />
            )}
        </div>
    );
}
