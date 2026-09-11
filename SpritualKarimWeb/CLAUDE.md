# Spritual Karim Sansthan — Project Governance & Development Standards

This file defines the development standards, architecture patterns, and AI agent
behaviors for the Spritual Karim web application. It supersedes generic guidelines
and contains project-specific extensions.

> **⚠️ Read before making any code changes.** This document encodes critical project
> knowledge that prevents regression bugs and architectural drift.

---

## 1. Project Overview

**Name**: Shree Spritual Karim Sansthan (Portal MLM Platform)
**Architecture**: Multi-portal single-page application (74-tier RBAC)
**Stack**: Vanilla JS (MVC/MVVM), HTML5, CSS3, LocalStorage + Firebase sync
**Portals**: Admin, Mahamana, Mahant, Sadhna, Pracharak, Seeker, Public

---

## 2. Architecture Patterns (Enforced)

### 2.1 MVC / MVVM Hybrid

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| Model | `js/models/` | Data storage, validation, business rules |
| View | `js/views/` | DOM rendering, UI state, event binding |
| Controller | `js/controllers/` | Event dispatch, coordination, routing |
| Config | `js/config/` | Centralized constants (`appConfig.js`) |
| Utils | `js/utils/` | Helpers (`escapeHtml`, `debounce`, etc.) |

**Rule**: Never put business logic in View files. Never put DOM manipulation in Model.

### 2.2 Auth Matrix Structure

The core authorization system uses `item[ROLE]` (NOT `item.roles.ROLE`):

```javascript
// ✅ CORRECT — flat structure keyed by role
{
  id: "tab-dashboard",
  label: "Dashboard",
  MASTER: { hide: false, disabled: false },
  ADMIN: { hide: false, disabled: false },
  MAHAMANA: { hide: true, disabled: true },
  // ...
}

// ❌ WRONG — nested structure (causes silent auth bypass)
{
  id: "tab-dashboard",
  roles: {
    MASTER: { hide: false }  // THIS NEVER WORKS
  }
}
```

**LocalStorage Keys**:
- `sk_auth_matrix_v5` — Element visibility per role per portal
- `sk_admin_profiles_v3` — User profile data
- `sk_pairing_invites` — Pending invitation codes

### 2.3 Dual-Write Sync Strategy

All persistent data writes to **two locations simultaneously**:

```javascript
// Write pattern
localStorage.setItem('sk_data_key', JSON.stringify(data));
localStorage.setItem('firebase_data_key', JSON.stringify(data));

// Read pattern (merge both sources)
const local = JSON.parse(localStorage.getItem('sk_data_key') || '{}');
const firebase = JSON.parse(localStorage.getItem('firebase_data_key') || '{}');
return mergeDeep(local, firebase);  // Firebase wins on conflict
```

### 2.4 Power-Loss Detection

Poll every 15 seconds to detect unsaved changes after browser close:

```javascript
setInterval(() => {
  const lastWrite = parseInt(localStorage.getItem('sk_last_write_ts') || '0');
  if (Date.now() - lastWrite > 15000) {
    console.warn('[POWER_LOSS_DETECTED] Unsaved changes may be lost');
  }
}, 15000);
```

---

## 3. Security Rules (Critical)

### 3.1 XSS Prevention

**ALL user input must pass through `escapeHtml()` before rendering:**

```javascript
import { escapeHtml } from '../utils/sanitizer.js';

// ❌ NEVER DO THIS
element.innerHTML = userInput;

// ✅ ALWAYS DO THIS
element.textContent = escapeHtml(userInput);
```

### 3.2 RBAC Enforcement

Every portal must check `portalVisible` at load time:

```javascript
// In each portal's index.html, BEFORE any UI renders
const portal = detectCurrentPortal();
const matrix = getAuthMatrix();
Object.keys(matrix).forEach(id => {
  const item = matrix[id];
  if (!item.portalVisible•.[portal]) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
});
```

### 3.3 Role Hierarchy

```
MASTER > ADMIN > MAHAMANA > MAHANT > SADHNA > PRACHARAK > SEEKER
```

- MASTER can modify anything
- ADMIN can manage sub-roles below them
- MAHAMANA+ can view but not modify RBAC settings
- Lower roles see progressively fewer elements

### 3.4 Session Management

```javascript
// Demo mode session timeout
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_WARN_MS = 25 * 60 * 1000;    // Warn at 25 min

// Production should use server-side sessions
```

---

## 4. UI/UX Standards

### 4.1 Material Design Compliance

- Use semantic HTML (`<button>`, `<input type="email">`, etc.)
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus visible styles for accessibility

### 4.2 Responsive Breakpoints

| Breakpoint | Max Width | Target |
|-----------|-----------|--------|
| Mobile | ≤ 480px | Phone |
| Tablet | ≤ 768px | Tablet |
| Desktop | ≤ 1024px | Laptop |
| Large | > 1024px | Desktop |

### 4.3 Slim Compact Design

Per Gemini rules, prefer vertical compact layouts:
- Reduced padding (8px → 4px)
- Smaller font sizes for labels (12px → 11px)
- Multi-row card layouts
- Collapsible sections for dense data

---

## 5. Registration Workflow (4 Systems)

| System | Entry Point | Flow |
|--------|------------|------|
| Direct Admin | Admin dashboard → Add Profile | 1 step, immediate active |
| Seeker Self-Reg | `join.html` wizard | 4 steps: Details → Sponsor → Consent → Confirmation |
| Admin Pairing Invite | `pairing-invite.html` | 2 steps: Verify PIN → Complete registration |
| Post-Creation Onboard | `profile-create.html` → redirect | 1 step: Accept invite, set credentials |

**Duplicate Prevention**: `findDuplicateProfile()` checks email + phone across all records.

---

## 6. File Structure Convention

```
project-root/
├── .vscode/
│   ├── settings.json              # Workspace settings
│   └── framework/                 # Reusable framework (COPY TO NEW PROJECTS)
│       ├── README.md
│       ├── workflows/
│       ├── agents/
│       ├── skills/
│       └── rules/
├── js/
│   ├── config/appConfig.js        # ALL constants live here
│   ├── models/
│   ├── views/
│   ├── controllers/
│   └── utils/
├── css/
├── index.html                     # Default portal
├── [portal]-index.html            # Other portals
├── rbac-admin.html                # Standalone RBAC admin
├── join.html                      # Registration wizard
├── login.html                     # Login page
├── CLAUDE.md                      # This file
└── package.json
```

---

## 7. RAG Report Standards

Every feature change MUST generate a RAG report table:

| Column | Description |
|--------|-------------|
| ID | Unique test identifier |
| Scenario | What is being tested |
| Condition | Input/preconditions |
| Validation | Expected outcome |
| Status | ✅ Pass / ⚠️ Fail / 🔴 Critical Fail |
| Reason | Why it passed/failed |
| Impact | Severity if failing |
| Solution | Fix if failed |

**Minimum 20 scenarios per major feature.** See existing reports for format examples.

---

## 8. AI Agent Behavior Rules

When working on this project, Copilot must:

1. **Read CLAUDE.md first** before any code changes
2. **Follow MVC boundaries** — never mix layer responsibilities
3. **Use `appConfig.js`** — never hardcode values that belong in config
4. **Generate RAG report** — after any feature addition/modification
5. **Check auth matrix** — verify new UI elements are covered
6. **Validate localStorage keys** — ensure naming convention compliance
7. **Test cross-portal** — verify changes work in all 7 portals
8. **Preserve dual-write** — don't remove Firebase sync keys

---

## 9. Common Pitfalls (Learned Bugs)

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Auth matrix not enforcing portal visibility | Missing `portalVisible` check at render time | Add gate enforcement in `_renderElementList()` |
| Duplicate profiles created | Race condition in form submit | Debounce submit handler + `findDuplicateProfile()` |
| Tab routing broken after refresh | Hash not parsed on load | Call `_handleHashRouting()` in constructor |
| Settings modal shows wrong role data | Override ID mismatch (`tree_hierarchy` vs profile ID) | Use `profile.id` from selected row |
| Hardcoded values in form validation | Values copied from another project | Extract to `appConfig.js` constants |
| Multiple form submissions on join | Two submit event listeners | Remove one, use single delegated handler |

---

## 10. Change Process

1. **Identify** — Which layer (Model/View/Controller/Config)•
2. **Check** — Is this value already in `appConfig.js`•
3. **Implement** — Follow MVC boundaries strictly
4. **Validate** — Run targeted tests + update RAG report
5. **Integrate** — Check all 7 portals for consistency
6. **Document** — Update this CLAUDE.md if pattern changes

---

*Framework version: 1.0 | Last updated: 2025-07-23*
*Source: Adapted from GEMINI.md — Anti-Gravity IDE Governance*
