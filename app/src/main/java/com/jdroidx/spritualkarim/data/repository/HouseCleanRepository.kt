package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.CleanStatus
import com.jdroidx.spritualkarim.data.model.HouseCleanLevel
import com.jdroidx.spritualkarim.data.model.HouseCleanSubmission
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.*

/**
 * Repository managing 3-Level "House Clean" submissions, voice transcriptions,
 * and Level-Up Connection (% Clean) approvals.
 */
object HouseCleanRepository {

    private fun getCurrentDateString(): String {
        return SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault()).format(Date())
    }

    // Seed mock submissions for testing and demonstration
    private val initialSubmissions = listOf(
        // Vikas Gupta (prof-dev-01) - Level 1 Approved (100%), Level 2 Pending, Level 3 Not Started
        HouseCleanSubmission(
            id = "clean-sub-01",
            seekerId = "prof-dev-01",
            seekerName = "Vikas Gupta",
            level = HouseCleanLevel.LEVEL_1,
            cleanedDetails = "Completely cleansed North-East altar corner, removed accumulated stagnant clutter, lit 3 mustard oil lamps at entryway threshold, and diffused loban & bakhoor in all rooms.",
            status = CleanStatus.APPROVED,
            cleanPercentage = 100,
            approvedByCode = "SKHM-TRN4-1122-3344",
            approvedByName = "Amitabh Sen (Level 4 Trainee)",
            approvalDate = "2024-02-15 11:30",
            mentorRemarks = "Excellent purity observed. Sacred aura restored. Certified 100% clean.",
            submissionDate = "2024-02-14 18:00",
            lastUpdated = "2024-02-15 11:30"
        ),
        HouseCleanSubmission(
            id = "clean-sub-02",
            seekerId = "prof-dev-01",
            seekerName = "Vikas Gupta",
            level = HouseCleanLevel.LEVEL_2,
            cleanedDetails = "Visited parents' residence in Patna. Washed main doorway with sea-salt water, purified old storeroom, and performed 108 Mahamrityunjaya chants with sacred incense.",
            status = CleanStatus.PENDING_APPROVAL,
            cleanPercentage = 0,
            approvedByCode = null,
            approvedByName = null,
            approvalDate = null,
            mentorRemarks = null,
            submissionDate = "Today • 09:45 AM",
            lastUpdated = "Today • 09:45 AM"
        ),
        HouseCleanSubmission(
            id = "clean-sub-03",
            seekerId = "prof-dev-01",
            seekerName = "Vikas Gupta",
            level = HouseCleanLevel.LEVEL_3,
            cleanedDetails = "",
            status = CleanStatus.NOT_STARTED,
            cleanPercentage = 0,
            lastUpdated = ""
        ),

        // Default Seeker Seed (for Root Seeker persona)
        HouseCleanSubmission(
            id = "clean-sub-root-01",
            seekerId = "prof-root-01",
            seekerName = "Spiritual Karim Khan",
            level = HouseCleanLevel.LEVEL_1,
            cleanedDetails = "Central Ashram Sanctum Sanctorum daily purification complete. Sacred copper Sri Yantra energized with continuous Brahma Muhurta Trataka and organic Himalayan bakhoor.",
            status = CleanStatus.APPROVED,
            cleanPercentage = 100,
            approvedByCode = "SKHM-ADM1-7788-9900",
            approvedByName = "Karim Ji (Founder)",
            approvalDate = "Today • Dawn",
            mentorRemarks = "Direct Master lineage perfection.",
            submissionDate = "Today • 05:00 AM",
            lastUpdated = "Today • 05:00 AM"
        ),
        HouseCleanSubmission(
            id = "clean-sub-root-02",
            seekerId = "prof-root-01",
            seekerName = "Spiritual Karim Khan",
            level = HouseCleanLevel.LEVEL_2,
            cleanedDetails = "Ancestral Haveli in Old Varanasi purified with traditional copper havan kund and sacred herbs.",
            status = CleanStatus.APPROVED,
            cleanPercentage = 100,
            approvedByCode = "SKHM-ADM1-7788-9900",
            approvedByName = "Karim Ji (Founder)",
            approvalDate = "Yesterday",
            mentorRemarks = "Ancestral blessings established.",
            submissionDate = "Yesterday",
            lastUpdated = "Yesterday"
        ),
        HouseCleanSubmission(
            id = "clean-sub-root-03",
            seekerId = "prof-root-01",
            seekerName = "Spiritual Karim Khan",
            level = HouseCleanLevel.LEVEL_3,
            cleanedDetails = "Extended family residences across Varanasi & Haridwar blessed and purified with 3-diya process.",
            status = CleanStatus.APPROVED,
            cleanPercentage = 100,
            approvedByCode = "SKHM-ADM1-7788-9900",
            approvedByName = "Karim Ji (Founder)",
            approvalDate = "2 days ago",
            mentorRemarks = "Full 3-level clan purification complete.",
            submissionDate = "2 days ago",
            lastUpdated = "2 days ago"
        )
    )

    private val _submissions = MutableStateFlow<List<HouseCleanSubmission>>(initialSubmissions)
    val submissions: StateFlow<List<HouseCleanSubmission>> = _submissions.asStateFlow()

    /**
     * Retrieves all 3 level submissions for a specific seeker, creating defaults if not yet created.
     */
    fun getSubmissionsForSeeker(seekerId: String, seekerName: String): List<HouseCleanSubmission> {
        val current = _submissions.value.filter { it.seekerId == seekerId }
        return HouseCleanLevel.entries.map { level ->
            current.firstOrNull { it.level == level } ?: HouseCleanSubmission(
                id = "clean-${seekerId.take(8)}-${level.levelNumber}",
                seekerId = seekerId,
                seekerName = seekerName,
                level = level,
                cleanedDetails = "",
                status = CleanStatus.NOT_STARTED,
                cleanPercentage = 0
            )
        }
    }

    /**
     * Submits or updates a House Clean report for a specific level.
     */
    fun submitHouseClean(seekerId: String, seekerName: String, level: HouseCleanLevel, details: String) {
        val current = _submissions.value.toMutableList()
        val index = current.indexOfFirst { it.seekerId == seekerId && it.level == level }
        val dateStr = getCurrentDateString()

        val updated = if (index != -1) {
            current[index].copy(
                cleanedDetails = details,
                status = CleanStatus.PENDING_APPROVAL,
                submissionDate = dateStr,
                lastUpdated = dateStr
            )
        } else {
            HouseCleanSubmission(
                id = "clean-${UUID.randomUUID().toString().take(8)}",
                seekerId = seekerId,
                seekerName = seekerName,
                level = level,
                cleanedDetails = details,
                status = CleanStatus.PENDING_APPROVAL,
                submissionDate = dateStr,
                lastUpdated = dateStr
            )
        }

        if (index != -1) {
            current[index] = updated
        } else {
            current.add(updated)
        }
        _submissions.value = current
    }

    /**
     * Approves a submission with % Clean rating by a Level-Up connection / mentor.
     */
    fun approveHouseClean(
        submissionId: String,
        cleanPercentage: Int,
        mentorCode: String,
        mentorName: String,
        remarks: String
    ) {
        val current = _submissions.value.toMutableList()
        val index = current.indexOfFirst { it.id == submissionId }
        if (index != -1) {
            val dateStr = getCurrentDateString()
            current[index] = current[index].copy(
                status = CleanStatus.APPROVED,
                cleanPercentage = cleanPercentage.coerceIn(0, 100),
                approvedByCode = mentorCode,
                approvedByName = mentorName,
                approvalDate = dateStr,
                mentorRemarks = remarks.ifBlank { "Approved and verified by $mentorName." },
                lastUpdated = dateStr
            )
            _submissions.value = current
        }
    }

    /**
     * Requests revision for a submission.
     */
    fun requestRevision(
        submissionId: String,
        mentorCode: String,
        mentorName: String,
        remarks: String
    ) {
        val current = _submissions.value.toMutableList()
        val index = current.indexOfFirst { it.id == submissionId }
        if (index != -1) {
            val dateStr = getCurrentDateString()
            current[index] = current[index].copy(
                status = CleanStatus.REVISION_NEEDED,
                approvedByCode = mentorCode,
                approvedByName = mentorName,
                mentorRemarks = remarks.ifBlank { "Please perform additional purification and re-submit." },
                lastUpdated = dateStr
            )
            _submissions.value = current
        }
    }

    /**
     * Computes the cumulative % Clean across all 3 levels for a seeker.
     */
    fun calculateOverallCleanPercentage(seekerId: String): Int {
        val list = _submissions.value.filter { it.seekerId == seekerId }
        if (list.isEmpty()) return 0
        val total = list.sumOf { it.cleanPercentage }
        return (total / 3).coerceIn(0, 100)
    }
}
