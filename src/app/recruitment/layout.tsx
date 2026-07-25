import type { Metadata } from "next";
import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";

export const metadata: Metadata = {
  title: "Recruitment | Calgary Solar Car",
  description:
    "Join the University of Calgary Solar Car Team and help build the future of sustainable transportation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
