// Safe localStorage polyfill for non-browser/test runtimes
if (typeof localStorage === "undefined") {
  if (typeof global !== "undefined") {
    if (!global.localStorage) {
      const _memStore = {};
      global.localStorage = {
        getItem: (k) => Object.prototype.hasOwnProperty.call(_memStore, k) ? _memStore[k] : null,
        setItem: (k, v) => { _memStore[k] = String(v); },
        removeItem: (k) => { delete _memStore[k]; },
        clear: () => { for (const k in _memStore) delete _memStore[k]; }
      };
    }
  }
}

class ProfileModel {
  constructor() {
    this.storageKey = "sk_admin_profiles_v3";
    this.activeProfileIdKey = "sk_admin_active_profile_id_v3";
    this.settingsKey = "sk_admin_system_settings_v1";
    this.roleModeKey = "sk_admin_active_role_mode_v1";

    this.profiles = this._loadProfiles();
    this.settings = this._loadSettings();

    this.profileRoleMatrixKey = "sk_profile_role_matrix_v1";

    // Determine initial roleMode respecting authenticated session, URL param, and portal tags
    // Enforcing International MLM security: unauthenticated or invalid roles default to DEVOTEE
    let detectedRole = "DEVOTEE";
    let sessionRole = null;

    try {
      // 1. Authenticated Session from login.html is Ground Truth
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("sk_auth_sessions")) {
        try {
          const s = JSON.parse(sessionStorage.getItem("sk_auth_sessions"));
          if (s && s.role) {
            const sr = s.role.toUpperCase();
            if (["ADMIN", "MASTER"].includes(sr)) sessionRole = "MASTER";
            else if (["HEALER", "HEALERS"].includes(sr)) sessionRole = "HEALER";
            else if (["TRAINEE", "SADHAK"].includes(sr)) sessionRole = "TRAINEE";
            else if (["DEVOTEE", "SEEKER"].includes(sr)) sessionRole = "DEVOTEE";
          }
        } catch(e) {}
      }

      const pathName = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";
      const portalModeTag = typeof document !== "undefined" && document.body ? document.body.getAttribute("data-portal-mode") : null;
      const portalRoleTag = typeof document !== "undefined" && document.body ? document.body.getAttribute("data-portal-role") : null;
      const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const urlRole = urlParams.get("role") || urlParams.get("portalRole");

      const roleRanks = { MASTER: 1, HEALER: 2, TRAINEE: 3, DEVOTEE: 4 };

      if (sessionRole) {
        // User is authenticated: Allow viewing equivalent or lower rank via query param, block escalation
        if (urlRole) {
          let candidate = "DEVOTEE";
          const ur = urlRole.toUpperCase();
          if (["ADMIN", "MASTER"].includes(ur)) candidate = "MASTER";
          else if (["HEALER", "HEALERS"].includes(ur)) candidate = "HEALER";
          else if (["TRAINEE", "SADHAK"].includes(ur)) candidate = "TRAINEE";
          else if (["DEVOTEE", "SEEKER"].includes(ur)) candidate = "DEVOTEE";

          if (roleRanks[candidate] >= roleRanks[sessionRole]) {
            detectedRole = candidate; // Permitted down-scoping for portal preview
          } else {
            console.warn(`[RBAC] Blocked role escalation attempt to ${candidate}. Enforcing authenticated session role: ${sessionRole}`);
            detectedRole = sessionRole;
          }
        } else {
          detectedRole = sessionRole;
        }
      } else {
        // Not authenticated in session: infer from sub-portal path or tag, otherwise least privilege DEVOTEE
        if (pathName.includes("/masters") || pathName.endsWith("masters.html")) {
          detectedRole = "MASTER";
        } else if (pathName.includes("/healers") || pathName.endsWith("healers.html")) {
          detectedRole = "HEALER";
        } else if (pathName.includes("/trainee") || pathName.endsWith("trainee.html")) {
          detectedRole = "TRAINEE";
        } else if (pathName.includes("/devotee") || pathName.endsWith("devotee.html")) {
          detectedRole = "DEVOTEE";
        } else if (portalRoleTag && ["ADMIN", "MASTER", "HEALER", "TRAINEE", "DEVOTEE"].includes(portalRoleTag.toUpperCase())) {
          detectedRole = (portalRoleTag.toUpperCase() === "ADMIN") ? "MASTER" : portalRoleTag.toUpperCase();
        } else if (portalModeTag) {
          detectedRole = portalModeTag.toUpperCase();
        } else {
          detectedRole = localStorage.getItem(this.roleModeKey) || "DEVOTEE";
        }
      }
    } catch (e) {
      detectedRole = "DEVOTEE";
    }
    this.roleMode = detectedRole;

    this.anchorProfileId = null;
    this.inspectedProfileId = null;

    // Resolve specific logged-in member from URL or session storage
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let urlPid = urlParams.get("profileId");
      if (!urlPid && typeof window !== "undefined" && window.location.hash && window.location.hash.includes("profileId=")) {
        const hashQuery = window.location.hash.split("?")[1] || window.location.hash.split("&")[1];
        if (hashQuery) {
          urlPid = new URLSearchParams(hashQuery).get("profileId");
        }
      }
      const storedPid = (typeof sessionStorage !== "undefined" && sessionStorage.getItem("sk_active_profile_id")) ||
                        (typeof localStorage !== "undefined" && localStorage.getItem("sk_active_profile_id"));
      const targetPid = urlPid || storedPid;
      if (targetPid) {
        let found = this.profiles.find(p => p.id === targetPid || p.referenceCode === targetPid);
        if (!found) {
          // Check pending pairing invites (e.g. newly inducted/onboarded seeker)
          try {
            const invites = this.getPairingInvites();
            const inv = invites.find(i => i.id === targetPid || i.devoteeCode === targetPid || i.hardwareNonce === targetPid || i.referenceKey === targetPid);
            if (inv) {
              const assignedRole = (inv.assignedRole || inv.appliedRole || "DEVOTEE").toUpperCase();
              const roleLevel = (assignedRole === "MASTER" || assignedRole === "ADMIN") ? 1 : assignedRole === "HEALER" ? 2 : assignedRole === "TRAINEE" ? 3 : 4;
              const newProf = {
                id: "prof-" + assignedRole.toLowerCase().slice(0, 4) + "-" + (inv.devoteeCode ? inv.devoteeCode.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : Date.now().toString(36)),
                referenceCode: inv.devoteeCode || targetPid,
                referredByCode: inv.sponsorCode || "SKHM-ADM1-7788-9900",
                transferredCode: "",
                name: inv.seekerName || "Devotee Applicant",
                phone: inv.seekerPhone || "",
                email: inv.seekerEmail || "",
                profileType: assignedRole,
                level: roleLevel,
                isPaid: false,
                paymentStatus: "FREE",
                objective: inv.objective || "Household cleansing, Three Diya practice, and ancestral karma resolution.",
                selectedRemedies: ["three_diya", "negativity"],
                address: "",
                city: "",
                joinDate: new Date().toISOString().split("T")[0],
                isActive: true,
                notes: `Applicant inducted under ${assignedRole} role. Device: ${inv.seekerDeviceModel || "Web Client"}`,
                categoryTag: assignedRole === "HEALER" ? "Healers & Mentors" : assignedRole === "TRAINEE" ? "Trainee Sadhaks" : "House Clean & Seekers",
                activationPin: inv.activationPin || "140610",
                hardwareNonce: inv.hardwareNonce || "",
                seekerDeviceModel: inv.seekerDeviceModel || "",
                seekerDiagnostics: {
                  afflictionDuration: "",
                  kuldeviIssues: "",
                  targetOutcome: ""
                }
              };
              this.profiles.push(newProf);
              this.saveProfiles(this.profiles);
              found = newProf;
            }
          } catch(err) {
            console.warn("[PROFILE_INVITE_FALLBACK] Error resolving invite:", err);
          }
        }
        if (found) {
          this.anchorProfileId = found.id;
          if (found.profileType && (urlParams.get("role") || urlParams.get("portalRole") || portalRoleTag !== "ADMIN")) {
            this.roleMode = found.profileType;
          }
        }
      }
      if (!this.anchorProfileId && typeof sessionStorage !== "undefined") {
        const raw = sessionStorage.getItem("sk_auth_sessions");
        if (raw) {
          const session = JSON.parse(raw);
          if (session && session.profileId) {
            const found = this.profiles.find(p => p.id === session.profileId);
            if (found) {
              this.anchorProfileId = found.id;
              if (found.profileType && portalRoleTag !== "ADMIN") {
                this.roleMode = found.profileType;
              }
            }
          } else if (session && session.username) {
            const u = session.username.toLowerCase();
            const found = this.profiles.find(p => {
              const pName = (p.name || "").toLowerCase();
              const clean = pName.replace(/^(dr\.|pt\.|shree|mr\.|mrs\.|ms\.|maa|acharya)\s+/i, '').trim();
              const parts = clean.split(/\s+/).filter(Boolean);
              const dotName = parts.length >= 2 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0];
              return dotName === u || pName.includes(u);
            });
            if (found) {
              this.anchorProfileId = found.id;
              if (found.profileType) this.roleMode = found.profileType;
            }
          }
        }
      }
    } catch (e) {}

    if (!this.anchorProfileId) {
      const storedActiveId =
        (typeof sessionStorage !== "undefined" && (sessionStorage.getItem("sk_active_profile_id") || sessionStorage.getItem(this.activeProfileIdKey))) ||
        (typeof localStorage !== "undefined" && (localStorage.getItem("sk_active_profile_id") || localStorage.getItem(this.activeProfileIdKey)));
      if (storedActiveId) {
        const foundStored = this.profiles.find(
          (p) => p.id === storedActiveId && (p.profileType === this.roleMode || p.role === this.roleMode)
        );
        if (foundStored) {
          this.anchorProfileId = foundStored.id;
        }
      }
    }

    if (!this.anchorProfileId) {
      if (this.roleMode === "HEALER") {
        const hProf = this.profiles.find((p) => p.profileType === "HEALER");
        this.anchorProfileId = hProf ? hProf.id : "prof-healer-01";
      } else if (this.roleMode === "TRAINEE") {
        const tProf = this.profiles.find((p) => p.profileType === "TRAINEE");
        this.anchorProfileId = tProf ? tProf.id : "prof-trainee-01";
      } else if (this.roleMode === "DEVOTEE") {
        const dProf = this.profiles.find((p) => p.profileType === "DEVOTEE");
        this.anchorProfileId = dProf ? dProf.id : "prof-devotee-01";
      } else {
        this.anchorProfileId = "prof-admin-01";
      }
    }

    this.activeProfileId =
      this.anchorProfileId ||
      localStorage.getItem(this.activeProfileIdKey) ||
      this.profiles[0]?.id ||
      "prof-admin-01";
    this.activeSadhanaDrawerId = null;

    // Migrate legacy localStorage keys on startup
    this.migrateLegacyKeys();
  }

  _getDefaultSettings() {
    return {
      defaultMentorName: "Spiritual Karim Khan (Founder)",
      defaultMentorCode: "SKHM-ADM1-7788-9900",
      telegramBotHandle: "SpiritualKarimBot",
      notebookLmPortalUrl: "https://notebooklm.google.com",
      threeDiyaEveningWindow: "06:15 PM – 07:00 PM",
      cleanMinApprovalPercent: 75,
      defaultTargetMalas: "11 Malas Daily",
      defaultJapaTargetCount: 108,
      defaultSadhanaStreak: "1 Day",
      githubApkUrl:
        "https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk",
      githubRepoUrl: "https://github.com/jDroid-X/SpritualKarim",
      webPortalUrl: "https://jdroid-x.github.io/SpritualKarim/",
      uplineApprovalTimeoutHours: 24,
      maxPendingInvitesPerMentor: 5,
      inviteExpiryHours: 24,
      maxInviteResubmits: 3,
      minDevoteeAge: 18,
      requirePhoneOTP: false,
      requireEmailOTP: false,
      requireCaptcha: false,
      requireKYC: false,
      requireSignature: false,
      requireTandC: true,
      defaultInductionRole: "DEVOTEE",
      allowDevoteeDelete: false,
      devoteeCanEditLineage: true,
      devoteeCanEnroll: true,
      healerStrictTeam: true,
      healerCanCertify: true,
      healerCanDeleteTeam: true,
      healerCanViewEntireTeam: true,
      enableLiveSync: true,
      firebaseUrl: "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/",
      firebaseProjectId: "spritualkarim-7b5fd",
      dataMinimizationEnabled: true,
      defaultRoleMode: "MASTER",
      autoSaveMode: "INSTANT",
      speechLang: "en-US",
    };
  }

  _loadSettings() {
    try {
      if (typeof localStorage !== "undefined") {
        const data = localStorage.getItem(this.settingsKey);
        if (data) {
          return { ...this._getDefaultSettings(), ...JSON.parse(data) };
        }
      }
    } catch (e) {
      console.warn("Error loading system settings", e);
    }
    return this._getDefaultSettings();
  }

  getProfileById(profileId) {
    const prof = this.profiles.find((p) => p.id === profileId) || null;
    if (prof && !prof.role && prof.profileType) {
      prof.role = prof.profileType;
    }
    return prof;
  }

  getActiveProfile() {
    return this.getProfileById(this.activeProfileId) || this.profiles[0] || null;
  }

  getAnchorProfile() {
    return this.getProfileById(this.anchorProfileId) || this.getActiveProfile();
  }

  calculateHierarchyMetrics() {
    const profiles = this.profiles || [];
    const invites = typeof this.getPairingInvites === "function" ? this.getPairingInvites() : [];
    const sadhanaApps = typeof this.getSadhanaRemedyApplications === "function" ? this.getSadhanaRemedyApplications() : [];

    if (typeof MetadataCountEngine !== "undefined" && typeof MetadataCountEngine.computeAll === "function") {
      const computed = MetadataCountEngine.computeAll(profiles, invites, sadhanaApps);
      return {
        totalProfiles: computed.totalProfiles,
        activeProfiles: computed.activeProfiles,
        tier1: computed.hierarchy.tier1,
        tier2: computed.hierarchy.tier2,
        tier3: computed.hierarchy.tier3,
        tier4: computed.hierarchy.tier4,
        masters: computed.hierarchy.tier1,
        healers: computed.hierarchy.tier2,
        trainees: computed.hierarchy.tier3,
        devotees: computed.hierarchy.tier4,
        pendingInvites: computed.pending,
        pendingSadhanaCount: computed.pending.sadhanaPending,
        healerHub: computed.healerHub
      };
    }

    const totalProfiles = profiles.length;
    const activeProfiles = profiles.filter(p => p.isActive !== false).length;

    const getStats = (type) => {
      const match = profiles.filter(p => (p.profileType || "").toUpperCase() === type.toUpperCase());
      const active = match.filter(p => p.isActive !== false).length;
      return {
        count: match.length,
        total: match.length,
        active: active,
        newJoined: match.filter(p => {
          if (!p.joinDate) return false;
          const join = new Date(p.joinDate);
          const now = new Date();
          return (now - join) / (1000 * 60 * 60 * 24) <= 90;
        }).length
      };
    };

    const tier1 = getStats("ADMIN");
    if (tier1.count === 0) {
      const mMatch = profiles.filter(p => (p.profileType || "").toUpperCase() === "MASTER");
      tier1.count = mMatch.length;
      tier1.total = mMatch.length;
      tier1.active = mMatch.filter(p => p.isActive !== false).length;
    }

    const tier2 = getStats("HEALER");
    const tier3 = getStats("TRAINEE");
    const tier4 = getStats("DEVOTEE");

    const pendingInvitesCount = invites.filter(i => (i.status || "").toLowerCase() === "pending").length;
    const pendingSadhanaCount = sadhanaApps.filter(a => (a.status || "").toUpperCase() === "PENDING").length;

    const sadhanaIdsInInvites = new Set(
      invites
        .filter(i => (i.status || "").toLowerCase() === "pending" && (i.type === "SADHANA_APPLICATION" || i.type === "REMEDY_APPLICATION"))
        .map(i => i.id)
    );
    const uniquePendingSadhana = sadhanaApps.filter(a => (a.status || "").toUpperCase() === "PENDING" && !sadhanaIdsInInvites.has(a.id)).length;
    const totalPending = pendingInvitesCount + uniquePendingSadhana;

    return {
      totalProfiles,
      activeProfiles,
      tier1,
      tier2,
      tier3,
      tier4,
      masters: tier1,
      healers: tier2,
      trainees: tier3,
      devotees: tier4,
      pendingInvites: {
        pending: totalPending,
        registrationPending: invites.filter(i => (i.status || "").toLowerCase() === "pending" && i.type !== "SADHANA_APPLICATION" && i.type !== "REMEDY_APPLICATION").length,
        sadhanaPending: pendingSadhanaCount,
        expired: 0,
        approved: invites.filter(i => (i.status || "").toLowerCase() === "approved").length + sadhanaApps.filter(a => (a.status || "").toUpperCase() === "APPROVED").length,
        rejected: 0,
        total: totalPending
      },
      pendingSadhanaCount: pendingSadhanaCount,
      healerHub: {
        total: totalProfiles,
        admin: tier1.total,
        healers: tier2.total,
        trainees: tier3.total,
        devotees: tier4.total
      }
    };
  }

  isCircularSponsor(profileId, proposedSponsorCode) {
    if (
      !proposedSponsorCode ||
      proposedSponsorCode === "ROOT" ||
      proposedSponsorCode === "ROOT-0000-0000-0000"
    )
      return false;
    const currentProfile = this.getProfileById(profileId);
    if (!currentProfile) return false;
    if (currentProfile.referenceCode === proposedSponsorCode) return true;

    const isDownline = (parentCode, targetCode, visited = new Set()) => {
      if (visited.has(parentCode)) return false;
      visited.add(parentCode);
      const children = this.profiles.filter(
        (p) => p.referredByCode === parentCode,
      );
      for (const child of children) {
        if (child.referenceCode === targetCode) return true;
        if (isDownline(child.referenceCode, targetCode, visited)) return true;
      }
      return false;
    };

    return isDownline(currentProfile.referenceCode, proposedSponsorCode);
  }

  formatRefCode(str) {
    if (!str) return "";
    const cleaned = str.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8)
      return cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    if (cleaned.length <= 12)
      return (
        cleaned.slice(0, 4) + "-" + cleaned.slice(4, 8) + "-" + cleaned.slice(8)
      );
    return (
      cleaned.slice(0, 4) +
      "-" +
      cleaned.slice(4, 8) +
      "-" +
      cleaned.slice(8, 12) +
      "-" +
      cleaned.slice(12, 16)
    );
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
      }
      if (typeof window !== "undefined") {
        window.appConfig = Object.assign(window.appConfig || {}, this.settings);

        // 1. Dual-Write REST API sync to Backend
        if (typeof fetch !== "undefined") {
          fetch("/api/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.settings)
          }).catch((err) => console.warn("Backend /api/config sync notice:", err.message));
        }

        // 2. Cloud RTDB node sync
        if (window.FirebaseSyncEngine && typeof window.FirebaseSyncEngine.pushNode === "function") {
          window.FirebaseSyncEngine.pushNode("system_config", this.settings);
        }

        // 3. Cross-Tab / Cross-Portal broadcast synchronization
        if (typeof BroadcastChannel !== "undefined") {
          try {
            const chan = new BroadcastChannel("spiritual_karim_sync");
            chan.postMessage({ type: "SETTINGS_UPDATED", settings: this.settings });
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error("Error saving settings to localStorage", e);
    }
    return this.settings;
  }

  getAuthMatrix() {
    if (typeof ScreenAuthMatrix !== "undefined" && ScreenAuthMatrix.getAuthMatrix) {
      return ScreenAuthMatrix.getAuthMatrix();
    }
    return {};
  }

  saveAuthMatrix(matrix) {
    if (typeof ScreenAuthMatrix !== "undefined" && ScreenAuthMatrix.saveAuthMatrix) {
      return ScreenAuthMatrix.saveAuthMatrix(matrix);
    }
    return false;
  }


  getDefaultSettings() {
    return this._getDefaultSettings();
  }

  getSetting(key, fallback = null) {
    if (this.settings && this.settings[key] !== undefined && this.settings[key] !== null) {
      return this.settings[key];
    }
    const defaults = this._getDefaultSettings();
    if (defaults && defaults[key] !== undefined) {
      return defaults[key];
    }
    return fallback;
  }

  getRoleMode() {
    return this.roleMode;
  }

  setRoleMode(mode) {
    this.roleMode = mode.toUpperCase();
    localStorage.setItem(this.roleModeKey, this.roleMode);
    this.clearInspectedProfile();

    if (this.roleMode === "DEVOTEE") {
      const devoteeProf = this.profiles.find((p) => p.profileType === "DEVOTEE");
      if (devoteeProf) this.setAnchorProfileId(devoteeProf.id);
    } else if (this.roleMode === "TRAINEE") {
      const traineeProf = this.profiles.find((p) => p.profileType === "TRAINEE" || p.level === 4);
      if (traineeProf) this.setAnchorProfileId(traineeProf.id);
    } else if (this.roleMode === "HEALER") {
      const healerProf = this.profiles.find((p) => p.profileType === "HEALER");
      if (healerProf) this.setAnchorProfileId(healerProf.id);
    } else if (this.roleMode === "MASTER" || this.roleMode === "ADMIN") {
      const adminProf = this.profiles.find((p) => p.profileType === "ADMIN" || p.id === "prof-admin-01");
      if (adminProf) this.setAnchorProfileId(adminProf.id);
    }
  }

  getDefaultAuthMatrix() {
    if (typeof ScreenAuthMatrix !== "undefined" && typeof ScreenAuthMatrix.getDefaultAuthMatrix === "function") {
      return ScreenAuthMatrix.getDefaultAuthMatrix();
    }
    return [];
  }


  getAllProfiles() {
    return this.profiles || [];
  }

  /**
   * Recursive downline tree traversal conforming to International MLM standards.
   * Returns Set of all reference codes belonging to the downline of rootCode.
   */
  getDownlineCodesForProfile(rootCode) {
    if (!rootCode) return new Set();
    const codes = new Set([rootCode]);
    let added = true;
    let iterations = 0;
    while (added && iterations < 50) {
      added = false;
      iterations++;
      (this.profiles || []).forEach(p => {
        const ref = p.referenceCode;
        const sponsor = p.referredByCode || p.sponsorCode;
        if (ref && sponsor && codes.has(sponsor) && !codes.has(ref)) {
          codes.add(ref);
          added = true;
        }
      });
    }
    return codes;
  }

  /**
   * International MLM Downline Scoping:
   * - Top (Master) sees every detail of all profiles.
   * - Healer sees only direct/indirect downline team members + self.
   * - Bottom (Trainee/Devotee) sees only their own details + direct sponsor,
   *   unless delegated extra roles (e.g. canReadDownline) in the Profile Role Matrix.
   */
  getScopedDownlineProfiles(activeProfile = null, roleMode = null) {
    const mode = (roleMode || this.roleMode || "DEVOTEE").toUpperCase();
    const currentActive = activeProfile || this.getActiveProfile();

    if (mode === "MASTER" || mode === "ADMIN") {
      return this.profiles || [];
    }

    if (!currentActive) {
      return (this.profiles || []).filter(p => p.profileType === "DEVOTEE");
    }

    const currentProfileId = currentActive.id;
    const delegated = this.getProfileRoleAssignment(currentProfileId);

    // Healer tier scoping
    if (mode === "HEALER") {
      const downlineCodes = this.getDownlineCodesForProfile(currentActive.referenceCode);
      return (this.profiles || []).filter(p => {
        if (p.id === currentProfileId) return true;
        if (p.profileType === "ADMIN") return false; // Admin hidden from Healer downline
        return downlineCodes.has(p.referenceCode) || p.referredByCode === currentActive.referenceCode;
      });
    }

    // Trainee & Devotee tier scoping
    if (mode === "TRAINEE" || mode === "DEVOTEE") {
      // If higher level has assigned extra role "canReadDownline", allow downline visibility
      if (delegated && (delegated.canReadDownline === true || delegated.canViewTeam === true)) {
        const downlineCodes = this.getDownlineCodesForProfile(currentActive.referenceCode);
        return (this.profiles || []).filter(p => {
          if (p.id === currentProfileId) return true;
          return downlineCodes.has(p.referenceCode);
        });
      }

      // Default International MLM rule: Bottom level sees ONLY self
      return (this.profiles || []).filter(p => p.id === currentProfileId);
    }

    return [currentActive];
  }

  getVisibleProfiles() {
    return this.getScopedDownlineProfiles(this.getActiveProfile(), this.roleMode);
  }

  // ============================================================
  // PROFILE ROLE MATRIX (Profile-Level Delegation Engine)
  // Higher level can assign Read, Edit, Update privileges to lower level
  // ============================================================

  getProfileRoleAssignments() {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(this.profileRoleMatrixKey);
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("[ProfileModel] Error loading profile role assignments", e);
    }
    return {};
  }

  getProfileRoleAssignment(profileId) {
    if (!profileId) return null;
    const all = this.getProfileRoleAssignments();
    return all[profileId] || null;
  }

  saveProfileRoleAssignment(targetProfileId, permissions, assignedByProfileId = "ADMIN") {
    if (!targetProfileId || !permissions) return false;
    try {
      const all = this.getProfileRoleAssignments();
      const existing = all[targetProfileId] || {};

      all[targetProfileId] = {
        ...existing,
        targetProfileId,
        permissions: {
          read: permissions.read !== false,
          edit: permissions.edit === true,
          update: permissions.update === true,
          canReadDownline: permissions.canReadDownline === true,
          canCertify: permissions.canCertify === true,
          canApproveIntake: permissions.canApproveIntake === true,
          canExportData: permissions.canExportData === true
        },
        read: permissions.read !== false,
        edit: permissions.edit === true,
        update: permissions.update === true,
        canReadDownline: permissions.canReadDownline === true,
        canCertify: permissions.canCertify === true,
        canApproveIntake: permissions.canApproveIntake === true,
        canExportData: permissions.canExportData === true,
        assignedBy: assignedByProfileId,
        updatedAt: new Date().toISOString()
      };

      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.profileRoleMatrixKey, JSON.stringify(all));
        localStorage.setItem("sk_last_write_ts", String(Date.now()));

        // Dual-write to Firebase Realtime Database
        if (typeof window !== "undefined" && window.FirebaseSyncEngine && typeof window.FirebaseSyncEngine.writeNode === "function") {
          window.FirebaseSyncEngine.writeNode("profile_role_matrix", all);
        }
        return true;
      }
    } catch (e) {
      console.error("[ProfileModel] saveProfileRoleAssignment error", e);
    }
    return false;
  }

  hasDelegatedPermission(profileId, permissionKey) {
    const record = this.getProfileRoleAssignment(profileId);
    if (!record) return false;
    return Boolean(record[permissionKey] || (record.permissions && record.permissions[permissionKey]));
  }

  _getDefaultProfiles() {
    return [
      // ==========================================
      // TIER 1: ADMIN MASTER (FOUNDER)
      // ==========================================
      {
        id: "prof-admin-01",
        referenceCode: "SKHM-ADM1-7788-9900",
        referredByCode: "ROOT-0000-0000-0000",
        transferredCode: "",
        name: "Spiritual Karim Khan",
        phone: "+91 98765 43210",
        email: "karim.master@spiritualkarim.org",
        profileType: "ADMIN",
        level: 1,
        isPaid: true,
        paymentStatus: "PAID",
        objective:
          "Spiritual illumination, Kundalini awakening, cosmic balance, and global guidance.",
        selectedRemedies: [
          "sri_yantra",
          "kalashtami",
          "navratri",
          "diwali",
          "three_diya",
          "negativity",
          "healing",
        ],
        address: "Spiritual Karim Central Sanctuary",
        city: "Mumbai, Maharashtra",
        joinDate: "2024-01-01",
        isActive: true,
        notes: "Master Head of Organization. Direct lineage origin. Supreme Spiritual Guide of the Sanctuary.",
        categoryTag: "Master Guide & Supreme Cleansing",
        seekerDiagnostics: {
          afflictionDuration: "N/A (Master Guide)",
          kuldeviIssues: "Kuldevi Blessings Activated",
          targetOutcome:
            "Universal sadhana transmission & supreme house purification",
        },
        interestedSadhanas: [
          {
            id: "sri_yantra",
            name: "Sri Yantra Sadhana",
            category: "Sacred Sadhana",
            priority: "High",
            status: "Enrolled",
          },
          {
            id: "kalashtami",
            name: "Kalashtami Bhairav Sadhana",
            category: "Sacred Sadhana",
            priority: "High",
            status: "Enrolled",
          },
          {
            id: "three_diya",
            name: "Three Diya Process",
            category: "Divine Remedy",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "APPROVED",
            cleanPercentage: 100,
            cleanedDetails: "Sanctum Sanctorum daily purification.",
            mentorCode: "SKHM-ADM1-7788-9900",
            mentorName: "Spiritual Karim Khan",
            mentorRemarks: "Direct master lineage purity verified 100%.",
            approvalDate: "Today ? Dawn",
          },
          {
            id: "hc-2",
            levelNumber: 2,
            levelTitle: "Level 2 — Parents House Clean",
            status: "APPROVED",
            cleanPercentage: 100,
            cleanedDetails:
              "Ancestral Haveli purified with traditional copper havan kund.",
            mentorCode: "SKHM-ADM1-7788-9900",
            mentorName: "Spiritual Karim Khan",
            mentorRemarks: "Ancestral peace established.",
            approvalDate: "Yesterday",
          },
          {
            id: "hc-3",
            levelNumber: 3,
            levelTitle: "Level 3 — Relative House Clean",
            status: "APPROVED",
            cleanPercentage: 100,
            cleanedDetails:
              "Extended family residences blessed and purified with 3-diya process.",
            mentorCode: "SKHM-ADM1-7788-9900",
            mentorName: "Spiritual Karim Khan",
            mentorRemarks: "Complete 3-level clan purification certified.",
            approvalDate: "2 days ago",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-1",
            sadhanaKey: "sri_yantra",
            title: "Sri Yantra Sadhana",
            categoryDomain: "sadhanas",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 4 — Master Attunement",
            dailyTarget: "21 Malas Daily + Havan",
            currentStreak: "108 Days Continuous",
            progressPercent: 100,
            status: "Master Siddhi",
            mentorCode: "SKHM-ADM1-7788-9900",
            diaryNotes:
              "Golden geometry visualization stabilized at Ajna Chakra.",
          },
          {
            id: "ts-2",
            sadhanaKey: "three_diya",
            title: "Three Diya Process",
            categoryDomain: "remedies",
            isPaid: false,
            paymentStatus: "FREE",
            level: "Level 3 — Havan & Energy Transmission",
            dailyTarget: "3 Diyas at Sunset",
            currentStreak: "21 Days Completed",
            progressPercent: 100,
            status: "Completed",
            mentorCode: "SKHM-ADM1-7788-9900",
            diaryNotes: "Heavy astral smoke clearing certified.",
          },
        ],
        healerCompletedSadhanas: [
          {
            id: "hcs-1",
            title: "Master Sri Yantra Siddhi",
            levelCompleted: "Level 4 — Master Guru",
            completionDate: "2023-11-15",
            status: "Certified Master & Guru",
            seekersGuidedCount: 1450,
            authorizedToGuide: true,
            sealCode: "SKHM-SEAL-MASTER-001",
          },
        ],
        healerNetwork: [
          {
            id: "net-1",
            name: "Acharya Devendra",
            refCode: "SKHM-HLR2-3344-5566",
            role: "Healer (Level 2)",
            activeCases: 12,
          },
          {
            id: "net-2",
            name: "Maa Anandita Devi",
            refCode: "SKHM-HLR2-5566-7788",
            role: "Healer (Level 2)",
            activeCases: 8,
          },
        ],
        lineage: {
          currentFamily: {
            selfName: "Spiritual Karim Khan",
            selfTitle: "Founder & Master Guide",
            spouseName: "Fatima Karim Khan",
            children: [
              {
                id: "c1",
                name: "Zaid Karim Khan",
                gender: "Son",
                ageOrNote: "Elder Son",
              },
              {
                id: "c2",
                name: "Ayesha Karim Khan",
                gender: "Daughter",
                ageOrNote: "Daughter",
              },
            ],
            siblings: [
              {
                id: "s1",
                name: "Tariq Karim Khan",
                relation: "Brother",
                spouseName: "Shabnam Khan",
                childrenSummary: "2 Sons",
                isMarried: true,
                notes: "Senior Ashram Coordinator",
              },
              {
                id: "s2",
                name: "Zubaida Begum",
                relation: "Sister",
                spouseName: "Rashid Ahmed",
                childrenSummary: "1 Son, 1 Daughter",
                isMarried: true,
                notes: "Lucknow Branch Trustee",
              },
            ],
          },
          husbandAncestral: {
            fatherName: "Late Master Father",
            motherName: "Late Divine Mother",
            paternalGrandfather: "Grandfather Senior",
            paternalGrandmother: "Grandmother Senior",
            maternalGrandfather: "Nana Ji Senior",
            maternalGrandmother: "Nani Ji Senior",
            siblings: [],
            address: "Ancestral Lineage Roots",
          },
          wifeAncestral: {
            fatherName: "Late Father-in-law",
            motherName: "Mother-in-law",
            paternalGrandfather: "Dada Ji",
            paternalGrandmother: "Dadi Ji",
            maternalGrandfather: "Nana Ji",
            maternalGrandmother: "Nani Ji",
            siblings: [],
            address: "Wife Ancestral Village",
          },
        },
      },

      // ==========================================
      // TIER 2: HEALER CONNECT (LEVEL COMPLETED)
      // ==========================================
      {
        id: "prof-healer-02",
        referenceCode: "SKHM-HLR2-3344-5566",
        referredByCode: "SKHM-ADM1-7788-9900",
        transferredCode: "",
        name: "Acharya Devendra",
        phone: "+91 98220 11223",
        email: "devendra.healer@spiritualkarim.org",
        profileType: "HEALER",
        level: 2,
        isPaid: true,
        paymentStatus: "PAID",
        objective:
          "Energy healing, aura purification, and house negativity cleansing.",
        selectedRemedies: [
          "three_diya",
          "negativity",
          "healing",
          "court_cases",
        ],
        address: "42 Sacred Grove Road",
        city: "Pune, Maharashtra",
        joinDate: "2024-06-15",
        isActive: true,
        notes: "Specialist in Three Diya remedies and Pitru Dosha diagnostics.",
        categoryTag: "Cleansing & Guidance",
        seekerDiagnostics: {
          afflictionDuration: "Overcome in 2021",
          kuldeviIssues: "Kuldevi Shanti Puja Performed",
          targetOutcome: "Guide 100+ families",
        },
        interestedSadhanas: [
          {
            id: "three_diya",
            name: "Three Diya Process",
            category: "Divine Remedy",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-4",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "APPROVED",
            cleanPercentage: 100,
            cleanedDetails:
              "Purified residence in Pune with sea-salt water, loban & camphor.",
            mentorCode: "SKHM-ADM1-7788-9900",
            mentorName: "Karim Ji (Founder)",
            mentorRemarks: "High vibrational field observed.",
            approvalDate: "2024-06-20",
          },
          {
            id: "hc-5",
            levelNumber: 2,
            levelTitle: "Level 2 — Parents House Clean",
            status: "APPROVED",
            cleanPercentage: 95,
            cleanedDetails: "Parents ancestral home cleaned.",
            mentorCode: "SKHM-ADM1-7788-9900",
            mentorName: "Karim Ji (Founder)",
            mentorRemarks: "Ancestral blessings restored.",
            approvalDate: "2024-07-02",
          },
          {
            id: "hc-6",
            levelNumber: 3,
            levelTitle: "Level 3 — Relative House Clean",
            status: "IN_PROGRESS",
            cleanPercentage: 65,
            cleanedDetails: "Cleansing maternal uncle residence.",
            mentorCode: "SKHM-ADM1-7788-9900",
            mentorName: "Karim Ji (Founder)",
            mentorRemarks: "Under supervision.",
            approvalDate: "Pending",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-3",
            sadhanaKey: "three_diya",
            title: "Three Diya Process",
            categoryDomain: "remedies",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 3 — Havan Transmission",
            dailyTarget: "3 Diyas at Dusk",
            currentStreak: "18 Days",
            progressPercent: 85,
            status: "In Progress",
            mentorCode: "SKHM-ADM1-7788-9900",
            diaryNotes: "Smoke clearance observed.",
          },
        ],
        healerCompletedSadhanas: [
          {
            id: "hcs-2",
            title: "Three Diya Master Certification",
            levelCompleted: "Level 3 — Healer Acharya",
            completionDate: "2024-05-10",
            status: "Certified Master",
            seekersGuidedCount: 340,
            authorizedToGuide: true,
            sealCode: "SKHM-SEAL-DIYA-301",
          },
        ],
        healerNetwork: [
          {
            id: "net-3",
            name: "Amitabh Sen",
            refCode: "SKHM-TRN3-1122-3344",
            role: "Trainee (Level 3)",
            activeCases: 6,
          },
          {
            id: "net-4",
            name: "Rajeshwari Joshi",
            refCode: "SKHM-TRN3-2233-4455",
            role: "Trainee (Level 3)",
            activeCases: 4,
          },
        ],
        lineage: {
          currentFamily: {
            selfName: "Acharya Devendra",
            selfTitle: "Senior Spiritual Healer",
            spouseName: "Sunita Sharma",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "Ramprasad Sharma",
            motherName: "Kaushalya Devi",
            paternalGrandfather: "Pt. Badri Prasad",
            paternalGrandmother: "Sita Devi",
            maternalGrandfather: "Govind Ram",
            maternalGrandmother: "Radha Devi",
            siblings: [],
            address: "Varanasi, UP",
          },
          wifeAncestral: {
            fatherName: "Mukesh Trivedi",
            motherName: "Shanti Trivedi",
            paternalGrandfather: "Hiralal Trivedi",
            paternalGrandmother: "Kamala Trivedi",
            maternalGrandfather: "Din Dayal",
            maternalGrandmother: "Uma Devi",
            siblings: [],
            address: "Nashik, Maharashtra",
          },
        },
      },
      {
        id: "prof-healer-03",
        referenceCode: "SKHM-HLR2-5566-7788",
        referredByCode: "SKHM-ADM1-7788-9900",
        transferredCode: "",
        name: "Maa Anandita Devi",
        phone: "+91 98330 44556",
        email: "anandita.healer@spiritualkarim.org",
        profileType: "HEALER",
        level: 2,
        isPaid: true,
        paymentStatus: "PAID",
        objective:
          "Maa Chamunda Navratri Sadhana, Kundalini awakening, and ancestral Pitru Dosha clearance.",
        selectedRemedies: [
          "navratri",
          "kundalini",
          "material_benefits",
          "aura_strengthening",
        ],
        address: "88 Ganga Ghat Sanctuary",
        city: "Varanasi, UP",
        joinDate: "2024-05-20",
        isActive: true,
        notes:
          "Specialist in Chamunda Shakti Anushthan and Kundalini energy flows.",
        categoryTag: "Kundalini & Aura Shield",
        seekerDiagnostics: {
          afflictionDuration: "Transmuted in 2020",
          kuldeviIssues: "Kuldevi Temple Established",
          targetOutcome: "Guide 50+ seekers to diksha",
        },
        interestedSadhanas: [
          {
            id: "navratri",
            name: "Navratri Chamunda Sadhana",
            category: "Sacred Sadhana",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-h3-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "APPROVED",
            cleanPercentage: 100,
            cleanedDetails: "Ganga water purification with daily Akhand Jyoti.",
            mentorCode: "SKHM-ADM1-7788-9900",
            mentorName: "Karim Ji (Founder)",
            mentorRemarks: "Divine grace awakened.",
            approvalDate: "2024-05-25",
          },
          {
            id: "hc-h3-2",
            levelNumber: 2,
            levelTitle: "Level 2 — Parents House Clean",
            status: "APPROVED",
            cleanPercentage: 100,
            cleanedDetails: "Varanasi ancestral sanctuary purified.",
            mentorCode: "SKHM-ADM1-7788-9900",
            mentorName: "Karim Ji (Founder)",
            mentorRemarks: "Ancestral blessings flowing.",
            approvalDate: "2024-06-10",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-h3-1",
            sadhanaKey: "navratri",
            title: "Navratri Chamunda Sadhana",
            categoryDomain: "sadhanas",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 4 — Master Attunement",
            dailyTarget: "108 Malas + Havan",
            currentStreak: "45 Days",
            progressPercent: 100,
            status: "Master Siddhi",
            mentorCode: "SKHM-ADM1-7788-9900",
            diaryNotes: "Navarna mantra Siddhi complete.",
          },
        ],
        healerCompletedSadhanas: [
          {
            id: "hcs-3",
            title: "Navarna Shakti Master Certification",
            levelCompleted: "Level 3 — Healer Acharya",
            completionDate: "2024-04-15",
            status: "Certified Master",
            seekersGuidedCount: 210,
            authorizedToGuide: true,
            sealCode: "SKHM-SEAL-SHAKTI-402",
          },
        ],
        healerNetwork: [
          {
            id: "net-5",
            name: "Rohan Verma",
            refCode: "SKHM-TRN3-6677-8899",
            role: "Trainee (Level 3)",
            activeCases: 5,
          },
          {
            id: "net-6",
            name: "Priya Sharma",
            refCode: "SKHM-TRN3-7788-9900",
            role: "Trainee (Level 3)",
            activeCases: 3,
          },
        ],
        lineage: {
          currentFamily: {
            selfName: "Maa Anandita Devi",
            selfTitle: "Acharya Yogini",
            spouseName: "",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
          wifeAncestral: {
            fatherName: "Pt. Vidyadhar Shastri",
            motherName: "Gayatri Devi",
            paternalGrandfather: "Pt. Ishwar Das",
            paternalGrandmother: "Saraswati Devi",
            maternalGrandfather: "Harishchandra",
            maternalGrandmother: "Gauri Devi",
            siblings: [],
            address: "Varanasi, UP",
          },
        },
      },

      // ==========================================
      // TIER 3: TRAINEE SADHAK (IN-PROGRESS)
      // ==========================================
      {
        id: "prof-trainee-04",
        referenceCode: "SKHM-TRN3-1122-3344",
        referredByCode: "SKHM-HLR2-3344-5566",
        transferredCode: "",
        name: "Amitabh Sen",
        phone: "+91 98450 77889",
        email: "amitabh.sen@trainee.org",
        profileType: "TRAINEE",
        level: 3,
        isPaid: true,
        paymentStatus: "PAID",
        objective: "Mastering 3 Diya fire cleansing and Sri Yantra geometry.",
        selectedRemedies: ["three_diya", "sri_yantra"],
        address: "12 Temple Street",
        city: "Kolkata, West Bengal",
        joinDate: "2024-07-10",
        isActive: true,
        notes: "Advanced trainee under Acharya Devendra.",
        categoryTag: "Trainee Sadhak",
        seekerDiagnostics: {
          afflictionDuration: "2 Years",
          kuldeviIssues: "Purification active",
          targetOutcome: "Advance to Level 3 Havan",
        },
        interestedSadhanas: [
          {
            id: "sri_yantra",
            name: "Sri Yantra Sadhana",
            category: "Sacred Sadhana",
            priority: "High",
            status: "Enrolled",
          },
          {
            id: "three_diya",
            name: "Three Diya Process",
            category: "Divine Remedy",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-t4-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "APPROVED",
            cleanPercentage: 100,
            cleanedDetails: "Doorway threshold purified daily.",
            mentorCode: "SKHM-HLR2-3344-5566",
            mentorName: "Acharya Devendra",
            mentorRemarks: "Purity certified.",
            approvalDate: "2024-07-18",
          },
          {
            id: "hc-t4-2",
            levelNumber: 2,
            levelTitle: "Level 2 — Parents House Clean",
            status: "IN_PROGRESS",
            cleanPercentage: 60,
            cleanedDetails: "Cleansing ancestral flat in Kolkata.",
            mentorCode: "SKHM-HLR2-3344-5566",
            mentorName: "Acharya Devendra",
            mentorRemarks: "In Progress.",
            approvalDate: "Pending",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-t4-2",
            sadhanaKey: "sri_yantra",
            title: "Sri Yantra Sadhana",
            categoryDomain: "sadhanas",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 3 — Diksha Sadhak",
            dailyTarget: "11 Malas & Trataka",
            currentStreak: "21 Days",
            progressPercent: 75,
            status: "In Progress",
            mentorCode: "SKHM-HLR2-3344-5566",
            mentorName: "Acharya Devendra",
            diaryNotes: "Meru Sri Yantra geometry consecrated; 11 malas japa active.",
            initiationToken: "SK-SY-7788",
            verificationStatus: "VERIFIED",
          },
          {
            id: "ts-t4-1",
            sadhanaKey: "three_diya",
            title: "Three Diya Process",
            categoryDomain: "remedies",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 2 — Mantra Diksha",
            dailyTarget: "3 Diyas at Dusk",
            currentStreak: "14 Days",
            progressPercent: 75,
            status: "In Progress",
            mentorCode: "SKHM-HLR2-3344-5566",
            mentorName: "Acharya Devendra",
            diaryNotes: "Threshold cleared.",
            initiationToken: "IN-SADH-INITIATED",
            verificationStatus: "VERIFIED",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Amitabh Sen",
            selfTitle: "Trainee Sadhak",
            spouseName: "Rupali Sen",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "Birendra Sen",
            motherName: "Suniti Sen",
            paternalGrandfather: "Kalyan Sen",
            paternalGrandmother: "Asha Sen",
            maternalGrandfather: "S. K. Roy",
            maternalGrandmother: "Manju Roy",
            siblings: [],
            address: "Kolkata, WB",
          },
          wifeAncestral: {
            fatherName: "Subhas Bose",
            motherName: "Ila Bose",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
        },
      },
      {
        id: "prof-trainee-05",
        referenceCode: "SKHM-TRN3-2233-4455",
        referredByCode: "SKHM-HLR2-3344-5566",
        transferredCode: "",
        name: "Rajeshwari Joshi",
        phone: "+91 98560 88990",
        email: "rajeshwari.j@trainee.org",
        profileType: "TRAINEE",
        level: 3,
        isPaid: true,
        paymentStatus: "PAID",
        objective: "Negativity fumigation and Pitru Rin Mukti fire rituals.",
        selectedRemedies: ["negativity", "karmic_debts"],
        address: "24 Navrangpura",
        city: "Ahmedabad, Gujarat",
        joinDate: "2024-07-22",
        isActive: true,
        notes: "Specializing in Bakhoor cleansing.",
        categoryTag: "Trainee Sadhak",
        seekerDiagnostics: {
          afflictionDuration: "1 Year",
          kuldeviIssues: "Blessings restored",
          targetOutcome: "Level 2 Sadhana completion",
        },
        interestedSadhanas: [
          {
            id: "karmic_debts",
            name: "Pitru Rin Mukti Sadhana",
            category: "Sacred Sadhana",
            priority: "High",
            status: "Enrolled",
          },
          {
            id: "negativity",
            name: "Negativity Cleansing",
            category: "Cleansing & Healing",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-t5-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "APPROVED",
            cleanPercentage: 90,
            cleanedDetails: "Full fumigation with pure Loban & Bakhoor.",
            mentorCode: "SKHM-HLR2-3344-5566",
            mentorName: "Acharya Devendra",
            mentorRemarks: "Good energetic shift.",
            approvalDate: "2024-08-01",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-t5-2",
            sadhanaKey: "karmic_debts",
            title: "Pitru Rin Mukti & Karmic Debt Sadhana",
            categoryDomain: "sadhanas",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 2 — Mantra Diksha",
            dailyTarget: "7 Malas Pitru Tarpana",
            currentStreak: "10 Days",
            progressPercent: 65,
            status: "In Progress",
            mentorCode: "SKHM-HLR2-3344-5566",
            mentorName: "Acharya Devendra",
            diaryNotes: "Pitru Rin Mukti fire rituals performed.",
            initiationToken: "SK-PRM-8899",
            verificationStatus: "VERIFIED",
          },
          {
            id: "ts-t5-1",
            sadhanaKey: "negativity",
            title: "Negativity Cleansing (Bakhoor)",
            categoryDomain: "cleansing",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 2 — Mantra Diksha",
            dailyTarget: "Dusk Fumigation",
            currentStreak: "12 Days",
            progressPercent: 70,
            status: "In Progress",
            mentorCode: "SKHM-HLR2-3344-5566",
            mentorName: "Acharya Devendra",
            diaryNotes: "Atmosphere purified.",
            initiationToken: "SK-NEG-1122",
            verificationStatus: "VERIFIED",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Rajeshwari Joshi",
            selfTitle: "Trainee Sadhak",
            spouseName: "Manish Joshi",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "Kirit Joshi",
            motherName: "Bhavana Joshi",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "Ahmedabad",
          },
          wifeAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
        },
      },
      {
        id: "prof-trainee-06",
        referenceCode: "SKHM-TRN3-6677-8899",
        referredByCode: "SKHM-HLR2-5566-7788",
        transferredCode: "",
        name: "Rohan Verma",
        phone: "+91 98670 99001",
        email: "rohan.verma@trainee.org",
        profileType: "TRAINEE",
        level: 3,
        isPaid: true,
        paymentStatus: "PAID",
        objective: "Kaal Bhairav protection and family aura fortification.",
        selectedRemedies: ["kalashtami", "nazar_suraksha"],
        address: "55 Gomti Nagar",
        city: "Lucknow, UP",
        joinDate: "2024-08-05",
        isActive: true,
        notes: "Trainee guided by Maa Anandita Devi.",
        categoryTag: "Trainee Sadhak",
        seekerDiagnostics: {
          afflictionDuration: "3 Years",
          kuldeviIssues: "Puja scheduled",
          targetOutcome: "Astral shield mastery",
        },
        interestedSadhanas: [
          {
            id: "kalashtami",
            name: "Kalashtami Bhairav Sadhana",
            category: "Sacred Sadhana",
            priority: "High",
            status: "Enrolled",
          },
          {
            id: "nazar_suraksha",
            name: "Nazar Suraksha & Aura Shield",
            category: "Divine Remedy",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-t6-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "APPROVED",
            cleanPercentage: 85,
            cleanedDetails: "4-wick mustard lamp protection established.",
            mentorCode: "SKHM-HLR2-5566-7788",
            mentorName: "Maa Anandita Devi",
            mentorRemarks: "Protection seal active.",
            approvalDate: "2024-08-10",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-t6-1",
            sadhanaKey: "kalashtami",
            title: "Kalashtami Bhairav Sadhana",
            categoryDomain: "sadhanas",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 2 — Mantra Diksha",
            dailyTarget: "11 Malas Night Sandhya",
            currentStreak: "9 Days",
            progressPercent: 60,
            status: "In Progress",
            mentorCode: "SKHM-HLR2-5566-7788",
            mentorName: "Maa Anandita Devi",
            diaryNotes: "Fear banished.",
            initiationToken: "SK-BHR-6677",
            verificationStatus: "VERIFIED",
          },
          {
            id: "ts-t6-2",
            sadhanaKey: "nazar_suraksha",
            title: "Nazar Suraksha & Aura Shield",
            categoryDomain: "remedies",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 1 — Initiation",
            dailyTarget: "Dusk Mustard Oil Lamp",
            currentStreak: "9 Days",
            progressPercent: 60,
            status: "In Progress",
            mentorCode: "SKHM-HLR2-5566-7788",
            mentorName: "Maa Anandita Devi",
            diaryNotes: "Protection seal active.",
            initiationToken: "SK-NZR-9900",
            verificationStatus: "VERIFIED",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Rohan Verma",
            selfTitle: "Trainee Sadhak",
            spouseName: "",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "Dr. S. K. Verma",
            motherName: "Rekha Verma",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "Lucknow",
          },
          wifeAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
        },
      },
      {
        id: "prof-trainee-07",
        referenceCode: "SKHM-TRN3-7788-9900",
        referredByCode: "SKHM-HLR2-5566-7788",
        transferredCode: "",
        name: "Priya Sharma",
        phone: "+91 98780 11223",
        email: "priya.sharma@trainee.org",
        profileType: "TRAINEE",
        level: 3,
        isPaid: false,
        paymentStatus: "FREE",
        objective: "Aura strengthening and business obstacle removal.",
        selectedRemedies: ["aura_strengthening", "business_money"],
        address: "19 Vasant Vihar",
        city: "New Delhi",
        joinDate: "2024-08-12",
        isActive: true,
        notes: "Dedicated sadhak in crystal and Gayatri practices.",
        categoryTag: "Trainee Sadhak",
        seekerDiagnostics: {
          afflictionDuration: "6 Months",
          kuldeviIssues: "None",
          targetOutcome: "Aura energy stabilization",
        },
        interestedSadhanas: [
          {
            id: "business_money",
            name: "Lakshmi Kuber Dhan Varsha Sadhana",
            category: "Sacred Sadhana",
            priority: "High",
            status: "Enrolled",
          },
          {
            id: "aura_strengthening",
            name: "Aura Strengthening",
            category: "Cleansing & Healing",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-t7-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "APPROVED",
            cleanPercentage: 80,
            cleanedDetails: "Sphatik crystal water harmonization.",
            mentorCode: "SKHM-HLR2-5566-7788",
            mentorName: "Maa Anandita Devi",
            mentorRemarks: "Good progress.",
            approvalDate: "2024-08-16",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-t7-2",
            sadhanaKey: "business_money",
            title: "Lakshmi Kuber Dhan Varsha Sadhana",
            categoryDomain: "sadhanas",
            isPaid: false,
            paymentStatus: "FREE",
            level: "Level 1 — Initiation",
            dailyTarget: "11 Malas Gayatri / Kuber Mantra",
            currentStreak: "5 Days",
            progressPercent: 45,
            status: "In Progress",
            mentorCode: "SKHM-HLR2-5566-7788",
            mentorName: "Maa Anandita Devi",
            diaryNotes: "Aura stabilization and financial obstacle removal.",
            initiationToken: "SK-LKD-3344",
            verificationStatus: "VERIFIED",
          },
          {
            id: "ts-t7-1",
            sadhanaKey: "aura_strengthening",
            title: "Aura Strengthening & Psychic Shield",
            categoryDomain: "cleansing",
            isPaid: false,
            paymentStatus: "FREE",
            level: "Level 1 — Initiation",
            dailyTarget: "24 Gayatri Chants",
            currentStreak: "6 Days",
            progressPercent: 50,
            status: "In Progress",
            mentorCode: "SKHM-HLR2-5566-7788",
            diaryNotes: "Calm mind felt.",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Priya Sharma",
            selfTitle: "Trainee Sadhak",
            spouseName: "",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
          wifeAncestral: {
            fatherName: "V. K. Sharma",
            motherName: "Saroj Sharma",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "Delhi",
          },
        },
      },

      // ==========================================
      // TIER 4: DEVOTEE / SEEKER (PERSONAL & HOUSE CLEAN)
      // ==========================================
      {
        id: "prof-devotee-08",
        referenceCode: "SKHM-DEV4-9988-1122",
        referredByCode: "SKHM-TRN3-1122-3344",
        transferredCode: "",
        name: "Sunita Mehra",
        phone: "+91 97110 55443",
        email: "sunita.mehra@devotee.org",
        profileType: "DEVOTEE",
        level: 4,
        isPaid: false,
        paymentStatus: "FREE",
        objective:
          "Overcoming household stress, learning 3 Diya process, and purifying ancestral karma.",
        selectedRemedies: ["three_diya", "negativity"],
        address: "108 Shanti Niketan",
        city: "Jaipur, Rajasthan",
        joinDate: "2024-08-01",
        isActive: true,
        notes: "Dedicated devotee initiated into Level 1 House Clean.",
        categoryTag: "Devotee Seeker",
        seekerDiagnostics: {
          afflictionDuration: "3 Years",
          kuldeviIssues: "Kuldevi Puja pending",
          targetOutcome: "Peace of mind and family health",
        },
        interestedSadhanas: [
          {
            id: "three_diya",
            name: "Three Diya Process",
            category: "Divine Remedy",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-d8-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "IN_PROGRESS",
            cleanPercentage: 50,
            cleanedDetails: "Purifying main doorway and altar daily.",
            mentorCode: "SKHM-TRN3-1122-3344",
            mentorName: "Amitabh Sen",
            mentorRemarks: "Good progress.",
            approvalDate: "Pending",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-d8-1",
            sadhanaKey: "three_diya",
            title: "Three Diya Process",
            categoryDomain: "remedies",
            isPaid: false,
            paymentStatus: "FREE",
            level: "Level 1 — Initiation",
            dailyTarget: "3 Diyas at Dusk",
            currentStreak: "7 Days",
            progressPercent: 35,
            status: "In Progress",
            mentorCode: "SKHM-TRN3-1122-3344",
            diaryNotes: "Noticed positive shift in home.",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Sunita Mehra",
            selfTitle: "Devotee Seeker",
            spouseName: "Ramesh Mehra",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "Om Prakash Mehra",
            motherName: "Kanti Mehra",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "Jaipur, Rajasthan",
          },
          wifeAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
        },
      },
      {
        id: "prof-devotee-09",
        referenceCode: "SKHM-DEV4-3322-1100",
        referredByCode: "SKHM-TRN3-1122-3344",
        transferredCode: "",
        name: "Deepak Saxena",
        phone: "+91 97220 66554",
        email: "deepak.saxena@devotee.org",
        profileType: "DEVOTEE",
        level: 4,
        isPaid: true,
        paymentStatus: "PAID",
        objective:
          "Business growth, stuck payments recovery, and Sri Yantra worship.",
        selectedRemedies: ["business_money", "sri_yantra"],
        address: "77 Arera Colony",
        city: "Bhopal, MP",
        joinDate: "2024-08-15",
        isActive: true,
        notes: "Devotee seeking financial stability and Lakshmi blessings.",
        categoryTag: "Devotee Seeker",
        seekerDiagnostics: {
          afflictionDuration: "1.5 Years",
          kuldeviIssues: "Kuldevi Puja Done",
          targetOutcome: "Clear business debt",
        },
        interestedSadhanas: [
          {
            id: "business_money",
            name: "Business & Wealth Upaya",
            category: "Divine Remedy",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-d9-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "IN_PROGRESS",
            cleanPercentage: 40,
            cleanedDetails: "Clearing commercial shop cash altar.",
            mentorCode: "SKHM-TRN3-1122-3344",
            mentorName: "Amitabh Sen",
            mentorRemarks: "Under guidance.",
            approvalDate: "Pending",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-d9-1",
            sadhanaKey: "business_money",
            title: "Business & Wealth Upaya",
            categoryDomain: "remedies",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 1 — Initiation",
            dailyTarget: "Friday Silver Diya",
            currentStreak: "4 Days",
            progressPercent: 30,
            status: "In Progress",
            mentorCode: "SKHM-TRN3-1122-3344",
            diaryNotes: "Payments started unlocking.",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Deepak Saxena",
            selfTitle: "Devotee Seeker",
            spouseName: "Neelam Saxena",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "J. P. Saxena",
            motherName: "Maya Saxena",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "Bhopal",
          },
          wifeAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
        },
      },
      {
        id: "prof-devotee-10",
        referenceCode: "SKHM-DEV4-4433-2211",
        referredByCode: "SKHM-TRN3-2233-4455",
        transferredCode: "",
        name: "Aarohi Patel",
        phone: "+91 97330 77665",
        email: "aarohi.patel@devotee.org",
        profileType: "DEVOTEE",
        level: 4,
        isPaid: false,
        paymentStatus: "FREE",
        objective: "House Clean Level 1 and family peace.",
        selectedRemedies: ["three_diya", "healing"],
        address: "33 Ring Road",
        city: "Surat, Gujarat",
        joinDate: "2024-08-20",
        isActive: true,
        notes: "Devotee practicing daily sunset 3-diya purification.",
        categoryTag: "Devotee Seeker",
        seekerDiagnostics: {
          afflictionDuration: "8 Months",
          kuldeviIssues: "Pending",
          targetOutcome: "Calm household environment",
        },
        interestedSadhanas: [
          {
            id: "three_diya",
            name: "Three Diya Process",
            category: "Divine Remedy",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-d10-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "IN_PROGRESS",
            cleanPercentage: 30,
            cleanedDetails: "Purifying main entryway with sea salt.",
            mentorCode: "SKHM-TRN3-2233-4455",
            mentorName: "Rajeshwari Joshi",
            mentorRemarks: "Under review.",
            approvalDate: "Pending",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-d10-1",
            sadhanaKey: "three_diya",
            title: "Three Diya Process",
            categoryDomain: "remedies",
            isPaid: false,
            paymentStatus: "FREE",
            level: "Level 1 — Initiation",
            dailyTarget: "3 Diyas at Sunset",
            currentStreak: "5 Days",
            progressPercent: 25,
            status: "In Progress",
            mentorCode: "SKHM-TRN3-2233-4455",
            diaryNotes: "Peace observed.",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Aarohi Patel",
            selfTitle: "Devotee Seeker",
            spouseName: "",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
          wifeAncestral: {
            fatherName: "Nitin Patel",
            motherName: "Geeta Patel",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "Surat",
          },
        },
      },
      {
        id: "prof-devotee-11",
        referenceCode: "SKHM-DEV4-5544-3322",
        referredByCode: "SKHM-TRN3-6677-8899",
        transferredCode: "",
        name: "Meera Nair",
        phone: "+91 97440 88776",
        email: "meera.nair@devotee.org",
        profileType: "DEVOTEE",
        level: 4,
        isPaid: true,
        paymentStatus: "PAID",
        objective:
          "Spiritual protection, evil eye shielding, and aura fortification.",
        selectedRemedies: ["nazar_suraksha", "aura_strengthening"],
        address: "5 Marine Drive",
        city: "Kochi, Kerala",
        joinDate: "2024-08-22",
        isActive: true,
        notes: "Devotee practicing daily Nazar Suraksha rituals.",
        categoryTag: "Devotee Seeker",
        seekerDiagnostics: {
          afflictionDuration: "2 Years",
          kuldeviIssues: "Done",
          targetOutcome: "Dissolve physical exhaustion",
        },
        interestedSadhanas: [
          {
            id: "nazar_suraksha",
            name: "Nazar Suraksha & Evil Eye Shield",
            category: "Cleansing & Healing",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-d11-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "IN_PROGRESS",
            cleanPercentage: 45,
            cleanedDetails: "Rai and salt cleansing twice weekly.",
            mentorCode: "SKHM-TRN3-6677-8899",
            mentorName: "Rohan Verma",
            mentorRemarks: "Good energetic clearance.",
            approvalDate: "Pending",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-d11-1",
            sadhanaKey: "nazar_suraksha",
            title: "Nazar Suraksha & Evil Eye Shield",
            categoryDomain: "cleansing",
            isPaid: true,
            paymentStatus: "PAID",
            level: "Level 1 — Initiation",
            dailyTarget: "Tuesday & Saturday Godhuli Bela",
            currentStreak: "6 Days",
            progressPercent: 40,
            status: "In Progress",
            mentorCode: "SKHM-TRN3-6677-8899",
            diaryNotes: "Headaches relieved.",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Meera Nair",
            selfTitle: "Devotee Seeker",
            spouseName: "Ajay Nair",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "Madhavan Nair",
            motherName: "Lalitha Nair",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "Kochi",
          },
          wifeAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
        },
      },
      {
        id: "prof-devotee-12",
        referenceCode: "SKHM-DEV4-6655-4433",
        referredByCode: "SKHM-TRN3-7788-9900",
        transferredCode: "",
        name: "Suresh Rao",
        phone: "+91 97550 99887",
        email: "suresh.rao@devotee.org",
        profileType: "DEVOTEE",
        level: 4,
        isPaid: false,
        paymentStatus: "FREE",
        objective: "Ancestral Rin Mukti and positive vibration in home.",
        selectedRemedies: ["karmic_debts", "three_diya"],
        address: "101 Indiranagar",
        city: "Bengaluru, Karnataka",
        joinDate: "2024-08-25",
        isActive: true,
        notes: "Devotee initiated by Priya Sharma.",
        categoryTag: "Devotee Seeker",
        seekerDiagnostics: {
          afflictionDuration: "1 Year",
          kuldeviIssues: "Under consultation",
          targetOutcome: "Debt settlement and harmony",
        },
        interestedSadhanas: [
          {
            id: "karmic_debts",
            name: "Karmic Debts Fire Cleansing",
            category: "Divine Remedy",
            priority: "High",
            status: "Enrolled",
          },
        ],
        houseCleanLevels: [
          {
            id: "hc-d12-1",
            levelNumber: 1,
            levelTitle: "Level 1 — Self House Clean",
            status: "IN_PROGRESS",
            cleanPercentage: 20,
            cleanedDetails: "Commencing Rin Mukteshwar havan.",
            mentorCode: "SKHM-TRN3-7788-9900",
            mentorName: "Priya Sharma",
            mentorRemarks: "First cycle active.",
            approvalDate: "Pending",
          },
        ],
        traineeSadhanas: [
          {
            id: "ts-d12-1",
            sadhanaKey: "karmic_debts",
            title: "Karmic Debts Fire Cleansing",
            categoryDomain: "remedies",
            isPaid: false,
            paymentStatus: "FREE",
            level: "Level 1 — Initiation",
            dailyTarget: "Tuesday Havan",
            currentStreak: "2 Days",
            progressPercent: 20,
            status: "In Progress",
            mentorCode: "SKHM-TRN3-7788-9900",
            diaryNotes: "Red lentils offering done.",
          },
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: {
            selfName: "Suresh Rao",
            selfTitle: "Devotee Seeker",
            spouseName: "Shalini Rao",
            children: [],
            siblings: [],
          },
          husbandAncestral: {
            fatherName: "Venkatesh Rao",
            motherName: "Padma Rao",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "Bengaluru",
          },
          wifeAncestral: {
            fatherName: "",
            motherName: "",
            paternalGrandfather: "",
            paternalGrandmother: "",
            maternalGrandfather: "",
            maternalGrandmother: "",
            siblings: [],
            address: "",
          },
        },
      },
    ];
  }

  _loadProfiles() {
    try {
      if (typeof localStorage !== "undefined") {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
          let parsed = JSON.parse(data);
          if (
            Array.isArray(parsed) &&
            parsed.length >= 8 &&
            parsed.some(
              (p) =>
                p.profileType === "TRAINEE" || p.level === 3 || p.level === 4,
            )
          ) {
            // Deduplicate by profile id and referenceCode
            const seenIds = new Set();
            const seenCodes = new Set();
            const unique = [];
            for (const p of parsed) {
              const pid = p.id || p.referenceCode;
              const ref = p.referenceCode;
              if (pid && !seenIds.has(pid) && (!ref || !seenCodes.has(ref))) {
                seenIds.add(pid);
                if (ref) seenCodes.add(ref);
                unique.push(p);
              }
            }
            parsed = unique;

            // Sanitize traineeSadhanas against circular references / object values
            parsed.forEach(p => {
              if (p && Array.isArray(p.traineeSadhanas)) {
                p.traineeSadhanas.forEach(s => {
                  if (s.verifiedBy && typeof s.verifiedBy === 'object') s.verifiedBy = s.verifiedBy.name || "Mentor";
                  if (s.mentorName && typeof s.mentorName === 'object') s.mentorName = s.mentorName.name || "Mentor";
                  if (s.rejectedBy && typeof s.rejectedBy === 'object') s.rejectedBy = s.rejectedBy.name || "Mentor";
                  if (Array.isArray(s.memos)) {
                    s.memos.forEach(m => {
                      if (m && m.author && typeof m.author === 'object') m.author = m.author.name || "Mentor";
                    });
                  }
                });
              }
            });

            // Purge legacy seeker profiles if present (Seeker Portal no more required)
            parsed = parsed.filter(p => {
              const role = (p.profileType || p.role || "").toUpperCase();
              return role !== "SEEKER" && !p.id.includes("seeker");
            });

            // Re-align to defaults if corrupted or inflated beyond canonical 12 nodes
            const defaults = this._getDefaultProfiles();
            if (parsed.length !== defaults.length || parsed.length > 12) {
              parsed = defaults;
            }

            // Automatic migration: restore original Spiritual Karim Khan profile name
            const rootP = parsed.find((p) => p.id === "prof-admin-01");
            if (rootP && rootP.name !== "Spiritual Karim Khan") {
              rootP.name = "Spiritual Karim Khan";
              if (rootP.lineage && rootP.lineage.currentFamily) {
                rootP.lineage.currentFamily.selfName = "Spiritual Karim Khan";
                rootP.lineage.currentFamily.spouseName = "Fatima Karim Khan";
              }
            }

            // Auto-heal trainee profiles: ensure Sacred Sadhanas and Remedies exist in traineeSadhanas
            const catalog = this._getDefaultSadhanaCatalog();
            parsed.forEach((p) => {
              if (p.profileType === "TRAINEE" || p.categoryTag === "Trainee Sadhak") {
                if (!Array.isArray(p.traineeSadhanas)) p.traineeSadhanas = [];
                const defMatch = defaults.find((d) => d.id === p.id);
                if (defMatch && Array.isArray(defMatch.traineeSadhanas)) {
                  defMatch.traineeSadhanas.forEach((defTs) => {
                    const exists = p.traineeSadhanas.some(
                      (ts) => ts.sadhanaKey === defTs.sadhanaKey || ts.id === defTs.id || ts.title === defTs.title
                    );
                    if (!exists) {
                      p.traineeSadhanas.unshift(JSON.parse(JSON.stringify(defTs)));
                    }
                  });
                }
                if (defMatch && Array.isArray(defMatch.interestedSadhanas)) {
                  if (!Array.isArray(p.interestedSadhanas) || p.interestedSadhanas.length < defMatch.interestedSadhanas.length) {
                    p.interestedSadhanas = JSON.parse(JSON.stringify(defMatch.interestedSadhanas));
                  }
                }
                if (Array.isArray(p.selectedRemedies)) {
                  p.selectedRemedies.forEach((key) => {
                    const hasPractice = p.traineeSadhanas.some(
                      (ts) => ts.sadhanaKey === key || ts.id === key || (ts.title && ts.title.toLowerCase().includes(key.replace(/_/g, " ")))
                    );
                    if (!hasPractice) {
                      const catItem = catalog[key] || {};
                      const isSadhana = catItem.domain === "sadhanas" || (catItem.category || "").toLowerCase().includes("sadhana") || key.includes("yantra") || key.includes("bhairav") || key.includes("debts");
                      p.traineeSadhanas.unshift({
                        id: `ts-${p.id.slice(-2)}-${key}`,
                        sadhanaKey: key,
                        title: catItem.title || key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                        categoryDomain: isSadhana ? "sadhanas" : "remedies",
                        isPaid: p.isPaid !== false,
                        paymentStatus: p.paymentStatus || "PAID",
                        level: `Level ${p.level || 2} — Mantra Diksha`,
                        dailyTarget: isSadhana ? "11 Malas & Trataka" : "3 Diyas at Dusk",
                        currentStreak: "14 Days",
                        progressPercent: p.progressPercent || 75,
                        status: "In Progress",
                        mentorCode: p.referredByCode || "SKHM-HLR2-3344-5566",
                        mentorName: p.referredByName || "Acharya Devendra",
                        diaryNotes: `${catItem.title || key} active practice.`,
                        initiationToken: `SK-${key.toUpperCase().slice(0, 4)}-7788`,
                        verificationStatus: "VERIFIED"
                      });
                    }
                  });
                }
              }
            });
            this.saveProfiles(parsed);
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn("Error loading profiles from localStorage", e);
    }
    const defaults = this._getDefaultProfiles();
    this.saveProfiles(defaults);
    return defaults;
  }

  saveProfiles(profiles) {
    this.profiles = profiles;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.storageKey, JSON.stringify(this.profiles));
      }
    } catch (e) {
      console.error("Error saving profiles to localStorage", e);
    }
  }

  getActiveProfile() {
    if (this.inspectedProfileId) {
      const inspected = this.profiles.find((p) => p.id === this.inspectedProfileId);
      if (inspected) return inspected;
    }
    return this.getAnchorProfile();
  }

  getAnchorProfile() {
    if (this.anchorProfileId) {
      const p = this.profiles.find((x) => x.id === this.anchorProfileId);
      if (p) return p;
    }
    // Check if session has a specific logged-in user profile
    try {
      if (typeof sessionStorage !== "undefined") {
        const raw = sessionStorage.getItem("sk_auth_sessions");
        if (raw) {
          const session = JSON.parse(raw);
          if (session && session.profileId) {
            const matched = this.profiles.find((x) => x.id === session.profileId);
            if (matched) return matched;
          }
        }
      }
    } catch (e) {}
    if (this.roleMode === "HEALER") {
      return this.profiles.find((p) => p.profileType === "HEALER") || this.profiles[0];
    }
    if (this.roleMode === "TRAINEE") {
      return this.profiles.find((p) => p.profileType === "TRAINEE") || this.profiles[0];
    }
    if (this.roleMode === "DEVOTEE") {
      return this.profiles.find((p) => p.profileType === "DEVOTEE") || this.profiles[0];
    }
    return (
      this.profiles.find((p) => p.id === "root-master-admin" || p.id === "prof-admin-01" || p.profileType === "ADMIN" || p.profileType === "MASTER") ||
      this.profiles[0]
    );
  }

  getInspectedProfile() {
    if (this.inspectedProfileId) {
      return this.profiles.find((p) => p.id === this.inspectedProfileId) || null;
    }
    return null;
  }

  setInspectedProfileId(id) {
    this.inspectedProfileId = id;
    this.activeProfileId = id;
  }

  getApplicableRolesForProfile(profile) {
    return [
      { role: "MASTER", label: "👑 Admin Master" },
      { role: "HEALER", label: "🛡️ Certified Healer" },
      { role: "TRAINEE", label: "📿 Trainee Sadhak" },
      { role: "DEVOTEE", label: "🌟 Devotee" }
    ];
  }

  getRoleMode() {
    return this.roleMode || "MASTER";
  }

  setRoleMode(role) {
    let r = (role || "MASTER").toUpperCase();
    if (r === "SEEKER") r = "DEVOTEE";
    if (r === "ADMIN") r = "MASTER";
    this.roleMode = r;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.roleModeKey || "sk_admin_active_role_mode_v1", r);
      }
    } catch(e) {}
    return this.roleMode;
  }

  getComponentStates() {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem("sk_component_states_v1");
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {}
    return this._componentStates || {};
  }

  saveComponentState(keyOrObj, val) {
    if (!this._componentStates) this._componentStates = {};
    const states = Object.assign({}, this.getComponentStates(), this._componentStates);
    if (typeof keyOrObj === "string") {
      states[keyOrObj] = val;
    } else if (typeof keyOrObj === "object" && keyOrObj !== null) {
      Object.assign(states, keyOrObj);
    }
    this._componentStates = states;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("sk_component_states_v1", JSON.stringify(states));
      }
    } catch (e) {}
    return states;
  }

  clearInspectedProfile() {
    this.inspectedProfileId = null;
    this.activeProfileId = this.anchorProfileId || this.profiles[0]?.id;
  }

  setAnchorProfileId(id) {
    this.anchorProfileId = id;
    this.activeProfileId = id;
    localStorage.setItem(this.activeProfileIdKey, id);
  }

  setActiveProfileId(id) {
    this.setInspectedProfileId(id);
    this.activeProfileId = id;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(this.activeProfileIdKey, id);
      localStorage.setItem("sk_active_profile_id", id);
    }
  }

  updateActiveProfile(updatedData) {
    const idx = this.profiles.findIndex((p) => p.id === this.activeProfileId);
    if (idx > -1) {
      this.profiles[idx] = { ...this.profiles[idx], ...updatedData };
      this.saveProfiles(this.profiles);
      return this.profiles[idx];
    }
    return null;
  }

  createNewProfile() {
    const newId = "prof-" + Date.now();
    const newRefCode = this.generate16DigitCode("SKHM");
    const newProfile = {
      id: newId,
      referenceCode: newRefCode,
      referredByCode: "ROOT-0000-0000-0000",
      transferredCode: "",
      name: "New Devotee Seeker",
      phone: "+91 ",
      email: "",
      profileType: this.roleMode === "HEALER" ? "HEALER" : "DEVOTEE",
      level: this.roleMode === "HEALER" ? 2 : 5,
      isPaid: false,
      paymentStatus: "FREE",
      objective: "Spiritual purification, House Clean, and Sadhana initiation.",
      selectedRemedies: ["three_diya", "negativity"],
      address: "",
      city: "",
      joinDate: new Date().toISOString().split("T")[0],
      isActive: true,
      notes: "",
      categoryTag: "House Clean & Seekers",
      seekerDiagnostics: {
        afflictionDuration: "",
        kuldeviIssues: "",
        targetOutcome: "",
      },
      interestedSadhanas: [
        {
          id: "three_diya",
          name: "Three Diya Process",
          category: "Divine Remedy",
          priority: "High",
          status: "Interested",
        },
      ],
      houseCleanLevels: [
        {
          id: "hc-n1",
          levelNumber: 1,
          levelTitle: "Level 1 — Self House Clean",
          status: "NOT_STARTED",
          cleanPercentage: 0,
          cleanedDetails: "",
          mentorCode: null,
          mentorName: null,
          mentorRemarks: null,
          approvalDate: null,
        },
        {
          id: "hc-n2",
          levelNumber: 2,
          levelTitle: "Level 2 — Parents House Clean",
          status: "NOT_STARTED",
          cleanPercentage: 0,
          cleanedDetails: "",
          mentorCode: null,
          mentorName: null,
          mentorRemarks: null,
          approvalDate: null,
        },
        {
          id: "hc-n3",
          levelNumber: 3,
          levelTitle: "Level 3 — Relative House Clean",
          status: "NOT_STARTED",
          cleanPercentage: 0,
          cleanedDetails: "",
          mentorCode: null,
          mentorName: null,
          mentorRemarks: null,
          approvalDate: null,
        },
      ],
      traineeSadhanas: [],
      healerCompletedSadhanas: [],
      healerNetwork: [],
      lineage: {
        currentFamily: {
          selfName: "New Devotee Seeker",
          selfTitle: "Devotee Seeker",
          spouseName: "",
          children: [],
          siblings: [],
        },
        husbandAncestral: {
          fatherName: "",
          motherName: "",
          paternalGrandfather: "",
          paternalGrandmother: "",
          maternalGrandfather: "",
          maternalGrandmother: "",
          siblings: [],
          address: "",
        },
        wifeAncestral: {
          fatherName: "",
          motherName: "",
          paternalGrandfather: "",
          paternalGrandmother: "",
          maternalGrandfather: "",
          maternalGrandmother: "",
          siblings: [],
          address: "",
        },
      },
    };

    this.profiles.push(newProfile);
    this.saveProfiles(this.profiles);
    this.setActiveProfileId(newId);
    return newProfile;
  }

  deleteActiveProfile() {
    if (this.profiles.length <= 1) {
      alert("Cannot delete the only remaining profile.");
      return false;
    }
    this.profiles = this.profiles.filter((p) => p.id !== this.activeProfileId);
    this.activeProfileId = this.profiles[0].id;
    this.saveProfiles(this.profiles);
    return true;
  }

  generate16DigitCode(prefix = "SKHM") {
    const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    const segment = (len) => {
      let res = "";
      for (let i = 0; i < len; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return res;
    };
    return `${prefix}-${segment(4)}-${segment(4)}-${segment(4)}`;
  }

  /**
   * Transfer / Send an enrolled sadhana directly to Trainee Sadhak In-Progress
   */
  sendSadhanaToTrainee(sadhanaKeyOrObj) {
    const profile = this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];

    const key =
      typeof sadhanaKeyOrObj === "string"
        ? sadhanaKeyOrObj
        : sadhanaKeyOrObj.id || sadhanaKeyOrObj.sadhanaKey;
    const catalog = this.getSadhanaCatalog();
    const catalogItem = catalog[key] || {
      id: key,
      title: sadhanaKeyOrObj.name || key,
      category: sadhanaKeyOrObj.category || "Sacred Sadhana",
      domain: "sadhanas",
      timing: "Daily Practice",
      mantra: "Om Namah Shivaya",
    };

    const existingIdx = profile.traineeSadhanas.findIndex(
      (ts) =>
        ts.sadhanaKey === key ||
        (ts.id && ts.id === key) ||
        ts.title.toLowerCase() === catalogItem.title.toLowerCase(),
    );
    const nowStamp =
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " " +
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (existingIdx === -1) {
      profile.traineeSadhanas.push({
        id: "ts-" + Date.now().toString().slice(-4),
        sadhanaKey: key,
        title: catalogItem.title,
        categoryDomain: catalogItem.domain || "sadhanas",
        isPaid: profile.isPaid !== false && profile.paymentStatus !== "FREE",
        paymentStatus:
          profile.isPaid !== false && profile.paymentStatus !== "FREE"
            ? "PAID"
            : "FREE",
        level: "Level 1 — Novice Initiation",
        dailyTarget:
          catalogItem.domain === "remedies"
            ? "Daily Sunset Protocol"
            : catalogItem.domain === "cleansing"
              ? "Morning / Dusk Routine"
              : this.settings?.defaultTargetMalas || "11 Malas Daily",
        currentStreak: this.settings?.defaultSadhanaStreak || "1 Day",
        progressPercent: 20,
        status: "In Progress",
        mentorCode:
          profile.referredByCode ||
          this.settings?.defaultMentorCode ||
          "SKHM-ADM1-7788-9900",
        diaryNotes: `Attunement active. Timing: ${catalogItem.timing || "Brahma Muhurta"}. Mantra: ${catalogItem.mantra || "Om Namah Shivaya"}`,
        memos: [
          {
            date: nowStamp,
            author: this.settings?.defaultMentorName || "Mentor Guide",
            text: `Enrolled & initiated into ${catalogItem.title}. Timing: ${catalogItem.timing || "Daily"}. Mantra frequency synchronized.`,
          },
        ],
      });
    } else {
      if (!profile.traineeSadhanas[existingIdx].categoryDomain) {
        profile.traineeSadhanas[existingIdx].categoryDomain =
          catalogItem.domain || "sadhanas";
      }
    }

    if (!profile.selectedRemedies.includes(key)) {
      profile.selectedRemedies.push(key);
    }
    const hasEnrolled = profile.interestedSadhanas.some(
      (is) => is.id === key || is.name === catalogItem.title,
    );
    if (!hasEnrolled) {
      profile.interestedSadhanas.push({
        id: key,
        name: catalogItem.title,
        category: catalogItem.category,
        priority: "High",
        status: "In Progress",
        isPaid: profile.isPaid !== false && profile.paymentStatus !== "FREE",
        paymentStatus:
          profile.isPaid !== false && profile.paymentStatus !== "FREE"
            ? "PAID"
            : "FREE",
      });
    }

    this.saveProfiles(this.profiles);
    return catalogItem;
  }

  addTraineeMemo(
    itemId,
    memoText,
    author = null,
    isVerification = false,
    type = "NORMAL",
    targetProfile = null,
  ) {
    const profile = (typeof targetProfile === 'object' && targetProfile) 
      ? targetProfile 
      : (typeof targetProfile === 'string' ? this.profiles.find(p => p.id === targetProfile) : null) || this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find((s) => s.id === itemId);
    if (item) {
      if (!item.memos) item.memos = [];
      const nowStamp =
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      const finalAuthor =
        author ||
        (this.getRoleMode() === "MASTER"
          ? this.settings?.defaultMentorName || "Master Karim"
          : profile.name || "Devotee Sadhak");
      item.memos.push({
        date: nowStamp,
        author: finalAuthor,
        text: memoText,
        isVerification: isVerification,
        type: type,
      });
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  loadProfiles() {
    this.profiles = this._loadProfiles();
    return this.profiles;
  }

  requestTraineeVerification(itemId, customNote = "", targetProfile = null) {
    if (typeof customNote === 'object' && customNote !== null && !targetProfile) {
      targetProfile = customNote;
      customNote = "";
    }
    const profile = (typeof targetProfile === 'object' && targetProfile) 
      ? targetProfile 
      : (typeof targetProfile === 'string' ? this.profiles.find(p => p.id === targetProfile) : null) || this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find((s) => s.id === itemId);
    if (item) {
      const nowStamp =
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      item.verificationStatus = "PENDING_APPROVAL";
      item.verificationRequestedDate = nowStamp;
      const author = typeof profile.name === 'string' ? profile.name : "Devotee Sadhak";
      
      const sponsorCode =
        (typeof item.mentorCode === 'string' && item.mentorCode) ||
        (typeof profile.referredByCode === 'string' && profile.referredByCode) ||
        this.settings?.defaultMentorCode ||
        "SKHM-ADM1-7788-9900";
      const mentorObj = this.profiles.find(p => p.referenceCode === sponsorCode);
      const mentorName = (typeof item.mentorName === 'string' && item.mentorName) || (mentorObj ? mentorObj.name : null) || (typeof profile.referredByName === 'string' && profile.referredByName) || "Upline Mentor";
      item.mentorName = String(mentorName);
      item.mentorCode = String(sponsorCode);

      const safeCustomNote = typeof customNote === 'string' ? customNote : "";
      const note =
        safeCustomNote ||
        `[FEEDBACK REQUEST SENT] Submitted ${item.progressPercent || 0}% progress (${item.currentStreak || "1 Day"}) to Upline Mentor ${mentorName} (${sponsorCode}) for verification & feedback seal.`;

      this.addTraineeMemo(itemId, note, author, true, "PENDING", profile);
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  approveTraineeVerification(itemId, mentorName = null, mentorCode = null, targetProfile = null) {
    if (typeof mentorName === 'object' && mentorName !== null && !targetProfile) {
      targetProfile = mentorName;
      mentorName = null;
    }
    const profile = (typeof targetProfile === 'object' && targetProfile) 
      ? targetProfile 
      : (typeof targetProfile === 'string' ? this.profiles.find(p => p.id === targetProfile) : null) || this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find((s) => s.id === itemId);
    if (item) {
      const nowStamp =
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      const activeMentor = (typeof mentorName === 'string' && mentorName)
        ? mentorName
        : (mentorName && typeof mentorName === 'object' && mentorName.name) || this.settings?.defaultMentorName || "Karim Ji (Founder)";
      const activeCode = (typeof mentorCode === 'string' && mentorCode)
        ? mentorCode
        : (mentorCode && typeof mentorCode === 'object' && mentorCode.referenceCode) || this.settings?.defaultMentorCode || "SKHM-ADM1-7788-9900";

      item.verificationStatus = "VERIFIED";
      item.verifiedDate = nowStamp;
      item.verifiedBy = String(activeMentor);
      item.verifiedCode = String(activeCode);
      item.mentorName = String(activeMentor);
      item.mentorCode = String(activeCode);
      item.verifiedPercent = item.progressPercent || 100;

      const note = `[FEEDBACK RECEIVED & SEALED] Officially approved by Upline Mentor ${activeMentor} (${activeCode}). Progress verified with sacred seal!`;
      this.addTraineeMemo(itemId, note, String(activeMentor), true, "VERIFIED", profile);
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  rejectTraineeVerification(itemId, reason = "", mentorName = null, mentorCode = null, targetProfile = null) {
    if (typeof reason === 'object' && reason !== null && !targetProfile) {
      targetProfile = reason;
      reason = "";
    }
    if (typeof mentorName === 'object' && mentorName !== null && !targetProfile) {
      targetProfile = mentorName;
      mentorName = null;
    }
    const profile = (typeof targetProfile === 'object' && targetProfile) 
      ? targetProfile 
      : (typeof targetProfile === 'string' ? this.profiles.find(p => p.id === targetProfile) : null) || this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find((s) => s.id === itemId);
    if (item) {
      const nowStamp =
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      const activeMentor = (typeof mentorName === 'string' && mentorName)
        ? mentorName
        : (mentorName && typeof mentorName === 'object' && mentorName.name) || this.settings?.defaultMentorName || "Karim Ji (Founder)";
      const activeCode = (typeof mentorCode === 'string' && mentorCode)
        ? mentorCode
        : (mentorCode && typeof mentorCode === 'object' && mentorCode.referenceCode) || this.settings?.defaultMentorCode || "SKHM-ADM1-7788-9900";

      item.verificationStatus = "REVISION_REQUESTED";
      item.verifiedDate = null;
      item.rejectedDate = nowStamp;
      item.rejectedBy = String(activeMentor);
      item.mentorName = String(activeMentor);
      item.mentorCode = String(activeCode);

      const safeReason = typeof reason === 'string' && reason ? reason : "Complete additional practice daily and re-submit for seal.";
      const note = `[REVISION REQUESTED] Mentor ${activeMentor} requested revision: "${safeReason}"`;
      this.addTraineeMemo(itemId, note, String(activeMentor), true, "REVISION", profile);
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }


  // ==========================================
  // 4-PHASE APP SHARING & 24-HOUR PAIRING PROTOCOL (ENTERPRISE UPGRADED)
  // ==========================================

  /**
   * Cycle Detection: Prevents self-pairing or circular upline/downline relationships
   */
  validateLineageRelationship(sponsorCode, candidateCode) {
    if (!sponsorCode || !candidateCode) return { valid: true };
    const cleanSponsor = sponsorCode.trim().toUpperCase();
    const cleanCandidate = candidateCode.trim().toUpperCase();

    if (cleanSponsor === cleanCandidate) {
      return {
        valid: false,
        reason:
          "Self-pairing is prohibited. Sponsor code cannot match candidate code.",
      };
    }

    // Traverse upwards from sponsor to verify candidate is not an ancestor of sponsor
    let current = cleanSponsor;
    const visited = new Set([cleanSponsor]);
    while (current && current !== "ROOT-0000-0000-0000") {
      const prof = this.profiles.find(
        (p) => (p.referenceCode || "").toUpperCase() === current,
      );
      if (!prof || !prof.referredByCode) break;
      const parent = prof.referredByCode.toUpperCase();
      if (parent === cleanCandidate) {
        return {
          valid: false,
          reason: `Circular lineage detected: ${cleanCandidate} is already an upline mentor of ${cleanSponsor}.`,
        };
      }
      if (visited.has(parent)) break;
      visited.add(parent);
      current = parent;
    }

    return { valid: true };
  }

  /**
   * Calculate exponential backoff cooldown for pairing resends (60s -> 180s -> 600s)
   */
  getResendCooldownRemaining(item) {
    if (!item || !item.lastResendTimestamp) return 0;
    const count = item.resendCount || 0;
    let requiredCooldownMs = 0;
    if (count === 1) requiredCooldownMs = 60 * 1000;
    else if (count === 2) requiredCooldownMs = 180 * 1000;
    else if (count >= 3) requiredCooldownMs = 600 * 1000;

    const elapsed = Date.now() - item.lastResendTimestamp;
    const remainingMs = requiredCooldownMs - elapsed;
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  }

  /**
   * Live Firebase Realtime Database Telemetry Logger
   */
  async logDeviceEvent(
    deviceId,
    logType,
    message,
    details = {},
    severity = "INFO",
  ) {
    const payload = {
      deviceId: deviceId || "WEB-ADMIN-DASHBOARD",
      logType: logType || "SYSTEM_EVENT",
      message: message || "",
      severity: severity,
      timestamp: { ".sv": "timestamp" },
      clientTimestampMs: Date.now(),
      details: details,
    };

    const firebaseUrl =
      this.settings?.firebaseUrl ||
      "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/";
    const endpoint = `${firebaseUrl.replace(/\/$/, "")}/device_logs/${encodeURIComponent(deviceId || "WEB_ADMIN")}.json`;

    try {
      if (navigator.onLine) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => this._enqueueOfflineSync("DEVICE_LOG", payload));
      } else {
        this._enqueueOfflineSync("DEVICE_LOG", payload);
      }
    } catch (err) {
      this._enqueueOfflineSync("DEVICE_LOG", payload);
    }
  }

  /**
   * Offline Sync Queue Manager
   */
  _enqueueOfflineSync(type, payload) {
    try {
      const q = JSON.parse(
        localStorage.getItem("sk_offline_sync_queue") || "[]",
      );
      q.push({ id: "sq-" + Date.now(), type, payload, queuedAt: Date.now() });
      localStorage.setItem("sk_offline_sync_queue", JSON.stringify(q));
    } catch (e) {
      console.warn("Could not enqueue offline sync", e);
    }
  }

  async flushOfflineSyncQueue() {
    if (!navigator.onLine) return;
    try {
      const raw = localStorage.getItem("sk_offline_sync_queue");
      if (!raw) return;
      const q = JSON.parse(raw);
      if (!Array.isArray(q) || q.length === 0) return;

      const firebaseUrl =
        this.settings?.firebaseUrl ||
        "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/";
      const remaining = [];

      for (const item of q) {
        try {
          if (item.type === "DEVICE_LOG") {
            await fetch(
              `${firebaseUrl.replace(/\/$/, "")}/device_logs/${encodeURIComponent(item.payload.deviceId || "WEB")}.json`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item.payload),
              },
            );
          } else if (item.type === "PAIRING_INVITE") {
            await fetch(
              `${firebaseUrl.replace(/\/$/, "")}/pairing_invites/${encodeURIComponent(item.payload.id)}.json`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item.payload),
              },
            );
          }
        } catch (e) {
          remaining.push(item);
        }
      }

      localStorage.setItem("sk_offline_sync_queue", JSON.stringify(remaining));
    } catch (e) {
      console.warn("Error flushing offline sync queue", e);
    }
  }

  /**
   * Returns pairing invites filtered strictly per caller's authorization level:
   * - DEVOTEE / SEEKER & TRAINEE / SADHAK: No access (empty array)
   * - HEALER: Respective sponsor access only (invites where sponsorCode === healer's refCode)
   * - ADMIN / MASTER: Full access across entire lineage
   */
  getPairingInvitesForRole(roleMode = null, activeProfile = null) {
    const role = (roleMode || this.getRoleMode() || "MASTER").toUpperCase();
    const active = activeProfile || this.getActiveProfile() || {};
    const allInvites = this.getPairingInvites();

    // 1. Devotee & Trainee have ZERO access to devotee pairing applications
    if (["DEVOTEE", "SEEKER", "TRAINEE", "SADHAK"].includes(role)) {
      return [];
    }

    // 2. Healers only see seeker applications for which they are the upline sponsor
    if (role === "HEALER") {
      const healerRef = (active.referenceCode || "").trim();
      const healerName = (active.name || "").trim().toLowerCase();
      return allInvites.filter((inv) => {
        if (!inv) return false;
        const sCode = (inv.sponsorCode || "").trim();
        const mCode = (inv.mentorCode || "").trim();
        const sName = (inv.sponsorName || "").trim().toLowerCase();
        return (healerRef && (sCode === healerRef || mCode === healerRef)) ||
               (healerName && sName === healerName);
      });
    }

    // 3. Admin / Master has complete lineage visibility
    return allInvites;
  }

  getPairingInvites() {
    const defaultInvites = this.getDefaultPairingInvites();
    try {
      // Primary key: sk_pairing_invites (CLAUDE.md standard)
      const stored = localStorage.getItem("sk_pairing_invites") || localStorage.getItem("spiritual_karim_pairing_invites");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultIds = new Set(defaultInvites.map((d) => d.id));
          const customInvites = parsed.filter((p) => !defaultIds.has(p.id));
          const existingDefaults = parsed.filter((p) => defaultIds.has(p.id));
          const merged = [
            ...customInvites,
            ...(existingDefaults.length > 0 ? existingDefaults : defaultInvites),
          ];

          // Strictly isolate Registration pairing invites from Sadhana/Remedy initiations
          const registrationInvites = merged.filter(p => 
            p && 
            p.type !== "SADHANA_APPLICATION" && 
            p.type !== "REMEDY_APPLICATION" && 
            p.contextType !== "sadhana" && 
            p.contextType !== "remedy" &&
            !p.id?.startsWith("sadhana-") &&
            !p.id?.startsWith("remedy-")
          );

          if (registrationInvites.length !== merged.length) {
            try { localStorage.setItem("sk_pairing_invites", JSON.stringify(registrationInvites)); } catch (e) {}
          }

          return registrationInvites;
        }
      }
    } catch (e) {
      console.warn("Could not load pairing invites", e);
    }
    this.savePairingInvites(defaultInvites);
    return defaultInvites;
  }

  getDefaultPairingInvites() {
    return [
      {
        id: "inv-01",
        sponsorCode: "SKHM-ADM1-7788-9900",
        seekerName: "Pooja Deshmukh",
        seekerPhone: "+91 98334 11223",
        seekerEmail: "pooja.deshmukh@spiritualkarim.org",
        dob: "1988-04-12",
        appliedRole: "HEALER",
        assignedRole: "HEALER",
        seekerDeviceModel: "iPhone 15 Pro",
        hardwareNonce: "HW-FPRINT-5566-7788",
        devoteeCode: "SKHL-HLR2-5566-7788",
        activationPin: "290412",
        lineage: {
          paternalGotra: "Kashyap",
          maternalGotra: "Vashishta",
          kuldevi: "Maa Mahalakshmi",
          village: "Nasik, MH"
        },
        diyaDays: 90,
        houseCleanVerified: true,
        telegramLink:
          "https://t.me/SpiritualKarimBot?start=pair_SKHMADM177889900",
        apkDownloadUrl:
          "https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk",
        createdAtMs: Date.now() - 7200000,
        expiresAtMs: Date.now() + 22 * 3600000,
        status: "PENDING",
        resendCount: 0,
        lastResendTimestamp: Date.now() - 7200000,
        formattedCreatedTime: "Today • 2h ago",
      },
      {
        id: "inv-02",
        sponsorCode: "SKHM-HLR2-3344-5566",
        seekerName: "Rahul Sharma",
        seekerPhone: "+91 98445 22334",
        seekerEmail: "rahul.sadhak@spiritualkarim.org",
        dob: "1992-11-20",
        appliedRole: "DEVOTEE",
        assignedRole: "DEVOTEE",
        seekerDeviceModel: "Google Pixel 8",
        hardwareNonce: "HW-FPRINT-4433-2211",
        devoteeCode: "SKDV-DEV4-4433-2211",
        activationPin: "781120",
        lineage: {
          paternalGotra: "Vashishta",
          maternalGotra: "Garg",
          kuldevi: "Maa Chamunda",
          village: "Jaipur, RJ"
        },
        diyaDays: 42,
        houseCleanVerified: true,
        telegramLink:
          "https://t.me/SpiritualKarimBot?start=pair_SKHMADM177889900",
        apkDownloadUrl:
          "https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk",
        createdAtMs: Date.now() - 14400000,
        expiresAtMs: Date.now() + 20 * 3600000,
        status: "PENDING",
        resendCount: 0,
        lastResendTimestamp: Date.now() - 14400000,
        formattedCreatedTime: "Today • 4h ago",
      },
      {
        id: "inv-03",
        sponsorCode: "SKHM-HLR2-5566-7788",
        seekerName: "Ananya Sharma",
        seekerPhone: "+91 98112 33445",
        seekerEmail: "ananya.sharma@spiritualkarim.org",
        dob: "1994-08-15",
        appliedRole: "DEVOTEE",
        assignedRole: "DEVOTEE",
        seekerDeviceModel: "Samsung Galaxy SM-G998B",
        hardwareNonce: "HW-FPRINT-8891-9921",
        devoteeCode: "SKDV-DEV4-8891-9921",
        activationPin: "140610",
        lineage: {
          paternalGotra: "Bharadwaja",
          maternalGotra: "Kashyap",
          kuldevi: "Maa Durga Bhavani",
          village: "Mathura, UP"
        },
        diyaDays: 14,
        houseCleanVerified: true,
        telegramLink:
          "https://t.me/SpiritualKarimBot?start=pair_SKHMADM177889900",
        apkDownloadUrl:
          "https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk",
        createdAtMs: Date.now() - 3600000,
        expiresAtMs: Date.now() + 23 * 3600000,
        status: "PENDING",
        resendCount: 0,
        lastResendTimestamp: Date.now() - 3600000,
        formattedCreatedTime: "Today • 1h ago",
      },
      {
        id: "inv-04",
        sponsorCode: "SKHM-ADM1-7788-9900",
        seekerName: "Amit Patel",
        seekerPhone: "+91 98776 33445",
        seekerEmail: "amit.patel@spiritualkarim.org",
        dob: "1996-03-08",
        appliedRole: "DEVOTEE",
        assignedRole: "DEVOTEE",
        seekerDeviceModel: "OnePlus Nord",
        hardwareNonce: "HW-FPRINT-9988-1122",
        devoteeCode: "SKDV-DEV4-9988-1122",
        activationPin: "330308",
        lineage: {
          paternalGotra: "Garg",
          maternalGotra: "Bharadwaja",
          kuldevi: "Maa Ambika",
          village: "Surat, GJ"
        },
        diyaDays: 21,
        houseCleanVerified: true,
        telegramLink:
          "https://t.me/SpiritualKarimBot?start=pair_SKHMADM177889900",
        apkDownloadUrl:
          "https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk",
        createdAtMs: Date.now() - 28800000,
        expiresAtMs: Date.now() + 16 * 3600000,
        status: "PENDING",
        resendCount: 0,
        lastResendTimestamp: Date.now() - 28800000,
        formattedCreatedTime: "Today • 8h ago",
      },
      {
        id: "inv-05",
        sponsorCode: "SKHM-ADM1-7788-9900",
        seekerName: "Vikram Aditya",
        seekerPhone: "+91 98223 44556",
        seekerEmail: "vikram.aditya@spiritualkarim.org",
        dob: "1990-06-14",
        appliedRole: "DEVOTEE",
        assignedRole: "DEVOTEE",
        seekerDeviceModel: "OnePlus 11 5G",
        hardwareNonce: "HW-FPRINT-1122-3344",
        devoteeCode: "SKDV-DEV4-1122-3344",
        activationPin: "990614",
        lineage: {
          paternalGotra: "Gautama",
          maternalGotra: "Sandilya",
          kuldevi: "Maa Saraswati",
          village: "Ujjain, MP"
        },
        diyaDays: 7,
        houseCleanVerified: false,
        telegramLink:
          "https://t.me/SpiritualKarimBot?start=pair_SKHMADM177889900",
        apkDownloadUrl:
          "https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk",
        createdAtMs: Date.now() - 86400000,
        expiresAtMs: Date.now() - 1000,
        status: "EXPIRED",
        resendCount: 1,
        lastResendTimestamp: Date.now() - 86400000,
        formattedCreatedTime: "Yesterday",
      },
    ];
  }

  /**
   * Migrates legacy localStorage keys to unified standards.
   * Called once on app startup if old keys are detected.
   */
  migrateLegacyKeys() {
    if (typeof localStorage === "undefined") return;
    try {
      // Migrate pairing invites
      const legacyInvites = localStorage.getItem(
        "spiritual_karim_pairing_invites",
      );
      if (legacyInvites && !localStorage.getItem("sk_pairing_invites")) {
        localStorage.setItem("sk_pairing_invites", legacyInvites);
        console.log("[MIGRATE] Pairing invites migrated to sk_pairing_invites");
      }

      // Migrate profiles
      const legacyProfiles = localStorage.getItem("sk_profiles_data");
      if (legacyProfiles && !localStorage.getItem("sk_admin_profiles_v3")) {
        localStorage.setItem("sk_admin_profiles_v3", legacyProfiles);
        console.log("[MIGRATE] Profiles migrated to sk_admin_profiles_v3");
      }
    } catch (e) {
      console.warn("[MIGRATE] Migration error:", e);
    }
  }

  savePairingInvites(invites) {
    try {
      localStorage.setItem("sk_pairing_invites", JSON.stringify(invites));
      // Also write to legacy key for backward compatibility
      localStorage.setItem(
        "spiritual_karim_pairing_invites",
        JSON.stringify(invites),
      );
    } catch (e) {
      console.warn("Could not save pairing invites", e);
    }
  }

  createPairingInvite({
    seekerName,
    seekerPhone,
    deviceModel,
    candidateCode = null,
  }) {
    const invites = this.getPairingInvites();
    const profile = this.getActiveProfile();
    const sponsorCode = profile.referenceCode || "SKHM-ADM1-7788-9900";

    // 1. Lineage Cycle & Self-Pairing Check
    const lineageValidation = this.validateLineageRelationship(
      sponsorCode,
      candidateCode,
    );
    if (!lineageValidation.valid) {
      return { error: true, message: lineageValidation.reason };
    }

    // 2. Downline Capacity Throttle: Configurable active pending invites per mentor
    const maxPending = this.settings.maxPendingInvitesPerMentor || 5;
    const activePending = invites.filter(
      (i) => i.sponsorCode === sponsorCode && i.status === "PENDING",
    );
    if (activePending.length >= maxPending) {
      return {
        error: true,
        message:
          `Invite quota reached: Maximum ${maxPending} pending pairing requests allowed simultaneously per mentor. Approve or reject pending requests first.`,
      };
    }

    const cleanCode = sponsorCode.replace(/[^a-zA-Z0-9]/g, "");
    const devoteeCode = candidateCode || this.generate16DigitCode("SKDV");
    const expiryHours = this.settings.inviteExpiryHours || 24;

    const newInvite = {
      id: "inv-" + Date.now().toString(36),
      sponsorCode: sponsorCode,
      devoteeCode: devoteeCode,
      seekerName: seekerName || "New Seeker",
      seekerPhone: seekerPhone || "+91 98000 00000",
      seekerDeviceModel: deviceModel || "Android Device",
      hardwareNonce: devoteeCode,
      referenceKey: devoteeCode,
      telegramLink: `https://t.me/SpiritualKarimBot?start=pair_${cleanCode}`,
      apkDownloadUrl:
        "https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk",
      createdAtMs: Date.now(),
      expiresAtMs: Date.now() + expiryHours * 60 * 60 * 1000,
      status: "PENDING",
      resendCount: 0,
      lastResendTimestamp: Date.now(),
      formattedCreatedTime: "Just Now",
    };

    invites.unshift(newInvite);
    this.savePairingInvites(invites);

    // Live Telemetry stream to Firebase Realtime Database
    this.logDeviceEvent(
      newInvite.hardwareNonce,
      "PAIRING_REQUESTED",
      `New seeker "${newInvite.seekerName}" requested pairing under sponsor ${sponsorCode}`,
      newInvite,
    );

    return newInvite;
  }

  deletePairingInvite(inviteId) {
    const invites = this.getPairingInvites();
    const filtered = invites.filter(i => i.id !== inviteId);
    this.savePairingInvites(filtered);

    const inviteIndex = invites.findIndex(i => i.id === inviteId);
    if (inviteIndex !== -1) {
      invites[inviteIndex].status = "DELETED";
      invites[inviteIndex].deletedAtMs = Date.now();
      this.savePairingInvites(invites);
    }

    if (typeof BroadcastChannel !== "undefined") {
      try {
        const syncChan = new BroadcastChannel("spiritual_karim_sync");
        syncChan.postMessage({ type: "PAIRING_INVITE_DELETED", inviteId });
      } catch (e) {}
    }

    // Backend HTTP delete (optional - we may want to pass soft-delete to backend too, but keeping API same for now)
    try {
      fetch(`/api/pairing-invites?id=${encodeURIComponent(inviteId)}`, { method: "DELETE" }).catch(() => {});
    } catch (e) {}

    // Firebase RTDB delete (we keep this hard delete for now to save space on remote)
    const firebaseUrl = this.settings?.firebaseUrl || "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/";
    try {
      fetch(`${firebaseUrl.replace(/\/$/, "")}/pairing_invites/${encodeURIComponent(inviteId)}.json`, { method: "DELETE" }).catch(() => {});
    } catch (e) {}

    return true;
  }

  restorePairingInvite(inviteId) {
    const invites = this.getPairingInvites();
    const inviteIndex = invites.findIndex(i => i.id === inviteId);
    if (inviteIndex !== -1) {
      invites[inviteIndex].status = "PENDING";
      delete invites[inviteIndex].deletedAtMs;
      this.savePairingInvites(invites);
    }
    
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const syncChan = new BroadcastChannel("spiritual_karim_sync");
        syncChan.postMessage({ type: "PAIRING_INVITE_RESTORED", inviteId });
      } catch (e) {}
    }
    return true;
  }

  approvePairingInvite(inviteId, targetRole = null) {
    const invites = this.getPairingInvites();
    const item = invites.find((i) => i.id === inviteId);
    if (item) {
      const assignedRole = (targetRole || item.assignedRole || this.settings.defaultInductionRole || "DEVOTEE").toUpperCase();
      const roleLevel = (assignedRole === "MASTER" || assignedRole === "ADMIN") ? 1 : assignedRole === "HEALER" ? 2 : assignedRole === "TRAINEE" ? 3 : 4;

      item.status = "APPROVED";
      item.assignedRole = assignedRole;
      item.roleLevel = roleLevel;
      item.approvedAtMs = Date.now();
      this.savePairingInvites(invites);

      const profile = this.getActiveProfile();
      if (!profile.healerNetwork) profile.healerNetwork = [];

      const targetRefCode = item.devoteeCode || item.hardwareNonce || item.referenceKey || this.generate16DigitCode("SKDV");

      const existsInNet = profile.healerNetwork.some(
        (n) =>
          n.name === item.seekerName ||
          (n.refCode && n.refCode === targetRefCode),
      );
      if (!existsInNet) {
        profile.healerNetwork.push({
          id: "net-" + Date.now().toString().slice(-4),
          name: item.seekerName,
          refCode: targetRefCode,
          role: `${assignedRole.charAt(0) + assignedRole.slice(1).toLowerCase()} (Level ${roleLevel})`,
          activeCases: 1,
          phone: item.seekerPhone || "",
          deviceModel: item.seekerDeviceModel || "",
        });
      }

      // Ensure seeker exists as a registered profile in directory with assigned role
      const existingProfile = this.profiles.find(
        (p) =>
          (item.seekerId && p.id === item.seekerId) ||
          (item.devoteeCode && (p.referenceCode === item.devoteeCode || p.id === item.devoteeCode)) ||
          p.name === item.seekerName ||
          (item.seekerPhone && p.phone === item.seekerPhone) ||
          p.referenceCode === targetRefCode,
      );
      if (!existingProfile) {
        const newDevoteeProfile = {
          id: "prof-" + assignedRole.toLowerCase().slice(0, 4) + "-" + Date.now().toString(36),
          referenceCode: targetRefCode,
          referredByCode: profile.referenceCode || "SKHM-ADM1-7788-9900",
          transferredCode: "",
          name: item.seekerName,
          phone: item.seekerPhone || "",
          email: item.seekerEmail || "",
          profileType: assignedRole,
          level: roleLevel,
          isPaid: false,
          paymentStatus: "FREE",
          objective: item.objective ||
            "Household cleansing, Three Diya practice, and ancestral karma resolution.",
          selectedRemedies: ["three_diya", "negativity"],
          address: "",
          city: "",
          joinDate: new Date().toISOString().split("T")[0],
          isActive: true,
          notes: `Paired via token with mentor ${profile.name} (${profile.referenceCode}). Assigned Role: ${assignedRole}. Device: ${item.seekerDeviceModel || "Web"}`,
          categoryTag: assignedRole === "HEALER" ? "Healers & Mentors" : assignedRole === "TRAINEE" ? "Trainee Sadhaks" : "House Clean & Seekers",
          seekerDiagnostics: {
            afflictionDuration: "",
            kuldeviIssues: "",
            targetOutcome: "",
          },
          interestedSadhanas: [
            {
              id: "three_diya",
              name: "Three Diya Process",
              category: "Divine Remedy",
              priority: "High",
              status: "Interested",
            },
          ],
          houseCleanLevels: [
            {
              id: "hc-d1",
              levelNumber: 1,
              levelTitle: "Level 1 — Self House Clean",
              status: "NOT_STARTED",
              cleanPercentage: 0,
              cleanedDetails: "",
              mentorCode: profile.referenceCode,
              mentorName: profile.name,
              mentorRemarks: null,
              approvalDate: null,
            },
            {
              id: "hc-d2",
              levelNumber: 2,
              levelTitle: "Level 2 — Parents House Clean",
              status: "NOT_STARTED",
              cleanPercentage: 0,
              cleanedDetails: "",
              mentorCode: profile.referenceCode,
              mentorName: profile.name,
              mentorRemarks: null,
              approvalDate: null,
            },
            {
              id: "hc-d3",
              levelNumber: 3,
              levelTitle: "Level 3 — Relative House Clean",
              status: "NOT_STARTED",
              cleanPercentage: 0,
              cleanedDetails: "",
              mentorCode: profile.referenceCode,
              mentorName: profile.name,
              mentorRemarks: null,
              approvalDate: null,
            },
          ],
          traineeSadhanas: assignedRole === "TRAINEE" ? [
            {
              id: "three_diya",
              title: "Three Diya Practice",
              category: "Divine Remedy",
              status: "IN_PROGRESS",
              dailyMalasDone: 0,
              targetMalas: 11,
              streakDays: 0,
            }
          ] : [],
          healerCompletedSadhanas: [],
          healerNetwork: [],
          lineage: {
            currentFamily: {
              selfName: item.seekerName,
              selfTitle: `${assignedRole.charAt(0) + assignedRole.slice(1).toLowerCase()} Sadhak`,
              spouseName: "",
              children: [],
              siblings: [],
            },
            husbandAncestral: {
              fatherName: "",
              motherName: "",
              paternalGrandfather: "",
              paternalGrandmother: "",
              maternalGrandfather: "",
              maternalGrandmother: "",
              siblings: [],
              address: "",
            },
            wifeAncestral: {
              fatherName: "",
              motherName: "",
              paternalGrandfather: "",
              paternalGrandmother: "",
              maternalGrandfather: "",
              maternalGrandmother: "",
              siblings: [],
              address: "",
            },
          },
        };
        this.profiles.push(newDevoteeProfile);
      } else {
        existingProfile.profileType = assignedRole;
        existingProfile.level = roleLevel;
        existingProfile.role = `${assignedRole.charAt(0) + assignedRole.slice(1).toLowerCase()} (Level ${roleLevel})`;
        existingProfile.categoryTag = assignedRole === "HEALER" ? "Healers & Mentors" : assignedRole === "TRAINEE" ? "Trainee Sadhaks" : "House Clean & Seekers";

        if (assignedRole === "TRAINEE") {
          if (!Array.isArray(existingProfile.traineeSadhanas)) {
            existingProfile.traineeSadhanas = [];
          }
          const initiatedSadhanaId = item.sadhanaId || "three_diya";
          const initiatedTitle = item.sadhanaTitle || (typeof SADHANA_CATALOG !== "undefined" && SADHANA_CATALOG[initiatedSadhanaId]?.title) || "Three Diya Practice";
          const hasSadhana = existingProfile.traineeSadhanas.some(s => s && (s.id === initiatedSadhanaId || s.title === initiatedTitle));
          if (!hasSadhana) {
            existingProfile.traineeSadhanas.push({
              id: initiatedSadhanaId,
              title: initiatedTitle,
              category: "Sacred Sadhana",
              status: "IN_PROGRESS",
              dailyMalasDone: 0,
              targetMalas: item.targetMalas || 11,
              scheduleSlot: item.scheduleSlot || "Brahma Muhurta",
              streakDays: 0,
              startDate: new Date().toISOString().split("T")[0]
            });
          }
        }

        // Seamlessly update active session credentials if this profile is currently active in this browser
        if (this.activeProfileId === existingProfile.id) {
          try {
            sessionStorage.setItem("portalRole", assignedRole);
            localStorage.setItem("sk_active_portal_role", assignedRole);
            localStorage.setItem("sk_admin_active_role_mode_v1", assignedRole);
          } catch (e) {}
        }
      }

      this.saveProfiles(this.profiles);

      // Real-time bi-directional Firebase RTDB Push
      const firebaseUrl = this.settings?.firebaseUrl || "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/";
      try {
        fetch(`${firebaseUrl.replace(/\/$/, "")}/pairing_invites/${encodeURIComponent(item.id)}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch(() => {});
        if (newDevoteeProfile) {
          this.pushProfileToFirebase(newDevoteeProfile);
        }
      } catch (e) {}

      // Cross-Tab/Window Notification Channel
      if (typeof BroadcastChannel !== "undefined") {
        try {
          const syncChan = new BroadcastChannel("spiritual_karim_sync");
          syncChan.postMessage({
            type: "INVITE_APPROVED",
            data: {
              seekerName: item.seekerName,
              referenceCode: targetRefCode,
              assignedRole: assignedRole,
              invite: item,
            },
          });
          syncChan.postMessage({
            type: "ROLE_UPGRADED",
            data: {
              seekerName: item.seekerName,
              referenceCode: targetRefCode,
              profileId: existingProfile ? existingProfile.id : null,
              newRole: assignedRole,
              level: roleLevel,
              sadhanaId: item.sadhanaId,
              sadhanaTitle: item.sadhanaTitle,
            },
          });
        } catch (e) {}
      }

      // Log verified approval to Firebase Realtime DB
      this.logDeviceEvent(
        item.hardwareNonce || item.id,
        "PAIRING_APPROVED",
        `Pairing approved for "${item.seekerName}" as ${assignedRole} (Level ${roleLevel}) by sponsor ${item.sponsorCode}`,
        item,
        "SUCCESS",
      );
      return item;
    }
    return null;
  }

  rejectPairingInvite(inviteId) {
    const invites = this.getPairingInvites();
    const item = invites.find((i) => i.id === inviteId);
    if (item) {
      item.status = "REJECTED";
      this.savePairingInvites(invites);

      const firebaseUrl = this.settings?.firebaseUrl || "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/";
      try {
        fetch(`${firebaseUrl.replace(/\/$/, "")}/pairing_invites/${encodeURIComponent(item.id)}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch(() => {});
      } catch (e) {}

      if (typeof BroadcastChannel !== "undefined") {
        try {
          const syncChan = new BroadcastChannel("spiritual_karim_sync");
          syncChan.postMessage({
            type: "INVITE_REJECTED",
            data: {
              inviteId: inviteId,
              invite: item,
            },
          });
        } catch (e) {}
      }

      this.logDeviceEvent(
        item.hardwareNonce || item.id,
        "PAIRING_REJECTED",
        `Pairing rejected for "${item.seekerName}" by sponsor ${item.sponsorCode}`,
        item,
        "WARNING",
      );
      return item;
    }
    return null;
  }

  // ==============================================================
  // NOTIFICATION & TELEMETRY SUBSYSTEM (MULTI-STAGE CLOSED LOOP)
  // ==============================================================
  getNotifications(recipientId = null) {
    try {
      const stored = JSON.parse(localStorage.getItem("sk_notifications_v1") || "[]");
      if (!recipientId) return stored;
      return stored.filter(n => !n.recipientId || n.recipientId === recipientId || n.recipientId === "ALL");
    } catch (e) {
      return [];
    }
  }

  addNotification(notification) {
    try {
      const notifs = this.getNotifications();
      const notifItem = {
        id: notification.id || ("notif-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6)),
        recipientId: notification.recipientId || "ALL",
        type: notification.type || "INFO",
        title: notification.title || "Spiritual Notification",
        message: notification.message || "",
        timestamp: notification.timestamp || Date.now(),
        read: false,
        metadata: notification.metadata || {}
      };
      notifs.unshift(notifItem);
      if (notifs.length > 100) notifs.length = 100;
      localStorage.setItem("sk_notifications_v1", JSON.stringify(notifs));

      // Broadcast real-time event across tabs
      if (typeof BroadcastChannel !== "undefined") {
        try {
          const syncChan = new BroadcastChannel("spiritual_karim_sync");
          syncChan.postMessage({ type: "NEW_NOTIFICATION", data: notifItem });
        } catch (e) {}
      }
      return notifItem;
    } catch (e) {
      console.warn("addNotification error:", e);
      return null;
    }
  }

  markNotificationRead(notifId) {
    try {
      const notifs = this.getNotifications();
      const found = notifs.find(n => n.id === notifId);
      if (found) {
        found.read = true;
        localStorage.setItem("sk_notifications_v1", JSON.stringify(notifs));
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // ==============================================================
  // SADHANA & REMEDY QUEUE DATA MANAGEMENT
  // ==============================================================
  getSadhanaRemedyApplications() {
    let apps = [];
    try {
      apps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "null");
    } catch (e) {
      apps = null;
    }

    if (!apps || !Array.isArray(apps) || apps.length === 0) {
      // Seed rich, authentic mock applications for instant visibility and testing
      apps = [
        {
          id: "sadhana-app-001",
          type: "SADHANA_APPLICATION",
          contextType: "sadhana",
          seekerId: "prof-devotee-09",
          seekerName: "Deepak Saxena",
          devoteeCode: "SKHM-DEV4-3322-1100",
          seekerPhone: "+91 97220 66554",
          seekerLevel: "Level 4 (Devotee)",
          itemId: "sadhana-navarna",
          itemTitle: "Navarna Chandi Anushthan",
          category: "Vedic Sadhana",
          targetMalas: 11,
          cycleDays: 21,
          scheduleSlot: "Brahma Muhurta (04:00 - 06:00)",
          intention: "Seeking Maa Durga's divine grace, household positivity, ancestral protection, and deeper spiritual discipline.",
          commitments: ["Strict Sattvic Diet", "Daily Diya Practice", "Brahmacharya During 21-Day Cycle", "Digital Oath Signed"],
          signature: "Deepak Saxena",
          sponsorCode: "SKHM-ADM1-7788-9900",
          mentorName: "Spiritual Karim Khan",
          status: "PENDING",
          createdAtMs: Date.now() - (2 * 3600 * 1000),
          expiresAtMs: Date.now() + (22 * 3600 * 1000)
        },
        {
          id: "remedy-app-002",
          type: "REMEDY_APPLICATION",
          contextType: "remedy",
          seekerId: "prof-devotee-08",
          seekerName: "Sunita Mehra",
          devoteeCode: "SKHM-DEV4-9988-1122",
          seekerPhone: "+91 98123 45678",
          seekerLevel: "Level 4 (Devotee)",
          itemId: "remedy-pitra",
          itemTitle: "Pitra Dosh Shanti & Griha Shuddhi",
          category: "Remedy & Upay",
          targetMalas: 11,
          cycleDays: 41,
          scheduleSlot: "Sandhya Kaal (18:00 - 19:30)",
          intention: "Resolution of prolonged household unrest, peace for departed ancestors (Pitru), and removal of Nazar/negative vibrations.",
          commitments: ["Strict Sattvic Diet", "Daily Sandhya Aarti", "No Intoxicants", "Digital Oath Signed"],
          signature: "Sunita Mehra",
          sponsorCode: "SKHM-ADM1-7788-9900",
          mentorName: "Spiritual Karim Khan",
          status: "PENDING",
          createdAtMs: Date.now() - (5 * 3600 * 1000),
          expiresAtMs: Date.now() + (19 * 3600 * 1000)
        },
        {
          id: "sadhana-app-003",
          type: "SADHANA_APPLICATION",
          contextType: "sadhana",
          seekerId: "prof-trainee-04",
          seekerName: "Amitabh Sen",
          devoteeCode: "SKHM-TRN3-1122-3344",
          seekerPhone: "+91 97654 32109",
          seekerLevel: "Level 3 (Trainee Sadhak)",
          itemId: "sadhana-mahamrityunjaya",
          itemTitle: "Mahamrityunjaya Kavach Sadhana",
          category: "Vedic Sadhana",
          targetMalas: 21,
          cycleDays: 41,
          scheduleSlot: "Pratah Kaal (06:00 - 08:00)",
          intention: "Overcoming severe chronic health afflictions and building spiritual vitality under mentor supervision.",
          commitments: ["Strict Sattvic Diet", "Daily Diya Practice", "Brahmacharya During 41-Day Cycle", "Digital Oath Signed"],
          signature: "Amitabh Sen",
          sponsorCode: "SKHM-ADM1-7788-9900",
          mentorName: "Spiritual Karim Khan",
          status: "APPROVED",
          initiationToken: "IN-SADH-9K24M",
          mentorFeedback: "Initiation granted for 21 malas daily. Wear rudraksha bead and maintain daily diya log.",
          approvedAtMs: Date.now() - (24 * 3600 * 1000),
          createdAtMs: Date.now() - (48 * 3600 * 1000),
          expiresAtMs: Date.now() + (72 * 3600 * 1000)
        }
      ];
      localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps));
    }

    // Auto-heal/correct corrupted seeker records where Master Admin was recorded as the requester
    let needsResave = false;
    if (apps && Array.isArray(apps)) {
      apps.forEach(app => {
        if (app && (app.seekerName === "Spiritual Karim Khan" || app.seekerId === "prof-admin-01" || app.devoteeCode === "SKHM-ADM1-7788-9900")) {
          needsResave = true;
          if (app.signature && app.signature !== "Spiritual Karim Khan" && app.signature.trim().length > 2 && !app.signature.includes("Select")) {
            app.seekerName = app.signature;
            app.seekerId = app.signature.includes("Sunita") ? "prof-dev-02" : app.signature.includes("Amit") ? "prof-dev-03" : "prof-dev-01";
            app.devoteeCode = app.signature.includes("Sunita") ? "SKDV-SUNT-4412" : app.signature.includes("Amit") ? "SKDV-AMIT-9930" : "SKDV-ROHN-8821";
            app.seekerPhone = app.signature.includes("Sunita") ? "+91 98123 45678" : app.signature.includes("Amit") ? "+91 97654 32109" : "+91 98765 43210";
          } else if (app.itemId === 'sri_yantra' || (app.itemTitle && app.itemTitle.includes('Sri Yantra'))) {
            app.seekerName = "Deepak Saxena";
            app.seekerId = "prof-devotee-09";
            app.devoteeCode = "SKHM-DEV4-3322-1100";
            app.seekerPhone = "+91 97220 66554";
            app.seekerLevel = "Devotee (Level 4)";
            app.signature = "Deepak Saxena";
          } else {
            app.seekerName = "Rohan Sharma";
            app.seekerId = "prof-dev-01";
            app.devoteeCode = "SKDV-ROHN-8821";
            app.seekerPhone = "+91 98765 43210";
            app.seekerLevel = "Devotee (Level 4)";
          }
          app.mentorCode = "SKHM-ADM1-7788-9900";
          app.mentorName = "Shri Karim Ji";
        }
      });
      if (needsResave) {
        try { localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps)); } catch (e) {}
      }
    }

    return apps;
  }

  deleteSadhanaRemedyApplication(appId) {
    let apps = this.getSadhanaRemedyApplications();
    const appIndex = apps.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      apps[appIndex].status = "DELETED";
      apps[appIndex].deletedAtMs = Date.now();
      this.saveSadhanaRemedyApplications(apps);
    }

    // Also soft-remove from pairing invites
    this.deletePairingInvite(appId);

    // Broadcast cross-tab sync
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const syncChan = new BroadcastChannel("spiritual_karim_sync");
        syncChan.postMessage({ type: "SADHANA_APPLICATION_DELETED", appId });
        syncChan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED", count: apps.length });
      } catch (e) {}
    }

    // Backend HTTP delete
    try {
      fetch(`/api/pairing-invites?id=${encodeURIComponent(appId)}`, { method: "DELETE" }).catch(() => {});
    } catch (e) {}

    // Firebase RTDB delete
    const firebaseUrl = this.settings?.firebaseUrl || "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/";
    try {
      fetch(`${firebaseUrl.replace(/\/$/, "")}/pairing_invites/${encodeURIComponent(appId)}.json`, { method: "DELETE" }).catch(() => {});
    } catch (e) {}

    return true;
  }

  restoreSadhanaRemedyApplication(appId) {
    let apps = this.getSadhanaRemedyApplications();
    const appIndex = apps.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      apps[appIndex].status = "PENDING";
      delete apps[appIndex].deletedAtMs;
      this.saveSadhanaRemedyApplications(apps);
    }
    this.restorePairingInvite(appId);
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const syncChan = new BroadcastChannel("spiritual_karim_sync");
        syncChan.postMessage({ type: "SADHANA_APPLICATION_RESTORED", appId });
        syncChan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED", count: apps.length });
      } catch (e) {}
    }
    return true;
  }

  getUplineApprovers(profileOrIdOrCode) {
    const defaultMaster = {
      code: "SKHM-ADM1-7788-9900",
      name: "Spiritual Karim Khan",
      role: "MASTER",
      level: 1,
      id: "prof-admin-01"
    };

    let target = null;
    if (typeof profileOrIdOrCode === "object" && profileOrIdOrCode !== null) {
      target = profileOrIdOrCode;
    } else if (typeof profileOrIdOrCode === "string") {
      target = this.profiles.find(p => p.id === profileOrIdOrCode || p.referenceCode === profileOrIdOrCode || p.name === profileOrIdOrCode);
    }
    if (!target) {
      return {
        directSponsor: defaultMaster,
        firstApprover: defaultMaster,
        secondApprover: defaultMaster,
        lineagePath: [defaultMaster.name]
      };
    }

    let current = target;
    let directSponsor = null;
    let firstApproverHealer = null;
    let secondApproverMaster = null;
    const lineagePath = [target.name];
    const visited = new Set([target.id || target.referenceCode]);

    while (current && current.referredByCode) {
      const parent = this.profiles.find(p => p.referenceCode === current.referredByCode || p.id === current.referredByCode);
      if (!parent || visited.has(parent.id || parent.referenceCode)) break;
      visited.add(parent.id || parent.referenceCode);
      lineagePath.push(parent.name);

      if (!directSponsor) {
        directSponsor = {
          id: parent.id,
          name: parent.name,
          code: parent.referenceCode,
          role: parent.profileType || "TRAINEE",
          level: parent.level
        };
      }

      const pType = (parent.profileType || "").toUpperCase();
      if (!firstApproverHealer && (pType === "HEALER" || parent.level === 2)) {
        firstApproverHealer = {
          id: parent.id,
          name: parent.name,
          code: parent.referenceCode,
          role: "HEALER",
          level: 2
        };
      }

      if (!secondApproverMaster && (pType === "ADMIN" || pType === "MASTER" || parent.level === 1 || parent.level === 0 || parent.id === "prof-admin-01")) {
        secondApproverMaster = {
          id: parent.id,
          name: parent.name,
          code: parent.referenceCode,
          role: "MASTER",
          level: 1
        };
      }

      current = parent;
    }

    if (!secondApproverMaster) secondApproverMaster = defaultMaster;
    if (!firstApproverHealer) {
      if (directSponsor && directSponsor.role === "HEALER") {
        firstApproverHealer = directSponsor;
      } else {
        firstApproverHealer = secondApproverMaster;
      }
    }

    return {
      directSponsor: directSponsor || defaultMaster,
      firstApprover: firstApproverHealer,
      secondApprover: secondApproverMaster,
      lineagePath
    };
  }

  submitSadhanaRemedyApplication(data) {
    const apps = this.getSadhanaRemedyApplications();
    const activeProf = this.getActiveProfile() || {};
    const contextType = data.contextType || (data.type === 'REMEDY_APPLICATION' ? 'remedy' : 'sadhana');

    const seekerId = data.applicantId || data.seekerId || activeProf.id || "prof-trainee-06";
    const seekerName = data.applicantName || data.seekerName || ((activeProf && !activeProf.profileType?.toLowerCase().includes("admin") && !activeProf.profileType?.toLowerCase().includes("master")) ? activeProf.name : "Trainee Sadhak");
    const devoteeCode = data.devoteeCode || activeProf.referenceCode || "SKTR-AMIT-9021";

    // Dynamic 2-Tier Upline Approver Resolution
    const upline = this.getUplineApprovers(activeProf.referenceCode ? activeProf : (devoteeCode || seekerId));
    const firstApprover = upline.firstApprover || upline.directSponsor;
    const secondApprover = upline.secondApprover;

    const newApp = {
      id: data.id || `${contextType}-req-${Date.now().toString(36)}`,
      type: data.type || (contextType === 'remedy' ? "REMEDY_APPLICATION" : "SADHANA_APPLICATION"),
      contextType: contextType,
      seekerId: seekerId,
      seekerName: seekerName,
      devoteeCode: devoteeCode,
      seekerPhone: data.seekerPhone || activeProf.phone || "+91 98765 00000",
      seekerEmail: data.seekerEmail || activeProf.email || "",
      seekerLevel: data.applicantRole || activeProf.profileType || "Trainee Sadhak",
      itemId: data.itemId || data.sadhanaId || "sadhana-mrityunjaya",
      itemTitle: data.title || data.itemTitle || data.sadhanaTitle || "Maha Mrityunjaya Jaap - Rigvedic Vedic Diksha",
      category: data.category || (contextType === 'remedy' ? "Remedy & Upay" : "Trainee Diksha"),
      scheduleSlot: data.scheduleSlot || "Brahma Muhurta (04:00 - 06:00)",
      
      // 2-Tier Hierarchy Workflow Metadata
      mentorCode: firstApprover.code,
      sponsorCode: upline.directSponsor.code,
      mentorName: firstApprover.name,
      firstApproverCode: firstApprover.code,
      firstApproverName: firstApprover.name,
      firstApproverRole: firstApprover.role || "HEALER",
      firstApproverStatus: "PENDING",
      secondApproverCode: secondApprover.code,
      secondApproverName: secondApprover.name,
      secondApproverRole: "MASTER",
      secondApproverStatus: "PENDING",
      approvalStage: 1, // 1 = Awaiting Healer Verification, 2 = Awaiting Master Sanction

      targetMalas: Number(data.targetMalas) || 11,
      cycleDays: Number(data.cycleDays) || 21,
      intention: data.notes || data.intention || "Seeking Divine initiation and spiritual growth.",
      commitments: ["Strict Sattvic Diet", "Daily Diya Practice", "Brahmacharya During Cycle", "Digital Oath Signed"],
      signature: data.signature || activeProf.name || "Trainee Sadhak",
      date: new Date().toISOString(),
      createdAtMs: Date.now(),
      expiresAtMs: Date.now() + (24 * 3600 * 1000),
      status: "PENDING"
    };

    apps.unshift(newApp);
    this.saveSadhanaRemedyApplications(apps);

    this.addNotification({
      id: "notif-sadh-new-" + Date.now(),
      recipientId: firstApprover.code || "ALL",
      type: "NEW_SADHANA_APPLICATION",
      title: `📿 New ${newApp.category || "Sadhana"} Initiation Request`,
      message: `${newApp.seekerName} requested initiation for "${newApp.itemTitle}". Assigned 1st Approver: ${firstApprover.name} (${firstApprover.role}). Target: ${newApp.targetMalas} Malas.`,
      timestamp: Date.now(),
      metadata: { appId: newApp.id, itemTitle: newApp.itemTitle, seekerName: newApp.seekerName, firstApprover: firstApprover.name, secondApprover: secondApprover.name }
    });

    if (typeof BroadcastChannel !== "undefined") {
      try {
        const syncChan = new BroadcastChannel("spiritual_karim_sync");
        syncChan.postMessage({
          type: "NEW_PENDING_APPROVAL",
          invite: newApp,
          data: newApp
        });
        syncChan.postMessage({
          type: "NEW_SADHANA_APPLICATION",
          data: newApp,
          invite: newApp
        });
      } catch (e) {}
    }

    return newApp;
  }

  saveSadhanaRemedyApplications(apps) {
    try {
      localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps));
      if (typeof BroadcastChannel !== "undefined") {
        try {
          const syncChan = new BroadcastChannel("spiritual_karim_sync");
          syncChan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED", count: apps.length });
        } catch (e) {}
      }
    } catch (e) {
      console.warn("saveSadhanaRemedyApplications error:", e);
    }
  }

  approveSadhanaRemedyApplication(appId, mentorNotes = "", adjustedMalas = null, adjustedSlot = null, operatorProfile = null) {
    const apps = this.getSadhanaRemedyApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) return null;

    const op = operatorProfile || this.getActiveProfile() || this.getOperatorProfile() || {};
    const opRole = (op.profileType || op.role || this.getRoleMode() || "MASTER").toUpperCase();
    const isMaster = opRole.includes("ADMIN") || opRole.includes("MASTER") || op.id === "prof-admin-01";
    const isHealer = opRole.includes("HEALER") || op.level === 2;

    if (adjustedMalas) app.targetMalas = Number(adjustedMalas);
    if (adjustedSlot) app.scheduleSlot = adjustedSlot;

    // 2-Tier Closed-Loop Approval State Machine:
    // Case 1: Stage 1 Approval by Certified Healer (1st Approver)
    if (isHealer && !isMaster && app.status !== "HEALER_VERIFIED") {
      app.status = "HEALER_VERIFIED";
      app.approvalStage = 2; // Advanced to Stage 2: Awaiting Master Sanction
      app.firstApproverStatus = "APPROVED";
      app.firstApprovedAtMs = Date.now();
      app.firstApprovedBy = op.name || app.firstApproverName || "Certified Healer";
      app.firstApproverCode = op.referenceCode || app.firstApproverCode;
      app.healerNotes = (mentorNotes || "Prescription validated. Recommended for initiation.").trim();
      app.mentorFeedback = app.healerNotes;

      this.saveSadhanaRemedyApplications(apps);

      this.addNotification({
        id: "notif-sadh-h-appr-" + Date.now(),
        recipientId: app.secondApproverCode || "SKHM-ADM1-7788-9900",
        type: "SADHANA_HEALER_VERIFIED",
        title: `🛡️ Stage 1 Verified: ${app.itemTitle} (${app.seekerName})`,
        message: `${op.name} has verified ${app.seekerName}'s application for "${app.itemTitle}". Awaiting Master Deeksha Sanction.`,
        timestamp: Date.now(),
        metadata: { appId: app.id, itemTitle: app.itemTitle, seekerName: app.seekerName, healer: op.name }
      });

      if (typeof BroadcastChannel !== "undefined") {
        try {
          const syncChan = new BroadcastChannel("spiritual_karim_sync");
          syncChan.postMessage({
            type: "SADHANA_HEALER_VERIFIED",
            data: { appId: app.id, seekerName: app.seekerName, itemTitle: app.itemTitle, healerName: op.name }
          });
          syncChan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED" });
        } catch (e) {}
      }

      return app;
    }

    // Case 2: Stage 2 Final Deeksha Sanction by Master (2nd Approver / Emergency Override)
    app.status = "APPROVED";
    app.approvalStage = 3; // Fully Completed
    app.secondApproverStatus = "APPROVED";
    app.secondApprovedAtMs = Date.now();
    app.secondApprovedBy = op.name || app.secondApproverName || "Spiritual Karim Khan";
    app.secondApproverCode = op.referenceCode || app.secondApproverCode;
    app.approvedAtMs = Date.now();

    if (!app.firstApprovedBy) {
      app.firstApproverStatus = "APPROVED (DIRECT)";
      app.firstApprovedBy = op.name || "Master Direct Sanction";
      app.firstApprovedAtMs = Date.now();
    }

    if (mentorNotes) {
      app.masterNotes = mentorNotes.trim();
      app.mentorFeedback = mentorNotes.trim();
    }
    if (!app.initiationToken) {
      app.initiationToken = "IN-" + (app.contextType === "remedy" ? "REMD" : "SADH") + "-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    this.saveSadhanaRemedyApplications(apps);

    // Update active sadhana in devotee profile
    const profile = this.profiles.find(p =>
      p.id === app.seekerId ||
      p.referenceCode === app.devoteeCode ||
      p.name === app.seekerName
    );

    if (profile) {
      if (!profile.traineeSadhanas && profile.activeSadhanas) {
        profile.traineeSadhanas = profile.activeSadhanas;
      }
      if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
      
      const existingPractice = profile.traineeSadhanas.find(s => s.id === (app.itemId || app.id));
      if (!existingPractice) {
        profile.traineeSadhanas.push({
          id: app.itemId || app.id,
          title: app.itemTitle,
          category: app.category || (app.contextType === "remedy" ? "Remedy & Upay" : "Sacred Sadhana"),
          status: "Active",
          targetMalas: app.targetMalas,
          cycleDays: app.cycleDays || 21,
          scheduleSlot: app.scheduleSlot,
          initiationToken: app.initiationToken,
          startDate: new Date().toISOString().split("T")[0],
          completedDays: 0,
          dailyMalasDone: 0,
          streakDays: 0,
          mentorCode: app.firstApproverCode || "SKHM-HLR2-5566-7788",
          mentorName: app.firstApproverName || "Maa Anandita Devi",
          mentorGuidance: mentorNotes || app.healerNotes || "Chant with focused devotion and maintain strict diet.",
          deekshaDate: new Date().toLocaleDateString()
        });
      } else {
        existingPractice.status = "Active";
        existingPractice.initiationToken = app.initiationToken;
        existingPractice.targetMalas = app.targetMalas;
        existingPractice.scheduleSlot = app.scheduleSlot;
        existingPractice.mentorGuidance = mentorNotes || existingPractice.mentorGuidance;
      }

      // Lineage Ascension: When a Devotee's initiation is approved, elevate to Level 3 Trainee Sadhak
      if (profile.level === 4 || (profile.profileType && profile.profileType.toUpperCase().includes("DEVOTEE"))) {
        profile.level = 3;
        profile.profileType = "TRAINEE";
        profile.assignedRole = "TRAINEE";
      }

      // Keep activeSadhanas array mirrored for complete backward compatibility
      profile.activeSadhanas = profile.traineeSadhanas;

      this.saveProfiles(this.profiles);
    }

    // Closed-Loop Information Exchange & Notification
    this.addNotification({
      id: "notif-sadh-appr-" + Date.now(),
      recipientId: app.devoteeCode || app.seekerId,
      type: "SADHANA_INITIATION_APPROVED",
      title: `📿 Deeksha & Initiation Granted: ${app.itemTitle}`,
      message: `Divine blessing! Initiation for ${app.itemTitle} sanctioned under 2-tier seal (1st: ${app.firstApprovedBy}, 2nd: ${app.secondApprovedBy}). Token: ${app.initiationToken}. Target: ${app.targetMalas} Malas (${app.scheduleSlot}).`,
      timestamp: Date.now(),
      metadata: {
        appId: app.id,
        itemTitle: app.itemTitle,
        initiationToken: app.initiationToken,
        targetMalas: app.targetMalas,
        scheduleSlot: app.scheduleSlot,
        firstApprover: app.firstApprovedBy,
        secondApprover: app.secondApprovedBy
      }
    });

    if (typeof BroadcastChannel !== "undefined") {
      try {
        const syncChan = new BroadcastChannel("spiritual_karim_sync");
        syncChan.postMessage({
          type: "SADHANA_INITIATION_APPROVED",
          data: {
            appId: app.id,
            seekerName: app.seekerName,
            itemTitle: app.itemTitle,
            initiationToken: app.initiationToken,
            targetMalas: app.targetMalas,
            firstApprover: app.firstApprovedBy,
            secondApprover: app.secondApprovedBy
          }
        });
        syncChan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED" });
      } catch (e) {}
    }

    return app;
  }

  requestRevisionSadhanaRemedy(appId, mentorNotes = "Adjustments required in practice schedule or sankalp.") {
    const apps = this.getSadhanaRemedyApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) return null;

    app.status = "REVISION_REQUIRED";
    app.mentorFeedback = mentorNotes.trim();
    app.updatedAtMs = Date.now();
    this.saveSadhanaRemedyApplications(apps);

    // Closed-Loop Notification
    this.addNotification({
      id: "notif-sadh-rev-" + Date.now(),
      recipientId: app.devoteeCode || app.seekerId,
      type: "SADHANA_REVISION_REQUESTED",
      title: `📝 Sadhana Revision Required: ${app.itemTitle}`,
      message: `Mentor guidance for your application: "${mentorNotes}". Please adjust your parameters in the Sadhana portal.`,
      timestamp: Date.now(),
      metadata: { appId: app.id, itemTitle: app.itemTitle, feedback: mentorNotes }
    });

    if (typeof BroadcastChannel !== "undefined") {
      try {
        const syncChan = new BroadcastChannel("spiritual_karim_sync");
        syncChan.postMessage({
          type: "SADHANA_REVISION_REQUESTED",
          data: { appId: app.id, seekerName: app.seekerName, notes: mentorNotes }
        });
      } catch (e) {}
    }

    return app;
  }

  rejectSadhanaRemedy(appId, reason = "Prerequisites incomplete or unsuited at this stage.") {
    const apps = this.getSadhanaRemedyApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) return null;

    app.status = "REJECTED";
    app.mentorFeedback = reason.trim();
    app.updatedAtMs = Date.now();
    this.saveSadhanaRemedyApplications(apps);

    // Closed-Loop Notification
    this.addNotification({
      id: "notif-sadh-rej-" + Date.now(),
      recipientId: app.devoteeCode || app.seekerId,
      type: "SADHANA_APPLICATION_REJECTED",
      title: `Application Update: ${app.itemTitle}`,
      message: `Initiation request not approved at this time. Reason: "${reason}". Please continue daily diya foundation.`,
      timestamp: Date.now(),
      metadata: { appId: app.id, itemTitle: app.itemTitle, reason }
    });

    if (typeof BroadcastChannel !== "undefined") {
      try {
        const syncChan = new BroadcastChannel("spiritual_karim_sync");
        syncChan.postMessage({
          type: "SADHANA_APPLICATION_REJECTED",
          data: { appId: app.id, seekerName: app.seekerName, reason }
        });
      } catch (e) {}
    }

    return app;
  }

  /**
   * Retrieves all Sadhana applications submitted by the given devotee/trainee.
   * Single Source of Truth: queries both pairing_invites and sadhana_initiations_v1 (deduped by id).
   */
  getMySadhanaApplications(profileOrCode = null) {
    return this._filterMyApplications(profileOrCode, 'sadhana');
  }

  /**
   * Retrieves all Remedy applications submitted by the given devotee/trainee.
   * Single Source of Truth: queries both pairing_invites and sadhana_initiations_v1 (deduped by id).
   */
  getMyRemedyApplications(profileOrCode = null) {
    return this._filterMyApplications(profileOrCode, 'remedy');
  }

  /**
   * Internal helper to filter applications by seeker profile and contextType.
   */
  _filterMyApplications(profileOrCode, targetType) {
    const activeProf = (typeof profileOrCode === 'object' && profileOrCode) 
      ? profileOrCode 
      : (typeof this.getActiveProfile === 'function' ? this.getActiveProfile() : null);

    const refCode = typeof profileOrCode === 'string' ? profileOrCode : (activeProf?.referenceCode || activeProf?.code || '');
    const profId = activeProf?.id || (typeof profileOrCode === 'string' ? profileOrCode : '');
    const seekerName = (activeProf?.name || '').trim().toLowerCase();

    // Pool from both sources
    const pool = new Map();

    // Source 1: sadhana_initiations_v1
    const sadhanaApps = typeof this.getSadhanaRemedyApplications === 'function' ? this.getSadhanaRemedyApplications() : [];
    sadhanaApps.forEach(app => {
      if (app && app.id) pool.set(app.id, app);
    });

    // Source 2: pairing_invites
    const pairingInvites = typeof this.getPairingInvites === 'function' ? this.getPairingInvites() : [];
    pairingInvites.forEach(inv => {
      if (inv && inv.id && (inv.type === 'SADHANA_APPLICATION' || inv.type === 'REMEDY_APPLICATION' || inv.contextType === 'sadhana' || inv.contextType === 'remedy')) {
        if (!pool.has(inv.id)) {
          pool.set(inv.id, inv);
        }
      }
    });

    const allApps = Array.from(pool.values());

    return allApps.filter(app => {
      // Check type match
      const isRemedy = app.type === 'REMEDY_APPLICATION' || app.contextType === 'remedy' || (app.category && app.category.toLowerCase().includes('remedy'));
      const isSadhana = !isRemedy && (app.type === 'SADHANA_APPLICATION' || app.contextType === 'sadhana' || (app.category && !app.category.toLowerCase().includes('remedy')));

      if (targetType === 'remedy' && !isRemedy) return false;
      if (targetType === 'sadhana' && !isSadhana) return false;

      // If no filter supplied and no active prof, return all
      if (!refCode && !profId && !seekerName) return true;

      // Match devotee
      const appDevCode = (app.devoteeCode || app.sponsorCode || '').trim().toLowerCase();
      const appSeekerId = (app.seekerId || app.applicantId || '').trim().toLowerCase();
      const appSeekerName = (app.seekerName || app.applicantName || '').trim().toLowerCase();

      const matchRef = refCode && appDevCode === refCode.trim().toLowerCase();
      const matchId = profId && appSeekerId === profId.trim().toLowerCase();
      const matchName = seekerName && appSeekerName === seekerName;

      return Boolean(matchRef || matchId || matchName);
    }).sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
  }

  resendPairingInvite(inviteId) {
    const invites = this.getPairingInvites();
    const item = invites.find((i) => i.id === inviteId);
    if (item) {
      const maxResubmits = this.settings.maxInviteResubmits || 3;
      if ((item.resendCount || 0) >= maxResubmits) {
        return {
          error: true,
          message: `Maximum renewal limit (${maxResubmits} resubmits) reached for this invitation. Please create a new invitation link.`,
        };
      }

      // Exponential Backoff Check
      const cooldownSecs = this.getResendCooldownRemaining(item);
      if (cooldownSecs > 0) {
        return {
          error: true,
          message: `Resend rate-limited. Please wait ${cooldownSecs} seconds before requesting another token.`,
          remainingSecs: cooldownSecs,
        };
      }

      const expiryHours = this.settings.inviteExpiryHours || 24;
      item.createdAtMs = Date.now();
      item.expiresAtMs = Date.now() + expiryHours * 60 * 60 * 1000;
      item.status = "PENDING";
      item.resendCount = (item.resendCount || 0) + 1;
      item.lastResendTimestamp = Date.now();
      item.formattedCreatedTime = "Just Now (Refreshed)";
      this.savePairingInvites(invites);

      this.logDeviceEvent(
        item.hardwareNonce || item.id,
        "PAIRING_RESENT",
        `24-Hour window refreshed for "${item.seekerName}" (Attempt #${item.resendCount})`,
        item,
      );
      return item;
    }
    return null;
  }

  /**
   * Calculates Summary Metrics matching Android Compose HealersHubScreen
   */
  getSummaryMetrics(scopedList = null) {
    const list = scopedList || this.profiles;
    return {
      total: list.length,
      admin: list.filter((p) => p.profileType === "ADMIN" || p.level === 1)
        .length,
      healers: list.filter(
        (p) => p.profileType === "HEALER" || p.level === 2 || p.level === 3,
      ).length,
      trainees: list.filter((p) => p.profileType === "TRAINEE" || p.level === 4)
        .length,
      devotees: list.filter((p) => p.profileType === "DEVOTEE" || p.level === 5)
        .length,
    };
  }

  /**
   * Returns Role-Scoped Relevant Profiles matching Android RBAC logic
   */
  getScopedProfiles(roleMode = null, activeProfile = null) {
    const role = roleMode || this.getRoleMode();
    const active = activeProfile || this.getActiveProfile();

    if (role === "MASTER" || role === "ADMIN") {
      // Top can see all bottoms
      return this.profiles;
    }

    if (role === "HEALER") {
      // Healer sees self + all downlines below them. Bottom cannot see Level 1 Founder Master.
      const refCode = active.referenceCode || "";
      const downlineCodes = new Set([refCode]);
      let added = true;
      while (added) {
        added = false;
        for (const p of this.profiles) {
          if (
            p.referredByCode &&
            downlineCodes.has(p.referredByCode) &&
            !downlineCodes.has(p.referenceCode)
          ) {
            downlineCodes.add(p.referenceCode);
            added = true;
          }
        }
      }
      return this.profiles.filter(
        (p) => p.id === active.id || downlineCodes.has(p.referenceCode),
      );
    }

    if (role === "TRAINEE") {
      // Trainee sees self + all downlines below them. Bottom cannot see Level 1..3 uplines.
      const refCode = active.referenceCode || "";
      const downlineCodes = new Set([refCode]);
      let added = true;
      while (added) {
        added = false;
        for (const p of this.profiles) {
          if (
            p.referredByCode &&
            downlineCodes.has(p.referredByCode) &&
            !downlineCodes.has(p.referenceCode)
          ) {
            downlineCodes.add(p.referenceCode);
            added = true;
          }
        }
      }
      return this.profiles.filter(
        (p) => p.id === active.id || downlineCodes.has(p.referenceCode),
      );
    }

    if (role === "DEVOTEE") {
      // Devotee sees self + direct downlines. Cannot see higher upline levels.
      const refCode = active.referenceCode || "";
      return this.profiles.filter(
        (p) => p.id === active.id || p.referredByCode === refCode,
      );
    }

    return this.profiles;
  }

  /**
   * Bi-Directional Firebase Realtime Database Synchronization
   */
  async fetchFromFirebaseRealtime() {
    const firebaseUrl =
      this.settings?.firebaseUrl ||
      "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/";
    try {
      const resp = await fetch(
        `${firebaseUrl.replace(/\/$/, "")}/profiles.json`,
      );
      if (resp.ok) {
        const cloudData = await resp.json();
        if (cloudData && typeof cloudData === "object") {
          const remoteList = Object.values(cloudData);
          if (remoteList.length > 0) {
            let updated = false;
            remoteList.forEach((rp) => {
              const idx = this.profiles.findIndex(
                (p) => p.id === rp.id || p.referenceCode === rp.referenceCode,
              );
              if (idx === -1) {
                this.profiles.push(rp);
                updated = true;
              } else {
                this.profiles[idx] = { ...this.profiles[idx], ...rp };
                updated = true;
              }
            });
            if (updated) {
              this.saveProfiles(this.profiles);
            }
          }
        }
      }

      // Live 2-way sync for pairing_invites from online submissions
      const invitesResp = await fetch(
        `${firebaseUrl.replace(/\/$/, "")}/pairing_invites.json`,
      );
      if (invitesResp.ok) {
        const cloudInvites = await invitesResp.json();
        if (cloudInvites && typeof cloudInvites === "object") {
          const remoteInvites = Object.values(cloudInvites);
          if (remoteInvites.length > 0) {
            const currentInvites = this.getPairingInvites();
            let changed = false;
            remoteInvites.forEach((ri) => {
              if (!ri || !ri.id) return;
              const idx = currentInvites.findIndex(
                (ci) => ci.id === ri.id || (ri.devoteeCode && ci.devoteeCode === ri.devoteeCode),
              );
              if (idx === -1) {
                currentInvites.unshift(ri);
                changed = true;
              } else if (ri.status !== currentInvites[idx].status || (ri.submittedAt && (!currentInvites[idx].submittedAt || ri.submittedAt > currentInvites[idx].submittedAt))) {
                currentInvites[idx] = { ...currentInvites[idx], ...ri };
                changed = true;
              }
            });
            if (changed) {
              this.savePairingInvites(currentInvites);
            }
          }
        }
      }
    } catch (e) {
      console.warn("Firebase RTDB sync notice:", e.message);
    }
  }

  async pushProfileToFirebase(profile) {
    if (!profile) return;
    const firebaseUrl =
      this.settings?.firebaseUrl ||
      "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/";
    const nodeKey = (
      profile.id ||
      profile.referenceCode ||
      "prof-" + Date.now()
    ).replace(/[^a-zA-Z0-9_-]/g, "_");
    try {
      if (navigator.onLine) {
        await fetch(
          `${firebaseUrl.replace(/\/$/, "")}/profiles/${nodeKey}.json`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile),
          },
        );
      }
    } catch (e) {
      this._enqueueOfflineSync("PROFILE_PUT", { key: nodeKey, profile });
    }
  }

  // -------------------------------------------------------------
  // FIREBASE REALTIME DATABASE TREE & DATA PROVIDER METHODS
  // -------------------------------------------------------------
  getFirebaseRealtimeTree() {
    const profilesMap = {};
    const authorisedNodesMap = {};
    const telemetryMap = {};

    const calculateDescendants = (refCode) => {
      const descendants = [];
      const queue = [refCode];
      const visited = new Set([refCode]);
      while (queue.length > 0) {
        const currentCode = queue.shift();
        const children = this.profiles.filter(
          (p) => p.referredByCode === currentCode,
        );
        for (const child of children) {
          if (!visited.has(child.referenceCode)) {
            visited.add(child.referenceCode);
            descendants.push(child.referenceCode);
            queue.push(child.referenceCode);
          }
        }
      }
      return descendants;
    };

    this.profiles.forEach((p) => {
      const code = p.referenceCode || p.id;
      const directDownlines = this.profiles
        .filter((c) => c.referredByCode === code)
        .map((c) => c.referenceCode);
      const allDescendants = calculateDescendants(code);

      // Average House Clean % calculation
      let avgHouseCleanPct = 0;
      if (p.houseCleanLevels && p.houseCleanLevels.length > 0) {
        const total = p.houseCleanLevels.reduce(
          (acc, h) => acc + (Number(h.cleanPercentage) || 0),
          0,
        );
        avgHouseCleanPct = Math.round(total / p.houseCleanLevels.length);
      } else {
        avgHouseCleanPct =
          p.level === 1 ? 100 : p.level === 2 ? 95 : p.level === 3 ? 75 : 45;
      }

      profilesMap[code] = {
        id: p.id,
        referenceCode: p.referenceCode,
        referredByCode: p.referredByCode || "ROOT-0000-0000-0000",
        transferredCode: p.transferredCode || "",
        name: p.name || "Seeker",
        phone: p.phone || "+91 98765 43210",
        email: p.email || "user@spiritualkarim.org",
        profileType: p.profileType || "DEVOTEE",
        level: p.level || 1,
        status: p.isActive !== false ? "ACTIVE" : "INACTIVE",
        paymentStatus: p.paymentStatus || (p.isPaid ? "PAID" : "FREE"),
        city: p.city || "Varanasi",
        address: p.address || "",
        objective: p.objective || "",
        categoryTag: p.categoryTag || "",
        selectedRemedies: p.selectedRemedies || [],
        interestedSadhanas: p.interestedSadhanas || [],
        houseCleanLevels: p.houseCleanLevels || [],
        traineeSadhanas: p.traineeSadhanas || [],
        healerCompletedSadhanas: p.healerCompletedSadhanas || [],
        healerNetwork: p.healerNetwork || [],
        lineage: p.lineage || {},
        seekerDiagnostics: p.seekerDiagnostics || {},
        joinDate: p.joinDate || "2024-01-01",
        connectedDownlines: directDownlines,
        connectedDownlineCount: directDownlines.length,
        connectedDescendantsCount: allDescendants.length,
      };

      authorisedNodesMap[code] = {
        referenceCode: p.referenceCode,
        sponsorCode: p.referredByCode || "ROOT-0000-0000-0000",
        role: p.profileType || "DEVOTEE",
        level: p.level || 1,
        status: p.isActive !== false ? "ACTIVE" : "INACTIVE",
        deviceFingerprintHash:
          "HASH_" + (p.referenceCode || "").replace(/[^A-Z0-9]/g, "").slice(-8),
        houseCleanPct: avgHouseCleanPct,
        japaCount:
          p.level === 1
            ? 108000
            : p.level === 2
              ? 54000
              : p.level === 3
                ? 21000
                : 4500,
        connectedDownlines: directDownlines,
        connectedDownlineCount: directDownlines.length,
        connectedDescendantsCount: allDescendants.length,
        lastSeenTimestamp: Date.now() - Math.floor(Math.random() * 1800000),
        lastHeartbeat: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      telemetryMap[code] = {
        referenceCode: p.referenceCode,
        batteryLevel: Math.floor(70 + Math.random() * 30),
        deviceModel:
          p.level === 1
            ? "Pixel 8 Pro (Founder Edition)"
            : p.level === 2
              ? "Samsung Galaxy S24 Ultra"
              : p.level === 3
                ? "OnePlus 12"
                : "Xiaomi 14",
        osVersion: "Android 14 (API 34)",
        lastSyncTimestamp: new Date().toISOString(),
        networkStatus: "WIFI_5GHZ_ONLINE",
        appVersion: "3.2.0-PROD",
      };
    });

    const lineageGraph = {
      rootCode: "SKHM-ADM1-7788-9900",
      masterNodes: this.profiles
        .filter((p) => p.profileType === "ADMIN" || p.level === 1)
        .map((p) => p.referenceCode),
      healerNodes: this.profiles
        .filter((p) => p.profileType === "HEALER" || p.level === 2)
        .map((p) => p.referenceCode),
      traineeNodes: this.profiles
        .filter((p) => p.profileType === "TRAINEE" || p.level === 3)
        .map((p) => p.referenceCode),
      devoteeNodes: this.profiles
        .filter((p) => p.profileType === "DEVOTEE" || p.level >= 4)
        .map((p) => p.referenceCode),
    };

    return {
      profiles: profilesMap,
      authorisedNodes: authorisedNodesMap,
      sadhana_catalog: this.getSadhanaCatalog(),
      device_telemetry: telemetryMap,
      pairing_invites: {
        "INV-882194": {
          inviteCode: "INV-882194",
          sponsorCode: "SKHM-ADM1-7788-9900",
          seekerName: "Rajesh Kumar (Seeker)",
          seekerPhone: "+91 98200 11223",
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          status: "PENDING_APPROVAL",
          createdAt: new Date().toISOString(),
        },
        "INV-449102": {
          inviteCode: "INV-449102",
          sponsorCode: "SKHM-HLR2-3344-5566",
          seekerName: "Amitabh Sen (Trainee)",
          seekerPhone: "+91 98450 77889",
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          status: "PAIRED_CONFIRMED",
          createdAt: new Date().toISOString(),
        },
      },
      system_config: this.settings,
      lineage_graph: lineageGraph,
      logs: [
        {
          id: "LOG-001",
          action: "FIREBASE_RTDB_SYNC_INIT",
          timestamp: Date.now() - 3600000,
          severity: "INFO",
          source: "AdminConsole",
        },
        {
          id: "LOG-002",
          action: "HEALER_CERTIFICATE_VERIFIED",
          timestamp: Date.now() - 1800000,
          severity: "SUCCESS",
          source: "AuthEngine",
        },
        {
          id: "LOG-003",
          action: "DEVICE_24H_PAIRING_REQUEST",
          timestamp: Date.now() - 600000,
          severity: "WARN",
          source: "MobileClient",
        },
        {
          id: "LOG-004",
          action: "SADHANA_STREAK_CHECK",
          timestamp: Date.now() - 120000,
          severity: "INFO",
          source: "SchedulerDaemon",
        },
      ],
    };
  }

  getRealtimeNodeByPath(pathStr) {
    const tree = this.getFirebaseRealtimeTree();
    if (!pathStr || pathStr === "/" || pathStr === "") return tree;
    const parts = pathStr.replace(/^\/+/, "").split("/");
    let curr = tree;
    for (const p of parts) {
      if (curr && typeof curr === "object" && p in curr) {
        curr = curr[p];
      } else {
        return null;
      }
    }
    return curr;
  }

  setRealtimeNodeByPath(pathStr, newVal) {
    if (!pathStr || pathStr === "/" || pathStr === "") return false;
    const parts = pathStr.replace(/^\/+/, "").split("/");
    const rootKey = parts[0];

    // If updating system_config, update settings
    if (rootKey === "system_config") {
      if (parts.length === 1) {
        this.settings = { ...this.settings, ...newVal };
      } else {
        this.settings[parts[1]] = newVal;
      }
      this.saveSettings(this.settings);
      return true;
    }

    // If updating profiles
    if (rootKey === "profiles" && parts.length >= 2) {
      const targetCode = parts[1];
      const targetProf = this.profiles.find(
        (p) => p.referenceCode === targetCode || p.id === targetCode,
      );
      if (targetProf) {
        if (parts.length === 2 && typeof newVal === "object") {
          Object.assign(targetProf, newVal);
        } else if (parts.length === 3) {
          targetProf[parts[2]] = newVal;
        }
        this._saveProfiles();
        return true;
      }
    }

    return true;
  }

  deleteRealtimeNodeByPath(pathStr) {
    if (!pathStr || pathStr === "/") return false;
    const parts = pathStr.replace(/^\/+/, "").split("/");
    const rootKey = parts[0];

    if (rootKey === "profiles" && parts.length === 2) {
      const targetCode = parts[1];
      const idx = this.profiles.findIndex(
        (p) => p.referenceCode === targetCode || p.id === targetCode,
      );
      if (idx > -1 && this.profiles.length > 1) {
        this.profiles.splice(idx, 1);
        this._saveProfiles();
        return true;
      }
    }
    return true;
  }

  _saveProfiles() {
    return this.saveProfiles(this.profiles);
  }

  getProfiles() {
    return Array.isArray(this.profiles) ? this.profiles : [];
  }

  getAllProfiles() {
    return this.getProfiles();
  }

  // ==============================================================
  // INTERACTIVE COMPONENT STATES (Switches, Toggles, Preferences)
  // ==============================================================
  getComponentStates() {
    try {
      const raw = localStorage.getItem("sk_component_states_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Error reading sk_component_states_v1:", e);
    }
    return {
      telemetrySync: true,
      directoryViewMode: "cards",
      backgroundSync: true,
      audioFeedback: false
    };
  }

  saveComponentState(key, value) {
    if (!key) return;
    const states = this.getComponentStates();
    states[key] = value;
    states.lastUpdated = Date.now();

    try {
      localStorage.setItem("sk_component_states_v1", JSON.stringify(states));
    } catch (e) {
      console.error("Error saving sk_component_states_v1:", e);
    }

    // Cross-tab broadcast notification
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const bc = new BroadcastChannel("spiritual_karim_sync");
        bc.postMessage({ type: "COMPONENT_STATE_UPDATED", key, value, states });
      } catch (e) {}
    }

    // Cloud dual-write via REST API or FirebaseSyncEngine
    if (typeof fetch !== "undefined") {
      fetch("/api/component-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(states)
      }).catch(() => {});
    }

    if (typeof FirebaseSyncEngine !== "undefined" && FirebaseSyncEngine.pushNode) {
      FirebaseSyncEngine.pushNode("component_states", states);
    }

    return states;
  }

  saveComponentStates(newStates) {
    if (!newStates || typeof newStates !== "object") return;
    const current = this.getComponentStates();
    const merged = Object.assign({}, current, newStates, { lastUpdated: Date.now() });

    try {
      localStorage.setItem("sk_component_states_v1", JSON.stringify(merged));
    } catch (e) {
      console.error("Error saving sk_component_states_v1:", e);
    }

    if (typeof BroadcastChannel !== "undefined") {
      try {
        const bc = new BroadcastChannel("spiritual_karim_sync");
        bc.postMessage({ type: "COMPONENT_STATE_UPDATED", states: merged });
      } catch (e) {}
    }

    if (typeof fetch !== "undefined") {
      fetch("/api/component-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged)
      }).catch(() => {});
    }

    return merged;
  }

  // ==============================================================
  // SADHANA CATALOG & REMEDIES
  // ==============================================================
  _getDefaultSadhanaCatalog() {
    return {
      sri_yantra: {
        id: "sri_yantra",
        title: "Sri Yantra Sadhana",
        category: "Sacred Sadhana",
        domain: "sadhanas",
        icon: "🔯",
        levelScope: "Level 1–4",
        summary: "Supreme Tantric Sadhana for divine wealth, material elevation, third-eye awakening, and cosmic geometric alignment.",
        mantra: "ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ",
        timing: "Brahma Muhurta (04:00 AM – 06:00 AM) or Dusk Sandhya",
        aasanDirection: "Yellow / Red Silk Aasan, East Facing",
        ingredients: "Pure Copper or Silver Meru Sri Yantra, Pure Cow Ghee Diya, Lotus Seed Mala (Kamalgatta), Saffron, Fresh Lotus Flowers.",
        steps: [
          "Perform Aachaman and purify the prayer altar with Gangajal.",
          "Place Sri Yantra upon a clean copper plate over a bed of raw unblemished rice.",
          "Light the Cow Ghee Diya and perform 5 minutes of focused Trataka (gazing at the central Bindu of the Sri Yantra).",
          "Chant 11 or 21 Malas of the Maha Lakshmi Beej Mantra with undivided concentration.",
          "Conclude with Shree Suktam recital and offer saffron milk bhog."
        ],
        benefits: "Eliminates acute financial blockages, unlocks business prosperity, balances the Ajna chakra, and radiates high-frequency divine aura.",
        cautions: "Maintain strict Satvik diet, celibacy during anushthan days, and never point feet towards the Sri Yantra."
      },
      kalashtami: {
        id: "kalashtami",
        title: "Kalashtami Bhairav Sadhana",
        category: "Sacred Sadhana",
        domain: "sadhanas",
        icon: "🔱",
        levelScope: "Level 1–4",
        summary: "Kaal Bhairav Sadhana for overcoming intense fear, black magic attacks, evil eye, and court/police obstacles.",
        mantra: "ॐ भ्रं कालभैरवाय फट् ॥ ॐ ह्रीं बटुकाय आपदुद्धारणाय कुरु कुरु बटुकाय ह्रीं ॐ स्वाहा ॥",
        timing: "Night Sandhya (09:00 PM – Midnight) on Krishna Paksha Ashtami (Kalashtami)",
        aasanDirection: "Black or Dark Woolen Aasan, South or North Facing",
        ingredients: "Mustard Oil (Sarson) Diya, Black Sesame Seeds (Til), Urad Dal, Kaal Bhairav Yantra, Rudraksha Mala.",
        steps: [
          "Cleanse yourself and sit on the woolen aasan facing South/North.",
          "Light a large 4-wick Mustard Oil lamp in front of Kaal Bhairav image or idol.",
          "Offer black sesame seeds, raw jaggery, and red flowers to Lord Bhairav.",
          "Chant 11 Malas of the Bhairav Beej Mantra using a consecrated Rudraksha Mala.",
          "Recite Kaal Bhairav Ashtakam with devotion and burn camphor & loban."
        ],
        benefits: "Impenetrable astral shield against paranormal disturbances, removal of enemy hostility, and destruction of deep-seated phobias.",
        cautions: "Requires fearless mental disposition; perform only with pure protective intent."
      },
      navratri: {
        id: "navratri",
        title: "Navratri Chamunda Sadhana",
        category: "Sacred Sadhana",
        domain: "sadhanas",
        icon: "⚔️",
        levelScope: "Level 1–4",
        summary: "9-Day Intense Navratri Anushthan invoking Maa Chamunda and Durga for supreme Shakti activation and curse removal.",
        mantra: "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥",
        timing: "Dawn and Twilight Sandhya during 9 days of Navratri",
        aasanDirection: "Red Woolen / Silk Aasan, North-East Facing",
        ingredients: "Akhand Jyoti Diya, Navarna Yantra, Fresh Hibiscus Flowers, Clove Pairs, Camphor, Havan Kund.",
        steps: [
          "Establish Kalash and light the Akhand Jyoti on Pratipada.",
          "Recite Durga Saptashati chapters sequentially each day.",
          "Chant 108 Malas of the Navarna Mantra daily with dedicated focus.",
          "Perform daily evening havan offering 108 ahutis with cloves, ghee, and sacred havan samagri.",
          "Perform Kanya Pujan and Brahman bhojan on Navami day."
        ],
        benefits: "Total destruction of lingering generational curses, awakening of inner courage, and immense divine grace of the Divine Mother.",
        cautions: "Strict fasting or single Satvik meal, complete mental purity, and no footwear in prayer zone."
      },
      diwali: {
        id: "diwali",
        title: "Diwali Sadhana Week",
        category: "Sacred Sadhana",
        domain: "sadhanas",
        icon: "✨",
        levelScope: "Level 1–4",
        summary: "7-Night festive sadhana bridging Dhanteras, Kali Chaudas, Diwali, and Govardhan Puja for boundless abundance.",
        mantra: "ॐ ह्रीं श्रीं क्रीं क्लीं श्रीं लक्ष्मी मम गृहे धनं पूरय पूरय चिंताएं दूरय दूरय स्वाहा ॥",
        timing: "Maha Nishita Kaal (11:40 PM – 12:30 AM) on Diwali Night",
        aasanDirection: "Yellow Velvet Aasan, North Facing (Kuber Direction)",
        ingredients: "Silver Lakshmi-Ganesh Coins, Lotus Flowers, Kuber Yantra, 21 Ghee Diyas, Pure Saffron, Kamalgatta Mala.",
        steps: [
          "Commence on Dhanteras by purifying the cash safe/altar with rose water and salt.",
          "On Kali Chaudas, perform evening negativity banishing with 3 mustard oil lamps.",
          "On Diwali night, perform Lakshmi-Kuber Maha Abhishek and light 21 lamps.",
          "Perform continuous Jaap of Lakshmi Beej for 3 hours during Nishita Kaal.",
          "Tie 5 energized Gomti Chakras and yellow cowries in a red cloth and place in treasury."
        ],
        benefits: "Guarantees uninterrupted financial stability for the upcoming year and opens blocked career channels.",
        cautions: "Keep the home impeccably clean and free of broken glass or iron clutter."
      },
      three_diya: {
        id: "three_diya",
        title: "Three Diya Process",
        category: "Divine Remedy",
        domain: "remedies",
        icon: "🪔",
        levelScope: "Level 1–3",
        summary: "Signature 21-Day Fire Cleansing Remedy designed by Spiritual Karim to burn stagnant domestic negativity and astral heaviness.",
        mantra: "ॐ नमः शिवाय ॥ (108 chants while lighting the lamps)",
        timing: "Exact Dusk Sunset Window (Godhuli Bela)",
        aasanDirection: "Main Entrance Doorway / Threshold Facing Outwards",
        ingredients: "3 Clay Clay/Earthen Diyas (Mitti ke Diye), Pure Mustard Oil, Thick Cotton Wicks, Sea Salt Water.",
        steps: [
          "Wash and mop the main entryway floor with sea-salt water 15 minutes before sunset.",
          "Fill 3 fresh earthen lamps with mustard oil and insert cotton wicks.",
          "Place the 3 lamps in a triangular formation directly at the main entrance doorway threshold facing outside.",
          "Light each lamp while mentally chanting Om Namah Shivaya and praying for all negative energies to exit.",
          "Let the lamps extinguish naturally; repeat daily for 21 consecutive days without break."
        ],
        benefits: "Disperses chronic family disputes, removes negative entity attachments from house walls, and brings immediate peace.",
        cautions: "Do not blow out the lamps; never reuse the clay lamps if cracked."
      },
      trilok_nagri: {
        id: "trilok_nagri",
        title: "Trilok Nagri Access",
        category: "Divine Remedy",
        domain: "remedies",
        icon: "🌐",
        levelScope: "Level 1–3",
        summary: "Higher dimensional meditation portal connecting seeker consciousness to astral masters and ancestral protectors.",
        mantra: "ॐ त्रिलोकपालकाय विद्महे दिव्यदृष्टये धीमहि तन्नो गुरुः प्रचोदयात् ॥",
        timing: "Midnight Sandhya or Pre-Dawn 03:30 AM",
        aasanDirection: "White Silk Aasan, North-East Facing",
        ingredients: "Crystal Sphatik Mala, White Sandalwood Paste, Himalayan Rock Crystal, Pure Rose Water.",
        steps: [
          "Sit in Padmasana or Sukhasana with spine completely upright.",
          "Apply white sandalwood at the Third Eye (Ajna Chakra) point.",
          "Hold the Sphatik mala and align breath with deep 4-7-8 rhythmic breathing.",
          "Chant the Trilok Mantra 108 times while visualizing a radiant golden beam descending through the crown chakra.",
          "Remain in silent witnessing state for 15 minutes."
        ],
        benefits: "Enhances intuitive perception, prophetic dreaming, and direct energetic connection with guru guidance.",
        cautions: "Perform only with grounded mind; ground yourself with water post-meditation."
      },
      court_cases: {
        id: "court_cases",
        title: "Court Cases Remedy (Clove & Cardamom Havan)",
        category: "Divine Remedy",
        domain: "remedies",
        icon: "⚖️",
        levelScope: "Level 1–3",
        summary: "Fire ritual employing consecrated Clove (Laung) and Green Cardamom (Elaichi) to resolve unjust legal battles and disputes.",
        mantra: "ॐ ह्रीं बगलामुखि सर्वदुष्टानां वाचं मुखं पदं स्तम्भय जिह्वां कीलय बुद्धिं विनाशय ह्रीं ॐ स्वाहा ॥",
        timing: "Tuesday or Saturday Sunset",
        aasanDirection: "Yellow Aasan, East Facing",
        ingredients: "108 Intact Cloves (with heads), 108 Green Cardamoms, Pure Cow Ghee, Dry Coconut (Gola), Black Mustard Seeds.",
        steps: [
          "Set up a small copper havan kund with dry mango wood and camphor.",
          "Ignite the sacred fire with pure cow ghee.",
          "Dip pairs of cloves and cardamoms in pure ghee.",
          "Chant the Baglamukhi Beej Mantra and offer 108 ahutis into the sacred fire.",
          "Pray for truth to prevail and favorable legal resolution."
        ],
        benefits: "Stops malicious legal conspiracies, calms opposing parties, and hastens stalled court settlements.",
        cautions: "Must only be performed for rightful and genuine cases, never for harming innocents."
      },
      business_money: {
        id: "business_money",
        title: "Business & Wealth Upaya (Silver Diya Remedy)",
        category: "Divine Remedy",
        domain: "remedies",
        icon: "🪙",
        levelScope: "Level 1–3",
        summary: "Sacred Silver Lamp Prosperity Protocol to unblock stuck payments, revive falling business revenues, and attract wealth.",
        mantra: "ॐ श्रीं ह्रीं क्लीं श्री सिद्ध लक्ष्म्यै नमः ॥",
        timing: "Friday Morning during Shukla Paksha",
        aasanDirection: "Yellow Silk Aasan, North Facing at Cash Counter / Altar",
        ingredients: "Pure Silver Diya, Cow Ghee, 2 Intact Cloves, Camphor Tablet, Yellow Cloth, Consecrated Sri Yantra.",
        steps: [
          "Thoroughly clean the commercial shop/office altar or home cash locker.",
          "Place a yellow cloth and set the Silver Diya upon a small silver/brass plate.",
          "Fill the silver lamp with pure cow ghee and insert 2 clove heads into the ghee.",
          "Light the lamp and chant the Siddha Lakshmi Mantra 108 times.",
          "Circulate the lamp smoke (Aarti) around the cash drawer and entry threshold."
        ],
        benefits: "Dissolves financial stagnation, clears payment backlogs, and ensures steady growth of trade and wealth.",
        cautions: "Ensure cloves placed in the ghee are unbroken."
      },
      negativity: {
        id: "negativity",
        title: "Negativity Cleansing (Bakhoor & Loban Fumigation)",
        category: "Cleansing & Healing",
        domain: "cleansing",
        icon: "💨",
        levelScope: "Level 1–3",
        summary: "Traditional aromatic smoke ritual utilizing Himalayan Bakhoor, Loban, and Guggul to detoxify household energetic fields.",
        mantra: "ॐ अपसर्पन्तु ते भूता ये भूता भूमि संस्थिताः। ये भूता विघ्नकर्तारस्ते नश्यन्तु शिवाज्ञया॥",
        timing: "Every Tuesday and Saturday at Twilight Dusk",
        aasanDirection: "Whole House Cleanse (Room by Room from East to West)",
        ingredients: "Authentic Spiritual Karim Himalayan Bakhoor, Raw Loban Resin, Guggul, Hot Cow Dung Coal (Kanda) / Charcoal, Brass Dhuna.",
        steps: [
          "Ignite natural charcoal or cow dung cake in a brass fumigation burner (Dhuna).",
          "Sprinkle pure Bakhoor and Loban powder over the burning embers.",
          "Carry the dense fragrant smoke into every room, corner, behind doors, and beneath beds.",
          "Chant the cleansing mantra or play Mahamrityunjaya jaap continuously during fumigation.",
          "Open windows slightly afterwards to allow displaced heavy energies to vacate."
        ],
        benefits: "Instantly breaks heavy astral stagnation, eliminates recurring bad dreams, and restores sweet tranquil household vibes.",
        cautions: "Do not inhale smoke directly; handle hot charcoal with tongs."
      },
      kundalini: {
        id: "kundalini",
        title: "Kundalini & Spiritual Progress",
        category: "Cleansing & Healing",
        domain: "cleansing",
        icon: "🧘",
        levelScope: "Level 1–4",
        summary: "Chakra purification and vital energy elevation method guided by Mentor Karim for safe Kundalini awakening.",
        mantra: "ॐ सोऽहं हंसः ॥ ॐ ऐं ह्रीं श्रीं मत्संसारतारिण्यै नमः ॥",
        timing: "Early Dawn (Brahma Muhurta 04:30 AM)",
        aasanDirection: "Kusha Grass Aasan covered with Wool, East Facing",
        ingredients: "Copper Water Vessel, Consecrated Rudraksha Mala, Ghee Lamp.",
        steps: [
          "Sit straight in Siddhasana with spine completely aligned.",
          "Perform 10 minutes of Nadi Shodhana Pranayama to balance Ida and Pingala nadis.",
          "Focus attention at the Mooladhara Chakra and visualize crimson radiant light.",
          "Mentally chant the seed sounds while gently drawing the energy up through Sushumna to Sahasrara.",
          "Drink energized copper water upon concluding."
        ],
        benefits: "Calms hyperactive nervous system, sharpens memory and mental clarity, and ignites spiritual ascension.",
        cautions: "Do not force breath retention; proceed gradually under guru guidance."
      },
      material_benefits: {
        id: "material_benefits",
        title: "Material & Karmic Benefits",
        category: "Cleansing & Healing",
        domain: "cleansing",
        icon: "💎",
        levelScope: "Level 1–3",
        summary: "Karmic debt resolution ritual for dissolving Pitru Dosha, planetary afflictions (Grah Dosha), and chronic bad luck.",
        mantra: "ॐ पितृभ्यो नमः ॥ ॐ सूर्याय नमः ॥",
        timing: "Amavasya (New Moon) or Sunday Dawn",
        aasanDirection: "White Cotton Aasan, South-Facing for Pitru, East for Surya",
        ingredients: "Black Sesame Seeds, Raw Milk, Kheer (Rice Pudding), Black Urad, Copper Lota with Gangajal.",
        steps: [
          "Offer Arghya to Lord Surya at dawn using water mixed with red flowers and jaggery.",
          "Prepare sweet rice kheer and offer 5 portions on banana leaf for crows, cows, dogs, and ants.",
          "Offer Tarpan with water and black sesame seeds facing South direction.",
          "Perform 108 Mahamrityunjaya chants dedicated to the peace of ancestors.",
          "Donate food or blankets to needy individuals."
        ],
        benefits: "Releases heavy ancestral blockages, restores health in family, and blesses future generations with prosperity.",
        cautions: "Do not consume non-satvik food on Amavasya day."
      },
      healing: {
        id: "healing",
        title: "Spiritual Healing from Illness",
        category: "Cleansing & Healing",
        domain: "cleansing",
        icon: "🌿",
        levelScope: "Level 1–3",
        summary: "Pranic healing and energized holy water ritual to relieve chronic ailments, stress exhaustion, and low vital immunity.",
        mantra: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥",
        timing: "Daily Morning at Sunrise",
        aasanDirection: "Green / White Silk Aasan, North-East Facing",
        ingredients: "Pure Copper Glass with Spring Water, 5 Fresh Tulsi Leaves, Ghee Diya, Consecrated Rudraksha Mala.",
        steps: [
          "Sit comfortably and place copper glass with fresh water and Tulsi leaves in front of you.",
          "Light the ghee lamp and hold right palm above the water glass.",
          "Chant Mahamrityunjaya Mantra 108 times with deep positive visualization, channeling healing light through your palm into the water.",
          "Drink the energized water in 3 sips while praying for cellular rejuvenation.",
          "Gently massage remaining few drops onto forehead and crown chakra."
        ],
        benefits: "Boosts bodily immune vigor, repairs fragmented auric energy fields, and relieves psychosomatic tensions.",
        cautions: "Complementary spiritual remedy; continue standard medical prescriptions as advised."
      },
      maha_mrityunjaya_havan: {
        id: "maha_mrityunjaya_havan",
        title: "Maha Mrityunjaya Healing Havan",
        category: "Divine Remedy",
        domain: "remedies",
        icon: "🔥",
        levelScope: "Level 1–3",
        summary: "Supreme life-restoring Vedic fire ritual to neutralize severe health afflictions, accident dangers, and critical energetic drops.",
        mantra: "ॐ हौं जूं सः ॐ भूर्भुवः स्वः ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॐ स्वः भुवः भूः ॐ सः जूं हौं ॐ ॥",
        timing: "Early Morning (Pratah Sandhya) or Monday Dusk",
        aasanDirection: "White Woolen / Kusha Aasan, East Facing",
        ingredients: "Copper Havan Kund, Mango Wood, Pure Cow Ghee, Durva Grass, Bel Patra, Black Sesame, Guggal, Samagri.",
        steps: [
          "Cleanse altar space and ignite sacred fire with camphor and dry wood.",
          "Perform Ganesh and Shiva invocation with sacred water sprinkles.",
          "Dip Durva grass and Bel Patra in pure cow ghee.",
          "Offer 108 ahutis chanting the Maha Mrityunjaya Samput Mantra with total devotion.",
          "Conclude with Aarti and distribute energized sacred ashes (Vibhuti)."
        ],
        benefits: "Creates impenetrable armor against untimely physical crises, relieves chronic bodily pains, and revives vital life-force (Prana).",
        cautions: "Perform with utmost mental reverence and clean satvik diet."
      },
      vastu_dosh_nivaran: {
        id: "vastu_dosh_nivaran",
        title: "Vastu Dosh Nivaran Upaya",
        category: "Divine Remedy",
        domain: "remedies",
        icon: "🧭",
        levelScope: "Level 1–3",
        summary: "Directional harmonic rectification ritual to clear blocked North-East (Ishanya) and South-West (Nairutya) household energy channels.",
        mantra: "ॐ वास्तुपुरुषाय नमः ॥ ॐ नमो भगवते वास्तुपुरुषाय महाबलपराक्रमाय सर्वदोषनिवारणाय स्वाहा ॥",
        timing: "Thursday or Sunday Sunrise",
        aasanDirection: "North-East Corner of Residence, Facing North",
        ingredients: "Copper Vastu Yantra, Camphor Crystals, Sea Salt, Turmeric Water, Gomati Chakra, Yellow Mustard Seeds.",
        steps: [
          "Identify afflicted Vastu zones (defective kitchen, toilet in Ishanya, cut corners).",
          "Purify the afflicted direction with sea salt dissolved in turmeric Gangajal.",
          "Place consecrated Copper Vastu Yantra on a wooden plinth.",
          "Light a pure cow ghee lamp and chant the Vastu Purusha Mantra 108 times.",
          "Sprinkle yellow mustard seeds in household corners to seal protective borders."
        ],
        benefits: "Eliminates sudden family discord, halts drain of savings, and restores harmonious cosmic prana flow through dwelling.",
        cautions: "Do not place shoes or clutter in the energized North-East zone."
      },
      santana_gopal: {
        id: "santana_gopal",
        title: "Santana Gopal Lineage Havan",
        category: "Divine Remedy",
        domain: "remedies",
        icon: "👶",
        levelScope: "Level 1–3",
        summary: "Divine child blessing and ancestral lineage protection ritual dedicated to Lord Krishna for family prosperity and progeny.",
        mantra: "ॐ देवकीसुत गोविन्द वासुदेव जगत्पते। देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥",
        timing: "Brahma Muhurta or Shukla Paksha Ekadashi/Ashtami",
        aasanDirection: "Yellow Silk Aasan, East Facing",
        ingredients: "Santana Gopal Yantra, Pure Cow Milk/Makhana Kheer, Tulsi Dal, White Butter (Makhan), Ghee, Peepal Leaf.",
        steps: [
          "Install Santana Gopal Yantra or Bal Gopal Vigrah on silver/brass thali.",
          "Perform Panchamrit abhishek accompanied by Vishnu Sahasranama recital.",
          "Offer fresh butter mixed with mishri and Tulsi leaves as naivedya.",
          "Perform 108 ahutis in sacred fire using gugal, ghee, and lotus seeds.",
          "Both spouses partake of the sanctified prasad together."
        ],
        benefits: "Removes deep genetic and energetic hurdles to childbirth, protects offspring, and fosters peaceful joyous household atmosphere.",
        cautions: "Maintain total celibacy on anushthan days prior to ritual completion."
      },
      karmic_debts: {
        id: "karmic_debts",
        title: "Karmic Debts Fire Cleansing (Rin Mukti)",
        category: "Divine Remedy",
        domain: "remedies",
        icon: "📜",
        levelScope: "Level 1–3",
        summary: "Rin-Mukti ancestral and past-life debt alleviation protocol designed to dissolve relentless monetary obligations and loans.",
        mantra: "ॐ ॠणमुक्तेश्वराय महादेवाय नमः ॥ ॐ आं ह्रीं क्रौं खं फट् ॥",
        timing: "Tuesday Morning or Pradosh Sandhya",
        aasanDirection: "Red / Orange Woolen Aasan, South or East Facing",
        ingredients: "Copper Lota, Red Lentils (Masoor Dal), Copper Coins, Pure Ghee Diya, Clove-infused Camphor, Peepal Twigs.",
        steps: [
          "Offer red lentils and water to the roots of a Banyan or Peepal tree in the morning.",
          "Set up evening havan with clove-infused camphor and dry wood.",
          "Offer 108 ahutis chanting Rin Mukteshwar Shiva Mantra.",
          "Pray sincerely for forgiveness of all known and unknown karmic transgressions.",
          "Distribute sweet boondi or jaggery bread to cows and laborers."
        ],
        benefits: "Accelerates settlement of chronic bank debts, stops unexplainable loss of earnings, and unblocks stagnant capital flow.",
        cautions: "Pledge to maintain ethical financial conduct alongside remedy."
      },
      nazar_suraksha: {
        id: "nazar_suraksha",
        title: "Nazar Suraksha & Evil Eye Shield",
        category: "Cleansing & Healing",
        domain: "cleansing",
        icon: "🧿",
        levelScope: "Level 1–3",
        summary: "Potent auric detoxification protocol using black mustard seeds, dry red chillies, rock salt, and camphor to dispel malicious jealousy.",
        mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥ ॐ हं हनुमते रुद्रात्मकाय हुं फट् ॥",
        timing: "Tuesday or Saturday Sunset (Godhuli Bela)",
        aasanDirection: "Center of Main Hall or Threshold, Facing East",
        ingredients: "Black Mustard Seeds (Rai), 7 Dry Red Chillies (with stems intact), Rock Salt Crystals, Burning Charcoal in Earthen Pot.",
        steps: [
          "Hold a handful of black mustard seeds, salt crystals, and 7 whole dry red chillies in right fist.",
          "Circulate clockwise 7 times around the head and body of afflicted individual or across main room.",
          "Drop the ingredients directly onto hot burning charcoal or iron pan.",
          "Observe smoke: pungent absence indicates burning of acute evil eye (Nazar).",
          "Wash hands with salted water and discard cooled ash outside residential boundary."
        ],
        benefits: "Instantly lifts unexplainable physical exhaustion, stops continuous yawning and heavy headaches, and dissolves destructive toxic envy.",
        cautions: "Never touch the burned residue with bare fingers afterwards."
      },
      aura_strengthening: {
        id: "aura_strengthening",
        title: "Aura Strengthening & Psychic Shield",
        category: "Cleansing & Healing",
        domain: "cleansing",
        icon: "🛡️",
        levelScope: "Level 1–4",
        summary: "Crystalline energetic field fortification technique using consecrated Sphatik, energized water bath, and Gayatri Prana kavach.",
        mantra: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
        timing: "Daily Morning immediately post-bath",
        aasanDirection: "White Silk Aasan, East Facing",
        ingredients: "Clear Quartz (Sphatik) Crystal, Rock Salt Bath, Fresh Cow Milk Drops, Gangajal, Sandalwood Essential Oil.",
        steps: [
          "Add a pinch of consecrated rock salt and 3 drops of rose water to daily bath water.",
          "Post-bath, sit on white silk aasan and hold energized Sphatik in both palms at heart chakra (Anahata).",
          "Chant Gayatri Mantra 24 times while visualizing a brilliant oval sphere of impenetrable golden-white light enclosing your aura 3 feet in all directions.",
          "Anoint forehead and throat chakra with pure sandalwood oil.",
          "Carry the energized crystal throughout daily public interactions."
        ],
        benefits: "Prevents psychic vulnerability, stops energetic leakage in crowded venues, and elevates charisma and spiritual presence.",
        cautions: "Re-energize the crystal under morning sunlight once every 14 days."
      }
    };
  }

  getSadhanaCatalog() {
    try {
      const raw = localStorage.getItem("sk_sadhana_catalog_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        const parsedKeys = Object.keys(parsed);
        if (parsedKeys.length > 0) {
          // Validate data integrity: check if items have 'domain' field (post-migration schema)
          // If none of the items have a 'domain' field, the data is stale/pre-migration
          const hasDomainField = parsedKeys.some(k => parsed[k] && (parsed[k].domain || parsed[k].categoryDomain));
          if (hasDomainField) {
            // Merge with defaults so any new items added in code are always available
            const defaults = this._getDefaultSadhanaCatalog();
            const merged = Object.assign({}, defaults, parsed);
            return merged;
          } else {
            // Stale data — discard and use defaults
            console.warn("[SK] Catalog data missing domain fields — resetting to defaults.");
          }
        }
      }
    } catch (e) {
      console.warn("Error reading sk_sadhana_catalog_v1:", e);
    }
    // Return defaults and persist for immediate use
    const defaults = this._getDefaultSadhanaCatalog();
    this.saveSadhanaCatalog(defaults);
    return defaults;
  }

  saveSadhanaCatalog(catalog) {
     if (!catalog) return;
     try {
         localStorage.setItem("sk_sadhana_catalog_v1", JSON.stringify(catalog));
         if (typeof window !== "undefined" && window.FirebaseSyncEngine && typeof window.FirebaseSyncEngine.pushNode === "function") {
             window.FirebaseSyncEngine.pushNode("sadhana_catalog", catalog);
         }
     } catch (e) {
         console.error("Error saving sadhana catalog", e);
     }
  }

  updateSadhanaItem(itemData) {
    if (!itemData || !itemData.id) return false;
    const catalog = this.getSadhanaCatalog();
    catalog[itemData.id] = itemData;

    try {
      localStorage.setItem("sk_sadhana_catalog_v1", JSON.stringify(catalog));
      // Cloud dual-write via FirebaseSyncEngine if available
      if (typeof window !== "undefined" && window.FirebaseSyncEngine && typeof window.FirebaseSyncEngine.pushNode === "function") {
        window.FirebaseSyncEngine.pushNode("sadhana_catalog", catalog);
      }
      return true;
    } catch (e) {
      console.error("Error saving sadhana item:", e);
      return false;
    }
  }

  deleteSadhanaItem(itemId) {
    if (!itemId) return false;
    const catalog = this.getSadhanaCatalog();
    if (catalog[itemId]) {
      delete catalog[itemId];
      try {
        localStorage.setItem("sk_sadhana_catalog_v1", JSON.stringify(catalog));
        if (typeof window !== "undefined" && window.FirebaseSyncEngine && typeof window.FirebaseSyncEngine.pushNode === "function") {
          window.FirebaseSyncEngine.pushNode("sadhana_catalog", catalog);
        }
        return true;
      } catch (e) {
        console.error("Error deleting sadhana item:", e);
        return false;
      }
    }
    return false;
  }

  /**
   * Enterprise Database Referential Integrity Validator
   * Validates sponsor uplink relationships, detects circular loops, and flags duplicate keys
   * @param {Object} options - { autoRepair: boolean }
   * @returns {Object} Integrity verification report
   */
  validateReferentialIntegrity(options = { autoRepair: false }) {
    const profiles = this.profiles || [];
    const report = {
      valid: true,
      totalProfiles: profiles.length,
      orphans: [],
      duplicates: [],
      circularLoops: [],
      repairedCount: 0
    };

    const refMap = new Map();
    const idMap = new Map();
    const defaultMentor = (typeof this.getDefaultMentorCode === "function")
      ? this.getDefaultMentorCode()
      : "SKHM-ADM1-7788-9900";

    // 1. Check for duplicate IDs or Reference Codes
    profiles.forEach(p => {
      if (p.id) {
        if (!idMap.has(p.id)) idMap.set(p.id, []);
        idMap.get(p.id).push(p);
      }
      if (p.referenceCode) {
        if (!refMap.has(p.referenceCode)) refMap.set(p.referenceCode, []);
        refMap.get(p.referenceCode).push(p);
      }
    });

    idMap.forEach((list, id) => {
      if (list.length > 1) {
        report.valid = false;
        report.duplicates.push({ field: "id", value: id, count: list.length });
      }
    });

    refMap.forEach((list, code) => {
      if (list.length > 1) {
        report.valid = false;
        report.duplicates.push({ field: "referenceCode", value: code, count: list.length });
      }
    });

    // 2. Validate Uplink Relationships & Detect Broken Mentors
    profiles.forEach(p => {
      const uplink = p.referredByCode;
      const isRoot = !uplink || uplink === "ROOT" || uplink === "ROOT-MASTER" || uplink === "SYSTEM" || p.level === 0 || p.level === 1 || p.profileType === "MASTER" || p.profileType === "ADMIN";

      if (!isRoot) {
        const sponsorExists = refMap.has(uplink);
        if (!sponsorExists) {
          report.valid = false;
          report.orphans.push({
            profileId: p.id,
            name: p.name,
            brokenCode: uplink
          });

          if (options.autoRepair) {
            p.referredByCode = defaultMentor;
            report.repairedCount++;
          }
        }
      }
    });

    // 3. Detect Circular Lineage Loops
    profiles.forEach(p => {
      const visited = new Set();
      let curr = p;
      const path = [curr.referenceCode || curr.id];

      while (curr && curr.referredByCode && curr.referredByCode !== "ROOT" && curr.referredByCode !== "ROOT-MASTER") {
        if (visited.has(curr.referredByCode)) {
          report.valid = false;
          report.circularLoops.push({
            profileId: p.id,
            name: p.name,
            loopPath: [...path, curr.referredByCode].join(" -> ")
          });
          break;
        }
        visited.add(curr.referenceCode);
        const parentList = refMap.get(curr.referredByCode);
        curr = parentList && parentList.length > 0 ? parentList[0] : null;
        if (curr) path.push(curr.referenceCode || curr.id);
      }
    });

    if (options.autoRepair && report.repairedCount > 0) {
      this.saveProfiles(profiles);
    }

    return report;
  }

  // NOTE: View and Controller layers are in separate files:
  // - js/views/ProfileView.js
  // - js/views/ProfileView2.js
  // - js/controllers/ProfileController.js
  // - js/controllers/ProfileController2.js
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = ProfileModel;
}
if (typeof window !== "undefined") {
  window.ProfileModel = ProfileModel;
}
