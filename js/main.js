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
    const item = e.target.closest('.carousel-item img');
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

const setupCarousels = () => {
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dotsContainer = carousel.parentElement.querySelector('[data-carousel-dots]');
    if (!track) return;

    const items = track.querySelectorAll('.carousel-item');
    if (items.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    const getItemWidth = () => items[0].offsetWidth + parseFloat(getComputedStyle(track).gap) || items[0].offsetWidth + 16;

    const updateDots = () => {
      const scrollLeft = track.scrollLeft;
      const itemWidth = getItemWidth();
      const maxScroll = track.scrollWidth - track.clientWidth;
      let activeIndex;

      if (track.scrollLeft >= maxScroll - 1) {
        activeIndex = items.length - 1;
      } else {
        activeIndex = Math.round(scrollLeft / itemWidth);
      }

      const dots = dotsContainer?.querySelectorAll('.carousel-dot');
      dots?.forEach((d, i) => d.classList.toggle('active', i === Math.min(activeIndex, items.length - 1)));
    };

    if (dotsContainer) {
      items.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
        dot.addEventListener('click', () => {
          items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
        dotsContainer.appendChild(dot);
      });
    }

    track.addEventListener('scroll', updateDots);

    prevBtn?.addEventListener('click', () => {
      const itemWidth = getItemWidth();
      track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
      const itemWidth = getItemWidth();
      track.scrollBy({ left: itemWidth, behavior: 'smooth' });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDots, 100);
    });

    setTimeout(updateDots, 150);
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

const setupFAB = () => {
  const fab = document.querySelector('.fab-bar');
  if (!fab) return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  const toggleFab = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    fab.classList.toggle('visible', heroBottom < 0);
  };

  window.addEventListener('scroll', toggleFab, { passive: true });
  toggleFab();
};

const setupCopyButtons = () => {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = '¡Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = 'Error al copiar';
      }
    });
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

  // Observe staggered animation items
  document.querySelectorAll('.stagger-item').forEach((el) => {
    observer.observe(el);
  });

  // Observe cascade cards (testimonials, impact)
  document.querySelectorAll('.cascade-card').forEach((el) => {
    observer.observe(el);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setupLogoToggle();
  setupLightbox();
  setupCarousels();
  setupNavToggle();
  setupFAB();
  setupCopyButtons();
  setupIntersectionObserver();
});
