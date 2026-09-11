# Integration Guide — Adopting Framework for New Projects

This guide explains how to adopt the Universal Development Framework for any new VS Code project.

---

## What Is This Framework•

A reusable set of development rules, agent definitions, workflows, and skill templates derived from the Anti-Gravity IDE governance model. It makes AI-assisted development **consistent, secure, and maintainable** across all projects.

---

## File Locations & Purposes

| Location | Purpose | Scope |
|----------|---------|-------|
| `~/.github/copilot-instructions.md` | Global Copilot instructions | All projects on your machine |
| `project/CLAUDE.md` | Project-specific governance | Single project |
| `project/.vscode/framework/` | Reusable patterns, agents, rules | Copy to new projects |
| `project/docs/framework/` | Integration documentation | Reference only |

---

## Step-by-Step Adoption

### Step 1: Copy Framework to New Project

```bash
# From template project to new project
cp -r ExistingProject/.vscode/framework/ NewProject/.vscode/

# Copy CLAUDE.md template
cp ExistingProject/CLAUDE.md NewProject/
```

### Step 2: Customize Global Instructions (One-Time)

Edit `~/.github/copilot-instructions.md` with your preferred:
- Default agent roles
- Preferred tech stack
- Common patterns

### Step 3: Create Project-Specific CLAUDE.md

Modify `NewProject/CLAUDE.md`:
1. Update "Project Overview" section
2. Add project-specific architecture patterns
3. Define custom agent roles if needed
4. Add domain-specific security rules

### Step 4: Configure appConfig.js

Create or update `js/config/appConfig.js`:
```javascript
export const APP_CONFIG = {
  projectName: 'My New Project',
  projectPrefix: 'mnp',           // localStorage prefix
  portals: { ... },               // Portal configuration
  roles: ['MASTER', 'ADMIN', ...], // Role hierarchy
  authElements: [...],            // Auth matrix elements
  sessionTimeoutMs: 30 * 60 * 1000,
  demoMode: true
};
```

### Step 5: Run Initialization Checks

```bash
npm run init:validate    # Check dependencies
npm run health-check     # Verify project structure
npm run rag-audit        # Generate initial RAG report
```

---

## Integration with VS Code Features

### IntelliSense / Completion
- Type definitions in `skills/SKILL_TEMPLATES.md`
- Import patterns documented in each skill file

### Git Hooks
```bash
# Pre-commit validation (add to package.json scripts)
"pre-commit": "npm run validate-integrations && npm run rag-audit"
```

### Task Runner
Add to `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run RAG Audit",
      "type": "shell",
      "command": "npm run rag-audit"
    },
    {
      "label": "Validate Integrations",
      "type": "shell",
      "command": "npm run validate-integrations"
    }
  ]
}
```

### Extensions Recommendation
Add `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-python.python",
    "ms-vscode.vscode-github-pr-viewer"
  ]
}
```

---

## Agent Activation Triggers

Copilot automatically activates agents based on context:

| User Request | Activated Agent |
|-------------|-----------------|
| "Set up new project" | initiator + architect |
| "Design the database" | db-engineer |
| "Fix the login bug" | backend-dev + security-auditor |
| "Improve the UI" | ux-designer + frontend-dev |
| "Deploy to production" | devops + qa-engineer |
| "Write tests" | qa-engineer |
| "Review this PR" | code-reviewer |

---

## Customization Guide

### Adding New Agent Roles

Edit `agents/AGENT_ROLES.md`:
```markdown
## Custom Role: [role-name]
- **Trigger**: [when this agent activates]
- **Tools**: [VS Code tools used]
- **Responsibilities**: [bullet list]
- **Output Artifacts**: [files/documents produced]
```

### Adding New Workflow Stages

Edit `workflows/SEVEN_STAGE_WATERFALL.md` append section:
```markdown
## Stage N: [Stage Name]
[Details...]
```

### Adding New Development Rules

Edit `rules/DEV_RULES.md` append section:
```markdown
## RULE-XXX: [Rule Name]
**Status**: CRITICAL/HIGH/MEDIUM
[Details...]
```

---

## Cross-Project Consistency

When maintaining multiple projects:

1. **Share framework updates**: Update `framework/` in one project, then sync to others
2. **Unified RAG format**: All projects use same RAG report template
3. **Consistent naming**: Follow `sk_` prefix convention across projects
4. **Shared skills**: Copy new skill patterns back to template project

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Copilot not following rules | Check CLAUDE.md exists in project root |
| Agents not activating | Verify trigger keywords match AGENT_ROLES.md |
| Framework files missing | Re-run Step 1 copy operation |
| RAG report incomplete | Ensure minimum 20 test scenarios |

---

*Integration Guide Version: 1.0*
*Last Updated: 2025-07-23*
