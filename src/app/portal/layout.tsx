import { ClerkProvider } from "@clerk/nextjs";

// export meta
export const metadata = {
  title: "Portal - Calgary Solar Car",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      dynamic
      signInForceRedirectUrl="/portal"
      signInUrl="/portal/sign-in"
      signUpForceRedirectUrl="/portal"
      signUpUrl="/portal/sign-up"
    >
      {children}
    </ClerkProvider>
  );
}
