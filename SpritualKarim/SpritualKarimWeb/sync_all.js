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
    <div class="admin-modal-dialog tree-modal-dialog">
      <div class="modal-header">
        <div class="modal-header-title">
          <span class="modal-icon">🌳</span>
          <div>
            <h3>App Hierarchy Genealogy Tree • Multi-Tier Downlines</h3>
            <p class="modal-subtitle">Visual MLM-style lineage matrix. Click any member node to slide out detailed metadata and jump directly to their profile.</p>
          </div>
        </div>
        <button type="button" class="modal-close" id="btn-close-tree-modal" aria-label="Close Modal">&times;</button>
      </div>
      <div class="modal-body" style="padding: 1rem;">
        <div class="tree-canvas-viewport" id="tree-canvas-viewport">
          <!-- Injected dynamically by ProfileView.renderHierarchyTree -->
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
