import { Search, ShieldCheck, AlertCircle, CheckCircle2, Award, User, BookOpen, Clock, Phone, UserCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import CertificateCard from "@/components/CertificateCard";

export default async function VerifyPage({
    searchParams
}: {
    searchParams: Promise<{ id?: string }>
}) {
    const params = await searchParams;
    const certId = params.id?.trim() || "";

    let certificate: any = null;
    let searched = false;

    if (certId) {
        searched = true;
        certificate = await prisma.certificate.findUnique({
            where: { certificateId: certId },
            include: {
                student: {
                    include: { user: true }
                }
            }
        });
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-1000">
            {/* Hero Image Section */}
            <div className="relative h-[300px] rounded-3xl overflow-hidden mb-16 shadow-2xl border border-gray-100">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/verify_hero.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-12 flex-col justify-end">
                    <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-2xl mb-2">
                        Certificate Verification
                    </h1>
                    <p className="text-blue-100 font-medium">
                        Verify the authenticity of any KIMT certificate instantly.
                    </p>
                </div>
            </div>

            {/* Search Form */}
            <div className="max-w-xl mx-auto mb-10">
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <ShieldCheck className="h-32 w-32 text-blue-600 rotate-12" />
                    </div>
                    <form method="GET" action="/verify" className="relative z-10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Certificate ID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="id"
                                    defaultValue={certId}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-medium"
                                    placeholder="e.g. KIMT-2026-0001"
                                    required
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="h-5 w-5" />
                            Verify Certificate
                        </button>
                    </form>
                </div>
            </div>

            {/* Result */}
            {searched && !certificate && (
                <div className="max-w-xl mx-auto">
                    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex items-center gap-6 animate-in zoom-in-95 duration-300">
                        <div className="h-14 w-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-7 w-7 text-red-600" />
                        </div>
                        <div>
                            <p className="font-black text-red-700 text-lg">Certificate Not Found</p>
                            <p className="text-sm text-red-500 font-medium mt-1">No record found for <span className="font-bold">"{certId}"</span>. Please check the ID and try again.</p>
                        </div>
                    </div>
                </div>
            )}

            {certificate && (
                <div className="max-w-3xl mx-auto">
                    {/* Valid Banner */}
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-4 mb-6 animate-in slide-in-from-top-2 duration-300">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                        <div>
                            <p className="font-black text-emerald-700">Certificate Verified ✓</p>
                            <p className="text-sm text-emerald-600 font-medium">This certificate is authentic and issued by KIMT.</p>
                        </div>
                    </div>

                    <CertificateCard certificate={certificate} student={certificate.student} />
                </div>
            )}
        </div>
    );
}
