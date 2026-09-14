/**
 * Backend/services/AuthService.js
 * Role-Based Access Control and Session Authentication Service
 * Shree Spritual Karim Sansthan
 */

class AuthService {
  static ROLES = {
    MASTER: { level: 0, title: 'Master Founder', rank: 1 },
    ADMIN: { level: 1, title: 'Admin Master', rank: 1 },
    HEALER: { level: 2, title: 'Spiritual Healer', rank: 2 },
    TRAINEE: { level: 3, title: 'Mentorship Trainee', rank: 3 },
    DEVOTEE: { level: 4, title: 'Devotee Seeker', rank: 4 }
  };

  static normalizeRole(roleString) {
    if (!roleString) return 'DEVOTEE';
    const upper = String(roleString).toUpperCase().trim();
    return this.ROLES[upper] ? upper : 'DEVOTEE';
  }

  static canAccess(userRole, requiredRole) {
    const uRole = this.normalizeRole(userRole);
    const rRole = this.normalizeRole(requiredRole);
    return this.ROLES[uRole].rank <= this.ROLES[rRole].rank;
  }

  static verifyPin(providedPin, expectedPin) {
    return String(providedPin).trim() === String(expectedPin).trim();
  }
}

module.exports = AuthService;
