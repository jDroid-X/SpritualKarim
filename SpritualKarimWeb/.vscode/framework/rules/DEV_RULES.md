# Development Rules — Hard Constraints

Non-negotiable rules adapted from GEMINI.md governance for web development.
Violation = immediate revert + security review.

---

## RULE-001: No Hardcoded Credentials

**Status**: CRITICAL
**Scanner**: `grep -rn "password\|secret\|api_key\|token" src/ --include="*.js"`

```javascript
// ❌ NEVER
const API_KEY = "sk_live_abc123";
const password = "admin123";

// ✅ ALWAYS
import { APP_CONFIG } from '../config/appConfig.js';
const apiKey = APP_CONFIG.apiKeys.production;
```

**Exceptions**: Demo/mock data must be clearly marked with `DEMO_MODE = true` flag.

---

## RULE-002: Single Source of Truth

**Status**: CRITICAL
**Enforcement**: All constants in `appConfig.js`

```javascript
// ❌ DUPLICATE
// In file A
const ROLES = ['MASTER', 'ADMIN', 'USER'];
// In file B  
const ROLES = ['MASTER', 'ADMIN', 'USER'];  // Duplicated!

// ✅ SINGLE SOURCE
// In appConfig.js
export const APP_CONFIG = { roles: ['MASTER', 'ADMIN', 'USER'] };
// In file A and B
import { APP_CONFIG } from '../config/appConfig.js';
const ROLES = APP_CONFIG.roles;
```

---

## RULE-003: MVC Layer Boundaries

**Status**: CRITICAL
**Checker**: Architect agent validation

| Layer | Can Import | Cannot Import |
|-------|-----------|---------------|
| Model | Config, Utils | View, Controller |
| View | Model (read-only), Config | Controller (direct), DB |
| Controller | Model, View, Config | DB directly |

```javascript
// ❌ VIOLATION — View has business logic
class MyView {
  calculateCommission(amount) { ... }  // Should be in Model
}

// ✅ CORRECT — View only renders
class MyView {
  render(data) { ... }  // Pure presentation
}
```

---

## RULE-004: XSS Prevention Mandatory

**Status**: CRITICAL
**Scanner**: `grep -rn "innerHTML" src/ --include="*.js"`

```javascript
// ❌ DANGEROUS
element.innerHTML = userInput;

// ✅ SAFE
element.textContent = escapeHtml(userInput);
// OR
element.innerHTML = DOMPurify.sanitize(userInput);
```

**Exception**: Trusted HTML templates (not user input) may use innerHTML with explicit comment `// TRUSTED_HTML`.

---

## RULE-005: RBAC Matrix Coverage

**Status**: HIGH
**Validation**: Every new UI element must have auth matrix entry

```javascript
// When adding new element, update matrix:
{
  id: 'new-feature-btn',
  label: 'New Feature',
  category: 'actions',
  MASTER: { hide: false, disabled: false },
  ADMIN: { hide: false, disabled: false },
  MAHAMANA: { hide: true, disabled: true },
  // ... all roles
  portalVisible: {
    admin: true,
    mahamana: false,
    // ... all portals
  }
}
```

---

## RULE-006: localStorage Key Naming Convention

**Status**: HIGH
**Pattern**: `sk_[domain]_[entity]_v[n]`

```javascript
// ❌ BAD KEYS
localStorage.setItem('userData', ...);
localStorage.setItem('profiles', ...);

// ✅ GOOD KEYS
localStorage.setItem('sk_profiles_v3', ...);
localStorage.setItem('sk_auth_matrix_v5', ...);
```

**Version suffix** required for migration tracking.

---

## RULE-007: Dual-Write Sync Pattern

**Status**: HIGH
**Enforcement**: All persistent writes must update both keys

```javascript
_saveData(key, data) {
  // Primary storage
  localStorage.setItem(`sk_${key}`, JSON.stringify(data));
  // Sync key for Firebase/migration
  localStorage.setItem(`firebase_${key}`, JSON.stringify(data));
  // Timestamp for power-loss detection
  localStorage.setItem('sk_last_write_ts', Date.now().toString());
}
```

---

## RULE-008: Event Listener Lifecycle

**Status**: MEDIUM
**Rule**: Every addEventListener must have corresponding removeEventListener

```javascript
class MyComponent {
  init() {
    this._bindEvents();
  }
  
  _bindEvents() {
    document.addEventListener('click', this._handleClick);
  }
  
  destroy() {
    document.removeEventListener('click', this._handleClick);
  }
}
```

**Check**: `grep -rn "addEventListener" src/ | wc -l` should equal `grep -rn "removeEventListener" src/ | wc -l`

---

## RULE-009: Error Handling Coverage

**Status**: MEDIUM
**Rule**: All async operations must have try/catch + finally

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('[FETCH_ERROR]', url, error);
    throw error;  // Re-throw for caller handling
  } finally {
    setLoading(false);  // Always cleanup
  }
}
```

---

## RULE-10: Input Sanitization at Collection Time

**Status**: HIGH
**Rule**: Sanitize immediately when receiving input, not just before display

```javascript
// ❌ LATE sanitization
input.addEventListener('input', (e) => {
  this.rawInput = e.target.value;  // Raw input stored
});
// Later...
display(escapeHtml(this.rawInput));  // Too late if raw stored

// ✅ EARLY sanitization
input.addEventListener('input', (e) => {
  this.rawInput = e.target.value;
  this.displayInput = escapeHtml(e.target.value);  // Sanitize immediately
});
```

---

## RULE-11: No Orphaned State

**Status**: MEDIUM
**Validation**: All state must have cleanup path

```javascript
// State object must track its lifecycle
class AppState {
  constructor() {
    this.listeners = new Set();
  }
  
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);  // Cleanup function
  }
  
  destroy() {
    this.listeners.clear();
    this.data = null;  // Allow GC
  }
}
```

---

## RULE-12: Cross-Portal Consistency

**Status**: HIGH
**Rule**: Changes to shared components must propagate to all portals

```javascript
// Shared config updated once
// appConfig.js
export const APP_CONFIG = {
  portals: {
    admin: { name: 'Admin', route: '/admin' },
    mahamana: { name: 'Mahamana', route: '/mahamana' },
    // ... all 7 portals
  }
};

// Each portal index.html imports same config
import { APP_CONFIG } from '../js/config/appConfig.js';
```

---

## RULE-13: Demo Mode Isolation

**Status**: MEDIUM
**Rule**: Demo features must not affect production code paths

```javascript
const isDemo = window.location.hostname === 'localhost' || 
               APP_CONFIG.demoMode === true;

if (isDemo) {
  // Demo-only code (CAPTCHA simulation, mock data)
} else {
  // Production code (real CAPTCHA, real API calls)
}
```

---

## RULE-14: RAG Report Minimum

**Status**: HIGH
**Rule**: Every feature change requires minimum 20 test scenarios

```markdown
## RAG Report: [Feature Name]

| ID | Scenario | Condition | Validation | Status | Reason | Impact | Solution |
|----|----------|-----------|------------|--------|--------|--------|----------|
...

Summary: X/20 tests passing
Critical Issues: N
High Priority: N
```

---

## RULE-15: Human-in-the-Loop Checkpoint

**Status**: MEDIUM
**Rule**: Critical changes require human confirmation

```javascript
// Before destructive operations
if (isDestructiveChange(action)) {
  const confirmed = await promptUserConfirmation({
    title: 'Confirm Action',
    message: action.description,
    options: ['Proceed', 'Cancel']
  });
  if (!confirmed) throw new Error('User cancelled');
}
```

---

## Compliance Scanning Commands

```bash
# Rule-001: Hardcoded credentials
grep -rn "password\s*=\s*['\"]" src/ --include="*.js"

# Rule-004: XSS vulnerabilities
grep -rn "\.innerHTML\s*=" src/ --include="*.js"

# Rule-008: Event listener balance
echo "Adds: $(grep -rn addEventListener src/ | wc -l)"
echo "Removes: $(grep -rn removeEventListener src/ | wc -l)"

# Rule-006: localStorage key convention
grep -rn "localStorage\.setItem" src/ | grep -v "sk_\|firebase_"
```

---

*Rules Version: 1.0*
*Derived from: GEMINI.md Governance Framework*
*Adapted for: Web Development (MVC/MVVM)*
