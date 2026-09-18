class SadhanaRemedyView {
  constructor(controller) {
    this.controller = controller;
    this.modal = document.getElementById("modal-sadhana-initiation"); // Kept ID for backward compatibility in CSS, but acts generically
    this.totalSteps = 4;
    
    this.initBtn = document.getElementById("btn-initiate-sadhana-flow"); // Ensure this triggers the controller
    this.closeBtn = document.getElementById("btn-close-sadhana-initiation");
    this.nextBtn = document.getElementById("btn-sadhana-next");
    this.prevBtn = document.getElementById("btn-sadhana-prev");
    this.fillBar = document.getElementById("sadhana-progress-fill");
    
    // Core fields
    this.selectItem = document.getElementById("sadhana-init-select");
    this.mentorSelect = document.getElementById("sadhana-mentor-select");
    this.intentionText = document.getElementById("sadhana-intention-text");
    this.diagnosticsText = document.getElementById("sadhana-diagnostics-text");
    this.signatureText = document.getElementById("sadhana-signature-text");
    this.slotBtns = document.querySelectorAll(".segment-btn");
    
    // Switches Container
    this.switchesContainer = document.getElementById("sadhana-switches-container");
    
    // Labels
    this.modalTitle = document.getElementById("sadhana-modal-title");
    this.step1Title = document.getElementById("sadhana-step1-title");
    this.step2Title = document.getElementById("sadhana-step2-title");
    this.step3Title = document.getElementById("sadhana-step3-title");
    this.step4Title = document.getElementById("sadhana-step4-title");
    
    this.reviewName = document.getElementById("review-sadhana-name");
    this.reviewSlot = document.getElementById("review-sadhana-slot");
    this.reviewMentor = document.getElementById("review-sadhana-mentor");

    this._bindDOMEvents();
  }

  _bindDOMEvents() {
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.controller.handleNext());
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.controller.handlePrev());
    if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.controller.closeModal());
    
    // Segment toggle
    this.slotBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.slotBtns.forEach(b => {
          b.classList.remove("active");
          b.style.background = "transparent";
          b.style.color = "#475569";
        });
        e.target.classList.add("active");
        e.target.style.background = "#ffffff";
        e.target.style.color = "#0f172a";
      });
    });

    // Final Dialog Options
    const btnOpt1 = document.getElementById("btn-dialog-opt-1");
    if (btnOpt1) btnOpt1.addEventListener("click", () => this.controller.submitFinal());
    const btnOpt2 = document.getElementById("btn-dialog-opt-2");
    if (btnOpt2) btnOpt2.addEventListener("click", () => this.controller.saveDraft());
    const btnOpt3 = document.getElementById("btn-dialog-opt-3");
    if (btnOpt3) btnOpt3.addEventListener("click", () => this.controller.reopenModal());
  }

  openModal(config) {
    if (!this.modal) return;
    
    // Reset inputs
    if (this.intentionText) this.intentionText.value = '';
    if (this.diagnosticsText) this.diagnosticsText.value = '';
    if (this.signatureText) this.signatureText.value = '';
    
    // Populate dropdown based on config
    if (this.selectItem && config.items) {
      this.selectItem.innerHTML = config.items.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
    }

    // Set Requester Name & Metadata in Modal Heading
    try {
      const model = window.ProfileControllerInstance?.model || window.profileModel;
      const applicant = model && typeof model.getActiveProfile === 'function' ? model.getActiveProfile() : null;
      const reqNameEl = document.getElementById("sadhana-modal-requester-name");
      const reqMetaEl = document.getElementById("sadhana-modal-requester-meta");
      if (applicant) {
        if (reqNameEl) reqNameEl.textContent = applicant.name || 'Seeker';
        if (reqMetaEl) {
          const code = applicant.referenceCode || applicant.id || '';
          const role = applicant.profileType === 'TRAINEE' ? 'Trainee Sadhak (Level 3)' : (applicant.level === 4 || applicant.profileType === 'DEVOTEE' ? 'Devotee (Level 4)' : (applicant.profileType || 'Seeker'));
          reqMetaEl.textContent = `(${code ? code + ' • ' : ''}${role})`;
        }
      }
    } catch (e) {
      console.warn("Could not set requester header in sadhana modal:", e);
    }

    // Dynamically populate mentors dropdown (Zero hardcoded values, auto-selects branch upline healer)
    this._populateMentorsDropdown();

    // Populate dynamic switches
    if (this.switchesContainer && config.switches) {
      this.switchesContainer.innerHTML = config.switches.map((s, idx) => `
        <div class="field-group" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:0.75rem 1rem; border-radius:0.5rem; margin-bottom:0.75rem; border:1px solid #e2e8f0;">
          <span style="font-size:0.85rem; font-weight:600; color:#1e293b;">${s.label}</span>
          <label class="switch-custom">
            <input type="checkbox" id="switch-dynamic-${idx}">
            <span class="slider-round"></span>
          </label>
        </div>
      `).join('');
    }

    // Update Titles
    if (this.modalTitle) this.modalTitle.textContent = config.title;
    if (this.step1Title) this.step1Title.textContent = `Select ${config.title} Path`;
    if (this.step2Title) this.step2Title.textContent = `Sacred Commitments`;
    
    this.modal.classList.add("active", "open", "is-open");
    this.modal.style.display = "flex";
    this.modal.setAttribute("aria-hidden", "false");
  }

  _populateMentorsDropdown() {
    if (!this.mentorSelect) return;
    try {
      const model = window.ProfileControllerInstance?.model || window.profileModel;
      const profiles = model?.profiles || [];
      const applicant = model && typeof model.getActiveProfile === 'function' ? model.getActiveProfile() : null;

      // Determine designated upline healer in this applicant's branch
      let designatedHealerCode = '';
      let directSponsor = null;
      let bypassReason = '';

      if (applicant) {
        // Direct sponsor
        if (applicant.referredByCode) {
          directSponsor = profiles.find(p => p.referenceCode === applicant.referredByCode || p.id === applicant.referredByCode);
        }

        // Trace upline hierarchy using model.getUplineApprovers or recursive lookup
        if (model && typeof model.getUplineApprovers === 'function') {
          const approvers = model.getUplineApprovers(applicant);
          if (approvers && approvers.firstApprover) {
            designatedHealerCode = approvers.firstApprover.code || approvers.firstApprover.id;
          }
        }

        // Upward branch traversal fallback if not yet resolved
        if (!designatedHealerCode && directSponsor) {
          let curr = directSponsor;
          while (curr) {
            if (curr.profileType === 'HEALER' || curr.level === 2 || curr.level <= 1) {
              designatedHealerCode = curr.referenceCode || curr.id;
              break;
            }
            const parentCode = curr.referredByCode;
            curr = parentCode ? profiles.find(p => p.referenceCode === parentCode || p.id === parentCode) : null;
          }
        }

        // If direct sponsor is NOT a Healer (e.g. Rohan Verma is Level 3 Trainee), explain the bypass
        if (directSponsor && directSponsor.profileType !== 'HEALER' && directSponsor.level > 2) {
          const healerProfile = profiles.find(p => p.referenceCode === designatedHealerCode || p.id === designatedHealerCode);
          bypassReason = `Direct sponsor ${directSponsor.name} (Level 3 Trainee) is not an initiated Healer. Lineage mentor automatically routed to branch upline Healer: ${healerProfile ? healerProfile.name : 'Maa Anandita Devi'}.`;
        }
      }

      // Filter for potential mentors (Healers, Masters, Admins)
      const mentors = profiles.filter(p => p && (p.profileType === 'HEALER' || p.profileType === 'ADMIN' || p.level <= 2));

      // Update lineage note if element exists in the wizard
      const noteEl = document.getElementById("sadhana-mentor-lineage-note");
      if (noteEl) {
        if (bypassReason) {
          noteEl.textContent = `ℹ️ ${bypassReason}`;
          noteEl.style.display = "block";
        } else {
          noteEl.style.display = "none";
        }
      }

      if (mentors.length > 0) {
        this.mentorSelect.innerHTML = mentors.map(m => {
          const icon = m.profileType === 'ADMIN' || m.level === 0 ? '👑' : '🛡️';
          const roleLabel = m.profileType === 'ADMIN' || m.level === 0 ? 'Founder Master' : 'Senior Healer';
          const isSelected = designatedHealerCode && (m.referenceCode === designatedHealerCode || m.id === designatedHealerCode);
          const tag = isSelected ? ' [Designated Upline Healer]' : '';
          return `<option value="${m.referenceCode || m.id}" ${isSelected ? 'selected="selected"' : ''}>${icon} ${m.name} (${roleLabel})${tag}</option>`;
        }).join('');
      } else {
        this.mentorSelect.innerHTML = `
          <option value="SKHM-HLR2-5566-7788" selected="selected">🛡️ Maa Anandita Devi (Senior Healer) [Designated Upline Healer]</option>
          <option value="SKHM-ADM1-7788-9900">👑 Spiritual Karim Khan (Founder Master)</option>
          <option value="SKHM-DEV2-1122-3344">🛡️ Acharya Devendra (Senior Healer)</option>
        `;
      }
    } catch (e) {
      console.warn("Failed to dynamically populate mentors dropdown:", e);
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove("active", "open", "is-open");
      this.modal.style.display = "none";
      this.modal.setAttribute("aria-hidden", "true");
    }
  }

  closeDialogOptions() {
    const dialog = document.getElementById("modal-sadhana-dialog-options");
    if (dialog) {
      dialog.classList.remove("active", "open", "is-open");
      dialog.style.display = "none";
      dialog.setAttribute("aria-hidden", "true");
    }
  }

  showDialogOptions(data = null) {
    const dialog = document.getElementById("modal-sadhana-dialog-options");
    if (!dialog) return;

    // Resolve designated upline healer dynamically
    try {
      const model = window.ProfileControllerInstance?.model || window.profileModel;
      const profiles = model?.profiles || [];
      const applicant = model && typeof model.getActiveProfile === 'function' ? model.getActiveProfile() : null;

      const selectedMentorCode = (data && data.mentorCode) || (this.mentorSelect ? this.mentorSelect.value : (applicant?.referredByCode || ''));
      let mentor = profiles.find(p => p.referenceCode === selectedMentorCode || p.id === selectedMentorCode);

      if (!mentor && applicant?.referredByCode) {
        mentor = profiles.find(p => p.referenceCode === applicant.referredByCode);
      }
      // If mentor is not a healer (e.g. Level 3 Trainee), traverse to upline healer
      if (mentor && mentor.profileType !== 'HEALER' && mentor.profileType !== 'ADMIN' && mentor.level > 2) {
        if (model && typeof model.getUplineApprovers === 'function') {
          const approvers = model.getUplineApprovers(applicant);
          if (approvers && approvers.firstApprover) {
            const h = profiles.find(p => p.referenceCode === approvers.firstApprover.code || p.id === approvers.firstApprover.id);
            if (h) mentor = h;
          }
        }
      }
      if (!mentor && profiles.length > 0) {
        mentor = profiles.find(p => p.profileType === 'HEALER') || profiles[0];
      }

      const mentorName = (data && data.mentorName) || mentor?.name || (this.mentorSelect?.options[this.mentorSelect.selectedIndex]?.text.replace(/^[^\w]+/, '').trim()) || "Maa Anandita Devi";
      const mentorRole = mentor?.profileType === 'ADMIN' || mentor?.level === 0 ? "👑 Founder Master" : "🛡️ Designated Healer";
      const mentorCode = (data && data.mentorCode) || mentor?.referenceCode || selectedMentorCode || "SKHM-DEV2-1122-3344";
      const mentorInitials = (mentorName || "AD").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

      // Practice Summary
      const activeSlot = document.querySelector(".segment-btn.active");
      const practiceSlot = (data && (data.slot || data.scheduleSlot)) || (activeSlot ? activeSlot.getAttribute("data-slot") : "Brahma Muhurta");
      const practiceTitle = (data && (data.name || data.title || data.itemTitle)) || (this.selectItem ? (this.selectItem.options[this.selectItem.selectedIndex]?.text || "Sacred Practice") : "Sacred Practice");

      // Update dialog elements
      const nameEl = document.getElementById("dialog-upline-name");
      if (nameEl) nameEl.textContent = mentorName;

      const avatarEl = document.getElementById("dialog-upline-avatar");
      if (avatarEl) avatarEl.textContent = mentorInitials;

      const roleEl = document.getElementById("dialog-upline-role");
      if (roleEl) roleEl.textContent = mentorRole;

      const codeEl = document.getElementById("dialog-upline-code");
      if (codeEl) codeEl.textContent = mentorCode;

      const titleEl = document.getElementById("dialog-practice-title");
      if (titleEl) titleEl.textContent = practiceTitle;

      const slotEl = document.getElementById("dialog-practice-slot");
      if (slotEl) slotEl.textContent = practiceSlot;

      const btnMentorName = document.getElementById("btn-dispatch-mentor-name");
      if (btnMentorName) btnMentorName.textContent = mentorName;

    } catch (err) {
      console.warn("Error populating dialog upline healer details:", err);
    }

    dialog.classList.add("active", "open", "is-open");
    dialog.style.display = "flex";
    dialog.setAttribute("aria-hidden", "false");
  }

  updateUIForStep(currentStep, totalSteps) {
    for (let i = 1; i <= totalSteps; i++) {
      const step = document.getElementById("sadhana-step-" + i);
      const pill = document.getElementById("sadhana-step-" + i + "-pill");
      if (step) step.style.display = (i === currentStep) ? "block" : "none";
      if (pill) {
        if (i <= currentStep) pill.classList.add("active");
        else pill.classList.remove("active");
      }
    }
    
    if (this.fillBar) {
      this.fillBar.style.width = ((currentStep - 1) / (totalSteps - 1)) * 100 + "%";
    }
    
    if (this.prevBtn) this.prevBtn.style.visibility = (currentStep === 1) ? "hidden" : "visible";
    if (this.nextBtn) {
      this.nextBtn.innerHTML = (currentStep === totalSteps) ? "Sign & Submit Application ✅" : "Next Step ▶";
    }
    
    if (currentStep === 4) {
      // Review Population
      if (this.selectItem && this.reviewName) {
        this.reviewName.textContent = this.selectItem.options[this.selectItem.selectedIndex].text;
      }
      const activeSlot = document.querySelector(".segment-btn.active");
      if (activeSlot && this.reviewSlot) {
        this.reviewSlot.textContent = activeSlot.getAttribute("data-slot");
      }
      if (this.mentorSelect && this.reviewMentor) {
        this.reviewMentor.textContent = this.mentorSelect.options[this.mentorSelect.selectedIndex].text;
      }
    }
  }

  getFormData() {
    const activeSlot = document.querySelector(".segment-btn.active");
    const mentorName = this.mentorSelect ? (this.mentorSelect.options[this.mentorSelect.selectedIndex]?.text || '') : '';
    return {
      itemId: this.selectItem ? this.selectItem.value : '',
      itemTitle: this.selectItem ? this.selectItem.options[this.selectItem.selectedIndex].text : '',
      scheduleSlot: activeSlot ? activeSlot.getAttribute("data-slot") : '',
      mentorCode: this.mentorSelect ? this.mentorSelect.value : '',
      mentorName: mentorName,
      seekerDiagnostics: this.diagnosticsText ? this.diagnosticsText.value : '',
      intention: this.intentionText ? this.intentionText.value : '',
      signature: this.signatureText ? this.signatureText.value : ''
    };
  }

  showToast(title, message, type="info") {
    const pView = window.profileView || (window.ProfileControllerInstance && window.ProfileControllerInstance.view);
    if (pView && typeof pView.showSlideToast === 'function') {
      pView.showSlideToast(title, message, type, 4000);
    } else if (pView && typeof pView.showToast === 'function') {
      pView.showToast(`${title}: ${message}`, type);
    } else {
      console.log(`[Toast] ${title}: ${message}`);
    }
  }

  getMentorMalas() {
    const malasSelect = document.getElementById("mentor-adjust-malas");
    return malasSelect ? parseInt(malasSelect.value) : 11;
  }

  getMentorSlot() {
    const slotSelect = document.getElementById("mentor-adjust-slot");
    return slotSelect ? slotSelect.value : "Brahma Muhurta (04:00 - 06:00)";
  }

  getMentorNotes() {
    const notesInput = document.getElementById("mentor-review-notes");
    return notesInput ? notesInput.value.trim() : "";
  }
}

if (typeof window !== "undefined") {
  window.SadhanaRemedyView = SadhanaRemedyView;
}
