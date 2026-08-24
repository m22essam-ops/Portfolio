/* Shared bits for every page: top nav, footer, scroll effects, scroll reveals.
   Loaded after content.js on every page. Do not edit unless you know what
   you are doing. */
(function () {
  var C = window.SITE_CONTENT || {};

  /* ================= A SECOND LANGUAGE =================
     A feasibility test, not a translated site. Two things carry one so far:
     the About page (`about.ja`) and the Rivan Tower project
     (`work.projects[].ja`). `i18n.<lang>` holds the furniture round them,
     meaning the words a page prints itself rather than the words he wrote.

     It all lives here rather than in each page because both pages need the
     same four moves, and a second copy of this is a second copy to get wrong.

     THE RULE THAT MAKES IT SAFE: a switch is only ever drawn for content that
     actually HAS the other language. It can never be a door into a page that
     is still in English.
     ==================================================== */
  var LANGS = window.LANGS = C.i18n || {};

  function esc1(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* which language the URL is asking for, if it is one we have */
  window.langWanted = function () {
    var q = String(new URLSearchParams(location.search).get('lang') || '').toLowerCase();
    return (q && LANGS[q]) ? q : '';
  };

  window.applyLang = function (lang) {
    if (!lang) return;
    document.documentElement.lang = lang;
    document.body.classList.add('lang-' + lang);
    if (lang === 'ja') {
      /* Fetched only when Japanese is actually on screen. It is a large
         family and the English site has no use for it. Note it goes at the
         END of the stacks in styles.css, never the front: font fallback is
         per character, so Latin still comes out of Syne, Bricolage and
         Barlow and only the Japanese falls through to Noto. */
      var f = document.createElement('link');
      f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap';
      document.head.appendChild(f);
    }
  };

  /* the EN | JA row. `has` is the languages THIS page has, not all of them. */
  window.langSwitch = function (baseHref, has, current) {
    has = (has || []).filter(function (k) { return LANGS[k]; });
    if (!has.length) return '';
    var join = baseHref.indexOf('?') > -1 ? '&' : '?';
    var out = '<a href="' + esc1(baseHref) + '" lang="en"' +
              (current ? '' : ' class="on" aria-current="true"') + '>EN</a>';
    has.forEach(function (k) {
      out += '<span class="bar" aria-hidden="true">|</span>' +
             '<a href="' + esc1(baseHref + join + 'lang=' + encodeURIComponent(k)) +
             '" lang="' + esc1(k) + '"' +
             (k === current ? ' class="on" aria-current="true"' : '') + '>' +
             esc1(LANGS[k].label || k.toUpperCase()) + '</a>';
    });
    return '<p class="lang-switch">' + out + '</p>';
  };

  /* one field at a time, so a half-finished translation shows his English for
     whatever it has not reached rather than leaving a hole */
  window.langPick = function (obj, alt) {
    return function (key) {
      if (alt && alt[key] != null && String(alt[key]).trim()) return alt[key];
      return (obj || {})[key];
    };
  };

  /* Two parallel lists merged by POSITION, which is only trustworthy while
     they are the same length. Add or delete a credit or a job in admin and
     the translated list no longer lines up, which would put the wrong job
     title against a real person's name, or the wrong dates against a real
     employer. If the counts disagree the translation is dropped and the list
     comes out in English. An English row is a small loss; a wrong one is
     somebody else's problem. */
  window.langRows = function (rows, altRows, keys) {
    rows = rows || [];
    altRows = (altRows && altRows.length === rows.length) ? altRows : [];
    return rows.map(function (r, i) {
      var t = altRows[i] || {}, out = {};
      keys.forEach(function (k) {
        out[k] = (t[k] && String(t[k]).trim()) ? t[k] : r[k];
      });
      return out;
    });
  };

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

  /* ----- the work menu -----
     Hover The work and the two pages inside it drop down. Like every menu in
     the world, on purpose: a section tier was tried instead and it was one
     step too many, because it only appeared once you were already on a work
     page. From here it is one move from anywhere on the site.

     Built here rather than in each page's HTML so there is one copy of it,
     and hung off whichever link actually points at the work page so it
     follows a rename. */
  var navBar = document.querySelector('.page-nav');
  var navLinks = navBar && navBar.querySelector('.links');

  if (navLinks && !navLinks.querySelector('.nav-menu')) {
    var workLink = navLinks.querySelector('a[href="work.html"], a[href="./work.html"]');
    if (workLink) {
      var W = C.work || {};
      var qs = new URLSearchParams(location.search);
      var onWork = /(^|\/)work\.html$/.test(location.pathname) && !qs.get('slug');
      var ran = /[?&]ran=1\b/.test(location.search);
      var strip = function (s, fallback) {
        var t = String(s == null ? '' : s).trim().replace(/\.\s*$/, '');
        return t || fallback;
      };

      var item = document.createElement('span');
      item.className = 'nav-item';
      workLink.parentNode.insertBefore(item, workLink);
      item.appendChild(workLink);

      /* the caret. Nothing else on the header tells you a link has anything
         under it, and a menu you cannot see the handle of is a menu nobody
         opens. Marked hidden from screen readers because aria-haspopup on the
         link below already says the same thing, in words. */
      var caret = document.createElement('span');
      caret.className = 'nav-caret';
      caret.setAttribute('aria-hidden', 'true');
      caret.textContent = '▾';           /* ▾ */
      workLink.appendChild(caret);
      workLink.setAttribute('aria-haspopup', 'true');
      workLink.setAttribute('aria-expanded', 'false');

      /* ONE item. The parent link is already the all-work page, so listing
         "All work" underneath it only said the same thing twice. The menu
         exists to offer the thing that is NOT the default.

         Two elements, not one: the outer .nav-menu is the hit area and holds
         the bridging padding, the inner .nav-menu-in is the panel you can see.
         The notch is drawn on the inner one, so it points at the parent from
         the panel's own top edge rather than floating in the gap. */
      var menu = document.createElement('span');
      menu.className = 'nav-menu';
      var panel = document.createElement('span');
      panel.className = 'nav-menu-in';
      menu.appendChild(panel);

      var sub = document.createElement('a');
      sub.href = 'work.html?ran=1';
      sub.textContent = strip(W.ranHeading, 'Work that worked');  /* his copy */
      if (onWork && ran) { sub.className = 'on'; sub.setAttribute('aria-current', 'page'); }
      panel.appendChild(sub);
      item.appendChild(menu);

      /* the parent stays lit while you are anywhere in the section */
      if (onWork) workLink.classList.add('on');

      /* ---- opening and closing ----
         Driven from here rather than left to :hover alone. A CSS-only menu
         has to be chased: the pointer must never once leave the element or
         its children, and the instant it does, pointer-events flips to none
         and the menu cannot be re-entered even if the pointer comes straight
         back. Any diagonal move, any sub-pixel seam, any moment the browser
         hit-tests something else, and it is gone before you reach it.

         So: it opens on enter and closes a quarter of a second AFTER leave,
         and coming back cancels the close. That grace period is what every
         menu that works has, and what every menu that does not is missing. */
      var shut;
      var open  = function () {
        clearTimeout(shut);
        item.classList.add('is-open');
        workLink.setAttribute('aria-expanded', 'true');
      };
      var shutNow = function () {
        clearTimeout(shut);
        item.classList.remove('is-open');
        workLink.setAttribute('aria-expanded', 'false');
      };
      var close = function () { clearTimeout(shut); shut = setTimeout(shutNow, 260); };

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      /* the panel is a child, but say it out loud: if anything ever moves it
         out of the item, the menu still holds while the pointer is on it */
      menu.addEventListener('mouseenter', open);
      menu.addEventListener('mouseleave', close);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', close);

      /* A touch screen has no hover, so the first tap opens the menu and a
         second on the same link goes through to the work page. Nobody has to
         produce a gesture their device cannot make, and nobody loses the link. */
      if (window.matchMedia('(hover: none)').matches) {
        workLink.addEventListener('click', function (e) {
          if (!item.classList.contains('is-open')) {
            e.preventDefault();
            open();
          }
        });
        document.addEventListener('click', function (e) {
          if (!item.contains(e.target)) shutNow();
        });
      }
      /* and it closes on Escape, wherever the focus happens to be */
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { shutNow(); workLink.focus(); }
      });
    }
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

  /* ----- THE EMAIL ARRIVES HALF WRITTEN -----
     Click anything that opens his email and the message is already there,
     written as if by the person sending it, in his voice. It is the last joke
     on the site and the only one that lands in somebody else's drafts folder.

     Every mailto on every page goes through here, whether it was typed into
     the HTML or built out of contact.links, so there is one copy of the words
     and admin is the one place they are written.

     Rules this has to keep:
     - A link that already carries its own ?subject= or ?body= is left alone.
       Someone wrote that on purpose.
     - Blank either field in admin and that half is simply not sent. Blank
       both and every link goes back to being a plain mailto, which is the
       same escape hatch the seal and the jokes have.
     - Encode with encodeURIComponent, not escape(): an apostrophe, a question
       mark and an ampersand all appear in his draft and all three break a
       query string if they go in raw. The line breaks go as CRLF because that
       is what mail clients expect, and a lone \n is dropped by some of them.
     - Rewrite the href rather than intercepting the click. A middle click, a
       right click and copy, and a long press on a phone all have to give the
       same address as a plain click, and only a real href does that. ----- */
  var MAIL = C.contact || {};
  var mailSubject = String(MAIL.mailSubject || '').trim();
  var mailBody    = String(MAIL.mailBody    || '').trim();

  window.mailHref = function (url) {
    var href = String(url || '');
    if (!/^mailto:/i.test(href)) return href;
    if (href.indexOf('?') > -1) return href;            /* already spoken for */
    var q = [];
    if (mailSubject) q.push('subject=' + encodeURIComponent(mailSubject));
    if (mailBody)    q.push('body='    + encodeURIComponent(mailBody.replace(/\r?\n/g, '\r\n')));
    return q.length ? href + '?' + q.join('&') : href;
  };

  /* Swept more than once on purpose. site.js runs before each page's own
     script, and some of those build a mailto of their own after it: the
     cabinet's "Hire me?" on awards.html is created about twenty lines below
     where this file finishes. A single pass here would rewrite every link
     except that one, which is the one that matters most on that page.
     Rewriting a link twice is free, because a link that already carries a
     query is left alone. */
  function sweepMail() {
    Array.prototype.forEach.call(
      document.querySelectorAll('a[href^="mailto:"], a[href^="MAILTO:"]'),
      function (a) { a.setAttribute('href', window.mailHref(a.getAttribute('href'))); }
    );
  }
  if (mailSubject || mailBody) {
    sweepMail();
    document.addEventListener('DOMContentLoaded', sweepMail);
    window.addEventListener('load', sweepMail);
  }

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
