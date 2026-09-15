// ProfileView2.js - Extended ProfileView prototype methods
// Auto-generated from backup - Fixed structure
const escapeHtmlUtil = (typeof window !== 'undefined' && typeof window.escapeHtmlUtil === 'function')
  ? window.escapeHtmlUtil
  : (typeof window !== 'undefined' && typeof window.escapeHtml === 'function')
    ? window.escapeHtml
    : (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

ProfileView.prototype.closeTierPanel = function() {
    if (!this.tierProfilesPanel) return;
    this.tierProfilesPanel.classList.remove('is-open');
    const adminLayout = document.querySelector('.admin-layout');
    if (adminLayout) {
      adminLayout.classList.remove('has-tier-panel-open');
    }
    this.currentOpenTier = null;
    this.currentSelectedTierMember = null;
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      item.classList.remove('active');
    });
    const card2 = document.getElementById('selected-member-profile-card');
    if (card2) {
      card2.style.display = 'none';
    }
};

ProfileView.prototype._renderTierPanelCards = function(profiles, activeProfileId, borderColor = '#d4af37') {
    if (typeof this.renderTierProfilesList === 'function') {
      this.renderTierProfilesList(profiles);
    }
};

ProfileView.prototype.updateLegendCounts = function(profiles, roleMode = 'MASTER') {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    (profiles || []).forEach(p => {
      if (p.profileType === 'ADMIN' || p.level === 1 || p.level === 0) counts[1]++;
      else if (p.profileType === 'HEALER' || p.level === 2) counts[2]++;
      else if (p.profileType === 'TRAINEE' || p.level === 3 || p.level === 4) counts[3]++;
      else counts[4]++;
    });

    for (let t = 1; t <= 4; t++) {
      const el = document.getElementById('legend-count-tier-' + t);
      if (el) el.textContent = counts[t];
    }

    // Higher-to-Lower Tier Visibility Gating in Sidebar:
    const tier1Item = document.querySelector('#hierarchy-legend-container .legend-item[data-tier="1"]');
    const tier2Item = document.querySelector('#hierarchy-legend-container .legend-item[data-tier="2"]');
    const tier3Item = document.querySelector('#hierarchy-legend-container .legend-item[data-tier="3"]');
    const tier4Item = document.querySelector('#hierarchy-legend-container .legend-item[data-tier="4"]');

    const resolvedRole = (roleMode || 'MASTER').toUpperCase();
    if (resolvedRole === 'HEALER') {
      // Healers cannot see or manage Tier 1 (Admin Master)
      if (tier1Item) tier1Item.style.display = 'none';
      if (tier2Item) tier2Item.style.display = 'flex';
      if (tier3Item) tier3Item.style.display = 'flex';
      if (tier4Item) tier4Item.style.display = 'flex';
    } else if (resolvedRole === 'TRAINEE') {
      // Trainees cannot see Tier 1 or Tier 2
      if (tier1Item) tier1Item.style.display = 'none';
      if (tier2Item) tier2Item.style.display = 'none';
      if (tier3Item) tier3Item.style.display = 'flex';
      if (tier4Item) tier4Item.style.display = 'flex';
    } else if (resolvedRole === 'DEVOTEE') {
      // Devotees can only see Tier 4
      if (tier1Item) tier1Item.style.display = 'none';
      if (tier2Item) tier2Item.style.display = 'none';
      if (tier3Item) tier3Item.style.display = 'none';
      if (tier4Item) tier4Item.style.display = 'flex';
    } else {
      // MASTER / ADMIN sees all tiers
      if (tier1Item) tier1Item.style.display = 'flex';
      if (tier2Item) tier2Item.style.display = 'flex';
      if (tier3Item) tier3Item.style.display = 'flex';
      if (tier4Item) tier4Item.style.display = 'flex';
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
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-xs btn-outline btn-open-sadhana-drawer-from-preview" data-sadhana="${sadhanaId}" title="Open Full Ritual Steps Drawer">
              📖 Steps
            </button>
            <button type="button" class="btn btn-xs btn-gold btn-apply-sadhana-initiation" data-sadhana="${sadhanaId}" title="Apply for Sadhana Initiation and request upgrade to Trainee Sadhak">
              📿 Apply for Initiation
            </button>
          </div>
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
    const toastType = validTypes.includes(type) ? type : 'info';
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

    const toastCloseBtn = toast.querySelector('.slide-toast-close');
    if (toastCloseBtn) toastCloseBtn.addEventListener('click', dismiss);

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

      const defaultOptions = options && options.length > 0 ? options : [
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
          closeDialog(opt.value !== undefined ? opt.value : true);
        });
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeDialog(false);
        }
      });
    });
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
};

ProfileView.prototype.showToast = function(titleOrMessage, messageText = '', type = 'info', duration = 4000, actionBtn = null) {
    let title = 'Shree Spritual Karim';
    let message = '';
    let toastType = 'info';
    let toastDuration = typeof duration === 'number' ? duration : 4000;
    let btn = actionBtn;

    const validTypes = ['success', 'error', 'warning', 'info', 'danger'];

    if (typeof titleOrMessage === 'string' && typeof messageText === 'string' && validTypes.includes(messageText.toLowerCase())) {
      // Invoked as: showToast(message, type, duration, actionBtn)
      message = titleOrMessage;
      toastType = messageText.toLowerCase() === 'danger' ? 'error' : messageText.toLowerCase();
      if (typeof type === 'number') toastDuration = type;
      if (typeof duration === 'object' && duration !== null) btn = duration;
    } else if (typeof titleOrMessage === 'string' && typeof messageText === 'string' && messageText.trim() !== '') {
      // Invoked as: showToast(title, message, type, duration, actionBtn)
      title = titleOrMessage;
      message = messageText;
      if (typeof type === 'string') {
        toastType = type.toLowerCase() === 'danger' ? 'error' : type.toLowerCase();
      }
    } else if (typeof titleOrMessage === 'string') {
      // Invoked as: showToast(message)
      message = titleOrMessage;
      if (typeof messageText === 'string' && validTypes.includes(messageText.toLowerCase())) {
        toastType = messageText.toLowerCase() === 'danger' ? 'error' : messageText.toLowerCase();
      }
    }

    this.showSlideToast(title, message, toastType, toastDuration, btn);
};

ProfileView.prototype.showFloatingNotification = function(title, message, icon = '🔔', duration = 4500) {
    this.showToast(title, message, 'info', duration);
};

ProfileView.prototype.confirmAction = function(title, message, options = null) {
    return this.openCustomDialog({
      title: title || 'Confirm Action',
      message: message || 'Are you sure you want to proceed?',
      icon: '❓',
      options: options || [
        { text: 'Confirm', type: 'btn-gold', value: true },
        { text: 'Cancel', type: 'btn-outline', value: false }
      ]
    });
};

ProfileView.prototype.showDecisionDialog = function(title, message, choices = []) {
    return this.openCustomDialog({
      title: title || 'Spiritual Choice Required',
      message: message || 'Please select an option below:',
      icon: '⚖️',
      options: choices
    });
};

ProfileView.prototype.toggleCardFlipper = function(targetEl, forceState) {
    const wrapper = targetEl ? (targetEl.closest ? targetEl.closest('.card-flipper-3d-wrapper') : targetEl) : document.getElementById('profile-card-flipper-wrapper');
    if (!wrapper) return false;
    const isFlipped = typeof forceState === 'boolean' ? forceState : !wrapper.classList.contains('is-flipped');
    if (isFlipped) {
      wrapper.classList.add('is-flipped');
    } else {
      wrapper.classList.remove('is-flipped');
    }
    return isFlipped;
};

ProfileView.prototype.updateProfileCardFlipper = function(profile) {
    const p = profile || {};

    const flipperName = document.getElementById('flipper-profile-name');
    if (flipperName) {
      flipperName.textContent = p.name || p.fullName || 'Spiritual Devotee';
    }

    const flipperRole = document.getElementById('flipper-profile-role');
    if (flipperRole) {
      const roleText = p.roleTitle || p.role || (p.roleLevel !== undefined ? `Level ${p.roleLevel}` : 'Devotee');
      const icon = (p.roleLevel === 0 || p.role === 'Master') ? '👑' : (p.role === 'Healer' ? '🌿' : (p.role === 'Trainee' ? '🌱' : '🌟'));
      flipperRole.textContent = `${icon} ${roleText}`;
    }

    const avatarInitialsEl = document.getElementById('profile-avatar-initials');
    if (avatarInitialsEl) {
      const initials = (p.name || p.fullName || 'SK').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
      avatarInitialsEl.textContent = initials || 'SK';
    }

    const teleRef = document.getElementById('telemetry-ref-code');
    const defaultCode = (this.model && typeof this.model.getDefaultMentorCode === 'function') ? this.model.getDefaultMentorCode() : 'SKHM-ADM1-7788-9900';
    if (teleRef) teleRef.textContent = p.referenceCode || defaultCode;

    const teleSponsor = document.getElementById('telemetry-sponsor-code');
    if (teleSponsor) teleSponsor.textContent = p.referredByCode || p.sponsorCode || 'ROOT-0000-0000-0000';

    const teleDiya = document.getElementById('telemetry-diya-count');
    if (teleDiya) {
      const cnt = Array.isArray(p.dailyDiyaLogs) ? p.dailyDiyaLogs.length : 0;
      teleDiya.textContent = cnt + ' Days';
    }

    const teleClean = document.getElementById('telemetry-clean-count');
    if (teleClean) {
      const cnt = Array.isArray(p.houseCleanLogs) ? p.houseCleanLogs.length : 0;
      teleClean.textContent = cnt + ' Records';
    }

    const teleSadhanas = document.getElementById('telemetry-sadhanas-count');
    if (teleSadhanas) {
      const cnt = Array.isArray(p.inProgressSadhanas) ? p.inProgressSadhanas.length : 0;
      teleSadhanas.textContent = cnt + ' Active';
    }
};

ProfileView.prototype.renderSegmentedToggle = function(containerId, options = [], activeValue = '', onChange = null) {
    const esc = (typeof escapeHtmlUtil === 'function') ? escapeHtmlUtil : (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return null;

    const opts = options.length > 0 ? options : [
      { value: 'left', label: 'Option A', icon: '🔹' },
      { value: 'right', label: 'Option B', icon: '🔸' }
    ];
    let currentVal = activeValue || opts[0].value;

    const bar = document.createElement('div');
    bar.className = 'segmented-toggle-bar';
    bar.setAttribute('role', 'radiogroup');

    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'segmented-toggle-option' + (opt.value === currentVal ? ' active' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', opt.value === currentVal ? 'true' : 'false');
      btn.setAttribute('data-value', opt.value);
      btn.innerHTML = `${opt.icon ? `<span class="toggle-option-icon">${opt.icon}</span> ` : ''}<span>${esc(opt.label)}</span>`;

      btn.addEventListener('click', () => {
        if (currentVal === opt.value) return;
        currentVal = opt.value;
        bar.querySelectorAll('.segmented-toggle-option').forEach(b => {
          const isSelected = b.getAttribute('data-value') === currentVal;
          b.classList.toggle('active', isSelected);
          b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
        if (typeof onChange === 'function') {
          onChange(currentVal, opt);
        }
      });

      bar.appendChild(btn);
    });

    container.innerHTML = '';
    container.appendChild(bar);
    return bar;
};

ProfileView.prototype.renderSwitch = function(containerId, config = {}) {
    const esc = (typeof escapeHtmlUtil === 'function') ? escapeHtmlUtil : (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return null;

    const id = config.id || ('sw-' + Math.random().toString(36).substr(2, 7));
    const label = config.label || 'Feature Switch';
    const description = config.description || 'Enable or disable this feature';
    const icon = config.icon || '⚙️';
    const checked = config.checked !== false;
    const onChange = config.onChange;

    const row = document.createElement('div');
    row.className = 'spiritual-switch-row';
    row.innerHTML = `
      <div class="spiritual-switch-label-wrap">
        <span class="spiritual-switch-icon">${icon}</span>
        <div>
          <div class="spiritual-switch-title">${esc(label)}</div>
          <div class="spiritual-switch-sub">${esc(description)}</div>
        </div>
      </div>
      <label class="spiritual-toggle-switch" for="${id}">
        <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
        <span class="spiritual-switch-slider"></span>
      </label>
    `;

    const input = row.querySelector('input');
    if (input) {
      input.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        if (typeof onChange === 'function') {
          onChange(isChecked, e);
        }
      });
    }

    container.appendChild(row);
    return row;
};

ProfileView.prototype.renderDetailListbox = function(containerId, config = {}) {
    const esc = (typeof escapeHtmlUtil === 'function') ? escapeHtmlUtil : (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const selectId = config.id || 'select-detail-listbox';
    const label = config.label || 'Select Item';
    const items = config.items || [];
    const selectedValue = config.selectedValue || (items[0] ? (items[0].id || items[0].value) : '');
    const onSelect = config.onSelect;
    const renderPreview = config.renderPreview;

    container.innerHTML = `
      <div class="detail-listbox-wrap">
        <div class="form-group" style="margin-bottom: 0.5rem;">
          <label class="form-label" for="${selectId}">${esc(label)}</label>
          <select id="${selectId}" class="form-control">
            ${items.map(it => `
              <option value="${it.id || it.value}" ${(it.id || it.value) === selectedValue ? 'selected' : ''}>
                ${it.icon || '🕉️'} ${esc(it.title || it.label || it.name || '')} ${it.category ? `(${esc(it.category)})` : ''}
              </option>
            `).join('')}
          </select>
        </div>
        <div class="detail-listbox-preview-container" id="${selectId}-preview"></div>
      </div>
    `;

    const selectEl = container.querySelector('#' + selectId);
    const previewContainer = container.querySelector('#' + selectId + '-preview');

    const updatePreview = (val) => {
      const selectedItem = items.find(it => (it.id || it.value) === val) || items[0] || {};
      if (typeof renderPreview === 'function') {
        previewContainer.innerHTML = renderPreview(selectedItem);
      } else {
        previewContainer.innerHTML = `
          <div class="detail-listbox-preview-card mt-2">
            <div class="detail-preview-header">
              <div class="detail-preview-title-row">
                <span class="detail-preview-icon">${selectedItem.icon || '🕉️'}</span>
                <div>
                  <h4 class="detail-preview-title">${esc(selectedItem.title || selectedItem.label || val)}</h4>
                  <div class="detail-preview-meta">
                    <span>${esc(selectedItem.category || 'Spiritual')}</span>
                    ${selectedItem.targetDays ? `<span>&bull; ${selectedItem.targetDays} Days Target</span>` : ''}
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-preview-desc">${esc(selectedItem.description || selectedItem.notes || '')}</div>
          </div>
        `;
      }
    };

    if (selectEl) {
      selectEl.addEventListener('change', (e) => {
        const val = e.target.value;
        updatePreview(val);
        if (typeof onSelect === 'function') onSelect(val, items.find(it => (it.id || it.value) === val));
      });
      updatePreview(selectEl.value);
    }
};

ProfileView.prototype.setupLiveInputValidations = function() {
    const nameInput = document.getElementById('input-name');
    const phoneInput = document.getElementById('input-phone');
    const refCodeInput = document.getElementById('input-ref-code');
    const sponsorCodeInput = document.getElementById('input-sponsor-code');

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const val = nameInput.value.trim();
        const isValid = val.length >= 3;
        this.setValidationStatus(nameInput, isValid, isValid ? '✓ Valid Devotee Name' : '⚠️ Name must have at least 3 characters');
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const val = phoneInput.value.trim().replace(/[\s\-]/g, '');
        const isValid = val.length >= 10;
        this.setValidationStatus(phoneInput, isValid, isValid ? '✓ Valid Contact Number' : '⚠️ Minimum 10 digits required');
      });
    }

    if (refCodeInput) {
      refCodeInput.addEventListener('input', () => {
        const val = refCodeInput.value.trim();
        const isValid = /^SK[A-Z0-9\-]{4,25}$/i.test(val);
        this.setValidationStatus(refCodeInput, isValid, isValid ? '✓ Reference Code Valid' : '⚠️ Must start with SK-');
      });
    }

    if (sponsorCodeInput) {
      sponsorCodeInput.addEventListener('input', () => {
        const val = sponsorCodeInput.value.trim();
        if (!val) {
          this.setValidationStatus(sponsorCodeInput, true, 'Optional (ROOT Sponsor)');
        } else {
          const isValid = /^SK[A-Z0-9\-]{4,25}$/i.test(val);
          this.setValidationStatus(sponsorCodeInput, isValid, isValid ? '✓ Sponsor Code format valid' : '⚠️ Format: SK-XXXX-XXXX');
        }
      });
    }
};

ProfileView.prototype.switchSubTab = function(mainTabId, subTabId) {
    if (mainTabId) {
      const fullMainId = mainTabId.startsWith('tab-') ? mainTabId : ('tab-' + mainTabId);
      if (typeof this.switchTab === 'function') {
        this.switchTab(fullMainId);
      } else {
        document.querySelectorAll('.main-tab-content-panel').forEach(p => p.classList.remove('active'));
        const mainPanel = document.getElementById(fullMainId);
        if (mainPanel) mainPanel.classList.add('active');
        document.querySelectorAll('.main-tab-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-main-tab') === fullMainId);
        });
      }
    }

    if (subTabId) {
      const btn = document.querySelector(`.sub-tab-btn[data-sub-tab="${subTabId}"]`);
      if (btn) {
        const parentNav = btn.closest('.sub-tab-nav') || btn.parentElement;
        if (parentNav) {
          parentNav.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
        }
        btn.classList.add('active');
      }
      const panel = document.getElementById(subTabId);
      if (panel) {
        const parentWrap = panel.parentElement;
        if (parentWrap) {
          parentWrap.querySelectorAll('.sub-tab-panel').forEach(p => p.classList.remove('active'));
        }
        panel.classList.add('active');
      }
    }
};

ProfileView.prototype.toggleMobileSidebar = function(forceState) {
    const sidebar = this.adminSidebar || document.getElementById('admin-enterprise-drawer') || document.querySelector('.admin-sidebar');
    const backdrop = this.sidebarBackdrop || document.getElementById('sidebar-backdrop');
    if (!sidebar) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !sidebar.classList.contains('mobile-open');
    if (isOpen) {
      sidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('active');
    } else {
      sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
    }
};

ProfileView.prototype._renderSharePairingModal = function(profile, invites) {
    if (typeof this.renderSharePairingModal === 'function') {
      return this.renderSharePairingModal(profile, invites);
    }
};

ProfileView.prototype.renderRespectiveTreeSection = function(activeProfile, allProfiles) {
    if (typeof this.renderHierarchyTree === 'function') {
      this.renderHierarchyTree(allProfiles || this.allProfiles || []);
    }
};

ProfileView.prototype.toggleJsonDrawer = function(forceState) {
    if (!this.jsonDrawer) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.jsonDrawer.classList.contains('open');
    if (isOpen) {
      this.jsonDrawer.classList.add('open');
      this.jsonDrawer.setAttribute('aria-hidden', 'false');
      if (this.jsonDrawerBackdrop) this.jsonDrawerBackdrop.classList.add('open');
    } else {
      this.jsonDrawer.classList.remove('open');
      this.jsonDrawer.setAttribute('aria-hidden', 'true');
      if (this.jsonDrawerBackdrop) this.jsonDrawerBackdrop.classList.remove('open');
    }
};

ProfileView.prototype.toggleImportModal = function(forceState) {
    if (!this.importModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.importModal.classList.contains('open');
    if (isOpen) {
      this.importModal.classList.add('open');
      this.importModal.setAttribute('aria-hidden', 'false');
    } else {
      this.importModal.classList.remove('open');
      this.importModal.setAttribute('aria-hidden', 'true');
    }
};

ProfileView.prototype.toggleSettingsModal = function(forceState) {
    const modal = this.adminSettingsModal || document.getElementById('admin-settings-modal');
    if (!modal) return;
    this.adminSettingsModal = modal;
    const isOpen = typeof forceState === 'boolean' ? forceState : !modal.classList.contains('open');
    if (isOpen) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    } else {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
};

ProfileView.prototype.toggleSharePairingModal = function(forceState) {
    const modal = this.sharePairingModal || document.getElementById('share-pairing-modal');
    if (!modal) return;
    this.sharePairingModal = modal;
    const isOpen = typeof forceState === 'boolean' ? forceState : !modal.classList.contains('open');
    if (isOpen) {
      modal.classList.add('open', 'is-open');
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    } else {
      modal.classList.remove('open', 'is-open');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
};

ProfileView.prototype.toggleTreeModal = function(forceState) {
    if (!this.hierarchyTreeModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.hierarchyTreeModal.classList.contains('open');
    if (isOpen) {
      this.hierarchyTreeModal.classList.add('open');
      this.hierarchyTreeModal.setAttribute('aria-hidden', 'false');
    } else {
      this.hierarchyTreeModal.classList.remove('open');
      this.hierarchyTreeModal.setAttribute('aria-hidden', 'true');
      this.toggleTreeProfileDrawer(false);
    }
};

ProfileView.prototype.toggleTreeProfileDrawer = function(forceState) {
    if (!this.treeProfileDrawer) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.treeProfileDrawer.classList.contains('open');
    if (isOpen) {
      this.treeProfileDrawer.classList.add('open');
      this.treeProfileDrawer.setAttribute('aria-hidden', 'false');
      if (this.treeDrawerBackdrop) this.treeDrawerBackdrop.classList.add('open');
    } else {
      this.treeProfileDrawer.classList.remove('open');
      this.treeProfileDrawer.setAttribute('aria-hidden', 'true');
      if (this.treeDrawerBackdrop) this.treeDrawerBackdrop.classList.remove('open');
    }
};

ProfileView.prototype._getTierDetails = function(profile) {
    const type = (profile.profileType || '').toUpperCase();
    const lvl = parseInt(profile.level, 10) || 1;
    if (type === 'ADMIN' || lvl === 1) {
      return { tier: 1, title: 'Admin Master (Tier 1)', roleBadge: 'Tier 1 • Founder Master', nodeClass: 'mlm-node-tier-1', icon: '👑', color: 'var(--role-admin)' };
    }
    if (type === 'HEALER' || lvl === 2) {
      return { tier: 2, title: 'Healer Connect (Tier 2)', roleBadge: 'Tier 2 • Certified Guide', nodeClass: 'mlm-node-tier-2', icon: '🔮', color: 'var(--role-healer)' };
    }
    if (type === 'TRAINEE' || lvl === 3) {
      return { tier: 3, title: 'Trainee Sadhak (Tier 3)', roleBadge: 'Tier 3 • Dedicated Mentor (1:1)', nodeClass: 'mlm-node-tier-3', icon: '📿', color: 'var(--role-trainee)' };
    }
    if (type === 'DEVOTEE' || lvl === 4) {
      return { tier: 4, title: 'Devotee (Tier 4)', roleBadge: 'Tier 4 • 1:1 Active House Clean', nodeClass: 'mlm-node-tier-4', icon: '🕉️', color: 'var(--role-devotee)' };
    }
    return { tier: 5, title: 'Seeker (Tier 5)', roleBadge: 'Tier 5 • 1:1 Verification Intake', nodeClass: 'mlm-node-tier-5', icon: '⏳', color: '#06b6d4' };
};

ProfileView.prototype.renderInBodyHierarchyTree = function(profiles = [], focusTier = null, searchQuery = '', layoutMode = 'cluster') {
    if (!this.bodySpiderwebNodesLayer || !this.bodySpiderwebSvgLayer) {
      this.bodySpiderwebNodesLayer = document.getElementById('body-spiderweb-nodes-layer');
      this.bodySpiderwebSvgLayer = document.getElementById('body-spiderweb-svg-layer');
      this.bodyTreeSurface = document.getElementById('body-tree-surface');
      this.bodyTreeCanvasViewport = document.getElementById('body-tree-canvas-viewport');
    }

    if (!profiles || profiles.length === 0) {
      if (this.bodySpiderwebNodesLayer) {
        this.bodySpiderwebNodesLayer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">No profiles available.</div>';
      }
      return;
    }

    // Update Stats & Active Tier badge
    if (this.bodyTreeTotalMembers) {
      this.bodyTreeTotalMembers.textContent = `👥 Total Members: ${profiles.length}`;
    }
    if (this.bodyTreeActiveTier) {
      this.bodyTreeActiveTier.textContent = focusTier ? `Tier Focus: Tier ${focusTier}` : 'Tier Focus: All Tiers';
    }

    // 1. Organize profiles by 5 canonical tiers
    const tier1List = profiles.filter(p => this._getTierDetails(p).tier === 1);
    const tier2List = profiles.filter(p => this._getTierDetails(p).tier === 2);
    const tier3List = profiles.filter(p => this._getTierDetails(p).tier === 3);
    const tier4List = profiles.filter(p => this._getTierDetails(p).tier === 4);
    const tier5List = profiles.filter(p => this._getTierDetails(p).tier === 5);

    const rootProfile = tier1List.length > 0 ? tier1List[0] : profiles[0];
    const cleanQuery = (searchQuery || '').trim().toLowerCase();
    const connections = [];

    const renderPersonNode = (p, tier, isRoot = false) => {
      let headFill = '#1e3a8a';
      let headStroke = '#93c5fd';
      let bodyFill = '#1e3a8a';
      let bodyStroke = '#93c5fd';

      if (tier === 1) {
        headFill = '#7a1c37'; headStroke = '#f59e0b';
        bodyFill = '#7a1c37'; bodyStroke = '#f59e0b';
      } else if (tier === 2) {
        headFill = '#d97706'; headStroke = '#fbbf24';
        bodyFill = '#b45309'; bodyStroke = '#fbbf24';
      } else if (tier === 3) {
        headFill = '#047857'; headStroke = '#34d399';
        bodyFill = '#065f46'; bodyStroke = '#34d399';
      } else if (tier === 4) {
        headFill = '#0284c7'; headStroke = '#7dd3fc';
        bodyFill = '#0369a1'; bodyStroke = '#7dd3fc';
      } else if (tier === 5) {
        headFill = '#a5f3fc'; headStroke = '#0891b2';
        bodyFill = '#a5f3fc'; bodyStroke = '#0891b2';
      }

      const name = p.name || (isRoot ? 'Founder (Karim Ji)' : 'Seeker');
      const isMatch = cleanQuery && name.toLowerCase().includes(cleanQuery);
      const isDimmed = (cleanQuery && !isMatch) || (focusTier && focusTier !== tier);

      return `
        <div class="spiderweb-node spiderweb-node-tier-${tier} ${isRoot ? 'is-root-node' : ''} ${isMatch ? 'search-match' : ''} ${isDimmed ? 'dimmed' : ''}"
             data-profile-id="${p.id}"
             data-tier="${tier}"
             id="body-tree-node-${p.id}"
             tabindex="0"
             title="${name} (${this._getTierDetails(p).title}) • Click to view details, double click to jump to profile">
          <div class="person-icon-graphic">
            <svg viewBox="0 0 36 50" width="${isRoot ? '38' : '32'}" height="${isRoot ? '50' : '42'}" class="person-svg">
              <circle cx="18" cy="9" r="6.5" fill="${headFill}" stroke="${headStroke}" stroke-width="1.8" class="person-head" />
              <rect x="7" y="18" width="22" height="26" rx="3" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="1.8" class="person-body" />
            </svg>
          </div>
          <div class="person-node-name">${name}</div>
        </div>
      `;
    };

    let html = '';

    if (layoutMode === 'cluster') {
      // Clustered MLM Branches: Master (1:N) -> Healers (1:N) -> Trainees (1:1 with Devotee & Seeker)
      const effectiveHealers = tier2List.length > 0 ? tier2List : [{ id: 'mock-h1', name: 'Acharya Devendra', referenceCode: 'SKHM-HLR2-3344-5566' }];

      const healerBranchesHtml = effectiveHealers.map((healer, hIdx) => {
        // Track Root -> Healer link (1:N)
        connections.push({ parentId: `body-tree-node-${rootProfile.id}`, childId: `body-tree-node-${healer.id}` });

        // Find trainees under this healer (1:N)
        let matchedTrainees = tier3List.filter(t => t.referredByCode && t.referredByCode === healer.referenceCode);
        if (matchedTrainees.length === 0 && tier3List.length > 0) {
          matchedTrainees = tier3List.filter((_, idx) => idx % effectiveHealers.length === hIdx);
        }
        if (matchedTrainees.length === 0) {
          matchedTrainees = [{ id: `mock-t-${hIdx}-1`, name: `Trainee ${hIdx + 1}.1`, referenceCode: `T${hIdx}1` }];
        }

        const traineeColumnsHtml = matchedTrainees.map((trainee, tIdx) => {
          // Track Healer -> Trainee link (1:N)
          connections.push({ parentId: `body-tree-node-${healer.id}`, childId: `body-tree-node-${trainee.id}` });

          // Find 1:1 dedicated Devotee (Level 4) under this trainee
          let dedicatedDevotee = tier4List.find(d => d.referredByCode && d.referredByCode === trainee.referenceCode);
          if (!dedicatedDevotee && tier4List.length > 0) {
            dedicatedDevotee = tier4List[tIdx % tier4List.length];
          }

          // Find 1:1 dedicated Seeker (Level 5) under this trainee or devotee
          let dedicatedSeeker = tier5List.find(s => s.referredByCode && (s.referredByCode === trainee.referenceCode || (dedicatedDevotee && s.referredByCode === dedicatedDevotee.referenceCode)));
          if (!dedicatedSeeker && tier5List.length > 0) {
            dedicatedSeeker = tier5List[tIdx % tier5List.length];
          }

          // Track 1:1 pairing connections
          if (dedicatedDevotee) {
            connections.push({ parentId: `body-tree-node-${trainee.id}`, childId: `body-tree-node-${dedicatedDevotee.id}` });
            if (dedicatedSeeker) {
              connections.push({ parentId: `body-tree-node-${dedicatedDevotee.id}`, childId: `body-tree-node-${dedicatedSeeker.id}` });
            }
          } else if (dedicatedSeeker) {
            connections.push({ parentId: `body-tree-node-${trainee.id}`, childId: `body-tree-node-${dedicatedSeeker.id}` });
          }

          return `
            <div class="tree-sub-branch-column tree-trainee-pair-column" id="column-trainee-${trainee.id}">
              <div class="tree-cluster-node-wrap">
                ${renderPersonNode(trainee, 3)}
              </div>
              <div class="tree-dedicated-pair-badge" style="font-size: 0.65rem; color: var(--gold-400); font-weight: 700; text-align: center; margin: 0.2rem 0;">
                🔒 1:1 Dedicated Pair
              </div>
              <div class="tree-leaves-row" id="leaves-devotees-${trainee.id}" style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
                ${dedicatedDevotee ? renderPersonNode(dedicatedDevotee, 4) : ''}
                ${dedicatedSeeker ? renderPersonNode(dedicatedSeeker, 5) : ''}
              </div>
            </div>
          `;
        }).join('');

        return `
          <div class="tree-sub-branch-column" id="column-healer-${healer.id}">
            <div class="tree-cluster-node-wrap">
              ${renderPersonNode(healer, 2)}
            </div>
            <div class="tree-sub-branches-row" id="row-trainees-${healer.id}">
              ${traineeColumnsHtml}
            </div>
          </div>
        `;
      }).join('');

      html = `
        <div class="tree-hierarchy-wrapper" id="tree-hierarchy-wrapper">
          <!-- Tier 1: Top Master Root -->
          <div class="tree-cluster-node-wrap" id="tree-root-cluster">
            ${renderPersonNode(rootProfile, 1, true)}
          </div>
          <!-- Tier 2 & Down: Healers & Sub-branches -->
          <div class="tree-sub-branches-row" id="tree-healers-row">
            ${healerBranchesHtml}
          </div>
        </div>
      `;
    } else {
      // Spiderweb Matrix Layout (5 clean tier rows)
      const effectiveHealers = tier2List.length > 0 ? tier2List : [{ id: 'mock-h1', name: 'Acharya Devendra' }];
      const effectiveTrainees = tier3List.length > 0 ? tier3List : [{ id: 'mock-t1', name: 'Amitabh Sen' }];
      const effectiveDevotees = tier4List.length > 0 ? tier4List : [{ id: 'mock-d1', name: 'Sunita Mehra' }];
      const effectiveSeekers = tier5List.length > 0 ? tier5List : [{ id: 'mock-s1', name: 'Deepak Saxena' }];

      effectiveHealers.forEach(h => {
        connections.push({ parentId: `body-tree-node-${rootProfile.id}`, childId: `body-tree-node-${h.id}` });
      });

      effectiveTrainees.forEach((t, idx) => {
        const parentH = effectiveHealers.find(h => h.referenceCode && h.referenceCode === t.referredByCode) || effectiveHealers[idx % effectiveHealers.length];
        if (parentH) connections.push({ parentId: `body-tree-node-${parentH.id}`, childId: `body-tree-node-${t.id}` });
      });

      effectiveDevotees.forEach((d, idx) => {
        const parentT = effectiveTrainees.find(t => t.referenceCode && t.referenceCode === d.referredByCode) || effectiveTrainees[idx % effectiveTrainees.length];
        if (parentT) connections.push({ parentId: `body-tree-node-${parentT.id}`, childId: `body-tree-node-${d.id}` });
      });

      effectiveSeekers.forEach((s, idx) => {
        const parentD = effectiveDevotees.find(d => d.referenceCode && d.referenceCode === s.referredByCode) || effectiveDevotees[idx % effectiveDevotees.length];
        if (parentD) connections.push({ parentId: `body-tree-node-${parentD.id}`, childId: `body-tree-node-${s.id}` });
      });

      html = `
        <div class="tree-hierarchy-wrapper spiderweb-matrix-flow" id="tree-hierarchy-wrapper">
          <div class="spiderweb-level-row level-1-row" id="body-row-tier-1">
            ${renderPersonNode(rootProfile, 1, true)}
          </div>
          <div class="spiderweb-level-row level-2-row" id="body-row-tier-2">
            ${effectiveHealers.map(h => renderPersonNode(h, 2)).join('')}
          </div>
          <div class="spiderweb-level-row level-3-row" id="body-row-tier-3">
            ${effectiveTrainees.map(t => renderPersonNode(t, 3)).join('')}
          </div>
          <div class="spiderweb-level-row level-4-row" id="body-row-tier-4">
            ${effectiveDevotees.map(d => renderPersonNode(d, 4)).join('')}
          </div>
          <div class="spiderweb-level-row level-5-row" id="body-row-tier-5">
            ${effectiveSeekers.map(s => renderPersonNode(s, 5)).join('')}
          </div>
        </div>
      `;
    }

    this.bodySpiderwebNodesLayer.innerHTML = html;
    this._currentTreeConnections = connections;

    // Draw connecting bezier lines with exact coordinates
    setTimeout(() => {
      this._drawInBodyConnectingLines(connections);
    }, 50);

    // Auto smart-fit on render
    setTimeout(() => {
      this.smartFitInBodyTree();
    }, 100);
};

ProfileView.prototype._drawInBodyConnectingLines = function(connections = []) {
    if (!this.bodySpiderwebSvgLayer || !this.bodySpiderwebNodesLayer || typeof this.bodySpiderwebNodesLayer.getBoundingClientRect !== "function") return;

    const surfaceRect = this.bodySpiderwebNodesLayer.getBoundingClientRect();
    const scale = this.inBodyTreePanState?.scale || 1.0;

    const getCenterAnchor = (elemId, isTop = false) => {
      const el = document.getElementById(elemId);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = (rect.left + rect.width / 2 - surfaceRect.left) / scale;
      const y = (isTop ? (rect.top - surfaceRect.top) : (rect.bottom - surfaceRect.top)) / scale;
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
};

ProfileView.prototype.smartFitInBodyTree = function() {
    if (!this.bodyTreeCanvasViewport || typeof this.bodyTreeCanvasViewport.getBoundingClientRect !== "function" || !this.bodySpiderwebNodesLayer) return;

    const wrapper = document.getElementById('tree-hierarchy-wrapper');
    if (!wrapper || typeof wrapper.getBoundingClientRect !== "function") return;

    const vpRect = this.bodyTreeCanvasViewport.getBoundingClientRect();
    const contentRect = wrapper.getBoundingClientRect();

    const currentScale = this.inBodyTreePanState?.scale || 1.0;
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
};

ProfileView.prototype.zoomInBodyTree = function() {
    this.inBodyTreePanState.scale = Math.min(2.5, this.inBodyTreePanState.scale + 0.18);
    this._applyInBodyTreeTransform(true);
};

ProfileView.prototype.zoomOutBodyTree = function() {
    this.inBodyTreePanState.scale = Math.max(0.3, this.inBodyTreePanState.scale - 0.18);
    this._applyInBodyTreeTransform(true);
};

ProfileView.prototype.resetInBodyTree = function() {
    this.inBodyTreePanState.scale = 1.0;
    this.inBodyTreePanState.panX = 0;
    this.inBodyTreePanState.panY = 30;
    this._applyInBodyTreeTransform(true);
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
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
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
};

ProfileView.prototype.closeNodeActionDialog = function() {
    if (this.nodeActionDialog) {
      this.nodeActionDialog.classList.remove('open');
      this.nodeActionDialog.setAttribute('aria-hidden', 'true');
    }
};

ProfileView.prototype.renderHierarchyTree = function(profiles, focusTier = null) {
    // Forward to in-body rendering or modal
    this.renderInBodyHierarchyTree(profiles, focusTier, '', 'cluster');
};

ProfileView.prototype._drawSpiderwebConnectingLines = function(root, tier2, tier3, tier4) {
    this._drawInBodyConnectingLines(root, tier2, tier3, tier4, 'cluster');
};

ProfileView.prototype._resetTreePanZoom = function() {
    this.resetInBodyTree();
};

ProfileView.prototype._applyTreeTransform = function() {
    this._applyInBodyTreeTransform(true);
};

ProfileView.prototype._initTreePanZoomEvents = function() {
    this._initInBodyTreePanZoomEvents();
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
};

ProfileView.prototype.renderAndroidHealersHub = function(scopedProfiles = [], activeProfile = null, roleMode = 'MASTER') {
    // 1. Summary Metrics
    const isMaster = roleMode === 'MASTER' || roleMode === 'ADMIN';
    const isHealer = roleMode === 'HEALER';
    const isTrainee = roleMode === 'TRAINEE';
    const isDevotee = roleMode === 'DEVOTEE';

    const rawAdmin = scopedProfiles.filter(p => p.profileType === 'ADMIN' || p.level === 1).length;
    const rawHealers = scopedProfiles.filter(p => p.profileType === 'HEALER' || p.level === 2 || p.level === 3).length;
    const rawTrainees = scopedProfiles.filter(p => p.profileType === 'TRAINEE' || p.level === 4).length;
    const rawDevotees = scopedProfiles.filter(p => p.profileType === 'DEVOTEE' || p.level === 5).length;

    const adminCount = isMaster ? rawAdmin : 0;
    const healersCount = (isMaster || isHealer) ? rawHealers : 0;
    const traineesCount = (isMaster || isHealer || isTrainee) ? rawTrainees : 0;
    const devoteesCount = rawDevotees;
    const totalCount = adminCount + healersCount + traineesCount + devoteesCount;

    if (this.hubMetricTotal) this.hubMetricTotal.textContent = totalCount;
    if (this.hubMetricAdmin) this.hubMetricAdmin.textContent = adminCount;
    if (this.hubMetricHealers) this.hubMetricHealers.textContent = healersCount;
    if (this.hubMetricTrainees) this.hubMetricTrainees.textContent = traineesCount;
    if (this.hubMetricDevotees) this.hubMetricDevotees.textContent = devoteesCount;

    // 2. Category Filter Chip Counts
    const setChipText = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };
    setChipText('chip-cnt-all', totalCount);
    setChipText('chip-cnt-admin', adminCount);
    setChipText('chip-cnt-healers', healersCount);
    setChipText('chip-cnt-trainees', traineesCount);
    setChipText('chip-cnt-devotees', devoteesCount);

    // 3. Filter List by Category & Search Query
    const query = (this.healersSearchQuery || '').trim().toLowerCase();
    const category = this.healersSelectedCategory || 'ALL';

    const filtered = scopedProfiles.filter(p => {
      const matchesCategory = category === 'ALL' || p.profileType === category;
      const matchesQuery = !query ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.referenceCode && p.referenceCode.toLowerCase().includes(query)) ||
        (p.phone && p.phone.includes(query)) ||
        (p.city && p.city.toLowerCase().includes(query)) ||
        (p.level && p.level.toString() === query);
      return matchesCategory && matchesQuery;
    });

    if (!this.healersHubCardsContainer) {
      this.healersHubCardsContainer = document.getElementById('healers-hub-cards-container');
    }
    if (!this.healersHubCardsContainer) return;

    const gridBtn = document.getElementById('btn-layout-grid');
    const tableBtn = document.getElementById('btn-layout-table');
    const gridContainer = this.healersHubCardsContainer;
    const tableContainer = document.getElementById('healers-hub-table-container');

    if (gridBtn && tableBtn) {
      gridBtn.classList.toggle('active', this.directoryLayout === 'GRID');
      tableBtn.classList.toggle('active', this.directoryLayout === 'TABLE');
    }

    if (this.directoryLayout === 'TABLE' && tableContainer) {
      if (gridContainer) gridContainer.style.display = 'none';
      tableContainer.style.display = 'block';
      tableContainer.innerHTML = `
        <table class="healers-hub-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role Tier</th>
              <th>16-Digit Code</th>
              <th>Sponsor Mentor</th>
              <th>Phone / WhatsApp</th>
              <th>City</th>
              <th>Stamp</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => `
              <tr class="healer-table-row" data-id="${p.id}">
                <td>
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <div class="avatar-circle ${getAvatarClass(p)}" style="width: 32px; height: 32px; font-size: 0.78rem;">${(p.name || 'U').substring(0, 2).toUpperCase()}</div>
                    <strong style="color: var(--gold-300);">${escapeHtmlUtil(p.name || 'Untitled')}</strong>
                  </div>
                </td>
                <td><span class="badge-status-pill ${getBadgeClass(p)}">${escapeHtmlUtil(p.profileType)} (L${p.level || 1})</span></td>
                <td><code class="font-mono" style="font-size: 0.78rem; color: var(--gold-400);">${escapeHtmlUtil(p.referenceCode || 'N/A')}</code></td>
                <td><code class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtmlUtil(p.referredByCode || 'ROOT')}</code></td>
                <td>${escapeHtmlUtil(p.phone || 'N/A')}</td>
                <td>${escapeHtmlUtil(p.city || 'N/A')}</td>
                <td><span class="stamp-badge ${p.paymentStatus === 'PAID' ? 'stamp-paid' : 'stamp-free'}">${p.paymentStatus || 'PAID'}</span></td>
                <td style="text-align: right;">
                  <button type="button" class="btn btn-xs btn-gold btn-hub-select-profile" data-id="${p.id}">View Profile</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      return;
    } else {
      if (tableContainer) tableContainer.style.display = 'none';
      if (gridContainer) gridContainer.style.display = 'grid';
    }


    if (filtered.length === 0) {
      this.healersHubCardsContainer.innerHTML = `
        <div class="healers-empty-state">
          <div class="healers-empty-state-icon">🔍</div>
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">No profiles found</div>
          <div style="font-size: 0.82rem;">No member profiles match "${query || category}". Try adjusting search filters.</div>
        </div>
      `;
      return;
    }

    const getAvatarClass = (p) => {
      const lvl = parseInt(p.level, 10);
      const type = (p.profileType || '').toUpperCase();
      if (type === 'ADMIN' || lvl === 1) return 'avatar-admin';
      if (type === 'HEALER' || lvl === 2) return 'avatar-healer';
      if (type === 'TRAINEE' || lvl === 3) return 'avatar-trainee';
      if (type === 'DEVOTEE' || lvl === 4) return 'avatar-devotee';
      return 'avatar-seeker';
    };

    const getBadgeClass = (p) => {
      const lvl = parseInt(p.level, 10);
      const type = (p.profileType || '').toUpperCase();
      if (type === 'ADMIN' || lvl === 1) return 'badge-pill-admin';
      if (type === 'HEALER' || lvl === 2) return 'badge-pill-healer';
      if (type === 'TRAINEE' || lvl === 3) return 'badge-pill-trainee';
      if (type === 'DEVOTEE' || lvl === 4) return 'badge-pill-devotee';
      return 'badge-pill-seeker';
    };

    const getRoleName = (p) => {
      const lvl = parseInt(p.level, 10);
      const type = (p.profileType || '').toUpperCase();
      if (type === 'ADMIN' || lvl === 1) return 'Founder Master';
      if (type === 'HEALER' || lvl === 2) return 'Spiritual Healer';
      if (type === 'TRAINEE' || lvl === 3) return 'Sadhak Trainee (1:1)';
      if (type === 'DEVOTEE' || lvl === 4) return 'Active Devotee (1:1)';
      return 'Seeker Applicant (1:1)';
    };

    this.healersHubCardsContainer.innerHTML = filtered.map(p => {
      const remediesCount = (p.selectedRemedies || []).length;
      const isCurrentActive = activeProfile && activeProfile.id === p.id;

      return `
        <div class="healer-member-card ${isCurrentActive ? 'active-member-card' : ''}" data-profile-id="${p.id}" style="${isCurrentActive ? 'border-color: var(--gold-400); background: rgba(212, 175, 55, 0.08);' : ''}">
          <!-- Level Avatar Box -->
          <div class="healer-member-avatar-box ${getAvatarClass(p)}">
            L${p.level || 1}
          </div>

          <!-- Main Info -->
          <div class="healer-member-info">
            <div class="healer-member-name-row">
              <span class="healer-member-name">${p.name || 'Member'}</span>
              <span class="healer-role-badge-pill ${getBadgeClass(p)}">${getRoleName(p)}</span>
              ${p.isPaid ? '<span class="stamp-indicator stamp-paid" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">PAID</span>' : '<span class="stamp-indicator stamp-free" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">FREE</span>'}
            </div>

            <div class="healer-member-contact">
              ${p.phone || '+91 98000 00000'} • ${p.city || 'National'}
            </div>

            <!-- 16-Digit Reference Code Pill with Copy -->
            <div>
              <span class="healer-ref-code-pill btn-copy-card-code" data-code="${p.referenceCode}" title="Click to copy 16-digit reference code">
                <span>📱</span>
                <span class="healer-ref-code-text">${p.referenceCode || 'SKHM-0000-0000-0000'}</span>
                <span style="font-size: 0.72rem; color: var(--text-muted);">📋</span>
              </span>
            </div>

            <!-- Referred By & Remedy Pill -->
            <div class="healer-member-meta-row">
              <span>Sponsor: ${(p.referredByCode || 'ROOT-0000-0000-0000').substring(0, 14)}...</span>
              ${remediesCount > 0 ? `<span class="healer-remedy-count-pill">🌿 ${remediesCount} Remedies</span>` : ''}
            </div>
          </div>

          <!-- 3-Dots Action Menu Trigger -->
          <div style="position: relative;">
            <button type="button" class="healer-card-actions-menu-btn btn-member-quick-opts" data-profile-id="${p.id}" title="Member Actions">
              ⋮
            </button>
          </div>
        </div>
      `;
    }).join('');
};

ProfileView.prototype.renderAndroidHierarchyTree = function(profiles = [], levelFilter = 'ALL', activeProfile = null, treeScope = 'downline') {
    if (!this.hierarchyRecursiveTreeView) {
      this.hierarchyRecursiveTreeView = document.getElementById('hierarchy-recursive-tree-view');
    }
    if (!this.hierarchyRecursiveTreeView) return;

    const allProfiles = profiles || [];
    const focusNode = activeProfile || (this.allProfiles ? this.allProfiles[0] : allProfiles[0]);
    if (!focusNode) {
      this.hierarchyRecursiveTreeView.innerHTML = '<div class="healers-empty-state"><div class="healers-empty-state-icon">🌳</div><div>No tree members found.</div></div>';
      return;
    }

    // 1. Update Level Filter Chip Counts
    const setTreeCount = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };
    setTreeCount('tree-cnt-all', allProfiles.length);
    setTreeCount('tree-cnt-1', allProfiles.filter(p => p.level === 1 || p.profileType === 'ADMIN').length);
    setTreeCount('tree-cnt-2', allProfiles.filter(p => p.level === 2 || p.profileType === 'HEALER').length);
    setTreeCount('tree-cnt-3', allProfiles.filter(p => p.level === 3 || p.profileType === 'TRAINEE').length);
    setTreeCount('tree-cnt-4', allProfiles.filter(p => p.level === 4 || p.profileType === 'DEVOTEE').length);
    setTreeCount('tree-cnt-5', allProfiles.filter(p => p.level === 5 || p.profileType === 'SEEKER').length);

    // 2. Build Ancestral Upline Breadcrumb Path (Top of Tree)
    const breadcrumbChain = [];
    let currentTrace = focusNode;
    const visitedCodes = new Set();

    while (currentTrace && !visitedCodes.has(currentTrace.referenceCode)) {
      visitedCodes.add(currentTrace.referenceCode);
      breadcrumbChain.unshift(currentTrace);
      if (!currentTrace.referredByCode || currentTrace.referredByCode === 'ROOT' || currentTrace.referredByCode === 'ROOT-0000-0000-0000') {
        break;
      }
      const parent = allProfiles.find(p => p.referenceCode === currentTrace.referredByCode);
      if (!parent || parent.id === currentTrace.id) break;
      currentTrace = parent;
    }

    const breadcrumbHtml = breadcrumbChain.map((node, idx) => {
      const isCurrent = node.id === focusNode.id;
      const roleIcon = node.profileType === 'ADMIN' ? '👑' : (node.profileType === 'HEALER' ? '🛡️' : (node.profileType === 'TRAINEE' ? '🌿' : '🌟'));
      return `
        <span class="tree-breadcrumb-item ${isCurrent ? 'current-node' : 'btn-jump-profile-trigger'}" data-profile-id="${node.id}" title="Jump to ${node.name}">
          ${roleIcon} ${node.name}
        </span>
        ${idx < breadcrumbChain.length - 1 ? '<span class="tree-breadcrumb-sep">âž”</span>' : ''}
      `;
    }).join('');

    // 3. Calculate Direct and Total Downline Sub-tree for Focus Node
    const getDownlineMembers = (parentCode, visited = new Set()) => {
      const list = [];
      const direct = allProfiles.filter(p => p.referredByCode === parentCode && p.id !== focusNode.id);
      for (const d of direct) {
        if (!visited.has(d.referenceCode)) {
          visited.add(d.referenceCode);
          list.push(d);
          list.push(...getDownlineMembers(d.referenceCode, visited));
        }
      }
      return list;
    };

    const directChildren = allProfiles.filter(p => p.referredByCode === focusNode.referenceCode && p.id !== focusNode.id);
    const totalDownlines = getDownlineMembers(focusNode.referenceCode);
    const isPaid = focusNode.isPaid !== false && focusNode.paymentStatus !== 'FREE';
    const initials = (focusNode.name || 'SK').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    // 4. Render Top Focus Node Banner
    const topBannerHtml = `
      <div class="tree-focus-top-banner">
        <div class="tree-ancestral-breadcrumb">
          <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Lineage Path:</span>
          ${breadcrumbHtml}
        </div>

        <div class="tree-focus-profile-row">
          <div class="tree-focus-avatar-group">
            <div class="tree-focus-avatar">${initials}</div>
            <div>
              <div class="tree-focus-title">${focusNode.name}</div>
              <div class="tree-focus-sub">
                <span class="role-badge" style="font-size: 0.68rem; padding: 0.15rem 0.5rem;">${focusNode.profileType} • LVL ${focusNode.level || 1}</span>
                <span style="font-family: monospace;">${focusNode.referenceCode}</span>
                <span class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'}" style="font-size: 0.65rem;">${isPaid ? 'PAID' : 'FREE'}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button type="button" class="btn btn-xs btn-outline btn-toggle-tree-view-scope" data-scope="${treeScope === 'downline' ? 'org' : 'downline'}" title="Switch between scoped downline and full org tree">
              ${treeScope === 'downline' ? '🌐 View Entire Org Tree' : '🎯 View Focus Downlines'}
            </button>
          </div>
        </div>

        <div class="tree-metrics-bar">
          <div class="tree-metric-box">
            <div class="tree-metric-label">Direct Referrals (L1)</div>
            <div class="tree-metric-val">${directChildren.length}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Total Downlines</div>
            <div class="tree-metric-val">${totalDownlines.length}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Upline Sponsor</div>
            <div class="tree-metric-val" style="font-size: 0.75rem; font-family: monospace;">${focusNode.referredByCode || 'ROOT'}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Network Status</div>
            <div class="tree-metric-val" style="color: #10b981; font-size: 0.8rem;">🟢 ACTIVE</div>
          </div>
        </div>
      </div>
    `;

    // 5. Render Recursive Downline Nodes
    let treeBodyHtml = '';

    if (levelFilter !== 'ALL') {
      const targetLvl = parseInt(levelFilter, 10);
      const levelRoots = allProfiles.filter(p => {
        const lvl = parseInt(p.level, 10);
        const type = (p.profileType || '').toUpperCase();
        if (targetLvl === 1) return lvl === 1 || type === 'ADMIN';
        if (targetLvl === 2) return lvl === 2 || type === 'HEALER';
        if (targetLvl === 3) return lvl === 3 || type === 'TRAINEE';
        if (targetLvl === 4) return lvl === 4 || type === 'DEVOTEE';
        if (targetLvl === 5) return lvl === 5 || type === 'SEEKER';
        return lvl === targetLvl;
      });

      let totalConnectedUnderLevel = 0;
      levelRoots.forEach(r => {
        totalConnectedUnderLevel += getDownlineMembers(r.referenceCode).length;
      });

      treeBodyHtml = `
        <div class="tree-scope-title" style="margin-bottom: 0.85rem; color: var(--gold-400);">
          <span>🌳</span> Level Generation ${targetLvl} Lineages &amp; Downlines (${levelRoots.length} Root Nodes • ${totalConnectedUnderLevel} Connected Downlines)
        </div>
        ${levelRoots.length > 0 ? levelRoots.map(root => this._renderRecursiveTreeBranchHtml(root, allProfiles, 0)).join('') : '<div class="healers-empty-state"><div class="healers-empty-state-icon">🌐±</div><div>No members found at Level ' + targetLvl + '</div></div>'}
      `;
    } else if (treeScope === 'downline') {
      // Scoped Downline Tree under Focus Node
      if (directChildren.length === 0) {
        treeBodyHtml = `
          <div class="healers-empty-state" style="background: rgba(0,0,0,0.25); border: 1px dashed rgba(212,175,55,0.25); border-radius: 0.75rem; padding: 2rem 1rem;">
            <div class="healers-empty-state-icon">🌐±</div>
            <div style="font-weight: 700; color: var(--gold-400); margin-bottom: 0.35rem;">No Downline Disciples Yet under ${focusNode.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1rem auto;">
              Share reference code <strong>${focusNode.referenceCode}</strong> or 24-Hour pairing invite from the top bar to connect new trainees and seekers under this lineage.
            </div>
            <div style="display: flex; justify-content: center; gap: 0.6rem;">
              <button type="button" class="btn btn-sm btn-gold" id="btn-tree-copy-invite" data-code="${focusNode.referenceCode}">
                📋 Copy Invite Code
              </button>
              <button type="button" class="btn btn-sm btn-outline btn-toggle-tree-view-scope" data-scope="org">
                🌐 View Full Organization Tree (${allProfiles.length})
              </button>
            </div>
          </div>
        `;
      } else {
        treeBodyHtml = `
          <div class="tree-scope-title" style="margin-bottom: 0.75rem; color: var(--gold-400);">
            <span>🌿</span> Connected Downlines under ${focusNode.name} (${totalDownlines.length} Members)
          </div>
          ${this._renderRecursiveTreeBranchHtml(focusNode, allProfiles, 0)}
        `;
      }
    } else {
      // Full Organization Tree (starting from root level 1 nodes)
      const allRefCodes = new Set(allProfiles.map(p => p.referenceCode));
      const rootProfiles = allProfiles.filter(p => p.level === 1 || p.profileType === 'ADMIN' || !allRefCodes.has(p.referredByCode));
      const effectiveRoots = rootProfiles.length > 0 ? rootProfiles : [allProfiles[0]];

      treeBodyHtml = `
        <div class="tree-scope-title" style="margin-bottom: 0.75rem; color: var(--gold-400);">
          <span>🌐</span> Full Organization Lineage Tree (${allProfiles.length} Members)
        </div>
        ${effectiveRoots.map(root => this._renderRecursiveTreeBranchHtml(root, allProfiles, 0)).join('')}
      `;
    }

    this.hierarchyRecursiveTreeView.innerHTML = topBannerHtml + treeBodyHtml;
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
};

ProfileView.prototype._renderHierarchyNodeCardHtml = function(profile, hasChildren = false, isExpanded = true, directChildrenCount = 0, allProfiles = []) {
    const getAvatarBg = (p) => {
      const lvl = parseInt(p.level, 10);
      const type = (p.profileType || '').toUpperCase();
      if (type === 'ADMIN' || lvl === 1) return 'linear-gradient(135deg, #7a1c37, #b91c1c)';
      if (type === 'HEALER' || lvl === 2) return 'linear-gradient(135deg, #fcb900, #d97706)';
      if (type === 'TRAINEE' || lvl === 3) return 'linear-gradient(135deg, #00d084, #059669)';
      if (type === 'DEVOTEE' || lvl === 4) return 'linear-gradient(135deg, #0088cc, #2563eb)';
      return 'linear-gradient(135deg, #06b6d4, #0284c7)';
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
};

ProfileView.prototype._escapeHtml = function(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
      valPreviewHtml = `<span class="rtdb-val-preview rtdb-val-string" title="${esc(value)}">"${esc(value.length > 65 ? value.slice(0, 65) + '...' : value)}"</span>`;
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
            ${isObject ? `<span class="rtdb-key-count">${isArray ? value.length + ' items' : Object.keys(value).length + ' keys'}</span>` : ''}
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
};

ProfileView.prototype._getRtdbSecurityBadge = function(pathStr) {
    if (pathStr.startsWith('system_config') || pathStr.startsWith('audit_logs')) {
      return '<span class="rtdb-security-badge sec-admin">🛡️ Admin</span>';
    }
    if (pathStr.startsWith('sadhana_catalog')) {
      return '<span class="rtdb-security-badge sec-public">🌐 Public</span>';
    }
    return '<span class="rtdb-security-badge sec-auth">🔒 Auth</span>';
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
      editor.value = typeof nodeData === 'object' ? JSON.stringify(nodeData, null, 2) : String(nodeData);
      editor.setAttribute('data-target-path', pathStr);
    }

    if (statusEl) statusEl.textContent = 'Ready to edit or copy';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
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
};



ProfileView.prototype.renderRichListBox = function(containerId, config = {}) {
    const esc = (typeof escapeHtmlUtil === 'function') ? escapeHtmlUtil : (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return null;

    const title = config.title || 'Spiritual Member Directory';
    const items = config.items || [];
    const onSelect = config.onSelect;
    const filterPlaceholder = config.placeholder || 'Filter by name, code, or role...';

    const listboxWrap = document.createElement('div');
    listboxWrap.className = 'spiritual-rich-listbox-wrap';

    const headerRow = document.createElement('div');
    headerRow.className = 'rich-listbox-header-row';

    const titleEl = document.createElement('div');
    titleEl.className = 'rich-listbox-title';
    titleEl.innerHTML = `<span>📁 ${esc(title)}</span> <span class="badge badge-gold" id="rich-listbox-count">${items.length}</span>`;

    const searchWrap = document.createElement('div');
    searchWrap.className = 'rich-listbox-search-wrap';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'rich-listbox-search-input';
    searchInput.placeholder = esc(filterPlaceholder);
    searchInput.setAttribute('aria-label', 'Filter List');

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'rich-listbox-clear-btn';
    clearBtn.style.display = 'none';
    clearBtn.innerHTML = '&times;';

    searchWrap.appendChild(searchInput);
    searchWrap.appendChild(clearBtn);

    headerRow.appendChild(titleEl);
    headerRow.appendChild(searchWrap);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'rich-listbox-items-container';
    itemsContainer.setAttribute('role', 'listbox');

    listboxWrap.appendChild(headerRow);
    listboxWrap.appendChild(itemsContainer);

    const countBadge = titleEl.querySelector('#rich-listbox-count');

    const renderItems = (filterText = '') => {
      const q = filterText.toLowerCase().trim();
      const filtered = items.filter(it => {
        if (!q) return true;
        const t = (it.title || it.name || it.label || '').toLowerCase();
        const s = (it.subtitle || it.category || it.role || it.referenceCode || '').toLowerCase();
        return t.includes(q) || s.includes(q);
      });

      if (countBadge) countBadge.textContent = filtered.length;

      itemsContainer.innerHTML = '';
      if (filtered.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'rich-listbox-empty';
        emptyEl.textContent = '🔍 No matching records found. Try another search keyword.';
        itemsContainer.appendChild(emptyEl);
        return;
      }

      filtered.forEach((it, idx) => {
        const id = it.id || it.value || ('item-' + idx);
        const name = it.title || it.name || it.label || 'Spiritual Entry';
        const role = it.role || it.category || 'DEVOTEE';
        const status = it.status || (it.isActive !== false ? 'ACTIVE' : 'PENDING');
        const statusClass = status.toUpperCase() === 'ACTIVE' || status.toUpperCase() === 'PAID' ? 'status-active' : 'status-pending';
        const details = it.details || it.description || it.notes || '';
        const avatarText = (it.avatarText || name.split(' ').map(w => w[0]).slice(0, 2).join('')).toUpperCase();

        const itemEl = document.createElement('div');
        itemEl.className = 'rich-listbox-item';
        itemEl.setAttribute('data-id', id);
        itemEl.setAttribute('role', 'option');
        itemEl.setAttribute('tabindex', '0');

        itemEl.innerHTML = `
          <div class="rich-listbox-item-main">
            <div class="rich-listbox-avatar">${esc(avatarText)}</div>
            <div class="rich-listbox-info">
              <div class="rich-listbox-name-row">
                <span class="rich-listbox-item-name">${esc(name)}</span>
                <span class="badge badge-role ${statusClass}">${esc(status)}</span>
              </div>
              <div class="rich-listbox-item-meta">
                <span class="meta-role">👑 ${esc(role)}</span>
                ${it.referenceCode ? `<span class="meta-code font-mono">• ${esc(it.referenceCode)}</span>` : ''}
                ${it.phone ? `<span class="meta-phone">• 📞 ${esc(it.phone)}</span>` : ''}
              </div>
            </div>
            <button type="button" class="btn btn-xs btn-outline rich-listbox-toggle-btn" aria-label="Toggle Details">
              <span class="toggle-icon">▼</span> Details
            </button>
          </div>
          <div class="rich-listbox-dropdown-details" style="display: none;">
            <div class="dropdown-details-inner">
              <div class="dropdown-details-grid">
                <div><strong>Ref Code:</strong> ${esc(it.referenceCode || 'N/A')}</div>
                <div><strong>Sponsor:</strong> ${esc(it.referredByCode || it.sponsorCode || 'Root')}</div>
                <div><strong>Level:</strong> ${esc(it.level !== undefined ? 'Level ' + it.level : 'Level 4')}</div>
                <div><strong>Joined:</strong> ${esc(it.joinDate || it.joiningDate || 'Recent')}</div>
              </div>
              ${details ? `<div class="dropdown-details-notes mt-2">${esc(details)}</div>` : ''}
            </div>
          </div>
        `;

        const toggleBtn = itemEl.querySelector('.rich-listbox-toggle-btn');
        const detailsEl = itemEl.querySelector('.rich-listbox-dropdown-details');
        const toggleIcon = itemEl.querySelector('.toggle-icon');

        const toggleDropdown = () => {
          if (!detailsEl) return;
          const isOpen = detailsEl.style.display !== 'none';
          detailsEl.style.display = isOpen ? 'none' : 'block';
          if (toggleIcon) toggleIcon.textContent = isOpen ? '▼' : '▲';
          itemEl.classList.toggle('is-expanded', !isOpen);
        };

        if (toggleBtn) {
          toggleBtn.addEventListener('click', (e) => {
            if (e.stopPropagation) e.stopPropagation();
            toggleDropdown();
          });
        }

        itemEl.addEventListener('click', (e) => {
          const itemId = itemEl.getAttribute('data-id');
          const found = items.find(x => (x.id || x.value || '') === itemId);
          if (typeof onSelect === 'function') onSelect(itemId, found);
        });

        itemsContainer.appendChild(itemEl);
      });
    };

    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      clearBtn.style.display = val ? 'inline-block' : 'none';
      renderItems(val);
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      renderItems('');
      if (searchInput.focus) searchInput.focus();
    });

    renderItems();
    container.innerHTML = '';
    container.appendChild(listboxWrap);
    return listboxWrap;
};

ProfileView.prototype.openSadhanaExplorerModal = function(initialKey) {
  const modal = document.getElementById('modal-sadhana-explorer');
  if (!modal) return;
  modal.classList.add('is-active', 'open');
  modal.setAttribute('aria-hidden', 'false');

  const catalog = (typeof SADHANA_CATALOG !== 'undefined') ? SADHANA_CATALOG : {};
  const sadhanas = Object.values(catalog).filter(item => item.domain === 'sadhanas' || (item.category && item.category.includes('Sadhana')));
  
  let activeFilter = 'ALL';
  let searchQuery = '';
  let selectedKey = initialKey || (sadhanas[0] ? sadhanas[0].id : 'sri_yantra');

  const listContainer = document.getElementById('sadhana-explorer-list');
  const detailContainer = document.getElementById('sadhana-explorer-detail');
  const searchInput = document.getElementById('search-sadhana-explorer');
  const pills = document.querySelectorAll('#filter-pills-sadhana .split-explorer-pill');

  const renderDetail = (key) => {
    const item = catalog[key] || sadhanas[0];
    if (!item || !detailContainer) return;
    detailContainer.innerHTML = `
      <div class="split-detail-banner">
        <div class="split-detail-header-left">
          <div class="split-detail-header-icon">${item.icon || '📿'}</div>
          <div>
            <h2 class="split-detail-title">${item.title}</h2>
            <div class="split-detail-meta">
              <span><strong>Category:</strong> ${item.category || 'Sacred Sadhana'}</span>
              <span>&bull;</span>
              <span><strong>Scope:</strong> ${item.levelScope || 'Level 1–4'}</span>
            </div>
          </div>
        </div>
        <div>
          <button type="button" class="btn btn-gold btn-sm btn-enroll-sadhana-action" data-sadhana-id="${item.id}">📿 Enroll in Sadhana</button>
        </div>
      </div>

      <div class="split-detail-section">
        <div class="split-detail-section-title"><span>🌟</span> Spiritual Essence &amp; Overview</div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">${item.summary || 'Sacred sadhana curriculum authorized by Spiritual Karim.'}</p>
      </div>

      ${item.mantra ? `
      <div class="split-detail-section">
        <div class="split-detail-section-title"><span>🕉️</span> Sacred Beej Mantra &amp; Vibrational Jaap</div>
        <div class="split-detail-mantra-box">
          <div class="split-detail-mantra-text">${item.mantra}</div>
          <button type="button" class="btn btn-sm btn-outline btn-copy-mantra-text" data-mantra="${encodeURIComponent(item.mantra)}" title="Copy Mantra">📋 Copy</button>
        </div>
      </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
        <div class="split-detail-section" style="margin-bottom: 0;">
          <div class="split-detail-section-title"><span>⏱️</span> Auspicious Timing &amp; Direction</div>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0 0 0.4rem 0;"><strong>Timing:</strong> ${item.timing || 'Brahma Muhurta'}</p>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;"><strong>Aasan &amp; Direction:</strong> ${item.aasanDirection || 'East Facing'}</p>
        </div>

        <div class="split-detail-section" style="margin-bottom: 0;">
          <div class="split-detail-section-title"><span>🌿</span> Essential Samagri</div>
          <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${item.ingredients || 'Pure Cow Ghee Diya, Ganga Jal, Consecrated Mala.'}</p>
        </div>
      </div>

      ${Array.isArray(item.steps) && item.steps.length > 0 ? `
      <div class="split-detail-section">
        <div class="split-detail-section-title"><span>📜</span> Step-by-Step Ritual Protocol</div>
        <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.7;">
          ${item.steps.map(st => `<li style="margin-bottom: 0.35rem;">${st}</li>`).join('')}
        </ol>
      </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        <div class="split-detail-section" style="margin-bottom: 0;">
          <div class="split-detail-section-title" style="color: #34d399;"><span>🛡️</span> Key Benefits &amp; Astral Shield</div>
          <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${item.benefits || 'Elevation of spiritual aura, purification of karmic debts.'}</p>
        </div>

        <div class="split-detail-section" style="margin-bottom: 0;">
          <div class="split-detail-section-title" style="color: #f87171;"><span>⚠️</span> Rules &amp; Strict Cautions</div>
          <p style="font-size: 0.84rem; color: #fca5a5; line-height: 1.5; margin: 0;">${item.cautions || 'Maintain complete mental purity and satvik discipline during sadhana.'}</p>
        </div>
      </div>
    `;

    const copyBtn = detailContainer.querySelector('.btn-copy-mantra-text');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const m = decodeURIComponent(copyBtn.getAttribute('data-mantra'));
        if (navigator.clipboard) navigator.clipboard.writeText(m);
        if (this.showSlideToast) this.showSlideToast("Mantra Copied", "📋 Sacred Mantra copied to clipboard", "success", 2500);
      };
    }

    const enrollBtn = detailContainer.querySelector('.btn-enroll-sadhana-action');
    if (enrollBtn) {
      enrollBtn.onclick = () => {
        if (this.showSlideToast) this.showSlideToast("Sadhana Enrolled", `📿 Active Devotee successfully enrolled in: ${item.title}`, "success", 3500);
      };
    }
  };

  const renderList = () => {
    if (!listContainer) return;
    const q = searchQuery.toLowerCase().trim();
    const filtered = sadhanas.filter(item => {
      const matchFilter = activeFilter === 'ALL' || (item.levelScope && item.levelScope.includes(activeFilter)) || (item.category && item.category.includes(activeFilter));
      const matchSearch = !q || (item.title && item.title.toLowerCase().includes(q)) || (item.summary && item.summary.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.8rem;">🔍 No sadhanas match your search.</div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(item => `
      <div class="split-catalog-card ${item.id === selectedKey ? 'active' : ''}" data-sadhana-id="${item.id}">
        <div class="split-catalog-icon">${item.icon || '📿'}</div>
        <div class="split-catalog-meta">
          <div class="split-catalog-name">${item.title}</div>
          <div class="split-catalog-desc">${item.summary || ''}</div>
          <span class="split-catalog-tag">${item.levelScope || item.category}</span>
        </div>
      </div>
    `).join('');

    listContainer.querySelectorAll('.split-catalog-card').forEach(card => {
      card.onclick = () => {
        selectedKey = card.getAttribute('data-sadhana-id');
        listContainer.querySelectorAll('.split-catalog-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        renderDetail(selectedKey);
      };
    });
  };

  if (searchInput) {
    searchInput.oninput = () => {
      searchQuery = searchInput.value;
      renderList();
    };
  }

  pills.forEach(pill => {
    pill.onclick = () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter');
      renderList();
    };
  });

  const closeBtn = document.getElementById('btn-close-sadhana-explorer');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('is-active', 'open');
      modal.setAttribute('aria-hidden', 'true');
    };
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-active', 'open');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  renderList();
  renderDetail(selectedKey);
};

ProfileView.prototype.openRemedyHubModal = function(initialKey) {
  const modal = document.getElementById('modal-remedy-upay-hub');
  if (!modal) return;
  modal.classList.add('is-active', 'open');
  modal.setAttribute('aria-hidden', 'false');

  const catalog = (typeof SADHANA_CATALOG !== 'undefined') ? SADHANA_CATALOG : {};
  const remedies = Object.values(catalog).filter(item => item.domain === 'remedies' || item.domain === 'cleansing' || (item.category && (item.category.includes('Remedy') || item.category.includes('Cleansing'))));
  
  let activeFilter = 'ALL';
  let searchQuery = '';
  let selectedKey = initialKey || (remedies[0] ? remedies[0].id : 'three_diya');

  const listContainer = document.getElementById('remedy-hub-list');
  const detailContainer = document.getElementById('remedy-hub-detail');
  const searchInput = document.getElementById('search-remedy-hub');
  const pills = document.querySelectorAll('#filter-pills-remedy .split-explorer-pill');

  const renderDetail = (key) => {
    const item = catalog[key] || remedies[0];
    if (!item || !detailContainer) return;
    detailContainer.innerHTML = `
      <div class="split-detail-banner">
        <div class="split-detail-header-left">
          <div class="split-detail-header-icon">${item.icon || '🌿'}</div>
          <div>
            <h2 class="split-detail-title">${item.title}</h2>
            <div class="split-detail-meta">
              <span><strong>Category:</strong> ${item.category || 'Divine Remedy'}</span>
              <span>&bull;</span>
              <span><strong>Scope:</strong> ${item.levelScope || 'All Seekers'}</span>
            </div>
          </div>
        </div>
        <div>
          <button type="button" class="btn btn-gold btn-sm btn-prescribe-remedy-action" data-remedy-id="${item.id}">🌿 Prescribe to Devotee</button>
        </div>
      </div>

      <div class="split-detail-section">
        <div class="split-detail-section-title"><span>🎯</span> Target Affliction &amp; Purpose</div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">${item.summary || 'Sacred remedy prescribed by Spiritual Karim to cleanse spiritual obstacles.'}</p>
      </div>

      ${item.mantra ? `
      <div class="split-detail-section">
        <div class="split-detail-section-title"><span>🕉️</span> Remedial Mantra &amp; Sankalp</div>
        <div class="split-detail-mantra-box">
          <div class="split-detail-mantra-text">${item.mantra}</div>
          <button type="button" class="btn btn-sm btn-outline btn-copy-remedy-mantra" data-mantra="${encodeURIComponent(item.mantra)}" title="Copy Mantra">📋 Copy</button>
        </div>
      </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
        <div class="split-detail-section" style="margin-bottom: 0;">
          <div class="split-detail-section-title"><span>⏱️</span> Auspicious Timing &amp; Placement</div>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0 0 0.4rem 0;"><strong>Timing:</strong> ${item.timing || 'Twilight / Dusk (Godhuli Bela)'}</p>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;"><strong>Direction:</strong> ${item.aasanDirection || 'Main Entrance / Threshold'}</p>
        </div>

        <div class="split-detail-section" style="margin-bottom: 0;">
          <div class="split-detail-section-title"><span>🌿</span> Required Samagri (Ingredients)</div>
          <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${item.ingredients || 'Earthen Lamps, Pure Mustard Oil, Sea Salt.'}</p>
        </div>
      </div>

      ${Array.isArray(item.steps) && item.steps.length > 0 ? `
      <div class="split-detail-section">
        <div class="split-detail-section-title"><span>📜</span> Step-by-Step Vidhi Procedure</div>
        <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.7;">
          ${item.steps.map(st => `<li style="margin-bottom: 0.35rem;">${st}</li>`).join('')}
        </ol>
      </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        <div class="split-detail-section" style="margin-bottom: 0;">
          <div class="split-detail-section-title" style="color: #34d399;"><span>🛡️</span> Expected Remedial Relief</div>
          <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${item.benefits || 'Clearing of negative energies and restoration of peace.'}</p>
        </div>

        <div class="split-detail-section" style="margin-bottom: 0;">
          <div class="split-detail-section-title" style="color: #f87171;"><span>⚠️</span> Precautionary Rules</div>
          <p style="font-size: 0.84rem; color: #fca5a5; line-height: 1.5; margin: 0;">${item.cautions || 'Follow exact sequence without breaking consecutive day count.'}</p>
        </div>
      </div>
    `;

    const copyBtn = detailContainer.querySelector('.btn-copy-remedy-mantra');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const m = decodeURIComponent(copyBtn.getAttribute('data-mantra'));
        if (navigator.clipboard) navigator.clipboard.writeText(m);
        if (this.showSlideToast) this.showSlideToast("Mantra Copied", "📋 Remedial Mantra copied to clipboard", "success", 2500);
      };
    }

    const prescribeBtn = detailContainer.querySelector('.btn-prescribe-remedy-action');
    if (prescribeBtn) {
      prescribeBtn.onclick = () => {
        if (this.showSlideToast) this.showSlideToast("Remedy Prescribed", `🌿 Successfully prescribed "${item.title}" to active devotee!`, "success", 3500);
      };
    }
  };

  const renderList = () => {
    if (!listContainer) return;
    const q = searchQuery.toLowerCase().trim();
    const filtered = remedies.filter(item => {
      const matchFilter = activeFilter === 'ALL' || (item.domain && item.domain.includes(activeFilter)) || (item.category && item.category.includes(activeFilter)) || (item.title && item.title.toLowerCase().includes(activeFilter.toLowerCase()));
      const matchSearch = !q || (item.title && item.title.toLowerCase().includes(q)) || (item.summary && item.summary.toLowerCase().includes(q)) || (item.category && item.category.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.8rem;">🔍 No remedies match your search.</div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(item => `
      <div class="split-catalog-card ${item.id === selectedKey ? 'active' : ''}" data-remedy-id="${item.id}">
        <div class="split-catalog-icon">${item.icon || '🌿'}</div>
        <div class="split-catalog-meta">
          <div class="split-catalog-name">${item.title}</div>
          <div class="split-catalog-desc">${item.summary || ''}</div>
          <span class="split-catalog-tag">${item.category || 'Divine Upay'}</span>
        </div>
      </div>
    `).join('');

    listContainer.querySelectorAll('.split-catalog-card').forEach(card => {
      card.onclick = () => {
        selectedKey = card.getAttribute('data-remedy-id');
        listContainer.querySelectorAll('.split-catalog-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        renderDetail(selectedKey);
      };
    });
  };

  if (searchInput) {
    searchInput.oninput = () => {
      searchQuery = searchInput.value;
      renderList();
    };
  }

  pills.forEach(pill => {
    pill.onclick = () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter');
      renderList();
    };
  });

  const closeBtn = document.getElementById('btn-close-remedy-hub');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('is-active', 'open');
      modal.setAttribute('aria-hidden', 'true');
    };
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-active', 'open');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  renderList();
  renderDetail(selectedKey);
};

