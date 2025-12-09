import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";

// Lazy load components below the fold for better initial load
const History = dynamic(() => import("@/components/History"), {
  loading: () => <div className="py-20" />,
});
const Program = dynamic(() => import("@/components/Program"), {
  loading: () => <div className="py-20" />,
});
const Showcase = dynamic(() => import("@/components/Showcase"), {
  loading: () => <div className="py-20" />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="py-20" />,
});

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
