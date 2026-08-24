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

### A second language (a feasibility test)

Not a translated site. **Two things carry Japanese**: the About page
(`about.ja`) and the Rivan Tower project (`work.projects[].ja`). `i18n.ja`
holds the furniture round them, meaning the words a page prints itself as
opposed to the words he wrote.

**All the plumbing is in `site.js`** — `langWanted`, `applyLang`, `langSwitch`,
`langPick`, `langRows` — because both pages need the same four moves and a
second copy of this is a second copy to get wrong. Adding a third translated
page should not add a fifth copy of it either.

- **THE RULE THAT MAKES IT SAFE: a switch is only ever drawn for content that
  actually HAS the other language.** It can never be a door into a page that is
  still in English. Delete a `ja` block and its switch disappears with it.
- Every field is taken one at a time (`langPick`), so a half-finished
  translation shows his English for whatever it has not reached.
- **Parallel lists are merged by position, and dropped whole if the two stop
  being the same length** (`langRows`). Credits and jobs both go through it.
  Add a credit in admin without touching the translation and the whole
  translated list falls back to English, rather than sliding the wrong job
  title onto a real person's name or the wrong dates onto a real employer.
  All three cases were tested: matched, mismatched, and partly filled.
- **Credit and company NAMES are never translated, cities are.** Japanese
  credits carry foreign names in Latin as a matter of course. Dates are
  rewritten year-first, which is the order Japanese writes them in.
- The next-project link carries the language only if the next project has it.
- The nav stays in English on a translated page. It is global chrome and only
  two things are translated; a Japanese nav pointing at English pages is worse
  than an English one.

**The jokes are rebuilt, not transcribed.** This matters more than the rest of
it, because his copy is the site:

- "award-losing" is a coinage against "award-winning", so the Japanese is a
  coinage against 受賞歴 (a record of winning): **落選歴**, a record of losing.
- "buttlines are just headlines done butt first" keeps the head/butt pair
  literally (ヘッドライン / 尻), because that IS the joke and it survives.
- "he who was born in a city can't be named a farmer" is a fake proverb, so
  the Japanese is written in the classical register real proverbs use
  (生まれし者 … 呼ばれず). It has to sound like a proverb to be funny that it is
  not one.

**Japanese typesetting, all of it in `body.lang-ja` in styles.css:**

- **Noto Sans JP goes at the END of every stack, never the front.** Font
  fallback is per character, so Latin still comes out of Syne, Bricolage and
  Barlow and only the Japanese falls through to Noto. It is fetched only when
  Japanese is actually on screen; verified absent on the English pages.
- The display tracking comes off. `-.03em` is a Latin fix for gaps between
  capitals and it pushes kana into each other. Same for the `.95` leading.
- **The measure has to be re-set.** `62ch` is 62 zeroes wide and a kanji is
  about two of those, so an English column comes out at 22 Japanese characters
  a line. Set on the paragraph and in `em`, which is one character square, so
  the number in the rule IS the characters per line. 34 on a project, 32 on
  About.
- **The page heading comes down to `7.4vw` from `11vw`.** Every Japanese
  character is a full em where a Latin one averages about half, so the same
  size buys roughly a fifth less line.
- **`word-break:keep-all` on headings and job titles.** Japanese may break
  between almost any two characters, which is right in body copy and wrong in
  a headline: 少し came apart across two lines, and クリエイティブコピーライター
  broke before its long-vowel mark, which is a character a Japanese typesetter
  may not begin a line with. `overflow-wrap:anywhere` is the escape hatch so a
  longer heading can still never push off the side of a phone.
- **`.exp-row` stacks under 900px** and the dates move above the job. Beside
  it they took a third of a phone's width and left the title a column too
  narrow to hold it. This fixes the English rows too.
- Verified by walking every text node character by character and reporting
  which character starts each visual line: **zero forbidden line starts** at
  both 388px and 1360px.

**NOTHING ABOUT THE TRANSLATION IS AUTOMATIC**, and the one thing that stops
that being dangerous is `ja._from`. It is a copy of the English each Japanese
line was written from. Admin compares it with the English as it stands now and
prints a warning listing what has drifted, showing what the line said, what it
says now, and what the Japanese still says. It never translates and never
edits. Without it, changing a line in admin would leave the site quietly
showing the new words under EN and the old ones under JA, and the only way to
find out would be to read Japanese.

- **Rewrite `_from` whenever the Japanese is rewritten.** A warning about a
  change that has already been dealt with is a warning he learns to ignore.
- The English itself, not a checksum, so admin can show the old line beside
  the new one.
- **`_from` declares what is watched.** The comparison only looks at the keys
  `_from` lists, at every depth, so the credits watch the ROLES and ignore the
  NAMES. Changing a colleague's name needs no new Japanese and correctly stays
  silent; changing a role fires. Both were tested.
- The warning is driven off `_from` itself, not a hard-coded list, so
  translating another project adds nothing to admin: give its `ja` block a
  `_from` and it is watched.
- Only the entries that actually moved are shown, not the whole list.
- Machine translation was considered and rejected. No API returns 落選歴 for
  "award-losing"; it returns a description of the joke instead of the joke.
  It also needs a network call and a key, which breaks the file:// workflow.

**Both save paths handle it.** `b64encode` goes through `TextEncoder` before
`btoa`, and `local-server.py` writes `content.js` as UTF-8. A round trip
through admin preserves `i18n`, `about.ja` and the project's `ja`, because
admin deep-clones the whole of `SITE_CONTENT` and serialises it whole rather
than rebuilding its arrays from the form fields. Verified.

**`work.note` still ends "None of them are in Japanese."** Two of them now are.
That is his line and it is flagged, not changed. `about.label` is not
translated because nothing renders it.

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
it, written as if by the sender, in his voice. His idea and his words;
`contact.mailSubject` / `contact.mailBody`, editable in admin section 6 with a
counter for the finished link's length.

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
- **Re-run `make-og.html` if the headline changes**, or every link he has ever
  sent keeps showing the old words. It waits on `document.fonts.load` first:
  drawing early substitutes a system font and nobody notices until it is in
  somebody's chat window.
- It POSTs `{files:{...}}` only, never a `content` key, so it cannot touch
  content.js.

### The nav fits a phone

Below 520px the links drop to their own row under his name. One row cannot
fit 375px: logo 190 + gap 20 + links 170 in 331 of usable width, so "Say hi"
was cut in half. Nothing was removed; dropping "Say hi" on phones was the
alternative and the way to reach him is not the thing that gets cut.

Separately, the dropdown panel is closed with `visibility`, not `display`,
because it has to transition. **A hidden box still takes part in layout**, so
below 900px it anchors right instead of left or it hangs off the edge.

### The local server answers Range requests

It used to reply 200 with the whole file to everything, which a browser reads
as "ranges not supported", so `currentTime` silently stayed at 0 and no video
could be scrubbed. `serve_range()` now answers 206, 416 past the end, and
falls through on anything it does not understand.

### Rivan Tower has no stills

It carried two **Tuborg** images, which he spotted and deleted. That leaves the
strongest project on the site with one Adobe-hosted video and no photographs
at all. Second case of one project's content sitting inside another, after the
Japanese block. Nothing in admin clones a project, so the cause is still
unknown; admin's warning panel now shouts if two projects ever share a
translation.

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
- Don't translate a colleague's name into another script.
