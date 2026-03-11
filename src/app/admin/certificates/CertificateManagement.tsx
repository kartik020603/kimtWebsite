"use client";

import { Award, Plus, Trash2, X, Loader2, Search, ShieldCheck, ZoomIn, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { issueCertificate, deleteCertificate } from "./actions";

export default function CertificateManagement({ students, initialCertificates }: { students: any[], initialCertificates: any[] }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [studentSearch, setStudentSearch] = useState("");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmCertData, setConfirmCertData] = useState<{ id: string, certId: string } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const itemsPerPage = 10;

    const filteredStudents = students.filter(s =>
        s.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.name?.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const filteredCertificates = initialCertificates.filter(c =>
        c.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.student.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
    const paginatedCertificates = filteredCertificates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    async function handleIssueCertificate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        if (photoPreview) {
            formData.set("photo", photoPreview);
        }
        const res = await issueCertificate(formData);
        setLoading(false);
        if (res.success) {
            setIsModalOpen(false);
            setPhotoPreview(null);
            router.refresh();
        } else {
            setErrorMsg(res.error || "Failed to issue certificate.");
        }
    }

    async function confirmDelete() {
        if (!confirmCertData) return;
        setLoading(true);
        const res = await deleteCertificate(confirmCertData.id);
        setLoading(false);
        setConfirmCertData(null);
        if (res.success) {
            router.refresh();
        } else {
            setErrorMsg(res.error || "Failed to delete certificate.");
        }
    }

    return (
        <div className="space-y-10">
            {/* Toast */}
            {errorMsg && (
                <div className="fixed top-6 right-6 z-[200] bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 flex items-start gap-4 max-w-sm">
                    <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className="flex-1 font-bold text-gray-900 text-sm">{errorMsg}</p>
                    <button type="button" onClick={() => setErrorMsg(null)} className="text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>
                </div>
            )}

            {/* Delete Confirm Dialog */}
            {confirmCertData && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="font-black text-gray-900">Delete Certificate?</p>
                                <p className="text-sm text-gray-500 font-medium">Certificate <span className="font-bold text-indigo-600">{confirmCertData.certId}</span> will be permanently deleted.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setConfirmCertData(null)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                            <button type="button" onClick={confirmDelete} disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Lightbox */}
            {lightboxPhoto && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setLightboxPhoto(null)}
                >
                    <div className="relative max-w-lg w-full">
                        <button
                            onClick={() => setLightboxPhoto(null)}
                            className="absolute -top-12 right-0 text-white/70 hover:text-white font-bold flex items-center gap-2"
                        >
                            <X className="h-5 w-5" /> Close
                        </button>
                        <img
                            src={lightboxPhoto}
                            alt="Student Photo"
                            className="w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl ring-4 ring-white/20"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Certificate Management</h1>
                    <p className="text-gray-500 font-medium mt-1">Issue and manage student certificates.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus className="h-5 w-5" />
                    Issue Certificate
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-indigo-500 rounded-2xl flex items-center justify-center">
                            <Award className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Total Issued</p>
                            <h2 className="text-4xl font-black">{initialCertificates.length}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Publicly Verifiable</p>
                        <h2 className="text-4xl font-black text-gray-900">{initialCertificates.length}</h2>
                    </div>
                </div>
            </div>

            {/* Certificates Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between bg-gray-50/30 gap-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Award className="h-5 w-5 text-indigo-600" />
                        All Certificates
                    </h3>
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Course..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="px-8 py-6 font-bold">Certificate ID</th>
                                <th className="px-8 py-6 font-bold">Student</th>
                                <th className="px-8 py-6 font-bold">Course</th>
                                <th className="px-8 py-6 font-bold">Completion</th>
                                <th className="px-8 py-6 font-bold">Duration</th>
                                <th className="px-8 py-6 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedCertificates.map((cert) => (
                                <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-indigo-600 tracking-wide">{cert.certificateId}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            {cert.photo ? (
                                                <div className="relative group cursor-pointer" onClick={() => setLightboxPhoto(cert.photo)}>
                                                    <img src={cert.photo} alt="photo" className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-100 group-hover:ring-indigo-400 transition-all" />
                                                    <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                        <ZoomIn className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold uppercase text-sm">
                                                    {cert.student.user.name?.[0] || cert.student.user.username[0]}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900">{cert.student.user.name || "N/A"}</p>
                                                <p className="text-xs text-gray-400 font-medium">{cert.student.user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-gray-700">{cert.courseName}</td>
                                    <td className="px-8 py-6 text-gray-500 font-medium">{new Date(cert.completionDate).toLocaleDateString()}</td>
                                    <td className="px-8 py-6 text-gray-500 font-medium">{cert.duration}</td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmCertData({ id: cert.id, certId: cert.certificateId })}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Certificate"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedCertificates.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">
                                        No certificates issued yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="p-6 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between">
                        <p className="text-sm text-gray-500">Page <span className="text-indigo-600 font-bold">{currentPage}</span> of {totalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all">Previous</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Issue Certificate Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-y-auto max-h-[90vh]">
                        <button onClick={() => { setIsModalOpen(false); setPhotoPreview(null); }} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <X />
                        </button>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Issue Certificate</h2>
                        <p className="text-gray-500 font-medium mb-8">Fill in all details to generate a verifiable certificate.</p>

                        <form onSubmit={handleIssueCertificate} className="space-y-5">
                            {/* Certificate ID */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Certificate ID <span className="text-red-500">*</span></label>
                                <input
                                    name="certificateId"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-indigo-600 tracking-wider"
                                    placeholder="e.g. KIMT-2026-0001"
                                />
                                <p className="text-xs text-gray-400 font-medium">Enter your own unique certificate number.</p>
                            </div>

                            {/* Student Picker */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Select Student</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Type to filter..."
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none font-medium mb-2"
                                    />
                                </div>
                                <select name="studentId" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 bg-gray-50/50">
                                    <option value="">-- Choose Student --</option>
                                    {filteredStudents.map(s => (
                                        <option key={s.student?.id} value={s.student?.id}>{s.name || s.username} ({s.username})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Course Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Course Name</label>
                                <input name="courseName" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="e.g. Full Stack Development" />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                {/* Completion Date */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Completion Date</label>
                                    <input name="completionDate" type="date" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                                </div>
                                {/* Duration */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Duration</label>
                                    <input name="duration" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="e.g. 6 Months" />
                                </div>
                            </div>

                            {/* Father's Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Father's Name</label>
                                <input name="fathersName" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="Father's full name" />
                            </div>

                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Certificate Photo</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {photoPreview ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <img src={photoPreview} alt="preview" className="h-24 w-24 rounded-2xl object-cover ring-4 ring-indigo-100 shadow-md" />
                                            <p className="text-sm font-bold text-indigo-600">✓ Photo selected — click to change</p>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <ZoomIn className="h-7 w-7 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-bold">Click to upload student photo</p>
                                            <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP supported</p>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Issue Certificate"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
