package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.HealerProfile
import com.jdroidx.spritualkarim.utils.DeviceSecurityHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.security.MessageDigest

/**
 * Minimalist, Privacy-Preserving Cloud Data Models for Firebase Realtime Database
 * (Enforces Enterprise Strict Data Minimization - No raw personal/ancestry data stored online)
 */
data class AuthorisedDeviceNode(
    val referenceCode: String,
    val sponsorCode: String?,
    val role: String,
    val level: Int,
    val status: String,
    val deviceFingerprintHash: String,
    val lastSeenTimestamp: Long = DeviceSecurityHelper.getAuthoritativeTime(),
    val houseCleanPct: Int = 0,
    val japaCount: Int = 0,
    val syncRevision: Long = System.currentTimeMillis()
)

data class MinimalCloudPairingInvite(
    val inviteId: String,
    val sourceCode: String,
    val targetRole: String,
    val tokenHash: String,
    val createdAt: Long,
    val expiresAt: Long,
    val isApproved: Boolean,
    val uplineApprovedBy: String? = null,
    val isActivated: Boolean = false
)

data class MinimalCloudLog(
    val logId: String,
    val action: String,
    val actorCode: String,
    val targetNodeCode: String? = null,
    val timestamp: Long = DeviceSecurityHelper.getAuthoritativeTime()
)

/**
 * Enterprise Firebase Realtime Database Repository
 * Manages minimal authorized online nodes and device-to-device connection metadata.
 */
object FirebaseRealtimeRepository {

    private val _onlineNodes = MutableStateFlow<Map<String, AuthorisedDeviceNode>>(emptyMap())
    val onlineNodes: StateFlow<Map<String, AuthorisedDeviceNode>> = _onlineNodes.asStateFlow()

    private val _cloudPairings = MutableStateFlow<Map<String, MinimalCloudPairingInvite>>(emptyMap())
    val cloudPairings: StateFlow<Map<String, MinimalCloudPairingInvite>> = _cloudPairings.asStateFlow()

    private val _cloudLogs = MutableStateFlow<List<MinimalCloudLog>>(emptyList())
    val cloudLogs: StateFlow<List<MinimalCloudLog>> = _cloudLogs.asStateFlow()

    /**
     * Sanitizes a local HealerProfile into a minimal, pseudonymized AuthorisedDeviceNode for online storage.
     * Strips names, phone numbers, real emails, physical addresses, and sensitive ancestral notes.
     */
    fun sanitizeForOnlineSync(profile: HealerProfile, deviceFingerprint: String = ""): AuthorisedDeviceNode {
        val hashedHw = if (deviceFingerprint.isNotBlank()) {
            hashSha256(deviceFingerprint).take(12)
        } else {
            "ANON_DEV"
        }

        return AuthorisedDeviceNode(
            referenceCode = profile.referenceCode,
            sponsorCode = profile.referredByCode,
            role = profile.profileType.name,
            level = profile.level,
            status = if (profile.isActive) "ACTIVE" else "INACTIVE",
            deviceFingerprintHash = hashedHw,
            lastSeenTimestamp = DeviceSecurityHelper.getAuthoritativeTime()
        )
    }

    /**
     * Publishes a sanitized device node to the online database.
     */
    fun syncAuthorisedNode(profile: HealerProfile, deviceFingerprint: String = "") {
        val sanitized = sanitizeForOnlineSync(profile, deviceFingerprint)
        val current = _onlineNodes.value.toMutableMap()
        current[sanitized.referenceCode] = sanitized
        _onlineNodes.value = current

        // Record minimal cloud audit log
        recordCloudLog(
            action = "NODE_HEARTBEAT",
            actorCode = sanitized.referenceCode,
            targetNodeCode = sanitized.sponsorCode
        )
    }

    /**
     * Publishes a minimal 24-hour pairing session online.
     */
    fun publishMinimalPairingInvite(invite: DevicePairingInvite) {
        val minimalInvite = MinimalCloudPairingInvite(
            inviteId = invite.inviteId,
            sourceCode = invite.sourceReferenceCode,
            targetRole = invite.targetRole.name,
            tokenHash = hashSha256(invite.verificationToken).take(16),
            createdAt = invite.createdAt,
            expiresAt = invite.expiresAt,
            isApproved = invite.isApprovedByUpline,
            uplineApprovedBy = null,
            isActivated = invite.isActivated
        )
        val current = _cloudPairings.value.toMutableMap()
        current[invite.inviteId] = minimalInvite
        _cloudPairings.value = current

        recordCloudLog(
            action = "PAIRING_INVITE_PUBLISHED",
            actorCode = invite.sourceReferenceCode
        )
    }

    /**
     * Records minimal cloud telemetry log without sensitive personal data.
     */
    fun recordCloudLog(action: String, actorCode: String, targetNodeCode: String? = null) {
        val log = MinimalCloudLog(
            logId = "log-${System.currentTimeMillis()}-${(1000..9999).random()}",
            action = action,
            actorCode = actorCode,
            targetNodeCode = targetNodeCode,
            timestamp = DeviceSecurityHelper.getAuthoritativeTime()
        )
        _cloudLogs.value = (_cloudLogs.value + log).takeLast(100) // keep last 100 in memory
    }

    private fun hashSha256(input: String): String {
        return try {
            val digest = MessageDigest.getInstance("SHA-256").digest(input.toByteArray(Charsets.UTF_8))
            digest.joinToString("") { "%02x".format(it) }
        } catch (e: Exception) {
            input.hashCode().toString()
        }
    }
}
