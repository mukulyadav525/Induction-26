import Link from "next/link";
import LandingSectionCard from "@/components/LandingSectionCard";

export default function ContactCtaSection() {
  return (
    <LandingSectionCard
      sectionId="contact"
      sectionClassName="sec-contact-cta"
      containerClassName="container"
      tagText="FILE: REACH US"
      title="REACH THE ARCHIVE"
      subtitle="Have questions before or during induction? Full contact details, important institute numbers, and a direct line to the team all live on one page."
    >
      <div className="contact-card-body reveal">
        <div className="contact-card-text-group">
          <p className="contact-card-para">
            During induction week, dedicated support desks operate inside the Academic Block and Atrium from 09:00 to 18:00 daily. Whether you need assistance with campus directions, schedule accommodations, or general orientation guidelines, our induction coordinators are accessible on-site and online.
          </p>
          <div className="contact-card-details">
            <div className="contact-detail-row">
              <span className="contact-detail-label">HELP DESK</span>
              <span className="contact-detail-val">Available at Atrium ground floor during orientation days.</span>
            </div>
            <div className="contact-detail-row">
              <span className="contact-detail-label">EMERGENCY LINE</span>
              <span className="contact-detail-val">On-call 24/7 via campus security office and infirmary.</span>
            </div>
            <div className="contact-detail-row">
              <span className="contact-detail-label">EMAIL SUPPORT</span>
              <span className="contact-detail-val">Queries answered daily by student mentoring committee.</span>
            </div>
          </div>
        </div>

        <div className="contact-card-btn-wrap">
          <Link className="contact-cta-btn" href="/contact">
            OPEN CONTACT PAGE →
          </Link>
        </div>
      </div>
    </LandingSectionCard>
  );
}
