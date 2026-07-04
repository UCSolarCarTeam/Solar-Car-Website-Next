import Link from "next/link";

import styles from "@/app/portal/index.module.scss";

export default function UnverifiedView() {
  return (
    <div className={styles.unverifiedPage}>
      <div>
        You are not verified. Please contact the Telemetry Team or your Team
        Lead.
      </div>
      <Link href="/">Go back home</Link>
    </div>
  );
}
