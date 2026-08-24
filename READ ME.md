# READ ME

Everything you need to run and edit mohammedessam.com. Written for you, not
for a developer. Last rewritten 24 August 2026.

If something here disagrees with `PROJECT-NOTES.md`, this file is right and
that one is old.

---

## Start here, every time

Double-click **`Start Site.command`** in this folder. A black window opens and
stays open. That window IS the server: close it and the site stops working
locally.

Then open:

- the site: **http://127.0.0.1:8888/**
- the editor: **http://127.0.0.1:8888/admin.html**
- the home designer: **http://127.0.0.1:8888/design.html**

**Always open the editor through that address, never by double-clicking
`admin.html`.** Opened as a file it cannot read the folder, which means it
cannot check whether anything changed since you opened it, and saving will
overwrite work you did not know was there. It will now warn you when this
happens, but the warning is a last resort, not a workflow.

---

## Saving: the two buttons

**Save locally** writes this folder only. Your preview updates. The live site
does not.

**Save to GitHub** writes GitHub *and* this folder. This is the one that puts
things on mohammedessam.com. The live site rebuilds a minute or two later, and
the status line tells you when it has actually landed.

The line under the buttons always says what happened to each destination. Read
it. If anything went wrong it says so there.

### One rule, and it matters

**Reload the editor before you start a session of edits.**

The editor holds the entire site's text in memory and writes all of it back
when you save. So a tab you opened this morning still believes it is this
morning. On 23 August a tab that had been open since 18:11 saved at 23:35 and
undid a whole evening's work on the live site, silently.

That specific hole is now closed: the editor re-reads the file before every
save and keeps only the fields *you* touched, taking everything else from the
file as it stands. It handles additions, edits and deletions. But reloading
first is still free and still the right habit.

---

## The editor, section by section

1. **Projects.** One list, in the order it appears on the site. Drag a card
   by the little dotted handle on the left of its title to move it, or use
   Move up / Move down, which is the way to do it on a phone. Each project has
   an **It got produced** tickbox, which is the only thing deciding whether it
   shows up on *Work that worked*.
2. **The ticket (home page).** Every word on the home page: the black band,
   the badge, the serial, your name, both lines of the headline, the sub-line,
   the small print, and the note printed on the covered box. The awards
   cabinet's copy is in here too, near the bottom.
3. **The quiet jokes.** Six optional slots: the browser tab title when
   someone switches away, the footer small print, the next-project label, the
   404 line, the empty-grid line, and one line in the browser console. Leave
   any of them empty and it simply does not appear.
4. **Work page labels.** The headings and the two sub-lines on the work
   pages.
5. **About page.** Your bio, skills and job history.
6. **Contact.** Your links, your résumé button, and **the email that writes
   itself** (below).
7. **Top bar and footer.** The menu labels and the footer line.

Above section 1 there are two panels that are not editing: how this works,
and the GitHub connection.

### The email that writes itself

New, 24 August. Anyone who clicks your email address anywhere on the site now
gets their mail app open with a message already in it, written as if by them,
in your voice.

There are **three versions**, in **section 6**, and **one is picked at random
each visit**. The same one is used for every email link on that page, so it
does not change under them between the nav and the footer. Reload and you get
a different one. Add a fourth with the button, or remove one.

- **Empty a box and that half is not sent.**
- **Delete them all and clicking your email opens a blank message,** exactly
  as it did before.
- The counter under each one tells you how long the finished link is. Under
  about 1500 characters is safe everywhere; past that some mail apps cut the
  end off, and it says so.

The square brackets are the joke: it should read like a template nobody
filled in. Keep them when you rewrite.

**All three are drafts. Version 1 is your words**, the two others are mine and
are there to be replaced. Two things in version 1 are still your call:

- The subject says **"Hi Mohamed"**, one M. Everywhere else on the site it is
  Mohammed with two. It reads as the sender getting it slightly wrong, which
  is either the joke or a mistake.
- Your draft had **"ocpywriter"**. I read that as a slip and made it
  "copywriter". If it was deliberate, put it back.

---

## The home designer

`design.html` is a canvas for the home page. Drag boxes, resize them, delete
them, add new ones, and double-click a box of words to rewrite it.

- Every position is a **percentage**, never a pixel, so a layout made on your
  screen holds its proportions on every other screen.
- There is a **desktop** layout and a separate **phone** layout. They are not
  the same thing and you have to do both.
- **Hold Shift while resizing** to keep the shape.
- **An empty artboard means the page lays itself out**, the way it does now.
  So if you ever make a mess of it, delete everything and the home page goes
  back exactly to what it is today. Nothing is lost.
- It tells you if a box is too short for the words inside it.

The designer only ever writes the layout and the words you actually typed on
it. It cannot touch anything else in the file.

---

## Things that will bite you

**The live site caches for ten minutes.** Your text is fetched with a stamp
that changes every minute, so words update quickly. **The stylesheet has no
such stamp**, so if you ever change how something *looks* and the live site
seems not to have noticed, it has: hold Shift and reload.

**Nothing you write as a comment inside `content.js` survives.** The editor
holds that file as data and writes it back out clean, so comments are not
edited away, they simply never make the trip. Notes belong in this file.

**The link preview picture looks after itself now.** The card that shows up
when you paste your link into WhatsApp or LinkedIn is `images/og.jpg`, a flat
picture of the ticket. It cannot update itself on the live site, because the
apps that draw those cards do not run any of the site's code, so **the editor
redraws it for you**: change the headline, the band, the badge, the serial,
your name or the stamp line, press either save button, and the new picture
goes with it. The status line tells you when that happened.

`make-og.html` is still there to look at it, and to put it right by hand if
the automatic one ever goes wrong. You should not normally need it.

One limit: **every project page shares the same preview picture**, because
`work.html` is a single file serving all of them. Giving each project its own
would mean a separate file per project, which is the thing this site is built
to avoid.

**Your videos are on a subscription.** 18 of the films on the site stream from
your Adobe Portfolio account. If that lapses, 18 project pages go dark. Every
one of them is already downloaded to `~/Desktop/video-rescue/`, so nothing is
lost, but they still need moving to Vimeo. The panel at the top of the work
list in the editor counts how many are left. It turns green at zero.

---

## Which files matter

| File | What it is |
|---|---|
| `content.js` | Every word and every image reference on the site. One file. |
| `index.html` | The ticket. The whole home page. |
| `work.html` | Both the work index and every project page. |
| `about.html`, `awards.html` | About, and the awards cabinet. |
| `styles.css` | How everything looks. |
| `site.js` | Shared pieces: the nav, the footer, the language switch, the email prefill. |
| `admin.html` | The editor. |
| `design.html` | The home designer. |
| `og-draw.js` | Draws the link-preview picture. Used by the editor and by the page below. |
| `make-og.html` | Looks at that picture, and saves it by hand if ever needed. |
| `local-server.py` | The little server behind `Start Site.command`. |
| `images/` | Your pictures. `images/live/` are the ones pulled off your old site. |

The copies in this folder are the current ones and match GitHub exactly.

Not in use any more, kept only so nothing breaks: `contact.html`,
`project-template.html`, `work/`, the `preview-*.html` files, `sketches.html`,
`ticket-mockup.html`, `PROJECT-NOTES.md`.

---

## Still open

- **The videos.** Needs your Vimeo login, so it needs you. Send me the links
  and I will put all 18 in.
- **Nine projects have no still images**, only a film. Rivan Tower, your
  strongest piece, is one video and nothing else.
- **The Quarantine Games page weighs 47MB** because of four animated GIFs.
  Unusable on mobile data.
- **Liquid Death** is an empty draft and does not appear on the site.
- **The Quarantine Games is dated 2020 here and 2023 on your old site.** Only
  you know which is right.
