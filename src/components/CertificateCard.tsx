"use client";

import { useState } from "react";
import { Award, BookOpen, Clock, CheckCircle2, Phone, UserCheck, User, ShieldCheck, X, Download } from "lucide-react";

interface CertificateCardProps {
    certificate: any;
    student: any;
    showDownload?: boolean;
}

export default function CertificateCard({ certificate, student, showDownload = true }: CertificateCardProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handlePhotoDownload = () => {
        try {
            const dataUrl: string = certificate.photo;

            // Parse the base64 data URL: "data:<mimeType>;base64,<base64data>"
            const [header, base64Data] = dataUrl.split(",");
            const mimeType = (header.match(/:(.*?);/) || [])[1] || "image/jpeg";

            // Decode base64 to binary bytes
            const byteChars = atob(base64Data);
            const byteArr = new Uint8Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
                byteArr[i] = byteChars.charCodeAt(i);
            }
            // Always output as JPEG — if already JPEG, use directly; otherwise convert via canvas
            const blob = new Blob([byteArr], { type: mimeType });
            const tempUrl = URL.createObjectURL(blob);

            if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
                // Already JPEG, download directly
                const a = document.createElement("a");
                const safeId = (certificate.certificateId || "photo").replace(/\//g, "-");
                a.href = tempUrl;
                a.download = `certificate_photo_${safeId}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(tempUrl);
            } else {
                // Convert to JPEG via canvas
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext("2d")!;
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    const safeId = (certificate.certificateId || "photo").replace(/\//g, "-");
                    canvas.toBlob((b) => {
                        if (!b) return;
                        const jpgUrl = URL.createObjectURL(b);
                        const a = document.createElement("a");
                        a.href = jpgUrl;
                        a.download = `certificate_photo_${safeId}.jpg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(jpgUrl);
                    }, "image/jpeg", 0.95);
                    URL.revokeObjectURL(tempUrl);
                };
                img.src = tempUrl;
            }
        } catch (err) {
            console.error("Photo download failed:", err);
        }
    };

    return (
        <>
            {/* Certificate Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-indigo-50 overflow-hidden certificate-printable animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 p-10 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className="relative z-10 flex items-start justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Award className="h-8 w-8 text-indigo-300" />
                                <span className="text-indigo-200 font-bold uppercase tracking-widest text-xs">KIMT Institute — Certificate of Completion</span>
                            </div>
                            <h2 className="text-4xl font-black mb-1">{student.user.name || student.user.username}</h2>
                            <p className="text-indigo-200 font-medium text-lg">{certificate.courseName}</p>
                            <div className="mt-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl inline-block">
                                <span className="font-black text-white tracking-wider">{certificate.certificateId}</span>
                            </div>
                        </div>
                        {certificate.photo && (
                            <button
                                onClick={() => setIsLightboxOpen(true)}
                                title="Click to enlarge"
                                className="flex-shrink-0 relative group focus:outline-none no-print"
                            >
                                <img
                                    src={certificate.photo}
                                    alt={student.user.name || "Student"}
                                    className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white/30 group-hover:ring-white/60 transition-all shadow-xl"
                                />
                                <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-lg">Enlarge</span>
                                </div>
                            </button>
                        )}
                        {/* Static Photo for Printing */}
                        {certificate.photo && (
                            <div className="hidden print-block flex-shrink-0">
                                <img
                                    src={certificate.photo}
                                    alt={student.user.name || "Student"}
                                    className="h-28 w-28 rounded-2xl object-cover ring-2 ring-indigo-600"
                                />
                            </div>
                        )}
                        {!certificate.photo && (
                            <div className="h-28 w-28 bg-indigo-500 rounded-2xl flex items-center justify-center font-black text-4xl text-white/80 flex-shrink-0 uppercase">
                                {(student.user.name || student.user.username)[0]}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailItem icon={BookOpen} label="Course" value={certificate.courseName} color="indigo" />
                    <DetailItem icon={Clock} label="Duration" value={certificate.duration} color="emerald" />
                    <DetailItem
                        icon={CheckCircle2}
                        label="Completion Date"
                        value={new Date(certificate.completionDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        color="amber"
                    />
                    <DetailItem icon={Phone} label="Mobile No." value={student.mobileNo} color="purple" />
                    <DetailItem icon={UserCheck} label="Father's Name" value={certificate.fathersName} color="rose" />
                    <DetailItem icon={User} label="Student ID" value={student.user.username} color="sky" />
                </div>

                {/* Footer */}
                <div className="px-10 pb-10">
                    <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-medium italic">Issued on {new Date(certificate.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                            <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest font-bold">KIMT-VERIFIED-DOCUMENT</p>
                        </div>
                        <div className="flex items-center gap-4 no-print">
                            {showDownload && (
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Certificate
                                </button>
                            )}
                            <div className="flex items-center gap-2 text-emerald-600">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-xs font-bold">Authentic Record</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all no-print"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={certificate.photo}
                            alt="Photo"
                            className="w-full rounded-3xl shadow-2xl border-4 border-white/10 animate-in zoom-in-95 duration-300"
                        />
                        <div className="mt-6 flex justify-between items-center text-white/80 no-print">
                            <div>
                                <p className="font-bold text-white text-lg">{student.user.name}</p>
                                <p className="text-sm">Certificate ID: {certificate.certificateId}</p>
                            </div>
                            <button
                                onClick={handlePhotoDownload}
                                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all"
                            >
                                <Download className="h-4 w-4" />
                                Save Photo (JPEG)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @media print {
                    body * {
                        display: none !important;
                    }
                    .certificate-printable, .certificate-printable * {
                        display: block !important;
                    }
                    .certificate-printable {
                        display: block !important;
                        position: relative !important;
                        width: 100% !important;
                        left: 0 !important;
                        top: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border-radius: 0 !important;
                    }
                    .certificate-printable .flex {
                        display: flex !important;
                    }
                    .certificate-printable .grid {
                        display: grid !important;
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 1.5rem !important;
                    }
                    .certificate-printable .bg-gradient-to-r {
                        background: linear-gradient(to right, #4338ca, #4f46e5) !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-block {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
}

function DetailItem({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    const colorClasses: any = {
        indigo: "bg-indigo-100 text-indigo-600",
        emerald: "bg-emerald-100 text-emerald-600",
        amber: "bg-amber-100 text-amber-600",
        purple: "bg-purple-100 text-purple-600",
        rose: "bg-rose-100 text-rose-600",
        sky: "bg-sky-100 text-sky-600",
    };

    return (
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
