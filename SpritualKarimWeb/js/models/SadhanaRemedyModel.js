class SadhanaRemedyModel {
  constructor(appModel) {
    this.appModel = appModel; // Reference to ProfileModel for cross-data access
    this.config = (window.appConfig && window.appConfig.sk_sadhana_remedy_config) || {};
  }

  getConfig(contextType) {
    let conf = null;
    if (contextType === 'sadhana') conf = this.config.sadhana;
    if (contextType === 'remedy') conf = this.config.remedy;
    if (!conf) return null;
    
    // Single Source of Truth: Dynamically inject items from the Master Catalog
    if (this.appModel && typeof this.appModel.getSadhanaCatalog === "function") {
      const catalog = this.appModel.getSadhanaCatalog();
      if (catalog) {
        // Map the full dynamic catalog to the dropdown format
        const dynamicItems = Object.values(catalog).map(c => ({
          id: c.id,
          name: c.title,
          minIntentLength: 10
        }));
        
        if (dynamicItems.length > 0) {
          // Shallow copy to override hardcoded appConfig items dynamically
          conf = { ...conf, items: dynamicItems };
        }
      }
    }
    
    return conf;
  }

  createApplication(contextType, formData = {}) {
    const activeProfile = (this.appModel && typeof this.appModel.getActiveProfile === "function")
      ? this.appModel.getActiveProfile()
      : (this.appModel?.activeProfile || this.appModel?.profiles?.[0] || {});
    const conf = this.getConfig(contextType);

    const isApplicantAdmin = activeProfile && (
      (activeProfile.profileType && activeProfile.profileType.toUpperCase().includes("ADMIN")) ||
      (activeProfile.profileType && activeProfile.profileType.toUpperCase().includes("MASTER")) ||
      activeProfile.name === "Spiritual Karim Khan"
    );

    const seekerName = formData.applicantName || formData.seekerName || activeProfile.name || "Unknown Applicant";
    const seekerId = formData.applicantId || formData.seekerId || activeProfile.id || `req-${Date.now()}`;
    const devoteeCode = formData.devoteeCode || activeProfile.referenceCode || "SKHM-0000";
    const seekerPhone = formData.seekerPhone || activeProfile.phone || "+91 00000 00000";
    const seekerLevel = !isApplicantAdmin ? (activeProfile.profileType ? `${activeProfile.profileType} (Level ${activeProfile.level || 4})` : "Devotee (Level 4)") : "Devotee (Level 4)";
    
    const payload = {
      id: `${contextType}-req-${Date.now().toString(36)}`,
      type: conf.type || (contextType === 'remedy' ? "REMEDY_APPLICATION" : "SADHANA_APPLICATION"),
      contextType: contextType,
      seekerId: seekerId,
      seekerName: seekerName,
      devoteeCode: devoteeCode,
      seekerPhone: seekerPhone,
      seekerLevel: seekerLevel,
      itemId: formData.itemId || (conf.items && conf.items[0] ? conf.items[0].id : "sadhana-navarna"),
      itemTitle: formData.itemTitle || (conf.items && conf.items[0] ? conf.items[0].name : "Sacred Practice"),
      category: conf.title || (contextType === 'remedy' ? "Remedy & Upay" : "Sacred Sadhana"),
      scheduleSlot: formData.scheduleSlot || conf.defaultSlot || "Brahma Muhurta (04:00 - 06:00)",
      
      // Dynamic 2-tier Upline Approver Resolution
      ...(() => {
        if (this.appModel && typeof this.appModel.getUplineApprovers === "function") {
          const upline = this.appModel.getUplineApprovers(activeProfile.referenceCode ? activeProfile : (devoteeCode || seekerId));
          const first = upline.firstApprover || upline.directSponsor;
          const second = upline.secondApprover;
          return {
            mentorCode: first.code,
            mentorName: first.name,
            sponsorCode: upline.directSponsor.code,
            firstApproverCode: first.code,
            firstApproverName: first.name,
            firstApproverRole: first.role || "HEALER",
            firstApproverStatus: "PENDING",
            secondApproverCode: second.code,
            secondApproverName: second.name,
            secondApproverRole: "MASTER",
            secondApproverStatus: "PENDING",
            approvalStage: 1
          };
        }
        return {
          mentorCode: formData.mentorCode || activeProfile.referredByCode || "SKHM-ADM1-7788-9900",
          mentorName: formData.mentorName ? formData.mentorName.replace(/^[^\w\s]+/, '').split('(')[0].trim() : (activeProfile.referredByName || "Shri Karim Ji"),
          firstApproverCode: "SKHM-HLR2-5566-7788",
          firstApproverName: "Maa Anandita Devi",
          secondApproverCode: "SKHM-ADM1-7788-9900",
          secondApproverName: "Spiritual Karim Khan",
          approvalStage: 1
        };
      })(),

      targetMalas: conf.defaultMalas || 11,
      cycleDays: formData.cycleDays || 21,
      intention: formData.intention || "Spiritual upliftment and household harmony.",
      seekerDiagnostics: formData.seekerDiagnostics || {},
      commitments: ["Strict Sattvic Diet", "Daily Diya Practice", "Brahmacharya During Cycle", "Digital Oath Signed"],
      signature: formData.signature || seekerName,
      date: new Date().toISOString(),
      createdAtMs: Date.now(),
      expiresAtMs: Date.now() + (24 * 3600 * 1000),
      status: "PENDING"
    };

    return payload;
  }

  deleteApplication(applicationId) {
    try {
      let apps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]");
      const appIndex = apps.findIndex(a => a.id === applicationId);
      if (appIndex !== -1) {
        apps[appIndex].status = "DELETED";
        apps[appIndex].deletedAtMs = Date.now();
        localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps));
      }

      if (this.appModel && typeof this.appModel.deleteSadhanaRemedyApplication === "function") {
        this.appModel.deleteSadhanaRemedyApplication(applicationId);
      } else if (this.appModel && typeof this.appModel.deletePairingInvite === "function") {
        this.appModel.deletePairingInvite(applicationId);
      }

      if (typeof BroadcastChannel !== "undefined") {
        const chan = new BroadcastChannel("spiritual_karim_sync");
        chan.postMessage({ type: "SADHANA_APPLICATION_DELETED", data: { appId: applicationId } });
        chan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED" });
      }
      return true;
    } catch(e) {
      return false;
    }
  }

  restoreApplication(applicationId) {
    try {
      let apps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]");
      const appIndex = apps.findIndex(a => a.id === applicationId);
      if (appIndex !== -1) {
        apps[appIndex].status = "PENDING";
        delete apps[appIndex].deletedAtMs;
        localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps));
      }
      if (this.appModel && typeof this.appModel.restoreSadhanaRemedyApplication === "function") {
        this.appModel.restoreSadhanaRemedyApplication(applicationId);
      }
      
      if (typeof BroadcastChannel !== "undefined") {
        const chan = new BroadcastChannel("spiritual_karim_sync");
        chan.postMessage({ type: "SADHANA_APPLICATION_RESTORED", data: { appId: applicationId } });
        chan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED" });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async submitApplication(payload) {
    // 1. Submit through ProfileModel if available (Single Source of Truth)
    if (this.appModel && typeof this.appModel.submitSadhanaRemedyApplication === "function") {
      this.appModel.submitSadhanaRemedyApplication(payload);
    } else {
      try {
        const apps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]");
        apps.unshift(payload);
        localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps));
      } catch (e) {}

      // Broadcast for real-time tab sync
      if (typeof BroadcastChannel !== "undefined") {
        try {
          const chan = new BroadcastChannel("spiritual_karim_sync");
          chan.postMessage({ type: "NEW_PENDING_APPROVAL", data: payload, invite: payload });
          chan.postMessage({ type: "NEW_SADHANA_APPLICATION", data: payload, invite: payload });
          chan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED" });
        } catch (e) {}
      }
    }

    // 4. Backend HTTP API integration
    try {
      await fetch('/api/sadhana/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch(e) {
      console.warn("Backend sadhana/remedy apply failed, relying on local sync.", e);
    }

    return true;
  }

  checkEligibility(profile) {
    if (!profile) return { eligible: false, reason: "Profile not found." };
    // Relaxed for backward compatibility in dev but enforce the rule
    const level = profile.level || 4;
    if (level < 4 && profile.role !== "admin" && profile.role !== "master") {
      return { eligible: false, reason: "Must be a Devotee Level 4 or higher to apply." };
    }
    const diyaDays = profile.diyaDays || 0;
    if (diyaDays < 14) {
      return { eligible: false, reason: `14-day Diya Foundation incomplete. Current days: ${diyaDays}/14.` };
    }
    return { eligible: true, reason: "Foundation Verified." };
  }

  approveApplication(applicationId, malas, slot, notes, mentorCode) {
    if (this.appModel && typeof this.appModel.approveSadhanaRemedyApplication === "function") {
      return this.appModel.approveSadhanaRemedyApplication(applicationId, notes, malas, slot);
    }
    try {
      const apps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]");
      const appIndex = apps.findIndex(a => a.id === applicationId);
      if (appIndex === -1) return false;
      
      const application = apps[appIndex];
      application.status = "APPROVED";
      application.targetMalas = malas;
      application.scheduleSlot = slot;
      application.mentorNotes = notes;
      application.approvedBy = mentorCode;
      
      // Stage 4: Cryptographic Token Minting
      const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
      const prefix = application.contextType === 'remedy' ? 'IN-REMD-' : 'IN-SADH-';
      const initiationToken = prefix + hash;
      application.token = initiationToken;
      application.initiationToken = initiationToken;
      
      apps[appIndex] = application;
      localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps));
      
      if (typeof BroadcastChannel !== "undefined") {
        const chan = new BroadcastChannel("spiritual_karim_sync");
        chan.postMessage({ type: "SADHANA_INITIATION_APPROVED", data: application });
        chan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED" });
      }
      
      // Sync with backend API
      try {
        fetch('/api/sadhana/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: applicationId, status: 'APPROVED', notes, adjustedMalas: malas, adjustedSlot: slot })
        });
      } catch (e) {
        console.warn("Backend sadhana approve failed, relying on local sync.", e);
      }
      
      return application;
    } catch(e) {
      console.error(e);
      return false;
    }
  }

  rejectApplication(applicationId, reason, mentorCode) {
    if (this.appModel && typeof this.appModel.rejectSadhanaRemedyApplication === "function") {
      return this.appModel.rejectSadhanaRemedyApplication(applicationId, reason);
    }
    try {
      const apps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]");
      const appIndex = apps.findIndex(a => a.id === applicationId);
      if (appIndex === -1) return false;
      
      apps[appIndex].status = "REJECTED";
      apps[appIndex].mentorNotes = reason;
      apps[appIndex].approvedBy = mentorCode;
      
      localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps));
      
      if (typeof BroadcastChannel !== "undefined") {
        const chan = new BroadcastChannel("spiritual_karim_sync");
        chan.postMessage({ type: "SADHANA_APPLICATION_REJECTED", data: apps[appIndex] });
        chan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED" });
      }
      
      // Sync with backend API
      try {
        fetch('/api/sadhana/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: applicationId, status: 'REJECTED', notes: reason })
        });
      } catch (e) {
        console.warn("Backend sadhana reject failed, relying on local sync.", e);
      }
      
      return apps[appIndex];
    } catch(e) { return false; }
  }

  requestRevision(applicationId, notes, mentorCode) {
    if (this.appModel && typeof this.appModel.requestRevisionSadhanaRemedy === "function") {
      return this.appModel.requestRevisionSadhanaRemedy(applicationId, notes);
    }
    try {
      const apps = JSON.parse(localStorage.getItem("sk_sadhana_initiations_v1") || "[]");
      const appIndex = apps.findIndex(a => a.id === applicationId);
      if (appIndex === -1) return false;
      
      apps[appIndex].status = "REVISION_REQUIRED";
      apps[appIndex].mentorNotes = notes;
      apps[appIndex].approvedBy = mentorCode;
      
      localStorage.setItem("sk_sadhana_initiations_v1", JSON.stringify(apps));
      
      if (typeof BroadcastChannel !== "undefined") {
        const chan = new BroadcastChannel("spiritual_karim_sync");
        chan.postMessage({ type: "SADHANA_REVISION_REQUESTED", data: apps[appIndex] });
        chan.postMessage({ type: "SADHANA_APPLICATIONS_UPDATED" });
      }
      
      // Sync with backend API
      try {
        fetch('/api/sadhana/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: applicationId, status: 'REVISION_REQUIRED', notes })
        });
      } catch (e) {
        console.warn("Backend sadhana revision failed, relying on local sync.", e);
      }
      
      return apps[appIndex];
    } catch(e) { return false; }
  }

  logDailyPractice(tokenId, beadCount) {
    try {
      const logs = JSON.parse(localStorage.getItem("sk_sadhana_telemetry") || "{}");
      if (!logs[tokenId]) logs[tokenId] = { history: [], currentStreak: 0, lastLogMs: 0 };
      
      const nowMs = Date.now();
      const lastLogMs = logs[tokenId].lastLogMs;
      
      if (lastLogMs > 0 && (nowMs - lastLogMs > 28 * 3600 * 1000)) {
        logs[tokenId].status = "LAPSE_DETECTED";
        this.evaluatePrayaschitta(tokenId);
      }
      
      logs[tokenId].history.push({ date: new Date().toISOString(), beadCount: beadCount });
      logs[tokenId].currentStreak += 1;
      logs[tokenId].lastLogMs = nowMs;
      
      localStorage.setItem("sk_sadhana_telemetry", JSON.stringify(logs));

      // Broadcast that progress was logged locally
      if (typeof BroadcastChannel !== "undefined") {
        const chan = new BroadcastChannel("spiritual_karim_sync");
        chan.postMessage({ type: "PROGRESS_SUBMITTED", tokenId, beadCount });
      }

      // Sync with backend API (Pending Review Loop)
      const prof = this.appModel ? this.appModel.getActiveProfile() : null;
      if (prof) {
        try {
          fetch('/api/sadhana/remedy-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              seekerId: prof.id,
              sadhanaId: tokenId,
              malasCompleted: Math.floor(beadCount / 108) || 1,
              date: new Date().toISOString()
            })
          });
        } catch(e) {
          console.warn("Backend telemetry sync failed", e);
        }
      }

      return logs[tokenId];
    } catch(e) { return false; }
  }

  approveProgressSubmission(seekerId, sadhanaId, submissionId, healerCode) {
    try {
      fetch('/api/sadhana/remedy-progress/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seekerId, sadhanaId, submissionId, healerCode })
      }).then(res => res.json()).then(data => {
        if (data.success && typeof BroadcastChannel !== "undefined") {
          const chan = new BroadcastChannel("spiritual_karim_sync");
          chan.postMessage({ type: "PROGRESS_APPROVED", data: data.data });
        }
      });
      return true;
    } catch(e) {
      console.warn("Backend progress approval failed", e);
      return false;
    }
  }

  evaluatePrayaschitta(tokenId) {
    if (typeof BroadcastChannel !== "undefined") {
      const chan = new BroadcastChannel("spiritual_karim_sync");
      chan.postMessage({ type: "PRAYASCHITTA_PRESCRIBED", tokenId: tokenId, penaltyMalas: 3, message: "Minor lapse detected. 3 compensatory malas prescribed." });
    }
  }
}

if (typeof window !== "undefined") {
  window.SadhanaRemedyModel = SadhanaRemedyModel;
}
