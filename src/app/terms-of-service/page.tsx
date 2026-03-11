export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-1000">
            <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Terms of Service</h1>
            <div className="prose prose-indigo max-w-none text-gray-600 space-y-6 text-lg leading-relaxed">
                <p>
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <p>
                    Welcome to KIMT. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">1. Acceptance of Terms</h2>
                <p>
                    By using this site, you signify your acceptance of these Terms of Service. If you do not agree to these terms, please do not use our site.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">2. Use of Services</h2>
                <p>
                    You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use and enjoyment of the services.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">3. Intellectual Property</h2>
                <p>
                    All content on this website, including text, graphics, logos, and software, is the property of KIMT or its content suppliers and is protected by international copyright laws.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">4. Limitation of Liability</h2>
                <p>
                    KIMT shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">5. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these Terms of Service at any time. Your continued use of the site following the posting of changes will be deemed your acceptance of those changes.
                </p>
            </div>
        </div>
    );
}
