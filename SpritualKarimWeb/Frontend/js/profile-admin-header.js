/**
 * profile-admin-header.js
 * Master 4-Tier OOPS-based MVC JavaScript Application for Spiritual Karim Admin Panel
 * Tier 1: Devotee Personal (Identity, Ancestral Lineage, House Clean)
 * Tier 2: Seeker Purpose (Goals, House Clean Status, Sadhanas Interested & Slide-out Drawer)
 * Tier 3: Trainee Sadhak (Categorized In-Progress Level Wise & Goli Gyan)
 * Tier 4: Healer Connect (Level Completed with Status & Certifications)
 *
 * RBAC & 4-Tier Multi-Portal Engine (Enterprise OOPS MVC Architecture)
 *
 * âš ï¸ NOTE: appConfig and retryFetch are loaded from:
 *   - js/config/appConfig.js  (single source of truth for all constants)
 *   - js/utils/retryHelper.js (single source for retryFetch)
 * This file only extends appConfig with header-specific SADHANA_CATALOG data.
 */

// ==============================================================
// 0. SADHANA CATALOG EXTENSION â€” appConfig is already loaded by appConfig.js
// ==============================================================
const rootHeader = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : {});

// Extend appConfig only with keys not already present
if (rootHeader.appConfig) {
  rootHeader.appConfig = Object.assign({
    appName: 'Spiritual Karim Admin',
    orgName: 'Shree Spritual Karim Sansthan',
    autoCloudSync: true,
    directoryLayout: 'GRID',
  }, rootHeader.appConfig);
}
var appConfig = rootHeader.appConfig || {};

// escapeHtml — defined here as fallback if sanitizer.js is not loaded
if (typeof rootHeader.escapeHtml !== 'function') {
  rootHeader.escapeHtml = function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
}
// Alias for backward compatibility
rootHeader.escapeHtmlUtil = rootHeader.escapeHtml;

// retryFetch — defined here as fallback if retryHelper.js is not loaded
if (typeof rootHeader.retryFetch !== 'function') {
  rootHeader.retryFetch = async function retryFetch(input, init = {}, maxRetry = 3) {
    let attempt = 0;
    while (true) {
      try {
        const response = await fetch(input, init);
        const status = response.status;
        const serverLoad = response.headers && typeof response.headers.get === 'function'
          ? response.headers.get('X-Server-Load') : null;
        if (status === 429 || (serverLoad && serverLoad.toLowerCase() === 'high')) {
          if (attempt >= maxRetry) throw new Error('retryFetch: max retries exceeded');
          attempt++;
          console.warn(`retryFetch: high traffic (status ${status}); retry ${attempt} after 2s`);
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
        return response;
      } catch (e) {
        if (attempt >= maxRetry) throw e;
        attempt++;
        console.warn(`retryFetch: fetch error (${e.message}); retry ${attempt} after 2s`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  };
}
var retryFetch = rootHeader.retryFetch;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { appConfig, escapeHtml: rootHeader.escapeHtml, retryFetch };
}

// NOTE: MVC classes (ProfileModel, ProfileView, ProfileController)
// are defined in their respective files and loaded separately:
// - js/models/ProfileModel.js
// - js/views/ProfileView.js
// - js/controllers/ProfileController.js
