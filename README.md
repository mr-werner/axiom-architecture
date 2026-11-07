# AXIOM Architecture — Blueprint WebStudio Concept

Independent, non-official redesign concept for https://www.axiom-architecture.com/ (AXIOM Architecture, PLLC, Owensboro, KY).
Preview: https://axa.blueprintwebstudio.com (noindex; the demo code lives in the Neon `demos` table).

Custom one-page build: content in `src/App.jsx`, styles in `src/styles.css`, concept widget in `src/concept.jsx`.

## Local setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Deployment
Vercel project `axiom-architecture` (framework Vite, team mrwerner-s-projects); pushes to `main` deploy automatically. Domain `axa.blueprintwebstudio.com` is a CNAME at Porkbun (use the target Vercel shows).
Optional env vars: `VITE_CONCEPT_END_DATE` (defaults to 2026-12-12 23:59 Central), `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` for the project inquiry form (`api/contact.js`; demo mode without them).
The interest form posts to the same-origin `api/demo-interest.js` proxy (prospect "AXIOM Architecture", source/page `axa.blueprintwebstudio.com`).

## Design
- Logo: their original AXIOM wordmark with the building-in-the-O mark (331 × 104 PNG from the site), with the white background knocked out so it sits on the vellum header; on a vellum plate in the dark footer. Favicon is an SVG of the O-and-tower mark in their slate and pale blue.
- Palette: the logo's charcoal #3C3C3C, the current site's slate #323640 (process section, footer) and its pale heading blue #C2E6F9 / #9FC7E0 (blueline accents, sketch lines), deepened to #2F6A8E where blue text needs contrast, on a drafting-vellum off-white #F6F7F4.
- Fonts: Jost (headings and body; light geometric, close to the logo's letterforms and its wide-tracked "ARCHITECTURE"), Newsreader (lead paragraphs and the italic "enrich"; a nod to the Georgia on the old site), JetBrains Mono (sheet numbers, labels, title-block text).
- Motif: a set of construction drawings. The hero is a drawing sheet with a double border, a 24px drafting grid, a one-point-perspective street of buildings that draws itself in (inspired by the wireframe header image on their current site, redrawn as SVG) and a real title block (firm, address, phone, sheet A-000). Each section is a sheet with a section-symbol number (A-001 Mission, A-101 Process, A-201 Team, A-501 Contact), and the footer is a title block.
- Signature section: "From first draft to final inspection", their own promise turned into an interactive phase stepper. Each of six phases adds a layer to the same drawing (construction lines, massing, floors, mullions, dimensions) until a "Final inspection · Approved" stamp lands.
- Section order: header with phone → hero drawing sheet → mission + three principles (teamwork, project management, creative approach, from their mission statement) → process stepper → team (Ben Grove, Aaron Nacey, office line) → contact with map and project inquiry form → title-block footer.

## What changed from the current site
- The site is a one-page IONOS MyWebsite page with no mobile viewport tag, so on a phone it renders as a 940px-wide desktop page that has to be pinched and zoomed. The concept is responsive (checked at 1280px and 390px with no sideways scrolling).
- The navigation bar under the header is empty, and the only other page (Sitemap) lists nothing. The concept has a working menu.
- The phone number (270.663.1256) is plain text, so it can't be tapped. Every phone number in the concept is a tap-to-call link.
- There is no way to send project details other than email. The concept adds a project inquiry form (type, location, timeline) and a map to 2625 Frederica Street.
- The page is three sentences of copy next to two renderings (a glass office tower and a row of townhouses) that aren't labeled as AXIOM projects. The concept doesn't reuse them; it uses drawn line art and leaves room for real project photos.
- The mission statement and the "first draft to final inspection" promise are kept and made the centre of the page.

## Photos
None. The current site's two renderings and the wireframe header look like template stock and are not labeled as AXIOM work, so they are not used. All artwork is SVG line drawing made for the concept. Real project photos (with names and locations) would be the biggest improvement.
Badges: none on the current site, so none are shown.

## Owner should confirm
- Whether Aaron Nacey is still with the firm (a NELSON Worldwide press release on informedinfrastructure.com says an Aaron Nacey who "co-founded and operated a Kentucky-based architecture firm" joined NELSON Worldwide). If not, remove him and his email.
- Titles for Ben Grove and Aaron Nacey (none are on the site, so none are shown), and photos of them.
- The six project phases and their descriptions (First conversation, First draft, Design development, Construction documents, Permits & bidding, Construction to final inspection). The site only says "all phases of the project, from the first draft to the final inspection"; the phase names are standard architectural phases written for the concept.
- The three principle descriptions (expanded from the mission statement's "team work, professional project management, and a creative approach").
- The project types and timeline options in the inquiry form.
- What kinds of projects they do and where (residential, commercial, institutional; Owensboro only or wider), and a list of past projects with photos to add a portfolio section.
- Office hours (none on the current site, so none are shown).
- Reviews: none on the current site, so none are shown and no Google rating is quoted.
