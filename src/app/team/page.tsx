"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollReveal";
import OcParallaxGrid from "@/components/OcParallaxGrid";
import {
  ocSubsections,
  saOfficeMembers,
  convenorMembers,
  allOcMembers,
  type TeamMember,
  allLeads,
} from "@/lib/teamData";
import { useEffect } from "react";

interface ColumnDescriptor {
  columnKey: string;
  tag: string;
  heading: string;
  adjective: string;
  topRowMember: TeamMember | null;
  bottomRowMember: TeamMember | null;
  tagLabel: string;
  tagColorClass?: string;
}

const teamNavLinks = [
  { label: "HOME", href: "/" },
  { label: "SA OFFICE", href: "#team-sa" },
  { label: "ORGANIZING COMMITTEE", href: "#team-oc" },
];

const FALLBACK_PHOTO = "/photos/mentors/mentor-01.webp";

function buildRowColumns(
  sectionId: string,
  tag: string,
  heading: string,
  adjective: string,
  members: TeamMember[],
  tagLabel: string,
  tagColorClass: string | undefined,
  rowsPerColumn: number = 2,
): ColumnDescriptor[] {
  const paddedMembers: (TeamMember | null)[] = [...members];

  if (rowsPerColumn === 2 && paddedMembers.length % 2 === 1) {
    paddedMembers.push(null);
  }

  const columnCount = Math.ceil(paddedMembers.length / rowsPerColumn);
  const columns: ColumnDescriptor[] = [];

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    const base = columnIndex * rowsPerColumn;

    columns.push({
      columnKey: `${sectionId}-col-${columnIndex}`,
      tag,
      heading,
      adjective,
      topRowMember: paddedMembers[base] ?? null,
      bottomRowMember:
        rowsPerColumn === 2 ? (paddedMembers[base + 1] ?? null) : null,
      tagLabel,
      tagColorClass,
    });
  }

  return columns;
}

export default function TeamPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  const convenorColumns = buildRowColumns(
    "col-convenors",
    "FILE: Leadership",
    "CONVENORS",
    "Fearless",
    convenorMembers.filter((m) => m.department === "CONVENOR"),
    "CONVENOR",
    "team-member-tag--lime",
  );

  const overallMentorColumns = buildRowColumns(
    "col-overall-mentor",
    "FILE: Leadership",
    "OVERALL MENTOR",
    "Guiding",
    convenorMembers.filter((m) => m.department === "OVERALL MENTOR"),
    "OVERALL MENTOR",
    "team-member-tag--lime",
  );

  const ocColumns = ocSubsections.flatMap((subsection) =>
    buildRowColumns(
      subsection.id,
      subsection.tag,
      subsection.heading,
      subsection.adjective,
      subsection.members,
      "OC",
      undefined,
    ),
  );

  return (
    <>
      <Navbar isScrolledByDefault={true} links={teamNavLinks} />

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
