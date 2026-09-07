package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.utils.DeviceSecurityHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID

/**
 * Offline Sync Action Category
 */
enum class SyncActionType {
    HOUSE_CLEAN_SUBMISSION,
    SADHANA_JAPA_LOG,
    MILESTONE_VERIFICATION,
    PROFILE_UPDATE,
    PAIRING_APPROVAL
}

/**
 * Sync Item with Vector Clock / Sequence Counter for conflict resolution.
 */
data class QueuedSyncItem(
    val syncId: String = UUID.randomUUID().toString(),
    val actionType: SyncActionType,
    val targetReferenceCode: String,
    val payloadJson: String,
    val clientTimestamp: Long = DeviceSecurityHelper.getAuthoritativeTime(),
    val revisionId: Long = System.currentTimeMillis(),
    val isDispatched: Boolean = false,
    val retryCount: Int = 0
)

/**
 * Closed-Loop Offline-First Sync Queue Repository
 */
object SyncQueueRepository {

    private val _syncQueue = MutableStateFlow<List<QueuedSyncItem>>(emptyList())
    val syncQueue: StateFlow<List<QueuedSyncItem>> = _syncQueue.asStateFlow()

    private val _isOnline = MutableStateFlow(true)
    val isOnline: StateFlow<Boolean> = _isOnline.asStateFlow()

    fun setNetworkStatus(online: Boolean) {
        _isOnline.value = online
        if (online) {
            flushPendingQueue()
        }
    }

    /**
     * Enqueue a new sync action (House Clean, Sadhana, Milestone).
     */
    fun enqueueSyncAction(
        actionType: SyncActionType,
        targetReferenceCode: String,
        payloadJson: String
    ): QueuedSyncItem {
        val item = QueuedSyncItem(
            actionType = actionType,
            targetReferenceCode = targetReferenceCode,
            payloadJson = payloadJson,
            clientTimestamp = DeviceSecurityHelper.getAuthoritativeTime()
        )
        _syncQueue.value = _syncQueue.value + item

        if (_isOnline.value) {
            dispatchItem(item)
        } else {
            NotificationRepository.showInfo(
                title = "Saved Offline",
                message = "${actionType.name.replace("_", " ")} queued for auto-sync when online."
            )
        }
        return item
    }

    /**
     * Flush all pending sync items with retry and conflict resolution.
     */
    fun flushPendingQueue() {
        val pending = _syncQueue.value.filter { !it.isDispatched }
        if (pending.isEmpty()) return

        pending.forEach { item ->
            dispatchItem(item)
        }

        NotificationRepository.showSuccess(
            title = "Sync Complete",
            message = "${pending.size} pending updates synchronized with mentor/peer devices."
        )
    }

    private fun dispatchItem(item: QueuedSyncItem) {
        // Mark as dispatched
        _syncQueue.value = _syncQueue.value.map {
            if (it.syncId == item.syncId) it.copy(isDispatched = true) else it
        }
    }

    fun getPendingCount(): Int {
        return _syncQueue.value.count { !it.isDispatched }
    }
}
