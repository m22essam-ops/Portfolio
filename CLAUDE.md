# Mohamed Essam — Copywriter Portfolio

Personal portfolio site for Mohamed Essameldeen, a senior creative copywriter
(7+ yrs: Social Nuts Cairo → We Are Social Dubai → Yango MENA, now Miami Ad
School Madrid). Existing live site: mohammedessam.com. This is its replacement.

## Stack (do not change without asking)

Plain HTML + CSS + vanilla JS. **No build step, no framework, no npm.**
This was a deliberate choice: the owner previews by double-clicking
`index.html` and opening it as a `file://` URL. Anything requiring a dev
server or bundler breaks his workflow. Do not suggest React/Tailwind/Vite.

## Files

- `index.html` — nav, hero (bio sentence mechanic), work columns, footer
- `about.html` — bio, skills, work experience
- `contact.html` — contact links
- `styles.css` — all styling, shared by every page
- `project-template.html` — pattern to duplicate for each project page
- `grain-bg.png` — real background texture photo (must sit beside the HTML)
- `about-photo.jpg` — real childhood photo used as About portrait
- `PROJECT-NOTES.md` — longer handoff notes

## The core concept

"**Award-losing copywriter (so far)**". Self-deprecating, dry, anti-life-coach,
anti-hustle-culture. Never earnest, never corporate, never motivational.

### Hero mechanic (REPLACES the old slot machine)

The hero is a long bio sentence with three keywords highlighted in the accent
color: **drafts**, **ads**, **awards**. Clicking a keyword glitch-transitions
to a different version of the bio that *leads* with that word. Three versions
total, each hand-written, each telling something different.

1. Twelve years of **drafts** nobody asked to read, four years of **ads**
   everybody paid to skip, and an **award** shelf so clean you could eat off it.
2. **Ads** are what they paid me for, **drafts** are what I actually wrote, and
   the **awards** went to whoever was in the room when the client said yes.
3. **Awards** never came, and neither did the luck, but twelve years of
   **drafts** and four years of skippable **ads** left me able to write anything
   you need by Thursday.

Version 1 is the default on load. Do not auto-cycle; it only changes on click.

Transition: character scramble ("glitch") that resolves left-to-right over
~600ms, with an RGB-split text-shadow using the two accent colors, plus a small
shake. Resolving left-to-right matters: it reads as *recovering from
corruption*, not as randomizing. That distinction is the whole point, because
the site must never look like it generates its own copy.

**The slot machine is retired.** Old jackpot reels, the 25 sentences, the lever,
and the reelWords/sentences objects are no longer the hero. Don't reinstate them.

## Copy rules

- Owner writes the lines. Claude drafts, owner approves or kills.
- Style: famous proverb/quote twisted literally into something bleak and
  personal. Deadpan, "Airplane!"-level absurdity. Single sentence, short.
- Every sentence MUST contain its 3 reel words verbatim (word-boundary match,
  case-insensitive). Highlighting sorts longest-first so LUCK never matches
  inside UNLUCKY.
- No em dashes anywhere in copy. Owner dislikes them.
- Don't silently replace a line the owner rejected. Flag it and ask.

## Art direction

Dark cinematic. Near-black `#0A0A0A`, off-white `#EDEDED` text, rust-orange
`#C2410C` primary accent, teal `#1F6F6B` secondary (used only for the SPEC
CLIENTS tab). Real grain photo as fixed background + film-scratch and vignette
overlays. Mood reference: Tarantino script meets Stephen King tension.

Type pairing: **Space Mono** for headlines, nav, and all mechanical/UI text.
**Inter** for body copy. **Architects Daughter** for the reel words only.

The slot machine is drawn in the style of a minimal New Yorker cartoon: thin
1.5px uniform ink line, no fills, no distress, no wobble, plus one small
cross-hatch shading accent bottom-right. The lever is pure CSS (a rotated
line + a round accent knob), no icon, no SVG.

History worth knowing: earlier passes tried a green-felt casino look ("too
2009"), a warm-paper editorial look, and a heavily distressed stamp-print
look. All rejected. Don't reintroduce them.

## Home page layout (per owner's wireframe)

Top to bottom:
1. Nav: logo left ("mohamed essam." lowercase), WORK + ABOUT centre,
   "AVAILABLE FOR WORK" + green pulsing dot right
2. Hero: the three-version bio sentence (above)
3. Full-width horizontal band (divider / image strip)
4. Section heading: "A handpicked selection of my work"
   NOTE: owner's sketch spells it "handpiked". That is a typo, use "handpicked".
5. **Two side-by-side columns**, not tabs:
   - Left column: work **that got produced** (real, made, shipped)
   - Right column: work **that got pitched** (spec / school / unsold)
   Owner's sketch labels these "that produced" / "Just presented". Tighten the
   wording but keep the distinction, it is the honest and interesting split.
6. Project cards in each column, captioned "Client — Project title"
7. Footer: giant MOHAMED ESSAM wordmark

The produced/pitched split replaces the old CLIENTS / SPEC CLIENTS tabs.
Keeping them visually parallel (both columns visible at once) is deliberate:
nothing is hidden behind a tab, and the contrast between the two columns is
itself the joke.

On mobile the two columns stack; label each stack clearly so the distinction
survives.

## Project detail pages

Every card links to its own page. `project-template.html` is the pattern.
To add a project: duplicate the template, rename to a slug, fill it in.

Template structure: back link → meta line (client · category · year · status)
→ title → 2-4 short paragraphs (situation, insight, idea, result) → media
blocks → credits list → ONE "next project" link.

Status uses `.status-produced` (orange) or `.status-pitched` (teal) to match
the column it came from.

Rules for project copy:
- Real results only. If there is no number, write nothing. Never
  "the results were awesome" or "it really resonated with the industry".
- One next-project link, never a grid of ten. The old site dumped ten
  "you may also like" links on every page; that is a dump, not curation.
- The strongest real result the owner has: Rivan Tower sold out in a week.
  That belongs high on the site, not buried.

## Known open items

- `index.html` still contains the retired slot machine. It needs rebuilding to
  the wireframe layout: bio-sentence hero + two produced/pitched columns.
- Work thumbnails are all placeholders. Needs real campaign screenshots.
- No project detail pages exist yet; only `project-template.html`.
- Card `href="#"` links need real destinations once the pages exist.
- Owner has ~16 real projects on mohammedessam.com to port over, and needs to
  sort each into produced vs pitched.

## Standing corrections (from the live site audit)

The owner's old site spells his name **8 different ways**. On this site it is
always and only "**Mohamed Essam**" in body/nav (lowercase "mohamed essam." in
the logo). Never introduce a variant. Same rule for any colleague name.

Don't write vague result claims ("the results were awesome", "it really
resonated"). Either a concrete result or nothing.

## Don't

- Don't add a build step or framework.
- Don't use em dashes in user-facing copy.
- Don't auto-cycle the bio sentence; it changes on click only.
- Don't reinstate the slot machine.
- Don't replace rejected copy with substitutes without flagging it.
- Don't reintroduce stock photos as background atmosphere (the owner wants
  only his own supplied images; project thumbnails are the exception).
- Don't put ten "you may also like" links at the end of a project page. One.
- Don't write a result claim you can't back with a number.
