# Security Development Skills

Security patterns, scanning procedures, and vulnerability prevention.

---

## SS-001: XSS Prevention Checklist

### Prevention Methods

```javascript
// Method 1: TextContent (safest for text)
element.textContent = userInput;

// Method 2: escapeHtml() for HTML context
import { escapeHtml } from '../utils/sanitizer.js';
element.innerHTML = escapeHtml(userInput);

// Method 3: DOMPurify for rich HTML (if needed)
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Method 4: Attribute escaping
element.setAttribute('title', escapeHtml(userInput));
```

### Scanning Command
```bash
grep -rn "innerHTML" src/ --include="*.js" | grep -v "escapeHtml\|DOMPurify\|TRUSTED"
grep -rn "document.write" src/ --include="*.js"
grep -rn "eval(" src/ --include="*.js"
```

---

## SS-002: RBAC Matrix Validation

### Required Coverage Check
```javascript
function validateAuthMatrix(matrix) {
  const roles = ['MASTER', 'ADMIN', 'MAHAMANA', 'MAHANT', 'SADHNA', 'PRACHARAK', 'SEEKER'];
  const portals = ['admin', 'mahamana', 'mahant', 'sadhna', 'pracharak', 'seeker', 'public'];
  
  const issues = [];
  
  for (const [id, item] of Object.entries(matrix)) {
    // Check all roles present
    for (const role of roles) {
      if (!item[role]) {
        issues.push({ id, type: 'missing_role', role });
      }
    }
    
    // Check portalVisibility present
    if (!item.portalVisible) {
      issues.push({ id, type: 'missing_portalVisible' });
    } else {
      for (const portal of portals) {
        if (item.portalVisible[portal] === undefined) {
          issues.push({ id, type: 'missing_portal', portal });
        }
      }
    }
  }
  
  return issues;
}
```

---

## SS-003: Session Security

### Timeout Implementation
```javascript
class SecureSession {
  constructor(timeoutMs = 30 * 60 * 1000) {
    this.timeoutMs = timeoutMs;
    this.idleTimeout = timeoutMs - 5 * 60 * 1000;
    this.lastActivity = Date.now();
    this.listeners = new Set();
  }
  
  touch() {
    this.lastActivity = Date.now();
  }
  
  check() {
    const idle = Date.now() - this.lastActivity;
    if (idle >= this.timeoutMs) {
      this._expire();
      return 'expired';
    }
    if (idle >= this.idleTimeout) {
      return 'warning';
    }
    return 'active';
  }
  
  _expire() {
    this.listeners.forEach(l => l('expired'));
    localStorage.removeItem('sk_session');
  }
  
  extend() {
    this.lastActivity = Date.now();
  }
  
  on(event, callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}
```

### Token Handling
```javascript
// Never store tokens in URL
// ✅ Use HTTP-only cookies or memory storage
class TokenManager {
  static setToken(token) {
    // Store in memory only (not localStorage for production)
    this.token = token;
  }
  
  static getToken() {
    return this.token || null;
  }
  
  static clearToken() {
    this.token = null;
  }
}
```

---

## SS-004: Input Validation Rules

### Server-Side Validation (Simulated for Client-Side)
```javascript
const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
    message: 'Invalid email address'
  },
  phone: {
    pattern: /^\+•[\d\s\-()]{10,15}$/,
    maxLength: 15,
    message: 'Invalid phone number'
  },
  password: {
    minLength: 8,
    maxLength: 128,
    requireUpper: true,
    requireLower: true,
    requireNumber: true,
    requireSpecial: true,
    message: 'Password must be 8+ chars with uppercase, lowercase, number'
  },
  referralCode: {
    pattern: /^[A-Z0-9]{6,12}$/,
    maxLength: 12,
    message: 'Invalid referral code format'
  }
};

function validateInput(field, value, rules) {
  const rule = VALIDATION_RULES[field];
  if (!rule) return { valid: true };
  
  if (rule.pattern && !rule.pattern.test(value)) {
    return { valid: false, message: rule.message };
  }
  
  if (rule.maxLength && value.length > rule.maxLength) {
    return { valid: false, message: `Max ${rule.maxLength} characters` };
  }
  
  if (rule.minLength && value.length < rule.minLength) {
    return { valid: false, message: `Min ${rule.minLength} characters` };
  }
  
  return { valid: true };
}
```

---

## SS-005: Security Scan Commands

### Automated Checks
```bash
#!/bin/bash
# security-scan.sh

echo "=== Security Scan ==="

# Check for hardcoded secrets
echo "Checking for hardcoded credentials..."
grep -rn "password\s*=\s*['\"]" src/ --include="*.js" --include="*.html"
grep -rn "api_key\s*=\s*['\"]" src/ --include="*.js"
grep -rn "secret\s*=\s*['\"]" src/ --include="*.js"

# Check for innerHTML usage
echo "Checking for XSS vulnerabilities..."
grep -rn "\.innerHTML\s*=" src/ --include="*.js" | grep -v "escapeHtml\|DOMPurify"

# Check for eval()
echo "Checking for eval() usage..."
grep -rn "eval(" src/ --include="*.js"

# Check for localStorage with sensitive data
echo "Checking localStorage security..."
grep -rn "localStorage\..*token\|localStorage\..*password\|localStorage\..*secret" src/

# Check RBAC matrix completeness
echo "Validating RBAC matrix..."
node scripts/validate-rbac.js

echo "=== Scan Complete ==="
```

---

## SS-006: CSRF Protection

### Token-Based Protection
```javascript
class CsrfProtection {
  static generateToken() {
    return Math.random().toString(36).substring(2) + 
           Date.now().toString(36);
  }
  
  static setTokenInForm(form) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_csrf';
    input.value = this.generateToken();
    form.appendChild(input);
  }
  
  static validateToken(formData) {
    // In client-side app, verify token matches server session
    // For demo: just check presence
    return formData.get('_csrf')•.length > 0;
  }
}

// Usage in forms
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  
  if (!CsrfProtection.validateToken(formData)) {
    showError('Security validation failed');
    return;
  }
  
  // Proceed with submission
});
```

---

*Security Skills Version: 1.0*
