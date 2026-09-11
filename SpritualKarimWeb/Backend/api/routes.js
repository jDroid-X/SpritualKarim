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

  // 2. System Config
  if (pathname === '/api/config') {
    res.writeHead(200);
    res.end(JSON.stringify(fb.getSystemConfig()));
    return true;
  }

  // 3. Profiles List
  if (pathname === '/api/profiles') {
    const profiles = fb.getProfiles();
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: profiles.length, data: profiles }));
    return true;
  }

  // 4. Sadhana Catalog
  if (pathname === '/api/sadhana-catalog') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: fb.getSadhanaCatalog() }));
    return true;
  }

  // 5. Pairing Invites
  if (pathname === '/api/pairing-invites') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: fb.getPairingInvites() }));
    return true;
  }

  // 6. DB Export
  if (pathname === '/api/db/export') {
    res.writeHead(200);
    res.end(JSON.stringify(fb.getLocalData(), null, 2));
    return true;
  }

  return false;
}

module.exports = { handleApiRequest };
