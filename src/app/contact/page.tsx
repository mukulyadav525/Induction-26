"use client";

import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollRevealInit from "@/components/ScrollReveal";

const contactNavLinks = [
  { label: "← MAIN PAGE", href: "/" },
  { label: "ABOUT", href: "/#about" },
  { label: "SCHEDULE", href: "/#about" },
  { label: "INDUCTION BUDDIES", href: "/mentors" },
  { label: "DIRECTIONS", href: "/contact#directions" },
];

const importantContacts = [
  {
    label: "General Information",
    value: "admin-saoffice@iiitd.ac.in",
  },
  {
    label: "Academic",
    valueHtml:
      "<strong>For UG:</strong> admin-btech@iiitd.ac.in<br><strong>For PG:</strong> admin-mtech@iiitd.ac.in<br><strong>For PhD:</strong> admin-phd@iiitd.ac.in",
  },
  {
    label: "Security",
    value: "+91 98682 44868 \u00a0||\u00a0 +91 11 26907592 or Extn. 592",
  },
];

const socialLinks = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/iiit.delhi" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/school/iiit-delhi/" },
  { label: "YOUTUBE", href: "https://www.youtube.com/@iiit-delhiofficial" },
  { label: "FACEBOOK", href: "https://www.facebook.com/IIITDelhi" },
  { label: "X", href: "https://x.com/IIITDelhi" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [resultMessage, setResultMessage] = useState("");

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formStatus === "submitting") return;

    setFormStatus("submitting");
    setResultMessage("");

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        setFormStatus("success");
        setResultMessage("✓ MESSAGE RECEIVED. WE WILL RESPOND SHORTLY.");
        formRef.current?.reset();
      } else {
        throw new Error(json.message || "Failed");
      }
    } catch {
      setFormStatus("error");
      setResultMessage(
        "✕ FAILED. PLEASE EMAIL induction@iiitd.ac.in DIRECTLY.",
      );
    } finally {
      if (formStatus !== "success") setFormStatus("idle");
    }
  }

  const submitButtonLabel =
    formStatus === "submitting" ? "TRANSMITTING..." : "TRANSMIT MESSAGE →";

  const resultClassName =
    formStatus === "success"
      ? "form-result is-success"
      : formStatus === "error"
        ? "form-result is-error"
        : "form-result";

  return (
    <>
      <Navbar isScrolledByDefault={true} links={contactNavLinks} />

      <PageHero
        title={
          <>
            GET IN
            <br />
            TOUCH
          </>
        }
        subtitles={[
          "QUESTIONS BEFORE OR DURING INDUCTION · THE TEAM MONITORS ALL TRANSMISSIONS",
        ]}
      />

      <section className="sec-contact">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info">
              <p className="contact-blurb">
                Have questions before or during induction? Reach out below — we
                will respond before the clock runs out.
              </p>
              <ul className="contact-details">
                <li>
                  <span className="c-icon">▸</span>induction@iiitd.ac.in
                </li>
                <li>
                  <span className="c-icon">▸</span>+91-11-26907400-7404 (5
                  lines)
                </li>
                <li>
                  <span className="c-icon">▸</span>Okhla Industrial Estate,
                  Phase III (Near Govind Puri Metro Station), New Delhi — 110020
                </li>
              </ul>
              <div className="contact-socials">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="soc-tag"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="contact-note">
                Office hours: Mon – Fri, 9:00 AM – 5:00 PM IST
              </div>
            </div>

            <form
              ref={formRef}
              className="contact-form"
              onSubmit={handleFormSubmit}
            >
              <input
                type="checkbox"
                name="botcheck"
                style={{ display: "none" }}
                tabIndex={-1}
              />

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="fn">YOUR NAME</label>
                  <input
                    type="text"
                    id="fn"
                    name="name"
                    required
                    placeholder="Full Name"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="fe">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    id="fe"
                    name="email"
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="ft">YOUR TRACK</label>
                <select id="ft" name="track">
                  <option value="BTECH">B.Tech</option>
                  <option value="PG">M.Tech / Ph.D</option>
                  <option value="PARENT">Parent / Guardian</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="fm">MESSAGE</label>
                <textarea
                  id="fm"
                  name="message"
                  required
                  placeholder="Your question or message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="form-submit-btn"
                disabled={formStatus === "submitting"}
              >
                {submitButtonLabel}
              </button>
              {resultMessage && (
                <p className={resultClassName}>{resultMessage}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="sec-contact-icc">
        <div className="container">
          <div className="icc-block">
            <h3 className="icc-title">IMPORTANT CONTACTS</h3>
            <p className="icc-sub">
              INSTITUTE-WIDE NUMBERS &amp; EMAILS · NOT INDUCTION-SPECIFIC
            </p>
            <div className="icc-table">
              {importantContacts.map((contact, i) => (
                <div className="icc-row" key={i}>
                  <span className="icc-label">{contact.label}</span>
                  <div
                    className="icc-value"
                    dangerouslySetInnerHTML={
                      contact.valueHtml
                        ? { __html: contact.valueHtml }
                        : undefined
                    }
                  >
                    {contact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-map-wrap">
            <iframe
              src="https://www.google.com/maps?q=IIIT+Delhi,+Okhla+Industrial+Estate,+Phase+III,+New+Delhi&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="IIIT Delhi campus map"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="sec-directions" id="directions">
        <div className="container">
          <div className="dir-hdr reveal">
            <h2 className="sec-heading">
              DIRECTIONS
              <br />
              TO CAMPUS
            </h2>
          </div>

          <div className="dir-card reveal">
            <div className="dir-card-hdr">
              <span>BY ROAD</span>
              <span className="dir-code">DIR-01</span>
            </div>
            <div className="dir-card-body">
              <p className="dir-intro">
                Coming from Nehru Place on Outer Ring Road, follow these
                directions to reach the main gate:
              </p>
              <ol className="dir-steps">
                <li>
                  After about half a kilometre, turn right from under the first
                  flyover (it is one-way).
                </li>
                <li>
                  After about 300 m, turn left from under the Govind Puri Metro
                  Station — there&apos;s an IIIT‑D sign at this turn.
                </li>
                <li>
                  After another 300 m you&apos;ll reach a fork in the road —
                  take the left road.
                </li>
                <li>
                  Follow the signs for IIIT‑D — the main gate is about 500 m
                  ahead.
                </li>
              </ol>
            </div>
          </div>

          <div className="dir-grid-two reveal">
            <div className="dir-card">
              <div className="dir-card-hdr">
                <span>FROM THE AIRPORT</span>
                <span className="dir-code">DIR-02</span>
              </div>
              <div className="dir-card-body">
                <p>
                  Delhi (IGI) Airport has two relevant terminals — T3 for
                  international and T1 for domestic arrivals. Pre-paid taxi
                  counters inside the terminal offer fixed-rate AC cabs
                  (&quot;Meru Cab&quot;), so the driver can neither refuse the
                  ride nor overcharge you. Uber and Ola also run airport pickups
                  — book from your phone, or at the counters near the terminal
                  car parks if you have no signal. Some hotels arrange airport
                  transfers directly — check with yours.
                </p>
              </div>
            </div>
            <div className="dir-card">
              <div className="dir-card-hdr">
                <span>FROM THE STATION</span>
                <span className="dir-code">DIR-03</span>
              </div>
              <div className="dir-card-body">
                <p>
                  Three long-distance terminals serve Delhi by train: New Delhi,
                  Old Delhi, and Nizamuddin Railway Stations. Okhla Station is
                  the nearest to campus, but not all trains stop there. From any
                  of these stations, an Ola/Uber or auto-rickshaw will get you
                  to IIIT Delhi directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer
        stripItems={[
          "INDUCTION 2026",
          "CLASS OF 2028",
          "IIIT DELHI",
          "FILE / CONTACT",
        ]}
        bottomLeft="INDUCTION 2026 — IIIT DELHI — BATCH 2026-2028"
        bottomRight="DOC ID: IND26-2028 · FILE / CONTACT · CONFIDENTIAL WHEN PRINTED"
        simpleNavLinks={[
          { text: "MAIN PAGE", href: "/" },
          { text: "ABOUT", href: "/#about" },
          { text: "INDUCTION BUDDIES", href: "/mentors" },
          { text: "DIRECTIONS", href: "/contact#directions" },
          { text: "B.TECH SCHEDULE ↗", href: "/schedule-btech" },
          { text: "PG SCHEDULE ↗", href: "/schedule-pg" },
        ]}
      />
      <ScrollRevealInit />
    </>
  );
}
