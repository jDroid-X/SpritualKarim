package com.jdroidx.spritualkarim.navigation

sealed class Screen(val route: String, val title: String) {
    object Home : Screen("home", "Home")
    object About : Screen("about", "About Us")
    object Solution : Screen("solution", "Solution")
    object Faq : Screen("faq", "FAQ")
    object Contact : Screen("contact", "Get In Touch")

    // Sadhana Group
    object SadhanaList : Screen("sadhana", "Sadhanas")
    object SriYantra : Screen("sadhana/sri_yantra", "Sri Yantra Sadhana")
    object Kalashtami : Screen("sadhana/kalashtami", "Kalashtami Sadhana")
    object Navratri : Screen("sadhana/navratri", "Navratri Sadhana")
    object Diwali : Screen("sadhana/diwali", "Diwali Sadhana")

    // Remedies Group
    object RemediesList : Screen("remedies", "Remedies & Upayas")
    object TrilokNagri : Screen("remedies/trilok_nagri", "Trilok Nagri Access")
    object ThreeDiya : Screen("remedies/three_diya", "Three Diya Process")
    object CourtCases : Screen("remedies/court_cases", "Court Cases Remedy")
    object Business : Screen("remedies/business", "Business & Money Remedy")

    // Mantras
    object SiddhMantras : Screen("siddh_mantras", "Siddh Mantras")

    // Spiritual Issues Group
    object SpiritualIssuesList : Screen("spiritual_issues", "Spiritual Issues")
    object Negativity : Screen("issues/negativity", "Removing Negativity")
    object Progress : Screen("issues/progress", "Spiritual Progress")
    object Benefits : Screen("issues/benefits", "Material Benefits")
    object Healing : Screen("issues/healing", "Healing from Illness")

    // Information Group
    object InformationList : Screen("information", "Information")
    object Courses : Screen("info/courses", "Course Information")
    object Bakhoor : Screen("info/bakhoor", "Bakhoor & Incense")

    // Settings
    object Settings : Screen("settings", "Settings & Configuration")

    // Healers Multi-Level Organization
    object HealersHub : Screen("healers?filter={filter}", "Healers & Organization") {
        fun createRoute(filter: String? = null) = if (filter != null) "healers?filter=$filter" else "healers"
    }
    object HealersHierarchy : Screen("healers/hierarchy", "Multilevel Organization Tree")
    object HealerDetail : Screen("healers/detail/{profileId}", "Profile Details") {
        fun createRoute(profileId: String) = "healers/detail/$profileId"
    }

    // MsgBot Lineage Chat
    object LineageChat : Screen("msgbot/chat?conversationId={conversationId}", "Lineage Chat") {
        fun createRoute(conversationId: String? = null) =
            if (conversationId != null) "msgbot/chat?conversationId=$conversationId" else "msgbot/chat"
    }
}

