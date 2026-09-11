/**
 * Backend/services/FirebaseService.js
 * Firebase Realtime Database Interface & Seed Sync
 * Shree Spritual Karim Sansthan
 */

const fs = require('fs');
const path = require('path');

class FirebaseService {
  constructor(config = {}) {
    this.databaseUrl = config.databaseUrl || 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com';
    this.projectId = config.projectId || 'spritualkarim-7b5fd';
    this.localCachePath = path.join(__dirname, '..', 'database', 'seeds', 'default_seed.json');
  }

  getLocalData() {
    try {
      if (fs.existsSync(this.localCachePath)) {
        return JSON.parse(fs.readFileSync(this.localCachePath, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading local cache', e);
    }
    return {};
  }

  getProfiles() {
    const data = this.getLocalData();
    return Object.values(data.profiles || {});
  }

  getSadhanaCatalog() {
    const data = this.getLocalData();
    return data.sadhana_catalog || {};
  }

  getPairingInvites() {
    const data = this.getLocalData();
    return data.pairing_invites || {};
  }

  getSystemConfig() {
    const data = this.getLocalData();
    return data.system_config || {};
  }
}

module.exports = FirebaseService;
