package com.jdroidx.spritualkarim.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.data.repository.NotificationRepository
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.ui.components.BulletPointItem
import com.jdroidx.spritualkarim.ui.components.SectionHeader
import com.jdroidx.spritualkarim.ui.components.SpiritualGlassCard
import com.jdroidx.spritualkarim.ui.components.SpiritualValidatedTextField
import com.jdroidx.spritualkarim.ui.theme.*
import com.jdroidx.spritualkarim.utils.IntentHelper

@Composable
fun SolutionScreen(navController: NavController) {
    val context = LocalContext.current
    var seekerName by remember { mutableStateOf("") }
    var seekerPhone by remember { mutableStateOf("") }
    var problemNote by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Banner
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
                    title = SpiritualContentRepository.SOLUTION_TITLE,
                    subtitle = SpiritualContentRepository.SOLUTION_SUBTITLE,
                    icon = Icons.Default.Shield,
                    badgeText = "100% FREE"
                )
                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = SpiritualContentRepository.SOLUTION_BODY,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 24.sp
                )
            }
        }

        // What We Help You Overcome
        item {
            SpiritualGlassCard {
                Text(
                    text = "What We Help You Overcome",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(10.dp))
                listOf(
                    "Chronic evil eye (Buri Nazar) and energy drains",
                    "Paranormal disturbances and entity attachments in homes",
                    "Occult blockages causing sudden financial stagnation",
                    "Unresolved family strife and emotional despair",
                    "Fears, night terrors, and sleep paralysis issues"
                ).forEach { point ->
                    BulletPointItem(text = point, bulletColor = MaterialTheme.colorScheme.secondary)
                }
            }
        }

        // Submit Free Guidance Request Form
        item {
            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(listOf(SpiritualGold, SpiritualTeal))
            ) {
                Text(
                    text = "Request Free Personal Guidance",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Submit your case details for personalized spiritual advice directly from our mentorship circle.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(12.dp))

                SpiritualValidatedTextField(
                    value = seekerName,
                    onValueChange = { seekerName = it },
                    label = "Your Full Name *",
                    placeholder = "e.g., Rajesh Sharma",
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(8.dp))

                SpiritualValidatedTextField(
                    value = seekerPhone,
                    onValueChange = { seekerPhone = it },
                    label = "Phone / WhatsApp Number *",
                    placeholder = "+91 98765 43210",
                    validationRegex = "^\\+?[0-9\\s-]{8,16}$",
                    errorMessage = "Enter a valid phone number",
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(8.dp))

                SpiritualValidatedTextField(
                    value = problemNote,
                    onValueChange = { problemNote = it },
                    label = "Describe your spiritual problem or question *",
                    placeholder = "Explain symptoms, dreams, house environment, or duration of issue...",
                    minLines = 3,
                    maxLines = 6,
                    maxCharacters = 500
                )

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = {
                        if (seekerName.isNotBlank() && seekerPhone.isNotBlank()) {
                            NotificationRepository.showSuccess(
                                title = "Guidance Request Received 🙏",
                                message = "Namaste $seekerName! Your confidential case details have been submitted. Our mentor circle will review and connect."
                            )
                            seekerName = ""
                            seekerPhone = ""
                            problemNote = ""
                        } else {
                            NotificationRepository.showError(
                                title = "Required Fields Missing",
                                message = "Please fill in your name and contact phone number."
                            )
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Icon(Icons.Default.Shield, contentDescription = null, tint = DivineWhite, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Submit Confidential Case", color = DivineWhite, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Recommended Remedies
        item {
            SpiritualGlassCard {
                Text(
                    text = "Immediate Self-Cleansing Remedies",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = { navController.navigate(Screen.ThreeDiya.route) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                ) {
                    Text(
                        "Perform Three Diya Process",
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedButton(
                    onClick = { navController.navigate(Screen.Negativity.route) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.primary)
                ) {
                    Text("Read Complete Negativity Guide")
                }
            }
        }

        // Direct Assistance
        item {
            SpiritualGlassCard(
                borderBrush = Brush.linearGradient(
                    listOf(MaterialTheme.colorScheme.primary, MaterialTheme.colorScheme.secondary)
                )
            ) {
                Text(
                    text = "Need Personal Guidance from Karim?",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Connect directly with our helpline or telegram group for confidential spiritual assessment.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(14.dp))
                Button(
                    onClick = { IntentHelper.dialPhoneNumber(context, SpiritualContentRepository.HELPLINE_PHONE) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Icon(Icons.Default.Call, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        "Call Free Helpline: +91 80878 27555",
                        color = MaterialTheme.colorScheme.onPrimary,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
