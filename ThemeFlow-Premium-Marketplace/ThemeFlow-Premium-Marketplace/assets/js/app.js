(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Mobile navigation
  const menuToggle = $(".menu-toggle");
  const mainNav = $(".main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      mainNav.classList.toggle("nav-open", open);
      document.body.classList.toggle("nav-is-open", open);
    });
    $$(".main-nav a").forEach(link => link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("nav-open");
      document.body.classList.remove("nav-is-open");
    }));
  }

  // Reveal-on-scroll, with a graceful no-IntersectionObserver fallback
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealEls.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i % 4, 3) * 75}ms`);
      revealObserver.observe(el);
    });
  } else revealEls.forEach(el => el.classList.add("is-visible"));

  // Soft parallax for hero visuals; disabled for reduced motion.
  const parallaxEls = $$("[data-parallax]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (parallaxEls.length && !reducedMotion) {
    let ticking = false;
    const updateParallax = () => {
      const y = window.scrollY || 0;
      parallaxEls.forEach(el => {
        const speed = Number(el.dataset.parallax || 0.1);
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          el.style.transform = `translate3d(0, ${Math.round(y * speed * -0.22)}px, 0)`;
        }
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { window.requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
  }

  // Theme catalog: text search, category chips, and price sorting.
  const grid = $("#theme-grid");
  if (grid) {
    const cards = $$(".theme-card", grid);
    const search = $("#theme-search");
    const chips = $$(".filter-chip");
    const sort = $("#theme-sort");
    const count = $("#result-count");
    const empty = $("#empty-state");
    let activeFilter = "all";
    const applyFilters = () => {
      const query = (search?.value || "").trim().toLowerCase();
      let visible = cards.filter(card => {
        const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
        const haystack = `${card.dataset.name || ""} ${card.dataset.category || ""} ${card.textContent}`.toLowerCase();
        const matchesSearch = !query || haystack.includes(query);
        card.hidden = !(matchesCategory && matchesSearch);
        return !card.hidden;
      });
      const mode = sort?.value || "featured";
      visible.sort((a, b) => {
        if (mode === "low") return Number(a.dataset.price) - Number(b.dataset.price);
        if (mode === "high") return Number(b.dataset.price) - Number(a.dataset.price);
        return cards.indexOf(a) - cards.indexOf(b);
      }).forEach(card => grid.appendChild(card));
      if (count) count.textContent = `Showing ${visible.length} ${visible.length === 1 ? "theme" : "themes"}`;
      if (empty) empty.hidden = visible.length !== 0;
    };
    chips.forEach(chip => chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.toggle("active", c === chip));
      activeFilter = chip.dataset.filter || "all";
      applyFilters();
    }));
    search?.addEventListener("input", applyFilters);
    sort?.addEventListener("change", applyFilters);
    $("#clear-filters")?.addEventListener("click", () => {
      if (search) search.value = "";
      activeFilter = "all";
      if (sort) sort.value = "featured";
      chips.forEach(c => c.classList.toggle("active", c.dataset.filter === "all"));
      applyFilters();
    });
    applyFilters();
  }

  // Product detail page: URL query maps to a known sample theme.
  const productTitle = $("#product-title");
  if (productTitle) {
    const catalog = {
      north: { name: "North Studio", price: "$49", category: "Portfolio", platform: "Framer", creator: "North Studio Co.", subtitle: "A bold portfolio for people shaping culture.", url: "northstudio.design", className: "theme-north", overview: "North Studio pairs expressive type with confident layouts and a considered editorial rhythm. It's a strong starting point for independent studios, designers, photographers, and creative teams." },
      forma: { name: "Forma Goods", price: "$59", category: "E-commerce", platform: "Shopify", creator: "Forma Works", subtitle: "An editorial storefront for considered goods.", url: "formagoods.com", className: "theme-forma", overview: "Forma Goods is an editorial-inspired storefront concept with generous product space, calm typography, and a warm, tactile feel for lifestyle and home brands." },
      orbit: { name: "Orbit SaaS", price: "$39", category: "SaaS", platform: "React", creator: "Orbit Foundry", subtitle: "A calm workspace for ambitious software.", url: "orbitapp.io", className: "theme-orbit", overview: "Orbit SaaS gives software teams a confident launch foundation, combining a focused message, clear feature sections, and a modern product-led aesthetic." },
      mono: { name: "Mono Agency", price: "$45", category: "Agency", platform: "Webflow", creator: "Mono Studio", subtitle: "A confident home for a creative agency.", url: "mono.agency", className: "theme-mono", overview: "Mono Agency uses a bold editorial grid and high contrast to help independent agencies present their thinking and selected work with clarity." },
      solace: { name: "Solace Portfolio", price: "$29", category: "Portfolio", platform: "Framer", creator: "Solace Design", subtitle: "A quiet canvas for thoughtful creative work.", url: "solace.work", className: "theme-solace", overview: "Solace is an understated portfolio concept for designers and image-makers who want the work to lead. Its layout is calm, minimal, and easy to adapt." },
      signal: { name: "Signal Launch", price: "$35", category: "SaaS", platform: "HTML", creator: "Signal Studio", subtitle: "A sharp launch page with a clear point of view.", url: "signal.launch", className: "theme-signal", overview: "Signal Launch is a focused landing page concept for new digital products, with a direct message, conversion-friendly hierarchy, and expressive gradients." }
    };
    const params = new URLSearchParams(window.location.search);
    const key = (params.get("theme") || "north").toLowerCase();
    const theme = catalog[key] || catalog.north;
    productTitle.textContent = theme.name;
    $("#crumb-name") && ($("#crumb-name").textContent = theme.name);
    $("#product-subtitle") && ($("#product-subtitle").textContent = theme.subtitle);
    $("#product-price") && ($("#product-price").textContent = theme.price);
    $("#creator-name") && ($("#creator-name").textContent = theme.creator);
    $("#product-category") && ($("#product-category").textContent = theme.category);
    $("#preview-url") && ($("#preview-url").textContent = theme.url);
    $("#overview-copy") && ($("#overview-copy").textContent = theme.overview);
    $$(".product-platform").forEach(el => el.textContent = theme.platform);
    const preview = $(".product-preview-image");
    if (preview) {
      preview.className = `theme-image ${theme.className} product-preview-image`;
      const inner = preview.querySelector(".north-preview, .forma-preview, .orbit-preview, .mono-preview, .solace-preview, .signal-preview");
      if (inner) inner.remove();
      const previews = {
        north: `<div class="north-preview"><small>CREATIVE STUDIO / 2026</small><strong>Make<br>some <i>noise.</i></strong><div class="north-photo"></div><span class="preview-bottom">SELECTED WORK &nbsp; ↓</span></div>`,
        forma: `<div class="forma-preview"><div class="forma-nav">FORMA GOODS <span>SHOP&nbsp;&nbsp; ABOUT&nbsp;&nbsp; BAG (0)</span></div><small>OBJECTS FOR EVERYDAY LIVING</small><strong>Live with<br><em>intention.</em></strong><div class="forma-products"><i></i><i></i><i></i></div></div>`,
        orbit: `<div class="orbit-preview"><div class="orbit-nav"><b>orbit<span>✳</span></b><span>Platform&nbsp;&nbsp; Solutions&nbsp;&nbsp; Pricing</span><i>Get started ↗</i></div><div class="orbit-copy"><small>YOUR WORK, IN ORBIT</small><strong>Work smarter.<br><span>Move faster.</span></strong><p>One calm workspace for your team's biggest ideas.</p><b class="orbit-cta">Start free →</b></div><div class="orbit-ui"><div></div><div></div><div></div><div></div><span>✦</span></div></div>`,
        mono: `<div class="mono-preview"><div class="mono-nav">MONO® <span>MENU +</span></div><small>INDEPENDENT BRAND PARTNERS</small><strong>Make<br>it <i>matter.</i></strong><div class="mono-shape"></div><span class="mono-caption">STRATEGY / DESIGN / DIGITAL</span></div>`,
        solace: `<div class="solace-preview"><div class="solace-nav">solace<span>INDEX&nbsp;&nbsp; CONTACT</span></div><small>DESIGNER & IMAGE MAKER</small><strong>Quietly<br>curious.</strong><div class="solace-art"><i></i><i></i></div><span class="solace-caption">SELECTED THOUGHTS, 2022—26</span></div>`,
        signal: `<div class="signal-preview"><div class="signal-nav">signal<span>PLATFORM&nbsp;&nbsp; PRICING</span></div><div class="signal-content"><small>LESS NOISE. MORE SIGNAL.</small><strong>Your best work<br>starts <i>here.</i></strong><p>All your projects. One clear direction.</p><b>Get early access ↗</b></div><div class="signal-glow"></div></div>`
      };
      preview.insertAdjacentHTML("beforeend", previews[key] || previews.north);
    }
    const wishlist = $("#wishlist-button");
    wishlist?.addEventListener("click", () => {
      const saved = wishlist.getAttribute("aria-pressed") !== "true";
      wishlist.setAttribute("aria-pressed", String(saved));
      wishlist.textContent = saved ? "♥" : "♡";
      wishlist.classList.toggle("saved", saved);
      showToast(saved ? "Saved to demo wishlist" : "Removed from demo wishlist");
    });
    $$(".product-tab").forEach(tab => tab.addEventListener("click", () => {
      $$(".product-tab").forEach(t => t.classList.toggle("active", t === tab));
      $$(".tab-panel").forEach(panel => panel.hidden = panel.id !== `tab-${tab.dataset.tab}`);
    }));
    $("#demo-buy")?.addEventListener("click", () => showToast("Demo only — checkout is not connected."));
    $("#preview-mode")?.addEventListener("click", () => {
      $("#product-preview")?.classList.toggle("preview-expanded");
      const expanded = $("#product-preview")?.classList.contains("preview-expanded");
      $("#preview-mode").textContent = expanded ? "Collapse preview ↑" : "Expand preview ↗";
    });
    $("#preview-scroll")?.addEventListener("click", () => $("#product-preview")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" }));
  }

  // Scripted demo support chat. Not a real AI integration.
  const chatPanel = $("#chat-panel");
  const chatMessages = $("#chat-messages");
  const chatInput = $("#chat-input");
  const openChat = () => {
    if (!chatPanel) return;
    chatPanel.classList.add("chat-open");
    chatPanel.setAttribute("aria-hidden", "false");
    setTimeout(() => chatInput?.focus(), 100);
  };
  const closeChat = () => {
    chatPanel?.classList.remove("chat-open");
    chatPanel?.setAttribute("aria-hidden", "true");
  };
  $$("[data-open-chat]").forEach(btn => btn.addEventListener("click", event => {
    event.preventDefault();
    openChat();
  }));
  $(".chat-close")?.addEventListener("click", closeChat);
  const addBubble = (text, who = "user") => {
    if (!chatMessages) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${who}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
  const replyFor = message => {
    const m = message.toLowerCase();
    if (m.includes("price") || m.includes("cost") || m.includes("payment") || m.includes("buy") || m.includes("checkout")) return "Prices shown are sample UI data. Checkout and payment processing are not connected yet. A real marketplace needs a secure backend and payment provider.";
    if (m.includes("sell") || m.includes("listing") || m.includes("creator") || m.includes("payout")) return "You can explore the Creator Studio dashboard and sample listing form. Publishing, seller accounts, and payouts are demo-only and need a backend integration.";
    if (m.includes("ai") || m.includes("chat") || m.includes("assistant")) return "This chat uses scripted replies in your browser, not a live AI model. To add AI later, connect a secure server endpoint and keep the API key off the public website.";
    if (m.includes("github") || m.includes("domain") || m.includes("host") || m.includes("publish")) return "ThemeFlow is static-hosting ready. Upload the project files to GitHub, enable Pages in Settings → Pages, and use your free username.github.io address. A custom domain is optional.";
    if (m.includes("theme") || m.includes("portfolio") || m.includes("shop") || m.includes("saas")) return "Try the Themes page to search and filter the sample catalog. North Studio suits portfolios, Forma Goods is an e-commerce concept, and Orbit is a SaaS landing page.";
    if (m.includes("license") || m.includes("commercial") || m.includes("download")) return "License and download flows are not active in this prototype. Before real sales, define clear usage rights and implement secure, authenticated file delivery.";
    return "Thanks for the question! This is a scripted demo assistant, so I can help with themes, sample pricing, seller UI, and GitHub Pages basics. Real support and AI aren't connected yet.";
  };
  const sendMessage = message => {
    const clean = (message || "").trim();
    if (!clean) return;
    $$(".quick-replies", chatMessages || document).forEach(el => el.remove());
    addBubble(clean, "user");
    if (chatInput) chatInput.value = "";
    window.setTimeout(() => addBubble(replyFor(clean), "bot"), reducedMotion ? 0 : 450);
  };
  $("#chat-form")?.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(chatInput?.value || "");
  });
  $$(".quick-replies button").forEach(btn => btn.addEventListener("click", () => sendMessage(btn.dataset.reply || btn.textContent)));

  // Support FAQ accordion and article search.
  $$(".accordion-item > button").forEach(button => button.addEventListener("click", () => {
    const item = button.closest(".accordion-item");
    const body = $(".accordion-body", item);
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    const symbol = $("i", button);
    if (symbol) symbol.textContent = open ? "−" : "＋";
    if (body) body.hidden = !open;
  }));
  const faqSearch = $("#faq-search");
  faqSearch?.addEventListener("input", () => {
    const query = faqSearch.value.trim().toLowerCase();
    $$(".accordion-item").forEach(item => {
      item.hidden = !!query && !item.textContent.toLowerCase().includes(query);
      if (query && !item.hidden) {
        const body = $(".accordion-body", item);
        const button = $("button", item);
        if (body) body.hidden = false;
        if (button) button.setAttribute("aria-expanded", "true");
        const symbol = $("i", button);
        if (symbol) symbol.textContent = "−";
      }
    });
    $$(".support-section").forEach(section => {
      section.hidden = !!query && !$$(".accordion-item:not([hidden])", section).length;
    });
  });

  // Creator studio sample form and dashboard actions.
  const modal = $("#listing-modal");
  const openModal = () => {
    if (!modal) return showToast("Demo action — the seller backend isn't connected.");
    modal.hidden = false;
    document.body.classList.add("modal-open");
    $("input", modal)?.focus();
  };
  const closeModal = () => {
    if (modal) modal.hidden = true;
    document.body.classList.remove("modal-open");
  };
  $("#new-listing")?.addEventListener("click", openModal);
  $("#new-listing-bottom")?.addEventListener("click", openModal);
  $("#modal-close")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  $("#listing-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    closeModal();
    showToast(`Preview ready: ${data.get("themeName")} · $${data.get("price")} (not published)`);
    event.currentTarget.reset();
  });
  $("#manage-listings")?.addEventListener("click", () => showToast("Sample dashboard — listing management is not connected."));
  $$(".row-menu").forEach(btn => btn.addEventListener("click", () => showToast("Demo listing menu — no changes will be saved.")));

  // Small, accessible toast feedback for demo interactions.
  let toastTimer;
  function showToast(message) {
    let toast = $("#site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "site-toast";
      toast.className = "site-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("toast-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("toast-visible"), 3200);
  }
})();