/* ===== MODERN PORTFOLIO JAVASCRIPT ===== */

// DOM Elements
const elements = {
  // Navigation
  navbar: document.getElementById('navbar'),
  navProgress: document.getElementById('navProgress'),
  mobileMenuToggle: document.getElementById('mobileMenuToggle'),
  mobileNav: document.getElementById('mobileNav'),
  
  // Theme
  themeToggle: document.getElementById('themeToggle'),
  html: document.documentElement,
  
  // Hero
  typedText: document.getElementById('typedText'),
  
  // Scroll
  scrollToTop: document.getElementById('scrollToTop'),
  
  // Forms
  contactForm: document.getElementById('contactForm'),
  formMessage: document.getElementById('formMessage'),
  
  // Current year
  currentYear: document.getElementById('currentYear')
};

// State
const state = {
  isDark: false,
  isMenuOpen: false,
  currentSection: 'home',
  scrollY: 0,
  isScrolling: false
};

// Typing Animation
class TypingAnimation {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.options = {
      typeSpeed: 100,
      deleteSpeed: 50,
      pauseTime: 2000,
      loop: true,
      ...options
    };
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
  }

  start() {
    if (!this.element) return;
    this.type();
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = this.options.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Smooth Scroll
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Navigation
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.handleScroll();
    this.handleMobileMenu();
    this.handleActiveSection();
    this.handleProgressBar();
  }

  handleScroll() {
    let ticking = false;
    
    const updateScroll = () => {
      state.scrollY = window.scrollY;
      
      // Navbar background
      if (state.scrollY > 50) {
        elements.navbar?.classList.add('scrolled');
      } else {
        elements.navbar?.classList.remove('scrolled');
      }
      
      // Scroll to top button
      if (state.scrollY > 300) {
        elements.scrollToTop?.classList.add('show');
      } else {
        elements.scrollToTop?.classList.remove('show');
      }
      
      // Progress bar
      this.updateProgressBar();
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  handleMobileMenu() {
    elements.mobileMenuToggle?.addEventListener('click', () => {
      state.isMenuOpen = !state.isMenuOpen;
      elements.mobileNav?.classList.toggle('show', state.isMenuOpen);
      document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    });

    // Close menu when clicking on links
    document.querySelectorAll('.mobile-nav-item').forEach(link => {
      link.addEventListener('click', () => {
        state.isMenuOpen = false;
        elements.mobileNav?.classList.remove('show');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (state.isMenuOpen && !elements.mobileNav?.contains(e.target) && !elements.mobileMenuToggle?.contains(e.target)) {
        state.isMenuOpen = false;
        elements.mobileNav?.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  handleActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-item');

    const updateActiveSection = () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (state.scrollY >= sectionTop && state.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      if (current !== state.currentSection) {
        state.currentSection = current;
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      }
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
  }

  updateProgressBar() {
    if (!elements.navProgress) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    elements.navProgress.style.width = `${scrollPercent}%`;
  }

  handleProgressBar() {
    // Initial progress bar update
    this.updateProgressBar();
  }
}

// Theme Toggle
class ThemeToggle {
  constructor() {
    this.init();
  }

  init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme === 'dark');
    
    // Theme toggle event
    elements.themeToggle?.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  setTheme(isDark) {
    state.isDark = isDark;
    elements.html.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update theme icon
    const themeIcon = elements.themeToggle?.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.className = `theme-icon fas fa-${isDark ? 'sun' : 'moon'}`;
    }
  }

  toggleTheme() {
    this.setTheme(!state.isDark);
  }
}

// Animations
class Animations {
  constructor() {
    this.init();
  }

  init() {
    this.initAOS();
    this.initScrollAnimations();
    this.initHoverEffects();
  }

  initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
      });
    }
  }

  initScrollAnimations() {
    // Animate progress bars on scroll
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const animateProgressBars = () => {
      progressBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !bar.classList.contains('animated')) {
          const width = bar.getAttribute('data-width') || '0';
          bar.style.width = `${width}%`;
          bar.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', animateProgressBars, { passive: true });
    animateProgressBars(); // Initial check
  }

  initHoverEffects() {
    // Parallax effect for floating elements
    const floatingElements = document.querySelectorAll('.floating-element, .floating-stat');
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth) * 100;
      const yPos = (clientY / innerHeight) * 100;
      
      floatingElements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        const x = (xPos - 50) * speed;
        const y = (yPos - 50) * speed;
        
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
  }
}

// Skills Filter
class SkillsFilter {
  constructor() {
    this.init();
  }

  init() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        const category = btn.getAttribute('data-category');
        
        skillCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'slideInUp 0.5s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

// Projects Filter
class ProjectsFilter {
  constructor() {
    this.init();
  }

  init() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter projects
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filter === 'all' || cardCategory === filter) {
            card.style.display = 'block';
            card.style.animation = 'slideInUp 0.5s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

// Contact Form
class ContactForm {
  constructor() {
    this.init();
  }

  init() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Real-time validation
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        if (!value) {
          isValid = false;
          errorMessage = 'Name is required';
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = 'Name must be at least 2 characters';
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          errorMessage = 'Email is required';
        } else if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
      
      case 'subject':
        if (!value) {
          isValid = false;
          errorMessage = 'Subject is required';
        } else if (value.length < 3) {
          isValid = false;
          errorMessage = 'Subject must be at least 3 characters';
        }
        break;
      
      case 'message':
        if (!value) {
          isValid = false;
          errorMessage = 'Message is required';
        } else if (value.length < 10) {
          isValid = false;
          errorMessage = 'Message must be at least 10 characters';
        }
        break;
    }

    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = isValid ? 'none' : 'block';
    }

    field.classList.toggle('error', !isValid);
    return isValid;
  }

  clearError(field) {
    const errorElement = document.querySelector(`[data-error-for="${field.name}"]`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    field.classList.remove('error');
  }

  handleSubmit() {
    const formData = new FormData(elements.contactForm);
    const data = Object.fromEntries(formData);

    // Validate all fields
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showMessage('Please fix the errors above.', 'error');
      return;
    }

    // Simulate form submission
    this.showMessage('Sending message...', 'info');
    
    setTimeout(() => {
      this.showMessage('Thank you! Your message has been sent successfully.', 'success');
      elements.contactForm.reset();
    }, 2000);
  }

  showMessage(message, type) {
    if (!elements.formMessage) return;

    elements.formMessage.textContent = message;
    elements.formMessage.className = `form-message ${type}`;
    elements.formMessage.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        elements.formMessage.style.display = 'none';
      }, 5000);
    }
  }
}

// Scroll to Top
class ScrollToTop {
  constructor() {
    this.init();
  }

  init() {
    elements.scrollToTop?.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Particle System
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.opacity = '0.1';
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.classList.add('reduced-motion');
    }

    // Monitor scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Optimize animations based on scroll performance
        this.optimizeAnimations();
      }, 100);
    }, { passive: true });
  }

  optimizeAnimations() {
    // Disable heavy animations on slow devices
    const isSlowDevice = navigator.connection && navigator.connection.effectiveType === 'slow-2g';
    if (isSlowDevice) {
      document.documentElement.classList.add('reduced-motion');
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new Navigation();
  new ThemeToggle();
  new SmoothScroll();
  new Animations();
  new SkillsFilter();
  new ProjectsFilter();
  new ContactForm();
  new ScrollToTop();
  new PerformanceMonitor();
  
  // Initialize typing animation
  const typingTexts = [
    'Fullstack Developer',
    'Frontend Engineer',
    'UI/UX Designer',
    'Problem Solver',
    'Creative Thinker'
  ];
  
  if (elements.typedText) {
    new TypingAnimation(elements.typedText, typingTexts).start();
  }
  
  // Set current year
  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear();
  }
  
  // Initialize particle system (optional - can be disabled for performance)
  // new ParticleSystem();
  
  console.log('🚀 Portfolio loaded successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    document.documentElement.classList.add('paused');
  } else {
    // Resume animations when page is visible
    document.documentElement.classList.remove('paused');
  }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Recalculate layouts on resize
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, 250);
});

// Export for potential external use
window.Portfolio = {
  Navigation,
  ThemeToggle,
  SmoothScroll,
  Animations,
  SkillsFilter,
  ProjectsFilter,
  ContactForm,
  ScrollToTop,
  ParticleSystem,
  PerformanceMonitor
};