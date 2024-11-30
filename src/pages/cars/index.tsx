import Head from "next/head";
import { memo } from "react";

import Footer from "@/components/Footer";
import CarsPage from "@/components/carsPage";

const Cars = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Cars</title>
      </Head>
      <main>
        <CarsPage />
      </main>
      <Footer />
    </>
  );
};

export default memo(Cars);
