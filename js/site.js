(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const name = document.querySelector(".typed-name");
  if (name && !reduced) {
    const full = name.textContent;
    name.textContent = "";
    let i = 0;
    const type = () => {
      name.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(type, 105);
    };
    setTimeout(type, 350);
  }
  const skills = document.querySelector(".skill-track");
  if (skills && !reduced)
    [...skills.children].forEach((el) => {
      const clone = el.cloneNode(true);
      clone.classList.add("clone-skill");
      clone.setAttribute("aria-hidden", "true");
      skills.appendChild(clone);
    });
  const slider = document.querySelector(".project-slider"),
    track = document.querySelector(".project-track");
  if (!slider || !track) return;
  const slides = [...track.children],
    dots = [...document.querySelectorAll("[data-slide]")];
  let index = 0;
  const show = (n) => {
    index = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => {
      slide.inert = i !== index;
      slide.setAttribute("aria-hidden", String(i !== index));
    });
    dots.forEach((dot, i) =>
      dot.setAttribute("aria-current", String(i === index)),
    );
    document.querySelector(".slide-status").textContent =
      `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };
  document
    .querySelector("[data-prev]")
    .addEventListener("click", () => show(index - 1));
  document
    .querySelector("[data-next]")
    .addEventListener("click", () => show(index + 1));
  dots.forEach((dot) =>
    dot.addEventListener("click", () => show(Number(dot.dataset.slide))),
  );
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      show(index + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  let start = null;
  slider.addEventListener(
    "touchstart",
    (e) => {
      start = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },
    { passive: true },
  );
  slider.addEventListener(
    "touchend",
    (e) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.x,
        dy = e.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
        show(index + (dx < 0 ? 1 : -1));
      start = null;
    },
    { passive: true },
  );
  show(0);
})();
