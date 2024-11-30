import { type GetServerSideProps } from "next";
import { memo } from "react";

import TeamTable from "@/pages/portal/TeamTable";
import UsersTable from "@/pages/portal/UsersTable";
import styles from "@/pages/portal/index.module.scss";
import { supabase } from "@/utils/api";
import { SignIn, SignedIn, useUser } from "@clerk/nextjs";

import PortalPageHeader from "./PortalPageHeader";

interface PortalProps {
  files: string[] | undefined;
}

export const getServerSideProps: GetServerSideProps<PortalProps> = async () => {
  const { data } = await supabase.storage.from("exampleBucket").list();
  const signedUrls = data?.map((file) => {
    const { data } = supabase.storage
      .from("exampleBucket")
      .getPublicUrl(file.name);
    return data.publicUrl;
  });
  return { props: { files: signedUrls } };
};

const Portal = (props: PortalProps) => {
  const { isSignedIn } = useUser();

  return (
    <>
      {!isSignedIn ? (
        <div className={styles.signInLayout}>
          <SignIn forceRedirectUrl="/portal" />
        </div>
      ) : (
        <SignedIn>
          <PortalPageHeader />
          <div className={styles.portalContent}>
            <UsersTable />
            <TeamTable />
          </div>
        </SignedIn>
      )}
    </>
  );
};

export default memo(Portal);
