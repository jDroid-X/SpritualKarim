package com.jdroidx.spritualkarim.ui.components

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import com.jdroidx.spritualkarim.utils.IntentHelper
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jdroidx.spritualkarim.data.manager.SettingsManager
import com.jdroidx.spritualkarim.data.model.MantraItem
import com.jdroidx.spritualkarim.data.repository.AppSettingsRepository
import com.jdroidx.spritualkarim.data.repository.NotificationRepository
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.data.repository.UserHubRepository
import com.jdroidx.spritualkarim.ui.theme.*

@Composable
fun MantraInteractiveCard(
    mantra: MantraItem,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    var jaapCount by remember { mutableIntStateOf(0) }
    var isCounterExpanded by remember { mutableStateOf(false) }
    val dynamicTargetStr = AppSettingsRepository.getVariableValue("DEFAULT_JAPA_TARGET_COUNT", "108")
    val targetCount = remember(dynamicTargetStr) { dynamicTargetStr.toIntOrNull() ?: SettingsManager.defaultJapaTarget }

    fun triggerVibration() {
        if (!SettingsManager.vibrationFeedback) return
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator?.vibrate(VibrationEffect.createOneShot(35, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator?.vibrate(VibrationEffect.createOneShot(35, VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator?.vibrate(35)
                }
            }
        } catch (_: Exception) {}
    }

    SpiritualGlassCard(modifier = modifier) {
        // Category Badge & Deity
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.primaryContainer
            ) {
                Text(
                    text = mantra.category,
                    color = MaterialTheme.colorScheme.primary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
            Text(
                text = "Deity: ${mantra.deity}",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Title
        Text(
            text = mantra.title,
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp
            ),
            color = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Sacred Sanskrit Box (if enabled in settings)
        if (SettingsManager.showSanskritScript || SettingsManager.showTransliteration) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    Brush.linearGradient(
                        listOf(
                            MaterialTheme.colorScheme.primary.copy(alpha = 0.4f),
                            MaterialTheme.colorScheme.secondary.copy(alpha = 0.3f)
                        )
                    )
                )
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    if (SettingsManager.showSanskritScript) {
                        Text(
                            text = mantra.sanskritText,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontFamily = FontFamily.Serif,
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                lineHeight = 26.sp,
                                textAlign = TextAlign.Center
                            ),
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    if (SettingsManager.showTransliteration) {
                        if (SettingsManager.showSanskritScript) Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = mantra.pronunciation,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                                textAlign = TextAlign.Center
                            ),
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.9f)
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Meaning (if enabled in settings)
        if (SettingsManager.showMeaning) {
            Text(
                text = "Meaning:",
                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = mantra.englishMeaning,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 20.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Benefits
            Text(
                text = "Key Benefits:",
                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(4.dp))
            mantra.benefits.forEach { benefit ->
                BulletPointItem(text = benefit, bulletColor = MaterialTheme.colorScheme.tertiary)
            }
        }

        Spacer(modifier = Modifier.height(12.dp))
        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
        Spacer(modifier = Modifier.height(8.dp))

        // Actions Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                // Copy Action
                IconButton(
                    onClick = {
                        clipboardManager.setText(AnnotatedString("${mantra.title}\n${mantra.sanskritText}\n${mantra.pronunciation}\n${mantra.englishMeaning}"))
                        Toast.makeText(context, "Mantra copied to clipboard", Toast.LENGTH_SHORT).show()
                    },
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        Icons.Default.ContentCopy,
                        contentDescription = "Copy",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Share Action
                IconButton(
                    onClick = {
                        IntentHelper.shareText(
                            context,
                            "${mantra.title}\n\n${mantra.sanskritText}\n\n${mantra.pronunciation}\n\nMeaning:\n${mantra.englishMeaning}\n\nLearn more on Spiritual Karim App: ${SpiritualContentRepository.WEBSITE_URL}",
                            "Share Mantra"
                        )
                    },
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        Icons.Default.Share,
                        contentDescription = "Share",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(18.dp)
                    )
                }

                // AI Guide Action
                IconButton(
                    onClick = {
                        UserHubRepository.sendChatMessage("What are the rules and pronunciation for ${mantra.title}?")
                        Toast.makeText(context, "Query sent to Spiritual Assistant", Toast.LENGTH_SHORT).show()
                        IntentHelper.openUrl(context, UserHubRepository.NOTEBOOKLM_URL)
                    },
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        Icons.AutoMirrored.Filled.OpenInNew,
                        contentDescription = "Ask AI Guide",
                        tint = SpiritualTeal,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            // Jaap Counter Toggle
            Button(
                onClick = { isCounterExpanded = !isCounterExpanded },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isCounterExpanded) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.surfaceVariant
                ),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = if (isCounterExpanded) "Counter ($jaapCount/$targetCount)" else "Start Japa ($targetCount)",
                    color = if (isCounterExpanded) MaterialTheme.colorScheme.onSecondary else MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        // Interactive Jaap Counter Section
        AnimatedVisibility(visible = isCounterExpanded) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.8f))
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Mantra Japa Counter (Target: $targetCount)",
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    // Tap to count button
                    Box(
                        modifier = Modifier
                            .size(76.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.radialGradient(
                                    listOf(
                                        MaterialTheme.colorScheme.primary,
                                        MaterialTheme.colorScheme.secondary
                                    )
                                )
                            )
                            .clickable {
                                jaapCount++
                                triggerVibration()
                                if (jaapCount % targetCount == 0) {
                                    SettingsManager.totalJapaCompletedCount++
                                    NotificationRepository.showSuccess(
                                        title = "Mala Completed! 📿",
                                        message = "Divine blessings! $targetCount recitations completed for ${mantra.title}."
                                    )
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = jaapCount.toString(),
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = DivineWhite
                        )
                    }

                    Spacer(modifier = Modifier.width(20.dp))

                    // Reset button
                    IconButton(
                        onClick = { jaapCount = 0 },
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surface)
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = "Reset", tint = MaterialTheme.colorScheme.onSurface)
                    }
                }
                Spacer(modifier = Modifier.height(10.dp))
                LinearProgressIndicator(
                    progress = { (jaapCount % targetCount) / targetCount.toFloat() },
                    modifier = Modifier
                        .fillMaxWidth(0.8f)
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp)),
                    color = MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                )
            }
        }
    }
}
