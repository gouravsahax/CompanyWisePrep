"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RotateCcw, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleReset = async () => {
    setIsResetting(true);
    // Add an artificial small delay for smoother UI feedback
    await new Promise(r => setTimeout(r, 400));
    reset();
    setIsResetting(false);
  };

  const handleGoBack = () => {
    setIsGoingBack(true);
    router.back();
    // Reset state after a short delay in case back navigation fails or is instantaneous
    setTimeout(() => setIsGoingBack(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background page-fade-in p-6 font-sans">
      <div className="max-w-md w-full bg-card border border-border/50 rounded-sm p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-destructive stroke-[1.5]" />
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">Something went wrong!</h2>
        
        <p className="text-sm text-muted-foreground mb-8">
          We encountered an unexpected error while trying to process your request. 
          Our team has been notified.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleReset}
            disabled={isResetting || isGoingBack}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
          >
            {isResetting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            {isResetting ? "Trying again..." : "Try again"}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              disabled={isResetting || isGoingBack}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-secondary-foreground font-medium rounded-sm hover:bg-secondary/80 border border-border/50 hover:border-border transition-all duration-300 disabled:opacity-50"
            >
              {isGoingBack ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                "Go Back"
              )}
            </button>
            <Link
              href="/"
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-muted text-foreground font-medium rounded-sm hover:bg-muted/80 transition-all duration-300 ${(isResetting || isGoingBack) && "pointer-events-none opacity-50"}`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
