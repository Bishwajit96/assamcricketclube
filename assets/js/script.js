/* ============================================================
   ASSAM CRICKET CLUB — MAIN JAVASCRIPT
   ============================================================ */

'use strict';

/* ---------- PRELOADER ---------- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  }
  initAOS();
  animateCounters();
});

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* ---------- HAMBURGER / MOBILE MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks?.querySelectorAll('.nav-item, .nav-btn').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks?.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ---------- ACTIVE NAV LINK ---------- */
function updateActiveNavLink() {
  const sections   = document.querySelectorAll('section[id]');
  const navItems   = document.querySelectorAll('.nav-item');
  const scrollPos  = window.scrollY + 100;

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navItems.forEach(item => item.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-item[href="#${section.id}"]`);
      activeLink?.classList.add('active');
    }
  });
}

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- BACK TO TOP ---------- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- ANIMATED COUNTERS ---------- */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const target  = parseFloat(el.dataset.target);
        const isFloat = String(target).includes('.');
        const duration = 2000;
        const step    = 16;
        const steps   = duration / step;
        const inc     = target / steps;
        let current   = 0;

        const timer = setInterval(() => {
          current += inc;
          if (current >= target) {
            el.textContent = isFloat ? target.toFixed(1) : Math.floor(target).toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
          }
        }, step);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* ---------- AOS (Animate on Scroll) ---------- */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---------- PARTICLES (Hero Background) ---------- */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size     = Math.random() * 6 + 3;
    const left     = Math.random() * 100;
    const delay    = Math.random() * 15;
    const duration = Math.random() * 12 + 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ---------- TESTIMONIALS SLIDER ---------- */
(function initTestimonialsSlider() {
  const slider  = document.getElementById('testimonialsSlider');
  const dots    = document.querySelectorAll('.testimonial-dots .dot');
  if (!slider || !dots.length) return;

  let current   = 0;
  let autoTimer = null;

  // Only activate on mobile
  function isMobile() { return window.innerWidth <= 900; }

  function showSlide(idx) {
    if (!isMobile()) return;
    const cards = slider.querySelectorAll('.testimonial-card');
    cards.forEach((c, i) => {
      c.style.display = i === idx ? 'block' : 'none';
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;
  }

  function setupSlider() {
    if (isMobile()) {
      showSlide(current);
      if (!autoTimer) {
        autoTimer = setInterval(() => {
          const next = (current + 1) % dots.length;
          showSlide(next);
        }, 4000);
      }
    } else {
      // Desktop: show all
      const cards = slider.querySelectorAll('.testimonial-card');
      cards.forEach(c => c.style.display = '');
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      autoTimer = null;
      showSlide(parseInt(dot.dataset.idx));
    });
  });

  setupSlider();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupSlider, 200);
  });
})();

/* ---------- CONTACT FORM ---------- */
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const original = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  }, 1500);
});

/* ---------- GALLERY LIGHTBOX (minimal) ---------- */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img  = item.querySelector('img');
    const name = item.querySelector('.gallery-overlay span')?.textContent || '';
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9000;
      display:flex;align-items:center;justify-content:center;flex-direction:column;
      gap:16px;cursor:zoom-out;animation:fadeIn 0.3s ease;
    `;

    const close = document.createElement('button');
    close.innerHTML = '&times;';
    close.style.cssText = `
      position:absolute;top:20px;right:28px;background:none;border:none;
      color:#fff;font-size:40px;cursor:pointer;line-height:1;z-index:1;
    `;

    const pic = document.createElement('img');
    pic.src = img.src;
    pic.style.cssText = 'max-width:90vw;max-height:80vh;border-radius:12px;object-fit:contain;';

    const caption = document.createElement('p');
    caption.textContent = name;
    caption.style.cssText = 'color:rgba(255,255,255,0.7);font-size:14px;letter-spacing:1px;';

    overlay.append(close, pic, caption);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const removeLightbox = () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', removeLightbox);
    close.addEventListener('click', removeLightbox);
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { removeLightbox(); document.removeEventListener('keydown', handler); }
    });
  });
});

// Inject fadeIn keyframe for lightbox
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }';
document.head.appendChild(style);
