/**
 * ONBOARDING MODULE — Registration & Induction Protocol
 * Handles: OTP, CAPTCHA, T&C, Document Upload, Age Verification,
 *          Legal Agreement, Profile Completion, Session Management,
 *          Appeal Process, Onboarding Tour
 * 
 * Production-ready file name. Integrate with real backend services as needed.
 */

// ============================================================
// 1. DEMO OTP SERVICE (Simulated — no real SMS/email)
// ============================================================
const DemoOTPService = {
  _store: {}, // In-memory OTP store (demo only)

  /**
   * Generate and "send" a 6-digit OTP
   * @param {string} target — phone or email
   * @param {'phone'|'email'} type
   * @returns {Promise<{success: boolean, demoOTP: string}>}
   */
  sendOTP(target, type = 'phone') {
    return new Promise((resolve) => {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      this._store[target] = {
        otp,
        type,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 min expiry
        attempts: 0
      };
      // Simulate network delay
      setTimeout(() => {
        console.log(`[DEMO OTP] ${type === 'phone' ? 'SMS' : 'Email'} sent to ${target}: OTP = ${otp}`);
        resolve({ success: true, demoOTP: otp }); // In demo, return OTP for testing
      }, 1500);
    });
  },

  /**
   * Verify OTP entered by user
   * @param {string} target — phone or email
   * @param {string} enteredOtp
   * @returns {{valid: boolean, reason: string}}
   */
  verifyOTP(target, enteredOtp) {
    const record = this._store[target];
    if (!record) return { valid: false, reason: 'No OTP sent. Please request a new one.' };
    if (Date.now() > record.expiresAt) return { valid: false, reason: 'OTP expired. Please request a new one.' };
    if (record.attempts >= 3) return { valid: false, reason: 'Max attempts reached. Please request a new one.' };
    record.attempts++;
    if (record.otp !== enteredOtp) return { valid: false, reason: `Invalid OTP. ${3 - record.attempts} attempts remaining.` };
    delete this._store[target]; // Consume OTP
    return { valid: true, reason: 'Verified successfully.' };
  }
};

// ============================================================
// 2. DEMO CAPTCHA (Simple math challenge — no Google reCAPTCHA)
// ============================================================
const DemoCaptcha = {
  _current: null,

  generate() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    this._current = { question: `${a} + ${b} = ?`, answer: String(a + b) };
    return this._current.question;
  },

  verify(answer) {
    return answer.trim() === this._current?.answer;
  }
};

// ============================================================
// 3. DEMO TERMS & CONDITIONS (Version tracked)
// ============================================================
const DemoTandC = {
  version: '1.2.0',
  lastUpdated: '2026-09-01',
  title: 'Shree Spritual Karim Sansthan — Terms & Conditions',

  getFullText() {
    return `
SHREE SPIRITUAL KARIM SANSTHAN
TERMS & CONDITIONS (Demo Version v${this.version})
Last Updated: ${this.lastUpdated}

1. ELIGIBILITY
   You must be at least 18 years of age to register as a member.
   By registering, you confirm that you are legally capable of entering into binding contracts.

2. MEMBERSHIP
   Your membership is non-transferable and non-refundable.
   The Sansthan reserves the right to terminate membership for violation of terms.

3. COMMISSION & PAYOUTS
   Commissions are earned as per the current compensation plan.
   Payouts are processed monthly subject to minimum threshold and KYC completion.
   TAXES: You are responsible for all applicable taxes on commission income.

4. CODE OF CONDUCT
   Members shall not engage in unethical practices, misrepresentation, or spamming.
   Spiritual practices must be conducted with respect and integrity.

5. DATA PRIVACY
   Your personal data is stored securely and used only for Sansthan operations.
   We do not sell your data to third parties. See our Privacy Policy for details.

6. LIABILITY
   The Sansthan is not liable for any direct or indirect damages arising from service use.
   Spiritual remedies are complementary and not a substitute for medical advice.

7. DISPUTE RESOLUTION
   All disputes are subject to jurisdiction of Mumbai, Maharashtra, India.
   Arbitration shall be the preferred mode of resolution.

8. AMENDMENTS
   Terms may be updated from time to time. Continued use constitutes acceptance.
   Major changes will be notified via registered email.

BY CLICKING "I AGREE", YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS.
    `.trim();
  },

  /**
   * Record acceptance (demo — stores in localStorage)
   */
  recordAcceptance(profileId, ip = '127.0.0.1') {
    const record = {
      profileId,
      version: this.version,
      acceptedAt: new Date().toISOString(),
      ip,
      userAgent: navigator.userAgent.substring(0, 100)
    };
    try {
      const all = JSON.parse(localStorage.getItem('sk_tc_acceptances') || '[]');
      all.push(record);
      localStorage.setItem('sk_tc_acceptances', JSON.stringify(all));
    } catch (e) { /* ignore */ }
    return record;
  }
};

// ============================================================
// 4. DEMO DOCUMENT UPLOAD (Simulated — stores as base64 in localStorage)
// ============================================================
const DemoDocUpload = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],

  validate(file) {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, reason: `Invalid file type: ${file.type}. Allowed: JPG, PNG, PDF.` };
    }
    if (file.size > this.MAX_SIZE) {
      return { valid: false, reason: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 5MB.` };
    }
    return { valid: true, reason: 'File valid.' };
  },

  async upload(file, profileId, docType) {
    const validation = this.validate(file);
    if (!validation.valid) return validation;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const record = {
          id: 'doc-' + Date.now(),
          profileId,
          docType, // 'id_proof', 'address_proof', 'photo'
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          dataUrl: reader.result,
          uploadedAt: new Date().toISOString(),
          status: 'PENDING_VERIFICATION' // Demo: auto-pending
        };
        try {
          const all = JSON.parse(localStorage.getItem('sk_documents') || '[]');
          all.push(record);
          localStorage.setItem('sk_documents', JSON.stringify(all));
          resolve({ success: true, document: record });
        } catch (e) {
          reject({ success: false, reason: 'Storage full. Try smaller files.' });
        }
      };
      reader.onerror = () => reject({ success: false, reason: 'File read error.' });
      reader.readAsDataURL(file);
    });
  },

  getDocuments(profileId) {
    try {
      const all = JSON.parse(localStorage.getItem('sk_documents') || '[]');
      return all.filter(d => d.profileId === profileId);
    } catch (e) { return []; }
  }
};

// ============================================================
// 5. DEMO AGE VERIFICATION
// ============================================================
const DemoAgeVerification = {
  MIN_AGE: 18,

  calculateAge(dobString) {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  },

  verify(dobString) {
    const age = this.calculateAge(dobString);
    if (isNaN(age)) return { valid: false, reason: 'Invalid date of birth.', age: 0 };
    if (age < this.MIN_AGE) return { valid: false, reason: `You must be at least ${this.MIN_AGE} years old. Current age: ${age}.`, age };
    return { valid: true, reason: `Age verified: ${age} years.`, age };
  }
};

// ============================================================
// 6. DEMO LEGAL AGREEMENT (E-Signature simulation)
// ============================================================
const DemoLegalAgreement = {
  version: '1.0.0',

  getContractText(sponsorName, seekerName) {
    return `
SPIRITUAL KARIM MEMBERSHIP AGREEMENT (Demo v${this.version})

Between:
  SPONSOR: ${sponsorName || 'Shree Spritual Karim Sansthan'}
  MEMBER:  ${seekerName || '[Seeker Name]'}

1. The Member agrees to abide by the Sansthan's rules and code of conduct.
2. The Member acknowledges that spiritual practices are voluntary and complementary.
3. Commission structure is as per the current plan and may change with notice.
4. This agreement is binding upon acceptance by both parties.
5. Either party may terminate with 30 days written notice.

DIGITAL SIGNATURE: By typing your full name below, you electronically sign this agreement.
    `.trim();
  },

  recordSignature(profileId, signatureText) {
    const record = {
      profileId,
      signature: signatureText,
      version: this.version,
      signedAt: new Date().toISOString(),
      ip: '127.0.0.1'
    };
    try {
      const all = JSON.parse(localStorage.getItem('sk_signatures') || '[]');
      all.push(record);
      localStorage.setItem('sk_signatures', JSON.stringify(all));
    } catch (e) { /* ignore */ }
    return record;
  }
};

// ============================================================
// 7. DEMO PROFILE COMPLETION SCORE
// ============================================================
const DemoProfileCompletion = {
  WEIGHTS: {
    name: 5, phone: 5, email: 5, city: 3, address: 2,
    photo: 10, dob: 5, idProof: 10, addressProof: 5,
    tcAccepted: 5, signature: 5, bankDetails: 5, nominee: 5,
    lineage: 10, remedies: 5, houseClean: 5, healerConnected: 5
  },

  calculate(profile) {
    let score = 0;
    let maxScore = 0;
    const missing = [];

    const checks = [
      { field: 'name', weight: this.WEIGHTS.name, check: () => profile.name && profile.name.length >= 3 },
      { field: 'phone', weight: this.WEIGHTS.phone, check: () => profile.phone && profile.phone.length >= 10 },
      { field: 'email', weight: this.WEIGHTS.email, check: () => profile.email && profile.email.includes('@') },
      { field: 'city', weight: this.WEIGHTS.city, check: () => profile.city && profile.city.length > 0 },
      { field: 'address', weight: this.WEIGHTS.address, check: () => profile.address && profile.address.length > 0 },
      { field: 'dob', weight: this.WEIGHTS.dob, check: () => profile.dob && profile.dob.length > 0 },
      { field: 'lineage', weight: this.WEIGHTS.lineage, check: () => profile.lineage?.currentFamily?.selfName },
      { field: 'remedies', weight: this.WEIGHTS.remedies, check: () => profile.selectedRemedies?.length > 0 },
      { field: 'houseClean', weight: this.WEIGHTS.houseClean, check: () => profile.houseCleanLevels?.some(h => h.status !== 'NOT_STARTED') }
    ];

    checks.forEach(({ field, weight, check }) => {
      maxScore += weight;
      if (check()) score += weight;
      else missing.push(field);
    });

    // Check documents
    const docs = DemoDocUpload.getDocuments(profile.id);
    if (docs.some(d => d.docType === 'photo')) score += this.WEIGHTS.photo; else missing.push('photo');
    maxScore += this.WEIGHTS.photo;
    if (docs.some(d => d.docType === 'id_proof')) score += this.WEIGHTS.idProof; else missing.push('idProof');
    maxScore += this.WEIGHTS.idProof;
    if (docs.some(d => d.docType === 'address_proof')) score += this.WEIGHTS.addressProof; else missing.push('addressProof');
    maxScore += this.WEIGHTS.addressProof;

    // Check T&C
    try {
      const acceptances = JSON.parse(localStorage.getItem('sk_tc_acceptances') || '[]');
      if (acceptances.some(a => a.profileId === profile.id)) score += this.WEIGHTS.tcAccepted; else missing.push('tcAccepted');
    } catch (e) { missing.push('tcAccepted'); }
    maxScore += this.WEIGHTS.tcAccepted;

    // Check signature
    try {
      const sigs = JSON.parse(localStorage.getItem('sk_signatures') || '[]');
      if (sigs.some(s => s.profileId === profile.id)) score += this.WEIGHTS.signature; else missing.push('signature');
    } catch (e) { missing.push('signature'); }
    maxScore += this.WEIGHTS.signature;

    const percent = Math.round((score / maxScore) * 100);
    return { score, maxScore, percent, missing };
  }
};

// ============================================================
// 8. DEMO SESSION MANAGEMENT (Timeout simulation)
// ============================================================
const DemoSession = {
  TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  WARNING_AT_MS: 25 * 60 * 1000, // Warn at 25 min
  _timer: null,
  _warningTimer: null,
  _onTimeout: null,

  start(onTimeoutCallback) {
    this._onTimeout = onTimeoutCallback;
    this._resetTimers();
    this._log('Session started');
  },

  _resetTimers() {
    this._clearTimers();
    this._warningTimer = setTimeout(() => {
      this._log('Session expiring in 5 minutes');
      if (typeof this._onTimeout === 'function') this._onTimeout('warning');
    }, this.WARNING_AT_MS);

    this._timer = setTimeout(() => {
      this._log('Session expired');
      this.destroy();
      if (typeof this._onTimeout === 'function') this._onTimeout('expired');
    }, this.TIMEOUT_MS);
  },

  /** Call on user activity to reset timer */
  ping() {
    this._resetTimers();
  },

  _clearTimers() {
    if (this._timer) clearTimeout(this._timer);
    if (this._warningTimer) clearTimeout(this._warningTimer);
  },

  destroy() {
    this._clearTimers();
    this._log('Session destroyed');
  },

  getRemainingTime() {
    // Return approximate remaining time based on session start
    try {
      const sessions = JSON.parse(sessionStorage.getItem(this._key) || '{}');
      if (sessions.loginAt) {
        const elapsed = Date.now() - sessions.loginAt;
        const remaining = Math.max(0, this.TIMEOUT_MS - elapsed);
        return remaining;
      }
    } catch (e) { /* ignore */ }
    return this.TIMEOUT_MS;
  },

  _log(msg) {
    console.log(`[DEMO SESSION] ${msg}`);
  }
};

// ============================================================
// 9. DEMO APPEAL PROCESS
// ============================================================
const DemoAppeal = {
  /**
   * Submit an appeal for a rejected invite
   */
  submitAppeal(inviteId, reason, additionalInfo = '') {
    const appeal = {
      id: 'appeal-' + Date.now(),
      inviteId,
      reason,
      additionalInfo,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      decision: null,
      decisionReason: null
    };
    try {
      const all = JSON.parse(localStorage.getItem('sk_appeals') || '[]');
      all.push(appeal);
      localStorage.setItem('sk_appeals', JSON.stringify(all));
    } catch (e) { /* ignore */ }
    return appeal;
  },

  /**
   * Admin reviews an appeal
   */
  reviewAppeal(appealId, decision, reason) {
    try {
      const all = JSON.parse(localStorage.getItem('sk_appeals') || '[]');
      const appeal = all.find(a => a.id === appealId);
      if (appeal) {
        appeal.status = decision; // 'APPROVED' or 'REJECTED'
        appeal.decision = decision;
        appeal.decisionReason = reason;
        appeal.reviewedAt = new Date().toISOString();
        localStorage.setItem('sk_appeals', JSON.stringify(all));
      }
      return appeal;
    } catch (e) { return null; }
  },

  getAppeals(inviteId = null) {
    try {
      const all = JSON.parse(localStorage.getItem('sk_appeals') || '[]');
      return inviteId ? all.filter(a => a.inviteId === inviteId) : all;
    } catch (e) { return []; }
  }
};

// ============================================================
// 10. DEMO ONBOARDING TOUR (Guided walkthrough)
// ============================================================
const DemoTour = {
  _tours: {
    devotee: [
      { target: '#main-profile-box-1', title: 'Welcome!', content: 'This is your profile card. Click the stamp to toggle Paid/Free status.', position: 'bottom' },
      { target: '#profile-directory-list', title: 'Directory', content: 'Browse all members organized by tier. Click any profile to view details.', position: 'right' },
      { target: '.main-tab-btn[data-main-tab="tab-devotee-personal"]', title: 'Tab 1: Personal', content: 'Edit your identity, lineage, and house clean levels here.', position: 'bottom' },
      { target: '.main-tab-btn[data-main-tab="tab-seeker-purpose"]', title: 'Tab 2: Purpose', content: 'Select remedies and sadhanas. Each tick auto-enrolls you!', position: 'bottom' },
      { target: '.main-tab-btn[data-main-tab="tab-trainee-sadhak"]', title: 'Tab 3: Trainee', content: 'Track progress, add memos, and request upline verification.', position: 'bottom' },
      { target: '.main-tab-btn[data-main-tab="tab-healer-connect"]', title: 'Tab 4: Healer', content: 'Connect with your certified spiritual healer mentor.', position: 'bottom' },
      { target: '.main-tab-btn[data-main-tab="tab-genealogy-tree"]', title: 'Tab 5: Tree', content: 'Visualize the organization hierarchy with zoomable canvas.', position: 'bottom' },
      { target: '#btn-save-profile', title: 'Save', content: 'Don\'t forget to save your changes! Data is stored locally.', position: 'left' }
    ],
    healer: [
      { target: '#main-profile-box-1', title: 'Healer Dashboard', content: 'Your certification and network overview.', position: 'bottom' },
      { target: '#profile-directory-list', title: 'Your Downline', content: 'Members under your mentorship appear here.', position: 'right' },
      { target: '.main-tab-btn[data-main-tab="tab-healer-connect"]', title: 'Healers Hub', content: 'View and manage your connected devotees.', position: 'bottom' },
      { target: '#btn-quick-share-pairing', title: 'Invite Seekers', content: 'Generate 24-hour pairing invites from the top bar.', position: 'left' }
    ],
    admin: [
      { target: '#main-profile-box-1', title: 'Master Control', content: 'Admin dashboard with full system access.', position: 'bottom' },
      { target: '#profile-directory-list', title: 'All Tiers', content: 'View and manage all 4 tiers of the organization.', position: 'right' },
      { target: '#btn-admin-settings', title: 'Settings', content: 'Configure system settings and RBAC matrix.', position: 'left' },
      { target: '#btn-quick-share-pairing', title: 'Pairing', content: 'Create and manage 24-hour pairing invites.', position: 'left' }
    ]
  },

  getSteps(role = 'devotee') {
    return this._tours[role] || this._tours.devotee;
  },

  /**
   * Check if user has completed tour
   */
  hasCompleted(role = 'devotee') {
    try {
      const completed = JSON.parse(localStorage.getItem('sk_tour_completed') || '[]');
      return completed.includes(role);
    } catch (e) { return false; }
  },

  markCompleted(role = 'devotee') {
    try {
      const completed = JSON.parse(localStorage.getItem('sk_tour_completed') || '[]');
      if (!completed.includes(role)) {
        completed.push(role);
        localStorage.setItem('sk_tour_completed', JSON.stringify(completed));
      }
    } catch (e) { /* ignore */ }
  }
};

// ============================================================
// 11. DEMO AUTHENTICATION (Simple password-based)
// ============================================================
const DemoAuth = {
  _key: 'sk_auth_sessions',

  /**
   * Register a demo account (stores hashed password)
   */
  register(username, password, role = 'devotee') {
    if (username.length < 3) return { success: false, reason: 'Username must be at least 3 characters.' };
    if (password.length < 6) return { success: false, reason: 'Password must be at least 6 characters.' };
    try {
      const users = JSON.parse(localStorage.getItem('sk_auth_users') || '{}');
      if (users[username]) return { success: false, reason: 'Username already exists.' };
      // Demo: simple hash (NOT secure — use bcrypt in production)
      const hash = btoa(password + '_demo_salt_2026');
      users[username] = { hash, role, createdAt: new Date().toISOString() };
      localStorage.setItem('sk_auth_users', JSON.stringify(users));
      return { success: true, username, role };
    } catch (e) { return { success: false, reason: 'Registration failed.' }; }
  },

  /**
   * Login
   */
  login(username, password) {
    try {
      const users = JSON.parse(localStorage.getItem('sk_auth_users') || '{}');
      const user = users[username];
      if (!user) return { success: false, reason: 'User not found.' };
      const hash = btoa(password + '_demo_salt_2026');
      if (user.hash !== hash) return { success: false, reason: 'Incorrect password.' };
      const session = { username, role: user.role, loginAt: Date.now() };
      sessionStorage.setItem(this._key, JSON.stringify(session));
      return { success: true, session };
    } catch (e) { return { success: false, reason: 'Login failed.' }; }
  },

  /**
   * Check if logged in
   */
  getSession() {
    try {
      const data = sessionStorage.getItem(this._key);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  },

  /**
   * Logout
   */
  logout() {
    sessionStorage.removeItem(this._key);
    DemoSession.destroy();
  },

  /**
   * Require auth — redirect if not logged in
   */
  requireAuth(redirectUrl = 'login.html') {
    if (!this.getSession()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }
};

// ============================================================
// 12. DEMO STRUCTURED REJECTION REASONS
// ============================================================
const DemoRejection = {
  REASONS: [
    { id: 'incomplete_docs', label: 'Incomplete Documents', description: 'Required documents not uploaded or unclear.' },
    { id: 'invalid_sponsor', label: 'Invalid Sponsor Code', description: 'Sponsor code does not match any active mentor.' },
    { id: 'duplicate_profile', label: 'Duplicate Profile', description: 'A profile with this phone/email already exists.' },
    { id: 'underage', label: 'Underage Applicant', description: 'Applicant does not meet minimum age requirement (18 years).' },
    { id: 'suspicious_activity', label: 'Suspicious Activity', description: 'Unusual patterns detected in registration data.' },
    { id: 'quota_full', label: 'Mentor Quota Full', description: 'Sponsor has reached maximum pending invites (5).' },
    { id: 'region_mismatch', label: 'Region Mismatch', description: 'Applicant region not served by this sponsor.' },
    { id: 'other', label: 'Other (Specify)', description: 'Custom rejection reason.' }
  ],

  /**
   * Get rejection reason options for dropdown
   */
  getReasonOptions() {
    return this.REASONS.map(r => ({ value: r.id, label: r.label }));
  },

  /**
   * Record a structured rejection
   */
  recordRejection(inviteId, reasonId, customReason = '', adminName = 'Admin') {
    const reason = this.REASONS.find(r => r.id === reasonId);
    const record = {
      id: 'rej-' + Date.now(),
      inviteId,
      reasonId,
      reasonLabel: reason?.label || reasonId,
      customReason: reasonId === 'other' ? customReason : '',
      adminName,
      rejectedAt: new Date().toISOString(),
      appealEligible: true,
      appealDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    try {
      const all = JSON.parse(localStorage.getItem('sk_rejections') || '[]');
      all.push(record);
      localStorage.setItem('sk_rejections', JSON.stringify(all));
    } catch (e) { /* ignore */ }
    return record;
  },

  /**
   * Get rejection record for an invite
   */
  getRejection(inviteId) {
    try {
      const all = JSON.parse(localStorage.getItem('sk_rejections') || '[]');
      return all.find(r => r.inviteId === inviteId) || null;
    } catch (e) { return null; }
  },

  /**
   * Check if invite is eligible for appeal
   */
  isAppealable(inviteId) {
    const rejection = this.getRejection(inviteId);
    if (!rejection) return false;
    if (!rejection.appealEligible) return false;
    return new Date() < new Date(rejection.appealDeadline);
  }
};

// ============================================================
// 13. DEMO AUDIT LOG (Tracks admin actions for accountability)
// ============================================================
const DemoAudit = {
  _key: 'sk_audit_log',

  /**
   * Log an admin action
   * @param {string} action - Action type (e.g., 'INVITE_APPROVED', 'PROFILE_UPDATED')
   * @param {string} targetId - ID of the affected entity
   * @param {string} adminName - Admin who performed the action
   * @param {object} details - Additional context
   */
  log(action, targetId, adminName = 'Admin', details = {}) {
    const entry = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      action,
      targetId,
      adminName,
      details,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1'
    };
    try {
      const all = JSON.parse(localStorage.getItem(this._key) || '[]');
      all.push(entry);
      localStorage.setItem(this._key, JSON.stringify(all));
    } catch (e) { /* ignore */ }
    return entry;
  },

  /**
   * Get audit log entries
   * @param {string} filterAction - Optional action type filter
   * @param {number} limit - Max entries to return
   * @returns {Array} Audit entries, newest first
   */
  getLog(filterAction = null, limit = 100) {
    try {
      let all = JSON.parse(localStorage.getItem(this._key) || '[]');
      if (filterAction) all = all.filter(e => e.action === filterAction);
      return all.reverse().slice(0, limit);
    } catch (e) { return []; }
  },

  /**
   * Get audit entries for a specific target
   * @param {string} targetId - Profile/invite ID
   */
  getForTarget(targetId) {
    try {
      const all = JSON.parse(localStorage.getItem(this._key) || '[]');
      return all.filter(e => e.targetId === targetId).reverse();
    } catch (e) { return []; }
  },

  /**
   * Clear all audit logs
   */
  clear() {
    localStorage.removeItem(this._key);
  }
};

// ============================================================
// 14. DEMO PROFILE BADGE (Visual completion indicator)
// ============================================================
const DemoProfileBadge = {
  /**
   * Get badge HTML for a profile based on completion score
   * @param {object} profile - Profile object
   * @returns {object} Badge info { html, percent, level, color }
   */
  getBadge(profile) {
    const completion = DemoProfileCompletion.calculate(profile);
    const percent = completion.percent;
    let level, color, icon;

    if (percent >= 90) {
      level = 'GOLD';
      color = '#FFD700';
      icon = '★';
    } else if (percent >= 70) {
      level = 'SILVER';
      color = '#C0C0C0';
      icon = '☆';
    } else if (percent >= 50) {
      level = 'BRONZE';
      color = '#CD7F32';
      icon = '●';
    } else {
      level = 'STARTER';
      color = '#888888';
      icon = '○';
    }

    const html = `<span class="profile-badge" style="color:${color};border-color:${color};" title="Profile ${percent}% complete — ${level} level">${icon} ${percent}%</span>`;

    return { html, percent, level, color, icon };
  },

  /**
   * Render badge into a container element
   * @param {string} elementId - Target element ID
   * @param {object} profile - Profile object
   */
  render(elementId, profile) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const badge = this.getBadge(profile);
    el.innerHTML = badge.html;
  },

  /**
   * Get badge CSS styles (inject once)
   */
  getStyles() {
    return `
      .profile-badge {
        display: inline-block;
        padding: 2px 8px;
        border: 1px solid;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        background: rgba(255,255,255,0.9);
      }
    `;
  }
};

// ============================================================
// 15. DEMO AUDIT VIEWER (UI for viewing audit logs)
// ============================================================
const DemoAuditViewer = {
  /**
   * Render audit log as HTML table
   * @param {string} containerId - Container element ID
   * @param {object} options - { filterAction, limit, targetId }
   */
  render(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { filterAction = null, limit = 50, targetId = null } = options;
    const entries = targetId
      ? DemoAudit.getForTarget(targetId)
      : DemoAudit.getLog(filterAction, limit);

    if (entries.length === 0) {
      container.innerHTML = '<p class="audit-empty">No audit entries found.</p>';
      return;
    }

    const rows = entries.map(e => `
      <tr>
        <td>${new Date(e.timestamp).toLocaleString()}</td>
        <td><span class="audit-action">${e.action}</span></td>
        <td>${e.targetId}</td>
        <td>${e.adminName}</td>
        <td>${e.details ? JSON.stringify(e.details).substring(0, 80) : '-'}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <table class="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th><th>Action</th><th>Target</th><th>Admin</th><th>Details</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  },

  /**
   * Get CSS styles for audit viewer
   */
  getStyles() {
    return `
      .audit-table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .audit-table th, .audit-table td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; }
      .audit-table th { background: #f5f5f5; font-weight: 600; }
      .audit-action { background: #e3f2fd; padding: 2px 6px; border-radius: 3px; font-size: 11px; }
      .audit-empty { color: #888; font-style: italic; padding: 20px; text-align: center; }
    `;
  },

  /**
   * Inject required styles into document head
   */
  injectStyles() {
    if (document.getElementById('demo-audit-styles')) return;
    const style = document.createElement('style');
    style.id = 'demo-audit-styles';
    style.textContent = this.getStyles();
    document.head.appendChild(style);
  }
};

// ============================================================
// EXPORTS
// ============================================================
if (typeof window !== 'undefined') {
  window.DemoOTPService = DemoOTPService;
  window.DemoCaptcha = DemoCaptcha;
  window.DemoTandC = DemoTandC;
  window.DemoDocUpload = DemoDocUpload;
  window.DemoAgeVerification = DemoAgeVerification;
  window.DemoLegalAgreement = DemoLegalAgreement;
  window.DemoProfileCompletion = DemoProfileCompletion;
  window.DemoSession = DemoSession;
  window.DemoAppeal = DemoAppeal;
  window.DemoTour = DemoTour;
  window.DemoAuth = DemoAuth;
  window.DemoAudit = DemoAudit;
  window.DemoProfileBadge = DemoProfileBadge;
  window.DemoAuditViewer = DemoAuditViewer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DemoOTPService, DemoCaptcha, DemoTandC, DemoDocUpload,
    DemoAgeVerification, DemoLegalAgreement, DemoProfileCompletion,
    DemoSession, DemoAppeal, DemoTour, DemoAuth, DemoAudit
  };
}
