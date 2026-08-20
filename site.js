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
      foot.className = 'foot';
      foot.innerHTML = '<div class="wrap"><p>' + out + '</p></div>';
    } else {
      foot.remove();
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
