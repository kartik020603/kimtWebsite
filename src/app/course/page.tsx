import type { Metadata } from "next";
import { ArrowRight, Keyboard, Monitor, Code, Cpu, Calculator, BookOpen } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Professional Courses",
  description: "Browse our industry-vetted tech courses in Agra. Tally, Web Development, AI, and more.",
};

export default function Courses() {
    const courses = [
        { name: "Hindi / English Typing", duration: "3 Months", icon: Keyboard, color: "bg-blue-100 text-blue-600", desc: "Learn fast and accurate typing in both Hindi and English using professional typing software. Improve your typing speed for office work, government exams, and data entry jobs." },
        { name: "Computer Basics", duration: "3 Months", icon: Monitor, color: "bg-purple-100 text-purple-600", desc: "Perfect for beginners. Learn fundamental computer skills including Windows, MS Word, Excel, PowerPoint, internet usage, email, and digital safety for daily office and personal work." },
        { name: "Web Development", duration: "6 Months", icon: Code, color: "bg-emerald-100 text-emerald-600", desc: "Learn how to build modern websites using HTML, CSS, JavaScript and real-world tools. Create responsive websites and deploy them online like professional developers." },
        { name: "Artificial Intelligence", duration: "6 Months", icon: Cpu, color: "bg-orange-100 text-orange-600", desc: "Explore the world of AI and Machine Learning. Learn how AI tools work, build simple AI models, and use modern AI technologies for your new earning startup." },
        { name: "Tally (Accounting Software)", duration: "3 Months", icon: Calculator, color: "bg-pink-100 text-pink-600", desc: "Learn professional accounting using Tally. Understand GST billing, inventory management, financial reports, and real business accounting practices." },
        { name: "CCC (Course on Computer Concepts)", duration: "3 Months", icon: BookOpen, color: "bg-blue-100 text-blue-600", desc: "Prepare for the government-recognized CCC certification. Learn basic computer operations, MS Office, internet usage, and digital literacy required for many government jobs." },
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
                    <AnimatedSection key={i} delay={i * 0.1}>
                        <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 h-full flex flex-col">
                            <div className={`w-14 h-14 ${course.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <course.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                            <p className="text-sm font-semibold text-blue-500 mb-4">{course.duration}</p>
                            <p className="text-gray-600 mb-8 leading-relaxed flex-1">{course.desc}</p>
                            <Link href="/contact" className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 transition-colors mt-auto">
                                Enroll Now
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </AnimatedSection>
                ))}
            </div>
        </div>
    );
}
