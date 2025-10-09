export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <title>Calgary Solar Car - What We&apos;re Working On</title>
      {children}
    </>
  );
}
