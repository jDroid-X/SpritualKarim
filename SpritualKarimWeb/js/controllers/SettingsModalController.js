/**
 * Settings Modal Controller - Left Panel Navigation
 * Handles: General, Permissions, Auth Matrix, RBAC Roles, Register Devotee
 */

// Settings Section Data
const SETTINGS_SECTIONS = {
  general: {
    title: "General Settings",
    icon: "🏛️",
  },
  permissions: {
    title: "Permissions Configuration",
    icon: "🔐",
  },
  "role-matrix": {
    title: "Role Matrix Hub (Profiles, RBAC & Screens)",
    icon: "👥",
  },
  "rbac-admin": {
    title: "RBAC Access Matrix (rbac-admin.html)",
    icon: "🛡️",
  },
  "auth-matrix": {
    title: "Screen Authorization Matrix",
    icon: "🛡️",
  },
  rbac: {
    title: "Role-Based Access Control",
    icon: "⚖️",
  },
  "register-devotee": {
    title: "Register New Devotee",
    icon: "📝",
  },
  "catalog-editor": {
    title: "Sadhana & Remedy Catalog",
    icon: "📖",
  },
  "ui-ux-controls": {
    title: "Interactive UI/UX Component Suite",
    icon: "🎛️",
  }
};

// ProfileController Extensions
class SettingsModalController {
  constructor(controller) {
    this.controller = controller;
    this.currentSection = "general";
    this.currentRoleSubtab = "profile-roles";
    this.init();
  }

  init() {
    this._bindNavigation();
    this._bindActions();
    this._loadCurrentSettings();
  }

  _bindNavigation() {
    // Left panel navigation items
    document.querySelectorAll(".settings-nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const section = e.currentTarget.getAttribute("data-section");
        this._switchSection(section);
      });
    });

    // Role Matrix Sub-tabs
    document.querySelectorAll(".role-matrix-subnav .btn-subtab").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const subtab = e.currentTarget.getAttribute("data-subtab");
        this._switchRoleMatrixSubtab(subtab);
      });
    });
  }

  _bindActions() {
    // Save button
    const btnSave = document.getElementById("btn-save-settings-modal");
    if (btnSave) {
      btnSave.addEventListener("click", () => this._saveSettings());
    }

    // Cancel button
    const btnCancel = document.getElementById("btn-cancel-settings-modal");
    if (btnCancel) {
      btnCancel.addEventListener("click", () => this._closeModal());
    }

    // Reset button
    const btnReset = document.getElementById("btn-reset-settings-modal");
    if (btnReset) {
      btnReset.addEventListener("click", () => this._resetSettings());
    }

    // Auth matrix buttons
    const btnResetMatrix = document.getElementById(
      "btn-reset-auth-matrix-modal",
    );
    if (btnResetMatrix) {
      btnResetMatrix.addEventListener("click", () => this._resetAuthMatrix());
    }

    const btnSaveMatrix = document.getElementById("btn-save-auth-matrix-modal");
    if (btnSaveMatrix) {
      btnSaveMatrix.addEventListener("click", () => this._saveAuthMatrix());
    }

    const btnAddMatrix = document.getElementById("btn-add-auth-matrix-modal");
    if (btnAddMatrix) {
      btnAddMatrix.addEventListener("click", () => this._promptAddElement());
    }

    const btnScanMatrix = document.getElementById("btn-scan-auth-matrix-modal");
    if (btnScanMatrix) {
      btnScanMatrix.addEventListener("click", () => this._autoScanDOM());
    }

    // Category filter dropdown and search input listeners
    const catFilter = document.getElementById("auth-matrix-modal-category-filter");
    if (catFilter) {
      catFilter.addEventListener("change", () => this._renderFilteredAuthMatrix());
    }
    const searchInput = document.getElementById("auth-matrix-modal-search");
    if (searchInput) {
      searchInput.addEventListener("input", () => this._renderFilteredAuthMatrix());
    }

    // Event delegation on tbody for role checks, bulk actions, and element deletion
    const tbody = document.getElementById("auth-matrix-modal-tbody");
    if (tbody) {
      tbody.addEventListener("change", (e) => {
        // A. Category Header Checkbox clicked -> cascade to all rows in this category
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
            const itemId = chk.getAttribute("data-id");
            if (this._cachedMatrix) {
              const found = this._cachedMatrix.find((m) => m.id === itemId);
              if (found) {
                found[role] = isChecked;
                if (!found.roles) found.roles = {};
                found.roles[role] = isChecked;
                if (role === "DEVOTEE") {
                  found["SEEKER"] = isChecked;
                  found.roles["SEEKER"] = isChecked;
                }
              }
            }
          });

          this._updateIndeterminateStates();
          return;
        }

        // B. Element row checkbox clicked -> cascade to children & bubble up
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

          // Cascade down to children
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

          if (this._cachedMatrix) {
            const rowChecks = tbody.querySelectorAll(".matrix-role-check");
            rowChecks.forEach((chk) => {
              const r = chk.getAttribute("data-role");
              const id = chk.getAttribute("data-id");
              const found = this._cachedMatrix.find((m) => m.id === id);
              if (found && r) {
                found[r] = chk.checked;
                if (r === "DEVOTEE") found["SEEKER"] = chk.checked;
              }
            });
          }

          this._updateIndeterminateStates();
        }
      });
      tbody.addEventListener("click", (e) => {
        const btnDel = e.target.closest(".auth-matrix-del-btn");
        if (btnDel) {
          const id = btnDel.getAttribute("data-id");
          if (id && confirm(`Delete element "${id}" from authorization matrix?`)) {
            if (typeof ScreenAuthMatrix !== "undefined" && ScreenAuthMatrix.deleteElement) {
              ScreenAuthMatrix.deleteElement(id);
              this._cachedMatrix = this.controller.model.getAuthMatrix();
              this._populateCategoryDropdown();
              this._renderFilteredAuthMatrix();
              this._showToast(`🗑️ Element "${id}" deleted.`);
            }
          }
          return;
        }

        const btnBulkAll = e.target.closest(".btn-cat-bulk-all");
        if (btnBulkAll) {
          const cat = btnBulkAll.getAttribute("data-cat");
          this._bulkSetCategoryRoles(cat, { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true, SEEKER: true });
          return;
        }
        const btnBulkStaff = e.target.closest(".btn-cat-bulk-staff");
        if (btnBulkStaff) {
          const cat = btnBulkStaff.getAttribute("data-cat");
          this._bulkSetCategoryRoles(cat, { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: false, SEEKER: false });
          return;
        }
        const btnBulkNone = e.target.closest(".btn-cat-bulk-none");
        if (btnBulkNone) {
          const cat = btnBulkNone.getAttribute("data-cat");
          this._bulkSetCategoryRoles(cat, { MASTER: false, HEALER: false, TRAINEE: false, DEVOTEE: false, SEEKER: false });
          return;
        }
      });
    }

    // RBAC Section Actions
    this._bindRbacActions();
    this._bindProfileRoleActions();
    this._bindCatalogEditorActions();
  }

  _bindRbacActions() {
    const btnSelectAllMaster = document.getElementById("btn-rbac-select-all-master");
    if (btnSelectAllMaster) {
      btnSelectAllMaster.onclick = () => {
        const masterChks = document.querySelectorAll('#tbody-rbac-matrix-rows .rbac-chk[data-role="MASTER"]');
        masterChks.forEach(c => c.checked = true);
        this._showToast("👑 All Master capabilities ticked.");
      };
    }

    const btnResetDefaults = document.getElementById("btn-rbac-reset-defaults");
    if (btnResetDefaults) {
      btnResetDefaults.onclick = () => {
        localStorage.removeItem("sk_rbac_roles_config");
        this._loadRbacState();
        this._showToast("🔄 RBAC permissions reset to system defaults.");
      };
    }

    const btnSaveRbac = document.getElementById("btn-save-rbac-roles");
    if (btnSaveRbac) {
      btnSaveRbac.onclick = () => {
        this._saveRbacState();
      };
    }

    const searchInput = document.getElementById("input-search-rbac-roles");
    if (searchInput) {
      searchInput.oninput = () => {
        const q = (searchInput.value || "").toLowerCase().trim();
        const tokens = q.split(/\s+/).filter(Boolean);
        const rows = document.querySelectorAll("#tbody-rbac-matrix-rows tr.rbac-row");
        const headers = document.querySelectorAll("#tbody-rbac-matrix-rows tr.rbac-category-header");
        const visibleCategories = new Set();

        rows.forEach((r) => {
          const text = (r.textContent || "").toLowerCase();
          const matches = tokens.length === 0 || tokens.every((t) => text.includes(t));
          r.style.display = matches ? "" : "none";
          if (matches) {
            const cat = r.getAttribute("data-category");
            if (cat) visibleCategories.add(cat);
          }
        });

        headers.forEach((h) => {
          if (tokens.length === 0) {
            h.style.display = "";
          } else {
            const cat = h.getAttribute("data-category");
            h.style.display = visibleCategories.has(cat) ? "" : "none";
          }
        });
      };
    }

    const btnReloadRbacEmbed = document.getElementById("btn-reload-rbac-embed");
    if (btnReloadRbacEmbed) {
      btnReloadRbacEmbed.onclick = () => {
        const frame = document.getElementById("iframe-rbac-admin");
        if (frame) {
          try {
            frame.contentWindow.location.reload();
          } catch (e) {
            frame.src = frame.src;
          }
          this._showToast("🔄 RBAC Admin Matrix reloaded.");
        }
      };
    }
  }

  _loadRbacState() {
    try {
      const raw = localStorage.getItem("sk_rbac_roles_config");
      if (!raw) return;
      const config = JSON.parse(raw);
      const chks = document.querySelectorAll("#tbody-rbac-matrix-rows .rbac-chk");
      chks.forEach(chk => {
        const item = chk.getAttribute("data-item");
        const role = chk.getAttribute("data-role");
        if (config[item] && config[item][role] !== undefined) {
          chk.checked = config[item][role] === true;
        }
      });
    } catch(e) {}
  }

  _saveRbacState() {
    const config = {};
    const chks = document.querySelectorAll("#tbody-rbac-matrix-rows .rbac-chk");
    chks.forEach(chk => {
      const item = chk.getAttribute("data-item");
      const role = chk.getAttribute("data-role");
      if (!config[item]) config[item] = {};
      config[item][role] = chk.checked;
    });
    localStorage.setItem("sk_rbac_roles_config", JSON.stringify(config));

    // Also synchronize into ScreenAuthMatrix
    if (typeof ScreenAuthMatrix !== "undefined" && ScreenAuthMatrix.getAuthMatrix) {
      const matrix = ScreenAuthMatrix.getAuthMatrix();
      let updated = false;
      matrix.forEach(m => {
        if (config[m.id]) {
          if (!m.roles) m.roles = {};
          Object.assign(m.roles, config[m.id]);
          Object.assign(m, config[m.id]);
          updated = true;
        }
      });
      if (updated) {
        ScreenAuthMatrix.saveAuthMatrix(matrix);
        if (this.controller && this.controller.view) {
          this.controller.view.applyDynamicAuthMatrix(matrix, this.controller.model.getRoleMode());
        }
      }
    }
    this._showToast("✓ RBAC permissions saved and synchronized across portals.");
  }

  _switchSection(section) {
    // Legacy redirect support: If legacy 'auth-matrix' or 'rbac' is requested, redirect to 'role-matrix' and switch subtab
    let targetSubtab = null;
    if (section === "auth-matrix") {
      section = "role-matrix";
      targetSubtab = "screen-auth";
    } else if (section === "rbac") {
      section = "role-matrix";
      targetSubtab = "rbac-roles";
    }

    // Hide all sections
    document.querySelectorAll(".settings-section").forEach((el) => {
      el.style.display = "none";
    });

    // Show selected section
    const targetSection = document.getElementById(`section-${section}`);
    if (targetSection) {
      targetSection.style.display = "block";
    }

    // Update nav items
    document.querySelectorAll(".settings-nav-item").forEach((item) => {
      item.classList.remove("active");
      item.style.background = "transparent";
      item.style.color = "var(--text-secondary)";
    });

    const activeNavItem = document.querySelector(
      `.settings-nav-item[data-section="${section}"]`,
    );
    if (activeNavItem) {
      activeNavItem.classList.add("active");
      activeNavItem.style.background = "var(--gold-500)";
      activeNavItem.style.color = "#000";
    }

    // Update title
    const titleEl = document.getElementById("settings-modal-title");
    if (titleEl && SETTINGS_SECTIONS[section]) {
      titleEl.textContent = `${SETTINGS_SECTIONS[section].icon} ${SETTINGS_SECTIONS[section].title}`;
    }

    // Load section-specific data
    if (section === "role-matrix") {
      this._switchRoleMatrixSubtab(targetSubtab || this.currentRoleSubtab || "profile-roles");
    } else {
      this._loadSectionData(section);
    }
    this.currentSection = section;
  }

  _switchRoleMatrixSubtab(subtab) {
    this.currentRoleSubtab = subtab;
    // Update subtab buttons
    document.querySelectorAll(".role-matrix-subnav .btn-subtab").forEach((btn) => {
      const isTarget = btn.getAttribute("data-subtab") === subtab;
      if (isTarget) {
        btn.classList.add("active");
        btn.style.background = "var(--gold-500)";
        btn.style.color = "#000";
        btn.style.borderColor = "var(--gold-500)";
        btn.style.fontWeight = "600";
      } else {
        btn.classList.remove("active");
        btn.style.background = "rgba(255,255,255,0.05)";
        btn.style.color = "#ccc";
        btn.style.borderColor = "#444";
        btn.style.fontWeight = "normal";
      }
    });

    // Toggle panes
    document.querySelectorAll(".role-matrix-subtab-pane").forEach((pane) => {
      pane.style.display = "none";
    });
    const targetPane = document.getElementById(`subtab-pane-${subtab}`);
    if (targetPane) {
      targetPane.style.display = "block";
    }

    // Trigger data load
    if (subtab === "profile-roles") {
      this._loadProfileRoleMatrix();
    } else if (subtab === "rbac-roles") {
      this._loadRbacState();
    } else if (subtab === "screen-auth") {
      this._loadAuthMatrix();
    }
  }

  _bindProfileRoleActions() {
    const profileSelect = document.getElementById("select-role-matrix-target-profile");
    if (profileSelect) {
      profileSelect.addEventListener("change", () => {
        const targetId = profileSelect.value;
        this._populateProfileRoleAssignment(targetId);
      });
    }

    const btnSaveAssignment = document.getElementById("btn-save-profile-role-assignment");
    if (btnSaveAssignment) {
      btnSaveAssignment.addEventListener("click", () => {
        const targetId = profileSelect ? profileSelect.value : "";
        if (!targetId) {
          alert("Please select a target profile to assign roles/permissions.");
          return;
        }

        const permissions = {
          canReadDownline: document.getElementById("delegated-perm-read-downline")?.checked || false,
          canEditProfile: document.getElementById("delegated-perm-edit-profile")?.checked || false,
          canUpdateSadhana: document.getElementById("delegated-perm-update-sadhana")?.checked || false,
          canCertifySadhana: document.getElementById("delegated-perm-certify")?.checked || false,
          canApproveIntake: document.getElementById("delegated-perm-approve-intake")?.checked || false,
          canExportData: document.getElementById("delegated-perm-export-data")?.checked || false,
        };

        const activeProfile = (this.controller && this.controller.model && this.controller.model.getActiveProfile)
          ? this.controller.model.getActiveProfile()
          : null;
        const assignedBy = activeProfile ? (activeProfile.uniqueProfileId || activeProfile.id || "MASTER") : "MASTER";

        if (this.controller && this.controller.model && this.controller.model.saveProfileRoleAssignment) {
          this.controller.model.saveProfileRoleAssignment(targetId, permissions, assignedBy);
          this._showToast(`✓ Delegated permissions saved for ${targetId}`);
        }
      });
    }

    const btnResetAssignment = document.getElementById("btn-reset-profile-role-assignment");
    if (btnResetAssignment) {
      btnResetAssignment.addEventListener("click", () => {
        ["delegated-perm-read-downline", "delegated-perm-edit-profile", "delegated-perm-update-sadhana", "delegated-perm-certify", "delegated-perm-approve-intake", "delegated-perm-export-data"].forEach(id => {
          const chk = document.getElementById(id);
          if (chk) chk.checked = false;
        });

        const targetId = profileSelect ? profileSelect.value : "";
        if (targetId && this.controller && this.controller.model && this.controller.model.saveProfileRoleAssignment) {
          const activeProfile = this.controller.model.getActiveProfile ? this.controller.model.getActiveProfile() : null;
          const assignedBy = activeProfile ? (activeProfile.uniqueProfileId || activeProfile.id || "MASTER") : "MASTER";
          this.controller.model.saveProfileRoleAssignment(targetId, {}, assignedBy);
          this._showToast(`🔄 Delegated permissions cleared for ${targetId}`);
        }
      });
    }
  }

  _loadProfileRoleMatrix() {
    const selectEl = document.getElementById("select-role-matrix-target-profile");
    if (!selectEl) return;

    const currentVal = selectEl.value;
    const profiles = (this.controller && this.controller.model && this.controller.model.profiles) ? this.controller.model.profiles : [];

    const roleOrder = { MASTER: 1, HEALER: 2, TRAINEE: 3, DEVOTEE: 4, SEEKER: 5 };
    const sorted = [...profiles].sort((a, b) => {
      const orderA = roleOrder[a.role || "DEVOTEE"] || 99;
      const orderB = roleOrder[b.role || "DEVOTEE"] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return (a.fullName || a.name || "").localeCompare(b.fullName || b.name || "");
    });

    let options = '<option value="">-- Choose Profile to Assign Roles --</option>';
    sorted.forEach((p) => {
      const pid = p.uniqueProfileId || p.id;
      const name = p.fullName || p.name || "Unnamed";
      const role = p.role || "DEVOTEE";
      const mentor = p.sponsorId || p.mentorId || p.parentReferralCode || "Direct";
      options += `<option value="${pid}">${name} [${pid}] — Tier: ${role} (Sponsor: ${mentor})</option>`;
    });

    selectEl.innerHTML = options;
    if (currentVal && sorted.some(p => (p.uniqueProfileId || p.id) === currentVal)) {
      selectEl.value = currentVal;
      this._populateProfileRoleAssignment(currentVal);
    }
  }

  _populateProfileRoleAssignment(targetId) {
    if (!targetId) {
      ["delegated-perm-read-downline", "delegated-perm-edit-profile", "delegated-perm-update-sadhana", "delegated-perm-certify", "delegated-perm-approve-intake", "delegated-perm-export-data"].forEach(id => {
        const chk = document.getElementById(id);
        if (chk) chk.checked = false;
      });
      return;
    }

    if (this.controller && this.controller.model && this.controller.model.getProfileRoleAssignment) {
      const assignment = this.controller.model.getProfileRoleAssignment(targetId);
      const perms = assignment.permissions || {};

      const setCheck = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = !!val;
      };

      setCheck("delegated-perm-read-downline", perms.canReadDownline);
      setCheck("delegated-perm-edit-profile", perms.canEditProfile);
      setCheck("delegated-perm-update-sadhana", perms.canUpdateSadhana);
      setCheck("delegated-perm-certify", perms.canCertifySadhana);
      setCheck("delegated-perm-approve-intake", perms.canApproveIntake);
      setCheck("delegated-perm-export-data", perms.canExportData);
    }
  }

  _loadSectionData(section) {
    switch (section) {
      case "role-matrix":
        this._switchRoleMatrixSubtab(this.currentRoleSubtab || "profile-roles");
        break;
      case "auth-matrix":
        this._loadAuthMatrix();
        break;
      case "rbac":
        this._loadRbacState();
        break;
      case "register-devotee":
        this._loadRegistrationFields();
        break;
      case "catalog-editor":
        this._loadCatalogEditor();
        break;
      case "archive-restore":
        this._loadArchiveData();
        break;
      case "ui-ux-controls":
        break;
      case "rbac-admin":
        this._loadRbacAdminFrame();
        break;
      default:
        break;
    }
  }

  _loadRbacAdminFrame() {
    const frame = document.getElementById("iframe-rbac-admin");
    if (frame) {
      const isSubdir = typeof window !== "undefined" && window.location && (
        window.location.pathname.includes("/Masters/") || 
        window.location.pathname.includes("/Healers/") || 
        window.location.pathname.includes("/Trainee/") || 
        window.location.pathname.includes("/Devotee/") || 
        window.location.pathname.includes("/Seeker/")
      );
      const expectedSrc = isSubdir ? "../rbac-admin.html" : "rbac-admin.html";
      const currentSrc = frame.getAttribute("src");
      if (!currentSrc || currentSrc === "") {
        frame.src = expectedSrc;
      }
    }
  }

  _loadAuthMatrix() {
    this._cachedMatrix = this.controller.model.getAuthMatrix();
    this._populateCategoryDropdown();
    this._renderFilteredAuthMatrix();
  }

  _populateCategoryDropdown() {
    const filterEl = document.getElementById("auth-matrix-modal-category-filter");
    if (!filterEl || !this._cachedMatrix) return;
    const currentVal = filterEl.value || "ALL";
    const categories = [];
    this._cachedMatrix.forEach((item) => {
      const cat = item.category || "General";
      if (!categories.includes(cat)) categories.push(cat);
    });
    let options = `<option value="ALL">All Screen Divisions (${this._cachedMatrix.length} elements)</option>`;
    categories.forEach((cat) => {
      const count = this._cachedMatrix.filter((m) => m.category === cat).length;
      options += `<option value="${cat}">${cat} (${count})</option>`;
    });
    filterEl.innerHTML = options;
    filterEl.value = currentVal;
  }

  _bulkSetCategoryRoles(cat, roleSettings) {
    if (!this._cachedMatrix) return;
    this._cachedMatrix.forEach((item) => {
      if (item.category === cat) {
        Object.keys(roleSettings).forEach((role) => {
          item[role] = roleSettings[role];
        });
      }
    });
    this._renderFilteredAuthMatrix();
  }

  _renderFilteredAuthMatrix() {
    const tbody = document.getElementById("auth-matrix-modal-tbody");
    if (!tbody || !this._cachedMatrix) return;

    const filterEl = document.getElementById("auth-matrix-modal-category-filter");
    const searchEl = document.getElementById("auth-matrix-modal-search");
    const selectedCat = filterEl ? filterEl.value : "ALL";
    const query = searchEl ? searchEl.value.trim().toLowerCase() : "";
    const tokens = query ? query.split(/\s+/).filter(Boolean) : [];

    const roles = ["MASTER", "HEALER", "TRAINEE", "DEVOTEE"];

    // 1. Build lookup map for hierarchy
    const itemMap = new Map();
    this._cachedMatrix.forEach((m) => itemMap.set(m.id, m));

    // 2. Identify items that directly match search tokens
    const directMatches = new Set();
    const visibleItemIds = new Set();

    this._cachedMatrix.forEach((item) => {
      const cat = item.category || "General";
      const catMatches = selectedCat === "ALL" || cat === selectedCat;

      if (tokens.length === 0) {
        if (catMatches) visibleItemIds.add(item.id);
        return;
      }

      const searchableText = [
        item.name,
        item.label,
        item.id,
        cat,
        item.type,
        item.selector,
        item.parent
      ].filter(Boolean).join(" ").toLowerCase();

      const isMatch = tokens.every((tok) => searchableText.includes(tok));
      if (isMatch && catMatches) {
        directMatches.add(item.id);
        visibleItemIds.add(item.id);
      }
    });

    // 3. Hierarchy preservation:
    // If child matches, ancestors (parent card & screen) must be visible.
    // If parent matches directly, all its descendants should be visible.
    if (tokens.length > 0) {
      // 3A. Upward propagation: Include ancestors
      directMatches.forEach((id) => {
        let current = itemMap.get(id);
        while (current && current.parent) {
          visibleItemIds.add(current.parent);
          current = itemMap.get(current.parent);
        }
      });

      // 3B. Downward propagation: Include descendants of matching parents
      this._cachedMatrix.forEach((item) => {
        if (item.parent && directMatches.has(item.parent)) {
          visibleItemIds.add(item.id);
        }
        const p = itemMap.get(item.parent);
        if (p && p.parent && directMatches.has(p.parent)) {
          visibleItemIds.add(item.id);
        }
      });
    }

    // 4. Group items by category
    const grouped = new Map();
    this._cachedMatrix.forEach((item) => {
      if (!visibleItemIds.has(item.id)) return;
      const cat = item.category || "General";
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat).push(item);
    });

    if (grouped.size === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 1.5rem; color: var(--text-muted);">🔍 No screen elements match the search criteria "${query}".</td></tr>`;
      return;
    }

    let html = "";
    grouped.forEach((items, cat) => {
      // Screen Division Category Header Row
      html += `<tr class="auth-matrix-category-header" data-category="${cat}">
        <td style="padding: 0.65rem 0.75rem; background: var(--bg-hover, rgba(255,255,255,0.06)); border-bottom: 2px solid var(--border-subtle, rgba(255,255,255,0.15)); border-top: 2px solid var(--border-subtle, rgba(255,255,255,0.15));">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.82rem; color: var(--gold-400, #f59e0b);">📁 ${cat}</span>
              <span class="badge" style="font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 999px; background: rgba(255,255,255,0.08); color: var(--text-secondary);">${items.length} element${items.length > 1 ? "s" : ""}</span>
            </div>
            <div style="display: flex; gap: 0.3rem; align-items: center;">
              <span style="font-size: 0.68rem; color: var(--text-muted); margin-right: 0.2rem;">Quick:</span>
              <button type="button" class="btn btn-xs btn-outline btn-cat-bulk-all" data-cat="${cat}" style="font-size: 0.65rem; padding: 0.1rem 0.45rem;" title="Enable for All Roles">All</button>
              <button type="button" class="btn btn-xs btn-outline btn-cat-bulk-staff" data-cat="${cat}" style="font-size: 0.65rem; padding: 0.1rem 0.45rem;" title="Enable for Staff">Staff</button>
              <button type="button" class="btn btn-xs btn-outline btn-cat-bulk-none" data-cat="${cat}" style="font-size: 0.65rem; padding: 0.1rem 0.45rem;" title="Disable for All">Clear</button>
            </div>
          </div>
        </td>`;

      roles.forEach((role) => {
        html += `<td style="text-align: center; padding: 0.4rem; background: var(--bg-hover, rgba(255,255,255,0.06)); border-bottom: 2px solid var(--border-subtle, rgba(255,255,255,0.15)); border-top: 2px solid var(--border-subtle, rgba(255,255,255,0.15));">
          <input type="checkbox" class="matrix-cat-check" data-cat="${cat}" data-role="${role}" title="Toggle all ${cat} for ${role}">
        </td>`;
      });
      html += `</tr>`;

      items.forEach((item) => {
        let rowClass = "auth-matrix-row";
        let branchConnector = "";
        let titleStyle = "font-size: 0.78rem; color: var(--text-primary);";

        if (item.level === 0) {
          rowClass += " auth-tree-row-l0";
          branchConnector = '<span style="margin-right: 0.35rem;">🖥️</span>';
          titleStyle = "font-size: 0.82rem; font-weight: 700; color: #fff;";
        } else if (item.level === 1) {
          rowClass += " auth-tree-row-l1";
          branchConnector = '<span class="auth-tree-branch">├── 📂</span> ';
          titleStyle = "font-size: 0.77rem; font-weight: 600; color: var(--gold-300, #fde68a);";
        } else {
          rowClass += " auth-tree-row-l2";
          branchConnector = '<span class="auth-tree-branch">└── ⚙️</span> ';
          titleStyle = "font-size: 0.74rem; font-weight: 400; color: var(--text-secondary);";
        }

        const displayName = item.name || item.label || item.id;
        const typeBadge = `<span class="badge" style="font-size: 0.58rem; padding: 0.05rem 0.35rem; border-radius: 4px; background: rgba(255,255,255,0.06); color: var(--text-muted); margin-left: 0.4rem;">${item.type}</span>`;
        const delBtn = item.isCustom ? `<button type="button" class="auth-matrix-del-btn" data-id="${item.id}" title="Delete Custom Element" style="background: none; border: none; cursor: pointer; font-size: 0.75rem; margin-left: auto; color: var(--danger, #ef4444); opacity: 0.8;">🗑️</button>` : "";
        const rowSearchText = [displayName, item.id, cat, item.type, item.selector || ""].join(" ").toLowerCase();

        html += `<tr data-item-id="${item.id}" data-category="${cat}" data-level="${item.level !== undefined ? item.level : 2}" data-parent="${item.parent || ''}" data-search-text="${rowSearchText}" class="${rowClass}">
          <td style="padding: 0.45rem 0.6rem; border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.07));">
            <div style="display: flex; align-items: center;">
              ${branchConnector}
              <span style="${titleStyle}">${displayName}</span>
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
          html += `<td style="padding: 0.4rem; text-align: center; border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.07));">
            <input type="checkbox" class="matrix-role-check" data-role="${role}" data-id="${item.id}" ${checked}>
          </td>`;
        });

        html += `</tr>`;
      });
    });

    tbody.innerHTML = html;
    this._updateIndeterminateStates();
  }

  _updateIndeterminateStates() {
    const tbody = document.getElementById("auth-matrix-modal-tbody");
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
          // Partially checked -> orange partial tick
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

  _loadRegistrationFields() {
    // Load saved registration requirements
    const regConfig = JSON.parse(
      localStorage.getItem("sk_registration_config") || "{}",
    );

    const fields = [
      { id: "reg-field-full-name", key: "fullName", defaultChecked: true },
      { id: "reg-field-phone", key: "phone", defaultChecked: true },
      { id: "reg-field-email", key: "email", defaultChecked: false },
      { id: "reg-field-dob", key: "dob", defaultChecked: false },
      { id: "reg-field-city", key: "city", defaultChecked: true },
      { id: "reg-field-address", key: "address", defaultChecked: false },
      { id: "reg-field-pincode", key: "pincode", defaultChecked: false },
      { id: "reg-field-country", key: "country", defaultChecked: true },
      { id: "reg-field-sponsor", key: "sponsor", defaultChecked: true },
      { id: "reg-field-objective", key: "objective", defaultChecked: true },
      { id: "reg-field-affliction", key: "affliction", defaultChecked: false },
      { id: "reg-field-kuldevi", key: "kuldevi", defaultChecked: false },
      { id: "reg-field-self-name", key: "selfName", defaultChecked: false },
      { id: "reg-field-spouse", key: "spouse", defaultChecked: false },
      { id: "reg-field-father", key: "father", defaultChecked: false },
      { id: "reg-field-mother", key: "mother", defaultChecked: false },
    ];

    fields.forEach((field) => {
      const checkbox = document.getElementById(field.id);
      if (checkbox) {
        checkbox.checked =
          regConfig[field.key] !== false && field.defaultChecked;
      }
    });
  }

  _saveSettings() {
    const settings = {
      appName: document.getElementById("setting-app-name")?.value,
      orgName: document.getElementById("setting-org-name")?.value,
      firebaseUrl: document.getElementById("setting-firebase-url")?.value,
      autoCloudSync: document.getElementById("setting-auto-cloud-sync")
        ?.checked,
      defaultMentorName: document.getElementById("setting-default-mentor-name")
        ?.value,
      defaultMentorCode: document.getElementById("setting-default-mentor-code")
        ?.value,
      speechLang: document.getElementById("setting-speech-lang")?.value,
      defaultTargetMalas: document.getElementById(
        "setting-default-target-malas",
      )?.value,
      threeDiyaEveningWindow: document.getElementById(
        "setting-three-diya-window",
      )?.value,
      defaultJapaTargetCount:
        parseInt(
          document.getElementById("setting-default-japa-target-count")?.value,
        ) || 108,
      telegramBotHandle: document.getElementById("setting-telegram-bot-handle")
        ?.value,
      notebookLmPortalUrl: document.getElementById(
        "setting-notebooklm-portal-url",
      )?.value,
      githubApkUrl: document.getElementById("setting-github-apk-url")?.value,
      allowDevoteeDelete: document.getElementById("setting-devotee-can-delete")
        ?.checked,
      devoteeCanEditLineage: document.getElementById(
        "setting-devotee-can-edit-lineage",
      )?.checked,
      devoteeCanEnroll: document.getElementById("setting-devotee-can-enroll")
        ?.checked,
      healerStrictTeam: document.getElementById("setting-healer-strict-team")
        ?.checked,
      healerCanCertify: document.getElementById("setting-healer-can-certify")
        ?.checked,
      healerCanDeleteTeam: document.getElementById(
        "setting-healer-can-delete-team",
      )?.checked,
      healerCanViewEntireTeam: document.getElementById(
        "setting-healer-can-view-team",
      )?.checked,
      dataMinimizationEnabled: document.getElementById(
        "setting-data-minimization",
      )?.checked,
      defaultRoleMode: document.getElementById("setting-default-role-mode")
        ?.value,
      autoSaveMode: document.getElementById("setting-auto-save")?.value,
      minDevoteeAge:
        parseInt(document.getElementById("setting-min-devotee-age")?.value) || 18,
      cleanMinApprovalPercent:
        parseInt(document.getElementById("setting-clean-min-approval-percent")?.value) || 75,
      maxPendingInvitesPerMentor:
        parseInt(document.getElementById("setting-max-pending-invites")?.value) || 5,
      inviteExpiryHours:
        parseInt(document.getElementById("setting-invite-expiry-hours")?.value) || 24,
      maxInviteResubmits:
        parseInt(document.getElementById("setting-max-invite-resubmits")?.value) || 3,
      defaultInductionRole:
        document.getElementById("setting-default-induction-role")?.value || "DEVOTEE",
      requirePhoneOTP:
        document.getElementById("setting-require-phone-otp")?.checked || false,
      requireEmailOTP:
        document.getElementById("setting-require-email-otp")?.checked || false,
      requireCaptcha:
        document.getElementById("setting-require-captcha")?.checked || false,
      requireKYC:
        document.getElementById("setting-require-kyc")?.checked || false,
      requireSignature:
        document.getElementById("setting-require-signature")?.checked || false,
      requireTandC:
        document.getElementById("setting-require-tandc")?.checked !== false,
      showProfileBox2:
        document.getElementById("setting-show-profile-box-2")?.checked || false,
      copyrightMarqueeText:
        document.getElementById("setting-copyright-marquee")?.value ||
        "© 2024-2026 Shree Spritual Karim Sansthan • All Sacred Lineage Rights Reserved • Certified ISO/IEC 27001 Secure Node Telemetry • Guided under the divine vision of Spiritual Karim Khan • Real-time Lineage Synchronization Active",
    };

    // Also persist registration field requirements & intake gateways to sk_registration_config
    const regConfig = {
      fullName: document.getElementById("reg-field-full-name")?.checked !== false,
      phone: document.getElementById("reg-field-phone")?.checked !== false,
      email: document.getElementById("reg-field-email")?.checked || false,
      dob: document.getElementById("reg-field-dob")?.checked || false,
      city: document.getElementById("reg-field-city")?.checked !== false,
      address: document.getElementById("reg-field-address")?.checked || false,
      pincode: document.getElementById("reg-field-pincode")?.checked || false,
      country: document.getElementById("reg-field-country")?.checked !== false,
      sponsor: document.getElementById("reg-field-sponsor")?.checked !== false,
      objective: document.getElementById("reg-field-objective")?.checked !== false,
      affliction: document.getElementById("reg-field-affliction")?.checked || false,
      kuldevi: document.getElementById("reg-field-kuldevi")?.checked || false,
      selfName: document.getElementById("reg-field-self-name")?.checked || false,
      spouse: document.getElementById("reg-field-spouse")?.checked || false,
      father: document.getElementById("reg-field-father")?.checked || false,
      mother: document.getElementById("reg-field-mother")?.checked || false,
      requirePhoneOTP: settings.requirePhoneOTP,
      requireEmailOTP: settings.requireEmailOTP,
      requireCaptcha: settings.requireCaptcha,
      requireKYC: settings.requireKYC,
      requireSignature: settings.requireSignature,
      requireTandC: settings.requireTandC,
    };
    try {
      localStorage.setItem("sk_registration_config", JSON.stringify(regConfig));
    } catch (e) {}

    this.controller.model.saveSettings(settings);
    if (this.controller.view) {
      if (typeof this.controller.view.renderCopyrightMarquee === "function") {
        this.controller.view.renderCopyrightMarquee(settings.copyrightMarqueeText);
      }
      if (typeof this.controller.view.applyProfileBox2Visibility === "function") {
        this.controller.view.applyProfileBox2Visibility(settings.showProfileBox2);
      }
    }
    if (this.controller && typeof this.controller._renderCurrentState === "function") {
      this.controller._renderCurrentState();
    }
    this._showToast("✅ Settings saved successfully & synchronized");
    this._closeModal();
  }

  _saveAuthMatrix() {
    if (!this._cachedMatrix) {
      this._cachedMatrix = this.controller.model.getAuthMatrix();
    }

    // Reconcile visible checkbox state from DOM
    const rows = document.querySelectorAll(
      "#auth-matrix-modal-tbody tr[data-item-id]",
    );
    rows.forEach((row) => {
      const itemId = row.getAttribute("data-item-id");
      const item = this._cachedMatrix.find((m) => m.id === itemId);
      if (item) {
        item.userCustomized = true;
        if (!item.roles) item.roles = {};
        if (!item.portals) item.portals = {};
        if (!item.portalVisible) item.portalVisible = {};
        const roleCheckboxes = row.querySelectorAll(".matrix-role-check");
        roleCheckboxes.forEach((chk) => {
          const role = chk.getAttribute("data-role");
          if (role) {
            item[role] = chk.checked;
            item.roles[role] = chk.checked;
            if (role === "MASTER") {
              item.portals.masters = chk.checked;
              item.portalVisible.masters = chk.checked;
            }
            if (role === "HEALER") {
              item.portals.healers = chk.checked;
              item.portalVisible.healers = chk.checked;
            }
            if (role === "TRAINEE") {
              item.portals.trainee = chk.checked;
              item.portalVisible.trainee = chk.checked;
            }
            if (role === "DEVOTEE") {
              item.SEEKER = chk.checked;
              item.roles.SEEKER = chk.checked;
              item.portals.devotee = chk.checked;
              item.portals.seeker = chk.checked;
              item.portalVisible.devotee = chk.checked;
              item.portalVisible.seeker = chk.checked;
            }
          }
        });
      }
    });

    this.controller.model.saveAuthMatrix(this._cachedMatrix);
    this.controller.view.applyDynamicAuthMatrix(
      this._cachedMatrix,
      this.controller.model.getRoleMode(),
    );
    if (typeof this.controller.view._renderCategorizedTraineeSadhanas === "function") {
      this.controller.view._renderCategorizedTraineeSadhanas(null, this.controller.model.getActiveProfile());
    }
    if (typeof this.controller._applyEventPanelRBAC === "function") {
      this.controller._applyEventPanelRBAC();
    }
    if (typeof this.controller._renderCurrentState === "function") {
      this.controller._renderCurrentState();
    }
    this._showToast("💾 Auth matrix saved and synced across all portals!");
  }

  _promptAddElement() {
    const label = prompt("Enter Element Label / Name (e.g. Daily Sadhana Tracker):");
    if (!label || !label.trim()) return;

    const selector = prompt("Enter CSS Selector (e.g. #daily-sadhana-card or .tracker-btn):");
    if (!selector || !selector.trim()) return;

    const id = "custom_" + label.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 30) + "_" + Date.now().toString().slice(-4);
    
    const filterEl = document.getElementById("auth-matrix-modal-category-filter");
    const defaultCat = (filterEl && filterEl.value !== "ALL") ? filterEl.value : "Tab 1: Devotee Personal";
    const category = prompt(`Enter Screen Category (or leave empty for "${defaultCat}"):`) || defaultCat;
    
    const levelStr = prompt("Enter Hierarchy Level (0 = Screen, 1 = Subtab/Card, 2 = Control/Button):", "2");
    const level = parseInt(levelStr, 10) || 2;

    const newElement = {
      id,
      label: label.trim(),
      name: label.trim(),
      type: level === 0 ? "SCREEN" : level === 1 ? "CARD" : "BUTTON",
      selector: selector.trim(),
      category: category.trim(),
      level: level,
      parent: null,
      isCustom: true,
      MASTER: true,
      HEALER: level >= 1,
      TRAINEE: level >= 2,
      DEVOTEE: level >= 2,
      SEEKER: level >= 2
    };

    if (typeof ScreenAuthMatrix !== "undefined" && ScreenAuthMatrix.addElement) {
      ScreenAuthMatrix.addElement(newElement);
    }
    this._cachedMatrix = this.controller.model.getAuthMatrix();
    this._populateCategoryDropdown();
    this._renderFilteredAuthMatrix();
    this._showToast(`➕ Element "${label}" added successfully.`);
  }

  _autoScanDOM() {
    if (typeof document === "undefined") return;
    const existingIds = new Set(this._cachedMatrix.map(m => m.id));
    const existingSelectors = new Set(this._cachedMatrix.map(m => m.selector).filter(Boolean));
    
    // Scan candidate DOM elements
    const candidates = document.querySelectorAll(
      "div[id^='tab-'], section[id], .card[id], button[id^='btn-'], div[class*='-card'][id]"
    );

    let addedCount = 0;
    candidates.forEach(el => {
      const id = el.id;
      if (!id) return;
      const selector = `#${id}`;
      if (existingIds.has(id) || existingSelectors.has(selector)) return;

      // Infer category and level
      let category = "Tab 1: Devotee Personal";
      const parentTab = el.closest(".main-tab-pane, div[id^='tab-']");
      if (parentTab && parentTab.id) {
        if (parentTab.id.includes("seeker")) category = "Tab 2: Seeker Purpose";
        else if (parentTab.id.includes("trainee")) category = "Tab 3: Trainee Sadhak";
        else if (parentTab.id.includes("healer")) category = "Tab 4: Healer Connect";
        else if (parentTab.id.includes("tree") || parentTab.id.includes("genealogy")) category = "Tab 5: Genealogy Tree";
        else if (parentTab.id.includes("firebase")) category = "Tab 6: Firebase Data";
      } else if (el.closest("header, #top-header, .header-bar")) {
        category = "Global: Header";
      } else if (el.closest("aside, #sidebar, .sidebar-left")) {
        category = "Global: Sidebar";
      } else if (el.closest(".modal, .drawer")) {
        category = "Global: Drawers & Modals";
      } else if (el.closest("footer, .footer-bar")) {
        category = "Global: Footer";
      }

      const isBtn = el.tagName === "BUTTON";
      const isScreen = el.id.startsWith("tab-");
      const level = isScreen ? 0 : isBtn ? 2 : 1;
      const label = el.getAttribute("aria-label") || el.title || el.innerText?.slice(0, 30) || id.replace(/[-_]/g, " ");

      const newItem = {
        id: "scan_" + id,
        label: label.trim(),
        name: label.trim(),
        type: isScreen ? "SCREEN" : isBtn ? "BUTTON" : "CARD",
        selector: selector,
        category: category,
        level: level,
        parent: null,
        isCustom: true,
        MASTER: true,
        HEALER: level >= 1,
        TRAINEE: level >= 2,
        DEVOTEE: level >= 2,
        SEEKER: level >= 2
      };

      if (typeof ScreenAuthMatrix !== "undefined" && ScreenAuthMatrix.addElement) {
        ScreenAuthMatrix.addElement(newItem);
        addedCount++;
        existingIds.add(newItem.id);
        existingSelectors.add(newItem.selector);
      }
    });

    if (addedCount > 0) {
      this._cachedMatrix = this.controller.model.getAuthMatrix();
      this._populateCategoryDropdown();
      this._renderFilteredAuthMatrix();
      this._showToast(`🔄 Auto-scan discovered & registered ${addedCount} new elements!`);
    } else {
      this._showToast(`ℹ️ Auto-scan complete: All screen elements are already registered.`);
    }
  }


  _resetSettings() {
    if (
      !confirm(
        "Are you sure you want to reset all settings to factory defaults?",
      )
    ) {
      return;
    }

    this.controller.model.saveSettings(
      this.controller.model._getDefaultSettings(),
    );
    this._loadCurrentSettings();
    this._showToast("🔄 Settings reset to factory defaults");
  }

  _resetAuthMatrix() {
    const defaultMatrix = this.controller.model.getDefaultAuthMatrix();
    this._cachedMatrix = defaultMatrix;
    this.controller.model.saveAuthMatrix(defaultMatrix);
    this._populateCategoryDropdown();
    this._renderFilteredAuthMatrix();
    this.controller.view.applyDynamicAuthMatrix(
      defaultMatrix,
      this.controller.model.getRoleMode(),
    );
    this._showToast("🔄 Auth matrix reset to canonical defaults");
  }

  _loadCurrentSettings() {
    const settings = this.controller.model.settings;

    const settingMap = {
      "setting-app-name": "appName",
      "setting-org-name": "orgName",
      "setting-firebase-url": "firebaseUrl",
      "setting-default-mentor-name": "defaultMentorName",
      "setting-default-mentor-code": "defaultMentorCode",
      "setting-speech-lang": "speechLang",
      "setting-default-target-malas": "defaultTargetMalas",
      "setting-three-diya-window": "threeDiyaEveningWindow",
      "setting-default-japa-target-count": "defaultJapaTargetCount",
      "setting-telegram-bot-handle": "telegramBotHandle",
      "setting-notebooklm-portal-url": "notebookLmPortalUrl",
      "setting-github-apk-url": "githubApkUrl",
      "setting-devotee-can-delete": "allowDevoteeDelete",
      "setting-devotee-can-edit-lineage": "devoteeCanEditLineage",
      "setting-devotee-can-enroll": "devoteeCanEnroll",
      "setting-healer-strict-team": "healerStrictTeam",
      "setting-healer-can-certify": "healerCanCertify",
      "setting-healer-can-delete-team": "healerCanDeleteTeam",
      "setting-healer-can-view-team": "healerCanViewEntireTeam",
      "setting-data-minimization": "dataMinimizationEnabled",
      "setting-default-role-mode": "defaultRoleMode",
      "setting-auto-save": "autoSaveMode",
      "setting-min-devotee-age": "minDevoteeAge",
      "setting-clean-min-approval-percent": "cleanMinApprovalPercent",
      "setting-max-pending-invites": "maxPendingInvitesPerMentor",
      "setting-invite-expiry-hours": "inviteExpiryHours",
      "setting-max-invite-resubmits": "maxInviteResubmits",
      "setting-default-induction-role": "defaultInductionRole",
      "setting-require-phone-otp": "requirePhoneOTP",
      "setting-require-email-otp": "requireEmailOTP",
      "setting-require-captcha": "requireCaptcha",
      "setting-require-kyc": "requireKYC",
      "setting-require-signature": "requireSignature",
      "setting-require-tandc": "requireTandC",
      "setting-show-profile-box-2": "showProfileBox2",
      "setting-copyright-marquee": "copyrightMarqueeText",
    };

    Object.entries(settingMap).forEach(([inputId, settingKey]) => {
      const input = document.getElementById(inputId);
      if (!input) return;

      const value = settings[settingKey];
      if (input.type === "checkbox") {
        input.checked = value === true || (value !== false && ["requireTandC", "setting-require-tandc"].includes(settingKey));
      } else {
        input.value = value !== undefined ? value : "";
      }
    });

    // Load registration requirements fields
    this._loadRegistrationFields();

    // Load auth cloud sync separately
    const autoSync = document.getElementById("setting-auto-cloud-sync");
    if (autoSync) {
      autoSync.checked = settings.autoCloudSync !== false;
    }
  }

  _bindCatalogEditorActions() {
    const btnAdd = document.getElementById("btn-add-catalog-item");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        this._openCatalogEditor(null);
      });
    }

    const btnCancel = document.getElementById("btn-cancel-catalog-edit");
    if (btnCancel) {
      btnCancel.addEventListener("click", () => {
        document.getElementById("catalog-editor-form-container").style.display = "none";
        document.getElementById("admin-catalog-list").style.display = "grid";
      });
    }

    const btnSave = document.getElementById("btn-save-catalog-item");
    if (btnSave) {
      btnSave.addEventListener("click", () => {
        this._saveCatalogItem();
      });
    }
  }

  _loadCatalogEditor() {
    this._renderCatalogList();
    document.getElementById("catalog-editor-form-container").style.display = "none";
    document.getElementById("admin-catalog-list").style.display = "grid";
  }

  _renderCatalogList() {
    const container = document.getElementById("admin-catalog-list");
    if (!container) return;

    if (!this.controller || !this.controller.model) {
      container.innerHTML = "<p>Model not initialized.</p>";
      return;
    }

    const catalogData = this.controller.model.getSadhanaCatalog();
    if (!catalogData || Object.keys(catalogData).length === 0) {
      container.innerHTML = "<p>No catalog items found.</p>";
      return;
    }

    let html = "";
    Object.values(catalogData).forEach(item => {
      html += `
        <div class="catalog-list-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="font-size: 2rem;">${item.icon || '📿'}</div>
            <div>
              <h5 style="margin: 0; color: var(--text-primary); font-size: 1rem;">${item.title}</h5>
              <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                <span class="badge" style="background: rgba(255,255,255,0.1); padding: 0.1rem 0.4rem; border-radius: 4px;">${item.category}</span>
                <span class="badge" style="background: rgba(255,255,255,0.1); padding: 0.1rem 0.4rem; border-radius: 4px;">${item.domain}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-outline btn-sm btn-edit-catalog" data-id="${item.id}">Edit</button>
            <button class="btn btn-danger btn-sm btn-delete-catalog" data-id="${item.id}">Delete</button>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;

    // Bind item actions
    container.querySelectorAll(".btn-edit-catalog").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this._openCatalogEditor(e.target.getAttribute("data-id"));
      });
    });

    container.querySelectorAll(".btn-delete-catalog").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this._deleteCatalogItem(e.target.getAttribute("data-id"));
      });
    });
  }

  _openCatalogEditor(id) {
    const container = document.getElementById("catalog-editor-form-container");
    const list = document.getElementById("admin-catalog-list");
    const titleEl = document.getElementById("catalog-editor-title");
    
    list.style.display = "none";
    container.style.display = "block";

    const idInput = document.getElementById("edit-catalog-id");
    const titleInput = document.getElementById("edit-catalog-title");
    const catInput = document.getElementById("edit-catalog-category");
    const domainInput = document.getElementById("edit-catalog-domain");
    const iconInput = document.getElementById("edit-catalog-icon");
    const timingInput = document.getElementById("edit-catalog-timing");
    const mantraInput = document.getElementById("edit-catalog-mantra");

    if (id) {
      titleEl.textContent = "Edit Catalog Item";
      const catalogData = this.controller.model.getSadhanaCatalog();
      const item = catalogData[id];
      if (item) {
        idInput.value = item.id;
        titleInput.value = item.title || "";
        catInput.value = item.category || "SADHANA";
        domainInput.value = item.domain || "Spiritual";
        iconInput.value = item.icon || "";
        timingInput.value = item.timing || "";
        mantraInput.value = item.mantra || "";
      }
    } else {
      titleEl.textContent = "Add New Catalog Item";
      idInput.value = "";
      titleInput.value = "";
      catInput.value = "SADHANA";
      domainInput.value = "Spiritual";
      iconInput.value = "";
      timingInput.value = "";
      mantraInput.value = "";
    }
  }

  _saveCatalogItem() {
    const id = document.getElementById("edit-catalog-id").value;
    const title = document.getElementById("edit-catalog-title").value.trim();
    if (!title) {
      alert("Title is required");
      return;
    }

    const newItem = {
      id: id || `item_${Date.now()}`,
      title: title,
      category: document.getElementById("edit-catalog-category").value,
      domain: document.getElementById("edit-catalog-domain").value,
      icon: document.getElementById("edit-catalog-icon").value,
      timing: document.getElementById("edit-catalog-timing").value,
      mantra: document.getElementById("edit-catalog-mantra").value,
    };

    if (this.controller && this.controller.model) {
      this.controller.model.updateSadhanaItem(newItem);
      this._showToast("Catalog Item Saved successfully!");
      this._loadCatalogEditor();
    }
  }

  _deleteCatalogItem(id) {
    if (confirm("Are you sure you want to delete this catalog item?")) {
      if (this.controller && this.controller.model) {
        this.controller.model.deleteSadhanaItem(id);
        this._showToast("Catalog Item Deleted successfully!");
        this._renderCatalogList();
      }
    }
  }

  _closeModal() {
    this.controller.view.toggleSettingsModal(false);
  }

  _showToast(message, type = "success") {
    if (this.controller.view && typeof this.controller.view.showToast === "function") {
      this.controller.view.showToast("Admin Settings", message, type);
    }
  }

  open(initialSection = "general") {
    this._loadCurrentSettings();
    this._switchSection(initialSection);
    this.controller.view.toggleSettingsModal(true);
  }

  _loadArchiveData() {
    const container = document.getElementById("archive-list-container");
    if (!container) return;
    
    // Fetch deleted applications and invites
    const model = this.controller && this.controller.model;
    if (!model) return;

    let apps = [];
    if (typeof model.getSadhanaRemedyApplications === "function") {
      apps = model.getSadhanaRemedyApplications().filter(a => a.status === "DELETED");
    } else {
      apps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]").filter(a => a.status === "DELETED");
    }

    let invites = [];
    if (typeof model.getPairingInvites === "function") {
      invites = model.getPairingInvites().filter(i => i.status === "DELETED");
    }

    if (apps.length === 0 && invites.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;">📭</div>
          The archive is empty. No deleted applications or invites.
        </div>
      `;
      return;
    }

    let html = '';
    
    const renderCard = (item, type) => {
      const dateStr = item.deletedAtMs ? new Date(item.deletedAtMs).toLocaleString() : "Unknown Date";
      return `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">
              ${type === 'APP' ? (item.itemTitle || item.category || "Application") : "Pairing Invite"} - ${item.seekerName || item.devoteeName || "Unknown"}
            </div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">
              ID: ${item.id} &bull; Deleted: ${dateStr}
            </div>
          </div>
          <button class="btn btn-sm btn-gold btn-restore-archive" data-id="${item.id}" data-type="${type}" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600;">
            ♻️ Restore
          </button>
        </div>
      `;
    };

    apps.forEach(a => { html += renderCard(a, 'APP'); });
    invites.forEach(i => { html += renderCard(i, 'INVITE'); });

    container.innerHTML = html;

    // Attach listeners
    container.querySelectorAll(".btn-restore-archive").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const type = e.currentTarget.getAttribute("data-type");
        
        if (type === 'APP') {
          if (typeof model.restoreSadhanaRemedyApplication === "function") {
            model.restoreSadhanaRemedyApplication(id);
          } else if (window.sadhanaRemedyModel) {
            window.sadhanaRemedyModel.restoreApplication(id);
          }
        } else if (type === 'INVITE') {
          if (typeof model.restorePairingInvite === "function") {
            model.restorePairingInvite(id);
          }
        }
        
        // Refresh UI
        this._loadArchiveData();
        
        // Optionally refresh main lists if profile controller exposes it
        if (this.controller && typeof this.controller.renderPendingApprovalsDrawer === "function") {
          this.controller.renderPendingApprovalsDrawer();
        }
      });
    });
  }
}

// Initialize when DOM is ready
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof window !== "undefined" && window.ProfileController) {
      // Monkey-patch the toggleSettingsModal to use our new controller
      const originalToggle = ProfileController.prototype._bindEvents;
      if (originalToggle) {
        ProfileController.prototype._initSettingsModal = function () {
          if (!this.settingsModalController) {
            this.settingsModalController = new SettingsModalController(this);
          }
        };
      }
    }
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = SettingsModalController;
}
if (typeof window !== "undefined") {
  window.SettingsModalController = SettingsModalController;
}
