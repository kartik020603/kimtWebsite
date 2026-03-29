import { Phone, Mail, MapPin, Send } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function Contact() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-1000">
            {/* Hero Image Section */}
            <div className="relative h-[300px] rounded-3xl overflow-hidden mb-16 shadow-2xl border border-gray-100">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/contact_hero.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-12 flex-col justify-end">
                    <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-2xl mb-2">
                        Get In Touch
                    </h1>
                    <p className="text-blue-100 font-medium">
                        We&apos;re here to help you navigate your educational journey.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                <AnimatedSection direction="right">
                    <div className="space-y-10">
                        <div className="flex items-start gap-6">
                            <div className="bg-blue-100 p-4 rounded-2xl flex-shrink-0">
                                <Phone className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Phone</h3>
                                <p className="text-blue-600 font-semibold mb-1">+91 8126100208</p>
                                <p className="text-gray-500">Mon-Sat, 9am - 6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="bg-blue-100 p-4 rounded-2xl flex-shrink-0">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Email</h3>
                                <a href="mailto:ravikartikcomputers@gmail.com" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors mb-1 block">
                                    ravikartikcomputers@gmail.com
                                </a>
                                <p className="text-gray-500">Online support 24/7</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="bg-blue-100 p-4 rounded-2xl flex-shrink-0">
                                <MapPin className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Location</h3>
                                <p className="text-gray-700 font-medium mb-2">Kartike House, 8b/13a/kk Krishna Puram Colony, Mau Road Khandari, Agra 282005</p>
                                <a
                                    href="https://maps.app.goo.gl/z7fNHm5iH2yn8AfS6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm"
                                >
                                    <MapPin className="h-4 w-4" />
                                    View on Google Maps →
                                </a>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection direction="left" delay={0.2} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Subject</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="How can we help?" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Message</label>
                            <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Your message here..." />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group">
                            Send Message
                            <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </AnimatedSection>
            </div>

            {/* Google Maps Embed */}
            <AnimatedSection direction="up" delay={0.4} className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-80 w-full">
                <iframe
                    src="https://www.google.com/maps?q=kartike+house+8b+13a+kk+krishna+puram+colony+mau+road+khandari+agra+282005&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                     title="KIMT Location on Google Maps"
                />
            </AnimatedSection>
        </div>
    );
}

