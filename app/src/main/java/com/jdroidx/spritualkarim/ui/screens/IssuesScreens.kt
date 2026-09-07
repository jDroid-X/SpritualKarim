package com.jdroidx.spritualkarim.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.data.model.SpiritualIssueItem
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.ui.components.*

@Composable
fun SpiritualIssuesListScreen(navController: NavController) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            SectionHeader(
                title = "Spiritual Issues & Cleansing",
                subtitle = "Diagnosis, spiritual remedies, and esoteric guidance for common blockages",
                icon = Icons.Default.Psychology
            )
        }

        items(SpiritualContentRepository.issues) { issue ->
            NavigationTileCard(
                title = issue.title,
                subtitle = issue.subtitle,
                icon = Icons.Default.Shield,
                onClick = { navController.navigate(issue.route) }
            )
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun SpiritualIssueDetailScreen(
    issueId: String,
    navController: NavController
) {
    val issue = SpiritualContentRepository.issues.find { it.id == issueId }
        ?: SpiritualContentRepository.issues.first()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Card
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
                Text(
                    text = issue.title,
                    style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = issue.subtitle,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }

        // Symptoms & Indicators
        if (issue.symptoms.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Common Symptoms & Indicators",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    issue.symptoms.forEach { symptom ->
                        BulletPointItem(text = symptom, bulletColor = MaterialTheme.colorScheme.secondary)
                    }
                }
            }
        }

        // Root Causes
        if (issue.rootCauses.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Energetic & Root Causes",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    issue.rootCauses.forEach { cause ->
                        BulletPointItem(text = cause, bulletColor = MaterialTheme.colorScheme.tertiary)
                    }
                }
            }
        }

        // Recommended Spiritual Remedies
        if (issue.spiritualRemedy.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Recommended Spiritual Remedies",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    issue.spiritualRemedy.forEachIndexed { index, step ->
                        StepItemCard(stepNumber = index + 1, instruction = step)
                    }
                }
            }
        }

        // Key Guidance & Tips
        if (issue.keyTips.isNotEmpty()) {
            item {
                SpiritualGlassCard {
                    Text(
                        text = "Guidance from Spiritual Karim",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    issue.keyTips.forEach { tip ->
                        BulletPointItem(text = tip, bulletColor = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }

        // Consult Action
        item {
            Button(
                onClick = { navController.navigate(Screen.Contact.route) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
            ) {
                Text(
                    text = "Request Free Personal Guidance",
                    color = MaterialTheme.colorScheme.onPrimary,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
