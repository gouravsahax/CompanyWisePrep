import "./globals.css";
import { Inter, Roboto } from "next/font/google";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import PageBackgroundWrapper from "@/components/PageBackgroundWrapper";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://companywiseprep.online'),
  title: {
    default: "CompanyWisePrep - Company-Wise OA Prep Platform",
    template: "%s | CompanyWisePrep",
  },
  description: "AI-powered company- and role-specific Online Assessment preparation. Ace your next software engineering interview.",
  keywords: ["Software Engineering", "Online Assessment", "Interview Prep", "Coding Interview", "CompanyWisePrep"],
  authors: [{ name: "CompanyWisePrep Team" }],
  creator: "CompanyWisePrep",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://companywiseprep.online",
    title: "CompanyWisePrep - Company-Wise OA Prep Platform",
    description: "AI-powered company- and role-specific Online Assessment preparation.",
    siteName: "CompanyWisePrep",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CompanyWisePrep Preview",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CompanyWisePrep - Company-Wise OA Prep Platform",
    description: "AI-powered company- and role-specific Online Assessment preparation.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon_io/favicon.ico',
    apple: '/favicon_io/apple-touch-icon.png',
  },
  manifest: '/favicon_io/site.webmanifest',
};

import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "react-hot-toast";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";

import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <body className={`${roboto.className} bg-black text-foreground min-h-screen flex flex-col`}>
        <AnimatedBackground />
        <NextTopLoader
          color="hsl(var(--primary))"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
        />
        <AuthProvider>
          <Navbar />
          <PageBackgroundWrapper>
            {children}
          </PageBackgroundWrapper>
          <Footer />
          <Toaster position="top-center" />
          <FirebaseAnalytics />
        </AuthProvider>
      </body>
    </html>
  );
}
