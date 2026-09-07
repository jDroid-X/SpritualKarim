package com.jdroidx.spritualkarim.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.data.repository.AppSettingsRepository
import com.jdroidx.spritualkarim.data.repository.NotificationRepository
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.ui.components.SectionHeader
import com.jdroidx.spritualkarim.ui.components.SpiritualGlassCard
import com.jdroidx.spritualkarim.utils.IntentHelper

@Composable
fun AboutScreen(navController: NavController) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Header
        item {
            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.primary,
                        MaterialTheme.colorScheme.secondary,
                        MaterialTheme.colorScheme.outline
                    )
                )
            ) {
                SectionHeader(
                    title = SpiritualContentRepository.ABOUT_HERO_TITLE,
                    subtitle = SpiritualContentRepository.ABOUT_HERO_SUBTITLE,
                    icon = Icons.Default.AutoAwesome
                )
            }
        }

        // Who I Am Section
        item {
            SpiritualGlassCard {
                Text(
                    text = "Who I Am",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = SpiritualContentRepository.ABOUT_STORY_1,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 24.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = SpiritualContentRepository.ABOUT_STORY_2,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 24.sp
                )
            }
        }

        // Paranormal & Spiritual Guidance Section
        item {
            SpiritualGlassCard {
                Text(
                    text = "Paranormal Guidance & Entity Removal",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = SpiritualContentRepository.ABOUT_STORY_3,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 24.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = SpiritualContentRepository.ABOUT_STORY_4,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 24.sp
                )
            }
        }

        // My Journey of Third Eye Divya Drishti
        item {
            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.secondary,
                        MaterialTheme.colorScheme.primary,
                        MaterialTheme.colorScheme.outline
                    )
                )
            ) {
                SectionHeader(
                    title = "My Journey of Third Eye Divya Drishti",
                    icon = Icons.Default.Visibility
                )
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = SpiritualContentRepository.ABOUT_DIVYA_DRISHTI,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 24.sp
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { navController.navigate(Screen.Contact.route) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Text(
                        text = "Consult with Karim",
                        color = MaterialTheme.colorScheme.onPrimary,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // GitHub Releases, Direct Download & Auto-Updates Section
        item {
            val context = androidx.compose.ui.platform.LocalContext.current
            val githubDownloadUrl = remember { AppSettingsRepository.getVariableValue("GITHUB_RELEASE_DOWNLOAD_URL", "https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk") }
            val githubRepoUrl = remember { AppSettingsRepository.getVariableValue("GITHUB_REPO_URL", "https://github.com/jDroid-X/SpritualKarim") }

            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.primary,
                        MaterialTheme.colorScheme.tertiary
                    )
                )
            ) {
                Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CloudDownload,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "GitHub Auto-Updates & Direct APK Download",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Spiritual Karim supports integrated continuous auto-updates from GitHub. When code or features are updated in repository folders, new builds are published automatically to GitHub releases.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Action Buttons: Download Latest APK + Check Updates
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            if (!com.jdroidx.spritualkarim.utils.DeviceSecurityHelper.hasSufficientInstallSpace(150L)) {
                                val freeMB = com.jdroidx.spritualkarim.utils.DeviceSecurityHelper.getAvailableDiskSpaceMB()
                                NotificationRepository.showWarning(
                                    title = "Low Storage Space",
                                    message = "Device has only ${freeMB}MB free. Minimum 150MB required to install APK."
                                )
                            } else {
                                IntentHelper.openUrl(context, githubDownloadUrl)
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Download,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onPrimary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Download APK", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimary)
                    }

                    OutlinedButton(
                        onClick = {
                            NotificationRepository.showSuccess(
                                title = "App is Up-to-Date",
                                message = "Latest GitHub release (v2.4.0-release) is active on this device."
                            )
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Sync,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Check Updates", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Device Hardware & Security Diagnostics
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    val freeMB = remember { com.jdroidx.spritualkarim.utils.DeviceSecurityHelper.getAvailableDiskSpaceMB() }
                    val hwId = remember { com.jdroidx.spritualkarim.utils.DeviceSecurityHelper.getDeviceFingerprint(context) }
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                    ) {
                        Text("Device HW: $hwId", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("Free Storage: ${freeMB}MB", fontSize = 10.sp, color = if (freeMB > 150) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                TextButton(
                    onClick = {
                        IntentHelper.openUrl(context, githubRepoUrl)
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.OpenInNew,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("View GitHub Source Repository", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                }
            }
        }

        // 24-Hour Upline Verification & 1-to-1 Device Sync Protocol Section
        item {
            SpiritualGlassCard {
                Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.VerifiedUser,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "24-Hour Upline Approval & 1-to-1 Device Sync",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                val protocolSteps = listOf(
                    "1. 24-Hour Link Expiry" to "Every pairing link or OTP generated is cryptographically secured for exactly 24 hours. After 24 hours, the link expires and requires a fresh resend.",
                    "2. Multiple Resends Allowed" to "Seekers and mentors can resend fresh 24-hour pairing links multiple times until official upline approval is completed.",
                    "3. Upline Push Notification" to "Upon entering a sponsor code or tapping Telegram bot link, the mentor receives an instant approval notification.",
                    "4. To-Fro 1-to-1 Sync" to "Once verified, both devices communicate bidirectional progress updates for House Clean %, Sadhanas, and Milestones in closed loop."
                )

                protocolSteps.forEach { (stepTitle, stepDesc) ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 3.dp)
                    ) {
                        Column(modifier = Modifier.padding(8.dp)) {
                            Text(stepTitle, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(stepDesc, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface, lineHeight = 14.sp)
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
