import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

import "@/styles/globals.css";
import "@/styles/globals.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { TRPCReactProvider } from "@/trpc/react";

const spaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const jbMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jb-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  description:
    "University of Calgary Solar Car Team — engineering solar-powered vehicles that push the limits of renewable energy and motorsport.",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
  title: {
    default: "Calgary Solar Car",
    template: "%s | Calgary Solar Car",
  },
  openGraph: {
    siteName: "Calgary Solar Car",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${spaceGrotesk.variable} ${jbMono.variable}`} lang="en">
      <body className="bg-[#0A0A0B]">
        <SmoothScrollProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SmoothScrollProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
