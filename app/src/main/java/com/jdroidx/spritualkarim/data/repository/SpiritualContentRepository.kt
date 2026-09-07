package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.*
import com.jdroidx.spritualkarim.navigation.Screen

object SpiritualContentRepository {

    const val HELPLINE_PHONE = "+918087827555"
    const val TELEGRAM_CHANNEL = "https://t.me/spiritualkarim369"
    const val YOUTUBE_CHANNEL = "https://www.youtube.com/@spiritualkarim"
    const val WEBSITE_URL = "https://spiritualkarim.com/"

    // ==========================================
    // SADHANAS
    // ==========================================
    val sadhanas = listOf(
        SadhanaItem(
            id = "sri_yantra",
            title = "Sri Yantra Sadhana",
            subtitle = "Sacred Geometry for Divine Abundance & Cosmic Harmony",
            deity = "Maa Tripurasundari / Mahalakshmi",
            duration = "45 Days Sadhana Cycle",
            auspiciousTime = "Brahma Muhurta (4:00 AM - 5:30 AM) or Friday Evening",
            rules = listOf(
                "Maintain strict Brahmacharya and satvik diet throughout the sadhana.",
                "Place the consecrated Sri Yantra on red or yellow silk cloth facing East or North.",
                "Clean the yantra daily with panchamrit (milk, curd, honey, ghee, gangajal) and wipe gently.",
                "Light a pure cow ghee lamp and fragrant Bakhoor / Guggal dhoop.",
                "Keep your sadhana intentions pure, humble, and aligned with dharma."
            ),
            mantras = listOf(
                "Om Shreem Hreem Shreem Kamale Kamalalaye Praseed Praseed",
                "Om Shreem Hreem Shreem Mahalakshmaye Namah",
                "Ka E I La Hreem - Ha Sa Ka Ha La Hreem - Sa Ka La Hreem (Maha Shodashi Mantra)"
            ),
            materials = listOf(
                "Authentic 3D Meru Sri Yantra or Copper/Silver Engraved Yantra",
                "Pure Cow Ghee Diya",
                "Kumkum, Sandalwood Paste & Akshat (unbroken rice)",
                "Red Lotus or Fresh Fragrant Flowers",
                "Lotus Seed (Kamal Gatta) Japa Mala"
            ),
            steps = listOf(
                "Perform Aachaman, Pavithreekaran, and Pranayama to still the breath and purify the body.",
                "Establish the Sri Yantra on an energized pedestal with Kumkum and Akshat.",
                "Offer panchopchar pooja: Gandha (Sandalwood), Pushpa (Flowers), Dhoopa (Incense), Deepa (Ghee Lamp), Naivedya (Kheer/Fruits).",
                "Perform Nyasa and invoke the 9 circuits (Avaranas) of the Sri Yantra with sincere devotion.",
                "Chant 5 or 11 malas of the Sri Vidya / Mahalakshmi Beej Mantra on Kamal Gatta Mala.",
                "Conclude with Aarti, Kshama Prarthana (seeking forgiveness for unintended errors), and silent contemplation of the Bindu."
            ),
            significance = "Sri Yantra represents the cosmic union of Shiva and Shakti. It harmonizes energy fields in the home, removes lingering poverty and debt, attracts opportunities, and opens the gateway to self-realization.",
            route = Screen.SriYantra.route
        ),
        SadhanaItem(
            id = "kalashtami",
            title = "Kalashtami Sadhana",
            subtitle = "Kaal Bhairav Invocation for Fearlessness & Enemy Protection",
            deity = "Lord Kaal Bhairav",
            duration = "Observed on Ashtami Tithi of Krishna Paksha (Monthly)",
            auspiciousTime = "Nishita Kaal (11:30 PM - 12:45 AM) or Sunset",
            rules = listOf(
                "Observed strictly on Krishna Paksha Ashtami of every Hindu lunar month.",
                "Wear black or dark blue clothes; sit on a woollen or kusha asana facing South or East.",
                "Feed black dogs with sweet rotis, milk, or boiled eggs before/after sadhana.",
                "Never use Kaal Bhairav sadhana for harming innocents; it acts as a divine shield."
            ),
            mantras = listOf(
                "Om Hreem Kaal Bhairavaya Namaha",
                "Om Bram Kaal Bhairavaya Phat",
                "Dharani-Garbha-Sambhutam Vidyut-Kanti-Samaprabham (Kaal Bhairav Ashtakam)"
            ),
            materials = listOf(
                "Mustard Oil (Sarson ka tel) Diya with four wicks (Choumukha)",
                "Black Sesame Seeds (Til), Mustard Seeds, and Black Urad",
                "Red Kaner or Blue Aparajita Flowers",
                "Rudraksha Japa Mala (Energized)"
            ),
            steps = listOf(
                "Purify the sadhana room by burning Bakhoor or Loban to banish negative entities.",
                "Light the four-sided Mustard Oil Diya in front of Kaal Bhairav Yantra / Image.",
                "Recite the Kaal Bhairav Ashtakam with focused devotion.",
                "Chant 11 malas of 'Om Hreem Kaal Bhairavaya Namaha' with a consecrated Rudraksha mala.",
                "Offer black sesame and mustard seeds into the sacred havan or lamp flame.",
                "Perform protection kavach mantra and offer prasad to stray dogs next morning."
            ),
            significance = "Kaal Bhairav is the master of time and supreme protector. This sadhana destroys deep-seated phobias, removes evil eye (buri nazar), neutralizes black magic attacks, and overcomes court obstacles.",
            route = Screen.Kalashtami.route
        ),
        SadhanaItem(
            id = "navratri",
            title = "Navratri Sadhana – Chamunda Mata",
            subtitle = "9 Days Fierce Transformation & Divine Shield",
            deity = "Maa Chamunda / Navdurga",
            duration = "9 Consecutive Days (Chaitra or Sharadiya Navratri)",
            auspiciousTime = "Early Morning & Sandhya (Twilight)",
            rules = listOf(
                "Observe complete fasting or Phalahar diet for the duration.",
                "Maintain continuous Akhand Jyoti if possible or light morning/evening ghee diya.",
                "Recite Durga Saptashati / Argala / Keelak / Kavach daily.",
                "Avoid leather, negative speech, and worldly distractions."
            ),
            mantras = listOf(
                "Om Aim Hreem Kleem Chamundaye Vichche",
                "Sarva Mangala Mangalye Shive Sarvartha Sadhike Sharanye Tryambake Gauri Narayani Namostute"
            ),
            materials = listOf(
                "Ghatasthapana Pot with holy water, mango leaves, and coconut",
                "Barley seeds (Jowar) for sowing in clay pot",
                "Pure cow ghee, camphor, cloves, cardamom for daily havan",
                "Red Chunri, Bangles, and Solah Shringar offerings"
            ),
            steps = listOf(
                "Perform Ghatasthapana on Pratipada tithi with Vedic mantras.",
                "Light the sacred flame and invite the 9 forms of Maa Durga.",
                "Chant Navarna Mantra ('Om Aim Hreem Kleem Chamundaye Vichche') for 11 malas daily.",
                "Recite Durga Saptashati chapters sequentially over the 9 days.",
                "Perform daily mini-havan offering cloves dipped in ghee.",
                "On Ashtami/Navami, conduct Kanya Pujan and offer food, gifts, and respect to young girls."
            ),
            significance = "Chamunda Mata Sadhana burns past karmic blockages, shields against psychic attacks, brings radiant vitality, and bestows supreme spiritual strength.",
            route = Screen.Navratri.route
        ),
        SadhanaItem(
            id = "diwali",
            title = "Diwali Sadhana Week",
            subtitle = "Night of Supreme Illumination & Maha Lakshmi Invocation",
            deity = "Maa Mahalakshmi, Lord Ganesha & Lord Kuber",
            duration = "5 Days (Dhanteras to Bhai Dooj)",
            auspiciousTime = "Maha Nishita Kaal & Pradosh Kaal on Diwali Night",
            rules = listOf(
                "Deep clean the house thoroughly before Dhanteras to remove stale negative energies.",
                "Keep all entrances well lit with brass or clay diyas filled with sesame or ghee.",
                "Perform Lakshmi Kuber Puja during the auspicious Sthir Lagna (Taurus / Vrishabha).",
                "Keep account books, safe locker keys, and gold coins in the puja mandap."
            ),
            mantras = listOf(
                "Om Shreem Hreem Kleem Shreem Kleem Vitteshwaraya Namah (Kuber Mantra)",
                "Om Hreem Shreem Kleem Maha Lakshmi Namaha",
                "Om Gam Ganapataye Namaha"
            ),
            materials = listOf(
                "Silver or Terracotta Lakshmi-Ganesha Idols",
                "11 Energized Gomti Chakras & 11 Yellow Kauri Shells",
                "Kamal Gatta (Lotus seeds) & Supari",
                "Fresh Lotus flowers, Sweets, and Kheer"
            ),
            steps = listOf(
                "Start on Dhanteras by purchasing brass/silver vessel and performing Kuber puja.",
                "On Chhoti Diwali (Narak Chaturdashi), light 14 oil lamps to ward off negative spirits.",
                "On Diwali night, install energized Lakshmi Yantra and Kuber Yantra.",
                "Chant 11 malas of Kuber Mantra and 21 malas of Lakshmi Beej Mantra on Kamal Gatta mala.",
                "Perform Havan with kheer, kamal gatta, and dry fruits.",
                "Tie the Gomti Chakras and yellow kauris in a red cloth and place in your cash safe/locker."
            ),
            significance = "Diwali night holds supreme occult energy for generating perennial wealth, removing poverty (Daridrata), blessing commercial ventures, and securing steady financial growth.",
            route = Screen.Diwali.route
        )
    )

    // ==========================================
    // REMEDIES & UPAYAS
    // ==========================================
    val remedies = listOf(
        RemedyItem(
            id = "three_diya",
            title = "Three Diya Process",
            category = "Cleansing & Protection",
            purpose = "Eliminate heavy negative energies, bad luck, domestic conflict, and spiritual heaviness from home.",
            materials = listOf(
                "3 Earthen Clay Diyas (Mitti ke diye)",
                "Diya 1: Pure Cow Ghee with cotton wick",
                "Diya 2: Pure Mustard Oil (Sarson tel) with cotton wick",
                "Diya 3: Pure Sesame Oil (Til tel) with cotton wick",
                "Pinch of Camphor, 2 Cloves, and a pinch of Black Mustard Seeds"
            ),
            procedure = listOf(
                "Perform this remedy after sunset between 7:00 PM and 9:00 PM.",
                "Arrange the 3 Diyas in a triangle on a clean plate outside your main entrance or puja area.",
                "Light all three diyas starting from Ghee (Center), Sesame (Right), and Mustard (Left).",
                "Add 2 cloves in the mustard oil diya and camphor in the ghee diya.",
                "Recite Hanuman Chalisa or Gayatri Mantra 3 times while sitting near the lamps.",
                "Let the lamps burn out naturally. Next morning, discard leftover ashes/residue under a tree or running water.",
                "Repeat every Tuesday and Saturday for 3 consecutive weeks."
            ),
            precautions = listOf(
                "Do not blow out the diyas with your breath.",
                "Keep away from curtains and flammable items.",
                "Maintain a peaceful and prayerful mindset during the process."
            ),
            bestDay = "Tuesdays & Saturdays after Sunset",
            route = Screen.ThreeDiya.route
        ),
        RemedyItem(
            id = "trilok_nagri",
            title = "Trilok Nagri Access",
            category = "Astral & Mystic Remedy",
            purpose = "Open spiritual awareness, connect to higher astral realms, and receive divine guidance in dreams.",
            materials = listOf(
                "Natural Bakhoor / Guggal Incense",
                "Copper Vessel with fresh water and basil (Tulsi) leaves",
                "White Candle or Desi Ghee Lamp",
                "Kusha or White Woollen Asana"
            ),
            procedure = listOf(
                "Sit in a quiet, dark room at midnight (11:45 PM).",
                "Burn the sacred Bakhoor incense to cleanse ambient astral pollution.",
                "Place the water vessel in front of you and gaze into the still reflection while breathing deeply.",
                "Chant the Third Eye activation sound 'AUM' 21 times vibrating at the brow center (Ajna Chakra).",
                "Focus on the space between eyebrows with eyes gently closed.",
                "Visualize a golden bridge leading into the luminous sphere of Trilok Nagri.",
                "Formulate your spiritual question clearly in mind and remain silent in receptivity for 20 minutes."
            ),
            precautions = listOf(
                "Do not attempt if feeling extreme fear, anger, or intoxication.",
                "Always close the meditation with a grounding prayer thanking the guardian spirits."
            ),
            bestDay = "Full Moon (Purnima) or Amavasya Midnight",
            route = Screen.TrilokNagri.route
        ),
        RemedyItem(
            id = "court_cases",
            title = "Court Cases & Legal Disputes Remedy",
            category = "Justice & Conflict Resolution",
            purpose = "Neutralize false allegations, resolve protracted court cases, and ensure triumph of truth and justice.",
            materials = listOf(
                "5 Cloves (Laung) with intact buds",
                "5 Green Cardamoms (Elaichi)",
                "Small piece of Camphor (Karpuram)",
                "Brass or clay bowl for mini-havan",
                "Clean piece of paper with court case details written with red ink"
            ),
            procedure = listOf(
                "Write your case number, opposing party name, and desired fair verdict on paper with red ink.",
                "Place the camphor in the brass bowl and place the paper beneath the bowl.",
                "Dip the cloves and cardamoms in pure desi ghee.",
                "Light the camphor and offer the cloves and cardamoms into the fire one by one while chanting 'Om Namo Bhagawate Narasimhaye Namah'.",
                "Pray earnestly to Lord Narasimha and Lord Bhairav for just, peaceful, and swift closure.",
                "When leaving for court hearings, carry one energized green cardamom in your right pocket."
            ),
            precautions = listOf(
                "Must only be performed for rightful and genuine claims, never for supporting dishonesty.",
                "Perform in clean clothes on Tuesday or Saturday morning."
            ),
            bestDay = "Tuesday Morning before 9:00 AM",
            route = Screen.CourtCases.route
        ),
        RemedyItem(
            id = "business_money",
            title = "Business, Money & Finance (Silver Diya Remedy)",
            category = "Prosperity & Commercial Growth",
            purpose = "Remove business stagnation, attract high-paying clients, clear blocked payments, and stimulate financial flow.",
            materials = listOf(
                "1 Small Pure Silver Diya (or polished brass diya)",
                "Pure Cow Milk Ghee",
                "Long Cotton Wick dipped in turmeric water and dried",
                "1 Energized Gomti Chakra and 1 Yellow Kauri",
                "Pinch of Saffron (Kesar) in the ghee"
            ),
            procedure = listOf(
                "Clean your office cash locker, shop counter, or home altar on Friday morning.",
                "Place the Silver Diya on a small silver or brass plate with unbroken rice colored with turmeric.",
                "Fill the diya with cow ghee and add 2 strands of saffron.",
                "Place the Gomti Chakra and yellow kauri beside the diya.",
                "Light the lamp facing North (direction of Lord Kuber).",
                "Chant 108 times: 'Om Shreem Hreem Kleem Tribhuvana Mahalakshmaye Asmaakam Daaridrya Naashaya Prachura Dhana Dehi Dehi Kleem Hreem Shreem Om'.",
                "Circulate the lamp smoke (Aarti) in all 4 corners of your workplace."
            ),
            precautions = listOf(
                "Never leave the cash box open or messy.",
                "Give a portion of Friday's earnings in charity to needy persons or cows."
            ),
            bestDay = "Friday Morning (Shukrawar) during Venus/Shukra Hora",
            route = Screen.Business.route
        )
    )

    // ==========================================
    // SIDDH MANTRAS
    // ==========================================
    val mantras = listOf(
        MantraItem(
            id = "mahamrityunjaya",
            title = "Maha Mrityunjaya Mantra",
            deity = "Lord Shiva",
            sanskritText = "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥",
            pronunciation = "Om Tryambakam Yajaamahe Sugandhim Pushti-Vardhanam\nUrvaarukam-Iva Bandhanaan Mrityor-Muksheeya Maamritaat",
            englishMeaning = "We worship the Three-Eyed One (Lord Shiva), who is fragrant and nourishes all beings. As a ripe cucumber is liberated from its bondage to the vine, so may He liberate us from death and suffering, for the sake of immortality.",
            targetCount = 108,
            benefits = listOf(
                "Protects against untimely accidents and severe illness",
                "Dispels deep fear, anxiety, and psychological despair",
                "Purifies the physical and etheric aura",
                "Bestows longevity, good health, and spiritual liberation"
            ),
            category = "Protection & Healing"
        ),
        MantraItem(
            id = "gayatri",
            title = "Maha Gayatri Mantra",
            deity = "Maa Gayatri / Savitur",
            sanskritText = "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥",
            pronunciation = "Om Bhur Bhuvah Swaha Tat Savitur Varenyam\nBhargo Devasya Dheemahi Dhiyo Yo Nah Prachodayaat",
            englishMeaning = "We meditate upon the supreme divine radiance of the luminous Solar Creator. May that celestial Light illuminate our intellect and guide our understanding toward truth.",
            targetCount = 108,
            benefits = listOf(
                "Awakens sharper intellect, memory, and concentration",
                "Clears karmic impurities of speech and thoughts",
                "Radiates positive vibrations in the entire environment",
                "Fundamental anchor for spiritual seekers"
            ),
            category = "Enlightenment"
        ),
        MantraItem(
            id = "chamunda_navarna",
            title = "Navarna Chamunda Mantra",
            deity = "Maa Chamunda / Mahakali / Mahalakshmi / Mahasaraswati",
            sanskritText = "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे॥",
            pronunciation = "Om Aim Hreem Kleem Chaamundaayai Vichche",
            englishMeaning = "Salutations to the supreme Divine Mother embodying Saraswati (Aim - Wisdom), Lakshmi (Hreem - Preservation), and Kali (Kleem - Transformation), who sever the knots of ignorance and conquer negative entities.",
            targetCount = 108,
            benefits = listOf(
                "Destroys black magic, negative entities, and evil eye instantly",
                "Grants fierce courage and confidence against adversaries",
                "Balances all 7 primary energy chakras",
                "Accelerates Kundalini shakti movement safely"
            ),
            category = "Protection & Power"
        ),
        MantraItem(
            id = "lakshmi_beej",
            title = "Shree Lakshmi Beej Mantra",
            deity = "Maa Mahalakshmi",
            sanskritText = "ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः॥",
            pronunciation = "Om Shreem Hreem Kleem Shreem Siddha Lakshmyai Namah",
            englishMeaning = "Salutations to Siddha Lakshmi, the primordial giver of spiritual attainment, material abundance, luxury, prosperity, and joy.",
            targetCount = 108,
            benefits = listOf(
                "Eliminates chronic financial scarcity and debt traps",
                "Attracts multiple channels of legitimate income",
                "Brings royal grace, prestige, and goodwill in society",
                "Blesses households with peace, harmony, and joy"
            ),
            category = "Abundance"
        ),
        MantraItem(
            id = "kaal_bhairav_beej",
            title = "Kaal Bhairav Beej Mantra",
            deity = "Lord Kaal Bhairav",
            sanskritText = "ॐ भ्रं कालभैरवाय नमः फट्॥",
            pronunciation = "Om Bhram Kaala Bhairavaaya Namah Phat",
            englishMeaning = "I invoke the formidable time-transcending Lord Bhairav to smash all obstructions, eliminate fear of death, and destroy negative spirits.",
            targetCount = 108,
            benefits = listOf(
                "Creates an impenetrable psychic armor around the chanter",
                "Eradicates ghosts, spirits, and occult burdens",
                "Brings victory in contentious matters and court disputes",
                "Removes planetary afflictions of Rahu, Ketu, and Saturn"
            ),
            category = "Protection & Power"
        ),
        MantraItem(
            id = "kuber_dhan_prapti",
            title = "Lord Kuber Wealth Mantra",
            deity = "Lord Kuber",
            sanskritText = "ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये\nधनधान्यसमृद्धिं मे देहि दापय स्वाहा॥",
            pronunciation = "Om Yakshaaya Kuberaya Vaishravanaaya Dhana-Dhaanyaadhipataye\nDhana-Dhaanya Samriddhim Me Dehi Daapaya Swaahaa",
            englishMeaning = "Salutations to Lord Kuber, the custodian of all cosmic treasures and guardian of wealth. Bestow upon me continuous abundance and financial stability.",
            targetCount = 108,
            benefits = listOf(
                "Protects accumulated assets from sudden depreciation",
                "Unlocks stuck investments and legacy wealth",
                "Harmonizes cash flow in commercial enterprises",
                "Brings good fortune in trade and investment"
            ),
            category = "Abundance"
        )
    )

    // ==========================================
    // SPIRITUAL ISSUES
    // ==========================================
    val issues = listOf(
        SpiritualIssueItem(
            id = "negativity",
            title = "Removing Negativity & Black Magic",
            subtitle = "Spiritual Shielding against Paranormal Afflictions & Evil Eye",
            symptoms = listOf(
                "Sudden chronic lethargy, heavy head, and inexplicable irritability without medical cause.",
                "Recurring nightmares of dark shadows, falling from heights, or suffocating in sleep.",
                "Frequent unprovoked arguments and tension among loving family members.",
                "Sudden abrupt collapse of successful business ventures or unexplained financial draining.",
                "Feeling of an unwelcome presence, cold drafts, or foul odors in specific corners."
            ),
            rootCauses = listOf(
                "Attachment of wandering earthbound entities or negative astral thought-forms.",
                "Targeted occult practices (Black Magic / Tantrik Abhichara) by jealous rivals.",
                "Accumulated environmental negative ions and suppressed emotional traumas in the property.",
                "Severe afflictions of Rahu-Ketu or Pitra Dosha in the birth chart."
            ),
            spiritualRemedy = listOf(
                "Perform the 3 Diya Process outside the main doorway every Tuesday and Saturday evening.",
                "Mop house floors with rock salt (Sendha Namak) dissolved in water twice a week.",
                "Burn pure Bakhoor, Guggul, and Camphor across all rooms daily during twilight (Sandhya).",
                "Hang an energized Kaal Bhairav Yantra / Mahakali Yantra above the main entrance.",
                "Chant or listen to Navarna Mantra and Hanuman Chalisa 7 times daily."
            ),
            keyTips = listOf(
                "Spiritual remedy consultation with Spiritual Karim is completely FREE for genuinely troubled souls.",
                "Never keep broken mirrors, dead clocks, or rusty iron scrap inside living areas.",
                "Keep your home well ventilated with morning sunlight and fresh air."
            ),
            route = Screen.Negativity.route
        ),
        SpiritualIssueItem(
            id = "progress",
            title = "Spiritual Progress & Kundalini",
            subtitle = "Navigating Inner Transformations, Kriyas, and Third Eye Awakening",
            symptoms = listOf(
                "Tingling sensations, heat, or electric currents moving up the spine.",
                "Spontaneous deep meditative states and heightened sensory awareness.",
                "Detachment from superficial gossip and craving for solitude and nature.",
                "Intense intuitive flashes and synchronistic events occurring daily.",
                "Pressure or throbbing sensation at the brow center (Third Eye / Ajna Chakra)."
            ),
            rootCauses = listOf(
                "Awakening of the dormant Prana Kundalini Shakti at the base Muladhara chakra.",
                "Spiritual maturity accumulated across past incarnations.",
                "Intense practice of mantra japa, pranayama, or proximity to an awakened Guru."
            ),
            spiritualRemedy = listOf(
                "Ground excess electrical energy by walking barefoot on soil or grass daily.",
                "Follow a strictly Satvik, easily digestible diet with plenty of pure water and herbal teas.",
                "Practice Nadi Shodhana Pranayama (Alternate Nostril Breathing) 15 minutes twice daily.",
                "Seek direct personal mentorship under an experienced Guru who has traversed Kundalini."
            ),
            keyTips = listOf(
                "Karim himself underwent full Kundalini awakening and guides seekers safely through all stages.",
                "Never force energy through aggressive breath holding; allow graceful natural unfolding."
            ),
            route = Screen.Progress.route
        ),
        SpiritualIssueItem(
            id = "material_benefits",
            title = "Material Benefits & Spiritual Balance",
            subtitle = "Harmonizing Material Prosperity with Inner Peace",
            symptoms = listOf(
                "Guilt or conflict between desiring financial wealth and walking a spiritual path.",
                "Material success achieved at the expense of inner calm, sleep, and health.",
                "Difficulty converting spiritual energy into tangible real-world accomplishments."
            ),
            rootCauses = listOf(
                "Misconception that spirituality requires poverty or suffering.",
                "Imbalance between lower chakras (Muladhara, Swadhisthana) and upper chakras.",
                "Lack of aligned action (Karmayoga) alongside meditative practices."
            ),
            spiritualRemedy = listOf(
                "Establish Sri Yantra in your workspace and chant Shree Suktam on Fridays.",
                "Practice conscious wealth stewardship: allocate 10% of profits toward selfless charity.",
                "Align professional projects with dharmic value creation and genuine public benefit."
            ),
            keyTips = listOf(
                "In Sanatan tradition, Artha (Wealth) is one of the four essential Purusharthas alongside Dharma, Kama, and Moksha.",
                "True spirituality empowers you to thrive in both the material world and the mystic dimension."
            ),
            route = Screen.Benefits.route
        ),
        SpiritualIssueItem(
            id = "healing",
            title = "Healing & Vital Energy Restoration",
            subtitle = "Rebuilding Pranic Life Force & Overcoming Chronic Ailments",
            symptoms = listOf(
                "Persistent fatigue despite medical tests reporting normal parameters.",
                "Chronic psychosomatic pain that moves across different parts of the body.",
                "Emotional numbness, grief, or sudden panic episodes without triggers.",
                "Weakened immunity and vulnerability to environmental stresses."
            ),
            rootCauses = listOf(
                "Blockages and tears in the subtle etheric auric sheath (Pranamaya Kosha).",
                "Suppressed emotional baggage (Karmic Samskaras) stored in the nervous system.",
                "Depletion of Ojas (vital nectar) through excessive stress and irregular lifestyles."
            ),
            spiritualRemedy = listOf(
                "Regular chanting of Maha Mrityunjaya Mantra 108 times over a copper glass of water before drinking.",
                "Aura cleansing using consecrated Bakhoor smoke and peacock feather sweeps (Mor Pankh Jhaada).",
                "Daily Surya Namaskar and 20 minutes of morning sunbathing to absorb solar prana.",
                "Direct distance spiritual healing sessions with Karim."
            ),
            keyTips = listOf(
                "Spiritual healing works in harmony with medical science; never discontinue medical prescriptions without doctor advice."
            ),
            route = Screen.Healing.route
        )
    )

    // ==========================================
    // INFORMATION ARTICLES
    // ==========================================
    val infoArticles = listOf(
        InfoArticle(
            id = "courses",
            title = "Course Information & Spiritual Mentorship",
            category = "Mentorship & Education",
            sections = listOf(
                ArticleSection(
                    heading = "Overview of Mentorship Program",
                    body = "Spiritual Karim offers structured, practical, and deeply transformative mentorship programs designed for seekers who wish to unlock their innate mystical capabilities, safely awaken Kundalini, learn occult protection, and master the science of mantras."
                ),
                ArticleSection(
                    heading = "Curriculum Highlights",
                    body = "Our certified training modules include comprehensive theoretical frameworks and daily practical sadhana assignments.",
                    bulletPoints = listOf(
                        "Module 1: Foundations of Energy Bodies, Aura Dynamics & Chakras",
                        "Module 2: Kundalini Awakening Protocols & Safe Energy Grounding",
                        "Module 3: Third Eye (Divya Drishti) Activation & Trataka Meditations",
                        "Module 4: Astral Realm Exploration (Trilok Nagri) & Lucid Dreamwork",
                        "Module 5: Occult Protection, Countering Black Magic & Evil Eye Banishment",
                        "Module 6: Siddh Mantra Vigyan, Beej Aksharas & Yantra Consecration",
                        "Module 7: Remedial Astrology, Gemstones & Havan Ritual Science"
                    )
                ),
                ArticleSection(
                    heading = "Batch Details & Registration",
                    body = "Batches are conducted in small, intimate cohorts to ensure 1-on-1 attention and direct feedback from Karim. Both online live interactive sessions and personalized guided sadhana tracks are available.\n\nTo apply for upcoming batches, contact via Telegram or Helpline."
                )
            ),
            route = Screen.Courses.route
        ),
        InfoArticle(
            id = "bakhoor",
            title = "Bakhoor & Sacred Incense Blends",
            category = "Mystic Cleansing Materials",
            sections = listOf(
                ArticleSection(
                    heading = "What is Bakhoor?",
                    body = "Bakhoor is a traditional aromatic blend of natural woodchips (usually agarwood/oudh) soaked in fragrant oils, infused with rare resins like Guggul, Loban, Sandalwood, and natural musk. In spiritual traditions worldwide, it is regarded as the supreme medium for purifying atmospheric prana."
                ),
                ArticleSection(
                    heading = "Spiritual & Atmospheric Benefits",
                    body = "Burning authentic Bakhoor produces rich, soothing fragrant smoke with remarkable metaphysical properties.",
                    bulletPoints = listOf(
                        "Banishes low-vibration negative entities and lingering psychic toxins.",
                        "Instantly calms agitated nervous systems and induces deep alpha brainwaves.",
                        "Attracts positive devic energies, angelic presence, and spiritual beings.",
                        "Cleanses secondhand auric baggage left by visiting guests or arguments.",
                        "Prepares a pristine, holy vibration for mantra chanting and deep meditation."
                    )
                ),
                ArticleSection(
                    heading = "How to Burn Bakhoor Properly",
                    body = "1. Light a charcoal tablet until it glows red hot, then place it inside an authentic brass/ceramic Mabkhara (incense burner).\n2. Place a small piece of Bakhoor resin directly on top of the glowing coal.\n3. Allow the aromatic smoke to waft through the room, circulating around doorways, corners, and your puja space.\n4. Recite your preferred protection mantra while walking through the living area."
                )
            ),
            route = Screen.Bakhoor.route
        )
    )

    // ==========================================
    // FAQS
    // ==========================================
    val faqs = listOf(
        FaqItem(
            id = "faq_1",
            question = "Is consultation for spiritual problems and negativity really free?",
            answer = "Yes! Karim believes that relieving someone from paranormal torment, black magic, or negative entity attachment is a sacred spiritual duty. Initial consultation and guidance for negativity and spiritual trouble is provided completely FREE of cost.",
            category = "General"
        ),
        FaqItem(
            id = "faq_2",
            question = "Who is Spiritual Karim and what is his background?",
            answer = "Karim is a spiritual mentor and clairvoyant who underwent a spontaneous Kundalini awakening years ago. Following deep sadhana and guidance from divine realms, he activated his Divya Drishti (Third Eye) and now mentors seekers worldwide in paranormal remedies, Kundalini management, and holistic life success.",
            category = "About"
        ),
        FaqItem(
            id = "faq_3",
            question = "Can anyone practice Sri Yantra or Kalashtami Sadhana?",
            answer = "Yes, sincere seekers of any caste, creed, or gender can practice these sadhanas provided they adhere to purity, satvik lifestyle, and the step-by-step instructions provided in the sadhana guides.",
            category = "Sadhana"
        ),
        FaqItem(
            id = "faq_4",
            question = "How quickly does the Three Diya Process show results?",
            answer = "Most practitioners experience a palpable lightness, reduction in family tension, and cessation of nocturnal nightmares within the first 3 sessions (1 to 2 weeks). For deeply entrenched issues, continue for the full 21-day cycle.",
            category = "Remedies"
        ),
        FaqItem(
            id = "faq_5",
            question = "How can I join the Telegram community or YouTube channel?",
            answer = "You can tap the 'Join Telegram Group' button in the app to join @spiritualkarim369, or tap 'YouTube Channel' to watch regular video discourses, live Q&A sessions, and remedy demonstrations.",
            category = "Community"
        ),
        FaqItem(
            id = "faq_6",
            question = "Can mantras be chanted without formal Guru Diksha?",
            answer = "General universal mantras (like Gayatri, Maha Mrityunjaya, and Navarna) can be chanted with devotion by anyone. For high-potency esoteric tantrik sadhanas, guidance and personal sankalpa from a mentor is recommended.",
            category = "Mantras"
        )
    )

    // ==========================================
    // ABOUT & SOLUTION TEXTS
    // ==========================================
    const val ABOUT_HERO_TITLE = "Spiritual Karim"
    const val ABOUT_HERO_SUBTITLE = "A Spiritual Soul • A True Mentor"
    const val ABOUT_STORY_1 = "I myself had a Kundalini awakening a few years ago, and it completely transformed my life. I started experiencing intense energy movements in my body, and I knew it was the Kundalini energy awakening within me. From that day forward, I started exploring the world of spirituality, meditation, and yoga."
    const val ABOUT_STORY_2 = "I realized that Kundalini is an incredibly powerful force that can transform our lives if we know how to harness it. With my newfound knowledge, I started guiding others to activate their Kundalini energy and experience the benefits of this powerful force. I have helped many people to overcome their fears, anxieties, and insecurities, and achieve success in their personal and professional lives."
    const val ABOUT_STORY_3 = "Apart from Kundalini, we also provide spiritual guidance and solutions to those who are troubled by paranormal activities. We believe that these activities are a result of negative energies and entities that have attached themselves to a person or place. We provide remedies and solutions to eliminate these entities and restore positive energies in the person or place."
    const val ABOUT_STORY_4 = "Overall, our aim is to help people achieve success in both the materialistic and spiritual world. We believe that a holistic approach is necessary for a fulfilling life, and we strive to provide guidance and support to those who are seeking it."
    const val ABOUT_DIVYA_DRISHTI = "Renowned in the paranormal and spiritual realm, Karim is an expert in banishing negativity, overcoming astrological challenges, and countering black magic. With years of experience, he has assisted countless people in their spiritual pilgrimage, mentoring them towards self-realization and inner tranquility."

    const val SOLUTION_TITLE = "Suffering from Negativity?"
    const val SOLUTION_SUBTITLE = "Solution for Negativity & Spiritual Problems is FREE"
    const val SOLUTION_BODY = "If you or your family are experiencing unexplained domestic chaos, severe business hurdles, nightmares, ghostly disturbances, or sudden debilitating physical exhaustion, you do not have to suffer in silence. Karim provides dedicated personal analysis and effective Vedic-Occult remedies to permanently banish dark energies and bring divine protection to your life."
}
