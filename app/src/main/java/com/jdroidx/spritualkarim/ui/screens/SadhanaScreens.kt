package com.jdroidx.spritualkarim.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.ui.components.*

@Composable
fun SadhanaListScreen(navController: NavController) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            SectionHeader(
                title = "Sacred Sadhanas",
                subtitle = "Authentic spiritual practices, rituals, and deity invocations",
                icon = Icons.Default.SelfImprovement
            )
        }

        items(SpiritualContentRepository.sadhanas) { sadhana ->
            NavigationTileCard(
                title = sadhana.title,
                subtitle = sadhana.subtitle,
                icon = Icons.Default.AutoAwesome,
                badge = sadhana.deity,
                onClick = { navController.navigate(sadhana.route) }
            )
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun SadhanaDetailScreen(
    sadhanaId: String,
    navController: NavController
) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val sadhana = SpiritualContentRepository.sadhanas.find { it.id == sadhanaId }
        ?: SpiritualContentRepository.sadhanas.first()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Header Card
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
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.primaryContainer
                ) {
                    Text(
                        text = "DEITY: ${sadhana.deity.uppercase()}",
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = sadhana.title,
                    style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = sadhana.subtitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )

                Spacer(modifier = Modifier.height(12.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Duration", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(sadhana.duration, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold), color = MaterialTheme.colorScheme.onSurface)
                    }
                    Column {
                        Text("Auspicious Timing", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(sadhana.auspiciousTime, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold), color = MaterialTheme.colorScheme.onSurface)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Quick AI Guidance & Checklist Action Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            com.jdroidx.spritualkarim.data.repository.UserHubRepository.sendChatMessage("Provide complete step-by-step guidance for ${sadhana.title}")
                            android.widget.Toast.makeText(context, "Query sent to Spiritual Assistant", android.widget.Toast.LENGTH_SHORT).show()
                            com.jdroidx.spritualkarim.utils.IntentHelper.openUrl(context, com.jdroidx.spritualkarim.data.repository.UserHubRepository.NOTEBOOKLM_URL)
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(vertical = 8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = com.jdroidx.spritualkarim.ui.theme.SpiritualTeal)
                    ) {
                        Icon(Icons.AutoMirrored.Filled.OpenInNew, contentDescription = null, modifier = Modifier.size(14.dp), tint = com.jdroidx.spritualkarim.ui.theme.DivineWhite)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Ask AI Guide", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = com.jdroidx.spritualkarim.ui.theme.DivineWhite)
                    }

                    OutlinedButton(
                        onClick = {
                            com.jdroidx.spritualkarim.data.repository.UserHubRepository.addTodo(
                                title = sadhana.title,
                                subText = "Timing: ${sadhana.auspiciousTime} • ${sadhana.duration}",
                                category = "Sadhana",
                                profileType = com.jdroidx.spritualkarim.data.model.ProfileType.DEVOTEE
                            )
                            com.jdroidx.spritualkarim.data.repository.NotificationRepository.showSuccess(
                                title = "Added to Daily Checklist",
                                message = "${sadhana.title} scheduled in daily sadhana tasks."
                            )
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(vertical = 8.dp)
                    ) {
                        Icon(Icons.Default.Checklist, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("+ Daily Task", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }

        // Significance
        item {
            SpiritualGlassCard {
                Text(
                    text = "Spiritual Significance",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = sadhana.significance,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 22.sp
                )
            }
        }

        // Sacred Mantras
        if (sadhana.mantras.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Sacred Japa Mantras",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    sadhana.mantras.forEach { mantra ->
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.7f),
                            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f))
                        ) {
                            Text(
                                text = mantra,
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp
                                ),
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(12.dp)
                            )
                        }
                    }
                }
            }
        }

        // Required Materials (Samagri)
        if (sadhana.materials.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Required Materials (Puja Samagri)",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    sadhana.materials.forEach { material ->
                        BulletPointItem(text = material, bulletColor = MaterialTheme.colorScheme.tertiary)
                    }
                }
            }
        }

        // Rules & Discipline
        if (sadhana.rules.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Sadhana Rules & Discipline",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    sadhana.rules.forEach { rule ->
                        BulletPointItem(text = rule, bulletColor = MaterialTheme.colorScheme.secondary)
                    }
                }
            }
        }

        // Step-by-Step Procedure
        if (sadhana.steps.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Step-by-Step Ritual Procedure",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    sadhana.steps.forEachIndexed { index, step ->
                        StepItemCard(stepNumber = index + 1, instruction = step)
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
