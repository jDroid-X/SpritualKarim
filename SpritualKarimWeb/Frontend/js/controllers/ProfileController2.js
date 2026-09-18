// ProfileController2.js - Extended ProfileController prototype methods
if (typeof ProfileController === "undefined") {
  if (typeof require !== "undefined") {
    global.ProfileController = require("./ProfileController");
  }
}
ProfileController.prototype._bindEventsPart2 = function () {
  // Admin & RBAC Settings Modal Actions
  if (this.view.btnAdminSettings) {
    this.view.btnAdminSettings.addEventListener("click", () => {
      this.view.populateSettings(this.model.settings);
      this.view.toggleSettingsModal(true);
    });
  }

  const btnCloseSettings = document.getElementById("btn-close-settings-modal");
  if (btnCloseSettings)
    btnCloseSettings.addEventListener("click", () =>
      this.view.toggleSettingsModal(false),
    );
  const btnCancelSettings = document.getElementById("btn-cancel-settings");
  if (btnCancelSettings)
    btnCancelSettings.addEventListener("click", () =>
      this.view.toggleSettingsModal(false),
    );

  const btnSaveSettings = document.getElementById("btn-save-settings");
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener("click", () => {
      const newSettings = this.view.readSettingsFromForm();
      this.model.saveSettings(newSettings);
      this.view.toggleSettingsModal(false);
      this._renderCurrentState();
      this.view.showToast(
        "✓ Admin System & RBAC Permission Settings saved & synchronized!",
      );
    });
  }

  const btnResetSettings = document.getElementById("btn-reset-settings");
  if (btnResetSettings) {
    btnResetSettings.addEventListener("click", async (e) => {
      e.preventDefault();
      const choice = await this.view.openCustomDialog({
        title: "System Settings Safe Reset",
        message:
          "Choose an operational reset action for Spiritual Karim system settings and database cache.",
        icon: "⚠️",
        options: [
          {
            label: "🔄 Restore Factory Defaults",
            value: "DEFAULTS",
            class: "btn-danger",
          },
          {
            label: "☁️ Resync from Cloud Firebase",
            value: "CLOUD_RESYNC",
            class: "btn-gold",
          },
          { label: "Cancel", value: false, class: "btn-outline" },
        ],
      });

      if (choice === "DEFAULTS") {
        const def = this.model.getDefaultSettings();
        this.model.saveSettings(def);
        this.view.populateSettings(def);
        this.view.enforceRBAC(this.model.getRoleMode(), def);
        this.view.showSlideToast(
          "Reset Complete",
          "System settings restored to factory defaults.",
          "success",
          3500,
        );
      } else if (choice === "CLOUD_RESYNC") {
        await this.model.fetchFromFirebaseRealtime();
        this.view.populateSettings(this.model.settings);
        this._renderCurrentState();
        this.view.showSlideToast(
          "Cloud Synced",
          "Settings and nodes resynchronized from Firebase RTDB.",
          "success",
          3500,
        );
      }
    });
  }
  // Note: selectActiveProfile change is centrally handled in ProfileController.js to avoid duplicate render cycles


  if (this.view.profileDirectoryList) {
    this.view.profileDirectoryList.addEventListener("click", (e) => {
      const row = e.target.closest(".profile-item-row");
      if (row) {
        const id = row.getAttribute("data-id");
        this.model.setActiveProfileId(id);
        this._renderCurrentState();

        // Close mobile sidebar if open
        if (this.view.adminSidebar) {
          this.view.adminSidebar.classList.remove("mobile-open");
        }
        if (this.view.sidebarBackdrop) {
          this.view.sidebarBackdrop.classList.remove("open");
        }
      }
    });
  }

  // Toggle Payment Stamp in Top Box on Click
  if (this.view.displayPaymentStamp) {
    this.view.displayPaymentStamp.addEventListener("click", () => {
      const profile = this.model.getActiveProfile();
      const currentIsPaid =
        profile.isPaid !== false && profile.paymentStatus !== "FREE";
      profile.isPaid = !currentIsPaid;
      profile.paymentStatus = profile.isPaid ? "PAID" : "FREE";
      this.model.saveProfiles(this.model.profiles);
      this.view._renderHeaderCard(profile, this.model.getRoleMode());
      if (this.view.inputPaymentStatus) {
        this.view.inputPaymentStatus.value = profile.paymentStatus;
      }
      this.view._updateJSONPreview(profile);
      this.view.showToast(
        `Membership stamp toggled to: ${profile.paymentStatus === "PAID" ? "🟢 PAID" : "🔴 FREE"}`,
      );
    });
  }

  if (this.view.inputPaymentStatus) {
    this.view.inputPaymentStatus.addEventListener("change", (e) => {
      const profile = this.model.getActiveProfile();
      profile.paymentStatus = e.target.value;
      profile.isPaid = e.target.value === "PAID";
      this.model.saveProfiles(this.model.profiles);
      this.view._renderHeaderCard(profile, this.model.getRoleMode());
      this.view._updateJSONPreview(profile);
    });
  }

  // Trainee Sadhak Stamp Click & Select Change across all 3 categories
  const bindTraineeStampEvents = (container) => {
    if (!container) return;
    container.addEventListener("click", (e) => {
      const stampBtn = e.target.closest(".btn-toggle-trainee-stamp");
      if (stampBtn) {
        const itemId = stampBtn.getAttribute("data-item-id");
        const profile = this.model.getActiveProfile();
        const item = (profile.traineeSadhanas || []).find(
          (ts, i) => (ts.id || i.toString()) === itemId,
        );
        if (item) {
          const currentPaid =
            item.isPaid !== false && item.paymentStatus !== "FREE";
          item.isPaid = !currentPaid;
          item.paymentStatus = item.isPaid ? "PAID" : "FREE";
          this.model.saveProfiles(this.model.profiles);
          this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
          this.view._updateJSONPreview(profile);
          this.view.showToast(
            `"${item.title}" stamp set to ${item.paymentStatus === "PAID" ? "🟢 PAID" : "🔴 FREE"}`,
          );
        }
      }
    });

    container.addEventListener("change", (e) => {
      if (e.target.classList.contains("ts-paid-select")) {
        const itemId = e.target.getAttribute("data-item-id");
        const val = e.target.value;
        const profile = this.model.getActiveProfile();
        const item = (profile.traineeSadhanas || []).find(
          (ts, i) => (ts.id || i.toString()) === itemId,
        );
        if (item) {
          item.paymentStatus = val;
          item.isPaid = val === "PAID";
          this.model.saveProfiles(this.model.profiles);
          this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
          this.view._updateJSONPreview(profile);
          this.view.showToast(
            `"${item.title}" updated to ${val === "PAID" ? "🟢 PAID" : "🔴 FREE"}`,
          );
        }
      }
    });
  };

  bindTraineeStampEvents(this.view.traineeGroupSadhanas);
  bindTraineeStampEvents(this.view.traineeGroupRemedies);
  bindTraineeStampEvents(this.view.traineeGroupCleansing);

  // Create / Delete Profile
  const btnCreateProfile = document.getElementById("btn-create-profile");
  if (btnCreateProfile) {
    btnCreateProfile.addEventListener("click", () => {
      this.view.openCreateProfileModal(this.model.getActiveProfile());
      // Establish visual link activity with sidebar Share & Pair
      const sidebarBtn = document.getElementById("sidebar-btn-share-pairing");
      if (sidebarBtn) {
        sidebarBtn.classList.add("btn-pulse-glow");
        setTimeout(() => sidebarBtn.classList.remove("btn-pulse-glow"), 3500);
      }
    });
  }

  // Create Profile Modal Form Actions
  const btnSubmitCreateProfile = document.getElementById("btn-submit-create-profile");
  if (btnSubmitCreateProfile) {
    btnSubmitCreateProfile.addEventListener("click", () => {
      const form = this.view.readCreateProfileForm();
      const res = this.model.createCustomProfile(form);
      if (res && res.error) {
        if (typeof this.view.showSlideToast === "function") {
          this.view.showSlideToast("Validation Error", res.message, "error");
        } else {
          alert(res.message);
        }
        return;
      }
      const created = (res && res.profile) ? res.profile : res;
      this._renderCurrentState();
      this.view.closeCreateProfileModal();
      const toastMsg = created.deduplicated 
        ? `✓ Profile for "${created.name}" (${created.referenceCode}) updated in registry!`
        : `✓ Created & placed "${created.name}" (${created.referenceCode}) in lineage!`;
      this.view.showToast(toastMsg);
    });
  }

  const btnCloseCreateModal = document.getElementById("btn-close-create-profile-modal");
  if (btnCloseCreateModal) {
    btnCloseCreateModal.addEventListener("click", () => this.view.closeCreateProfileModal());
  }

  const btnCancelCreateModal = document.getElementById("btn-cancel-create-profile");
  if (btnCancelCreateModal) {
    btnCancelCreateModal.addEventListener("click", () => this.view.closeCreateProfileModal());
  }

  const btnModalTriggerPairing = document.getElementById("btn-modal-trigger-sidebar-pairing");
  if (btnModalTriggerPairing) {
    btnModalTriggerPairing.addEventListener("click", () => {
      this.view.closeCreateProfileModal();
      const sideBtn = document.getElementById("sidebar-btn-share-pairing");
      if (sideBtn) {
        sideBtn.click();
      } else {
        const prof = this.model.getActiveProfile();
        this.view.renderSharePairingModal(prof, this.model.getPairingInvites());
        this.view.toggleSharePairingModal(true);
      }
    });
  }

  // Live Field Validation bindings for Create Profile Form
  const inputCreateName = document.getElementById("new-profile-name");
  const inputCreatePhone = document.getElementById("new-profile-phone");
  const inputCreateSponsor = document.getElementById("new-profile-sponsor");

  if (typeof FormValidator !== "undefined") {
    if (inputCreateName) {
      FormValidator.bindFieldValidation(inputCreateName, (val) => FormValidator.validateName(val));
    }
    if (inputCreatePhone) {
      FormValidator.bindFieldValidation(inputCreatePhone, (val) => FormValidator.validatePhone(val));
    }
    if (inputCreateSponsor) {
      FormValidator.bindFieldValidation(inputCreateSponsor, (val) => FormValidator.validateReferenceCode(val, "SK"));
    }
  }


  const btnDeleteProfile = document.getElementById("btn-delete-profile");
  if (btnDeleteProfile) {
    btnDeleteProfile.addEventListener("click", () => {
      if (
        this.model.getRoleMode() === "DEVOTEE" &&
        !this.model.settings.allowDevoteeDelete
      ) {
        alert(
          "Action Prohibited: Devotee role is restricted from deleting profiles. Contact Master Administrator.",
        );
        return;
      }
      const current = this.model.getActiveProfile();
      if (confirm(`Delete profile "${current.name}"?`)) {
        if (this.model.deleteActiveProfile()) {
          this._renderCurrentState();
          this.view.showToast("Profile deleted.");
        }
      }
    });
  }

  // Reference Code Generators
  const btnGenRefCode = document.getElementById("btn-gen-ref-code");
  if (btnGenRefCode) {
    btnGenRefCode.addEventListener("click", () => {
      const prefix =
        this.model.getRoleMode() === "HEALER"
          ? "SKHL"
          : this.model.getRoleMode() === "DEVOTEE"
            ? "SKDV"
            : "SKHM";
      const code = this.model.generate16DigitCode(prefix);
      this.view.inputRefCode.value = code;
      this.view.showToast(`Generated: ${code}`);
    });
  }

  const btnCopyRefCode = document.getElementById("btn-copy-ref-code");
  if (btnCopyRefCode) {
    btnCopyRefCode.addEventListener("click", () => {
      const code = this.view.inputRefCode.value;
      navigator.clipboard.writeText(code).then(() => {
        this.view.showToast(`Copied ${code}!`);
      });
    });
  }

  // Reset Identity
  const btnResetIdentity = document.getElementById("btn-reset-identity");
  if (btnResetIdentity) {
    btnResetIdentity.addEventListener("click", () => {
      if (confirm("Reset personal identity fields?")) {
        this.view.inputName.value = "";
        this.view.inputSelfTitle.value = "";
        this.view.inputPhone.value = "";
        this.view.inputEmail.value = "";
        this.view.inputCity.value = "";
        this.view.inputAddress.value = "";
        this.view.showToast("Identity reset.");
      }
    });
  }

  // Lineage: Children Add / Delete
  const btnAddChild = document.getElementById("btn-add-child");
  if (btnAddChild) {
    btnAddChild.addEventListener("click", () => {
      const p = this.model.getActiveProfile();
      if (!p.lineage) p.lineage = {};
      if (!p.lineage.currentFamily) p.lineage.currentFamily = {};
      if (!p.lineage.currentFamily.children)
        p.lineage.currentFamily.children = [];
      p.lineage.currentFamily.children.push({
        id: "c" + Date.now().toString().slice(-4),
        name: "",
        gender: "Son",
        ageOrNote: "",
      });
      this.view._renderChildren(p.lineage.currentFamily.children);
    });
  }

  if (this.view.childrenContainer) {
    this.view.childrenContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-remove-child")) {
        if (
          this.model.getRoleMode() === "DEVOTEE" &&
          !this.model.settings.allowDevoteeDelete
        ) {
          alert("Action Prohibited: Devotee cannot delete lineage entries.");
          return;
        }
        const idx = parseInt(e.target.getAttribute("data-index"), 10);
        const p = this.model.getActiveProfile();
        p.lineage.currentFamily.children.splice(idx, 1);
        this.view._renderChildren(p.lineage.currentFamily.children);
      }
    });
  }

  // Lineage: Siblings Add / Delete
  const setupSiblingBranch = (btnId, container, branchPath) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener("click", () => {
        const p = this.model.getActiveProfile();
        const branchObj = this._getBranchObject(p, branchPath);
        if (!branchObj.siblings) branchObj.siblings = [];
        branchObj.siblings.push({
          id: "s" + Date.now().toString().slice(-4),
          name: "",
          relation: "Brother",
          spouseName: "",
          childrenSummary: "",
          isMarried: false,
          notes: "",
        });
        this.view._renderSiblings(container, branchObj.siblings, branchPath);
      });
    }

    if (container) {
      container.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-remove-sibling")) {
          if (
            this.model.getRoleMode() === "DEVOTEE" &&
            !this.model.settings.allowDevoteeDelete
          ) {
            alert("Action Prohibited: Devotee cannot delete lineage entries.");
            return;
          }
          const idx = parseInt(e.target.getAttribute("data-index"), 10);
          const p = this.model.getActiveProfile();
          const branchObj = this._getBranchObject(p, branchPath);
          branchObj.siblings.splice(idx, 1);
          this.view._renderSiblings(container, branchObj.siblings, branchPath);
        }
      });
    }
  };

  setupSiblingBranch(
    "btn-add-sibling-current",
    this.view.siblingsCurrentContainer,
    "current",
  );
  setupSiblingBranch(
    "btn-add-sibling-husband",
    this.view.siblingsHusbandContainer,
    "husband",
  );
  setupSiblingBranch(
    "btn-add-sibling-wife",
    this.view.siblingsWifeContainer,
    "wife",
  );

  // House Clean: Add / Delete
  const handleAddHouseClean = () => {
    const p = this.model.getActiveProfile();
    if (!p.houseCleanLevels) p.houseCleanLevels = [];
    const nextNum = p.houseCleanLevels.length + 1;
    p.houseCleanLevels.push({
      id: "hc-" + Date.now().toString().slice(-4),
      levelNumber: nextNum,
      levelTitle: `Level ${nextNum} — Custom House Clean`,
      status: "IN_PROGRESS",
      cleanPercentage: 0,
      cleanedDetails: "",
      mentorCode: null,
      mentorName: null,
      mentorRemarks: null,
      approvalDate: null,
    });
    this.view._renderHouseCleanCards(p.houseCleanLevels);
    this.view.showToast(`Added Level ${nextNum} House Clean record.`);
  };

  const btnAddHc = document.getElementById("btn-add-houseclean-record");
  if (btnAddHc) btnAddHc.addEventListener("click", handleAddHouseClean);
  const btnAddSeekerHc = document.getElementById("btn-add-seeker-clean-log");
  if (btnAddSeekerHc)
    btnAddSeekerHc.addEventListener("click", handleAddHouseClean);

  // Ancestor House Clean Buttons
  const btnHousecleanHusbandSide = document.getElementById(
    "btn-houseclean-husband-side",
  );
  if (btnHousecleanHusbandSide) {
    btnHousecleanHusbandSide.addEventListener("click", () => {
      this.view.showToast(
        "Adding House Clean record for Husband's ancestral side...",
      );
      handleAddHouseClean();
    });
  }

  const btnHousecleanWifeSide = document.getElementById(
    "btn-houseclean-wife-side",
  );
  if (btnHousecleanWifeSide) {
    btnHousecleanWifeSide.addEventListener("click", () => {
      this.view.showToast(
        "Adding House Clean record for Wife's ancestral side...",
      );
      handleAddHouseClean();
    });
  }

  // Upload Document Buttons for Each Level
  document.querySelectorAll(".btn-upload-level").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const level = e.currentTarget.getAttribute("data-level");
      this.view.showToast(`Upload document for Level ${level} House Clean`);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*,.pdf";
      input.onchange = (evt) => {
        const file = evt.target.files[0];
        if (file) {
          this.view.showToast(`📤 Uploaded: ${file.name}`);
        }
      };
      input.click();
    });
  });

  const handleHouseCleanDelete = (container) => {
    if (!container) return;
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete-houseclean")) {
        if (
          this.model.getRoleMode() === "DEVOTEE" &&
          !this.model.settings.allowDevoteeDelete
        ) {
          alert(
            "Action Prohibited: Devotee cannot delete house clean records.",
          );
          return;
        }
        const idx = parseInt(e.target.getAttribute("data-index"), 10);
        const p = this.model.getActiveProfile();
        p.houseCleanLevels.splice(idx, 1);
        this.view._renderHouseCleanCards(p.houseCleanLevels);
        this.view.showToast("House clean record deleted.");
      }
    });
  };
  handleHouseCleanDelete(this.view.devoteeHouseCleanContainer);
  handleHouseCleanDelete(this.view.seekerHouseCleanSummaryContainer);

  // Seeker Purpose & Custom Sadhanas
  const btnAddGoal = document.getElementById("btn-add-purpose-goal");
  if (btnAddGoal) {
    btnAddGoal.addEventListener("click", () => {
      const goal = prompt(
        "Enter New Spiritual Goal / Purpose:",
        "Kundalini Awakening & Family Protection",
      );
      if (goal) {
        this.view.inputObjective.value =
          (this.view.inputObjective.value
            ? this.view.inputObjective.value + "\n ? "
            : "? ") + goal;
        this.view.showToast("Added goal to Purpose.");
      }
    });
  }

  const btnResetPurpose = document.getElementById("btn-reset-purpose");
  if (btnResetPurpose) {
    btnResetPurpose.addEventListener("click", () => {
      if (confirm("Clear spiritual purpose fields?")) {
        this.view.inputObjective.value = "";
        this.view.seekerAfflictionDuration.value = "";
        this.view.seekerKuldeviIssues.value = "";
        this.view.seekerTargetOutcome.value = "";
        this.view.showToast("Purpose cleared.");
      }
    });
  }

  const btnAddCustomSadhana = document.getElementById("btn-add-custom-sadhana");
  if (btnAddCustomSadhana) {
    btnAddCustomSadhana.addEventListener("click", () => {
      const p = this.model.getActiveProfile();
      if (!p.interestedSadhanas) p.interestedSadhanas = [];
      p.interestedSadhanas.push({
        id: "is-" + Date.now().toString().slice(-4),
        name: "Custom Sadhana Title",
        category: "Sadhana",
        priority: "High",
        status: "Interested",
      });
      this.view._renderInterestedSadhanas(p.interestedSadhanas);
    });
  }

  if (this.view.interestedSadhanasContainer) {
    this.view.interestedSadhanasContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-remove-interested-sadhana")) {
        if (
          this.model.getRoleMode() === "DEVOTEE" &&
          !this.model.settings.allowDevoteeDelete
        ) {
          alert(
            "Action Prohibited: Devotee cannot delete sadhanas from enrolled queue.",
          );
          return;
        }
        const idx = parseInt(e.target.getAttribute("data-index"), 10);
        const p = this.model.getActiveProfile();
        p.interestedSadhanas.splice(idx, 1);
        this.view._renderInterestedSadhanas(p.interestedSadhanas);
      }
    });
  }

  // Delegated Sadhana Detail Preview actions (Prescription Drawer & Apply for Initiation)
  const sadhanaPreviewContainer = document.getElementById("sadhana-detail-preview-container");
  if (sadhanaPreviewContainer) {
    sadhanaPreviewContainer.addEventListener("click", (e) => {
      const btnDrawer = e.target.closest(".btn-open-sadhana-drawer-from-preview");
      if (btnDrawer) {
        const sKey = btnDrawer.getAttribute("data-sadhana");
        if (sKey && typeof this._openSadhanaDrawer === "function") {
          this._openSadhanaDrawer(sKey);
        } else if (sKey && typeof this.view.openSadhanaDrawer === "function") {
          this.view.openSadhanaDrawer(sKey);
        }
        return;
      }

      const btnApply = e.target.closest(".btn-apply-sadhana-initiation");
      if (btnApply) {
        const sKey = btnApply.getAttribute("data-sadhana");
        if (window.sadhanaRemedyController) {
          const contextType = (sKey && sKey.toLowerCase().includes('remedy')) ? 'remedy' : 'sadhana';
          window.sadhanaRemedyController.initiateFlow(contextType);
          
          // Try to pre-select the specific sadhana in the modal's dropdown
          setTimeout(() => {
            if (window.sadhanaRemedyController.view && window.sadhanaRemedyController.view.selectItem) {
              const selectEl = window.sadhanaRemedyController.view.selectItem;
              // Check if option exists before setting
              const optionExists = Array.from(selectEl.options).some(opt => opt.value === sKey);
              if (optionExists) {
                selectEl.value = sKey;
              }
            }
          }, 50);
        } else {
          console.error("sadhanaRemedyController is not initialized.");
        }
        return;
      }
    });
  }

  // Trainee Sadhak: Apply for Healer Certification
  const btnApplyHealer = document.getElementById("btn-apply-healer-certification");
  if (btnApplyHealer) {
    btnApplyHealer.addEventListener("click", () => {
      const p = this.model.getActiveProfile();
      if (confirm(`Submit Application for Certified Spiritual Healer Guide Status?\n\nThis authorization request will be sent to Admin Master for review and approval.`)) {
        const defaultMentor = (this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : ((typeof appConfig !== "undefined" && appConfig.defaultMentorCode) || "SKHM-ADM1-7788-9900");
        const invites = this.model.getPairingInvites();
        const newReq = {
          id: "req-healer-" + Date.now().toString(36),
          sponsorCode: defaultMentor,
          devoteeCode: p.referenceCode,
          seekerName: p.name || "Trainee Applicant",
          seekerPhone: p.phone || "+91 98000 00000",
          seekerDeviceModel: "Trainee Sadhak Portal",
          hardwareNonce: p.referenceCode,
          type: "HEALER_APPLICATION",
          traineeId: p.id,
          assignedRole: "HEALER",
          createdAtMs: Date.now(),
          expiresAtMs: Date.now() + 24 * 60 * 60 * 1000,
          status: "PENDING",
          formattedCreatedTime: "Just Now",
        };
        invites.unshift(newReq);
        this.model.savePairingInvites(invites);
        this.view.showSlideToast(
          "Healer Application Sent",
          `🛡️ Application for Certified Healer status submitted to Admin Master.`,
          "success",
          4000
        );
        this._renderCurrentState();
      }
    });
  }

  // Trainee Sadhak: Add / Delete
  const btnAddTraineeSadhana = document.getElementById(
    "btn-add-trainee-sadhana",
  );
  if (btnAddTraineeSadhana) {
    btnAddTraineeSadhana.addEventListener("click", () => {
      const p = this.model.getActiveProfile();
      if (!p.traineeSadhanas) p.traineeSadhanas = [];
      const defaultMentor = (this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : ((typeof appConfig !== "undefined" && appConfig.defaultMentorCode) || "SKHM-ADM1-7788-9900");
      p.traineeSadhanas.push({
        id: "ts-" + Date.now().toString().slice(-4),
        sadhanaKey: "sri_yantra",
        title: "New In-Progress Sadhana",
        categoryDomain: "sadhanas",
        isPaid: p.isPaid || false,
        paymentStatus: p.isPaid ? "PAID" : "FREE",
        level: "Level 1 — Novice Initiation",
        dailyTarget: "11 Malas Daily",
        currentStreak: "1 Day",
        progressPercent: 10,
        status: "In Progress",
        mentorCode: p.referredByCode || defaultMentor,
        diaryNotes: "Initial mantra attunement started.",
      });
      this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas);
      this.view.showToast("Added In-Progress Sadhana.");
    });
  }

  const handleTraineeDelete = (container) => {
    if (!container) return;
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete-trainee-item")) {
        if (
          this.model.getRoleMode() === "DEVOTEE" &&
          !this.model.settings.allowDevoteeDelete
        ) {
          alert("Action Prohibited: Devotee cannot delete trainee sadhanas.");
          return;
        }
        const itemId = e.target.getAttribute("data-item-id");
        const p = this.model.getActiveProfile();
        p.traineeSadhanas = p.traineeSadhanas.filter(
          (ts, i) => (ts.id || i.toString()) !== itemId,
        );
        this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas);
        this.view.showToast("In-progress sadhana deleted.");
      }
    });
  };
  handleTraineeDelete(this.view.traineeGroupSadhanas);
  handleTraineeDelete(this.view.traineeGroupRemedies);
  handleTraineeDelete(this.view.traineeGroupCleansing);

  // Healer Connect: Add / Delete
  const btnAddCompletedSadhana = document.getElementById(
    "btn-add-completed-sadhana",
  );
  if (btnAddCompletedSadhana) {
    btnAddCompletedSadhana.addEventListener("click", () => {
      const p = this.model.getActiveProfile();
      if (!p.healerCompletedSadhanas) p.healerCompletedSadhanas = [];
      p.healerCompletedSadhanas.push({
        id: "hcs-" + Date.now().toString().slice(-4),
        title: "New Completed Master Sadhana",
        levelCompleted: "Level 3 — Healer Acharya",
        completionDate: new Date().toISOString().split("T")[0],
        status: "Certified Master",
        seekersGuidedCount: 0,
        authorizedToGuide: true,
        sealCode:
          "SKHM-SEAL-" + Math.random().toString(36).substr(2, 4).toUpperCase(),
      });
      this.view._renderHealerCompleted(p.healerCompletedSadhanas);
      this.view.showToast("Added Completed Sadhana Credential.");
    });
  }

  if (this.view.healerCompletedSadhanasContainer) {
    this.view.healerCompletedSadhanasContainer.addEventListener(
      "click",
      (e) => {
        if (e.target.classList.contains("btn-delete-healer-sadhana")) {
          if (
            this.model.getRoleMode() === "DEVOTEE" &&
            !this.model.settings.allowDevoteeDelete
          ) {
            alert(
              "Action Prohibited: Devotee cannot delete master credentials.",
            );
            return;
          }
          const idx = parseInt(e.target.getAttribute("data-index"), 10);
          const p = this.model.getActiveProfile();
          p.healerCompletedSadhanas.splice(idx, 1);
          this.view._renderHealerCompleted(p.healerCompletedSadhanas);
          this.view.showToast("Completed sadhana credential deleted.");
        }
      },
    );
  }

  const btnAddNetDevotee = document.getElementById("btn-add-connected-devotee");
  if (btnAddNetDevotee) {
    btnAddNetDevotee.addEventListener("click", () => {
      const p = this.model.getActiveProfile();
      if (!p.healerNetwork) p.healerNetwork = [];
      p.healerNetwork.push({
        id: "net-" + Date.now().toString().slice(-4),
        name: "Connected Devotee Name",
        refCode: this.model.generate16DigitCode("SKHM"),
        role: "Devotee (Level 5)",
        activeCases: 1,
      });
      this.view._renderHealerNetwork(p.healerNetwork);
    });
  }

  if (this.view.healerNetworkContainer) {
    this.view.healerNetworkContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-remove-network-devotee")) {
        if (
          this.model.getRoleMode() === "DEVOTEE" &&
          !this.model.settings.allowDevoteeDelete
        ) {
          alert("Action Prohibited: Devotee cannot unlink network entries.");
          return;
        }
        const idx = parseInt(e.target.getAttribute("data-index"), 10);
        const p = this.model.getActiveProfile();
        p.healerNetwork.splice(idx, 1);
        this.view._renderHealerNetwork(p.healerNetwork);
        this.view.showToast("Devotee unlinked.");
      }
    });
  }

  // Form Save
  if (this.view.form) {
    this.view.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._saveFormChanges();
    });
  }

  const btnSaveProfile = document.getElementById("btn-save-profile");
  if (btnSaveProfile) {
    btnSaveProfile.addEventListener("click", () => {
      this._saveFormChanges();
    });
  }

  // JSON Drawer
  const btnToggleJson = document.getElementById("btn-toggle-json-drawer");
  if (btnToggleJson)
    btnToggleJson.addEventListener("click", () =>
      this.view.toggleJsonDrawer(true),
    );
  const btnCloseJson = document.getElementById("btn-close-json-drawer");
  if (btnCloseJson)
    btnCloseJson.addEventListener("click", () =>
      this.view.toggleJsonDrawer(false),
    );
  const jsonBackdrop = document.getElementById("json-drawer-backdrop");
  if (jsonBackdrop)
    jsonBackdrop.addEventListener("click", () =>
      this.view.toggleJsonDrawer(false),
    );

  const btnCopyJson = document.getElementById("btn-copy-json-code");
  if (btnCopyJson) {
    btnCopyJson.addEventListener("click", () => {
      navigator.clipboard
        .writeText(this.view.jsonPreviewCode.textContent)
        .then(() => {
          this.view.showToast("Profile JSON copied to clipboard!");
        });
    });
  }

  const btnDownloadJson = document.getElementById("btn-download-json-file");
  if (btnDownloadJson) {
    btnDownloadJson.addEventListener("click", () => {
      const active = this.model.getActiveProfile();
      const code = JSON.stringify(active, null, 2);
      const blob = new Blob([code], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `healer_profile_${active.referenceCode}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const btnImportJson = document.getElementById("btn-import-json");
  if (btnImportJson)
    btnImportJson.addEventListener("click", () =>
      this.view.toggleImportModal(true),
    );
  const btnCloseImport = document.getElementById("btn-close-import-modal");
  if (btnCloseImport)
    btnCloseImport.addEventListener("click", () =>
      this.view.toggleImportModal(false),
    );
  const btnCancelImport = document.getElementById("btn-cancel-import");
  if (btnCancelImport)
    btnCancelImport.addEventListener("click", () =>
      this.view.toggleImportModal(false),
    );
  const importModal = document.getElementById("import-modal");
  if (importModal) {
    importModal.addEventListener("click", (e) => {
      if (e.target === importModal) this.view.toggleImportModal(false);
    });
  }

  const btnExecImport = document.getElementById("btn-execute-import");
  if (btnExecImport) {
    btnExecImport.addEventListener("click", () => {
      const raw = document.getElementById("import-json-textarea").value.trim();
      try {
        const parsed = JSON.parse(raw);
        const candidates = Array.isArray(parsed) ? parsed : [parsed];
        for (const p of candidates) {
          if (!p.name || !p.referenceCode)
            throw new Error("Missing name or referenceCode in payload.");
        }

        // Closed-Loop Core-Op 03: Safe pre-import snapshot with rollback capability
        const backupKey = "sk_pre_import_backup_" + Date.now();
        localStorage.setItem(backupKey, JSON.stringify(this.model.profiles));
        window.__skLastImportBackupKey = backupKey;

        // Circular Dependency Guard (Rule 13 & DS-05)
        for (const p of candidates) {
          p.id = p.id || "prof-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
          if (p.referredByCode && typeof this.model.isCircularSponsor === "function") {
            const hasLoop = this.model.isCircularSponsor(p.referenceCode, p.referredByCode);
            if (hasLoop) {
              // Rollback instantly
              localStorage.setItem("sk_admin_profiles_v3", localStorage.getItem(backupKey));
              throw new Error(`Circular sponsoring loop detected for ${p.name} -> ${p.referredByCode}. Rolled back.`);
            }
          }
        }

        for (const p of candidates) {
          const existingIdx = this.model.profiles.findIndex(item => item.id === p.id || item.referenceCode === p.referenceCode);
          if (existingIdx >= 0) {
            this.model.profiles[existingIdx] = p;
          } else {
            this.model.profiles.push(p);
          }
        }
        this.model.saveProfiles(this.model.profiles);
        this.model.setActiveProfileId(candidates[0].id);
        this.view.toggleImportModal(false);
        this._renderCurrentState();
        this.view.showToast(`✓ Imported ${candidates.length} profiles safely with rollback snapshot (${backupKey})`);
      } catch (err) {
        alert("JSON Import Aborted: " + err.message);
      }
    });
  }

  const btnExportJson = document.getElementById("btn-export-json");
  if (btnExportJson) {
    btnExportJson.addEventListener("click", () => {
      const all = JSON.stringify(this.model.profiles, null, 2);
      const blob = new Blob([all], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `spiritual_karim_all_profiles.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.view.showToast("Exported all profiles JSON for Android app.");
    });
  }

  // In-Body Left Tier Profiles Panel Close & Collapse Controls
  if (this.view.btnCloseTierPanel) {
    this.view.btnCloseTierPanel.addEventListener("click", () => {
      this.view.closeTierPanel();
    });
  }

  if (this.view.btnCollapseTierPanel) {
    this.view.btnCollapseTierPanel.addEventListener("click", () => {
      this.view.closeTierPanel();
    });
  }

  // Filter helper combining search query and active filter chip
  const applyTierFiltering = () => {
    const q = this.view.inputTierPanelSearch
      ? this.view.inputTierPanelSearch.value.toLowerCase().trim()
      : "";
    const activeChip = this.view.tierFilterChips
      ? this.view.tierFilterChips.querySelector(".tier-filter-chip.active")
      : null;
    const filterType = activeChip ? activeChip.getAttribute("data-filter") : "ALL";

    let filtered = (this.view.currentTierProfiles || []).filter((p) => {
      // 1. Text search match
      const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
      const searchTarget = [
        p.name, p.fullName, p.referenceCode, p.gotra, p.city, p.phone, p.role, p.profileType
      ].filter(Boolean).join(" ").toLowerCase();
      const matchesQuery = tokens.length === 0 || tokens.every((tok) => searchTarget.includes(tok));

      if (!matchesQuery) return false;

      // 2. Chip filter match
      if (filterType === "ACTIVE") return p.isActive === true;
      if (filterType === "PAID") return p.isPaid !== false && p.paymentStatus !== "FREE";
      if (filterType === "FREE") return p.paymentStatus === "FREE" || p.isPaid === false;
      return true;
    });

    const metaColor =
      { 1: "#8b5cf6", 2: "#10b981", 3: "#f59e0b", 4: "#3b82f6" }[
        this.view.currentOpenTier
      ] || "#d4af37";

    this.view._renderTierPanelCards(
      filtered,
      this.model.activeProfileId,
      metaColor,
    );

    if (this.view.tierPanelCount) {
      this.view.tierPanelCount.textContent = `${filtered.length} Member${filtered.length !== 1 ? "s" : ""}`;
    }

    if (filtered.length > 0 && typeof this.view.renderTierProfileDetails === "function") {
      this.view.renderTierProfileDetails(filtered[0]);
    }
  };

  if (this.view.tierPanelProfilesList) {
    this.view.tierPanelProfilesList.addEventListener("click", (e) => {
      const card = e.target.closest(".tier-panel-profile-card, .tier-member-row-item");
      if (card) {
        const id = card.getAttribute("data-id") || card.getAttribute("data-profile-id");
        this.model.setInspectedProfileId(id);
        const activeP = (this.model.getProfileById && this.model.getProfileById(id)) || this.model.getActiveProfile();
        this.view.currentSelectedTierMember = activeP;
        this._renderCurrentState();

        // Highlight card in tier panel
        this.view.tierPanelProfilesList
          .querySelectorAll(".tier-panel-profile-card, .tier-member-row-item")
          .forEach((c) => c.classList.remove("active"));
        card.classList.add("active");

        // Populate right panel with selected member details
        if (typeof this.view.renderTierProfileDetails === "function" && activeP) {
          this.view.renderTierProfileDetails(activeP);
        }

        this.view.showSlideToast(
          "Downline Inspected",
          `🚀 Viewing downline profile: ${activeP.name} (${activeP.profileType || "DEVOTEE"})`,
          "info",
          2500,
        );
      }
    });
  }

  if (this.view.inputTierPanelSearch) {
    this.view.inputTierPanelSearch.addEventListener("input", (e) => {
      const hasValue = e.target.value.trim().length > 0;
      if (this.view.btnClearTierSearch) {
        this.view.btnClearTierSearch.style.display = hasValue ? "block" : "none";
      }
      applyTierFiltering();
    });
  }

  if (this.view.btnClearTierSearch) {
    this.view.btnClearTierSearch.addEventListener("click", () => {
      if (this.view.inputTierPanelSearch) {
        this.view.inputTierPanelSearch.value = "";
        this.view.inputTierPanelSearch.focus();
      }
      this.view.btnClearTierSearch.style.display = "none";
      applyTierFiltering();
    });
  }

  if (this.view.tierFilterChips) {
    this.view.tierFilterChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".tier-filter-chip");
      if (chip) {
        this.view.tierFilterChips
          .querySelectorAll(".tier-filter-chip")
          .forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        applyTierFiltering();
      }
    });
  }

  if (this.view.btnOpenTreeView) {
    this.view.btnOpenTreeView.addEventListener("click", () => {
      if (this.view.bodyTreeTierFilter)
        this.view.bodyTreeTierFilter.value = "ALL";
      this.switchMainTab("tab-genealogy-tree");
      this.view.renderInBodyHierarchyTree(
        this.model.profiles,
        null,
        "",
        this.view.inBodyTreePanState?.layoutMode || "cluster",
      );
      setTimeout(() => {
        this.view.smartFitInBodyTree();
      }, 100);
    });
  }

  // In-Body Tree Search & Filter Events
  if (this.view.bodyTreeSearchInput) {
    this.view.bodyTreeSearchInput.addEventListener("input", (e) => {
      const q = e.target.value;
      const filterVal = this.view.bodyTreeTierFilter
        ? this.view.bodyTreeTierFilter.value
        : "ALL";
      const tier = filterVal === "ALL" ? null : parseInt(filterVal, 10);
      this.view.renderInBodyHierarchyTree(
        this.model.profiles,
        tier,
        q,
        this.view.inBodyTreePanState?.layoutMode || "cluster",
      );
    });
  }

  if (this.view.btnClearTreeSearch) {
    this.view.btnClearTreeSearch.addEventListener("click", () => {
      if (this.view.bodyTreeSearchInput) {
        this.view.bodyTreeSearchInput.value = "";
        const filterVal = this.view.bodyTreeTierFilter
          ? this.view.bodyTreeTierFilter.value
          : "ALL";
        const tier = filterVal === "ALL" ? null : parseInt(filterVal, 10);
        this.view.renderInBodyHierarchyTree(
          this.model.profiles,
          tier,
          "",
          this.view.inBodyTreePanState?.layoutMode || "cluster",
        );
      }
    });
  }

  if (this.view.bodyTreeTierFilter) {
    this.view.bodyTreeTierFilter.addEventListener("change", (e) => {
      const filterVal = e.target.value;
      const tier = filterVal === "ALL" ? null : parseInt(filterVal, 10);
      const q = this.view.bodyTreeSearchInput
        ? this.view.bodyTreeSearchInput.value
        : "";
      this.view.renderInBodyHierarchyTree(
        this.model.profiles,
        tier,
        q,
        this.view.inBodyTreePanState?.layoutMode || "cluster",
      );
      setTimeout(() => this.view.smartFitInBodyTree(), 80);
    });
  }

  // Layout Mode Segmented Toggles
  if (this.view.btnLayoutCluster) {
    this.view.btnLayoutCluster.addEventListener("click", () => {
      this.view.inBodyTreePanState.layoutMode = "cluster";
      this.view.btnLayoutCluster.classList.add("active");
      if (this.view.btnLayoutSpiderweb)
        this.view.btnLayoutSpiderweb.classList.remove("active");
      const filterVal = this.view.bodyTreeTierFilter
        ? this.view.bodyTreeTierFilter.value
        : "ALL";
      const tier = filterVal === "ALL" ? null : parseInt(filterVal, 10);
      const q = this.view.bodyTreeSearchInput
        ? this.view.bodyTreeSearchInput.value
        : "";
      this.view.renderInBodyHierarchyTree(
        this.model.profiles,
        tier,
        q,
        "cluster",
      );
      this.view.showToast("🌳 Layout switched: Clustered MLM Sub-trees");
    });
  }

  if (this.view.btnLayoutSpiderweb) {
    this.view.btnLayoutSpiderweb.addEventListener("click", () => {
      this.view.inBodyTreePanState.layoutMode = "spiderweb";
      this.view.btnLayoutSpiderweb.classList.add("active");
      if (this.view.btnLayoutCluster)
        this.view.btnLayoutCluster.classList.remove("active");
      const filterVal = this.view.bodyTreeTierFilter
        ? this.view.bodyTreeTierFilter.value
        : "ALL";
      const tier = filterVal === "ALL" ? null : parseInt(filterVal, 10);
      const q = this.view.bodyTreeSearchInput
        ? this.view.bodyTreeSearchInput.value
        : "";
      this.view.renderInBodyHierarchyTree(
        this.model.profiles,
        tier,
        q,
        "spiderweb",
      );
      this.view.showToast("🕸️ Layout switched: Spiderweb Matrix Flow");
    });
  }

  // In-Body Tree Canvas Pan/Zoom Events Initialization
  this.view._initInBodyTreePanZoomEvents();

  // Node Click & Double Click on In-Body Canvas
  if (this.view.bodyTreeCanvasViewport) {
    this.view.bodyTreeCanvasViewport.addEventListener("click", (e) => {
      const node = e.target.closest(".spiderweb-node");
      if (node) {
        const profileId = node.getAttribute("data-profile-id");
        const profile = this.model.profiles.find((p) => p.id === profileId) || {
          id: profileId,
          name:
            node.querySelector(".person-node-name")?.textContent || "Member",
          referenceCode: "SKHM-MEM1-8899-0011",
          level: node.getAttribute("data-tier") || 4,
          isPaid: true,
        };
        this.view.renderTreeProfileDrawer(profile);
        this.view.toggleTreeProfileDrawer(true);
      }
    });

    // Double Click -> Jump straight to profile
    this.view.bodyTreeCanvasViewport.addEventListener("dblclick", (e) => {
      const node = e.target.closest(".spiderweb-node");
      if (node) {
        const profileId = node.getAttribute("data-profile-id");
        if (profileId && this.model.profiles.some((p) => p.id === profileId)) {
          this.model.setActiveProfileId(profileId);
          this.view.toggleTreeProfileDrawer(false);
          this._renderCurrentState();
          this.switchMainTab("tab-devotee-personal");
          const active = this.model.getActiveProfile();
          this.view.showToast(
            `🚀 Switched to active workspace of "${active.name}"`,
          );
        }
      }
    });

    // Context Menu (Right Click) -> Open Node Action Dialog
    this.view.bodyTreeCanvasViewport.addEventListener("contextmenu", (e) => {
      const node = e.target.closest(".spiderweb-node");
      if (node) {
        e.preventDefault();
        const profileId = node.getAttribute("data-profile-id");
        const profile = this.model.profiles.find((p) => p.id === profileId) || {
          id: profileId,
          name:
            node.querySelector(".person-node-name")?.textContent || "Member",
          referenceCode: "SKHM-MEM1-8899-0011",
          level: node.getAttribute("data-tier") || 4,
        };
        this.view.openNodeActionDialog(profile);
      }
    });
  }

  // Node Action Dialog Actions
  if (this.view.nodeActionDialog) {
    this.view.nodeActionDialog.addEventListener("click", (e) => {
      const btnEdit = e.target.closest("#btn-node-opt-edit");
      if (btnEdit) {
        const pid = btnEdit.getAttribute("data-profile-id");
        if (pid && this.model.profiles.some((p) => p.id === pid)) {
          this.model.setActiveProfileId(pid);
          this._renderCurrentState();
          this.switchMainTab("tab-devotee-personal");
        }
        this.view.closeNodeActionDialog();
        return;
      }

      const btnShare = e.target.closest("#btn-node-opt-share");
      if (btnShare) {
        this.view.closeNodeActionDialog();
        const p = this.model.getActiveProfile();
        this.view.renderSharePairingModal(
          p,
          this.model.getPairingInvites(),
          this.model.settings,
        );
        this.view.toggleSharePairingModal(true);
        return;
      }

      const btnCopy = e.target.closest("#btn-node-opt-copy");
      if (btnCopy) {
        const code = btnCopy.getAttribute("data-code");
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            this.view.showToast(`📋 Copied reference code: ${code}`);
          });
        }
        this.view.closeNodeActionDialog();
        return;
      }

      const btnInspect = e.target.closest("#btn-node-opt-inspect");
      if (btnInspect) {
        const pid = btnInspect.getAttribute("data-profile-id");
        const prof = this.model.profiles.find((p) => p.id === pid);
        if (prof) {
          this.view.renderTreeProfileDrawer(prof);
          this.view.toggleTreeProfileDrawer(true);
        }
        this.view.closeNodeActionDialog();
        return;
      }
    });
  }

  if (this.view.btnCloseNodeDialog) {
    this.view.btnCloseNodeDialog.addEventListener("click", () =>
      this.view.closeNodeActionDialog(),
    );
  }
  if (this.view.btnCloseNodeDialogFooter) {
    this.view.btnCloseNodeDialogFooter.addEventListener("click", () =>
      this.view.closeNodeActionDialog(),
    );
  }

  if (this.view.btnCloseTreeModal) {
    this.view.btnCloseTreeModal.addEventListener("click", () => {
      this.view.toggleTreeModal(false);
    });
  }

  // Modal Tree fallback interactions
  if (this.view.treeCanvasViewport) {
    this.view.treeCanvasViewport.addEventListener("click", (e) => {
      const node =
        e.target.closest(".spiderweb-node") ||
        e.target.closest(".mlm-tree-node");
      if (node) {
        const profileId = node.getAttribute("data-profile-id");
        const profile = this.model.profiles.find((p) => p.id === profileId);
        if (profile) {
          this.view.renderTreeProfileDrawer(profile);
          this.view.toggleTreeProfileDrawer(true);
        }
      }
    });
  }

  if (this.view.btnCloseTreeDrawer) {
    this.view.btnCloseTreeDrawer.addEventListener("click", () => {
      this.view.toggleTreeProfileDrawer(false);
    });
  }

  if (this.view.treeDrawerBackdrop) {
    this.view.treeDrawerBackdrop.addEventListener("click", () => {
      this.view.toggleTreeProfileDrawer(false);
    });
  }

  if (this.view.btnTreeLoadProfile) {
    this.view.btnTreeLoadProfile.addEventListener("click", () => {
      const profileId =
        this.view.btnTreeLoadProfile.getAttribute("data-profile-id");
      if (profileId) {
        this.model.setActiveProfileId(profileId);
        this.view.toggleTreeProfileDrawer(false);
        this.view.toggleTreeModal(false);
        this._renderCurrentState();
        const active = this.model.getActiveProfile();
        this.view.showToast(`🚀 Switched active profile to "${active.name}"`);
      }
    });
  }

  // ==============================================================
  // Top Right: Admin Settings Modal Events
  // ==============================================================
  if (this.view.btnAdminSettings) {
    this.view.btnAdminSettings.addEventListener("click", () => {
      if (this.model.getRoleMode() !== "MASTER") {
        this.view.showToast("🔒 Admin Settings is restricted to Master role.");
        return;
      }
      this.view.populateSettings(this.model.settings);
      this.view.toggleSettingsModal(true);
    });
  }

  if (this.view.btnCloseAdminSettings) {
    this.view.btnCloseAdminSettings.addEventListener("click", () => {
      this.view.toggleSettingsModal(false);
    });
  }

  if (this.view.btnSaveSettings) {
    this.view.btnSaveSettings.addEventListener("click", () => {
      const newSettings = this.view.readSettingsFromForm();
      this.model.saveSettings(newSettings);
      this.view.enforceRBAC(this.model.getRoleMode(), newSettings);
      this.view.toggleSettingsModal(false);
      this.view.showToast(
        "✓ Admin Settings successfully saved & synchronized!",
      );
    });
  }

  if (this.view.btnResetSettings) {
    this.view.btnResetSettings.addEventListener("click", () => {
      if (confirm("Factory reset all admin settings to system defaults?")) {
        const def = this.model.getDefaultSettings();
        this.model.saveSettings(def);
        this.view.populateSettings(def);
        this.view.enforceRBAC(this.model.getRoleMode(), def);
        this.view.showToast("Admin settings reset to defaults.");
      }
    });
  }

  // ==============================================================
  // Top Right: Share & Pair (24-Hour Protocol) Modal Events
  // ==============================================================
  if (this.view.btnQuickSharePairing) {
    this.view.btnQuickSharePairing.addEventListener("click", () => {
      const profile = this.model.getActiveProfile();
      const invites = this.model.getPairingInvites();
      this.view._renderSharePairingModal(profile, invites);
      this.view.toggleSharePairingModal(true);
    });
  }

  if (this.view.btnCloseSharePairingModal) {
    this.view.btnCloseSharePairingModal.addEventListener("click", () => {
      this.view.toggleSharePairingModal(false);
    });
  }

  if (this.view.sharePairingModalBody) {
    this.view.sharePairingModalBody.addEventListener("click", (e) => {
      const approveBtn = e.target.closest(".btn-approve-pairing, .btn-open-applicant-drawer, .btn-review-pairing, .applicant-avatar-thumb");
      if (approveBtn) {
        // Delegated and handled centrally by ProfileController click dispatcher to prevent duplicate sync
        return;
      }

      const newDevoteeBtn = e.target.closest("#btn-open-new-devotee-modal");
      if (newDevoteeBtn) {
        const profile = this.model.getActiveProfile();
        const defaultMentor = (this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : ((typeof appConfig !== "undefined" && appConfig.defaultMentorCode) || "SKHM-ADM1-7788-9900");
        const sponsorCode = profile.referenceCode || defaultMentor;
        const invites = this.model.getPairingInvites();
        const maxPending = this.model.settings.maxPendingInvitesPerMentor || 5;
        const activePending = invites.filter(
          (i) => i.sponsorCode === sponsorCode && i.status === "PENDING"
        );
        if (activePending.length >= maxPending) {
          alert(`Invite quota reached: Maximum ${maxPending} pending pairing requests allowed simultaneously per mentor. Please approve or reject waiting applicants first.`);
          return;
        }

        // Generate fresh 16-digit devotee code
        const devoteeCode = this.model.generate16DigitCode("SKDV");
        const activePin = (profile.lastPairingPin || "140610").toString();
        const origin = window.location.origin || "";
        const pathPrefix = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        const freshUrl = `${origin}${pathPrefix}/join.html?sponsor=${encodeURIComponent(sponsorCode)}&devoteeCode=${encodeURIComponent(devoteeCode)}&pin=${encodeURIComponent(activePin)}`;

        // Create pre-provisioned invite in model
        this.model.createPairingInvite({
          seekerName: "Pending Devotee",
          seekerPhone: "",
          deviceModel: "Web / Mobile Applicant",
          candidateCode: devoteeCode,
        });

        // Populate and show popup modal
        const modal = document.getElementById("modal-fresh-devotee-joining");
        if (modal) {
          const spCodeEl = document.getElementById("display-fresh-sponsor-code");
          if (spCodeEl) spCodeEl.textContent = sponsorCode;
          const devCodeEl = document.getElementById("display-fresh-devotee-code");
          if (devCodeEl) devCodeEl.textContent = devoteeCode;
          const pinInput = document.getElementById("input-fresh-pairing-pin");
          if (pinInput) {
            pinInput.value = activePin;
            pinInput.oninput = () => {
              const currentPin = pinInput.value.trim() || activePin;
              const recalculatedUrl = `${origin}${pathPrefix}/join.html?sponsor=${encodeURIComponent(sponsorCode)}&devoteeCode=${encodeURIComponent(devoteeCode)}&pin=${encodeURIComponent(currentPin)}`;
              const uIn = document.getElementById("input-fresh-devotee-url");
              if (uIn) uIn.value = recalculatedUrl;
              const opL = document.getElementById("btn-open-fresh-devotee-link");
              if (opL) opL.href = recalculatedUrl;
            };
          }
          const urlInput = document.getElementById("input-fresh-devotee-url");
          if (urlInput) urlInput.value = freshUrl;
          const openLink = document.getElementById("btn-open-fresh-devotee-link");
          if (openLink) openLink.href = freshUrl;
          modal.style.display = "flex";
        }
        return;
      }

      const regenPinBtn = e.target.closest("#btn-regenerate-pairing-pin");
      if (regenPinBtn) {
        const newPin = Math.floor(100000 + Math.random() * 900000).toString();
        const pinInput = document.getElementById("input-fresh-pairing-pin");
        if (pinInput) pinInput.value = newPin;
        const profile = this.model.getActiveProfile();
        profile.lastPairingPin = newPin;
        this.model.updateActiveProfile(profile);

        const spCode = document.getElementById("display-fresh-sponsor-code")?.textContent || profile.referenceCode;
        const devCode = document.getElementById("display-fresh-devotee-code")?.textContent || "";
        const origin = window.location.origin || "";
        const pathPrefix = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        const freshUrl = `${origin}${pathPrefix}/join.html?sponsor=${encodeURIComponent(spCode)}&devoteeCode=${encodeURIComponent(devCode)}&pin=${encodeURIComponent(newPin)}`;
        const urlInput = document.getElementById("input-fresh-devotee-url");
        if (urlInput) urlInput.value = freshUrl;
        const openLink = document.getElementById("btn-open-fresh-devotee-link");
        if (openLink) openLink.href = freshUrl;
        this.view.showToast(`🎲 Generated new 6-digit PIN: ${newPin}`);
        return;
      }

      const closeFreshModalBtn = e.target.closest("#btn-close-fresh-devotee-modal");
      if (closeFreshModalBtn) {
        const modal = document.getElementById("modal-fresh-devotee-joining");
        if (modal) modal.style.display = "none";
        const profile = this.model.getActiveProfile();
        const invites = this.model.getPairingInvites();
        this.view._renderSharePairingModal(profile, invites);
        return;
      }

      const copyFreshLinkBtn = e.target.closest("#btn-copy-fresh-devotee-link");
      if (copyFreshLinkBtn) {
        const urlInput = document.getElementById("input-fresh-devotee-url");
        if (urlInput && urlInput.value) {
          const sponsorCode = document.getElementById("display-fresh-sponsor-code")?.textContent || "";
          const devoteeCode = document.getElementById("display-fresh-devotee-code")?.textContent || "";
          const shareText = `🕉️ SHREE SPRITUAL KARIM SANSTHAN • DEVOTEE INTAKE INVITE\n\nMentor Sponsor Code: ${sponsorCode}\nAssigned Devotee Code: ${devoteeCode}\n\n👉 Joining Link (Valid 24h):\n${urlInput.value}`;
          navigator.clipboard.writeText(shareText).then(() => {
            this.view.showToast("✓ Devotee Invitation Card copied to clipboard!");
          }).catch(() => {
            navigator.clipboard.writeText(urlInput.value);
            this.view.showToast("✓ Link copied!");
          });
        }
        return;
      }

      const copyFreshUrlOnlyBtn = e.target.closest("#btn-copy-fresh-devotee-url-only");
      if (copyFreshUrlOnlyBtn) {
        const urlInput = document.getElementById("input-fresh-devotee-url");
        if (urlInput && urlInput.value) {
          navigator.clipboard.writeText(urlInput.value).then(() => {
            this.view.showToast("✓ Direct Joining URL copied to clipboard!");
          }).catch(() => {
            urlInput.select();
            document.execCommand("copy");
            this.view.showToast("✓ URL copied!");
          });
        }
        return;
      }

      const rejectBtn = e.target.closest(".btn-reject-pairing");
      if (rejectBtn) {
        const inviteId = rejectBtn.getAttribute("data-invite-id");
        const rejected = this.model.rejectPairingInvite(inviteId);
        if (rejected) {
          const profile = this.model.getActiveProfile();
          const invites = this.model.getPairingInvites();
          this.view._renderSharePairingModal(profile, invites);
          this.view.showToast(
            `Pairing request rejected for "${rejected.seekerName}".`,
          );
        }
        return;
      }

      const resendBtn = e.target.closest(".btn-resend-pairing");
      if (resendBtn) {
        const inviteId = resendBtn.getAttribute("data-invite-id");
        const res = this.model.resendPairingInvite(inviteId);
        if (res && res.error) {
          alert(res.message);
          return;
        }
        if (res) {
          const profile = this.model.getActiveProfile();
          const invites = this.model.getPairingInvites();
          this.view._renderSharePairingModal(profile, invites);
          this.view.showToast(
            `🔄 24-Hour window renewed for "${res.seekerName}"!`,
          );
        }
        return;
      }

      const simBtn = e.target.closest("#btn-simulate-new-seeker");
      if (simBtn) {
        const profile = this.model.getActiveProfile();
        const defaultMentor = (this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : ((typeof appConfig !== "undefined" && appConfig.defaultMentorCode) || "SKHM-ADM1-7788-9900");
        const names = [
          "Ramesh Sharma",
          "Pooja Verma",
          "Amit Trivedi",
          "Sunita Rao",
          "Deepak Joshi",
        ];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const simInvite = {
          id: "inv-" + Date.now().toString().slice(-6),
          seekerName: randomName,
          seekerPhone:
            "+91 " + Math.floor(7000000000 + Math.random() * 2999999999),
          sponsorCode: profile.referenceCode || defaultMentor,
          seekerDeviceModel: "OnePlus / Galaxy Android 14",
          hardwareNonce:
            "HW-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
          status: "PENDING",
          createdAtMs: Date.now(),
          expiresAtMs: Date.now() + 24 * 60 * 60 * 1000,
          formattedCreatedTime: "Just Now",
          resendCount: 0,
        };
        const currentInvites = this.model.getPairingInvites();
        currentInvites.unshift(simInvite);
        this.model.savePairingInvites(currentInvites);
        this.view._renderSharePairingModal(profile, currentInvites);
        this.view.showToast(
          `📲 Simulated incoming 24h pairing request from ${randomName}`,
        );
      }
    });
  }

  // ==============================================================
  // FIREBASE REALTIME DATABASE EVENT LISTENERS
  // ==============================================================

  // Sidebar RTDB Open Button
  const btnSidebarRtdb = document.getElementById("btn-sidebar-open-rtdb");
  if (btnSidebarRtdb) {
    btnSidebarRtdb.addEventListener("click", () => {
      this.switchMainTab("tab-firebase-data");
      this.view.renderFirebaseDataTable(this.model);
    });
  }

  // Sidebar Shortcut Chips
  document.querySelectorAll(".rtdb-shortcut-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const drillKey = btn.getAttribute("data-rtdb-drill");
      this.switchMainTab("tab-firebase-data");
      this.view.rtdbActiveRootFilter = drillKey || "ALL";
      document
        .querySelectorAll("#rtdb-filter-chips .rtdb-chip-btn")
        .forEach((cb) => {
          cb.classList.toggle(
            "active",
            cb.getAttribute("data-rtdb-root") ===
              this.view.rtdbActiveRootFilter,
          );
        });
      this.view.renderFirebaseDataTable(this.model);
    });
  });

  // Copy RTDB URL
  const btnCopyRtdbUrl = document.getElementById("btn-copy-rtdb-url");
  if (btnCopyRtdbUrl) {
    btnCopyRtdbUrl.addEventListener("click", () => {
      const urlEl = document.getElementById("rtdb-url-display");
      if (urlEl) {
        navigator.clipboard.writeText(urlEl.textContent.trim());
        this.view.showToast("📋 Firebase RTDB URL copied!", "success");
      }
    });
  }

  // RTDB Search Input
  const inputRtdbSearch = document.getElementById("input-rtdb-search");
  if (inputRtdbSearch) {
    inputRtdbSearch.addEventListener("input", (e) => {
      this.view.rtdbSearchQuery = e.target.value;
      this.view.renderFirebaseDataTable(this.model);
    });
  }

  // RTDB Root Filter Chips
  const rtdbFilterChips = document.getElementById("rtdb-filter-chips");
  if (rtdbFilterChips) {
    rtdbFilterChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".rtdb-chip-btn");
      if (!chip) return;
      const root = chip.getAttribute("data-rtdb-root");
      this.view.rtdbActiveRootFilter = root;
      this.view.rtdbActiveBreadcrumbPath = root === "ALL" ? "/" : `/${root}`;
      document
        .querySelectorAll("#rtdb-filter-chips .rtdb-chip-btn")
        .forEach((cb) => {
          cb.classList.toggle("active", cb === chip);
        });
      this.view.renderFirebaseDataTable(this.model);
    });
  }

  // RTDB Breadcrumbs Clicks
  const rtdbBreadcrumbs = document.getElementById("rtdb-breadcrumbs");
  if (rtdbBreadcrumbs) {
    rtdbBreadcrumbs.addEventListener("click", (e) => {
      const bc = e.target.closest(".rtdb-bc-item");
      if (!bc) return;
      const pathVal = bc.getAttribute("data-rtdb-bc");
      if (pathVal === "/") {
        this.view.rtdbActiveRootFilter = "ALL";
      } else {
        this.view.rtdbActiveRootFilter = pathVal
          .replace(/^\/+/, "")
          .split("/")[0];
      }
      this.view.rtdbActiveBreadcrumbPath = pathVal;
      document
        .querySelectorAll("#rtdb-filter-chips .rtdb-chip-btn")
        .forEach((cb) => {
          cb.classList.toggle(
            "active",
            cb.getAttribute("data-rtdb-root") ===
              this.view.rtdbActiveRootFilter,
          );
        });
      this.view.renderFirebaseDataTable(this.model);
    });
  }

  // RTDB Refresh
  const btnRtdbRefresh = document.getElementById("btn-rtdb-refresh");
  if (btnRtdbRefresh) {
    btnRtdbRefresh.addEventListener("click", () => {
      this.view.renderFirebaseDataTable(this.model);
      this.view.showToast("🔄 Database reloaded!", "success");
    });
  }

  // RTDB Expand All
  const btnRtdbExpandAll = document.getElementById("btn-rtdb-expand-all");
  if (btnRtdbExpandAll) {
    btnRtdbExpandAll.addEventListener("click", () => {
      const tree = this.model.getFirebaseRealtimeTree();
      const allPaths = new Set();
      const collectPaths = (obj, p) => {
        if (obj && typeof obj === "object") {
          allPaths.add(p);
          if (Array.isArray(obj))
            obj.forEach((item, idx) => collectPaths(item, p + "/" + idx));
          else
            Object.keys(obj).forEach((k) => collectPaths(obj[k], p + "/" + k));
        }
      };
      Object.keys(tree).forEach((k) => collectPaths(tree[k], k));
      this.view.rtdbExpandedPaths = allPaths;
      this.view.renderFirebaseDataTable(this.model);
      this.view.showToast("🔽 All nodes expanded.", "info");
    });
  }

  // RTDB Collapse All
  const btnRtdbCollapseAll = document.getElementById("btn-rtdb-collapse-all");
  if (btnRtdbCollapseAll) {
    btnRtdbCollapseAll.addEventListener("click", () => {
      this.view.rtdbExpandedPaths.clear();
      this.view.renderFirebaseDataTable(this.model);
      this.view.showToast("🔼 All nodes collapsed.", "info");
    });
  }

  // RTDB Export JSON
  const btnRtdbExport = document.getElementById("btn-rtdb-export-json");
  if (btnRtdbExport) {
    btnRtdbExport.addEventListener("click", () => {
      const fullTree = this.model.getFirebaseRealtimeTree();
      const jsonStr = JSON.stringify(fullTree, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "spiritual_karim_firebase_rtdb_" + Date.now() + ".json";
      a.click();
      URL.revokeObjectURL(url);
      this.view.showToast("📥 Exported Firebase RTDB JSON!", "success");
    });
  }

  // RTDB Add Node Open
  const btnRtdbAdd = document.getElementById("btn-rtdb-add-node");
  if (btnRtdbAdd) {
    btnRtdbAdd.addEventListener("click", () => {
      this.view.openRtdbAddModal("");
    });
  }

  // RTDB Table Delegated Events
  const rtdbTbody = document.getElementById("rtdb-table-tbody");
  if (rtdbTbody) {
    rtdbTbody.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest("[data-rtdb-toggle]");
      if (toggleBtn) {
        const p = toggleBtn.getAttribute("data-rtdb-toggle");
        if (this.view.rtdbExpandedPaths.has(p))
          this.view.rtdbExpandedPaths.delete(p);
        else this.view.rtdbExpandedPaths.add(p);
        this.view.renderFirebaseDataTable(this.model);
        return;
      }
      const inspectBtn = e.target.closest("[data-rtdb-inspect]");
      if (inspectBtn) {
        const p = inspectBtn.getAttribute("data-rtdb-inspect");
        this.view.openRtdbInspector(p, this.model.getRealtimeNodeByPath(p));
        return;
      }
      const copyBtn = e.target.closest("[data-rtdb-copy]");
      if (copyBtn) {
        const p = copyBtn.getAttribute("data-rtdb-copy");
        const nd = this.model.getRealtimeNodeByPath(p);
        navigator.clipboard.writeText(
          typeof nd === "object" ? JSON.stringify(nd, null, 2) : String(nd),
        );
        this.view.showToast("📋 Copied to clipboard!", "success");
        return;
      }
      const addChildBtn = e.target.closest("[data-rtdb-add-child]");
      if (addChildBtn) {
        this.view.openRtdbAddModal(
          addChildBtn.getAttribute("data-rtdb-add-child"),
        );
        return;
      }
      const deleteBtn = e.target.closest("[data-rtdb-delete]");
      if (deleteBtn) {
        const p = deleteBtn.getAttribute("data-rtdb-delete");
        if (confirm("Delete node /" + p + "?")) {
          this.model.deleteRealtimeNodeByPath(p);
          this.view.renderFirebaseDataTable(this.model);
          this.view.showToast("🗑️ Deleted /" + p, "info");
        }
        return;
      }
    });
  }

  // Inspector Modal Close & Save
  const modalInspector = document.getElementById("rtdb-inspector-modal");
  ["btn-close-rtdb-inspector", "btn-close-rtdb-inspector-footer"].forEach(
    (id) => {
      const btn = document.getElementById(id);
      if (btn && modalInspector)
        btn.addEventListener("click", () => {
          modalInspector.classList.remove("active");
          modalInspector.setAttribute("aria-hidden", "true");
        });
    },
  );
  const btnCopyInspectJson = document.getElementById(
    "btn-rtdb-copy-inspect-json",
  );
  if (btnCopyInspectJson)
    btnCopyInspectJson.addEventListener("click", () => {
      const ed = document.getElementById("rtdb-inspector-json-editor");
      if (ed) {
        navigator.clipboard.writeText(ed.value);
        this.view.showToast("📋 JSON copied!", "success");
      }
    });
  const btnSaveNodeJson = document.getElementById("btn-rtdb-save-node-json");
  if (btnSaveNodeJson)
    btnSaveNodeJson.addEventListener("click", () => {
      const ed = document.getElementById("rtdb-inspector-json-editor");
      const st = document.getElementById("rtdb-inspector-status");
      if (!ed) return;
      const tp = ed.getAttribute("data-target-path");
      try {
        let pv;
        try {
          pv = JSON.parse(ed.value);
        } catch {
          pv = ed.value;
        }
        this.model.setRealtimeNodeByPath(tp, pv);
        if (st) st.textContent = "✅ Saved!";
        this.view.renderFirebaseDataTable(this.model);
        this.view.showToast("💾 Saved /" + tp, "success");
        setTimeout(() => {
          if (modalInspector) {
            modalInspector.classList.remove("active");
            modalInspector.setAttribute("aria-hidden", "true");
          }
        }, 600);
      } catch (err) {
        if (st) st.textContent = "❌ Error!";
        this.view.showToast("Error: " + err.message, "danger");
      }
    });

  // Add Node Modal Close & Submit
  const modalAdd = document.getElementById("rtdb-add-node-modal");
  ["btn-close-rtdb-add", "btn-close-rtdb-add-footer"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn && modalAdd)
      btn.addEventListener("click", () => {
        modalAdd.classList.remove("active");
        modalAdd.setAttribute("aria-hidden", "true");
      });
  });
  const btnSubmitAddNode = document.getElementById("btn-rtdb-submit-add-node");
  if (btnSubmitAddNode)
    btnSubmitAddNode.addEventListener("click", () => {
      const pi = document.getElementById("rtdb-add-target-path");
      const ki = document.getElementById("rtdb-add-key-name");
      const ti = document.getElementById("rtdb-add-key-type");
      const vi = document.getElementById("rtdb-add-value");
      const pp = (pi.value || "").replace(/^\/+/, "");
      const kn = (ki.value || "").trim();
      const kt = ti.value;
      const rv = (vi.value || "").trim();
      if (!kn) {
        alert("Key Name required.");
        return;
      }
      let pv = rv;
      if (kt === "number") pv = Number(rv) || 0;
      else if (kt === "boolean") pv = rv.toLowerCase() === "true";
      else if (kt === "object") {
        try {
          pv = JSON.parse(rv || "{}");
        } catch {
          pv = {};
        }
      } else if (kt === "array") {
        try {
          pv = JSON.parse(rv || "[]");
        } catch {
          pv = [];
        }
      }
      const fp = pp ? pp + "/" + kn : kn;
      this.model.setRealtimeNodeByPath(fp, pv);
      this.view.rtdbExpandedPaths.add(pp || kn);
      this.view.renderFirebaseDataTable(this.model);
      this.view.showToast("➕ Created /" + fp, "success");
      if (modalAdd) {
        modalAdd.classList.remove("active");
        modalAdd.setAttribute("aria-hidden", "true");
      }
    });
};

ProfileController.prototype._getBranchObject = function (profile, branch) {
  if (!profile.lineage) profile.lineage = {};
  if (branch === "current") {
    if (!profile.lineage.currentFamily) profile.lineage.currentFamily = {};
    return profile.lineage.currentFamily;
  }
  if (branch === "husband") {
    if (!profile.lineage.husbandAncestral)
      profile.lineage.husbandAncestral = {};
    return profile.lineage.husbandAncestral;
  }
  if (branch === "wife") {
    if (!profile.lineage.wifeAncestral) profile.lineage.wifeAncestral = {};
    return profile.lineage.wifeAncestral;
  }
  return {};
};

ProfileController.prototype._saveFormChanges = function () {
  const active = this.model.getActiveProfile();

  const selectedRemedies = [];
  document
    .querySelectorAll('input[name="remedy-checkbox"]:checked')
    .forEach((cb) => {
      selectedRemedies.push(cb.value);
    });

  const children = [];
  if (this.view.childrenContainer) {
    this.view.childrenContainer
      .querySelectorAll(".dynamic-row-item")
      .forEach((row) => {
        const name = row.querySelector(".child-name-input").value.trim();
        const gender = row.querySelector(".child-gender-select").value;
        const ageOrNote = row.querySelector(".child-notes-input").value.trim();
        if (name)
          children.push({
            id: "c" + Math.random().toString(36).substr(2, 5),
            name,
            gender,
            ageOrNote,
          });
      });
  }

  const readSiblings = (container) => {
    if (!container) return [];
    const siblings = [];
    container.querySelectorAll(".dynamic-row-item").forEach((row) => {
      const name = row.querySelector(".sibling-name-input").value.trim();
      const relation = row.querySelector(".sibling-relation-select").value;
      const spouseName = row
        .querySelector(".sibling-spouse-input")
        .value.trim();
      const childrenSummary = row
        .querySelector(".sibling-children-input")
        .value.trim();
      if (name) {
        siblings.push({
          id: "s" + Math.random().toString(36).substr(2, 5),
          name,
          relation,
          spouseName,
          childrenSummary,
          isMarried: spouseName.length > 0,
          notes: "",
        });
      }
    });
    return siblings;
  };

  const houseCleanLevels = [];
  if (this.view.devoteeHouseCleanContainer) {
    this.view.devoteeHouseCleanContainer
      .querySelectorAll(".houseclean-card")
      .forEach((card, idx) => {
        const levelTitle = card
          .querySelector(".houseclean-level-title")
          .textContent.replace("🧹", "")
          .trim();
        const status = card.querySelector(".hc-status-select").value;
        const cleanPercentage =
          parseInt(card.querySelector(".hc-percentage-input").value, 10) || 0;
        const approvalDate = card.querySelector(".hc-date-input").value.trim();
        const cleanedDetails = card
          .querySelector(".hc-details-textarea")
          .value.trim();
        const mentorRaw = card.querySelector(".hc-mentor-input").value.trim();
        const mentorRemarks = card
          .querySelector(".hc-remarks-input")
          .value.trim();

        houseCleanLevels.push({
          id: active.houseCleanLevels?.[idx]?.id || "hc-" + (idx + 1),
          levelNumber: idx + 1,
          levelTitle,
          status,
          cleanPercentage,
          cleanedDetails,
          mentorCode:
            active.houseCleanLevels?.[idx]?.mentorCode ||
            active.referredByCode ||
            (typeof appConfig !== "undefined" && appConfig.defaultMentorCode) ||
            this.model.settings.defaultMentorCode ||
            "SKHM-ADM1-7788-9900",
          mentorName: mentorRaw || "Spiritual Mentor",
          mentorRemarks,
          approvalDate,
        });
      });
  }

  const interestedSadhanas = [];
  if (this.view.interestedSadhanasContainer) {
    this.view.interestedSadhanasContainer
      .querySelectorAll(".dynamic-row-item")
      .forEach((row) => {
        const key = row.getAttribute("data-sadhana-key") || "";
        const name = row.querySelector(".is-name-input").value.trim();
        const category = row.querySelector(".is-category-input").value.trim();
        const priority = row.querySelector(".is-priority-select").value;
        const status = row.querySelector(".is-status-select").value;
        if (name)
          interestedSadhanas.push({
            id: key || "is-" + Math.random().toString(36).substr(2, 5),
            name,
            category,
            priority,
            status,
          });
      });
  }

  const readTraineeCards = (container, domain) => {
    if (!container) return [];
    const items = [];
    container.querySelectorAll(".sadhana-progress-card").forEach((card) => {
      const itemId = card.getAttribute("data-item-id") || "";
      const sadhanaKey = card.getAttribute("data-sadhana-key") || "";
      const title = card.querySelector(".ts-title-input").value.trim();
      const isPaidVal =
        card.querySelector(".ts-paid-select")?.value ||
        (card.querySelector(".stamp-paid") ? "PAID" : "FREE");
      const isPaid = isPaidVal === "PAID";
      const level = card.querySelector(".ts-level-select").value;
      const progressPercent =
        parseInt(card.querySelector(".ts-progress-input").value, 10) || 0;
      const dailyTarget = card.querySelector(".ts-target-input").value.trim();
      const currentStreak = card.querySelector(".ts-streak-input").value.trim();
      const diaryNotes = card.querySelector(".ts-notes-textarea").value.trim();
      if (title) {
        items.push({
          id: itemId || "ts-" + Math.random().toString(36).substr(2, 5),
          sadhanaKey,
          title,
          categoryDomain: domain,
          isPaid,
          paymentStatus: isPaid ? "PAID" : "FREE",
          level,
          progressPercent,
          dailyTarget,
          currentStreak,
          diaryNotes,
          mentorCode: active.referredByCode || ((this.model && typeof this.model.getDefaultMentorCode === "function") ? this.model.getDefaultMentorCode() : "SKHM-ADM1-7788-9900"),
        });
      }
    });
    return items;
  };

  const traineeSadhanas = [
    ...readTraineeCards(this.view.traineeGroupSadhanas, "sadhanas"),
    ...readTraineeCards(this.view.traineeGroupRemedies, "remedies"),
    ...readTraineeCards(this.view.traineeGroupCleansing, "cleansing"),
  ];

  const healerCompletedSadhanas = [];
  if (this.view.healerCompletedSadhanasContainer) {
    this.view.healerCompletedSadhanasContainer
      .querySelectorAll(".sadhana-progress-card")
      .forEach((card) => {
        const title = card.querySelector(".hc-comp-title-input").value.trim();
        const status = card.querySelector(".hc-comp-status-input").value.trim();
        const completionDate = card
          .querySelector(".hc-comp-date-input")
          .value.trim();
        const seekersGuidedCount =
          parseInt(card.querySelector(".hc-comp-count-input").value, 10) || 0;
        const sealCode = card.querySelector(".hc-comp-seal-input").value.trim();
        if (title) {
          healerCompletedSadhanas.push({
            id: "hcs-" + Math.random().toString(36).substr(2, 5),
            title,
            levelCompleted: "Level 4 — Master Guru",
            status,
            completionDate,
            seekersGuidedCount,
            sealCode,
            authorizedToGuide: true,
          });
        }
      });
  }

  const healerNetwork = [];
  if (this.view.healerNetworkContainer) {
    this.view.healerNetworkContainer
      .querySelectorAll(".dynamic-row-item")
      .forEach((row) => {
        const name = row.querySelector(".net-name-input").value.trim();
        const refCode = row.querySelector(".net-code-input").value.trim();
        const role = row.querySelector(".net-role-input").value.trim();
        if (name)
          healerNetwork.push({
            id: "net-" + Math.random().toString(36).substr(2, 5),
            name,
            refCode,
            role,
            activeCases: 1,
          });
      });
  }

  const paymentStatusVal = this.view.inputPaymentStatus
    ? this.view.inputPaymentStatus.value
    : active.isPaid !== false
      ? "PAID"
      : "FREE";

  const updatedProfile = {
    profileType: this.view.inputProfileType
      ? this.view.inputProfileType.value
      : active.profileType,
    level: this.view.inputLevel
      ? parseInt(this.view.inputLevel.value, 10) || 1
      : active.level,
    categoryTag: this.view.inputCategoryTag
      ? this.view.inputCategoryTag.value.trim()
      : active.categoryTag,
    referenceCode: this.view.inputRefCode
      ? this.view.inputRefCode.value.trim()
      : active.referenceCode,
    referredByCode: this.view.inputSponsorCode
      ? this.view.inputSponsorCode.value.trim()
      : active.referredByCode,
    transferredCode: this.view.inputTransferCode
      ? this.view.inputTransferCode.value.trim() || null
      : active.transferredCode,
    mentorName: this.view.inputMentorName ? this.view.inputMentorName.value.trim() : (active.mentorName || ""),
    activationPin: this.view.inputPairingPin ? this.view.inputPairingPin.value.trim() : (active.activationPin || ""),
    seekerDeviceModel: this.view.inputDeviceModel ? this.view.inputDeviceModel.value.trim() : (active.seekerDeviceModel || ""),
    isActive: this.view.inputIsActive
      ? this.view.inputIsActive.checked
      : active.isActive,
    isPaid: paymentStatusVal === "PAID",
    paymentStatus: paymentStatusVal,
    joinDate: this.view.inputJoinDate
      ? this.view.inputJoinDate.value
      : active.joinDate,

    name: this.view.inputName ? this.view.inputName.value.trim() : active.name,
    phone: this.view.inputPhone
      ? this.view.inputPhone.value.trim()
      : active.phone,
    email: this.view.inputEmail
      ? this.view.inputEmail.value.trim()
      : active.email,
    city: this.view.inputCity ? this.view.inputCity.value.trim() : active.city,
    address: this.view.inputAddress
      ? this.view.inputAddress.value.trim()
      : active.address,
    objective: this.view.inputObjective
      ? this.view.inputObjective.value.trim()
      : active.objective,
    notes: this.view.inputNotes
      ? this.view.inputNotes.value.trim()
      : active.notes,
    selectedRemedies: selectedRemedies,

    seekerDiagnostics: {
      afflictionDuration: this.view.seekerAfflictionDuration
        ? this.view.seekerAfflictionDuration.value.trim()
        : active.seekerDiagnostics?.afflictionDuration || "",
      kuldeviIssues: this.view.seekerKuldeviIssues
        ? this.view.seekerKuldeviIssues.value.trim()
        : active.seekerDiagnostics?.kuldeviIssues || "",
      targetOutcome: this.view.seekerTargetOutcome
        ? this.view.seekerTargetOutcome.value.trim()
        : active.seekerDiagnostics?.targetOutcome || "",
    },

    houseCleanLevels:
      houseCleanLevels.length > 0
        ? houseCleanLevels
        : active.houseCleanLevels || [],
    interestedSadhanas:
      interestedSadhanas.length > 0
        ? interestedSadhanas
        : active.interestedSadhanas || [],
    traineeSadhanas:
      traineeSadhanas.length > 0
        ? traineeSadhanas
        : active.traineeSadhanas || [],
    healerCompletedSadhanas:
      healerCompletedSadhanas.length > 0
        ? healerCompletedSadhanas
        : active.healerCompletedSadhanas || [],
    healerNetwork:
      healerNetwork.length > 0 ? healerNetwork : active.healerNetwork || [],

    lineage: {
      currentFamily: {
        selfName: this.view.lineageSelfName
          ? this.view.lineageSelfName.value.trim() ||
            this.view.inputName?.value.trim() ||
            active.name
          : active.lineage?.currentFamily?.selfName,
        selfTitle: this.view.inputSelfTitle
          ? this.view.inputSelfTitle.value.trim()
          : active.lineage?.currentFamily?.selfTitle || "",
        spouseName: this.view.lineageSpouseName
          ? this.view.lineageSpouseName.value.trim()
          : active.lineage?.currentFamily?.spouseName || "",
        children:
          children.length > 0
            ? children
            : active.lineage?.currentFamily?.children || [],
        siblings: readSiblings(this.view.siblingsCurrentContainer),
      },
      husbandAncestral: {
        fatherName: this.view.hFatherName
          ? this.view.hFatherName.value.trim()
          : active.lineage?.husbandAncestral?.fatherName || "",
        motherName: this.view.hMotherName
          ? this.view.hMotherName.value.trim()
          : active.lineage?.husbandAncestral?.motherName || "",
        paternalGrandfather: this.view.hPaternalGf
          ? this.view.hPaternalGf.value.trim()
          : active.lineage?.husbandAncestral?.paternalGrandfather || "",
        paternalGrandmother: this.view.hPaternalGm
          ? this.view.hPaternalGm.value.trim()
          : active.lineage?.husbandAncestral?.paternalGrandmother || "",
        maternalGrandfather: this.view.hMaternalGf
          ? this.view.hMaternalGf.value.trim()
          : active.lineage?.husbandAncestral?.maternalGrandfather || "",
        maternalGrandmother: this.view.hMaternalGm
          ? this.view.hMaternalGm.value.trim()
          : active.lineage?.husbandAncestral?.maternalGrandmother || "",
        siblings: readSiblings(this.view.siblingsHusbandContainer),
        address: this.view.hAddress
          ? this.view.hAddress.value.trim()
          : active.lineage?.husbandAncestral?.address || "",
      },
      wifeAncestral: {
        fatherName: this.view.wFatherName
          ? this.view.wFatherName.value.trim()
          : active.lineage?.wifeAncestral?.fatherName || "",
        motherName: this.view.wMotherName
          ? this.view.wMotherName.value.trim()
          : active.lineage?.wifeAncestral?.motherName || "",
        paternalGrandfather: this.view.wPaternalGf
          ? this.view.wPaternalGf.value.trim()
          : active.lineage?.wifeAncestral?.paternalGrandfather || "",
        paternalGrandmother: this.view.wPaternalGm
          ? this.view.wPaternalGm.value.trim()
          : active.lineage?.wifeAncestral?.paternalGrandmother || "",
        maternalGrandfather: this.view.wMaternalGf
          ? this.view.wMaternalGf.value.trim()
          : active.lineage?.wifeAncestral?.maternalGrandfather || "",
        maternalGrandmother: this.view.wMaternalGm
          ? this.view.wMaternalGm.value.trim()
          : active.lineage?.wifeAncestral?.maternalGrandmother || "",
        siblings: readSiblings(this.view.siblingsWifeContainer),
        address: this.view.wAddress
          ? this.view.wAddress.value.trim()
          : active.lineage?.wifeAncestral?.address || "",
      },
    },
  };

  this.model.updateActiveProfile(updatedProfile);
  this._renderCurrentState();
  this.view.showToast(
    "✓ Profile successfully saved & synchronized across all tabs!",
  );

  // Dispatch minimal data-minimized node status to Firebase Realtime Database
  if (window.FirebaseSyncEngine) {
    window.FirebaseSyncEngine.publishMinimalNodeStatus(updatedProfile);
  }
};

// ==============================================================
// 12. FIREBASE REALTIME DATABASE SYNC ENGINE (DATA MINIMIZATION)
// ==============================================================


// ==============================================================
// 13. OOPS MVC CONTROLLER CONTRACT IMPLEMENTATIONS (DOCS COMPLIANCE)
// ==============================================================

/**
 * POST /houseclean/signoff
 * Contract: ProfileController.signoffHouseCleanLevel(auditId, score, signature)
 * Enforces Score >= 75% invariant and records mentor e-signature.
 */
ProfileController.prototype.signoffHouseCleanLevel = function (auditId, score, signature = 'Acharya Devendra') {
  try {
    const active = this.model.getActiveProfile();
    if (!active) throw new Error("No active profile selected for house clean audit.");
    
    const minPassingScore = 75;
    const isPassing = Number(score) >= minPassingScore;
    const status = isPassing ? "APPROVED" : "REMEDIATION_REQUIRED";

    if (!active.houseCleanLevels) active.houseCleanLevels = [];
    let levelObj = active.houseCleanLevels.find(l => l.auditId === auditId || l.levelNumber === auditId);
    if (!levelObj) {
      levelObj = {
        levelNumber: active.houseCleanLevels.length + 1,
        auditId: auditId || "audit-" + Date.now(),
        date: new Date().toISOString().split("T")[0]
      };
      active.houseCleanLevels.push(levelObj);
    }

    levelObj.score = Number(score);
    levelObj.status = status;
    levelObj.mentorSignature = signature;
    levelObj.verifiedAt = new Date().toISOString();

    // Persist to central HouseCleanLogs repository
    const centralLogs = JSON.parse(localStorage.getItem("sk_house_clean_logs") || "[]");
    centralLogs.push({
      auditId: levelObj.auditId,
      devoteeId: active.id,
      devoteeName: active.name,
      level: levelObj.levelNumber,
      score: levelObj.score,
      status: levelObj.status,
      mentorSignature: signature,
      timestamp: Date.now()
    });
    localStorage.setItem("sk_house_clean_logs", JSON.stringify(centralLogs));

    this.model.updateActiveProfile(active);
    this._renderCurrentState();

    if (isPassing) {
      this.view.showToast(`✓ Level ${levelObj.levelNumber} House Clean signed off at ${score}% (Mentor: ${signature})`);
    } else {
      this.view.showToast(`⚠️ House Clean score ${score}% is below 75% threshold. Status set to REMEDIATION_REQUIRED.`);
    }
    return { success: true, status, score: levelObj.score };
  } catch (e) {
    console.error("signoffHouseCleanLevel error:", e);
    this.view.showToast("❌ House Clean signoff failed: " + e.message);
    return { success: false, error: e.message };
  }
};

/**
 * POST /sadhana/checkin
 * Contract: ProfileController.logDailyDiyaCheckin(devoteeId, oilTypes)
 * Records daily Diya check-in and maintains streak counters.
 */
ProfileController.prototype.logDailyDiyaCheckin = function (devoteeId, oilTypes = ["Mustard Oil", "Cow Ghee"]) {
  try {
    const profile = devoteeId ? this.model.getProfileById(devoteeId) : this.model.getActiveProfile();
    if (!profile) throw new Error("Devotee not found for Diya check-in.");

    const todayStr = new Date().toISOString().split("T")[0];
    const diyaLogs = JSON.parse(localStorage.getItem("sk_daily_diya_logs") || "[]");
    
    // Check if already checked in today
    const existingToday = diyaLogs.find(l => l.devoteeId === profile.id && l.checkinDate === todayStr);
    if (existingToday) {
      this.view.showToast(`🕉️ Diya check-in already recorded for today (${todayStr}).`);
      return { success: true, duplicate: true, streak: profile.diyaStreakCount || 1 };
    }

    // Calculate streak
    const lastCheckin = profile.lastDiyaCheckinDate;
    let newStreak = (profile.diyaStreakCount || 0) + 1;
    if (lastCheckin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      if (lastCheckin !== yesterdayStr && lastCheckin !== todayStr) {
        newStreak = 1; // Reset streak if missed a day
      }
    }

    const logEntry = {
      logId: "diya-" + Date.now(),
      devoteeId: profile.id,
      checkinDate: todayStr,
      oilTypes: Array.isArray(oilTypes) ? oilTypes : [oilTypes],
      streak: newStreak,
      timestamp: Date.now()
    };
    diyaLogs.push(logEntry);
    localStorage.setItem("sk_daily_diya_logs", JSON.stringify(diyaLogs));

    profile.diyaStreakCount = newStreak;
    profile.lastDiyaCheckinDate = todayStr;
    this.model.updateActiveProfile(profile);
    this._renderCurrentState();

    this.view.showToast(`🔥 Diya check-in recorded! Current Consecutive Streak: ${newStreak} days.`);
    return { success: true, streak: newStreak, log: logEntry };
  } catch (e) {
    console.error("logDailyDiyaCheckin error:", e);
    this.view.showToast("❌ Diya checkin failed: " + e.message);
    return { success: false, error: e.message };
  }
};

/**
 * POST /admin/override
 * Contract: ProfileController.executeFounderOverride(targetId, newRole)
 * Founder Master admin action to elevate or override node roles.
 */
ProfileController.prototype.executeFounderOverride = function (targetId, newRole) {
  try {
    const validRoles = ["ADMIN", "HEALER", "TRAINEE", "DEVOTEE"];
    const upperRole = (newRole || "").toUpperCase();
    if (!validRoles.includes(upperRole)) {
      throw new Error(`Invalid role '${newRole}'. Allowed: ${validRoles.join(", ")}`);
    }

    const profile = this.model.getProfileById(targetId);
    if (!profile) throw new Error("Target profile not found.");

    const oldRole = profile.profileType;
    profile.profileType = upperRole;
    if (upperRole === "ADMIN") profile.level = 0;
    else if (upperRole === "HEALER") profile.level = 2;
    else if (upperRole === "TRAINEE") profile.level = 3;
    else if (upperRole === "DEVOTEE") profile.level = 4;

    this.model.updateActiveProfile(profile);
    this._renderCurrentState();

    // Log admin audit event
    const audits = JSON.parse(localStorage.getItem("sk_admin_audit_logs") || "[]");
    audits.push({
      action: "FOUNDER_ROLE_OVERRIDE",
      targetId: profile.id,
      targetName: profile.name,
      oldRole,
      newRole: upperRole,
      timestamp: Date.now(),
      isoTime: new Date().toISOString()
    });
    localStorage.setItem("sk_admin_audit_logs", JSON.stringify(audits));

    this.view.showToast(`👑 Founder Override Applied: ${profile.name} updated from ${oldRole} to ${upperRole}`);
    return { success: true, targetId, oldRole, newRole: upperRole };
  } catch (e) {
    console.error("executeFounderOverride error:", e);
    this.view.showToast("❌ Founder override failed: " + e.message);
    return { success: false, error: e.message };
  }
};


ProfileController.prototype.initInteractiveComponentShowcase = function() {
  const showcaseEl = document.getElementById("interactive-component-showcase");
  if (!showcaseEl) return;

  const states = (this.model && typeof this.model.getComponentStates === "function")
    ? this.model.getComponentStates()
    : {};

  // 1. Switch (On/Off)
  const switchContainer = document.getElementById("demo-switch-container");
  if (switchContainer && this.view && typeof this.view.renderSwitch === "function") {
    this.view.renderSwitch(switchContainer, {
      id: "sw-interactive-telemetry",
      label: "Real-time Node Telemetry",
      description: "Push IoT status updates to cloud database",
      icon: "📡",
      checked: states.telemetrySync !== false,
      onChange: (isChecked) => {
        if (this.model && typeof this.model.saveComponentState === "function") {
          this.model.saveComponentState("telemetrySync", isChecked);
        }
        if (this.view && typeof this.view.showSlideToast === "function") {
          this.view.showSlideToast(
            "Telemetry State Updated",
            `📡 Real-time telemetry sync is now ${isChecked ? "ENABLED" : "DISABLED"} in database.`,
            isChecked ? "success" : "warning",
            3500
          );
        }
      }
    });
  }

  // 2. Segmented Toggle (Left / Right)
  const toggleContainer = document.getElementById("demo-segmented-toggle-container");
  if (toggleContainer && this.view && typeof this.view.renderSegmentedToggle === "function") {
    this.view.renderSegmentedToggle(
      toggleContainer,
      [
        { value: "cards", label: "Card View", icon: "🎴" },
        { value: "list", label: "List View", icon: "📋" }
      ],
      states.directoryViewMode || "cards",
      (val) => {
        if (this.model && typeof this.model.saveComponentState === "function") {
          this.model.saveComponentState("directoryViewMode", val);
        }
        if (this.view && typeof this.view.showSlideToast === "function") {
          this.view.showSlideToast(
            "View Preference Saved",
            `🎛️ Switched active directory view to: ${val.toUpperCase()}`,
            "info",
            3000
          );
        }
      }
    );
  }

  // 3. Rich List Box with Dropdown Details
  const listboxContainer = document.getElementById("demo-rich-listbox-container");
  if (listboxContainer && this.view && typeof this.view.renderRichListBox === "function") {
    const rawProfiles = (this.model && typeof this.model.getProfiles === "function")
      ? this.model.getProfiles()
      : [];
    const sampleProfiles = rawProfiles.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      role: p.profileType || p.role || "DEVOTEE",
      status: p.status || (p.isActive !== false ? "ACTIVE" : "PENDING"),
      referenceCode: p.referenceCode,
      referredByCode: p.referredByCode || p.sponsorCode,
      phone: p.phone,
      level: p.level,
      joinDate: p.joinDate || p.joiningDate,
      details: p.notes || p.objective || "Sacred devotee in verified lineage standing."
    }));

    this.view.renderRichListBox(listboxContainer, {
      title: "Lineage Member Roster",
      items: sampleProfiles,
      placeholder: "Filter by devotee name, code, or role...",
      onSelect: (id, item) => {
        if (item && this.view && typeof this.view.showSlideToast === "function") {
          this.view.showSlideToast(
            "Member Selected",
            `👤 Selected: ${item.name} (${item.referenceCode || id})`,
            "info",
            2500
          );
        }
      }
    });
  }

  // 4. Buttons & Dialog bindings
  const btnSuccess = document.getElementById("btn-demo-toast-success");
  if (btnSuccess && this.view && typeof this.view.showSlideToast === "function") {
    btnSuccess.onclick = () => {
      this.view.showSlideToast(
        "Sansthan Notification",
        "✨ Sacred evening Diya offering completed with 108 Gayatri Japa malas.",
        "success",
        4500
      );
    };
  }

  const btnWarn = document.getElementById("btn-demo-toast-warning");
  if (btnWarn && this.view && typeof this.view.showSlideToast === "function") {
    btnWarn.onclick = () => {
      this.view.showSlideToast(
        "Sadhana Milestone Alert",
        "⚠️ Evening Sandhya Aarti starts in 15 minutes. Prepare ghee lamp.",
        "warning",
        4500
      );
    };
  }

  const btnError = document.getElementById("btn-demo-toast-error");
  if (btnError && this.view && typeof this.view.showSlideToast === "function") {
    btnError.onclick = () => {
      this.view.showSlideToast(
        "Lineage Synchronization Error",
        "❌ Offline timeout: Retrying connection to sacred telemetry node.",
        "error",
        5000
      );
    };
  }

  const btnStateful = document.getElementById("btn-demo-stateful-action");
  if (btnStateful) {
    btnStateful.onclick = () => {
      const origText = btnStateful.innerHTML;
      btnStateful.disabled = true;
      btnStateful.innerHTML = `<span>⏳</span> <span>Synchronizing Node...</span>`;
      setTimeout(() => {
        btnStateful.innerHTML = `<span>✓</span> <span>Synchronized!</span>`;
        if (this.view && typeof this.view.showSlideToast === "function") {
          this.view.showSlideToast("Stateful Action", "Node telemetry handshake acknowledged by Sansthan cloud.", "success", 3000);
        }
        setTimeout(() => {
          btnStateful.innerHTML = origText;
          btnStateful.disabled = false;
        }, 2000);
      }, 1200);
    };
  }

  const btnMultiDialog = document.getElementById("btn-demo-dialog-multi");
  if (btnMultiDialog && this.view && typeof this.view.openCustomDialog === "function") {
    btnMultiDialog.onclick = () => {
      this.view.openCustomDialog({
        title: "Administrative Action Verification",
        message: "Choose an action to apply to the lineage database synchronization queue:",
        icon: "⚖️",
        options: [
          {
            text: "✓ Immediate Cloud Sync",
            type: "btn-gold",
            value: "sync",
            action: () => {
              this.view.showSlideToast("Sync Triggered", "Cloud synchronization queue pushed to Firebase.", "success");
            }
          },
          {
            text: "📋 Run Audit Log",
            type: "btn-teal",
            value: "audit",
            action: () => {
              this.view.showSlideToast("Audit Report", "Cryptographic tamper-check verified.", "info");
            }
          },
          {
            text: "✕ Dismiss",
            type: "btn-outline",
            value: false
          }
        ]
      });
    };
  }

  const btnFlipCard = document.getElementById("btn-demo-flip-card");
  const flipperCardWrapper = document.getElementById("profile-card-flipper-wrapper");

  const doFlip = () => {
    if (this.view && typeof this.view.toggleCardFlipper === "function") {
      const isFlipped = this.view.toggleCardFlipper();
      if (this.view.showSlideToast) {
        this.view.showSlideToast(
          "Card Flipped",
          `🔄 3D Profile Card flipped to: ${isFlipped ? "QR Telemetry (Back)" : "Devotee ID (Front)"}`,
          "info",
          2500
        );
      }
    }
  };

  if (btnFlipCard) {
    btnFlipCard.onclick = (e) => {
      e.stopPropagation();
      doFlip();
    };
  }

  if (flipperCardWrapper) {
    flipperCardWrapper.onclick = (e) => {
      if (e.target.closest('#btn-demo-flip-card')) return;
      doFlip();
    };
  }

  // Bind active profile to card flipper dynamically
  if (this.view && typeof this.view.updateProfileCardFlipper === "function") {
    const activeProfile = (this.model && typeof this.model.getActiveProfile === "function")
      ? this.model.getActiveProfile()
      : (this.model && this.model.profiles ? this.model.profiles[0] : null);
    if (activeProfile) {
      this.view.updateProfileCardFlipper(activeProfile);
    }
  }

  // 5. Textbox live validation demo & clear trigger
  const txtValidation = document.getElementById("demo-textbox-validation");
  const btnClearTxt = document.getElementById("btn-clear-demo-textbox");
  if (txtValidation && this.view && typeof this.view.setValidationStatus === "function") {
    const validateFn = () => {
      const val = txtValidation.value.trim();
      if (!val) {
        this.view.setValidationStatus(txtValidation, false, "⚠️ Reference code is required");
        return;
      }
      const isValid = /^SK[A-Z0-9\-]{2,15}$/i.test(val);
      this.view.setValidationStatus(
        txtValidation,
        isValid,
        isValid ? "✓ Valid Sansthan Reference Format" : "⚠️ Must start with SK- and contain alphanumeric characters"
      );
    };
    txtValidation.oninput = validateFn;
    if (btnClearTxt) {
      btnClearTxt.onclick = () => {
        txtValidation.value = "";
        validateFn();
        txtValidation.focus();
      };
    }
  }
};

/**
 * Renders the Sadhana Applied Box and Remedy Applied Box
 * for Devotee and Trainee portals below the Current Events in Progress panel.
 */
ProfileController.prototype.renderMyApplications = function(activeProfile, roleMode) {
  const sadhanaRow = document.getElementById("devotee-sadhana-tiles-row");
  const remedyRow = document.getElementById("devotee-remedy-tiles-row");
  const sadhanaStrip = document.getElementById("devotee-sadhana-applied-strip");
  const remedyStrip = document.getElementById("devotee-remedy-applied-strip");
  const sadhanaBadge = document.getElementById("devotee-sadhana-count-badge");
  const remedyBadge = document.getElementById("devotee-remedy-count-badge");

  if (!sadhanaRow || !remedyRow) return;

  const prof = activeProfile || (this.model && typeof this.model.getActiveProfile === "function" ? this.model.getActiveProfile() : null);
  const currentRole = (roleMode || (this.model && typeof this.model.getRoleMode === "function" ? this.model.getRoleMode() : "DEVOTEE") || "DEVOTEE").toUpperCase();

  // Screen Authorization Matrix check
  const matrix = (this.model && typeof this.model.getAuthMatrix === "function") 
    ? this.model.getAuthMatrix() 
    : (typeof ScreenAuthMatrix !== "undefined" ? ScreenAuthMatrix.getAuthMatrix() : []);

  const isStripVisible = (stripId, defaultVisible) => {
    const item = Array.isArray(matrix) ? matrix.find(x => x && x.id === stripId) : null;
    if (!item) return defaultVisible;
    if (item.roles && item.roles[currentRole] !== undefined) return Boolean(item.roles[currentRole]);
    if (item[currentRole] !== undefined) return Boolean(item[currentRole]);
    return defaultVisible;
  };

  const showSadhanaStrip = isStripVisible("devotee_sadhana_applied_strip", currentRole === "DEVOTEE" || currentRole === "TRAINEE");
  const showRemedyStrip = isStripVisible("devotee_remedy_applied_strip", currentRole === "DEVOTEE" || currentRole === "TRAINEE");

  if (sadhanaStrip) {
    sadhanaStrip.style.display = showSadhanaStrip ? "block" : "none";
  }
  if (remedyStrip) {
    remedyStrip.style.display = showRemedyStrip ? "block" : "none";
  }

  if (!showSadhanaStrip && !showRemedyStrip) return;

  // Retrieve applications from Single Source of Truth
  const sadhanaApps = (this.model && typeof this.model.getMySadhanaApplications === "function")
    ? this.model.getMySadhanaApplications(prof)
    : [];

  const remedyApps = (this.model && typeof this.model.getMyRemedyApplications === "function")
    ? this.model.getMyRemedyApplications(prof)
    : [];

  // Update Badges
  if (sadhanaBadge) {
    const activeCount = sadhanaApps.filter(a => (a.status || "").toUpperCase() === "APPROVED" || (a.status || "").toUpperCase() === "ONGOING").length;
    sadhanaBadge.textContent = `${sadhanaApps.length} Applied${activeCount > 0 ? ` (${activeCount} Active)` : ''}`;
  }
  if (remedyBadge) {
    const activeCount = remedyApps.filter(a => (a.status || "").toUpperCase() === "APPROVED" || (a.status || "").toUpperCase() === "ONGOING").length;
    remedyBadge.textContent = `${remedyApps.length} Applied${activeCount > 0 ? ` (${activeCount} Active)` : ''}`;
  }

  // Render Tiles
  this._renderAppliedTiles(sadhanaRow, sadhanaApps, 'sadhana');
  this._renderAppliedTiles(remedyRow, remedyApps, 'remedy');

  // Bind Events
  this._bindMyApplicationsEvents();
};

ProfileController.prototype._renderAppliedTiles = function(container, apps, type) {
  if (!container) return;

  if (!apps || apps.length === 0) {
    const isSadhana = type === 'sadhana';
    container.innerHTML = `
      <div class="devotee-empty-state-tile" style="width: 100%;">
        <span style="font-size: 1.25rem;">${isSadhana ? '📿' : '🌿'}</span>
        <div>
          <div style="font-weight: 600; color: var(--gold-300, #fef08a);">No ${isSadhana ? 'Sadhana Initiations' : 'Remedy Upayas'} Applied Yet</div>
          <div style="font-size: 0.76rem; color: var(--text-secondary, #94a3b8); margin-top: 2px;">
            Choose a sanctified ${isSadhana ? 'Vedic sadhana practice' : 'astrological remedial upay'} to begin spiritual guidance.
          </div>
        </div>
        <button type="button" class="btn-add-event-cta" onclick="if(window.sadhanaRemedyController) (window.sadhanaRemedyController.initiateFlow || window.sadhanaRemedyController.openWizard).call(window.sadhanaRemedyController, '${type}')" style="margin-top: 4px;">
          ＋ Apply for ${isSadhana ? 'Sadhana Initiation' : 'Remedy / Upay'}
        </button>
      </div>
    `;
    return;
  }

  const html = apps.map(app => {
    const status = (app.status || "PENDING").toUpperCase();
    const isApproved = status === "APPROVED" || status === "ACTIVE" || status === "ONGOING";
    const isPending = status === "PENDING";
    const isRevision = status === "REVISION_REQUIRED" || status === "REVISION_REQUESTED";
    const isRejected = status === "REJECTED" || isRevision;

    let badgeClass = "badge-upcoming";
    let badgeStyle = "background: rgba(234, 179, 8, 0.18); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.4);";
    let badgeText = "⏳ Awaiting Approval";
    let progressFillClass = "bar-upcoming";
    let progressPct = 25;
    let progressLabel = "Under Mentor Review";
    let daysInfo = "In Queue";
    let tileModifier = "tile-event-upcoming";
    let icon = type === 'remedy' ? '🌿' : '🪔';

    if (isApproved) {
      badgeClass = "badge-ongoing";
      badgeStyle = "background: rgba(34, 197, 94, 0.18); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4);";
      badgeText = "● Approved & Active";
      progressFillClass = "bar-ongoing";
      progressPct = 100;
      progressLabel = app.initiationToken ? `Token: ${app.initiationToken}` : "Sanctioned";
      daysInfo = `${app.cycleDays || 21} Days Cycle`;
      tileModifier = "tile-event-ongoing";
      icon = type === 'remedy' ? '✨' : '🔥';
    } else if (isRejected) {
      badgeClass = "badge-completed";
      badgeStyle = isRevision ? "background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4);" : "background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);";
      badgeText = isRevision ? "📝 Revision Required" : "✕ Rejected";
      progressFillClass = "bar-completed";
      progressPct = isRevision ? 15 : 0;
      progressLabel = isRevision ? "Mentor Feedback Attached" : "Closed / Declined";
      daysInfo = isRevision ? "Needs Update" : "Discontinued";
      tileModifier = "tile-event-completed";
      icon = isRevision ? '📝' : '✕';
    }

    const title = app.itemTitle || app.title || (type === 'remedy' ? 'Navgraha Shanti Upay' : 'Vedic Sadhana Practice');
    const targetMalas = app.targetMalas ? `${app.targetMalas} Malas/day` : 'Daily Ritual';
    const cycleDays = app.cycleDays ? `${app.cycleDays} Days` : '21 Days';
    const slot = app.scheduleSlot ? app.scheduleSlot.split('(')[0].trim() : 'Brahma Muhurta';
    const mentor = app.mentorName || 'Pujya Gurudev';

    return `
      <div class="current-event-tile ${tileModifier} devotee-applied-tile"
           data-app-id="${app.id}"
           data-app-type="${type}"
           role="article"
           tabindex="0"
           title="${title} — ${badgeText}">
        <div class="event-tile-header">
          <div class="event-tile-icon-wrap">${icon}</div>
          <div class="event-tile-meta" style="flex: 1; min-width: 0;">
            <span class="event-tile-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;" title="${title}">${title}</span>
            <span class="event-tile-badge ${badgeClass}" style="${badgeStyle}">${badgeText}</span>
          </div>
          <div class="event-tile-actions">
            <button type="button" class="btn-event-options btn-app-details" data-app-id="${app.id}" title="View Application Details" aria-label="View Details">ℹ️</button>
          </div>
        </div>
        <div class="event-tile-details">
          <div class="event-detail-row">
            <span class="event-detail-label">🎯 Target Practice</span>
            <span class="event-detail-value">${targetMalas}</span>
          </div>
          <div class="event-detail-row">
            <span class="event-detail-label">⏳ Cycle Duration</span>
            <span class="event-detail-value">${cycleDays}</span>
          </div>
          <div class="event-detail-row">
            <span class="event-detail-label">⏰ Schedule Slot</span>
            <span class="event-detail-value" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px;" title="${app.scheduleSlot || slot}">${slot}</span>
          </div>
          <div class="event-detail-row">
            <span class="event-detail-label">👑 Mentor / Guide</span>
            <span class="event-detail-value" style="color: var(--gold-400);">${mentor}</span>
          </div>
        </div>
        <div class="event-tile-progress-wrap">
          <div class="event-progress-bar-track">
            <div class="event-progress-bar-fill ${progressFillClass}" style="width: ${progressPct}%;"></div>
          </div>
          <div class="event-progress-labels">
            <span class="event-progress-pct" style="font-size: 0.72rem;">${progressLabel}</span>
            <span class="event-progress-days" style="color: var(--gold-300); font-size: 0.72rem;">${daysInfo}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
};

ProfileController.prototype._bindMyApplicationsEvents = function() {
  if (this._myAppsEventsBound) return;
  this._myAppsEventsBound = true;

  // 1. Header Slide Out / In Toggle Buttons
  const bindToggleStrip = (btnId, stripId) => {
    const btn = document.getElementById(btnId);
    const strip = document.getElementById(stripId);
    if (btn && strip) {
      // Default to collapsed state
      strip.classList.add("is-collapsed");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("title", "Slide In / Expand Details");

      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isCollapsed = strip.classList.toggle("is-collapsed");
        btn.setAttribute("aria-expanded", !isCollapsed);
        btn.setAttribute("title", isCollapsed ? "Slide In / Expand Details" : "Slide Out / Hide Details");
      };
    }
  };

  bindToggleStrip("btn-toggle-sadhana-applied", "devotee-sadhana-applied-strip");
  bindToggleStrip("btn-toggle-remedy-applied", "devotee-remedy-applied-strip");

  // Backward compatibility fallback for any older Apply buttons
  const btnApplySadhana = document.getElementById("btn-apply-more-sadhana");
  if (btnApplySadhana) {
    btnApplySadhana.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.sadhanaRemedyController) {
        if (typeof window.sadhanaRemedyController.initiateFlow === "function") {
          window.sadhanaRemedyController.initiateFlow("sadhana");
        } else if (typeof window.sadhanaRemedyController.openWizard === "function") {
          window.sadhanaRemedyController.openWizard("sadhana");
        }
      }
    };
  }

  const btnApplyRemedy = document.getElementById("btn-apply-more-remedy");
  if (btnApplyRemedy) {
    btnApplyRemedy.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.sadhanaRemedyController) {
        if (typeof window.sadhanaRemedyController.initiateFlow === "function") {
          window.sadhanaRemedyController.initiateFlow("remedy");
        } else if (typeof window.sadhanaRemedyController.openWizard === "function") {
          window.sadhanaRemedyController.openWizard("remedy");
        }
      }
    };
  }

  // 2. Delegated Click on Tiles to view full Details
  document.addEventListener("click", (e) => {
    const tile = e.target.closest(".devotee-applied-tile");
    if (!tile) return;

    const appId = tile.getAttribute("data-app-id");
    if (!appId) return;

    const allApps = (this.model && typeof this.model.getSadhanaRemedyApplications === "function")
      ? this.model.getSadhanaRemedyApplications()
      : [];
    const pairingInvites = (this.model && typeof this.model.getPairingInvites === "function")
      ? this.model.getPairingInvites()
      : [];
    const target = allApps.find(a => a.id === appId) || pairingInvites.find(i => i.id === appId);
    if (target) {
      this.showApplicationDetailsModal(target);
    }
  });

  // 3. Multi-Tab & Realtime Sync Listeners
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const syncChan = new BroadcastChannel("spiritual_karim_sync");
      syncChan.onmessage = (evt) => {
        const type = evt?.data?.type;
        if (
          type === "NEW_SADHANA_APPLICATION" ||
          type === "SADHANA_APPLICATIONS_UPDATED" ||
          type === "SADHANA_INITIATION_APPROVED" ||
          type === "SADHANA_APPLICATION_REJECTED" ||
          type === "PAIRING_INVITES_UPDATED"
        ) {
          const active = this.model && typeof this.model.getActiveProfile === "function" ? this.model.getActiveProfile() : null;
          const role = this.model && typeof this.model.getRoleMode === "function" ? this.model.getRoleMode() : "DEVOTEE";
          this.renderMyApplications(active, role);
        }
      };

      const matrixChan = new BroadcastChannel("sk_matrix_channel");
      matrixChan.onmessage = () => {
        const active = this.model && typeof this.model.getActiveProfile === "function" ? this.model.getActiveProfile() : null;
        const role = this.model && typeof this.model.getRoleMode === "function" ? this.model.getRoleMode() : "DEVOTEE";
        this.renderMyApplications(active, role);
      };
    }
  } catch (err) {
    console.warn("BroadcastChannel sync error in ProfileController2:", err);
  }

  window.addEventListener("sadhana_application_submitted", () => {
    const active = this.model && typeof this.model.getActiveProfile === "function" ? this.model.getActiveProfile() : null;
    const role = this.model && typeof this.model.getRoleMode === "function" ? this.model.getRoleMode() : "DEVOTEE";
    this.renderMyApplications(active, role);
  });
};

ProfileController.prototype.showApplicationDetailsModal = function(app) {
  if (!app) return;
  const isRemedy = app.type === 'REMEDY_APPLICATION' || app.contextType === 'remedy';
  const status = (app.status || "PENDING").toUpperCase();
  const statusColor = status === "APPROVED" ? "#4ade80" : status === "REJECTED" ? "#f87171" : "#facc15";

  const messageHtml = `
    <div style="font-family: inherit; font-size: 0.88rem; line-height: 1.5; color: var(--text-primary, #f8fafc); text-align: left;">
      <div style="padding: 10px; background: rgba(255,255,255,0.04); border-radius: 8px; border: 1px solid rgba(212,175,55,0.2); margin-bottom: 12px;">
        <div style="font-size: 1.05rem; font-weight: 700; color: var(--gold-300, #fef08a); margin-bottom: 4px;">
          ${isRemedy ? '🌿' : '🕉️'} ${app.itemTitle || app.title || 'Sacred Application'}
        </div>
        <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px; flex-wrap: wrap;">
          <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.08); font-weight: 600;">ID: ${app.id}</span>
          <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; color: ${statusColor}; border: 1px solid ${statusColor};">
            ● ${status}
          </span>
          ${app.initiationToken ? `<span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; background: rgba(212,175,55,0.2); color: #fef08a; font-weight: 700;">Token: ${app.initiationToken}</span>` : ''}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
          <span style="font-size: 0.72rem; color: var(--text-secondary, #94a3b8); display: block;">Applicant Name</span>
          <strong>${app.seekerName || 'Devotee'}</strong>
        </div>
        <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
          <span style="font-size: 0.72rem; color: var(--text-secondary, #94a3b8); display: block;">Assigned Mentor</span>
          <strong style="color: var(--gold-400);">${app.mentorName || 'Pujya Gurudev'}</strong>
        </div>
        <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
          <span style="font-size: 0.72rem; color: var(--text-secondary, #94a3b8); display: block;">Daily Practice</span>
          <strong>${app.targetMalas || 11} Malas / Day</strong>
        </div>
        <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;">
          <span style="font-size: 0.72rem; color: var(--text-secondary, #94a3b8); display: block;">Cycle Duration</span>
          <strong>${app.cycleDays || 21} Sacred Days</strong>
        </div>
        <div style="padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; grid-column: span 2;">
          <span style="font-size: 0.72rem; color: var(--text-secondary, #94a3b8); display: block;">Sanctified Schedule Slot</span>
          <strong>${app.scheduleSlot || 'Brahma Muhurta (04:00 - 06:00)'}</strong>
        </div>
      </div>

      ${app.intention ? `
        <div style="margin-bottom: 10px;">
          <span style="font-size: 0.72rem; color: var(--text-secondary, #94a3b8); display: block;">Spiritual Intention (Sankalpa)</span>
          <div style="font-size: 0.82rem; font-style: italic; color: #cbd5e1; padding: 6px 8px; background: rgba(255,255,255,0.02); border-left: 2px solid var(--gold-400); border-radius: 4px;">
            "${app.intention}"
          </div>
        </div>
      ` : ''}

      ${app.mentorFeedback ? `
        <div style="margin-bottom: 10px;">
          <span style="font-size: 0.72rem; color: #4ade80; font-weight: 700; display: block;">Mentor Deeksha Guidance</span>
          <div style="font-size: 0.82rem; color: #e2e8f0; padding: 6px 8px; background: rgba(34,197,94,0.06); border-left: 2px solid #4ade80; border-radius: 4px;">
            ${app.mentorFeedback}
          </div>
        </div>
      ` : ''}

      <div style="font-size: 0.72rem; color: var(--text-secondary, #94a3b8); margin-top: 8px;">
        Submitted: ${app.date ? new Date(app.date).toLocaleString() : (app.createdAtMs ? new Date(app.createdAtMs).toLocaleString() : 'Recent')}
      </div>
    </div>
  `;

  if (this.view && typeof this.view.openCustomDialog === "function") {
    this.view.openCustomDialog({
      title: `${isRemedy ? 'Remedy Upay' : 'Sadhana Initiation'} Details`,
      message: messageHtml,
      icon: isRemedy ? '🌿' : '🕉️',
      options: [
        { label: "✓ Close", value: true, class: "btn-gold" }
      ]
    });
  } else if (this.view && typeof this.view.showToast === "function") {
    this.view.showToast(`Application: ${app.itemTitle} (${status})`);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfileController;
}

