"use client";

import { usePathname } from "next/navigation";

export default function PageBackgroundWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages where the main content area should be transparent to show the animated background
  const isTransparent = pathname === "/login";

  return (
    <div className={`flex-1 flex flex-col relative z-0 ${isTransparent ? "bg-transparent" : "bg-black"}`}>
      {children}
    </div>
  );
}
