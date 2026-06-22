// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after tapping a link (mobile)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// FOOTER YEAR
// ============================================================
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ============================================================
// HERO WAVEFORM — animated "signal" canvas background
// ============================================================
const canvas = document.getElementById('waveform');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawWave(time, amplitude, frequency, phase, color, lineWidth) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;

    const midY = height * 0.55;
    const step = 4;

    for (let x = 0; x <= width; x += step) {
      const y =
        midY +
        Math.sin(x * frequency + time + phase) * amplitude *
          Math.sin(x / width * Math.PI); // taper edges

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  function render(t) {
    ctx.clearRect(0, 0, width, height);

    drawWave(t * 0.0012, 38, 0.012, 0, 'rgba(255, 61, 174, 0.55)', 2);
    drawWave(t * 0.0009, 55, 0.007, 1.3, 'rgba(77, 238, 234, 0.4)', 1.5);
    drawWave(t * 0.0016, 18, 0.02, 2.6, 'rgba(240, 238, 247, 0.25)', 1);

    if (!prefersReducedMotion) {
      requestAnimationFrame(render);
    }
  }

  resize();
  window.addEventListener('resize', resize);

  if (prefersReducedMotion) {
    render(0); // draw a single static frame
  } else {
    requestAnimationFrame(render);
  }
}

// ============================================================
// CONTACT FORM — mailto: fallback
// ============================================================
const CONTACT_EMAIL = 'katestingle@gmail.com';
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !subject || !message) {
      contactForm.reportValidity();
      return;
    }

    const mailSubject = encodeURIComponent(`[Portfolio] ${subject}`);
    const mailBody = encodeURIComponent(
      `${message}\n\n—\n${name}\n${email}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
  });
}
