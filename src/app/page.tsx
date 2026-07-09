import CarShowcase from "@/app/_components/CarShowcase";
import Footer from "@/app/_components/Footer";
import HeroSection from "@/app/_components/HeroSection";
import JoinCTA from "@/app/_components/JoinCTA";
import Mission from "@/app/_components/Mission";
import Navbar from "@/app/_components/Navbar";
import StatsBar from "@/app/_components/StatsBar";

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <Mission />
        <CarShowcase />
        <JoinCTA />
      </main>
      <Footer />
    </>
  );
};

export default Home;
