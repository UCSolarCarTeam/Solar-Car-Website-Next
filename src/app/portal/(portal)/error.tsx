"use client";

import Link from "next/link";

import styles from "@/app/portal/index.module.scss";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.unverifiedPage}>
      <div>Something went wrong loading the portal.</div>
      {error.message && <div>{error.message}</div>}
      <button onClick={reset} type="button">
        Try again
      </button>
      <Link href="/">Go back home</Link>
    </div>
  );
}
