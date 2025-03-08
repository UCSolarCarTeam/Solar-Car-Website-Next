export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <title>Calgary Solar Car - Support Us</title>
      {children}
    </>
  );
}
