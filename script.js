/* =========================================
   CENTRAL PUBLIC SCHOOL — script.js
   Vanilla JS: Animations, Counters, Form
   ========================================= */

'use strict';

/* ---- Utility: throttle ---- */
function throttle(fn, wait) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn.apply(this, args); }
  };
}

/* =========================================
   1. NAVBAR — Scroll & Hamburger
   ========================================= */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');

/* Navbar background on scroll */
window.addEventListener('scroll', throttle(() => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  backToTopBtn.classList.toggle('visible', window.scrollY > 500);
}, 50));

/* Hamburger toggle */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

/* Close nav on link click */
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* Close nav on outside click */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', throttle(() => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const id   = sec.getAttribute('id');
    const top  = sec.offsetTop;
    const h    = sec.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.style.color = (scrollY >= top && scrollY < top + h)
        ? 'var(--gold-light)'
        : '';
    }
  });
}, 100));

/* =========================================
   2. HERO PARTICLE SYSTEM
   ========================================= */
function createParticles(containerId, count = 35) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: ${Math.random() > 0.5 ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.2)'};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: floatParticle ${Math.random() * 12 + 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * -15}s;
    `;
    container.appendChild(p);
  }

  /* Inject keyframe if not already present */
  if (!document.getElementById('particleStyle')) {
    const style = document.createElement('style');
    style.id = 'particleStyle';
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
        33%       { transform: translateY(-40px) translateX(20px) scale(1.1); opacity: 0.7; }
        66%       { transform: translateY(20px) translateX(-15px) scale(0.9); opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
  }
}

createParticles('heroParticles', 40);
createParticles('ctaParticles', 20);

/* =========================================
   3. SCROLL REVEAL ANIMATIONS
   ========================================= */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* =========================================
   4. ANIMATED COUNTERS
   ========================================= */
function animateCounter(el, target, duration = 2000) {
  const start = Date.now();
  const update = () => {
    const elapsed  = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    /* Ease out cubic */
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent  = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

/* Counter elements in hero stats */
const heroStatNums = document.querySelectorAll('.hero-stats .stat-num[data-target]');

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target, 2200);
      heroObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

heroStatNums.forEach(el => heroObserver.observe(el));

/* Counter section */
const counterNums = document.querySelectorAll('.counters-grid .counter-num[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const delay  = parseInt(el.closest('.counter-item').dataset.delay || 0, 10);
      setTimeout(() => animateCounter(el, target, 2500), delay);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });

counterNums.forEach(el => counterObserver.observe(el));

/* =========================================
   5. BACK TO TOP BUTTON
   ========================================= */
const backToTopBtn = document.getElementById('backToTop');
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================
   6. SMOOTH NAVIGATION SCROLL
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; /* navbar height */
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =========================================
   7. CONTACT FORM VALIDATION
   ========================================= */
const form       = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function getEl(id)  { return document.getElementById(id); }
function showErr(fieldId, msg) {
  const errEl = document.getElementById(fieldId + 'Error') || document.getElementById(fieldId.replace('Id','') + 'Error');
  if (errEl) errEl.textContent = msg;
  const input = document.getElementById(fieldId);
  if (input) input.classList.add('error');
}
function clearErr(fieldId) {
  const errEl = document.getElementById(fieldId + 'Error');
  if (errEl) errEl.textContent = '';
  const input = document.getElementById(fieldId);
  if (input) input.classList.remove('error');
}

function validateForm() {
  let valid = true;

  /* Parent Name */
  const parentName = getEl('parentName').value.trim();
  if (!parentName) {
    showErr('parentName', 'Parent name is required.'); valid = false;
  } else if (parentName.length < 3) {
    showErr('parentName', 'Please enter a valid name.'); valid = false;
  } else clearErr('parentName');

  /* Phone */
  const phone = getEl('phone').value.trim();
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone) {
    showErr('phone', 'Phone number is required.'); valid = false;
  } else if (!phoneRegex.test(phone.replace(/[\s\-\+]/g, '').slice(-10))) {
    showErr('phone', 'Enter a valid 10-digit Indian mobile number.'); valid = false;
  } else clearErr('phone');

  /* Email (optional but validated if entered) */
  const email = getEl('email').value.trim();
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErr('email', 'Please enter a valid email address.'); valid = false;
    } else clearErr('email');
  } else clearErr('email');

  /* Child Name */
  const childName = getEl('childName').value.trim();
  if (!childName) {
    showErr('childName', "Child's name is required."); valid = false;
  } else clearErr('childName');

  /* Class */
  const classVal = getEl('classApplying').value;
  if (!classVal) {
    const errEl = document.getElementById('classError');
    if (errEl) errEl.textContent = 'Please select a class.';
    getEl('classApplying').classList.add('error');
    valid = false;
  } else {
    const errEl = document.getElementById('classError');
    if (errEl) errEl.textContent = '';
    getEl('classApplying').classList.remove('error');
  }

  return valid;
}

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    /* Simulate submission */
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

    setTimeout(() => {
      formSuccess.classList.add('show');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1800);
  });

  /* Real-time clear errors on input */
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errId = input.id + 'Error';
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
      formSuccess.classList.remove('show');
    });
  });
}

/* =========================================
   8. PARALLAX EFFECT ON HERO SHAPES
   ========================================= */
const shapes = document.querySelectorAll('.shape');
window.addEventListener('mousemove', throttle(e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  shapes.forEach((s, i) => {
    const factor = (i + 1) * 8;
    s.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
}, 30));

/* =========================================
   9. FACILITY CARD TILT EFFECT (subtle)
   ========================================= */
document.querySelectorAll('.why-card, .class-card, .teacher-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const rx   = ((y - cy) / cy) * 5;
    const ry   = ((x - cx) / cx) * -5;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* =========================================
   10. NAV LINK — SMOOTH ACTIVE HIGHLIGHT
   ========================================= */
/* Handled above in scroll listener. */

/* =========================================
   11. SCROLL PROGRESS BAR
   ========================================= */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold-dark, #a07830), var(--gold, #c9a84c), var(--gold-light, #f0d080));
  z-index: 9999;
  width: 0%;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', throttle(() => {
  const total   = document.documentElement.scrollHeight - window.innerHeight;
  const current = window.scrollY;
  progressBar.style.width = `${(current / total) * 100}%`;
}, 50));

/* =========================================
   12. GALLERY — LIGHTBOX (SIMPLE)
   ========================================= */
const galleryItems = document.querySelectorAll('.gallery-img');

const lightbox = document.createElement('div');
lightbox.style.cssText = `
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(10,22,40,0.96);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.35s ease;
  backdrop-filter: blur(12px);
`;

const lightboxInner = document.createElement('div');
lightboxInner.style.cssText = `
  position: relative; max-width: 90vw; max-height: 85vh;
  display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px;
`;

const lightboxClose = document.createElement('button');
lightboxClose.innerHTML = '<i class="fas fa-times"></i>';
lightboxClose.style.cssText = `
  position: absolute; top: -48px; right: 0;
  background: rgba(255,255,255,0.12); border: none;
  color: white; font-size: 22px; width: 44px; height: 44px;
  border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: 0.3s ease;
`;
lightboxClose.addEventListener('mouseenter', () => { lightboxClose.style.background = 'var(--gold)'; lightboxClose.style.color = '#0a1628'; });
lightboxClose.addEventListener('mouseleave', () => { lightboxClose.style.background = 'rgba(255,255,255,0.12)'; lightboxClose.style.color = 'white'; });

const lightboxCaption = document.createElement('p');
lightboxCaption.style.cssText = `
  color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500; letter-spacing: 0.5px;
  font-family: 'DM Sans', sans-serif;
`;

const lightboxPlaceholder = document.createElement('div');
lightboxPlaceholder.style.cssText = `
  width: min(600px, 85vw); height: min(400px, 55vh);
  border-radius: 16px; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 80px; color: rgba(201,168,76,0.5);
`;

lightboxInner.appendChild(lightboxClose);
lightboxInner.appendChild(lightboxPlaceholder);
lightboxInner.appendChild(lightboxCaption);
lightbox.appendChild(lightboxInner);
document.body.appendChild(lightbox);

const openLightbox = (caption, iconClass) => {
  lightboxPlaceholder.innerHTML = `<i class="${iconClass}" style="font-size:80px;color:rgba(201,168,76,0.4)"></i>`;
  lightboxCaption.textContent   = caption;
  lightbox.style.pointerEvents  = 'all';
  lightbox.style.opacity        = '1';
  document.body.style.overflow  = 'hidden';
};

const closeLightbox = () => {
  lightbox.style.opacity       = '0';
  lightbox.style.pointerEvents = 'none';
  document.body.style.overflow = '';
};

galleryItems.forEach((img) => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    const overlay = img.querySelector('.gallery-overlay span');
    const caption = overlay ? overlay.textContent : 'School Gallery';
    const icon    = img.querySelector('.fac-placeholder i') || { className: 'fas fa-image' };
    openLightbox(caption, 'fas fa-image');
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* =========================================
   13. BUTTON GLOW RIPPLE EFFECT
   ========================================= */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple  = document.createElement('span');
    const rect    = btn.getBoundingClientRect();
    const size    = Math.max(rect.width, rect.height) * 2;
    const x       = e.clientX - rect.left - size / 2;
    const y       = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position: absolute; width: ${size}px; height: ${size}px;
      background: rgba(255,255,255,0.2); border-radius: 50%;
      left: ${x}px; top: ${y}px;
      animation: rippleAnim 0.6s ease forwards; pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* Ripple keyframe */
if (!document.getElementById('rippleStyle')) {
  const s = document.createElement('style');
  s.id = 'rippleStyle';
  s.textContent = `
    @keyframes rippleAnim {
      from { transform: scale(0); opacity: 1; }
      to   { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

/* =========================================
   14. TYPEWRITER EFFECT — Hero Tagline
   ========================================= */
/* Applied subtly on the page load badge text */
(function() {
  const badge = document.querySelector('.hero-badge span');
  if (!badge) return;
  const text = badge.textContent;
  badge.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      badge.textContent += text[i++];
      setTimeout(type, 38);
    }
  };
  setTimeout(type, 1600); /* Start after hero animation */
})();

/* =========================================
   15. DOM READY LOG
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🎓 Central Public School Website Loaded', 'color:#c9a84c;font-size:14px;font-weight:bold;');
  console.log('%cBuilt with ❤️ for Bright Futures.', 'color:#1a3a8f;');
});
