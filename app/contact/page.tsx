import Link from "next/link";
import { ArrowLeft, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us - CompanyWisePrep",
  description: "Get in touch with the CompanyWisePrep team",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-6">
      <div className="max-w-3xl w-full space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground">
            We are here to help! Whether you have a question about our services, need technical support, or want to explore partnership opportunities, feel free to reach out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-card border border-border rounded-sm p-6 space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">Email Support</h2>
            <p className="text-sm text-muted-foreground">
              Our support team is available Monday to Friday. We aim to respond to all inquiries within 24 hours.
            </p>
            <a href="mailto:support@companywiseprep.online" className="inline-block mt-2 font-medium text-primary hover:underline">
              support@companywiseprep.online
            </a>
          </div>

          <div className="bg-card border border-border rounded-sm p-6 space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">Registered Address</h2>
            <p className="text-sm text-muted-foreground">
              CompanyWisePrep<br />
              [Your Business Address Line 1]<br />
              [City, State, Zip Code]<br />
              [Country]
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Note: This address is for legal and official correspondence only. For customer support, please use our email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
