/**
 * FirebaseSyncEngine.js
 * Bi-Directional Cloud Synchronization with Firebase Realtime Database
 */

class FirebaseSyncEngine {
  static init() {
    this.config = {
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
        console.log("🔥 [Firebase RTDB] Initialized with Data Minimization Mode (Project: spritualkarim-7b5fd)");
        this.listenToOnlineNodes();
      } catch (err) {
        console.warn("Firebase RTDB init notice:", err.message);
      }
    }
  }

  /**
   * Publishes strictly pseudonymized node data to Firebase Realtime Database.
   * Strips all private contact info, real names, and ancestral tree details.
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
      
      // Log telemetry event
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
        console.log("🔥 [Firebase Live Active Nodes]:", Object.keys(data).length, "devices online.");
      }
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FirebaseSyncEngine };
}
