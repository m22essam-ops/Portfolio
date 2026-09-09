#!/usr/bin/env python3
"""Build index.html from preview-brutalist.html.

The live home page is GENERATED. Edit preview-brutalist.html and run this;
never hand-edit index.html, or the next build silently throws the edit away.

    python3 build-index.py

Why this file exists at all: this transformation was done by a throwaway script
in a scratch directory, twice, and both times the script was gone by the next
session and the edits had to be re-derived by diffing the two files. It is four
steps and it belongs in the repository.

What it does, and why each step:

  1. HEAD. preview-brutalist.html has a working head with no og: tags. The live
     page needs them, and they must be STATIC: the apps that draw link previews
     do not run JavaScript, so nothing here can come out of content.js. The og
     block is held in this file rather than read back out of index.html, so a
     broken index.html cannot poison the next build.

  2. `if (/[?&]only=home/...)` becomes `if (true)`. The preview shows five
     screens and switches to the single full-bleed card on a query string. The
     live page IS that card, always.

  3. Screens 02 to 05 are cut from the markup. The runtime block in step 2
     also removes them, but shipping four screens of reference material to
     every visitor so a script can delete them is waste, and it puts the work
     grid's markup on the home page where a scraper can read it.

  4. The control bar and its 44px spacer go, for the same reason.

Every step asserts. A silent partial build is how you end up with a home page
missing its headline, so this stops rather than writing a file it is unsure of.
"""

import re
import sys
import pathlib

HERE = pathlib.Path(__file__).parent
SRC = HERE / "preview-brutalist.html"
OUT = HERE / "index.html"

# --- 1. the head ----------------------------------------------------------
# Everything from <!DOCTYPE> down to and including the Google Fonts <link>.
# The preview's own <title> ("Brutalist ticket system") is NOT carried over;
# an earlier build kept it and the live page shipped with two <title> tags.
HEAD = """<!DOCTYPE html>
<!-- ============================================================
     THE HOME PAGE  ·  the brutalist lottery ticket

     GENERATED FILE. Do not edit by hand.
     Source: preview-brutalist.html   Build: python3 build-index.py
     ============================================================ -->
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mohammed Essam, award-losing copywriter</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="Mohammed Essam">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="Mohammed Essam, award-losing copywriter">
<meta property="og:description" content="Mohammed Essam, copywriter. Cairo, Dubai, Madrid. Work that ran, and work that didn&#x27;t.">
<meta property="og:url" content="https://www.mohammedessam.com/">
<meta property="og:image" content="https://www.mohammedessam.com/images/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="A lottery ticket that reads: Award-losing copywriter.">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://www.mohammedessam.com/">
<meta name="description" content="Mohammed Essam, copywriter. Cairo, Dubai, Madrid. Work that ran, and work that didn't.">
<link rel="icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Doto:wght@400;700;900&family=Nova+Mono&family=Archivo+Black&family=Instrument+Serif:ital@0;1&family=Anton&display=swap" rel="stylesheet">
"""


def die(msg):
    sys.exit("build-index.py: " + msg)


def main():
    if not SRC.exists():
        die("cannot find %s" % SRC.name)
    src = SRC.read_text(encoding="utf-8")

    # --- 1. swap the head -------------------------------------------------
    i = src.find("<style>")
    if i == -1:
        die("no <style> in the source; the head boundary moved")
    out = HEAD + src[i:]

    # --- 2. force the single-screen mode ----------------------------------
    needle = "if (/[?&]only=home/.test(location.search)) {"
    if out.count(needle) != 1:
        die("expected exactly 1 only=home switch, found %d" % out.count(needle))
    out = out.replace(needle, "if (true) {   /* build-index.py: the live page IS the card */")

    # --- 3. cut screens 02 to 05 ------------------------------------------
    # Split on the section opening tag rather than regex-matching the whole
    # element: these sections contain nested markup and a lazy regex would
    # stop at the first </section> inside one.
    parts = re.split(r'(?=<section class="screen")', out)
    if len(parts) != 6:
        die("expected 5 screen sections, found %d" % (len(parts) - 1))
    head_part, screen01 = parts[0], parts[1]
    tail = parts[-1]
    # keep whatever follows the LAST </section> (the scripts)
    close = tail.rfind("</section>")
    if close == -1:
        die("no closing </section> on the last screen")
    out = head_part + screen01[: screen01.rfind("</section>") + len("</section>")] + tail[close + len("</section>") :]

    # --- 4. the control bar and its spacer --------------------------------
    for dead in ('<div class="bar" id="bar"></div>\n', '<div style="height:44px"></div>\n'):
        if dead not in out:
            die("could not find %r to remove" % dead)
        out = out.replace(dead, "")

    # --- checks that the page still IS the page ---------------------------
    for must in ['id="hHead"', 'id="hSub"', 'id="hLegend"', 'id="hLegal"',
                 'class="ticket perf paper"', "content.js"]:
        if must not in out:
            die("the built page is missing %s" % must)
    if out.count('<section class="screen"') != 1:
        die("built page has %d screens, want 1" % out.count('<section class="screen"'))
    if "<title>Brutalist ticket system</title>" in out:
        die("the preview's title leaked into the build")

    OUT.write_text(out, encoding="utf-8")
    print("built %s  (%d lines from %d)" % (OUT.name, out.count("\n") + 1, src.count("\n") + 1))


if __name__ == "__main__":
    main()
