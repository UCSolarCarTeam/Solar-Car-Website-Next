"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import PortalPageHeader from "@/app/_components/PortalComponents/Portal/PortalPageHeader";

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
    <main className="min-h-dvh bg-slate-50 text-[#1f2937]">
      <PortalPageHeader isAdmin={isAdmin} username={username} />
      <div className="grid w-full max-w-dvw grid-cols-1 gap-y-6 overflow-x-visible bg-slate-50 p-6 text-[#1f2937] *:min-w-0 [@media(max-width:1024px)]:p-5 [@media(max-width:768px)]:gap-y-5 [@media(max-width:768px)]:p-4 [@media(max-width:320px)]:[&&]:p-3">
        {children}
      </div>
      <Toaster />
    </main>
  );
}
