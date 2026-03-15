import { Settings, ShieldCheck, User } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminSettings() {
    const session = await getServerSession(authOptions);
    const adminUser = await prisma.user.findUnique({
        where: { id: (session?.user as any)?.id }
    });

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
                    <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Control Panel</h1>
                    <p className="text-gray-500 font-medium">Manage system preferences and your account.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Account Settings
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Username</p>
                            <p className="font-bold text-gray-900">{adminUser?.username}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Access Level</p>
                            <p className="font-bold text-blue-600 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                Super Admin
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                    <div>
                        <h3 className="text-xl font-bold mb-4 relative z-10">System Configuration</h3>
                        <p className="text-blue-200/80 text-sm font-medium relative z-10 leading-relaxed">
                            Fine-tune the ERP behavior, from fee collection notifications to student portal restrictions.
                        </p>
                    </div>
                    <button className="mt-8 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl border border-white/20 transition-all relative z-10 backdrop-blur-sm">
                        Access Developer Tools
                    </button>
                </div>
            </div>
        </div>
    );
}
