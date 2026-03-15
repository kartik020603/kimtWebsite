"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Rocket, GraduationCap, ShieldCheck, Phone, Info, BookOpen, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const navLinks = [
        { name: "Home", href: "/", icon: Rocket },
        { name: "About", href: "/about", icon: Info },
        { name: "Courses", href: "/course", icon: BookOpen },
        { name: "Contact", href: "/contact", icon: Phone },
        { name: "Verify", href: "/verify", icon: ShieldCheck },
    ];

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                KIMT
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                            >
                                <link.icon className="h-4 w-4" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                        {session ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={(session.user as any)?.role === "ADMIN" ? "/admin" : "/student"}
                                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2 rounded-full font-semibold hover:bg-blue-100 transition-all shadow-sm"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex items-center gap-2 bg-gray-50 text-gray-700 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-sm"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-md shadow-blue-200"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                            >
                                <link.icon className="h-5 w-5" />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        ))}
                        {session ? (
                            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                                <Link
                                    href={(session.user as any)?.role === "ADMIN" ? "/admin" : "/student"}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-bold"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }}
                                    className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-bold"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-bold mt-4"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
