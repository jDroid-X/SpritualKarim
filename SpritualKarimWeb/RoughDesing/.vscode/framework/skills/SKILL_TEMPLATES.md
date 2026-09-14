# Reusable Skill Templates

Copy-paste ready templates for common development patterns.
Adapted from anti-gravity-ide builtin patterns.

---

## SKILL-001: MVC Component Template

```javascript
// js/models/BaseModel.js
import { APP_CONFIG } from '../config/appConfig.js';

export class BaseModel {
  constructor(storageKey) {
    this.storageKey = `${APP_CONFIG.projectPrefix}_${storageKey}`;
    this.listeners = new Set();
    this.data = this._load();
  }
  
  _load() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }
  
  _save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    localStorage.setItem(`firebase_${this.storageKey}`, JSON.stringify(this.data));
    localStorage.setItem('sk_last_write_ts', Date.now().toString());
  }
  
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  _notifyChange(data) {
    this.data = data;
    this._save();
    this.listeners.forEach(l => l(data));
  }
}

// js/views/BaseView.js
import { escapeHtml } from '../utils/sanitizer.js';

export class BaseView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container #${containerId} not found`);
    }
  }
  
  render(html) {
    this.container.innerHTML = this._sanitize(html);
  }
  
  _sanitize(input) {
    return escapeHtml(input);
  }
  
  getFormData(selector) {
    const form = this.container.querySelector(selector);
    const data = {};
    form.querySelectorAll('[name]').forEach(input => {
      data[input.name] = input.value.trim();
    });
    return data;
  }
  
  showLoading() {
    this.container.innerHTML = '<div class="loading">Loading...</div>';
  }
  
  showError(message) {
    this.render(`<div class="error">${message}</div>`);
  }
  
  showSuccess(message) {
    this.render(`<div class="success">${message}</div>`);
  }
}

// js/controllers/BaseController.js
export class BaseController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  
  init() {
    this._bindEvents();
    this._loadData();
  }
  
  _bindEvents() {
    // Override in subclass
  }
  
  _loadData() {
    // Override in subclass
  }
  
  _handleError(error) {
    console.error('[CONTROLLER_ERROR]', error);
    this.view.showError(error.message || 'An error occurred');
  }
}
```

---

## SKILL-002: Auth Matrix Element Template

```javascript
// When adding new element to RBAC matrix:
export const AUTH_MATRIX_ELEMENT = {
  id: 'element-id-here',
  label: 'Element Label',
  category: 'navigation|actions|data|settings',
  
  // Role visibility (hide/disabled per role)
  MASTER: { hide: false, disabled: false },
  ADMIN: { hide: false, disabled: false },
  MAHAMANA: { hide: true, disabled: true },
  MAHANT: { hide: true, disabled: true },
  SADHNA: { hide: true, disabled: true },
  PRACHARAK: { hide: true, disabled: true },
  SEEKER: { hide: true, disabled: true },
  
  // Portal visibility
  portalVisible: {
    admin: true,
    mahamana: false,
    mahant: false,
    sadhna: false,
    pracharak: false,
    seeker: false,
    public: false
  },
  
  // Optional: parent element ID for tree structure
  parentId: null,
  
  // Optional: sort order
  sortOrder: 0
};
```

---

## SKILL-003: Form Wizard Template

```javascript
class WizardController {
  constructor(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.data = {};
  }
  
  async next() {
    const valid = await this.validateCurrentStep();
    if (!valid) return false;
    
    this.data = { ...this.data, ...this.collectCurrentStepData() };
    this.currentStep++;
    this.renderStep();
    return true;
  }
  
  async validateCurrentStep() {
    const validators = this.steps[this.currentStep]•.validators || [];
    for (const validator of validators) {
      const result = await validator(this.data);
      if (!result.valid) {
        this.showValidationMessage(result.message);
        return false;
      }
    }
    return true;
  }
  
  collectCurrentStepData() {
    // Implementation depends on step structure
    return {};
  }
  
  renderStep() {
    // Render current step UI
  }
  
  showValidationMessage(message) {
    // Show inline validation error
  }
}
```

---

## SKILL-004: Debounced Auto-Save Template

```javascript
function createDebouncedSave(saveFn, delay = 500) {
  let timeoutId = null;
  
  return function debouncedSave(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      saveFn(...args);
    }, delay);
  };
}

// Usage:
const autoSaveProfile = createDebouncedSave(
  (profile) => profileModel.save(profile),
  1500  // 1.5 second debounce
);

// Trigger on input change:
input.addEventListener('input', (e) => {
  autoSaveProfile({ ...currentProfile, [e.target.name]: e.target.value });
});
```

---

## SKILL-005: Cross-Tab Sync Template

```javascript
// Broadcast changes to other tabs
function broadcastChange(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`fb_broadcast_${key}`, Date.now().toString());
}

// Listen for changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key•.startsWith('fb_broadcast_')) {
    const targetKey = e.key.replace('fb_broadcast_', '');
    const data = JSON.parse(e.newValue || '{}');
    handleRemoteUpdate(targetKey, data);
  }
});

function handleRemoteUpdate(key, data) {
  // Update local state without triggering recursive broadcast
  console.log(`[CROSS-TAB] Updated ${key}`);
  // Refresh UI as needed
}
```

---

## SKILL-006: Hash Router Template

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this._bindListeners();
  }
  
  _bindListeners() {
    window.addEventListener('hashchange', () => this._navigate());
    window.addEventListener('load', () => this._navigate());
  }
  
  _navigate() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash];
    
    if (route && route !== this.currentRoute) {
      if (this.currentRoute) {
        this.currentRoute.deactivate•.();
      }
      this.currentRoute = route;
      route.activate•.();
      history.replaceState(null, '', hash);
    }
  }
  
  navigate(hash) {
    window.location.hash = hash;
  }
}

// Usage:
const router = new HashRouter({
  '/': {
    activate: () => dashboardView.render(),
    deactivate: () => dashboardView.cleanup()
  },
  '/settings': {
    activate: () => settingsView.render(),
    deactivate: () => settingsView.cleanup()
  }
});
```

---

## SKILL-007: Session Timeout Template

```javascript
class SessionManager {
  constructor(timeoutMs = 30 * 60 * 1000) {
    this.timeoutMs = timeoutMs;
    this.warnMs = timeoutMs - 5 * 60 * 1000;
    this.idleTime = 0;
    this.timers = new Map();
    this.listeners = new Set();
    
    this._startIdleTracker();
  }
  
  _startIdleTracker() {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(evt => {
      document.addEventListener(evt, () => this._resetIdle());
    });
    this._resetIdle();
  }
  
  _resetIdle() {
    this.idleTime = 0;
    clearInterval(this.timers.poll);
    clearInterval(this.timers.warn);
    
    this.timers.poll = setInterval(() => {
      this.idleTime += 1000;
      if (this.idleTime >= this.timeoutMs) {
        this._expire();
      }
    }, 1000);
    
    if (this.idleTime < this.warnMs) {
      this.timers.warn = setInterval(() => {
        if (this.idleTime >= this.warnMs) {
          this._showWarning();
        }
      }, 1000);
    }
  }
  
  _showWarning() {
    this.listeners.forEach(l => l('warning', this.timeoutMs - this.idleTime));
  }
  
  _expire() {
    this.listeners.forEach(l => l('expired'));
    clearInterval(this.timers.poll);
    clearInterval(this.timers.warn);
  }
  
  extend() {
    this._resetIdle();
  }
  
  on(event, listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
```

---

*Skill Templates Version: 1.0*
*Source: Adapted from anti-gravity-ide builtin patterns*
