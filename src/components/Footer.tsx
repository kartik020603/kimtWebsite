"use client";

import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 pt-20 pb-10 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                KIMT
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed font-medium">
                            Kartike Institute Of Management and Technology - Shaping the future of tech education with industry-relevant training and certification.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Quick Navigation</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Home", href: "/" },
                                { name: "About Us", href: "/about" },
                                { name: "Our Courses", href: "/course" },
                                { name: "Verification", href: "/verify" },
                                { name: "Contact", href: "/contact" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-indigo-400 font-medium transition-colors flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-white font-bold">+91 8126100208</p>
                                    <p className="text-sm text-gray-500">Mon - Sat, 9am - 6pm</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-1" />
                                <a href="mailto:ravikartikcomputers@gmail.com" className="hover:text-indigo-400 transition-colors break-words font-medium">
                                    ravikartikcomputers@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-1" />
                                <p className="text-sm font-medium leading-relaxed">
                                    Agra, Uttar Pradesh, India
                                </p>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Newsletter</h4>
                        <p className="text-sm text-gray-400 mb-6 font-medium">
                            Stay updated with our latest courses and technical workshops.
                        </p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-5 rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm font-medium text-gray-500">
                        © {new Date().getFullYear()} KIMT. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
