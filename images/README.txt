This folder holds the images for the portfolio. Every image the site
shows, except images that live on the web already, goes here.

THE EASY NAMING TRICK
Use the project's slug as the file name. The slug is the "Link address"
field in admin.html, for example "yango-unstoppable-rides". So the file
would be:

    images/yango-unstoppable-rides.jpg

A slug-style name means you can find the right image in seconds and you
never need to think about what to call it.

HOW TO REPLACE A PLACEHOLDER (picsum) IMAGE
1. Save your screenshot here with a slug-style name, e.g.
   images/yango-unstoppable-rides.jpg
2. Open admin.html, open that project's card.
3. In the "Cover image" field, type the file name only:
   yango-unstoppable-rides.jpg
   (no "images/" prefix, no slashes. A live preview appears below the
   field, so you can check you picked the right file.)
4. Click "Download updated content.js" and replace the old content.js in
   the site folder, or click "Save to GitHub" for a one-click publish.
5. Refresh the site to see it.

The "Pick file" button next to the field copies the exact file name for
you, to avoid typos. The file still needs to be saved into this folder.

Image links that start with http (like the current placeholders) do not
need to be in this folder.

Files used by the site right now:
- about-photo.jpg — the About page portrait (real childhood photo).
- project cover images are still placeholders (picsum.photos links) until
  real screenshots replace them using the steps above.
