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

  // 3. Screen Auth Matrix (Dual-Write Persistence)
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

  // 3b. Profile Role Matrix (Profile Delegated Permissions)
  if (pathname === '/api/profile-roles') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const roleMatrix = JSON.parse(body);
          if (typeof fb.saveProfileRoleMatrix === 'function') {
            fb.saveProfileRoleMatrix(roleMatrix);
          }
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Profile role matrix updated in database' }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    } else {
      const data = typeof fb.getProfileRoleMatrix === 'function' ? fb.getProfileRoleMatrix() : {};
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: data || {} }));
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
    if (req.method === 'DELETE') {
      const inviteId = queryParams ? queryParams.get('id') : null;
      if (inviteId && typeof fb.deletePairingInvite === 'function') {
        fb.deletePairingInvite(inviteId);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Invite deleted from database', id: inviteId }));
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Missing or invalid invite id' }));
      }
      return true;
    } else if (req.method === 'POST') {
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

  // 6b. Sadhana Initiation Application
  if (pathname === '/api/sadhana/apply') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const invites = fb.getPairingInvites();
          invites.unshift(payload);
          fb.savePairingInvites(invites);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Sadhana application submitted successfully', data: payload }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    }
  }

  // 6c. Sadhana Initiation Approval
  if (pathname === '/api/sadhana/approve') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          // payload should have { inviteId, targetRole, mentorNotes, targetMalas, etc. }
          // The actual elevation logic runs on the client-side model which dual-writes back to /api/profiles and /api/pairing-invites.
          // This endpoint serves as an alternative backend action handler if required by mobile clients.
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Approval received by server' }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
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

  // 10. Component States (Toggles, Switches, Filters, UI Preferences)
  if (pathname === '/api/component-state') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const states = JSON.parse(body);
          const saved = fb.saveComponentStates(states);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Component state persisted in database', data: saved }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return true;
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: fb.getComponentStates() }));
      return true;
    }
  }

  // 12. Profiles Dynamic Search
  if (pathname === '/api/profiles/search') {
    const allProfiles = fb.getProfiles();
    const q = (queryParams && (queryParams.get('q') || queryParams.get('term') || '')).toLowerCase().trim();
    const role = (queryParams && queryParams.get('role') || '').toUpperCase();
    const status = (queryParams && queryParams.get('status') || '').toUpperCase();

    const filtered = allProfiles.filter(p => {
      let matchesQ = true;
      if (q) {
        const text = `${p.name || ''} ${p.phone || ''} ${p.referenceCode || ''} ${p.city || ''} ${p.email || ''}`.toLowerCase();
        matchesQ = text.includes(q);
      }
      let matchesRole = true;
      if (role && role !== 'ALL') {
        matchesRole = (p.profileType || '').toUpperCase() === role || (role === 'MASTER' && p.profileType === 'ADMIN');
      }
      let matchesStatus = true;
      if (status === 'ACTIVE') matchesStatus = p.isActive === true;
      else if (status === 'PAID') matchesStatus = p.isPaid !== false && p.paymentStatus !== 'FREE';
      else if (status === 'FREE') matchesStatus = p.isPaid === false || p.paymentStatus === 'FREE';

      return matchesQ && matchesRole && matchesStatus;
    });

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: filtered.length, data: filtered }));
    return true;
  }

  // 13. Human-in-the-Loop Governance Decisions
  if (pathname === '/api/profiles/decision' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const logEntry = {
          action: 'GOVERNANCE_DECISION',
          decision: payload.decision || 'APPROVE',
          applicantId: payload.applicantId || 'unknown',
          reviewerName: payload.reviewerName || 'Admin Master',
          reason: payload.reason || 'Standard review completed',
          timestamp: payload.timestamp || Date.now(),
          ip: req.socket.remoteAddress || '127.0.0.1'
        };
        fb.appendAuditLog(logEntry);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: `Decision '${logEntry.decision}' logged in governance audit trail`,
          data: logEntry
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return true;
  }

  // 14. Server-Side Telemetry & Notification Broadcast
  if (pathname === '/api/telemetry/notify' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const notifEntry = {
          action: 'TELEMETRY_NOTIFY',
          title: payload.title || 'System Notification',
          message: payload.message || '',
          type: payload.type || 'info',
          recipientId: payload.recipientId || 'ALL',
          timestamp: payload.timestamp || Date.now()
        };
        fb.appendAuditLog(notifEntry);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Notification published to telemetry stream',
          data: notifEntry
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
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

  // 18. Daily Sadhana / Remedy Progress Logging (Pending Review)
  if (pathname === '/api/sadhana/remedy-progress' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { seekerId, sadhanaId, malasCompleted, date } = payload;
        const data = fb.getLocalData();
        const submissionId = `prog-${Date.now().toString(36)}`;
        if (data.profiles && seekerId) {
          const prof = Object.values(data.profiles).find(p => p.id === seekerId || p.referenceCode === seekerId);
          if (prof && prof.traineeSadhanas) {
            const item = prof.traineeSadhanas.find(s => s.id === sadhanaId || s.sadhanaKey === sadhanaId || s.initiationToken === sadhanaId);
            if (item) {
              if (!item.pendingSubmissions) item.pendingSubmissions = [];
              item.pendingSubmissions.push({
                submissionId,
                malasCompleted: Number(malasCompleted) || 1,
                date: date || new Date().toISOString(),
                status: 'PENDING_REVIEW'
              });
              fb.saveLocalData(data);
            }
          }
        }
        fb.appendAuditLog({
          action: 'DAILY_SADHANA_PROGRESS_SUBMITTED',
          seekerId,
          sadhanaId,
          submissionId,
          malasCompleted,
          date: date || new Date().toISOString(),
          timestamp: Date.now()
        });
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Progress submitted for healer review', data: { ...payload, submissionId, status: 'PENDING_REVIEW' } }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return true;
  }

  // 19. Approve Daily Sadhana / Remedy Progress
  if (pathname === '/api/sadhana/remedy-progress/approve' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { seekerId, sadhanaId, submissionId, healerCode } = payload;
        const data = fb.getLocalData();
        let approvedItem = null;
        if (data.profiles && seekerId) {
          const prof = Object.values(data.profiles).find(p => p.id === seekerId || p.referenceCode === seekerId);
          if (prof && prof.traineeSadhanas) {
            const item = prof.traineeSadhanas.find(s => s.id === sadhanaId || s.sadhanaKey === sadhanaId || s.initiationToken === sadhanaId);
            if (item && item.pendingSubmissions) {
              const subIndex = item.pendingSubmissions.findIndex(sub => sub.submissionId === submissionId);
              if (subIndex !== -1) {
                const sub = item.pendingSubmissions.splice(subIndex, 1)[0];
                sub.status = 'APPROVED';
                sub.approvedBy = healerCode;
                sub.approvedAtMs = Date.now();
                
                if (!item.approvedSubmissions) item.approvedSubmissions = [];
                item.approvedSubmissions.push(sub);
                
                item.dailyMalasDone = (item.dailyMalasDone || 0) + sub.malasCompleted;
                item.streakDays = (item.streakDays || 0) + 1;
                
                // Calculate percentage
                const target = item.targetMalas || 11;
                const cycle = item.cycleDays || 21;
                const totalTarget = target * cycle;
                item.progressPercent = Math.min(100, Math.round((item.dailyMalasDone / totalTarget) * 100));
                
                approvedItem = item;
                fb.saveLocalData(data);
              }
            }
          }
        }
        
        if (approvedItem) {
          fb.appendAuditLog({
            action: 'DAILY_SADHANA_PROGRESS_APPROVED',
            seekerId,
            sadhanaId,
            submissionId,
            healerCode,
            timestamp: Date.now()
          });
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Progress approved successfully', data: approvedItem }));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'Submission not found or already approved' }));
        }
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
