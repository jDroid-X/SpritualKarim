class SadhanaRemedyController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.currentStep = 1;
    this.contextType = 'sadhana'; // Default to sadhana, can be 'remedy'
  }

  openWizard(contextType = 'sadhana') {
    return this.initiateFlow(contextType);
  }

  initiateFlow(contextType = 'sadhana') {
    // Stage 0: Prerequisite Gate & Advisory
    const activeProfile = (this.model && this.model.appModel && typeof this.model.appModel.getActiveProfile === "function") 
      ? this.model.appModel.getActiveProfile() 
      : (this.model?.appModel?.profiles?.[0] || null);

    if (activeProfile && this.model && typeof this.model.checkEligibility === "function") {
      const eligibility = this.model.checkEligibility(activeProfile);
      if (!eligibility.eligible && eligibility.reason.includes("Diya")) {
        if (this.view && typeof this.view.showToast === "function") {
          this.view.showToast("Diya Advisory", eligibility.reason, "info");
        }
      }
    }

    this.contextType = contextType;
    this.currentStep = 1;
    const config = this.model.getConfig(contextType);
    if (!config) {
      console.error(`Config not found for context: ${contextType}`);
      return;
    }
    
    this.view.openModal(config);
    this.view.updateUIForStep(this.currentStep, this.view.totalSteps);
  }

  handleNext() {
    if (this.currentStep === 1) {
      this.currentStep++;
      this.view.updateUIForStep(this.currentStep, this.view.totalSteps);
    } else if (this.currentStep === 2) {
      this.currentStep++;
      this.view.updateUIForStep(this.currentStep, this.view.totalSteps);
    } else if (this.currentStep === 3) {
      this.currentStep++;
      this.view.updateUIForStep(this.currentStep, this.view.totalSteps);
    } else if (this.currentStep === 4) {
      this.view.closeModal();
      this.view.showDialogOptions();
    }
  }

  handlePrev() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.view.updateUIForStep(this.currentStep, this.view.totalSteps);
    }
  }

  closeModal() {
    this.view.closeModal();
  }

  async submitFinal() {
    this.view.closeDialogOptions();
    
    const formData = this.view.getFormData();
    const payload = this.model.createApplication(this.contextType, formData);
    
    await this.model.submitApplication(payload);
    
    this.view.showToast("Application Submitted", `Your ${this.contextType} request has been sent.`, "success");
  }

  saveDraft() {
    this.view.closeDialogOptions();
    this.view.showToast("Draft Saved", "Your application has been saved locally.", "info");
  }

  reopenModal() {
    this.view.closeDialogOptions();
    const config = this.model.getConfig(this.contextType);
    this.view.openModal(config);
  }

  // Stage 3 Mentor Action Gates (SSOST Integration)
  handleMentorApprove(applicationId) {
    const mentorCode = this.model.appModel ? this.model.appModel.profiles[0]?.referenceCode : "SKHM-ADM";
    const malas = this.view.getMentorMalas() || 11;
    const slot = this.view.getMentorSlot() || "Brahma Muhurta (04:00 - 06:00)";
    const notes = this.view.getMentorNotes() || "";
    
    let approved = null;
    if (this.model.appModel && typeof this.model.appModel.approveSadhanaRemedyApplication === "function") {
      approved = this.model.appModel.approveSadhanaRemedyApplication(applicationId, notes, malas, slot);
    } else {
      approved = this.model.approveApplication(applicationId, malas, slot, notes, mentorCode);
    }

    if (approved) {
      this.view.showToast("Deeksha Granted", `Token ${approved.initiationToken || approved.token} generated.`, "success");
      if (typeof window.profileView !== 'undefined' && window.profileView.renderSadhanaQueueTab) {
         window.profileView.renderSadhanaQueueTab();
      }
    }
  }

  handleMentorReject(applicationId) {
    const mentorCode = this.model.appModel ? this.model.appModel.profiles[0]?.referenceCode : "SKHM-ADM";
    const notes = this.view.getMentorNotes() || "Does not meet requirements.";
    
    let rejected = null;
    if (this.model.appModel && typeof this.model.appModel.rejectSadhanaRemedyApplication === "function") {
      rejected = this.model.appModel.rejectSadhanaRemedyApplication(applicationId, notes);
    } else {
      rejected = this.model.rejectApplication(applicationId, notes, mentorCode);
    }

    if (rejected) {
      this.view.showToast("Application Rejected", "The request has been declined.", "error");
      if (typeof window.profileView !== 'undefined' && window.profileView.renderSadhanaQueueTab) {
         window.profileView.renderSadhanaQueueTab();
      }
    }
  }

  handleMentorRevision(applicationId) {
    const mentorCode = this.model.appModel ? this.model.appModel.profiles[0]?.referenceCode : "SKHM-ADM";
    const notes = this.view.getMentorNotes() || "Please revise your intention.";
    
    let revision = null;
    if (this.model.appModel && typeof this.model.appModel.requestRevisionSadhanaRemedy === "function") {
      revision = this.model.appModel.requestRevisionSadhanaRemedy(applicationId, notes);
    } else {
      revision = this.model.requestRevision(applicationId, notes, mentorCode);
    }

    if (revision) {
      this.view.showToast("Revision Requested", "Sent back to devotee for adjustment.", "info");
      if (typeof window.profileView !== 'undefined' && window.profileView.renderSadhanaQueueTab) {
         window.profileView.renderSadhanaQueueTab();
      }
    }
  }
}

if (typeof window !== "undefined") {
  window.SadhanaRemedyController = SadhanaRemedyController;
}
