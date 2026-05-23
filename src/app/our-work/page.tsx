import { memo } from "react";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import Timeline from "@/app/_components/OurWork/Timeline";
import Pagebullets from "@/app/_components/Pagebullets";
import styles from "@/app/our-work/index.module.scss";
import { env } from "@/env";
import { trpc } from "@/trpc/react";

import TelemetryLinks from "../_components/OurWork/TelemetryLinks";
import { useIntersectionObserver } from "../_hooks/useIntersectionObserver";

const TELEMETRY_SITE_URL = env.NEXT_PUBLIC_TELEMETRY_SITE_URL;
const GRAFANA_URL = env.NEXT_PUBLIC_GRAFANA_URL;

const OurWorkTimelinePage = () => {
  const { data: timelineData, isFetching } = trpc.fe.getOurWork.useQuery();
  const [currentElement, setCurrentElement] = useState<string>(
    timelineData?.[0]?.year ?? "2025",
  );

  useIntersectionObserver(timelineData, setCurrentElement, (item) => item.year);

  useEffect(() => {
    if (timelineData && timelineData.length > 0 && timelineData[0]) {
      setCurrentElement(timelineData[0].year);
    }
  }, [timelineData]);

const OurWorkTimelinePage = async () => {
  const timelineData = await trpc.fe.getOurWork();

  return (
    <>
      <main className={styles.main}>
        <Navbar />
        {timelineData && timelineData.length > 0 && (
          <Pagebullets
            defaultCurrentId={timelineData[0]?.year ?? "2025"}
            pageIds={timelineData.map((data) => data.year)}
          />
        )}
        <div className={styles.container}>
          <div>
            <h1 className={styles.timelineHeading}>
              What We&apos;re Working On...
            </h1>
            <TelemetryLinks
              grafanaUrl={GRAFANA_URL}
              telemetrySiteUrl={TELEMETRY_SITE_URL}
            />
            <Timeline data={timelineData ?? []} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(OurWorkTimelinePage);
