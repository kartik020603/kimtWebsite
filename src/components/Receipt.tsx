"use client";

import { useRef, useState } from "react";
import { Download, X, Loader2 } from "lucide-react";

interface ReceiptProps {
    payment: any;
    student: any;
    onClose?: () => void;
}

export default function Receipt({ payment, student, onClose }: ReceiptProps) {
    const receiptRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const studentName = student.user?.name || student.user?.username || "Student";
    const rollNo = student.user?.username || "-";
    const mobileNo = student.mobileNo || "-";
    const courseName = student.course || "-";
    const amount = payment.amount?.toLocaleString("en-IN") || "0";
    const paymentDate = new Date(payment.paymentDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
    });
    const fileSlug = `${rollNo}_${(payment.id || "").substring(0, 8)}`;

    const doDownload = async (format: "jpeg" | "pdf") => {
        if (!receiptRef.current) return;
        setIsDownloading(true);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                removeContainer: true,
            });
            if (format === "jpeg") {
                // Use canvas.toBlob() — Chrome ignores download attribute on data: URLs
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = blobUrl;
                    a.download = `receipt_${fileSlug}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                }, "image/jpeg", 0.95);
            } else {
                const { jsPDF } = await import("jspdf");
                const w = canvas.width / 2;
                const h = canvas.height / 2;
                const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [w, h] });
                // Use toBlob for converting to PDF too
                const imgData = canvas.toDataURL("image/jpeg", 0.95);
                pdf.addImage(imgData, "JPEG", 0, 0, w, h);
                pdf.save(`receipt_${fileSlug}.pdf`);
            }
        } catch (e) {
            console.error("Download failed:", e);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* ───────── Captured receipt (no SVG icons, all inline styles) ───────── */}
                <div ref={receiptRef} style={{ padding: 40, backgroundColor: "#ffffff", fontFamily: "'Arial', sans-serif", color: "#1a1a2e" }}>

                    {/* Header */}
                    <div style={{ textAlign: "center", borderBottom: "3px solid #4f46e5", paddingBottom: 24, marginBottom: 24 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <div style={{ background: "#4f46e5", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 20 }}>K</div>
                            <span style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: 3 }}>KIMT INSTITUTE</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#4f46e5", margin: "4px 0 10px" }}>Kartike Institute of Management and technology</div>
                        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8 }}>kartike house, 8b/13a/kk krishna puram colony, mau road khandari agra 282005</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginTop: 4 }}>Mob No: 8126100208</div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, color: "#aaa", marginBottom: 4 }}>Payment Receipt</div>
                            <div style={{ fontFamily: "monospace", fontSize: 11, color: "#999" }}>{payment.id}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>{paymentDate}</div>
                            <div style={{ display: "inline-block", background: "#d1fae5", color: "#065f46", fontSize: 10, fontWeight: 900, textTransform: "uppercase", padding: "4px 10px", borderRadius: 6, marginTop: 6, letterSpacing: 1 }}>Paid Successfully</div>
                        </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                        {[
                            ["Student Name", studentName],
                            ["Roll No / ID", rollNo],
                            ["Mobile No", mobileNo],
                            ["Course Name", courseName],
                        ].map(([label, value]) => (
                            <div key={label}>
                                <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "#aaa", marginBottom: 4 }}>{label}</div>
                                <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Amount box */}
                    <div style={{ background: "#eef2ff", borderRadius: 16, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, color: "#6366f1", marginBottom: 8 }}>Total Amount Paid</div>
                            <div style={{ fontSize: 36, fontWeight: 900, color: "#1e1b4b" }}>&#8377;{amount}</div>
                        </div>
                        <div style={{ fontSize: 32 }}>&#128179;</div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", fontStyle: "italic", borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
                        <div>This is a computer generated receipt. No signature required.</div>
                        <div style={{ marginTop: 4 }}>KIMT — Empowering Minds, Shaping Futures</div>
                    </div>
                </div>

                {/* ───────── Buttons ───────── */}
                <div className="px-8 pb-8 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-100 transition-all">
                        Close
                    </button>
                    <button
                        onClick={() => doDownload("jpeg")}
                        disabled={isDownloading}
                        className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                        JPEG
                    </button>
                    <button
                        onClick={() => doDownload("pdf")}
                        disabled={isDownloading}
                        className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                        PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
