import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScheduleView from "@/components/ScheduleView";
import { fetchScheduleRows } from "@/lib/fetchScheduleRows";

export const dynamic = "force-dynamic";

const pgNavLinks = [
  { label: "← MAIN PAGE", href: "/" },
  { label: "ABOUT", href: "/#about" },
  { label: "GALLERY", href: "/#gallery" },
  { label: "SPEAKERS", href: "/#talks" },
  { label: "CONTACT", href: "/contact" },
];

const pgDates = ["17 July 2026", "18 July 2026"];

export default async function SchedulePgPage() {
  const { days, fetchedAt, error } = await fetchScheduleRows("PG");

  return (
    <>
      <Navbar isScrolledByDefault={true} activePg={true} links={pgNavLinks} />
      <PageHero
        title={
          <>
            M.TECH / Ph.D
            <br />
            INDUCTION SCHEDULE
          </>
        }
        subtitles={["POSTGRADUATE TRACK · INDUCTION 2026 · CLASS OF 2028"]}
        modifier="sched-page-hero--pg"
      />
      <ScheduleView
        initialDays={days}
        initialFetchedAt={fetchedAt}
        track="PG"
        dates={pgDates}
        error={error}
      />
      <Footer
        stripItems={[
          "PG INDUCTION 2026",
          "CLASS OF 2028",
          "IIIT DELHI",
          "POSTGRADUATE TRACK",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2028"
        bottomRight="DOC ID: IND26-2028 · PG TRACK · CONFIDENTIAL WHEN PRINTED"
        navColumns={[
          {
            label: "SECTIONS",
            links: [
              { text: "MAIN PAGE", href: "/" },
              { text: "ABOUT", href: "/#about" },
              { text: "GALLERY", href: "/#gallery" },
            ],
          },
          {
            label: "MORE",
            links: [
              { text: "INFO", href: "/#info" },
              { text: "B.TECH SCHEDULE ↗", href: "/schedule-btech" },
            ],
          },
          {
            label: "SUPPORT",
            links: [{ text: "CONTACT ↗", href: "/contact" }],
          },
        ]}
      />
    </>
  );
}
