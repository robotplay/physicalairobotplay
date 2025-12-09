
import Hero from "@/components/Hero";
import History from "@/components/History";
import Program from "@/components/Program";
import Showcase from "@/components/Showcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <Hero />
      <History />
      <Program />
      <Showcase />
      <Footer />
    </main>
  );
}
