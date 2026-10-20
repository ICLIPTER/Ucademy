import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { appUrl } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const base = appUrl.replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: "Ucademy — Learn the skills the industry hires for",
    template: "%s · Ucademy",
  },
  description:
    "Practical, structured online courses with progress tracking, verified certificates and instructors who do the work.",
  applicationName: "Ucademy",
  keywords: [
    "online courses",
    "learning management system",
    "LMS",
    "professional skills",
    "certificates",
    "self-paced learning",
  ],
  authors: [{ name: "Ucademy" }],
  creator: "Ucademy",
  publisher: "Ucademy",
  category: "education",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: base,
    siteName: "Ucademy",
    title: "Ucademy — Learn the skills the industry hires for",
    description:
      "Practical, structured online courses with progress tracking, verified certificates and instructors who do the work.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ucademy — Learn the skills the industry hires for",
    description:
      "Practical, structured online courses with progress tracking and verified certificates.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton position="bottom-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
