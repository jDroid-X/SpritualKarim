package com.jdroidx.spritualkarim.data.model

/**
 * Multi-level profile types supported in the Spiritual Karim organization.
 */
enum class ProfileType(val displayName: String, val levelDefault: Int, val badgeColorHex: Long) {
    ADMIN("Admin Master", 1, 0xFF7A1C37),
    HEALER("Spiritual Healer", 2, 0xFFFCB900),
    TRAINEE("Mentorship Trainee", 4, 0xFF00D084),
    DEVOTEE("Devotee Seeker", 5, 0xFF0088CC);

    companion object {
        fun fromString(value: String): ProfileType {
            return entries.firstOrNull { it.name.equals(value, ignoreCase = true) || it.displayName.equals(value, ignoreCase = true) }
                ?: DEVOTEE
        }
    }
}

/**
 * Standard remedy and sadhana catalog for checkbox assignment.
 */
data class RemedyOption(
    val id: String,
    val title: String,
    val category: String // "Sadhana", "Remedy", "Cleansing"
)

object RemedyCatalog {
    val ALL_OPTIONS = listOf(
        // Sadhanas
        RemedyOption("sri_yantra", "Sri Yantra Sadhana", "Sadhana"),
        RemedyOption("kalashtami", "Kalashtami Sadhana", "Sadhana"),
        RemedyOption("navratri", "Navratri Chamunda Sadhana", "Sadhana"),
        RemedyOption("diwali", "Diwali Sadhana Week", "Sadhana"),
        // Remedies
        RemedyOption("three_diya", "Three Diya Process", "Remedy"),
        RemedyOption("trilok_nagri", "Trilok Nagri Access", "Remedy"),
        RemedyOption("court_cases", "Court Cases Remedy", "Remedy"),
        RemedyOption("business_money", "Business & Wealth Upaya", "Remedy"),
        // Cleansing & Healing
        RemedyOption("negativity", "Negativity Cleansing", "Cleansing"),
        RemedyOption("kundalini", "Kundalini & Spiritual Progress", "Cleansing"),
        RemedyOption("material_benefits", "Material & Karmic Benefits", "Cleansing"),
        RemedyOption("healing", "Spiritual Healing from Illness", "Cleansing")
    )
}

/**
 * Diagnostics and spiritual history for Seekers.
 */
data class SeekerDiagnostics(
    val afflictionDuration: String = "3 Years",
    val kuldeviIssues: String = "Kuldevi Puja Pending",
    val targetOutcome: String = "Peace & Health"
)

/**
 * Profile Entity for Healers, Trainees, Devotees, and Admin.
 * Contains 16-digit alphanumeric reference code tracking.
 */
data class HealerProfile(
    val id: String,
    val referenceCode: String,      // 16-digit alphanumeric (e.g., SKHM-9A4B-7C2D-8E1F)
    val referredByCode: String,     // 16-digit sponsor / upline code
    val transferredCode: String? = null, // Transfer history code if reassigned
    val name: String,
    val phone: String,
    val email: String,
    val profileType: ProfileType,
    val level: Int,                 // Generation / Level in organization (1 to 5+)
    val objective: String,          // Spiritual goal & purpose
    val selectedRemedies: List<String> = emptyList(), // Selected remedy / sadhana IDs
    val address: String = "",
    val city: String = "",
    val joinDate: String = "",
    val isActive: Boolean = true,
    val isPaid: Boolean = true,
    val selfTitle: String = "",
    val notes: String = "",
    val lineage: ThreeGenLineage = ThreeGenLineage(),
    val categoryTag: String = "",
    val seekerDiagnostics: SeekerDiagnostics = SeekerDiagnostics()
) {
    val formattedRoleBadge: String
        get() = when (profileType) {
            ProfileType.ADMIN -> "Master Guide • Founder • Level 1"
            ProfileType.HEALER -> "Healer • ${categoryTag.ifBlank { "Cleansing & Guidance" }} • Level $level"
            ProfileType.TRAINEE -> "Trainee • ${categoryTag.ifBlank { "Sadhanas & Mentorship" }} • Level $level"
            ProfileType.DEVOTEE -> "Seeker • House Clean • Level $level"
        }
}

/**
 * Notice & Guidance Item for User Tab.
 */
data class UserNoticeItem(
    val id: String,
    val title: String,
    val summary: String,
    val fullContent: String,
    val date: String,
    val author: String,
    val targetProfiles: List<ProfileType> = ProfileType.entries,
    val priorityBadge: String = "DAILY GUIDANCE"
)

/**
 * Interactive Todo Task for Daily Spiritual Practice.
 */
data class UserTodoItem(
    val id: String,
    val taskTitle: String,
    val subText: String,
    val category: String, // "Japa", "Diya", "Sadhana", "Meditation"
    val isCompleted: Boolean = false,
    val targetCount: Int = 1,
    val completedCount: Int = 0,
    val profileType: ProfileType = ProfileType.DEVOTEE
)

/**
 * Chat message for Spiritual Karim Assistant.
 */
data class ChatMessage(
    val id: String,
    val sender: String, // "user" or "karim_bot"
    val message: String,
    val timestamp: String,
    val isFromUser: Boolean = false
)

/**
 * MsgBot Broadcast Announcement.
 */
data class MsgBotBroadcast(
    val id: String,
    val senderName: String,
    val senderRole: String,
    val message: String,
    val timestamp: String,
    val levelTag: String = "Level 1 Broadcast",
    val isUrgent: Boolean = false
)
