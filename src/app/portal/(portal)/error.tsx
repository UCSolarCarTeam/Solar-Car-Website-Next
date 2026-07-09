"use client";

import Link from "next/link";
import { useEffect } from "react";

import styles from "@/app/portal/index.module.scss";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: error boundaries should log for monitoring
    console.error(error);
  }, [error]);

  return (
    <div className={styles.unverifiedPage}>
      <div>Something went wrong loading the portal.</div>
      {error.digest && <div>Reference: {error.digest}</div>}
      <button onClick={reset} type="button">
        Try again
      </button>
      <Link href="/">Go back home</Link>
    </div>
  );
}
