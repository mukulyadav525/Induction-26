"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollReveal";
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

function MemberCard({
  member,
  tagLabel,
  tagColorClass,
  isLight = false,
}: {
  member: TeamMember;
  tagLabel: string;
  tagColorClass?: string;
  isLight?: boolean;
}) {
  const resolvedPhoto = member.photo ?? FALLBACK_PHOTO;
  return (
    <div
      className={`team-member-card${isLight ? " team-member-card--light" : ""}`}
    >
      <div className="team-member-photo">
        <Image
          src={resolvedPhoto}
          alt={member.name}
          fill
          sizes="(max-width: 900px) 240px, 300px"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
      <div
        className={`team-member-info${isLight ? " team-member-info--light" : ""}`}
      >
        <p
          className={`team-member-dept${isLight ? " team-member-dept--light" : ""}`}
        >
          {member.department}
        </p>
        <p
          className={`team-member-name${isLight ? " team-member-name--light" : ""}`}
        >
          {member.name}
        </p>
        <p
          className={`team-member-role${isLight ? " team-member-role--light" : ""}`}
        >
          {member.role}
        </p>
        <span
          className={`team-member-tag${tagColorClass ? ` ${tagColorClass}` : ""}`}
        >
          {tagLabel}
        </span>
        {member.email ? (
          <a
            href={`mailto:${member.email}`}
            className={`team-member-mail-btn${isLight ? " team-member-mail-btn--light" : ""}`}
            aria-label={`Email ${member.name}`}
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
  );
}

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

  const allOcTrackColumns = [
    ...convenorColumns,
    ...overallMentorColumns,
    ...ocColumns,
  ];

  const leadColumns = buildRowColumns(
    "col-leads",
    "File: Team Leaders",
    "Team Leads",
    "Roaring",
    allLeads,
    "TEAM LEAD",
    "team-member-tag--lime",
  );

  return (
    <>
      <Navbar isScrolledByDefault={true} links={teamNavLinks}/>

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
        <div className="container">
          <div className="reveal">
            <span className="sec-tag sec-tag--light">
              FILE: Organizing Committee
            </span>
            <h2 className="sec-heading sec-heading--light">
              <span className="team-adjective team-adjective--light">
                Tireless
              </span>
              ORGANIZING
              <br />
              COMMITTEE
            </h2>
            <p className="talks-sub team-talks-sub--light">
              {allOcMembers.length} members across {ocSubsections.length}{" "}
              domains powering every moment of Induction 2026.
            </p>
          </div>

          <div className="oc-grid">
            {allOcMembers.map((member) => (
              <div className="oc-card" key={member.name}>
                <div
                  className="oc-card-photo"
                  style={{
                    backgroundImage: `url('${member.photo ?? FALLBACK_PHOTO}')`,
                  }}
                />
                <div className="oc-card-info">
                  <p className="oc-card-name">{member.name}</p>
                  <p className="oc-card-role">{member.role}</p>
                  <div className="oc-card-tag-row">
                    <span className="team-member-tag">{member.department}</span>
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="team-member-mail-btn team-member-mail-btn--light"
                        aria-label={`Email ${member.name}`}
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
      <Footer
        stripItems={[
          "INDUCTION 2026",
          "CLASS OF 2028",
          "IIIT DELHI",
          "FILE / TEAM",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2028"
        bottomRight="DOC ID: IND26-TEAM · FILE / ORGANIZING COMMITTEE · CONFIDENTIAL WHEN PRINTED"
        simpleNavLinks={[
          { text: "MAIN PAGE", href: "/" },
          { text: "ABOUT", href: "/#about" },
          { text: "TEAM", href: "/team" },
          { text: "ALL MEMBERS", href: "/team/all-members" },
          { text: "CONTACT", href: "/contact" },
        ]}
      />
      <ScrollRevealInit />
    </>
  );
}
