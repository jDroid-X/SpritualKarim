package com.jdroidx.spritualkarim.ui.screens

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.data.model.LineageChatMessage
import com.jdroidx.spritualkarim.data.model.LineageConversation
import com.jdroidx.spritualkarim.data.model.MessageDeliveryStatus
import com.jdroidx.spritualkarim.data.model.MsgAttachmentType
import com.jdroidx.spritualkarim.data.repository.HealersRepository
import com.jdroidx.spritualkarim.data.repository.MsgBotRepository
import com.jdroidx.spritualkarim.ui.components.SpiritualGlassCard
import com.jdroidx.spritualkarim.ui.theme.*
import com.jdroidx.spritualkarim.utils.IntentHelper

/**
 * WhatsApp-style Lineage Chat Screen.
 * Enables direct chat with Upline Mentors and Downline Devotees with Photo, Audio, and Video attachments.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LineageChatScreen(
    navController: NavController,
    initialConversationId: String? = null
) {
    val context = LocalContext.current
    val conversations by MsgBotRepository.conversations.collectAsState()
    val allMessages by MsgBotRepository.messages.collectAsState()

    var activeConversationId by remember(initialConversationId) {
        mutableStateOf(initialConversationId ?: conversations.firstOrNull()?.conversationId ?: "conv-upline-01")
    }

    val activeConv = conversations.firstOrNull { it.conversationId == activeConversationId }
        ?: conversations.firstOrNull()

    val currentThread = allMessages.filter { it.conversationId == activeConversationId }

    var inputText by remember { mutableStateOf("") }
    var showAttachmentSheet by remember { mutableStateOf(false) }
    var isPlayingAudioId by remember { mutableStateOf<String?>(null) }
    var isSearchActive by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedMediaMessage by remember { mutableStateOf<LineageChatMessage?>(null) }
    val chatListState = rememberLazyListState()

    val filteredThread = if (searchQuery.isBlank()) currentThread else currentThread.filter {
        it.text.contains(searchQuery, ignoreCase = true) || (it.mediaFileName?.contains(searchQuery, ignoreCase = true) == true)
    }

    LaunchedEffect(currentThread.size) {
        if (currentThread.isNotEmpty()) {
            chatListState.animateScrollToItem(currentThread.size - 1)
        }
    }

    Scaffold(
        topBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 4.dp
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 8.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(onClick = { navController.popBackStack() }) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                        }

                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(if (activeConv?.isUpline == true) SpiritualMaroon else SpiritualTeal),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (activeConv?.isUpline == true) "U" else "D",
                                color = DivineWhite,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }

                        Spacer(modifier = Modifier.width(10.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = activeConv?.participantName ?: "Lineage Chat",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "${activeConv?.participantRole} • ${activeConv?.participantCode}",
                                style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                                color = MaterialTheme.colorScheme.primary
                            )
                        }

                        IconButton(onClick = { isSearchActive = !isSearchActive }) {
                            Icon(Icons.Default.Search, contentDescription = "Search", tint = MaterialTheme.colorScheme.primary)
                        }

                        IconButton(onClick = {
                            val targetProfile = activeConv?.participantCode?.let { HealersRepository.getProfileByReferenceCode(it) }
                            val phoneToCall = targetProfile?.phone ?: "+91 99999 99999"
                            IntentHelper.dialPhoneNumber(context, phoneToCall)
                        }) {
                            Icon(Icons.Default.Call, contentDescription = "Call", tint = MaterialTheme.colorScheme.primary)
                        }
                    }

                    if (isSearchActive) {
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            placeholder = { Text("Search messages, photos, audio chants...", fontSize = 12.sp) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 4.dp),
                            singleLine = true,
                            trailingIcon = {
                                if (searchQuery.isNotBlank()) {
                                    IconButton(onClick = { searchQuery = "" }) {
                                        Icon(Icons.Default.Close, contentDescription = "Clear", modifier = Modifier.size(16.dp))
                                    }
                                }
                            }
                        )
                    }
                }
            }
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 8.dp
            ) {
                Column {
                    // Quick Spiritual Blessing Reactions Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                            .padding(horizontal = 12.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        listOf("🙏 Pranam", "🕉️ Om", "✨ Blessing", "🪔 Diya Done", "🌸 Sadhana Completed").forEach { rxn ->
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = MaterialTheme.colorScheme.surface,
                                modifier = Modifier.clickable {
                                    MsgBotRepository.sendMessage(
                                        conversationId = activeConversationId,
                                        text = rxn
                                    )
                                }
                            ) {
                                Text(
                                    text = rxn,
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 8.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = { showAttachmentSheet = true },
                            colors = IconButtonDefaults.filledIconButtonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                        ) {
                            Icon(Icons.Default.AttachFile, contentDescription = "Attach", tint = MaterialTheme.colorScheme.primary)
                        }

                        Spacer(modifier = Modifier.width(6.dp))

                        OutlinedTextField(
                            value = inputText,
                            onValueChange = { inputText = it },
                            placeholder = { Text("Message mentor / team...", fontSize = 13.sp) },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(20.dp),
                            singleLine = false,
                            maxLines = 3
                        )

                        Spacer(modifier = Modifier.width(6.dp))

                        IconButton(
                            onClick = {
                                if (inputText.isNotBlank()) {
                                    MsgBotRepository.sendMessage(
                                        conversationId = activeConversationId,
                                        text = inputText.trim()
                                    )
                                    inputText = ""
                                } else {
                                    // Record voice note simulation
                                    MsgBotRepository.sendMessage(
                                        conversationId = activeConversationId,
                                        text = "Voice message recorded",
                                        attachmentType = MsgAttachmentType.AUDIO,
                                        mediaFileName = "voice_note_${System.currentTimeMillis()}.mp3",
                                        mediaDurationSeconds = 15
                                    )
                                    Toast.makeText(context, "Voice note recorded & sent!", Toast.LENGTH_SHORT).show()
                                }
                            },
                            colors = IconButtonDefaults.filledIconButtonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Icon(
                                imageVector = if (inputText.isNotBlank()) Icons.AutoMirrored.Filled.Send else Icons.Default.Mic,
                                contentDescription = "Send",
                                tint = DivineWhite
                            )
                        }
                    }
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding)
        ) {
            // Thread Switcher Strip (WhatsApp contacts tab)
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(conversations) { conv ->
                    val isSelected = conv.conversationId == activeConversationId
                    FilterChip(
                        selected = isSelected,
                        onClick = {
                            activeConversationId = conv.conversationId
                            MsgBotRepository.markAsRead(conv.conversationId)
                        },
                        label = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(conv.participantName.split(" ").first(), fontSize = 11.sp)
                                if (conv.unreadCount > 0) {
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Surface(
                                        shape = CircleShape,
                                        color = MaterialTheme.colorScheme.error,
                                        modifier = Modifier.size(16.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Text("${conv.unreadCount}", color = DivineWhite, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }
                        },
                        leadingIcon = {
                            Icon(
                                imageVector = if (conv.isUpline) Icons.Default.North else Icons.Default.South,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp),
                                tint = if (conv.isUpline) SpiritualGold else SpiritualTeal
                            )
                        }
                    )
                }
            }

            // Message Bubble List with Auto-Scroll
            LazyColumn(
                state = chatListState,
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f),
                contentPadding = PaddingValues(12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredThread, key = { it.id }) { msg ->
                    WhatsAppMessageBubble(
                        msg = msg,
                        isPlaying = isPlayingAudioId == msg.id,
                        onToggleAudioPlay = {
                            isPlayingAudioId = if (isPlayingAudioId == msg.id) null else msg.id
                            Toast.makeText(context, if (isPlayingAudioId != null) "Playing sacred voice audio..." else "Audio paused", Toast.LENGTH_SHORT).show()
                        },
                        onViewMedia = {
                            selectedMediaMessage = msg
                        }
                    )
                }
            }
        }
    }

    // Media Viewer Dialog
    if (selectedMediaMessage != null) {
        val media = selectedMediaMessage!!
        AlertDialog(
            onDismissRequest = { selectedMediaMessage = null },
            title = {
                Text(
                    text = media.mediaFileName ?: "Media Attachment",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            },
            text = {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    when (media.attachmentType) {
                        MsgAttachmentType.IMAGE -> {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(200.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color(0xFF263238)),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.Image, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(54.dp))
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text("High-Resolution Altar Photograph", color = DivineWhite, fontWeight = FontWeight.Bold)
                                    Text("Verified by ${media.senderName}", color = DivineWhite.copy(alpha = 0.7f), fontSize = 11.sp)
                                }
                            }
                        }
                        MsgAttachmentType.VIDEO -> {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(200.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color(0xFF1A237E)),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.PlayCircle, contentDescription = null, tint = DivineWhite, modifier = Modifier.size(54.dp))
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text("Altar Lighting Ceremony Video", color = DivineWhite, fontWeight = FontWeight.Bold)
                                    Text("${media.mediaDurationSeconds} seconds • HD 1080p", color = DivineWhite.copy(alpha = 0.7f), fontSize = 11.sp)
                                }
                            }
                        }
                        MsgAttachmentType.AUDIO -> {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(SpiritualTeal.copy(alpha = 0.15f))
                                    .padding(16.dp)
                            ) {
                                Icon(Icons.Default.GraphicEq, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(48.dp))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Sacred Chanting Voice Master Recording", fontWeight = FontWeight.Bold)
                                Text("Duration: ${media.mediaDurationSeconds} seconds", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                        MsgAttachmentType.DOCUMENT -> {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                                    .padding(16.dp)
                            ) {
                                Icon(Icons.Default.Description, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(48.dp))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Sadhana Discipline Verification Document", fontWeight = FontWeight.Bold)
                                Text("PDF Format • 1.4 MB", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                        MsgAttachmentType.NONE -> {}
                    }

                    Text(
                        text = "Message: \"${media.text}\"",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            },
            confirmButton = {
                Button(onClick = {
                    Toast.makeText(context, "Saved ${media.mediaFileName} to downloads", Toast.LENGTH_SHORT).show()
                    selectedMediaMessage = null
                }) {
                    Text("Save to Device")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedMediaMessage = null }) {
                    Text("Close")
                }
            }
        )
    }

    // Attachment Bottom Sheet
    if (showAttachmentSheet) {
        ModalBottomSheet(onDismissRequest = { showAttachmentSheet = false }) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Share with Lineage Mentor",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    AttachmentOption(
                        label = "Altar Photo",
                        icon = Icons.Default.CameraAlt,
                        color = Color(0xFFE91E63),
                        onClick = {
                            showAttachmentSheet = false
                            MsgBotRepository.sendMessage(
                                conversationId = activeConversationId,
                                text = "Shared Altar & Diya Setup Photo",
                                attachmentType = MsgAttachmentType.IMAGE,
                                mediaFileName = "altar_photo_${System.currentTimeMillis()}.jpg"
                            )
                            Toast.makeText(context, "Altar photo uploaded to mentor thread", Toast.LENGTH_SHORT).show()
                        }
                    )

                    AttachmentOption(
                        label = "Audio Chant",
                        icon = Icons.Default.Audiotrack,
                        color = Color(0xFFFF9800),
                        onClick = {
                            showAttachmentSheet = false
                            MsgBotRepository.sendMessage(
                                conversationId = activeConversationId,
                                text = "108 Gayatri Mantra Audio Chant",
                                attachmentType = MsgAttachmentType.AUDIO,
                                mediaFileName = "gayatri_chant_${System.currentTimeMillis()}.mp3",
                                mediaDurationSeconds = 72
                            )
                            Toast.makeText(context, "Audio chant recording sent", Toast.LENGTH_SHORT).show()
                        }
                    )

                    AttachmentOption(
                        label = "Diya Video",
                        icon = Icons.Default.Videocam,
                        color = Color(0xFF9C27B0),
                        onClick = {
                            showAttachmentSheet = false
                            MsgBotRepository.sendMessage(
                                conversationId = activeConversationId,
                                text = "Three Diya Evening Lighting Video",
                                attachmentType = MsgAttachmentType.VIDEO,
                                mediaFileName = "three_diya_ceremony.mp4",
                                mediaDurationSeconds = 45
                            )
                            Toast.makeText(context, "Video uploaded to local lineage store", Toast.LENGTH_SHORT).show()
                        }
                    )

                    AttachmentOption(
                        label = "Sadhana Log",
                        icon = Icons.Default.Description,
                        color = Color(0xFF2196F3),
                        onClick = {
                            showAttachmentSheet = false
                            MsgBotRepository.sendMessage(
                                conversationId = activeConversationId,
                                text = "40-Day Kalashtami Sadhana Log PDF",
                                attachmentType = MsgAttachmentType.DOCUMENT,
                                mediaFileName = "sadhana_log_sheet.pdf"
                            )
                            Toast.makeText(context, "Sadhana document log shared", Toast.LENGTH_SHORT).show()
                        }
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}

@Composable
private fun WhatsAppMessageBubble(
    msg: LineageChatMessage,
    isPlaying: Boolean,
    onToggleAudioPlay: () -> Unit,
    onViewMedia: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = if (msg.isFromMe) Alignment.CenterEnd else Alignment.CenterStart
    ) {
        Surface(
            shape = RoundedCornerShape(
                topStart = 14.dp,
                topEnd = 14.dp,
                bottomStart = if (msg.isFromMe) 14.dp else 2.dp,
                bottomEnd = if (msg.isFromMe) 2.dp else 14.dp
            ),
            color = if (msg.isFromMe) Color(0xFFE7F6E7) else MaterialTheme.colorScheme.surface,
            border = BorderStroke(
                1.dp,
                if (msg.isFromMe) Color(0xFFC8E6C9) else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
            ),
            modifier = Modifier.widthIn(min = 140.dp, max = 290.dp)
        ) {
            Column(modifier = Modifier.padding(10.dp)) {
                if (!msg.isFromMe) {
                    Text(
                        text = "${msg.senderName} (${msg.senderRole})",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = SpiritualMaroon
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                }

                // Media Attachment Renderers
                when (msg.attachmentType) {
                    MsgAttachmentType.IMAGE -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFF263238))
                                .clickable { onViewMedia() },
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Default.Image, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(36.dp))
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(msg.mediaFileName ?: "Altar Photo", color = DivineWhite, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                                Text("Tap to view full resolution", color = DivineWhite.copy(alpha = 0.7f), fontSize = 9.sp)
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                    }

                    MsgAttachmentType.AUDIO -> {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(SpiritualTeal.copy(alpha = 0.15f))
                                .padding(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            IconButton(onClick = onToggleAudioPlay, modifier = Modifier.size(32.dp)) {
                                Icon(
                                    imageVector = if (isPlaying) Icons.Default.PauseCircleFilled else Icons.Default.PlayCircleFilled,
                                    contentDescription = "Play",
                                    tint = SpiritualTeal,
                                    modifier = Modifier.size(28.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(6.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Voice Mantra Note", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                                Text("0:${if (msg.mediaDurationSeconds < 10) "0" else ""}${msg.mediaDurationSeconds}", fontSize = 9.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Icon(Icons.Default.GraphicEq, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                    }

                    MsgAttachmentType.VIDEO -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(110.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFF1A237E))
                                .clickable { onViewMedia() },
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Default.PlayCircle, contentDescription = null, tint = DivineWhite, modifier = Modifier.size(36.dp))
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(msg.mediaFileName ?: "Altar Ceremony Video", color = DivineWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                Text("${msg.mediaDurationSeconds}s Video", color = DivineWhite.copy(alpha = 0.7f), fontSize = 9.sp)
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                    }

                    MsgAttachmentType.DOCUMENT -> {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .clickable { onViewMedia() }
                                .padding(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Description, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(24.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(msg.mediaFileName ?: "Document", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                                Text("Tap to view PDF", fontSize = 9.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                    }

                    MsgAttachmentType.NONE -> {}
                }

                if (msg.text.isNotBlank()) {
                    Text(
                        text = msg.text,
                        fontSize = 13.sp,
                        color = Color(0xFF1E293B),
                        lineHeight = 18.sp
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = msg.timestamp,
                        fontSize = 9.sp,
                        color = Color(0xFF64748B)
                    )
                    if (msg.isFromMe) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            imageVector = when (msg.status) {
                                MessageDeliveryStatus.READ -> Icons.Default.DoneAll
                                MessageDeliveryStatus.DELIVERED -> Icons.Default.DoneAll
                                MessageDeliveryStatus.SENT -> Icons.Default.Done
                                MessageDeliveryStatus.SENDING -> Icons.Default.AccessTime
                            },
                            contentDescription = "Status",
                            tint = if (msg.status == MessageDeliveryStatus.READ) Color(0xFF00A884) else Color(0xFF94A3B8),
                            modifier = Modifier.size(12.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun AttachmentOption(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { onClick() }
    ) {
        Box(
            modifier = Modifier
                .size(52.dp)
                .clip(CircleShape)
                .background(color),
            contentAlignment = Alignment.Center
        ) {
            Icon(imageVector = icon, contentDescription = label, tint = DivineWhite, modifier = Modifier.size(24.dp))
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(text = label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface)
    }
}
