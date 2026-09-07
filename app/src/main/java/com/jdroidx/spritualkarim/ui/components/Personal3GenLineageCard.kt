package com.jdroidx.spritualkarim.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Female
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Male
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jdroidx.spritualkarim.data.model.AncestralBranchDetails
import com.jdroidx.spritualkarim.data.model.CurrentFamilyDetails
import com.jdroidx.spritualkarim.data.model.ThreeGenLineage
import com.jdroidx.spritualkarim.ui.theme.*

/**
 * 3-Generation Ancestral Lineage Display Card matching exact Sacred Portal design.
 * Features 3 styled sub-cards for Current Family, Husband's Ancestral, and Wife's Ancestral details.
 */
@Composable
fun Personal3GenLineageCard(
    lineage: ThreeGenLineage,
    onEditClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    SpiritualGlassCard(
        modifier = modifier.fillMaxWidth(),
        borderBrush = Brush.linearGradient(
            listOf(
                MaterialTheme.colorScheme.primary.copy(alpha = 0.6f),
                SpiritualGold.copy(alpha = 0.45f)
            )
        )
    ) {
        Column(
            modifier = Modifier.fillMaxWidth()
        ) {
            // ==========================================
            // HEADER: Icon + Title + Edit Lineage Action
            // ==========================================
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.Default.AccountTree,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Personal & 3-Generation Ancestral Lineage",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        ),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                OutlinedButton(
                    onClick = onEditClick,
                    shape = RoundedCornerShape(20.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                    modifier = Modifier.height(34.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                ) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "Edit Lineage",
                        modifier = Modifier.size(13.dp),
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "Edit Lineage",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // ==========================================
            // 3-COLUMN / 3-CARD ANCESTRAL TILES
            // ==========================================
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Card 1: Current Family
                CurrentFamilySubCard(
                    family = lineage.currentFamily
                )

                // Card 2: Husband's Ancestral Details
                AncestralBranchSubCard(
                    title = "Husband's Ancestral Details",
                    genderIcon = Icons.Default.Male,
                    accentColor = MaterialTheme.colorScheme.primary,
                    branch = lineage.husbandAncestral,
                    isHusband = true
                )

                // Card 3: Wife's Ancestral Details
                AncestralBranchSubCard(
                    title = "Wife's Ancestral Details",
                    genderIcon = Icons.Default.Female,
                    accentColor = MaterialTheme.colorScheme.secondary,
                    branch = lineage.wifeAncestral,
                    isHusband = false
                )
            }
        }
    }
}

/**
 * Sub-card for Current Family Unit.
 */
@Composable
private fun CurrentFamilySubCard(
    family: CurrentFamilyDetails
) {
    val accentColor = MaterialTheme.colorScheme.primary

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f))
            .border(
                BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
                RoundedCornerShape(10.dp)
            )
    ) {
        // Left Accent Stripe
        Box(
            modifier = Modifier
                .width(4.dp)
                .matchParentSize()
                .background(accentColor)
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 14.dp, top = 10.dp, end = 12.dp, bottom = 10.dp)
        ) {
            // Header
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(15.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Current Family",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = accentColor
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Self
            val selfFormatted = if (family.selfTitle.isNotBlank()) {
                "${family.selfName.ifBlank { "Not Specified" }} (${family.selfTitle})"
            } else {
                family.selfName.ifBlank { "Not Specified" }
            }
            LineagePropertyText(label = "Self", value = selfFormatted)

            // Spouse
            LineagePropertyText(label = "Spouse", value = family.spouseName.ifBlank { "Not Specified" })

            // Children
            val childrenVal = if (family.children.isNotEmpty()) {
                family.children.joinToString(", ") { it.name }
            } else {
                "None"
            }
            LineagePropertyText(label = "Children", value = childrenVal)

            // Brothers & Sisters Family Details
            if (family.siblings.isNotEmpty()) {
                val siblingsVal = family.siblings.joinToString(", ") { sib ->
                    val mInfo = if (sib.isMarried && sib.spouseName.isNotBlank()) " (m. ${sib.spouseName})" else ""
                    val cInfo = if (sib.childrenSummary.isNotBlank()) " [${sib.childrenSummary}]" else ""
                    "${sib.name}${mInfo}${cInfo}"
                }
                LineagePropertyText(label = "Brothers/Sisters", value = siblingsVal)
            }
        }
    }
}

/**
 * Sub-card for Ancestral Lineage Branch (Husband or Wife).
 */
@Composable
private fun AncestralBranchSubCard(
    title: String,
    genderIcon: androidx.compose.ui.graphics.vector.ImageVector,
    accentColor: Color,
    branch: AncestralBranchDetails,
    isHusband: Boolean
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f))
            .border(
                BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
                RoundedCornerShape(10.dp)
            )
    ) {
        // Left Accent Stripe
        Box(
            modifier = Modifier
                .width(4.dp)
                .matchParentSize()
                .background(accentColor)
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 14.dp, top = 10.dp, end = 12.dp, bottom = 10.dp)
        ) {
            // Header
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = genderIcon,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(15.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = title,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = accentColor
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Parents
            LineagePropertyText(label = "Parents", value = branch.parentsFormatted)

            // Paternal GP
            LineagePropertyText(label = "Paternal GP", value = branch.paternalGrandparentsFormatted)

            // Maternal GP
            LineagePropertyText(label = "Maternal GP", value = branch.maternalGrandparentsFormatted)

            // Siblings if present
            if (branch.siblings.isNotEmpty()) {
                val sibVal = branch.siblings.joinToString(", ") { sib ->
                    if (sib.spouseName.isNotBlank()) "${sib.name} (m. ${sib.spouseName})" else sib.name
                }
                LineagePropertyText(label = if (isHusband) "Husband's Siblings" else "Wife's Siblings", value = sibVal)
            }

            // Address
            LineagePropertyText(label = "Address", value = branch.address.ifBlank { "Ancestral Origin / Not Recorded" })
        }
    }
}

/**
 * Text formatter with bold label and regular value.
 */
@Composable
private fun LineagePropertyText(
    label: String,
    value: String
) {
    Text(
        text = buildAnnotatedString {
            withStyle(
                style = SpanStyle(
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            ) {
                append("$label: ")
            }
            withStyle(
                style = SpanStyle(
                    fontWeight = FontWeight.Normal,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            ) {
                append(value)
            }
        },
        fontSize = 12.sp,
        lineHeight = 17.sp,
        modifier = Modifier.padding(vertical = 1.5.dp)
    )
}
