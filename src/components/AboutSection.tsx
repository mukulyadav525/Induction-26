"use client";

import LandingSectionCard from "@/components/LandingSectionCard";

export default function AboutSection() {
  return (
    <LandingSectionCard
      sectionId="about"
      sectionClassName="sec-about"
      tagText="FILE: ABOUT"
      title="WELCOME TO IIIT DELHI"
      subtitle="Indraprastha Institute of Information Technology Delhi was created by an act of the Delhi Legislature, empowering it to carry out R&D, conduct educational programmes, and grant degrees. Induction marks your beginning — a curated, deliberate transfer of culture, knowledge, and community from one generation to the next."
      topElement={<div style={{ position: "relative", top: "-96px" }} />}
    >
      <div className="about-content-stack">
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
            <span className="astat-n">650+</span>
            <span className="astat-l">NEW STUDENTS</span>
          </div>
          <div className="astat-divider"></div>
          <div className="astat">
            <span className="astat-n">5</span>
            <span className="astat-l">INDUCTION DAYS</span>
          </div>
          <div className="astat-divider"></div>
        </div>

        <div className="about-features reveal">
          <div className="about-feature-box">
            <h4>A CULTURE OF INNOVATION</h4>
            <p>
              Our interdisciplinary ecosystem encourages students to explore computing, electronics, artificial intelligence, and design. You will collaborate with world-class faculty on practical research challenges from your initial semester.
            </p>
          </div>
          <div className="about-feature-box">
            <h4>VIBRANT CAMPUS LIFE</h4>
            <p>
              Beyond academics, our institute offers dynamic community engagement through over forty technical clubs, cultural assemblies, athletic competitions, and artistic societies that build resilient leaders.
            </p>
          </div>
        </div>
      </div>
    </LandingSectionCard>
  );
}
