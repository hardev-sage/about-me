"use strict";

(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /* ---------- Intro screen: once per session, click or key to skip ---------- */

  function initIntro() {
    const intro = $(".intro-screen");
    if (!intro) return;

    const hide = () => intro.classList.add("is-hidden");

    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch (error) {
      /* storage can be blocked; just show the intro */
    }

    if (seen || reduceMotion) {
      hide();
      return;
    }

    intro.addEventListener("click", hide);
    document.addEventListener("keydown", hide, { once: true });
    setTimeout(hide, 2400);
  }

  /* ---------- Navigation: active link + mobile menu ---------- */

  function normalise(path) {
    return path.replace(/index\.html$/, "").replace(/\.html$/, "").replace(/\/$/, "") || "/";
  }

  function initNav() {
    const here = normalise(window.location.pathname);

    $$(".nav-links a").forEach((link) => {
      const active = normalise(link.pathname) === here;
      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const header = $(".site-header");
    const toggle = $(".nav-toggle");
    if (!header || !toggle) return;

    const setOpen = (open) => {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("nav-open"));
    });

    $$(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
  }

  /* ---------- Pointer effects: cursor glow, hover size, hero parallax ---------- */

  function initPointerEffects() {
    if (!finePointer || reduceMotion) return;

    let glow = $(".cursor-glow");
    if (!glow) {
      glow = document.createElement("div");
      glow.className = "cursor-glow";
      glow.setAttribute("aria-hidden", "true");
      document.body.appendChild(glow);
    }

    // Uses `translate` (not `transform`) because the hero's entrance animation
    // keeps control of `transform` after it finishes.
    const heroArt = $(".hero-illustration");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let glowX = targetX;
    let glowY = targetY;
    let running = false;

    const tick = () => {
      glowX += (targetX - glowX) * 0.14;
      glowY += (targetY - glowY) * 0.14;

      glow.style.translate = `${glowX}px ${glowY}px`;

      if (heroArt) {
        const px = (glowX / window.innerWidth - 0.5) * 12;
        const py = (glowY / window.innerHeight - 0.5) * 12;
        heroArt.style.translate = `${px}px ${py}px`;
      }

      // stop the loop once the glow has caught up, so an idle page costs nothing
      if (Math.abs(targetX - glowX) > 0.4 || Math.abs(targetY - glowY) > 0.4) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    document.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;

        document.body.classList.add("cursor-active");

        if (!running) {
          running = true;
          requestAnimationFrame(tick);
        }
      },
      { passive: true }
    );

    const interactive = "a, button, .comic-panel, .character-card, .skill-card";

    document.addEventListener("pointerover", (event) => {
      document.body.classList.toggle("cursor-hover", Boolean(event.target.closest(interactive)));
    });

    document.documentElement.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-active", "cursor-hover");
    });
  }

  /* ---------- Scroll reveal ---------- */

  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const items = $$(
      ".comic-panel, .quote-panel, .blueprint-strip, .skill-card, .road-step, " +
      ".contact-card, .blueprint-note, .contact-note, .construction-box"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const item = entry.target;
          item.classList.add("revealed");
          observer.unobserve(item);

          // hand control back to the element's own hover styles once it has landed
          setTimeout(() => {
            item.classList.remove("reveal-ready", "revealed");
            item.style.transitionDelay = "";
          }, 1100);
        });
      },
      { threshold: 0.12 }
    );

    const seen = new Map();

    items.forEach((item) => {
      const index = seen.get(item.parentElement) || 0;
      seen.set(item.parentElement, index + 1);

      item.style.transitionDelay = `${Math.min(index, 3) * 90}ms`;
      item.classList.add("reveal-ready");
      observer.observe(item);
    });
  }

  /* ---------- Small helpers ---------- */

  let toastTimer;

  function showToast(message) {
    let toast = $(".toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    const ok = document.execCommand("copy");
    field.remove();

    if (!ok) throw new Error("copy failed");
  }

  function initCopyButtons() {
    $$("[data-copy]").forEach((button) => {
      const status = button.parentElement && $(".copy-status", button.parentElement);

      button.addEventListener("click", async () => {
        let message;

        try {
          await copyText(button.dataset.copy);
          message = "COPIED!";
        } catch (error) {
          message = "COPY FAILED - SELECT IT MANUALLY";
        }

        if (status) status.textContent = message;
        setTimeout(() => {
          if (status) status.textContent = "";
        }, 2500);
      });
    });
  }

  function initYear() {
    $$("[data-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Easter egg: type "manga" ---------- */

  function initEasterEgg() {
    const sequence = "manga";
    let typed = "";

    document.addEventListener("keydown", (event) => {
      const tag = event.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;

      typed = (typed + event.key.toLowerCase()).slice(-sequence.length);

      if (typed !== sequence) return;

      typed = "";
      document.body.classList.add("manga-mode");
      showToast("MANGA MODE ACTIVATED");

      setTimeout(() => document.body.classList.remove("manga-mode"), 1800);
    });
  }

  /* ---------- Start ---------- */

  function init() {
    initIntro();
    initNav();
    initPointerEffects();
    initReveal();
    initCopyButtons();
    initYear();
    initEasterEgg();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
