package com.jdroidx.spritualkarim.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jdroidx.spritualkarim.data.model.*
import java.util.UUID

/**
 * Interactive 3-Generation Ancestral Lineage & Sibling Family Data Entry Dialog.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditLineageDialog(
    initialLineage: ThreeGenLineage,
    onDismiss: () -> Unit,
    onSave: (ThreeGenLineage) -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) }

    // --- Tab 1 State: Current Family ---
    var selfName by remember { mutableStateOf(initialLineage.currentFamily.selfName) }
    var selfTitle by remember { mutableStateOf(initialLineage.currentFamily.selfTitle) }
    var spouseName by remember { mutableStateOf(initialLineage.currentFamily.spouseName) }
    var children by remember { mutableStateOf(initialLineage.currentFamily.children.toMutableList()) }
    var siblings by remember { mutableStateOf(initialLineage.currentFamily.siblings.toMutableList()) }

    // --- Tab 2 State: Husband's Ancestral ---
    var hFather by remember { mutableStateOf(initialLineage.husbandAncestral.fatherName) }
    var hMother by remember { mutableStateOf(initialLineage.husbandAncestral.motherName) }
    var hPaternalGf by remember { mutableStateOf(initialLineage.husbandAncestral.paternalGrandfather) }
    var hPaternalGm by remember { mutableStateOf(initialLineage.husbandAncestral.paternalGrandmother) }
    var hMaternalGf by remember { mutableStateOf(initialLineage.husbandAncestral.maternalGrandfather) }
    var hMaternalGm by remember { mutableStateOf(initialLineage.husbandAncestral.maternalGrandmother) }
    var hSiblings by remember { mutableStateOf(initialLineage.husbandAncestral.siblings.toMutableList()) }
    var hAddress by remember { mutableStateOf(initialLineage.husbandAncestral.address) }

    // --- Tab 3 State: Wife's Ancestral ---
    var wFather by remember { mutableStateOf(initialLineage.wifeAncestral.fatherName) }
    var wMother by remember { mutableStateOf(initialLineage.wifeAncestral.motherName) }
    var wPaternalGf by remember { mutableStateOf(initialLineage.wifeAncestral.paternalGrandfather) }
    var wPaternalGm by remember { mutableStateOf(initialLineage.wifeAncestral.paternalGrandmother) }
    var wMaternalGf by remember { mutableStateOf(initialLineage.wifeAncestral.maternalGrandfather) }
    var wMaternalGm by remember { mutableStateOf(initialLineage.wifeAncestral.maternalGrandmother) }
    var wSiblings by remember { mutableStateOf(initialLineage.wifeAncestral.siblings.toMutableList()) }
    var wAddress by remember { mutableStateOf(initialLineage.wifeAncestral.address) }

    AlertDialog(
        onDismissRequest = onDismiss,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.AccountTree,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "3-Generation Lineage Entry",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                // Segmented Tabs
                PrimaryTabRow(
                    selectedTabIndex = selectedTab,
                    modifier = Modifier.fillMaxWidth(),
                    containerColor = MaterialTheme.colorScheme.surface
                ) {
                    Tab(
                        selected = selectedTab == 0,
                        onClick = { selectedTab = 0 },
                        text = { Text("Current Family", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = selectedTab == 1,
                        onClick = { selectedTab = 1 },
                        text = { Text("Husband's Line", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = selectedTab == 2,
                        onClick = { selectedTab = 2 },
                        text = { Text("Wife's Line", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(420.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    when (selectedTab) {
                        0 -> {
                            // ==========================================
                            // TAB 0: CURRENT FAMILY
                            // ==========================================
                            item {
                                OutlinedTextField(
                                    value = selfName,
                                    onValueChange = { selfName = it },
                                    label = { Text("Self Name *") },
                                    placeholder = { Text("e.g., Spiritual Karim Khan") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = selfTitle,
                                    onValueChange = { selfTitle = it },
                                    label = { Text("Spiritual Title / Role") },
                                    placeholder = { Text("e.g., Founder & Master Guide") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = spouseName,
                                    onValueChange = { spouseName = it },
                                    label = { Text("Spouse Name") },
                                    placeholder = { Text("e.g., Fatima Karim Khan") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }

                            // --- CHILDREN SECTION ---
                            item {
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Children (${children.size})",
                                        style = MaterialTheme.typography.titleSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    TextButton(
                                        onClick = {
                                            children = (children + ChildMember(
                                                id = UUID.randomUUID().toString().take(6),
                                                name = "",
                                                gender = "Son"
                                            )).toMutableList()
                                        },
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                                    ) {
                                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Add Child", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }

                            itemsIndexed(children) { index, child ->
                                Card(
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        OutlinedTextField(
                                            value = child.name,
                                            onValueChange = { newName ->
                                                val updated = children.toMutableList()
                                                updated[index] = child.copy(name = newName)
                                                children = updated
                                            },
                                            label = { Text("Child ${index + 1} Name") },
                                            singleLine = true,
                                            modifier = Modifier.weight(1f)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        IconButton(
                                            onClick = {
                                                val updated = children.toMutableList()
                                                updated.removeAt(index)
                                                children = updated
                                            }
                                        ) {
                                            Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(20.dp))
                                        }
                                    }
                                }
                            }

                            // --- BROTHERS & SISTERS SECTION ---
                            item {
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Brothers & Sisters Details (${siblings.size})",
                                        style = MaterialTheme.typography.titleSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    TextButton(
                                        onClick = {
                                            siblings = (siblings + SiblingMember(
                                                id = UUID.randomUUID().toString().take(6),
                                                name = "",
                                                relation = "Brother",
                                                spouseName = "",
                                                childrenSummary = "",
                                                isMarried = false
                                            )).toMutableList()
                                        },
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                                    ) {
                                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Add Sibling", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }

                            itemsIndexed(siblings) { index, sib ->
                                Card(
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.25f))
                                ) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(8.dp),
                                        verticalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            OutlinedTextField(
                                                value = sib.name,
                                                onValueChange = { newName ->
                                                    val updated = siblings.toMutableList()
                                                    updated[index] = sib.copy(name = newName)
                                                    siblings = updated
                                                },
                                                label = { Text("Brother / Sister Name") },
                                                singleLine = true,
                                                modifier = Modifier.weight(1f)
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            OutlinedTextField(
                                                value = sib.relation,
                                                onValueChange = { newRel ->
                                                    val updated = siblings.toMutableList()
                                                    updated[index] = sib.copy(relation = newRel)
                                                    siblings = updated
                                                },
                                                label = { Text("Relation") },
                                                singleLine = true,
                                                modifier = Modifier.width(105.dp)
                                            )
                                            IconButton(
                                                onClick = {
                                                    val updated = siblings.toMutableList()
                                                    updated.removeAt(index)
                                                    siblings = updated
                                                }
                                            ) {
                                                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(18.dp))
                                            }
                                        }

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                                        ) {
                                            OutlinedTextField(
                                                value = sib.spouseName,
                                                onValueChange = { newSpouse ->
                                                    val updated = siblings.toMutableList()
                                                    updated[index] = sib.copy(spouseName = newSpouse, isMarried = newSpouse.isNotBlank())
                                                    siblings = updated
                                                },
                                                label = { Text("Spouse Name") },
                                                placeholder = { Text("e.g. Shabnam Khan") },
                                                singleLine = true,
                                                modifier = Modifier.weight(1f)
                                            )
                                            OutlinedTextField(
                                                value = sib.childrenSummary,
                                                onValueChange = { newKids ->
                                                    val updated = siblings.toMutableList()
                                                    updated[index] = sib.copy(childrenSummary = newKids)
                                                    siblings = updated
                                                },
                                                label = { Text("Children Info") },
                                                placeholder = { Text("e.g. 2 Sons") },
                                                singleLine = true,
                                                modifier = Modifier.weight(1f)
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        1 -> {
                            // ==========================================
                            // TAB 1: HUSBAND'S ANCESTRAL LINEAGE
                            // ==========================================
                            item {
                                Text("Parents Details", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Color(0xFFFFA000))
                            }
                            item {
                                OutlinedTextField(
                                    value = hFather,
                                    onValueChange = { hFather = it },
                                    label = { Text("Father's Name") },
                                    placeholder = { Text("e.g. Late Hazrat Ghulam Khan") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = hMother,
                                    onValueChange = { hMother = it },
                                    label = { Text("Mother's Name") },
                                    placeholder = { Text("e.g. Begum Mumtaz Khan") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }

                            item {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Paternal Grandparents (Father's Side)", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Color(0xFFFFA000))
                            }
                            item {
                                OutlinedTextField(
                                    value = hPaternalGf,
                                    onValueChange = { hPaternalGf = it },
                                    label = { Text("Paternal Grandfather") },
                                    placeholder = { Text("e.g. Sufi Dilawar Khan") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = hPaternalGm,
                                    onValueChange = { hPaternalGm = it },
                                    label = { Text("Paternal Grandmother") },
                                    placeholder = { Text("e.g. Amina Khatoon") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }

                            item {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Maternal Grandparents (Mother's Side)", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Color(0xFFFFA000))
                            }
                            item {
                                OutlinedTextField(
                                    value = hMaternalGf,
                                    onValueChange = { hMaternalGf = it },
                                    label = { Text("Maternal Grandfather") },
                                    placeholder = { Text("e.g. Maulana Aslam Qureshi") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = hMaternalGm,
                                    onValueChange = { hMaternalGm = it },
                                    label = { Text("Maternal Grandmother") },
                                    placeholder = { Text("e.g. Rabia Qureshi") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }

                            item {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Ancestral Origin / Address", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Color(0xFFFFA000))
                            }
                            item {
                                OutlinedTextField(
                                    value = hAddress,
                                    onValueChange = { hAddress = it },
                                    label = { Text("Husband's Family Address") },
                                    placeholder = { Text("e.g. Ancestral Haveli, Old Varanasi") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                        }

                        2 -> {
                            // ==========================================
                            // TAB 2: WIFE'S ANCESTRAL LINEAGE
                            // ==========================================
                            item {
                                Text("Parents Details", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Color(0xFFFF4081))
                            }
                            item {
                                OutlinedTextField(
                                    value = wFather,
                                    onValueChange = { wFather = it },
                                    label = { Text("Father's Name") },
                                    placeholder = { Text("e.g. Janab Abdul Sattar") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = wMother,
                                    onValueChange = { wMother = it },
                                    label = { Text("Mother's Name") },
                                    placeholder = { Text("e.g. Tahira Begum") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }

                            item {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Paternal Grandparents (Father's Side)", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Color(0xFFFF4081))
                            }
                            item {
                                OutlinedTextField(
                                    value = wPaternalGf,
                                    onValueChange = { wPaternalGf = it },
                                    label = { Text("Paternal Grandfather") },
                                    placeholder = { Text("e.g. Haji Rahimuddin") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = wPaternalGm,
                                    onValueChange = { wPaternalGm = it },
                                    label = { Text("Paternal Grandmother") },
                                    placeholder = { Text("e.g. Mariam Begum") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }

                            item {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Maternal Grandparents (Mother's Side)", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Color(0xFFFF4081))
                            }
                            item {
                                OutlinedTextField(
                                    value = wMaternalGf,
                                    onValueChange = { wMaternalGf = it },
                                    label = { Text("Maternal Grandfather") },
                                    placeholder = { Text("e.g. Janab Yusuf Sheikh") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = wMaternalGm,
                                    onValueChange = { wMaternalGm = it },
                                    label = { Text("Maternal Grandmother") },
                                    placeholder = { Text("e.g. Kulsum Sheikh") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }

                            item {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Ancestral Origin / Address", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Color(0xFFFF4081))
                            }
                            item {
                                OutlinedTextField(
                                    value = wAddress,
                                    onValueChange = { wAddress = it },
                                    label = { Text("Wife's Family Address") },
                                    placeholder = { Text("e.g. Civil Lines, Lucknow") },
                                    singleLine = true,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val updatedLineage = ThreeGenLineage(
                        currentFamily = CurrentFamilyDetails(
                            selfName = selfName,
                            selfTitle = selfTitle,
                            spouseName = spouseName,
                            children = children.filter { it.name.isNotBlank() },
                            siblings = siblings.filter { it.name.isNotBlank() }
                        ),
                        husbandAncestral = AncestralBranchDetails(
                            fatherName = hFather,
                            motherName = hMother,
                            paternalGrandfather = hPaternalGf,
                            paternalGrandmother = hPaternalGm,
                            maternalGrandfather = hMaternalGf,
                            maternalGrandmother = hMaternalGm,
                            siblings = hSiblings,
                            address = hAddress
                        ),
                        wifeAncestral = AncestralBranchDetails(
                            fatherName = wFather,
                            motherName = wMother,
                            paternalGrandfather = wPaternalGf,
                            paternalGrandmother = wPaternalGm,
                            maternalGrandfather = wMaternalGf,
                            maternalGrandmother = wMaternalGm,
                            siblings = wSiblings,
                            address = wAddress
                        )
                    )
                    onSave(updatedLineage)
                },
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Save Lineage", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            OutlinedButton(
                onClick = onDismiss,
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Cancel")
            }
        }
    )
}
