/* ============================================================
   JASON MAYELE — Artist Website
   script.js — Interactions, animations, loading screen
   ============================================================ */

'use strict';

// ── Loading Screen ────────────────────────────────────────────
const loadingScreen = document.getElementById('loading-screen');
const loadingBar    = document.getElementById('loading-bar');
const letters       = document.querySelectorAll('.loading-name .letter');

// Animate letters in sequentially
letters.forEach((letter, i) => {
  setTimeout(() => {
    letter.classList.add('visible');
  }, 200 + i * 80);
});

// Simulate loading progress
let progress = 0;
const progressInterval = setInterval(() => {
  progress += Math.random() * 15 + 3;
  if (progress >= 100) {
    progress = 100;
    clearInterval(progressInterval);
    loadingBar.style.width = '100%';

    // Hide loading screen after brief pause
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      // Trigger hero animations
      triggerHeroAnimations();
    }, 500);
  }
  loadingBar.style.width = `${Math.min(progress, 100)}%`;
}, 120);


// ── Hero Animations ───────────────────────────────────────────
function triggerHeroAnimations() {
  const heroEls = document.querySelectorAll(
    '.hero-eyebrow, .hero-name-line, .hero-tagline, .hero-cta'
  );
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 180);
  });
}


// ── Animated Gradient Background ─────────────────────────────
const canvas = document.getElementById('gradient-canvas');
const ctx    = canvas.getContext('2d');

let gradientTime = 0;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Orbs for the animated mesh
const orbs = [
  { x: 0.2,  y: 0.3,  r: 0.55, color: 'rgba(20, 10, 35, 0.9)',  speed: 0.0004 },
  { x: 0.8,  y: 0.7,  r: 0.50, color: 'rgba(8,  18, 38, 0.85)', speed: 0.0003 },
  { x: 0.5,  y: 0.5,  r: 0.60, color: 'rgba(15, 12, 28, 0.8)',  speed: 0.0005 },
  { x: 0.15, y: 0.8,  r: 0.40, color: 'rgba(25, 8,  45, 0.7)',  speed: 0.0006 },
  { x: 0.85, y: 0.2,  r: 0.45, color: 'rgba(10, 20, 50, 0.65)', speed: 0.00035 },
];

function drawGradient() {
  gradientTime += 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Base fill
  ctx.fillStyle = '#08080e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  orbs.forEach((orb, i) => {
    const phase = gradientTime * orb.speed;
    const cx = (orb.x + Math.sin(phase + i * 1.3) * 0.18) * canvas.width;
    const cy = (orb.y + Math.cos(phase + i * 0.9) * 0.15) * canvas.height;
    const radius = orb.r * Math.max(canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, orb.color);
    grad.addColorStop(1, 'transparent');

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  ctx.globalCompositeOperation = 'source-over';

  // Subtle vignette
  const vignette = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(drawGradient);
}

drawGradient();


// ── Custom Cursor ─────────────────────────────────────────────
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

if (cursor && cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Ring follows with slight lag
  function animateCursorRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .film-card, .release-card, .av-card, .social-link, .press-card, .gallery-item'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}


// ── Scroll Fade-Up (IntersectionObserver) ─────────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => fadeObserver.observe(el));


// ── Mobile Navigation ──────────────────────────────────────────
const hamburger  = document.querySelector('.nav-hamburger');
const mobileNav  = document.getElementById('mobile-nav');
const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

function toggleMobileNav() {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMobileNav);
}

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});


// ── Navbar scroll shadow ───────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.background = 'rgba(10, 10, 10, 0.92)';
  } else {
    navbar.style.background = 'var(--bg-nav)';
  }
}, { passive: true });


// ── Gallery lightbox (simple) ──────────────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9000;
      background: rgba(0,0,0,0.92);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out; animation: fadeIn 0.3s ease;
    `;

    const clone = img.cloneNode();
    clone.style.cssText = `
      max-width: 90vw; max-height: 90vh;
      object-fit: contain; border-radius: 8px;
      box-shadow: 0 40px 120px rgba(0,0,0,0.8);
    `;
    clone.style.filter = 'grayscale(0%)';

    overlay.appendChild(clone);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });
  });
});
