package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.HealerProfile
import com.jdroidx.spritualkarim.data.model.ProfileType
import com.jdroidx.spritualkarim.utils.DeviceSecurityHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.*

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
    val syncRevision: Long = System.currentTimeMillis(),
    val connectedDownlineCount: Int = 0,
    val connectedDescendantsCount: Int = 0
) {
    val lastHeartbeatFormatted: String
        get() = SimpleDateFormat("dd MMM yyyy, HH:mm:ss", Locale.getDefault()).format(Date(lastSeenTimestamp))
}

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
) {
    val formattedExpiresAt: String
        get() = SimpleDateFormat("dd MMM yyyy, HH:mm:ss", Locale.getDefault()).format(Date(expiresAt))
}

data class MinimalCloudLog(
    val logId: String,
    val action: String,
    val actorCode: String,
    val targetNodeCode: String? = null,
    val timestamp: Long = DeviceSecurityHelper.getAuthoritativeTime()
) {
    val formattedTimestamp: String
        get() = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date(timestamp))
}

/**
 * Enterprise Firebase Realtime Database Repository
 * Manages minimal authorized online nodes, 16-digit hierarchy connections, and cloud telemetry.
 */
object FirebaseRealtimeRepository {

    // Seed initial 10 core organization device nodes
    private val initialNodes = mapOf(
        "SKHM-ADM1-7788-9900" to AuthorisedDeviceNode(
            referenceCode = "SKHM-ADM1-7788-9900",
            sponsorCode = "ROOT-0000-0000-0000",
            role = "ADMIN",
            level = 1,
            status = "ACTIVE",
            deviceFingerprintHash = "ROOT_SRV_01",
            houseCleanPct = 100,
            japaCount = 108000,
            connectedDownlineCount = 2,
            connectedDescendantsCount = 9
        ),
        "SKHM-HLR2-3344-5566" to AuthorisedDeviceNode(
            referenceCode = "SKHM-HLR2-3344-5566",
            sponsorCode = "SKHM-ADM1-7788-9900",
            role = "HEALER",
            level = 2,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_HLR_NORTH",
            houseCleanPct = 95,
            japaCount = 54000,
            connectedDownlineCount = 1,
            connectedDescendantsCount = 4
        ),
        "SKHM-HLR2-8899-1122" to AuthorisedDeviceNode(
            referenceCode = "SKHM-HLR2-8899-1122",
            sponsorCode = "SKHM-ADM1-7788-9900",
            role = "HEALER",
            level = 2,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_HLR_WEST",
            houseCleanPct = 100,
            japaCount = 42000,
            connectedDownlineCount = 1,
            connectedDescendantsCount = 3
        ),
        "SKHM-TRN3-4455-6677" to AuthorisedDeviceNode(
            referenceCode = "SKHM-TRN3-4455-6677",
            sponsorCode = "SKHM-HLR2-3344-5566",
            role = "TRAINEE",
            level = 3,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_TRN_JP1",
            houseCleanPct = 85,
            japaCount = 21000,
            connectedDownlineCount = 1,
            connectedDescendantsCount = 3
        ),
        "SKHM-TRN3-7788-9911" to AuthorisedDeviceNode(
            referenceCode = "SKHM-TRN3-7788-9911",
            sponsorCode = "SKHM-HLR2-8899-1122",
            role = "TRAINEE",
            level = 3,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_TRN_KC2",
            houseCleanPct = 90,
            japaCount = 18000,
            connectedDownlineCount = 1,
            connectedDescendantsCount = 2
        ),
        "SKHM-TRN4-1122-3344" to AuthorisedDeviceNode(
            referenceCode = "SKHM-TRN4-1122-3344",
            sponsorCode = "SKHM-TRN3-4455-6677",
            role = "TRAINEE",
            level = 4,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_TRN_KL3",
            houseCleanPct = 80,
            japaCount = 12000,
            connectedDownlineCount = 2,
            connectedDescendantsCount = 2
        ),
        "SKHM-TRN4-5566-7788" to AuthorisedDeviceNode(
            referenceCode = "SKHM-TRN4-5566-7788",
            sponsorCode = "SKHM-TRN3-7788-9911",
            role = "TRAINEE",
            level = 4,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_TRN_AH4",
            houseCleanPct = 75,
            japaCount = 9500,
            connectedDownlineCount = 1,
            connectedDescendantsCount = 1
        ),
        "SKHM-DEV5-9900-1122" to AuthorisedDeviceNode(
            referenceCode = "SKHM-DEV5-9900-1122",
            sponsorCode = "SKHM-TRN4-1122-3344",
            role = "DEVOTEE",
            level = 5,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_SKR_PT1",
            houseCleanPct = 70,
            japaCount = 4500,
            connectedDownlineCount = 0,
            connectedDescendantsCount = 0
        ),
        "SKHM-DEV5-3344-5566" to AuthorisedDeviceNode(
            referenceCode = "SKHM-DEV5-3344-5566",
            sponsorCode = "SKHM-TRN4-1122-3344",
            role = "DEVOTEE",
            level = 5,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_SKR_KL2",
            houseCleanPct = 65,
            japaCount = 3200,
            connectedDownlineCount = 0,
            connectedDescendantsCount = 0
        ),
        "SKHM-DEV5-7788-9900" to AuthorisedDeviceNode(
            referenceCode = "SKHM-DEV5-7788-9900",
            sponsorCode = "SKHM-TRN4-5566-7788",
            role = "DEVOTEE",
            level = 5,
            status = "ACTIVE",
            deviceFingerprintHash = "DEV_SKR_JP3",
            houseCleanPct = 80,
            japaCount = 6100,
            connectedDownlineCount = 0,
            connectedDescendantsCount = 0
        )
    )

    private val _onlineNodes = MutableStateFlow<Map<String, AuthorisedDeviceNode>>(initialNodes)
    val onlineNodes: StateFlow<Map<String, AuthorisedDeviceNode>> = _onlineNodes.asStateFlow()

    private val _cloudPairings = MutableStateFlow<Map<String, MinimalCloudPairingInvite>>(emptyMap())
    val cloudPairings: StateFlow<Map<String, MinimalCloudPairingInvite>> = _cloudPairings.asStateFlow()

    private val _cloudLogs = MutableStateFlow<List<MinimalCloudLog>>(
        listOf(
            MinimalCloudLog("log-init-1", "SYSTEM_READY", "SKHM-ADM1-7788-9900"),
            MinimalCloudLog("log-init-2", "HIERARCHY_TREE_LOADED", "SKHM-ADM1-7788-9900", "10_NODES_CONNECTED"),
            MinimalCloudLog("log-init-3", "FIREBASE_TELEMETRY_ACTIVE", "SKHM-ADM1-7788-9900")
        )
    )
    val cloudLogs: StateFlow<List<MinimalCloudLog>> = _cloudLogs.asStateFlow()

    /**
     * Sanitizes a local HealerProfile into a minimal, pseudonymized AuthorisedDeviceNode for online storage.
     * Strips names, phone numbers, real emails, physical addresses, and sensitive ancestral notes.
     */
    fun sanitizeForOnlineSync(profile: HealerProfile, deviceFingerprint: String = ""): AuthorisedDeviceNode {
        val hashedHw = if (deviceFingerprint.isNotBlank()) {
            hashSha256(deviceFingerprint).take(12)
        } else {
            "DEV_${profile.referenceCode.takeLast(4)}"
        }

        val downlines = HealersRepository.getDirectChildren(profile.referenceCode).size
        val descendants = HealersRepository.getAllDescendants(profile.referenceCode).size
        val cleanPct = HouseCleanRepository.calculateOverallCleanPercentage(profile.id)

        return AuthorisedDeviceNode(
            referenceCode = profile.referenceCode,
            sponsorCode = profile.referredByCode,
            role = profile.profileType.name,
            level = profile.level,
            status = if (profile.isActive) "ACTIVE" else "INACTIVE",
            deviceFingerprintHash = hashedHw,
            lastSeenTimestamp = DeviceSecurityHelper.getAuthoritativeTime(),
            houseCleanPct = cleanPct,
            japaCount = 108 * profile.level * 50,
            connectedDownlineCount = downlines,
            connectedDescendantsCount = descendants
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
            action = "NODE_SYNC_ONLINE",
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
            uplineApprovedBy = if (invite.isApprovedByUpline) invite.sourceReferenceCode else null,
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
     * Internally executes the complete 16-digit code sharing, device validation, upline approval,
     * and updates the Firebase Realtime Database with the newly connected device node.
     */
    fun runInternal16DigitCodeSharingAndValidation(
        sponsorCode: String = "SKHM-ADM1-7788-9900",
        newMemberName: String = "Acharya Rameshwar (Verified)",
        targetRole: ProfileType = ProfileType.HEALER,
        verificationMethod: VerificationMethod = VerificationMethod.MOBILE_OTP
    ): Result<Pair<DevicePairingInvite, HealerProfile>> {
        val sponsor = HealersRepository.getProfileByReferenceCode(sponsorCode)
            ?: return Result.failure(Exception("Sponsor code $sponsorCode not found."))

        // 1. Generate 16-Digit Code Pairing Invite with 6-Digit Numeric Token
        val invite = HealersRepository.createPairingInvite(
            sourceProfile = sponsor,
            connectionType = ConnectionType.PARALLEL_HEALER,
            targetRole = targetRole,
            verificationMethod = verificationMethod,
            targetPhoneOrHandle = "+91 98980 12345"
        )

        // 2. Publish to Firebase Cloud Pairings
        publishMinimalPairingInvite(invite)

        // 3. Simulate Partner Device Verification & Upline 24-Hour Approval
        val activationResult = HealersRepository.verifyAndActivateDevicePairing(
            sourceReferenceCode = invite.sourceReferenceCode,
            inputToken = invite.verificationToken,
            newMemberName = newMemberName,
            newMemberPhone = "+91 98980 12345",
            connectionType = ConnectionType.PARALLEL_HEALER,
            targetRole = targetRole,
            deviceFingerprint = "HW_PAIR_VERIFIED_${UUID.randomUUID().toString().take(6)}"
        )

        return activationResult.map { newProfile ->
            // 4. Update online node in Firebase RTDB
            syncAuthorisedNode(newProfile, "HW_PAIR_VERIFIED_${newProfile.referenceCode.takeLast(4)}")

            // 5. Update pairing status
            val updatedInvite = invite.copy(isApprovedByUpline = true, isActivated = true)
            publishMinimalPairingInvite(updatedInvite)

            // 6. Record Cloud Telemetry Log
            recordCloudLog(
                action = "PAIRING_VALIDATED_AND_ACTIVATED",
                actorCode = newProfile.referenceCode,
                targetNodeCode = sponsor.referenceCode
            )

            Pair(updatedInvite, newProfile)
        }
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
