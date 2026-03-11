export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-1000">
            <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
            <div className="prose prose-indigo max-w-none text-gray-600 space-y-6 text-lg leading-relaxed">
                <p>
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <p>
                    At KIMT (Kartike Institute Of Management and Technology), we value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website and services.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">1. Information Collection</h2>
                <p>
                    We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support. This may include your name, email address, phone number, and educational background.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">2. Use of Information</h2>
                <p>
                    We use the information we collect to provide and improve our services, communicate with you about your account and courses, and ensure the security of our platform.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">3. Data Security</h2>
                <p>
                    We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or alteration.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">4. Third-Party Services</h2>
                <p>
                    We do not sell your personal information to third parties. We may share data with service providers who assist us in operating our website or conducting our business, provided they agree to keep this information confidential.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-10">5. Your Rights</h2>
                <p>
                    You have the right to access, correct, or delete your personal information. If you have any questions or concerns about your privacy, please contact us at ravikartikcomputers@gmail.com.
                </p>
            </div>
        </div>
    );
}
