/* ============================================================
   THE PICTURE PEOPLE SEE BEFORE THEY SEE THE SITE

   Draws the ticket as a flat 1200x630 image. That picture is what WhatsApp,
   LinkedIn, Slack and the rest show when the link is pasted, and it has to
   be a real file at a real address because none of those run JavaScript.

   One copy of the drawing, used by two callers:
     - make-og.html, to look at it and save it by hand
     - admin.html, which redraws it automatically on save whenever any of
       the words in it have changed, so he never has to think about it

   window.drawOg(content) -> Promise<canvas>
   window.OG_FIELDS       -> the ticket fields the picture actually prints,
                             so admin knows when it has gone out of date
   ============================================================ */
(function () {
  var W = 1200, H = 630;
  var RED = '#E3261A', PAPER = '#F6F3EE', INK = '#0B0A09';

  /* Change this list if the drawing below starts printing something new, or
     admin will stop noticing that the picture needs redoing. */
  window.OG_FIELDS = ['band', 'badge', 'game', 'serial', 'name',
                      'titleTop', 'titleBottom', 'stampArc'];

  var FONT_HREF = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Syne:wght@400..800&display=block';

  function needFonts() {
    var have = false;
    Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"]'), function (l) {
      if ((l.href || '').indexOf('Syne') > -1) have = true;
    });
    if (!have) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = FONT_HREF;
      document.head.appendChild(l);
    }
    /* Ask for each face by name. A webfont is only fetched when something is
       about to be PAINTED in it, and a canvas never counts, so without this
       the drawing silently comes out in a system font and nobody notices
       until it is already sitting in somebody's chat window. */
    return Promise.all([
      document.fonts.load('800 132px "Syne"'),
      document.fonts.load('700 27px "Barlow Condensed"'),
      document.fonts.load('600 17px "Barlow Condensed"'),
      document.fonts.load('500 14px "Barlow Condensed"')
    ]).then(function () { return document.fonts.ready; });
  }

  window.drawOg = function (content) {
    var T = (content && content.ticket) || {};

    return needFonts().then(function () {
      var c = document.createElement('canvas');
      c.width = W; c.height = H;
      var x = c.getContext('2d');

      function tracked(text, px, weight, family, spacing) {
        x.font = weight + ' ' + px + 'px ' + family;
        x.letterSpacing = (spacing || 0) + 'px';
        return x.measureText(text).width;
      }

      /* Shrink until the longer line fits, the same idea as fitTitle() on the
         home page and for the same reason: he rewrites this line in admin and
         "copywriter" already ran off the edge once. */
      function fitTwo(a, b, maxW, start) {
        var size = start;
        for (var i = 0; i < 40; i++) {
          var w = Math.max(
            tracked(a, size, 800, '"Syne", sans-serif', -size * 0.035),
            tracked(b, size, 800, '"Syne", sans-serif', -size * 0.035));
          if (w <= maxW || size < 24) break;
          size = size * (maxW / w) * 0.995;
        }
        return size;
      }

      x.fillStyle = RED; x.fillRect(0, 0, W, H);

      /* the ticket, with the perforated bite down each side punched OUT of
         the paper rather than drawn on top of it */
      var TX = 46, TY = 40, TW = 1108, TH = 550, BH = 54;
      x.fillStyle = PAPER; x.fillRect(TX, TY, TW, TH);
      x.globalCompositeOperation = 'destination-out';
      for (var yy = TY + BH + 24; yy < TY + TH - 10; yy += 26) {
        x.beginPath(); x.arc(TX, yy, 6, 0, 7); x.fill();
        x.beginPath(); x.arc(TX + TW, yy, 6, 0, 7); x.fill();
      }
      x.globalCompositeOperation = 'source-over';

      /* the black band: his line left, the badge right */
      x.fillStyle = INK; x.fillRect(TX, TY, TW, BH);
      x.textBaseline = 'middle';
      x.fillStyle = PAPER;
      x.font = '600 17px "Barlow Condensed", sans-serif'; x.letterSpacing = '2.4px';
      x.fillText(String(T.band || '').toUpperCase(), TX + 30, TY + BH / 2 + 1);

      var badge = String(T.badge || '').toUpperCase();
      if (badge) {
        var bw = tracked(badge, 15, 700, '"Barlow Condensed", sans-serif', 2.2) + 30;
        x.fillStyle = RED;
        x.fillRect(TX + TW - 30 - bw, TY + 13, bw, BH - 26);
        x.fillStyle = PAPER;
        x.font = '700 15px "Barlow Condensed", sans-serif'; x.letterSpacing = '2.2px';
        x.fillText(badge, TX + TW - 30 - bw + 15, TY + BH / 2 + 1);
      }

      /* microtype row */
      x.fillStyle = 'rgba(11,10,9,.58)';
      x.font = '500 14px "Barlow Condensed", sans-serif'; x.letterSpacing = '2.1px';
      x.fillText(String(T.game || '').toUpperCase(), TX + 30, TY + BH + 34);
      var ser = String(T.serial || '').toUpperCase();
      var sw = tracked(ser, 14, 500, '"Barlow Condensed", sans-serif', 2.1);
      x.font = '500 14px "Barlow Condensed", sans-serif'; x.letterSpacing = '2.1px';
      x.fillText(ser, TX + TW - 30 - sw, TY + BH + 34);

      /* his name: the only thing that says whose site this is */
      x.fillStyle = INK;
      x.font = '700 27px "Barlow Condensed", sans-serif'; x.letterSpacing = '4.6px';
      x.fillText(String(T.name || '').toUpperCase(), TX + 30, TY + BH + 76);

      /* the headline, centred in the gap between the two blocks of furniture */
      var top = String(T.titleTop || ''), bot = String(T.titleBottom || '');
      var size = fitTwo(top, bot, TW - 60, 132);
      x.font = '800 ' + size + 'px "Syne", sans-serif';
      x.letterSpacing = (-size * 0.035) + 'px';
      x.textBaseline = 'alphabetic';
      var gapTop = TY + BH + 96, gapBot = TY + TH - 52;
      var base = gapTop + (gapBot - gapTop - size * 1.9) / 2 + size * 0.94;
      x.fillStyle = INK; x.fillText(top, TX + 28, base);
      x.fillStyle = RED; x.fillText(bot, TX + 28, base + size * 0.9);

      /* Bottom left is his stamp line, not the serial again: the serial is
         already top right and saying it twice in one picture is a stutter. */
      x.textBaseline = 'middle';
      x.fillStyle = 'rgba(11,10,9,.55)';
      x.font = '500 15px "Barlow Condensed", sans-serif'; x.letterSpacing = '2px';
      x.fillText(String(T.stampArc || T.serial || '').toUpperCase(), TX + 30, TY + TH - 26);

      var site = 'MOHAMMEDESSAM.COM';
      var wsite = tracked(site, 15, 600, '"Barlow Condensed", sans-serif', 2);
      x.fillStyle = RED;
      x.font = '600 15px "Barlow Condensed", sans-serif'; x.letterSpacing = '2px';
      x.fillText(site, TX + TW - 30 - wsite, TY + TH - 26);

      x.letterSpacing = '0px';
      return c;
    });
  };
})();
