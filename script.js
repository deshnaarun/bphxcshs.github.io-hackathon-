// Hackathon tab switching
document.querySelectorAll(".hack-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    document.querySelectorAll(".hack-tab").forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".hack-panel").forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    const panel = document.getElementById(`tab-${target}`);
    if (panel) {
      panel.classList.add("active");
      if (target === "outcomes") animateMeterFills();
    }
  });
});

// Timeline accordion
document.querySelectorAll(".timeline-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    const body = btn.nextElementSibling;
    if (body) body.classList.toggle("open", !expanded);
  });
});

// Animate stat counters when section scrolls into view
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = "1";

  const target = Number.parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";

  if (Number.isNaN(target)) return;

  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));

  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = prefix + current + suffix;
    if (current < target) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// Animate progress meter fills
function animateMeterFills() {
  document.querySelectorAll(".meter-fill").forEach((fill) => {
    if (fill.dataset.animated) return;
    fill.dataset.animated = "1";
    const w = fill.dataset.width || "0";
    setTimeout(() => {
      fill.style.width = `${w}%`;
    }, 80);
  });
}

const hackObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll(".stat-num[data-target]").forEach(animateCounter);
    const activePanel = entry.target.querySelector(".hack-panel.active");
    if (activePanel && activePanel.id === "tab-outcomes") animateMeterFills();
  });
}, { threshold: 0.15 });

const hackSection = document.querySelector(".hackathon-section");
if (hackSection && "IntersectionObserver" in window) {
  hackObserver.observe(hackSection);
}
