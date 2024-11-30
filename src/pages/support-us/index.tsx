import Head from "next/head";
import { memo } from "react";

import SupportUsPage from "@/components/supportUsPage";

const SupportUs = () => {
  return (
    <>
      <Head>
        <title>Support Us</title>
      </Head>
      <main>
        <SupportUsPage />
      </main>
    </>
  );
};

export default memo(SupportUs);
