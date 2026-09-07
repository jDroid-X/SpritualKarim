package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.DeviceGroupConfig
import com.jdroidx.spritualkarim.data.model.DynamicSystemVariable
import com.jdroidx.spritualkarim.data.model.NotificationConfig
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Repository for dynamic system variables, device grouping, and user preferences.
 * Eliminates hardcoded values across all screens and allows real-time editing & saving.
 */
object AppSettingsRepository {

    // Dynamic System Variables (Editable from Settings)
    private val initialVariables = listOf(
        DynamicSystemVariable(
            key = "DEFAULT_SPONSOR_CODE",
            label = "Root Lineage Sponsor Code",
            value = "SKHM-ADM1-7788-9900",
            category = "Lineage & Pairing",
            isEditable = true,
            validationRegex = "^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$",
            description = "Default 16-digit sponsor code assigned to unattached novice seekers."
        ),
        DynamicSystemVariable(
            key = "TELEGRAM_BOT_HANDLE",
            label = "Lineage Telegram Bot Handle",
            value = "SpiritualKarimBot",
            category = "Lineage & Pairing",
            isEditable = true,
            description = "Telegram Bot username used for instant 16-digit QR & PIN verification."
        ),
        DynamicSystemVariable(
            key = "NOTEBOOKLM_PORTAL_URL",
            label = "Google NotebookLM AI URL",
            value = "https://notebooklm.google.com",
            category = "AI & Transcripts",
            isEditable = true,
            description = "Direct URL to access the official Spiritual Karim deep transcript reasoning AI."
        ),
        DynamicSystemVariable(
            key = "THREE_DIYA_EVENING_WINDOW",
            label = "Three Diya Sunset Window",
            value = "06:15 PM – 07:00 PM",
            category = "Remedies & Rituals",
            isEditable = true,
            description = "Optimal Godhuli Bela window for entrance threshold mustard oil lamps."
        ),
        DynamicSystemVariable(
            key = "DEFAULT_JAPA_TARGET_COUNT",
            label = "Default Daily Japa Target Count",
            value = "108",
            category = "Sadhanas",
            isEditable = true,
            validationRegex = "^[0-9]+$",
            description = "Standard single mala count for daily mantra recitations."
        ),
        DynamicSystemVariable(
            key = "CLEAN_MIN_APPROVAL_PERCENT",
            label = "House Clean Passing Rating (%)",
            value = "75",
            category = "House Clean",
            isEditable = true,
            validationRegex = "^([1-9][0-9]?|100)$",
            description = "Minimum certified clean rating required to unlock next ancestral level."
        ),
        DynamicSystemVariable(
            key = "GITHUB_RELEASE_DOWNLOAD_URL",
            label = "GitHub APK Download URL",
            value = "https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk",
            category = "Updates & Distribution",
            isEditable = true,
            description = "Direct download endpoint for latest Spiritual Karim Android APK from GitHub releases."
        ),
        DynamicSystemVariable(
            key = "GITHUB_REPO_URL",
            label = "GitHub Repository URL",
            value = "https://github.com/jDroid-X/SpritualKarim",
            category = "Updates & Distribution",
            isEditable = true,
            description = "Source code and release repository on GitHub."
        ),
        DynamicSystemVariable(
            key = "WEB_PORTAL_URL",
            label = "Online Web Portal URL",
            value = "https://jdroid-x.github.io/SpritualKarim/",
            category = "Updates & Distribution",
            isEditable = true,
            description = "Hosted responsive web portal on GitHub Pages."
        ),
        DynamicSystemVariable(
            key = "UPLINE_APPROVAL_TIMEOUT_HOURS",
            label = "Upline Approval Timeout (Hours)",
            value = "24",
            category = "Lineage & Pairing",
            isEditable = true,
            validationRegex = "^[0-9]+$",
            description = "Validity duration for device pairing link before expiring (Default: 24 Hours)."
        ),
        DynamicSystemVariable(
            key = "FIREBASE_DATABASE_URL",
            label = "Firebase Realtime Database URL",
            value = "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com",
            category = "Firebase & Telemetry",
            isEditable = true,
            description = "Endpoint URL for Firebase Realtime Database cloud instance (Project: spritualkarim-7b5fd)."
        ),
        DynamicSystemVariable(
            key = "FIREBASE_PROJECT_ID",
            label = "Firebase Project ID",
            value = "spritualkarim-7b5fd",
            category = "Firebase & Telemetry",
            isEditable = true,
            description = "Google Cloud & Firebase Project Identifier."
        ),
        DynamicSystemVariable(
            key = "DATA_MINIMIZATION_ENABLED",
            label = "Strict Data Minimization (Privacy)",
            value = "true",
            category = "Security & Privacy",
            isEditable = true,
            description = "Ensures only authorized pseudonyms and connection tokens sync online without sensitive personal data."
        )
    )

    private val _systemVariables = MutableStateFlow<List<DynamicSystemVariable>>(initialVariables)
    val systemVariables: StateFlow<List<DynamicSystemVariable>> = _systemVariables.asStateFlow()

    // Device Groups Configuration
    private val initialGroups = listOf(
        DeviceGroupConfig(
            groupId = "grp-north-01",
            groupName = "North India Devotee Lineage",
            masterReferenceCode = "SKHM-ADM1-7788-9900",
            assignedSeekersCount = 18,
            maxCapacity = 50,
            autoSyncIntervalMinutes = 15,
            isTrackingActive = true
        ),
        DeviceGroupConfig(
            groupId = "grp-west-02",
            groupName = "Maharashtra & Gujarat Sadhaks",
            masterReferenceCode = "SKHM-HEAL-1002-3344",
            assignedSeekersCount = 12,
            maxCapacity = 40,
            autoSyncIntervalMinutes = 30,
            isTrackingActive = true
        ),
        DeviceGroupConfig(
            groupId = "grp-intl-03",
            groupName = "Global Diaspora Seekers",
            masterReferenceCode = "SKHM-HEAL-2003-5566",
            assignedSeekersCount = 8,
            maxCapacity = 100,
            autoSyncIntervalMinutes = 60,
            isTrackingActive = true
        )
    )

    private val _deviceGroups = MutableStateFlow<List<DeviceGroupConfig>>(initialGroups)
    val deviceGroups: StateFlow<List<DeviceGroupConfig>> = _deviceGroups.asStateFlow()

    // Notification Preferences
    private val _notificationConfig = MutableStateFlow(NotificationConfig())
    val notificationConfig: StateFlow<NotificationConfig> = _notificationConfig.asStateFlow()

    // CRUD for Dynamic System Variables
    fun updateVariable(key: String, newValue: String): Boolean {
        val currentList = _systemVariables.value
        val variable = currentList.firstOrNull { it.key == key } ?: return false

        // Validate regex if defined
        if (variable.validationRegex != null) {
            val regex = Regex(variable.validationRegex)
            if (!regex.matches(newValue)) {
                return false
            }
        }

        _systemVariables.value = currentList.map {
            if (it.key == key) it.copy(value = newValue) else it
        }
        return true
    }

    fun getVariableValue(key: String, defaultValue: String = ""): String {
        return _systemVariables.value.firstOrNull { it.key == key }?.value ?: defaultValue
    }

    // Device Group Operations
    fun toggleGroupTracking(groupId: String) {
        _deviceGroups.value = _deviceGroups.value.map {
            if (it.groupId == groupId) it.copy(isTrackingActive = !it.isTrackingActive) else it
        }
    }

    fun updateNotificationConfig(config: NotificationConfig) {
        _notificationConfig.value = config
    }
}
