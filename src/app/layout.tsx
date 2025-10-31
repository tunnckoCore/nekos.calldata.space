// import { Databuddy } from "@databuddy/sdk/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "0xNeko Gallery",
  description:
    "Browse and explore 380 0xNeko NFTs, Ordinals, and Ethscriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/*<Databuddy
          clientId={process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID!}
          trackAttributes={true}
          trackInteractions={true}
          trackEngagement={true}
          trackScrollDepth={true}
          trackBounceRate={true}
          trackWebVitals={true}
          trackErrors={true}
          enableBatching={true}
        />*/}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
