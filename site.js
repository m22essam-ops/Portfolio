/* Shared bits for every page: top nav, footer, scroll effects, scroll reveals.
   Loaded after content.js on every page. Do not edit unless you know what
   you are doing. */
(function () {
  var C = window.SITE_CONTENT || {};

  /* ----- top nav -----
     The logo is a two-line lockup: the name in capitals, the job underneath
     and deliberately not bold. Plain text, no red dot: the trailing period
     used to be wrapped in an <em> and coloured, which was the "red dot". */
  var logo = document.querySelector('.logo');
  if (logo && C.nav && C.nav.logo) {
    var name = String(C.nav.logo).replace(/\s*\.\s*$/, '');
    logo.textContent = '';
    var b = document.createElement('b');
    b.textContent = name.toUpperCase();
    logo.appendChild(b);
    if (C.nav.role) {
      var role = document.createElement('span');
      role.textContent = C.nav.role;
      logo.appendChild(role);
    }
  }
  var badgeText = document.querySelector('.badge-text');
  if (badgeText && C.nav && C.nav.badge) {
    badgeText.textContent = C.nav.badge;
  }
  var tagline = document.querySelector('.tagline');
  if (tagline && C.nav && C.nav.tagline) {
    tagline.textContent = C.nav.tagline;
  }

  /* ----- THE FOOTER -----
     One line. The owner killed the stub: no columns, no barcode, no giant
     wordmark. `footer.line` is the whole sentence and `footer.linkText` is
     the piece of it that becomes the mailto, so he writes one sentence in
     admin and the link follows whatever he writes.
     Built here rather than in each page's HTML so there is one copy of it. */
  var foot = document.getElementById('siteFoot');
  if (foot) {
    var F = C.footer || {};
    var esc = function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    var line = String(F.line || '').trim();
    if (line) {
      var url = F.linkUrl || (C.contact && C.contact.ctaUrl) || '';
      var bit = String(F.linkText || '').trim();
      var at  = bit ? line.toLowerCase().indexOf(bit.toLowerCase()) : -1;
      var out;
      if (at > -1 && url) {
        /* keep his own capitalisation by slicing the sentence, not the needle */
        out = esc(line.slice(0, at)) +
              '<a href="' + esc(url) + '">' + esc(line.substr(at, bit.length)) + '</a>' +
              esc(line.slice(at + bit.length));
      } else if (url) {
        out = '<a href="' + esc(url) + '">' + esc(line) + '</a>';
      } else {
        out = esc(line);
      }
      /* The social row, drawn from contact.links so admin stays the one place
         he edits. Icons are inline SVG rather than a font or an image set:
         nothing to download, sharp at any size, and they take their colour
         from the link. A link whose name has no icon here falls back to its
         label as text, so adding one in admin can never leave a blank hole. */
      var ICON = {
        instagram: '<rect x="2.4" y="2.4" width="19.2" height="19.2" rx="5.4"/>' +
                   '<circle cx="12" cy="12" r="4.5"/>' +
                   '<circle cx="17.5" cy="6.5" r="1.35" class="fill"/>',
        linkedin:  '<rect x="2.4" y="2.4" width="19.2" height="19.2" rx="3"/>' +
                   '<circle cx="7.2" cy="7.5" r="1.45" class="fill"/>' +
                   '<path class="fill" d="M6.05 10.2h2.3V18h-2.3z"/>' +
                   '<path class="fill" d="M10.8 18v-7.8h2.2v1.06a3 3 0 0 1 2.6-1.26c1.98 0 3 1.28 3 3.55V18h-2.3v-4.1c0-1.15-.42-1.83-1.4-1.83s-1.8.7-1.8 1.87V18z"/>',
        vimeo:     '<path class="fill" d="M21.9 7.3c-.1 2.06-1.55 4.9-4.35 8.5C14.66 19.6 12.2 21.5 10.2 21.5c-1.25 0-2.3-1.14-3.15-3.43L5.4 12.2C4.77 9.9 4.1 8.76 3.38 8.76c-.16 0-.7.32-1.63.96L.8 8.6c1-.87 1.98-1.75 2.95-2.63C5.07 4.76 6.06 4.16 6.73 4.1c1.58-.15 2.55.92 2.92 3.2.4 2.47.67 4 .83 4.6.47 2.14.99 3.2 1.56 3.2.44 0 1.1-.7 1.98-2.08.88-1.4 1.35-2.45 1.4-3.18.1-.94-.28-1.42-1.14-1.42-.4 0-.83.1-1.27.28C13.86 5.5 15.5 4 17.9 4.08c1.78.05 2.62 1.13 2.5 3.22z"/>',
        whatsapp:  '<path d="M12 2.6a9.4 9.4 0 0 0-8.06 14.2L2.7 21.3l4.6-1.2A9.4 9.4 0 1 0 12 2.6z" stroke-linejoin="round"/>' +
                   '<path class="fill" d="M9.2 7.9c-.17-.4-.35-.4-.52-.41h-.44c-.15 0-.4.06-.62.3-.21.24-.82.8-.82 1.95s.84 2.26.96 2.42c.11.15 1.62 2.6 4 3.54 1.98.78 2.38.63 2.81.59.43-.04 1.38-.56 1.58-1.11.2-.55.2-1.02.14-1.11-.06-.1-.22-.16-.45-.28-.23-.11-1.38-.68-1.6-.76-.21-.08-.36-.11-.52.12-.16.24-.6.76-.74.92-.14.15-.27.17-.5.06-.24-.12-1-.36-1.89-1.16-.7-.62-1.17-1.38-1.3-1.61-.14-.24-.02-.36.1-.48.1-.1.23-.27.35-.41.11-.14.15-.24.23-.4.08-.15.04-.29-.02-.4-.06-.12-.51-1.28-.72-1.74z"/>'
      };
      var social = (C.contact && C.contact.links || []).map(function (l) {
        if (!l || !l.url || /^mailto:/i.test(l.url)) return '';   /* the email is the line */
        var key = String(l.label || l.url).toLowerCase();
        var name = '';
        for (var k in ICON) if (key.indexOf(k) > -1) { name = k; break; }
        var label = esc(l.label || name || l.url);
        if (!name) return '<a class="txt" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + label + '</a>';
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener" aria-label="' + label + '">' +
               '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + '</svg></a>';
      }).join('');

      foot.className = 'foot';
      foot.innerHTML = '<div class="wrap foot-in"><p>' + out + '</p>' +
        (social ? '<div class="foot-social">' + social + '</div>' : '') + '</div>';
    } else {
      foot.remove();
    }
  }

  /* ----- the work section's own tier in the header -----
     Work that worked is a page inside the work section, so the header says so
     with a second tier rather than a tab dangling off one link. A floating
     lozenge centred under a nav item aligns to nothing and reads as a
     dropdown that forgot to drop; a tier aligned to the same left margin as
     the logo and the page's content reads as structure.

     It appears on the two work index pages, which is where the choice between
     them means anything. From anywhere else The work is one click away and
     the tier is waiting there. Built here rather than in each page's HTML so
     there is one copy of it. */
  var navBar = document.querySelector('.page-nav');
  var qs = new URLSearchParams(location.search);
  var onWorkIndex = /(^|\/)work\.html$/.test(location.pathname) && !qs.get('slug');

  if (navBar && onWorkIndex && !navBar.querySelector('.nav-sec')) {
    var W = C.work || {};
    var ran = /[?&]ran=1\b/.test(location.search);
    var strip = function (s, fallback) {
      var t = String(s == null ? '' : s).trim().replace(/\.\s*$/, '');
      return t || fallback;
    };
    /* "All work" is a navigation label, not a headline: his own heading for
       that page is "The work", which under a nav item already reading THE WORK
       would just say it twice. */
    var tiers = [
      { href: 'work.html',       label: 'All work',                              on: !ran },
      { href: 'work.html?ran=1', label: strip(W.ranHeading, 'Work that worked'), on: ran }
    ];

    var sec = document.createElement('div');
    sec.className = 'nav-sec';
    var secWrap = document.createElement('div');
    secWrap.className = 'wrap';
    /* built as nodes, not as a string: the label is his copy out of admin and
       textContent cannot be talked into being markup */
    tiers.forEach(function (t) {
      var a = document.createElement('a');
      a.className = 'nav-sec-a' + (t.on ? ' on' : '');
      a.href = t.href;
      a.textContent = t.label;
      if (t.on) a.setAttribute('aria-current', 'page');
      secWrap.appendChild(a);
    });
    sec.appendChild(secWrap);
    navBar.appendChild(sec);
    navBar.classList.add('has-sec');

    /* the top row marks the section, the tier marks the page inside it */
    var topWork = navBar.querySelector('.links a[href="work.html"], .links a[href="./work.html"]');
    if (topWork) topWork.classList.add('on');
  }

  /* ----- nav shrink on scroll ----- */
  var nav = document.getElementById('siteNav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 12); };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- scroll-triggered reveals -----
     Pages that inject content after load (the work cards on index.html)
     call observeReveals() again once the new elements exist. */
  /* It plays every time, not once. It used to unobserve on the first sighting,
     so scrolling back up and coming down again showed the cards already
     landed and nothing moved. Now the class is taken off again, but ONLY once
     the card is completely out of the viewport: resetting at the 15% mark
     would make a card visibly un-draw while a sliver of it was still on
     screen. Two thresholds, because 0 is the one that reports "fully gone". */
  window.observeReveals = function () {
    var els = document.querySelectorAll('.reveal:not(.is-observed)');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      [].forEach.call(els, function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else if (entry.intersectionRatio === 0) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: [0, 0.15], rootMargin: '0px 0px -40px 0px' });
    [].forEach.call(els, function (el) {
      el.classList.add('is-observed');
      io.observe(el);
    });
  };
  observeReveals();

  /* ----- arriving at the footer -----
     The footer is built above, so it is watched here rather than carrying a
     .reveal class in anyone's HTML. It fires earlier than the cards do (a
     positive rootMargin, so it starts while it is still below the fold) and
     it resets the same way, so it plays again on every trip back down. */
  if (foot && foot.classList.contains('foot') && 'IntersectionObserver' in window) {
    var footIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) foot.classList.add('is-near');
        else if (entry.intersectionRatio === 0) foot.classList.remove('is-near');
      });
    }, { threshold: [0, 0.08], rootMargin: '0px 0px 90px 0px' });
    footIo.observe(foot);
  } else if (foot) {
    foot.classList.add('is-near');
  }

  /* ----- image helper: full http(s) links pass through, file names point
         into the images/ folder. ----- */
  window.imgSrc = function (src) {
    if (!src) return '';
    if (/^https?:\/\//i.test(src)) return src;
    return 'images/' + String(src).replace(/^images\//, '');
  };

  /* ----- theme toggle (dark ↔ light) ----- */
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    var saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      toggle.textContent = '🌙';
    }
    toggle.addEventListener('click', function () {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        toggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        toggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
      }
    });
  }
})();
