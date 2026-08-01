"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollReveal";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ScheduleSection from "@/components/ScheduleSection";
import GallerySection from "@/components/GallerySection";
import TalksSection from "@/components/TalksSection";
import CampusSection from "@/components/CampusSection";
import InfoSection from "@/components/InfoSection";
import ContactCtaSection from "@/components/ContactCtaSection";
import ConvenorsSection from "@/components/ConvenorsSection";
import BackToTop from "@/components/BackToTop";
import StackCardPin from "@/components/StackCardPin";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const stackedCards = [
  AboutSection,
  ScheduleSection,
  GallerySection,
  TalksSection,
  CampusSection,
  InfoSection,
  ConvenorsSection,
  ContactCtaSection,
];

const activeCardRootMargin = "-45% 0px -45% 0px";

export default function HomePage() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardBoxByIndex, setCardBoxByIndex] = useState<
    Record<number, { top: number; left: number; width: number }>
  >({});

  useEffect(() => {
    function measureCardBoxes() {
      const measuredBoxes: Record<
        number,
        { top: number; left: number; width: number }
      > = {};

      cardItemRefs.current.forEach((cardElement, cardIndex) => {
        if (!cardElement) return;
        const cardContentElement = cardElement.querySelector(
          ".landing-card-container",
        );
        if (!cardContentElement) return;

        const parentRect = cardElement.getBoundingClientRect();
        const contentRect = cardContentElement.getBoundingClientRect();

        measuredBoxes[cardIndex] = {
          top: contentRect.top - parentRect.top,
          left: contentRect.left - parentRect.left,
          width: contentRect.width,
        };
      });

      setCardBoxByIndex(measuredBoxes);
    }

    measureCardBoxes();
    window.addEventListener("resize", measureCardBoxes);
    return () => window.removeEventListener("resize", measureCardBoxes);
  }, []);

  const handleCardIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const cardIndexAttr = entry.target.getAttribute("data-card-index");
        if (cardIndexAttr === null) return;
        setActiveCardIndex(Number(cardIndexAttr));
      });
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleCardIntersection, {
      rootMargin: activeCardRootMargin,
      threshold: 0,
    });

    cardItemRefs.current.forEach((cardElement) => {
      if (cardElement) observer.observe(cardElement);
    });

    return () => observer.disconnect();
  }, [handleCardIntersection]);

  const cardRefSetters = useMemo(
    () =>
      stackedCards.map((_, cardIndex) => (element: HTMLDivElement | null) => {
        cardItemRefs.current[cardIndex] = element;
      }),
    [],
  );

  const stackedCardEntries = useMemo(
    () =>
      stackedCards.map((StackedCard, cardIndex) => ({
        StackedCard,
        cardIndex,
        entryKey: StackedCard.name,
      })),
    [],
  );

  return (
    <>
      <Navbar activeBtech={true} />
      <HeroSection />
      <div className="shared-canvas">
        <div className="shared-canvas-bg" />
        <div className="sticky-card-stack">
          {stackedCardEntries.map(({ StackedCard, cardIndex, entryKey }) => (
            <div key={entryKey} className="sticky-card-sticky-wrapper">
              <div
                ref={cardRefSetters[cardIndex]}
                data-card-index={cardIndex}
                className="sticky-card-item"
              >
                <StackCardPin
                  isActive={activeCardIndex === cardIndex}
                  cardIndex={cardIndex}
                  cardBox={cardBoxByIndex[cardIndex]}
                />
                <StackedCard />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer
        stripItems={[
          "INDUCTION 2026",
          "CLASS OF 2030",
          "IIIT DELHI",
          "A NEW FILE HAS BEEN OPENED",
        ]}
        showFaqAccordion
      />
      <ScrollRevealInit />
      <BackToTop />
    </>
  );
}
