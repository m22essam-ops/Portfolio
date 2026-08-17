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

### Hero mechanic (REPLACES the slot machine AND the three-version shuffle)

The hero is a **word chain**: six short sentences (`hero.sentences` in
content.js), one shown at a time. Each sentence ends with its clickable word
— the LAST word, detected automatically (trailing punctuation stripped, no
brackets needed). Clicking it glitch-transitions to the next sentence, which
begins with that same word. The **last sentence ends the chain**: clicking
its word ("work") smooth-scrolls to the work section instead of advancing.
A small mono **"↺ back to the start"** control sits under the hero — it
only appears on the **last sentence**, clicking it glitches back to the
first sentence, so the chain loops by choice. The echoed opening word (the previous sentence's
click word) renders dimmed in italic. Owner-approved copy, Aug 2026.

The chain rule the owner must keep while editing: sentence N+1 opens with
sentence N's last word; the last sentence's last word is the "go to work"
word, so it should read naturally as leading into the work below.

The hero reserves the height of its longest sentence once on load, so the
page below never jumps when a shorter sentence shows.

Transition: character scramble ("glitch") that resolves left-to-right over
~1000ms, with an RGB-split text-shadow using the two accent colors, plus a
small shake. Resolving left-to-right matters: it reads as *recovering from
corruption*, not as randomizing. The site must never look like it generates
its own copy.

**The slot machine and the three-version keyword shuffle are retired.** Don't
reinstate them. Light mode is gone too: the site is dark-only, the nav toggle
was removed.

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

Warm editorial (owner-approved Aug 2026). Deep espresso `#12100D` background,
warm cream `#F1E9DE` text, caramel `#C97B2E`/`#E8A35A` primary accent, soft
sage `#6E8468`/`#8FA87E` secondary (the produced/presented tab colors). Real
grain photo as the single atmosphere layer at 0.10 opacity — the scratches,
vignette, curtain, and feature-band layers were removed (A+ decision).
Mood reference: old cinema poster, warm film, editorial coffee-shop.

Type pairing (redesigned Aug 2026, owner-approved): **Fraunces** is the
display voice — hero (weight 400, "Quiet" treatment), section headings,
card titles, project titles, contact line, next-project link, footer
wordmark. **Space Mono** is the system voice — logo, nav, labels, meta,
index numbers, toggles, footer line. **Inter** is body copy. Architects
Daughter was removed (it was loaded but never used). Fraunces is loaded
on all four pages from Google Fonts.

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
2. Hero: the word chain — six short sentences, click the last word to advance (above)
3. Full-width horizontal band (divider / image strip)
4. Section heading: "A handpicked selection of my work"
   NOTE: owner's sketch spells it "handpiked". That is a typo, use "handpicked".
5. **Two side-by-side columns**, not tabs:
   - Left column: work **that got produced** (real, made, shipped)
   - Right column: work **that got pitched** (spec / school / unsold)
   Owner's sketch labels these "that produced" / "Just presented". Tighten the
   wording but keep the distinction, it is the honest and interesting split.
6. Project cards in each column, captioned "Client — Project title".
   Counts are capped by `work.producedLimit` / `work.presentedLimit`
   (0 = show all), editable in admin. Projects with `draft: true` never
   render on the site (admin checkbox "Keep in drafts").
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

## Project inventory (ported from mohammedessam.com, in content.js)

All 18 live-site projects are ported and split into produced/presented.
Sort rule: a project credited "Miami Ad School / Teacher" on its live page
is presented; agency-era work is produced. Flags for the owner:
Wedding Rush (not on live site), Tuborg (inferred school), Pringles
Champions of Fun / Modon / Song for the Cashless (inferred produced),
Red Expo (unknown, conservative pick). See PROJECT-NOTES.md.

## Known open items

- Work thumbnails are all picsum placeholders. Needs real campaign screenshots
  (owner drops files in `images/` and names them in admin.html).
- Project stories/credits are empty except the Wedding Rush placeholders.
- `work/yango-wedding-rush.html` and `project-template.html` are retired.
- All content is edited via admin.html or by hand in content.js.

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
