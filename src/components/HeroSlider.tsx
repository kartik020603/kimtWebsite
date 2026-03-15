"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const slides = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg"];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setCurrent((c) => (c + 1) % slides.length);
                setAnimating(false);
            }, 600); // transition time
        }, 5000); // slide every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
            {/* Slides */}
            {slides.map((src, i) => (
                <div
                    key={src}
                    className="absolute inset-0 transition-all duration-700 ease-in-out"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: i === current ? 1 : 0,
                        transform: i === current
                            ? "translateX(0%)"
                            : i === (current - 1 + slides.length) % slides.length
                                ? "translateX(-100%)"
                                : "translateX(100%)",
                    }}
                />
            ))}

            {/* Brightened overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-10" />

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
                <div className="text-center text-white">
                    <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom duration-700">
                        <Sparkles className="h-4 w-4" />
                        <span>Enrollment Open for 2026</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-xl">
                        Empowering Minds,{" "}
                        <br />
                        <span className="bg-gradient-to-r from-blue-300 to-blue-300 bg-clip-text text-transparent">
                            Shaping Futures
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-white/90 mb-12 leading-relaxed drop-shadow">
                        Join KIMT - Kartike Institute Of Management and Technology. We provide world-class education
                        with a focus on practical skills and cognitive excellence.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/course"
                            className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2 group"
                        >
                            Explore Courses
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/about"
                            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center"
                        >
                            Our Story
                        </Link>
                    </div>

                    {/* Dot indicators */}
                    <div className="flex justify-center gap-3 mt-12">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`transition-all duration-300 rounded-full ${i === current
                                    ? "w-8 h-2.5 bg-white"
                                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
