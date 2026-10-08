import HeroSection from "@/components/landing/HeroSection";
import OfferSection from "@/components/landing/OfferSection";
import ValuePropositionSection from "@/components/landing/ValuePropositionSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col w-full">
        <HeroSection />
        <OfferSection />
        <ValuePropositionSection />
        <TestimonialSection />
      </main>
      <Footer />
    </>
  );
}
