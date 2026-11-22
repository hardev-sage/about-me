"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const cursorGlow =
    document.querySelector(".cursor-glow");

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

      currentX +=
        (mouseX - currentX) * 0.12;

      currentY +=
        (mouseY - currentY) * 0.12;

      cursorGlow.style.left =
        `${currentX}px`;

      cursorGlow.style.top =
        `${currentY}px`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }


  const currentPage =
    window.location.pathname
      .split("/")
      .pop() || "index.html";

  document
    .querySelectorAll(".nav-links a")
    .forEach((link) => {

      const target =
        link.getAttribute("href");

      if (target === currentPage) {
        link.classList.add("active");
      }

    });

  document
    .querySelectorAll(
      "a, button, .comic-panel, .character-card"
    )
    .forEach((element) => {

      element.addEventListener("mouseenter", () => {
        document.body.classList.add(
          "cursor-hover"
        );
      });

      element.addEventListener("mouseleave", () => {
        document.body.classList.remove(
          "cursor-hover"
        );
      });

    });
  document
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "pointerdown",
        () => {

          link.style.transform =
            "translateY(3px) scale(0.96)";

        }
      );

      link.addEventListener(
        "pointerup",
        () => {

          link.style.transform = "";

        }
      );

      link.addEventListener(
        "pointerleave",
        () => {

          link.style.transform = "";

        }
      );

    });
  const heroArt =
    document.querySelector(".hero-illustration");

  if (heroArt &&
      window.matchMedia("(pointer: fine)").matches) {

    document.addEventListener(
      "pointermove",
      (event) => {

        const x =
          (event.clientX /
            window.innerWidth -
            0.5) * 10;

        const y =
          (event.clientY /
            window.innerHeight -
            0.5) * 10;

        heroArt.style.transform =
          `translate(${x}px, ${y}px)`;

      }
    );

  }

  const revealItems =
    document.querySelectorAll(
      ".comic-panel, .quote-panel, .blueprint-strip"
    );

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "revealed"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );

    revealItems.forEach((item) => {

      item.classList.add("reveal-ready");

      observer.observe(item);

    });

  }
  let secret = "";

  const sequence =
    "manga";

  document.addEventListener(
    "keydown",
    (event) => {

      secret +=
        event.key.toLowerCase();

      if (secret.length > sequence.length) {
        secret =
          secret.slice(-sequence.length);
      }

      if (secret === sequence) {

        document.body.classList.add(
          "manga-mode"
        );

        setTimeout(() => {

          document.body.classList.remove(
            "manga-mode"
          );

        }, 1800);

        secret = "";

      }

    }
  );

});
