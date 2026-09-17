"use client";

import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Roboto } from "next/font/google";

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/" });
  };
  
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-8 bg-black overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(20px, -20px) scale(1.1); }
            66% { transform: translate(-10px, 10px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 8s infinite alternate ease-in-out;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
        
        {/* Glows */}
        <div className="absolute -top-[20%] -left-[15%] w-[40vw] h-[150%] max-w-[500px] rotate-12">
          <div className="w-full h-full bg-teal-500/80 blur-[130px] animate-blob mix-blend-screen" />
        </div>
        <div className="absolute -top-[20%] -right-[15%] w-[40vw] h-[150%] max-w-[500px] -rotate-12">
          <div className="w-full h-full bg-yellow-500/80 blur-[130px] animate-blob animation-delay-2000 mix-blend-screen" />
        </div>

        {/* Perforated Ring Overlay */}
        <div 
          className="absolute inset-0 bg-black pointer-events-none"
          style={{
            maskImage: `radial-gradient(circle at center, black 2px, transparent 2.5px, transparent 4px, black 4.5px)`,
            maskSize: '12px 12px',
            WebkitMaskImage: `radial-gradient(circle at center, black 2px, transparent 2.5px, transparent 4px, black 4.5px)`,
            WebkitMaskSize: '12px 12px',
          }}
        />
      </div>

      {/* Form Content (Floating) */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center text-white">
        
        {/* Animated Logos Section */}
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity z-10 relative">
            <Image 
              src="/favicon_io/android-chrome-192x192.png" 
              alt="CompanyWisePrep Logo" 
              width={48} 
              height={48} 
              className="rounded-sm shadow-md"
            />
          </Link>

          {/* Walking Stick Figures Animation */}
          <div className="w-24 h-12 relative overflow-hidden z-0">
            <style>{`
              @keyframes walkRight {
                0% { transform: translateX(-20px); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateX(100px); opacity: 0; }
              }
              @keyframes bob {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
              }
              .stick-wrapper {
                position: absolute;
                bottom: 4px;
                left: 0;
              }
              .animate-walk-1 { animation: walkRight 3s linear infinite; }
              .animate-walk-2 { animation: walkRight 3s linear infinite 1s; }
              .animate-walk-3 { animation: walkRight 3s linear infinite 2s; }
              
              .animate-bob-1 { animation: bob 0.5s ease-in-out infinite; }
              .animate-bob-2 { animation: bob 0.5s ease-in-out infinite 0.25s; }
              .animate-bob-3 { animation: bob 0.5s ease-in-out infinite 0.5s; }
            `}</style>
            
            {/* Stick Figure 1 */}
            <div className="stick-wrapper animate-walk-1">
              <svg viewBox="0 0 20 30" className="w-4 h-6 text-white animate-bob-1 drop-shadow-md">
                <circle cx="10" cy="5" r="3" fill="currentColor" />
                <line x1="10" y1="8" x2="10" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M 6,14 L 10,10 L 14,14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 5,26 L 10,18 L 15,26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Stick Figure 2 (Yellow) */}
            <div className="stick-wrapper animate-walk-2">
              <svg viewBox="0 0 20 30" className="w-4 h-6 text-yellow-400 animate-bob-2 drop-shadow-md">
                <circle cx="10" cy="5" r="3" fill="currentColor" />
                <line x1="10" y1="8" x2="10" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M 6,14 L 10,10 L 14,14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 5,26 L 10,18 L 15,26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Stick Figure 3 (Sky Blue) */}
            <div className="stick-wrapper animate-walk-3">
              <svg viewBox="0 0 20 30" className="w-4 h-6 text-sky-400 animate-bob-3 drop-shadow-md">
                <circle cx="10" cy="5" r="3" fill="currentColor" />
                <line x1="10" y1="8" x2="10" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M 6,14 L 10,10 L 14,14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 5,26 L 10,18 L 15,26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="shrink-0 z-10 relative">
            <Image 
              src="/building.png" 
              alt="Company Building" 
              width={26} 
              height={26} 
              className="rounded-sm object-cover mb-5"
            />
          </div>
        </div>
        
        {/* Headers */}
        <div className={`space-y-2 mb-8 ${roboto.className}`}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">Welcome Back to Ccp</h1>
          <p className="text-gray-400 text-sm sm:text-base font-normal">
            Log in and Prepare for your Next OA.
          </p>
        </div>

        {/* Login Actions */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="group w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 transition-colors duration-200 text-sm font-medium text-black rounded-sm border border-transparent disabled:opacity-70 disabled:cursor-not-allowed shadow-xl mb-8"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-black" />
          ) : (
            <div className="flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            </div>
          )}
          {isLoading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Footer Text */}
        <div className="text-center text-xs text-gray-500">
          By signing in, you agree to our <Link href="/terms" className="underline underline-offset-2 decoration-gray-700 hover:text-white transition-colors">Terms</Link> and <Link href="/privacy" className="underline underline-offset-2 decoration-gray-700 hover:text-white transition-colors">Privacy Policy</Link>.
        </div>

      </div>
      
    </div>
  );
}
