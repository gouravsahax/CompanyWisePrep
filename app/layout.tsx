import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CompanyWisePrep - Company-Wise OA Prep Platform",
  description: "AI-powered company- and role-specific Online Assessment preparation",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
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
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster position="top-center" />
            <FirebaseAnalytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
