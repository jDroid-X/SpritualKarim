package com.jdroidx.spritualkarim.data.manager

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

/**
 * Top 10 Indian Languages and Top 5 World Languages supported in Spiritual Karim.
 */
enum class AppLanguage(
    val code: String,
    val nativeName: String,
    val englishName: String,
    val region: String,
) {
    // Top 10 Indian Languages + English
    ENGLISH("en", "English", "English", "India & Global"),
    HINDI("hi", "हिन्दी", "Hindi", "India"),
    BENGALI("bn", "বাংলা", "Bengali", "India / West Bengal"),
    MARATHI("mr", "मराठी", "Marathi", "India / Maharashtra"),
    TELUGU("te", "తెలుగు", "Telugu", "India / AP & Telangana"),
    TAMIL("ta", "தமிழ்", "Tamil", "India / Tamil Nadu"),
    GUJARATI("gu", "ગુજરાતી", "Gujarati", "India / Gujarat"),
    KANNADA("kn", "ಕನ್ನಡ", "Kannada", "India / Karnataka"),
    MALAYALAM("ml", "മലയാളം", "Malayalam", "India / Kerala"),
    PUNJABI("pa", "ਪੰਜਾਬੀ", "Punjabi", "India / Punjab"),
    ODIA("or", "ଓଡ଼ିଆ", "Odia", "India / Odisha"),

    // Top 5 World Languages
    SPANISH("es", "Español", "Spanish", "Global / Americas"),
    FRENCH("fr", "Français", "French", "Global / Europe"),
    GERMAN("de", "Deutsch", "German", "Global / Europe"),
    ARABIC("ar", "العربية", "Arabic", "Global / Middle East"),
    RUSSIAN("ru", "Русский", "Russian", "Global / Eurasia")
}

/**
 * Centralized Multi-Language Localization Engine.
 * Dynamically provides UI strings for all screens, navigation menus, and widgets.
 */
object LanguageManager {
    var currentLanguage by mutableStateOf(AppLanguage.ENGLISH)

    private val translations = mapOf(
        // ENGLISH
        "en" to mapOf(
            "app_title" to "Spiritual Karim",
            "app_subtitle" to "A Spiritual Soul • A True Mentor",
            "tab_user" to "User Hub",
            "tab_spiritual" to "Spiritual",
            "home" to "Home",
            "about" to "About Us",
            "free_solution" to "Free Solution",
            "healers" to "Healers & Organization",
            "healers_hub" to "Healers Portal",
            "hierarchy_tree" to "5-Level Hierarchy Tree",
            "admin_healers" to "Admin & Healers",
            "trainees" to "Trainees",
            "devotees" to "Devotees",
            "sadhanas" to "Sadhanas",
            "sri_yantra" to "Sri Yantra Sadhana",
            "kalashtami" to "Kalashtami Sadhana",
            "navratri" to "Navratri Sadhana",
            "diwali" to "Diwali Sadhana Week",
            "remedies" to "Remedies & Upayas",
            "trilok_nagri" to "Trilok Nagri Access",
            "three_diya" to "Three Diya Process",
            "court_cases" to "Court Cases Remedy",
            "business_money" to "Business & Money Remedy",
            "mantras" to "Siddh Mantras",
            "issues" to "Spiritual Issues",
            "removing_negativity" to "Removing Negativity",
            "spiritual_progress" to "Spiritual Progress",
            "material_benefits" to "Material Benefits",
            "healing_illness" to "Healing from Illness",
            "information" to "Information",
            "courses" to "Course Information",
            "bakhoor" to "Bakhoor & Incense",
            "settings" to "Settings & Config",
            "contact" to "Get In Touch",
            "faq" to "FAQ",
            "notice_title" to "Today's Sacred Notice & Guidance",
            "todo_title" to "Sadhana & Remedy Checklist",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "Instant AI guidance for Three Diya, Yantras, sadhanas & mantras",
            "open_chat" to "Open Chat",
            "msgbot_title" to "MsgBot Lineage Chat",
            "msgbot_subtitle" to "WhatsApp-style chat with mentor & downline with photo/audio/video",
            "ref_code" to "16-Digit Reference Code",
            "sponsor" to "Sponsor",
            "level" to "Level",
            "edit" to "Edit",
            "delete" to "Delete",
            "transfer" to "Transfer",
            "cancel" to "Cancel",
            "save" to "Save",
            "share" to "Share App",
            "check_updates" to "Check for Updates",
            "language_select" to "Language & Localization (भाषा)"
        ),

        // HINDI
        "hi" to mapOf(
            "app_title" to "स्पिरिचुअल करीम",
            "app_subtitle" to "एक आध्यात्मिक आत्मा • एक सच्चे मार्गदर्शक",
            "tab_user" to "उपयोगकर्ता केंद्र",
            "tab_spiritual" to "आध्यात्मिक",
            "home" to "मुख्य पृष्ठ",
            "about" to "हमारे बारे में",
            "free_solution" to "मुफ्त समाधान",
            "healers" to "हीलर और संगठन",
            "healers_hub" to "हीलर पोर्टल",
            "hierarchy_tree" to "5-स्तरीय पदानुक्रम वृक्ष",
            "admin_healers" to "व्यवस्थापक और हीलर",
            "trainees" to "प्रशिक्षु",
            "devotees" to "भक्तगण",
            "sadhanas" to "साधनाएं",
            "sri_yantra" to "श्री यंत्र साधना",
            "kalashtami" to "कालाष्टमी साधना",
            "navratri" to "नवरात्रि साधना",
            "diwali" to "दीपावली साधना सप्ताह",
            "remedies" to "उपाय और निवारण",
            "trilok_nagri" to "त्रिलोक नगरी पहुंच",
            "three_diya" to "तीन दीपक प्रक्रिया",
            "court_cases" to "कोर्ट केस निवारण उपाय",
            "business_money" to "व्यापार और धन उपाय",
            "mantras" to "सिद्ध मंत्र",
            "issues" to "आध्यात्मिक समस्याएं",
            "removing_negativity" to "नकारात्मकता निवारण",
            "spiritual_progress" to "आध्यात्मिक उन्नति",
            "material_benefits" to "भौतिक लाभ",
            "healing_illness" to "रोग निवारण व हीलिंग",
            "information" to "जानकारी",
            "courses" to "पाठ्यक्रम जानकारी",
            "bakhoor" to "बखूर और धूप",
            "settings" to "सेटिंग्स और विन्यास",
            "contact" to "संपर्क करें",
            "faq" to "प्रश्नोत्तरी (FAQ)",
            "notice_title" to "आज का पावन संदेश एवं मार्गदर्शन",
            "todo_title" to "दैनिक साधना और उपाय सूची",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "तीन दीपक, श्री यंत्र, साधना और सिद्ध मंत्रों के लिए त्वरित AI मार्गदर्शन",
            "open_chat" to "चैट खोलें",
            "msgbot_title" to "MsgBot वंशानुक्रम चैट",
            "msgbot_subtitle" to "मार्गदर्शक और टीम के साथ व्हाट्सएप जैसी चैट (फोटो, ऑडियो, वीडियो सहित)",
            "ref_code" to "16-अंकीय संदर्भ कोड",
            "sponsor" to "प्रायोजक (गुरु)",
            "level" to "स्तर",
            "edit" to "संपादित करें",
            "delete" to "हटाएं",
            "transfer" to "स्थानांतरित करें",
            "cancel" to "रद्द करें",
            "save" to "सहेजें",
            "share" to "ऐप साझा करें",
            "check_updates" to "अपडेट जांचें",
            "language_select" to "भाषा चयन (Language)"
        ),

        // BENGALI
        "bn" to mapOf(
            "app_title" to "স্পিরিচুয়াল করিম",
            "app_subtitle" to "একটি আধ্যাত্মিক আত্মা • একজন সত্যিকারের পরামর্শদাতা",
            "tab_user" to "ব্যবহারকারী হাব",
            "tab_spiritual" to "আধ্যাত্মিক",
            "home" to "হোম",
            "about" to "আমাদের সম্পর্কে",
            "free_solution" to "বিনামূল্যে সমাধান",
            "healers" to "হিলার এবং সংস্থা",
            "healers_hub" to "হিলার পোর্টাল",
            "hierarchy_tree" to "৫-স্তরের অনুক্রম গাছ",
            "admin_healers" to "প্রশাসক ও হিলার",
            "trainees" to "প্রশিক্ষার্থী",
            "devotees" to "ভক্তগণ",
            "sadhanas" to "সাধনা",
            "remedies" to "উপায় ও প্রতিকার",
            "mantras" to "সিদ্ধ মন্ত্র",
            "issues" to "আধ্যাত্মিক সমস্যা",
            "information" to "তথ্য",
            "settings" to "সেটিংস",
            "contact" to "যোগাযোগ",
            "faq" to "প্রশ্নোত্তর",
            "notice_title" to "আজকের পবিত্র বার্তা",
            "todo_title" to "সাধনা ও প্রতিকার তালিকা",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "সাধনা এবং উপায়ের জন্য এআই নির্দেশনা",
            "open_chat" to "চ্যাট খুলুন",
            "msgbot_title" to "MsgBot চ্যাট",
            "ref_code" to "১৬-সংখ্যার রেফারেন্স কোড"
        ),

        // MARATHI
        "mr" to mapOf(
            "app_title" to "स्पिरिच्युअल करीम",
            "app_subtitle" to "एक आध्यात्मिक आत्मा • एक खरा मार्गदर्शक",
            "tab_user" to "वापरकर्ता केंद्र",
            "tab_spiritual" to "आध्यात्मिक",
            "home" to "मुख्यपृष्ठ",
            "about" to "आमच्याबद्दल",
            "free_solution" to "मोफत उपाय",
            "healers" to "हीलर व संस्था",
            "healers_hub" to "हीलर पोर्टल",
            "hierarchy_tree" to "५-स्तरीय रचना वृक्ष",
            "admin_healers" to "प्रशासक आणि हीलर्स",
            "trainees" to "प्रशिक्षणार्थी",
            "devotees" to "भक्तगण",
            "sadhanas" to "साधना",
            "remedies" to "उपाय आणि तोडगे",
            "mantras" to "सिद्ध मंत्र",
            "issues" to "आध्यात्मिक समस्या",
            "information" to "माहिती",
            "settings" to "सेटिंग्ज",
            "contact" to "संपर्क",
            "faq" to "प्रश्नोत्तरे",
            "notice_title" to "आजचा पावन संदेश",
            "todo_title" to "दैनिक साधना आणि उपाय यादी",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "साधना आणि उपायांसाठी झटपट AI मार्गदर्शन",
            "open_chat" to "चॅट उघडा",
            "msgbot_title" to "MsgBot संवाद",
            "ref_code" to "१६-अंकी संदर्भ कोड"
        ),

        // GUJARATI
        "gu" to mapOf(
            "app_title" to "સ્પિરિચ્યુઅલ કરીમ",
            "app_subtitle" to "એક આધ્યાત્મિક આત્મા • સાચા માર્ગદર્શક",
            "tab_user" to "યુઝર હબ",
            "tab_spiritual" to "આધ્યાત્મિક",
            "home" to "હોમ",
            "about" to "અમારા વિશે",
            "free_solution" to "મફત ઉકેલ",
            "healers" to "હીલર્સ અને સંસ્થા",
            "healers_hub" to "હીલર પોર્ટલ",
            "hierarchy_tree" to "૫-સ્તરીય વૃક્ષ",
            "admin_healers" to "એડમિન અને હીલર્સ",
            "trainees" to "તાલીમાર્થી",
            "devotees" to "ભક્તો",
            "sadhanas" to "સાધનાઓ",
            "remedies" to "ઉપાયો અને નિવારણ",
            "mantras" to "સિદ્ધ મંત્રો",
            "issues" to "આધ્યાત્મિક સમસ્યાઓ",
            "information" to "માહિતી",
            "settings" to "સેટિંગ્સ",
            "contact" to "સંપર્ક",
            "faq" to "પ્રશ્નોત્તરી",
            "notice_title" to "આજનો પવિત્ર સંદેશ",
            "todo_title" to "દૈનિક સાધના અને ઉપાય યાદી",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "સાધના અને ઉપાય માટે ત્વરિત AI માર્ગદર્શન",
            "open_chat" to "ચેટ ખોલો",
            "msgbot_title" to "MsgBot ચેટ",
            "ref_code" to "૧૬-અંકનો રેફરન્સ કોડ"
        ),

        // TAMIL
        "ta" to mapOf(
            "app_title" to "ஸ்பிரிச்சுவல் கரீம்",
            "app_subtitle" to "ஒரு ஆன்மீக ஆத்மா • உண்மையான வழிகாட்டி",
            "tab_user" to "பயனர் தளம்",
            "tab_spiritual" to "ஆன்மீகம்",
            "home" to "முகப்பு",
            "about" to "எங்களை பற்றி",
            "free_solution" to "இலவச தீர்வு",
            "healers" to "ஹீலர்கள் மற்றும் அமைப்பு",
            "healers_hub" to "ஹீலர் போர்டல்",
            "hierarchy_tree" to "5-அடுக்கு மர அமைப்பு",
            "sadhanas" to "சாதனைகள்",
            "remedies" to "பரிகாரங்கள்",
            "mantras" to "சித்த மந்திரங்கள்",
            "issues" to "ஆன்மீக சிக்கல்கள்",
            "settings" to "அமைப்புகள்",
            "contact" to "தொடர்பு",
            "faq" to "அடிக்கடி கேட்கப்படும் கேள்விகள்",
            "notice_title" to "இன்றைய புனித அறிவிப்பு",
            "todo_title" to "தினசரி சாதனை பட்டியல்",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "சாதனைகள் மற்றும் பரிகாரங்களுக்கான உடனடி AI வழிகாட்டுதல்",
            "open_chat" to "அரட்டை திறக்கவும்",
            "msgbot_title" to "MsgBot அரட்டை",
            "ref_code" to "16-இலக்க குறிப்பு குறியீடு"
        ),

        // TELUGU
        "te" to mapOf(
            "app_title" to "స్పిరిచువల్ కరీమ్",
            "app_subtitle" to "ఆధ్యాత్మిక ఆత్మ • నిజమైన మార్గదర్శి",
            "tab_user" to "యూజర్ హబ్",
            "tab_spiritual" to "ఆధ్యాత్మికం",
            "home" to "హోమ్",
            "about" to "మా గురించి",
            "free_solution" to "ఉచిత పరిష్కారం",
            "healers" to "హీలింగ్ మరియు సంస్థ",
            "healers_hub" to "హీలర్ పోర్టల్",
            "hierarchy_tree" to "5-స్థాయి వృక్షం",
            "sadhanas" to "సాధనలు",
            "remedies" to "పరిష్కారాలు",
            "mantras" to "సిద్ధ మంత్రాలు",
            "issues" to "ఆధ్యాత్మిక సమస్యలు",
            "settings" to "సెట్టింగులు",
            "contact" to "సంప్రదించండి",
            "faq" to "ప్రశ్నోత్తరాలు",
            "notice_title" to "నేటి పవిత్ర సందేశం",
            "todo_title" to "రోజువారీ సాధనా జాబితా",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "సాధనల కోసం AI మార్గదర్శకత్వం",
            "open_chat" to "చాట్ తెరవండి",
            "msgbot_title" to "MsgBot చాట్",
            "ref_code" to "16-అంకెల రిఫరెన్స్ కోడ్"
        ),

        // KANNADA
        "kn" to mapOf(
            "app_title" to "ಸ್ಪಿರಿಚುಯಲ್ ಕರೀಮ್",
            "app_subtitle" to "ಆಧ್ಯಾತ್ಮಿಕ ಆತ್ಮ • ನಿಜವಾದ ಮಾರ್ಗದರ್ಶಿ",
            "tab_user" to "ಬಳಕೆದಾರ ಕೇಂದ್ರ",
            "tab_spiritual" to "ಆಧ್ಯಾತ್ಮಿಕ",
            "home" to "ಮುಖಪುಟ",
            "about" to "ನಮ್ಮ ಬಗ್ಗೆ",
            "free_solution" to "ಉಚಿತ ಪರಿಹಾರ",
            "healers" to "ಹೀಲರ್‌ಗಳು ಮತ್ತು ಸಂಸ್ಥೆ",
            "sadhanas" to "ಸಾಧನೆಗಳು",
            "remedies" to "ಪರಿಹಾರಗಳು",
            "mantras" to "ಸಿದ್ಧ ಮಂತ್ರಗಳು",
            "issues" to "ಆಧ್ಯಾತ್ಮಿಕ ಸಮಸ್ಯೆಗಳು",
            "settings" to "ಸಂಯೋಜನೆಗಳು",
            "notice_title" to "ಇಂದಿನ ಸಂದೇಶ",
            "todo_title" to "ದೈನಂದಿನ ಸಾಧನಾ ಪಟ್ಟಿ",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "ಸಾಧನೆ ಮತ್ತು ಪರಿಹಾರಗಳಿಗೆ ತ್ವರಿತ AI ಮಾರ್ಗದರ್ಶನ",
            "open_chat" to "ಸಂಭಾಷಣೆ ತೆರೆಯಿರಿ",
            "msgbot_title" to "MsgBot ಸಂಭಾಷಣೆ",
            "ref_code" to "16-ಅಂಕಿಯ ಕೋಡ್"
        ),

        // MALAYALAM
        "ml" to mapOf(
            "app_title" to "സ്പിരിച്വൽ കരീം",
            "app_subtitle" to "ഒരു ആത്മീയ ആത്മാവ് • സത്യസന്ധനായ വഴികാട്ടി",
            "tab_user" to "യൂസർ ഹബ്ബ്",
            "tab_spiritual" to "ആത്മീയത",
            "home" to "ഹോം",
            "about" to "ഞങ്ങളെക്കുറിച്ച്",
            "free_solution" to "സൗജന്യ പരിഹാരം",
            "healers" to "ഹീലർമാർ",
            "sadhanas" to "സാധനകൾ",
            "remedies" to "പരിഹാരങ്ങൾ",
            "mantras" to "സിദ്ധ മന്ത്രങ്ങൾ",
            "issues" to "ആത്മീയ പ്രശ്നങ്ങൾ",
            "settings" to "സെറ്റിംഗ്സ്",
            "notice_title" to "ഇന്നത്തെ സന്ദേശം",
            "todo_title" to "ദൈനംദിന സാധനാ പട്ടിക",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "സാധനകൾക്ക് തത്സമയ AI മാർഗ്ഗനിർദ്ദേശം",
            "open_chat" to "ചാറ്റ് തുറക്കുക",
            "msgbot_title" to "MsgBot ചാറ്റ്",
            "ref_code" to "16-അക്ക റഫറൻസ് കോഡ്"
        ),

        // PUNJABI
        "pa" to mapOf(
            "app_title" to "ਸਪਿਰਿਚੁਅਲ ਕਰੀਮ",
            "app_subtitle" to "ਇੱਕ ਰੂਹਾਨੀ ਆਤਮਾ • ਸੱਚਾ ਮਾਰਗਦਰਸ਼ਕ",
            "tab_user" to "ਯੂਜ਼ਰ ਹੱਬ",
            "tab_spiritual" to "ਰੂਹਾਨੀਅਤ",
            "home" to "ਮੁੱਖ ਪੰਨਾ",
            "about" to "ਸਾਡੇ ਬਾਰੇ",
            "free_solution" to "ਮੁਫਤ ਹੱਲ",
            "healers" to "ਹੀਲਰ ਅਤੇ ਸੰਗਠਨ",
            "sadhanas" to "ਸਾਧਨਾਵਾਂ",
            "remedies" to "ਉਪਾਅ ਅਤੇ ਇਲਾਜ",
            "mantras" to "ਸਿੱਧ ਮੰਤਰ",
            "issues" to "ਰੂਹਾਨੀ ਮਸਲੇ",
            "settings" to "ਸੈਟਿੰਗਜ਼",
            "notice_title" to "ਅੱਜ ਦਾ ਸੁਨੇਹਾ",
            "todo_title" to "ਰੋਜ਼ਾਨਾ ਸਾਧਨਾ ਸੂਚੀ",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "ਸਾਧਨਾ ਅਤੇ ਉਪਾਵਾਂ ਲਈ ਤੁਰੰਤ AI ਮਾਰਗਦਰਸ਼ਨ",
            "open_chat" to "ਚੈਟ ਖੋਲ੍ਹੋ",
            "msgbot_title" to "MsgBot ਗੱਲਬਾਤ",
            "ref_code" to "16-ਅੰਕੀ ਰੈਫਰੈਂਸ ਕੋਡ"
        ),

        // ODIA
        "or" to mapOf(
            "app_title" to "ସ୍ପିରିଚୁଆଲ୍ କରିମ୍",
            "app_subtitle" to "ଏକ ଆଧ୍ୟାତ୍ମିକ ଆତ୍ମା • ଜଣେ ପ୍ରକୃତ ମାର୍ଗଦର୍ଶକ",
            "tab_user" to "ୟୁଜର ହବ୍",
            "tab_spiritual" to "ଆଧ୍ୟାତ୍ମିକ",
            "home" to "ମୁଖ୍ୟ ପୃଷ୍ଠା",
            "about" to "ଆମ ବିଷୟରେ",
            "free_solution" to "ନିଃଶୁଳ୍କ ସମାଧାନ",
            "healers" to "ହିଲର୍ସ ଏବଂ ସଙ୍ଗଠନ",
            "sadhanas" to "ସାଧନା",
            "remedies" to "ପ୍ରତିକାର",
            "mantras" to "ସିଦ୍ଧ ମନ୍ତ୍ର",
            "issues" to "ଆଧ୍ୟାତ୍ମିକ ସମସ୍ୟା",
            "settings" to "ସେଟିଙ୍ଗ୍",
            "notice_title" to "ଆଜିର ପବିତ୍ର ସନ୍ଦେଶ",
            "todo_title" to "ଦୈନିକ ସାଧନା ତାଲିକା",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "ସାଧନା ଏବଂ ଉପାୟ ପାଇଁ AI ମାର୍ଗଦର୍ଶନ",
            "open_chat" to "ଚାଟ୍ ଖୋଲନ୍ତୁ",
            "msgbot_title" to "MsgBot ଚାଟ୍",
            "ref_code" to "୧୬-ଅଙ୍କ ବିଶିଷ୍ଟ କୋଡ୍"
        ),

        // SPANISH
        "es" to mapOf(
            "app_title" to "Spiritual Karim",
            "app_subtitle" to "Un Alma Espiritual • Un Verdadero Mentor",
            "tab_user" to "Centro de Usuario",
            "tab_spiritual" to "Espiritual",
            "home" to "Inicio",
            "about" to "Sobre Nosotros",
            "free_solution" to "Solución Gratuita",
            "healers" to "Sanadores y Organización",
            "healers_hub" to "Portal de Sanadores",
            "hierarchy_tree" to "Árbol Jerárquico de 5 Niveles",
            "admin_healers" to "Administrador y Sanadores",
            "trainees" to "Aprendices",
            "devotees" to "Devotos",
            "sadhanas" to "Sadhanas",
            "remedies" to "Remedios y Upayas",
            "mantras" to "Mantras Siddh",
            "issues" to "Problemas Espirituales",
            "information" to "Información",
            "settings" to "Configuración",
            "contact" to "Contacto",
            "faq" to "Preguntas Frecuentes",
            "notice_title" to "Aviso Sagrado y Guía de Hoy",
            "todo_title" to "Lista de Sadhana y Remedios",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "Orientación instantánea de IA para Three Diya, Yantras y Mantras",
            "open_chat" to "Abrir Chat",
            "msgbot_title" to "Chat MsgBot",
            "ref_code" to "Código de Referencia de 16 Dígitos"
        ),

        // FRENCH
        "fr" to mapOf(
            "app_title" to "Spiritual Karim",
            "app_subtitle" to "Une Âme Spirituelle • Un Vrai Mentor",
            "tab_user" to "Espace Utilisateur",
            "tab_spiritual" to "Spirituel",
            "home" to "Accueil",
            "about" to "À Propos",
            "free_solution" to "Solution Gratuite",
            "healers" to "Guérisseurs & Organisation",
            "healers_hub" to "Portail des Guérisseurs",
            "hierarchy_tree" to "Arbre Hiérarchique à 5 Niveaux",
            "sadhanas" to "Sadhanas",
            "remedies" to "Remèdes",
            "mantras" to "Mantras Siddh",
            "issues" to "Problèmes Spirituels",
            "information" to "Information",
            "settings" to "Paramètres",
            "contact" to "Contact",
            "faq" to "FAQ",
            "notice_title" to "Message Sacré du Jour",
            "todo_title" to "Liste des Sadhanas & Remèdes",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "Conseils instantanés par IA pour Sadhanas et Mantras",
            "open_chat" to "Ouvrir le Chat",
            "msgbot_title" to "Discussion MsgBot",
            "ref_code" to "Code de Référence à 16 Chiffres"
        ),

        // GERMAN
        "de" to mapOf(
            "app_title" to "Spiritual Karim",
            "app_subtitle" to "Eine spirituelle Seele • Ein wahrer Mentor",
            "tab_user" to "Benutzerzentrum",
            "tab_spiritual" to "Spannkraft & Geist",
            "home" to "Startseite",
            "about" to "Über Uns",
            "free_solution" to "Kostenlose Lösung",
            "healers" to "Heiler & Organisation",
            "healers_hub" to "Heiler-Portal",
            "hierarchy_tree" to "5-Ebenen-Hierarchiebaum",
            "sadhanas" to "Sadhanas",
            "remedies" to "Abhilfen & Rituale",
            "mantras" to "Siddh Mantras",
            "issues" to "Spirituelle Probleme",
            "information" to "Informationen",
            "settings" to "Einstellungen",
            "contact" to "Kontakt",
            "faq" to "FAQ",
            "notice_title" to "Heilige Tagesbotschaft",
            "todo_title" to "Sadhana & Abhilfe Checkliste",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "Sofortige KI-Führung für Sadhanas und Mantras",
            "open_chat" to "Chat Öffnen",
            "msgbot_title" to "MsgBot Chat",
            "ref_code" to "16-stelliger Referenzcode"
        ),

        // ARABIC
        "ar" to mapOf(
            "app_title" to "كريم الروحاني",
            "app_subtitle" to "روح روحانية • مرشد حقيقي",
            "tab_user" to "مركز المستخدم",
            "tab_spiritual" to "روحاني",
            "home" to "الرئيسية",
            "about" to "معلومات عنا",
            "free_solution" to "حل مجاني",
            "healers" to "المعالجون والمنظمة",
            "healers_hub" to "بوابة المعالجين",
            "hierarchy_tree" to "شجرة تنظيمية من 5 مستويات",
            "sadhanas" to "السادهانا والأذكار",
            "remedies" to "العلاجات الروحية",
            "mantras" to "الترانيم والمانترا",
            "issues" to "المسائل الروحية",
            "information" to "معلومات",
            "settings" to "الإعدادات",
            "contact" to "اتصل بنا",
            "faq" to "الأسئلة الشائعة",
            "notice_title" to "رسالة وتوجيه اليوم المقدس",
            "todo_title" to "قائمة السادهانا والعلاجات",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "إرشاد فوري بالذكاء الاصطناعي للسادهانا والمانترا",
            "open_chat" to "فتح المحادثة",
            "msgbot_title" to "محادثة MsgBot",
            "ref_code" to "رمز مرجعي من 16 رقماً"
        ),

        // RUSSIAN
        "ru" to mapOf(
            "app_title" to "Духовный Карим",
            "app_subtitle" to "Духовная Душа • Истинный Наставник",
            "tab_user" to "Кабинет Пользователя",
            "tab_spiritual" to "Духовное",
            "home" to "Главная",
            "about" to "О нас",
            "free_solution" to "Бесплатное Решение",
            "healers" to "Целители и Организация",
            "healers_hub" to "Портал Целителей",
            "hierarchy_tree" to "5-уровневое Дерево Иерархии",
            "sadhanas" to "Садханы",
            "remedies" to "Средства и Ритуалы",
            "mantras" to "Сиддха Мантры",
            "issues" to "Духовные Проблемы",
            "information" to "Информация",
            "settings" to "Настройки",
            "contact" to "Связаться",
            "faq" to "Вопросы и Ответы",
            "notice_title" to "Священное Послание Дня",
            "todo_title" to "Список Садхан и Ритуалов",
            "chatbot_title" to "Ask Guidance on Sadhana and Remidies",
            "chatbot_subtitle" to "Мгновенное руководство ИИ по Садханам и Мантрам",
            "open_chat" to "Открыть Чат",
            "msgbot_title" to "Чат MsgBot",
            "ref_code" to "16-значный Код"
        )
    )

    /**
     * Get translated string with automatic English fallback.
     * Reading `currentLanguage` ensures reactive Composable recomposition upon language switch!
     */
    fun getString(key: String): String {
        val lang = currentLanguage
        val langMap = translations[lang.code] ?: translations["en"]!!
        return langMap[key] ?: translations["en"]?.get(key) ?: key
    }

    // =========================================================================
    // OFFLINE LANGUAGE PACKS & ON-DEMAND DOWNLOAD MANAGEMENT
    // =========================================================================

    var downloadedLanguageCodes by mutableStateOf(setOf("en", "hi"))

    fun isLanguageDownloaded(lang: AppLanguage): Boolean {
        return lang.code == "en" || downloadedLanguageCodes.contains(lang.code)
    }

    fun markLanguageDownloaded(lang: AppLanguage) {
        downloadedLanguageCodes = downloadedLanguageCodes + lang.code
    }

    fun removeLanguagePack(lang: AppLanguage) {
        if (lang.code != "en") {
            downloadedLanguageCodes = downloadedLanguageCodes - lang.code
        }
    }

    fun getLanguagePackSize(lang: AppLanguage): String {
        return when (lang.code) {
            "en" -> "Bundled (Core)"
            "hi" -> "Installed (21.8 MB)"
            "bn", "mr", "gu", "ta", "te", "kn", "ml", "pa", "or" -> "22.4 MB (Indian Pack)"
            else -> "24.6 MB (World Pack)"
        }
    }
}
