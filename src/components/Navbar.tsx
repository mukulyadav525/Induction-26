"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  isScrolledByDefault?: boolean;
  activeBtech?: boolean;
  activePg?: boolean;
  links?: Array<{ label: string; href: string }>;
  showThemeToggle?: boolean;
}

export default function Navbar({
  isScrolledByDefault = true,
  activeBtech = false,
  activePg = false,
  links,
  showThemeToggle = true,
}: NavbarProps) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

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

  function getSectionScrollY(targetSection: HTMLElement): number {
    const stickyWrapper = targetSection.closest(
      ".sticky-card-sticky-wrapper",
    ) as HTMLElement | null;

    if (!stickyWrapper || !stickyWrapper.parentElement) {
      let runningTop = 0;
      let currentElement: HTMLElement | null = targetSection;
      while (currentElement) {
        runningTop += currentElement.offsetTop;
        currentElement = currentElement.offsetParent as HTMLElement | null;
      }
      return runningTop;
    }

    const stackContainer = stickyWrapper.parentElement;
    const stackContainerTop =
      window.scrollY + stackContainer.getBoundingClientRect().top;

    let heightOfSectionsAbove = 0;
    for (const wrapper of Array.from(stackContainer.children)) {
      if (wrapper === stickyWrapper) break;
      heightOfSectionsAbove += (wrapper as HTMLElement).offsetHeight;
    }

    return stackContainerTop + heightOfSectionsAbove;
  }

  useEffect(() => {
    const nav = document.getElementById("site-nav");
    if (!nav || isScrolledByDefault) return;
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isScrolledByDefault]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("induction-theme");
    const resolvedTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : "light";

    setThemeMode(resolvedTheme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, []);

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

  function toggleThemeMode() {
    const nextTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("induction-theme", nextTheme);
  }

  function handleLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== "/") return;

    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <nav
      className={`site-nav${isScrolledByDefault ? " is-scrolled" : ""}`}
      id="site-nav"
    >
      <div className="nav-brand">
        <Link href="/" onClick={handleLogoClick} aria-label="Back to top">
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

                  const targetSection = document.getElementById(
                    link.href.slice(1),
                  );
                  if (!targetSection) return;

                  window.scrollTo({
                    top: getSectionScrollY(targetSection),
                    behavior: "smooth",
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
        {showThemeToggle && (
          <button
            className={`theme-toggle-btn${themeMode === "dark" ? " is-dark" : ""}`}
            onClick={toggleThemeMode}
            aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
            type="button"
          >
            {themeMode === "dark" ? "LIGHT" : "DARK"}
          </button>
        )}
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
