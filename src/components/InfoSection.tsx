const infoCards = [
  {
    letter: "A",
    title: "REGISTRATION",
    code: "INF-A",
    text: "Report to the registration desk in the Atrium on Day 01 at 09:00 to collect your induction kit and complete the registration process.",
  },
  {
    letter: "B",
    title: "DOCUMENTS TO CARRY",
    code: "INF-B",
    text: "Just carry your ID card (along with your personal belongings) and enjoy the induction! :)",
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
    title: "STUDENT SUPPORT",
    code: "INF-E",
    text: "Wellbeing, mentorship, and academic support desks are open throughout induction week. The Student Counselling Cell, Academic Affairs Office, and Hostel Management Office are all present and available on-site at the Atrium.",
  },
  {
    letter: "F",
    title: "EMERGENCY INFORMATION",
    code: "INF-F",
    text: "Medical, security, and on-call contacts are posted at every block. Students can access medical assistance through the college's infirmary. In case of an emergency, contact the induction help desk or call the security office directly.",
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
