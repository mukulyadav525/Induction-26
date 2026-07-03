"use client";

import { useRouter } from "next/navigation";

export default function ScheduleSection() {
  const router = useRouter();

  function openSchedulePage(track: string) {
    router.push(track === "BTECH" ? "/schedule-btech" : "/schedule-pg");
  }

  return (
    <section className="sec-schedule" id="schedule">
      <div className="container">
        <div className="about-intro reveal">
          <span className="sec-tag">FILE: SCHEDULE</span>
          <h2 className="sec-heading">
            CHOOSE
            <br />
            YOUR TRACK
          </h2>

          <p className="about-copy">
            Select the induction schedule corresponding to your programme and
            explore the events planned for your orientation.
          </p>
        </div>

        <div className="track-cards">
          <article className="track-card card-btech reveal">
            <span className="track-card-num">TRACK 01</span>

            <h3>B.TECH</h3>

            <div className="track-dates-badge">03 August - 07 August</div>

            <p>
              The undergraduate induction welcomes freshers with campus tours,
              club fairs, department introductions, cultural activities, and
              senior mentor sessions across multiple days.
            </p>

            <button
              className="track-go-btn"
              onClick={() => openSchedulePage("BTECH")}
            >
              B.TECH SCHEDULE →
            </button>
          </article>

          <article className="track-card card-pg reveal">
            <span className="track-card-num">TRACK 02</span>

            <h3>
              M.TECH /<br />
              Ph.D
            </h3>

            <div className="track-dates-badge">17 July - 18 July</div>

            <p>
              The postgraduate induction orients M.Tech and Ph.D students to
              research culture, lab infrastructure, academic policies, and the
              vibrant research community at IIIT Delhi.
            </p>

            <button
              className="track-go-btn"
              onClick={() => openSchedulePage("PG")}
            >
              PG SCHEDULE →
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}