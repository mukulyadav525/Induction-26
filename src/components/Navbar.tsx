"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  isScrolledByDefault?: boolean;
  activeBtech?: boolean;
  activePg?: boolean;
  links?: Array<{ label: string; href: string }>;
}

export default function Navbar({
  isScrolledByDefault = false,
  activeBtech = false,
  activePg = false,
  links,
}: NavbarProps) {
  const defaultLinks = [
    { label: "ABOUT", href: "#about" },
    { label: "SCHEDULE", href: "#schedule" },
    { label: "GALLERY", href: "#gallery" },
    { label: "SPEAKERS", href: "#talks" },
    { label: "INFO", href: "#info" },
    { label: "TEAM", href: "#team" },
    { label: "CONTACT", href: "#contact" },
  ];

  const navLinks = links ?? defaultLinks;

  useEffect(() => {
    const nav = document.getElementById("site-nav");
    if (!nav || isScrolledByDefault) return;
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isScrolledByDefault]);

  function toggleMenu() {
    const links = document.getElementById("nav-links");
    const hb = document.getElementById("hamburger");
    if (links) links.classList.toggle("is-open");
    if (hb) hb.classList.toggle("is-open");
  }

  function closeMenu() {
    const links = document.getElementById("nav-links");
    const hb = document.getElementById("hamburger");
    if (links) links.classList.remove("is-open");
    if (hb) hb.classList.remove("is-open");
  }

  function openSchedulePage(track: string) {
    window.location.href =
      track === "BTECH" ? "/schedule-btech" : "/schedule-pg";
  }

  return (
    <nav
      className={`site-nav${isScrolledByDefault ? " is-scrolled" : ""}`}
      id="site-nav"
    >
      <div className="nav-brand">
        <Link href={"/"}>
          <Image
            src="/iiitd-logo.webp"
            alt="IIIT Delhi Logo"
            className="nav-logo"
            width={220}
            height={50}
          />
        </Link>
        {isScrolledByDefault && (
          <div className="nav-brand-text">
            <span className="brand-short">IIIT DELHI</span>
            <span className="brand-full">
              INDRAPRASTHA INSTITUTE OF INFORMATION TECHNOLOGY, DELHI
            </span>
          </div>
        )}
      </div>

      <ul className="nav-links" id="nav-links">
        {navLinks.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              onClick={(e) => {
                closeMenu();
              
                if (link.href.startsWith("#")) {
                  e.preventDefault();
                
                  document
                    .getElementById(link.href.slice(1))
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <div className="track-toggle">
          <button
            className={`track-btn${activeBtech ? " active" : ""}`}
            id="nav-btn-btech"
            onClick={() => openSchedulePage("BTECH")}
          >
            B.TECH
          </button>
          <button
            className={`track-btn${activePg ? " active" : ""}`}
            id="nav-btn-pg"
            onClick={() => openSchedulePage("PG")}
          >
            PG TRACK
          </button>
        </div>
        <button
          className="hamburger"
          id="hamburger"
          onClick={toggleMenu}
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
