"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, User, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                username,
                password,
            });

            if (result?.error) {
                setError("Invalid username or password");
            } else {
                // Fetch session to get user role
                const sessionRes = await fetch("/api/auth/session");
                const session = await sessionRes.json();

                if (session?.user?.role === "ADMIN") {
                    router.push("/admin");
                } else if (session?.user?.role === "STUDENT") {
                    router.push("/student");
                } else {
                    router.push("/");
                }
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100 border border-gray-100 overflow-hidden">
                    <div className="bg-blue-600 p-8 text-center text-white relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 relative z-10" />
                        <h1 className="text-3xl font-bold relative z-10 tracking-tight">KIMT Portal</h1>
                        <p className="text-blue-100 relative z-10 opacity-80 mt-1">Sign in to your account</p>
                    </div>

                    <div className="p-10">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-4">
                                <Lock className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Username</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Enter your username"
                                        required
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                            <p className="text-gray-500 text-sm">
                                Forgot your password? <Link href="/contact" className="text-blue-600 font-bold hover:underline">Contact Admin</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-gray-400 text-sm font-medium">
                    © 2026 KIMT Institute of Tech. All rights reserved.
                </p>
            </div>
        </div>
    );
}
