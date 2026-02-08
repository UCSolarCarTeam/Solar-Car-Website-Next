import { type Metadata } from "next";
import { Suspense } from "react";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  description: "The University of Calgary Solar Car Team - Portal",
  title: "Calgary Solar Car - Portal",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Skeleton />}>
      <ClerkProvider
        dynamic
        signInForceRedirectUrl="/portal"
        signInUrl="/portal/sign-in"
        signUpForceRedirectUrl="/portal"
        signUpUrl="/portal/sign-up"
      >
        {children}
      </ClerkProvider>
    </Suspense>
  );
}
function Skeleton() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      Loading...
    </div>
  );
}
