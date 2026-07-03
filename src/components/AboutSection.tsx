"use client";

export default function AboutSection() {

  return (
    <section className="sec-about" id="about">
      <div className="container">
        <div style={{ position: "relative", top: "-96px" }} />
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
            <span className="astat-n">250+</span>
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
      </div>
    </section>
  );
}
