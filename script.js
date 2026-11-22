"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const navigationLinks = document.querySelectorAll(".navigation-links a");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.dataset.activeSection = link.getAttribute("href");
    });
  });
});
