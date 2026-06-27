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
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || "";
  if (isNaN(target)) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
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
    setTimeout(() => { fill.style.width = w + "%"; }, 80);
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
if (hackSection) hackObserver.observe(hackSection);

function setupHeroParticles() {
  const hero = document.querySelector(".hero");
  const canvas = document.getElementById("hero-particles");
  if (!hero || !canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  let width = 0;
  let height = 0;
  const particleCount = 60;
  const maxDistance = 120;
  const repelDistance = 100;
  const particles = [];
  let mouseX = null;
  let mouseY = null;

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 0.6 - 0.3),
        vy: (Math.random() * 0.6 - 0.3),
        radius: 1.5 + Math.random() * 1.5,
      });
    }
  }

  function updateParticles() {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x <= 2 || particle.x >= width - 2) particle.vx *= -1;
      if (particle.y <= 2 || particle.y >= height - 2) particle.vy *= -1;

      if (mouseX !== null && mouseY !== null) {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < repelDistance) {
          const push = (repelDistance - dist) / repelDistance * 0.08;
          particle.vx += (dx / dist) * push;
          particle.vy += (dy / dist) * push;
        }
      }

      particle.vx = Math.max(-0.55, Math.min(0.55, particle.vx));
      particle.vy = Math.max(-0.55, Math.min(0.55, particle.vy));
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    for (let i = 0; i < particleCount; i += 1) {
      for (let j = i + 1; j < particleCount; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.18})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
  }

  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });

  hero.addEventListener("mouseleave", () => {
    mouseX = null;
    mouseY = null;
  });

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  requestAnimationFrame(animate);
}

setupHeroParticles();