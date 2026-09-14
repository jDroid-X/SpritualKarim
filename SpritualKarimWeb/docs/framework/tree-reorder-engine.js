/**
 * INTERACTIVE TREE HIERARCHY RE-ORDER ENGINE
 * Shree Spritual Karim Sansthan Architecture Suite
 * 
 * Supports:
 * - Hamburger icon (☰) click and drag
 * - Vertical drag / click (Up/Down) to reorder tree lines
 * - Horizontal drag / click (Left/Right) to adjust indentation / levels (0 to 4)
 * - Dynamic connector calculation (├──, └──)
 * - Pure Light Theme compliance
 */

(function(window) {
  'use strict';

  // Master initial hierarchical data matching latest website developments
  const DEFAULT_TREE_DATA = [
    {
      id: 'node-0',
      level: 0,
      icon: '☸️',
      label: 'Level 0: Platform Root (Firebase RTDB, AppConfig, Global State)',
      subtext: 'Encapsulates runtime config, telemetries, and 11 collections',
      tag: 'SYSTEM ROOT',
      scope: 'ALL'
    },
    {
      id: 'node-1-1',
      level: 1,
      icon: '👑',
      label: 'Level 1: Master Founder Scope (Tier 1 Global Authority)',
      subtext: 'Karim Ji persona, unrestricted downline & table explorer',
      tag: 'MASTER TIER',
      scope: 'MASTER'
    },
    {
      id: 'node-2-1',
      level: 2,
      icon: '🗄️',
      label: 'Level 2: Screen & Tab Containers (#tab-firebase-explorer, #tab-admin-matrix)',
      subtext: '11 Live Relational Schema tables, RBAC permissions',
      tag: 'SCREEN',
      scope: 'MASTER'
    },
    {
      id: 'node-3-1',
      level: 3,
      icon: '📊',
      label: 'Level 3: Card & Section Components (1-Row Tier Ribbon, Telemetry Stream)',
      subtext: 'Stretched 1-Row Tier Ribbon (Healers, Trainees, Devotees stats)',
      tag: 'COMPONENT',
      scope: 'MASTER'
    },
    {
      id: 'node-4-1',
      level: 4,
      icon: '⚡',
      label: 'Level 4: Atomic Data Fields & Actions (Raw Node Edit, Purge, Export)',
      subtext: 'JSON patch emitter, schema validator, emergency lock',
      tag: 'ATOMIC ACTION',
      scope: 'MASTER'
    },
    {
      id: 'node-1-2',
      level: 1,
      icon: '🌿',
      label: 'Level 1: Healer Mentor Scope (Tier 2 Certified Practitioner)',
      subtext: 'Guides trainees, audits house cleanliness, verifies pairings',
      tag: 'HEALER TIER',
      scope: 'HEALER'
    },
    {
      id: 'node-2-2',
      level: 2,
      icon: '📋',
      label: 'Level 2: Screen & Tab Containers (#tab-crucible-eval, #tab-house-audit)',
      subtext: 'Devotee induction queue, house sanctum checklist',
      tag: 'SCREEN',
      scope: 'HEALER'
    },
    {
      id: 'node-3-2',
      level: 3,
      icon: '🎴',
      label: 'Level 3: Card & Section Components (Dual Profile Cards: Main + Selected Member)',
      subtext: 'Box 1: Active Devotee | Box 2: Selected Mentee / Mentor Card',
      tag: 'COMPONENT',
      scope: 'HEALER'
    },
    {
      id: 'node-4-2',
      level: 4,
      icon: '⚖️',
      label: 'Level 4: Atomic Actions (Approve, Reject, Hold, Request Info, Reassign)',
      subtext: 'Multi-option Mentor Decision Modal with audit hash logging',
      tag: 'ATOMIC ACTION',
      scope: 'HEALER'
    },
    {
      id: 'node-1-3',
      level: 1,
      icon: '🧘',
      label: 'Level 1: Trainee Sadhak Scope (Tier 3 Ascendant Learner)',
      subtext: 'Downline lineage view, Goli Gyan audio guide, japa counters',
      tag: 'TRAINEE TIER',
      scope: 'TRAINEE'
    },
    {
      id: 'node-2-3',
      level: 2,
      icon: '📱',
      label: 'Level 2: Screen & Tab Containers (#tab-sadhana-catalog, #tab-lineage-graph)',
      subtext: 'Interactive MLM Genealogy tree, 11 malas daily goal',
      tag: 'SCREEN',
      scope: 'TRAINEE'
    },
    {
      id: 'node-3-3',
      level: 3,
      icon: '🧬',
      label: 'Level 3: Card & Section Components (3-Gen Lineage Ancestral Canvas)',
      subtext: 'Father, Grandfather, Great-grandfather Pitru Karma clans',
      tag: 'COMPONENT',
      scope: 'TRAINEE'
    },
    {
      id: 'node-4-3',
      level: 4,
      icon: '📿',
      label: 'Level 4: Atomic Data Fields & Actions (Japa Counter, Diya Flame Checkin)',
      subtext: 'Increment mala count, trigger daily diya log, audio play/pause',
      tag: 'ATOMIC ACTION',
      scope: 'TRAINEE'
    },
    {
      id: 'node-1-4',
      level: 1,
      icon: '🔱',
      label: 'Level 1: Devotee Seeker Scope (Tier 4 Terminal Sanctum)',
      subtext: '5-Pillar Join Portal inductee, reference key SKDV-XXXX-XXXX-XXXX',
      tag: 'DEVOTEE TIER',
      scope: 'DEVOTEE'
    },
    {
      id: 'node-2-4',
      level: 2,
      icon: '🚪',
      label: 'Level 2: Screen & Tab Containers (#tab-devotee-personal, #tab-seeker-purpose)',
      subtext: '5-Pillar Onboarding Wizard, 3D Flipper ID Card',
      tag: 'SCREEN',
      scope: 'DEVOTEE'
    },
    {
      id: 'node-3-4',
      level: 3,
      icon: '🧹',
      label: 'Level 3: Card & Section Components (House Clean 3-Tier Living Sanctum)',
      subtext: 'Level 1 Basic, Level 2 Deep, Level 3 Sacred Altar Purifications',
      tag: 'COMPONENT',
      scope: 'DEVOTEE'
    },
    {
      id: 'node-4-4',
      level: 4,
      icon: '🔑',
      label: 'Level 4: Atomic Data Fields (Legal Name, Phone, Aadhaar e-KYC, PIN, QR)',
      subtext: '16-digit Reference Code, Sponsor Pairing PIN, Flip Card Toggle',
      tag: 'ATOMIC FIELD',
      scope: 'DEVOTEE'
    }
  ];

  class TreeReorderEngine {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.warn(`[TreeReorderEngine] Container #${containerId} not found.`);
        return;
      }
      this.options = Object.assign({
        title: 'Group By Higher-to-Lower Level Hierarchy: Interactive Tree Re-Arranger',
        subtitle: 'Click ☰ or drag tree lines (Up/Down to re-order, Left/Right to Indent/Outdent Level). Live calculates hierarchy cascade.',
        allowDrag: true,
        allowIndent: true,
        maxLevel: 4,
        minLevel: 0
      }, options);

      // Deep copy initial data
      this.items = JSON.parse(JSON.stringify(DEFAULT_TREE_DATA));
      this.draggedIndex = null;
      this.dragStartX = 0;
      this.init();
    }

    init() {
      this.render();
    }

    render() {
      this.container.innerHTML = `
        <div class="tree-reorder-widget">
          <div class="trw-header">
            <div class="trw-title-wrap">
              <span class="trw-badge">Dynamic Re-Order</span>
              <div>
                <div class="trw-title">${this.options.title}</div>
                <div class="trw-subtitle">${this.options.subtitle}</div>
              </div>
            </div>
            <div class="trw-toolbar">
              <button class="trw-btn trw-btn-primary" id="${this.container.id}-btn-copy" title="Copy text representation">
                <span>📋</span> Copy Hierarchy
              </button>
              <button class="trw-btn" id="${this.container.id}-btn-outdent-all" title="Promote all lines Left by 1 level">
                <span>⬅️</span> Outdent All
              </button>
              <button class="trw-btn" id="${this.container.id}-btn-indent-all" title="Demote all lines Right by 1 level">
                <span>➡️</span> Indent All
              </button>
              <button class="trw-btn trw-btn-success" id="${this.container.id}-btn-reset" title="Reset to default architecture">
                <span>🔄</span> Reset Default
              </button>
            </div>
          </div>

          <div class="trw-tip-bar">
            <span>💡</span>
            <span>
              <strong>Interaction Guide:</strong> Click or drag the <strong>☰ hamburger handle</strong>.
              Use <strong>⬆️ Up / ⬇️ Down</strong> to reorder rows, and <strong>⬅️ Left / ➡️ Right</strong> to change the hierarchy level from Level 0 down to Level 4.
            </span>
          </div>

          <div class="trw-tree-canvas" id="${this.container.id}-canvas"></div>
        </div>
        <div class="trw-toast" id="${this.container.id}-toast"></div>
      `;

      this.bindToolbar();
      this.renderRows();
    }

    bindToolbar() {
      const btnCopy = document.getElementById(`${this.container.id}-btn-copy`);
      if (btnCopy) {
        btnCopy.addEventListener('click', () => this.copyToClipboard());
      }
      const btnReset = document.getElementById(`${this.container.id}-btn-reset`);
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.items = JSON.parse(JSON.stringify(DEFAULT_TREE_DATA));
          this.renderRows();
          this.showToast('Hierarchy reset to default enterprise structure.');
        });
      }
      const btnOutdentAll = document.getElementById(`${this.container.id}-btn-outdent-all`);
      if (btnOutdentAll) {
        btnOutdentAll.addEventListener('click', () => {
          this.items.forEach(item => {
            if (item.level > this.options.minLevel) item.level--;
          });
          this.renderRows();
          this.showToast('Outdented all lines to higher level.');
        });
      }
      const btnIndentAll = document.getElementById(`${this.container.id}-btn-indent-all`);
      if (btnIndentAll) {
        btnIndentAll.addEventListener('click', () => {
          this.items.forEach(item => {
            if (item.level < this.options.maxLevel) item.level++;
          });
          this.renderRows();
          this.showToast('Indented all lines to lower level.');
        });
      }
    }

    renderRows() {
      const canvas = document.getElementById(`${this.container.id}-canvas`);
      if (!canvas) return;

      canvas.innerHTML = '';

      this.items.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'trw-row';
        row.id = `${this.container.id}-row-${index}`;
        row.draggable = true;
        row.dataset.index = index;

        // Calculate dynamic ASCII connector
        const indentGuide = this.calculateConnector(index);

        row.innerHTML = `
          <!-- HAMBURGER DRAG HANDLE -->
          <div class="trw-handle" title="Drag Up/Down to re-order, Left/Right to change level" data-index="${index}">
            ☰
          </div>

          <!-- DIRECTIONAL CLICK CONTROLS -->
          <div class="trw-directional-controls">
            <button class="trw-dir-btn" data-action="up" data-index="${index}" title="Move Up (⬆️)" ${index === 0 ? 'disabled' : ''}>▲</button>
            <button class="trw-dir-btn" data-action="down" data-index="${index}" title="Move Down (⬇️)" ${index === this.items.length - 1 ? 'disabled' : ''}>▼</button>
            <button class="trw-dir-btn" data-action="left" data-index="${index}" title="Outdent / Move Left (Level - 1)" ${item.level <= this.options.minLevel ? 'disabled' : ''}>◀</button>
            <button class="trw-dir-btn" data-action="right" data-index="${index}" title="Indent / Move Right (Level + 1)" ${item.level >= this.options.maxLevel ? 'disabled' : ''}>▶</button>
          </div>

          <!-- INDENT CONNECTOR -->
          <span class="trw-indent-guide">${indentGuide}</span>

          <!-- LEVEL BADGE -->
          <span class="trw-level-tag trw-lvl-${item.level}">L${item.level}</span>

          <!-- NODE CONTENT -->
          <div class="trw-content">
            <span class="trw-node-icon">${item.icon}</span>
            <span class="trw-node-label">${item.label}</span>
            <span class="trw-node-sub">${item.subtext}</span>
            <span class="trw-node-pill">${item.tag}</span>
          </div>
        `;

        this.attachRowEvents(row, index);
        canvas.appendChild(row);
      });
    }

    calculateConnector(index) {
      const current = this.items[index];
      const lvl = current.level;
      if (lvl === 0) return '● ';

      let prefix = '';
      for (let i = 0; i < lvl - 1; i++) {
        prefix += '    ';
      }

      // Lookahead to check if this is the last sibling at this level
      let isLast = true;
      for (let k = index + 1; k < this.items.length; k++) {
        if (this.items[k].level === lvl) {
          isLast = false;
          break;
        }
        if (this.items[k].level < lvl) {
          break;
        }
      }

      return prefix + (isLast ? '└── ' : '├── ');
    }

    attachRowEvents(row, index) {
      // Drag events
      row.addEventListener('dragstart', (e) => {
        this.draggedIndex = index;
        this.dragStartX = e.clientX;
        row.classList.add('trw-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
      });

      row.addEventListener('dragend', (e) => {
        row.classList.remove('trw-dragging');
        document.querySelectorAll('.trw-row').forEach(r => {
          r.classList.remove('trw-drag-over-top', 'trw-drag-over-bottom');
        });

        // Check horizontal drag delta for indent/outdent
        const deltaX = e.clientX - this.dragStartX;
        if (Math.abs(deltaX) > 40 && this.draggedIndex !== null) {
          const item = this.items[this.draggedIndex];
          if (deltaX > 40 && item.level < this.options.maxLevel) {
            item.level++;
            this.showToast(`Indented "${item.label.substring(0, 24)}..." to Level ${item.level}`);
          } else if (deltaX < -40 && item.level > this.options.minLevel) {
            item.level--;
            this.showToast(`Outdented "${item.label.substring(0, 24)}..." to Level ${item.level}`);
          }
          this.renderRows();
        }

        this.draggedIndex = null;
      });

      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const rect = row.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          row.classList.add('trw-drag-over-top');
          row.classList.remove('trw-drag-over-bottom');
        } else {
          row.classList.add('trw-drag-over-bottom');
          row.classList.remove('trw-drag-over-top');
        }
      });

      row.addEventListener('dragleave', () => {
        row.classList.remove('trw-drag-over-top', 'trw-drag-over-bottom');
      });

      row.addEventListener('drop', (e) => {
        e.preventDefault();
        row.classList.remove('trw-drag-over-top', 'trw-drag-over-bottom');
        const fromIndex = this.draggedIndex;
        const toIndex = index;

        if (fromIndex === null || fromIndex === toIndex) return;

        const movedItem = this.items.splice(fromIndex, 1)[0];
        this.items.splice(toIndex, 0, movedItem);
        this.renderRows();
        this.showToast(`Moved "${movedItem.label.substring(0, 24)}..." to position ${toIndex + 1}`);
      });

      // Directional button clicks
      row.querySelectorAll('.trw-dir-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          const idx = parseInt(btn.dataset.index, 10);
          this.handleDirectionalAction(action, idx);
        });
      });
    }

    handleDirectionalAction(action, index) {
      if (action === 'up' && index > 0) {
        const item = this.items.splice(index, 1)[0];
        this.items.splice(index - 1, 0, item);
        this.renderRows();
        this.showToast(`Moved up: ${item.label.substring(0, 28)}...`);
      } else if (action === 'down' && index < this.items.length - 1) {
        const item = this.items.splice(index, 1)[0];
        this.items.splice(index + 1, 0, item);
        this.renderRows();
        this.showToast(`Moved down: ${item.label.substring(0, 28)}...`);
      } else if (action === 'left') {
        const item = this.items[index];
        if (item.level > this.options.minLevel) {
          item.level--;
          this.renderRows();
          this.showToast(`Outdented (Level ${item.level}): ${item.label.substring(0, 28)}...`);
        }
      } else if (action === 'right') {
        const item = this.items[index];
        if (item.level < this.options.maxLevel) {
          item.level++;
          this.renderRows();
          this.showToast(`Indented (Level ${item.level}): ${item.label.substring(0, 28)}...`);
        }
      }
    }

    copyToClipboard() {
      let text = '=== SHREE SPRITUAL KARIM SANSTHAN HIERARCHY ===\n\n';
      this.items.forEach((item, idx) => {
        const connector = this.calculateConnector(idx);
        text += `${connector} [L${item.level}] ${item.label} (${item.tag})\n`;
      });

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('Hierarchy tree copied to clipboard!');
        }).catch(() => {
          this.fallbackCopy(text);
        });
      } else {
        this.fallbackCopy(text);
      }
    }

    fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('Hierarchy tree copied to clipboard!');
    }

    showToast(message) {
      const toast = document.getElementById(`${this.container.id}-toast`);
      if (!toast) return;
      toast.innerHTML = `<span>✅</span> <span>${message}</span>`;
      toast.classList.add('show');
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  }

  // Global helper to initialize
  window.initTreeReorderEngine = function(containerId, options) {
    return new TreeReorderEngine(containerId, options);
  };

})(window);
