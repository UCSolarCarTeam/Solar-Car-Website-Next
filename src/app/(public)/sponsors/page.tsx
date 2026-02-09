import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import backsplash from "public/assets/sponsors/backsplash.jpeg";
import { memo } from "react";

import { type RouterOutputs } from "@/trpc/react";
import { trpcStatic } from "@/trpc/server";
import { SponsorLevel } from "@prisma/client";

import styles from "./index.module.scss";

export const metadata: Metadata = {
  description:
    "Meet the generous sponsors supporting the University of Calgary Solar Car Team. Our sponsors help us innovate, compete, and educate the community on renewable energy solutions.",
  title: "Our Sponsors | University of Calgary Solar Car Team",
};

type Sponsor = RouterOutputs["fe"]["getSponsors"][0];

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
          <div className={styles.sponsorContainer} key={sponsor.name}>
            <div className={styles.sponsor}>
              <Link href={sponsor.websiteUrl} prefetch={false} target="_blank">
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

const Sponsors = async () => {
  const sponsors = await trpcStatic.fe.getSponsors();

  return (
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
            sponsors={sponsors ?? []}
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
            sponsors={sponsors ?? []}
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
            sponsors={sponsors ?? []}
          />
        </div>
        <>
          <div className={styles.pageHeading}>Friends of Solar Car</div>
          <div className={styles.descriptionTitle}>
            {`Thank you for helping us continue to innovate!`}
          </div>
          <SponsorLevelImages
            sponsorLevel={SponsorLevel.Friends}
            sponsors={sponsors ?? []}
          />
        </>
        <div className={styles.seperator} />
      </div>
      <Image
        alt="backsplash"
        fill
        id="backsplashImage"
        loading="eager"
        placeholder="blur"
        priority
        src={backsplash}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};
export default memo(Sponsors);
