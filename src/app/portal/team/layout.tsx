import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import logo from "public/assets/logo-center-black.png";
import { Suspense } from "react";

import styles from "@/app/_components/PortalComponents/Portal/index.module.scss";
import { UserButton } from "@clerk/nextjs";

import NavMenu from "../NavMenu";
import UserProfile from "../UserProfile";

export const metadata: Metadata = {
  title: "Team | Portal | Solar Car",
  description: "Team page for the Solar Car Portal",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-white">
      <header className={styles.portalPageHeaderLayout}>
        <div className={styles.portalPageHeader}>
          <Link href="/">
            <Image alt="navlogo" height={48} src={logo} width={48} />
          </Link>
          <NavMenu />
        </div>
        <div className={styles.profilePicture}>
          <Suspense>
            <UserProfile />
          </Suspense>
          <UserButton />
        </div>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
