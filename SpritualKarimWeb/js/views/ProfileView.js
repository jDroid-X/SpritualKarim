class ProfileView {
  constructor() {
    // Firebase Realtime Database Table Drill-down State
    this.rtdbExpandedPaths = new Set([
      "profiles",
      "authorisedNodes",
      "sadhana_catalog",
      "device_telemetry",
      "pairing_invites",
      "system_config",
      "lineage_graph",
      "logs",
    ]);
    this.rtdbActiveRootFilter = "ALL";
    this.rtdbSearchQuery = "";
    this.rtdbActiveBreadcrumbPath = "/";

    this.form = document.getElementById("profile-admin-form");
    this.selectActiveProfile = document.getElementById("select-active-profile");
    this.profileDirectoryList = document.getElementById(
      "profile-directory-list",
    );
    this.inputDirectorySearch = document.getElementById(
      "input-directory-search",
    );
    this.directorySearchQuery = "";

    // Role Switcher & RBAC Controls
    this.selectRoleMode = document.getElementById("select-role-mode");
    this.btnAdminSettings =
      document.getElementById("btn-admin-settings") ||
      document.getElementById("sidebar-btn-admin-settings");
    this.adminSettingsModal = document.getElementById("admin-settings-modal");

    // Pending Approval Notification Banner
    this.pendingApprovalBanner = document.getElementById(
      "pending-approval-notification-banner",
    );
    this.approvalNotificationText = document.getElementById(
      "approval-notification-text",
    );
    this.approvalNotificationCount = document.getElementById(
      "approval-notification-count",
    );

    // Header Display Elements
    this.mainProfileBox1 = document.getElementById("main-profile-box-1");
    this.displayProfileName = document.getElementById("display-profile-name");
    this.displayRoleBadge = document.getElementById("display-role-badge");
    this.displayStatusPill = document.getElementById("display-status-pill");
    this.displayPaymentStamp = document.getElementById("display-payment-stamp");
    this.displayRefCode = document.getElementById("display-ref-code");
    this.displaySponsorCode = document.getElementById("display-sponsor-code");
    this.avatarInitials = document.getElementById("profile-avatar-initials");
    this.displayMasterJoinDate = document.getElementById("display-master-join-date");
    this.displayMasterCurrentRole = document.getElementById("display-master-current-role");

    // Card 2: Selected Member Card Elements
    this.selectedMemberCard = document.getElementById("selected-member-profile-card");
    this.selectedMemberAvatar = document.getElementById("selected-member-avatar");
    this.selectedMemberName = document.getElementById("selected-member-name");
    this.selectedMemberRoleBadge = document.getElementById("selected-member-role-badge");
    this.selectedMemberStatusPill = document.getElementById("selected-member-status-pill");
    this.selectedMemberPaymentStamp = document.getElementById("selected-member-payment-stamp");
    this.selectedMemberRefCode = document.getElementById("selected-member-ref-code");
    this.selectedMemberJoinDate = document.getElementById("selected-member-join-date");
    this.selectedMemberCurrentRole = document.getElementById("selected-member-current-role");
    this.btnSelectedMemberCopyCode = document.getElementById("btn-selected-member-copy-code");
    this.btnSelectedMemberQr = document.getElementById("btn-selected-member-qr");
    this.btnCloseSelectedMemberCard = document.getElementById("btn-close-selected-member-card");

    // Form Inputs - Identity
    this.inputProfileType = document.getElementById("input-profile-type");
    this.inputLevel = document.getElementById("input-level");
    this.inputCategoryTag = document.getElementById("input-category-tag");
    this.inputRefCode = document.getElementById("input-ref-code");
    this.inputSponsorCode = document.getElementById("input-sponsor-code");
    this.inputTransferCode = document.getElementById("input-transfer-code");
    this.inputIsActive = document.getElementById("input-is-active");
    this.inputPaymentStatus = document.getElementById("input-payment-status");
    this.inputJoinDate = document.getElementById("input-join-date");

    this.inputName = document.getElementById("input-name");
    this.inputSelfTitle = document.getElementById("input-self-title");
    this.inputPhone = document.getElementById("input-phone");
    this.inputEmail = document.getElementById("input-email");
    this.inputCity = document.getElementById("input-city");
    this.inputAddress = document.getElementById("input-address");
    this.inputNotes = document.getElementById("input-notes");

    // Seeker Purpose Inputs
    this.inputObjective = document.getElementById("input-objective");
    this.seekerAfflictionDuration = document.getElementById(
      "seeker-affliction-duration",
    );
    this.seekerKuldeviIssues = document.getElementById("seeker-kuldevi-issues");
    this.seekerTargetOutcome = document.getElementById("seeker-target-outcome");

    // Lineage Inputs
    this.lineageSelfName = document.getElementById("lineage-self-name");
    this.lineageSpouseName = document.getElementById("lineage-spouse-name");

    this.hFatherName = document.getElementById("h-father-name");
    this.hMotherName = document.getElementById("h-mother-name");
    this.hPaternalGf = document.getElementById("h-paternal-gf");
    this.hPaternalGm = document.getElementById("h-paternal-gm");
    this.hMaternalGf = document.getElementById("h-maternal-gf");
    this.hMaternalGm = document.getElementById("h-maternal-gm");
    this.hAddress = document.getElementById("h-address");

    this.wFatherName = document.getElementById("w-father-name");
    this.wMotherName = document.getElementById("w-mother-name");
    this.wPaternalGf = document.getElementById("w-paternal-gf");
    this.wPaternalGm = document.getElementById("w-paternal-gm");
    this.wMaternalGf = document.getElementById("w-maternal-gf");
    this.wMaternalGm = document.getElementById("w-maternal-gm");
    this.wAddress = document.getElementById("w-address");

    // Dynamic Containers
    this.childrenContainer = document.getElementById("children-list-container");
    this.siblingsCurrentContainer = document.getElementById(
      "siblings-current-container",
    );
    this.siblingsHusbandContainer = document.getElementById(
      "siblings-husband-container",
    );
    this.siblingsWifeContainer = document.getElementById(
      "siblings-wife-container",
    );

    this.devoteeHouseCleanContainer = document.getElementById(
      "devotee-houseclean-container",
    );
    this.seekerHouseCleanSummaryContainer = document.getElementById(
      "seeker-houseclean-summary-container",
    );
    this.interestedSadhanasContainer = document.getElementById(
      "interested-sadhanas-container",
    );

    // Categorized Trainee Containers & Active Detail Panel
    this.traineeGroupSadhanas = document.getElementById(
      "trainee-sadhanas-group-sadhanas",
    );
    this.traineeGroupRemedies = document.getElementById(
      "trainee-sadhanas-group-remedies",
    );
    this.traineeGroupCleansing = document.getElementById(
      "trainee-sadhanas-group-cleansing",
    );
    this.traineeActiveDetailContainer = document.getElementById(
      "trainee-active-sadhana-detail",
    );
    this.selectedTraineeId = null;

    this.healerCompletedSadhanasContainer = document.getElementById(
      "healer-completed-sadhanas-container",
    );
    this.healerNetworkContainer = document.getElementById(
      "healer-network-container",
    );

    // Slide-out Drawer & Modals
    this.sadhanaDrawer = document.getElementById("sadhana-detail-drawer");
    this.sadhanaDrawerBackdrop = document.getElementById(
      "sadhana-drawer-backdrop",
    );
    this.sadhanaDrawerTitle = document.getElementById("sadhana-drawer-title");
    this.sadhanaDrawerCategory = document.getElementById(
      "sadhana-drawer-category",
    );
    this.sadhanaDrawerIcon = document.getElementById("sadhana-drawer-icon");
    this.sadhanaDrawerBody = document.getElementById("sadhana-drawer-body");
    this.btnDrawerEnroll = document.getElementById("btn-drawer-enroll");
    this.btnDrawerSendTrainee = document.getElementById(
      "btn-drawer-send-trainee",
    );

    this.goliGyanModal = document.getElementById("goli-gyan-modal");
    this.jsonDrawer = document.getElementById("json-drawer");
    this.jsonDrawerBackdrop = document.getElementById("json-drawer-backdrop");
    this.jsonPreviewCode = document.getElementById("json-preview-code");
    this.importModal = document.getElementById("import-modal");
    this.toastEl = document.getElementById("admin-toast");

    // In-Body App Hierarchy Tree & Genealogy Canvas (Tab 5)
    this.tabGenealogyTree = document.getElementById("tab-genealogy-tree");
    this.mainTabTreeBtn = document.getElementById("main-tab-tree-btn");
    this.bodyTreeCanvasViewport = document.getElementById(
      "body-tree-canvas-viewport",
    );
    this.bodyTreeSurface = document.getElementById("body-tree-surface");
    this.bodySpiderwebSvgLayer = document.getElementById(
      "body-spiderweb-svg-layer",
    );
    this.bodySpiderwebNodesLayer = document.getElementById(
      "body-spiderweb-nodes-layer",
    );
    this.btnBodySmartFit = document.getElementById("btn-body-smart-fit");
    this.btnBodyZoomIn = document.getElementById("btn-body-zoom-in");
    this.btnBodyZoomOut = document.getElementById("btn-body-zoom-out");
    this.btnBodyZoomReset = document.getElementById("btn-body-zoom-reset");
    this.btnBodyFullscreen = document.getElementById("btn-body-fullscreen");
    this.bodyTreeSearchInput = document.getElementById(
      "body-tree-search-input",
    );
    this.treePanState = {
      panX: 0,
      panY: 0,
      scale: 1.0,
      isDragging: false,
      startX: 0,
      startY: 0,
    };
    this.inBodyTreePanState = {
      panX: 0,
      panY: 0,
      scale: 1.0,
      isDragging: false,
      startX: 0,
      startY: 0,
      layoutMode: "cluster",
    };
    this.sharePairingModal = document.getElementById("share-pairing-modal");
    this.sharePairingModalBody = document.getElementById(
      "share-pairing-modal-body",
    );
    this.btnCloseSharePairingModal = document.getElementById(
      "btn-close-share-pairing-modal",
    );
    this.headerPendingApprovalCount = document.getElementById(
      "header-pending-approval-count",
    );
    this.mainTabApprovalBtn = document.getElementById("main-tab-approval-btn");

    // Settings Modal Elements & Controls
    this.btnAdminSettings =
      document.getElementById("btn-admin-settings") ||
      document.getElementById("sidebar-btn-admin-settings");
    this.adminSettingsModal = document.getElementById("admin-settings-modal");
    this.btnCloseAdminSettings =
      document.getElementById("btn-close-settings-modal") ||
      document.getElementById("btn-close-admin-settings") ||
      document.querySelector("#admin-settings-modal .icon-btn");
    this.btnSaveSettings = document.getElementById("btn-save-settings");
    this.btnResetSettings = document.getElementById("btn-reset-settings");

    this.settingDefaultMentorName = document.getElementById(
      "setting-default-mentor-name",
    );
    this.settingDefaultMentorCode = document.getElementById(
      "setting-default-mentor-code",
    );
    this.settingSpeechLang = document.getElementById("setting-speech-lang");
    this.settingDefaultTargetMalas = document.getElementById(
      "setting-default-target-malas",
    );
    this.settingDevoteeCanDelete =
      document.getElementById("setting-devotee-can-delete") ||
      document.getElementById("setting-allow-devotee-delete");
    this.settingDevoteeCanEditLineage = document.getElementById(
      "setting-devotee-can-edit-lineage",
    );
    this.settingDevoteeCanEnroll = document.getElementById(
      "setting-devotee-can-enroll",
    );
    this.settingHealerStrictTeam =
      document.getElementById("setting-healer-strict-team") ||
      document.getElementById("setting-healer-team-view");
    this.settingHealerCanCertify = document.getElementById(
      "setting-healer-can-certify",
    );
    this.settingHealerCanDeleteTeam = document.getElementById(
      "setting-healer-can-delete-team",
    );
    this.settingFirebaseUrl = document.getElementById("setting-firebase-url");
    this.settingDefaultRoleMode = document.getElementById(
      "setting-default-role-mode",
    );
    this.settingAutoSave =
      document.getElementById("setting-auto-save") ||
      document.getElementById("setting-live-sync");

    // Left Flyout Tier Profiles Panel Elements
    this.tierProfilesPanel = document.getElementById("tier-profiles-panel");
    this.tierPanelTitle = document.getElementById("tier-panel-title");
    this.tierPanelIcon = document.getElementById("tier-panel-icon");
    this.tierPanelCount = document.getElementById("tier-panel-count");
    this.tierPanelProfilesList = document.getElementById(
      "tier-panel-profiles-list",
    );
    this.inputTierPanelSearch = document.getElementById(
      "input-tier-panel-search",
    );
    this.btnClearTierSearch = document.getElementById("btn-clear-tier-search");
    this.btnCollapseTierPanel = document.getElementById(
      "btn-collapse-tier-panel",
    );
    this.btnCloseTierPanel = document.getElementById("btn-close-tier-panel");
    this.tierFilterChips = document.getElementById("tier-panel-filter-chips");
    this.currentOpenTier = null;
    this.currentTierProfiles = [];


    // Additional DOM & State References
    this.adminSidebar =
      document.getElementById("admin-enterprise-drawer") ||
      document.getElementById("adminSidebar") ||
      document.querySelector(".admin-sidebar");
    this.btnMobileSidebarToggle =
      document.getElementById("btn-mobile-sidebar-toggle") ||
      document.getElementById("btnMobileSidebarToggle");
    this.sidebarBackdrop =
      document.getElementById("sidebar-backdrop") ||
      document.getElementById("sidebarBackdrop");
    this.sidebarEl = this.adminSidebar;
    this.btnThemeToggle =
      document.getElementById("btn-theme-toggle") ||
      document.getElementById("btnThemeToggle");
    this.themeIcon = document.getElementById("theme-icon");
    this.themeLabel = document.getElementById("theme-label");
    this.headerStampBadge =
      document.getElementById("header-stamp-badge") ||
      document.getElementById("headerStampBadge");
    this.btnQuickGoliGyan =
      document.getElementById("btn-quick-goli-gyan") ||
      document.getElementById("btnQuickGoliGyan");
    this.btnQuickSharePairing =
      document.getElementById("btn-quick-share-pairing") ||
      document.getElementById("btnQuickSharePairing");
    this.btnCloseSharePairingModal =
      document.getElementById("btn-close-share-pairing-modal") ||
      document.getElementById("btnCloseSharePairingModal");
    this.btnOpenTreeView =
      document.getElementById("btn-open-tree-view") ||
      document.getElementById("btnOpenTreeView");
    this.bodyTreeTierFilter =
      document.getElementById("body-tree-tier-filter") ||
      document.getElementById("bodyTreeTierFilter");
    this.btnClearTreeSearch =
      document.getElementById("btn-clear-tree-search") ||
      document.getElementById("btnClearTreeSearch");
    this.btnLayoutCluster =
      document.getElementById("btn-layout-cluster") ||
      document.getElementById("btnLayoutCluster");
    this.btnLayoutSpiderweb =
      document.getElementById("btn-layout-spiderweb") ||
      document.getElementById("btnLayoutSpiderweb");
    this.nodeActionDialog =
      document.getElementById("node-action-dialog") ||
      document.getElementById("nodeActionDialog");
    this.btnCloseNodeDialog =
      document.getElementById("btn-close-node-dialog") ||
      document.getElementById("btnCloseNodeDialog");
    this.btnCloseNodeDialogFooter =
      document.getElementById("btn-close-node-dialog-footer") ||
      document.getElementById("btnCloseNodeDialogFooter");
    this.btnCloseTreeModal =
      document.getElementById("btn-close-tree-modal") ||
      document.getElementById("btnCloseTreeModal");
    this.btnCloseTreeDrawer =
      document.getElementById("btn-close-tree-drawer") ||
      document.getElementById("btnCloseTreeDrawer");
    this.treeDrawerBackdrop =
      document.getElementById("tree-drawer-backdrop") ||
      document.getElementById("treeDrawerBackdrop");
    this.treeCanvasViewport =
      document.getElementById("tree-canvas-viewport") ||
      document.getElementById("treeCanvasViewport");
    this.btnTreeLoadProfile =
      document.getElementById("btn-tree-load-profile") ||
      document.getElementById("btnTreeLoadProfile");
    this.allProfiles = [];
    this.directoryLayout = "grid";
    this.healersSearchQuery = "";
    this.healersSelectedCategory = "ALL";
    this.hierarchySelectedLevel = "ALL";
    if (typeof this.setupLiveInputValidations === "function") {
      this.setupLiveInputValidations();
    }
  }

  render(profile, visibleProfiles, roleMode, settings, anchorProfile = null) {
    this.populateSettings(settings);
    this._renderRoleSelector(roleMode);
    this.updateLegendCounts(this.allProfiles || visibleProfiles, roleMode);
    this._renderDropdown(profile, visibleProfiles);
    this._renderDirectory(profile, visibleProfiles);
    this._renderHeaderCard(profile, roleMode, anchorProfile);
    this._populateForm(profile);

    // Lineage Dynamic Units
    this._renderChildren(profile.lineage?.currentFamily?.children || []);
    this._renderSiblings(
      this.siblingsCurrentContainer,
      profile.lineage?.currentFamily?.siblings || [],
      "current",
    );
    this._renderSiblings(
      this.siblingsHusbandContainer,
      profile.lineage?.husbandAncestral?.siblings || [],
      "husband",
    );
    this._renderSiblings(
      this.siblingsWifeContainer,
      profile.lineage?.wifeAncestral?.siblings || [],
      "wife",
    );

    // House Clean
    this._renderHouseCleanCards(profile.houseCleanLevels || []);

    // Enrolled / Interested Sadhanas Queue
    this._renderInterestedSadhanas(profile.interestedSadhanas || []);

    // Categorized Trainee Sadhak In-Progress
    this._renderCategorizedTraineeSadhanas(profile.traineeSadhanas || []);

    // Healer Completed & Network
    const hubProfiles = this.allProfiles || visibleProfiles || [];
    this.renderAndroidHealersHub(hubProfiles, profile, roleMode);
    this._renderHealerCompleted(profile.healerCompletedSadhanas || []);
    this._renderHealerNetwork(profile.healerNetwork || []);

    // Render In-Body App Hierarchy Tree (Tab 5)
    const treeProfiles = this.allProfiles || visibleProfiles || [];
    const activeFilter = this.bodyTreeTierFilter
      ? this.bodyTreeTierFilter.value
      : "ALL";
    const tier = activeFilter === "ALL" ? null : parseInt(activeFilter, 10);
    const query = this.bodyTreeSearchInput
      ? this.bodyTreeSearchInput.value
      : "";
    const mode = this.inBodyTreePanState?.layoutMode || "cluster";
    this.renderInBodyHierarchyTree(treeProfiles, tier, query, mode);

    // JSON Live Inspector
    this.renderAndroidHierarchyTree(
      treeProfiles,
      this.hierarchySelectedLevel || "ALL",
      profile,
    );
    this._updateJSONPreview(profile);

    // Apply RBAC Rules Across the UI
    this.enforceRBAC(roleMode, settings);
  }

  _renderRoleSelector(roleMode) {
    if (this.selectRoleMode) {
      this.selectRoleMode.value = roleMode;
    }
  }

  _renderDropdown(activeProfile, visibleProfiles) {
    if (!this.selectActiveProfile) return;
    this.selectActiveProfile.innerHTML = (visibleProfiles || [])
      .map((p) => {
        const isSelected = activeProfile && p.id === activeProfile.id;
        return `<option value="${p.id}" ${isSelected ? "selected" : ""}>${p.name} ? [${p.referenceCode}] (${p.profileType} L${p.level})</option>`;
      })
      .join("");
    if (activeProfile && this.selectActiveProfile) {
      this.selectActiveProfile.value = activeProfile.id;
    }
  }

  _renderDirectory(activeProfile, visibleProfiles) {
    if (!this.profileDirectoryList) return;
    const tiers = [
      {
        tierNumber: 1,
        title: "Tier 1: Admin Master (Founder)",
        icon: "👑",
        badgeBg: "rgba(139, 92, 246, 0.2)",
        borderColor: "#8b5cf6",
        filter: (p) => p.profileType === "ADMIN" || p.level === 1,
      },
      {
        tierNumber: 2,
        title: "Tier 2: Certified Healers & Gurus",
        icon: "🛡️",
        badgeBg: "rgba(16, 185, 129, 0.2)",
        borderColor: "#10b981",
        filter: (p) => p.profileType === "HEALER" && p.level === 2,
      },
      {
        tierNumber: 3,
        title: "Tier 3: Healers In-Progress / Siddhi",
        icon: "✨",
        badgeBg: "rgba(236, 72, 153, 0.2)",
        borderColor: "#ec4899",
        filter: (p) => p.profileType === "HEALER" && p.level === 3,
      },
      {
        tierNumber: 4,
        title: "Tier 4: Trainee Sadhaks",
        icon: "🌿",
        badgeBg: "rgba(245, 158, 11, 0.2)",
        borderColor: "#f59e0b",
        filter: (p) => p.profileType === "TRAINEE" || p.level === 4,
      },
      {
        tierNumber: 5,
        title: "Tier 5: Devotees & Seekers",
        icon: "🌟",
        badgeBg: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        filter: (p) =>
          p.profileType === "DEVOTEE" ||
          p.level === 5 ||
          (!p.level &&
            p.profileType !== "ADMIN" &&
            p.profileType !== "HEALER" &&
            p.profileType !== "TRAINEE"),
      },
    ];

    let html = "";

    tiers.forEach((tier) => {
      const tierProfiles = visibleProfiles.filter(tier.filter);
      if (tierProfiles.length === 0) return;

      const itemsHtml = tierProfiles
        .map((p) => {
          const isActive = p.id === activeProfile.id;
          const initials = (p.name || "SK")
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          const isPaid = p.isPaid !== false && p.paymentStatus !== "FREE";

          return `
          <div class="profile-item-row ${isActive ? "active" : ""}" data-id="${p.id}" title="Click to view & edit details for ${p.name}">
            <div class="profile-item-avatar-col">
              <div class="profile-item-avatar" style="border-color: ${tier.borderColor};">
                ${initials}
                <span class="profile-status-dot ${p.isActive ? "online" : "offline"}"></span>
              </div>
            </div>
            <div class="profile-item-info-col">
              <div class="profile-item-name-row">
                <span class="profile-item-name">${p.name}</span>
                <span class="profile-mini-stamp ${isPaid ? "stamp-paid" : "stamp-free"}">${isPaid ? "PAID" : "FREE"}</span>
              </div>
              <div class="profile-item-sub-row">
                <span class="profile-item-sub">${p.referenceCode}</span>
              </div>
            </div>
          </div>
        `;
        })
        .join("");

      html += `
        <div class="sidebar-tier-group" data-tier="${tier.tierNumber}">
          <div class="sidebar-tier-header" style="border-left: 3px solid ${tier.borderColor};">
            <div class="sidebar-tier-title-group">
              <span class="sidebar-tier-icon">${tier.icon}</span>
              <span class="sidebar-tier-title">${tier.title}</span>
            </div>
            <span class="sidebar-tier-count" style="background: ${tier.badgeBg}; color: ${tier.borderColor};">${tierProfiles.length}</span>
          </div>
          <div class="sidebar-tier-items">
            ${itemsHtml}
          </div>
        </div>
      `;
    });

    this.profileDirectoryList.innerHTML = html;
  }

  _renderHeaderCard(profile, roleMode = "MASTER", anchorProfile = null) {
    // Resolve Anchor Authority Profile (Karim for Admin, Devendra for Healer, Rajesh for Trainee, Ananya for Devotee)
    const anchor =
      anchorProfile ||
      (this.allProfiles || []).find((p) => {
        if (roleMode === "HEALER") return p.profileType === "HEALER";
        if (roleMode === "TRAINEE") return p.profileType === "TRAINEE";
        if (roleMode === "DEVOTEE") return p.profileType === "DEVOTEE";
        return p.id === "prof-admin-01" || p.profileType === "ADMIN";
      }) ||
      profile;

    const isAnchorPaid = anchor.isPaid !== false && anchor.paymentStatus !== "FREE";
    const initials = (anchor.name || "SK")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const roleColors = {
      ADMIN: "var(--role-admin, #8b5cf6)",
      MASTER: "var(--role-admin, #8b5cf6)",
      HEALER: "var(--role-healer, #10b981)",
      TRAINEE: "var(--role-trainee, #f59e0b)",
      DEVOTEE: "var(--role-devotee, #3b82f6)",
    };
    const anchorColor = roleColors[anchor.profileType] || "var(--gold-400, #d4af37)";

    // 1. Synchronize Header 1 (Top Bar Session User Pill)
    const h1Pill = document.getElementById("topbar-session-user-pill");
    if (h1Pill) {
      const h1Avatar = h1Pill.querySelector("#topbar-session-avatar");
      if (h1Avatar) {
        h1Avatar.textContent = initials;
        h1Avatar.style.borderColor = anchorColor;
        h1Avatar.style.background = anchorColor;
      }
      const h1Name = h1Pill.querySelector("#topbar-session-name");
      if (h1Name) h1Name.textContent = anchor.name || "Spiritual Karim Khan";
      const h1Role = h1Pill.querySelector("#topbar-session-role");
      if (h1Role) {
        h1Role.textContent = `${anchor.profileType || "ADMIN MASTER"}`;
        h1Role.style.background = anchorColor;
      }
      const h1Sub = h1Pill.querySelector("#topbar-session-subtitle");
      if (h1Sub) {
        if (anchor.profileType === "ADMIN") {
          h1Sub.textContent = "👑 Founder Master Control";
        } else if (anchor.profileType === "HEALER") {
          h1Sub.textContent = "🛡️ Certified Healer Guide";
        } else if (anchor.profileType === "TRAINEE") {
          h1Sub.textContent = "📿 Trainee Sadhak";
        } else {
          h1Sub.textContent = "🌟 Devotee Personal Space";
        }
      }
    }

    // 2. Synchronize Header 2 (In-Body Profile Box 1 - main-profile-box-1)
    const mainBox = document.getElementById("main-profile-box-1");
    if (mainBox) {
      const pName = mainBox.querySelector("#display-profile-name");
      if (pName) pName.textContent = anchor.name || "Spiritual Karim Khan";
      const pBadge = mainBox.querySelector("#display-role-badge");
      if (pBadge) {
        pBadge.textContent = `${anchor.profileType || "ADMIN MASTER"} • LEVEL ${anchor.level || 1}`;
        pBadge.style.backgroundColor = anchorColor;
      }
      const pStatus = mainBox.querySelector("#display-status-pill");
      if (pStatus) {
        pStatus.textContent = anchor.isActive !== false ? "Active Member" : "Inactive";
        pStatus.className = `status-pill ${anchor.isActive !== false ? "active" : ""}`;
      }
      const pStamp = mainBox.querySelector("#display-payment-stamp");
      if (pStamp) {
        pStamp.className = `stamp-indicator ${isAnchorPaid ? "stamp-paid" : "stamp-free"}`;
        pStamp.textContent = isAnchorPaid ? "PAID" : "FREE";
      }
      const pInitials = mainBox.querySelector("#profile-avatar-initials");
      if (pInitials) {
        pInitials.textContent = initials;
        pInitials.style.borderColor = anchorColor;
      }
      const pRef = mainBox.querySelector("#header-ref-code-text");
      if (pRef) pRef.textContent = anchor.referenceCode || "SKHM-ADM1-7788-9900";
      const tRef = mainBox.querySelector("#telemetry-ref-code");
      if (tRef) tRef.textContent = anchor.referenceCode || "SKHM-ADM1-7788-9900";

      // Center Meta for Header 2
      const anchorJoinDate =
        anchor.joinDate || anchor.joiningDate || "2024-01-01";
      const pMasterJoin = mainBox.querySelector("#display-master-join-date");
      if (pMasterJoin) pMasterJoin.textContent = `📅 Joined: ${anchorJoinDate}`;
      const pMasterRole = mainBox.querySelector("#display-master-current-role");
      if (pMasterRole) {
        if (anchor.profileType === "ADMIN") {
          pMasterRole.textContent = `👑 Role: Admin Master (Founder)`;
        } else if (anchor.profileType === "HEALER") {
          pMasterRole.textContent = `🛡️ Role: Certified Healer Guide`;
        } else if (anchor.profileType === "TRAINEE") {
          pMasterRole.textContent = `📿 Role: Trainee Sadhak`;
        } else {
          pMasterRole.textContent = `🌟 Role: Devotee / Seeker`;
        }
      }
    }

    if (this.headerStampBadge) {
      this.headerStampBadge.className = `stamp-badge ${isAnchorPaid ? "stamp-paid" : "stamp-free"}`;
      this.headerStampBadge.textContent = isAnchorPaid ? "🟢 PAID" : "🔴 FREE";
      this.headerStampBadge.title = `Active Membership: ${isAnchorPaid ? "PAID" : "FREE"}`;
    }

    // 3. Render Card 2: Selected Downline Member Profile Card
    this.renderSelectedMemberCard(profile, anchor);
  }

  /**
   * Renders the 2nd profile card for downline member inspection
   * Center of card displays Date of Joining and Current Role.
   * EXPLICITLY NO Approval Pending button!
   */
  renderSelectedMemberCard(selectedProfile, anchorProfile = null) {
    if (!this.selectedMemberCard) {
      this.selectedMemberCard = document.getElementById("selected-member-profile-card");
    }
    if (!this.selectedMemberCard) return;

    // If no profile or if selected profile is Anchor itself, hide Card 2
    if (
      !selectedProfile ||
      (anchorProfile && selectedProfile.id === anchorProfile.id) ||
      (!anchorProfile && (selectedProfile.id === "prof-admin-01" || selectedProfile.level === 0))
    ) {
      this.selectedMemberCard.style.display = "none";
      return;
    }

    // Show Card 2 for downline members
    this.selectedMemberCard.style.display = "block";

    const initials = (selectedProfile.name || "M")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const isPaid =
      selectedProfile.isPaid !== false && selectedProfile.paymentStatus !== "FREE";
    const roleColors = {
      ADMIN: "var(--role-admin, #8b5cf6)",
      HEALER: "var(--role-healer, #10b981)",
      TRAINEE: "var(--role-trainee, #f59e0b)",
      DEVOTEE: "var(--role-devotee, #3b82f6)",
    };
    const roleBg =
      roleColors[selectedProfile.profileType] || "var(--role-devotee, #3b82f6)";

    const pAvatar = this.selectedMemberCard.querySelector("#selected-member-avatar");
    if (pAvatar) {
      pAvatar.textContent = initials;
      pAvatar.style.background = roleBg;
    }

    const pName = this.selectedMemberCard.querySelector("#selected-member-name");
    if (pName) pName.textContent = selectedProfile.name || "Selected Member";

    const pRoleBadge = this.selectedMemberCard.querySelector("#selected-member-role-badge");
    if (pRoleBadge) {
      pRoleBadge.textContent = `${selectedProfile.profileType || "DEVOTEE"} • LEVEL ${selectedProfile.level || 1}`;
      pRoleBadge.style.backgroundColor = roleBg;
    }

    const pStatus = this.selectedMemberCard.querySelector("#selected-member-status-pill");
    if (pStatus) {
      pStatus.textContent = selectedProfile.isActive !== false ? "Active Member" : "Inactive";
      pStatus.className = `status-pill ${selectedProfile.isActive !== false ? "active" : ""}`;
    }

    const pStamp = this.selectedMemberCard.querySelector("#selected-member-payment-stamp");
    if (pStamp) {
      pStamp.textContent = isPaid ? "PAID" : "FREE";
      pStamp.className = `stamp-indicator ${isPaid ? "stamp-paid" : "stamp-free"}`;
    }

    const pRef = this.selectedMemberCard.querySelector("#selected-member-ref-code");
    if (pRef) pRef.textContent = selectedProfile.referenceCode || "SKHM-XXXX-XXXX-XXXX";

    // Center Meta: Joining Date and Current Role
    const joinDate =
      selectedProfile.joinDate ||
      selectedProfile.joiningDate ||
      selectedProfile.createdAt ||
      "2024-01-01";
    const pJoin = this.selectedMemberCard.querySelector("#selected-member-join-date");
    if (pJoin) pJoin.textContent = `📅 Joined: ${joinDate}`;

    const roleNames = {
      DEVOTEE: "Devotee / Seeker",
      TRAINEE: "Trainee Sadhak",
      HEALER: "Healer Guide",
      ADMIN: "Admin Master",
      MASTER: "Admin Master",
    };
    const pCurrentRole = this.selectedMemberCard.querySelector("#selected-member-current-role");
    if (pCurrentRole) {
      pCurrentRole.textContent = `Current Role: ${roleNames[selectedProfile.profileType] || selectedProfile.profileType || "Devotee"}`;
    }

    // Dynamic Return to Anchor Button
    const returnBtn = this.selectedMemberCard.querySelector("#btn-close-selected-member-card");
    if (returnBtn) {
      const anchorTitle = (anchorProfile && anchorProfile.profileType === "HEALER") ? "Healer" : "Master";
      returnBtn.textContent = `✕ Return to ${anchorTitle}`;
      returnBtn.title = `Close Member View & Return to ${anchorTitle}`;
    }

    // STRICT GUARANTEE: Remove any approval buttons in Card 2
    const accidentalApprovalBtn = this.selectedMemberCard.querySelector(
      ".btn-approve-pairing, .header-approval-tab-btn, #main-tab-approval-btn, [data-main-tab='tab-pending-approvals']"
    );
    if (accidentalApprovalBtn) {
      accidentalApprovalBtn.remove();
    }
  }

  _populateForm(profile) {
    if (this.inputProfileType)
      this.inputProfileType.value = profile.profileType || "DEVOTEE";
    if (this.inputLevel) this.inputLevel.value = profile.level || 5;
    if (this.inputCategoryTag)
      this.inputCategoryTag.value = profile.categoryTag || "";
    if (this.inputRefCode)
      this.inputRefCode.value = profile.referenceCode || "";
    if (this.inputSponsorCode)
      this.inputSponsorCode.value = profile.referredByCode || "";
    if (this.inputTransferCode)
      this.inputTransferCode.value = profile.transferredCode || "";
    if (this.inputIsActive)
      this.inputIsActive.checked = profile.isActive !== false;

    const isPaid = profile.isPaid !== false && profile.paymentStatus !== "FREE";
    if (this.inputPaymentStatus) {
      this.inputPaymentStatus.value = isPaid ? "PAID" : "FREE";
    }
    if (this.inputJoinDate) this.inputJoinDate.value = profile.joinDate || "";

    if (this.inputName) this.inputName.value = profile.name || "";
    if (this.inputSelfTitle)
      this.inputSelfTitle.value =
        profile.lineage?.currentFamily?.selfTitle || "";
    if (this.inputPhone) this.inputPhone.value = profile.phone || "";
    if (this.inputEmail) this.inputEmail.value = profile.email || "";
    if (this.inputCity) this.inputCity.value = profile.city || "";
    if (this.inputAddress) this.inputAddress.value = profile.address || "";
    if (this.inputNotes) this.inputNotes.value = profile.notes || "";

    if (this.inputObjective)
      this.inputObjective.value = profile.objective || "";
    if (this.seekerAfflictionDuration)
      this.seekerAfflictionDuration.value =
        profile.seekerDiagnostics?.afflictionDuration || "";
    if (this.seekerKuldeviIssues)
      this.seekerKuldeviIssues.value =
        profile.seekerDiagnostics?.kuldeviIssues || "";
    if (this.seekerTargetOutcome)
      this.seekerTargetOutcome.value =
        profile.seekerDiagnostics?.targetOutcome || "";

    // Checkboxes
    const selected = new Set(profile.selectedRemedies || []);
    document.querySelectorAll('input[name="remedy-checkbox"]').forEach((cb) => {
      cb.checked = selected.has(cb.value);
    });

    // Lineage Self / Spouse
    if (this.lineageSelfName)
      this.lineageSelfName.value =
        profile.lineage?.currentFamily?.selfName || profile.name || "";
    if (this.lineageSpouseName)
      this.lineageSpouseName.value =
        profile.lineage?.currentFamily?.spouseName || "";

    // Husband
    const h = profile.lineage?.husbandAncestral || {};
    if (this.hFatherName) this.hFatherName.value = h.fatherName || "";
    if (this.hMotherName) this.hMotherName.value = h.motherName || "";
    if (this.hPaternalGf) this.hPaternalGf.value = h.paternalGrandfather || "";
    if (this.hPaternalGm) this.hPaternalGm.value = h.paternalGrandmother || "";
    if (this.hMaternalGf) this.hMaternalGf.value = h.maternalGrandfather || "";
    if (this.hMaternalGm) this.hMaternalGm.value = h.maternalGrandmother || "";
    if (this.hAddress) this.hAddress.value = h.address || "";

    // Wife
    const w = profile.lineage?.wifeAncestral || {};
    if (this.wFatherName) this.wFatherName.value = w.fatherName || "";
    if (this.wMotherName) this.wMotherName.value = w.motherName || "";
    if (this.wPaternalGf) this.wPaternalGf.value = w.paternalGrandfather || "";
    if (this.wPaternalGm) this.wPaternalGm.value = w.paternalGrandmother || "";
    if (this.wMaternalGf) this.wMaternalGf.value = w.maternalGrandfather || "";
    if (this.wMaternalGm) this.wMaternalGm.value = w.maternalGrandmother || "";
    if (this.wAddress) this.wAddress.value = w.address || "";
    if (typeof this.updateProfileCardFlipper === "function") {
      this.updateProfileCardFlipper(profile);
    }
  }

  _renderChildren(children) {
    if (!this.childrenContainer) return;
    if (children.length === 0) {
      this.childrenContainer.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No children added. Click "+ Add Child".</div>`;
      return;
    }

    this.childrenContainer.innerHTML = children
      .map(
        (c, i) => `
      <div class="dynamic-row-item" data-index="${i}">
        <input type="text" class="form-control child-name-input" placeholder="Child's Full Name" value="${c.name || ""}">
        <select class="form-control child-gender-select">
          <option value="Son" ${c.gender === "Son" ? "selected" : ""}>Son</option>
          <option value="Daughter" ${c.gender === "Daughter" ? "selected" : ""}>Daughter</option>
        </select>
        <input type="text" class="form-control child-notes-input" placeholder="Age / Notes" value="${c.ageOrNote || ""}">
        <button type="button" class="btn-remove-row btn-remove-child" data-index="${i}" title="Remove Child">✕</button>
      </div>
    `,
      )
      .join("");
  }

  _renderSiblings(container, siblings, branchKey) {
    if (!container) return;
    if (siblings.length === 0) {
      container.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No siblings recorded. Click "+ Add Sibling".</div>`;
      return;
    }

    container.innerHTML = siblings
      .map(
        (s, i) => `
      <div class="dynamic-row-item sibling" data-branch="${branchKey}" data-index="${i}">
        <input type="text" class="form-control sibling-name-input" placeholder="Sibling's Name" value="${s.name || ""}">
        <select class="form-control sibling-relation-select">
          <option value="Brother" ${s.relation === "Brother" ? "selected" : ""}>Brother</option>
          <option value="Sister" ${s.relation === "Sister" ? "selected" : ""}>Sister</option>
          <option value="Elder Brother" ${s.relation === "Elder Brother" ? "selected" : ""}>Elder Brother</option>
          <option value="Younger Brother" ${s.relation === "Younger Brother" ? "selected" : ""}>Younger Brother</option>
          <option value="Elder Sister" ${s.relation === "Elder Sister" ? "selected" : ""}>Elder Sister</option>
          <option value="Younger Sister" ${s.relation === "Younger Sister" ? "selected" : ""}>Younger Sister</option>
        </select>
        <input type="text" class="form-control sibling-spouse-input" placeholder="Spouse Name (if m.)" value="${s.spouseName || ""}">
        <input type="text" class="form-control sibling-children-input" placeholder="Children (e.g. 2 Sons)" value="${s.childrenSummary || ""}">
        <button type="button" class="btn-remove-row btn-remove-sibling" data-branch="${branchKey}" data-index="${i}" title="Remove Sibling">✕</button>
      </div>
    `,
      )
      .join("");
  }

  _renderHouseCleanCards(levels) {
    const html = levels
      .map(
        (lvl, i) => `
      <div class="houseclean-level-section" data-level="${lvl.levelNumber || i + 1}">
        <div class="houseclean-level-header">
          <span class="level-badge">Level ${lvl.levelNumber || i + 1}</span>
          <span class="level-title">${lvl.levelTitle || `Level ${lvl.levelNumber || i + 1} House Clean`}</span>
          <button type="button" class="btn btn-sm btn-outline btn-upload-level" data-level="${lvl.levelNumber || i + 1}" title="Upload House Clean Document">
            <span>📤</span> Upload Document
          </button>
        </div>
        <div class="houseclean-level-content">
          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label">Clean Status</label>
              <select class="form-control hc-status-select">
                <option value="NOT_STARTED" ${lvl.status === "NOT_STARTED" ? "selected" : ""}>Not Started</option>
                <option value="IN_PROGRESS" ${lvl.status === "IN_PROGRESS" ? "selected" : ""}>In Progress</option>
                <option value="PENDING_APPROVAL" ${lvl.status === "PENDING_APPROVAL" ? "selected" : ""}>Pending Mentor Approval</option>
                <option value="APPROVED" ${lvl.status === "APPROVED" ? "selected" : ""}>Approved & Certified</option>
                <option value="REVISION_NEEDED" ${lvl.status === "REVISION_NEEDED" ? "selected" : ""}>Needs Improvement</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Verified % Clean (0-100)</label>
              <input type="number" class="form-control hc-percentage-input" min="0" max="100" value="${lvl.cleanPercentage || 0}">
            </div>
            <div class="form-group">
              <label class="form-label">Approval Date / Timestamp</label>
              <input type="text" class="form-control hc-date-input" placeholder="e.g. 2025-02-15" value="${lvl.approvalDate || ""}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Cleansing Details & Purified Areas</label>
            <textarea class="form-control hc-details-textarea" rows="2" placeholder="Describe altar purification, salt water wash, loban...">${lvl.cleanedDetails || ""}</textarea>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Approved By Mentor Code & Name</label>
              <input type="text" class="form-control hc-mentor-input" placeholder="Mentor Name & Code" value="${lvl.mentorName ? `${lvl.mentorName} (${lvl.mentorCode || ""})` : ""}">
            </div>
            <div class="form-group">
              <label class="form-label">Mentor Remarks & Seal</label>
              <input type="text" class="form-control hc-remarks-input" placeholder="Remarks" value="${lvl.mentorRemarks || ""}">
            </div>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    if (this.devoteeHouseCleanContainer)
      this.devoteeHouseCleanContainer.innerHTML = html;
    if (this.seekerHouseCleanSummaryContainer)
      this.seekerHouseCleanSummaryContainer.innerHTML = html;
  }

  _renderInterestedSadhanas(sadhanas) {
    if (!this.interestedSadhanasContainer) return;
    if (sadhanas.length === 0) {
      this.interestedSadhanasContainer.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">
          No sadhanas in queue. Tick any Sadhana or Remedy above to automatically enroll into Trainee In-Progress!
        </div>
      `;
      return;
    }

    this.interestedSadhanasContainer.innerHTML = sadhanas
      .map((s, i) => {
        const isPaid =
          s.paymentStatus === "PAID" ||
          (s.isPaid !== false && s.paymentStatus !== "FREE");
        const sadhanaKey = s.id || s.sadhanaKey || "";
        return `
      <div class="remedy-card-option ${isPaid ? "tile-paid" : "tile-free"}" data-index="${i}" data-sadhana-id="${sadhanaKey}">
        <div class="option-content" data-sadhana-trigger="${sadhanaKey}">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="option-title">${s.name || s.title || "Enrolled Item"}</span>
            <span class="role-badge" style="background: rgba(212, 175, 55, 0.2); color: var(--gold-300); font-size: 0.65rem;">${s.category || "Sadhana"}</span>
          </div>
          <span class="option-tag">Priority: ${s.priority || "High"} &bull; Status: ${s.status || "Enrolled"}</span>
        </div>

        <div class="tile-actions-vertical">
          <input type="checkbox" class="tile-checkbox" name="remedy-checkbox" value="${sadhanaKey}" checked title="Ticked (Enrolled & Synced to Trainee)">
          <button type="button" class="btn-sadhana-info-trigger" data-sadhana-id="${sadhanaKey}" title="View Full Ritual Guide">👁️</button>
          <button type="button" class="stamp-indicator ${isPaid ? "stamp-paid" : "stamp-free"} btn-tile-stamp-toggle" data-sadhana-id="${sadhanaKey}" data-index="${i}" title="Toggle Paid/Free">${isPaid ? "PAID" : "FREE"}</button>
        </div>
      </div>
      `;
      })
      .join("");
  }

  _renderCategorizedTraineeSadhanas(sadhanas) {
    if (!sadhanas || sadhanas.length === 0) {
      const emptyMsg = `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.8rem; font-style: italic; padding: 0.5rem 0;">No active items. Tick any card in Seeker Purpose to add here.</div>`;
      if (this.traineeGroupSadhanas)
        this.traineeGroupSadhanas.innerHTML = emptyMsg;
      if (this.traineeGroupRemedies)
        this.traineeGroupRemedies.innerHTML = emptyMsg;
      if (this.traineeGroupCleansing)
        this.traineeGroupCleansing.innerHTML = emptyMsg;
      this._renderTraineeActiveDetail(null);
      return;
    }

    // Set default selected trainee item if none selected or if selected was deleted
    if (
      !this.selectedTraineeId ||
      !sadhanas.some((s) => s.id === this.selectedTraineeId)
    ) {
      this.selectedTraineeId = sadhanas[0].id;
    }

    const filterByDomain = (domainKey) =>
      sadhanas.filter((s) => {
        if (s.categoryDomain) return s.categoryDomain === domainKey;
        const cat = (s.category || s.title || "").toLowerCase();
        if (domainKey === "sadhanas")
          return (
            cat.includes("sadhana") ||
            cat.includes("yantra") ||
            cat.includes("bhairav") ||
            cat.includes("chamunda") ||
            cat.includes("diwali")
          );
        if (domainKey === "remedies")
          return (
            cat.includes("remedy") ||
            cat.includes("diya") ||
            cat.includes("court") ||
            cat.includes("business") ||
            cat.includes("trilok") ||
            cat.includes("havan") ||
            cat.includes("vastu") ||
            cat.includes("gopal") ||
            cat.includes("debt")
          );
        return (
          cat.includes("clean") ||
          cat.includes("kundalini") ||
          cat.includes("heal") ||
          cat.includes("karmic") ||
          cat.includes("nazar") ||
          cat.includes("aura")
        );
      });

    const renderDomainTiles = (items) => {
      if (items.length === 0) {
        return `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.8rem; font-style: italic; padding: 0.5rem 0;">No active items in this category. Tick any card in Seeker Purpose to add here.</div>`;
      }

      return items
        .map((ts) => {
          const isPaid = ts.isPaid !== false && ts.paymentStatus !== "FREE";
          const isSelected = ts.id === this.selectedTraineeId;
          const sadhanaKey = ts.sadhanaKey || ts.id;
          const catalogItem = SADHANA_CATALOG[sadhanaKey] || { icon: "🌿" };
          return `
        <div class="trainee-card-tile ${isPaid ? "tile-paid" : "tile-free"} ${isSelected ? "active-selected-tile" : ""}" 
             data-item-id="${ts.id}" 
             data-sadhana-key="${sadhanaKey}">
          <div class="option-content trainee-tile-select-trigger" data-item-id="${ts.id}">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 1.1rem;">${catalogItem.icon || "🌿"}</span>
              <span class="option-title">${ts.title || "In-Progress Sadhana"}</span>
            </div>
            <span class="option-tag">${ts.level || "Level 1 — Initiation"} &bull; ${ts.progressPercent || 0}%</span>
          </div>

          <div class="tile-actions-vertical">
            <input type="checkbox" class="tile-checkbox trainee-item-checkbox" data-item-id="${ts.id}" checked title="Ticked in Trainee In-Progress">
            <button type="button" class="btn-sadhana-info-trigger" data-sadhana-id="${sadhanaKey}" title="View Full Ritual Guide">👁️</button>
            <button type="button" class="stamp-indicator ${isPaid ? "stamp-paid" : "stamp-free"} btn-tile-stamp-toggle" data-item-id="${ts.id}" title="Toggle Paid/Free">${isPaid ? "PAID" : "FREE"}</button>
          </div>
        </div>
        `;
        })
        .join("");
    };

    if (this.traineeGroupSadhanas)
      this.traineeGroupSadhanas.innerHTML = renderDomainTiles(
        filterByDomain("sadhanas"),
      );
    if (this.traineeGroupRemedies)
      this.traineeGroupRemedies.innerHTML = renderDomainTiles(
        filterByDomain("remedies"),
      );
    if (this.traineeGroupCleansing)
      this.traineeGroupCleansing.innerHTML = renderDomainTiles(
        filterByDomain("cleansing"),
      );

    const activeItem =
      sadhanas.find((s) => s.id === this.selectedTraineeId) || sadhanas[0];
    this._renderTraineeActiveDetail(activeItem);
  }

  renderUniversalMemoBox({
    textareaId,
    targetItemId,
    placeholder = "Enter progress note, vibration feedback, or mentor query...",
    quickChips = [],
  }) {
    const chips =
      quickChips.length > 0
        ? quickChips
        : [
            "11 Malas Completed",
            "Daily Sunset Protocol Done",
            "Chakra Vibration Activated",
            "Peaceful Light Observed",
            "Obstacle / Smoke Cleared",
            "Requesting Mentor Attunement",
          ];

    return `
      <div class="universal-memo-box">
        <textarea id="${textareaId}" class="universal-memo-textarea" placeholder="${placeholder}"></textarea>
        
        <div class="universal-memo-toolbar">
          <button type="button" class="btn-memo-tool btn-memo-keyboard" title="Toggle Quick Chips & Keyboard Focus" data-target="${textareaId}">⌨️</button>
          <button type="button" class="btn-memo-tool btn-memo-mic" title="Voice-to-Text Input (Microphone)" data-target="${textareaId}">🎤</button>
          <button type="button" class="btn-memo-tool btn-memo-send" title="Submit Input with Date-Time Stamp" id="btn-add-trainee-memo" data-item-id="${targetItemId}">
            <svg class="send-vector-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/></svg>
          </button>
        </div>

        <div class="memo-quick-chips-wrap" id="quick-chips-${textareaId}" style="display: none;">
          ${chips.map((chip) => `<span class="memo-quick-chip" data-target="${textareaId}">${chip}</span>`).join("")}
        </div>
      </div>
    `;
  }

  _renderTraineeActiveDetail(item) {
    if (!this.traineeActiveDetailContainer) return;
    if (!item) {
      this.traineeActiveDetailContainer.innerHTML = `
        <div class="trainee-detail-card" style="text-align: center; color: var(--text-muted); padding: 3rem 1.5rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🕉️</div>
          <h4 style="font-family: var(--font-heading); color: var(--gold-400); margin-bottom: 0.5rem;">No Active Sadhana Selected</h4>
          <p style="font-size: 0.85rem;">Tick or select any Sadhana, Remedy, or Cleansing tile on the left to view graphical progress, level details, and progress memo notes.</p>
        </div>
      `;
      return;
    }

    const isPaid = item.isPaid !== false && item.paymentStatus !== "FREE";
    const sadhanaKey = item.sadhanaKey || item.id;
    const catalogItem = SADHANA_CATALOG[sadhanaKey] || {
      icon: "🌿",
      category: "Sadhana",
    };
    const progress = Math.min(
      100,
      Math.max(0, parseInt(item.progressPercent, 10) || 0),
    );
    const vStatus = item.verificationStatus || "UNVERIFIED";

    const memos =
      item.memos && item.memos.length > 0
        ? item.memos
        : [
            {
              date:
                new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }) + " 09:30 AM",
              author: "Mentor Devendra",
              text: "Initial attunement completed. Commenced daily sadhana regime.",
            },
          ];

    this.traineeActiveDetailContainer.innerHTML = `
      <div class="trainee-detail-card" data-item-id="${item.id}">
        <!-- Detail Header -->
        <div class="trainee-detail-header">
          <div class="trainee-detail-title-wrap">
            <span class="trainee-detail-icon">${catalogItem.icon || "🌿"}</span>
            <div>
              <div class="trainee-detail-title">${item.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${item.categoryDomain || catalogItem.category} &bull; Supervising Mentor: ${item.mentorCode || "SKHM-ADM1-7788-9900"}</div>
            </div>
          </div>
          <span class="stamp-indicator ${isPaid ? "stamp-paid" : "stamp-free"} btn-tile-stamp-toggle" data-item-id="${item.id}" title="Toggle Paid/Free">
            ${isPaid ? "PAID" : "FREE"}
          </span>
        </div>

        <!-- Progress Graphics Box -->
        <div class="progress-graphics-box">
          <div class="progress-metrics-row">
            <span>Overall Spiritual Completion</span>
            <span class="progress-percentage-badge">${progress}%</span>
          </div>

          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
          </div>

          <div class="progress-stats-grid">
            <div class="progress-stat-card">
              <div class="progress-stat-label">Daily Target</div>
              <div class="progress-stat-val">${item.dailyTarget || "11 Malas"}</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-label">Current Streak</div>
              <div class="progress-stat-val">${item.currentStreak || "1 Day"}</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-label">Access Type</div>
              <div class="progress-stat-val" style="color: ${isPaid ? "#10b981" : "#ef4444"};">${isPaid ? "PAID" : "FREE"}</div>
            </div>
          </div>
        </div>

        <!-- Upline Verification & Approval Seal Card -->
        <div class="upline-verification-card">
          <div class="upline-verification-header">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span>🛡️</span>
              <span style="color: var(--text-primary);">Upline Verification &amp; Seal</span>
            </div>
            
            ${
              vStatus === "VERIFIED"
                ? `<span class="verification-status-badge status-verified">🟢 Verified &amp; Sealed</span>`
                : vStatus === "PENDING_APPROVAL"
                  ? `<span class="verification-status-badge status-pending">⏳ Awaiting Upline Approval</span>`
                  : `<span class="verification-status-badge status-unverified">⚪ Self-Reported</span>`
            }
          </div>

          <div class="verification-actions-row">
            <div class="verification-info-text">
              ${
                vStatus === "VERIFIED"
                  ? `Officially approved by <strong>${item.verifiedBy || "Master Karim"}</strong> on ${item.verifiedDate || "Recently"}`
                  : vStatus === "PENDING_APPROVAL"
                    ? `Request submitted to sponsor <strong>${item.mentorCode || "SKHM-ADM1-7788-9900"}</strong> on ${item.verificationRequestedDate || "Recently"}`
                    : `Submit this sadhana progress for formal upline verification &amp; mastery seal.`
              }
            </div>

            <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              ${
                vStatus === "PENDING_APPROVAL"
                  ? `
                  <button type="button" class="btn-verify-approve" data-item-id="${item.id}" title="Approve &amp; issue official seal">
                    <span>✓</span> Approve &amp; Seal
                  </button>
                  <button type="button" class="btn btn-sm btn-danger btn-verify-reject" data-item-id="${item.id}" title="Request revision or extra practice">
                    <span>✕</span> Revision
                  </button>
                `
                  : vStatus === "VERIFIED"
                    ? `<button type="button" class="btn-verify-request" data-item-id="${item.id}" title="Submit updated progress for re-verification"><span>🔄</span> Re-Verify</button>`
                    : `<button type="button" class="btn-verify-request" data-item-id="${item.id}"><span>🛡️</span> Verify / Request Upline Approval</button>`
              }
            </div>
          </div>
        </div>

        <!-- Interactive Progress Parameters Edit Grid -->
        <div class="form-grid-2 mt-2">
          <div class="form-group">
            <label class="form-label">Advancement Level</label>
            <select class="form-control active-ts-level-select" data-item-id="${item.id}">
              <option value="Level 1 — Novice Initiation" ${item.level?.includes("Level 1") ? "selected" : ""}>Level 1 — Initiation</option>
              <option value="Level 2 — Mantra Diksha" ${item.level?.includes("Level 2") ? "selected" : ""}>Level 2 — Mantra Diksha</option>
              <option value="Level 3 — Havan & Energy Transmission" ${item.level?.includes("Level 3") ? "selected" : ""}>Level 3 — Havan Transmission</option>
              <option value="Level 4 — Master Attunement" ${item.level?.includes("Level 4") ? "selected" : ""}>Level 4 — Master Attunement</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Update Progress Percentage (%)</label>
            <input type="number" class="form-control active-ts-progress-input" data-item-id="${item.id}" min="0" max="100" value="${progress}">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Daily Target Malas / Reps</label>
            <input type="text" class="form-control active-ts-target-input" data-item-id="${item.id}" value="${item.dailyTarget || "11 Malas Daily"}">
          </div>
          <div class="form-group">
            <label class="form-label">Active Practice Streak</label>
            <input type="text" class="form-control active-ts-streak-input" data-item-id="${item.id}" value="${item.currentStreak || "1 Day"}">
          </div>
        </div>

        <!-- Feedback & Progress Memo Timeline -->
        <div class="memo-section-wrap mt-2">
          <div class="memo-section-title">
            <span>💬 Feedback, Vibrations &amp; Progress Memo Log</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 400;">(${memos.length} Entries)</span>
          </div>

          <div class="memo-timeline-container" id="trainee-memo-timeline">
            ${memos
              .map(
                (m) => `
              <div class="memo-timeline-item ${m.type === "VERIFIED" ? "verification-log" : m.type === "PENDING" ? "pending-log" : ""}">
                <div class="memo-meta">
                  <strong style="color: ${m.type === "VERIFIED" ? "#10b981" : m.type === "PENDING" ? "#f59e0b" : "var(--gold-400)"};">
                    ${m.author || "Sadhak / Mentor"}
                  </strong>
                  <span>📅 ${m.date || "Just now"}</span>
                </div>
                <div class="memo-text">${m.text || ""}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <!-- Universal Memo Box with Keyboard, Speech-to-Text Mic, and Send Submit -->
          <div class="mt-2">
            ${this.renderUniversalMemoBox({
              textareaId: "trainee-new-memo-text",
              targetItemId: item.id,
              placeholder:
                "Enter progress memo, spiritual feedback, or mentor question (Use 🎤 Mic for voice)...",
              quickChips: [
                "11 Malas Completed Today",
                "Sunset 3-Diya Havan Done",
                "Deep Third Eye Vibration Felt",
                "All Domestic Heavy Vibes Cleared",
                "Streak Maintained Unbroken",
                "Requesting Next Level Diksha",
              ],
            })}
          </div>
        </div>
      </div>
    `;
  }

  _renderHealerCompleted(completed) {
    if (!this.healerCompletedSadhanasContainer) return;
    if (completed.length === 0) {
      this.healerCompletedSadhanasContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-style: italic; padding: 2rem;">No master completed sadhana credentials recorded. Click "+ Add Completed Sadhana Credential".</div>`;
      return;
    }

    this.healerCompletedSadhanasContainer.innerHTML = completed
      .map(
        (h, i) => `
      <div class="sadhana-progress-card completed" data-index="${i}">
        <div class="sadhana-card-top">
          <span class="role-badge" style="background: var(--gold-500); color: #0b0714;">${h.levelCompleted || "Level 4 — Master Guru"}</span>
          <button type="button" class="btn btn-sm btn-danger btn-delete-healer-sadhana" data-index="${i}">Delete</button>
        </div>

        <div class="form-group">
          <label class="form-label">Master Sadhana Title</label>
          <input type="text" class="form-control hc-comp-title-input" value="${h.title || ""}" placeholder="Title">
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Status</label>
            <input type="text" class="form-control hc-comp-status-input" value="${h.status || "Certified Master"}" placeholder="Status">
          </div>
          <div class="form-group">
            <label class="form-label">Completion Date</label>
            <input type="text" class="form-control hc-comp-date-input" value="${h.completionDate || ""}" placeholder="YYYY-MM-DD">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Seekers Guided</label>
            <input type="number" class="form-control hc-comp-count-input" value="${h.seekersGuidedCount || 0}">
          </div>
          <div class="form-group">
            <label class="form-label">Validation Seal Code</label>
            <input type="text" class="form-control hc-comp-seal-input font-mono" value="${h.sealCode || ""}" placeholder="SKHM-SEAL-XXX">
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  }

  _renderHealerNetwork(network) {
    if (!this.healerNetworkContainer) return;
    if (network.length === 0) {
      this.healerNetworkContainer.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No devotees linked yet. Click "+ Link Devotee".</div>`;
      return;
    }

    this.healerNetworkContainer.innerHTML = network
      .map(
        (n, i) => `
      <div class="dynamic-row-item" data-index="${i}">
        <input type="text" class="form-control net-name-input" placeholder="Devotee/Seeker Name" value="${n.name || ""}">
        <input type="text" class="form-control net-code-input font-mono" placeholder="16-Digit Code" value="${n.refCode || ""}">
        <input type="text" class="form-control net-role-input" placeholder="Role / Level" value="${n.role || ""}">
        <button type="button" class="btn-remove-row btn-remove-network-devotee" data-index="${i}" title="Unlink Devotee">✕</button>
      </div>
    `,
      )
      .join("");
  }

  // Enforce 4-Tier Role-Based Access Control (RBAC) & Hierarchy Visibility Matrix
  enforceRBAC(roleMode = "MASTER", settings = {}) {
    const isMaster = roleMode === "MASTER" || roleMode === "ADMIN";
    const isHealer = roleMode === "HEALER";
    const isTrainee = roleMode === "TRAINEE";
    const isDevotee = roleMode === "DEVOTEE";

    // 1. App Hierarchy Tiers Legend Visibility (Image 1)
    // Master: 1, 2, 3, 4
    // Healer: 2, 3, 4 (hide 1)
    // Trainee: 3, 4 (hide 1, 2)
    // Devotee: 4 only (hide 1, 2, 3)
    document
      .querySelectorAll("#hierarchy-legend-container .legend-item")
      .forEach((item) => {
        const tier = parseInt(item.getAttribute("data-tier"), 10);
        let show = false;
        if (isMaster) show = true;
        else if (isHealer) show = tier >= 2;
        else if (isTrainee) show = tier >= 3;
        else if (isDevotee) show = tier === 4;

        item.style.display = show ? "flex" : "none";
      });

    // 2. Dedicated Portals Visibility (Image 3)
    // Master: 1, 2, 3, 4
    // Healer: 2, 3, 4 (hide 1)
    // Trainee: 3, 4 (hide 1, 2)
    // Devotee: 4 (hide 1, 2, 3)
    document
      .querySelectorAll("#sidebar-dedicated-portals .sub-portal-link")
      .forEach((link) => {
        const tier = parseInt(link.getAttribute("data-portal-tier"), 10);
        let show = false;
        if (isMaster) show = true;
        else if (isHealer) show = tier >= 2;
        else if (isTrainee) show = tier >= 3;
        else if (isDevotee) show = tier === 4;

        link.style.display = show ? "flex" : "none";
      });

    // 3. Multilevel Organization Hub (in Healer Connect tab)
    // Metric Pills:
    const adminMetric = document.querySelector(
      ".metric-pill-item.metric-admin",
    );
    const healerMetric = document.querySelector(
      ".metric-pill-item.metric-healers",
    );
    const traineeMetric = document.querySelector(
      ".metric-pill-item.metric-trainees",
    );
    const devoteeMetric = document.querySelector(
      ".metric-pill-item.metric-devotees",
    );

    if (adminMetric) adminMetric.style.display = isMaster ? "flex" : "none";
    if (healerMetric)
      healerMetric.style.display = isMaster || isHealer ? "flex" : "none";
    if (traineeMetric)
      traineeMetric.style.display =
        isMaster || isHealer || isTrainee ? "flex" : "none";
    if (devoteeMetric) devoteeMetric.style.display = "flex";

    // Filter Chips:
    document
      .querySelectorAll("#healers-filter-chips-container .healer-filter-chip")
      .forEach((chip) => {
        const chipType = chip.getAttribute("data-type");
        let show = true;
        if (chipType === "ADMIN") show = isMaster;
        else if (chipType === "HEALER") show = isMaster || isHealer;
        else if (chipType === "TRAINEE")
          show = isMaster || isHealer || isTrainee;
        else if (chipType === "DEVOTEE" || chipType === "ALL") show = true;

        chip.style.display = show ? "inline-block" : "none";
      });

    // 4. Delete & Modification Restrictions
    const allowDelete =
      isMaster ||
      (isHealer && settings.healerCanDeleteTeam !== false) ||
      (isDevotee && settings.allowDevoteeDelete === true);
    const deleteSelectors = [
      "#btn-delete-profile",
      ".btn-delete-houseclean",
      ".btn-remove-interested-sadhana",
      ".btn-delete-trainee-item",
      ".btn-delete-healer-sadhana",
      ".btn-remove-network-devotee",
      ".btn-remove-child",
      ".btn-remove-sibling",
    ];
    deleteSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((btn) => {
        if (!allowDelete) {
          btn.classList.add("permission-locked");
          btn.setAttribute(
            "title",
            "🔒 Deletion locked for role mode. (Can be enabled in Admin Settings)",
          );
          btn.disabled = true;
        } else {
          btn.classList.remove("permission-locked");
          btn.removeAttribute("title");
          btn.disabled = false;
        }
      });
    });

    // 5. Admin Settings button access
    if (this.btnAdminSettings) {
      if (!isMaster) {
        this.btnAdminSettings.style.opacity = "0.5";
        this.btnAdminSettings.title =
          "Admin Settings (Restricted to Master role)";
      } else {
        this.btnAdminSettings.style.opacity = "1";
        this.btnAdminSettings.title = "Open Master Admin & RBAC Settings";

        const rbacMatrixBtns = [
          document.getElementById("btn-open-rbac-matrix"),
          document.getElementById("sidebar-btn-rbac-matrix"),
        ];
        rbacMatrixBtns.forEach((btn) => {
          if (btn) btn.style.display = isMaster ? "inline-flex" : "none";
        });
      }
    }

    // 6. Header Portal Badge & Document Portal Mode
    document.body.setAttribute("data-portal-mode", roleMode.toLowerCase());
    const headerBadge = document.getElementById("header-portal-badge");
    if (headerBadge) {
      if (isMaster) headerBadge.innerHTML = "👑 Master Control";
      else if (isHealer) headerBadge.innerHTML = "🛡️ Healer Portal";
      else if (isTrainee) headerBadge.innerHTML = "📿 Trainee Sadhak Portal";
      else if (isDevotee) headerBadge.innerHTML = "🌟 Devotee Portal";
    }

    // 7. Address Bar URL Synchronization
    this.syncAddressBarUrl(roleMode);
  }

  syncAddressBarUrl(roleMode) {
    try {
      const mode = (roleMode || "MASTER").toLowerCase();
      const currentUrl = new URL(window.location.href);
      const currentRole = currentUrl.searchParams.get("role");

      let roleParamVal = "admin";
      if (mode === "healer") roleParamVal = "healer";
      else if (mode === "trainee") roleParamVal = "trainee";
      else if (mode === "devotee") roleParamVal = "devotee";

      if (currentRole !== roleParamVal) {
        currentUrl.searchParams.set("role", roleParamVal);
        window.history.replaceState(
          { role: roleParamVal },
          "",
          currentUrl.toString(),
        );
      }
    } catch (e) {
      console.warn("Could not sync address bar URL", e);
    }
  }

  // Slide-out Drawer Rendering
  openSadhanaDrawer(sadhanaKey) {
    const item = SADHANA_CATALOG[sadhanaKey] || SADHANA_CATALOG.sri_yantra;
    if (this.sadhanaDrawerTitle)
      this.sadhanaDrawerTitle.textContent = item.title;
    if (this.sadhanaDrawerCategory)
      this.sadhanaDrawerCategory.textContent = `${item.category} ? ${item.levelScope}`;
    if (this.sadhanaDrawerIcon) this.sadhanaDrawerIcon.textContent = item.icon;

    if (this.sadhanaDrawerBody) {
      this.sadhanaDrawerBody.innerHTML = `
        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>🌟</span> Spiritual Essence &amp; Overview</div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${item.summary}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>🕉️</span> Sacred Beej Mantra &amp; Frequency</div>
          <div class="sadhana-mantra-box">
            <div class="sadhana-mantra-text">${item.mantra}</div>
            <button type="button" class="btn btn-sm btn-outline btn-copy-drawer-mantra" data-mantra="${encodeURIComponent(item.mantra)}">📋 Copy</button>
          </div>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>â°</span> Auspicious Timing &amp; Aasan Direction</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.35rem;"><strong>Timing:</strong> ${item.timing}</p>
          <p style="font-size: 0.88rem; color: var(--text-secondary);"><strong>Aasan &amp; Direction:</strong> ${item.aasanDirection}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>🌿</span> Essential Consecrated Ingredients (Samagri)</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${item.ingredients}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>📜</span> Step-by-Step Ritual Protocol</div>
          <ol class="sadhana-steps-list">
            ${item.steps.map((st) => `<li>${st}</li>`).join("")}
          </ol>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>🛡️</span> Key Benefits &amp; Astral Protection</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${item.benefits}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title" style="color: #ff6b6b;"><span>⚠️</span> Rules &amp; Strict Cautions</div>
          <p style="font-size: 0.88rem; color: #ff9b9b; line-height: 1.5;">${item.cautions}</p>
        </div>
      `;

      // Bind copy mantra
      const copyBtn = this.sadhanaDrawerBody.querySelector(
        ".btn-copy-drawer-mantra",
      );
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          const text = decodeURIComponent(copyBtn.getAttribute("data-mantra"));
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = "✓ Copied!";
            setTimeout(() => {
              copyBtn.textContent = "📋 Copy";
            }, 2000);
          });
        });
      }
    }

    if (this.btnDrawerEnroll)
      this.btnDrawerEnroll.setAttribute("data-sadhana-key", item.id);
    if (this.btnDrawerSendTrainee)
      this.btnDrawerSendTrainee.setAttribute("data-sadhana-key", item.id);

    if (this.sadhanaDrawer) {
      this.sadhanaDrawer.classList.add("open");
      this.sadhanaDrawer.setAttribute("aria-hidden", "false");
    }
    if (this.sadhanaDrawerBackdrop)
      this.sadhanaDrawerBackdrop.classList.add("open");
  }

  closeSadhanaDrawer() {
    if (this.sadhanaDrawer) {
      this.sadhanaDrawer.classList.remove("open");
      this.sadhanaDrawer.setAttribute("aria-hidden", "true");
    }
    if (this.sadhanaDrawerBackdrop)
      this.sadhanaDrawerBackdrop.classList.remove("open");
  }

  toggleGoliGyanModal(forceState) {
    if (!this.goliGyanModal) return;
    const isOpen =
      typeof forceState === "boolean"
        ? forceState
        : !this.goliGyanModal.classList.contains("open");
    if (isOpen) {
      this.goliGyanModal.classList.add("open");
      this.goliGyanModal.setAttribute("aria-hidden", "false");
    } else {
      this.goliGyanModal.classList.remove("open");
      this.goliGyanModal.setAttribute("aria-hidden", "true");
    }
  }

  toggleRbacMatrixModal(forceState) {
    const modal = document.getElementById("rbac-access-matrix-modal");
    if (!modal) return;
    const isOpen =
      typeof forceState === "boolean"
        ? forceState
        : !modal.classList.contains("open") &&
          !modal.classList.contains("is-open");
    if (isOpen) {
      modal.classList.add("open", "is-open");
      modal.setAttribute("aria-hidden", "false");
    } else {
      modal.classList.remove("open", "is-open");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  toggleSettingsModal(forceState) {
    if (!this.adminSettingsModal) return;
    const isOpen =
      typeof forceState === "boolean"
        ? forceState
        : !this.adminSettingsModal.classList.contains("open");
    if (isOpen) {
      this.adminSettingsModal.classList.add("open");
      this.adminSettingsModal.setAttribute("aria-hidden", "false");
    } else {
      this.adminSettingsModal.classList.remove("open");
      this.adminSettingsModal.setAttribute("aria-hidden", "true");
    }
  }

  toggleSharePairingModal(forceState) {
    const modal =
      this.sharePairingModal || document.getElementById("share-pairing-modal");
    if (!modal) return;
    this.sharePairingModal = modal;
    const isOpen =
      typeof forceState === "boolean"
        ? forceState
        : !modal.classList.contains("open");
    if (isOpen) {
      modal.classList.add("open", "is-open");
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
    } else {
      modal.classList.remove("open", "is-open");
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  }

  renderSharePairingModal(profile, invites = []) {
    const body = document.getElementById("share-pairing-modal-body");
    if (!body || !profile) return;

    const sponsorCode = profile.referenceCode || "SKHM-ADM1-7788-9900";
    const cleanCode = sponsorCode.replace(/[^a-zA-Z0-9]/g, "");
    const activePin = (
      100000 +
      (Math.abs(
        sponsorCode.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31,
      ) %
        900000)
    ).toString();

    // Official Installation & Release Links
    const apkDownloadUrl =
      "https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk";
    const repoUrl = "https://github.com/jDroid-X/SpritualKarim";
    const origin = window.location.origin || "";
    const pathPrefix = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    const joinUrl = `${origin}${pathPrefix}/join.html?sponsor=${encodeURIComponent(sponsorCode)}`;
    const webPortalUrl =
      "https://jdroid-x.github.io/SpritualKarim/SpritualKarimWeb/";
    const telegramBotHandle = "SpiritualKarimBot";
    const telegramLink = `https://t.me/${telegramBotHandle}?start=pair_${cleanCode}_${activePin}`;

    const payloadText = `🕉️ SPIRITUAL KARIM • SACRED LINEAGE PAIRING INVITE

Mentor: ${profile.name || "Karim Ji"} (Level ${profile.level || 1})
16-Digit Reference Code: ${sponsorCode}

Connection Type: Downline Member (Level-Down Seekers & Trainees)
Assigned Role: Devotee (Personal & Lineage Sadhana)

Direct Induction Link: ${joinUrl}
Activation Pairing PIN: ${activePin}
Telegram Bot Pairing: ${telegramLink}

⌛ Link Validity: Valid for 24 Hours only (Upline approval required).
📦 Direct Release APK: ${apkDownloadUrl}
🌐 Online Web Portal: ${webPortalUrl}
🌐 GitHub Repository & Updates: ${repoUrl}

Installation & Activation Steps:
1. Open the Direct Induction Link: ${joinUrl}
2. Your sponsor code (${sponsorCode}) is automatically filled.
3. Once validated, your upline mentor confirms activation to begin real-time lineage synchronization!`;

    const encodedPayload = encodeURIComponent(payloadText);
    const encodedApk = encodeURIComponent(apkDownloadUrl);

    body.innerHTML = `
      <!-- Prominent Direct Devotee Registration Link (Click to Copy & Add Profiles) -->
      <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(212, 175, 55, 0.12)); border: 1.5px solid #10b981; border-radius: 0.65rem; padding: 0.9rem 1.15rem; margin-bottom: 1rem; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.82rem; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.4rem;">
            <span>🔗</span> Direct Devotee Registration &amp; Onboarding Link
          </span>
          <span style="font-size: 0.72rem; color: var(--gold-400); font-weight: 600;">Auto-fills Sponsor ${sponsorCode}</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0 0 0.5rem 0;">Share this link to onboard new Devotees, Seekers, or Trainees into your downline:</p>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <input type="text" id="input-direct-devotee-link" readonly value="${joinUrl}" style="flex: 1; min-width: 240px; font-family: var(--font-mono, monospace); font-size: 0.8rem; padding: 0.5rem 0.75rem; background: rgba(0,0,0,0.35); border: 1px solid var(--border-color); border-radius: 4px; color: #f0fdf4;">
          <button type="button" class="btn btn-sm btn-gold" id="btn-copy-direct-devotee-link" data-link="${joinUrl}" title="Copy Direct Registration Link to Clipboard" style="font-weight: 700; display: flex; align-items: center; gap: 0.35rem; white-space: nowrap; padding: 0.5rem 0.9rem;">
            📋 Copy Link
          </button>
          <button type="button" class="btn btn-sm btn-gold" id="btn-open-new-devotee-modal" title="Generate Fresh Devotee Joining Link with Dual Codes" style="font-weight: 700; display: flex; align-items: center; gap: 0.35rem; white-space: nowrap; padding: 0.5rem 0.9rem; background: linear-gradient(135deg, #10b981, #059669); border-color: #10b981; color: #fff;">
            ✨ New Devotee
          </button>
        </div>
      </div>

      <!-- Fresh Devotee Dual-Code Popup Modal Overlay -->
      <div id="modal-fresh-devotee-joining" style="display: none; position: fixed; inset: 0; background: rgba(5, 2, 10, 0.85); backdrop-filter: blur(8px); z-index: 99999; align-items: center; justify-content: center; padding: 1rem;">
        <div style="background: var(--bg-card, #120b1e); border: 1.5px solid var(--gold-400, #d4af37); border-radius: 12px; max-width: 540px; width: 100%; padding: 1.5rem; box-shadow: 0 16px 40px rgba(0,0,0,0.8); position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212, 175, 55, 0.25); padding-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.25rem;">✨</span>
              <h3 style="margin: 0; font-size: 1.05rem; color: var(--gold-400, #d4af37); font-weight: 800;">Fresh Devotee Pairing Link</h3>
            </div>
            <button type="button" id="btn-close-fresh-devotee-modal" style="background: transparent; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; padding: 0.2rem 0.5rem;">✕</button>
          </div>
          
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0 0 1rem 0;">
            A fresh Devotee 16-digit slot has been provisioned and bound to your Sponsor Lineage. Share this joining link with the new devotee:
          </p>

          <!-- Dual Codes Display Cards -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; padding: 0.75rem;">
              <div style="font-size: 0.65rem; color: var(--gold-400); text-transform: uppercase; font-weight: 700; margin-bottom: 0.25rem;">1. Mentor / Sponsor Code</div>
              <div id="display-fresh-sponsor-code" style="font-family: var(--font-mono, monospace); font-size: 0.85rem; font-weight: 800; color: #fff; letter-spacing: 1px;">${sponsorCode}</div>
            </div>
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 0.75rem;">
              <div style="font-size: 0.65rem; color: #10b981; text-transform: uppercase; font-weight: 700; margin-bottom: 0.25rem;">2. New Devotee Code</div>
              <div id="display-fresh-devotee-code" style="font-family: var(--font-mono, monospace); font-size: 0.85rem; font-weight: 800; color: #34d399; letter-spacing: 1px;">GENERATING...</div>
            </div>
          </div>

          <!-- Fresh Joining URL Input -->
          <div style="margin-bottom: 1.25rem;">
            <label style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; font-weight: 600;">Full Induction URL (24-Hour Validity):</label>
            <input type="text" id="input-fresh-devotee-url" readonly value="" style="width: 100%; box-sizing: border-box; font-family: var(--font-mono, monospace); font-size: 0.78rem; padding: 0.6rem 0.75rem; background: rgba(0,0,0,0.5); border: 1px solid var(--border-color); border-radius: 6px; color: #f0fdf4;">
          </div>

          <!-- Buttons: Copy & Open -->
          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
            <button type="button" class="btn btn-sm btn-gold" id="btn-copy-fresh-devotee-link" style="font-weight: 800; padding: 0.6rem 1.15rem; display: flex; align-items: center; gap: 0.4rem;">
              📋 Copy Link &amp; Text
            </button>
            <a href="#" target="_blank" id="btn-open-fresh-devotee-link" class="btn btn-sm btn-outline" style="font-weight: 700; padding: 0.6rem 1rem; display: flex; align-items: center; gap: 0.4rem; text-decoration: none; border-color: #10b981; color: #10b981;">
              🚀 Open Link
            </a>
          </div>

          <div style="margin-top: 1rem; font-size: 0.7rem; color: var(--text-muted); line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.65rem;">
            ℹ️ When opened before approval, the link will show <strong>Approval Still Pending</strong> with a live 24h countdown. Once approved, opening the link displays <strong>Approved</strong> with the <strong>Next</strong> button to enter the devotee portal.
          </div>
        </div>
      </div>

      <!-- 1. Source Code Display Banner (Matching Android App Surface) -->
      <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 0.65rem; padding: 0.85rem 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div style="font-size: 0.7rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.05em;">YOUR 16-DIGIT SPONSOR CODE</div>
          <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); letter-spacing: 1.5px;">${sponsorCode}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="role-badge" style="background: var(--gold-500); color: #0b0714; font-weight: 800;">L${profile.level || 1} ${profile.profileType || "MENTOR"}</span>
          <button type="button" class="btn btn-xs btn-outline" id="btn-copy-sponsor-only" data-code="${sponsorCode}" title="Copy 16-digit code">
            📋 Copy Code
          </button>
        </div>
      </div>

      <!-- 2. Connection Relationship & Verification Channels (Android Segmented Controls) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.85rem; margin-bottom: 1rem;">
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 0.5rem; padding: 0.75rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-400); margin-bottom: 0.4rem;">1. Connection Relationship</div>
          <label style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.8rem; margin-bottom: 0.35rem; cursor: pointer;">
            <input type="radio" name="share-conn-type" value="downline" checked>
            <span>Downline Member (Level-Down Seekers)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.8rem; cursor: pointer;">
            <input type="radio" name="share-conn-type" value="parallel">
            <span>Parallel Co-Mentor (Healer-to-Healer)</span>
          </label>
        </div>

        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 0.5rem; padding: 0.75rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-400); margin-bottom: 0.4rem;">2. Verification Method &amp; PIN</div>
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 0.4rem; padding: 0.4rem 0.65rem;">
            <div>
              <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Generated Activation PIN</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #10b981; font-family: var(--font-mono); letter-spacing: 2px;">${activePin}</div>
            </div>
            <button type="button" class="btn btn-xs btn-outline" id="btn-copy-pin-only" data-pin="${activePin}" title="Copy PIN">
              📋
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Official App Installation & Repository Badges -->
      <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 0.65rem; padding: 0.85rem 1rem; margin-bottom: 1rem;">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--gold-400); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
          <span>📦</span> Official App Installation &amp; Online Links
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.6rem;">
          <a href="${apkDownloadUrl}" target="_blank" class="btn btn-sm btn-gold" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.8rem; text-decoration: none;" title="Download Android APK">
            <span>📥</span> Direct APK Download
          </a>
          <a href="${webPortalUrl}" target="_blank" class="btn btn-sm btn-outline" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.8rem; text-decoration: none;" title="Open Web Portal">
            <span>🌐</span> Online Web App
          </a>
          <a href="${telegramLink}" target="_blank" class="btn btn-sm btn-outline" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.8rem; text-decoration: none;" title="Open Telegram Bot Pairing">
            <span>✈️</span> Telegram Pairing Bot
          </a>
          <a href="${repoUrl}" target="_blank" class="btn btn-sm btn-outline" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.8rem; text-decoration: none;" title="View GitHub Source">
            <span>💻</span> GitHub Repository
          </a>
        </div>
      </div>

      <!-- 4. Multi-Channel Instant Share Buttons -->
      <div style="margin-bottom: 1rem;">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.4rem;">3. Share Invitation via Apps:</div>
        <div class="share-channels-grid">
          <a href="https://api.whatsapp.com/send?text=${encodedPayload}" target="_blank" class="btn-share-channel btn-share-whatsapp" title="Share via WhatsApp">
            <span>💬</span> <span>WhatsApp</span>
          </a>
          <a href="https://t.me/share/url?url=${encodedApk}&text=${encodedPayload}" target="_blank" class="btn-share-channel btn-share-telegram" title="Share via Telegram">
            <span>✈️</span> <span>Telegram</span>
          </a>
          <a href="sms:?body=${encodedPayload}" class="btn-share-channel btn-share-sms" title="Send SMS Invite">
            <span>📱</span> <span>SMS</span>
          </a>
          <button type="button" class="btn-share-channel btn-share-copy" id="btn-copy-pairing-payload" data-payload="${encodeURIComponent(payloadText)}" title="Copy Full Invite Text">
            <span>📋</span> <span>Copy Full Invite</span>
          </button>
        </div>
      </div>

      <!-- 5. Formatted Shareable Invitation Preview -->
      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">Shareable Invitation Payload (Monospace Preview):</div>
        <pre style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-sm); padding: 0.85rem; font-size: 0.76rem; font-family: var(--font-mono); color: var(--text-secondary); white-space: pre-wrap; max-height: 130px; overflow-y: auto;">${payloadText}</pre>
      </div>

      <!-- 6. 24-Hour Pending Approvals Section -->
      <div class="pending-approvals-card">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); font-family: var(--font-heading);">
            ⏳ Pending Seeker Hierarchy Approvals (24-Hour Protocol)
          </div>
          <button type="button" class="btn btn-sm btn-outline" id="btn-simulate-new-seeker" style="font-size: 0.75rem;">
            + Test New Seeker Request
          </button>
        </div>
        <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem 0;">
          Seekers who enter your sponsor code enter a 24-hour verification window. Approve within 24 hours to promote to your downline hierarchy.
        </p>

        <div style="overflow-x: auto;">
          <table class="pending-approvals-table" id="table-pending-approvals">
            <thead>
              <tr>
                <th>Seeker Name / Phone</th>
                <th>Device Model</th>
                <th>24h Countdown Timer</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="tbody-pending-approvals"></tbody>
          </table>
        </div>
      </div>
    `;

    this.renderPendingApprovalsRows(invites);

    const copyDirectLinkBtn = body.querySelector("#btn-copy-direct-devotee-link");
    if (copyDirectLinkBtn) {
      copyDirectLinkBtn.addEventListener("click", () => {
        const link = copyDirectLinkBtn.getAttribute("data-link") || "";
        if (navigator.clipboard && link) {
          navigator.clipboard.writeText(link).then(() => {
            this.showToast("✓ Copied Devotee Registration Link to clipboard!", "success");
          }).catch(() => {
            const input = body.querySelector("#input-direct-devotee-link");
            if (input) { input.select(); document.execCommand("copy"); }
            this.showToast("✓ Copied Devotee Registration Link to clipboard!", "success");
          });
        }
      });
    }

    const copyBtn = body.querySelector("#btn-copy-pairing-payload");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const text = decodeURIComponent(
          copyBtn.getAttribute("data-payload") || "",
        );
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast(
              "✓ Full 24-Hour Pairing Invite copied to clipboard!",
            );
          });
        }
      });
    }

    const copySponsorBtn = body.querySelector("#btn-copy-sponsor-only");
    if (copySponsorBtn) {
      copySponsorBtn.addEventListener("click", () => {
        const code = copySponsorBtn.getAttribute("data-code") || "";
        if (navigator.clipboard && code) {
          navigator.clipboard.writeText(code).then(() => {
            this.showToast(`📋 Sponsor Code copied: ${code}`);
          });
        }
      });
    }

    const copyPinBtn = body.querySelector("#btn-copy-pin-only");
    if (copyPinBtn) {
      copyPinBtn.addEventListener("click", () => {
        const pin = copyPinBtn.getAttribute("data-pin") || "";
        if (navigator.clipboard && pin) {
          navigator.clipboard.writeText(pin).then(() => {
            this.showToast(`🔑 Activation PIN copied: ${pin}`);
          });
        }
      });
    }
  }

  renderPendingApprovalsRows(invites = []) {
    const tbody = document.getElementById("tbody-pending-approvals");
    if (!tbody) return;

    if (!invites || invites.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1rem;">No pending approvals right now. Share your sponsor code to invite seekers!</td></tr>`;
      return;
    }

    const now = Date.now();
    const inviteTtl = (window.ProfileModel && window.ProfileModel.settings && window.ProfileModel.settings.inviteExpiryHours) ? window.ProfileModel.settings.inviteExpiryHours * 3600 * 1000 : 86400000;
    tbody.innerHTML = invites
      .map((inv) => {
        const remainingMs =
          (inv.expiresAtMs || inv.createdAtMs + inviteTtl) - now;
        const isExpired = inv.status === "PENDING" && remainingMs <= 0;
        const isApproved = inv.status === "APPROVED";

        const resubmitCount = inv.resubmitCount || 0;
        const resubmitBadge = resubmitCount > 0
          ? `<span style="display:inline-block; font-size:0.65rem; padding:0.1rem 0.35rem; background:rgba(245, 158, 11, 0.2); color:#f59e0b; border:1px solid rgba(245,158,11,0.4); border-radius:3px; margin-top:2px;" title="Application expired and renewed ${resubmitCount} time(s)">⌛ Expired ${resubmitCount}x</span>`
          : "";

        let timerBadgeHtml = "";
        if (isApproved) {
          timerBadgeHtml = `<span class="countdown-timer-badge countdown-approved">🟢 Approved &amp; Linked</span>`;
        } else if (isExpired) {
          timerBadgeHtml = `<span class="countdown-timer-badge countdown-expired">⌛ Expired (Window Ended)</span>`;
        } else {
          const hours = Math.floor(remainingMs / (1000 * 60 * 60));
          const mins = Math.floor(
            (remainingMs % (1000 * 60 * 60)) / (1000 * 60),
          );
          const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
          const pad = (n) => String(n).padStart(2, "0");
          timerBadgeHtml = `<span class="countdown-timer-badge countdown-live" data-expires="${inv.expiresAtMs || inv.createdAtMs + inviteTtl}">⏳ ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s</span>`;
        }

        let actionsHtml = "";
        if (isApproved) {
          actionsHtml = `<span style="color: #10b981; font-weight: 700; font-size: 0.8rem;">✓ Linked as ${inv.assignedRole || "Devotee"}</span>`;
        } else if (isExpired) {
          actionsHtml = `<button type="button" class="btn btn-sm btn-outline btn-resend-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem;">🔄 Resend Window</button>`;
        } else {
          actionsHtml = `
          <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
            <select class="select-pairing-role" data-invite-id="${inv.id}" style="font-size: 0.72rem; padding: 0.2rem 0.35rem; background: rgba(0,0,0,0.45); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px; font-weight: 600;">
              <option value="DEVOTEE" ${(!inv.assignedRole || inv.assignedRole === "DEVOTEE") ? "selected" : ""}>Devotee (L5)</option>
              <option value="TRAINEE" ${inv.assignedRole === "TRAINEE" ? "selected" : ""}>Trainee (L3)</option>
              <option value="HEALER" ${inv.assignedRole === "HEALER" ? "selected" : ""}>Healer (L2)</option>
            </select>
            <button type="button" class="btn btn-sm btn-gold btn-approve-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; font-weight: 700;">✓ Approve</button>
            <button type="button" class="btn btn-sm btn-outline btn-review-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; color: var(--gold-400);" title="Review with Multi-Option Decision Dialog">⚖️ Review</button>
            <button type="button" class="btn btn-sm btn-outline btn-reject-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; color: #ef4444;">✕</button>
          </div>
        `;
        }

        return `
        <tr data-invite-row="${inv.id}">
          <td>
            <div style="font-weight: 700; color: var(--text-primary);">${inv.seekerName || "Seeker"}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">${inv.seekerPhone || "No Phone"}</div>
            ${inv.devoteeCode ? `<div style="font-size: 0.68rem; color: var(--gold-400); font-family: var(--font-mono);">${inv.devoteeCode}</div>` : ""}
          </td>
          <td>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${inv.seekerDeviceModel || "Android Device"}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${inv.formattedCreatedTime || "Recent"}</div>
          </td>
          <td>
            ${timerBadgeHtml}
            ${resubmitBadge ? `<br>${resubmitBadge}` : ""}
          </td>
          <td><span class="verification-status-badge ${isApproved ? "status-verified" : isExpired ? "status-unverified" : "status-pending"}">${inv.status}</span></td>
          <td>${actionsHtml}</td>
        </tr>
      `;
      })
      .join("");
  }

  populateSettings(settings) {
    const s = {
      defaultMentorName: "Spiritual Karim Khan (Founder)",
      defaultMentorCode: "SKHM-ADM1-7788-9900",
      speechLang: "en-US",
      defaultTargetMalas: "11 Malas Daily",
      defaultSadhanaStreak: "1 Day",
      allowDevoteeDelete: false,
      devoteeCanEditLineage: true,
      devoteeCanEnroll: true,
      healerStrictTeam: true,
      healerCanCertify: true,
      healerCanDeleteTeam: true,
      healerCanViewEntireTeam: true,
      enableLiveSync: true,
      firebaseUrl: "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/",
      defaultRoleMode: "MASTER",
      autoSaveMode: "INSTANT",
      ...(settings || {}),
    };

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : "";
    };

    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal("setting-app-name", s.appName || "Spiritual Karim Admin");
    setVal("setting-org-name", s.orgName || "Shree Spritual Karim Sansthan");
    setVal(
      "setting-firebase-url",
      s.firebaseUrl ||
        "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/",
    );
    setChecked("setting-auto-cloud-sync", s.autoCloudSync !== false);
    setVal("setting-default-mentor-name", s.defaultMentorName);
    setVal("setting-default-mentor-code", s.defaultMentorCode);
    setVal("setting-telegram-bot-handle", s.telegramBotHandle);
    setVal("setting-notebooklm-portal-url", s.notebookLmPortalUrl);
    setVal("setting-three-diya-window", s.threeDiyaEveningWindow);
    setVal("setting-clean-min-approval-percent", s.cleanMinApprovalPercent);
    setVal("setting-default-target-malas", s.defaultTargetMalas);
    setVal("setting-default-japa-target-count", s.defaultJapaTargetCount);
    setVal("setting-github-apk-url", s.githubApkUrl);
    setVal("setting-github-repo-url", s.githubRepoUrl);
    setVal("setting-web-portal-url", s.webPortalUrl);
    setVal("setting-upline-approval-timeout", s.uplineApprovalTimeoutHours);
    setVal("setting-speech-lang", s.speechLang);
    setChecked(
      "setting-data-minimization",
      s.dataMinimizationEnabled !== false,
    );
    setChecked("setting-devotee-can-delete", s.allowDevoteeDelete === true);
    setChecked(
      "setting-devotee-can-edit-lineage",
      s.devoteeCanEditLineage !== false,
    );
    setChecked("setting-devotee-can-enroll", s.devoteeCanEnroll !== false);
    setChecked("setting-healer-strict-team", s.healerStrictTeam !== false);
    setChecked("setting-healer-can-certify", s.healerCanCertify !== false);
    setChecked(
      "setting-healer-can-delete-team",
      s.healerCanDeleteTeam !== false,
    );
    setVal("setting-firebase-url", s.firebaseUrl);
    setVal("setting-firebase-project-id", s.firebaseProjectId);
    setVal("setting-default-role-mode", s.defaultRoleMode);
    setVal("setting-auto-save", s.autoSaveMode);
  }

  readSettingsFromForm() {
    const getVal = (id, defaultVal = "") => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : defaultVal;
    };

    const getChecked = (id, defaultVal = false) => {
      const el = document.getElementById(id);
      return el ? el.checked : defaultVal;
    };

    return {
      appName: getVal("setting-app-name", "Spiritual Karim Admin"),
      orgName: getVal("setting-org-name", "Shree Spritual Karim Sansthan"),
      firebaseUrl: getVal(
        "setting-firebase-url",
        "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/",
      ),
      autoCloudSync: getChecked("setting-auto-cloud-sync", true),
      defaultMentorName: getVal(
        "setting-default-mentor-name",
        "Spiritual Karim Khan (Founder)",
      ),
      defaultMentorCode: getVal(
        "setting-default-mentor-code",
        "SKHM-ADM1-7788-9900",
      ),
      telegramBotHandle: getVal(
        "setting-telegram-bot-handle",
        "SpiritualKarimBot",
      ),
      notebookLmPortalUrl: getVal(
        "setting-notebooklm-portal-url",
        "https://notebooklm.google.com",
      ),
      threeDiyaEveningWindow: getVal(
        "setting-three-diya-window",
        "06:15 PM – 07:00 PM",
      ),
      cleanMinApprovalPercent:
        Number(getVal("setting-clean-min-approval-percent", "75")) || 75,
      defaultTargetMalas: getVal(
        "setting-default-target-malas",
        "11 Malas Daily",
      ),
      defaultJapaTargetCount:
        Number(getVal("setting-default-japa-target-count", "108")) || 108,
      defaultSadhanaStreak: "1 Day",
      githubApkUrl: getVal(
        "setting-github-apk-url",
        "https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk",
      ),
      githubRepoUrl: getVal(
        "setting-github-repo-url",
        "https://github.com/jDroid-X/SpritualKarim",
      ),
      webPortalUrl: getVal(
        "setting-web-portal-url",
        "https://jdroid-x.github.io/SpritualKarim/",
      ),
      uplineApprovalTimeoutHours:
        Number(getVal("setting-upline-approval-timeout", "24")) || 24,
      allowDevoteeDelete: getChecked("setting-devotee-can-delete", false),
      devoteeCanEditLineage: getChecked(
        "setting-devotee-can-edit-lineage",
        true,
      ),
      devoteeCanEnroll: getChecked("setting-devotee-can-enroll", true),
      healerStrictTeam: getChecked("setting-healer-strict-team", true),
      healerCanCertify: getChecked("setting-healer-can-certify", true),
      healerCanDeleteTeam: getChecked("setting-healer-can-delete-team", true),
      healerCanViewEntireTeam: getChecked("setting-healer-strict-team", true),
      enableLiveSync: true,
      firebaseUrl: getVal(
        "setting-firebase-url",
        "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/",
      ),
      firebaseProjectId: getVal(
        "setting-firebase-project-id",
        "spritualkarim-7b5fd",
      ),
      dataMinimizationEnabled: getChecked("setting-data-minimization", true),
      defaultRoleMode: getVal("setting-default-role-mode", "MASTER"),
      autoSaveMode: getVal("setting-auto-save", "INSTANT"),
      speechLang: getVal("setting-speech-lang", "en-US"),
    };
  }

  _updateJSONPreview(profile) {
    if (this.jsonPreviewCode) {
      this.jsonPreviewCode.textContent = JSON.stringify(profile, null, 2);
    }
  }

  openTierPanel(tierNumber, allProfiles, activeProfileId) {
    if (!this.tierProfilesPanel) return;

    this.currentOpenTier = tierNumber;
    const tierMeta = {
      1: {
        title: "Admin Master Profiles",
        icon: "👑",
        color: "#8b5cf6",
        filter: (p) => p.profileType === "ADMIN" || p.level === 1,
      },
      2: {
        title: "Healer Connect Profiles",
        icon: "🛡️",
        color: "#10b981",
        filter: (p) =>
          p.profileType === "HEALER" &&
          (p.level === 2 || p.level === 3 || !p.level),
      },
      3: {
        title: "Trainee Sadhak Profiles",
        icon: "📿",
        color: "#f59e0b",
        filter: (p) => p.profileType === "TRAINEE" || p.level === 4,
      },
      4: {
        title: "Devotee / Seeker Profiles",
        icon: "🌟",
        color: "#3b82f6",
        filter: (p) =>
          p.profileType === "DEVOTEE" ||
          p.level === 5 ||
          (!p.level &&
            p.profileType !== "ADMIN" &&
            p.profileType !== "HEALER" &&
            p.profileType !== "TRAINEE"),
      },
    };

    const meta = tierMeta[tierNumber] || tierMeta[1];
    this.currentTierProfiles = (allProfiles || []).filter(meta.filter);

    if (this.tierPanelIcon) this.tierPanelIcon.textContent = meta.icon;
    if (this.tierPanelTitle) this.tierPanelTitle.textContent = meta.title;
    if (this.tierPanelCount)
      this.tierPanelCount.textContent = `${this.currentTierProfiles.length} Member${this.currentTierProfiles.length !== 1 ? "s" : ""}`;

    this._renderTierPanelCards(
      this.currentTierProfiles,
      activeProfileId,
      meta.color,
    );

    // Active state on sidebar legend
    document
      .querySelectorAll("#hierarchy-legend-container .legend-item")
      .forEach((item) => {
        const itemTier = parseInt(item.getAttribute("data-tier"), 10);
        if (itemTier === tierNumber) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });

    const adminLayout = document.querySelector(".admin-layout");
    if (adminLayout) {
      adminLayout.classList.add("has-tier-panel-open");
    }

    this.tierProfilesPanel.classList.add("is-open");
    if (this.inputTierPanelSearch) {
      this.inputTierPanelSearch.value = "";
    }
    if (this.btnClearTierSearch) {
      this.btnClearTierSearch.style.display = "none";
    }
    if (this.tierFilterChips) {
      this.tierFilterChips.querySelectorAll(".tier-filter-chip").forEach((c) => {
        if (c.getAttribute("data-filter") === "ALL") c.classList.add("active");
        else c.classList.remove("active");
      });
    }
  }

  /**
   * Apply dynamic auth matrix - shows/hides UI elements based on role
   */
  applyDynamicAuthMatrix(matrix, roleMode = "MASTER") {
    if (!matrix || !Array.isArray(matrix)) return;

    const resolvedRole =
      (roleMode || "MASTER").toUpperCase() === "ADMIN"
        ? "MASTER"
        : (roleMode || "MASTER").toUpperCase();
    let firstVisibleTab = null;

    matrix.forEach((item) => {
      const isAllowed = item[resolvedRole] !== false;

      if (item.type === "SCREEN") {
        const tabTarget =
          item.tabBtnTarget ||
          item.targetId ||
          (item.selector ? item.selector.replace("#", "") : null) ||
          item.id;
        const tabBtn = document.querySelector(
          `button[data-main-tab="${tabTarget}"]`,
        );
        const tabContent = document.getElementById(item.targetId || tabTarget);

        if (tabBtn) {
          tabBtn.style.display = isAllowed ? "flex" : "none";
        }
        if (tabContent) {
          if (!isAllowed) {
            tabContent.style.display = "none";
            tabContent.classList.remove("active");
          }
        }

        if (isAllowed && !firstVisibleTab) {
          firstVisibleTab = tabTarget;
        }
      } else if (item.selector) {
        try {
          const elements = document.querySelectorAll(item.selector);
          elements.forEach((el) => {
            el.style.display = isAllowed ? "" : "none";
          });
        } catch (err) {
          console.warn("Selector error in auth matrix:", item.selector, err);
        }
      }
    });

    // Enforce Approval Pending button gating: Master and Healer only
    const approvalBtn = document.getElementById("main-tab-approval-btn");
    const isMasterOrHealer = resolvedRole === "MASTER" || resolvedRole === "HEALER";
    if (approvalBtn) {
      approvalBtn.style.display = isMasterOrHealer ? "flex" : "none";
    }

    // Selected member card must NEVER contain an approval button
    const card2 = document.getElementById("selected-member-profile-card");
    if (card2) {
      const unwantedApprovalBtns = card2.querySelectorAll(
        ".header-approval-tab-btn, #main-tab-approval-btn, .approval-notification-pill",
      );
      unwantedApprovalBtns.forEach((btn) => btn.remove());
    }

    // If currently active tab is hidden, switch to first visible tab
    const activeTabBtn = document.querySelector(".main-tab-btn.active");
    if (
      activeTabBtn &&
      activeTabBtn.style.display === "none" &&
      firstVisibleTab
    ) {
      const targetBtn = document.querySelector(
        `button[data-main-tab="${firstVisibleTab}"]`,
      );
      if (targetBtn) {
        targetBtn.click();
      }
    }
  }

  /**
   * Render auth notification banner for pending approvals
   */
  renderApprovalNotification(pendingInvites = [], roleMode = "MASTER") {
    if (!this.pendingApprovalBanner) {
      this.pendingApprovalBanner = document.getElementById(
        "pending-approval-notification-banner",
      );
      this.approvalNotificationText = document.getElementById(
        "approval-notification-text",
      );
      this.approvalNotificationCount = document.getElementById(
        "approval-notification-count",
      );
    }
    if (!this.pendingApprovalBanner) return;

    const isMentor = roleMode === "MASTER" || roleMode === "HEALER";
    const pendingList = (pendingInvites || []).filter(
      (i) => i.status === "PENDING",
    );
    const count = pendingList.length;

    const headerCount =
      this.headerPendingApprovalCount ||
      document.getElementById("header-pending-approval-count");
    if (headerCount) {
      headerCount.textContent = count;
      headerCount.style.background = count > 0 ? "#eab308" : "rgba(255, 255, 255, 0.15)";
      headerCount.style.color = count > 0 ? "#000000" : "var(--text-muted)";
    }

    if (isMentor && count > 0) {
      if (this.pendingApprovalBanner) {
        this.pendingApprovalBanner.style.display = "inline-flex";
        if (this.approvalNotificationText) {
          this.approvalNotificationText.textContent = `${count} Devotee Application${count > 1 ? "s" : ""} Pending Approval`;
        }
        if (this.approvalNotificationCount) {
          this.approvalNotificationCount.textContent = count;
        }
      }
    } else {
      if (this.pendingApprovalBanner) {
        this.pendingApprovalBanner.style.display = "none";
      }
    }
  }

  /**
   * Render auth matrix in settings modal
   */
  renderAuthMatrixInSettings(matrix, currentRole = "MASTER") {
    if (!this.authMatrixTableBody || !Array.isArray(matrix)) return;

    const roles = ["MASTER", "HEALER", "TRAINEE", "DEVOTEE"];
    const portals = ["masters", "healers", "trainee", "devotee"];

    let html = "";
    matrix.forEach((item) => {
      const roleId = item.id.replace(/-/g, "_").toLowerCase();
      html += `<tr data-item-id="${item.id}">
        <td style="padding: 0.5rem;"><strong>${item.name || item.label}</strong><br><small style="color: var(--text-muted);">${item.type}</small></td>`;

      roles.forEach((role) => {
        const checked = item[role] !== false ? "checked" : "";
        html += `<td style="text-align: center;"><input type="checkbox" class="matrix-role-check" data-role="${role}" ${checked}></td>`;
      });

      if (item.portalVisible) {
        portals.forEach((portal) => {
          const checked = item.portalVisible[portal] !== false ? "checked" : "";
          html += `<td style="text-align: center;"><input type="checkbox" class="matrix-portal-check" data-portal="${portal}" ${checked}></td>`;
        });
      } else {
        html += `<td colspan="4" style="text-align: center;"><span style="color: var(--text-muted);">—</span></td>`;
      }

      html += "</tr>";
    });

    this.authMatrixTableBody.innerHTML = html;
  }
}
