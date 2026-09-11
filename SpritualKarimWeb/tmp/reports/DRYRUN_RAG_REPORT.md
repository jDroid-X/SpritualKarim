# DRY RUN WORKFLOW TEST - RAG REPORT
## Profile Creation Lifecycle Test

**Test Date**: 2026-09-10 18:02:59
**Test Scenario**: Create devotee profile from admin → Approval → Devotee Portal Update

---

## CRITICAL BUGS FOUND

### BUG-001: localStorage Key Mismatch [CRITICAL]

| Aspect | Detail |
|--------|--------|
| **Severity** | 🔴 CRITICAL |
| **Location** | Admin: ProfileModel.js:1229, 1276 |
| **Location** | Join: join.html:941, 943, 995, 1047 |
| **Issue** | Admin writes to \spiritual_karim_pairing_invites\ |
| **Issue** | Join reads from \sk_pairing_invites\ |
| **Impact** | JOIN PAGE CANNOT SEE ADMIN INVITES |
| **Workflow** | BROKEN - Complete failure at Step 2 |

**Evidence:**
`javascript
// ProfileModel.js (Admin)
getPairingInvites() {
  const stored = localStorage.getItem('spiritual_karim_pairing_invites'); // ← WRONG KEY
}

// join.html (Devotee)
const invites = JSON.parse(localStorage.getItem('sk_pairing_invites') || '[]'); // ← DIFFERENT KEY
`

---

## STEP-BY-STEP DRY RUN ANALYSIS

### Step 1: Admin Generates Pairing Link ✅
| Check | Status | Details |
|-------|--------|---------|
| Method exists | ✅ PASS | \createPairingInvite()\ in ProfileModel.js |
| Validation logic | ✅ PASS | Lineage cycle check, capacity throttle (max 5) |
| Data generated | ✅ PASS | Creates invite with all metadata |
| Storage key | ⚠️ WARN | Uses \spiritual_karim_pairing_invites\ |
| UI trigger | ✅ PASS | Button handlers in ProfileController2.js |

**Generated Data Structure:**
`json
{
  "id": "inv-1234567890",
  "sponsorCode": "SKHM-ADM1-7788-9900",
  "seekerName": "John Doe",
  "seekerPhone": "+91 98765 43210",
  "hardwareNonce": "HW-ABC123-1234567890",
  "telegramLink": "https://t.me/SpiritualKarimBot•start=pair_SKHMADM177889900",
  "status": "PENDING",
  "expiresAtMs": <24h from now>
}
`

---

### Step 2: Devotee Opens Link ❌ FAILED
| Check | Status | Details |
|-------|--------|---------|
| URL params parsed | ✅ PASS | \•ref=SponsorCode&pin=ActivationPIN\ |
| Sponsor display | ✅ PASS | Shows mentor name/code |
| Invite verification | ❌ FAIL | Reads wrong localStorage key |
| Form prefill | ⚠️ PARTIAL | Only sponsor info, no invite data |

**Root Cause:** LocalStorage key mismatch prevents invite lookup.

---

### Step 3: Devotee Registration Form ✅
| Check | Status | Details |
|-------|--------|---------|
| Multi-step wizard | ✅ PASS | 5 steps: Identity → Verify → Documents → T&C → Review |
| Form validation | ✅ PASS | Required fields, date of birth (18+), email format |
| OTP simulation | ✅ PASS | Demo mode shows OTP in popup |
| Document upload | ✅ PASS | Simulated base64 storage |
| E-signature | ✅ PASS | Canvas signature capture |
| Data submission | ⚠️ PARTIAL | Stores to wrong localStorage key |

**Submitted Data Structure:**
`json
{
  "id": "inv-xxx",
  "seekerName": "John Doe",
  "seekerPhone": "+91 98765 43210",
  "seekerEmail": "john@example.com",
  "sponsorCode": "SKHM-ADM1-7788-9900",
  "activationPin": "140610",
  "objective": "House Clean & Ancestral Purification",
  "dob": "1990-01-15",
  "signature": "<base64>",
  "documentsUploaded": { "photo": true, "idProof": true },
  "status": "PENDING",
  "createdAtMs": <timestamp>,
  "expiresAtMs": <24h later>
}
`

---

### Step 4: Admin Approves Invitation ✅
| Check | Status | Details |
|-------|--------|---------|
| Approval button | ✅ PASS | \tn-approve-pairing\ handler exists |
| Status update | ✅ PASS | Sets \APPROVED\ status |
| Profile creation | ✅ PASS | Creates devotee profile in profiles array |
| Network update | ✅ PASS | Adds to \healerNetwork\ array |
| Notification | ✅ PASS | Toast message shown |

**Created Profile Structure:**
`json
{
  "id": "prof-dev-abc123",
  "referenceCode": "HW-FPRINT-XXXX-YYYY",
  "referredByCode": "SKHM-ADM1-7788-9900",
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "profileType": "DEVOTEE",
  "level": 5,
  "isActive": true,
  "joinDate": "2026-09-10"
}
`

---

### Step 5: Devotee Portal Update ⚠️ INCOMPLETE
| Check | Status | Details |
|-------|--------|---------|
| Status polling | ⚠️ PARTIAL | Checks localStorage every 5s |
| State transition | ❌ FAIL | Depends on correct localStorage key |
| Profile sync | ⚠️ UNKNOWN | Needs verification |
| Tab visibility | ⚠️ UNKNOWN | Role-based rendering |

**Missing:** No mechanism to push status update to devotee browser after approval.

---

### Step 6: Profile Verification ✅
| Check | Status | Details |
|-------|--------|---------|
| Duplicate check | ✅ PASS | \indDuplicateProfile()\ checks email+phone |
| Circular referral | ✅ PASS | Lineage validation prevents loops |
| Capacity throttle | ✅ PASS | Max 5 pending invites per mentor |
| Expiry handling | ✅ PASS | 24-hour window enforced |

---

## ADDITIONAL ISSUES IDENTIFIED

### Issue-001: Missing Cross-Tab Communication
| Severity | 🟡 MEDIUM |
| Location | All JS files |
| Problem | No BroadcastChannel/WebSocket for real-time updates |
| Impact | Devotee must refresh page to see status change |
| Solution | Implement BroadcastChannel API or Firebase listener |

### Issue-002: Incomplete Form Data Storage
| Severity | 🟠 HIGH |
| Location | join.html:941-950 |
| Problem | Submitted form data not persisted to profiles store |
| Impact | Admin approves invite but devotee profile incomplete |
| Solution | Merge invite data with form submission |

### Issue-003: Missing Email/Phone Notification
| Severity | 🟡 MEDIUM |
| Location | join.html, ProfileModel.js |
| Problem | No notification sent on approval/rejection |
| Impact | Devotee unaware of status change |
| Solution | Add toast notification + optional email/SMS (demo mode) |

### Issue-004: No Payment Status Integration
| Severity | 🟢 LOW |
| Location | ProfileModel.js |
| Problem | New devotee created with \isPaid: false\ |
| Impact | Cannot access paid features until payment |
| Solution | Add payment flow integration |

---

## LOCALSTORAGE KEY AUDIT

| Component | Key Used | Status |
|-----------|----------|--------|
| Admin - Get Invites | \spiritual_karim_pairing_invites\ | ⚠️ INCONSISTENT |
| Admin - Save Invites | \spiritual_karim_pairing_invites\ | ⚠️ INCONSISTENT |
| Join - Get Invites | \sk_pairing_invites\ | ⚠️ INCONSISTENT |
| Join - Save Invites | \sk_pairing_invites\ | ⚠️ INCONSISTENT |
| Profiles Store | \sk_admin_profiles_v3\ | ✅ CONSISTENT |
| Settings | \sk_admin_system_settings_v1\ | ✅ CONSISTENT |
| Auth Matrix | \sk_auth_matrix_v5\ | ✅ CONSISTENT |

---

## RECOMMENDED FIXES

### Fix-1: Standardize localStorage Keys
**Priority:** 🔴 CRITICAL  
**File:** ProfileModel.js, join.html  
**Action:** Use \sk_pairing_invites\ consistently everywhere

### Fix-2: Add Cross-Tab Sync
**Priority:** 🟠 HIGH  
**File:** profile-admin-bootstrap.js  
**Action:** Implement BroadcastChannel for real-time updates

### Fix-3: Complete Profile Creation
**Priority:** 🟡 MEDIUM  
**File:** ProfileModel.js (approvePairingInvite)  
**Action:** Include all form data (email, DOB, objective, documents) in new profile

### Fix-4: Add Devotee Notifications
**Priority:** 🟡 MEDIUM  
**File:** join.html  
**Action:** Show modal when approval detected

---

## TEST SCENARIOS SUMMARY

| Scenario | Expected | Actual | Status |
|----------|----------|--------|--------|
| Generate invite link | Link created with ref+pin | Works | ✅ PASS |
| Open link in new tab | Form loads with sponsor info | Works | ✅ PASS |
| Fill registration form | All 5 steps complete | Works | ✅ PASS |
| Submit form | Invite status changes | ❌ FAIL (key mismatch) |
| Admin sees invite | Invite in list | Works | ✅ PASS |
| Approve invite | Profile created | Partial | ⚠️ NEEDS FIX |
| Devotee sees approval | Status updates | ❌ FAIL (no sync) |
| Devotee accesses portal | Role-specific UI | Unknown | ⏳ NEEDS TEST |

---

*"A closed-loop workflow requires bidirectional communication. Current implementation is unidirectional (admin→invite) with broken feedback loop."*
