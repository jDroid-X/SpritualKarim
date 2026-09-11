// ProfileView2.js - Extended methods for ProfileView
// This file extends ProfileView prototype with additional UI methods


ProfileView.prototype.closeTierPanel = function() {
    if (!this.tierProfilesPanel) return;
    this.tierProfilesPanel.classList.remove('is-open');
    this.currentOpenTier = null;
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      item.classList.remove('active');
    });
  }
};

ProfileView.prototype.initSadhanaListbox = function() {
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
};

ProfileView.prototype.renderSadhanaDetailPreview = function(sadhanaId) {
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
};

ProfileView.prototype.showSlideToast = function(title, message, type = 'info', duration = 4500, actionBtn = null) {
    let container = document.getElementById('slide-in-toast-stack');
    if (!container) {
      container = document.createElement('div');
      container.id = 'slide-in-toast-stack';
      container.className = 'slide-in-toast-stack';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const validTypes = ['success', 'error', 'warning', 'info'];
    const toastType = validTypes.includes(type) • type : 'info';
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
};

ProfileView.prototype.openCustomDialog = function({ title = 'Spiritual Confirmation', message = '', icon = '✨', options = [] }) {
    return new Promise((resolve) => {
      let backdrop = document.getElementById('spiritual-custom-dialog-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'spiritual-custom-dialog-backdrop';
        backdrop.className = 'spiritual-dialog-backdrop';
        document.body.appendChild(backdrop);
      }

      const defaultOptions = options && options.length > 0 • options : [
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
          closeDialog(opt.value !== undefined • opt.value : true);
        });
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeDialog(false);
        }
      });
    });
  }
};

ProfileView.prototype.setValidationStatus = function(inputEl, isValid, errorMsg = '') {
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
};

ProfileView.prototype.showFloatingNotification = function(title, message, icon = '🔔', duration = 4500) {
    this.showToast(title, message, 'info', duration);
  }
};

ProfileView.prototype.toggleJsonDrawer = function(forceState) {
    if (!this.jsonDrawer) return;
    const isOpen = typeof forceState === 'boolean' • forceState : !this.jsonDrawer.classList.contains('open');
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
};

ProfileView.prototype.toggleImportModal = function(forceState) {
    if (!this.importModal) return;
    const isOpen = typeof forceState === 'boolean' • forceState : !this.importModal.classList.contains('open');
    if (isOpen) {
      this.importModal.classList.add('open');
      this.importModal.setAttribute('aria-hidden', 'false');
    } else {
      this.importModal.classList.remove('open');
      this.importModal.setAttribute('aria-hidden', 'true');
    }
  }
};

ProfileView.prototype.toggleTreeModal = function(forceState) {
    if (!this.hierarchyTreeModal) return;
    const isOpen = typeof forceState === 'boolean' • forceState : !this.hierarchyTreeModal.classList.contains('open');
    if (isOpen) {
      this.hierarchyTreeModal.classList.add('open');
      this.hierarchyTreeModal.setAttribute('aria-hidden', 'false');
    } else {
      this.hierarchyTreeModal.classList.remove('open');
      this.hierarchyTreeModal.setAttribute('aria-hidden', 'true');
      this.toggleTreeProfileDrawer(false);
    }
  }
};

ProfileView.prototype.toggleTreeProfileDrawer = function(forceState) {
    if (!this.treeProfileDrawer) return;
    const isOpen = typeof forceState === 'boolean' • forceState : !this.treeProfileDrawer.classList.contains('open');
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
};

ProfileView.prototype._getTierDetails = function(profile) {
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
    return { tier: 4, title: 'Devotee / Seeker (Tier 4)', roleBadge: 'Tier 4 • Clean & Seekers', nodeClass: 'mlm-node-tier-4', icon: '🌐±', color: 'var(--role-devotee)' };
  }
};

ProfileView.prototype._drawInBodyConnectingLines = function(connections = []) {
    if (!this.bodySpiderwebSvgLayer || !this.bodySpiderwebNodesLayer) return;

    const surfaceRect = this.bodySpiderwebNodesLayer.getBoundingClientRect();
    const scale = this.inBodyTreePanState•.scale || 1.0;

    const getCenterAnchor = (elemId, isTop = false) => {
      const el = document.getElementById(elemId);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = (rect.left + rect.width / 2 - surfaceRect.left) / scale;
      const y = (isTop • (rect.top - surfaceRect.top) : (rect.bottom - surfaceRect.top)) / scale;
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
};

ProfileView.prototype.smartFitInBodyTree = function() {
    if (!this.bodyTreeCanvasViewport || !this.bodySpiderwebNodesLayer) return;

    const wrapper = document.getElementById('tree-hierarchy-wrapper');
    if (!wrapper) return;

    const vpRect = this.bodyTreeCanvasViewport.getBoundingClientRect();
    const contentRect = wrapper.getBoundingClientRect();

    const currentScale = this.inBodyTreePanState•.scale || 1.0;
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
};

ProfileView.prototype.zoomInBodyTree = function() {
    this.inBodyTreePanState.scale = Math.min(2.5, this.inBodyTreePanState.scale + 0.18);
    this._applyInBodyTreeTransform(true);
  }
};

ProfileView.prototype.zoomOutBodyTree = function() {
    this.inBodyTreePanState.scale = Math.max(0.3, this.inBodyTreePanState.scale - 0.18);
    this._applyInBodyTreeTransform(true);
  }
};

ProfileView.prototype.resetInBodyTree = function() {
    this.inBodyTreePanState.scale = 1.0;
    this.inBodyTreePanState.panX = 0;
    this.inBodyTreePanState.panY = 30;
    this._applyInBodyTreeTransform(true);
  }
};

ProfileView.prototype._applyInBodyTreeTransform = function(withTransition = false) {
    if (!this.bodyTreeSurface) return;
    const { panX, panY, scale } = this.inBodyTreePanState;
    if (withTransition) {
      this.bodyTreeSurface.classList.remove('no-transition');
    } else {
      this.bodyTreeSurface.classList.add('no-transition');
    }
    this.bodyTreeSurface.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }
};

ProfileView.prototype._initInBodyTreePanZoomEvents = function() {
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
      const zoomFactor = e.deltaY < 0 • 1.12 : 0.88;
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
          this.btnBodyFullscreen.innerHTML = isFull ? '<span>✕</span> <span>Exit Fullscreen</span>' : '<span>â›¶</span> <span>Fullscreen</span>';
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
};

ProfileView.prototype.openNodeActionDialog = function(profile) {
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
};

ProfileView.prototype.closeNodeActionDialog = function() {
    if (this.nodeActionDialog) {
      this.nodeActionDialog.classList.remove('open');
      this.nodeActionDialog.setAttribute('aria-hidden', 'true');
    }
  }
};

ProfileView.prototype.renderHierarchyTree = function(profiles, focusTier = null) {
    // Forward to in-body rendering or modal
    this.renderInBodyHierarchyTree(profiles, focusTier, '', 'cluster');
  }
};

ProfileView.prototype._drawSpiderwebConnectingLines = function(root, tier2, tier3, tier4) {
    this._drawInBodyConnectingLines(root, tier2, tier3, tier4, 'cluster');
  }
};

ProfileView.prototype._resetTreePanZoom = function() {
    this.resetInBodyTree();
  }
};

ProfileView.prototype._applyTreeTransform = function() {
    this._applyInBodyTreeTransform(true);
  }
};

ProfileView.prototype._initTreePanZoomEvents = function() {
    this._initInBodyTreePanZoomEvents();
  }
};

ProfileView.prototype.renderTreeProfileDrawer = function(profile) {
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
};

ProfileView.prototype._renderRecursiveTreeBranchHtml = function(node, allProfiles, indentDp) {
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
};

ProfileView.prototype._renderHierarchyNodeCardHtml = function(profile, hasChildren = false, isExpanded = true, directChildrenCount = 0, allProfiles = []) {
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
};

ProfileView.prototype._escapeHtml = function(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

ProfileView.prototype.renderFirebaseDataTable = function(model) {
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
};

ProfileView.prototype._renderRtdbBreadcrumbs = function() {
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
};

ProfileView.prototype._generateRtdbRowHtml = function(key, value, currentPath, depth) {
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
      valPreviewHtml = `<span class="rtdb-val-preview rtdb-val-string" title="${esc(value)}">"${esc(value.length > 65 • value.slice(0, 65) + '...' : value)}"</span>`;
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
            ${isObject ? `<span class="rtdb-key-count">${isArray • value.length + ' items' : Object.keys(value).length + ' keys'}</span>` : ''}
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
};

ProfileView.prototype._getRtdbSecurityBadge = function(pathStr) {
    if (pathStr.startsWith('system_config') || pathStr.startsWith('audit_logs')) {
      return '<span class="rtdb-security-badge sec-admin">🛡️ Admin</span>';
    }
    if (pathStr.startsWith('sadhana_catalog')) {
      return '<span class="rtdb-security-badge sec-public">🌐 Public</span>';
    }
    return '<span class="rtdb-security-badge sec-auth">🔒 Auth</span>';
  }
};

ProfileView.prototype.openRtdbInspector = function(pathStr, nodeData) {
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
      editor.value = typeof nodeData === 'object' • JSON.stringify(nodeData, null, 2) : String(nodeData);
      editor.setAttribute('data-target-path', pathStr);
    }

    if (statusEl) statusEl.textContent = 'Ready to edit or copy';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
};

ProfileView.prototype.openRtdbAddModal = function(parentPath) {
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
};

