// Global variables
let currentServiceSlide = 0;
let currentPortfolioIndex = 0;
let currentCertificationIndex = 0;
let isSubmitting = false;

// Portfolio data
const portfolioItems = [
  {
    title: 'Honda Civic',
    beforeImage: '/img/portfolio-civic-antes.png',
    afterImage: '/img/portfolio-civic-depois.png'
  },
  {
    title: 'Volkswagen Golf',
    beforeImage: '/img/portfolio-golf-antes.png',
    afterImage: '/img/portfolio-golf-depois.png'
  },
  {
    title: 'Toyota Corolla',
    beforeImage: '/img/portfolio-corolla-antes.png',
    afterImage: '/img/portfolio-corolla-depois.png'
  },
  {
    title: 'Ford Focus',
    beforeImage: '/img/portfolio-focus-antes.png',
    afterImage: '/img/portfolio-focus-depois.png'
  }
];

// Certifications data
const certifications = [
  { name: 'Porto Seguro', logo: '/img/logo-porto-seguro.png' },
  { name: 'Bradesco Seguros', logo: '/img/logo-bradesco-seguros.png' },
  { name: 'Allianz Seguros', logo: '/img/logo-allianz.png' },
  { name: 'SulAmérica', logo: '/img/logo-sulamerica.png' },
  { name: 'Mapfre', logo: '/img/logo-mapfre.png' },
  { name: 'Azul Seguros', logo: '/img/logo-azul-seguros.png' },
  { name: 'Liberty Seguros', logo: '/img/logo-liberty.png' },
  { name: 'HDI Seguros', logo: '/img/logo-hdi.png' }
];

// Color system
const colors = {
  red: { primary: '#EA4335', hover: '#C53030', light: 'rgba(234, 67, 53, 0.1)', shadow: 'rgba(234, 67, 53, 0.3)' },
  blue: { primary: '#4285F4', hover: '#1a73e8', light: 'rgba(66, 133, 244, 0.1)', shadow: 'rgba(66, 133, 244, 0.3)' },
  yellow: { primary: '#FBBC05', hover: '#ea8600', light: 'rgba(251, 188, 5, 0.1)', shadow: 'rgba(251, 188, 5, 0.3)' },
  green: { primary: '#34A853', hover: '#137333', light: 'rgba(52, 168, 83, 0.1)', shadow: 'rgba(52, 168, 83, 0.3)' }
};

const colorNames = {
  red: 'Vermelho',
  blue: 'Azul',
  yellow: 'Amarelo',
  green: 'Verde'
};

// Toast System
function showToast(title, description, variant = 'info', duration = 5000) {
  const toastContainer = document.getElementById('toast-container');
  const toastId = 'toast-' + Date.now();
  
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${variant}`;
  toast.id = toastId;
  toast.innerHTML = `
    <i class="${icons[variant]}"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${description ? `<div class="toast-description">${description}</div>` : ''}
    </div>
    <button class="toast-close" onclick="removeToast('${toastId}')">
      <i class="fas fa-times"></i>
    </button>
  `;

  toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto remove
  setTimeout(() => removeToast(toastId), duration);
}

function removeToast(toastId) {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }
}

// Scroll Reveal Animation
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

// Navbar functionality
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Services slider - CORRIGIDO
function initServicesSlider() {
  const slides = document.querySelectorAll('.slide');
  const serviceItems = document.querySelectorAll('.service-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const sliderNav = document.querySelector('.slider-nav');

  // Garantir que os botões estejam sempre visíveis
  if (sliderNav) {
    sliderNav.style.opacity = '1';
    sliderNav.style.visibility = 'visible';
    sliderNav.style.zIndex = '10';
  }

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    serviceItems.forEach(item => item.classList.remove('active'));

    slides[index].classList.add('active');
    serviceItems[index].classList.add('active');
    currentServiceSlide = index;

    // Garantir que os botões permaneçam visíveis após a troca
    setTimeout(() => {
      if (sliderNav) {
        sliderNav.style.opacity = '1';
        sliderNav.style.visibility = 'visible';
      }
    }, 50);
  }

  function nextSlide() {
    currentServiceSlide = (currentServiceSlide + 1) % slides.length;
    showSlide(currentServiceSlide);
  }

  function prevSlide() {
    currentServiceSlide = (currentServiceSlide - 1 + slides.length) % slides.length;
    showSlide(currentServiceSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
    // Garantir visibilidade do botão
    nextBtn.style.opacity = '1';
    nextBtn.style.visibility = 'visible';
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
    // Garantir visibilidade do botão
    prevBtn.style.opacity = '1';
    prevBtn.style.visibility = 'visible';
  }

  // Service item click handlers
  serviceItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Auto-play slider (pausar ao hover nos botões)
  let autoPlayInterval = setInterval(nextSlide, 5000);
  
  // Pausar auto-play quando hover nos botões
  if (sliderNav) {
    sliderNav.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    
    sliderNav.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    });
  }

  // CORREÇÃO: Melhor tratamento de carregamento de imagens
  slides.forEach((slide, index) => {
    const img = slide.querySelector('img');
    
    if (img) {
      // Força o carregamento imediato da primeira imagem
      if (index === 0) {
        img.style.opacity = '1';
        img.style.display = 'block';
      }
      
      // Preload todas as imagens
      const preloadImg = new Image();
      preloadImg.onload = () => {
        img.style.opacity = '1';
        console.log(`Imagem ${index + 1} carregada com sucesso`);
      };
      preloadImg.onerror = () => {
        console.error(`Erro ao carregar imagem ${index + 1}: ${img.src}`);
        // Fallback para imagem placeholder
        img.src = '/placeholder.svg?height=400&width=600&text=Serviço+' + (index + 1);
      };
      preloadImg.src = img.src;
    }
  });

  // Garantir que a primeira imagem e botões sejam visíveis
  setTimeout(() => {
    const firstSlide = slides[0];
    const firstImg = firstSlide?.querySelector('img');
    if (firstImg) {
      firstImg.style.opacity = '1';
      firstImg.style.display = 'block';
    }
    
    // Forçar visibilidade dos botões na primeira imagem
    if (sliderNav) {
      sliderNav.style.opacity = '1';
      sliderNav.style.visibility = 'visible';
      sliderNav.style.display = 'flex';
    }
    
    // Garantir que os botões individuais estejam visíveis
    [prevBtn, nextBtn].forEach(btn => {
      if (btn) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
        btn.style.display = 'flex';
      }
    });
  }, 100);

  // Inicializar com o primeiro slide ativo
  showSlide(0);
}

// Portfolio slider
function initPortfolioSlider() {
  const portfolioGrid = document.getElementById('portfolio-grid');
  const portfolioDots = document.getElementById('portfolio-dots');
  const prevBtn = document.querySelector('.prev-portfolio');
  const nextBtn = document.querySelector('.next-portfolio');

  // Create portfolio cards array
  const allCards = portfolioItems.flatMap(item => [
    {
      type: 'before',
      title: item.title,
      image: item.beforeImage,
      label: 'Antes'
    },
    {
      type: 'after',
      title: item.title,
      image: item.afterImage,
      label: 'Depois'
    }
  ]);

  function renderPortfolio() {
    const visibleCards = allCards.slice(currentPortfolioIndex, currentPortfolioIndex + 2);
    
    portfolioGrid.innerHTML = visibleCards.map(card => `
      <div class="portfolio-card">
        <div class="portfolio-image">
          <img src="${card.image}" alt="${card.title} - ${card.label}">
          <div class="portfolio-label ${card.type}">${card.label}</div>
        </div>
        <div class="portfolio-content">
          <h4>${card.title}</h4>
          <p>${card.type === 'before' ? 'Estado inicial' : 'Resultado final'}</p>
        </div>
      </div>
    `).join('');
  }

  function renderDots() {
    const totalSlides = Math.ceil(allCards.length / 2);
    portfolioDots.innerHTML = Array.from({ length: totalSlides }, (_, index) => 
      `<div class="portfolio-dot ${Math.floor(currentPortfolioIndex / 2) === index ? 'active' : ''}" data-index="${index * 2}"></div>`
    ).join('');

    // Add click handlers to dots
    portfolioDots.querySelectorAll('.portfolio-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        currentPortfolioIndex = parseInt(dot.dataset.index);
        renderPortfolio();
        renderDots();
      });
    });
  }

  function nextPortfolio() {
    currentPortfolioIndex = currentPortfolioIndex + 2 >= allCards.length ? 0 : currentPortfolioIndex + 2;
    renderPortfolio();
    renderDots();
  }

  function prevPortfolio() {
    currentPortfolioIndex = currentPortfolioIndex - 2 < 0 ? allCards.length - 2 : currentPortfolioIndex - 2;
    renderPortfolio();
    renderDots();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextPortfolio);
  if (prevBtn) prevBtn.addEventListener('click', prevPortfolio);

  // Initial render
  renderPortfolio();
  renderDots();
}

// Certifications carousel
function initCertificationsCarousel() {
  const carousel = document.getElementById('certifications-carousel');
  const indicators = document.getElementById('certifications-indicators');

  function renderCertifications() {
    const visibleCerts = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentCertificationIndex + i) % certifications.length;
      visibleCerts.push(certifications[index]);
    }

    carousel.innerHTML = visibleCerts.map((cert, index) => `
      <div class="certification-card" style="animation-delay: ${index * 0.1}s">
        <img src="${cert.logo}" alt="Logo ${cert.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI2MCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+JHtjZXJ0Lm5hbWV9PC90ZXh0Pjwvc3ZnPg=='">
      </div>
    `).join('');
  }

  function renderIndicators() {
    indicators.innerHTML = certifications.map((_, index) => 
      `<div class="cert-indicator ${index === currentCertificationIndex ? 'active' : ''}"></div>`
    ).join('');
  }

  function nextCertification() {
    currentCertificationIndex = (currentCertificationIndex + 1) % certifications.length;
    renderCertifications();
    renderIndicators();
  }

  // Auto-play
  setInterval(nextCertification, 3000);

  // Initial render
  renderCertifications();
  renderIndicators();
}

// FAQ functionality
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Form handling
function initForms() {
  const forms = document.querySelectorAll('.contact-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (isSubmitting) return;
      
      const button = form.querySelector('.btn-primary');
      const btnText = button.querySelector('.btn-text');
      const loadingSpinner = button.querySelector('.loading-spinner');
      
      // Start loading state
      isSubmitting = true;
      button.classList.add('loading');
      button.disabled = true;
      loadingSpinner.style.display = 'flex';
      btnText.style.display = 'none';

      try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success
        form.reset();
        showToast(
          'Sucesso!',
          form.id === 'hero-form' 
            ? 'Orçamento solicitado com sucesso! Entraremos em contato em breve.'
            : 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
          'success'
        );
        
      } catch (error) {
        // Error
        showToast(
          'Erro!',
          'Ocorreu um erro ao enviar. Tente novamente.',
          'error'
        );
      } finally {
        // Reset loading state
        isSubmitting = false;
        button.classList.remove('loading');
        button.disabled = false;
        loadingSpinner.style.display = 'none';
        btnText.style.display = 'inline';
      }
    });
  });
}

// Color selector
function initColorSelector() {
  const colorSelector = document.getElementById('color-selector');
  const colorToggle = document.getElementById('color-toggle');
  const colorOptions = document.querySelectorAll('.color-option');
  
  let currentColor = localStorage.getItem('selectedColor') || 'red';
  
  // Apply saved color
  applyColor(currentColor);
  updateActiveColor(currentColor);

  function applyColor(color) {
    const colorData = colors[color];
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', colorData.primary);
    root.style.setProperty('--primary-hover', colorData.hover);
    root.style.setProperty('--primary-light', colorData.light);
    root.style.setProperty('--primary-shadow', colorData.shadow);
    
    // Update toggle button
    colorToggle.style.background = colorData.primary;
    colorToggle.style.boxShadow = `0 4px 15px ${colorData.shadow}`;
  }

  function updateActiveColor(color) {
    colorOptions.forEach(option => {
      option.classList.remove('active');
    });
    document.querySelector(`[data-color="${color}"]`).classList.add('active');
  }

  // Toggle color selector
  colorToggle.addEventListener('click', () => {
    colorSelector.classList.toggle('expanded');
  });

  // Color option clicks
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      const color = option.dataset.color;
      currentColor = color;
      localStorage.setItem('selectedColor', color);
      applyColor(color);
      updateActiveColor(color);
      colorSelector.classList.remove('expanded');
      
      showToast(
        'Cor Alterada!',
        `Tema alterado para ${colorNames[color]}!`,
        'success',
        3000
      );
    });
  });

  // Close selector when clicking outside
  document.addEventListener('click', (e) => {
    if (!colorSelector.contains(e.target)) {
      colorSelector.classList.remove('expanded');
    }
  });
}

// WhatsApp button
function initWhatsApp() {
  const whatsappButton = document.getElementById('whatsapp-button');
  
  whatsappButton.addEventListener('click', () => {
    const phone = "5511999999999"; // Replace with actual phone number
    const message = "Olá! Gostaria de solicitar um orçamento para meu veículo.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initServicesSlider();
  initPortfolioSlider();
  initCertificationsCarousel();
  initFAQ();
  initForms();
  initColorSelector();
  initWhatsApp();
  
  console.log("Funilaria Website - Loaded successfully!");
  
  // Mostrar toast de confirmação do carregamento
  setTimeout(() => {
    showToast(
      'Sistema Carregado!',
      'Problema da imagem 1 na seção de serviços foi corrigido.',
      'success',
      4000
    );
  }, 1000);
});

// Handle window resize
window.addEventListener('resize', () => {
  // Reinitialize components that need resize handling
  if (window.innerWidth <= 768) {
    // Mobile specific adjustments
  }
});
