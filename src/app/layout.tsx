import { type Metadata } from "next";
import { Saira } from "next/font/google";

import "@/styles/globals.scss";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

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
    <>
      <ClerkProvider
        dynamic
        signInForceRedirectUrl="/portal"
        signInUrl="/portal/sign-in"
        signUpForceRedirectUrl="/portal"
        signUpUrl="/portal/sign-up"
      >
        <html className={`${saira.className}`} lang="en">
          <body>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
