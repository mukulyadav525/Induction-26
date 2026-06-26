import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScheduleView from "@/components/ScheduleView";
import { fetchScheduleRows } from "@/lib/fetchScheduleRows";

const btechNavLinks = [
  { label: "← MAIN PAGE", href: "/" },
  { label: "ABOUT", href: "/#about" },
  { label: "GALLERY", href: "/#gallery" },
  { label: "SPEAKERS", href: "/#talks" },
  { label: "CONTACT", href: "/contact" },
];

const btechDates = [
  "3 August 2026",
  "4 August 2026",
  "5 August 2026",
  "6 August 2026",
  "7 August 2026",
];

export default async function ScheduleBtechPage() {
  const { days, rows, fetchedAt, error } = await fetchScheduleRows("BTECH");

  return (
    <>
      <Navbar
        isScrolledByDefault={true}
        activeBtech={true}
        links={btechNavLinks}
      />

      <PageHero
        title={
          <>
            B.TECH
            <br />
            INDUCTION SCHEDULE
          </>
        }
        subtitles={["UNDERGRADUATE TRACK · INDUCTION 2026 · CLASS OF 2030"]}
      />

      <ScheduleView
        initialDays={days}
        initialRows={rows}
        initialFetchedAt={fetchedAt}
        track="BTECH"
        dates={btechDates}
        error={error}
      />

      <Footer
        stripItems={[
          "B.TECH INDUCTION 2026",
          "CLASS OF 2030",
          "IIIT DELHI",
          "UNDERGRADUATE TRACK",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2030"
        bottomRight="DOC ID: IND26-2030 · B.TECH TRACK · CONFIDENTIAL WHEN PRINTED"
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
              { text: "PG SCHEDULE ↗", href: "/schedule-pg" },
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
