import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import RecruitmentForms from "@/app/_components/Recruitment/RecruitmentForms";
import { recruitmentOpen } from "@/flags";
import { HydrateClient } from "@/trpc/server";

export const metadata = {
  title: "Recruitment | Calgary Solar Car",
  description:
    "Join the University of Calgary Solar Car Team and help build the future of sustainable transportation.",
};

const Recruitment = async () => {
  const isRecruitmentClosed = !(await recruitmentOpen());

  return (
    <HydrateClient>
      <Navbar />
      <main className="min-h-screen bg-sc-bg text-sc-white">
        <section className="relative flex min-h-[400px] h-[60vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              alt="Solar Car Background"
              className="object-cover object-center brightness-[0.4] saturate-[0.8]"
              fill
              priority
              src={backsplash}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sc-bg" />
          </div>

          <div className="relative z-10 px-5 text-center">
            <div className="sc-label mb-4 text-sc-amber">JOIN THE TEAM</div>
            <h1 className="sc-heading m-0 text-[clamp(3rem,6vw,5rem)]">
              Build the Future.
            </h1>
            <p className="sc-mono mt-6 text-lg text-sc-grey-light">
              {isRecruitmentClosed
                ? "RECRUITMENT_STATUS: CLOSED"
                : "RECRUITMENT_STATUS: ACCEPTING_APPLICATIONS"}
            </p>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-[1000px] px-5 py-16 pb-32">
          <div className="rounded border border-sc-border bg-[rgba(18,18,20,0.6)] p-12 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {!isRecruitmentClosed && (
              <div className="mb-12 border-l-2 border-l-sc-red bg-sc-red/10 p-4">
                <span className="sc-mono text-sm text-sc-amber">
                  {"// SYSTEM ALERT"}
                </span>
                <p className="mt-2 mb-0 text-sc-white">
                  Applications close on September 13th. Select a sub-team below
                  to begin your application.
                </p>
              </div>
            )}

            <RecruitmentForms isRecruitmentClosed={isRecruitmentClosed} />
          </div>
        </section>
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Recruitment;
