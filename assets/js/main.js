// ===================================
// SÜZEN İNŞAAT - MAIN JAVASCRIPT
// ===================================

// === LOGO TOUCH HOVER (mobile) ===
document.addEventListener("DOMContentLoaded", function () {
  const logoLink = document.querySelector(".logo-link");
  if (logoLink && window.matchMedia("(max-width: 900px)").matches) {
    let timeout;
    logoLink.addEventListener("touchstart", function (e) {
      e.preventDefault();
      logoLink.classList.add("touch-hover");
      clearTimeout(timeout);
      timeout = setTimeout(() => logoLink.classList.remove("touch-hover"), 2000);
    }, { passive: false });
  }
});

// === MOBILE MENU TOGGLE ===
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !event.target.closest(".nav") &&
      navMenu &&
      navMenu.classList.contains("active")
    ) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navMenu.classList.contains("active")) {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  });
});

// === STICKY HEADER ON SCROLL ===
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
});

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  });
});

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements with fade-in animation
document.addEventListener("DOMContentLoaded", function () {
  const animatedElements = document.querySelectorAll(".card, .section-header");
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });
});

// === FORM VALIDATION ===
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = "var(--red-600)";

        // Remove error styling after user starts typing
        field.addEventListener("input", function () {
          this.style.borderColor = "";
        });
      }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = "var(--red-600)";
      }
    }

    if (isValid) {
      // Form is valid, you can submit it
      alert("Form submitted successfully!");
      form.reset();
    } else {
      alert("Please fill in all required fields correctly.");
    }
  });
}

// Initialize form validation if contact form exists
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("contact-form")) {
    validateForm("contact-form");
  }
});

// === LANGUAGE DETECTION & SWITCHING ===
function detectLanguage() {
  // Check if user has a saved language preference
  const savedLang = localStorage.getItem("preferredLanguage");
  if (savedLang) {
    return savedLang;
  }

  // Detect browser language
  const browserLang = navigator.language || navigator.userLanguage;

  // If browser language is English, return 'en', otherwise default to 'tr'
  if (browserLang.startsWith("en")) {
    return "en";
  }

  return "tr";
}

function switchLanguage(lang) {
  localStorage.setItem("preferredLanguage", lang);

  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop() || "index.html";

  if (lang === "en") {
    // Switch to English
    if (!currentPath.includes("/en/")) {
      window.location.href = "/en/" + currentPage;
    }
  } else {
    // Switch to Turkish
    if (currentPath.includes("/en/")) {
      const newPath = currentPath.replace("/en/", "/");
      window.location.href = newPath;
    }
  }
}

// Auto-redirect on first visit based on browser language
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");

  // Don't auto-redirect if user explicitly chose a language
  if (!langParam && !localStorage.getItem("preferredLanguage")) {
    const detectedLang = detectLanguage();
    const currentPath = window.location.pathname;

    // If detected language is English and we're not on English page, redirect
    if (detectedLang === "en" && !currentPath.includes("/en/")) {
      const currentPage = currentPath.split("/").pop() || "index.html";
      window.location.href = "/en/" + currentPage;
    }
  }
});

// === GALLERY LIGHTBOX ===
function initGallery() {
  const galleryImages = document.querySelectorAll(".gallery-item img");

  if (galleryImages.length === 0) return;

  // Create lightbox overlay
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <img class="lightbox-image" src="" alt="">
    <button class="lightbox-prev">&#10094;</button>
    <button class="lightbox-next">&#10095;</button>
  `;
  document.body.appendChild(lightbox);

  // Add lightbox styles
  const style = document.createElement("style");
  style.textContent = `
    .lightbox {
      display: none;
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      align-items: center;
      justify-content: center;
    }
    .lightbox.active { display: flex; }
    .lightbox-image {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
    }
    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 40px;
      font-size: 40px;
      color: white;
      cursor: pointer;
      z-index: 10000;
    }
    .lightbox-prev, .lightbox-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 30px;
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      padding: 20px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .lightbox-prev:hover, .lightbox-next:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .lightbox-prev { left: 20px; }
    .lightbox-next { right: 20px; }
  `;
  document.head.appendChild(style);

  let currentIndex = 0;
  const images = Array.from(galleryImages);

  function showImage(index) {
    const lightboxImage = lightbox.querySelector(".lightbox-image");
    lightboxImage.src = images[index].src;
    currentIndex = index;
  }

  // Click on gallery image
  galleryImages.forEach((img, index) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      lightbox.classList.add("active");
      showImage(index);
    });
  });

  // Close lightbox
  lightbox
    .querySelector(".lightbox-close")
    .addEventListener("click", function () {
      lightbox.classList.remove("active");
    });

  // Previous image
  lightbox
    .querySelector(".lightbox-prev")
    .addEventListener("click", function () {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    });

  // Next image
  lightbox
    .querySelector(".lightbox-next")
    .addEventListener("click", function () {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    });

  // Close on background click
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      lightbox.classList.remove("active");
    } else if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }
  });
}

// Initialize gallery if gallery items exist
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".gallery-item")) {
    initGallery();
  }
});

// === ACTIVE NAV LINK HIGHLIGHTING ===
// === ACTIVE NAV LINK HIGHLIGHTING ===
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  // Remove all active classes first
  navLinks.forEach((link) => link.classList.remove("active"));

  navLinks.forEach((link) => {
    // Get the path from the link href
    try {
      const linkUrl = new URL(link.href, window.location.origin);
      const linkPath = linkUrl.pathname;
      
      // Check for exact match or index.html match
      // Also ensure we don't accidentally highlight links with hashes as active page unless it's the exact page
      if (
        (currentPath === linkPath) ||
        (currentPath.endsWith("/") && linkPath.endsWith("index.html")) ||
        (currentPath.endsWith("index.html") && linkPath.endsWith("/"))
      ) {
        // Don't add active class to hash links on the same page unless we are strictly matching path
        if (!link.getAttribute('href').startsWith('#')) {
             link.classList.add("active");
        }
      }
    } catch (e) {
      console.error("Error parsing link URL:", e);
    }
  });
});

// === SCROLL SPY FOR SECTION HIGHLIGHTING ===
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  const scrollPosition = window.scrollY + 150; // Offset for header
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    // Check if link points to current section
    if (href === '#' + currentSection) {
      link.classList.add('active');
    }
    // Keep homepage link active if at top of page
    else if (scrollPosition < 200 && (href === 'index.html' || href.endsWith('/index.html'))) {
      link.classList.add('active');
    }
  });
});

// === BRAND TICKER SEAMLESS LOOP ===
(function () {
  const track = document.querySelector('.brands-track');
  if (!track) return;

  // Disable CSS animation — we handle movement with JS
  track.style.animation = 'none';

  const halfCount = track.children.length / 2;
  let pos = 0;
  let setWidth = 0;
  let paused = false;

  track.parentElement.addEventListener('mouseenter', () => { paused = true; });
  track.parentElement.addEventListener('mouseleave', () => { paused = false; });

  function measureSetWidth() {
    let w = 0;
    for (let i = 0; i < halfCount; i++) {
      w += track.children[i].getBoundingClientRect().width;
    }
    return w;
  }

  function tick() {
    if (!paused) {
      if (!setWidth) setWidth = measureSetWidth();
      pos -= 0.6;
      if (Math.abs(pos) >= setWidth) {
        pos += setWidth;
      }
      track.style.transform = 'translateX(' + pos + 'px)';
    }
    requestAnimationFrame(tick);
  }

  // Wait for images to load before starting
  window.addEventListener('load', function () {
    setWidth = measureSetWidth();
    requestAnimationFrame(tick);
  });
})();
