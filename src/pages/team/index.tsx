import Head from "next/head";
import { type GetServerSideProps } from "next/types";
import { memo } from "react";

import Footer from "@/components/Footer";
import TeamPage from "@/pages/team/TeamPage";
import { type RouterOutputs, type SsrTrpcHelper } from "@/utils/api";
import { SsrHelpers } from "@/utils/api";

type TeamMember = RouterOutputs["portal"]["getTeamMembers"][number];

export type TeamPageProps = {
  teamMembers: TeamMember[];
} & SsrTrpcHelper;

export const getServerSideProps: GetServerSideProps<
  TeamPageProps
> = async () => {
  const teamMembers = await SsrHelpers.portal.getTeamMembers.fetch();

  return {
    props: {
      teamMembers,
      trpcState: SsrHelpers.dehydrate(),
    },
  };
};

const Team = (props: TeamPageProps) => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Cars</title>
      </Head>
      <main style={{ height: "auto" }}>
        <TeamPage {...props} />
      </main>
      <Footer />
    </>
  );
};

export default memo(Team);
