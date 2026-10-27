document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Theme preference is shared across dashboard pages.
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("dashboard-theme");
  } catch (error) {
    console.warn("Theme preferences are unavailable in this browser.", error);
  }

  if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;

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
      try {
        localStorage.setItem("dashboard-theme", nextTheme);
      } catch (error) {
        console.warn("Theme preference could not be saved.", error);
      }
      updateThemeButton();
    });
  }

  // Preserve accessible native-dialog behavior used by the original pages.
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

  // Task 5: asynchronous REST API client, dynamic rendering, filtering and sorting.
  const grid = document.querySelector("#productGrid");
  if (!grid || !window.ProductAPI) return;

  const searchInput = document.querySelector("#productSearch");
  const sortSelect = document.querySelector("#productSort");
  const categoryContainer = document.querySelector("#productCategories");
  const status = document.querySelector("#productStatus");
  const errorPanel = document.querySelector("#productError");
  const errorMessage = document.querySelector("#productErrorMessage");
  const retryButton = document.querySelector("#retryProducts");
  const refreshButton = document.querySelector("#refreshProducts");

  const state = {
    products: [],
    categories: [],
    activeCategory: "all",
    searchTerm: "",
    sortMode: "default",
    requestController: null
  };

  const makeElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  function showLoading() {
    grid.replaceChildren();
    grid.setAttribute("aria-busy", "true");
    status.textContent = "Loading products…";
    errorPanel.hidden = true;
    for (let i = 0; i < 8; i += 1) {
      const skeleton = makeElement("article", "product-card skeleton-card");
      skeleton.setAttribute("aria-hidden", "true");
      skeleton.append(makeElement("div", "skeleton-image"), makeElement("div", "skeleton-line"),
        makeElement("div", "skeleton-line short"), makeElement("div", "skeleton-line"));
      grid.append(skeleton);
    }
  }

  function renderCategories() {
    categoryContainer.replaceChildren();
    const allButton = makeElement("button", "category-tab", "All products");
    allButton.type = "button";
    allButton.dataset.category = "all";
    categoryContainer.append(allButton);

    state.categories.forEach((category) => {
      const button = makeElement("button", "category-tab", categoryLabel(category));
      button.type = "button";
      button.dataset.category = category;
      categoryContainer.append(button);
    });
    updateCategoryButtons();
  }

  function categoryLabel(value) {
    return value.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function updateCategoryButtons() {
    categoryContainer.querySelectorAll("[data-category]").forEach((button) => {
      const active = button.dataset.category === state.activeCategory;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function getVisibleProducts() {
    const query = state.searchTerm.trim().toLowerCase();
    const filtered = state.products.filter((product) => {
      const matchesCategory = state.activeCategory === "all" || product.category === state.activeCategory;
      const matchesSearch = !query ||
        `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    const sorters = {
      "title-asc": (a, b) => a.title.localeCompare(b.title),
      "title-desc": (a, b) => b.title.localeCompare(a.title),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "rating-desc": (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)
    };
    if (sorters[state.sortMode]) filtered.sort(sorters[state.sortMode]);
    return filtered;
  }

  function renderProducts() {
    const products = getVisibleProducts();
    grid.replaceChildren();
    grid.setAttribute("aria-busy", "false");

    if (products.length === 0) {
      grid.append(makeElement("p", "empty-state", "No products match your search and filters. Try another term or choose All products."));
      status.textContent = "No matching products.";
      return;
    }

    products.forEach((product) => {
      const card = makeElement("article", "product-card");
      const imageWrap = makeElement("div", "product-image-wrap");
      const image = makeElement("img", "product-image");
      image.src = product.image;
      image.alt = product.title;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.hidden = true;
        imageWrap.append(makeElement("span", "image-fallback", "Image unavailable"));
      }, { once: true });
      imageWrap.append(image);

      const details = makeElement("div", "product-details");
      details.append(makeElement("p", "product-category", categoryLabel(product.category)));
      details.append(makeElement("h3", "product-title", product.title));
      details.append(makeElement("p", "product-description", product.description));
      const footer = makeElement("div", "product-card-footer");
      footer.append(makeElement("p", "product-price", `$${Number(product.price).toFixed(2)}`));
      const rating = product.rating?.rate;
      footer.append(makeElement("p", "product-rating", Number.isFinite(rating)
        ? `★ ${rating.toFixed(1)} / 5 (${product.rating.count} reviews)` : "Rating unavailable"));
      details.append(footer);
      card.append(imageWrap, details);
      grid.append(card);
    });
    status.textContent = `Showing ${products.length} of ${state.products.length} products.`;
  }

  async function loadProducts({ forceRefresh = false } = {}) {
    if (state.requestController) state.requestController.abort();
    state.requestController = new AbortController();
    showLoading();
    try {
      const [productsResult, categoriesResult] = await Promise.all([
        window.ProductAPI.getProducts({ forceRefresh, signal: state.requestController.signal }),
        window.ProductAPI.getCategories({ forceRefresh, signal: state.requestController.signal })
      ]);
      state.products = productsResult.data;
      state.categories = categoriesResult.data;
      errorPanel.hidden = true;
      renderCategories();
      renderProducts();
      if (productsResult.source === "cache" || categoriesResult.source === "cache") {
        status.textContent += " Recently cached data.";
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      grid.replaceChildren();
      grid.setAttribute("aria-busy", "false");
      errorMessage.textContent = "The live product service could not be reached. Check your internet connection and try again. If you loaded a recent version earlier, refresh may retrieve cached data.";
      errorPanel.hidden = false;
      status.textContent = "Products could not be loaded.";
      console.error("Product API request failed:", error);
    }
  }

  searchInput.addEventListener("input", () => {
    state.searchTerm = searchInput.value;
    renderProducts();
  });
  sortSelect.addEventListener("change", () => {
    state.sortMode = sortSelect.value;
    try { localStorage.setItem("dashboard-product-sort", state.sortMode); } catch (error) {
      console.warn("Sort preference could not be saved.", error);
    }
    renderProducts();
  });
  categoryContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.activeCategory = button.dataset.category;
    updateCategoryButtons();
    renderProducts();
  });
  retryButton.addEventListener("click", () => loadProducts({ forceRefresh: true }));
  refreshButton.addEventListener("click", () => loadProducts({ forceRefresh: true }));

  try {
    const savedSort = localStorage.getItem("dashboard-product-sort");
    if (savedSort && sortSelect.querySelector(`option[value="${savedSort}"]`)) {
      state.sortMode = savedSort;
      sortSelect.value = savedSort;
    }
  } catch (error) {
    console.warn("Sort preference is unavailable.", error);
  }

  loadProducts();
});
