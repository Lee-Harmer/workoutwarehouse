/* ============================================================
   THE WORKOUT WAREHOUSE — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky Header ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Mobile Nav Toggle ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Hero Ken Burns Effect ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  /* ---------- Community Gallery — Infinite Marquee ---------- */
  const track = document.querySelector('.carousel-track');
  if (track) {
    // Duplicate items for seamless loop
    const items = track.querySelectorAll('.carousel-item');
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }

  /* ---------- Manual Slider (for reviews if needed) ---------- */
  initSlider('.reviews-slider', '.review-slide', '.slider-prev', '.slider-next', '.slider-dots');

  function initSlider(wrapSel, slideSel, prevSel, nextSel, dotsSel) {
    const wrap = document.querySelector(wrapSel);
    if (!wrap) return;
    const slides = wrap.querySelectorAll(slideSel);
    const prev = document.querySelector(prevSel);
    const next = document.querySelector(nextSel);
    const dotsWrap = document.querySelector(dotsSel);
    let current = 0;

    const goto = (idx) => {
      slides[current].classList.remove('active');
      if (dotsWrap) dotsWrap.children[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dotsWrap) dotsWrap.children[current]?.classList.add('active');
    };

    if (slides.length > 0) {
      slides[0].classList.add('active');
      if (dotsWrap) {
        slides.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
          dot.addEventListener('click', () => goto(i));
          dotsWrap.appendChild(dot);
        });
      }
    }
    prev?.addEventListener('click', () => goto(current - 1));
    next?.addEventListener('click', () => goto(current + 1));
    // Auto-advance
    setInterval(() => goto(current + 1), 5000);
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-lightbox');
      if (lightboxImg) lightboxImg.src = src;
      lightbox?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

/* ---------- Scroll Reveal CSS (injected) ---------- */
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }
`;
document.head.appendChild(revealStyle);
