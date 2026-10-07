document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("dashboard-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    root.dataset.theme = savedTheme;
  }

  const updateThemeButton = () => {
    const isDark = root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (themeToggle) {
      themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  };

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = root.dataset.theme === "dark" ||
        (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      const nextTheme = isDark ? "light" : "dark";
      root.dataset.theme = nextTheme;
      localStorage.setItem("dashboard-theme", nextTheme);
      updateThemeButton();
    });
  }

  const dialogs = document.querySelectorAll("dialog");

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.openModal);
      if (dialog) {
        dialog.showModal();
        const firstControl = dialog.querySelector("input, select, textarea, button");
        if (firstControl) firstControl.focus();
      }
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog");
      if (dialog) dialog.close();
    });
  });

  dialogs.forEach((dialog) => {
    dialog.addEventListener("close", () => {
      const opener = document.querySelector(`[data-open-modal="${dialog.id}"]`);
      if (opener) opener.focus();
    });
  });
});
