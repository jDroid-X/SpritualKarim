package com.jdroidx.spritualkarim.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.jdroidx.spritualkarim.navigation.Screen
import com.jdroidx.spritualkarim.navigation.SetupNavGraph
import com.jdroidx.spritualkarim.ui.components.SpiritualDrawerContent
import com.jdroidx.spritualkarim.ui.components.SpiritualSlideNotificationHost
import com.jdroidx.spritualkarim.ui.components.SpiritualTopAppBar
import kotlinx.coroutines.launch

@Composable
fun MainScaffold() {
    val navController = rememberNavController()
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val currentScreenTitle = when (currentRoute) {
        Screen.Home.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("app_title")
        Screen.About.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("about")
        Screen.Solution.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("free_solution")
        Screen.Faq.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("faq")
        Screen.Contact.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("contact")
        Screen.SadhanaList.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("sadhanas")
        Screen.SriYantra.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("sri_yantra")
        Screen.Kalashtami.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("kalashtami")
        Screen.Navratri.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("navratri")
        Screen.Diwali.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("diwali")
        Screen.RemediesList.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("remedies")
        Screen.TrilokNagri.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("trilok_nagri")
        Screen.ThreeDiya.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("three_diya")
        Screen.CourtCases.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("court_cases")
        Screen.Business.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("business_money")
        Screen.SiddhMantras.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("mantras")
        Screen.SpiritualIssuesList.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("issues")
        Screen.Negativity.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("removing_negativity")
        Screen.Progress.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("spiritual_progress")
        Screen.Benefits.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("material_benefits")
        Screen.Healing.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("healing_illness")
        Screen.InformationList.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("information")
        Screen.Courses.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("courses")
        Screen.Bakhoor.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("bakhoor")
        Screen.Settings.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("settings")
        Screen.HealersHub.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("healers_hub")
        Screen.HealersHierarchy.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("hierarchy_tree")
        Screen.HealerDetail.route -> "Profile Details"
        Screen.LineageChat.route -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("msgbot_title")
        else -> when {
            currentRoute?.startsWith("healers/detail") == true -> "Profile Details"
            currentRoute?.startsWith("msgbot/chat") == true -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("msgbot_title")
            else -> com.jdroidx.spritualkarim.data.manager.LanguageManager.getString("app_title")
        }
    }

    val canNavigateBack = currentRoute != null && currentRoute != Screen.Home.route

    SpiritualSlideNotificationHost {
        ModalNavigationDrawer(
            drawerState = drawerState,
            drawerContent = {
                SpiritualDrawerContent(
                    currentRoute = currentRoute,
                    onNavigate = { route ->
                        if (currentRoute != route) {
                            navController.navigate(route) {
                                launchSingleTop = true
                                if (route == Screen.Home.route) {
                                    popUpTo(Screen.Home.route) { inclusive = true }
                                } else {
                                    popUpTo(Screen.Home.route) {
                                        saveState = true
                                    }
                                    restoreState = true
                                }
                            }
                        }
                    },
                    onCloseDrawer = {
                        scope.launch { drawerState.close() }
                    }
                )
            }
        ) {
            Scaffold(
                topBar = {
                    SpiritualTopAppBar(
                        title = currentScreenTitle,
                        canNavigateBack = canNavigateBack,
                        onNavigateBack = {
                            navController.popBackStack()
                        },
                        onOpenDrawer = {
                            scope.launch { drawerState.open() }
                        }
                    )
                }
            ) { innerPadding ->
                Box(modifier = Modifier.padding(innerPadding)) {
                    SetupNavGraph(navController = navController)
                }
            }
        }
    }
}
