"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const portfolioLink = document.querySelector(
    '.navigation-links a[href="#portfolio"]'
  );

  if (!portfolioLink) {
    return;
  }

  portfolioLink.addEventListener("click", () => {
    console.log("Portfolio section opened.");
  });
});
