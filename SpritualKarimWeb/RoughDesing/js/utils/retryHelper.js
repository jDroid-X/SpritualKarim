// js/utils/retryHelper.js
/**
 * retryFetch - wraps the native fetch and retries when server signals high traffic.
 * It checks for HTTP 429 status OR a custom response header 'X-Server-Load' set to 'high'.
 * If detected, it waits using an exponential back‑off strategy (base 15 s, capped at 5 min).
 * Retries continue indefinitely until a non‑error response is received (or fetch throws).
 * The caller can optionally provide a `maxRetry` count to avoid infinite loops.
 */

async function retryFetch(input, init = {}, maxRetry = Infinity, useExponential = false) {
  let attempt = 0;
  const baseDelay = 15000; // 15 seconds base
  const maxDelay = 300000; // 5 minutes cap
  while (true) {
    try {
      const response = await fetch(input, init);
      const status = response.status;
      const serverLoad = response.headers.get('X-Server-Load');
      if ((status === 429) || (serverLoad && serverLoad.toLowerCase() === 'high')) {
        if (attempt >= maxRetry) {
          throw new Error('retryFetch: max retries exceeded');
        }
        attempt++;
        const delay = useExponential ? Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay) : 10000;
        console.warn(`retryFetch: high traffic detected (status ${status}, header ${serverLoad}); retry ${attempt} after ${delay / 1000}s`);
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      return response;
    } catch (e) {
      if (attempt >= maxRetry) {
        throw e;
      }
      attempt++;
      const delay = useExponential ? Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay) : 10000;
      console.warn(`retryFetch: fetch error (${e.message}); retry ${attempt} after ${delay / 1000}s`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

// Universal Environment Export (Browser & CommonJS)
if (typeof window !== 'undefined') {
  window.retryFetch = retryFetch;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { retryFetch };
}

