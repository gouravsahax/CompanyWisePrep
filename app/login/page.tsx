"use client";

import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
    <div className="flex min-h-screen bg-background">
      
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted items-center justify-center border-r border-border/50">
        <Image 
          src="/signin.jpg" 
          alt="Sign In Illustration" 
          fill 
          className="object-cover object-top" 
          priority
        />
        {/* Optional overlay gradient for polish */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 xl:p-24 bg-background">
        
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Logo & Header */}
          <div className="space-y-4">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <div className="inline-flex">
                <Image 
                  src="/favicon_io/android-chrome-192x192.png" 
                  alt="CompanyWisePrep Logo" 
                  width={48} 
                  height={48} 
                  className="rounded-sm"
                />
              </div>
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Sign in to your account to continue preparing for your next big interview.
              </p>
            </div>
          </div>

          {/* Login Actions */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-3 px-4 py-3 bg-secondary hover:bg-secondary/80 transition-all duration-200 text-sm font-medium text-secondary-foreground rounded-sm border border-border/50 hover:border-border disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="bg-white p-1 rounded-sm group-hover:scale-110 transition-transform duration-200 shadow-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
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
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-xs text-muted-foreground">
            By signing in, you agree to our <Link href="/terms" className="underline decoration-muted-foreground/30 hover:decoration-primary hover:text-primary transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline decoration-muted-foreground/30 hover:decoration-primary hover:text-primary transition-colors">Privacy Policy</Link>.
          </div>

        </div>
      </div>

    </div>
  );
}
