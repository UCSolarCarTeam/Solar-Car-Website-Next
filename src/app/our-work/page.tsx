import Image from "next/image";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import { getOurWork } from "./actions";

export const metadata = {
  title: "Our Work | Calgary Solar Car",
  description: "A timeline of our journey and engineering milestones.",
};

const OurWorkTimelinePage = async () => {
  const timelineData = await getOurWork();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-sc-bg text-sc-white">
        <section className="relative flex min-h-[300px] h-[40vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[length:50px_50px] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
          <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,transparent_0%,var(--sc-bg)_70%)]" />

          <div className="relative z-10 px-5 text-center">
            <div className="sc-label mb-4 text-sc-red">TIMELINE</div>
            <h1 className="sc-heading m-0 text-[clamp(3rem,6vw,5rem)]">
              What We&apos;re Working On.
            </h1>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-[1000px] px-5 py-16 pb-32">
          {!timelineData || timelineData.length === 0 ? (
            <div className="sc-mono text-center text-sc-grey-dim">
              {"// NO DATA AVAILABLE"}
            </div>
          ) : (
            <div className="flex flex-col gap-24">
              {timelineData.map((yearData) => (
                <div key={yearData.year}>
                  <div className="mb-12 flex items-center gap-8">
                    <h2 className="sc-heading m-0 text-6xl leading-none text-sc-amber">
                      {yearData.year}
                    </h2>
                    <div className="h-px flex-1 bg-sc-border" />
                  </div>

                  <div className="flex flex-col gap-12">
                    {yearData.months.map((month) => (
                      <div
                        className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-12 rounded border border-sc-border bg-[rgba(18,18,20,0.5)] p-8 backdrop-blur-md"
                        key={`${yearData.year}-${month.month}`}
                      >
                        {month.image && (
                          <div className="relative aspect-video w-full overflow-hidden rounded">
                            <Image
                              alt={month.month}
                              className="object-cover"
                              fill
                              src={month.image}
                            />
                          </div>
                        )}

                        <div>
                          <div className="sc-mono mb-2 text-sm text-sc-red">
                            {"// UPDATE"}
                          </div>
                          <h3 className="sc-heading mb-4 text-3xl text-sc-white">
                            {month.month}
                          </h3>
                          {month.description && (
                            <p className="m-0 leading-relaxed text-sc-grey-light">
                              {month.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default OurWorkTimelinePage;
