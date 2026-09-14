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
