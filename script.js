console.log("JavaScript connected");
const themeButton = document.getElementById("themeToggle");
if (themeButton) {
  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeButton.textContent = "Switch to Light Mode";
    } else {
      themeButton.textContent = "Switch to Dark Mode";
    }
  });
}
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const toggle = document.getElementById("theme-toggle");
  const storageKey = "profile-theme";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.textContent = isDark ? "Light mode" : "Dark mode";
    }
  }

  function currentTheme() {
    return localStorage.getItem(storageKey) || (prefersDark.matches ? "dark" : "light");
  }

  applyTheme(currentTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      const next = document.body.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });
  }

  prefersDark.addEventListener("change", function (event) {
    if (!localStorage.getItem(storageKey)) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
})();

(function () {
  const searchInput = document.getElementById("project-search");
  const filterButtons = Array.from(document.querySelectorAll(".tech-filter"));
  const projectItems = Array.from(document.querySelectorAll(".project-item"));
  const emptyState = document.getElementById("projects-empty");
  const statusEl = document.getElementById("project-filter-status");

  if (!searchInput || !projectItems.length) {
    return;
  }

  let activeTech = "all";

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function matchesProject(item, query, tech) {
    const name = normalize(item.dataset.name);
    const itemTech = normalize(item.dataset.tech);
    const text = normalize(item.textContent);
    const queryMatch =
      !query ||
      name.includes(query) ||
      itemTech.includes(query) ||
      text.includes(query);
    const techMatch = tech === "all" || itemTech === tech;
    return queryMatch && techMatch;
  }

  function updateStatus(visibleCount, totalCount, query, tech) {
    if (!statusEl) {
      return;
    }

    if (visibleCount === totalCount && !query && tech === "all") {
      statusEl.textContent = "";
      return;
    }

    const label = visibleCount === 1 ? "project" : "projects";
    statusEl.textContent = "Showing " + visibleCount + " of " + totalCount + " " + label + ".";
  }

  function applyFilters() {
    const query = normalize(searchInput.value);
    let visibleCount = 0;

    projectItems.forEach(function (item) {
      const isMatch = matchesProject(item, query, activeTech);
      item.hidden = !isMatch;
      if (isMatch) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }

    updateStatus(visibleCount, projectItems.length, query, activeTech);
  }

  function setActiveTech(tech) {
    activeTech = tech;
    filterButtons.forEach(function (button) {
      const isActive = button.dataset.tech === tech;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    applyFilters();
  }

  searchInput.addEventListener("input", applyFilters);

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setActiveTech(button.dataset.tech || "all");
    });
  });

  applyFilters();
})();
