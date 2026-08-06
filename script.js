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

  // Free, client-side FAQ assistant. No API key or paid service is required.
  const chatbot = document.querySelector('[data-chatbot]');
  const chatbotToggle = document.querySelector('[data-chatbot-toggle]');
  const chatbotPanel = document.querySelector('[data-chatbot-panel]');
  const chatbotClose = document.querySelector('[data-chatbot-close]');
  const chatbotMessages = document.querySelector('[data-chatbot-messages]');
  const chatbotForm = document.querySelector('[data-chatbot-form]');
  const chatbotInput = document.querySelector('[data-chatbot-input]');
  const chatbotSuggestions = [...document.querySelectorAll('[data-chat-question]')];

  const chatbotAnswers = [
    {
      test: /(hello|hi|hey|namaste|sat sri akal|satsriakal|good morning|good evening)/i,
      answer: 'Hello! Welcome to Komal Art Gallery. You can ask me about paintings, custom portraits, art classes, antiques, shipping or contact details.'
    },
    {
      test: /(worldwide|international|overseas|ship|shipping|delivery|deliver|canada|america|usa|uk|australia)/i,
      answer: 'Yes, Komal Art Gallery welcomes worldwide shipping inquiries. Packaging, shipping cost and delivery arrangements depend on the artwork size and destination. Please send the artwork name, size and destination through the contact form or WhatsApp.'
    },
    {
      test: /(custom|commission|portrait|photo.*painting|painting.*photo|family portrait|wedding portrait|personalized)/i,
      answer: 'Yes, you can order commissioned artwork, including pencil portraits, oil paintings, family artwork, religious artwork and special gifts. Please share a clear reference photo, preferred size, medium, deadline and delivery country.'
    },
    {
      test: /(price|cost|rate|how much|charges|fee|fees|budget|quotation|quote)/i,
      answer: 'Prices are confirmed individually because they depend on size, medium, detail, framing and shipping destination. Use “Custom Artwork Inquiry” in the contact form or WhatsApp the gallery for an exact quotation.'
    },
    {
      test: /(online class|online course|zoom class|remote class|virtual class)/i,
      answer: 'Online art-class inquiries are welcome. Training may include drawing, painting, pencil shading, portrait work, fabric art and creative design. Contact the school for the current schedule, age group, fees and availability.'
    },
    {
      test: /(art class|art school|learn art|course|training|student|drawing class|painting class|admission|join class)/i,
      answer: 'Komal Art School offers professional guidance in drawing, painting, fabric art and creative design. Ask through the contact form and choose “Art Classes Inquiry” for current in-person or online class details.'
    },
    {
      test: /(certificate|certification)/i,
      answer: 'Students receive certificates after completing their course. Course duration and completion requirements are confirmed directly by Komal Art School.'
    },
    {
      test: /(antique|antiques|old coin|coins|camera|whistle|utensil|historical item|collectible)/i,
      answer: 'The gallery has a growing collection of historical objects, including old coins and other heritage items. Availability can change, so choose “Antiques Inquiry” in the contact form and mention the item that interests you.'
    },
    {
      test: /(oil painting|pencil|fabric|mosaic|medium|what art|artwork type|painting type)/i,
      answer: 'The gallery specializes in oil paintings, pencil portraits, fabric painting, mosaic art, commissioned artwork and creative student training.'
    },
    {
      test: /(owner|founder|gurpreet|artist|who runs|who is komal)/i,
      answer: 'Komal Art Gallery and Komal Art School are led by Gurpreet Singh Komal, an artist, art educator and record holder from Moga, Punjab. The gallery was established in 1998.'
    },
    {
      test: /(record|paintbrush|paint brush|needle|limca|india book|world record|14 foot|14 ft)/i,
      answer: 'Gurpreet Singh Komal is recognized for major artistic feats, including creating a 14-foot 1.5-inch paintbrush and passing a ten-metre painted cloth through the eye of a single needle. His recognitions include the Limca Book of Records and India Book of Records.'
    },
    {
      test: /(location|address|where are you|where is|moga|visit gallery|directions)/i,
      answer: 'Komal Art Gallery is located in Moga, Punjab, India. Use the map and contact section on this website for directions or call before visiting.'
    },
    {
      test: /(contact|phone|number|call|email|whatsapp|message|talk to|reach you)/i,
      answer: 'You can call or WhatsApp +91 99883 87388, email komalartgallery@gmail.com, or use the contact form on this website.'
    },
    {
      test: /(buy|purchase|order|available|availability|for sale)/i,
      answer: 'To buy or reserve an artwork, send its title or screenshot through the contact form or WhatsApp. The gallery will confirm availability, price, payment and shipping details directly.'
    },
    {
      test: /(payment|pay|upi|bank|card|deposit|advance)/i,
      answer: 'Payment arrangements are confirmed directly for each order. Contact the gallery before sending any payment so the artwork, final price and official payment method can be verified.'
    },
    {
      test: /(how long|time.*complete|complete.*time|ready|turnaround|deadline)/i,
      answer: 'Completion time depends on the artwork size, medium, detail and current workload. Share your preferred deadline when requesting a quotation, and the gallery will confirm whether it is possible.'
    },
    {
      test: /(job|career|vacancy|hiring|opening|work with you|apply)/i,
      answer: 'There are currently no job openings listed. Please check the Careers information on the website again in the future for official vacancies.'
    },
    {
      test: /(open|opening hour|hours|timing|when can i visit|visit time)/i,
      answer: 'Please call or WhatsApp +91 99883 87388 before visiting to confirm the current gallery and class timings.'
    },
    {
      test: /(thank|thanks|thank you)/i,
      answer: 'You’re welcome! Please contact Komal Art Gallery whenever you are ready to discuss artwork, classes, antiques or shipping.'
    }
  ];

  const getChatbotAnswer = (question) => {
    const cleanedQuestion = question.toLowerCase().replace(/[^a-z0-9\s₹+.-]/g, ' ').replace(/\s+/g, ' ').trim();
    const match = chatbotAnswers.find((entry) => entry.test.test(cleanedQuestion));
    return match?.answer || 'I do not have a confirmed answer for that question. Please use the contact form or WhatsApp +91 99883 87388, and the gallery will reply personally.';
  };

  const addChatbotMessage = (text, sender) => {
    if (!chatbotMessages) return null;
    const message = document.createElement('div');
    message.className = `chat-message ${sender === 'user' ? 'user-message' : 'assistant-message'}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    message.appendChild(paragraph);
    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return message;
  };

  const showChatbotTyping = () => {
    if (!chatbotMessages) return null;
    const typing = document.createElement('div');
    typing.className = 'chat-message assistant-message typing-message';
    typing.setAttribute('aria-label', 'Assistant is typing');
    const bubble = document.createElement('p');
    bubble.innerHTML = '<i></i><i></i><i></i>';
    typing.appendChild(bubble);
    chatbotMessages.appendChild(typing);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typing;
  };

  const openChatbot = () => {
    if (!chatbotPanel || !chatbotToggle) return;
    chatbotPanel.hidden = false;
    chatbotToggle.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => chatbotInput?.focus(), 30);
  };

  const closeChatbot = () => {
    if (!chatbotPanel || !chatbotToggle) return;
    chatbotPanel.hidden = true;
    chatbotToggle.setAttribute('aria-expanded', 'false');
    chatbotToggle.focus();
  };

  const askChatbot = (question) => {
    const text = question.trim();
    if (!text || !chatbotForm || !chatbotInput) return;
    addChatbotMessage(text, 'user');
    chatbotInput.value = '';
    chatbotInput.disabled = true;
    const submit = chatbotForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    const typing = showChatbotTyping();

    window.setTimeout(() => {
      typing?.remove();
      addChatbotMessage(getChatbotAnswer(text), 'assistant');
      chatbotInput.disabled = false;
      if (submit) submit.disabled = false;
      chatbotInput.focus();
    }, 420);
  };

  chatbotToggle?.addEventListener('click', () => {
    if (chatbotPanel?.hidden) openChatbot();
    else closeChatbot();
  });

  chatbotClose?.addEventListener('click', closeChatbot);

  chatbotForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    askChatbot(chatbotInput?.value || '');
  });

  chatbotSuggestions.forEach((button) => {
    button.addEventListener('click', () => {
      openChatbot();
      askChatbot(button.dataset.chatQuestion || button.textContent || '');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && chatbotPanel && !chatbotPanel.hidden) closeChatbot();
  });

})();
