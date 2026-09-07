package com.jdroidx.spritualkarim.data.model

enum class MsgAttachmentType {
    NONE,
    IMAGE,
    AUDIO,
    VIDEO,
    DOCUMENT
}

enum class MessageDeliveryStatus {
    SENDING,
    SENT,
    DELIVERED,
    READ
}

/**
 * Lineage Chat Message Model for WhatsApp-style Mentor/Upline/Downline communication.
 */
data class LineageChatMessage(
    val id: String,
    val conversationId: String,
    val senderId: String,
    val senderName: String,
    val senderRole: String,
    val recipientId: String,
    val recipientName: String,
    val text: String,
    val attachmentType: MsgAttachmentType = MsgAttachmentType.NONE,
    val mediaUri: String? = null,
    val mediaFileName: String? = null,
    val mediaDurationSeconds: Int = 0,
    val timestamp: String,
    val status: MessageDeliveryStatus = MessageDeliveryStatus.READ,
    val isFromMe: Boolean
)

/**
 * Lineage Chat Thread Summary.
 */
data class LineageConversation(
    val conversationId: String,
    val participantId: String,
    val participantName: String,
    val participantRole: String,
    val participantCode: String,
    val participantLevel: Int,
    val lastMessageText: String,
    val lastMessageTime: String,
    val unreadCount: Int = 0,
    val isUpline: Boolean = true
)
