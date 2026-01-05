// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Instrument_Sans, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

// --- Google Fonts ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "600",
});

// --- Roobert Variable Fonts ---
// Paths are now relative to this file (layout.tsx)
const roobert = localFont({
  src: [
    {
      path: './fonts/roobert/RoobertUprightsVF.woff2',
      style: 'normal',
    },
    {
      path: './fonts/roobert/RoobertItalicsVF.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-roobert',
  weight: '100 900', // Variable fonts handle the full range
  display: 'swap',
});

const roobertMono = localFont({
  src: [
    {
      path: './fonts/roobert/RoobertMonoUprightsVF.woff2',
      style: 'normal',
    },
    {
      path: './fonts/roobert/RoobertMonoItalicsVF.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-roobert-mono',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Finances Expert Pro",
  description: "The Smart Way to Manage Your Personal Finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${roobert.variable} 
          ${roobertMono.variable} 
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${instrumentSans.variable} 
          ${lora.variable} 
          antialiased
        `}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}