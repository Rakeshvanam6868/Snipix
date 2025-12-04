import { Button } from "@/components/LandingPage/Button";
import Link from "next/link";
import { SignUpButton } from "@/components/SignUpButton/SignUpButton";
import Hero from "@/components/LandingPage/Hero";
import UpcomingFeature from "@/components/LandingPage/UpcomingFeatures";
import Features from "@/components/LandingPage/Features";
import Footer from "@/components/LandingPage/Footer";
import Working from "@/components/LandingPage/Bug";
import Bug from "@/components/LandingPage/Bug";
import GoToTop from "@/components/LandingPage/scrollToTop";
import SnipixOffers from "@/components/LandingPage/SnipixOffers";

export default function Component() {
  
  return (
    <div className="flex flex-col min-h-[100dvh] text-gray-50">
      <main className="flex-1">
        <Hero />

        <section className="w-full py-12 px-20 md:py-24 lg:py-24 bg-[#0b0b0e] text-gray-50">
          <Features />
        </section>
        <section className="w-full py-12 md:py-20 lg:pt-32 pb-24 bg-[#030303] px-32">
          <SnipixOffers />
        </section>

        {/* <Working /> */}

        {/* <UpcomingFeature />
        <Bug /> */}
      </main>
      <Footer />
    </div>
  );
}

