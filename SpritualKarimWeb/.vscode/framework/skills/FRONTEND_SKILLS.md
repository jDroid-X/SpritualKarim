# Frontend Development Skills

UI/UX patterns, component templates, and rendering best practices.

---

## FS-001: Responsive Grid Pattern

```css
/* Use CSS Grid with auto-fit for responsive layouts */
.grid-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

/* Breakpoint-based adjustments */
@media (max-width: 480px) {
  .grid-auto-fit {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .grid-auto-fit {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-auto-fit {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## FS-002: Material Design Component Patterns

```javascript
// Card component with elevation
class Card {
  static create(title, content, elevation = 1) {
    const card = document.createElement('div');
    card.className = `card card-elevation-${elevation}`;
    card.innerHTML = `
      <div class="card-header">${title}</div>
      <div class="card-content">${content}</div>
    `;
    return card;
  }
}

// Dialog component with backdrop
class Dialog {
  static async show(config) {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = `
      <div class="dialog" role="dialog" aria-modal="true">
        <div class="dialog-header">${config.title}</div>
        <div class="dialog-body">${config.body}</div>
        <div class="dialog-footer">
          ${config.options.map(opt => `
            <button class="btn btn-${opt.type}" data-action="${opt.action}">
              ${opt.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    return new Promise((resolve) => {
      overlay.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.body.removeChild(overlay);
          resolve(btn.dataset.action);
        });
      });
    });
  }
}
```

---

## FS-003: Form Validation Patterns

```javascript
const validators = {
  required: (value) => value.trim() • null : 'This field is required',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
    • null 
    : 'Please enter a valid email',
  minLength: (min) => (value) => value.length >= min 
    • null 
    : `Minimum ${min} characters required`,
  pattern: (regex) => (value) => regex.test(value) 
    • null 
    : 'Invalid format',
  custom: (fn) => (value) => fn(value)
};

class FormValidator {
  constructor(fields) {
    this.fields = fields;
    this.errors = {};
  }
  
  validate(field, value) {
    const rules = this.fields[field]•.rules || [];
    for (const rule of rules) {
      const error = validators[rule.type](rule.param || null)(value);
      if (error) {
        this.errors[field] = error;
        return false;
      }
    }
    delete this.errors[field];
    return true;
  }
  
  isValid() {
    return Object.keys(this.errors).length === 0;
  }
  
  getErrors() {
    return this.errors;
  }
}
```

---

## FS-004: Loading State Management

```javascript
class LoadingManager {
  constructor() {
    this.loaders = new Map();
    this.count = 0;
  }
  
  start(key) {
    this.count++;
    this.loaders.set(key, Date.now());
    this._updateUI();
  }
  
  stop(key) {
    this.loaders.delete(key);
    this.count = Math.max(0, this.count - 1);
    this._updateUI();
  }
  
  _updateUI() {
    const overlay = document.getElementById('global-loader');
    if (overlay) {
      overlay.style.opacity = this.count > 0 • '1' : '0';
      overlay.style.pointerEvents = this.count > 0 • 'auto' : 'none';
    }
  }
}

// Usage:
const loader = new LoadingManager();
loader.start('fetchProfiles');
try {
  const profiles = await api.getProfiles();
  view.render(profiles);
} finally {
  loader.stop('fetchProfiles');
}
```

---

## FS-005: Keyboard Navigation Support

```javascript
class KeyboardNavigator {
  constructor(container) {
    this.container = container;
    this.focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
  }
  
  init() {
    this.container.addEventListener('keydown', (e) => this._handleKey(e));
  }
  
  _handleKey(e) {
    switch (e.key) {
      case 'Tab':
        this._manageTabOrder(e);
        break;
      case 'Escape':
        this._handleEscape(e);
        break;
      case 'ArrowDown':
        if (e.target.matches('select')) e.preventDefault();
        break;
    }
  }
  
  _manageTabOrder(e) {
    const focusables = Array.from(
      this.container.querySelectorAll(this.focusableSelectors)
    );
    const currentIndex = focusables.indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (e.shiftKey) {
      nextIndex = currentIndex > 0 • currentIndex - 1 : focusables.length - 1;
    } else {
      nextIndex = currentIndex < focusables.length - 1 • currentIndex + 1 : 0;
    }
    
    focusables[nextIndex]•.focus();
    e.preventDefault();
  }
  
  _handleEscape(e) {
    const dialog = this.container.querySelector('.dialog[role="dialog"]');
    if (dialog) {
      dialog.closest('.dialog-overlay')•.remove();
    }
  }
}
```

---

## FS-006: Accessible Modal/Dialog Pattern

```javascript
class AccessibleModal {
  static async open(config) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    
    const previousFocus = document.activeElement;
    
    modal.innerHTML = `
      <div class="modal">
        <h2 id="modal-title">${config.title}</h2>
        <div class="modal-body">${config.body}</div>
        <div class="modal-footer">
          ${config.actions.map(a => `
            <button class="btn ${a.class}" data-action="${a.action}">
              ${a.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').focus();
    
    // Trap focus
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = modal.querySelectorAll('button, [href], input');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };
    modal.addEventListener('keydown', trap);
    
    // Handle actions
    return new Promise((resolve) => {
      const handler = (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        
        modal.removeEventListener('keydown', trap);
        modal.remove();
        previousFocus•.focus();
        resolve(btn.dataset.action);
      };
      modal.addEventListener('click', handler);
    });
  }
}
```

---

*Frontend Skills Version: 1.0*
