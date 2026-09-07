package com.jdroidx.spritualkarim.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.MenuBook
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.R
import com.jdroidx.spritualkarim.data.manager.LanguageManager
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.ui.components.NavigationTileCard
import com.jdroidx.spritualkarim.ui.components.SpiritualGlassCard
import com.jdroidx.spritualkarim.ui.theme.*
import com.jdroidx.spritualkarim.utils.IntentHelper

import com.jdroidx.spritualkarim.ui.components.SpiritualSlideNotificationHost

/**
 * 2-Tab Home Screen:
 * Tab 1: User (Personalized Hub: Today's Notice, Todo Checklist, Chatbot, MsgBot, Profile Switcher)
 * Tab 2: Spiritual (Classic Spiritual Karim Homepage with Sadhanas, Remedies, Mantras & Media)
 */
@Composable
fun HomeScreen(navController: NavController) {
    var selectedTabIndex by remember { mutableIntStateOf(0) }
    val tabTitles = listOf(
        LanguageManager.getString("tab_user"),
        LanguageManager.getString("tab_spiritual"),
    )

    SpiritualSlideNotificationHost {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Top 2-Tab Navigation Bar
            TabRow(
                selectedTabIndex = selectedTabIndex,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = MaterialTheme.colorScheme.primary,
                indicator = { tabPositions ->
                    TabRowDefaults.SecondaryIndicator(
                        modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTabIndex]),
                        color = MaterialTheme.colorScheme.primary,
                        height = 3.dp
                    )
                },
                divider = {
                    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                }
            ) {
                tabTitles.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTabIndex == index,
                        onClick = { selectedTabIndex = index },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = if (index == 0) Icons.Default.AccountCircle else Icons.Default.SelfImprovement,
                                    contentDescription = null,
                                    modifier = Modifier.size(18.dp),
                                    tint = if (selectedTabIndex == index) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = title,
                                    fontWeight = if (selectedTabIndex == index) FontWeight.Bold else FontWeight.Medium,
                                    fontSize = 14.sp
                                )
                            }
                        }
                    )
                }
            }

            // Tab Content Switcher
            Box(modifier = Modifier.fillMaxSize()) {
                when (selectedTabIndex) {
                    0 -> UserTabContent(navController = navController)
                    1 -> SpiritualTabContent(navController = navController)
                }
            }
        }
    }
}

/**
 * Spiritual Tab Content (Classic Homepage Offerings)
 */
@Composable
fun SpiritualTabContent(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // ==========================================
        // 1. HERO BANNER (WELCOME TO Spiritual World)
        // ==========================================
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
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.logo_spiritual_karim),
                        contentDescription = "Spiritual Karim Logo",
                        modifier = Modifier
                            .height(56.dp)
                            .padding(bottom = 8.dp)
                    )

                    Surface(
                        shape = RoundedCornerShape(20.dp),
                        color = MaterialTheme.colorScheme.primaryContainer,
                        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.5f))
                    ) {
                        Text(
                            text = "WELCOME TO SPIRITUAL WORLD",
                            color = MaterialTheme.colorScheme.primary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Spiritual Karim",
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface,
                        textAlign = TextAlign.Center
                    )

                    Text(
                        text = "A Spiritual Soul • A True Mentor",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Medium),
                        color = MaterialTheme.colorScheme.primary,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Karim believes that our physical eyes can only capture what can block light. To truly perceive the seen and unseen, one must open their third eye and enter the realm of mysticism. This is a world of knowing life in its full depth and dimension. Karim acts as a bridge to this mysterious world of spirituality.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        lineHeight = 22.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = { navController.navigate(Screen.About.route) },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Text(
                                "Discover More",
                                color = MaterialTheme.colorScheme.onPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }

                        OutlinedButton(
                            onClick = { navController.navigate(Screen.Contact.route) },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Text(
                                "Get In Touch",
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }
        }

        // ==========================================
        // 2. NEGATIVITY CALLOUT (FREE SOLUTION)
        // ==========================================
        item {
            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.secondary,
                        MaterialTheme.colorScheme.tertiary,
                        MaterialTheme.colorScheme.outline
                    )
                )
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.secondary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSecondary,
                            modifier = Modifier.size(26.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Suffering from Negativity?",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Solution for negativity & spiritual problems is FREE",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = { navController.navigate(Screen.Solution.route) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                ) {
                    Text(
                        "Learn More / Get Free Solution",
                        color = MaterialTheme.colorScheme.onSecondary,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // ==========================================
        // 3. CORE PILLARS / SERVICES
        // ==========================================
        item {
            Text(
                text = "Spiritual Offerings & Portals",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }

        item {
            NavigationTileCard(
                title = "Sacred Sadhanas",
                subtitle = "Sri Yantra, Kalashtami, Navratri Chamunda & Diwali Sadhana",
                icon = Icons.Default.SelfImprovement,
                badge = "4 Guides",
                onClick = { navController.navigate(Screen.SadhanaList.route) }
            )
        }

        item {
            NavigationTileCard(
                title = "Remedies & Upayas",
                subtitle = "Three Diya Process, Trilok Nagri, Court Cases & Business Wealth",
                icon = Icons.Default.LocalFireDepartment,
                badge = "High Potency",
                onClick = { navController.navigate(Screen.RemediesList.route) }
            )
        }

        item {
            NavigationTileCard(
                title = "Siddh Mantras for Japa",
                subtitle = "Mahamrityunjaya, Gayatri, Chamunda & Lakshmi Beej with counter",
                icon = Icons.AutoMirrored.Filled.MenuBook,
                badge = "Interactive",
                onClick = { navController.navigate(Screen.SiddhMantras.route) }
            )
        }

        item {
            NavigationTileCard(
                title = "Spiritual Issues & Cleansing",
                subtitle = "Removing Negativity, Kundalini progress, Material balance & Healing",
                icon = Icons.Default.Psychology,
                badge = "Vedic Wisdom",
                onClick = { navController.navigate(Screen.SpiritualIssuesList.route) }
            )
        }

        item {
            NavigationTileCard(
                title = "Course Info & Bakhoor",
                subtitle = "Spiritual Mentorship batches and sacred incense blends",
                icon = Icons.Default.Info,
                onClick = { navController.navigate(Screen.InformationList.route) }
            )
        }

        // ==========================================
        // 4. YOUTUBE & COMMUNITY HUB
        // ==========================================
        item {
            SpiritualGlassCard {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(androidx.compose.ui.graphics.Color(0xFFCC0000)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = DivineWhite,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "YouTube Videos & Discourses",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = DivineWhite
                        )
                        Text(
                            text = "Watch remedy explanations & live guidance",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = { IntentHelper.openUrl(context, SpiritualContentRepository.YOUTUBE_CHANNEL) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = androidx.compose.ui.graphics.Color(0xFFCC0000))
                ) {
                    Text("Subscribe on YouTube", color = DivineWhite, fontWeight = FontWeight.Bold)
                }
            }
        }

        // ==========================================
        // 5. DIRECT COMMUNITY CHANNELS
        // ==========================================
        item {
            SpiritualGlassCard {
                Text(
                    text = "A Step Towards Making Your Life Spiritual",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = SpiritualGold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Join our thriving seeker community on Telegram for daily guidance, auspicious timings (Muhurtas), and direct updates.",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary,
                    lineHeight = 18.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = { IntentHelper.openUrl(context, SpiritualContentRepository.TELEGRAM_CHANNEL) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = androidx.compose.ui.graphics.Color(0xFF0088CC))
                    ) {
                        Icon(Icons.AutoMirrored.Filled.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Telegram", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                    Button(
                        onClick = { IntentHelper.dialPhoneNumber(context, SpiritualContentRepository.HELPLINE_PHONE) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = SpiritualMaroon)
                    ) {
                        Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp), tint = SpiritualGold)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Call Helpline", color = SpiritualGold, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
