// js/utils/retryHelper.js
/**
 * retryFetch - wraps the native fetch and retries when server signals high traffic.
 * It checks for HTTP 429 status OR a custom response header 'X-Server-Load' set to 'high'.
 * If detected, it waits 10 seconds before retrying. Retries continue indefinitely until
 * a non‑error response is received (or fetch throws a network error). The caller can
 * optionally provide a maxRetry count to avoid infinite loops.
 */
export async function retryFetch(input, init = {}, maxRetry = Infinity) {
  let attempt = 0;
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
        console.warn(`retryFetch: high traffic detected (status ${status}, header ${serverLoad}); retry ${attempt} after 10s`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        continue;
      }
      return response;
    } catch (e) {
      if (attempt >= maxRetry) {
        throw e;
      }
      attempt++;
      console.warn(`retryFetch: fetch error (${e.message}); retry ${attempt} after 10s`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}
