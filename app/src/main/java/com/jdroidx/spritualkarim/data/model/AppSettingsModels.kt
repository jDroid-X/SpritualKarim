package com.jdroidx.spritualkarim.data.model

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Priority and visual category for in-app and slide notifications.
 */
enum class NotificationType(val title: String, val badgeColorHex: Long) {
    INFO("Information", 0xFF00D084),
    SUCCESS("Success", 0xFF00D084),
    WARNING("Alert", 0xFFFF6900),
    ERROR("Error", 0xFFCF222E),
    CRITICAL("Urgent Notice", 0xFFAB3B5E),
    DIVINE("Divine Blessing", 0xFFFCB900)
}

/**
 * Data model for animated Slide-In/Slide-Out notifications.
 */
data class AppNotification(
    val id: String = "notif-${System.currentTimeMillis()}-${(100..999).random()}",
    val title: String,
    val message: String,
    val type: NotificationType = NotificationType.INFO,
    val timestamp: String = java.text.SimpleDateFormat("hh:mm a", java.util.Locale.getDefault()).format(java.util.Date()),
    val durationMs: Long = 4000L,
    val actionLabel: String? = null,
    val onAction: (() -> Unit)? = null
)

/**
 * Represents a dynamic system variable editable from Settings or Admin portal.
 * Eliminates hardcoded values across the app (OOPS MVC pattern).
 */
data class DynamicSystemVariable(
    val key: String,
    val label: String,
    val value: String,
    val category: String, // "Lineage & Code", "Notifications", "Sadhanas", "Threshold Diya", "Device Sync"
    val isEditable: Boolean = true,
    val validationRegex: String? = null,
    val description: String = ""
)

/**
 * Group-by device configuration model.
 * Enables relative device hierarchy and group routing without hardcoded device IDs.
 */
data class DeviceGroupConfig(
    val groupId: String,
    val groupName: String,
    val masterReferenceCode: String,
    val assignedSeekersCount: Int = 0,
    val maxCapacity: Int = 50,
    val autoSyncIntervalMinutes: Int = 15,
    val isTrackingActive: Boolean = true
)

/**
 * Notification preferences model.
 */
data class NotificationConfig(
    val areNotificationsEnabled: Boolean = true,
    val soundEnabled: Boolean = true,
    val vibrationEnabled: Boolean = true,
    val slideInEnabled: Boolean = true,
    val autoDismissSeconds: Int = 4,
    val slideFromRightBottom: Boolean = true,
    val maxConcurrentQueue: Int = 3
)
