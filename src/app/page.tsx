import Link from "next/link";
import { CheckCircle2, Award, Users, BookOpen, ShieldCheck } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section — animated slider */}
      <HeroSlider />

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Active Students", value: "2000+", icon: Users },
              { label: "Courses Offered", value: "50+", icon: BookOpen },
              { label: "Success Rate", value: "98%", icon: Award },
              { label: "Verify Results", value: "Instant", icon: CheckCircle2 },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 hover:shadow-lg transition-shadow">
                <stat.icon className="h-8 w-8 text-indigo-600 mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="py-24 bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-white lg:max-w-2xl">
              <h2 className="text-4xl font-bold mb-6">Verify Your Certificates Instantly</h2>
              <p className="text-xl text-indigo-100 mb-8 opacity-90">
                Our secure digital platform allows students and employers to verify KIMT certifications with high reliability and zero hassle.
              </p>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-all"
              >
                Verification Portal
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </div>
            <div className="w-full lg:w-96 aspect-square bg-indigo-800/50 rounded-3xl border border-indigo-700/50 backdrop-blur-xl flex items-center justify-center">
              <Award className="h-32 w-32 text-indigo-300 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
