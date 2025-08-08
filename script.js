// Estado Global
let currentServiceSlide = 0;
let currentPortfolioIndex = 0;
let currentCertificationIndex = 0;
let isSubmitting = false;

// Dados do Portfólio
const portfolioItems = [
  { title: "Honda Civic", beforeImage: "/img/portfolio-civic-antes.png", afterImage: "/img/portfolio-civic-depois.png" },
  { title: "Volkswagen Golf", beforeImage: "/img/portfolio-golf-antes.png", afterImage: "/img/portfolio-golf-depois.png" },
  { title: "Toyota Corolla", beforeImage: "/img/portfolio-corolla-antes.png", afterImage: "/img/portfolio-corolla-depois.png" },
  { title: "Ford Focus", beforeImage: "/img/portfolio-focus-antes.png", afterImage: "/img/portfolio-focus-depois.png" }
];

// Dados de Certificações
const certifications = [
  { name: "Porto Seguro", logo: "/img/logo-porto-seguro.png" },
  { name: "Bradesco Seguros", logo: "/img/logo-bradesco-seguros.png" },
  { name: "Allianz Seguros", logo: "/img/logo-allianz.png" },
  { name: "SulAmérica", logo: "/img/logo-sulamerica.png" },
  { name: "Mapfre", logo: "/img/logo-mapfre.png" },
  { name: "Azul Seguros", logo: "/img/logo-azul-seguros.png" },
  { name: "Liberty Seguros", logo: "/img/logo-liberty.png" },
  { name: "HDI Seguros", logo: "/img/logo-hdi.png" }
];

// Sistema de Cores
const colors = {
  red:   { primary: "#EA4335", hover: "#C53030", light: "rgba(234, 67, 53, 0.1)", shadow: "rgba(234, 67, 53, 0.3)" },
  blue:  { primary: "#4285F4", hover: "#1a73e8", light: "rgba(66, 133, 244, 0.1)", shadow: "rgba(66, 133, 244, 0.3)" },
  yellow:{ primary: "#FBBC05", hover: "#ea8600", light: "rgba(251, 188, 5, 0.1)", shadow: "rgba(251, 188, 5, 0.3)" },
  green: { primary: "#34A853", hover: "#137333", light: "rgba(52, 168, 83, 0.1)", shadow: "rgba(52, 168, 83, 0.3)" },
};
const colorNames = { red: "Vermelho", blue: "Azul", yellow: "Amarelo", green: "Verde" };

/* Utils DOM seguros (evita innerHTML para prevenir problemas) [NO_DANGEROUS_HTML] */
function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") e.textContent = String(v);
    else if (k === "html") e.innerText = String(v); // evita inserir HTML cru
    else if (k in e) {
      try { e[k] = v; } catch {}
    } else {
      e.setAttribute(k, v);
    }
  }
  return e;
}

/* Toast */
function showToast(title, description, variant = "info", duration = 5000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toastId = `toast-${Date.now()}`;
  const toast = el("div", `toast ${variant}`);
  toast.id = toastId;

  const iconMap = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };

  const icon = el("i", iconMap[variant] || iconMap.info, { "aria-hidden": "true" });
  const content = el("div", "toast-content");
  const titleEl = el("div", "toast-title", { text: title });
  content.appendChild(titleEl);
  if (description) {
    const descEl = el("div", "toast-description", { text: description });
    content.appendChild(descEl);
  }
  const closeBtn = el("button", "toast-close", { "aria-label": "Fechar" });
  closeBtn.appendChild(el("i", "fas fa-times", { "aria-hidden": "true" }));
  closeBtn.addEventListener("click", () => removeToast(toastId));

  toast.appendChild(icon);
  toast.appendChild(content);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));
  if (duration > 0) {
    setTimeout(() => removeToast(toastId), duration);
  }
}
function removeToast(id) {
  const t = document.getElementById(id);
  if (!t) return;
  t.classList.remove("show");
  setTimeout(() => t.remove(), 300);
}

/* Scroll Reveal */
function initScrollReveal() {
  const items = document.querySelectorAll(".scroll-reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add("revealed");
        }, delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  items.forEach((el) => observer.observe(el));
}

/* Navbar */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    let current = "";
    document.querySelectorAll("section[id]").forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) current = section.getAttribute("id") || "";
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${current}`) link.classList.add("active");
    });
  }, { passive: true });

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const isActive = hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", String(isActive));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      navMenu?.classList.remove("active");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetSel = anchor.getAttribute("href");
      if (!targetSel) return;
      const target = document.querySelector(targetSel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* Slider de Serviços */
function initServicesSlider() {
  const slides = document.querySelectorAll(".slide");
  const serviceItems = document.querySelectorAll(".service-item");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const sliderNav = document.querySelector(".slider-nav");
  if (!slides.length || !serviceItems.length) return;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove("active"));
    serviceItems.forEach((i) => {
      i.classList.remove("active");
      i.setAttribute("aria-selected", "false");
    });

    const slide = slides[index];
    const item = serviceItems[index];
    if (slide) slide.classList.add("active");
    if (item) {
      item.classList.add("active");
      item.setAttribute("aria-selected", "true");
    }
    currentServiceSlide = index;

    if (sliderNav) {
      sliderNav.setAttribute("style", "opacity:1;visibility:visible;z-index:10;");
    }
  }

  function nextSlide() {
    currentServiceSlide = (currentServiceSlide + 1) % slides.length;
    showSlide(currentServiceSlide);
  }
  function prevSlide() {
    currentServiceSlide = (currentServiceSlide - 1 + slides.length) % slides.length;
    showSlide(currentServiceSlide);
  }

  nextBtn?.addEventListener("click", nextSlide);
  prevBtn?.addEventListener("click", prevSlide);

  serviceItems.forEach((item, index) => {
    item.addEventListener("click", () => showSlide(index));
  });

  // Preload imagens e garantir visibilidade inicial
  slides.forEach((slide, index) => {
    const img = slide.querySelector("img");
    if (!img) return;
    if (index === 0) {
      img.style.opacity = "1";
      img.style.display = "block";
    }
    const preloadImg = new Image();
    preloadImg.onload = () => {
      img.style.opacity = "1";
    };
    preloadImg.onerror = () => {
      img.src = `/placeholder.svg?height=400&width=600&query=servico-${index + 1}`;
    };
    preloadImg.src = img.src;
  });

  setTimeout(() => {
    if (sliderNav) {
      sliderNav.setAttribute("style", "opacity:1;visibility:visible;display:flex;");
    }
    [prevBtn, nextBtn].forEach((btn) => {
      if (btn) btn.setAttribute("style", "opacity:1;visibility:visible;display:flex;");
    });
  }, 100);

  let autoPlay = setInterval(nextSlide, 5000);
  sliderNav?.addEventListener("mouseenter", () => clearInterval(autoPlay));
  sliderNav?.addEventListener("mouseleave", () => (autoPlay = setInterval(nextSlide, 5000)));

  showSlide(0);
}

/* Portfólio */
function initPortfolioSlider() {
  const grid = document.getElementById("portfolio-grid");
  const dots = document.getElementById("portfolio-dots");
  const prevBtn = document.querySelector(".prev-portfolio");
  const nextBtn = document.querySelector(".next-portfolio");
  if (!grid || !dots) return;

  const allCards = portfolioItems.flatMap((item) => ([
    { type: "before", title: item.title, image: item.beforeImage, label: "Antes" },
    { type: "after", title: item.title, image: item.afterImage, label: "Depois" },
  ]));

  function renderPortfolio() {
    grid.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const visible = allCards.slice(currentPortfolioIndex, currentPortfolioIndex + 2);

    visible.forEach((card) => {
      const cardEl = el("div", "portfolio-card");
      const imgWrap = el("div", "portfolio-image");
      const img = el("img", "", {
        src: card.image,
        alt: `${card.title} - ${card.label}`,
        loading: "lazy",
        decoding: "async",
      });
      img.onerror = () => {
        img.src = "/antes-depois.png";
      };

      const label = el("div", `portfolio-label ${card.type}`, { text: card.label });
      imgWrap.appendChild(img);
      imgWrap.appendChild(label);

      const content = el("div", "portfolio-content");
      content.appendChild(el("h4", "", { text: card.title }));
      content.appendChild(el("p", "", { text: card.type === "before" ? "Estado inicial" : "Resultado final" }));

      cardEl.appendChild(imgWrap);
      cardEl.appendChild(content);

      fragment.appendChild(cardEl);
    });

    grid.appendChild(fragment);
  }

  function renderDots() {
    dots.innerHTML = "";
    const totalSlides = Math.ceil(allCards.length / 2);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < totalSlides; i++) {
      const dot = el("div", "portfolio-dot" + (Math.floor(currentPortfolioIndex / 2) === i ? " active" : ""));
      dot.dataset.index = String(i * 2);
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
      dot.addEventListener("click", () => {
        currentPortfolioIndex = parseInt(dot.dataset.index || "0", 10);
        renderPortfolio(); renderDots();
      });
      frag.appendChild(dot);
    }
    dots.appendChild(frag);
  }

  function nextPortfolio() {
    currentPortfolioIndex = currentPortfolioIndex + 2 >= allCards.length ? 0 : currentPortfolioIndex + 2;
    renderPortfolio(); renderDots();
  }
  function prevPortfolio() {
    currentPortfolioIndex = currentPortfolioIndex - 2 < 0 ? allCards.length - 2 : currentPortfolioIndex - 2;
    renderPortfolio(); renderDots();
  }

  nextBtn?.addEventListener("click", nextPortfolio);
  prevBtn?.addEventListener("click", prevPortfolio);

  renderPortfolio();
  renderDots();
}

/* Certificações */
function initCertificationsCarousel() {
  const carousel = document.getElementById("certifications-carousel");
  const indicators = document.getElementById("certifications-indicators");
  if (!carousel || !indicators) return;

  function renderCertifications() {
    carousel.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 4; i++) {
      const idx = (currentCertificationIndex + i) % certifications.length;
      const cert = certifications[idx];
      const card = el("div", "certification-card", { style: `animation-delay: ${i * 0.1}s` });
      const img = el("img", "", { alt: `Logo ${cert.name}`, loading: "lazy", decoding: "async" });
      img.src = cert.logo;
      img.onerror = () => {
        img.src = "/insurance-logo.png";
      };
      card.appendChild(img);
      frag.appendChild(card);
    }
    carousel.appendChild(frag);
  }

  function renderIndicators() {
    indicators.innerHTML = "";
    const frag = document.createDocumentFragment();
    certifications.forEach((_, index) => {
      const ind = el("div", "cert-indicator" + (index === currentCertificationIndex ? " active" : ""));
      frag.appendChild(ind);
    });
    indicators.appendChild(frag);
  }

  function nextCertification() {
    currentCertificationIndex = (currentCertificationIndex + 1) % certifications.length;
    renderCertifications();
    renderIndicators();
  }

  renderCertifications();
  renderIndicators();
  setInterval(nextCertification, 3000);
}

/* FAQ */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      items.forEach((it) => it.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
}

/* Formulários */
function initForms() {
  const forms = document.querySelectorAll(".contact-form");
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      const button = form.querySelector(".btn-primary");
      const btnText = button?.querySelector(".btn-text");
      const loadingSpinner = button?.querySelector(".loading-spinner");

      isSubmitting = true;
      button?.classList.add("loading");
      if (button) button.disabled = true;
      if (loadingSpinner) loadingSpinner.style.display = "flex";
      if (btnText) btnText.style.display = "none";

      try {
        // Simulação de envio
        await new Promise((r) => setTimeout(r, 1200));
        form.reset();
        showToast("Sucesso!", form.id === "hero-form" ? "Orçamento solicitado com sucesso! Entraremos em contato em breve." : "Mensagem enviada com sucesso! Entraremos em contato em breve.", "success", 3500);
      } catch {
        showToast("Erro!", "Ocorreu um erro ao enviar. Tente novamente.", "error");
      } finally {
        isSubmitting = false;
        button?.classList.remove("loading");
        if (button) button.disabled = false;
        if (loadingSpinner) loadingSpinner.style.display = "none";
        if (btnText) btnText.style.display = "inline";
      }
    });
  });
}

/* Seletor de Cor */
function initColorSelector() {
  const colorSelector = document.getElementById("color-selector");
  const colorToggle = document.getElementById("color-toggle");
  const colorOptions = document.querySelectorAll(".color-option");
  if (!colorSelector || !colorToggle || !colorOptions.length) return;

  let currentColor = localStorage.getItem("selectedColor") || "red";
  applyColor(currentColor);
  updateActiveColor(currentColor);

  function applyColor(color) {
    const colorData = colors[color];
    if (!colorData) return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", colorData.primary);
    root.style.setProperty("--primary-hover", colorData.hover);
    root.style.setProperty("--primary-light", colorData.light);
    root.style.setProperty("--primary-shadow", colorData.shadow);

    colorToggle.style.background = colorData.primary;
    colorToggle.style.boxShadow = `0 4px 15px ${colorData.shadow}`;
  }

  function updateActiveColor(color) {
    colorOptions.forEach((option) => option.classList.remove("active"));
    const active = document.querySelector(`[data-color="${color}"]`);
    active?.classList.add("active");
  }

  colorToggle.addEventListener("click", () => {
    colorSelector.classList.toggle("expanded");
  });

  colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const color = option.dataset.color || "red";
      currentColor = color;
      localStorage.setItem("selectedColor", color);
      applyColor(color);
      updateActiveColor(color);
      colorSelector.classList.remove("expanded");
      showToast("Cor Alterada!", `Tema alterado para ${colorNames[color]}!`, "success", 2500);
    });
    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        option.click();
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!colorSelector.contains(e.target)) colorSelector.classList.remove("expanded");
  });
}

/* WhatsApp */
function initWhatsApp() {
  const whatsappButton = document.getElementById("whatsapp-button");
  if (!whatsappButton) return;

  whatsappButton.addEventListener("click", () => {
    const phone = "5511999999999"; // TODO: Atualize com o número real
    const message = "Olá! Gostaria de solicitar um orçamento para meu veículo.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

/* Inicialização */
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initNavbar();
  initServicesSlider();
  initPortfolioSlider();
  initCertificationsCarousel();
  initFAQ();
  initForms();
  initColorSelector();
  initWhatsApp();

  // Removido: toast/pop-up automático "Problema da imagem corrigido"
  // Mantemos o console limpo para produção.
});

// Resize handler (mantido para futuras adaptações)
window.addEventListener("resize", () => {
  // Placeholder para lógicas específicas de mobile se necessário
}, { passive: true });
