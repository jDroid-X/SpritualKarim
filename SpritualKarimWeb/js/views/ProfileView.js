const esc = (typeof escapeHtml === 'function') 
  ? escapeHtml 
  : ((typeof escapeHtmlUtil === 'function') 
    ? escapeHtmlUtil 
    : (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));

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
    this.headerDisplayProfileName = document.getElementById("header-display-profile-name");
    this.sidebarUserFooter = document.getElementById("sidebar-user-footer");
    this.sidebarUserName = document.getElementById("sidebar-user-name");
    this.sidebarUserRole = document.getElementById("sidebar-user-role");
    this.sidebarUserAvatar = document.getElementById("sidebar-user-avatar");
    this.btnSidebarLogout = document.getElementById("btn-sidebar-logout");
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

    // Admin Master Live Metrics Strip Elements
    this.adminMetricsStrip = document.getElementById("admin-hierarchy-metrics-strip");
    // Current Events In Progress Panel
    this.adminCurrentEventsStrip = document.getElementById("admin-current-events-strip");
    this.metricHealersActiveTotal = document.getElementById("metric-healers-active-total");
    this.metricHealersNewJoined = document.getElementById("metric-healers-new-joined");
    this.metricTraineesActiveTotal = document.getElementById("metric-trainees-active-total");
    this.metricTraineesNewJoined = document.getElementById("metric-trainees-new-joined");
    this.metricDevoteesActiveTotal = document.getElementById("metric-devotees-active-total");
    this.metricDevoteesNewJoined = document.getElementById("metric-devotees-new-joined");

    // Persistent Footer Marquee Elements
    this.footerMarqueeText = document.getElementById("footer-marquee-text");
    this.footerMarqueeElement = document.getElementById("footer-marquee-element");

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
    this.inputMentorName = document.getElementById("input-mentor-name");
    this.inputPairingPin = document.getElementById("input-pairing-pin");
    this.inputDeviceModel = document.getElementById("input-device-model");
    this.inputDedicatedPortalUrl = document.getElementById("input-dedicated-portal-url");
    this.inputInductionStatus = document.getElementById("input-induction-status");
    this.btnCopyPairingPinField = document.getElementById("btn-copy-pairing-pin-field");
    this.btnCopyPortalUrlField = document.getElementById("btn-copy-portal-url-field");

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
    this.selectedTraineeMemberId = null;

    // 3-Panel Trainee Workspace Elements
    this.trainee3PanelWorkspace = document.getElementById("trainee-3panel-workspace");
    this.traineeTeamPanel = document.getElementById("trainee-team-panel");
    this.traineePracticesPanel = document.getElementById("trainee-practices-panel");
    this.traineeBodyPanel = document.getElementById("trainee-body-panel");
    this.listAccordionTrainees = document.getElementById("list-accordion-trainees");
    this.listAccordionDevotees = document.getElementById("list-accordion-devotees");
    this.countAccordionTrainees = document.getElementById("count-accordion-trainees");
    this.countAccordionDevotees = document.getElementById("count-accordion-devotees");
    this.traineeTeamCountBadge = document.getElementById("trainee-team-count-badge");
    this.listAccordionSadhanas = document.getElementById("list-accordion-sadhanas");
    this.listAccordionRemedies = document.getElementById("list-accordion-remedies");
    this.countAccordionSadhanas = document.getElementById("count-accordion-sadhanas");
    this.countAccordionRemedies = document.getElementById("count-accordion-remedies");
    this.practicesMemberName = document.getElementById("practices-member-name");
    this.traineeSelectedPracticeBanner = document.getElementById("trainee-selected-practice-banner");

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
    this.btnCloseSidebarDrawer =
      document.getElementById("btn-close-sidebar-drawer") ||
      document.getElementById("btnCloseSidebarDrawer");
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

    // Modal & Slide-Out Drawer DOM Element Bindings
    this.createProfileModal = document.getElementById("create-profile-modal");
    this.btnCloseCreateProfileModal = document.getElementById("btn-close-create-profile-modal");
    this.btnCancelCreateProfile = document.getElementById("btn-cancel-create-profile");
    this.btnSubmitCreateProfile = document.getElementById("btn-submit-create-profile");
    this.btnModalTriggerSidebarPairing = document.getElementById("btn-modal-trigger-sidebar-pairing");
    this.newProfileRole = document.getElementById("new-profile-role");
    this.newProfileName = document.getElementById("new-profile-name");
    this.newProfilePhone = document.getElementById("new-profile-phone");
    this.newProfileCity = document.getElementById("new-profile-city");
    this.newProfileSponsor = document.getElementById("new-profile-sponsor");
    this.newProfileMembership = document.getElementById("new-profile-membership");

    this.pendingApprovalDrawer = document.getElementById("pending-approval-drawer");
    this.pendingApprovalDrawerBackdrop = document.getElementById("pending-approval-drawer-backdrop");
    this.pendingApprovalDrawerBody = document.getElementById("pending-approval-drawer-body");
    this.btnClosePendingApprovalDrawer = document.getElementById("btn-close-pending-approval-drawer");
    this.btnDrawerRefreshInvites = document.getElementById("btn-drawer-refresh-invites");
    this.btnDrawerOpenShareModal = document.getElementById("btn-drawer-open-share-modal");

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
    this._renderDropdown(profile, visibleProfiles);
    if (this.model && typeof this.model.getApplicableRolesForProfile === "function") {
      const applicableRoles = this.model.getApplicableRolesForProfile(profile);
      roleMode = this.renderApplicableRoles(applicableRoles, roleMode);
    } else {
      this._renderRoleSelector(roleMode);
    }
    this.updateLegendCounts(this.allProfiles || visibleProfiles, roleMode);
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
    this._renderCategorizedTraineeSadhanas(profile.traineeSadhanas || [], profile);
    this._updateSadhakProfileIdentity(profile);

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

    // Admin Master Live Hierarchy Metrics Strip
    if (this.model && typeof this.model.calculateHierarchyMetrics === "function") {
      this.renderAdminMetricsTiles(this.model.calculateHierarchyMetrics(), roleMode);
    }

    // Persistent Footer Copyright Marquee
    this.renderCopyrightMarquee(settings?.copyrightMarqueeText);

    // Apply RBAC Rules Across the UI
    this.enforceRBAC(roleMode, settings);

    // Apply Dynamic Auth Matrix Permissions Across Screens, Tabs & Panels
    if (this.model && typeof this.model.getAuthMatrix === "function") {
      this.applyDynamicAuthMatrix(this.model.getAuthMatrix(), roleMode);
    }
  }

  /**
   * Renders the authenticated operator profile identity in the Header Display Box
   * and the Bottom-Left Sidebar User Card.
   */
  renderProfileDisplayBox(operatorProfile, currentRole) {
    if (!operatorProfile) return;
    if (this.headerDisplayProfileName) {
      this.headerDisplayProfileName.textContent = operatorProfile.name || "Spiritual Karim Khan";
    }
    if (this.sidebarUserName) {
      this.sidebarUserName.textContent = operatorProfile.name || "Spiritual Karim Khan";
    }
    if (this.sidebarUserRole) {
      const role = (currentRole || this.selectRoleMode?.value || operatorProfile.role || "MASTER").toUpperCase();
      const roleIcons = {
        MASTER: "👑 Admin Master",
        HEALER: "🛡️ Healer",
        TRAINEE: "📿 Trainee",
        DEVOTEE: "🌟 Devotee",
        SEEKER: "🔍 Seeker"
      };
      this.sidebarUserRole.textContent = roleIcons[role] || ("🛡️ " + role);
    }
    if (this.sidebarUserAvatar) {
      const initials = (operatorProfile.name || "SK")
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "SK";
      this.sidebarUserAvatar.textContent = initials;
    }
  }

  _updateSadhakProfileIdentity(profile) {
    if (!profile) return;
    const role = (this.model && typeof this.model.getRoleMode === "function")
      ? this.model.getRoleMode()
      : (profile.role || profile.profileType || "MASTER");
    if (typeof this.renderProfileDisplayBox === "function") {
      this.renderProfileDisplayBox(profile, role);
    }
  }

  _renderRoleSelector(roleMode) {
    if (this.selectRoleMode) {
      this.selectRoleMode.value = roleMode;
    }
  }

  _renderDropdown(activeProfile, visibleProfiles) {
    if (!this.selectActiveProfile) return;
    const profiles = visibleProfiles || [];
    if (profiles.length === 0) {
      this.selectActiveProfile.innerHTML = '<option value="" disabled>No profiles available</option>';
      return;
    }
    this.selectActiveProfile.innerHTML = profiles
      .map((p) => {
        const isSelected = activeProfile && p.id === activeProfile.id;
        const safeName = esc(p.name);
        return `<option value="${p.id}"${isSelected ? ' selected' : ''}>${safeName}</option>`;
      })
      .join("");
    if (activeProfile) {
      this.selectActiveProfile.value = activeProfile.id;
    }
  }

  /**
   * Renders the applicable roles for the currently selected profile.
   * Dynamically switches choices: e.g. Devotee opens Devotee scoped view per Auth Matrix.
   */
  renderApplicableRoles(applicableRoles, currentRole) {
    if (!this.selectRoleMode) return;
    const roles = Array.isArray(applicableRoles) && applicableRoles.length > 0
      ? applicableRoles.filter(r => (r.role || r).toUpperCase() !== "SEEKER")
      : [
          { role: "MASTER", label: "👑 Master (Full Control)", level: 1 },
          { role: "HEALER", label: "🛡️ Healer (Master Hub)", level: 2 },
          { role: "TRAINEE", label: "📿 Trainee (Sadhana Core)", level: 3 },
          { role: "DEVOTEE", label: "🌟 Devotee (Sacred Sangha)", level: 4 },
          
        ];

    const currentUpper = (currentRole || this.selectRoleMode.value || "MASTER").toUpperCase();
    const isCurrentSupported = roles.some((r) => r.role === currentUpper);
    const selectedRole = isCurrentSupported ? currentUpper : roles[0].role;

    this.selectRoleMode.innerHTML = roles
      .map((r) => {
        const isSelected = r.role === selectedRole;
        return `<option value="${r.role}"${isSelected ? ' selected' : ''}>${r.label}</option>`;
      })
      .join("");

    this.selectRoleMode.value = selectedRole;
    return selectedRole;
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
        filter: (p) => {
          const role = (p.profileType || "").toUpperCase();
          return role === "ADMIN" || role === "MASTER" || p.level === 1;
        },
      },
      {
        tierNumber: 2,
        title: "Tier 2: Certified Healers & Gurus",
        icon: "🛡️",
        badgeBg: "rgba(16, 185, 129, 0.2)",
        borderColor: "#10b981",
        filter: (p) => {
          const role = (p.profileType || "").toUpperCase();
          return (role === "HEALER" || p.level === 2) && role !== "ADMIN" && role !== "MASTER" && p.level !== 1;
        },
      },
      {
        tierNumber: 3,
        title: "Tier 3: Trainee Sadhaks",
        icon: "📿",
        badgeBg: "rgba(245, 158, 11, 0.2)",
        borderColor: "#f59e0b",
        filter: (p) => {
          const role = (p.profileType || "").toUpperCase();
          return (role === "TRAINEE" || p.level === 3) && role !== "ADMIN" && role !== "MASTER" && role !== "HEALER" && role !== "DEVOTEE" && role !== "SEEKER";
        },
      },
      {
        tierNumber: 4,
        title: "Tier 4: Devotees & Seekers",
        icon: "🌟",
        badgeBg: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        filter: (p) => {
          const role = (p.profileType || "").toUpperCase();
          const isHigher = role === "ADMIN" || role === "MASTER" || role === "HEALER" || role === "TRAINEE" || (p.level && p.level < 4);
          return !isHigher || role === "DEVOTEE" || role === "SEEKER";
        },
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
          <div class="profile-item-row ${isActive ? "active" : ""}" data-id="${p.id}" title="Click to view & edit details for ${esc(p.name)}">
            <div class="profile-item-avatar-col">
              <div class="profile-item-avatar" style="border-color: ${tier.borderColor};">
                ${esc(initials)}
                <span class="profile-status-dot ${p.isActive ? "online" : "offline"}"></span>
              </div>
            </div>
            <div class="profile-item-info-col">
              <div class="profile-item-name-row">
                <span class="profile-item-name">${esc(p.name)}</span>
                <span class="profile-mini-stamp ${isPaid ? "stamp-paid" : "stamp-free"}">${isPaid ? "PAID" : "FREE"}</span>
              </div>
              <div class="profile-item-sub-row">
                <span class="profile-item-sub">${esc(p.referenceCode)}</span>
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
    const anchor = anchorProfile || profile;
    const activeP = profile || anchor;

    const isAnchorPaid = anchor.isPaid !== false && anchor.paymentStatus !== "FREE";
    const isActivePaid = activeP.isPaid !== false && activeP.paymentStatus !== "FREE";
    
    const anchorInitials = (anchor.name || "SK").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const activeInitials = (activeP.name || "SK").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

    const roleColors = {
      ADMIN: "var(--role-admin, #8b5cf6)",
      MASTER: "var(--role-admin, #8b5cf6)",
      HEALER: "var(--role-healer, #10b981)",
      TRAINEE: "var(--role-trainee, #f59e0b)",
      DEVOTEE: "var(--role-devotee, #3b82f6)",
    };
    const anchorColor = roleColors[anchor.profileType] || "var(--gold-400, #d4af37)";
    const activeColor = roleColors[activeP.profileType] || "var(--gold-400, #d4af37)";

    // 1. Synchronize Header 1 (Top Bar Session User Pill) - LOCKED TO ANCHOR
    const h1Pill = document.getElementById("topbar-session-user-pill");
    if (h1Pill) {
      const h1Avatar = h1Pill.querySelector("#topbar-session-avatar");
      if (h1Avatar) {
        h1Avatar.textContent = anchorInitials;
        h1Avatar.style.borderColor = anchorColor;
        h1Avatar.style.background = anchorColor;
      }
      const h1Name = h1Pill.querySelector("#topbar-session-name");
      if (h1Name) h1Name.textContent = anchor.name || "Spiritual Karim Khan";
      const h1Role = h1Pill.querySelector("#topbar-session-role");
      if (h1Role) {
        const pType = (anchor.profileType || "ADMIN MASTER").toUpperCase();
        const roleLabels = {
          ADMIN: "👑 ADMIN MASTER",
          MASTER: "👑 ADMIN MASTER",
          HEALER: "🛡️ HEALER",
          TRAINEE: "📿 TRAINEE",
          DEVOTEE: "🌟 DEVOTEE",
          SEEKER: "🔍 SEEKER"
        };
        h1Role.textContent = roleLabels[pType] || ("🛡️ " + pType);
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

    // 2. Synchronize Header 2 (In-Body Profile Box 1 - main-profile-box-1) - SHOWS INSPECTED PROFILE
    const mainBox = document.getElementById("main-profile-box-1");
    if (mainBox) {
      const pName = mainBox.querySelector("#display-profile-name");
      if (pName) pName.textContent = activeP.name || "Spiritual Karim Khan";
      const pBadge = mainBox.querySelector("#display-role-badge");
      if (pBadge) {
        pBadge.textContent = `${activeP.profileType || "ADMIN MASTER"} • LEVEL ${activeP.level || 1}`;
        pBadge.style.backgroundColor = activeColor;
      }
      const pStatus = mainBox.querySelector("#display-status-pill");
      if (pStatus) {
        pStatus.textContent = activeP.isActive !== false ? "Active Member" : "Inactive";
        pStatus.className = `status-pill ${activeP.isActive !== false ? "active" : ""}`;
      }
      const pStamp = mainBox.querySelector("#display-payment-stamp");
      if (pStamp) {
        pStamp.className = `stamp-indicator ${isActivePaid ? "stamp-paid" : "stamp-free"}`;
        if (pStamp) pStamp.style.display = "none";
      }
      const pInitials = mainBox.querySelector("#profile-avatar-initials");
      if (pInitials) {
        pInitials.textContent = activeInitials;
        pInitials.style.borderColor = activeColor;
      }
      const defMentor = (this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : ((typeof appConfig !== "undefined" && appConfig.defaultMentorCode) || "SKHM-ADM1-7788-9900");
      const pRef = mainBox.querySelector("#header-ref-code-text");
      if (pRef) pRef.textContent = anchor.referenceCode || defMentor;
      const tRef = mainBox.querySelector("#telemetry-ref-code");
      if (tRef) tRef.textContent = anchor.referenceCode || defMentor;

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
      if (this.headerStampBadge) this.headerStampBadge.style.display = "none";
      this.headerStampBadge.title = `Active Membership: ${isAnchorPaid ? "PAID" : "FREE"}`;
    }

    // 3. Render Card 2: Selected Downline Member Profile Card
    this.renderSelectedMemberCard(profile, anchor);
  }

  /**
   * Renders the 2nd profile card for downline member inspection
   * Center of card displays Date of Joining and Current Role.
   * EXPLICITLY NO Approval Pending button!
   * Enforces: If no App Hierarchy Tier member is selected, hide Profile Box 2.
   */
  renderSelectedMemberCard(selectedProfile, anchorProfile = null) {
    if (!this.selectedMemberCard) {
      this.selectedMemberCard = document.getElementById("selected-member-profile-card");
    }
    if (!this.selectedMemberCard) return;

    // Rule 1: Setting Gating - Hide Profile Box 2 everywhere via setting relevant untick
    const showBox2 = this.settings && this.settings.showProfileBox2 === true;
    if (!showBox2) {
      this.selectedMemberCard.style.display = "none";
      return;
    }

    // Rule 2: If no App Hierarchy Tier member is actively selected, hide Profile Box 2
    if (!this.currentSelectedTierMember) {
      this.selectedMemberCard.style.display = "none";
      return;
    }

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

    // Update Sadhana Applied below selected member name
    const pSadhanaLabel = this.selectedMemberCard.querySelector("#selected-member-applied-sadhana-label");
    const pSadhanaName = this.selectedMemberCard.querySelector("#selected-member-applied-sadhana-name");
    const pSadhanaStatus = this.selectedMemberCard.querySelector("#selected-member-applied-sadhana-status");
    const pProgressTile = this.selectedMemberCard.querySelector("#selected-member-progress-tile-container");

    if (pSadhanaName) {
      let appliedName = "No Sadhana Applied";
      let appliedStat = "⚪ None";
      let appliedItem = null;

      if (selectedProfile.activePractices && selectedProfile.activePractices.length > 0) {
        appliedItem = selectedProfile.activePractices[0];
        appliedName = appliedItem.itemTitle || appliedItem.title;
        appliedStat = "🟢 Active & Initiated";
      } else if (selectedProfile.traineeSadhanas && selectedProfile.traineeSadhanas.length > 0) {
        appliedItem = selectedProfile.traineeSadhanas[0];
        appliedName = appliedItem.title;
        appliedStat = "🟢 In-Progress";
      }

      if (pSadhanaLabel && appliedItem) {
         const cat = (appliedItem.category || appliedItem.title || "").toLowerCase();
         const isRemedy = cat.includes("remedy") || cat.includes("upay") || cat.includes("diya") || cat.includes("court") || cat.includes("business");
         pSadhanaLabel.innerHTML = isRemedy ? "🪔 Remedy Applied:" : "📿 Sadhana Applied:";
      }

      pSadhanaName.textContent = appliedName;
      if (pSadhanaStatus) pSadhanaStatus.textContent = appliedStat;

      // Render progress card metadata tile
      if (pProgressTile) {
        if (appliedItem) {
           const progress = Math.min(100, Math.max(0, parseInt(appliedItem.progressPercent, 10) || 0));
           const target = appliedItem.dailyTarget || appliedItem.targetMalas || "11 Malas";
           const cycle = appliedItem.cycleDays || 21;
           pProgressTile.innerHTML = `
             <div class="progress-graphics-box" style="margin-top: 0.5rem; background: var(--surface-hover, rgba(255,255,255,0.03)); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-subtle, rgba(255,255,255,0.1));">
               <div class="progress-metrics-row" style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.75rem;">
                 <span style="color: var(--text-secondary, #9ca3af);">Overall Completion</span>
                 <span class="progress-percentage-badge" style="color: var(--gold-400, #d4af37); font-weight: 700;">${progress}%</span>
               </div>
               <div class="progress-bar-track" style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem;">
                 <div class="progress-bar-fill" style="width: ${progress}%; height: 100%; background: var(--gold-500, #c59b27);"></div>
               </div>
               <div class="progress-stats-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                 <div class="progress-stat-card" style="background: rgba(0,0,0,0.2); padding: 0.4rem; border-radius: 4px;">
                   <div class="progress-stat-label" style="font-size: 0.65rem; color: var(--text-muted, #6b7280);">Daily Target</div>
                   <div class="progress-stat-val" style="font-size: 0.75rem; font-weight: 600;">${target}</div>
                 </div>
                 <div class="progress-stat-card" style="background: rgba(0,0,0,0.2); padding: 0.4rem; border-radius: 4px;">
                   <div class="progress-stat-label" style="font-size: 0.65rem; color: var(--text-muted, #6b7280);">Cycle Days</div>
                   <div class="progress-stat-val" style="font-size: 0.75rem; font-weight: 600;">${cycle} Days</div>
                 </div>
               </div>
             </div>
           `;
        } else {
           pProgressTile.innerHTML = "";
        }
      }
    }

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

  applyProfileBox2Visibility(show) {
    if (!this.selectedMemberCard) {
      this.selectedMemberCard = document.getElementById("selected-member-profile-card");
    }
    if (this.selectedMemberCard) {
      if (!show) {
        this.selectedMemberCard.style.display = "none";
      } else if (this.currentSelectedTierMember && this.selectedProfile) {
        this.selectedMemberCard.style.display = "block";
      }
    }
  }

  renderAdminMetricsTiles(metrics, roleMode = "MASTER") {
    if (!this.adminMetricsStrip) {
      this.adminMetricsStrip = document.getElementById("admin-hierarchy-metrics-strip");
    }
    const resolvedRole = (roleMode || "MASTER").toUpperCase() === "ADMIN" ? "MASTER" : (roleMode || "MASTER").toUpperCase();
    const isAdmin = resolvedRole === "MASTER" || resolvedRole === "HEALER";
    if (this.adminMetricsStrip) {
      this.adminMetricsStrip.style.display = isAdmin ? "grid" : "none";
    }

    // Always render Current Events in Progress panel for ALL roles (read-only for Trainee/Devotee)
    this.renderCurrentEventsPanel();

    if (!isAdmin) return;

    const m = metrics || {
      totalProfiles: 0,
      activeProfiles: 0,
      tier1: { count: 0, active: 0, total: 0, newJoined: 0 },
      tier2: { count: 0, active: 0, total: 0, newJoined: 0 },
      tier3: { count: 0, active: 0, total: 0, newJoined: 0 },
      tier4: { count: 0, active: 0, total: 0, newJoined: 0 },
      masters: { active: 0, total: 0, newJoined: 0 },
      healers: { active: 0, total: 0, newJoined: 0 },
      trainees: { active: 0, total: 0, newJoined: 0 },
      devotees: { active: 0, total: 0, newJoined: 0 },
      pendingInvites: { pending: 0, expired: 0, approved: 0, rejected: 0, total: 0 }
    };

    // 1. Synchronize Left Sidebar App Hierarchy Tier Count Badges (Single Source of Truth)
    this.updateSidebarTierBadges(m);

    // 2. Center Metrics Strip: Masters / Founder Level 1
    const mActiveTotal = document.getElementById("metric-masters-active-total");
    const mNew = document.getElementById("metric-masters-new-joined");
    if (mActiveTotal) {
      const active = m.tier1?.active ?? m.masters?.active ?? 0;
      const total = m.tier1?.total ?? m.masters?.total ?? 0;
      mActiveTotal.innerHTML = `<span class="val-active">${active}</span> / <span class="val-total">${total}</span>`;
    }
    if (mNew) {
      const newCount = m.tier1?.newJoined ?? m.masters?.newJoined ?? 0;
      mNew.textContent = newCount > 0 ? `+${newCount} Root Active` : `Root Active`;
    }

    // 3. Center Metrics Strip: Healers Level 2 & 3
    const hActiveTotal = document.getElementById("metric-healers-active-total");
    const hNew = document.getElementById("metric-healers-new-joined");
    if (hActiveTotal) {
      const active = m.tier2?.active ?? m.healers?.active ?? 0;
      const total = m.tier2?.total ?? m.healers?.total ?? 0;
      hActiveTotal.innerHTML = `<span class="val-active">${active}</span> / <span class="val-total">${total}</span>`;
    }
    if (hNew) {
      const newCount = m.tier2?.newJoined ?? m.healers?.newJoined ?? 0;
      hNew.textContent = newCount > 0 ? `+${newCount} New` : `Mentors Hub`;
    }

    // 4. Center Metrics Strip: Trainees Level 4
    const tActiveTotal = document.getElementById("metric-trainees-active-total");
    const tNew = document.getElementById("metric-trainees-new-joined");
    if (tActiveTotal) {
      const active = m.tier3?.active ?? m.trainees?.active ?? 0;
      const total = m.tier3?.total ?? m.trainees?.total ?? 0;
      tActiveTotal.innerHTML = `<span class="val-active">${active}</span> / <span class="val-total">${total}</span>`;
    }
    if (tNew) {
      const newCount = m.tier3?.newJoined ?? m.trainees?.newJoined ?? 0;
      tNew.textContent = newCount > 0 ? `+${newCount} New` : `In Sadhana`;
    }

    // 5. Center Metrics Strip: Devotees Level 5
    const dActiveTotal = document.getElementById("metric-devotees-active-total");
    const dNew = document.getElementById("metric-devotees-new-joined");
    if (dActiveTotal) {
      const active = m.tier4?.active ?? m.devotees?.active ?? 0;
      const total = m.tier4?.total ?? m.devotees?.total ?? 0;
      dActiveTotal.innerHTML = `<span class="val-active">${active}</span> / <span class="val-total">${total}</span>`;
    }
    if (dNew) {
      const newCount = m.tier4?.newJoined ?? m.devotees?.newJoined ?? 0;
      dNew.textContent = newCount > 0 ? `+${newCount} New` : `Enrolled`;
    }

    // 6. Synchronize Grand Total Profile Counters across all dashboard elements
    const totalEl = document.getElementById("metric-total-profiles") || document.getElementById("metric-total-profiles-count");
    if (totalEl) totalEl.textContent = m.totalProfiles;

    const activeEl = document.getElementById("metric-active-profiles") || document.getElementById("metric-active-profiles-count");
    if (activeEl) activeEl.textContent = m.activeProfiles;

    // 7. Synchronize Pending Approvals Badge
    const pendingEl = document.getElementById("metric-pending-approvals-count") || document.getElementById("pending-drawer-count");
    const tilePending = document.getElementById("metric-tile-pending-count");
    if (tilePending) {
      const pCount = m.pendingInvites?.pending ?? 0;
      tilePending.textContent = `${pCount} Pending`;
    }
    const treeTotal = document.getElementById("metric-tree-total-nodes");
    if (treeTotal) {
      treeTotal.textContent = m.totalProfiles || 15;
    }

    if (pendingEl) {
      const pendingCount = m.pendingInvites?.pending ?? 0;
      const totalInvites = m.pendingInvites?.total ?? 0;
      pendingEl.textContent = `${pendingCount} Pending / ${totalInvites} Total`;
    }
    const sidePending = document.getElementById("sidebar-pending-badge");
    if (sidePending) sidePending.textContent = m.pendingInvites?.pending ?? 0;
    const headerPending = document.getElementById("header-pending-badge");
    if (headerPending) headerPending.textContent = m.pendingInvites?.pending ?? 0;

    // 8. Current Events in Progress panel is already rendered above for all roles
  }

  /**
   * Renders the Current Events in Progress panel with live progress calculations.
   * Reads event data from ProfileModel (or falls back to seed tile metadata).
   * Called automatically from renderAdminMetricsTiles() on every role refresh.
   * Available to ALL roles — read-only for Trainee & Devotee, Add/Edit for Master & Healer.
   */
  renderCurrentEventsPanel() {
    if (!this.adminCurrentEventsStrip) {
      this.adminCurrentEventsStrip = document.getElementById("admin-current-events-strip");
    }
    const strip = this.adminCurrentEventsStrip;
    if (!strip) return;

    // Show the panel only if not hidden by Authorization Matrix
    if (!strip.classList.contains("auth-hidden") && !strip.classList.contains("portal-hidden")) {
      strip.style.display = "block";
    }

    // DATA-DRIVEN: Compute live progress for ALL event tiles from their data attributes.
    // This means editing a tile's data-event-start / data-event-end will update progress
    // automatically on next renderCurrentEventsPanel() call — no hardcoded dates.
    const now = new Date();
    const allTiles = strip.querySelectorAll(".current-event-tile[data-event-start][data-event-end]");

    allTiles.forEach(tile => {
      const eventId  = tile.getAttribute("data-event-id") || "";
      const status   = (tile.getAttribute("data-event-status") || "UPCOMING").toUpperCase();
      const startStr = tile.getAttribute("data-event-start");
      const endStr   = tile.getAttribute("data-event-end");
      if (!startStr || !endStr) return;

      const start = new Date(startStr);
      const end   = new Date(endStr);
      const totalMs   = end - start;
      const elapsedMs = Math.max(0, Math.min(now - start, totalMs));
      const pct = totalMs > 0 ? Math.round((elapsedMs / totalMs) * 100) : 0;
      const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
      const daysUntil = Math.max(0, Math.ceil((start - now) / 86400000));
      const isCompleted = now > end;

      // Derive a DOM-safe key from the event-id (e.g. bakhoor_sadhana_jul26 → bakhoor)
      // Falls back to scanning for progress bar within the tile directly
      const barEl  = tile.querySelector(".event-progress-bar-fill");
      const pctEl  = tile.querySelector(".event-progress-pct");
      const daysEl = tile.querySelector(".event-progress-days");

      let progressPct, statusLabel, daysLabel;
      if (status === "UPCOMING" && now < start) {
        progressPct  = 0;
        statusLabel  = "Awaiting Start";
        daysLabel    = `Starts in ~${daysUntil} days`;
      } else if (isCompleted) {
        progressPct  = 100;
        statusLabel  = "✓ Completed";
        daysLabel    = "Done";
      } else {
        progressPct  = pct;
        statusLabel  = `${pct}% Complete`;
        daysLabel    = `~${daysLeft} days left`;
      }

      if (barEl) {
        barEl.style.width = `${progressPct}%`;
        barEl.setAttribute("aria-valuenow", progressPct);
        barEl.setAttribute("aria-label", statusLabel);
      }
      if (pctEl) pctEl.textContent = statusLabel;
      if (daysEl) daysEl.textContent = daysLabel;

      // Sync duration display (humanized)
      const durEl = tile.querySelector(`.event-detail-value[id*="duration"]`) ||
                    tile.querySelectorAll(".event-detail-value")?.[0];
      if (durEl && totalMs > 0) {
        const totalDays = Math.ceil(totalMs / 86400000);
        const totalMonths = Math.round(totalDays / 30);
        durEl.textContent = totalDays >= 60 ? `${totalMonths} Months` : `${totalDays} Days`;
      }
    });

    // Update event count badge
    const countBadge = document.getElementById("current-events-count-badge");
    if (countBadge) {
      const ongoingCount  = strip.querySelectorAll(".tile-event-ongoing").length;
      const upcomingCount = strip.querySelectorAll(".tile-event-upcoming").length;
      countBadge.textContent = `${ongoingCount} Ongoing${upcomingCount ? ` · ${upcomingCount} Upcoming` : ""}`;
    }
  }

  /**
   * Opens a slide-in Edit Event dialog pre-populated from the tile's data attributes.
   * On Save: calls _updateEventTileData(eventId, updatedFields) then re-renders progress.
   * Reuses the same backdrop and panel pattern as showAddEventDialog().
   * Role-gated: only accessible to MASTER and HEALER roles (enforced at Controller level).
   * @param {string} eventId - The data-event-id of the tile to edit.
   */
  showEditEventDialog(eventId) {
    const tile = document.querySelector(`[data-event-id="${eventId}"]`);
    if (!tile) return;

    // Read current values from data attributes (single source of truth on the tile)
    const currentName   = tile.getAttribute("data-event-name")  || "";
    const currentType   = tile.getAttribute("data-event-type")  || "SADHANA";
    const currentStatus = tile.getAttribute("data-event-status") || "ONGOING";
    const currentIcon   = tile.getAttribute("data-event-icon")  || "🔔";
    const currentStart  = tile.getAttribute("data-event-start") || "";
    const currentEnd    = tile.getAttribute("data-event-end")   || "";
    const currentNotes  = tile.getAttribute("data-event-notes") || "";

    // Re-use or create backdrop
    let backdrop = document.getElementById("add-event-dialog-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "add-event-dialog-backdrop";
      backdrop.className = "sadhana-drawer-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      document.body.appendChild(backdrop);
    }

    // Re-use or create dialog panel
    let dialog = document.getElementById("add-event-dialog-panel");
    if (!dialog) {
      dialog = document.createElement("div");
      dialog.id = "add-event-dialog-panel";
      dialog.className = "add-event-dialog-panel";
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-label", "Edit Event");
      document.body.appendChild(dialog);
    }

    dialog.innerHTML = `
      <div class="add-event-dialog-header">
        <span class="add-event-dialog-icon">✏️</span>
        <h3 class="add-event-dialog-title">Edit Event</h3>
        <button type="button" id="btn-add-event-dialog-close"
                class="btn-sadhana-drawer-close" title="Close" aria-label="Close Edit Event">✕</button>
      </div>
      <div class="add-event-dialog-body">
        <div class="add-event-field-group">
          <label class="add-event-label" for="add-event-name">Event / Sadhana Name *</label>
          <input type="text" id="add-event-name" class="add-event-input"
                 placeholder="e.g. Navratri Sadhana" maxlength="80" autocomplete="off"
                 value="${esc(currentName)}">
        </div>
        <div class="add-event-field-row">
          <div class="add-event-field-group">
            <label class="add-event-label" for="add-event-type">Type</label>
            <select id="add-event-type" class="add-event-select">
              <option value="SADHANA"  ${currentType==='SADHANA'  ?'selected':''}>Sadhana</option>
              <option value="CEREMONY" ${currentType==='CEREMONY' ?'selected':''}>Ceremony</option>
              <option value="RETREAT"  ${currentType==='RETREAT'  ?'selected':''}>Retreat</option>
              <option value="WORKSHOP" ${currentType==='WORKSHOP' ?'selected':''}>Workshop</option>
              <option value="OTHER"    ${currentType==='OTHER'    ?'selected':''}>Other</option>
            </select>
          </div>
          <div class="add-event-field-group">
            <label class="add-event-label" for="add-event-status">Status</label>
            <select id="add-event-status" class="add-event-select">
              <option value="ONGOING"   ${currentStatus==='ONGOING'   ?'selected':''}>Ongoing</option>
              <option value="UPCOMING"  ${currentStatus==='UPCOMING'  ?'selected':''}>Upcoming</option>
              <option value="COMPLETED" ${currentStatus==='COMPLETED' ?'selected':''}>Completed</option>
            </select>
          </div>
        </div>
        <div class="add-event-field-row">
          <div class="add-event-field-group">
            <label class="add-event-label" for="add-event-start">Start Date *</label>
            <input type="date" id="add-event-start" class="add-event-input" value="${esc(currentStart)}">
          </div>
          <div class="add-event-field-group">
            <label class="add-event-label" for="add-event-end">End Date *</label>
            <input type="date" id="add-event-end" class="add-event-input" value="${esc(currentEnd)}">
          </div>
        </div>
        <div class="add-event-field-group">
          <label class="add-event-label" for="add-event-icon">Icon (emoji)</label>
          <input type="text" id="add-event-icon" class="add-event-input add-event-icon-input"
                 placeholder="🪔" maxlength="4" value="${esc(currentIcon)}">
        </div>
        <div class="add-event-field-group">
          <label class="add-event-label" for="add-event-notes">Notes / Description</label>
          <textarea id="add-event-notes" class="add-event-textarea"
                    placeholder="Brief description..." rows="3" maxlength="300">${esc(currentNotes)}</textarea>
        </div>
        <div id="add-event-error-msg" class="add-event-error" style="display:none;"></div>
      </div>
      <div class="add-event-dialog-footer">
        <button type="button" id="btn-add-event-cancel" class="btn-add-event-cancel">Cancel</button>
        <button type="button" id="btn-add-event-submit" class="btn-add-event-submit">💾 Save Changes</button>
      </div>
    `;

    // Show
    backdrop.classList.add("is-visible");
    dialog.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const nameInput = dialog.querySelector("#add-event-name");
    if (nameInput) setTimeout(() => nameInput.focus(), 80);

    const closeDialog = () => {
      backdrop.classList.remove("is-visible");
      dialog.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    dialog.querySelector("#btn-add-event-dialog-close").onclick = closeDialog;
    dialog.querySelector("#btn-add-event-cancel").onclick = closeDialog;
    backdrop.onclick = closeDialog;

    const escHandler = (e) => {
      if (e.key === "Escape") { closeDialog(); document.removeEventListener("keydown", escHandler); }
    };
    document.addEventListener("keydown", escHandler);

    dialog.querySelector("#btn-add-event-submit").onclick = () => {
      const nameVal  = (dialog.querySelector("#add-event-name").value || "").trim();
      const startVal = dialog.querySelector("#add-event-start").value;
      const endVal   = dialog.querySelector("#add-event-end").value;
      const errEl    = dialog.querySelector("#add-event-error-msg");

      if (!nameVal)  { errEl.textContent = "Event name is required."; errEl.style.display = "block"; return; }
      if (!startVal || !endVal) { errEl.textContent = "Start and End dates are required."; errEl.style.display = "block"; return; }
      if (new Date(endVal) <= new Date(startVal)) { errEl.textContent = "End date must be after Start date."; errEl.style.display = "block"; return; }
      errEl.style.display = "none";

      this._updateEventTileData(eventId, {
        name:   nameVal,
        type:   dialog.querySelector("#add-event-type").value,
        status: dialog.querySelector("#add-event-status").value,
        icon:   (dialog.querySelector("#add-event-icon").value || "🔔").trim(),
        start:  startVal,
        end:    endVal,
        notes:  (dialog.querySelector("#add-event-notes").value || "").trim()
      });

      closeDialog();
      document.removeEventListener("keydown", escHandler);
    };
  }

  /**
   * Updates a tile's data attributes and visible display fields with new values,
   * then triggers renderCurrentEventsPanel() to recalculate live progress.
   * Single source of truth: all state lives on the tile's data-event-* attributes.
   * @param {string} eventId  - The data-event-id of the tile to update.
   * @param {Object} fields   - {name, type, status, icon, start, end, notes}
   */
  _updateEventTileData(eventId, fields) {
    const tile = document.querySelector(`[data-event-id="${eventId}"]`);
    if (!tile) return;

    const { name, type, status, icon, start, end, notes } = fields;

    // 1. Update data attributes (single source of truth)
    if (name   !== undefined) tile.setAttribute("data-event-name",   name);
    if (type   !== undefined) tile.setAttribute("data-event-type",   type);
    if (status !== undefined) tile.setAttribute("data-event-status", status);
    if (icon   !== undefined) tile.setAttribute("data-event-icon",   icon);
    if (start  !== undefined) tile.setAttribute("data-event-start",  start);
    if (end    !== undefined) tile.setAttribute("data-event-end",    end);
    if (notes  !== undefined) tile.setAttribute("data-event-notes",  notes);

    // 2. Update visible tile header
    const nameEl = tile.querySelector(".event-tile-name");
    if (nameEl && name) nameEl.textContent = name;

    const iconEl = tile.querySelector(".event-tile-icon-wrap");
    if (iconEl && icon) iconEl.textContent = icon;

    // 3. Update status badge text + tile class
    const badgeEl = tile.querySelector(".event-tile-badge");
    if (badgeEl && status) {
      const badgeMap = {
        ONGOING:   { text: "● Ongoing",     cls: "badge-ongoing" },
        UPCOMING:  { text: "◎ Upcoming",    cls: "badge-upcoming" },
        COMPLETED: { text: "✓ Completed",   cls: "badge-completed" }
      };
      const bm = badgeMap[status.toUpperCase()];
      if (bm) {
        badgeEl.textContent = bm.text;
        badgeEl.className = `event-tile-badge ${bm.cls}`;
      }
      // Update tile root class for colour accent
      tile.classList.remove("tile-event-ongoing", "tile-event-upcoming", "tile-event-completed");
      tile.classList.add(`tile-event-${status.toLowerCase()}`);
    }

    // 4. Update date display spans
    const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'});
    const startEl = tile.querySelector("[id*='-start']");
    const endEl   = tile.querySelector("[id*='-end']");
    if (startEl && start) startEl.textContent = fmtDate(start);
    if (endEl   && end)   endEl.textContent   = fmtDate(end);

    // 5. Update progress bar fill class
    const barEl = tile.querySelector(".event-progress-bar-fill");
    if (barEl && status) {
      barEl.classList.remove("bar-ongoing", "bar-upcoming", "bar-completed");
      barEl.classList.add(status === "ONGOING" ? "bar-ongoing" : status === "COMPLETED" ? "bar-completed" : "bar-upcoming");
    }

    // 6. Re-render all progress values (data-driven)
    this.renderCurrentEventsPanel();

    // 7. Show toast confirmation
    if (typeof this.showToast === "function") this.showToast(`✅ Event "${name}" updated successfully.`);
  }

  /**
   * Opens an inline slide-in Add Event dialog (reuses existing sadhana-drawer-backdrop
   * pattern). Provides a structured form to define: name, type, start date, end date,
   * icon, and notes. On Submit → appends a new tile; on Cancel → closes.
   * Callable from any controller via: view.showAddEventDialog()
   */
  showAddEventDialog() {
    // Re-use backdrop if already present, else create one
    let backdrop = document.getElementById("add-event-dialog-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "add-event-dialog-backdrop";
      backdrop.className = "sadhana-drawer-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      document.body.appendChild(backdrop);
    }

    // Build or reuse the dialog panel
    let dialog = document.getElementById("add-event-dialog-panel");
    if (!dialog) {
      dialog = document.createElement("div");
      dialog.id = "add-event-dialog-panel";
      dialog.className = "add-event-dialog-panel";
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-label", "Add New Event");
      document.body.appendChild(dialog);
    }

    dialog.innerHTML = `
      <div class="add-event-dialog-header">
        <span class="add-event-dialog-icon">🔔</span>
        <h3 class="add-event-dialog-title">Add New Event</h3>
        <button type="button" id="btn-add-event-dialog-close"
                class="btn-sadhana-drawer-close" title="Close" aria-label="Close Add Event">✕</button>
      </div>
      <div class="add-event-dialog-body">
        <div class="add-event-field-group">
          <label class="add-event-label" for="add-event-name">Event / Sadhana Name *</label>
          <input type="text" id="add-event-name" class="add-event-input"
                 placeholder="e.g. Navratri Sadhana" maxlength="80" autocomplete="off">
        </div>
        <div class="add-event-field-row">
          <div class="add-event-field-group">
            <label class="add-event-label" for="add-event-type">Type</label>
            <select id="add-event-type" class="add-event-select">
              <option value="SADHANA">Sadhana</option>
              <option value="CEREMONY">Ceremony</option>
              <option value="RETREAT">Retreat</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div class="add-event-field-group">
            <label class="add-event-label" for="add-event-status">Status</label>
            <select id="add-event-status" class="add-event-select">
              <option value="ONGOING">Ongoing</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        <div class="add-event-field-row">
          <div class="add-event-field-group">
            <label class="add-event-label" for="add-event-start">Start Date *</label>
            <input type="date" id="add-event-start" class="add-event-input">
          </div>
          <div class="add-event-field-group">
            <label class="add-event-label" for="add-event-end">End Date *</label>
            <input type="date" id="add-event-end" class="add-event-input">
          </div>
        </div>
        <div class="add-event-field-group">
          <label class="add-event-label" for="add-event-icon">Icon (emoji)</label>
          <input type="text" id="add-event-icon" class="add-event-input add-event-icon-input"
                 placeholder="🪔" maxlength="4">
        </div>
        <div class="add-event-field-group">
          <label class="add-event-label" for="add-event-notes">Notes / Description</label>
          <textarea id="add-event-notes" class="add-event-textarea"
                    placeholder="Brief description or metadata..." rows="3" maxlength="300"></textarea>
        </div>
        <div id="add-event-error-msg" class="add-event-error" style="display:none;"></div>
      </div>
      <div class="add-event-dialog-footer">
        <button type="button" id="btn-add-event-cancel" class="btn-add-event-cancel">Cancel</button>
        <button type="button" id="btn-add-event-submit" class="btn-add-event-submit">＋ Add Event</button>
      </div>
    `;

    // Show
    backdrop.classList.add("is-visible");
    dialog.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const nameInput = dialog.querySelector("#add-event-name");
    if (nameInput) setTimeout(() => nameInput.focus(), 80);

    const closeDialog = () => {
      backdrop.classList.remove("is-visible");
      dialog.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    // Close handlers
    dialog.querySelector("#btn-add-event-dialog-close").onclick = closeDialog;
    dialog.querySelector("#btn-add-event-cancel").onclick = closeDialog;
    backdrop.onclick = closeDialog;

    // Escape key
    const escHandler = (e) => {
      if (e.key === "Escape") { closeDialog(); document.removeEventListener("keydown", escHandler); }
    };
    document.addEventListener("keydown", escHandler);

    // Submit handler
    dialog.querySelector("#btn-add-event-submit").onclick = () => {
      const nameVal  = (dialog.querySelector("#add-event-name").value || "").trim();
      const startVal = dialog.querySelector("#add-event-start").value;
      const endVal   = dialog.querySelector("#add-event-end").value;
      const errEl    = dialog.querySelector("#add-event-error-msg");

      // Validation
      if (!nameVal) {
        errEl.textContent = "Event name is required."; errEl.style.display = "block"; return;
      }
      if (!startVal || !endVal) {
        errEl.textContent = "Start and End dates are required."; errEl.style.display = "block"; return;
      }
      if (new Date(endVal) <= new Date(startVal)) {
        errEl.textContent = "End date must be after Start date."; errEl.style.display = "block"; return;
      }
      errEl.style.display = "none";

      const statusVal = dialog.querySelector("#add-event-status").value;
      const typeVal   = dialog.querySelector("#add-event-type").value;
      const iconVal   = (dialog.querySelector("#add-event-icon").value || "🔔").trim();

      // Build new event data object
      const eventId = `event_${Date.now()}`;
      const newEvent = {
        id: eventId,
        name: nameVal,
        type: typeVal,
        status: statusVal,
        icon: iconVal,
        startDate: startVal,
        endDate: endVal,
        notes: (dialog.querySelector("#add-event-notes").value || "").trim()
      };

      // Inject tile into the DOM
      this._appendCurrentEventTile(newEvent);
      closeDialog();
      document.removeEventListener("keydown", escHandler);

      // Refresh progress and counts
      this.renderCurrentEventsPanel();
    };
  }

  /**
   * Appends a dynamically created event tile into #current-events-tiles-row.
   * Called from showAddEventDialog() on valid form submission.
   * @param {Object} ev - Structured event object {id, name, type, status, icon, startDate, endDate, notes}
   */
  _appendCurrentEventTile(ev) {
    const row = document.getElementById("current-events-tiles-row");
    if (!row) return;

    const now = new Date();
    const start = new Date(ev.startDate);
    const end   = new Date(ev.endDate);
    const totalMs = end - start;
    const elapsedMs = Math.max(0, Math.min(now - start, totalMs));
    const pct = totalMs > 0 ? Math.round((elapsedMs / totalMs) * 100) : 0;
    const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
    const isOngoing  = ev.status === "ONGOING";
    const isUpcoming = ev.status === "UPCOMING";
    const isCompleted = ev.status === "COMPLETED";

    const tileClass = isOngoing ? "tile-event-ongoing" : isUpcoming ? "tile-event-upcoming" : "tile-event-completed";
    const badgeClass = isOngoing ? "badge-ongoing" : isUpcoming ? "badge-upcoming" : "badge-completed";
    const badgeLabel = isOngoing ? "● Ongoing" : isUpcoming ? "◎ Upcoming" : "✓ Completed";
    const progressPct = isUpcoming ? 0 : pct;
    const progressLabel = isUpcoming ? "Awaiting Start" : isCompleted ? "Completed" : `${progressPct}% Complete`;
    const daysLabel = isUpcoming
      ? `Starts in ~${Math.max(0, Math.ceil((start - now) / 86400000))} days`
      : isCompleted ? "Done" : `~${daysLeft} days left`;

    const tile = document.createElement("div");
    tile.className = `current-event-tile ${tileClass}`;
    tile.id = `event-tile-${ev.id}`;
    tile.setAttribute("data-event-id", ev.id);
    tile.setAttribute("data-event-type", ev.type);
    tile.setAttribute("data-event-status", ev.status);
    tile.setAttribute("data-event-name", ev.name);
    tile.setAttribute("data-event-icon", ev.icon || "🔔");
    tile.setAttribute("data-event-start", ev.startDate);
    tile.setAttribute("data-event-end", ev.endDate);
    tile.setAttribute("data-event-notes", ev.notes || "");
    tile.setAttribute("role", "article");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("title", `${ev.name} — ${ev.status}`);
    tile.innerHTML = `
      <div class="event-tile-header">
        <div class="event-tile-icon-wrap ${isOngoing ? 'event-icon-fire' : 'event-icon-upcoming'}">${esc(ev.icon)}</div>
        <div class="event-tile-meta">
          <span class="event-tile-name">${esc(ev.name)}</span>
          <span class="event-tile-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="event-tile-actions">
          <button type="button" class="btn-event-edit" data-event-id="${esc(ev.id)}"
                  title="Edit Event Details" aria-label="Edit Event">✏️</button>
          <button type="button" class="btn-event-options" data-event-id="${esc(ev.id)}"
                  title="Event Options" aria-label="Event Options">⋮</button>
        </div>
      </div>
      <div class="event-tile-details">
        <div class="event-detail-row">
          <span class="event-detail-label">📅 Start</span>
          <span class="event-detail-value">${esc(new Date(ev.startDate).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'}))}</span>
        </div>
        <div class="event-detail-row">
          <span class="event-detail-label">🏁 End</span>
          <span class="event-detail-value">${esc(new Date(ev.endDate).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'}))}</span>
        </div>
      </div>
      <div class="event-tile-progress-wrap">
        <div class="event-progress-bar-track">
          <div class="event-progress-bar-fill ${isOngoing ? 'bar-ongoing' : isCompleted ? 'bar-completed' : 'bar-upcoming'}"
               style="width:${progressPct}%;"
               role="progressbar"
               aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100"
               aria-label="${progressLabel}"></div>
        </div>
        <div class="event-progress-labels">
          <span class="event-progress-pct">${progressLabel}</span>
          <span class="event-progress-days">${daysLabel}</span>
        </div>
      </div>
    `;
    row.appendChild(tile);

  }

  /**
   * Universal Metadata Counter Engine (OOPS MVC View Component)
   * Synchronizes all status, sum, and count activities across the entire DOM in a single closed loop.
   * Reads directly from MetadataCountEngine (SSOT) or passed metrics object.
   */
  syncAllMetadataCounters(metrics = null) {
    let m = metrics;
    if (!m && typeof window !== "undefined" && window.MetadataCountEngine && this.allProfiles) {
      const invites = typeof this.controller?.model?.getPairingInvites === "function" 
        ? this.controller.model.getPairingInvites() 
        : [];
      const sadhanaApps = typeof this.controller?.model?.getSadhanaRemedyApplications === "function"
        ? this.controller.model.getSadhanaRemedyApplications()
        : [];
      m = window.MetadataCountEngine.computeAll(this.allProfiles, invites, sadhanaApps);
    }
    if (!m) return;

    // 1. Pending Approvals Badges (Topbar Bell, Header Button, Sidebar Button, Composite Tile)
    const pCount = m.pending?.pending ?? m.pendingInvites?.pending ?? 0;
    const pTotal = m.pending?.total ?? m.pendingInvites?.total ?? pCount;
    const regCount = m.pending?.registrationPending ?? m.pendingInvites?.registrationPending ?? 0;
    const sadhanaCount = m.pending?.sadhanaPending ?? m.pendingInvites?.sadhanaPending ?? 0;

    const topbarBell = document.getElementById("approval-notification-count");
    if (topbarBell) topbarBell.textContent = pCount;

    const notifBanner = document.getElementById("pending-approval-notification-banner");
    if (notifBanner) {
      notifBanner.style.display = pCount > 0 ? "inline-flex" : "none";
    }

    const headerBtnBadge = document.getElementById("header-pending-badge");
    if (headerBtnBadge) headerBtnBadge.textContent = pCount;

    const btnHeaderApprovals = document.getElementById("btn-header-pending-approvals");
    if (btnHeaderApprovals) {
      const currentRole = (this.model ? this.model.getRoleMode() : (this.currentRoleMode || "MASTER")).toUpperCase();
      const btnText = btnHeaderApprovals.querySelector(".btn-text");
      if (["ADMIN", "MASTER"].includes(currentRole)) {
        if (btnText) btnText.innerHTML = `Approvals (<strong id="header-pending-badge">${pCount}</strong>)`;
        btnHeaderApprovals.title = `Open Lineage Approvals Queue (${pCount} Pending Requests)`;
      } else if (["HEALER"].includes(currentRole)) {
        const activeProf = this.model?.getActiveProfile?.();
        const healerCode = activeProf?.referenceCode;
        const scopedInvites = (this.allProfiles && healerCode) ? (this.model?.getPairingInvitesForRole?.("HEALER", activeProf) || []) : [];
        const scopedPending = scopedInvites.filter(i => (i.status || "").toLowerCase() === "pending").length;
        if (btnText) btnText.innerHTML = `Healer Approvals (<strong id="header-pending-badge">${scopedPending}</strong>)`;
        btnHeaderApprovals.title = `Review Pending Requests assigned to your Lineage (${scopedPending} Pending)`;
      } else if (["TRAINEE", "SADHAK"].includes(currentRole)) {
        if (btnText) btnText.innerHTML = `Sadhana Status (<strong id="header-pending-badge">1 Active</strong>)`;
        btnHeaderApprovals.title = "View Sadhana Initiation & Sacred Notification Desk";
      } else {
        if (btnText) btnText.innerHTML = `Application Status (<strong id="header-pending-badge">1 Pending</strong>)`;
        btnHeaderApprovals.title = "View Application Status & Sacred Notification Desk";
      }
    }

    const sidebarBtnBadge = document.getElementById("sidebar-pending-badge");
    if (sidebarBtnBadge) sidebarBtnBadge.textContent = pCount;

    const tilePending = document.getElementById("metric-tile-pending-count");
    if (tilePending) tilePending.textContent = `${pCount} Pending`;

    const pendingDrawerHeader = document.getElementById("pending-drawer-count");
    if (pendingDrawerHeader) pendingDrawerHeader.textContent = `${pCount} Pending / ${pTotal} Total`;

    const badgeReg = document.getElementById("tab-badge-pending-registration");
    if (badgeReg) badgeReg.textContent = regCount;

    const badgeSadhana = document.getElementById("tab-badge-pending-sadhana");
    if (badgeSadhana) badgeSadhana.textContent = sadhanaCount;

    // 2. Sidebar Hierarchy Tier Badges (Stage 2: 1..4)
    const tierMap = {
      1: m.hierarchy?.tier1?.total ?? m.tier1?.total ?? m.masters?.total ?? 1,
      2: m.hierarchy?.tier2?.total ?? m.tier2?.total ?? m.healers?.total ?? 0,
      3: m.hierarchy?.tier3?.total ?? m.tier3?.total ?? m.trainees?.total ?? 0,
      4: m.hierarchy?.tier4?.total ?? m.tier4?.total ?? m.devotees?.total ?? 0,
    };
    for (let t = 1; t <= 4; t++) {
      const badge = document.getElementById(`legend-count-tier-${t}`);
      if (badge) badge.textContent = tierMap[t];
    }

    // 3. Tab 2 Multilevel Organization Hub Metrics Strip (Always Synchronized)
    const hub = m.healerHub || (typeof window !== "undefined" && window.MetadataCountEngine ? window.MetadataCountEngine.computeHealerHubMetrics(this.allProfiles || []) : null);
    if (hub) {
      const elHubTotal = document.getElementById("hub-metric-total");
      if (elHubTotal) elHubTotal.textContent = hub.total ?? (this.allProfiles ? this.allProfiles.length : 0);

      const elHubAdmin = document.getElementById("hub-metric-admin");
      if (elHubAdmin) elHubAdmin.textContent = hub.admin ?? tierMap[1];

      const elHubHealers = document.getElementById("hub-metric-healers");
      if (elHubHealers) elHubHealers.textContent = hub.healers ?? tierMap[2];

      const elHubTrainees = document.getElementById("hub-metric-trainees");
      if (elHubTrainees) elHubTrainees.textContent = hub.trainees ?? tierMap[3];

      const elHubDevotees = document.getElementById("hub-metric-devotees");
      if (elHubDevotees) elHubDevotees.textContent = hub.devotees ?? tierMap[4];

      // Tab 2 Directory Category Filter Chips
      const chipAll = document.getElementById("chip-cnt-all");
      if (chipAll) chipAll.textContent = hub.total ?? (this.allProfiles ? this.allProfiles.length : 0);

      const chipAdmin = document.getElementById("chip-cnt-admin");
      if (chipAdmin) chipAdmin.textContent = hub.admin ?? tierMap[1];

      const chipHealers = document.getElementById("chip-cnt-healers");
      if (chipHealers) chipHealers.textContent = hub.healers ?? tierMap[2];

      const chipTrainees = document.getElementById("chip-cnt-trainees");
      if (chipTrainees) chipTrainees.textContent = hub.trainees ?? tierMap[3];

      const chipDevotees = document.getElementById("chip-cnt-devotees");
      if (chipDevotees) chipDevotees.textContent = hub.devotees ?? tierMap[4];
    }

    // 4. Admin Live Metrics Strip (Quad Active vs Total)
    const t1Active = m.hierarchy?.tier1?.active ?? m.tier1?.active ?? m.masters?.active ?? 0;
    const t1Total = m.hierarchy?.tier1?.total ?? m.tier1?.total ?? m.masters?.total ?? 0;
    const mActiveTotal = document.getElementById("metric-masters-active-total");
    if (mActiveTotal) mActiveTotal.innerHTML = `<span class="val-active">${t1Active}</span> / <span class="val-total">${t1Total}</span>`;

    const t2Active = m.hierarchy?.tier2?.active ?? m.tier2?.active ?? m.healers?.active ?? 0;
    const t2Total = m.hierarchy?.tier2?.total ?? m.tier2?.total ?? m.healers?.total ?? 0;
    const hActiveTotal = document.getElementById("metric-healers-active-total");
    if (hActiveTotal) hActiveTotal.innerHTML = `<span class="val-active">${t2Active}</span> / <span class="val-total">${t2Total}</span>`;

    const t3Active = m.hierarchy?.tier3?.active ?? m.tier3?.active ?? m.trainees?.active ?? 0;
    const t3Total = m.hierarchy?.tier3?.total ?? m.tier3?.total ?? m.trainees?.total ?? 0;
    const tActiveTotal = document.getElementById("metric-trainees-active-total");
    if (tActiveTotal) tActiveTotal.innerHTML = `<span class="val-active">${t3Active}</span> / <span class="val-total">${t3Total}</span>`;

    const t4Active = m.hierarchy?.tier4?.active ?? m.tier4?.active ?? m.devotees?.active ?? 0;
    const t4Total = m.hierarchy?.tier4?.total ?? m.tier4?.total ?? m.devotees?.total ?? 0;
    const dActiveTotal = document.getElementById("metric-devotees-active-total");
    if (dActiveTotal) dActiveTotal.innerHTML = `<span class="val-active">${t4Active}</span> / <span class="val-total">${t4Total}</span>`;

    // 5. Total Nodes & Profile Counts
    const treeTotal = document.getElementById("metric-tree-total-nodes");
    if (treeTotal) treeTotal.textContent = `${m.totalProfiles || (this.allProfiles ? this.allProfiles.length : 15)} Nodes`;

    const totalEl = document.getElementById("metric-total-profiles") || document.getElementById("metric-total-profiles-count");
    if (totalEl) totalEl.textContent = m.totalProfiles || (this.allProfiles ? this.allProfiles.length : 0);

    const activeEl = document.getElementById("metric-active-profiles") || document.getElementById("metric-active-profiles-count");
    if (activeEl) activeEl.textContent = m.activeProfiles || (this.allProfiles ? this.allProfiles.filter(p => p.isActive !== false).length : 0);
  }

  /**
   * Synchronizes Left Navigation App Hierarchy Tier count badges (#legend-count-tier-1..4)
   * with the underlying single source of truth database metrics.
   */
  updateSidebarTierBadges(metrics) {
    if (!metrics) return;
    const tierMap = {
      1: metrics.hierarchy?.tier1?.total ?? metrics.tier1?.total ?? metrics.masters?.total ?? 1,
      2: metrics.hierarchy?.tier2?.total ?? metrics.tier2?.total ?? metrics.healers?.total ?? 0,
      3: metrics.hierarchy?.tier3?.total ?? metrics.tier3?.total ?? metrics.trainees?.total ?? 0,
      4: metrics.hierarchy?.tier4?.total ?? metrics.tier4?.total ?? metrics.devotees?.total ?? 0,
    };

    for (let t = 1; t <= 4; t++) {
      const badge = document.getElementById(`legend-count-tier-${t}`);
      if (badge) {
        badge.textContent = tierMap[t];
      }
    }
  }

  /**
   * Master Closed-Loop Refresh Engine:
   * Synchronizes all screen metadata elements across the interface in real time
   * whenever profiles are created, updated, approved, or deleted.
   */
  _renderBasicFields(activeProfile) {
    if (!activeProfile) return;
    if (typeof this._populateForm === "function") {
      this._populateForm(activeProfile);
    }
    const nameEl = document.getElementById("header-display-profile-name");
    if (nameEl) nameEl.textContent = activeProfile.name || "Spiritual Karim Khan";
  }

  updateAllScreenMetadata(metrics, activeProfile, profilesList, roleMode = "MASTER") {
    // 1. Unified Closed-Loop Metadata Synchronization across all UI counters
    this.syncAllMetadataCounters(metrics);

    // 2. Center Admin Hierarchy Metric Cards
    this.renderAdminMetricsTiles(metrics, roleMode);

    // 3. Dropdown Header Profile Selector
    if (profilesList && Array.isArray(profilesList)) {
      this._renderDropdown(activeProfile, profilesList);
    }

    // 4. Hero Profile Details, Name, Role, Reference Code
    if (activeProfile) {
      this._renderBasicFields(activeProfile);
    }

    // 5. Secondary Member Card Visibility check: reset if member was deleted
    if (this.currentSelectedTierMember && profilesList) {
      const exists = profilesList.some((p) => p.id === this.currentSelectedTierMember.id);
      if (!exists) {
        this.currentSelectedTierMember = null;
        this.applyProfileBox2Visibility(false);
      }
    }
  }

  renderCopyrightMarquee(text) {
    let marqueeText = document.getElementById("footer-marquee-text");
    const defaultText =
      "© 2024-2026 Shree Spritual Karim Sansthan • All Sacred Lineage Rights Reserved • Certified ISO/IEC 27001 Secure Node Telemetry • Guided under the divine vision of Spiritual Karim Khan • Real-time Lineage Synchronization Active";
    const finalText = text || (this.settings && this.settings.copyrightMarqueeText) || defaultText;

    if (!marqueeText) {
      let footer = document.getElementById("site-footer");
      if (!footer) {
        footer = document.createElement("footer");
        footer.className = "site-footer";
        footer.id = "site-footer";
        footer.setAttribute("role", "contentinfo");
        footer.setAttribute("aria-label", "Site Footer");
        footer.innerHTML = `
          <div class="footer-inner">
            <div class="footer-marquee-wrap">
              <marquee id="footer-marquee-element" scrollamount="6" behavior="scroll" direction="left" class="footer-marquee-scroller" onmouseover="this.stop();" onmouseout="this.start();">
                <span id="footer-marquee-text" class="footer-marquee-content">${finalText}</span>
              </marquee>
            </div>
          </div>`;
        document.body.appendChild(footer);
      }
      marqueeText = document.getElementById("footer-marquee-text");
    }

    if (marqueeText) {
      marqueeText.textContent = finalText;
    }

    const settingInput = document.getElementById("setting-copyright-marquee");
    if (settingInput && (!settingInput.value || settingInput.value.trim() === "")) {
      settingInput.value = finalText;
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

    if (this.inputMentorName) {
      let mName = profile.mentorName || "";
      if (!mName && profile.referredByCode && this.model && this.model.profiles) {
        const sponsor = this.model.profiles.find(p => p.referenceCode === profile.referredByCode);
        if (sponsor) mName = sponsor.name;
      }
      this.inputMentorName.value = mName || "Spiritual Karim Khan (Founder)";
    }
    if (this.inputPairingPin) {
      this.inputPairingPin.value = profile.activationPin || profile.pairingPin || "140610";
    }
    if (this.inputDeviceModel) {
      this.inputDeviceModel.value = profile.seekerDeviceModel || profile.hardwareNonce || "Android 14 (Mobile Client)";
    }
    if (this.inputDedicatedPortalUrl) {
      const cleanBasePath = window.location.pathname
        .replace(/\/[^/]*\.html$/i, '')
        .replace(/\/(Masters|Healers|Trainee|Devotee|Seeker|Public|Frontend).*$/i, '')
        .replace(/\/+$/, '');
      const rootUrl = window.location.origin + cleanBasePath;
      const r = (profile.profileType || "DEVOTEE").toUpperCase();
      const targetPortal = (r === "TRAINEE") ? "Trainee" : (r === "HEALER") ? "Healers" : (r === "MASTER" || r === "ADMIN") ? "Masters" : "Devotee";
      this.inputDedicatedPortalUrl.value = `${rootUrl}/${targetPortal}/index.html?profileId=${encodeURIComponent(profile.referenceCode || profile.id)}`;
    }
    if (this.inputInductionStatus) {
      this.inputInductionStatus.value = profile.isActive !== false ? "✓ LINKED & ACTIVE" : "⚠️ SUSPENDED / INACTIVE";
    }

    if (this.btnCopyPairingPinField && !this.btnCopyPairingPinField._wired) {
      this.btnCopyPairingPinField._wired = true;
      this.btnCopyPairingPinField.onclick = () => {
        const pin = this.inputPairingPin ? this.inputPairingPin.value : "";
        if (pin) {
          navigator.clipboard.writeText(pin).then(() => this.showToast("📋 Pairing PIN copied to clipboard!"));
        }
      };
    }
    if (this.btnCopyPortalUrlField && !this.btnCopyPortalUrlField._wired) {
      this.btnCopyPortalUrlField._wired = true;
      this.btnCopyPortalUrlField.onclick = () => {
        const url = this.inputDedicatedPortalUrl ? this.inputDedicatedPortalUrl.value : "";
        if (url) {
          navigator.clipboard.writeText(url).then(() => this.showToast("🌐 Dedicated Portal link copied to clipboard!"));
        }
      };
    }

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

  /**
   * Universal Closed-Loop Practices Resolver for Trainee Sadhak
   * Merges traineeSadhanas, selectedRemedies, interestedSadhanas, and approved applications
   * @param {Object} selectedMember 
   * @returns {Array} Complete deduplicated list of active practices
   */
  getTraineeMemberPractices(selectedMember) {
    if (!selectedMember) return [];
    const catalog = (this.model && typeof this.model.getSadhanaCatalog === "function")
      ? this.model.getSadhanaCatalog()
      : {};

    const practicesMap = new Map();

    const addPractice = (item) => {
      if (!item) return;
      const key = item.sadhanaKey || item.id || item.title || item.name;
      if (!key) return;
      if (!practicesMap.has(key)) {
        practicesMap.set(key, Object.assign({}, item));
      } else {
        const existing = practicesMap.get(key);
        practicesMap.set(key, Object.assign({}, existing, item));
      }
    };

    // 1. Existing traineeSadhanas
    if (Array.isArray(selectedMember.traineeSadhanas)) {
      selectedMember.traineeSadhanas.forEach(addPractice);
    }

    // 2. Resolve selectedRemedies from Master Catalog
    if (Array.isArray(selectedMember.selectedRemedies)) {
      selectedMember.selectedRemedies.forEach((remKey) => {
        if (!practicesMap.has(remKey)) {
          const catItem = catalog[remKey] || {};
          const isSadh = (catItem.domain === "sadhanas" || (catItem.category || "").toLowerCase().includes("sadhana") || remKey.includes("yantra") || remKey.includes("bhairav") || remKey.includes("debts"));
          addPractice({
            id: `ts-${(selectedMember.id || "mem").replace("prof-", "")}-${remKey}`,
            sadhanaKey: remKey,
            title: catItem.title || remKey.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            categoryDomain: isSadh ? "sadhanas" : "remedies",
            isPaid: selectedMember.isPaid !== false && selectedMember.paymentStatus !== "FREE",
            paymentStatus: selectedMember.paymentStatus || "PAID",
            level: `Level ${selectedMember.level || 2} — Mantra Diksha`,
            dailyTarget: isSadh ? "11 Malas & Trataka" : "3 Diyas at Dusk",
            currentStreak: "14 Days",
            progressPercent: selectedMember.progressPercent || 75,
            status: "In Progress",
            mentorCode: selectedMember.referredByCode || "SKHM-HLR2-3344-5566",
            mentorName: selectedMember.referredByName || "Acharya Devendra",
            diaryNotes: `${catItem.title || remKey} active sacred practice.`,
            initiationToken: `SK-${remKey.toUpperCase().slice(0, 4)}-7788`,
            verificationStatus: "VERIFIED"
          });
        }
      });
    }

    // 3. Interested Sadhanas
    if (Array.isArray(selectedMember.interestedSadhanas)) {
      selectedMember.interestedSadhanas.forEach((is) => {
        const k = is.id || is.name;
        if (k && !practicesMap.has(k)) {
          const catItem = catalog[k] || {};
          const isSadh = (catItem.domain === "sadhanas" || (is.category || "").toLowerCase().includes("sadhana") || (is.name || "").toLowerCase().includes("sadhana"));
          addPractice({
            id: `ts-${(selectedMember.id || "mem").replace("prof-", "")}-${k}`,
            sadhanaKey: k,
            title: is.name || catItem.title || k,
            categoryDomain: isSadh ? "sadhanas" : "remedies",
            isPaid: selectedMember.isPaid !== false && selectedMember.paymentStatus !== "FREE",
            paymentStatus: selectedMember.paymentStatus || "PAID",
            level: `Level ${selectedMember.level || 2} — Diksha`,
            dailyTarget: isSadh ? "11 Malas Daily" : "Evening Lamp",
            currentStreak: "7 Days",
            progressPercent: 70,
            status: "In Progress",
            mentorCode: selectedMember.referredByCode || "SKHM-HLR2-3344-5566",
            mentorName: selectedMember.referredByName || "Acharya Devendra",
            diaryNotes: "Enrolled sadhana practice.",
            initiationToken: `SK-${k.toUpperCase().slice(0, 4)}-ENR`,
            verificationStatus: "VERIFIED"
          });
        }
      });
    }

    // 4. Approved or Initiated applications from getSadhanaRemedyApplications()
    const allApps = (this.model && typeof this.model.getSadhanaRemedyApplications === "function")
      ? (this.model.getSadhanaRemedyApplications() || [])
      : [];
    const memberApps = allApps.filter((a) => {
      if (!a) return false;
      const matchId = (a.requesterId && (a.requesterId === selectedMember.id || a.requesterId === selectedMember.referenceCode));
      const matchCode = (a.requesterCode && (a.requesterCode === selectedMember.referenceCode || a.requesterCode === selectedMember.id));
      const matchName = (a.requesterName && selectedMember.name && a.requesterName.trim().toLowerCase() === selectedMember.name.trim().toLowerCase());
      return matchId || matchCode || matchName;
    });

    memberApps.forEach((app) => {
      const k = app.sadhanaKey || app.sadhanaId || app.sadhanaName || app.id;
      if (k && !practicesMap.has(k)) {
        const catItem = catalog[k] || {};
        const isSadh = app.type === "sadhana" || catItem.domain === "sadhanas" || (app.sadhanaName || "").toLowerCase().includes("sadhana");
        addPractice({
          id: app.id || `app-${k}`,
          sadhanaKey: k,
          title: app.sadhanaName || catItem.title || k,
          categoryDomain: isSadh ? "sadhanas" : "remedies",
          isPaid: app.isPaid !== false,
          paymentStatus: app.paymentStatus || "PAID",
          level: app.level || "Level 2 — Diksha",
          dailyTarget: app.dailyTarget || (isSadh ? "11 Malas Daily" : "Evening Lamp"),
          currentStreak: "3 Days",
          progressPercent: app.progressPercent || 50,
          status: app.status || "In Progress",
          mentorCode: app.uplineCode || app.firstApproverCode || selectedMember.referredByCode,
          mentorName: app.uplineName || app.firstApproverName,
          diaryNotes: app.intentNotes || "Initiated via application queue.",
          verificationStatus: app.status === "APPROVED" ? "VERIFIED" : app.status === "PENDING" ? "PENDING_APPROVAL" : "ACTIVE"
        });
      }
    });

    return Array.from(practicesMap.values());
  }

  _renderTraineeNetworkSlimLists(activeProf) {
    if (!activeProf) return;
    const allProfiles = this.allProfiles || (this.model && this.model.profiles) || [];
    const trainees = allProfiles.filter(p => p.profileType === 'TRAINEE' || p.role === 'TRAINEE');
    const devotees = allProfiles.filter(p => p.profileType === 'DEVOTEE' || p.role === 'DEVOTEE');
    if (this.countAccordionTrainees) this.countAccordionTrainees.textContent = trainees.length;
    if (this.countAccordionDevotees) this.countAccordionDevotees.textContent = devotees.length;
    if (this.listAccordionTrainees) {
      this.listAccordionTrainees.innerHTML = trainees.map(t => `<div class="accordion-sub-item" data-id="${t.id}">${t.name || t.id}</div>`).join("");
    }
    if (this.listAccordionDevotees) {
      this.listAccordionDevotees.innerHTML = devotees.map(d => `<div class="accordion-sub-item" data-id="${d.id}">${d.name || d.id}</div>`).join("");
    }
  }

  _renderCategorizedTraineeSadhanas(sadhanas, profile = null) {
    const activeProf = profile || (this.model && typeof this.model.getActiveProfile === 'function' ? this.model.getActiveProfile() : null);
    this._updateSadhakProfileIdentity(activeProf);

    // 1. Render Left Slim Panel 1: Trainee & Devotee Accordion Lists
    if (typeof this._renderTraineeNetworkSlimLists === 'function') {
      this._renderTraineeNetworkSlimLists(activeProf);
    }

    // Ensure 3-column container is displayed
    if (this.traineeTeamPanel) {
      this.traineeTeamPanel.style.setProperty("display", "none", "important");
    }
    if (this.traineeSlimPanel) this.traineeSlimPanel.style.display = "flex";
    if (this.traineePracticesPanel) {
      this.traineePracticesPanel.style.display = "flex";
      this.traineePracticesPanel.style.flexShrink = "0";
    }
    if (this.traineeBodyPanel) {
      this.traineeBodyPanel.style.display = "flex";
      this.traineeBodyPanel.style.flex = "1 1 0";
      this.traineeBodyPanel.style.width = "100%";
      this.traineeBodyPanel.style.minWidth = "0";
    }

    // Bind selected member strictly to activeProf (Single Source of Truth)
    this.selectedTraineeMemberId = activeProf?.id || null;
    const selectedMember = activeProf;

    // 2. Render Panel 2: Practices List of Selected Member
    if (this.practicesMemberName) {
      this.practicesMemberName.textContent = selectedMember?.name || "Selected Member";
    }

    const memberPractices = this.getTraineeMemberPractices(selectedMember);

    const catalog = (this.model && typeof this.model.getSadhanaCatalog === "function")
      ? this.model.getSadhanaCatalog()
      : {};

    const sadhanasList = memberPractices.filter((s) => {
      const k = s.sadhanaKey || s.id;
      const catItem = catalog[k] || {};
      const catDomain = (s.categoryDomain || s.domain || catItem.domain || "").toLowerCase();
      if (catDomain === "sadhanas" || catDomain === "sadhana") return true;
      if (catDomain === "remedies" || catDomain === "remedy") return false;

      const catStr = [s.category, catItem.category, s.title, s.name, catItem.title, k].filter(Boolean).join(" ").toLowerCase();
      return (
        catStr.includes("sadhana") ||
        catStr.includes("shield") ||
        catStr.includes("suraksha") ||
        catStr.includes("yantra") ||
        catStr.includes("kavach") ||
        catStr.includes("bhairav") ||
        catStr.includes("chamunda") ||
        catStr.includes("diwali") ||
        catStr.includes("diksha") ||
        catStr.includes("debts") ||
        catStr.includes("mantra")
      );
    });

    const remediesList = memberPractices.filter((s) => !sadhanasList.includes(s));

    if (this.countAccordionSadhanas) this.countAccordionSadhanas.textContent = sadhanasList.length;
    if (this.countAccordionRemedies) this.countAccordionRemedies.textContent = remediesList.length;

    // Default selected practice
    if (!this.selectedTraineeId || !memberPractices.some((s) => s.id === this.selectedTraineeId)) {
      this.selectedTraineeId = sadhanasList[0]?.id || remediesList[0]?.id || memberPractices[0]?.id || null;
    }

    const renderPracticeList = (items, fallbackDomain = "sadhana") => {
      if (!items || items.length === 0) {
        return `<div style="font-size: 0.72rem; color: var(--text-muted); font-style: italic; padding: 0.6rem 0.5rem; text-align: center;">No ${fallbackDomain} items enrolled.</div>`;
      }
      return items
        .map((ts) => {
          const isSelected = ts.id === this.selectedTraineeId;
          const sadhanaKey = ts.sadhanaKey || ts.id;
          const catalogItem = catalog[sadhanaKey] || { icon: fallbackDomain === "sadhana" ? "🕉️" : "🪔" };
          const progressVal = Math.min(100, Math.max(0, parseInt(ts.progressPercent, 10) || 0));
          return `
            <div class="trainee-practice-item ${isSelected ? "active" : ""}" 
                 data-item-id="${ts.id}" 
                 data-member-id="${selectedMember?.id || ""}">
              <div class="practice-item-info">
                <div class="practice-item-title">
                  <span>${catalogItem.icon || (fallbackDomain === "sadhana" ? "🕉️" : "🪔")}</span>
                  <span>${esc(ts.title || ts.name || "Practice")}</span>
                </div>
                <div class="practice-item-meta">
                  ${ts.level || "Initiation"} &bull; 
                  <span style="color: ${ts.verificationStatus === "VERIFIED" ? "#10b981" : ts.verificationStatus === "PENDING_APPROVAL" ? "#f59e0b" : "var(--text-muted)"};">
                    ${ts.verificationStatus === "VERIFIED" ? "Sealed" : ts.verificationStatus === "PENDING_APPROVAL" ? "Pending" : "Active"}
                  </span>
                </div>
              </div>
              <span class="practice-progress-mini">${progressVal}%</span>
            </div>
          `;
        })
        .join("");
    };

    // Ensure both accordion sections are active and open by default
    const secSadhanas = document.getElementById("accordion-section-sadhanas");
    const secRemedies = document.getElementById("accordion-section-remedies");
    if (secSadhanas) secSadhanas.classList.add("active", "open");
    if (secRemedies) secRemedies.classList.add("active", "open");
    if (this.listAccordionSadhanas) {
      this.listAccordionSadhanas.style.display = "block";
      this.listAccordionSadhanas.innerHTML = renderPracticeList(sadhanasList, "sadhana");
    }
    if (this.listAccordionRemedies) {
      this.listAccordionRemedies.style.display = "block";
      this.listAccordionRemedies.innerHTML = renderPracticeList(remediesList, "remedy");
    }
    const arrowSadhanas = document.getElementById("arrow-accordion-sadhanas");
    const arrowRemedies = document.getElementById("arrow-accordion-remedies");
    if (arrowSadhanas) arrowSadhanas.textContent = "▼";
    if (arrowRemedies) arrowRemedies.textContent = "▼";

    // 3. Render 3rd Body: 2-Column Progress & Feedback Report
    const activeItem = memberPractices.find((s) => s.id === this.selectedTraineeId) || memberPractices[0] || null;
    this._renderTraineeActiveDetail(activeItem, selectedMember);
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
          <button type="button" class="btn-memo-tool btn-memo-send btn-add-trainee-memo" title="Submit Input with Date-Time Stamp" data-item-id="${targetItemId}">
            <svg class="send-vector-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/></svg>
          </button>
        </div>

        <div class="memo-quick-chips-wrap" id="quick-chips-${textareaId}" style="display: none;">
          ${chips.map((chip) => `<span class="memo-quick-chip" data-target="${textareaId}">${chip}</span>`).join("")}
        </div>
      </div>
    `;
  }

  _renderTraineeActiveDetail(item, profile = null) {
    const bannerEl = this.traineeSelectedPracticeBanner || document.getElementById("trainee-selected-practice-banner");
    const activeProf = profile || (this.model && typeof this.model.getActiveProfile === 'function' ? this.model.getActiveProfile() : null);
    const profName = activeProf ? (activeProf.name || "Spiritual Karim Khan") : "Spiritual Karim Khan";

    if (!item) {
      if (bannerEl) {
        bannerEl.innerHTML = `
          <div class="selected-practice-empty-note">
            <span>🕉️</span> <span>Select any Sadhana or Remedy from the left panel to view live progress, stats &amp; reports.</span>
          </div>
        `;
      }
      if (this.traineeActiveDetailContainer) {
        this.traineeActiveDetailContainer.innerHTML = `
          <div class="trainee-detail-card" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem 1rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🕉️</div>
            <h4 style="font-family: var(--font-heading); color: var(--gold-400); margin-bottom: 0.35rem;">No Active Sadhana Selected</h4>
            <p style="font-size: 0.8rem;">Select any Sadhana or Remedy tile from the left practices panel to view graphical progress, level details, and feedback reports.</p>
          </div>
        `;
      }
      return;
    }

    const isPaid = item.isPaid !== false && item.paymentStatus !== "FREE";
    const sadhanaKey = item.sadhanaKey || item.id;
    const catalog = (this.model && typeof this.model.getSadhanaCatalog === 'function') ? this.model.getSadhanaCatalog() : {};
    const catalogItem = catalog[sadhanaKey] || {
      icon: "🌿",
      category: "Sadhana",
    };
    const progress = Math.min(
      100,
      Math.max(0, parseInt(item.progressPercent, 10) || 0),
    );
    const vStatus = item.verificationStatus || "UNVERIFIED";

    // Resolve designated upline healer dynamically
    const profiles = this.model?.profiles || [];
    const sponsorCode = item.mentorCode || activeProf?.referredByCode || (this.model && typeof this.model.getDefaultMentorCode === "function" ? this.model.getDefaultMentorCode() : "SKHM-ADM1-7788-9900");
    const mentorObj = profiles.find(p => p.referenceCode === sponsorCode || p.id === sponsorCode);
    const mentorName = item.mentorName || (mentorObj ? mentorObj.name : null) || activeProf?.referredByName || (this.model && typeof this.model.getSetting === "function" ? this.model.getSetting("defaultMentorName", "Acharya Devendra") : "Acharya Devendra");
    const mentorRole = mentorObj?.profileType === 'ADMIN' || mentorObj?.level === 0 ? "👑 Founder Master" : "🛡️ Senior Healer (Upline)";

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
              author: mentorName,
              text: "Initial attunement completed. Commenced daily sadhana regime.",
            },
          ];

    const currentRole = (this.model && typeof this.model.getRoleMode === 'function') ? this.model.getRoleMode() : 'MASTER';
    const canApprove = (currentRole === 'MASTER' || currentRole === 'ADMIN' || currentRole === 'HEALER');

    // 1. Render Top Single-Row Banner: Selected Sadhana / Remedy with Progress Graphic Report
    if (bannerEl) {
      bannerEl.innerHTML = `
        <div class="selected-practice-banner-inner">
          <div class="banner-practice-left">
            <span class="banner-practice-icon">${catalogItem.icon || "🌿"}</span>
            <div class="banner-practice-title-group">
              <div class="banner-title-line">
                <span class="banner-title-prefix">Selected ${esc(item.categoryDomain || catalogItem.category || "Practice")}:</span>
                <strong class="banner-title-name">${esc(item.title || item.name || "Sacred Practice")}</strong>
              </div>
              <div class="banner-title-subtitle">
                ✨ Sadhana Mastery &amp; Attunement Progress &bull; Real-Time Mentor Feedback &amp; Verification Analytics
              </div>
            </div>
          </div>
          <div class="banner-practice-right">
            <span class="applied-token-chip" title="Initiation Token">Token: ${esc(item.initiationToken || 'IN-SADH-INITIATED')}</span>
            <span class="role-badge badge-cycle" title="Active Sadhana Cycle">DAY ${item.currentCycleDay || 7} / ${item.cycleDays || 21}</span>
            <span class="stamp-indicator ${isPaid ? "stamp-paid" : "stamp-free"} btn-tile-stamp-toggle" data-item-id="${item.id}" title="Toggle Paid/Free">
              ${isPaid ? "PAID" : "FREE"}
            </span>
            <div class="banner-progress-meter-wrap">
              <div class="banner-meter-text">
                <span>Progress:</span>
                <strong>${progress}%</strong>
              </div>
              <div class="banner-track-bar">
                <div class="banner-track-fill" style="width: ${progress}%;"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (!this.traineeActiveDetailContainer) return;

    // 2. Render Two Vertically Compact Columns (Col 1: Practitioner Profile, Col 2: Designated Upline Healer)
    this.traineeActiveDetailContainer.innerHTML = `
      <!-- COLUMN 1: Practitioner Profile: + respective metadata details vertically compact -->
      <div class="trainee-detail-card compact-column" data-item-id="${item.id}" id="trainee-col-details">
        <div class="trainee-detail-header compact-header">
          <div class="trainee-detail-title-wrap">
            <span class="trainee-detail-icon">👤</span>
            <div>
              <div class="compact-header-title">
                <span>Practitioner Profile:</span>
                <strong style="color: var(--text-primary); font-size: 0.95rem;">${esc(profName)}</strong>
              </div>
              <div class="compact-header-meta">
                <span class="role-badge" style="font-size: 0.68rem;">${esc(activeProf?.profileType || activeProf?.role || "Sadhak")}</span>
                <span class="font-mono text-muted" style="font-size: 0.7rem;">${esc(activeProf?.referenceCode || "")}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Practice Parameters 2x2 Grid (Vertically Compact) -->
        <div class="compact-form-grid">
          <div class="form-group compact-group">
            <label class="form-label compact-label">Advancement Level</label>
            <select class="form-control form-control-sm active-ts-level-select" data-item-id="${item.id}" data-member-id="${activeProf?.id || ''}">
              <option value="Level 1 — Novice Initiation" ${item.level?.includes("Level 1") ? "selected" : ""}>Level 1 &mdash; Initiation</option>
              <option value="Level 2 — Mantra Diksha" ${item.level?.includes("Level 2") ? "selected" : ""}>Level 2 &mdash; Diksha</option>
              <option value="Level 3 — Havan & Energy Transmission" ${item.level?.includes("Level 3") ? "selected" : ""}>Level 3 &mdash; Havan</option>
              <option value="Level 4 — Master Attunement" ${item.level?.includes("Level 4") ? "selected" : ""}>Level 4 &mdash; Master</option>
            </select>
          </div>
          <div class="form-group compact-group">
            <label class="form-label compact-label">Progress %</label>
            <input type="number" class="form-control form-control-sm active-ts-progress-input" data-item-id="${item.id}" data-member-id="${activeProf?.id || ''}" min="0" max="100" value="${progress}">
          </div>
          <div class="form-group compact-group">
            <label class="form-label compact-label">Daily Malas</label>
            <input type="text" class="form-control form-control-sm active-ts-target-input" data-item-id="${item.id}" data-member-id="${activeProf?.id || ''}" value="${item.dailyTarget || "11 Malas"}">
          </div>
          <div class="form-group compact-group">
            <label class="form-label compact-label">Active Streak</label>
            <input type="text" class="form-control form-control-sm active-ts-streak-input" data-item-id="${item.id}" data-member-id="${activeProf?.id || ''}" value="${item.currentStreak || "1 Day"}">
          </div>
        </div>

        <!-- Feedback Request Status Strip & Action (Compact) -->
        <div class="compact-status-action-row">
          <div class="status-action-info">
            <span class="status-action-label">Feedback Status:</span>
            ${
              vStatus === "VERIFIED"
                ? `<span class="verification-status-badge status-verified">🟢 Sealed</span>`
                : vStatus === "PENDING_APPROVAL"
                  ? `<span class="verification-status-badge status-pending">⏳ Sent</span>`
                  : `<span class="verification-status-badge status-unverified">⚪ Self Practice</span>`
            }
          </div>
          <button type="button" class="btn btn-xs btn-gold btn-verify-request" data-item-id="${item.id}" data-member-id="${activeProf?.id || ''}">
            <span>📤</span> ${vStatus === "PENDING_APPROVAL" ? "Resend Request" : "Send Feedback Request"}
          </button>
        </div>

        <!-- Feedback & Sent Memo Log Timeline (Compact) -->
        <div class="memo-section-wrap compact-memo-wrap">
          <div class="memo-section-title">
            <span>💬 Feedback &amp; Sent Memo Log (${memos.length})</span>
          </div>
          <div class="memo-timeline-container compact-timeline" id="trainee-memo-timeline" style="max-height: 110px; overflow-y: auto;">
            ${memos.map(m => `
              <div class="memo-timeline-item ${m.type === "VERIFIED" ? "verification-log" : m.type === "PENDING" ? "pending-log" : ""}">
                <div class="memo-meta">
                  <strong style="color: ${m.type === "VERIFIED" ? "#10b981" : m.type === "PENDING" ? "#f59e0b" : "var(--gold-400)"}; font-size: 0.72rem;">
                    ${esc(m.author || "Sadhak / Mentor")}
                  </strong>
                  <span style="font-size: 0.66rem;">📅 ${m.date || "Just now"}</span>
                </div>
                <div class="memo-text" style="font-size: 0.73rem;">${esc(m.text || "")}</div>
              </div>
            `).join("")}
          </div>
          <div class="mt-1">
            ${this.renderUniversalMemoBox({
              textareaId: "trainee-new-memo-text",
              targetItemId: item.id,
              placeholder: "Enter progress note or question for " + mentorName + "...",
              quickChips: [
                "11 Malas Completed",
                "Sunset Protocol Done",
                "Third Eye Vibration Felt",
                "Obstacles Cleared",
                "Requesting Next Guidance"
              ],
            })}
          </div>
        </div>
      </div>

      <!-- COLUMN 2: Designated Upline Healer + respective metadata details vertically compact -->
      <div class="trainee-detail-card compact-column" data-item-id="${item.id}" id="trainee-col-progress">
        <div class="trainee-detail-header compact-header">
          <div class="trainee-detail-title-wrap">
            <span class="trainee-detail-icon">🛡️</span>
            <div>
              <div class="compact-header-title">
                <span>Designated Upline Healer:</span>
                <strong style="color: var(--text-primary); font-size: 0.95rem;">${esc(mentorName)}</strong>
              </div>
              <div class="compact-header-meta">
                <span class="role-badge" style="background: rgba(59, 130, 246, 0.15); color: #2563eb; font-size: 0.68rem;">${mentorRole}</span>
                <span class="font-mono text-muted" style="font-size: 0.7rem;">${sponsorCode}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Metric Tiles Grid (Compact) -->
        <div class="compact-metrics-quad">
          <div class="quad-metric-card">
            <div class="quad-metric-label">Daily Target</div>
            <div class="quad-metric-val">${item.dailyTarget || "11 Malas"}</div>
          </div>
          <div class="quad-metric-card">
            <div class="quad-metric-label">Active Streak</div>
            <div class="quad-metric-val" style="color: #10b981;">🔥 ${item.currentStreak || "1 Day"}</div>
          </div>
          <div class="quad-metric-card">
            <div class="quad-metric-label">Mantra Total</div>
            <div class="quad-metric-val" style="color: var(--gold-400);">${(progress * 108).toLocaleString()}</div>
          </div>
          <div class="quad-metric-card">
            <div class="quad-metric-label">Attunement</div>
            <div class="quad-metric-val" style="color: ${vStatus === "VERIFIED" ? "#10b981" : vStatus === "PENDING_APPROVAL" ? "#f59e0b" : "var(--text-muted)"};">
              ${vStatus === "VERIFIED" ? "Sealed" : vStatus === "PENDING_APPROVAL" ? "Pending" : "Active"}
            </div>
          </div>
        </div>

        <!-- 108-Bead Japa Graphical Mala Bead Tracker Strip (Compact) -->
        <div class="compact-bead-strip">
          <div class="bead-strip-header">
            <span>📿 108-Bead Japa Matrix</span>
            <span>Quadrant Progression (${progress}%)</span>
          </div>
          <div class="bead-strip-dots">
            ${Array.from({ length: 54 }).map((_, idx) => {
              const beadCompleted = (idx / 54) * 100 <= progress;
              return `<span class="bead-dot ${beadCompleted ? 'bead-done' : ''}"></span>`;
            }).join("")}
          </div>
        </div>

        <!-- Upline Healer Feedback Received & Seal Card (Compact) -->
        <div class="feedback-received-seal-card compact-seal-card" style="background: ${vStatus === "VERIFIED" ? "linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(212, 175, 55, 0.08))" : "var(--bg-surface, #f8fafc)"}; border: 1.5px solid ${vStatus === "VERIFIED" ? "rgba(16, 185, 129, 0.4)" : "var(--border-subtle, #e2e8f0)"};">
          <div class="seal-card-header">
            <span class="seal-header-title" style="font-weight: 700; font-size: 0.78rem;">🛡️ Upline Seal &amp; Guidance</span>
            ${vStatus === "VERIFIED"
              ? `<span class="verification-status-badge status-verified" style="font-size: 0.68rem;">SANCTIONED</span>`
              : vStatus === "PENDING_APPROVAL"
                ? `<span class="verification-status-badge status-pending" style="font-size: 0.68rem;">AWAITING</span>`
                : `<span class="verification-status-badge status-unverified" style="font-size: 0.68rem;">NOT SUBMITTED</span>`
            }
          </div>
          ${vStatus === "VERIFIED" ? `
            <div class="seal-content-box">
              <div class="seal-meta-line">
                <span>By: <strong>${esc(item.verifiedBy || mentorName)}</strong></span>
                <span>Date: <strong>${item.verifiedDate || "Recently"}</strong></span>
              </div>
              <div class="seal-quote">
                "${esc(item.feedbackNotes || item.mentorRemarks || 'Sadhana attunement completed with optimal astral vibration. Initiation seal sanctioned.')}"
              </div>
            </div>
          ` : `
            <div class="seal-empty-note">
              ${vStatus === "PENDING_APPROVAL" ? `Feedback request dispatched to ${esc(mentorName)}. Guidance notes &amp; seal will appear here upon review.` : `Click "Send Feedback Request" in Column 1 to submit progress to ${esc(mentorName)}.`}
            </div>
          `}
        </div>

        <!-- Direct Healer Sanction Action Panel (If canApprove) -->
        ${canApprove ? `
          <div class="compact-healer-sanction-box">
            <div class="sanction-box-title"><span>🛡️</span> Upline Healer Sanction Action:</div>
            <textarea class="form-control form-control-sm healer-feedback-input" id="healer-feedback-text" rows="2" placeholder="Enter mentor guidance notes or feedback for ${esc(activeProf?.name || 'practitioner')}..."></textarea>
            <div class="sanction-btn-row">
              <button type="button" class="btn btn-xs btn-success btn-verify-approve" data-item-id="${item.id}" data-member-id="${activeProf?.id || ''}">
                ✅ ${vStatus === "VERIFIED" ? "Update Seal" : "Sanction & Seal"}
              </button>
              <button type="button" class="btn btn-xs btn-outline btn-verify-reject" data-item-id="${item.id}" data-member-id="${activeProf?.id || ''}">
                📝 Revision
              </button>
            </div>
          </div>
        ` : ''}
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
    const headerBadge = document.getElementById("header-portal-badge") || document.querySelector(".header-portal-badge");
    if (headerBadge) {
      if (isMaster) {
        headerBadge.innerHTML = "👑 MASTER FOUNDER";
        headerBadge.className = "header-portal-badge badge-admin";
        document.title = "Master Admin Portal • Shree Spritual Karim Sansthan";
      } else if (isHealer) {
        headerBadge.innerHTML = "🛡️ CERTIFIED HEALER";
        headerBadge.className = "header-portal-badge badge-healer";
        document.title = "Healers Portal • Shree Spritual Karim Sansthan";
      } else if (isTrainee) {
        headerBadge.innerHTML = "📿 TRAINEE SADHAK";
        headerBadge.className = "header-portal-badge badge-trainee";
        document.title = "Trainee Sadhak Portal • Shree Spritual Karim Sansthan";
      } else if (isDevotee) {
        headerBadge.innerHTML = "🌟 DEVOTEE / SEEKER";
        headerBadge.className = "header-portal-badge badge-devotee";
        document.title = "Devotee Portal • Shree Spritual Karim Sansthan";
      }
    }

    // 7. Address Bar URL Synchronization
    this.syncAddressBarUrl(roleMode);
  }

  syncAddressBarUrl(roleMode) {
    try {
      if (typeof window === "undefined" || !window.location || typeof URL === "undefined") return;
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

  // Reusable Slide-out Right Drawer Toggle Mechanics (1st click open, 2nd click close)
  toggleSadhanaDrawer(sadhanaKey) {
    if (this.isSadhanaDrawerOpen && this.currentSadhanaKey === sadhanaKey) {
      this.closeSadhanaDrawer();
    } else {
      this.openSadhanaDrawer(sadhanaKey);
    }
  }

  // Slide-out Drawer Rendering
  openSadhanaDrawer(sadhanaKey) {
    this.isSadhanaDrawerOpen = true;
    this.currentSadhanaKey = sadhanaKey;

    const catalog = (this.model && typeof this.model.getSadhanaCatalog === 'function') ? this.model.getSadhanaCatalog() : {};
    const item = catalog[sadhanaKey] || catalog.sri_yantra || {
      id: sadhanaKey,
      title: sadhanaKey,
      category: "Sadhana",
      levelScope: "All Levels",
      icon: "🕉️",
      summary: "Sacred spiritual practice and divine ritual.",
      mantra: "Om Namah Shivaya",
      timing: "Brahma Muhurta (4:00 AM – 6:00 AM)",
      aasanDirection: "Kusha Aasan facing East",
      ingredients: "Pure Cow Ghee Diya, Ganga Jal, Camphor, Consecrated Incense",
      steps: ["Perform Aachaman and purify hands.", "Light the sacred flame.", "Chant mantra with focused meditative attention."],
      benefits: "Astral protection, karmic debt alleviation, spiritual elevation.",
      cautions: "Maintain strict sattvic discipline during practice."
    };

    if (this.sadhanaDrawerTitle)
      this.sadhanaDrawerTitle.textContent = item.title;
    if (this.sadhanaDrawerCategory)
      this.sadhanaDrawerCategory.textContent = `${item.category || 'Sadhana'} • ${item.levelScope || 'All Levels'}`;
    if (this.sadhanaDrawerIcon) this.sadhanaDrawerIcon.textContent = item.icon || '🕉️';

    // Highlight active inspecting tile across all remedy/sadhana tiles
    document.querySelectorAll('.remedy-card-option').forEach(tile => {
      const tileKey = tile.getAttribute('data-sadhana-id') || tile.getAttribute('data-sadhana-trigger');
      if (tileKey === sadhanaKey) {
        tile.classList.add('tile-active-inspecting');
      } else {
        tile.classList.remove('tile-active-inspecting');
      }
    });

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
          <div class="sadhana-info-title"><span>⏰</span> Auspicious Timing &amp; Aasan Direction</div>
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
            ${Array.isArray(item.steps) ? item.steps.map((st) => `<li>${st}</li>`).join("") : `<li>${item.steps}</li>`}
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
      const copyBtn = this.sadhanaDrawerBody.querySelector(".btn-copy-drawer-mantra");
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
      this.btnDrawerEnroll.setAttribute("data-sadhana-key", item.id || sadhanaKey);
    if (this.btnDrawerSendTrainee)
      this.btnDrawerSendTrainee.setAttribute("data-sadhana-key", item.id || sadhanaKey);

    const drawer = this.sadhanaDrawer || document.getElementById("sadhana-detail-drawer");
    const backdrop = this.sadhanaDrawerBackdrop || document.getElementById("sadhana-drawer-backdrop");

    if (drawer) {
      drawer.style.display = "flex";
      drawer.classList.add("open", "is-open");
      drawer.setAttribute("aria-hidden", "false");
    }
    if (backdrop) {
      backdrop.style.display = "block";
      backdrop.classList.add("open", "is-open");
    }
  }

  closeSadhanaDrawer() {
    this.isSadhanaDrawerOpen = false;
    this.currentSadhanaKey = null;

    // Clear active inspecting highlight from all tiles
    document.querySelectorAll('.remedy-card-option').forEach(tile => {
      tile.classList.remove('tile-active-inspecting');
    });

    const drawer = this.sadhanaDrawer || document.getElementById("sadhana-detail-drawer");
    const backdrop = this.sadhanaDrawerBackdrop || document.getElementById("sadhana-drawer-backdrop");

    if (drawer) {
      drawer.classList.remove("open", "is-open");
      drawer.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        if (!this.isSadhanaDrawerOpen && drawer) {
          drawer.style.display = "none";
        }
      }, 350);
    }
    if (backdrop) {
      backdrop.classList.remove("open", "is-open");
      setTimeout(() => {
        if (!this.isSadhanaDrawerOpen && backdrop) {
          backdrop.style.display = "none";
        }
      }, 300);
    }
  }

  // ==============================================================
  // CREATE PROFILE MODAL METHODS (System 1 Direct Admin & Onboard)
  // ==============================================================
  openCreateProfileModal(activeProfile) {
    if (this.newProfileRole) this.newProfileRole.value = "DEVOTEE";
    if (this.newProfileName) this.newProfileName.value = "";
    if (this.newProfilePhone) this.newProfilePhone.value = "+91 ";
    if (this.newProfileCity) this.newProfileCity.value = "";
    if (this.newProfileMembership) this.newProfileMembership.value = "PAID";
    if (this.newProfileSponsor) {
      const defMentor = (this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : ((typeof appConfig !== "undefined" && appConfig.defaultMentorCode) || "SKHM-ADM1-7788-9900");
      this.newProfileSponsor.value = activeProfile ? (activeProfile.referenceCode || defMentor) : defMentor;
    }
    if (this.createProfileModal) {
      this.createProfileModal.style.display = "flex";
      this.createProfileModal.classList.add("open");
      this.createProfileModal.setAttribute("aria-hidden", "false");
    }
  }

  closeCreateProfileModal() {
    if (this.createProfileModal) {
      this.createProfileModal.style.display = "none";
      this.createProfileModal.classList.remove("open");
      this.createProfileModal.setAttribute("aria-hidden", "true");
    }
  }

  readCreateProfileForm() {
    return {
      role: this.newProfileRole ? this.newProfileRole.value : "DEVOTEE",
      name: this.newProfileName ? this.newProfileName.value.trim() : "",
      phone: this.newProfilePhone ? this.newProfilePhone.value.trim() : "",
      city: this.newProfileCity ? this.newProfileCity.value.trim() : "",
      sponsorCode: this.newProfileSponsor ? this.newProfileSponsor.value.trim() : "",
      membership: this.newProfileMembership ? this.newProfileMembership.value : "PAID"
    };
  }

  // ==============================================================
  // RIGHT SLIDE-OUT DRAWER: PENDING APPROVALS
  // ==============================================================
  // ==============================================================
  // RIGHT SLIDE-OUT DRAWER: PENDING APPROVALS DOSSIER & ACTIONS
  // ==============================================================
  openPendingApprovalsDrawer(invites = [], selectedInviteId = null, initialTab = null) {
    const roleMode = (this.model ? this.model.getRoleMode() : (this.currentRoleMode || "MASTER")).toUpperCase();
    
    // Role Mode Aware: Devotee & Trainee view their personal application status & initiation milestones
    const isEndUser = ["DEVOTEE", "SEEKER", "TRAINEE", "SADHAK"].includes(roleMode);

    const drawer = this.pendingApprovalDrawer || document.getElementById("pending-approval-drawer");
    const backdrop = this.pendingApprovalDrawerBackdrop || document.getElementById("pending-approval-drawer-backdrop");
    const body = this.pendingApprovalDrawerBody || document.getElementById("pending-approval-drawer-body");
    if (!drawer) return;

    if (initialTab) {
      this.currentPendingDrawerTab = initialTab;
    } else if (!this.currentPendingDrawerTab) {
      this.currentPendingDrawerTab = "registration";
    }

    if (!invites || invites.length === 0) {
      if (this.model && typeof this.model.getPairingInvitesForRole === "function") {
        invites = this.model.getPairingInvitesForRole(roleMode, this.model.getActiveProfile());
      } else if (this.model && typeof this.model.getPairingInvites === "function") {
        invites = this.model.getPairingInvites();
      }
    }

    // Retrieve Sadhana & Remedy applications from Model
    let sadhanaApps = [];
    if (this.model && typeof this.model.getSadhanaRemedyApplications === "function") {
      sadhanaApps = this.model.getSadhanaRemedyApplications();
    } else {
      try {
        sadhanaApps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]");
      } catch (e) {
        sadhanaApps = [];
      }
    }
    // FILTER ARCHIVED OUT OF MAIN VIEWS
    sadhanaApps = sadhanaApps.filter(a => a.status !== "DELETED");

    // Calculate pending counts for tab badges
    const inviteTtl = (window.ProfileModel && window.ProfileModel.settings && window.ProfileModel.settings.inviteExpiryHours) ? window.ProfileModel.settings.inviteExpiryHours * 3600 * 1000 : 86400000;
    const now = Date.now();
    const activePendingInvites = (invites || []).filter(i => {
      const remMs = (i.expiresAtMs || ((i.createdAtMs || i.timestamp || Date.now()) + inviteTtl)) - now;
      return (i.status === "PENDING" || i.status === "PENDING_APPROVAL") && remMs > 0;
    });
    const pendingRegCount = activePendingInvites.length;
    const pendingSadhanaCount = (sadhanaApps || []).filter(a => a.status === "PENDING").length;

    // Update Tab Badges
    const badgeReg = document.getElementById("tab-badge-pending-registration");
    if (badgeReg) badgeReg.textContent = pendingRegCount;
    const badgeSadhana = document.getElementById("tab-badge-pending-sadhana");
    if (badgeSadhana) badgeSadhana.textContent = pendingSadhanaCount;

    const btnTabReg = document.getElementById("tab-btn-pending-registration");
    const btnTabSadhana = document.getElementById("tab-btn-pending-sadhana");
    if (btnTabReg && btnTabSadhana) {
      if (this.currentPendingDrawerTab === "sadhana-remedy") {
        btnTabReg.classList.remove("active");
        btnTabSadhana.classList.add("active");
      } else {
        btnTabReg.classList.add("active");
        btnTabSadhana.classList.remove("active");
      }

      btnTabReg.onclick = (e) => {
        e.preventDefault();
        this.switchPendingDrawerTab("registration");
      };
      btnTabSadhana.onclick = (e) => {
        e.preventDefault();
        this.switchPendingDrawerTab("sadhana-remedy");
      };
    }

    if (body) {
      let regPane = document.getElementById("pending-tab-pane-registration");
      let sadhanaPane = document.getElementById("pending-tab-pane-sadhana");

      if (!regPane || !sadhanaPane) {
        body.innerHTML = `
          <div id="pending-tab-pane-registration" class="pending-tab-pane" style="display: block;"></div>
          <div id="pending-tab-pane-sadhana" class="pending-tab-pane" style="display: none;"></div>
        `;
        regPane = document.getElementById("pending-tab-pane-registration");
        sadhanaPane = document.getElementById("pending-tab-pane-sadhana");
      }

      // Render Tab 1: Registration (100% existing functionality intact)
      this.renderRegistrationApprovalsTab(invites, selectedInviteId, regPane);

      // Render Tab 2: Sadhana & Remedy (complete metadata and actions)
      this.renderSadhanaRemedyApprovalsTab(sadhanaApps, selectedInviteId, sadhanaPane);

      // Show/Hide active pane
      if (this.currentPendingDrawerTab === "sadhana-remedy") {
        if (regPane) regPane.style.display = "none";
        if (sadhanaPane) sadhanaPane.style.display = "block";
      } else {
        if (regPane) regPane.style.display = "block";
        if (sadhanaPane) sadhanaPane.style.display = "none";
      }
    }

    drawer.classList.add("open", "is-open");
    drawer.setAttribute("aria-hidden", "false");
    drawer.style.display = "flex";
    if (backdrop) {
      backdrop.style.display = "block";
      backdrop.classList.add("open", "is-open");
    }

    // Explicitly wire close actions directly
    const btnClose = drawer.querySelector("#btn-close-pending-approval-drawer, #btn-close-pending-drawer");
    if (btnClose) {
      btnClose.onclick = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        this.closePendingApprovalsDrawer();
      };
    }
    if (backdrop) {
      backdrop.onclick = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        this.closePendingApprovalsDrawer();
      };
    }
  }

  switchPendingDrawerTab(tabName) {
    this.currentPendingDrawerTab = tabName;
    const btnTabReg = document.getElementById("tab-btn-pending-registration");
    const btnTabSadhana = document.getElementById("tab-btn-pending-sadhana");
    const regPane = document.getElementById("pending-tab-pane-registration");
    const sadhanaPane = document.getElementById("pending-tab-pane-sadhana");

    if (tabName === "sadhana-remedy") {
      if (btnTabReg) btnTabReg.classList.remove("active");
      if (btnTabSadhana) btnTabSadhana.classList.add("active");
      if (regPane) regPane.style.display = "none";
      if (sadhanaPane) sadhanaPane.style.display = "block";
    } else {
      if (btnTabReg) btnTabReg.classList.add("active");
      if (btnTabSadhana) btnTabSadhana.classList.remove("active");
      if (regPane) regPane.style.display = "block";
      if (sadhanaPane) sadhanaPane.style.display = "none";
    }
  }

  renderRegistrationApprovalsTab(invites = [], selectedInviteId = null, targetContainer = null) {
    const container = targetContainer || document.getElementById("pending-tab-pane-registration");
    if (!container) return;

    if (!invites || invites.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🌟</div>
          <h4 style="color: var(--text-primary); margin-bottom: 0.35rem; font-family: var(--font-heading); font-size: 1.15rem;">No Pending Registration Approvals</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 360px; margin: 0 auto 1.25rem;">All devotee applicants have been reviewed and placed into downline lineage. Click below to generate a new direct pairing invite link!</p>
          <a href="join.html?ref=${(this.activeProfile && this.activeProfile.referenceCode) || ((this.model && typeof this.model.getDefaultMentorCode === 'function') ? this.model.getDefaultMentorCode() : 'SKHM-ADM1-7788-9900')}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1.1rem; background: var(--gold-400, #d4af37); color: #000; font-weight: 800; font-size: 0.82rem; border-radius: 6px; text-decoration: none;">
            <span>📲 Test Direct Onboarding Link (join.html)</span>
          </a>
        </div>
      `;
      return;
    }

    const now = Date.now();
    const inviteTtl = (window.ProfileModel && window.ProfileModel.settings && window.ProfileModel.settings.inviteExpiryHours) ? window.ProfileModel.settings.inviteExpiryHours * 3600 * 1000 : 86400000;

    // Strict separation of concerns: Filter strictly for Registration & Onboarding pairing invites.
    // Sadhana & Trainee Sadhak elevation applications belong exclusively to the "Sadhana & Remedies" tab.
    const regOnlyInvites = (invites || []).filter(i => 
      i &&
      i.type !== "SADHANA_APPLICATION" && 
      i.type !== "REMEDY_APPLICATION" && 
      i.contextType !== "sadhana" && 
      i.contextType !== "remedy" &&
      !i.id?.startsWith("sadhana-") &&
      !i.id?.startsWith("remedy-")
    );

    // Sort: Pending accounts first, followed by approved/rejected, then newest
    const sortedInvites = [...regOnlyInvites].sort((a, b) => {
      const aIsPending = (a.status === "PENDING" || a.status === "PENDING_APPROVAL") ? 0 : 1;
      const bIsPending = (b.status === "PENDING" || b.status === "PENDING_APPROVAL") ? 0 : 1;
      if (aIsPending !== bIsPending) return aIsPending - bIsPending;
      return (b.createdAtMs || b.timestamp || 0) - (a.createdAtMs || a.timestamp || 0);
    });

    // Statistics strictly for Registration queue
    const totalCount = sortedInvites.length;
    const activePendingInvites = sortedInvites.filter(i => {
      const remMs = (i.expiresAtMs || ((i.createdAtMs || i.timestamp || Date.now()) + inviteTtl)) - now;
      return (i.status === "PENDING" || i.status === "PENDING_APPROVAL") && remMs > 0;
    });
    const pendingCount = activePendingInvites.length;
    const approvedCount = sortedInvites.filter(i => i.status === "APPROVED").length;
    const expiredCount = sortedInvites.filter(i => {
      const remMs = (i.expiresAtMs || ((i.createdAtMs || i.timestamp || Date.now()) + inviteTtl)) - now;
      return i.status === "EXPIRED" || i.status === "REVISION" || ((i.status === "PENDING" || i.status === "PENDING_APPROVAL") && remMs <= 0);
    }).length;

    // Grouping strictly for Registration tiers: Tier 2 (Certified Healers) & Tier 4 (Devotee Sangha).
    // Trainee Sadhak is an internal spiritual elevation tier handled exclusively in the Sadhana & Remedies tab.
    const healerGroup = sortedInvites.filter(i => (i.appliedRole === "HEALER" || i.assignedRole === "HEALER" || i.type === "HEALER_APPLICATION") && i.status !== "EXPIRED" && i.status !== "REVISION");
    const devoteeGroup = sortedInvites.filter(i => {
      const isHealer = i.appliedRole === "HEALER" || i.assignedRole === "HEALER" || i.type === "HEALER_APPLICATION";
      return !isHealer && i.status !== "EXPIRED" && i.status !== "REVISION";
    });
    const reviewExpiredGroup = sortedInvites.filter(i => i.status === "EXPIRED" || i.status === "REVISION" || i.status === "REJECTED");

    const groups = [
      { id: "group-healers", icon: "🛡️", title: "Tier 2 • Certified Healer Applications", items: healerGroup, badgeColor: "#38bdf8" },
      { id: "group-devotees", icon: "🌟", title: "Tier 4 • Devotee Sangha Applications", items: devoteeGroup, badgeColor: "#10b981" },
      { id: "group-expired", icon: "⌛", title: "Under Revision / Expired Queue", items: reviewExpiredGroup, badgeColor: "#f43f5e" }
    ].filter(g => g.items.length > 0);

    container.innerHTML = `
      <!-- STATS & SEARCH HEADER BAR -->
      <div style="margin-bottom: 1rem; padding: 0.75rem 1rem; background: var(--bg-card, rgba(24,16,36,0.9)); border: 1px solid var(--border-glass-gold, rgba(212,175,55,0.3)); border-radius: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.76rem; font-weight: 700; color: var(--text-primary); flex-wrap: wrap;">
            <span>📊 Registration Summary:</span>
            <span style="background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 12px;">⏳ ${pendingCount} Pending Review</span>
            <span style="background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; padding: 0.15rem 0.5rem; border-radius: 12px;">🛡️ ${healerGroup.length} Healers</span>
            <span style="background: rgba(16,185,129,0.2); border: 1px solid #10b981; color: #10b981; padding: 0.15rem 0.5rem; border-radius: 12px;">🌟 ${devoteeGroup.length} Devotees</span>
            ${expiredCount > 0 ? `<span style="background: rgba(244,63,94,0.2); border: 1px solid #f43f5e; color: #f43f5e; padding: 0.15rem 0.5rem; border-radius: 12px;">⌛ ${expiredCount} Revision/Expired</span>` : ''}
          </div>
          <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">Sangha Onboarding • Role Assignment</span>
        </div>

        <!-- SEARCH BAR -->
        <div style="margin-top: 0.6rem;">
          <input type="text" id="input-search-pending-drawer" placeholder="🔍 Instant search pending applicants by name, phone, or gotra..." class="form-control" style="width: 100%; box-sizing: border-box; font-size: 0.8rem; padding: 0.5rem 0.85rem; background: rgba(0,0,0,0.4); border: 1px solid var(--border-glass-gold, rgba(212,175,55,0.3)); border-radius: 6px; color: #fff;">
        </div>

        <!-- DEDICATED CALLOUT TO SADHANA & REMEDIES TAB FOR TRAINEE ELEVATIONS -->
        <div style="margin-top: 0.65rem; padding: 0.55rem 0.85rem; background: rgba(184,150,12,0.1); border: 1px solid rgba(212,175,55,0.3); border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 0.76rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.45rem; color: var(--text-primary);">
            <span style="font-size: 1.1rem;">📿</span>
            <span><strong>Trainee Sadhak &amp; Sadhana Elevation:</strong> Handled exclusively under the dedicated 2-Tier Deeksha Approval Workflow.</span>
          </div>
          <button type="button" class="btn btn-gold btn-xs btn-switch-to-sadhana-tab" style="padding: 0.3rem 0.75rem; font-size: 0.74rem; font-weight: 800; border-radius: 5px; cursor: pointer;">
            View Sadhana Approvals ➔
          </button>
        </div>
      </div>

      <!-- GROUPED PENDING APPLICANTS LIST -->
      <div id="grouped-pending-approvals-list" style="display: flex; flex-direction: column; gap: 1rem;">
        ${groups.map(group => `
          <div class="approval-tier-group" id="${group.id}">
            <div class="approval-tier-group-header">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${group.icon}</span>
                <span>${group.title}</span>
              </div>
              <span style="background: ${group.badgeColor}22; border: 1px solid ${group.badgeColor}; color: ${group.badgeColor}; padding: 0.12rem 0.5rem; border-radius: 12px; font-size: 0.72rem; font-weight: 800;">
                ${group.items.length} Applicant${group.items.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div class="approval-tier-group-body">
              ${group.items.map(item => {
                const isApproved = item.status === "APPROVED";
                const isPending = item.status === "PENDING" || item.status === "PENDING_APPROVAL";
                const assignedRole = (item.assignedRole || item.appliedRole || "DEVOTEE").toUpperCase();
                const initials = item.seekerName ? item.seekerName.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : "SK";
                const remainingMs = (item.expiresAtMs || ((item.createdAtMs || item.timestamp || Date.now()) + inviteTtl)) - now;
                const isExpired = isPending && remainingMs <= 0;
                const hours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
                const mins = Math.max(0, Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)));
                const isDetailsOpen = selectedInviteId ? (item.id === selectedInviteId) : false;

                let idProofDoc = null, addrProofDoc = null, photoDoc = null;
                try {
                  const docs = JSON.parse(localStorage.getItem('sk_documents') || '[]');
                  idProofDoc = docs.find(d => (d.profileId === item.id || d.profileId === item.devoteeCode) && d.docType === 'id_proof') || null;
                  addrProofDoc = docs.find(d => (d.profileId === item.id || d.profileId === item.devoteeCode) && d.docType === 'address_proof') || null;
                  photoDoc = docs.find(d => (d.profileId === item.id || d.profileId === item.devoteeCode) && d.docType === 'photo') || null;
                } catch(e) {}

                const photoSrc = photoDoc?.dataUrl || item.documentsUploaded?.photo || "";
                const idProofAvailable = Boolean(idProofDoc || item.documentsUploaded?.idProof || item.documents?.idProof);
                const addrProofAvailable = Boolean(addrProofDoc || item.documentsUploaded?.addressProof || item.documents?.addressProof);
                const photoAvailable = Boolean(photoDoc || item.documentsUploaded?.photo || item.documents?.photo);

                const cleanBasePath = window.location.pathname.replace(/\/(Masters|Healers|Trainee|Devotee|Seeker|Public|Frontend)\/.*$/i, '').replace(/\/+$/, '');
                const rootUrl = window.location.origin + cleanBasePath;
                const targetPortal = (assignedRole === "TRAINEE") ? "Trainee" : (assignedRole === "HEALER") ? "Healers" : (assignedRole === "MASTER") ? "Masters" : "Devotee";
                const fullJoinUrl = `${rootUrl}/join.html?ref=${item.sponsorCode || ((this.model && typeof this.model.getDefaultMentorCode === 'function') ? this.model.getDefaultMentorCode() : 'SKHM-ADM1-7788-9900')}&pin=${item.activationPin || '140610'}`;
                const fullDevoteeUrl = `${rootUrl}/${targetPortal}/index.html?profileId=${encodeURIComponent(item.devoteeCode || item.id)}`;

                return `
                  <div class="approval-item-card" data-invite-id="${item.id}">
                    <!-- Main Summary Bar -->
                    <div class="approval-item-row-main">
                      <div class="approval-item-user-info">
                        <div class="approval-item-avatar">
                          ${photoSrc ? `<img src="${photoSrc}" alt="${item.seekerName}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : initials}
                        </div>
                        <div class="approval-item-meta">
                          <div class="approval-item-name">${item.seekerName || 'Devotee Applicant'}</div>
                          <div class="approval-item-subtext">
                            <span>📱 ${item.seekerPhone || '—'}</span>
                            <span>•</span>
                            <span>Applied: <strong style="color: var(--gold-400);">${item.appliedRole || 'Devotee'}</strong></span>
                            <span>•</span>
                            <span>${isApproved ? '🟢 Inducted' : isExpired ? '⌛ Expired' : `⏳ ${hours}h ${mins}m left`}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Multiple Option Assign Roles -->
                      <div class="approval-role-selector-wrap">
                        <span class="approval-role-selector-label">Assign Role:</span>
                        <select class="approval-role-select select-pairing-role" data-invite-id="${item.id}" title="Choose role tier for approval">
                          <option value="DEVOTEE" ${assignedRole === "DEVOTEE" ? "selected" : ""}>🌟 Devotee (Level 4)</option>
                          <option value="TRAINEE" ${assignedRole === "TRAINEE" ? "selected" : ""}>📿 Trainee (Level 3)</option>
                          <option value="HEALER" ${assignedRole === "HEALER" ? "selected" : ""}>🛡️ Healer (Level 2)</option>
                          <option value="MASTER" ${assignedRole === "MASTER" ? "selected" : ""}>👑 Master (Tier 1)</option>
                        </select>
                      </div>

                      <!-- Action Buttons -->
                      <div class="approval-item-actions">
                        <button type="button" class="btn-approval-details" data-invite-id="${item.id}" title="Click to view complete applicant details">
                          <span>${isDetailsOpen ? '▲ Hide Details' : '📋 Details'}</span>
                        </button>
                        ${!isApproved ? `
                          <button type="button" class="btn-approval-quick-approve" data-invite-id="${item.id}" title="Quick Approve and induct with selected role">
                            <span>✓ Quick Approve</span>
                          </button>
                          <button type="button" class="btn-approval-delete" data-invite-id="${item.id}" title="Delete Approval" style="padding: 0.35rem; background: transparent; border: 1px solid var(--border-subtle, rgba(255,255,255,0.1)); color: #ef4444; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">
                            <span>🗑️</span>
                          </button>
                        ` : `
                          <span style="color:#10b981; font-weight:800; font-size:0.75rem; padding: 0.35rem 0.6rem; background: rgba(16,185,129,0.15); border: 1px solid #10b981; border-radius: 4px;">
                            ✓ Inducted
                          </span>
                        `}
                      </div>
                    </div>

                    <!-- On-Click Expandable All Details Pane -->
                    <div id="details-pane-${item.id}" class="approval-expanded-details-pane ${isDetailsOpen ? 'is-open' : ''}" style="${isDetailsOpen ? 'display: block;' : 'display: none;'}">
                      
                      <!-- HERO CARD -->
                      <div class="dossier-box" style="background: linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(16,185,129,0.1) 100%); border: 1.5px solid var(--gold-400); border-radius: 10px; padding: 1rem; margin-bottom: 0.85rem;">
                        <div style="display: flex; gap: 0.9rem; align-items: center;">
                          <div class="btn-preview-document-image" data-doc-title="${item.seekerName || 'Applicant'} Photo" data-doc-type="photo" data-invite-id="${item.id}" style="width: 54px; height: 54px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(16,185,129,0.2) 100%); border: 2px solid var(--gold-400); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: var(--gold-400); cursor: pointer; flex-shrink: 0;" title="Click to view full photo">
                            ${photoSrc ? `<img src="${photoSrc}" alt="Photo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : initials}
                          </div>
                          <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.25rem;">
                              <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-primary); font-family: var(--font-heading); font-weight: 800;">${item.seekerName || "Applicant Dossier"}</h4>
                              <span class="verification-status-badge ${isApproved ? 'status-verified' : isExpired ? 'status-unverified' : 'status-pending'}" style="font-size: 0.72rem; padding: 0.2rem 0.55rem;">
                                ${isApproved ? '🟢 Approved' : isExpired ? '⌛ Expired' : '⏳ Pending Approval'}
                              </span>
                            </div>
                            <div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--gold-400); font-weight: 800; margin-top: 0.15rem;">
                              ${item.devoteeCode || item.hardwareNonce || "SKDV-PROVISIONED"}
                            </div>
                            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">
                              Pairing PIN: <strong style="color:#10b981; font-family: var(--font-mono);">${item.activationPin || "140610"}</strong> • 24h Window: <span style="color:#f59e0b; font-weight:700;">${isApproved ? 'Linked' : `${hours}h ${mins}m remaining`}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- FULL HYPERLINK ACCESS -->
                      <div class="dossier-box" style="background: rgba(56, 189, 248, 0.08); border: 1.5px solid #38bdf8; border-radius: 8px; padding: 0.75rem 0.9rem; margin-bottom: 0.85rem;">
                        <div style="font-size: 0.72rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                          <span>🌐</span> Direct Verification &amp; Testing Hyperlinks
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.75rem;">
                          <div>
                            <span style="color: var(--text-muted); font-weight: 600;">Joining Form URL:</span><br>
                            <a href="${fullJoinUrl}" target="_blank" style="color: #38bdf8; font-family: var(--font-mono); font-weight: 700; word-break: break-all; text-decoration: underline;">
                              ${fullJoinUrl} ↗
                            </a>
                          </div>
                          <div>
                            <span style="color: var(--text-muted); font-weight: 600;">${assignedRole === "TRAINEE" ? "Dedicated Trainee Website" : assignedRole === "HEALER" ? "Dedicated Healer Website" : assignedRole === "MASTER" ? "Master Admin Portal" : "Dedicated Devotee Website"}:</span><br>
                            <a href="${fullDevoteeUrl}" target="_blank" style="color: #10b981; font-family: var(--font-mono); font-weight: 700; word-break: break-all; text-decoration: underline;">
                              ${fullDevoteeUrl} ↗
                            </a>
                          </div>
                        </div>
                      </div>

                      <!-- DEMOGRAPHICS DOSSIER -->
                      <div class="dossier-box" style="background: var(--bg-card, rgba(0,0,0,0.25)); border: 1px solid var(--border-subtle, rgba(255,255,255,0.08)); border-radius: 8px; padding: 0.8rem 0.9rem; margin-bottom: 0.85rem;">
                        <div style="font-size: 0.72rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.45rem; display: flex; align-items: center; gap: 0.35rem;">
                          <span>📱</span> Personal Demographics &amp; Contact
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; font-size: 0.76rem;">
                          <div>
                            <span style="color: var(--text-muted);">Phone Number:</span><br>
                            <strong style="color: var(--text-primary); font-family: var(--font-mono);">${item.seekerPhone || "—"}</strong>
                            <span style="color: #10b981; font-size: 0.68rem; font-weight:700;"> ✓ Verified</span>
                          </div>
                          <div>
                            <span style="color: var(--text-muted);">Email Address:</span><br>
                            <strong style="color: var(--text-primary);">${item.seekerEmail || "—"}</strong>
                            <span style="color: #10b981; font-size: 0.68rem; font-weight:700;"> ✓ Verified</span>
                          </div>
                          <div>
                            <span style="color: var(--text-muted);">Date of Birth:</span><br>
                            <strong style="color: var(--text-secondary);">${item.dob || "—"}</strong>
                          </div>
                          <div>
                            <span style="color: var(--text-muted);">Lineage Sponsor:</span><br>
                            <strong style="color: var(--gold-400); font-family: var(--font-mono);">${item.sponsorCode || ((this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : "SKHM-ADM1-7788-9900")}</strong>
                          </div>
                        </div>
                      </div>

                      <!-- ANCESTRAL ROOTS DOSSIER -->
                      <div class="dossier-box" style="background: rgba(245, 158, 11, 0.06); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 8px; padding: 0.8rem 0.9rem; margin-bottom: 0.85rem;">
                        <div style="font-size: 0.72rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.45rem; display: flex; align-items: center; justify-content: space-between;">
                          <span style="display: flex; align-items: center; gap: 0.35rem;">
                            <span>🕉️</span> Pillar 2: Ancestral Roots (Pitru Karma)
                          </span>
                          <span style="font-size: 0.65rem; color: #10b981; background: rgba(16,185,129,0.15); border: 1px solid #10b981; border-radius: 3px; padding: 0.05rem 0.35rem; font-weight:700;">Verified</span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; font-size: 0.76rem;">
                          <div>
                            <span style="color: var(--text-muted);">Paternal Gotra:</span><br>
                            <strong style="color: var(--gold-400); font-size: 0.82rem;">${item.lineage?.paternalGotra || "Not specified"}</strong>
                          </div>
                          <div>
                            <span style="color: var(--text-muted);">Maternal Gotra:</span><br>
                            <strong style="color: var(--gold-400); font-size: 0.82rem;">${item.lineage?.maternalGotra || "Not specified"}</strong>
                          </div>
                          <div>
                            <span style="color: var(--text-muted);">Kuldevi / Ishtadevata:</span><br>
                            <strong style="color: #10b981; font-size: 0.82rem;">${item.lineage?.kuldevi || "Not specified"}</strong>
                          </div>
                          <div>
                            <span style="color: var(--text-muted);">Ancestral Village:</span><br>
                            <strong style="color: #38bdf8; font-size: 0.82rem;">${item.lineage?.village || "Not specified"}</strong>
                          </div>
                        </div>
                      </div>

                      <!-- SADHANA PROGRESS -->
                      <div class="dossier-box" style="background: rgba(139, 92, 246, 0.06); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 8px; padding: 0.8rem 0.9rem; margin-bottom: 0.85rem;">
                        <div style="font-size: 0.72rem; font-weight: 800; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.45rem; display: flex; align-items: center; justify-content: space-between;">
                          <span style="display: flex; align-items: center; gap: 0.35rem;">
                            <span>📿</span> Sadhana Telemetry &amp; Discipline Status
                          </span>
                          <span style="font-size: 0.65rem; color: #10b981; background: rgba(16,185,129,0.15); border: 1px solid #10b981; border-radius: 3px; padding: 0.05rem 0.35rem; font-weight:700;">Compliant</span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; font-size: 0.76rem;">
                          <div>
                            <span style="color: var(--text-muted);">Daily Diya Completed:</span><br>
                            <strong style="color: #f59e0b; font-size: 0.82rem;">${item.diyaDays ? `${item.diyaDays} Days Practice` : "14 Days Foundation"}</strong>
                          </div>
                          <div>
                            <span style="color: var(--text-muted);">House Cleanliness:</span><br>
                            <strong style="color: #10b981; font-size: 0.82rem;">${item.houseCleanVerified !== false ? "✓ Verified Clean" : "In Progress"}</strong>
                          </div>
                        </div>
                      </div>

                      <!-- KYC DOCUMENT PROOFS -->
                      <div class="dossier-box" style="background: var(--bg-card, rgba(0,0,0,0.25)); border: 1px solid var(--border-subtle, rgba(255,255,255,0.08)); border-radius: 8px; padding: 0.8rem 0.9rem; margin-bottom: 0.85rem;">
                        <div style="font-size: 0.72rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
                          <span style="display: flex; align-items: center; gap: 0.35rem;">
                            <span>📄</span> KYC Document Proofs &amp; Lightbox
                          </span>
                          <span style="font-size: 0.65rem; color: var(--text-muted);">Click card to open Lightbox</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                          <div class="btn-preview-document-image" data-doc-title="Government ID Proof" data-doc-type="id_proof" data-invite-id="${item.id}" style="background: var(--bg-primary, rgba(0,0,0,0.45)); border: 1.5px solid ${idProofAvailable ? '#10b981' : 'var(--border-subtle)'}; border-radius: 6px; padding: 0.5rem 0.4rem; text-align: center; cursor: pointer;">
                            <div style="font-size: 1.2rem; margin-bottom: 0.1rem;">📄</div>
                            <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-primary);">ID Proof</div>
                            <div style="font-size: 0.62rem; color: ${idProofAvailable ? '#10b981' : '#f59e0b'}; font-weight: 700;">
                              ${idProofAvailable ? '✓ Click View' : '○ Attached'}
                            </div>
                          </div>

                          <div class="btn-preview-document-image" data-doc-title="Address Proof Document" data-doc-type="address_proof" data-invite-id="${item.id}" style="background: var(--bg-primary, rgba(0,0,0,0.45)); border: 1.5px solid ${addrProofAvailable ? '#10b981' : 'var(--border-subtle)'}; border-radius: 6px; padding: 0.5rem 0.4rem; text-align: center; cursor: pointer;">
                            <div style="font-size: 1.2rem; margin-bottom: 0.1rem;">🏠</div>
                            <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-primary);">Address Proof</div>
                            <div style="font-size: 0.62rem; color: ${addrProofAvailable ? '#10b981' : 'var(--text-muted)'}; font-weight: 700;">
                              ${addrProofAvailable ? '✓ Click View' : '○ Attached'}
                            </div>
                          </div>

                          <div class="btn-preview-document-image" data-doc-title="Devotee Passport Photo" data-doc-type="photo" data-invite-id="${item.id}" style="background: var(--bg-primary, rgba(0,0,0,0.45)); border: 1.5px solid ${photoAvailable ? '#10b981' : 'var(--border-subtle)'}; border-radius: 6px; padding: 0.5rem 0.4rem; text-align: center; cursor: pointer;">
                            <div style="font-size: 1.2rem; margin-bottom: 0.1rem;">📸</div>
                            <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-primary);">Photo</div>
                            <div style="font-size: 0.62rem; color: #10b981; font-weight: 700;">
                              ✓ Click View
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- DECISION GATE -->
                      <div style="background: rgba(16, 185, 129, 0.08); border: 1.5px solid #10b981; border-radius: 10px; padding: 0.95rem;">
                        <div style="font-size: 0.78rem; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.35rem;">
                          <span>⚖️</span> Mentor Decision &amp; Induction Gate
                        </div>

                        ${!isApproved ? `
                          <div style="margin-bottom: 0.75rem;">
                            <label style="font-size: 0.72rem; color: var(--text-secondary); display: block; margin-bottom: 0.3rem; font-weight: 700;">1. Select Induction Role Tier:</label>
                            <select id="drawer-select-role-${item.id}" class="select-pairing-role" data-invite-id="${item.id}" style="width: 100%; box-sizing: border-box; font-size: 0.82rem; padding: 0.45rem 0.65rem; background: var(--bg-primary, #000); border: 1.5px solid var(--gold-400); color: var(--text-primary); border-radius: 6px; font-weight: 700;">
                              <option value="DEVOTEE" ${assignedRole === "DEVOTEE" ? "selected" : ""}>🌟 Devotee (Level 4 — House Clean &amp; Three Diya)</option>
                              <option value="HEALER" ${assignedRole === "HEALER" ? "selected" : ""}>🛡️ Certified Healer (Level 2 — Mentor Guide)</option>
                              <option value="MASTER" ${assignedRole === "MASTER" ? "selected" : ""}>👑 Master Founder (Tier 1 — Root Authority)</option>
                            </select>
                          </div>

                          <div style="margin-bottom: 0.85rem;">
                            <label style="font-size: 0.72rem; color: var(--text-secondary); display: block; margin-bottom: 0.3rem; font-weight: 700;">2. Guidance Notes / Revision Request (Optional):</label>
                            <textarea id="drawer-mentor-notes-${item.id}" placeholder="Enter specific instructions or guidance for applicant..." style="width: 100%; box-sizing: border-box; height: 50px; font-size: 0.78rem; padding: 0.45rem 0.65rem; background: var(--bg-primary, #000); border: 1px solid var(--border-subtle); border-radius: 6px; color: var(--text-primary); resize: vertical;"></textarea>
                          </div>

                          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button type="button" class="btn btn-sm btn-drawer-approve-induct" data-invite-id="${item.id}" style="flex: 2; min-width: 130px; background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 800; font-size: 0.82rem; padding: 0.55rem 0.85rem; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 4px 14px rgba(16,185,129,0.35); display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                              <span>✓</span> <span>Approve &amp; Induct to Lineage</span>
                            </button>
                            <button type="button" class="btn btn-sm btn-drawer-request-revision" data-invite-id="${item.id}" style="flex: 1; min-width: 100px; background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #f59e0b; font-weight: 700; font-size: 0.78rem; padding: 0.55rem 0.75rem; border-radius: 6px; cursor: pointer;">
                              📝 Revision
                            </button>
                            <button type="button" class="btn btn-sm btn-drawer-reject" data-invite-id="${item.id}" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #ef4444; font-weight: 700; font-size: 0.78rem; padding: 0.55rem 0.75rem; border-radius: 6px; cursor: pointer;">
                              ✕ Reject
                            </button>
                          </div>
                        ` : `
                          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 6px; padding: 0.75rem; text-align: center;">
                            <div style="color: #10b981; font-weight: 800; font-size: 0.9rem; margin-bottom: 0.2rem;">
                              ✓ Application Approved &amp; Inducted!
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">
                              Applicant is officially bound to your downline lineage as <strong>${item.assignedRole || "Devotee"}</strong>.
                            </div>
                          </div>
                        `}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSadhanaRemedyApprovalsTab(sadhanaApps = [], selectedAppId = null, targetContainer = null) {
    const roleMode = (this.model ? this.model.getRoleMode() : (this.currentRoleMode || "MASTER")).toUpperCase();
    const container = targetContainer || document.getElementById("pending-tab-pane-sadhana");
    if (!container) return;

    if (!sadhanaApps || sadhanaApps.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">📿</div>
          <h4 style="color: var(--text-primary); margin-bottom: 0.35rem; font-family: var(--font-heading); font-size: 1.15rem;">No Pending Sadhana or Remedy Requests</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 360px; margin: 0 auto 1.25rem;">Devotees submit sacred anushthan and upay initiation requests from their portal. Review requests, assign malas, and grant deeksha here.</p>
        </div>
      `;
      return;
    }

    const totalCount = sadhanaApps.length;
    const pendingCount = sadhanaApps.filter(a => a.status === "PENDING").length;
    const sadhanaCount = sadhanaApps.filter(a => a.contextType === "sadhana" || a.type === "SADHANA_APPLICATION").length;
    const remedyCount = sadhanaApps.filter(a => a.contextType === "remedy" || a.type === "REMEDY_APPLICATION").length;
    const approvedCount = sadhanaApps.filter(a => a.status === "APPROVED").length;

    container.innerHTML = `
      <!-- STATS & FILTER BAR -->
      <div style="margin-bottom: 1rem; padding: 0.85rem 1rem; background: var(--bg-card, rgba(24,16,36,0.9)); border: 1px solid var(--border-glass-gold, rgba(212,175,55,0.3)); border-radius: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.76rem; font-weight: 700; color: var(--text-primary); flex-wrap: wrap;">
            <span>📿 Sadhana &amp; Remedy Metadata:</span>
            <span style="background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 12px;">⏳ ${pendingCount} Pending Review</span>
            <span style="background: rgba(168,85,247,0.2); border: 1px solid #a855f7; color: #c084fc; padding: 0.15rem 0.5rem; border-radius: 12px;">📿 ${sadhanaCount} Sadhanas</span>
            <span style="background: rgba(16,185,129,0.2); border: 1px solid #10b981; color: #34d399; padding: 0.15rem 0.5rem; border-radius: 12px;">🌿 ${remedyCount} Remedies</span>
            <span style="background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; padding: 0.15rem 0.5rem; border-radius: 12px;">🟢 ${approvedCount} Active</span>
          </div>
          <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">Vedic Curriculum • Closed-Loop Telemetry</span>
        </div>

        <!-- FILTER PILLS -->
        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap; margin-bottom: 0.65rem;">
          <button type="button" class="sadhana-filter-pill active" data-sadhana-filter="ALL">All Requests (${totalCount})</button>
          <button type="button" class="sadhana-filter-pill" data-sadhana-filter="SADHANA">📿 Sadhanas (${sadhanaCount})</button>
          <button type="button" class="sadhana-filter-pill" data-sadhana-filter="REMEDY">🌿 Remedies &amp; Upay (${remedyCount})</button>
          <button type="button" class="sadhana-filter-pill" data-sadhana-filter="PENDING">⏳ Pending Review (${pendingCount})</button>
          <button type="button" class="sadhana-filter-pill" data-sadhana-filter="APPROVED">🟢 Approved (${approvedCount})</button>
          <button type="button" class="sadhana-filter-pill" data-sadhana-filter="REJECTED">🗑️ Deleted/Rejected (${sadhanaApps.filter(a => a.status === 'REJECTED' || a.status === 'DELETED').length})</button>
        </div>

        <!-- SEARCH BAR -->
        <div>
          <input type="text" id="input-search-sadhana-drawer" placeholder="🔍 Instant search by seeker name, devotee code, or practice title..." class="form-control" style="width: 100%; box-sizing: border-box; font-size: 0.8rem; padding: 0.5rem 0.85rem; background: rgba(0,0,0,0.4); border: 1px solid var(--border-glass-gold, rgba(212,175,55,0.3)); border-radius: 6px; color: #fff;">
        </div>
      </div>

      <!-- SADHANA APPLICATIONS LIST -->
      <div id="sadhana-remedy-approvals-list" style="display: flex; flex-direction: column; gap: 0.85rem;">
        ${sadhanaApps.map(app => {
          const isApproved = app.status === "APPROVED";
          const isHealerVerified = app.status === "HEALER_VERIFIED";
          const isPending = app.status === "PENDING";
          const isRevision = app.status === "REVISION_REQUIRED";
          const isRejected = app.status === "REJECTED";
          const isRemedy = app.contextType === "remedy" || app.type === "REMEDY_APPLICATION";
          const initials = app.seekerName ? app.seekerName.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : "DV";
          const isDetailsOpen = selectedAppId ? (app.id === selectedAppId) : false;

          // Request Date Time formatting (Metadata)
          const requestDate = app.createdAtMs ? new Date(app.createdAtMs) : (app.createdAt ? new Date(app.createdAt) : new Date());
          const formattedDateTime = requestDate.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          // Status Badge
          let statusBadge = '';
          if (isApproved) {
            statusBadge = `<span style="font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 12px; background: rgba(16,185,129,0.2); border: 1px solid #10b981; color: #10b981; white-space: nowrap;">🟢 Active</span>`;
          } else if (isHealerVerified) {
            statusBadge = `<span style="font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 12px; background: rgba(56,189,248,0.2); border: 1px solid #38bdf8; color: #38bdf8; white-space: nowrap;">🛡️ Healer Verified</span>`;
          } else if (isRevision) {
            statusBadge = `<span style="font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 12px; background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #f59e0b; white-space: nowrap;">📝 Revision</span>`;
          } else if (isRejected) {
            statusBadge = `<span style="font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 12px; background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #ef4444; white-space: nowrap;">✕ Rejected</span>`;
          } else {
            statusBadge = `<span style="font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 12px; background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #f59e0b; white-space: nowrap;">⏳ Pending</span>`;
          }

          // Approval Options & Action buttons
          let approvalActions = '';
          if (!isApproved) {
            const approveBtnLabel = isHealerVerified 
              ? '👑 Master Sanction' 
              : (roleMode.includes('HEALER') ? '🛡️ Healer Verify' : '✓ Quick Approve');
            const approveTitle = isHealerVerified 
              ? 'Stage 2: Master Final Deeksha Sanction' 
              : 'Stage 1: Lineage Healer Verification';
            
            approvalActions = `
              <button type="button" class="btn btn-gold btn-xs btn-sadhana-quick-approve" data-sadhana-id="${app.id}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; font-weight: 800; border-radius: 6px; white-space: nowrap;" title="${approveTitle}">
                <span>${approveBtnLabel}</span>
              </button>
            `;
          } else {
            approvalActions = `
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #10b981; font-weight: 800; padding: 0.25rem 0.5rem; background: rgba(16,185,129,0.1); border: 1px solid #10b981; border-radius: 4px; white-space: nowrap;">
                ${app.initiationToken || 'IN-GRANTED'}
              </span>
            `;
          }

          return `
            <div class="sadhana-app-card" data-sadhana-id="${app.id}" data-context-type="${isRemedy ? 'remedy' : 'sadhana'}" data-status="${app.status}" style="background: var(--bg-card, rgba(24,16,36,0.9)); border: 1px solid var(--border-glass-gold, rgba(212,175,55,0.25)); border-radius: 8px; padding: 0.75rem 1rem; transition: all 0.2s ease;">
              
              <!-- 1 ROW ONLY: Name, Sadhana, Request Date Time, Approval Options, Other Icons -->
              <div class="sadhana-approval-row" style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: nowrap; overflow-x: auto;">
                
                <!-- 1. NAME & SEEKER CODE -->
                <div style="display: flex; align-items: center; gap: 0.6rem; min-width: 170px; flex-shrink: 0;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background: ${isRemedy ? 'rgba(16,185,129,0.2)' : 'rgba(168,85,247,0.2)'}; border: 1.5px solid ${isRemedy ? '#10b981' : '#a855f7'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.82rem; color: ${isRemedy ? '#34d399' : '#c084fc'}; flex-shrink: 0;">
                    ${initials}
                  </div>
                  <div style="line-height: 1.25;">
                    <strong class="sadhana-applicant-name" style="font-size: 0.92rem; font-weight: 800; color: var(--text-primary); display: block; white-space: nowrap;">${app.seekerName}</strong>
                    <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--gold-400, #d97706); font-weight: 700;">${app.devoteeCode || 'Devotee'}</span>
                  </div>
                </div>

                <!-- 2. SADHANA / REMEDY -->
                <div style="min-width: 180px; flex: 1; flex-shrink: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <span style="font-size: 0.7rem; font-weight: 800; color: ${isRemedy ? '#10b981' : '#c084fc'}; margin-right: 0.25rem;">
                    ${isRemedy ? '🌿 Remedy:' : '📿 Sadhana:'}
                  </span>
                  <strong style="font-size: 0.88rem; color: var(--text-primary); font-weight: 700;" title="${app.itemTitle || app.title}">
                    ${app.itemTitle || app.title || (isRemedy ? 'Sacred Remedy' : 'Sacred Sadhana')}
                  </strong>
                </div>

                <!-- 3. REQUEST DATE TIME -->
                <div style="font-size: 0.75rem; color: var(--text-secondary); min-width: 155px; flex-shrink: 0; display: flex; align-items: center; gap: 0.35rem; white-space: nowrap;">
                  <span>📅</span>
                  <span style="font-weight: 600;">${formattedDateTime}</span>
                </div>

                <!-- 4. STATUS -->
                <div style="flex-shrink: 0;">
                  ${statusBadge}
                </div>

                <!-- 5. APPROVAL OPTIONS & OTHER ICONS -->
                <div style="display: flex; align-items: center; gap: 0.45rem; flex-shrink: 0;">
                  ${approvalActions}

                  <button type="button" class="btn btn-outline btn-xs btn-sadhana-details" data-sadhana-id="${app.id}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; border-radius: 6px; white-space: nowrap;" title="View Sadhana Details Snapshot">
                    <span>${isDetailsOpen ? '▲ Close' : '📋 Details'}</span>
                  </button>

                  <button type="button" class="btn-sadhana-delete" data-sadhana-id="${app.id}" title="Delete Application" style="padding: 0.35rem 0.55rem; background: transparent; border: 1px solid var(--border-subtle, rgba(255,255,255,0.1)); color: #ef4444; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; font-size: 0.9rem;" aria-label="Delete">🗑️</button>
                </div>
              </div>

              <!-- EXPANDABLE SADHNA DETAILS SNAPSHOT (ON CLICK OF DETAILS) -->
              <div id="sadhana-details-pane-${app.id}" class="approval-expanded-details-pane ${isDetailsOpen ? 'is-open' : ''}" style="${isDetailsOpen ? 'display: block;' : 'display: none;'} margin-top: 0.85rem; border-top: 1px dashed var(--border-subtle, rgba(212,175,55,0.25)); padding-top: 0.85rem;">
                
                <!-- SNAPSHOT HEADER STRIP: PARAMETERS & METADATA -->
                <div class="sadhana-params-strip" style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle, rgba(255,255,255,0.08)); border-radius: 6px; padding: 0.6rem 0.85rem; margin-bottom: 0.75rem; display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.76rem;">
                  <div>
                    <span style="color: var(--text-muted);">Daily Target:</span>
                    <strong style="color: var(--gold-400); margin-left: 0.25rem;">📿 ${app.targetMalas} Malas (${app.targetMalas * 108} Beads)</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted);">Cycle Duration:</span>
                    <strong style="color: #38bdf8; margin-left: 0.25rem;">⏱️ ${app.cycleDays || 21} Days</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted);">Muhurta Slot:</span>
                    <strong style="color: #a78bfa; margin-left: 0.25rem;">🌅 ${app.scheduleSlot}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted);">Lineage Mentor:</span>
                    <strong style="color: var(--text-secondary); margin-left: 0.25rem;">🛡️ ${app.firstApproverName || app.mentorName || 'Lineage Healer'}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted);">Contact:</span>
                    <strong style="color: #10b981; margin-left: 0.25rem;">📞 ${app.seekerPhone || 'Not Provided'}</strong>
                  </div>
                </div>

                <!-- 2-TIER UPLINE APPROVER TELEMETRY -->
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; font-size: 0.74rem;">
                  <span style="background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.35); padding: 0.15rem 0.55rem; border-radius: 4px; font-weight: 700;">
                    🛡️ Stage 1 Approver: ${app.firstApproverName || app.mentorName || 'Lineage Healer'} (${(app.firstApproverStatus === 'APPROVED' || app.status === 'HEALER_VERIFIED' || isApproved) ? '🟢 Verified' : '⏳ Pending'})
                  </span>
                  <span style="background: rgba(212,175,55,0.15); color: #fde047; border: 1px solid rgba(212,175,55,0.35); padding: 0.15rem 0.55rem; border-radius: 4px; font-weight: 700;">
                    👑 Stage 2 Approver: ${app.secondApproverName || 'Spiritual Karim Khan'} (${(app.secondApproverStatus === 'APPROVED' || isApproved) ? '🟢 Sanctioned' : (app.status === 'HEALER_VERIFIED' ? '⏳ Awaiting Master' : '⏳ Pending Stage 1')})
                  </span>
                </div>
                
                <!-- SEEKER DIAGNOSTICS & INTENTION -->
                <div class="dossier-box" style="background: rgba(139, 92, 246, 0.08); border: 1.5px solid rgba(139, 92, 246, 0.35); border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 0.75rem;">
                  <div style="font-size: 0.72rem; font-weight: 800; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                    <span>🕉️</span> Seeker Diagnostics &amp; Target Outcome
                  </div>
                  <p style="font-size: 0.8rem; font-style: italic; color: var(--text-primary); line-height: 1.4; margin: 0 0 0.85rem 0; border-left: 2px solid #a78bfa; padding-left: 0.75rem;">
                    "${app.seekerDiagnostics || 'No diagnostics provided.'}"
                  </p>
                  
                  <div style="font-size: 0.72rem; font-weight: 800; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                    <span>🙏</span> Devotee's Sacred Sankalp
                  </div>
                  <p style="font-size: 0.8rem; font-style: italic; color: var(--text-primary); line-height: 1.4; margin: 0; border-left: 2px solid #a78bfa; padding-left: 0.75rem;">
                    "${app.intention || 'Devotee has pledged sincere adherence to Vedic chanting and anushthan discipline.'}"
                  </p>
                </div>

                <!-- COMMITMENTS & PLEDGES -->
                <div class="dossier-box" style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 0.75rem;">
                  <div style="font-size: 0.72rem; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.45rem; display: flex; align-items: center; justify-content: space-between;">
                    <span style="display: flex; align-items: center; gap: 0.35rem;">
                      <span>⚖️</span> Sacred Commitments &amp; Digital Oath
                    </span>
                    <span style="font-size: 0.65rem; color: #10b981; background: rgba(16,185,129,0.15); border: 1px solid #10b981; border-radius: 3px; padding: 0.05rem 0.35rem; font-weight: 700;">Oaths Confirmed</span>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.4rem; font-size: 0.75rem;">
                    <div>✓ Strict Sattvic Diet (No alcohol/onion/garlic)</div>
                    <div>✓ Daily Three Diya Practice Discipline</div>
                    <div>✓ Brahmacharya / Celibacy During Cycle</div>
                    <div>✓ Digital Oath Signed: <strong style="color: var(--gold-400);">${app.signature || app.seekerName}</strong></div>
                  </div>
                  <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.4rem;">
                    Submitted On: <span style="color: var(--text-secondary);">${new Date(app.createdAtMs).toLocaleString()}</span>
                  </div>
                </div>

                <!-- MENTOR DECISION & ADJUSTMENT GATE -->
                <div style="background: var(--bg-primary, rgba(0,0,0,0.5)); border: 1.5px solid ${isApproved ? '#10b981' : 'var(--gold-400)'}; border-radius: 8px; padding: 0.95rem;">
                  <div style="font-size: 0.78rem; font-weight: 800; color: ${isApproved ? '#10b981' : 'var(--gold-400)'}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.35rem;">
                    <span>🛡️</span> Mentor Prescription &amp; Initiation Gate
                  </div>

                  ${!isApproved ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; margin-bottom: 0.65rem;">
                      <div>
                        <label style="font-size: 0.72rem; color: var(--text-secondary); display: block; margin-bottom: 0.25rem; font-weight: 700;">Adjust Daily Malas Count:</label>
                        <select id="sadhana-select-malas-${app.id}" style="width: 100%; box-sizing: border-box; font-size: 0.78rem; padding: 0.4rem 0.6rem; background: #000; border: 1px solid var(--border-glass-gold); color: #fff; border-radius: 6px; font-weight: 700;">
                          ${(() => {
                            const allowed = window.appConfig?.sadhana?.allowedMalas || [5, 11, 21, 51, 108];
                            return allowed.map(m => {
                              let label = "";
                              if (m === 5) label = "Gentle / Beginner — 540 beads";
                              else if (m === 11) label = "Standard Vedic Anushthan — 1,188 beads";
                              else if (m === 21) label = "Rigorous / Accelerated — 2,268 beads";
                              else if (m === 51) label = "Intensive Tapasya — 5,508 beads";
                              else if (m === 108) label = "Supreme Purna — 11,664 beads";
                              else label = `${m * 108} beads`;
                              
                              const isSelected = (!app.targetMalas && m === 11) || app.targetMalas === m;
                              return `<option value="${m}" ${isSelected ? 'selected' : ''}>${m} Malas (${label})</option>`;
                            }).join('');
                          })()}
                        </select>
                      </div>
                      <div>
                        <label style="font-size: 0.72rem; color: var(--text-secondary); display: block; margin-bottom: 0.25rem; font-weight: 700;">Sanctioned Muhurta Slot:</label>
                        <select id="sadhana-select-slot-${app.id}" style="width: 100%; box-sizing: border-box; font-size: 0.78rem; padding: 0.4rem 0.6rem; background: #000; border: 1px solid var(--border-glass-gold); color: #fff; border-radius: 6px; font-weight: 700;">
                          <option value="Brahma Muhurta (04:00 - 06:00)" ${app.scheduleSlot?.includes('04:00') ? 'selected' : ''}>🌅 Brahma Muhurta (04:00 - 06:00)</option>
                          <option value="Pratah Kaal (06:00 - 08:00)" ${app.scheduleSlot?.includes('06:00') ? 'selected' : ''}>☀️ Pratah Kaal (06:00 - 08:00)</option>
                          <option value="Madhyahna Kaal (12:00 - 13:30)" ${app.scheduleSlot?.includes('12:00') ? 'selected' : ''}>🌞 Madhyahna Kaal (12:00 - 13:30)</option>
                          <option value="Sandhya Kaal (18:00 - 19:30)" ${app.scheduleSlot?.includes('18:00') ? 'selected' : ''}>🌆 Sandhya Kaal (18:00 - 19:30)</option>
                          <option value="Nishita Kaal (23:30 - 01:00)" ${app.scheduleSlot?.includes('23:30') ? 'selected' : ''}>🌙 Nishita Kaal (23:30 - 01:00)</option>
                        </select>
                      </div>
                    </div>

                    <!-- Mentor Guidance Notes moved to Slide-In Dialog -->

                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                      <button type="button" class="btn btn-sm btn-sadhana-approve-grant" data-sadhana-id="${app.id}" style="flex: 2; min-width: 140px; background: ${app.status === 'HEALER_VERIFIED' ? 'linear-gradient(135deg, #c59b27, #9e7811)' : 'linear-gradient(135deg, #10b981, #059669)'}; color: #fff; font-weight: 800; font-size: 0.82rem; padding: 0.5rem 0.85rem; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 4px 14px rgba(16,185,129,0.35); display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                        <span>${app.status === 'HEALER_VERIFIED' ? '👑' : '🛡️'}</span> <span>${app.status === 'HEALER_VERIFIED' ? 'Stage 2: Master Final Deeksha Sanction' : (roleMode.includes('HEALER') ? 'Stage 1: Healer Verify & Forward to Master' : 'Approve & Grant Initiation')}</span>
                      </button>
                      <button type="button" class="btn btn-sm btn-sadhana-request-revision" data-sadhana-id="${app.id}" style="flex: 1; min-width: 110px; background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #f59e0b; font-weight: 700; font-size: 0.78rem; padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer;">
                        📝 Prescribe Revision
                      </button>
                      <button type="button" class="btn btn-sm btn-sadhana-reject" data-sadhana-id="${app.id}" style="background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #ef4444; font-weight: 700; font-size: 0.78rem; padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer;">
                        ✕ Reject
                      </button>
                    </div>
                  ` : `
                    <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; border-radius: 6px; padding: 0.75rem; text-align: center;">
                      <div style="color: #10b981; font-weight: 800; font-size: 0.88rem; margin-bottom: 0.2rem;">
                        ✓ Deeksha &amp; Initiation Officially Granted!
                      </div>
                      <div style="font-size: 0.75rem; color: var(--text-secondary);">
                        Initiation Token: <strong style="color: #fff; font-family: var(--font-mono);">${app.initiationToken}</strong> • Target: <strong>${app.targetMalas} Malas (${app.scheduleSlot})</strong>
                      </div>
                      ${app.mentorFeedback ? `
                        <div style="font-size: 0.72rem; color: var(--gold-400); font-style: italic; margin-top: 0.35rem;">
                          Guidance: "${app.mentorFeedback}"
                        </div>
                      ` : ''}
                    </div>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  showDocumentPreview(title, docType, inviteId, invites = []) {
    let prevModal = document.getElementById("modal-document-preview");
    if (!prevModal) {
      prevModal = document.createElement("div");
      prevModal.id = "modal-document-preview";
      prevModal.style.cssText = "display:none; position:fixed; inset:0; background:rgba(5,2,10,0.85); backdrop-filter:blur(8px); z-index:100005; align-items:center; justify-content:center; padding:1rem;";
      document.body.appendChild(prevModal);
    }

    const invList = invites.length ? invites : (JSON.parse(localStorage.getItem("sk_pairing_invites") || "[]"));
    const inv = invList.find(i => i.id === inviteId) || {};
    let docRecord = null;
    try {
      const docs = JSON.parse(localStorage.getItem('sk_documents') || '[]');
      docRecord = docs.find(d => (d.profileId === inv.id || d.profileId === inv.devoteeCode) && d.docType === docType) || null;
    } catch(e) {}

    const dataUrl = docRecord?.dataUrl || "";
    const fileName = docRecord?.fileName || `${docType}_verified.png`;

    prevModal.innerHTML = `
      <div style="background: var(--bg-card, #120b1e); border: 1.5px solid var(--gold-400, #d4af37); border-radius: 12px; max-width: 520px; width: 100%; padding: 1.5rem; box-shadow: 0 16px 45px rgba(0,0,0,0.85); position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.3rem;">📄</span>
            <h3 style="margin: 0; font-size: 1.05rem; color: var(--gold-400); font-weight: 800;">${title || 'Verification Document'}</h3>
          </div>
          <button type="button" id="btn-close-doc-preview" style="background: transparent; border: none; color: var(--text-muted); font-size: 1.4rem; cursor: pointer; padding: 0.2rem 0.5rem;">&times;</button>
        </div>

        <div style="text-align: center; margin-bottom: 1rem;">
          ${dataUrl ? `
            <img src="${dataUrl}" alt="Proof" style="max-width: 100%; max-height: 280px; object-fit: contain; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          ` : `
            <div style="background: rgba(0,0,0,0.4); border: 1.5px dashed rgba(16,185,129,0.5); border-radius: 8px; padding: 2rem 1.5rem;">
              <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">🛡️</div>
              <h4 style="margin: 0 0 0.4rem 0; color: #10b981; font-family: var(--font-heading);">Digital Attestation Verified</h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.75rem 0;">
                Document verified under Sansthan Induction Protocol.
              </p>
              <div style="background: rgba(0,0,0,0.5); border-radius: 6px; padding: 0.6rem; font-size: 0.75rem; text-align: left; line-height: 1.6;">
                <div>Applicant: <strong style="color:#fff;">${inv.seekerName || "Devotee Applicant"}</strong></div>
                <div>Reference Code: <strong style="color:var(--gold-400); font-family:var(--font-mono);">${inv.devoteeCode || "SKDV-VERIFIED"}</strong></div>
                <div>Document Type: <strong style="color:#38bdf8;">${docType.toUpperCase()}</strong> (${fileName})</div>
                <div>Status: <span style="color:#10b981; font-weight:700;">✓ VALIDATED FOR INDUCTION</span></div>
              </div>
            </div>
          `}
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" id="btn-dismiss-doc-preview" class="btn btn-sm btn-gold" style="font-weight: 700; padding: 0.45rem 1rem;">
            Done &amp; Return
          </button>
        </div>
      </div>
    `;

    prevModal.style.display = "flex";
    const closeFn = () => { prevModal.style.display = "none"; };
    const closeBtn = prevModal.querySelector("#btn-close-doc-preview");
    if (closeBtn) closeBtn.onclick = closeFn;
    const dismissBtn = prevModal.querySelector("#btn-dismiss-doc-preview");
    if (dismissBtn) dismissBtn.onclick = closeFn;
    prevModal.onclick = (e) => { if (e.target === prevModal) closeFn(); };
  }

  showToast(titleOrMessage, messageText = "", type = "info", duration = 4000, actionBtn = null) {
    if (typeof this.showSlideToast === "function") {
      const isTitleProvided = typeof messageText === "string" && messageText.trim() !== "";
      const toastTitle = isTitleProvided ? titleOrMessage : "Spiritual Karim";
      const toastMsg = isTitleProvided ? messageText : titleOrMessage;
      return this.showSlideToast(toastTitle, toastMsg, type, duration, actionBtn);
    }
    if (this.toastEl) {
      const isTitleProvided = typeof messageText === "string" && messageText.trim() !== "";
      this.toastEl.textContent = isTitleProvided ? `${titleOrMessage}: ${messageText}` : titleOrMessage;
      this.toastEl.style.display = "block";
      setTimeout(() => { if (this.toastEl) this.toastEl.style.display = "none"; }, duration);
    }
  }

  _renderNotificationPopup(message, options = {}, type = "info") {
    const title = options.title || "Notification";
    const duration = options.duration || 4500;
    const actionBtn = options.actionBtn || null;
    return this.showToast(title, message, type, duration, actionBtn);
  }

  openNotificationDesk(model = null) {
    const appModel = model || window.profileModel || (window.ProfileControllerInstance && window.ProfileControllerInstance.model);
    const notifs = (appModel && typeof appModel.getNotifications === "function") ? appModel.getNotifications() : [];
    
    let modal = document.getElementById("modal-notification-desk");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-notification-desk";
      modal.className = "admin-modal admin-modal-overlay";
      modal.style.cssText = "display: flex; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 100000; align-items: center; justify-content: center; backdrop-filter: blur(4px);";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background: var(--bg-card, #1e1b2e); border: 1.5px solid var(--gold-400, #d4af37); border-radius: 12px; width: 92%; max-width: 580px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.8); overflow: hidden;">
        <div style="padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3);">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.3rem;">🔔</span>
            <div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--gold-400, #d4af37);">Sacred Alerts &amp; Notification Desk</h3>
              <div style="font-size: 0.72rem; color: var(--text-muted, #94a3b8);">Diksha Approvals, Sadhana Milestones &amp; System Telemetry</div>
            </div>
          </div>
          <button type="button" id="btn-close-notif-desk" style="background: none; border: none; font-size: 1.3rem; color: #fff; cursor: pointer;">✕</button>
        </div>
        <div style="padding: 1rem; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 0.75rem;">
          ${notifs.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.5;">📿</div>
              <p style="font-size: 0.9rem; margin: 0; color: #fff;">No active notifications found.</p>
              <span style="font-size: 0.75rem; color: #64748b;">All Sadhana initiations, deeksha tokens, and mentor guidance notes will appear here.</span>
            </div>
          ` : notifs.map(n => `
            <div style="padding: 0.85rem 1rem; border-radius: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid ${n.type && n.type.includes('APPROVED') ? '#10b981' : (n.type && n.type.includes('REV') ? '#f59e0b' : '#38bdf8')}; border-top: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
                <strong style="font-size: 0.88rem; color: #fff;">${n.title || 'Sacred Notification'}</strong>
                <span style="font-size: 0.68rem; color: var(--text-muted, #94a3b8); font-family: var(--font-mono);">${n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Recent'}</span>
              </div>
              <p style="margin: 0; font-size: 0.78rem; color: #cbd5e1; line-height: 1.4;">${n.message || ''}</p>
            </div>
          `).join('')}
        </div>
        <div style="padding: 0.75rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: flex-end; background: rgba(0,0,0,0.2);">
          <button type="button" id="btn-dismiss-notif-desk" class="btn btn-sm btn-gold" style="padding: 0.4rem 1rem;">✓ Dismiss</button>
        </div>
      </div>
    `;

    modal.style.display = "flex";
    const close = () => { modal.style.display = "none"; };
    const closeBtn = document.getElementById("btn-close-notif-desk");
    if (closeBtn) closeBtn.onclick = close;
    const dismissBtn = document.getElementById("btn-dismiss-notif-desk");
    if (dismissBtn) dismissBtn.onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };
  }

  _renderConfirmDialog(title, message, options = null) {
    if (typeof this.openCustomDialog === "function") {
      return this.openCustomDialog({
        title: title || "Confirm Action",
        message: message || "Please confirm to proceed.",
        icon: "⚖️",
        options: options || [
          { text: "Confirm", type: "btn-gold", value: true },
          { text: "Cancel", type: "btn-outline", value: false }
        ]
      });
    }
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  renderToggleSwitch(containerId, label, initialState = false, onChangeFn = null) {
    if (typeof this.renderSwitch === "function") {
      return this.renderSwitch(containerId, {
        label: label,
        checked: initialState,
        onChange: onChangeFn
      });
    }
    return null;
  }

  closePendingApprovalsDrawer() {
    const drawer = this.pendingApprovalDrawer || document.getElementById("pending-approval-drawer");
    const backdrop = this.pendingApprovalDrawerBackdrop || document.getElementById("pending-approval-drawer-backdrop");
    if (drawer) {
      drawer.classList.remove("open", "is-open");
      drawer.setAttribute("aria-hidden", "true");
      drawer.style.display = "none";
    }
    if (backdrop) {
      backdrop.style.display = "none";
      backdrop.classList.remove("open", "is-open");
    }
  }

  // ==============================================================
  // RIGHT SLIDE-OUT DRAWER: TREE PROFILE
  // ==============================================================
  openTreeProfileDrawer(memberId, profiles = []) {
    const drawer = document.getElementById("tree-profile-drawer");
    if (!drawer) return;
    const prof = (profiles || []).find(p => p.id === memberId || p.referenceCode === memberId) || (this.allProfiles || []).find(p => p.id === memberId || p.referenceCode === memberId);
    if (!prof) return;

    const nameEl = document.getElementById("tree-drawer-profile-name");
    const roleEl = document.getElementById("tree-drawer-profile-role");
    const bodyEl = document.getElementById("tree-drawer-body");
    const backdropEl = document.getElementById("tree-drawer-backdrop");

    if (nameEl) nameEl.textContent = prof.name || "Member Details";
    if (roleEl) roleEl.textContent = `${prof.profileType || 'DEVOTEE'} • Level ${prof.level || 5}`;
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.82rem; padding: 0.5rem 0;">
          <div><strong>Reference Code:</strong> <code style="color: var(--gold-400);">${prof.referenceCode}</code></div>
          <div><strong>Upline Sponsor:</strong> <code style="color: var(--text-muted);">${prof.referredByCode || 'ROOT'}</code></div>
          <div><strong>Phone / Contact:</strong> ${prof.phone || 'N/A'}</div>
          <div><strong>City / State:</strong> ${prof.city || 'N/A'}</div>
          <div><strong>Join Date:</strong> ${prof.joinDate || '2024-01-01'}</div>
          <div><strong>Membership:</strong> <span class="badge-status-pill ${prof.isPaid ? 'badge-live' : 'badge-amber'}">${prof.paymentStatus || (prof.isPaid ? 'PAID' : 'FREE')}</span></div>
          <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.08);">
            <strong>4 Sacred Pillars Status:</strong>
            <ul style="margin: 0.35rem 0 0 1.25rem; font-size: 0.76rem; color: var(--text-secondary);">
              <li>Sri Yantra Sadhana: Level ${prof.level || 1} Enrolled</li>
              <li>3 Diya Sunset Cleanse: Active</li>
              <li>Ancestral House Clean: ${prof.houseCleanLevels ? prof.houseCleanLevels.filter(l => l.status === 'APPROVED').length : 0}/3 Completed</li>
              <li>Japa Mala: 11 Malas Target (1188 reps)</li>
            </ul>
          </div>
        </div>
      `;
    }

    if (this.btnTreeLoadProfile) {
      this.btnTreeLoadProfile.setAttribute("data-profile-id", prof.id);
    }

    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    if (backdropEl) backdropEl.classList.add("open");
  }

  closeTreeProfileDrawer() {
    const drawer = document.getElementById("tree-profile-drawer");
    const backdropEl = document.getElementById("tree-drawer-backdrop");
    if (drawer) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (backdropEl) backdropEl.classList.remove("open");
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
    const modal =
      this.adminSettingsModal ||
      document.getElementById("admin-settings-modal");
    if (!modal) return;
    this.adminSettingsModal = modal;
    const isOpen =
      typeof forceState === "boolean"
        ? forceState
        : !modal.classList.contains("open");
    if (isOpen) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    } else {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
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

    const defMentor = (this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : ((typeof appConfig !== "undefined" && appConfig.defaultMentorCode) || "SKHM-ADM1-7788-9900");
    const sponsorCode = profile.referenceCode || defMentor;
    const cleanCode = sponsorCode.replace(/[^a-zA-Z0-9]/g, "");
    const activePin = (
      100000 +
      (Math.abs(
        sponsorCode.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31,
      ) %
        900000)
    ).toString();

    // Dynamic Installation & Release Links from Settings
    const sysSettings = (this.controller && this.controller.model && this.controller.model.settings)
      || (window.app && window.app.model && window.app.model.settings)
      || (function() {
          try {
            return JSON.parse(localStorage.getItem("sk_admin_system_settings_v1") || "{}");
          } catch(e) { return {}; }
        })()
      || {};

    const apkDownloadUrl = sysSettings.githubApkUrl || "https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk";
    const repoUrl = sysSettings.githubRepoUrl || "https://github.com/jDroid-X/SpritualKarim";
    const origin = window.location.origin || "";
    const pathPrefix = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    const joinUrl = `${origin}${pathPrefix}/join.html?sponsor=${encodeURIComponent(sponsorCode)}`;
    const webPortalUrl = sysSettings.webPortalUrl || (origin + pathPrefix) || "https://jdroid-x.github.io/SpritualKarim/SpritualKarimWeb/";
    const telegramBotHandle = sysSettings.telegramBotHandle || "SpiritualKarimBot";
    const telegramLink = `https://t.me/${telegramBotHandle}?start=pair_${cleanCode}_${activePin}`;
    const expiryHours = sysSettings.inviteExpiryHours || 24;

    const payloadText = `🕉️ SPIRITUAL KARIM • SACRED LINEAGE PAIRING INVITE

Mentor: ${profile.name || "Karim Ji"} (Level ${profile.level || 1})
16-Digit Reference Code: ${sponsorCode}

Connection Type: Downline Member (Level-Down Seekers & Trainees)
Assigned Role: Devotee (Personal & Lineage Sadhana)

Direct Induction Link: ${joinUrl}
Activation Pairing PIN: ${activePin}
Telegram Bot Pairing: ${telegramLink}

⌛ Link Validity: Valid for ${expiryHours} Hours only (Upline approval required).
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
      <div class="share-pairing-grid">
        <!-- Prominent Direct Devotee Registration Link (Click to Copy & Add Profiles) -->
        <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(212, 175, 55, 0.12)); border: 1.5px solid #10b981; border-radius: 0.65rem; padding: 0.9rem 1.15rem; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);">
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

            <!-- Dual Codes & Security PIN Display Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.65rem; margin-bottom: 1rem;">
              <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; padding: 0.65rem;">
                <div style="font-size: 0.62rem; color: var(--gold-400); text-transform: uppercase; font-weight: 700; margin-bottom: 0.2rem;">1. Mentor Code</div>
                <div id="display-fresh-sponsor-code" style="font-family: var(--font-mono, monospace); font-size: 0.82rem; font-weight: 800; color: #fff; letter-spacing: 0.5px;">${sponsorCode}</div>
              </div>
              <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 0.65rem;">
                <div style="font-size: 0.62rem; color: #10b981; text-transform: uppercase; font-weight: 700; margin-bottom: 0.2rem;">2. Devotee Code</div>
                <div id="display-fresh-devotee-code" style="font-family: var(--font-mono, monospace); font-size: 0.82rem; font-weight: 800; color: #34d399; letter-spacing: 0.5px;">GENERATING...</div>
              </div>
              <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; padding: 0.65rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                  <span style="font-size: 0.62rem; color: var(--gold-400); text-transform: uppercase; font-weight: 700;">3. Security PIN</span>
                  <button type="button" id="btn-regenerate-pairing-pin" style="background: transparent; border: none; color: var(--gold-400); cursor: pointer; font-size: 0.65rem; padding: 0;" title="Generate New Random PIN">🎲 New</button>
                </div>
                <input type="text" id="input-fresh-pairing-pin" value="${activePin}" maxlength="6" style="width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.5); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 4px; color: #10b981; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; padding: 0.2rem 0.4rem; text-align: center; letter-spacing: 1.5px;">
              </div>
            </div>

            <!-- Fresh Joining URL Input -->
            <div style="margin-bottom: 1.25rem;">
              <label style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; font-weight: 600;">Full Induction URL (24-Hour Validity):</label>
              <input type="text" id="input-fresh-devotee-url" readonly value="" style="width: 100%; box-sizing: border-box; font-family: var(--font-mono, monospace); font-size: 0.78rem; padding: 0.6rem 0.75rem; background: rgba(0,0,0,0.5); border: 1px solid var(--border-color); border-radius: 6px; color: #f0fdf4;">
            </div>

            <!-- Buttons: Copy URL, Copy Card & Open -->
            <div style="display: flex; gap: 0.6rem; justify-content: flex-end; flex-wrap: wrap;">
              <button type="button" class="btn btn-sm btn-outline" id="btn-copy-fresh-devotee-url-only" style="font-weight: 700; padding: 0.55rem 0.95rem; display: flex; align-items: center; gap: 0.35rem;">
                🔗 Copy URL Only
              </button>
              <button type="button" class="btn btn-sm btn-gold" id="btn-copy-fresh-devotee-link" style="font-weight: 800; padding: 0.55rem 1rem; display: flex; align-items: center; gap: 0.35rem;">
                📋 Copy Invite Card
              </button>
              <a href="#" target="_blank" id="btn-open-fresh-devotee-link" class="btn btn-sm btn-outline" style="font-weight: 700; padding: 0.55rem 0.95rem; display: flex; align-items: center; gap: 0.35rem; text-decoration: none; border-color: #10b981; color: #10b981;">
                🚀 Open Link
              </a>
            </div>

            <div style="margin-top: 1rem; font-size: 0.72rem; color: var(--text-muted); line-height: 1.45; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.65rem;">
              ℹ️ The devotee opens this link to complete their 5-step registration (Personal Details, Ancestral Lineage, KYC Proofs, Digital Signature). Once submitted, the application enters your <strong>Pending Seeker Hierarchy Approvals</strong> queue for 1-click verification.
            </div>
          </div>
        </div>

        <!-- 1. Source Code Display Banner (Matching Android App Surface) -->
        <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 0.65rem; padding: 0.85rem 1.15rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
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
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.85rem;">
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
        <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 0.65rem; padding: 0.85rem 1rem;">
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
        <div>
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
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">Shareable Invitation Payload (Monospace Preview):</div>
          <pre style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-sm); padding: 0.85rem; font-size: 0.76rem; font-family: var(--font-mono); color: var(--text-secondary); white-space: pre-wrap; max-height: 130px; overflow-y: auto;">${payloadText}</pre>
        </div>

        <!-- 6. 24-Hour Pending Approvals Section -->
        <div class="pending-approvals-card" style="margin-bottom: 0;">
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
          actionsHtml = `
            <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
              <span style="color: #10b981; font-weight: 700; font-size: 0.8rem;">✓ Linked as ${inv.assignedRole || "Devotee"}</span>
              <button type="button" class="btn btn-sm btn-outline btn-open-applicant-drawer" data-invite-id="${inv.id}" style="font-size: 0.72rem; padding: 0.15rem 0.45rem; color: var(--gold-400);" title="View Devotee Lineage & Dossier in Slide-out Drawer">👁️ Dossier</button>
            </div>
          `;
        } else if (isExpired) {
          actionsHtml = `<button type="button" class="btn btn-sm btn-outline btn-resend-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem;">🔄 Resend Window</button>`;
        } else {
          const isSadhanaApp = inv.type === "SADHANA_APPLICATION";
          const isHealerApp = inv.type === "HEALER_APPLICATION";
          const defaultRole = isHealerApp ? "HEALER" : isSadhanaApp ? "TRAINEE" : (inv.assignedRole || "DEVOTEE");

          actionsHtml = `
          <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
            <select class="select-pairing-role" data-invite-id="${inv.id}" style="font-size: 0.72rem; padding: 0.2rem 0.35rem; background: rgba(0,0,0,0.45); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px; font-weight: 600;">
              <option value="DEVOTEE" ${defaultRole === "DEVOTEE" ? "selected" : ""}>Devotee (L5)</option>
              <option value="TRAINEE" ${defaultRole === "TRAINEE" ? "selected" : ""}>Trainee (L3)</option>
              <option value="HEALER" ${defaultRole === "HEALER" ? "selected" : ""}>Healer (L2)</option>
            </select>
            <button type="button" class="btn btn-sm btn-gold btn-approve-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; font-weight: 700;">✓ Approve</button>
            <button type="button" class="btn btn-sm btn-outline btn-review-pairing btn-open-applicant-drawer" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; color: var(--gold-400);" title="Open Seeker Dossier, KYC Proofs & Approval Controls in Slide-out Drawer">⚖️ Review</button>
            <button type="button" class="btn btn-sm btn-outline btn-reject-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; color: #ef4444;">✕</button>
          </div>
        `;
        }

        const appTag = inv.type === "SADHANA_APPLICATION"
          ? `<span style="display:inline-block; font-size:0.68rem; padding:0.1rem 0.4rem; background:rgba(245, 158, 11, 0.2); color:#f59e0b; border:1px solid rgba(245,158,11,0.4); border-radius:4px; margin-top:2px;">📿 Sadhana: ${inv.sadhanaTitle || inv.sadhanaId}</span>`
          : inv.type === "HEALER_APPLICATION"
          ? `<span style="display:inline-block; font-size:0.68rem; padding:0.1rem 0.4rem; background:rgba(16, 185, 129, 0.2); color:#10b981; border:1px solid rgba(16,185,129,0.4); border-radius:4px; margin-top:2px;">🛡️ Healer Certification</span>`
          : "";

        let photoSrc = "";
        try {
          const docs = JSON.parse(localStorage.getItem('sk_documents') || '[]');
          const pDoc = docs.find(d => (d.profileId === inv.id || d.profileId === inv.devoteeCode) && d.docType === 'photo');
          photoSrc = pDoc?.dataUrl || inv.documentsUploaded?.photo || "";
        } catch(e) {}
        const initials = inv.seekerName ? inv.seekerName.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : "SK";

        return `
        <tr data-invite-row="${inv.id}">
          <td>
            <div style="display: flex; gap: 0.65rem; align-items: center;">
              <div class="applicant-avatar-thumb btn-open-applicant-drawer" data-invite-id="${inv.id}" style="width: 38px; height: 38px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(16,185,129,0.15) 100%); border: 1.5px solid var(--gold-400); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800; color: var(--gold-400); cursor: pointer; flex-shrink: 0; box-shadow: 0 0 8px rgba(212,175,55,0.25);" title="Click to view Seeker Dossier & Image Proofs">
                ${photoSrc ? `<img src="${photoSrc}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : initials}
              </div>
              <div>
                <div style="font-weight: 700; color: var(--text-primary); cursor: pointer;" class="btn-open-applicant-drawer" data-invite-id="${inv.id}" title="Click to view Seeker Dossier & Image Proofs">${inv.seekerName || "Seeker"}</div>
                <div style="font-size: 0.76rem; color: var(--text-muted); font-family: var(--font-mono);">${inv.seekerPhone || "No Phone"}</div>
                ${inv.devoteeCode ? `<div style="font-size: 0.68rem; color: var(--gold-400); font-family: var(--font-mono);">${inv.devoteeCode}</div>` : ""}
                <div style="margin-top: 0.25rem;">
                  <button type="button" class="btn btn-sm btn-open-applicant-drawer" data-invite-id="${inv.id}" style="padding: 0.15rem 0.5rem; font-size: 0.72rem; color: var(--gold-400); background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 4px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;" title="Open Right Slide-out Drawer: Image Data, KYC Proofs & Approval Details">
                    🖼️ Details &amp; Proofs ➔
                  </button>
                </div>
                ${(inv.lineage?.paternalGotra || inv.lineage?.kuldevi) ? `<div style="font-size: 0.68rem; color: #a1a1aa; margin-top: 0.15rem;">🕉️ ${inv.lineage?.paternalGotra || "Gotra"} • ${inv.lineage?.kuldevi || "Kuldevi"}</div>` : ""}
                ${appTag}
              </div>
            </div>
          </td>
          <td>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${inv.type === "SADHANA_APPLICATION" ? "📿 Sadhana Initiation" : inv.type === "HEALER_APPLICATION" ? "🛡️ Healer Status" : (inv.seekerDeviceModel || "Android Device")}</div>
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
      defaultMentorName: (this.model && typeof this.model.getDefaultMentorName === "function") ? this.model.getDefaultMentorName() : "Spiritual Karim Khan (Founder)",
      defaultMentorCode: (this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : "SKHM-ADM1-7788-9900",
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
    setChecked("setting-show-profile-box-2", s.showProfileBox2 === true);
    setVal(
      "setting-copyright-marquee",
      s.copyrightMarqueeText ||
        "© 2024-2026 Shree Spritual Karim Sansthan • All Sacred Lineage Rights Reserved • Certified ISO/IEC 27001 Secure Node Telemetry • Guided under the divine vision of Spiritual Karim Khan • Real-time Lineage Synchronization Active",
    );
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
      showProfileBox2: getChecked("setting-show-profile-box-2", false),
      copyrightMarqueeText: getVal(
        "setting-copyright-marquee",
        "© 2024-2026 Shree Spritual Karim Sansthan • All Sacred Lineage Rights Reserved • Certified ISO/IEC 27001 Secure Node Telemetry • Guided under the divine vision of Spiritual Karim Khan • Real-time Lineage Synchronization Active",
      ),
    };
  }

  _updateJSONPreview(profile) {
    if (this.jsonPreviewCode) {
      this.jsonPreviewCode.textContent = JSON.stringify(profile, null, 2);
    }
  }

  openTierPanel(tierNumber, allProfiles, activeProfileId) {
    const map = { 1: "MASTER", 2: "HEALER", 3: "TRAINEE", 4: "DEVOTEE" };
    const tierKey = map[tierNumber] || "MASTER";
    this.openTierProfilesPanel(tierKey, allProfiles);
  }

  /**
   * Apply dynamic auth matrix - shows/hides UI elements based on role
   */
  applyDynamicAuthMatrix(matrix, roleMode = "MASTER") {
    if (!matrix || !Array.isArray(matrix)) return;

    const rawRole = (roleMode || "MASTER").toUpperCase().trim();
    const resolvedRole = (typeof ScreenAuthMatrix !== "undefined" && typeof ScreenAuthMatrix.resolveRole === "function")
      ? ScreenAuthMatrix.resolveRole(rawRole)
      : ((rawRole.includes("ADMIN") || rawRole.includes("MASTER")) ? "MASTER" : rawRole);

    const bodyPortalRole = (document.body.getAttribute("data-portal-role") || resolvedRole).toLowerCase();
    let firstVisibleTab = null;

    matrix.forEach((item) => {
      const isRoleAllowed = (item.roles && item.roles[resolvedRole] !== undefined)
        ? item.roles[resolvedRole] !== false
        : (item[resolvedRole] !== undefined ? item[resolvedRole] !== false : true);

      const isPortalAllowed = item.portalVisible
        ? (item.portalVisible[bodyPortalRole] !== false &&
           ((bodyPortalRole === "master" || bodyPortalRole === "admin") ? (item.portalVisible.masters !== false && item.portalVisible.admin !== false) : true))
        : (item.portals
            ? (item.portals[bodyPortalRole] !== false &&
               ((bodyPortalRole === "master" || bodyPortalRole === "admin") ? (item.portals.masters !== false && item.portals.admin !== false) : true))
            : true);

      let isAllowed = isRoleAllowed && isPortalAllowed;

      // Container/Parent Level 1 Sections: if any child is allowed, show container; if all children are denied and parent is denied, hide it
      if (item.id === "admin_current_events_strip") {
        isAllowed = isRoleAllowed && isPortalAllowed;
      } else if (item.level === 1) {
        const childElements = matrix.filter(m => m && m.parent === item.id);
        if (childElements.length > 0) {
          const anyChildAllowed = childElements.some(ch => {
            const chRole = (ch.roles && ch.roles[resolvedRole] !== undefined)
              ? ch.roles[resolvedRole] !== false
              : (ch[resolvedRole] !== undefined ? ch[resolvedRole] !== false : true);
            const chPortal = ch.portalVisible
              ? (ch.portalVisible[bodyPortalRole] !== false &&
                 ((bodyPortalRole === "master" || bodyPortalRole === "admin") ? (ch.portalVisible.masters !== false && ch.portalVisible.admin !== false) : true))
              : (ch.portals
                  ? (ch.portals[bodyPortalRole] !== false &&
                     ((bodyPortalRole === "master" || bodyPortalRole === "admin") ? (ch.portals.masters !== false && ch.portals.admin !== false) : true))
                  : true);
            return chRole && chPortal;
          });
          const allChildrenDenied = childElements.every(ch => {
            return (ch.roles && ch.roles[resolvedRole] !== undefined)
              ? ch.roles[resolvedRole] === false
              : (ch[resolvedRole] !== undefined ? ch[resolvedRole] === false : false);
          });
          if (allChildrenDenied && !isRoleAllowed) {
            isAllowed = false;
          } else if (anyChildAllowed) {
            isAllowed = true;
          }
        }
      }

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
            if (el.id === "selected-member-profile-card") {
              const shouldShowCard2 = isAllowed && !!this.currentSelectedTierMember && (this.settings && this.settings.showProfileBox2 === true);
              el.style.display = shouldShowCard2 ? "block" : "none";
            } else if (el.id === "admin-hierarchy-metrics-strip") {
              el.style.display = isAllowed ? "grid" : "none";
            } else if (el.id === "admin-current-events-strip" || el.id === "devotee-sadhana-applied-strip" || el.id === "devotee-remedy-applied-strip") {
              el.style.display = isAllowed ? "block" : "none";
            } else if (el.id === "sidebar-rtdb-section" || el.classList.contains("sidebar-rtdb-card")) {
              el.style.display = isAllowed ? "" : "none";
            } else {
              el.style.display = isAllowed ? "" : "none";
            }
            if (isAllowed) {
              el.classList.remove("auth-hidden");
            } else {
              el.classList.add("auth-hidden");
            }
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

    // Strict safeguard: metric tiles and admin metrics strip are strictly forbidden for Devotee and Trainee portals
    if (resolvedRole === "DEVOTEE" || resolvedRole === "TRAINEE" || bodyPortalRole === "devotee" || bodyPortalRole === "trainee") {
      const metricStrip = document.getElementById("admin-hierarchy-metrics-strip");
      if (metricStrip) metricStrip.style.setProperty("display", "none", "important");
      const metricCards = document.querySelectorAll(".admin-metric-tile-card, .admin-metric-card, #metric-tile-master, #metric-tile-healers, #metric-tile-trainees, #metric-tile-devotees, #metric-tile-composite, #metric-tile-genealogy, #metric-tile-approvals");
      metricCards.forEach(c => c.style.setProperty("display", "none", "important"));
    }

    // Gating Header Role Switcher Dropdown for Devotee & Trainee (cannot switch role until upgraded by Admin)
    const roleSwitcherItem = matrix.find(item => item.id === "header_user_role_dropdown");
    const isRoleSwitcherAllowed = roleSwitcherItem
      ? (((roleSwitcherItem.roles && roleSwitcherItem.roles[resolvedRole] !== false) || roleSwitcherItem[resolvedRole] !== false) &&
         (!roleSwitcherItem.portalVisible || roleSwitcherItem.portalVisible[bodyPortalRole] !== false))
      : (resolvedRole === "MASTER" || resolvedRole === "HEALER");

    const roleSelect = document.getElementById("select-role-mode");
    const roleCarets = document.querySelectorAll(".pill-dropdown-caret");
    const sessionPill = document.getElementById("topbar-session-user-pill");

    if (!isRoleSwitcherAllowed || resolvedRole === "DEVOTEE" || resolvedRole === "TRAINEE" || bodyPortalRole === "devotee" || bodyPortalRole === "trainee") {
      if (roleSelect) {
        roleSelect.disabled = true;
        roleSelect.style.setProperty("display", "none", "important");
        roleSelect.classList.add("auth-hidden", "portal-hidden");
      }
      roleCarets.forEach(c => {
        c.style.setProperty("display", "none", "important");
        c.classList.add("auth-hidden", "portal-hidden");
      });
      if (sessionPill) {
        sessionPill.style.cursor = "default";
        sessionPill.classList.add("role-switch-disabled");
        const currentName = document.getElementById("topbar-session-name")?.textContent || "User";
        sessionPill.title = `Current Authority: ${currentName} • Role: ${resolvedRole}`;
      }
    } else {
      if (roleSelect) {
        roleSelect.disabled = false;
        roleSelect.style.display = "";
        roleSelect.classList.remove("auth-hidden", "portal-hidden");
      }
      roleCarets.forEach(c => {
        c.style.display = "";
        c.classList.remove("auth-hidden", "portal-hidden");
      });
      if (sessionPill) {
        sessionPill.style.cursor = "pointer";
        sessionPill.classList.remove("role-switch-disabled");
        const currentName = document.getElementById("topbar-session-name")?.textContent || "User";
        sessionPill.title = `Current Authority: ${currentName} • Click to switch role`;
      }
    }

    // Selected member card must NEVER contain an approval button
    const card2 = document.getElementById("selected-member-profile-card");
    if (card2) {
      const unwantedApprovalBtns = card2.querySelectorAll(
        ".header-approval-tab-btn, #main-tab-approval-btn, .approval-notification-pill",
      );
      unwantedApprovalBtns.forEach((btn) => btn.remove());
    }

    // Apply field-level read-only protections per ScreenAuthMatrix
    if (typeof ScreenAuthMatrix !== "undefined" && typeof ScreenAuthMatrix.isFieldReadOnly === "function") {
      const inputs = document.querySelectorAll("input[id], select[id]");
      inputs.forEach((inp) => {
        if (inp.id && ScreenAuthMatrix.isFieldReadOnly(resolvedRole, inp.id)) {
          inp.disabled = true;
          inp.setAttribute("readonly", "true");
        } else if (inp.id && !inp.dataset.permanentlyDisabled) {
          inp.disabled = false;
          inp.removeAttribute("readonly");
        }
      });
    }

    // Higher-to-Lower Sidebar Tier Pruning
    this.pruneSidebarForRole(resolvedRole);

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
   * Prunes Left Navigation Sidebar Hierarchy Tiers based on operating role:
   * Master (L1): Sees Tiers 1 to 5
   * Healer (L2): Sees Tiers 2 to 5 (Master hidden)
   * Trainee (L3): Sees Tier 3 & dedicated downline (Master & Healer hidden)
   * Devotee (L4): Sees Tier 4 only
   */
  pruneSidebarForRole(roleMode = "MASTER") {
    const r = (roleMode || "MASTER").toUpperCase() === "ADMIN" ? "MASTER" : (roleMode || "MASTER").toUpperCase();
    
    // 1. Prune Hierarchy Tree Tiers
    const tierGroups = document.querySelectorAll("#hierarchy-legend-container .tree-explorer-item-group");
    const allowedTiers = {
      MASTER: [1, 2, 3, 4],
      HEALER: [2, 3, 4],
      TRAINEE: [3, 4],
      DEVOTEE: [4],
      SEEKER: [4]
    }[r] || [1, 2, 3, 4];

    if (tierGroups && tierGroups.length > 0) {
      tierGroups.forEach((group) => {
        const node = group.querySelector(".legend-item[data-tier]");
        if (!node) return;
        const tierNum = parseInt(node.getAttribute("data-tier"), 10);
        group.style.display = allowedTiers.includes(tierNum) ? "" : "none";
      });
    }

    // 2. Prune Dedicated Portals (Hierarchy Scoping)
    const portalCards = document.querySelectorAll("#sidebar-dedicated-portals .sub-portal-link, #dedicated-portals-container .sub-portal-nav-card");
    const allowedPortals = {
      MASTER: [1, 2, 3, 4, 5],
      HEALER: [2, 3, 4, 5],
      TRAINEE: [3, 4, 5],
      DEVOTEE: [4, 5],
      SEEKER: [5]
    }[r] || [1, 2, 3, 4, 5];

    if (portalCards && portalCards.length > 0) {
      portalCards.forEach((card) => {
        const tierNum = parseInt(card.getAttribute("data-portal-tier"), 10);
        card.style.display = allowedPortals.includes(tierNum) ? "" : "none";
      });
    }

    // 3. Prune Firebase RTDB Sidebar Section (Master only)
    const rtdbSection = document.getElementById("sidebar-rtdb-section") || document.querySelector(".sidebar-rtdb-card")?.closest(".sidebar-section");
    if (rtdbSection) {
      rtdbSection.style.display = (r === "MASTER") ? "" : "none";
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
    // Even if banner DOM element is not present, badges must always update

    const resolvedR = (roleMode || "MASTER").toUpperCase();
    const isMentor = resolvedR === "MASTER" || resolvedR === "ADMIN" || resolvedR === "HEALER";

    // Devotee and Trainee have no approval notifications
    if (!isMentor || ["DEVOTEE", "SEEKER", "TRAINEE", "SADHAK"].includes(resolvedR)) {
      const hCount = this.headerPendingApprovalCount || document.getElementById("header-pending-approval-count");
      if (hCount) { hCount.textContent = "0"; hCount.style.display = "none"; }
      const sideB = document.getElementById("sidebar-pending-badge");
      if (sideB) sideB.textContent = "0";
      const headB = document.getElementById("header-pending-badge");
      if (headB) headB.textContent = "0";
      if (this.pendingApprovalBanner) this.pendingApprovalBanner.style.display = "none";
      return;
    }

    // Mentors/Healers see counts for applicants under their lineage
    const activeProf = (this.model && typeof this.model.getActiveProfile === "function") ? this.model.getActiveProfile() : {};
    let roleFiltered = pendingInvites || [];
    if (resolvedR === "HEALER") {
      const healerRef = (activeProf.referenceCode || "").trim();
      roleFiltered = roleFiltered.filter(i => i && (i.sponsorCode === healerRef || i.mentorCode === healerRef));
    }
    const pendingList = roleFiltered.filter((i) => (i.status || "").toUpperCase() === "PENDING");
    const regPendingCount = pendingList.length;

    // Fetch Sadhana & Remedy applications
    let sadhanaApps = [];
    if (this.model && typeof this.model.getSadhanaRemedyApplications === "function") {
      sadhanaApps = this.model.getSadhanaRemedyApplications() || [];
    } else {
      try {
        sadhanaApps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]");
      } catch (e) { sadhanaApps = []; }
    }
    // FILTER ARCHIVED OUT OF MAIN VIEWS
    sadhanaApps = sadhanaApps.filter(a => a.status !== "DELETED");
    let roleFilteredSadhana = sadhanaApps || [];
    if (resolvedR === "HEALER") {
      const healerRef = (activeProf.referenceCode || "").trim();
      roleFilteredSadhana = roleFilteredSadhana.filter(a => a && (a.sponsorCode === healerRef || a.mentorCode === healerRef));
    }
    const pendingSadhanaList = roleFilteredSadhana.filter(a => (a.status || "").toUpperCase() === "PENDING");

    // Avoid duplicate count if an item exists in both lists
    const inviteIds = new Set(pendingList.map(i => i.id));
    const uniqueSadhanaPending = pendingSadhanaList.filter(a => !inviteIds.has(a.id));
    const count = regPendingCount + uniqueSadhanaPending.length;

    const headerCount =
      this.headerPendingApprovalCount ||
      document.getElementById("header-pending-approval-count");
    if (headerCount) {
      headerCount.textContent = count;
      headerCount.style.background = count > 0 ? "#eab308" : "rgba(255, 255, 255, 0.15)";
      headerCount.style.color = count > 0 ? "#000000" : "var(--text-muted)";
    }
    const sideBadge = document.getElementById("sidebar-pending-badge");
    if (sideBadge) sideBadge.textContent = count;
    const headerBadge = document.getElementById("header-pending-badge");
    if (headerBadge) headerBadge.textContent = count;

    if (this.pendingApprovalBanner) {
      this.pendingApprovalBanner.style.display = "none";
    }
  }

  /**
   * Render auth matrix in settings modal
   */
  renderAuthMatrixInSettings(matrix, currentRole = "MASTER") {
    const tableBodies = [
      document.getElementById("auth-matrix-tbody"),
      document.getElementById("auth-matrix-modal-tbody")
    ].filter(Boolean);

    if (tableBodies.length === 0 || !Array.isArray(matrix)) return;

    // Populate Category Dropdown Options with screen-wise counts
    const catCounts = {};
    matrix.forEach(i => {
      const cat = i.category || "General";
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const categories = Array.from(new Set(matrix.map(i => i.category || "General"))).sort();
    const catSelects = [
      document.getElementById("auth-matrix-category-filter"),
      document.getElementById("auth-matrix-modal-category-filter")
    ].filter(Boolean);

    catSelects.forEach((sel) => {
      const currentVal = sel.value || "ALL";
      sel.innerHTML = `<option value="ALL">All Screen Divisions (${matrix.length} elements)</option>` +
        categories.map(c => `<option value="${c}">${c} (${catCounts[c] || 0})</option>`).join("");
      sel.value = currentVal;
    });

    const roles = ["MASTER", "HEALER", "TRAINEE", "DEVOTEE"];
    let html = "";
    let lastCategory = null;

    matrix.forEach((item) => {
      const cat = item.category || "General";
      if (cat !== lastCategory) {
        lastCategory = cat;
        const count = catCounts[cat] || 0;
        html += `<tr class="auth-matrix-category-header" data-category="${cat}">
          <td style="padding: 0.6rem 0.75rem; background: var(--bg-hover, rgba(255,255,255,0.06)); font-weight: 700; font-size: 0.8rem; color: var(--gold-400, #f59e0b); border-bottom: 2px solid var(--border-subtle, rgba(255,255,255,0.15)); border-top: 1px solid var(--border-subtle, rgba(255,255,255,0.15));">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>📁 ${cat}</span>
              <span class="badge" style="font-size: 0.68rem; padding: 0.1rem 0.45rem; background: rgba(245,158,11,0.15); color: var(--gold-300, #fde68a); border-radius: 999px;">${count} elements</span>
            </div>
          </td>`;
        roles.forEach((role) => {
          html += `<td style="text-align: center; padding: 0.4rem; background: var(--bg-hover, rgba(255,255,255,0.06)); border-bottom: 2px solid var(--border-subtle, rgba(255,255,255,0.15)); border-top: 1px solid var(--border-subtle, rgba(255,255,255,0.15));">
            <input type="checkbox" class="matrix-cat-check" data-cat="${cat}" data-role="${role}" title="Toggle all ${cat} for ${role}">
          </td>`;
        });
        html += `</tr>`;
      }

      let rowClass = "auth-matrix-row";
      let branchConnector = "";
      if (item.level === 0) {
        rowClass += " auth-tree-row-l0";
        branchConnector = '<span style="margin-right: 0.35rem;">🖥️</span>';
      } else if (item.level === 1) {
        rowClass += " auth-tree-row-l1";
        branchConnector = '<span class="auth-tree-branch">├── 📂</span> ';
      } else {
        rowClass += " auth-tree-row-l2";
        branchConnector = '<span class="auth-tree-branch">└── ⚙️</span> ';
      }

      const displayName = item.name || item.label || item.id;
      const typeBadge = `<span class="badge" style="font-size: 0.58rem; padding: 0.05rem 0.35rem; border-radius: 4px; background: rgba(255,255,255,0.06); color: var(--text-muted); margin-left: 0.35rem;">${item.type || ""}</span>`;
      const delBtn = item.isCustom ? `<button type="button" class="auth-matrix-del-btn" data-id="${item.id}" title="Delete Custom Element" style="background: none; border: none; cursor: pointer; font-size: 0.75rem; margin-left: auto; color: var(--danger, #ef4444); opacity: 0.8;">🗑️</button>` : "";

      html += `<tr data-item-id="${item.id}" data-category="${cat}" data-level="${item.level !== undefined ? item.level : 2}" data-parent="${item.parent || ''}" data-search-text="${(displayName + " " + item.id + " " + cat + " " + (item.type||"") + " " + (item.selector||"")).toLowerCase()}" class="${rowClass}">
        <td style="padding: 0.45rem 0.6rem; border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.07));">
          <div style="display: flex; align-items: center; font-size: 0.76rem; color: var(--text-primary);">
            ${branchConnector}
            <span class="auth-matrix-item-name">${displayName}</span>
            ${typeBadge}
            ${delBtn}
          </div>
          ${item.selector ? `<div style="font-size: 0.6rem; color: var(--text-muted); font-family: monospace; margin-left: ${item.level === 0 ? '1.5rem' : item.level === 1 ? '2.5rem' : '3.5rem'}; opacity: 0.6;">${item.selector}</div>` : ""}
        </td>`;

      roles.forEach((role) => {
        const isRoleAllowed = (item.roles && item.roles[role] !== undefined)
          ? item.roles[role] !== false
          : (item[role] !== undefined ? item[role] !== false : true);
        const checked = isRoleAllowed ? "checked" : "";
        html += `<td style="text-align: center; padding: 0.4rem; border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.07));">
          <input type="checkbox" class="matrix-role-check" data-role="${role}" data-id="${item.id}" ${checked}>
        </td>`;
      });

      html += "</tr>";
    });

    tableBodies.forEach((tbody) => {
      tbody.innerHTML = html;
      this.updateAuthMatrixIndeterminateStates(tbody);

      if (!tbody._matrixListenersBound) {
        tbody._matrixListenersBound = true;

        tbody.addEventListener("change", (e) => {
          // A. Category Header Checkbox clicked -> cascade to all rows in that category
          if (e.target.classList.contains("matrix-cat-check")) {
            const cat = e.target.getAttribute("data-cat");
            const role = e.target.getAttribute("data-role");
            const isChecked = e.target.checked;
            e.target.indeterminate = false;
            e.target.classList.remove("is-partial");

            const itemChecks = tbody.querySelectorAll(`.auth-matrix-row[data-category="${cat}"] .matrix-role-check[data-role="${role}"]`);
            itemChecks.forEach((chk) => {
              chk.checked = isChecked;
              chk.indeterminate = false;
              chk.classList.remove("is-partial");
            });

            if (this.controller && this.controller.model) {
              const matrixData = this.controller.model.getAuthMatrix();
              matrixData.forEach((m) => {
                if (m.category === cat) {
                  m[role] = isChecked;
                  if (!m.roles) m.roles = {};
                  m.roles[role] = isChecked;
                  if (role === "DEVOTEE") {
                    m["SEEKER"] = isChecked;
                    m.roles["SEEKER"] = isChecked;
                  }
                }
              });
              this.controller.model.saveAuthMatrix(matrixData);
              this.controller.view.applyDynamicAuthMatrix(matrixData, this.controller.model.getRoleMode());
              if (typeof this.controller._applyEventPanelRBAC === "function") {
                this.controller._applyEventPanelRBAC();
              }
            }

            this.updateAuthMatrixIndeterminateStates(tbody);
            return;
          }

          // B. Element row checkbox clicked -> cascade down & recalculate indeterminate states
          if (e.target.classList.contains("matrix-role-check")) {
            const role = e.target.getAttribute("data-role");
            const row = e.target.closest(".auth-matrix-row");
            if (!row) return;
            const itemId = row.getAttribute("data-item-id");
            const level = parseInt(row.getAttribute("data-level"), 10) || 0;
            const cat = row.getAttribute("data-category");
            const isChecked = e.target.checked;
            e.target.indeterminate = false;
            e.target.classList.remove("is-partial");

            // Cascade down to child elements
            if (level === 0) {
              const childChecks = tbody.querySelectorAll(`.auth-matrix-row[data-category="${cat}"] .matrix-role-check[data-role="${role}"]`);
              childChecks.forEach((chk) => {
                chk.checked = isChecked;
                chk.indeterminate = false;
                chk.classList.remove("is-partial");
              });
            } else if (level === 1) {
              if (itemId !== "admin_current_events_strip") {
                const childChecks = tbody.querySelectorAll(`.auth-matrix-row[data-parent="${itemId}"] .matrix-role-check[data-role="${role}"]`);
                childChecks.forEach((chk) => {
                  chk.checked = isChecked;
                  chk.indeterminate = false;
                  chk.classList.remove("is-partial");
                });
              }
            }

            // Update underlying model data
            if (this.controller && this.controller.model) {
              const matrixData = this.controller.model.getAuthMatrix();
              const rowChecks = tbody.querySelectorAll(".matrix-role-check");
              rowChecks.forEach((chk) => {
                const r = chk.getAttribute("data-role");
                const id = chk.getAttribute("data-id");
                const found = matrixData.find((m) => m.id === id);
                if (found && r) {
                  found[r] = chk.checked;
                  if (!found.roles) found.roles = {};
                  found.roles[r] = chk.checked;
                  if (r === "DEVOTEE") {
                    found["SEEKER"] = chk.checked;
                    found.roles["SEEKER"] = chk.checked;
                  }
                }
              });
              this.controller.model.saveAuthMatrix(matrixData);
              this.controller.view.applyDynamicAuthMatrix(matrixData, this.controller.model.getRoleMode());
              if (typeof this.controller._applyEventPanelRBAC === "function") {
                this.controller._applyEventPanelRBAC();
              }
            }

            // Recalculate parent and category header indeterminate / checked states
            this.updateAuthMatrixIndeterminateStates(tbody);
          }
        });
      }
    });

    // Wire up delete handlers for custom elements
    if (!this._authMatrixDeleteBound) {
      this._authMatrixDeleteBound = true;
      document.addEventListener("click", (e) => {
        const delBtn = e.target.closest(".auth-matrix-del-btn");
        if (delBtn) {
          const id = delBtn.getAttribute("data-id");
          if (id && confirm(`Delete element "${id}" from authorization matrix?`)) {
            if (typeof ScreenAuthMatrix !== "undefined" && ScreenAuthMatrix.deleteElement) {
              ScreenAuthMatrix.deleteElement(id);
              if (this.controller && this.controller.model) {
                const updated = this.controller.model.getAuthMatrix();
                this.renderAuthMatrixInSettings(updated, this.controller.model.getRoleMode());
                this.showToast(`🗑️ Element "${id}" deleted.`);
              }
            }
          }
        }
      });
    }

    // Attach Search & Category Live Filtering Listeners
    this._initAuthMatrixSearchListeners();
  }

  updateAuthMatrixIndeterminateStates(tbody) {
    if (!tbody) return;
    const roles = ["MASTER", "HEALER", "TRAINEE", "DEVOTEE"];

    // 1. Compute Category Header indeterminate / checked / unchecked states
    const catHeaders = tbody.querySelectorAll(".auth-matrix-category-header");
    catHeaders.forEach((hdr) => {
      const cat = hdr.getAttribute("data-category");
      roles.forEach((role) => {
        const catCheck = hdr.querySelector(`.matrix-cat-check[data-role="${role}"]`);
        if (!catCheck) return;

        const rowChecks = Array.from(tbody.querySelectorAll(`.auth-matrix-row[data-category="${cat}"] .matrix-role-check[data-role="${role}"]`));
        const total = rowChecks.length;
        if (total === 0) return;

        const checkedCount = rowChecks.filter((c) => c.checked).length;
        if (checkedCount === total) {
          catCheck.checked = true;
          catCheck.indeterminate = false;
          catCheck.classList.remove("is-partial");
        } else if (checkedCount === 0) {
          catCheck.checked = false;
          catCheck.indeterminate = false;
          catCheck.classList.remove("is-partial");
        } else {
          // Mixed state: partially checked -> orange partial tick
          catCheck.checked = false;
          catCheck.indeterminate = true;
          catCheck.classList.add("is-partial");
        }
      });
    });

    // 2. Compute Level 1 (Card/Subtab) indeterminate states based on Level 2 children
    const level1Rows = tbody.querySelectorAll('.auth-matrix-row[data-level="1"]');
    level1Rows.forEach((l1Row) => {
      const parentId = l1Row.getAttribute("data-item-id");
      // admin_current_events_strip is an independent section display toggle
      if (parentId === "admin_current_events_strip") return;
      roles.forEach((role) => {
        const l1Check = l1Row.querySelector(`.matrix-role-check[data-role="${role}"]`);
        if (!l1Check) return;

        const l2Checks = Array.from(tbody.querySelectorAll(`.auth-matrix-row[data-parent="${parentId}"] .matrix-role-check[data-role="${role}"]`));
        if (l2Checks.length === 0) return;

        const checkedCount = l2Checks.filter((c) => c.checked).length;
        if (checkedCount === l2Checks.length) {
          l1Check.checked = true;
          l1Check.indeterminate = false;
          l1Check.classList.remove("is-partial");
        } else if (checkedCount === 0) {
          l1Check.checked = false;
          l1Check.indeterminate = false;
          l1Check.classList.remove("is-partial");
        } else {
          l1Check.checked = false;
          l1Check.indeterminate = true;
          l1Check.classList.add("is-partial");
        }
      });
    });
  }

  _initAuthMatrixSearchListeners() {
    const bindSearch = (searchInputId, catSelectId, tbodyId) => {
      const input = document.getElementById(searchInputId);
      const catSelect = document.getElementById(catSelectId);
      const tbody = document.getElementById(tbodyId);
      if (!input || !tbody) return;

      const apply = () => {
        const query = (input.value || "").toLowerCase().trim();
        const tokens = query ? query.split(/\s+/).filter(Boolean) : [];
        const selectedCat = (catSelect && catSelect.value) ? catSelect.value : "ALL";

        const rows = Array.from(tbody.querySelectorAll(".auth-matrix-row"));
        const categoryHeaders = Array.from(tbody.querySelectorAll(".auth-matrix-category-header"));

        // Build item lookup and direct matches
        const rowMap = new Map();
        const directMatches = new Set();
        const visibleIds = new Set();
        const visibleCategories = new Set();

        rows.forEach((row) => {
          const itemId = row.getAttribute("data-item-id");
          const parentId = row.getAttribute("data-parent");
          const rowCat = row.getAttribute("data-category") || "";
          const searchText = (row.getAttribute("data-search-text") || (row.textContent || "")).toLowerCase();

          rowMap.set(itemId, { row, parentId, rowCat, searchText });

          const matchesCat = selectedCat === "ALL" || rowCat === selectedCat;
          const isDirect = tokens.length === 0 || tokens.every((tok) => searchText.includes(tok));

          if (isDirect && matchesCat) {
            directMatches.add(itemId);
            visibleIds.add(itemId);
          }
        });

        // Bidirectional hierarchy propagation:
        if (tokens.length > 0) {
          // A. Upward propagation: Include all ancestors (parents & grandparent screen)
          directMatches.forEach((id) => {
            let current = rowMap.get(id);
            while (current && current.parentId) {
              visibleIds.add(current.parentId);
              current = rowMap.get(current.parentId);
            }
          });

          // B. Downward propagation: If a parent/card matches directly, include all descendants
          rows.forEach((row) => {
            const itemId = row.getAttribute("data-item-id");
            const parentId = row.getAttribute("data-parent");
            if (parentId && directMatches.has(parentId)) {
              visibleIds.add(itemId);
            }
            const pInfo = rowMap.get(parentId);
            if (pInfo && pInfo.parentId && directMatches.has(pInfo.parentId)) {
              visibleIds.add(itemId);
            }
          });
        }

        // Apply display visibility
        rows.forEach((row) => {
          const itemId = row.getAttribute("data-item-id");
          const rowCat = row.getAttribute("data-category") || "";
          const matchesCat = selectedCat === "ALL" || rowCat === selectedCat;
          const isVisible = visibleIds.has(itemId) && matchesCat;

          if (isVisible) {
            row.style.display = "";
            visibleCategories.add(rowCat);
          } else {
            row.style.display = "none";
          }
        });

        // Show/hide category headers based on whether visible items exist
        categoryHeaders.forEach((hdr) => {
          const hdrCat = hdr.getAttribute("data-category");
          hdr.style.display = (tokens.length === 0 && selectedCat === "ALL") || visibleCategories.has(hdrCat) ? "" : "none";
        });
      };

      if (!input._hasSearchListener) {
        input._hasSearchListener = true;
        input.addEventListener("input", apply);
      }
      if (catSelect && !catSelect._hasCategoryListener) {
        catSelect._hasCategoryListener = true;
        catSelect.addEventListener("change", apply);
      }
    };

    bindSearch("auth-matrix-search-input", "auth-matrix-category-filter", "auth-matrix-tbody");
    bindSearch("auth-matrix-modal-search", "auth-matrix-modal-category-filter", "auth-matrix-modal-tbody");
  }
}


// ==============================================================
// SLIDE-DOWN TIER PROFILES PANEL (LEFT LIST MAX 5 + RIGHT METADATA)
// ==============================================================
ProfileView.prototype.initTierProfilesPanel = function() {
  this.tierProfilesPanel = document.getElementById("tier-profiles-panel");
  this.tierPanelIcon = document.getElementById("tier-panel-icon");
  this.tierPanelTitle = document.getElementById("tier-panel-title");
  this.tierPanelCount = document.getElementById("tier-panel-count");
  this.tierPanelProfilesList = document.getElementById("tier-panel-profiles-list");
  this.tierRightProfileDetails = document.getElementById("tier-right-profile-details");
  this.inputTierPanelSearch = document.getElementById("input-tier-panel-search");
  this.currentTierKey = null;
  this.currentTierProfiles = [];
  this.currentFilteredTierProfiles = [];

  // Wire search input
  if (this.inputTierPanelSearch && !this.inputTierPanelSearch._hasTierListener) {
    this.inputTierPanelSearch._hasTierListener = true;
    this.inputTierPanelSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
      const filtered = (this.currentTierProfiles || []).filter(p => {
        if (tokens.length === 0) return true;
        const target = [
          p.name, p.fullName, p.referenceCode, p.gotra, p.city, p.phone, p.role, p.profileType
        ].filter(Boolean).join(" ").toLowerCase();
        return tokens.every(tok => target.includes(tok));
      });
      this.renderTierProfilesList(filtered);
    });
  }

  // Wire filter chips
  const chipContainer = document.getElementById("tier-panel-filter-chips");
  if (chipContainer && !chipContainer._hasTierListener) {
    chipContainer._hasTierListener = true;
    chipContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".tier-filter-chip");
      if (btn) {
        chipContainer.querySelectorAll(".tier-filter-chip").forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");
        let list = this.currentTierProfiles || [];
        if (filter === "ACTIVE") list = list.filter(p => p.isActive !== false);
        if (filter === "PAID") list = list.filter(p => p.isPaid === true || p.paymentStatus === "PAID");
        if (filter === "FREE") list = list.filter(p => p.isPaid === false || p.paymentStatus === "FREE");
        this.renderTierProfilesList(list);
      }
    });
  }

  // Wire close buttons
  const closeBtn = document.getElementById("btn-close-tier-panel");
  if (closeBtn && !closeBtn._hasTierListener) {
    closeBtn._hasTierListener = true;
    closeBtn.addEventListener("click", () => this.closeTierProfilesPanel());
  }
  const collapseBtn = document.getElementById("btn-collapse-tier-panel");
  if (collapseBtn && !collapseBtn._hasTierListener) {
    collapseBtn._hasTierListener = true;
    collapseBtn.addEventListener("click", () => this.closeTierProfilesPanel());
  }
};

ProfileView.prototype.openTierProfilesPanel = function(tierKey, allProfiles, onSelectMember, onLoadWorkspace, onOpenTree) {
  if (!this.tierProfilesPanel) this.initTierProfilesPanel();
  if (!this.tierProfilesPanel) return;

  this.currentTierKey = tierKey;
  if (onLoadWorkspace) this.onLoadWorkspaceCb = onLoadWorkspace;
  if (onOpenTree) this.onOpenTreeCb = onOpenTree;

  const tierMetaMap = {
    MASTER: { icon: "👑", title: "Admin Master Profiles", badge: "Admin Master" },
    ADMIN: { icon: "👑", title: "Admin Master Profiles", badge: "Admin Master" },
    HEALER: { icon: "🌿", title: "Certified Healers Profiles", badge: "Healers" },
    TRAINEE: { icon: "🔥", title: "Trainee Sadhak Profiles", badge: "Trainees" },
    DEVOTEE: { icon: "🌟", title: "Tier 4 • Devotee (Sacred Sangha)", badge: "Devotees" }
  };

  const meta = tierMetaMap[tierKey] || { icon: "👑", title: tierKey + " Profiles", badge: tierKey };
  if (this.tierPanelIcon) this.tierPanelIcon.textContent = meta.icon;
  if (this.tierPanelTitle) this.tierPanelTitle.textContent = meta.title;

  // Filter profiles by tier
  this.currentTierProfiles = (allProfiles || []).filter(p => {
    const type = (p.profileType || p.role || "").toUpperCase();
    const lvl = parseInt(p.level, 10);
    if (tierKey === "MASTER" || tierKey === "ADMIN") return type === "ADMIN" || type === "MASTER" || lvl === 1 || lvl === 0;
    if (tierKey === "HEALER") return type === "HEALER" || lvl === 2;
    if (tierKey === "TRAINEE") return (type === "TRAINEE" || type === "SADHAK" || lvl === 3) && type !== "DEVOTEE";
    if (tierKey === "DEVOTEE") return type === "DEVOTEE" || type === "SEEKER" || lvl === 4 || lvl === 5 || (!lvl && type !== "ADMIN" && type !== "HEALER" && type !== "TRAINEE");
    return true;
  });

  if (this.tierPanelCount) {
    this.tierPanelCount.textContent = this.currentTierProfiles.length + " Member" + (this.currentTierProfiles.length !== 1 ? "s" : "");
  }

  // Highlight active metric tile
  document.querySelectorAll(".admin-metric-tile-card").forEach(c => c.classList.remove("tile-active-open"));
  const activeTile = document.querySelector('.admin-metric-tile-card[data-tier-filter="' + tierKey + '"]');
  if (activeTile) activeTile.classList.add("tile-active-open");

  // Synchronize active state on left sidebar legend item
  const tierNumMap = { MASTER: 1, ADMIN: 1, HEALER: 2, TRAINEE: 3, DEVOTEE: 4 };
  const tNum = tierNumMap[tierKey] || 1;
  this.currentOpenTier = tNum;
  document.querySelectorAll("#hierarchy-legend-container .legend-item").forEach(item => {
    const itTier = parseInt(item.getAttribute("data-tier"), 10);
    item.classList.toggle("active", itTier === tNum);
  });

  // Render left list (which automatically populates right pane with first member)
  this.renderTierProfilesList(this.currentTierProfiles);

  // Open panel with slide-down
  this.tierProfilesPanel.classList.add("is-open");
  this.tierProfilesPanel.style.display = "flex";
  this.tierProfilesPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

ProfileView.prototype.renderTierProfilesList = function(profiles) {
  if (!this.tierPanelProfilesList) this.tierPanelProfilesList = document.getElementById("tier-panel-profiles-list");
  if (!this.tierPanelProfilesList) return;
  const container = this.tierPanelProfilesList;
  container.innerHTML = "";

  if (!profiles || profiles.length === 0) {
    container.innerHTML = '<div style="padding: 1.2rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;"><span>🍃</span><p style="margin: 0.35rem 0 0 0;">No member profiles found in this tier.</p></div>';
    if (this.tierRightProfileDetails) {
      this.tierRightProfileDetails.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;"><span>👈</span><p>No profile data to display.</p></div>';
    }
    return;
  }

  const activeProfileId = (this.model && this.model.activeProfileId) || (profiles[0] ? profiles[0].id : null);

  profiles.forEach((prof, idx) => {
    const isActive = prof.id === activeProfileId || (idx === 0 && !profiles.some(p => p.id === activeProfileId));
    const initials = (prof.name || "SK")
      .split(" ")
      .map(w => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const isPaid = prof.isPaid !== false && prof.paymentStatus !== "FREE";

    const item = document.createElement("div");
    item.className = "tier-panel-profile-card tier-member-row-item " + (isActive ? "active" : "");
    item.setAttribute("data-id", prof.id);
    item.setAttribute("data-profile-id", prof.id);
    item.setAttribute("title", "Click to view metadata for " + (prof.name || "Member"));
    item.innerHTML = [
      '<div class="tier-card-avatar-wrap">',
      '  <div class="tier-card-avatar tier-item-avatar">',
      '    ' + initials,
      '    <span class="tier-card-avatar-dot tier-item-status-dot ' + (prof.isActive ? 'online' : 'offline') + '"></span>',
      '  </div>',
      '</div>',
      '<div class="tier-card-info tier-item-info">',
      '  <div class="tier-card-name-row">',
      '    <span class="tier-card-name tier-item-name">' + (prof.name || 'Member') + '</span>',
      '    <span class="tier-card-stamp ' + (isPaid ? 'stamp-paid' : 'stamp-free') + '">' + (isPaid ? 'PAID' : 'FREE') + '</span>',
      '  </div>',
      '  <div class="tier-card-ref-row">',
      '    <span class="tier-card-ref tier-item-sub">' + (prof.referenceCode || prof.city || 'Active Member') + '</span>',
      '    <span class="tier-card-level-badge">LVL ' + (prof.level || 1) + '</span>',
      '  </div>',
      '</div>'
    ].join("");

    item.addEventListener("click", () => {
      container.querySelectorAll(".tier-panel-profile-card, .tier-member-row-item").forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      this.renderTierProfileDetails(prof);
    });

    container.appendChild(item);
  });

  // Automatically display details of the first / active member in the right body pane
  const initialProf = profiles.find(p => p.id === activeProfileId) || profiles[0];
  this.renderTierProfileDetails(initialProf);
};

ProfileView.prototype.renderTierProfileDetails = function(prof) {
  if (!this.tierRightProfileDetails) this.tierRightProfileDetails = document.getElementById("tier-right-profile-details");
  if (!this.tierRightProfileDetails || !prof) return;

  const initials = (prof.name || "User")
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleName = prof.profileType || (prof.level === 2 ? "HEALER" : (prof.level === 3 ? "TRAINEE" : "DEVOTEE"));
  const sadhanaCount = Array.isArray(prof.selectedRemedies) ? prof.selectedRemedies.length : (Array.isArray(prof.interestedSadhanas) ? prof.interestedSadhanas.length : 0);
  const diyaCount = prof.dailyDiyaCount != null ? prof.dailyDiyaCount : (prof.diyaCount != null ? prof.diyaCount : 0);
  const cleanLevel = prof.houseCleanLevel != null ? prof.houseCleanLevel : (prof.level || 1);

  this.tierRightProfileDetails.innerHTML = [
    '<div class="tier-details-card-inner">',
    '  <!-- Top Profile Banner -->',
    '  <div class="tier-details-header">',
    '    <div class="tier-details-avatar">' + initials + '</div>',
    '    <div class="tier-details-title-block">',
    '      <div class="tier-details-name-row">',
    '        <h4 class="tier-details-name">' + (prof.name || 'Member Profile') + '</h4>',
    '        <span class="tier-details-role-pill">TIER ' + (prof.level || 2) + ' &bull; ' + roleName + '</span>',
    '        <span class="tier-details-active-pill">🟢 Active</span>',
    '      </div>',
    '      <span class="tier-details-ref-code">Ref: <code>' + (prof.referenceCode || 'SKHM-NODE-0000') + '</code></span>',
    '    </div>',
    '    <div class="tier-details-actions">',
    '      <button type="button" class="btn-tier-action btn-tier-load" id="btn-tier-load-workspace" title="Load this member profile into active workspace">',
    '        <span>👤</span> Load Workspace',
    '      </button>',
    '      <button type="button" class="btn-tier-action btn-tier-tree" id="btn-tier-view-tree" title="View in Visual Genealogy Tree">',
    '        <span>🌳</span> View in Tree',
    '      </button>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- 8-Point Metadata Grid -->',
    '  <div class="tier-metadata-grid">',
    '    <div class="tier-meta-cell">',
    '      <span class="meta-cell-label">📍 Location:</span>',
    '      <span class="meta-cell-value">' + (prof.city || prof.address || 'Sansthan Central') + '</span>',
    '    </div>',
    '    <div class="tier-meta-cell">',
    '      <span class="meta-cell-label">📱 Contact:</span>',
    '      <span class="meta-cell-value">' + (prof.phone || 'Protected') + '</span>',
    '    </div>',
    '    <div class="tier-meta-cell">',
    '      <span class="meta-cell-label">📅 Joining Date:</span>',
    '      <span class="meta-cell-value">' + (prof.joinDate || '2024-01-01') + '</span>',
    '    </div>',
    '    <div class="tier-meta-cell">',
    '      <span class="meta-cell-label">🔗 Upline Mentor:</span>',
    '      <span class="meta-cell-value">' + (prof.referredByCode || 'ROOT-MASTER') + '</span>',
    '    </div>',
    '    <div class="tier-meta-cell">',
    '      <span class="meta-cell-label">🪔 Daily Diya:</span>',
    '      <span class="meta-cell-value" style="color:#10b981; font-weight:700;">' + diyaCount + ' Days Active</span>',
    '    </div>',
    '    <div class="tier-meta-cell">',
    '      <span class="meta-cell-label">🧹 House Clean:</span>',
    '      <span class="meta-cell-value" style="color:var(--gold-400, #d4af37); font-weight:700;">Level ' + cleanLevel + '</span>',
    '    </div>',
    '    <div class="tier-meta-cell">',
    '      <span class="meta-cell-label">📿 Sadhanas:</span>',
    '      <span class="meta-cell-value" style="color:#3b82f6; font-weight:700;">' + sadhanaCount + ' Enrolled</span>',
    '    </div>',
    '    <div class="tier-meta-cell">',
    '      <span class="meta-cell-label">🔒 Telemetry:</span>',
    '      <span class="meta-cell-value" style="color:#10b981;">ISO Certified Sync</span>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n");

  // Wire buttons
  const loadBtn = this.tierRightProfileDetails.querySelector("#btn-tier-load-workspace");
  if (loadBtn && typeof this.onLoadWorkspaceCb === "function") {
    loadBtn.addEventListener("click", () => this.onLoadWorkspaceCb(prof.id));
  }

  const treeBtn = this.tierRightProfileDetails.querySelector("#btn-tier-view-tree");
  if (treeBtn && typeof this.onOpenTreeCb === "function") {
    treeBtn.addEventListener("click", () => this.onOpenTreeCb(this.currentTierKey));
  }
};

ProfileView.prototype.closeTierProfilesPanel = function() {
  if (this.tierProfilesPanel) {
    this.tierProfilesPanel.classList.remove("is-open");
    this.tierProfilesPanel.style.display = "none";
  }
  this.currentTierKey = null;
  this.currentOpenTier = null;
  document.querySelectorAll(".admin-metric-tile-card").forEach(c => c.classList.remove("tile-active-open"));
  document.querySelectorAll("#hierarchy-legend-container .legend-item").forEach(item => item.classList.remove("active"));
};



// ==============================================================
// ENTERPRISE UI/UX COMPONENT SUITE METHODS (Antigravity Standards)
// ==============================================================

/**
 * Bottom-Right Slide-in/out Toast Notification
 * @param {Object} options - { title, message, type, duration, actionText, onAction }
 */
ProfileView.prototype.showBottomRightToast = function(options = {}) {
  const {
    title = "Notice",
    message = "",
    type = "info",
    duration = 4000,
    actionText = null,
    onAction = null
  } = typeof options === "string" ? { message: options } : options;

  if (typeof document === "undefined") return;

  let container = document.getElementById("slide-toast-container-br");
  if (!container) {
    container = document.createElement("div");
    container.id = "slide-toast-container-br";
    container.className = "slide-toast-container-br";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-slide-bottom-right toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌"
  };
  const icon = icons[type] || "🔔";

  let actionsHtml = "";
  if (actionText && typeof onAction === "function") {
    actionsHtml = `
      <div class="toast-br-actions">
        <button type="button" class="btn btn-xs btn-gold toast-br-action-btn">${actionText}</button>
      </div>
    `;
  }

  toast.innerHTML = `
    <div class="toast-br-header">
      <div class="toast-br-title-wrap">
        <span>${icon}</span>
        <span>${title}</span>
      </div>
      <button type="button" class="toast-br-close" aria-label="Dismiss">&times;</button>
    </div>
    <div class="toast-br-body">${message}</div>
    ${actionsHtml}
    <div class="toast-br-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  // Dismiss logic
  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    toast.classList.add("is-closing");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 320);
  };

  const closeBtn = toast.querySelector(".toast-br-close");
  if (closeBtn) closeBtn.addEventListener("click", dismiss);

  if (actionText && typeof onAction === "function") {
    const actBtn = toast.querySelector(".toast-br-action-btn");
    if (actBtn) {
      actBtn.addEventListener("click", () => {
        try { onAction(); } catch (e) { console.error(e); }
        dismiss();
      });
    }
  }

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }

  return toast;
};

// Preserve backward-compatibility for legacy calls to showSlideToast
ProfileView.prototype.showSlideToast = function(title, message, type = "info", duration = 3000) {
  if (typeof title === "object" && title !== null) {
    return this.showBottomRightToast(title);
  }
  return this.showBottomRightToast({ title, message, type, duration });
};

/**
 * Multi-Option Decision Modal (HITL Governance Dialog)
 * @param {Object} options - { title, subtitle, message, options: Array, onAction: Function }
 */
ProfileView.prototype.showMultiOptionDialog = function(options = {}) {
  if (typeof document === "undefined") return Promise.resolve(null);

  return new Promise((resolve) => {
    const modal = document.getElementById("modal-multi-option-decision");
    if (!modal) {
      console.warn("Modal #modal-multi-option-decision not found in DOM");
      return resolve(null);
    }

    const titleEl = document.getElementById("multi-dialog-title");
    const subtitleEl = document.getElementById("multi-dialog-subtitle");
    const messageEl = document.getElementById("multi-dialog-message");
    const optionsContainer = document.getElementById("multi-dialog-options-container");

    if (titleEl && options.title) titleEl.textContent = options.title;
    if (subtitleEl && options.subtitle) subtitleEl.textContent = options.subtitle;
    if (messageEl && options.message) messageEl.textContent = options.message;

    // If custom action options provided, render them dynamically
    if (optionsContainer && Array.isArray(options.options) && options.options.length > 0) {
      optionsContainer.innerHTML = options.options.map(opt => `
        <div class="multi-option-card" data-decision="${opt.id || opt.decision || 'SELECT'}">
          <div class="multi-option-card-left">
            <span class="multi-option-card-icon" style="color: ${opt.color || 'var(--gold-400)'};">${opt.icon || '⚖️'}</span>
            <div>
              <div class="multi-option-card-title" style="color: ${opt.color || '#fff'};">${opt.title}</div>
              <div class="multi-option-card-desc">${opt.desc || opt.description || ''}</div>
            </div>
          </div>
          <span style="font-size: 0.75rem; color: ${opt.color || 'var(--gold-400)'};">Select &rsaquo;</span>
        </div>
      `).join("");
    }

    const cleanup = () => {
      modal.style.display = "none";
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    };

    const handleSelect = (decision) => {
      cleanup();
      if (typeof options.onAction === "function") {
        try { options.onAction(decision); } catch (e) { console.error(e); }
      }
      resolve(decision);
    };

    // Bind cards
    const cards = modal.querySelectorAll(".multi-option-card");
    cards.forEach(card => {
      card.onclick = () => {
        const dec = card.getAttribute("data-decision") || "APPROVE";
        handleSelect(dec);
      };
    });

    // Close button
    const closeBtns = modal.querySelectorAll("[data-close-modal='modal-multi-option-decision'], .modal-close");
    closeBtns.forEach(btn => {
      btn.onclick = () => {
        cleanup();
        resolve(null);
      };
    });

    modal.style.display = "flex";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
};

/**
 * Segmented View Mode Toggle: Grid Cards vs List
 * @param {string} mode - 'GRID' | 'LIST'
 */
ProfileView.prototype.setViewMode = function(mode = "GRID") {
  const normMode = mode.toUpperCase();
  this.viewMode = normMode;

  const btnGrid = document.getElementById("btn-toggle-grid");
  const btnList = document.getElementById("btn-toggle-list");
  if (btnGrid && btnList) {
    btnGrid.classList.toggle("active", normMode === "GRID");
    btnList.classList.toggle("active", normMode === "LIST");
  }

  const listContainer = document.getElementById("tier-panel-profiles-list");
  if (listContainer) {
    listContainer.setAttribute("data-view-mode", normMode);
    listContainer.classList.toggle("view-mode-grid", normMode === "GRID");
    listContainer.classList.toggle("view-mode-list", normMode === "LIST");
  }

  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("sk_view_mode", normMode);
    }
  } catch (e) {}
};

/**
 * 3D Card Flipper trigger for Selected Member Card
 * @param {boolean} [isFlipped]
 */
ProfileView.prototype.flipSelectedMemberCard = function(isFlipped) {
  const card = document.getElementById("selected-member-profile-card") || this.selectedMemberCard;
  if (!card) return;

  if (typeof isFlipped === "boolean") {
    card.classList.toggle("is-flipped", isFlipped);
  } else {
    card.classList.toggle("is-flipped");
  }

  const flippedNow = card.classList.contains("is-flipped");
  this.showBottomRightToast({
    title: flippedNow ? "3D Sadhana & Telemetry" : "Member Identity Card",
    message: flippedNow
      ? "Viewing Sadhana streak, daily target malas, and live telemetry."
      : "Viewing member name, Gotra, and contact metadata.",
    type: "info",
    duration: 2500
  });
};

/**
 * Rich Searchable Dropdown List Box Population
 * @param {Array} profiles
 * @param {Function} onSelect
 */
ProfileView.prototype.populateDevoteeDropdown = function(profiles = [], onSelect = null) {
  const dropdownMenu = document.getElementById("dropdown-devotee-menu");
  const itemsContainer = document.getElementById("dropdown-devotee-items-list");
  const filterInput = document.getElementById("input-dropdown-filter");
  const labelEl = document.getElementById("picker-selected-label");

  if (!itemsContainer) return;

  const renderItems = (filteredList) => {
    if (!filteredList || filteredList.length === 0) {
      itemsContainer.innerHTML = '<div style="padding: 0.6rem; text-align: center; color: var(--text-muted); font-size: 0.75rem;">No members match filter</div>';
      return;
    }

    itemsContainer.innerHTML = filteredList.map(prof => {
      const initials = (prof.name || "DK")
        .split(" ")
        .map(w => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return `
        <div class="rich-select-item" data-profile-id="${prof.id}" tabindex="0">
          <div class="rich-select-item-avatar">${initials}</div>
          <div class="rich-select-item-content">
            <div class="rich-select-item-title">${prof.name || 'Member'}</div>
            <div class="rich-select-item-sub">${prof.referenceCode || prof.city || 'Devotee'} &bull; Tier ${prof.level || 4}</div>
          </div>
        </div>
      `;
    }).join("");

    itemsContainer.querySelectorAll(".rich-select-item").forEach(item => {
      item.onclick = () => {
        const id = item.getAttribute("data-profile-id");
        const selected = profiles.find(p => p.id === id);
        if (selected) {
          if (labelEl) labelEl.textContent = selected.name;
          const dropdownWrap = document.getElementById("dropdown-devotee-picker");
          if (dropdownWrap) dropdownWrap.classList.remove("is-open");
          if (typeof onSelect === "function") onSelect(selected);
        }
      };
    });
  };

  renderItems(profiles);

  if (filterInput) {
    filterInput.oninput = () => {
      const q = filterInput.value.toLowerCase().trim();
      const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
      const filtered = profiles.filter((p) => {
        if (tokens.length === 0) return true;
        const target = [
          p.name, p.fullName, p.referenceCode, p.city, p.phone, p.gotra, p.role, p.profileType
        ].filter(Boolean).join(" ").toLowerCase();
        return tokens.every((tok) => target.includes(tok));
      });
      renderItems(filtered);
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfileView;
}
if (typeof window !== 'undefined') {
  window.ProfileView = ProfileView;
}
