/* ============================================================
   SHREE RAM COLDDRINKS — Landing Page JavaScript
   Animations, Interactions, and Chatbot
   ============================================================ */

// ============================================================
// ORDER SYSTEM CONFIGURATION
// ============================================================
const ORDER_SYSTEM_CONFIG = {
  // 1. WhatsApp Business Number (with country code, no symbols)
  whatsappNumber: "919484448489",

  // 2. Shop Coordinates (Latitude & Longitude) for 2km Geolocation Check
  shopCoordinates: {
    lat: 21.2105071706219,
    lng: 72.85317595435777
  },

  // 3. Shop Physical Address & Details
  shopAddress: "KK Choksi Building, 9, opp. Tapibag 3, near Suman High School, Mohan ni Chawl, Surat, Gujarat 395006",
  shopHours: "10:00 AM – 11:00 PM (Mon - Sun)",

  // 4. Google Sheets Backend Apps Script URLs (for silent submission logs)
  appsScriptBulkOrderUrl: "https://script.google.com/macros/s/AKfycbzi7hiYyu7hp8uC34y5iI6zhtDqJaCEbUY5fg2AqSk50CsWm_ux49Qp6C5PeOdKvSkDnQ/exec",
  appsScriptInstantOrderUrl: "https://script.google.com/macros/s/AKfycbzi7hiYyu7hp8uC34y5iI6zhtDqJaCEbUY5fg2AqSk50CsWm_ux49Qp6C5PeOdKvSkDnQ/exec",

  // 5. Google Sheets Tab Names (Must match your Google Sheet tab names exactly)
  bulkSheetName: "Bulk Bookings",
  instantSheetName: "Instant Orders",

  // 6. Delivery ON/OFF Toggle CSV URL
  deliveryToggleCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQknX1zJ0sO48M3bQiE7yE8T0qiFurJ0m0ccSfS8auYp-AXna_bDu9WVF8mYxzBmiy0Bc1JPvYkU5wu/pub?gid=0&single=true&output=csv"
};

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Globally declared observer for reveal animations (used by dynamic menu items)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 80px 0px'
  });

  // ────────────────────────────────────────────────────────────
  // 1. STICKY HEADER
  // ────────────────────────────────────────────────────────────
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ────────────────────────────────────────────────────────────
  // 2. MOBILE HAMBURGER MENU (Open & Close Fix)
  // ────────────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on clicking outside or pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  // ────────────────────────────────────────────────────────────
  // 3. SMOOTH SCROLL FOR NAV LINKS
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ────────────────────────────────────────────────────────────
  // 4. CONTINUOUS VIDEO LOOP CONTROLLER
  // ────────────────────────────────────────────────────────────
  const heroVideo = document.getElementById('heroVideo');

  if (heroVideo) {
    heroVideo.loop = true;

    heroVideo.addEventListener('ended', () => {
      heroVideo.currentTime = 0;
      heroVideo.play().catch(err => console.log('Video loop replay error:', err));
    });

    heroVideo.play().catch(err => {
      console.log('Autoplay deferred until user interaction:', err);
    });
  }
  // ────────────────────────────────────────────────────────────
  // 5. DYNAMIC SEARCHABLE MENU DASHBOARD
  // ────────────────────────────────────────────────────────────
  const categoriesData = [
    { id: "all", name: "All Drinks", img: "images/items images/item images/lemon tukda soda.png", accent: "var(--green)" },
    { id: "lime", name: "Lime Soda", img: "images/items images/item images/lemon tukda soda.png", accent: "#6dbf2f" },
    { id: "soda", name: "Flavors Soda", img: "images/items images/item images/kiwi crush soda.png", accent: "#3db8e8" },
    { id: "coffee", name: "Coffee", img: "images/items images/item images/coffee.png", accent: "#8b5e3c" },
    { id: "chaas", name: "Varieties", img: "images/items images/item images/chas soda.png", accent: "#d4a843" },
    { id: "mojito", name: "Mojito", img: "images/items images/item images/mint mojito.png", accent: "#4cb745" },
    { id: "lassi", name: "Lassi", img: "images/items images/item images/sp. lassi.png", accent: "#e8a838" },
    { id: "coco", name: "Coco", img: "images/items images/item images/sp. coco.png", accent: "#e07830" },
    { id: "milkshake", name: "Milk Coldrinks", img: "images/items images/item images/rose milk shake.png", accent: "#e84d8a" },
    { id: "crush", name: "Crush Items", img: "images/items images/item images/black current.png", accent: "#9b59b6" }
  ];

  const menuItemsData = [
    // 1. Lime Soda
    { name: "Plain Soda", category: "lime", icon: "🍋", price: 10 },
    { name: "Tequila", category: "lime", icon: "🍋", price: 20 },
    { name: "Lemon Soda", category: "lime", icon: "🍋", price: 20 },
    { name: "Lemon Sharbat", category: "lime", icon: "🍋", price: 25 },
    { name: "Double Masala", category: "lime", icon: "🍋", price: 25 },
    { name: "Lemon Jaljeera", category: "lime", icon: "🍋", price: 25 },
    { name: "Aadu Fudina Lemon Soda", category: "lime", icon: "🍋", price: 25 },
    { name: "Fuljar Soda", category: "lime", icon: "🍋", price: 35 },
    { name: "Fresh Lemon (Sakar)", category: "lime", icon: "🍋", price: 35 },
    { name: "Lemon Tukda Soda", category: "lime", icon: "🍋", bestseller: true, price: 45 },
    { name: "Lemon Tukda Sarbat", category: "lime", icon: "🍋", bestseller: true, price: 50 },
    { name: "Masala Lemon Tukda", category: "lime", icon: "🍋", price: 50 },
    { name: "Orange Lemon Tukda", category: "lime", icon: "🍋", price: 50 },

    // 2. Flavors Soda
    { name: "Jeera Masala (Black)", category: "soda", icon: "🫧", price: 20 },
    { name: "Kala Khatta", category: "soda", icon: "🫧", price: 25 },
    { name: "Orange", category: "soda", icon: "🫧", price: 25 },
    { name: "Kachi Keri", category: "soda", icon: "🫧", price: 25 },
    { name: "Variyali Sharbat", category: "soda", icon: "🫧", price: 25 },
    { name: "Shing Masala", category: "soda", icon: "🫧", price: 25 },
    { name: "Shing Cola", category: "soda", icon: "🫧", price: 25 },
    { name: "Blue Curacao", category: "soda", icon: "🫧", isNew: true, price: 35 },
    { name: "Watermelon", category: "soda", icon: "🫧", isNew: true, price: 40 },
    { name: "Lemon Ice Tea", category: "soda", icon: "🫧", isNew: true, bestseller: true, price: 45 },

    // 3. Coffee
    { name: "Cold Coffee", category: "coffee", icon: "☕", bestseller: true, variants: [{ name: "Regular", price: 60 }, { name: "With Ice Cream", price: 80 }] },
    { name: "Frappe Coffee", category: "coffee", icon: "☕", isNew: true, variants: [{ name: "Regular", price: 70 }, { name: "With Ice Cream", price: 90 }] },
    { name: "Irish Coffee", category: "coffee", icon: "☕", isNew: true, variants: [{ name: "Regular", price: 70 }, { name: "With Ice Cream", price: 90 }] },

    // 4. Varieties
    { name: "Chaas", category: "chaas", icon: "🥛", price: 30 },
    { name: "Chaas Soda", category: "chaas", icon: "🥛", bestseller: true, price: 30 },
    { name: "Flavors Chaas Soda", category: "chaas", icon: "🥛", price: 45 },

    // 5. Mojito
    { name: "Mint Mojito", category: "mojito", icon: "🌿", isNew: true, bestseller: true, price: 45 },
    { name: "Blue Curacao Mojito", category: "mojito", icon: "🌿", isNew: true, price: 50 },
    { name: "Black Currant Mojito", category: "mojito", icon: "🌿", isNew: true, price: 50 },

    // 6. Lassi
    { name: "Punjabi Meethi", category: "lassi", icon: "🍶", price: 35 },
    { name: "Rose Lassi", category: "lassi", icon: "🍶", price: 45 },
    { name: "Kaju with Flavor Lassi", category: "lassi", icon: "🍶", price: 65 },
    { name: "Special Lassi", category: "lassi", icon: "🍶", bestseller: true, price: 95 },

    // 7. Coco
    { name: "Cold Coco", category: "coco", icon: "🥥", price: 60 },
    { name: "Chocolate Chips Coco", category: "coco", icon: "🥥", price: 70 },
    { name: "Kaju Coco", category: "coco", icon: "🥥", price: 80 },
    { name: "Ice Cream Coco", category: "coco", icon: "🥥", bestseller: true, price: 120 },

    // 8. Milk Coldrinks
    { name: "Mango", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 40 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Gulab", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 40 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Chocolate", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 40 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Elaichi", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 40 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Vanilla", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 40 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Butter Scotch", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 45 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Kesar Pista", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 45 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Mava Malai", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 45 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Rajbhog", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 45 }, { name: "Ocho Barf", price: 50 }, { name: "Special", price: 90 }] },
    { name: "Pan", category: "milkshake", icon: "🍓", isNew: true, variants: [{ name: "Regular", price: 60 }, { name: "Ocho Barf", price: 65 }, { name: "Special", price: 95 }] },
    { name: "Watermelon", category: "milkshake", icon: "🍓", isNew: true, variants: [{ name: "Regular", price: 60 }, { name: "Ocho Barf", price: 65 }, { name: "Special", price: 95 }] },
    { name: "Bournvita", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 60 }, { name: "Ocho Barf", price: 70 }, { name: "Special", price: 100 }] },
    { name: "Boost", category: "milkshake", icon: "🍓", variants: [{ name: "Regular", price: 70 }, { name: "Ocho Barf", price: 80 }, { name: "Special", price: 100 }] },

    // 9. Crush Items
    { name: "Strawberry", category: "crush", icon: "🍇", variants: [{ name: "Soda", price: 30 }, { name: "Dudh (Milk)", price: 50 }] },
    { name: "Pineapple", category: "crush", icon: "🍇", variants: [{ name: "Soda", price: 30 }, { name: "Dudh (Milk)", price: 50 }] },
    { name: "Jamrukh", category: "crush", icon: "🍇", variants: [{ name: "Soda", price: 30 }, { name: "Dudh (Milk)", price: 50 }] },
    { name: "Black Currant", category: "crush", icon: "🍇", variants: [{ name: "Soda", price: 30 }, { name: "Dudh (Milk)", price: 50 }] },
    { name: "Kiwi", category: "crush", icon: "🍇", variants: [{ name: "Soda", price: 35 }, { name: "Dudh (Milk)", price: 60 }] }
  ];



  // DOM elements for categories grid
  const menuCategoriesGrid = document.getElementById('menu-categories-grid');

  // Generate category display counts
  function getCategoryCount(catId) {
    return menuItemsData.filter(item => item.category === catId).length;
  }

  // Render Category Cards Grid (Accordion View)
  function renderCategoryGrid() {
    if (!menuCategoriesGrid) return;

    // Filter out the 'all' category tab
    const visibleCategories = categoriesData.filter(cat => cat.id !== 'all');

    menuCategoriesGrid.innerHTML = visibleCategories.map(cat => {
      const count = getCategoryCount(cat.id);
      const items = menuItemsData.filter(item => item.category === cat.id);

      // Build items grid inside the card
      const itemsHtml = items.map(item => {
        let badgeHtml = '';
        if (item.bestseller) {
          badgeHtml = '<span class="item-badge bestseller">Popular</span>';
        } else if (item.isNew) {
          badgeHtml = '<span class="item-badge new">New</span>';
        }
        return `
          <div class="category-card__item">
            <span class="item-bullet"></span>
            <span class="item-name">${item.name}</span>
            ${badgeHtml}
          </div>
        `;
      }).join('');

      return `
        <div class="category-card reveal" style="--card-accent: ${cat.accent}; --card-accent-bg: ${cat.accent}12;" data-category="${cat.id}">
          <div class="category-card__main">
            <div class="category-card__icon-wrap" style="background: ${cat.accent}15;">
              <img src="${cat.img}" alt="${cat.name}" class="category-card__image" />
            </div>
            <div class="category-card__info">
              <h3 class="category-card__name">${cat.name}</h3>
              <p class="category-card__count">${count} Drinks — Tap to view</p>
            </div>
            <div class="category-card__arrow-wrap">
              <span class="category-card__arrow">→</span>
            </div>
          </div>
          <div class="category-card__items-container">
            <div class="category-card__items-grid">
              ${itemsHtml}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to expand/collapse in place
    menuCategoriesGrid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent collapse when clicking on dynamic drink list items
        if (e.target.closest('.category-card__items-container')) {
          return;
        }

        const isExpanded = card.classList.contains('expanded');

        // Collapse all other categories
        menuCategoriesGrid.querySelectorAll('.category-card').forEach(c => {
          c.classList.remove('expanded');
        });

        // Toggle current card
        if (!isExpanded) {
          card.classList.add('expanded');

          // Smooth scroll to keep the expanded card comfortably in view
          setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });

      // Observe reveal animations
      if (typeof revealObserver !== 'undefined') {
        revealObserver.observe(card);
      }
    });
  }

  // Initial menu load
  renderCategoryGrid();

  // ────────────────────────────────────────────────────────────
  // 6. SCROLL-TRIGGERED REVEAL ANIMATIONS
  // ────────────────────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => revealObserver.observe(el));

  // ────────────────────────────────────────────────────────────
  // 7. GALLERY LIGHTBOX
  // ────────────────────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img');
      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = item.querySelector('img')?.alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ────────────────────────────────────────────────────────────
  // 8. SYRUPS CAROUSEL — DRAG & ARROWS
  // ────────────────────────────────────────────────────────────
  const syrupCarousel = document.getElementById('syrupCarousel');
  if (syrupCarousel) {
    // Duplicate syrup cards dynamically for seamless infinite marquee scroll
    const cards = Array.from(syrupCarousel.children);
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('syrup-card--dup');
      syrupCarousel.appendChild(clone);
    });
  }

  // ────────────────────────────────────────────────────────────
  // 9. CHATBOT WIDGET
  // ────────────────────────────────────────────────────────────
  const chatbotFab = document.getElementById('chatbotFab');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const quickReplies = document.getElementById('quickReplies');

  // Knowledge base
  const KB = {
    menu: {
      categories: [
        'Lime Flavors', 'Flavored Sodas', 'Coffee', 'Chaas Soda',
        'Mojitos', 'Lassi', 'Coco', 'Milkshakes', 'Crush Items'
      ],
      bestsellers: [
        'Limbu Tukda Sarbat', 'Lemon Ice Tea', 'Coffee', 'Chaas Soda',
        'Mojito', 'Special Lassi', 'Special Coco', 'Rose Milkshake',
        'Bournvita Milkshake', 'Kiwi Crush', 'Black Currant Crush'
      ]
    },
    syrups: [
      'Orange', 'Kala Khatta', 'Pineapple', 'Rose', 'Mango',
      'Butterscotch', 'Vanilla', 'Chocolate', 'Elaichi', 'Jira Masala',
      'Kachi Keri', 'Mava Malai', 'Rajbhog'
    ],
    timing: 'Mon–Sun: 10:00 AM – 11:00 PM (Open All Days)',
    address: 'Shree Ram Colddrinks, Near Main Market, City Center, Gujarat, India',
    phone: '+91 94844 48489',
    whatsapp: 'https://wa.me/919484448489',
    about: 'Shree Ram Colddrinks has been serving fresh, handcrafted beverages since 1998. We use fresh ingredients, pure sugar syrups, and no preservatives. Over 100+ flavors across 9 categories!'
  };

  // Quick reply options
  const quickOptions = [
    { label: '📋 Menu', query: 'menu' },
    { label: '⭐ Bestsellers', query: 'bestsellers' },
    { label: '🤔 Suggest Drink', query: 'suggest_drink' },
    { label: '🕐 Timings', query: 'timings' },
    { label: '📍 Location', query: 'location' },
    { label: '🍯 Syrups', query: 'syrups' },
    { label: '📞 Contact', query: 'contact' }
  ];

  // Initialize chatbot
  function initChatbot() {
    addBotMessage("Hi there! 👋 Welcome to Shree Ram Colddrinks. I can help you with menu info, timings, location, and more. What would you like to know?");
    renderQuickReplies();
  }

  function renderQuickReplies(customOptions) {
    quickReplies.innerHTML = '';
    const activeOptions = customOptions || quickOptions;
    activeOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chatbot__quick-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        addUserMessage(opt.label);
        processQuery(opt.query);
      });
      quickReplies.appendChild(btn);
    });
  }

  function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--bot';
    msg.innerHTML = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--user';
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function processQuery(input) {
    const q = input.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();

    // Detect language
    let lang = 'en';
    if (/[\u0A80-\u0AFF]/.test(q) || q.includes('kem cho') || q.includes('su che') || q.includes('cho') || q.includes('ટાઈમ') || q.includes('મેનુ') || q.includes('મેનૂ') || q.includes('સમય') || q.includes('ક્યાં') || q.includes('સરનામું') || q.includes('નમસ્તે') || q.includes('આભાર')) {
      lang = 'gu';
    } else if (q.includes('kya hai') || q.includes('kab khulega') || q.includes('kahan hai') || q.includes('ghar pe') || q.includes('chutkula') || q.includes('sabse achha') || q.includes('cheeni') || q.includes('kaise ho') || q.includes('namaste') || q.includes('kya rate') || q.includes('batao') || q.includes('shuru')) {
      lang = 'hi';
    }

    // Small delay for natural feel
    setTimeout(() => {
      let preventDefaultReplies = false;

      // Suggestion Interactive Flow
      if (q === 'suggestmilk') {
        if (lang === 'gu') {
          addBotMessage(
            `🥛 <strong>મિલ્ક (દૂધ) બેઝ્ડ અમારી ખાસ ભલામણો:</strong><br><br>` +
            `• <strong>Regular:</strong> ગુલાબ (Gulab)<br>` +
            `• <strong>Most Selling:</strong> રાજભોગ, માવા મલાઈ, કેસર પિસ્તા, બ્લેક કરન્ટ ક્રશ<br>` +
            `• <strong>New Arrival:</strong> પેશન ફ્રૂટ`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `🥛 <strong>मिल्क (दूध) बेस्ड हमारी खास सिफारिशें:</strong><br><br>` +
            `• <strong>Regular:</strong> गुलाब (Gulab)<br>` +
            `• <strong>Most Selling:</strong> राजभोग, मावा मलाई, केसर पिस्ता, ब्लैक करंट क्रश<br>` +
            `• <strong>New Arrival:</strong> पैशन फ्रूट`
          );
        } else {
          addBotMessage(
            `🥛 <strong>Here are our milk-based recommendations:</strong><br><br>` +
            `• <strong>Regular:</strong> Gulab<br>` +
            `• <strong>Most Selling:</strong> Rajbhog, Mava Malai, Kesar Pista, Black Currant Crush<br>` +
            `• <strong>New Arrival:</strong> Passion Fruit`
          );
        }
      }
      else if (q === 'suggestsoda') {
        if (lang === 'gu') {
          addBotMessage(
            `🥤 <strong>સોડા બેઝ્ડ અમારી ખાસ ભલામણો:</strong><br><br>` +
            `• **Mojito:** બ્લુ કુરાકાઓ (Blue Curacao)<br>` +
            `• **Crush:** કીવી, જામરૂખ (Kiwi, Guava)<br>` +
            `• **Soda:** લેમન આઈસ ટી (Lemon Ice Tea)`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `🥤 <strong>सोडा बेस्ड हमारी खास सिफारिशें:</strong><br><br>` +
            `• **Mojito:**कम्पलीट ब्लू कुराकाओ (Blue Curacao)<br>` +
            `• **Crush:** कीवी, अमरूद (Kiwi, Guava)<br>` +
            `• **Soda:** लेमन आइस टी (Lemon Ice Tea)`
          );
        } else {
          addBotMessage(
            `🥤 <strong>Here are our soda-based recommendations:</strong><br><br>` +
            `• **Mojito:** Blue Curacao<br>` +
            `• **Crush:** Kiwi, Guava<br>` +
            `• **Soda:** Lemon Ice Tea`
          );
        }
      }
      else if (q.includes('suggest_drink') || q.includes('confuse') || q.includes('suggest') || q.includes('piyu') || q.includes('pichu') || q.includes('piyun') || q.includes('ખબર નથી') || q.includes('શું પીવું') || q.includes('samajh nahi') || q.includes('su pivu') || q.includes('piva')) {
        preventDefaultReplies = true;
        if (lang === 'gu') {
          addBotMessage("ઓહ અદ્ભુત! હું તમને યોગ્ય ડ્રિંક પસંદ કરવામાં મદદ કરું. તમને શેમાં પીવું ગમશે, મિલ્ક કે સોડા? 🥤");
          renderQuickReplies([
            { label: '🥛 Milk', query: 'suggestmilk' },
            { label: '🥤 Soda', query: 'suggestsoda' }
          ]);
        } else if (lang === 'hi') {
          addBotMessage("ओह बहुत बढ़िया! मैं आपको सही ड्रिंक चुनने में मदद करता हूँ। आप किसमें पीना पसंद करेंगे, मिल्क या सोडा? 🥤");
          renderQuickReplies([
            { label: '🥛 Milk', query: 'suggestmilk' },
            { label: '🥤 Soda', query: 'suggestsoda' }
          ]);
        } else {
          addBotMessage("Ohh sounds great! Let me help you choose the perfect drink. What would you like to have, Milk or Soda? 🥤");
          renderQuickReplies([
            { label: '🥛 Milk', query: 'suggestmilk' },
            { label: '🥤 Soda', query: 'suggestsoda' }
          ]);
        }
      }
      // 1. MENU
      else if (q.includes('menu') || q.includes('categor') || q.includes('drink list') || q.includes('what do you have') || q.includes('મેનુ') || q.includes('મેનૂ') || q.includes('શું છે') || q.includes('vangi') || q.includes('kya h') || q.includes('list')) {
        if (lang === 'gu') {
          addBotMessage(
            `અમારી પાસે <strong>9 અલગ-અલગ ડ્રિંક કેટેગરીઝ</strong> છે! 📋 અહીં લિસ્ટ છે:<br><br>` +
            KB.menu.categories.map((c, i) => `• **${c}**`).join('<br>') +
            `<br><br>કોઈપણ કેટેગરીનું નામ લખો (જેમ કે *Mojito* અથવા *Lassi*) ભલામણો જોવા માટે! 🥤`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `हमारे पास <strong>9 ड्रिंक कैटेगरीज</strong> का शानदार मेनू है! 📋 यहाँ लिस्ट है:<br><br>` +
            KB.menu.categories.map((c, i) => `• **${c}**`).join('<br>') +
            `<br><br>सुझाव देखने के लिए किसी भी कैटेगरी का नाम लिखें (जैसे *Mojito* या *Lassi*)! 🥤`
          );
        } else {
          addBotMessage(
            `We have an amazing menu with <strong>9 drink categories</strong>! 📋 Here is the list:<br><br>` +
            KB.menu.categories.map((c, i) => `• **${c}**`).join('<br>') +
            `<br><br>Type any category name (like *Mojito* or *Lassi*) to see our recommendations! 🥤`
          );
        }
      }
      // 2. BESTSELLERS
      else if (q.includes('bestseller') || q.includes('popular') || q.includes('best') || q.includes('recommend') || q.includes('famous') || q.includes('fav') || q.includes('ખાસ') || q.includes('સારું') || q.includes('sabse achha') || q.includes('special')) {
        if (lang === 'gu') {
          addBotMessage(
            `અમારા ગ્રાહકોને આ <strong>11 બેસ્ટસેલર્સ</strong> ખૂબ જ ગમે છે! ⭐:<br><br>` +
            KB.menu.bestsellers.map(b => `• **${b}**`).join('<br>') +
            `<br><br>સ્પેશિયલ લસ્સી અને લીંબુ ટુકડા સરબત અચૂક ટ્રાય કરજો! 🔥`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `हमारे ग्राहकों को ये <strong>11 बेस्टसेलर्स</strong> बहुत पसंद हैं! ⭐:<br><br>` +
            KB.menu.bestsellers.map(b => `• **${b}**`).join('<br>') +
            `<br><br>स्पेशल लस्सी और नींबू टुकड़ा शरबत सबसे लोकप्रिय हैं! 🔥`
          );
        } else {
          addBotMessage(
            `Our customers absolutely love these <strong>11 bestsellers</strong>! ⭐:<br><br>` +
            KB.menu.bestsellers.map(b => `• **${b}**`).join('<br>') +
            `<br><br>My personal favorites are the **Limbu Tukda Sarbat** and **Special Lassi**! Which one would you like to try? 🔥`
          );
        }
      }
      // 3. SYRUPS
      else if (q.includes('syrup') || q.includes('bottle') || q.includes('take home') || q.includes('flavor') || q.includes('સીરપ') || q.includes('બોટલ') || q.includes('બોટલ') || q.includes('masala')) {
        if (lang === 'gu') {
          addBotMessage(
            `અમે ઘરે બનાવવા માટે બોટલમાં <strong>13 પ્યોર સુગર સીરપ</strong> ઓફર કરીએ છીએ! 🍯 ફ્લેવર્સ લિસ્ટ:<br><br>` +
            KB.syrups.join(', ') +
            `<br><br>આ બધી 100% પ્યોર સુગરથી બનેલી છે અને તેમાં કોઈ કેમિકલ પ્રિઝર્વેટિવ નથી! 🍯`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `हम घर पर बनाने के लिए बोतलों में <strong>13 प्योर शुगर सिरप</strong> देते हैं! 🍯 उपलब्ध फ्लेवर्स:<br><br>` +
            KB.syrups.join(', ') +
            `<br><br>ये सभी 100% प्योर शुगर से बने हैं और इसमें कोई प्रिजर्वेटिव नहीं है! 🍯`
          );
        } else {
          addBotMessage(
            `We offer <strong>13 signature pure sugar syrups</strong> in bottles to share with your family! 🍯 Available flavors:<br><br>` +
            KB.syrups.join(', ') +
            `<br><br>All are 100% pure sugar and preservative-free! 🍯`
          );
        }
      }
      // 4. TIMINGS
      else if (q.includes('time') || q.includes('timing') || q.includes('hour') || q.includes('open') || q.includes('close') || q.includes('when') || q.includes('સમય') || q.includes('ટાઈમ') || q.includes('ખુલે') || q.includes('kab khul')) {
        if (lang === 'gu') {
          addBotMessage(`🕐 <strong>ચાલુ રહેવાનો સમય:</strong><br>${KB.timing}<br><br>અમે અઠવાડિયાના તમામ દિવસોમાં ખુલ્લા છીએ! 🏪`);
        } else if (lang === 'hi') {
          addBotMessage(`🕐 <strong>खुलने का समय:</strong><br>${KB.timing}<br><br>हम हफ्ते के सभी दिन खुले रहते हैं! 🏪`);
        } else {
          addBotMessage(`🕐 <strong>Opening Hours:</strong><br>${KB.timing}<br><br>We are open every single day to serve you fresh cold drinks! 🏪`);
        }
      }
      // 5. LOCATION
      else if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('find') || q.includes('map') || q.includes('shop') || q.includes('ક્યાં') || q.includes('સરનામું') || q.includes('એડ્રેસ') || q.includes('kahan h') || q.includes('pata')) {
        if (lang === 'gu') {
          addBotMessage(`📍 <strong>અમારું સરનામું:</strong><br>${KB.address}<br><br>તમે નીચે લોકેશન સેક્શનમાં નકશો જોઈ શકો છો! 🗺️`);
        } else if (lang === 'hi') {
          addBotMessage(`📍 <strong>हमारा पता:</strong><br>${KB.address}<br><br>आप नीचे लोकेशन सेक्शन में हमारा गूगल मैप देख सकते हैं! 🗺️`);
        } else {
          addBotMessage(`📍 <strong>Our Location:</strong><br>${KB.address}<br><br>You can view our interactive map in the Location section at the bottom of the page! 🗺️`);
        }
      }
      // 6. CONTACT
      else if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('number') || q.includes('મોબાઈલ') || q.includes('ફોન') || q.includes('કરો') || q.includes('phn')) {
        if (lang === 'gu') {
          addBotMessage(
            `📞 <strong>અમારો સંપર્ક કરો:</strong><br>ફોન નંબર: ${KB.phone}<br><br>` +
            `💬 <strong>WhatsApp ઓર્ડર:</strong><br>` +
            `<a href="${KB.whatsapp}" target="_blank" style="color: #4cb745; font-weight: 700;">ઓર્ડર કરવા માટે અહીં ક્લિક કરો</a><br><br>` +
            `ફક્ત લિંક પર ક્લિક કરો અને ઓર્ડર કરો! 🚀`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `📞 <strong>हमसे संपर्क करें:</strong><br>फ़ोन नंबर: ${KB.phone}<br><br>` +
            `💬 <strong>WhatsApp आर्डर:</strong><br>` +
            `<a href="${KB.whatsapp}" target="_blank" style="color: #4cb745; font-weight: 700;">आर्डर करने के लिए यहाँ क्लिक करें</a><br><br>` +
            `बस लिंक पर क्लिक करें और आर्डर भेजें! 🚀`
          );
        } else {
          addBotMessage(
            `📞 <strong>Contact Us:</strong><br>Phone: ${KB.phone}<br><br>` +
            `💬 <strong>WhatsApp Order:</strong><br>` +
            `<a href="${KB.whatsapp}" target="_blank" style="color: #4cb745; font-weight: 700;">Click here to order on WhatsApp</a><br><br>` +
            `Just tap the link and our team will take your order! 🚀`
          );
        }
      }
      // 7. DELIVERY
      else if (q.includes('delivery') || q.includes('min order') || q.includes('deliver') || q.includes('charge') || q.includes('ship') || q.includes('ડેલીવરી') || q.includes('ઘર બેઠા') || q.includes('ઓર્ડર') || q.includes('ghar pe') || q.includes('su charge')) {
        if (lang === 'gu') {
          addBotMessage(
            `🛵 <strong>હોમ ડિલિવરી વિગતો:</strong><br>` +
            `• **મિનિમમ ઓર્ડર:** 2 આઈટમ<br>` +
            `• **ડિલિવરી ચાર્જ:** ₹30<br>` +
            `• **ડિલિવરી એરિયા:** દુકાનથી 2 કિલોમીટરની અંદર<br><br>` +
            `તમે **Craving** સેક્શનમાં જઈને ઓનલાઈન ડિલિવરી ઓર્ડર કરી શકો છો! 🛒`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `🛵 <strong>होम डिलीवरी डिटेल्स:</strong><br>` +
            `• **न्यूनतम आर्डर:** 2 आइटम<br>` +
            `• **डिलीवरी चार्ज:** ₹30<br>` +
            `• **डिलीवरी सीमा:** दुकान से 2 किमी के भीतर<br><br>` +
            `आप **Craving** सेक्शन में ऑनलाइन आर्डर कर सकते हैं! 🛒`
          );
        } else {
          addBotMessage(
            `🛵 <strong>Home Delivery Details:</strong><br>` +
            `• **Minimum Order:** 2 items<br>` +
            `• **Delivery Charge:** ₹30<br>` +
            `• **Delivery Range:** Within 2km of our shop<br><br>` +
            `You can place a delivery order using our online checkout in the **Craving** section! 🛒`
          );
        }
      }
      // 8. SUGAR / QUALITY
      else if (q.includes('sugar') || q.includes('pure') || q.includes('sweet') || q.includes('quality') || q.includes('healthy') || q.includes('preservative') || q.includes('fresh') || q.includes('ખાંડ') || q.includes('શુદ્ધ') || q.includes('પ્યોર') || q.includes('cheeni') || q.includes('safai')) {
        if (lang === 'gu') {
          addBotMessage(
            `🌿 <strong>અમારી શુદ્ધતાની ગેરંટી:</strong><br>` +
            `અમે ગુણવત્તા પર ખૂબ ધ્યાન આપીએ છીએ! દરેક ડ્રિંક **100% પ્યોર સુગર** અને **તાજી સામગ્રી** સાથે બનાવાય છે.<br>` +
            `તેમાં કોઈ કેમિકલ પ્રિઝર્વેટિવ ઉમેરવામાં આવતું નથી. તમને દરેક ઘૂંટડે શુદ્ધ ટેસ્ટ મળશે! 💚`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `🌿 <strong>हमारी शुद्धता की गारंटी:</strong><br>` +
            `हम क्वालिटी से कोई समझौता नहीं करते! हर ड्रिंक **100% प्योर शुगर** और **ताजी चीजों** से बनाई जाती है.<br>` +
            `इसमें कोई प्रिजर्वेटिव नहीं मिलाया जाता। आपको हर घूंट में शुद्ध स्वाद मिलेगा! 💚`
          );
        } else {
          addBotMessage(
            `🌿 <strong>Our Purity Guarantee:</strong><br>` +
            `We take quality very seriously! Every beverage is crafted using **100% pure sugar** and **fresh ingredients**.<br>` +
            `Absolutely **no preservatives** or chemical additives. You get the pure, authentic taste in every sip! 💚`
          );
        }
      }
      // 9. CUSTOMIZATION
      else if (q.includes('custom') || q.includes('ice') || q.includes('ocho barf') || q.includes('less ice') || q.includes('બરફ') || q.includes('ઓછો') || q.includes('barf kam')) {
        if (lang === 'gu') {
          addBotMessage(
            `🍧 <strong>ઓર્ડર કસ્ટમાઇઝેશન:</strong><br>` +
            `હા, તમે તમારા ટેસ્ટ મુજબ ઓર્ડર બદલી શકો છો! મિલ્કશેક માટે **Regular**, **Ocho Barf** (ઓછો બરફ) અથવા **Special** ઓપ્શન્સ ઉપલબ્ધ છે.<br>` +
            `તમે WhatsApp પર તમારી પસંદગી જણાવી શકો છો! 💬`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `🍧 <strong>आर्डर कस्टमाइजेशन:</strong><br>` +
            `हाँ! आप अपनी पसंद के अनुसार ड्रिंक कस्टमाइज़ कर सकते हैं! मिल्कशेक में **Regular**, **Ocho Barf** (कम बर्फ) या **Special** विकल्प हैं.<br>` +
            `आप WhatsApp पर हमें अपनी पसंद बता सकते हैं! 💬`
          );
        } else {
          addBotMessage(
            `🍧 <strong>Drink Customization:</strong><br>` +
            `Yes! You can customize your drinks! We offer options like **Regular**, **Ocho Barf** (Less Ice), or **Special** for our milkshakes.<br>` +
            `You can also tell us any custom sweetness or ice request when checking out to WhatsApp! 💬`
          );
        }
      }
      // 10. JOKE
      else if (q.includes('joke') || q.includes('funny') || q.includes('fun') || q.includes('laugh') || q.includes('જોક્સ') || q.includes('ચુટકલા') || q.includes('chutkula') || q.includes('shayeri')) {
        if (lang === 'gu') {
          addBotMessage(
            `અહીં તમારા માટે એક મસ્ત જોક છે! 🍋<br><br>` +
            `*લીંબુ કેમ ગબડતું બંધ થઈ ગયું?*<br>` +
            `કારણ કે તેનો રસ ખતમ થઈ ગયો હતો! 🤣<br><br>` +
            `આશા છે કે તમને મજા આવી હશે! આજે કયું ઠંડું પીણું પીવું છે? 🍹`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `यहाँ आपके लिए एक मजेदार चुटकुला है! 🍋<br><br>` +
            `*नींबू क्यों लुढ़कना बंद हो गया?*<br>` +
            `क्योंकि उसका रस खत्म हो गया था! 🤣<br><br>` +
            `आशा है आपको पसंद आया होगा! आज कौन सी ड्रिंक पीना पसंद करेंगे? 🍹`
          );
        } else {
          addBotMessage(
            `Here is a fresh joke for you! 🍋<br><br>` +
            `*Why did the lemon stop rolling down the hill?*<br>` +
            `Because it ran out of juice! 🤣<br><br>` +
            `Hope that brought a smile to your face! What drink can I help you choose today? 🍹`
          );
        }
      }
      // 11. ABOUT
      else if (q.includes('about') || q.includes('story') || q.includes('history') || q.includes('who are you') || q.includes('owner') || q.includes('દુકાન') || q.includes('ઇતિહાસ') || q.includes('itihas') || q.includes('kaun h')) {
        if (lang === 'gu') {
          addBotMessage(
            `શ્રી રામ કોલ્ડ્રિંક્સની શરૂઆત **1998**માં સોડાની એક નાની લારીથી થઈ હતી.<br>` +
            `આજે ગ્રાહકોના પ્રેમ અને પ્યોર સુગર-તાજી સામગ્રીની ક્વોલિટીને લીધે અમે એક લોકપ્રિય બ્રાન્ડ બની ચૂક્યા છીએ! 💚`
          );
        } else if (lang === 'hi') {
          addBotMessage(
            `श्री राम कोल्ड्रिंक्स की शुरुआत **1998** में एक छोटी सोडा गाड़ी से हुई थी.<br>` +
            `ग्राहकों के प्यार और क्वालिटी (प्योर शुगर और ताजी सामग्री) के कारण आज हम सबसे पसंदीदा ब्रांड बन गए हैं! 💚`
          );
        } else {
          addBotMessage(
            `Shree Ram Colddrinks started in **1998** as a small, humble cart serving local soda.<br>` +
            `Over 40 years of legacy, we have grown into a beloved destination because of our focus on **pure sugar**, **fresh ingredients**, and the love of our customers! 💚`
          );
        }
      }
      // Specific drinks
      else if (q.includes('mojito')) {
        addBotMessage(lang === 'gu' ? 'અમારું <strong>મોજીતો (Mojito)</strong> બેસ્ટસેલર છે! 🌿 ફ્રેશ ફુદીનો, લીંબુ અને અમારી સિક્રેટ પ્યોર સુગર સીરપનો શાનદાર ટેસ્ટ!' : lang === 'hi' ? 'हमारा <strong>मोजितो (Mojito)</strong> बेस्टसेलर है! 🌿 फ्रेश पुदीना, नींबू और हमारी सीक्रेट प्योर शुगर सिरप का लाजवाब स्वाद!' : 'Our <strong>Mojito</strong> is the #1 bestseller! 🌿 Fresh mint, lime, and our secret pure sugar syrup — absolutely refreshing. Available in multiple variations!');
      }
      else if (q.includes('lassi')) {
        addBotMessage(lang === 'gu' ? 'અમારી <strong>સ્પેશિયલ લસ્સી</strong> એકદમ ઘટ્ટ, ક્રીમી અને તાજા દહીંમાંથી બને છે. પ્યોર રાજવાડી ટેસ્ટ! 🥛' : lang === 'hi' ? 'हमारी <strong>स्पेशल लस्सी</strong> एकदम गाढ़ी, क्रीमी और ताजे दही से बनती है। शुद्ध राजवाड़ी स्वाद! 🥛' : 'Our <strong>Special Lassi</strong> is thick, creamy, and made with fresh yogurt. A true classic! 🥛');
      }
      else if (q.includes('coffee')) {
        addBotMessage(lang === 'gu' ? 'અમારી <strong>કોલ્ડ કોફી</strong> ક્રીમી અને એકદમ ઠંડી હોય છે. ☕ એનર્જીથી ભરપૂર!' : lang === 'hi' ? 'हमारी <strong>कोल्ड कॉफ़ी</strong> क्रीमी और एकदम ठंडी होती है। ☕ एनर्जी से भरपूर!' : 'Our <strong>Iced Coffee</strong> is smooth, creamy, and perfectly chilled. ☕ A great pick-me-up!');
      }
      // Greetings
      else if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('kem cho') || q.includes('how are you') || q.includes('kaise ho') || q.includes('नमस्ते') || q.includes('નમસ્તે')) {
        if (lang === 'gu') {
          addBotMessage('ઓહ અદ્ભુત! નમસ્તે! કેમ છો? 🙏 શ્રી રામ કોલ્ડ્રિંક્સમાં તમારું સ્વાગત છે! આજે હું તમને કેવી રીતે મદદ કરું? તમે મેનુ, બેસ્ટસેલર્સ અથવા હોમ ડિલિવરી વિશે પૂછી શકો છો!');
        } else if (lang === 'hi') {
          addBotMessage('ओह बहुत बढ़िया! नमस्ते! कैसे हैं आप? 🙏 श्री राम कोल्ड्रिंक्स में आपका स्वागत है! आज मैं आपकी कैसे सहायता कर सकता हूँ? आप हमारे मेनू, बेस्टसेलर्स या होम डिलीवरी के बारे में पूछ सकते हैं!');
        } else {
          addBotMessage('Ohh sounds great! Namaste! Kem cho? 🙏 Welcome to Shree Ram Colddrinks! How can I help you today? You can ask about our menu, bestsellers, pure sugar policy, or home delivery details!');
        }
      }
      // Thanks / Bye
      else if (q.includes('thank') || q.includes('thanks') || q.includes('bye') || q.includes('aabhar') || q.includes('shukriya')) {
        if (lang === 'gu') {
          addBotMessage('વાત કરવા બદલ ખૂબ ખૂબ આભાર! તમારો દિવસ શુભ અને તાજગીભર્યો રહે! 💚');
        } else if (lang === 'hi') {
          addBotMessage('बात करने के लिए बहुत-बहुत धन्यवाद! आपका दिन शुभ और ताजगीभरा रहे! 💚');
        } else {
          addBotMessage('Thank you so much for chatting! 🙏 Have a wonderful, refreshing day! 💚');
        }
      }
      // Fallback
      else {
        if (lang === 'gu') {
          addBotMessage(`માફ કરશો, હું બરાબર સમજી શક્યો નથી. શું તમારી પાસે કોઈ બીજો પ્રશ્ન છે? 😊`);
        } else if (lang === 'hi') {
          addBotMessage(`माफ़ कीजिये, मैं ठीक से समझ नहीं पाया। क्या आपका कोई और सवाल है? 😊`);
        } else {
          addBotMessage(`Sorry, I can't understand properly. Do you have another question? 😊`);
        }
      }
      if (!preventDefaultReplies) {
        renderQuickReplies();
      }
    }, 500);
  }

  // Toggle chatbot
  chatbotFab.addEventListener('click', () => {
    const isActive = chatbotWindow.classList.toggle('active');
    chatbotFab.classList.toggle('active');

    if (isActive && chatMessages.children.length === 0) {
      initChatbot();
    }

    if (isActive) {
      chatInput.focus();
    }
  });

  // Send message
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addUserMessage(text);
    chatInput.value = '';
    processQuery(text);
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // ────────────────────────────────────────────────────────────
  // 10. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
  // ────────────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-links a');

  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--green)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });


  // ────────────────────────────────────────────────────────────
  // 11. SCROLL-PINNED HORIZONTAL HISTORY TIMELINE (Cellini Video Matched)
  // ────────────────────────────────────────────────────────────
  const scrollContainer = document.querySelector('.history-scroll-container');
  const hsWidget = document.getElementById('hsWidget');
  const hsNavBtns = document.querySelectorAll('.hs-card-nav__btn');
  const hsSlides = document.querySelectorAll('.hs-card-slide');
  const hsIndicator = document.getElementById('hsNavIndicator');
  const hsClose = document.getElementById('hsClose');
  let hsCurrentIdx = 0;

  // Align the gold sliding indicator line below active button
  function hsUpdateIndicator(btn) {
    if (!hsIndicator || !btn) return;
    const nav = document.getElementById('hsNav');
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    hsIndicator.style.width = `${btnRect.width}px`;
    hsIndicator.style.left = `${btnRect.left - navRect.left}px`;
  }

  // Go to a specific slide index directly
  function hsGoTo(idx, direction) {
    if (idx === hsCurrentIdx) return;

    const currentSlide = hsSlides[hsCurrentIdx];
    const nextSlide = hsSlides[idx];

    if (currentSlide) currentSlide.classList.remove('active');
    if (nextSlide) nextSlide.classList.add('active');

    hsNavBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
      if (i === idx) hsUpdateIndicator(btn);
    });

    hsCurrentIdx = idx;
  }

  // Handle slide transitions relative to scroll progress
  function handleHistoryScroll() {
    if (!scrollContainer || !hsWidget) return;

    const rect = scrollContainer.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;

    const totalScrollableDistance = containerHeight - viewportHeight;
    if (totalScrollableDistance <= 0) return;

    // Calculate progress as fraction of distance scrolled through the container
    const scrollProgress = -containerTop / totalScrollableDistance;
    const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);

    const numSlides = hsSlides.length;
    let targetIndex = Math.floor(clampedProgress * numSlides);
    if (targetIndex >= numSlides) targetIndex = numSlides - 1;

    if (targetIndex !== hsCurrentIdx) {
      hsGoTo(targetIndex, targetIndex > hsCurrentIdx ? 'next' : 'prev');
    }

    // Keep active card visible once pinned
    if (containerTop <= 50 && -containerTop < totalScrollableDistance + 50) {
      hsWidget.classList.add('hs-visible');
    }
  }

  // Synced year button clicks to page scroll offset
  hsNavBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (scrollContainer) {
        const rect = scrollContainer.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const containerTopAbs = rect.top + scrollTop;
        const totalScrollableDistance = rect.height - window.innerHeight;

        // Position the scroll directly in the middle range of the target slide
        const slideScrollProgress = (i + 0.45) / hsSlides.length;
        const targetScroll = containerTopAbs + (slideScrollProgress * totalScrollableDistance);

        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      } else {
        hsGoTo(i, i > hsCurrentIdx ? 'next' : 'prev');
      }
    });
  });

  // Close timeline button scrolls user past the history container
  if (hsClose && scrollContainer) {
    hsClose.addEventListener('click', () => {
      const rect = scrollContainer.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.bottom + scrollTop - 10,
        behavior: 'smooth'
      });
    });
  }

  // Check visibility for first-time widget scroll-in animation
  if (hsWidget) {
    const widgetObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hsWidget.classList.add('hs-visible');
          const firstBtn = hsNavBtns[0];
          if (firstBtn) {
            setTimeout(() => hsUpdateIndicator(firstBtn), 150);
          }
          widgetObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });
    widgetObserver.observe(hsWidget);
  }

  // Window listeners for progress update and resizing
  window.addEventListener('scroll', handleHistoryScroll, { passive: true });
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.hs-card-nav__btn.active');
    if (activeBtn) hsUpdateIndicator(activeBtn);
  });

  // Touch Swipe navigation support
  let hsTouchStartX = 0;
  if (hsWidget) {
    hsWidget.addEventListener('touchstart', (e) => {
      hsTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    hsWidget.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - hsTouchStartX;
      if (Math.abs(dx) > 55) {
        if (dx < 0) {
          // Swipe left (next)
          const nextIdx = Math.min(hsCurrentIdx + 1, hsSlides.length - 1);
          if (window.innerWidth > 768) {
            hsNavBtns[nextIdx].click();
          } else {
            hsGoTo(nextIdx, 'next');
          }
        } else {
          // Swipe right (prev)
          const prevIdx = Math.max(hsCurrentIdx - 1, 0);
          if (window.innerWidth > 768) {
            hsNavBtns[prevIdx].click();
          } else {
            hsGoTo(prevIdx, 'prev');
          }
        }
      }
    }, { passive: true });
  }

  // ────────────────────────────────────────────────────────────
  // 10. ORDER ONLINE SYSTEM — TABS, GEOLOCATION, CART & SHEET SUBMISSION
  // ────────────────────────────────────────────────────────────

  const instantOrderSection = document.getElementById('instant-order-section');

  // --- SECTION 1: Bulk Order Date Constraints & Form Submit ---
  const bulkDateInput = document.getElementById('bulk-date');
  const bulkGlassInput = document.getElementById('bulk-glass-count');
  const bulkDateHint = document.getElementById('bulk-date-hint');
  const bulkForm = document.getElementById('bulk-order-form-el');
  const bulkStatus = document.getElementById('bulk-form-status');

  // Set min-date limit dynamically based on glass count
  function updateBulkDateConstraints() {
    if (!bulkDateInput) return;

    const count = parseInt(bulkGlassInput?.value || 0, 10);
    const advanceDays = count >= 500 ? 2 : 1;

    const today = new Date();
    today.setDate(today.getDate() + advanceDays);

    // Format to yyyy-mm-dd
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;

    bulkDateInput.min = minDateStr;
    bulkDateHint.textContent = `Please book at least ${advanceDays} day${advanceDays > 1 ? 's' : ''} in advance`;

    // If current value is earlier than min date, reset it
    if (bulkDateInput.value && bulkDateInput.value < minDateStr) {
      bulkDateInput.value = minDateStr;

      // Update our custom display input value as well
      const displayDateInput = document.getElementById('custom-date-display');
      if (displayDateInput) {
        displayDateInput.value = `${dd}-${mm}-${yyyy}`;
      }
    }
  }

  if (bulkGlassInput) {
    bulkGlassInput.addEventListener('input', updateBulkDateConstraints);
    updateBulkDateConstraints(); // Set default min date on load
  }

  // Handle Bulk Order Submission
  if (bulkForm) {
    bulkForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('bulk-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      const formData = new FormData(bulkForm);
      const params = new URLSearchParams();

      // Routing parameters to direct data to the correct Google Sheet tab
      params.append('sheetName', ORDER_SYSTEM_CONFIG.bulkSheetName);
      params.append('sheet', ORDER_SYSTEM_CONFIG.bulkSheetName);
      params.append('formType', 'bulk');
      params.append('type', 'bulk');
      params.append('action', 'bulk');

      formData.forEach((value, key) => {
        if (key === 'name') {
          params.append('name', value);
          params.append('Name', value);
          params.append('bulkName', value); // for old script compatibility
          return;
        }
        if (key === 'phone') {
          params.append('phone', value);
          params.append('Number', value);
          return;
        }
        if (key === 'function') {
          params.append('function', value);
          params.append('Function Name', value);
          params.append('bulkFunction', value); // for old script compatibility
          return;
        }
        if (key === 'glass_count') {
          params.append('glass_count', value);
          params.append('Avg Glasses', value);
          params.append('bulkGlassCount', value); // for old script compatibility
          return;
        }
        if (key === 'date') {
          // Format date as DD-MM-YYYY for Google Sheets
          const dateParts = value.split('-');
          if (dateParts.length === 3) {
            const formatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            params.append('date', formatted);
            params.append('Event Date', formatted);
            params.append('bulkDate', value); // for old script compatibility (YYYY-MM-DD)
          } else {
            params.append('date', value);
            params.append('Event Date', value);
            params.append('bulkDate', value); // for old script compatibility
          }
          return;
        }
        if (key === 'items') {
          params.append('items', value);
          params.append('Flavor', value);
          params.append('bulkItems', value); // for old script compatibility
          return;
        }
        if (key === 'location') {
          params.append('location', value);
          params.append('Function Location', value);
          params.append('bulkLocation', value); // for old script compatibility
          return;
        }
        if (key === 'notes') {
          params.append('notes', value);
          params.append('Additional Info', value);
          params.append('bulkDesc', value); // for old script compatibility
          return;
        }
        params.append(key, value);
      });

      // Silent background request (no page reload) to Apps Script Web App
      const bulkUrlWithQuery = `${ORDER_SYSTEM_CONFIG.appsScriptBulkOrderUrl}?sheetName=${encodeURIComponent(ORDER_SYSTEM_CONFIG.bulkSheetName)}`;
      fetch(bulkUrlWithQuery, {
        method: 'POST',
        body: params,
        mode: 'no-cors' // Allows bypassing CORS limitations of Google Apps Script URL redirect
      })
        .then(() => {
          bulkForm.reset();
          updateBulkDateConstraints();

          // Collapse form immediately
          const bulkCollapsibleWrapper = document.getElementById('bulkCollapsibleWrapper');
          const btnBulkOrderToggle = document.getElementById('btnBulkOrderToggle');
          if (bulkCollapsibleWrapper && bulkCollapsibleWrapper.classList.contains('open')) {
            bulkCollapsibleWrapper.classList.remove('open');
            bulkCollapsibleWrapper.style.maxHeight = '0px';
            
            if (btnBulkOrderToggle) {
              btnBulkOrderToggle.classList.remove('active');
              const toggleText = btnBulkOrderToggle.querySelector('.btn-order-toggle__text');
              const toggleArrow = btnBulkOrderToggle.querySelector('.btn-order-toggle__arrow');
              if (toggleText) toggleText.textContent = 'Click Here for Bulk Order';
              if (toggleArrow) toggleArrow.textContent = '▼';
            }
          }

          // Show immediate confirmation message
          alert("✅ Thank you! Our team will contact you soon.");
        })
        .catch(err => {
          console.error("Bulk Order Error:", err);
          showBulkStatus("⚠️ Submission failed. Please try again or call us.", "error");
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Inquiry';
          }
        });
    });
  }

  function showBulkStatus(msg, type) {
    if (!bulkStatus) return;
    bulkStatus.className = `form-status-msg ${type}`;
    bulkStatus.textContent = msg;
    bulkStatus.style.display = 'block';

    setTimeout(() => {
      bulkStatus.style.display = 'none';
    }, 6000);
  }

  // --- SECTION 2: Instant Order & Geolocation System ---
  let isDeliveryEnabled = true;
  let cart = [];
  let userAddress = "";
  let userCoords = null;
  let verifiedDistance = null;

  const deliveryBanner = document.getElementById('delivery-status-banner');
  const locationGate = document.getElementById('location-gate');
  const btnUseGps = document.getElementById('btn-use-gps');
  const btnManualFallback = document.getElementById('btn-manual-fallback');
  const gpsStatus = document.getElementById('gps-status');

  const manualAddressCard = document.getElementById('manual-address-card');
  const manualAddressInput = document.getElementById('instant-manual-address');
  const btnConfirmAddress = document.getElementById('btn-confirm-address');

  const zoneStatus = document.getElementById('zone-status');
  const zoneSuccess = document.getElementById('zone-badge-success');
  const zoneOutside = document.getElementById('zone-badge-outside');
  const valDistance = document.getElementById('detected-distance');
  const valDistanceOutside = document.getElementById('detected-distance-outside');
  const btnChangeLoc = document.getElementById('btn-change-loc');

  const instantOrderFlow = document.getElementById('instant-order-flow');
  const rdoDelivery = document.getElementById('mode-delivery');
  const rdoPickup = document.getElementById('mode-pickup');
  const optPickup = document.getElementById('mode-pickup-option');

  const instantCategoriesGrid = document.getElementById('instant-categories-grid');

  const cartList = document.getElementById('cart-items-list');
  const cartSummary = document.getElementById('cart-summary');
  const cartTotalQty = document.getElementById('cart-total-qty');
  const cartTotalAmount = document.getElementById('cart-total-amount');
  const cartCheckoutForm = document.getElementById('cart-checkout-form');
  const cartName = document.getElementById('cart-name');
  const cartPhone = document.getElementById('cart-phone');
  const cartAddress = document.getElementById('cart-address');
  const cartAddressGroup = document.getElementById('cart-address-group');

  // 1. Fetch Delivery Toggle Status
  function checkDeliveryToggle() {
    if (!deliveryBanner) return;

    fetch(ORDER_SYSTEM_CONFIG.deliveryToggleCsvUrl)
      .then(res => res.text())
      .then(csvText => {
        const status = csvText.split('\n')[0].split(',')[0].replace(/["']/g, "").trim().toUpperCase();
        if (status === 'OFF') {
          setDeliveryOffline();
        } else {
          setDeliveryOnline();
        }
      })
      .catch(err => {
        console.warn("Delivery toggle check failed, defaulting to ON:", err);
        setDeliveryOnline();
      });
  }

  function setDeliveryOffline() {
    isDeliveryEnabled = false;
    if (instantOrderSection) instantOrderSection.style.display = 'none';
    if (deliveryBanner) deliveryBanner.style.display = 'flex';
    if (rdoDelivery) rdoDelivery.disabled = true;
    if (rdoPickup) rdoPickup.checked = true;

    // Hide Order Now buttons in header/menu
    const headerOrderBtn = document.getElementById('headerOrderBtn');
    const mobileMenuOrderBtn = document.getElementById('mobileMenuOrderBtn');
    if (headerOrderBtn) headerOrderBtn.classList.add('order-btn-hidden');
    if (mobileMenuOrderBtn) mobileMenuOrderBtn.classList.add('order-btn-hidden');

    // Bypass GPS gate and unlock menu in Pickup mode directly
    unlockInstantOrderFlow('pickup');
  }

  function setDeliveryOnline() {
    isDeliveryEnabled = true;
    if (instantOrderSection) instantOrderSection.style.display = 'block';
    if (deliveryBanner) deliveryBanner.style.display = 'none';
    if (rdoDelivery) {
      rdoDelivery.disabled = false;
      rdoDelivery.checked = true;
    }

    // Show Order Now buttons in header/menu
    const headerOrderBtn = document.getElementById('headerOrderBtn');
    const mobileMenuOrderBtn = document.getElementById('mobileMenuOrderBtn');
    if (headerOrderBtn) headerOrderBtn.classList.remove('order-btn-hidden');
    if (mobileMenuOrderBtn) mobileMenuOrderBtn.classList.remove('order-btn-hidden');
  }

  // Helper: Haversine distance calculator
  function getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // GPS Geolocation Handler
  if (btnUseGps) {
    btnUseGps.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showGpsStatus("⚠️ Geolocation is not supported by your browser.", "error");
        return;
      }

      showGpsStatus("🔄 Requesting GPS location...", "info");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          userCoords = { lat: userLat, lng: userLng };

          const distance = getHaversineDistance(
            userLat, userLng,
            ORDER_SYSTEM_CONFIG.shopCoordinates.lat,
            ORDER_SYSTEM_CONFIG.shopCoordinates.lng
          );
          verifiedDistance = distance.toFixed(2);

          // Address placeholder with coordinates
          userAddress = `GPS Coordinates: ${userLat.toFixed(6)}, ${userLng.toFixed(6)} (approx. ${verifiedDistance}km from shop)`;

          if (distance <= 2.0) {
            // Success
            showGpsStatus("", "none");
            locationGate.style.display = 'none';
            if (manualAddressCard) manualAddressCard.style.display = 'none';

            zoneStatus.style.display = 'block';
            zoneSuccess.style.display = 'block';
            zoneOutside.style.display = 'none';
            if (valDistance) valDistance.textContent = verifiedDistance;

            unlockInstantOrderFlow('delivery');
          } else {
            // Outside zone
            showGpsStatus("", "none");
            locationGate.style.display = 'none';
            if (manualAddressCard) manualAddressCard.style.display = 'none';

            zoneStatus.style.display = 'block';
            zoneSuccess.style.display = 'none';
            zoneOutside.style.display = 'block';
            if (valDistanceOutside) valDistanceOutside.textContent = verifiedDistance;

            // Lock mode to pickup
            unlockInstantOrderFlow('pickup');
          }
        },
        (error) => {
          console.error("GPS Error:", error);
          let errMsg = "Unable to retrieve your location.";
          if (error.code === error.PERMISSION_DENIED) {
            errMsg = "Location permission denied. Please enter address manually.";
          }
          showGpsStatus(`⚠️ ${errMsg}`, "error");
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  // Address Fallback Handler
  if (btnManualFallback) {
    btnManualFallback.addEventListener('click', () => {
      locationGate.style.display = 'none';
      manualAddressCard.style.display = 'block';
      gpsStatus.style.display = 'none';
      updateCollapsibleHeight();
    });
  }

  // Confirm Manual Address
  if (btnConfirmAddress && manualAddressInput) {
    btnConfirmAddress.addEventListener('click', () => {
      const addressVal = manualAddressInput.value.trim();
      if (!addressVal) {
        alert("Please enter a valid delivery address.");
        return;
      }
      userAddress = addressVal;
      manualAddressCard.style.display = 'none';
      unlockInstantOrderFlow('delivery'); // Proceed in delivery mode, manually verified on WhatsApp
      updateCollapsibleHeight();
    });
  }

  // Reset/Change Location
  if (btnChangeLoc) {
    btnChangeLoc.addEventListener('click', () => {
      zoneStatus.style.display = 'none';
      instantOrderFlow.style.display = 'none';
      locationGate.style.display = 'block';
      userAddress = "";
      userCoords = null;
      verifiedDistance = null;
      updateCollapsibleHeight();
    });
  }

  function showGpsStatus(msg, type) {
    if (!gpsStatus) return;
    if (type === 'none') {
      gpsStatus.style.display = 'none';
      updateCollapsibleHeight();
      return;
    }
    gpsStatus.className = `gps-status-message ${type}`;
    gpsStatus.textContent = msg;
    gpsStatus.style.display = 'block';
    updateCollapsibleHeight();
  }

  // Unlock Ordering Grid
  function unlockInstantOrderFlow(mode) {
    if (!instantOrderFlow) return;
    instantOrderFlow.style.display = 'block';

    const modeSelector = document.querySelector('.order-mode-selector');

    if (mode === 'pickup') {
      if (rdoPickup) rdoPickup.checked = true;
      if (cartAddressGroup) cartAddressGroup.style.display = 'none';
      if (cartAddress) cartAddress.required = false;
      modeSelector?.classList.add('pickup-active');
    } else {
      if (rdoDelivery) rdoDelivery.checked = true;
      if (cartAddressGroup) cartAddressGroup.style.display = 'block';
      if (cartAddress) {
        cartAddress.value = userAddress;
        cartAddress.required = true;
      }
      modeSelector?.classList.remove('pickup-active');
    }

    renderInstantMenu();
    updateCartDisplay();
    updateCollapsibleHeight();
  }

  // Toggle Delivery / Pickup mode manually in order flow
  if (rdoDelivery) {
    rdoDelivery.addEventListener('change', () => {
      document.querySelector('.order-mode-selector')?.classList.remove('pickup-active');
      if (cartAddressGroup) cartAddressGroup.style.display = 'block';
      if (cartAddress) {
        cartAddress.value = userAddress || "Please provide address";
        cartAddress.required = true;
      }
      updateCartDisplay();
      updateCollapsibleHeight();
    });
  }

  if (rdoPickup) {
    rdoPickup.addEventListener('change', () => {
      document.querySelector('.order-mode-selector')?.classList.add('pickup-active');
      if (cartAddressGroup) cartAddressGroup.style.display = 'none';
      if (cartAddress) {
        cartAddress.value = "";
        cartAddress.required = false;
      }
      updateCartDisplay();
      updateCollapsibleHeight();
    });
  }

  // Render Section 2 categories & item accordions
  function renderInstantMenu() {
    if (!instantCategoriesGrid) return;

    // Exclude 'all' from order accordion
    const orderCategories = categoriesData.filter(cat => cat.id !== 'all');

    instantCategoriesGrid.innerHTML = orderCategories.map(cat => {
      const items = menuItemsData.filter(item => item.category === cat.id);

      const itemsHtml = items.map((item, itemIdx) => {
        let selectorHtml = '';
        let initialPrice = item.price;

        if (item.variants) {
          initialPrice = item.variants[0].price;
          selectorHtml = `
            <div class="custom-select" data-item-name="${item.name}" data-selected-value="${item.variants[0].name}" data-selected-price="${item.variants[0].price}">
              <div class="custom-select-trigger">
                <span class="selected-text">${item.variants[0].name}</span>
                <span class="custom-select-arrow">▼</span>
              </div>
              <div class="custom-select-options">
                ${item.variants.map((v, vIdx) => `
                  <div class="custom-select-option ${vIdx === 0 ? 'selected' : ''}" data-value="${v.name}" data-price="${v.price}">
                    ${v.name}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }

        // Check if item is already in cart
        const cartItem = cart.find(ci => ci.name === item.name);
        const inCartClass = cartItem ? 'in-cart' : '';
        const qtyVal = cartItem ? cartItem.qty : 1;

        return `
          <div class="instant-item-card ${inCartClass}" data-item-name="${item.name}">
            <div class="instant-item-header">
              <div class="instant-item-details">
                <span class="instant-item-name">${item.name}</span>
                <span class="instant-item-price">₹<span class="price-val">${initialPrice}</span></span>
              </div>
            </div>
            
            ${selectorHtml}
            
            <div class="instant-item-actions">
              <button class="btn-add-to-cart" onclick="addDrinkToCart('${item.name}', this)">
                + Add
              </button>
              <div class="cart-qty-counter">
                <button class="btn-qty-dec" onclick="adjustDrinkQty('${item.name}', -1, this)">-</button>
                <span class="qty-val">${qtyVal}</span>
                <button class="btn-qty-inc" onclick="adjustDrinkQty('${item.name}', 1, this)">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="instant-cat-accordion" data-cat-id="${cat.id}">
          <div class="instant-cat-header" style="border-left: 5px solid ${cat.accent};">
            <div class="instant-cat-header-left">
              <img src="${cat.img}" class="instant-cat-img" alt="${cat.name}" />
              <span class="instant-cat-name">${cat.name}</span>
            </div>
            <span class="instant-cat-toggle-icon">▼</span>
          </div>
          <div class="instant-cat-body">
            <div class="instant-cat-items">
              ${itemsHtml}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Accordion click listeners
    instantCategoriesGrid.querySelectorAll('.instant-cat-header').forEach(header => {
      header.addEventListener('click', () => {
        const accordion = header.closest('.instant-cat-accordion');
        const isActive = accordion.classList.contains('active');

        // Collapse all others
        instantCategoriesGrid.querySelectorAll('.instant-cat-accordion').forEach(a => {
          a.classList.remove('active');
        });

        if (!isActive) {
          accordion.classList.add('active');
        }
        updateCollapsibleHeight();
      });
    });

    // Handle custom dropdown selection
    const customSelects = instantCategoriesGrid.querySelectorAll('.custom-select');
    customSelects.forEach(select => {
      const trigger = select.querySelector('.custom-select-trigger');
      const options = select.querySelectorAll('.custom-select-option');
      const selectedText = select.querySelector('.selected-text');
      const card = select.closest('.instant-item-card');

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelects.forEach(s => {
          if (s !== select) s.classList.remove('open');
        });
        select.classList.toggle('open');
      });

      options.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = opt.getAttribute('data-value');
          const price = opt.getAttribute('data-price');

          select.setAttribute('data-selected-value', val);
          select.setAttribute('data-selected-price', price);
          selectedText.textContent = val;

          options.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          select.classList.remove('open');

          if (card) {
            card.querySelector('.price-val').textContent = price;
          }

          const itemName = select.getAttribute('data-item-name');
          const cartIdx = cart.findIndex(ci => ci.name === itemName);
          if (cartIdx > -1) {
            cart[cartIdx].variant = val;
            cart[cartIdx].price = parseInt(price, 10);
            updateCartDisplay();
          }
        });
      });
    });

    // Close on click outside
    document.addEventListener('click', () => {
      customSelects.forEach(s => s.classList.remove('open'));
    });
  }

  // Cart operations exposed to window scope for onclick handlers
  window.addDrinkToCart = function (itemName, btn) {
    const card = btn.closest('.instant-item-card');
    const customSelect = card.querySelector('.custom-select');

    let variantName = "";
    let price = 0;

    const menuItem = menuItemsData.find(item => item.name === itemName);

    if (menuItem.variants) {
      if (customSelect) {
        variantName = customSelect.getAttribute('data-selected-value');
        price = parseInt(customSelect.getAttribute('data-selected-price'), 10);
      } else {
        variantName = menuItem.variants[0].name;
        price = menuItem.variants[0].price;
      }
    } else {
      price = menuItem.price;
    }

    const cartItem = {
      name: itemName,
      variant: variantName,
      price: price,
      qty: 1
    };

    cart.push(cartItem);

    if (card) {
      card.classList.add('in-cart');
      card.querySelector('.cart-qty-counter .qty-val').textContent = 1;
    }

    updateCartDisplay();
  };

  window.adjustDrinkQty = function (itemName, change, btn) {
    const cartIdx = cart.findIndex(ci => ci.name === itemName);
    if (cartIdx === -1) return;

    cart[cartIdx].qty += change;

    const card = document.querySelector(`.instant-item-card[data-item-name="${itemName}"]`);

    if (cart[cartIdx].qty <= 0) {
      cart.splice(cartIdx, 1);
      if (card) {
        card.classList.remove('in-cart');
      }
    } else {
      if (card) {
        card.querySelector('.cart-qty-counter .qty-val').textContent = cart[cartIdx].qty;
      }
    }

    updateCartDisplay();
  };

  // Update Cart View
  function updateCartDisplay() {
    if (!cartList) return;

    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="cart-empty-message">
          <span class="cart-empty-icon">🥤</span>
          <p>Your cart is empty. Add drinks from the menu!</p>
        </div>
      `;
      if (cartSummary) cartSummary.style.display = 'none';
      return;
    }

    let totalQty = 0;
    let subtotalAmount = 0;

    const cartHtml = cart.map((ci, idx) => {
      totalQty += ci.qty;
      const subtotal = ci.price * ci.qty;
      subtotalAmount += subtotal;

      const variantLabel = ci.variant ? `<span class="cart-item-variant">(${ci.variant})</span>` : '';

      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-name">${ci.name} ${variantLabel}</span>
            <span class="cart-item-price">₹${ci.price} each</span>
          </div>
          <div class="cart-item-controls">
            <div class="cart-qty-counter counter-mini">
              <button class="btn-qty-dec" onclick="adjustDrinkQty('${ci.name}', -1, this)">-</button>
              <span class="qty-val">${ci.qty}</span>
              <button class="btn-qty-inc" onclick="adjustDrinkQty('${ci.name}', 1, this)">+</button>
            </div>
            <span class="cart-item-subtotal">₹${subtotal}</span>
          </div>
        </div>
      `;
    }).join('');

    cartList.innerHTML = cartHtml;
    if (cartSummary) cartSummary.style.display = 'block';

    // Calculate dynamic totals based on order mode
    const cartTotalsContainer = document.getElementById('cart-totals-container');
    const rdoDeliveryChecked = document.querySelector('input[name="orderMode"]:checked');
    const orderMode = rdoDeliveryChecked ? rdoDeliveryChecked.value : 'delivery';
    const isDelivery = orderMode === 'delivery';
    const deliveryCharge = 30;
    const finalTotal = isDelivery ? (subtotalAmount + deliveryCharge) : subtotalAmount;

    if (cartTotalsContainer) {
      let totalsHtml = `
        <div class="cart-total-row">
          <span>Total Drinks</span>
          <span id="cart-total-qty">${totalQty}</span>
        </div>
      `;

      if (isDelivery) {
        totalsHtml += `
          <div class="cart-total-row">
            <span>Subtotal</span>
            <span>₹${subtotalAmount}</span>
          </div>
          <div class="cart-total-row delivery-charge-row">
            <span>Delivery Charge</span>
            <span>₹${deliveryCharge}</span>
          </div>
        `;
      }

      totalsHtml += `
        <div class="cart-total-row final">
          <span>Total Amount</span>
          <span id="cart-total-amount">₹${finalTotal}</span>
        </div>
      `;

      // Minimum 2 items warning
      if (isDelivery && totalQty < 2) {
        totalsHtml += `
          <div class="cart-warning-row" style="color: var(--red); font-size: 0.85rem; font-weight: 700; text-align: center; margin-top: 10px; padding: 10px; background: #ffebee; border: 1px solid rgba(198, 18, 27, 0.15); border-radius: 8px;">
            ⚠️ Minimum 2 items required for Home Delivery.
          </div>
        `;
      }

      cartTotalsContainer.innerHTML = totalsHtml;
    }

    // Enable/Disable checkout button based on item count validation
    const checkoutSubmitBtn = document.getElementById('btn-checkout-submit');
    if (checkoutSubmitBtn) {
      if (isDelivery && totalQty < 2) {
        checkoutSubmitBtn.disabled = true;
        checkoutSubmitBtn.style.opacity = '0.5';
        checkoutSubmitBtn.style.cursor = 'not-allowed';
        checkoutSubmitBtn.textContent = '❌ Add More Drinks for Delivery';
      } else {
        checkoutSubmitBtn.disabled = false;
        checkoutSubmitBtn.style.opacity = '1';
        checkoutSubmitBtn.style.cursor = 'pointer';
        checkoutSubmitBtn.textContent = 'Confirm & Order on WhatsApp 💬';
      }
    }
    updateCollapsibleHeight();
  }

  // Submit Instant Order Checkout Form
  if (cartCheckoutForm) {
    cartCheckoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = cartName.value.trim();
      const phone = cartPhone.value.trim();
      const orderMode = document.querySelector('input[name="orderMode"]:checked').value;
      const addressStr = orderMode === 'delivery' ? cartAddress.value.trim() : "Store Pickup";

      if (!name || !phone) {
        alert("Please fill out your Name and Phone number.");
        return;
      }

      // Safe validation fallback
      const totalQtyCount = cart.reduce((sum, ci) => sum + ci.qty, 0);
      if (orderMode === 'delivery' && totalQtyCount < 2) {
        alert("⚠️ Minimum 2 items are required for Home Delivery. Please add more items to your cart.");
        return;
      }

      const checkoutBtn = document.getElementById('btn-checkout-submit');
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing Order...';
      }

      // Calculate totals
      let totalAmount = 0;
      let totalQty = 0;
      const orderItemsList = cart.map(ci => {
        totalQty += ci.qty;
        totalAmount += ci.price * ci.qty;
        return `${ci.qty}x ${ci.name}${ci.variant ? ' (' + ci.variant + ')' : ''}`;
      }).join(', ');

      const isDelivery = orderMode === 'delivery';
      const deliveryCharge = 30;
      const finalTotalAmount = isDelivery ? (totalAmount + deliveryCharge) : totalAmount;

      // Setup payload for silent Sheets post
      const params = new URLSearchParams();
      params.append('name', name);
      params.append('Name', name);
      params.append('phone', phone);
      params.append('Phone', phone);
      params.append('orderType', orderMode);
      params.append('Order Type', isDelivery ? 'Home Delivery' : 'Store Pickup');
      params.append('address', addressStr);
      params.append('Delivery Address', isDelivery ? addressStr : '');
      params.append('items', orderItemsList);
      params.append('Items Name', orderItemsList);
      params.append('total', `₹${finalTotalAmount}`);
      params.append('Total Amount', `₹${finalTotalAmount}`);
      params.append('coordinates', userCoords ? `${userCoords.lat}, ${userCoords.lng}` : 'Manual Address');
      params.append('Order', userCoords ? `GPS: ${userCoords.lat}, ${userCoords.lng}` : 'Manual Address');

      // Routing parameters to direct data to the correct Google Sheet tab
      params.append('sheetName', ORDER_SYSTEM_CONFIG.instantSheetName);
      params.append('sheet', ORDER_SYSTEM_CONFIG.instantSheetName);
      params.append('formType', 'instant');
      params.append('type', 'instant');
      params.append('action', 'instant');

      // WhatsApp link preparation
      let waText = `*NEW ORDER - SHREE RAM COLDDRINKS*\n`;
      waText += `----------------------------------\n`;
      waText += `*Customer Details:*\n`;
      waText += `Name: ${name}\n`;
      waText += `Phone: ${phone}\n`;
      waText += `Order Type: ${isDelivery ? '🛵 Home Delivery' : '🏪 Store Pickup'}\n`;
      if (isDelivery) {
        waText += `Address: ${addressStr}\n`;
      }
      waText += `\n*Order Items:*\n`;
      cart.forEach(ci => {
        waText += `- ${ci.qty}x ${ci.name} ${ci.variant ? '(' + ci.variant + ')' : ''} - ₹${ci.price * ci.qty}\n`;
      });
      if (isDelivery) {
        waText += `\nSubtotal: ₹${totalAmount}\n`;
        waText += `Delivery Charge: ₹${deliveryCharge}\n`;
      }
      waText += `\n*Total Amount:* ₹${finalTotalAmount}\n`;
      waText += `----------------------------------\n`;
      waText += `Please confirm my order. Thank you!`;

      const encodedWaText = encodeURIComponent(waText);
      const waUrl = `https://wa.me/${ORDER_SYSTEM_CONFIG.whatsappNumber}?text=${encodedWaText}`;

      // Silent background request (no page reload) to Apps Script Web App
      const instantUrlWithQuery = `${ORDER_SYSTEM_CONFIG.appsScriptInstantOrderUrl}?sheetName=${encodeURIComponent(ORDER_SYSTEM_CONFIG.instantSheetName)}`;
      fetch(instantUrlWithQuery, {
        method: 'POST',
        body: params,
        mode: 'no-cors'
      })
        .then(() => {
          console.log("Order logged silently to sheet.");
        })
        .catch(err => {
          console.error("Sheets log failed:", err);
        });

      // 2. Open WhatsApp link to confirm
      setTimeout(() => {
        window.open(waUrl, '_blank');

        // Reset form & cart
        cart = [];
        cartCheckoutForm.reset();
        updateCartDisplay();

        // Reset UI accordion states
        document.querySelectorAll('.instant-item-card').forEach(card => card.classList.remove('in-cart'));

        alert("✅ Order placed! We've redirected you to WhatsApp to send the confirmation message.");

        if (checkoutBtn) {
          checkoutBtn.disabled = false;
          checkoutBtn.textContent = 'Confirm & Order on WhatsApp 💬';
        }
      }, 300);
    });
  }

  // Strict Input Controls (Name: max 25 chars, Phone: only digits, max 10 digits)
  const phoneInputsList = [document.getElementById('cart-phone'), document.getElementById('bulk-phone')];
  const nameInputsList = [document.getElementById('cart-name'), document.getElementById('bulk-name')];

  phoneInputsList.forEach(input => {
    if (!input) return;
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9]/g, '');
      if (val.length > 10) {
        val = val.slice(0, 10);
      }
      e.target.value = val;
    });
  });

  nameInputsList.forEach(input => {
    if (!input) return;
    input.addEventListener('input', (e) => {
      if (e.target.value.length > 25) {
        e.target.value = e.target.value.slice(0, 25);
      }
    });
  });

  // Collapsible Order Form Toggle logic
  const btnOrderToggle = document.getElementById('btnOrderToggle');
  const orderCollapsibleWrapper = document.getElementById('orderCollapsibleWrapper');

  window.updateOrderWrapperHeight = () => {
    if (orderCollapsibleWrapper && orderCollapsibleWrapper.classList.contains('open')) {
      orderCollapsibleWrapper.style.maxHeight = orderCollapsibleWrapper.scrollHeight + 'px';
    }
  };

  if (btnOrderToggle && orderCollapsibleWrapper) {
    btnOrderToggle.addEventListener('click', () => {
      const isOpen = orderCollapsibleWrapper.classList.toggle('open');
      btnOrderToggle.classList.toggle('active');

      if (isOpen) {
        btnOrderToggle.querySelector('.btn-order-toggle__text').textContent = 'Close Order Menu';
        btnOrderToggle.querySelector('.btn-order-toggle__arrow').textContent = '▲';
        orderCollapsibleWrapper.style.maxHeight = orderCollapsibleWrapper.scrollHeight + 'px';

        // Scroll smoothly to start of order form
        setTimeout(() => {
          orderCollapsibleWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        btnOrderToggle.querySelector('.btn-order-toggle__text').textContent = 'Click Here to Order Online';
        btnOrderToggle.querySelector('.btn-order-toggle__arrow').textContent = '▼';
        orderCollapsibleWrapper.style.maxHeight = '0px';
      }
    });
  }

  function updateCollapsibleHeight() {
    if (typeof window.updateOrderWrapperHeight === 'function') {
      window.updateOrderWrapperHeight();
    }
  }

  // Collapsible Bulk Order Form Toggle logic
  const btnBulkOrderToggle = document.getElementById('btnBulkOrderToggle');
  const bulkCollapsibleWrapper = document.getElementById('bulkCollapsibleWrapper');

  if (btnBulkOrderToggle && bulkCollapsibleWrapper) {
    btnBulkOrderToggle.addEventListener('click', () => {
      const isOpen = bulkCollapsibleWrapper.classList.toggle('open');
      btnBulkOrderToggle.classList.toggle('active');

      if (isOpen) {
        btnBulkOrderToggle.querySelector('.btn-order-toggle__text').textContent = 'Close Bulk Order Form';
        btnBulkOrderToggle.querySelector('.btn-order-toggle__arrow').textContent = '▲';
        bulkCollapsibleWrapper.style.maxHeight = bulkCollapsibleWrapper.scrollHeight + 'px';

        // Scroll smoothly to start of bulk form
        setTimeout(() => {
          bulkCollapsibleWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        btnBulkOrderToggle.querySelector('.btn-order-toggle__text').textContent = 'Click Here for Bulk Order';
        btnBulkOrderToggle.querySelector('.btn-order-toggle__arrow').textContent = '▼';
        bulkCollapsibleWrapper.style.maxHeight = '0px';
      }
    });
  }

  // Connect Header & Mobile Menu "Order Now" buttons to scroll and trigger GPS tracking
  const headerOrderBtn = document.getElementById('headerOrderBtn');
  const mobileMenuOrderBtn = document.getElementById('mobileMenuOrderBtn');

  function handleOrderBtnClick(e) {
    e.preventDefault();

    // Close mobile menu overlay if open
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }

    // Scroll to the instant order section smoothly
    const targetSection = document.getElementById('instant-order-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Automatically trigger GPS tracking after scroll begins
    const btnUseGps = document.getElementById('btn-use-gps');
    if (btnUseGps) {
      setTimeout(() => {
        btnUseGps.click();
      }, 600);
    }
  }

  if (headerOrderBtn) {
    headerOrderBtn.addEventListener('click', handleOrderBtnClick);
  }
  if (mobileMenuOrderBtn) {
    mobileMenuOrderBtn.addEventListener('click', handleOrderBtnClick);
  }

  // ────────────────────────────────────────────────────────────
  // CUSTOM DATEPICKER INITIALIZATION WITH DYNAMIC CONSTRAINTS
  // ────────────────────────────────────────────────────────────

  // Custom Datepicker Calendar
  const datepickerWrap = document.getElementById('custom-datepicker-wrap');
  const hiddenDateInput = document.getElementById('bulk-date');
  const displayDateInput = document.getElementById('custom-date-display');
  const calendarEl = document.getElementById('datepicker-calendar');
  const calendarDaysGrid = document.getElementById('calendar-days-grid');
  const calendarMonthYear = document.getElementById('calendar-month-year');

  if (datepickerWrap && hiddenDateInput && displayDateInput && calendarEl) {
    let currentDate = new Date();
    let selectedDate = null;

    displayDateInput.addEventListener('click', (e) => {
      e.stopPropagation();
      calendarEl.classList.toggle('open');
      renderCalendar(currentDate);
    });

    const prevBtn = calendarEl.querySelector('.prev-month');
    const nextBtn = calendarEl.querySelector('.next-month');

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate);
    });

    function renderCalendar(date) {
      const year = date.getFullYear();
      const month = date.getMonth();

      // Month names
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      calendarMonthYear.textContent = `${months[month]} ${year}`;

      calendarDaysGrid.innerHTML = '';

      // Get first day of the month
      const firstDayIndex = new Date(year, month, 1).getDay();
      // Get total days in month
      const totalDays = new Date(year, month + 1, 0).getDate();

      // Empty days before the first day of the month
      for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarDaysGrid.appendChild(emptyDiv);
      }

      // Parse minimum date from the hidden input's min attribute
      let minAllowedDate = new Date();
      minAllowedDate.setHours(0, 0, 0, 0);
      if (hiddenDateInput.min) {
        const parts = hiddenDateInput.min.split('-');
        if (parts.length === 3) {
          minAllowedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          minAllowedDate.setHours(0, 0, 0, 0);
        }
      }

      // Generate days
      for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        const thisDate = new Date(year, month, day);
        thisDate.setHours(0, 0, 0, 0);

        // Disable dates earlier than the calculated minimum date
        if (thisDate < minAllowedDate) {
          dayDiv.classList.add('disabled');
        } else {
          dayDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedDate = thisDate;

            // Format hidden input value as YYYY-MM-DD
            const formattedYear = thisDate.getFullYear();
            const formattedMonth = String(thisDate.getMonth() + 1).padStart(2, '0');
            const formattedDay = String(thisDate.getDate()).padStart(2, '0');
            hiddenDateInput.value = `${formattedYear}-${formattedMonth}-${formattedDay}`;

            // Format display input value as DD-MM-YYYY
            displayDateInput.value = `${formattedDay}-${formattedMonth}-${formattedYear}`;
            displayDateInput.classList.add('has-value');

            calendarEl.classList.remove('open');
            hiddenDateInput.dispatchEvent(new Event('change'));
          });
        }

        // Highlight selected day
        if (selectedDate && thisDate.getTime() === selectedDate.getTime()) {
          dayDiv.classList.add('selected');
        }

        calendarDaysGrid.appendChild(dayDiv);
      }
    }
  }

  // Close calendar on click outside
  document.addEventListener('click', () => {
    if (calendarEl) calendarEl.classList.remove('open');
  });

  // Load configuration and delivery status on start
  checkDeliveryToggle();
});