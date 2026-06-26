"use client";

import { useRouter } from "next/navigation";

export default function AboutSection() {
  const router = useRouter();

  function openSchedulePage(track: string) {
    router.push(track === "BTECH" ? "/schedule-btech" : "/schedule-pg");
  }

  return (
    <section className="sec-about" id="about">
      <div className="container">
        <div id="schedule" style={{ position: "relative", top: "-96px" }} />
        <div className="about-intro reveal">
          <span className="sec-tag">FILE: ABOUT</span>
          <h2 className="sec-heading">
            WELCOME TO
            <br />
            IIIT DELHI
          </h2>
          <p className="about-copy">
            Indraprastha Institute of Information Technology Delhi was created
            by an act of the Delhi Legislature, empowering it to carry out
            R&amp;D, conduct educational programmes, and grant degrees.
            Induction marks your beginning — a curated, deliberate transfer of
            culture, knowledge, and community from one generation to the next.
          </p>
        </div>

        <div className="about-stats reveal">
          <div className="astat">
            <span className="astat-n">2008</span>
            <span className="astat-l">FOUNDED</span>
          </div>
          <div className="astat-divider"></div>
          <div className="astat">
            <span className="astat-n">40+</span>
            <span className="astat-l">CLUBS &amp; SOCIETIES</span>
          </div>
          <div className="astat-divider"></div>
          <div className="astat">
            <span className="astat-n">800+</span>
            <span className="astat-l">NEW STUDENTS</span>
          </div>
          <div className="astat-divider"></div>
          <div className="astat">
            <span className="astat-n">2 + 5</span>
            <span className="astat-l">INDUCTION DAYS</span>
          </div>
          <div className="astat-divider"></div>
          <div className="astat">
            <span className="astat-n">2</span>
            <span className="astat-l">TRACKS</span>
          </div>
        </div>

        <div className="track-cards">
          <article className="track-card card-btech reveal">
            <span className="track-card-num">TRACK 01</span>
            <h3>B.TECH</h3>
            <div className="track-dates-badge" id="btech-dates-badge">
              DATES TO BE ANNOUNCED
            </div>
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
            <div className="track-dates-badge" id="pg-dates-badge">
              17 July - 18 July
            </div>
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
