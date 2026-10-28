/* Matrix / cyberpunk theme helpers: glyph decode, scroll reveal, faint code rain, nav scrollspy. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GL = '01<>/\\|{}[]#$%&*+=-_:;'.split('');

  // Progressive glyph-scramble reveal. Keeps markup (spans, br); only text nodes change.
  function decode(el, opts) {
    if (!el || reduced || el.__decoded) return;
    el.__decoded = true;
    opts = opts || {};
    var dur = opts.duration || 900, delay = opts.delay || 0;
    var nodes = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) { if (walker.currentNode.nodeValue.trim()) nodes.push({ n: walker.currentNode, t: walker.currentNode.nodeValue }); }
    var total = nodes.reduce(function (a, x) { return a + x.t.length; }, 0);
    if (!total) return;
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    if (!el.hasAttribute('aria-label') && /^H[1-6]$/.test(el.tagName)) el.setAttribute('aria-label', label);
    var start = null;
    el.style.minHeight = el.offsetHeight + 'px';
    nodes.forEach(function (x) { x.n.nodeValue = x.t.replace(/\S/g, function () { return GL[Math.floor(Math.random() * GL.length)]; }); });
    function tick(ts) {
      if (start === null) start = ts + delay;
      var p = Math.min(1, Math.max(0, (ts - start) / dur)), shown = Math.floor(p * total), seen = 0;
      nodes.forEach(function (x) {
        var out = '';
        for (var i = 0; i < x.t.length; i++) {
          var c = x.t[i];
          if (seen < shown || /\s/.test(c)) out += c;
          else out += GL[Math.floor(Math.random() * GL.length)];
          if (!/\s/.test(c)) seen++;
        }
        x.n.nodeValue = out;
      });
      if (p < 1) requestAnimationFrame(tick);
      else { nodes.forEach(function (x) { x.n.nodeValue = x.t; }); el.style.minHeight = ''; el.classList.add('decoded'); }
    }
    requestAnimationFrame(tick);
  }
  window.SimTheme = { decode: decode };

  function whenReady(fn) {
    var intro = document.getElementById('matrix-intro');
    if (intro && !intro.classList.contains('leaving')) window.addEventListener('matrix:ready', function () { setTimeout(fn, 150); }, { once: true });
    else fn();
  }

  // Faint code rain behind everything (all pages).
  function bgRain() {
    // Skip on phones and touch tablets: saves battery and keeps scrolling smooth.
    if (reduced || window.matchMedia('(max-width: 900px), (pointer: coarse) and (max-width: 1280px)').matches) return;
    var c = document.createElement('canvas'); c.id = 'bg-rain'; c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    var x = c.getContext('2d'), fs = 16, cols, drops, w, h, chars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ'.split('');
    function size() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; cols = Math.ceil(w / fs); drops = []; for (var i = 0; i < cols; i++) drops[i] = Math.random() * -60; }
    size(); window.addEventListener('resize', size);
    setInterval(function () {
      if (document.hidden) return;
      x.fillStyle = 'rgba(5,9,16,.12)'; x.globalCompositeOperation = 'destination-out'; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'source-over';
      x.font = fs + 'px monospace';
      for (var i = 0; i < cols; i++) {
        if (Math.random() > .35) continue;
        x.fillStyle = 'rgba(70,255,150,.9)';
        x.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, drops[i] * fs);
        if (drops[i] * fs > h && Math.random() > .975) drops[i] = Math.random() * -20; drops[i] += 1;
      }
    }, 90);
  }

  // Scroll reveal: only hides things when JS is running and motion is allowed.
  function reveal() {
    var sel = '.hub-card,.project-card,.cert-card,.stat-card,.about-card,.thm-profile,.skills-grid,.section-title,.ethics-banner,.hub-terminal,.terminal-section,.hub-footer';
    var els = [].slice.call(document.querySelectorAll(sel));
    if (reduced || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('reveal-on');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; io.unobserve(t);
        t.classList.add('in');
        if (t.classList.contains('section-title')) decode(t, { duration: 700 });
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });
    els.forEach(function (el, i) {
      el.classList.add('rv');
      var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--rv-d', Math.min(sib, 6) * 70 + 'ms');
    });
    // Start observing once the intro has finished (hidden state applies immediately so nothing flashes).
    whenReady(function () {
      els.forEach(function (el) { io.observe(el); });
      // Safety net: never leave content hidden.
      setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 5000);
    });
  }

  // Nav scrollspy on the dashboards.
  function spy() {
    var links = [].slice.call(document.querySelectorAll('.sidebar nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { var t = document.querySelector(a.getAttribute('href')); if (t) map[t.id] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) { links.forEach(function (l) { l.classList.remove('active'); }); map[e.target.id].classList.add('active'); }
      });
    }, { rootMargin: '-20% 0px -65% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  // Cursor spotlight on cards (cheap: just two CSS vars).
  function spotlight() {
    if (!window.matchMedia('(hover:hover)').matches) return;
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.hub-card,.project-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  // Shorter placeholder on narrow screens so it is not cut off.
  function placeholder() {
    var inp = document.getElementById('hub-command');
    if (inp && window.matchMedia('(max-width: 600px)').matches) inp.setAttribute('placeholder', 'Try soc, pentest, iam, help');
  }

  function init() {
    placeholder(); bgRain(); reveal(); spy(); spotlight();
    var hubTitle = document.querySelector('.hub-title');
    if (hubTitle) whenReady(function () { decode(hubTitle, { duration: 900 }); });
    var h1 = document.querySelector('.hero h1');
    if (h1) decode(h1, { duration: 1000, delay: 150 });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
