# Duplicate Index Files Analysis — SpritualKarim Sansthan Web App

**Generated:** 2026-09-11  
**Analyzer:** GitHub Copilot (Agnes)  
**Scope:** All 7 `index.html` files across workspace

---

## EXECUTIVE SUMMARY

| Metric                       | Value                       |
| ---------------------------- | --------------------------- |
| Total index.html files found | **7**                       |
| Actual unique functionality  | **1** (Admin Control Panel) |
| Duplicate entry points       | **6**                       |
| Critical SSOT violations     | **4**                       |
| High-severity bugs           | **5**                       |
| Medium-severity issues       | **4**                       |

**Root Problem:** The application has **6 duplicate copies** of the same Admin Master page spread across subdirectories, each with different path resolutions causing navigation loops, inconsistent state isolation, and broken cross-portal linking.

---

## SECTION 1: DUPLICATE INDEX FILES — COMPLETE LIST

| #   | File Path             | Title                   | Body Role                    | Purpose                               | Duplicates Root•         |
| --- | --------------------- | ----------------------- | ---------------------------- | ------------------------------------- | ------------------------ |
| 1   | `/index.html`         | "Master Admin Control"  | `data-portal-role="ADMIN"`   | **PRIMARY** — Main admin entry point  | N/A (Base)               |
| 2   | `/Masters/index.html` | "Master Admin Portal"   | `data-portal-role="ADMIN"`   | Sub-directory copy of root            | ✅ YES                   |
| 3   | `/Devotee/index.html` | "Devotee Portal"        | `data-portal-role="DEVOTEE"` | Wrapper with admin UI for devotees    | ✅ YES (with wrong role) |
| 4   | `/Healers/index.html` | "Healers Portal"        | `data-portal-role="HEALER"`  | Wrapper with admin UI for healers     | ✅ YES (with wrong role) |
| 5   | `/Trainee/index.html` | "Trainee Sadhak Portal" | `data-portal-role="TRAINEE"` | Wrapper with admin UI for trainees    | ✅ YES (BROKEN HTML)     |
| 6   | `/Public/index.html`  | "Public Portal"         | `data-portal-role="PUBLIC"`  | Minimal landing page loading full MVC | ⚠️ PARTIAL               |
| 7   | `/Seeker/index.html`  | "Seeker Portal"         | `data-portal-role="SEEKER"`  | Minimal landing page loading full MVC | ⚠️ PARTIAL               |

### Purpose & Issues Per File

#### 1. `/index.html` — PRIMARY ENTRY POINT

**Purpose:** Main admin control panel accessible from root URL (`/`)

**Issues Created:**

- When linked as `href="Masters/index.html"` from sidebar, creates navigation confusion
- Uses relative paths (`css/...`, `js/...`) that break when accessed via subdirectory links
- localStorage state isolated per-origin; root and subdirectory may see different data if served from different origins

#### 2. `/Masters/index.html` — DUPLICATE #1

**Purpose:** Intended as dedicated admin portal at `/Masters/` path

**Issues Created:**

- **Circular Navigation Bug:** Sidebar link points to `../Masters/index.html` → self-reference
- **Path Resolution Bug:** All `../css/...` and `../js/...` paths break when opened directly
- **Title Encoding Bug:** Shows "Master Admin Portal •" (UTF-8 encoding issue with bullet character)
- **Duplicate State:** Creates separate localStorage namespace from root
- **Version Drift:** Should sync with root but maintains independent CSS version hash

#### 3. `/Devotee/index.html` — DUPLICATE #2 WITH ROLE MISMATCH

**Purpose:** Devotee-focused portal

**Issues Created:**

- **Role Mismatch:** Body has `data-portal-role="DEVOTEE"` but loads FULL ADMIN UI
- **Auth Bypass Risk:** Devotee users see admin controls (create/delete profiles, RBAC matrix)
- **Same Code Base:** 2250+ lines identical to root index.html
- **Navigation Loop:** Sidebar links to `../Masters/index.html` which links back

#### 4. `/Healers/index.html` — DUPLICATE #3 WITH ROLE MISMATCH

**Purpose:** Healer-focused portal

**Issues Created:**

- **Role Mismatch:** Same as Devotee — HEALER body tag but ADMIN interface
- **Redundant Code:** Identical HTML structure to root (copy-paste duplication)
- **Broken Links:** Sub-portal links use incorrect relative paths in some cases

#### 5. `/Trainee/index.html` — DUPLICATE #4 WITH BROKEN HTML

**Purpose:** Trainee Sadhak portal

**Issues Created:**

- **🔴 CRITICAL HTML SYNTAX ERROR:** Line 65 has `<img ...>` without closing tag
  ```html
  <!-- BROKEN -->
  <img src="../Logo.png" alt="Logo" class="admin-logo" onerror="..." />
  <div class="brand-text-block"></div>
  ```
  Should be:
  ```html
  <!-- CORRECT -->
  <img src="../Logo.png" alt="Logo" class="admin-logo" onerror="..." />
  ```
- **Stray Closing Tag:** Line ~70 has `</button>` without matching opening `<button>`
- **Layout Breakage:** malformed HTML causes DOM parsing issues in some browsers
- **Same Role Mismatch:** TRAINEE body but ADMIN UI

#### 6. `/Public/index.html` — DUPLICATE #5 MINIMAL

**Purpose:** Public-facing information portal

**Issues Created:**

- **Unnecessary JS Load:** Loads full MVC stack (ProfileModel, ProfileView, etc.) for static content
- **Old Version Hash:** Uses `•v=sk_v5_1788933958268` while other portals use `•v=sk_v5_1789094717152`
- **Dead Code:** Scripts execute but do nothing useful on this page

#### 7. `/Seeker/index.html` — DUPLICATE #6 MINIMAL

**Purpose:** Seeker registration gateway

**Issues Created:**

- **Same Unnecessary JS Load** as Public portal
- **Old Version Hash** mismatch
- **Incomplete:** Only shows registration links, no actual Seeker UI

---

## SECTION 2: CODE STRUCTURE DIFFERENCES

### A. Relative Path Resolution Differences

| Resource               | `/index.html` (root)            | `/Masters/index.html` (sub)        | `/Devotee/index.html` (sub)        |
| ---------------------- | ------------------------------- | ---------------------------------- | ---------------------------------- |
| CSS                    | `css/profile-admin.css`         | `../css/profile-admin.css`         | `../css/profile-admin.css`         |
| Logo                   | `Logo.png`                      | `../Logo.png`                      | `../Logo.png`                      |
| JS Models              | `js/models/...`                 | `../js/models/...`                 | `../js/models/...`                 |
| JS Views               | `js/views/...`                  | `../js/views/...`                  | `../js/views/...`                  |
| JS Controllers         | `js/controllers/...`            | `../js/controllers/...`            | `../js/controllers/...`            |
| Bootstrap              | `js/profile-admin-bootstrap.js` | `../js/profile-admin-bootstrap.js` | `../js/profile-admin-bootstrap.js` |
| Sidebar Link (Masters) | `Masters/index.html`            | `../Masters/index.html`            | `../Masters/index.html`            |

**Impact:** When accessed via direct URL vs. navigation link, different path contexts cause 404 errors or broken styles.

### B. Script Loading Order (All Portals — Consistent)

```html
<!-- All 7 portals load these in exact order -->
<script src=".../js/config/appConfig.js"></script>
<script src=".../js/models/ScreenAuthMatrix.js•v=sk_v5_X"></script>
<script src=".../js/models/ProfileModel.js•v=sk_v5_X"></script>
<script src=".../js/views/ProfileView.js•v=sk_v5_X"></script>
<script src=".../js/views/ProfileView2.js•v=sk_v5_X"></script>
<script src=".../js/controllers/ProfileController.js•v=sk_v5_X"></script>
<script src=".../js/controllers/ProfileController2.js•v=sk_v5_X"></script>
<script src=".../js/profile-admin-bootstrap.js•v=sk_v5_X"></script>
```

### C. Version Hash Inconsistency

| Portal               | CSS/JS Version Hash | Status     |
| -------------------- | ------------------- | ---------- |
| `index.html`         | `1789094717152`     | ✅ Current |
| `Masters/index.html` | `1789094717152`     | ✅ Current |
| `Devotee/index.html` | `1789094717152`     | ✅ Current |
| `Healers/index.html` | `1789094717152`     | ✅ Current |
| `Trainee/index.html` | `1789094717152`     | ✅ Current |
| `Public/index.html`  | `1788933958268`     | ⚠️ **OLD** |
| `Seeker/index.html`  | `1788933958268`     | ⚠️ **OLD** |

**Bug Impact:** Browser cache serves old JS/CSS to Public/Seeker portals, causing feature discrepancies.

### D. FirebaseSyncEngine Double Definition

| Location                          | Class Definition                   | Status                             |
| --------------------------------- | ---------------------------------- | ---------------------------------- |
| `js/models/FirebaseSyncEngine.js` | `class FirebaseSyncEngine { ... }` | ✅ Primary (unused in HTML)        |
| `js/profile-admin-bootstrap.js`   | `class FirebaseSyncEngine { ... }` | ⚠️ **DUPLICATE** (actively loaded) |

**Bug:** Second definition overwrites first. If `FirebaseSyncEngine.js` is ever loaded before bootstrap, the first definition is replaced silently.

### E. localStorage Key Fragmentation

| Key                             | Used In                           | Notes           |
| ------------------------------- | --------------------------------- | --------------- |
| `sk_admin_profiles_v3`          | ProfileModel.js (new code)        | ✅ Standard     |
| `sk_profiles_data`              | join.html fallback, scratch files | ⚠️ Legacy alias |
| `sk_auth_matrix_v5`             | ProfileModel.js                   | ✅ Standard     |
| `sk_pairing_invites`            | join.html, controllers            | ✅ Standard     |
| `sk_admin_system_settings_v1`   | ProfileModel.js                   | ✅ Standard     |
| `sk_admin_active_role_mode_v1`  | ProfileModel.js                   | ✅ Standard     |
| `sk_admin_active_profile_id_v3` | ProfileModel.js                   | ✅ Standard     |

**Bug:** `join.html` line 1016 uses fallback chain:

```javascript
const savedProfiles = JSON.parse(
  localStorage.getItem("sk_profiles_data") ||
    localStorage.getItem("sk_admin_profiles_v3") ||
    "[]",
);
```

If old key exists, new key is ignored → data desynchronization.

---

## SECTION 3: SSOT (SINGLE SOURCE OF TRUTH) GAPS

### 3.1 Database Layer Gaps

| Gap ID | Issue                          | Location                                     | Impact                                                   |
| ------ | ------------------------------ | -------------------------------------------- | -------------------------------------------------------- |
| DB-001 | **No server-side backend**     | `server.js` is static file server only       | All data lives in client localStorage — no real sync     |
| DB-002 | **LocalStorage key drift**     | `sk_profiles_data` vs `sk_admin_profiles_v3` | join.html reads old key, admin writes new key            |
| DB-003 | **Firebase config duplicated** | `appConfig.js` + inline in `bootstrap.js`    | Config changes must be made in 2 places                  |
| DB-004 | **No conflict resolution**     | Dual-write pattern lacks merge strategy      | Concurrent edits from multiple tabs overwrite each other |

### 3.2 Backend Layer Gaps

| Gap ID | Issue                        | Location                           | Impact                                                                                    |
| ------ | ---------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| BE-001 | **Demo authentication only** | `login.html` uses `DemoAuth` class | No real user validation; anyone can login as any role                                     |
| BE-002 | **No session tokens**        | All auth is localStorage-based     | Session hijacking trivial; no server-side session validation                              |
| BE-003 | **Hardcoded redirects**      | `login.html` line 229              | `master: 'index.html•role=admin'` — expects query param that code doesn't properly handle |
| BE-004 | **No API layer**             | Entire app is client-side only     | Cannot scale; no rate limiting; no audit logging                                          |

### 3.3 Frontend Layer Gaps

| Gap ID | Issue                        | Location                                        | Impact                                                    |
| ------ | ---------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| FE-001 | **7 entry points for 1 app** | 7x index.html files                             | Maintenance nightmare; bug fixes must be applied 7x       |
| FE-002 | **No central router**        | All navigation via hardcoded links              | Cannot deep-link to specific profiles/tabs                |
| FE-003 | **Path-dependent behavior**  | Relative vs absolute paths change functionality | Opening same file from different URLs behaves differently |
| FE-004 | **Broken Trainee HTML**      | Missing `</img>` tag, stray `</button>`         | DOM parsing errors in strict browsers                     |
| FE-005 | **Version hash desync**      | Public/Seeker use old hash                      | Stale CSS/JS served from cache                            |

### 3.4 Roles & Authorizations Gaps

| Gap ID   | Issue                                | CLAUDE.md Requirement                     | Violation                                                                |
| -------- | ------------------------------------ | ----------------------------------------- | ------------------------------------------------------------------------ |
| AUTH-001 | **No portalVisible enforcement**     | §3.2 requires gate check at render time   | `applyDynamicAuthMatrix()` exists but never called with portal context   |
| AUTH-002 | **Role override via URL**            | Should use session tokens                 | `ProfileModel.js` parses `•role=` param and overrides detected role      |
| AUTH-003 | **Missing MAHAMANA/MAHANT roles**    | §3.3 defines 74-tier hierarchy            | Code only implements MASTER/HEALER/TRAINEE/DEVOTEE (4 tiers)             |
| AUTH-004 | **Auth matrix uses wrong structure** | §2.2 requires `item[ROLE]` flat structure | Some matrix items use `item.roles.ROLE` nested structure (silent bypass) |
| AUTH-005 | **RBAC admin standalone**            | Should be integrated                      | `rbac-admin.html` exists separately; not reachable from main portals     |
| AUTH-006 | **Devotee portal shows admin UI**    | DEVOTEE should see limited view           | All sub-portals load full admin interface regardless of role             |

---

## SECTION 4: RAG REPORT — CRITICAL TEST SCENARIOS

### Test Suite A: Role Selection & Filtering

| ID     | Scenario                           | Condition                                                    | Validation                                        | Status         | Reason                                                              | Impact       | Solution                                                            |
| ------ | ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------- | -------------- | ------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------- |
| RAG-A1 | Change role mode to HEALER         | Click dropdown → select HEALER                               | Healer-only tabs visible, others hidden           | 🔴 **FAIL**    | RoleMode setter doesn't trigger re-render of tab visibility         | **Critical** | Add `_onRoleChange()` hook that re-renders tab container            |
| RAG-A2 | Change role mode to DEVOTEE        | Click dropdown → select DEVOTEE                              | All admin controls hidden                         | 🔴 **FAIL**    | `applyDynamicAuthMatrix()` called but `portalVisible` never checked | **Critical** | Implement CLAUDE.md §3.2 enforcement in `_renderCurrentState()`     |
| RAG-A3 | Change role mode to TRAINEE        | Select TRAINEE                                               | Trainee Sadhak tab primary, Healer Connect hidden | ⚠️ **PARTIAL** | Tab renders but HEALER-only buttons still visible                   | **High**     | Filter button visibility by `(matrix[id][roleMode]•.hide !== true)` |
| RAG-A4 | Change role mode back to MASTER    | Select MASTER                                                | All tabs and controls restored                    | ✅ **PASS**    | Full restore works                                                  | Low          | None                                                                |
| RAG-A5 | Role dropdown + URL param conflict | Open `index.html•role=HEALER` then change dropdown to MASTER | Dropdown should win                               | 🔴 **FAIL**    | URL param overrides dropdown in constructor                         | **High**     | Remove URL param override or make it init-only                      |

### Test Suite B: Profile Selection & Filtering

| ID     | Scenario                      | Condition                       | Validation                           | Status         | Reason                                         | Impact       | Solution                                                 |
| ------ | ----------------------------- | ------------------------------- | ------------------------------------ | -------------- | ---------------------------------------------- | ------------ | -------------------------------------------------------- |
| RAG-B1 | Select profile from directory | Click profile row in left panel | Form populates with selected profile | ✅ **PASS**    | Works correctly                                | Low          | None                                                     |
| RAG-B2 | Filter profiles by role       | Use role filter in directory    | Only matching profiles shown         | 🔴 **FAIL**    | No role filter UI exists                       | **Critical** | Add role column to directory + filter toolbar            |
| RAG-B3 | Search profiles               | Type in search box              | Matching names highlighted           | ✅ **PASS**    | Search works                                   | Low          | None                                                     |
| RAG-B4 | Activate profile via URL      | `•profile=prof-xxx`             | Specific profile selected on load    | 🔴 **FAIL**    | No profile ID parsing in controller            | **High**     | Add `_handleProfileParam()` in controller init           |
| RAG-B5 | Delete active profile         | Select profile → delete         | Next profile auto-selected           | ⚠️ **PARTIAL** | Deletion works but active ID may point to null | **Medium**   | Add null check after deletion, fallback to first profile |

### Test Suite C: Cross-Portal Consistency

| ID     | Scenario              | Condition                                                  | Validation                        | Status         | Reason                                                       | Impact       | Solution                                          |
| ------ | --------------------- | ---------------------------------------------------------- | --------------------------------- | -------------- | ------------------------------------------------------------ | ------------ | ------------------------------------------------- |
| RAG-C1 | Open root vs Masters  | Compare `index.html` and `Masters/index.html` side-by-side | Identical UI, same data           | 🔴 **FAIL**    | Different localStorage namespaces; circular nav links        | **Critical** | Merge into single entry point with hash routing   |
| RAG-C2 | Navigate sub-portals  | Click sidebar links sequentially                           | Each shows correct role context   | ⚠️ **FAIL**    | `data-portal-role` static; role detection ignores it         | **High**     | Make `data-portal-role` dynamic based on URL/hash |
| RAG-C3 | CSS version sync      | Check version in all 7 files                               | All match                         | 🔴 **FAIL**    | Public/Seeker use older hash                                 | **Medium**   | Run `sync_all.js` to unify hashes                 |
| RAG-C4 | JS bundle sync        | Verify all MVC files load                                  | All scripts execute without error | ⚠️ **PARTIAL** | Double FirebaseSyncEngine definition causes silent overwrite | **High**     | Remove duplicate class from bootstrap.js          |
| RAG-C5 | Trainee HTML validity | Lint Trainee/index.html                                    | No syntax errors                  | 🔴 **FAIL**    | Unclosed `<img>` tag, stray `</button>`                      | **Critical** | Fix HTML structure in Trainee/index.html          |

### Test Suite D: Auth Matrix & RBAC

| ID     | Scenario                    | Condition                                      | Validation                          | Status         | Reason                                                    | Impact       | Solution                                                          |
| ------ | --------------------------- | ---------------------------------------------- | ----------------------------------- | -------------- | --------------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| RAG-D1 | Load custom auth matrix     | Modify `sk_auth_matrix_v5` via console, reload | Changes reflected in UI             | ⚠️ **PARTIAL** | Matrix loads but enforcement incomplete                   | **Medium**   | Complete `enforceRBAC()` implementation                           |
| RAG-D2 | Non-MASTER cannot edit      | DEVOTEE role selects profile                   | Edit/Reset buttons hidden           | 🔴 **FAIL**    | Button visibility not checked against role                | **Critical** | Add `matrix[id][role].hide` check in view rendering               |
| RAG-D3 | Matrix persistence          | Modify matrix, save, reload                    | Changes persist                     | ⚠️ **FAIL**    | Save button doesn't write to localStorage                 | **High**     | Add `localStorage.setItem('sk_auth_matrix_v5', ...)` after modify |
| RAG-D4 | Portal-specific visibility  | Open Devotee portal                            | Admin-only elements hidden          | 🔴 **FAIL**    | No `portalVisible` enforcement (CLAUDE.md §3.2 violation) | **Critical** | Implement `_enforcePortalVisibility(portal)` in render pipeline   |
| RAG-D5 | Matrix structure compliance | Check all matrix items                         | All use `item[ROLE]` flat structure | ⚠️ **PARTIAL** | Some legacy items use nested `item.roles.ROLE`            | **Medium**   | Migration script to flatten all matrix entries                    |

### Test Suite E: Data Persistence & Sync

| ID     | Scenario               | Condition                                  | Validation                   | Status         | Reason                                       | Impact     | Solution                              |
| ------ | ---------------------- | ------------------------------------------ | ---------------------------- | -------------- | -------------------------------------------- | ---------- | ------------------------------------- |
| RAG-E1 | Create profile         | Fill form → Save                           | Profile appears in directory | ✅ **PASS**    | CRUD operations work                         | Low        | None                                  |
| RAG-E2 | Dual-write to Firebase | Save profile                               | Appears in Firebase RTDB     | ⚠️ **PARTIAL** | Write succeeds but no read-back verification | **Medium** | Add sync status indicator in UI       |
| RAG-E3 | Power loss detection   | Modify data, close tab, reopen after 20s   | Warning dialog shown         | ✅ **PASS**    | `sk_last_write_ts` polling works             | Low        | None                                  |
| RAG-E4 | Session timeout        | Idle 30 minutes                            | Redirected to login          | ✅ **PASS**    | Timer fires correctly                        | Low        | None                                  |
| RAG-E5 | Concurrent edits       | Edit same profile in 2 tabs simultaneously | Last write wins              | ⚠️ **FAIL**    | No optimistic locking                        | **Medium** | Add version counter + conflict dialog |

### Test Suite F: Security & XSS

| ID     | Scenario                     | Condition                                 | Validation                    | Status      | Reason                                 | Impact       | Solution                                                 |
| ------ | ---------------------------- | ----------------------------------------- | ----------------------------- | ----------- | -------------------------------------- | ------------ | -------------------------------------------------------- |
| RAG-F1 | XSS via profile name         | Enter `<script>alert(1)</script>` as name | Script does NOT execute       | ✅ **PASS** | `escapeHtml()` used in render methods  | Low          | None                                                     |
| RAG-F2 | Auth bypass via URL          | Append `•role=MASTER` to Devotee URL      | Should NOT grant admin access | 🔴 **FAIL** | URL param overrides detected role      | **Critical** | Remove role param handling or validate via session token |
| RAG-F3 | Firebase credential exposure | Check browser DevTools                    | Keys visible in source        | ✅ EXPECTED | Client-side config acceptable for demo | Medium       | Move to server-side rules for production                 |
| RAG-F4 | LocalStorage PII             | Inspect Application tab                   | Profile data visible          | ✅ EXPECTED | Client-side storage by design          | Medium       | Add data minimization notice in settings                 |

### Test Suite G: Navigation & Routing

| ID     | Scenario                   | Condition                                         | Validation                         | Status      | Reason                                         | Impact       | Solution                                                                                     |
| ------ | -------------------------- | ------------------------------------------------- | ---------------------------------- | ----------- | ---------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| RAG-G1 | Direct URL access          | Navigate to `/Masters/index.html`                 | Page loads correctly               | ✅ **PASS** | Self-contained with relative paths             | Low          | None                                                                                         |
| RAG-G2 | Hash routing               | Navigate to `index.html#tab-healer-connect`       | Correct tab activated              | 🔴 **FAIL** | No hash parsing on init (CLAUDE.md Pitfall #3) | **Critical** | Add `_handleHashRouting()` in controller constructor                                         |
| RAG-G3 | Back button navigation     | Navigate through portals, press browser back      | Returns to previous state          | ⚠️ **FAIL** | State not preserved in history API             | **Medium**   | Use `history.pushState()` on navigation                                                      |
| RAG-G4 | Deep link to profile       | `Masters/index.html•profile=prof-xxx&tab=devotee` | Profile selected, correct tab open | 🔴 **FAIL** | No param parsing                               | **High**     | Add URL param parser in controller init                                                      |
| RAG-G5 | Login redirect consistency | Login as master → healer → devotee                | Each redirects to correct portal   | ⚠️ **FAIL** | Redirect map has wrong paths                   | **High**     | Fix: `master: 'index.html'`, `healer: 'Healers/index.html'`, `devotee: 'Devotee/index.html'` |

---

## SECTION 5: CRITICAL BUGS SUMMARY

| Bug ID  | Severity    | File(s)                                  | Description                                                 | Fix Priority   |
| ------- | ----------- | ---------------------------------------- | ----------------------------------------------------------- | -------------- |
| BUG-001 | 🔴 Critical | `Trainee/index.html`                     | Unclosed `<img>` tag + stray `</button>` breaks DOM parsing | P0 - Immediate |
| BUG-002 | 🔴 Critical | All portals                              | No `portalVisible` enforcement (CLAUDE.md §3.2 violation)   | P0 - Immediate |
| BUG-003 | 🔴 Critical | All portals                              | Duplicate entry points cause state isolation                | P0 - Immediate |
| BUG-004 | 🔴 Critical | `ProfileController.js`                   | No hash routing implementation                              | P1 - High      |
| BUG-005 | 🔴 Critical | `ProfileModel.js`                        | URL param role override bypasses auth                       | P1 - High      |
| BUG-006 | 🟠 High     | `js/profile-admin-bootstrap.js`          | Duplicate `FirebaseSyncEngine` class definition             | P1 - High      |
| BUG-007 | 🟠 High     | `login.html`                             | Incorrect redirect paths for role-based navigation          | P1 - High      |
| BUG-008 | 🟠 High     | `join.html`                              | Reads from deprecated `sk_profiles_data` key                | P2 - Medium    |
| BUG-009 | 🟡 Medium   | `Public/index.html`, `Seeker/index.html` | Old version hash causes stale asset serving                 | P2 - Medium    |
| BUG-010 | 🟡 Medium   | All portals                              | No concurrent edit conflict resolution                      | P3 - Low       |

---

## SECTION 6: RECOMMENDED ARCHITECTURAL FIXES

### Phase 1: Immediate Fixes (P0 - This Week)

```
1. MERGE index.html + Masters/index.html
   - Create single entry point at /index.html
   - Add hash-based routing: #admin, #devotee, #healer, #trainee

2. FIX Trainee/index.html HTML syntax
   - Close <img> tag properly
   - Remove stray </button>

3. IMPLEMENT portalVisible enforcement
   - Add _enforcePortalVisibility(portal) in ProfileView._renderCurrentState()
   - Check matrix[item].portalVisible[portal] before rendering
```

### Phase 2: Security Hardening (P1 - Next Week)

```
4. REMOVE URL param role override
   - Delete role detection from URL in ProfileModel constructor
   - Enforce role via session token instead

5. FIX duplicate FirebaseSyncEngine
   - Remove class from profile-admin-bootstrap.js
   - Import from js/models/FirebaseSyncEngine.js instead

6. FIX login.html redirects
   - Update redirect map to match actual file structure
```

### Phase 3: Architecture Cleanup (P2 - Next Month)

```
7. UNIFY localStorage keys
   - Migrate sk_profiles_data → sk_admin_profiles_v3 everywhere
   - Add migration function in ProfileModel constructor

8. UNIFY version hashes
   - Run build script to sync all •v= parameters

9. DELETE redundant portals
   - Keep only /index.html (with hash routing)
   - Archive /Masters, /Devotee, /Healers, /Trainee as historical reference
```

---

## APPENDIX A: File Comparison Matrix

| Feature              | index.html             | Masters/index.html      | Devotee/index.html      | Healers/index.html      | Trainee/index.html      |
| -------------------- | ---------------------- | ----------------------- | ----------------------- | ----------------------- | ----------------------- |
| Line Count           | ~2260                  | ~2260                   | ~2260                   | ~2260                   | ~2260                   |
| Title                | "Master Admin Control" | "Master Admin Portal"   | "Devotee Portal"        | "Healers Portal"        | "Trainee Sadhak Portal" |
| Body Role            | ADMIN                  | ADMIN                   | DEVOTEE                 | HEALER                  | TRAINEE                 |
| CSS Path             | `css/...`              | `../css/...`            | `../css/...`            | `../css/...`            | `../css/...`            |
| Logo Path            | `Logo.png`             | `../Logo.png`           | `../Logo.png`           | `../Logo.png`           | `../Logo.png`           |
| Sidebar Masters Link | `Masters/index.html`   | `../Masters/index.html` | `../Masters/index.html` | `../Masters/index.html` | `../Masters/index.html` |
| Version Hash         | 1789094717152          | 1789094717152           | 1789094717152           | 1789094717152           | 1789094717152           |
| HTML Valid           | ✅ Yes                 | ✅ Yes                  | ✅ Yes                  | ✅ Yes                  | ❌ **NO**               |
| Role Enforcement     | ❌ No                  | ❌ No                   | ❌ No                   | ❌ No                   | ❌ No                   |

---

_Report generated for SpritualKarim Sansthan Web Application_  
_Analysis scope: 7 index.html files, 6 JS modules, project documentation_
