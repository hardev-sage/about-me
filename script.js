"use strict";

const characterModes = {
  build: {
    caption: "Build mode: turning a random idea into something that runs.",
    stats: { build: 100, curious: 80, chaos: 40 },
  },
  debug: {
    caption: "Debug mode: asking why it worked yesterday.",
    stats: { build: 60, curious: 100, chaos: 100 },
  },
  explore: {
    caption: "Explore mode: reading, wandering and collecting new ideas.",
    stats: { build: 40, curious: 100, chaos: 70 },
  },
};

const skillNames = {
  "game-dev": "Game dev",
  "3d-cad": "3D CAD",
  "simulation": "Simulation",
  "debugging": "Debugging",
  "web-dev": "Web dev",
};

const maxScoops = 3;

function initCharacterModes() {
  const card = document.querySelector("#character-card");
  if (!card) return;

  const caption = card.querySelector(".mode-caption");
  const buttons = card.querySelectorAll(".mode-button");

  card.querySelector(".mode-switch").hidden = false;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = characterModes[button.dataset.mode];

      card.dataset.mode = button.dataset.mode;
      caption.textContent = mode.caption;
      buttons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));

      card.querySelectorAll(".stat-row").forEach((row) => {
        const value = `${mode.stats[row.dataset.stat]}%`;
        row.style.setProperty("--stat-value", value);
        row.querySelector(".stat-value").textContent = value;
      });
    });
  });
}

function initSkillCone() {
  const cone = document.querySelector("#skill-cone");
  if (!cone) return;

  const toggles = document.querySelectorAll(".skill-toggle");
  const scoops = cone.querySelectorAll(".scoop");
  const cherry = cone.querySelector(".cone-cherry");
  const readout = cone.querySelector(".tool-readout");
  const mailLink = cone.querySelector(".cone-mail-link");
  const picks = [];

  function describeCone() {
    if (picks.length === 0) return "Pick up to three skills to stack your cone.";
    const names = picks.map((skill) => skillNames[skill]).join(", ");
    if (picks.length === maxScoops) return `Cone full: ${names}. Cherry on top.`;
    return `Your cone: ${names}. ${picks.length} of ${maxScoops} scoops.`;
  }

  function render(addedIndex) {
    scoops.forEach((scoop, index) => {
      const skill = picks[index];
      scoop.classList.remove("is-new");
      scoop.classList.toggle("is-empty", !skill);
      if (skill) {
        scoop.dataset.skill = skill;
      } else {
        delete scoop.dataset.skill;
      }
    });

    if (addedIndex !== undefined) {
      scoops[addedIndex].getBoundingClientRect();
      scoops[addedIndex].classList.add("is-new");
    }

    toggles.forEach((toggle) => {
      const selected = picks.includes(toggle.dataset.skill);
      toggle.setAttribute("aria-pressed", String(selected));
      toggle.closest(".manga-card").classList.toggle("is-selected", selected);
      toggle.disabled = !selected && picks.length === maxScoops;
    });

    const subject = picks.length
      ? `Let's build: ${picks.map((skill) => skillNames[skill]).join(" + ")}`
      : "Hello from your website";

    cherry.classList.toggle("is-empty", picks.length < maxScoops);
    readout.textContent = describeCone();
    mailLink.href = `mailto:${mailLink.dataset.email}?subject=${encodeURIComponent(subject)}`;
  }

  toggles.forEach((toggle) => {
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      const index = picks.indexOf(toggle.dataset.skill);

      if (index === -1) {
        picks.push(toggle.dataset.skill);
        render(picks.length - 1);
      } else {
        picks.splice(index, 1);
        render();
      }
    });
  });

  cone.hidden = false;
  render();
}

function initHobbyRoll() {
  const panel = document.querySelector("#hobby-roll");
  if (!panel) return;

  const cards = Array.from(document.querySelectorAll(".hobby-grid .manga-card"));
  const result = panel.querySelector(".tool-readout");
  let current = null;

  panel.hidden = false;
  panel.querySelector("button").addEventListener("click", () => {
    const options = cards.filter((card) => card !== current);
    current = options[Math.floor(Math.random() * options.length)];
    cards.forEach((card) => card.classList.toggle("is-picked", card === current));
    result.textContent = `Tonight: ${current.querySelector("h2").textContent}.`;
    current.scrollIntoView({ block: "center" });
  });
}

function initCountdown() {
  const days = document.querySelector("[data-days-until-2028]");
  if (!days) return;

  const millisecondsPerDay = 86400000;
  const remaining = Math.ceil((new Date(2028, 0, 1) - new Date()) / millisecondsPerDay);

  days.textContent = Math.max(0, remaining).toLocaleString();
  days.closest(".countdown").hidden = false;
}

function initCopyButton() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    const status = button.parentElement.querySelector(".copy-status");

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        status.textContent = "Email copied.";
      } catch {
        status.textContent = "Copy failed. Select the address manually.";
      }
    });
  });
}

function initMangaMode() {
  const trigger = "manga";
  const toast = document.createElement("p");
  let typed = "";

  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.append(toast);

  document.addEventListener("keydown", (event) => {
    const ignored = event.target.closest("input, textarea") || event.ctrlKey || event.metaKey || event.altKey;
    if (ignored || event.key.length !== 1) return;

    typed = (typed + event.key.toLowerCase()).slice(-trigger.length);
    if (typed !== trigger) return;

    document.body.classList.add("manga-mode");
    toast.textContent = "Manga mode on.";
    toast.classList.add("is-visible");

    setTimeout(() => {
      document.body.classList.remove("manga-mode");
      toast.classList.remove("is-visible");
    }, 1800);
  });
}

initCharacterModes();
initSkillCone();
initHobbyRoll();
initCountdown();
initCopyButton();
initMangaMode();
