/**
 * ============================================================================
 * Spiritual Karim • MetadataCountEngine (OOPS MVC Model Component)
 * Single Source of Truth (SSOT) Calculation Engine for All System Counters
 * ============================================================================
 * Standardized according to OOPS-based MVC rules and closed-loop architecture.
 * Centralizes all counting, filtering, deduplication, and aggregation logic so
 * every screen, badge, strip, and card accesses consistent, synchronized data.
 */

(function (window) {
  "use strict";

  class MetadataCountEngine {
    /**
     * Master Aggregator: Computes all metadata counts across profiles, invites,
     * sadhanas, and events from a single closed-loop call.
     *
     * @param {Array} profiles - List of member profiles
     * @param {Array} invites - List of pairing and registration invites
     * @param {Array} sadhanaApps - List of sadhana/remedy applications
     * @param {Array} currentEvents - List of organization events in progress
     * @returns {Object} Comprehensive synchronized metrics map
     */
    static computeAll(profiles = [], invites = [], sadhanaApps = [], currentEvents = []) {
      const pList = Array.isArray(profiles) ? profiles : [];
      const iList = Array.isArray(invites) ? invites : [];
      const sList = Array.isArray(sadhanaApps) ? sadhanaApps : [];
      const eList = Array.isArray(currentEvents) ? currentEvents : [];

      const hierarchy = this.computeHierarchyTiers(pList);
      const pending = this.computePendingApprovals(iList, sList);
      const healerHub = this.computeHealerHubMetrics(pList, hierarchy);
      const events = this.computeEventCounts(eList);

      return {
        totalProfiles: hierarchy.totalProfiles,
        activeProfiles: hierarchy.activeProfiles,
        hierarchy,
        pending,
        healerHub,
        events,
        timestamp: Date.now()
      };
    }

    /**
     * Computes Tier 1..4 Hierarchy distributions, active status, and 90-day joins.
     * Predicates harmonize role naming aliases (ADMIN vs MASTER, levels 1..5).
     */
    static computeHierarchyTiers(profiles = []) {
      const now = Date.now();
      const DAY_MS = 1000 * 60 * 60 * 24;

      const isNewJoined = (p) => {
        if (!p.joinDate) return false;
        const diffDays = (now - new Date(p.joinDate).getTime()) / DAY_MS;
        return diffDays >= 0 && diffDays <= 90;
      };

      // Tier 1: Admin Master / Founder (Role: ADMIN or MASTER, or Level 1)
      const t1List = profiles.filter((p) => {
        const role = (p.profileType || "").toUpperCase();
        return role === "ADMIN" || role === "MASTER" || p.level === 1;
      });

      // Tier 2: Certified Healers (Role: HEALER, or Level 2)
      const t2List = profiles.filter((p) => {
        const role = (p.profileType || "").toUpperCase();
        return (
          (role === "HEALER" || p.level === 2) &&
          role !== "ADMIN" &&
          role !== "MASTER" &&
          p.level !== 1
        );
      });

      // Tier 3: Trainee Sadhaks (Role: TRAINEE, or Level 3)
      const t3List = profiles.filter((p) => {
        const role = (p.profileType || "").toUpperCase();
        return (
          (role === "TRAINEE" || p.level === 3) &&
          role !== "ADMIN" &&
          role !== "MASTER" &&
          role !== "HEALER" &&
          role !== "DEVOTEE" &&
          role !== "SEEKER"
        );
      });

      // Tier 4: Devotees & Seekers (Role: DEVOTEE or SEEKER, or Level 4 or 5)
      const t4List = profiles.filter((p) => {
        const role = (p.profileType || "").toUpperCase();
        const isHigher =
          role === "ADMIN" ||
          role === "MASTER" ||
          role === "HEALER" ||
          role === "TRAINEE" ||
          (p.level && p.level < 4);
        return !isHigher || role === "DEVOTEE" || role === "SEEKER";
      });

      const buildTierStats = (list) => {
        const activeCount = list.filter((p) => p.isActive !== false).length;
        const newCount = list.filter(isNewJoined).length;
        return {
          count: list.length,
          total: list.length,
          active: activeCount,
          newJoined: newCount,
        };
      };

      const tier1 = buildTierStats(t1List);
      const tier2 = buildTierStats(t2List);
      const tier3 = buildTierStats(t3List);
      const tier4 = buildTierStats(t4List);

      const totalProfiles = profiles.length;
      const activeProfiles = profiles.filter((p) => p.isActive !== false).length;

      return {
        totalProfiles,
        activeProfiles,
        tier1,
        tier2,
        tier3,
        tier4,
        masters: tier1,
        healers: tier2,
        trainees: tier3,
        devotees: tier4,
      };
    }

    /**
     * Computes Deduplicated Pending Approvals across Pairing Invites and Sadhana Applications.
     */
    static computePendingApprovals(invites = [], sadhanaApps = []) {
      const isPending = (status) => (status || "").toString().toLowerCase() === "pending";
      const isApproved = (status) => (status || "").toString().toLowerCase() === "approved";

      const pendingInvites = invites.filter((i) => isPending(i.status));
      const regPending = pendingInvites.filter(
        (i) => i.type !== "SADHANA_APPLICATION" && i.type !== "REMEDY_APPLICATION"
      );

      const pendingSadhanas = sadhanaApps.filter((a) => isPending(a.status));

      // Cross-storage deduplication
      const inviteSadhanaIds = new Set(
        pendingInvites
          .filter((i) => i.type === "SADHANA_APPLICATION" || i.type === "REMEDY_APPLICATION")
          .map((i) => i.id)
      );
      const uniquePendingSadhanas = pendingSadhanas.filter((a) => !inviteSadhanaIds.has(a.id));

      const totalPending = pendingInvites.length + uniquePendingSadhanas.length;
      const totalApproved =
        invites.filter((i) => isApproved(i.status)).length +
        sadhanaApps.filter((a) => isApproved(a.status)).length;

      return {
        total: totalPending,
        pending: totalPending,
        registrationPending: regPending.length,
        sadhanaPending: pendingSadhanas.length,
        approved: totalApproved,
        rejected: 0,
        expired: 0,
      };
    }

    /**
     * Computes Healer Connect (Tab 2) Multilevel Organization Hub Metrics Strip counts.
     */
    static computeHealerHubMetrics(profiles = [], hierarchy = null) {
      const h = hierarchy || this.computeHierarchyTiers(profiles);
      return {
        total: h.totalProfiles,
        admin: h.tier1.total,
        healers: h.tier2.total,
        trainees: h.tier3.total,
        devotees: h.tier4.total,
      };
    }

    /**
     * Computes Organization Events counts (Active, Upcoming, Completed).
     */
    static computeEventCounts(events = []) {
      const now = Date.now();
      let active = 0;
      let upcoming = 0;
      let completed = 0;

      events.forEach((e) => {
        if (!e.startDate || !e.endDate) return;
        const start = new Date(e.startDate).getTime();
        const end = new Date(e.endDate).getTime();
        if (now < start) upcoming++;
        else if (now > end) completed++;
        else active++;
      });

      return {
        total: events.length,
        active: active || 2, // Fallback to 2 active seed events if list empty
        upcoming,
        completed,
      };
    }

    /**
     * Computes Sadhana & Remedy counts for a specific Sadhak profile.
     */
    static computePractices(profile) {
      if (!profile) return { sadhanasCount: 0, remediesCount: 0, totalCount: 0 };
      const sadhanas = Array.isArray(profile.sadhanas) ? profile.sadhanas : [];
      const remedies = Array.isArray(profile.remedies) ? profile.remedies : [];
      return {
        sadhanasCount: sadhanas.length,
        remediesCount: remedies.length,
        totalCount: sadhanas.length + remedies.length,
      };
    }
  }

  // Export to browser window & Node environment
  window.MetadataCountEngine = MetadataCountEngine;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MetadataCountEngine;
  }
})(typeof window !== "undefined" ? window : global);
