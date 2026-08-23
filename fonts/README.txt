FONT FILES GO IN THIS FOLDER, AND NEVER LEAVE IT.
=================================================

git is set to ignore everything in here except this README, so any font
file you drop in stays on your machine. That is deliberate. "Free for
commercial use" means you may SET TYPE with a font. It does not mean you
may hand the file to everyone who visits the site, which is what putting
it in a public repo does. Nothing here goes live until the licence is
sorted and it is built in on purpose.

Two fonts are wired up to appear the moment their file is here.


DROWNER  -  for the preview only, so far
========================================

  Hainz Studio. Try it at preview-font.html, which sets the home
  headline in Syne and in Drowner and lets you flip between them.

  WHERE
    https://www.behance.net/gallery/217765021/FREE-FONT-DROWNER-Display-Font
    (free version, from the designer's own page)

    Commercial licence, if it ends up on the live site:
    https://creativemarket.com/HainzStudio/290988602-Drowner-Display-Font

  WHAT TO DROP IN
    One file, named one of:

        Drowner.woff2       <- best
        Drowner.otf         <- fine
        Drowner.ttf         <- fine

    Refresh preview-font.html and the switch turns on. Until then it
    stays greyed out and says so, rather than showing you Syne with
    Drowner's name on it.

  NOTE
    Drowner is a distressed, textured face. "No grain, no texture of any
    kind" is a rule in CLAUDE.md that you set yourself after rejecting
    that look twice. Worth looking at it big before deciding.


MONIQA goes in this folder.
===========================

The home page headline is already wired to use Moniqa. The font files
are not here, because Moniqa's download is behind a button that a script
has to click, and I would not pull a font binary off one of the mirror
sites and commit it into your public repo without knowing what is in it.

So: download it yourself, once, and drop it in here.

WHERE
  The designer's own page, Rajesh Rajput:
  https://www.behance.net/gallery/114431757/MONIQA-TYPEFACE-Free-Variable-Latin-Cyrillic

  Or: https://fontesk.com/moniqa-typeface/  (same font, "pay what you want",
  you can set it to 0)

  It is free for commercial use under the SIL Open Font License 1.1,
  so putting it on your site is fine.

WHAT TO DROP IN
  Put the file straight in this folder and name it one of these:

      Moniqa.woff2              <- best, if the download has a woff2
      Moniqa-Variable.woff2
      Moniqa-Regular.woff2
      Moniqa-Regular.otf        <- fine, most downloads are .otf
      Moniqa-Regular.ttf        <- also fine

  Any ONE of them is enough. styles.css already looks for all of these,
  so you do not have to touch any code. Refresh and it is there.

  If the zip has 162 styles, you only need one: a Regular or a Medium.
  The variable file, if there is one, is the best single choice.

IF YOU NEVER ADD IT
  The headline uses Syne, which is now the intended look rather than a
  placeholder, so you can ignore this whole file if you are happy with it.
  Adding a Moniqa file will silently override Syne.

ONE NOTE
  .otf and .ttf are heavier than .woff2 (often 5-10x). If the download
  only gives you .otf, it still works, it just costs your visitors a
  bigger file. You can convert it for free at cloudconvert.com or
  transfonter.org if you care.
