import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Mail, MapPin, Menu, Phone, X, Users, ClipboardList, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { ConceptWidget, StudioCredit } from "./concept.jsx";
import logo from "./assets/axiom-logo.png";

const COMPANY = "AXIOM Architecture";
const LEGAL = "Axiom Architecture, PLLC";
const ABBR = "axa";
const END_DATE = "2026-12-12T23:59:59-06:00";
const PHONE = "270.663.1256";
const PHONE_TEL = "+12706631256";
const ADDRESS = ["2625 Frederica Street", "Owensboro, Kentucky 42301"];
const MAP_QUERY = "2625 Frederica Street, Owensboro, KY 42301";
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const PEOPLE = [
  { name: "Ben Grove", email: "ben@axiom-architecture.com", initials: "BG" },
  { name: "Aaron Nacey", email: "aaron@axiom-architecture.com", initials: "AN" },
];
const EMAIL = PEOPLE[0].email;

const NAV = [
  ["Approach", "#approach"],
  ["Process", "#process"],
  ["Team", "#team"],
  ["Contact", "#contact"],
];

const PRINCIPLES = [
  { icon: Users, sheet: "01", title: "Teamwork", text: "Every project is a team effort, and you are part of that team from the first meeting." },
  { icon: ClipboardList, sheet: "02", title: "Professional project management", text: "Each project is managed from start to finish, so it moves forward on a clear plan." },
  { icon: Lightbulb, sheet: "03", title: "A creative approach", text: "Every site, budget and program is different, so every design starts with a fresh look." },
];

// The phases of a project, from the first draft to the final inspection. Each one adds a layer to the drawing.
const PHASES = [
  { code: "SK", title: "First conversation", text: "We meet, listen and walk the site. You tell us what the building needs to do, what you can spend and when you need it." },
  { code: "SD", title: "First draft", text: "Early sketches and massing studies test the big ideas: how the building sits on the site, how it is organized, how it feels." },
  { code: "DD", title: "Design development", text: "The chosen direction is worked out floor by floor, with structure, systems and materials coming into focus." },
  { code: "CD", title: "Construction documents", text: "Drawings and specifications detailed enough to permit, price and build from." },
  { code: "BP", title: "Permits & bidding", text: "We help take the drawings through review and get comparable bids from contractors." },
  { code: "CA", title: "Construction to final inspection", text: "We stay at your side through construction, answering questions on site until the final inspection." },
];

/* ---------- Line drawing: a one-point perspective street of buildings, built in layers by phase ---------- */
const VP = { x: 600, y: 250 };
const F = 520;
const GROUND = 210;
const BOXES = [
  // left side (street face = x1)
  { x0: -720, x1: -330, z0: 0, z1: 380, h: 420, floors: 9 },
  { x0: -640, x1: -360, z0: 520, z1: 900, h: 260, floors: 5 },
  { x0: -700, x1: -380, z0: 1000, z1: 1700, h: 560, floors: 13 },
  { x0: -620, x1: -360, z0: 1850, z1: 2600, h: 330, floors: 7 },
  // right side (street face = x0)
  { x0: 300, x1: 700, z0: 120, z1: 640, h: 300, floors: 6 },
  { x0: 330, x1: 640, z0: 760, z1: 1300, h: 600, floors: 14 },
  { x0: 360, x1: 700, z0: 1450, z1: 2300, h: 380, floors: 8 },
];

function proj(x, y, z) {
  const k = F / (F + z);
  return [VP.x + x * k, VP.y + y * k];
}
const pt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const seg = (a, b) => `M${pt(a)} L${pt(b)}`;

function buildDrawing() {
  const massing = [];
  const floors = [];
  const mullions = [];
  BOXES.forEach((b) => {
    const top = GROUND - b.h;
    const face = b.x1 < 0 ? b.x1 : b.x0; // street-facing side
    const back = b.x1 < 0 ? b.x0 : b.x1;
    const c = (x, y, z) => proj(x, y, z);
    // front face
    massing.push(seg(c(back, GROUND, b.z0), c(face, GROUND, b.z0)), seg(c(face, GROUND, b.z0), c(face, top, b.z0)), seg(c(face, top, b.z0), c(back, top, b.z0)), seg(c(back, top, b.z0), c(back, GROUND, b.z0)));
    // street face and roof
    massing.push(seg(c(face, GROUND, b.z0), c(face, GROUND, b.z1)), seg(c(face, top, b.z0), c(face, top, b.z1)), seg(c(face, GROUND, b.z1), c(face, top, b.z1)), seg(c(back, top, b.z0), c(back, top, b.z1)));
    const fh = b.h / b.floors;
    for (let i = 1; i < b.floors; i += 1) {
      const y = GROUND - i * fh;
      floors.push(seg(c(face, y, b.z0), c(face, y, b.z1)), seg(c(face, y, b.z0), c(back, y, b.z0)));
    }
    const bays = Math.max(3, Math.round((b.z1 - b.z0) / 70));
    for (let j = 1; j < bays; j += 1) {
      const z = b.z0 + ((b.z1 - b.z0) * j) / bays;
      mullions.push(seg(c(face, GROUND, z), c(face, top, z)));
    }
    const fb = Math.max(2, Math.round(Math.abs(face - back) / 70));
    for (let j = 1; j < fb; j += 1) {
      const x = back + ((face - back) * j) / fb;
      mullions.push(seg(c(x, GROUND, b.z0), c(x, top, b.z0)));
    }
  });
  // construction lines to the vanishing point
  const sketch = [];
  [[-1300, GROUND], [1300, GROUND], [-1300, -520], [1300, -520], [-330, GROUND], [300, GROUND]].forEach(([x, y]) => sketch.push(seg(proj(x, y, 0), [VP.x, VP.y])));
  sketch.push(`M0 ${VP.y} L1200 ${VP.y}`);
  // street and sidewalk lines
  const ground = [];
  [-250, -120, 0, 120, 250].forEach((x) => ground.push(seg(proj(x, GROUND, 0), proj(x, GROUND, 3200))));
  for (let z = 0; z < 3000; z += 260) ground.push(seg(proj(-6, GROUND, z), proj(-6, GROUND, z + 110)), seg(proj(6, GROUND, z), proj(6, GROUND, z + 110)));
  return { sketch: sketch.join(" "), ground: ground.join(" "), massing: massing.join(" "), floors: floors.join(" "), mullions: mullions.join(" ") };
}

function Drawing({ phase = 5, animate = false, className = "" }) {
  const d = useMemo(buildDrawing, []);
  const on = (p) => (phase >= p ? " is-on" : "");
  return (
    <svg className={`drawing${animate ? " animate" : ""} ${className}`} viewBox="0 120 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path className={`ln ln-sketch${on(0)}`} d={d.sketch} />
      <path className={`ln ln-ground${on(1)}`} d={d.ground} />
      <path className={`ln ln-mass${on(1)}`} d={d.massing} />
      <path className={`ln ln-floor${on(2)}`} d={d.floors} />
      <path className={`ln ln-mull${on(3)}`} d={d.mullions} />
      <g className={`dims${on(4)}`}>
        <path d={`M${proj(-330, GROUND + 40, 0)[0]} ${proj(-330, GROUND + 40, 0)[1]} L${proj(300, GROUND + 40, 0)[0]} ${proj(300, GROUND + 40, 0)[1]}`} />
        <path d={`M${proj(-330, GROUND + 20, 0)[0]} ${proj(-330, GROUND + 20, 0)[1]} l0 40 M${proj(300, GROUND + 20, 0)[0]} ${proj(300, GROUND + 20, 0)[1]} l0 40`} />
        <text x={(proj(-330, 0, 0)[0] + proj(300, 0, 0)[0]) / 2} y={proj(0, GROUND + 40, 0)[1] - 8} textAnchor="middle">STREET</text>
        <circle cx={VP.x} cy={VP.y} r="5" />
        <text x={VP.x + 10} y={VP.y - 10}>V.P.</text>
      </g>
      <g className={`stamp${on(5)}`} transform="translate(860 440) rotate(-8)">
        <rect x="-92" y="-30" width="184" height="60" rx="4" />
        <text y="-6" textAnchor="middle">FINAL INSPECTION</text>
        <text y="16" textAnchor="middle" className="stamp-sub">APPROVED</text>
      </g>
    </svg>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="wrap nav-row">
        <a href="#top" className="brand" aria-label="AXIOM Architecture, home"><img src={logo} alt="AXIOM Architecture" width="312" height="88" /></a>
        <nav className={`nav${open ? " is-open" : ""}`} aria-label="Main">
          {NAV.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          <a className="nav-phone" href={`tel:${PHONE_TEL}`}><Phone size={15} aria-hidden="true" /> {PHONE}</a>
        </nav>
        <button type="button" className="menu-btn" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="sheet">
          <div className="sheet-grid" aria-hidden="true" />
          <Drawing animate className="hero-drawing" />
          <div className="hero-copy">
            <span className="label">Architecture &amp; design · Owensboro, Kentucky</span>
            <h1>Design solutions that <em>enrich</em> your environment.</h1>
            <p>AXIOM Architecture combines teamwork, professional project management and a creative approach on every project, with you from the first draft to the final inspection.</p>
            <div className="hero-cta">
              <a className="btn btn-dark" href="#contact">Talk about your project <ArrowRight size={18} /></a>
              <a className="btn btn-line" href={`tel:${PHONE_TEL}`}><Phone size={17} /> {PHONE}</a>
            </div>
          </div>
          <dl className="title-block">
            <div className="tb-firm"><dt>Architect</dt><dd>{LEGAL}</dd></div>
            <div><dt>Address</dt><dd>{ADDRESS[0]}, Owensboro, KY</dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${PHONE_TEL}`}>{PHONE}</a></dd></div>
            <div><dt>Sheet</dt><dd className="tb-sheet">A-000</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function SheetHead({ num, label, title, intro }) {
  return (
    <div className="sec-head">
      <div className="sec-tag"><span className="sheet-num">{num}</span><span className="label">{label}</span></div>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function Approach() {
  return (
    <section className="approach" id="approach">
      <div className="wrap approach-grid">
        <SheetHead num="A-001" label="Our mission" title="We design solutions and enrich our clients' environment." />
        <div className="mission">
          <p className="lead">As our client, you get the individual attention you need during every phase of the project. Our commitment to exceeding expectations is why we stand apart.</p>
        </div>
      </div>
      <div className="wrap principles">
        {PRINCIPLES.map(({ icon: Icon, sheet, title, text }) => (
          <article key={title} className="principle">
            <span className="p-num">{sheet}</span>
            <Icon size={28} strokeWidth={1.4} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const [phase, setPhase] = useState(0);
  const p = PHASES[phase];
  return (
    <section className="process" id="process">
      <div className="wrap">
        <SheetHead num="A-101" label="From first draft to final inspection" title="We're at your side through every phase." intro="Step through a project. Each phase adds a layer to the drawing, the same way your building comes together." />
        <div className="process-grid">
          <div className="phase-list" role="tablist" aria-label="Project phases">
            {PHASES.map((ph, i) => (
              <button key={ph.code} type="button" role="tab" aria-selected={i === phase} className={`phase-btn${i === phase ? " is-active" : ""}${i < phase ? " is-done" : ""}`} onClick={() => setPhase(i)}>
                <span className="phase-code">{ph.code}</span>
                <span className="phase-title">{ph.title}</span>
                {i < phase && <Check size={16} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="phase-stage">
            <div className="phase-sheet">
              <div className="sheet-grid" aria-hidden="true" />
              <Drawing phase={phase} className="phase-drawing" />
              <span className="phase-tag">PHASE {String(phase + 1).padStart(2, "0")} / {String(PHASES.length).padStart(2, "0")}</span>
            </div>
            <div className="phase-copy" aria-live="polite">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <div className="phase-nav">
                <button type="button" onClick={() => setPhase((v) => Math.max(0, v - 1))} disabled={phase === 0} aria-label="Previous phase"><ChevronLeft size={20} /></button>
                <button type="button" onClick={() => setPhase((v) => Math.min(PHASES.length - 1, v + 1))} disabled={phase === PHASES.length - 1} aria-label="Next phase"><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="team" id="team">
      <div className="wrap team-grid">
        <SheetHead num="A-201" label="Who you'll work with" title="Talk directly to the architects." intro="Reach Ben Grove or Aaron Nacey directly by email, or call the office." />
        <div className="people">
          {PEOPLE.map((person) => (
            <article key={person.name} className="person">
              <span className="monogram" aria-hidden="true">{person.initials}</span>
              <div>
                <h3>{person.name}</h3>
                <a href={`mailto:${person.email}`}><Mail size={15} aria-hidden="true" /> {person.email}</a>
              </div>
            </article>
          ))}
          <a className="person person-call" href={`tel:${PHONE_TEL}`}>
            <Phone size={22} aria-hidden="true" />
            <div><span className="label">Office</span><strong>{PHONE}</strong></div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function InquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", location: "", timeline: "", notes: "", website: "" });
  const [status, setStatus] = useState("idle");
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json().catch(() => ({}));
      setStatus(r.ok && d.success ? (d.demo ? "demo" : "sent") : "error");
    } catch {
      setStatus("error");
    }
  }
  if (status === "sent" || status === "demo") {
    return (
      <div className="form-done" role="status">
        <Check size={34} />
        <h3>Thank you, {form.name.split(" ")[0] || "and welcome"}.</h3>
        <p>{status === "demo" ? `This concept's form isn't connected yet. Please call ${PHONE} or email ${EMAIL}.` : "We look forward to talking with you about your project."}</p>
      </div>
    );
  }
  return (
    <form className="i-form" onSubmit={submit}>
      <div className="row2">
        <label>Name<input required value={form.name} onChange={update("name")} autoComplete="name" /></label>
        <label>Phone<input required type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" /></label>
      </div>
      <div className="row2">
        <label><span>Email <small>(optional)</small></span><input type="email" value={form.email} onChange={update("email")} autoComplete="email" /></label>
        <label>Project location<input value={form.location} onChange={update("location")} placeholder="Town or address" /></label>
      </div>
      <div className="row2">
        <label>Project type
          <select value={form.service} onChange={update("service")}>
            <option value="">Choose one...</option>
            <option>New building</option>
            <option>Addition</option>
            <option>Renovation or reuse</option>
            <option>Interior work</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <label>Timeline
          <select value={form.timeline} onChange={update("timeline")}>
            <option value="">Choose one...</option>
            <option>Just exploring</option>
            <option>Within 6 months</option>
            <option>6–12 months</option>
            <option>More than a year</option>
          </select>
        </label>
      </div>
      <label>About the project<textarea rows={4} value={form.notes} onChange={update("notes")} placeholder="What should the building do? Site, size, budget, anything else..." /></label>
      <div className="hp" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} /></label></div>
      {status === "error" && <p className="form-err" role="alert">That didn't send. Please call {PHONE}.</p>}
      <button type="submit" className="btn btn-dark btn-wide" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send project details"} <ArrowRight size={18} /></button>
    </form>
  );
}

function Contact() {
  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowMap(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <SheetHead num="A-501" label="Questions?" title="We look forward to talking with you about your project." />
        <div className="contact-grid">
          <div className="contact-info">
            <a className="big-phone" href={`tel:${PHONE_TEL}`}>{PHONE}</a>
            <a className="addr" href={MAP_URL} target="_blank" rel="noopener noreferrer"><MapPin size={18} aria-hidden="true" /><span>{COMPANY}<br />{ADDRESS[0]}<br />{ADDRESS[1]}</span></a>
            {PEOPLE.map((p) => <a key={p.email} className="mail" href={`mailto:${p.email}`}><Mail size={16} aria-hidden="true" /> {p.name} · {p.email}</a>)}
            <div className="map">
              <span className="map-ph">2625 Frederica St · Owensboro</span>
              {showMap && <iframe title="Map to AXIOM Architecture, 2625 Frederica Street, Owensboro" src={`https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=15&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
            </div>
          </div>
          <div className="form-sheet">
            <span className="label">Project inquiry</span>
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-block">
          <div className="fb-logo"><img src={logo} alt="AXIOM Architecture" width="312" height="88" loading="lazy" /></div>
          <div className="fb-cell"><span className="label">Firm</span><strong>{LEGAL}</strong></div>
          <div className="fb-cell"><span className="label">Office</span><span>{ADDRESS[0]}, {ADDRESS[1]}</span></div>
          <div className="fb-cell"><span className="label">Contact</span><a href={`tel:${PHONE_TEL}`}>{PHONE}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
          <div className="fb-cell fb-nav"><span className="label">Sheets</span>{NAV.map(([l, h]) => <a key={h} href={h}>{l}</a>)}</div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} {LEGAL} · Concept redesign by Blueprint WebStudio · Independent concept, not for official use</span>
          <StudioCredit />
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Approach />
        <Process />
        <Team />
        <Contact />
      </main>
      <Footer />
      <ConceptWidget company={COMPANY} abbr={ABBR} endDate={END_DATE} />
    </>
  );
}
