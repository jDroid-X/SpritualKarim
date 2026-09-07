package com.jdroidx.spritualkarim.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.*
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.data.manager.LanguageManager
import com.jdroidx.spritualkarim.data.model.*
import com.jdroidx.spritualkarim.data.repository.AppSettingsRepository
import com.jdroidx.spritualkarim.data.repository.ConnectionType
import com.jdroidx.spritualkarim.data.repository.HealersRepository
import com.jdroidx.spritualkarim.data.repository.NotificationRepository
import com.jdroidx.spritualkarim.data.repository.UserHubRepository
import com.jdroidx.spritualkarim.data.repository.VerificationMethod
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.ui.components.SpiritualCardFlipper
import com.jdroidx.spritualkarim.ui.components.SpiritualGlassCard
import com.jdroidx.spritualkarim.ui.components.SpiritualSegmentedToggle
import com.jdroidx.spritualkarim.ui.components.SpiritualUniversalInputBox
import com.jdroidx.spritualkarim.ui.components.SpiritualValidatedTextField
import com.jdroidx.spritualkarim.ui.theme.*
import com.jdroidx.spritualkarim.utils.IntentHelper

/**
 * User Tab Content rendering personalized tiles:
 * - Profile Switcher & Reference Code Card
 * - Today's Notice & Guidance
 * - Daily Sadhana Todo List
 * - Spiritual Assistant Chatbot
 * - MsgBot Broadcast Feed
 */
@Composable
fun UserTabContent(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val selectedProfileType by UserHubRepository.selectedProfileType.collectAsState()
    val allProfiles by HealersRepository.profiles.collectAsState()
    val notices by UserHubRepository.notices.collectAsState()
    val todos by UserHubRepository.todos.collectAsState()
    val chatMessages by UserHubRepository.chatMessages.collectAsState()
    val broadcasts by UserHubRepository.broadcasts.collectAsState()
    val lineageConvs by com.jdroidx.spritualkarim.data.repository.MsgBotRepository.conversations.collectAsState()

    // Find the primary active profile matching the selected profile type
    val activeProfile = allProfiles.firstOrNull { it.profileType == selectedProfileType }
        ?: allProfiles.firstOrNull()
        ?: HealerProfile(
            id = "prof-root-01",
            referenceCode = "SKHM-ADM1-7788-9900",
            referredByCode = "ROOT-0000-0000-0000",
            name = "Karim Ji (Founder)",
            phone = "+91 98765 43210",
            email = "karim.master@spiritualkarim.org",
            profileType = ProfileType.ADMIN,
            level = 1,
            objective = "Spiritual illumination"
        )

    // 4 Main Portal Navigation Tabs State (matching Devotee Portal Web)
    var activePortalTab by remember { mutableIntStateOf(0) }
    var activeDevoteeSubTab by remember { mutableIntStateOf(0) }
    var activeSeekerSubTab by remember { mutableIntStateOf(0) }

    // Dialog & Detail States
    var showChatDialog by remember { mutableStateOf(false) }
    var showAddTodoDialog by remember { mutableStateOf(false) }
    var showNewBroadcastDialog by remember { mutableStateOf(false) }
    var showSharePairingDialog by remember { mutableStateOf(false) }
    var showEditLineageDialog by remember { mutableStateOf(false) }
    var showGoliGyanModal by remember { mutableStateOf(false) }
    var selectedRemedyForDetail by remember { mutableStateOf<DevoteeCatalogItem?>(null) }
    var selectedSadhanaForWorkspace by remember { mutableStateOf<DevoteeActiveSadhana?>(null) }
    var selectedCredentialForDetail by remember { mutableStateOf<HealerCompletedCredential?>(null) }
    var selectedNoticeForDetails by remember { mutableStateOf<UserNoticeItem?>(null) }

    // Enrolled Remedies & Active Sadhanas State for Devotee
    var enrolledRemedyIds by remember { mutableStateOf(setOf("three_diya", "sri_yantra", "negativity")) }
    var activeSadhanasState by remember {
        mutableStateOf(
            listOf(
                DevoteeActiveSadhana(
                    id = "act-1",
                    title = "Three Diya Process",
                    category = "Divine Remedy",
                    domain = "remedies",
                    level = "Level 1 — Novice Initiation",
                    target = "3 Clay Diyas at Dusk Sandhya (Godhuli Bela)",
                    streak = "7 Days Continuous",
                    progressPercent = 35,
                    status = "In Progress",
                    notes = "Noticed positive shift and calmness in residential doorway.",
                    totalDays = 21,
                    completedDays = setOf(1, 2, 3, 4, 5, 6, 7),
                    memos = listOf(
                        SadhanaProgressMemo("m-1", "04 Sep 2026 06:15 PM", "Completed evening 3 earthen lamps at entrance threshold."),
                        SadhanaProgressMemo("m-2", "05 Sep 2026 06:20 PM", "Sea salt water threshold purification done. Energy feels lighter.")
                    )
                ),
                DevoteeActiveSadhana(
                    id = "act-2",
                    title = "Sri Yantra Sadhana",
                    category = "Sacred Sadhana",
                    domain = "sadhanas",
                    level = "Level 1 — Sacred Initiation",
                    target = "11 Malas Daily with Ghee Diya & Trataka",
                    streak = "14 Days Continuous",
                    progressPercent = 50,
                    status = "In Progress",
                    notes = "Ajna chakra concentration developing steadily.",
                    totalDays = 21,
                    completedDays = (1..14).toSet(),
                    memos = listOf(
                        SadhanaProgressMemo("m-3", "03 Sep 2026 04:30 AM", "Trataka on Bindu center completed during Brahma Muhurta.")
                    )
                ),
                DevoteeActiveSadhana(
                    id = "act-3",
                    title = "Negativity Cleansing (Bakhoor)",
                    category = "Cleansing & Healing",
                    domain = "cleansing",
                    level = "Level 1 — Space Cleansing",
                    target = "Fumigation on Tuesday & Saturday Dusk",
                    streak = "4 Sessions Done",
                    progressPercent = 60,
                    status = "Active Practice",
                    notes = "Household heavy atmosphere noticeably lifted.",
                    totalDays = 8,
                    completedDays = setOf(1, 2, 3, 4),
                    memos = listOf(
                        SadhanaProgressMemo("m-4", "02 Sep 2026 06:45 PM", "Whole house Bakhoor & Loban fumigation conducted East to West.")
                    )
                )
            )
        )
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // ==========================================
        // 1. MASTER PROFILE IDENTITY & REFERENCE CODE HEADER CARD (1st BOX)
        // ==========================================
        item {
            SpiritualGlassCard(
                modifier = Modifier.fillMaxWidth(),
                borderBrush = Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.6f),
                        MaterialTheme.colorScheme.secondary.copy(alpha = 0.5f)
                    )
                )
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Row 1: Profile Avatar + Name + Tier + Edit/Profile Icon Button
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        val initials = remember(activeProfile.name) {
                            activeProfile.name.split(" ")
                                .filter { it.isNotBlank() }
                                .take(2)
                                .map { it.first().uppercaseChar() }
                                .joinToString("")
                                .ifBlank { "SK" }
                        }

                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.radialGradient(
                                        listOf(
                                            MaterialTheme.colorScheme.primary,
                                            MaterialTheme.colorScheme.secondary
                                        )
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = initials,
                                color = MaterialTheme.colorScheme.onPrimary,
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 16.sp,
                                fontFamily = FontFamily.Serif
                            )
                        }

                        Spacer(modifier = Modifier.width(10.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = activeProfile.name,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp
                                ),
                                color = MaterialTheme.colorScheme.onSurface,
                                maxLines = 1
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                // Role Badge
                                Surface(
                                    shape = RoundedCornerShape(4.dp),
                                    color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.6f),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.4f))
                                ) {
                                    Text(
                                        text = activeProfile.formattedRoleBadge,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                                    )
                                }

                                // Active Member Status
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.6f),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary.copy(alpha = 0.4f))
                                ) {
                                    Text(
                                        text = "Active",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.secondary,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }

                        IconButton(
                            onClick = {
                                navController.navigate(Screen.HealerDetail.createRoute(activeProfile.id))
                            },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.AccountCircle,
                                contentDescription = "View Profile Details",
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }

                    // Row 2: Profile Specialization & Level Overview (No 16-digit code on home card)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)) {
                                Text("Spiritual Role / Level", fontSize = 8.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text(
                                    text = "${activeProfile.formattedRoleBadge} • Level ${activeProfile.level}",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    maxLines = 1
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)) {
                                Text("Category Tag", fontSize = 8.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text(
                                    text = activeProfile.categoryTag.ifBlank { "House Clean & Sadhana" },
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    maxLines = 1
                                )
                            }
                        }
                    }

                    // Row 4: Adaptive Persona Switcher Chips Bar (Smart fit for small & large screens)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Portal View:",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary,
                            fontSize = 10.sp
                        )

                        Row(
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            val availableTypes = remember(activeProfile.id) {
                                if (activeProfile.id == "prof-root-01") {
                                    listOf(ProfileType.ADMIN, ProfileType.HEALER, ProfileType.TRAINEE, ProfileType.DEVOTEE)
                                } else {
                                    listOf(ProfileType.HEALER, ProfileType.TRAINEE, ProfileType.DEVOTEE)
                                }
                            }

                            availableTypes.forEach { type ->
                                val isSelected = selectedProfileType == type
                                FilterChip(
                                    selected = isSelected,
                                    onClick = {
                                        UserHubRepository.setProfileType(type)
                                        Toast.makeText(context, "Switched to ${type.displayName}", Toast.LENGTH_SHORT).show()
                                    },
                                    label = {
                                        Text(
                                            text = if (type == ProfileType.DEVOTEE) "🌟 Seeker" else type.displayName.split(" ").last(),
                                            fontSize = 9.sp,
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                        )
                                    },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = MaterialTheme.colorScheme.primary,
                                        selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                                    ),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.height(26.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // 2. MAIN 4-TAB PORTAL NAVIGATION BAR (BELOW PROFILE HEADER CARD)
        // ==========================================
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                val portalTabs = listOf(
                    "🌟 1. Personal" to "Identity • Lineage",
                    "🎯 2. Purpose" to "Goals • Upayas",
                    "🌿 3. Trainee" to "In-Progress • Memos",
                    "👑 4. Healer" to "Siddhi • Network"
                )

                portalTabs.forEachIndexed { index, (title, subtitle) ->
                    val isSelected = activePortalTab == index
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent,
                        border = if (isSelected) BorderStroke(1.dp, SpiritualGold) else null,
                        modifier = Modifier
                            .weight(1f)
                            .clickable { activePortalTab = index }
                    ) {
                        Column(
                            modifier = Modifier.padding(vertical = 8.dp, horizontal = 2.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = title,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface,
                                textAlign = TextAlign.Center
                            )
                            Text(
                                text = subtitle,
                                fontSize = 8.sp,
                                color = if (isSelected) MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.8f) else MaterialTheme.colorScheme.onSurfaceVariant,
                                textAlign = TextAlign.Center,
                                maxLines = 1
                            )
                        }
                    }
                }
            }
        }

        // ==========================================
        // 4. TAB CONTENT PANELS
        // ==========================================

        // ------------------------------------------
        // TAB 1: 🌟 DEVOTEE PERSONAL
        // ------------------------------------------
        if (activePortalTab == 0) {
            item {
                // Sub-Tabs Bar: Identity / 3-Gen Lineage / House Clean
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    val subTabs = listOf("👤 Personal Identity", "🌳 3-Gen Lineage", "🧹 House Clean")
                    subTabs.forEachIndexed { idx, subTitle ->
                        val isSubSelected = activeDevoteeSubTab == idx
                        FilterChip(
                            selected = isSubSelected,
                            onClick = { activeDevoteeSubTab = idx },
                            label = { Text(subTitle, fontSize = 10.sp, fontWeight = if (isSubSelected) FontWeight.Bold else FontWeight.Normal) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = SpiritualGold.copy(alpha = 0.3f),
                                selectedLabelColor = SpiritualGoldDark
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // Sub-Tab 0: 👤 Personal Identity
            if (activeDevoteeSubTab == 0) {
                // Member Registration Data Card
                item {
                    SpiritualGlassCard {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Badge, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Member Registration Data", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
                        }
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            InfoFieldBox(label = "Role Tier", value = "Devotee Seeker (L${activeProfile.level})", modifier = Modifier.weight(1f))
                            InfoFieldBox(label = "Level", value = "Level ${activeProfile.level}", modifier = Modifier.weight(0.7f))
                            InfoFieldBox(label = "Category Tag", value = activeProfile.categoryTag.ifBlank { "House Clean & Sadhana" }, modifier = Modifier.weight(1.3f))
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            InfoFieldBox(label = "16-Digit Ref Code", value = activeProfile.referenceCode, isMonospace = true, modifier = Modifier.weight(1f))
                            InfoFieldBox(label = "Mentor / Guide Code", value = activeProfile.referredByCode.ifBlank { "SKHM-ADM1-7788-9900" }, isMonospace = true, modifier = Modifier.weight(1f))
                        }
                    }
                }
            }

            // Sub-Tab 1: 🌳 3-Gen Ancestral Lineage
            if (activeDevoteeSubTab == 1) {
                item {
                    com.jdroidx.spritualkarim.ui.components.Personal3GenLineageCard(
                        lineage = activeProfile.lineage,
                        onEditClick = { showEditLineageDialog = true }
                    )
                }
            }

            // Sub-Tab 2: 🧹 My House Clean Status
            if (activeDevoteeSubTab == 2) {
                item {
                    com.jdroidx.spritualkarim.ui.components.HouseCleanSection(
                        seekerId = activeProfile.id,
                        seekerName = activeProfile.name,
                        currentViewerProfileType = selectedProfileType,
                        viewerReferenceCode = activeProfile.referredByCode.ifBlank { "SKHM-ADM1-7788-9900" },
                        viewerName = "Mentor Guide"
                    )
                }
            }
        }

        // ------------------------------------------
        // TAB 2: 🎯 SEEKER PURPOSE & UPAYAS CATALOG
        // ------------------------------------------
        if (activePortalTab == 1) {
            item {
                // Sub-Tabs for Seeker Purpose
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    val subTabs = listOf("🎯 Purpose & Goals", "🧹 Clean Logs", "🕉️ Sadhanas")
                    subTabs.forEachIndexed { idx, subTitle ->
                        val isSubSelected = activeSeekerSubTab == idx
                        FilterChip(
                            selected = isSubSelected,
                            onClick = { activeSeekerSubTab = idx },
                            label = { Text(subTitle, fontSize = 10.sp, fontWeight = if (isSubSelected) FontWeight.Bold else FontWeight.Normal) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = SpiritualOrange.copy(alpha = 0.3f),
                                selectedLabelColor = SpiritualOrange
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // Sub-Tab 0: Purpose & Goals Diagnostics + 16 Upayas Catalog
            if (activeSeekerSubTab == 0) {
                // Spiritual Objective & Case Diagnostics Card
                item {
                    SpiritualGlassCard {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CrisisAlert, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("My Spiritual Objective & Case History", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
                        }
                        Spacer(modifier = Modifier.height(8.dp))

                        InfoFieldBox(
                            label = "My Spiritual Problem Statement & Purpose",
                            value = activeProfile.objective.ifBlank { "Overcoming household stress, learning 3 Diya process, and purifying ancestral karma." }
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            InfoFieldBox(
                                label = "Duration of Affliction",
                                value = activeProfile.seekerDiagnostics.afflictionDuration.ifBlank { "3 Years" },
                                modifier = Modifier.weight(1f)
                            )
                            InfoFieldBox(
                                label = "Kuldevi / Pitru Issues",
                                value = activeProfile.seekerDiagnostics.kuldeviIssues.ifBlank { "Kuldevi Puja Pending" },
                                modifier = Modifier.weight(1f)
                            )
                            InfoFieldBox(
                                label = "Target Outcome",
                                value = activeProfile.seekerDiagnostics.targetOutcome.ifBlank { "Peace & Health" },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }

                // Prescribed Remedies & Divine Upayas Catalog Card
                item {
                    SpiritualGlassCard {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.LocalFireDepartment, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Prescribed Remedies & Divine Upayas Catalog", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "💡 Interactive Upaya & Remedy Catalog: Click any Remedy card or 👁️ to inspect complete ritual procedures, samagri, and mantras. Tick the checkbox to add it to your Enrolled Queue. Click '🚀 Send to Trainee' to immediately start practice in your Trainee Sadhak tab!",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 11.sp,
                            lineHeight = 16.sp
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        // 3 Remedy Groups
                        val remedyCatalog = remember { getDevoteeRemediesCatalog() }
                        val categories = listOf(
                            "🪔 Divine Remedies & Fire Havans Catalog" to remedyCatalog.filter { it.category == "Divine Remedy" },
                            "🌿 Energy Cleansing & Karmic Healing Upayas" to remedyCatalog.filter { it.category == "Cleansing & Healing" },
                            "🕉️ Sacred Sadhanas Catalog" to remedyCatalog.filter { it.category == "Sacred Sadhana" }
                        )

                        categories.forEach { (catTitle, itemsList) ->
                            Text(
                                text = catTitle,
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 11.sp),
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(vertical = 6.dp)
                            )

                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                itemsList.forEach { remedy ->
                                    val isEnrolled = enrolledRemedyIds.contains(remedy.id)
                                    DevoteeRemedyCatalogCard(
                                        item = remedy,
                                        isEnrolled = isEnrolled,
                                        onToggleEnroll = {
                                            enrolledRemedyIds = if (isEnrolled) enrolledRemedyIds - remedy.id else enrolledRemedyIds + remedy.id
                                            if (!isEnrolled) {
                                                NotificationRepository.showSuccess(
                                                    title = "Remedy Enrolled",
                                                    message = "${remedy.title} added to your active practice queue."
                                                )
                                            } else {
                                                NotificationRepository.showInfo(
                                                    title = "Queue Updated",
                                                    message = "${remedy.title} removed from queue."
                                                )
                                            }
                                        },
                                        onInspect = { selectedRemedyForDetail = remedy },
                                        onSendToTrainee = {
                                            if (!activeSadhanasState.any { it.title == remedy.title }) {
                                                activeSadhanasState = activeSadhanasState + DevoteeActiveSadhana(
                                                    id = "act-${System.currentTimeMillis()}",
                                                    title = remedy.title,
                                                    category = remedy.category,
                                                    domain = remedy.domain,
                                                    level = "Level 1 — Novice Initiation",
                                                    target = remedy.timing,
                                                    streak = "1 Day",
                                                    progressPercent = 10,
                                                    status = "In Progress",
                                                    notes = "Newly enrolled from Upayas Catalog."
                                                )
                                            }
                                            NotificationRepository.showSuccess(
                                                title = "Sent to Active Practice",
                                                message = "${remedy.title} transferred to My Active Sadhanas workspace."
                                            )
                                            activePortalTab = 2 // Switch to Tab 3
                                        }
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                        }
                    }
                }
            }

            // Sub-Tab 1: House Clean Logs Summary
            if (activeSeekerSubTab == 1) {
                item {
                    SpiritualGlassCard {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CleaningServices, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Seeker House Clean Verification Logs", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
                        }
                        Spacer(modifier = Modifier.height(10.dp))

                        val cleanLevels = listOf(
                            Triple("Level 1: Self House Clean", "85% Clean • Certified", SpiritualTeal),
                            Triple("Level 2: Parents House Clean", "60% Clean • In Review with Mentor", SpiritualOrange),
                            Triple("Level 3: Relative House Clean", "Pending Initiation", MaterialTheme.colorScheme.onSurfaceVariant)
                        )

                        cleanLevels.forEach { (title, status, color) ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                border = BorderStroke(1.dp, color.copy(alpha = 0.4f)),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column {
                                        Text(title, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                        Text(status, fontSize = 10.sp, color = color, fontWeight = FontWeight.SemiBold)
                                    }
                                    OutlinedButton(
                                        onClick = {
                                            activePortalTab = 0
                                            activeDevoteeSubTab = 2
                                        },
                                        shape = RoundedCornerShape(8.dp),
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                        modifier = Modifier.height(28.dp)
                                    ) {
                                        Text("Open", fontSize = 10.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Sub-Tab 2: Enrolled Sadhanas Queue
            if (activeSeekerSubTab == 2) {
                item {
                    SpiritualGlassCard {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.AutoMirrored.Filled.FormatListBulleted, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Enrolled / Specific Interest Queue (${enrolledRemedyIds.size} Ticked)", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Ticked items automatically synchronize with your Trainee In-Progress workspace.", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Spacer(modifier = Modifier.height(10.dp))

                        val allCatalog = remember { getDevoteeRemediesCatalog() }
                        val enrolledItems = allCatalog.filter { enrolledRemedyIds.contains(it.id) }

                        if (enrolledItems.isEmpty()) {
                            Text("No remedies currently in queue. Tick items in Sub-Tab 1 to enroll.", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        } else {
                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                enrolledItems.forEach { remedy ->
                                    DevoteeRemedyCatalogCard(
                                        item = remedy,
                                        isEnrolled = true,
                                        onToggleEnroll = {
                                            enrolledRemedyIds = enrolledRemedyIds - remedy.id
                                            Toast.makeText(context, "Removed ${remedy.title} from queue", Toast.LENGTH_SHORT).show()
                                        },
                                        onInspect = { selectedRemedyForDetail = remedy },
                                        onSendToTrainee = {
                                            activePortalTab = 2
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // ------------------------------------------
        // TAB 3: 🌿 TRAINEE SADHAK (IN-PROGRESS WORKSPACE)
        // ------------------------------------------
        if (activePortalTab == 2) {
            item {
                SpiritualGlassCard {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.SelfImprovement, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Trainee Sadhak • In-Progress Dashboard", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
                        }

                        // Goli Gyan Sacred Wisdom Guide Button
                        Button(
                            onClick = { showGoliGyanModal = true },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                            modifier = Modifier.height(30.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = SpiritualGold)
                        ) {
                            Icon(Icons.Default.Info, contentDescription = null, modifier = Modifier.size(13.dp), tint = MaterialTheme.colorScheme.scrim)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("📜 Goli Gyan Guide", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.scrim)
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "💡 Tap any active sadhana tile to open the In-Progress Graphical Workspace with day checklist, progress ring, and date-time stamped memos.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Group by domains
                    val domains = listOf(
                        "🕉️ 1. Sacred Sadhanas In-Progress" to activeSadhanasState.filter { it.domain == "sadhanas" },
                        "🪔 2. Divine Remedies & Havans In-Progress" to activeSadhanasState.filter { it.domain == "remedies" },
                        "🌿 3. Energy Cleansing & Healing In-Progress" to activeSadhanasState.filter { it.domain == "cleansing" }
                    )

                    domains.forEach { (title, sadhanaList) ->
                        Text(
                            text = title,
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 11.sp),
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )

                        if (sadhanaList.isEmpty()) {
                            Text("No sadhanas currently active in this group. Enroll from Tab 2.", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(bottom = 6.dp))
                        } else {
                            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                sadhanaList.forEach { item ->
                                    DevoteeActiveSadhanaCard(
                                        item = item,
                                        onClick = { selectedSadhanaForWorkspace = item }
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                    }
                }
            }
        }

        // ------------------------------------------
        // TAB 4: 👑 HEALER MENTORSHIP & MASTER SIDDHIS
        // ------------------------------------------
        if (activePortalTab == 3) {
            // 1. Levels of Sadhana Completed with Level Status & Master Certifications
            item {
                SpiritualGlassCard {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Verified, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Master Siddhis & Completed Certifications", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "💡 Tap any master credential or siddhi card to inspect official attunement certificate, lineage privileges, and authorization seals.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    val credentials = remember { getDevoteeCompletedCredentials() }
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        credentials.forEach { cred ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                border = BorderStroke(1.dp, SpiritualGold.copy(alpha = 0.4f)),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedCredentialForDetail = cred }
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(cred.title, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface)
                                        Text("${cred.level} • ${cred.badge}", fontSize = 10.sp, color = SpiritualGold)
                                        Text("Certified: ${cred.certDate}", fontSize = 9.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = SpiritualGold.copy(alpha = 0.2f),
                                        border = BorderStroke(1.dp, SpiritualGold)
                                    ) {
                                        Text(
                                            text = "📜 View Cert",
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = SpiritualGold,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 2. Mentorship Network: Connected Seekers & Trainees List
            item {
                SpiritualGlassCard {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Group, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Mentorship Network (Connected Seekers)", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
                        }

                        // Share / Pair Button
                        OutlinedButton(
                            onClick = { showSharePairingDialog = true },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                            modifier = Modifier.height(28.dp)
                        ) {
                            Icon(Icons.Default.PersonAdd, contentDescription = null, modifier = Modifier.size(12.dp), tint = SpiritualTeal)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("+ Pair Seeker", fontSize = 10.sp, color = SpiritualTeal)
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Real-time downline connected seekers. Discuss house clean progress and approve % ratings.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    val connectedSeekers = remember { getConnectedSeekersList() }
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        connectedSeekers.forEach { seeker ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f),
                                border = BorderStroke(1.dp, SpiritualTeal.copy(alpha = 0.35f)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Column {
                                            Text(seeker.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface)
                                            Text(seeker.refCode, fontSize = 9.sp, fontFamily = FontFamily.Monospace, color = MaterialTheme.colorScheme.primary)
                                        }
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = SpiritualTeal.copy(alpha = 0.2f)
                                        ) {
                                            Text(
                                                text = seeker.status,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = SpiritualTeal,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(6.dp))

                                    Text(
                                        text = "🧹 House Clean: ${seeker.cleanPercent}",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = "🌿 Active Upayas: ${seeker.activeRemediesCount} In-Progress",
                                        fontSize = 10.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )

                                    Spacer(modifier = Modifier.height(8.dp))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.End
                                    ) {
                                        Button(
                                            onClick = {
                                                Toast.makeText(context, "Opened discussion & verification for ${seeker.name}", Toast.LENGTH_SHORT).show()
                                            },
                                            shape = RoundedCornerShape(6.dp),
                                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                            modifier = Modifier.height(28.dp),
                                            colors = ButtonDefaults.buttonColors(containerColor = SpiritualTeal)
                                        ) {
                                            Icon(Icons.Default.RateReview, contentDescription = null, modifier = Modifier.size(12.dp), tint = DivineWhite)
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Review & Approve %", fontSize = 10.sp, color = DivineWhite)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // 4. QUICK SHORTCUT TO HEALERS MULTI-LEVEL HUB
        // ==========================================
        item {
            SpiritualGlassCard(
                onClick = { navController.navigate(Screen.HealersHub.route) },
                borderBrush = Brush.linearGradient(listOf(SpiritualGold, SpiritualCrimson))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(SpiritualMaroon),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.AccountTree,
                            contentDescription = null,
                            tint = SpiritualGold,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Healers & Organization Portal",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Manage profiles, 5-level hierarchy, remedies & 16-digit lineage",
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
        // 3. TILE 1: TODAY'S NOTICE (DAILY GUIDANCE)
        // ==========================================
        item {
            UserTileHeader(
                title = LanguageManager.getString("notice_title"),
                icon = Icons.Default.Campaign,
                badge = "${notices.size} Live",
                actionLabel = "View All",
                onAction = {}
            )
        }

        val filteredNotices = notices.filter {
            it.targetProfiles.contains(selectedProfileType) || it.targetProfiles.isEmpty()
        }

        items(filteredNotices.take(2), key = { it.id }) { notice ->
            SpiritualGlassCard(
                onClick = { selectedNoticeForDetails = notice }
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = MaterialTheme.colorScheme.primaryContainer
                    ) {
                        Text(
                            text = notice.priorityBadge,
                            color = MaterialTheme.colorScheme.primary,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                    Text(
                        text = notice.date,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = notice.title,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = notice.summary,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 18.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "— Issued by: ${notice.author}",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium),
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }

        // ==========================================
        // 4. TILE 2: TODO LIST (SADHANA & REMEDY CHECKLIST)
        // ==========================================
        val personaTodos = todos.filter {
            selectedProfileType == ProfileType.ADMIN || it.profileType == selectedProfileType
        }

        item {
            UserTileHeader(
                title = LanguageManager.getString("todo_title"),
                icon = Icons.Default.Checklist,
                badge = "${personaTodos.count { it.isCompleted }}/${personaTodos.size} Done",
                actionLabel = "+ Add Task",
                onAction = { showAddTodoDialog = true }
            )
        }

        if (personaTodos.isEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "No pending tasks for ${selectedProfileType.displayName}. Tap '+ Add Task' to add a custom sadhana or remedy.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            items(personaTodos, key = { it.id }) { todo ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surface)
                        .border(
                            BorderStroke(
                                1.dp,
                                if (todo.isCompleted) MaterialTheme.colorScheme.secondary.copy(alpha = 0.5f)
                                else MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)
                            ),
                            RoundedCornerShape(12.dp)
                        )
                        .clickable { UserHubRepository.toggleTodo(todo.id) }
                        .padding(horizontal = 12.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = todo.isCompleted,
                        onCheckedChange = { UserHubRepository.toggleTodo(todo.id) },
                        colors = CheckboxDefaults.colors(
                            checkedColor = MaterialTheme.colorScheme.secondary,
                            checkmarkColor = MaterialTheme.colorScheme.onSecondary
                        )
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = todo.taskTitle,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.SemiBold,
                                textDecoration = if (todo.isCompleted) androidx.compose.ui.text.style.TextDecoration.LineThrough
                                else androidx.compose.ui.text.style.TextDecoration.None
                            ),
                            color = if (todo.isCompleted) MaterialTheme.colorScheme.onSurfaceVariant
                            else MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "${todo.category} • ${todo.subText}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 11.sp
                        )
                    }

                    IconButton(
                        onClick = { UserHubRepository.deleteTodo(todo.id) },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Delete",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }

        // ==========================================
        // 5. TILE 3: CHATBOT (ASK GUIDANCE ON SADHANA AND REMIDIES - NOTEBOOKLM INTEGRATED)
        // ==========================================
        item {
            UserTileHeader(
                title = LanguageManager.getString("chatbot_title"),
                icon = Icons.Default.Psychology,
                badge = "24/7 AI Bot",
                actionLabel = LanguageManager.getString("open_chat"),
                onAction = { showChatDialog = true }
            )
        }

        item {
            SpiritualGlassCard(
                onClick = { showChatDialog = true },
                borderBrush = Brush.linearGradient(listOf(SpiritualTeal, MaterialTheme.colorScheme.primary))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(CircleShape)
                            .background(SpiritualTeal.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.SmartToy,
                            contentDescription = null,
                            tint = SpiritualTeal,
                            modifier = Modifier.size(26.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Ask Guidance on Sadhana and Remidies",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = SpiritualTeal.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    text = "NotebookLM",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SpiritualTeal,
                                    modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Text(
                            text = LanguageManager.getString("chatbot_subtitle"),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Button(
                        onClick = { showChatDialog = true },
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = SpiritualTeal)
                    ) {
                        Text(
                            text = LanguageManager.getString("open_chat"),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = DivineWhite
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Prompt Chips + 1-Tap NotebookLM Link (without 16-digit code)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf(
                        "Three Diya Process",
                        "Sri Yantra Timing",
                        "Nazar & Evil Eye",
                        "Court Cases Remedy",
                        "Business Growth"
                    ).forEach { chip ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.clickable {
                                UserHubRepository.sendChatMessage(chip)
                                showChatDialog = true
                            }
                        ) {
                            Text(
                                text = chip,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    // Direct NotebookLM Web Chip
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = SpiritualTeal.copy(alpha = 0.15f),
                        modifier = Modifier.clickable {
                            IntentHelper.openUrl(context, UserHubRepository.NOTEBOOKLM_URL)
                        }
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.OpenInNew,
                                contentDescription = null,
                                tint = SpiritualTeal,
                                modifier = Modifier.size(12.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "NotebookLM AI Web",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = SpiritualTeal
                            )
                        }
                    }
                }
            }
        }

        // ==========================================
        // 6. TILE 4: MSGBOT (WHATSAPP-STYLE LINEAGE CHAT & BROADCASTS)
        // ==========================================
        item {
            UserTileHeader(
                title = LanguageManager.getString("msgbot_title"),
                icon = Icons.Default.Forum,
                badge = "WhatsApp-Style",
                actionLabel = "Open Full Chat",
                onAction = { navController.navigate(Screen.LineageChat.createRoute()) }
            )
        }

        // Quick WhatsApp Lineage Chats with Mentors & Downlines
        items(lineageConvs.take(2), key = { it.conversationId }) { conv ->
            SpiritualGlassCard(
                onClick = { navController.navigate(Screen.LineageChat.createRoute(conv.conversationId)) }
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(if (conv.isUpline) SpiritualMaroon else SpiritualTeal),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (conv.isUpline) "L${conv.participantLevel}" else "D${conv.participantLevel}",
                            color = DivineWhite,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = conv.participantName,
                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant
                            ) {
                                Text(
                                    text = if (conv.isUpline) "Mentor" else "Downline",
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (conv.isUpline) SpiritualMaroon else SpiritualTeal,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                )
                            }
                        }
                        Text(
                            text = conv.lastMessageText,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(conv.lastMessageTime, fontSize = 9.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        if (conv.unreadCount > 0) {
                            Spacer(modifier = Modifier.height(2.dp))
                            Surface(
                                shape = CircleShape,
                                color = Color(0xFF00A884),
                                modifier = Modifier.size(16.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text("${conv.unreadCount}", color = DivineWhite, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }

        // MsgBot Announcements Stream
        items(broadcasts.take(1), key = { it.id }) { bc ->
            SpiritualGlassCard {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = if (bc.isUrgent) SpiritualCrimson.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        Text(
                            text = bc.levelTag,
                            color = if (bc.isUrgent) SpiritualCrimson else MaterialTheme.colorScheme.primary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                    Text(
                        text = bc.timestamp,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = bc.message,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 20.sp
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "— From: ${bc.senderName} (${bc.senderRole})",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }

    // ==========================================
    // DIALOGS
    // ==========================================

    // 1. Notice Detail Dialog
    if (selectedNoticeForDetails != null) {
        val notice = selectedNoticeForDetails!!
        AlertDialog(
            onDismissRequest = { selectedNoticeForDetails = null },
            title = {
                Text(
                    text = notice.title,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "${notice.priorityBadge} • ${notice.date}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.secondary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = notice.fullContent,
                        style = MaterialTheme.typography.bodyMedium,
                        lineHeight = 22.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Issued by: ${notice.author}",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = { selectedNoticeForDetails = null }) {
                    Text("Close")
                }
            }
        )
    }

    // 2. Add Todo Dialog
    if (showAddTodoDialog) {
        var taskName by remember { mutableStateOf("") }
        var taskDetails by remember { mutableStateOf("") }
        var category by remember { mutableStateOf("Sadhana") }

        AlertDialog(
            onDismissRequest = { showAddTodoDialog = false },
            title = { Text("Add Sadhana / Remedy Task", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = taskName,
                        onValueChange = { taskName = it },
                        label = { Text("Task / Sadhana Title") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = taskDetails,
                        onValueChange = { taskDetails = it },
                        label = { Text("Instructions / Japa Target") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = category,
                        onValueChange = { category = it },
                        label = { Text("Category (Japa / Diya / Cleansing)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (taskName.isNotBlank()) {
                            UserHubRepository.addTodo(
                                title = taskName,
                                subText = taskDetails.ifBlank { "Daily spiritual practice" },
                                category = category.ifBlank { "Sadhana" },
                                profileType = selectedProfileType
                            )
                            showAddTodoDialog = false
                        }
                    }
                ) {
                    Text("Add Task")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddTodoDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // 3. Chatbot Assistant Modal / Dialog
    if (showChatDialog) {
        var inputQuery by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showChatDialog = false },
            title = {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Default.SmartToy,
                        contentDescription = null,
                        tint = SpiritualTeal,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Spiritual Karim Assistant", fontWeight = FontWeight.Bold, fontSize = 16.sp, modifier = Modifier.weight(1f))
                    IconButton(
                        onClick = { IntentHelper.openUrl(context, UserHubRepository.NOTEBOOKLM_URL) },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(Icons.AutoMirrored.Filled.OpenInNew, contentDescription = "Open NotebookLM", tint = SpiritualTeal, modifier = Modifier.size(18.dp))
                    }
                }
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(390.dp)
                ) {
                    // Google NotebookLM AI Banner Card
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 8.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = CardDefaults.cardColors(containerColor = SpiritualTeal.copy(alpha = 0.12f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Google NotebookLM AI Connected",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SpiritualTeal
                                )
                                Text(
                                    text = "Full discourse transcripts & deep AI answers",
                                    fontSize = 9.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            TextButton(
                                onClick = { IntentHelper.openUrl(context, UserHubRepository.NOTEBOOKLM_URL) },
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                modifier = Modifier.height(28.dp)
                            ) {
                                Text("Open AI Hub", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = SpiritualTeal)
                            }
                        }
                    }

                    val chatListState = rememberLazyListState()
                    LaunchedEffect(chatMessages.size) {
                        if (chatMessages.isNotEmpty()) {
                            chatListState.animateScrollToItem(chatMessages.size - 1)
                        }
                    }

                    // Chat messages list with Auto-Scroll
                    LazyColumn(
                        state = chatListState,
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(chatMessages, key = { it.id }) { msg ->
                            Box(
                                modifier = Modifier.fillMaxWidth(),
                                contentAlignment = if (msg.isFromUser) Alignment.CenterEnd else Alignment.CenterStart
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = if (msg.isFromUser) MaterialTheme.colorScheme.primary
                                    else MaterialTheme.colorScheme.surfaceVariant,
                                    modifier = Modifier.widthIn(max = 250.dp)
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Text(
                                            text = msg.message,
                                            color = if (msg.isFromUser) MaterialTheme.colorScheme.onPrimary
                                            else MaterialTheme.colorScheme.onSurface,
                                            fontSize = 13.sp,
                                            lineHeight = 18.sp
                                        )
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(
                                            text = msg.timestamp,
                                            color = if (msg.isFromUser) MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.7f)
                                            else MaterialTheme.colorScheme.onSurfaceVariant,
                                            fontSize = 9.sp,
                                            textAlign = TextAlign.End,
                                            modifier = Modifier.fillMaxWidth()
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Human-In-The-Loop Quick Suggestion Strip inside Dialog
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf("Three Diya Step", "Sri Yantra Rule", "Evil Eye Cure", "Business Upaya", "Court Cases").forEach { chip ->
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier.clickable {
                                    UserHubRepository.sendChatMessage(chip)
                                }
                            ) {
                                Text(
                                    text = chip,
                                    fontSize = 10.sp,
                                    color = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Universal Input Box with Speech-to-Text, Keyboard and Auto-Timestamp
                    SpiritualUniversalInputBox(
                        initialText = inputQuery,
                        placeholder = "Ask sadhana / remedy question (or tap mic)...",
                        minLines = 1,
                        maxLines = 4,
                        modifier = Modifier.fillMaxWidth(),
                        onSend = { sentQuery, timestamp ->
                            UserHubRepository.sendChatMessage(sentQuery)
                            inputQuery = ""
                        }
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // Secondary action: Ask directly in NotebookLM
                    OutlinedButton(
                        onClick = {
                            val textToSearch = if (inputQuery.isNotBlank()) inputQuery else "Guidance on Sadhanas and Remedies"
                            clipboardManager.setText(AnnotatedString(textToSearch))
                            Toast.makeText(context, "Query copied! Opening NotebookLM AI...", Toast.LENGTH_SHORT).show()
                            IntentHelper.openUrl(context, UserHubRepository.NOTEBOOKLM_URL)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(vertical = 4.dp)
                    ) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Ask in NotebookLM (Copy Query & Open AI Web)", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showChatDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // 4. Post Broadcast Dialog
    if (showNewBroadcastDialog) {
        var msgText by remember { mutableStateOf("") }
        var isUrgent by remember { mutableStateOf(false) }

        AlertDialog(
            onDismissRequest = { showNewBroadcastDialog = false },
            title = { Text("Broadcast New Message", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Broadcasting as: ${activeProfile.name} (${activeProfile.profileType.displayName})",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                    OutlinedTextField(
                        value = msgText,
                        onValueChange = { msgText = it },
                        label = { Text("Announcement Message") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 4
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = isUrgent,
                            onCheckedChange = { isUrgent = it }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Mark as Priority / Urgent Notice", fontSize = 12.sp)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (msgText.isNotBlank()) {
                            UserHubRepository.postBroadcast(
                                senderName = activeProfile.name,
                                role = activeProfile.profileType.displayName,
                                message = msgText,
                                isUrgent = isUrgent
                            )
                            showNewBroadcastDialog = false
                        }
                    }
                ) {
                    Text("Send Broadcast")
                }
            },
            dismissButton = {
                TextButton(onClick = { showNewBroadcastDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // 5. Share 16-Digit Reference Code & Device-to-Device Pairing Dialog
    if (showSharePairingDialog) {
        SharePairingDialog(
            sourceProfile = activeProfile,
            onDismiss = { showSharePairingDialog = false }
        )
    }

    // 6. Edit 3-Gen Ancestral Lineage Dialog
    if (showEditLineageDialog) {
        com.jdroidx.spritualkarim.ui.components.EditLineageDialog(
            initialLineage = activeProfile.lineage,
            onDismiss = { showEditLineageDialog = false },
            onSave = { updatedLineage ->
                HealersRepository.updateProfileLineage(activeProfile.id, updatedLineage)
                showEditLineageDialog = false
                NotificationRepository.showSuccess(
                    title = "Lineage Updated",
                    message = "3-Generation Ancestral Lineage data synchronized to master profile."
                )
            }
        )
    }

    // 7. Sadhana & Remedy Full Rituals Slide-out Modal Dialog
    if (selectedRemedyForDetail != null) {
        val remedy = selectedRemedyForDetail!!
        SadhanaDetailModalDialog(
            remedy = remedy,
            isEnrolled = enrolledRemedyIds.contains(remedy.id),
            onDismiss = { selectedRemedyForDetail = null },
            onToggleEnroll = {
                val isEnrolled = enrolledRemedyIds.contains(remedy.id)
                enrolledRemedyIds = if (isEnrolled) enrolledRemedyIds - remedy.id else enrolledRemedyIds + remedy.id
                if (!isEnrolled) {
                    NotificationRepository.showSuccess(
                        title = "Remedy Enrolled",
                        message = "${remedy.title} added to active queue."
                    )
                } else {
                    NotificationRepository.showInfo(
                        title = "Queue Updated",
                        message = "${remedy.title} removed from queue."
                    )
                }
            },
            onSendToTrainee = {
                if (!activeSadhanasState.any { it.title == remedy.title }) {
                    activeSadhanasState = activeSadhanasState + DevoteeActiveSadhana(
                        id = "act-${System.currentTimeMillis()}",
                        title = remedy.title,
                        category = remedy.category,
                        domain = remedy.domain,
                        level = "Level 1 — Novice Initiation",
                        target = remedy.timing,
                        streak = "1 Day",
                        progressPercent = 10,
                        status = "In Progress",
                        notes = "Enrolled from Upayas Catalog."
                    )
                }
                selectedRemedyForDetail = null
                activePortalTab = 2
                NotificationRepository.showSuccess(
                    title = "Transferred to Trainee",
                    message = "${remedy.title} transferred to In-Progress Sadhana workspace."
                )
            }
        )
    }

    // 8. Goli Gyan for Seekers Sacred Wisdom Guide Modal
    if (showGoliGyanModal) {
        GoliGyanModalDialog(
            onDismiss = { showGoliGyanModal = false }
        )
    }

    // 9. Trainee In-Progress Sadhana Graphical Workspace Modal
    if (selectedSadhanaForWorkspace != null) {
        val curSadhana = selectedSadhanaForWorkspace!!
        TraineeSadhanaWorkspaceDialog(
            sadhana = curSadhana,
            onDismiss = { selectedSadhanaForWorkspace = null },
            onToggleDay = { dayNum ->
                val newCompleted = if (curSadhana.completedDays.contains(dayNum)) {
                    curSadhana.completedDays - dayNum
                } else {
                    curSadhana.completedDays + dayNum
                }
                val newPercent = if (curSadhana.totalDays > 0) ((newCompleted.size.toFloat() / curSadhana.totalDays.toFloat()) * 100).toInt() else 0
                val updated = curSadhana.copy(
                    completedDays = newCompleted,
                    progressPercent = newPercent,
                    streak = "${newCompleted.size} Days Logged"
                )
                activeSadhanasState = activeSadhanasState.map { if (it.id == updated.id) updated else it }
                selectedSadhanaForWorkspace = updated
            },
            onAddMemo = { memoText ->
                val newMemo = SadhanaProgressMemo(
                    id = "memo-${System.currentTimeMillis()}",
                    timestamp = java.text.SimpleDateFormat("dd MMM yyyy hh:mm a", java.util.Locale.getDefault()).format(java.util.Date()),
                    text = memoText
                )
                val updated = curSadhana.copy(memos = curSadhana.memos + newMemo)
                activeSadhanasState = activeSadhanasState.map { if (it.id == updated.id) updated else it }
                selectedSadhanaForWorkspace = updated
                NotificationRepository.showSuccess(
                    title = "Progress Memo Logged",
                    message = "Experience memo timestamped and recorded in sadhana diary."
                )
            },
            onCompleteMilestone = {
                val updated = curSadhana.copy(
                    progressPercent = 100,
                    status = "Completed & Mastered",
                    completedDays = (1..curSadhana.totalDays).toSet()
                )
                activeSadhanasState = activeSadhanasState.map { if (it.id == updated.id) updated else it }
                selectedSadhanaForWorkspace = null
                NotificationRepository.showSuccess(
                    title = "Milestone Achieved! 🎉",
                    message = "You have completed 100% of ${curSadhana.title} sadhana cycle."
                )
            }
        )
    }

    // 10. Healer Master Credential & Certificate Modal
    if (selectedCredentialForDetail != null) {
        HealerCredentialModalDialog(
            credential = selectedCredentialForDetail!!,
            onDismiss = { selectedCredentialForDetail = null }
        )
    }
}

/**
 * Interactive Share & Device Pairing Dialog.
 * Enables sharing 16-digit reference code with:
 * 1. Healer (Parallel Connection at same level)
 * 2. Trainee / Devotee (Level-Down connection added to hierarchy tree)
 * Uses Mobile Number OTP Code or Telegram Bot verification to link 2 devices.
 */
@Composable
fun SharePairingDialog(
    sourceProfile: HealerProfile,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    var selectedConnectionType by remember { mutableStateOf(ConnectionType.PARALLEL_HEALER) }
    var selectedTargetRole by remember { mutableStateOf(ProfileType.TRAINEE) }
    var selectedVerificationMethod by remember { mutableStateOf(VerificationMethod.MOBILE_OTP) }

    var targetName by remember { mutableStateOf("") }
    var targetPhoneOrHandle by remember { mutableStateOf("") }
    var inputTokenForActivation by remember { mutableStateOf("") }
    var showDirectActivationInput by remember { mutableStateOf(false) }

    val activePin = remember(sourceProfile.referenceCode, selectedConnectionType, selectedVerificationMethod) {
        (100000 + (kotlin.math.abs(sourceProfile.referenceCode.hashCode() + selectedConnectionType.ordinal * 31) % 900000)).toString()
    }

    val botHandle = remember { AppSettingsRepository.getVariableValue("TELEGRAM_BOT_HANDLE", "SpiritualKarimBot") }
    val githubDownloadUrl = remember { AppSettingsRepository.getVariableValue("GITHUB_RELEASE_DOWNLOAD_URL", "https://github.com/jiten/SpritualKarim/releases/latest/download/app-debug.apk") }
    val githubRepoUrl = remember { AppSettingsRepository.getVariableValue("GITHUB_REPO_URL", "https://github.com/jiten/SpritualKarim") }

    val invitePayload = remember(sourceProfile, selectedConnectionType, selectedTargetRole, selectedVerificationMethod, activePin, botHandle, githubDownloadUrl) {
        val roleStr = if (selectedConnectionType == ConnectionType.PARALLEL_HEALER) "Healer (Parallel Co-Mentor)" else selectedTargetRole.displayName
        """
        🕉️ SPIRITUAL KARIM • SACRED LINEAGE PAIRING INVITE
        
        Mentor: ${sourceProfile.name} (Level ${sourceProfile.level})
        16-Digit Reference Code: ${sourceProfile.referenceCode}
        
        Connection Type: ${selectedConnectionType.title}
        Assigned Role: $roleStr
        
        Verification Method: ${selectedVerificationMethod.title}
        Activation Pairing PIN: $activePin
        Telegram Bot Pairing: https://t.me/$botHandle?start=pair_${sourceProfile.referenceCode.replace("-","")}_$activePin
        
        ⏱️ Link Validity: Valid for 24 Hours only (Upline approval required). Multiple resends allowed.
        📦 GitHub Direct APK Download: $githubDownloadUrl
        🌐 GitHub Releases & Updates: $githubRepoUrl
        
        Enter this 16-digit code in your Spiritual Karim app to activate real-time device synchronization with your lineage.
        """.trimIndent()
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Share, contentDescription = null, tint = SpiritualTeal)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Share & Pair Reference Code",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Source Code Display Banner
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "YOUR 16-DIGIT SPONSOR CODE",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = sourceProfile.referenceCode,
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                ),
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = MaterialTheme.colorScheme.primaryContainer
                        ) {
                            Text(
                                text = "L${sourceProfile.level}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }

                // 1. Connection Type Selector (Parallel vs Level-Down)
                Text(
                    text = "1. Select Connection Relationship:",
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )

                ConnectionType.entries.forEach { connType ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (selectedConnectionType == connType) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface,
                        border = BorderStroke(
                            1.dp,
                            if (selectedConnectionType == connType) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedConnectionType = connType }
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = selectedConnectionType == connType,
                                onClick = { selectedConnectionType = connType }
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Column {
                                Text(
                                    text = connType.title,
                                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                    color = if (selectedConnectionType == connType) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = connType.subtitle,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }

                // If Level-Down chosen: Role picker
                if (selectedConnectionType == ConnectionType.DOWNLINE_MEMBER) {
                    Text(
                        text = "Target Downline Role:",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(ProfileType.TRAINEE, ProfileType.DEVOTEE).forEach { role ->
                            FilterChip(
                                selected = selectedTargetRole == role,
                                onClick = { selectedTargetRole = role },
                                label = { Text(role.displayName, fontSize = 11.sp) },
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }

                // 2. Verification Method Selector
                Text(
                    text = "2. Device Activation & Verification Channel:",
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    VerificationMethod.values().forEach { method ->
                        FilterChip(
                            selected = selectedVerificationMethod == method,
                            onClick = { selectedVerificationMethod = method },
                            label = { Text(method.title, fontSize = 11.sp) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // Generated PIN / Verification Box
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = SpiritualTeal.copy(alpha = 0.12f),
                    border = BorderStroke(1.dp, SpiritualTeal.copy(alpha = 0.4f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "GENERATED ACTIVATION PIN",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = SpiritualTeal
                            )
                            Text(
                                text = activePin,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 3.sp,
                                    fontFamily = FontFamily.Monospace
                                ),
                                color = SpiritualTeal
                            )
                        }
                        IconButton(
                            onClick = {
                                clipboardManager.setText(AnnotatedString(activePin))
                                Toast.makeText(context, "PIN Copied: $activePin", Toast.LENGTH_SHORT).show()
                            }
                        ) {
                            Icon(Icons.Default.ContentCopy, contentDescription = "Copy PIN", tint = SpiritualTeal)
                        }
                    }
                }

                // Preview formatted share text
                Text(
                    text = "Shareable Invitation Payload:",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.7f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = invitePayload,
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp, fontFamily = FontFamily.Monospace),
                        color = MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.padding(10.dp)
                    )
                }

                // Action Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            IntentHelper.shareText(context, invitePayload, "Spiritual Karim Reference Code & Pairing")
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = SpiritualTeal)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(14.dp), tint = DivineWhite)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Share via Apps", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = DivineWhite)
                    }

                    OutlinedButton(
                        onClick = {
                            clipboardManager.setText(AnnotatedString(invitePayload))
                            Toast.makeText(context, "Full Invite Copied!", Toast.LENGTH_SHORT).show()
                        },
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = "Copy", modifier = Modifier.size(14.dp))
                    }
                }

                HorizontalDivider()

                // Interactive Instant Pairing Simulator / Direct Activation
                if (!showDirectActivationInput) {
                    OutlinedButton(
                        onClick = { showDirectActivationInput = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.PhonelinkRing, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Test Direct Device Pairing (Simulate 2nd Device)", fontSize = 11.sp)
                    }
                } else {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                            .padding(10.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "Simulate Partner Device Linking:",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )
                        OutlinedTextField(
                            value = targetName,
                            onValueChange = { targetName = it },
                            placeholder = { Text("New Member Name (e.g. Healer Ramesh)", fontSize = 12.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                        OutlinedTextField(
                            value = inputTokenForActivation,
                            onValueChange = { inputTokenForActivation = it },
                            placeholder = { Text("Enter 6-Digit PIN (e.g. $activePin)", fontSize = 12.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                        Button(
                            onClick = {
                                val tokenToUse = if (inputTokenForActivation.isBlank()) activePin else inputTokenForActivation
                                val result = HealersRepository.verifyAndActivateDevicePairing(
                                    sourceReferenceCode = sourceProfile.referenceCode,
                                    inputToken = tokenToUse,
                                    newMemberName = targetName,
                                    newMemberPhone = targetPhoneOrHandle,
                                    connectionType = selectedConnectionType,
                                    targetRole = selectedTargetRole
                                )
                                result.onSuccess { pairedProfile ->
                                    Toast.makeText(
                                        context,
                                        "Device Paired Successfully!\n${pairedProfile.name} added as ${pairedProfile.profileType.displayName} (L${pairedProfile.level})",
                                        Toast.LENGTH_LONG
                                    ).show()
                                    onDismiss()
                                }.onFailure { error ->
                                    Toast.makeText(context, "Pairing Failed: ${error.message}", Toast.LENGTH_SHORT).show()
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Activate & Link Device Now", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Done")
            }
        }
    )
}

@Composable
fun UserTileHeader(
    title: String,
    icon: ImageVector,
    badge: String? = null,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = MaterialTheme.colorScheme.primary
        )
        if (badge != null) {
            Spacer(modifier = Modifier.width(8.dp))
            Surface(
                shape = RoundedCornerShape(6.dp),
                color = MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)
            ) {
                Text(
                    text = badge,
                    color = MaterialTheme.colorScheme.secondary,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
        }
        Spacer(modifier = Modifier.weight(1f))
        if (actionLabel != null && onAction != null) {
            Text(
                text = actionLabel,
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .clickable { onAction() }
                    .padding(4.dp)
            )
        }
    }
}

/**
 * Compact field box for Profile & Member Registration Data.
 */
@Composable
fun InfoFieldBox(
    label: String,
    value: String,
    modifier: Modifier = Modifier,
    isMonospace: Boolean = false
) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.25f)),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)) {
            Text(
                text = label,
                fontSize = 9.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value.ifBlank { "—" },
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                fontFamily = if (isMonospace) FontFamily.Monospace else FontFamily.Default,
                maxLines = 2
            )
        }
    }
}

/**
 * Interactive Remedy Card for Upayas Catalog with 3D Card Flipper (front: summary & actions, back: procedure, samagri & mantra).
 */
@Composable
fun DevoteeRemedyCatalogCard(
    item: DevoteeCatalogItem,
    isEnrolled: Boolean,
    onToggleEnroll: () -> Unit,
    onInspect: () -> Unit,
    onSendToTrainee: () -> Unit
) {
    SpiritualCardFlipper(
        modifier = Modifier.fillMaxWidth(),
        frontContent = {
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = if (isEnrolled) SpiritualGold.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface,
                border = BorderStroke(
                    1.dp,
                    if (isEnrolled) SpiritualGold else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = isEnrolled,
                        onCheckedChange = { onToggleEnroll() },
                        colors = CheckboxDefaults.colors(checkedColor = SpiritualGold, checkmarkColor = MaterialTheme.colorScheme.scrim)
                    )

                    Spacer(modifier = Modifier.width(4.dp))

                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onInspect() }
                    ) {
                        Text(
                            text = item.title,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "${item.tag} • ${item.timing}",
                            fontSize = 9.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        // 👁️ Inspect Ritual Details Button
                        IconButton(
                            onClick = onInspect,
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Visibility,
                                contentDescription = "Inspect",
                                tint = SpiritualGoldDark,
                                modifier = Modifier.size(16.dp)
                            )
                        }

                        // 🚀 Direct Send to Trainee Button
                        FilledIconButton(
                            onClick = onSendToTrainee,
                            modifier = Modifier.size(28.dp),
                            colors = IconButtonDefaults.filledIconButtonColors(containerColor = SpiritualTeal)
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.Send,
                                contentDescription = "Send to Trainee",
                                tint = DivineWhite,
                                modifier = Modifier.size(13.dp)
                            )
                        }
                    }
                }
            }
        },
        backContent = {
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.8f),
                border = BorderStroke(1.dp, SpiritualTeal.copy(alpha = 0.6f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "📖 ${item.title} (Ritual Procedure)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = SpiritualTeal
                        )
                        Text(
                            text = "Tap to Flip Back ↻",
                            fontSize = 9.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Samagri: ${item.ingredients}",
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "Procedure: ${item.steps.joinToString(" • ").take(140)}...",
                        fontSize = 9.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 13.sp
                    )
                }
            }
        }
    )
}

/**
 * Active Group Summary Card for Devotee 2x2 Dashboard Drill-Down.
 */
@Composable
fun DevoteeActiveSummaryCard(
    icon: ImageVector,
    groupTitle: String,
    metricText: String,
    subText: String,
    accentColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(10.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
        border = BorderStroke(1.dp, accentColor.copy(alpha = 0.4f)),
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(accentColor.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = accentColor,
                        modifier = Modifier.size(16.dp)
                    )
                }
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = "Drill Down",
                    tint = accentColor.copy(alpha = 0.7f),
                    modifier = Modifier.size(14.dp)
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = groupTitle,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = accentColor
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = metricText,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subText,
                fontSize = 9.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1
            )
        }
    }
}

/**
 * Card for Active In-Progress Sadhanas (Daily Log).
 */
@Composable
fun DevoteeActiveSadhanaCard(
    item: DevoteeActiveSadhana,
    onClick: (() -> Unit)? = null
) {
    val context = LocalContext.current
    var isVerifiedPending by remember { mutableStateOf(false) }

    Surface(
        shape = RoundedCornerShape(10.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.4f)),
        modifier = Modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier)
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = item.title,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.weight(1f)
                )
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (isVerifiedPending) MaterialTheme.colorScheme.tertiaryContainer else MaterialTheme.colorScheme.primaryContainer,
                    border = BorderStroke(1.dp, if (isVerifiedPending) MaterialTheme.colorScheme.tertiary else MaterialTheme.colorScheme.primary)
                ) {
                    Text(
                        text = if (isVerifiedPending) "Verification Pending" else item.status,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isVerifiedPending) MaterialTheme.colorScheme.tertiary else MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "${item.level} • Target: ${item.target}",
                fontSize = 10.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(6.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                LinearProgressIndicator(
                    progress = { item.progressPercent / 100f },
                    modifier = Modifier
                        .weight(1f)
                        .height(5.dp)
                        .clip(RoundedCornerShape(3.dp)),
                    color = MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "${item.progressPercent}% (${item.streak})",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            if (item.notes.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Log: \"${item.notes}\"",
                    fontSize = 10.sp,
                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                OutlinedButton(
                    onClick = {
                        isVerifiedPending = true
                        NotificationRepository.showInfo(
                            title = "Verification Sent to Upline",
                            message = "Progress for ${item.title} (${item.progressPercent}%) submitted to mentor for official approval."
                        )
                        Toast.makeText(context, "Verification request sent to upline", Toast.LENGTH_SHORT).show()
                    },
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                    modifier = Modifier.height(28.dp)
                ) {
                    Icon(Icons.Default.Verified, contentDescription = null, modifier = Modifier.size(12.dp), tint = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(if (isVerifiedPending) "Upline Notified" else "Verify with Upline", fontSize = 10.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

/**
 * Slide-out Dialog for full Sadhana / Upaya Ritual Guide.
 */
@Composable
fun SadhanaDetailModalDialog(
    remedy: DevoteeCatalogItem,
    isEnrolled: Boolean,
    onDismiss: () -> Unit,
    onToggleEnroll: () -> Unit,
    onSendToTrainee: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(remedy.icon, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(remedy.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(remedy.tag, fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = remedy.summary,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface,
                        lineHeight = 17.sp,
                        modifier = Modifier.padding(8.dp)
                    )
                }

                if (remedy.mantra.isNotBlank()) {
                    Text("Sacred Mantra:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = SpiritualGold)
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = SpiritualGold.copy(alpha = 0.1f),
                        border = BorderStroke(1.dp, SpiritualGold.copy(alpha = 0.4f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = remedy.mantra,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontFamily = FontFamily.Serif,
                            modifier = Modifier.padding(8.dp),
                            lineHeight = 18.sp
                        )
                    }
                }

                Text("Aasan & Timing:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Text("⏰ Timing: ${remedy.timing}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text("🧭 Direction: ${remedy.aasanDirection}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

                Text("Samagri & Ingredients:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Text(remedy.ingredients, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 16.sp)

                Text("Step-by-Step Procedure:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                remedy.steps.forEachIndexed { i, st ->
                    Text("${i + 1}. $st", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface, lineHeight = 16.sp)
                }

                Text("Benefits:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = SpiritualTeal)
                Text(remedy.benefits, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 16.sp)
            }
        },
        confirmButton = {
            Button(
                onClick = onSendToTrainee,
                colors = ButtonDefaults.buttonColors(containerColor = SpiritualGold),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(13.dp), tint = MaterialTheme.colorScheme.scrim)
                Spacer(modifier = Modifier.width(4.dp))
                Text("Send to My Sadhanas", color = MaterialTheme.colorScheme.scrim, fontWeight = FontWeight.Bold, fontSize = 11.sp)
            }
        },
        dismissButton = {
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                OutlinedButton(
                    onClick = onToggleEnroll,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(if (isEnrolled) "Unenroll" else "Enroll in Queue", fontSize = 11.sp)
                }
                TextButton(onClick = onDismiss) {
                    Text("Close", fontSize = 11.sp)
                }
            }
        }
    )
}

/**
 * Modal Viewer for Goli Gyan for Seekers Sacred Wisdom Guide.
 */
@Composable
fun GoliGyanModalDialog(onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Info, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text("Goli Gyan for Seekers", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("Sacred Wisdom Guide • 7 Daily Principles", fontSize = 11.sp, color = SpiritualGold)
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val goliGyanPoints = listOf(
                    "Principle 1: Purity of Threshold" to "Purify the home entrance threshold daily with sea salt water and 3 earthen mustard oil lamps before dusk.",
                    "Principle 2: Breath Alignment" to "Align every Japa cycle with Nadi Shodhana pranayama (alternate nostril breathing) to balance Ida and Pingala channels.",
                    "Principle 3: Unwavering Satvik Diet" to "Refrain from onion, garlic, alcohol, and non-satvik foods during intense 21-day anushthan cycles.",
                    "Principle 4: Ancestral Gratitude (Pitru Shanti)" to "Offer water to roots of holy Peepal / Banyan trees on Tuesdays to alleviate ancestral and karmic debts.",
                    "Principle 5: Trataka on Sacred Geometry" to "Fix steady gaze at the central Bindu of consecrated Sri Yantra for 5 minutes daily to awaken intuitive Ajna vision.",
                    "Principle 6: Smoke Detoxing" to "Perform whole house Bakhoor, Loban & Guggul fumigation on Tuesdays and Saturdays from East to West rooms.",
                    "Principle 7: Surrender to Mentor Lineage" to "Maintain open closed-loop discussion with your upline sponsor guide for authentic % Clean certifications."
                )

                goliGyanPoints.forEach { (title, desc) ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                        border = BorderStroke(1.dp, SpiritualGold.copy(alpha = 0.25f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(8.dp)) {
                            Text(title, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(desc, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface, lineHeight = 16.sp)
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(containerColor = SpiritualGold),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Understood", color = MaterialTheme.colorScheme.scrim, fontWeight = FontWeight.Bold)
            }
        }
    )
}

/**
 * Progressive Drill-Down Graphical Workspace Dialog for Trainee In-Progress Sadhana.
 * Includes interactive 21-day completion grid, progress calculation, date-time stamped memos with universal speech-to-text / typing, and upline verification.
 */
@Composable
fun TraineeSadhanaWorkspaceDialog(
    sadhana: DevoteeActiveSadhana,
    onDismiss: () -> Unit,
    onToggleDay: (Int) -> Unit,
    onAddMemo: (String) -> Unit,
    onCompleteMilestone: () -> Unit
) {
    val context = LocalContext.current
    var isVerificationSent by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.SelfImprovement, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(sadhana.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("${sadhana.level} • In-Progress Workspace", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Progress Bar and Metric Ring
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Overall Sadhana Progress", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                            Text("${sadhana.completedDays.size}/${sadhana.totalDays} Days (${sadhana.progressPercent}%)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        LinearProgressIndicator(
                            progress = { sadhana.progressPercent / 100f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("🎯 Daily Target: ${sadhana.target}", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }

                // Interactive Day Completion Checklist Grid (e.g. 21 Days)
                Text("🗓️ Daily Japa & Ritual Checklist (Tap to toggle):", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)

                val daysList = (1..sadhana.totalDays).toList()
                daysList.chunked(7).forEach { weekRow ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        weekRow.forEach { dayNum ->
                            val isDone = sadhana.completedDays.contains(dayNum)
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = if (isDone) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                                border = BorderStroke(1.dp, if (isDone) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { onToggleDay(dayNum) }
                            ) {
                                Box(
                                    modifier = Modifier.padding(vertical = 6.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "D$dayNum",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isDone) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Progress Memos List
                Text("📝 Daily Experience Logs & Memos (${sadhana.memos.size}):", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)

                if (sadhana.memos.isEmpty()) {
                    Text("No memos recorded yet. Add your experiences below.", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        sadhana.memos.forEach { memo ->
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(6.dp)) {
                                    Text(memo.timestamp, fontSize = 8.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(memo.text, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface, lineHeight = 14.sp)
                                }
                            }
                        }
                    }
                }

                // Standard Universal Input Box for Sadhana Memos
                SpiritualUniversalInputBox(
                    placeholder = "Log daily insight / ritual memo (speech or type)...",
                    minLines = 2,
                    maxLines = 4,
                    modifier = Modifier.fillMaxWidth(),
                    onSend = { text, timestamp ->
                        onAddMemo("$text")
                    }
                )

                // Verify with Upline Section
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Upline Mentor Approval", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                            Text(
                                text = if (isVerificationSent) "Sent to upline for certification" else "Request mentor to review logged progress",
                                fontSize = 9.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Button(
                            onClick = {
                                isVerificationSent = true
                                NotificationRepository.showInfo(
                                    title = "Verification Forwarded",
                                    message = "Sadhana log for ${sadhana.title} (${sadhana.progressPercent}%) forwarded to upline for certification."
                                )
                                Toast.makeText(context, "Verification sent to upline", Toast.LENGTH_SHORT).show()
                            },
                            shape = RoundedCornerShape(6.dp),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                            modifier = Modifier.height(30.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Icon(Icons.Default.Verified, contentDescription = null, modifier = Modifier.size(12.dp), tint = MaterialTheme.colorScheme.onPrimary)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(if (isVerificationSent) "Sent" else "Verify Progress", fontSize = 10.sp, color = MaterialTheme.colorScheme.onPrimary)
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = onCompleteMilestone,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.Verified, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onPrimary)
                Spacer(modifier = Modifier.width(4.dp))
                Text("Complete Milestone", color = MaterialTheme.colorScheme.onPrimary, fontWeight = FontWeight.Bold, fontSize = 11.sp)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Close", fontSize = 11.sp)
            }
        }
    )
}

/**
 * Modal Dialog for Healer Master Credential & Siddhi Certificate.
 */
@Composable
fun HealerCredentialModalDialog(
    credential: HealerCompletedCredential,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Verified, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(credential.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(credential.badge, fontSize = 11.sp, color = SpiritualGold)
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = SpiritualGold.copy(alpha = 0.1f),
                    border = BorderStroke(1.dp, SpiritualGold.copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text("📜 Certified Master Attunement", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = SpiritualGold)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Stage / Status: ${credential.level} (${credential.status})", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface)
                        Text("Date of Consecration: ${credential.certDate}", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("Lineage Authority: ${credential.masterSign}", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }

                Text("Authorized Mentorship Privileges:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                credential.privileges.forEachIndexed { i, priv ->
                    Text("${i + 1}. $priv", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface, lineHeight = 16.sp)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(containerColor = SpiritualGold),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Close Certificate", color = MaterialTheme.colorScheme.scrim, fontWeight = FontWeight.Bold)
            }
        }
    )
}

/**
 * Data model for Sadhana Progress Memo.
 */
data class SadhanaProgressMemo(
    val id: String,
    val timestamp: String,
    val text: String
)

/**
 * Data model for Devotee Remedies & Upayas Catalog.
 */
data class DevoteeCatalogItem(
    val id: String,
    val title: String,
    val tag: String,
    val category: String, // "Divine Remedy", "Cleansing & Healing", "Sacred Sadhana"
    val domain: String,   // "remedies", "cleansing", "sadhanas"
    val icon: ImageVector,
    val summary: String,
    val mantra: String,
    val timing: String,
    val aasanDirection: String,
    val ingredients: String,
    val steps: List<String>,
    val benefits: String
)

/**
 * Data model for Devotee Active In-Progress Sadhana.
 */
data class DevoteeActiveSadhana(
    val id: String,
    val title: String,
    val category: String,
    val domain: String,
    val level: String,
    val target: String,
    val streak: String,
    val progressPercent: Int,
    val status: String,
    val notes: String,
    val totalDays: Int = 21,
    val completedDays: Set<Int> = emptySet(),
    val memos: List<SadhanaProgressMemo> = emptyList()
)

/**
 * Data model for Healer Completed Credential & Siddhi Certificate.
 */
data class HealerCompletedCredential(
    val id: String,
    val title: String,
    val level: String,
    val status: String,
    val badge: String,
    val certDate: String,
    val masterSign: String,
    val privileges: List<String>
)

/**
 * Data model for Connected Seeker in Mentorship Network.
 */
data class ConnectedSeeker(
    val id: String,
    val name: String,
    val refCode: String,
    val level: String,
    val cleanPercent: String,
    val activeRemediesCount: Int,
    val status: String
)

fun getDevoteeCompletedCredentials(): List<HealerCompletedCredential> = listOf(
    HealerCompletedCredential(
        id = "cred-1",
        title = "Sri Yantra Siddhi Master",
        level = "Level 3 — Master Sadhak",
        status = "Certified & Attuned",
        badge = "🕉️ Geometry Siddhi",
        certDate = "15 Aug 2026",
        masterSign = "Master Karim • 16-Digit Consecrated",
        privileges = listOf("Initiate Novice Seekers into Sri Yantra Trataka", "Consecrate Copper & Silver Meru Sri Yantras", "Authorize Sadhana Stage Advancements")
    ),
    HealerCompletedCredential(
        id = "cred-2",
        title = "Three Diya Fire Cleansing Attunement",
        level = "Level 2 — Senior Healer",
        status = "Certified & Active",
        badge = "🪔 Agni Shield",
        certDate = "10 Jul 2026",
        masterSign = "Master Karim • Lineage Elder",
        privileges = listOf("Perform 21-Day Threshold Fire Attunement", "Authorize Seeker House Clean % Verifications", "Prescribe Custom Mustard Oil Havan Formulas")
    ),
    HealerCompletedCredential(
        id = "cred-3",
        title = "Kundalini & Nadi Shodhana Guide",
        level = "Level 2 — Pranic Healer",
        status = "Attuned & Guided",
        badge = "🌿 Pranic Awakening",
        certDate = "01 Jun 2026",
        masterSign = "Spiritual Karim Foundation",
        privileges = listOf("Guide Sushumna Breath Alignment", "Aura Strengthening & Chakra Healing", "Resolve Energetic Blockages")
    )
)

fun getConnectedSeekersList(): List<ConnectedSeeker> = listOf(
    ConnectedSeeker(
        id = "sk-01",
        name = "Vikram Sharma",
        refCode = "SKHM-DEV1-9012-3456",
        level = "Level 1 Seeker",
        cleanPercent = "85% Clean (Level 1 Certified)",
        activeRemediesCount = 2,
        status = "Active Trainee"
    ),
    ConnectedSeeker(
        id = "sk-02",
        name = "Ananya Patel",
        refCode = "SKHM-DEV2-7890-1234",
        level = "Level 2 Seeker",
        cleanPercent = "60% Clean (Parents House Review)",
        activeRemediesCount = 3,
        status = "Review Pending"
    ),
    ConnectedSeeker(
        id = "sk-03",
        name = "Rohit Verma",
        refCode = "SKHM-DEV3-5678-9012",
        level = "Level 1 Seeker",
        cleanPercent = "40% Clean (Level 1 in Progress)",
        activeRemediesCount = 1,
        status = "Active Trainee"
    )
)

/**
 * Catalog dictionary of all 16 remedies and sadhanas matching http://localhost:8080/SpritualKarim/SpritulKarimWeb/devotee.
 */
fun getDevoteeRemediesCatalog(): List<DevoteeCatalogItem> = listOf(
    DevoteeCatalogItem(
        id = "three_diya",
        title = "Three Diya Process",
        tag = "Remedy • 21-Day Fire Cleansing",
        category = "Divine Remedy",
        domain = "remedies",
        icon = Icons.Default.LocalFireDepartment,
        summary = "Signature 21-Day Fire Cleansing Remedy to burn stagnant domestic negativity and astral heaviness.",
        mantra = "ॐ नमः शिवाय ॥ (108 chants while lighting lamps)",
        timing = "Exact Dusk Sunset Window (Godhuli Bela)",
        aasanDirection = "Main Entrance Doorway / Threshold Facing Outwards",
        ingredients = "3 Clay/Earthen Diyas (Mitti ke Diye), Pure Mustard Oil, Cotton Wicks, Sea Salt Water.",
        steps = listOf(
            "Wash and mop main entryway with sea-salt water 15 minutes before sunset.",
            "Fill 3 fresh earthen lamps with mustard oil and insert cotton wicks.",
            "Place lamps in a triangular formation directly at the main entrance doorway threshold.",
            "Light each lamp chanting Om Namah Shivaya praying for negative energy to exit."
        ),
        benefits = "Disperses chronic family disputes, removes negative entity attachments, and brings peace."
    ),
    DevoteeCatalogItem(
        id = "court_cases",
        title = "Court Cases Remedy (Clove & Cardamom)",
        tag = "Remedy • Clove & Cardamom Havan",
        category = "Divine Remedy",
        domain = "remedies",
        icon = Icons.Default.Gavel,
        summary = "Fire ritual employing consecrated Clove and Cardamom to resolve unjust legal battles and disputes.",
        mantra = "ॐ ह्रीं बगलामुखि सर्वदुष्टानां वाचं मुखं पदं स्तम्भय जिह्वां कीलय बुद्धिं विनाशय ह्रीं ॐ स्वाहा ॥",
        timing = "Tuesday or Saturday Sunset",
        aasanDirection = "Yellow Aasan, East Facing",
        ingredients = "108 Intact Cloves, 108 Green Cardamoms, Pure Cow Ghee, Dry Coconut, Mustard Seeds.",
        steps = listOf(
            "Set up small copper havan kund with dry mango wood and camphor.",
            "Dip pairs of cloves and cardamoms in pure cow ghee.",
            "Offer 108 ahutis chanting Baglamukhi Beej Mantra into sacred fire."
        ),
        benefits = "Stops malicious conspiracies, calms opposing parties, and hastens legal settlements."
    ),
    DevoteeCatalogItem(
        id = "business_money",
        title = "Business & Wealth Upaya",
        tag = "Remedy • Silver Diya Lakshmi",
        category = "Divine Remedy",
        domain = "remedies",
        icon = Icons.Default.AccountBalance,
        summary = "Sacred Silver Lamp Prosperity Protocol to unblock stuck payments and revive business revenues.",
        mantra = "ॐ श्रीं ह्रीं क्लीं श्री सिद्ध लक्ष्म्यै नमः ॥",
        timing = "Friday Morning during Shukla Paksha",
        aasanDirection = "Yellow Silk Aasan, North Facing at Cash Counter",
        ingredients = "Pure Silver Diya, Cow Ghee, 2 Intact Cloves, Camphor, Yellow Cloth, Sri Yantra.",
        steps = listOf(
            "Thoroughly clean commercial shop/office altar or home cash locker.",
            "Place Silver Diya on brass plate, fill with cow ghee, and insert 2 clove heads.",
            "Light lamp and chant Siddha Lakshmi Mantra 108 times."
        ),
        benefits = "Dissolves financial stagnation, clears payment backlogs, and ensures steady growth."
    ),
    DevoteeCatalogItem(
        id = "maha_mrityunjaya_havan",
        title = "Maha Mrityunjaya Havan",
        tag = "Remedy • Health & Longevity Shield",
        category = "Divine Remedy",
        domain = "remedies",
        icon = Icons.Default.Healing,
        summary = "Supreme life-restoring Vedic fire ritual to neutralize severe health afflictions and accident dangers.",
        mantra = "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥",
        timing = "Early Morning or Monday Dusk",
        aasanDirection = "White Woolen Aasan, East Facing",
        ingredients = "Copper Havan Kund, Mango Wood, Pure Ghee, Durva Grass, Bel Patra, Black Sesame.",
        steps = listOf(
            "Cleanse altar space and ignite sacred fire with camphor and dry wood.",
            "Dip Durva grass and Bel Patra in pure cow ghee.",
            "Offer 108 ahutis chanting Maha Mrityunjaya Mantra."
        ),
        benefits = "Creates armor against physical crises, relieves chronic pains, and revives vital Prana."
    ),
    DevoteeCatalogItem(
        id = "trilok_nagri",
        title = "Trilok Nagri Access",
        tag = "Remedy • Higher Realm Link",
        category = "Divine Remedy",
        domain = "remedies",
        icon = Icons.Default.AutoAwesome,
        summary = "Higher dimensional meditation portal connecting seeker consciousness to astral masters.",
        mantra = "ॐ त्रिलोकपालकाय विद्महे दिव्यदृष्टये धीमहि तन्नो गुरुः प्रचोदयात् ॥",
        timing = "Midnight Sandhya or Pre-Dawn 03:30 AM",
        aasanDirection = "White Silk Aasan, North-East Facing",
        ingredients = "Crystal Sphatik Mala, White Sandalwood Paste, Himalayan Rock Crystal.",
        steps = listOf(
            "Sit in Padmasana with spine upright and apply white sandalwood at Ajna chakra.",
            "Chant Trilok Mantra 108 times visualizing a radiant golden beam descending."
        ),
        benefits = "Enhances intuitive perception, prophetic dreaming, and energetic connection."
    ),
    DevoteeCatalogItem(
        id = "vastu_dosh_nivaran",
        title = "Vastu Dosh Nivaran",
        tag = "Remedy • North-East Pranic Flow",
        category = "Divine Remedy",
        domain = "remedies",
        icon = Icons.Default.Explore,
        summary = "Directional harmonic rectification ritual to clear blocked North-East and South-West energy channels.",
        mantra = "ॐ वास्तुपुरुषाय नमः ॥ ॐ नमो भगवते वास्तुपुरुषाय स्वाहा ॥",
        timing = "Thursday or Sunday Sunrise",
        aasanDirection = "North-East Corner of Residence, Facing North",
        ingredients = "Copper Vastu Yantra, Camphor Crystals, Sea Salt, Turmeric Water, Gomati Chakra.",
        steps = listOf(
            "Purify afflicted direction with sea salt dissolved in turmeric Gangajal.",
            "Place Copper Vastu Yantra and chant Vastu Purusha Mantra 108 times."
        ),
        benefits = "Eliminates sudden discord, halts drain of savings, and restores harmonious prana."
    ),
    DevoteeCatalogItem(
        id = "santana_gopal",
        title = "Santana Gopal Havan",
        tag = "Remedy • Lineage & Progeny Peace",
        category = "Divine Remedy",
        domain = "remedies",
        icon = Icons.Default.ChildCare,
        summary = "Divine child blessing and ancestral lineage protection ritual dedicated to Lord Krishna.",
        mantra = "ॐ देवकीसुत गोविन्द वासुदेव जगत्पते देहि मे तनयं कृष्ण त्वामहं शरणं गतः ॥",
        timing = "Brahma Muhurta or Shukla Paksha Ekadashi",
        aasanDirection = "Yellow Silk Aasan, East Facing",
        ingredients = "Santana Gopal Yantra, Cow Milk Kheer, Tulsi Dal, White Butter, Ghee.",
        steps = listOf(
            "Perform Panchamrit abhishek accompanied by Vishnu Sahasranama recital.",
            "Offer 108 ahutis in sacred fire using gugal, ghee, and lotus seeds."
        ),
        benefits = "Removes genetic and energetic hurdles to childbirth and fosters joyous atmosphere."
    ),
    DevoteeCatalogItem(
        id = "karmic_debts",
        title = "Karmic Debts (Rin Mukti)",
        tag = "Remedy • Debt Alleviation Fire",
        category = "Divine Remedy",
        domain = "remedies",
        icon = Icons.AutoMirrored.Filled.ReceiptLong,
        summary = "Rin-Mukti ancestral debt alleviation protocol designed to dissolve relentless monetary loans.",
        mantra = "ॐ ॠणमुक्तेश्वराय महादेवाय नमः ॥",
        timing = "Tuesday Morning or Pradosh Sandhya",
        aasanDirection = "Red Woolen Aasan, South/East Facing",
        ingredients = "Copper Lota, Red Lentils, Copper Coins, Ghee Diya, Clove-infused Camphor.",
        steps = listOf(
            "Offer red lentils and water to roots of Banyan/Peepal tree.",
            "Offer 108 ahutis in evening havan chanting Rin Mukteshwar Shiva Mantra."
        ),
        benefits = "Accelerates settlement of chronic bank debts and stops unexplainable loss of earnings."
    ),
    DevoteeCatalogItem(
        id = "negativity",
        title = "Negativity Cleansing (Bakhoor)",
        tag = "Cleansing • Bakhoor & Loban",
        category = "Cleansing & Healing",
        domain = "cleansing",
        icon = Icons.Default.Air,
        summary = "Traditional aromatic smoke ritual utilizing Himalayan Bakhoor and Loban to detoxify household energetic fields.",
        mantra = "ॐ अपसर्पन्तु ते भूता ये भूता भूमि संस्थिताः। ये भूता विघ्नकर्तारस्ते नश्यन्तु शिवाज्ञया॥",
        timing = "Every Tuesday and Saturday at Twilight Dusk",
        aasanDirection = "Whole House Cleanse (Room by Room from East to West)",
        ingredients = "Himalayan Bakhoor, Raw Loban Resin, Guggul, Cow Dung Coal, Brass Dhuna.",
        steps = listOf(
            "Ignite natural charcoal or cow dung cake in brass fumigation burner.",
            "Sprinkle Bakhoor and Loban powder over burning embers.",
            "Carry dense smoke into every room, corner, behind doors, and beneath beds."
        ),
        benefits = "Instantly breaks heavy astral stagnation and eliminates recurring bad dreams."
    ),
    DevoteeCatalogItem(
        id = "nazar_suraksha",
        title = "Nazar Suraksha Shield",
        tag = "Cleansing • Evil Eye Mustard & Salt",
        category = "Cleansing & Healing",
        domain = "cleansing",
        icon = Icons.Default.Shield,
        summary = "Potent auric detoxification protocol using black mustard seeds, dry red chillies, and rock salt.",
        mantra = "ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥ ॐ हं हनुमते रुद्रात्मकाय हुं फट् ॥",
        timing = "Tuesday or Saturday Sunset",
        aasanDirection = "Center of Main Hall or Threshold, Facing East",
        ingredients = "Black Mustard Seeds, 7 Dry Red Chillies, Rock Salt Crystals, Burning Charcoal.",
        steps = listOf(
            "Hold mustard seeds, salt crystals, and 7 red chillies in right fist.",
            "Circulate clockwise 7 times around the head and drop onto hot burning charcoal."
        ),
        benefits = "Instantly lifts physical exhaustion and dissolves toxic envy."
    ),
    DevoteeCatalogItem(
        id = "kundalini",
        title = "Kundalini & Chakra Balancing",
        tag = "Cleansing • Prana Awakening",
        category = "Cleansing & Healing",
        domain = "cleansing",
        icon = Icons.Default.SelfImprovement,
        summary = "Chakra purification and vital energy elevation method guided by Mentor Karim.",
        mantra = "ॐ सोऽहं हंसः ॥ ॐ ऐं ह्रीं श्रीं मत्संसारतारिण्यै नमः ॥",
        timing = "Early Dawn (Brahma Muhurta 04:30 AM)",
        aasanDirection = "Kusha Grass Aasan, East Facing",
        ingredients = "Copper Water Vessel, Rudraksha Mala, Ghee Lamp.",
        steps = listOf(
            "Sit in Siddhasana with spine completely aligned.",
            "Perform 10 minutes of Nadi Shodhana Pranayama and visualize light along Sushumna."
        ),
        benefits = "Calms nervous system, sharpens clarity, and ignites spiritual ascension."
    ),
    DevoteeCatalogItem(
        id = "material_benefits",
        title = "Material & Karmic Benefits",
        tag = "Cleansing • Pitru Dosha Peace",
        category = "Cleansing & Healing",
        domain = "cleansing",
        icon = Icons.Default.Celebration,
        summary = "Karmic balancing protocol to remove deep ancestral stagnation in career and investments.",
        mantra = "ॐ पितृभ्यो नमः ॥ ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात् ॥",
        timing = "Amavasya or Pitru Paksha Dusk",
        aasanDirection = "South Facing, Dark Woolen Aasan",
        ingredients = "Black Sesame Seeds, White Flowers, Cow Milk, Kusha Grass, Silver Coin.",
        steps = listOf(
            "Perform Pitru Tarpan with black sesame seeds and pure cow milk.",
            "Light a mustard oil lamp facing South chanting Pitru Shanti Mantra 108 times."
        ),
        benefits = "Restores career promotions, clears blocked inheritances, and grants ancestral grace."
    ),
    DevoteeCatalogItem(
        id = "healing",
        title = "Spiritual Healing from Illness",
        tag = "Cleansing • Pranic Water Energize",
        category = "Cleansing & Healing",
        domain = "cleansing",
        icon = Icons.Default.Spa,
        summary = "Pranic water consecration and aura healing method to accelerate physical recovery.",
        mantra = "ॐ अच्युताय नमः ॐ अनन्ताय नमः ॐ गोविन्दाय नमः ॥",
        timing = "Morning post-bath during sunrise",
        aasanDirection = "East Facing Copper Altar",
        ingredients = "Pure Copper Jug filled with fresh water, Tulsi Leaves, Crystal Quartz.",
        steps = listOf(
            "Hold copper water vessel in both hands at chest height facing rising sun.",
            "Chant Dhanvantari and Achyuta-Ananta-Govinda Mantras 21 times into the water.",
            "Partake of energized water in 3 sips morning and evening."
        ),
        benefits = "Revitalizes weakened immune system and flushes out heavy psychosomatic fatigue."
    ),
    DevoteeCatalogItem(
        id = "aura_strengthening",
        title = "Aura Strengthening Shield",
        tag = "Cleansing • Sphatik & Herb Bath",
        category = "Cleansing & Healing",
        domain = "cleansing",
        icon = Icons.Default.Security,
        summary = "Crystalline energetic field fortification technique using consecrated Sphatik and rock salt bath.",
        mantra = "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
        timing = "Daily Morning immediately post-bath",
        aasanDirection = "White Silk Aasan, East Facing",
        ingredients = "Clear Quartz (Sphatik) Crystal, Rock Salt, Gangajal, Sandalwood Essential Oil.",
        steps = listOf(
            "Add pinch of consecrated rock salt to bath water.",
            "Sit on white silk aasan holding energized Sphatik and chant Gayatri Mantra 24 times."
        ),
        benefits = "Prevents psychic vulnerability and elevates charisma and spiritual presence."
    ),
    DevoteeCatalogItem(
        id = "sri_yantra",
        title = "Sri Yantra Sadhana",
        tag = "Sadhana • Maha Lakshmi Geometry",
        category = "Sacred Sadhana",
        domain = "sadhanas",
        icon = Icons.Default.Star,
        summary = "Supreme Tantric Sadhana for divine wealth, material elevation, third-eye awakening, and cosmic geometric alignment.",
        mantra = "ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ",
        timing = "Brahma Muhurta (04:00 AM – 06:00 AM) or Dusk Sandhya",
        aasanDirection = "Yellow / Red Silk Aasan, East Facing",
        ingredients = "Pure Copper or Silver Meru Sri Yantra, Cow Ghee Diya, Kamalgatta Mala, Saffron.",
        steps = listOf(
            "Perform Aachaman and place Sri Yantra upon copper plate over raw rice.",
            "Light Cow Ghee Diya and perform 5 minutes Trataka on central Bindu.",
            "Chant 11 Malas of Maha Lakshmi Beej Mantra with focused attention."
        ),
        benefits = "Eliminates acute financial blockages, unlocks business prosperity, and balances Ajna chakra."
    ),
    DevoteeCatalogItem(
        id = "kalashtami",
        title = "Kalashtami Bhairav Sadhana",
        tag = "Sadhana • Kaal Bhairav Protection",
        category = "Sacred Sadhana",
        domain = "sadhanas",
        icon = Icons.Default.ShieldMoon,
        summary = "Kaal Bhairav Sadhana for overcoming intense fear, astral attacks, evil eye, and court obstacles.",
        mantra = "ॐ भ्रं कालभैरवाय फट् ॥ ॐ ह्रीं बटुकाय आपदुद्धारणाय कुरु कुरु बटुकाय ह्रीं ॐ स्वाहा ॥",
        timing = "Night Sandhya (09:00 PM – Midnight) on Krishna Paksha Ashtami",
        aasanDirection = "Black Woolen Aasan, South or North Facing",
        ingredients = "Mustard Oil Diya, Black Sesame Seeds, Urad Dal, Kaal Bhairav Yantra, Rudraksha Mala.",
        steps = listOf(
            "Light large 4-wick Mustard Oil lamp in front of Kaal Bhairav.",
            "Offer black sesame seeds, jaggery, and red flowers.",
            "Chant 11 Malas of Bhairav Beej Mantra using Rudraksha Mala."
        ),
        benefits = "Impenetrable astral shield against disturbances, removal of hostility, and destruction of phobias."
    )
)
