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

  saveLocalData(data) {
    try {
      const dir = path.dirname(this.localCachePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.localCachePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('Error saving local cache', e);
      return false;
    }
  }

  getAuthMatrix() {
    const data = this.getLocalData();
    return data.auth_matrix || null;
  }

  saveAuthMatrix(matrix) {
    const data = this.getLocalData();
    data.auth_matrix = matrix;
    data.last_matrix_update = Date.now();
    return this.saveLocalData(data);
  }

  saveProfiles(profiles) {
    const data = this.getLocalData();
    if (Array.isArray(profiles)) {
      const pObj = {};
      profiles.forEach(p => { if (p.id) pObj[p.id] = p; });
      data.profiles = pObj;
    } else {
      data.profiles = profiles;
    }
    return this.saveLocalData(data);
  }

  savePairingInvites(invites) {
    const data = this.getLocalData();
    data.pairing_invites = invites;
    return this.saveLocalData(data);
  }

  deletePairingInvite(inviteId) {
    const data = this.getLocalData();
    if (Array.isArray(data.pairing_invites)) {
      data.pairing_invites = data.pairing_invites.filter(i => i.id !== inviteId);
    } else if (typeof data.pairing_invites === 'object' && data.pairing_invites) {
      delete data.pairing_invites[inviteId];
    }
    return this.saveLocalData(data);
  }

  getSystemConfig() {
    const data = this.getLocalData();
    return data.system_config || {
      appName: "Shree Spritual Karim Sansthan",
      orgName: "Sacred Karim Lineage Trust",
      defaultMentorName: "Spiritual Karim Khan (Founder)",
      defaultMentorCode: "SKHM-ADM1-7788-9900",
      telegramBotHandle: "SpiritualKarimBot",
      uplineApprovalTimeoutHours: 24,
      maxPendingInvitesPerMentor: 5,
      inviteExpiryHours: 24,
      cleanMinApprovalPercent: 75,
      defaultTargetMalas: 11,
      autoCloudSync: true
    };
  }

  saveSystemConfig(config) {
    const data = this.getLocalData();
    data.system_config = Object.assign({}, data.system_config || {}, config);
    return this.saveLocalData(data);
  }

  getDeviceTelemetry() {
    const data = this.getLocalData();
    return data.device_telemetry || {};
  }

  saveDeviceTelemetry(telemetryData) {
    const data = this.getLocalData();
    data.device_telemetry = Object.assign({}, data.device_telemetry || {}, telemetryData);
    return this.saveLocalData(data);
  }

  getAuditLogs() {
    const data = this.getLocalData();
    return data.audit_logs || [];
  }

  getComponentStates() {
    const data = this.getLocalData();
    return data.component_states || {};
  }

  saveComponentStates(states) {
    const data = this.getLocalData();
    data.component_states = Object.assign({}, data.component_states || {}, states);
    data.last_component_state_update = Date.now();
    this.saveLocalData(data);
    return data.component_states;
  }

  appendAuditLog(entry) {
    const data = this.getLocalData();
    if (!Array.isArray(data.audit_logs)) data.audit_logs = [];
    const logItem = Object.assign({
      id: "log-" + Date.now().toString(36),
      timestamp: Date.now(),
      isoTime: new Date().toISOString()
    }, entry);
    data.audit_logs.unshift(logItem);
    if (data.audit_logs.length > 500) data.audit_logs = data.audit_logs.slice(0, 500);
    this.saveLocalData(data);
    return logItem;
  }
}

module.exports = FirebaseService;
