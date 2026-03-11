"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Rocket, GraduationCap, ShieldCheck, Phone, Info, BookOpen } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                                KIMT
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                            >
                                <link.icon className="h-4 w-4" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition-all hover:scale-105 shadow-md shadow-indigo-200"
                        >
                            Login
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-indigo-600"
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
                                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                            >
                                <link.icon className="h-5 w-5" />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold mt-4"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
