import Link from "next/link";

import { portal } from "@/lib/portal-classes";

export default function UnverifiedView() {
  return (
    <div className={portal.unverifiedPage}>
      <div>
        You are not verified. Please contact the Telemetry Team or your Team
        Lead.
      </div>
      <Link href="/">Go back home</Link>
    </div>
  );
}
