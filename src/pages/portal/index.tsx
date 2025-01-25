import Head from "next/head";
import { memo } from "react";

import PortalPage from "@/pages/portal/PortalPage";

const Portal = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Portal</title>
      </Head>
      <main style={{ height: "auto" }}>
        <PortalPage />
      </main>
    </>
  );
};

export default memo(Portal);
