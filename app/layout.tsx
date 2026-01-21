import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PAM Techno - Client Progress Tracker",
    template: "%s | PAM Techno",
  },
  description:
    "Pantau progres proyek digital Anda secara real-time bersama PAM Techno. Transparansi dan kemudahan dalam satu platform.",
  keywords: [
    "PAM Techno",
    "Jasa Pembuatan Website",
    "Software House Padang",
    "Client Tracker",
    "Web Development",
    "Mobile App Development",
  ],
  authors: [{ name: "PAM Techno Team" }],
  creator: "PAM Techno",
  publisher: "PAM Techno",
  metadataBase: new URL("https://pamtechno.com"), // Ganti dengan domain asli nanti
  openGraph: {
    title: "PAM Techno - Client Progress Tracker",
    description:
      "Pantau progres proyek digital Anda secara real-time bersama PAM Techno.",
    type: "website",
    locale: "id_ID",
    siteName: "PAM Techno Progress Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "PAM Techno - Client Progress Tracker",
    description:
      "Pantau progres proyek digital Anda secara real-time bersama PAM Techno.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
