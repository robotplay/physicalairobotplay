import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Teachers from "@/components/Teachers";
import SuccessStories from "@/components/SuccessStories";
import OnlineCourses from "@/components/OnlineCourses";
import SocialHub from "@/components/SocialHub";

export default function Home() {
  return (
    <main>
      <Hero />
      <Philosophy />
      <Teachers />
      <SuccessStories />
      <OnlineCourses />
      <SocialHub />
    </main>
  );
}