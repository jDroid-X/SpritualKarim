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
import com.jdroidx.spritualkarim.data.model.RemedyItem
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.ui.components.*

@Composable
fun RemediesListScreen(navController: NavController) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            SectionHeader(
                title = "Remedies & Upayas",
                subtitle = "Vedic and occult remedies for swift energetic resolution",
                icon = Icons.Default.LocalFireDepartment
            )
        }

        items(SpiritualContentRepository.remedies) { remedy ->
            NavigationTileCard(
                title = remedy.title,
                subtitle = remedy.purpose,
                icon = Icons.Default.Flare,
                badge = remedy.category,
                onClick = { navController.navigate(remedy.route) }
            )
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun RemedyDetailScreen(
    remedyId: String,
    navController: NavController
) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val remedy = SpiritualContentRepository.remedies.find { it.id == remedyId }
        ?: SpiritualContentRepository.remedies.first()

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
                        MaterialTheme.colorScheme.secondary,
                        MaterialTheme.colorScheme.primary,
                        MaterialTheme.colorScheme.outline
                    )
                )
            ) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.primaryContainer
                ) {
                    Text(
                        text = remedy.category.uppercase(),
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = remedy.title,
                    style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = remedy.purpose,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary,
                    lineHeight = 22.sp
                )

                Spacer(modifier = Modifier.height(10.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Best Timing / Day", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(remedy.bestDay, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold), color = MaterialTheme.colorScheme.onSurface)
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
                            com.jdroidx.spritualkarim.data.repository.UserHubRepository.sendChatMessage("Provide complete remedy instructions and mantras for ${remedy.title}")
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
                                title = remedy.title,
                                subText = "Timing: ${remedy.bestDay}",
                                category = "Remedy",
                                profileType = com.jdroidx.spritualkarim.data.model.ProfileType.DEVOTEE
                            )
                            com.jdroidx.spritualkarim.data.repository.NotificationRepository.showSuccess(
                                title = "Added to Daily Checklist",
                                message = "${remedy.title} scheduled in daily sadhana tasks."
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

        // Required Materials (Samagri)
        if (remedy.materials.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Materials Needed",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    remedy.materials.forEach { material ->
                        BulletPointItem(text = material, bulletColor = MaterialTheme.colorScheme.tertiary)
                    }
                }
            }
        }

        // Step-by-Step Procedure
        if (remedy.procedure.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Exact Procedure",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    remedy.procedure.forEachIndexed { index, step ->
                        StepItemCard(stepNumber = index + 1, instruction = step)
                    }
                }
            }
        }

        // Precautions
        if (remedy.precautions.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Important Precautions",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    remedy.precautions.forEach { precaution ->
                        BulletPointItem(text = precaution, bulletColor = MaterialTheme.colorScheme.secondary)
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
