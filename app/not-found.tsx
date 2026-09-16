"use client";

import Link from "next/link";
import { FileQuestion, ArrowLeft, Home, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [isGoingBack, setIsGoingBack] = useState(false);

  const handleGoBack = () => {
    setIsGoingBack(true);
    router.back();
    setTimeout(() => setIsGoingBack(false), 500);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background page-fade-in p-6 font-sans">
      <div className="max-w-md w-full bg-card border border-border/50 rounded-sm p-10 text-center shadow-xl">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-border/50 relative overflow-hidden">
          <FileQuestion className="w-10 h-10 text-muted-foreground/50 relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent"></div>
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">404</h2>
        <h3 className="text-xl font-semibold text-foreground/80 mb-3">Page Not Found</h3>
        
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
          We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoBack}
            disabled={isGoingBack}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 group"
          >
            {isGoingBack ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            )}
            {isGoingBack ? "Going back..." : "Go Back"}
          </button>
          
          <Link
            href="/"
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-secondary-foreground font-medium rounded-sm hover:bg-secondary/80 border border-border/50 transition-all duration-300 ${isGoingBack && "pointer-events-none opacity-50"}`}
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
