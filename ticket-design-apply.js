/* ============================================================
   ticket-design-apply.js  ·  the ticket designer's other half

   One applier, used twice: preview-brutalist.html calls it on load, and
   ticket-designer.html calls it on every keystroke through the iframe. That
   is the whole reason it is a file and not two copies of the same idea. The
   editor and the preview cannot disagree about what a design means, because
   there is only one of them.

   The data it eats lives in ticket-design.js as window.TICKET_DESIGN.
   No design, or an empty one, and the ticket is EXACTLY the ticket. Same
   contract as layout in content.js: absent means untouched, and deleting the
   file puts everything back.

   It never writes to content.js and it has no idea GitHub exists.
   ============================================================ */
(function () {
  'use strict';

  /* ---- the slot table: the single list of what can be edited ----
     The editor builds its whole inspector from this, so adding a row here
     is the only step needed to make a new thing editable. Fields:
       k      the key used in the design file
       sel    how to find it
       name   what he sees in the panel
       text   the content.js path it is printed from, or null if it is not words
       group  which panel it lands in                                       */
  var SLOTS = [
    { k: 'hMotto',    sel: '#hMotto',    name: 'Band line, left',   text: 'ticket.band',        group: 'Band' },
    { k: 'hBadge',    sel: '#hBadge',    name: 'Badge, right',      text: 'ticket.badge',       group: 'Band' },

    { k: 'hValorLbl', sel: '#hValorLbl', name: 'Price label',       text: null,                 group: 'Left rail' },
    { k: 'hValorVal', sel: '#hValorVal', name: 'Price',             text: null,                 group: 'Left rail' },
    { k: 'hSerieLbl', sel: '#hSerieLbl', name: 'Series label',      text: null,                 group: 'Left rail' },
    { k: 'hSerieVal', sel: '#hSerieVal', name: 'Series',            text: null,                 group: 'Left rail' },
    { k: 'hValorLbl2',sel: '#hValorLbl2',name: 'Price back label',  text: null,                 group: 'Left rail' },
    { k: 'hValorVal2',sel: '#hValorVal2',name: 'Price back',         text: null,                 group: 'Left rail' },
    { k: 'hSerieLbl2',sel: '#hSerieLbl2',name: 'Series back label',  text: null,                 group: 'Left rail' },
    { k: 'hSerieVal2',sel: '#hSerieVal2',name: 'Series back',        text: null,                 group: 'Left rail' },
    { k: 'hMed',      sel: '#hMed',      name: 'Portrait',          text: null,                 group: 'Left rail' },

    { k: 'hKick',     sel: '#hKick',     name: 'Kicker',            text: 'ticket.game',        group: 'Centre' },
    { k: 'hName',     sel: '#hName',     name: 'Name',              text: 'ticket.name',        group: 'Centre' },
    { k: 'hHead',     sel: '#hHead',     name: 'Headline, block',   text: null,                 group: 'Centre' },
    { k: 'hHeadTop',  sel: '#hHeadTop',  name: 'Headline line 1',   text: 'ticket.titleTop',    group: 'Centre' },
    { k: 'hHeadBot',  sel: '#hHeadBot',  name: 'Headline line 2',   text: 'ticket.titleBottom', group: 'Centre' },

    { k: 'hPremios',  sel: '#hPremios',  name: 'Side heading',      text: null,                 group: 'Right rail' },
    { k: 'hLeg0q',    sel: '#hLeg0q',    name: 'Row 1 number',      text: null,                 group: 'Right rail' },
    { k: 'hLeg0w',    sel: '#hLeg0w',    name: 'Row 1 word',        text: null,                 group: 'Right rail' },
    { k: 'hLeg1q',    sel: '#hLeg1q',    name: 'Row 2 number',      text: null,                 group: 'Right rail' },
    { k: 'hLeg1w',    sel: '#hLeg1w',    name: 'Row 2 word',        text: null,                 group: 'Right rail' },
    { k: 'hLeg2q',    sel: '#hLeg2q',    name: 'Row 3 number',      text: null,                 group: 'Right rail' },
    { k: 'hLeg2w',    sel: '#hLeg2w',    name: 'Row 3 word',        text: null,                 group: 'Right rail' },
    { k: 'hPrizeLbl', sel: '#hPrizeLbl', name: 'Prize label',       text: null,                 group: 'Right rail' },
    { k: 'hPrize',    sel: '#hPrize',    name: 'Prize',             text: 'the mailto label',   group: 'Right rail' },
    { k: 'hPrizeBtn', sel: '#hPrizeBtn', name: 'Claim button',      text: null,                 group: 'Right rail' },

    { k: 'hLegal',    sel: '#hLegal',    name: 'Fine print',        text: 'ticket.terms',       group: 'Fine print' },
    { k: 'hCode',     sel: '#hCode',     name: 'Barcode',           text: null,                 group: 'Fine print' },

    { k: 'ticket',    sel: '.ticket',    name: 'The card',          text: null,                 group: 'Boxes' },
    { k: 'band',      sel: '.tk-band',   name: 'Black band',        text: null,                 group: 'Boxes' },
    { k: 'grid',      sel: '.tk-grid',   name: 'Three columns',     text: null,                 group: 'Boxes' },
    { k: 'rail',      sel: '.tk-rail',   name: 'Left column',       text: null,                 group: 'Boxes' },
    { k: 'main',      sel: '.tk-main',   name: 'Centre column',     text: null,                 group: 'Boxes' },
    { k: 'side',      sel: '.tk-side',   name: 'Right column',      text: null,                 group: 'Boxes' },
    { k: 'scratch',   sel: '.scratch',   name: 'Scratch panel',     text: null,                 group: 'Boxes' },
    { k: 'legal',     sel: '.legal',     name: 'Fine print bar',    text: null,                 group: 'Boxes' }
  ];

  /* Geometry moves with the screen; paint does not.
     Anything in this list is emitted inside @media (min-width:1001px), so a
     nudge made on a 1400px composition cannot reach a phone, where .tk-grid
     is one column and .legal is stacked. Getting this wrong would let one
     dragged element quietly undo the whole mobile layout. */
  var GEOMETRY = {
    'transform': 1, 'padding': 1, 'padding-top': 1, 'padding-right': 1,
    'padding-bottom': 1, 'padding-left': 1, 'margin': 1, 'margin-top': 1,
    'margin-right': 1, 'margin-bottom': 1, 'margin-left': 1, 'gap': 1,
    'row-gap': 1, 'column-gap': 1, 'grid-template-columns': 1, 'min-height': 1,
    'height': 1, 'width': 1, 'max-width': 1, 'align-content': 1,
    'align-items': 1, 'justify-items': 1, 'justify-content': 1,
    'text-align': 1, 'border-width': 1, 'flex-direction': 1
  };

  var STYLE_EL_ID = 'ticketDesignOverrides';

  /* fontSize -> font-size, but --perfR is left alone. Kebabbing a custom
     property turns --perfR into ---perf-r, which is a different property
     that nothing reads and no error is raised about. */
  function kebab(s) {
    if (s.slice(0, 2) === '--') return s;
    return s.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); });
  }

  /* A value goes into a stylesheet, so a stray brace or semicolon would let
     one field rewrite every rule under it. Strip the three characters that
     can end a declaration and nothing else: he is typing lengths and colours,
     not markup, and a filter that guesses at "valid CSS" would reject the
     next thing he wants to try. */
  function clean(v) {
    return String(v).replace(/[;{}<]/g, '').trim();
  }

  /* ---- an element's WORDS are its text nodes; its element children are
     furniture ----

     The headline's first line carries a footnote mark, `<i class="fn">*</i>`,
     and the old code read and wrote the whole element with textContent. That
     did two wrong things at once: it stashed "AWARD-LOSING*" as the original
     words, and the first edit in the Copy panel deleted the asterisk. The
     mark is set by the design, not typed by him, so it survives an edit and
     never appears in the field he is typing into. */
  function isWords(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 1 && n.tagName !== 'I' && n.tagName !== 'BR') return false;
    }
    return true;
  }
  function wordsOf(el) {
    var s = '';
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) s += el.childNodes[i].nodeValue;
    }
    return s;
  }
  function setWords(el, v) {
    if (!isWords(el)) return;
    var keep = [], i;
    for (i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 1) keep.push(el.childNodes[i]);
    }
    el.textContent = v;
    for (i = 0; i < keep.length; i++) el.appendChild(keep[i]);
  }

  function ruleFor(sel, props) {
    var out = '';
    for (var p in props) {
      if (!Object.prototype.hasOwnProperty.call(props, p)) continue;
      var v = clean(props[p]);
      if (v === '') continue;
      out += kebab(p) + ':' + v + ';';
    }
    return out ? sel + '{' + out + '}' : '';
  }

  function applyTicketDesign(D, doc) {
    doc = doc || document;
    D = D || {};
    var i, s;

    /* ---- 1. the root variables ---- */
    var root = doc.documentElement;
    var vars = D.vars || {};
    /* clear first: a variable he set and then cleared has to come off the
       element, or the last value he typed is stuck there forever */
    var known = ['--red', '--ink', '--paper', '--neon', '--silver', '--silver-hi',
                 '--mono', '--disp', '--rule', '--hair', '--grain', '--scuff'];
    for (i = 0; i < known.length; i++) root.style.removeProperty(known[i]);
    for (var v in vars) {
      if (!Object.prototype.hasOwnProperty.call(vars, v)) continue;
      if (String(vars[v]).trim() === '') continue;
      root.style.setProperty(v, clean(vars[v]));
    }

    /* ---- 2. the body classes: ground and ink count ---- */
    var b = doc.body;
    if (b) {
      var tex = (D.body && D.body.texture) || 'tex-grain';
      b.className = b.className.replace(/\btex-\S+/g, '').trim();
      b.classList.add(tex);
      b.classList.toggle('ink1', !!(D.body && D.body.inks === 'ink1'));
    }

    /* ---- 3. text ----
       Set before the stylesheet so a size measured off new words is measured
       off the words that are actually there. An empty string is a real
       choice (he can blank the badge), so only undefined means "leave it". */
    var text = D.text || {};
    for (i = 0; i < SLOTS.length; i++) {
      s = SLOTS[i];
      var el = doc.querySelector(s.sel);
      if (!el) continue;
      /* stash what the page printed from content.js BEFORE overwriting it,
         once and once only. It is how the editor can say "this line is no
         longer his line", and how Revert has something to revert to. */
      if (!el.hasAttribute('data-orig') && isWords(el)) {
        el.setAttribute('data-orig', wordsOf(el));
      }
      if (!(s.k in text)) {
        /* cleared in the editor: put content.js's words back */
        if (el.hasAttribute('data-orig')) setWords(el, el.getAttribute('data-orig'));
        continue;
      }
      setWords(el, text[s.k]);
    }

    /* ---- 4. one stylesheet, rebuilt whole ----
       Rebuilt rather than patched: a design is a complete statement, and
       patching leaves last edit's properties behind on the element he just
       reset. Two blocks, because geometry is desktop-only (see GEOMETRY). */
    var paint = '', geo = '';
    var styles = D.style || {}, offs = D.offset || {};
    for (i = 0; i < SLOTS.length; i++) {
      s = SLOTS[i];
      var own = styles[s.k] || {};
      var p = {}, g = {}, any = false;
      for (var k in own) {
        if (!Object.prototype.hasOwnProperty.call(own, k)) continue;
        if (String(own[k]).trim() === '') continue;
        (GEOMETRY[kebab(k)] ? g : p)[k] = own[k];
        any = true;
      }
      var o = offs[s.k];
      if (o && (o.x || o.y)) {
        g.transform = 'translate(' + (+o.x || 0) + 'px,' + (+o.y || 0) + 'px)';
        any = true;
      }
      if (!any) continue;
      /* an id already outranks the class rules in the sheet; a class selector
         only ties, and ties are broken by order, which this block wins by
         being appended last */
      paint += ruleFor(s.sel, p);
      geo += ruleFor(s.sel, g);
    }

    var css = paint + (geo ? '@media (min-width:1001px){' + geo + '}' : '');
    if (D.css) css += '\n' + D.css;      /* his own hand-written rules, last */

    var tag = doc.getElementById(STYLE_EL_ID);
    if (!tag) {
      tag = doc.createElement('style');
      tag.id = STYLE_EL_ID;
      doc.head.appendChild(tag);          /* last in the head, so ties go to it */
    }
    tag.textContent = css;

    /* ---- 4b. the portrait ----
       Redrawn rather than re-src'd, and only when something about it actually
       changed: the halftone reads the photo pixel by pixel and rebuilding it
       on every keystroke would make the whole card stutter. */
    var wv = doc.defaultView;
    if (wv && typeof wv.__ticketSetPhoto === 'function') {
      var crop = { zoom: D.photoZoom, x: D.photoX, y: D.photoY, ink: D.photoInk };
      var want = [D.photo || wv.__ticketPhotoDefault || '', D.photoDots,
                  crop.zoom, crop.x, crop.y, crop.ink].join('|');
      if (wv.__ticketPhotoState !== want) {
        wv.__ticketPhotoState = want;
        wv.__ticketSetPhoto(D.photo || wv.__ticketPhotoDefault, D.photoDots, crop);
      }
    }

    /* ---- 5. hand the page back to its own script ----
       fitHead() sizes the headline to its column and alignInk() corrects the
       side bearings. Both are inline styles, so both outrank the sheet above
       and both are measured off the old words unless they are re-run. If he
       has pinned a headline size, fitHead() stands down instead. */
    var fixed = !!(styles.hHead && String(styles.hHead.fontSize || '').trim());
    var w = doc.defaultView;
    if (w) {
      w.__ticketHeadFixed = fixed;
      if (fixed) {
        var hh = doc.getElementById('hHead');
        if (hh) hh.style.fontSize = '';   /* let the sheet's size through */
      }
      if (typeof w.__ticketRealign === 'function') w.__ticketRealign();
    }
    return css;
  }

  window.TICKET_SLOTS = SLOTS;
  window.applyTicketDesign = applyTicketDesign;

  /* Self-start, but only where there is a ticket to paint. The editor loads
     this file too, in its own document, where there is nothing to find. */
  if (document.querySelector('.tk-grid')) {
    var boot = function () { applyTicketDesign(window.TICKET_DESIGN); };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
    /* the webfonts change every measurement, so once more when they land */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  }
})();
