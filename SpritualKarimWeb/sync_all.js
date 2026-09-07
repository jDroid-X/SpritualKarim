const fs = require('fs');
const path = require('path');

const webRoot = 'c:\\Users\\jiten\\jAnitGravity\\SpritualKarim\\SpritulKarimWeb';
const baseDir = 'c:\\Users\\jiten\\jAnitGravity\\SpritualKarim';

// Tree Modal and Drawer Markup to inject into subportals if not present
const treeModalAndDrawerSnippet = `
  <!-- ==============================================================
       MODAL: VISUAL MLM APP HIERARCHY TREE
       ============================================================== -->
  <div id="hierarchy-tree-modal" class="admin-modal-overlay">
    <div class="admin-modal-dialog tree-modal-dialog" id="tree-modal-dialog">
      <div class="modal-header">
        <div class="modal-header-title">
          <span class="modal-icon">🌳</span>
          <div>
            <h3>App Hierarchy Genealogy Tree • Spiderweb Lineage Matrix</h3>
            <p class="modal-subtitle">Interactive map-like pan &amp; zoom canvas. Click any member icon to slide out profile details and jump to profile.</p>
          </div>
        </div>
        <button type="button" class="modal-close" id="btn-close-tree-modal" aria-label="Close Modal">&times;</button>
      </div>

      <!-- Canvas Toolbar: Zoom & Pan Controls -->
      <div class="tree-canvas-toolbar">
        <div class="tree-toolbar-left">
          <button type="button" class="tree-tool-btn" id="btn-tree-zoom-in" title="Zoom In (or use Mouse Wheel)">
            <span>➕</span> <span>Zoom In</span>
          </button>
          <button type="button" class="tree-tool-btn" id="btn-tree-zoom-out" title="Zoom Out (or use Mouse Wheel)">
            <span>➖</span> <span>Zoom Out</span>
          </button>
          <button type="button" class="tree-tool-btn" id="btn-tree-zoom-reset" title="Reset View &amp; Center">
            <span>🔄</span> <span>Reset 100%</span>
          </button>
          <span class="tree-drag-badge" title="Click and drag anywhere on the canvas to move the screen like in Maps">
            <span>✋</span> <span>Hand Drag Active (Pan Anywhere)</span>
          </span>
        </div>
        <div class="tree-toolbar-right">
          <button type="button" class="tree-tool-btn" id="btn-tree-fullscreen" title="Toggle Fullscreen View">
            <span>⛶</span> <span>Fullscreen</span>
          </button>
        </div>
      </div>

      <div class="modal-body" style="padding: 0; position: relative; overflow: hidden;">
        <div class="tree-canvas-viewport" id="tree-canvas-viewport">
          <div class="tree-interactive-surface" id="tree-interactive-surface">
            <svg class="spiderweb-svg-layer" id="spiderweb-svg-layer">
              <defs>
                <marker id="spiderweb-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" class="spiderweb-arrow-marker" />
                </marker>
              </defs>
            </svg>
            <div class="spiderweb-nodes-layer" id="spiderweb-nodes-layer">
              <!-- Injected dynamically by ProfileView.renderHierarchyTree -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================================
       RIGHT SLIDE-OUT DRAWER: TREE PROFILE METADATA DETAILS
       ============================================================== -->
  <div id="tree-profile-drawer" class="tree-profile-drawer" aria-hidden="true">
    <div class="tree-drawer-header">
      <div class="tree-drawer-title-wrap">
        <span style="font-size: 1.4rem;">👤</span>
        <div>
          <h4 style="margin: 0; color: var(--text-primary); font-size: 1.05rem;" id="tree-drawer-profile-name">Profile Details</h4>
          <span style="font-size: 0.75rem; color: var(--text-gold);" id="tree-drawer-profile-role">Devotee Tier</span>
        </div>
      </div>
      <button type="button" class="icon-btn" id="btn-close-tree-drawer">&times;</button>
    </div>
    <div class="tree-drawer-body" id="tree-drawer-body">
      <!-- Injected dynamically by ProfileView.renderTreeProfileDrawer -->
    </div>
    <div class="tree-drawer-footer">
      <button type="button" class="btn-tree-load-profile" id="btn-tree-load-profile">
        <span>🚀</span> Go to Actual Profile Page
      </button>
    </div>
  </div>
  <div id="tree-drawer-backdrop" class="drawer-backdrop"></div>
`;

// In-body Tab 5 nav button
const tab5BtnSnippet = `          <button type="button" class="main-tab-btn" data-main-tab="tab-genealogy-tree" id="main-tab-tree-btn">
            <span class="tab-icon">🌳</span>
            <div class="tab-label-wrap">
              <span class="tab-main-title">5. Genealogy Tree</span>
              <span class="tab-sub-title">Visual MLM &bull; Spiderweb Canvas</span>
            </div>
          </button>`;

// In-body Tab 5 panel snippet
const tab5PanelSnippet = `
          <!-- ############################################################
               TAB 5: GENEALOGY TREE & SPIDERWEB CANVAS (DIRECT IN BODY)
               ############################################################ -->
          <div class="main-tab-content-panel" id="tab-genealogy-tree">
            <div class="card body-tree-card">
              <div class="card-title-bar body-tree-title-bar">
                <div class="card-title">
                  <span class="card-title-icon">🌳</span> 
                  <span>App Hierarchy Lineage &bull; Spiderweb Genealogy Canvas</span>
                </div>
                <div class="card-actions body-tree-quick-stats">
                  <span class="stat-badge" id="body-tree-total-members">👥 Total Members: 0</span>
                  <span class="stat-badge stat-gold" id="body-tree-active-tier">Tier Focus: All</span>
                </div>
              </div>

              <!-- Full In-Body Canvas Toolbar -->
              <div class="body-tree-toolbar">
                <div class="body-tree-toolbar-left">
                  <button type="button" class="btn btn-sm btn-gold btn-smart-fit" id="btn-body-smart-fit" title="Auto Fit & Center Tree (Best Smart Fit to Viewport)">
                    <span>🎯</span> <span>Smart Fit</span>
                  </button>
                  <button type="button" class="tree-tool-btn" id="btn-body-zoom-in" title="Zoom In (or Scroll Wheel)">
                    <span>➕</span> <span>Zoom In</span>
                  </button>
                  <button type="button" class="tree-tool-btn" id="btn-body-zoom-out" title="Zoom Out (or Scroll Wheel)">
                    <span>➖</span> <span>Zoom Out</span>
                  </button>
                  <button type="button" class="tree-tool-btn" id="btn-body-zoom-reset" title="Reset View (100%)">
                    <span>🔄</span> <span>100%</span>
                  </button>
                  
                  <span class="tree-drag-badge" title="Click and drag anywhere on canvas to pan like Google Maps">
                    <span>✋</span> <span>Hand Pan Active</span>
                  </span>
                </div>

                <div class="body-tree-toolbar-right">
                  <div class="tree-search-wrap">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="body-tree-search-input" class="form-control form-control-sm tree-search-input" placeholder="Find member by name...">
                    <button type="button" id="btn-clear-tree-search" class="clear-search-btn" title="Clear Search">✕</button>
                  </div>

                  <select id="body-tree-tier-filter" class="form-control form-control-sm tree-filter-select" title="Filter by Tier Level">
                    <option value="ALL">🌐 All 4 Tiers</option>
                    <option value="1">👑 Tier 1 &bull; Admin Master</option>
                    <option value="2">🌿 Tier 2 &bull; Healer Connect</option>
                    <option value="3">📿 Tier 3 &bull; Trainee Sadhak</option>
                    <option value="4">🌱 Tier 4 &bull; Devotee / Seeker</option>
                  </select>

                  <div class="segmented-toggle-group" title="Switch Tree Layout Presentation">
                    <button type="button" class="segmented-btn active" data-layout="cluster" id="btn-layout-cluster" title="Clustered MLM Branches (Hierarchical Sub-trees)">🌳 Clustered</button>
                    <button type="button" class="segmented-btn" data-layout="spiderweb" id="btn-layout-spiderweb" title="Spiderweb Lineage Matrix">🕸️ Spiderweb</button>
                  </div>

                  <button type="button" class="tree-tool-btn" id="btn-body-fullscreen" title="Expand Tree Canvas to Fullscreen">
                    <span>⛶</span> <span>Fullscreen</span>
                  </button>
                </div>
              </div>

              <!-- Interactive In-Body Canvas Viewport -->
              <div class="body-tree-canvas-viewport" id="body-tree-canvas-viewport">
                <div class="body-tree-surface" id="body-tree-surface">
                  <svg class="body-spiderweb-svg-layer" id="body-spiderweb-svg-layer">
                    <defs>
                      <marker id="body-spiderweb-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 10 5 L 0 8.5 z" class="body-spiderweb-arrow-marker" />
                      </marker>
                      <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f5d365" flood-opacity="0.6"/>
                      </filter>
                    </defs>
                  </svg>
                  <div class="body-spiderweb-nodes-layer" id="body-spiderweb-nodes-layer">
                    <!-- Injected dynamically by ProfileView.renderInBodyHierarchyTree -->
                  </div>
                </div>
              </div>

              <!-- Canvas Bottom Helper & Legend Bar -->
              <div class="body-tree-footer-bar">
                <div class="tree-legend-mini">
                  <span class="legend-chip chip-tier-1"><span class="chip-dot dot-tier-1"></span> Tier 1 Master</span>
                  <span class="legend-chip chip-tier-2"><span class="chip-dot dot-tier-2"></span> Tier 2 Healer</span>
                  <span class="legend-chip chip-tier-3"><span class="chip-dot dot-tier-3"></span> Tier 3 Trainee</span>
                  <span class="legend-chip chip-tier-4"><span class="chip-dot dot-tier-4"></span> Tier 4 Devotee / Seeker</span>
                </div>
                <div class="tree-footer-hint">
                  💡 <strong>Pro Tip:</strong> Click any person icon to slide out their profile metadata drawer from the right.
                </div>
              </div>
            </div>
          </div>
`;

// Toast and Node Dialog Snippet
const toastAndNodeDialogSnippet = `
  <!-- BOTTOM-RIGHT SLIDE-IN TOAST NOTIFICATION STACK -->
  <div id="toast-notifications-container" class="toast-notifications-container" aria-live="polite"></div>

  <!-- DIALOG: NODE QUICK ACTION & LINEAGE OPTIONS -->
  <div id="node-action-dialog" class="admin-modal" aria-hidden="true">
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.3rem;">⚡</span>
          <h3 class="modal-title" id="node-dialog-title">Member Quick Actions</h3>
        </div>
        <button id="btn-close-node-dialog" class="icon-btn">✕</button>
      </div>
      <div class="modal-body" id="node-dialog-body"></div>
      <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button id="btn-close-node-dialog-footer" class="btn btn-outline">Close</button>
      </div>
    </div>
  </div>
`;

// 1. Process subportal HTML files
['Masters', 'Healers', 'Devotee'].forEach(portal => {
  const filePath = path.join(webRoot, portal, 'index.html');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Update legend button and data-tier attributes
    if (!content.includes('id="btn-open-tree-view"')) {
      content = content.replace(
        /<div class="sidebar-heading">App Hierarchy Tiers<\/div>/g,
        `<div class="sidebar-heading" style="display: flex; justify-content: space-between; align-items: center;">\n          <span>App Hierarchy Tiers</span>\n          <button type="button" id="btn-open-tree-view" class="btn btn-xs btn-gold" style="font-size: 0.7rem; padding: 0.15rem 0.45rem;" title="Open Visual MLM Hierarchy Tree">🌳 Tree</button>\n        </div>`
      );
    }

    if (!content.includes('id="hierarchy-legend-container"')) {
      content = content.replace(/<div class="hierarchy-legend">/g, '<div class="hierarchy-legend" id="hierarchy-legend-container">');
    }

    // Add Tab 5 nav button if missing
    if (!content.includes('data-main-tab="tab-genealogy-tree"')) {
      content = content.replace(
        /(<button[^>]*data-main-tab="tab-healer-connect"[\s\S]*?<\/button>)/,
        `$1\n\n${tab5BtnSnippet}`
      );
    }

    // Add Tab 5 panel if missing
    if (!content.includes('id="tab-genealogy-tree"')) {
      content = content.replace(
        /(<\/div>\s*<!-- Sticky Form Footer Actions -->)/,
        `${tab5PanelSnippet}\n$1`
      );
    }

    // Add toast notifications and node dialog if missing
    if (!content.includes('id="toast-notifications-container"')) {
      content = content.replace(/<\/body>/i, `${toastAndNodeDialogSnippet}\n</body>`);
    }

    // Add data-tier to legend items
    content = content.replace(/<div class="legend-item"(?!.*data-tier)([^>]*)>\s*<span class="legend-title">Admin Master<\/span>/g, '<div class="legend-item" data-tier="1"$1>\n            <span class="legend-title">Admin Master</span>');
    content = content.replace(/<div class="legend-item"(?!.*data-tier)([^>]*)>\s*<span class="legend-title">Healer Connect<\/span>/g, '<div class="legend-item" data-tier="2"$1>\n            <span class="legend-title">Healer Connect</span>');
    content = content.replace(/<div class="legend-item"(?!.*data-tier)([^>]*)>\s*<span class="legend-title">Trainee Sadhak<\/span>/g, '<div class="legend-item" data-tier="3"$1>\n            <span class="legend-title">Trainee Sadhak</span>');
    content = content.replace(/<div class="legend-item"(?!.*data-tier)([^>]*)>\s*<span class="legend-title">Devotee \/ Seeker<\/span>/g, '<div class="legend-item" data-tier="4"$1>\n            <span class="legend-title">Devotee / Seeker</span>');

    // Hide ref code box on card
    content = content.replace(/<div class="ref-code-box">/g, '<div class="ref-code-box" style="display: none;">');

    // Inject tree modal and drawer if not present
    if (!content.includes('id="hierarchy-tree-modal"')) {
      content = content.replace(/<\/body>/i, `${treeModalAndDrawerSnippet}\n</body>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated portal: ${portal}/index.html`);
  }
});

// Helper for recursive copy
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Mirror SpritulKarimWeb to SpritualKarimWeb and nested aliases
const targets = [
  path.join(baseDir, 'SpritualKarimWeb'),
  path.join(baseDir, 'SpritualKarim', 'SpritulKarimWeb'),
  path.join(baseDir, 'SpritualKarim', 'SpritualKarimWeb')
];

targets.forEach(target => {
  console.log(`Mirroring ${webRoot} -> ${target}...`);
  copyDirSync(webRoot, target);
});

console.log('✓ All subportals and aliases synchronized successfully!');
