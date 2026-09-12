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
    const matrix = this.controller.model.getAuthMatrix();
    const tbody = document.getElementById("auth-matrix-modal-tbody");
    if (!tbody || !matrix) return;

    // Group items by category
    const grouped = {};
    matrix.forEach((item) => {
      const cat = item.category || "Uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    let html = "";
    let lastCategory = null;

    matrix.forEach((item) => {
      // Add category header row when category changes
      if (item.category !== lastCategory) {
        lastCategory = item.category;
        html += `<tr class="auth-matrix-category-header">
          <td colspan="5" style="padding: 0.6rem 0.5rem; background: var(--bg-hover); font-weight: 700; font-size: 0.8rem; color: var(--text-primary); border-bottom: 2px solid var(--border-subtle);">
            ${item.category}
          </td>
        </tr>`;
      }

      // Add indent for sub-items based on level
      const indent = item.level ? "&nbsp;&nbsp;".repeat(item.level || 0) : "";
      const displayName = item.name || item.label;

      html += `<tr data-item-id="${item.id}" class="auth-matrix-row">
        <td style="padding: 0.4rem 0.5rem; border-bottom: 1px solid var(--border-subtle);">
          <div style="font-weight: 500; color: var(--text-primary); font-size: 0.75rem;">${indent}${displayName}</div>
          <div style="font-size: 0.6rem; color: var(--text-muted); margin-top: 2px;">${item.type}</div>
        </td>`;

      ["MASTER", "HEALER", "TRAINEE", "DEVOTEE"].forEach((role) => {
        const checked = item[role] !== false ? "checked" : "";
        html += `<td style="padding: 0.4rem; text-align: center; border-bottom: 1px solid var(--border-subtle);">
          <input type="checkbox" class="matrix-role-check" data-role="${role}" data-id="${item.id}" ${checked}>
        </td>`;
      });

      html += "</tr>";
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
    this._showToast("✅ Settings saved successfully");
    this._closeModal();
  }

  _saveAuthMatrix() {
    const matrix = this.controller.model.getAuthMatrix();
    const rows = document.querySelectorAll(
      "#auth-matrix-modal-tbody tr[data-item-id]",
    );

    rows.forEach((row) => {
      const itemId = row.getAttribute("data-item-id");
      const item = matrix.find((m) => m.id === itemId);
      if (item) {
        const roleCheckboxes = row.querySelectorAll(".matrix-role-check");
        roleCheckboxes.forEach((chk) => {
          const role = chk.getAttribute("data-role");
          item[role] = chk.checked;
        });
      }
    });

    this.controller.model.saveAuthMatrix(matrix);
    this.controller.view.applyDynamicAuthMatrix(
      matrix,
      this.controller.model.getRoleMode(),
    );
    this._showToast("💾 Auth matrix saved and applied");
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
    this.controller.model.saveAuthMatrix(defaultMatrix);
    this._loadAuthMatrix();
    this.controller.view.applyDynamicAuthMatrix(
      defaultMatrix,
      this.controller.model.getRoleMode(),
    );
    this._showToast("🔄 Auth matrix reset to defaults");
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
document.addEventListener("DOMContentLoaded", () => {
  if (window.ProfileController) {
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
