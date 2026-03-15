import { Code, Database, Cpu, Globe, Smartphone, Palette, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Courses() {
    const courses = [
        { name: "Full Stack Development", duration: "12 Months", icon: Globe, color: "bg-blue-100 text-blue-600", desc: "Build modern web applications from scratch using MERN/NextJS stack." },
        { name: "Artificial Intelligence", duration: "18 Months", icon: Cpu, color: "bg-blue-100 text-blue-600", desc: "Dive deep into Machine Learning, Neural Networks and Cognitive Computing." },
        { name: "Data Science & Big Data", duration: "12 Months", icon: Database, color: "bg-purple-100 text-purple-600", desc: "Learn to analyze large datasets and gain valuable business insights." },
        { name: "Mobile App Development", duration: "6 Months", icon: Smartphone, color: "bg-emerald-100 text-emerald-600", desc: "Create stunning iOS and Android applications with Flutter and React Native." },
        { name: "UI/UX Design Masterclass", duration: "4 Months", icon: Palette, color: "bg-pink-100 text-pink-600", desc: "Master the art of user research and high-fidelity interface design." },
        { name: "Cybersecurity Analyst", duration: "9 Months", icon: Code, color: "bg-orange-100 text-orange-600", desc: "Learn to protect digital infrastructure from advanced security threats." },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-1000">
            {/* Hero Image Section */}
            <div className="relative h-[300px] rounded-3xl overflow-hidden mb-16 shadow-2xl border border-gray-100">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/course_hero.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-12 flex-col justify-end">
                    <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-2xl mb-2">
                        Professional Courses
                    </h1>
                    <p className="text-blue-100 font-medium max-w-2xl">
                        Industry-vetted programs designed to make you an expert in your chosen tech field.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, i) => (
                    <div key={i} className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300">
                        <div className={`w-14 h-14 ${course.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <course.icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                        <p className="text-sm font-semibold text-blue-500 mb-4">{course.duration}</p>
                        <p className="text-gray-600 mb-8 leading-relaxed">{course.desc}</p>
                        <Link href="/contact" className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 transition-colors">
                            Enroll Now
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
