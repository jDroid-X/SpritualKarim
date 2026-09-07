package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.LineageChatMessage
import com.jdroidx.spritualkarim.data.model.LineageConversation
import com.jdroidx.spritualkarim.data.model.MessageDeliveryStatus
import com.jdroidx.spritualkarim.data.model.MsgAttachmentType
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.*

/**
 * MsgBot Repository:
 * WhatsApp-style local database and communication hub for chatting with
 * Upline Mentors and Downline Devotees with Photo, Video, Audio and Voice attachments.
 */
object MsgBotRepository {

    private val seedConversations = listOf(
        LineageConversation(
            conversationId = "conv-upline-01",
            participantId = "prof-hlr-01",
            participantName = "Acharya Rajesh Sharma",
            participantRole = "Senior Healer (Upline Mentor)",
            participantCode = "SKHM-HLR2-3344-5566",
            participantLevel = 2,
            lastMessageText = "Blessings! Please check the Sri Yantra photo and complete evening Three Diya.",
            lastMessageTime = "11:45 AM",
            unreadCount = 1,
            isUpline = true
        ),
        LineageConversation(
            conversationId = "conv-admin-01",
            participantId = "prof-root-01",
            participantName = "Karim Ji (Founder)",
            participantRole = "Master Admin (L1)",
            participantCode = "SKHM-ADM1-7788-9900",
            participantLevel = 1,
            lastMessageText = "Voice Guidance: Mahamrityunjaya japa pronunciation instructions recorded.",
            lastMessageTime = "Yesterday",
            unreadCount = 0,
            isUpline = true
        ),
        LineageConversation(
            conversationId = "conv-downline-01",
            participantId = "prof-dev-01",
            participantName = "Priya Singh",
            participantRole = "Devotee (Downline L5)",
            participantCode = "SKHM-DEV5-1122-3344",
            participantLevel = 5,
            lastMessageText = "Guruji, I have uploaded my Three Diya altar verification video.",
            lastMessageTime = "10:15 AM",
            unreadCount = 2,
            isUpline = false
        ),
        LineageConversation(
            conversationId = "conv-downline-02",
            participantId = "prof-dev-02",
            participantName = "Amit Kumar Patel",
            participantRole = "Devotee (Downline L5)",
            participantCode = "SKHM-DEV5-5566-7788",
            participantLevel = 5,
            lastMessageText = "108 Gayatri Mantra Japa count completed for today.",
            lastMessageTime = "09:30 AM",
            unreadCount = 0,
            isUpline = false
        )
    )

    private val seedMessages = mutableListOf(
        // Thread with Acharya Rajesh Sharma
        LineageChatMessage(
            id = "msg-001",
            conversationId = "conv-upline-01",
            senderId = "prof-hlr-01",
            senderName = "Acharya Rajesh Sharma",
            senderRole = "Senior Healer",
            recipientId = "current-user",
            recipientName = "Me",
            text = "Pranam seeker! Welcome to our spiritual lineage. Please establish the North-East prayer corner first.",
            attachmentType = MsgAttachmentType.NONE,
            timestamp = "10:00 AM",
            status = MessageDeliveryStatus.READ,
            isFromMe = false
        ),
        LineageChatMessage(
            id = "msg-002",
            conversationId = "conv-upline-01",
            senderId = "current-user",
            senderName = "Me",
            senderRole = "Trainee",
            recipientId = "prof-hlr-01",
            recipientName = "Acharya Rajesh Sharma",
            text = "Pranam Guruji! Here is the photo of my altar setup with copper plate and oil lamps.",
            attachmentType = MsgAttachmentType.IMAGE,
            mediaFileName = "altar_setup_purification.jpg",
            timestamp = "10:15 AM",
            status = MessageDeliveryStatus.READ,
            isFromMe = true
        ),
        LineageChatMessage(
            id = "msg-003",
            conversationId = "conv-upline-01",
            senderId = "prof-hlr-01",
            senderName = "Acharya Rajesh Sharma",
            senderRole = "Senior Healer",
            recipientId = "current-user",
            recipientName = "Me",
            text = "Listen to this sacred Beej Mantra chant audio for energizing your Three Diya lamps:",
            attachmentType = MsgAttachmentType.AUDIO,
            mediaFileName = "beej_mantra_consecration.mp3",
            mediaDurationSeconds = 48,
            timestamp = "10:30 AM",
            status = MessageDeliveryStatus.READ,
            isFromMe = false
        ),
        LineageChatMessage(
            id = "msg-004",
            conversationId = "conv-upline-01",
            senderId = "prof-hlr-01",
            senderName = "Acharya Rajesh Sharma",
            senderRole = "Senior Healer",
            recipientId = "current-user",
            recipientName = "Me",
            text = "Blessings! Please check the Sri Yantra photo and complete evening Three Diya.",
            attachmentType = MsgAttachmentType.NONE,
            timestamp = "11:45 AM",
            status = MessageDeliveryStatus.DELIVERED,
            isFromMe = false
        ),

        // Thread with Karim Ji
        LineageChatMessage(
            id = "msg-101",
            conversationId = "conv-admin-01",
            senderId = "prof-root-01",
            senderName = "Karim Ji (Founder)",
            senderRole = "Master Admin",
            recipientId = "current-user",
            recipientName = "Me",
            text = "Voice Guidance: Mahamrityunjaya japa pronunciation instructions recorded.",
            attachmentType = MsgAttachmentType.AUDIO,
            mediaFileName = "karim_ji_mahamrityunjaya_guidance.mp3",
            mediaDurationSeconds = 120,
            timestamp = "Yesterday",
            status = MessageDeliveryStatus.READ,
            isFromMe = false
        ),

        // Thread with Priya Singh (Downline Devotee)
        LineageChatMessage(
            id = "msg-201",
            conversationId = "conv-downline-01",
            senderId = "prof-dev-01",
            senderName = "Priya Singh",
            senderRole = "Devotee",
            recipientId = "current-user",
            recipientName = "Me",
            text = "Pranam Mentor! I have started the Kalashtami sankalpa today.",
            attachmentType = MsgAttachmentType.NONE,
            timestamp = "09:00 AM",
            status = MessageDeliveryStatus.READ,
            isFromMe = false
        ),
        LineageChatMessage(
            id = "msg-202",
            conversationId = "conv-downline-01",
            senderId = "prof-dev-01",
            senderName = "Priya Singh",
            senderRole = "Devotee",
            recipientId = "current-user",
            recipientName = "Me",
            text = "Guruji, I have uploaded my Three Diya altar verification video.",
            attachmentType = MsgAttachmentType.VIDEO,
            mediaFileName = "three_diya_altar_video.mp4",
            mediaDurationSeconds = 35,
            timestamp = "10:15 AM",
            status = MessageDeliveryStatus.DELIVERED,
            isFromMe = false
        )
    )

    private val _conversations = MutableStateFlow<List<LineageConversation>>(seedConversations)
    val conversations: StateFlow<List<LineageConversation>> = _conversations.asStateFlow()

    private val _messages = MutableStateFlow<List<LineageChatMessage>>(seedMessages)
    val messages: StateFlow<List<LineageChatMessage>> = _messages.asStateFlow()

    /**
     * Get message thread for a specific conversation.
     */
    fun getMessagesForConversation(convId: String): List<LineageChatMessage> {
        return _messages.value.filter { it.conversationId == convId }
    }

    /**
     * Send a new message (text, photo, audio voice note, video).
     */
    fun sendMessage(
        conversationId: String,
        text: String,
        attachmentType: MsgAttachmentType = MsgAttachmentType.NONE,
        mediaFileName: String? = null,
        mediaDurationSeconds: Int = 0
    ) {
        val timeStr = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
        val conv = _conversations.value.firstOrNull { it.conversationId == conversationId }

        val newMsg = LineageChatMessage(
            id = "msg-${UUID.randomUUID().toString().take(8)}",
            conversationId = conversationId,
            senderId = "current-user",
            senderName = "Me",
            senderRole = "Active Member",
            recipientId = conv?.participantId ?: "upline",
            recipientName = conv?.participantName ?: "Mentor",
            text = text,
            attachmentType = attachmentType,
            mediaFileName = mediaFileName,
            mediaDurationSeconds = mediaDurationSeconds,
            timestamp = timeStr,
            status = MessageDeliveryStatus.SENT,
            isFromMe = true
        )

        val updatedMsgs = _messages.value.toMutableList().apply { add(newMsg) }
        _messages.value = updatedMsgs

        // Update conversation summary
        val preview = when (attachmentType) {
            MsgAttachmentType.IMAGE -> "📷 Photo: ${text.ifBlank { mediaFileName ?: "Image" }}"
            MsgAttachmentType.AUDIO -> "🎵 Audio: ${text.ifBlank { mediaFileName ?: "Voice note" }}"
            MsgAttachmentType.VIDEO -> "🎥 Video: ${text.ifBlank { mediaFileName ?: "Video" }}"
            MsgAttachmentType.DOCUMENT -> "📄 Document: ${text.ifBlank { mediaFileName ?: "Document" }}"
            MsgAttachmentType.NONE -> text
        }

        _conversations.value = _conversations.value.map { c ->
            if (c.conversationId == conversationId) {
                c.copy(lastMessageText = preview, lastMessageTime = timeStr, unreadCount = 0)
            } else c
        }
    }

    /**
     * Mark conversation as read.
     */
    fun markAsRead(conversationId: String) {
        _conversations.value = _conversations.value.map { c ->
            if (c.conversationId == conversationId) c.copy(unreadCount = 0) else c
        }
    }
}
