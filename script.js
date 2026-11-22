"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let currentX = mouseX;
    let currentY = mouseY;

    document.addEventListener("pointermove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      document.body.classList.add("cursor-active");
    });

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document
    .querySelectorAll(".navigation-links a")
    .forEach((link) => {
      const target = link.getAttribute("href");

      if (target === currentPage) {
        link.classList.add("active");
      }
    });

  document
    .querySelectorAll("a[href]")
    .forEach((link) => {
      link.addEventListener("pointerdown", () => {
        link.style.transform = "translateY(2px) scale(0.97)";

        setTimeout(() => {
          link.style.transform = "";
        }, 150);
      });
    });
});
