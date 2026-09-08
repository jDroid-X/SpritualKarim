/**
 * ProfileView.js
 * Master 4-Tier OOPS-based MVC View Layer for Spiritual Karim
 */
class ProfileView {
  constructor() {

    // Firebase Realtime Database Table Drill-down State
    this.rtdbExpandedPaths = new Set([
      'profiles', 
      'authorisedNodes', 
      'sadhana_catalog', 
      'device_telemetry', 
      'pairing_invites', 
      'system_config', 
      'lineage_graph', 
      'logs'
    ]);
    this.rtdbActiveRootFilter = 'ALL';
    this.rtdbSearchQuery = '';
    this.rtdbActiveBreadcrumbPath = '/';


    this.form = document.getElementById('profile-admin-form');
    this.selectActiveProfile = document.getElementById('select-active-profile');
    this.profileDirectoryList = document.getElementById('profile-directory-list');
    this.inputDirectorySearch = document.getElementById('input-directory-search');
    this.directorySearchQuery = '';

    // Role Switcher & RBAC Controls
    this.selectRoleMode = document.getElementById('select-role-mode');
    this.btnAdminSettings = document.getElementById('btn-admin-settings') || document.getElementById('sidebar-btn-admin-settings');
    this.adminSettingsModal = document.getElementById('admin-settings-modal');

    // Header Display Elements
    this.displayProfileName = document.getElementById('display-profile-name');
    this.displayRoleBadge = document.getElementById('display-role-badge');
    this.displayStatusPill = document.getElementById('display-status-pill');
    this.displayPaymentStamp = document.getElementById('display-payment-stamp');
    this.displayRefCode = document.getElementById('display-ref-code');
    this.displaySponsorCode = document.getElementById('display-sponsor-code');
    this.avatarInitials = document.getElementById('profile-avatar-initials');

    // Form Inputs - Identity
    this.inputProfileType = document.getElementById('input-profile-type');
    this.inputLevel = document.getElementById('input-level');
    this.inputCategoryTag = document.getElementById('input-category-tag');
    this.inputRefCode = document.getElementById('input-ref-code');
    this.inputSponsorCode = document.getElementById('input-sponsor-code');
    this.inputTransferCode = document.getElementById('input-transfer-code');
    this.inputIsActive = document.getElementById('input-is-active');
    this.inputPaymentStatus = document.getElementById('input-payment-status');
    this.inputJoinDate = document.getElementById('input-join-date');

    this.inputName = document.getElementById('input-name');
    this.inputSelfTitle = document.getElementById('input-self-title');
    this.inputPhone = document.getElementById('input-phone');
    this.inputEmail = document.getElementById('input-email');
    this.inputCity = document.getElementById('input-city');
    this.inputAddress = document.getElementById('input-address');
    this.inputNotes = document.getElementById('input-notes');

    // Seeker Purpose Inputs
    this.inputObjective = document.getElementById('input-objective');
    this.seekerAfflictionDuration = document.getElementById('seeker-affliction-duration');
    this.seekerKuldeviIssues = document.getElementById('seeker-kuldevi-issues');
    this.seekerTargetOutcome = document.getElementById('seeker-target-outcome');

    // Lineage Inputs
    this.lineageSelfName = document.getElementById('lineage-self-name');
    this.lineageSpouseName = document.getElementById('lineage-spouse-name');

    this.hFatherName = document.getElementById('h-father-name');
    this.hMotherName = document.getElementById('h-mother-name');
    this.hPaternalGf = document.getElementById('h-paternal-gf');
    this.hPaternalGm = document.getElementById('h-paternal-gm');
    this.hMaternalGf = document.getElementById('h-maternal-gf');
    this.hMaternalGm = document.getElementById('h-maternal-gm');
    this.hAddress = document.getElementById('h-address');

    this.wFatherName = document.getElementById('w-father-name');
    this.wMotherName = document.getElementById('w-mother-name');
    this.wPaternalGf = document.getElementById('w-paternal-gf');
    this.wPaternalGm = document.getElementById('w-paternal-gm');
    this.wMaternalGf = document.getElementById('w-maternal-gf');
    this.wMaternalGm = document.getElementById('w-maternal-gm');
    this.wAddress = document.getElementById('w-address');

    // Dynamic Containers
    this.childrenContainer = document.getElementById('children-list-container');
    this.siblingsCurrentContainer = document.getElementById('siblings-current-container');
    this.siblingsHusbandContainer = document.getElementById('siblings-husband-container');
    this.siblingsWifeContainer = document.getElementById('siblings-wife-container');

    this.devoteeHouseCleanContainer = document.getElementById('devotee-houseclean-container');
    this.seekerHouseCleanSummaryContainer = document.getElementById('seeker-houseclean-summary-container');
    this.interestedSadhanasContainer = document.getElementById('interested-sadhanas-container');
    
    // Categorized Trainee Containers & Active Detail Panel
    this.traineeGroupSadhanas = document.getElementById('trainee-sadhanas-group-sadhanas');
    this.traineeGroupRemedies = document.getElementById('trainee-sadhanas-group-remedies');
    this.traineeGroupCleansing = document.getElementById('trainee-sadhanas-group-cleansing');
    this.traineeActiveDetailContainer = document.getElementById('trainee-active-sadhana-detail');
    this.selectedTraineeId = null;

    this.healerCompletedSadhanasContainer = document.getElementById('healer-completed-sadhanas-container');
    this.healerNetworkContainer = document.getElementById('healer-network-container');

    // Slide-out Drawer & Modals
    this.sadhanaDrawer = document.getElementById('sadhana-detail-drawer');
    this.sadhanaDrawerBackdrop = document.getElementById('sadhana-drawer-backdrop');
    this.sadhanaDrawerTitle = document.getElementById('sadhana-drawer-title');
    this.sadhanaDrawerCategory = document.getElementById('sadhana-drawer-category');
    this.sadhanaDrawerIcon = document.getElementById('sadhana-drawer-icon');
    this.sadhanaDrawerBody = document.getElementById('sadhana-drawer-body');
    this.btnDrawerEnroll = document.getElementById('btn-drawer-enroll');
    this.btnDrawerSendTrainee = document.getElementById('btn-drawer-send-trainee');

    this.goliGyanModal = document.getElementById('goli-gyan-modal');
    this.jsonDrawer = document.getElementById('json-drawer');
    this.jsonDrawerBackdrop = document.getElementById('json-drawer-backdrop');
    this.jsonPreviewCode = document.getElementById('json-preview-code');
    this.importModal = document.getElementById('import-modal');
    this.toastEl = document.getElementById('admin-toast');

    // In-Body App Hierarchy Tree & Genealogy Canvas (Tab 5)
    this.tabGenealogyTree = document.getElementById('tab-genealogy-tree');
    this.mainTabTreeBtn = document.getElementById('main-tab-tree-btn');
    this.bodyTreeCanvasViewport = document.getElementById('body-tree-canvas-viewport');
    this.bodyTreeSurface = document.getElementById('body-tree-surface');
    this.bodySpiderwebSvgLayer = document.getElementById('body-spiderweb-svg-layer');
    this.bodySpiderwebNodesLayer = document.getElementById('body-spiderweb-nodes-layer');
    this.btnBodySmartFit = document.getElementById('btn-body-smart-fit');
    this.btnBodyZoomIn = document.getElementById('btn-body-zoom-in');
    this.btnBodyZoomOut = document.getElementById('btn-body-zoom-out');
    this.btnBodyZoomReset = document.getElementById('btn-body-zoom-reset');
    this.btnBodyFullscreen = document.getElementById('btn-body-fullscreen');
    this.bodyTreeSearchInput = document.getElementById('body-tree-search-input');
    this.treePanState = { panX: 0, panY: 0, scale: 1.0, isDragging: false, startX: 0, startY: 0 };
    this.inBodyTreePanState = { panX: 0, panY: 0, scale: 1.0, isDragging: false, startX: 0, startY: 0, layoutMode: 'cluster' };
    this.sharePairingModalBody = document.getElementById('share-pairing-modal-body');

    // Settings Modal Elements & Controls
    this.btnAdminSettings = document.getElementById('btn-admin-settings') || document.getElementById('sidebar-btn-admin-settings');
    this.adminSettingsModal = document.getElementById('admin-settings-modal');
    this.btnCloseAdminSettings = document.getElementById('btn-close-settings-modal') || document.getElementById('btn-close-admin-settings') || document.querySelector('#admin-settings-modal .icon-btn');
    this.btnSaveSettings = document.getElementById('btn-save-settings');
    this.btnResetSettings = document.getElementById('btn-reset-settings');

    this.settingDefaultMentorName = document.getElementById('setting-default-mentor-name');
    this.settingDefaultMentorCode = document.getElementById('setting-default-mentor-code');
    this.settingSpeechLang = document.getElementById('setting-speech-lang');
    this.settingDefaultTargetMalas = document.getElementById('setting-default-target-malas');
    this.settingDevoteeCanDelete = document.getElementById('setting-devotee-can-delete') || document.getElementById('setting-allow-devotee-delete');
    this.settingDevoteeCanEditLineage = document.getElementById('setting-devotee-can-edit-lineage');
    this.settingDevoteeCanEnroll = document.getElementById('setting-devotee-can-enroll');
    this.settingHealerStrictTeam = document.getElementById('setting-healer-strict-team') || document.getElementById('setting-healer-team-view');
    this.settingHealerCanCertify = document.getElementById('setting-healer-can-certify');
    this.settingHealerCanDeleteTeam = document.getElementById('setting-healer-can-delete-team');
    this.settingFirebaseUrl = document.getElementById('setting-firebase-url');
    this.settingDefaultRoleMode = document.getElementById('setting-default-role-mode');
    this.settingAutoSave = document.getElementById('setting-auto-save') || document.getElementById('setting-live-sync');

  
    // Left Flyout Tier Profiles Panel Elements
    this.tierProfilesPanel = document.getElementById('tier-profiles-panel');
    this.tierPanelTitle = document.getElementById('tier-panel-title');
    this.tierPanelIcon = document.getElementById('tier-panel-icon');
    this.tierPanelCount = document.getElementById('tier-panel-count');
    this.tierPanelProfilesList = document.getElementById('tier-panel-profiles-list');
    this.inputTierPanelSearch = document.getElementById('input-tier-panel-search');
    this.btnCloseTierPanel = document.getElementById('btn-close-tier-panel');
    this.currentOpenTier = null;
    this.currentTierProfiles = [];
  
  }

  render(profile, visibleProfiles, roleMode, settings) {
    this.populateSettings(settings);
    this._renderRoleSelector(roleMode);
    this.updateLegendCounts(this.allProfiles || visibleProfiles);
    this._renderDropdown(profile, visibleProfiles);
    this._renderDirectory(profile, visibleProfiles);
    this._renderHeaderCard(profile, roleMode);
    this._populateForm(profile);
    
    // Lineage Dynamic Units
    this._renderChildren(profile.lineage?.currentFamily?.children || []);
    this._renderSiblings(this.siblingsCurrentContainer, profile.lineage?.currentFamily?.siblings || [], 'current');
    this._renderSiblings(this.siblingsHusbandContainer, profile.lineage?.husbandAncestral?.siblings || [], 'husband');
    this._renderSiblings(this.siblingsWifeContainer, profile.lineage?.wifeAncestral?.siblings || [], 'wife');

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
    const activeFilter = this.bodyTreeTierFilter ? this.bodyTreeTierFilter.value : 'ALL';
    const tier = activeFilter === 'ALL' ? null : parseInt(activeFilter, 10);
    const query = this.bodyTreeSearchInput ? this.bodyTreeSearchInput.value : '';
    const mode = this.inBodyTreePanState?.layoutMode || 'cluster';
    this.renderInBodyHierarchyTree(treeProfiles, tier, query, mode);

    // JSON Live Inspector
    this.renderAndroidHierarchyTree(treeProfiles, this.hierarchySelectedLevel || 'ALL', profile);
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
    this.selectActiveProfile.innerHTML = visibleProfiles.map(p => `
      <option value="${p.id}" ${p.id === activeProfile.id ? 'selected' : ''}>
        ${p.name} (${p.profileType} • Level ${p.level})
      </option>
    `).join('');
  }

  _renderDirectory(activeProfile, visibleProfiles) {
    if (!this.profileDirectoryList) return;

    const tiers = [
      {
        tierNumber: 1,
        title: 'Tier 1: Admin Master (Founder)',
        icon: '👑',
        badgeBg: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8b5cf6',
        filter: (p) => p.profileType === 'ADMIN' || p.level === 1
      },
      {
        tierNumber: 2,
        title: 'Tier 2: Certified Healers & Gurus',
        icon: '🛡️',
        badgeBg: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        filter: (p) => p.profileType === 'HEALER' && p.level === 2
      },
      {
        tierNumber: 3,
        title: 'Tier 3: Healers In-Progress / Siddhi',
        icon: '✨',
        badgeBg: 'rgba(236, 72, 153, 0.2)',
        borderColor: '#ec4899',
        filter: (p) => p.profileType === 'HEALER' && p.level === 3
      },
      {
        tierNumber: 4,
        title: 'Tier 4: Trainee Sadhaks',
        icon: '🌿',
        badgeBg: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        filter: (p) => p.profileType === 'TRAINEE' || p.level === 4
      },
      {
        tierNumber: 5,
        title: 'Tier 5: Devotees & Seekers',
        icon: '🌟',
        badgeBg: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        filter: (p) => p.profileType === 'DEVOTEE' || p.level === 5 || (!p.level && p.profileType !== 'ADMIN' && p.profileType !== 'HEALER' && p.profileType !== 'TRAINEE')
      }
    ];

    let html = '';

    tiers.forEach(tier => {
      const tierProfiles = visibleProfiles.filter(tier.filter);
      if (tierProfiles.length === 0) return;

      const itemsHtml = tierProfiles.map(p => {
        const isActive = p.id === activeProfile.id;
        const initials = (p.name || 'SK')
          .split(' ')
          .map(w => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
        
        const isPaid = p.isPaid !== false && p.paymentStatus !== 'FREE';

        return `
          <div class="profile-item-row ${isActive ? 'active' : ''}" data-id="${p.id}" title="Click to view & edit details for ${p.name}">
            <div class="profile-item-avatar-col">
              <div class="profile-item-avatar" style="border-color: ${tier.borderColor};">
                ${initials}
                <span class="profile-status-dot ${p.isActive ? 'online' : 'offline'}"></span>
              </div>
            </div>
            <div class="profile-item-info-col">
              <div class="profile-item-name-row">
                <span class="profile-item-name">${p.name}</span>
                <span class="profile-mini-stamp ${isPaid ? 'stamp-paid' : 'stamp-free'}">${isPaid ? 'PAID' : 'FREE'}</span>
              </div>
              <div class="profile-item-sub-row">
                <span class="profile-item-sub">${p.referenceCode}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

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

  _renderHeaderCard(profile, roleMode = 'MASTER') {
    const mainBox = document.getElementById('main-profile-box-1');
    const isPaid = profile.isPaid !== false && profile.paymentStatus !== 'FREE';
    const initials = (profile.name || 'SK')
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const roleColors = {
      ADMIN: 'var(--role-admin, #8b5cf6)',
      HEALER: 'var(--role-healer, #10b981)',
      TRAINEE: 'var(--role-trainee, #f59e0b)',
      DEVOTEE: 'var(--role-devotee, #3b82f6)'
    };
    const roleBg = roleColors[profile.profileType] || 'var(--role-admin, #8b5cf6)';

    if (mainBox) {
      let flipperWrapper = mainBox.querySelector('.card-flipper-3d-wrapper');
      if (!flipperWrapper) {
        mainBox.innerHTML = `
          <div class="card-flipper-3d-wrapper" id="profile-card-flipper-wrapper">
            <div class="card-flipper-inner" id="profile-card-flipper-inner">
              <!-- FRONT FACE -->
              <div class="card-flipper-front" style="padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-lg);">
                <div class="card-header-flex" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <div class="user-avatar-block" style="display: flex; align-items: center; gap: 1rem;">
                    <div class="avatar-circle" id="profile-avatar-initials">${initials}</div>
                    <div>
                      <h2 class="profile-name-title" id="display-profile-name" style="margin: 0 0 0.35rem 0;">${profile.name || 'Untitled Profile'}</h2>
                      <div class="profile-role-badge-row" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span class="role-badge" id="display-role-badge" style="background-color: ${roleBg};">${profile.profileType} • LEVEL ${profile.level || 1}</span>
                        <span class="status-pill ${profile.isActive ? 'active' : ''}" id="display-status-pill">${profile.isActive ? 'Active Member' : 'Inactive'}</span>
                        <span class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'}" id="display-payment-stamp" title="Click to toggle Paid (Green) / Free (Red)">${isPaid ? 'PAID' : 'FREE'}</span>
                      </div>
                    </div>
                  </div>
                  <div class="header-card-actions-row" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" class="btn btn-xs btn-outline" id="btn-copy-header-ref-code" title="Copy 16-Digit Code" style="font-family: monospace; font-size: 0.78rem;">
                      📋 <span id="header-ref-code-text">${profile.referenceCode || 'SKHM-XXXX-XXXX-XXXX'}</span>
                    </button>
                    <button type="button" class="btn-flip-card-trigger" id="btn-flip-to-back" title="Flip to 24h Pairing &amp; Node Telemetry">
                      🔄 QR &amp; Telemetry
                    </button>
                  </div>

                  <!-- 3rd Column: Top Right Genealogy Tab Button -->
                  <div class="header-col-genealogy-tab">
                    <button type="button" class="main-tab-btn header-genealogy-tab-btn" data-main-tab="tab-genealogy-tree" id="main-tab-tree-btn" title="Open Organization Hierarchy &amp; Genealogy Spiderweb Tree">
                      <span class="tab-icon">🌳</span>
                      <div class="tab-label-wrap">
                        <span class="tab-main-title">Genealogy Tree</span>
                        <span class="tab-sub-title">Visual MLM &bull; Spiderweb Canvas</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- BACK FACE -->
              <div class="card-flipper-back flipper-back-content">
                <div class="flipper-back-header">
                  <div class="flipper-back-title">
                    <span>📡</span> Node Telemetry &amp; 24h Device Pairing
                  </div>
                  <button type="button" class="btn-flip-card-trigger" id="btn-flip-to-front" title="Flip back to Profile Card">
                    🔄 View Profile
                  </button>
                </div>
                <div class="telemetry-grid">
                  <div class="telemetry-item">
                    <div class="telemetry-item-label">Node Reference</div>
                    <div class="telemetry-item-val" id="telemetry-ref-code">${profile.referenceCode || 'SKHM-XXXX-XXXX-XXXX'}</div>
                  </div>
                  <div class="telemetry-item">
                    <div class="telemetry-item-label">Upline Sponsor</div>
                    <div class="telemetry-item-val">${profile.referredByCode || 'ROOT'}</div>
                  </div>
                  <div class="telemetry-item">
                    <div class="telemetry-item-label">Cloud Telemetry</div>
                    <div class="telemetry-item-val" style="color: #10b981;">🟢 RTDB CONNECTED</div>
                  </div>
                  <div class="telemetry-item">
                    <div class="telemetry-item-label">Device Protocol</div>
                    <div class="telemetry-item-val">v3.8 (REST+WSS)</div>
                  </div>
                </div>
                <div class="telemetry-qr-section">
                  <div class="telemetry-qr-box">
                    <svg viewBox="0 0 100 100" width="60" height="60">
                      <rect width="100" height="100" fill="white"/>
                      <path d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z M20 20h10v10h-10z M70 20h10v10h-10z M20 70h10v10h-10z M50 20h5v15h-5z M50 50h30v5h-30z M60 65h10v10h-10z M80 75h10v15h-10z" fill="#1e1b4b"/>
                    </svg>
                  </div>
                  <div class="telemetry-qr-text">
                    <strong>24-Hour QR Device Pairing Protocol</strong><br/>
                    Scan from Spiritual Karim Android App to link this node securely to your hierarchy downline.
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        const pName = mainBox.querySelector('#display-profile-name');
        if (pName) pName.textContent = profile.name || 'Untitled Profile';
        const pBadge = mainBox.querySelector('#display-role-badge');
        if (pBadge) {
          pBadge.textContent = `${profile.profileType} • LEVEL ${profile.level || 1}`;
          pBadge.style.backgroundColor = roleBg;
        }
        const pStatus = mainBox.querySelector('#display-status-pill');
        if (pStatus) {
          pStatus.textContent = profile.isActive ? 'Active Member' : 'Inactive';
          pStatus.className = `status-pill ${profile.isActive ? 'active' : ''}`;
        }
        const pStamp = mainBox.querySelector('#display-payment-stamp');
        if (pStamp) {
          pStamp.className = `stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'}`;
          pStamp.textContent = isPaid ? 'PAID' : 'FREE';
        }
        const pInitials = mainBox.querySelector('#profile-avatar-initials');
        if (pInitials) pInitials.textContent = initials;
        const pRef = mainBox.querySelector('#header-ref-code-text');
        if (pRef) pRef.textContent = profile.referenceCode || 'SKHM-XXXX-XXXX-XXXX';
        const tRef = mainBox.querySelector('#telemetry-ref-code');
        if (tRef) tRef.textContent = profile.referenceCode || 'SKHM-XXXX-XXXX-XXXX';
      }
    }

    if (this.headerStampBadge) {
      this.headerStampBadge.className = `stamp-badge ${isPaid ? 'stamp-paid' : 'stamp-free'}`;
      this.headerStampBadge.textContent = isPaid ? '🟢 PAID' : '🔴 FREE';
      this.headerStampBadge.title = `Active Membership: ${isPaid ? 'PAID' : 'FREE'}`;
    }
  }

  _populateForm(profile) {
    if (this.inputProfileType) this.inputProfileType.value = profile.profileType || 'DEVOTEE';
    if (this.inputLevel) this.inputLevel.value = profile.level || 5;
    if (this.inputCategoryTag) this.inputCategoryTag.value = profile.categoryTag || '';
    if (this.inputRefCode) this.inputRefCode.value = profile.referenceCode || '';
    if (this.inputSponsorCode) this.inputSponsorCode.value = profile.referredByCode || '';
    if (this.inputTransferCode) this.inputTransferCode.value = profile.transferredCode || '';
    if (this.inputIsActive) this.inputIsActive.checked = profile.isActive !== false;
    
    const isPaid = profile.isPaid !== false && profile.paymentStatus !== 'FREE';
    if (this.inputPaymentStatus) {
      this.inputPaymentStatus.value = isPaid ? 'PAID' : 'FREE';
    }
    if (this.inputJoinDate) this.inputJoinDate.value = profile.joinDate || '';

    if (this.inputName) this.inputName.value = profile.name || '';
    if (this.inputSelfTitle) this.inputSelfTitle.value = profile.lineage?.currentFamily?.selfTitle || '';
    if (this.inputPhone) this.inputPhone.value = profile.phone || '';
    if (this.inputEmail) this.inputEmail.value = profile.email || '';
    if (this.inputCity) this.inputCity.value = profile.city || '';
    if (this.inputAddress) this.inputAddress.value = profile.address || '';
    if (this.inputNotes) this.inputNotes.value = profile.notes || '';

    if (this.inputObjective) this.inputObjective.value = profile.objective || '';
    if (this.seekerAfflictionDuration) this.seekerAfflictionDuration.value = profile.seekerDiagnostics?.afflictionDuration || '';
    if (this.seekerKuldeviIssues) this.seekerKuldeviIssues.value = profile.seekerDiagnostics?.kuldeviIssues || '';
    if (this.seekerTargetOutcome) this.seekerTargetOutcome.value = profile.seekerDiagnostics?.targetOutcome || '';

    // Checkboxes
    const selected = new Set(profile.selectedRemedies || []);
    document.querySelectorAll('input[name="remedy-checkbox"]').forEach(cb => {
      cb.checked = selected.has(cb.value);
    });

    // Lineage Self / Spouse
    if (this.lineageSelfName) this.lineageSelfName.value = profile.lineage?.currentFamily?.selfName || profile.name || '';
    if (this.lineageSpouseName) this.lineageSpouseName.value = profile.lineage?.currentFamily?.spouseName || '';

    // Husband
    const h = profile.lineage?.husbandAncestral || {};
    if (this.hFatherName) this.hFatherName.value = h.fatherName || '';
    if (this.hMotherName) this.hMotherName.value = h.motherName || '';
    if (this.hPaternalGf) this.hPaternalGf.value = h.paternalGrandfather || '';
    if (this.hPaternalGm) this.hPaternalGm.value = h.paternalGrandmother || '';
    if (this.hMaternalGf) this.hMaternalGf.value = h.maternalGrandfather || '';
    if (this.hMaternalGm) this.hMaternalGm.value = h.maternalGrandmother || '';
    if (this.hAddress) this.hAddress.value = h.address || '';

    // Wife
    const w = profile.lineage?.wifeAncestral || {};
    if (this.wFatherName) this.wFatherName.value = w.fatherName || '';
    if (this.wMotherName) this.wMotherName.value = w.motherName || '';
    if (this.wPaternalGf) this.wPaternalGf.value = w.paternalGrandfather || '';
    if (this.wPaternalGm) this.wPaternalGm.value = w.paternalGrandmother || '';
    if (this.wMaternalGf) this.wMaternalGf.value = w.maternalGrandfather || '';
    if (this.wMaternalGm) this.wMaternalGm.value = w.maternalGrandmother || '';
    if (this.wAddress) this.wAddress.value = w.address || '';
  }

  _renderChildren(children) {
    if (!this.childrenContainer) return;
    if (children.length === 0) {
      this.childrenContainer.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No children added. Click "+ Add Child".</div>`;
      return;
    }

    this.childrenContainer.innerHTML = children.map((c, i) => `
      <div class="dynamic-row-item" data-index="${i}">
        <input type="text" class="form-control child-name-input" placeholder="Child's Full Name" value="${c.name || ''}">
        <select class="form-control child-gender-select">
          <option value="Son" ${c.gender === 'Son' ? 'selected' : ''}>Son</option>
          <option value="Daughter" ${c.gender === 'Daughter' ? 'selected' : ''}>Daughter</option>
        </select>
        <input type="text" class="form-control child-notes-input" placeholder="Age / Notes" value="${c.ageOrNote || ''}">
        <button type="button" class="btn-remove-row btn-remove-child" data-index="${i}" title="Remove Child">✕</button>
      </div>
    `).join('');
  }

  _renderSiblings(container, siblings, branchKey) {
    if (!container) return;
    if (siblings.length === 0) {
      container.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No siblings recorded. Click "+ Add Sibling".</div>`;
      return;
    }

    container.innerHTML = siblings.map((s, i) => `
      <div class="dynamic-row-item sibling" data-branch="${branchKey}" data-index="${i}">
        <input type="text" class="form-control sibling-name-input" placeholder="Sibling's Name" value="${s.name || ''}">
        <select class="form-control sibling-relation-select">
          <option value="Brother" ${s.relation === 'Brother' ? 'selected' : ''}>Brother</option>
          <option value="Sister" ${s.relation === 'Sister' ? 'selected' : ''}>Sister</option>
          <option value="Elder Brother" ${s.relation === 'Elder Brother' ? 'selected' : ''}>Elder Brother</option>
          <option value="Younger Brother" ${s.relation === 'Younger Brother' ? 'selected' : ''}>Younger Brother</option>
          <option value="Elder Sister" ${s.relation === 'Elder Sister' ? 'selected' : ''}>Elder Sister</option>
          <option value="Younger Sister" ${s.relation === 'Younger Sister' ? 'selected' : ''}>Younger Sister</option>
        </select>
        <input type="text" class="form-control sibling-spouse-input" placeholder="Spouse Name (if m.)" value="${s.spouseName || ''}">
        <input type="text" class="form-control sibling-children-input" placeholder="Children (e.g. 2 Sons)" value="${s.childrenSummary || ''}">
        <button type="button" class="btn-remove-row btn-remove-sibling" data-branch="${branchKey}" data-index="${i}" title="Remove Sibling">✕</button>
      </div>
    `).join('');
  }

  _renderHouseCleanCards(levels) {
    const html = levels.map((lvl, i) => `
      <div class="houseclean-card" data-index="${i}">
        <div class="houseclean-card-header">
          <div class="houseclean-level-title"><span>🧹</span> ${lvl.levelTitle || `Level ${lvl.levelNumber} House Clean`}</div>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="clean-percent-badge">${lvl.cleanPercentage || 0}% Clean</span>
            <button type="button" class="btn btn-sm btn-danger btn-delete-houseclean" data-index="${i}">Delete</button>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Clean Status</label>
            <select class="form-control hc-status-select">
              <option value="NOT_STARTED" ${lvl.status === 'NOT_STARTED' ? 'selected' : ''}>Not Started</option>
              <option value="IN_PROGRESS" ${lvl.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
              <option value="PENDING_APPROVAL" ${lvl.status === 'PENDING_APPROVAL' ? 'selected' : ''}>Pending Mentor Approval</option>
              <option value="APPROVED" ${lvl.status === 'APPROVED' ? 'selected' : ''}>Approved & Certified</option>
              <option value="REVISION_NEEDED" ${lvl.status === 'REVISION_NEEDED' ? 'selected' : ''}>Needs Improvement</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Verified % Clean (0-100)</label>
            <input type="number" class="form-control hc-percentage-input" min="0" max="100" value="${lvl.cleanPercentage || 0}">
          </div>
          <div class="form-group">
            <label class="form-label">Approval Date / Timestamp</label>
            <input type="text" class="form-control hc-date-input" placeholder="e.g. 2025-02-15" value="${lvl.approvalDate || ''}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Cleansing Details & Purified Areas</label>
          <textarea class="form-control hc-details-textarea" rows="2" placeholder="Describe altar purification, salt water wash, loban...">${lvl.cleanedDetails || ''}</textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Approved By Mentor Code & Name</label>
            <input type="text" class="form-control hc-mentor-input" placeholder="Mentor Name & Code" value="${lvl.mentorName ? `${lvl.mentorName} (${lvl.mentorCode || ''})` : ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Mentor Remarks & Seal</label>
            <input type="text" class="form-control hc-remarks-input" placeholder="Remarks" value="${lvl.mentorRemarks || ''}">
          </div>
        </div>
      </div>
    `).join('');

    if (this.devoteeHouseCleanContainer) this.devoteeHouseCleanContainer.innerHTML = html;
    if (this.seekerHouseCleanSummaryContainer) this.seekerHouseCleanSummaryContainer.innerHTML = html;
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

    this.interestedSadhanasContainer.innerHTML = sadhanas.map((s, i) => {
      const isPaid = s.paymentStatus === 'PAID' || (s.isPaid !== false && s.paymentStatus !== 'FREE');
      const sadhanaKey = s.id || s.sadhanaKey || '';
      return `
      <div class="remedy-card-option ${isPaid ? 'tile-paid' : 'tile-free'}" data-index="${i}" data-sadhana-id="${sadhanaKey}">
        <div class="option-content" data-sadhana-trigger="${sadhanaKey}">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="option-title">${s.name || s.title || 'Enrolled Item'}</span>
            <span class="role-badge" style="background: rgba(212, 175, 55, 0.2); color: var(--gold-300); font-size: 0.65rem;">${s.category || 'Sadhana'}</span>
          </div>
          <span class="option-tag">Priority: ${s.priority || 'High'} &bull; Status: ${s.status || 'Enrolled'}</span>
        </div>

        <div class="tile-actions-vertical">
          <input type="checkbox" class="tile-checkbox" name="remedy-checkbox" value="${sadhanaKey}" checked title="Ticked (Enrolled & Synced to Trainee)">
          <button type="button" class="btn-sadhana-info-trigger" data-sadhana-id="${sadhanaKey}" title="View Full Ritual Guide">👁️</button>
          <button type="button" class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'} btn-tile-stamp-toggle" data-sadhana-id="${sadhanaKey}" data-index="${i}" title="Toggle Paid/Free">${isPaid ? 'PAID' : 'FREE'}</button>
        </div>
      </div>
      `;
    }).join('');
  }

  _renderCategorizedTraineeSadhanas(sadhanas) {
    if (!sadhanas || sadhanas.length === 0) {
      const emptyMsg = `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.8rem; font-style: italic; padding: 0.5rem 0;">No active items. Tick any card in Seeker Purpose to add here.</div>`;
      if (this.traineeGroupSadhanas) this.traineeGroupSadhanas.innerHTML = emptyMsg;
      if (this.traineeGroupRemedies) this.traineeGroupRemedies.innerHTML = emptyMsg;
      if (this.traineeGroupCleansing) this.traineeGroupCleansing.innerHTML = emptyMsg;
      this._renderTraineeActiveDetail(null);
      return;
    }

    // Set default selected trainee item if none selected or if selected was deleted
    if (!this.selectedTraineeId || !sadhanas.some(s => s.id === this.selectedTraineeId)) {
      this.selectedTraineeId = sadhanas[0].id;
    }

    const filterByDomain = (domainKey) => sadhanas.filter(s => {
      if (s.categoryDomain) return s.categoryDomain === domainKey;
      const cat = (s.category || s.title || '').toLowerCase();
      if (domainKey === 'sadhanas') return cat.includes('sadhana') || cat.includes('yantra') || cat.includes('bhairav') || cat.includes('chamunda') || cat.includes('diwali');
      if (domainKey === 'remedies') return cat.includes('remedy') || cat.includes('diya') || cat.includes('court') || cat.includes('business') || cat.includes('trilok') || cat.includes('havan') || cat.includes('vastu') || cat.includes('gopal') || cat.includes('debt');
      return cat.includes('clean') || cat.includes('kundalini') || cat.includes('heal') || cat.includes('karmic') || cat.includes('nazar') || cat.includes('aura');
    });

    const renderDomainTiles = (items) => {
      if (items.length === 0) {
        return `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.8rem; font-style: italic; padding: 0.5rem 0;">No active items in this category. Tick any card in Seeker Purpose to add here.</div>`;
      }

      return items.map((ts) => {
        const isPaid = ts.isPaid !== false && ts.paymentStatus !== 'FREE';
        const isSelected = ts.id === this.selectedTraineeId;
        const sadhanaKey = ts.sadhanaKey || ts.id;
        const catalogItem = SADHANA_CATALOG[sadhanaKey] || { icon: '🌿' };
        return `
        <div class="trainee-card-tile ${isPaid ? 'tile-paid' : 'tile-free'} ${isSelected ? 'active-selected-tile' : ''}" 
             data-item-id="${ts.id}" 
             data-sadhana-key="${sadhanaKey}">
          <div class="option-content trainee-tile-select-trigger" data-item-id="${ts.id}">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 1.1rem;">${catalogItem.icon || '🌿'}</span>
              <span class="option-title">${ts.title || 'In-Progress Sadhana'}</span>
            </div>
            <span class="option-tag">${ts.level || 'Level 1 — Initiation'} &bull; ${ts.progressPercent || 0}%</span>
          </div>

          <div class="tile-actions-vertical">
            <input type="checkbox" class="tile-checkbox trainee-item-checkbox" data-item-id="${ts.id}" checked title="Ticked in Trainee In-Progress">
            <button type="button" class="btn-sadhana-info-trigger" data-sadhana-id="${sadhanaKey}" title="View Full Ritual Guide">👁️</button>
            <button type="button" class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'} btn-tile-stamp-toggle" data-item-id="${ts.id}" title="Toggle Paid/Free">${isPaid ? 'PAID' : 'FREE'}</button>
          </div>
        </div>
        `;
      }).join('');
    };

    if (this.traineeGroupSadhanas) this.traineeGroupSadhanas.innerHTML = renderDomainTiles(filterByDomain('sadhanas'));
    if (this.traineeGroupRemedies) this.traineeGroupRemedies.innerHTML = renderDomainTiles(filterByDomain('remedies'));
    if (this.traineeGroupCleansing) this.traineeGroupCleansing.innerHTML = renderDomainTiles(filterByDomain('cleansing'));

    const activeItem = sadhanas.find(s => s.id === this.selectedTraineeId) || sadhanas[0];
    this._renderTraineeActiveDetail(activeItem);
  }

  renderUniversalMemoBox({ textareaId, targetItemId, placeholder = 'Enter progress note, vibration feedback, or mentor query...', quickChips = [] }) {
    const chips = quickChips.length > 0 ? quickChips : [
      '11 Malas Completed',
      'Daily Sunset Protocol Done',
      'Chakra Vibration Activated',
      'Peaceful Light Observed',
      'Obstacle / Smoke Cleared',
      'Requesting Mentor Attunement'
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
          ${chips.map(chip => `<span class="memo-quick-chip" data-target="${textareaId}">${chip}</span>`).join('')}
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

    const isPaid = item.isPaid !== false && item.paymentStatus !== 'FREE';
    const sadhanaKey = item.sadhanaKey || item.id;
    const catalogItem = SADHANA_CATALOG[sadhanaKey] || { icon: '🌿', category: 'Sadhana' };
    const progress = Math.min(100, Math.max(0, parseInt(item.progressPercent, 10) || 0));
    const vStatus = item.verificationStatus || 'UNVERIFIED';

    const memos = item.memos && item.memos.length > 0 ? item.memos : [
      { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' 09:30 AM', author: 'Mentor Devendra', text: 'Initial attunement completed. Commenced daily sadhana regime.' }
    ];

    this.traineeActiveDetailContainer.innerHTML = `
      <div class="trainee-detail-card" data-item-id="${item.id}">
        <!-- Detail Header -->
        <div class="trainee-detail-header">
          <div class="trainee-detail-title-wrap">
            <span class="trainee-detail-icon">${catalogItem.icon || '🌿'}</span>
            <div>
              <div class="trainee-detail-title">${item.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${item.categoryDomain || catalogItem.category} &bull; Supervising Mentor: ${item.mentorCode || 'SKHM-ADM1-7788-9900'}</div>
            </div>
          </div>
          <span class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'} btn-tile-stamp-toggle" data-item-id="${item.id}" title="Toggle Paid/Free">
            ${isPaid ? 'PAID' : 'FREE'}
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
              <div class="progress-stat-val">${item.dailyTarget || '11 Malas'}</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-label">Current Streak</div>
              <div class="progress-stat-val">${item.currentStreak || '1 Day'}</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-label">Access Type</div>
              <div class="progress-stat-val" style="color: ${isPaid ? '#10b981' : '#ef4444'};">${isPaid ? 'PAID' : 'FREE'}</div>
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
            
            ${vStatus === 'VERIFIED' 
              ? `<span class="verification-status-badge status-verified">🟢 Verified &amp; Sealed</span>`
              : (vStatus === 'PENDING_APPROVAL' 
                  ? `<span class="verification-status-badge status-pending">⏳ Awaiting Upline Approval</span>`
                  : `<span class="verification-status-badge status-unverified">⚪ Self-Reported</span>`)}
          </div>

          <div class="verification-actions-row">
            <div class="verification-info-text">
              ${vStatus === 'VERIFIED'
                ? `Officially approved by <strong>${item.verifiedBy || 'Master Karim'}</strong> on ${item.verifiedDate || 'Recently'}`
                : (vStatus === 'PENDING_APPROVAL'
                    ? `Request submitted to sponsor <strong>${item.mentorCode || 'SKHM-ADM1-7788-9900'}</strong> on ${item.verificationRequestedDate || 'Recently'}`
                    : `Submit this sadhana progress for formal upline verification &amp; mastery seal.`)}
            </div>

            <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              ${vStatus === 'PENDING_APPROVAL'
                ? `
                  <button type="button" class="btn-verify-approve" data-item-id="${item.id}" title="Approve &amp; issue official seal">
                    <span>✓</span> Approve &amp; Seal
                  </button>
                  <button type="button" class="btn btn-sm btn-danger btn-verify-reject" data-item-id="${item.id}" title="Request revision or extra practice">
                    <span>✕</span> Revision
                  </button>
                `
                : (vStatus === 'VERIFIED'
                    ? `<button type="button" class="btn-verify-request" data-item-id="${item.id}" title="Submit updated progress for re-verification"><span>🔄</span> Re-Verify</button>`
                    : `<button type="button" class="btn-verify-request" data-item-id="${item.id}"><span>🛡️</span> Verify / Request Upline Approval</button>`)}
            </div>
          </div>
        </div>

        <!-- Interactive Progress Parameters Edit Grid -->
        <div class="form-grid-2 mt-2">
          <div class="form-group">
            <label class="form-label">Advancement Level</label>
            <select class="form-control active-ts-level-select" data-item-id="${item.id}">
              <option value="Level 1 — Novice Initiation" ${item.level?.includes('Level 1') ? 'selected' : ''}>Level 1 — Initiation</option>
              <option value="Level 2 — Mantra Diksha" ${item.level?.includes('Level 2') ? 'selected' : ''}>Level 2 — Mantra Diksha</option>
              <option value="Level 3 — Havan & Energy Transmission" ${item.level?.includes('Level 3') ? 'selected' : ''}>Level 3 — Havan Transmission</option>
              <option value="Level 4 — Master Attunement" ${item.level?.includes('Level 4') ? 'selected' : ''}>Level 4 — Master Attunement</option>
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
            <input type="text" class="form-control active-ts-target-input" data-item-id="${item.id}" value="${item.dailyTarget || '11 Malas Daily'}">
          </div>
          <div class="form-group">
            <label class="form-label">Active Practice Streak</label>
            <input type="text" class="form-control active-ts-streak-input" data-item-id="${item.id}" value="${item.currentStreak || '1 Day'}">
          </div>
        </div>

        <!-- Feedback & Progress Memo Timeline -->
        <div class="memo-section-wrap mt-2">
          <div class="memo-section-title">
            <span>💬 Feedback, Vibrations &amp; Progress Memo Log</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 400;">(${memos.length} Entries)</span>
          </div>

          <div class="memo-timeline-container" id="trainee-memo-timeline">
            ${memos.map(m => `
              <div class="memo-timeline-item ${m.type === 'VERIFIED' ? 'verification-log' : (m.type === 'PENDING' ? 'pending-log' : '')}">
                <div class="memo-meta">
                  <strong style="color: ${m.type === 'VERIFIED' ? '#10b981' : (m.type === 'PENDING' ? '#f59e0b' : 'var(--gold-400)')};">
                    ${m.author || 'Sadhak / Mentor'}
                  </strong>
                  <span>📅 ${m.date || 'Just now'}</span>
                </div>
                <div class="memo-text">${m.text || ''}</div>
              </div>
            `).join('')}
          </div>

          <!-- Universal Memo Box with Keyboard, Speech-to-Text Mic, and Send Submit -->
          <div class="mt-2">
            ${this.renderUniversalMemoBox({
              textareaId: 'trainee-new-memo-text',
              targetItemId: item.id,
              placeholder: 'Enter progress memo, spiritual feedback, or mentor question (Use 🎤 Mic for voice)...',
              quickChips: [
                '11 Malas Completed Today',
                'Sunset 3-Diya Havan Done',
                'Deep Third Eye Vibration Felt',
                'All Domestic Heavy Vibes Cleared',
                'Streak Maintained Unbroken',
                'Requesting Next Level Diksha'
              ]
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

    this.healerCompletedSadhanasContainer.innerHTML = completed.map((h, i) => `
      <div class="sadhana-progress-card completed" data-index="${i}">
        <div class="sadhana-card-top">
          <span class="role-badge" style="background: var(--gold-500); color: #0b0714;">${h.levelCompleted || 'Level 4 — Master Guru'}</span>
          <button type="button" class="btn btn-sm btn-danger btn-delete-healer-sadhana" data-index="${i}">Delete</button>
        </div>

        <div class="form-group">
          <label class="form-label">Master Sadhana Title</label>
          <input type="text" class="form-control hc-comp-title-input" value="${h.title || ''}" placeholder="Title">
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Status</label>
            <input type="text" class="form-control hc-comp-status-input" value="${h.status || 'Certified Master'}" placeholder="Status">
          </div>
          <div class="form-group">
            <label class="form-label">Completion Date</label>
            <input type="text" class="form-control hc-comp-date-input" value="${h.completionDate || ''}" placeholder="YYYY-MM-DD">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Seekers Guided</label>
            <input type="number" class="form-control hc-comp-count-input" value="${h.seekersGuidedCount || 0}">
          </div>
          <div class="form-group">
            <label class="form-label">Validation Seal Code</label>
            <input type="text" class="form-control hc-comp-seal-input font-mono" value="${h.sealCode || ''}" placeholder="SKHM-SEAL-XXX">
          </div>
        </div>
      </div>
    `).join('');
  }

  _renderHealerNetwork(network) {
    if (!this.healerNetworkContainer) return;
    if (network.length === 0) {
      this.healerNetworkContainer.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No devotees linked yet. Click "+ Link Devotee".</div>`;
      return;
    }

    this.healerNetworkContainer.innerHTML = network.map((n, i) => `
      <div class="dynamic-row-item" data-index="${i}">
        <input type="text" class="form-control net-name-input" placeholder="Devotee/Seeker Name" value="${n.name || ''}">
        <input type="text" class="form-control net-code-input font-mono" placeholder="16-Digit Code" value="${n.refCode || ''}">
        <input type="text" class="form-control net-role-input" placeholder="Role / Level" value="${n.role || ''}">
        <button type="button" class="btn-remove-row btn-remove-network-devotee" data-index="${i}" title="Unlink Devotee">✕</button>
      </div>
    `).join('');
  }

  // Enforce 4-Tier Role-Based Access Control (RBAC) & Hierarchy Visibility Matrix
  enforceRBAC(roleMode = 'MASTER', settings = {}) {
    const isMaster = roleMode === 'MASTER' || roleMode === 'ADMIN';
    const isHealer = roleMode === 'HEALER';
    const isTrainee = roleMode === 'TRAINEE';
    const isDevotee = roleMode === 'DEVOTEE';

    // 1. App Hierarchy Tiers Legend Visibility (Image 1)
    // Master: 1, 2, 3, 4
    // Healer: 2, 3, 4 (hide 1)
    // Trainee: 3, 4 (hide 1, 2)
    // Devotee: 4 only (hide 1, 2, 3)
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      const tier = parseInt(item.getAttribute('data-tier'), 10);
      let show = false;
      if (isMaster) show = true;
      else if (isHealer) show = tier >= 2;
      else if (isTrainee) show = tier >= 3;
      else if (isDevotee) show = tier === 4;

      item.style.display = show ? 'flex' : 'none';
    });

    // 2. Dedicated Portals Visibility (Image 3)
    // Master: 1, 2, 3, 4
    // Healer: 2, 3, 4 (hide 1)
    // Trainee: 3, 4 (hide 1, 2)
    // Devotee: 4 (hide 1, 2, 3)
    document.querySelectorAll('#sidebar-dedicated-portals .sub-portal-link').forEach(link => {
      const tier = parseInt(link.getAttribute('data-portal-tier'), 10);
      let show = false;
      if (isMaster) show = true;
      else if (isHealer) show = tier >= 2;
      else if (isTrainee) show = tier >= 3;
      else if (isDevotee) show = tier === 4;

      link.style.display = show ? 'flex' : 'none';
    });

    // 3. Multilevel Organization Hub (in Healer Connect tab)
    // Metric Pills:
    const adminMetric = document.querySelector('.metric-pill-item.metric-admin');
    const healerMetric = document.querySelector('.metric-pill-item.metric-healers');
    const traineeMetric = document.querySelector('.metric-pill-item.metric-trainees');
    const devoteeMetric = document.querySelector('.metric-pill-item.metric-devotees');

    if (adminMetric) adminMetric.style.display = isMaster ? 'flex' : 'none';
    if (healerMetric) healerMetric.style.display = (isMaster || isHealer) ? 'flex' : 'none';
    if (traineeMetric) traineeMetric.style.display = (isMaster || isHealer || isTrainee) ? 'flex' : 'none';
    if (devoteeMetric) devoteeMetric.style.display = 'flex';

    // Filter Chips:
    document.querySelectorAll('#healers-filter-chips-container .healer-filter-chip').forEach(chip => {
      const chipType = chip.getAttribute('data-type');
      let show = true;
      if (chipType === 'ADMIN') show = isMaster;
      else if (chipType === 'HEALER') show = isMaster || isHealer;
      else if (chipType === 'TRAINEE') show = isMaster || isHealer || isTrainee;
      else if (chipType === 'DEVOTEE' || chipType === 'ALL') show = true;

      chip.style.display = show ? 'inline-block' : 'none';
    });

    // 4. Delete & Modification Restrictions
    const allowDelete = isMaster || (isHealer && settings.healerCanDeleteTeam !== false) || (isDevotee && settings.allowDevoteeDelete === true);
    const deleteSelectors = [
      '#btn-delete-profile',
      '.btn-delete-houseclean',
      '.btn-remove-interested-sadhana',
      '.btn-delete-trainee-item',
      '.btn-delete-healer-sadhana',
      '.btn-remove-network-devotee',
      '.btn-remove-child',
      '.btn-remove-sibling'
    ];
    deleteSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(btn => {
        if (!allowDelete) {
          btn.classList.add('permission-locked');
          btn.setAttribute('title', '🔒 Deletion locked for role mode. (Can be enabled in Admin Settings)');
          btn.disabled = true;
        } else {
          btn.classList.remove('permission-locked');
          btn.removeAttribute('title');
          btn.disabled = false;
        }
      });
    });

    // 5. Admin Settings button access
    if (this.btnAdminSettings) {
      if (!isMaster) {
        this.btnAdminSettings.style.opacity = '0.5';
        this.btnAdminSettings.title = 'Admin Settings (Restricted to Master role)';
      } else {
        this.btnAdminSettings.style.opacity = '1';
        this.btnAdminSettings.title = 'Open Master Admin & RBAC Settings';

    const rbacMatrixBtns = [
      document.getElementById('btn-open-rbac-matrix'),
      document.getElementById('sidebar-btn-rbac-matrix')
    ];
    rbacMatrixBtns.forEach(btn => {
      if (btn) btn.style.display = isMaster ? 'inline-flex' : 'none';
    });

      }
    }

    // 6. Header Portal Badge & Document Portal Mode
    document.body.setAttribute('data-portal-mode', roleMode.toLowerCase());
    const headerBadge = document.getElementById('header-portal-badge');
    if (headerBadge) {
      if (isMaster) headerBadge.innerHTML = '👑 Master Control';
      else if (isHealer) headerBadge.innerHTML = '🌿 Healer Portal';
      else if (isTrainee) headerBadge.innerHTML = '📿 Trainee Sadhak Portal';
      else if (isDevotee) headerBadge.innerHTML = '🌟 Devotee Portal';
    }

    // 7. Address Bar URL Synchronization
    this.syncAddressBarUrl(roleMode);
  }

  syncAddressBarUrl(roleMode) {
    try {
      const mode = (roleMode || 'MASTER').toLowerCase();
      const currentUrl = new URL(window.location.href);
      const currentRole = currentUrl.searchParams.get('role');

      let roleParamVal = 'admin';
      if (mode === 'healer') roleParamVal = 'healer';
      else if (mode === 'trainee') roleParamVal = 'trainee';
      else if (mode === 'devotee') roleParamVal = 'devotee';

      if (currentRole !== roleParamVal) {
        currentUrl.searchParams.set('role', roleParamVal);
        window.history.replaceState({ role: roleParamVal }, '', currentUrl.toString());
      }
    } catch (e) {
      console.warn('Could not sync address bar URL', e);
    }
  }

  // Slide-out Drawer Rendering
  openSadhanaDrawer(sadhanaKey) {
    const item = SADHANA_CATALOG[sadhanaKey] || SADHANA_CATALOG.sri_yantra;
    if (this.sadhanaDrawerTitle) this.sadhanaDrawerTitle.textContent = item.title;
    if (this.sadhanaDrawerCategory) this.sadhanaDrawerCategory.textContent = `${item.category} • ${item.levelScope}`;
    if (this.sadhanaDrawerIcon) this.sadhanaDrawerIcon.textContent = item.icon;

    if (this.sadhanaDrawerBody) {
      this.sadhanaDrawerBody.innerHTML = `
        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>🌟</span> Spiritual Essence &amp; Overview</div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${item.summary}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>📿</span> Sacred Beej Mantra &amp; Frequency</div>
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
            ${item.steps.map(st => `<li>${st}</li>`).join('')}
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
      const copyBtn = this.sadhanaDrawerBody.querySelector('.btn-copy-drawer-mantra');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const text = decodeURIComponent(copyBtn.getAttribute('data-mantra'));
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
          });
        });
      }
    }

    if (this.btnDrawerEnroll) this.btnDrawerEnroll.setAttribute('data-sadhana-key', item.id);
    if (this.btnDrawerSendTrainee) this.btnDrawerSendTrainee.setAttribute('data-sadhana-key', item.id);

    if (this.sadhanaDrawer) {
      this.sadhanaDrawer.classList.add('open');
      this.sadhanaDrawer.setAttribute('aria-hidden', 'false');
    }
    if (this.sadhanaDrawerBackdrop) this.sadhanaDrawerBackdrop.classList.add('open');
  }

  closeSadhanaDrawer() {
    if (this.sadhanaDrawer) {
      this.sadhanaDrawer.classList.remove('open');
      this.sadhanaDrawer.setAttribute('aria-hidden', 'true');
    }
    if (this.sadhanaDrawerBackdrop) this.sadhanaDrawerBackdrop.classList.remove('open');
  }

  toggleGoliGyanModal(forceState) {
    if (!this.goliGyanModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.goliGyanModal.classList.contains('open');
    if (isOpen) {
      this.goliGyanModal.classList.add('open');
      this.goliGyanModal.setAttribute('aria-hidden', 'false');
    } else {
      this.goliGyanModal.classList.remove('open');
      this.goliGyanModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleRbacMatrixModal(forceState) {
    const modal = document.getElementById('rbac-access-matrix-modal');
    if (!modal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : (!modal.classList.contains('open') && !modal.classList.contains('is-open'));
    if (isOpen) {
      modal.classList.add('open', 'is-open');
      modal.setAttribute('aria-hidden', 'false');
    } else {
      modal.classList.remove('open', 'is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSettingsModal(forceState) {
    if (!this.adminSettingsModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.adminSettingsModal.classList.contains('open');
    if (isOpen) {
      this.adminSettingsModal.classList.add('open');
      this.adminSettingsModal.setAttribute('aria-hidden', 'false');
    } else {
      this.adminSettingsModal.classList.remove('open');
      this.adminSettingsModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSharePairingModal(forceState) {
    const modal = document.getElementById('share-pairing-modal');
    if (!modal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !modal.classList.contains('open');
    if (isOpen) {
      modal.classList.add('open', 'is-open');
      modal.setAttribute('aria-hidden', 'false');
    } else {
      modal.classList.remove('open', 'is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  renderSharePairingModal(profile, invites = []) {
    const body = document.getElementById('share-pairing-modal-body');
    if (!body || !profile) return;

    const sponsorCode = profile.referenceCode || 'SKHM-ADM1-7788-9900';
    const cleanCode = sponsorCode.replace(/[^a-zA-Z0-9]/g, '');
    const activePin = (100000 + (Math.abs(sponsorCode.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31) % 900000)).toString();

    // Official Installation & Release Links
    const apkDownloadUrl = 'https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk';
    const repoUrl = 'https://github.com/jDroid-X/SpritualKarim';
    const webPortalUrl = 'https://jdroid-x.github.io/SpritualKarim/SpritualKarimWeb/';
    const telegramBotHandle = 'SpiritualKarimBot';
    const telegramLink = `https://t.me/${telegramBotHandle}?start=pair_${cleanCode}_${activePin}`;

    const payloadText = `🕉️ SPIRITUAL KARIM • SACRED LINEAGE PAIRING INVITE

Mentor: ${profile.name || 'Karim Ji'} (Level ${profile.level || 1})
16-Digit Reference Code: ${sponsorCode}

Connection Type: Downline Member (Level-Down Seekers & Trainees)
Assigned Role: Devotee (Personal & Lineage Sadhana)

Verification Method: Mobile Number OTP & Telegram Bot
Activation Pairing PIN: ${activePin}
Telegram Bot Pairing: ${telegramLink}

⏱️ Link Validity: Valid for 24 Hours only (Upline approval required). Multiple resends allowed.
📦 Direct Release APK: ${apkDownloadUrl}
🌐 Online Web Portal: ${webPortalUrl}
🌐 GitHub Repository & Updates: ${repoUrl}

Installation & Activation Steps:
1. Download and install the Spiritual Karim Android App or open the Web Portal link.
2. Enter the 16-Digit Sponsor Reference Code (${sponsorCode}) and 6-Digit Activation PIN (${activePin}).
3. Once validated, your upline mentor confirms activation to begin real-time lineage synchronization!`;

    const encodedPayload = encodeURIComponent(payloadText);
    const encodedApk = encodeURIComponent(apkDownloadUrl);

    body.innerHTML = `
      <!-- 1. Source Code Display Banner (Matching Android App Surface) -->
      <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 0.65rem; padding: 0.85rem 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div style="font-size: 0.7rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.05em;">YOUR 16-DIGIT SPONSOR CODE</div>
          <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); letter-spacing: 1.5px;">${sponsorCode}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="role-badge" style="background: var(--gold-500); color: #0b0714; font-weight: 800;">L${profile.level || 1} ${profile.profileType || 'MENTOR'}</span>
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
            <span>🐙</span> GitHub Repository
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

    const copyBtn = body.querySelector('#btn-copy-pairing-payload');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = decodeURIComponent(copyBtn.getAttribute('data-payload') || '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('✓ Full 24-Hour Pairing Invite copied to clipboard!');
          });
        }
      });
    }

    const copySponsorBtn = body.querySelector('#btn-copy-sponsor-only');
    if (copySponsorBtn) {
      copySponsorBtn.addEventListener('click', () => {
        const code = copySponsorBtn.getAttribute('data-code') || '';
        if (navigator.clipboard && code) {
          navigator.clipboard.writeText(code).then(() => {
            this.showToast(`📋 Sponsor Code copied: ${code}`);
          });
        }
      });
    }

    const copyPinBtn = body.querySelector('#btn-copy-pin-only');
    if (copyPinBtn) {
      copyPinBtn.addEventListener('click', () => {
        const pin = copyPinBtn.getAttribute('data-pin') || '';
        if (navigator.clipboard && pin) {
          navigator.clipboard.writeText(pin).then(() => {
            this.showToast(`🔑 Activation PIN copied: ${pin}`);
          });
        }
      });
    }
  }

  renderPendingApprovalsRows(invites = []) {
    const tbody = document.getElementById('tbody-pending-approvals');
    if (!tbody) return;

    if (!invites || invites.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1rem;">No pending approvals right now. Share your sponsor code to invite seekers!</td></tr>`;
      return;
    }

    const now = Date.now();
    tbody.innerHTML = invites.map(inv => {
      const remainingMs = (inv.expiresAtMs || (inv.createdAtMs + 86400000)) - now;
      const isExpired = inv.status === 'PENDING' && remainingMs <= 0;
      const isApproved = inv.status === 'APPROVED';

      let timerBadgeHtml = '';
      if (isApproved) {
        timerBadgeHtml = `<span class="countdown-timer-badge countdown-approved">🟢 Approved &amp; Linked</span>`;
      } else if (isExpired) {
        timerBadgeHtml = `<span class="countdown-timer-badge countdown-expired">⏱️ Expired (24h Ended)</span>`;
      } else {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
        const pad = n => String(n).padStart(2, '0');
        timerBadgeHtml = `<span class="countdown-timer-badge countdown-live" data-expires="${inv.expiresAtMs || (inv.createdAtMs + 86400000)}">⏳ ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s</span>`;
      }

      let actionsHtml = '';
      if (isApproved) {
        actionsHtml = `<span style="color: #10b981; font-weight: 700; font-size: 0.8rem;">✓ Linked to Tab 4</span>`;
      } else if (isExpired) {
        actionsHtml = `<button type="button" class="btn btn-sm btn-outline btn-resend-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem;">🔄 Resend (24h)</button>`;
      } else {
        actionsHtml = `
          <div style="display: flex; gap: 0.35rem;">
            <button type="button" class="btn btn-sm btn-gold btn-approve-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">✓ Approve</button>
            <button type="button" class="btn btn-sm btn-outline btn-reject-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; color: #ef4444;">✕</button>
          </div>
        `;
      }

      return `
        <tr data-invite-row="${inv.id}">
          <td>
            <div style="font-weight: 700; color: var(--text-primary);">${inv.seekerName || 'Seeker'}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">${inv.seekerPhone || 'No Phone'}</div>
          </td>
          <td>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${inv.seekerDeviceModel || 'Android Device'}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${inv.formattedCreatedTime || 'Recent'}</div>
          </td>
          <td>${timerBadgeHtml}</td>
          <td><span class="verification-status-badge ${isApproved ? 'status-verified' : (isExpired ? 'status-unverified' : 'status-pending')}">${inv.status}</span></td>
          <td>${actionsHtml}</td>
        </tr>
      `;
    }).join('');
  }

  populateSettings(settings) {
    const s = {
      defaultMentorName: 'Karim Ji (Founder)',
      defaultMentorCode: 'SKHM-ADM1-7788-9900',
      speechLang: 'en-US',
      defaultTargetMalas: '11 Malas Daily',
      defaultSadhanaStreak: '1 Day',
      allowDevoteeDelete: false,
      devoteeCanEditLineage: true,
      devoteeCanEnroll: true,
      healerStrictTeam: true,
      healerCanCertify: true,
      healerCanDeleteTeam: true,
      healerCanViewEntireTeam: true,
      enableLiveSync: true,
      firebaseUrl: 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/',
      defaultRoleMode: 'MASTER',
      autoSaveMode: 'INSTANT',
      ...(settings || {})
    };

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : '';
    };

    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal('setting-app-name', s.appName || 'Spiritual Karim Admin');
    setVal('setting-org-name', s.orgName || 'Shree Spritual Karim Sansthan');
    setVal('setting-firebase-url', s.firebaseUrl || 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/');
    setChecked('setting-auto-cloud-sync', s.autoCloudSync !== false);
    setVal('setting-default-mentor-name', s.defaultMentorName);
    setVal('setting-default-mentor-code', s.defaultMentorCode);
    setVal('setting-telegram-bot-handle', s.telegramBotHandle);
    setVal('setting-notebooklm-portal-url', s.notebookLmPortalUrl);
    setVal('setting-three-diya-window', s.threeDiyaEveningWindow);
    setVal('setting-clean-min-approval-percent', s.cleanMinApprovalPercent);
    setVal('setting-default-target-malas', s.defaultTargetMalas);
    setVal('setting-default-japa-target-count', s.defaultJapaTargetCount);
    setVal('setting-github-apk-url', s.githubApkUrl);
    setVal('setting-github-repo-url', s.githubRepoUrl);
    setVal('setting-web-portal-url', s.webPortalUrl);
    setVal('setting-upline-approval-timeout', s.uplineApprovalTimeoutHours);
    setVal('setting-speech-lang', s.speechLang);
    setChecked('setting-data-minimization', s.dataMinimizationEnabled !== false);
    setChecked('setting-devotee-can-delete', s.allowDevoteeDelete === true);
    setChecked('setting-devotee-can-edit-lineage', s.devoteeCanEditLineage !== false);
    setChecked('setting-devotee-can-enroll', s.devoteeCanEnroll !== false);
    setChecked('setting-healer-strict-team', s.healerStrictTeam !== false);
    setChecked('setting-healer-can-certify', s.healerCanCertify !== false);
    setChecked('setting-healer-can-delete-team', s.healerCanDeleteTeam !== false);
    setVal('setting-firebase-url', s.firebaseUrl);
    setVal('setting-firebase-project-id', s.firebaseProjectId);
    setVal('setting-default-role-mode', s.defaultRoleMode);
    setVal('setting-auto-save', s.autoSaveMode);
  }

  readSettingsFromForm() {
    const getVal = (id, defaultVal = '') => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : defaultVal;
    };

    const getChecked = (id, defaultVal = false) => {
      const el = document.getElementById(id);
      return el ? el.checked : defaultVal;
    };

    return {
      appName: getVal('setting-app-name', 'Spiritual Karim Admin'),
      orgName: getVal('setting-org-name', 'Shree Spritual Karim Sansthan'),
      firebaseUrl: getVal('setting-firebase-url', 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/'),
      autoCloudSync: getChecked('setting-auto-cloud-sync', true),
      defaultMentorName: getVal('setting-default-mentor-name', 'Karim Ji (Founder)'),
      defaultMentorCode: getVal('setting-default-mentor-code', 'SKHM-ADM1-7788-9900'),
      telegramBotHandle: getVal('setting-telegram-bot-handle', 'SpiritualKarimBot'),
      notebookLmPortalUrl: getVal('setting-notebooklm-portal-url', 'https://notebooklm.google.com'),
      threeDiyaEveningWindow: getVal('setting-three-diya-window', '06:15 PM – 07:00 PM'),
      cleanMinApprovalPercent: Number(getVal('setting-clean-min-approval-percent', '75')) || 75,
      defaultTargetMalas: getVal('setting-default-target-malas', '11 Malas Daily'),
      defaultJapaTargetCount: Number(getVal('setting-default-japa-target-count', '108')) || 108,
      defaultSadhanaStreak: '1 Day',
      githubApkUrl: getVal('setting-github-apk-url', 'https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk'),
      githubRepoUrl: getVal('setting-github-repo-url', 'https://github.com/jDroid-X/SpritualKarim'),
      webPortalUrl: getVal('setting-web-portal-url', 'https://jdroid-x.github.io/SpritualKarim/'),
      uplineApprovalTimeoutHours: Number(getVal('setting-upline-approval-timeout', '24')) || 24,
      allowDevoteeDelete: getChecked('setting-devotee-can-delete', false),
      devoteeCanEditLineage: getChecked('setting-devotee-can-edit-lineage', true),
      devoteeCanEnroll: getChecked('setting-devotee-can-enroll', true),
      healerStrictTeam: getChecked('setting-healer-strict-team', true),
      healerCanCertify: getChecked('setting-healer-can-certify', true),
      healerCanDeleteTeam: getChecked('setting-healer-can-delete-team', true),
      healerCanViewEntireTeam: getChecked('setting-healer-strict-team', true),
      enableLiveSync: true,
      firebaseUrl: getVal('setting-firebase-url', 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/'),
      firebaseProjectId: getVal('setting-firebase-project-id', 'spritualkarim-7b5fd'),
      dataMinimizationEnabled: getChecked('setting-data-minimization', true),
      defaultRoleMode: getVal('setting-default-role-mode', 'MASTER'),
      autoSaveMode: getVal('setting-auto-save', 'INSTANT'),
      speechLang: getVal('setting-speech-lang', 'en-US')
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
      1: { title: 'Admin Master Profiles', icon: '👑', color: '#8b5cf6', filter: p => p.profileType === 'ADMIN' || p.level === 1 },
      2: { title: 'Healer Connect Profiles', icon: '🛡️', color: '#10b981', filter: p => p.profileType === 'HEALER' && (p.level === 2 || p.level === 3 || !p.level) },
      3: { title: 'Trainee Sadhak Profiles', icon: '🌿', color: '#f59e0b', filter: p => p.profileType === 'TRAINEE' || p.level === 4 },
      4: { title: 'Devotee / Seeker Profiles', icon: '🌟', color: '#3b82f6', filter: p => p.profileType === 'DEVOTEE' || p.level === 5 || (!p.level && p.profileType !== 'ADMIN' && p.profileType !== 'HEALER' && p.profileType !== 'TRAINEE') }
    };

    const meta = tierMeta[tierNumber] || tierMeta[1];
    this.currentTierProfiles = (allProfiles || []).filter(meta.filter);

    if (this.tierPanelIcon) this.tierPanelIcon.textContent = meta.icon;
    if (this.tierPanelTitle) this.tierPanelTitle.textContent = meta.title;
    if (this.tierPanelCount) this.tierPanelCount.textContent = `${this.currentTierProfiles.length} Member${this.currentTierProfiles.length !== 1 ? 's' : ''}`;

    this._renderTierPanelCards(this.currentTierProfiles, activeProfileId, meta.color);

    // Active state on sidebar legend
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      const itemTier = parseInt(item.getAttribute('data-tier'), 10);
      if (itemTier === tierNumber) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.tierProfilesPanel.classList.add('is-open');
    if (this.inputTierPanelSearch) {
      this.inputTierPanelSearch.value = '';
      this.inputTierPanelSearch.focus();
    }
  }

  closeTierPanel() {
    if (!this.tierProfilesPanel) return;
    this.tierProfilesPanel.classList.remove('is-open');
    this.currentOpenTier = null;
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      item.classList.remove('active');
    });
  }

  _renderTierPanelCards(profiles, activeProfileId, borderColor = '#d4af37') {
    if (!this.tierPanelProfilesList) return;

    if (profiles.length === 0) {
      this.tierPanelProfilesList.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <div>No member profiles found in this tier.</div>
        </div>
      `;
      return;
    }

    this.tierPanelProfilesList.innerHTML = profiles.map(p => {
      const isActive = p.id === activeProfileId;
      const initials = (p.name || 'SK')
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      const isPaid = p.isPaid !== false && p.paymentStatus !== 'FREE';

      return `
        <div class="tier-panel-profile-card ${isActive ? 'active' : ''}" data-id="${p.id}" title="Click to view &amp; edit full profile for ${p.name}">
          <div class="tier-card-avatar-wrap">
            <div class="tier-card-avatar" style="border-color: ${borderColor};">
              ${initials}
              <span class="tier-card-avatar-dot ${p.isActive ? 'online' : 'offline'}"></span>
            </div>
          </div>
          <div class="tier-card-info">
            <div class="tier-card-name-row">
              <span class="tier-card-name">${p.name}</span>
              <span class="tier-card-stamp ${isPaid ? 'stamp-paid' : 'stamp-free'}">${isPaid ? 'PAID' : 'FREE'}</span>
            </div>
            <div class="tier-card-ref-row">
              <span class="tier-card-ref">${p.referenceCode}</span>
              <span class="tier-card-level-badge">LVL ${p.level || 1}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  updateLegendCounts(profiles) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    (profiles || []).forEach(p => {
      if (p.profileType === 'ADMIN' || p.level === 1) counts[1]++;
      else if (p.profileType === 'HEALER') counts[2]++;
      else if (p.profileType === 'TRAINEE' || p.level === 4) counts[3]++;
      else counts[4]++;
    });

    for (let t = 1; t <= 4; t++) {
      const el = document.getElementById('legend-count-tier-' + t);
      if (el) el.textContent = counts[t];
    }
  }

  
  initSadhanaListbox() {
    const select = document.getElementById('select-sacred-sadhana');
    const container = document.getElementById('sadhana-detail-preview-container');
    if (!select || !container || typeof SADHANA_CATALOG === 'undefined') return;

    const keys = Object.keys(SADHANA_CATALOG);
    select.innerHTML = keys.map(k => {
      const item = SADHANA_CATALOG[k] || {};
      return '<option value="' + k + '">' + (item.icon || '🕉️') + ' ' + escapeHtmlUtil(item.title || k) + ' (' + escapeHtmlUtil(item.category || 'Sadhana') + ' • ' + escapeHtmlUtil(item.levelScope || 'All') + ')</option>';
    }).join('');

    this.renderSadhanaDetailPreview(select.value || keys[0]);
  }

  renderSadhanaDetailPreview(sadhanaId) {
    const container = document.getElementById('sadhana-detail-preview-container');
    if (!container || typeof SADHANA_CATALOG === 'undefined') return;
    const item = SADHANA_CATALOG[sadhanaId] || SADHANA_CATALOG.sri_yantra || {};

    container.innerHTML = `
      <div class="detail-listbox-preview-card mt-3">
        <div class="detail-preview-header">
          <div class="detail-preview-title-row">
            <span class="detail-preview-icon">${item.icon || '🕉️'}</span>
            <div>
              <h4 class="detail-preview-title">${escapeHtmlUtil(item.title || sadhanaId)}</h4>
              <span style="font-size: 0.75rem; color: var(--gold-300);">${escapeHtmlUtil(item.category || 'Sacred Sadhana')} &bull; ${escapeHtmlUtil(item.levelScope || 'Universal')}</span>
            </div>
          </div>
          <button type="button" class="btn btn-xs btn-gold btn-open-sadhana-drawer-from-preview" data-sadhana="${sadhanaId}" title="Open Full Ritual Steps Drawer">
            📖 Full Prescription Drawer
          </button>
        </div>
        <div class="detail-preview-grid">
          <div class="detail-preview-item">
            <div class="detail-preview-item-label">Auspicious Timing</div>
            <div class="detail-preview-item-value">${escapeHtmlUtil(item.timing || 'Brahma Muhurta (04:00 - 06:00 AM)')}</div>
          </div>
          <div class="detail-preview-item">
            <div class="detail-preview-item-label">Aasan &amp; Direction</div>
            <div class="detail-preview-item-value">${escapeHtmlUtil(item.aasanDirection || 'East / North Facing')}</div>
          </div>
          <div class="detail-preview-item">
            <div class="detail-preview-item-label">Sacred Ingredients</div>
            <div class="detail-preview-item-value" style="font-size: 0.78rem;">${escapeHtmlUtil(item.ingredients || 'Cow Ghee Diya, Lotus Seed Mala, Gangajal')}</div>
          </div>
          <div class="detail-preview-item">
            <div class="detail-preview-item-label">Primary Benefits</div>
            <div class="detail-preview-item-value" style="font-size: 0.78rem;">${escapeHtmlUtil(item.benefits || 'Purification, Prosperity, Divine Aura')}</div>
          </div>
        </div>
        ${item.mantra ? `
          <div class="detail-preview-mantra">
            <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;">Sacred Beej Mantra</div>
            ${escapeHtmlUtil(item.mantra)}
          </div>
        ` : ''}
      </div>
    `;
  }

  showSlideToast(title, message, type = 'info', duration = 4500, actionBtn = null) {
    let container = document.getElementById('slide-in-toast-stack');
    if (!container) {
      container = document.createElement('div');
      container.id = 'slide-in-toast-stack';
      container.className = 'slide-in-toast-stack';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const validTypes = ['success', 'error', 'warning', 'info'];
    const toastType = validTypes.includes(type) ? type : 'info';
    toast.className = 'slide-toast-item slide-toast-' + toastType;

    const iconMap = {
      success: '🟢',
      error: '🔴',
      warning: '🟡',
      info: '✨'
    };

    const toastTitle = title || 'Spiritual Notification';
    const toastMsg = message || '';
    const icon = iconMap[toastType] || '🔔';

    let actionHtml = '';
    if (actionBtn && actionBtn.text && typeof actionBtn.onClick === 'function') {
      actionHtml = '<button type="button" class="btn btn-xs btn-gold mt-2 toast-action-btn">' + actionBtn.text + '</button>';
    }

    toast.innerHTML = `
      <span class="slide-toast-icon">${icon}</span>
      <div class="slide-toast-content">
        <div class="slide-toast-title">${toastTitle}</div>
        <div class="slide-toast-msg">${toastMsg}</div>
        ${actionHtml}
      </div>
      <button type="button" class="slide-toast-close" aria-label="Close Notification">&times;</button>
      <div class="slide-toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    container.appendChild(toast);

    const dismiss = () => {
      toast.classList.add('toast-closing');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 320);
    };

    toast.querySelector('.slide-toast-close').addEventListener('click', dismiss);

    if (actionHtml) {
      const btn = toast.querySelector('.toast-action-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          actionBtn.onClick();
          dismiss();
        });
      }
    }

    setTimeout(dismiss, duration);
  }

  openCustomDialog({ title = 'Spiritual Confirmation', message = '', icon = '✨', options = [] }) {
    return new Promise((resolve) => {
      let backdrop = document.getElementById('spiritual-custom-dialog-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'spiritual-custom-dialog-backdrop';
        backdrop.className = 'spiritual-dialog-backdrop';
        document.body.appendChild(backdrop);
      }

      const defaultOptions = options && options.length > 0 ? options : [
        { text: 'Confirm', type: 'btn-gold', value: true },
        { text: 'Cancel', type: 'btn-outline', value: false }
      ];

      const actionsHtml = defaultOptions.map((opt, idx) => 
        '<button type="button" class="btn ' + (opt.type || 'btn-outline') + '" data-dialog-idx="' + idx + '">' +
          opt.text +
        '</button>'
      ).join('');

      backdrop.innerHTML = `
        <div class="spiritual-dialog-box" role="dialog" aria-modal="true">
          <div class="spiritual-dialog-header">
            <span class="spiritual-dialog-icon">${icon}</span>
            <h3 class="spiritual-dialog-title">${title}</h3>
          </div>
          <div class="spiritual-dialog-body">${message}</div>
          <div class="spiritual-dialog-actions">${actionsHtml}</div>
        </div>
      `;

      backdrop.classList.add('is-active');

      const closeDialog = (resValue) => {
        backdrop.classList.remove('is-active');
        resolve(resValue);
      };

      const actionBtns = backdrop.querySelectorAll('[data-dialog-idx]');
      actionBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          const opt = defaultOptions[idx];
          if (typeof opt.action === 'function') {
            opt.action();
          }
          closeDialog(opt.value !== undefined ? opt.value : true);
        });
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeDialog(false);
        }
      });
    });
  }

  setValidationStatus(inputEl, isValid, errorMsg = '') {
    if (!inputEl) return;
    const group = inputEl.closest('.form-group') || inputEl.parentElement;
    if (!group) return;

    let msgEl = group.querySelector('.input-validation-msg');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'input-validation-msg';
      group.appendChild(msgEl);
    }

    if (isValid) {
      group.classList.remove('has-validation-error');
      group.classList.add('has-validation-success');
      msgEl.textContent = errorMsg || '✓ Valid entry';
    } else {
      group.classList.remove('has-validation-success');
      group.classList.add('has-validation-error');
      msgEl.textContent = errorMsg || '⚠️ Invalid format';
    }
  }

  showToast(titleOrMessage, messageText = '', type = 'info', duration = 4000, actionBtn = null) {
    const title = messageText ? titleOrMessage : 'Spiritual Karim System';
    const msg = messageText || titleOrMessage;
    this.showSlideToast(title, msg, type, duration, actionBtn);
  }

  showFloatingNotification(title, message, icon = '🔔', duration = 4500) {
    this.showToast(title, message, 'info', duration);
  }

  toggleJsonDrawer(forceState) {
    if (!this.jsonDrawer) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.jsonDrawer.classList.contains('open');
    if (isOpen) {
      this.jsonDrawer.classList.add('open');
      this.jsonDrawer.setAttribute('aria-hidden', 'false');
      if (this.jsonDrawerBackdrop) this.jsonDrawerBackdrop.classList.add('open');
    } else {
      this.jsonDrawer.classList.remove('open');
      this.jsonDrawer.setAttribute('aria-hidden', 'true');
      if (this.jsonDrawerBackdrop) this.jsonDrawerBackdrop.classList.remove('open');
    }
  }

  toggleImportModal(forceState) {
    if (!this.importModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.importModal.classList.contains('open');
    if (isOpen) {
      this.importModal.classList.add('open');
      this.importModal.setAttribute('aria-hidden', 'false');
    } else {
      this.importModal.classList.remove('open');
      this.importModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSettingsModal(forceState) {
    if (!this.adminSettingsModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.adminSettingsModal.classList.contains('open');
    if (isOpen) {
      this.adminSettingsModal.classList.add('open');
      this.adminSettingsModal.setAttribute('aria-hidden', 'false');
    } else {
      this.adminSettingsModal.classList.remove('open');
      this.adminSettingsModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSharePairingModal(forceState) {
    if (!this.sharePairingModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.sharePairingModal.classList.contains('open');
    if (isOpen) {
      this.sharePairingModal.classList.add('open');
      this.sharePairingModal.setAttribute('aria-hidden', 'false');
    } else {
      this.sharePairingModal.classList.remove('open');
      this.sharePairingModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleTreeModal(forceState) {
    if (!this.hierarchyTreeModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.hierarchyTreeModal.classList.contains('open');
    if (isOpen) {
      this.hierarchyTreeModal.classList.add('open');
      this.hierarchyTreeModal.setAttribute('aria-hidden', 'false');
    } else {
      this.hierarchyTreeModal.classList.remove('open');
      this.hierarchyTreeModal.setAttribute('aria-hidden', 'true');
      this.toggleTreeProfileDrawer(false);
    }
  }

  toggleTreeProfileDrawer(forceState) {
    if (!this.treeProfileDrawer) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.treeProfileDrawer.classList.contains('open');
    if (isOpen) {
      this.treeProfileDrawer.classList.add('open');
      this.treeProfileDrawer.setAttribute('aria-hidden', 'false');
      if (this.treeDrawerBackdrop) this.treeDrawerBackdrop.classList.add('open');
    } else {
      this.treeProfileDrawer.classList.remove('open');
      this.treeProfileDrawer.setAttribute('aria-hidden', 'true');
      if (this.treeDrawerBackdrop) this.treeDrawerBackdrop.classList.remove('open');
    }
  }

  _getTierDetails(profile) {
    const type = (profile.profileType || '').toUpperCase();
    const lvl = parseInt(profile.level, 10) || 1;
    if (type === 'ADMIN' || lvl === 1) {
      return { tier: 1, title: 'Admin Master (Tier 1)', roleBadge: 'Tier 1 • Founder Master', nodeClass: 'mlm-node-tier-1', icon: '👑', color: 'var(--role-admin)' };
    }
    if (type === 'HEALER' || lvl === 2) {
      return { tier: 2, title: 'Healer Connect (Tier 2)', roleBadge: 'Tier 2 • Level Completed', nodeClass: 'mlm-node-tier-2', icon: '🔮', color: 'var(--role-healer)' };
    }
    if (type === 'TRAINEE' || lvl === 3 || lvl === 4) {
      return { tier: 3, title: 'Trainee Sadhak (Tier 3)', roleBadge: 'Tier 3 • In-Progress', nodeClass: 'mlm-node-tier-3', icon: '📿', color: 'var(--role-trainee)' };
    }
    return { tier: 4, title: 'Devotee / Seeker (Tier 4)', roleBadge: 'Tier 4 • Clean & Seekers', nodeClass: 'mlm-node-tier-4', icon: '🌱', color: 'var(--role-devotee)' };
  }

  // ==========================================================================
  // IN-BODY HIERARCHY TREE & SMART FIT ENGINE (TAB 5)
  // ==========================================================================

  renderInBodyHierarchyTree(profiles = [], focusTier = null, searchQuery = '', layoutMode = 'cluster') {
    if (!this.bodySpiderwebNodesLayer || !this.bodySpiderwebSvgLayer) {
      this.bodySpiderwebNodesLayer = document.getElementById('body-spiderweb-nodes-layer');
      this.bodySpiderwebSvgLayer = document.getElementById('body-spiderweb-svg-layer');
      this.bodyTreeSurface = document.getElementById('body-tree-surface');
      this.bodyTreeCanvasViewport = document.getElementById('body-tree-canvas-viewport');
    }

    if (!profiles || profiles.length === 0) {
      if (this.bodySpiderwebNodesLayer) {
        this.bodySpiderwebNodesLayer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">No profiles available.</div>';
      }
      return;
    }

    // Update Stats & Active Tier badge
    if (this.bodyTreeTotalMembers) {
      this.bodyTreeTotalMembers.textContent = `👥 Total Members: ${profiles.length}`;
    }
    if (this.bodyTreeActiveTier) {
      this.bodyTreeActiveTier.textContent = focusTier ? `Tier Focus: Tier ${focusTier}` : 'Tier Focus: All Tiers';
    }

    // 1. Organize profiles by tier
    const tier1List = profiles.filter(p => this._getTierDetails(p).tier === 1);
    const tier2List = profiles.filter(p => this._getTierDetails(p).tier === 2);
    const tier3List = profiles.filter(p => this._getTierDetails(p).tier === 3);
    const tier4List = profiles.filter(p => this._getTierDetails(p).tier === 4);

    const rootProfile = tier1List.length > 0 ? tier1List[0] : profiles[0];
    const cleanQuery = (searchQuery || '').trim().toLowerCase();
    const connections = [];

    const renderPersonNode = (p, tier, isRoot = false) => {
      const isDevotee = tier === 4;
      const headFill = isDevotee ? '#a5f3fc' : '#1e3a8a';
      const headStroke = isDevotee ? '#0284c7' : '#93c5fd';
      const bodyFill = isDevotee ? '#a5f3fc' : '#1e3a8a';
      const bodyStroke = isDevotee ? '#0284c7' : '#93c5fd';

      const name = p.name || (isRoot ? 'Founder (Karim Ji)' : 'Seeker');
      const isMatch = cleanQuery && name.toLowerCase().includes(cleanQuery);
      const isDimmed = (cleanQuery && !isMatch) || (focusTier && focusTier !== tier);

      return `
        <div class="spiderweb-node spiderweb-node-tier-${tier} ${isRoot ? 'is-root-node' : ''} ${isMatch ? 'search-match' : ''} ${isDimmed ? 'dimmed' : ''}"
             data-profile-id="${p.id}"
             data-tier="${tier}"
             id="body-tree-node-${p.id}"
             tabindex="0"
             title="${name} (${this._getTierDetails(p).title}) • Click to view details, double click to jump to profile">
          <div class="person-icon-graphic">
            <svg viewBox="0 0 36 50" width="${isRoot ? '38' : '32'}" height="${isRoot ? '50' : '42'}" class="person-svg">
              <circle cx="18" cy="9" r="6.5" fill="${headFill}" stroke="${headStroke}" stroke-width="1.8" class="person-head" />
              <rect x="7" y="18" width="22" height="26" rx="3" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="1.8" class="person-body" />
            </svg>
          </div>
          <div class="person-node-name">${name}</div>
        </div>
      `;
    };

    let html = '';

    if (layoutMode === 'cluster') {
      // Clustered MLM Branches
      const effectiveHealers = tier2List.length > 0 ? tier2List : [{ id: 'mock-h1', name: 'Acharya Devendra', referenceCode: 'SKHM-HLR2-3344-5566' }];

      const healerBranchesHtml = effectiveHealers.map((healer, hIdx) => {
        // Track Root -> Healer link
        connections.push({ parentId: `body-tree-node-${rootProfile.id}`, childId: `body-tree-node-${healer.id}` });

        // Find trainees under this healer
        let matchedTrainees = tier3List.filter(t => t.referredByCode && t.referredByCode === healer.referenceCode);
        if (matchedTrainees.length === 0 && tier3List.length > 0) {
          matchedTrainees = tier3List.filter((_, idx) => idx % effectiveHealers.length === hIdx);
        }
        if (matchedTrainees.length === 0) {
          matchedTrainees = [{ id: `mock-t-${hIdx}-1`, name: `Trainee ${hIdx + 1}.1`, referenceCode: `T${hIdx}1` }];
        }

        const traineeColumnsHtml = matchedTrainees.map((trainee, tIdx) => {
          // Track Healer -> Trainee link
          connections.push({ parentId: `body-tree-node-${healer.id}`, childId: `body-tree-node-${trainee.id}` });

          // Find devotees under this trainee
          let matchedDevotees = tier4List.filter(d => d.referredByCode && d.referredByCode === trainee.referenceCode);
          if (matchedDevotees.length === 0 && tier4List.length > 0) {
            matchedDevotees = tier4List.filter((_, idx) => idx % matchedTrainees.length === tIdx);
          }
          if (matchedDevotees.length === 0) {
            matchedDevotees = [{ id: `mock-d-${hIdx}-${tIdx}-1`, name: `Devotee ${tIdx + 1}.A` }];
          }

          // Track Trainee -> Devotees links
          matchedDevotees.forEach(devotee => {
            connections.push({ parentId: `body-tree-node-${trainee.id}`, childId: `body-tree-node-${devotee.id}` });
          });

          const devoteesHtml = matchedDevotees.map(d => renderPersonNode(d, 4)).join('');

          return `
            <div class="tree-sub-branch-column" id="column-trainee-${trainee.id}">
              <div class="tree-cluster-node-wrap">
                ${renderPersonNode(trainee, 3)}
              </div>
              <div class="tree-leaves-row" id="leaves-devotees-${trainee.id}">
                ${devoteesHtml}
              </div>
            </div>
          `;
        }).join('');

        return `
          <div class="tree-sub-branch-column" id="column-healer-${healer.id}">
            <div class="tree-cluster-node-wrap">
              ${renderPersonNode(healer, 2)}
            </div>
            <div class="tree-sub-branches-row" id="row-trainees-${healer.id}">
              ${traineeColumnsHtml}
            </div>
          </div>
        `;
      }).join('');

      html = `
        <div class="tree-hierarchy-wrapper" id="tree-hierarchy-wrapper">
          <!-- Tier 1: Top Master Root -->
          <div class="tree-cluster-node-wrap" id="tree-root-cluster">
            ${renderPersonNode(rootProfile, 1, true)}
          </div>
          <!-- Tier 2 & Down: Healers & Sub-branches -->
          <div class="tree-sub-branches-row" id="tree-healers-row">
            ${healerBranchesHtml}
          </div>
        </div>
      `;
    } else {
      // Spiderweb Matrix Layout (4 clean rows)
      const effectiveHealers = tier2List.length > 0 ? tier2List : [{ id: 'mock-h1', name: 'Acharya Devendra' }];
      const effectiveTrainees = tier3List.length > 0 ? tier3List : [{ id: 'mock-t1', name: 'Amitabh Sen' }];
      const effectiveDevotees = tier4List.length > 0 ? tier4List : [{ id: 'mock-d1', name: 'Sunita Mehra' }];

      effectiveHealers.forEach(h => {
        connections.push({ parentId: `body-tree-node-${rootProfile.id}`, childId: `body-tree-node-${h.id}` });
      });

      effectiveTrainees.forEach((t, idx) => {
        const parentH = effectiveHealers.find(h => h.referenceCode && h.referenceCode === t.referredByCode) || effectiveHealers[idx % effectiveHealers.length];
        if (parentH) connections.push({ parentId: `body-tree-node-${parentH.id}`, childId: `body-tree-node-${t.id}` });
      });

      effectiveDevotees.forEach((d, idx) => {
        const parentT = effectiveTrainees.find(t => t.referenceCode && t.referenceCode === d.referredByCode) || effectiveTrainees[idx % effectiveTrainees.length];
        if (parentT) connections.push({ parentId: `body-tree-node-${parentT.id}`, childId: `body-tree-node-${d.id}` });
      });

      html = `
        <div class="tree-hierarchy-wrapper spiderweb-matrix-flow" id="tree-hierarchy-wrapper">
          <div class="spiderweb-level-row level-1-row" id="body-row-tier-1">
            ${renderPersonNode(rootProfile, 1, true)}
          </div>
          <div class="spiderweb-level-row level-2-row" id="body-row-tier-2">
            ${effectiveHealers.map(h => renderPersonNode(h, 2)).join('')}
          </div>
          <div class="spiderweb-level-row level-3-row" id="body-row-tier-3">
            ${effectiveTrainees.map(t => renderPersonNode(t, 3)).join('')}
          </div>
          <div class="spiderweb-level-row level-4-row" id="body-row-tier-4">
            ${effectiveDevotees.map(d => renderPersonNode(d, 4)).join('')}
          </div>
        </div>
      `;
    }

    this.bodySpiderwebNodesLayer.innerHTML = html;
    this._currentTreeConnections = connections;

    // Draw connecting bezier lines with exact coordinates
    setTimeout(() => {
      this._drawInBodyConnectingLines(connections);
    }, 50);

    // Auto smart-fit on render
    setTimeout(() => {
      this.smartFitInBodyTree();
    }, 100);
  }

  _drawInBodyConnectingLines(connections = []) {
    if (!this.bodySpiderwebSvgLayer || !this.bodySpiderwebNodesLayer) return;

    const surfaceRect = this.bodySpiderwebNodesLayer.getBoundingClientRect();
    const scale = this.inBodyTreePanState?.scale || 1.0;

    const getCenterAnchor = (elemId, isTop = false) => {
      const el = document.getElementById(elemId);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = (rect.left + rect.width / 2 - surfaceRect.left) / scale;
      const y = (isTop ? (rect.top - surfaceRect.top) : (rect.bottom - surfaceRect.top)) / scale;
      return { x, y };
    };

    let pathsSvg = `
      <defs>
        <marker id="body-spiderweb-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 10 5 L 0 8.5 z" class="body-spiderweb-arrow-marker" />
        </marker>
      </defs>
    `;

    connections.forEach(conn => {
      const pAnchor = getCenterAnchor(conn.parentId, false);
      const cAnchor = getCenterAnchor(conn.childId, true);
      if (pAnchor && cAnchor) {
        const midY = (pAnchor.y + cAnchor.y) / 2;
        pathsSvg += `<path d="M ${pAnchor.x} ${pAnchor.y} C ${pAnchor.x} ${midY}, ${cAnchor.x} ${midY}, ${cAnchor.x} ${cAnchor.y}" class="spiderweb-bezier-line" marker-end="url(#body-spiderweb-arrow)" />`;
      }
    });

    this.bodySpiderwebSvgLayer.innerHTML = pathsSvg;
  }

  smartFitInBodyTree() {
    if (!this.bodyTreeCanvasViewport || !this.bodySpiderwebNodesLayer) return;

    const wrapper = document.getElementById('tree-hierarchy-wrapper');
    if (!wrapper) return;

    const vpRect = this.bodyTreeCanvasViewport.getBoundingClientRect();
    const contentRect = wrapper.getBoundingClientRect();

    const currentScale = this.inBodyTreePanState?.scale || 1.0;
    const rawContentW = contentRect.width / currentScale;
    const rawContentH = contentRect.height / currentScale;

    const availW = vpRect.width - 60;
    const availH = vpRect.height - 70;

    if (rawContentW <= 0 || rawContentH <= 0 || availW <= 0 || availH <= 0) return;

    const targetScale = Math.min(1.0, Math.max(0.35, Math.min(availW / rawContentW, availH / rawContentH)));
    const targetPanX = Math.round((vpRect.width - rawContentW * targetScale) / 2);
    const targetPanY = Math.max(25, Math.round((vpRect.height - rawContentH * targetScale) / 2) - 15);

    this.inBodyTreePanState = {
      ...this.inBodyTreePanState,
      scale: targetScale,
      panX: targetPanX,
      panY: targetPanY,
      isDragging: false
    };

    this._applyInBodyTreeTransform(true);
  }

  zoomInBodyTree() {
    this.inBodyTreePanState.scale = Math.min(2.5, this.inBodyTreePanState.scale + 0.18);
    this._applyInBodyTreeTransform(true);
  }

  zoomOutBodyTree() {
    this.inBodyTreePanState.scale = Math.max(0.3, this.inBodyTreePanState.scale - 0.18);
    this._applyInBodyTreeTransform(true);
  }

  resetInBodyTree() {
    this.inBodyTreePanState.scale = 1.0;
    this.inBodyTreePanState.panX = 0;
    this.inBodyTreePanState.panY = 30;
    this._applyInBodyTreeTransform(true);
  }

  _applyInBodyTreeTransform(withTransition = false) {
    if (!this.bodyTreeSurface) return;
    const { panX, panY, scale } = this.inBodyTreePanState;
    if (withTransition) {
      this.bodyTreeSurface.classList.remove('no-transition');
    } else {
      this.bodyTreeSurface.classList.add('no-transition');
    }
    this.bodyTreeSurface.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  _initInBodyTreePanZoomEvents() {
    if (!this.bodyTreeCanvasViewport || this._inBodyPanZoomInitialized) return;
    this._inBodyPanZoomInitialized = true;

    // Mouse Drag (Pan Anywhere like Google Maps)
    this.bodyTreeCanvasViewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('.spiderweb-node')) return;
      this.inBodyTreePanState.isDragging = true;
      this.inBodyTreePanState.startX = e.clientX - this.inBodyTreePanState.panX;
      this.inBodyTreePanState.startY = e.clientY - this.inBodyTreePanState.panY;
      this.bodyTreeCanvasViewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.inBodyTreePanState || !this.inBodyTreePanState.isDragging) return;
      this.inBodyTreePanState.panX = e.clientX - this.inBodyTreePanState.startX;
      this.inBodyTreePanState.panY = e.clientY - this.inBodyTreePanState.startY;
      this._applyInBodyTreeTransform(false);
    });

    window.addEventListener('mouseup', () => {
      if (this.inBodyTreePanState && this.inBodyTreePanState.isDragging) {
        this.inBodyTreePanState.isDragging = false;
        if (this.bodyTreeCanvasViewport) this.bodyTreeCanvasViewport.classList.remove('is-dragging');
      }
    });

    // Mouse Wheel Zoom
    this.bodyTreeCanvasViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const newScale = Math.min(2.5, Math.max(0.3, this.inBodyTreePanState.scale * zoomFactor));
      this.inBodyTreePanState.scale = newScale;
      this._applyInBodyTreeTransform(false);
    }, { passive: false });

    // Touch Drag & Pan
    let lastTouchX = 0;
    let lastTouchY = 0;
    this.bodyTreeCanvasViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.bodyTreeCanvasViewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        this.inBodyTreePanState.panX += dx;
        this.inBodyTreePanState.panY += dy;
        this._applyInBodyTreeTransform(false);
      }
    }, { passive: true });

    // Toolbar Buttons
    if (this.btnBodySmartFit) {
      this.btnBodySmartFit.addEventListener('click', () => {
        this.smartFitInBodyTree();
        this.showToast('🎯 Smart Fit applied: Centered & scaled to viewport.');
      });
    }

    if (this.btnBodyZoomIn) {
      this.btnBodyZoomIn.addEventListener('click', () => this.zoomInBodyTree());
    }

    if (this.btnBodyZoomOut) {
      this.btnBodyZoomOut.addEventListener('click', () => this.zoomOutBodyTree());
    }

    if (this.btnBodyZoomReset) {
      this.btnBodyZoomReset.addEventListener('click', () => {
        this.resetInBodyTree();
        this.showToast('🔄 Tree view reset to 100%');
      });
    }

    if (this.btnBodyFullscreen) {
      this.btnBodyFullscreen.addEventListener('click', () => {
        if (this.bodyTreeCanvasViewport) {
          this.bodyTreeCanvasViewport.classList.toggle('is-fullscreen');
          const isFull = this.bodyTreeCanvasViewport.classList.contains('is-fullscreen');
          this.btnBodyFullscreen.innerHTML = isFull ? '<span>✕</span> <span>Exit Fullscreen</span>' : '<span>⛶</span> <span>Fullscreen</span>';
          setTimeout(() => this.smartFitInBodyTree(), 200);
        }
      });
    }

    // Window Resize -> Re-fit if on tree tab
    window.addEventListener('resize', () => {
      const activeTab = document.querySelector('.main-tab-content-panel.active');
      if (activeTab && activeTab.id === 'tab-genealogy-tree') {
        this.smartFitInBodyTree();
      }
    });
  }

  openNodeActionDialog(profile) {
    if (!this.nodeActionDialog || !this.nodeDialogBody) return;
    const details = this._getTierDetails(profile);

    if (this.nodeDialogTitle) {
      this.nodeDialogTitle.textContent = `${details.icon} ${profile.name || 'Member'} (${details.roleBadge})`;
    }

    this.nodeDialogBody.innerHTML = `
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
        Select an enterprise action to perform for <strong>${profile.name}</strong>:
      </div>
      <div class="node-options-list">
        <button type="button" class="node-option-btn" id="btn-node-opt-edit" data-profile-id="${profile.id}">
          <span>👤</span>
          <div>
            <div>Go to Profile Workspace</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">Open tabs 1-4 for complete data edit</div>
          </div>
        </button>

        <button type="button" class="node-option-btn" id="btn-node-opt-share" data-profile-id="${profile.id}">
          <span>📲</span>
          <div>
            <div>Share &amp; Invite Seeker Payload</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">Generate 24-Hour pairing link with QR code</div>
          </div>
        </button>

        <button type="button" class="node-option-btn" id="btn-node-opt-copy" data-code="${profile.referenceCode || ''}">
          <span>📋</span>
          <div>
            <div>Copy 16-Digit Reference Code</div>
            <div style="font-size: 0.75rem; color: var(--text-gold); font-family: var(--font-mono); font-weight: normal;">${profile.referenceCode || 'N/A'}</div>
          </div>
        </button>

        <button type="button" class="node-option-btn" id="btn-node-opt-inspect" data-profile-id="${profile.id}">
          <span>🔍</span>
          <div>
            <div>Inspect Downline Lineage Drawer</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">Slide out verified sadhana progress &amp; clean logs</div>
          </div>
        </button>
      </div>
    `;

    this.nodeActionDialog.classList.add('open');
    this.nodeActionDialog.setAttribute('aria-hidden', 'false');
  }

  closeNodeActionDialog() {
    if (this.nodeActionDialog) {
      this.nodeActionDialog.classList.remove('open');
      this.nodeActionDialog.setAttribute('aria-hidden', 'true');
    }
  }

  // ==========================================================================
  // LEGACY MODAL TREE VIEW (PRESERVED FOR BACKWARD COMPATIBILITY)
  // ==========================================================================

  renderHierarchyTree(profiles, focusTier = null) {
    // Forward to in-body rendering or modal
    this.renderInBodyHierarchyTree(profiles, focusTier, '', 'cluster');
  }

  _drawSpiderwebConnectingLines(root, tier2, tier3, tier4) {
    this._drawInBodyConnectingLines(root, tier2, tier3, tier4, 'cluster');
  }

  _resetTreePanZoom() {
    this.resetInBodyTree();
  }

  _applyTreeTransform() {
    this._applyInBodyTreeTransform(true);
  }

  _initTreePanZoomEvents() {
    this._initInBodyTreePanZoomEvents();
  }

  renderTreeProfileDrawer(profile) {
    if (!this.treeDrawerBody) return;
    const details = this._getTierDetails(profile);

    if (this.treeDrawerProfileName) this.treeDrawerProfileName.textContent = profile.name || 'Seeker';
    if (this.treeDrawerProfileRole) this.treeDrawerProfileRole.textContent = `${details.icon} ${details.roleBadge}`;
    if (this.btnTreeLoadProfile) this.btnTreeLoadProfile.setAttribute('data-profile-id', profile.id);

    // Calculate metadata stats
    const hcList = profile.houseCleanLevels || [];
    const hcCompleted = hcList.filter(h => h.status === 'COMPLETED' || h.cleanPercentage >= 100).length;
    const traineeList = profile.traineeSadhanas || [];
    const healerList = profile.healerCompletedSadhanas || [];
    const netList = profile.healerNetwork || [];

    const html = `
      <!-- Profile Header Summary Card -->
      <div class="tree-meta-card">
        <div class="tree-meta-heading">
          <span>${details.icon}</span> Member Identification
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Reference Code:</span>
          <span class="tree-meta-value font-mono" style="color: var(--gold-400); font-weight: 700;">${profile.referenceCode || 'N/A'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Sponsor / Mentor:</span>
          <span class="tree-meta-value font-mono">${profile.referredByCode || 'ROOT / Direct'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Active Status:</span>
          <span class="tree-meta-value">
            <span class="tree-status-chip ${profile.isActive ? 'active' : 'inactive'}">${profile.isActive ? '● Active Member' : '○ Inactive'}</span>
          </span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Payment Tier:</span>
          <span class="tree-meta-value">
            <span class="tree-status-chip ${profile.isPaid ? 'paid' : 'free'}">${profile.isPaid ? '🟢 PAID TIER' : '🔴 FREE TIER'}</span>
          </span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Joined On:</span>
          <span class="tree-meta-value">${profile.joinDate || 'N/A'}</span>
        </div>
      </div>

      <!-- Contact & Personal Card -->
      <div class="tree-meta-card">
        <div class="tree-meta-heading">
          <span>📍</span> Contact &amp; Location
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">City / Region:</span>
          <span class="tree-meta-value">${profile.city || 'Not specified'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Phone:</span>
          <span class="tree-meta-value font-mono">${profile.phone || 'N/A'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Email:</span>
          <span class="tree-meta-value">${profile.email || 'N/A'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Category Tag:</span>
          <span class="tree-meta-value">${profile.categoryTag || 'General'}</span>
        </div>
      </div>

      <!-- Spiritual Progress & Cleansing Status -->
      <div class="tree-meta-card">
        <div class="tree-meta-heading">
          <span>🧹</span> House Clean &amp; Sadhana Status
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">House Clean Levels:</span>
          <span class="tree-meta-value" style="color: ${hcCompleted > 0 ? '#10b981' : 'var(--text-secondary)'}; font-weight: 600;">
            ${hcCompleted} / ${hcList.length || 3} Completed
          </span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">In-Progress Sadhanas:</span>
          <span class="tree-meta-value">${traineeList.length} Active Practices</span>
        </div>
        ${details.tier <= 2 ? `
          <div class="tree-meta-row">
            <span class="tree-meta-label">Master Certifications:</span>
            <span class="tree-meta-value">${healerList.length} Completed</span>
          </div>
          <div class="tree-meta-row">
            <span class="tree-meta-label">Downline Devotees:</span>
            <span class="tree-meta-value">${netList.length} Connected</span>
          </div>
        ` : ''}
        ${profile.objective ? `
          <div style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--text-secondary); background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 6px;">
            <strong style="color: var(--gold-400);">Spiritual Goal:</strong><br>
            ${profile.objective.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
      </div>
    `;

    this.treeDrawerBody.innerHTML = html;
  }

  // ==========================================================================
  // ANDROID COMPOSE ALIGNED: HEALERS HUB & RECURSIVE HIERARCHY TREE METHODS
  // ==========================================================================

  renderAndroidHealersHub(scopedProfiles = [], activeProfile = null, roleMode = 'MASTER') {
    // 1. Summary Metrics
    const isMaster = roleMode === 'MASTER' || roleMode === 'ADMIN';
    const isHealer = roleMode === 'HEALER';
    const isTrainee = roleMode === 'TRAINEE';
    const isDevotee = roleMode === 'DEVOTEE';

    const rawAdmin = scopedProfiles.filter(p => p.profileType === 'ADMIN' || p.level === 1).length;
    const rawHealers = scopedProfiles.filter(p => p.profileType === 'HEALER' || p.level === 2 || p.level === 3).length;
    const rawTrainees = scopedProfiles.filter(p => p.profileType === 'TRAINEE' || p.level === 4).length;
    const rawDevotees = scopedProfiles.filter(p => p.profileType === 'DEVOTEE' || p.level === 5).length;

    const adminCount = isMaster ? rawAdmin : 0;
    const healersCount = (isMaster || isHealer) ? rawHealers : 0;
    const traineesCount = (isMaster || isHealer || isTrainee) ? rawTrainees : 0;
    const devoteesCount = rawDevotees;
    const totalCount = adminCount + healersCount + traineesCount + devoteesCount;

    if (this.hubMetricTotal) this.hubMetricTotal.textContent = totalCount;
    if (this.hubMetricAdmin) this.hubMetricAdmin.textContent = adminCount;
    if (this.hubMetricHealers) this.hubMetricHealers.textContent = healersCount;
    if (this.hubMetricTrainees) this.hubMetricTrainees.textContent = traineesCount;
    if (this.hubMetricDevotees) this.hubMetricDevotees.textContent = devoteesCount;

    // 2. Category Filter Chip Counts
    const setChipText = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };
    setChipText('chip-cnt-all', totalCount);
    setChipText('chip-cnt-admin', adminCount);
    setChipText('chip-cnt-healers', healersCount);
    setChipText('chip-cnt-trainees', traineesCount);
    setChipText('chip-cnt-devotees', devoteesCount);

    // 3. Filter List by Category & Search Query
    const query = (this.healersSearchQuery || '').trim().toLowerCase();
    const category = this.healersSelectedCategory || 'ALL';

    const filtered = scopedProfiles.filter(p => {
      const matchesCategory = category === 'ALL' || p.profileType === category;
      const matchesQuery = !query ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.referenceCode && p.referenceCode.toLowerCase().includes(query)) ||
        (p.phone && p.phone.includes(query)) ||
        (p.city && p.city.toLowerCase().includes(query)) ||
        (p.level && p.level.toString() === query);
      return matchesCategory && matchesQuery;
    });

    if (!this.healersHubCardsContainer) {
      this.healersHubCardsContainer = document.getElementById('healers-hub-cards-container');
    }
    if (!this.healersHubCardsContainer) return;

    const gridBtn = document.getElementById('btn-layout-grid');
    const tableBtn = document.getElementById('btn-layout-table');
    const gridContainer = this.healersHubCardsContainer;
    const tableContainer = document.getElementById('healers-hub-table-container');

    if (gridBtn && tableBtn) {
      gridBtn.classList.toggle('active', this.directoryLayout === 'GRID');
      tableBtn.classList.toggle('active', this.directoryLayout === 'TABLE');
    }

    if (this.directoryLayout === 'TABLE' && tableContainer) {
      if (gridContainer) gridContainer.style.display = 'none';
      tableContainer.style.display = 'block';
      tableContainer.innerHTML = `
        <table class="healers-hub-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role Tier</th>
              <th>16-Digit Code</th>
              <th>Sponsor Mentor</th>
              <th>Phone / WhatsApp</th>
              <th>City</th>
              <th>Stamp</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => `
              <tr class="healer-table-row" data-id="${p.id}">
                <td>
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <div class="avatar-circle ${getAvatarClass(p)}" style="width: 32px; height: 32px; font-size: 0.78rem;">${(p.name || 'U').substring(0, 2).toUpperCase()}</div>
                    <strong style="color: var(--gold-300);">${escapeHtmlUtil(p.name || 'Untitled')}</strong>
                  </div>
                </td>
                <td><span class="badge-status-pill ${getBadgeClass(p)}">${escapeHtmlUtil(p.profileType)} (L${p.level || 1})</span></td>
                <td><code class="font-mono" style="font-size: 0.78rem; color: var(--gold-400);">${escapeHtmlUtil(p.referenceCode || 'N/A')}</code></td>
                <td><code class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtmlUtil(p.referredByCode || 'ROOT')}</code></td>
                <td>${escapeHtmlUtil(p.phone || 'N/A')}</td>
                <td>${escapeHtmlUtil(p.city || 'N/A')}</td>
                <td><span class="stamp-badge ${p.paymentStatus === 'PAID' ? 'stamp-paid' : 'stamp-free'}">${p.paymentStatus || 'PAID'}</span></td>
                <td style="text-align: right;">
                  <button type="button" class="btn btn-xs btn-gold btn-hub-select-profile" data-id="${p.id}">View Profile</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      return;
    } else {
      if (tableContainer) tableContainer.style.display = 'none';
      if (gridContainer) gridContainer.style.display = 'grid';
    }


    if (filtered.length === 0) {
      this.healersHubCardsContainer.innerHTML = `
        <div class="healers-empty-state">
          <div class="healers-empty-state-icon">🔍</div>
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">No profiles found</div>
          <div style="font-size: 0.82rem;">No member profiles match "${query || category}". Try adjusting search filters.</div>
        </div>
      `;
      return;
    }

    const getAvatarClass = (p) => {
      if (p.profileType === 'ADMIN' || p.level === 1) return 'avatar-admin';
      if (p.profileType === 'HEALER' || p.level === 2 || p.level === 3) return 'avatar-healer';
      if (p.profileType === 'TRAINEE' || p.level === 4) return 'avatar-trainee';
      return 'avatar-devotee';
    };

    const getBadgeClass = (p) => {
      if (p.profileType === 'ADMIN' || p.level === 1) return 'badge-pill-admin';
      if (p.profileType === 'HEALER' || p.level === 2 || p.level === 3) return 'badge-pill-healer';
      if (p.profileType === 'TRAINEE' || p.level === 4) return 'badge-pill-trainee';
      return 'badge-pill-devotee';
    };

    const getRoleName = (p) => {
      if (p.profileType === 'ADMIN' || p.level === 1) return 'Founder Master';
      if (p.profileType === 'HEALER' || p.level === 2 || p.level === 3) return 'Spiritual Healer';
      if (p.profileType === 'TRAINEE' || p.level === 4) return 'Mentorship Trainee';
      return 'Devotee Seeker';
    };

    this.healersHubCardsContainer.innerHTML = filtered.map(p => {
      const remediesCount = (p.selectedRemedies || []).length;
      const isCurrentActive = activeProfile && activeProfile.id === p.id;

      return `
        <div class="healer-member-card ${isCurrentActive ? 'active-member-card' : ''}" data-profile-id="${p.id}" style="${isCurrentActive ? 'border-color: var(--gold-400); background: rgba(212, 175, 55, 0.08);' : ''}">
          <!-- Level Avatar Box -->
          <div class="healer-member-avatar-box ${getAvatarClass(p)}">
            L${p.level || 1}
          </div>

          <!-- Main Info -->
          <div class="healer-member-info">
            <div class="healer-member-name-row">
              <span class="healer-member-name">${p.name || 'Member'}</span>
              <span class="healer-role-badge-pill ${getBadgeClass(p)}">${getRoleName(p)}</span>
              ${p.isPaid ? '<span class="stamp-indicator stamp-paid" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">PAID</span>' : '<span class="stamp-indicator stamp-free" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">FREE</span>'}
            </div>

            <div class="healer-member-contact">
              ${p.phone || '+91 98000 00000'} • ${p.city || 'National'}
            </div>

            <!-- 16-Digit Reference Code Pill with Copy -->
            <div>
              <span class="healer-ref-code-pill btn-copy-card-code" data-code="${p.referenceCode}" title="Click to copy 16-digit reference code">
                <span>📱</span>
                <span class="healer-ref-code-text">${p.referenceCode || 'SKHM-0000-0000-0000'}</span>
                <span style="font-size: 0.72rem; color: var(--text-muted);">📋</span>
              </span>
            </div>

            <!-- Referred By & Remedy Pill -->
            <div class="healer-member-meta-row">
              <span>Sponsor: ${(p.referredByCode || 'ROOT-0000-0000-0000').substring(0, 14)}...</span>
              ${remediesCount > 0 ? `<span class="healer-remedy-count-pill">🌿 ${remediesCount} Remedies</span>` : ''}
            </div>
          </div>

          <!-- 3-Dots Action Menu Trigger -->
          <div style="position: relative;">
            <button type="button" class="healer-card-actions-menu-btn btn-member-quick-opts" data-profile-id="${p.id}" title="Member Actions">
              ⋮
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAndroidHierarchyTree(profiles = [], levelFilter = 'ALL', activeProfile = null, treeScope = 'downline') {
    if (!this.hierarchyRecursiveTreeView) {
      this.hierarchyRecursiveTreeView = document.getElementById('hierarchy-recursive-tree-view');
    }
    if (!this.hierarchyRecursiveTreeView) return;

    const allProfiles = profiles || [];
    const focusNode = activeProfile || (this.allProfiles ? this.allProfiles[0] : allProfiles[0]);
    if (!focusNode) {
      this.hierarchyRecursiveTreeView.innerHTML = '<div class="healers-empty-state"><div class="healers-empty-state-icon">🌳</div><div>No tree members found.</div></div>';
      return;
    }

    // 1. Update Level Filter Chip Counts
    const setTreeCount = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };
    setTreeCount('tree-cnt-all', allProfiles.length);
    setTreeCount('tree-cnt-1', allProfiles.filter(p => p.level === 1 || p.profileType === 'ADMIN').length);
    setTreeCount('tree-cnt-2', allProfiles.filter(p => p.level === 2 || p.profileType === 'HEALER').length);
    setTreeCount('tree-cnt-3', allProfiles.filter(p => p.level === 3).length);
    setTreeCount('tree-cnt-4', allProfiles.filter(p => p.level === 4 || p.profileType === 'TRAINEE').length);
    setTreeCount('tree-cnt-5', allProfiles.filter(p => p.level === 5 || p.profileType === 'DEVOTEE').length);

    // 2. Build Ancestral Upline Breadcrumb Path (Top of Tree)
    const breadcrumbChain = [];
    let currentTrace = focusNode;
    const visitedCodes = new Set();

    while (currentTrace && !visitedCodes.has(currentTrace.referenceCode)) {
      visitedCodes.add(currentTrace.referenceCode);
      breadcrumbChain.unshift(currentTrace);
      if (!currentTrace.referredByCode || currentTrace.referredByCode === 'ROOT' || currentTrace.referredByCode === 'ROOT-0000-0000-0000') {
        break;
      }
      const parent = allProfiles.find(p => p.referenceCode === currentTrace.referredByCode);
      if (!parent || parent.id === currentTrace.id) break;
      currentTrace = parent;
    }

    const breadcrumbHtml = breadcrumbChain.map((node, idx) => {
      const isCurrent = node.id === focusNode.id;
      const roleIcon = node.profileType === 'ADMIN' ? '👑' : (node.profileType === 'HEALER' ? '🛡️' : (node.profileType === 'TRAINEE' ? '🌿' : '🌟'));
      return `
        <span class="tree-breadcrumb-item ${isCurrent ? 'current-node' : 'btn-jump-profile-trigger'}" data-profile-id="${node.id}" title="Jump to ${node.name}">
          ${roleIcon} ${node.name}
        </span>
        ${idx < breadcrumbChain.length - 1 ? '<span class="tree-breadcrumb-sep">➔</span>' : ''}
      `;
    }).join('');

    // 3. Calculate Direct and Total Downline Sub-tree for Focus Node
    const getDownlineMembers = (parentCode, visited = new Set()) => {
      const list = [];
      const direct = allProfiles.filter(p => p.referredByCode === parentCode && p.id !== focusNode.id);
      for (const d of direct) {
        if (!visited.has(d.referenceCode)) {
          visited.add(d.referenceCode);
          list.push(d);
          list.push(...getDownlineMembers(d.referenceCode, visited));
        }
      }
      return list;
    };

    const directChildren = allProfiles.filter(p => p.referredByCode === focusNode.referenceCode && p.id !== focusNode.id);
    const totalDownlines = getDownlineMembers(focusNode.referenceCode);
    const isPaid = focusNode.isPaid !== false && focusNode.paymentStatus !== 'FREE';
    const initials = (focusNode.name || 'SK').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    // 4. Render Top Focus Node Banner
    const topBannerHtml = `
      <div class="tree-focus-top-banner">
        <div class="tree-ancestral-breadcrumb">
          <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Lineage Path:</span>
          ${breadcrumbHtml}
        </div>

        <div class="tree-focus-profile-row">
          <div class="tree-focus-avatar-group">
            <div class="tree-focus-avatar">${initials}</div>
            <div>
              <div class="tree-focus-title">${focusNode.name}</div>
              <div class="tree-focus-sub">
                <span class="role-badge" style="font-size: 0.68rem; padding: 0.15rem 0.5rem;">${focusNode.profileType} • LVL ${focusNode.level || 1}</span>
                <span style="font-family: monospace;">${focusNode.referenceCode}</span>
                <span class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'}" style="font-size: 0.65rem;">${isPaid ? 'PAID' : 'FREE'}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button type="button" class="btn btn-xs btn-outline btn-toggle-tree-view-scope" data-scope="${treeScope === 'downline' ? 'org' : 'downline'}" title="Switch between scoped downline and full org tree">
              ${treeScope === 'downline' ? '🌐 View Entire Org Tree' : '🎯 View Focus Downlines'}
            </button>
          </div>
        </div>

        <div class="tree-metrics-bar">
          <div class="tree-metric-box">
            <div class="tree-metric-label">Direct Referrals (L1)</div>
            <div class="tree-metric-val">${directChildren.length}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Total Downlines</div>
            <div class="tree-metric-val">${totalDownlines.length}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Upline Sponsor</div>
            <div class="tree-metric-val" style="font-size: 0.75rem; font-family: monospace;">${focusNode.referredByCode || 'ROOT'}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Network Status</div>
            <div class="tree-metric-val" style="color: #10b981; font-size: 0.8rem;">🟢 ACTIVE</div>
          </div>
        </div>
      </div>
    `;

    // 5. Render Recursive Downline Nodes
    let treeBodyHtml = '';

    if (levelFilter !== 'ALL') {
      const targetLvl = parseInt(levelFilter, 10);
      const levelRoots = allProfiles.filter(p => p.level === targetLvl || (targetLvl === 1 && p.profileType === 'ADMIN') || (targetLvl === 2 && (p.level === 2 || p.profileType === 'HEALER')) || (targetLvl === 3 && p.level === 3) || (targetLvl === 4 && (p.level === 4 || p.profileType === 'TRAINEE')) || (targetLvl === 5 && (p.level === 5 || p.profileType === 'DEVOTEE')));

      let totalConnectedUnderLevel = 0;
      levelRoots.forEach(r => {
        totalConnectedUnderLevel += getDownlineMembers(r.referenceCode).length;
      });

      treeBodyHtml = `
        <div class="tree-scope-title" style="margin-bottom: 0.85rem; color: var(--gold-400);">
          <span>🌳</span> Level Generation ${targetLvl} Lineages &amp; Downlines (${levelRoots.length} Root Nodes • ${totalConnectedUnderLevel} Connected Downlines)
        </div>
        ${levelRoots.length > 0 ? levelRoots.map(root => this._renderRecursiveTreeBranchHtml(root, allProfiles, 0)).join('') : '<div class="healers-empty-state"><div class="healers-empty-state-icon">🌱</div><div>No members found at Level ' + targetLvl + '</div></div>'}
      `;
    } else if (treeScope === 'downline') {
      // Scoped Downline Tree under Focus Node
      if (directChildren.length === 0) {
        treeBodyHtml = `
          <div class="healers-empty-state" style="background: rgba(0,0,0,0.25); border: 1px dashed rgba(212,175,55,0.25); border-radius: 0.75rem; padding: 2rem 1rem;">
            <div class="healers-empty-state-icon">🌱</div>
            <div style="font-weight: 700; color: var(--gold-400); margin-bottom: 0.35rem;">No Downline Disciples Yet under ${focusNode.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1rem auto;">
              Share reference code <strong>${focusNode.referenceCode}</strong> or 24-Hour pairing invite from the top bar to connect new trainees and seekers under this lineage.
            </div>
            <div style="display: flex; justify-content: center; gap: 0.6rem;">
              <button type="button" class="btn btn-sm btn-gold" id="btn-tree-copy-invite" data-code="${focusNode.referenceCode}">
                📋 Copy Invite Code
              </button>
              <button type="button" class="btn btn-sm btn-outline btn-toggle-tree-view-scope" data-scope="org">
                🌐 View Full Organization Tree (${allProfiles.length})
              </button>
            </div>
          </div>
        `;
      } else {
        treeBodyHtml = `
          <div class="tree-scope-title" style="margin-bottom: 0.75rem; color: var(--gold-400);">
            <span>🌿</span> Connected Downlines under ${focusNode.name} (${totalDownlines.length} Members)
          </div>
          ${this._renderRecursiveTreeBranchHtml(focusNode, allProfiles, 0)}
        `;
      }
    } else {
      // Full Organization Tree (starting from root level 1 nodes)
      const allRefCodes = new Set(allProfiles.map(p => p.referenceCode));
      const rootProfiles = allProfiles.filter(p => p.level === 1 || p.profileType === 'ADMIN' || !allRefCodes.has(p.referredByCode));
      const effectiveRoots = rootProfiles.length > 0 ? rootProfiles : [allProfiles[0]];

      treeBodyHtml = `
        <div class="tree-scope-title" style="margin-bottom: 0.75rem; color: var(--gold-400);">
          <span>🌐</span> Full Organization Lineage Tree (${allProfiles.length} Members)
        </div>
        ${effectiveRoots.map(root => this._renderRecursiveTreeBranchHtml(root, allProfiles, 0)).join('')}
      `;
    }

    this.hierarchyRecursiveTreeView.innerHTML = topBannerHtml + treeBodyHtml;
  }

  _renderRecursiveTreeBranchHtml(node, allProfiles, indentDp) {
    const children = allProfiles.filter(p => p.referredByCode && p.referredByCode === node.referenceCode && p.id !== node.id);
    const hasChildren = children.length > 0;
    const isExpanded = true;

    const childrenHtml = hasChildren ? `
      <div class="hierarchy-node-children-branch" id="tree-branch-${node.id}">
        ${children.map(child => this._renderRecursiveTreeBranchHtml(child, allProfiles, indentDp + 16)).join('')}
      </div>
    ` : '';

    return `
      <div class="hierarchy-tree-node-wrapper" data-node-id="${node.id}">
        ${this._renderHierarchyNodeCardHtml(node, hasChildren, isExpanded, children.length, allProfiles)}
        ${childrenHtml}
      </div>
    `;
  }

  _renderHierarchyNodeCardHtml(profile, hasChildren = false, isExpanded = true, directChildrenCount = 0, allProfiles = []) {
    const getAvatarBg = (p) => {
      if (p.profileType === 'ADMIN' || p.level === 1) return 'linear-gradient(135deg, #7a1c37, #b91c1c)';
      if (p.profileType === 'HEALER' || p.level === 2 || p.level === 3) return 'linear-gradient(135deg, #fcb900, #d97706)';
      if (p.profileType === 'TRAINEE' || p.level === 4) return 'linear-gradient(135deg, #00d084, #059669)';
      return 'linear-gradient(135deg, #0088cc, #2563eb)';
    };

    return `
      <div class="hierarchy-node-card-item" data-profile-id="${profile.id}">
        ${hasChildren ? `
          <button type="button" class="hierarchy-node-expand-btn btn-toggle-tree-branch" data-node-id="${profile.id}" title="Expand / Collapse Branch">
            ${isExpanded ? '−' : '+'}
          </button>
        ` : '<span style="width: 24px;"></span>'}

        <!-- Level Circle -->
        <div class="hierarchy-node-level-circle" style="background: ${getAvatarBg(profile)};">
          L${profile.level || 1}
        </div>

        <!-- Node Info (Click to jump to profile) -->
        <div class="hierarchy-node-content btn-jump-profile-trigger" data-profile-id="${profile.id}" title="Click to view full details for ${profile.name}">
          <div class="hierarchy-node-title-row">
            <span class="hierarchy-node-name">${profile.name || 'Member'}</span>
            ${profile.isPaid ? '<span style="font-size: 0.65rem; color: #10b981; font-weight: 700;">● PAID</span>' : '<span style="font-size: 0.65rem; color: #ef4444; font-weight: 700;">○ FREE</span>'}
            ${directChildrenCount > 0 ? `<span style="font-size: 0.65rem; color: var(--gold-400); font-weight: 700; background: rgba(212,175,55,0.12); padding: 0.1rem 0.4rem; border-radius: 999px;">👥 ${directChildrenCount} Direct</span>` : ''}
          </div>
          <div class="hierarchy-node-details">
            ${profile.profileType || 'DEVOTEE'} • ${profile.referenceCode || 'SKHM-0000'} ${profile.referredByCode ? '• Sponsor: ' + profile.referredByCode : ''}
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="hierarchy-node-actions-row">
          <button type="button" class="hierarchy-node-action-btn btn-share-tree-node" data-profile-id="${profile.id}" title="Share Node Reference">
            📲 Share
          </button>
          <button type="button" class="hierarchy-node-action-btn btn-jump-profile-trigger" data-profile-id="${profile.id}" title="Inspect Details">
            👁️ View
          </button>
        </div>
      </div>
    `;
  }


  _escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // -------------------------------------------------------------
  // FIREBASE REALTIME DATABASE STRUCTURED DRILL-DOWN TABLE VIEW
  // -------------------------------------------------------------
  renderFirebaseDataTable(model) {
    const tbody = document.getElementById('rtdb-table-tbody');
    if (!tbody || !model) return;

    const fullTree = model.getFirebaseRealtimeTree();
    const rootsCount = Object.keys(fullTree).length;
    
    // Update Stats & Sidebar
    const statRootsEl = document.getElementById('rtdb-stat-roots');
    const sidebarCountEl = document.getElementById('sidebar-rtdb-root-count');
    const statKeysEl = document.getElementById('rtdb-stat-keys');
    const statNodesEl = document.getElementById('rtdb-stat-nodes');
    const lastSyncEl = document.getElementById('rtdb-stat-last-sync');

    if (statRootsEl) statRootsEl.textContent = `${rootsCount} Collections`;
    if (sidebarCountEl) sidebarCountEl.textContent = `${rootsCount} Collections`;
    if (statKeysEl) statKeysEl.textContent = `~${model.profiles.length * 7 + 35} Indexed Keys`;
    if (statNodesEl) statNodesEl.textContent = `${model.profiles.length} Online Nodes`;
    if (lastSyncEl) lastSyncEl.textContent = new Date().toLocaleTimeString();

    // Render Breadcrumbs
    this._renderRtdbBreadcrumbs();

    // Filter tree according to root selection & search
    let targetTree = fullTree;
    if (this.rtdbActiveRootFilter !== 'ALL' && fullTree[this.rtdbActiveRootFilter] !== undefined) {
      targetTree = { [this.rtdbActiveRootFilter]: fullTree[this.rtdbActiveRootFilter] };
    }

    // Generate Rows Recursively
    let rowsHtml = '';
    for (const [key, value] of Object.entries(targetTree)) {
      rowsHtml += this._generateRtdbRowHtml(key, value, key, 0);
    }

    if (!rowsHtml) {
      rowsHtml = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
        🔍 No matching Realtime Database nodes found for search "${this.rtdbSearchQuery}".
      </td></tr>`;
    }

    tbody.innerHTML = rowsHtml;
  }

  _renderRtdbBreadcrumbs() {
    const bcContainer = document.getElementById('rtdb-breadcrumbs');
    if (!bcContainer) return;

    let html = `<span class="rtdb-bc-item rtdb-bc-root" data-rtdb-bc="/">🔥 root</span>`;
    if (this.rtdbActiveBreadcrumbPath && this.rtdbActiveBreadcrumbPath !== '/') {
      const parts = this.rtdbActiveBreadcrumbPath.replace(/^\/+/, '').split('/');
      let accumulated = '';
      parts.forEach(part => {
        accumulated += '/' + part;
        html += ` <span class="rtdb-bc-sep">/</span> <span class="rtdb-bc-item" data-rtdb-bc="${accumulated}">${part}</span>`;
      });
    }
    bcContainer.innerHTML = html;
  }

  _generateRtdbRowHtml(key, value, currentPath, depth) {
    const esc = (s) => { if (s === null || s === undefined) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); };
    const isObject = value !== null && typeof value === 'object';
    const isArray = Array.isArray(value);
    const isExpanded = this.rtdbExpandedPaths.has(currentPath);

    // Search query matching
    const search = (this.rtdbSearchQuery || '').toLowerCase().trim();
    if (search) {
      const matchesKey = key.toLowerCase().includes(search);
      const matchesPath = currentPath.toLowerCase().includes(search);
      const matchesVal = !isObject && String(value).toLowerCase().includes(search);
      const matchesChild = isObject && JSON.stringify(value).toLowerCase().includes(search);
      if (!matchesKey && !matchesPath && !matchesVal && !matchesChild) {
        return '';
      }
    }

    // Type definition
    let typeName = typeof value;
    if (value === null) typeName = 'null';
    else if (isArray) typeName = 'array';
    else if (isObject) typeName = 'object';

    // Type Badge CSS
    const typeBadgeClass = `type-${typeName}`;
    let typeBadgeLabel = typeName.toUpperCase();
    if (isArray) typeBadgeLabel = `ARRAY [${value.length}]`;
    else if (isObject) typeBadgeLabel = `OBJECT {${Object.keys(value).length}}`;

    // Security Level
    const secBadge = this._getRtdbSecurityBadge(currentPath);

    // Value Preview HTML
    let valPreviewHtml = '';
    if (isArray) {
      valPreviewHtml = `<span class="rtdb-val-preview rtdb-val-object">[ ${value.length} items ]</span>`;
    } else if (isObject) {
      const keys = Object.keys(value);
      valPreviewHtml = `<span class="rtdb-val-preview rtdb-val-object">{ ${keys.slice(0, 4).join(', ')}${keys.length > 4 ? ', ...' : ''} }</span>`;
    } else if (typeof value === 'string') {
      valPreviewHtml = `<span class="rtdb-val-preview rtdb-val-string" title="${esc(value)}">"${esc(value.length > 65 ? value.slice(0, 65) + '...' : value)}"</span>`;
    } else if (typeof value === 'number') {
      valPreviewHtml = `<span class="rtdb-val-preview rtdb-val-number">${value}</span>`;
    } else if (typeof value === 'boolean') {
      valPreviewHtml = `<span class="rtdb-val-preview rtdb-val-boolean">${value ? 'true' : 'false'}</span>`;
    } else {
      valPreviewHtml = `<span class="rtdb-val-preview" style="color: #94a3b8;">null</span>`;
    }

    // Icon Selection
    let icon = '📄';
    if (depth === 0) icon = '📁';
    else if (isArray) icon = '📑';
    else if (isObject) icon = '🗂️';
    else if (typeof value === 'string') icon = '🔤';
    else if (typeof value === 'number') icon = '🔢';
    else if (typeof value === 'boolean') icon = '🔘';

    const indentWidth = depth * 20;

    let rowHtml = `
      <tr class="rtdb-row" data-rtdb-path="${currentPath}">
        <td>
          <div class="rtdb-key-cell" style="padding-left: ${indentWidth}px;">
            ${isObject ? `
              <button type="button" class="rtdb-toggle-btn ${isExpanded ? 'expanded' : ''}" data-rtdb-toggle="${currentPath}" title="${isExpanded ? 'Collapse' : 'Expand'}">
                ${isExpanded ? '▼' : '▶'}
              </button>
            ` : `<span style="display: inline-block; width: 1.3rem;"></span>`}
            <span class="rtdb-key-icon">${icon}</span>
            <span class="rtdb-key-name">${esc(key)}</span>
            ${isObject ? `<span class="rtdb-key-count">${isArray ? value.length + ' items' : Object.keys(value).length + ' keys'}</span>` : ''}
          </div>
        </td>
        <td>
          <span class="rtdb-type-badge ${typeBadgeClass}">${typeBadgeLabel}</span>
        </td>
        <td>
          ${valPreviewHtml}
        </td>
        <td>
          ${secBadge}
        </td>
        <td>
          <div class="rtdb-row-actions">
            <button type="button" class="rtdb-btn-action" data-rtdb-inspect="${currentPath}" title="Inspect Node &amp; Edit JSON">
              🔍
            </button>
            <button type="button" class="rtdb-btn-action" data-rtdb-copy="${currentPath}" title="Copy Path or Value">
              📋
            </button>
            ${isObject ? `
              <button type="button" class="rtdb-btn-action" data-rtdb-add-child="${currentPath}" title="Add Child Key">
                ➕
              </button>
            ` : ''}
            ${depth > 0 ? `
              <button type="button" class="rtdb-btn-action rtdb-btn-danger" data-rtdb-delete="${currentPath}" title="Delete Key">
                🗑️
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;

    // Recurse children if expanded or search is active
    if (isObject && (isExpanded || search)) {
      if (isArray) {
        value.forEach((item, idx) => {
          rowHtml += this._generateRtdbRowHtml(String(idx), item, `${currentPath}/${idx}`, depth + 1);
        });
      } else {
        for (const [subKey, subVal] of Object.entries(value)) {
          rowHtml += this._generateRtdbRowHtml(subKey, subVal, `${currentPath}/${subKey}`, depth + 1);
        }
      }
    }

    return rowHtml;
  }

  _getRtdbSecurityBadge(pathStr) {
    if (pathStr.startsWith('system_config') || pathStr.startsWith('audit_logs')) {
      return '<span class="rtdb-security-badge sec-admin">🛡️ Admin</span>';
    }
    if (pathStr.startsWith('sadhana_catalog')) {
      return '<span class="rtdb-security-badge sec-public">🌐 Public</span>';
    }
    return '<span class="rtdb-security-badge sec-auth">🔒 Auth</span>';
  }

  openRtdbInspector(pathStr, nodeData) {
    const modal = document.getElementById('rtdb-inspector-modal');
    if (!modal) return;

    const pathEl = document.getElementById('rtdb-inspector-path');
    const typeEl = document.getElementById('rtdb-inspector-type');
    const sizeEl = document.getElementById('rtdb-inspector-size');
    const editor = document.getElementById('rtdb-inspector-json-editor');
    const statusEl = document.getElementById('rtdb-inspector-status');

    if (pathEl) pathEl.textContent = `/${pathStr}`;
    
    const isObject = nodeData !== null && typeof nodeData === 'object';
    const isArray = Array.isArray(nodeData);
    let typeName = typeof nodeData;
    if (nodeData === null) typeName = 'NULL';
    else if (isArray) typeName = 'ARRAY';
    else if (isObject) typeName = 'OBJECT';
    else typeName = typeName.toUpperCase();

    if (typeEl) {
      typeEl.textContent = typeName;
      typeEl.className = `rtdb-type-badge type-${typeName.toLowerCase()}`;
    }

    if (sizeEl) {
      if (isArray) sizeEl.textContent = `${nodeData.length} items`;
      else if (isObject) sizeEl.textContent = `${Object.keys(nodeData).length} keys`;
      else sizeEl.textContent = `Primitive Value`;
    }

    if (editor) {
      editor.value = typeof nodeData === 'object' ? JSON.stringify(nodeData, null, 2) : String(nodeData);
      editor.setAttribute('data-target-path', pathStr);
    }

    if (statusEl) statusEl.textContent = 'Ready to edit or copy';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  openRtdbAddModal(parentPath) {
    const modal = document.getElementById('rtdb-add-node-modal');
    if (!modal) return;

    const pathInput = document.getElementById('rtdb-add-target-path');
    const keyInput = document.getElementById('rtdb-add-key-name');
    const valInput = document.getElementById('rtdb-add-value');

    if (pathInput) pathInput.value = parentPath ? `/${parentPath}` : '/system_config';
    if (keyInput) keyInput.value = '';
    if (valInput) valInput.value = '';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

}// ============================================================== 
// 4. CONTROLLER LAYER (INTERCONNECTING ALL TABS & DRAWER ACTIONS)
// ==============================================================

if (typeof window !== 'undefined') {
  window.ProfileView = ProfileView;
}
