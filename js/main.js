"use strict";
document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Chrome orb: a 2D take on the Assistant S voice orb. It breathes, bulges toward the pointer and pauses off screen. */
(() => {
  const canvas = document.querySelector(".orb");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const copy = hero.querySelector(".hero-copy");
  const N = 128;
  let w = 0, h = 0, dpr = 1, running = false, raf = 0, start = performance.now();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
  const centre = { x: 0, y: 0 };

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  }
  function home() {
    if (w > 960) return { x: w * 0.72, y: h * 0.5, r: Math.min(w * 0.165, h * 0.26) };
    // Narrow screens: centre the orb in the space between the nav and the text.
    const navH = 64;
    const space = Math.max(120, copy.offsetTop - navH);
    return { x: w * 0.5, y: navH + space / 2, r: Math.min(w * 0.3, space * 0.36) };
  }

  function draw(now) {
    const t = (now - start) / 1000;
    const base = home();
    const intro = reduceMotion ? 1 : Math.min(1, t / 1.6);
    const ease = 1 - Math.pow(1 - intro, 3);

    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    const pull = pointer.active ? 0.05 : 0;
    centre.x += (base.x + (pointer.x - base.x) * pull - centre.x) * 0.08;
    centre.y += (base.y + (pointer.y - base.y) * pull - centre.y) * 0.08;

    const cx = centre.x * dpr, cy = centre.y * dpr;
    const R = base.r * dpr * (0.55 + 0.45 * ease) * (1 + 0.015 * Math.sin(t * 1.3));
    const pdx = pointer.x * dpr - cx, pdy = pointer.y * dpr - cy;
    const pAngle = Math.atan2(pdy, pdx);
    const prox = pointer.active ? Math.max(0, 1 - Math.hypot(pdx, pdy) / (R * 3.2)) : 0;

    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      let r = 1
        + 0.028 * Math.sin(3 * a + t * 0.9)
        + 0.016 * Math.sin(5 * a - t * 1.25 + 1.3)
        + 0.009 * Math.sin(7 * a + t * 0.6 + 2.1);
      r += 0.09 * prox * Math.pow(Math.max(0, Math.cos(a - pAngle)), 4);
      pts.push([cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r]);
    }
    const path = new Path2D();
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let m = mid(pts[N - 1], pts[0]);
    path.moveTo(m[0], m[1]);
    for (let i = 0; i < N; i++) {
      const p = pts[i], q = pts[(i + 1) % N], n = mid(p, q);
      path.quadraticCurveTo(p[0], p[1], n[0], n[1]);
    }
    path.closePath();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = ease;

    // Soft halo behind the orb
    const halo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 2.4);
    halo.addColorStop(0, "rgba(198,210,255,0.14)");
    halo.addColorStop(0.5, "rgba(246,198,255,0.05)");
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Body
    ctx.save();
    ctx.clip(path);
    const body = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.35, R * 0.1, cx, cy, R * 1.15);
    body.addColorStop(0, "#5c5c66");
    body.addColorStop(0.5, "#1e1e24");
    body.addColorStop(1, "#050507");
    ctx.fillStyle = body;
    ctx.fillRect(cx - R * 1.5, cy - R * 1.5, R * 3, R * 3);

    // Reflections, drifting against the pointer
    const lx = (pointer.active ? -pdx * 0.04 : 0) + Math.sin(t * 0.5) * R * 0.04;
    const ly = (pointer.active ? -pdy * 0.04 : 0) + Math.cos(t * 0.4) * R * 0.03;
    const spot = (x, y, rad, alpha) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, `rgba(255,248,255,${alpha})`);
      g.addColorStop(0.4, `rgba(240,232,252,${alpha * 0.85})`);
      g.addColorStop(0.72, `rgba(220,214,240,${alpha * 0.2})`);
      g.addColorStop(1, "rgba(220,214,240,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    };
    spot(cx - R * 0.26 + lx, cy - R * 0.12 + ly, R * 0.44, 0.7);
    spot(cx + R * 0.08 + lx, cy - R * 0.34 + ly, R * 0.42, 0.85);
    spot(cx - R * 0.08 + lx, cy - R * 0.26 + ly, R * 0.3, 0.5);
    const floor = ctx.createRadialGradient(cx, cy + R * 0.55, 0, cx, cy + R * 0.55, R * 0.8);
    floor.addColorStop(0, "rgba(0,0,0,0.65)");
    floor.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = floor;
    ctx.fillRect(cx - R * 1.5, cy - R * 1.5, R * 3, R * 3);
    // Iridescent fresnel band just inside the edge
    const turn = t * 0.35;
    const band = ctx.createLinearGradient(
      cx + Math.cos(turn + 1) * R, cy + Math.sin(turn + 1) * R,
      cx - Math.cos(turn + 1) * R, cy - Math.sin(turn + 1) * R);
    band.addColorStop(0, "rgba(246,198,255,0.55)");
    band.addColorStop(0.35, "rgba(160,255,225,0.5)");
    band.addColorStop(0.65, "rgba(255,236,170,0.4)");
    band.addColorStop(1, "rgba(170,190,255,0.55)");
    ctx.filter = `blur(${Math.round(R * 0.03)}px)`;
    ctx.lineWidth = R * 0.11;
    ctx.strokeStyle = band;
    ctx.stroke(path);
    ctx.filter = "none";
    ctx.restore();

    // Crisp iridescent rim
    const rim = ctx.createLinearGradient(
      cx + Math.cos(turn) * R, cy + Math.sin(turn) * R,
      cx - Math.cos(turn) * R, cy - Math.sin(turn) * R);
    rim.addColorStop(0, "#f6c6ff");
    rim.addColorStop(0.35, "#c0fff0");
    rim.addColorStop(0.65, "#fff2c2");
    rim.addColorStop(1, "#c6d2ff");
    ctx.save();
    ctx.lineWidth = 1.6 * dpr;
    ctx.strokeStyle = rim;
    ctx.globalAlpha = ease * 0.7;
    ctx.shadowColor = "rgba(198,210,255,0.4)";
    ctx.shadowBlur = 18 * dpr;
    ctx.stroke(path);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    draw(now);
    if (running) raf = requestAnimationFrame(loop);
  }
  function play() { if (!running && !reduceMotion) { running = true; raf = requestAnimationFrame(loop); } }
  function pause() { running = false; cancelAnimationFrame(raf); }

  layout();
  const b = home(); centre.x = b.x; centre.y = b.y; pointer.x = pointer.tx = b.x; pointer.y = pointer.ty = b.y;
  draw(performance.now());

  window.addEventListener("resize", () => { layout(); if (!running) draw(performance.now()); });
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    pointer.tx = e.clientX - r.left; pointer.ty = e.clientY - r.top; pointer.active = true;
  });
  hero.addEventListener("pointerleave", () => { pointer.active = false; });
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause())).observe(hero);
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : play()));
})();

/* Assistant S screen switcher */
(() => {
  const fig = document.querySelector("[data-switcher]");
  if (!fig) return;
  const tabs = [...fig.querySelectorAll("[data-shot]")];
  const shots = [...fig.querySelectorAll(".device-screen img")];
  let current = 0, timer = 0, userChose = false;
  const show = (i) => {
    current = i;
    tabs.forEach((t, n) => t.setAttribute("aria-selected", String(n === i)));
    shots.forEach((s, n) => s.classList.toggle("is-on", n === i));
  };
  tabs.forEach((t, n) => t.addEventListener("click", () => { userChose = true; clearInterval(timer); show(n); }));
  fig.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (current + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    userChose = true; clearInterval(timer); show(n); tabs[n].focus();
  });
  if (reduceMotion) return;
  new IntersectionObserver(([entry]) => {
    clearInterval(timer);
    if (entry.isIntersecting && !userChose) timer = setInterval(() => show((current + 1) % shots.length), 4200);
  }, { threshold: 0.4 }).observe(fig);
})();

/* Reveal on scroll, staggered within each group */
(() => {
  const items = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
      entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target), 4) * 90}ms`;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  items.forEach((el) => io.observe(el));
  // Safety net for fast scrolls and anchor jumps: never leave content above the fold hidden.
  let queued = false;
  window.addEventListener("scroll", () => {
    if (queued) return; queued = true;
    requestAnimationFrame(() => {
      queued = false;
      items.forEach((el) => {
        if (!el.classList.contains("in") && el.getBoundingClientRect().top < window.innerHeight * 0.95) { el.classList.add("in"); io.unobserve(el); }
      });
    });
  }, { passive: true });
})();

/* Navigation: border once scrolled, highlight the section in view */
(() => {
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const links = new Map([...nav.querySelectorAll("nav a")].map((a) => [a.getAttribute("href").slice(1), a]));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = links.get(entry.target.id);
      if (link && !link.classList.contains("nav-cta")) link.classList.toggle("active", entry.isIntersecting);
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) sectionObserver.observe(s); });
})();
