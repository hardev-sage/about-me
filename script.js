"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navigationLinks = document.querySelectorAll(".navigation-links a");

  navigationLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }

    link.addEventListener("click", () => {
      document.body.classList.add("page-transition");
    });
  });

  const buttons = document.querySelectorAll(".manga-button, .quick-panel");

  buttons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      button.style.setProperty("--mouse-x", `${x}px`);
      button.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        link.classList.add("keyboard-hit");

        setTimeout(() => {
          link.classList.remove("keyboard-hit");
        }, 250);
      }
    });
  });
});
