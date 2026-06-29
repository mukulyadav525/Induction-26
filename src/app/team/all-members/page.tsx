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
} from "@/lib/teamData";

const teamNavLinks = [
  { label: "ABOUT", href: "/#about" },
  { label: "SCHEDULE", href: "/#schedule" },
  { label: "TEAM", href: "/team" },
  { label: "BUDDY", href: "/induction-buddies" },
  { label: "CONTACT", href: "/contact" },
];

const FALLBACK_PHOTO = "/photos/mentors/mentor-01.webp";

const CARDS_PER_COLUMN = 3;

function EmptyCardSlot({ isLight = false }: { isLight?: boolean }) {
  return (
    <div
      className={`team-member-card team-hscroll-empty-slot${isLight ? " team-member-card--light" : ""}`}
    />
  );
}

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

export default function AllMembersPage() {
  const totalMemberCount =
    convenorMembers.length + saOfficeMembers.length + allOcMembers.length;

  return (
    <>
      <Navbar isScrolledByDefault={true} links={teamNavLinks} />

      <PageHero
        title={
          <>
            ALL
            <br />
            MEMBERS
          </>
        }
        subtitles={[
          `${totalMemberCount}+ MEMBERS · INDUCTION 2026 · IIIT DELHI · CLASS OF 2028`,
        ]}
        extraContent={
          <Link href="/team" className="sched-back-link">
            BACK TO TEAM OVERVIEW
          </Link>
        }
      />

      <section className="sec-talks sched-page-body team-page-body" id="all-oc">
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
            {[
              {
                id: "col-convenors",
                tag: "FILE: Leadership",
                heading: "CONVENORS",
                adjective: "Fearless",
                members: convenorMembers.filter(
                  (m) => m.department === "CONVENOR",
                ),
                tagLabel: "CONVENOR",
                tagColorClass: "team-member-tag--lime",
              },
              {
                id: "col-overall-mentor",
                tag: "FILE: Leadership",
                heading: "OVERALL MENTOR",
                adjective: "Guiding",
                members: convenorMembers.filter(
                  (m) => m.department === "OVERALL MENTOR",
                ),
                tagLabel: "OVERALL MENTOR",
                tagColorClass: "team-member-tag--lime",
              },
              ...ocSubsections.map((subsection) => ({
                id: subsection.id,
                tag: subsection.tag,
                heading: subsection.heading,
                adjective: subsection.adjective,
                members: subsection.members,
                tagLabel: "OC",
                tagColorClass: undefined,
              })),
            ].map((column) => (
              <div key={column.id} className="team-hscroll-column">
                <div className="team-hscroll-column-header">
                  <span className="team-subtag">{column.tag}</span>
                  <h3 className="team-subheading">
                    <span className="team-adjective team-adjective--sub">
                      {column.adjective}
                    </span>
                    {column.heading}
                  </h3>
                </div>
                <div className="team-hscroll-cards">
                  {column.members.map((member) => (
                    <MemberCard
                      key={member.email || member.name}
                      member={member}
                      tagLabel={column.tagLabel}
                      tagColorClass={column.tagColorClass}
                    />
                  ))}
                  {Array.from({
                    length: Math.max(
                      0,
                      CARDS_PER_COLUMN - column.members.length,
                    ),
                  }).map((_, i) => (
                    <EmptyCardSlot key={`empty-${i}`} />
                  ))}
                </div>
              </div>
            ))}
          </TeamHScrollTrack>
        </div>
      </section>

      <section
        className="sec-talks sched-page-body team-page-body team-page-body--ink"
        id="all-sa"
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
          </div>

          <TeamHScrollTrack lightVariant>
            {saOfficeMembers.map((official, index) => (
              <div
                key={index}
                className="team-hscroll-column team-hscroll-column--light"
              >
                <div className="team-hscroll-column-header">
                  <span className="team-subtag team-subtag--light">
                    SA OFFICE
                  </span>
                  <h3 className="team-subheading team-subheading--light">
                    <span className="team-adjective team-adjective--sub team-adjective--light">
                      {official.adjective}
                    </span>
                    {official.title}
                  </h3>
                </div>
                <div className="team-hscroll-cards">
                  <MemberCard
                    member={{
                      name: "To Be Announced",
                      role: official.title,
                      department: "SA OFFICE",
                      photo: official.photo,
                      email: `sa-${index}`,
                    }}
                    tagLabel={official.adjective.toUpperCase()}
                    tagColorClass="team-member-tag--orange"
                    isLight={true}
                  />
                  <EmptyCardSlot isLight />
                  <EmptyCardSlot isLight />
                </div>
              </div>
            ))}
          </TeamHScrollTrack>
        </div>
      </section>

      <Footer
        stripItems={[
          "INDUCTION 2026",
          "CLASS OF 2028",
          "IIIT DELHI",
          "FILE / ALL MEMBERS",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2028"
        bottomRight="DOC ID: IND26-ROSTER · FILE / ALL MEMBERS · CONFIDENTIAL WHEN PRINTED"
        simpleNavLinks={[
          { text: "MAIN PAGE", href: "/" },
          { text: "TEAM OVERVIEW", href: "/team" },
          { text: "BUDDY", href: "/induction-buddies" },
          { text: "CONTACT", href: "/contact" },
          { text: "B.TECH SCHEDULE", href: "/schedule-btech" },
          { text: "PG SCHEDULE", href: "/schedule-pg" },
        ]}
      />
      <ScrollRevealInit />
    </>
  );
}
