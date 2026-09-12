class ProfileController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this._initTheme();
    this._renderCurrentState();
    this._bindNavigationTabs();
    this._bindSadhanaCatalogEvents();
    this.view.initSadhanaListbox();
    this._handleHashRouting();
    this._bindEvents();

    window.addEventListener("online", () => {
      this.model.flushOfflineSyncQueue();
      this.view.showToast("📶 Online connection restored. Telemetry synced.");
    });
  }

  /**
   * Handles hash-based routing for tabs and profiles.
   * Parses URL hash on init to activate correct tab/profile.
   * Enables deep-linking via URLs like index.html#tab-healer-connect
   */
  _handleHashRouting() {
    try {
      const hash = window.location.hash || "";
      if (!hash) return;

      // Tab routing: #tab-devotee-personal, #tab-healer-connect, etc.
      const tabMatch = hash.match(/^#tab-(.+)$/);
      if (tabMatch) {
        const tabId = tabMatch[1];
        const tabBtn = document.querySelector(
          `[data-tab-id="${tabId}"], #btn-${tabId}`,
        );
        if (tabBtn) {
          tabBtn.click();
          return;
        }
      }

      // Profile deep-link: #profile=prof-xxx
      const profileMatch = hash.match(/^#profile=(.+)$/);
      if (profileMatch) {
        const profileId = decodeURIComponent(profileMatch[1]);
        this.model.setActiveProfileId(profileId);
        this._renderCurrentState();
      }
    } catch (e) {
      console.warn("Hash routing error:", e);
    }
  }

  // ==========================================
  // Device OS Theme Management (Auto / Dark / Light)
  // ==========================================
  _initTheme() {
    const savedTheme = localStorage.getItem("sk_theme_preference") || "auto";
    this._applyTheme(savedTheme, false);

    // Dynamic listener for OS theme preference changes
    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", () => {
        const currentPref =
          localStorage.getItem("sk_theme_preference") || "auto";
        if (currentPref === "auto") {
          this._applyTheme("auto", false);
        }
      });
    } catch (err) {
      console.warn("MatchMedia listener error", err);
    }
  }

  _applyTheme(pref, showToast = false) {
    localStorage.setItem("sk_theme_preference", pref);
    let resolvedTheme = pref;
    if (pref === "auto") {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolvedTheme = prefersDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", resolvedTheme);

    if (this.view.themeIcon && this.view.themeLabel) {
      if (pref === "auto") {
        this.view.themeIcon.textContent = "💻";
        this.view.themeLabel.textContent = `Auto (${resolvedTheme === "dark" ? "Dark" : "Light"})`;
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title = `Theme: Auto (Device OS: ${resolvedTheme === "dark" ? "Dark" : "Light"}) | Click to change`;
        }
      } else if (pref === "dark") {
        this.view.themeIcon.textContent = "🌐™";
        this.view.themeLabel.textContent = "Dark";
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title = "Theme: Dark Mode | Click to change";
        }
      } else {
        this.view.themeIcon.textContent = "☀️";
        this.view.themeLabel.textContent = "Light";
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title =
            "Theme: Light Mode | Click to change";
        }
      }
    }

    if (showToast) {
      this.view.showToast(`🎨 Theme switched to: ${pref.toUpperCase()}`);
    }
  }

  _cycleTheme() {
    const current = localStorage.getItem("sk_theme_preference") || "auto";
    const sequence = ["auto", "dark", "light"];
    const nextIndex = (sequence.indexOf(current) + 1) % sequence.length;
    const nextTheme = sequence[nextIndex];
    this._applyTheme(nextTheme, true);
  }

  _renderCurrentState() {
    const active = this.model.getActiveProfile();
    const visibleProfiles = this.model.getVisibleProfiles();
    const roleMode = this.model.getRoleMode();
    const settings = this.model.settings;
    this.view.allProfiles = this.model.profiles;
    this.view.render(active, visibleProfiles, roleMode, settings);

    // Dynamic authorization matrix applies relative to inspected profile role
    const targetRole =
      active && active.id !== "prof-admin-01" && active.profileType
        ? active.profileType
        : roleMode;
    this.view.applyDynamicAuthMatrix(this.model.getAuthMatrix(), targetRole);

    // Render dynamic approval notification under mentor name
    const invites = this.model.getPairingInvites();
    this.view.renderApprovalNotification(invites, roleMode);

    this._enforcePortalVisibility(roleMode);
    this._filterRemedies();
  }

  /**
   * Enforces portal-specific visibility per CLAUDE.md §3.2
   * Hides elements not meant for the current portal/role combination
   */
  _enforcePortalVisibility(roleMode) {
    const matrix = this.model.getAuthMatrix();
    const bodyRole = document.body.getAttribute("data-portal-role") || roleMode;

    Object.keys(matrix).forEach((id) => {
      const item = matrix[id];
      // Skip if no portal visibility definition
      if (!item.portalVisible) return;

      const el = document.getElementById(id);
      if (!el) return;

      // Check if this element should be visible for current portal
      const portalKey = bodyRole.toLowerCase();
      const shouldBeVisible = item.portalVisible[portalKey] !== false;

      if (!shouldBeVisible) {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    });
  }

  _filterRemedies() {
    const searchInput = document.getElementById("input-search-remedies");
    const query = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const activeSeg = document.querySelector(
      '.segmented-control[data-target-section="remedies"] .segmented-item.active',
    );
    const filterMode = activeSeg
      ? activeSeg.getAttribute("data-filter") || "ALL"
      : "ALL";

    const remedyCards = document.querySelectorAll(".remedy-card-option");
    let matchCount = 0;

    remedyCards.forEach((card) => {
      const titleEl = card.querySelector(".option-title");
      const tagEl = card.querySelector(".option-tag");
      const sadhanaId = card.getAttribute("data-sadhana-id") || "";
      const catalogItem = SADHANA_CATALOG[sadhanaId] || {};

      const textContent =
        `${titleEl ? titleEl.textContent : ""} ${tagEl ? tagEl.textContent : ""} ${catalogItem.summary || ""} ${catalogItem.mantra || ""}`.toLowerCase();
      const isPaid =
        card.classList.contains("tile-paid") ||
        card.querySelector(".stamp-paid") !== null;

      const matchesSearch = query === "" || textContent.includes(query);
      const matchesFilter =
        filterMode === "ALL" ||
        (filterMode === "PAID" && isPaid) ||
        (filterMode === "FREE" && !isPaid);

      if (matchesSearch && matchesFilter) {
        card.style.display = "";
        matchCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Also manage category group headers visibility if all cards inside are hidden
    document.querySelectorAll(".remedy-category-group").forEach((group) => {
      const visibleCards = group.querySelectorAll(
        '.remedy-card-option:not([style*="display: none"])',
      );
      group.style.display = visibleCards.length > 0 ? "" : "none";
    });
  }

  switchMainTab(tabId) {
    const allTabBtns = document.querySelectorAll(".main-tab-btn");
    const allPanels = document.querySelectorAll(".main-tab-content-panel");

    allTabBtns.forEach((btn) => {
      if (btn.getAttribute("data-main-tab") === tabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    allPanels.forEach((p) => {
      if (p.id === tabId) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });

    if (tabId === "tab-firebase-data") {
      this.view.renderFirebaseDataTable(this.model);
    }
    if (tabId === "tab-pending-approvals") {
      const profile = this.model.getActiveProfile();
      this.view.renderSharePairingModal(
        profile,
        this.model.getPairingInvites(),
      );
      this.view.toggleSharePairingModal(true);
      setTimeout(() => {
        const target = document.querySelector(".pending-approvals-card");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
    if (tabId === "tab-genealogy-tree") {
      const activeProf = this.model.getActiveProfile();
      this.view.renderInBodyHierarchyTree(
        this.model.profiles,
        null,
        "",
        this.view.inBodyTreePanState?.layoutMode || "cluster",
      );
      if (typeof this.view.renderRespectiveTreeSection === "function") {
        this.view.renderRespectiveTreeSection(activeProf, this.model.profiles);
      }
      setTimeout(() => {
        if (typeof this.view.smartFitInBodyTree === "function") {
          this.view.smartFitInBodyTree();
        }
      }, 100);
    }
  }

  _bindNavigationTabs() {
    // Delegated click on any .main-tab-btn (including Box 1 Header 3rd Column Genealogy Tab and lower 4 nav bar tabs)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".main-tab-btn");
      if (btn) {
        const tabId = btn.getAttribute("data-main-tab");
        if (tabId) {
          this.switchMainTab(tabId);
        }
      }

      // Sub-tab button switching
      const subBtn = e.target.closest(".sub-tab-btn");
      if (subBtn) {
        const subTabId = subBtn.getAttribute("data-sub-tab");
        const parentPanel = subBtn.closest(".main-tab-content-panel");
        if (parentPanel && subTabId) {
          parentPanel
            .querySelectorAll(".sub-tab-btn")
            .forEach((b) => b.classList.remove("active"));
          subBtn.classList.add("active");
          parentPanel.querySelectorAll(".sub-tab-panel").forEach((p) => {
            if (p.id === subTabId) p.classList.add("active");
            else p.classList.remove("active");
          });
        }
      }
    });
  }

  _bindSadhanaCatalogEvents() {
    // 1. Delegated Click on Sadhana/Remedy Card Option / Eye Trigger -> Open Slide-out Drawer
    document.addEventListener("click", (e) => {
      const eyeBtn = e.target.closest(".btn-sadhana-info-trigger");
      if (eyeBtn) {
        const sadhanaKey = eyeBtn.getAttribute("data-sadhana-id");
        if (sadhanaKey) {
          this.view.openSadhanaDrawer(sadhanaKey);
          return;
        }
      }

      // Universal Stamp Toggle on any tile
      const stampToggleBtn = e.target.closest(".btn-tile-stamp-toggle");
      if (stampToggleBtn) {
        e.stopPropagation();
        const itemId = stampToggleBtn.getAttribute("data-item-id");
        const sadhanaId = stampToggleBtn.getAttribute("data-sadhana-id");
        const profile = this.model.getActiveProfile();

        if (itemId && profile.traineeSadhanas) {
          const item = profile.traineeSadhanas.find((ts) => ts.id === itemId);
          if (item) {
            const currentPaid =
              item.isPaid !== false && item.paymentStatus !== "FREE";
            item.isPaid = !currentPaid;
            item.paymentStatus = item.isPaid ? "PAID" : "FREE";
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(
              profile.traineeSadhanas,
            );
            this.view._updateJSONPreview(profile);
            this.view.showToast(
              `"${item.title}" stamp set to: ${item.paymentStatus === "PAID" ? "🟢 PAID" : "🔴 FREE"}`,
            );
            return;
          }
        }

        if (sadhanaId) {
          const item = (profile.interestedSadhanas || []).find(
            (is) => is.id === sadhanaId,
          );
          if (item) {
            const currentPaid =
              item.isPaid !== false && item.paymentStatus !== "FREE";
            item.isPaid = !currentPaid;
            item.paymentStatus = item.isPaid ? "PAID" : "FREE";
          }
          // Also sync with trainee sadhanas
          const tItem = (profile.traineeSadhanas || []).find(
            (ts) => ts.sadhanaKey === sadhanaId || ts.id === sadhanaId,
          );
          if (tItem) {
            const currentPaid =
              tItem.isPaid !== false && tItem.paymentStatus !== "FREE";
            tItem.isPaid = !currentPaid;
            tItem.paymentStatus = tItem.isPaid ? "PAID" : "FREE";
          }
          this.model.saveProfiles(this.model.profiles);
          this.view._renderInterestedSadhanas(profile.interestedSadhanas || []);
          this.view._renderCategorizedTraineeSadhanas(
            profile.traineeSadhanas || [],
          );
          this.view._updateJSONPreview(profile);
          this.view.showToast(
            `Tile stamp set to: ${(item?.paymentStatus || tItem?.paymentStatus) === "PAID" ? "🟢 PAID" : "🔴 FREE"}`,
          );
          return;
        }
      }

      // Trainee Tile Selection -> Displays in Right Panel
      const traineeTile = e.target.closest(".trainee-card-tile");
      if (traineeTile && !e.target.closest(".tile-actions-vertical")) {
        const itemId = traineeTile.getAttribute("data-item-id");
        if (itemId) {
          this.view.selectedTraineeId = itemId;
          const p = this.model.getActiveProfile();
          this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas || []);
          return;
        }
      }

      // Catalog Remedy card click (open ritual drawer)
      const remedyCard = e.target.closest(".remedy-card-option");
      if (remedyCard && !e.target.closest(".tile-actions-vertical")) {
        const sadhanaKey = remedyCard.getAttribute("data-sadhana-id");
        if (sadhanaKey) {
          this.view.openSadhanaDrawer(sadhanaKey);
        }
      }
    });

    // Close Sadhana Drawer
    const btnCloseDrawer = document.getElementById("btn-close-sadhana-drawer");
    if (btnCloseDrawer)
      btnCloseDrawer.addEventListener("click", () =>
        this.view.closeSadhanaDrawer(),
      );
    const drawerBackdrop = document.getElementById("sadhana-drawer-backdrop");
    if (drawerBackdrop)
      drawerBackdrop.addEventListener("click", () =>
        this.view.closeSadhanaDrawer(),
      );

    // 2. Checkbox change: Ticking auto-syncs into Trainee Sadhak In-Progress
    document.addEventListener("change", (e) => {
      if (e.target && e.target.name === "remedy-checkbox") {
        const cb = e.target;
        const key = cb.value;
        const isChecked = cb.checked;

        // Synchronize all checkboxes with this value across the DOM
        document
          .querySelectorAll(`input[name="remedy-checkbox"][value="${key}"]`)
          .forEach((c) => {
            c.checked = isChecked;
          });

        const profile = this.model.getActiveProfile();
        if (!profile.selectedRemedies) profile.selectedRemedies = [];
        if (!profile.interestedSadhanas) profile.interestedSadhanas = [];
        if (!profile.traineeSadhanas) profile.traineeSadhanas = [];

        const catalogItem = SADHANA_CATALOG[key] || {
          id: key,
          title: key,
          category: "Sadhana",
          domain: "sadhanas",
        };

        if (isChecked) {
          if (!profile.selectedRemedies.includes(key)) {
            profile.selectedRemedies.push(key);
          }
          const existing = profile.interestedSadhanas.find(
            (is) => is.id === key || is.name === catalogItem.title,
          );
          if (!existing) {
            profile.interestedSadhanas.push({
              id: key,
              name: catalogItem.title,
              category: catalogItem.category,
              priority: "High",
              status: "Enrolled",
              isPaid:
                profile.isPaid !== false && profile.paymentStatus !== "FREE",
              paymentStatus:
                profile.isPaid !== false && profile.paymentStatus !== "FREE"
                  ? "PAID"
                  : "FREE",
            });
          }

          // Auto-sync into Trainee Sadhak In-Progress
          const traineeExisting = profile.traineeSadhanas.find(
            (ts) =>
              ts.sadhanaKey === key ||
              (ts.id && ts.id === key) ||
              ts.title.toLowerCase() === catalogItem.title.toLowerCase(),
          );
          if (!traineeExisting) {
            const newTraineeItem = {
              id: "ts-" + Date.now().toString().slice(-4),
              sadhanaKey: key,
              title: catalogItem.title,
              categoryDomain: catalogItem.domain || "sadhanas",
              isPaid:
                profile.isPaid !== false && profile.paymentStatus !== "FREE",
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
                    : "11 Malas Daily",
              currentStreak: "1 Day",
              progressPercent: 20,
              status: "In Progress",
              mentorCode: profile.referredByCode || "SKHM-ADM1-7788-9900",
              diaryNotes: `Attunement active. Timing: ${catalogItem.timing || "Brahma Muhurta"}. Mantra: ${catalogItem.mantra || "Om Namah Shivaya"}`,
              memos: [
                {
                  date:
                    new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) +
                    " " +
                    new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  author: "Mentor Devendra",
                  text: `Enrolled into ${catalogItem.title}. Timing: ${catalogItem.timing || "Daily"}. Mantra frequency synchronized.`,
                },
              ],
            };
            profile.traineeSadhanas.push(newTraineeItem);
            this.view.selectedTraineeId = newTraineeItem.id;
          } else {
            this.view.selectedTraineeId = traineeExisting.id;
          }

          this.view.showToast(
            `✓ "${catalogItem.title}" enrolled & added to Trainee In-Progress!`,
          );
        } else {
          profile.selectedRemedies = profile.selectedRemedies.filter(
            (k) => k !== key,
          );
          profile.interestedSadhanas = profile.interestedSadhanas.filter(
            (is) => is.id !== key && is.name !== catalogItem.title,
          );
          this.view.showToast(
            `Removed "${catalogItem.title}" from Enrolled Queue.`,
          );
        }

        this.model.saveProfiles(this.model.profiles);
        this.view._renderInterestedSadhanas(profile.interestedSadhanas);
        this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
        this.view._updateJSONPreview(profile);
      }

      // Trainee item checkbox change in Trainee left panel
      if (e.target && e.target.classList.contains("trainee-item-checkbox")) {
        const itemId = e.target.getAttribute("data-item-id");
        const profile = this.model.getActiveProfile();
        if (!e.target.checked && itemId) {
          if (confirm("Remove this sadhana from active In-Progress list?")) {
            const item = profile.traineeSadhanas.find((ts) => ts.id === itemId);
            if (item) {
              const key = item.sadhanaKey || item.id;
              profile.selectedRemedies = (
                profile.selectedRemedies || []
              ).filter((k) => k !== key);
              profile.interestedSadhanas = (
                profile.interestedSadhanas || []
              ).filter((is) => is.id !== key && is.name !== item.title);
            }
            profile.traineeSadhanas = profile.traineeSadhanas.filter(
              (ts) => ts.id !== itemId,
            );
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(
              profile.traineeSadhanas,
            );
            this.view._renderInterestedSadhanas(profile.interestedSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast("Removed from Trainee In-Progress.");
          } else {
            e.target.checked = true;
          }
        }
      }
    });

    // 3. Send to Trainee from Slide-out Drawer Footer Button
    if (this.view.btnDrawerSendTrainee) {
      this.view.btnDrawerSendTrainee.addEventListener("click", () => {
        const key =
          this.view.btnDrawerSendTrainee.getAttribute("data-sadhana-key");
        if (key) {
          const profile = this.model.getActiveProfile();
          if (!profile) {
            this.view.showToast(
              "⚠️ No active profile selected. Please select a profile first.",
            );
            return;
          }
          // Check duplicate
          const isAlreadyEnrolled =
            profile.traineeSadhanas &&
            profile.traineeSadhanas.some(
              (ts) => ts.sadhanaKey === key || ts.id === key,
            );
          // Check concurrency limit (max 3 concurrent in-progress sadhanas)
          const activeSadhanas = (profile.traineeSadhanas || []).filter(
            (ts) => ts.status === "In Progress" || ts.progressPercent < 100,
          );
          if (!isAlreadyEnrolled && activeSadhanas.length >= 3) {
            this.view.showToast(
              `⚠️ Quota Exceeded: ${profile.name} already has 3 active sadhanas. Complete or graduate an existing sadhana first.`,
            );
            return;
          }
          const sent = this.model.sendSadhanaToTrainee(key);
          this.view.closeSadhanaDrawer();
          this.switchMainTab("tab-trainee-sadhak");
          this._renderCurrentState();
          if (isAlreadyEnrolled) {
            this.view.showToast(
              `ℹ️ "${sent.title}" was already active in Trainee In-Progress for ${profile.name}. View refreshed!`,
            );
          } else {
            this.view.showToast(
              `🚀 "${sent.title}" sent to Trainee Sadhak In-Progress for ${profile.name}!`,
            );
          }
        }
      });
    }

    // 4. Enroll in Queue from Drawer Footer Button
    if (this.view.btnDrawerEnroll) {
      this.view.btnDrawerEnroll.addEventListener("click", () => {
        const key = this.view.btnDrawerEnroll.getAttribute("data-sadhana-key");
        if (key) {
          const profile = this.model.getActiveProfile();
          if (!profile) {
            this.view.showToast(
              "⚠️ No active profile selected. Please select a profile first.",
            );
            return;
          }
          // Check duplicate
          const isAlreadyEnrolled =
            profile.traineeSadhanas &&
            profile.traineeSadhanas.some(
              (ts) => ts.sadhanaKey === key || ts.id === key,
            );
          // Check concurrency limit (max 3 concurrent in-progress sadhanas)
          const activeSadhanas = (profile.traineeSadhanas || []).filter(
            (ts) => ts.status === "In Progress" || ts.progressPercent < 100,
          );
          if (!isAlreadyEnrolled && activeSadhanas.length >= 3) {
            this.view.showToast(
              `⚠️ Quota Exceeded: ${profile.name} already has 3 active sadhanas. Complete or graduate an existing sadhana first.`,
            );
            return;
          }
          const sent = this.model.sendSadhanaToTrainee(key);
          this.view.closeSadhanaDrawer();
          this._renderCurrentState();
          if (isAlreadyEnrolled) {
            this.view.showToast(
              `ℹ️ "${sent.title}" is already active in Queue for ${profile.name}.`,
            );
          } else {
            this.view.showToast(
              `✓ "${sent.title}" enrolled in Queue & Trainee In-Progress for ${profile.name}.`,
            );
          }
        }
      });
    }

    // 5. Goli Gyan Guide Modal Open & Close
    const btnOpenGoli = document.getElementById("btn-open-goli-gyan");
    if (btnOpenGoli)
      btnOpenGoli.addEventListener("click", () =>
        this.view.toggleGoliGyanModal(true),
      );
    const btnCloseGoli = document.getElementById("btn-close-goli-gyan-modal");
    if (btnCloseGoli)
      btnCloseGoli.addEventListener("click", () =>
        this.view.toggleGoliGyanModal(false),
      );

    // 6. Speech Recognition Engine for Universal Mic Input
    let speechRecognition = null;
    let activeRecordingBtn = null;

    const getSpeechRecognizer = () => {
      const SpeechRec =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        return null;
      }
      if (!speechRecognition) {
        speechRecognition = new SpeechRec();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
      }
      speechRecognition.lang = this.model.settings?.speechLang || "en-US";
      return speechRecognition;
    };

    // 7. Global Click Handler for Universal Memo Box (Keyboard, Mic, Send, Quick Chips) & Upline Verification
    document.addEventListener("click", (e) => {
      // 7A: Keyboard Helper Trigger (Toggles quick chips & focuses textarea)
      const btnKeyboard = e.target.closest(".btn-memo-keyboard");
      if (btnKeyboard) {
        const targetId = btnKeyboard.getAttribute("data-target");
        if (targetId) {
          const textarea = document.getElementById(targetId);
          if (textarea) textarea.focus();
          const chipsWrap = document.getElementById(`quick-chips-${targetId}`);
          if (chipsWrap) {
            chipsWrap.style.display =
              chipsWrap.style.display === "none" ? "flex" : "none";
          }
        }
        return;
      }

      // 7B: Quick Suggestion Chip Click
      const quickChip = e.target.closest(".memo-quick-chip");
      if (quickChip) {
        const targetId = quickChip.getAttribute("data-target");
        const chipText = quickChip.textContent.trim();
        if (targetId && chipText) {
          const textarea = document.getElementById(targetId);
          if (textarea) {
            const currentVal = textarea.value.trim();
            textarea.value = currentVal
              ? `${currentVal} ? ${chipText}`
              : chipText;
            textarea.focus();
          }
        }
        return;
      }

      // 7C: Mic Speech-to-Text Button Click
      const btnMic = e.target.closest(".btn-memo-mic");
      if (btnMic) {
        const targetId = btnMic.getAttribute("data-target");
        const textarea = document.getElementById(targetId);
        const recognizer = getSpeechRecognizer();

        if (!recognizer) {
          const promptInput = prompt(
            "Browser Speech API not supported directly on this browser. You can type or paste your voice transcript here:",
          );
          if (promptInput && textarea) {
            const cur = textarea.value.trim();
            textarea.value = cur ? `${cur} ${promptInput}` : promptInput;
            textarea.focus();
          }
          return;
        }

        if (btnMic.classList.contains("is-recording")) {
          // Stop recording
          try {
            recognizer.stop();
          } catch (err) {
            /* ignore */
          }
          btnMic.classList.remove("is-recording");
          btnMic.title = "Voice-to-Text Input (Microphone)";
          activeRecordingBtn = null;
          this.view.showToast("🎙️ Voice recording stopped.");
        } else {
          // Start recording
          if (activeRecordingBtn) {
            activeRecordingBtn.classList.remove("is-recording");
          }
          activeRecordingBtn = btnMic;
          btnMic.classList.add("is-recording");
          btnMic.title = "Listening... Speak into microphone (Click to stop)";
          this.view.showToast(
            "🎙️ Listening... Speak your memo or progress note now.",
          );

          recognizer.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript && textarea) {
              const cur = textarea.value.trim();
              textarea.value = cur ? `${cur} ${transcript}` : transcript;
              textarea.focus();
              this.view.showToast(`🎤 Speech captured: "${transcript}"`);
            }
          };

          recognizer.onerror = (event) => {
            console.warn("Speech recognition error:", event.error);
            btnMic.classList.remove("is-recording");
            btnMic.title = "Voice-to-Text Input (Microphone)";
            activeRecordingBtn = null;
            this.view.showToast(`⚠️ Voice input error: ${event.error}`);
          };

          recognizer.onend = () => {
            btnMic.classList.remove("is-recording");
            btnMic.title = "Voice-to-Text Input (Microphone)";
            activeRecordingBtn = null;
          };

          try {
            recognizer.start();
          } catch (err) {
            console.warn("Speech recognition start failed", err);
            btnMic.classList.remove("is-recording");
            activeRecordingBtn = null;
          }
        }
        return;
      }

      // 7D: Memo Send / Submit Button Click
      const btnSend = e.target.closest("#btn-add-trainee-memo");
      if (btnSend) {
        const itemId = btnSend.getAttribute("data-item-id");
        const memoInput = document.getElementById("trainee-new-memo-text");
        if (memoInput && itemId) {
          const text = memoInput.value.trim();
          if (!text) {
            alert("Please enter a note or memo message before submitting.");
            return;
          }
          const activeProf = this.model.getActiveProfile();
          const author =
            this.model.getRoleMode() === "MASTER"
              ? "Master Karim"
              : this.model.getRoleMode() === "HEALER"
                ? activeProf.name || "Healer Mentor"
                : activeProf.name || "Devotee Sadhak";

          const updatedItem = this.model.addTraineeMemo(itemId, text, author);
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast("✓ Progress note added with date-time stamp!");
          }
        }
        return;
      }

      // 7E: Upline Verification Request Click
      const btnVerifyRequest = e.target.closest(".btn-verify-request");
      if (btnVerifyRequest) {
        const itemId = btnVerifyRequest.getAttribute("data-item-id");
        if (itemId) {
          const updatedItem = this.model.requestTraineeVerification(itemId);
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._renderCategorizedTraineeSadhanas(
              this.model.getActiveProfile().traineeSadhanas,
            );
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast(
              `🛡️ Progress verification request sent to Upline Sponsor (${updatedItem.mentorCode})!`,
            );
          }
        }
        return;
      }

      // 7F: Upline Verification Approve Click
      const btnVerifyApprove = e.target.closest(".btn-verify-approve");
      if (btnVerifyApprove) {
        const itemId = btnVerifyApprove.getAttribute("data-item-id");
        if (itemId) {
          const defaultFounder = this.model.getSetting("defaultMentorName", "Spiritual Karim Khan (Founder)");
          const mentorName =
            this.model.getRoleMode() === "MASTER"
              ? defaultFounder
              : activeProf.name || "Healer Mentor";
          const mentorCode =
            this.model.getRoleMode() === "MASTER"
              ? "SKHM-ADM1-7788-9900"
              : activeProf.referenceCode || "SKHM-HLR2-3344-5566";

          const updatedItem = this.model.approveTraineeVerification(
            itemId,
            mentorName,
            mentorCode,
          );
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._renderCategorizedTraineeSadhanas(
              this.model.getActiveProfile().traineeSadhanas,
            );
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast(
              `✅ Progress approved & verified by ${mentorName}!`,
            );
          }
        }
        return;
      }

      // 7G: Upline Verification Reject / Revision Click
      const btnVerifyReject = e.target.closest(".btn-verify-reject");
      if (btnVerifyReject) {
        const itemId = btnVerifyReject.getAttribute("data-item-id");
        if (itemId) {
          const reason = prompt(
            "Enter mentor guidance or revision notes for this trainee:",
            "Complete 11 additional malas daily and re-submit for seal.",
          );
          if (reason !== null) {
            const activeProf = this.model.getActiveProfile();
            const defaultFounder = this.model.getSetting("defaultMentorName", "Spiritual Karim Khan (Founder)");
            const mentorName =
              this.model.getRoleMode() === "MASTER"
                ? defaultFounder
                : activeProf.name || "Healer Mentor";
            const updatedItem = this.model.rejectTraineeVerification(
              itemId,
              reason,
              mentorName,
            );
            if (updatedItem) {
              this.view._renderTraineeActiveDetail(updatedItem);
              this.view._renderCategorizedTraineeSadhanas(
                this.model.getActiveProfile().traineeSadhanas,
              );
              this.view._updateJSONPreview(this.model.getActiveProfile());
              this.view.showToast("Revision request logged in timeline.");
            }
          }
        }
        return;
      }
    });

    // 8. Keyboard shortcut (Ctrl+Enter / Cmd+Enter) for quick submit on Universal Memo textarea
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (
          e.target &&
          e.target.classList.contains("universal-memo-textarea")
        ) {
          const btn = document.getElementById("btn-add-trainee-memo");
          if (btn) btn.click();
        }
      }
    });

    // Live update of Trainee Parameters (level, progress, target, streak) from Right Panel
    document.addEventListener("change", (e) => {
      const target = e.target;
      if (!target) return;
      const itemId = target.getAttribute("data-item-id");
      if (!itemId) return;

      const profile = this.model.getActiveProfile();
      const item = (profile.traineeSadhanas || []).find(
        (ts) => ts.id === itemId,
      );
      if (!item) return;

      if (target.classList.contains("active-ts-level-select")) {
        item.level = target.value;
      } else if (target.classList.contains("active-ts-progress-input")) {
        item.progressPercent = Math.min(
          100,
          Math.max(0, parseInt(target.value, 10) || 0),
        );
      } else if (target.classList.contains("active-ts-target-input")) {
        item.dailyTarget = target.value.trim();
      } else if (target.classList.contains("active-ts-streak-input")) {
        item.currentStreak = target.value.trim();
      } else {
        return;
      }

      this.model.saveProfiles(this.model.profiles);
      this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
      this.view._updateJSONPreview(profile);
    });
  }

  _bindRealtimeInputValidations() {
    const validations = [
      {
        id: "new-profile-name",
        test: (val) => Boolean(val && val.trim().length >= 3),
        msg: "Name must be at least 3 characters",
      },
      {
        id: "new-profile-phone",
        test: (val) =>
          /^(\+?\d{1,4}[- ]?)?\d{10}$/.test((val || "").replace(/[\s-]/g, "")),
        msg: "Enter a valid 10-digit mobile number",
      },
      {
        id: "new-profile-sponsor",
        test: (val) =>
          !val ||
          /^(ROOT|[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})$/i.test(
            val.trim(),
          ),
        msg: "Must be ROOT or valid 16-digit code (e.g. SKHM-ADM1-7788-9900)",
      },
      {
        id: "input-name",
        test: (val) => Boolean(val && val.trim().length >= 3),
        msg: "Name must be at least 3 characters",
      },
      {
        id: "input-phone",
        test: (val) =>
          !val || /^(\+?\d{1,4}[- ]?)?\d{10}$/.test(val.replace(/[\s-]/g, "")),
        msg: "Enter a valid 10-digit mobile number",
      },
    ];

    validations.forEach(({ id, test, msg }) => {
      const input = document.getElementById(id);
      if (input) {
        const handler = () => {
          const val = input.value;
          if (!val && !input.required) {
            this.view.setValidationStatus(input, true, "");
            return;
          }
          const ok = test(val);
          this.view.setValidationStatus(input, ok, ok ? "✓ Valid format" : msg);
        };
        input.addEventListener("input", handler);
        input.addEventListener("blur", handler);
      }
    });
  }

  _bindSidebarNavigationAndTierEvents() {
    // 1. Navigation items in sidebar
    const navItems = document.querySelectorAll(".drawer-nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        navItems.forEach((n) => n.classList.remove("active"));
        item.classList.add("active");

        // Close mobile drawer if open
        if (
          this.view.sidebarEl &&
          this.view.sidebarEl.classList.contains("mobile-open")
        ) {
          this.view.toggleMobileSidebar(false);
        }

        const target = item.getAttribute("data-nav-target");
        switch (target) {
          case "dashboard": {
            const el = document.getElementById("main-profile-box-1");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            this.view.showSlideToast(
              "Dashboard",
              "Viewing Hero Profile Card & Canvas",
              "info",
              2000,
            );
            break;
          }
          case "tab-devotee-personal":
            this.switchMainTab("tab-devotee-personal");
            this.view.switchSubTab("devotee-personal", "devotee-sub-identity");
            this.view.showSlideToast(
              "Devotee Personal",
              "🌟 Tab 1: Personal Identity & Lineage",
              "info",
              2000,
            );
            break;

          case "tab-seeker-purpose":
            this.switchMainTab("tab-seeker-purpose");
            this.view.showSlideToast(
              "Seeker Purpose",
              "🎯 Tab 2: Goals & Sacred Sadhana Catalog",
              "info",
              2000,
            );
            break;

          case "tab-trainee-sadhak":
            this.switchMainTab("tab-trainee-sadhak");
            this.view.showSlideToast(
              "Trainee Sadhak",
              "🌿 Tab 3: Level-Wise Sadhanas & Memos",
              "info",
              2000,
            );
            break;

          case "tab-healer-connect":
            this.switchMainTab("tab-healer-connect");
            this.view.showSlideToast(
              "Healer Connect",
              "👑 Tab 4: Healers Hub & Guided Seekers",
              "info",
              2000,
            );
            break;

          case "tab-genealogy-tree":
            this.switchMainTab("tab-genealogy-tree");
            this.view.renderInBodyHierarchyTree(
              this.model.profiles,
              null,
              "",
              this.view.inBodyTreePanState?.layoutMode || "cluster",
            );
            this.view.showSlideToast(
              "Genealogy Tree",
              "🌳 Tab 5: 5-Level MLM Canvas Spiderweb",
              "info",
              2000,
            );
            break;

          case "tab-firebase-data":
            this.switchMainTab("tab-firebase-data");
            this.view.renderFirebaseDataTable(this.model);
            this.view.showSlideToast(
              "Firebase Data",
              "🔥 Tab 6: Realtime DB Structured Drill-down",
              "info",
              2000,
            );
            break;

          case "telemetry-qr": {
            const flipper = document.getElementById(
              "profile-card-flipper-wrapper",
            );
            if (flipper) {
              flipper.classList.add("is-flipped");
              const el = document.getElementById("main-profile-box-1");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              this.view.showSlideToast(
                "Device Telemetry",
                "📡 24h Device Pairing QR & Cloud Telemetry",
                "info",
                2500,
              );
            }
            break;
          }
          case "lineage":
            this.switchMainTab("tab-devotee-personal");
            this.view.switchSubTab("devotee-personal", "devotee-sub-lineage");
            this.view.showSlideToast(
              "Ancestral Lineage",
              "🌳 3-Generation Ancestral Lineage Tree",
              "info",
              2000,
            );
            break;

          case "houseclean":
            this.switchMainTab("tab-devotee-personal");
            this.view.switchSubTab(
              "devotee-personal",
              "devotee-sub-houseclean",
            );
            this.view.showSlideToast(
              "House Clean Sanctum",
              "🧹 House Clean Status & Levels",
              "info",
              2000,
            );
            break;
        }
      });
    });

    // 2. App Hierarchy Tiers in Sidebar (Actively change role, tab and filter!)
    document
      .querySelectorAll("#hierarchy-legend-container .legend-item")
      .forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const tier = parseInt(item.getAttribute("data-tier"), 10);

          // If this tier is already open in the in-body left panel, toggle close it
          if (
            this.view.currentOpenTier === tier &&
            this.view.tierProfilesPanel &&
            this.view.tierProfilesPanel.classList.contains("is-open")
          ) {
            this.view.closeTierPanel();
            this.view.showSlideToast(
              "Tier Panel",
              "◂ Collapsed in-body hierarchy panel",
              "info",
              2000,
            );
            return;
          }

          // Highlight active item
          document
            .querySelectorAll("#hierarchy-legend-container .legend-item")
            .forEach((it) => it.classList.remove("active"));
          item.classList.add("active");

          // Also update corresponding nav item
          document
            .querySelectorAll(".drawer-nav-item")
            .forEach((n) => n.classList.remove("active"));

          if (tier === 1) {
            // Admin Master -> Switch to MASTER role & Tab 1
            if (this.view.selectRoleMode) {
              this.view.selectRoleMode.value = "MASTER";
              this.view.selectRoleMode.dispatchEvent(new Event("change"));
            }
            this.switchMainTab("tab-devotee-personal");
            this.view.showSlideToast(
              "Admin Master Tier",
              "👑 Viewing Master Founder Profiles & Controls",
              "info",
              2500,
            );
          } else if (tier === 2) {
            // Healer Connect -> Switch to HEALER role & Tab 4 (Healers Hub)
            if (this.view.selectRoleMode) {
              this.view.selectRoleMode.value = "HEALER";
              this.view.selectRoleMode.dispatchEvent(new Event("change"));
            }
            this.switchMainTab("tab-healer-connect");
            const navHealer = document.getElementById("nav-item-healer-page");
            if (navHealer) navHealer.classList.add("active");
            this.view.showSlideToast(
              "Healer Connect Tier",
              "🛡️ Switched to Certified Healers Hub (Tab 4)",
              "info",
              2500,
            );
          } else if (tier === 3) {
            // Trainee Sadhak -> Switch to TRAINEE role & Tab 3
            if (this.view.selectRoleMode) {
              this.view.selectRoleMode.value = "TRAINEE";
              this.view.selectRoleMode.dispatchEvent(new Event("change"));
            }
            this.switchMainTab("tab-trainee-sadhak");
            const navTrainee = document.getElementById("nav-item-trainee-page");
            if (navTrainee) navTrainee.classList.add("active");
            this.view.showSlideToast(
              "Trainee Sadhak Tier",
              "🌿 Switched to Trainee Mentorship & Sadhanas (Tab 3)",
              "info",
              2500,
            );
          } else if (tier === 4) {
            // Devotee / Seeker -> Switch to DEVOTEE role & Tab 1
            if (this.view.selectRoleMode) {
              this.view.selectRoleMode.value = "DEVOTEE";
              this.view.selectRoleMode.dispatchEvent(new Event("change"));
            }
            this.switchMainTab("tab-devotee-personal");
            const navDevotee = document.getElementById("nav-item-devotee-page");
            if (navDevotee) navDevotee.classList.add("active");
            this.view.showSlideToast(
              "Devotee Seeker Tier",
              "🌟 Switched to Devotee Personal Workspace (Tab 1)",
              "info",
              2500,
            );
          }

          // Also open flyout panel if user wants detailed profile cards
          this.view.openTierPanel(
            tier,
            this.model.profiles,
            this.model.activeProfileId,
          );
        });
      });

    // 3. Dedicated Sub-Portal Links (Actively switch role mode & view!)
    document
      .querySelectorAll("#sidebar-dedicated-portals .sub-portal-link")
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          const tier = parseInt(link.getAttribute("data-portal-tier"), 10);
          // Only prevent default if we can handle in-page smoothly
          if (window.location.protocol !== "file:") {
            e.preventDefault();
          }

          document
            .querySelectorAll("#sidebar-dedicated-portals .sub-portal-link")
            .forEach((l) => l.classList.remove("active"));
          link.classList.add("active");

          const roleMap = {
            1: "MASTER",
            2: "HEALER",
            3: "TRAINEE",
            4: "DEVOTEE",
          };
          const targetRole = roleMap[tier] || "MASTER";

          if (this.view.selectRoleMode) {
            this.view.selectRoleMode.value = targetRole;
            this.view.selectRoleMode.dispatchEvent(new Event("change"));
          }

          if (tier === 2) {
            this.switchMainTab("tab-healer-connect");
          } else if (tier === 3) {
            this.switchMainTab("tab-trainee-sadhak");
          } else {
            this.switchMainTab("tab-devotee-personal");
          }

          this.view.showSlideToast(
            "Portal Switched",
            `🏛️ Active Portal: ${link.textContent.trim()}`,
            "info",
            2500,
          );
        });
      });
  }

  _bindEvents() {
    // Dynamic Role Authorization Matrix Actions in Settings
    const btnSaveAuthMatrix = document.getElementById("btn-save-auth-matrix");
    if (btnSaveAuthMatrix) {
      btnSaveAuthMatrix.addEventListener("click", (e) => {
        e.preventDefault();
        const currentRole = this.model.getRoleMode();
        if (currentRole !== "MASTER") {
          this.view.showSlideToast(
            "Access Restricted",
            "Only Master role can modify the Authorization Matrix",
            "warning",
            3000,
          );
          return;
        }

        const matrix = this.model.getAuthMatrix();
        const rows = document.querySelectorAll(
          "#auth-matrix-tbody tr[data-item-id]",
        );

        rows.forEach((row) => {
          const itemId = row.getAttribute("data-item-id");
          const item = matrix.find((m) => m.id === itemId);
          if (item) {
            const roles = ["MASTER", "HEALER", "TRAINEE", "DEVOTEE"];
            roles.forEach((r) => {
              const chk = row.querySelector(
                `.matrix-role-check[data-role="${r}"]`,
              );
              if (chk) {
                item[r] = chk.checked;
              }
            });
          }
        });

        this.model.saveAuthMatrix(matrix);
        this.view.applyDynamicAuthMatrix(matrix, currentRole);
        this.view.showSlideToast(
          "Matrix Updated",
          "🛡️ Authorization Matrix saved and applied in real-time!",
          "success",
          3000,
        );
      });
    }

    const btnResetAuthMatrix = document.getElementById("btn-reset-auth-matrix");
    if (btnResetAuthMatrix) {
      btnResetAuthMatrix.addEventListener("click", (e) => {
        e.preventDefault();
        const currentRole = this.model.getRoleMode();
        if (currentRole !== "MASTER") {
          this.view.showSlideToast(
            "Access Restricted",
            "Only Master role can reset the Authorization Matrix",
            "warning",
            3000,
          );
          return;
        }

        const defaultMatrix = this.model.getDefaultAuthMatrix();
        this.model.saveAuthMatrix(defaultMatrix);
        this.view.renderAuthMatrixInSettings(defaultMatrix, currentRole);
        this.view.applyDynamicAuthMatrix(defaultMatrix, currentRole);
        this.view.showSlideToast(
          "Matrix Reset",
          "🔄 Default authorization permissions restored",
          "info",
          2500,
        );
      });
    }

    this._bindSidebarNavigationAndTierEvents();
    // 1. 3D Card Flipper Direct & Click Handlers
    const btnFlipToBack = document.getElementById("btn-flip-to-back");
    const btnFlipToFront = document.getElementById("btn-flip-to-front");
    const flipperWrapper = document.getElementById(
      "profile-card-flipper-wrapper",
    );

    if (btnFlipToBack && flipperWrapper) {
      btnFlipToBack.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        flipperWrapper.classList.add("is-flipped");
        this.view.showSlideToast(
          "3D Telemetry Flipped",
          "📡 24h Device Pairing QR & RTDB Telemetry Active",
          "info",
          3000,
        );
      });
    }

    if (btnFlipToFront && flipperWrapper) {
      btnFlipToFront.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        flipperWrapper.classList.remove("is-flipped");
        this.view.showSlideToast(
          "3D Profile Flipped",
          "👤 Viewing Member Profile Identity Card",
          "info",
          2500,
        );
      });
    }

    if (flipperWrapper) {
      flipperWrapper.addEventListener("dblclick", () => {
        const isFlipped = flipperWrapper.classList.toggle("is-flipped");
        this.view.showSlideToast(
          isFlipped ? "3D Telemetry Flipped" : "3D Profile Flipped",
          isFlipped ? "📡 24h Device Pairing QR & RTDB Telemetry Active" : "👤 Viewing Member Profile Identity Card",
          "info",
          2500,
        );
      });
    }

    // Card 2: Selected Member Card Action Handlers
    const btnCloseMemberCard = document.getElementById("btn-close-selected-member-card");
    if (btnCloseMemberCard) {
      btnCloseMemberCard.addEventListener("click", () => {
        this.model.setActiveProfileId("prof-admin-01");
        this._renderCurrentState();
        if (typeof this.view.closeTierPanel === "function") {
          this.view.closeTierPanel();
        }
        this.view.showSlideToast(
          "Master Portal Restored",
          "👑 Returned to Master Founder view (Spiritual Karim Khan)",
          "info",
          2500,
        );
      });
    }

    const btnMemberCopyCode = document.getElementById("btn-selected-member-copy-code");
    if (btnMemberCopyCode) {
      btnMemberCopyCode.addEventListener("click", () => {
        const activeP = this.model.getActiveProfile();
        if (activeP && activeP.referenceCode) {
          if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(activeP.referenceCode).then(() => {
              this.view.showToast(`📋 Copied: ${activeP.referenceCode}`);
            }).catch(() => {
              this.view.showToast(`📋 Code: ${activeP.referenceCode}`);
            });
          } else {
            this.view.showToast(`📋 Code: ${activeP.referenceCode}`);
          }
        }
      });
    }

    const btnMemberQr = document.getElementById("btn-selected-member-qr");
    if (btnMemberQr && flipperWrapper) {
      btnMemberQr.addEventListener("click", () => {
        flipperWrapper.classList.toggle("is-flipped");
        const isFlipped = flipperWrapper.classList.contains("is-flipped");
        this.view.showSlideToast(
          isFlipped ? "3D Telemetry Active" : "Profile Identity Active",
          isFlipped ? "📡 24h Pairing QR & Device Telemetry" : "👤 Viewing Profile Card",
          "info",
          2500,
        );
      });
    }

    // 2. Directory Layout Segmented Toggle Handlers (Grid Cards vs Table List)
    const btnLayoutGrid = document.getElementById("btn-layout-grid");
    const btnLayoutTable = document.getElementById("btn-layout-table");
    if (btnLayoutGrid) {
      btnLayoutGrid.addEventListener("click", () => {
        this.view.directoryLayout = "GRID";
        if (typeof localStorage !== "undefined")
          localStorage.setItem("sk_directory_layout", "GRID");
        const scoped = this.model.getScopedProfiles();
        this.view.renderAndroidHealersHub(
          scoped,
          this.model.getActiveProfile(),
          this.model.getRoleMode(),
        );
        this.view.showSlideToast(
          "Layout Switched",
          "📋 Directory set to Grid Cards layout",
          "info",
          2000,
        );
      });
    }
    if (btnLayoutTable) {
      btnLayoutTable.addEventListener("click", () => {
        this.view.directoryLayout = "TABLE";
        if (typeof localStorage !== "undefined")
          localStorage.setItem("sk_directory_layout", "TABLE");
        const scoped = this.model.getScopedProfiles();
        this.view.renderAndroidHealersHub(
          scoped,
          this.model.getActiveProfile(),
          this.model.getRoleMode(),
        );
        this.view.showSlideToast(
          "Layout Switched",
          "📋 Directory set to Table List layout",
          "info",
          2000,
        );
      });
    }

    // 3. Sacred Sadhana Interactive Listbox Selection
    const selectSacredSadhana = document.getElementById(
      "select-sacred-sadhana",
    );
    if (selectSacredSadhana) {
      selectSacredSadhana.addEventListener("change", (e) => {
        this.view.renderSadhanaDetailPreview(e.target.value);
        const item =
          typeof SADHANA_CATALOG !== "undefined"
            ? SADHANA_CATALOG[e.target.value]
            : null;
        this.view.showSlideToast(
          "Sadhana Loaded",
          "Viewing details for " + (item ? item.title : e.target.value),
          "info",
          2500,
        );
      });
    }

    // 4. RBAC Access Matrix Modal Listeners
    ["btn-open-rbac-matrix", "sidebar-btn-rbac-matrix"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.view.toggleRbacMatrixModal(true);
        });
      }
    });

    ["btn-close-rbac-modal", "btn-close-rbac-footer"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.view.toggleRbacMatrixModal(false);
        });
      }
    });

    // 5. 24h Share & Pairing Modal Listeners
    ["btn-quick-share-pairing", "sidebar-btn-share-pairing"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const profile = this.model.getActiveProfile();
          this.view.renderSharePairingModal(
            profile,
            this.model.getPairingInvites(),
          );
          this.view.toggleSharePairingModal(true);
        });
      }
    });

    // 6. Admin System Settings Modal Listeners
    ["btn-admin-settings", "sidebar-btn-admin-settings"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          // Initialize settings modal controller
          if (!this.settingsModalController) {
            this.settingsModalController = new SettingsModalController(this);
          }
          this.settingsModalController.open("general");
        });
      }
    });

    // 6.1 Settings Modal Left Panel Navigation
    const settingsLeftPanel = document.querySelector(".settings-left-panel");
    if (settingsLeftPanel) {
      settingsLeftPanel.addEventListener("click", (e) => {
        const navItem = e.target.closest(".settings-nav-item");
        if (navItem) {
          const section = navItem.getAttribute("data-section");
          this._switchSettingsSection(section);
        }
      });
    }

    // 6.2 Settings Modal Buttons
    const btnSaveSettingsModal = document.getElementById(
      "btn-save-settings-modal",
    );
    const btnCancelSettingsModal = document.getElementById(
      "btn-cancel-settings-modal",
    );
    const btnResetSettingsModal = document.getElementById(
      "btn-reset-settings-modal",
    );

    if (btnSaveSettingsModal) {
      btnSaveSettingsModal.addEventListener("click", () => {
        this._saveSettingsModal();
      });
    }

    if (btnCancelSettingsModal) {
      btnCancelSettingsModal.addEventListener("click", () => {
        this.view.toggleSettingsModal(false);
      });
    }

    if (btnResetSettingsModal) {
      btnResetSettingsModal.addEventListener("click", () => {
        if (
          confirm(
            "Are you sure you want to reset all settings to factory defaults?",
          )
        ) {
          this.model.saveSettings(this.model._getDefaultSettings());
          this._loadSettingsToModal();
          this.view.showToast("✅ Settings reset to defaults");
        }
      });
    }

    // 6.3 Auth Matrix Buttons in Settings Modal
    const btnResetAuthMatrixModal = document.getElementById(
      "btn-reset-auth-matrix-modal",
    );
    const btnSaveAuthMatrixModal = document.getElementById(
      "btn-save-auth-matrix-modal",
    );

    if (btnResetAuthMatrixModal) {
      btnResetAuthMatrixModal.addEventListener("click", () => {
        const defaultMatrix = this.model.getDefaultAuthMatrix();
        this.model.saveAuthMatrix(defaultMatrix);
        this.view.renderAuthMatrixInSettings(defaultMatrix, "MASTER");
        this.view.showToast("🔄 Auth matrix reset to defaults");
      });
    }

    if (btnSaveAuthMatrixModal) {
      btnSaveAuthMatrixModal.addEventListener("click", () => {
        const matrix = this.model.getAuthMatrix();
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

        this.model.saveAuthMatrix(matrix);
        this.view.applyDynamicAuthMatrix(matrix, this.model.getRoleMode());
        this.view.showToast("💾 Auth matrix saved successfully");
      });
    }

    // 7. Real-Time Textbox Validation Listeners
    this._bindRealtimeInputValidations();

    // 0. Theme Switcher Event Listener
    if (this.view.btnThemeToggle) {
      this.view.btnThemeToggle.addEventListener("click", () => {
        this._cycleTheme();
      });
    }

    // ==============================================================
    // ANDROID COMPOSE ALIGNED: HEALERS HUB & RECURSIVE TREE EVENT BINDINGS
    // ==============================================================

    // 1. Search Bar in Healers Hub
    const inputHealersSearch = document.getElementById("input-healers-search");
    if (inputHealersSearch) {
      inputHealersSearch.addEventListener("input", (e) => {
        this.view.healersSearchQuery = e.target.value;
        const scoped = this.model.getScopedProfiles();
        this.view.renderAndroidHealersHub(
          scoped,
          this.model.getActiveProfile(),
          this.model.getRoleMode(),
        );
      });
    }

    // 2. Category Filter Chips in Healers Hub
    const filterChipsContainer = document.getElementById(
      "healers-filter-chips-container",
    );
    if (filterChipsContainer) {
      filterChipsContainer.addEventListener("click", (e) => {
        const chip = e.target.closest(".healer-filter-chip");
        if (chip) {
          filterChipsContainer
            .querySelectorAll(".healer-filter-chip")
            .forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.view.healersSelectedCategory =
            chip.getAttribute("data-type") || "ALL";
          const scoped = this.model.getScopedProfiles();
          this.view.renderAndroidHealersHub(
            scoped,
            this.model.getActiveProfile(),
            this.model.getRoleMode(),
          );
        }
      });
    }

    // 3. Top Banner "5-Level Tree" Button Shortcut
    const btnOpenHealersTree = document.getElementById("btn-open-healers-tree");
    if (btnOpenHealersTree) {
      btnOpenHealersTree.addEventListener("click", () => {
        this.switchMainTab("tab-genealogy-tree");
        this.view.renderAndroidHierarchyTree(
          this.model.profiles,
          this.view.hierarchySelectedLevel || "ALL",
        );
        this.view.showToast("🌳 Switched to Organization Hierarchy Tree");
      });
    }

    // 4. Hierarchy Level Generation Filter Chips (Tab 5)
    const hierarchyLevelFilterChips = document.getElementById(
      "hierarchy-level-filter-chips",
    );
    if (hierarchyLevelFilterChips) {
      hierarchyLevelFilterChips.addEventListener("click", (e) => {
        const chip = e.target.closest(".hierarchy-level-filter-chip");
        if (chip) {
          hierarchyLevelFilterChips
            .querySelectorAll(".hierarchy-level-filter-chip")
            .forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          const lvl = chip.getAttribute("data-level") || "ALL";
          this.view.hierarchySelectedLevel = lvl;
          this.view.renderAndroidHierarchyTree(this.model.profiles, lvl);
          this.view.showToast(
            `🎯 Level Generation Filter: ${lvl === "ALL" ? "All Levels" : "Level " + lvl}`,
          );
        }
      });
    }

    // 5. Segmented Tree View Toggles (Recursive List vs Canvas)
    const btnViewRecursive = document.getElementById("btn-view-recursive");
    const btnViewCanvas = document.getElementById("btn-view-canvas");
    const recursiveViewEl = document.getElementById(
      "hierarchy-recursive-tree-view",
    );
    const canvasViewEl = document.getElementById("hierarchy-canvas-tree-view");

    if (btnViewRecursive && btnViewCanvas) {
      btnViewRecursive.addEventListener("click", () => {
        btnViewRecursive.classList.add("active");
        btnViewCanvas.classList.remove("active");
        if (recursiveViewEl) recursiveViewEl.style.display = "flex";
        if (canvasViewEl) canvasViewEl.style.display = "none";
        this.view.renderAndroidHierarchyTree(
          this.model.profiles,
          this.view.hierarchySelectedLevel || "ALL",
        );
      });

      btnViewCanvas.addEventListener("click", () => {
        btnViewCanvas.classList.add("active");
        btnViewRecursive.classList.remove("active");
        if (recursiveViewEl) recursiveViewEl.style.display = "none";
        if (canvasViewEl) canvasViewEl.style.display = "block";
        if (typeof this.view.renderInBodyHierarchyTree === "function") {
          this.view.renderInBodyHierarchyTree(
            this.model.profiles,
            null,
            "",
            this.view.inBodyTreePanState?.layoutMode || "cluster",
          );
        }
        setTimeout(() => {
          if (typeof this.view.smartFitInBodyTree === "function") {
            this.view.smartFitInBodyTree();
          }
        }, 80);
      });
    }

    // Guaranteed Toolbar Controls for Body Tree Canvas (Tab 5)
    const btnSmartFit = document.getElementById("btn-body-smart-fit");
    if (btnSmartFit) {
      btnSmartFit.onclick = () => {
        if (typeof this.view.smartFitInBodyTree === "function") {
          this.view.smartFitInBodyTree();
          this.view.showToast("🎯 Smart Fit: Centered & scaled to viewport.");
        }
      };
    }
    const btnZoomIn = document.getElementById("btn-body-zoom-in");
    if (btnZoomIn) {
      btnZoomIn.onclick = () => {
        if (typeof this.view.zoomInBodyTree === "function") {
          this.view.zoomInBodyTree();
        } else if (this.view.inBodyTreePanState) {
          this.view.inBodyTreePanState.scale = Math.min(
            2.5,
            (this.view.inBodyTreePanState.scale || 1.0) + 0.18,
          );
          this.view._applyInBodyTreeTransform?.(true);
        }
      };
    }
    const btnZoomOut = document.getElementById("btn-body-zoom-out");
    if (btnZoomOut) {
      btnZoomOut.onclick = () => {
        if (typeof this.view.zoomOutBodyTree === "function") {
          this.view.zoomOutBodyTree();
        } else if (this.view.inBodyTreePanState) {
          this.view.inBodyTreePanState.scale = Math.max(
            0.3,
            (this.view.inBodyTreePanState.scale || 1.0) - 0.18,
          );
          this.view._applyInBodyTreeTransform?.(true);
        }
      };
    }
    const btnZoomReset = document.getElementById("btn-body-zoom-reset");
    if (btnZoomReset) {
      btnZoomReset.onclick = () => {
        if (typeof this.view.resetInBodyTree === "function") {
          this.view.resetInBodyTree();
        } else if (this.view.inBodyTreePanState) {
          this.view.inBodyTreePanState.scale = 1.0;
          this.view.inBodyTreePanState.panX = 0;
          this.view.inBodyTreePanState.panY = 30;
          this.view._applyInBodyTreeTransform?.(true);
        }
        this.view.showToast("🔄 Tree view reset to 100%");
      };
    }
    const btnFullscreen = document.getElementById("btn-body-fullscreen");
    if (btnFullscreen) {
      btnFullscreen.onclick = () => {
        const viewport = document.getElementById("body-tree-canvas-viewport");
        if (viewport) {
          viewport.classList.toggle("is-fullscreen");
          const isFull = viewport.classList.contains("is-fullscreen");
          btnFullscreen.innerHTML = isFull
            ? "<span>✕</span> <span>Exit Fullscreen</span>"
            : "<span>⛶</span> <span>Fullscreen</span>";
          setTimeout(() => {
            if (typeof this.view.smartFitInBodyTree === "function")
              this.view.smartFitInBodyTree();
          }, 200);
        }
      };
    }

    // 6. Global Delegate for Healer Cards & Recursive Tree Interactive Elements
    document.addEventListener("click", (e) => {
      // Copy 16-Digit Code Pill
      const copyCodeBtn = e.target.closest(".btn-copy-card-code");
      if (copyCodeBtn) {
        const code = copyCodeBtn.getAttribute("data-code");
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            this.view.showToast(`📋 Copied: ${code}`);
          });
        }
        return;
      }

      // Member 3-Dots Quick Action Menu
      const quickOptsBtn = e.target.closest(".btn-member-quick-opts");
      if (quickOptsBtn) {
        const pid = quickOptsBtn.getAttribute("data-profile-id");
        const prof = this.model.profiles.find((p) => p.id === pid);
        if (prof) {
          this.view.openNodeActionDialog(prof);
        }
        return;
      }

      // Toggle Tree Recursive Branch Expand / Collapse
      const toggleBranchBtn = e.target.closest(".btn-toggle-tree-branch");
      if (toggleBranchBtn) {
        const nodeId = toggleBranchBtn.getAttribute("data-node-id");
        const branch = document.getElementById(`tree-branch-${nodeId}`);
        if (branch) {
          const isHidden = branch.style.display === "none";
          branch.style.display = isHidden ? "flex" : "none";
          toggleBranchBtn.textContent = isHidden ? "−" : "+";
        }
        return;
      }

      // Share Tree Node
      const shareNodeBtn = e.target.closest(".btn-share-tree-node");
      if (shareNodeBtn) {
        const pid = shareNodeBtn.getAttribute("data-profile-id");
        const prof = this.model.profiles.find((p) => p.id === pid);
        if (prof) {
          const shareText = `Spiritual Karim Member Profile:\nName: ${prof.name}\n16-Digit Code: ${prof.referenceCode}\nRole: ${prof.profileType}\nLevel: ${prof.level}\nSponsor: ${prof.referredByCode}`;
          navigator.clipboard.writeText(shareText).then(() => {
            this.view.showToast(`📲 Member reference copied for sharing!`);
          });
        }
        return;
      }

      // Inspect Tree Node in Drawer
      const inspectNodeBtn = e.target.closest(".btn-inspect-tree-node");
      if (inspectNodeBtn) {
        const pid = inspectNodeBtn.getAttribute("data-profile-id");
        const prof = this.model.profiles.find((p) => p.id === pid);
        if (prof) {
          this.view.renderTreeProfileDrawer(prof);
          this.view.toggleTreeProfileDrawer(true);
        }
        return;
      }

      // Jump to Profile on Node Click
      const jumpTrigger = e.target.closest(".btn-jump-profile-trigger");
      if (jumpTrigger) {
        const pid = jumpTrigger.getAttribute("data-profile-id");
        if (pid && this.model.profiles.some((p) => p.id === pid)) {
          this.model.setActiveProfileId(pid);
          this._renderCurrentState();
          this.switchMainTab("tab-devotee-personal");
          this.view.showToast(
            `🚀 Switched active profile to "${this.model.getActiveProfile().name}"`,
          );
        }
        return;
      }
    });

    // 7. Live Firebase Polling Sync Loop (Every 5 seconds)
    setInterval(() => {
      this.model.fetchFromFirebaseRealtime();
    }, 5000);

    // Mobile Sidebar Off-Canvas Drawer Toggle
    if (this.view.btnMobileSidebarToggle && this.view.adminSidebar) {
      this.view.btnMobileSidebarToggle.addEventListener("click", () => {
        const isOpen = this.view.adminSidebar.classList.toggle("mobile-open");
        if (this.view.sidebarBackdrop) {
          this.view.sidebarBackdrop.classList.toggle("open", isOpen);
        }
      });
    }

    if (this.view.sidebarBackdrop && this.view.adminSidebar) {
      this.view.sidebarBackdrop.addEventListener("click", () => {
        this.view.adminSidebar.classList.remove("mobile-open");
        this.view.sidebarBackdrop.classList.remove("open");
      });
    }

    // Quick Goli Gyan Header Button Trigger
    if (this.view.btnQuickGoliGyan) {
      this.view.btnQuickGoliGyan.addEventListener("click", () => {
        this.view.toggleGoliGyanModal(true);
      });
    }

    const btnCloseSharePairing = document.getElementById(
      "btn-close-share-pairing-modal",
    );
    if (btnCloseSharePairing) {
      btnCloseSharePairing.addEventListener("click", () => {
        this.view.toggleSharePairingModal(false);
      });
    }

    // Delegate click handler for Pairing actions in table
    document.addEventListener("click", (e) => {
      // Open Share & Pair Modal
      const btnSharePair = e.target.closest("#sidebar-btn-share-pairing, #btn-quick-share-pairing, .btn-open-share-pairing");
      if (btnSharePair) {
        e.preventDefault();
        const profile = this.model.getActiveProfile();
        this.view.renderSharePairingModal(profile, this.model.getPairingInvites());
        this.view.toggleSharePairingModal(true);
        return;
      }

      // Close Share & Pair Modal
      const btnCloseShare = e.target.closest("#btn-close-share-pairing-modal, .modal-close");
      if (btnCloseShare && btnCloseShare.closest("#share-pairing-modal")) {
        e.preventDefault();
        this.view.toggleSharePairingModal(false);
        return;
      }
      if (e.target && e.target.id === "share-pairing-modal") {
        this.view.toggleSharePairingModal(false);
        return;
      }

      // Approve Pairing
      const btnApprove = e.target.closest(".btn-approve-pairing");
      if (btnApprove) {
        const id = btnApprove.getAttribute("data-invite-id");
        if (id) {
          const row = btnApprove.closest("tr");
          const roleSelect = row ? row.querySelector(`.select-pairing-role[data-invite-id="${id}"]`) : null;
          const targetRole = roleSelect ? roleSelect.value : "DEVOTEE";
          const approved = this.model.approvePairingInvite(id, targetRole);
          if (approved) {
            this.view.renderPendingApprovalsRows(
              this.model.getPairingInvites(),
            );
            this._renderCurrentState();
            this.view.showToast(
              `✅ Seeker "${approved.seekerName}" officially verified as ${targetRole} & linked to lineage!`,
            );
          }
        }
        return;
      }

      // Review Pairing (Multi-Option Decision Dialog)
      const btnReview = e.target.closest(".btn-review-pairing");
      if (btnReview) {
        const id = btnReview.getAttribute("data-invite-id");
        if (id) {
          this._openMentorDecisionDialog(id);
        }
        return;
      }

      // Reject Pairing
      const btnReject = e.target.closest(".btn-reject-pairing");
      if (btnReject) {
        const id = btnReject.getAttribute("data-invite-id");
        if (id && confirm("Reject this pairing request?")) {
          this.model.rejectPairingInvite(id);
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
          this.view.showToast("Pairing request rejected.");
        }
        return;
      }

      // Resend Pairing (Refresh 24h with Exponential Backoff Check)
      const btnResend = e.target.closest(".btn-resend-pairing");
      if (btnResend) {
        const id = btnResend.getAttribute("data-invite-id");
        if (id) {
          const refreshed = this.model.resendPairingInvite(id);
          if (refreshed && refreshed.error) {
            this.view.showToast(`⚠️ ${refreshed.message}`);
          } else if (refreshed) {
            this.view.renderPendingApprovalsRows(
              this.model.getPairingInvites(),
            );
            this.view.showToast(
              `🔄 24-Hour window refreshed for "${refreshed.seekerName}".`,
            );
          }
        }
        return;
      }

      // Simulate New Seeker Request
      const btnSimulate = e.target.closest("#btn-simulate-new-seeker");
      if (btnSimulate) {
        const names = [
          "Kavita Rao",
          "Rahul Sen",
          "Deepak Verma",
          "Meera Nair",
          "Suresh Patel",
        ];
        const models = [
          "Samsung Galaxy S24 Ultra",
          "Google Pixel 8 Pro",
          "Xiaomi 13 Pro",
          "Vivo X90",
          "OnePlus 12",
        ];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomModel = models[Math.floor(Math.random() * models.length)];
        const randomPhone =
          "+91 9" + Math.floor(100000000 + Math.random() * 900000000);

        const newInv = this.model.createPairingInvite({
          seekerName: randomName,
          seekerPhone: randomPhone,
          deviceModel: randomModel,
        });
        if (newInv && newInv.error) {
          this.view.showToast(`⚠️ ${newInv.message}`);
        } else if (newInv) {
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
          this.view.showToast(
            `📲 New Seeker "${newInv.seekerName}" (${newInv.seekerDeviceModel}) requested pairing! 24h timer active.`,
          );
        }
        return;
      }
    });

    // 1-Second Live Countdown Ticker Interval
    setInterval(() => {
      const countdownElements = document.querySelectorAll(
        ".countdown-live[data-expires]",
      );
      if (!countdownElements || countdownElements.length === 0) return;
      const now = Date.now();
      countdownElements.forEach((el) => {
        const expiresAt = parseInt(el.getAttribute("data-expires"), 10);
        if (!expiresAt) return;
        const remainingMs = expiresAt - now;
        if (remainingMs <= 0) {
          el.className = "countdown-timer-badge countdown-expired";
          el.textContent = "⌛ Expired (24h Ended)";
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
        } else {
          const hours = Math.floor(remainingMs / (1000 * 60 * 60));
          const mins = Math.floor(
            (remainingMs % (1000 * 60 * 60)) / (1000 * 60),
          );
          const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
          const pad = (n) => String(n).padStart(2, "0");
          el.textContent = `⏳ ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
        }
      });
    }, 1000);

    // 3D Card Flipper Global Click Handler
    document.addEventListener("click", (e) => {
      const flipper = e.target.closest(".spiritual-card-flipper");
      const btnFlip = e.target.closest(".btn-flip-trigger");
      if (btnFlip && flipper) {
        e.stopPropagation();
        flipper.classList.toggle("is-flipped");
        return;
      }
      if (
        flipper &&
        !e.target.closest("button") &&
        !e.target.closest("input") &&
        !e.target.closest("textarea") &&
        !e.target.closest("a")
      ) {
        flipper.classList.toggle("is-flipped");
      }
    });

    // Accordion Listbox Expand / Collapse Toggle Handler
    document.addEventListener("click", (e) => {
      const header = e.target.closest(".accordion-header");
      if (header) {
        const item = header.closest(".accordion-item");
        if (item) {
          item.classList.toggle("is-open");
        }
      }
    });

    // Left/Right Segmented Toggle Click Handler
    document.addEventListener("click", (e) => {
      const segItem = e.target.closest(".segmented-item");
      if (segItem) {
        const parent = segItem.closest(".segmented-control");
        if (parent) {
          parent
            .querySelectorAll(".segmented-item")
            .forEach((btn) => btn.classList.remove("active"));
          segItem.classList.add("active");
          const filterValue = segItem.getAttribute("data-filter");
          const targetSection = parent.getAttribute("data-target-section");
          if (targetSection === "remedies") {
            this._filterRemedies();
          }
          this.view.showToast(`Filter applied: ${filterValue}`);
        }
      }
    });

    // Real-Time Regex Validations with Visual Indicators & Live Remedy Search
    document.addEventListener("input", (e) => {
      const target = e.target;
      if (!target) return;

      // Live search filter on remedies catalog
      if (target.id === "input-search-remedies") {
        this._filterRemedies();
      }

      // Phone validation
      if (
        target.id === "input-phone" ||
        target.classList.contains("input-validate-phone")
      ) {
        const val = target.value.trim().replace(/[\s\-]/g, "");
        if (/^(\+91)?[6789]\d{9}$/.test(val) || val.length >= 10) {
          target.classList.remove("is-invalid");
          target.classList.add("is-valid");
        } else if (val.length > 3) {
          target.classList.remove("is-valid");
          target.classList.add("is-invalid");
        } else {
          target.classList.remove("is-valid", "is-invalid");
        }
      }

      // 16-Digit Sponsor Code validation
      if (
        target.id === "input-ref-code" ||
        target.id === "input-sponsor-code" ||
        target.classList.contains("input-validate-code")
      ) {
        const val = target.value.trim();
        if (
          /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(val) ||
          val.length === 19
        ) {
          target.classList.remove("is-invalid");
          target.classList.add("is-valid");
        } else if (val.length > 5) {
          target.classList.remove("is-valid");
          target.classList.add("is-invalid");
        } else {
          target.classList.remove("is-valid", "is-invalid");
        }
      }
    });

    // Header Stamp Badge Toggle Trigger
    if (this.view.headerStampBadge) {
      this.view.headerStampBadge.style.cursor = "pointer";
      this.view.headerStampBadge.addEventListener("click", () => {
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
          `Membership stamp set to: ${profile.paymentStatus === "PAID" ? "🟢 PAID" : "🔴 FREE"}`,
        );
      });
    }

    // Active Profile Role Dropdown Switcher (MASTER | HEALER | DEVOTEE)
    if (this.view.selectRoleMode) {
      this.view.selectRoleMode.addEventListener("change", (e) => {
        const newRole = e.target.value;
        this.model.setRoleMode(newRole);

        // Auto-scope and select first matching profile of this role tier
        const roleProfiles = this.model.getVisibleProfiles();
        if (roleProfiles && roleProfiles.length > 0) {
          this.model.setActiveProfileId(roleProfiles[0].id);
        }

        // Apply dynamic authorization matrix visibility
        const matrix = this.model.getAuthMatrix();
        this.view.applyDynamicAuthMatrix(matrix, newRole);

        // Apply portal styling to body
        document.body.setAttribute("data-portal-role", newRole);

        // Re-render UI state
        this._renderCurrentState();
        this.view.showSlideToast(
          "Role Switched",
          `Viewing as ${newRole} ? Profiles scoped to ${newRole}`,
          "info",
          2500,
        );
      });
    }

    if (typeof this._bindEventsPart2 === "function") {
      this._bindEventsPart2();
    }
  }
}

ProfileController.prototype._switchSettingsSection = function(section) {
  if (this.settingsModalController && typeof this.settingsModalController._switchSection === 'function') {
    this.settingsModalController._switchSection(section);
  } else {
    document.querySelectorAll(".settings-section").forEach((el) => {
      el.style.display = "none";
    });
    const targetSection = document.getElementById(`section-${section}`);
    if (targetSection) targetSection.style.display = "block";
    document.querySelectorAll(".settings-nav-item").forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-section") === section);
    });
  }
};

ProfileController.prototype._saveSettingsModal = function() {
  if (this.settingsModalController && typeof this.settingsModalController._saveSettings === 'function') {
    this.settingsModalController._saveSettings();
  } else {
    const settings = {
      appName: document.getElementById("setting-app-name")?.value,
      orgName: document.getElementById("setting-org-name")?.value,
      firebaseUrl: document.getElementById("setting-firebase-url")?.value,
      defaultMentorName: document.getElementById("setting-default-mentor-name")?.value,
      defaultMentorCode: document.getElementById("setting-default-mentor-code")?.value,
      speechLang: document.getElementById("setting-speech-lang")?.value,
      defaultTargetMalas: document.getElementById("setting-default-target-malas")?.value,
      autoCloudSync: document.getElementById("setting-auto-cloud-sync")?.checked
    };
    this.model.saveSettings(settings);
    this.view.showToast("Settings saved successfully", "success");
    this.view.toggleSettingsModal(false);
  }
};

ProfileController.prototype._loadSettingsToModal = function() {
  if (this.settingsModalController && typeof this.settingsModalController._loadCurrentSettings === 'function') {
    this.settingsModalController._loadCurrentSettings();
  }
};

ProfileController.prototype._openMentorDecisionDialog = function(inviteId) {
  const invites = this.model.getPairingInvites();
  const inv = invites.find(i => i.id === inviteId);
  if (!inv) return;

  const modal = document.getElementById("modal-mentor-decision-dialog");
  if (!modal) return;

  const nameEl = document.getElementById("mentor-decision-applicant-name");
  const roleEl = document.getElementById("mentor-decision-applicant-role");
  const metaEl = document.getElementById("mentor-decision-applicant-meta");
  const notesEl = document.getElementById("mentor-decision-review-notes");

  if (nameEl) nameEl.textContent = inv.seekerName || "Devotee Applicant";
  if (roleEl) roleEl.textContent = inv.assignedRole || "DEVOTEE";
  if (metaEl) metaEl.textContent = `Phone: ${inv.seekerPhone || "N/A"} | Code: ${inv.devoteeCode || inv.sponsorCode || "N/A"}`;
  if (notesEl) notesEl.value = inv.mentorFeedback || "";

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");

  const closeModal = () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  };

  const btnClose = document.getElementById("btn-close-mentor-decision-dialog");
  if (btnClose) btnClose.onclick = closeModal;
  const btnCancel = document.getElementById("btn-decision-cancel");
  if (btnCancel) btnCancel.onclick = closeModal;

  const btnApprove = document.getElementById("btn-decision-approve-induct");
  if (btnApprove) {
    btnApprove.onclick = () => {
      closeModal();
      const targetRole = inv.assignedRole || "DEVOTEE";
      const approved = this.model.approvePairingInvite(inv.id, targetRole);
      if (approved) {
        this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
        this._renderCurrentState();
        if (typeof this.view.showSlideToast === "function") {
          this.view.showSlideToast("Induction Approved", `Seeker "${approved.seekerName}" officially verified as ${targetRole} & linked!`, "success");
        } else {
          this.view.showToast(`✅ Seeker "${approved.seekerName}" officially verified!`);
        }
      }
    };
  }

  const btnRevision = document.getElementById("btn-decision-request-revision");
  if (btnRevision) {
    btnRevision.onclick = () => {
      const feedback = (notesEl?.value || "Clarification required on Step 3 verification proofs.").trim();
      closeModal();
      inv.status = "INFO_REQUESTED";
      inv.mentorFeedback = feedback;
      inv.updatedAt = Date.now();
      localStorage.setItem("sk_pairing_invites", JSON.stringify(invites));
      this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
      if (typeof this.view.showSlideToast === "function") {
        this.view.showSlideToast("Revision Requested", `Requested revision from "${inv.seekerName}": ${feedback}`, "warning");
      } else {
        this.view.showToast(`📝 Revision requested: ${feedback}`);
      }
    };
  }

  const btnReject = document.getElementById("btn-decision-reject-appeal");
  if (btnReject) {
    btnReject.onclick = () => {
      const feedback = (notesEl?.value || "Application does not meet current induction criteria.").trim();
      closeModal();
      inv.status = "REJECTED";
      inv.rejectionReason = feedback;
      inv.updatedAt = Date.now();
      localStorage.setItem("sk_pairing_invites", JSON.stringify(invites));
      this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
      if (typeof this.view.showSlideToast === "function") {
        this.view.showSlideToast("Application Rejected", `Rejected with right to appeal: ${feedback}`, "error");
      } else {
        this.view.showToast(`❌ Application rejected with right to appeal.`);
      }
    };
  }
};


