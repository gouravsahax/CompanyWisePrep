import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Unlock premium mock OAs, AI code analytics, and exclusive company prep sheets.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
