(() => {
  'use strict';
  const intro = document.getElementById('matrix-intro');
  const main = document.querySelector('.hub-main');
  const skip = document.getElementById('matrix-skip');
  const status = document.getElementById('matrix-status');
  const progress = document.getElementById('matrix-progress');
  const log = document.getElementById('matrix-log');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d');
  let frame, timer, finished = false, drops = [], width, height, last = 0;
  const previousOverflow = document.body.style.overflow;
  main.inert = true;
  document.body.style.overflow = 'hidden';
  skip.focus({preventScroll: true});
  const GLYPHS = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ<>/:=+*'.split('');
  const FS = 16;
  let speeds = [], prevPx = [], prevG = [];
  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const cols = Math.ceil(width / FS);
    drops = Array.from({length: cols}, () => Math.random() * -50);
    speeds = Array.from({length: cols}, () => .45 + Math.random() * .75);
    prevPx = []; prevG = [];
  }
  function rain(time) {
    if (finished || reduced.matches || !ctx) return;
    if (time - last > 50) {
      ctx.fillStyle = 'rgba(1,5,3,.075)'; ctx.fillRect(0, 0, width, height);
      ctx.font = FS + 'px monospace';
      drops.forEach((y, i) => {
        const g = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const px = Math.round(y) * FS;
        const prev = prevPx[i];
        if (prev !== px) {
          if (prev !== undefined) {
            ctx.fillStyle = 'rgba(1,5,3,.9)'; ctx.fillRect(i * FS, prev - FS + 2, FS, FS);
            ctx.fillStyle = Math.random() > .93 ? '#7dffa6' : '#1fbf55';
            ctx.fillText(prevG[i], i * FS, prev);
          }
          ctx.fillStyle = '#e6fff0';
          ctx.fillText(g, i * FS, px);
          prevPx[i] = px; prevG[i] = g;
        }
        drops[i] = px > height && Math.random() > .96 ? Math.random() * -12 : y + speeds[i];
      });
      last = time;
    }
    frame = requestAnimationFrame(rain);
  }
  function finish() {
    if (finished) return;
    finished = true; clearTimeout(timer); cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    intro.classList.add('leaving');
    main.inert = false;
    document.body.style.overflow = previousOverflow;
    const title = document.querySelector('.hub-title');
    title.tabIndex = -1; title.focus({preventScroll:true});
    window.setTimeout(() => intro.remove(), reduced.matches ? 0 : 700);
    window.dispatchEvent(new Event('matrix:ready'));
  }
  skip.addEventListener('click', finish);
  const steps = ['Initializing portfolio environment...', 'Loading SOC and security modules...', 'Establishing visitor session...', 'ACCESS GRANTED. Welcome to the hub.'];
  let step = 0;
  function advance() {
    if (finished) return;
    const row = document.createElement('p'); row.textContent = steps[step]; log.appendChild(row);
    step++; progress.style.width = `${step * 25}%`;
    if (step === 4) log.lastElementChild.classList.add('granted');
    status.textContent = step === 4 ? 'ACCESS GRANTED / 100%' : `SYSTEM BOOT / ${step * 25}%`;
    timer = window.setTimeout(step === steps.length ? finish : advance, reduced.matches ? 160 : 1600);
  }
  resize(); window.addEventListener('resize', resize);
  if (window.SimTheme) { window.SimTheme.decode(document.querySelector('#matrix-intro h2'), {duration: 1100, delay: 250}); window.SimTheme.decode(document.querySelector('.matrix-eyebrow'), {duration: 800}); }
  if (!reduced.matches && ctx) frame = requestAnimationFrame(rain);
  advance();
})();
