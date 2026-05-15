import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedBiz } from "@/components/home/FeaturedBiz";
import { StatsStrip } from "@/components/home/StatsStrip";
import { RevistaSection } from "@/components/home/RevistaSection";
import { CTASection } from "@/components/home/CTASection";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // Cache for 1 hour

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <FeaturedBiz />
      <StatsStrip />
      <RevistaSection />
      <CTASection />
      <Footer />
    </main>
  );
}
