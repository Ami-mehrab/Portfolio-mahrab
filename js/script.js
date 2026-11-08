/**
 * MAHRAB HOSSEN PORTFOLIO — script.js
 * Clean, lightweight vanilla JS for animations & interactivity
 */

document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initThemeToggle();
    initMobileMenu();
    initScrollSpy();
    initCounters();
    initSkillsAnimation();
    initPortfolioFilter();
    initResumeModal();
    initContactForm();
    initBackToTop();
    initSliders();
    initWhatsAppPopup();
});

/* ============================================================
   1. HEADER SCROLL & BACK TO TOP
   ============================================================ */
function initHeaderScroll() {
    const header = document.getElementById("header");
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;

        // Header shadow on scroll
        if (header) {
            if (scrollPos > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Back to top button visibility
        if (backToTop) {
            if (scrollPos > 350) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        }
    }, { passive: true });
}

function initBackToTop() {
    const backToTop = document.getElementById("backToTop");
    if (!backToTop) return;

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function initThemeToggle() {
    const themeToggles = document.querySelectorAll(".theme-toggle, #themeToggle");
    if (!themeToggles.length) return;

    // Check saved preference or default
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeIcons(true);
    }

    themeToggles.forEach(btn => {
        btn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateThemeIcons(isDark);
        });
    });

    function updateThemeIcons(isDark) {
        themeToggles.forEach(btn => {
            const icon = btn.querySelector("i");
            if (icon) {
                if (isDark) {
                    icon.classList.remove("fa-moon");
                    icon.classList.add("fa-sun");
                } else {
                    icon.classList.remove("fa-sun");
                    icon.classList.add("fa-moon");
                }
            }
        });
    }
}

/* ============================================================
   2. MOBILE MENU & SMOOTH SCROLLING
   ============================================================ */
function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link, .nav-icon-link, .btn-nav");

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });
}

/* ============================================================
   3. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHT)
   ============================================================ */
function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!sections.length || !navLinks.length) return;

    window.addEventListener("scroll", () => {
        let current = "";
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }, { passive: true });
}

/* ============================================================
   4. STATS COUNTER ANIMATION
   ============================================================ */
function initCounters() {
    const statsContainer = document.querySelector(".hero-stats");
    const statNumbers = document.querySelectorAll(".stat-number");
    if (!statsContainer || !statNumbers.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const targetText = stat.getAttribute("data-target") || stat.textContent;
                    const isDecimal = targetText.includes(".");
                    const targetVal = parseFloat(targetText);
                    const suffix = stat.textContent.replace(/[\d.]/g, "");

                    let startVal = 0;
                    const duration = 1600;
                    const startTime = performance.now();

                    function updateNumber(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const currentVal = startVal + (targetVal - startVal) * easeOut;

                        stat.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        } else {
                            stat.textContent = targetText + suffix;
                        }
                    }

                    requestAnimationFrame(updateNumber);
                });
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsContainer);
}

/* ============================================================
   5. SKILLS PROGRESS BARS ANIMATION
   ============================================================ */
function initSkillsAnimation() {
    const skillsSection = document.getElementById("skills");
    const progressBars = document.querySelectorAll(".skill-progress-bar");

    if (!skillsSection || !progressBars.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute("data-width");
                    if (targetWidth) {
                        bar.style.width = targetWidth + "%";
                    }
                });
            }
        });
    }, { threshold: 0.2 });

    observer.observe(skillsSection);
}

/* ============================================================
   6. PORTFOLIO CATEGORY FILTER
   ============================================================ */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-showcase-card");

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const categories = card.getAttribute("data-category") || "";
                
                if (filterValue === "all" || categories.includes(filterValue)) {
                    card.classList.remove("hide");
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.96)";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.classList.add("hide");
                }
            });
        });
    });
}

/* ============================================================
   7. RESUME PREVIEW MODAL (UPDATED WITH CV DATA)
   ============================================================ */
function initResumeModal() {
    const modal = document.getElementById("cvModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    const closeBtns = [document.getElementById("modalClose"), document.getElementById("modalCloseBtn")];
    const triggerBtns = document.querySelectorAll(".open-cv-modal");

    if (!modal || !modalTitle || !modalContent) return;

    const modalData = {
        cv: {
            title: "Curriculum Vitae — Mahrab Hossen",
            html: `
                <div class="modal-cv-container">
                    <div class="modal-cv-header">
                        <div>
                            <h4 class="modal-candidate-name">Mahrab Hossen</h4>
                            <p class="modal-candidate-role">Full-Stack Software Engineer | PHP · Laravel · MySQL</p>
                            <p class="modal-candidate-contact">Uttara, Dhaka, Bangladesh · +880 1950 047492 · mahrabbappy33@gmail.com</p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Professional Summary</h5>
                        <p class="modal-cv-text">
                            Full-Stack Software Engineer with over a year of experience building and maintaining web-based business applications using <strong>PHP, Laravel and MySQL</strong>, including ERP, SaaS and role-based systems. Skilled in database design, RESTful and third-party API integration, n8n automation and AI-integrated solutions. Working knowledge of Vue.js and Inertia.js, with experience taking features from requirements and database design through development, testing and continuous improvement.
                        </p>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Work Experience</h5>
                        <div class="modal-cv-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">Software Engineer</strong>
                                <span class="modal-role-dates">October 1, 2025 – Present</span>
                            </div>
                            <p class="modal-cv-company">eGeneration PLC, Kuril, Dhaka, Bangladesh</p>
                            <ul class="modal-cv-list">
                                <li>Work with the AI team to research AI use cases, evaluate technologies and support proof-of-concept development.</li>
                                <li>Test and integrate third-party APIs to deliver reliable AI-powered application features.</li>
                                <li>Actively develop and continuously enhance AI-integrated solutions, including the live <strong>eGInterview</strong> and <strong>eGSales-AI</strong> platforms.</li>
                            </ul>
                        </div>
                        <div class="modal-cv-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">Intern (PHP)</strong>
                                <span class="modal-role-dates muted">July 1, 2025 – September 30, 2025</span>
                            </div>
                            <p class="modal-cv-company">eGeneration PLC, Kuril, Dhaka, Bangladesh</p>
                            <ul class="modal-cv-list">
                                <li>Developed and maintained web applications using PHP/Laravel and MySQL.</li>
                                <li>Implemented REST APIs and role-based authentication for system users.</li>
                                <li>Managed version control and collaborated on full-stack development using Git.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Technical Skills</h5>
                        <div class="modal-cv-grid">
                            <div class="modal-cv-griditem">
                                <strong class="modal-skill-cat">Backend</strong>
                                <span class="modal-skill-desc">PHP (Laravel, CakePHP), OOP, RESTful API development, RBAC</span>
                            </div>
                            <div class="modal-cv-griditem">
                                <strong class="modal-skill-cat">Databases</strong>
                                <span class="modal-skill-desc">MySQL (schema design, query optimization), PostgreSQL, SQL Server</span>
                            </div>
                            <div class="modal-cv-griditem">
                                <strong class="modal-skill-cat">Automation & AI</strong>
                                <span class="modal-skill-desc">n8n workflows, Gemini Live API, Google Custom Search API, PoC</span>
                            </div>
                            <div class="modal-cv-griditem">
                                <strong class="modal-skill-cat">Frontend & Tools</strong>
                                <span class="modal-skill-desc">JavaScript, TypeScript, React, Vue.js, Inertia.js, HTML5, CSS3, Git</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        academic: {
            title: "Academic Background — Mahrab Hossen",
            html: `
                <div class="modal-cv-container">
                    <div class="modal-academic-banner">
                        <div class="modal-academic-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h4 class="modal-academic-degree">B.Sc. in Computer Science &amp; Engineering</h4>
                            <p class="modal-academic-inst">International University of Business Agriculture and Technology (IUBAT)</p>
                            <p class="modal-academic-meta">Passing Year: 2020 – 2025 · CGPA: <strong>3.20</strong> / 4.00</p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <div class="modal-cv-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">Higher Secondary School Certificate (HSC)</strong>
                                <span class="modal-role-dates">2019</span>
                            </div>
                            <p class="modal-cv-company">Tongi Government College, Dhaka, Bangladesh</p>
                        </div>
                        <div class="modal-cv-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">Secondary School Certificate (SSC)</strong>
                                <span class="modal-role-dates">2017</span>
                            </div>
                            <p class="modal-cv-company">Tamirul Millat Kamil Madrasah, Dhaka, Bangladesh · GPA: <strong>4.89</strong></p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Languages:</h5>
                        <p class="modal-cv-text">
                            <strong>Bangla:</strong> Native proficiency &nbsp;·&nbsp;
                            <strong>English:</strong> Fluent (listening, speaking, reading, writing) &nbsp;·&nbsp;
                            <strong>Arabic:</strong> Fluent reading &amp; writing, basic speaking
                        </p>
                    </div>
                </div>
            `
        },
        cert: {
            title: "AI & Automation Specializations — Mahrab Hossen",
            html: `
                <div class="modal-cv-container">
                    <div class="modal-cv-section">
                        <div class="modal-cv-card highlight-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">Gemini Live API &amp; Voice Intelligence Systems</strong>
                                <span class="modal-tag-badge green">Live Implementation</span>
                            </div>
                            <p class="modal-cv-text">
                                Engineered the voice engine for the live <strong>eGInterview platform</strong>: real-time bilingual Bengali-English voice interviews, speaker transcription, structured assessment, and loan analyst evaluation.
                            </p>
                        </div>

                        <div class="modal-cv-card highlight-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">n8n Workflow Automation &amp; Prospecting Pipelines</strong>
                                <span class="modal-tag-badge blue">Production Pipeline</span>
                            </div>
                            <p class="modal-cv-text">
                                Built automated end-to-end multi-step pipelines for <strong>eGSales-AI</strong>: integrated Google Custom Search API for targeted profile discovery, JavaScript batch deduplication, data cleaning, and automated email outreach.
                            </p>
                        </div>

                        <div class="modal-cv-card highlight-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">Full-Stack PHP, Laravel &amp; MySQL Engineering</strong>
                                <span class="modal-tag-badge purple">Core Specialty</span>
                            </div>
                            <p class="modal-cv-text">
                                Comprehensive production experience in relational database optimization, schema design, role-based access control, RESTful APIs, and modern frontends with Vue/Inertia/React.
                            </p>
                        </div>
                    </div>
                </div>
            `
        },
        "software-engineer": {
            title: "Software Engineer — eGeneration PLC",
            html: `
                <div class="modal-cv-container">
                    <div class="modal-cv-header">
                        <div>
                            <h4 class="modal-candidate-name">Software Engineer</h4>
                            <p class="modal-candidate-role">eGeneration PLC &mdash; Kuril, Dhaka, Bangladesh</p>
                            <p class="modal-candidate-contact"><i class="far fa-calendar-alt"></i> October 1, 2025 – Present &nbsp;·&nbsp; <span class="exp-badge current" style="display:inline-flex; font-size: 0.75rem; padding: 0.2rem 0.65rem;"><i class="fas fa-circle"></i> Current Full-Time Role</span></p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Key Highlights &amp; Specializations</h5>
                        <div class="modal-cv-card highlight-card" style="margin-bottom: 0.75rem;">
                            <p class="modal-cv-text">
                                <strong style="color: var(--primary);"><i class="fas fa-robot"></i> AI &amp; Automation:</strong> Live systems like <strong>eGInterview</strong> (Gemini Live API real-time voice interview engine) and <strong>eGSales-AI</strong> (n8n automated prospecting pipelines).
                            </p>
                        </div>
                        <div class="modal-cv-card highlight-card">
                            <p class="modal-cv-text">
                                <strong style="color: var(--primary);"><i class="fas fa-server"></i> Backend &amp; Databases:</strong> Scalable PHP/Laravel architectures, normalized MySQL schemas, query optimization, and secure RESTful APIs.
                            </p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Key Responsibilities & Deliverables</h5>
                        <ul class="modal-cv-list">
                            <li>Work directly with the AI engineering team to research practical enterprise use cases, evaluate LLM &amp; voice models, and develop rapid proof-of-concept (PoC) solutions.</li>
                            <li>Design, benchmark, and integrate third-party RESTful APIs to deliver dependable, production-ready AI-powered application features.</li>
                            <li>Architect, develop, and continuously enhance live AI-integrated systems, specifically the live <strong>eGInterview</strong> and <strong>eGSales-AI</strong> platforms.</li>
                            <li>Design normalized MySQL database schemas, write secure controller logic, optimize query performance, and ensure strict role-based access control (RBAC).</li>
                        </ul>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Flagship Production Platforms</h5>
                        <div class="modal-cv-card highlight-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">eGInterview — AI-Powered Voice Interview Platform</strong>
                                <span class="modal-tag-badge green">Live Platform</span>
                            </div>
                            <p class="modal-cv-text">
                                Engineered the voice engine leveraging Gemini Live API for real-time bilingual Bengali-English spoken interviews, candidate transcription, evaluation scoring, and automated reports.
                            </p>
                        </div>
                        <div class="modal-cv-card highlight-card">
                            <div class="modal-card-top">
                                <strong class="modal-role-title">eGSales-AI — Automated Prospecting & Outreach Pipeline</strong>
                                <span class="modal-tag-badge blue">Production Pipeline</span>
                            </div>
                            <p class="modal-cv-text">
                                Built multi-step automated n8n workflows connecting Google Custom Search API, JavaScript batch deduplication, data enrichment, and automated email nurturing.
                            </p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Core Tech Stack</h5>
                        <div class="exp-tags" style="margin-bottom: 0;">
                            <span>PHP 8+</span><span>Laravel</span><span>MySQL</span><span>Gemini Live API</span><span>n8n</span><span>REST APIs</span><span>Git</span>
                        </div>
                    </div>
                </div>
            `
        },
        "internship": {
            title: "Intern (PHP Developer) — eGeneration PLC",
            html: `
                <div class="modal-cv-container">
                    <div class="modal-cv-header">
                        <div>
                            <h4 class="modal-candidate-name">Intern &mdash; PHP Developer</h4>
                            <p class="modal-candidate-role">eGeneration PLC &mdash; Kuril, Dhaka, Bangladesh</p>
                            <p class="modal-candidate-contact"><i class="far fa-calendar-alt"></i> July 1, 2025 – September 30, 2025 &nbsp;·&nbsp; <span class="exp-badge past" style="display:inline-flex; font-size: 0.75rem; padding: 0.2rem 0.65rem;"><i class="fas fa-check-circle"></i> Completed</span></p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Key Highlights &amp; Focus</h5>
                        <div class="modal-cv-card highlight-card" style="margin-bottom: 0.75rem;">
                            <p class="modal-cv-text">
                                <strong style="color: var(--primary);"><i class="fas fa-code"></i> PHP &amp; Laravel Development:</strong> Developed web application modules, controllers, and normalized MySQL schemas.
                            </p>
                        </div>
                        <div class="modal-cv-card highlight-card">
                            <p class="modal-cv-text">
                                <strong style="color: var(--primary);"><i class="fas fa-shield-alt"></i> REST APIs &amp; RBAC:</strong> Implemented secure role-based access control authentication and endpoints for system users.
                            </p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Internship Contributions &amp; Core Work</h5>
                        <ul class="modal-cv-list">
                            <li>Developed and maintained core web application modules using modern PHP, Laravel, and MySQL under engineering leadership.</li>
                            <li>Implemented secure RESTful API endpoints and role-based access control (RBAC) authentication for multi-tier user portals.</li>
                            <li>Managed Git branch workflows, pull requests, and collaborative feature development in cross-functional agile teams.</li>
                            <li>Conducted code reviews, database query tuning, and resolved backend issues to ensure high platform reliability.</li>
                        </ul>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Tech Stack</h5>
                        <div class="exp-tags" style="margin-bottom: 0;">
                            <span>PHP</span><span>Laravel</span><span>MySQL</span><span>REST APIs</span><span>Authentication (RBAC)</span><span>Git</span><span>Bootstrap</span>
                        </div>
                    </div>
                </div>
            `
        },
        "education": {
            title: "Academic Background — IUBAT",
            html: `
                <div class="modal-cv-container">
                    <div class="modal-academic-banner">
                        <div class="modal-academic-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h4 class="modal-academic-degree">B.Sc. in Computer Science &amp; Engineering</h4>
                            <p class="modal-academic-inst">International University of Business Agriculture and Technology (IUBAT)</p>
                            <p class="modal-academic-meta">Passing Year: 2020 – 2025 &nbsp;·&nbsp; CGPA: <strong>3.20</strong> / 4.00</p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Academic Foundation</h5>
                        <div class="modal-cv-card highlight-card" style="margin-bottom: 0.75rem;">
                            <p class="modal-cv-text">
                                <strong style="color: var(--primary);"><i class="fas fa-graduation-cap"></i> Academic Foundation:</strong> B.Sc. in CSE with CGPA 3.20/4.00, focusing on Software Engineering, Relational Database Systems, and Object-Oriented Architectures.
                            </p>
                        </div>
                    </div>

                    <div class="modal-cv-section">
                        <h5 class="modal-cv-sectitle">Academic Focus &amp; Key Coursework</h5>
                        <ul class="modal-cv-list">
                            <li><strong>Database Architectures:</strong> Relational schema design, SQL query optimization, transactions, and indexing.</li>
                            <li><strong>Object-Oriented Design:</strong> OOP principles, design patterns, MVC architectures, and clean code standards.</li>
                            <li><strong>Data Structures &amp; Algorithms:</strong> Problem solving, algorithmic complexity, search and sorting techniques.</li>
                            <li><strong>Web Engineering:</strong> Full-stack development, network security, and RESTful web architectures.</li>
                        </ul>
                    </div>
                </div>
            `
        }
    };

    triggerBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.getAttribute("data-type") || "cv";
            const data = modalData[type] || modalData.cv;

            modalTitle.textContent = data.title;
            modalContent.innerHTML = data.html;
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    closeBtns.forEach(b => {
        if (b) b.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
}

/* ============================================================
   8. WEB3FORMS CONTACT FORM (KEY SECURED FROM DOM INSPECT)
   ============================================================ */
function initContactForm() {
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");

    if (!form || !submitBtn) return;

    // Securely assembled at runtime so key is NEVER exposed in the HTML/DOM Elements tab
    const _getFormKey = () => {
        const _s = ["MDQ5NjNiY2Et", "NDExOS00ODA0", "LTkwMmUtZTlj", "Njc1YWQ3ZDIw"];
        try {
            return atob(_s.join(""));
        } catch (e) {
            return "";
        }
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nameInput = form.querySelector("#name") || form.querySelector('input[name="name"]');
        const emailInput = form.querySelector("#email") || form.querySelector('input[name="email"]');
        const subjectInput = form.querySelector("#subject") || form.querySelector('input[name="subject"]');
        const messageInput = form.querySelector("#message") || form.querySelector('textarea[name="message"]');

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";
        const subject = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : "New Portfolio Contact Message";

        if (!name || !email || !message) {
            showToast("Please fill in your name, email, and message.", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }

        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>`;

        try {
            const formData = new FormData(form);
            formData.append("access_key", _getFormKey());
            formData.append("from_name", "Portfolio Contact Form");
            formData.append("subject", subject);

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                submitBtn.innerHTML = `<i class="fas fa-check"></i> <span>Message Sent!</span>`;
                showToast("Thank you, " + name + "! Your message has been sent successfully.");
                form.reset();
            } else {
                submitBtn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>Error</span>`;
                showToast(result.message || "Failed to send message. Please try again.", "error");
            }
        } catch (error) {
            submitBtn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>Failed</span>`;
            showToast("Network error. Please check your internet connection.", "error");
        } finally {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }, 3500);
        }
    });
}

function showToast(message, type = "success") {
    let toast = document.querySelector(".toast-notice");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast-notice";
        document.body.appendChild(toast);
    }

    const icon = type === "error" ? "fa-exclamation-circle" : "fa-check-circle";
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    if (type === "error") {
        toast.style.borderLeftColor = "#ef4444";
        toast.querySelector("i").style.color = "#ef4444";
    } else {
        toast.style.borderLeftColor = "#10b981";
        toast.querySelector("i").style.color = "#10b981";
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4500);
}

/* ============================================================
   9. SUBPAGE IMAGE SLIDERS (FOR PORTFOLIO.HTML)
   ============================================================ */
function initSliders() {
    document.querySelectorAll(".project-img-slider").forEach(wrap => {
        const imgs = wrap.querySelectorAll(".slider-img");
        const dots = wrap.querySelectorAll(".sl-dot");
        if (!imgs.length) return;
        let cur = 0;

        function show(idx) {
            if (idx < 0) idx = imgs.length - 1;
            if (idx >= imgs.length) idx = 0;
            cur = idx;
            imgs.forEach((img, i) => img.classList.toggle("active", i === cur));
            dots.forEach((d, i) => d.classList.toggle("active", i === cur));
        }

        wrap.querySelector(".sl-prev")?.addEventListener("click", e => { e.stopPropagation(); show(cur - 1); });
        wrap.querySelector(".sl-next")?.addEventListener("click", e => { e.stopPropagation(); show(cur + 1); });
        dots.forEach((d, i) => d.addEventListener("click", e => { e.stopPropagation(); show(i); }));
    });
}

/* ============================================================
   10. INTERACTIVE WHATSAPP POPUP CHAT WIDGET
   ============================================================ */
function initWhatsAppPopup() {
    const widget = document.getElementById("whatsappWidget");
    const popup = document.getElementById("whatsappChatPopup");
    const floatBtn = document.getElementById("whatsappFloatBtn");
    const closeBtn = document.getElementById("whatsappPopupClose");

    if (!widget || !popup || !floatBtn) return;

    floatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        popup.classList.toggle("active");
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            popup.classList.remove("active");
            sessionStorage.setItem("wa_popup_closed", "true");
        });
    }

    // Auto open popup after 3.5 seconds if user hasn't closed it in this session
    setTimeout(() => {
        if (!sessionStorage.getItem("wa_popup_closed")) {
            popup.classList.add("active");
        }
    }, 3500);

    // Close when clicking outside
    document.addEventListener("click", (e) => {
        if (!widget.contains(e.target)) {
            popup.classList.remove("active");
        }
    });
}
