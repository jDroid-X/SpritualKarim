package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.*

enum class PairingStatus {
    PENDING,
    APPROVED,
    EXPIRED,
    REJECTED
}

data class PairingInvite(
    val id: String,
    val sponsorCode: String,
    val seekerName: String,
    val seekerPhone: String,
    val seekerDeviceModel: String,
    val telegramLink: String,
    val apkDownloadUrl: String = "https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk",
    val createdAtMs: Long = System.currentTimeMillis(),
    val expiresAtMs: Long = System.currentTimeMillis() + (24 * 60 * 60 * 1000L), // 24 Hours
    var status: PairingStatus = PairingStatus.PENDING,
    var resendCount: Int = 0,
    val formattedCreatedTime: String = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(Date())
) {
    val isExpired: Boolean
        get() = status == PairingStatus.PENDING && System.currentTimeMillis() > expiresAtMs

    fun remainingTimeFormatted(): String {
        if (status == PairingStatus.APPROVED) return "Approved & Linked"
        if (status == PairingStatus.REJECTED) return "Rejected"
        val remainingMs = expiresAtMs - System.currentTimeMillis()
        if (remainingMs <= 0) return "Expired (24h Window Ended)"
        val hours = remainingMs / (1000 * 60 * 60)
        val minutes = (remainingMs / (1000 * 60)) % 60
        val seconds = (remainingMs / 1000) % 60
        return String.format(Locale.getDefault(), "%02dh %02dm %02ds remaining", hours, minutes, seconds)
    }
}

data class HouseCleanSyncLog(
    val id: String,
    val devoteeId: String,
    val devoteeName: String,
    val cleanTitle: String,
    val completedPoints: Int,
    val totalPoints: Int,
    val status: String = "Under Energetic Review",
    val timestamp: String = SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault()).format(Date()),
    val mentorGuidance: String = "Energy shifting positively. Maintain sacred smoke fumigation."
)

data class SadhanaSyncLog(
    val id: String,
    val devoteeId: String,
    val devoteeName: String,
    val sadhanaTitle: String,
    val malasCompleted: Int,
    val progressPercent: Int,
    val status: String = "Verified",
    val timestamp: String = SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault()).format(Date())
)

/**
 * Repository powering the personalized User Tab on the Home screen.
 * Provides Today's Notices, Todo List, Chatbot Assistant, MsgBot broadcasts,
 * 24-Hour Device Pairing Protocol, and 1-to-1 Bi-Directional Sync.
 */
object UserHubRepository {

    private val _selectedProfileType = MutableStateFlow(ProfileType.DEVOTEE)
    val selectedProfileType: StateFlow<ProfileType> = _selectedProfileType.asStateFlow()

    fun setProfileType(type: ProfileType) {
        _selectedProfileType.value = type
    }

    // ==========================================
    // 1. TODAY'S NOTICES & SPIRITUAL GUIDANCE
    // ==========================================
    private val initialNotices = listOf(
        UserNoticeItem(
            id = "notice-01",
            title = "Auspicious Rahu Kaal & Sandhya Muhurta",
            summary = "Perform Three Diya lighting strictly between 6:15 PM and 7:00 PM today for rapid obstacle clearance.",
            fullContent = "Today's planetary alignment is exceptionally beneficial for clearing stagnant negativity and debt hurdles. Ensure that all oil lamps are lit facing North-East. Do not let smoke scatter inside the sanctum without chanting the sacred Gayatri Mantra 11 times.",
            date = "Today • Live Circular",
            author = "Karim Ji (Founder)",
            targetProfiles = listOf(ProfileType.ADMIN, ProfileType.HEALER, ProfileType.TRAINEE, ProfileType.DEVOTEE),
            priorityBadge = "DAILY MUHURTA"
        ),
        UserNoticeItem(
            id = "notice-02",
            title = "Healer & Trainee Weekly Mentorship Meet",
            summary = "Level 2 to Level 4 members are requested to review downline devotee sadhana completion sheets.",
            fullContent = "All registered Healers and Trainees must cross-verify their 16-digit reference code downlines before Friday midnight. Ensure each devotee has received their remedy count logs and bakhoor incense instructions.",
            date = "Today • Admin Notice",
            author = "Acharya Rajesh Sharma (Lead Healer)",
            targetProfiles = listOf(ProfileType.ADMIN, ProfileType.HEALER, ProfileType.TRAINEE),
            priorityBadge = "ORGANIZATION"
        ),
        UserNoticeItem(
            id = "notice-03",
            title = "Kalashtami & Bhairav Cleansing Protocol",
            summary = "Guidelines for upcoming Ashtami: keep mustard oil diya on black cloth near main threshold.",
            fullContent = "Devotees suffering from chronic malefic planetary effects or court cases should start their Kalashtami sankalpa early morning. Offer black sesame seeds in running water after completing 108 Mahamrityunjaya chants.",
            date = "Upcoming Notice",
            author = "Dr. Sunita Deshmukh",
            targetProfiles = listOf(ProfileType.DEVOTEE, ProfileType.TRAINEE),
            priorityBadge = "REMEDY ALERT"
        )
    )

    private val _notices = MutableStateFlow<List<UserNoticeItem>>(initialNotices)
    val notices: StateFlow<List<UserNoticeItem>> = _notices.asStateFlow()

    // ==========================================
    // 2. TODO LIST (DAILY SADHANA & REMEDY TASKS)
    // ==========================================
    private val initialTodos = listOf(
        UserTodoItem(
            id = "todo-01",
            taskTitle = "Morning Mahamrityunjaya Japa",
            subText = "108 counts with Rudraksha mala facing East",
            category = "Japa",
            isCompleted = true,
            targetCount = 108,
            completedCount = 108,
            profileType = ProfileType.DEVOTEE
        ),
        UserTodoItem(
            id = "todo-02",
            taskTitle = "Evening Three Diya Lighting",
            subText = "3 Sesame/Mustard oil lamps at entrance and altar",
            category = "Diya",
            isCompleted = false,
            targetCount = 3,
            completedCount = 0,
            profileType = ProfileType.DEVOTEE
        ),
        UserTodoItem(
            id = "todo-03",
            taskTitle = "Bakhoor & Loban Smoke Cleansing",
            subText = "Spread sacred smoke across all 4 corners of home",
            category = "Sadhana",
            isCompleted = false,
            targetCount = 1,
            completedCount = 0,
            profileType = ProfileType.DEVOTEE
        ),
        UserTodoItem(
            id = "todo-04",
            taskTitle = "Review Devotee Downline Sadhana Logs",
            subText = "Verify Level 4 & Level 5 sadhana completion logs",
            category = "Mentorship",
            isCompleted = false,
            targetCount = 5,
            completedCount = 2,
            profileType = ProfileType.HEALER
        ),
        UserTodoItem(
            id = "todo-05",
            taskTitle = "Sri Yantra Concentrated Trataka",
            subText = "15 minutes visual focus on Bindu with Beej Mantra",
            category = "Meditation",
            isCompleted = false,
            targetCount = 15,
            completedCount = 0,
            profileType = ProfileType.TRAINEE
        )
    )

    private val _todos = MutableStateFlow<List<UserTodoItem>>(initialTodos)
    val todos: StateFlow<List<UserTodoItem>> = _todos.asStateFlow()

    fun toggleTodo(id: String) {
        val current = _todos.value.toMutableList()
        val index = current.indexOfFirst { it.id == id }
        if (index != -1) {
            val item = current[index]
            val newCompleted = !item.isCompleted
            current[index] = item.copy(
                isCompleted = newCompleted,
                completedCount = if (newCompleted) item.targetCount else 0
            )
            _todos.value = current
        }
    }

    fun addTodo(title: String, subText: String, category: String, profileType: ProfileType) {
        val current = _todos.value.toMutableList()
        val newTodo = UserTodoItem(
            id = "todo-${UUID.randomUUID().toString().take(6)}",
            taskTitle = title,
            subText = subText,
            category = category,
            isCompleted = false,
            targetCount = 1,
            completedCount = 0,
            profileType = profileType
        )
        current.add(0, newTodo)
        _todos.value = current
    }

    fun deleteTodo(id: String) {
        _todos.value = _todos.value.filter { it.id != id }
    }

    const val NOTEBOOKLM_URL = "https://notebooklm.google.com/notebook/cade9713-6b9b-4868-88dc-6e554bddc58b"

    // ==========================================
    // 3. 24-HOUR VALIDATION & DEVICE PAIRING PROTOCOL
    // ==========================================
    private val initialInvites = listOf(
        PairingInvite(
            id = "inv-01",
            sponsorCode = "SK-7842-8921",
            seekerName = "Ananya Sharma",
            seekerPhone = "+91 98112 33445",
            seekerDeviceModel = "Samsung Galaxy SM-G998B",
            telegramLink = "https://t.me/SpiritualKarimBot?start=pair_SK-7842-8921",
            status = PairingStatus.PENDING,
            resendCount = 0
        ),
        PairingInvite(
            id = "inv-02",
            sponsorCode = "SK-7842-8921",
            seekerName = "Vikram Aditya",
            seekerPhone = "+91 98223 44556",
            seekerDeviceModel = "OnePlus 11 5G",
            telegramLink = "https://t.me/SpiritualKarimBot?start=pair_SK-7842-8921",
            status = PairingStatus.APPROVED,
            resendCount = 0
        )
    )

    private val _pairingInvites = MutableStateFlow<List<PairingInvite>>(initialInvites)
    val pairingInvites: StateFlow<List<PairingInvite>> = _pairingInvites.asStateFlow()

    fun createPairingInvite(
        sponsorCode: String,
        seekerName: String,
        seekerPhone: String,
        deviceModel: String = "Android Device"
    ): PairingInvite {
        val current = _pairingInvites.value.toMutableList()
        val newInvite = PairingInvite(
            id = "inv-${UUID.randomUUID().toString().take(6)}",
            sponsorCode = sponsorCode,
            seekerName = seekerName.ifBlank { "New Seeker" },
            seekerPhone = seekerPhone,
            seekerDeviceModel = deviceModel,
            telegramLink = "https://t.me/SpiritualKarimBot?start=pair_$sponsorCode",
            status = PairingStatus.PENDING
        )
        current.add(0, newInvite)
        _pairingInvites.value = current
        return newInvite
    }

    fun approvePairingInvite(inviteId: String) {
        val current = _pairingInvites.value.toMutableList()
        val index = current.indexOfFirst { it.id == inviteId }
        if (index != -1) {
            val invite = current[index]
            current[index] = invite.copy(status = PairingStatus.APPROVED)
            _pairingInvites.value = current
            NotificationRepository.showSuccess(
                title = "Device Hierarchy Linked",
                message = "${invite.seekerName} (${invite.seekerDeviceModel}) is officially approved and sealed under sponsor ${invite.sponsorCode}."
            )
        }
    }

    fun rejectPairingInvite(inviteId: String) {
        val current = _pairingInvites.value.toMutableList()
        val index = current.indexOfFirst { it.id == inviteId }
        if (index != -1) {
            current[index] = current[index].copy(status = PairingStatus.REJECTED)
            _pairingInvites.value = current
        }
    }

    fun resendPairingInvite(inviteId: String): PairingInvite? {
        val current = _pairingInvites.value.toMutableList()
        val index = current.indexOfFirst { it.id == inviteId }
        if (index != -1) {
            val old = current[index]
            val refreshed = old.copy(
                createdAtMs = System.currentTimeMillis(),
                expiresAtMs = System.currentTimeMillis() + (24 * 60 * 60 * 1000L),
                status = PairingStatus.PENDING,
                resendCount = old.resendCount + 1
            )
            current[index] = refreshed
            _pairingInvites.value = current
            NotificationRepository.showSuccess(
                title = "24-Hour Link Refreshed",
                message = "New 24-hour pairing invitation window generated for ${refreshed.seekerName}."
            )
            return refreshed
        }
        return null
    }

    // ==========================================
    // 4. BI-DIRECTIONAL (1-TO-1) SYNC LOGS
    // ==========================================
    private val initialHouseCleanSync = listOf(
        HouseCleanSyncLog(
            id = "hc-01",
            devoteeId = "prof-dev-01",
            devoteeName = "Ananya Sharma",
            cleanTitle = "Living Room & Sanctum Space Cleansing",
            completedPoints = 8,
            totalPoints = 8,
            status = "Energetically Cleared",
            mentorGuidance = "Salt water threshold wash completed. Auric field sealed."
        )
    )

    private val _houseCleanSyncLogs = MutableStateFlow<List<HouseCleanSyncLog>>(initialHouseCleanSync)
    val houseCleanSyncLogs: StateFlow<List<HouseCleanSyncLog>> = _houseCleanSyncLogs.asStateFlow()

    private val initialSadhanaSync = listOf(
        SadhanaSyncLog(
            id = "sd-01",
            devoteeId = "prof-dev-01",
            devoteeName = "Ananya Sharma",
            sadhanaTitle = "Sri Yantra 11 Malas Japa",
            malasCompleted = 11,
            progressPercent = 100,
            status = "Verified by Karim Ji"
        )
    )

    private val _sadhanaSyncLogs = MutableStateFlow<List<SadhanaSyncLog>>(initialSadhanaSync)
    val sadhanaSyncLogs: StateFlow<List<SadhanaSyncLog>> = _sadhanaSyncLogs.asStateFlow()

    fun submitHouseCleanSync(devoteeId: String, devoteeName: String, cleanTitle: String, completed: Int, total: Int) {
        val current = _houseCleanSyncLogs.value.toMutableList()
        current.add(0, HouseCleanSyncLog(
            id = "hc-${UUID.randomUUID().toString().take(6)}",
            devoteeId = devoteeId,
            devoteeName = devoteeName,
            cleanTitle = cleanTitle,
            completedPoints = completed,
            totalPoints = total
        ))
        _houseCleanSyncLogs.value = current
        NotificationRepository.showSuccess(
            title = "1-to-1 House Clean Synced",
            message = "Cleansing submission sent to Mentor for energetic review."
        )
    }

    fun submitSadhanaSync(devoteeId: String, devoteeName: String, sadhanaTitle: String, malas: Int, progress: Int) {
        val current = _sadhanaSyncLogs.value.toMutableList()
        current.add(0, SadhanaSyncLog(
            id = "sd-${UUID.randomUUID().toString().take(6)}",
            devoteeId = devoteeId,
            devoteeName = devoteeName,
            sadhanaTitle = sadhanaTitle,
            malasCompleted = malas,
            progressPercent = progress
        ))
        _sadhanaSyncLogs.value = current
        NotificationRepository.showSuccess(
            title = "1-to-1 Sadhana Synced",
            message = "$malas Malas synchronized with Upline Mentor."
        )
    }

    // ==========================================
    // 5. SPIRITUAL KARIM ASSISTANT CHATBOT
    // ==========================================
    private val initialChatMessages = listOf(
        ChatMessage(
            id = "msg-01",
            sender = "karim_bot",
            message = "Pranam! I am your Spiritual Karim Assistant powered by our Vedic repository and connected with Google NotebookLM AI Knowledge Base. How may I guide your sadhana, remedies, or organization code today?",
            timestamp = "Just now",
            isFromUser = false
        )
    )

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(initialChatMessages)
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    fun sendChatMessage(userText: String) {
        val current = _chatMessages.value.toMutableList()
        val timeStr = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())

        val userMsg = ChatMessage(
            id = "user-${UUID.randomUUID().toString().take(6)}",
            sender = "user",
            message = userText,
            timestamp = timeStr,
            isFromUser = true
        )
        current.add(userMsg)

        val botReplyText = generateSpiritualReply(userText)
        val botMsg = ChatMessage(
            id = "bot-${UUID.randomUUID().toString().take(6)}",
            sender = "karim_bot",
            message = botReplyText,
            timestamp = timeStr,
            isFromUser = false
        )
        current.add(botMsg)
        _chatMessages.value = current
    }

    private fun generateSpiritualReply(prompt: String): String {
        val q = prompt.lowercase()
        return when {
            q.contains("diya") || q.contains("three diya") ->
                "The Three Diya Process requires 3 pure sesame or mustard oil lamps lit during dusk (Sandhya Kaal). One at the main threshold, one in the prayer corner, and one near water source. This repels persistent negative energies and protects household aura."
            q.contains("sadhana") || q.contains("sri yantra") ->
                "For Sri Yantra Sadhana, establish a consecrated copper or crystal Yantra facing East. Chant 'Om Shreem Hreem Shreem Kamale Kamalalaye Praseed' 108 times during Brahma Muhurta. For complete discourse transcripts, you can also query our Google NotebookLM knowledge base."
            q.contains("code") || q.contains("reference") || q.contains("upline") || q.contains("hierarchy") ->
                "Every profile is assigned a unique 16-digit alphanumeric reference code (e.g., SKHM-XXXX-XXXX-XXXX). You can view, copy, or transfer downline connections in the Healers Portal across all 5 organization levels."
            q.contains("negativity") || q.contains("evil") || q.contains("nazar") ->
                "Spiritual Karim provides 100% Free Solutions for negativity removal. Cleanse your aura using Bakhoor incense smoke and recite the Chamunda Beej Mantra daily with genuine intention."
            q.contains("court") || q.contains("case") || q.contains("legal") ->
                "For legal disputes and court relief, observe the Kalashtami sankalpa and offer jaggery and roasted chickpeas on Tuesdays along with Three Diya remedy."
            q.contains("business") || q.contains("money") || q.contains("debt") ->
                "For business obstacles, perform the Lakshmi Kubera Upaya on Friday evenings with pure ghee lamp and keep Gomti Chakra in cash locker."
            q.contains("notebook") || q.contains("notebooklm") || q.contains("ai") || q.contains("gpt") ->
                "You can connect directly to our Google NotebookLM AI Spiritual Knowledge Base at:\nhttps://notebooklm.google.com/notebook/cade9713-6b9b-4868-88dc-6e554bddc58b\nIt contains verified transcripts, remedies, audio overviews, and source documents."
            else ->
                "May spiritual grace guide your path. For deeper queries, ask about Three Diya, Sri Yantra, Kalashtami, 16-digit codes, or tap 'Ask in NotebookLM' for extensive AI source synthesis."
        }
    }

    // ==========================================
    // 6. MSGBOT BROADCAST SYSTEM
    // ==========================================
    private val initialBroadcasts = listOf(
        MsgBotBroadcast(
            id = "bc-01",
            senderName = "Karim Ji",
            senderRole = "Master Admin",
            message = "Blessings to all Healers, Trainees, and Devotees. Ensure evening prayer continuity across all ashram circles.",
            timestamp = "10:30 AM",
            levelTag = "Level 1 Master Broadcast",
            isUrgent = true
        ),
        MsgBotBroadcast(
            id = "bc-02",
            senderName = "Acharya Rajesh Sharma",
            senderRole = "Senior Healer (Level 2)",
            message = "New batch of sacred Bakhoor blends and Sri Yantra plates dispatched for registered trainees.",
            timestamp = "09:15 AM",
            levelTag = "Level 2 Healers Circle",
            isUrgent = false
        ),
        MsgBotBroadcast(
            id = "bc-03",
            senderName = "Mentorship Council",
            senderRole = "Coordination Team",
            message = "Monthly 16-digit lineage code reconciliation is complete. Check downline statistics in your portal.",
            timestamp = "Yesterday",
            levelTag = "System Notification",
            isUrgent = false
        )
    )

    private val _broadcasts = MutableStateFlow<List<MsgBotBroadcast>>(initialBroadcasts)
    val broadcasts: StateFlow<List<MsgBotBroadcast>> = _broadcasts.asStateFlow()

    fun postBroadcast(senderName: String, role: String, message: String, isUrgent: Boolean) {
        val current = _broadcasts.value.toMutableList()
        val timeStr = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
        val newBc = MsgBotBroadcast(
            id = "bc-${UUID.randomUUID().toString().take(6)}",
            senderName = senderName,
            senderRole = role,
            message = message,
            timestamp = timeStr,
            levelTag = "$role Broadcast",
            isUrgent = isUrgent
        )
        current.add(0, newBc)
        _broadcasts.value = current
    }
}
