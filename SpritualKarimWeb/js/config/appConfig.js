// js/config/appConfig.js — Centralized configuration for Spiritual Karim Sansthan
// ⚠️ SINGLE SOURCE OF TRUTH — All modules must reference this. Never hardcode values.
/**
 * ⚠️ SECURITY: Firebase credentials should be moved to environment
 * variables or server-side config before production deployment.
 */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy_SpiritualKarim_Enterprise_Key",
  authDomain: "spritualkarim-7b5fd.firebaseapp.com",
  databaseURL: "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com",
  projectId: "spritualkarim-7b5fd",
  storageBucket: "spritualkarim-7b5fd.appspot.com",
  messagingSenderId: "389274194021",
  appId: "1:389274194021:web:9c847a29e1a8b3e"
};

const root = (typeof window !== "undefined") ? window : (typeof global !== "undefined" ? global : globalThis);

root.appConfig = Object.assign(root.appConfig || {}, {
  // ── App Identity ────────────────────────────────────────────────
  appName: "Spiritual Karim Admin",
  appVersion: "3.0.0",
  orgName: "Shree Spritual Karim Sansthan",

  // ── Firebase Realtime Database ───────────────────────────────────
  firebaseUrl: 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/',
  firebaseProjectId: 'spritualkarim-7b5fd',
  firebase: FIREBASE_CONFIG, // ⚠️ Move to env vars before production

  // ── LocalStorage Key Constants (single source — never hardcode) ──
  storageKey: 'sk_admin_profiles_v3',
  activeProfileIdKey: 'sk_admin_active_profile_id_v3',
  settingsKey: 'sk_admin_system_settings_v1',
  roleModeKey: 'sk_admin_active_role_mode_v1',
  authMatrixKey: 'sk_auth_matrix_v5',
  pairingInvitesKey: 'sk_pairing_invites',
  themeKey: 'sk_theme_preference',

  // ── Data Guard ───────────────────────────────────────────────────
  // Minimum profiles required to trust localStorage data (prevents empty-store crashes)
  minProfileCount: 1,

  // ── Organization Defaults ────────────────────────────────────────
  defaultMentorName: 'Spiritual Karim Khan (Founder)',
  defaultMentorCode: 'SKHM-ADM1-7788-9900',
  rootSponsorCode: 'ROOT-0000-0000-0000',
  defaultRoleMode: 'MASTER',
  defaultPortalRole: 'MASTER',
  defaultInductionRole: 'DEVOTEE',

  // ── External Links & Resources ───────────────────────────────────
  githubApkUrl: 'https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk',
  githubRepoUrl: 'https://github.com/jDroid-X/SpritualKarim',
  webPortalUrl: 'https://jdroid-x.github.io/SpritualKarim/',
  telegramBotHandle: 'SpiritualKarimBot',
  telegramBotUrl: 'https://t.me/SpiritualKarimBot',
  notebookLmPortalUrl: 'https://notebooklm.google.com',

  // ── Business Rules ───────────────────────────────────────────────
  pairingInviteTimeoutHours: 24,
  pairingInviteMaxPerMentor: 5,
  resendCooldownSeconds: [60, 180, 600],
  uplineApprovalTimeoutHours: 24,
  cleanMinApprovalPercent: 75,
  defaultTargetMalas: '11 Malas Daily',
  defaultJapaTargetCount: 108,
  defaultSadhanaStreak: '1 Day',
  threeDiyaEveningWindow: '06:15 PM – 07:07 PM',
  maxUploadSizeBytes: 5242880,   // 5.0 MB ceiling
  otpCooldownSeconds: 60,
  otpMaxAttempts: 3,
  minDevoteeAge: 18,
  maxPendingInvitesPerMentor: 5,
  inviteExpiryHours: 24,
  maxInviteResubmits: 3,

  // ── Session Management ───────────────────────────────────────────
  sessionTimeoutMs: 30 * 60 * 1000,  // 30 minutes
  sessionWarnMs: 25 * 60 * 1000,     // Warn at 25 min
  powerLossCheckIntervalMs: 15000,    // 15 seconds

  // ── Feature Flags ────────────────────────────────────────────────
  allowDevoteeDelete: false,
  devoteeCanEditLineage: true,
  devoteeCanEnroll: true,
  healerStrictTeam: true,
  healerCanCertify: true,
  healerCanDeleteTeam: true,
  healerCanViewEntireTeam: true,
  enableLiveSync: true,
  dataMinimizationEnabled: true,
  autoSaveMode: 'INSTANT',
  autoCloudSync: true,
  directoryLayout: 'GRID',
  showProfileBox2: false,
  speechLang: 'en-US',

  // ── UI Copy ──────────────────────────────────────────────────────
  copyrightMarqueeText: '© 2024-2026 Shree Spritual Karim Sansthan • All Sacred Lineage Rights Reserved • Certified ISO/IEC 27001 Secure Node Telemetry • Guided under the divine vision of Spiritual Karim Khan • Real-time Lineage Synchronization Active',
});

var appConfig = root.appConfig;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = root.appConfig;
}
