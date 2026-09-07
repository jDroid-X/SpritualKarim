package com.jdroidx.spritualkarim.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.MenuBook
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jdroidx.spritualkarim.R
import com.jdroidx.spritualkarim.data.manager.LanguageManager
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.ui.theme.*
import com.jdroidx.spritualkarim.utils.IntentHelper

@Composable
fun SpiritualDrawerContent(
    currentRoute: String?,
    onNavigate: (String) -> Unit,
    onCloseDrawer: () -> Unit
) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    var isHealersExpanded by remember { mutableStateOf(false) }
    var isSadhanaExpanded by remember { mutableStateOf(false) }
    var isRemediesExpanded by remember { mutableStateOf(false) }
    var isIssuesExpanded by remember { mutableStateOf(false) }
    var isInfoExpanded by remember { mutableStateOf(false) }

    // Role Filter Mode (All, Master, Healer, Devotee)
    var selectedRoleFilter by remember { mutableStateOf<com.jdroidx.spritualkarim.data.model.ProfileType?>(null) }

    ModalDrawerSheet(
        drawerContainerColor = MaterialTheme.colorScheme.background,
        drawerContentColor = MaterialTheme.colorScheme.onBackground,
        modifier = Modifier
            .width(320.dp)
            .fillMaxHeight()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            // Header with Logo
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                SpiritualMaroon.copy(alpha = 0.8f),
                                MaterialTheme.colorScheme.background
                            )
                        )
                    )
                    .padding(20.dp)
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Image(
                            painter = painterResource(id = R.drawable.logo_spiritual_karim),
                            contentDescription = "Spiritual Karim Logo",
                            modifier = Modifier
                                .height(48.dp)
                                .padding(end = 12.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = LanguageManager.getString("app_title"),
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 22.sp
                        ),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = LanguageManager.getString("app_subtitle"),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Role Filter Header Bar (Master / Healer / Devotee)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Text(
                    text = "Filter Menu Sections:",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    val filterOptions = listOf(
                        null to "All",
                        com.jdroidx.spritualkarim.data.model.ProfileType.ADMIN to "👑 Master",
                        com.jdroidx.spritualkarim.data.model.ProfileType.HEALER to "🌿 Healer",
                        com.jdroidx.spritualkarim.data.model.ProfileType.DEVOTEE to "🌟 Devotee"
                    )

                    filterOptions.forEach { (type, label) ->
                        val isSelected = selectedRoleFilter == type
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedRoleFilter = type },
                            label = { Text(label, fontSize = 10.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MaterialTheme.colorScheme.primary,
                                selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.height(30.dp)
                        )
                    }
                }
            }

            HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))

            // Primary Pages
            DrawerSingleItem(
                title = LanguageManager.getString("home"),
                icon = Icons.Default.Home,
                selected = currentRoute == Screen.Home.route,
                onClick = {
                    onNavigate(Screen.Home.route)
                    onCloseDrawer()
                }
            )

            DrawerSingleItem(
                title = LanguageManager.getString("about"),
                icon = Icons.Default.Person,
                selected = currentRoute == Screen.About.route,
                onClick = {
                    onNavigate(Screen.About.route)
                    onCloseDrawer()
                }
            )

            DrawerSingleItem(
                title = LanguageManager.getString("free_solution"),
                icon = Icons.Default.CheckCircle,
                selected = currentRoute == Screen.Solution.route,
                badge = "FREE",
                onClick = {
                    onNavigate(Screen.Solution.route)
                    onCloseDrawer()
                }
            )

            // ==================== HEALERS & ORGANIZATION ====================
            // Shown for All, Master, and Healer filters (hidden when Devotee is filtered)
            if (selectedRoleFilter == null || selectedRoleFilter == com.jdroidx.spritualkarim.data.model.ProfileType.ADMIN || selectedRoleFilter == com.jdroidx.spritualkarim.data.model.ProfileType.HEALER) {
                DrawerExpandableHeader(
                    title = if (selectedRoleFilter == com.jdroidx.spritualkarim.data.model.ProfileType.ADMIN) "Master Organization & Healers" else LanguageManager.getString("healers"),
                    icon = Icons.Default.Groups,
                    isExpanded = isHealersExpanded,
                    onToggle = { isHealersExpanded = !isHealersExpanded }
                )
                AnimatedVisibility(visible = isHealersExpanded) {
                    Column(modifier = Modifier.padding(start = 16.dp)) {
                        DrawerSubItem(
                            title = LanguageManager.getString("healers_hub"),
                            selected = currentRoute == Screen.HealersHub.route || currentRoute == "healers",
                            onClick = { onNavigate(Screen.HealersHub.createRoute()); onCloseDrawer() }
                        )
                        DrawerSubItem(
                            title = LanguageManager.getString("hierarchy_tree"),
                            selected = currentRoute == Screen.HealersHierarchy.route,
                            onClick = { onNavigate(Screen.HealersHierarchy.route); onCloseDrawer() }
                        )
                        if (selectedRoleFilter != com.jdroidx.spritualkarim.data.model.ProfileType.HEALER) {
                            DrawerSubItem(
                                title = LanguageManager.getString("admin_healers"),
                                selected = currentRoute?.contains("filter=healers") == true || currentRoute?.contains("filter=admin") == true,
                                onClick = { onNavigate(Screen.HealersHub.createRoute("healers")); onCloseDrawer() }
                            )
                        }
                        DrawerSubItem(
                            title = LanguageManager.getString("trainees"),
                            selected = currentRoute?.contains("filter=trainees") == true,
                            onClick = { onNavigate(Screen.HealersHub.createRoute("trainees")); onCloseDrawer() }
                        )
                        DrawerSubItem(
                            title = LanguageManager.getString("devotees"),
                            selected = currentRoute?.contains("filter=devotees") == true,
                            onClick = { onNavigate(Screen.HealersHub.createRoute("devotees")); onCloseDrawer() }
                        )
                    }
                }
            }

            // ==================== SADHANA GROUP ====================
            DrawerExpandableHeader(
                title = LanguageManager.getString("sadhanas"),
                icon = Icons.Default.SelfImprovement,
                isExpanded = isSadhanaExpanded,
                onToggle = { isSadhanaExpanded = !isSadhanaExpanded }
            )
            AnimatedVisibility(visible = isSadhanaExpanded) {
                Column(modifier = Modifier.padding(start = 16.dp)) {
                    DrawerSubItem(
                        title = LanguageManager.getString("sri_yantra"),
                        selected = currentRoute == Screen.SriYantra.route,
                        onClick = { onNavigate(Screen.SriYantra.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("kalashtami"),
                        selected = currentRoute == Screen.Kalashtami.route,
                        onClick = { onNavigate(Screen.Kalashtami.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("navratri"),
                        selected = currentRoute == Screen.Navratri.route,
                        onClick = { onNavigate(Screen.Navratri.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("diwali"),
                        selected = currentRoute == Screen.Diwali.route,
                        onClick = { onNavigate(Screen.Diwali.route); onCloseDrawer() }
                    )
                }
            }

            // ==================== REMEDIES GROUP ====================
            DrawerExpandableHeader(
                title = LanguageManager.getString("remedies"),
                icon = Icons.Default.LocalFireDepartment,
                isExpanded = isRemediesExpanded,
                onToggle = { isRemediesExpanded = !isRemediesExpanded }
            )
            AnimatedVisibility(visible = isRemediesExpanded) {
                Column(modifier = Modifier.padding(start = 16.dp)) {
                    DrawerSubItem(
                        title = LanguageManager.getString("trilok_nagri"),
                        selected = currentRoute == Screen.TrilokNagri.route,
                        onClick = { onNavigate(Screen.TrilokNagri.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("three_diya"),
                        selected = currentRoute == Screen.ThreeDiya.route,
                        onClick = { onNavigate(Screen.ThreeDiya.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("court_cases"),
                        selected = currentRoute == Screen.CourtCases.route,
                        onClick = { onNavigate(Screen.CourtCases.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("business_money"),
                        selected = currentRoute == Screen.Business.route,
                        onClick = { onNavigate(Screen.Business.route); onCloseDrawer() }
                    )
                }
            }

            // ==================== SIDDH MANTRAS ====================
            DrawerSingleItem(
                title = LanguageManager.getString("mantras"),
                icon = Icons.AutoMirrored.Filled.MenuBook,
                selected = currentRoute == Screen.SiddhMantras.route,
                onClick = {
                    onNavigate(Screen.SiddhMantras.route)
                    onCloseDrawer()
                }
            )

            // ==================== SPIRITUAL ISSUES ====================
            DrawerExpandableHeader(
                title = LanguageManager.getString("issues"),
                icon = Icons.Default.Psychology,
                isExpanded = isIssuesExpanded,
                onToggle = { isIssuesExpanded = !isIssuesExpanded }
            )
            AnimatedVisibility(visible = isIssuesExpanded) {
                Column(modifier = Modifier.padding(start = 16.dp)) {
                    DrawerSubItem(
                        title = LanguageManager.getString("removing_negativity"),
                        selected = currentRoute == Screen.Negativity.route,
                        onClick = { onNavigate(Screen.Negativity.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("spiritual_progress"),
                        selected = currentRoute == Screen.Progress.route,
                        onClick = { onNavigate(Screen.Progress.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("material_benefits"),
                        selected = currentRoute == Screen.Benefits.route,
                        onClick = { onNavigate(Screen.Benefits.route); onCloseDrawer() }
                    )
                    DrawerSubItem(
                        title = LanguageManager.getString("healing_illness"),
                        selected = currentRoute == Screen.Healing.route,
                        onClick = { onNavigate(Screen.Healing.route); onCloseDrawer() }
                    )
                }
            }

            // ==================== INFORMATION GROUP ====================
            // Shown when not filtered to Devotee
            if (selectedRoleFilter == null || selectedRoleFilter != com.jdroidx.spritualkarim.data.model.ProfileType.DEVOTEE) {
                DrawerExpandableHeader(
                    title = LanguageManager.getString("information"),
                    icon = Icons.Default.Info,
                    isExpanded = isInfoExpanded,
                    onToggle = { isInfoExpanded = !isInfoExpanded }
                )
                AnimatedVisibility(visible = isInfoExpanded) {
                    Column(modifier = Modifier.padding(start = 16.dp)) {
                        DrawerSubItem(
                            title = LanguageManager.getString("courses"),
                            selected = currentRoute == Screen.Courses.route,
                            onClick = { onNavigate(Screen.Courses.route); onCloseDrawer() }
                        )
                        DrawerSubItem(
                            title = LanguageManager.getString("bakhoor"),
                            selected = currentRoute == Screen.Bakhoor.route,
                            onClick = { onNavigate(Screen.Bakhoor.route); onCloseDrawer() }
                        )
                    }
                }
            }

            DrawerSingleItem(
                title = LanguageManager.getString("faq"),
                icon = Icons.Default.QuestionAnswer,
                selected = currentRoute == Screen.Faq.route,
                onClick = {
                    onNavigate(Screen.Faq.route)
                    onCloseDrawer()
                }
            )

            DrawerSingleItem(
                title = LanguageManager.getString("settings"),
                icon = Icons.Default.Settings,
                selected = currentRoute == Screen.Settings.route,
                onClick = {
                    onNavigate(Screen.Settings.route)
                    onCloseDrawer()
                }
            )

            DrawerSingleItem(
                title = LanguageManager.getString("contact"),
                icon = Icons.Default.Phone,
                selected = currentRoute == Screen.Contact.route,
                onClick = {
                    onNavigate(Screen.Contact.route)
                    onCloseDrawer()
                }
            )

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
            Spacer(modifier = Modifier.height(8.dp))

            // Quick Connect Action Chips
            Text(
                text = "Connect & Community",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 6.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = { IntentHelper.dialPhoneNumber(context, SpiritualContentRepository.HELPLINE_PHONE) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.primary)
                ) {
                    Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Call", fontSize = 12.sp)
                }

                OutlinedButton(
                    onClick = { IntentHelper.openUrl(context, SpiritualContentRepository.TELEGRAM_CHANNEL) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.primary)
                ) {
                    Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Telegram", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun DrawerSingleItem(
    title: String,
    icon: ImageVector,
    selected: Boolean,
    onClick: () -> Unit,
    badge: String? = null
) {
    NavigationDrawerItem(
        label = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = title,
                    fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
                    fontSize = 14.sp
                )
                if (badge != null) {
                    Spacer(modifier = Modifier.weight(1f))
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = MaterialTheme.colorScheme.secondary
                    ) {
                        Text(
                            text = badge,
                            color = MaterialTheme.colorScheme.onSecondary,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }
        },
        icon = {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(20.dp)
            )
        },
        selected = selected,
        onClick = onClick,
        modifier = Modifier.padding(horizontal = 12.dp, vertical = 2.dp),
        colors = NavigationDrawerItemDefaults.colors(
            selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
            selectedTextColor = MaterialTheme.colorScheme.primary,
            unselectedContainerColor = androidx.compose.ui.graphics.Color.Transparent,
            unselectedTextColor = MaterialTheme.colorScheme.onSurface
        ),
        shape = RoundedCornerShape(10.dp)
    )
}

@Composable
private fun DrawerExpandableHeader(
    title: String,
    icon: ImageVector,
    isExpanded: Boolean,
    onToggle: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle() }
            .padding(horizontal = 20.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(14.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.primary,
                fontSize = 15.sp
            )
        }
        Icon(
            imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
            contentDescription = if (isExpanded) "Collapse" else "Expand",
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(20.dp)
        )
    }
}

@Composable
private fun DrawerSubItem(
    title: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(end = 12.dp, top = 2.dp, bottom = 2.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(
                if (selected) MaterialTheme.colorScheme.primaryContainer
                else androidx.compose.ui.graphics.Color.Transparent
            )
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(RoundedCornerShape(3.dp))
                .background(if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.bodyMedium.copy(
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
            ),
            color = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
            fontSize = 13.sp
        )
    }
}
