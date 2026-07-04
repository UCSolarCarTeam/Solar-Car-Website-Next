"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import PortalPageHeader from "@/app/_components/PortalComponents/Portal/PortalPageHeader";
import styles from "@/app/portal/index.module.scss";

export default function PortalShell({
  children,
  isAdmin,
  username,
}: {
  children: React.ReactNode;
  isAdmin: boolean;
  username: string;
}) {
  useEffect(() => {
    document.documentElement.style.backgroundColor = "white";
  }, []);

  return (
    <main style={{ height: "auto" }}>
      <PortalPageHeader isAdmin={isAdmin} username={username} />
      <div className={styles.portalContent}>{children}</div>
      <Toaster />
    </main>
  );
}
