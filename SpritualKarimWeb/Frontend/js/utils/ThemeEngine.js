/**
 * Shree Spritual Karim Sansthan — ThemeEngine (v1.0)
 * Manages Light (Default) and Dark Theme switching, persistence, and DOM updates.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'sk_theme_preference';
  const DEFAULT_THEME = 'light';
  const THEME_SEQUENCE = ['light', 'dark', 'auto'];

  const ThemeEngine = {
    /**
     * Get the stored user preference (defaults to 'light')
     */
    getPreference() {
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
        }
        return DEFAULT_THEME;
      } catch (e) {
        return DEFAULT_THEME;
      }
    },

    /**
     * Resolve actual applied theme ('light' or 'dark')
     */
    getResolvedTheme(pref) {
      const p = pref || this.getPreference();
      if (p === 'auto') {
        const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
      }
      return p === 'dark' ? 'dark' : 'light';
    },

    /**
     * Apply the theme to documentElement and update UI elements
     */
    applyTheme(pref, showToast = false) {
      const p = pref || this.getPreference();
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, p);
        }
      } catch (e) {}

      const resolved = this.getResolvedTheme(p);
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-theme', resolved);
      }

      // Update toggle button DOM elements if present
      if (typeof document !== 'undefined') {
        const iconEl = document.getElementById('theme-icon');
        const labelEl = document.getElementById('theme-label');
        const btnEl = document.getElementById('btn-theme-toggle') || document.getElementById('btnThemeToggle');

        if (iconEl && labelEl) {
          if (p === 'auto') {
            iconEl.textContent = '💻';
            labelEl.textContent = `Auto (${resolved === 'dark' ? 'Dark' : 'Light'})`;
            if (btnEl) btnEl.title = `Theme: Auto (OS: ${resolved === 'dark' ? 'Dark' : 'Light'}) | Click to change`;
          } else if (p === 'dark') {
            iconEl.textContent = '🌙';
            labelEl.textContent = 'Dark';
            if (btnEl) btnEl.title = 'Theme: Dark Mode | Click to change';
          } else {
            iconEl.textContent = '☀️';
            labelEl.textContent = 'Light';
            if (btnEl) btnEl.title = 'Theme: Light Mode (Default) | Click to change';
          }
        }
      }

      // Dispatch event for components
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('sk:theme-changed', {
          detail: { preference: p, resolved: resolved }
        }));

        if (showToast && typeof window.showToastNotification === 'function') {
          window.showToastNotification(`🎨 Theme switched to: ${p.toUpperCase()}`);
        }
      }
    },

    /**
     * Cycle through Light -> Dark -> Auto -> Light
     */
    cycleTheme() {
      const current = this.getPreference();
      const nextIndex = (THEME_SEQUENCE.indexOf(current) + 1) % THEME_SEQUENCE.length;
      const nextTheme = THEME_SEQUENCE[nextIndex];
      this.applyTheme(nextTheme, true);
      return nextTheme;
    },

    /**
     * Initialize theme listeners on page load
     */
    init() {
      const pref = this.getPreference();
      this.applyTheme(pref, false);

      // OS theme change listener
      if (typeof window !== 'undefined' && window.matchMedia) {
        try {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.getPreference() === 'auto') {
              this.applyTheme('auto', false);
            }
          });
        } catch (e) {}
      }

      // Attach click handler to theme button if present
      if (typeof document !== 'undefined') {
        const btn = document.getElementById('btn-theme-toggle') || document.getElementById('btnThemeToggle');
        if (btn && !btn.dataset.themeBound) {
          btn.dataset.themeBound = 'true';
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.cycleTheme();
          });
        }
      }
    }
  };

  // Immediate execution on load to prevent FOIT/flash
  ThemeEngine.applyTheme(ThemeEngine.getPreference(), false);

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => ThemeEngine.init());
    } else {
      ThemeEngine.init();
    }
  }

  // UMD exports
  if (typeof window !== 'undefined') window.ThemeEngine = ThemeEngine;
  if (typeof global !== 'undefined') global.ThemeEngine = ThemeEngine;
  if (typeof module !== 'undefined' && module.exports) module.exports = ThemeEngine;

})();
