import Link from "next/link";

export default function MentorSection() {
  return (
    <section className="sec-mentorship" id="mentors">
      <div className="container">
        <div className="reveal">
          <span className="sec-tag">FILE: Induction Buddies</span>
          <h2 className="sec-heading">
            BUDDIES
            <br />
            CONNECT
          </h2>
        </div>

        <div className="mentorship-layout">
          <div className="mentorship-copy reveal">
            <p>
              Every incoming student is paired with a trained senior mentor —
              your first anchor in a new world. This is not orientation. It is
              the start of a relationship that shapes your entire first semester
              at IIIT Delhi.
            </p>
            <ul className="mentorship-list">
              <li>One-on-one pairing for the entire first semester</li>
              <li>Academic guidance and course selection support</li>
              <li>Insider knowledge from someone who has already been there</li>
              <li>A genuine friend before classes even begin</li>
            </ul>
            <div className="mentorship-callout">
              MENTOR ASSIGNMENTS REVEALED DURING INDUCTION — ATTEND ALL SESSIONS
            </div>
            <Link className="mentor-groups-btn" href="/induction-buddies">
              VIEW MENTOR GROUPS →
            </Link>
          </div>

          <div className="mentorship-stats reveal">
            <div className="stat-card">
              <span className="stat-n">
                800<sup>+</sup>
              </span>
              <span className="stat-l">INCOMING STUDENTS</span>
            </div>
            <div className="stat-card">
              <span className="stat-n">
                100<sup>+</sup>
              </span>
              <span className="stat-l">SENIOR MENTORS</span>
            </div>
            <div className="stat-card">
              <span className="stat-n">2+5</span>
              <span className="stat-l">INDUCTION DAYS</span>
            </div>
            <div className="stat-card">
              <span className="stat-n">∞</span>
              <span className="stat-l">POSSIBILITIES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
