document.addEventListener("DOMContentLoaded", () => {
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
