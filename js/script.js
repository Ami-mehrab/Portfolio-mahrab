"use strict";

// ===== THEME TOGGLE =====
function initTheme() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const icon = btn.querySelector("i");
    const saved = localStorage.getItem("theme") || "dark";
    if (saved === "light") { document.body.classList.add("light-mode"); icon.classList.replace("fa-moon","fa-sun"); }
    btn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        icon.classList.replace(isLight?"fa-moon":"fa-sun", isLight?"fa-sun":"fa-moon");
        localStorage.setItem("theme", isLight?"light":"dark");
    });
}

// ===== MOBILE MENU =====
function initMenu() {
    const ham = document.getElementById("hamburger");
    const nav = document.getElementById("navLinks");
    if (!ham || !nav) return;
    ham.addEventListener("click", (e) => { e.stopPropagation(); ham.classList.toggle("active"); nav.classList.toggle("active"); });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { ham.classList.remove("active"); nav.classList.remove("active"); }));
    document.addEventListener("click", (e) => { if (!ham.contains(e.target) && !nav.contains(e.target)) { ham.classList.remove("active"); nav.classList.remove("active"); } });
}

// ===== HEADER HIDE ON SCROLL =====
function initHeader() {
    const header = document.getElementById("header");
    if (!header) return;
    let last = 0;
    window.addEventListener("scroll", () => {
        const cur = window.scrollY;
        header.classList.toggle("hide", cur > last && cur > 200);
        last = cur;
    }, { passive: true });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnim() {
    const els = document.querySelectorAll("[data-animate], [data-animate-delay]");
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
}

// ===== BACK TO TOP =====
function initBackToTop() {
    let btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 400), { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ===== TYPING EFFECT =====
function initTyping() {
    const el = document.getElementById("typingText");
    if (!el) return;
    const text = "Mahrab Hossen";
    let i = 0, deleting = false, speed = 120;
    function tick() {
        if (!deleting) {
            el.textContent = text.slice(0, i + 1);
            i++;
            if (i === text.length) { deleting = true; speed = 2200; }
            else { speed = 120; }
        } else {
            el.textContent = text.slice(0, i - 1);
            i--;
            if (i === 0) { deleting = false; speed = 500; }
            else { speed = 70; }
        }
        setTimeout(tick, speed);
    }
    setTimeout(tick, 600);
}

// ===== PROJECT IMAGE SLIDERS =====
function initSliders() {
    document.querySelectorAll(".project-img-slider").forEach(wrap => {
        const imgs = wrap.querySelectorAll(".slider-img");
        const dots = wrap.querySelectorAll(".sl-dot");
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

// ===== CONTACT FORM =====
function initForm() {
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    if (!form || !submitBtn) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validateForm(form)) return;
        const orig = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';
        submitBtn.disabled = true;
        try {
            const data = Object.fromEntries(new FormData(form));
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (res.status === 200) { window.location.href = "thankyou.html"; }
            else { showNotification(json.message || "Something went wrong!", "error"); }
        } catch { showNotification("Network error. Please email me directly.", "error"); }
        finally { submitBtn.innerHTML = orig; submitBtn.disabled = false; }
    });

    // Real-time validation
    form.querySelectorAll("input, textarea").forEach(f => {
        f.addEventListener("blur", () => validateField(f));
        f.addEventListener("input", () => { if (f.dataset.touched) validateField(f); });
        f.addEventListener("blur", () => { f.dataset.touched = "1"; });
    });
}

function validateForm(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach(f => { if (!validateField(f)) valid = false; });
    return valid;
}

function validateField(f) {
    const v = f.value.trim();
    let ok = true, msg = "";
    if (f.required && !v) { ok = false; msg = "This field is required."; }
    else if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { ok = false; msg = "Enter a valid email."; }
    const existing = f.parentElement.querySelector(".error-msg");
    if (existing) existing.remove();
    if (!ok) {
        f.style.borderColor = "#ef4444";
        const err = document.createElement("span");
        err.className = "error-msg"; err.textContent = msg;
        f.parentElement.appendChild(err);
    } else { f.style.borderColor = ""; }
    return ok;
}

function showNotification(msg, type = "info") {
    document.querySelector(".notification")?.remove();
    const n = document.createElement("div");
    n.className = `notification notif-${type}`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = "0"; n.style.transition = "opacity 0.3s"; setTimeout(() => n.remove(), 300); }, 5000);
}

// ===== INIT =====
function init() {
    initTheme();
    initMenu();
    initHeader();
    initScrollAnim();
    initBackToTop();
    initTyping();
    initSliders();
    initForm();

    // External links
    document.querySelectorAll('a[href^="http"]').forEach(a => {
        if (!a.target) a.target = "_blank";
        if (!a.rel) a.rel = "noopener noreferrer";
    });
}

document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();