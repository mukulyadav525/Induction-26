"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollReveal";
import OcParallaxGrid from "@/components/OcParallaxGrid";
import { ocSubsections, saOfficeMembers, allOcMembers } from "@/lib/teamData";
import { useEffect } from "react";

const teamNavLinks = [
  { label: "HOME", href: "/" },
  { label: "SA OFFICE", href: "#team-sa" },
  { label: "ORGANIZING COMMITTEE", href: "#team-oc" },
];

const FALLBACK_PHOTO = "/photos/mentors/mentor-01.webp";

export default function TeamPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  return (
    <>
      <Navbar isScrolledByDefault={true} links={teamNavLinks} activeBtech={true}/>

      <section
        className="sec-talks sched-page-body team-page-body"
        id="team-sa"
      >
        <div className="container">
          <div className="reveal">
            <span className="sec-tag">FILE: Student Affairs</span>
            <h2 className="sec-heading">
              <span className="team-adjective">Sovereign</span>
              SA OFFICE
            </h2>
            <p className="talks-sub">
              The institutional backbone of every student-led initiative at IIIT
              Delhi. Steadfast, capable, essential.
            </p>
          </div>

          <div className="sa-grid">
            {saOfficeMembers.map((official) => (
              <div key={official.name} className="sa-card">
                <div
                  className="sa-card-photo"
                  style={{
                    backgroundImage: `url('${official.photo ?? FALLBACK_PHOTO}')`,
                  }}
                />
                <div className="sa-card-info">
                  {official.adjective ? (
                    <span className="sa-card-adjective">
                      {official.adjective}
                    </span>
                  ) : null}
                  <p className="sa-card-name">{official.name}</p>
                  <p className="sa-card-role">{official.title}</p>
                  <div className="sa-card-tag-row">
                    <span className="team-member-tag team-member-tag--orange">
                      SA OFFICE
                    </span>
                    {official.email ? (
                      <a
                        href={`mailto:${official.email}`}
                        className="team-member-mail-btn"
                        aria-label={`Email ${official.name}`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m2 7 10 6 10-6" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="sec-talks sched-page-body team-page-body team-page-body--ink"
        id="team-oc"
      >
        <div className="container oc-parallax-container">
          <div className="reveal">
            <span className="sec-tag sec-tag--light">
              FILE: Organizing Committee
            </span>
            <h2 className="sec-heading sec-heading--light">
              <span className="team-adjective team-adjective--light">
                Tireless
              </span>
              ORGANIZING COMMITTEE
            </h2>
            <p className="talks-sub team-talks-sub--light">
              {allOcMembers.length} members across {ocSubsections.length}{" "}
              domains powering every moment of Induction 2026.
            </p>
          </div>

          <OcParallaxGrid members={allOcMembers} />
        </div>
      </section>
      <Footer
        stripItems={[
          "INDUCTION 2026",
          "CLASS OF 2030",
          "IIIT DELHI",
          "FILE / TEAM",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2030"
        bottomRight="DOC ID: IND26-TEAM · FILE / ORGANIZING COMMITTEE · CONFIDENTIAL WHEN PRINTED"
      />
      <ScrollRevealInit />
    </>
  );
}
