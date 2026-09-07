package com.jdroidx.spritualkarim.ui.components

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
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
import com.jdroidx.spritualkarim.data.model.CleanStatus
import com.jdroidx.spritualkarim.data.model.HouseCleanLevel
import com.jdroidx.spritualkarim.data.model.HouseCleanSubmission
import com.jdroidx.spritualkarim.data.model.ProfileType
import com.jdroidx.spritualkarim.data.repository.AppSettingsRepository
import com.jdroidx.spritualkarim.data.repository.HealersRepository
import com.jdroidx.spritualkarim.data.repository.HouseCleanRepository
import com.jdroidx.spritualkarim.data.repository.NotificationRepository
import com.jdroidx.spritualkarim.ui.theme.*
import java.util.Locale

/**
 * 3-Level "House Clean" section for Seekers (Devotees).
 * Supports Speech-to-Text via internal Android mic launcher, text entry, and Level-Up mentor % Clean approvals.
 */
@Composable
fun HouseCleanSection(
    seekerId: String,
    seekerName: String,
    currentViewerProfileType: ProfileType = ProfileType.DEVOTEE,
    viewerReferenceCode: String = AppSettingsRepository.getVariableValue("DEFAULT_SPONSOR_CODE", "SKHM-ADM1-7788-9900"),
    viewerName: String = "Mentor Guide",
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val allSubmissions by HouseCleanRepository.submissions.collectAsState()

    val seekerSubmissions = remember(allSubmissions, seekerId) {
        HouseCleanRepository.getSubmissionsForSeeker(seekerId, seekerName)
    }

    val overallPercentage = remember(allSubmissions, seekerId) {
        HouseCleanRepository.calculateOverallCleanPercentage(seekerId)
    }

    var selectedSubmissionForApproval by remember { mutableStateOf<HouseCleanSubmission?>(null) }

    SpiritualGlassCard(
        modifier = modifier.fillMaxWidth(),
        borderBrush = Brush.linearGradient(
            listOf(
                SpiritualTeal.copy(alpha = 0.6f),
                SpiritualGold.copy(alpha = 0.5f)
            )
        )
    ) {
        Column(
            modifier = Modifier.fillMaxWidth()
        ) {
            // ==========================================
            // HEADER: Title + Progress Bar + % Clean Badge
            // ==========================================
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.CleaningServices,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "House Clean",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 17.sp
                            ),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "3-Level Spiritual Aura & Space Cleansing",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 11.sp
                        )
                    }
                }

                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = when {
                        overallPercentage >= 100 -> SpiritualTeal.copy(alpha = 0.2f)
                        overallPercentage > 0 -> SpiritualGold.copy(alpha = 0.2f)
                        else -> MaterialTheme.colorScheme.surfaceVariant
                    },
                    border = BorderStroke(
                        1.dp,
                        when {
                            overallPercentage >= 100 -> SpiritualTeal
                            overallPercentage > 0 -> SpiritualGold
                            else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)
                        }
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (overallPercentage >= 100) Icons.Default.Verified else Icons.Default.AutoAwesome,
                            contentDescription = null,
                            modifier = Modifier.size(13.dp),
                            tint = if (overallPercentage >= 100) SpiritualTeal else SpiritualGold
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "$overallPercentage% Clean",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Overall Linear Progress Indicator
            LinearProgressIndicator(
                progress = { overallPercentage / 100f },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = if (overallPercentage >= 100) SpiritualTeal else SpiritualGold,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )

            Spacer(modifier = Modifier.height(14.dp))

            // ==========================================
            // 3-LEVEL ACCORDION ITEMS
            // ==========================================
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                seekerSubmissions.forEach { sub ->
                    HouseCleanLevelCard(
                        submission = sub,
                        seekerId = seekerId,
                        seekerName = seekerName,
                        mentorName = viewerName,
                        mentorCode = viewerReferenceCode,
                        isMentorViewer = currentViewerProfileType != ProfileType.DEVOTEE,
                        onOpenApproval = { selectedSubmissionForApproval = sub }
                    )
                }
            }
        }
    }

    // Mentor Level-Up % Clean Approval Dialog
    if (selectedSubmissionForApproval != null) {
        MentorApproveCleanDialog(
            submission = selectedSubmissionForApproval!!,
            mentorCode = viewerReferenceCode,
            mentorName = viewerName,
            onDismiss = { selectedSubmissionForApproval = null },
            onApprove = { percentage, remarks ->
                HouseCleanRepository.approveHouseClean(
                    submissionId = selectedSubmissionForApproval!!.id,
                    cleanPercentage = percentage,
                    mentorCode = viewerReferenceCode,
                    mentorName = viewerName,
                    remarks = remarks
                )
                selectedSubmissionForApproval = null
                NotificationRepository.showSuccess(
                    title = "House Clean Certified",
                    message = "Approved at $percentage% Clean rating by $viewerName ($viewerReferenceCode)."
                )
            },
            onRequestRevision = { remarks ->
                HouseCleanRepository.requestRevision(
                    submissionId = selectedSubmissionForApproval!!.id,
                    mentorCode = viewerReferenceCode,
                    mentorName = viewerName,
                    remarks = remarks
                )
                selectedSubmissionForApproval = null
                NotificationRepository.showWarning(
                    title = "Revision Requested",
                    message = "Clean report returned to seeker for additional ritual steps & notes."
                )
            }
        )
    }
}

/**
 * Individual Card for Level 1 (Self), Level 2 (Parents), Level 3 (Relatives).
 */
@Composable
private fun HouseCleanLevelCard(
    submission: HouseCleanSubmission,
    seekerId: String,
    seekerName: String,
    mentorName: String,
    mentorCode: String,
    isMentorViewer: Boolean,
    onOpenApproval: () -> Unit
) {
    val context = LocalContext.current
    var isExpanded by remember { mutableStateOf(submission.status != CleanStatus.APPROVED) }
    var cleanText by remember(submission.cleanedDetails) { mutableStateOf(submission.cleanedDetails) }
    var showSendToMentorDialog by remember { mutableStateOf(false) }

    // Speech-To-Text Voice Recognizer Launcher
    val speechRecognizerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val spokenSpiritualText = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()
            if (!spokenSpiritualText.isNullOrBlank()) {
                cleanText = if (cleanText.isBlank()) spokenSpiritualText else "$cleanText. $spokenSpiritualText"
                Toast.makeText(context, "Voice transcription added", Toast.LENGTH_SHORT).show()
            }
        }
    }

    val levelColor = Color(submission.level.badgeColorHex)

    // Verification Destination Popup
    if (showSendToMentorDialog) {
        SendToMentorVerificationDialog(
            levelTitle = submission.level.title,
            cleanedDetails = cleanText,
            mentorName = mentorName,
            mentorCode = mentorCode,
            onDismiss = { showSendToMentorDialog = false },
            onConfirmSend = {
                HouseCleanRepository.submitHouseClean(
                    seekerId = seekerId,
                    seekerName = seekerName,
                    level = submission.level,
                    details = cleanText
                )
                showSendToMentorDialog = false
                NotificationRepository.showInfo(
                    title = "Forwarded to Mentor",
                    message = "${submission.level.title} report submitted to $mentorName ($mentorCode) for % Clean review."
                )
            }
        )
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
            .border(
                BorderStroke(
                    1.dp,
                    if (submission.status == CleanStatus.APPROVED) levelColor.copy(alpha = 0.6f)
                    else MaterialTheme.colorScheme.outline.copy(alpha = 0.25f)
                ),
                RoundedCornerShape(12.dp)
            )
    ) {
        // Left Accent Stripe
        Box(
            modifier = Modifier
                .width(4.dp)
                .matchParentSize()
                .background(levelColor)
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 14.dp, top = 12.dp, end = 12.dp, bottom = 12.dp)
        ) {
            // Header Row: Level Badge + Title + Status + Expand
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { isExpanded = !isExpanded },
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = submission.level.title,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        if (submission.status == CleanStatus.APPROVED) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = SpiritualTeal,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                    Text(
                        text = submission.level.subtitle,
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Status Badge
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(submission.status.badgeColorHex).copy(alpha = 0.18f),
                        border = BorderStroke(1.dp, Color(submission.status.badgeColorHex).copy(alpha = 0.5f))
                    ) {
                        Text(
                            text = if (submission.status == CleanStatus.APPROVED) "${submission.cleanPercentage}% Clean" else submission.status.displayName,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(submission.status.badgeColorHex),
                            modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(4.dp))
                    IconButton(
                        onClick = { isExpanded = !isExpanded },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                            contentDescription = "Expand",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            AnimatedVisibility(visible = isExpanded) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))

                    // If Approved: Show summary and mentor certification
                    if (submission.status == CleanStatus.APPROVED) {
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp),
                            color = SpiritualTeal.copy(alpha = 0.08f),
                            border = BorderStroke(1.dp, SpiritualTeal.copy(alpha = 0.3f))
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Level-Up Connection Certified • ${submission.cleanPercentage}% Clean",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = SpiritualTeal
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = submission.cleanedDetails,
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    lineHeight = 17.sp
                                )
                                if (!submission.mentorRemarks.isNullOrBlank()) {
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = "Mentor Remark: \"${submission.mentorRemarks}\" — by ${submission.approvedByName ?: "Upline"} (${submission.approvedByCode ?: ""})",
                                        fontSize = 11.sp,
                                        fontFamily = FontFamily.Serif,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }

                    // Standard Universal Input Box for Notes, Memos, Voice Transcription & Instant Submit
                    SpiritualUniversalInputBox(
                        initialText = cleanText,
                        placeholder = "Describe what was cleaned, rituals performed, mantras chanted...",
                        minLines = 3,
                        maxLines = 6,
                        modifier = Modifier.fillMaxWidth(),
                        onSend = { submittedText, timestamp ->
                            cleanText = "$submittedText (Logged: $timestamp)"
                            showSendToMentorDialog = true
                        }
                    )

                    // Action Controls Bar
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "💡 Tap 🎙️ mic to speak or keyboard voice",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            // Mentor Approve Button (for uplines/healers)
                            if (isMentorViewer) {
                                FilledTonalButton(
                                    onClick = onOpenApproval,
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    modifier = Modifier.height(34.dp),
                                    colors = ButtonDefaults.filledTonalButtonColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                                ) {
                                    Icon(Icons.Default.Approval, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.primary)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Verify % Clean", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                                }
                            }

                            // Seeker Submit Button (Triggers mentor verification confirmation dialog)
                            Button(
                                onClick = {
                                    if (cleanText.isNotBlank()) {
                                        showSendToMentorDialog = true
                                    } else {
                                        Toast.makeText(context, "Please describe what was cleaned before submitting", Toast.LENGTH_SHORT).show()
                                    }
                                },
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                                modifier = Modifier.height(34.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                            ) {
                                Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(13.dp), tint = MaterialTheme.colorScheme.onPrimary)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Verify with Upline", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimary)
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Dialog for Level-Up connection (Mentor / Healer / Admin) to approve and assign % Clean rating.
 */
@Composable
private fun MentorApproveCleanDialog(
    submission: HouseCleanSubmission,
    mentorCode: String,
    mentorName: String,
    onDismiss: () -> Unit,
    onApprove: (cleanPercentage: Int, remarks: String) -> Unit,
    onRequestRevision: (remarks: String) -> Unit
) {
    var selectedPercentage by remember { mutableIntStateOf(if (submission.cleanPercentage > 0) submission.cleanPercentage else 100) }
    var remarks by remember { mutableStateOf(submission.mentorRemarks ?: "Verified and sanctified. High level of purity achieved.") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Approve ${submission.level.title}", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "Seeker: ${submission.seekerName}",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )

                // Submitted Details Review
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text("Submitted Report:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = submission.cleanedDetails.ifBlank { "No report provided yet." },
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurface,
                            lineHeight = 16.sp
                        )
                    }
                }

                // % Clean Rating Selector Chips
                Text(
                    text = "Assign % Clean Rating: ($selectedPercentage%)",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    listOf(50, 75, 85, 95, 100).forEach { pct ->
                        FilterChip(
                            selected = selectedPercentage == pct,
                            onClick = { selectedPercentage = pct },
                            label = { Text("$pct%", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = SpiritualTeal,
                                selectedLabelColor = DivineWhite
                            )
                        )
                    }
                }

                // Slider for custom percentage
                Slider(
                    value = selectedPercentage.toFloat(),
                    onValueChange = { selectedPercentage = it.toInt() },
                    valueRange = 0f..100f,
                    steps = 19
                )

                // Mentor Feedback Remarks
                OutlinedTextField(
                    value = remarks,
                    onValueChange = { remarks = it },
                    label = { Text("Mentor Feedback / Remarks") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 3
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onApprove(selectedPercentage, remarks) },
                colors = ButtonDefaults.buttonColors(containerColor = SpiritualTeal),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp), tint = DivineWhite)
                Spacer(modifier = Modifier.width(4.dp))
                Text("Certify $selectedPercentage% Clean", color = DivineWhite, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                OutlinedButton(
                    onClick = { onRequestRevision(remarks) },
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Needs Work", fontSize = 11.sp, color = MaterialTheme.colorScheme.error)
                }
                TextButton(onClick = onDismiss) {
                    Text("Cancel", fontSize = 11.sp)
                }
            }
        }
    )
}

/**
 * Confirmation popup showing the next-level connected sponsor/mentor whom the report is being sent to.
 */
@Composable
fun SendToMentorVerificationDialog(
    levelTitle: String,
    cleanedDetails: String,
    mentorName: String,
    mentorCode: String,
    onDismiss: () -> Unit,
    onConfirmSend: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        icon = {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(SpiritualTeal.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Send,
                    contentDescription = null,
                    tint = SpiritualTeal,
                    modifier = Modifier.size(26.dp)
                )
            }
        },
        title = {
            Text(
                text = "Forward for Verification",
                fontWeight = FontWeight.Bold,
                fontSize = 17.sp,
                color = MaterialTheme.colorScheme.onSurface
            )
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "Your cleansing report for \"$levelTitle\" will be sent to your upline connection for discussion & % Clean certification:",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 18.sp
                )

                // Recipient Card
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    border = BorderStroke(1.dp, SpiritualGold.copy(alpha = 0.4f))
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(SpiritualGold.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Person, contentDescription = null, tint = SpiritualGoldDark, modifier = Modifier.size(20.dp))
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = mentorName.ifBlank { "Assigned Mentor Guide" },
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "Code: ${mentorCode.ifBlank { "SKHM-ADM1-7788-9900" }}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.primary,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }

                // Summary of clean details
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    Column(modifier = Modifier.padding(8.dp)) {
                        Text(
                            text = "Report Summary:",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = cleanedDetails.take(120) + if (cleanedDetails.length > 120) "..." else "",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurface,
                            maxLines = 3
                        )
                    }
                }

                Text(
                    text = "💬 Your upline connection will review your ritual steps, discuss the details, and officially approve your Cleanliness %.",
                    fontSize = 11.sp,
                    color = SpiritualTeal,
                    lineHeight = 15.sp
                )
            }
        },
        confirmButton = {
            Button(
                onClick = onConfirmSend,
                colors = ButtonDefaults.buttonColors(containerColor = SpiritualTeal),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(14.dp), tint = DivineWhite)
                Spacer(modifier = Modifier.width(6.dp))
                Text("Send for Review", color = DivineWhite, fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Edit More", fontSize = 12.sp)
            }
        }
    )
}
