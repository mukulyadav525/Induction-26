import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScheduleView from "@/components/ScheduleView";
import { fetchScheduleRows } from "@/lib/fetchScheduleRows";

export const revalidate = 5;

const btechNavLinks = [
  { label: "HOME", href: "/" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "/contact" },
];

const btechDates = [
  "3 August 2026",
  "4 August 2026",
  "5 August 2026",
  "6 August 2026",
  "7 August 2026",
];

function ScheduleSkeleton() {
  return (
    <section className="sec-schedule sched-page-body sched-blocks-body">
      <div className="container">
        <div className="blocks-pending">
          <div className="cs-icon">⏳</div>
          <div className="cs-title">LOADING SCHEDULE</div>
          <div className="cs-text">Pulling the latest schedule…</div>
        </div>
      </div>
    </section>
  );
}

async function BtechScheduleData() {
  const { days, fetchedAt, error } = await fetchScheduleRows("BTECH");
  return (
    <ScheduleView
      initialDays={days}
      initialFetchedAt={fetchedAt}
      track="BTECH"
      dates={btechDates}
      error={error}
    />
  );
}

export default function ScheduleBtechPage() {
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

      <Suspense fallback={<ScheduleSkeleton />}>
        <BtechScheduleData />
      </Suspense>

      <Footer
        stripItems={[
          "B.TECH INDUCTION 2026",
          "CLASS OF 2030",
          "IIIT DELHI",
          "UNDERGRADUATE TRACK",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2030"
        bottomRight="DOC ID: IND26-2030 · B.TECH TRACK · CONFIDENTIAL WHEN PRINTED"
      />
    </>
  );
}
