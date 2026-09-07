package com.jdroidx.spritualkarim.data.model

import java.util.UUID

/**
 * The 3 Progressive House Clean Levels in the Seekers Sadhana program.
 */
enum class HouseCleanLevel(
    val levelNumber: Int,
    val title: String,
    val subtitle: String,
    val badgeColorHex: Long
) {
    LEVEL_1(
        levelNumber = 1,
        title = "Level 1 — Self House Clean",
        subtitle = "Purification of personal residence, prayer altar & entryway",
        badgeColorHex = 0xFF00D084 // Spiritual Teal
    ),
    LEVEL_2(
        levelNumber = 2,
        title = "Level 2 — Parents House Clean",
        subtitle = "Purification of parents' household & ancestral thresholds",
        badgeColorHex = 0xFFFCB900 // Spiritual Gold
    ),
    LEVEL_3(
        levelNumber = 3,
        title = "Level 3 — Relative House Clean",
        subtitle = "Purification of extended family & relatives' living spaces",
        badgeColorHex = 0xFFAB3B5E // Spiritual Crimson
    );

    companion object {
        fun fromLevelNumber(num: Int): HouseCleanLevel {
            return entries.firstOrNull { it.levelNumber == num } ?: LEVEL_1
        }
    }
}

/**
 * Status of a House Clean level submission.
 */
enum class CleanStatus(val displayName: String, val badgeColorHex: Long) {
    NOT_STARTED("Not Started", 0xFF757D94),
    IN_PROGRESS("In Progress", 0xFF0088CC),
    PENDING_APPROVAL("Pending Mentor Approval", 0xFFFF6900),
    APPROVED("Approved & Certified", 0xFF00D084),
    REVISION_NEEDED("Needs Improvement", 0xFFAB3B5E)
}

/**
 * Seeker's House Clean Submission Record.
 */
data class HouseCleanSubmission(
    val id: String = UUID.randomUUID().toString().take(8),
    val seekerId: String,
    val seekerName: String,
    val level: HouseCleanLevel,
    val cleanedDetails: String,           // Details entered via text or Android Mic Speech-to-Text
    val status: CleanStatus = CleanStatus.NOT_STARTED,
    val cleanPercentage: Int = 0,         // % Clean verified by level-up connection (0-100)
    val approvedByCode: String? = null,   // Sponsor / Upline 16-digit code
    val approvedByName: String? = null,   // Mentor / Healer name
    val approvalDate: String? = null,
    val mentorRemarks: String? = null,
    val submissionDate: String? = null,
    val lastUpdated: String = ""
)
