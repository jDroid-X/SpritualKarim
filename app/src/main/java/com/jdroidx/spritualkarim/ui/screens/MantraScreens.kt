package com.jdroidx.spritualkarim.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.MenuBook
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.ui.components.MantraInteractiveCard
import com.jdroidx.spritualkarim.ui.components.SectionHeader

@Composable
fun SiddhMantrasScreen(navController: NavController) {
    var selectedCategory by remember { mutableStateOf("All") }
    val categories = listOf("All", "Protection & Power", "Abundance", "Protection & Healing", "Enlightenment")

    val filteredMantras = remember(selectedCategory) {
        if (selectedCategory == "All") {
            SpiritualContentRepository.mantras
        } else {
            SpiritualContentRepository.mantras.filter { it.category == selectedCategory }
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            SectionHeader(
                title = "Siddh Mantras for Mantra Jaap",
                subtitle = "Consecrated Sanskrit mantras with pronunciation, meaning, and built-in japa counter",
                icon = Icons.AutoMirrored.Filled.MenuBook
            )
        }

        // Category Filter Chips
        item {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(categories) { cat ->
                    FilterChip(
                        selected = selectedCategory == cat,
                        onClick = { selectedCategory = cat },
                        label = { Text(cat, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                            selectedLabelColor = MaterialTheme.colorScheme.primary,
                            containerColor = MaterialTheme.colorScheme.surfaceVariant,
                            labelColor = MaterialTheme.colorScheme.onSurfaceVariant
                        ),
                        shape = RoundedCornerShape(8.dp)
                    )
                }
            }
        }

        items(filteredMantras) { mantra ->
            MantraInteractiveCard(mantra = mantra)
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
