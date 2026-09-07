package com.jdroidx.spritualkarim.data.model

import androidx.compose.ui.graphics.vector.ImageVector

data class SadhanaItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val deity: String,
    val duration: String,
    val auspiciousTime: String,
    val rules: List<String>,
    val mantras: List<String>,
    val materials: List<String>,
    val steps: List<String>,
    val significance: String,
    val route: String
)

data class RemedyItem(
    val id: String,
    val title: String,
    val category: String,
    val purpose: String,
    val materials: List<String>,
    val procedure: List<String>,
    val precautions: List<String>,
    val bestDay: String,
    val route: String
)

data class MantraItem(
    val id: String,
    val title: String,
    val deity: String,
    val sanskritText: String,
    val pronunciation: String,
    val englishMeaning: String,
    val targetCount: Int = 108,
    val benefits: List<String>,
    val category: String // "Protection", "Abundance", "Healing", "Enlightenment"
)

data class SpiritualIssueItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val symptoms: List<String>,
    val rootCauses: List<String>,
    val spiritualRemedy: List<String>,
    val keyTips: List<String>,
    val route: String
)

data class InfoArticle(
    val id: String,
    val title: String,
    val category: String,
    val sections: List<ArticleSection>,
    val route: String
)

data class ArticleSection(
    val heading: String,
    val body: String,
    val bulletPoints: List<String> = emptyList()
)

data class FaqItem(
    val id: String,
    val question: String,
    val answer: String,
    val category: String
)

data class NavSubItem(
    val title: String,
    val route: String,
    val icon: ImageVector? = null,
    val badge: String? = null
)

data class NavCategory(
    val title: String,
    val icon: ImageVector,
    val subItems: List<NavSubItem>
)
