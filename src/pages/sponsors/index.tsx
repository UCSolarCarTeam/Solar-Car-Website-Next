import Head from "next/head";
import Image from "next/image";
import backsplash from "public/assets/sponsors/backsplash.jpeg";
import { memo } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import styles from "@/pages/sponsors/index.module.scss";
import { type Sponsor } from "@prisma/client";

const Sponsors = () => {
  const hardcodedSponsors = [
    {
      id: 0,
      logoUrl:
        "https://iskksotubtjejqlblkyf.supabase.co/storage/v1/object/public/solarcar_sponsorship_pictures//43aeac43aeac10d3475631af1a1fb0eca09c2c_T5Logo.jpeg",
      name: "Trolley 5",
      websiteUrl: "https://trolley5.com/",
    },
    {
      id: 1,
      logoUrl:
        "https://iskksotubtjejqlblkyf.supabase.co/storage/v1/object/public/solarcar_sponsorship_pictures//Bronze_Ansys.png",
      name: "Ansys",
      websiteUrl: "https://www.ansys.com/",
    },
    {
      id: 2,
      logoUrl:
        "https://iskksotubtjejqlblkyf.supabase.co/storage/v1/object/public/solarcar_sponsorship_pictures//Gold_Altium.png",
      name: "Altium",
      websiteUrl: "https://www.altium.com/",
    },
    {
      id: 3,
      logoUrl:
        "https://iskksotubtjejqlblkyf.supabase.co/storage/v1/object/public/solarcar_sponsorship_pictures//Kaizen.png",
      name: "Kaizen",
      websiteUrl: "https://kaizen.com/",
    },
    {
      id: 4,
      logoUrl:
        "https://iskksotubtjejqlblkyf.supabase.co/storage/v1/object/public/solarcar_sponsorship_pictures//RM_LOGO_CLR.jpg",
      name: "Rocky Mountain Motorsports",
      websiteUrl: "https://rockymotorsports.com/",
    },
    {
      id: 5,
      logoUrl:
        "https://iskksotubtjejqlblkyf.supabase.co/storage/v1/object/public/solarcar_sponsorship_pictures//Silver%20Tektelic%20logo.png",
      name: "Tektelic",
      websiteUrl: "https://tektelic.com/",
    },
  ] as Sponsor[];

  return (
    <>
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
            <div className={styles.pageHeading}>Gold Sponsor</div>
            <div className={styles.descriptionTitle}>
              {`Thank you for helping our team educate future generations on the
          necessity of renewable resources!`}
            </div>
            <div className={styles.pageHeading}>Silver Sponsor</div>
            <div className={styles.descriptionTitle}>
              {`Thank you for giving us the ability to demonstrate that sustainable
          energy can be practical!`}
            </div>
            <div className={styles.pageHeading}>Bronze Sponsor</div>
            <div className={styles.descriptionTitle}>
              {`Thank you for giving us the ability to demonstrate that sustainable
          energy can be practical!`}
            </div>
            <div className={styles.pageHeading}>Friends of Solar Car</div>
            <div className={styles.descriptionTitle}>
              {`Thank you for helping us continue to innovate!`}
            </div>
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
    </>
  );
};

export default memo(Sponsors);
