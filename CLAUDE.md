# Mohammed Essam — Copywriter Portfolio

Personal portfolio site for Mohamed Essameldeen, a senior creative copywriter
(7+ yrs: Social Nuts Cairo → We Are Social Dubai → Yango MENA, now Miami Ad
School Madrid). Existing live site: mohammedessam.com. This is its replacement.

## Stack (do not change without asking)

Plain HTML + CSS + vanilla JS. **No build step, no framework, no npm.**
This was a deliberate choice: the owner previews by double-clicking
`index.html` and opening it as a `file://` URL. Anything requiring a dev
server or bundler breaks his workflow. Do not suggest React/Tailwind/Vite.

## Files

- `index.html` — the ticket. Full screen, no scroll, no nav bar.
- `work.html` — dual mode: work index, or one project page when given `?slug=`.
- `about.html` — bio, skills, work experience.
- `content.js` — all site content. Single source of truth.
- `admin.html` — the editor. Covers the ticket, jokes, stickers and projects.
- `site.js` — shared helpers (`imgSrc`, scroll reveals).
- `auto-refresh.js` — reloads the page when content.js changes. Local only.
- `local-server.py` — serves the folder on :8888 and gives admin its save endpoint.
- `styles.css` — all styling, shared by every page.
- `about-photo.jpg` — real childhood photo used as the About portrait.
- `images/` — the owner's own uploads.
- `images/live/` — 84 files crawled from mohammedessam.com (Aug 2026), resized
  to max 1800px. Referenced from content.js as `live/name.jpg`.
- `PROJECT-NOTES.md` — longer handoff notes.

Retired and not in use: `contact.html`, `project-template.html`,
`work/yango-wedding-rush.html`, `grain-bg.png`, the `preview-*.html`
exploration files, `ticket-mockup.html`.

## The core concept

"**Award-losing copywriter (so far)**". Self-deprecating, dry, anti-life-coach,
anti-hustle-culture. Never earnest, never corporate, never motivational.
The line is the owner's own, taken from his live site's About page.

Known risk, raised and overruled by the owner (Aug 2026): awards are hiring
currency in adland, so leading with "I have none" announces a deficit nobody
was going to check, and "lottery" sells luck when the product is craft. The
owner chose to keep it. Do not re-litigate it; do not quietly soften it either.

### The ticket (home page) — REPLACES the word chain, the slot machine, and the shuffle

The home page is one full-screen lottery ticket. No scroll. Nav lives inside
it as three punch boxes. Every line of it reads from `ticket` in content.js.

**The full-width scratch panels are gone** (Aug 2026). They demanded labour and
paid a joke, they failed on mobile, and they hid the best fact on the site. The
proof line is printed in the open now. Do not bring those back.

**ONE scratch survives, and it is the exception that proves the rule** (owner's
idea, Aug 2026): the third nav punch is under foil. A CD scratches it expecting
a prize and it says "Hire me?". This one works because it hides a *punchline*,
not information, and the punchline is the call to action. It can never lock
anyone out: a click without dragging opens it, keyboard focus opens it, it stays
open on later visits via localStorage, and it never covers at all when the
browser lacks canvas or the visitor asked for reduced motion. Keep every one of
those escape hatches if you touch it.

**The awards switch.** `ticket.awards` is an array. Empty, the site runs the
"award-losing" version. Add an award and the home page flips itself to a
correction-notice state (`wonBand` / `wonBadge` / `wonTitleTop` /
`wonTitleBottom` / `wonLine`) and prints what was won. This exists because the
concept is otherwise destroyed by the thing the owner is working toward.
Verified working both ways.

### The quiet jokes

`jokes` in content.js holds six optional slots: browser tab title when the
visitor switches away, footer small print, the next-project label, the 404
line, the empty-grid line, and one console line. Any slot left empty goes
silent. The current text is Claude's draft and is waiting on the owner.


## Copy rules

- Owner writes the lines. Claude drafts, owner approves or kills.
- Style: famous proverb/quote twisted literally into something bleak and
  personal. Deadpan, "Airplane!"-level absurdity. Single sentence, short.
- Every hero sentence ends with its click word (the last word). Each sentence
  after the first MUST open with the previous sentence's last word — that
  chain is the whole mechanic. The click word is detected automatically.
- No em dashes anywhere in copy. Owner dislikes them.
- Don't silently replace a line the owner rejected. Flag it and ask.

## Art direction

**Red, flat, loud** (owner-approved Aug 2026). Two registers only:

- **Home**: flat red field `#E3261A`, off-white ticket `#F6F3EE`, black type.
- **Everything else**: near-black `#0B0A09` gallery so the work carries the colour.

Accent red `#E3261A`, hot red `#FF3B2B` for hover.

**No halftone, no sunburst, no gold, no hard drop shadows, no grain, no
texture of any kind.** Those were tried and rejected: they are 1970s pastiche,
and pastiche reads as old. That was the owner's exact complaint, twice. Modern
loud is a single high-chroma accent, enormous type, a tight grid and a lot of
empty space. Keep it that way.

Pages other than the home are an **off-white gallery** (`--bg #F2EEE5`), not
dark: the campaign stills sit better on it and it reads more editorial. The
page palette is tokenised (`--bg/--fg/--line/--well`) so it flips in one place.

Type: **Syne** is the home headline and the proof line. **Bricolage Grotesque**
is display elsewhere (section headings, card titles, nav punches). **Barlow
Condensed** is the system voice (labels, serials, small print, stickers, and the
name in the ticket band). **Hanken Grotesk** is body copy.

Moniqa (Rajesh Rajput, SIL OFL 1.1) is first in the home headline stack and will
silently take over if anyone drops a font file into `fonts/`. It is deliberately
not committed: the download is script-gated and the mirrors repackage fonts.
The owner rejected Bodoni Moda as the stand-in; Syne replaced it and is the
intended look, not a placeholder.

The logo is plain text with **no red dot**. The trailing period used to be
wrapped in an `<em>` by site.js and coloured red. Removed 20 Aug 2026. Note
site.js rewrites `.logo` from `nav.logo` on every page, so editing the HTML
alone will not change it.

History worth knowing: earlier passes tried green-felt casino ("too 2009"),
warm-paper editorial, a distressed stamp-print look, and a warm espresso and
caramel palette with a grain photo. All rejected. Don't reintroduce them.


## Site layout

**index.html** — the ticket, full screen, no scroll:
band (owner's line, plus **MOHAMMED ESSAM** upper case on the right) →
game/serial microtype → badge → two-line headline → sub-line → tear rule →
the proof line → three nav punch boxes, the last one under scratch foil →
barcode + small print.

The name in the band is not decoration: the home page has no nav bar, so it is
the only thing on that screen identifying whose site it is. Do not remove it.

On landscape screens 900px and wider the ticket fills **95vw by 95vh** and the
body distributes its blocks down the height.

**work.html** — dual mode. No `?slug=` renders the work index; with a slug it
renders that project's page.

The work index is **ONE uniform grid**, two columns, 4:3, best first. The
produced/spec split was killed as a visitor-facing idea (Aug 2026): it made
people sort work by a criterion they don't care about and put the school work
in a labelled ghetto.

As of 20 Aug 2026 it is also gone from the **data**: there is one
`work.projects[]` array in site order, and each project carries `ran: true`
(produced) or `ran: false` (spec, school, unsold). The owner asked for this so
he could rank a spec piece above a produced one. `work.limit` caps how many
render, 0 = all. Admin shows a single list with Move up / Move down across the
whole thing and a tickbox for `ran`. Old two-array files still load: both
work.html and admin.html fold them into one list on read.

**The sticker carries the status instead.** Every project has a `sticker`
field: "Sold out in a week", "Never left the deck", "Won nothing". Short and
true. This was the owner's idea and it is better than the tabs were, because
it carries real information instead of a category.


## Project detail pages

Every card links to its own page. `project-template.html` is the pattern.
To add a project: duplicate the template, rename to a slug, fill it in.

Template structure: back link → meta line (client · category · year · status)
→ title → 2-4 short paragraphs (situation, insight, idea, result) → media
blocks → credits list → ONE "next project" link. The next-project link
auto-finds the next project in the combined list (produced + presented,
excluding drafts); on the last project it shows "BACK TO All Work →".

Status uses `.status-produced` (orange) or `.status-pitched` (teal) to match
the tab it came from. Labels are "PRODUCED" / "WORK".

Rules for project copy:
- Real results only. If there is no number, write nothing. Never
  "the results were awesome" or "it really resonated with the industry".
- One next-project link, never a grid of ten. The old site dumped ten
  "you may also like" links on every page; that is a dump, not curation.
- The strongest real result the owner has: Rivan Tower sold out in a week.
  That belongs high on the site, not buried.

## Project inventory (crawled from mohammedessam.com Aug 2026, in content.js)

**18 projects: 10 produced, 8 spec.** All copy, credits, years, images and
video links were pulled from the live Adobe Portfolio site and normalised.

Sort rule: credited to an agency (Social Nuts, Socialize, We Are Social,
Yango) is produced; credited to Miami Ad School or a teacher is spec.

Resolved in the crawl: three projects existed twice in content.js, once as an
empty picsum stub in `produced` and once filled in under `presented` (Tuborg,
Domino's, Babyshop). The filled-in versions were correct and the stubs are
gone. Oumph and Red Expo were added from the live site. A Middle Finger to the
Death was deliberately left out (a short story, not an ad) at the owner's call.
Babyshop is marked spec at the owner's call. All picsum placeholders are gone.

Where the owner had already uploaded his own images for a project (Tuborg,
Domino's, Canesten, Babyshop, Nothing), those were kept: they are better and
newer than the live site's versions. Only agency-era work uses `images/live/`.

## Known open items

- **All ticket copy, all stickers and all six jokes are Claude's drafts.**
  The owner writes the lines. These are placeholders awaiting his pass.
- Two facts flagged and unanswered: The Quarantine Games is dated **2020**
  here (it is a COVID lockdown fundraiser) but the live site says 2023; and the
  About bio says "**Four years** writing for people who skip the ads" while the
  experience list under it runs Feb 2019 to Aug 2025. Do not change his own
  copy to fix this. Ask.
- `content.js` also disagrees with the live site on Social Nuts: Feb 2019 here,
  Feb 2018 there.
- **22 of 25 videos are Adobe CCV embeds** tied to the owner's Adobe Portfolio
  account. Verified playing cross-origin. They die if he cancels that account.
  Re-hosting to Vimeo is the fix, not urgent.
- Liquid Death ("murder-your-thirst") is an empty stub with no image or story.
- The Quarantine Games has 4 animated GIFs totalling 47MB. No ffmpeg on the
  owner's machine, so they cannot be converted here.
- Adobe Portfolio content problems found in the Aug 2026 crawl and NOT copied
  across: keyboard-mash credits on Babyshop, "the results are awesome",
  "Babysop", "CANESTEEN" (brand is Canesten), "live in Iitt", "facedthe",
  and a Nivea credit reading "Art: Google images".

## Standing corrections (from the live site audit)

The owner's old site spells his name **8 different ways**, including
"Mohammed Esam" in the page title of all 19 pages. On this site it is always
and only "**Mohammed Essam**" (double M), lowercase "mohammed essam." in the
logo. This matches his domain, mohammedessam.com. **Owner's explicit decision,
Aug 2026 — it reverses an earlier instruction in this file that said single-M,
so do not "correct" it back.** Colleague names are spelled as the agency
credited them, fixed only for obvious typos.

Don't write vague result claims ("the results were awesome", "it really
resonated"). Either a concrete result or nothing.

## Don't

- Don't add a build step or framework.
- Don't use em dashes in user-facing copy.
- Don't reinstate the slot machine, the word chain, or the scratch panels.
- Don't reintroduce halftone, sunburst, gold, grain or drop shadows.
- Don't split the work grid into produced/spec tabs again. Stickers do that job.
- Don't replace rejected copy with substitutes without flagging it.
- Don't reintroduce stock photos as background atmosphere (the owner wants
  only his own supplied images; project thumbnails are the exception).
- Don't put ten "you may also like" links at the end of a project page. One.
- Don't write a result claim you can't back with a number.
