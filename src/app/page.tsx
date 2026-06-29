"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveBar from "@/components/LiveBar";
import ScrollRevealInit from "@/components/ScrollReveal";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import TalksSection from "@/components/TalksSection";
import CampusSection from "@/components/CampusSection";
import InfoSection from "@/components/InfoSection";
import MentorSection from "@/components/MentorsSection";
import FaqSection from "@/components/FaqSection";
import ContactCtaSection from "@/components/ContactCtaSection";
import ConvenorsSection from "@/components/ConvenorsSection";

export default function HomePage() {
  return (
    <>
      <Navbar activeBtech={true} />
      <HeroSection />
      <LiveBar />
      <AboutSection />
      <GallerySection />
      <TalksSection />
      <CampusSection />
      <InfoSection />
      <MentorSection />
      <FaqSection />
      <ContactCtaSection />
      <ConvenorsSection />
      <Footer
        stripItems={[
          "INDUCTION 2026",
          "CLASS OF 2028",
          "IIIT DELHI",
          "A NEW FILE HAS BEEN OPENED",
        ]}
        navColumns={[
          {
            label: "SECTIONS",
            links: [
              { text: "ABOUT", href: "/#about" },
              { text: "SCHEDULE", href: "/#schedule" },
              { text: "BUDDY", href: "/#interaction-buddies" },
              { text: "GALLERY", href: "/#gallery" },
            ],
          },
          {
            label: "MORE",
            links: [
              { text: "SPEAKERS", href: "/#talks" },
              { text: "DIRECTIONS", href: "/#campus" },
              { text: "INFO", href: "/#info" },
            ],
          },
          {
            label: "SUPPORT",
            links: [
              { text: "FAQ", href: "/#faq" },
              { text: "CONTACT ↗", href: "/contact" },
              { text: "B.TECH SCHEDULE", href: "/schedule-btech" },
              { text: "PG SCHEDULE", href: "/schedule-pg" },
            ],
          },
        ]}
      />
      <ScrollRevealInit />
    </>
  );
}
