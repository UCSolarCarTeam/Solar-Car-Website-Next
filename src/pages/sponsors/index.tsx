import Head from "next/head";
import { memo } from "react";

import Footer from "@/components/Footer";
import SponsorsPage from "@/components/sponsorsPage";

const Sponsors = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Sponsors</title>
      </Head>
      <main>
        <SponsorsPage />
      </main>
      <Footer />
    </>
  );
};

export default memo(Sponsors);
