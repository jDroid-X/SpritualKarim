package com.jdroidx.spritualkarim.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.jdroidx.spritualkarim.ui.screens.*

import androidx.navigation.NavType
import androidx.navigation.navArgument

@Composable
fun SetupNavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        // Main
        composable(Screen.Home.route) {
            HomeScreen(navController = navController)
        }
        composable(Screen.About.route) {
            AboutScreen(navController = navController)
        }
        composable(Screen.Solution.route) {
            SolutionScreen(navController = navController)
        }
        composable(Screen.Faq.route) {
            FaqScreen(navController = navController)
        }
        composable(Screen.Contact.route) {
            ContactScreen(navController = navController)
        }

        // Sadhanas
        composable(Screen.SadhanaList.route) {
            SadhanaListScreen(navController = navController)
        }
        composable(Screen.SriYantra.route) {
            SadhanaDetailScreen(sadhanaId = "sri_yantra", navController = navController)
        }
        composable(Screen.Kalashtami.route) {
            SadhanaDetailScreen(sadhanaId = "kalashtami", navController = navController)
        }
        composable(Screen.Navratri.route) {
            SadhanaDetailScreen(sadhanaId = "navratri", navController = navController)
        }
        composable(Screen.Diwali.route) {
            SadhanaDetailScreen(sadhanaId = "diwali", navController = navController)
        }

        // Remedies
        composable(Screen.RemediesList.route) {
            RemediesListScreen(navController = navController)
        }
        composable(Screen.TrilokNagri.route) {
            RemedyDetailScreen(remedyId = "trilok_nagri", navController = navController)
        }
        composable(Screen.ThreeDiya.route) {
            RemedyDetailScreen(remedyId = "three_diya", navController = navController)
        }
        composable(Screen.CourtCases.route) {
            RemedyDetailScreen(remedyId = "court_cases", navController = navController)
        }
        composable(Screen.Business.route) {
            RemedyDetailScreen(remedyId = "business_money", navController = navController)
        }

        // Mantras
        composable(Screen.SiddhMantras.route) {
            SiddhMantrasScreen(navController = navController)
        }

        // Issues
        composable(Screen.SpiritualIssuesList.route) {
            SpiritualIssuesListScreen(navController = navController)
        }
        composable(Screen.Negativity.route) {
            SpiritualIssueDetailScreen(issueId = "negativity", navController = navController)
        }
        composable(Screen.Progress.route) {
            SpiritualIssueDetailScreen(issueId = "progress", navController = navController)
        }
        composable(Screen.Benefits.route) {
            SpiritualIssueDetailScreen(issueId = "material_benefits", navController = navController)
        }
        composable(Screen.Healing.route) {
            SpiritualIssueDetailScreen(issueId = "healing", navController = navController)
        }

        // Info
        composable(Screen.InformationList.route) {
            InformationListScreen(navController = navController)
        }
        composable(Screen.Courses.route) {
            InfoArticleDetailScreen(articleId = "courses", navController = navController)
        }
        composable(Screen.Bakhoor.route) {
            InfoArticleDetailScreen(articleId = "bakhoor", navController = navController)
        }

        // Settings
        composable(Screen.Settings.route) {
            SettingsScreen(navController = navController)
        }

        // Healers Multi-Level Organization
        composable(
            route = Screen.HealersHub.route,
            arguments = listOf(
                navArgument("filter") {
                    type = NavType.StringType
                    nullable = true
                    defaultValue = null
                }
            )
        ) { backStackEntry ->
            val filter = backStackEntry.arguments?.getString("filter")
            HealersHubScreen(navController = navController, initialFilter = filter)
        }
        composable(Screen.HealersHierarchy.route) {
            HierarchyTreeScreen(navController = navController)
        }
        composable(
            route = Screen.HealerDetail.route,
            arguments = listOf(
                navArgument("profileId") {
                    type = NavType.StringType
                }
            )
        ) { backStackEntry ->
            val profileId = backStackEntry.arguments?.getString("profileId") ?: ""
            HealerDetailScreen(profileId = profileId, navController = navController)
        }

        // Lineage Chat Screen
        composable(
            route = Screen.LineageChat.route,
            arguments = listOf(
                navArgument("conversationId") {
                    type = NavType.StringType
                    nullable = true
                    defaultValue = null
                }
            )
        ) { backStackEntry ->
            val convId = backStackEntry.arguments?.getString("conversationId")
            LineageChatScreen(navController = navController, initialConversationId = convId)
        }
    }
}
