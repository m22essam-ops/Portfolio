/* Shared bits for every page: top nav, footer, scroll effects, scroll reveals.
   Loaded after content.js on every page. Do not edit unless you know what
   you are doing. */
(function () {
  var C = window.SITE_CONTENT || {};

  /* ----- top nav ----- */
  /* plain text, no red dot: the trailing period used to be wrapped in an
     <em> and coloured, which is the "red dot" that got removed. */
  var logo = document.querySelector('.logo');
  if (logo && C.nav && C.nav.logo) {
    logo.textContent = String(C.nav.logo).replace(/\s*\.\s*$/, '');
  }
  var badgeText = document.querySelector('.badge-text');
  if (badgeText && C.nav && C.nav.badge) {
    badgeText.textContent = C.nav.badge;
  }
  var tagline = document.querySelector('.tagline');
  if (tagline && C.nav && C.nav.tagline) {
    tagline.textContent = C.nav.tagline;
  }

  /* ----- THE STUB -----
     Every page that is not the home page ends on the tear-off half of the
     same ticket. Built here rather than in each page's HTML so there is one
     copy of it: work.html, about.html and every project page share it.
     It is also where the contact details live, which is why it carries the
     whole of contact.links rather than one buried mailto. */
  var foot = document.getElementById('siteFoot');
  if (foot) {
    var F = C.footer || {};
    var K = C.contact || {};
    var T = C.ticket || {};
    var J = C.jokes || {};

    var esc = function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    /* the email becomes the big claim line, everything else becomes a column */
    var mail = '', mailLabel = '', others = [];
    (K.links || []).forEach(function (l) {
      if (!l || !l.url) return;
      if (!mail && /^mailto:/i.test(l.url)) {
        mail = l.url;
        mailLabel = l.label || l.url.replace(/^mailto:/i, '');
      } else {
        others.push(l);
      }
    });
    if (!mail && K.ctaUrl) { mail = K.ctaUrl; mailLabel = K.ctaUrl.replace(/^mailto:/i, ''); }

    var cols = [];
    if (others.length) {
      cols.push({
        head: 'Also at',
        rows: others.map(function (l) {
          return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
                 esc(l.label || l.url) + '</a>';
        }).join('')
      });
    }
    if (K.resume && K.resume.url) {
      cols.push({
        head: 'The file',
        rows: '<a href="' + esc(K.resume.url) + '" target="_blank" rel="noopener">' +
              esc(K.resume.label || 'Résumé') + '</a>'
      });
    }
    if (F.place) cols.push({ head: 'Where', rows: '<span>' + esc(F.place) + '</span>' });

    var html =
      '<div class="stub-perf" aria-hidden="true"></div>' +
      '<div class="wrap stub-in">' +
        '<div class="stub-head">' +
          '<span>' + esc(F.keep || 'Keep this stub') + '</span>' +
          '<span>' + esc(T.serial || '') + '</span>' +
        '</div>' +
        (F.big ? '<p class="stub-big">' + esc(F.big) + '</p>' : '') +
        (mail
          ? '<a class="stub-claim" href="' + esc(mail) + '">' +
            esc(mailLabel) + '<i aria-hidden="true">&#8594;</i></a>'
          : '') +
        (cols.length
          ? '<ul class="stub-cols">' + cols.map(function (c) {
              return '<li><b>' + esc(c.head) + '</b>' + c.rows + '</li>';
            }).join('') + '</ul>'
          : '') +
        '<div class="stub-fine">' +
          '<div class="stub-code" aria-hidden="true"></div>' +
          '<p>' + esc(T.terms || '') + '</p>' +
        '</div>' +
        '<div class="stub-sign">' +
          '<span>' + esc(F.line || '') + '</span>' +
          '<span>' + esc(J.footer || '') + '</span>' +
        '</div>' +
      '</div>' +
      (F.mark ? '<div class="stub-mark" aria-hidden="true">' + esc(F.mark) + '</div>' : '');

    foot.className = 'stub';
    foot.innerHTML = html;

    /* The wordmark is meant to run the full width and bleed off the bottom.
       A vw font-size can only guess at that, and it guesses wrong as soon as
       he changes the name or the browser picks a fallback font, so measure the
       word and scale it to the exact width instead.
       It measures more than once on purpose: Bricolage Grotesque carries an
       optical-size axis, so its letters change width with the point size and
       one pass of arithmetic lands short. Two or three passes settle it. */
    var mark = foot.querySelector('.stub-mark');
    if (mark) {
      var fitMark = function () {
        var box = mark.clientWidth;
        if (!box) return;
        mark.style.fontSize = '';
        var rng = document.createRange();
        for (var i = 0; i < 5; i++) {
          var fs = parseFloat(getComputedStyle(mark).fontSize);
          rng.selectNodeContents(mark);
          var w = rng.getBoundingClientRect().width;
          if (!w) return;
          var next = fs * (box - 6) / w;
          if (Math.abs(next - fs) < 0.4) break;
          mark.style.fontSize = next.toFixed(2) + 'px';
        }
      };
      fitMark();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMark);
      var markWait;
      window.addEventListener('resize', function () {
        clearTimeout(markWait);
        markWait = setTimeout(fitMark, 120);
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
  window.observeReveals = function () {
    var els = document.querySelectorAll('.reveal:not(.is-observed)');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) {
      el.classList.add('is-observed');
      io.observe(el);
    });
  };
  observeReveals();

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
