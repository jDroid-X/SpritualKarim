# Project Onboarding Guide

Step-by-step guide for initializing a new project with the Universal Development Framework.

---

## Phase 1: Foundation (Day 1)

### 1.1 Create Project Structure

```bash
# Copy framework from template project
cp -r ExistingProject/.vscode/framework/ NewProject/.vscode/

# Copy global instructions if available
mkdir -p ~/.github
cp ~/.github/copilot-instructions.md NewProject/.github/ 2>/dev/null || true

# Create project root files
touch NewProject/CLAUDE.md
touch NewProject/package.json
touch NewProject/.env
```

### 1.2 Initialize Configuration

Edit `NewProject/js/config/appConfig.js`:

```javascript
export const APP_CONFIG = {
  // Project identifier
  projectName: 'My New Project',
  projectPrefix: 'mnp',  // localStorage key prefix
  
  // Portal configuration
  portals: {
    admin: { name: 'Admin', route: '/admin' },
    user: { name: 'User', route: '/user' },
    public: { name: 'Public', route: '/' }
  },
  
  // Role hierarchy
  roles: ['MASTER', 'ADMIN', 'USER'],
  
  // Auth matrix elements (auto-generated IDs)
  authElements: [
    { id: 'tab-dashboard', label: 'Dashboard', category: 'navigation' },
    { id: 'btn-create', label: 'Create New', category: 'actions' }
  ],
  
  // Security settings
  sessionTimeoutMs: 30 * 60 * 1000,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  
  // Demo mode flags
  demoMode: true,
  mockData: true
};
```

### 1.3 Set Up Version Control

```bash
cd NewProject
git init
git add .
git commit -m "Initial project setup with Universal Framework"
```

---

## Phase 2: Agent Configuration (Day 1-2)

### 2.1 Define Custom Agent Roles

Edit `NewProject/.vscode/framework/agents/AGENT_ROLES.md` append section:

```markdown
## Custom Roles for [Project Name]

### role-name
- **Activation**: When user requests [specific action]
- **Responsibility**: [what this agent does]
- **Output**: [artifact produced]
- **Handoff to**: [next agent/role]
```

### 2.2 Configure Project-Specific Workflows

Add workflow files to `NewProject/.vscode/framework/workflows/`:
- `DOMAIN_WORKFLOW.md` — Industry/domain-specific processes
- `RELEASE_PROCESS.md` — Deployment checklist for this project

---

## Phase 3: Development Setup (Day 2-3)

### 3.1 Install Dependencies

```bash
npm install
npm run init:validate
```

### 3.2 Run Health Check

```bash
npm run health-check
```

Expected output: All systems green.

### 3.3 Create First Feature Branch

```bash
git checkout -b feature/initial-setup
```

---

## Phase 4: First Implementation (Day 3-5)

### 4.1 Create Model Layer

```javascript
// js/models/BaseModel.js
import { APP_CONFIG } from '../config/appConfig.js';

export class BaseModel {
  constructor(storageKey) {
    this.storageKey = APP_CONFIG.projectPrefix + '_' + storageKey;
    this.data = this._load();
  }
  
  _load() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }
  
  _save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    localStorage.setItem('firebase_' + this.storageKey, JSON.stringify(this.data));
    localStorage.setItem('sk_last_write_ts', Date.now().toString());
  }
}
```

### 4.2 Create View Layer

```javascript
// js/views/BaseView.js
import { escapeHtml } from '../utils/sanitizer.js';

export class BaseView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }
  
  render(html) {
    // Always sanitize before inserting
    this.container.innerHTML = this._sanitize(html);
  }
  
  _sanitize(input) {
    return escapeHtml(input);
  }
}
```

### 4.3 Create Controller Layer

```javascript
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
}
```

---

## Phase 5: Validation (Day 5-7)

### 5.1 Generate Initial RAG Report

Run: `npm run rag-audit`

Ensure minimum 20 test scenarios covering:
- Role-based access control
- Data persistence
- Cross-browser compatibility
- Responsive design
- Security checks

### 5.2 Cross-Portal Testing

Test each portal configuration:
- Admin portal — full access
- User portal — restricted access
- Public portal — minimal access

### 5.3 Security Audit

Run security checks:
- XSS prevention verified
- RBAC matrix complete
- Session management working
- Input sanitization applied

---

## Phase 6: Documentation (Day 7)

### 6.1 Update CLAUDE.md

Add project-specific sections:
- Architecture decisions
- Custom patterns used
- Known limitations
- Future enhancements

### 6.2 Create README.md

Include:
- Project overview
- Installation steps
- Development workflow
- Framework usage guide

---

## Onboarding Checklist

- [ ] Framework copied to .vscode/framework/
- [ ] Global instructions in place
- [ ] appConfig.js configured
- [ ] Git initialized
- [ ] Dependencies installed
- [ ] Health check passing
- [ ] First feature implemented
- [ ] RAG report generated (20+ scenarios)
- [ ] Cross-portal testing complete
- [ ] Security audit passed
- [ ] Documentation updated

---

*Framework Onboarding Guide v1.0*
