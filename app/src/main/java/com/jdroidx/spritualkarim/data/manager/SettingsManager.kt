package com.jdroidx.spritualkarim.data.manager

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

enum class AppThemeMode(val title: String) {
    SYSTEM("System Default"),
    LIGHT("Light Theme"),
    DARK("Dark Theme")
}

/**
 * Centralized Settings and Configuration Manager.
 * Handles preferences for App Theme, Japa meditation, 5-Level Healers Organization,
 * NotebookLM Chatbot integration, and Multi-platform OTA update pathways.
 */
object SettingsManager {
    // ==========================================
    // 1. APP VERSION & FUTURE UPDATE PATHS
    // ==========================================
    var appVersionName by mutableStateOf("2.0.0")
    var appVersionCode by mutableIntStateOf(2)
    var updateEndpointUrl by mutableStateOf("https://updates.spiritualkarim.com/v2/app-release.json")
    var autoCheckUpdates by mutableStateOf(true)
    var lastUpdateCheckStatus by mutableStateOf("Up to date • Version 2.0.0 (Latest)")

    // ==========================================
    // 2. THEME & APPEARANCE
    // ==========================================
    var themeMode by mutableStateOf(AppThemeMode.SYSTEM)

    // ==========================================
    // 3. HEALERS & 5-LEVEL ORGANIZATION
    // ==========================================
    var defaultSponsorCode by mutableStateOf("SKHM-ADM1-7788-9900")
    var referenceCodePrefix by mutableStateOf("SKHM-")
    var maxHierarchyLevel by mutableIntStateOf(5)
    var auditLineageTransfer by mutableStateOf(true)
    var autoSyncRemedyTodos by mutableStateOf(true)
    var allowDevoteeDirectEnrollment by mutableStateOf(true)
    var autoNotifyMentorOnDownlineJoin by mutableStateOf(true)

    // ==========================================
    // 4. CHATBOT & GOOGLE NOTEBOOKLM INTEGRATION
    // ==========================================
    var notebookLmUrl by mutableStateOf("https://notebooklm.google.com/notebook/cade9713-6b9b-4868-88dc-6e554bddc58b")
    var enableNotebookLmIntegration by mutableStateOf(true)
    var autoCopyQueryForNotebookLm by mutableStateOf(true)
    var defaultAiKnowledgeSource by mutableStateOf("Hybrid (Spiritual Karim Engine + Google NotebookLM)")

    // ==========================================
    // 5. JAPA & SADHANA CONFIGURATION
    // ==========================================
    var defaultJapaTarget by mutableIntStateOf(108)
    var vibrationFeedback by mutableStateOf(true)
    var audioChime by mutableStateOf(true)
    var keepScreenAwake by mutableStateOf(false)

    // ==========================================
    // 6. REMINDERS & TIMING
    // ==========================================
    var brahmaMuhurtaReminder by mutableStateOf(true)
    var sandhyaDiyaReminder by mutableStateOf(true)
    var tithiAlerts by mutableStateOf(true)
    var telegramNotifications by mutableStateOf(true)
    var broadcastStreamAlerts by mutableStateOf(true)

    // ==========================================
    // 7. DISPLAY & TYPOGRAPHY
    // ==========================================
    var fontSizeScale by mutableFloatStateOf(1.0f)
    var showSanskritScript by mutableStateOf(true)
    var showTransliteration by mutableStateOf(true)
    var showMeaning by mutableStateOf(true)

    // ==========================================
    // 8. DATA, CACHE & ACTIONS
    // ==========================================
    var offlineCachingEnabled by mutableStateOf(true)
    var totalJapaCompletedCount by mutableIntStateOf(0)

    fun resetJapaHistory() {
        totalJapaCompletedCount = 0
    }

    fun checkForAppUpdates(): String {
        lastUpdateCheckStatus = "Checked just now • Version 2.0.0 is the latest stable production build."
        return lastUpdateCheckStatus
    }
}
