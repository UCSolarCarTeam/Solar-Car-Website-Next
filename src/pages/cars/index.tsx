import Head from "next/head";
import { memo } from "react";

import CarsPage from "@/components/carsPage";

const Cars = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Cars</title>
      </Head>
      <main style={{ height: "auto" }}>
        <CarsPage />
      </main>
    </>
  );
};

export default memo(Cars);
