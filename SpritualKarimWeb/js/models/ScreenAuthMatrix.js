/**
 * ScreenAuthMatrix.js
 * Comprehensive Screen Authorization Matrix — defines every hideable UI element
 * across all 6 tabs + global areas, organized by category with role/portal gating.
 * 
 * Architecture:
 *   - Each item has: id, label, type, selector, category, level (indent), parent
 *   - type: SCREEN | SUBTAB | CARD | PANEL | BUTTON | SECTION | DRAWER | MODAL
 *   - category: tabs | header | sidebar | footer | drawers
 *   - level: 0=top, 1=child, 2=grandchild (for visual indentation)
 *   - parent: id of parent item (for hierarchical grouping)
 *   - selector: CSS selector to target the element in DOM
 *   - roles: { MASTER, HEALER, TRAINEE, DEVOTEE } — default visibility per role
 *   - portals: { masters, healers, trainee, devotee } — default visibility per portal
 */
class ScreenAuthMatrix {

  /**
   * Returns the canonical list of all screen elements that can be hidden/shown.
   * This is the single source of truth for the authorization matrix.
   */
  static getMatrixDefinition() {
    return [
      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: TAB 1 — DEVOTEE PERSONAL
      // ═══════════════════════════════════════════════════════════════
      { id: 'tab_devotee_personal', label: 'Tab 1: Devotee Personal', type: 'SCREEN', selector: '#tab-devotee-personal', category: 'Tab 1: Devotee Personal', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },

      { id: 'devotee_sub_identity', label: 'Personal Identity Panel', type: 'SUBTAB', selector: '#devotee-sub-identity', category: 'Tab 1: Devotee Personal', level: 1, parent: 'tab_devotee_personal', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'devotee_card_identity_config', label: 'Role & Reference Code Config', type: 'CARD', selector: '#devotee-sub-identity .card:first-child', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_identity', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'devotee_card_contact_data', label: 'Personal Contact & Residential Data', type: 'CARD', selector: '#devotee-sub-identity .card:nth-child(2)', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_identity', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_edit_identity', label: 'Edit Identity Button', type: 'BUTTON', selector: '#btn-edit-identity', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_identity', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'btn_reset_identity', label: 'Reset Identity Button', type: 'BUTTON', selector: '#btn-reset-identity', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_identity', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },

      { id: 'devotee_sub_lineage', label: '3-Gen Ancestral Lineage Panel', type: 'SUBTAB', selector: '#devotee-sub-lineage', category: 'Tab 1: Devotee Personal', level: 1, parent: 'tab_devotee_personal', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'devotee_card_lineage_tree', label: 'Ancestral Lineage Hierarchy Card', type: 'CARD', selector: '#devotee-sub-lineage .card', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_lineage', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_add_lineage_node', label: 'Add Custom Lineage Node', type: 'BUTTON', selector: '#btn-add-lineage-node', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_lineage', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'btn_reset_lineage', label: 'Reset Lineage Button', type: 'BUTTON', selector: '#btn-reset-lineage', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_lineage', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },

      { id: 'devotee_sub_houseclean', label: 'House Clean Panel', type: 'SUBTAB', selector: '#devotee-sub-houseclean', category: 'Tab 1: Devotee Personal', level: 1, parent: 'tab_devotee_personal', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'devotee_card_houseclean', label: 'House Clean Purification Card', type: 'CARD', selector: '#devotee-sub-houseclean .card', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_houseclean', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_add_houseclean_record', label: 'Add Level Record', type: 'BUTTON', selector: '#btn-add-houseclean-record', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_houseclean', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'btn_reset_houseclean', label: 'Reset All Levels', type: 'BUTTON', selector: '#btn-reset-houseclean', category: 'Tab 1: Devotee Personal', level: 2, parent: 'devotee_sub_houseclean', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: TAB 2 — SEEKER PURPOSE
      // ═══════════════════════════════════════════════════════════════
      { id: 'tab_seeker_purpose', label: 'Tab 2: Seeker Purpose', type: 'SCREEN', selector: '#tab-seeker-purpose', category: 'Tab 2: Seeker Purpose', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },

      { id: 'seeker_sub_purpose', label: 'Spiritual Purpose & Goals Panel', type: 'SUBTAB', selector: '#seeker-sub-purpose', category: 'Tab 2: Seeker Purpose', level: 1, parent: 'tab_seeker_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'seeker_card_purpose_diagnostics', label: 'Purpose & Diagnostics Card', type: 'CARD', selector: '#seeker-sub-purpose .card:first-child', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'seeker_card_remedies_catalog', label: 'Prescribed Remedies Catalog Card', type: 'CARD', selector: '#seeker-sub-purpose .card:nth-child(2)', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'seeker_remedy_filter_toolbar', label: 'Remedy Search & Filter Toolbar', type: 'SECTION', selector: '.remedy-filter-toolbar', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'seeker_remedy_category_1', label: 'Divine Remedies & Fire Havans', type: 'SECTION', selector: '#seeker-sub-purpose .remedy-category-group:first-child', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'seeker_remedy_category_2', label: 'Energy Cleansing & Karmic Healing', type: 'SECTION', selector: '#seeker-sub-purpose .remedy-category-group:nth-child(2)', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_add_purpose_goal', label: 'Add Purpose Goal', type: 'BUTTON', selector: '#btn-add-purpose-goal', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'btn_add_custom_remedy_purpose', label: 'Add Custom Remedy', type: 'BUTTON', selector: '#btn-add-custom-remedy-purpose', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },

      { id: 'seeker_sub_houseclean', label: 'House Clean Status Panel', type: 'SUBTAB', selector: '#seeker-sub-houseclean', category: 'Tab 2: Seeker Purpose', level: 1, parent: 'tab_seeker_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'seeker_card_houseclean_logs', label: 'House Clean Verification Logs Card', type: 'CARD', selector: '#seeker-sub-houseclean .card', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_houseclean', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_add_seeker_clean_log', label: 'Add Clean Log', type: 'BUTTON', selector: '#btn-add-seeker-clean-log', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_houseclean', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },

      { id: 'seeker_sub_sadhanas', label: 'Sadhanas Interested Panel', type: 'SUBTAB', selector: '#seeker-sub-sadhanas', category: 'Tab 2: Seeker Purpose', level: 1, parent: 'tab_seeker_purpose', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'seeker_card_sadhanas_catalog', label: 'Interested Sadhanas Catalog Card', type: 'CARD', selector: '#seeker-sub-sadhanas .card', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_sadhanas', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'seeker_sadhana_listbox', label: 'Sacred Sadhana Listbox', type: 'SECTION', selector: '#sadhana-listbox-wrap', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_sadhanas', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_add_custom_sadhana', label: 'Add Custom Sadhana', type: 'BUTTON', selector: '#btn-add-custom-sadhana', category: 'Tab 2: Seeker Purpose', level: 2, parent: 'seeker_sub_sadhanas', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: TAB 3 — TRAINEE SADHAK
      // ═══════════════════════════════════════════════════════════════
      { id: 'tab_trainee_sadhak', label: 'Tab 3: Trainee Sadhak', type: 'SCREEN', selector: '#tab-trainee-sadhak', category: 'Tab 3: Trainee Sadhak', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'trainee_card_dashboard', label: 'In-Progress Dashboard Card', type: 'CARD', selector: '#tab-trainee-sadhak .card', category: 'Tab 3: Trainee Sadhak', level: 1, parent: 'tab_trainee_sadhak', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'trainee_split_workspace', label: 'Master-Detail Split Workspace', type: 'PANEL', selector: '.trainee-split-workspace', category: 'Tab 3: Trainee Sadhak', level: 1, parent: 'tab_trainee_sadhak', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'trainee_left_panel', label: 'Left Panel — Categorized Tiles', type: 'PANEL', selector: '.trainee-left-panel', category: 'Tab 3: Trainee Sadhak', level: 2, parent: 'trainee_split_workspace', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'trainee_right_panel', label: 'Right Panel — Progress Graphics', type: 'PANEL', selector: '.trainee-right-panel', category: 'Tab 3: Trainee Sadhak', level: 2, parent: 'trainee_split_workspace', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'trainee_sadhanas_group', label: 'Sacred Sadhanas In-Progress', type: 'SECTION', selector: '#trainee-sadhanas-group-sadhanas', category: 'Tab 3: Trainee Sadhak', level: 2, parent: 'trainee_left_panel', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'trainee_remedies_group', label: 'Divine Remedies In-Progress', type: 'SECTION', selector: '#trainee-sadhanas-group-remedies', category: 'Tab 3: Trainee Sadhak', level: 2, parent: 'trainee_left_panel', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'trainee_cleansing_group', label: 'Energy Cleansing In-Progress', type: 'SECTION', selector: '#trainee-sadhanas-group-cleansing', category: 'Tab 3: Trainee Sadhak', level: 2, parent: 'trainee_left_panel', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_add_trainee_sadhana', label: 'Add In-Progress Sadhana', type: 'BUTTON', selector: '#btn-add-trainee-sadhana', category: 'Tab 3: Trainee Sadhak', level: 1, parent: 'tab_trainee_sadhak', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'btn_open_goli_gyan', label: 'Goli Gyan Guide Button', type: 'BUTTON', selector: '#btn-open-goli-gyan', category: 'Tab 3: Trainee Sadhak', level: 1, parent: 'tab_trainee_sadhak', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: TAB 4 — HEALER CONNECT
      // ═══════════════════════════════════════════════════════════════
      { id: 'tab_healer_connect', label: 'Tab 4: Healer Connect', type: 'SCREEN', selector: '#tab-healer-connect', category: 'Tab 4: Healer Connect', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'healer_card_completed_sadhanas', label: 'Completed Sadhanas & Certifications', type: 'CARD', selector: '#tab-healer-connect .card:first-child', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'healer_card_mentorship_network', label: 'Mentorship Network Card', type: 'CARD', selector: '#tab-healer-connect .card:nth-child(2)', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'healer_hub_banner', label: 'Multilevel Organization Hub Banner', type: 'CARD', selector: '.healers-hub-banner-card', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'healer_metrics_strip', label: 'Hub Metrics Strip', type: 'SECTION', selector: '.healers-metrics-strip', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'healer_search_controls', label: 'Search & Filter Controls', type: 'SECTION', selector: '.healers-hub-controls', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'healer_hub_cards', label: 'Profile Cards Grid', type: 'PANEL', selector: '#healers-hub-cards-container', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'btn_add_completed_sadhana', label: 'Add Completed Sadhana', type: 'BUTTON', selector: '#btn-add-completed-sadhana', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'btn_add_connected_devotee', label: 'Link Devotee', type: 'BUTTON', selector: '#btn-add-connected-devotee', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'btn_open_healers_tree', label: '5-Level Tree Button', type: 'BUTTON', selector: '#btn-open-healers-tree', category: 'Tab 4: Healer Connect', level: 1, parent: 'tab_healer_connect', roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: TAB 5 — GENEALOGY TREE
      // ═══════════════════════════════════════════════════════════════
      { id: 'tab_genealogy_tree', label: 'Tab 5: Genealogy Tree', type: 'SCREEN', selector: '#tab-genealogy-tree', category: 'Tab 5: Genealogy Tree', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'genealogy_card_hierarchy', label: 'Organization Hierarchy Tree Card', type: 'CARD', selector: '#tab-genealogy-tree .card', category: 'Tab 5: Genealogy Tree', level: 1, parent: 'tab_genealogy_tree', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'genealogy_level_filter_chips', label: 'Level Generation Filter Chips', type: 'SECTION', selector: '#hierarchy-level-filter-chips', category: 'Tab 5: Genealogy Tree', level: 1, parent: 'tab_genealogy_tree', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'genealogy_recursive_tree', label: '5-Level Recursive Tree View', type: 'PANEL', selector: '#hierarchy-recursive-tree-view', category: 'Tab 5: Genealogy Tree', level: 1, parent: 'tab_genealogy_tree', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'genealogy_canvas_tree', label: 'Spiderweb Canvas View', type: 'PANEL', selector: '#hierarchy-canvas-tree-view', category: 'Tab 5: Genealogy Tree', level: 1, parent: 'tab_genealogy_tree', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'genealogy_tree_toolbar', label: 'Canvas Toolbar', type: 'SECTION', selector: '.body-tree-toolbar', category: 'Tab 5: Genealogy Tree', level: 2, parent: 'genealogy_canvas_tree', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'genealogy_tree_footer', label: 'Canvas Footer Bar', type: 'SECTION', selector: '.body-tree-footer-bar', category: 'Tab 5: Genealogy Tree', level: 2, parent: 'genealogy_canvas_tree', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_view_recursive', label: '5-Level List View Toggle', type: 'BUTTON', selector: '#btn-view-recursive', category: 'Tab 5: Genealogy Tree', level: 1, parent: 'tab_genealogy_tree', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_view_canvas', label: 'Canvas View Toggle', type: 'BUTTON', selector: '#btn-view-canvas', category: 'Tab 5: Genealogy Tree', level: 1, parent: 'tab_genealogy_tree', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_body_smart_fit', label: 'Smart Fit Button', type: 'BUTTON', selector: '#btn-body-smart-fit', category: 'Tab 5: Genealogy Tree', level: 2, parent: 'genealogy_tree_toolbar', roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: TAB 6 — FIREBASE DATA
      // ═══════════════════════════════════════════════════════════════
      { id: 'tab_firebase_data', label: 'Tab 6: Firebase Data', type: 'SCREEN', selector: '#tab-firebase-data', category: 'Tab 6: Firebase Data', level: 0, roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'firebase_hero_card', label: 'Firebase Hero & Telemetry Card', type: 'CARD', selector: '.rtdb-hero-card', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'firebase_metrics_grid', label: 'Database Stat Metrics Grid', type: 'SECTION', selector: '.rtdb-metrics-grid', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'firebase_toolbar', label: 'Interactive Toolbar', type: 'SECTION', selector: '.rtdb-toolbar-row', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'firebase_filter_chips', label: 'Root Collection Filter Chips', type: 'SECTION', selector: '.rtdb-filter-chips-bar', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'firebase_breadcrumbs', label: 'Breadcrumb Navigation', type: 'SECTION', selector: '.rtdb-breadcrumbs-bar', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'firebase_drilldown_table', label: 'Drill-Down Table Container', type: 'PANEL', selector: '#rtdb-drilldown-table', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'btn_copy_rtdb_url', label: 'Copy Firebase URL', type: 'BUTTON', selector: '#btn-copy-rtdb-url', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'btn_rtdb_refresh', label: 'Refresh RTDB', type: 'BUTTON', selector: '#btn-rtdb-refresh', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'btn_rtdb_add_node', label: 'Add Node', type: 'BUTTON', selector: '#btn-rtdb-add-node', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'btn_rtdb_export_json', label: 'Export JSON', type: 'BUTTON', selector: '#btn-rtdb-export-json', category: 'Tab 6: Firebase Data', level: 1, parent: 'tab_firebase_data', roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: GLOBAL — HEADER ELEMENTS
      // ═══════════════════════════════════════════════════════════════
      { id: 'header_brand', label: 'Header Brand & Logo', type: 'SECTION', selector: '.topbar-brand-group', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'header_status_pill', label: 'Live Sync Status Pill', type: 'SECTION', selector: '#header-cloud-status', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'header_theme_toggle', label: 'Theme Toggle Button', type: 'BUTTON', selector: '#btn-theme-toggle', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'header_goli_gyan', label: 'Goli Gyan Button', type: 'BUTTON', selector: '#btn-quick-goli-gyan', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'header_download_app', label: 'Download App Link', type: 'BUTTON', selector: '#btn-header-download-app', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'header_payment_stamp', label: 'Payment Status Stamp', type: 'SECTION', selector: '#header-payment-stamp', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'btn_header_pending_approvals', label: 'Pending Approvals Button & Notification', type: 'BUTTON', selector: '#main-tab-approval-btn, #pending-approval-notification-banner', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'header_profile_box_1', label: 'Master Header Profile Card', type: 'CARD', selector: '#main-profile-box-1', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'selected_member_profile_card', label: 'Selected Member Profile Card', type: 'CARD', selector: '#selected-member-profile-card', category: 'Global: Header', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: GLOBAL — SIDEBAR ELEMENTS
      // ═══════════════════════════════════════════════════════════════
      { id: 'sidebar_share_pairing', label: 'Share & Pair Invite', type: 'BUTTON', selector: '#sidebar-btn-share-pairing', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'sidebar_access_matrix', label: 'Access Matrix Button', type: 'BUTTON', selector: '#sidebar-btn-rbac-matrix', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'sidebar_modify_auth_matrix', label: 'Modify Auth Matrix Button', type: 'BUTTON', selector: '#sidebar-btn-modify-auth-matrix', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'sidebar_copy_ref_code', label: 'Copy Ref Code', type: 'BUTTON', selector: '#sidebar-btn-copy-ref-code', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'sidebar_gen_ref_code', label: 'Generate Ref Code', type: 'BUTTON', selector: '#sidebar-btn-gen-ref-code', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'sidebar_toggle_json_drawer', label: 'View JSON Payload', type: 'BUTTON', selector: '#sidebar-btn-toggle-json-drawer', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'sidebar_open_rtdb', label: 'Open RTDB Table', type: 'BUTTON', selector: '#sidebar-btn-sidebar-open-rtdb', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'sidebar_sub_portals', label: 'Sub-Portal Links', type: 'SECTION', selector: '#sidebar-dedicated-portals', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'sidebar_hierarchy_legend', label: 'Hierarchy Legend', type: 'SECTION', selector: '#hierarchy-legend-container', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: true, devotee: false } },
      { id: 'sidebar_tools_section', label: 'System Tools & Actions', type: 'SECTION', selector: '#sidebar-tools-section', category: 'Global: Sidebar', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: GLOBAL — FOOTER ACTIONS
      // ═══════════════════════════════════════════════════════════════
      { id: 'footer_save_status', label: 'Save Status Indicator', type: 'SECTION', selector: '#save-status-indicator', category: 'Global: Footer', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'footer_delete_profile', label: 'Delete Profile Button', type: 'BUTTON', selector: '#btn-delete-profile', category: 'Global: Footer', level: 0, roles: { MASTER: true, HEALER: false, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: false, trainee: false, devotee: false } },
      { id: 'footer_save_sync', label: 'Save & Sync Button', type: 'BUTTON', selector: '#profile-admin-form button[type="submit"]', category: 'Global: Footer', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },

      // ═══════════════════════════════════════════════════════════════
      // CATEGORY: GLOBAL — DRAWERS & MODALS
      // ═══════════════════════════════════════════════════════════════
      { id: 'sadhana_drawer', label: 'Sadhana Detail Drawer', type: 'DRAWER', selector: '#sadhana-drawer', category: 'Global: Drawers & Modals', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'json_drawer', label: 'JSON Payload Drawer', type: 'DRAWER', selector: '#json-drawer', category: 'Global: Drawers & Modals', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'import_modal', label: 'Import Modal', type: 'MODAL', selector: '#import-modal', category: 'Global: Drawers & Modals', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: false, DEVOTEE: false }, portals: { masters: true, healers: true, trainee: false, devotee: false } },
      { id: 'goli_gyan_modal', label: 'Goli Gyan Modal', type: 'MODAL', selector: '#goli-gyan-modal', category: 'Global: Drawers & Modals', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'admin_settings_modal', label: 'Admin Settings Modal', type: 'MODAL', selector: '#admin-settings-modal', category: 'Global: Drawers & Modals', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
      { id: 'rbac_matrix_modal', label: 'RBAC Access Matrix Modal', type: 'MODAL', selector: '#rbac-access-matrix-modal', category: 'Global: Drawers & Modals', level: 0, roles: { MASTER: true, HEALER: true, TRAINEE: true, DEVOTEE: true }, portals: { masters: true, healers: true, trainee: true, devotee: true } },
    ];
  }

  /**
   * Returns the default auth matrix with role/portal visibility from the definition.
   * Used to initialize localStorage or reset to defaults.
   */
  static getDefaultAuthMatrix() {
    return this.getMatrixDefinition().map(item => ({
      id: item.id,
      name: item.label,
      type: item.type,
      selector: item.selector,
      category: item.category,
      level: item.level,
      parent: item.parent || null,
      MASTER: item.roles.MASTER,
      HEALER: item.roles.HEALER,
      TRAINEE: item.roles.TRAINEE,
      DEVOTEE: item.roles.DEVOTEE,
      portalVisible: { ...item.portals }
    }));
  }

  /**
   * Returns the full matrix definition with metadata (for rendering the settings UI).
   */
  static getMatrixMeta() {
    return this.getMatrixDefinition();
  }

  /**
   * Returns unique category names in order.
   */
  static getCategories() {
    const cats = [];
    this.getMatrixDefinition().forEach(item => {
      if (!cats.includes(item.category)) cats.push(item.category);
    });
    return cats;
  }

  /**
   * Resolves normalized role string.
   */
  static resolveRole(role) {
    const r = (role || 'DEVOTEE').toUpperCase();
    if (r === 'ADMIN' || r === 'MASTER') return 'MASTER';
    if (r === 'HEALER') return 'HEALER';
    if (r === 'TRAINEE') return 'TRAINEE';
    return 'DEVOTEE';
  }

  /**
   * Filters profile list based on role isolation requirements (DS-02, DS-03, TC-SEC-01).
   * DEVOTEE cannot access other devotees' profile IDs or inspect Healers Hub.
   * HEALER cannot see Level 0 Founder Master in downline directory.
   */
  static filterProfilesForRole(profiles, role) {
    const resolved = this.resolveRole(role);
    if (!Array.isArray(profiles)) return [];
    if (resolved === 'MASTER') return profiles;

    if (resolved === 'HEALER') {
      // Shield Founder Master (Level 0 / ADMIN) from Healer view (DS-03)
      return profiles.filter(p => p.level !== 0 && p.profileType !== 'ADMIN');
    }

    if (resolved === 'DEVOTEE') {
      // Devotee isolation (DS-02)
      return profiles.filter(p => p.profileType === 'DEVOTEE');
    }

    return profiles;
  }

  /**
   * Checks if an element ID can be accessed by the specified role.
   */
  static canAccessElement(elementId, role) {
    const resolved = this.resolveRole(role);
    const def = this.getMatrixDefinition().find(item => item.id === elementId);
    if (!def) return true;
    return Boolean(def.roles && def.roles[resolved]);
  }
}

// Export for use in both browser and Node.js contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScreenAuthMatrix;
}
if (typeof window !== 'undefined') {
  window.ScreenAuthMatrix = ScreenAuthMatrix;
}
