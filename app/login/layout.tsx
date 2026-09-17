import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to CompanyWisePrep to access premium mock online assessments and analytics.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
