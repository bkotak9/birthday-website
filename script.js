/* =========================================================
   Happy Birthday, Labdhi — interaction layer (vanilla JS)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initLights();
  initScrollReveal();
  initNextButtons();
  initTypewriter();
  initVerification();
  initGift();
  initStamp();
  initEnvelope();
  initFinalFireworks();
  initParticles();
});

/* ---------------- helpers ---------------- */

function goTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------------- fairy-light progress strand (signature nav) ---------------- */

function initLights() {
  const screens = Array.from(document.querySelectorAll(".screen"));
  const bulbsList = document.getElementById("lights-bulbs");
  const mobileWrap = document.getElementById("lights-mobile");

  screens.forEach((s) => {
    const li = document.createElement("li");
    li.dataset.target = `#${s.id}`;
    li.dataset.label = `${s.dataset.chapter.padStart(2, "0")} · ${s.dataset.label}`;
    li.tabIndex = 0;
    li.addEventListener("click", () => goTo(`#${s.id}`));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") goTo(`#${s.id}`);
    });
    bulbsList.appendChild(li);

    const dot = document.createElement("span");
    mobileWrap.appendChild(dot);
  });

  const bulbs = Array.from(bulbsList.children);
  const mobileDots = Array.from(mobileWrap.children);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const idx = screens.indexOf(entry.target);
          bulbs.forEach((b) => b.classList.remove("active"));
          mobileDots.forEach((d) => d.classList.remove("active"));
          bulbs[idx].classList.add("active");
          mobileDots[idx].classList.add("active");
        }
      });
    },
    { threshold: [0.5] }
  );

  screens.forEach((s) => observer.observe(s));
}

/* ---------------- generic "next" buttons ---------------- */

function initNextButtons() {
  document.querySelectorAll("[data-next]").forEach((btn) => {
    if (btn.id === "open-gift-btn") return; // handled separately (needs confetti timing)
    btn.addEventListener("click", () => goTo(btn.dataset.next));
  });
}

/* ---------------- screen reveal on scroll ---------------- */

function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.25 }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ---------------- screen 1: typewriter ---------------- */

function initTypewriter() {
  const lines = document.querySelectorAll("#s1 .type-line");
  const btn = document.querySelector("#s1 .reveal-btn");
  btn.style.opacity = "0";
  btn.style.pointerEvents = "none";
  btn.style.transition = "opacity 0.6s ease";

  let started = false;

  function typeLine(el, text, speed) {
    return new Promise((resolve) => {
      el.classList.add("typing");
      let i = 0;
      const tick = () => {
        el.textContent = text.slice(0, i);
        i++;
        if (i <= text.length) {
          setTimeout(tick, speed);
        } else {
          el.classList.remove("typing");
          resolve();
        }
      };
      tick();
    });
  }

  async function run() {
    if (started) return;
    started = true;
    for (const line of lines) {
      const text = line.dataset.text;
      if (prefersReducedMotion()) {
        line.textContent = text;
      } else {
        await typeLine(line, text, 42);
      }
      await new Promise((r) => setTimeout(r, 280));
    }
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && run()),
    { threshold: 0.4 }
  );
  observer.observe(document.getElementById("s1"));
}

/* ---------------- screen 2: verification sequence ---------------- */

function initVerification() {
  const items = document.querySelectorAll("#verify-list li");
  const loader = document.getElementById("verify-loader");
  const enterBtn = document.getElementById("enter-btn");
  let started = false;

  function run() {
    if (started) return;
    started = true;
    items.forEach((li) => {
      const delay = prefersReducedMotion() ? 0 : parseInt(li.dataset.delay, 10);
      setTimeout(() => li.classList.add("shown"), delay);
    });
    const loaderDelay = prefersReducedMotion() ? 0 : 2400;
    setTimeout(() => { loader.style.width = "100%"; }, loaderDelay);
    setTimeout(() => { enterBtn.classList.add("shown"); }, loaderDelay + (prefersReducedMotion() ? 0 : 600));
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && run()),
    { threshold: 0.4 }
  );
  observer.observe(document.getElementById("s2"));
}

/* ---------------- screen 3: gift box + confetti + hearts ---------------- */

function initGift() {
  const box = document.getElementById("gift-box");
  const openBtn = document.getElementById("open-gift-btn");
  let opened = false;

  function openGift() {
    if (opened) return;
    opened = true;
    box.classList.add("opened");
    burstConfetti();
    setTimeout(() => goTo("#s4"), prefersReducedMotion() ? 200 : 1200);
  }

  box.addEventListener("click", openGift);
  openBtn.addEventListener("click", openGift);
}

/* ---------------- screen 7: stamp ---------------- */

function initStamp() {
  const stamp = document.getElementById("stamp");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setTimeout(() => stamp.classList.add("stamped"), 350);
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(document.getElementById("s7"));
}

/* ---------------- screen 12: envelope ---------------- */

function initEnvelope() {
  const envelope = document.getElementById("envelope");
  const hint = document.getElementById("envelope-hint");
  envelope.addEventListener("click", () => {
    envelope.classList.toggle("opened");
    hint.classList.toggle("hide", envelope.classList.contains("opened"));
  });
}

/* ---------------- final screen: fireworks (warm palette) ---------------- */

function initFinalFireworks() {
  const canvas = document.getElementById("fireworks-canvas");
  const ctx = canvas.getContext("2d");
  let fired = false;
  let particles = [];
  let rafId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#FF9AA2", "#FFD166", "#CDB4DB", "#FEC8D8"];

  function spawnBurst(x, y) {
    const count = prefersReducedMotion() ? 0 : 36;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 2,
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.life -= 1;
      ctx.globalAlpha = Math.max(p.life / 80, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter((p) => p.life > 0);
    if (particles.length > 0) rafId = requestAnimationFrame(loop);
    else rafId = null;
  }

  function runFireworks() {
    if (fired) return;
    fired = true;
    const w = canvas.width, h = canvas.height;
    const bursts = [[w * 0.3, h * 0.35], [w * 0.7, h * 0.3], [w * 0.5, h * 0.5]];
    bursts.forEach(([x, y], i) => {
      setTimeout(() => {
        spawnBurst(x, y);
        if (!rafId) loop();
      }, i * 450);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && runFireworks()),
    { threshold: 0.5 }
  );
  observer.observe(document.getElementById("s13"));
}

/* ---------------- confetti + heart burst (screen 3) ----------------
   Both effects share one canvas and one draw loop so neither clears
   the other's particles out from under it mid-animation. */

function drawHeart(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.6, s * 0.5, 0, s * 1.3);
  ctx.bezierCurveTo(s * 1.6, s * 0.5, s, -s * 0.6, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

function burstConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (prefersReducedMotion()) return;

  const confettiColors = ["#FF9AA2", "#FEC8D8", "#FFD166", "#CDB4DB", "#FFF8F0"];
  const heartColors = ["#FF9AA2", "#FEC8D8", "#CDB4DB"];
  const originX = canvas.width / 2;
  const originY = canvas.height / 2.3;

  const pieces = [];
  for (let i = 0; i < 130; i++) {
    pieces.push({
      kind: "confetti",
      x: originX, y: originY,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 12 + 4),
      size: 5 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 14,
      life: 130 + Math.random() * 40,
      maxLife: 170,
    });
  }
  for (let i = 0; i < 26; i++) {
    pieces.push({
      kind: "heart",
      x: originX + (Math.random() - 0.5) * 70,
      y: originY,
      vx: (Math.random() - 0.5) * 4,
      vy: -(Math.random() * 4 + 2),
      size: 6 + Math.random() * 6,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      rotation: 0, vr: 0,
      life: 100 + Math.random() * 60,
      maxLife: 160,
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach((p) => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.kind === "heart" ? 0.03 : 0.35;
      p.rotation += p.vr;
      p.life -= 1;
      const alpha = Math.max(p.life / (p.maxLife * 0.4), 0);
      if (p.kind === "heart") {
        drawHeart(ctx, p.x, p.y, p.size, p.color, Math.min(alpha, 1));
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.min(alpha, 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
    });
    if (alive) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  loop();
}

/* ---------------- ambient floating hearts + sparkles ---------------- */

function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawn() {
    const count = window.innerWidth < 700 ? 24 : 46;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 3 + Math.random() * 6,
      speed: 0.12 + Math.random() * 0.28,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: 0.12 + Math.random() * 0.22,
      type: Math.random() < 0.6 ? "heart" : "spark",
      color: Math.random() < 0.5 ? "#FF9AA2" : (Math.random() < 0.5 ? "#CDB4DB" : "#FFD166"),
      sway: Math.random() * Math.PI * 2,
    }));
  }

  resize();
  spawn();
  window.addEventListener("resize", () => { resize(); });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.sway += 0.01;
      p.x += p.drift + Math.sin(p.sway) * 0.15;
      if (p.y < -16) { p.y = canvas.height + 16; p.x = Math.random() * canvas.width; }

      if (p.type === "heart") {
        drawHeart(ctx, p.x, p.y, p.r, p.color, p.alpha);
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    requestAnimationFrame(loop);
  }

  if (!prefersReducedMotion()) loop();
}
