# Mohamed Essam — Copywriter portfolio
Project notes / handoff summary

## Files
- `content.js` — **all site content in one file** (hero lines, projects, about,
  contact, footer). The pages only display it. Edit via `admin.html`, or by
  hand following the comments at the top of the file.
- `admin.html` — the owner's editor. Open it in a browser, fill the forms,
  click "Download updated content.js", replace `content.js` in the folder.
- `index.html` — home page shell (renders hero + work tabs from content.js)
- `about.html` — about shell (renders from content.js)
- `contact.html` — retired: contact now lives at the end of the About page
  (renders from content.js `contact.*`, icons auto-map from link labels)
- `work.html` — one dynamic project page; shows any project via `?slug=`.
  This replaced the per-project files in `work/`.
- `site.js` — shared helpers (nav/footer fill, scroll reveals, image paths)
- `styles.css` — shared stylesheet, not content
- `images/` — drop project images here; reference by file name in content.js
  (see images/README.txt for the naming trick: use the project slug as the
  file name). `about-photo.jpg` (the About portrait) lives here too.
- `grain-bg.png` — background texture, keep beside the HTML files (styles.css
  references it from the root).
- `work/yango-wedding-rush.html` and `project-template.html` — retired, unused
  (superseded by `work.html` + content.js). Safe to delete.

## How the owner edits
1. Open `admin.html` (double-click works, no server needed).
2. Change anything: projects (add/remove/reorder/rewrite), hero lines, home
   extras (dateline under the hero + contact CTA at the bottom), about,
   contact, footer.
3. Download updated `content.js`, replace the old one in the folder.
4. Refresh the site pages or push to GitHub Pages as usual.

Images: save into `images/`, type the file name in the admin form. Full
http(s) links also work without the folder.

## Concept
"Jackpot" hero and the three-version shuffle were retired. Current hero: a
**word chain** of six short sentences (`hero.sentences` in content.js), one
shown at a time. Each sentence ends with its clickable word — the LAST word,
detected automatically (trailing punctuation stripped, no brackets). Clicking
it glitches to the next sentence, which opens with that same word. The last
sentence ends the chain: clicking its word ("work") smooth-scrolls to the
work section. A mono "↺ back to the start" control under the hero appears
only on the last sentence and glitches back to the first — the loop.
The hero reserves the tallest sentence's height so the layout never jumps.
Work counts are capped by `work.producedLimit` / `work.presentedLimit`
(0 = all, editable in admin); projects with `draft: true` stay hidden from
the site but remain in the editor.
Light mode was removed (site is dark-only, nav toggle deleted).

Tone: proverbs and famous sayings taken literally to an absurd, personal
place, anti-life-coach, built around "award-losing copywriter (so far)."

## Content — now real, not placeholder
- Bio, work experience, and contact links pulled from mohammedessam.com.
- **Produced grid (11):** Yango Unstoppable Rides, Babyshop First Words
  Discount, Yango The Wedding Rush, Pringles Champions of Fun, Rivan Tower,
  AFG 5-Star Investment, Pringles Arabia Cheesy Cheese, Momtaz Cement,
  Modon, The Quarantine Games, A Song for the Cashless.
- **Presented grid (9):** Domino's The True Colors, Nivea Never See the Sun,
  Tuborg The Pressure Party, Oumph! Like Any Ad., A Middle Finger to the
  Death, Canesteen, Red Expo, Haan (Miami Ad School), plus one
  `[Project name]` placeholder slot.
- Sort logic (from the live site's own project pages): any project credited
  "Miami Ad School / Teacher" is presented; agency-era work is produced.
- Contact: m22essam@gmail.com, WhatsApp, LinkedIn, Instagram, Vimeo — all real.

## Classification flags (owner should confirm)
- **Yango The Wedding Rush** is in produced but does NOT appear on the live
  site (it was the worked example in the template). Confirm it is real.
- **Tuborg The Pressure Party** was moved to presented on inference (2026,
  same era as the verified school projects); its live page was not found.
- **Pringles Champions of Fun, Modon, A Song for the Cashless** are in
  produced on inference (real brands, agency-era years); their live detail
  pages were not found.
- **Red Expo — Yo Got the Keys** could not be identified at all; placed in
  presented as the conservative choice. Confirm which column it belongs in.
- The owner can move any project between groups and fix titles/categories
  in admin.html in seconds.

## Still placeholder — needs real input before launch
- All actual project screenshots (work-grid cards use `picsum.photos` seeds —
  replace with real files in `images/` via admin.html).
- Project stories (situation/insight/idea/result) and credits for every
  project except the Yango Wedding Rush template placeholders.
- Feature band image (`picsum.photos`).
- One remaining spec-work project name/image.

## How to publish
- Any static host works since it's plain HTML/CSS/JS: Netlify Drop
  (netlify.com/drop — drag the folder in), GitHub Pages, or Cloudflare Pages,
  all free. Owner uses GitHub Pages.
- Custom domain (optional): ~$10–20/year from a registrar like Namecheap.

## History
- An earlier CMS build (`_archive-cms-build/`, gitignored) was abandoned.
- A slot-machine hero was built then retired, then a three-version keyword
  shuffle, then light mode; the current hero is the six-sentence word chain
  (last word scrolls to work). Don't reinstate any of the retired mechanics.
