# Mohamed Essam — Copywriter portfolio
Project notes / handoff summary

## Files
- `index.html` — home page (nav, jackpot hero, feature image band, two-tab work grid)
- `about.html` — about page (portrait + real bio + work experience)
- `contact.html` — contact page (real links)
- `styles.css` — shared stylesheet used by all three pages
Keep all four files in the same folder — the pages link to each other by filename and share `styles.css`.

## Concept
A "jackpot" hero: three slot-machine reels spin and land on three words. Those
exact words are embedded/bolded inside a real one-liner that reveals underneath.
27 hand-written lines live in the `lines` array at the bottom of `index.html`.
No fixed word-per-reel pool — each line carries its own 3 keywords in whatever
order they naturally fall in the sentence.

Tone: proverbs and famous sayings taken literally to an absurd, personal place
("Airplane movie" deadpan), anti-life-coach, built around the real bio line
"award-losing copywriter (so far)."

## Content — now real, not placeholder
- Bio, work experience, and contact links pulled from mohammedessam.com.
- Client work grid: Yango, Domino's, Pringles Arabia, Nivea, Tuborg, AFG
  (6 of the ~16 real projects listed on the source site — swap in more anytime
  by copying a `.work-card` block).
- Spec work grid: Haan (Miami Ad School) is real; two slots are still
  `[Project name]` placeholders — swap in your other school/spec projects.
- Contact: m22essam@gmail.com, WhatsApp, LinkedIn, Instagram, Vimeo — all real.

## Still placeholder — needs real input before launch
- All actual project screenshots (work-grid cards use `placehold.co` blocks)
- About page portrait (currently `placehold.co`)
- Feature band image (currently `picsum.photos`)
- Two remaining spec-work project names/images

## What changed in this pass
- Rewrote all 27 jackpot lines: proverb/famous-quote twists, single-sentence,
  personal and specific, deadpan-literal.
- Split the work section into two tabs: Client Work / Spec Work.
- Added scroll effects: sticky nav that compresses and gains a blurred
  background past 12px of scroll, scroll-triggered fade-up reveals on
  sections (IntersectionObserver, staggered on work cards), and a subtle
  parallax drift on the feature band photo. All respect
  `prefers-reduced-motion`.
- Replaced all placeholder bio/work-history/contact copy with real content.

## How to publish
- Any static host works since it's plain HTML/CSS/JS: Netlify Drop
  (netlify.com/drop — drag the folder in), GitHub Pages, or Cloudflare Pages,
  all free.
- Custom domain (optional): ~$10–20/year from a registrar like Namecheap.
