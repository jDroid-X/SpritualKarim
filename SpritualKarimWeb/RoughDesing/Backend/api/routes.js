/**
 * Backend/api/routes.js
 * REST API Endpoints for Spiritual Karim Web & Mobile Integration
 * Shree Spritual Karim Sansthan
 */

const fs = require('fs');
const path = require('path');
const FirebaseService = require('../services/FirebaseService');
const AuthService = require('../services/AuthService');

const fb = new FirebaseService();

function handleApiRequest(req, res, pathname, queryParams) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  // 1. Health Check
  if (pathname === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now(), service: 'SpiritualKarimBackend' }));
    return true;
  }

  // 2. System Config (Dynamic Settings)
  if (pathname === '/api/config') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const cfg = JSON.parse(body);
          fb.saveSystemConfig(cfg);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Configuration saved in database', data: fb.getSystemConfig() }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: fb.getSystemConfig() }));
      return true;
    }
  }

  // 3. Auth Matrix (Dual-Write Persistence)
  if (pathname === '/api/auth-matrix') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const matrix = JSON.parse(body);
          fb.saveAuthMatrix(matrix);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Auth matrix updated in database' }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    } else {
      const matrix = fb.getAuthMatrix();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: matrix }));
      return true;
    }
  }

  // 4. Profiles List & Update
  if (pathname === '/api/profiles') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const profiles = JSON.parse(body);
          fb.saveProfiles(profiles);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Profiles updated in database' }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    } else {
      const profiles = fb.getProfiles();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: profiles.length, data: profiles }));
      return true;
    }
  }

  // 5. Sadhana Catalog
  if (pathname === '/api/sadhana-catalog') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: fb.getSadhanaCatalog() }));
    return true;
  }

  // 6. Pairing Invites
  if (pathname === '/api/pairing-invites') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const invites = JSON.parse(body);
          fb.savePairingInvites(invites);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Pairing invites updated in database' }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: fb.getPairingInvites() }));
      return true;
    }
  }

  // 7. Device Telemetry
  if (pathname === '/api/telemetry') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const telemetry = JSON.parse(body);
          fb.saveDeviceTelemetry(telemetry);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Telemetry updated' }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: fb.getDeviceTelemetry() }));
      return true;
    }
  }

  // 8. Audit Logs
  if (pathname === '/api/audit-logs') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const logEntry = JSON.parse(body);
          const saved = fb.appendAuditLog(logEntry);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, data: saved }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: fb.getAuditLogs() }));
      return true;
    }
  }

  // 9. Master Sync-All
  if (pathname === '/api/sync-all' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (payload.profiles) fb.saveProfiles(payload.profiles);
        if (payload.pairingInvites) fb.savePairingInvites(payload.pairingInvites);
        if (payload.telemetry) fb.saveDeviceTelemetry(payload.telemetry);
        if (payload.config) fb.saveSystemConfig(payload.config);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'All relational collections synchronized successfully',
          timestamp: Date.now()
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return true;
  }

  // 10. DB Export
  if (pathname === '/api/db/export') {
    res.writeHead(200);
    res.end(JSON.stringify(fb.getLocalData(), null, 2));
    return true;
  }

  // 15. Sadhana & Remedy Initiations List
  if (pathname === '/api/sadhana/initiations') {
    const data = fb.getLocalData();
    const list = data.sadhana_initiations || Object.values(data.pairing_invites || {});
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: list.length, data: list }));
    return true;
  }

  // 16. Sadhana / Remedy Application (Apply)
  if (pathname === '/api/sadhana/apply' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const data = fb.getLocalData();
        if (!data.sadhana_initiations) data.sadhana_initiations = [];
        if (!data.pairing_invites) data.pairing_invites = {};

        const appId = payload.id || `sadh-req-${Date.now().toString(36)}`;
        payload.id = appId;
        payload.status = payload.status || 'PENDING';
        payload.createdAtMs = payload.createdAtMs || Date.now();

        data.sadhana_initiations.unshift(payload);
        data.pairing_invites[appId] = payload;
        fb.saveLocalData(data);

        fb.appendAuditLog({
          action: 'SADHANA_APPLICATION_SUBMITTED',
          appId: appId,
          applicantName: payload.applicantName || payload.seekerName,
          title: payload.title || payload.itemTitle,
          timestamp: Date.now()
        });

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Initiation application submitted', data: payload }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return true;
  }

  // 17. Sadhana / Remedy Mentor Review (Approve, Reject, Revision)
  if (pathname === '/api/sadhana/review' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { id, status, notes, adjustedMalas, adjustedSlot } = payload;
        const data = fb.getLocalData();
        if (!data.sadhana_initiations) data.sadhana_initiations = [];

        let app = data.sadhana_initiations.find(a => a.id === id);
        if (!app && data.pairing_invites && data.pairing_invites[id]) {
          app = data.pairing_invites[id];
        }

        if (app) {
          app.status = status || 'APPROVED';
          app.mentorFeedback = notes || '';
          if (adjustedMalas) app.targetMalas = Number(adjustedMalas);
          if (adjustedSlot) app.scheduleSlot = adjustedSlot;
          if (status === 'APPROVED') {
            app.approvedAtMs = Date.now();
            app.initiationToken = app.initiationToken || `IN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

            // Update user profile in database
            if (data.profiles) {
              const prof = Object.values(data.profiles).find(p => p.id === app.seekerId || p.referenceCode === app.devoteeCode);
              if (prof) {
                if (!prof.traineeSadhanas) prof.traineeSadhanas = [];
                const exist = prof.traineeSadhanas.find(s => s.id === (app.itemId || app.id));
                if (!exist) {
                  prof.traineeSadhanas.push({
                    id: app.itemId || app.id,
                    title: app.itemTitle || app.title,
                    category: app.category || 'Sacred Sadhana',
                    status: 'Active',
                    targetMalas: app.targetMalas || 11,
                    cycleDays: app.cycleDays || 21,
                    scheduleSlot: app.scheduleSlot,
                    initiationToken: app.initiationToken,
                    startDate: new Date().toISOString().split('T')[0],
                    streakDays: 0,
                    dailyMalasDone: 0
                  });
                }
                // Lineage ascension to Level 3 Trainee
                if (prof.level === 4 || (prof.profileType && prof.profileType.toUpperCase().includes('DEVOTEE'))) {
                  prof.level = 3;
                  prof.profileType = 'TRAINEE';
                  prof.assignedRole = 'TRAINEE';
                }
                prof.activeSadhanas = prof.traineeSadhanas;
              }
            }
          }
          fb.saveLocalData(data);
          fb.appendAuditLog({
            action: `SADHANA_APPLICATION_${status || 'REVIEWED'}`,
            appId: id,
            status: app.status,
            mentorFeedback: notes,
            timestamp: Date.now()
          });

          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: `Application ${app.status}`, data: app }));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Application not found' }));
        }
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return true;
  }

  // 18. Daily Sadhana / Remedy Progress Logging
  if (pathname === '/api/sadhana/remedy-progress' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { seekerId, sadhanaId, malasCompleted, date } = payload;
        const data = fb.getLocalData();
        if (data.profiles && seekerId) {
          const prof = Object.values(data.profiles).find(p => p.id === seekerId || p.referenceCode === seekerId);
          if (prof && prof.traineeSadhanas) {
            const item = prof.traineeSadhanas.find(s => s.id === sadhanaId || s.sadhanaKey === sadhanaId);
            if (item) {
              item.dailyMalasDone = (item.dailyMalasDone || 0) + (Number(malasCompleted) || 1);
              item.streakDays = (item.streakDays || 0) + 1;
              fb.saveLocalData(data);
            }
          }
        }
        fb.appendAuditLog({
          action: 'DAILY_SADHANA_PROGRESS_LOGGED',
          seekerId,
          sadhanaId,
          malasCompleted,
          date: date || new Date().toISOString(),
          timestamp: Date.now()
        });
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Progress logged successfully', data: payload }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return true;
  }

  return false;
}

module.exports = { handleApiRequest };
