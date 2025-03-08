"use server";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import backsplash from "public/assets/sponsors/backsplash.jpeg";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/sponsors/index.module.scss";
import { type RouterOutputs } from "@/trpc/react";
import { HydrateClient, trpc } from "@/trpc/server";
import { SponsorLevel } from "@prisma/client";

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

const Sponsors = async () => {
  const sponsors = await trpc.fe.getSponsors();

  return (
    <HydrateClient>
      <Head>
        <title>Calgary Solar Car - Sponsors</title>
      </Head>
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
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Sponsors;
