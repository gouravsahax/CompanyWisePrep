"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on specific pages like login and active assessments
  const isAssessmentPage = /^\/company\/[^\/]+\/[^\/]+$/.test(pathname);
  if (pathname === "/login" || pathname === "/onboarding" || isAssessmentPage) {
    return null;
  }
  
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md mt-auto py-8 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-lg">CompanyWisePrep</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            AI-powered, company-specific Online Assessment preparation. 
            We provide realistic coding tests and UI challenges to help candidates 
            crack interviews at top tech companies.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Services</h3>
          <ul className="space-y-2 text-muted-foreground text-xs">
            <li><Link href="/" className="hover:text-primary transition-colors">Mock Assessments</Link></li>
            <li><Link href="/pricing" className="hover:text-primary transition-colors">Premium Credits</Link></li>
            <li><Link href="/analytics" className="hover:text-primary transition-colors">Performance Analytics</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Legal</h3>
          <ul className="space-y-2 text-muted-foreground text-xs">
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/refund" className="hover:text-primary transition-colors">Cancellation & Refund Policy</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Support</h3>
          <ul className="space-y-2 text-muted-foreground text-xs">
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><a href="mailto:support@companywiseprep.online" className="hover:text-primary transition-colors">Email Support</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} CompanyWisePrep. All rights reserved.</p>
        <p>Gourav Saha | Kolkata, India</p>
      </div>
    </footer>
  );
}
