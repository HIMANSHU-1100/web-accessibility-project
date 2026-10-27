/* REST API client for the product catalogue.
 * Uses localStorage as a short-lived cache so a recent successful response
 * can still be displayed when the API is temporarily unavailable.
 */
(() => {
  "use strict";

  const API_BASE_URL = "https://fakestoreapi.com";
  const CACHE_TTL_MS = 5 * 60 * 1000;
  const CACHE_KEYS = {
    products: "dashboard-products-cache-v1",
    categories: "dashboard-product-categories-cache-v1"
  };

  function readCache(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (!cached || !cached.savedAt || !Array.isArray(cached.data)) return null;
      if (Date.now() - cached.savedAt > CACHE_TTL_MS) return null;
      return cached.data;
    } catch (error) {
      console.warn("Unable to read cached API data:", error);
      return null;
    }
  }

  function writeCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
    } catch (error) {
      // Storage can be unavailable or full; the live API response remains usable.
      console.warn("Unable to cache API data:", error);
    }
  }

  async function requestJson(path, signal) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal
    });
    if (!response.ok) {
      throw new Error(`The product service returned HTTP ${response.status}.`);
    }
    return response.json();
  }

  async function getProducts({ forceRefresh = false, signal } = {}) {
    if (!forceRefresh) {
      const cached = readCache(CACHE_KEYS.products);
      if (cached) return { data: cached, source: "cache" };
    }
    const data = await requestJson("/products", signal);
    if (!Array.isArray(data)) throw new Error("The product service returned an unexpected response.");
    writeCache(CACHE_KEYS.products, data);
    return { data, source: "api" };
  }

  async function getCategories({ forceRefresh = false, signal } = {}) {
    if (!forceRefresh) {
      const cached = readCache(CACHE_KEYS.categories);
      if (cached) return { data: cached, source: "cache" };
    }
    const data = await requestJson("/products/categories", signal);
    if (!Array.isArray(data)) throw new Error("The category service returned an unexpected response.");
    writeCache(CACHE_KEYS.categories, data);
    return { data, source: "api" };
  }

  window.ProductAPI = Object.freeze({ getProducts, getCategories });
})();
