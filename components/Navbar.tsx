"use client";

import Link from "next/link";
import { Info, BarChart, User, Coins, Code, MessageSquare, LogOut, BrainCircuit } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide navbar on login page and active assessment pages
  const isAssessmentPage = /^\/company\/[^\/]+\/[^\/]+$/.test(pathname);
  if (pathname === "/login" || isAssessmentPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full h-14 border-b border-border bg-card flex items-center px-6 justify-between text-sm shrink-0">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg text-foreground flex items-center gap-2">
          <div className="flex items-center justify-center">
            <Image src="/favicon_io/android-chrome-192x192.png" alt="CompanyWisePrep Logo" width={28} height={28} className="rounded-sm" />
          </div>
          CompanyWisePrep
        </Link>
      </div>
      
      <div className="flex items-center gap-4 text-muted-foreground">
        <Link href="/analytics" className="hover:text-foreground transition-colors hidden md:flex items-center gap-1.5 font-medium text-sm">
          <BrainCircuit className="w-4 h-4" />
          AI Analysis
        </Link>

        <Link href="https://x.com/gouravsaha_" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer" title="Follow on X">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.007 4.076H5.035z"></path></svg>
        </Link>

        <Link href="/pricing" className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-muted text-foreground font-medium text-xs border border-border hover:bg-muted/80 transition-colors">
          <Coins className="w-3.5 h-3.5 text-warning" />
          {session ? (
            /* @ts-ignore */
            <span>{session.user?.credits ?? 2} Credits</span>
          ) : (
            <span>Pricing</span>
          )}
        </Link>

        {mounted && (
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className="bg-muted text-foreground border border-border rounded-sm px-2 py-1.5 text-xs focus:outline-none flex items-center gap-1 cursor-pointer"
          >
            <option value="dark">Dark</option>
            <option value="white">White</option>
            <option value="cobalt">Cobalt</option>
            <option value="green">Green</option>
            <option value="neon">Neon</option>
            <option value="gray">Gray</option>
          </select>
        )}
        
        {status === "loading" ? (
          <div className="w-20 h-8 bg-muted animate-pulse rounded-sm"></div>
        ) : session ? (
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded-sm transition-colors">
              {session.user?.image ? (
                <Image src={session.user.image} alt="User" width={28} height={28} className="rounded-sm border border-border" />
              ) : (
                <div className="w-7 h-7 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs border border-border">
                  {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                </div>
              )}
            </Link>
            <button onClick={() => signOut()} className="flex items-center gap-1.5 text-muted-foreground hover:text-danger transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn()}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 px-3 py-1.5 rounded-sm transition-colors border border-border bg-primary text-primary-foreground font-medium hover:opacity-90"
          >
            <User className="w-4 h-4" />
            <span className="text-xs hidden md:block">Sign in</span>
          </button>
        )}
      </div>
    </nav>
  );
}
