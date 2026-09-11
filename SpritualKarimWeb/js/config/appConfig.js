// js/config/appConfig.js — Centralized configuration for Spiritual Karim Sansthan
/**
 * ⚠️ SECURITY: Firebase credentials below should be moved to environment
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

window.appConfig = Object.assign(window.appConfig || {}, {
  // Firebase Realtime Database
  firebaseUrl: 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/',
  firebaseProjectId: 'spritualkarim-7b5fd',
  firebase: FIREBASE_CONFIG, // ⚠️ Move to env vars before production

  // Organization Defaults
  defaultMentorName: 'Karim Ji (Founder)',
  defaultMentorCode: 'SKHM-ADM1-7788-9900',
  rootSponsorCode: 'ROOT-0000-0000-0000',

  // External Links & Resources
  githubApkUrl: 'https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk',
  githubRepoUrl: 'https://github.com/jDroid-X/SpritualKarim',
  webPortalUrl: 'https://jdroid-x.github.io/SpritualKarim/',
  telegramBotHandle: 'SpiritualKarimBot',
  telegramBotUrl: 'https://t.me/SpiritualKarimBot',
  notebookLmPortalUrl: 'https://notebooklm.google.com',

  // Business Rules
  pairingInviteTimeoutHours: 24,
  pairingInviteMaxPerMentor: 5,
  resendCooldownSeconds: [60, 180, 600],
  uplineApprovalTimeoutHours: 24,
  cleanMinApprovalPercent: 75,
  defaultTargetMalas: '11 Malas Daily',
  defaultJapaTargetCount: 108,
  defaultSadhanaStreak: '1 Day',
  threeDiyaEveningWindow: '06:15 PM – 07:07 PM',
  maxUploadSizeBytes: 5242880, // 5.0 MB ceiling
  otpCooldownSeconds: 60,
  otpMaxAttempts: 3,

  // Feature Flags
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
  defaultRoleMode: 'MASTER',
  speechLang: 'en-US'
});

var appConfig = window.appConfig;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.appConfig;
}
