/**
 * FirebaseSyncEngine - Centralized Firebase integration
 * Uses centralized config from appConfig.js
 */

class FirebaseSyncEngine {
  static init() {
    // Use centralized config from appConfig
    const cfg = (typeof window !== 'undefined' && window.appConfig && window.appConfig.firebase)
      ? window.appConfig.firebase
      : (typeof appConfig !== 'undefined' && appConfig.firebase ? appConfig.firebase : null);

    this.config = cfg || {
      apiKey: "AIzaSy_SpiritualKarim_Enterprise_Key",
      authDomain: "spritualkarim-7b5fd.firebaseapp.com",
      databaseURL: "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com",
      projectId: "spritualkarim-7b5fd",
      storageBucket: "spritualkarim-7b5fd.appspot.com",
      messagingSenderId: "389274194021",
      appId: "1:389274194021:web:9c847a29e1a8b3e"
    };

    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      try {
        firebase.initializeApp(this.config);
        this.db = firebase.database();
        console.log("[Firebase RTDB] Initialized with Data Minimization Mode");
        this.listenToOnlineNodes();
        this.listenToSadhanaCatalog();
      } catch (err) {
        console.warn("Firebase RTDB init notice:", err.message);
      }
    }
  }

  static writeNode(path, data) {
    if (!this.db || !path) return;
    try {
      this.db.ref(path).set(data);
    } catch (e) {
      console.warn("Firebase write error for path " + path, e);
    }
  }

  static pushNode(path, data) {
    this.writeNode(path, data);
  }

  static listenToSadhanaCatalog() {
    if (!this.db) return;
    this.db.ref('sadhana_catalog').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        try {
          localStorage.setItem("sk_sadhana_catalog_v1", JSON.stringify(data));
          // Optionally trigger a UI re-render event here
          if (typeof BroadcastChannel !== "undefined") {
             const bc = new BroadcastChannel("spiritual_karim_sync");
             bc.postMessage({ type: "SADHANA_CATALOG_UPDATED", data });
          }
        } catch(e) {
          console.error("Error updating local sadhana catalog from Firebase:", e);
        }
      }
    });
  }

  /**
   * Publishes strictly pseudonymized node data to Firebase
   */
  static publishMinimalNodeStatus(profile) {
    if (!this.db || !profile) return;
    try {
      const sanitizedCode = (profile.referenceCode || 'NODE_UNKNOWN').replace(/[^a-zA-Z0-9_-]/g, '_');
      const minimalPayload = {
        nodeId: sanitizedCode,
        sponsorId: (profile.referredByCode || 'ROOT').replace(/[^a-zA-Z0-9_-]/g, '_'),
        role: profile.profileType || 'DEVOTEE',
        level: profile.level || 1,
        status: profile.isActive !== false ? 'ACTIVE' : 'INACTIVE',
        lastSeenTimestamp: firebase.database.ServerValue.TIMESTAMP,
        isoTime: new Date().toISOString()
      };

      this.db.ref('authorisedNodes/' + sanitizedCode).set(minimalPayload);
      
      this.db.ref('logs').push().set({
        action: 'NODE_STATUS_UPDATE',
        nodeId: sanitizedCode,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
    } catch (e) {
      console.warn("Failed to publish minimal node status to Firebase:", e);
    }
  }

  static listenToOnlineNodes() {
    if (!this.db) return;
    this.db.ref('authorisedNodes').limitToLast(20).on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("[Firebase Live Active Nodes]:", Object.keys(data).length, "devices online.");
      }
    });
  }
}

const rootSync = (typeof window !== "undefined") ? window : (typeof global !== "undefined" ? global : {});
rootSync.FirebaseSyncEngine = FirebaseSyncEngine;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseSyncEngine;
}
