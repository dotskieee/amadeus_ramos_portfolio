/* ==========================================================================
   Portfolio script (vanilla JavaScript, no dependencies)
   ========================================================================== */

/* --------------------------------------------------------------------------
   CUSTOMIZE: the only setting you need to change in this file.
   1. Save your resume as  assets/documents/resume.pdf
   2. Change hasResume to true
   -------------------------------------------------------------------------- */
const CONFIG = {
  hasResume: false,
  resumePath: "assets/documents/resume.pdf",
};

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4500);
  }

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: scrolled state ---------- */
  const header = $(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $(".menu-toggle");
  const nav = $("#site-nav");
  const mobileQuery = window.matchMedia("(max-width: 920px)");

  function setMenu(open, returnFocus) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, true);
    });
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !e.target.closest(".site-header")) setMenu(false);
    });
    const onBreakpoint = (e) => { if (!e.matches) setMenu(false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", onBreakpoint);
    else mobileQuery.addListener(onBreakpoint);
  }

  /* ---------- Active section highlight ---------- */
  const navLinks = $$("[data-nav]");
  const sectionIds = navLinks.map((a) => a.dataset.nav);
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  function setActive(id) {
    navLinks.forEach((a) => {
      if (a.dataset.nav === id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  function updateActive() {
    // The active section is the last one whose top has passed the line just under the header.
    const line = window.innerHeight * 0.35;
    let current = sections.length ? sections[0].id : "";
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= line) current = s.id;
    });
    // The resume block sits between Experience and Contact and has no nav item.
    const resume = document.getElementById("resume");
    if (resume && current === "experience" && resume.getBoundingClientRect().top <= line) current = "";
    // At the very bottom of the page, highlight the last item.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    setActive(current);
  }
  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);

  /* ---------- Entrance reveal (subtle, once) ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Hero pointer glow (skipped for reduced motion and touch) ---------- */
  const hero = $(".hero");
  const heroBg = $(".hero-bg");
  if (hero && heroBg && !reducedMotion.matches && window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      heroBg.style.setProperty("--mx", e.clientX - r.left + "px");
      heroBg.style.setProperty("--my", e.clientY - r.top + "px");
      heroBg.style.setProperty("--glow-on", "1");
    });
    hero.addEventListener("pointerleave", () => heroBg.style.setProperty("--glow-on", "0"));
  }

  /* ---------- Placeholder links ----------
     Any external link whose address is still "#" or contains "YOUR-" is a placeholder.
     Instead of going nowhere, it tells the visitor (you) what to replace. */
  $$("a[data-ext]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href === "#" || /YOUR-/i.test(href)) {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("This is a placeholder link. Replace its address in index.html.");
      });
      a.removeAttribute("target");
    }
  });

  /* ---------- Resume ---------- */
  const resumeButtons = $$("[data-resume]");
  const resumeNote = $("[data-resume-note]");
  if (CONFIG.hasResume) {
    resumeButtons.forEach((a) => {
      a.setAttribute("href", CONFIG.resumePath);
      a.setAttribute("download", "");
    });
  } else {
    resumeButtons.forEach((a) => {
      a.removeAttribute("download");
      if (a.dataset.resume === "nav") {
        // The header button leads to the Resume section, which explains what is missing.
        a.setAttribute("href", "#resume");
      } else {
        a.removeAttribute("href");
        a.setAttribute("role", "link");
        a.setAttribute("aria-disabled", "true");
        a.setAttribute("tabindex", "0");
        a.classList.add("is-disabled");
        const notice = () => showToast("Resume not added yet. See the note under this button.");
        a.addEventListener("click", (e) => { e.preventDefault(); notice(); });
        a.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); notice(); }
        });
      }
    });
    if (resumeNote) resumeNote.hidden = false;
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  const form = $("#contact-form");
  if (form) {
    const emailLink = $("[data-contact-email]");
    const fields = {
      name: $("#cf-name"),
      email: $("#cf-email"),
      message: $("#cf-message"),
    };
    const errors = {
      name: $("#cf-name-err"),
      email: $("#cf-email-err"),
      message: $("#cf-message-err"),
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate() {
      const results = {
        name: fields.name.value.trim().length > 0,
        email: emailPattern.test(fields.email.value.trim()),
        message: fields.message.value.trim().length > 0,
      };
      let firstInvalid = null;
      Object.keys(results).forEach((key) => {
        const ok = results[key];
        fields[key].setAttribute("aria-invalid", String(!ok));
        if (ok) {
          fields[key].removeAttribute("aria-describedby");
        } else {
          fields[key].setAttribute("aria-describedby", errors[key].id);
          if (!firstInvalid) firstInvalid = fields[key];
        }
        errors[key].hidden = ok;
      });
      return firstInvalid;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstInvalid = validate();
      if (firstInvalid) { firstInvalid.focus(); return; }

      const to = emailLink ? emailLink.getAttribute("href").replace(/^mailto:/i, "") : "";
      const subject = "Portfolio message from " + fields.name.value.trim();
      const body = fields.message.value.trim() + "\n\n" + fields.name.value.trim() + "\n" + fields.email.value.trim();
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      showToast("Opening your email app. If nothing opens, email me directly using the address above.");
    });

    // Clear an error as soon as the field becomes valid
    Object.keys(fields).forEach((key) => {
      fields[key].addEventListener("input", () => {
        if (fields[key].getAttribute("aria-invalid") === "true") validate();
      });
    });
  }
})();
