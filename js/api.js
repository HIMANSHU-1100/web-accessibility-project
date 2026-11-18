/* REST API client for the product catalogue.
 * Uses localStorage for a five-minute fresh cache and falls back to the last
 * successful response if a later network request fails.
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
      if (!cached || !Number.isFinite(cached.savedAt) || !Array.isArray(cached.data)) return null;
      return {
        data: cached.data,
        isFresh: Date.now() - cached.savedAt <= CACHE_TTL_MS
      };
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
    const cached = readCache(CACHE_KEYS.products);
    if (!forceRefresh && cached?.isFresh) {
      return { data: cached.data, source: "cache" };
    }

    try {
      const data = await requestJson("/products", signal);
      if (!Array.isArray(data)) throw new Error("The product service returned an unexpected response.");
      writeCache(CACHE_KEYS.products, data);
      return { data, source: "api" };
    } catch (error) {
      if (error.name === "AbortError") throw error;
      if (cached?.data.length) {
        console.warn("Live products are unavailable; using previously cached products.", error);
        return { data: cached.data, source: "stale-cache" };
      }
      throw error;
    }
  }

  async function getCategories({ forceRefresh = false, signal } = {}) {
    const cached = readCache(CACHE_KEYS.categories);
    if (!forceRefresh && cached?.isFresh) {
      return { data: cached.data, source: "cache" };
    }

    try {
      const data = await requestJson("/products/categories", signal);
      if (!Array.isArray(data)) throw new Error("The category service returned an unexpected response.");
      writeCache(CACHE_KEYS.categories, data);
      return { data, source: "api" };
    } catch (error) {
      if (error.name === "AbortError") throw error;
      if (cached?.data.length) {
        console.warn("Live categories are unavailable; using previously cached categories.", error);
        return { data: cached.data, source: "stale-cache" };
      }
      throw error;
    }
  }

  window.ProductAPI = Object.freeze({ getProducts, getCategories });
})();
