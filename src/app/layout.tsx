import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ToastProvider from "@/components/ToastProvider";
import CrispChat from "@/components/CrispChat";
import FeedbackWidget from "@/components/FeedbackWidget";
import Branding from "@/components/Branding";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireRight AI — Autonomous AI Video Interviews & MediaPipe Proctoring",
  description: "Screen, interview, and evaluate candidates 10x faster with autonomous AI voice & video interviews, real-time MediaPipe anti-cheating proctoring, and automated skill scoring.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HireRight AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light overflow-x-hidden`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.setItem('stitch-theme', 'light');
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground overflow-x-hidden w-full max-w-full" suppressHydrationWarning>
        <Providers>
          <ToastProvider />
          <CrispChat />
          <Branding />
          {children}
          <FeedbackWidget />
        </Providers>
      </body>
    </html>
  );
}
