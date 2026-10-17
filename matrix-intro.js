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
  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drops = Array.from({length: Math.ceil(width / 22)}, () => Math.random() * -60);
  }
  function rain(time) {
    if (finished || reduced.matches || !ctx) return;
    if (time - last > 55) {
      ctx.fillStyle = 'rgba(2,7,4,.09)'; ctx.fillRect(0, 0, width, height);
      ctx.font = '15px monospace';
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > .97 ? '#d4ffdf' : '#22c65a';
        ctx.fillText('01アイウエオカキクケコ'[Math.floor(Math.random() * 12)], i * 22, y * 22);
        drops[i] = y * 22 > height && Math.random() > .975 ? 0 : y + .7;
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
    status.textContent = step === 4 ? 'ACCESS GRANTED / 100%' : `SYSTEM BOOT / ${step * 25}%`;
    timer = window.setTimeout(step === steps.length ? finish : advance, reduced.matches ? 160 : 1600);
  }
  resize(); window.addEventListener('resize', resize);
  if (!reduced.matches && ctx) frame = requestAnimationFrame(rain);
  advance();
})();
