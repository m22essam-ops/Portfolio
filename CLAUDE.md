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
  Two save buttons. **Save locally** writes this folder only. **Save to GitHub**
  writes GitHub *and* this folder, via the same `saveToFolder()` helper. It did
  not always: until 21 Aug 2026 it wrote GitHub alone, so a save could land
  correctly on the live site while the owner's own preview still showed the old
  text, which reads exactly like a failed save. Keep both destinations on that
  button. The status line after a save says what happened to each.

### Why a save could look like it did nothing (fixed 21 Aug 2026)

Two separate causes, both reported by the owner as "I press save to GitHub and
nothing happens". Neither was the save failing. Both are fixed; don't undo them.

1. **The save did not touch his folder** (above). Fixed by one `saveToFolder()`.
2. **GitHub Pages serves `content.js` with `cache-control: max-age=600`.** For
   ten minutes after a save the live site kept handing out the previous words.
   Measured: a plain request returned a fifty-minute-old copy while the same
   file, asked for with a query string, came back current.
   All four pages that load content.js now write their own script tag with a
   stamp that changes every minute (`content.js?v=<minutes>`). **The stamp is
   added only on http/https** so `file://` gets exactly the tag it always had
   and the double-click preview cannot regress.
- `design.html` — the home designer. A canvas for the ticket: drag, resize,
  delete, add. Writes only `layout` into content.js. Needs the local server.
- `site.js` — shared helpers (`imgSrc`, scroll reveals).
- `auto-refresh.js` — reloads the page when content.js changes. Local only.
- `local-server.py` — serves the folder on :8888 and gives admin its save endpoint.
- `styles.css` — all styling, shared by every page.
- `favicon.svg` — the game number on the ticket's red. Every page links it.
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

### The home designer (added 21 Aug 2026)

`design.html` is a drag-and-drop canvas for the home page. The owner asked for
it in those words: boxes he can drag and resize, delete an element, add boxes
or images. He was told the trade first, that absolute positions describe one
screen and would need a hand-built phone layout, and **he chose the free canvas
anyway**. Do not re-litigate it. The compromise is in the units, not the freedom.

**Every position is a percentage of the ticket, never a pixel.** The ticket
then scales as one piece and a composition made on one screen holds its
proportions on every other. `layout.desktop` is used on a wide landscape
screen, `layout.mobile` below 900px.

**An artboard with no items falls through to the hand-built flow layout.** So:
no `layout` in content.js means the page is exactly what the stylesheet says,
an untouched phone keeps the layout tested down to 360px, and deleting
`layout` puts everything back. Verified byte-identical through a full save
round trip. `applyLayout()` in index.html is the whole engine; the flow
wrappers are neutralised with `display:contents` so the real elements, and
their scripts, keep working.

**One line, one box.** The game line used to share a box with the serial, his
line with the award badge, the two halves of the headline with each other, and
all three punches with one another. He asked for them apart, and he was right:
moving one moved the rest, and the note above the covered tab could not be
selected at all. The boxes are now `game`, `serial`, `name`, `band`, `badge`,
`titleTop`, `titleBottom`, `sub`, `scratchNote`, one per punch (`nav0`, `nav1`,
…, built at run time from `ticket.nav`), `stamp`, `barcode`, `terms`, `won`.
The four old wrappers are `display:contents` on the canvas; inherited type
still passes through them, so each voice survives. **Do not put `data-slot` on
a wrapper** — an unplaced slot is `display:none`, which takes its children
with it.

**He can type on the canvas.** Double-click a box made of words, or use the
words field in the inspector. So `design.html` writes copy as well as layout,
and can no longer claim to touch only `layout`. It keeps the surgical
property a different way: every change is held as a path and a value in
`EDITS` and applied one at a time on top of a fresh read of content.js, so a
field it never touched is never written. Note the page sets its words once at
load: `applyLayout()` only moves things, so `paintSlotText()` has to update
the element too.

Things that will bite anyone changing this:

- **A layout naming boxes the page no longer has is ignored, not half-placed.**
  If under three quarters of the slots find their element, `applyLayout()`
  drops the whole artboard and lets the stylesheet lay the page out. Half-
  placing it would leave a ticket with most of its words missing, because an
  unplaced slot is hidden. The designer migrates such a layout on open, by
  measuring where each piece actually sat inside its old block and mapping
  that share into the box he drew, so a composition made before the split
  survives it. His did.
- **Shift holds the shape while resizing.** Holding the ratio of the two
  percentages holds the real one: the ticket's width and height cancel out of
  pixH/pixW. Only deciding which side he pulled harder needs pixels.

- **The artboard must be told its height.** Every child is absolute, so there
  is no content left to give the ticket a height. Above 900px the stylesheet
  already pins 95vh and this never shows; below it the ticket collapsed and
  the headline, sized as a percentage of that height, came out at 1.6px.
  `.ticket.is-canvas{min-height:...}` at every width is load-bearing.
- **Measure only after the frame has settled.** The ticket's type is sized
  against the viewport, so a capture taken while the designer's iframe is
  still at the browser's default 300x150 reads the headline as 24px instead
  of 90px. `whenSettled()` waits for the size, the webfonts and a paint.
- **Handles are drawn from `offsetLeft/Width`, not `getBoundingClientRect`.**
  The rect of a rotated element is the box *around* the rotation, so a turned
  stamp gets a frame bigger than itself.
- The headline's fit-to-box safety net survives: the artboard size is the
  starting point and `fitTitle()` still shrinks it to fit its own box.

`design.html` only ever writes `layout`: it re-reads content.js off disk at
save time, drops `layout` in and writes it back, so it cannot eat a field that
admin holds. It shares admin's GitHub connection (same localStorage key).

A box on the canvas is a hard box, but type inside it still needs the height
it needs, so a box dragged too short spills rather than clips. The designer
says which elements are spilling instead of leaving him to spot it.

### The cabinet (awards.html, added 21 Aug 2026)

The "Won nothing" badge on the ticket is a claim, so it opens and shows you.
`awards.html` is an isometric display case drawn as inline SVG: glass doors
that swing, three empty shelves. Then "Nothing to show for now" and "come back
in a few" with three buttons. **Minutes** answers "Are you mental?", **days**
puts one thing on a shelf, **years** fills it with twenty.

The trophies are **unnamed silhouettes on purpose** (his call). Real award
names next to his own name would read as a claim the moment anyone screenshots
the page out of its joke. Do not label them.

Gotcha: a trophy's place on the shelf is an SVG `transform` attribute and its
arrival is a CSS transform, and **a CSS transform replaces the attribute rather
than adding to it**. With both on one `<g>` all twenty landed in a heap outside
the case. Position lives on an outer group, animation on an inner one.

All the copy is in `ticket.cabinet` and is Claude's draft, awaiting his pass.

### Per-page colour

Each page keeps the palette and gets its own paper plus one quiet mark, set by
a body class: `page-work` (registration cross), `page-about` (a run of
perforations down the left edge), `page-awards` (a rule at shelf height). The
marks are drawn in the page's own `--well` so they never fight the work. Only
`--bg` and `--well` change; the red and the type do not.

### Work that worked

The second punch is `work.html?ran=1`, which filters on the `ran` flag. Which
side a project falls on is the "It got produced" tickbox inside each project in
admin, so he moves a piece across by ticking a box. **This is the produced/spec
split returning as a door rather than as tabs over one grid.** It was killed as
tabs in Aug 2026 for reasons that still hold; he asked for it back in this form
on 21 Aug and that decision stands. The plain work page is still everything,
best first, one grid. There is a link back to it from the filtered view.

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

**index.html** — the ticket, full screen, no scroll (restructured 20 Aug 2026
for less density):
black band (owner's line left, red badge right) → game/serial microtype →
**MOHAMMED ESSAM** on its own big line → two-line headline → a row holding the
sub-line on the left and **the seal** on the right → three nav punch boxes, the
last under scratch foil with `ticket.scratchNote` printed as its caption →
barcode + small print.

The name is not decoration: the home page has no nav bar, so it is the only
thing on that screen identifying whose site it is. Always upper case (the page
forces it). Do not remove it.

**The headline sizes itself.** `fitTitle()` in index.html measures each line and
shrinks the type until the longest one fits the ticket. It exists because the
owner rewrites that line from admin and "copywriter" already ran off the edge on
a phone. `.tk-title span` is `white-space:nowrap` on purpose: the measurement is
meaningless if the browser is allowed to wrap. It loops a few times because
display faces with an optical-size axis change width as the size changes, so one
pass of arithmetic lands short.

### The seal (added 20 Aug 2026)

The owner asked for one visual element on the home page: "stamp, sticker, an
image of mine, my face illustrated, something". It is a lottery validation
stamp, drawn as inline SVG in index.html: two rings, a line of type turning
slowly round the outside on an SVG `textPath`, and a mark in the middle.

It is vectors and not a picture on purpose. There is no photograph of him in the
repo except the childhood one on the About page, nothing to download, and it
stays sharp at any size. It obeys `prefers-reduced-motion` by standing still.

All of it reads from content.js: `sealRing`, `sealTop`, `sealMark`, and the won
variants `wonSealRing` / `wonSealTop` / `wonSealMark`. **Blank the ring and the
whole seal removes itself.** The ring text repeats until it nearly closes the
circle and `textLength` stretches it the rest of the way, so any line he writes
fits. When an award is added the seal validates itself: the middle fills solid
red and the mark reverses out.

Content is *provenance*, not another joke: Cairo · Dubai · Madrid round the
outside, game no. 13 in the middle. The page already says "award-losing",
"0 awards so far" and "odds historically high"; a fourth way of saying he has
won nothing would have been a stutter. **If a photo or an illustrated portrait
ever replaces it, that is the slot it goes in.**

Retired in the same pass: the tear rule, and the `.proof` block with its
`winLine`/`winSub` fields. `winSub` survives as `ticket.scratchNote`, sitting
on the covered box. `wonLine` now takes over the sub-line when an award is
added, instead of the removed proof line. Awards switch re-verified after.

**Note the home carries no concrete result any more.** "Rivan Tower sold out
in a week" was the strongest fact on the site and it is now only on the work
page. That was the owner's choice, twice over. Do not reinstate it silently.

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

### The stub (the footer, rebuilt 20 Aug 2026)

The old footer was a rule, one big line and two lines of grey small print. The
owner's complaint was that it "still looks like a website not a creative
portfolio", and he was right: it was the default agency footer.

It is now **the tear-off half of the same ticket the home page is**: a red
full-bleed block with a scalloped tear along the top, off-white type, and the
wordmark running the full width and bleeding off the bottom edge. Red on the
off-white gallery pages is deliberate, it is the one loud moment on them and it
rhymes with the home screen.

**It is built by `site.js`, not by any page's HTML.** work.html, about.html and
every project page carry only `<footer class="stub" id="siteFoot"></footer>`.
Edit it in site.js or it will only change on one page.

It is also where the contact details finally live. Before this the only way to
reach him from a page was one buried "Go on." mailto. The columns are generated
from `contact.links` and `contact.resume`, so adding a link in admin section 6
puts it in the footer. The mailto is pulled out of that list and set large as
the claim line.

Fields: `footer.keep`, `footer.big`, `footer.place`, `footer.line`,
`footer.mark`, plus `ticket.serial` and `ticket.terms` reused as the ticket
furniture. `footer.joke` is now **unused** (it fed the retired PG-13 rating
label); it is kept in content.js and labelled as unused in admin rather than
deleted, because it is his copy.

`.stub-mark` is measured and sized by script to run the exact width, for the
same optical-size reason as the home headline. The `vw` in the CSS is only the
fallback before that runs.

**Two footer lines say the same thing** and want the owner's pass:
`footer.line` "Copywriters reserved, I know." and `jokes.footer` "No copywriters
reserved." Both currently print, at opposite ends of the same row.


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

## Added 22 Aug 2026

Four things landed in one pass. Everything above this line is older and parts
of it have been overtaken; where the two disagree, this section is the newer.

### The way in (the intro)

The ticket's own perforation is punched across the red field, left to right,
and when the row is complete the field tears along it and the two halves
travel off, each carrying its scalloped edge away with it. About two seconds.

**It replaced two tumbling dice**, which were his idea ("can we just use a
couple of dice and the word loading.. for 2 seconds") and then his complaint,
the next day, in full: "the intro is soooooooooo bad!!!! Need to look elegant
and decent, like the cabinet." Do not put the dice back.

Four candidates were built in `preview-intro.html` and he picked this one over
a drawn hairline, a validation stamp that strokes itself on, and the game
number set enormous. It won on two counts: it is the only one made out of
something the site already owns, and it is the only one that is honestly a
*loading* screen, because the perforation crossing the screen is a progress
bar that does not look like one. **`preview-intro.html` still holds all four**
if the decision is ever reopened.

Built entirely by the inline script at the top of `index.html`. **The `.boot`
div in the HTML is an empty shell on purpose** — with JavaScript off nothing is
drawn and the page is exactly the page.

- **The ticket is never hidden.** It sits behind the two halves from the first
  frame and the tear uncovers it. There is no class anywhere whose removal the
  page's visibility depends on, and `fitTitle()` can measure the headline and
  the foil can be painted the whole time this is on top of them. Verified: the
  headline still measures and fits through the overlay.
- **The overlay carries no red of its own.** The two halves ARE the field.
  Give `.boot` a background as well and it parts to reveal more red, which is
  the trap a card wipe on this site fell into once already.
- Each half is `calc(50% + 1px)`. Two halves of an odd number of pixels leave
  a sub-pixel seam, and one hairline of paper down the middle before the
  perforation is punched gives the whole thing away.
- The punch is **a window that grows in `steps()` over a strip that does not
  move**, not an animated mask: the strip keeps its own width, so the holes are
  revealed one at a time instead of being stretched, and a growing width is
  understood by everything that has ever rendered CSS.
- The tear is eased **in**, not out. Paper holds, gives all at once, and then
  it is gone. An ease-out reads as two panels sliding, which is a slideshow.
- It tears once the perforation is complete **and** `window.load` has fired,
  whichever is later. Hard cap 3.4s so one slow embed cannot hold the page.
- **The whole sequence was divided by 1.15 on 23 Aug 2026 at his request**
  and now ends at 1.98s instead of 2.28s: punch 0.13s delay + 0.826s, tear
  triggered at 1270ms and running 0.713s, overlay gone 783ms after that.
  Those four numbers are one piece of choreography and must be scaled
  TOGETHER, or the punch stops landing before the tear starts. The 3.4s cap
  and the 6s panic exit are NOT scaled: they are safety nets, not beats.
- **`setTimeout(off, 6000)` is registered on the line directly after
  `is-booting` goes on `<html>`.** From that moment the page is under an
  overlay and a throw anywhere below would leave it there. That one line makes
  it impossible. It goes first and it does not move.
- Click, tap, key or scroll tears it early, and **completes the row of holes
  first**, so an impatient visitor gets the same gesture early rather than a
  half-punched ticket ripped in half.
- It plays **once per tab** (`sessionStorage.bootSeen`). He reloads this page
  all day from admin and the designer, and `auto-refresh.js` reloads it on
  every content change; a two-second screen on each of those taxes his own
  work. **`?intro=1` forces it** and is how to look at it again.
- **`prefers-reduced-motion` wins over `?intro=1`.** Asking for less motion is
  not a preference a query string gets to override. All six combinations of
  the three flags were checked.

### The work menu is a dropdown

Third attempt, and the first one that reads as a menu. Four things do that
work and all four are load-bearing: **a caret** on the parent so you know
there is something to open, **a panel with its own width**, **a notch**
pointing back up at the parent, and **rows that fill on hover**.

`.nav-menu` is the hit area and carries the bridging padding; `.nav-menu-in`
is the panel you can see and the notch hangs off it. The bridge is padding,
never margin: a margin makes the gap between link and panel dead ground and
the menu shuts as the pointer crosses it. Verified: every point from the
link's bottom edge to the bottom of the panel hit-tests inside `.nav-item`.

**Opening and closing is driven from `site.js`, not `:hover` alone, with a
260ms grace period on close.** A CSS-only menu has to be chased: the moment
`:hover` goes false, `pointer-events` flips to none in the same frame and the
panel cannot be re-entered even if the pointer comes straight back. That is
what "the menu disappears before I click it" was, twice. Keep the grace period.

**The one elevation on the site is this panel's shadow.** It is soft and
low-contrast, not the hard 1970s offset the art direction rules out. Without
any lift the panel reads as part of the page rather than over it.

The menu holds **one item**, Work that worked. The parent link is already the
all-work page, so listing "All work" under it said the same thing twice.

### Two grounds, one mark

- **All work** keeps the ordinary paper `#EFE9DC` and the registration cross.
- **Work that worked** is `page-work-ran`, a light dusty blue `#CFDCE6`.
  `#A3BAD1` was tried on 22 Aug and rejected as too heavy.
- A ticked box was added to Work that worked in the same pass **and removed at
  his call the same day**. The colour is the difference; that is enough. Don't
  put the tick back.
- `work.ranNote` is the line under the Work-that-worked heading. It is his to
  write and currently holds a placeholder.

### A second language (built 22 Aug 2026, REMOVED 26 Aug 2026)

The site carried Japanese on two pages for four days: the About page
(`about.ja`) and the Rivan Tower project (`work.projects[].ja`), with
`i18n.ja` holding the furniture round them and an EN | JA switch drawn only
where a translation actually existed.

**He asked for all of it out on 26 Aug and it is gone.** Not disabled, not
left dormant: the content, the plumbing, the typesetting and the admin
warning were all deleted. Do not rebuild any of it speculatively.

What was removed, so nobody goes looking for a half of it that survived:

- `content.js`: the `i18n` block, `about.ja`, and the one project `ja` block.
- `site.js`: `langWanted`, `applyLang`, `langSwitch`, `langPick`, `langRows`.
- `about.html` / `work.html`: the switch, and every `say()` indirection. Both
  pages read their fields straight off the object again.
- `styles.css`: the whole `body.lang-ja` block, `.lang-switch`, and
  `body.page-work.has-lang::before`. **The work page's registration cross is
  therefore back at its default `top:96px`** on every project, because the
  only reason it ever moved was to dodge the switch.
- `admin.html`: the `_from` drift warning, 201 lines of it.

**`.exp-row` stacking under 900px was NOT removed and must not be.** It was
written for Japanese job titles but it fixes the English rows too: beside the
title the dates took a third of a phone's width. It lives in a plain
`@media (max-width:900px)`, not in the language block, and it stays.

Worth keeping from the exercise, if a second language is ever asked for again:

- **The rule that made it safe** was that a switch is only ever drawn for
  content that actually HAS the other language, so it could never be a door
  into a page still in English. Start there again.
- **The jokes had to be rebuilt, not transcribed.** "award-losing" is a
  coinage against "award-winning", so the Japanese was a coinage against
  受賞歴: 落選歴, a record of losing. Machine translation returns a description
  of the joke instead of the joke, which is why it was rejected.
- **Nothing about it was automatic**, and `ja._from` (a copy of the English
  each line was written from) was what stopped that being dangerous. Without
  it, editing a line in admin left the site quietly showing new words under EN
  and old ones under JA, findable only by reading Japanese.
- The typesetting notes (Noto Sans JP at the END of every stack, the measure
  re-set in `em` rather than `ch`, `word-break:keep-all` on headings) are in
  the git history at `8ab8637` and earlier if they are ever wanted.


## Added 23 Aug 2026

### content.js comments do not survive

**Anything written as a comment in `content.js` is gone the next time he
saves.** admin holds the file as data and serialises it back out as JSON, so
comments are not edited away, they simply never make the round trip. Do not
put explanations in there expecting them to last. They belong in this file.

### The way back off Work that worked

It is at the FOOT of the grid now, small and quiet, and says four words:
"See all work →". It spent one pass under the heading as a line of red
capitals reading "See everything, including the work that never ran", which
was the wrong thing in the wrong place twice over: louder than his own
sub-line, and a door OUT of the page offered before anyone had seen a single
thing in it. `ranNote` already explains what the page is a subset of.

### Drag a project to reorder it (admin)

A grip handle in each card's summary. **Move up / Move down stay** and are not
redundant: they are the keyboard path, the touch path, and the only way to
move something one place without aiming.

- The card is made `draggable` only while the handle is held. Set it
  permanently and no text inside any field could be selected.
- Cards are reordered in the DOM live during the drag, so what he sees is the
  answer rather than a hint about it. On drop the order is read back out of
  the DOM via each card's `data-idx` and applied to the array.
- **The re-render after a drop is not optional.** Every field carries a
  `data-path` with its index baked in (`work.projects.4.title`), so after a
  move those paths address the wrong projects and the next keystroke would be
  written into somebody else's card. Verified after a real drag: every card's
  field path matches the project it is inside.

### Fonts

`preview-font.html` sets "Award-losing copywriter" at home-page size in Syne
and in **Drowner** (Hainz Studio), side by side, and tells him what is missing
until the file is in `fonts/`. It is not linked from the site.

Drowner was described here as a distressed, textured face that broke the
no-texture rule. That was wrong, taken off the foundry's marketing rather
than the specimen: it is a clean rounded grotesque. **He killed it anyway**
("kill it. move to the videos"), so Syne stands. No font binary is committed
and `.gitignore` keeps it that way.

## Added 24 Aug 2026

### Admin could overwrite work it never saw, and did

The editor holds all of content.js in memory and writes all of it back, so a
tab is only as current as the moment it was opened. On 23 Aug a save at 23:35
reversed a commit made at 23:23, **on the live site**: the brand in front of
all 18 titles, the refitted Tuborg cover, and the removal of Rivan Tower's
Japanese from Unstoppable Rides. It looked like nothing had happened.

A guard already existed and had two holes, either fatal alone.

- **It carried across only keys the tab had NEVER SEEN.** A field the tab knew
  about but had not edited went back stale, and a field deleted on disk came
  back from the dead, because the walk was over the disk's keys and a key the
  disk no longer has was never considered. That is how a deleted translation
  reappeared on the wrong project.
- **It read content.js with `JSON.parse`.** content.js is JavaScript. One
  trailing comma before a closing brace loads on every page of the site and
  JSON.parse refuses it. The refusal was caught and ignored, so the read
  returned nothing and the save wrote the tab's snapshot over everything. **A
  file too "broken" to read was the one case where the guard was most needed
  and the only case where it switched itself off.** The clobbered file had
  exactly one trailing comma in it.

Now: a **three-way merge**. Every edit already funnels through
`updateFromPath()` or the structural click handler, so both stamp the path in
`TOUCHED`. A touched field is the tab's; everything else is the file's,
**deletions included**. Reading runs content.js the way the site runs it, and
a read that genuinely fails says so on the status line instead of saving
quietly.

Things that will bite anyone changing this:

- **An add, a delete or a reorder marks the WHOLE array.** Merging element-wise
  across a reorder pairs up the wrong projects and puts one man's credits on
  another man's film. `TOUCHED['work.projects']` short-circuits the array.
- **The merge and the cleaning run on a copy, never on `M`.** The empty rows
  the cleaning removes are rows he is looking at, and every field on screen
  carries a `data-path` into `M`.
- **A 409 from GitHub is the remote protecting somebody's work.** The retry
  used to refetch the sha and write anyway, which defeats the one guard we did
  not have to build. It now reads what is there, merges it, then retries.
- `serialize()` cleaned `work.produced` / `work.presented`, the two-array shape
  retired 20 Aug 2026, so it had quietly stopped cleaning anything: 38 empty
  media slots across 16 projects had built up. Harmless on the site
  (`work.html` filters an empty `src`) but they made the two sides of the
  merge different lengths for nothing.

### The email arrives half written

Clicking his address anywhere opens the mail app with the message already in
it, written as if by the sender, in his voice. His idea.

**`contact.mailTemplates` is a LIST and it deals itself.** Shuffled once per
visit, then advanced in order every 7 seconds, so nobody has to reload to see
another letter. Every link on the page always carries the SAME one at any
moment, so the draft can never change between the nav and the footer.

- **Shuffled then dealt, not re-rolled.** Random picking hands out the same
  draft twice in a row often enough to look broken.
- **The bare address is kept on the element** as `data-mail-base`, and every
  rewrite is built from THAT. Rewriting a rewritten href staples a second
  query onto the first and the link grows every 7 seconds until it breaks.
- **A link that arrives already carrying a query is marked hands-off for the
  life of the page**, on the assumption somebody wrote it deliberately. That
  is what broke the home page's rotation once: the covered punch was being
  pre-filled at construction and then swept, so the sweep saw its own work and
  stood down. The punch now gets the bare address and the sweep does all the
  filling. One code path.
- **Paused while the pointer or the keyboard is on a mail link**, so opening
  the context menu to copy the address cannot have it change under the menu.
- **Deliberately NOT gated on `document.hidden`.** That was tried and removed:
  a hidden tab never fires `visibilitychange`, so a bug in the guard is a
  rotation that silently never starts and nothing tells you. It is also
  untestable in the preview pane, which reports hidden even when fronted.
  Browsers already throttle background timers, which was the whole benefit.

Three drafts. Version 1 is his words; versions 2 and 3 are Claude's and await
his pass. Version 3 replaced an earlier one whose subject was
"[OBLIGATORY GREETING], quick one": a bare "Hi" is a bad subject line, and the
joke was invisible until after the moment it needed to work. **The square brackets are
the joke**: it has to read like a template nobody filled in. Admin section 6
edits them, add and remove, with a length counter each. The old flat
`mailSubject` / `mailBody` still load if the list is absent, and admin folds
them into the list on read.

One implementation lives in `site.js` (`mailHref`, `sweepMail`) and a second,
deliberate copy of the same six lines is in `index.html`, which does not load
site.js. Things that will bite:

- **Rewrite the href, do not intercept the click.** A middle click, a right
  click and copy, and a long press on a phone all have to give the same
  address, and only a real href does that.
- **`encodeURIComponent`, never `escape`.** An apostrophe, a question mark and
  an ampersand all appear in his draft and all three break a query string raw.
  Newlines go as CRLF; some clients drop a lone `\n`.
- **The sweep runs three times** (now, DOMContentLoaded, load). site.js runs
  before each page's own script and `awards.html` builds its "Hire me?" after
  it, so a single pass rewrites every link except the one that matters most on
  that page. Rewriting twice is free: a link that already has a query is
  skipped.
- Blank either field and that half is not sent; blank both and it is a plain
  mailto again.

**Two things in the draft are flagged and unresolved**: the subject says
"Hi Mohamed", one M, against the double-M rule everywhere else (it reads as
the sender getting it slightly wrong, which is either the joke or a mistake),
and his draft's "ocpywriter" was read as a slip and set to "copywriter".

### The link preview

There were no `og:` tags anywhere, so pasting the URL into WhatsApp or
LinkedIn showed a bare link. All four public pages now carry them, plus
`images/og.jpg`, 1200x630, drawn by **`make-og.html`** from the live ticket
copy.

- **It has to be a flat file and static tags.** The apps that draw these cards
  do not run JavaScript, so nothing here can come out of content.js.
- **Which also means one picture for every project page**, because work.html
  is one file. Per-project cards would need a file per project, which is the
  thing this site is built to avoid.
- **It redraws itself on save.** He asked, fairly, whether he had to redo the
  picture every time he changed something. He does not: the drawing moved
  into `og-draw.js`, admin loads it, and `refreshOgIfNeeded()` redraws and
  drops `og.jpg` into `pickedFiles` before saving. Both buttons already read
  that list, so the local write and the GitHub upload need no new plumbing.
  - **Only when a word in the picture changed**, decided by `TOUCHED` against
    `window.OG_FIELDS`. Redrawing every save would put an 80KB binary in the
    repository each time he fixed a comma.
  - **`OG_FIELDS` is the contract.** Print something new in the drawing
    without adding it there and admin stops noticing the picture is stale.
  - It draws from `buildPayload()`, the merged object about to be written,
    not from `M`, so it shows the words actually being saved.
  - A failure there is swallowed: the picture must never stop the words
    being saved.
- It waits on `document.fonts.load` first. A webfont is only fetched when
  something is about to be PAINTED in it and a canvas does not count, so
  drawing early substitutes a system font and nobody notices until it is
  already in somebody's chat window.
- `make-og.html` POSTs `{files:{...}}` only, never a `content` key, so it
  cannot touch content.js.

### The nav fits a phone

Below 520px the links drop to their own row under his name. One row cannot
fit 375px: logo 190 + gap 20 + links 170 in 331 of usable width, so "Say hi"
was cut in half. Nothing was removed; dropping "Say hi" on phones was the
alternative and the way to reach him is not the thing that gets cut.

Separately, the dropdown panel is closed with `visibility`, not `display`,
because it has to transition. **A hidden box still takes part in layout**, so
below 900px it anchors right instead of left or it hangs off the edge.

### The page grows with the screen

`--wrap` was a flat 1240px at every width. Right on a laptop, wrong on his
monitor: he sent a screenshot of the work grid at roughly 2700px with about
750px of empty paper down each side and two 4:3 cards smaller than they are on
a 15 inch laptop, and asked why it had been made small. **It had not been
changed**; 1240 dates from the rebuild (`48b9367`) and the only recent `.wrap`
edit was inside a 520px media query. Said so, then fixed it.

`--wrap: clamp(1240px, 86vw, 2160px)`. Smooth, not stepped: breakpoints make
the grid jump as a window is dragged across them.

- **Only the container moves.** Every block of words already carries its own
  measure (62ch on a project, 60ch under a heading, 44ch on a card), so
  nothing widens a line of text.
- **The floor cannot hurt a phone**: `.wrap` takes the smaller of this and the
  screen less its margins, so 375px still comes out 331.
- **Checked against the covers before doing it.** They are all 1800px, so at
  the new 1010px card they still land near 1.8x. Anything wider than a 2160
  ceiling starts making single images bigger rather than showing more work.
- Two columns is a stated design decision and was NOT changed. Three columns
  on a wide screen is his call, not one to take quietly.

### The local server answers Range requests

It used to reply 200 with the whole file to everything, which a browser reads
as "ranges not supported", so `currentTime` silently stayed at 0 and no video
could be scrubbed. `serve_range()` now answers 206, 416 past the end, and
falls through on anything it does not understand.

### The jobs are one line each

Third arrangement, and his pick from four shown side by side with his real
data. **Agency, the title beside it in grey, the dates on the right, all on
one line.** Taken from brianlovin.com, which was looked at rather than
recalled.

**The cap is the fix, not the arrangement.** brianlovin runs that column at
640px, and the reason it works is the width: the gap between the title and
the dates has to read as a rail. `.exp-row` is capped at **760px** inside the
1200px About column and left aligned, so it keeps the same left edge as the
heading and the photo. At 1200 the same arrangement is the hole he objected
to in the first place. Rows went from 65px to 51px.

History, so it is not re-litigated: role on top with the agency small under
it read "Copywriter, Copywriter, Copywriter, Copywriter" down the column.
Swapping them fixed that and left two lines with the dates flung across a
1200px row, which he rejected on sight. The other three options shown were
dates in a left rail, and the date as a small label above; he took the
one-liner.

- `.exp-lead` wraps, so the title drops under the agency by itself if it ever
  runs out of room. Under 900px the row stacks and the dates move above.
- **The preview he picked had dropped the cities**, but he had asked for
  "We are social - dubai" one message earlier, so they were kept and the
  difference was flagged rather than taken as a decision.

### A skill you can click (added 25 Aug 2026)

His idea. "Manipulating" sits in the About skills list among six real ones,
and it opens `manipulating.html`, a six-line piece whose joke is that
clicking a confession is itself the manipulation working. The line he asked
for, "honestly what did you expect from manipulation? exactly", is in it
close to verbatim.

**The page ends by converting.** "Anyway. Now that you are here." then a link
to the work. The manipulation actually manipulates rather than describing
itself, which is the difference between the piece and a joke about a piece.

- **`about.skillLinks` matches on the WORDS, not the index**, so reordering
  the skills list cannot move the door onto the wrong one.
- **The tag is identical to the other six at rest.** No underline, no colour,
  no cursor hint beyond the pointer. The whole joke is that he reached for it
  without being told he could, so announcing it would kill it.
- **A typo fails silently**, because a name that matches nothing simply
  renders as text. Admin therefore checks the name against the skills list as
  he types and says so in red when it does not match.
- **It is the one page with no mark.** Every other page has its own small
  drawn thing; this one has the About paper and nothing else, because you
  clicked expecting something and arrived somewhere emptier.
- Empty `skillLinks` and every tag goes back to being the span it always was.

**The copy was rewritten on 25 Aug for edge, at his request.** The first pass
explained the technique ("that is the whole technique, six honest words and
one that should not be there"), which is the exact crime he was pulled up on
in his own award boards: a sentence explaining the sentence above it. The
piece now confesses instead, and turns the site's own devices in as evidence:
the lottery ticket, the panel you have to scratch, the email that writes
itself. "You are four moves into something and you thought you were browsing."
The line about the products is his real work, Canesten included.

**It is a manifesto (25 Aug).** Three fields, not one list with markers in
it, because a marker is something he has to remember and a field is something
he can see: `paragraphs` is the opening, `manifesto` is the tenets, `close` is
the rest. Empty any of the three and its block does not print.

The tenets are set apart between two rules, a size up, in the page's full ink.
**No numbers, no bullets, no heading announcing a manifesto**: a manifesto
that introduces itself is a mission statement.

- **The hook is his and is not to be touched.** "I put it between Copywriting
  and Concept Development, where nobody reads. / You read."
- The cleverness is meant to be in the sentences, not in the attitude, so each
  tenet is a reversal rather than a boast: "I have never sold anything. I have
  only removed the reasons not to." "You cannot lie in a headline. You can
  only choose which true thing to say loudest." "If you can hear the selling,
  I was late."
- **`.manip > p`, never `.manip p`.** The tenets are nested inside
  `.manip-creed`, so a bare descendant selector reaches them too, and at equal
  specificity the later rule wins: the phone override further down the file
  was silently resetting the manifesto back to body size.

**The cartoon** is one man slumped in an armchair facing an EMPTY chair with
the notepad and pen still on the seat. Inline SVG for the same reasons as the
seal and the cabinet, and `currentColor` on every stroke so the ink is the
page's ink.

- **It took three goes and the first two are worth not repeating.** A
  reclining figure on an analyst's couch could not be made to read: the body
  came out a flat wedge, a ramp rather than a person. Seated and slumped with
  a hand over the eyes reads instantly. **A seated figure is far easier to
  draw legibly than a reclining one.**
- The second attempt had him facing AWAY from the therapist's chair. The two
  halves are in `translate()` groups so swapping which side each sits on is
  one number, not a rewrite of every coordinate.
- **It is not a `<template>`.** Template content is inert, so the drawing
  would vanish with JavaScript off. It sits in the markup and the script
  MOVES it up into the article after the second paragraph.
- It grows to the RIGHT of the reading column, never left. A negative left
  margin was tried and put it at -30px, off the side of the screen, because
  the container has only 30px of margin to borrow at 1300px wide.
- **It has perspective now, at his request, and the fills are what make it
  work.** A wall line behind and a rug drawn as a receding plane give the
  depth, but in a line drawing with no fills everything is transparent: the
  wall ran straight through both chairs and through his head. Each object now
  has a silhouette filled with `var(--bg)` drawn before its strokes, so it
  occludes what is behind it. The chairs are turned three quarters so the
  seats read as planes rather than lines.

## Added 26 Aug 2026

### The manipulating page is capped and centred

It was the only single-column page sitting in the site's 1240px container,
which is built for pages that FILL it: the work grid has two columns, About
has a photo beside its text. This one is a reading column and nothing else,
so at 1440px it sat hard left with about 460px of dead paper down the right,
reading as a page that had failed to load its other half.

`body.page-manipulating` now caps the page head's wrap and the article's wrap
at **860px** and lets `.wrap`'s existing `margin-inline:auto` centre them.

- **860 is set by the heading, not chosen.** "Manipulating." runs 779px of ink
  at the 138px ceiling of `clamp(52px,11vw,138px)`, and the ceiling means it
  can never exceed that at any width. Checked at 375 / 768 / 1024 / 1440 /
  1920 / 2560: the heading never overflows and nothing scrolls sideways.
- **The nav deliberately keeps the full 1240.** It is chrome, it is identical
  on every page, and re-centring it here would make this page look like a
  different site.
- Below about 900px the wrap's own `100% - 44px` is already the smaller
  number, so phones never meet the cap.

**The measure moved off `.manip` and onto `.manip > p`.** It used to sit on the
article, which capped everything inside at 62ch. Two consequences, both fixed:

- **The documented parity with About was false.** The note says the piece uses
  "the same 62ch the About bio uses". It did not: `ch` resolves against the
  element's own font-size, and the article inherits 16px while the paragraphs
  are 19px, so the column came out 590px against About's 658px. Both are now
  ~659px and the claim is true for the first time.
- **The cartoon's `max-width` had never once applied.** It is inside `.manip`,
  so the 620px was always clipped to the article's 590. The note above it,
  saying the drawing is "wider than the 62ch reading column" and "grows to the
  right only", described something that was not happening. It is now 760px
  against a 660px column: 100px past the words, 100px inside the block.
  620 would have made it NARROWER than the widened column, which is the
  squeezed look that note exists to prevent.

`.manip-creed` is capped at 62ch so its two rules stay tied to the prose
rather than running the full 860 and reading as a page divider.

### Two About photos were dead, and nothing said so

He added four photos and two went in without their `.JPG`, so
`imgSrc` pointed at files that were not there. Fixed in content.js.

**The portraits box was the one image field in admin with no existence check.**
A project cover gets "File not found in images/" under its preview; this got
nothing, and it is the worst field to get nothing in, because the photos are a
**shuffle**: a broken one is not a visible hole, it is one step of six that
quietly shows nothing. You would have to hover five times to find it.

`renderPortraitNote()` now loads each name and lists the ones that fail. It
asks the browser rather than the server for a listing, so it behaves the same
opened from the folder as over the local server, and a `run` counter stops a
slow answer from an older keystroke landing after a newer one.

- **It names the extension explicitly**, because the trap that is coming is
  case: macOS is case-insensitive and GitHub Pages is not, so `img_5550.jpg`
  would load on his machine and 404 live. All 63 image and video references in
  content.js were checked for exact-case matches: all 63 pass, today.
- **The About page preloads the whole roll**, so its weight is the sum of all
  six, currently 5.5MB. Two of his new ones are straight off a phone
  (3024x4032 at 2.7MB, 2160x3840 at 1.3MB) against the site's documented
  1800px convention. Flagged to him, NOT resized: "don't assume that i still
  have the master files" means his originals are not ours to overwrite.

### The scratch pays a prize, not a plea (26 Aug 2026)

The covered punch said **"Hire me?"** with **"...think you can give it a shot?"**
captioned under it. His teacher at Miami Ad School hated the wording and was
right, for reasons worth keeping written down:

- **It broke character at the one moment character mattered.** The whole
  ticket refuses to ask for anything: award-losing, I won nothing, odds
  historically low. Then it makes you scratch a panel with your finger and
  the reward for that work is him asking you for a job.
- **It abandoned the metaphor at the payoff.** You scratch a lottery ticket to
  learn an OUTCOME. "Hire me?" stops being a ticket and becomes a button.
- **The question mark was asking permission to ask**, and the caption asked a
  second time, so the moment was two petitions in a row.

It now reads **"YOU WON A COPYWRITER"**: a valid lottery outcome, funny
because a person is an absurd prize, and still functionally the hire-me while
asking for nothing. It also closes the site's arc, since everything else on
that card says he has never won and the one thing you scratch says you did.
Measured at 220px in the 306px label box, so it sets on one line.

**The caption is gone entirely, and that is the point.** `ticket.scratchNote`
is now empty and the element is never built.

- A punchline followed by a caption is **a sentence explaining the sentence
  above it**, which is the exact crime he was pulled up on in his own award
  boards and the reason the manipulating piece was rewritten.
- The caption only ever existed to prop up "Hire me?", which was not funny on
  its own. The punch carries the joke now, so the crutch goes.
- **The affordance was never the caption.** `scratchHint` ("Scratch to
  reveal") is painted onto the foil itself, so nothing about discoverability
  depended on the line underneath.
- `ticket.terms` already does the small-print voice at the foot of the card,
  so a second line of small print beside the punch was a stutter.

**The layout box had to go with it, and this is the part that could bite.**
`applyLayout()` drops the WHOLE artboard when `got < want * 0.75`. The
designer had placed `scratchNote` in both `layout.desktop` and
`layout.mobile`, and index.html only builds that element when the text is
non-empty, so blanking the copy alone would have left a box in the layout
naming an element that no longer exists. At 14 of 15 slots that still cleared
the threshold, but it is dead weight that accumulates: two or three more
removals and the home page would silently fall back to the flow layout with
no clue why. Both boxes are removed, so want and got are 14 and 14.

Verified before and after against the pre-change file at 1440x900 and
390x844: identical placement, identical ticket height, same two slots
(`serial`, `won`) unplaced in both. **Those two are pre-existing and were not
caused by this change.** Note also that measuring the ticket inside an iframe
is unreliable for the reasons in the designer notes; the real pane is the
only honest measurement.

### preview-footer.html

Three footers side by side, built out of the real one: site.js fills a hidden
host and each option is assembled from those actual nodes, so the type, the
icons, the colours and the reveal are the ones that ship. Not linked from the
site, same as `preview-intro.html`.

**It cannot travel on its own.** Sent to him as a lone file it rendered blank,
because it has no stylesheet and nothing to build from without `styles.css`,
`content.js` and `site.js` beside it. It now says so in inline styles that do
not need the stylesheet. Open it from the folder or off the local server.

### Rivan Tower has no stills

It carried two **Tuborg** images, which he spotted and deleted. That leaves the
strongest project on the site with one Adobe-hosted video and no photographs
at all. It was the second case of one project's content sitting inside
another, after a translation block that has since been removed with the rest
of the Japanese. Nothing in admin clones a project, so the cause is still
unknown.

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
- Don't go back to a CSS-only hover menu. The grace period in `site.js` is the
  whole fix.
- Don't put the tick back on Work that worked.
- Don't parse content.js with JSON.parse. It is JavaScript, and the strictness
  costs more than it buys: it once silently disabled the only thing standing
  between an old admin tab and the whole site's copy.
- Don't force past a 409 from GitHub by refetching the sha. Read, merge, retry.
- Don't try to set an og: tag from JavaScript. The scrapers do not run it.
- Don't put copy in `PROJECT-NOTES.md`. It is a stub; `READ ME.md` is his
  handbook and the one to keep current.
- Don't put the Japanese back. He had it for four days and asked for all of it
  out on 26 Aug 2026. Removed means removed: content, plumbing, typesetting
  and the admin warning. Don't leave dormant language machinery behind either.
