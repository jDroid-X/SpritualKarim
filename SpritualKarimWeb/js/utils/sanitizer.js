/**
 * js/utils/sanitizer.js
 * Universal XSS Sanitization & Input Defense Utility
 * Shree Spritual Karim Sansthan (Enterprise OOPS MVC)
 */

/**
 * Escapes HTML characters to prevent XSS attacks.
 * @param {*} str - Input to escape
 * @returns {string} - Escaped safe HTML string
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips HTML tags and controls excessive whitespace.
 * @param {*} str - Input string
 * @returns {string} - Clean text
 */
function sanitizeInput(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Standard debounce utility for high-frequency input events.
 * @param {Function} fn 
 * @param {number} delay 
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Universal Environment Export (Browser & CommonJS)
if (typeof window !== 'undefined') {
  window.escapeHtml = escapeHtml;
  window.escapeHtmlUtil = escapeHtml;
  window.sanitizeInput = sanitizeInput;
  window.debounce = debounce;
  window.sanitizer = {
    escapeHtml,
    sanitizeInput,
    debounce
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    escapeHtml,
    sanitizeInput,
    debounce
  };
}
