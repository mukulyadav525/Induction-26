"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
    "CLASS OF 2030",
    "IIIT DELHI",
    "A NEW FILE HAS BEEN OPENED",
  ],
  bottomLeft = "INDUCTION 2026 — IIIT DELHI",
  bottomRight,
  showFaqAccordion = false,
}: FooterProps) {
  const pathname = usePathname();

  const footerLinks = FOOTER_PAGE_LINKS.filter(
    (link) =>
      link.matchPath !== pathname && !(showFaqAccordion && link.text === "FAQ"),
  );

  return (
    <div className="footer-wrap">
      <div className="footer-torn-edge">
        <Image
          src="/assets/footer/footer_bg.webp"
          alt=""
          loading="eager"
          fill
          className="footer-torn-edge-img"
        />
      </div>
      <Image
        src="/assets/stack-deco/washi-tape.svg"
        alt=""
        width={110}
        height={38}
        className="footer-tape footer-tape--left"
      />
      <Image
        src="/assets/stack-deco/washi-tape.svg"
        alt=""
        width={110}
        height={38}
        className="footer-tape footer-tape--right"
      />
      <footer className="site-footer">
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

            {/* SPONSORS SECTION */}
            <div className="footer-sponsors" style={{ marginTop: "28px" }}>
              <span
                className="footer-col-label"
                style={{ display: "block", marginBottom: "12px", opacity: 0.6 }}
              >
                SPONSORS
              </span>
              <div
                className="footer-sponsors-list"
                style={{
                  display: "flex",
                  gap: "32px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* SBI Sponsor */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <Image
                    src="/assets/sponsors/sbi.jpg"
                    alt="State Bank of India"
                    width={100}
                    height={60}
                    style={{
                      objectFit: "contain",
                      height: "auto",
                      width: "auto",
                      maxHeight: "50px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.05em",
                      color: "#d1d5db",
                    }}
                  >
                    STATE BANK OF INDIA
                  </span>
                </div>

                {/* Monster Sponsor */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <Image
                    src="/assets/sponsors/monster.webp"
                    alt="Monster Energy"
                    width={120}
                    height={60}
                    style={{
                      objectFit: "contain",
                      height: "auto",
                      width: "auto",
                      maxHeight: "50px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.05em",
                      color: "#d1d5db",
                    }}
                  >
                    MONSTER ENERGY
                  </span>
                </div>
              </div>
            </div>
          </div>
          {showFaqAccordion && (
            <>
              <div className="footer-stitch-divider" />
              <div className="footer-faq-cluster">
                <Image
                  src="/assets/stack-deco/coffee-ring.svg"
                  alt=""
                  width={140}
                  height={140}
                  className="footer-coffee-stain"
                />
                <FooterFaqIndex />
              </div>
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
                href="https://linkedin.com/in/paramveer504"
                target="_blank"
                rel="noopener noreferrer"
              >
                Paramveer Oberoi
              </a>
            </span>
          )}
        </div>
        <Image
          src="/assets/stack-deco/stamp-induction.svg"
          alt=""
          width={275}
          height={100}
          className="footer-stamp"
        />
      </footer>
    </div>
  );
}
