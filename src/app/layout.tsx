import { type Metadata } from "next";
import { Saira } from "next/font/google";

import "@/styles/globals.scss";
import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "@vercel/analytics/next";

const saira = Saira({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description: "The University of Calgary Solar Car Team",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
  title: "Calgary Solar Car",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${saira.className}`} lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
