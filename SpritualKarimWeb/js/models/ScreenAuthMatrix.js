/**
 * ScreenAuthMatrix.js
 * Comprehensive Screen Authorization Matrix — defines every hideable UI element
 * across all 6 tabs + global areas, organized strictly by Screen / Page Division
 * with role/portal gating and 3-level hierarchical grouping.
 * 
 * Architecture:
 *   - Each item has: id, label, type, selector, category, level (indent), parent
 *   - type: SCREEN | SUBTAB | CARD | PANEL | BUTTON | SECTION | DRAWER | MODAL
 *   - category: 10 Canonical Screen / Page Divisions
 *   - level: 0 = Screen/Top, 1 = Subgroup (Subtab/Major Card/Panel), 2 = Leaf Control (Button/Section)
 *   - parent: id of parent item (for hierarchical grouping)
 *   - selector: CSS selector to target the element in DOM
 *   - roles: { MASTER, HEALER, TRAINEE, DEVOTEE } — 4 canonical role levels
 *   - portals: { masters, healers, trainee, devotee, seeker } — default visibility per portal
 * 
 * Single Source of Truth for RBAC and dynamic UI alignment across all portals.
 */
class ScreenAuthMatrix {

  /**
   * Returns the canonical list of all screen elements that can be hidden/shown.
   * This is the single source of truth for the authorization matrix.
   */
  static getMatrixDefinition() {
    return [
  {
    "id": "tab_devotee_personal",
    "label": "Tab 1: Devotee Personal",
    "type": "SCREEN",
    "selector": "#tab-devotee-personal",
    "category": "Tab 1: Devotee Personal",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_sub_identity",
    "label": "Personal Identity Panel",
    "type": "SUBTAB",
    "selector": "#devotee-sub-identity",
    "category": "Tab 1: Devotee Personal",
    "level": 1,
    "parent": "tab_devotee_personal",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_card_contact_data",
    "label": "Personal Contact & Residential Data",
    "type": "CARD",
    "selector": "#devotee-sub-identity .card:first-child",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_card_identity_config",
    "label": "Role & Reference Code Config",
    "type": "CARD",
    "selector": "#devotee-sub-identity .card:nth-child(2)",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_name",
    "label": "Devotee Full Name Input",
    "type": "SECTION",
    "selector": "#input-name",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_phone",
    "label": "Phone Number Input",
    "type": "SECTION",
    "selector": "#input-phone",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_email",
    "label": "Email Address Input",
    "type": "SECTION",
    "selector": "#input-email",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_city",
    "label": "City / Residential Location",
    "type": "SECTION",
    "selector": "#input-city",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_address",
    "label": "Residential Address Input",
    "type": "SECTION",
    "selector": "#input-address",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_profile_type",
    "label": "System Profile Type Select",
    "type": "SECTION",
    "selector": "#input-profile-type, #select-profile-type",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_level",
    "label": "Hierarchy Level Assignment",
    "type": "SECTION",
    "selector": "#input-level, #select-level",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_ref_code",
    "label": "Personal Reference Code Field",
    "type": "SECTION",
    "selector": "#input-ref-code",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_field_sponsor_code",
    "label": "Healer Sponsor Code Field",
    "type": "SECTION",
    "selector": "#input-sponsor-code",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "btn_edit_identity",
    "label": "Edit Identity Button",
    "type": "BUTTON",
    "selector": "#btn-edit-identity",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_reset_identity",
    "label": "Reset Identity Button",
    "type": "BUTTON",
    "selector": "#btn-reset-identity",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_identity",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "devotee_sub_lineage",
    "label": "3-Gen Ancestral Lineage Panel",
    "type": "SUBTAB",
    "selector": "#devotee-sub-lineage",
    "category": "Tab 1: Devotee Personal",
    "level": 1,
    "parent": "tab_devotee_personal",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_card_lineage_current",
    "label": "Current Family Unit Card",
    "type": "CARD",
    "selector": "#devotee-sub-lineage .card:first-child",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_card_lineage_husband",
    "label": "Husband Ancestral Lineage Card",
    "type": "CARD",
    "selector": "#devotee-sub-lineage .card:nth-child(2)",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_card_lineage_wife",
    "label": "Wife Ancestral Lineage Card",
    "type": "CARD",
    "selector": "#devotee-sub-lineage .card:nth-child(3)",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "btn_add_lineage_node",
    "label": "Add Custom Lineage Node",
    "type": "BUTTON",
    "selector": "#btn-add-lineage-node",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_add_child",
    "label": "Add Child Node Button",
    "type": "BUTTON",
    "selector": "#btn-add-child",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_add_sibling_current",
    "label": "Add Current Sibling Button",
    "type": "BUTTON",
    "selector": "#btn-add-sibling-current",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_add_sibling_husband",
    "label": "Add Husband Branch Sibling",
    "type": "BUTTON",
    "selector": "#btn-add-sibling-husband",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_add_sibling_wife",
    "label": "Add Wife Branch Sibling",
    "type": "BUTTON",
    "selector": "#btn-add-sibling-wife",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_reset_lineage",
    "label": "Reset Lineage Button",
    "type": "BUTTON",
    "selector": "#btn-reset-lineage",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_lineage",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "devotee_sub_houseclean",
    "label": "House Clean (All Levels) Panel",
    "type": "SUBTAB",
    "selector": "#devotee-sub-houseclean",
    "category": "Tab 1: Devotee Personal",
    "level": 1,
    "parent": "tab_devotee_personal",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "devotee_card_houseclean",
    "label": "House Clean Purification Card",
    "type": "CARD",
    "selector": "#devotee-sub-houseclean .card",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_houseclean",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "btn_add_houseclean_record",
    "label": "Add Level Record",
    "type": "BUTTON",
    "selector": "#btn-add-houseclean-record",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_houseclean",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_houseclean_husband_side",
    "label": "House Clean - Husband Side",
    "type": "BUTTON",
    "selector": "#btn-houseclean-husband-side",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_houseclean",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_houseclean_wife_side",
    "label": "House Clean - Wife Side",
    "type": "BUTTON",
    "selector": "#btn-houseclean-wife-side",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_houseclean",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_reset_houseclean",
    "label": "Reset All Levels Button",
    "type": "BUTTON",
    "selector": "#btn-reset-houseclean",
    "category": "Tab 1: Devotee Personal",
    "level": 2,
    "parent": "devotee_sub_houseclean",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tab_seeker_purpose",
    "label": "Tab 2: Seeker Purpose",
    "type": "SCREEN",
    "selector": "#tab-seeker-purpose",
    "category": "Tab 2: Seeker Purpose",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_sub_purpose",
    "label": "Spiritual Purpose & Goals Panel",
    "type": "SUBTAB",
    "selector": "#seeker-sub-purpose",
    "category": "Tab 2: Seeker Purpose",
    "level": 1,
    "parent": "tab_seeker_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_card_purpose_diagnostics",
    "label": "Purpose & Diagnostics Card",
    "type": "CARD",
    "selector": "#seeker-sub-purpose .card:first-child",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_card_remedies_catalog",
    "label": "Prescribed Remedies Catalog Card",
    "type": "CARD",
    "selector": "#seeker-sub-purpose .card:nth-child(2)",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_remedy_filter_toolbar",
    "label": "Remedy Search & Filter Toolbar",
    "type": "SECTION",
    "selector": ".remedy-filter-toolbar",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_remedy_category_1",
    "label": "Divine Remedies & Fire Havans",
    "type": "SECTION",
    "selector": "#seeker-sub-purpose .remedy-category-group:first-child",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_remedy_category_2",
    "label": "Energy Cleansing & Karmic Healing",
    "type": "SECTION",
    "selector": "#seeker-sub-purpose .remedy-category-group:nth-child(2)",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_remedy_category_3",
    "label": "Seasonal Sacred Festivals",
    "type": "SECTION",
    "selector": "#seeker-sub-purpose .remedy-category-group:nth-child(3)",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_remedy_cards_grid",
    "label": "Interactive Remedy Options Grid",
    "type": "SECTION",
    "selector": "#seeker-sub-purpose .remedy-card-option",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "btn_add_purpose_goal",
    "label": "Add Purpose Goal",
    "type": "BUTTON",
    "selector": "#btn-add-purpose-goal",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_reset_purpose",
    "label": "Clear Purpose Goals",
    "type": "BUTTON",
    "selector": "#btn-reset-purpose",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_add_custom_remedy_purpose",
    "label": "Add Custom Remedy",
    "type": "BUTTON",
    "selector": "#btn-add-custom-remedy-purpose",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "seeker_sub_houseclean",
    "label": "House Clean Verification Status Panel",
    "type": "SUBTAB",
    "selector": "#seeker-sub-houseclean",
    "category": "Tab 2: Seeker Purpose",
    "level": 1,
    "parent": "tab_seeker_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_card_houseclean_logs",
    "label": "House Clean Verification Logs Card",
    "type": "CARD",
    "selector": "#seeker-sub-houseclean .card",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_houseclean",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "btn_add_seeker_clean_log",
    "label": "Add Clean Log",
    "type": "BUTTON",
    "selector": "#btn-add-seeker-clean-log",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_houseclean",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "seeker_sub_sadhanas",
    "label": "Sadhanas Interested Panel",
    "type": "SUBTAB",
    "selector": "#seeker-sub-sadhanas",
    "category": "Tab 2: Seeker Purpose",
    "level": 1,
    "parent": "tab_seeker_purpose",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_card_sadhanas_catalog",
    "label": "Interested Sadhanas Catalog Card",
    "type": "CARD",
    "selector": "#seeker-sub-sadhanas .card",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_sadhanas",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_sadhana_listbox",
    "label": "Sacred Sadhana Listbox Wrap",
    "type": "SECTION",
    "selector": "#sadhana-listbox-wrap",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_sadhanas",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "seeker_sadhana_interactive_tiles",
    "label": "Sadhana Catalog Interactive Tiles",
    "type": "SECTION",
    "selector": "#seeker-sub-sadhanas .sadhana-card, #seeker-sub-sadhanas .tile-item",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_sadhanas",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "btn_add_custom_sadhana",
    "label": "Add Custom Sadhana",
    "type": "BUTTON",
    "selector": "#btn-add-custom-sadhana",
    "category": "Tab 2: Seeker Purpose",
    "level": 2,
    "parent": "seeker_sub_sadhanas",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tab_trainee_sadhak",
    "label": "Tab 3: Trainee Sadhak",
    "type": "SCREEN",
    "selector": "#tab-trainee-sadhak",
    "category": "Tab 3: Trainee Sadhak",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_card_dashboard",
    "label": "In-Progress Dashboard Summary Card",
    "type": "CARD",
    "selector": "#tab-trainee-sadhak .card:first-child",
    "category": "Tab 3: Trainee Sadhak",
    "level": 1,
    "parent": "tab_trainee_sadhak",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_card_pair_status",
    "label": "Mentor Pairing Status Card",
    "type": "CARD",
    "selector": "#trainee-mentor-status-card, .mentor-pairing-info-card",
    "category": "Tab 3: Trainee Sadhak",
    "level": 1,
    "parent": "tab_trainee_sadhak",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_split_workspace",
    "label": "Master-Detail Split Workspace",
    "type": "PANEL",
    "selector": ".trainee-split-workspace",
    "category": "Tab 3: Trainee Sadhak",
    "level": 1,
    "parent": "tab_trainee_sadhak",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_left_panel",
    "label": "Left Workspace Panel — Categorized Tiles",
    "type": "PANEL",
    "selector": ".trainee-left-panel",
    "category": "Tab 3: Trainee Sadhak",
    "level": 2,
    "parent": "trainee_split_workspace",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_sadhanas_group",
    "label": "Sacred Sadhanas In-Progress Tiles",
    "type": "SECTION",
    "selector": "#trainee-sadhanas-group-sadhanas",
    "category": "Tab 3: Trainee Sadhak",
    "level": 2,
    "parent": "trainee_left_panel",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_remedies_group",
    "label": "Divine Remedies In-Progress Tiles",
    "type": "SECTION",
    "selector": "#trainee-sadhanas-group-remedies",
    "category": "Tab 3: Trainee Sadhak",
    "level": 2,
    "parent": "trainee_left_panel",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_cleansing_group",
    "label": "Energy Cleansing In-Progress Tiles",
    "type": "SECTION",
    "selector": "#trainee-sadhanas-group-cleansing",
    "category": "Tab 3: Trainee Sadhak",
    "level": 2,
    "parent": "trainee_left_panel",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_right_panel",
    "label": "Right Workspace Panel — Progress Graphics",
    "type": "PANEL",
    "selector": ".trainee-right-panel",
    "category": "Tab 3: Trainee Sadhak",
    "level": 2,
    "parent": "trainee_split_workspace",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_progress_meter",
    "label": "Daily Sadhana Tracker & Progress Meter",
    "type": "SECTION",
    "selector": ".trainee-progress-meter, #trainee-daily-tracker",
    "category": "Tab 3: Trainee Sadhak",
    "level": 2,
    "parent": "trainee_right_panel",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "trainee_action_toolbar",
    "label": "Trainee Action Toolbar",
    "type": "SECTION",
    "selector": "#tab-trainee-sadhak .action-toolbar",
    "category": "Tab 3: Trainee Sadhak",
    "level": 1,
    "parent": "tab_trainee_sadhak",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_add_trainee_sadhana",
    "label": "Add In-Progress Sadhana",
    "type": "BUTTON",
    "selector": "#btn-add-trainee-sadhana",
    "category": "Tab 3: Trainee Sadhak",
    "level": 2,
    "parent": "trainee_action_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_open_goli_gyan",
    "label": "Goli Gyan Guide Button",
    "type": "BUTTON",
    "selector": "#btn-open-goli-gyan",
    "category": "Tab 3: Trainee Sadhak",
    "level": 2,
    "parent": "trainee_action_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tab_healer_connect",
    "label": "Tab 4: Healer Connect",
    "type": "SCREEN",
    "selector": "#tab-healer-connect",
    "category": "Tab 4: Healer Connect",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "healer_hub_banner",
    "label": "Multilevel Organization Hub Banner",
    "type": "CARD",
    "selector": ".healers-hub-banner-card",
    "category": "Tab 4: Healer Connect",
    "level": 1,
    "parent": "tab_healer_connect",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "healer_metrics_strip",
    "label": "Hub Live Metrics Strip",
    "type": "SECTION",
    "selector": ".healers-metrics-strip, #healers-hub-metrics-strip",
    "category": "Tab 4: Healer Connect",
    "level": 1,
    "parent": "tab_healer_connect",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "healer_search_controls",
    "label": "Directory Search & Filter Controls",
    "type": "SECTION",
    "selector": ".healers-hub-controls",
    "category": "Tab 4: Healer Connect",
    "level": 1,
    "parent": "tab_healer_connect",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "healer_layout_toggle",
    "label": "Directory Layout Toggle Bar",
    "type": "SECTION",
    "selector": "#healers-layout-toggle-bar",
    "category": "Tab 4: Healer Connect",
    "level": 1,
    "parent": "tab_healer_connect",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_layout_grid",
    "label": "Grid Cards View Toggle",
    "type": "BUTTON",
    "selector": "#btn-layout-grid",
    "category": "Tab 4: Healer Connect",
    "level": 2,
    "parent": "healer_layout_toggle",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_layout_table",
    "label": "Table List View Toggle",
    "type": "BUTTON",
    "selector": "#btn-layout-table",
    "category": "Tab 4: Healer Connect",
    "level": 2,
    "parent": "healer_layout_toggle",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "healer_hub_cards",
    "label": "Profile Cards Grid Container",
    "type": "PANEL",
    "selector": "#healers-hub-cards-container",
    "category": "Tab 4: Healer Connect",
    "level": 1,
    "parent": "tab_healer_connect",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "healer_hub_table",
    "label": "Healers Hub Table Container",
    "type": "PANEL",
    "selector": "#healers-hub-table-container",
    "category": "Tab 4: Healer Connect",
    "level": 1,
    "parent": "tab_healer_connect",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "healer_card_completed_sadhanas",
    "label": "Completed Sadhanas & Certifications",
    "type": "CARD",
    "selector": "#tab-healer-connect .card:first-child",
    "category": "Tab 4: Healer Connect",
    "level": 1,
    "parent": "tab_healer_connect",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "healer_card_mentorship_network",
    "label": "Mentorship Network Card",
    "type": "CARD",
    "selector": "#tab-healer-connect .card:nth-child(2)",
    "category": "Tab 4: Healer Connect",
    "level": 1,
    "parent": "tab_healer_connect",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_add_completed_sadhana",
    "label": "Add Completed Sadhana Button",
    "type": "BUTTON",
    "selector": "#btn-add-completed-sadhana",
    "category": "Tab 4: Healer Connect",
    "level": 2,
    "parent": "healer_card_completed_sadhanas",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_add_connected_devotee",
    "label": "Link Devotee Button",
    "type": "BUTTON",
    "selector": "#btn-add-connected-devotee",
    "category": "Tab 4: Healer Connect",
    "level": 2,
    "parent": "healer_card_mentorship_network",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_open_healers_tree",
    "label": "5-Level Tree Launch Button",
    "type": "BUTTON",
    "selector": "#btn-open-healers-tree",
    "category": "Tab 4: Healer Connect",
    "level": 2,
    "parent": "healer_card_mentorship_network",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tab_genealogy_tree",
    "label": "Tab 5: Genealogy Tree",
    "type": "SCREEN",
    "selector": "#tab-genealogy-tree",
    "category": "Tab 5: Genealogy Tree",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "genealogy_card_hierarchy",
    "label": "Organization Hierarchy Tree Card",
    "type": "CARD",
    "selector": "#tab-genealogy-tree .card",
    "category": "Tab 5: Genealogy Tree",
    "level": 1,
    "parent": "tab_genealogy_tree",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "genealogy_level_filter_chips",
    "label": "Level Generation Filter Chips",
    "type": "SECTION",
    "selector": "#hierarchy-level-filter-chips",
    "category": "Tab 5: Genealogy Tree",
    "level": 1,
    "parent": "tab_genealogy_tree",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "genealogy_view_toggle_bar",
    "label": "Hierarchy View Mode Toggle Controls",
    "type": "SECTION",
    "selector": "#tab-genealogy-tree .tree-view-toggle",
    "category": "Tab 5: Genealogy Tree",
    "level": 1,
    "parent": "tab_genealogy_tree",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_view_recursive",
    "label": "5-Level List View Toggle",
    "type": "BUTTON",
    "selector": "#btn-view-recursive",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_view_toggle_bar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_view_canvas",
    "label": "Canvas View Toggle",
    "type": "BUTTON",
    "selector": "#btn-view-canvas",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_view_toggle_bar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "genealogy_recursive_tree",
    "label": "5-Level Recursive Tree View",
    "type": "PANEL",
    "selector": "#hierarchy-recursive-tree-view",
    "category": "Tab 5: Genealogy Tree",
    "level": 1,
    "parent": "tab_genealogy_tree",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "genealogy_canvas_tree",
    "label": "Spiderweb Canvas View",
    "type": "PANEL",
    "selector": "#hierarchy-canvas-tree-view",
    "category": "Tab 5: Genealogy Tree",
    "level": 1,
    "parent": "tab_genealogy_tree",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "genealogy_tree_toolbar",
    "label": "Canvas Interactive Toolbar",
    "type": "SECTION",
    "selector": ".body-tree-toolbar",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_canvas_tree",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_body_smart_fit",
    "label": "Smart Fit Button",
    "type": "BUTTON",
    "selector": "#btn-body-smart-fit",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_tree_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_body_zoom_in",
    "label": "Zoom In Button",
    "type": "BUTTON",
    "selector": "#btn-body-zoom-in",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_tree_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_body_zoom_out",
    "label": "Zoom Out Button",
    "type": "BUTTON",
    "selector": "#btn-body-zoom-out",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_tree_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_body_zoom_reset",
    "label": "Reset Zoom Button",
    "type": "BUTTON",
    "selector": "#btn-body-zoom-reset",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_tree_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_body_fullscreen",
    "label": "Fullscreen Canvas Button",
    "type": "BUTTON",
    "selector": "#btn-body-fullscreen",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_tree_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "genealogy_tree_search",
    "label": "Canvas Member Search Bar",
    "type": "SECTION",
    "selector": ".tree-search-wrap, #btn-clear-tree-search",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_canvas_tree",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "genealogy_tree_footer",
    "label": "Canvas Footer Bar",
    "type": "SECTION",
    "selector": ".body-tree-footer-bar",
    "category": "Tab 5: Genealogy Tree",
    "level": 2,
    "parent": "genealogy_canvas_tree",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tab_firebase_data",
    "label": "Tab 6: Firebase Data",
    "type": "SCREEN",
    "selector": "#tab-firebase-data",
    "category": "Tab 6: Firebase Data",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "firebase_hero_card",
    "label": "Firebase Hero & Telemetry Card",
    "type": "CARD",
    "selector": ".rtdb-hero-card",
    "category": "Tab 6: Firebase Data",
    "level": 1,
    "parent": "tab_firebase_data",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "firebase_metrics_grid",
    "label": "Database Stat Metrics Grid",
    "type": "SECTION",
    "selector": ".rtdb-metrics-grid",
    "category": "Tab 6: Firebase Data",
    "level": 1,
    "parent": "tab_firebase_data",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "firebase_toolbar",
    "label": "Interactive Database Toolbar",
    "type": "SECTION",
    "selector": ".rtdb-toolbar-row",
    "category": "Tab 6: Firebase Data",
    "level": 1,
    "parent": "tab_firebase_data",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_copy_rtdb_url",
    "label": "Copy Firebase URL",
    "type": "BUTTON",
    "selector": "#btn-copy-rtdb-url",
    "category": "Tab 6: Firebase Data",
    "level": 2,
    "parent": "firebase_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_rtdb_refresh",
    "label": "Refresh RTDB",
    "type": "BUTTON",
    "selector": "#btn-rtdb-refresh",
    "category": "Tab 6: Firebase Data",
    "level": 2,
    "parent": "firebase_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_rtdb_expand_all",
    "label": "Expand All Nodes",
    "type": "BUTTON",
    "selector": "#btn-rtdb-expand-all",
    "category": "Tab 6: Firebase Data",
    "level": 2,
    "parent": "firebase_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_rtdb_collapse_all",
    "label": "Collapse All Nodes",
    "type": "BUTTON",
    "selector": "#btn-rtdb-collapse-all",
    "category": "Tab 6: Firebase Data",
    "level": 2,
    "parent": "firebase_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_rtdb_add_node",
    "label": "Add Node Button",
    "type": "BUTTON",
    "selector": "#btn-rtdb-add-node",
    "category": "Tab 6: Firebase Data",
    "level": 2,
    "parent": "firebase_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_rtdb_export_json",
    "label": "Export JSON Button",
    "type": "BUTTON",
    "selector": "#btn-rtdb-export-json",
    "category": "Tab 6: Firebase Data",
    "level": 2,
    "parent": "firebase_toolbar",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "firebase_filter_chips",
    "label": "Root Collection Filter Chips Bar",
    "type": "SECTION",
    "selector": ".rtdb-filter-chips-bar",
    "category": "Tab 6: Firebase Data",
    "level": 1,
    "parent": "tab_firebase_data",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "firebase_breadcrumbs",
    "label": "Breadcrumb Navigation Bar",
    "type": "SECTION",
    "selector": ".rtdb-breadcrumbs-bar",
    "category": "Tab 6: Firebase Data",
    "level": 1,
    "parent": "tab_firebase_data",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "firebase_drilldown_table",
    "label": "Drill-Down Table Container",
    "type": "PANEL",
    "selector": "#rtdb-drilldown-table",
    "category": "Tab 6: Firebase Data",
    "level": 1,
    "parent": "tab_firebase_data",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "header_division",
    "label": "Global: Header Division",
    "type": "SCREEN",
    "selector": ".admin-topbar, header.admin-topbar",
    "category": "Global: Header",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "header_brand",
    "label": "Header Brand & Title",
    "type": "SECTION",
    "selector": ".admin-brand",
    "category": "Global: Header",
    "level": 1,
    "parent": "header_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "header_status_pill",
    "label": "Live Cloud Sync Status Pill",
    "type": "SECTION",
    "selector": "#header-cloud-status",
    "category": "Global: Header",
    "level": 1,
    "parent": "header_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "header_payment_stamp",
    "label": "Payment Status Stamp",
    "type": "SECTION",
    "selector": "#display-payment-stamp, #selected-member-payment-stamp",
    "category": "Global: Header",
    "level": 1,
    "parent": "header_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "header_action_controls",
    "label": "Header Quick Action Controls",
    "type": "SECTION",
    "selector": ".admin-topbar .topbar-col3, .admin-topbar .topbar-actions",
    "category": "Global: Header",
    "level": 1,
    "parent": "header_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "header_theme_toggle",
    "label": "Theme Toggle Button",
    "type": "BUTTON",
    "selector": "#btn-theme-toggle",
    "category": "Global: Header",
    "level": 2,
    "parent": "header_action_controls",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "header_download_app",
    "label": "Download App Link",
    "type": "BUTTON",
    "selector": "#btn-header-download-app",
    "category": "Global: Header",
    "level": 2,
    "parent": "header_action_controls",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "btn_header_pending_approvals",
    "label": "Pending Approvals Button & Notification",
    "type": "BUTTON",
    "selector": "#main-tab-approval-btn, #pending-approval-notification-banner",
    "category": "Global: Header",
    "level": 2,
    "parent": "header_action_controls",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "header_profile_box_1",
    "label": "Master Header Profile Card (Profile Box 1)",
    "type": "CARD",
    "selector": ".topbar-col1, .topbar-col2",
    "category": "Global: Header",
    "level": 1,
    "parent": "header_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "header_user_role_dropdown",
    "label": "Header Role Switcher Dropdown (Role Switcher)",
    "type": "BUTTON",
    "selector": "#select-role-mode, .pill-dropdown-caret",
    "category": "Global: Header",
    "level": 2,
    "parent": "header_profile_box_1",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "devotee_card_flipper",
    "label": "Hero 3D Profile Card Flipper & QR Pairing",
    "type": "CARD",
    "selector": "#profile-card-flipper-wrapper, .flipper-container",
    "category": "Global: Header",
    "level": 2,
    "parent": "header_profile_box_1",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "admin_hierarchy_metrics_strip",
    "label": "Admin Master Live Metrics Strip (5 Unified Tiles)",
    "type": "SECTION",
    "selector": "#admin-hierarchy-metrics-strip",
    "category": "Global: Header",
    "level": 1,
    "parent": "header_division",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "metric_tile_master",
    "label": "👑 Admin Master Metric Card (Tile 1)",
    "type": "CARD",
    "selector": "#admin-hierarchy-metrics-strip .tile-master",
    "category": "Global: Header",
    "level": 2,
    "parent": "admin_hierarchy_metrics_strip",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "metric_tile_healers",
    "label": "🌿 Healers Metric Card (Tile 2)",
    "type": "CARD",
    "selector": "#admin-hierarchy-metrics-strip .tile-healers",
    "category": "Global: Header",
    "level": 2,
    "parent": "admin_hierarchy_metrics_strip",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "metric_tile_trainees",
    "label": "🔥 Trainee Metric Card (Tile 3)",
    "type": "CARD",
    "selector": "#admin-hierarchy-metrics-strip .tile-trainees",
    "category": "Global: Header",
    "level": 2,
    "parent": "admin_hierarchy_metrics_strip",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "metric_tile_devotees",
    "label": "🙏 Devotee Metric Card (Tile 4)",
    "type": "CARD",
    "selector": "#admin-hierarchy-metrics-strip .tile-devotees",
    "category": "Global: Header",
    "level": 2,
    "parent": "admin_hierarchy_metrics_strip",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "metric_tile_composite",
    "label": "Dual Composite Card (Genealogy & Approvals)",
    "type": "CARD",
    "selector": "#metric-tile-composite",
    "category": "Global: Header",
    "level": 2,
    "parent": "admin_hierarchy_metrics_strip",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "metric_tile_genealogy",
    "label": "🌳 Genealogy Quick Tile & Node Count",
    "type": "BUTTON",
    "selector": "#metric-tile-genealogy, .tile-composite-up",
    "category": "Global: Header",
    "level": 2,
    "parent": "admin_hierarchy_metrics_strip",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "metric_tile_approvals",
    "label": "⏳ Pending Approvals Quick Tile & Badge",
    "type": "BUTTON",
    "selector": "#metric-tile-approvals, .tile-composite-down",
    "category": "Global: Header",
    "level": 2,
    "parent": "admin_hierarchy_metrics_strip",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tier_profiles_panel",
    "label": "Hierarchy Tier Ribbon & Flyout Panel",
    "type": "PANEL",
    "selector": "#tier-profiles-panel",
    "category": "Global: Header",
    "level": 1,
    "parent": "header_division",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tier_profiles_search",
    "label": "Tier Panel Member Search",
    "type": "SECTION",
    "selector": "#input-tier-panel-search, #btn-clear-tier-search",
    "category": "Global: Header",
    "level": 2,
    "parent": "tier_profiles_panel",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tier_profiles_close",
    "label": "Collapse / Close Tier Panel Button",
    "type": "BUTTON",
    "selector": "#btn-collapse-tier-panel, #btn-close-tier-panel",
    "category": "Global: Header",
    "level": 2,
    "parent": "tier_profiles_panel",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "selected_member_profile_card",
    "label": "Selected Member Profile Card (Profile Box 2)",
    "type": "CARD",
    "selector": "#selected-member-profile-card",
    "category": "Global: Header",
    "level": 1,
    "parent": "header_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_selected_member_copy_code",
    "label": "Selected Member Copy Ref Code",
    "type": "BUTTON",
    "selector": "#btn-selected-member-copy-code",
    "category": "Global: Header",
    "level": 2,
    "parent": "selected_member_profile_card",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_selected_member_qr",
    "label": "Selected Member QR Pairing Button",
    "type": "BUTTON",
    "selector": "#btn-selected-member-qr",
    "category": "Global: Header",
    "level": 2,
    "parent": "selected_member_profile_card",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "btn_close_selected_member_card",
    "label": "Return to Master Profile Button",
    "type": "BUTTON",
    "selector": "#btn-close-selected-member-card",
    "category": "Global: Header",
    "level": 2,
    "parent": "selected_member_profile_card",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "sidebar_division",
    "label": "Global: Sidebar Division",
    "type": "SCREEN",
    "selector": "#admin-sidebar, .admin-sidebar",
    "category": "Global: Sidebar",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "sidebar_member_actions",
    "label": "Member Profile Action Buttons",
    "type": "SECTION",
    "selector": "#admin-sidebar .sidebar-profile-actions",
    "category": "Global: Sidebar",
    "level": 1,
    "parent": "sidebar_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_btn_create_profile",
    "label": "Create New Profile Button",
    "type": "BUTTON",
    "selector": "#btn-create-profile, #sidebar-btn-create-profile",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_member_actions",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_open_tree_view",
    "label": "Tree View Modal Button",
    "type": "BUTTON",
    "selector": "#btn-open-tree-view",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_member_actions",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_share_pairing",
    "label": "Share & Pair Invite Button",
    "type": "BUTTON",
    "selector": "#sidebar-btn-share-pairing",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_member_actions",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_copy_ref_code",
    "label": "Copy Ref Code Button",
    "type": "BUTTON",
    "selector": "#btn-copy-ref-code",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_member_actions",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "sidebar_gen_ref_code",
    "label": "Generate Ref Code Button",
    "type": "BUTTON",
    "selector": "#btn-gen-ref-code",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_member_actions",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_tools_section",
    "label": "System Tools & Diagnostics Section",
    "type": "SECTION",
    "selector": "#sidebar-tools-section",
    "category": "Global: Sidebar",
    "level": 1,
    "parent": "sidebar_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_access_matrix",
    "label": "RBAC Access Matrix Button",
    "type": "BUTTON",
    "selector": "#sidebar-btn-rbac-matrix",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_tools_section",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_modify_auth_matrix",
    "label": "Modify Auth Matrix Button",
    "type": "BUTTON",
    "selector": "#sidebar-btn-modify-auth-matrix",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_tools_section",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_toggle_json_drawer",
    "label": "View JSON Payload Button",
    "type": "BUTTON",
    "selector": "#btn-toggle-json-drawer",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_tools_section",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_rtdb_section",
    "label": "🔥 Firebase Realtime DB Sidebar Section & Shortcuts",
    "type": "SECTION",
    "selector": "#sidebar-rtdb-section, .sidebar-rtdb-card, #btn-sidebar-open-rtdb, #sidebar-rtdb-shortcuts",
    "category": "Global: Sidebar",
    "level": 1,
    "parent": "sidebar_division",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_open_rtdb",
    "label": "Open RTDB Table Button",
    "type": "BUTTON",
    "selector": "#btn-sidebar-open-rtdb",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_rtdb_section",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_architecture_mindmap",
    "label": "Architecture Mind Map Link",
    "type": "BUTTON",
    "selector": "#sidebar-btn-mindmap, a[href*=\"holistic-mind-map\"]",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_tools_section",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "sidebar_sub_portals",
    "label": "Sub-Portal Navigation Links",
    "type": "SECTION",
    "selector": "#sidebar-dedicated-portals, .sidebar-portal-nav",
    "category": "Global: Sidebar",
    "level": 1,
    "parent": "sidebar_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "sidebar_hierarchy_legend",
    "label": "Hierarchy Tier Legend Container",
    "type": "SECTION",
    "selector": "#hierarchy-legend-container",
    "category": "Global: Sidebar",
    "level": 1,
    "parent": "sidebar_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "sidebar_user_footer",
    "label": "Operator Profile & Session Footer",
    "type": "SECTION",
    "selector": ".sidebar-user-footer",
    "category": "Global: Sidebar",
    "level": 1,
    "parent": "sidebar_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "btn_sidebar_logout",
    "label": "Sidebar Logout Button",
    "type": "BUTTON",
    "selector": "#btn-sidebar-logout",
    "category": "Global: Sidebar",
    "level": 2,
    "parent": "sidebar_user_footer",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "drawers_modals_division",
    "label": "Global: Drawers & Modals Division",
    "type": "SCREEN",
    "selector": "body",
    "category": "Global: Drawers & Modals",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "sadhana_drawer",
    "label": "Sadhana Detail Drawer",
    "type": "DRAWER",
    "selector": "#sadhana-drawer",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "json_drawer",
    "label": "JSON Payload Drawer",
    "type": "DRAWER",
    "selector": "#json-drawer",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "pending_approval_drawer",
    "label": "Right Slide-Out Pending Approvals Drawer",
    "type": "DRAWER",
    "selector": "#pending-approval-drawer",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "tree_profile_drawer",
    "label": "Tree Profile Details Drawer",
    "type": "DRAWER",
    "selector": "#tree-profile-drawer",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "admin_settings_modal",
    "label": "Admin Settings Modal",
    "type": "MODAL",
    "selector": "#admin-settings-modal",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "rbac_matrix_modal",
    "label": "4-Tier RBAC Access Matrix Modal",
    "type": "MODAL",
    "selector": "#rbac-access-matrix-modal",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "modal_rtdb_inspector",
    "label": "Firebase RTDB Node Inspector Modal",
    "type": "MODAL",
    "selector": "#rtdb-node-inspector-modal",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "modal_rtdb_add_node",
    "label": "Firebase RTDB Add Node Modal",
    "type": "MODAL",
    "selector": "#rtdb-add-node-modal",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "import_modal",
    "label": "Import Mobile Profile JSON Modal",
    "type": "MODAL",
    "selector": "#import-modal",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "goli_gyan_modal",
    "label": "Goli Gyan Quick Wisdom Modal",
    "type": "MODAL",
    "selector": "#goli-gyan-modal",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "share_pairing_modal",
    "label": "Share & Pairing Invite Modal",
    "type": "MODAL",
    "selector": "#share-pairing-modal",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "create_profile_modal",
    "label": "Create Custom Profile Modal",
    "type": "MODAL",
    "selector": "#create-profile-modal",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "modal_mentor_decision_dialog",
    "label": "Mentor Decision Dialog Modal",
    "type": "MODAL",
    "selector": "#modal-mentor-decision-dialog",
    "category": "Global: Drawers & Modals",
    "level": 1,
    "parent": "drawers_modals_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "footer_division",
    "label": "Global: Footer Division",
    "type": "SCREEN",
    "selector": ".form-footer-actions, .admin-footer-bar",
    "category": "Global: Footer",
    "level": 0,
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "footer_save_status",
    "label": "Save Status Indicator",
    "type": "SECTION",
    "selector": "#save-status-indicator, .footer-left",
    "category": "Global: Footer",
    "level": 1,
    "parent": "footer_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "footer_form_actions",
    "label": "Footer Form Actions Section",
    "type": "SECTION",
    "selector": ".footer-right",
    "category": "Global: Footer",
    "level": 1,
    "parent": "footer_division",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  },
  {
    "id": "footer_delete_profile",
    "label": "Delete Profile Button",
    "type": "BUTTON",
    "selector": "#btn-delete-profile",
    "category": "Global: Footer",
    "level": 2,
    "parent": "footer_form_actions",
    "roles": {
      "MASTER": true,
      "HEALER": false,
      "TRAINEE": false,
      "DEVOTEE": false
    },
    "portals": {
      "masters": true,
      "healers": false,
      "trainee": false,
      "devotee": false,
      "seeker": false
    }
  },
  {
    "id": "footer_save_sync",
    "label": "Save & Sync Button",
    "type": "BUTTON",
    "selector": "#btn-save-profile, #profile-admin-form button[type=\"submit\"]",
    "category": "Global: Footer",
    "level": 2,
    "parent": "footer_form_actions",
    "roles": {
      "MASTER": true,
      "HEALER": true,
      "TRAINEE": true,
      "DEVOTEE": true
    },
    "portals": {
      "masters": true,
      "healers": true,
      "trainee": true,
      "devotee": true,
      "seeker": true
    }
  }
];
  }

  /**
   * Returns screen-wise counts of elements.
   */
  static getScreenCounts() {
    const counts = {};
    this.getMatrixDefinition().forEach(item => {
      const cat = item.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }

  /**
   * Returns the default auth matrix with role/portal visibility from the definition.
   * Standardized to the 4 canonical hierarchy levels: MASTER, HEALER, TRAINEE, DEVOTEE.
   * Seeker automatically mirrors Devotee permissions.
   */
  static getDefaultAuthMatrix() {
    return this.getMatrixDefinition().map(item => {
      const master = Boolean(item.roles && item.roles.MASTER !== false);
      const healer = Boolean(item.roles && item.roles.HEALER !== false);
      const trainee = Boolean(item.roles && item.roles.TRAINEE !== false);
      const devotee = Boolean(item.roles && item.roles.DEVOTEE !== false);
      const seeker = Boolean(item.roles && (item.roles.SEEKER !== undefined ? item.roles.SEEKER : item.roles.DEVOTEE) !== false);
      return {
        id: item.id,
        name: item.label,
        label: item.label,
        type: item.type,
        selector: item.selector,
        category: item.category,
        level: item.level !== undefined ? item.level : 0,
        parent: item.parent || null,
        roles: { MASTER: master, HEALER: healer, TRAINEE: trainee, DEVOTEE: devotee, SEEKER: seeker },
        MASTER: master,
        HEALER: healer,
        TRAINEE: trainee,
        DEVOTEE: devotee,
        SEEKER: seeker,
        portalVisible: { ...(item.portals || {}) }
      };
    });
  }

  static getStorageKey() {
    if (typeof window !== 'undefined' && window.appConfig && window.appConfig.authMatrixKey) {
      return window.appConfig.authMatrixKey;
    }
    return 'sk_auth_matrix_v5';
  }

  /**
   * Retrieves active Screen Auth Matrix merging persistent changes with canonical 3-level tree definitions.
   */
  static getAuthMatrix() {
    try {
      if (typeof localStorage !== 'undefined') {
        const currentKey = this.getStorageKey();
        let raw = localStorage.getItem(currentKey);
        
        // Automatic legacy migration from v4 to v5
        if (!raw) {
          const legacyV4 = localStorage.getItem('sk_screen_auth_matrix_v4');
          if (legacyV4) {
            raw = legacyV4;
            localStorage.setItem(currentKey, legacyV4);
            console.log('[ScreenAuthMatrix] Migrated legacy sk_screen_auth_matrix_v4 to', currentKey);
          }
        }

        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const storedMap = new Map();
            parsed.forEach(item => {
              if (item && item.id) storedMap.set(item.id, item);
            });
            const rbacConfig = (typeof localStorage !== 'undefined') ? JSON.parse(localStorage.getItem('sk_rbac_roles_config') || '{}') : {};
            const defaults = this.getDefaultAuthMatrix();
            const merged = defaults.map(def => {
              const s = storedMap.get(def.id);
              const rbac = rbacConfig[def.id] || {};
              
              // RBAC Settings directly set/unticked by user have highest precedence
              const master = rbac.MASTER !== undefined ? rbac.MASTER : (s && s.roles && s.roles.MASTER !== undefined ? s.roles.MASTER : (s && s.MASTER !== undefined ? s.MASTER : def.MASTER));
              const healer = rbac.HEALER !== undefined ? rbac.HEALER : (s && s.roles && s.roles.HEALER !== undefined ? s.roles.HEALER : (s && s.HEALER !== undefined ? s.HEALER : def.HEALER));
              const trainee = rbac.TRAINEE !== undefined ? rbac.TRAINEE : (s && s.roles && s.roles.TRAINEE !== undefined ? s.roles.TRAINEE : (s && s.TRAINEE !== undefined ? s.TRAINEE : def.TRAINEE));
              const devotee = rbac.DEVOTEE !== undefined ? rbac.DEVOTEE : (s && s.roles && s.roles.DEVOTEE !== undefined ? s.roles.DEVOTEE : (s && s.DEVOTEE !== undefined ? s.DEVOTEE : def.DEVOTEE));
              const seeker = rbac.SEEKER !== undefined ? rbac.SEEKER : (s && s.roles && s.roles.SEEKER !== undefined ? s.roles.SEEKER : (s && s.SEEKER !== undefined ? s.SEEKER : devotee));

              return {
                ...def,
                ...(s || {}),
                label: (s && s.label) || def.label,
                name: (s && s.name) || (s && s.label) || def.label,
                roles: { MASTER: master, HEALER: healer, TRAINEE: trainee, DEVOTEE: devotee, SEEKER: seeker },
                MASTER: master,
                HEALER: healer,
                TRAINEE: trainee,
                DEVOTEE: devotee,
                SEEKER: seeker,
                portalVisible: (s && s.portalVisible) ? { ...def.portalVisible, ...s.portalVisible } : def.portalVisible
              };
            });
            // Include user-added dynamic custom elements
            parsed.forEach(item => {
              if (item && item.id && item.isCustom && !defaults.some(d => d.id === item.id)) {
                merged.push(item);
              }
            });
            return merged;
          }
        }
      }
    } catch (e) {
      console.warn("ScreenAuthMatrix.getAuthMatrix parse error, returning defaults", e);
    }
    return this.getDefaultAuthMatrix();
  }

  /**
   * Saves updated Screen Auth Matrix and triggers real-time portal synchronization & cloud dual-write.
   */
  static saveAuthMatrix(matrix) {
    try {
      if (typeof localStorage !== 'undefined') {
        const key = this.getStorageKey();
        localStorage.setItem(key, JSON.stringify(matrix));
        localStorage.setItem('sk_last_write_ts', String(Date.now()));

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sk-auth-matrix-updated', { detail: { matrix } }));
          
          // Realtime multi-portal broadcast
          try {
            if (typeof BroadcastChannel !== 'undefined') {
              const bc = new BroadcastChannel('sk_matrix_channel');
              bc.postMessage({ type: 'AUTH_MATRIX_UPDATED', matrix, timestamp: Date.now() });
              bc.close();
            }
          } catch (e) {}

          // Dual-write to cloud sync engine if active
          try {
            if (window.FirebaseSyncEngine && typeof window.FirebaseSyncEngine.syncAuthMatrix === 'function') {
              window.FirebaseSyncEngine.syncAuthMatrix(matrix);
            }
          } catch (e) {}
        }
        return true;
      }
    } catch (e) {
      console.error("ScreenAuthMatrix.saveAuthMatrix error", e);
    }
    return false;
  }

  /**
   * Adds or updates an element in the auth matrix.
   */
  static addElement(elementData) {
    if (!elementData || !elementData.id) return false;
    const matrix = this.getAuthMatrix();
    const existingIdx = matrix.findIndex(e => e.id === elementData.id);
    const item = {
      id: elementData.id,
      name: elementData.label || elementData.name || elementData.id,
      label: elementData.label || elementData.name || elementData.id,
      type: elementData.type || 'CONTROL',
      selector: elementData.selector || `#${elementData.id}`,
      category: elementData.category || 'Tab 1: Devotee Personal',
      level: elementData.level !== undefined ? elementData.level : 2,
      parent: elementData.parent || null,
      isCustom: true,
      MASTER: elementData.MASTER !== undefined ? elementData.MASTER : true,
      HEALER: elementData.HEALER !== undefined ? elementData.HEALER : false,
      TRAINEE: elementData.TRAINEE !== undefined ? elementData.TRAINEE : false,
      DEVOTEE: elementData.DEVOTEE !== undefined ? elementData.DEVOTEE : false,
      SEEKER: elementData.SEEKER !== undefined ? elementData.SEEKER : false,
      portalVisible: elementData.portalVisible || {
        masters: true,
        healers: false,
        trainee: false,
        devotee: false,
        seeker: false
      }
    };
    if (existingIdx >= 0) {
      matrix[existingIdx] = { ...matrix[existingIdx], ...item };
    } else {
      matrix.push(item);
    }
    return this.saveAuthMatrix(matrix);
  }

  /**
   * Deletes an element from the matrix.
   */
  static deleteElement(elementId) {
    let matrix = this.getAuthMatrix();
    const initialLen = matrix.length;
    matrix = matrix.filter(e => e.id !== elementId);
    if (matrix.length !== initialLen) {
      return this.saveAuthMatrix(matrix);
    }
    return false;
  }

  /**
   * Applies matrix permissions to DOM elements based on role.
   */
  static applyToDOM(currentRole) {
    if (typeof document === 'undefined') return;
    const role = this.resolveRole(currentRole);
    const matrix = this.getAuthMatrix();
    matrix.forEach(item => {
      if (!item.selector) return;
      const allowed = Boolean(item[role]);
      try {
        const els = document.querySelectorAll(item.selector);
        els.forEach(el => {
          if (allowed) {
            el.classList.remove('sk-auth-hidden');
            if (el.dataset.authHiddenByMatrix === 'true') {
              el.style.display = '';
              delete el.dataset.authHiddenByMatrix;
            }
          } else {
            el.classList.add('sk-auth-hidden');
            el.dataset.authHiddenByMatrix = 'true';
            el.style.setProperty('display', 'none', 'important');
          }
        });
      } catch (e) {}
    });
  }

  /**
   * Returns unique category names in order with their element counts.
   */
  static getCategoriesWithCounts() {
    const counts = this.getScreenCounts();
    const cats = [];
    this.getMatrixDefinition().forEach(item => {
      if (!cats.some(c => c.name === item.category)) {
        cats.push({ name: item.category, count: counts[item.category] || 0 });
      }
    });
    return cats;
  }

  /**
   * Returns unique category names in order.
   */
  static getCategories() {
    return this.getCategoriesWithCounts().map(c => c.name);
  }

  /**
   * Resolves normalized role string across all 4 operational levels.
   */
  static resolveRole(role) {
    const r = (role || 'DEVOTEE').toUpperCase();
    if (r === 'ADMIN' || r === 'MASTER') return 'MASTER';
    if (r === 'HEALER') return 'HEALER';
    if (r === 'TRAINEE' || r === 'SADHAK') return 'TRAINEE';
    if (r === 'SEEKER') return 'DEVOTEE';
    return 'DEVOTEE';
  }

  /**
   * Filters profile list based on role isolation requirements.
   */
  static filterProfilesForRole(profiles, role) {
    const resolved = this.resolveRole(role);
    if (!Array.isArray(profiles)) return [];
    if (resolved === 'MASTER') return profiles;

    if (resolved === 'HEALER') {
      return profiles.filter(p => p.level !== 0 && p.profileType !== 'ADMIN');
    }

    if (resolved === 'DEVOTEE') {
      return profiles.filter(p => p.profileType === 'DEVOTEE' || p.profileType === 'SEEKER');
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
    return Boolean(def.roles && (def.roles[resolved] !== undefined ? def.roles[resolved] : def.roles['DEVOTEE']));
  }

  /**
   * Returns canonical array of accessible tab element IDs for the given role.
   */
  static getAllowedTabsForRole(role) {
    const resolved = this.resolveRole(role);
    const tabs = [
      { id: 'tab-devotee-personal', authId: 'tab_devotee_personal' },
      { id: 'tab-seeker-purpose', authId: 'tab_seeker_purpose' },
      { id: 'tab-trainee-sadhak', authId: 'tab_trainee_sadhak' },
      { id: 'tab-healer-connect', authId: 'tab_healer_connect' },
      { id: 'tab-genealogy-tree', authId: 'tab_genealogy_tree' },
      { id: 'tab-firebase-data', authId: 'tab_firebase_data' }
    ];
    return tabs.filter(t => this.canAccessElement(t.authId, resolved)).map(t => t.id);
  }

  /**
   * Checks if a form input field should be read-only / disabled for the given role.
   */
  static isFieldReadOnly(role, fieldId) {
    const resolved = this.resolveRole(role);
    if (resolved === 'MASTER') return false;
    const readOnlyFieldsForNonMaster = [
      'input-ref-code',
      'input-sponsor-code',
      'input-level',
      'input-profile-type',
      'select-profile-type',
      'input-phone'
    ];
    if (resolved === 'DEVOTEE') {
      return readOnlyFieldsForNonMaster.includes(fieldId) || fieldId.includes('level') || fieldId.includes('code');
    }
    if (resolved === 'TRAINEE') {
      return ['input-ref-code', 'input-level', 'input-profile-type'].includes(fieldId);
    }
    return false;
  }
}

// Export for use in both browser and Node.js contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScreenAuthMatrix;
}
if (typeof window !== 'undefined') {
  window.ScreenAuthMatrix = ScreenAuthMatrix;
}
