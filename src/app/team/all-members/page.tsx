import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollRevealInit from "@/components/ScrollReveal";
import {
  saOfficeMembers,
  convenorMembers,
  allOcMembers,
  type TeamMember,
  wholeTeam,
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
            <span className="sec-tag">FILE: Complete Organizing Team</span>
            <h2 className="sec-heading">
              ORGANIZING
              <br />
              TEAM
            </h2>
            <p className="talks-sub">
              {wholeTeam.length} members powering every moment of Induction
              2026.
            </p>
          </div>
        </div>
      </section>
      <section className="sec-talks sched-page-body" id="mentor-groups">
        <div className="container">
          <div className="mentor-grid">
            {wholeTeam.map((member) =>
              MemberCard({ member, tagLabel: "TEAM MEMBER" }),
            )}
          </div>
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
