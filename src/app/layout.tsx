import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nour Fitness — برنامج التمرين الأسبوعي",
  description: "PPL + كارديو + مرونة — برنامج تمرين متكامل",
  manifest: "/manifest.json",
  themeColor: "#09090b",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nour Fitness",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
