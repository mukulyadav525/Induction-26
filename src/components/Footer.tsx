"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import FooterFaqIndex from "@/components/FooterFaqIndex";

interface FooterProps {
  stripItems?: string[];
  bottomLeft?: string;
  bottomRight?: string;
  showFaqAccordion?: boolean;
}

const FOOTER_PAGE_LINKS = [
  { text: "HOME", href: "/", matchPath: "/" },
  { text: "GALLERY", href: "/gallery", matchPath: "/gallery" },
  { text: "TEAM", href: "/team", matchPath: "/team" },
  { text: "CONTACT", href: "/contact", matchPath: "/contact" },
  { text: "FAQ", href: "/contact#faq", matchPath: "/contact" },
  {
    text: "B.TECH SCHEDULE",
    href: "/schedule-btech",
    matchPath: "/schedule-btech",
  },
  { text: "PG SCHEDULE", href: "/schedule-pg", matchPath: "/schedule-pg" },
];

export default function Footer({
  stripItems = [
    "INDUCTION 2026",
    "CLASS OF 2028",
    "IIIT DELHI",
    "A NEW FILE HAS BEEN OPENED",
  ],
  bottomLeft = "INDUCTION 2026 — IIIT DELHI",
  bottomRight,
  showFaqAccordion = false,
}: FooterProps) {
  const pathname = usePathname();
  const footerContentRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const footerLinks = FOOTER_PAGE_LINKS.filter(
    (link) =>
      link.matchPath !== pathname && !(showFaqAccordion && link.text === "FAQ"),
  );

  useLayoutEffect(() => {
    const contentEl = footerContentRef.current;
    if (!contentEl) return;

    const updateFooterHeight = () => setFooterHeight(contentEl.offsetHeight);
    updateFooterHeight();

    const resizeObserver = new ResizeObserver(updateFooterHeight);
    resizeObserver.observe(contentEl);
    return () => resizeObserver.disconnect();
  }, [pathname, showFaqAccordion]);

  return (
    <div className="footer-sticky-shell" style={{ height: footerHeight }}>
      <footer className="site-footer" ref={footerContentRef}>
        <div className="footer-top-strip">
          {stripItems.map((item, i) => (
            <span key={i}>
              {item}
              {i < stripItems.length - 1 && <span className="mq-sep">✦</span>}
            </span>
          ))}
        </div>
        <div className="footer-inner">
          <div className="footer-links-col">
            <div className="footer-brand">
              <div className="footer-name">
                INDRAPRASTHA INSTITUTE OF
                <br />
                INFORMATION TECHNOLOGY, DELHI
              </div>
            </div>
            <nav className="footer-nav">
              <div className="footer-col">
                <span className="footer-col-label">SUPPORT</span>
                {footerLinks.map((link) => (
                  <Link key={link.text} href={link.href}>
                    {link.text}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
          {showFaqAccordion && (
            <>
              <div className="footer-divider" />
              <FooterFaqIndex />
            </>
          )}
        </div>
        <div className="footer-bottom">
          <span>{bottomLeft}</span>
          {bottomRight && <span>{bottomRight}</span>}
          {!bottomRight && (
            <span>
              Developed & Designed with ❤️ by{" "}
              <a
                href="https://linkedin.com/in/mukulyadav525"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mukul Yadav
              </a>
              ,{" "}
              <a
                href="https://linkedin.com/in/vasumehta"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vasu Mehta
              </a>{" "}
              and{" "}
              <a
                href="https://linkedin.com/in/yuvrajj-singhh"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yuvraj Singh
              </a>
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
