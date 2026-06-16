const setupLogoToggle = () => {
  const logo = document.querySelector('.rounded-logo');
  if (!logo) return;

  const toggleEnlarged = () => {
    logo.classList.toggle('enlarged');
    const isEnlarged = logo.classList.contains('enlarged');
    logo.setAttribute('aria-pressed', isEnlarged);
  };

  logo.addEventListener('click', toggleEnlarged);

  logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleEnlarged();
    }
  });
};

const setupLightbox = () => {
  const overlay = document.querySelector('.lightbox-overlay');
  if (!overlay) return;

  const closeLightbox = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    const lastFocused = overlay._lastFocused;
    if (lastFocused) lastFocused.focus();
  };

  const trapFocus = (e) => {
    const focusable = overlay.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  document.addEventListener('click', function(e) {
    const item = e.target.closest('.galeria-item img');
    if (!item || !overlay) return;
    const img = overlay.querySelector('img');
    if (!img) return;
    img.src = item.src;
    img.alt = item.alt;
    overlay._lastFocused = document.activeElement;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const closeBtn = overlay.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  });

  overlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeLightbox();
    }
    if (e.key === 'Tab' && overlay.classList.contains('active')) {
      trapFocus(e);
    }
  });
};

const setupGalleryAnimation = () => {
  const items = document.querySelectorAll('.galeria-item');
  if (!items.length) return;
  items.forEach((item, index) => {
    const delay = Math.min(index * 40, 800);
    item.style.animationDelay = delay + 'ms';
  });
};

const setupNavToggle = () => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
      btn.focus();
    }
  });
};

/**
 * Intersection Observer for scroll animations
 */
const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe animate-on-scroll elements
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setupLogoToggle();
  setupLightbox();
  setupGalleryAnimation();
  setupNavToggle();
  setupIntersectionObserver();
});
