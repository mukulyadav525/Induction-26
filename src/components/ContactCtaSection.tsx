import Link from "next/link";

export default function ContactCtaSection() {
  return (
    <section className="sec-contact-cta" id="contact">
      <div className="container contact-cta-inner">
        <div className="reveal">
          <span className="sec-tag sec-tag--light">FILE: REACH US</span>
          <h2 className="sec-heading sec-heading--light">
            REACH THE
            <br />
            ARCHIVE
          </h2>
          <p className="contact-cta-blurb">
            Have questions before or during induction? Full contact details,
            important institute numbers, and a direct line to the team all live
            on one page.
          </p>
        </div>
        <Link className="contact-cta-btn reveal" href="/contact">
          OPEN CONTACT PAGE →
        </Link>
      </div>
    </section>
  );
}
