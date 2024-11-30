import Head from "next/head";
import { memo } from "react";

import TeamPage from "@/components/teamPage";

const Team = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Cars</title>
      </Head>
      <main>
        <TeamPage />
      </main>
    </>
  );
};

export default memo(Team);
