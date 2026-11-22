"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const navigationLinks = document.querySelectorAll(".navigation-links a");
  const panels = document.querySelectorAll(".manga-panel");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.dataset.activeSection =
        link.getAttribute("href");
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener("pointerenter", () => {
      panel.dataset.hovered = "true";
    });

    panel.addEventListener("pointerleave", () => {
      delete panel.dataset.hovered;
    });
  });

  const portfolioTarget = document.querySelector("#portfolio");

  if (portfolioTarget) {
    const observer = new MutationObserver(() => {
      if (window.location.hash === "#portfolio") {
        portfolioTarget.classList.add("is-active");
      }
    });

    observer.observe(portfolioTarget, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#portfolio") {
      document.body.dataset.activeSection = "#portfolio";
    }
  });
});
