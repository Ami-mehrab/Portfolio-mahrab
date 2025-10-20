// ========================================
// PORTFOLIO WEBSITE - MAIN JAVASCRIPT FILE
// Author: Mahrab Hossen
// ========================================

"use strict";

// ========================================
// THEME TOGGLE FUNCTIONALITY
// ========================================
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const icon = themeToggle?.querySelector("i");

  if (!themeToggle || !icon) return;

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme") || "dark";

  if (savedTheme === "light") {
    body.classList.add("light-mode");
    icon.classList.replace("fa-moon", "fa-sun");
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");

    // Update icon
    icon.classList.replace(
      isLight ? "fa-moon" : "fa-sun",
      isLight ? "fa-sun" : "fa-moon"
    );

    // Save theme preference
    localStorage.setItem("theme", isLight ? "light" : "dark");

    // Add transition effect
    body.style.transition = "all 0.3s ease";
  });
}

// ========================================
// MOBILE NAVIGATION MENU
// ========================================
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!hamburger || !navLinks) return;

  // Toggle mobile menu
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");

    // Animate hamburger icon
    const bars = hamburger.querySelectorAll("div");
    if (navLinks.classList.contains("active")) {
      bars[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      bars[0].style.transform = "none";
      bars[1].style.opacity = "1";
      bars[2].style.transform = "none";
    }
  });

  // Close menu when clicking on a link
  const navItems = navLinks.querySelectorAll("a");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");

      // Reset hamburger animation
      const bars = hamburger.querySelectorAll("div");
      bars[0].style.transform = "none";
      bars[1].style.opacity = "1";
      bars[2].style.transform = "none";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");

        // Reset hamburger animation
        const bars = hamburger.querySelectorAll("div");
        bars[0].style.transform = "none";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "none";
      }
    }
  });

  // Close menu on window resize if open
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");

      const bars = hamburger.querySelectorAll("div");
      bars[0].style.transform = "none";
      bars[1].style.opacity = "1";
      bars[2].style.transform = "none";
    }
  });
}

// ========================================
// CONTACT FORM SUBMISSION
// ========================================
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  if (!contactForm || !submitBtn) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm(contactForm)) {
      return;
    }

    // Get form data
    const formData = new FormData(contactForm);
    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    const json = JSON.stringify(object);

    // Update button state
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Submit form to Web3Forms API
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let jsonResponse = await response.json();

        if (response.status === 200) {
          // Success - redirect to thank you page
          window.location.href = "thankyou.html";
        } else {
          // Error - show error message
          console.error("Form submission error:", jsonResponse);
          showNotification(
            "Error: " + (jsonResponse.message || "Something went wrong!"),
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        showNotification(
          "Something went wrong! Please try again or contact me directly via email.",
          "error"
        );
      })
      .finally(() => {
        // Reset button state
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
      });
  });
}

// ========================================
// FORM VALIDATION
// ========================================
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  let isValid = true;
  let errorMessage = "";

  // Check if required
  if (field.hasAttribute("required") && value === "") {
    isValid = false;
    errorMessage = "This field is required";
  }

  // Email validation
  if (type === "email" && value !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    }
  }

  // Phone validation (if applicable)
  if (type === "tel" && value !== "") {
    const phoneRegex = /^[\d\s+()-]+$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = "Please enter a valid phone number";
    }
  }

  // Minimum length validation
  if (field.hasAttribute("minlength") && value.length > 0) {
    const minLength = parseInt(field.getAttribute("minlength"));
    if (value.length < minLength) {
      isValid = false;
      errorMessage = `Minimum ${minLength} characters required`;
    }
  }

  // Update field styling
  if (isValid) {
    field.style.borderColor = "";
    removeErrorMessage(field);
  } else {
    field.style.borderColor = "#ef4444";
    showErrorMessage(field, errorMessage);
  }

  return isValid;
}

function showErrorMessage(field, message) {
  removeErrorMessage(field);

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "#ef4444";
  errorDiv.style.fontSize = "0.875rem";
  errorDiv.style.marginTop = "0.25rem";
  errorDiv.textContent = message;

  field.parentElement.appendChild(errorDiv);
}

function removeErrorMessage(field) {
  const existingError = field.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
}

// Initialize real-time validation
function initFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      // Validate on blur
      input.addEventListener("blur", () => {
        validateField(input);
      });

      // Remove error on input if field was invalid
      input.addEventListener("input", () => {
        if (input.style.borderColor === "rgb(239, 68, 68)") {
          validateField(input);
        }
      });
    });
  });
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotif = document.querySelector(".notification");
  if (existingNotif) {
    existingNotif.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  // Styling based on type
  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#f59e0b",
  };

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Only handle internal anchor links
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 100; // Account for fixed header
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
  // Check if IntersectionObserver is supported
  if (!("IntersectionObserver" in window)) {
    console.log("IntersectionObserver not supported");
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  const animateElements = document.querySelectorAll(
    ".project-card, .timeline-item, .info-card, .skill-tag, .about-text, .profile-card"
  );

  animateElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
function initHeaderScroll() {
  const header = document.querySelector("header");
  let lastScroll = 0;

  if (!header) return;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
      header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
      header.style.padding = "1rem 0";
    } else {
      header.style.boxShadow = "none";
      header.style.padding = "1.5rem 0";
    }

    // Hide header on scroll down, show on scroll up (optional)
    if (currentScroll > lastScroll && currentScroll > 500) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });
}

// ========================================
// PORTFOLIO FILTER (OPTIONAL FEATURE)
// ========================================
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length === 0) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter projects with animation
      projectCards.forEach((card, index) => {
        const category = card.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, index * 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

// ========================================
// TYPING EFFECT (OPTIONAL FOR HERO)
// ========================================
function initTypingEffect() {
  const typingElement = document.querySelector(".typing-text");

  if (!typingElement) return;

  const texts = typingElement.getAttribute("data-texts")?.split(",") || [];
  if (texts.length === 0) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      // Pause before deleting
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// ========================================
// PRELOADER (OPTIONAL)
// ========================================
function initPreloader() {
  const preloader = document.getElementById("preloader");

  if (!preloader) return;

  window.addEventListener("load", () => {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 300);
  });
}

// ========================================
// BACK TO TOP BUTTON
// ========================================
function initBackToTop() {
  // Create back to top button if it doesn't exist
  let backToTopBtn = document.getElementById("backToTop");

  if (!backToTopBtn) {
    backToTopBtn = document.createElement("button");
    backToTopBtn.id = "backToTop";
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute("aria-label", "Back to top");
    backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4);
            transition: all 0.3s ease;
            z-index: 999;
            opacity: 0;
        `;
    document.body.appendChild(backToTopBtn);
  }

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = "flex";
      setTimeout(() => {
        backToTopBtn.style.opacity = "1";
      }, 10);
    } else {
      backToTopBtn.style.opacity = "0";
      setTimeout(() => {
        if (window.pageYOffset <= 300) {
          backToTopBtn.style.display = "none";
        }
      }, 300);
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  backToTopBtn.addEventListener("mouseenter", () => {
    backToTopBtn.style.transform = "translateY(-5px) scale(1.1)";
  });

  backToTopBtn.addEventListener("mouseleave", () => {
    backToTopBtn.style.transform = "translateY(0) scale(1)";
  });
}

// ========================================
// COPY TO CLIPBOARD
// ========================================
function initCopyToClipboard() {
  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const textToCopy = button.getAttribute("data-copy");

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.style.background = "#22c55e";

            setTimeout(() => {
              button.innerHTML = originalText;
              button.style.background = "";
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy:", err);
            showNotification("Failed to copy to clipboard", "error");
          });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          showNotification("Copied to clipboard!", "success");
        } catch (err) {
          console.error("Failed to copy:", err);
          showNotification("Failed to copy to clipboard", "error");
        }
        document.body.removeChild(textArea);
      }
    });
  });
}

// ========================================
// LAZY LOADING IMAGES
// ========================================
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  if (images.length === 0) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);

        img.addEventListener("load", () => {
          img.style.opacity = "1";
        });
      }
    });
  });

  images.forEach((img) => {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";
    imageObserver.observe(img);
  });
}

// ========================================
// KEYBOARD NAVIGATION ACCESSIBILITY
// ========================================
function initAccessibility() {
  // Allow keyboard navigation for custom elements
  const interactiveElements = document.querySelectorAll(
    ".project-card, .skill-tag, .info-card"
  );

  interactiveElements.forEach((el) => {
    // Make focusable
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "0");
    }

    // Add keyboard event listener
    el.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  // Skip to main content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link";
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s ease;
    `;

  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "0";
  });

  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px";
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

// ========================================
// PERFORMANCE MONITORING
// ========================================
function monitorPerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page Load Time: ${pageLoadTime}ms`);
      }, 0);
    });
  }
}

// ========================================
// HANDLE EXTERNAL LINKS
// ========================================
function initExternalLinks() {
  const links = document.querySelectorAll('a[href^="http"]');

  links.forEach((link) => {
    // Add target="_blank" if not already set
    if (!link.hasAttribute("target")) {
      link.setAttribute("target", "_blank");
    }

    // Add rel="noopener noreferrer" for security
    if (!link.hasAttribute("rel")) {
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
}

// ========================================
// ANIMATIONS FOR CSS
// ========================================
function addAnimationStyles() {
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
  document.head.appendChild(style);
}

// ========================================
// INITIALIZE ALL FUNCTIONS
// ========================================
function init() {
  console.log("Initializing Portfolio Website...");

  // Add animation styles
  addAnimationStyles();

  // Core functionality
  initThemeToggle();
  initMobileMenu();
  initContactForm();

  // Enhanced features
  initSmoothScroll();
  initScrollAnimations();
  initHeaderScroll();
  initFormValidation();

  // Optional features
  initPortfolioFilter();
  initTypingEffect();
  initPreloader();
  initBackToTop();
  initCopyToClipboard();
  initLazyLoading();
  initAccessibility();
  initExternalLinks();

  // Performance monitoring (development only)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    monitorPerformance();
  }

  console.log("Portfolio Website Initialized Successfully!");
}

// ========================================
// RUN INITIALIZATION
// ========================================
// Run initialization when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ========================================
// EXPORT FUNCTIONS (FOR MODULE USAGE)
// ========================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initThemeToggle,
    initMobileMenu,
    initContactForm,
    initSmoothScroll,
    initScrollAnimations,
    validateForm,
    showNotification,
  };
}

// ========================================
// GLOBAL ERROR HANDLER
// ========================================
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
  // You can send error logs to your server here
});

// ========================================
// PREVENT CONSOLE ERRORS IN PRODUCTION
// ========================================
if (
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
// Typewriter Effect for Name
const typingText = document.getElementById("typingText");
const textToType = "Mahrab Hossen";
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeWriter() {
  if (!isDeleting && charIndex < textToType.length) {
    typingText.textContent += textToType.charAt(charIndex);
    charIndex++;
    typingSpeed = 150;
  } else if (isDeleting && charIndex > 0) {
    typingText.textContent = textToType.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 100;
  }

  if (charIndex === textToType.length) {
    isDeleting = true;
    typingSpeed = 2000; // Pause before deleting
  } else if (charIndex === 0 && isDeleting) {
    isDeleting = false;
    typingSpeed = 500; // Pause before typing again
  }

  setTimeout(typeWriter, typingSpeed);
}

// Start typing effect when page loads
window.addEventListener("load", () => {
  setTimeout(typeWriter, 500);
});
