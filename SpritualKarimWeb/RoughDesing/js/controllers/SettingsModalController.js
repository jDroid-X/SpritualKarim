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
  "auth-matrix": {
    title: "Authorization Matrix",
    icon: "🛡️",
  },
  rbac: {
    title: "Role-Based Access Control",
    icon: "👥",
  },
  "register-devotee": {
    title: "Registration Requirements",
    icon: "📝",
  },
};

// ProfileController Extensions
class SettingsModalController {
  constructor(controller) {
    this.controller = controller;
    this.currentSection = "general";
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

    // Category filter dropdown and search input listeners
    const catFilter = document.getElementById("auth-matrix-modal-category-filter");
    if (catFilter) {
      catFilter.addEventListener("change", () => this._renderFilteredAuthMatrix());
    }
    const searchInput = document.getElementById("auth-matrix-modal-search");
    if (searchInput) {
      searchInput.addEventListener("input", () => this._renderFilteredAuthMatrix());
    }

    // Event delegation on tbody for role checks and bulk actions
    const tbody = document.getElementById("auth-matrix-modal-tbody");
    if (tbody) {
      tbody.addEventListener("change", (e) => {
        if (e.target.classList.contains("matrix-role-check")) {
          const itemId = e.target.getAttribute("data-id");
          const role = e.target.getAttribute("data-role");
          if (this._cachedMatrix) {
            const found = this._cachedMatrix.find((m) => m.id === itemId);
            if (found && role) found[role] = e.target.checked;
          }
        }
      });
      tbody.addEventListener("click", (e) => {
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
  }

  _switchSection(section) {
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
    this._loadSectionData(section);
    this.currentSection = section;
  }

  _loadSectionData(section) {
    switch (section) {
      case "auth-matrix":
        this._loadAuthMatrix();
        break;
      case "register-devotee":
        this._loadRegistrationFields();
        break;
      default:
        break;
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

    const roles = ["MASTER", "HEALER", "TRAINEE", "DEVOTEE", "SEEKER"];

    // Group items by category
    const grouped = new Map();
    this._cachedMatrix.forEach((item) => {
      const cat = item.category || "General";
      if (selectedCat !== "ALL" && cat !== selectedCat) return;

      if (query) {
        const nameMatch = (item.name || item.label || "").toLowerCase().includes(query);
        const typeMatch = (item.type || "").toLowerCase().includes(query);
        const catMatch = cat.toLowerCase().includes(query);
        const idMatch = (item.id || "").toLowerCase().includes(query);
        if (!nameMatch && !typeMatch && !catMatch && !idMatch) return;
      }

      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat).push(item);
    });

    if (grouped.size === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 1.5rem; color: var(--text-muted);">🔍 No screen elements match the selected filter.</td></tr>`;
      return;
    }

    let html = "";
    grouped.forEach((items, cat) => {
      // Screen Division Category Header Row
      html += `<tr class="auth-matrix-category-header" data-category="${cat}">
        <td colspan="6" style="padding: 0.65rem 0.75rem; background: var(--bg-hover, rgba(255,255,255,0.06)); border-bottom: 2px solid var(--border-subtle, rgba(255,255,255,0.15)); border-top: 2px solid var(--border-subtle, rgba(255,255,255,0.15));">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.82rem; color: var(--gold-400, #f59e0b);">📁 ${cat}</span>
              <span class="badge" style="font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 999px; background: rgba(255,255,255,0.08); color: var(--text-secondary);">${items.length} element${items.length > 1 ? "s" : ""}</span>
            </div>
            <div style="display: flex; gap: 0.3rem; align-items: center;">
              <span style="font-size: 0.68rem; color: var(--text-muted); margin-right: 0.2rem;">Quick Apply:</span>
              <button type="button" class="btn btn-xs btn-outline btn-cat-bulk-all" data-cat="${cat}" style="font-size: 0.65rem; padding: 0.1rem 0.45rem;" title="Enable for All Roles">All</button>
              <button type="button" class="btn btn-xs btn-outline btn-cat-bulk-staff" data-cat="${cat}" style="font-size: 0.65rem; padding: 0.1rem 0.45rem;" title="Enable for Staff (Master, Healer & Trainee)">Staff</button>
              <button type="button" class="btn btn-xs btn-outline btn-cat-bulk-none" data-cat="${cat}" style="font-size: 0.65rem; padding: 0.1rem 0.45rem;" title="Disable for All">Clear</button>
            </div>
          </div>
        </td>
      </tr>`;

      items.forEach((item) => {
        let indentPrefix = "";
        let rowStyle = "";
        let titleStyle = "font-size: 0.78rem; color: var(--text-primary);";
        let icon = "⚙️";

        if (item.level === 0) {
          indentPrefix = "";
          icon = "🖥️";
          titleStyle = "font-size: 0.82rem; font-weight: 700; color: #fff;";
          rowStyle = "background: rgba(255,255,255,0.02);";
        } else if (item.level === 1) {
          indentPrefix = "&nbsp;&nbsp;&nbsp;&nbsp;↳ ";
          icon = "📂";
          titleStyle = "font-size: 0.77rem; font-weight: 600; color: var(--gold-300, #fde68a);";
        } else {
          indentPrefix = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ ";
          icon = "⚙️";
          titleStyle = "font-size: 0.74rem; font-weight: 400; color: var(--text-secondary);";
        }

        const displayName = item.name || item.label || item.id;
        const typeBadge = `<span class="badge" style="font-size: 0.58rem; padding: 0.05rem 0.35rem; border-radius: 4px; background: rgba(255,255,255,0.06); color: var(--text-muted); margin-left: 0.4rem;">${item.type}</span>`;

        html += `<tr data-item-id="${item.id}" class="auth-matrix-row" style="${rowStyle}">
          <td style="padding: 0.45rem 0.6rem; border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.07));">
            <div style="display: flex; align-items: center;">
              <span>${indentPrefix}</span>
              <span style="margin-right: 0.35rem;">${icon}</span>
              <span style="${titleStyle}">${displayName}</span>
              ${typeBadge}
            </div>
            ${item.selector ? `<div style="font-size: 0.6rem; color: var(--text-muted); font-family: monospace; margin-left: ${item.level === 0 ? '1.5rem' : item.level === 1 ? '3rem' : '4.5rem'}; opacity: 0.6;">${item.selector}</div>` : ""}
          </td>`;

        roles.forEach((role) => {
          const checked = item[role] !== false ? "checked" : "";
          html += `<td style="padding: 0.4rem; text-align: center; border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.07));">
            <input type="checkbox" class="matrix-role-check" data-role="${role}" data-id="${item.id}" ${checked}>
          </td>`;
        });

        html += `</tr>`;
      });
    });

    tbody.innerHTML = html;
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
    this._showToast("✅ Settings saved successfully");
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
        const roleCheckboxes = row.querySelectorAll(".matrix-role-check");
        roleCheckboxes.forEach((chk) => {
          const role = chk.getAttribute("data-role");
          if (role) item[role] = chk.checked;
        });
      }
    });

    this.controller.model.saveAuthMatrix(this._cachedMatrix);
    this.controller.view.applyDynamicAuthMatrix(
      this._cachedMatrix,
      this.controller.model.getRoleMode(),
    );
    this._showToast("💾 Auth matrix saved and applied across all roles");
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
