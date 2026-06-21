import { memo } from "react";

import styles from "@/app/our-work/index.module.scss";

interface TelemetryLinksProps {
  grafanaUrl: string;
  telemetrySiteUrl: string;
}

const TelemetryLinks = ({
  grafanaUrl,
  telemetrySiteUrl,
}: TelemetryLinksProps) => {
  return (
    <section
      className={`${styles.telemetrySection} ${styles.telemetryFeaturedSection}`}
    >
      <div className={styles.telemetryContent}>
        <div className={styles.telemetryIntro}>
          <span className={styles.telemetryLiveBadge}>Live</span>
          <h2 className={styles.telemetryHeading}>Follow Our Race Data</h2>
        </div>
        <p className={styles.telemetryDescription}>
          View real-time telemetry insights and full dashboards from our latest
          systems.
        </p>
      </div>

      <div className={styles.telemetryActions}>
        <a
          className={styles.telemetryPrimaryButton}
          href={telemetrySiteUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open Telemetry Site
        </a>
        {/* add this when we have the Grafana link */}
        {/* <a
          className={styles.telemetrySecondaryButton}
          href={grafanaUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open Grafana
        </a> */}
      </div>
    </section>
  );
};

export default memo(TelemetryLinks);
