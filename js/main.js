/**
 * Fundación ALENU - Main Script
 * Logo toggle, Lightbox, Gallery staggered animation
 */

/**
 * Logo enlarge toggle with keyboard accessibility
 */
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

/**
 * Lightbox vanilla JS (sin jQuery)
 */
const setupLightbox = () => {
  const overlay = document.querySelector('.lightbox-overlay');
  if (!overlay) return;

  // Click on gallery item to open
  document.addEventListener('click', function(e) {
    var item = e.target.closest('.galeria-item img');
    if (item) {
      var img = overlay.querySelector('img');
      img.src = item.src;
      img.alt = item.alt;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Click on overlay to close
  overlay.addEventListener('click', function() {
    this.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Escape key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
};

/**
 * Gallery staggered animation
 */
const setupGalleryAnimation = () => {
  const items = document.querySelectorAll('.galeria-item');
  items.forEach((item, index) => {
    const delay = Math.min(index * 40, 800);
    item.style.animationDelay = delay + 'ms';
  });
};

// Initialize (defer ensures DOM is ready)
setupLogoToggle();
setupLightbox();
setupGalleryAnimation();