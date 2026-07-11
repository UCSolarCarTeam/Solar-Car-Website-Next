import { SponsorLevel } from "@prisma/client";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import backsplash from "public/assets/sponsors/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionReveal from "@/components/ui/SectionReveal";
import { imageSize } from "@/lib/image-sizes";
import type { RouterOutputs } from "@/trpc/react";
import { HydrateClient, trpc } from "@/trpc/server";
import { LeadSponsorCard, SponsorCard } from "./SponsorCards";

export const metadata: Metadata = {
  title: "Sponsors | Calgary Solar Car",
  description:
    "Meet the partners and sponsors who power the University of Calgary Solar Car Team.",
};

type Sponsor = RouterOutputs["fe"]["getSponsors"][0];

const SponsorLevelSection = ({
  title,
  description,
  sponsorLevel,
  sponsors,
  tierKey,
}: {
  title: string;
  description: string;
  sponsorLevel: SponsorLevel;
  sponsors: Sponsor[];
  tierKey: "gold" | "silver" | "bronze" | "friends";
}) => {
  const levelSponsors = sponsors.filter(
    (sponsor) => sponsor.sponsorLevel === sponsorLevel,
  );
  if (levelSponsors.length === 0) return null;

  return (
    <div className="mb-32">
      <SectionReveal>
        <div className="mb-16 flex flex-col gap-2 border-b border-sc-border pb-4">
          <h2 className="sc-heading m-0 text-4xl text-sc-white">{title}</h2>
          <p className="sc-mono m-0 text-base text-sc-grey-light">
            {"// "}
            {description}
          </p>
        </div>
      </SectionReveal>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] justify-items-center gap-8 sm:justify-items-stretch">
        {levelSponsors.map((sponsor, index) => (
          <SponsorCard
            href={sponsor.websiteUrl}
            index={index}
            key={sponsor.name}
            logoUrl={sponsor.logoUrl}
            name={sponsor.name}
            tier={tierKey}
          />
        ))}
      </div>
    </div>
  );
};

const Sponsors = async () => {
  const sponsors = await trpc.fe.getSponsors();

  return (
    <HydrateClient>
      <Navbar />
      <main className="min-h-screen bg-sc-bg text-sc-white">
        <section className="relative flex min-h-[500px] h-[60vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              alt="Sponsors Background"
              className="object-cover object-center brightness-[0.3] saturate-50"
              fill
              priority
              sizes={imageSize("pageHero")}
              src={backsplash}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sc-bg" />
          </div>

          <div className="relative z-10 px-5 text-center">
            <SectionReveal delay={0.2}>
              <div className="sc-label mb-4 text-sc-amber">OUR PARTNERS</div>
              <h1 className="sc-heading m-0 text-[clamp(3.5rem,8vw,6rem)] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                Fueling Innovation.
              </h1>
              <p className="mx-auto mt-6 max-w-[650px] text-xl leading-relaxed text-sc-grey-light">
                Our work is made possible by the generous support of our
                sponsors. They provide the resources we need to push the
                boundaries of renewable energy.
              </p>
            </SectionReveal>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-[1200px] px-5 py-16 pb-32">
          <div className="mb-40 text-center">
            <SectionReveal>
              <div className="sc-label mb-4 text-sc-red">TITLE SPONSOR</div>
              <p className="sc-mono mb-16 text-base text-sc-grey-light">
                {
                  "// A special thank you to our kind donor, the faculty and everything they've done for us!"
                }
              </p>
            </SectionReveal>
            <LeadSponsorCard />
          </div>

          <SponsorLevelSection
            description="Thank you for helping our team educate future generations on the necessity of renewable resources!"
            sponsorLevel={SponsorLevel.Gold}
            sponsors={sponsors ?? []}
            tierKey="gold"
            title="Gold Sponsors"
          />
          <SponsorLevelSection
            description="Thank you for giving us the ability to demonstrate that sustainable energy can be practical!"
            sponsorLevel={SponsorLevel.Silver}
            sponsors={sponsors ?? []}
            tierKey="silver"
            title="Silver Sponsors"
          />
          <SponsorLevelSection
            description="Thank you for giving us the ability to demonstrate that sustainable energy can be practical!"
            sponsorLevel={SponsorLevel.Bronze}
            sponsors={sponsors ?? []}
            tierKey="bronze"
            title="Bronze Sponsors"
          />
          <SponsorLevelSection
            description="Thank you for helping us continue to innovate!"
            sponsorLevel={SponsorLevel.Friends}
            sponsors={sponsors ?? []}
            tierKey="friends"
            title="Friends of Solar Car"
          />
        </section>

        <section className="relative w-full overflow-hidden border-t border-sc-border bg-sc-bg-surface px-5 py-32">
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(245,166,35,0.1)_0%,transparent_70%)]" />

          <div className="relative z-10 mx-auto max-w-[800px] text-center">
            <SectionReveal>
              <div className="sc-label mb-4 text-sc-amber">
                BECOME A SPONSOR
              </div>
              <h2 className="sc-heading mb-6 text-[clamp(2.5rem,5vw,4rem)] leading-tight">
                Partner With Us.
              </h2>
              <p className="mx-auto mb-12 max-w-[600px] text-xl leading-relaxed text-sc-grey-light">
                Join us in our mission to push the limits of sustainable
                technology. Your support enables our students to gain invaluable
                hands-on experience and innovate for a greener future.
              </p>

              <div className="flex justify-center">
                <Link className="no-underline" href="/support-us">
                  <MagneticButton className="border-none bg-sc-amber px-12 py-4 font-sans text-lg font-bold tracking-widest text-sc-bg uppercase">
                    View Sponsorship Package
                  </MagneticButton>
                </Link>
              </div>
            </SectionReveal>
          </div>
        </section>
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Sponsors;
