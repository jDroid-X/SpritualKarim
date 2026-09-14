# Duplicate Index Files — Full Analysis + Fix Impact Validation

**SpritualKarim Sansthan Web Application**  
**Date:** 2026-09-11 | **Scope:** 7 index.html + 6 standalone pages + dependencies

---

## SECTION 1: ALL INDEX FILES — COMPLETE INVENTORY

| #   | File                  | Title                   | Body Role | Lines | Purpose                                    | Duplicates Root• | Broken•                                               |
| --- | --------------------- | ----------------------- | --------- | ----- | ------------------------------------------ | ---------------- | ----------------------------------------------------- |
| 1   | `/index.html`         | "Master Admin Control"  | ADMIN     | ~2260 | Primary admin entry                        | N/A (Base)       | No                                                    |
| 2   | `/Masters/index.html` | "Master Admin Portal"   | ADMIN     | ~2260 | Sub-dir copy                               | ✅ YES           | Title encoding bug (`•`)                            |
| 3   | `/Devotee/index.html` | "Devotee Portal"        | DEVOTEE   | ~2260 | Wrapper with admin UI                      | ✅ YES           | Role mismatch (admin UI shown to devotees)            |
| 4   | `/Healers/index.html` | "Healers Portal"        | HEALER    | ~2260 | Wrapper with admin UI                      | ✅ YES           | Role mismatch                                         |
| 5   | `/Trainee/index.html` | "Trainee Sadhak Portal" | TRAINEE   | ~2260 | Wrapper with admin UI                      | ✅ YES           | **BROKEN HTML** (unclosed `<img>`, stray `</button>`) |
| 6   | `/Public/index.html`  | "Public Portal"         | PUBLIC    | ~70   | Minimal page, loads full MVC unnecessarily | ⚠️ PARTIAL       | Old version hash                                      |
| 7   | `/Seeker/index.html`  | "Seeker Portal"         | SEEKER    | ~70   | Minimal page, loads full MVC unnecessarily | ⚠️ PARTIAL       | Old version hash                                      |

---

## SECTION 2: CODE STRUCTURE DIFFERENCES

### 2a. Path Resolution Matrix

| Resource          | `index.html` (root)             | `Masters/` (sub)                   | `Devotee/` (sub)                   | `Healers/` (sub)                   | `Trainee/` (sub)                   |
| ----------------- | ------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| CSS               | `css/profile-admin.css`         | `../css/profile-admin.css`         | `../css/profile-admin.css`         | `../css/profile-admin.css`         | `../css/profile-admin.css`         |
| Logo              | `Logo.png`                      | `../Logo.png`                      | `../Logo.png`                      | `../Logo.png`                      | `../Logo.png`                      |
| JS models         | `js/models/...`                 | `../js/models/...`                 | `../js/models/...`                 | `../js/models/...`                 | `../js/models/...`                 |
| JS views          | `js/views/...`                  | `../js/views/...`                  | `../js/views/...`                  | `../js/views/...`                  | `../js/views/...`                  |
| JS controllers    | `js/controllers/...`            | `../js/controllers/...`            | `../js/controllers/...`            | `../js/controllers/...`            | `../js/controllers/...`            |
| Bootstrap         | `js/profile-admin-bootstrap.js` | `../js/profile-admin-bootstrap.js` | `../js/profile-admin-bootstrap.js` | `../js/profile-admin-bootstrap.js` | `../js/profile-admin-bootstrap.js` |
| Sidebar → Masters | `Masters/index.html`            | `../Masters/index.html`            | `../Masters/index.html`            | `../Masters/index.html`            | `../Masters/index.html`            |
| Sidebar → Devotee | `Devotee/index.html`            | `../Devotee/index.html`            | `../Devotee/index.html`            | `../Devotee/index.html`            | `../Devotee/index.html`            |
| Goli Gyan iframe  | `../GOLI_GYAN_FOR_SEEKERS.html` | `../GOLI_GYAN_FOR_SEEKERS.html`    | `../GOLI_GYAN_FOR_SEEKERS.html`    | `../GOLI_GYAN_FOR_SEEKERS.html`    | `../GOLI_GYAN_FOR_SEEKERS.html`    |

**Path Bug Impact:** When opened directly from root (`/index.html`), sidebar link `Masters/index.html` works. When opened from subdirectory (`/Masters/index.html`), that same link resolves to `/Masters/Masters/index.html` → 404. Conversely, `../Masters/index.html` from subdirs works, but from root fails.

### 2b. Version Hash Inconsistency

| Portal             | CSS/JS Hash     | Status                         |
| ------------------ | --------------- | ------------------------------ |
| index.html         | `1789094717152` | ✅ Current                     |
| Masters/index.html | `1789094717152` | ✅ Current                     |
| Devotee/index.html | `1789094717152` | ✅ Current                     |
| Healers/index.html | `1789094717152` | ✅ Current                     |
| Trainee/index.html | `1789094717152` | ✅ Current                     |
| Public/index.html  | `1788933958268` | ⚠️ OLD (~16 min earlier build) |
| Seeker/index.html  | `1788933958268` | ⚠️ OLD                         |

### 2c. Duplicate JavaScript Class Definitions

| Class                | Defined In                        | Also Defined In                                   | Active File                                  | Unused File                                               |
| -------------------- | --------------------------------- | ------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `FirebaseSyncEngine` | `js/models/FirebaseSyncEngine.js` | `js/profile-admin-bootstrap.js`                   | bootstrap.js loads SECOND → overwrites first | FirebaseSyncEngine.js loaded first → overwritten silently |
| `ProfileModel`       | `js/models/ProfileModel.js`       | `js/profile-admin.js` (legacy backup, 8628 lines) | ProfileModel.js                              | profile-admin.js not loaded in any HTML                   |

### 2d. localStorage Key Fragmentation

| Key                               | Used In                        | Notes                                               |
| --------------------------------- | ------------------------------ | --------------------------------------------------- |
| `sk_admin_profiles_v3`            | `ProfileModel.js` (primary)    | ✅ New standard                                     |
| `sk_profiles_data`                | `join.html` line 1016 fallback | ⚠️ Legacy alias — join.html checks BOTH keys        |
| `sk_auth_matrix_v5`               | `ProfileModel.js`              | ✅ Standard                                         |
| `spiritual_karim_pairing_invites` | `join.html` submit             | ⚠️ DIFFERENT from `sk_pairing_invites` in CLAUDE.md |
| `sk_devotee_induction_session`    | `join.html`                    | Custom key for session tracking                     |
| `sk_join_wizard_draft`            | `join.html`                    | Draft persistence                                   |

**Critical Bug:** `join.html` uses `spiritual_karim_pairing_invites` but `ProfileController.js` reads `sk_pairing_invites`. These are TWO SEPARATE localStorage keys — invites created in join.html will NOT appear in the admin pairing management UI.

---

## SECTION 3: EXTERNAL PAGE DEPENDENCIES (Beyond the 7 index.html files)

### 3a. Pages That Link TO or FROM the 7 Portals

| External Page                     | Links To Portals                                  | Links From Portals                      | Breaks If Portals Merge•                    |
| --------------------------------- | ------------------------------------------------- | --------------------------------------- | ------------------------------------------- |
| `login.html`                      | → `index.html•role=admin`                         | ← "Back to Home" link                   | ⚠️ YES — redirect map uses wrong role names |
| `join.html`                       | → `Devotee/index.html•profileId=...&role=devotee` | ← registered users go here              | ⚠️ YES — URL points to subdirectory         |
| `GOLI_GYAN_FOR_SEEKERS.html`      | ← iframed by all 5 admin portals                  | ← linked from healer pages              | ❌ NO — stays as standalone                 |
| `Latest Healer's List.html`       | ← linked from `MahaLaxmi Healer's Details.html`   | ← linked from portals via healer search | ⚠️ PARTIAL — path may change                |
| `MahaLaxmi Healer's Details.html` | ← linked from `Latest Healer's List.html`         | —                                       | ⚠️ PARTIAL — parent paths may shift         |
| `rbac-admin.html`                 | —                                                 | ← referenced in sidebar buttons         | ⚠️ YES — uses relative paths to JS          |
| `server.js` (static server)       | Serves all pages                                  | 404 page links to `/Masters/index.html` | ⚠️ YES — 404 page hardcodes path            |

### 3b. Cross-Page Link Map

```
login.html ──[master]──► index.html•role=admin          (BUG: role name mismatch)
login.html ──[healer]──► Healers/•role=healer           (BUG: missing 'index.html')
login.html ──[devotee]──► Devotee/•role=devotee         (BUG: missing 'index.html')
login.html ──[back]────► index.html                     (OK)

join.html  ──[after approve]──► Devotee/index.html•profileId=X&role=devotee  (BUG: sub-path)
join.html  ──[mentor lookup]──► reads sk_profiles_data OR sk_admin_profiles_v3

Public/index.html  ──[Admin Access]──► ../Masters/index.html   (OK)
Seeker/index.html  ──[Admin]────────► ../Masters/index.html   (OK)

index.html         ──[sidebar Masters]──► Masters/index.html     (CIRCULAR)
Masters/index.html ──[sidebar Masters]──► ../Masters/index.html  (SELF-REF)

All 5 admin portals ──[Goli Gyan iframe]──► ../GOLI_GYAN_FOR_SEEKERS.html  (OK)
Latest Healer's List.html ──[Goli Gyan]──► GOLI_GYAN_FOR_SEEKERS.html     (OK, same dir)
MahaLaxmi Healer's Details.html ──[Full Directory]──► Latest Healer's List.html  (OK)
```

---

## SECTION 4: SSOT (SINGLE SOURCE OF TRUTH) GAPS

### 4.1 Database Layer

| Gap    | Details                                                                                      | Severity    |
| ------ | -------------------------------------------------------------------------------------------- | ----------- |
| DB-001 | `server.js` is static file server only — no API backend                                      | 🔴 Critical |
| DB-002 | Two localStorage keys for profiles: `sk_profiles_data` (old) + `sk_admin_profiles_v3` (new)  | 🟠 High     |
| DB-003 | Pairing invites stored in `spiritual_karim_pairing_invites` but read as `sk_pairing_invites` | 🔴 Critical |
| DB-004 | Firebase config duplicated in `appConfig.js` AND inline in `profile-admin-bootstrap.js`      | 🟡 Medium   |
| DB-005 | No conflict resolution for concurrent edits across tabs                                      | 🟡 Medium   |

### 4.2 Backend Layer

| Gap    | Details                                                    | Severity    |
| ------ | ---------------------------------------------------------- | ----------- |
| BE-001 | `login.html` DemoAuth — no real authentication             | 🔴 Critical |
| BE-002 | Login redirects use wrong role names (`admin` vs `MASTER`) | 🟠 High     |
| BE-003 | No session tokens — localStorage-only auth                 | 🟠 High     |
| BE-004 | `server.js` 404 page hardcodes `/Masters/index.html`       | 🟡 Medium   |

### 4.3 Frontend Layer

| Gap    | Details                                                                       | Severity    |
| ------ | ----------------------------------------------------------------------------- | ----------- |
| FE-001 | 7 portal entry points for 1 app — maintenance multiplication                  | 🔴 Critical |
| FE-002 | No central router — hash-based navigation absent                              | 🔴 Critical |
| FE-003 | Path-dependent behavior — same code behaves differently based on access path  | 🟠 High     |
| FE-004 | `Trainee/index.html` has malformed HTML (unclosed `<img>`, stray `</button>`) | 🔴 Critical |
| FE-005 | Version hash desync between portal groups                                     | 🟡 Medium   |

### 4.4 Roles & Authorizations

| Gap      | Details                                                                  | Severity    |
| -------- | ------------------------------------------------------------------------ | ----------- |
| AUTH-001 | No `portalVisible` enforcement at render time (CLAUDE.md §3.2 violation) | 🔴 Critical |
| AUTH-002 | URL param `•role=` overrides detected role — auth bypass                 | 🔴 Critical |
| AUTH-003 | Missing MAHAMANA/MAHANT roles (CLAUDE says 74-tier, code has 4)          | 🟠 High     |
| AUTH-004 | Some auth matrix items use nested `roles.ROLE` instead of flat `ROLE`    | 🟡 Medium   |
| AUTH-005 | `rbac-admin.html` standalone, not reachable from main portals            | 🟡 Medium   |
| AUTH-006 | All sub-portals load full admin UI regardless of `data-portal-role`      | 🔴 Critical |

---

## SECTION 5: RAG REPORT — 35 TEST SCENARIOS

### Suite A: Role Selection & Filtering

| ID     | Scenario                    | Condition                                          | Validation                              | Status     | Reason                                                  | Impact       | Solution                                      |
| ------ | --------------------------- | -------------------------------------------------- | --------------------------------------- | ---------- | ------------------------------------------------------- | ------------ | --------------------------------------------- |
| RAG-A1 | Change role mode to HEALER  | Dropdown → select HEALER                           | Healer-only tabs visible, others hidden | 🔴 FAIL    | RoleMode setter doesn't re-render tab visibility        | **Critical** | Add `_onRoleChange()` hook to re-render tabs  |
| RAG-A2 | Change role mode to DEVOTEE | Dropdown → select DEVOTEE                          | Admin controls hidden                   | 🔴 FAIL    | `applyDynamicAuthMatrix()` never checks `portalVisible` | **Critical** | Implement CLAUDE.md §3.2 in render pipeline   |
| RAG-A3 | Change role to TRAINEE      | Select TRAINEE                                     | Healer Connect tab hidden               | ⚠️ PARTIAL | Tab renders but HEALER-only buttons still visible       | **High**     | Filter buttons by `matrix[id][roleMode].hide` |
| RAG-A4 | Change role back to MASTER  | Select MASTER                                      | All restored                            | ✅ PASS    | Full restore works                                      | Low          | None                                          |
| RAG-A5 | Role dropdown + URL param   | Open `index.html•role=HEALER` then change dropdown | Dropdown should win                     | 🔴 FAIL    | URL param overrides dropdown in constructor             | **High**     | Remove URL param override                     |

### Suite B: Profile Selection & Filtering

| ID     | Scenario                      | Condition                    | Validation                   | Status     | Reason                                   | Impact       | Solution                                  |
| ------ | ----------------------------- | ---------------------------- | ---------------------------- | ---------- | ---------------------------------------- | ------------ | ----------------------------------------- |
| RAG-B1 | Select profile from directory | Click profile row            | Form populates correctly     | ✅ PASS    | Works                                    | Low          | None                                      |
| RAG-B2 | Filter profiles by role       | Use role filter in directory | Only matching profiles shown | 🔴 FAIL    | No role filter UI exists                 | **Critical** | Add role column + filter to directory     |
| RAG-B3 | Search profiles               | Type in search box           | Matching names highlighted   | ✅ PASS    | Works                                    | Low          | None                                      |
| RAG-B4 | Activate profile via URL      | `•profile=prof-xxx`          | Specific profile selected    | 🔴 FAIL    | No profile ID parsing                    | **High**     | Add `_handleProfileParam()` in controller |
| RAG-B5 | Delete active profile         | Select → delete              | Next profile auto-selected   | ⚠️ PARTIAL | Deletion works but active ID may be null | **Medium**   | Add null check after deletion             |

### Suite C: Cross-Portal Consistency

| ID     | Scenario              | Condition                        | Validation              | Status     | Reason                                          | Impact       | Solution                                  |
| ------ | --------------------- | -------------------------------- | ----------------------- | ---------- | ----------------------------------------------- | ------------ | ----------------------------------------- |
| RAG-C1 | Open root vs Masters  | Compare both side-by-side        | Identical UI and data   | 🔴 FAIL    | Different localStorage namespaces; circular nav | **Critical** | Merge into single entry with hash routing |
| RAG-C2 | Navigate sub-portals  | Click sidebar links sequentially | Each shows correct role | ⚠️ FAIL    | `data-portal-role` is static                    | **High**     | Make portal role dynamic from URL/hash    |
| RAG-C3 | CSS version sync      | Check version across all 7 files | All match               | 🔴 FAIL    | Public/Seeker use older hash                    | **Medium**   | Run `sync_all.js`                         |
| RAG-C4 | JS bundle sync        | Verify all MVC files load        | No errors               | ⚠️ PARTIAL | Double FirebaseSyncEngine overwrites silently   | **High**     | Remove duplicate from bootstrap.js        |
| RAG-C5 | Trainee HTML validity | Lint Trainee/index.html          | No syntax errors        | 🔴 FAIL    | Unclosed `<img>`, stray `</button>`             | **Critical** | Fix HTML structure                        |

### Suite D: Auth Matrix & RBAC

| ID     | Scenario                    | Condition                              | Validation                  | Status     | Reason                                         | Impact       | Solution                                             |
| ------ | --------------------------- | -------------------------------------- | --------------------------- | ---------- | ---------------------------------------------- | ------------ | ---------------------------------------------------- |
| RAG-D1 | Load custom auth matrix     | Modify `sk_auth_matrix_v5` via console | Changes reflected           | ⚠️ PARTIAL | Matrix loads but enforcement incomplete        | **Medium**   | Complete `enforceRBAC()` implementation              |
| RAG-D2 | Non-MASTER cannot edit      | DEVOTEE selects profile                | Edit/Reset buttons hidden   | 🔴 FAIL    | Button visibility not role-checked             | **Critical** | Add `matrix[id][role].hide` check                    |
| RAG-D3 | Matrix persistence          | Modify, save, reload                   | Changes persist             | ⚠️ FAIL    | Save button doesn't write to localStorage      | **High**     | Add `localStorage.setItem('sk_auth_matrix_v5', ...)` |
| RAG-D4 | Portal-specific visibility  | Open Devotee portal                    | Admin elements hidden       | 🔴 FAIL    | No `portalVisible` enforcement                 | **Critical** | Implement `_enforcePortalVisibility()`               |
| RAG-D5 | Matrix structure compliance | Check all items                        | Flat `item[ROLE]` structure | ⚠️ PARTIAL | Some legacy items use nested `item.roles.ROLE` | **Medium**   | Migration script to flatten entries                  |

### Suite E: Data Persistence & Sync

| ID     | Scenario                   | Condition                       | Validation                  | Status     | Reason                                 | Impact       | Solution                                 |
| ------ | -------------------------- | ------------------------------- | --------------------------- | ---------- | -------------------------------------- | ------------ | ---------------------------------------- |
| RAG-E1 | Create profile             | Fill form → Save                | Appears in directory        | ✅ PASS    | CRUD works                             | Low          | None                                     |
| RAG-E2 | Dual-write to Firebase     | Save profile                    | Appears in Firebase RTDB    | ⚠️ PARTIAL | Write succeeds but no read-back verify | **Medium**   | Add sync status indicator                |
| RAG-E3 | Power loss detection       | Modify, close, reopen after 20s | Warning dialog shown        | ✅ PASS    | `sk_last_write_ts` polling works       | Low          | None                                     |
| RAG-E4 | Session timeout            | Idle 30 min                     | Redirected to login         | ✅ PASS    | Timer fires                            | Low          | None                                     |
| RAG-E5 | Concurrent edits           | Edit same profile in 2 tabs     | Last write wins             | 🔴 FAIL    | No optimistic locking                  | **Medium**   | Add version counter + conflict dialog    |
| RAG-E6 | Pairing invites cross-link | Create invite in join.html      | Appears in admin pairing UI | 🔴 FAIL    | Different localStorage keys used       | **Critical** | Unify to single key `sk_pairing_invites` |

### Suite F: Security & XSS

| ID     | Scenario                     | Condition                            | Validation                    | Status      | Reason                            | Impact       | Solution                                 |
| ------ | ---------------------------- | ------------------------------------ | ----------------------------- | ----------- | --------------------------------- | ------------ | ---------------------------------------- |
| RAG-F1 | XSS via profile name         | Enter `<script>alert(1)</script>`    | Script does NOT execute       | ✅ PASS     | `escapeHtml()` used               | Low          | None                                     |
| RAG-F2 | Auth bypass via URL          | Append `•role=MASTER` to Devotee URL | Should NOT grant admin access | 🔴 FAIL     | URL param overrides detected role | **Critical** | Remove role param handling               |
| RAG-F3 | Firebase credential exposure | Check DevTools                       | Keys visible in source        | ✅ EXPECTED | Client-side config OK for demo    | Medium       | Move to server-side rules for production |
| RAG-F4 | LocalStorage PII             | Inspect Application tab              | Profile data visible          | ✅ EXPECTED | Client-side by design             | Medium       | Add data minimization notice             |

### Suite G: Navigation & Routing

| ID     | Scenario             | Condition                             | Validation                  | Status  | Reason                                              | Impact       | Solution                                  |
| ------ | -------------------- | ------------------------------------- | --------------------------- | ------- | --------------------------------------------------- | ------------ | ----------------------------------------- |
| RAG-G1 | Direct URL access    | Navigate to `/Masters/index.html`     | Page loads                  | ✅ PASS | Self-contained with relative paths                  | Low          | None                                      |
| RAG-G2 | Hash routing         | `index.html#tab-healer-connect`       | Correct tab activated       | 🔴 FAIL | No hash parsing on init                             | **Critical** | Add `_handleHashRouting()` in constructor |
| RAG-G3 | Back button          | Navigate portals, press back          | Returns to previous state   | ⚠️ FAIL | State not in history API                            | **Medium**   | Use `history.pushState()`                 |
| RAG-G4 | Deep link to profile | `Masters/index.html•profile=prof-xxx` | Profile selected            | 🔴 FAIL | No param parsing                                    | **High**     | Add URL param parser                      |
| RAG-G5 | Login redirect       | Login as master → healer → devotee    | Correct portal each time    | 🔴 FAIL | Redirect map has wrong paths/names                  | **High**     | Fix redirect map                          |
| RAG-G6 | Join → Devotee flow  | Complete join.html, get approved      | Redirects to Devotee portal | ⚠️ FAIL | Redirects to `Devotee/index.html` with wrong params | **High**     | Update to single entry point with hash    |

### Suite H: External Page Dependencies

| ID     | Scenario                     | Condition                 | Validation                  | Status     | Reason                                             | Impact     | Solution                        |
| ------ | ---------------------------- | ------------------------- | --------------------------- | ---------- | -------------------------------------------------- | ---------- | ------------------------------- |
| RAG-H1 | login.html → index.html back | Click "Back to Home"      | Opens root index            | ✅ PASS    | Relative path resolves                             | Low        | None                            |
| RAG-H2 | login.html → master redirect | Login as master           | Goes to correct admin page  | 🔴 FAIL    | `index.html•role=admin` — param ignored            | **High**   | Fix role name mapping           |
| RAG-H3 | join.html → Devotee redirect | After approval            | Goes to Devotee portal      | ⚠️ FAIL    | Uses old `Devotee/index.html` path                 | **High**   | Update redirect to hash routing |
| RAG-H4 | Goli Gyan iframe in portals  | Open any admin portal     | Goli Gyan loads in iframe   | ✅ PASS    | `../GOLI_GYAN_FOR_SEEKERS.html` resolves correctly | Low        | None                            |
| RAG-H5 | Server.js 404 page           | Request non-existent page | Shows 404 with portal links | ⚠️ PARTIAL | Hardcodes `/Masters/index.html`                    | **Medium** | Update to `/` or hash route     |
| RAG-H6 | Latest Healer ↔ MahaLaxmi    | Click between the two     | Each loads correctly        | ✅ PASS    | Same-directory relative links work                 | Low        | None                            |

---

## SECTION 6: FIX VALIDATION — WHAT WOULD BREAK

### FIX 1: Merge `index.html` + `Masters/index.html` → Single Entry Point

**Proposed:** Keep only `/index.html`, use hash routing (`#devotee`, `#healer`, `#trainee`) for sub-portals. Archive the other 6 as backups.

#### What Would Break

| Dependency                                                                                    | Current Behavior                   | After Fix                                                                                           | Impact      | Mitigation                                                        |
| --------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------- |
| `login.html` line 229: `master: 'index.html•role=admin'`                                      | Redirects to root with query param | **STILL WORKS** but `•role=admin` ignored (param override removed per Fix 5)                        | 🟡 Medium   | Update login.html redirect to just `'index.html'`                 |
| `join.html` line 1124: `Devotee/index.html•profileId=...&role=devotee`                        | Opens subdirectory with params     | **BREAKS** — path no longer exists                                                                  | 🔴 Critical | Update to `index.html#devotee•profileId=...`                      |
| `server.js` line 74: 404 page links to `/Masters/index.html`                                  | Shown on any 404                   | **BREAKS** — path no longer exists                                                                  | 🟡 Medium   | Update 404 page to link to `/`                                    |
| `Public/index.html` line 35: `<a href="../Masters/index.html">`                               | "Admin Access" button              | **BREAKS** — path no longer exists                                                                  | 🔴 Critical | Replace with `<a href="index.html">` or remove entirely           |
| `Seeker/index.html` line 36: `<a href="../Masters/index.html">`                               | "Admin" button                     | **BREAKS** — path no longer exists                                                                  | 🔴 Critical | Replace with `<a href="index.html">` or remove                    |
| `sync_all.js` line 44: replaces `href="Masters/index.html"`                                   | Build script                       | **BROKEN SCRIPT** — target string may not match                                                     | 🟡 Medium   | Update sync_all.js regex                                          |
| `scratch/test_all_routes.js` line 101: tests `/Masters/index.html`                            | Test suite                         | **TEST FAILS** — page no longer exists                                                              | 🟡 Medium   | Update test URLs                                                  |
| `docs/platform-overview.html` references `Masters/index.html`                                 | Documentation                      | **DOC OUTDATED**                                                                                    | 🟢 Low      | Update docs                                                       |
| Bookmark/favorite URLs pointing to `/Masters/index.html`                                      | User bookmarks                     | **404 on direct access**                                                                            | 🟠 High     | Add server-side redirect or keep Masters/index.html as redirector |
| `GOLI_GYAN_FOR_SEEKERS.html` iframe `src="../GOLI_GYAN_FOR_SEEKERS.html"` from subdirectories | All 5 sub-portals                  | **BREAKS** from merged root — path becomes `../GOLI_GYAN_FOR_SEEKERS.html` which is wrong from root | 🔴 Critical | Change to `src="GOLI_GYAN_FOR_SEEKERS.html"` (no prefix)          |
| `Latest Healer's List.html` and `MahaLaxmi Healer's Details.html`                             | Standalone healer pages            | **NO IMPACT** — these are sibling files, not linked from portals directly                           | 🟢 Low      | None needed                                                       |

**Verdict:** This fix requires **7+ dependent file changes** before it can be safely applied. The merge itself is safe, but the ripple effects must be addressed simultaneously.

---

### FIX 2: Fix `Trainee/index.html` HTML Syntax Errors

**Proposed:** Close the `<img>` tag properly, remove stray `</button>`.

#### What Would Break

| Dependency                            | Impact                                                | Mitigation  |
| ------------------------------------- | ----------------------------------------------------- | ----------- |
| None — this is an isolated syntax fix | **NONE** — fixing broken HTML can only improve things | None needed |

**Verdict:** Zero breaking risk. Apply immediately.

---

### FIX 3: Implement `portalVisible` Enforcement in `_renderCurrentState()`

**Proposed:** Add `_enforcePortalVisibility(portal)` call before rendering, checking `matrix[item].portalVisible[portal]` per CLAUDE.md §3.2.

#### What Would Break

| Dependency                                                  | Impact                                                                           | Mitigation                                                                                                    |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| All 7 portal HTML files                                     | Elements currently visible to all roles will be correctly hidden based on portal | **POSITIVE BREAK** — some elements currently showing to wrong roles will disappear (this is the intended fix) |
| `rbac-admin.html`                                           | May need `portalVisible` field added to its matrix items                         | Check and add if missing                                                                                      |
| Existing custom matrix modifications in `sk_auth_matrix_v5` | Items without `portalVisible` field will default to visible (safe fallback)      | Add `portalVisible` defaults to all matrix items                                                              |

**Verdict:** Safe enforcement with backward-compatible defaults. The "breaking" is intentional — hiding elements that should have been hidden.

---

### FIX 4: Remove Duplicate `FirebaseSyncEngine` from `profile-admin-bootstrap.js`

**Proposed:** Delete the class definition from bootstrap.js and import from `js/models/FirebaseSyncEngine.js` instead.

#### What Would Break

| Dependency                                  | Impact                                                                                                           | Mitigation                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| All 7 portals loading bootstrap.js          | The class was already being defined twice; removing from bootstrap means only `FirebaseSyncEngine.js` defines it | **NO BREAK** — same class, just one source |
| Any code calling `new FirebaseSyncEngine()` | bootstrap.js defined it as a class; FirebaseSyncEngine.js also defines it identically                            | **NO BREAK** — identical definitions       |
| `window.FirebaseSyncEngine` assignment      | Both files do `window.FirebaseSyncEngine = FirebaseSyncEngine;` — same result                                    | **NO BREAK**                               |

**Verdict:** Zero breaking risk. The duplicate was harmless (same code) but confusing. Clean up recommended.

---

### FIX 5: Add Hash Routing (`_handleHashRouting()`) to ProfileController

**Proposed:** Parse URL hash on init to activate correct tab; push state on navigation.

#### What Would Break

| Dependency                                           | Impact                           | Mitigation                                 |
| ---------------------------------------------------- | -------------------------------- | ------------------------------------------ |
| Current hash-less navigation                         | Tabs won't survive page refresh  | **FIXES THIS BUG** — no break, improvement |
| Bookmarked URLs like `index.html#tab-healer-connect` | Currently ignored, now respected | **POSITIVE** — previously dead feature     |
| Any code setting `window.location.hash` manually     | Now has semantic meaning         | Verify no conflicts                        |

**Verdict:** Pure addition, no breaking changes. Fixes CLAUDE.md Pitfall #3.

---

### FIX 6: Unify localStorage Keys — Standardize on `sk_admin_profiles_v3` and `sk_pairing_invites`

**Proposed:** Update `join.html` to use `sk_admin_profiles_v3` instead of `sk_profiles_data`, and `sk_pairing_invites` instead of `spiritual_karim_pairing_invites`.

#### What Would Break

| Dependency                                                                | Impact                                                | Mitigation                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| Existing data in `sk_profiles_data` localStorage key                      | Will become unread by join.html unless migration runs | **HIGH** — run one-time migration script on first load after fix |
| Existing pairing invites in `spiritual_karim_pairing_invites` key         | Will disappear from both join.html and admin UI       | **CRITICAL** — migrate data on first load                        |
| `scratch/patch_join_page.js` and other scratch files referencing old keys | Scripts will be inconsistent                          | Update scratch files too                                         |
| Browser localStorage with old data                                        | Users see broken mentor lookup until migration runs   | Show migration banner                                            |

**Migration Script Required:**

```javascript
// Run once on fix deployment
if (
  localStorage.getItem("sk_profiles_data") &&
  !localStorage.getItem("sk_admin_profiles_v3")
) {
  localStorage.setItem(
    "sk_admin_profiles_v3",
    localStorage.getItem("sk_profiles_data"),
  );
}
if (
  localStorage.getItem("spiritual_karim_pairing_invites") &&
  !localStorage.getItem("sk_pairing_invites")
) {
  localStorage.setItem(
    "sk_pairing_invites",
    localStorage.getItem("spiritual_karim_pairing_invites"),
  );
}
```

**Verdict:** Requires data migration. Safe with migration script. Without it, existing user data breaks.

---

### FIX 7: Unify Version Hashes Across All Portals

**Proposed:** Run `sync_all.js` to set identical `•v=sk_v5_XXXXX` across all 7 portals.

#### What Would Break

| Dependency                  | Impact                                         | Mitigation                                                                     |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Browser cache of old hashes | Users may see stale assets until cache expires | Version hash IS the cache-buster — changing it invalidates cache intentionally |
| `sync_all.js` script        | Script will succeed                            | None                                                                           |

**Verdict:** Zero breaking risk. Standard housekeeping.

---

### FIX 8: Fix `login.html` Redirect Map

**Proposed:** Change redirects from:

```javascript
const redirects = {
  master: "index.html•role=admin",
  healer: "Healers/•role=healer",
  devotee: "Devotee/•role=devotee",
};
```

To:

```javascript
const redirects = {
  master: "index.html",
  healer: "index.html#healer",
  devotee: "index.html#devotee",
};
```

#### What Would Break

| Dependency                                                          | Impact                                                   | Mitigation                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| `index.html•role=admin` param handling                              | Currently parsed but overridden — removing it is cleaner | Safe                                           |
| `Healers/•role=healer` (note: trailing slash, missing `index.html`) | Currently BROKEN — redirects to directory listing or 404 | **FIXES THIS BUG**                             |
| `Devotee/•role=devotee` (same issue)                                | Currently BROKEN                                         | **FIXES THIS BUG**                             |
| Users with bookmarked `index.html•role=MASTER`                      | Param ignored post-fix                                   | Acceptable — param was never properly enforced |

**Verdict:** Fixes 2 broken redirects and removes a security issue (URL param role override). Net positive.

---

### FIX 9: Remove URL Param Role Override in ProfileModel

**Proposed:** Remove the `•role=` URL parameter parsing that overrides the detected role.

#### What Would Break

| Dependency                                            | Impact                                                                 | Mitigation                           |
| ----------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| `login.html` redirect: `index.html•role=admin`        | Param now ignored — but login.html is fixed in Fix 8 to not use params | Coordinated fix                      |
| Any manual testing using `•role=DEVOTEE` to skip auth | No longer possible — this was an auth bypass                           | **INTENTIONAL BREAK** — security fix |
| Bookmark URLs with `•role=...`                        | Param ignored                                                          | Acceptable                           |

**Verdict:** Security hardening. Must be coordinated with Fix 8 (login.html).

---

### FIX 10: Delete `js/profile-admin.js` Legacy Backup

**Proposed:** Remove the 8628-line monolithic backup file.

#### What Would Break

| Dependency                                         | Impact                                 | Mitigation             |
| -------------------------------------------------- | -------------------------------------- | ---------------------- |
| `scratch/implement_devotee_healer_enhancements.js` | May reference this file                | Update scratch scripts |
| Any developer expecting to find it                 | Confusion                              | Document removal       |
| None of the running application                    | **NO IMPACT** — not loaded by any HTML | Safe to delete         |

**Verdict:** Zero runtime impact. Cleanup only.

---

## SECTION 7: IMPLEMENTATION PRIORITY & COORDINATION

### Phase 0: Zero-Risk Fixes (Apply Independently)

| Fix        | Risk    | Effort | Description                                           |
| ---------- | ------- | ------ | ----------------------------------------------------- |
| **Fix 2**  | ✅ None | 5 min  | Fix Trainee/index.html HTML syntax                    |
| **Fix 4**  | ✅ None | 10 min | Remove duplicate FirebaseSyncEngine from bootstrap.js |
| **Fix 7**  | ✅ None | 5 min  | Unify version hashes via sync_all.js                  |
| **Fix 10** | ✅ None | 2 min  | Delete js/profile-admin.js backup                     |

### Phase 1: Coordinated Fixes (Apply Together)

| Fix                   | Risk   | Effort | Dependencies                                                 |
| --------------------- | ------ | ------ | ------------------------------------------------------------ |
| **Fix 8** + **Fix 9** | 🟡 Low | 15 min | login.html redirects + URL param removal                     |
| **Fix 3**             | 🟡 Low | 30 min | portalVisible enforcement (add defaults to all matrix items) |

### Phase 2: Major Refactor (Requires Multi-File Changes)

| Fix       | Risk      | Effort    | Pre-requisites                                                                                                                                                                                              |
| --------- | --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fix 6** | 🟠 Medium | 20 min    | Migration script for localStorage keys                                                                                                                                                                      |
| **Fix 1** | 🔴 High   | 2-3 hours | Fix 6, Fix 8, Fix 9 must be done first. Then update: login.html, join.html, Public/index.html, Seeker/index.html, server.js 404, Goli Gyan iframe paths, sync_all.js, all scratch/test files, documentation |

### Phase 3: Future Enhancements

| Fix                              | Risk      | Effort  | Description                                                                       |
| -------------------------------- | --------- | ------- | --------------------------------------------------------------------------------- |
| **Fix 5**                        | 🟢 Low    | 1 hour  | Add hash routing (\_handleHashRouting) — pure addition                            |
| **Auth matrix migration**        | 🟡 Medium | 2 hours | Flatten nested `item.roles.ROLE` to `item.ROLE` everywhere                        |
| **RBAC integration**             | 🟠 High   | 4 hours | Integrate rbac-admin.html into main portal flow                                   |
| **Remove sub-directory portals** | 🔴 High   | 3 hours | After Fix 1 completes, archive Devotee/, Healers/, Trainee/, Masters/ directories |

---

## SECTION 8: FINAL SUMMARY

### Bugs by Severity

| Severity    | Count | Bugs                                                                                                                                                                                                             |
| ----------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴 Critical | 8     | Trainee HTML broken, no portalVisible enforcement, duplicate entry points, pairing invites key mismatch, no hash routing, auth bypass via URL param, Goli Gyan path from root, join.html→Devotee redirect broken |
| 🟠 High     | 5     | Login redirect map wrong (2 broken paths), URL param role override, FirebaseSyncEngine double-def, version hash desync, missing sub-directory index.html in redirects                                            |
| 🟡 Medium   | 4     | Version hash mismatch, concurrent edit conflicts, 404 page hardcoded path, legacy localStorage key drift                                                                                                         |
| 🟢 Low      | 3     | Backup file clutter, documentation outdated, minor UI polish                                                                                                                                                     |

### Fix Dependency Graph

```
Phase 0 (independent):
  Fix 2 (Trainee HTML) ─┐
  Fix 4 (Firebase dup)  ─┤──► No dependencies
  Fix 7 (Version hash)  ─┘
  Fix 10 (Delete backup)

Phase 1 (coordinated):
  Fix 8 (login redirects) ──► Requires: nothing
  Fix 9 (remove URL param) ──► Requires: Fix 8
  Fix 3 (portalVisible) ──────► Requires: matrix migration

Phase 2 (major):
  Fix 6 (key unification) ────► Requires: migration script
  Fix 1 (merge portals) ──────► Requires: Fix 6, Fix 8, Fix 9

Phase 3 (future):
  Fix 5 (hash routing) ───────► Requires: Fix 1
  Archival of sub-directories ─► Requires: Fix 1 complete
```

### Files Requiring Updates If Fix 1 Is Applied

| File                                       | Change Required                                |
| ------------------------------------------ | ---------------------------------------------- |
| `login.html`                               | Fix redirect map (Fix 8)                       |
| `join.html`                                | Update Devotee redirect to hash route          |
| `Public/index.html`                        | Remove or update Admin Access link             |
| `Seeker/index.html`                        | Remove or update Admin link                    |
| `index.html`                               | Fix Goli Gyan iframe src (remove `../` prefix) |
| `server.js`                                | Update 404 page link                           |
| `sync_all.js`                              | Update regex patterns                          |
| `scratch/test_all_routes.js`               | Update test URLs                               |
| `scratch/patch_join_page.js`               | Update redirect paths                          |
| `docs/platform-overview.html`              | Update architecture diagrams                   |
| `docs/devotee-registration-workflow*.html` | Update portal paths                            |

---

_Report generated: 2026-09-11 | Scope: 7 index.html + 6 external dependencies + fix impact analysis_
