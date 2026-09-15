// Bootstrap - Load appConfig first, then initialize MVC
if (typeof appConfig === "undefined") {
  console.error("[BOOTSTRAP] appConfig.js not loaded!");
}

// Note: FirebaseSyncEngine is defined in js/models/FirebaseSyncEngine.js
// This file only handles MVC initialization to avoid duplicate class definition

// Bootstrap MVC
document.addEventListener("DOMContentLoaded", () => {
  if (window.__skAppInitialized) return;
  window.__skAppInitialized = true;

  try {
    // Auth gate check if strict auth is enforced in appConfig
    if (typeof appConfig !== "undefined" && appConfig.requireAuth) {
      if (typeof DemoAuth !== "undefined" && DemoAuth.requireAuth) {
        if (!DemoAuth.requireAuth("login.html")) return;
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
    controller.init();
    FirebaseSyncEngine.init();
    console.log("[SK Admin] MVC initialized with appConfig");
  } catch (e) {
    console.error("[SK Admin] Init failed:", e);
  }
});
