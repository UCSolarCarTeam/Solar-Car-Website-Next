import { type GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import backsplash from "public/assets/sponsors/backsplash.jpeg";
import { memo, useCallback, useState } from "react";

import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import styles from "@/pages/sponsors/index.module.scss";
import {
  type RouterOutputs,
  SsrHelpers,
  type SsrTrpcHelper,
} from "@/utils/api";
import { SponsorLevel } from "@prisma/client";

type Sponsor = RouterOutputs["fe"]["getSponsors"][0];

export type SponsorPageProps = {
  sponsors: Sponsor[];
} & SsrTrpcHelper;

const SponsorLevelImages = ({
  sponsorLevel,
  sponsors,
}: {
  sponsorLevel: SponsorLevel;
  sponsors: Sponsor[];
}) => {
  return (
    <>
      {sponsors
        .filter((sponsor) => sponsor.sponsorLevel === sponsorLevel)
        .map((sponsor) => (
          <div className={styles.sponsorContainer} key={sponsorLevel}>
            <div className={styles.sponsor} key={sponsor.name}>
              <Link href={sponsor.websiteUrl} prefetch={false}>
                <Image
                  alt={sponsor.name}
                  fill
                  src={sponsor.logoUrl}
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </div>
          </div>
        ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  SponsorPageProps
> = async () => {
  const sponsors = await SsrHelpers.fe.getSponsors.fetch();

  return {
    props: {
      sponsors: sponsors ?? [],
      trpcState: SsrHelpers.dehydrate(),
    },
  };
};

const Sponsors = (props: SponsorPageProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Calgary Solar Car - Sponsors</title>
      </Head>
      {isImageLoading && <Loader isImageLoading={isImageLoading} />}
      <main>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.pageHeading}>Lead Sponsor</div>
          <div className={styles.descriptionTitle}>
            {`A special thank you to our kind donor, the faculty and everything
          they've done for us!`}
          </div>
          <div className={styles.leadSponsorLogo}>
            <Image
              alt="lead sponsor"
              height={180}
              loading="eager"
              priority
              src="/assets/sponsors/logo-schulich.svg"
              width={1000}
            />
          </div>
          <div className={styles.otherSponsors}>
            <div>
              <div className={styles.pageHeading}>Gold Sponsor</div>
              <div className={styles.descriptionTitle}>
                {`Thank you for helping our team educate future generations on the
          necessity of renewable resources!`}
              </div>
              <SponsorLevelImages
                sponsorLevel={SponsorLevel.Gold}
                sponsors={props.sponsors}
              />
            </div>
            <div>
              <div className={styles.pageHeading}>Silver Sponsor</div>
              <div className={styles.descriptionTitle}>
                {`Thank you for giving us the ability to demonstrate that sustainable
          energy can be practical!`}
              </div>
              <SponsorLevelImages
                sponsorLevel={SponsorLevel.Silver}
                sponsors={props.sponsors}
              />
            </div>
            <div>
              <div className={styles.pageHeading}>Bronze Sponsor</div>
              <div className={styles.descriptionTitle}>
                {`Thank you for giving us the ability to demonstrate that sustainable
          energy can be practical!`}
              </div>
              <SponsorLevelImages
                sponsorLevel={SponsorLevel.Bronze}
                sponsors={props.sponsors}
              />
            </div>
            <>
              <div className={styles.pageHeading}>Friends of Solar Car</div>
              <div className={styles.descriptionTitle}>
                {`Thank you for helping us continue to innovate!`}
              </div>
              <SponsorLevelImages
                sponsorLevel={SponsorLevel.Friends}
                sponsors={props.sponsors}
              />
            </>
            <div className={styles.seperator} />
          </div>
          <Image
            alt="backsplash"
            fill
            id="backsplashImage"
            loading="eager"
            onLoadingComplete={handleImageLoad}
            placeholder="blur"
            priority
            src={backsplash}
            style={{ objectFit: "cover" }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(Sponsors);
