"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import PortalPageHeader from "@/app/_components/PortalComponents/Portal/PortalPageHeader";
import { portal } from "@/lib/portal-classes";

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
    const previousBackgroundColor =
      document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = "white";

    return () => {
      document.documentElement.style.backgroundColor = previousBackgroundColor;
    };
  }, []);

  return (
    <main className="h-auto">
      <PortalPageHeader isAdmin={isAdmin} username={username} />
      <div className={portal.content}>{children}</div>
      <Toaster />
    </main>
  );
}
