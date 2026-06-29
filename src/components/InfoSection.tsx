const infoCards = [
  {
    letter: "A",
    title: "REGISTRATION",
    code: "INF-A",
    text: "Report to the registration desk in the Atrium on Day 01 from 09:00. Carry your admission confirmation and original ID proof. A complete registration procedure document will be shared via the student portal before arrival.",
  },
  {
    letter: "B",
    title: "DOCUMENTS TO CARRY",
    code: "INF-B",
    text: "Original ID proof, admission offer letter, passport-size photographs (×4), academic mark sheets and certificates, migration certificate (where applicable), and hostel allotment details if applying for on-campus accommodation.",
  },
  {
    letter: "C",
    title: "CAMPUS ACCESS",
    code: "INF-C",
    text: "Access cards are issued at registration on Day 01. Gate 2 (Okhla Phase III) is the primary entry point during induction week. Visitors must register at the gate. Keep your access card on you at all times during induction.",
  },
  {
    letter: "D",
    title: "ACCOMMODATION",
    code: "INF-D",
    text: "Hostel allotment letters will be shared on the student portal before induction begins. Check-in is on Day 01 from 08:00. Room assignments are final — room swap requests can be submitted after the first semester begins.",
  },
  {
    letter: "E",
    title: "STUDENT SUPPORT",
    code: "INF-E",
    text: "Wellbeing, mentorship, and academic support desks are open throughout induction week. The Student Counselling Cell, Academic Affairs Office, and Hostel Management Office are all present and available on-site at the Atrium.",
  },
  {
    letter: "F",
    title: "EMERGENCY INFORMATION",
    code: "INF-F",
    text: "Medical, security, and on-call contacts are posted at every block and will be shared on the student portal. The campus has a dedicated medical room. In case of emergency, contact the induction help desk or call the security office directly.",
  },
];

export default function InfoSection() {
  return (
    <section className="sec-info" id="info">
      <div className="info-inner">
        <span className="sec-tag sec-tag--dark">FILE: NOTICES</span>
        <h2 className="info-title">
          IMPORTANT
          <br />
          INFORMATION
        </h2>
        <p className="info-subtitle">
          READ BEFORE ARRIVAL · ALL NOTICES SUBJECT TO REVISION
        </p>

        <div className="info-grid">
          {infoCards.map((card) => (
            <div className="info-card reveal" key={card.code}>
              <div className="ic-top">
                <span className="ic-letter">{card.letter}</span>
                <div className="ic-title-row">
                  <span className="ic-title">{card.title}</span>
                  <span className="ic-code">{card.code}</span>
                </div>
              </div>
              <div className="ic-rule"></div>
              <p className="ic-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
