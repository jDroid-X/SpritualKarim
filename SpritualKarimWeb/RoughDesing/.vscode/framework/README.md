# Universal Development Framework

A reusable, project-agnostic development framework adapted from the
[Anti-Gravity IDE](https://github.com/jDroid-X/anti-gravity-ide) governance rules.

This framework provides **universal features** that any new project
inherits automatically when copied into the `.vscode/framework/` directory.

---

## 📦 What's Included

| Directory | Contents | Reusable For |
|-----------|----------|--------------|
| `workflows/` | Stage gates, feedback loops, onboarding | Any waterfall or iterative project |
| `agents/` | 22 specialized role definitions | AI-assisted development teams |
| `skills/` | Coding patterns, templates, checklists | Frontend, backend, full-stack |
| `rules/` | Hard constraints, do's/don'ts | All projects (security-critical) |

---

## 🚀 How to Adopt for a New Project

### Step 1: Copy the Framework

```bash
# From this project to your new project
cp -r SpritualKarimWeb/.vscode/framework/ NewProject/.vscode/

# And copy the global instructions
cp ~/.github/copilot-instructions.md NewProject/.github/ 2>/dev/null || true
```

### Step 2: Create Project-Specific Extensions

Create `NewProject/CLAUDE.md` by extending the template:

```markdown
# [Project Name] — Development Standards

## Project-Specific Architecture
[Add your stack, patterns, conventions]

## Custom Agent Roles
[Add roles specific to your domain]

## RAG Report Template
[Customize test scenarios for your features]
```

### Step 3: Run Project Initialization

```bash
npm run init:validate
npm run health-check
```

### Step 4: Define Project Portals/Roles

Update `appConfig.js` with project-specific:
- Portal names and routes
- Role hierarchy
- Auth matrix elements
- localStorage key prefixes

---

## 🏗️ Framework Structure

```
.vscode/framework/
├── README.md                    # This file
├── workflows/
│   ├── SEVEN_STAGE_WATERFALL.md # Core development lifecycle
│   ├── CLOSED_LOOP_FEEDBACK.md  # Validation governance
│   └── PROJECT_ONBOARDING.md    # New project setup guide
├── agents/
│   └── AGENT_ROLES.md           # 22 specialized AI roles
├── skills/
│   ├── SKILL_TEMPLATES.md       # Reusable code patterns
│   ├── FRONTEND_SKILLS.md       # UI/UX patterns
│   ├── BACKEND_SKILLS.md        # API/Business logic patterns
│   └── SECURITY_SKILLS.md       # Security checklist templates
└── rules/
    ├── DEV_RULES.md             # Hard constraints
    └── ARCHITECTURE_RULES.md    # MVC/MVVM enforcement
```

---

## 📋 Universal Features (Always Active)

### 1. Closed-Loop Feedback Governance
Every AI action must have:
- Input validation
- Output verification
- Error recovery path
- Human review checkpoint

### 2. Seven-Stage Waterfall
Initiate → Requirements → Design → Implement → Test → Deploy → Maintain
Each stage has mandatory exit criteria before proceeding.

### 3. Branch Convergence
All logic paths must converge at a validated closure point.
No open loops, no orphaned state.

### 4. Single Source of Truth
One constant per value. If duplicated, call by reference.
Config lives in `appConfig.js` (or equivalent).

### 5. Zero Orphans Policy
- No dangling DOM references
- No unreferenced event listeners
- No unused imports
- No orphaned localStorage keys

### 6. Human-in-the-Loop Accountability
- Every AI-generated change is logged
- Critical changes require human confirmation
- Audit trail preserved in session history

---

## 🔧 Integration with VS Code Tools

| VS Code Feature | Framework Integration |
|----------------|----------------------|
| IntelliSense | Type definitions in `skills/` |
| Git Hooks | Pre-commit validation from `rules/` |
| Tasks | `npm run rag-audit`, `npm run validate-integrations` |
| Extensions | Recommended extensions in `.vscode/extensions.json` |
| Settings | Workspace defaults in `.vscode/settings.json` |
| Copilot Chat | Instructions in `.github/copilot-instructions.md` |

---

## 📊 RAG Report Generation Template

```markdown
## RAG Report: [Feature Name]

| ID | Scenario | Condition | Validation | Status | Reason | Impact | Solution |
|----|----------|-----------|------------|--------|--------|--------|----------|
| T001 | [test name] | [input] | [expected] | ✅ Pass | [why] | [severity] | [fix if needed] |

Summary: X/Y tests passing
Critical Issues: N
High Priority: N
Medium Priority: N
```

---

## 🎯 When to Modify Framework Files

| File Type | When to Modify | Who Approves |
|-----------|---------------|--------------|
| `workflows/*.md` | New stage needed | Tech Lead |
| `agents/*.md` | New role definition | Architecture Review |
| `skills/*.md` | New pattern discovered | Senior Dev |
| `rules/*.md` | Security finding | Security Auditor |
| `CLAUDE.md` | Project-specific changes | Project Owner |

---

## 📖 Related Documentation

- [Integration Guide](../../docs/framework/INTEGRATION_GUIDE.md)
- [Global Copilot Instructions](~/.github/copilot-instructions.md)
- [Gemini Original Rules](~/.gemini/GEMINI.md)

---

*Framework Version: 1.0*
*Source: Anti-Gravity IDE Governance → Web Development Adaptation*
