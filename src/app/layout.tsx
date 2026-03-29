import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import FloatingContact from "@/components/FloatingContact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kimtagra.online"),
  title: {
    default: "KIMT - Kartike Institute Of Management and Technology",
    template: "%s | KIMT Agra",
  },
  description: "Empowering students through technology and education at KIMT. The best computer institute in Agra for Tally, Web Development, and AI courses.",
  keywords: ["KIMT", "Kartike Institute of Management and Technology", "Computer Institute in Agra", "Best Computer Course in Agra", "Tally Training Agra", "Web Development Agra", "AI Education Agra"],
  authors: [{ name: "KIMT Team" }],
  creator: "KIMT Agra",
  publisher: "KIMT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "KIMT - Kartike Institute Of Management and Technology",
    description: "Empowering students through technology and education at KIMT. The best computer institute in Agra.",
    url: "https://kimtagra.online",
    siteName: "KIMT Agra",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KIMT - Kartike Institute Of Management and Technology",
    description: "The premier computer institute in Agra for professional tech training.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white`}
      >
        <Providers>
          <Navbar />
          <main className="pt-20 min-h-screen">
            {children}
          </main>
          <Footer />
          <FloatingContact />
        </Providers>
      </body>
    </html>
  );
}
