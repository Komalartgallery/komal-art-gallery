(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('.sr-only').textContent = 'Open navigation menu';
    body.classList.remove('menu-open');
  };

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('is-open', willOpen);
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      menuToggle.querySelector('.sr-only').textContent = willOpen ? 'Close navigation menu' : 'Open navigation menu';
      body.classList.toggle('menu-open', willOpen);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-sticky', window.scrollY > 52);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -45px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const artCards = [...document.querySelectorAll('.art-card[data-category]')];

  const applyFilter = (filter) => {
    filterButtons.forEach((button) => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    artCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.hidden = !visible;
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter));
  });

  document.querySelectorAll('[data-filter-link]').forEach((link) => {
    link.addEventListener('click', () => {
      applyFilter(link.dataset.filterLink);
    });
  });

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxTitle = document.querySelector('[data-lightbox-title]');
  const lightboxMedium = document.querySelector('[data-lightbox-medium]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  const lightboxPrevious = document.querySelector('[data-lightbox-prev]');
  const lightboxNext = document.querySelector('[data-lightbox-next]');
  const galleryTriggers = [...document.querySelectorAll('[data-image][data-title]')];
  let currentImageIndex = 0;

  const setLightboxContent = (index) => {
    const trigger = galleryTriggers[index];
    if (!trigger || !lightboxImage) return;
    const thumbnail = trigger.querySelector('img');
    currentImageIndex = index;
    lightboxImage.src = trigger.dataset.image;
    lightboxImage.alt = thumbnail?.alt || trigger.dataset.title;
    lightboxTitle.textContent = trigger.dataset.title || '';
    lightboxMedium.textContent = trigger.dataset.medium || '';
  };

  const openLightbox = (trigger) => {
    if (!lightbox) return;
    const index = galleryTriggers.indexOf(trigger);
    setLightboxContent(Math.max(index, 0));
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
    }
    body.classList.add('lightbox-open');
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    if (typeof lightbox.close === 'function' && lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute('open');
    }
    body.classList.remove('lightbox-open');
  };

  const moveLightbox = (direction) => {
    const newIndex = (currentImageIndex + direction + galleryTriggers.length) % galleryTriggers.length;
    setLightboxContent(newIndex);
  };

  galleryTriggers.forEach((trigger) => trigger.addEventListener('click', () => openLightbox(trigger)));
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrevious?.addEventListener('click', () => moveLightbox(-1));
  lightboxNext?.addEventListener('click', () => moveLightbox(1));

  lightbox?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox?.open) return;
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });

  const inquirySelect = document.querySelector('[data-inquiry-select]');
  document.querySelectorAll('[data-inquiry]').forEach((link) => {
    link.addEventListener('click', () => {
      if (inquirySelect) inquirySelect.value = link.dataset.inquiry;
    });
  });

  const accordionItems = [...document.querySelectorAll('[data-accordion] details')];
  accordionItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      accordionItems.forEach((otherItem) => {
        if (otherItem !== item) otherItem.open = false;
      });
    });
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-20% 0px -55%' });

    sections.forEach((section) => navObserver.observe(section));
  }

  const contactForm = document.querySelector('[data-contact-form]');
  contactForm?.addEventListener('submit', () => {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
