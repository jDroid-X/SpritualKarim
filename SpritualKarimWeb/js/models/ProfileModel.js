/**
 * ProfileModel.js
 * OOPS MVC Model Layer: Reactive State Management, Lineage Tree Math, & CRUD
 */

class ProfileModel {
  constructor() {
    this.storageKey = 'sk_admin_profiles_database_v2';
    this.activeIdKey = 'sk_admin_active_profile_id_v2';
    this.settingsKey = 'sk_admin_system_settings_v1';
    this.roleModeKey = 'sk_admin_active_role_mode_v1';

    // Determine initial roleMode from URL query, pathname, body tag, or localStorage
    let detectedRole = 'MASTER';
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      const pathName = window.location.pathname.toLowerCase();
      const portalModeTag = document.body.getAttribute('data-portal-mode');

      if (roleParam) {
        const rp = roleParam.toUpperCase();
        if (['ADMIN', 'MASTER'].includes(rp)) detectedRole = 'MASTER';
        else if (['HEALER', 'HEALERS'].includes(rp)) detectedRole = 'HEALER';
        else if (['TRAINEE', 'SADHAK'].includes(rp)) detectedRole = 'TRAINEE';
        else if (['DEVOTEE', 'SEEKER'].includes(rp)) detectedRole = 'DEVOTEE';
      } else if (pathName.includes('/masters')) {
        detectedRole = 'MASTER';
      } else if (pathName.includes('/healers')) {
        detectedRole = 'HEALER';
      } else if (pathName.includes('/trainee')) {
        detectedRole = 'TRAINEE';
      } else if (pathName.includes('/devotee')) {
        detectedRole = 'DEVOTEE';
      } else if (portalModeTag) {
        detectedRole = portalModeTag.toUpperCase();
      } else {
        detectedRole = localStorage.getItem(this.roleModeKey) || 'MASTER';
      }
    } catch (e) {
      detectedRole = 'MASTER';
    }
    this.roleMode = detectedRole;

    this.settings = this._loadSettings();
    this.profiles = this._loadProfiles();
    this.activeProfileId = this._loadActiveId();
  }

  _loadSettings() {
    try {
      const data = localStorage.getItem(this.settingsKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading settings', e);
    }
    return {
      appName: 'Spiritual Karim Admin',
      orgName: 'Shree Spritual Karim Sansthan',
      firebaseUrl: 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/',
      defaultMentorName: 'Karim Ji (Founder)',
      defaultMentorCode: 'SKHM-ADM1-7788-9900',
      defaultTargetMalas: '11 Malas Daily',
      defaultSadhanaStreak: '1 Day',
      allowDevoteeDelete: false,
      healerCanDeleteTeam: true,
      githubApkUrl: 'https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk'
    };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save settings', e);
    }
  }

  getRoleMode() {
    return this.roleMode;
  }

  setRoleMode(mode) {
    this.roleMode = mode.toUpperCase();
    localStorage.setItem(this.roleModeKey, this.roleMode);

    const active = this.getActiveProfile();
    if (this.roleMode === 'DEVOTEE' && active?.profileType !== 'DEVOTEE') {
      const devoteeProf = this.profiles.find(p => p.profileType === 'DEVOTEE');
      if (devoteeProf) this.setActiveProfileId(devoteeProf.id);
    } else if (this.roleMode === 'TRAINEE' && active?.profileType !== 'TRAINEE') {
      const traineeProf = this.profiles.find(p => p.profileType === 'TRAINEE' || p.level === 4);
      if (traineeProf) this.setActiveProfileId(traineeProf.id);
    } else if (this.roleMode === 'HEALER' && active?.profileType !== 'HEALER') {
      const healerProf = this.profiles.find(p => p.profileType === 'HEALER');
      if (healerProf) this.setActiveProfileId(healerProf.id);
    } else if (this.roleMode === 'MASTER' && active?.profileType !== 'ADMIN') {
      const adminProf = this.profiles.find(p => p.profileType === 'ADMIN');
      if (adminProf) this.setActiveProfileId(adminProf.id);
    }
  }

  getVisibleProfiles() {
    if (this.roleMode === 'MASTER') {
      return this.profiles;
    }
    if (this.roleMode === 'HEALER') {
      return this.profiles.filter(p => p.profileType !== 'ADMIN' && p.level !== 1);
    }
    if (this.roleMode === 'TRAINEE') {
      return this.profiles.filter(p => p.profileType === 'TRAINEE' || p.profileType === 'DEVOTEE');
    }
    if (this.roleMode === 'DEVOTEE') {
      const active = this.getActiveProfile();
      const devotees = this.profiles.filter(p => p.id === active?.id || p.profileType === 'DEVOTEE');
      return devotees.length > 0 ? devotees : [active];
    }
    return this.profiles;
  }

  getScopedProfiles(roleMode = null, activeProfile = null) {
    const role = roleMode || this.getRoleMode();
    const active = activeProfile || this.getActiveProfile();
    if (!active) return this.profiles;

    if (role === 'MASTER' || role === 'ADMIN') {
      // Top can see all profiles across the organization
      return this.profiles;
    }

    if (role === 'HEALER') {
      // Healer sees self + upline sponsor + all downlines below them. Cannot see Level 1 Founder Master or parallel healers.
      const refCode = active.referenceCode || '';
      const downlineCodes = new Set([refCode]);
      let added = true;
      while (added) {
        added = false;
        for (const p of this.profiles) {
          if (p.referredByCode && downlineCodes.has(p.referredByCode) && !downlineCodes.has(p.referenceCode)) {
            downlineCodes.add(p.referenceCode);
            added = true;
          }
        }
      }
      const sponsor = this.profiles.find(p => p.referenceCode === active.referredByCode && p.profileType !== 'ADMIN');
      return this.profiles.filter(p => p.id === active.id || downlineCodes.has(p.referenceCode) || (sponsor && p.id === sponsor.id));
    }

    if (role === 'TRAINEE') {
      // Trainee sees self + direct upline mentor + all devotee downlines below them.
      const refCode = active.referenceCode || '';
      const downlineCodes = new Set([refCode]);
      for (const p of this.profiles) {
        if (p.referredByCode === refCode) {
          downlineCodes.add(p.referenceCode);
        }
      }
      const sponsor = this.profiles.find(p => p.referenceCode === active.referredByCode && p.profileType !== 'ADMIN');
      return this.profiles.filter(p => p.id === active.id || downlineCodes.has(p.referenceCode) || (sponsor && p.id === sponsor.id));
    }

    if (role === 'DEVOTEE') {
      // Devotee can ONLY see self + direct connected upline mentor (sponsor). Cannot see global upper levels.
      const sponsor = this.profiles.find(p => p.referenceCode === active.referredByCode && p.profileType !== 'ADMIN');
      const downlines = this.profiles.filter(p => p.referredByCode === active.referenceCode);
      return this.profiles.filter(p => p.id === active.id || (sponsor && p.id === sponsor.id) || downlines.some(d => d.id === p.id));
    }

  }

    } catch (e) {
      this._enqueueOfflineSync('PROFILE_PUT', { key: nodeKey, profile });
    }
  }

  // -------------------------------------------------------------
  // FIREBASE REALTIME DATABASE TREE & DATA PROVIDER METHODS
  // -------------------------------------------------------------
  getFirebaseRealtimeTree() {
    const profilesMap = {};
    const authorisedNodesMap = {};
    const telemetryMap = {};

    const calculateDescendants = (refCode) => {
      const descendants = [];
      const queue = [refCode];
      const visited = new Set([refCode]);
      while (queue.length > 0) {
        const currentCode = queue.shift();
        const children = this.profiles.filter(p => p.referredByCode === currentCode);
        for (const child of children) {
          if (!visited.has(child.referenceCode)) {
            visited.add(child.referenceCode);
            descendants.push(child.referenceCode);
            queue.push(child.referenceCode);
          }
        }
      }
      return descendants;
    };

    this.profiles.forEach(p => {
      const code = p.referenceCode || p.id;
      const directDownlines = this.profiles.filter(c => c.referredByCode === code).map(c => c.referenceCode);
      const allDescendants = calculateDescendants(code);

      // Average House Clean % calculation
      let avgHouseCleanPct = 0;
      if (p.houseCleanLevels && p.houseCleanLevels.length > 0) {
        const total = p.houseCleanLevels.reduce((acc, h) => acc + (Number(h.cleanPercentage) || 0), 0);
        avgHouseCleanPct = Math.round(total / p.houseCleanLevels.length);
      } else {
        avgHouseCleanPct = p.level === 1 ? 100 : (p.level === 2 ? 95 : (p.level === 3 ? 75 : 45));
      }

      profilesMap[code] = {
        id: p.id,
        referenceCode: p.referenceCode,
        referredByCode: p.referredByCode || 'ROOT-0000-0000-0000',
        transferredCode: p.transferredCode || '',
        name: p.name || 'Seeker',
        phone: p.phone || '+91 98765 43210',
        email: p.email || 'user@spiritualkarim.org',
        profileType: p.profileType || 'DEVOTEE',
        level: p.level || 1,
        status: p.isActive !== false ? 'ACTIVE' : 'INACTIVE',
        paymentStatus: p.paymentStatus || (p.isPaid ? 'PAID' : 'FREE'),
        city: p.city || 'Varanasi',
        address: p.address || '',
        objective: p.objective || '',
        categoryTag: p.categoryTag || '',
        selectedRemedies: p.selectedRemedies || [],
        interestedSadhanas: p.interestedSadhanas || [],
        houseCleanLevels: p.houseCleanLevels || [],
        traineeSadhanas: p.traineeSadhanas || [],
        healerCompletedSadhanas: p.healerCompletedSadhanas || [],
        healerNetwork: p.healerNetwork || [],
        lineage: p.lineage || {},
        seekerDiagnostics: p.seekerDiagnostics || {},
        joinDate: p.joinDate || '2024-01-01',
        connectedDownlines: directDownlines,
        connectedDownlineCount: directDownlines.length,
        connectedDescendantsCount: allDescendants.length
      };

      authorisedNodesMap[code] = {
        referenceCode: p.referenceCode,
        sponsorCode: p.referredByCode || 'ROOT-0000-0000-0000',
        role: p.profileType || 'DEVOTEE',
        level: p.level || 1,
        status: p.isActive !== false ? 'ACTIVE' : 'INACTIVE',
        deviceFingerprintHash: 'HASH_' + (p.referenceCode || '').replace(/[^A-Z0-9]/g, '').slice(-8),
        houseCleanPct: avgHouseCleanPct,
        japaCount: p.level === 1 ? 108000 : (p.level === 2 ? 54000 : (p.level === 3 ? 21000 : 4500)),
        connectedDownlines: directDownlines,
        connectedDownlineCount: directDownlines.length,
        connectedDescendantsCount: allDescendants.length,
        lastSeenTimestamp: Date.now() - Math.floor(Math.random() * 1800000),
        lastHeartbeat: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      telemetryMap[code] = {
        referenceCode: p.referenceCode,
        batteryLevel: Math.floor(70 + Math.random() * 30),
        deviceModel: p.level === 1 ? 'Pixel 8 Pro (Founder Edition)' : (p.level === 2 ? 'Samsung Galaxy S24 Ultra' : (p.level === 3 ? 'OnePlus 12' : 'Xiaomi 14')),
        osVersion: 'Android 14 (API 34)',
        lastSyncTimestamp: new Date().toISOString(),
        networkStatus: 'WIFI_5GHZ_ONLINE',
        appVersion: '3.2.0-PROD'
      };
    });

    const lineageGraph = {
      rootCode: 'SKHM-ADM1-7788-9900',
      masterNodes: this.profiles.filter(p => p.profileType === 'ADMIN' || p.level === 1).map(p => p.referenceCode),
      healerNodes: this.profiles.filter(p => p.profileType === 'HEALER' || p.level === 2).map(p => p.referenceCode),
      traineeNodes: this.profiles.filter(p => p.profileType === 'TRAINEE' || p.level === 3).map(p => p.referenceCode),
      devoteeNodes: this.profiles.filter(p => p.profileType === 'DEVOTEE' || p.level >= 4).map(p => p.referenceCode)
    };

    return {
      profiles: profilesMap,
      authorisedNodes: authorisedNodesMap,
      sadhana_catalog: SADHANA_CATALOG,
      device_telemetry: telemetryMap,
      pairing_invites: {
        'INV-882194': {
          inviteCode: 'INV-882194',
          sponsorCode: 'SKHM-ADM1-7788-9900',
          seekerName: 'Rajesh Kumar (Seeker)',
          seekerPhone: '+91 98200 11223',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          status: 'PENDING_APPROVAL',
          createdAt: new Date().toISOString()
        },
        'INV-449102': {
          inviteCode: 'INV-449102',
          sponsorCode: 'SKHM-HLR2-3344-5566',
          seekerName: 'Amitabh Sen (Trainee)',
          seekerPhone: '+91 98450 77889',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          status: 'PAIRED_CONFIRMED',
          createdAt: new Date().toISOString()
        }
      },
      system_config: this.settings,
      lineage_graph: lineageGraph,
      logs: [
        { id: 'LOG-001', action: 'FIREBASE_RTDB_SYNC_INIT', timestamp: Date.now() - 3600000, severity: 'INFO', source: 'AdminConsole' },
        { id: 'LOG-002', action: 'HEALER_CERTIFICATE_VERIFIED', timestamp: Date.now() - 1800000, severity: 'SUCCESS', source: 'AuthEngine' },
        { id: 'LOG-003', action: 'DEVICE_24H_PAIRING_REQUEST', timestamp: Date.now() - 600000, severity: 'WARN', source: 'MobileClient' },
        { id: 'LOG-004', action: 'SADHANA_STREAK_CHECK', timestamp: Date.now() - 120000, severity: 'INFO', source: 'SchedulerDaemon' }
      ]
    };
  }

  getRealtimeNodeByPath(pathStr) {
    const tree = this.getFirebaseRealtimeTree();
    if (!pathStr || pathStr === '/' || pathStr === '') return tree;
    const parts = pathStr.replace(/^\/+/, '').split('/');
    let curr = tree;
    for (const p of parts) {
      if (curr && typeof curr === 'object' && p in curr) {
        curr = curr[p];
      } else {
        return null;
      }
    }
    return curr;
  }

  setRealtimeNodeByPath(pathStr, newVal) {
    if (!pathStr || pathStr === '/' || pathStr === '') return false;
    const parts = pathStr.replace(/^\/+/, '').split('/');
    const rootKey = parts[0];

    // If updating system_config, update settings
    if (rootKey === 'system_config') {
      if (parts.length === 1) {
        this.settings = { ...this.settings, ...newVal };
      } else {
        this.settings[parts[1]] = newVal;
      }
      this.saveSettings(this.settings);
      return true;
    }

    // If updating profiles
    if (rootKey === 'profiles' && parts.length >= 2) {
      const targetCode = parts[1];
      const targetProf = this.profiles.find(p => p.referenceCode === targetCode || p.id === targetCode);
      if (targetProf) {
        if (parts.length === 2 && typeof newVal === 'object') {
          Object.assign(targetProf, newVal);
        } else if (parts.length === 3) {
          targetProf[parts[2]] = newVal;
        }
        this._saveProfiles();
        return true;
      }
    }

    return true;
  }

  deleteRealtimeNodeByPath(pathStr) {
    if (!pathStr || pathStr === '/') return false;
    const parts = pathStr.replace(/^\/+/, '').split('/');
    const rootKey = parts[0];

    if (rootKey === 'profiles' && parts.length === 2) {
      const targetCode = parts[1];
      const idx = this.profiles.findIndex(p => p.referenceCode === targetCode || p.id === targetCode);
      if (idx > -1 && this.profiles.length > 1) {
        this.profiles.splice(idx, 1);
        this._saveProfiles();
        return true;
      }
    }
    return true;
  }

}// ==============================================================
// 3. VIEW LAYER
// ==============================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProfileModel };
}
