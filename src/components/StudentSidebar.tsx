"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    BookOpen,
    History,
    LogOut,
    ChevronRight,
    Menu,
    X,
    CreditCard,
    Award
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function StudentSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "My Dashboard", href: "/student", icon: BookOpen },
        { name: "Payment History", href: "/student/history", icon: History },
        { name: "Fees & Dues", href: "/student/fees", icon: CreditCard },
        { name: "My Certificate", href: "/student/certificates", icon: Award },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-2xl"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 transition-transform duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                <div className="flex flex-col h-full text-zinc-900 font-medium">
                    <div className="p-8">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="bg-indigo-600 p-2 rounded-xl text-white">
                                <User className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Student Portal</span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                    flex items-center justify-between px-4 py-4 rounded-2xl transition-all group
                    ${isActive
                                            ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                  `}
                                >
                                    <div className="flex items-center space-x-4">
                                        <item.icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "group-hover:text-gray-900"}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-50">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center space-x-4 w-full px-4 py-4 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all group font-bold"
                        >
                            <LogOut className="h-5 w-5 group-hover:text-red-600" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
