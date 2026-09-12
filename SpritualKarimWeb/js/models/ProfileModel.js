class ProfileModel {
  constructor() {
    this.storageKey = "sk_admin_profiles_v3";
    this.activeProfileIdKey = "sk_admin_active_profile_id_v3";
    this.settingsKey = "sk_admin_system_settings_v1";
    this.roleModeKey = "sk_admin_active_role_mode_v1";

    this.profiles = this._loadProfiles();
    this.settings = this._loadSettings();

    // Determine initial roleMode from pathname, body tag, or localStorage
    // NOTE: URL query params (e.g., ?role=MASTER) are intentionally NOT used
    // for role detection to prevent auth bypass via URL manipulation.
    let detectedRole = "MASTER";
    try {
      const pathName = window.location.pathname.toLowerCase();
      const portalModeTag = document.body.getAttribute("data-portal-mode");
      const portalRoleTag = document.body.getAttribute("data-portal-role");

      if (portalRoleTag) {
        const rp = portalRoleTag.toUpperCase();
        if (["ADMIN", "MASTER"].includes(rp)) detectedRole = "MASTER";
        else if (["HEALER", "HEALERS"].includes(rp)) detectedRole = "HEALER";
        else if (["TRAINEE", "SADHAK"].includes(rp)) detectedRole = "TRAINEE";
        else if (["DEVOTEE", "SEEKER"].includes(rp)) detectedRole = "DEVOTEE";
      } else if (pathName.includes("/masters")) {
        detectedRole = "MASTER";
      } else if (pathName.includes("/healers")) {
        detectedRole = "HEALER";
      } else if (pathName.includes("/trainee")) {
        detectedRole = "TRAINEE";
      } else if (pathName.includes("/devotee")) {
        detectedRole = "DEVOTEE";
      } else if (portalModeTag) {
        detectedRole = portalModeTag.toUpperCase();
      } else {
        detectedRole = localStorage.getItem(this.roleModeKey) || "MASTER";
      }
    } catch (e) {
      detectedRole = "MASTER";
    }
    this.roleMode = detectedRole;

    this.activeProfileId =
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
      const data = localStorage.getItem(this.settingsKey);
      if (data) {
        return { ...this._getDefaultSettings(), ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn("Error loading system settings", e);
    }
    return this._getDefaultSettings();
  }

  getProfileById(profileId) {
    return this.profiles.find((p) => p.id === profileId) || null;
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
      localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
      if (typeof window !== "undefined") {
        window.appConfig = Object.assign(window.appConfig || {}, this.settings);
      }
    } catch (e) {
      console.error("Error saving settings to localStorage", e);
    }
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

    // Switch active profile to match selected tier if current does not match
    const active = this.getActiveProfile();
    if (this.roleMode === "DEVOTEE" && active?.profileType !== "DEVOTEE") {
      const devoteeProf = this.profiles.find(
        (p) => p.profileType === "DEVOTEE",
      );
      if (devoteeProf) this.setActiveProfileId(devoteeProf.id);
    } else if (
      this.roleMode === "TRAINEE" &&
      active?.profileType !== "TRAINEE"
    ) {
      const traineeProf = this.profiles.find(
        (p) => p.profileType === "TRAINEE" || p.level === 4,
      );
      if (traineeProf) this.setActiveProfileId(traineeProf.id);
    } else if (this.roleMode === "HEALER" && active?.profileType !== "HEALER") {
      const healerProf = this.profiles.find((p) => p.profileType === "HEALER");
      if (healerProf) this.setActiveProfileId(healerProf.id);
    } else if (this.roleMode === "MASTER" && active?.profileType !== "ADMIN") {
      const adminProf = this.profiles.find((p) => p.profileType === "ADMIN");
      if (adminProf) this.setActiveProfileId(adminProf.id);
    }
  }

  getDefaultAuthMatrix() {
    return [
      // --- SCREEN PANELS (TABS) ---
      {
        id: "tab_devotee_personal",
        name: "Tab 1: Devotee Personal (Identity, Lineage, House Clean)",
        type: "SCREEN",
        targetId: "tab-devotee-personal",
        tabBtnTarget: "tab-devotee-personal",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: true,
      },
      {
        id: "tab_seeker_purpose",
        name: "Tab 2: Seeker Purpose (Goals, Sadhana List & Preview)",
        type: "SCREEN",
        targetId: "tab-seeker-purpose",
        tabBtnTarget: "tab-seeker-purpose",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: true,
      },
      {
        id: "tab_trainee_sadhak",
        name: "Tab 3: Trainee Sadhak (Level Wise Sadhanas & Memos)",
        type: "SCREEN",
        targetId: "tab-trainee-sadhak",
        tabBtnTarget: "tab-trainee-sadhak",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: false,
      },
      {
        id: "tab_healer_connect",
        name: "Tab 4: Healer Connect (Healers Hub Directory)",
        type: "SCREEN",
        targetId: "tab-healer-connect",
        tabBtnTarget: "tab-healer-connect",
        MASTER: true,
        HEALER: true,
        TRAINEE: false,
        DEVOTEE: false,
      },
      {
        id: "tab_genealogy_tree",
        name: "Tab 5: Genealogy Tree (Visual MLM Spiderweb Canvas)",
        type: "SCREEN",
        targetId: "tab-genealogy-tree",
        tabBtnTarget: "tab-genealogy-tree",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: false,
      },
      {
        id: "tab_firebase_data",
        name: "Tab 6: Firebase Data (Realtime DB Table Drill-down)",
        type: "SCREEN",
        targetId: "tab-firebase-data",
        tabBtnTarget: "tab-firebase-data",
        MASTER: true,
        HEALER: false,
        TRAINEE: false,
        DEVOTEE: false,
      },

      // --- ELEMENT PANELS (CONTROLS & WIDGETS) ---
      {
        id: "elem_3d_flipper",
        name: "Hero 3D Card Flipper (QR Pairing & Node Telemetry)",
        type: "ELEMENT",
        selector: "#profile-card-flipper-wrapper",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: true,
      },
      {
        id: "btn_header_pending_approvals",
        name: "Header: Pending Approvals Button & Pill",
        type: "ELEMENT",
        selector: "#main-tab-approval-btn, #pending-approval-notification-banner",
        MASTER: true,
        HEALER: true,
        TRAINEE: false,
        DEVOTEE: false,
      },
      {
        id: "elem_selected_member_card",
        name: "Selected Member Profile Card",
        type: "ELEMENT",
        selector: "#selected-member-profile-card",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: true,
      },
      {
        id: "elem_save_sync_btn",
        name: "Header: Save & Sync Pulse Button",
        type: "ELEMENT",
        selector: "#btn-save-profile",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: true,
      },
      {
        id: "elem_import_export_btns",
        name: "Header: Import & Export JSON Payload Buttons",
        type: "ELEMENT",
        selector: "#btn-import-json, #btn-export-json",
        MASTER: true,
        HEALER: true,
        TRAINEE: false,
        DEVOTEE: false,
      },
      {
        id: "elem_sidebar_tiers",
        name: "Sidebar: App Hierarchy Tiers & Tree Button",
        type: "ELEMENT",
        selector: "#hierarchy-legend-container",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: false,
      },
      {
        id: "elem_sidebar_portals",
        name: "Sidebar: Dedicated Sub-Portal Links",
        type: "ELEMENT",
        selector: "#sidebar-dedicated-portals",
        MASTER: true,
        HEALER: true,
        TRAINEE: true,
        DEVOTEE: true,
      },
      {
        id: "elem_sidebar_rtdb",
        name: "Sidebar: Firebase Realtime DB Card",
        type: "ELEMENT",
        selector: ".sidebar-rtdb-card",
        MASTER: true,
        HEALER: false,
        TRAINEE: false,
        DEVOTEE: false,
      },
      {
        id: "elem_sidebar_tools",
        name: "Sidebar: System Tools & Actions",
        type: "ELEMENT",
        selector: "#sidebar-tools-section",
        MASTER: true,
        HEALER: true,
        TRAINEE: false,
        DEVOTEE: false,
      },
    ];
  }

  getAuthMatrix() {
    try {
      if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("sk_auth_matrix_v5");
        if (stored) {
          let matrix = JSON.parse(stored);
          // Normalize old 'portals:' field to 'portalVisible:' for CLAUDE.md §3.2 compliance
          return this._normalizeMatrixKeys(matrix);
        }
      }
    } catch (e) {
      console.warn("Error loading auth matrix from localStorage:", e);
    }
    return this._normalizeMatrixKeys(this.getDefaultAuthMatrix());
  }

  /**
   * Normalizes matrix items: converts 'portals:' to 'portalVisible:' per CLAUDE.md §2.2
   * Handles both new format (portalVisible) and legacy format (portals)
   */
  _normalizeMatrixKeys(matrix) {
    if (!Array.isArray(matrix)) return matrix;
    return matrix.map((item) => {
      // Skip if already has portalVisible (new format)
      if (item.portalVisible) return item;
      // Migrate legacy 'portals:' to 'portalVisible:'
      if (item.portals) {
        return { ...item, portalVisible: item.portals };
      }
      return item;
    });
  }

  saveAuthMatrix(matrix) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("sk_auth_matrix_v5", JSON.stringify(matrix));
      }
      return true;
    } catch (e) {
      console.error("Error saving auth matrix:", e);
      return false;
    }
  }

  getVisibleProfiles() {
    const mode = this.roleMode || "MASTER";

    if (mode === "MASTER") {
      return this.profiles;
    }

    if (mode === "HEALER") {
      return this.profiles.filter((p) => p.profileType === "HEALER");
    }

    if (mode === "TRAINEE") {
      return this.profiles.filter((p) => p.profileType === "TRAINEE");
    }

    if (mode === "DEVOTEE") {
      return this.profiles.filter((p) => p.profileType === "DEVOTEE");
    }

    return this.profiles;
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
            diaryNotes: "Threshold cleared.",
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
            diaryNotes: "Atmosphere purified.",
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
            diaryNotes: "Fear banished.",
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
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (
          Array.isArray(parsed) &&
          parsed.length >= 8 &&
          parsed.some(
            (p) =>
              p.profileType === "TRAINEE" || p.level === 3 || p.level === 4,
          )
        ) {
          // Automatic migration: restore original Spiritual Karim Khan profile name
          const rootP = parsed.find((p) => p.id === "prof-admin-01");
          if (rootP && rootP.name !== "Spiritual Karim Khan") {
            rootP.name = "Spiritual Karim Khan";
            if (rootP.lineage && rootP.lineage.currentFamily) {
              rootP.lineage.currentFamily.selfName = "Spiritual Karim Khan";
              rootP.lineage.currentFamily.spouseName = "Fatima Karim Khan";
            }
            this.saveProfiles(parsed);
          }
          return parsed;
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
      localStorage.setItem(this.storageKey, JSON.stringify(this.profiles));
    } catch (e) {
      console.error("Error saving profiles to localStorage", e);
    }
  }

  getActiveProfile() {
    return (
      this.profiles.find((p) => p.id === this.activeProfileId) ||
      this.profiles[0]
    );
  }

  setActiveProfileId(id) {
    this.activeProfileId = id;
    localStorage.setItem(this.activeProfileIdKey, id);
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
    const catalogItem = SADHANA_CATALOG[key] || {
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
  ) {
    const profile = this.getActiveProfile();
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

  requestTraineeVerification(itemId, customNote = "") {
    const profile = this.getActiveProfile();
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
      const author = profile.name || "Devotee Sadhak";
      const sponsorCode =
        item.mentorCode ||
        profile.referredByCode ||
        this.settings?.defaultMentorCode ||
        "SKHM-ADM1-7788-9900";
      const note =
        customNote ||
        `[VERIFICATION REQUESTED] Sadhak submitted ${item.progressPercent || 0}% progress (${item.currentStreak || "1 Day"}) to upline (${sponsorCode}) for approval seal.`;

      this.addTraineeMemo(itemId, note, author, true, "PENDING");
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  approveTraineeVerification(itemId, mentorName = null, mentorCode = null) {
    const profile = this.getActiveProfile();
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
      const activeMentor =
        mentorName || this.settings?.defaultMentorName || "Karim Ji (Founder)";
      const activeCode =
        mentorCode || this.settings?.defaultMentorCode || "SKHM-ADM1-7788-9900";

      item.verificationStatus = "VERIFIED";
      item.verifiedDate = nowStamp;
      item.verifiedBy = activeMentor;
      item.verifiedCode = activeCode;
      item.verifiedPercent = item.progressPercent || 100;

      const note = `[APPROVED BY UPLINE] ${activeMentor} (${activeCode}) verified and officially sealed ${item.progressPercent || 0}% progress advancement!`;
      this.addTraineeMemo(itemId, note, activeMentor, true, "VERIFIED");
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  rejectTraineeVerification(itemId, reason = "", mentorName = null) {
    const profile = this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find((s) => s.id === itemId);
    if (item) {
      item.verificationStatus = "UNVERIFIED";
      const activeMentor =
        mentorName || this.settings?.defaultMentorName || "Karim Ji (Founder)";
      const note = `[REVISION REQUESTED] Upline Mentor Guidance: ${reason || "Please complete additional daily malas before reapplying for the verification seal."}`;
      this.addTraineeMemo(itemId, note, activeMentor, true, "REVISION");
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

  getPairingInvites() {
    try {
      // Primary key: sk_pairing_invites (CLAUDE.md standard)
      const stored = localStorage.getItem("sk_pairing_invites");
      if (stored) return JSON.parse(stored);
      // Fallback: migrate from legacy key
      const legacy = localStorage.getItem("spiritual_karim_pairing_invites");
      if (legacy) {
        const invites = JSON.parse(legacy);
        localStorage.setItem("sk_pairing_invites", JSON.stringify(invites));
        return invites;
      }
    } catch (e) {
      console.warn("Could not load pairing invites", e);
    }
    const defaultInvites = [
      {
        id: "inv-01",
        sponsorCode: "SKHM-ADM1-7788-9900",
        seekerName: "Ananya Sharma",
        seekerPhone: "+91 98112 33445",
        seekerDeviceModel: "Samsung Galaxy SM-G998B",
        hardwareNonce: "HW-FPRINT-8891-9921",
        telegramLink:
          "https://t.me/SpiritualKarimBot?start=pair_SKHMADM177889900",
        apkDownloadUrl:
          "https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk",
        createdAtMs: Date.now() - 3600000,
        expiresAtMs: Date.now() + 23 * 3600000,
        status: "PENDING",
        resendCount: 0,
        lastResendTimestamp: Date.now() - 3600000,
        formattedCreatedTime: "Today ? 1h ago",
      },
      {
        id: "inv-02",
        sponsorCode: "SKHM-ADM1-7788-9900",
        seekerName: "Vikram Aditya",
        seekerPhone: "+91 98223 44556",
        seekerDeviceModel: "OnePlus 11 5G",
        hardwareNonce: "HW-FPRINT-1122-3344",
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
    this.savePairingInvites(defaultInvites);
    return defaultInvites;
  }

  /**
   * Migrates legacy localStorage keys to unified standards.
   * Called once on app startup if old keys are detected.
   */
  migrateLegacyKeys() {
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

  approvePairingInvite(inviteId, targetRole = null) {
    const invites = this.getPairingInvites();
    const item = invites.find((i) => i.id === inviteId);
    if (item) {
      const assignedRole = (targetRole || item.assignedRole || this.settings.defaultInductionRole || "DEVOTEE").toUpperCase();
      const roleLevel = assignedRole === "HEALER" ? 2 : assignedRole === "TRAINEE" ? 3 : 5;

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
      }

      this.saveProfiles(this.profiles);

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
      sadhana_catalog: SADHANA_CATALOG,
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

  // NOTE: View and Controller layers are in separate files:
  // - js/views/ProfileView.js
  // - js/views/ProfileView2.js
  // - js/controllers/ProfileController.js
  // - js/controllers/ProfileController2.js
}
