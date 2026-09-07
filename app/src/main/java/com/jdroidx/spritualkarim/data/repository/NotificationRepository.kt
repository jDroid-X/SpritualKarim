package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.AppNotification
import com.jdroidx.spritualkarim.data.model.NotificationType
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Global reactive Notification Repository.
 * Manages in-app popup dialogs and animated slide-in / slide-out notifications from bottom-right.
 */
object NotificationRepository {

    private val scope = CoroutineScope(Dispatchers.Main)
    private val _notifications = MutableStateFlow<List<AppNotification>>(emptyList())
    val notifications: StateFlow<List<AppNotification>> = _notifications.asStateFlow()

    fun showNotification(
        title: String,
        message: String,
        type: NotificationType = NotificationType.INFO,
        durationMs: Long = 4000L,
        actionLabel: String? = null,
        onAction: (() -> Unit)? = null
    ) {
        val notification = AppNotification(
            title = title,
            message = message,
            type = type,
            durationMs = durationMs,
            actionLabel = actionLabel,
            onAction = onAction
        )

        // Add to active notifications queue (limit to 3 concurrent)
        _notifications.value = (_notifications.value + notification).takeLast(3)

        // Auto-dismiss after duration
        if (durationMs > 0) {
            scope.launch {
                delay(durationMs)
                dismissNotification(notification.id)
            }
        }
    }

    fun dismissNotification(id: String) {
        _notifications.value = _notifications.value.filter { it.id != id }
    }

    fun clearAll() {
        _notifications.value = emptyList()
    }

    // Convenience Trigger Methods
    fun showSuccess(title: String, message: String) {
        showNotification(title = title, message = message, type = NotificationType.SUCCESS)
    }

    fun showInfo(title: String, message: String) {
        showNotification(title = title, message = message, type = NotificationType.INFO)
    }

    fun showWarning(title: String, message: String) {
        showNotification(title = title, message = message, type = NotificationType.WARNING)
    }

    fun showError(title: String, message: String) {
        showNotification(title = title, message = message, type = NotificationType.ERROR)
    }

    fun showDivine(title: String, message: String) {
        showNotification(title = title, message = message, type = NotificationType.DIVINE, durationMs = 5000L)
    }
}
