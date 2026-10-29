/* =============================================================
   SCRIPT.JS — John Rey A. Sapio Portfolio
   Handles: theme toggle, mobile nav, typed text,
            scroll effects, reveal animations, contact form,
            back-to-top, active nav links
   ============================================================= */

'use strict';

// ─────────────────────────────────────────────────────────────
// 1. THEME TOGGLE (Light / Dark Mode)
// ─────────────────────────────────────────────────────────────
(function initTheme() {
  const html        = document.documentElement;
  const toggleBtn   = document.getElementById('themeToggle');

  // Load saved preference (default: dark)
  const savedTheme  = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
})();


// ─────────────────────────────────────────────────────────────
// 2. MOBILE NAVIGATION TOGGLE (Hamburger Menu)
// ─────────────────────────────────────────────────────────────
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when any nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


// ─────────────────────────────────────────────────────────────
// 3. TYPED TEXT ANIMATION
// ─────────────────────────────────────────────────────────────
(function initTypedText() {
  const el = document.getElementById('typedText');
  if (!el) return;

  // ★ EDIT these roles/titles as you like ★
  const phrases = [
    'UI/UX Designer',
    'Frontend Developer',
    'IT Student & OJT Trainee',
    'Problem Solver',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  const typeSpeed   = 90;   // ms per character (typing)
  const deleteSpeed = 50;   // ms per character (deleting)
  const pauseAfter  = 2000; // ms pause at full phrase
  const pauseBefore = 500;  // ms pause before typing next

  function type() {
    const current = phrases[phraseIndex];
    el.textContent = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    charIndex += isDeleting ? -1 : 1;

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing — pause then start deleting
      delay = pauseAfter;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = pauseBefore;
    }

    setTimeout(type, delay);
  }

  // Slight delay before starting so page feels settled
  setTimeout(type, 800);
})();


// ─────────────────────────────────────────────────────────────
// 4. NAVBAR SCROLL EFFECTS
//    - Add "scrolled" class for shadow
//    - Highlight active section nav link
// ─────────────────────────────────────────────────────────────
(function initNavScroll() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('main section[id], header section[id], section[id]');

  // All navigable sections (using IDs referenced in nav)
  const sectionIds = ['about', 'skills', 'projects', 'certifications', 'contact'];

  function onScroll() {
    // Scrolled shadow
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active section highlight
    let current = '';
    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 100) current = id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
})();


// ─────────────────────────────────────────────────────────────
// 5. SCROLL-REVEAL ANIMATION
//    Elements with class "reveal" animate in on scroll
// ─────────────────────────────────────────────────────────────
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for cards in the same parent
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
            : [];
          const delay = siblings.indexOf(entry.target) * 80;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();


// ─────────────────────────────────────────────────────────────
// 6. BACK-TO-TOP BUTTON
// ─────────────────────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ─────────────────────────────────────────────────────────────
// 7. CONTACT FORM — Frontend Demo Handler
//    Shows a success/error message on submit.
//    Replace the body of handleSubmit() to integrate with
//    EmailJS, Formspree, or your own backend.
// ─────────────────────────────────────────────────────────────
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const statusEl   = document.getElementById('formStatus');
  if (!form || !statusEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus('error', '⚠ Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error', '⚠ Please enter a valid email address.');
      return;
    }

    // ── Disable button while "sending" ──
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // ── Simulate async send (replace with real API call) ──
    // Example with EmailJS:
    // await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', { name, email, message });
    //
    // Example with Formspree:
    // await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, message }),
    // });

    await simulateSend();

    setStatus('success', '✓ Message sent! I\'ll get back to you soon.');
    form.reset();

    submitBtn.disabled = false;
    submitBtn.innerHTML = `Send Message <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" width="16" height="16">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/>
    </svg>`;
  });

  function setStatus(type, msg) {
    statusEl.textContent = msg;
    statusEl.className   = `form-status ${type}`;
    setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'form-status'; }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function simulateSend() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
})();


// ─────────────────────────────────────────────────────────────
// 8. FOOTER — Auto-update copyright year
// ─────────────────────────────────────────────────────────────
(function setFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

