/**
 * ProfileController.js
 * Master 4-Tier OOPS-based MVC Controller Layer for Spiritual Karim
 */
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
    this._bindEvents();

    window.addEventListener('online', () => {
      this.model.flushOfflineSyncQueue();
      this.view.showToast('📶 Online connection restored. Telemetry synced.');
    });
  }

  // ==========================================
  // Device OS Theme Management (Auto / Dark / Light)
  // ==========================================
  _initTheme() {
    const savedTheme = localStorage.getItem('sk_theme_preference') || 'auto';
    this._applyTheme(savedTheme, false);

    // Dynamic listener for OS theme preference changes
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        const currentPref = localStorage.getItem('sk_theme_preference') || 'auto';
        if (currentPref === 'auto') {
          this._applyTheme('auto', false);
        }
      });
    } catch (err) {
      console.warn('MatchMedia listener error', err);
    }
  }

  _applyTheme(pref, showToast = false) {
    localStorage.setItem('sk_theme_preference', pref);
    let resolvedTheme = pref;
    if (pref === 'auto') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', resolvedTheme);

    if (this.view.themeIcon && this.view.themeLabel) {
      if (pref === 'auto') {
        this.view.themeIcon.textContent = '💻';
        this.view.themeLabel.textContent = `Auto (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`;
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title = `Theme: Auto (Device OS: ${resolvedTheme === 'dark' ? 'Dark' : 'Light'}) | Click to change`;
        }
      } else if (pref === 'dark') {
        this.view.themeIcon.textContent = '🌙';
        this.view.themeLabel.textContent = 'Dark';
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title = 'Theme: Dark Mode | Click to change';
        }
      } else {
        this.view.themeIcon.textContent = '☀️';
        this.view.themeLabel.textContent = 'Light';
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title = 'Theme: Light Mode | Click to change';
        }
      }
    }

    if (showToast) {
      this.view.showToast(`🎨 Theme switched to: ${pref.toUpperCase()}`);
    }
  }

  _cycleTheme() {
    const current = localStorage.getItem('sk_theme_preference') || 'auto';
    const sequence = ['auto', 'dark', 'light'];
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
    this.view.applyDynamicAuthMatrix(this.model.getAuthMatrix(), roleMode);
    this._filterRemedies();
  }

  _filterRemedies() {
    const searchInput = document.getElementById('input-search-remedies');
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const activeSeg = document.querySelector('.segmented-control[data-target-section="remedies"] .segmented-item.active');
    const filterMode = activeSeg ? (activeSeg.getAttribute('data-filter') || 'ALL') : 'ALL';

    const remedyCards = document.querySelectorAll('.remedy-card-option');
    let matchCount = 0;

    remedyCards.forEach(card => {
      const titleEl = card.querySelector('.option-title');
      const tagEl = card.querySelector('.option-tag');
      const sadhanaId = card.getAttribute('data-sadhana-id') || '';
      const catalogItem = SADHANA_CATALOG[sadhanaId] || {};

      const textContent = `${titleEl ? titleEl.textContent : ''} ${tagEl ? tagEl.textContent : ''} ${catalogItem.summary || ''} ${catalogItem.mantra || ''}`.toLowerCase();
      const isPaid = card.classList.contains('tile-paid') || card.querySelector('.stamp-paid') !== null;

      const matchesSearch = query === '' || textContent.includes(query);
      const matchesFilter = filterMode === 'ALL' || (filterMode === 'PAID' && isPaid) || (filterMode === 'FREE' && !isPaid);

      if (matchesSearch && matchesFilter) {
        card.style.display = '';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Also manage category group headers visibility if all cards inside are hidden
    document.querySelectorAll('.remedy-category-group').forEach(group => {
      const visibleCards = group.querySelectorAll('.remedy-card-option:not([style*="display: none"])');
      group.style.display = visibleCards.length > 0 ? '' : 'none';
    });
  }

  switchMainTab(tabId) {
    const allTabBtns = document.querySelectorAll('.main-tab-btn');
    const allPanels = document.querySelectorAll('.main-tab-content-panel');

    allTabBtns.forEach(btn => {
      if (btn.getAttribute('data-main-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    allPanels.forEach(p => {
      if (p.id === tabId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    if (tabId === 'tab-firebase-data') {
      this.view.renderFirebaseDataTable(this.model);
    }
    if (tabId === 'tab-genealogy-tree') {
      const activeProf = this.model.getActiveProfile();
      this.view.renderInBodyHierarchyTree(this.model.profiles, null, '', this.view.inBodyTreePanState?.layoutMode || 'cluster');
      if (typeof this.view.renderRespectiveTreeSection === 'function') {
        this.view.renderRespectiveTreeSection(activeProf, this.model.profiles);
      }
      setTimeout(() => {
        if (typeof this.view.smartFitInBodyTree === 'function') {
          this.view.smartFitInBodyTree();
        }
      }, 100);
    }
  }

  _bindNavigationTabs() {
    // Delegated click on any .main-tab-btn (including Box 1 Header 3rd Column Genealogy Tab and lower 4 nav bar tabs)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.main-tab-btn');
      if (btn) {
        const tabId = btn.getAttribute('data-main-tab');
        if (tabId) {
          this.switchMainTab(tabId);
        }
      }

      // Sub-tab button switching
      const subBtn = e.target.closest('.sub-tab-btn');
      if (subBtn) {
        const subTabId = subBtn.getAttribute('data-sub-tab');
        const parentPanel = subBtn.closest('.main-tab-content-panel');
        if (parentPanel && subTabId) {
          parentPanel.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
          subBtn.classList.add('active');
          parentPanel.querySelectorAll('.sub-tab-panel').forEach(p => {
            if (p.id === subTabId) p.classList.add('active');
            else p.classList.remove('active');
          });
        }
      }
    });
  }

  _bindSadhanaCatalogEvents() {
    // 1. Delegated Click on Sadhana/Remedy Card Option / Eye Trigger -> Open Slide-out Drawer
    document.addEventListener('click', (e) => {
      const eyeBtn = e.target.closest('.btn-sadhana-info-trigger');
      if (eyeBtn) {
        const sadhanaKey = eyeBtn.getAttribute('data-sadhana-id');
        if (sadhanaKey) {
          this.view.openSadhanaDrawer(sadhanaKey);
          return;
        }
      }

      // Universal Stamp Toggle on any tile
      const stampToggleBtn = e.target.closest('.btn-tile-stamp-toggle');
      if (stampToggleBtn) {
        e.stopPropagation();
        const itemId = stampToggleBtn.getAttribute('data-item-id');
        const sadhanaId = stampToggleBtn.getAttribute('data-sadhana-id');
        const profile = this.model.getActiveProfile();

        if (itemId && profile.traineeSadhanas) {
          const item = profile.traineeSadhanas.find(ts => ts.id === itemId);
          if (item) {
            const currentPaid = item.isPaid !== false && item.paymentStatus !== 'FREE';
            item.isPaid = !currentPaid;
            item.paymentStatus = item.isPaid ? 'PAID' : 'FREE';
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast(`"${item.title}" stamp set to: ${item.paymentStatus === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
            return;
          }
        }

        if (sadhanaId) {
          const item = (profile.interestedSadhanas || []).find(is => is.id === sadhanaId);
          if (item) {
            const currentPaid = item.isPaid !== false && item.paymentStatus !== 'FREE';
            item.isPaid = !currentPaid;
            item.paymentStatus = item.isPaid ? 'PAID' : 'FREE';
          }
          // Also sync with trainee sadhanas
          const tItem = (profile.traineeSadhanas || []).find(ts => ts.sadhanaKey === sadhanaId || ts.id === sadhanaId);
          if (tItem) {
            const currentPaid = tItem.isPaid !== false && tItem.paymentStatus !== 'FREE';
            tItem.isPaid = !currentPaid;
            tItem.paymentStatus = tItem.isPaid ? 'PAID' : 'FREE';
          }
          this.model.saveProfiles(this.model.profiles);
          this.view._renderInterestedSadhanas(profile.interestedSadhanas || []);
          this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas || []);
          this.view._updateJSONPreview(profile);
          this.view.showToast(`Tile stamp set to: ${(item?.paymentStatus || tItem?.paymentStatus) === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
          return;
        }
      }

      // Trainee Tile Selection -> Displays in Right Panel
      const traineeTile = e.target.closest('.trainee-card-tile');
      if (traineeTile && !e.target.closest('.tile-actions-vertical')) {
        const itemId = traineeTile.getAttribute('data-item-id');
        if (itemId) {
          this.view.selectedTraineeId = itemId;
          const p = this.model.getActiveProfile();
          this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas || []);
          return;
        }
      }

      // Catalog Remedy card click (open ritual drawer)
      const remedyCard = e.target.closest('.remedy-card-option');
      if (remedyCard && !e.target.closest('.tile-actions-vertical')) {
        const sadhanaKey = remedyCard.getAttribute('data-sadhana-id');
        if (sadhanaKey) {
          this.view.openSadhanaDrawer(sadhanaKey);
        }
      }
    });

    // Close Sadhana Drawer
    const btnCloseDrawer = document.getElementById('btn-close-sadhana-drawer');
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => this.view.closeSadhanaDrawer());
    const drawerBackdrop = document.getElementById('sadhana-drawer-backdrop');
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => this.view.closeSadhanaDrawer());

    // 2. Checkbox change: Ticking auto-syncs into Trainee Sadhak In-Progress
    document.addEventListener('change', (e) => {
      if (e.target && e.target.name === 'remedy-checkbox') {
        const cb = e.target;
        const key = cb.value;
        const isChecked = cb.checked;

        // Synchronize all checkboxes with this value across the DOM
        document.querySelectorAll(`input[name="remedy-checkbox"][value="${key}"]`).forEach(c => {
          c.checked = isChecked;
        });

        const profile = this.model.getActiveProfile();
        if (!profile.selectedRemedies) profile.selectedRemedies = [];
        if (!profile.interestedSadhanas) profile.interestedSadhanas = [];
        if (!profile.traineeSadhanas) profile.traineeSadhanas = [];

        const catalogItem = SADHANA_CATALOG[key] || { id: key, title: key, category: 'Sadhana', domain: 'sadhanas' };

        if (isChecked) {
          if (!profile.selectedRemedies.includes(key)) {
            profile.selectedRemedies.push(key);
          }
          const existing = profile.interestedSadhanas.find(is => is.id === key || is.name === catalogItem.title);
          if (!existing) {
            profile.interestedSadhanas.push({
              id: key,
              name: catalogItem.title,
              category: catalogItem.category,
              priority: 'High',
              status: 'Enrolled',
              isPaid: profile.isPaid !== false && profile.paymentStatus !== 'FREE',
              paymentStatus: profile.isPaid !== false && profile.paymentStatus !== 'FREE' ? 'PAID' : 'FREE'
            });
          }

          // Auto-sync into Trainee Sadhak In-Progress
          const traineeExisting = profile.traineeSadhanas.find(ts => ts.sadhanaKey === key || (ts.id && ts.id === key) || ts.title.toLowerCase() === catalogItem.title.toLowerCase());
          if (!traineeExisting) {
            const newTraineeItem = {
              id: 'ts-' + Date.now().toString().slice(-4),
              sadhanaKey: key,
              title: catalogItem.title,
              categoryDomain: catalogItem.domain || 'sadhanas',
              isPaid: profile.isPaid !== false && profile.paymentStatus !== 'FREE',
              paymentStatus: profile.isPaid !== false && profile.paymentStatus !== 'FREE' ? 'PAID' : 'FREE',
              level: 'Level 1 — Novice Initiation',
              dailyTarget: catalogItem.domain === 'remedies' ? 'Daily Sunset Protocol' : (catalogItem.domain === 'cleansing' ? 'Morning / Dusk Routine' : '11 Malas Daily'),
              currentStreak: '1 Day',
              progressPercent: 20,
              status: 'In Progress',
              mentorCode: profile.referredByCode || 'SKHM-ADM1-7788-9900',
              diaryNotes: `Attunement active. Timing: ${catalogItem.timing || 'Brahma Muhurta'}. Mantra: ${catalogItem.mantra || 'Om Namah Shivaya'}`,
              memos: [
                {
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  author: 'Mentor Devendra',
                  text: `Enrolled into ${catalogItem.title}. Timing: ${catalogItem.timing || 'Daily'}. Mantra frequency synchronized.`
                }
              ]
            };
            profile.traineeSadhanas.push(newTraineeItem);
            this.view.selectedTraineeId = newTraineeItem.id;
          } else {
            this.view.selectedTraineeId = traineeExisting.id;
          }

          this.view.showToast(`✓ "${catalogItem.title}" enrolled & added to Trainee In-Progress!`);
        } else {
          profile.selectedRemedies = profile.selectedRemedies.filter(k => k !== key);
          profile.interestedSadhanas = profile.interestedSadhanas.filter(is => is.id !== key && is.name !== catalogItem.title);
          this.view.showToast(`Removed "${catalogItem.title}" from Enrolled Queue.`);
        }

        this.model.saveProfiles(this.model.profiles);
        this.view._renderInterestedSadhanas(profile.interestedSadhanas);
        this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
        this.view._updateJSONPreview(profile);
      }

      // Trainee item checkbox change in Trainee left panel
      if (e.target && e.target.classList.contains('trainee-item-checkbox')) {
        const itemId = e.target.getAttribute('data-item-id');
        const profile = this.model.getActiveProfile();
        if (!e.target.checked && itemId) {
          if (confirm('Remove this sadhana from active In-Progress list?')) {
            const item = profile.traineeSadhanas.find(ts => ts.id === itemId);
            if (item) {
              const key = item.sadhanaKey || item.id;
              profile.selectedRemedies = (profile.selectedRemedies || []).filter(k => k !== key);
              profile.interestedSadhanas = (profile.interestedSadhanas || []).filter(is => is.id !== key && is.name !== item.title);
            }
            profile.traineeSadhanas = profile.traineeSadhanas.filter(ts => ts.id !== itemId);
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
            this.view._renderInterestedSadhanas(profile.interestedSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast('Removed from Trainee In-Progress.');
          } else {
            e.target.checked = true;
          }
        }
      }
    });

    // 3. Send to Trainee from Slide-out Drawer Footer Button
    if (this.view.btnDrawerSendTrainee) {
      this.view.btnDrawerSendTrainee.addEventListener('click', () => {
        const key = this.view.btnDrawerSendTrainee.getAttribute('data-sadhana-key');
        if (key) {
          const sent = this.model.sendSadhanaToTrainee(key);
          this.view.closeSadhanaDrawer();
          this.switchMainTab('tab-trainee-sadhak');
          this._renderCurrentState();
          this.view.showToast(`🚀 "${sent.title}" sent to Trainee Sadhak In-Progress!`);
        }
      });
    }

    // 4. Enroll in Queue from Drawer Footer Button
    if (this.view.btnDrawerEnroll) {
      this.view.btnDrawerEnroll.addEventListener('click', () => {
        const key = this.view.btnDrawerEnroll.getAttribute('data-sadhana-key');
        if (key) {
          const sent = this.model.sendSadhanaToTrainee(key);
          this.view.closeSadhanaDrawer();
          this._renderCurrentState();
          this.view.showToast(`✓ "${sent.title}" enrolled in Queue & Trainee In-Progress.`);
        }
      });
    }

    // 5. Goli Gyan Guide Modal Open & Close
    const btnOpenGoli = document.getElementById('btn-open-goli-gyan');
    if (btnOpenGoli) btnOpenGoli.addEventListener('click', () => this.view.toggleGoliGyanModal(true));
    const btnCloseGoli = document.getElementById('btn-close-goli-gyan-modal');
    if (btnCloseGoli) btnCloseGoli.addEventListener('click', () => this.view.toggleGoliGyanModal(false));

    // 6. Speech Recognition Engine for Universal Mic Input
    let speechRecognition = null;
    let activeRecordingBtn = null;

    const getSpeechRecognizer = () => {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        return null;
      }
      if (!speechRecognition) {
        speechRecognition = new SpeechRec();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
      }
      speechRecognition.lang = this.model.settings?.speechLang || 'en-US';
      return speechRecognition;
    };

    // 7. Global Click Handler for Universal Memo Box (Keyboard, Mic, Send, Quick Chips) & Upline Verification
    document.addEventListener('click', (e) => {
      // 7A: Keyboard Helper Trigger (Toggles quick chips & focuses textarea)
      const btnKeyboard = e.target.closest('.btn-memo-keyboard');
      if (btnKeyboard) {
        const targetId = btnKeyboard.getAttribute('data-target');
        if (targetId) {
          const textarea = document.getElementById(targetId);
          if (textarea) textarea.focus();
          const chipsWrap = document.getElementById(`quick-chips-${targetId}`);
          if (chipsWrap) {
            chipsWrap.style.display = chipsWrap.style.display === 'none' ? 'flex' : 'none';
          }
        }
        return;
      }

      // 7B: Quick Suggestion Chip Click
      const quickChip = e.target.closest('.memo-quick-chip');
      if (quickChip) {
        const targetId = quickChip.getAttribute('data-target');
        const chipText = quickChip.textContent.trim();
        if (targetId && chipText) {
          const textarea = document.getElementById(targetId);
          if (textarea) {
            const currentVal = textarea.value.trim();
            textarea.value = currentVal ? `${currentVal} • ${chipText}` : chipText;
            textarea.focus();
          }
        }
        return;
      }

      // 7C: Mic Speech-to-Text Button Click
      const btnMic = e.target.closest('.btn-memo-mic');
      if (btnMic) {
        const targetId = btnMic.getAttribute('data-target');
        const textarea = document.getElementById(targetId);
        const recognizer = getSpeechRecognizer();

        if (!recognizer) {
          const promptInput = prompt('Browser Speech API not supported directly on this browser. You can type or paste your voice transcript here:');
          if (promptInput && textarea) {
            const cur = textarea.value.trim();
            textarea.value = cur ? `${cur} ${promptInput}` : promptInput;
            textarea.focus();
          }
          return;
        }

        if (btnMic.classList.contains('is-recording')) {
          // Stop recording
          try { recognizer.stop(); } catch (err) { /* ignore */ }
          btnMic.classList.remove('is-recording');
          btnMic.title = 'Voice-to-Text Input (Microphone)';
          activeRecordingBtn = null;
          this.view.showToast('🎙️ Voice recording stopped.');
        } else {
          // Start recording
          if (activeRecordingBtn) {
            activeRecordingBtn.classList.remove('is-recording');
          }
          activeRecordingBtn = btnMic;
          btnMic.classList.add('is-recording');
          btnMic.title = 'Listening... Speak into microphone (Click to stop)';
          this.view.showToast('🎙️ Listening... Speak your memo or progress note now.');

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
            console.warn('Speech recognition error:', event.error);
            btnMic.classList.remove('is-recording');
            btnMic.title = 'Voice-to-Text Input (Microphone)';
            activeRecordingBtn = null;
            this.view.showToast(`⚠️ Voice input error: ${event.error}`);
          };

          recognizer.onend = () => {
            btnMic.classList.remove('is-recording');
            btnMic.title = 'Voice-to-Text Input (Microphone)';
            activeRecordingBtn = null;
          };

          try {
            recognizer.start();
          } catch (err) {
            console.warn('Speech recognition start failed', err);
            btnMic.classList.remove('is-recording');
            activeRecordingBtn = null;
          }
        }
        return;
      }

      // 7D: Memo Send / Submit Button Click
      const btnSend = e.target.closest('#btn-add-trainee-memo');
      if (btnSend) {
        const itemId = btnSend.getAttribute('data-item-id');
        const memoInput = document.getElementById('trainee-new-memo-text');
        if (memoInput && itemId) {
          const text = memoInput.value.trim();
          if (!text) {
            alert('Please enter a note or memo message before submitting.');
            return;
          }
          const activeProf = this.model.getActiveProfile();
          const author = this.model.getRoleMode() === 'MASTER' 
            ? 'Master Karim' 
            : (this.model.getRoleMode() === 'HEALER' ? (activeProf.name || 'Healer Mentor') : (activeProf.name || 'Devotee Sadhak'));
          
          const updatedItem = this.model.addTraineeMemo(itemId, text, author);
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast('✓ Progress note added with date-time stamp!');
          }
        }
        return;
      }

      // 7E: Upline Verification Request Click
      const btnVerifyRequest = e.target.closest('.btn-verify-request');
      if (btnVerifyRequest) {
        const itemId = btnVerifyRequest.getAttribute('data-item-id');
        if (itemId) {
          const updatedItem = this.model.requestTraineeVerification(itemId);
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._renderCategorizedTraineeSadhanas(this.model.getActiveProfile().traineeSadhanas);
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast(`🛡️ Progress verification request sent to Upline Sponsor (${updatedItem.mentorCode})!`);
          }
        }
        return;
      }

      // 7F: Upline Verification Approve Click
      const btnVerifyApprove = e.target.closest('.btn-verify-approve');
      if (btnVerifyApprove) {
        const itemId = btnVerifyApprove.getAttribute('data-item-id');
        if (itemId) {
          const activeProf = this.model.getActiveProfile();
          const mentorName = this.model.getRoleMode() === 'MASTER' ? 'Karim Ji (Founder)' : (activeProf.name || 'Healer Mentor');
          const mentorCode = this.model.getRoleMode() === 'MASTER' ? 'SKHM-ADM1-7788-9900' : (activeProf.referenceCode || 'SKHM-HLR2-3344-5566');

          const updatedItem = this.model.approveTraineeVerification(itemId, mentorName, mentorCode);
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._renderCategorizedTraineeSadhanas(this.model.getActiveProfile().traineeSadhanas);
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast(`✅ Progress approved & verified by ${mentorName}!`);
          }
        }
        return;
      }

      // 7G: Upline Verification Reject / Revision Click
      const btnVerifyReject = e.target.closest('.btn-verify-reject');
      if (btnVerifyReject) {
        const itemId = btnVerifyReject.getAttribute('data-item-id');
        if (itemId) {
          const reason = prompt('Enter mentor guidance or revision notes for this trainee:', 'Complete 11 additional malas daily and re-submit for seal.');
          if (reason !== null) {
            const activeProf = this.model.getActiveProfile();
            const mentorName = this.model.getRoleMode() === 'MASTER' ? 'Karim Ji (Founder)' : (activeProf.name || 'Healer Mentor');
            const updatedItem = this.model.rejectTraineeVerification(itemId, reason, mentorName);
            if (updatedItem) {
              this.view._renderTraineeActiveDetail(updatedItem);
              this.view._renderCategorizedTraineeSadhanas(this.model.getActiveProfile().traineeSadhanas);
              this.view._updateJSONPreview(this.model.getActiveProfile());
              this.view.showToast('Revision request logged in timeline.');
            }
          }
        }
        return;
      }
    });

    // 8. Keyboard shortcut (Ctrl+Enter / Cmd+Enter) for quick submit on Universal Memo textarea
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (e.target && e.target.classList.contains('universal-memo-textarea')) {
          const btn = document.getElementById('btn-add-trainee-memo');
          if (btn) btn.click();
        }
      }
    });

    // Live update of Trainee Parameters (level, progress, target, streak) from Right Panel
    document.addEventListener('change', (e) => {
      const target = e.target;
      if (!target) return;
      const itemId = target.getAttribute('data-item-id');
      if (!itemId) return;

      const profile = this.model.getActiveProfile();
      const item = (profile.traineeSadhanas || []).find(ts => ts.id === itemId);
      if (!item) return;

      if (target.classList.contains('active-ts-level-select')) {
        item.level = target.value;
      } else if (target.classList.contains('active-ts-progress-input')) {
        item.progressPercent = Math.min(100, Math.max(0, parseInt(target.value, 10) || 0));
      } else if (target.classList.contains('active-ts-target-input')) {
        item.dailyTarget = target.value.trim();
      } else if (target.classList.contains('active-ts-streak-input')) {
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
        id: 'new-profile-name',
        test: val => Boolean(val && val.trim().length >= 3),
        msg: 'Name must be at least 3 characters'
      },
      {
        id: 'new-profile-phone',
        test: val => /^(\+?\d{1,4}[- ]?)?\d{10}$/.test((val || '').replace(/[\s-]/g, '')),
        msg: 'Enter a valid 10-digit mobile number'
      },
      {
        id: 'new-profile-sponsor',
        test: val => !val || /^(ROOT|[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})$/i.test(val.trim()),
        msg: 'Must be ROOT or valid 16-digit code (e.g. SKHM-ADM1-7788-9900)'
      },
      {
        id: 'input-name',
        test: val => Boolean(val && val.trim().length >= 3),
        msg: 'Name must be at least 3 characters'
      },
      {
        id: 'input-phone',
        test: val => !val || /^(\+?\d{1,4}[- ]?)?\d{10}$/.test(val.replace(/[\s-]/g, '')),
        msg: 'Enter a valid 10-digit mobile number'
      }
    ];

    validations.forEach(({ id, test, msg }) => {
      const input = document.getElementById(id);
      if (input) {
        const handler = () => {
          const val = input.value;
          if (!val && !input.required) {
            this.view.setValidationStatus(input, true, '');
            return;
          }
          const ok = test(val);
          this.view.setValidationStatus(input, ok, ok ? '✓ Valid format' : msg);
        };
        input.addEventListener('input', handler);
        input.addEventListener('blur', handler);
      }
    });
  }

  
  _bindSidebarNavigationAndTierEvents() {
    // 1. Navigation items in sidebar
    const navItems = document.querySelectorAll('.drawer-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // Close mobile drawer if open
        if (this.view.sidebarEl && this.view.sidebarEl.classList.contains('mobile-open')) {
          this.view.toggleMobileSidebar(false);
        }

        const target = item.getAttribute('data-nav-target');
        switch (target) {
          case 'dashboard': {
            const el = document.getElementById('main-profile-box-1');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            this.view.showSlideToast('Dashboard', 'Viewing Hero Profile Card & Canvas', 'info', 2000);
            break;
          }
          case 'tab-devotee-personal':
            this.switchMainTab('tab-devotee-personal');
            this.view.switchSubTab('devotee-personal', 'devotee-sub-identity');
            this.view.showSlideToast('Devotee Personal', '🌟 Tab 1: Personal Identity & Lineage', 'info', 2000);
            break;

          case 'tab-seeker-purpose':
            this.switchMainTab('tab-seeker-purpose');
            this.view.showSlideToast('Seeker Purpose', '🎯 Tab 2: Goals & Sacred Sadhana Catalog', 'info', 2000);
            break;

          case 'tab-trainee-sadhak':
            this.switchMainTab('tab-trainee-sadhak');
            this.view.showSlideToast('Trainee Sadhak', '🌿 Tab 3: Level-Wise Sadhanas & Memos', 'info', 2000);
            break;

          case 'tab-healer-connect':
            this.switchMainTab('tab-healer-connect');
            this.view.showSlideToast('Healer Connect', '👑 Tab 4: Healers Hub & Guided Seekers', 'info', 2000);
            break;

          case 'tab-genealogy-tree':
            this.switchMainTab('tab-genealogy-tree');
            this.view.renderInBodyHierarchyTree(this.model.profiles, null, '', this.view.inBodyTreePanState?.layoutMode || 'cluster');
            this.view.showSlideToast('Genealogy Tree', '🌳 Tab 5: 5-Level MLM Canvas Spiderweb', 'info', 2000);
            break;

          case 'tab-firebase-data':
            this.switchMainTab('tab-firebase-data');
            this.view.renderFirebaseDataTable(this.model);
            this.view.showSlideToast('Firebase Data', '🔥 Tab 6: Realtime DB Structured Drill-down', 'info', 2000);
            break;

          case 'telemetry-qr': {
            const flipper = document.getElementById('profile-card-flipper-wrapper');
            if (flipper) {
              flipper.classList.add('is-flipped');
              const el = document.getElementById('main-profile-box-1');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              this.view.showSlideToast('Device Telemetry', '📡 24h Device Pairing QR & Cloud Telemetry', 'info', 2500);
            }
            break;
          }
          case 'lineage':
            this.switchMainTab('tab-devotee-personal');
            this.view.switchSubTab('devotee-personal', 'devotee-sub-lineage');
            this.view.showSlideToast('Ancestral Lineage', '👨‍👩‍👧 3-Generation Ancestral Lineage Tree', 'info', 2000);
            break;

          case 'houseclean':
            this.switchMainTab('tab-devotee-personal');
            this.view.switchSubTab('devotee-personal', 'devotee-sub-houseclean');
            this.view.showSlideToast('House Clean Sanctum', '🧹 House Clean Status & Levels', 'info', 2000);
            break;
        }
      });
    });

    // 2. App Hierarchy Tiers in Sidebar (Actively change role, tab and filter!)
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tier = parseInt(item.getAttribute('data-tier'), 10);
        
        // Highlight active item
        document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(it => it.classList.remove('active'));
        item.classList.add('active');

        // Also update corresponding nav item
        document.querySelectorAll('.drawer-nav-item').forEach(n => n.classList.remove('active'));

        if (tier === 1) {
          // Admin Master -> Switch to MASTER role & Tab 1
          if (this.view.selectRoleMode) {
            this.view.selectRoleMode.value = 'MASTER';
            this.view.selectRoleMode.dispatchEvent(new Event('change'));
          }
          this.switchMainTab('tab-devotee-personal');
          this.view.showSlideToast('Admin Master Tier', '👑 Viewing Master Founder Profiles & Controls', 'info', 2500);
        } else if (tier === 2) {
          // Healer Connect -> Switch to HEALER role & Tab 4 (Healers Hub)
          if (this.view.selectRoleMode) {
            this.view.selectRoleMode.value = 'HEALER';
            this.view.selectRoleMode.dispatchEvent(new Event('change'));
          }
          this.switchMainTab('tab-healer-connect');
          const navHealer = document.getElementById('nav-item-healer-page');
          if (navHealer) navHealer.classList.add('active');
          this.view.showSlideToast('Healer Connect Tier', '🛡️ Switched to Certified Healers Hub (Tab 4)', 'info', 2500);
        } else if (tier === 3) {
          // Trainee Sadhak -> Switch to TRAINEE role & Tab 3
          if (this.view.selectRoleMode) {
            this.view.selectRoleMode.value = 'TRAINEE';
            this.view.selectRoleMode.dispatchEvent(new Event('change'));
          }
          this.switchMainTab('tab-trainee-sadhak');
          const navTrainee = document.getElementById('nav-item-trainee-page');
          if (navTrainee) navTrainee.classList.add('active');
          this.view.showSlideToast('Trainee Sadhak Tier', '🌿 Switched to Trainee Mentorship & Sadhanas (Tab 3)', 'info', 2500);
        } else if (tier === 4) {
          // Devotee / Seeker -> Switch to DEVOTEE role & Tab 1
          if (this.view.selectRoleMode) {
            this.view.selectRoleMode.value = 'DEVOTEE';
            this.view.selectRoleMode.dispatchEvent(new Event('change'));
          }
          this.switchMainTab('tab-devotee-personal');
          const navDevotee = document.getElementById('nav-item-devotee-page');
          if (navDevotee) navDevotee.classList.add('active');
          this.view.showSlideToast('Devotee Seeker Tier', '🌟 Switched to Devotee Personal Workspace (Tab 1)', 'info', 2500);
        }

        // Also open flyout panel if user wants detailed profile cards
        this.view.openTierPanel(tier, this.model.profiles, this.model.activeProfileId);
      });
    });

    // 3. Dedicated Sub-Portal Links (Actively switch role mode & view!)
    document.querySelectorAll('#sidebar-dedicated-portals .sub-portal-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const tier = parseInt(link.getAttribute('data-portal-tier'), 10);
        // Only prevent default if we can handle in-page smoothly
        if (window.location.protocol !== 'file:') {
          e.preventDefault();
        }

        document.querySelectorAll('#sidebar-dedicated-portals .sub-portal-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const roleMap = { 1: 'MASTER', 2: 'HEALER', 3: 'TRAINEE', 4: 'DEVOTEE' };
        const targetRole = roleMap[tier] || 'MASTER';

        if (this.view.selectRoleMode) {
          this.view.selectRoleMode.value = targetRole;
          this.view.selectRoleMode.dispatchEvent(new Event('change'));
        }

        if (tier === 2) {
          this.switchMainTab('tab-healer-connect');
        } else if (tier === 3) {
          this.switchMainTab('tab-trainee-sadhak');
        } else {
          this.switchMainTab('tab-devotee-personal');
        }

        this.view.showSlideToast('Portal Switched', `🏛️ Active Portal: ${link.textContent.trim()}`, 'info', 2500);
      });
    });
  }

  _bindEvents() {

    // Dynamic Role Authorization Matrix Actions in Settings
    const btnSaveAuthMatrix = document.getElementById('btn-save-auth-matrix');
    if (btnSaveAuthMatrix) {
      btnSaveAuthMatrix.addEventListener('click', (e) => {
        e.preventDefault();
        const currentRole = this.model.getRoleMode();
        if (currentRole !== 'MASTER') {
          this.view.showSlideToast('Access Restricted', 'Only Master role can modify the Authorization Matrix', 'warning', 3000);
          return;
        }

        const matrix = this.model.getAuthMatrix();
        const rows = document.querySelectorAll('#auth-matrix-tbody tr[data-item-id]');

        rows.forEach(row => {
          const itemId = row.getAttribute('data-item-id');
          const item = matrix.find(m => m.id === itemId);
          if (item) {
            const roles = ['MASTER', 'HEALER', 'TRAINEE', 'DEVOTEE'];
            roles.forEach(r => {
              const chk = row.querySelector(`.matrix-role-check[data-role="${r}"]`);
              if (chk) {
                item[r] = chk.checked;
              }
            });
          }
        });

        this.model.saveAuthMatrix(matrix);
        this.view.applyDynamicAuthMatrix(matrix, currentRole);
        this.view.showSlideToast('Matrix Updated', '🛡️ Authorization Matrix saved and applied in real-time!', 'success', 3000);
      });
    }

    const btnResetAuthMatrix = document.getElementById('btn-reset-auth-matrix');
    if (btnResetAuthMatrix) {
      btnResetAuthMatrix.addEventListener('click', (e) => {
        e.preventDefault();
        const currentRole = this.model.getRoleMode();
        if (currentRole !== 'MASTER') {
          this.view.showSlideToast('Access Restricted', 'Only Master role can reset the Authorization Matrix', 'warning', 3000);
          return;
        }

        const defaultMatrix = this.model.getDefaultAuthMatrix();
        this.model.saveAuthMatrix(defaultMatrix);
        this.view.renderAuthMatrixInSettings(defaultMatrix, currentRole);
        this.view.applyDynamicAuthMatrix(defaultMatrix, currentRole);
        this.view.showSlideToast('Matrix Reset', '🔄 Default authorization permissions restored', 'info', 2500);
      });
    }

    this._bindSidebarNavigationAndTierEvents();
    // 1. 3D Card Flipper Direct & Click Handlers
    const btnFlipToBack = document.getElementById('btn-flip-to-back');
    const btnFlipToFront = document.getElementById('btn-flip-to-front');
    const flipperWrapper = document.getElementById('profile-card-flipper-wrapper');

    if (btnFlipToBack && flipperWrapper) {
      btnFlipToBack.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        flipperWrapper.classList.add('is-flipped');
        this.view.showSlideToast('3D Telemetry Flipped', '📡 24h Device Pairing QR & RTDB Telemetry Active', 'info', 3000);
      });
    }

    if (btnFlipToFront && flipperWrapper) {
      btnFlipToFront.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        flipperWrapper.classList.remove('is-flipped');
        this.view.showSlideToast('3D Profile Flipped', '👤 Viewing Member Profile Identity Card', 'info', 2500);
      });
    }

    // 2. Directory Layout Segmented Toggle Handlers (Grid Cards vs Table List)
    const btnLayoutGrid = document.getElementById('btn-layout-grid');
    const btnLayoutTable = document.getElementById('btn-layout-table');
    if (btnLayoutGrid) {
      btnLayoutGrid.addEventListener('click', () => {
        this.view.directoryLayout = 'GRID';
        if (typeof localStorage !== 'undefined') localStorage.setItem('sk_directory_layout', 'GRID');
        const scoped = this.model.getScopedProfiles();
        this.view.renderAndroidHealersHub(scoped, this.model.getActiveProfile(), this.model.getRoleMode());
        this.view.showSlideToast('Layout Switched', '📇 Directory set to Grid Cards layout', 'info', 2000);
      });
    }
    if (btnLayoutTable) {
      btnLayoutTable.addEventListener('click', () => {
        this.view.directoryLayout = 'TABLE';
        if (typeof localStorage !== 'undefined') localStorage.setItem('sk_directory_layout', 'TABLE');
        const scoped = this.model.getScopedProfiles();
        this.view.renderAndroidHealersHub(scoped, this.model.getActiveProfile(), this.model.getRoleMode());
        this.view.showSlideToast('Layout Switched', '📋 Directory set to Table List layout', 'info', 2000);
      });
    }

    // 3. Sacred Sadhana Interactive Listbox Selection
    const selectSacredSadhana = document.getElementById('select-sacred-sadhana');
    if (selectSacredSadhana) {
      selectSacredSadhana.addEventListener('change', (e) => {
        this.view.renderSadhanaDetailPreview(e.target.value);
        const item = (typeof SADHANA_CATALOG !== 'undefined') ? SADHANA_CATALOG[e.target.value] : null;
        this.view.showSlideToast('Sadhana Loaded', 'Viewing details for ' + (item ? item.title : e.target.value), 'info', 2500);
      });
    }

    // 4. RBAC Access Matrix Modal Listeners
    ['btn-open-rbac-matrix', 'sidebar-btn-rbac-matrix'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.view.toggleRbacMatrixModal(true);
        });
      }
    });

    ['btn-close-rbac-modal', 'btn-close-rbac-footer'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.view.toggleRbacMatrixModal(false);
        });
      }
    });

    // 5. 24h Share & Pairing Modal Listeners
    ['btn-quick-share-pairing', 'sidebar-btn-share-pairing'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.view.toggleSharePairingModal(true);
        });
      }
    });

    // 6. Admin System Settings Modal Listeners
    ['btn-admin-settings', 'sidebar-btn-admin-settings'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.view.toggleSettingsModal(true);
        });
      }
    });

    // 7. Real-Time Textbox Validation Listeners
    this._bindRealtimeInputValidations();

    // 0. Theme Switcher Event Listener
    if (this.view.btnThemeToggle) {
      this.view.btnThemeToggle.addEventListener('click', () => {
        this._cycleTheme();
      });
    }

    // ==============================================================
    // ANDROID COMPOSE ALIGNED: HEALERS HUB & RECURSIVE TREE EVENT BINDINGS
    // ==============================================================

    // 1. Search Bar in Healers Hub
    const inputHealersSearch = document.getElementById('input-healers-search');
    if (inputHealersSearch) {
      inputHealersSearch.addEventListener('input', (e) => {
        this.view.healersSearchQuery = e.target.value;
        const scoped = this.model.getScopedProfiles();
        this.view.renderAndroidHealersHub(scoped, this.model.getActiveProfile(), this.model.getRoleMode());
      });
    }

    // 2. Category Filter Chips in Healers Hub
    const filterChipsContainer = document.getElementById('healers-filter-chips-container');
    if (filterChipsContainer) {
      filterChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.healer-filter-chip');
        if (chip) {
          filterChipsContainer.querySelectorAll('.healer-filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.view.healersSelectedCategory = chip.getAttribute('data-type') || 'ALL';
          const scoped = this.model.getScopedProfiles();
          this.view.renderAndroidHealersHub(scoped, this.model.getActiveProfile(), this.model.getRoleMode());
        }
      });
    }

    // 3. Top Banner "5-Level Tree" Button Shortcut
    const btnOpenHealersTree = document.getElementById('btn-open-healers-tree');
    if (btnOpenHealersTree) {
      btnOpenHealersTree.addEventListener('click', () => {
        this.switchMainTab('tab-genealogy-tree');
        this.view.renderAndroidHierarchyTree(this.model.profiles, this.view.hierarchySelectedLevel || 'ALL');
        this.view.showToast('🌳 Switched to Organization Hierarchy Tree');
      });
    }

    // 4. Hierarchy Level Generation Filter Chips (Tab 5)
    const hierarchyLevelFilterChips = document.getElementById('hierarchy-level-filter-chips');
    if (hierarchyLevelFilterChips) {
      hierarchyLevelFilterChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.hierarchy-level-filter-chip');
        if (chip) {
          hierarchyLevelFilterChips.querySelectorAll('.hierarchy-level-filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const lvl = chip.getAttribute('data-level') || 'ALL';
          this.view.hierarchySelectedLevel = lvl;
          this.view.renderAndroidHierarchyTree(this.model.profiles, lvl);
          this.view.showToast(`🎯 Level Generation Filter: ${lvl === 'ALL' ? 'All Levels' : 'Level ' + lvl}`);
        }
      });
    }

    // 5. Segmented Tree View Toggles (Recursive List vs Canvas)
    const btnViewRecursive = document.getElementById('btn-view-recursive');
    const btnViewCanvas = document.getElementById('btn-view-canvas');
    const recursiveViewEl = document.getElementById('hierarchy-recursive-tree-view');
    const canvasViewEl = document.getElementById('hierarchy-canvas-tree-view');

    if (btnViewRecursive && btnViewCanvas) {
      btnViewRecursive.addEventListener('click', () => {
        btnViewRecursive.classList.add('active');
        btnViewCanvas.classList.remove('active');
        if (recursiveViewEl) recursiveViewEl.style.display = 'flex';
        if (canvasViewEl) canvasViewEl.style.display = 'none';
        this.view.renderAndroidHierarchyTree(this.model.profiles, this.view.hierarchySelectedLevel || 'ALL');
      });

      btnViewCanvas.addEventListener('click', () => {
        btnViewCanvas.classList.add('active');
        btnViewRecursive.classList.remove('active');
        if (recursiveViewEl) recursiveViewEl.style.display = 'none';
        if (canvasViewEl) canvasViewEl.style.display = 'block';
        setTimeout(() => this.view.smartFitInBodyTree(), 80);
      });
    }

    // 6. Global Delegate for Healer Cards & Recursive Tree Interactive Elements
    document.addEventListener('click', (e) => {
      // Copy 16-Digit Code Pill
      const copyCodeBtn = e.target.closest('.btn-copy-card-code');
      if (copyCodeBtn) {
        const code = copyCodeBtn.getAttribute('data-code');
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            this.view.showToast(`📋 Copied: ${code}`);
          });
        }
        return;
      }

      // Member 3-Dots Quick Action Menu
      const quickOptsBtn = e.target.closest('.btn-member-quick-opts');
      if (quickOptsBtn) {
        const pid = quickOptsBtn.getAttribute('data-profile-id');
        const prof = this.model.profiles.find(p => p.id === pid);
        if (prof) {
          this.view.openNodeActionDialog(prof);
        }
        return;
      }

      // Toggle Tree Recursive Branch Expand / Collapse
      const toggleBranchBtn = e.target.closest('.btn-toggle-tree-branch');
      if (toggleBranchBtn) {
        const nodeId = toggleBranchBtn.getAttribute('data-node-id');
        const branch = document.getElementById(`tree-branch-${nodeId}`);
        if (branch) {
          const isHidden = branch.style.display === 'none';
          branch.style.display = isHidden ? 'flex' : 'none';
          toggleBranchBtn.textContent = isHidden ? '−' : '+';
        }
        return;
      }

      // Share Tree Node
      const shareNodeBtn = e.target.closest('.btn-share-tree-node');
      if (shareNodeBtn) {
        const pid = shareNodeBtn.getAttribute('data-profile-id');
        const prof = this.model.profiles.find(p => p.id === pid);
        if (prof) {
          const shareText = `Spiritual Karim Member Profile:\nName: ${prof.name}\n16-Digit Code: ${prof.referenceCode}\nRole: ${prof.profileType}\nLevel: ${prof.level}\nSponsor: ${prof.referredByCode}`;
          navigator.clipboard.writeText(shareText).then(() => {
            this.view.showToast(`📲 Member reference copied for sharing!`);
          });
        }
        return;
      }

      // Inspect Tree Node in Drawer
      const inspectNodeBtn = e.target.closest('.btn-inspect-tree-node');
      if (inspectNodeBtn) {
        const pid = inspectNodeBtn.getAttribute('data-profile-id');
        const prof = this.model.profiles.find(p => p.id === pid);
        if (prof) {
          this.view.renderTreeProfileDrawer(prof);
          this.view.toggleTreeProfileDrawer(true);
        }
        return;
      }

      // Jump to Profile on Node Click
      const jumpTrigger = e.target.closest('.btn-jump-profile-trigger');
      if (jumpTrigger) {
        const pid = jumpTrigger.getAttribute('data-profile-id');
        if (pid && this.model.profiles.some(p => p.id === pid)) {
          this.model.setActiveProfileId(pid);
          this._renderCurrentState();
          this.switchMainTab('tab-devotee-personal');
          this.view.showToast(`🚀 Switched active profile to "${this.model.getActiveProfile().name}"`);
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
      this.view.btnMobileSidebarToggle.addEventListener('click', () => {
        const isOpen = this.view.adminSidebar.classList.toggle('mobile-open');
        if (this.view.sidebarBackdrop) {
          this.view.sidebarBackdrop.classList.toggle('open', isOpen);
        }
      });
    }

    if (this.view.sidebarBackdrop && this.view.adminSidebar) {
      this.view.sidebarBackdrop.addEventListener('click', () => {
        this.view.adminSidebar.classList.remove('mobile-open');
        this.view.sidebarBackdrop.classList.remove('open');
      });
    }

    // Quick Goli Gyan Header Button Trigger
    if (this.view.btnQuickGoliGyan) {
      this.view.btnQuickGoliGyan.addEventListener('click', () => {
        this.view.toggleGoliGyanModal(true);
      });
    }

    // Quick Share & Pairing Modal Trigger
    const btnQuickSharePairing = document.getElementById('btn-quick-share-pairing') || document.getElementById('sidebar-btn-share-pairing');
    if (btnQuickSharePairing) {
      btnQuickSharePairing.addEventListener('click', () => {
        const profile = this.model.getActiveProfile();
        this.view.renderSharePairingModal(profile, this.model.getPairingInvites());
        this.view.toggleSharePairingModal(true);
      });
    }

    const btnCloseSharePairing = document.getElementById('btn-close-share-pairing-modal');
    if (btnCloseSharePairing) {
      btnCloseSharePairing.addEventListener('click', () => {
        this.view.toggleSharePairingModal(false);
      });
    }

    // Delegate click handler for Pairing actions in table
    document.addEventListener('click', (e) => {
      // Approve Pairing
      const btnApprove = e.target.closest('.btn-approve-pairing');
      if (btnApprove) {
        const id = btnApprove.getAttribute('data-invite-id');
        if (id) {
          const approved = this.model.approvePairingInvite(id);
          if (approved) {
            this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
            this._renderCurrentState();
            this.view.showToast(`✅ Seeker "${approved.seekerName}" officially verified & linked to lineage!`);
          }
        }
        return;
      }

      // Reject Pairing
      const btnReject = e.target.closest('.btn-reject-pairing');
      if (btnReject) {
        const id = btnReject.getAttribute('data-invite-id');
        if (id && confirm('Reject this pairing request?')) {
          this.model.rejectPairingInvite(id);
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
          this.view.showToast('Pairing request rejected.');
        }
        return;
      }

      // Resend Pairing (Refresh 24h with Exponential Backoff Check)
      const btnResend = e.target.closest('.btn-resend-pairing');
      if (btnResend) {
        const id = btnResend.getAttribute('data-invite-id');
        if (id) {
          const refreshed = this.model.resendPairingInvite(id);
          if (refreshed && refreshed.error) {
            this.view.showToast(`⚠️ ${refreshed.message}`);
          } else if (refreshed) {
            this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
            this.view.showToast(`🔄 24-Hour window refreshed for "${refreshed.seekerName}".`);
          }
        }
        return;
      }

      // Simulate New Seeker Request
      const btnSimulate = e.target.closest('#btn-simulate-new-seeker');
      if (btnSimulate) {
        const names = ['Kavita Rao', 'Rahul Sen', 'Deepak Verma', 'Meera Nair', 'Suresh Patel'];
        const models = ['Samsung Galaxy S24 Ultra', 'Google Pixel 8 Pro', 'Xiaomi 13 Pro', 'Vivo X90', 'OnePlus 12'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomModel = models[Math.floor(Math.random() * models.length)];
        const randomPhone = '+91 9' + Math.floor(100000000 + Math.random() * 900000000);

        const newInv = this.model.createPairingInvite({
          seekerName: randomName,
          seekerPhone: randomPhone,
          deviceModel: randomModel
        });
        if (newInv && newInv.error) {
          this.view.showToast(`⚠️ ${newInv.message}`);
        } else if (newInv) {
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
          this.view.showToast(`📲 New Seeker "${newInv.seekerName}" (${newInv.seekerDeviceModel}) requested pairing! 24h timer active.`);
        }
        return;
      }
    });

    // 1-Second Live Countdown Ticker Interval
    setInterval(() => {
      const countdownElements = document.querySelectorAll('.countdown-live[data-expires]');
      if (!countdownElements || countdownElements.length === 0) return;
      const now = Date.now();
      countdownElements.forEach(el => {
        const expiresAt = parseInt(el.getAttribute('data-expires'), 10);
        if (!expiresAt) return;
        const remainingMs = expiresAt - now;
        if (remainingMs <= 0) {
          el.className = 'countdown-timer-badge countdown-expired';
          el.textContent = '⏱️ Expired (24h Ended)';
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
        } else {
          const hours = Math.floor(remainingMs / (1000 * 60 * 60));
          const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
          const pad = n => String(n).padStart(2, '0');
          el.textContent = `⏳ ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
        }
      });
    }, 1000);

    // 3D Card Flipper Global Click Handler
    document.addEventListener('click', (e) => {
      const flipper = e.target.closest('.spiritual-card-flipper');
      const btnFlip = e.target.closest('.btn-flip-trigger');
      if (btnFlip && flipper) {
        e.stopPropagation();
        flipper.classList.toggle('is-flipped');
        return;
      }
      if (flipper && !e.target.closest('button') && !e.target.closest('input') && !e.target.closest('textarea') && !e.target.closest('a')) {
        flipper.classList.toggle('is-flipped');
      }
    });

    // Accordion Listbox Expand / Collapse Toggle Handler
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (header) {
        const item = header.closest('.accordion-item');
        if (item) {
          item.classList.toggle('is-open');
        }
      }
    });

    // Left/Right Segmented Toggle Click Handler
    document.addEventListener('click', (e) => {
      const segItem = e.target.closest('.segmented-item');
      if (segItem) {
        const parent = segItem.closest('.segmented-control');
        if (parent) {
          parent.querySelectorAll('.segmented-item').forEach(btn => btn.classList.remove('active'));
          segItem.classList.add('active');
          const filterValue = segItem.getAttribute('data-filter');
          const targetSection = parent.getAttribute('data-target-section');
          if (targetSection === 'remedies') {
            this._filterRemedies();
          }
          this.view.showToast(`Filter applied: ${filterValue}`);
        }
      }
    });

    // Real-Time Regex Validations with Visual Indicators & Live Remedy Search
    document.addEventListener('input', (e) => {
      const target = e.target;
      if (!target) return;

      // Live search filter on remedies catalog
      if (target.id === 'input-search-remedies') {
        this._filterRemedies();
      }

      // Phone validation
      if (target.id === 'input-phone' || target.classList.contains('input-validate-phone')) {
        const val = target.value.trim().replace(/[\s\-]/g, '');
        if (/^(\+91)?[6789]\d{9}$/.test(val) || val.length >= 10) {
          target.classList.remove('is-invalid');
          target.classList.add('is-valid');
        } else if (val.length > 3) {
          target.classList.remove('is-valid');
          target.classList.add('is-invalid');
        } else {
          target.classList.remove('is-valid', 'is-invalid');
        }
      }

      // 16-Digit Sponsor Code validation
      if (target.id === 'input-ref-code' || target.id === 'input-sponsor-code' || target.classList.contains('input-validate-code')) {
        const val = target.value.trim();
        if (/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(val) || val.length === 19) {
          target.classList.remove('is-invalid');
          target.classList.add('is-valid');
        } else if (val.length > 5) {
          target.classList.remove('is-valid');
          target.classList.add('is-invalid');
        } else {
          target.classList.remove('is-valid', 'is-invalid');
        }
      }
    });

    // Header Stamp Badge Toggle Trigger
    if (this.view.headerStampBadge) {
      this.view.headerStampBadge.style.cursor = 'pointer';
      this.view.headerStampBadge.addEventListener('click', () => {
        const profile = this.model.getActiveProfile();
        const currentIsPaid = profile.isPaid !== false && profile.paymentStatus !== 'FREE';
        profile.isPaid = !currentIsPaid;
        profile.paymentStatus = profile.isPaid ? 'PAID' : 'FREE';
        this.model.saveProfiles(this.model.profiles);
        this.view._renderHeaderCard(profile, this.model.getRoleMode());
        if (this.view.inputPaymentStatus) {
          this.view.inputPaymentStatus.value = profile.paymentStatus;
        }
        this.view._updateJSONPreview(profile);
        this.view.showToast(`Membership stamp set to: ${profile.paymentStatus === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
      });
    }

    // Active Profile Role Dropdown Switcher (MASTER | HEALER | DEVOTEE)
    if (this.view.selectRoleMode) {
      this.view.selectRoleMode.addEventListener('change', (e) => {
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
      document.body.setAttribute('data-portal-role', newRole);

      // Re-render UI state
      this._renderCurrentState();
      this.view.showSlideToast('Role Switched', `Viewing as ${newRole} • Profiles scoped to ${newRole}`, 'info', 2500);
    });
    }

    // Admin & RBAC Settings Modal Actions
    if (this.view.btnAdminSettings) {
      this.view.btnAdminSettings.addEventListener('click', () => {
        this.view.populateSettings(this.model.settings);
        this.view.toggleSettingsModal(true);
      });
    }

    const btnCloseSettings = document.getElementById('btn-close-settings-modal');
    if (btnCloseSettings) btnCloseSettings.addEventListener('click', () => this.view.toggleSettingsModal(false));
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    if (btnCancelSettings) btnCancelSettings.addEventListener('click', () => this.view.toggleSettingsModal(false));

    const btnSaveSettings = document.getElementById('btn-save-settings');
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        const newSettings = this.view.readSettingsFromForm();
        this.model.saveSettings(newSettings);
        this.view.toggleSettingsModal(false);
        this._renderCurrentState();
        this.view.showToast('✓ Admin System & RBAC Permission Settings saved & synchronized!');
      });
    }

    const btnResetSettings = document.getElementById('btn-reset-settings');
    if (btnResetSettings) {
      btnResetSettings.addEventListener('click', async (e) => {
        e.preventDefault();
        const choice = await this.view.openCustomDialog({
          title: 'System Settings Safe Reset',
          message: 'Choose an operational reset action for Spiritual Karim system settings and database cache.',
          icon: '⚠️',
          options: [
            { label: '🔄 Restore Factory Defaults', value: 'DEFAULTS', class: 'btn-danger' },
            { label: '☁️ Resync from Cloud Firebase', value: 'CLOUD_RESYNC', class: 'btn-gold' },
            { label: 'Cancel', value: false, class: 'btn-outline' }
          ]
        });

        if (choice === 'DEFAULTS') {
          const def = this.model.getDefaultSettings();
          this.model.saveSettings(def);
          this.view.populateSettings(def);
          this.view.enforceRBAC(this.model.getRoleMode(), def);
          this.view.showSlideToast('Reset Complete', 'System settings restored to factory defaults.', 'success', 3500);
        } else if (choice === 'CLOUD_RESYNC') {
          await this.model.fetchFromFirebaseRealtime();
          this.view.populateSettings(this.model.settings);
          this._renderCurrentState();
          this.view.showSlideToast('Cloud Synced', 'Settings and nodes resynchronized from Firebase RTDB.', 'success', 3500);
        }
      });
    }

    if (this.view.selectActiveProfile) {
      this.view.selectActiveProfile.addEventListener('change', (e) => {
        this.model.setActiveProfileId(e.target.value);
        this._renderCurrentState();
      });
    }

    if (this.view.profileDirectoryList) {
      this.view.profileDirectoryList.addEventListener('click', (e) => {
        const row = e.target.closest('.profile-item-row');
        if (row) {
          const id = row.getAttribute('data-id');
          this.model.setActiveProfileId(id);
          this._renderCurrentState();

          // Close mobile sidebar if open
          if (this.view.adminSidebar) {
            this.view.adminSidebar.classList.remove('mobile-open');
          }
          if (this.view.sidebarBackdrop) {
            this.view.sidebarBackdrop.classList.remove('open');
          }
        }
      });
    }

    // Toggle Payment Stamp in Top Box on Click
    if (this.view.displayPaymentStamp) {
      this.view.displayPaymentStamp.addEventListener('click', () => {
        const profile = this.model.getActiveProfile();
        const currentIsPaid = profile.isPaid !== false && profile.paymentStatus !== 'FREE';
        profile.isPaid = !currentIsPaid;
        profile.paymentStatus = profile.isPaid ? 'PAID' : 'FREE';
        this.model.saveProfiles(this.model.profiles);
        this.view._renderHeaderCard(profile, this.model.getRoleMode());
        if (this.view.inputPaymentStatus) {
          this.view.inputPaymentStatus.value = profile.paymentStatus;
        }
        this.view._updateJSONPreview(profile);
        this.view.showToast(`Membership stamp toggled to: ${profile.paymentStatus === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
      });
    }

    if (this.view.inputPaymentStatus) {
      this.view.inputPaymentStatus.addEventListener('change', (e) => {
        const profile = this.model.getActiveProfile();
        profile.paymentStatus = e.target.value;
        profile.isPaid = e.target.value === 'PAID';
        this.model.saveProfiles(this.model.profiles);
        this.view._renderHeaderCard(profile, this.model.getRoleMode());
        this.view._updateJSONPreview(profile);
      });
    }

    // Trainee Sadhak Stamp Click & Select Change across all 3 categories
    const bindTraineeStampEvents = (container) => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        const stampBtn = e.target.closest('.btn-toggle-trainee-stamp');
        if (stampBtn) {
          const itemId = stampBtn.getAttribute('data-item-id');
          const profile = this.model.getActiveProfile();
          const item = (profile.traineeSadhanas || []).find((ts, i) => (ts.id || i.toString()) === itemId);
          if (item) {
            const currentPaid = item.isPaid !== false && item.paymentStatus !== 'FREE';
            item.isPaid = !currentPaid;
            item.paymentStatus = item.isPaid ? 'PAID' : 'FREE';
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast(`"${item.title}" stamp set to ${item.paymentStatus === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
          }
        }
      });

      container.addEventListener('change', (e) => {
        if (e.target.classList.contains('ts-paid-select')) {
          const itemId = e.target.getAttribute('data-item-id');
          const val = e.target.value;
          const profile = this.model.getActiveProfile();
          const item = (profile.traineeSadhanas || []).find((ts, i) => (ts.id || i.toString()) === itemId);
          if (item) {
            item.paymentStatus = val;
            item.isPaid = val === 'PAID';
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast(`"${item.title}" updated to ${val === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
          }
        }
      });
    };

    bindTraineeStampEvents(this.view.traineeGroupSadhanas);
    bindTraineeStampEvents(this.view.traineeGroupRemedies);
    bindTraineeStampEvents(this.view.traineeGroupCleansing);

    // Create / Delete Profile
    const btnCreateProfile = document.getElementById('btn-create-profile');
    if (btnCreateProfile) {
      btnCreateProfile.addEventListener('click', () => {
        const p = this.model.createNewProfile();
        this._renderCurrentState();
        this.view.showToast(`New profile created: ${p.referenceCode}`);
      });
    }

    const btnDeleteProfile = document.getElementById('btn-delete-profile');
    if (btnDeleteProfile) {
      btnDeleteProfile.addEventListener('click', () => {
        if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
          alert('Action Prohibited: Devotee role is restricted from deleting profiles. Contact Master Administrator.');
          return;
        }
        const current = this.model.getActiveProfile();
        if (confirm(`Delete profile "${current.name}"?`)) {
          if (this.model.deleteActiveProfile()) {
            this._renderCurrentState();
            this.view.showToast('Profile deleted.');
          }
        }
      });
    }

    // Reference Code Generators
    const btnGenRefCode = document.getElementById('btn-gen-ref-code');
    if (btnGenRefCode) {
      btnGenRefCode.addEventListener('click', () => {
        const prefix = this.model.getRoleMode() === 'HEALER' ? 'SKHL' : (this.model.getRoleMode() === 'DEVOTEE' ? 'SKDV' : 'SKHM');
        const code = this.model.generate16DigitCode(prefix);
        this.view.inputRefCode.value = code;
        this.view.showToast(`Generated: ${code}`);
      });
    }

    const btnCopyRefCode = document.getElementById('btn-copy-ref-code');
    if (btnCopyRefCode) {
      btnCopyRefCode.addEventListener('click', () => {
        const code = this.view.inputRefCode.value;
        navigator.clipboard.writeText(code).then(() => {
          this.view.showToast(`Copied ${code}!`);
        });
      });
    }

    // Reset Identity
    const btnResetIdentity = document.getElementById('btn-reset-identity');
    if (btnResetIdentity) {
      btnResetIdentity.addEventListener('click', () => {
        if (confirm('Reset personal identity fields?')) {
          this.view.inputName.value = '';
          this.view.inputSelfTitle.value = '';
          this.view.inputPhone.value = '';
          this.view.inputEmail.value = '';
          this.view.inputCity.value = '';
          this.view.inputAddress.value = '';
          this.view.showToast('Identity reset.');
        }
      });
    }

    // Lineage: Children Add / Delete
    const btnAddChild = document.getElementById('btn-add-child');
    if (btnAddChild) {
      btnAddChild.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.lineage) p.lineage = {};
        if (!p.lineage.currentFamily) p.lineage.currentFamily = {};
        if (!p.lineage.currentFamily.children) p.lineage.currentFamily.children = [];
        p.lineage.currentFamily.children.push({ id: 'c' + Date.now().toString().slice(-4), name: '', gender: 'Son', ageOrNote: '' });
        this.view._renderChildren(p.lineage.currentFamily.children);
      });
    }

    if (this.view.childrenContainer) {
      this.view.childrenContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-child')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete lineage entries.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
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
        btn.addEventListener('click', () => {
          const p = this.model.getActiveProfile();
          const branchObj = this._getBranchObject(p, branchPath);
          if (!branchObj.siblings) branchObj.siblings = [];
          branchObj.siblings.push({ id: 's' + Date.now().toString().slice(-4), name: '', relation: 'Brother', spouseName: '', childrenSummary: '', isMarried: false, notes: '' });
          this.view._renderSiblings(container, branchObj.siblings, branchPath);
        });
      }

      if (container) {
        container.addEventListener('click', (e) => {
          if (e.target.classList.contains('btn-remove-sibling')) {
            if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
              alert('Action Prohibited: Devotee cannot delete lineage entries.');
              return;
            }
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            const p = this.model.getActiveProfile();
            const branchObj = this._getBranchObject(p, branchPath);
            branchObj.siblings.splice(idx, 1);
            this.view._renderSiblings(container, branchObj.siblings, branchPath);
          }
        });
      }
    };

    setupSiblingBranch('btn-add-sibling-current', this.view.siblingsCurrentContainer, 'current');
    setupSiblingBranch('btn-add-sibling-husband', this.view.siblingsHusbandContainer, 'husband');
    setupSiblingBranch('btn-add-sibling-wife', this.view.siblingsWifeContainer, 'wife');

    // House Clean: Add / Delete
    const handleAddHouseClean = () => {
      const p = this.model.getActiveProfile();
      if (!p.houseCleanLevels) p.houseCleanLevels = [];
      const nextNum = p.houseCleanLevels.length + 1;
      p.houseCleanLevels.push({
        id: 'hc-' + Date.now().toString().slice(-4),
        levelNumber: nextNum,
        levelTitle: `Level ${nextNum} — Custom House Clean`,
        status: 'IN_PROGRESS',
        cleanPercentage: 0,
        cleanedDetails: '',
        mentorCode: null,
        mentorName: null,
        mentorRemarks: null,
        approvalDate: null
      });
      this.view._renderHouseCleanCards(p.houseCleanLevels);
      this.view.showToast(`Added Level ${nextNum} House Clean record.`);
    };

    const btnAddHc = document.getElementById('btn-add-houseclean-record');
    if (btnAddHc) btnAddHc.addEventListener('click', handleAddHouseClean);
    const btnAddSeekerHc = document.getElementById('btn-add-seeker-clean-log');
    if (btnAddSeekerHc) btnAddSeekerHc.addEventListener('click', handleAddHouseClean);

    const handleHouseCleanDelete = (container) => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-houseclean')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete house clean records.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.houseCleanLevels.splice(idx, 1);
          this.view._renderHouseCleanCards(p.houseCleanLevels);
          this.view.showToast('House clean record deleted.');
        }
      });
    };
    handleHouseCleanDelete(this.view.devoteeHouseCleanContainer);
    handleHouseCleanDelete(this.view.seekerHouseCleanSummaryContainer);

    // Seeker Purpose & Custom Sadhanas
    const btnAddGoal = document.getElementById('btn-add-purpose-goal');
    if (btnAddGoal) {
      btnAddGoal.addEventListener('click', () => {
        const goal = prompt('Enter New Spiritual Goal / Purpose:', 'Kundalini Awakening & Family Protection');
        if (goal) {
          this.view.inputObjective.value = (this.view.inputObjective.value ? this.view.inputObjective.value + '\n• ' : '• ') + goal;
          this.view.showToast('Added goal to Purpose.');
        }
      });
    }

    const btnResetPurpose = document.getElementById('btn-reset-purpose');
    if (btnResetPurpose) {
      btnResetPurpose.addEventListener('click', () => {
        if (confirm('Clear spiritual purpose fields?')) {
          this.view.inputObjective.value = '';
          this.view.seekerAfflictionDuration.value = '';
          this.view.seekerKuldeviIssues.value = '';
          this.view.seekerTargetOutcome.value = '';
          this.view.showToast('Purpose cleared.');
        }
      });
    }

    const btnAddCustomSadhana = document.getElementById('btn-add-custom-sadhana');
    if (btnAddCustomSadhana) {
      btnAddCustomSadhana.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.interestedSadhanas) p.interestedSadhanas = [];
        p.interestedSadhanas.push({ id: 'is-' + Date.now().toString().slice(-4), name: 'Custom Sadhana Title', category: 'Sadhana', priority: 'High', status: 'Interested' });
        this.view._renderInterestedSadhanas(p.interestedSadhanas);
      });
    }

    if (this.view.interestedSadhanasContainer) {
      this.view.interestedSadhanasContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-interested-sadhana')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete sadhanas from enrolled queue.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.interestedSadhanas.splice(idx, 1);
          this.view._renderInterestedSadhanas(p.interestedSadhanas);
        }
      });
    }

    // Trainee Sadhak: Add / Delete
    const btnAddTraineeSadhana = document.getElementById('btn-add-trainee-sadhana');
    if (btnAddTraineeSadhana) {
      btnAddTraineeSadhana.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.traineeSadhanas) p.traineeSadhanas = [];
        p.traineeSadhanas.push({
          id: 'ts-' + Date.now().toString().slice(-4),
          sadhanaKey: 'sri_yantra',
          title: 'New In-Progress Sadhana',
          categoryDomain: 'sadhanas',
          isPaid: p.isPaid || false,
          paymentStatus: p.isPaid ? 'PAID' : 'FREE',
          level: 'Level 1 — Novice Initiation',
          dailyTarget: '11 Malas Daily',
          currentStreak: '1 Day',
          progressPercent: 10,
          status: 'In Progress',
          mentorCode: p.referredByCode || 'SKHM-ADM1-7788-9900',
          diaryNotes: 'Initial mantra attunement started.'
        });
        this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas);
        this.view.showToast('Added In-Progress Sadhana.');
      });
    }

    const handleTraineeDelete = (container) => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-trainee-item')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete trainee sadhanas.');
            return;
          }
          const itemId = e.target.getAttribute('data-item-id');
          const p = this.model.getActiveProfile();
          p.traineeSadhanas = p.traineeSadhanas.filter((ts, i) => (ts.id || i.toString()) !== itemId);
          this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas);
          this.view.showToast('In-progress sadhana deleted.');
        }
      });
    };
    handleTraineeDelete(this.view.traineeGroupSadhanas);
    handleTraineeDelete(this.view.traineeGroupRemedies);
    handleTraineeDelete(this.view.traineeGroupCleansing);

    // Healer Connect: Add / Delete
    const btnAddCompletedSadhana = document.getElementById('btn-add-completed-sadhana');
    if (btnAddCompletedSadhana) {
      btnAddCompletedSadhana.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.healerCompletedSadhanas) p.healerCompletedSadhanas = [];
        p.healerCompletedSadhanas.push({
          id: 'hcs-' + Date.now().toString().slice(-4),
          title: 'New Completed Master Sadhana',
          levelCompleted: 'Level 3 — Healer Acharya',
          completionDate: new Date().toISOString().split('T')[0],
          status: 'Certified Master',
          seekersGuidedCount: 0,
          authorizedToGuide: true,
          sealCode: 'SKHM-SEAL-' + Math.random().toString(36).substr(2, 4).toUpperCase()
        });
        this.view._renderHealerCompleted(p.healerCompletedSadhanas);
        this.view.showToast('Added Completed Sadhana Credential.');
      });
    }

    if (this.view.healerCompletedSadhanasContainer) {
      this.view.healerCompletedSadhanasContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-healer-sadhana')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete master credentials.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.healerCompletedSadhanas.splice(idx, 1);
          this.view._renderHealerCompleted(p.healerCompletedSadhanas);
          this.view.showToast('Completed sadhana credential deleted.');
        }
      });
    }

    const btnAddNetDevotee = document.getElementById('btn-add-connected-devotee');
    if (btnAddNetDevotee) {
      btnAddNetDevotee.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.healerNetwork) p.healerNetwork = [];
        p.healerNetwork.push({
          id: 'net-' + Date.now().toString().slice(-4),
          name: 'Connected Devotee Name',
          refCode: this.model.generate16DigitCode('SKHM'),
          role: 'Devotee (Level 5)',
          activeCases: 1
        });
        this.view._renderHealerNetwork(p.healerNetwork);
      });
    }

    if (this.view.healerNetworkContainer) {
      this.view.healerNetworkContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-network-devotee')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot unlink network entries.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.healerNetwork.splice(idx, 1);
          this.view._renderHealerNetwork(p.healerNetwork);
          this.view.showToast('Devotee unlinked.');
        }
      });
    }

    // Form Save
    if (this.view.form) {
      this.view.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._saveFormChanges();
      });
    }

    const btnSaveProfile = document.getElementById('btn-save-profile');
    if (btnSaveProfile) {
      btnSaveProfile.addEventListener('click', () => {
        this._saveFormChanges();
      });
    }

    // JSON Drawer
    const btnToggleJson = document.getElementById('btn-toggle-json-drawer');
    if (btnToggleJson) btnToggleJson.addEventListener('click', () => this.view.toggleJsonDrawer(true));
    const btnCloseJson = document.getElementById('btn-close-json-drawer');
    if (btnCloseJson) btnCloseJson.addEventListener('click', () => this.view.toggleJsonDrawer(false));
    const jsonBackdrop = document.getElementById('json-drawer-backdrop');
    if (jsonBackdrop) jsonBackdrop.addEventListener('click', () => this.view.toggleJsonDrawer(false));

    const btnCopyJson = document.getElementById('btn-copy-json-code');
    if (btnCopyJson) {
      btnCopyJson.addEventListener('click', () => {
        navigator.clipboard.writeText(this.view.jsonPreviewCode.textContent).then(() => {
          this.view.showToast('Profile JSON copied to clipboard!');
        });
      });
    }

    const btnDownloadJson = document.getElementById('btn-download-json-file');
    if (btnDownloadJson) {
      btnDownloadJson.addEventListener('click', () => {
        const active = this.model.getActiveProfile();
        const code = JSON.stringify(active, null, 2);
        const blob = new Blob([code], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `healer_profile_${active.referenceCode}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const btnImportJson = document.getElementById('btn-import-json');
    if (btnImportJson) btnImportJson.addEventListener('click', () => this.view.toggleImportModal(true));
    const btnCloseImport = document.getElementById('btn-close-import-modal');
    if (btnCloseImport) btnCloseImport.addEventListener('click', () => this.view.toggleImportModal(false));

    const btnExecImport = document.getElementById('btn-execute-import');
    if (btnExecImport) {
      btnExecImport.addEventListener('click', () => {
        const raw = document.getElementById('import-json-textarea').value.trim();
        try {
          const parsed = JSON.parse(raw);
          if (!parsed.name || !parsed.referenceCode) throw new Error('Missing name or referenceCode in payload.');
          parsed.id = parsed.id || 'prof-' + Date.now();
          this.model.profiles.push(parsed);
          this.model.saveProfiles(this.model.profiles);
          this.model.setActiveProfileId(parsed.id);
          this.view.toggleImportModal(false);
          this._renderCurrentState();
          this.view.showToast(`Imported profile: ${parsed.name}`);
        } catch (err) {
          alert('Invalid JSON payload: ' + err.message);
        }
      });
    }

    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        const all = JSON.stringify(this.model.profiles, null, 2);
        const blob = new Blob([all], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spiritual_karim_all_profiles.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.view.showToast('Exported all profiles JSON for Android app.');
      });
    }

    // App Hierarchy Tiers Legend Click -> Open Left Flyout Panel
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const tier = parseInt(item.getAttribute('data-tier'), 10);
        this.view.openTierPanel(tier, this.model.profiles, this.model.activeProfileId);
        this.view.showToast(`📂 Opened Tier ${tier} Profiles Panel`);
      });
    });

    if (this.view.btnCloseTierPanel) {
      this.view.btnCloseTierPanel.addEventListener('click', () => {
        this.view.closeTierPanel();
      });
    }

    if (this.view.tierPanelProfilesList) {
      this.view.tierPanelProfilesList.addEventListener('click', (e) => {
        const card = e.target.closest('.tier-panel-profile-card');
        if (card) {
          const id = card.getAttribute('data-id');
          this.model.setActiveProfileId(id);
          this._renderCurrentState();

          // Highlight card in tier panel
          this.view.tierPanelProfilesList.querySelectorAll('.tier-panel-profile-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          const activeP = this.model.getActiveProfile();
          this.view.showToast(`🚀 Viewing profile: ${activeP.name}`);
        }
      });
    }

    if (this.view.inputTierPanelSearch) {
      this.view.inputTierPanelSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = (this.view.currentTierProfiles || []).filter(p => 
          (p.name && p.name.toLowerCase().includes(q)) || 
          (p.referenceCode && p.referenceCode.toLowerCase().includes(q))
        );
        const metaColor = { 1: '#8b5cf6', 2: '#10b981', 3: '#f59e0b', 4: '#3b82f6' }[this.view.currentOpenTier] || '#d4af37';
        this.view._renderTierPanelCards(filtered, this.model.activeProfileId, metaColor);
      });
    }

    if (this.view.btnOpenTreeView) {
      this.view.btnOpenTreeView.addEventListener('click', () => {
        if (this.view.bodyTreeTierFilter) this.view.bodyTreeTierFilter.value = 'ALL';
        this.switchMainTab('tab-genealogy-tree');
        this.view.renderInBodyHierarchyTree(this.model.profiles, null, '', this.view.inBodyTreePanState?.layoutMode || 'cluster');
        setTimeout(() => {
          this.view.smartFitInBodyTree();
        }, 100);
      });
    }

    // In-Body Tree Search & Filter Events
    if (this.view.bodyTreeSearchInput) {
      this.view.bodyTreeSearchInput.addEventListener('input', (e) => {
        const q = e.target.value;
        const filterVal = this.view.bodyTreeTierFilter ? this.view.bodyTreeTierFilter.value : 'ALL';
        const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
        this.view.renderInBodyHierarchyTree(this.model.profiles, tier, q, this.view.inBodyTreePanState?.layoutMode || 'cluster');
      });
    }

    if (this.view.btnClearTreeSearch) {
      this.view.btnClearTreeSearch.addEventListener('click', () => {
        if (this.view.bodyTreeSearchInput) {
          this.view.bodyTreeSearchInput.value = '';
          const filterVal = this.view.bodyTreeTierFilter ? this.view.bodyTreeTierFilter.value : 'ALL';
          const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
          this.view.renderInBodyHierarchyTree(this.model.profiles, tier, '', this.view.inBodyTreePanState?.layoutMode || 'cluster');
        }
      });
    }

    if (this.view.bodyTreeTierFilter) {
      this.view.bodyTreeTierFilter.addEventListener('change', (e) => {
        const filterVal = e.target.value;
        const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
        const q = this.view.bodyTreeSearchInput ? this.view.bodyTreeSearchInput.value : '';
        this.view.renderInBodyHierarchyTree(this.model.profiles, tier, q, this.view.inBodyTreePanState?.layoutMode || 'cluster');
        setTimeout(() => this.view.smartFitInBodyTree(), 80);
      });
    }

    // Layout Mode Segmented Toggles
    if (this.view.btnLayoutCluster) {
      this.view.btnLayoutCluster.addEventListener('click', () => {
        this.view.inBodyTreePanState.layoutMode = 'cluster';
        this.view.btnLayoutCluster.classList.add('active');
        if (this.view.btnLayoutSpiderweb) this.view.btnLayoutSpiderweb.classList.remove('active');
        const filterVal = this.view.bodyTreeTierFilter ? this.view.bodyTreeTierFilter.value : 'ALL';
        const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
        const q = this.view.bodyTreeSearchInput ? this.view.bodyTreeSearchInput.value : '';
        this.view.renderInBodyHierarchyTree(this.model.profiles, tier, q, 'cluster');
        this.view.showToast('🌳 Layout switched: Clustered MLM Sub-trees');
      });
    }

    if (this.view.btnLayoutSpiderweb) {
      this.view.btnLayoutSpiderweb.addEventListener('click', () => {
        this.view.inBodyTreePanState.layoutMode = 'spiderweb';
        this.view.btnLayoutSpiderweb.classList.add('active');
        if (this.view.btnLayoutCluster) this.view.btnLayoutCluster.classList.remove('active');
        const filterVal = this.view.bodyTreeTierFilter ? this.view.bodyTreeTierFilter.value : 'ALL';
        const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
        const q = this.view.bodyTreeSearchInput ? this.view.bodyTreeSearchInput.value : '';
        this.view.renderInBodyHierarchyTree(this.model.profiles, tier, q, 'spiderweb');
        this.view.showToast('🕸️ Layout switched: Spiderweb Matrix Flow');
      });
    }

    // In-Body Tree Canvas Pan/Zoom Events Initialization
    this.view._initInBodyTreePanZoomEvents();

    // Node Click & Double Click on In-Body Canvas
    if (this.view.bodyTreeCanvasViewport) {
      this.view.bodyTreeCanvasViewport.addEventListener('click', (e) => {
        const node = e.target.closest('.spiderweb-node');
        if (node) {
          const profileId = node.getAttribute('data-profile-id');
          const profile = this.model.profiles.find(p => p.id === profileId) || {
            id: profileId,
            name: node.querySelector('.person-node-name')?.textContent || 'Member',
            referenceCode: 'SKHM-MEM1-8899-0011',
            level: node.getAttribute('data-tier') || 4,
            isPaid: true
          };
          this.view.renderTreeProfileDrawer(profile);
          this.view.toggleTreeProfileDrawer(true);
        }
      });

      // Double Click -> Jump straight to profile
      this.view.bodyTreeCanvasViewport.addEventListener('dblclick', (e) => {
        const node = e.target.closest('.spiderweb-node');
        if (node) {
          const profileId = node.getAttribute('data-profile-id');
          if (profileId && this.model.profiles.some(p => p.id === profileId)) {
            this.model.setActiveProfileId(profileId);
            this.view.toggleTreeProfileDrawer(false);
            this._renderCurrentState();
            this.switchMainTab('tab-devotee-personal');
            const active = this.model.getActiveProfile();
            this.view.showToast(`🚀 Switched to active workspace of "${active.name}"`);
          }
        }
      });

      // Context Menu (Right Click) -> Open Node Action Dialog
      this.view.bodyTreeCanvasViewport.addEventListener('contextmenu', (e) => {
        const node = e.target.closest('.spiderweb-node');
        if (node) {
          e.preventDefault();
          const profileId = node.getAttribute('data-profile-id');
          const profile = this.model.profiles.find(p => p.id === profileId) || {
            id: profileId,
            name: node.querySelector('.person-node-name')?.textContent || 'Member',
            referenceCode: 'SKHM-MEM1-8899-0011',
            level: node.getAttribute('data-tier') || 4
          };
          this.view.openNodeActionDialog(profile);
        }
      });
    }

    // Node Action Dialog Actions
    if (this.view.nodeActionDialog) {
      this.view.nodeActionDialog.addEventListener('click', (e) => {
        const btnEdit = e.target.closest('#btn-node-opt-edit');
        if (btnEdit) {
          const pid = btnEdit.getAttribute('data-profile-id');
          if (pid && this.model.profiles.some(p => p.id === pid)) {
            this.model.setActiveProfileId(pid);
            this._renderCurrentState();
            this.switchMainTab('tab-devotee-personal');
          }
          this.view.closeNodeActionDialog();
          return;
        }

        const btnShare = e.target.closest('#btn-node-opt-share');
        if (btnShare) {
          this.view.closeNodeActionDialog();
          const p = this.model.getActiveProfile();
          this.view.renderSharePairingModal(p, this.model.getPairingInvites(), this.model.settings);
          this.view.toggleSharePairingModal(true);
          return;
        }

        const btnCopy = e.target.closest('#btn-node-opt-copy');
        if (btnCopy) {
          const code = btnCopy.getAttribute('data-code');
          if (code) {
            navigator.clipboard.writeText(code).then(() => {
              this.view.showToast(`📋 Copied reference code: ${code}`);
            });
          }
          this.view.closeNodeActionDialog();
          return;
        }

        const btnInspect = e.target.closest('#btn-node-opt-inspect');
        if (btnInspect) {
          const pid = btnInspect.getAttribute('data-profile-id');
          const prof = this.model.profiles.find(p => p.id === pid);
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
      this.view.btnCloseNodeDialog.addEventListener('click', () => this.view.closeNodeActionDialog());
    }
    if (this.view.btnCloseNodeDialogFooter) {
      this.view.btnCloseNodeDialogFooter.addEventListener('click', () => this.view.closeNodeActionDialog());
    }

    if (this.view.btnCloseTreeModal) {
      this.view.btnCloseTreeModal.addEventListener('click', () => {
        this.view.toggleTreeModal(false);
      });
    }

    // Modal Tree fallback interactions
    if (this.view.treeCanvasViewport) {
      this.view.treeCanvasViewport.addEventListener('click', (e) => {
        const node = e.target.closest('.spiderweb-node') || e.target.closest('.mlm-tree-node');
        if (node) {
          const profileId = node.getAttribute('data-profile-id');
          const profile = this.model.profiles.find(p => p.id === profileId);
          if (profile) {
            this.view.renderTreeProfileDrawer(profile);
            this.view.toggleTreeProfileDrawer(true);
          }
        }
      });
    }

    if (this.view.btnCloseTreeDrawer) {
      this.view.btnCloseTreeDrawer.addEventListener('click', () => {
        this.view.toggleTreeProfileDrawer(false);
      });
    }

    if (this.view.treeDrawerBackdrop) {
      this.view.treeDrawerBackdrop.addEventListener('click', () => {
        this.view.toggleTreeProfileDrawer(false);
      });
    }

    if (this.view.btnTreeLoadProfile) {
      this.view.btnTreeLoadProfile.addEventListener('click', () => {
        const profileId = this.view.btnTreeLoadProfile.getAttribute('data-profile-id');
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
      this.view.btnAdminSettings.addEventListener('click', () => {
        if (this.model.getRoleMode() !== 'MASTER') {
          this.view.showToast('🔒 Admin Settings is restricted to Master role.');
          return;
        }
        this.view.populateSettings(this.model.settings);
        this.view.toggleSettingsModal(true);
      });
    }

    if (this.view.btnCloseAdminSettings) {
      this.view.btnCloseAdminSettings.addEventListener('click', () => {
        this.view.toggleSettingsModal(false);
      });
    }

    if (this.view.btnSaveSettings) {
      this.view.btnSaveSettings.addEventListener('click', () => {
        const newSettings = this.view.readSettingsFromForm();
        this.model.saveSettings(newSettings);
        this.view.enforceRBAC(this.model.getRoleMode(), newSettings);
        this.view.toggleSettingsModal(false);
        this.view.showToast('✓ Admin Settings successfully saved & synchronized!');
      });
    }

    if (this.view.btnResetSettings) {
      this.view.btnResetSettings.addEventListener('click', () => {
        if (confirm('Factory reset all admin settings to system defaults?')) {
          const def = this.model.getDefaultSettings();
          this.model.saveSettings(def);
          this.view.populateSettings(def);
          this.view.enforceRBAC(this.model.getRoleMode(), def);
          this.view.showToast('Admin settings reset to defaults.');
        }
      });
    }

    // ==============================================================
    // Top Right: Share & Pair (24-Hour Protocol) Modal Events
    // ==============================================================
    if (this.view.btnQuickSharePairing) {
      this.view.btnQuickSharePairing.addEventListener('click', () => {
        const profile = this.model.getActiveProfile();
        const invites = this.model.getPairingInvites();
        this.view._renderSharePairingModal(profile, invites);
        this.view.toggleSharePairingModal(true);
      });
    }

    if (this.view.btnCloseSharePairingModal) {
      this.view.btnCloseSharePairingModal.addEventListener('click', () => {
        this.view.toggleSharePairingModal(false);
      });
    }

    if (this.view.sharePairingModalBody) {
      this.view.sharePairingModalBody.addEventListener('click', (e) => {
        const approveBtn = e.target.closest('.btn-approve-pairing');
        if (approveBtn) {
          const inviteId = approveBtn.getAttribute('data-invite-id');
          const approved = this.model.approvePairingInvite(inviteId);
          if (approved) {
            const profile = this.model.getActiveProfile();
            const invites = this.model.getPairingInvites();
            this.view._renderSharePairingModal(profile, invites);
            this._renderCurrentState();
            this.view.showToast(`✓ Approved & Linked "${approved.seekerName}" to your downline!`);
          }
          return;
        }

        const rejectBtn = e.target.closest('.btn-reject-pairing');
        if (rejectBtn) {
          const inviteId = rejectBtn.getAttribute('data-invite-id');
          const rejected = this.model.rejectPairingInvite(inviteId);
          if (rejected) {
            const profile = this.model.getActiveProfile();
            const invites = this.model.getPairingInvites();
            this.view._renderSharePairingModal(profile, invites);
            this.view.showToast(`Pairing request rejected for "${rejected.seekerName}".`);
          }
          return;
        }

        const resendBtn = e.target.closest('.btn-resend-pairing');
        if (resendBtn) {
          const inviteId = resendBtn.getAttribute('data-invite-id');
          const res = this.model.resendPairingInvite(inviteId);
          if (res && res.error) {
            alert(res.message);
            return;
          }
          if (res) {
            const profile = this.model.getActiveProfile();
            const invites = this.model.getPairingInvites();
            this.view._renderSharePairingModal(profile, invites);
            this.view.showToast(`🔄 24-Hour window renewed for "${res.seekerName}"!`);
          }
          return;
        }

        const simBtn = e.target.closest('#btn-simulate-new-seeker');
        if (simBtn) {
          const profile = this.model.getActiveProfile();
          const names = ['Ramesh Sharma', 'Pooja Verma', 'Amit Trivedi', 'Sunita Rao', 'Deepak Joshi'];
          const randomName = names[Math.floor(Math.random() * names.length)];
          const simInvite = {
            id: 'inv-' + Date.now().toString().slice(-6),
            seekerName: randomName,
            seekerPhone: '+91 ' + Math.floor(7000000000 + Math.random() * 2999999999),
            sponsorCode: profile.referenceCode || 'SKHM-ADM1-7788-9900',
            seekerDeviceModel: 'OnePlus / Galaxy Android 14',
            hardwareNonce: 'HW-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            status: 'PENDING',
            createdAtMs: Date.now(),
            expiresAtMs: Date.now() + 24 * 60 * 60 * 1000,
            formattedCreatedTime: 'Just Now',
            resendCount: 0
          };
          const currentInvites = this.model.getPairingInvites();
          currentInvites.unshift(simInvite);
          this.model.savePairingInvites(currentInvites);
          this.view._renderSharePairingModal(profile, currentInvites);
          this.view.showToast(`📲 Simulated incoming 24h pairing request from ${randomName}`);
        }
      });
    }

    // ==============================================================
    // FIREBASE REALTIME DATABASE EVENT LISTENERS
    // ==============================================================

    // Sidebar RTDB Open Button
    const btnSidebarRtdb = document.getElementById('btn-sidebar-open-rtdb');
    if (btnSidebarRtdb) {
      btnSidebarRtdb.addEventListener('click', () => {
        this.switchMainTab('tab-firebase-data');
        this.view.renderFirebaseDataTable(this.model);
      });
    }

    // Sidebar Shortcut Chips
    document.querySelectorAll('.rtdb-shortcut-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const drillKey = btn.getAttribute('data-rtdb-drill');
        this.switchMainTab('tab-firebase-data');
        this.view.rtdbActiveRootFilter = drillKey || 'ALL';
        document.querySelectorAll('#rtdb-filter-chips .rtdb-chip-btn').forEach(cb => {
          cb.classList.toggle('active', cb.getAttribute('data-rtdb-root') === this.view.rtdbActiveRootFilter);
        });
        this.view.renderFirebaseDataTable(this.model);
      });
    });

    // Copy RTDB URL
    const btnCopyRtdbUrl = document.getElementById('btn-copy-rtdb-url');
    if (btnCopyRtdbUrl) {
      btnCopyRtdbUrl.addEventListener('click', () => {
        const urlEl = document.getElementById('rtdb-url-display');
        if (urlEl) {
          navigator.clipboard.writeText(urlEl.textContent.trim());
          this.view.showToast('📋 Firebase RTDB URL copied!', 'success');
        }
      });
    }

    // RTDB Search Input
    const inputRtdbSearch = document.getElementById('input-rtdb-search');
    if (inputRtdbSearch) {
      inputRtdbSearch.addEventListener('input', (e) => {
        this.view.rtdbSearchQuery = e.target.value;
        this.view.renderFirebaseDataTable(this.model);
      });
    }

    // RTDB Root Filter Chips
    const rtdbFilterChips = document.getElementById('rtdb-filter-chips');
    if (rtdbFilterChips) {
      rtdbFilterChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.rtdb-chip-btn');
        if (!chip) return;
        const root = chip.getAttribute('data-rtdb-root');
        this.view.rtdbActiveRootFilter = root;
        this.view.rtdbActiveBreadcrumbPath = root === 'ALL' ? '/' : `/${root}`;
        document.querySelectorAll('#rtdb-filter-chips .rtdb-chip-btn').forEach(cb => {
          cb.classList.toggle('active', cb === chip);
        });
        this.view.renderFirebaseDataTable(this.model);
      });
    }

    // RTDB Breadcrumbs Clicks
    const rtdbBreadcrumbs = document.getElementById('rtdb-breadcrumbs');
    if (rtdbBreadcrumbs) {
      rtdbBreadcrumbs.addEventListener('click', (e) => {
        const bc = e.target.closest('.rtdb-bc-item');
        if (!bc) return;
        const pathVal = bc.getAttribute('data-rtdb-bc');
        if (pathVal === '/') {
          this.view.rtdbActiveRootFilter = 'ALL';
        } else {
          this.view.rtdbActiveRootFilter = pathVal.replace(/^\/+/, '').split('/')[0];
        }
        this.view.rtdbActiveBreadcrumbPath = pathVal;
        document.querySelectorAll('#rtdb-filter-chips .rtdb-chip-btn').forEach(cb => {
          cb.classList.toggle('active', cb.getAttribute('data-rtdb-root') === this.view.rtdbActiveRootFilter);
        });
        this.view.renderFirebaseDataTable(this.model);
      });
    }

    // RTDB Refresh
    const btnRtdbRefresh = document.getElementById('btn-rtdb-refresh');
    if (btnRtdbRefresh) {
      btnRtdbRefresh.addEventListener('click', () => {
        this.view.renderFirebaseDataTable(this.model);
        this.view.showToast('🔄 Database reloaded!', 'success');
      });
    }

    // RTDB Expand All
    const btnRtdbExpandAll = document.getElementById('btn-rtdb-expand-all');
    if (btnRtdbExpandAll) {
      btnRtdbExpandAll.addEventListener('click', () => {
        const tree = this.model.getFirebaseRealtimeTree();
        const allPaths = new Set();
        const collectPaths = (obj, p) => {
          if (obj && typeof obj === 'object') {
            allPaths.add(p);
            if (Array.isArray(obj)) obj.forEach((item, idx) => collectPaths(item, p + '/' + idx));
            else Object.keys(obj).forEach(k => collectPaths(obj[k], p + '/' + k));
          }
        };
        Object.keys(tree).forEach(k => collectPaths(tree[k], k));
        this.view.rtdbExpandedPaths = allPaths;
        this.view.renderFirebaseDataTable(this.model);
        this.view.showToast('🔽 All nodes expanded.', 'info');
      });
    }

    // RTDB Collapse All
    const btnRtdbCollapseAll = document.getElementById('btn-rtdb-collapse-all');
    if (btnRtdbCollapseAll) {
      btnRtdbCollapseAll.addEventListener('click', () => {
        this.view.rtdbExpandedPaths.clear();
        this.view.renderFirebaseDataTable(this.model);
        this.view.showToast('🔼 All nodes collapsed.', 'info');
      });
    }

    // RTDB Export JSON
    const btnRtdbExport = document.getElementById('btn-rtdb-export-json');
    if (btnRtdbExport) {
      btnRtdbExport.addEventListener('click', () => {
        const fullTree = this.model.getFirebaseRealtimeTree();
        const jsonStr = JSON.stringify(fullTree, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = 'spiritual_karim_firebase_rtdb_' + Date.now() + '.json';
        a.click(); URL.revokeObjectURL(url);
        this.view.showToast('📥 Exported Firebase RTDB JSON!', 'success');
      });
    }

    // RTDB Add Node Open
    const btnRtdbAdd = document.getElementById('btn-rtdb-add-node');
    if (btnRtdbAdd) {
      btnRtdbAdd.addEventListener('click', () => { this.view.openRtdbAddModal(''); });
    }

    // RTDB Table Delegated Events
    const rtdbTbody = document.getElementById('rtdb-table-tbody');
    if (rtdbTbody) {
      rtdbTbody.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-rtdb-toggle]');
        if (toggleBtn) {
          const p = toggleBtn.getAttribute('data-rtdb-toggle');
          if (this.view.rtdbExpandedPaths.has(p)) this.view.rtdbExpandedPaths.delete(p);
          else this.view.rtdbExpandedPaths.add(p);
          this.view.renderFirebaseDataTable(this.model);
          return;
        }
        const inspectBtn = e.target.closest('[data-rtdb-inspect]');
        if (inspectBtn) {
          const p = inspectBtn.getAttribute('data-rtdb-inspect');
          this.view.openRtdbInspector(p, this.model.getRealtimeNodeByPath(p));
          return;
        }
        const copyBtn = e.target.closest('[data-rtdb-copy]');
        if (copyBtn) {
          const p = copyBtn.getAttribute('data-rtdb-copy');
          const nd = this.model.getRealtimeNodeByPath(p);
          navigator.clipboard.writeText(typeof nd === 'object' ? JSON.stringify(nd, null, 2) : String(nd));
          this.view.showToast('📋 Copied to clipboard!', 'success');
          return;
        }
        const addChildBtn = e.target.closest('[data-rtdb-add-child]');
        if (addChildBtn) { this.view.openRtdbAddModal(addChildBtn.getAttribute('data-rtdb-add-child')); return; }
        const deleteBtn = e.target.closest('[data-rtdb-delete]');
        if (deleteBtn) {
          const p = deleteBtn.getAttribute('data-rtdb-delete');
          if (confirm('Delete node /' + p + '?')) {
            this.model.deleteRealtimeNodeByPath(p);
            this.view.renderFirebaseDataTable(this.model);
            this.view.showToast('🗑️ Deleted /' + p, 'info');
          }
          return;
        }
      });
    }

    // Inspector Modal Close & Save
    const modalInspector = document.getElementById('rtdb-inspector-modal');
    ['btn-close-rtdb-inspector', 'btn-close-rtdb-inspector-footer'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn && modalInspector) btn.addEventListener('click', () => { modalInspector.classList.remove('active'); modalInspector.setAttribute('aria-hidden', 'true'); });
    });
    const btnCopyInspectJson = document.getElementById('btn-rtdb-copy-inspect-json');
    if (btnCopyInspectJson) btnCopyInspectJson.addEventListener('click', () => {
      const ed = document.getElementById('rtdb-inspector-json-editor');
      if (ed) { navigator.clipboard.writeText(ed.value); this.view.showToast('📋 JSON copied!', 'success'); }
    });
    const btnSaveNodeJson = document.getElementById('btn-rtdb-save-node-json');
    if (btnSaveNodeJson) btnSaveNodeJson.addEventListener('click', () => {
      const ed = document.getElementById('rtdb-inspector-json-editor');
      const st = document.getElementById('rtdb-inspector-status');
      if (!ed) return;
      const tp = ed.getAttribute('data-target-path');
      try {
        let pv; try { pv = JSON.parse(ed.value); } catch { pv = ed.value; }
        this.model.setRealtimeNodeByPath(tp, pv);
        if (st) st.textContent = '✅ Saved!';
        this.view.renderFirebaseDataTable(this.model);
        this.view.showToast('💾 Saved /' + tp, 'success');
        setTimeout(() => { if (modalInspector) { modalInspector.classList.remove('active'); modalInspector.setAttribute('aria-hidden', 'true'); } }, 600);
      } catch (err) { if (st) st.textContent = '❌ Error!'; this.view.showToast('Error: ' + err.message, 'danger'); }
    });

    // Add Node Modal Close & Submit
    const modalAdd = document.getElementById('rtdb-add-node-modal');
    ['btn-close-rtdb-add', 'btn-close-rtdb-add-footer'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn && modalAdd) btn.addEventListener('click', () => { modalAdd.classList.remove('active'); modalAdd.setAttribute('aria-hidden', 'true'); });
    });
    const btnSubmitAddNode = document.getElementById('btn-rtdb-submit-add-node');
    if (btnSubmitAddNode) btnSubmitAddNode.addEventListener('click', () => {
      const pi = document.getElementById('rtdb-add-target-path');
      const ki = document.getElementById('rtdb-add-key-name');
      const ti = document.getElementById('rtdb-add-key-type');
      const vi = document.getElementById('rtdb-add-value');
      const pp = (pi.value || '').replace(/^\/+/, '');
      const kn = (ki.value || '').trim();
      const kt = ti.value;
      const rv = (vi.value || '').trim();
      if (!kn) { alert('Key Name required.'); return; }
      let pv = rv;
      if (kt === 'number') pv = Number(rv) || 0;
      else if (kt === 'boolean') pv = rv.toLowerCase() === 'true';
      else if (kt === 'object') { try { pv = JSON.parse(rv || '{}'); } catch { pv = {}; } }
      else if (kt === 'array') { try { pv = JSON.parse(rv || '[]'); } catch { pv = []; } }
      const fp = pp ? pp + '/' + kn : kn;
      this.model.setRealtimeNodeByPath(fp, pv);
      this.view.rtdbExpandedPaths.add(pp || kn);
      this.view.renderFirebaseDataTable(this.model);
      this.view.showToast('➕ Created /' + fp, 'success');
      if (modalAdd) { modalAdd.classList.remove('active'); modalAdd.setAttribute('aria-hidden', 'true'); }
    });

  }

  _getBranchObject(profile, branch) {
    if (!profile.lineage) profile.lineage = {};
    if (branch === 'current') {
      if (!profile.lineage.currentFamily) profile.lineage.currentFamily = {};
      return profile.lineage.currentFamily;
    }
    if (branch === 'husband') {
      if (!profile.lineage.husbandAncestral) profile.lineage.husbandAncestral = {};
      return profile.lineage.husbandAncestral;
    }
    if (branch === 'wife') {
      if (!profile.lineage.wifeAncestral) profile.lineage.wifeAncestral = {};
      return profile.lineage.wifeAncestral;
    }
    return {};
  }

  _saveFormChanges() {
    const active = this.model.getActiveProfile();

    const selectedRemedies = [];
    document.querySelectorAll('input[name="remedy-checkbox"]:checked').forEach(cb => {
      selectedRemedies.push(cb.value);
    });

    const children = [];
    if (this.view.childrenContainer) {
      this.view.childrenContainer.querySelectorAll('.dynamic-row-item').forEach(row => {
        const name = row.querySelector('.child-name-input').value.trim();
        const gender = row.querySelector('.child-gender-select').value;
        const ageOrNote = row.querySelector('.child-notes-input').value.trim();
        if (name) children.push({ id: 'c' + Math.random().toString(36).substr(2, 5), name, gender, ageOrNote });
      });
    }

    const readSiblings = (container) => {
      if (!container) return [];
      const siblings = [];
      container.querySelectorAll('.dynamic-row-item').forEach(row => {
        const name = row.querySelector('.sibling-name-input').value.trim();
        const relation = row.querySelector('.sibling-relation-select').value;
        const spouseName = row.querySelector('.sibling-spouse-input').value.trim();
        const childrenSummary = row.querySelector('.sibling-children-input').value.trim();
        if (name) {
          siblings.push({ id: 's' + Math.random().toString(36).substr(2, 5), name, relation, spouseName, childrenSummary, isMarried: spouseName.length > 0, notes: '' });
        }
      });
      return siblings;
    };

    const houseCleanLevels = [];
    if (this.view.devoteeHouseCleanContainer) {
      this.view.devoteeHouseCleanContainer.querySelectorAll('.houseclean-card').forEach((card, idx) => {
        const levelTitle = card.querySelector('.houseclean-level-title').textContent.replace('🧹', '').trim();
        const status = card.querySelector('.hc-status-select').value;
        const cleanPercentage = parseInt(card.querySelector('.hc-percentage-input').value, 10) || 0;
        const approvalDate = card.querySelector('.hc-date-input').value.trim();
        const cleanedDetails = card.querySelector('.hc-details-textarea').value.trim();
        const mentorRaw = card.querySelector('.hc-mentor-input').value.trim();
        const mentorRemarks = card.querySelector('.hc-remarks-input').value.trim();

        houseCleanLevels.push({
          id: active.houseCleanLevels?.[idx]?.id || 'hc-' + (idx + 1),
          levelNumber: idx + 1,
          levelTitle,
          status,
          cleanPercentage,
          cleanedDetails,
          mentorCode: active.houseCleanLevels?.[idx]?.mentorCode || active.referredByCode || 'SKHM-ADM1-7788-9900',
          mentorName: mentorRaw || 'Spiritual Mentor',
          mentorRemarks,
          approvalDate
        });
      });
    }

    const interestedSadhanas = [];
    if (this.view.interestedSadhanasContainer) {
      this.view.interestedSadhanasContainer.querySelectorAll('.dynamic-row-item').forEach(row => {
        const key = row.getAttribute('data-sadhana-key') || '';
        const name = row.querySelector('.is-name-input').value.trim();
        const category = row.querySelector('.is-category-input').value.trim();
        const priority = row.querySelector('.is-priority-select').value;
        const status = row.querySelector('.is-status-select').value;
        if (name) interestedSadhanas.push({ id: key || 'is-' + Math.random().toString(36).substr(2, 5), name, category, priority, status });
      });
    }

    const readTraineeCards = (container, domain) => {
      if (!container) return [];
      const items = [];
      container.querySelectorAll('.sadhana-progress-card').forEach(card => {
        const itemId = card.getAttribute('data-item-id') || '';
        const sadhanaKey = card.getAttribute('data-sadhana-key') || '';
        const title = card.querySelector('.ts-title-input').value.trim();
        const isPaidVal = card.querySelector('.ts-paid-select')?.value || (card.querySelector('.stamp-paid') ? 'PAID' : 'FREE');
        const isPaid = isPaidVal === 'PAID';
        const level = card.querySelector('.ts-level-select').value;
        const progressPercent = parseInt(card.querySelector('.ts-progress-input').value, 10) || 0;
        const dailyTarget = card.querySelector('.ts-target-input').value.trim();
        const currentStreak = card.querySelector('.ts-streak-input').value.trim();
        const diaryNotes = card.querySelector('.ts-notes-textarea').value.trim();
        if (title) {
          items.push({
            id: itemId || 'ts-' + Math.random().toString(36).substr(2, 5),
            sadhanaKey,
            title,
            categoryDomain: domain,
            isPaid,
            paymentStatus: isPaid ? 'PAID' : 'FREE',
            level,
            progressPercent,
            dailyTarget,
            currentStreak,
            diaryNotes,
            mentorCode: active.referredByCode || 'SKHM-ADM1-7788-9900'
          });
        }
      });
      return items;
    };

    const traineeSadhanas = [
      ...readTraineeCards(this.view.traineeGroupSadhanas, 'sadhanas'),
      ...readTraineeCards(this.view.traineeGroupRemedies, 'remedies'),
      ...readTraineeCards(this.view.traineeGroupCleansing, 'cleansing')
    ];

    const healerCompletedSadhanas = [];
    if (this.view.healerCompletedSadhanasContainer) {
      this.view.healerCompletedSadhanasContainer.querySelectorAll('.sadhana-progress-card').forEach(card => {
        const title = card.querySelector('.hc-comp-title-input').value.trim();
        const status = card.querySelector('.hc-comp-status-input').value.trim();
        const completionDate = card.querySelector('.hc-comp-date-input').value.trim();
        const seekersGuidedCount = parseInt(card.querySelector('.hc-comp-count-input').value, 10) || 0;
        const sealCode = card.querySelector('.hc-comp-seal-input').value.trim();
        if (title) {
          healerCompletedSadhanas.push({
            id: 'hcs-' + Math.random().toString(36).substr(2, 5),
            title,
            levelCompleted: 'Level 4 — Master Guru',
            status,
            completionDate,
            seekersGuidedCount,
            sealCode,
            authorizedToGuide: true
          });
        }
      });
    }

    const healerNetwork = [];
    if (this.view.healerNetworkContainer) {
      this.view.healerNetworkContainer.querySelectorAll('.dynamic-row-item').forEach(row => {
        const name = row.querySelector('.net-name-input').value.trim();
        const refCode = row.querySelector('.net-code-input').value.trim();
        const role = row.querySelector('.net-role-input').value.trim();
        if (name) healerNetwork.push({ id: 'net-' + Math.random().toString(36).substr(2, 5), name, refCode, role, activeCases: 1 });
      });
    }

    const paymentStatusVal = this.view.inputPaymentStatus ? this.view.inputPaymentStatus.value : (active.isPaid !== false ? 'PAID' : 'FREE');

    const updatedProfile = {
      profileType: this.view.inputProfileType ? this.view.inputProfileType.value : active.profileType,
      level: this.view.inputLevel ? (parseInt(this.view.inputLevel.value, 10) || 1) : active.level,
      categoryTag: this.view.inputCategoryTag ? this.view.inputCategoryTag.value.trim() : active.categoryTag,
      referenceCode: this.view.inputRefCode ? this.view.inputRefCode.value.trim() : active.referenceCode,
      referredByCode: this.view.inputSponsorCode ? this.view.inputSponsorCode.value.trim() : active.referredByCode,
      transferredCode: this.view.inputTransferCode ? (this.view.inputTransferCode.value.trim() || null) : active.transferredCode,
      isActive: this.view.inputIsActive ? this.view.inputIsActive.checked : active.isActive,
      isPaid: paymentStatusVal === 'PAID',
      paymentStatus: paymentStatusVal,
      joinDate: this.view.inputJoinDate ? this.view.inputJoinDate.value : active.joinDate,

      name: this.view.inputName ? this.view.inputName.value.trim() : active.name,
      phone: this.view.inputPhone ? this.view.inputPhone.value.trim() : active.phone,
      email: this.view.inputEmail ? this.view.inputEmail.value.trim() : active.email,
      city: this.view.inputCity ? this.view.inputCity.value.trim() : active.city,
      address: this.view.inputAddress ? this.view.inputAddress.value.trim() : active.address,
      objective: this.view.inputObjective ? this.view.inputObjective.value.trim() : active.objective,
      notes: this.view.inputNotes ? this.view.inputNotes.value.trim() : active.notes,
      selectedRemedies: selectedRemedies,

      seekerDiagnostics: {
        afflictionDuration: this.view.seekerAfflictionDuration ? this.view.seekerAfflictionDuration.value.trim() : (active.seekerDiagnostics?.afflictionDuration || ''),
        kuldeviIssues: this.view.seekerKuldeviIssues ? this.view.seekerKuldeviIssues.value.trim() : (active.seekerDiagnostics?.kuldeviIssues || ''),
        targetOutcome: this.view.seekerTargetOutcome ? this.view.seekerTargetOutcome.value.trim() : (active.seekerDiagnostics?.targetOutcome || '')
      },

      houseCleanLevels: houseCleanLevels.length > 0 ? houseCleanLevels : (active.houseCleanLevels || []),
      interestedSadhanas: interestedSadhanas.length > 0 ? interestedSadhanas : (active.interestedSadhanas || []),
      traineeSadhanas: traineeSadhanas.length > 0 ? traineeSadhanas : (active.traineeSadhanas || []),
      healerCompletedSadhanas: healerCompletedSadhanas.length > 0 ? healerCompletedSadhanas : (active.healerCompletedSadhanas || []),
      healerNetwork: healerNetwork.length > 0 ? healerNetwork : (active.healerNetwork || []),

      lineage: {
        currentFamily: {
          selfName: this.view.lineageSelfName ? (this.view.lineageSelfName.value.trim() || this.view.inputName?.value.trim() || active.name) : active.lineage?.currentFamily?.selfName,
          selfTitle: this.view.inputSelfTitle ? this.view.inputSelfTitle.value.trim() : (active.lineage?.currentFamily?.selfTitle || ''),
          spouseName: this.view.lineageSpouseName ? this.view.lineageSpouseName.value.trim() : (active.lineage?.currentFamily?.spouseName || ''),
          children: children.length > 0 ? children : (active.lineage?.currentFamily?.children || []),
          siblings: readSiblings(this.view.siblingsCurrentContainer)
        },
        husbandAncestral: {
          fatherName: this.view.hFatherName ? this.view.hFatherName.value.trim() : (active.lineage?.husbandAncestral?.fatherName || ''),
          motherName: this.view.hMotherName ? this.view.hMotherName.value.trim() : (active.lineage?.husbandAncestral?.motherName || ''),
          paternalGrandfather: this.view.hPaternalGf ? this.view.hPaternalGf.value.trim() : (active.lineage?.husbandAncestral?.paternalGrandfather || ''),
          paternalGrandmother: this.view.hPaternalGm ? this.view.hPaternalGm.value.trim() : (active.lineage?.husbandAncestral?.paternalGrandmother || ''),
          maternalGrandfather: this.view.hMaternalGf ? this.view.hMaternalGf.value.trim() : (active.lineage?.husbandAncestral?.maternalGrandfather || ''),
          maternalGrandmother: this.view.hMaternalGm ? this.view.hMaternalGm.value.trim() : (active.lineage?.husbandAncestral?.maternalGrandmother || ''),
          siblings: readSiblings(this.view.siblingsHusbandContainer),
          address: this.view.hAddress ? this.view.hAddress.value.trim() : (active.lineage?.husbandAncestral?.address || '')
        },
        wifeAncestral: {
          fatherName: this.view.wFatherName ? this.view.wFatherName.value.trim() : (active.lineage?.wifeAncestral?.fatherName || ''),
          motherName: this.view.wMotherName ? this.view.wMotherName.value.trim() : (active.lineage?.wifeAncestral?.motherName || ''),
          paternalGrandfather: this.view.wPaternalGf ? this.view.wPaternalGf.value.trim() : (active.lineage?.wifeAncestral?.paternalGrandfather || ''),
          paternalGrandmother: this.view.wPaternalGm ? this.view.wPaternalGm.value.trim() : (active.lineage?.wifeAncestral?.paternalGrandmother || ''),
          maternalGrandfather: this.view.wMaternalGf ? this.view.wMaternalGf.value.trim() : (active.lineage?.wifeAncestral?.maternalGrandfather || ''),
          maternalGrandmother: this.view.wMaternalGm ? this.view.wMaternalGm.value.trim() : (active.lineage?.wifeAncestral?.maternalGrandmother || ''),
          siblings: readSiblings(this.view.siblingsWifeContainer),
          address: this.view.wAddress ? this.view.wAddress.value.trim() : (active.lineage?.wifeAncestral?.address || '')
        }
      }
    };

    this.model.updateActiveProfile(updatedProfile);
    this._renderCurrentState();
    this.view.showToast('✓ Profile successfully saved & synchronized across all tabs!');

    // Dispatch minimal data-minimized node status to Firebase Realtime Database
    if (window.FirebaseSyncEngine) {
      window.FirebaseSyncEngine.publishMinimalNodeStatus(updatedProfile);
    }
  }
}

// ==============================================================
// 12. FIREBASE REALTIME DATABASE SYNC ENGINE (DATA MINIMIZATION)
// ==============================================================

if (typeof window !== 'undefined') {
  window.ProfileController = ProfileController;
}
