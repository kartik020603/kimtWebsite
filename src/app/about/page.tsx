import { Award, Target, Users, ShieldCheck, Mail, MapPin } from "lucide-react";

export default function About() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-1000">
            {/* Hero Image Section */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden mb-16 shadow-2xl border border-gray-100">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-700"
                    style={{ backgroundImage: "url('/about_hero.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-12">
                    <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                        About KIMT
                    </h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto text-center mb-20">
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                    KIMT is dedicated to providing cutting-edge education and industrial training in the field of modern technology. Our mission is to bridge the gap between academic knowledge and industry requirements.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
                <div className="space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-blue-100/50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                        <Target className="h-4 w-4" />
                        <span>Our Vision</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Excellence in Every Byte</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We envision a world where every student has access to the tools and mentorship needed to innovate and contribute to the global technological landscape. KIMT fosters a culture of curiosity and continuous learning.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "State-of-the-art laboratory facilities",
                            "Industry-experienced faculty members",
                            "Hands-on project-based learning model",
                            "Global certificate recognition"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center space-x-3 text-gray-700 font-medium">
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center p-12">
                        <GraduationCap className="h-64 w-64 text-white/20 absolute -bottom-10 -right-10" />
                        <Users className="h-48 w-48 text-white relative z-10" />
                    </div>
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[240px]">
                        <p className="text-gray-900 font-bold text-lg mb-1">20+ Years</p>
                        <p className="text-gray-500 text-sm">Of educational excellence in tech training.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

function GraduationCap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21.42 10.922 12 11.935 2.58 10.922 12 3.935Z" />
            <path d="M3 13.935v5c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5" />
            <path d="m22 10-10 7L2 10" />
        </svg>
    );
}
