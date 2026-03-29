"use client";

import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';

export default function FloatingContact() {
  const pathname = usePathname();

  // Do not show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const phoneNumber = "+918410617268";
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <a 
        href={`https://wa.me/918410617268`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition animate-bounce flex items-center justify-center min-w-[3rem] min-h-[3rem]"
        style={{ animationDelay: '0.2s', animationDuration: '2s' }}
        aria-label="Chat on WhatsApp"
      >
        <svg 
            viewBox="0 0 24 24" 
            width="28" 
            height="28" 
            stroke="currentColor" 
            strokeWidth="0" 
            fill="currentColor" 
            className="w-7 h-7"
        >
          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.069-.301-.15-1.259-.465-2.403-1.485-.888-.788-1.484-1.761-1.658-2.059-.173-.301-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.098-.203.049-.376-.026-.525-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.301-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485 2.378 1.023 3.336 1.066 3.963.987.697-.087 2.152-.876 2.457-1.722.302-.843.302-1.564.212-1.716-.091-.15-.349-.24-.653-.39M12.002 22A9.957 9.957 0 012.872 17.65L1 23l5.474-1.815a9.96 9.96 0 115.528 1.63z" />
        </svg>
      </a>

      {/* Phone Button */}
      <a 
        href={`tel:${phoneNumber}`}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition animate-bounce flex items-center justify-center min-w-[3rem] min-h-[3rem]"
        style={{ animationDuration: '2s' }}
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
