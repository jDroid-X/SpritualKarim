// Bootstrap - Load appConfig first, then initialize MVC
if (typeof appConfig === "undefined") {
  console.error("[BOOTSTRAP] appConfig.js not loaded!");
}

// Note: FirebaseSyncEngine is defined in js/models/FirebaseSyncEngine.js
// This file only handles MVC initialization to avoid duplicate class definition

// Polyfill guards for international browser compatibility & headless testing
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() { return false; }
    };
  };
}

// Dynamic Portal Role Detection (DRY - Single Source of Truth)
function detectAndApplyPortalRole() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  try {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const paramRole = params.get("role") || params.get("portal");

    let detectedRole = null;
    let badgeClass = "badge-admin";
    let badgeText = "👑 MASTER FOUNDER";
    let portalTitle = "Master Admin Portal";

    const session = typeof DemoAuth !== "undefined" && DemoAuth.getSession ? DemoAuth.getSession() : null;
    const roleRanks = { MASTER: 1, ADMIN: 1, HEALER: 2, TRAINEE: 3, DEVOTEE: 4, SEEKER: 4 };

    if (paramRole) {
      const candidate = paramRole.toUpperCase();
      if (session && session.role) {
        const sessionRank = roleRanks[session.role.toUpperCase()] || 4;
        const candidateRank = roleRanks[candidate] || 4;
        if (candidateRank < sessionRank) {
          console.warn(`[BOOTSTRAP] Blocked privilege escalation via URL to ${candidate}. Enforcing ${session.role.toUpperCase()}.`);
          detectedRole = session.role.toUpperCase();
        } else {
          detectedRole = candidate;
        }
      } else {
        detectedRole = candidate;
      }
    } else if (path.includes("/masters/")) {
      detectedRole = "ADMIN";
    } else if (path.includes("/healers/")) {
      detectedRole = "HEALER";
    } else if (path.includes("/trainee/")) {
      detectedRole = "TRAINEE";
    } else if (path.includes("/devotee/") || path.includes("/seeker/")) {
      detectedRole = "DEVOTEE";
    } else if (document.body && document.body.getAttribute("data-portal-role")) {
      detectedRole = document.body.getAttribute("data-portal-role").toUpperCase();
    } else {
      detectedRole = "ADMIN";
    }

    if (detectedRole === "ADMIN" || detectedRole === "MASTER") {
      badgeClass = "badge-admin";
      badgeText = "👑 MASTER FOUNDER";
      portalTitle = "Master Admin Portal";
    } else if (detectedRole === "HEALER") {
      badgeClass = "badge-healer";
      badgeText = "🛡️ CERTIFIED HEALER";
      portalTitle = "Healers Portal";
    } else if (detectedRole === "TRAINEE") {
      badgeClass = "badge-trainee";
      badgeText = "📿 TRAINEE SADHAK";
      portalTitle = "Trainee Sadhak Portal";
    } else if (detectedRole === "DEVOTEE" || detectedRole === "SEEKER") {
      badgeClass = "badge-devotee";
      badgeText = "🌟 DEVOTEE / SEEKER";
      portalTitle = "Devotee Portal";
    }

    if (detectedRole && document.body) {
      if (!document.body.getAttribute("data-portal-role")) {
        document.body.setAttribute("data-portal-role", detectedRole);
        document.body.classList.add(`portal-${detectedRole.toLowerCase()}`);
      }
      const badgeEl = document.querySelector(".header-portal-badge");
      if (badgeEl && !badgeEl.textContent.trim()) {
        badgeEl.className = `header-portal-badge ${badgeClass}`;
        badgeEl.textContent = badgeText;
      }
      if (portalTitle && !document.title.includes(portalTitle)) {
        document.title = `${portalTitle} • Shree Spritual Karim Sansthan`;
      }
    }
  } catch (e) {
    console.warn("[BOOTSTRAP] Portal auto-detection notice:", e.message);
  }
}

// Bootstrap MVC
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    detectAndApplyPortalRole();

    if (window.__skAppInitialized) return;
    window.__skAppInitialized = true;

    try {
      // Auth gate check if strict auth is enforced in appConfig
      if (typeof appConfig !== "undefined" && appConfig.requireAuth) {
        if (typeof DemoAuth !== "undefined" && DemoAuth.requireAuth) {
          const isInSub = /\/(Masters|Healers|Trainee|Devotee|Seeker|Public)\//i.test(window.location.pathname);
          if (!DemoAuth.requireAuth(isInSub ? "../login.html" : "login.html")) return;
        }
      } else if (typeof DemoAuth !== "undefined" && DemoAuth.getSession) {
        const session = DemoAuth.getSession();
        if (!session) {
          console.warn("[SK Admin] No active authenticated session; operating in guest/least-privilege mode.");
        } else {
          console.log(`[SK Admin] Authenticated session active: ${session.username} (${session.role})`);
        }
      }

      const model = new ProfileModel();
      const view = new ProfileView();
      const controller = new ProfileController(model, view);
      window.ProfileControllerInstance = controller;
      window.profileView = view;
      window.profileModel = model;
      
      if (typeof window.SadhanaRemedyModel !== 'undefined') {
        const srModel = new window.SadhanaRemedyModel(model);
        const srController = new window.SadhanaRemedyController(srModel, null);
        const srView = new window.SadhanaRemedyView(srController);
        srController.view = srView;
        window.sadhanaRemedyController = srController;
      }
      
      controller.init();
      if (typeof FirebaseSyncEngine !== "undefined" && FirebaseSyncEngine.init) {
        FirebaseSyncEngine.init();
      }
      console.log("[SK Admin] MVC initialized with appConfig");
    } catch (e) {
      console.error("[SK Admin] Init failed:", e);
    }
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { detectAndApplyPortalRole };
}
