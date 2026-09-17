import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for using CompanyWisePrep.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: September 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 font-light text-muted-foreground leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using CompanyWisePrep (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. CompanyWisePrep provides a software engineering interview preparation platform, offering coding assessments and related educational resources.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Account Registration</h2>
            <p>
              To access certain features, including unlocking assessments, you must create an account via supported third-party providers (e.g., Google OAuth). You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Credits and Purchases</h2>
            <p>
              Our platform operates on a credit-based system. Credits are used to unlock specific company assessments (OAs) and resources. 
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Credits are strictly non-transferable and hold no real-world monetary value.</li>
                <li>All sales of credits are final and non-refundable, except where required by law.</li>
                <li>We reserve the right to modify the pricing of credits or the credit cost of assessments at any time without prior notice.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
            <p>
              You agree not to use the platform in any way that violates applicable laws, exploits or harms others, or disrupts the integrity of our services. You may not scrape, reverse-engineer, or attempt to extract the underlying source code, test cases, or proprietary assessment data provided by CompanyWisePrep. Sharing unlocked premium assessments publicly or re-selling them is strictly prohibited and will result in immediate account termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
            <p>
              All content on the platform, including but not limited to coding challenges, UI designs, and educational materials, are the intellectual property of CompanyWisePrep. The names of third-party companies (e.g., &quot;Amazon&quot;, &quot;Google&quot;) are used purely for descriptive, educational categorization and are the trademarks of their respective owners. CompanyWisePrep is not affiliated with, endorsed by, or sponsored by these companies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Disclaimer of Warranties</h2>
            <p>
              CompanyWisePrep is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While we strive to provide accurate and highly relevant interview preparation material, we do not guarantee that using our service will result in a job offer or successful interview outcome. We disclaim all warranties, express or implied, including fitness for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, CompanyWisePrep shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service, including but not limited to loss of data, loss of career opportunities, or financial losses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by updating the date at the top of this page. Continued use of the platform after changes constitutes your acceptance of the revised Terms.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
