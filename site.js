/* Shared bits for every page: top nav, footer, scroll effects, scroll reveals.
   Loaded after content.js on every page. Do not edit unless you know what
   you are doing. */
(function () {
  var C = window.SITE_CONTENT || {};

  /* ----- top nav ----- */
  var logo = document.querySelector('.logo');
  if (logo && C.nav && C.nav.logo) {
    var t = C.nav.logo;
    logo.innerHTML = t.replace(/\.$/, '<em>.</em>');
  }
  var badgeText = document.querySelector('.badge-text');
  if (badgeText && C.nav && C.nav.badge) {
    badgeText.textContent = C.nav.badge;
  }
  var tagline = document.querySelector('.tagline');
  if (tagline && C.nav && C.nav.tagline) {
    tagline.textContent = C.nav.tagline;
  }

  /* ----- footer ----- */
  var footerLine = document.querySelector('.footer-line');
  if (footerLine && C.footer && C.footer.line) {
    footerLine.textContent = C.footer.line;
  }
  var megaMark = document.querySelector('.mega-mark');
  if (megaMark && C.footer && C.footer.mark) {
    var mark = C.footer.mark;
    if (/PG-13/i.test(mark)) {
      /* the mark doubles as an MPAA-style rating label: the name stays the
         giant wordmark, "PG-13" renders as a black/white rating box */
      var name = mark.replace(/\s*PG-13.*$/i, '');
      megaMark.innerHTML =
        '<span class="mega-name">' + name + '</span>' +
        '<span class="rating-label" role="button" tabindex="0" aria-expanded="false">' +
        '<span class="rating-caution">PARENTS STRONGLY CAUTIONED</span>' +
        '<span class="rating-code">PG-13<span class="rating-joke">' + (C.footer.joke || 'for the jokes in this portfolio.') + '</span></span>' +
        '</span>';
      /* the twist: the white bar hides a punchline that reveals on hover/click */
      var ratingEl = megaMark.querySelector('.rating-label');
      function toggleReveal(open) {
        ratingEl.classList.toggle('is-open', open);
        ratingEl.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      ratingEl.addEventListener('mouseenter', function () { toggleReveal(true); });
      ratingEl.addEventListener('mouseleave', function () { toggleReveal(false); });
      ratingEl.addEventListener('click', function () { toggleReveal(!ratingEl.classList.contains('is-open')); });
      ratingEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleReveal(!ratingEl.classList.contains('is-open'));
        }
      });
    } else {
      megaMark.innerHTML = mark.replace(/®$/, '<sup>®</sup>');
    }
  }
  /* contact stays one glance away on every page: the email as a footer link */
  if (C.contact) {
    var mailto = '';
    var label = '';
    (C.contact.links || []).forEach(function (l) {
      if (!mailto && l && /^mailto:/i.test(l.url || '')) {
        mailto = l.url;
        label = l.label || l.url.replace('mailto:', '');
      }
    });
    if (!mailto && C.contact.ctaUrl) mailto = C.contact.ctaUrl;
    if (mailto && footerLine) {
      var fc = document.createElement('a');
      fc.className = 'footer-contact';
      fc.href = mailto;
      fc.textContent = label || mailto.replace('mailto:', '');
      footerLine.parentNode.insertBefore(fc, footerLine.nextSibling);
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
})();
