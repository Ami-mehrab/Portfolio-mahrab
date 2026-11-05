/**
 * MAHRAB HOSSEN PORTFOLIO — script.js
 * Clean, lightweight vanilla JS for animations & interactivity
 */

document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileMenu();
    initScrollSpy();
    initCounters();
    initSkillsAnimation();
    initPortfolioFilter();
    initResumeModal();
    initContactForm();
    initBackToTop();
    initSliders();
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

/* ============================================================
   2. MOBILE MENU & SMOOTH SCROLLING
   ============================================================ */
function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link, .btn-nav");

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
                <div style="font-family: inherit;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 0.8rem;">
                        <div>
                            <h4 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">Mahrab Hossen</h4>
                            <p style="color: #ea580c; font-weight: 700; font-size: 1rem;">Full-Stack Software Engineer | PHP · Laravel · MySQL</p>
                            <p style="color: #64748b; font-size: 0.88rem;">Uttara, Dhaka, Bangladesh · 01950047492 · mahrabbappy33@gmail.com</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <h5 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Professional Summary</h5>
                        <p style="color: #475569; font-size: 0.94rem; line-height: 1.7;">
                            Full-Stack Software Engineer with over a year of experience building and maintaining web-based business applications using <strong>PHP, Laravel and MySQL</strong>, including ERP, SaaS and role-based systems. Skilled in database design, RESTful and third-party API integration, n8n automation and AI-integrated solutions. Working knowledge of Vue.js and Inertia.js, with experience taking features from requirements and database design through development, testing and continuous improvement.
                        </p>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <h5 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em;">Work Experience</h5>
                        <div style="background: #f8fafc; padding: 1.15rem; border-radius: 10px; border: 1px solid #eef2f6; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
                                <strong style="color: #0f172a; font-size: 1.05rem;">Software Engineer</strong>
                                <span style="font-size: 0.84rem; color: #ea580c; font-weight: 700;">October 1, 2025 – Present</span>
                            </div>
                            <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 0.5rem;">eGeneration PLC, Kuril, Dhaka, Bangladesh</p>
                            <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: #475569; line-height: 1.6;">
                                <li>Work with the AI team to research AI use cases, evaluate technologies and support proof-of-concept development.</li>
                                <li>Test and integrate third-party APIs to deliver reliable AI-powered application features.</li>
                                <li>Actively develop and continuously enhance AI-integrated solutions, including the live <strong>eGInterview</strong> and <strong>eGSales-AI</strong> platforms.</li>
                            </ul>
                        </div>
                        <div style="background: #f8fafc; padding: 1.15rem; border-radius: 10px; border: 1px solid #eef2f6;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
                                <strong style="color: #0f172a; font-size: 1.05rem;">Intern (PHP)</strong>
                                <span style="font-size: 0.84rem; color: #64748b; font-weight: 600;">July 1, 2025 – September 30, 2025</span>
                            </div>
                            <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 0.5rem;">eGeneration PLC, Kuril, Dhaka, Bangladesh</p>
                            <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: #475569; line-height: 1.6;">
                                <li>Developed and maintained web applications using PHP/Laravel and MySQL.</li>
                                <li>Implemented REST APIs and role-based authentication for system users.</li>
                                <li>Managed version control and collaborated on full-stack development using Git.</li>
                            </ul>
                        </div>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <h5 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em;">Technical Skills</h5>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
                            <div style="background: #f8fafc; padding: 0.85rem; border-radius: 8px; border: 1px solid #eef2f6;">
                                <strong style="color: #0f172a; font-size: 0.88rem; display: block;">Backend</strong>
                                <span style="font-size: 0.82rem; color: #64748b;">PHP (Laravel, CakePHP), OOP, RESTful API development, RBAC</span>
                            </div>
                            <div style="background: #f8fafc; padding: 0.85rem; border-radius: 8px; border: 1px solid #eef2f6;">
                                <strong style="color: #0f172a; font-size: 0.88rem; display: block;">Databases</strong>
                                <span style="font-size: 0.82rem; color: #64748b;">MySQL (schema design, query optimization), PostgreSQL, SQL Server</span>
                            </div>
                            <div style="background: #f8fafc; padding: 0.85rem; border-radius: 8px; border: 1px solid #eef2f6;">
                                <strong style="color: #0f172a; font-size: 0.88rem; display: block;">Automation & AI</strong>
                                <span style="font-size: 0.82rem; color: #64748b;">n8n workflows, Gemini Live API, Google Custom Search API, PoC</span>
                            </div>
                            <div style="background: #f8fafc; padding: 0.85rem; border-radius: 8px; border: 1px solid #eef2f6;">
                                <strong style="color: #0f172a; font-size: 0.88rem; display: block;">Frontend & Tools</strong>
                                <span style="font-size: 0.82rem; color: #64748b;">JavaScript, TypeScript, React, Vue.js, Inertia.js, HTML5, CSS3, Git</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        academic: {
            title: "Academic Background — Mahrab Hossen",
            html: `
                <div style="font-family: inherit;">
                    <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.5rem; background: #fff5ed; padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(234, 88, 12, 0.2);">
                        <div style="width: 44px; height: 44px; border-radius: 10px; background: #ea580c; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h4 style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">B.Sc. in Computer Science &amp; Engineering</h4>
                            <p style="color: #ea580c; font-weight: 600; font-size: 0.95rem;">International University of Business Agriculture and Technology (IUBAT)</p>
                            <p style="color: #64748b; font-size: 0.88rem;">Passing Year: 2020 – 2025 · CGPA: <strong style="color: #0f172a;">3.20</strong> / 4.00</p>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #eef2f6;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                <strong style="color: #0f172a;">Higher Secondary School Certificate (HSC)</strong>
                                <span style="font-size: 0.82rem; color: #ea580c; font-weight: 700;">2019</span>
                            </div>
                            <p style="font-size: 0.88rem; color: #64748b;">Tongi Government College, Dhaka, Bangladesh</p>
                        </div>
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #eef2f6;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                <strong style="color: #0f172a;">Secondary School Certificate (SSC)</strong>
                                <span style="font-size: 0.82rem; color: #ea580c; font-weight: 700;">2017</span>
                            </div>
                            <p style="font-size: 0.88rem; color: #64748b;">Tamirul Millat Kamil Madrasah, Dhaka, Bangladesh · GPA: <strong style="color: #0f172a;">4.89</strong></p>
                        </div>
                    </div>

                    <h5 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; text-transform: uppercase;">Languages:</h5>
                    <p style="font-size: 0.92rem; color: #475569;">
                        <strong>Bangla:</strong> Native proficiency &nbsp;·&nbsp;
                        <strong>English:</strong> Fluent (listening, speaking, reading, writing) &nbsp;·&nbsp;
                        <strong>Arabic:</strong> Fluent reading &amp; writing, basic speaking
                    </p>
                </div>
            `
        },
        cert: {
            title: "AI & Automation Specializations — Mahrab Hossen",
            html: `
                <div style="font-family: inherit;">
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: #f8fafc; border: 1px solid #eef2f6; border-radius: 10px; padding: 1.15rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                <strong style="color: #0f172a; font-size: 1rem;">Gemini Live API &amp; Voice Intelligence Systems</strong>
                                <span style="font-size: 0.78rem; font-weight: 700; color: #10b981; background: #ecfdf5; padding: 0.2rem 0.5rem; border-radius: 4px;">Live Implementation</span>
                            </div>
                            <p style="color: #64748b; font-size: 0.88rem; line-height: 1.6;">
                                Engineered the voice engine for the live <strong>eGInterview platform</strong>: real-time bilingual Bengali-English voice interviews, speaker transcription, structured assessment, and loan analyst evaluation.
                            </p>
                        </div>

                        <div style="background: #f8fafc; border: 1px solid #eef2f6; border-radius: 10px; padding: 1.15rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                <strong style="color: #0f172a; font-size: 1rem;">n8n Workflow Automation &amp; Prospecting Pipelines</strong>
                                <span style="font-size: 0.78rem; font-weight: 700; color: #3b82f6; background: #eff6ff; padding: 0.2rem 0.5rem; border-radius: 4px;">Production Pipeline</span>
                            </div>
                            <p style="color: #64748b; font-size: 0.88rem; line-height: 1.6;">
                                Built automated end-to-end multi-step pipelines for <strong>eGSales-AI</strong>: integrated Google Custom Search API for targeted profile discovery, JavaScript batch deduplication, data cleaning, and automated email outreach.
                            </p>
                        </div>

                        <div style="background: #f8fafc; border: 1px solid #eef2f6; border-radius: 10px; padding: 1.15rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                <strong style="color: #0f172a; font-size: 1rem;">Full-Stack PHP, Laravel &amp; MySQL Engineering</strong>
                                <span style="font-size: 0.78rem; font-weight: 700; color: #8b5cf6; background: #f5f3ff; padding: 0.2rem 0.5rem; border-radius: 4px;">Core Specialty</span>
                            </div>
                            <p style="color: #64748b; font-size: 0.88rem; line-height: 1.6;">
                                Comprehensive production experience in relational database optimization, schema design, role-based access control, RESTful APIs, and modern frontends with Vue/Inertia/React.
                            </p>
                        </div>
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
