/**
 * PathResolver.js - Dynamic Relative & Absolute Path Resolver
 * Shree Spritual Karim Sansthan
 * 
 * Ensures that regardless of whether a page is served from root '/',
 * '/Frontend/Devotee/', '/Devotee/', or deeply nested sub-directories,
 * asset and script links are dynamically and accurately resolved.
 */

(function(window) {
  'use strict';

  const PathResolver = {
    /**
     * Determines relative root path from current page location.
     * @returns {string} Relative path to root (e.g. '', '../', '../../')
     */
    getRootOffset() {
      const pathname = window.location.pathname.replace(/\\/g, '/');
      const parts = pathname.split('/').filter(p => p && !p.endsWith('.html') && !p.endsWith('.htm'));
      
      // If we are at root or single file
      if (parts.length === 0) return './';
      
      // Calculate depth from root
      // E.g. /Frontend/Devotee/ -> depth 2 -> '../../'
      return '../'.repeat(parts.length) || './';
    },

    /**
     * Resolves an asset path dynamically from any directory depth.
     * @param {string} relativePath (e.g. 'css/profile-admin.css', 'Logo.png')
     * @returns {string} Normalized relative path
     */
    resolveAsset(relativePath) {
      const cleanRel = relativePath.replace(/^\.?\//, '');
      const offset = this.getRootOffset();
      return offset + cleanRel;
    },

    /**
     * Resolves a portal or page URL dynamically.
     * @param {string} pagePath (e.g. 'index.html', 'join.html', 'Frontend/Devotee/index.html')
     * @param {Object} queryParams
     * @returns {string} Full resolved URL
     */
    resolvePage(pagePath, queryParams = {}) {
      const cleanPage = pagePath.replace(/^\.?\//, '');
      const offset = this.getRootOffset();
      let url = offset + cleanPage;
      
      const keys = Object.keys(queryParams);
      if (keys.length > 0) {
        const query = keys.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k])).join('&');
        url += (url.includes('?') ? '&' : '?') + query;
      }
      return url;
    },

    /**
     * Injects or fixes stylesheet / script tags dynamically
     */
    normalizeDocumentPaths() {
      const offset = this.getRootOffset();
      if (offset === './' || offset === '') return;

      // Update relative links if needed
      document.querySelectorAll('link[data-dynamic-path]').forEach(link => {
        const target = link.getAttribute('data-dynamic-path');
        if (target) link.href = this.resolveAsset(target);
      });

      document.querySelectorAll('img[data-dynamic-path]').forEach(img => {
        const target = img.getAttribute('data-dynamic-path');
        if (target) img.src = this.resolveAsset(target);
      });
    }
  };

  window.PathResolver = PathResolver;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PathResolver;
  }
})(typeof window !== 'undefined' ? window : global);
