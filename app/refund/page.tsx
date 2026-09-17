import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy - CompanyWisePrep",
  description: "Cancellation and Refund Policy for CompanyWisePrep",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-6">
      <div className="max-w-3xl w-full space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Cancellation & Refund Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
          <p>
            Thank you for choosing CompanyWisePrep. We strive to provide the best possible experience and resources for your interview preparation. 
            Please read this policy carefully before making any purchases on our platform.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Digital Products and Credits</h2>
            <p>
              CompanyWisePrep offers digital products and services, primarily in the form of "Credits" which can be redeemed for accessing premium interview preparation resources, AI analytics, and company-specific mock assessments.
            </p>
            <p>
              Due to the immediate access and digital nature of these resources, all purchases of Credits are considered final.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Non-Refundable Policy</h2>
            <p>
              Once a purchase is made and Credits are successfully added to your account, <strong>we do not offer refunds, cancellations, or exchanges.</strong>
            </p>
            <p>
              We highly recommend that you review the available packages and understand what features the Credits unlock before proceeding with a payment. 
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Exceptional Circumstances</h2>
            <p>
              We understand that technical issues can occasionally occur. Refunds or credit adjustments will only be considered under the following exceptional circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Duplicate Transactions:</strong> If you were charged multiple times for the same transaction due to a technical error on our platform or our payment gateway.</li>
              <li><strong>Failure to Deliver Credits:</strong> If your payment was successfully processed and deducted from your account, but the corresponding Credits were not credited to your CompanyWisePrep account within 24 hours.</li>
            </ul>
            <p>
              In such rare cases, please contact our support team immediately with your transaction details (Order ID, Payment ID, and email address used). 
              If a refund is approved for an exceptional circumstance, it will be processed back to your original method of payment within 5-7 business days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Account Termination</h2>
            <p>
              If your account is suspended or terminated due to a violation of our Terms of Service, any remaining unused Credits will be forfeited and no refunds will be issued.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Contact Us</h2>
            <p>
              If you have experienced a billing error or have any questions about this policy, please reach out to us at:
            </p>
            <p>
              <strong>Email:</strong> support@companywiseprep.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
