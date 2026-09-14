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

  // 10. DB Export
  if (pathname === '/api/db/export') {
    res.writeHead(200);
    res.end(JSON.stringify(fb.getLocalData(), null, 2));
    return true;
  }

  return false;
}

module.exports = { handleApiRequest };
