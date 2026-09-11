/**
 * profile-admin.js
 * Master 4-Tier OOPS-based MVC JavaScript Application for Spiritual Karim Admin Panel
 * Tier 1: Devotee Personal (Identity, Ancestral Lineage, House Clean)
 * Tier 2: Seeker Purpose (Goals, House Clean Status, Sadhanas Interested & Slide-out Drawer)
 * Tier 3: Trainee Sadhak (Categorized In-Progress Level Wise & Goli Gyan)
 * Tier 4: Healer Connect (Level Completed with Status & Certifications)
 *
 * RBAC & 4-Tier Multi-Portal Engine (Enterprise OOPS MVC Architecture)
 */

// ==============================================================
// 0. GLOBAL APPLICATION CONFIGURATION & HIGH-TRAFFIC RETRY UTILITY
// ==============================================================
window.appConfig = Object.assign(window.appConfig || {}, {
  appName: "Spiritual Karim Admin",
  orgName: "Shree Spritual Karim Sansthan",
  firebaseUrl: "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/",
  defaultMentorName: "Karim Ji (Founder)",
  defaultMentorCode: "SKHM-ADM1-7788-9900",
  defaultTargetMalas: "11 Malas Daily",
  defaultSadhanaStreak: "1 Day",
  autoCloudSync: true,
  directoryLayout: "GRID",
  githubApkUrl:
    "https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk",
});
var appConfig = window.appConfig;

async function retryFetch(input, init = {}, maxRetry = 3) {
  let attempt = 0;
  while (true) {
    try {
      const response = await fetch(input, init);
      const status = response.status;
      const serverLoad =
        response.headers && typeof response.headers.get === "function"
          ? response.headers.get("X-Server-Load")
          : null;
      if (
        status === 429 ||
        (serverLoad && serverLoad.toLowerCase() === "high")
      ) {
        if (attempt >= maxRetry) {
          throw new Error("retryFetch: max retries exceeded");
        }
        attempt++;
        console.warn(
          "retryFetch: high traffic (status " +
            status +
            "); retry " +
            attempt +
            " after 2s",
        );
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      return response;
    } catch (e) {
      if (attempt >= maxRetry) throw e;
      attempt++;
      console.warn(
        "retryFetch: fetch error (" +
          e.message +
          "); retry " +
          attempt +
          " after 2s",
      );
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

function escapeHtmlUtil(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (typeof window !== "undefined") {
  window.appConfig = appConfig;
  window.retryFetch = retryFetch;
  window.escapeHtmlUtil = escapeHtmlUtil;
  window.escapeHtml = escapeHtmlUtil;
}

// ==============================================================
// 1. MASTER SADHANA CATALOG & SACRED KNOWLEDGE DICTIONARY
// ==============================================================
const SADHANA_CATALOG = {
  sri_yantra: {
    id: "sri_yantra",
    title: "Sri Yantra Sadhana",
    category: "Sacred Sadhana",
    domain: "sadhanas",
    icon: "🔯",
    levelScope: "Level 1–4",
    summary:
      "Supreme Tantric Sadhana for divine wealth, material elevation, third-eye awakening, and cosmic geometric alignment.",
    mantra:
      "ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ",
    timing: "Brahma Muhurta (04:00 AM – 06:00 AM) or Dusk Sandhya",
    aasanDirection: "Yellow / Red Silk Aasan, East Facing",
    ingredients:
      "Pure Copper or Silver Meru Sri Yantra, Pure Cow Ghee Diya, Lotus Seed Mala (Kamalgatta), Saffron, Fresh Lotus Flowers.",
    steps: [
      "Perform Aachaman and purify the prayer altar with Gangajal.",
      "Place Sri Yantra upon a clean copper plate over a bed of raw unblemished rice.",
      "Light the Cow Ghee Diya and perform 5 minutes of focused Trataka (gazing at the central Bindu of the Sri Yantra).",
      "Chant 11 or 21 Malas of the Maha Lakshmi Beej Mantra with undivided concentration.",
      "Conclude with Shree Suktam recital and offer saffron milk bhog.",
    ],
    benefits:
      "Eliminates acute financial blockages, unlocks business prosperity, balances the Ajna chakra, and radiates high-frequency divine aura.",
    cautions:
      "Maintain strict Satvik diet, celibacy during anushthan days, and never point feet towards the Sri Yantra.",
  },

  kalashtami: {
    id: "kalashtami",
    title: "Kalashtami Bhairav Sadhana",
    category: "Sacred Sadhana",
    domain: "sadhanas",
    icon: "🔱",
    levelScope: "Level 1–4",
    summary:
      "Kaal Bhairav Sadhana for overcoming intense fear, black magic attacks, evil eye, and court/police obstacles.",
    mantra:
      "ॐ भ्रं कालभैरवाय फट् ॥ ॐ ह्रीं बटुकाय आपदुद्धारणाय कुरु कुरु बटुकाय ह्रीं ॐ स्वाहा ॥",
    timing:
      "Night Sandhya (09:00 PM – Midnight) on Krishna Paksha Ashtami (Kalashtami)",
    aasanDirection: "Black or Dark Woolen Aasan, South or North Facing",
    ingredients:
      "Mustard Oil (Sarson) Diya, Black Sesame Seeds (Til), Urad Dal, Kaal Bhairav Yantra, Rudraksha Mala.",
    steps: [
      "Cleanse yourself and sit on the woolen aasan facing South/North.",
      "Light a large 4-wick Mustard Oil lamp in front of Kaal Bhairav image or idol.",
      "Offer black sesame seeds, raw jaggery, and red flowers to Lord Bhairav.",
      "Chant 11 Malas of the Bhairav Beej Mantra using a consecrated Rudraksha Mala.",
      "Recite Kaal Bhairav Ashtakam with devotion and burn camphor & loban.",
    ],
    benefits:
      "Impenetrable astral shield against paranormal disturbances, removal of enemy hostility, and destruction of deep-seated phobias.",
    cautions:
      "Requires fearless mental disposition; perform only with pure protective intent.",
  },

  navratri: {
    id: "navratri",
    title: "Navratri Chamunda Sadhana",
    category: "Sacred Sadhana",
    domain: "sadhanas",
    icon: "⚔️",
    levelScope: "Level 1–4",
    summary:
      "9-Day Intense Navratri Anushthan invoking Maa Chamunda and Durga for supreme Shakti activation and curse removal.",
    mantra:
      "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥",
    timing: "Dawn and Twilight Sandhya during 9 days of Navratri",
    aasanDirection: "Red Woolen / Silk Aasan, North-East Facing",
    ingredients:
      "Akhand Jyoti Diya, Navarna Yantra, Fresh Hibiscus Flowers, Clove Pairs, Camphor, Havan Kund.",
    steps: [
      "Establish Kalash and light the Akhand Jyoti on Pratipada.",
      "Recite Durga Saptashati chapters sequentially each day.",
      "Chant 108 Malas of the Navarna Mantra daily with dedicated focus.",
      "Perform daily evening havan offering 108 ahutis with cloves, ghee, and sacred havan samagri.",
      "Perform Kanya Pujan and Brahman bhojan on Navami day.",
    ],
    benefits:
      "Total destruction of lingering generational curses, awakening of inner courage, and immense divine grace of the Divine Mother.",
    cautions:
      "Strict fasting or single Satvik meal, complete mental purity, and no footwear in prayer zone.",
  },

  diwali: {
    id: "diwali",
    title: "Diwali Sadhana Week",
    category: "Sacred Sadhana",
    domain: "sadhanas",
    icon: "✨",
    levelScope: "Level 1–4",
    summary:
      "7-Night festive sadhana bridging Dhanteras, Kali Chaudas, Diwali, and Govardhan Puja for boundless abundance.",
    mantra:
      "ॐ ह्रीं श्रीं क्रीं क्लीं श्रीं लक्ष्मी मम गृहे धनं पूरय पूरय चिंताएं दूरय दूरय स्वाहा ॥",
    timing: "Maha Nishita Kaal (11:40 PM – 12:30 AM) on Diwali Night",
    aasanDirection: "Yellow Velvet Aasan, North Facing (Kuber Direction)",
    ingredients:
      "Silver Lakshmi-Ganesh Coins, Lotus Flowers, Kuber Yantra, 21 Ghee Diyas, Pure Saffron, Kamalgatta Mala.",
    steps: [
      "Commence on Dhanteras by purifying the cash safe/altar with rose water and salt.",
      "On Kali Chaudas, perform evening negativity banishing with 3 mustard oil lamps.",
      "On Diwali night, perform Lakshmi-Kuber Maha Abhishek and light 21 lamps.",
      "Perform continuous Jaap of Lakshmi Beej for 3 hours during Nishita Kaal.",
      "Tie 5 energized Gomti Chakras and yellow cowries in a red cloth and place in treasury.",
    ],
    benefits:
      "Guarantees uninterrupted financial stability for the upcoming year and opens blocked career channels.",
    cautions:
      "Keep the home impeccably clean and free of broken glass or iron clutter.",
  },

  three_diya: {
    id: "three_diya",
    title: "Three Diya Process",
    category: "Divine Remedy",
    domain: "remedies",
    icon: "🪔",
    levelScope: "Level 1–3",
    summary:
      "Signature 21-Day Fire Cleansing Remedy designed by Spiritual Karim to burn stagnant domestic negativity and astral heaviness.",
    mantra:
      "ॐ नमः शिवाय ॥ (108 chants while lighting the lamps)",
    timing: "Exact Dusk Sunset Window (Godhuli Bela)",
    aasanDirection: "Main Entrance Doorway / Threshold Facing Outwards",
    ingredients:
      "3 Clay Clay/Earthen Diyas (Mitti ke Diye), Pure Mustard Oil, Thick Cotton Wicks, Sea Salt Water.",
    steps: [
      "Wash and mop the main entryway floor with sea-salt water 15 minutes before sunset.",
      "Fill 3 fresh earthen lamps with mustard oil and insert cotton wicks.",
      "Place the 3 lamps in a triangular formation directly at the main entrance doorway threshold facing outside.",
      "Light each lamp while mentally chanting Om Namah Shivaya and praying for all negative energies to exit.",
      "Let the lamps extinguish naturally; repeat daily for 21 consecutive days without break.",
    ],
    benefits:
      "Disperses chronic family disputes, removes negative entity attachments from house walls, and brings immediate peace.",
    cautions:
      "Do not blow out the lamps; never reuse the clay lamps if cracked.",
  },

  trilok_nagri: {
    id: "trilok_nagri",
    title: "Trilok Nagri Access",
    category: "Divine Remedy",
    domain: "remedies",
    icon: "🌐Œ",
    levelScope: "Level 1–3",
    summary:
      "Higher dimensional meditation portal connecting seeker consciousness to astral masters and ancestral protectors.",
    mantra:
      "ॐ त्रिलोकपालकाय विद्महे दिव्यदृष्टये धीमहि तन्नो गुरुः प्रचोदयात् ॥",
    timing: "Midnight Sandhya or Pre-Dawn 03:30 AM",
    aasanDirection: "White Silk Aasan, North-East Facing",
    ingredients:
      "Crystal Sphatik Mala, White Sandalwood Paste, Himalayan Rock Crystal, Pure Rose Water.",
    steps: [
      "Sit in Padmasana or Sukhasana with spine completely upright.",
      "Apply white sandalwood at the Third Eye (Ajna Chakra) point.",
      "Hold the Sphatik mala and align breath with deep 4-7-8 rhythmic breathing.",
      "Chant the Trilok Mantra 108 times while visualizing a radiant golden beam descending through the crown chakra.",
      "Remain in silent witnessing state for 15 minutes.",
    ],
    benefits:
      "Enhances intuitive perception, prophetic dreaming, and direct energetic connection with guru guidance.",
    cautions:
      "Perform only with grounded mind; ground yourself with water post-meditation.",
  },

  court_cases: {
    id: "court_cases",
    title: "Court Cases Remedy (Clove & Cardamom Havan)",
    category: "Divine Remedy",
    domain: "remedies",
    icon: "⚖️",
    levelScope: "Level 1–3",
    summary:
      "Fire ritual employing consecrated Clove (Laung) and Green Cardamom (Elaichi) to resolve unjust legal battles and disputes.",
    mantra:
      "ॐ ह्रीं बगलामुखि सर्वदुष्टानां वाचं मुखं पदं स्तम्भय जिह्वां कीलय बुद्धिं विनाशय ह्रीं ॐ स्वाहा ॥",
    timing: "Tuesday or Saturday Sunset",
    aasanDirection: "Yellow Aasan, East Facing",
    ingredients:
      "108 Intact Cloves (with heads), 108 Green Cardamoms, Pure Cow Ghee, Dry Coconut (Gola), Black Mustard Seeds.",
    steps: [
      "Set up a small copper havan kund with dry mango wood and camphor.",
      "Ignite the sacred fire with pure cow ghee.",
      "Dip pairs of cloves and cardamoms in pure ghee.",
      "Chant the Baglamukhi Beej Mantra and offer 108 ahutis into the sacred fire.",
      "Pray for truth to prevail and favorable legal resolution.",
    ],
    benefits:
      "Stops malicious legal conspiracies, calms opposing parties, and hastens stalled court settlements.",
    cautions:
      "Must only be performed for rightful and genuine cases, never for harming innocents.",
  },

  business_money: {
    id: "business_money",
    title: "Business & Wealth Upaya (Silver Diya Remedy)",
    category: "Divine Remedy",
    domain: "remedies",
    icon: "🪙",
    levelScope: "Level 1–3",
    summary:
      "Sacred Silver Lamp Prosperity Protocol to unblock stuck payments, revive falling business revenues, and attract wealth.",
    mantra:
      "ॐ श्रीं ह्रीं क्लीं श्री सिद्ध लक्ष्म्यै नमः ॥",
    timing: "Friday Morning during Shukla Paksha",
    aasanDirection: "Yellow Silk Aasan, North Facing at Cash Counter / Altar",
    ingredients:
      "Pure Silver Diya, Cow Ghee, 2 Intact Cloves, Camphor Tablet, Yellow Cloth, Consecrated Sri Yantra.",
    steps: [
      "Thoroughly clean the commercial shop/office altar or home cash locker.",
      "Place a yellow cloth and set the Silver Diya upon a small silver/brass plate.",
      "Fill the silver lamp with pure cow ghee and insert 2 clove heads into the ghee.",
      "Light the lamp and chant the Siddha Lakshmi Mantra 108 times.",
      "Circulate the lamp smoke (Aarti) around the cash drawer and entry threshold.",
    ],
    benefits:
      "Dissolves financial stagnation, clears payment backlogs, and ensures steady growth of trade and wealth.",
    cautions: "Ensure cloves placed in the ghee are unbroken.",
  },

  negativity: {
    id: "negativity",
    title: "Negativity Cleansing (Bakhoor & Loban Fumigation)",
    category: "Cleansing & Healing",
    domain: "cleansing",
    icon: "💨",
    levelScope: "Level 1–3",
    summary:
      "Traditional aromatic smoke ritual utilizing Himalayan Bakhoor, Loban, and Guggul to detoxify household energetic fields.",
    mantra:
      "ॐ अपसर्पन्तु ते भूता ये भूता भूमि संस्थिताः। ये भूता विघ्नकर्तारस्ते नश्यन्तु शिवाज्ञया॥",
    timing: "Every Tuesday and Saturday at Twilight Dusk",
    aasanDirection: "Whole House Cleanse (Room by Room from East to West)",
    ingredients:
      "Authentic Spiritual Karim Himalayan Bakhoor, Raw Loban Resin, Guggul, Hot Cow Dung Coal (Kanda) / Charcoal, Brass Dhuna.",
    steps: [
      "Ignite natural charcoal or cow dung cake in a brass fumigation burner (Dhuna).",
      "Sprinkle pure Bakhoor and Loban powder over the burning embers.",
      "Carry the dense fragrant smoke into every room, corner, behind doors, and beneath beds.",
      "Chant the cleansing mantra or play Mahamrityunjaya jaap continuously during fumigation.",
      "Open windows slightly afterwards to allow displaced heavy energies to vacate.",
    ],
    benefits:
      "Instantly breaks heavy astral stagnation, eliminates recurring bad dreams, and restores sweet tranquil household vibes.",
    cautions: "Do not inhale smoke directly; handle hot charcoal with tongs.",
  },

  kundalini: {
    id: "kundalini",
    title: "Kundalini & Spiritual Progress",
    category: "Cleansing & Healing",
    domain: "cleansing",
    icon: "🧘",
    levelScope: "Level 1–4",
    summary:
      "Chakra purification and vital energy elevation method guided by Mentor Karim for safe Kundalini awakening.",
    mantra:
      "ॐ सोऽहं हंसः ॥ ॐ ऐं ह्रीं श्रीं मत्संसारतारिण्यै नमः ॥",
    timing: "Early Dawn (Brahma Muhurta 04:30 AM)",
    aasanDirection: "Kusha Grass Aasan covered with Wool, East Facing",
    ingredients: "Copper Water Vessel, Consecrated Rudraksha Mala, Ghee Lamp.",
    steps: [
      "Sit straight in Siddhasana with spine completely aligned.",
      "Perform 10 minutes of Nadi Shodhana Pranayama to balance Ida and Pingala nadis.",
      "Focus attention at the Mooladhara Chakra and visualize crimson radiant light.",
      "Mentally chant the seed sounds while gently drawing the energy up through Sushumna to Sahasrara.",
      "Drink energized copper water upon concluding.",
    ],
    benefits:
      "Calms hyperactive nervous system, sharpens memory and mental clarity, and ignites spiritual ascension.",
    cautions:
      "Do not force breath retention; proceed gradually under guru guidance.",
  },

  material_benefits: {
    id: "material_benefits",
    title: "Material & Karmic Benefits",
    category: "Cleansing & Healing",
    domain: "cleansing",
    icon: "💎",
    levelScope: "Level 1–3",
    summary:
      "Karmic debt resolution ritual for dissolving Pitru Dosha, planetary afflictions (Grah Dosha), and chronic bad luck.",
    mantra:
      "ॐ पितृभ्यो नमः ॥ ॐ सूर्याय नमः ॥",
    timing: "Amavasya (New Moon) or Sunday Dawn",
    aasanDirection:
      "White Cotton Aasan, South-Facing for Pitru, East for Surya",
    ingredients:
      "Black Sesame Seeds, Raw Milk, Kheer (Rice Pudding), Black Urad, Copper Lota with Gangajal.",
    steps: [
      "Offer Arghya to Lord Surya at dawn using water mixed with red flowers and jaggery.",
      "Prepare sweet rice kheer and offer 5 portions on banana leaf for crows, cows, dogs, and ants.",
      "Offer Tarpan with water and black sesame seeds facing South direction.",
      "Perform 108 Mahamrityunjaya chants dedicated to the peace of ancestors.",
      "Donate food or blankets to needy individuals.",
    ],
    benefits:
      "Releases heavy ancestral blockages, restores health in family, and blesses future generations with prosperity.",
    cautions: "Do not consume non-satvik food on Amavasya day.",
  },

  healing: {
    id: "healing",
    title: "Spiritual Healing from Illness",
    category: "Cleansing & Healing",
    domain: "cleansing",
    icon: "🌿",
    levelScope: "Level 1–3",
    summary:
      "Pranic healing and energized holy water ritual to relieve chronic ailments, stress exhaustion, and low vital immunity.",
    mantra:
      "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥",
    timing: "Daily Morning at Sunrise",
    aasanDirection: "Green / White Silk Aasan, North-East Facing",
    ingredients:
      "Pure Copper Glass with Spring Water, 5 Fresh Tulsi Leaves, Ghee Diya, Consecrated Rudraksha Mala.",
    steps: [
      "Sit comfortably and place copper glass with fresh water and Tulsi leaves in front of you.",
      "Light the ghee lamp and hold right palm above the water glass.",
      "Chant Mahamrityunjaya Mantra 108 times with deep positive visualization, channeling healing light through your palm into the water.",
      "Drink the energized water in 3 sips while praying for cellular rejuvenation.",
      "Gently massage remaining few drops onto forehead and crown chakra.",
    ],
    benefits:
      "Boosts bodily immune vigor, repairs fragmented auric energy fields, and relieves psychosomatic tensions.",
    cautions:
      "Complementary spiritual remedy; continue standard medical prescriptions as advised.",
  },

  maha_mrityunjaya_havan: {
    id: "maha_mrityunjaya_havan",
    title: "Maha Mrityunjaya Healing Havan",
    category: "Divine Remedy",
    domain: "remedies",
    icon: "🔥",
    levelScope: "Level 1–3",
    summary:
      "Supreme life-restoring Vedic fire ritual to neutralize severe health afflictions, accident dangers, and critical energetic drops.",
    mantra:
      "ॐ हौं जूं सः ॐ भूर्भुवः स्वः ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॐ स्वः भुवः भूः ॐ सः जूं हौं ॐ ॥",
    timing: "Early Morning (Pratah Sandhya) or Monday Dusk",
    aasanDirection: "White Woolen / Kusha Aasan, East Facing",
    ingredients:
      "Copper Havan Kund, Mango Wood, Pure Cow Ghee, Durva Grass, Bel Patra, Black Sesame, Guggal, Samagri.",
    steps: [
      "Cleanse altar space and ignite sacred fire with camphor and dry wood.",
      "Perform Ganesh and Shiva invocation with sacred water sprinkles.",
      "Dip Durva grass and Bel Patra in pure cow ghee.",
      "Offer 108 ahutis chanting the Maha Mrityunjaya Samput Mantra with total devotion.",
      "Conclude with Aarti and distribute energized sacred ashes (Vibhuti).",
    ],
    benefits:
      "Creates impenetrable armor against untimely physical crises, relieves chronic bodily pains, and revives vital life-force (Prana).",
    cautions: "Perform with utmost mental reverence and clean satvik diet.",
  },

  vastu_dosh_nivaran: {
    id: "vastu_dosh_nivaran",
    title: "Vastu Dosh Nivaran Upaya",
    category: "Divine Remedy",
    domain: "remedies",
    icon: "🧭",
    levelScope: "Level 1–3",
    summary:
      "Directional harmonic rectification ritual to clear blocked North-East (Ishanya) and South-West (Nairutya) household energy channels.",
    mantra:
      "ॐ वास्तुपुरुषाय नमः ॥ ॐ नमो भगवते वास्तुपुरुषाय महाबलपराक्रमाय सर्वदोषनिवारणाय स्वाहा ॥",
    timing: "Thursday or Sunday Sunrise",
    aasanDirection: "North-East Corner of Residence, Facing North",
    ingredients:
      "Copper Vastu Yantra, Camphor Crystals, Sea Salt, Turmeric Water, Gomati Chakra, Yellow Mustard Seeds.",
    steps: [
      "Identify afflicted Vastu zones (defective kitchen, toilet in Ishanya, cut corners).",
      "Purify the afflicted direction with sea salt dissolved in turmeric Gangajal.",
      "Place consecrated Copper Vastu Yantra on a wooden plinth.",
      "Light a pure cow ghee lamp and chant the Vastu Purusha Mantra 108 times.",
      "Sprinkle yellow mustard seeds in household corners to seal protective borders.",
    ],
    benefits:
      "Eliminates sudden family discord, halts drain of savings, and restores harmonious cosmic prana flow through dwelling.",
    cautions: "Do not place shoes or clutter in the energized North-East zone.",
  },

  santana_gopal: {
    id: "santana_gopal",
    title: "Santana Gopal Lineage Havan",
    category: "Divine Remedy",
    domain: "remedies",
    icon: "👶",
    levelScope: "Level 1–3",
    summary:
      "Divine child blessing and ancestral lineage protection ritual dedicated to Lord Krishna for family prosperity and progeny.",
    mantra:
      "ॐ देवकीसुत गोविन्द वासुदेव जगत्पते। देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥",
    timing: "Brahma Muhurta or Shukla Paksha Ekadashi/Ashtami",
    aasanDirection: "Yellow Silk Aasan, East Facing",
    ingredients:
      "Santana Gopal Yantra, Pure Cow Milk/Makhana Kheer, Tulsi Dal, White Butter (Makhan), Ghee, Peepal Leaf.",
    steps: [
      "Install Santana Gopal Yantra or Bal Gopal Vigrah on silver/brass thali.",
      "Perform Panchamrit abhishek accompanied by Vishnu Sahasranama recital.",
      "Offer fresh butter mixed with mishri and Tulsi leaves as naivedya.",
      "Perform 108 ahutis in sacred fire using gugal, ghee, and lotus seeds.",
      "Both spouses partake of the sanctified prasad together.",
    ],
    benefits:
      "Removes deep genetic and energetic hurdles to childbirth, protects offspring, and fosters peaceful joyous household atmosphere.",
    cautions:
      "Maintain total celibacy on anushthan days prior to ritual completion.",
  },

  karmic_debts: {
    id: "karmic_debts",
    title: "Karmic Debts Fire Cleansing (Rin Mukti)",
    category: "Divine Remedy",
    domain: "remedies",
    icon: "📜",
    levelScope: "Level 1–3",
    summary:
      "Rin-Mukti ancestral and past-life debt alleviation protocol designed to dissolve relentless monetary obligations and loans.",
    mantra:
      "ॐ ॠणमुक्तेश्वराय महादेवाय नमः ॥ ॐ आं ह्रीं क्रौं खं फट् ॥",
    timing: "Tuesday Morning or Pradosh Sandhya",
    aasanDirection: "Red / Orange Woolen Aasan, South or East Facing",
    ingredients:
      "Copper Lota, Red Lentils (Masoor Dal), Copper Coins, Pure Ghee Diya, Clove-infused Camphor, Peepal Twigs.",
    steps: [
      "Offer red lentils and water to the roots of a Banyan or Peepal tree in the morning.",
      "Set up evening havan with clove-infused camphor and dry wood.",
      "Offer 108 ahutis chanting Rin Mukteshwar Shiva Mantra.",
      "Pray sincerely for forgiveness of all known and unknown karmic transgressions.",
      "Distribute sweet boondi or jaggery bread to cows and laborers.",
    ],
    benefits:
      "Accelerates settlement of chronic bank debts, stops unexplainable loss of earnings, and unblocks stagnant capital flow.",
    cautions: "Pledge to maintain ethical financial conduct alongside remedy.",
  },

  nazar_suraksha: {
    id: "nazar_suraksha",
    title: "Nazar Suraksha & Evil Eye Shield",
    category: "Cleansing & Healing",
    domain: "cleansing",
    icon: "🧿",
    levelScope: "Level 1–3",
    summary:
      "Potent auric detoxification protocol using black mustard seeds, dry red chillies, rock salt, and camphor to dispel malicious jealousy.",
    mantra:
      "ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥ ॐ हं हनुमते रुद्रात्मकाय हुं फट् ॥",
    timing: "Tuesday or Saturday Sunset (Godhuli Bela)",
    aasanDirection: "Center of Main Hall or Threshold, Facing East",
    ingredients:
      "Black Mustard Seeds (Rai), 7 Dry Red Chillies (with stems intact), Rock Salt Crystals, Burning Charcoal in Earthen Pot.",
    steps: [
      "Hold a handful of black mustard seeds, salt crystals, and 7 whole dry red chillies in right fist.",
      "Circulate clockwise 7 times around the head and body of afflicted individual or across main room.",
      "Drop the ingredients directly onto hot burning charcoal or iron pan.",
      "Observe smoke: pungent absence indicates burning of acute evil eye (Nazar).",
      "Wash hands with salted water and discard cooled ash outside residential boundary.",
    ],
    benefits:
      "Instantly lifts unexplainable physical exhaustion, stops continuous yawning and heavy headaches, and dissolves destructive toxic envy.",
    cautions: "Never touch the burned residue with bare fingers afterwards.",
  },

  aura_strengthening: {
    id: "aura_strengthening",
    title: "Aura Strengthening & Psychic Shield",
    category: "Cleansing & Healing",
    domain: "cleansing",
    icon: "🛡️",
    levelScope: "Level 1–4",
    summary:
      "Crystalline energetic field fortification technique using consecrated Sphatik, energized water bath, and Gayatri Prana kavach.",
    mantra:
      "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
    timing: "Daily Morning immediately post-bath",
    aasanDirection: "White Silk Aasan, East Facing",
    ingredients:
      "Clear Quartz (Sphatik) Crystal, Rock Salt Bath, Fresh Cow Milk Drops, Gangajal, Sandalwood Essential Oil.",
    steps: [
      "Add a pinch of consecrated rock salt and 3 drops of rose water to daily bath water.",
      "Post-bath, sit on white silk aasan and hold energized Sphatik in both palms at heart chakra (Anahata).",
      "Chant Gayatri Mantra 24 times while visualizing a brilliant oval sphere of impenetrable golden-white light enclosing your aura 3 feet in all directions.",
      "Anoint forehead and throat chakra with pure sandalwood oil.",
      "Carry the energized crystal throughout daily public interactions.",
    ],
    benefits:
      "Prevents psychic vulnerability, stops energetic leakage in crowded venues, and elevates charisma and spiritual presence.",
    cautions:
      "Re-energize the crystal under morning sunlight once every 14 days.",
  },
};

// NOTE: MVC classes (ProfileModel, ProfileView, ProfileController)
// are defined in their respective files and loaded separately:
// - js/models/ProfileModel.js
// - js/views/ProfileView.js
// - js/controllers/ProfileController.js
