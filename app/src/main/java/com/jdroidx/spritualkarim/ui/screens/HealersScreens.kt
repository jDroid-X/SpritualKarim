package com.jdroidx.spritualkarim.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Chat
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
import com.jdroidx.spritualkarim.data.model.*
import com.jdroidx.spritualkarim.data.repository.AppSettingsRepository
import com.jdroidx.spritualkarim.data.repository.HealersRepository
import com.jdroidx.spritualkarim.data.repository.NotificationRepository
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.ui.components.EditLineageDialog
import com.jdroidx.spritualkarim.ui.components.HouseCleanSection
import com.jdroidx.spritualkarim.ui.components.Personal3GenLineageCard
import com.jdroidx.spritualkarim.ui.components.SectionHeader
import com.jdroidx.spritualkarim.ui.components.SpiritualGlassCard
import com.jdroidx.spritualkarim.ui.theme.*
import com.jdroidx.spritualkarim.utils.IntentHelper

/**
 * Main Healers Portal:
 * - Search by Name / 16-Digit Code / Level / City
 * - Multi-level metrics bar
 * - Profile Category Filter Tabs (All, Admin, Healers, Trainees, Devotees)
 * - Add Profile Action
 * - Profile List with Level Badges, 16-digit Reference Code, Remedy count, and Actions
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HealersHubScreen(
    navController: NavController,
    initialFilter: String? = null
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val profiles by HealersRepository.profiles.collectAsState()
    val metrics = HealersRepository.getSummaryMetrics()

    val mappedInitialType = when (initialFilter?.lowercase()) {
        "admin" -> ProfileType.ADMIN
        "healers", "healer" -> ProfileType.HEALER
        "trainees", "trainee" -> ProfileType.TRAINEE
        "devotees", "devotee" -> ProfileType.DEVOTEE
        else -> null
    }

    var searchQuery by remember { mutableStateOf("") }
    var selectedTabType by remember(initialFilter) { mutableStateOf<ProfileType?>(mappedInitialType) }

    // Dialog controllers
    var profileToEdit by remember { mutableStateOf<HealerProfile?>(null) }
    var showAddDialog by remember { mutableStateOf(false) }
    var profileToTransfer by remember { mutableStateOf<HealerProfile?>(null) }
    var profileToDelete by remember { mutableStateOf<HealerProfile?>(null) }

    val filteredList = profiles.filter { profile ->
        val matchesType = selectedTabType == null || profile.profileType == selectedTabType
        val matchesSearch = searchQuery.isBlank() ||
                profile.name.contains(searchQuery, ignoreCase = true) ||
                profile.referenceCode.contains(searchQuery, ignoreCase = true) ||
                profile.phone.contains(searchQuery) ||
                profile.city.contains(searchQuery, ignoreCase = true) ||
                profile.level.toString() == searchQuery.trim()
        matchesType && matchesSearch
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = DivineWhite,
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.PersonAdd, contentDescription = "Add Profile")
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Add Member", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // ==========================================
            // 1. TOP BANNER & HIERARCHY SHORTCUT
            // ==========================================
            item {
                SpiritualGlassCard(
                    borderBrush = Brush.linearGradient(listOf(SpiritualGold, SpiritualCrimson))
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Multilevel Organization Hub",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "5-Level Parallel & Sequential Lineage Engine",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        Button(
                            onClick = { navController.navigate(Screen.HealersHierarchy.route) },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = SpiritualMaroon)
                        ) {
                            Icon(Icons.Default.AccountTree, contentDescription = null, modifier = Modifier.size(16.dp), tint = SpiritualGold)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("5-Level Tree", fontSize = 11.sp, color = SpiritualGold, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
                    Spacer(modifier = Modifier.height(10.dp))

                    // Metrics Strip
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        MetricPill(label = "Total", count = "${metrics["total"] ?: 0}", color = MaterialTheme.colorScheme.primary)
                        MetricPill(label = "Admin", count = "${metrics["admin"] ?: 0}", color = Color(0xFF7A1C37))
                        MetricPill(label = "Healers", count = "${metrics["healers"] ?: 0}", color = SpiritualGold)
                        MetricPill(label = "Trainees", count = "${metrics["trainees"] ?: 0}", color = SpiritualTeal)
                        MetricPill(label = "Devotees", count = "${metrics["devotees"] ?: 0}", color = Color(0xFF0088CC))
                    }
                }
            }

            // ==========================================
            // 2. SEARCH BAR
            // ==========================================
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search by name, 16-digit code, phone, level...", fontSize = 13.sp) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear")
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )
            }

            // ==========================================
            // 3. CATEGORY FILTER TABS
            // ==========================================
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    item {
                        FilterChip(
                            selected = selectedTabType == null,
                            onClick = { selectedTabType = null },
                            label = { Text("All (${profiles.size})", fontSize = 12.sp) },
                            shape = RoundedCornerShape(8.dp)
                        )
                    }
                    ProfileType.entries.forEach { type ->
                        val count = profiles.count { it.profileType == type }
                        item {
                            FilterChip(
                                selected = selectedTabType == type,
                                onClick = { selectedTabType = type },
                                label = { Text("${type.displayName.split(" ").last()} ($count)", fontSize = 12.sp) },
                                shape = RoundedCornerShape(8.dp)
                            )
                        }
                    }
                }
            }

            // ==========================================
            // 4. PROFILES LIST
            // ==========================================
            if (filteredList.isEmpty()) {
                item {
                    SpiritualGlassCard {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 24.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.SearchOff,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(40.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "No profiles found matching criteria",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            } else {
                items(filteredList, key = { it.id }) { profile ->
                    ProfileCard(
                        profile = profile,
                        onViewDetails = {
                            navController.navigate(Screen.HealerDetail.createRoute(profile.id))
                        },
                        onEdit = { profileToEdit = profile },
                        onChat = {
                            navController.navigate(Screen.LineageChat.createRoute())
                        },
                        onTransfer = { profileToTransfer = profile },
                        onDelete = { profileToDelete = profile },
                        onCopyCode = {
                            clipboardManager.setText(AnnotatedString(profile.referenceCode))
                            Toast.makeText(context, "Copied: ${profile.referenceCode}", Toast.LENGTH_SHORT).show()
                        }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(70.dp))
            }
        }
    }

    // ==========================================
    // DIALOGS: ADD / EDIT / TRANSFER / DELETE
    // ==========================================
    if (showAddDialog) {
        AddEditProfileDialog(
            profile = null,
            allProfiles = profiles,
            onDismiss = { showAddDialog = false },
            onSave = { newProfile ->
                HealersRepository.addProfile(newProfile)
                showAddDialog = false
                NotificationRepository.showSuccess(
                    title = "Member Profile Created",
                    message = "${newProfile.name} (${newProfile.referenceCode}) added to ${newProfile.profileType.displayName}."
                )
            }
        )
    }

    if (profileToEdit != null) {
        AddEditProfileDialog(
            profile = profileToEdit,
            allProfiles = profiles,
            onDismiss = { profileToEdit = null },
            onSave = { updatedProfile ->
                HealersRepository.updateProfile(updatedProfile)
                profileToEdit = null
                NotificationRepository.showSuccess(
                    title = "Profile Updated",
                    message = "Changes saved for ${updatedProfile.name}."
                )
            }
        )
    }

    if (profileToTransfer != null) {
        TransferProfileDialog(
            profile = profileToTransfer!!,
            allProfiles = profiles,
            onDismiss = { profileToTransfer = null },
            onConfirm = { newUplineCode, transferCode ->
                HealersRepository.transferProfile(profileToTransfer!!.id, newUplineCode, transferCode)
                profileToTransfer = null
                NotificationRepository.showSuccess(
                    title = "Lineage Transfer Completed",
                    message = "Member transferred to sponsor upline '$newUplineCode'."
                )
            }
        )
    }

    if (profileToDelete != null) {
        AlertDialog(
            onDismissRequest = { profileToDelete = null },
            title = { Text("Delete Profile", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "Are you sure you want to delete '${profileToDelete!!.name}' (${profileToDelete!!.referenceCode})? Any direct downlines will be re-linked to their parent sponsor."
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        val deletedName = profileToDelete!!.name
                        HealersRepository.deleteProfile(profileToDelete!!.id)
                        profileToDelete = null
                        NotificationRepository.showWarning(
                            title = "Profile Deleted",
                            message = "$deletedName removed from organization registry."
                        )
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Delete", color = MaterialTheme.colorScheme.onError)
                }
            },
            dismissButton = {
                TextButton(onClick = { profileToDelete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}

/**
 * Metric Pill in Healers Hub Top Banner.
 */
@Composable
private fun MetricPill(label: String, count: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = count,
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = color
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            fontSize = 10.sp
        )
    }
}

/**
 * Profile Card Component.
 */
@Composable
private fun ProfileCard(
    profile: HealerProfile,
    onViewDetails: () -> Unit,
    onEdit: () -> Unit,
    onChat: () -> Unit,
    onTransfer: () -> Unit,
    onDelete: () -> Unit,
    onCopyCode: () -> Unit
) {
    val context = LocalContext.current
    var showMenu by remember { mutableStateOf(false) }

    SpiritualGlassCard(onClick = onViewDetails) {
        Row(
            verticalAlignment = Alignment.Top,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Level & Avatar Icon
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(profile.profileType.badgeColorHex)),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "L${profile.level}",
                        color = DivineWhite,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            // Main Info
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = profile.name,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.weight(1f, fill = false)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Color(profile.profileType.badgeColorHex).copy(alpha = 0.15f)
                    ) {
                        Text(
                            text = profile.profileType.displayName.split(" ").last(),
                            color = Color(profile.profileType.badgeColorHex),
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = "${profile.phone} • ${profile.city.ifBlank { "National" }}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(6.dp))

                // 16-Digit Reference Code Pill
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .clickable { onCopyCode() }
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.QrCode,
                        contentDescription = null,
                        modifier = Modifier.size(12.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = profile.referenceCode,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy",
                        modifier = Modifier.size(11.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Referred By & Remedies info
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Sponsor: ${profile.referredByCode.take(12)}...",
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    if (profile.selectedRemedies.isNotEmpty()) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)
                        ) {
                            Text(
                                text = "${profile.selectedRemedies.size} Remedies",
                                color = MaterialTheme.colorScheme.secondary,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp)
                            )
                        }
                    }
                }
            }

            // Options Overflow Menu
            Box {
                IconButton(onClick = { showMenu = true }, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.MoreVert, contentDescription = "Actions", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                DropdownMenu(
                    expanded = showMenu,
                    onDismissRequest = { showMenu = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("View Full Profile") },
                        leadingIcon = { Icon(Icons.Default.Visibility, contentDescription = null) },
                        onClick = { showMenu = false; onViewDetails() }
                    )
                    DropdownMenuItem(
                        text = { Text("Edit Metadata") },
                        leadingIcon = { Icon(Icons.Default.Edit, contentDescription = null) },
                        onClick = { showMenu = false; onEdit() }
                    )
                    DropdownMenuItem(
                        text = { Text("Chat in MsgBot") },
                        leadingIcon = { Icon(Icons.AutoMirrored.Filled.Chat, contentDescription = null, tint = SpiritualTeal) },
                        onClick = {
                            showMenu = false
                            onChat()
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Call Member") },
                        leadingIcon = { Icon(Icons.Default.Call, contentDescription = null, tint = MaterialTheme.colorScheme.primary) },
                        onClick = {
                            showMenu = false
                            IntentHelper.dialPhoneNumber(context, profile.phone)
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Share 16-Digit Code") },
                        leadingIcon = { Icon(Icons.Default.Share, contentDescription = null) },
                        onClick = {
                            showMenu = false
                            IntentHelper.shareText(
                                context,
                                "Spiritual Karim Member Profile:\nName: ${profile.name}\n16-Digit Code: ${profile.referenceCode}\nLevel: ${profile.level}\nSponsor: ${profile.referredByCode}"
                            )
                        }
                    )
                    HorizontalDivider()
                    DropdownMenuItem(
                        text = { Text("Transfer Downline") },
                        leadingIcon = { Icon(Icons.Default.SwapHoriz, contentDescription = null) },
                        onClick = { showMenu = false; onTransfer() }
                    )
                    DropdownMenuItem(
                        text = { Text("Delete Profile", color = MaterialTheme.colorScheme.error) },
                        leadingIcon = { Icon(Icons.Default.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.error) },
                        onClick = { showMenu = false; onDelete() }
                    )
                }
            }
        }
    }
}

/**
 * Visual Multilevel Hierarchy Tree Screen (Levels 1 to 5).
 * Allows expand/collapse, search, and level-by-level inspection.
 */
@Composable
fun HierarchyTreeScreen(navController: NavController) {
    val profiles by HealersRepository.profiles.collectAsState()
    var selectedLevelFilter by remember { mutableStateOf<Int?>(null) } // null = All levels

    // Identify root nodes: Level 1 or profiles whose sponsor is not present in profiles list
    val allRefCodes = profiles.map { it.referenceCode }.toSet()
    val rootProfiles = profiles.filter { it.level == 1 || !allRefCodes.contains(it.referredByCode) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Organization Hierarchy Tree",
                    subtitle = "Visual representation of 5-level parallel and sequential networks",
                    icon = Icons.Default.AccountTree
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Level Filter Chips
                Text(
                    text = "Filter by Level Generation:",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(6.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    item {
                        FilterChip(
                            selected = selectedLevelFilter == null,
                            onClick = { selectedLevelFilter = null },
                            label = { Text("All Levels (${profiles.size})", fontSize = 11.sp) }
                        )
                    }
                    (1..5).forEach { lvl ->
                        val count = profiles.count { it.level == lvl }
                        item {
                            FilterChip(
                                selected = selectedLevelFilter == lvl,
                                onClick = { selectedLevelFilter = lvl },
                                label = { Text("Level $lvl ($count)", fontSize = 11.sp) }
                            )
                        }
                    }
                }
            }
        }

        if (selectedLevelFilter != null) {
            val levelMembers = profiles.filter { it.level == selectedLevelFilter }
            item {
                Text(
                    text = "Members in Level $selectedLevelFilter (${levelMembers.size})",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
            }
            items(levelMembers, key = { it.id }) { member ->
                HierarchyNodeCard(
                    profile = member,
                    indentDp = 0.dp,
                    onNavigate = { navController.navigate(Screen.HealerDetail.createRoute(member.id)) }
                )
            }
        } else {
            // Full Recursive Tree starting from root profiles
            items(rootProfiles, key = { it.id }) { root ->
                HierarchyTreeNodeRecursive(
                    node = root,
                    allProfiles = profiles,
                    indentDp = 0.dp,
                    onNavigate = { id -> navController.navigate(Screen.HealerDetail.createRoute(id)) }
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

/**
 * Recursive Tree Node renderer.
 */
@Composable
private fun HierarchyTreeNodeRecursive(
    node: HealerProfile,
    allProfiles: List<HealerProfile>,
    indentDp: androidx.compose.ui.unit.Dp,
    onNavigate: (String) -> Unit
) {
    var isExpanded by remember { mutableStateOf(true) }
    val children = allProfiles.filter { it.referredByCode == node.referenceCode }

    Column(modifier = Modifier.fillMaxWidth()) {
        HierarchyNodeCard(
            profile = node,
            indentDp = indentDp,
            hasChildren = children.isNotEmpty(),
            isExpanded = isExpanded,
            onToggleExpand = { isExpanded = !isExpanded },
            onNavigate = { onNavigate(node.id) }
        )

        AnimatedVisibility(visible = isExpanded && children.isNotEmpty()) {
            Column(modifier = Modifier.fillMaxWidth()) {
                children.forEach { child ->
                    HierarchyTreeNodeRecursive(
                        node = child,
                        allProfiles = allProfiles,
                        indentDp = indentDp + 16.dp,
                        onNavigate = onNavigate
                    )
                }
            }
        }
    }
}

@Composable
private fun HierarchyNodeCard(
    profile: HealerProfile,
    indentDp: androidx.compose.ui.unit.Dp,
    hasChildren: Boolean = false,
    isExpanded: Boolean = false,
    onToggleExpand: (() -> Unit)? = null,
    onNavigate: () -> Unit
) {
    val context = LocalContext.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = indentDp, top = 3.dp, bottom = 3.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(MaterialTheme.colorScheme.surface)
            .border(
                BorderStroke(1.dp, Color(profile.profileType.badgeColorHex).copy(alpha = 0.4f)),
                RoundedCornerShape(10.dp)
            )
            .clickable { onNavigate() }
            .padding(10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (hasChildren && onToggleExpand != null) {
            IconButton(onClick = onToggleExpand, modifier = Modifier.size(24.dp)) {
                Icon(
                    imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(18.dp)
                )
            }
        } else {
            Spacer(modifier = Modifier.width(6.dp))
        }

        Box(
            modifier = Modifier
                .size(28.dp)
                .clip(CircleShape)
                .background(Color(profile.profileType.badgeColorHex)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "L${profile.level}",
                color = DivineWhite,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.width(10.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = profile.name,
                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "${profile.profileType.displayName} • ${profile.referenceCode}",
                style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(
                onClick = {
                    IntentHelper.shareText(
                        context,
                        "Spiritual Karim Lineage Node:\nName: ${profile.name}\n16-Digit Code: ${profile.referenceCode}\nLevel: ${profile.level}\nRole: ${profile.profileType.displayName}\nSponsor: ${profile.referredByCode}"
                    )
                },
                modifier = Modifier.size(28.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Share,
                    contentDescription = "Share",
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(16.dp)
                )
            }

            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

/**
 * Profile Details Screen.
 */
@Composable
fun HealerDetailScreen(
    profileId: String,
    navController: NavController
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val profiles by HealersRepository.profiles.collectAsState()

    val profile = profiles.firstOrNull { it.id == profileId }

    if (profile == null) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Profile not found or was removed", style = MaterialTheme.typography.titleMedium)
                Spacer(modifier = Modifier.height(12.dp))
                Button(onClick = { navController.popBackStack() }) {
                    Text("Return to Hub")
                }
            }
        }
        return
    }

    val directDownline = HealersRepository.getDirectChildren(profile.referenceCode)
    val allDescendants = HealersRepository.getAllDescendants(profile.referenceCode)
    val sponsor = HealersRepository.getProfileByReferenceCode(profile.referredByCode)

    var showEditDialog by remember { mutableStateOf(false) }
    var showTransferDialog by remember { mutableStateOf(false) }
    var showDeleteConfirm by remember { mutableStateOf(false) }
    var showEditLineageDialog by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // ==========================================
        // 1. PROFILE HEADER CARD
        // ==========================================
        item {
            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(listOf(Color(profile.profileType.badgeColorHex), SpiritualGold))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(Color(profile.profileType.badgeColorHex)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "L${profile.level}",
                            color = DivineWhite,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = profile.name,
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = profile.formattedRoleBadge,
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color(profile.profileType.badgeColorHex),
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
                Spacer(modifier = Modifier.height(10.dp))

                // 16-Digit Code Copy Box
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = "16-DIGIT REFERENCE CODE",
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp, fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = profile.referenceCode,
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    IconButton(
                        onClick = {
                            clipboardManager.setText(AnnotatedString(profile.referenceCode))
                            Toast.makeText(context, "Code Copied: ${profile.referenceCode}", Toast.LENGTH_SHORT).show()
                        }
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = "Copy", tint = MaterialTheme.colorScheme.primary)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Quick Action Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = { navController.navigate(Screen.LineageChat.createRoute()) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(vertical = 8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = SpiritualTeal)
                    ) {
                        Icon(Icons.AutoMirrored.Filled.Chat, contentDescription = null, modifier = Modifier.size(14.dp), tint = DivineWhite)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("MsgBot Chat", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = DivineWhite)
                    }

                    OutlinedButton(
                        onClick = { IntentHelper.dialPhoneNumber(context, profile.phone) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(vertical = 8.dp)
                    ) {
                        Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Call", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }

                    OutlinedButton(
                        onClick = {
                            IntentHelper.shareText(
                                context,
                                "Spiritual Karim Member Profile:\nName: ${profile.name}\n16-Digit Code: ${profile.referenceCode}\nLevel: ${profile.level}\nSponsor: ${profile.referredByCode}"
                            )
                        },
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 8.dp)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = "Share", modifier = Modifier.size(14.dp))
                    }
                }

                if (!profile.transferredCode.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Transfer History Code: ${profile.transferredCode}",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
                        color = SpiritualCrimson
                    )
                }
            }
        }

        // ==========================================
        // 2. 3-GENERATION ANCESTRAL LINEAGE & SIBLINGS CARD
        // ==========================================
        item {
            Personal3GenLineageCard(
                lineage = profile.lineage,
                onEditClick = { showEditLineageDialog = true }
            )
        }

        // ==========================================
        // 3. SEEKERS 3-LEVEL HOUSE CLEAN & VERIFICATION
        // ==========================================
        item {
            HouseCleanSection(
                seekerId = profile.id,
                seekerName = profile.name,
                currentViewerProfileType = ProfileType.ADMIN,
                viewerReferenceCode = profile.referredByCode.ifBlank { "SKHM-ADM1-7788-9900" },
                viewerName = sponsor?.name ?: "Lineage Mentor"
            )
        }

        // ==========================================
        // 4. CONTACT & IDENTIFICATION METADATA
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(title = "Identification & Tracking Details", icon = Icons.Default.Badge)
                Spacer(modifier = Modifier.height(8.dp))

                DetailItemRow(
                    label = "Phone Number",
                    value = profile.phone,
                    onAction = { IntentHelper.dialPhoneNumber(context, profile.phone) },
                    actionIcon = Icons.Default.Call
                )
                DetailItemRow(label = "Email Address", value = profile.email.ifBlank { "Not provided" })
                DetailItemRow(label = "City / Region", value = profile.city.ifBlank { "Varanasi / National" })
                DetailItemRow(label = "Full Address", value = profile.address.ifBlank { "Spiritual Kendra Network" })
                DetailItemRow(label = "Registration Date", value = profile.joinDate.ifBlank { "2023-01-01" })

                // Clickable Sponsor Item
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .then(if (sponsor != null) Modifier.clickable { navController.navigate(Screen.HealerDetail.createRoute(sponsor.id)) } else Modifier),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = "Lineage Sponsor", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(
                            text = sponsor?.let { "${it.name} (${it.referenceCode})" } ?: profile.referredByCode,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                color = if (sponsor != null) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
                                fontWeight = if (sponsor != null) FontWeight.Bold else FontWeight.Normal
                            )
                        )
                    }
                    if (sponsor != null) {
                        Icon(Icons.Default.ChevronRight, contentDescription = "View Sponsor", tint = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }

        // ==========================================
        // 3. SPIRITUAL OBJECTIVE & REMEDIES TICK MATRIX
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(title = "Spiritual Objective & Sadhana Matrix", icon = Icons.Default.Checklist)
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Declared Spiritual Goal / Purpose:",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = profile.objective.ifBlank { "Devotional advancement and guidance for seekers." },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 20.sp
                )

                Spacer(modifier = Modifier.height(12.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Assigned Remedies & Sadhanas (${profile.selectedRemedies.size}):",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(6.dp))

                if (profile.selectedRemedies.isEmpty()) {
                    Text("No remedies currently assigned.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                } else {
                    RemedyCatalog.ALL_OPTIONS.filter { profile.selectedRemedies.contains(it.id) }.forEach { remedy ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(vertical = 3.dp)
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SpiritualTeal, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "${remedy.title} (${remedy.category})",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }
            }
        }

        // ==========================================
        // 4. DOWNLINE METRICS & TEAM LIST
        // ==========================================
        item {
            SpiritualGlassCard {
                SectionHeader(
                    title = "Downline Lineage (${directDownline.size} Direct • ${allDescendants.size} Total)",
                    icon = Icons.Default.Groups
                )
                Spacer(modifier = Modifier.height(8.dp))

                if (directDownline.isEmpty()) {
                    Text("No direct downline members yet.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                } else {
                    directDownline.forEach { child ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                                .clickable { navController.navigate(Screen.HealerDetail.createRoute(child.id)) }
                                .padding(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(CircleShape)
                                    .background(Color(child.profileType.badgeColorHex)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("L${child.level}", fontSize = 10.sp, color = DivineWhite, fontWeight = FontWeight.Bold)
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(child.name, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                                Text(child.referenceCode, style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace))
                            }
                            Icon(Icons.Default.ChevronRight, contentDescription = null, modifier = Modifier.size(16.dp))
                        }
                    }
                }
            }
        }

        // ==========================================
        // 5. ACTION BUTTONS
        // ==========================================
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { showEditDialog = true },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Edit Profile", fontSize = 12.sp)
                }

                OutlinedButton(
                    onClick = { showTransferDialog = true },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.SwapHoriz, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Transfer", fontSize = 12.sp)
                }

                IconButton(
                    onClick = { showDeleteConfirm = true },
                    colors = IconButtonDefaults.filledIconButtonColors(containerColor = MaterialTheme.colorScheme.errorContainer)
                ) {
                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }

    if (showEditLineageDialog) {
        EditLineageDialog(
            initialLineage = profile.lineage,
            onDismiss = { showEditLineageDialog = false },
            onSave = { updatedLineage ->
                HealersRepository.updateProfileLineage(profile.id, updatedLineage)
                showEditLineageDialog = false
                Toast.makeText(context, "Lineage Details Updated Successfully", Toast.LENGTH_SHORT).show()
            }
        )
    }

    if (showEditDialog) {
        AddEditProfileDialog(
            profile = profile,
            allProfiles = profiles,
            onDismiss = { showEditDialog = false },
            onSave = { updated ->
                HealersRepository.updateProfile(updated)
                showEditDialog = false
                Toast.makeText(context, "Profile Updated Successfully", Toast.LENGTH_SHORT).show()
            }
        )
    }

    if (showTransferDialog) {
        TransferProfileDialog(
            profile = profile,
            allProfiles = profiles,
            onDismiss = { showTransferDialog = false },
            onConfirm = { newUplineCode, transferCode ->
                HealersRepository.transferProfile(profile.id, newUplineCode, transferCode)
                showTransferDialog = false
                Toast.makeText(context, "Lineage Transfer Completed", Toast.LENGTH_SHORT).show()
            }
        )
    }

    if (showDeleteConfirm) {
        AlertDialog(
            onDismissRequest = { showDeleteConfirm = false },
            title = { Text("Delete Member Profile", fontWeight = FontWeight.Bold) },
            text = {
                Text("Are you sure you want to delete '${profile.name}'? Direct downlines will be re-linked to ${profile.referredByCode}.")
            },
            confirmButton = {
                Button(
                    onClick = {
                        HealersRepository.deleteProfile(profile.id)
                        showDeleteConfirm = false
                        navController.popBackStack()
                        Toast.makeText(context, "Profile Deleted", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteConfirm = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
private fun DetailItemRow(
    label: String,
    value: String,
    onAction: (() -> Unit)? = null,
    actionIcon: androidx.compose.ui.graphics.vector.ImageVector? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(text = label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(text = value, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurface)
        }
        if (onAction != null && actionIcon != null) {
            IconButton(onClick = onAction, modifier = Modifier.size(32.dp)) {
                Icon(imageVector = actionIcon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            }
        }
    }
}

/**
 * Add / Edit Profile Dialog with 16-Digit Code generation, Sponsor selector, and Remedy checkboxes.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditProfileDialog(
    profile: HealerProfile?,
    allProfiles: List<HealerProfile>,
    onDismiss: () -> Unit,
    onSave: (HealerProfile) -> Unit
) {
    val isEdit = profile != null
    var name by remember { mutableStateOf(profile?.name ?: "") }
    var phone by remember { mutableStateOf(profile?.phone ?: "") }
    var email by remember { mutableStateOf(profile?.email ?: "") }
    var address by remember { mutableStateOf(profile?.address ?: "") }
    var city by remember { mutableStateOf(profile?.city ?: "") }
    var objective by remember { mutableStateOf(profile?.objective ?: "") }
    var profileType by remember { mutableStateOf(profile?.profileType ?: ProfileType.DEVOTEE) }
    var level by remember { mutableStateOf(profile?.level ?: 5) }
    var referenceCode by remember { mutableStateOf(profile?.referenceCode ?: HealersRepository.generate16DigitReferenceCode()) }
    var referredByCode by remember { mutableStateOf(profile?.referredByCode ?: AppSettingsRepository.getVariableValue("DEFAULT_SPONSOR_CODE", "SKHM-ADM1-7788-9900")) }
    var selectedRemedies by remember { mutableStateOf(profile?.selectedRemedies?.toSet() ?: emptySet()) }
    var lineage by remember { mutableStateOf(profile?.lineage ?: ThreeGenLineage(currentFamily = CurrentFamilyDetails(selfName = profile?.name ?: ""))) }
    var categoryTag by remember { mutableStateOf(profile?.categoryTag ?: if (profile?.profileType == ProfileType.DEVOTEE) "House Clean" else "") }

    var showSponsorPicker by remember { mutableStateOf(false) }
    var showEditLineageModal by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = if (isEdit) "Edit Profile Metadata" else "Add New Member Profile",
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(440.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Name & Phone
                item {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Full Name *") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("Phone / Contact Number *") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Email Address") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = city,
                        onValueChange = { city = it },
                        label = { Text("City / Region") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                // Profile Type Selector (Master only if already Admin)
                item {
                    val availableTypes = if (profile?.profileType == ProfileType.ADMIN) ProfileType.entries else listOf(ProfileType.DEVOTEE, ProfileType.TRAINEE, ProfileType.HEALER)
                    Text("Profile Tier / Role:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        availableTypes.forEach { type ->
                            FilterChip(
                                selected = profileType == type,
                                onClick = {
                                    profileType = type
                                    when (type) {
                                        ProfileType.DEVOTEE -> {
                                            categoryTag = "House Clean"
                                            level = if (level in 1..3) level else 1
                                        }
                                        ProfileType.TRAINEE -> {
                                            categoryTag = if (categoryTag.isBlank() || categoryTag == "House Clean") "Sadhanas & Remedies" else categoryTag
                                            level = if (level in 3..4) level else 4
                                        }
                                        ProfileType.HEALER -> {
                                            categoryTag = if (categoryTag.isBlank() || categoryTag == "House Clean") "Three Diya & Cleansing" else categoryTag
                                            level = if (level in 1..2) level else 2
                                        }
                                        ProfileType.ADMIN -> {
                                            categoryTag = "Master Founder"
                                            level = 1
                                        }
                                    }
                                },
                                label = { Text(if (type == ProfileType.DEVOTEE) "Seeker" else type.displayName.split(" ").last(), fontSize = 10.sp) }
                            )
                        }
                    }
                }

                // Tier-Specific Category & Level Controls
                item {
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                    ) {
                        Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            when (profileType) {
                                ProfileType.DEVOTEE -> {
                                    Text(
                                        text = "Seeker • House Clean Levels (Tick Highest Achieved):",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    listOf(
                                        1 to "Level 1 — Self House Clean",
                                        2 to "Level 2 — Parents House Clean",
                                        3 to "Level 3 — Relative House Clean"
                                    ).forEach { (lvl, title) ->
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clickable { level = lvl }
                                                .padding(vertical = 2.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Checkbox(
                                                checked = level >= lvl,
                                                onCheckedChange = { isChecked ->
                                                    level = if (isChecked) lvl else (lvl - 1).coerceAtLeast(1)
                                                }
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text(title, fontSize = 12.sp, fontWeight = if (level == lvl) FontWeight.Bold else FontWeight.Normal)
                                        }
                                    }
                                    categoryTag = "House Clean"
                                }

                                ProfileType.TRAINEE -> {
                                    Text(
                                        text = "Trainee Category & Level:",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    Text("Category:", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                        listOf("Sadhanas & Remedies", "Mantra Transmission", "Mentorship Guidance").forEach { cat ->
                                            FilterChip(
                                                selected = categoryTag == cat,
                                                onClick = { categoryTag = cat },
                                                label = { Text(cat.split(" ").first(), fontSize = 10.sp) }
                                            )
                                        }
                                    }
                                    Text("Trainee Hierarchy Level:", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        listOf(3 to "Level 3 (Senior)", 4 to "Level 4 (Junior)").forEach { (lvl, label) ->
                                            FilterChip(
                                                selected = level == lvl,
                                                onClick = { level = lvl },
                                                label = { Text(label, fontSize = 10.sp, fontWeight = FontWeight.Bold) }
                                            )
                                        }
                                    }
                                }

                                ProfileType.HEALER -> {
                                    Text(
                                        text = "Healer Category & Level:",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    Text("Healing Specialty Category:", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                        listOf("Three Diya & Cleansing", "Sri Yantra & Kundalini", "Holistic Illness Healing").forEach { cat ->
                                            FilterChip(
                                                selected = categoryTag == cat,
                                                onClick = { categoryTag = cat },
                                                label = { Text(cat.split(" ").first(), fontSize = 10.sp) }
                                            )
                                        }
                                    }
                                    Text("Healer Hierarchy Level:", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        listOf(1 to "Level 1 (Senior)", 2 to "Level 2 (Lead)").forEach { (lvl, label) ->
                                            FilterChip(
                                                selected = level == lvl,
                                                onClick = { level = lvl },
                                                label = { Text(label, fontSize = 10.sp, fontWeight = FontWeight.Bold) }
                                            )
                                        }
                                    }
                                }

                                ProfileType.ADMIN -> {
                                    Text(
                                        text = "Master Guide • Founder • Level 1 (Master Organization Root)",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = SpiritualGoldDark
                                    )
                                    categoryTag = "Master Founder"
                                    level = 1
                                }
                            }
                        }
                    }
                }

                // 16-Digit Reference Code
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = referenceCode,
                            onValueChange = { referenceCode = it.trim().uppercase() },
                            label = { Text("16-Digit Reference Code") },
                            modifier = Modifier.weight(1f),
                            singleLine = true
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        IconButton(
                            onClick = { referenceCode = HealersRepository.generate16DigitReferenceCode() }
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = "Regenerate")
                        }
                    }
                }

                // Referred By Code (Sponsor Picker)
                item {
                    Column {
                        OutlinedTextField(
                            value = referredByCode,
                            onValueChange = { referredByCode = it.trim().uppercase() },
                            label = { Text("Referred By Code (Sponsor)") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            trailingIcon = {
                                IconButton(onClick = { showSponsorPicker = !showSponsorPicker }) {
                                    Icon(Icons.Default.ArrowDropDown, contentDescription = "Select Sponsor")
                                }
                            }
                        )

                        // Quick Sponsor Dropdown
                        if (showSponsorPicker) {
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .heightIn(max = 140.dp)
                                    .padding(top = 4.dp),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                LazyColumn {
                                    items(allProfiles) { p ->
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clickable {
                                                    referredByCode = p.referenceCode
                                                    level = (p.level + 1).coerceAtMost(5)
                                                    showSponsorPicker = false
                                                }
                                                .padding(horizontal = 10.dp, vertical = 6.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = "${p.name} (${p.referenceCode})",
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Medium
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Spiritual Objective
                item {
                    OutlinedTextField(
                        value = objective,
                        onValueChange = { objective = it },
                        label = { Text("Spiritual Objective / Goal") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 3
                    )
                }

                // 3-Generation Ancestral Lineage Entry Quick Launch
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.35f)),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.4f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "3-Gen Lineage & Siblings",
                                    style = MaterialTheme.typography.titleSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    text = "${lineage.currentFamily.children.size} Children • ${lineage.currentFamily.siblings.size} Siblings • 3 Generations",
                                    style = MaterialTheme.typography.bodySmall,
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            FilledTonalButton(
                                onClick = { showEditLineageModal = true },
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                modifier = Modifier.height(32.dp)
                            ) {
                                Icon(Icons.Default.AccountTree, contentDescription = null, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Edit Lineage", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                // Remedies & Sadhanas Checkbox Matrix
                item {
                    Text(
                        text = "Assigned Remedies & Sadhanas (Tick all that apply):",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }

                items(RemedyCatalog.ALL_OPTIONS) { remedy ->
                    val isChecked = selectedRemedies.contains(remedy.id)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                selectedRemedies = if (isChecked) {
                                    selectedRemedies - remedy.id
                                } else {
                                    selectedRemedies + remedy.id
                                }
                            }
                            .padding(vertical = 3.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = isChecked,
                            onCheckedChange = { checked ->
                                selectedRemedies = if (checked) {
                                    selectedRemedies + remedy.id
                                } else {
                                    selectedRemedies - remedy.id
                                }
                            }
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(remedy.title, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                            Text(remedy.category, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        val result = HealerProfile(
                            id = profile?.id ?: "",
                            referenceCode = referenceCode.ifBlank { HealersRepository.generate16DigitReferenceCode() },
                            referredByCode = referredByCode.ifBlank { AppSettingsRepository.getVariableValue("DEFAULT_SPONSOR_CODE", "SKHM-ADM1-7788-9900") },
                            transferredCode = profile?.transferredCode,
                            name = name,
                            phone = phone,
                            email = email,
                            profileType = profileType,
                            level = level,
                            objective = objective,
                            selectedRemedies = selectedRemedies.toList(),
                            address = address,
                            city = city,
                            joinDate = profile?.joinDate ?: HealersRepository.getCurrentDateString(),
                            isActive = true,
                            lineage = lineage,
                            categoryTag = categoryTag
                        )
                        onSave(result)
                    }
                }
            ) {
                Text(if (isEdit) "Save Changes" else "Create Profile")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )

    if (showEditLineageModal) {
        EditLineageDialog(
            initialLineage = lineage,
            onDismiss = { showEditLineageModal = false },
            onSave = { updated ->
                lineage = updated
                showEditLineageModal = false
            }
        )
    }
}

/**
 * Transfer Profile Dialog to re-link to a new sponsor.
 */
@Composable
fun TransferProfileDialog(
    profile: HealerProfile,
    allProfiles: List<HealerProfile>,
    onDismiss: () -> Unit,
    onConfirm: (newUplineCode: String, transferCode: String) -> Unit
) {
    var newSponsorCode by remember { mutableStateOf("") }
    var transferCode by remember { mutableStateOf(HealersRepository.generate16DigitReferenceCode()) }
    var showSponsorPicker by remember { mutableStateOf(false) }

    val eligibleSponsors = allProfiles.filter { it.id != profile.id && it.referenceCode != profile.referenceCode }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Transfer Downline Lineage", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = "Transferring member: ${profile.name} (${profile.referenceCode})",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary
                )
                OutlinedTextField(
                    value = newSponsorCode,
                    onValueChange = { newSponsorCode = it.trim().uppercase() },
                    label = { Text("New Sponsor 16-Digit Code *") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    trailingIcon = {
                        IconButton(onClick = { showSponsorPicker = !showSponsorPicker }) {
                            Icon(Icons.Default.ArrowDropDown, contentDescription = "Select Sponsor")
                        }
                    }
                )

                if (showSponsorPicker) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 140.dp),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        LazyColumn {
                            items(eligibleSponsors) { p ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            newSponsorCode = p.referenceCode
                                            showSponsorPicker = false
                                        }
                                        .padding(horizontal = 10.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "${p.name} (${p.referenceCode})",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }
                        }
                    }
                }

                OutlinedTextField(
                    value = transferCode,
                    onValueChange = { transferCode = it.trim().uppercase() },
                    label = { Text("Transfer Audit Code") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (newSponsorCode.isNotBlank()) {
                        onConfirm(newSponsorCode, transferCode)
                    }
                }
            ) {
                Text("Confirm Transfer")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
