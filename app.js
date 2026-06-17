/* ════════════════════════════════════════════════════════════════
   INDUCTION '26 — IIIT Delhi
   Multi-page schedule engine + UI interactions

   Pages:
     index.html          → data-page="home"     — preview cards + countdown
     schedule-btech.html → data-page="schedule" data-track="BTECH"
     schedule-pg.html    → data-page="schedule" data-track="PG"
     contact.html        → data-page="contact"  — details + Web3Forms
     mentors.html        → data-page="mentors"  — mentor group grid
     gallery.html         → data-page="gallery" — full photo archive
   ════════════════════════════════════════════════════════════════

   GOOGLE SHEETS SETUP
   1. File → Share → Publish to web → CSV
   2. Copy the URL and paste into SHEET_CSV_BTECH below
   ════════════════════════════════════════════════════════════════ */

// ── CONFIG ───────────────────────────────────────────────────────
const CONFIG = {
  SHEET_CSV_BTECH: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTo8vcV5AylXmwn6YygKmL_QTFLrYA-npf5PnTB_2VnUBg6TOT5isJnKCt_Cx_cHCDS2WtJHbt7prZA/pub?output=csv',
  SHEET_CSV_PG:    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSat0Ps3z_x75VHF5QkAGJmvuL-T_OeBwBL3k60eMPi2jBV9Lw0gmFGr_oUO7nWB2Ra6JRvXgYDbYe9/pub?output=csv',
  ONE_SHEET:       true,
  INDUCTION_START: new Date('2026-07-17T09:00:00+05:30'),
  REFRESH_EVERY_MS: 3 * 60 * 1000,
};

// ── PAGE CONTEXT ─────────────────────────────────────────────────
const PAGE  = document.body.dataset.page  || 'home';
const TRACK = (document.body.dataset.track || 'BTECH').toUpperCase();

// ── STATE ────────────────────────────────────────────────────────
const state = {
  track:   TRACK,
  loading: false,
};

// ── FLEXIBLE COLUMN READER ───────────────────────────────────────
function col(row, ...aliases) {
  for (const alias of aliases) {
    for (const key of Object.keys(row)) {
      if (key.trim().toLowerCase() === alias.toLowerCase()) {
        const v = row[key];
        return (v == null) ? '' : String(v).trim();
      }
    }
  }
  return '';
}

// ── TIME HELPERS ─────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }

function parseTime(timeStr, dateStr) {
  if (!timeStr) return null;
  const m = timeStr.trim().toUpperCase().match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ampm = m[3];
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const base = (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr))
    ? new Date(dateStr + 'T00:00:00')
    : new Date();
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, min, 0);
}

// ── UNIQUE HELPERS ───────────────────────────────────────────────
function uniqueDays(rows) {
  const seen = new Set(), days = [];
  for (const row of rows) {
    const d = col(row, 'Day', 'day', 'Date', 'date');
    if (d && !seen.has(d)) { seen.add(d); days.push(d); }
  }
  return days;
}

// ── FETCH ────────────────────────────────────────────────────────
function fetchSchedule(track) {
  if (state.loading) return;
  state.loading = true;

  if (PAGE === 'schedule') showLoader();

  const url = (track === 'BTECH') ? CONFIG.SHEET_CSV_BTECH : CONFIG.SHEET_CSV_PG;

  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: 'greedy',
    complete(results) {
      state.loading = false;
      let rows = results.data.filter(row =>
        Object.values(row).some(v => v && String(v).trim())
      );
      if (CONFIG.ONE_SHEET) {
        rows = rows.filter(row => {
          const t = col(row, 'Track', 'track').toUpperCase();
          return !t || t === 'ALL' || t === track;
        });
      }
      if (PAGE === 'home') {
        updateLiveNow(rows);
        updateTrackDates(rows, track);
        updateHeroStatus(rows.length > 0);
      } else {
        renderScheduleBlocks(rows);
        updateLiveNow(rows);
      }
      updateLastRefreshed();
    },
    error(err) {
      state.loading = false;
      const errHtml = `
        <div class="blocks-pending is-error">
          <div class="cs-icon">⚠</div>
          <div class="cs-title">CONNECTION ISSUE</div>
          <div class="cs-text">Could not reach the archive. Check that the Google Sheet is published to web as CSV.</div>
        </div>`;
      const el = document.getElementById('schedule-body');
      if (el) el.innerHTML = errHtml;
      console.error('[Schedule]', err);
    },
  });
}

// ── REFRESH / OPEN ───────────────────────────────────────────────
function refreshSchedule() {
  const icon = document.getElementById('refresh-icon');
  if (icon) {
    icon.style.display   = 'inline-block';
    icon.style.animation = 'spin .7s linear infinite';
    setTimeout(() => { icon.style.animation = ''; }, 1400);
  }
  fetchSchedule(state.track);
}

function openSchedulePage(track) {
  const page = (track === 'BTECH') ? 'schedule-btech.html' : 'schedule-pg.html';
  window.open(page, '_blank');
}

// ══════════════════════════════════════════════════════════════════
//  SCHEDULE PAGES — ONE BLOCK PER DAY
// ══════════════════════════════════════════════════════════════════
function showLoader() {
  const body = document.getElementById('schedule-body');
  if (body) body.innerHTML = `
    <div class="sched-loader">
      <div class="sched-loader-text">ACCESSING CLASSIFIED FILES...</div>
      <div class="sched-loader-bar"><div class="sched-loader-fill"></div></div>
    </div>`;
}

function renderScheduleBlocks(rows) {
  const body = document.getElementById('schedule-body');
  if (!body) return;

  if (rows.length === 0) {
    body.innerHTML = `
      <div class="blocks-pending">
        <div class="cs-icon">∅</div>
        <div class="cs-title">SCHEDULE PENDING</div>
        <div class="cs-text">The induction team is finalising the programme. This page syncs automatically — check back soon.</div>
        <div class="cs-meta">Last checked: <span id="cs-time">—</span></div>
        <button class="cs-refresh" onclick="refreshSchedule()">↻ CHECK AGAIN</button>
      </div>`;
    updateCSTime();
    return;
  }

  const days = uniqueDays(rows);
  const now  = new Date();

  const blocks = days.map((day, idx) => {
    const dayRows = rows.filter(r => col(r, 'Day', 'day', 'Date', 'date') === day);

    const eventItems = dayRows.map(row => {
      const time    = col(row, 'Time', 'time', 'Start Time', 'start_time');
      const endTime = col(row, 'End Time', 'end_time', 'EndTime', 'End');
      const event   = col(row, 'Event', 'event', 'Session', 'session', 'Title', 'title', 'Activity');
      const venue   = col(row, 'Venue', 'venue', 'Location', 'location', 'Room', 'room');
      const status  = col(row, 'Status', 'status').toUpperCase();
      const type    = col(row, 'Type', 'type', 'Category').toUpperCase();
      const dateStr = col(row, 'Date', 'date');

      const isTBA   = !time || /^tba$/i.test(time.trim());
      const noEvent = !event || /^tba$/i.test(event.trim());

      const start  = parseTime(time, dateStr);
      const end    = endTime ? parseTime(endTime, dateStr) : (start ? new Date(start.getTime() + 3600000) : null);
      const isLive = start && end && start <= now && now < end;

      let badgeClass = 'dbe-badge--open', badgeText = 'OPEN';
      if (status === 'CONFIRMED' || type === 'KEYNOTE' || type === 'ORIENTATION') {
        badgeClass = 'dbe-badge--confirmed'; badgeText = 'CONFIRMED';
      } else if (status === 'TENTATIVE' || status === 'TBD') {
        badgeClass = 'dbe-badge--tentative'; badgeText = 'TENTATIVE';
      }
      if (isLive) { badgeClass = 'dbe-badge--live'; badgeText = '● LIVE'; }

      return `
        <div class="dbe-row${noEvent ? ' is-pending' : ''}">
          <div class="dbe-time${isTBA ? ' is-tba' : ''}">${time || '—'}</div>
          <div class="dbe-info">
            <div class="dbe-name${noEvent ? ' is-tba' : ''}">${noEvent ? 'Details to be announced' : escHtml(event)}</div>
            ${venue ? `<div class="dbe-venue">${escHtml(venue)}</div>` : ''}
          </div>
          <div class="dbe-badge ${badgeClass}">${badgeText}</div>
        </div>`;
    }).join('');

    return `
      <div class="day-block">
        <div class="day-block-hdr">
          <span class="day-block-num">DAY ${String(idx + 1).padStart(2, '0')}</span>
          <span class="day-block-date">${escHtml(day)}</span>
        </div>
        <div class="day-block-events">
          ${eventItems || '<div class="dbe-empty">NO EVENTS LISTED YET</div>'}
        </div>
      </div>`;
  }).join('');

  body.innerHTML = `<div class="day-blocks-grid">${blocks}</div>`;
}

function updateCSTime() {
  const el = document.getElementById('cs-time');
  if (el) {
    const n = new Date();
    el.textContent = `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())} IST`;
  }
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── LIVE NOW BAR ─────────────────────────────────────────────────
function updateLiveNow(rows) {
  const contentEl = document.getElementById('live-content');
  const timeEl    = document.getElementById('live-time');
  const barEl     = document.getElementById('live-bar');
  if (!barEl) return;

  const now = new Date();
  let current = null, next = null;

  for (const row of rows) {
    const timeStr = col(row, 'Time', 'time', 'Start Time');
    const endStr  = col(row, 'End Time', 'end_time', 'EndTime');
    const dateStr = col(row, 'Date', 'date');
    const start   = parseTime(timeStr, dateStr);
    if (!start) continue;
    const end = endStr ? parseTime(endStr, dateStr) : new Date(start.getTime() + 3600000);

    if (start <= now && end && now < end && !current) current = { row, start, end };
    else if (start > now && !next)                    next    = { row, start };
  }

  if (current) {
    const name    = col(current.row, 'Event', 'event', 'Session', 'Title') || 'Current Session';
    const venue   = col(current.row, 'Venue', 'venue', 'Location');
    const speaker = col(current.row, 'Speaker', 'speaker');
    contentEl.innerHTML = `
      <span class="live-event-name">${escHtml(name)}</span>
      ${venue   ? `<span class="live-meta">@ ${escHtml(venue)}</span>` : ''}
      ${speaker ? `<span class="live-meta">— ${escHtml(speaker)}</span>` : ''}`;
    timeEl.textContent = `Until ${pad(current.end.getHours())}:${pad(current.end.getMinutes())}`;
    barEl.classList.add('is-live');
  } else if (next) {
    const name = col(next.row, 'Event', 'event', 'Session', 'Title') || 'Next Session';
    contentEl.innerHTML = `<span class="live-up-label">UP NEXT —</span> <span class="live-event-name">${escHtml(name)}</span>`;
    timeEl.textContent  = `at ${pad(next.start.getHours())}:${pad(next.start.getMinutes())}`;
    barEl.classList.remove('is-live');
  } else {
    contentEl.innerHTML = `<span class="live-idle">No active session right now — check the schedule for upcoming events.</span>`;
    timeEl.textContent  = '';
    barEl.classList.remove('is-live');
  }
}

// ── TRACK DATES ──────────────────────────────────────────────────
function updateTrackDates(rows, track) {
  const days  = uniqueDays(rows);
  if (!days.length) return;
  const badge = document.getElementById(track === 'BTECH' ? 'btech-dates-badge' : 'pg-dates-badge');
  if (badge) badge.textContent = days.join('  ·  ');
}

// ── HERO STATUS ──────────────────────────────────────────────────
function updateHeroStatus(hasData) {
  const el = document.getElementById('hero-status');
  if (!el) return;
  el.textContent     = hasData ? 'CONFIRMED' : 'PENDING';
  el.style.color     = hasData ? '#c8f135'   : '';
  el.style.animation = hasData ? 'none'      : '';
}

function updateLastRefreshed() {
  const el = document.getElementById('last-refreshed');
  if (!el) return;
  const n = new Date();
  el.textContent = `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())} IST`;
}

// ── COUNTDOWN ────────────────────────────────────────────────────
function startCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  function tick() {
    const diff = CONFIG.INDUCTION_START - new Date();
    if (diff <= 0) {
      el.innerHTML = '<span class="countdown-live-label">INDUCTION IS LIVE ●</span>';
      return;
    }
    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-mins');
    const s = document.getElementById('cd-secs');
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    if (d) d.textContent = pad(days);
    if (h) h.textContent = pad(hours);
    if (m) m.textContent = pad(mins);
    if (s) s.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
}

// ── FAQ ACCORDION ────────────────────────────────────────────────
function toggleFAQ(btn) {
  const answer  = btn.nextElementSibling;
  const icon    = btn.querySelector('.faq-icon');
  const wasOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(a => {
    a.classList.remove('open');
    const ic = a.previousElementSibling.querySelector('.faq-icon');
    if (ic) ic.textContent = '+';
  });
  if (!wasOpen) {
    answer.classList.add('open');
    if (icon) icon.textContent = '×';
  }
}

// ── CONTACT FORM (Web3Forms) ─────────────────────────────────────
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const result = document.getElementById('form-result');
  const btn    = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const keyInput = form.querySelector('input[name="access_key"]');
    if (!keyInput || keyInput.value === 'YOUR_WEB3FORMS_KEY_HERE') {
      result.textContent = '⚠ Form not configured. Get a free key at web3forms.com and add it to index.html.';
      result.className   = 'form-result is-error';
      return;
    }
    btn.disabled    = true;
    btn.textContent = 'TRANSMITTING...';
    result.textContent = '';
    result.className   = 'form-result';
    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
      const json = await res.json();
      if (json.success) {
        result.textContent = '✓ MESSAGE RECEIVED. WE WILL RESPOND SHORTLY.';
        result.className   = 'form-result is-success';
        form.reset();
      } else throw new Error(json.message || 'Failed');
    } catch (err) {
      result.textContent = '✕ FAILED. PLEASE EMAIL induction@iiitd.ac.in DIRECTLY.';
      result.className   = 'form-result is-error';
    }
    btn.disabled    = false;
    btn.textContent = 'TRANSMIT MESSAGE →';
  });
}

// ── SCROLL-REVEAL ─────────────────────────────────────────────────
function initScrollReveal() {
  if (!window.IntersectionObserver) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── NAV ──────────────────────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 80);
  }, { passive: true });
}

function toggleMenu() {
  const links = document.getElementById('nav-links');
  const hb    = document.getElementById('hamburger');
  if (links) links.classList.toggle('is-open');
  if (hb)    hb.classList.toggle('is-open');
}

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initContactForm();

  if (PAGE === 'home') {
    startCountdown();
    fetchSchedule('BTECH');
    setInterval(() => fetchSchedule('BTECH'), CONFIG.REFRESH_EVERY_MS);
  } else if (PAGE === 'schedule') {
    fetchSchedule(TRACK);
    setInterval(() => fetchSchedule(TRACK), CONFIG.REFRESH_EVERY_MS);
  }

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      const links = document.getElementById('nav-links');
      const hb    = document.getElementById('hamburger');
      if (links) links.classList.remove('is-open');
      if (hb)    hb.classList.remove('is-open');
    });
  });
});
