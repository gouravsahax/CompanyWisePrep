import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for CompanyWisePrep.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: September 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 font-light text-muted-foreground leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p>
              At CompanyWisePrep, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your data when you use our interview preparation platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <p>
              We collect minimal information necessary to provide you with a seamless and personalized experience:
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><strong>Account Information:</strong> When you sign in via Google OAuth, we collect your name, email address, and profile picture.</li>
                <li><strong>Platform Usage Data:</strong> We store records of your unlocked assessments, remaining credits, and your selected default programming language.</li>
                <li><strong>Assessment Data:</strong> We may store your code submissions, test case results, and execution metrics to track your progress and provide analytics.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p>
              The information we collect is used strictly for the operation and improvement of our platform:
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>To authenticate your identity and maintain your account session securely.</li>
                <li>To track your credit balance and grant you access to purchased assessments.</li>
                <li>To evaluate your code submissions against test cases and provide you with feedback.</li>
                <li>To send important account-related notifications (we do not send marketing spam).</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Sharing and Third Parties</h2>
            <p>
              We do <strong>not</strong> sell, rent, or trade your personal information to third parties. We only share data with trusted service providers necessary to operate the platform (e.g., secure database hosting, payment processing, or secure code execution environments). All third parties are bound by strict confidentiality and data protection agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Cookies and Local Storage</h2>
            <p>
              We use secure session cookies via NextAuth to keep you logged in. We may also use browser local storage to save non-sensitive UI preferences (like your dark/light theme selection). We do not use intrusive third-party tracking cookies for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or alteration. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time. If you wish to permanently delete your account and all associated data (including code submissions and remaining credits), please contact us. Note that deleted data cannot be recovered.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us at privacy@companywiseprep.com.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
