"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollRevealInit from "@/components/ScrollReveal";
import TeamHScrollTrack from "@/components/TeamHScrollTrack";
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
  { label: "ABOUT", href: "/#about" },
  { label: "SCHEDULE", href: "/#schedule" },
  { label: "TEAM", href: "/team" },
  { label: "BUDDY", href: "/induction-buddies" },
  { label: "CONTACT", href: "/contact" },
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
      <div
        className="team-member-photo"
        style={{ backgroundImage: `url('${resolvedPhoto}')` }}
      />
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

function HScrollColumn({
  column,
  isLight = false,
}: {
  column: ColumnDescriptor;
  isLight?: boolean;
}) {
  const borderClass = isLight ? " team-hscroll-column--light" : "";

  return (
    <div className={`team-hscroll-column${borderClass}`}>
      <div className="team-hscroll-column-header">
        <span className={`team-subtag${isLight ? " team-subtag--light" : ""}`}>
          {column.tag}
        </span>
        <h3
          className={`team-subheading${isLight ? " team-subheading--light" : ""}`}
        >
          <span
            className={`team-adjective team-adjective--sub${isLight ? " team-adjective--light" : ""}`}
          >
            {column.adjective}
          </span>
          {column.heading}
        </h3>
      </div>
      <div className="team-hscroll-cards">
        {column.topRowMember ? (
          <MemberCard
            member={column.topRowMember}
            tagLabel={column.tagLabel}
            tagColorClass={column.tagColorClass}
            isLight={isLight}
          />
        ) : (
          <></>
        )}
        {column.bottomRowMember ? (
          <MemberCard
            member={column.bottomRowMember}
            tagLabel={column.tagLabel}
            tagColorClass={column.tagColorClass}
            isLight={isLight}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
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
      <Navbar isScrolledByDefault={true} links={teamNavLinks} />

      <PageHero
        title={
          <>
            THE
            <br />
            TEAM
          </>
        }
        subtitles={[
          "THE PEOPLE BEHIND INDUCTION 2026 · CLASS OF 2028 · IIIT DELHI",
        ]}
      />

      <section
        className="sec-talks sched-page-body team-page-body"
        id="team-oc"
      >
        <div className="container">
          <div className="reveal">
            <span className="sec-tag">FILE: Organizing Committee</span>
            <h2 className="sec-heading">
              ORGANIZING
              <br />
              COMMITTEE
            </h2>
            <p className="talks-sub">
              {allOcMembers.length} members across {ocSubsections.length}{" "}
              domains powering every moment of Induction 2026.
            </p>
          </div>

          <TeamHScrollTrack>
            {allOcTrackColumns.map((column) => (
              <HScrollColumn key={column.columnKey} column={column} />
            ))}
          </TeamHScrollTrack>
        </div>
      </section>

      <section
        className="sec-talks sched-page-body team-page-body team-page-body--ink"
        id="team-sa"
      >
        <div className="container">
          <div className="reveal">
            <span className="sec-tag sec-tag--light">
              FILE: Student Affairs
            </span>
            <h2 className="sec-heading sec-heading--light">
              <span className="team-adjective team-adjective--light">
                Sovereign
              </span>
              SA OFFICE
            </h2>
            <p className="talks-sub team-talks-sub--light">
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
                  <span className="team-member-tag team-member-tag--orange">
                    SA OFFICE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        className="sec-talks sched-page-body team-page-body"
        id="team-leads"
      >
        <div className="container">
          <div className="reveal">
            <span className="sec-tag">FILE: Team Leads</span>
            <h2 className="sec-heading">
              TEAM
              <br />
              LEADS
            </h2>
            {/* <p className="talks-sub">
              {allOcMembers.length} members across {ocSubsections.length}{" "}
              domains powering every moment of Induction 2026.
            </p> */}
          </div>

          <TeamHScrollTrack>
            {leadColumns.map((column) => (
              <HScrollColumn key={column.columnKey} column={column} />
            ))}
          </TeamHScrollTrack>
        </div>
      </section>
      <section className="team-cta-section">
        <div className="container">
          <div className="team-cta-inner reveal">
            <div className="team-cta-left">
              <span className="sec-tag sec-tag--light">FILE: Full Roster</span>
              <h2 className="sec-heading sec-heading--light">
                MEET THE
                <br />
                WHOLE TEAM
              </h2>
              <p className="team-cta-body">
                Every student volunteer, department lead, and induction
                coordinator. The complete Induction 2026 roster.
              </p>
            </div>
            <div className="team-cta-right">
              <Link href="/team/all-members" className="team-cta-btn">
                VIEW ALL MEMBERS →
              </Link>
              <p className="team-cta-count">
                {allOcMembers.length +
                  saOfficeMembers.length +
                  convenorMembers.length}
                + MEMBERS TOTAL
              </p>
            </div>
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
          { text: "BUDDY", href: "/induction-buddies" },
          { text: "CONTACT", href: "/contact" },
        ]}
      />
      <ScrollRevealInit />
    </>
  );
}
