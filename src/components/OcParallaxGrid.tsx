"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { TeamMember } from "@/lib/teamData";

const FALLBACK_PHOTO = "/photos/mentors/mentor-01.webp";
const COLUMN_COUNT = 4;
const COLUMN_TOP_OFFSETS = [0, 64, 24, 88];
const COLUMN_SPEED_MULTIPLIERS = [0.6, -0.9, 1.1, -0.5];
const PARALLAX_AMPLITUDE_PX = 160;
const PHOTO_HEIGHT_TIERS = ["short", "tall", "medium"];

interface OcParallaxGridProps {
  members: TeamMember[];
}

function splitIntoColumns(
  members: TeamMember[],
  columnCount: number,
): TeamMember[][] {
  const columns: TeamMember[][] = Array.from({ length: columnCount }, () => []);
  members.forEach((member, memberIndex) => {
    columns[memberIndex % columnCount].push(member);
  });
  return columns;
}

export default function OcParallaxGrid({ members }: OcParallaxGridProps) {
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const gridContainer = gridContainerRef.current;
    if (!gridContainer) return;

    const mediaQueryMatcher = gsap.matchMedia();

    mediaQueryMatcher.add("(min-width: 901px)", () => {
      const scrollTrigger = ScrollTrigger.create({
        trigger: gridContainer,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          columnRefs.current.forEach((columnElement, columnIndex) => {
            if (!columnElement) return;
            const speedMultiplier =
              COLUMN_SPEED_MULTIPLIERS[columnIndex % COLUMN_SPEED_MULTIPLIERS.length];
            gsap.set(columnElement, {
              y: self.progress * PARALLAX_AMPLITUDE_PX * speedMultiplier,
              force3D: true,
            });
          });
        },
      });

      return () => scrollTrigger.kill();
    });

    return () => mediaQueryMatcher.revert();
  }, [members]);

  const memberColumns = splitIntoColumns(members, COLUMN_COUNT);

  return (
    <div ref={gridContainerRef} className="oc-parallax-grid">
      {memberColumns.map((columnMembers, columnIndex) => (
        <div
          key={`oc-parallax-col-${columnIndex}`}
          ref={(element) => {
            columnRefs.current[columnIndex] = element;
          }}
          className="oc-parallax-column"
          style={{ marginTop: COLUMN_TOP_OFFSETS[columnIndex % COLUMN_TOP_OFFSETS.length] }}
        >
          {columnMembers.map((member, memberIndex) => {
            const heightTier =
              PHOTO_HEIGHT_TIERS[memberIndex % PHOTO_HEIGHT_TIERS.length];
            return (
              <div className="oc-parallax-card" key={member.name}>
                <div className={`oc-parallax-photo oc-parallax-photo--${heightTier}`}>
                  <Image
                    src={member.photo ?? FALLBACK_PHOTO}
                    alt={member.name}
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>
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
            );
          })}
        </div>
      ))}
    </div>
  );
}
