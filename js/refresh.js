"use strict";
// Filters enhance a complete, readable page; every project remains visible without JavaScript.
const filters = document.querySelector(".filters");
const projects = [...document.querySelectorAll(".project[data-categories]")];
if (filters && projects.length) {
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    const category = button.dataset.filter;
    filters.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    let shown = 0;
    projects.forEach((project) => {
      project.hidden = category !== "all" && !project.dataset.categories.split(" ").includes(category);
      if (!project.hidden) shown += 1;
    });
    document.querySelector("#filter-status").textContent = `${shown} ${shown === 1 ? "project" : "projects"} shown.`;
  });
}
