const infoCards = [
  {
    letter: "A",
    title: "STUDENT SUPPORT",
    code: "INF-A",
    text: "Wellbeing, mentorship, and academic support desks are open throughout induction week. The Student Counselling Cell, Academic Affairs Office, and Hostel Management Office are all present and available on-site at the Atrium.",
  },
  {
    letter: "B",
    title: "EMERGENCY INFORMATION",
    code: "INF-B",
    text: "Medical, security, and on-call contacts are posted at every block. Students can access medical assistance through the college's infirmary. In case of an emergency, contact the induction help desk or call the security office directly.",
  },
  {
    letter: "C",
    title: "CAMPUS ACCESS",
    code: "INF-C",
    text: "ID cards will be issued during the final document submission process. Students must use their ID cards to enter the campus and for all campus entries. Visitors are required to register at the gate before entering the campus.",
  },
  {
    letter: "D",
    title: "ACCOMMODATION",
    code: "INF-D",
    text: "Students who wish to stay on campus during the induction activities will be provided complimentary accommodation for the duration of the induction. Hostel allotment for the regular academic session will take place after the induction, in accordance with the eligibility criteria and allotment process published on the institute website.",
  },
  {
    letter: "E",
    title: "REGISTRATION",
    code: "INF-E",
    text: "Report to the registration desk in the Atrium on Day 01 at 09:00 to collect your induction kit and complete the registration process.",
  },
  {
    letter: "F",
    title: "DOCUMENTS TO CARRY",
    code: "INF-F",
    text: "Just carry your ID card (along with your personal belongings) and enjoy the induction! :)",
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
              <span className="ic-watermark" aria-hidden="true">
                {card.letter}
              </span>
              <div className="ic-top">
                <div className="ic-title-row">
                  <div className="ic-title-mark">
                    <span className="ic-tab"></span>
                    <span className="ic-title">{card.title}</span>
                  </div>
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
