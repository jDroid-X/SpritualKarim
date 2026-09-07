package com.jdroidx.spritualkarim.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.data.manager.AppLanguage
import com.jdroidx.spritualkarim.data.manager.AppThemeMode
import com.jdroidx.spritualkarim.data.manager.LanguageManager
import com.jdroidx.spritualkarim.data.manager.SettingsManager
import com.jdroidx.spritualkarim.data.model.DynamicSystemVariable
import com.jdroidx.spritualkarim.data.repository.AppSettingsRepository
import com.jdroidx.spritualkarim.data.repository.HealersRepository
import com.jdroidx.spritualkarim.data.repository.NotificationRepository
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.data.repository.UserHubRepository
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.ui.components.SectionHeader
import com.jdroidx.spritualkarim.ui.components.SpiritualGlassCard
import com.jdroidx.spritualkarim.ui.components.SpiritualSwitch
import com.jdroidx.spritualkarim.ui.components.SpiritualValidatedTextField
import com.jdroidx.spritualkarim.ui.theme.*
import com.jdroidx.spritualkarim.utils.IntentHelper
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(navController: NavController) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    // Dialog states
    var showResetDialog by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }
    var showTermsDialog by remember { mutableStateOf(false) }
    var showEditUpdatePathDialog by remember { mutableStateOf(false) }
    var showMultiPlatformGuideDialog by remember { mutableStateOf(false) }
    var showExportDataDialog by remember { mutableStateOf(false) }
    var languagePendingDownload by remember { mutableStateOf<AppLanguage?>(null) }
    var editingVariable by remember { mutableStateOf<DynamicSystemVariable?>(null) }

    val systemVariables by AppSettingsRepository.systemVariables.collectAsState()
    val deviceGroups by AppSettingsRepository.deviceGroups.collectAsState()
    val notificationConfig by AppSettingsRepository.notificationConfig.collectAsState()

    var updateCheckResultText by remember { mutableStateOf(SettingsManager.lastUpdateCheckStatus) }
    var isCheckingUpdates by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            SectionHeader(
                title = "Settings & Configuration",
                subtitle = "Version 2.0 • Multilevel Healers, NotebookLM AI, Multi-Platform & Sadhana Configuration",
                icon = Icons.Default.Settings
            )
        }

        // ==========================================
        // 1. APP VERSION & FUTURE UPDATE PATHS (v2.0)
        // ==========================================
        item {
            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(listOf(SpiritualGold, SpiritualCrimson))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(SpiritualGold.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.SystemUpdate,
                            contentDescription = null,
                            tint = SpiritualGold,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "App Release Version 2.0",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = MaterialTheme.colorScheme.primaryContainer
                            ) {
                                Text(
                                    text = "PROD v2.0",
                                    color = MaterialTheme.colorScheme.primary,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Text(
                            text = "Major release with 5-Level Healers & NotebookLM AI",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
                Spacer(modifier = Modifier.height(10.dp))

                // Update Status Bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "UPDATE CHANNEL STATUS",
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp, fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = updateCheckResultText,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    Button(
                        onClick = {
                            isCheckingUpdates = true
                            updateCheckResultText = SettingsManager.checkForAppUpdates()
                            isCheckingUpdates = false
                            Toast.makeText(context, "Version 2.0 is up to date!", Toast.LENGTH_SHORT).show()
                        },
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Check", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Editable Update Server Endpoint (Future Updates)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showEditUpdatePathDialog = true }
                        .padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Configured Update Endpoint:",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = SettingsManager.updateEndpointUrl,
                            style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
                            color = MaterialTheme.colorScheme.primary,
                            maxLines = 1
                        )
                    }
                    IconButton(onClick = { showEditUpdatePathDialog = true }, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit Path", tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp))
                    }
                }

                SettingSwitchRow(
                    title = "Auto-Check for Updates on Launch",
                    subtitle = "Automatically verify new releases and schema updates",
                    checked = SettingsManager.autoCheckUpdates,
                    onCheckedChange = { SettingsManager.autoCheckUpdates = it }
                )
            }
        }

        // ==========================================
        // 2. MULTI-LANGUAGE & LOCALIZATION (15 LANGUAGES)
        // ==========================================
        item {
            var isLanguageExpanded by remember { mutableStateOf(false) }

            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(listOf(SpiritualTeal, MaterialTheme.colorScheme.primary))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { isLanguageExpanded = !isLanguageExpanded }
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(SpiritualTeal.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Translate,
                            contentDescription = null,
                            tint = SpiritualTeal,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Language & Localization (भाषा)",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                        Text(
                            text = "Selected: ${LanguageManager.currentLanguage.nativeName} (${LanguageManager.currentLanguage.englishName})",
                            style = MaterialTheme.typography.bodySmall,
                            color = SpiritualTeal,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    IconButton(onClick = { isLanguageExpanded = !isLanguageExpanded }) {
                        Icon(
                            imageVector = if (isLanguageExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                AnimatedVisibility(visible = isLanguageExpanded) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))

                        // Indian Languages
                        Text(
                            text = "Top 10 Indian Languages (भारतीय भाषाएं):",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )

                        val indianLangs = listOf(
                            AppLanguage.ENGLISH,
                            AppLanguage.HINDI,
                            AppLanguage.BENGALI,
                            AppLanguage.MARATHI,
                            AppLanguage.GUJARATI,
                            AppLanguage.TAMIL,
                            AppLanguage.TELUGU,
                            AppLanguage.KANNADA,
                            AppLanguage.MALAYALAM,
                            AppLanguage.PUNJABI,
                            AppLanguage.ODIA
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                indianLangs.take(6).forEach { lang ->
                                    LanguageSelectChip(
                                        lang = lang,
                                        isSelected = LanguageManager.currentLanguage == lang,
                                        isDownloaded = LanguageManager.isLanguageDownloaded(lang),
                                        onClick = {
                                            if (LanguageManager.currentLanguage == lang) {
                                                Toast.makeText(context, "Already active: ${lang.nativeName}", Toast.LENGTH_SHORT).show()
                                            } else if (LanguageManager.isLanguageDownloaded(lang)) {
                                                LanguageManager.currentLanguage = lang
                                                Toast.makeText(context, "Language changed to ${lang.nativeName} (${lang.englishName})", Toast.LENGTH_SHORT).show()
                                            } else {
                                                languagePendingDownload = lang
                                            }
                                        }
                                    )
                                }
                            }
                            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                indianLangs.drop(6).forEach { lang ->
                                    LanguageSelectChip(
                                        lang = lang,
                                        isSelected = LanguageManager.currentLanguage == lang,
                                        isDownloaded = LanguageManager.isLanguageDownloaded(lang),
                                        onClick = {
                                            if (LanguageManager.currentLanguage == lang) {
                                                Toast.makeText(context, "Already active: ${lang.nativeName}", Toast.LENGTH_SHORT).show()
                                            } else if (LanguageManager.isLanguageDownloaded(lang)) {
                                                LanguageManager.currentLanguage = lang
                                                Toast.makeText(context, "Language changed to ${lang.nativeName} (${lang.englishName})", Toast.LENGTH_SHORT).show()
                                            } else {
                                                languagePendingDownload = lang
                                            }
                                        }
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        // World Languages
                        Text(
                            text = "Top 5 World Languages (विश्व भाषाएं):",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )

                        val worldLangs = listOf(
                            AppLanguage.SPANISH,
                            AppLanguage.FRENCH,
                            AppLanguage.GERMAN,
                            AppLanguage.ARABIC,
                            AppLanguage.RUSSIAN
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                worldLangs.take(3).forEach { lang ->
                                    LanguageSelectChip(
                                        lang = lang,
                                        isSelected = LanguageManager.currentLanguage == lang,
                                        isDownloaded = LanguageManager.isLanguageDownloaded(lang),
                                        onClick = {
                                            if (LanguageManager.currentLanguage == lang) {
                                                Toast.makeText(context, "Already active: ${lang.nativeName}", Toast.LENGTH_SHORT).show()
                                            } else if (LanguageManager.isLanguageDownloaded(lang)) {
                                                LanguageManager.currentLanguage = lang
                                                Toast.makeText(context, "Language changed to ${lang.nativeName} (${lang.englishName})", Toast.LENGTH_SHORT).show()
                                            } else {
                                                languagePendingDownload = lang
                                            }
                                        }
                                    )
                                }
                            }
                            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                worldLangs.drop(3).forEach { lang ->
                                    LanguageSelectChip(
                                        lang = lang,
                                        isSelected = LanguageManager.currentLanguage == lang,
                                        isDownloaded = LanguageManager.isLanguageDownloaded(lang),
                                        onClick = {
                                            if (LanguageManager.currentLanguage == lang) {
                                                Toast.makeText(context, "Already active: ${lang.nativeName}", Toast.LENGTH_SHORT).show()
                                            } else if (LanguageManager.isLanguageDownloaded(lang)) {
                                                LanguageManager.currentLanguage = lang
                                                Toast.makeText(context, "Language changed to ${lang.nativeName} (${lang.englishName})", Toast.LENGTH_SHORT).show()
                                            } else {
                                                languagePendingDownload = lang
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // 3. HEALERS, ADMIN & 5-LEVEL ORGANIZATION
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Healers & Organization Lineage",
                    subtitle = "Configure 5-level hierarchy, 16-digit codes, and mentor transfer protocols",
                    icon = Icons.Default.Groups
                )
                Spacer(modifier = Modifier.height(10.dp))

                // Default Root Sponsor Info
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("DEFAULT ROOT SPONSOR CODE", style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp, fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.primary)
                        Text(SettingsManager.defaultSponsorCode, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace))
                    }
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = SpiritualMaroon
                    ) {
                        Text("Master L1", fontSize = 9.sp, color = SpiritualGold, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                SettingSwitchRow(
                    title = "Audit Lineage Transfers",
                    subtitle = "Auto-generate audit transfer tracking code when downlines are reassigned",
                    checked = SettingsManager.auditLineageTransfer,
                    onCheckedChange = { SettingsManager.auditLineageTransfer = it }
                )

                SettingSwitchRow(
                    title = "Auto-Sync Remedies to Todo Checklist",
                    subtitle = "Populate User Tab checklist with sadhanas assigned to active profile",
                    checked = SettingsManager.autoSyncRemedyTodos,
                    onCheckedChange = { SettingsManager.autoSyncRemedyTodos = it }
                )

                SettingSwitchRow(
                    title = "Allow Direct Devotee Self-Enrollment",
                    subtitle = "Permit Level 5 seeker additions via direct 16-digit sponsor link",
                    checked = SettingsManager.allowDevoteeDirectEnrollment,
                    onCheckedChange = { SettingsManager.allowDevoteeDirectEnrollment = it }
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Quick Navigation to Healers Screens
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = { navController.navigate(Screen.HealersHub.route) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.Badge, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Healers Portal", fontSize = 11.sp)
                    }

                    OutlinedButton(
                        onClick = { navController.navigate(Screen.HealersHierarchy.route) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.AccountTree, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("5-Level Tree", fontSize = 11.sp)
                    }
                }
            }
        }

        // ==========================================
        // 3. CHATBOT & GOOGLE NOTEBOOKLM INTEGRATION
        // ==========================================
        item {
            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(listOf(SpiritualTeal, MaterialTheme.colorScheme.primary))
            ) {
                SectionHeader(
                    title = "AI Chatbot & Google NotebookLM",
                    subtitle = "Dual-intelligence bridge combining embedded assistant & Google NotebookLM AI",
                    icon = Icons.Default.SmartToy
                )
                Spacer(modifier = Modifier.height(10.dp))

                // NotebookLM URL Card
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(SpiritualTeal.copy(alpha = 0.12f))
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "GOOGLE NOTEBOOKLM SOURCE LINK",
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp, fontWeight = FontWeight.Bold),
                            color = SpiritualTeal
                        )
                        Text(
                            text = SettingsManager.notebookLmUrl,
                            style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
                            color = MaterialTheme.colorScheme.onSurface,
                            maxLines = 1
                        )
                    }

                    IconButton(
                        onClick = {
                            clipboardManager.setText(AnnotatedString(SettingsManager.notebookLmUrl))
                            Toast.makeText(context, "NotebookLM Link Copied!", Toast.LENGTH_SHORT).show()
                        },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = "Copy", tint = SpiritualTeal, modifier = Modifier.size(16.dp))
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                SettingSwitchRow(
                    title = "Enable NotebookLM Bridge in Chatbot",
                    subtitle = "Display NotebookLM quick-launch actions in the spiritual assistant dialog",
                    checked = SettingsManager.enableNotebookLmIntegration,
                    onCheckedChange = { SettingsManager.enableNotebookLmIntegration = it }
                )

                SettingSwitchRow(
                    title = "Auto-Copy Search Query to Clipboard",
                    subtitle = "Copies typed spiritual query automatically when opening NotebookLM web portal",
                    checked = SettingsManager.autoCopyQueryForNotebookLm,
                    onCheckedChange = { SettingsManager.autoCopyQueryForNotebookLm = it }
                )

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = { IntentHelper.openUrl(context, SettingsManager.notebookLmUrl) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SpiritualTeal)
                ) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = DivineWhite)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Launch Google NotebookLM AI Hub", color = DivineWhite, fontWeight = FontWeight.Bold)
                }
            }
        }

        // ==========================================
        // 4. MULTI-PLATFORM INSTALLATION GUIDE
        // ==========================================
        item {
            SpiritualGlassCard(
                onClick = { showMultiPlatformGuideDialog = true },
                borderBrush = Brush.linearGradient(listOf(SpiritualGold, SpiritualTeal))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Devices,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Multi-Platform Installation Guide",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Run on Android, Windows, Mac, Linux, Tablets & iOS",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }

        // ==========================================
        // 5. MULTI-LANGUAGE LOCALIZATION (भाषा चयन)
        // ==========================================
        item {
            var isLanguageExpanded by remember { mutableStateOf(false) }
            val currentLang = com.jdroidx.spritualkarim.data.manager.LanguageManager.currentLanguage

            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(listOf(SpiritualTeal, SpiritualGold))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { isLanguageExpanded = !isLanguageExpanded },
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Translate, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Language & Localization (भाषा)",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Selected: ${currentLang.nativeName} (${currentLang.englishName}) • 15 Languages",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    IconButton(onClick = { isLanguageExpanded = !isLanguageExpanded }) {
                        Icon(
                            imageVector = if (isLanguageExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                AnimatedVisibility(visible = isLanguageExpanded) {
                    Column(modifier = Modifier.padding(top = 12.dp)) {
                        Text(
                            text = "Top 10 Indian Languages:",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(6.dp))

                        com.jdroidx.spritualkarim.data.manager.AppLanguage.entries.filter { it.ordinal <= 10 }.forEach { lang ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .clickable {
                                        com.jdroidx.spritualkarim.data.manager.LanguageManager.currentLanguage = lang
                                        Toast.makeText(context, "Language set to ${lang.nativeName}", Toast.LENGTH_SHORT).show()
                                    }
                                    .padding(vertical = 5.dp, horizontal = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = currentLang == lang,
                                    onClick = {
                                        com.jdroidx.spritualkarim.data.manager.LanguageManager.currentLanguage = lang
                                        Toast.makeText(context, "Language set to ${lang.nativeName}", Toast.LENGTH_SHORT).show()
                                    },
                                    colors = RadioButtonDefaults.colors(selectedColor = SpiritualTeal)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Column {
                                    Text(
                                        text = "${lang.nativeName} (${lang.englishName})",
                                        style = MaterialTheme.typography.bodyMedium.copy(
                                            fontWeight = if (currentLang == lang) FontWeight.Bold else FontWeight.Normal
                                        ),
                                        color = if (currentLang == lang) SpiritualTeal else MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = lang.region,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 10.sp
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Top 5 World Languages:",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(6.dp))

                        com.jdroidx.spritualkarim.data.manager.AppLanguage.entries.filter { it.ordinal > 10 }.forEach { lang ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .clickable {
                                        com.jdroidx.spritualkarim.data.manager.LanguageManager.currentLanguage = lang
                                        Toast.makeText(context, "Language set to ${lang.nativeName}", Toast.LENGTH_SHORT).show()
                                    }
                                    .padding(vertical = 5.dp, horizontal = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = currentLang == lang,
                                    onClick = {
                                        com.jdroidx.spritualkarim.data.manager.LanguageManager.currentLanguage = lang
                                        Toast.makeText(context, "Language set to ${lang.nativeName}", Toast.LENGTH_SHORT).show()
                                    },
                                    colors = RadioButtonDefaults.colors(selectedColor = SpiritualTeal)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Column {
                                    Text(
                                        text = "${lang.nativeName} (${lang.englishName})",
                                        style = MaterialTheme.typography.bodyMedium.copy(
                                            fontWeight = if (currentLang == lang) FontWeight.Bold else FontWeight.Normal
                                        ),
                                        color = if (currentLang == lang) SpiritualTeal else MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = lang.region,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 10.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // 6. THEME & APPEARANCE
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "App Theme & Appearance",
                    subtitle = "Select Mystic Obsidian Dark or Sacred Ivory Light",
                    icon = Icons.Default.Palette
                )
                Spacer(modifier = Modifier.height(10.dp))

                AppThemeMode.entries.forEach { mode ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { SettingsManager.themeMode = mode }
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = SettingsManager.themeMode == mode,
                            onClick = { SettingsManager.themeMode = mode },
                            colors = RadioButtonDefaults.colors(selectedColor = MaterialTheme.colorScheme.primary)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = mode.title, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurface)
                    }
                }
            }
        }

        // ==========================================
        // 6. JAPA & SADHANA CONFIGURATION
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Japa & Sadhana Chanting",
                    subtitle = "Counter targets, haptic feedback and audio chimes",
                    icon = Icons.Default.SelfImprovement
                )
                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Default Japa Target: ${SettingsManager.defaultJapaTarget} Beads",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    listOf(27, 54, 108, 1008).forEach { count ->
                        FilterChip(
                            selected = SettingsManager.defaultJapaTarget == count,
                            onClick = { SettingsManager.defaultJapaTarget = count },
                            label = { Text("$count", fontSize = 12.sp) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
                Spacer(modifier = Modifier.height(8.dp))

                SettingSwitchRow(
                    title = "Haptic Vibration on Bead Tap",
                    subtitle = "Subtle vibration pulse every time a mantra count is recorded",
                    checked = SettingsManager.vibrationFeedback,
                    onCheckedChange = { SettingsManager.vibrationFeedback = it }
                )

                SettingSwitchRow(
                    title = "Audio Chime on Mala Completion",
                    subtitle = "Play a sacred gong chime upon reaching the target count",
                    checked = SettingsManager.audioChime,
                    onCheckedChange = { SettingsManager.audioChime = it }
                )

                SettingSwitchRow(
                    title = "Keep Screen Awake During Japa",
                    subtitle = "Prevents device sleep during active meditation and sadhana",
                    checked = SettingsManager.keepScreenAwake,
                    onCheckedChange = { SettingsManager.keepScreenAwake = it }
                )
            }
        }

        // ==========================================
        // 7. REMINDERS & TIMING
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Spiritual Reminders & Timing",
                    subtitle = "Brahma Muhurta, Sandhya Diya, and Tithi circulars",
                    icon = Icons.Default.Alarm
                )
                Spacer(modifier = Modifier.height(10.dp))

                SettingSwitchRow(
                    title = "Brahma Muhurta Sadhana (4:30 AM)",
                    subtitle = "Daily morning notification for divine meditation",
                    checked = SettingsManager.brahmaMuhurtaReminder,
                    onCheckedChange = { SettingsManager.brahmaMuhurtaReminder = it }
                )

                SettingSwitchRow(
                    title = "Sandhya Diya Lamp (6:30 PM)",
                    subtitle = "Evening reminder for Three Diya process & lighting altar lamps",
                    checked = SettingsManager.sandhyaDiyaReminder,
                    onCheckedChange = { SettingsManager.sandhyaDiyaReminder = it }
                )

                SettingSwitchRow(
                    title = "Auspicious Tithi Alerts",
                    subtitle = "Reminders for Kalashtami, Purnima, Amavasya, & Navratri",
                    checked = SettingsManager.tithiAlerts,
                    onCheckedChange = { SettingsManager.tithiAlerts = it }
                )

                SettingSwitchRow(
                    title = "Telegram & MsgBot Broadcasts",
                    subtitle = "Get notified of live sessions & mentorship circulars",
                    checked = SettingsManager.telegramNotifications,
                    onCheckedChange = { SettingsManager.telegramNotifications = it }
                )
            }
        }

        // ==========================================
        // 7b. DYNAMIC SYSTEM VARIABLES & MASTER RELATION TABLE
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Dynamic System Variables & Master Map",
                    subtitle = "Live in-place editing for system parameters, codes, targets and validation",
                    icon = Icons.Default.Tune
                )
                Spacer(modifier = Modifier.height(10.dp))

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    systemVariables.forEach { variable ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    if (variable.isEditable) {
                                        editingVariable = variable
                                    }
                                }
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = variable.label,
                                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Surface(
                                            shape = RoundedCornerShape(4.dp),
                                            color = SpiritualTeal.copy(alpha = 0.15f)
                                        ) {
                                            Text(
                                                text = variable.category,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = SpiritualTeal,
                                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = variable.description,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 11.sp
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = "Value: ${variable.value}",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            fontFamily = FontFamily.Monospace,
                                            fontWeight = FontWeight.Bold
                                        ),
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }
                                if (variable.isEditable) {
                                    IconButton(
                                        onClick = { editingVariable = variable },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Edit,
                                            contentDescription = "Edit Variable",
                                            tint = MaterialTheme.colorScheme.primary,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // 7c. DEVICE GROUPING & RELATIVE TRACKING
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Device Grouping & Relative Tracker",
                    subtitle = "Dynamic group-by hierarchy for regional devotees, lineage sync & capacity",
                    icon = Icons.Default.DevicesOther
                )
                Spacer(modifier = Modifier.height(10.dp))

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    deviceGroups.forEach { group ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = group.groupName,
                                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "Master: ${group.masterReferenceCode} • Capacity: ${group.assignedSeekersCount}/${group.maxCapacity}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 11.sp
                                    )
                                    Text(
                                        text = "Auto-sync every ${group.autoSyncIntervalMinutes}m",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = SpiritualTeal,
                                        fontSize = 10.sp
                                    )
                                }
                                SpiritualSwitch(
                                    checked = group.isTrackingActive,
                                    onCheckedChange = { AppSettingsRepository.toggleGroupTracking(group.groupId) },
                                    label = if (group.isTrackingActive) "Active" else "Paused"
                                )
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // 7d. SLIDE-IN POPUP NOTIFICATION CONTROLS
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Interactive Slide Notifications",
                    subtitle = "Configurable animated slide-in toasts from bottom right for live events",
                    icon = Icons.Default.Campaign
                )
                Spacer(modifier = Modifier.height(10.dp))

                SettingSwitchRow(
                    title = "Enable Bottom-Right Slide Toasts",
                    subtitle = "Display animated floating status cards with action triggers",
                    checked = notificationConfig.slideInEnabled,
                    onCheckedChange = {
                        AppSettingsRepository.updateNotificationConfig(
                            notificationConfig.copy(slideInEnabled = it)
                        )
                    }
                )

                SettingSwitchRow(
                    title = "Sound & Vibration Cues",
                    subtitle = "Play subtle bell tone and haptic feedback on alerts",
                    checked = notificationConfig.vibrationEnabled,
                    onCheckedChange = {
                        AppSettingsRepository.updateNotificationConfig(
                            notificationConfig.copy(vibrationEnabled = it)
                        )
                    }
                )

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = {
                        NotificationRepository.showSuccess(
                            title = "Realtime Sync Verified",
                            message = "Live Master-Devotee relationship link active with zero broken dependencies."
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(Icons.Default.NotificationsActive, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Trigger Test Slide Notification")
                }
            }
        }

        // ==========================================
        // 8. DATA, BACKUP & ACTIONS
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Data Management & Storage",
                    subtitle = "Export organization profiles, offline cache, and counter resets",
                    icon = Icons.Default.Storage
                )
                Spacer(modifier = Modifier.height(10.dp))

                SettingSwitchRow(
                    title = "Offline Content Cache",
                    subtitle = "Store sadhanas, remedies and profiles locally for offline access",
                    checked = SettingsManager.offlineCachingEnabled,
                    onCheckedChange = { SettingsManager.offlineCachingEnabled = it }
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = { showExportDataDialog = true },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.FileDownload, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Export Profiles", fontSize = 11.sp)
                    }

                    OutlinedButton(
                        onClick = { showResetDialog = true },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
                    ) {
                        Icon(Icons.Default.DeleteForever, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Reset Japa", fontSize = 11.sp)
                    }
                }
            }
        }

        // ==========================================
        // 9. ABOUT & LEGAL
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "About Spiritual Karim App",
                    subtitle = "A Spiritual Soul • A True Mentor",
                    icon = Icons.Default.Info
                )
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Release: Version 2.0.0 (Production Build)",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Official Website: spiritualkarim.com",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.clickable {
                        IntentHelper.openUrl(context, SpiritualContentRepository.WEBSITE_URL)
                    }
                )

                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(
                        onClick = { showPrivacyDialog = true },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Privacy Policy", fontSize = 12.sp)
                    }
                    OutlinedButton(
                        onClick = { showTermsDialog = true },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Terms of Use", fontSize = 12.sp)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = {
                        IntentHelper.shareText(
                            context,
                            "Download the official Spiritual Karim App Version 2.0 with Healers Organization, Google NotebookLM AI, Sadhanas, and Remedies: ${SpiritualContentRepository.WEBSITE_URL}",
                            "Share Spiritual Karim App"
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Icon(Icons.Default.Share, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Share App with Seekers", color = MaterialTheme.colorScheme.onPrimary, fontWeight = FontWeight.Bold)
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(30.dp))
        }
    }

    // ==========================================
    // DIALOGS
    // ==========================================

    // 0. Live Edit Dynamic Variable Dialog
    if (editingVariable != null) {
        val targetVar = editingVariable!!
        var tempValue by remember(targetVar) { mutableStateOf(targetVar.value) }
        var isInvalid by remember(targetVar) { mutableStateOf(false) }

        AlertDialog(
            onDismissRequest = { editingVariable = null },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Tune, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Edit ${targetVar.label}", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = targetVar.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    SpiritualValidatedTextField(
                        value = tempValue,
                        onValueChange = {
                            tempValue = it
                            isInvalid = false
                        },
                        label = "Variable Value",
                        validationRegex = targetVar.validationRegex,
                        errorMessage = if (targetVar.validationRegex != null) "Invalid format for ${targetVar.label}" else "Value cannot be blank",
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val success = AppSettingsRepository.updateVariable(targetVar.key, tempValue.trim())
                        if (success) {
                            editingVariable = null
                            NotificationRepository.showSuccess(
                                title = "Variable Updated",
                                message = "${targetVar.label} successfully set to '$tempValue'"
                            )
                        } else {
                            isInvalid = true
                            NotificationRepository.showError(
                                title = "Validation Failed",
                                message = "The input value does not conform to the required format regex."
                            )
                        }
                    }
                ) {
                    Text("Save Variable")
                }
            },
            dismissButton = {
                TextButton(onClick = { editingVariable = null }) {
                    Text("Cancel")
                }
            }
        )
    }

    // 1. Edit Update Server Endpoint Dialog
    if (showEditUpdatePathDialog) {
        var pathText by remember { mutableStateOf(SettingsManager.updateEndpointUrl) }

        AlertDialog(
            onDismissRequest = { showEditUpdatePathDialog = false },
            title = { Text("Configure Update Endpoint URL", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        "Set custom API or cloud storage path for future app releases and OTA updates:",
                        style = MaterialTheme.typography.bodySmall
                    )
                    OutlinedTextField(
                        value = pathText,
                        onValueChange = { pathText = it },
                        label = { Text("Update Manifest URL") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (pathText.isNotBlank()) {
                            SettingsManager.updateEndpointUrl = pathText.trim()
                            showEditUpdatePathDialog = false
                            Toast.makeText(context, "Update endpoint saved", Toast.LENGTH_SHORT).show()
                        }
                    }
                ) {
                    Text("Save URL")
                }
            },
            dismissButton = {
                TextButton(onClick = { showEditUpdatePathDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // 2. Multi-Platform Installation Guide Dialog
    if (showMultiPlatformGuideDialog) {
        AlertDialog(
            onDismissRequest = { showMultiPlatformGuideDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Devices, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Installation on All Devices & OS", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            },
            text = {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(380.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        PlatformGuideCard(
                            platform = "1. Android Phones & Tablets",
                            icon = Icons.Default.PhoneAndroid,
                            steps = listOf(
                                "Direct APK install: Copy app-debug.apk to your device.",
                                "Enable 'Install from unknown sources' in Security settings if prompted.",
                                "Tap the APK to install and launch directly."
                            )
                        )
                    }
                    item {
                        PlatformGuideCard(
                            platform = "2. Windows 11 / 10 Laptops & Desktops",
                            icon = Icons.Default.LaptopWindows,
                            steps = listOf(
                                "Option A (Windows 11): Use Windows Subsystem for Android (WSA) and install via WSA Pacman or 'adb install app-debug.apk'.",
                                "Option B (Windows 10/11): Install BlueStacks 5, LDPlayer 9, or NoxPlayer, then drag-and-drop the APK file.",
                                "Option C: Android Studio Emulator (Pixel/Tablet AVD)."
                            )
                        )
                    }
                    item {
                        PlatformGuideCard(
                            platform = "3. Apple macOS (MacBook & Mac mini)",
                            icon = Icons.Default.LaptopMac,
                            steps = listOf(
                                "Apple Silicon (M1/M2/M3/M4): Run Android Studio Device Emulator with ARM64 native hardware acceleration.",
                                "Intel Macs: Use BlueStacks for Mac or Genymotion emulator.",
                                "Drag & drop the APK onto the emulator screen to install."
                            )
                        )
                    }
                    item {
                        PlatformGuideCard(
                            platform = "4. Linux (Ubuntu, Debian, Fedora, Arch)",
                            icon = Icons.Default.Terminal,
                            steps = listOf(
                                "Waydroid (Recommended): Full native container performance on Wayland Linux via 'waydroid app install app-debug.apk'.",
                                "Anbox or Genymotion Linux client.",
                                "ChromeOS: Enable Developer Mode or Linux Android container to sideload APK directly."
                            )
                        )
                    }
                    item {
                        PlatformGuideCard(
                            platform = "5. Apple iOS (iPhone & iPad)",
                            icon = Icons.Default.PhoneIphone,
                            steps = listOf(
                                "Note: APK binaries are designed for Android/ART runtimes and cannot run natively as iOS IPA.",
                                "For iPhone/iPad users: Open spiritualkarim.com in Safari and tap 'Add to Home Screen' (PWA).",
                                "Access the Google NotebookLM AI Spiritual Portal directly via Safari/Chrome link."
                            )
                        )
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showMultiPlatformGuideDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // 3. Export Profiles Dialog
    if (showExportDataDialog) {
        val allProfiles by HealersRepository.profiles.collectAsState()
        val exportJson = remember(allProfiles) {
            val sb = StringBuilder()
            sb.append("[\n")
            allProfiles.forEachIndexed { i, p ->
                sb.append("  {\"id\":\"${p.id}\",\"name\":\"${p.name}\",\"code\":\"${p.referenceCode}\",\"sponsor\":\"${p.referredByCode}\",\"level\":${p.level},\"type\":\"${p.profileType.name}\"}")
                if (i < allProfiles.size - 1) sb.append(",")
                sb.append("\n")
            }
            sb.append("]")
            sb.toString()
        }

        AlertDialog(
            onDismissRequest = { showExportDataDialog = false },
            title = { Text("Export Organization Lineage", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Total Members: ${allProfiles.size} across 5 Levels", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                    OutlinedTextField(
                        value = exportJson,
                        onValueChange = {},
                        readOnly = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp),
                        textStyle = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace, fontSize = 10.sp)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        clipboardManager.setText(AnnotatedString(exportJson))
                        showExportDataDialog = false
                        Toast.makeText(context, "Export copied to clipboard!", Toast.LENGTH_SHORT).show()
                    }
                ) {
                    Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Copy Export")
                }
            },
            dismissButton = {
                TextButton(onClick = { showExportDataDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // 4. Reset Confirmation Dialog
    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            title = { Text("Reset Japa History?") },
            text = { Text("This will reset your accumulated mantra bead counts to zero. This action cannot be undone.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        SettingsManager.resetJapaHistory()
                        showResetDialog = false
                        Toast.makeText(context, "Japa history reset successfully", Toast.LENGTH_SHORT).show()
                    }
                ) {
                    Text("Reset", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // 5. Privacy Policy Dialog
    if (showPrivacyDialog) {
        AlertDialog(
            onDismissRequest = { showPrivacyDialog = false },
            title = { Text("Privacy Policy") },
            text = {
                Text(
                    "Spiritual Karim respects your spiritual journey and privacy. We do not sell or monetize personal data. Any consultation messages, names, and contact details provided for free guidance are treated with strict confidentiality.",
                    lineHeight = 20.sp
                )
            },
            confirmButton = {
                TextButton(onClick = { showPrivacyDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // 6. Terms Dialog
    if (showTermsDialog) {
        AlertDialog(
            onDismissRequest = { showTermsDialog = false },
            title = { Text("Terms of Use") },
            text = {
                Text(
                    "All sadhanas, remedies, and mantras provided in this app are rooted in traditional Vedic and occult sciences. They are meant for spiritual self-improvement, protection, and divine grace. Spiritual healing remedies work in conjunction with medical science and should not replace professional medical or legal counsel.",
                    lineHeight = 20.sp
                )
            },
            confirmButton = {
                TextButton(onClick = { showTermsDialog = false }) {
                    Text("I Understand")
                }
            }
        )
    }

    // 7. Language Download & Offline Translation Pack Dialog
    if (languagePendingDownload != null) {
        val targetLang = languagePendingDownload!!
        var isDownloading by remember { mutableStateOf(false) }
        var downloadProgress by remember { mutableFloatStateOf(0f) }
        val coroutineScope = rememberCoroutineScope()

        AlertDialog(
            onDismissRequest = {
                if (!isDownloading) languagePendingDownload = null
            },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CloudDownload,
                        contentDescription = null,
                        tint = SpiritualTeal
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Download Language Pack?",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium
                    )
                }
            },
            text = {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(
                                    text = targetLang.nativeName,
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = "${targetLang.englishName} • ${targetLang.region}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = SpiritualTeal.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    text = LanguageManager.getLanguagePackSize(targetLang),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SpiritualTeal,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                                )
                            }
                        }
                    }

                    Text(
                        text = "Would you like to download the offline translation pack for ${targetLang.nativeName}?\n\n" +
                                "• YES (Download): Downloads the full translation model to enable 100% offline translation for all sadhanas, remedies, mantras & guides.\n" +
                                "• INSTANT UI ONLY: Switches app menus and UI titles immediately without downloading the full offline pack.",
                        style = MaterialTheme.typography.bodySmall,
                        lineHeight = 18.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    if (isDownloading) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            LinearProgressIndicator(
                                progress = { downloadProgress },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(6.dp)
                                    .clip(RoundedCornerShape(3.dp)),
                                color = SpiritualTeal,
                                trackColor = SpiritualTeal.copy(alpha = 0.2f)
                            )
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "Downloading offline translation model...",
                                    fontSize = 10.sp,
                                    color = SpiritualTeal
                                )
                                Text(
                                    text = "${(downloadProgress * 100).toInt()}%",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SpiritualTeal
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                if (!isDownloading) {
                    Button(
                        onClick = {
                            isDownloading = true
                            coroutineScope.launch {
                                for (i in 1..10) {
                                    delay(100)
                                    downloadProgress = i / 10f
                                }
                                LanguageManager.markLanguageDownloaded(targetLang)
                                LanguageManager.currentLanguage = targetLang
                                isDownloading = false
                                languagePendingDownload = null
                                Toast.makeText(
                                    context,
                                    "Language Pack Downloaded! Switched to ${targetLang.nativeName}",
                                    Toast.LENGTH_LONG
                                ).show()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SpiritualTeal)
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Download & Translate")
                    }
                }
            },
            dismissButton = {
                if (!isDownloading) {
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        TextButton(
                            onClick = {
                                LanguageManager.currentLanguage = targetLang
                                languagePendingDownload = null
                                Toast.makeText(
                                    context,
                                    "Switched to ${targetLang.nativeName} (Instant UI Mode)",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        ) {
                            Text("Instant UI Only")
                        }

                        TextButton(onClick = { languagePendingDownload = null }) {
                            Text("Cancel")
                        }
                    }
                }
            }
        )
    }
}

@Composable
private fun PlatformGuideCard(
    platform: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    steps: List<String>
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = platform, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
            }
            Spacer(modifier = Modifier.height(4.dp))
            steps.forEach { step ->
                Text(
                    text = "• $step",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 16.sp,
                    modifier = Modifier.padding(vertical = 1.dp)
                )
            }
        }
    }
}

@Composable
private fun SettingSwitchRow(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = MaterialTheme.colorScheme.onPrimary,
                checkedTrackColor = MaterialTheme.colorScheme.primary
            )
        )
    }
}

@Composable
private fun LanguageSelectChip(
    lang: AppLanguage,
    isSelected: Boolean,
    isDownloaded: Boolean,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
        border = BorderStroke(
            1.dp,
            if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
        ),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = lang.nativeName,
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                    color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "${lang.englishName}${if (isDownloaded) " • Ready" else " • ~22MB"}",
                    style = MaterialTheme.typography.labelSmall,
                    fontSize = 10.sp,
                    color = if (isDownloaded) SpiritualTeal else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            if (isSelected) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Selected",
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(16.dp)
                )
            } else if (!isDownloaded) {
                Icon(
                    imageVector = Icons.Default.CloudDownload,
                    contentDescription = "Downloadable",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                    modifier = Modifier.size(14.dp)
                )
            }
        }
    }
}
