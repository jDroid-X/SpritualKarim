/**
 * profile-admin.js
 * Master 4-Tier OOPS-based MVC JavaScript Application for Spiritual Karim Admin Panel
 * Tier 1: Devotee Personal (Identity, Ancestral Lineage, House Clean)
 * Tier 2: Seeker Purpose (Goals, House Clean Status, Sadhanas Interested & Slide-out Drawer)
 * Tier 3: Trainee Sadhak (Categorized In-Progress Level Wise & Goli Gyan)
 * Tier 4: Healer Connect (Level Completed with Status & Certifications)
 *
 * RBAC & 3-Tier Multi-Portal Engine:
 * - Master: Full CRUD, complete directory, Admin Settings configuration.
 * - Healer: Scoped directory (own/team), healer workflow prioritization.
 * - Devotee: Self-only view, edit permissions, delete-locked UI.
 */

// ==============================================================
// 1. MASTER SADHANA CATALOG & SACRED KNOWLEDGE DICTIONARY
// ==============================================================
const SADHANA_CATALOG = {
  sri_yantra: {
    id: 'sri_yantra',
    title: 'Sri Yantra Sadhana',
    category: 'Sacred Sadhana',
    domain: 'sadhanas',
    icon: '🔯',
    levelScope: 'Level 1–4',
    summary: 'Supreme Tantric Sadhana for divine wealth, material elevation, third-eye awakening, and cosmic geometric alignment.',
    mantra: 'ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ',
    timing: 'Brahma Muhurta (04:00 AM – 06:00 AM) or Dusk Sandhya',
    aasanDirection: 'Yellow / Red Silk Aasan, East Facing',
    ingredients: 'Pure Copper or Silver Meru Sri Yantra, Pure Cow Ghee Diya, Lotus Seed Mala (Kamalgatta), Saffron, Fresh Lotus Flowers.',
    steps: [
      'Perform Aachaman and purify the prayer altar with Gangajal.',
      'Place Sri Yantra upon a clean copper plate over a bed of raw unblemished rice.',
      'Light the Cow Ghee Diya and perform 5 minutes of focused Trataka (gazing at the central Bindu of the Sri Yantra).',
      'Chant 11 or 21 Malas of the Maha Lakshmi Beej Mantra with undivided concentration.',
      'Conclude with Shree Suktam recital and offer saffron milk bhog.'
    ],
    benefits: 'Eliminates acute financial blockages, unlocks business prosperity, balances the Ajna chakra, and radiates high-frequency divine aura.',
    cautions: 'Maintain strict Satvik diet, celibacy during anushthan days, and never point feet towards the Sri Yantra.'
  },

  kalashtami: {
    id: 'kalashtami',
    title: 'Kalashtami Bhairav Sadhana',
    category: 'Sacred Sadhana',
    domain: 'sadhanas',
    icon: '🔱',
    levelScope: 'Level 1–4',
    summary: 'Kaal Bhairav Sadhana for overcoming intense fear, black magic attacks, evil eye, and court/police obstacles.',
    mantra: 'ॐ भ्रं कालभैरवाय फट् ॥ ॐ ह्रीं बटुकाय आपदुद्धारणाय कुरु कुरु बटुकाय ह्रीं ॐ स्वाहा ॥',
    timing: 'Night Sandhya (09:00 PM – Midnight) on Krishna Paksha Ashtami (Kalashtami)',
    aasanDirection: 'Black or Dark Woolen Aasan, South or North Facing',
    ingredients: 'Mustard Oil (Sarson) Diya, Black Sesame Seeds (Til), Urad Dal, Kaal Bhairav Yantra, Rudraksha Mala.',
    steps: [
      'Cleanse yourself and sit on the woolen aasan facing South/North.',
      'Light a large 4-wick Mustard Oil lamp in front of Kaal Bhairav image or idol.',
      'Offer black sesame seeds, raw jaggery, and red flowers to Lord Bhairav.',
      'Chant 11 Malas of the Bhairav Beej Mantra using a consecrated Rudraksha Mala.',
      'Recite Kaal Bhairav Ashtakam with devotion and burn camphor & loban.'
    ],
    benefits: 'Impenetrable astral shield against paranormal disturbances, removal of enemy hostility, and destruction of deep-seated phobias.',
    cautions: 'Requires fearless mental disposition; perform only with pure protective intent.'
  },

  navratri: {
    id: 'navratri',
    title: 'Navratri Chamunda Sadhana',
    category: 'Sacred Sadhana',
    domain: 'sadhanas',
    icon: '⚔️',
    levelScope: 'Level 1–4',
    summary: '9-Day Intense Navratri Anushthan invoking Maa Chamunda and Durga for supreme Shakti activation and curse removal.',
    mantra: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥',
    timing: 'Dawn and Twilight Sandhya during 9 days of Navratri',
    aasanDirection: 'Red Woolen / Silk Aasan, North-East Facing',
    ingredients: 'Akhand Jyoti Diya, Navarna Yantra, Fresh Hibiscus Flowers, Clove Pairs, Camphor, Havan Kund.',
    steps: [
      'Establish Kalash and light the Akhand Jyoti on Pratipada.',
      'Recite Durga Saptashati chapters sequentially each day.',
      'Chant 108 Malas of the Navarna Mantra daily with dedicated focus.',
      'Perform daily evening havan offering 108 ahutis with cloves, ghee, and sacred havan samagri.',
      'Perform Kanya Pujan and Brahman bhojan on Navami day.'
    ],
    benefits: 'Total destruction of lingering generational curses, awakening of inner courage, and immense divine grace of the Divine Mother.',
    cautions: 'Strict fasting or single Satvik meal, complete mental purity, and no footwear in prayer zone.'
  },

  diwali: {
    id: 'diwali',
    title: 'Diwali Sadhana Week',
    category: 'Sacred Sadhana',
    domain: 'sadhanas',
    icon: '✨',
    levelScope: 'Level 1–4',
    summary: '7-Night festive sadhana bridging Dhanteras, Kali Chaudas, Diwali, and Govardhan Puja for boundless abundance.',
    mantra: 'ॐ ह्रीं श्रीं क्रीं क्लीं श्रीं लक्ष्मी मम गृहे धनं पूरय पूरय चिंताएं दूरय दूरय स्वाहा ॥',
    timing: 'Maha Nishita Kaal (11:40 PM – 12:30 AM) on Diwali Night',
    aasanDirection: 'Yellow Velvet Aasan, North Facing (Kuber Direction)',
    ingredients: 'Silver Lakshmi-Ganesh Coins, Lotus Flowers, Kuber Yantra, 21 Ghee Diyas, Pure Saffron, Kamalgatta Mala.',
    steps: [
      'Commence on Dhanteras by purifying the cash safe/altar with rose water and salt.',
      'On Kali Chaudas, perform evening negativity banishing with 3 mustard oil lamps.',
      'On Diwali night, perform Lakshmi-Kuber Maha Abhishek and light 21 lamps.',
      'Perform continuous Jaap of Lakshmi Beej for 3 hours during Nishita Kaal.',
      'Tie 5 energized Gomti Chakras and yellow cowries in a red cloth and place in treasury.'
    ],
    benefits: 'Guarantees uninterrupted financial stability for the upcoming year and opens blocked career channels.',
    cautions: 'Keep the home impeccably clean and free of broken glass or iron clutter.'
  },

  three_diya: {
    id: 'three_diya',
    title: 'Three Diya Process',
    category: 'Divine Remedy',
    domain: 'remedies',
    icon: '🪔',
    levelScope: 'Level 1–3',
    summary: 'Signature 21-Day Fire Cleansing Remedy designed by Spiritual Karim to burn stagnant domestic negativity and astral heaviness.',
    mantra: 'ॐ नमः शिवाय ॥ (108 chants while lighting the lamps)',
    timing: 'Exact Dusk Sunset Window (Godhuli Bela)',
    aasanDirection: 'Main Entrance Doorway / Threshold Facing Outwards',
    ingredients: '3 Clay Clay/Earthen Diyas (Mitti ke Diye), Pure Mustard Oil, Thick Cotton Wicks, Sea Salt Water.',
    steps: [
      'Wash and mop the main entryway floor with sea-salt water 15 minutes before sunset.',
      'Fill 3 fresh earthen lamps with mustard oil and insert cotton wicks.',
      'Place the 3 lamps in a triangular formation directly at the main entrance doorway threshold facing outside.',
      'Light each lamp while mentally chanting Om Namah Shivaya and praying for all negative energies to exit.',
      'Let the lamps extinguish naturally; repeat daily for 21 consecutive days without break.'
    ],
    benefits: 'Disperses chronic family disputes, removes negative entity attachments from house walls, and brings immediate peace.',
    cautions: 'Do not blow out the lamps; never reuse the clay lamps if cracked.'
  },

  trilok_nagri: {
    id: 'trilok_nagri',
    title: 'Trilok Nagri Access',
    category: 'Divine Remedy',
    domain: 'remedies',
    icon: '🌌',
    levelScope: 'Level 1–3',
    summary: 'Higher dimensional meditation portal connecting seeker consciousness to astral masters and ancestral protectors.',
    mantra: 'ॐ त्रिलोकपालकाय विद्महे दिव्यदृष्टये धीमहि तन्नो गुरुः प्रचोदयात् ॥',
    timing: 'Midnight Sandhya or Pre-Dawn 03:30 AM',
    aasanDirection: 'White Silk Aasan, North-East Facing',
    ingredients: 'Crystal Sphatik Mala, White Sandalwood Paste, Himalayan Rock Crystal, Pure Rose Water.',
    steps: [
      'Sit in Padmasana or Sukhasana with spine completely upright.',
      'Apply white sandalwood at the Third Eye (Ajna Chakra) point.',
      'Hold the Sphatik mala and align breath with deep 4-7-8 rhythmic breathing.',
      'Chant the Trilok Mantra 108 times while visualizing a radiant golden beam descending through the crown chakra.',
      'Remain in silent witnessing state for 15 minutes.'
    ],
    benefits: 'Enhances intuitive perception, prophetic dreaming, and direct energetic connection with guru guidance.',
    cautions: 'Perform only with grounded mind; ground yourself with water post-meditation.'
  },

  court_cases: {
    id: 'court_cases',
    title: 'Court Cases Remedy (Clove & Cardamom Havan)',
    category: 'Divine Remedy',
    domain: 'remedies',
    icon: '⚖️',
    levelScope: 'Level 1–3',
    summary: 'Fire ritual employing consecrated Clove (Laung) and Green Cardamom (Elaichi) to resolve unjust legal battles and disputes.',
    mantra: 'ॐ ह्रीं बगलामुखि सर्वदुष्टानां वाचं मुखं पदं स्तम्भय जिह्वां कीलय बुद्धिं विनाशय ह्रीं ॐ स्वाहा ॥',
    timing: 'Tuesday or Saturday Sunset',
    aasanDirection: 'Yellow Aasan, East Facing',
    ingredients: '108 Intact Cloves (with heads), 108 Green Cardamoms, Pure Cow Ghee, Dry Coconut (Gola), Black Mustard Seeds.',
    steps: [
      'Set up a small copper havan kund with dry mango wood and camphor.',
      'Ignite the sacred fire with pure cow ghee.',
      'Dip pairs of cloves and cardamoms in pure ghee.',
      'Chant the Baglamukhi Beej Mantra and offer 108 ahutis into the sacred fire.',
      'Pray for truth to prevail and favorable legal resolution.'
    ],
    benefits: 'Stops malicious legal conspiracies, calms opposing parties, and hastens stalled court settlements.',
    cautions: 'Must only be performed for rightful and genuine cases, never for harming innocents.'
  },

  business_money: {
    id: 'business_money',
    title: 'Business & Wealth Upaya (Silver Diya Remedy)',
    category: 'Divine Remedy',
    domain: 'remedies',
    icon: '🪙',
    levelScope: 'Level 1–3',
    summary: 'Sacred Silver Lamp Prosperity Protocol to unblock stuck payments, revive falling business revenues, and attract wealth.',
    mantra: 'ॐ श्रीं ह्रीं क्लीं श्री सिद्ध लक्ष्म्यै नमः ॥',
    timing: 'Friday Morning during Shukla Paksha',
    aasanDirection: 'Yellow Silk Aasan, North Facing at Cash Counter / Altar',
    ingredients: 'Pure Silver Diya, Cow Ghee, 2 Intact Cloves, Camphor Tablet, Yellow Cloth, Consecrated Sri Yantra.',
    steps: [
      'Thoroughly clean the commercial shop/office altar or home cash locker.',
      'Place a yellow cloth and set the Silver Diya upon a small silver/brass plate.',
      'Fill the silver lamp with pure cow ghee and insert 2 clove heads into the ghee.',
      'Light the lamp and chant the Siddha Lakshmi Mantra 108 times.',
      'Circulate the lamp smoke (Aarti) around the cash drawer and entry threshold.'
    ],
    benefits: 'Dissolves financial stagnation, clears payment backlogs, and ensures steady growth of trade and wealth.',
    cautions: 'Ensure cloves placed in the ghee are unbroken.'
  },

  negativity: {
    id: 'negativity',
    title: 'Negativity Cleansing (Bakhoor & Loban Fumigation)',
    category: 'Cleansing & Healing',
    domain: 'cleansing',
    icon: '💨',
    levelScope: 'Level 1–3',
    summary: 'Traditional aromatic smoke ritual utilizing Himalayan Bakhoor, Loban, and Guggul to detoxify household energetic fields.',
    mantra: 'ॐ अपसर्पन्तु ते भूता ये भूता भूमि संस्थिताः। ये भूता विघ्नकर्तारस्ते नश्यन्तु शिवाज्ञया॥',
    timing: 'Every Tuesday and Saturday at Twilight Dusk',
    aasanDirection: 'Whole House Cleanse (Room by Room from East to West)',
    ingredients: 'Authentic Spiritual Karim Himalayan Bakhoor, Raw Loban Resin, Guggul, Hot Cow Dung Coal (Kanda) / Charcoal, Brass Dhuna.',
    steps: [
      'Ignite natural charcoal or cow dung cake in a brass fumigation burner (Dhuna).',
      'Sprinkle pure Bakhoor and Loban powder over the burning embers.',
      'Carry the dense fragrant smoke into every room, corner, behind doors, and beneath beds.',
      'Chant the cleansing mantra or play Mahamrityunjaya jaap continuously during fumigation.',
      'Open windows slightly afterwards to allow displaced heavy energies to vacate.'
    ],
    benefits: 'Instantly breaks heavy astral stagnation, eliminates recurring bad dreams, and restores sweet tranquil household vibes.',
    cautions: 'Do not inhale smoke directly; handle hot charcoal with tongs.'
  },

  kundalini: {
    id: 'kundalini',
    title: 'Kundalini & Spiritual Progress',
    category: 'Cleansing & Healing',
    domain: 'cleansing',
    icon: '🧘',
    levelScope: 'Level 1–4',
    summary: 'Chakra purification and vital energy elevation method guided by Mentor Karim for safe Kundalini awakening.',
    mantra: 'ॐ सोऽहं हंसः ॥ ॐ ऐं ह्रीं श्रीं मत्संसारतारिण्यै नमः ॥',
    timing: 'Early Dawn (Brahma Muhurta 04:30 AM)',
    aasanDirection: 'Kusha Grass Aasan covered with Wool, East Facing',
    ingredients: 'Copper Water Vessel, Consecrated Rudraksha Mala, Ghee Lamp.',
    steps: [
      'Sit straight in Siddhasana with spine completely aligned.',
      'Perform 10 minutes of Nadi Shodhana Pranayama to balance Ida and Pingala nadis.',
      'Focus attention at the Mooladhara Chakra and visualize crimson radiant light.',
      'Mentally chant the seed sounds while gently drawing the energy up through Sushumna to Sahasrara.',
      'Drink energized copper water upon concluding.'
    ],
    benefits: 'Calms hyperactive nervous system, sharpens memory and mental clarity, and ignites spiritual ascension.',
    cautions: 'Do not force breath retention; proceed gradually under guru guidance.'
  },

  material_benefits: {
    id: 'material_benefits',
    title: 'Material & Karmic Benefits',
    category: 'Cleansing & Healing',
    domain: 'cleansing',
    icon: '💎',
    levelScope: 'Level 1–3',
    summary: 'Karmic debt resolution ritual for dissolving Pitru Dosha, planetary afflictions (Grah Dosha), and chronic bad luck.',
    mantra: 'ॐ पितृभ्यो नमः ॥ ॐ सूर्याय नमः ॥',
    timing: 'Amavasya (New Moon) or Sunday Dawn',
    aasanDirection: 'White Cotton Aasan, South-Facing for Pitru, East for Surya',
    ingredients: 'Black Sesame Seeds, Raw Milk, Kheer (Rice Pudding), Black Urad, Copper Lota with Gangajal.',
    steps: [
      'Offer Arghya to Lord Surya at dawn using water mixed with red flowers and jaggery.',
      'Prepare sweet rice kheer and offer 5 portions on banana leaf for crows, cows, dogs, and ants.',
      'Offer Tarpan with water and black sesame seeds facing South direction.',
      'Perform 108 Mahamrityunjaya chants dedicated to the peace of ancestors.',
      'Donate food or blankets to needy individuals.'
    ],
    benefits: 'Releases heavy ancestral blockages, restores health in family, and blesses future generations with prosperity.',
    cautions: 'Do not consume non-satvik food on Amavasya day.'
  },

  healing: {
    id: 'healing',
    title: 'Spiritual Healing from Illness',
    category: 'Cleansing & Healing',
    domain: 'cleansing',
    icon: '🌿',
    levelScope: 'Level 1–3',
    summary: 'Pranic healing and energized holy water ritual to relieve chronic ailments, stress exhaustion, and low vital immunity.',
    mantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥',
    timing: 'Daily Morning at Sunrise',
    aasanDirection: 'Green / White Silk Aasan, North-East Facing',
    ingredients: 'Pure Copper Glass with Spring Water, 5 Fresh Tulsi Leaves, Ghee Diya, Consecrated Rudraksha Mala.',
    steps: [
      'Sit comfortably and place copper glass with fresh water and Tulsi leaves in front of you.',
      'Light the ghee lamp and hold right palm above the water glass.',
      'Chant Mahamrityunjaya Mantra 108 times with deep positive visualization, channeling healing light through your palm into the water.',
      'Drink the energized water in 3 sips while praying for cellular rejuvenation.',
      'Gently massage remaining few drops onto forehead and crown chakra.'
    ],
    benefits: 'Boosts bodily immune vigor, repairs fragmented auric energy fields, and relieves psychosomatic tensions.',
    cautions: 'Complementary spiritual remedy; continue standard medical prescriptions as advised.'
  },

  maha_mrityunjaya_havan: {
    id: 'maha_mrityunjaya_havan',
    title: 'Maha Mrityunjaya Healing Havan',
    category: 'Divine Remedy',
    domain: 'remedies',
    icon: '🔥',
    levelScope: 'Level 1–3',
    summary: 'Supreme life-restoring Vedic fire ritual to neutralize severe health afflictions, accident dangers, and critical energetic drops.',
    mantra: 'ॐ हौं जूं सः ॐ भूर्भुवः स्वः ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॐ स्वः भुवः भूः ॐ सः जूं हौं ॐ ॥',
    timing: 'Early Morning (Pratah Sandhya) or Monday Dusk',
    aasanDirection: 'White Woolen / Kusha Aasan, East Facing',
    ingredients: 'Copper Havan Kund, Mango Wood, Pure Cow Ghee, Durva Grass, Bel Patra, Black Sesame, Guggal, Samagri.',
    steps: [
      'Cleanse altar space and ignite sacred fire with camphor and dry wood.',
      'Perform Ganesh and Shiva invocation with sacred water sprinkles.',
      'Dip Durva grass and Bel Patra in pure cow ghee.',
      'Offer 108 ahutis chanting the Maha Mrityunjaya Samput Mantra with total devotion.',
      'Conclude with Aarti and distribute energized sacred ashes (Vibhuti).'
    ],
    benefits: 'Creates impenetrable armor against untimely physical crises, relieves chronic bodily pains, and revives vital life-force (Prana).',
    cautions: 'Perform with utmost mental reverence and clean satvik diet.'
  },

  vastu_dosh_nivaran: {
    id: 'vastu_dosh_nivaran',
    title: 'Vastu Dosh Nivaran Upaya',
    category: 'Divine Remedy',
    domain: 'remedies',
    icon: '🧭',
    levelScope: 'Level 1–3',
    summary: 'Directional harmonic rectification ritual to clear blocked North-East (Ishanya) and South-West (Nairutya) household energy channels.',
    mantra: 'ॐ वास्तुपुरुषाय नमः ॥ ॐ नमो भगवते वास्तुपुरुषाय महाबलपराक्रमाय सर्वदोषनिवारणाय स्वाहा ॥',
    timing: 'Thursday or Sunday Sunrise',
    aasanDirection: 'North-East Corner of Residence, Facing North',
    ingredients: 'Copper Vastu Yantra, Camphor Crystals, Sea Salt, Turmeric Water, Gomati Chakra, Yellow Mustard Seeds.',
    steps: [
      'Identify afflicted Vastu zones (defective kitchen, toilet in Ishanya, cut corners).',
      'Purify the afflicted direction with sea salt dissolved in turmeric Gangajal.',
      'Place consecrated Copper Vastu Yantra on a wooden plinth.',
      'Light a pure cow ghee lamp and chant the Vastu Purusha Mantra 108 times.',
      'Sprinkle yellow mustard seeds in household corners to seal protective borders.'
    ],
    benefits: 'Eliminates sudden family discord, halts drain of savings, and restores harmonious cosmic prana flow through dwelling.',
    cautions: 'Do not place shoes or clutter in the energized North-East zone.'
  },

  santana_gopal: {
    id: 'santana_gopal',
    title: 'Santana Gopal Lineage Havan',
    category: 'Divine Remedy',
    domain: 'remedies',
    icon: '👶',
    levelScope: 'Level 1–3',
    summary: 'Divine child blessing and ancestral lineage protection ritual dedicated to Lord Krishna for family prosperity and progeny.',
    mantra: 'ॐ देवकीसुत गोविन्द वासुदेव जगत्पते। देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥',
    timing: 'Brahma Muhurta or Shukla Paksha Ekadashi/Ashtami',
    aasanDirection: 'Yellow Silk Aasan, East Facing',
    ingredients: 'Santana Gopal Yantra, Pure Cow Milk/Makhana Kheer, Tulsi Dal, White Butter (Makhan), Ghee, Peepal Leaf.',
    steps: [
      'Install Santana Gopal Yantra or Bal Gopal Vigrah on silver/brass thali.',
      'Perform Panchamrit abhishek accompanied by Vishnu Sahasranama recital.',
      'Offer fresh butter mixed with mishri and Tulsi leaves as naivedya.',
      'Perform 108 ahutis in sacred fire using gugal, ghee, and lotus seeds.',
      'Both spouses partake of the sanctified prasad together.'
    ],
    benefits: 'Removes deep genetic and energetic hurdles to childbirth, protects offspring, and fosters peaceful joyous household atmosphere.',
    cautions: 'Maintain total celibacy on anushthan days prior to ritual completion.'
  },

  karmic_debts: {
    id: 'karmic_debts',
    title: 'Karmic Debts Fire Cleansing (Rin Mukti)',
    category: 'Divine Remedy',
    domain: 'remedies',
    icon: '📜',
    levelScope: 'Level 1–3',
    summary: 'Rin-Mukti ancestral and past-life debt alleviation protocol designed to dissolve relentless monetary obligations and loans.',
    mantra: 'ॐ ॠणमुक्तेश्वराय महादेवाय नमः ॥ ॐ आं ह्रीं क्रौं खं फट् ॥',
    timing: 'Tuesday Morning or Pradosh Sandhya',
    aasanDirection: 'Red / Orange Woolen Aasan, South or East Facing',
    ingredients: 'Copper Lota, Red Lentils (Masoor Dal), Copper Coins, Pure Ghee Diya, Clove-infused Camphor, Peepal Twigs.',
    steps: [
      'Offer red lentils and water to the roots of a Banyan or Peepal tree in the morning.',
      'Set up evening havan with clove-infused camphor and dry wood.',
      'Offer 108 ahutis chanting Rin Mukteshwar Shiva Mantra.',
      'Pray sincerely for forgiveness of all known and unknown karmic transgressions.',
      'Distribute sweet boondi or jaggery bread to cows and laborers.'
    ],
    benefits: 'Accelerates settlement of chronic bank debts, stops unexplainable loss of earnings, and unblocks stagnant capital flow.',
    cautions: 'Pledge to maintain ethical financial conduct alongside remedy.'
  },

  nazar_suraksha: {
    id: 'nazar_suraksha',
    title: 'Nazar Suraksha & Evil Eye Shield',
    category: 'Cleansing & Healing',
    domain: 'cleansing',
    icon: '🧿',
    levelScope: 'Level 1–3',
    summary: 'Potent auric detoxification protocol using black mustard seeds, dry red chillies, rock salt, and camphor to dispel malicious jealousy.',
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥ ॐ हं हनुमते रुद्रात्मकाय हुं फट् ॥',
    timing: 'Tuesday or Saturday Sunset (Godhuli Bela)',
    aasanDirection: 'Center of Main Hall or Threshold, Facing East',
    ingredients: 'Black Mustard Seeds (Rai), 7 Dry Red Chillies (with stems intact), Rock Salt Crystals, Burning Charcoal in Earthen Pot.',
    steps: [
      'Hold a handful of black mustard seeds, salt crystals, and 7 whole dry red chillies in right fist.',
      'Circulate clockwise 7 times around the head and body of afflicted individual or across main room.',
      'Drop the ingredients directly onto hot burning charcoal or iron pan.',
      'Observe smoke: pungent absence indicates burning of acute evil eye (Nazar).',
      'Wash hands with salted water and discard cooled ash outside residential boundary.'
    ],
    benefits: 'Instantly lifts unexplainable physical exhaustion, stops continuous yawning and heavy headaches, and dissolves destructive toxic envy.',
    cautions: 'Never touch the burned residue with bare fingers afterwards.'
  },

  aura_strengthening: {
    id: 'aura_strengthening',
    title: 'Aura Strengthening & Psychic Shield',
    category: 'Cleansing & Healing',
    domain: 'cleansing',
    icon: '🛡️',
    levelScope: 'Level 1–4',
    summary: 'Crystalline energetic field fortification technique using consecrated Sphatik, energized water bath, and Gayatri Prana kavach.',
    mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    timing: 'Daily Morning immediately post-bath',
    aasanDirection: 'White Silk Aasan, East Facing',
    ingredients: 'Clear Quartz (Sphatik) Crystal, Rock Salt Bath, Fresh Cow Milk Drops, Gangajal, Sandalwood Essential Oil.',
    steps: [
      'Add a pinch of consecrated rock salt and 3 drops of rose water to daily bath water.',
      'Post-bath, sit on white silk aasan and hold energized Sphatik in both palms at heart chakra (Anahata).',
      'Chant Gayatri Mantra 24 times while visualizing a brilliant oval sphere of impenetrable golden-white light enclosing your aura 3 feet in all directions.',
      'Anoint forehead and throat chakra with pure sandalwood oil.',
      'Carry the energized crystal throughout daily public interactions.'
    ],
    benefits: 'Prevents psychic vulnerability, stops energetic leakage in crowded venues, and elevates charisma and spiritual presence.',
    cautions: 'Re-energize the crystal under morning sunlight once every 14 days.'
  }
};

// ==============================================================
// 2. MODEL LAYER (SINGLE SOURCE OF TRUTH & REACTIVE STORAGE)
// ==============================================================
class ProfileModel {
  constructor() {
    this.storageKey = 'sk_admin_profiles_v3';
    this.activeProfileIdKey = 'sk_admin_active_profile_id_v3';
    this.settingsKey = 'sk_admin_system_settings_v1';
    this.roleModeKey = 'sk_admin_active_role_mode_v1';

    this.profiles = this._loadProfiles();
    this.settings = this._loadSettings();

    // Determine initial roleMode from page tag or localStorage
    const portalModeTag = document.body.getAttribute('data-portal-mode');
    if (portalModeTag) {
      this.roleMode = portalModeTag.toUpperCase();
    } else {
      this.roleMode = localStorage.getItem(this.roleModeKey) || 'MASTER';
    }

    this.activeProfileId = localStorage.getItem(this.activeProfileIdKey) || (this.profiles[0]?.id || 'prof-admin-01');
    this.activeSadhanaDrawerId = null;
  }

  _getDefaultSettings() {
    return {
      defaultMentorName: 'Karim Ji (Founder)',
      defaultMentorCode: 'SKHM-ADM1-7788-9900',
      speechLang: 'en-US',
      defaultTargetMalas: '11 Malas Daily',
      defaultSadhanaStreak: '1 Day',
      allowDevoteeDelete: false,
      devoteeCanEditLineage: true,
      devoteeCanEnroll: true,
      healerStrictTeam: true,
      healerCanCertify: true,
      healerCanDeleteTeam: true,
      healerCanViewEntireTeam: true,
      enableLiveSync: true,
      firebaseUrl: 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/',
      defaultRoleMode: 'MASTER',
      autoSaveMode: 'INSTANT'
    };
  }

  _loadSettings() {
    try {
      const data = localStorage.getItem(this.settingsKey);
      if (data) {
        return { ...this._getDefaultSettings(), ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Error loading system settings', e);
    }
    return this._getDefaultSettings();
  }

  getProfileById(profileId) {
    return this.profiles.find(p => p.id === profileId) || null;
  }

  isCircularSponsor(profileId, proposedSponsorCode) {
    if (!proposedSponsorCode || proposedSponsorCode === 'ROOT' || proposedSponsorCode === 'ROOT-0000-0000-0000') return false;
    const currentProfile = this.getProfileById(profileId);
    if (!currentProfile) return false;
    if (currentProfile.referenceCode === proposedSponsorCode) return true;

    const isDownline = (parentCode, targetCode, visited = new Set()) => {
      if (visited.has(parentCode)) return false;
      visited.add(parentCode);
      const children = this.profiles.filter(p => p.referredByCode === parentCode);
      for (const child of children) {
        if (child.referenceCode === targetCode) return true;
        if (isDownline(child.referenceCode, targetCode, visited)) return true;
      }
      return false;
    };

    return isDownline(currentProfile.referenceCode, proposedSponsorCode);
  }

  formatRefCode(str) {
    if (!str) return '';
    const cleaned = str.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    if (cleaned.length <= 12) return cleaned.slice(0, 4) + '-' + cleaned.slice(4, 8) + '-' + cleaned.slice(8);
    return cleaned.slice(0, 4) + '-' + cleaned.slice(4, 8) + '-' + cleaned.slice(8, 12) + '-' + cleaned.slice(12, 16);
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }

  getRoleMode() {
    return this.roleMode;
  }

  setRoleMode(mode) {
    this.roleMode = mode.toUpperCase();
    localStorage.setItem(this.roleModeKey, this.roleMode);

    // If switched to Devotee, select first Devotee profile if available
    if (this.roleMode === 'DEVOTEE') {
      const devoteeProf = this.profiles.find(p => p.profileType === 'DEVOTEE');
      if (devoteeProf) {
        this.setActiveProfileId(devoteeProf.id);
      }
    } else if (this.roleMode === 'HEALER') {
      const healerProf = this.profiles.find(p => p.profileType === 'HEALER');
      if (healerProf) {
        this.setActiveProfileId(healerProf.id);
      }
    }
  }

  getVisibleProfiles() {
    if (this.roleMode === 'MASTER') {
      return this.profiles;
    }

    if (this.roleMode === 'HEALER') {
      const active = this.getActiveProfile();
      return this.profiles.filter(p => {
        if (p.id === active.id) return true;
        if (p.referredByCode === active.referenceCode) return true;
        if (p.profileType === 'DEVOTEE' || p.profileType === 'TRAINEE') return true;
        return false;
      });
    }

    if (this.roleMode === 'DEVOTEE') {
      const active = this.getActiveProfile();
      // Devotee sees their own profile
      const devotees = this.profiles.filter(p => p.id === active.id || p.profileType === 'DEVOTEE');
      return devotees.length > 0 ? devotees : [active];
    }

    return this.profiles;
  }

  _getDefaultProfiles() {
    return [
      // ==========================================
      // TIER 1: ADMIN MASTER (FOUNDER)
      // ==========================================
      {
        id: 'prof-admin-01',
        referenceCode: 'SKHM-ADM1-7788-9900',
        referredByCode: 'ROOT-0000-0000-0000',
        transferredCode: '',
        name: 'Karim Ji (Founder)',
        phone: '+91 98765 43210',
        email: 'karim.master@spiritualkarim.org',
        profileType: 'ADMIN',
        level: 1,
        isPaid: true,
        paymentStatus: 'PAID',
        objective: 'Spiritual illumination, Kundalini awakening, cosmic balance, and global guidance.',
        selectedRemedies: ['sri_yantra', 'kalashtami', 'navratri', 'diwali', 'three_diya', 'negativity', 'healing'],
        address: 'Spiritual Karim Central Sanctuary',
        city: 'Mumbai, Maharashtra',
        joinDate: '2024-01-01',
        isActive: true,
        notes: 'Founder and Supreme Spiritual Guide of the Sanctuary.',
        categoryTag: 'Master Guide & Supreme Cleansing',
        seekerDiagnostics: {
          afflictionDuration: 'N/A (Master Guide)',
          kuldeviIssues: 'Kuldevi Blessings Activated',
          targetOutcome: 'Universal sadhana transmission & supreme house purification'
        },
        interestedSadhanas: [
          { id: 'sri_yantra', name: 'Sri Yantra Sadhana', category: 'Sacred Sadhana', priority: 'High', status: 'Enrolled' },
          { id: 'kalashtami', name: 'Kalashtami Bhairav Sadhana', category: 'Sacred Sadhana', priority: 'High', status: 'Enrolled' },
          { id: 'three_diya', name: 'Three Diya Process', category: 'Divine Remedy', priority: 'High', status: 'Enrolled' }
        ],
        houseCleanLevels: [
          { id: 'hc-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'APPROVED', cleanPercentage: 100, cleanedDetails: 'Sanctum Sanctorum daily purification.', mentorCode: 'SKHM-ADM1-7788-9900', mentorName: 'Karim Ji (Founder)', mentorRemarks: 'Direct master lineage purity verified 100%.', approvalDate: 'Today • Dawn' },
          { id: 'hc-2', levelNumber: 2, levelTitle: 'Level 2 — Parents House Clean', status: 'APPROVED', cleanPercentage: 100, cleanedDetails: 'Ancestral Haveli purified with traditional copper havan kund.', mentorCode: 'SKHM-ADM1-7788-9900', mentorName: 'Karim Ji (Founder)', mentorRemarks: 'Ancestral peace established.', approvalDate: 'Yesterday' },
          { id: 'hc-3', levelNumber: 3, levelTitle: 'Level 3 — Relative House Clean', status: 'APPROVED', cleanPercentage: 100, cleanedDetails: 'Extended family residences blessed and purified with 3-diya process.', mentorCode: 'SKHM-ADM1-7788-9900', mentorName: 'Karim Ji (Founder)', mentorRemarks: 'Complete 3-level clan purification certified.', approvalDate: '2 days ago' }
        ],
        traineeSadhanas: [
          { id: 'ts-1', sadhanaKey: 'sri_yantra', title: 'Sri Yantra Sadhana', categoryDomain: 'sadhanas', isPaid: true, paymentStatus: 'PAID', level: 'Level 4 — Master Attunement', dailyTarget: '21 Malas Daily + Havan', currentStreak: '108 Days Continuous', progressPercent: 100, status: 'Master Siddhi', mentorCode: 'SKHM-ADM1-7788-9900', diaryNotes: 'Golden geometry visualization stabilized at Ajna Chakra.' },
          { id: 'ts-2', sadhanaKey: 'three_diya', title: 'Three Diya Process', categoryDomain: 'remedies', isPaid: false, paymentStatus: 'FREE', level: 'Level 3 — Havan & Energy Transmission', dailyTarget: '3 Diyas at Sunset', currentStreak: '21 Days Completed', progressPercent: 100, status: 'Completed', mentorCode: 'SKHM-ADM1-7788-9900', diaryNotes: 'Heavy astral smoke clearing certified.' }
        ],
        healerCompletedSadhanas: [
          { id: 'hcs-1', title: 'Master Sri Yantra Siddhi', levelCompleted: 'Level 4 — Master Guru', completionDate: '2023-11-15', status: 'Certified Master & Guru', seekersGuidedCount: 1450, authorizedToGuide: true, sealCode: 'SKHM-SEAL-MASTER-001' }
        ],
        healerNetwork: [
          { id: 'net-1', name: 'Acharya Devendra', refCode: 'SKHM-HLR2-3344-5566', role: 'Healer (Level 2)', activeCases: 12 },
          { id: 'net-2', name: 'Maa Anandita Devi', refCode: 'SKHM-HLR2-5566-7788', role: 'Healer (Level 2)', activeCases: 8 }
        ],
        lineage: {
          currentFamily: { selfName: 'Karim Ji', selfTitle: 'Founder & Master Guide', spouseName: 'Devi Ji', children: [{ id: 'c1', name: 'Aarav Karim', gender: 'Son', ageOrNote: 'Age 14' }], siblings: [{ id: 's1', name: 'Tariq Khan', relation: 'Brother', spouseName: 'Zainab', childrenSummary: '1 Son', isMarried: true, notes: 'Spiritual support' }] },
          husbandAncestral: { fatherName: 'Late Master Father', motherName: 'Late Divine Mother', paternalGrandfather: 'Grandfather Senior', paternalGrandmother: 'Grandmother Senior', maternalGrandfather: 'Nana Ji Senior', maternalGrandmother: 'Nani Ji Senior', siblings: [], address: 'Ancestral Lineage Roots' },
          wifeAncestral: { fatherName: 'Late Father-in-law', motherName: 'Mother-in-law', paternalGrandfather: 'Dada Ji', paternalGrandmother: 'Dadi Ji', maternalGrandfather: 'Nana Ji', maternalGrandmother: 'Nani Ji', siblings: [], address: 'Wife Ancestral Village' }
        }
      },

      // ==========================================
      // TIER 2: HEALER CONNECT (LEVEL COMPLETED)
      // ==========================================
      {
        id: 'prof-healer-02',
        referenceCode: 'SKHM-HLR2-3344-5566',
        referredByCode: 'SKHM-ADM1-7788-9900',
        transferredCode: '',
        name: 'Acharya Devendra',
        phone: '+91 98220 11223',
        email: 'devendra.healer@spiritualkarim.org',
        profileType: 'HEALER',
        level: 2,
        isPaid: true,
        paymentStatus: 'PAID',
        objective: 'Energy healing, aura purification, and house negativity cleansing.',
        selectedRemedies: ['three_diya', 'negativity', 'healing', 'court_cases'],
        address: '42 Sacred Grove Road',
        city: 'Pune, Maharashtra',
        joinDate: '2024-06-15',
        isActive: true,
        notes: 'Specialist in Three Diya remedies and Pitru Dosha diagnostics.',
        categoryTag: 'Cleansing & Guidance',
        seekerDiagnostics: { afflictionDuration: 'Overcome in 2021', kuldeviIssues: 'Kuldevi Shanti Puja Performed', targetOutcome: 'Guide 100+ families' },
        interestedSadhanas: [{ id: 'three_diya', name: 'Three Diya Process', category: 'Divine Remedy', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-4', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'APPROVED', cleanPercentage: 100, cleanedDetails: 'Purified residence in Pune with sea-salt water, loban & camphor.', mentorCode: 'SKHM-ADM1-7788-9900', mentorName: 'Karim Ji (Founder)', mentorRemarks: 'High vibrational field observed.', approvalDate: '2024-06-20' },
          { id: 'hc-5', levelNumber: 2, levelTitle: 'Level 2 — Parents House Clean', status: 'APPROVED', cleanPercentage: 95, cleanedDetails: 'Parents ancestral home cleaned.', mentorCode: 'SKHM-ADM1-7788-9900', mentorName: 'Karim Ji (Founder)', mentorRemarks: 'Ancestral blessings restored.', approvalDate: '2024-07-02' },
          { id: 'hc-6', levelNumber: 3, levelTitle: 'Level 3 — Relative House Clean', status: 'IN_PROGRESS', cleanPercentage: 65, cleanedDetails: 'Cleansing maternal uncle residence.', mentorCode: 'SKHM-ADM1-7788-9900', mentorName: 'Karim Ji (Founder)', mentorRemarks: 'Under supervision.', approvalDate: 'Pending' }
        ],
        traineeSadhanas: [
          { id: 'ts-3', sadhanaKey: 'three_diya', title: 'Three Diya Process', categoryDomain: 'remedies', isPaid: true, paymentStatus: 'PAID', level: 'Level 3 — Havan Transmission', dailyTarget: '3 Diyas at Dusk', currentStreak: '18 Days', progressPercent: 85, status: 'In Progress', mentorCode: 'SKHM-ADM1-7788-9900', diaryNotes: 'Smoke clearance observed.' }
        ],
        healerCompletedSadhanas: [
          { id: 'hcs-2', title: 'Three Diya Master Certification', levelCompleted: 'Level 3 — Healer Acharya', completionDate: '2024-05-10', status: 'Certified Master', seekersGuidedCount: 340, authorizedToGuide: true, sealCode: 'SKHM-SEAL-DIYA-301' }
        ],
        healerNetwork: [
          { id: 'net-3', name: 'Amitabh Sen', refCode: 'SKHM-TRN3-1122-3344', role: 'Trainee (Level 3)', activeCases: 6 },
          { id: 'net-4', name: 'Rajeshwari Joshi', refCode: 'SKHM-TRN3-2233-4455', role: 'Trainee (Level 3)', activeCases: 4 }
        ],
        lineage: {
          currentFamily: { selfName: 'Acharya Devendra', selfTitle: 'Senior Spiritual Healer', spouseName: 'Sunita Sharma', children: [], siblings: [] },
          husbandAncestral: { fatherName: 'Ramprasad Sharma', motherName: 'Kaushalya Devi', paternalGrandfather: 'Pt. Badri Prasad', paternalGrandmother: 'Sita Devi', maternalGrandfather: 'Govind Ram', maternalGrandmother: 'Radha Devi', siblings: [], address: 'Varanasi, UP' },
          wifeAncestral: { fatherName: 'Mukesh Trivedi', motherName: 'Shanti Trivedi', paternalGrandfather: 'Hiralal Trivedi', paternalGrandmother: 'Kamala Trivedi', maternalGrandfather: 'Din Dayal', maternalGrandmother: 'Uma Devi', siblings: [], address: 'Nashik, Maharashtra' }
        }
      },
      {
        id: 'prof-healer-03',
        referenceCode: 'SKHM-HLR2-5566-7788',
        referredByCode: 'SKHM-ADM1-7788-9900',
        transferredCode: '',
        name: 'Maa Anandita Devi',
        phone: '+91 98330 44556',
        email: 'anandita.healer@spiritualkarim.org',
        profileType: 'HEALER',
        level: 2,
        isPaid: true,
        paymentStatus: 'PAID',
        objective: 'Maa Chamunda Navratri Sadhana, Kundalini awakening, and ancestral Pitru Dosha clearance.',
        selectedRemedies: ['navratri', 'kundalini', 'material_benefits', 'aura_strengthening'],
        address: '88 Ganga Ghat Sanctuary',
        city: 'Varanasi, UP',
        joinDate: '2024-05-20',
        isActive: true,
        notes: 'Specialist in Chamunda Shakti Anushthan and Kundalini energy flows.',
        categoryTag: 'Kundalini & Aura Shield',
        seekerDiagnostics: { afflictionDuration: 'Transmuted in 2020', kuldeviIssues: 'Kuldevi Temple Established', targetOutcome: 'Guide 50+ seekers to diksha' },
        interestedSadhanas: [{ id: 'navratri', name: 'Navratri Chamunda Sadhana', category: 'Sacred Sadhana', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-h3-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'APPROVED', cleanPercentage: 100, cleanedDetails: 'Ganga water purification with daily Akhand Jyoti.', mentorCode: 'SKHM-ADM1-7788-9900', mentorName: 'Karim Ji (Founder)', mentorRemarks: 'Divine grace awakened.', approvalDate: '2024-05-25' },
          { id: 'hc-h3-2', levelNumber: 2, levelTitle: 'Level 2 — Parents House Clean', status: 'APPROVED', cleanPercentage: 100, cleanedDetails: 'Varanasi ancestral sanctuary purified.', mentorCode: 'SKHM-ADM1-7788-9900', mentorName: 'Karim Ji (Founder)', mentorRemarks: 'Ancestral blessings flowing.', approvalDate: '2024-06-10' }
        ],
        traineeSadhanas: [
          { id: 'ts-h3-1', sadhanaKey: 'navratri', title: 'Navratri Chamunda Sadhana', categoryDomain: 'sadhanas', isPaid: true, paymentStatus: 'PAID', level: 'Level 4 — Master Attunement', dailyTarget: '108 Malas + Havan', currentStreak: '45 Days', progressPercent: 100, status: 'Master Siddhi', mentorCode: 'SKHM-ADM1-7788-9900', diaryNotes: 'Navarna mantra Siddhi complete.' }
        ],
        healerCompletedSadhanas: [
          { id: 'hcs-3', title: 'Navarna Shakti Master Certification', levelCompleted: 'Level 3 — Healer Acharya', completionDate: '2024-04-15', status: 'Certified Master', seekersGuidedCount: 210, authorizedToGuide: true, sealCode: 'SKHM-SEAL-SHAKTI-402' }
        ],
        healerNetwork: [
          { id: 'net-5', name: 'Rohan Verma', refCode: 'SKHM-TRN3-6677-8899', role: 'Trainee (Level 3)', activeCases: 5 },
          { id: 'net-6', name: 'Priya Sharma', refCode: 'SKHM-TRN3-7788-9900', role: 'Trainee (Level 3)', activeCases: 3 }
        ],
        lineage: {
          currentFamily: { selfName: 'Maa Anandita Devi', selfTitle: 'Acharya Yogini', spouseName: '', children: [], siblings: [] },
          husbandAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' },
          wifeAncestral: { fatherName: 'Pt. Vidyadhar Shastri', motherName: 'Gayatri Devi', paternalGrandfather: 'Pt. Ishwar Das', paternalGrandmother: 'Saraswati Devi', maternalGrandfather: 'Harishchandra', maternalGrandmother: 'Gauri Devi', siblings: [], address: 'Varanasi, UP' }
        }
      },

      // ==========================================
      // TIER 3: TRAINEE SADHAK (IN-PROGRESS)
      // ==========================================
      {
        id: 'prof-trainee-04',
        referenceCode: 'SKHM-TRN3-1122-3344',
        referredByCode: 'SKHM-HLR2-3344-5566',
        transferredCode: '',
        name: 'Amitabh Sen',
        phone: '+91 98450 77889',
        email: 'amitabh.sen@trainee.org',
        profileType: 'TRAINEE',
        level: 3,
        isPaid: true,
        paymentStatus: 'PAID',
        objective: 'Mastering 3 Diya fire cleansing and Sri Yantra geometry.',
        selectedRemedies: ['three_diya', 'sri_yantra'],
        address: '12 Temple Street',
        city: 'Kolkata, West Bengal',
        joinDate: '2024-07-10',
        isActive: true,
        notes: 'Advanced trainee under Acharya Devendra.',
        categoryTag: 'Trainee Sadhak',
        seekerDiagnostics: { afflictionDuration: '2 Years', kuldeviIssues: 'Purification active', targetOutcome: 'Advance to Level 3 Havan' },
        interestedSadhanas: [{ id: 'three_diya', name: 'Three Diya Process', category: 'Divine Remedy', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-t4-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'APPROVED', cleanPercentage: 100, cleanedDetails: 'Doorway threshold purified daily.', mentorCode: 'SKHM-HLR2-3344-5566', mentorName: 'Acharya Devendra', mentorRemarks: 'Purity certified.', approvalDate: '2024-07-18' },
          { id: 'hc-t4-2', levelNumber: 2, levelTitle: 'Level 2 — Parents House Clean', status: 'IN_PROGRESS', cleanPercentage: 60, cleanedDetails: 'Cleansing ancestral flat in Kolkata.', mentorCode: 'SKHM-HLR2-3344-5566', mentorName: 'Acharya Devendra', mentorRemarks: 'In Progress.', approvalDate: 'Pending' }
        ],
        traineeSadhanas: [
          { id: 'ts-t4-1', sadhanaKey: 'three_diya', title: 'Three Diya Process', categoryDomain: 'remedies', isPaid: true, paymentStatus: 'PAID', level: 'Level 2 — Mantra Diksha', dailyTarget: '3 Diyas at Dusk', currentStreak: '14 Days', progressPercent: 75, status: 'In Progress', mentorCode: 'SKHM-HLR2-3344-5566', diaryNotes: 'Threshold cleared.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Amitabh Sen', selfTitle: 'Trainee Sadhak', spouseName: 'Rupali Sen', children: [], siblings: [] },
          husbandAncestral: { fatherName: 'Birendra Sen', motherName: 'Suniti Sen', paternalGrandfather: 'Kalyan Sen', paternalGrandmother: 'Asha Sen', maternalGrandfather: 'S. K. Roy', maternalGrandmother: 'Manju Roy', siblings: [], address: 'Kolkata, WB' },
          wifeAncestral: { fatherName: 'Subhas Bose', motherName: 'Ila Bose', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
        }
      },
      {
        id: 'prof-trainee-05',
        referenceCode: 'SKHM-TRN3-2233-4455',
        referredByCode: 'SKHM-HLR2-3344-5566',
        transferredCode: '',
        name: 'Rajeshwari Joshi',
        phone: '+91 98560 88990',
        email: 'rajeshwari.j@trainee.org',
        profileType: 'TRAINEE',
        level: 3,
        isPaid: true,
        paymentStatus: 'PAID',
        objective: 'Negativity fumigation and Pitru Rin Mukti fire rituals.',
        selectedRemedies: ['negativity', 'karmic_debts'],
        address: '24 Navrangpura',
        city: 'Ahmedabad, Gujarat',
        joinDate: '2024-07-22',
        isActive: true,
        notes: 'Specializing in Bakhoor cleansing.',
        categoryTag: 'Trainee Sadhak',
        seekerDiagnostics: { afflictionDuration: '1 Year', kuldeviIssues: 'Blessings restored', targetOutcome: 'Level 2 Sadhana completion' },
        interestedSadhanas: [{ id: 'negativity', name: 'Negativity Cleansing', category: 'Cleansing & Healing', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-t5-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'APPROVED', cleanPercentage: 90, cleanedDetails: 'Full fumigation with pure Loban & Bakhoor.', mentorCode: 'SKHM-HLR2-3344-5566', mentorName: 'Acharya Devendra', mentorRemarks: 'Good energetic shift.', approvalDate: '2024-08-01' }
        ],
        traineeSadhanas: [
          { id: 'ts-t5-1', sadhanaKey: 'negativity', title: 'Negativity Cleansing (Bakhoor)', categoryDomain: 'cleansing', isPaid: true, paymentStatus: 'PAID', level: 'Level 2 — Mantra Diksha', dailyTarget: 'Dusk Fumigation', currentStreak: '12 Days', progressPercent: 70, status: 'In Progress', mentorCode: 'SKHM-HLR2-3344-5566', diaryNotes: 'Atmosphere purified.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Rajeshwari Joshi', selfTitle: 'Trainee Sadhak', spouseName: 'Manish Joshi', children: [], siblings: [] },
          husbandAncestral: { fatherName: 'Kirit Joshi', motherName: 'Bhavana Joshi', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: 'Ahmedabad' },
          wifeAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
        }
      },
      {
        id: 'prof-trainee-06',
        referenceCode: 'SKHM-TRN3-6677-8899',
        referredByCode: 'SKHM-HLR2-5566-7788',
        transferredCode: '',
        name: 'Rohan Verma',
        phone: '+91 98670 99001',
        email: 'rohan.verma@trainee.org',
        profileType: 'TRAINEE',
        level: 3,
        isPaid: true,
        paymentStatus: 'PAID',
        objective: 'Kaal Bhairav protection and family aura fortification.',
        selectedRemedies: ['kalashtami', 'nazar_suraksha'],
        address: '55 Gomti Nagar',
        city: 'Lucknow, UP',
        joinDate: '2024-08-05',
        isActive: true,
        notes: 'Trainee guided by Maa Anandita Devi.',
        categoryTag: 'Trainee Sadhak',
        seekerDiagnostics: { afflictionDuration: '3 Years', kuldeviIssues: 'Puja scheduled', targetOutcome: 'Astral shield mastery' },
        interestedSadhanas: [{ id: 'kalashtami', name: 'Kalashtami Bhairav Sadhana', category: 'Sacred Sadhana', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-t6-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'APPROVED', cleanPercentage: 85, cleanedDetails: '4-wick mustard lamp protection established.', mentorCode: 'SKHM-HLR2-5566-7788', mentorName: 'Maa Anandita Devi', mentorRemarks: 'Protection seal active.', approvalDate: '2024-08-10' }
        ],
        traineeSadhanas: [
          { id: 'ts-t6-1', sadhanaKey: 'kalashtami', title: 'Kalashtami Bhairav Sadhana', categoryDomain: 'sadhanas', isPaid: true, paymentStatus: 'PAID', level: 'Level 2 — Mantra Diksha', dailyTarget: '11 Malas Night Sandhya', currentStreak: '9 Days', progressPercent: 60, status: 'In Progress', mentorCode: 'SKHM-HLR2-5566-7788', diaryNotes: 'Fear banished.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Rohan Verma', selfTitle: 'Trainee Sadhak', spouseName: '', children: [], siblings: [] },
          husbandAncestral: { fatherName: 'Dr. S. K. Verma', motherName: 'Rekha Verma', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: 'Lucknow' },
          wifeAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
        }
      },
      {
        id: 'prof-trainee-07',
        referenceCode: 'SKHM-TRN3-7788-9900',
        referredByCode: 'SKHM-HLR2-5566-7788',
        transferredCode: '',
        name: 'Priya Sharma',
        phone: '+91 98780 11223',
        email: 'priya.sharma@trainee.org',
        profileType: 'TRAINEE',
        level: 3,
        isPaid: false,
        paymentStatus: 'FREE',
        objective: 'Aura strengthening and business obstacle removal.',
        selectedRemedies: ['aura_strengthening', 'business_money'],
        address: '19 Vasant Vihar',
        city: 'New Delhi',
        joinDate: '2024-08-12',
        isActive: true,
        notes: 'Dedicated sadhak in crystal and Gayatri practices.',
        categoryTag: 'Trainee Sadhak',
        seekerDiagnostics: { afflictionDuration: '6 Months', kuldeviIssues: 'None', targetOutcome: 'Aura energy stabilization' },
        interestedSadhanas: [{ id: 'aura_strengthening', name: 'Aura Strengthening', category: 'Cleansing & Healing', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-t7-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'APPROVED', cleanPercentage: 80, cleanedDetails: 'Sphatik crystal water harmonization.', mentorCode: 'SKHM-HLR2-5566-7788', mentorName: 'Maa Anandita Devi', mentorRemarks: 'Good progress.', approvalDate: '2024-08-16' }
        ],
        traineeSadhanas: [
          { id: 'ts-t7-1', sadhanaKey: 'aura_strengthening', title: 'Aura Strengthening & Psychic Shield', categoryDomain: 'cleansing', isPaid: false, paymentStatus: 'FREE', level: 'Level 1 — Initiation', dailyTarget: '24 Gayatri Chants', currentStreak: '6 Days', progressPercent: 50, status: 'In Progress', mentorCode: 'SKHM-HLR2-5566-7788', diaryNotes: 'Calm mind felt.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Priya Sharma', selfTitle: 'Trainee Sadhak', spouseName: '', children: [], siblings: [] },
          husbandAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' },
          wifeAncestral: { fatherName: 'V. K. Sharma', motherName: 'Saroj Sharma', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: 'Delhi' }
        }
      },

      // ==========================================
      // TIER 4: DEVOTEE / SEEKER (PERSONAL & HOUSE CLEAN)
      // ==========================================
      {
        id: 'prof-devotee-08',
        referenceCode: 'SKHM-DEV4-9988-1122',
        referredByCode: 'SKHM-TRN3-1122-3344',
        transferredCode: '',
        name: 'Sunita Mehra',
        phone: '+91 97110 55443',
        email: 'sunita.mehra@devotee.org',
        profileType: 'DEVOTEE',
        level: 4,
        isPaid: false,
        paymentStatus: 'FREE',
        objective: 'Overcoming household stress, learning 3 Diya process, and purifying ancestral karma.',
        selectedRemedies: ['three_diya', 'negativity'],
        address: '108 Shanti Niketan',
        city: 'Jaipur, Rajasthan',
        joinDate: '2024-08-01',
        isActive: true,
        notes: 'Dedicated devotee initiated into Level 1 House Clean.',
        categoryTag: 'Devotee Seeker',
        seekerDiagnostics: { afflictionDuration: '3 Years', kuldeviIssues: 'Kuldevi Puja pending', targetOutcome: 'Peace of mind and family health' },
        interestedSadhanas: [{ id: 'three_diya', name: 'Three Diya Process', category: 'Divine Remedy', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-d8-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'IN_PROGRESS', cleanPercentage: 50, cleanedDetails: 'Purifying main doorway and altar daily.', mentorCode: 'SKHM-TRN3-1122-3344', mentorName: 'Amitabh Sen', mentorRemarks: 'Good progress.', approvalDate: 'Pending' }
        ],
        traineeSadhanas: [
          { id: 'ts-d8-1', sadhanaKey: 'three_diya', title: 'Three Diya Process', categoryDomain: 'remedies', isPaid: false, paymentStatus: 'FREE', level: 'Level 1 — Initiation', dailyTarget: '3 Diyas at Dusk', currentStreak: '7 Days', progressPercent: 35, status: 'In Progress', mentorCode: 'SKHM-TRN3-1122-3344', diaryNotes: 'Noticed positive shift in home.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Sunita Mehra', selfTitle: 'Devotee Seeker', spouseName: 'Ramesh Mehra', children: [], siblings: [] },
          husbandAncestral: { fatherName: 'Om Prakash Mehra', motherName: 'Kanti Mehra', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: 'Jaipur, Rajasthan' },
          wifeAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
        }
      },
      {
        id: 'prof-devotee-09',
        referenceCode: 'SKHM-DEV4-3322-1100',
        referredByCode: 'SKHM-TRN3-1122-3344',
        transferredCode: '',
        name: 'Deepak Saxena',
        phone: '+91 97220 66554',
        email: 'deepak.saxena@devotee.org',
        profileType: 'DEVOTEE',
        level: 4,
        isPaid: true,
        paymentStatus: 'PAID',
        objective: 'Business growth, stuck payments recovery, and Sri Yantra worship.',
        selectedRemedies: ['business_money', 'sri_yantra'],
        address: '77 Arera Colony',
        city: 'Bhopal, MP',
        joinDate: '2024-08-15',
        isActive: true,
        notes: 'Devotee seeking financial stability and Lakshmi blessings.',
        categoryTag: 'Devotee Seeker',
        seekerDiagnostics: { afflictionDuration: '1.5 Years', kuldeviIssues: 'Kuldevi Puja Done', targetOutcome: 'Clear business debt' },
        interestedSadhanas: [{ id: 'business_money', name: 'Business & Wealth Upaya', category: 'Divine Remedy', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-d9-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'IN_PROGRESS', cleanPercentage: 40, cleanedDetails: 'Clearing commercial shop cash altar.', mentorCode: 'SKHM-TRN3-1122-3344', mentorName: 'Amitabh Sen', mentorRemarks: 'Under guidance.', approvalDate: 'Pending' }
        ],
        traineeSadhanas: [
          { id: 'ts-d9-1', sadhanaKey: 'business_money', title: 'Business & Wealth Upaya', categoryDomain: 'remedies', isPaid: true, paymentStatus: 'PAID', level: 'Level 1 — Initiation', dailyTarget: 'Friday Silver Diya', currentStreak: '4 Days', progressPercent: 30, status: 'In Progress', mentorCode: 'SKHM-TRN3-1122-3344', diaryNotes: 'Payments started unlocking.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Deepak Saxena', selfTitle: 'Devotee Seeker', spouseName: 'Neelam Saxena', children: [], siblings: [] },
          husbandAncestral: { fatherName: 'J. P. Saxena', motherName: 'Maya Saxena', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: 'Bhopal' },
          wifeAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
        }
      },
      {
        id: 'prof-devotee-10',
        referenceCode: 'SKHM-DEV4-4433-2211',
        referredByCode: 'SKHM-TRN3-2233-4455',
        transferredCode: '',
        name: 'Aarohi Patel',
        phone: '+91 97330 77665',
        email: 'aarohi.patel@devotee.org',
        profileType: 'DEVOTEE',
        level: 4,
        isPaid: false,
        paymentStatus: 'FREE',
        objective: 'House Clean Level 1 and family peace.',
        selectedRemedies: ['three_diya', 'healing'],
        address: '33 Ring Road',
        city: 'Surat, Gujarat',
        joinDate: '2024-08-20',
        isActive: true,
        notes: 'Devotee practicing daily sunset 3-diya purification.',
        categoryTag: 'Devotee Seeker',
        seekerDiagnostics: { afflictionDuration: '8 Months', kuldeviIssues: 'Pending', targetOutcome: 'Calm household environment' },
        interestedSadhanas: [{ id: 'three_diya', name: 'Three Diya Process', category: 'Divine Remedy', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-d10-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'IN_PROGRESS', cleanPercentage: 30, cleanedDetails: 'Purifying main entryway with sea salt.', mentorCode: 'SKHM-TRN3-2233-4455', mentorName: 'Rajeshwari Joshi', mentorRemarks: 'Under review.', approvalDate: 'Pending' }
        ],
        traineeSadhanas: [
          { id: 'ts-d10-1', sadhanaKey: 'three_diya', title: 'Three Diya Process', categoryDomain: 'remedies', isPaid: false, paymentStatus: 'FREE', level: 'Level 1 — Initiation', dailyTarget: '3 Diyas at Sunset', currentStreak: '5 Days', progressPercent: 25, status: 'In Progress', mentorCode: 'SKHM-TRN3-2233-4455', diaryNotes: 'Peace observed.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Aarohi Patel', selfTitle: 'Devotee Seeker', spouseName: '', children: [], siblings: [] },
          husbandAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' },
          wifeAncestral: { fatherName: 'Nitin Patel', motherName: 'Geeta Patel', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: 'Surat' }
        }
      },
      {
        id: 'prof-devotee-11',
        referenceCode: 'SKHM-DEV4-5544-3322',
        referredByCode: 'SKHM-TRN3-6677-8899',
        transferredCode: '',
        name: 'Meera Nair',
        phone: '+91 97440 88776',
        email: 'meera.nair@devotee.org',
        profileType: 'DEVOTEE',
        level: 4,
        isPaid: true,
        paymentStatus: 'PAID',
        objective: 'Spiritual protection, evil eye shielding, and aura fortification.',
        selectedRemedies: ['nazar_suraksha', 'aura_strengthening'],
        address: '5 Marine Drive',
        city: 'Kochi, Kerala',
        joinDate: '2024-08-22',
        isActive: true,
        notes: 'Devotee practicing daily Nazar Suraksha rituals.',
        categoryTag: 'Devotee Seeker',
        seekerDiagnostics: { afflictionDuration: '2 Years', kuldeviIssues: 'Done', targetOutcome: 'Dissolve physical exhaustion' },
        interestedSadhanas: [{ id: 'nazar_suraksha', name: 'Nazar Suraksha & Evil Eye Shield', category: 'Cleansing & Healing', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-d11-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'IN_PROGRESS', cleanPercentage: 45, cleanedDetails: 'Rai and salt cleansing twice weekly.', mentorCode: 'SKHM-TRN3-6677-8899', mentorName: 'Rohan Verma', mentorRemarks: 'Good energetic clearance.', approvalDate: 'Pending' }
        ],
        traineeSadhanas: [
          { id: 'ts-d11-1', sadhanaKey: 'nazar_suraksha', title: 'Nazar Suraksha & Evil Eye Shield', categoryDomain: 'cleansing', isPaid: true, paymentStatus: 'PAID', level: 'Level 1 — Initiation', dailyTarget: 'Tuesday & Saturday Godhuli Bela', currentStreak: '6 Days', progressPercent: 40, status: 'In Progress', mentorCode: 'SKHM-TRN3-6677-8899', diaryNotes: 'Headaches relieved.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Meera Nair', selfTitle: 'Devotee Seeker', spouseName: 'Ajay Nair', children: [], siblings: [] },
          husbandAncestral: { fatherName: 'Madhavan Nair', motherName: 'Lalitha Nair', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: 'Kochi' },
          wifeAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
        }
      },
      {
        id: 'prof-devotee-12',
        referenceCode: 'SKHM-DEV4-6655-4433',
        referredByCode: 'SKHM-TRN3-7788-9900',
        transferredCode: '',
        name: 'Suresh Rao',
        phone: '+91 97550 99887',
        email: 'suresh.rao@devotee.org',
        profileType: 'DEVOTEE',
        level: 4,
        isPaid: false,
        paymentStatus: 'FREE',
        objective: 'Ancestral Rin Mukti and positive vibration in home.',
        selectedRemedies: ['karmic_debts', 'three_diya'],
        address: '101 Indiranagar',
        city: 'Bengaluru, Karnataka',
        joinDate: '2024-08-25',
        isActive: true,
        notes: 'Devotee initiated by Priya Sharma.',
        categoryTag: 'Devotee Seeker',
        seekerDiagnostics: { afflictionDuration: '1 Year', kuldeviIssues: 'Under consultation', targetOutcome: 'Debt settlement and harmony' },
        interestedSadhanas: [{ id: 'karmic_debts', name: 'Karmic Debts Fire Cleansing', category: 'Divine Remedy', priority: 'High', status: 'Enrolled' }],
        houseCleanLevels: [
          { id: 'hc-d12-1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'IN_PROGRESS', cleanPercentage: 20, cleanedDetails: 'Commencing Rin Mukteshwar havan.', mentorCode: 'SKHM-TRN3-7788-9900', mentorName: 'Priya Sharma', mentorRemarks: 'First cycle active.', approvalDate: 'Pending' }
        ],
        traineeSadhanas: [
          { id: 'ts-d12-1', sadhanaKey: 'karmic_debts', title: 'Karmic Debts Fire Cleansing', categoryDomain: 'remedies', isPaid: false, paymentStatus: 'FREE', level: 'Level 1 — Initiation', dailyTarget: 'Tuesday Havan', currentStreak: '2 Days', progressPercent: 20, status: 'In Progress', mentorCode: 'SKHM-TRN3-7788-9900', diaryNotes: 'Red lentils offering done.' }
        ],
        healerCompletedSadhanas: [],
        healerNetwork: [],
        lineage: {
          currentFamily: { selfName: 'Suresh Rao', selfTitle: 'Devotee Seeker', spouseName: 'Shalini Rao', children: [], siblings: [] },
          husbandAncestral: { fatherName: 'Venkatesh Rao', motherName: 'Padma Rao', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: 'Bengaluru' },
          wifeAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
        }
      }
    ];
  }

  _loadProfiles() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length >= 8 && parsed.some(p => p.profileType === 'TRAINEE' || p.level === 3 || p.level === 4)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error loading profiles from localStorage', e);
    }
    const defaults = this._getDefaultProfiles();
    this.saveProfiles(defaults);
    return defaults;
  }

  saveProfiles(profiles) {
    this.profiles = profiles;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.profiles));
    } catch (e) {
      console.error('Error saving profiles to localStorage', e);
    }
  }

  getActiveProfile() {
    return this.profiles.find(p => p.id === this.activeProfileId) || this.profiles[0];
  }

  setActiveProfileId(id) {
    this.activeProfileId = id;
    localStorage.setItem(this.activeProfileIdKey, id);
  }

  updateActiveProfile(updatedData) {
    const idx = this.profiles.findIndex(p => p.id === this.activeProfileId);
    if (idx > -1) {
      this.profiles[idx] = { ...this.profiles[idx], ...updatedData };
      this.saveProfiles(this.profiles);
      return this.profiles[idx];
    }
    return null;
  }

  createNewProfile() {
    const newId = 'prof-' + Date.now();
    const newRefCode = this.generate16DigitCode('SKHM');
    const newProfile = {
      id: newId,
      referenceCode: newRefCode,
      referredByCode: 'ROOT-0000-0000-0000',
      transferredCode: '',
      name: 'New Devotee Seeker',
      phone: '+91 ',
      email: '',
      profileType: this.roleMode === 'HEALER' ? 'HEALER' : 'DEVOTEE',
      level: this.roleMode === 'HEALER' ? 2 : 5,
      isPaid: false,
      paymentStatus: 'FREE',
      objective: 'Spiritual purification, House Clean, and Sadhana initiation.',
      selectedRemedies: ['three_diya', 'negativity'],
      address: '',
      city: '',
      joinDate: new Date().toISOString().split('T')[0],
      isActive: true,
      notes: '',
      categoryTag: 'House Clean & Seekers',
      seekerDiagnostics: { afflictionDuration: '', kuldeviIssues: '', targetOutcome: '' },
      interestedSadhanas: [
        { id: 'three_diya', name: 'Three Diya Process', category: 'Divine Remedy', priority: 'High', status: 'Interested' }
      ],
      houseCleanLevels: [
        { id: 'hc-n1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'NOT_STARTED', cleanPercentage: 0, cleanedDetails: '', mentorCode: null, mentorName: null, mentorRemarks: null, approvalDate: null },
        { id: 'hc-n2', levelNumber: 2, levelTitle: 'Level 2 — Parents House Clean', status: 'NOT_STARTED', cleanPercentage: 0, cleanedDetails: '', mentorCode: null, mentorName: null, mentorRemarks: null, approvalDate: null },
        { id: 'hc-n3', levelNumber: 3, levelTitle: 'Level 3 — Relative House Clean', status: 'NOT_STARTED', cleanPercentage: 0, cleanedDetails: '', mentorCode: null, mentorName: null, mentorRemarks: null, approvalDate: null }
      ],
      traineeSadhanas: [],
      healerCompletedSadhanas: [],
      healerNetwork: [],
      lineage: {
        currentFamily: { selfName: 'New Devotee Seeker', selfTitle: 'Devotee Seeker', spouseName: '', children: [], siblings: [] },
        husbandAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' },
        wifeAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
      }
    };

    this.profiles.push(newProfile);
    this.saveProfiles(this.profiles);
    this.setActiveProfileId(newId);
    return newProfile;
  }

  deleteActiveProfile() {
    if (this.profiles.length <= 1) {
      alert('Cannot delete the only remaining profile.');
      return false;
    }
    this.profiles = this.profiles.filter(p => p.id !== this.activeProfileId);
    this.activeProfileId = this.profiles[0].id;
    this.saveProfiles(this.profiles);
    return true;
  }

  generate16DigitCode(prefix = 'SKHM') {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const segment = (len) => {
      let res = '';
      for (let i = 0; i < len; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return res;
    };
    return `${prefix}-${segment(4)}-${segment(4)}-${segment(4)}`;
  }

  /**
   * Transfer / Send an enrolled sadhana directly to Trainee Sadhak In-Progress
   */
  sendSadhanaToTrainee(sadhanaKeyOrObj) {
    const profile = this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];

    const key = typeof sadhanaKeyOrObj === 'string' ? sadhanaKeyOrObj : (sadhanaKeyOrObj.id || sadhanaKeyOrObj.sadhanaKey);
    const catalogItem = SADHANA_CATALOG[key] || {
      id: key,
      title: sadhanaKeyOrObj.name || key,
      category: sadhanaKeyOrObj.category || 'Sacred Sadhana',
      domain: 'sadhanas',
      timing: 'Daily Practice',
      mantra: 'Om Namah Shivaya'
    };

    const existingIdx = profile.traineeSadhanas.findIndex(ts => ts.sadhanaKey === key || (ts.id && ts.id === key) || ts.title.toLowerCase() === catalogItem.title.toLowerCase());
    const nowStamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (existingIdx === -1) {
      profile.traineeSadhanas.push({
        id: 'ts-' + Date.now().toString().slice(-4),
        sadhanaKey: key,
        title: catalogItem.title,
        categoryDomain: catalogItem.domain || 'sadhanas',
        isPaid: profile.isPaid !== false && profile.paymentStatus !== 'FREE',
        paymentStatus: profile.isPaid !== false && profile.paymentStatus !== 'FREE' ? 'PAID' : 'FREE',
        level: 'Level 1 — Novice Initiation',
        dailyTarget: catalogItem.domain === 'remedies' ? 'Daily Sunset Protocol' : (catalogItem.domain === 'cleansing' ? 'Morning / Dusk Routine' : (this.settings?.defaultTargetMalas || '11 Malas Daily')),
        currentStreak: this.settings?.defaultSadhanaStreak || '1 Day',
        progressPercent: 20,
        status: 'In Progress',
        mentorCode: profile.referredByCode || this.settings?.defaultMentorCode || 'SKHM-ADM1-7788-9900',
        diaryNotes: `Attunement active. Timing: ${catalogItem.timing || 'Brahma Muhurta'}. Mantra: ${catalogItem.mantra || 'Om Namah Shivaya'}`,
        memos: [
          {
            date: nowStamp,
            author: this.settings?.defaultMentorName || 'Mentor Guide',
            text: `Enrolled & initiated into ${catalogItem.title}. Timing: ${catalogItem.timing || 'Daily'}. Mantra frequency synchronized.`
          }
        ]
      });
    } else {
      if (!profile.traineeSadhanas[existingIdx].categoryDomain) {
        profile.traineeSadhanas[existingIdx].categoryDomain = catalogItem.domain || 'sadhanas';
      }
    }

    if (!profile.selectedRemedies.includes(key)) {
      profile.selectedRemedies.push(key);
    }
    const hasEnrolled = profile.interestedSadhanas.some(is => is.id === key || is.name === catalogItem.title);
    if (!hasEnrolled) {
      profile.interestedSadhanas.push({
        id: key,
        name: catalogItem.title,
        category: catalogItem.category,
        priority: 'High',
        status: 'In Progress',
        isPaid: profile.isPaid !== false && profile.paymentStatus !== 'FREE',
        paymentStatus: profile.isPaid !== false && profile.paymentStatus !== 'FREE' ? 'PAID' : 'FREE'
      });
    }

    this.saveProfiles(this.profiles);
    return catalogItem;
  }

  addTraineeMemo(itemId, memoText, author = null, isVerification = false, type = 'NORMAL') {
    const profile = this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find(s => s.id === itemId);
    if (item) {
      if (!item.memos) item.memos = [];
      const nowStamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const finalAuthor = author || (this.getRoleMode() === 'MASTER' ? (this.settings?.defaultMentorName || 'Master Karim') : (profile.name || 'Devotee Sadhak'));
      item.memos.push({
        date: nowStamp,
        author: finalAuthor,
        text: memoText,
        isVerification: isVerification,
        type: type
      });
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  requestTraineeVerification(itemId, customNote = '') {
    const profile = this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find(s => s.id === itemId);
    if (item) {
      const nowStamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      item.verificationStatus = 'PENDING_APPROVAL';
      item.verificationRequestedDate = nowStamp;
      const author = profile.name || 'Devotee Sadhak';
      const sponsorCode = item.mentorCode || profile.referredByCode || this.settings?.defaultMentorCode || 'SKHM-ADM1-7788-9900';
      const note = customNote || `[VERIFICATION REQUESTED] Sadhak submitted ${item.progressPercent || 0}% progress (${item.currentStreak || '1 Day'}) to upline (${sponsorCode}) for approval seal.`;
      
      this.addTraineeMemo(itemId, note, author, true, 'PENDING');
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  approveTraineeVerification(itemId, mentorName = null, mentorCode = null) {
    const profile = this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find(s => s.id === itemId);
    if (item) {
      const nowStamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const activeMentor = mentorName || this.settings?.defaultMentorName || 'Karim Ji (Founder)';
      const activeCode = mentorCode || this.settings?.defaultMentorCode || 'SKHM-ADM1-7788-9900';

      item.verificationStatus = 'VERIFIED';
      item.verifiedDate = nowStamp;
      item.verifiedBy = activeMentor;
      item.verifiedCode = activeCode;
      item.verifiedPercent = item.progressPercent || 100;
      
      const note = `[APPROVED BY UPLINE] ${activeMentor} (${activeCode}) verified and officially sealed ${item.progressPercent || 0}% progress advancement!`;
      this.addTraineeMemo(itemId, note, activeMentor, true, 'VERIFIED');
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  rejectTraineeVerification(itemId, reason = '', mentorName = null) {
    const profile = this.getActiveProfile();
    if (!profile.traineeSadhanas) profile.traineeSadhanas = [];
    const item = profile.traineeSadhanas.find(s => s.id === itemId);
    if (item) {
      item.verificationStatus = 'UNVERIFIED';
      const activeMentor = mentorName || this.settings?.defaultMentorName || 'Karim Ji (Founder)';
      const note = `[REVISION REQUESTED] Upline Mentor Guidance: ${reason || 'Please complete additional daily malas before reapplying for the verification seal.'}`;
      this.addTraineeMemo(itemId, note, activeMentor, true, 'REVISION');
      this.saveProfiles(this.profiles);
      return item;
    }
    return null;
  }

  // ==========================================
  // 4-PHASE APP SHARING & 24-HOUR PAIRING PROTOCOL (ENTERPRISE UPGRADED)
  // ==========================================

  /**
   * Cycle Detection: Prevents self-pairing or circular upline/downline relationships
   */
  validateLineageRelationship(sponsorCode, candidateCode) {
    if (!sponsorCode || !candidateCode) return { valid: true };
    const cleanSponsor = sponsorCode.trim().toUpperCase();
    const cleanCandidate = candidateCode.trim().toUpperCase();

    if (cleanSponsor === cleanCandidate) {
      return { valid: false, reason: 'Self-pairing is prohibited. Sponsor code cannot match candidate code.' };
    }

    // Traverse upwards from sponsor to verify candidate is not an ancestor of sponsor
    let current = cleanSponsor;
    const visited = new Set([cleanSponsor]);
    while (current && current !== 'ROOT-0000-0000-0000') {
      const prof = this.profiles.find(p => (p.referenceCode || '').toUpperCase() === current);
      if (!prof || !prof.referredByCode) break;
      const parent = prof.referredByCode.toUpperCase();
      if (parent === cleanCandidate) {
        return { valid: false, reason: `Circular lineage detected: ${cleanCandidate} is already an upline mentor of ${cleanSponsor}.` };
      }
      if (visited.has(parent)) break;
      visited.add(parent);
      current = parent;
    }

    return { valid: true };
  }

  /**
   * Calculate exponential backoff cooldown for pairing resends (60s -> 180s -> 600s)
   */
  getResendCooldownRemaining(item) {
    if (!item || !item.lastResendTimestamp) return 0;
    const count = item.resendCount || 0;
    let requiredCooldownMs = 0;
    if (count === 1) requiredCooldownMs = 60 * 1000;
    else if (count === 2) requiredCooldownMs = 180 * 1000;
    else if (count >= 3) requiredCooldownMs = 600 * 1000;

    const elapsed = Date.now() - item.lastResendTimestamp;
    const remainingMs = requiredCooldownMs - elapsed;
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  }

  /**
   * Live Firebase Realtime Database Telemetry Logger
   */
  async logDeviceEvent(deviceId, logType, message, details = {}, severity = 'INFO') {
    const payload = {
      deviceId: deviceId || 'WEB-ADMIN-DASHBOARD',
      logType: logType || 'SYSTEM_EVENT',
      message: message || '',
      severity: severity,
      timestamp: { ".sv": "timestamp" },
      clientTimestampMs: Date.now(),
      details: details
    };

    const firebaseUrl = this.settings?.firebaseUrl || 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/';
    const endpoint = `${firebaseUrl.replace(/\/$/, '')}/device_logs/${encodeURIComponent(deviceId || 'WEB_ADMIN')}.json`;

    try {
      if (navigator.onLine) {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => this._enqueueOfflineSync('DEVICE_LOG', payload));
      } else {
        this._enqueueOfflineSync('DEVICE_LOG', payload);
      }
    } catch (err) {
      this._enqueueOfflineSync('DEVICE_LOG', payload);
    }
  }

  /**
   * Offline Sync Queue Manager
   */
  _enqueueOfflineSync(type, payload) {
    try {
      const q = JSON.parse(localStorage.getItem('sk_offline_sync_queue') || '[]');
      q.push({ id: 'sq-' + Date.now(), type, payload, queuedAt: Date.now() });
      localStorage.setItem('sk_offline_sync_queue', JSON.stringify(q));
    } catch (e) {
      console.warn('Could not enqueue offline sync', e);
    }
  }

  async flushOfflineSyncQueue() {
    if (!navigator.onLine) return;
    try {
      const raw = localStorage.getItem('sk_offline_sync_queue');
      if (!raw) return;
      const q = JSON.parse(raw);
      if (!Array.isArray(q) || q.length === 0) return;

      const firebaseUrl = this.settings?.firebaseUrl || 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/';
      const remaining = [];

      for (const item of q) {
        try {
          if (item.type === 'DEVICE_LOG') {
            await fetch(`${firebaseUrl.replace(/\/$/, '')}/device_logs/${encodeURIComponent(item.payload.deviceId || 'WEB')}.json`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.payload)
            });
          } else if (item.type === 'PAIRING_INVITE') {
            await fetch(`${firebaseUrl.replace(/\/$/, '')}/pairing_invites/${encodeURIComponent(item.payload.id)}.json`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.payload)
            });
          }
        } catch (e) {
          remaining.push(item);
        }
      }

      localStorage.setItem('sk_offline_sync_queue', JSON.stringify(remaining));
    } catch (e) {
      console.warn('Error flushing offline sync queue', e);
    }
  }

  getPairingInvites() {
    try {
      const stored = localStorage.getItem('spiritual_karim_pairing_invites');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load pairing invites', e);
    }
    const defaultInvites = [
      {
        id: 'inv-01',
        sponsorCode: 'SKHM-ADM1-7788-9900',
        seekerName: 'Ananya Sharma',
        seekerPhone: '+91 98112 33445',
        seekerDeviceModel: 'Samsung Galaxy SM-G998B',
        hardwareNonce: 'HW-FPRINT-8891-9921',
        telegramLink: 'https://t.me/SpiritualKarimBot?start=pair_SKHMADM177889900',
        apkDownloadUrl: 'https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk',
        createdAtMs: Date.now() - 3600000,
        expiresAtMs: Date.now() + 23 * 3600000,
        status: 'PENDING',
        resendCount: 0,
        lastResendTimestamp: Date.now() - 3600000,
        formattedCreatedTime: 'Today • 1h ago'
      },
      {
        id: 'inv-02',
        sponsorCode: 'SKHM-ADM1-7788-9900',
        seekerName: 'Vikram Aditya',
        seekerPhone: '+91 98223 44556',
        seekerDeviceModel: 'OnePlus 11 5G',
        hardwareNonce: 'HW-FPRINT-1122-3344',
        telegramLink: 'https://t.me/SpiritualKarimBot?start=pair_SKHMADM177889900',
        apkDownloadUrl: 'https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk',
        createdAtMs: Date.now() - 86400000,
        expiresAtMs: Date.now() - 1000,
        status: 'EXPIRED',
        resendCount: 1,
        lastResendTimestamp: Date.now() - 86400000,
        formattedCreatedTime: 'Yesterday'
      }
    ];
    this.savePairingInvites(defaultInvites);
    return defaultInvites;
  }

  savePairingInvites(invites) {
    try {
      localStorage.setItem('spiritual_karim_pairing_invites', JSON.stringify(invites));
    } catch (e) {
      console.warn('Could not save pairing invites', e);
    }
  }

  createPairingInvite({ seekerName, seekerPhone, deviceModel, candidateCode = null }) {
    const invites = this.getPairingInvites();
    const profile = this.getActiveProfile();
    const sponsorCode = profile.referenceCode || 'SKHM-ADM1-7788-9900';

    // 1. Lineage Cycle & Self-Pairing Check
    const lineageValidation = this.validateLineageRelationship(sponsorCode, candidateCode);
    if (!lineageValidation.valid) {
      return { error: true, message: lineageValidation.reason };
    }

    // 2. Downline Capacity Throttle: Max 5 active pending invites per mentor
    const activePending = invites.filter(i => i.sponsorCode === sponsorCode && i.status === 'PENDING');
    if (activePending.length >= 5) {
      return { error: true, message: 'Invite quota reached: Maximum 5 pending pairing requests allowed simultaneously per mentor. Approve or reject pending requests first.' };
    }

    const cleanCode = sponsorCode.replace(/[^a-zA-Z0-9]/g, '');
    const hardwareNonce = 'HW-' + Math.random().toString(36).substr(2, 6).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
    
    const newInvite = {
      id: 'inv-' + Date.now().toString(36),
      sponsorCode: sponsorCode,
      seekerName: seekerName || 'New Seeker',
      seekerPhone: seekerPhone || '+91 98000 00000',
      seekerDeviceModel: deviceModel || 'Android Device',
      hardwareNonce: hardwareNonce,
      telegramLink: `https://t.me/SpiritualKarimBot?start=pair_${cleanCode}`,
      apkDownloadUrl: 'https://github.com/jDroid-X/SpritualKarim/releases/latest/download/app-release.apk',
      createdAtMs: Date.now(),
      expiresAtMs: Date.now() + 24 * 60 * 60 * 1000,
      status: 'PENDING',
      resendCount: 0,
      lastResendTimestamp: Date.now(),
      formattedCreatedTime: 'Just Now'
    };

    invites.unshift(newInvite);
    this.savePairingInvites(invites);

    // Live Telemetry stream to Firebase Realtime Database
    this.logDeviceEvent(newInvite.hardwareNonce, 'PAIRING_REQUESTED', `New seeker "${newInvite.seekerName}" requested pairing under sponsor ${sponsorCode}`, newInvite);

    return newInvite;
  }

  approvePairingInvite(inviteId) {
    const invites = this.getPairingInvites();
    const item = invites.find(i => i.id === inviteId);
    if (item) {
      item.status = 'APPROVED';
      item.approvedAtMs = Date.now();
      this.savePairingInvites(invites);

      const profile = this.getActiveProfile();
      if (!profile.healerNetwork) profile.healerNetwork = [];

      const existsInNet = profile.healerNetwork.some(n => n.name === item.seekerName || (n.refCode && n.refCode === item.hardwareNonce));
      if (!existsInNet) {
        profile.healerNetwork.push({
          id: 'net-' + Date.now().toString().slice(-4),
          name: item.seekerName,
          refCode: item.hardwareNonce || this.generate16DigitCode('SKDV'),
          role: 'Devotee (Level 5)',
          activeCases: 1,
          phone: item.seekerPhone || '',
          deviceModel: item.seekerDeviceModel || ''
        });
      }

      // Ensure seeker exists as a registered Devotee profile in directory
      const existingProfile = this.profiles.find(p => p.name === item.seekerName || (item.seekerPhone && p.phone === item.seekerPhone));
      if (!existingProfile) {
        const newDevoteeProfile = {
          id: 'prof-dev-' + Date.now().toString(36),
          referenceCode: item.hardwareNonce || this.generate16DigitCode('SKDV'),
          referredByCode: profile.referenceCode || 'SKHM-ADM1-7788-9900',
          transferredCode: '',
          name: item.seekerName,
          phone: item.seekerPhone || '',
          email: '',
          profileType: 'DEVOTEE',
          level: 5,
          isPaid: false,
          paymentStatus: 'FREE',
          objective: 'Household cleansing, Three Diya practice, and ancestral karma resolution.',
          selectedRemedies: ['three_diya', 'negativity'],
          address: '',
          city: '',
          joinDate: new Date().toISOString().split('T')[0],
          isActive: true,
          notes: `Paired via 24h token with mentor ${profile.name} (${profile.referenceCode}). Device: ${item.seekerDeviceModel}`,
          categoryTag: 'House Clean & Seekers',
          seekerDiagnostics: { afflictionDuration: '', kuldeviIssues: '', targetOutcome: '' },
          interestedSadhanas: [
            { id: 'three_diya', name: 'Three Diya Process', category: 'Divine Remedy', priority: 'High', status: 'Interested' }
          ],
          houseCleanLevels: [
            { id: 'hc-d1', levelNumber: 1, levelTitle: 'Level 1 — Self House Clean', status: 'NOT_STARTED', cleanPercentage: 0, cleanedDetails: '', mentorCode: profile.referenceCode, mentorName: profile.name, mentorRemarks: null, approvalDate: null },
            { id: 'hc-d2', levelNumber: 2, levelTitle: 'Level 2 — Parents House Clean', status: 'NOT_STARTED', cleanPercentage: 0, cleanedDetails: '', mentorCode: profile.referenceCode, mentorName: profile.name, mentorRemarks: null, approvalDate: null },
            { id: 'hc-d3', levelNumber: 3, levelTitle: 'Level 3 — Relative House Clean', status: 'NOT_STARTED', cleanPercentage: 0, cleanedDetails: '', mentorCode: profile.referenceCode, mentorName: profile.name, mentorRemarks: null, approvalDate: null }
          ],
          traineeSadhanas: [],
          healerCompletedSadhanas: [],
          healerNetwork: [],
          lineage: {
            currentFamily: { selfName: item.seekerName, selfTitle: 'Devotee Sadhak', spouseName: '', children: [], siblings: [] },
            husbandAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' },
            wifeAncestral: { fatherName: '', motherName: '', paternalGrandfather: '', paternalGrandmother: '', maternalGrandfather: '', maternalGrandmother: '', siblings: [], address: '' }
          }
        };
        this.profiles.push(newDevoteeProfile);
      }

      this.saveProfiles(this.profiles);

      // Log verified approval to Firebase Realtime DB
      this.logDeviceEvent(item.hardwareNonce || item.id, 'PAIRING_APPROVED', `Pairing approved for "${item.seekerName}" by sponsor ${item.sponsorCode}`, item, 'SUCCESS');
      return item;
    }
    return null;
  }

  rejectPairingInvite(inviteId) {
    const invites = this.getPairingInvites();
    const item = invites.find(i => i.id === inviteId);
    if (item) {
      item.status = 'REJECTED';
      this.savePairingInvites(invites);
      this.logDeviceEvent(item.hardwareNonce || item.id, 'PAIRING_REJECTED', `Pairing rejected for "${item.seekerName}" by sponsor ${item.sponsorCode}`, item, 'WARNING');
      return item;
    }
    return null;
  }

  resendPairingInvite(inviteId) {
    const invites = this.getPairingInvites();
    const item = invites.find(i => i.id === inviteId);
    if (item) {
      // Exponential Backoff Check
      const cooldownSecs = this.getResendCooldownRemaining(item);
      if (cooldownSecs > 0) {
        return { error: true, message: `Resend rate-limited. Please wait ${cooldownSecs} seconds before requesting another token.`, remainingSecs: cooldownSecs };
      }

      item.createdAtMs = Date.now();
      item.expiresAtMs = Date.now() + 24 * 60 * 60 * 1000;
      item.status = 'PENDING';
      item.resendCount = (item.resendCount || 0) + 1;
      item.lastResendTimestamp = Date.now();
      item.formattedCreatedTime = 'Just Now (Refreshed)';
      this.savePairingInvites(invites);

      this.logDeviceEvent(item.hardwareNonce || item.id, 'PAIRING_RESENT', `24-Hour window refreshed for "${item.seekerName}" (Attempt #${item.resendCount})`, item);
      return item;
    }
    return null;
  }

  /**
   * Calculates Summary Metrics matching Android Compose HealersHubScreen
   */
  getSummaryMetrics(scopedList = null) {
    const list = scopedList || this.profiles;
    return {
      total: list.length,
      admin: list.filter(p => p.profileType === 'ADMIN' || p.level === 1).length,
      healers: list.filter(p => p.profileType === 'HEALER' || p.level === 2 || p.level === 3).length,
      trainees: list.filter(p => p.profileType === 'TRAINEE' || p.level === 4).length,
      devotees: list.filter(p => p.profileType === 'DEVOTEE' || p.level === 5).length
    };
  }

  /**
   * Returns Role-Scoped Relevant Profiles matching Android RBAC logic
   */
  getScopedProfiles(roleMode = null, activeProfile = null) {
    const role = roleMode || this.getRoleMode();
    const active = activeProfile || this.getActiveProfile();

    if (role === 'MASTER' || role === 'ADMIN') {
      // Top can see all bottoms
      return this.profiles;
    }

    if (role === 'HEALER') {
      // Healer sees self + all downlines below them. Bottom cannot see Level 1 Founder Master.
      const refCode = active.referenceCode || '';
      const downlineCodes = new Set([refCode]);
      let added = true;
      while (added) {
        added = false;
        for (const p of this.profiles) {
          if (p.referredByCode && downlineCodes.has(p.referredByCode) && !downlineCodes.has(p.referenceCode)) {
            downlineCodes.add(p.referenceCode);
            added = true;
          }
        }
      }
      return this.profiles.filter(p => p.id === active.id || downlineCodes.has(p.referenceCode));
    }

    if (role === 'TRAINEE') {
      // Trainee sees self + all downlines below them. Bottom cannot see Level 1..3 uplines.
      const refCode = active.referenceCode || '';
      const downlineCodes = new Set([refCode]);
      let added = true;
      while (added) {
        added = false;
        for (const p of this.profiles) {
          if (p.referredByCode && downlineCodes.has(p.referredByCode) && !downlineCodes.has(p.referenceCode)) {
            downlineCodes.add(p.referenceCode);
            added = true;
          }
        }
      }
      return this.profiles.filter(p => p.id === active.id || downlineCodes.has(p.referenceCode));
    }

    if (role === 'DEVOTEE') {
      // Devotee sees self + direct downlines. Cannot see higher upline levels.
      const refCode = active.referenceCode || '';
      return this.profiles.filter(p => p.id === active.id || p.referredByCode === refCode);
    }

    return this.profiles;
  }

  /**
   * Bi-Directional Firebase Realtime Database Synchronization
   */
  async fetchFromFirebaseRealtime() {
    const firebaseUrl = this.settings?.firebaseUrl || 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/';
    try {
      const resp = await fetch(`${firebaseUrl.replace(/\/$/, '')}/profiles.json`);
      if (resp.ok) {
        const cloudData = await resp.json();
        if (cloudData && typeof cloudData === 'object') {
          const remoteList = Object.values(cloudData);
          if (remoteList.length > 0) {
            let updated = false;
            remoteList.forEach(rp => {
              const idx = this.profiles.findIndex(p => p.id === rp.id || p.referenceCode === rp.referenceCode);
              if (idx === -1) {
                this.profiles.push(rp);
                updated = true;
              } else {
                this.profiles[idx] = { ...this.profiles[idx], ...rp };
                updated = true;
              }
            });
            if (updated) {
              this.saveProfiles(this.profiles);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Firebase RTDB sync notice:', e.message);
    }
  }

  async pushProfileToFirebase(profile) {
    if (!profile) return;
    const firebaseUrl = this.settings?.firebaseUrl || 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/';
    const nodeKey = (profile.id || profile.referenceCode || 'prof-' + Date.now()).replace(/[^a-zA-Z0-9_-]/g, '_');
    try {
      if (navigator.onLine) {
        await fetch(`${firebaseUrl.replace(/\/$/, '')}/profiles/${nodeKey}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
      }
    } catch (e) {
      this._enqueueOfflineSync('PROFILE_PUT', { key: nodeKey, profile });
    }
  }
}

// ==============================================================
// 3. VIEW LAYER
// ==============================================================
class ProfileView {
  constructor() {
    this.form = document.getElementById('profile-admin-form');
    this.selectActiveProfile = document.getElementById('select-active-profile');
    this.profileDirectoryList = document.getElementById('profile-directory-list');
    this.inputDirectorySearch = document.getElementById('input-directory-search');
    this.directorySearchQuery = '';

    // Role Switcher & RBAC Controls
    this.selectRoleMode = document.getElementById('select-role-mode');
    this.btnAdminSettings = document.getElementById('btn-admin-settings');
    this.adminSettingsModal = document.getElementById('admin-settings-modal');

    // Header Display Elements
    this.displayProfileName = document.getElementById('display-profile-name');
    this.displayRoleBadge = document.getElementById('display-role-badge');
    this.displayStatusPill = document.getElementById('display-status-pill');
    this.displayPaymentStamp = document.getElementById('display-payment-stamp');
    this.displayRefCode = document.getElementById('display-ref-code');
    this.displaySponsorCode = document.getElementById('display-sponsor-code');
    this.avatarInitials = document.getElementById('profile-avatar-initials');

    // Form Inputs - Identity
    this.inputProfileType = document.getElementById('input-profile-type');
    this.inputLevel = document.getElementById('input-level');
    this.inputCategoryTag = document.getElementById('input-category-tag');
    this.inputRefCode = document.getElementById('input-ref-code');
    this.inputSponsorCode = document.getElementById('input-sponsor-code');
    this.inputTransferCode = document.getElementById('input-transfer-code');
    this.inputIsActive = document.getElementById('input-is-active');
    this.inputPaymentStatus = document.getElementById('input-payment-status');
    this.inputJoinDate = document.getElementById('input-join-date');

    this.inputName = document.getElementById('input-name');
    this.inputSelfTitle = document.getElementById('input-self-title');
    this.inputPhone = document.getElementById('input-phone');
    this.inputEmail = document.getElementById('input-email');
    this.inputCity = document.getElementById('input-city');
    this.inputAddress = document.getElementById('input-address');
    this.inputNotes = document.getElementById('input-notes');

    // Seeker Purpose Inputs
    this.inputObjective = document.getElementById('input-objective');
    this.seekerAfflictionDuration = document.getElementById('seeker-affliction-duration');
    this.seekerKuldeviIssues = document.getElementById('seeker-kuldevi-issues');
    this.seekerTargetOutcome = document.getElementById('seeker-target-outcome');

    // Lineage Inputs
    this.lineageSelfName = document.getElementById('lineage-self-name');
    this.lineageSpouseName = document.getElementById('lineage-spouse-name');

    this.hFatherName = document.getElementById('h-father-name');
    this.hMotherName = document.getElementById('h-mother-name');
    this.hPaternalGf = document.getElementById('h-paternal-gf');
    this.hPaternalGm = document.getElementById('h-paternal-gm');
    this.hMaternalGf = document.getElementById('h-maternal-gf');
    this.hMaternalGm = document.getElementById('h-maternal-gm');
    this.hAddress = document.getElementById('h-address');

    this.wFatherName = document.getElementById('w-father-name');
    this.wMotherName = document.getElementById('w-mother-name');
    this.wPaternalGf = document.getElementById('w-paternal-gf');
    this.wPaternalGm = document.getElementById('w-paternal-gm');
    this.wMaternalGf = document.getElementById('w-maternal-gf');
    this.wMaternalGm = document.getElementById('w-maternal-gm');
    this.wAddress = document.getElementById('w-address');

    // Dynamic Containers
    this.childrenContainer = document.getElementById('children-list-container');
    this.siblingsCurrentContainer = document.getElementById('siblings-current-container');
    this.siblingsHusbandContainer = document.getElementById('siblings-husband-container');
    this.siblingsWifeContainer = document.getElementById('siblings-wife-container');

    this.devoteeHouseCleanContainer = document.getElementById('devotee-houseclean-container');
    this.seekerHouseCleanSummaryContainer = document.getElementById('seeker-houseclean-summary-container');
    this.interestedSadhanasContainer = document.getElementById('interested-sadhanas-container');
    
    // Categorized Trainee Containers & Active Detail Panel
    this.traineeGroupSadhanas = document.getElementById('trainee-sadhanas-group-sadhanas');
    this.traineeGroupRemedies = document.getElementById('trainee-sadhanas-group-remedies');
    this.traineeGroupCleansing = document.getElementById('trainee-sadhanas-group-cleansing');
    this.traineeActiveDetailContainer = document.getElementById('trainee-active-sadhana-detail');
    this.selectedTraineeId = null;

    this.healerCompletedSadhanasContainer = document.getElementById('healer-completed-sadhanas-container');
    this.healerNetworkContainer = document.getElementById('healer-network-container');

    // Slide-out Drawer & Modals
    this.sadhanaDrawer = document.getElementById('sadhana-detail-drawer');
    this.sadhanaDrawerBackdrop = document.getElementById('sadhana-drawer-backdrop');
    this.sadhanaDrawerTitle = document.getElementById('sadhana-drawer-title');
    this.sadhanaDrawerCategory = document.getElementById('sadhana-drawer-category');
    this.sadhanaDrawerIcon = document.getElementById('sadhana-drawer-icon');
    this.sadhanaDrawerBody = document.getElementById('sadhana-drawer-body');
    this.btnDrawerEnroll = document.getElementById('btn-drawer-enroll');
    this.btnDrawerSendTrainee = document.getElementById('btn-drawer-send-trainee');

    this.goliGyanModal = document.getElementById('goli-gyan-modal');
    this.jsonDrawer = document.getElementById('json-drawer');
    this.jsonDrawerBackdrop = document.getElementById('json-drawer-backdrop');
    this.jsonPreviewCode = document.getElementById('json-preview-code');
    this.importModal = document.getElementById('import-modal');
    this.toastEl = document.getElementById('admin-toast');

    // In-Body App Hierarchy Tree & Genealogy Canvas (Tab 5)
    this.tabGenealogyTree = document.getElementById('tab-genealogy-tree');
    this.mainTabTreeBtn = document.getElementById('main-tab-tree-btn');
    this.bodyTreeCanvasViewport = document.getElementById('body-tree-canvas-viewport');
    this.bodyTreeSurface = document.getElementById('body-tree-surface');
    this.bodySpiderwebSvgLayer = document.getElementById('body-spiderweb-svg-layer');
    this.bodySpiderwebNodesLayer = document.getElementById('body-spiderweb-nodes-layer');
    this.btnBodySmartFit = document.getElementById('btn-body-smart-fit');
    this.btnBodyZoomIn = document.getElementById('btn-body-zoom-in');
    this.btnBodyZoomOut = document.getElementById('btn-body-zoom-out');
    this.btnBodyZoomReset = document.getElementById('btn-body-zoom-reset');
    this.btnBodyFullscreen = document.getElementById('btn-body-fullscreen');
    this.bodyTreeSearchInput = document.getElementById('body-tree-search-input');
    this.treePanState = { panX: 0, panY: 0, scale: 1.0, isDragging: false, startX: 0, startY: 0 };
    this.inBodyTreePanState = { panX: 0, panY: 0, scale: 1.0, isDragging: false, startX: 0, startY: 0, layoutMode: 'cluster' };
    this.sharePairingModalBody = document.getElementById('share-pairing-modal-body');

    // Settings Modal Elements & Controls
    this.btnAdminSettings = document.getElementById('btn-admin-settings');
    this.adminSettingsModal = document.getElementById('admin-settings-modal');
    this.btnCloseAdminSettings = document.getElementById('btn-close-settings-modal') || document.getElementById('btn-close-admin-settings') || document.querySelector('#admin-settings-modal .icon-btn');
    this.btnSaveSettings = document.getElementById('btn-save-settings');
    this.btnResetSettings = document.getElementById('btn-reset-settings');

    this.settingDefaultMentorName = document.getElementById('setting-default-mentor-name');
    this.settingDefaultMentorCode = document.getElementById('setting-default-mentor-code');
    this.settingSpeechLang = document.getElementById('setting-speech-lang');
    this.settingDefaultTargetMalas = document.getElementById('setting-default-target-malas');
    this.settingDevoteeCanDelete = document.getElementById('setting-devotee-can-delete') || document.getElementById('setting-allow-devotee-delete');
    this.settingDevoteeCanEditLineage = document.getElementById('setting-devotee-can-edit-lineage');
    this.settingDevoteeCanEnroll = document.getElementById('setting-devotee-can-enroll');
    this.settingHealerStrictTeam = document.getElementById('setting-healer-strict-team') || document.getElementById('setting-healer-team-view');
    this.settingHealerCanCertify = document.getElementById('setting-healer-can-certify');
    this.settingHealerCanDeleteTeam = document.getElementById('setting-healer-can-delete-team');
    this.settingFirebaseUrl = document.getElementById('setting-firebase-url');
    this.settingDefaultRoleMode = document.getElementById('setting-default-role-mode');
    this.settingAutoSave = document.getElementById('setting-auto-save') || document.getElementById('setting-live-sync');

  
    // Left Flyout Tier Profiles Panel Elements
    this.tierProfilesPanel = document.getElementById('tier-profiles-panel');
    this.tierPanelTitle = document.getElementById('tier-panel-title');
    this.tierPanelIcon = document.getElementById('tier-panel-icon');
    this.tierPanelCount = document.getElementById('tier-panel-count');
    this.tierPanelProfilesList = document.getElementById('tier-panel-profiles-list');
    this.inputTierPanelSearch = document.getElementById('input-tier-panel-search');
    this.btnCloseTierPanel = document.getElementById('btn-close-tier-panel');
    this.currentOpenTier = null;
    this.currentTierProfiles = [];
  
  }

  render(profile, visibleProfiles, roleMode, settings) {
    this.populateSettings(settings);
    this._renderRoleSelector(roleMode);
    this.updateLegendCounts(this.allProfiles || visibleProfiles);
    this._renderDropdown(profile, visibleProfiles);
    this._renderDirectory(profile, visibleProfiles);
    this._renderHeaderCard(profile, roleMode);
    this._populateForm(profile);
    
    // Lineage Dynamic Units
    this._renderChildren(profile.lineage?.currentFamily?.children || []);
    this._renderSiblings(this.siblingsCurrentContainer, profile.lineage?.currentFamily?.siblings || [], 'current');
    this._renderSiblings(this.siblingsHusbandContainer, profile.lineage?.husbandAncestral?.siblings || [], 'husband');
    this._renderSiblings(this.siblingsWifeContainer, profile.lineage?.wifeAncestral?.siblings || [], 'wife');

    // House Clean
    this._renderHouseCleanCards(profile.houseCleanLevels || []);

    // Enrolled / Interested Sadhanas Queue
    this._renderInterestedSadhanas(profile.interestedSadhanas || []);

    // Categorized Trainee Sadhak In-Progress
    this._renderCategorizedTraineeSadhanas(profile.traineeSadhanas || []);

    // Healer Completed & Network
    const hubProfiles = this.allProfiles || visibleProfiles || [];
    this.renderAndroidHealersHub(hubProfiles, profile, roleMode);
    this._renderHealerCompleted(profile.healerCompletedSadhanas || []);
    this._renderHealerNetwork(profile.healerNetwork || []);

    // Render In-Body App Hierarchy Tree (Tab 5)
    const treeProfiles = this.allProfiles || visibleProfiles || [];
    const activeFilter = this.bodyTreeTierFilter ? this.bodyTreeTierFilter.value : 'ALL';
    const tier = activeFilter === 'ALL' ? null : parseInt(activeFilter, 10);
    const query = this.bodyTreeSearchInput ? this.bodyTreeSearchInput.value : '';
    const mode = this.inBodyTreePanState?.layoutMode || 'cluster';
    this.renderInBodyHierarchyTree(treeProfiles, tier, query, mode);

    // JSON Live Inspector
    this.renderAndroidHierarchyTree(treeProfiles, this.hierarchySelectedLevel || 'ALL', profile);
    this._updateJSONPreview(profile);

    // Apply RBAC Rules Across the UI
    this.enforceRBAC(roleMode, settings);
  }

  _renderRoleSelector(roleMode) {
    if (this.selectRoleMode) {
      this.selectRoleMode.value = roleMode;
    }
  }

  _renderDropdown(activeProfile, visibleProfiles) {
    if (!this.selectActiveProfile) return;
    this.selectActiveProfile.innerHTML = visibleProfiles.map(p => `
      <option value="${p.id}" ${p.id === activeProfile.id ? 'selected' : ''}>
        ${p.name} (${p.profileType} • Level ${p.level})
      </option>
    `).join('');
  }

  _renderDirectory(activeProfile, visibleProfiles) {
    if (!this.profileDirectoryList) return;

    const tiers = [
      {
        tierNumber: 1,
        title: 'Tier 1: Admin Master (Founder)',
        icon: '👑',
        badgeBg: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8b5cf6',
        filter: (p) => p.profileType === 'ADMIN' || p.level === 1
      },
      {
        tierNumber: 2,
        title: 'Tier 2: Certified Healers & Gurus',
        icon: '🛡️',
        badgeBg: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        filter: (p) => p.profileType === 'HEALER' && p.level === 2
      },
      {
        tierNumber: 3,
        title: 'Tier 3: Healers In-Progress / Siddhi',
        icon: '✨',
        badgeBg: 'rgba(236, 72, 153, 0.2)',
        borderColor: '#ec4899',
        filter: (p) => p.profileType === 'HEALER' && p.level === 3
      },
      {
        tierNumber: 4,
        title: 'Tier 4: Trainee Sadhaks',
        icon: '🌿',
        badgeBg: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        filter: (p) => p.profileType === 'TRAINEE' || p.level === 4
      },
      {
        tierNumber: 5,
        title: 'Tier 5: Devotees & Seekers',
        icon: '🌟',
        badgeBg: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        filter: (p) => p.profileType === 'DEVOTEE' || p.level === 5 || (!p.level && p.profileType !== 'ADMIN' && p.profileType !== 'HEALER' && p.profileType !== 'TRAINEE')
      }
    ];

    let html = '';

    tiers.forEach(tier => {
      const tierProfiles = visibleProfiles.filter(tier.filter);
      if (tierProfiles.length === 0) return;

      const itemsHtml = tierProfiles.map(p => {
        const isActive = p.id === activeProfile.id;
        const initials = (p.name || 'SK')
          .split(' ')
          .map(w => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
        
        const isPaid = p.isPaid !== false && p.paymentStatus !== 'FREE';

        return `
          <div class="profile-item-row ${isActive ? 'active' : ''}" data-id="${p.id}" title="Click to view & edit details for ${p.name}">
            <div class="profile-item-avatar-col">
              <div class="profile-item-avatar" style="border-color: ${tier.borderColor};">
                ${initials}
                <span class="profile-status-dot ${p.isActive ? 'online' : 'offline'}"></span>
              </div>
            </div>
            <div class="profile-item-info-col">
              <div class="profile-item-name-row">
                <span class="profile-item-name">${p.name}</span>
                <span class="profile-mini-stamp ${isPaid ? 'stamp-paid' : 'stamp-free'}">${isPaid ? 'PAID' : 'FREE'}</span>
              </div>
              <div class="profile-item-sub-row">
                <span class="profile-item-sub">${p.referenceCode}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      html += `
        <div class="sidebar-tier-group" data-tier="${tier.tierNumber}">
          <div class="sidebar-tier-header" style="border-left: 3px solid ${tier.borderColor};">
            <div class="sidebar-tier-title-group">
              <span class="sidebar-tier-icon">${tier.icon}</span>
              <span class="sidebar-tier-title">${tier.title}</span>
            </div>
            <span class="sidebar-tier-count" style="background: ${tier.badgeBg}; color: ${tier.borderColor};">${tierProfiles.length}</span>
          </div>
          <div class="sidebar-tier-items">
            ${itemsHtml}
          </div>
        </div>
      `;
    });

    this.profileDirectoryList.innerHTML = html;
  }

  _renderHeaderCard(profile, roleMode = 'MASTER') {
    const mainBox = document.getElementById('main-profile-box-1');
    const isPaid = profile.isPaid !== false && profile.paymentStatus !== 'FREE';
    const initials = (profile.name || 'SK')
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const roleColors = {
      ADMIN: 'var(--role-admin, #8b5cf6)',
      HEALER: 'var(--role-healer, #10b981)',
      TRAINEE: 'var(--role-trainee, #f59e0b)',
      DEVOTEE: 'var(--role-devotee, #3b82f6)'
    };
    const roleBg = roleColors[profile.profileType] || 'var(--role-admin, #8b5cf6)';

    if (mainBox) {
      let flipperWrapper = mainBox.querySelector('.card-flipper-3d-wrapper');
      if (!flipperWrapper) {
        mainBox.innerHTML = `
          <div class="card-flipper-3d-wrapper" id="profile-card-flipper-wrapper">
            <div class="card-flipper-inner" id="profile-card-flipper-inner">
              <!-- FRONT FACE -->
              <div class="card-flipper-front" style="padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-lg);">
                <div class="card-header-flex" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <div class="user-avatar-block" style="display: flex; align-items: center; gap: 1rem;">
                    <div class="avatar-circle" id="profile-avatar-initials">${initials}</div>
                    <div>
                      <h2 class="profile-name-title" id="display-profile-name" style="margin: 0 0 0.35rem 0;">${profile.name || 'Untitled Profile'}</h2>
                      <div class="profile-role-badge-row" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span class="role-badge" id="display-role-badge" style="background-color: ${roleBg};">${profile.profileType} • LEVEL ${profile.level || 1}</span>
                        <span class="status-pill ${profile.isActive ? 'active' : ''}" id="display-status-pill">${profile.isActive ? 'Active Member' : 'Inactive'}</span>
                        <span class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'}" id="display-payment-stamp" title="Click to toggle Paid (Green) / Free (Red)">${isPaid ? 'PAID' : 'FREE'}</span>
                      </div>
                    </div>
                  </div>
                  <div class="header-card-actions-row" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" class="btn btn-xs btn-outline" id="btn-copy-header-ref-code" title="Copy 16-Digit Code" style="font-family: monospace; font-size: 0.78rem;">
                      📋 <span id="header-ref-code-text">${profile.referenceCode || 'SKHM-XXXX-XXXX-XXXX'}</span>
                    </button>
                    <button type="button" class="btn-flip-card-trigger" id="btn-flip-to-back" title="Flip to 24h Pairing &amp; Node Telemetry">
                      🔄 QR &amp; Telemetry
                    </button>
                  </div>
                </div>
              </div>

              <!-- BACK FACE -->
              <div class="card-flipper-back flipper-back-content">
                <div class="flipper-back-header">
                  <div class="flipper-back-title">
                    <span>📡</span> Node Telemetry &amp; 24h Device Pairing
                  </div>
                  <button type="button" class="btn-flip-card-trigger" id="btn-flip-to-front" title="Flip back to Profile Card">
                    🔄 View Profile
                  </button>
                </div>
                <div class="telemetry-grid">
                  <div class="telemetry-item">
                    <div class="telemetry-item-label">Node Reference</div>
                    <div class="telemetry-item-val" id="telemetry-ref-code">${profile.referenceCode || 'SKHM-XXXX-XXXX-XXXX'}</div>
                  </div>
                  <div class="telemetry-item">
                    <div class="telemetry-item-label">Upline Sponsor</div>
                    <div class="telemetry-item-val">${profile.referredByCode || 'ROOT'}</div>
                  </div>
                  <div class="telemetry-item">
                    <div class="telemetry-item-label">Cloud Telemetry</div>
                    <div class="telemetry-item-val" style="color: #10b981;">🟢 RTDB CONNECTED</div>
                  </div>
                  <div class="telemetry-item">
                    <div class="telemetry-item-label">Device Protocol</div>
                    <div class="telemetry-item-val">v3.8 (REST+WSS)</div>
                  </div>
                </div>
                <div class="telemetry-qr-section">
                  <div class="telemetry-qr-box">
                    <svg viewBox="0 0 100 100" width="60" height="60">
                      <rect width="100" height="100" fill="white"/>
                      <path d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z M20 20h10v10h-10z M70 20h10v10h-10z M20 70h10v10h-10z M50 20h5v15h-5z M50 50h30v5h-30z M60 65h10v10h-10z M80 75h10v15h-10z" fill="#1e1b4b"/>
                    </svg>
                  </div>
                  <div class="telemetry-qr-text">
                    <strong>24-Hour QR Device Pairing Protocol</strong><br/>
                    Scan from Spiritual Karim Android App to link this node securely to your hierarchy downline.
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        const pName = mainBox.querySelector('#display-profile-name');
        if (pName) pName.textContent = profile.name || 'Untitled Profile';
        const pBadge = mainBox.querySelector('#display-role-badge');
        if (pBadge) {
          pBadge.textContent = `${profile.profileType} • LEVEL ${profile.level || 1}`;
          pBadge.style.backgroundColor = roleBg;
        }
        const pStatus = mainBox.querySelector('#display-status-pill');
        if (pStatus) {
          pStatus.textContent = profile.isActive ? 'Active Member' : 'Inactive';
          pStatus.className = `status-pill ${profile.isActive ? 'active' : ''}`;
        }
        const pStamp = mainBox.querySelector('#display-payment-stamp');
        if (pStamp) {
          pStamp.className = `stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'}`;
          pStamp.textContent = isPaid ? 'PAID' : 'FREE';
        }
        const pInitials = mainBox.querySelector('#profile-avatar-initials');
        if (pInitials) pInitials.textContent = initials;
        const pRef = mainBox.querySelector('#header-ref-code-text');
        if (pRef) pRef.textContent = profile.referenceCode || 'SKHM-XXXX-XXXX-XXXX';
        const tRef = mainBox.querySelector('#telemetry-ref-code');
        if (tRef) tRef.textContent = profile.referenceCode || 'SKHM-XXXX-XXXX-XXXX';
      }
    }

    if (this.headerStampBadge) {
      this.headerStampBadge.className = `stamp-badge ${isPaid ? 'stamp-paid' : 'stamp-free'}`;
      this.headerStampBadge.textContent = isPaid ? '🟢 PAID' : '🔴 FREE';
      this.headerStampBadge.title = `Active Membership: ${isPaid ? 'PAID' : 'FREE'}`;
    }
  }

  _populateForm(profile) {
    if (this.inputProfileType) this.inputProfileType.value = profile.profileType || 'DEVOTEE';
    if (this.inputLevel) this.inputLevel.value = profile.level || 5;
    if (this.inputCategoryTag) this.inputCategoryTag.value = profile.categoryTag || '';
    if (this.inputRefCode) this.inputRefCode.value = profile.referenceCode || '';
    if (this.inputSponsorCode) this.inputSponsorCode.value = profile.referredByCode || '';
    if (this.inputTransferCode) this.inputTransferCode.value = profile.transferredCode || '';
    if (this.inputIsActive) this.inputIsActive.checked = profile.isActive !== false;
    
    const isPaid = profile.isPaid !== false && profile.paymentStatus !== 'FREE';
    if (this.inputPaymentStatus) {
      this.inputPaymentStatus.value = isPaid ? 'PAID' : 'FREE';
    }
    if (this.inputJoinDate) this.inputJoinDate.value = profile.joinDate || '';

    if (this.inputName) this.inputName.value = profile.name || '';
    if (this.inputSelfTitle) this.inputSelfTitle.value = profile.lineage?.currentFamily?.selfTitle || '';
    if (this.inputPhone) this.inputPhone.value = profile.phone || '';
    if (this.inputEmail) this.inputEmail.value = profile.email || '';
    if (this.inputCity) this.inputCity.value = profile.city || '';
    if (this.inputAddress) this.inputAddress.value = profile.address || '';
    if (this.inputNotes) this.inputNotes.value = profile.notes || '';

    if (this.inputObjective) this.inputObjective.value = profile.objective || '';
    if (this.seekerAfflictionDuration) this.seekerAfflictionDuration.value = profile.seekerDiagnostics?.afflictionDuration || '';
    if (this.seekerKuldeviIssues) this.seekerKuldeviIssues.value = profile.seekerDiagnostics?.kuldeviIssues || '';
    if (this.seekerTargetOutcome) this.seekerTargetOutcome.value = profile.seekerDiagnostics?.targetOutcome || '';

    // Checkboxes
    const selected = new Set(profile.selectedRemedies || []);
    document.querySelectorAll('input[name="remedy-checkbox"]').forEach(cb => {
      cb.checked = selected.has(cb.value);
    });

    // Lineage Self / Spouse
    if (this.lineageSelfName) this.lineageSelfName.value = profile.lineage?.currentFamily?.selfName || profile.name || '';
    if (this.lineageSpouseName) this.lineageSpouseName.value = profile.lineage?.currentFamily?.spouseName || '';

    // Husband
    const h = profile.lineage?.husbandAncestral || {};
    if (this.hFatherName) this.hFatherName.value = h.fatherName || '';
    if (this.hMotherName) this.hMotherName.value = h.motherName || '';
    if (this.hPaternalGf) this.hPaternalGf.value = h.paternalGrandfather || '';
    if (this.hPaternalGm) this.hPaternalGm.value = h.paternalGrandmother || '';
    if (this.hMaternalGf) this.hMaternalGf.value = h.maternalGrandfather || '';
    if (this.hMaternalGm) this.hMaternalGm.value = h.maternalGrandmother || '';
    if (this.hAddress) this.hAddress.value = h.address || '';

    // Wife
    const w = profile.lineage?.wifeAncestral || {};
    if (this.wFatherName) this.wFatherName.value = w.fatherName || '';
    if (this.wMotherName) this.wMotherName.value = w.motherName || '';
    if (this.wPaternalGf) this.wPaternalGf.value = w.paternalGrandfather || '';
    if (this.wPaternalGm) this.wPaternalGm.value = w.paternalGrandmother || '';
    if (this.wMaternalGf) this.wMaternalGf.value = w.maternalGrandfather || '';
    if (this.wMaternalGm) this.wMaternalGm.value = w.maternalGrandmother || '';
    if (this.wAddress) this.wAddress.value = w.address || '';
  }

  _renderChildren(children) {
    if (!this.childrenContainer) return;
    if (children.length === 0) {
      this.childrenContainer.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No children added. Click "+ Add Child".</div>`;
      return;
    }

    this.childrenContainer.innerHTML = children.map((c, i) => `
      <div class="dynamic-row-item" data-index="${i}">
        <input type="text" class="form-control child-name-input" placeholder="Child's Full Name" value="${c.name || ''}">
        <select class="form-control child-gender-select">
          <option value="Son" ${c.gender === 'Son' ? 'selected' : ''}>Son</option>
          <option value="Daughter" ${c.gender === 'Daughter' ? 'selected' : ''}>Daughter</option>
        </select>
        <input type="text" class="form-control child-notes-input" placeholder="Age / Notes" value="${c.ageOrNote || ''}">
        <button type="button" class="btn-remove-row btn-remove-child" data-index="${i}" title="Remove Child">✕</button>
      </div>
    `).join('');
  }

  _renderSiblings(container, siblings, branchKey) {
    if (!container) return;
    if (siblings.length === 0) {
      container.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No siblings recorded. Click "+ Add Sibling".</div>`;
      return;
    }

    container.innerHTML = siblings.map((s, i) => `
      <div class="dynamic-row-item sibling" data-branch="${branchKey}" data-index="${i}">
        <input type="text" class="form-control sibling-name-input" placeholder="Sibling's Name" value="${s.name || ''}">
        <select class="form-control sibling-relation-select">
          <option value="Brother" ${s.relation === 'Brother' ? 'selected' : ''}>Brother</option>
          <option value="Sister" ${s.relation === 'Sister' ? 'selected' : ''}>Sister</option>
          <option value="Elder Brother" ${s.relation === 'Elder Brother' ? 'selected' : ''}>Elder Brother</option>
          <option value="Younger Brother" ${s.relation === 'Younger Brother' ? 'selected' : ''}>Younger Brother</option>
          <option value="Elder Sister" ${s.relation === 'Elder Sister' ? 'selected' : ''}>Elder Sister</option>
          <option value="Younger Sister" ${s.relation === 'Younger Sister' ? 'selected' : ''}>Younger Sister</option>
        </select>
        <input type="text" class="form-control sibling-spouse-input" placeholder="Spouse Name (if m.)" value="${s.spouseName || ''}">
        <input type="text" class="form-control sibling-children-input" placeholder="Children (e.g. 2 Sons)" value="${s.childrenSummary || ''}">
        <button type="button" class="btn-remove-row btn-remove-sibling" data-branch="${branchKey}" data-index="${i}" title="Remove Sibling">✕</button>
      </div>
    `).join('');
  }

  _renderHouseCleanCards(levels) {
    const html = levels.map((lvl, i) => `
      <div class="houseclean-card" data-index="${i}">
        <div class="houseclean-card-header">
          <div class="houseclean-level-title"><span>🧹</span> ${lvl.levelTitle || `Level ${lvl.levelNumber} House Clean`}</div>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="clean-percent-badge">${lvl.cleanPercentage || 0}% Clean</span>
            <button type="button" class="btn btn-sm btn-danger btn-delete-houseclean" data-index="${i}">Delete</button>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Clean Status</label>
            <select class="form-control hc-status-select">
              <option value="NOT_STARTED" ${lvl.status === 'NOT_STARTED' ? 'selected' : ''}>Not Started</option>
              <option value="IN_PROGRESS" ${lvl.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
              <option value="PENDING_APPROVAL" ${lvl.status === 'PENDING_APPROVAL' ? 'selected' : ''}>Pending Mentor Approval</option>
              <option value="APPROVED" ${lvl.status === 'APPROVED' ? 'selected' : ''}>Approved & Certified</option>
              <option value="REVISION_NEEDED" ${lvl.status === 'REVISION_NEEDED' ? 'selected' : ''}>Needs Improvement</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Verified % Clean (0-100)</label>
            <input type="number" class="form-control hc-percentage-input" min="0" max="100" value="${lvl.cleanPercentage || 0}">
          </div>
          <div class="form-group">
            <label class="form-label">Approval Date / Timestamp</label>
            <input type="text" class="form-control hc-date-input" placeholder="e.g. 2025-02-15" value="${lvl.approvalDate || ''}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Cleansing Details & Purified Areas</label>
          <textarea class="form-control hc-details-textarea" rows="2" placeholder="Describe altar purification, salt water wash, loban...">${lvl.cleanedDetails || ''}</textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Approved By Mentor Code & Name</label>
            <input type="text" class="form-control hc-mentor-input" placeholder="Mentor Name & Code" value="${lvl.mentorName ? `${lvl.mentorName} (${lvl.mentorCode || ''})` : ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Mentor Remarks & Seal</label>
            <input type="text" class="form-control hc-remarks-input" placeholder="Remarks" value="${lvl.mentorRemarks || ''}">
          </div>
        </div>
      </div>
    `).join('');

    if (this.devoteeHouseCleanContainer) this.devoteeHouseCleanContainer.innerHTML = html;
    if (this.seekerHouseCleanSummaryContainer) this.seekerHouseCleanSummaryContainer.innerHTML = html;
  }

  _renderInterestedSadhanas(sadhanas) {
    if (!this.interestedSadhanasContainer) return;
    if (sadhanas.length === 0) {
      this.interestedSadhanasContainer.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">
          No sadhanas in queue. Tick any Sadhana or Remedy above to automatically enroll into Trainee In-Progress!
        </div>
      `;
      return;
    }

    this.interestedSadhanasContainer.innerHTML = sadhanas.map((s, i) => {
      const isPaid = s.paymentStatus === 'PAID' || (s.isPaid !== false && s.paymentStatus !== 'FREE');
      const sadhanaKey = s.id || s.sadhanaKey || '';
      return `
      <div class="remedy-card-option ${isPaid ? 'tile-paid' : 'tile-free'}" data-index="${i}" data-sadhana-id="${sadhanaKey}">
        <div class="option-content" data-sadhana-trigger="${sadhanaKey}">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="option-title">${s.name || s.title || 'Enrolled Item'}</span>
            <span class="role-badge" style="background: rgba(212, 175, 55, 0.2); color: var(--gold-300); font-size: 0.65rem;">${s.category || 'Sadhana'}</span>
          </div>
          <span class="option-tag">Priority: ${s.priority || 'High'} &bull; Status: ${s.status || 'Enrolled'}</span>
        </div>

        <div class="tile-actions-vertical">
          <input type="checkbox" class="tile-checkbox" name="remedy-checkbox" value="${sadhanaKey}" checked title="Ticked (Enrolled & Synced to Trainee)">
          <button type="button" class="btn-sadhana-info-trigger" data-sadhana-id="${sadhanaKey}" title="View Full Ritual Guide">👁️</button>
          <button type="button" class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'} btn-tile-stamp-toggle" data-sadhana-id="${sadhanaKey}" data-index="${i}" title="Toggle Paid/Free">${isPaid ? 'PAID' : 'FREE'}</button>
        </div>
      </div>
      `;
    }).join('');
  }

  _renderCategorizedTraineeSadhanas(sadhanas) {
    if (!sadhanas || sadhanas.length === 0) {
      const emptyMsg = `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.8rem; font-style: italic; padding: 0.5rem 0;">No active items. Tick any card in Seeker Purpose to add here.</div>`;
      if (this.traineeGroupSadhanas) this.traineeGroupSadhanas.innerHTML = emptyMsg;
      if (this.traineeGroupRemedies) this.traineeGroupRemedies.innerHTML = emptyMsg;
      if (this.traineeGroupCleansing) this.traineeGroupCleansing.innerHTML = emptyMsg;
      this._renderTraineeActiveDetail(null);
      return;
    }

    // Set default selected trainee item if none selected or if selected was deleted
    if (!this.selectedTraineeId || !sadhanas.some(s => s.id === this.selectedTraineeId)) {
      this.selectedTraineeId = sadhanas[0].id;
    }

    const filterByDomain = (domainKey) => sadhanas.filter(s => {
      if (s.categoryDomain) return s.categoryDomain === domainKey;
      const cat = (s.category || s.title || '').toLowerCase();
      if (domainKey === 'sadhanas') return cat.includes('sadhana') || cat.includes('yantra') || cat.includes('bhairav') || cat.includes('chamunda') || cat.includes('diwali');
      if (domainKey === 'remedies') return cat.includes('remedy') || cat.includes('diya') || cat.includes('court') || cat.includes('business') || cat.includes('trilok') || cat.includes('havan') || cat.includes('vastu') || cat.includes('gopal') || cat.includes('debt');
      return cat.includes('clean') || cat.includes('kundalini') || cat.includes('heal') || cat.includes('karmic') || cat.includes('nazar') || cat.includes('aura');
    });

    const renderDomainTiles = (items) => {
      if (items.length === 0) {
        return `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.8rem; font-style: italic; padding: 0.5rem 0;">No active items in this category. Tick any card in Seeker Purpose to add here.</div>`;
      }

      return items.map((ts) => {
        const isPaid = ts.isPaid !== false && ts.paymentStatus !== 'FREE';
        const isSelected = ts.id === this.selectedTraineeId;
        const sadhanaKey = ts.sadhanaKey || ts.id;
        const catalogItem = SADHANA_CATALOG[sadhanaKey] || { icon: '🌿' };
        return `
        <div class="trainee-card-tile ${isPaid ? 'tile-paid' : 'tile-free'} ${isSelected ? 'active-selected-tile' : ''}" 
             data-item-id="${ts.id}" 
             data-sadhana-key="${sadhanaKey}">
          <div class="option-content trainee-tile-select-trigger" data-item-id="${ts.id}">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 1.1rem;">${catalogItem.icon || '🌿'}</span>
              <span class="option-title">${ts.title || 'In-Progress Sadhana'}</span>
            </div>
            <span class="option-tag">${ts.level || 'Level 1 — Initiation'} &bull; ${ts.progressPercent || 0}%</span>
          </div>

          <div class="tile-actions-vertical">
            <input type="checkbox" class="tile-checkbox trainee-item-checkbox" data-item-id="${ts.id}" checked title="Ticked in Trainee In-Progress">
            <button type="button" class="btn-sadhana-info-trigger" data-sadhana-id="${sadhanaKey}" title="View Full Ritual Guide">👁️</button>
            <button type="button" class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'} btn-tile-stamp-toggle" data-item-id="${ts.id}" title="Toggle Paid/Free">${isPaid ? 'PAID' : 'FREE'}</button>
          </div>
        </div>
        `;
      }).join('');
    };

    if (this.traineeGroupSadhanas) this.traineeGroupSadhanas.innerHTML = renderDomainTiles(filterByDomain('sadhanas'));
    if (this.traineeGroupRemedies) this.traineeGroupRemedies.innerHTML = renderDomainTiles(filterByDomain('remedies'));
    if (this.traineeGroupCleansing) this.traineeGroupCleansing.innerHTML = renderDomainTiles(filterByDomain('cleansing'));

    const activeItem = sadhanas.find(s => s.id === this.selectedTraineeId) || sadhanas[0];
    this._renderTraineeActiveDetail(activeItem);
  }

  renderUniversalMemoBox({ textareaId, targetItemId, placeholder = 'Enter progress note, vibration feedback, or mentor query...', quickChips = [] }) {
    const chips = quickChips.length > 0 ? quickChips : [
      '11 Malas Completed',
      'Daily Sunset Protocol Done',
      'Chakra Vibration Activated',
      'Peaceful Light Observed',
      'Obstacle / Smoke Cleared',
      'Requesting Mentor Attunement'
    ];

    return `
      <div class="universal-memo-box">
        <textarea id="${textareaId}" class="universal-memo-textarea" placeholder="${placeholder}"></textarea>
        
        <div class="universal-memo-toolbar">
          <button type="button" class="btn-memo-tool btn-memo-keyboard" title="Toggle Quick Chips & Keyboard Focus" data-target="${textareaId}">⌨️</button>
          <button type="button" class="btn-memo-tool btn-memo-mic" title="Voice-to-Text Input (Microphone)" data-target="${textareaId}">🎤</button>
          <button type="button" class="btn-memo-tool btn-memo-send" title="Submit Input with Date-Time Stamp" id="btn-add-trainee-memo" data-item-id="${targetItemId}">
            <svg class="send-vector-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/></svg>
          </button>
        </div>

        <div class="memo-quick-chips-wrap" id="quick-chips-${textareaId}" style="display: none;">
          ${chips.map(chip => `<span class="memo-quick-chip" data-target="${textareaId}">${chip}</span>`).join('')}
        </div>
      </div>
    `;
  }

  _renderTraineeActiveDetail(item) {
    if (!this.traineeActiveDetailContainer) return;
    if (!item) {
      this.traineeActiveDetailContainer.innerHTML = `
        <div class="trainee-detail-card" style="text-align: center; color: var(--text-muted); padding: 3rem 1.5rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🕉️</div>
          <h4 style="font-family: var(--font-heading); color: var(--gold-400); margin-bottom: 0.5rem;">No Active Sadhana Selected</h4>
          <p style="font-size: 0.85rem;">Tick or select any Sadhana, Remedy, or Cleansing tile on the left to view graphical progress, level details, and progress memo notes.</p>
        </div>
      `;
      return;
    }

    const isPaid = item.isPaid !== false && item.paymentStatus !== 'FREE';
    const sadhanaKey = item.sadhanaKey || item.id;
    const catalogItem = SADHANA_CATALOG[sadhanaKey] || { icon: '🌿', category: 'Sadhana' };
    const progress = Math.min(100, Math.max(0, parseInt(item.progressPercent, 10) || 0));
    const vStatus = item.verificationStatus || 'UNVERIFIED';

    const memos = item.memos && item.memos.length > 0 ? item.memos : [
      { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' 09:30 AM', author: 'Mentor Devendra', text: 'Initial attunement completed. Commenced daily sadhana regime.' }
    ];

    this.traineeActiveDetailContainer.innerHTML = `
      <div class="trainee-detail-card" data-item-id="${item.id}">
        <!-- Detail Header -->
        <div class="trainee-detail-header">
          <div class="trainee-detail-title-wrap">
            <span class="trainee-detail-icon">${catalogItem.icon || '🌿'}</span>
            <div>
              <div class="trainee-detail-title">${item.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${item.categoryDomain || catalogItem.category} &bull; Supervising Mentor: ${item.mentorCode || 'SKHM-ADM1-7788-9900'}</div>
            </div>
          </div>
          <span class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'} btn-tile-stamp-toggle" data-item-id="${item.id}" title="Toggle Paid/Free">
            ${isPaid ? 'PAID' : 'FREE'}
          </span>
        </div>

        <!-- Progress Graphics Box -->
        <div class="progress-graphics-box">
          <div class="progress-metrics-row">
            <span>Overall Spiritual Completion</span>
            <span class="progress-percentage-badge">${progress}%</span>
          </div>

          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
          </div>

          <div class="progress-stats-grid">
            <div class="progress-stat-card">
              <div class="progress-stat-label">Daily Target</div>
              <div class="progress-stat-val">${item.dailyTarget || '11 Malas'}</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-label">Current Streak</div>
              <div class="progress-stat-val">${item.currentStreak || '1 Day'}</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-label">Access Type</div>
              <div class="progress-stat-val" style="color: ${isPaid ? '#10b981' : '#ef4444'};">${isPaid ? 'PAID' : 'FREE'}</div>
            </div>
          </div>
        </div>

        <!-- Upline Verification & Approval Seal Card -->
        <div class="upline-verification-card">
          <div class="upline-verification-header">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span>🛡️</span>
              <span style="color: var(--text-primary);">Upline Verification &amp; Seal</span>
            </div>
            
            ${vStatus === 'VERIFIED' 
              ? `<span class="verification-status-badge status-verified">🟢 Verified &amp; Sealed</span>`
              : (vStatus === 'PENDING_APPROVAL' 
                  ? `<span class="verification-status-badge status-pending">⏳ Awaiting Upline Approval</span>`
                  : `<span class="verification-status-badge status-unverified">⚪ Self-Reported</span>`)}
          </div>

          <div class="verification-actions-row">
            <div class="verification-info-text">
              ${vStatus === 'VERIFIED'
                ? `Officially approved by <strong>${item.verifiedBy || 'Master Karim'}</strong> on ${item.verifiedDate || 'Recently'}`
                : (vStatus === 'PENDING_APPROVAL'
                    ? `Request submitted to sponsor <strong>${item.mentorCode || 'SKHM-ADM1-7788-9900'}</strong> on ${item.verificationRequestedDate || 'Recently'}`
                    : `Submit this sadhana progress for formal upline verification &amp; mastery seal.`)}
            </div>

            <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
              ${vStatus === 'PENDING_APPROVAL'
                ? `
                  <button type="button" class="btn-verify-approve" data-item-id="${item.id}" title="Approve &amp; issue official seal">
                    <span>✓</span> Approve &amp; Seal
                  </button>
                  <button type="button" class="btn btn-sm btn-danger btn-verify-reject" data-item-id="${item.id}" title="Request revision or extra practice">
                    <span>✕</span> Revision
                  </button>
                `
                : (vStatus === 'VERIFIED'
                    ? `<button type="button" class="btn-verify-request" data-item-id="${item.id}" title="Submit updated progress for re-verification"><span>🔄</span> Re-Verify</button>`
                    : `<button type="button" class="btn-verify-request" data-item-id="${item.id}"><span>🛡️</span> Verify / Request Upline Approval</button>`)}
            </div>
          </div>
        </div>

        <!-- Interactive Progress Parameters Edit Grid -->
        <div class="form-grid-2 mt-2">
          <div class="form-group">
            <label class="form-label">Advancement Level</label>
            <select class="form-control active-ts-level-select" data-item-id="${item.id}">
              <option value="Level 1 — Novice Initiation" ${item.level?.includes('Level 1') ? 'selected' : ''}>Level 1 — Initiation</option>
              <option value="Level 2 — Mantra Diksha" ${item.level?.includes('Level 2') ? 'selected' : ''}>Level 2 — Mantra Diksha</option>
              <option value="Level 3 — Havan & Energy Transmission" ${item.level?.includes('Level 3') ? 'selected' : ''}>Level 3 — Havan Transmission</option>
              <option value="Level 4 — Master Attunement" ${item.level?.includes('Level 4') ? 'selected' : ''}>Level 4 — Master Attunement</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Update Progress Percentage (%)</label>
            <input type="number" class="form-control active-ts-progress-input" data-item-id="${item.id}" min="0" max="100" value="${progress}">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Daily Target Malas / Reps</label>
            <input type="text" class="form-control active-ts-target-input" data-item-id="${item.id}" value="${item.dailyTarget || '11 Malas Daily'}">
          </div>
          <div class="form-group">
            <label class="form-label">Active Practice Streak</label>
            <input type="text" class="form-control active-ts-streak-input" data-item-id="${item.id}" value="${item.currentStreak || '1 Day'}">
          </div>
        </div>

        <!-- Feedback & Progress Memo Timeline -->
        <div class="memo-section-wrap mt-2">
          <div class="memo-section-title">
            <span>💬 Feedback, Vibrations &amp; Progress Memo Log</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 400;">(${memos.length} Entries)</span>
          </div>

          <div class="memo-timeline-container" id="trainee-memo-timeline">
            ${memos.map(m => `
              <div class="memo-timeline-item ${m.type === 'VERIFIED' ? 'verification-log' : (m.type === 'PENDING' ? 'pending-log' : '')}">
                <div class="memo-meta">
                  <strong style="color: ${m.type === 'VERIFIED' ? '#10b981' : (m.type === 'PENDING' ? '#f59e0b' : 'var(--gold-400)')};">
                    ${m.author || 'Sadhak / Mentor'}
                  </strong>
                  <span>📅 ${m.date || 'Just now'}</span>
                </div>
                <div class="memo-text">${m.text || ''}</div>
              </div>
            `).join('')}
          </div>

          <!-- Universal Memo Box with Keyboard, Speech-to-Text Mic, and Send Submit -->
          <div class="mt-2">
            ${this.renderUniversalMemoBox({
              textareaId: 'trainee-new-memo-text',
              targetItemId: item.id,
              placeholder: 'Enter progress memo, spiritual feedback, or mentor question (Use 🎤 Mic for voice)...',
              quickChips: [
                '11 Malas Completed Today',
                'Sunset 3-Diya Havan Done',
                'Deep Third Eye Vibration Felt',
                'All Domestic Heavy Vibes Cleared',
                'Streak Maintained Unbroken',
                'Requesting Next Level Diksha'
              ]
            })}
          </div>
        </div>
      </div>
    `;
  }

  _renderHealerCompleted(completed) {
    if (!this.healerCompletedSadhanasContainer) return;
    if (completed.length === 0) {
      this.healerCompletedSadhanasContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-style: italic; padding: 2rem;">No master completed sadhana credentials recorded. Click "+ Add Completed Sadhana Credential".</div>`;
      return;
    }

    this.healerCompletedSadhanasContainer.innerHTML = completed.map((h, i) => `
      <div class="sadhana-progress-card completed" data-index="${i}">
        <div class="sadhana-card-top">
          <span class="role-badge" style="background: var(--gold-500); color: #0b0714;">${h.levelCompleted || 'Level 4 — Master Guru'}</span>
          <button type="button" class="btn btn-sm btn-danger btn-delete-healer-sadhana" data-index="${i}">Delete</button>
        </div>

        <div class="form-group">
          <label class="form-label">Master Sadhana Title</label>
          <input type="text" class="form-control hc-comp-title-input" value="${h.title || ''}" placeholder="Title">
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Status</label>
            <input type="text" class="form-control hc-comp-status-input" value="${h.status || 'Certified Master'}" placeholder="Status">
          </div>
          <div class="form-group">
            <label class="form-label">Completion Date</label>
            <input type="text" class="form-control hc-comp-date-input" value="${h.completionDate || ''}" placeholder="YYYY-MM-DD">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Seekers Guided</label>
            <input type="number" class="form-control hc-comp-count-input" value="${h.seekersGuidedCount || 0}">
          </div>
          <div class="form-group">
            <label class="form-label">Validation Seal Code</label>
            <input type="text" class="form-control hc-comp-seal-input font-mono" value="${h.sealCode || ''}" placeholder="SKHM-SEAL-XXX">
          </div>
        </div>
      </div>
    `).join('');
  }

  _renderHealerNetwork(network) {
    if (!this.healerNetworkContainer) return;
    if (network.length === 0) {
      this.healerNetworkContainer.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.25rem 0;">No devotees linked yet. Click "+ Link Devotee".</div>`;
      return;
    }

    this.healerNetworkContainer.innerHTML = network.map((n, i) => `
      <div class="dynamic-row-item" data-index="${i}">
        <input type="text" class="form-control net-name-input" placeholder="Devotee/Seeker Name" value="${n.name || ''}">
        <input type="text" class="form-control net-code-input font-mono" placeholder="16-Digit Code" value="${n.refCode || ''}">
        <input type="text" class="form-control net-role-input" placeholder="Role / Level" value="${n.role || ''}">
        <button type="button" class="btn-remove-row btn-remove-network-devotee" data-index="${i}" title="Unlink Devotee">✕</button>
      </div>
    `).join('');
  }

  // Enforce Role-Based Access Control (RBAC)
  enforceRBAC(roleMode, settings) {
    const isDevotee = roleMode === 'DEVOTEE';
    const isHealer = roleMode === 'HEALER';
    const isMaster = roleMode === 'MASTER';

    const allowDelete = isMaster || (isHealer && true) || (isDevotee && settings.allowDevoteeDelete === true);

    // Delete buttons to lock or unlock
    const deleteSelectors = [
      '#btn-delete-profile',
      '.btn-delete-houseclean',
      '.btn-remove-interested-sadhana',
      '.btn-delete-trainee-item',
      '.btn-delete-healer-sadhana',
      '.btn-remove-network-devotee',
      '.btn-remove-child',
      '.btn-remove-sibling'
    ];

    deleteSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(btn => {
        if (!allowDelete) {
          btn.classList.add('permission-locked');
          btn.setAttribute('title', '🔒 Deletion locked for Devotee role. (Can be enabled by Master in Admin Settings)');
          btn.disabled = true;
        } else {
          btn.classList.remove('permission-locked');
          btn.removeAttribute('title');
          btn.disabled = false;
        }
      });
    });

    // Admin Settings access restriction
    if (this.btnAdminSettings) {
      if (!isMaster) {
        this.btnAdminSettings.style.opacity = '0.5';
        this.btnAdminSettings.title = 'Admin Settings (Restricted to Master role)';
      } else {
        this.btnAdminSettings.style.opacity = '1';
        this.btnAdminSettings.title = 'Open Master Admin & RBAC Settings';
      }
    }
  }

  // Slide-out Drawer Rendering
  openSadhanaDrawer(sadhanaKey) {
    const item = SADHANA_CATALOG[sadhanaKey] || SADHANA_CATALOG.sri_yantra;
    if (this.sadhanaDrawerTitle) this.sadhanaDrawerTitle.textContent = item.title;
    if (this.sadhanaDrawerCategory) this.sadhanaDrawerCategory.textContent = `${item.category} • ${item.levelScope}`;
    if (this.sadhanaDrawerIcon) this.sadhanaDrawerIcon.textContent = item.icon;

    if (this.sadhanaDrawerBody) {
      this.sadhanaDrawerBody.innerHTML = `
        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>🌟</span> Spiritual Essence &amp; Overview</div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${item.summary}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>📿</span> Sacred Beej Mantra &amp; Frequency</div>
          <div class="sadhana-mantra-box">
            <div class="sadhana-mantra-text">${item.mantra}</div>
            <button type="button" class="btn btn-sm btn-outline btn-copy-drawer-mantra" data-mantra="${encodeURIComponent(item.mantra)}">📋 Copy</button>
          </div>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>⏰</span> Auspicious Timing &amp; Aasan Direction</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.35rem;"><strong>Timing:</strong> ${item.timing}</p>
          <p style="font-size: 0.88rem; color: var(--text-secondary);"><strong>Aasan &amp; Direction:</strong> ${item.aasanDirection}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>🌿</span> Essential Consecrated Ingredients (Samagri)</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${item.ingredients}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>📜</span> Step-by-Step Ritual Protocol</div>
          <ol class="sadhana-steps-list">
            ${item.steps.map(st => `<li>${st}</li>`).join('')}
          </ol>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title"><span>🛡️</span> Key Benefits &amp; Astral Protection</div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${item.benefits}</p>
        </div>

        <div class="sadhana-info-block">
          <div class="sadhana-info-title" style="color: #ff6b6b;"><span>⚠️</span> Rules &amp; Strict Cautions</div>
          <p style="font-size: 0.88rem; color: #ff9b9b; line-height: 1.5;">${item.cautions}</p>
        </div>
      `;

      // Bind copy mantra
      const copyBtn = this.sadhanaDrawerBody.querySelector('.btn-copy-drawer-mantra');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const text = decodeURIComponent(copyBtn.getAttribute('data-mantra'));
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
          });
        });
      }
    }

    if (this.btnDrawerEnroll) this.btnDrawerEnroll.setAttribute('data-sadhana-key', item.id);
    if (this.btnDrawerSendTrainee) this.btnDrawerSendTrainee.setAttribute('data-sadhana-key', item.id);

    if (this.sadhanaDrawer) {
      this.sadhanaDrawer.classList.add('open');
      this.sadhanaDrawer.setAttribute('aria-hidden', 'false');
    }
    if (this.sadhanaDrawerBackdrop) this.sadhanaDrawerBackdrop.classList.add('open');
  }

  closeSadhanaDrawer() {
    if (this.sadhanaDrawer) {
      this.sadhanaDrawer.classList.remove('open');
      this.sadhanaDrawer.setAttribute('aria-hidden', 'true');
    }
    if (this.sadhanaDrawerBackdrop) this.sadhanaDrawerBackdrop.classList.remove('open');
  }

  toggleGoliGyanModal(forceState) {
    if (!this.goliGyanModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.goliGyanModal.classList.contains('open');
    if (isOpen) {
      this.goliGyanModal.classList.add('open');
      this.goliGyanModal.setAttribute('aria-hidden', 'false');
    } else {
      this.goliGyanModal.classList.remove('open');
      this.goliGyanModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSettingsModal(forceState) {
    if (!this.adminSettingsModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.adminSettingsModal.classList.contains('open');
    if (isOpen) {
      this.adminSettingsModal.classList.add('open');
      this.adminSettingsModal.setAttribute('aria-hidden', 'false');
    } else {
      this.adminSettingsModal.classList.remove('open');
      this.adminSettingsModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSharePairingModal(forceState) {
    const modal = document.getElementById('share-pairing-modal');
    if (!modal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !modal.classList.contains('open');
    if (isOpen) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    } else {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  renderSharePairingModal(profile, invites = []) {
    const body = document.getElementById('share-pairing-modal-body');
    if (!body || !profile) return;

    const sponsorCode = profile.referenceCode || 'SKHM-ADM1-7788-9900';
    const cleanCode = sponsorCode.replace(/[^a-zA-Z0-9]/g, '');
    const activePin = (100000 + (Math.abs(sponsorCode.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31) % 900000)).toString();

    // Official Installation & Release Links
    const apkDownloadUrl = 'https://github.com/jDroid-X/SpritualKarim/raw/main/apk/release/app-release.apk';
    const repoUrl = 'https://github.com/jDroid-X/SpritualKarim';
    const webPortalUrl = 'https://jdroid-x.github.io/SpritualKarim/SpritualKarimWeb/';
    const telegramBotHandle = 'SpiritualKarimBot';
    const telegramLink = `https://t.me/${telegramBotHandle}?start=pair_${cleanCode}_${activePin}`;

    const payloadText = `🕉️ SPIRITUAL KARIM • SACRED LINEAGE PAIRING INVITE

Mentor: ${profile.name || 'Karim Ji'} (Level ${profile.level || 1})
16-Digit Reference Code: ${sponsorCode}

Connection Type: Downline Member (Level-Down Seekers & Trainees)
Assigned Role: Devotee (Personal & Lineage Sadhana)

Verification Method: Mobile Number OTP & Telegram Bot
Activation Pairing PIN: ${activePin}
Telegram Bot Pairing: ${telegramLink}

⏱️ Link Validity: Valid for 24 Hours only (Upline approval required). Multiple resends allowed.
📦 Direct Release APK: ${apkDownloadUrl}
🌐 Online Web Portal: ${webPortalUrl}
🌐 GitHub Repository & Updates: ${repoUrl}

Installation & Activation Steps:
1. Download and install the Spiritual Karim Android App or open the Web Portal link.
2. Enter the 16-Digit Sponsor Reference Code (${sponsorCode}) and 6-Digit Activation PIN (${activePin}).
3. Once validated, your upline mentor confirms activation to begin real-time lineage synchronization!`;

    const encodedPayload = encodeURIComponent(payloadText);
    const encodedApk = encodeURIComponent(apkDownloadUrl);

    body.innerHTML = `
      <!-- 1. Source Code Display Banner (Matching Android App Surface) -->
      <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 0.65rem; padding: 0.85rem 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div style="font-size: 0.7rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.05em;">YOUR 16-DIGIT SPONSOR CODE</div>
          <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); letter-spacing: 1.5px;">${sponsorCode}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="role-badge" style="background: var(--gold-500); color: #0b0714; font-weight: 800;">L${profile.level || 1} ${profile.profileType || 'MENTOR'}</span>
          <button type="button" class="btn btn-xs btn-outline" id="btn-copy-sponsor-only" data-code="${sponsorCode}" title="Copy 16-digit code">
            📋 Copy Code
          </button>
        </div>
      </div>

      <!-- 2. Connection Relationship & Verification Channels (Android Segmented Controls) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.85rem; margin-bottom: 1rem;">
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 0.5rem; padding: 0.75rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-400); margin-bottom: 0.4rem;">1. Connection Relationship</div>
          <label style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.8rem; margin-bottom: 0.35rem; cursor: pointer;">
            <input type="radio" name="share-conn-type" value="downline" checked>
            <span>Downline Member (Level-Down Seekers)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.8rem; cursor: pointer;">
            <input type="radio" name="share-conn-type" value="parallel">
            <span>Parallel Co-Mentor (Healer-to-Healer)</span>
          </label>
        </div>

        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 0.5rem; padding: 0.75rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-400); margin-bottom: 0.4rem;">2. Verification Method &amp; PIN</div>
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 0.4rem; padding: 0.4rem 0.65rem;">
            <div>
              <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Generated Activation PIN</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #10b981; font-family: var(--font-mono); letter-spacing: 2px;">${activePin}</div>
            </div>
            <button type="button" class="btn btn-xs btn-outline" id="btn-copy-pin-only" data-pin="${activePin}" title="Copy PIN">
              📋
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Official App Installation & Repository Badges -->
      <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 0.65rem; padding: 0.85rem 1rem; margin-bottom: 1rem;">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--gold-400); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
          <span>📦</span> Official App Installation &amp; Online Links
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.6rem;">
          <a href="${apkDownloadUrl}" target="_blank" class="btn btn-sm btn-gold" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.8rem; text-decoration: none;" title="Download Android APK">
            <span>📥</span> Direct APK Download
          </a>
          <a href="${webPortalUrl}" target="_blank" class="btn btn-sm btn-outline" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.8rem; text-decoration: none;" title="Open Web Portal">
            <span>🌐</span> Online Web App
          </a>
          <a href="${telegramLink}" target="_blank" class="btn btn-sm btn-outline" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.8rem; text-decoration: none;" title="Open Telegram Bot Pairing">
            <span>✈️</span> Telegram Pairing Bot
          </a>
          <a href="${repoUrl}" target="_blank" class="btn btn-sm btn-outline" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.8rem; text-decoration: none;" title="View GitHub Source">
            <span>🐙</span> GitHub Repository
          </a>
        </div>
      </div>

      <!-- 4. Multi-Channel Instant Share Buttons -->
      <div style="margin-bottom: 1rem;">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.4rem;">3. Share Invitation via Apps:</div>
        <div class="share-channels-grid">
          <a href="https://api.whatsapp.com/send?text=${encodedPayload}" target="_blank" class="btn-share-channel btn-share-whatsapp" title="Share via WhatsApp">
            <span>💬</span> <span>WhatsApp</span>
          </a>
          <a href="https://t.me/share/url?url=${encodedApk}&text=${encodedPayload}" target="_blank" class="btn-share-channel btn-share-telegram" title="Share via Telegram">
            <span>✈️</span> <span>Telegram</span>
          </a>
          <a href="sms:?body=${encodedPayload}" class="btn-share-channel btn-share-sms" title="Send SMS Invite">
            <span>📱</span> <span>SMS</span>
          </a>
          <button type="button" class="btn-share-channel btn-share-copy" id="btn-copy-pairing-payload" data-payload="${encodeURIComponent(payloadText)}" title="Copy Full Invite Text">
            <span>📋</span> <span>Copy Full Invite</span>
          </button>
        </div>
      </div>

      <!-- 5. Formatted Shareable Invitation Preview -->
      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">Shareable Invitation Payload (Monospace Preview):</div>
        <pre style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-sm); padding: 0.85rem; font-size: 0.76rem; font-family: var(--font-mono); color: var(--text-secondary); white-space: pre-wrap; max-height: 130px; overflow-y: auto;">${payloadText}</pre>
      </div>

      <!-- 6. 24-Hour Pending Approvals Section -->
      <div class="pending-approvals-card">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); font-family: var(--font-heading);">
            ⏳ Pending Seeker Hierarchy Approvals (24-Hour Protocol)
          </div>
          <button type="button" class="btn btn-sm btn-outline" id="btn-simulate-new-seeker" style="font-size: 0.75rem;">
            + Test New Seeker Request
          </button>
        </div>
        <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem 0;">
          Seekers who enter your sponsor code enter a 24-hour verification window. Approve within 24 hours to promote to your downline hierarchy.
        </p>

        <div style="overflow-x: auto;">
          <table class="pending-approvals-table" id="table-pending-approvals">
            <thead>
              <tr>
                <th>Seeker Name / Phone</th>
                <th>Device Model</th>
                <th>24h Countdown Timer</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="tbody-pending-approvals"></tbody>
          </table>
        </div>
      </div>
    `;

    this.renderPendingApprovalsRows(invites);

    const copyBtn = body.querySelector('#btn-copy-pairing-payload');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = decodeURIComponent(copyBtn.getAttribute('data-payload') || '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('✓ Full 24-Hour Pairing Invite copied to clipboard!');
          });
        }
      });
    }

    const copySponsorBtn = body.querySelector('#btn-copy-sponsor-only');
    if (copySponsorBtn) {
      copySponsorBtn.addEventListener('click', () => {
        const code = copySponsorBtn.getAttribute('data-code') || '';
        if (navigator.clipboard && code) {
          navigator.clipboard.writeText(code).then(() => {
            this.showToast(`📋 Sponsor Code copied: ${code}`);
          });
        }
      });
    }

    const copyPinBtn = body.querySelector('#btn-copy-pin-only');
    if (copyPinBtn) {
      copyPinBtn.addEventListener('click', () => {
        const pin = copyPinBtn.getAttribute('data-pin') || '';
        if (navigator.clipboard && pin) {
          navigator.clipboard.writeText(pin).then(() => {
            this.showToast(`🔑 Activation PIN copied: ${pin}`);
          });
        }
      });
    }
  }

  renderPendingApprovalsRows(invites = []) {
    const tbody = document.getElementById('tbody-pending-approvals');
    if (!tbody) return;

    if (!invites || invites.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1rem;">No pending approvals right now. Share your sponsor code to invite seekers!</td></tr>`;
      return;
    }

    const now = Date.now();
    tbody.innerHTML = invites.map(inv => {
      const remainingMs = (inv.expiresAtMs || (inv.createdAtMs + 86400000)) - now;
      const isExpired = inv.status === 'PENDING' && remainingMs <= 0;
      const isApproved = inv.status === 'APPROVED';

      let timerBadgeHtml = '';
      if (isApproved) {
        timerBadgeHtml = `<span class="countdown-timer-badge countdown-approved">🟢 Approved &amp; Linked</span>`;
      } else if (isExpired) {
        timerBadgeHtml = `<span class="countdown-timer-badge countdown-expired">⏱️ Expired (24h Ended)</span>`;
      } else {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
        const pad = n => String(n).padStart(2, '0');
        timerBadgeHtml = `<span class="countdown-timer-badge countdown-live" data-expires="${inv.expiresAtMs || (inv.createdAtMs + 86400000)}">⏳ ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s</span>`;
      }

      let actionsHtml = '';
      if (isApproved) {
        actionsHtml = `<span style="color: #10b981; font-weight: 700; font-size: 0.8rem;">✓ Linked to Tab 4</span>`;
      } else if (isExpired) {
        actionsHtml = `<button type="button" class="btn btn-sm btn-outline btn-resend-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem;">🔄 Resend (24h)</button>`;
      } else {
        actionsHtml = `
          <div style="display: flex; gap: 0.35rem;">
            <button type="button" class="btn btn-sm btn-gold btn-approve-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">✓ Approve</button>
            <button type="button" class="btn btn-sm btn-outline btn-reject-pairing" data-invite-id="${inv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; color: #ef4444;">✕</button>
          </div>
        `;
      }

      return `
        <tr data-invite-row="${inv.id}">
          <td>
            <div style="font-weight: 700; color: var(--text-primary);">${inv.seekerName || 'Seeker'}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">${inv.seekerPhone || 'No Phone'}</div>
          </td>
          <td>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${inv.seekerDeviceModel || 'Android Device'}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${inv.formattedCreatedTime || 'Recent'}</div>
          </td>
          <td>${timerBadgeHtml}</td>
          <td><span class="verification-status-badge ${isApproved ? 'status-verified' : (isExpired ? 'status-unverified' : 'status-pending')}">${inv.status}</span></td>
          <td>${actionsHtml}</td>
        </tr>
      `;
    }).join('');
  }

  populateSettings(settings) {
    const s = {
      defaultMentorName: 'Karim Ji (Founder)',
      defaultMentorCode: 'SKHM-ADM1-7788-9900',
      speechLang: 'en-US',
      defaultTargetMalas: '11 Malas Daily',
      defaultSadhanaStreak: '1 Day',
      allowDevoteeDelete: false,
      devoteeCanEditLineage: true,
      devoteeCanEnroll: true,
      healerStrictTeam: true,
      healerCanCertify: true,
      healerCanDeleteTeam: true,
      healerCanViewEntireTeam: true,
      enableLiveSync: true,
      firebaseUrl: 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/',
      defaultRoleMode: 'MASTER',
      autoSaveMode: 'INSTANT',
      ...(settings || {})
    };

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : '';
    };

    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };

    setVal('setting-default-mentor-name', s.defaultMentorName);
    setVal('setting-default-mentor-code', s.defaultMentorCode);
    setVal('setting-speech-lang', s.speechLang);
    setVal('setting-default-target-malas', s.defaultTargetMalas);
    setChecked('setting-devotee-can-delete', s.allowDevoteeDelete === true);
    setChecked('setting-devotee-can-edit-lineage', s.devoteeCanEditLineage !== false);
    setChecked('setting-devotee-can-enroll', s.devoteeCanEnroll !== false);
    setChecked('setting-healer-strict-team', s.healerStrictTeam !== false);
    setChecked('setting-healer-can-certify', s.healerCanCertify !== false);
    setChecked('setting-healer-can-delete-team', s.healerCanDeleteTeam !== false);
    setVal('setting-firebase-url', s.firebaseUrl);
    setVal('setting-default-role-mode', s.defaultRoleMode);
    setVal('setting-auto-save', s.autoSaveMode);
  }

  readSettingsFromForm() {
    const getVal = (id, defaultVal = '') => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : defaultVal;
    };

    const getChecked = (id, defaultVal = false) => {
      const el = document.getElementById(id);
      return el ? el.checked : defaultVal;
    };

    return {
      defaultMentorName: getVal('setting-default-mentor-name', 'Karim Ji (Founder)'),
      defaultMentorCode: getVal('setting-default-mentor-code', 'SKHM-ADM1-7788-9900'),
      speechLang: getVal('setting-speech-lang', 'en-US'),
      defaultTargetMalas: getVal('setting-default-target-malas', '11 Malas Daily'),
      defaultSadhanaStreak: '1 Day',
      allowDevoteeDelete: getChecked('setting-devotee-can-delete', false),
      devoteeCanEditLineage: getChecked('setting-devotee-can-edit-lineage', true),
      devoteeCanEnroll: getChecked('setting-devotee-can-enroll', true),
      healerStrictTeam: getChecked('setting-healer-strict-team', true),
      healerCanCertify: getChecked('setting-healer-can-certify', true),
      healerCanDeleteTeam: getChecked('setting-healer-can-delete-team', true),
      healerCanViewEntireTeam: getChecked('setting-healer-strict-team', true),
      enableLiveSync: true,
      firebaseUrl: getVal('setting-firebase-url', 'https://spritualkarim-7b5fd-default-rtdb.firebaseio.com/'),
      defaultRoleMode: getVal('setting-default-role-mode', 'MASTER'),
      autoSaveMode: getVal('setting-auto-save', 'INSTANT')
    };
  }

  _updateJSONPreview(profile) {
    if (this.jsonPreviewCode) {
      this.jsonPreviewCode.textContent = JSON.stringify(profile, null, 2);
    }
  }

  
  openTierPanel(tierNumber, allProfiles, activeProfileId) {
    if (!this.tierProfilesPanel) return;

    this.currentOpenTier = tierNumber;
    const tierMeta = {
      1: { title: 'Admin Master Profiles', icon: '👑', color: '#8b5cf6', filter: p => p.profileType === 'ADMIN' || p.level === 1 },
      2: { title: 'Healer Connect Profiles', icon: '🛡️', color: '#10b981', filter: p => p.profileType === 'HEALER' && (p.level === 2 || p.level === 3 || !p.level) },
      3: { title: 'Trainee Sadhak Profiles', icon: '🌿', color: '#f59e0b', filter: p => p.profileType === 'TRAINEE' || p.level === 4 },
      4: { title: 'Devotee / Seeker Profiles', icon: '🌟', color: '#3b82f6', filter: p => p.profileType === 'DEVOTEE' || p.level === 5 || (!p.level && p.profileType !== 'ADMIN' && p.profileType !== 'HEALER' && p.profileType !== 'TRAINEE') }
    };

    const meta = tierMeta[tierNumber] || tierMeta[1];
    this.currentTierProfiles = (allProfiles || []).filter(meta.filter);

    if (this.tierPanelIcon) this.tierPanelIcon.textContent = meta.icon;
    if (this.tierPanelTitle) this.tierPanelTitle.textContent = meta.title;
    if (this.tierPanelCount) this.tierPanelCount.textContent = `${this.currentTierProfiles.length} Member${this.currentTierProfiles.length !== 1 ? 's' : ''}`;

    this._renderTierPanelCards(this.currentTierProfiles, activeProfileId, meta.color);

    // Active state on sidebar legend
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      const itemTier = parseInt(item.getAttribute('data-tier'), 10);
      if (itemTier === tierNumber) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.tierProfilesPanel.classList.add('is-open');
    if (this.inputTierPanelSearch) {
      this.inputTierPanelSearch.value = '';
      this.inputTierPanelSearch.focus();
    }
  }

  closeTierPanel() {
    if (!this.tierProfilesPanel) return;
    this.tierProfilesPanel.classList.remove('is-open');
    this.currentOpenTier = null;
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      item.classList.remove('active');
    });
  }

  _renderTierPanelCards(profiles, activeProfileId, borderColor = '#d4af37') {
    if (!this.tierPanelProfilesList) return;

    if (profiles.length === 0) {
      this.tierPanelProfilesList.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <div>No member profiles found in this tier.</div>
        </div>
      `;
      return;
    }

    this.tierPanelProfilesList.innerHTML = profiles.map(p => {
      const isActive = p.id === activeProfileId;
      const initials = (p.name || 'SK')
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      const isPaid = p.isPaid !== false && p.paymentStatus !== 'FREE';

      return `
        <div class="tier-panel-profile-card ${isActive ? 'active' : ''}" data-id="${p.id}" title="Click to view &amp; edit full profile for ${p.name}">
          <div class="tier-card-avatar-wrap">
            <div class="tier-card-avatar" style="border-color: ${borderColor};">
              ${initials}
              <span class="tier-card-avatar-dot ${p.isActive ? 'online' : 'offline'}"></span>
            </div>
          </div>
          <div class="tier-card-info">
            <div class="tier-card-name-row">
              <span class="tier-card-name">${p.name}</span>
              <span class="tier-card-stamp ${isPaid ? 'stamp-paid' : 'stamp-free'}">${isPaid ? 'PAID' : 'FREE'}</span>
            </div>
            <div class="tier-card-ref-row">
              <span class="tier-card-ref">${p.referenceCode}</span>
              <span class="tier-card-level-badge">LVL ${p.level || 1}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  updateLegendCounts(profiles) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    (profiles || []).forEach(p => {
      if (p.profileType === 'ADMIN' || p.level === 1) counts[1]++;
      else if (p.profileType === 'HEALER') counts[2]++;
      else if (p.profileType === 'TRAINEE' || p.level === 4) counts[3]++;
      else counts[4]++;
    });

    for (let t = 1; t <= 4; t++) {
      const el = document.getElementById('legend-count-tier-' + t);
      if (el) el.textContent = counts[t];
    }
  }

  showSlideToast(title, message, type = 'info', duration = 4500, actionBtn = null) {
    let container = document.getElementById('slide-in-toast-stack');
    if (!container) {
      container = document.createElement('div');
      container.id = 'slide-in-toast-stack';
      container.className = 'slide-in-toast-stack';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const validTypes = ['success', 'error', 'warning', 'info'];
    const toastType = validTypes.includes(type) ? type : 'info';
    toast.className = 'slide-toast-item slide-toast-' + toastType;

    const iconMap = {
      success: '🟢',
      error: '🔴',
      warning: '🟡',
      info: '✨'
    };

    const toastTitle = title || 'Spiritual Notification';
    const toastMsg = message || '';
    const icon = iconMap[toastType] || '🔔';

    let actionHtml = '';
    if (actionBtn && actionBtn.text && typeof actionBtn.onClick === 'function') {
      actionHtml = '<button type="button" class="btn btn-xs btn-gold mt-2 toast-action-btn">' + actionBtn.text + '</button>';
    }

    toast.innerHTML = `
      <span class="slide-toast-icon">${icon}</span>
      <div class="slide-toast-content">
        <div class="slide-toast-title">${toastTitle}</div>
        <div class="slide-toast-msg">${toastMsg}</div>
        ${actionHtml}
      </div>
      <button type="button" class="slide-toast-close" aria-label="Close Notification">&times;</button>
      <div class="slide-toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    container.appendChild(toast);

    const dismiss = () => {
      toast.classList.add('toast-closing');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 320);
    };

    toast.querySelector('.slide-toast-close').addEventListener('click', dismiss);

    if (actionHtml) {
      const btn = toast.querySelector('.toast-action-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          actionBtn.onClick();
          dismiss();
        });
      }
    }

    setTimeout(dismiss, duration);
  }

  openCustomDialog({ title = 'Spiritual Confirmation', message = '', icon = '✨', options = [] }) {
    return new Promise((resolve) => {
      let backdrop = document.getElementById('spiritual-custom-dialog-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'spiritual-custom-dialog-backdrop';
        backdrop.className = 'spiritual-dialog-backdrop';
        document.body.appendChild(backdrop);
      }

      const defaultOptions = options && options.length > 0 ? options : [
        { text: 'Confirm', type: 'btn-gold', value: true },
        { text: 'Cancel', type: 'btn-outline', value: false }
      ];

      const actionsHtml = defaultOptions.map((opt, idx) => 
        '<button type="button" class="btn ' + (opt.type || 'btn-outline') + '" data-dialog-idx="' + idx + '">' +
          opt.text +
        '</button>'
      ).join('');

      backdrop.innerHTML = `
        <div class="spiritual-dialog-box" role="dialog" aria-modal="true">
          <div class="spiritual-dialog-header">
            <span class="spiritual-dialog-icon">${icon}</span>
            <h3 class="spiritual-dialog-title">${title}</h3>
          </div>
          <div class="spiritual-dialog-body">${message}</div>
          <div class="spiritual-dialog-actions">${actionsHtml}</div>
        </div>
      `;

      backdrop.classList.add('is-active');

      const closeDialog = (resValue) => {
        backdrop.classList.remove('is-active');
        resolve(resValue);
      };

      const actionBtns = backdrop.querySelectorAll('[data-dialog-idx]');
      actionBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          const opt = defaultOptions[idx];
          if (typeof opt.action === 'function') {
            opt.action();
          }
          closeDialog(opt.value !== undefined ? opt.value : true);
        });
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeDialog(false);
        }
      });
    });
  }

  setValidationStatus(inputEl, isValid, errorMsg = '') {
    if (!inputEl) return;
    const group = inputEl.closest('.form-group') || inputEl.parentElement;
    if (!group) return;

    let msgEl = group.querySelector('.input-validation-msg');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'input-validation-msg';
      group.appendChild(msgEl);
    }

    if (isValid) {
      group.classList.remove('has-validation-error');
      group.classList.add('has-validation-success');
      msgEl.textContent = errorMsg || '✓ Valid entry';
    } else {
      group.classList.remove('has-validation-success');
      group.classList.add('has-validation-error');
      msgEl.textContent = errorMsg || '⚠️ Invalid format';
    }
  }

  showToast(titleOrMessage, messageText = '', type = 'info', duration = 4000, actionBtn = null) {
    const title = messageText ? titleOrMessage : 'Spiritual Karim System';
    const msg = messageText || titleOrMessage;
    this.showSlideToast(title, msg, type, duration, actionBtn);
  }

  showFloatingNotification(title, message, icon = '🔔', duration = 4500) {
    this.showToast(title, message, 'info', duration);
  }

  toggleJsonDrawer(forceState) {
    if (!this.jsonDrawer) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.jsonDrawer.classList.contains('open');
    if (isOpen) {
      this.jsonDrawer.classList.add('open');
      this.jsonDrawer.setAttribute('aria-hidden', 'false');
      if (this.jsonDrawerBackdrop) this.jsonDrawerBackdrop.classList.add('open');
    } else {
      this.jsonDrawer.classList.remove('open');
      this.jsonDrawer.setAttribute('aria-hidden', 'true');
      if (this.jsonDrawerBackdrop) this.jsonDrawerBackdrop.classList.remove('open');
    }
  }

  toggleImportModal(forceState) {
    if (!this.importModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.importModal.classList.contains('open');
    if (isOpen) {
      this.importModal.classList.add('open');
      this.importModal.setAttribute('aria-hidden', 'false');
    } else {
      this.importModal.classList.remove('open');
      this.importModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSettingsModal(forceState) {
    if (!this.adminSettingsModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.adminSettingsModal.classList.contains('open');
    if (isOpen) {
      this.adminSettingsModal.classList.add('open');
      this.adminSettingsModal.setAttribute('aria-hidden', 'false');
    } else {
      this.adminSettingsModal.classList.remove('open');
      this.adminSettingsModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleSharePairingModal(forceState) {
    if (!this.sharePairingModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.sharePairingModal.classList.contains('open');
    if (isOpen) {
      this.sharePairingModal.classList.add('open');
      this.sharePairingModal.setAttribute('aria-hidden', 'false');
    } else {
      this.sharePairingModal.classList.remove('open');
      this.sharePairingModal.setAttribute('aria-hidden', 'true');
    }
  }

  toggleTreeModal(forceState) {
    if (!this.hierarchyTreeModal) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.hierarchyTreeModal.classList.contains('open');
    if (isOpen) {
      this.hierarchyTreeModal.classList.add('open');
      this.hierarchyTreeModal.setAttribute('aria-hidden', 'false');
    } else {
      this.hierarchyTreeModal.classList.remove('open');
      this.hierarchyTreeModal.setAttribute('aria-hidden', 'true');
      this.toggleTreeProfileDrawer(false);
    }
  }

  toggleTreeProfileDrawer(forceState) {
    if (!this.treeProfileDrawer) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !this.treeProfileDrawer.classList.contains('open');
    if (isOpen) {
      this.treeProfileDrawer.classList.add('open');
      this.treeProfileDrawer.setAttribute('aria-hidden', 'false');
      if (this.treeDrawerBackdrop) this.treeDrawerBackdrop.classList.add('open');
    } else {
      this.treeProfileDrawer.classList.remove('open');
      this.treeProfileDrawer.setAttribute('aria-hidden', 'true');
      if (this.treeDrawerBackdrop) this.treeDrawerBackdrop.classList.remove('open');
    }
  }

  _getTierDetails(profile) {
    const type = (profile.profileType || '').toUpperCase();
    const lvl = parseInt(profile.level, 10) || 1;
    if (type === 'ADMIN' || lvl === 1) {
      return { tier: 1, title: 'Admin Master (Tier 1)', roleBadge: 'Tier 1 • Founder Master', nodeClass: 'mlm-node-tier-1', icon: '👑', color: 'var(--role-admin)' };
    }
    if (type === 'HEALER' || lvl === 2) {
      return { tier: 2, title: 'Healer Connect (Tier 2)', roleBadge: 'Tier 2 • Level Completed', nodeClass: 'mlm-node-tier-2', icon: '🔮', color: 'var(--role-healer)' };
    }
    if (type === 'TRAINEE' || lvl === 3 || lvl === 4) {
      return { tier: 3, title: 'Trainee Sadhak (Tier 3)', roleBadge: 'Tier 3 • In-Progress', nodeClass: 'mlm-node-tier-3', icon: '📿', color: 'var(--role-trainee)' };
    }
    return { tier: 4, title: 'Devotee / Seeker (Tier 4)', roleBadge: 'Tier 4 • Clean & Seekers', nodeClass: 'mlm-node-tier-4', icon: '🌱', color: 'var(--role-devotee)' };
  }

  // ==========================================================================
  // IN-BODY HIERARCHY TREE & SMART FIT ENGINE (TAB 5)
  // ==========================================================================

  renderInBodyHierarchyTree(profiles = [], focusTier = null, searchQuery = '', layoutMode = 'cluster') {
    if (!this.bodySpiderwebNodesLayer || !this.bodySpiderwebSvgLayer) {
      this.bodySpiderwebNodesLayer = document.getElementById('body-spiderweb-nodes-layer');
      this.bodySpiderwebSvgLayer = document.getElementById('body-spiderweb-svg-layer');
      this.bodyTreeSurface = document.getElementById('body-tree-surface');
      this.bodyTreeCanvasViewport = document.getElementById('body-tree-canvas-viewport');
    }

    if (!profiles || profiles.length === 0) {
      if (this.bodySpiderwebNodesLayer) {
        this.bodySpiderwebNodesLayer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">No profiles available.</div>';
      }
      return;
    }

    // Update Stats & Active Tier badge
    if (this.bodyTreeTotalMembers) {
      this.bodyTreeTotalMembers.textContent = `👥 Total Members: ${profiles.length}`;
    }
    if (this.bodyTreeActiveTier) {
      this.bodyTreeActiveTier.textContent = focusTier ? `Tier Focus: Tier ${focusTier}` : 'Tier Focus: All Tiers';
    }

    // 1. Organize profiles by tier
    const tier1List = profiles.filter(p => this._getTierDetails(p).tier === 1);
    const tier2List = profiles.filter(p => this._getTierDetails(p).tier === 2);
    const tier3List = profiles.filter(p => this._getTierDetails(p).tier === 3);
    const tier4List = profiles.filter(p => this._getTierDetails(p).tier === 4);

    const rootProfile = tier1List.length > 0 ? tier1List[0] : profiles[0];
    const cleanQuery = (searchQuery || '').trim().toLowerCase();
    const connections = [];

    const renderPersonNode = (p, tier, isRoot = false) => {
      const isDevotee = tier === 4;
      const headFill = isDevotee ? '#a5f3fc' : '#1e3a8a';
      const headStroke = isDevotee ? '#0284c7' : '#93c5fd';
      const bodyFill = isDevotee ? '#a5f3fc' : '#1e3a8a';
      const bodyStroke = isDevotee ? '#0284c7' : '#93c5fd';

      const name = p.name || (isRoot ? 'Founder (Karim Ji)' : 'Seeker');
      const isMatch = cleanQuery && name.toLowerCase().includes(cleanQuery);
      const isDimmed = (cleanQuery && !isMatch) || (focusTier && focusTier !== tier);

      return `
        <div class="spiderweb-node spiderweb-node-tier-${tier} ${isRoot ? 'is-root-node' : ''} ${isMatch ? 'search-match' : ''} ${isDimmed ? 'dimmed' : ''}"
             data-profile-id="${p.id}"
             data-tier="${tier}"
             id="body-tree-node-${p.id}"
             tabindex="0"
             title="${name} (${this._getTierDetails(p).title}) • Click to view details, double click to jump to profile">
          <div class="person-icon-graphic">
            <svg viewBox="0 0 36 50" width="${isRoot ? '38' : '32'}" height="${isRoot ? '50' : '42'}" class="person-svg">
              <circle cx="18" cy="9" r="6.5" fill="${headFill}" stroke="${headStroke}" stroke-width="1.8" class="person-head" />
              <rect x="7" y="18" width="22" height="26" rx="3" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="1.8" class="person-body" />
            </svg>
          </div>
          <div class="person-node-name">${name}</div>
        </div>
      `;
    };

    let html = '';

    if (layoutMode === 'cluster') {
      // Clustered MLM Branches
      const effectiveHealers = tier2List.length > 0 ? tier2List : [{ id: 'mock-h1', name: 'Acharya Devendra', referenceCode: 'SKHM-HLR2-3344-5566' }];

      const healerBranchesHtml = effectiveHealers.map((healer, hIdx) => {
        // Track Root -> Healer link
        connections.push({ parentId: `body-tree-node-${rootProfile.id}`, childId: `body-tree-node-${healer.id}` });

        // Find trainees under this healer
        let matchedTrainees = tier3List.filter(t => t.referredByCode && t.referredByCode === healer.referenceCode);
        if (matchedTrainees.length === 0 && tier3List.length > 0) {
          matchedTrainees = tier3List.filter((_, idx) => idx % effectiveHealers.length === hIdx);
        }
        if (matchedTrainees.length === 0) {
          matchedTrainees = [{ id: `mock-t-${hIdx}-1`, name: `Trainee ${hIdx + 1}.1`, referenceCode: `T${hIdx}1` }];
        }

        const traineeColumnsHtml = matchedTrainees.map((trainee, tIdx) => {
          // Track Healer -> Trainee link
          connections.push({ parentId: `body-tree-node-${healer.id}`, childId: `body-tree-node-${trainee.id}` });

          // Find devotees under this trainee
          let matchedDevotees = tier4List.filter(d => d.referredByCode && d.referredByCode === trainee.referenceCode);
          if (matchedDevotees.length === 0 && tier4List.length > 0) {
            matchedDevotees = tier4List.filter((_, idx) => idx % matchedTrainees.length === tIdx);
          }
          if (matchedDevotees.length === 0) {
            matchedDevotees = [{ id: `mock-d-${hIdx}-${tIdx}-1`, name: `Devotee ${tIdx + 1}.A` }];
          }

          // Track Trainee -> Devotees links
          matchedDevotees.forEach(devotee => {
            connections.push({ parentId: `body-tree-node-${trainee.id}`, childId: `body-tree-node-${devotee.id}` });
          });

          const devoteesHtml = matchedDevotees.map(d => renderPersonNode(d, 4)).join('');

          return `
            <div class="tree-sub-branch-column" id="column-trainee-${trainee.id}">
              <div class="tree-cluster-node-wrap">
                ${renderPersonNode(trainee, 3)}
              </div>
              <div class="tree-leaves-row" id="leaves-devotees-${trainee.id}">
                ${devoteesHtml}
              </div>
            </div>
          `;
        }).join('');

        return `
          <div class="tree-sub-branch-column" id="column-healer-${healer.id}">
            <div class="tree-cluster-node-wrap">
              ${renderPersonNode(healer, 2)}
            </div>
            <div class="tree-sub-branches-row" id="row-trainees-${healer.id}">
              ${traineeColumnsHtml}
            </div>
          </div>
        `;
      }).join('');

      html = `
        <div class="tree-hierarchy-wrapper" id="tree-hierarchy-wrapper">
          <!-- Tier 1: Top Master Root -->
          <div class="tree-cluster-node-wrap" id="tree-root-cluster">
            ${renderPersonNode(rootProfile, 1, true)}
          </div>
          <!-- Tier 2 & Down: Healers & Sub-branches -->
          <div class="tree-sub-branches-row" id="tree-healers-row">
            ${healerBranchesHtml}
          </div>
        </div>
      `;
    } else {
      // Spiderweb Matrix Layout (4 clean rows)
      const effectiveHealers = tier2List.length > 0 ? tier2List : [{ id: 'mock-h1', name: 'Acharya Devendra' }];
      const effectiveTrainees = tier3List.length > 0 ? tier3List : [{ id: 'mock-t1', name: 'Amitabh Sen' }];
      const effectiveDevotees = tier4List.length > 0 ? tier4List : [{ id: 'mock-d1', name: 'Sunita Mehra' }];

      effectiveHealers.forEach(h => {
        connections.push({ parentId: `body-tree-node-${rootProfile.id}`, childId: `body-tree-node-${h.id}` });
      });

      effectiveTrainees.forEach((t, idx) => {
        const parentH = effectiveHealers.find(h => h.referenceCode && h.referenceCode === t.referredByCode) || effectiveHealers[idx % effectiveHealers.length];
        if (parentH) connections.push({ parentId: `body-tree-node-${parentH.id}`, childId: `body-tree-node-${t.id}` });
      });

      effectiveDevotees.forEach((d, idx) => {
        const parentT = effectiveTrainees.find(t => t.referenceCode && t.referenceCode === d.referredByCode) || effectiveTrainees[idx % effectiveTrainees.length];
        if (parentT) connections.push({ parentId: `body-tree-node-${parentT.id}`, childId: `body-tree-node-${d.id}` });
      });

      html = `
        <div class="tree-hierarchy-wrapper spiderweb-matrix-flow" id="tree-hierarchy-wrapper">
          <div class="spiderweb-level-row level-1-row" id="body-row-tier-1">
            ${renderPersonNode(rootProfile, 1, true)}
          </div>
          <div class="spiderweb-level-row level-2-row" id="body-row-tier-2">
            ${effectiveHealers.map(h => renderPersonNode(h, 2)).join('')}
          </div>
          <div class="spiderweb-level-row level-3-row" id="body-row-tier-3">
            ${effectiveTrainees.map(t => renderPersonNode(t, 3)).join('')}
          </div>
          <div class="spiderweb-level-row level-4-row" id="body-row-tier-4">
            ${effectiveDevotees.map(d => renderPersonNode(d, 4)).join('')}
          </div>
        </div>
      `;
    }

    this.bodySpiderwebNodesLayer.innerHTML = html;
    this._currentTreeConnections = connections;

    // Draw connecting bezier lines with exact coordinates
    setTimeout(() => {
      this._drawInBodyConnectingLines(connections);
    }, 50);

    // Auto smart-fit on render
    setTimeout(() => {
      this.smartFitInBodyTree();
    }, 100);
  }

  _drawInBodyConnectingLines(connections = []) {
    if (!this.bodySpiderwebSvgLayer || !this.bodySpiderwebNodesLayer) return;

    const surfaceRect = this.bodySpiderwebNodesLayer.getBoundingClientRect();
    const scale = this.inBodyTreePanState?.scale || 1.0;

    const getCenterAnchor = (elemId, isTop = false) => {
      const el = document.getElementById(elemId);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = (rect.left + rect.width / 2 - surfaceRect.left) / scale;
      const y = (isTop ? (rect.top - surfaceRect.top) : (rect.bottom - surfaceRect.top)) / scale;
      return { x, y };
    };

    let pathsSvg = `
      <defs>
        <marker id="body-spiderweb-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 10 5 L 0 8.5 z" class="body-spiderweb-arrow-marker" />
        </marker>
      </defs>
    `;

    connections.forEach(conn => {
      const pAnchor = getCenterAnchor(conn.parentId, false);
      const cAnchor = getCenterAnchor(conn.childId, true);
      if (pAnchor && cAnchor) {
        const midY = (pAnchor.y + cAnchor.y) / 2;
        pathsSvg += `<path d="M ${pAnchor.x} ${pAnchor.y} C ${pAnchor.x} ${midY}, ${cAnchor.x} ${midY}, ${cAnchor.x} ${cAnchor.y}" class="spiderweb-bezier-line" marker-end="url(#body-spiderweb-arrow)" />`;
      }
    });

    this.bodySpiderwebSvgLayer.innerHTML = pathsSvg;
  }

  smartFitInBodyTree() {
    if (!this.bodyTreeCanvasViewport || !this.bodySpiderwebNodesLayer) return;

    const wrapper = document.getElementById('tree-hierarchy-wrapper');
    if (!wrapper) return;

    const vpRect = this.bodyTreeCanvasViewport.getBoundingClientRect();
    const contentRect = wrapper.getBoundingClientRect();

    const currentScale = this.inBodyTreePanState?.scale || 1.0;
    const rawContentW = contentRect.width / currentScale;
    const rawContentH = contentRect.height / currentScale;

    const availW = vpRect.width - 60;
    const availH = vpRect.height - 70;

    if (rawContentW <= 0 || rawContentH <= 0 || availW <= 0 || availH <= 0) return;

    const targetScale = Math.min(1.0, Math.max(0.35, Math.min(availW / rawContentW, availH / rawContentH)));
    const targetPanX = Math.round((vpRect.width - rawContentW * targetScale) / 2);
    const targetPanY = Math.max(25, Math.round((vpRect.height - rawContentH * targetScale) / 2) - 15);

    this.inBodyTreePanState = {
      ...this.inBodyTreePanState,
      scale: targetScale,
      panX: targetPanX,
      panY: targetPanY,
      isDragging: false
    };

    this._applyInBodyTreeTransform(true);
  }

  zoomInBodyTree() {
    this.inBodyTreePanState.scale = Math.min(2.5, this.inBodyTreePanState.scale + 0.18);
    this._applyInBodyTreeTransform(true);
  }

  zoomOutBodyTree() {
    this.inBodyTreePanState.scale = Math.max(0.3, this.inBodyTreePanState.scale - 0.18);
    this._applyInBodyTreeTransform(true);
  }

  resetInBodyTree() {
    this.inBodyTreePanState.scale = 1.0;
    this.inBodyTreePanState.panX = 0;
    this.inBodyTreePanState.panY = 30;
    this._applyInBodyTreeTransform(true);
  }

  _applyInBodyTreeTransform(withTransition = false) {
    if (!this.bodyTreeSurface) return;
    const { panX, panY, scale } = this.inBodyTreePanState;
    if (withTransition) {
      this.bodyTreeSurface.classList.remove('no-transition');
    } else {
      this.bodyTreeSurface.classList.add('no-transition');
    }
    this.bodyTreeSurface.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  _initInBodyTreePanZoomEvents() {
    if (!this.bodyTreeCanvasViewport || this._inBodyPanZoomInitialized) return;
    this._inBodyPanZoomInitialized = true;

    // Mouse Drag (Pan Anywhere like Google Maps)
    this.bodyTreeCanvasViewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('.spiderweb-node')) return;
      this.inBodyTreePanState.isDragging = true;
      this.inBodyTreePanState.startX = e.clientX - this.inBodyTreePanState.panX;
      this.inBodyTreePanState.startY = e.clientY - this.inBodyTreePanState.panY;
      this.bodyTreeCanvasViewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.inBodyTreePanState || !this.inBodyTreePanState.isDragging) return;
      this.inBodyTreePanState.panX = e.clientX - this.inBodyTreePanState.startX;
      this.inBodyTreePanState.panY = e.clientY - this.inBodyTreePanState.startY;
      this._applyInBodyTreeTransform(false);
    });

    window.addEventListener('mouseup', () => {
      if (this.inBodyTreePanState && this.inBodyTreePanState.isDragging) {
        this.inBodyTreePanState.isDragging = false;
        if (this.bodyTreeCanvasViewport) this.bodyTreeCanvasViewport.classList.remove('is-dragging');
      }
    });

    // Mouse Wheel Zoom
    this.bodyTreeCanvasViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const newScale = Math.min(2.5, Math.max(0.3, this.inBodyTreePanState.scale * zoomFactor));
      this.inBodyTreePanState.scale = newScale;
      this._applyInBodyTreeTransform(false);
    }, { passive: false });

    // Touch Drag & Pan
    let lastTouchX = 0;
    let lastTouchY = 0;
    this.bodyTreeCanvasViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.bodyTreeCanvasViewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        this.inBodyTreePanState.panX += dx;
        this.inBodyTreePanState.panY += dy;
        this._applyInBodyTreeTransform(false);
      }
    }, { passive: true });

    // Toolbar Buttons
    if (this.btnBodySmartFit) {
      this.btnBodySmartFit.addEventListener('click', () => {
        this.smartFitInBodyTree();
        this.showToast('🎯 Smart Fit applied: Centered & scaled to viewport.');
      });
    }

    if (this.btnBodyZoomIn) {
      this.btnBodyZoomIn.addEventListener('click', () => this.zoomInBodyTree());
    }

    if (this.btnBodyZoomOut) {
      this.btnBodyZoomOut.addEventListener('click', () => this.zoomOutBodyTree());
    }

    if (this.btnBodyZoomReset) {
      this.btnBodyZoomReset.addEventListener('click', () => {
        this.resetInBodyTree();
        this.showToast('🔄 Tree view reset to 100%');
      });
    }

    if (this.btnBodyFullscreen) {
      this.btnBodyFullscreen.addEventListener('click', () => {
        if (this.bodyTreeCanvasViewport) {
          this.bodyTreeCanvasViewport.classList.toggle('is-fullscreen');
          const isFull = this.bodyTreeCanvasViewport.classList.contains('is-fullscreen');
          this.btnBodyFullscreen.innerHTML = isFull ? '<span>✕</span> <span>Exit Fullscreen</span>' : '<span>⛶</span> <span>Fullscreen</span>';
          setTimeout(() => this.smartFitInBodyTree(), 200);
        }
      });
    }

    // Window Resize -> Re-fit if on tree tab
    window.addEventListener('resize', () => {
      const activeTab = document.querySelector('.main-tab-content-panel.active');
      if (activeTab && activeTab.id === 'tab-genealogy-tree') {
        this.smartFitInBodyTree();
      }
    });
  }

  openNodeActionDialog(profile) {
    if (!this.nodeActionDialog || !this.nodeDialogBody) return;
    const details = this._getTierDetails(profile);

    if (this.nodeDialogTitle) {
      this.nodeDialogTitle.textContent = `${details.icon} ${profile.name || 'Member'} (${details.roleBadge})`;
    }

    this.nodeDialogBody.innerHTML = `
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
        Select an enterprise action to perform for <strong>${profile.name}</strong>:
      </div>
      <div class="node-options-list">
        <button type="button" class="node-option-btn" id="btn-node-opt-edit" data-profile-id="${profile.id}">
          <span>👤</span>
          <div>
            <div>Go to Profile Workspace</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">Open tabs 1-4 for complete data edit</div>
          </div>
        </button>

        <button type="button" class="node-option-btn" id="btn-node-opt-share" data-profile-id="${profile.id}">
          <span>📲</span>
          <div>
            <div>Share &amp; Invite Seeker Payload</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">Generate 24-Hour pairing link with QR code</div>
          </div>
        </button>

        <button type="button" class="node-option-btn" id="btn-node-opt-copy" data-code="${profile.referenceCode || ''}">
          <span>📋</span>
          <div>
            <div>Copy 16-Digit Reference Code</div>
            <div style="font-size: 0.75rem; color: var(--text-gold); font-family: var(--font-mono); font-weight: normal;">${profile.referenceCode || 'N/A'}</div>
          </div>
        </button>

        <button type="button" class="node-option-btn" id="btn-node-opt-inspect" data-profile-id="${profile.id}">
          <span>🔍</span>
          <div>
            <div>Inspect Downline Lineage Drawer</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">Slide out verified sadhana progress &amp; clean logs</div>
          </div>
        </button>
      </div>
    `;

    this.nodeActionDialog.classList.add('open');
    this.nodeActionDialog.setAttribute('aria-hidden', 'false');
  }

  closeNodeActionDialog() {
    if (this.nodeActionDialog) {
      this.nodeActionDialog.classList.remove('open');
      this.nodeActionDialog.setAttribute('aria-hidden', 'true');
    }
  }

  // ==========================================================================
  // LEGACY MODAL TREE VIEW (PRESERVED FOR BACKWARD COMPATIBILITY)
  // ==========================================================================

  renderHierarchyTree(profiles, focusTier = null) {
    // Forward to in-body rendering or modal
    this.renderInBodyHierarchyTree(profiles, focusTier, '', 'cluster');
  }

  _drawSpiderwebConnectingLines(root, tier2, tier3, tier4) {
    this._drawInBodyConnectingLines(root, tier2, tier3, tier4, 'cluster');
  }

  _resetTreePanZoom() {
    this.resetInBodyTree();
  }

  _applyTreeTransform() {
    this._applyInBodyTreeTransform(true);
  }

  _initTreePanZoomEvents() {
    this._initInBodyTreePanZoomEvents();
  }

  renderTreeProfileDrawer(profile) {
    if (!this.treeDrawerBody) return;
    const details = this._getTierDetails(profile);

    if (this.treeDrawerProfileName) this.treeDrawerProfileName.textContent = profile.name || 'Seeker';
    if (this.treeDrawerProfileRole) this.treeDrawerProfileRole.textContent = `${details.icon} ${details.roleBadge}`;
    if (this.btnTreeLoadProfile) this.btnTreeLoadProfile.setAttribute('data-profile-id', profile.id);

    // Calculate metadata stats
    const hcList = profile.houseCleanLevels || [];
    const hcCompleted = hcList.filter(h => h.status === 'COMPLETED' || h.cleanPercentage >= 100).length;
    const traineeList = profile.traineeSadhanas || [];
    const healerList = profile.healerCompletedSadhanas || [];
    const netList = profile.healerNetwork || [];

    const html = `
      <!-- Profile Header Summary Card -->
      <div class="tree-meta-card">
        <div class="tree-meta-heading">
          <span>${details.icon}</span> Member Identification
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Reference Code:</span>
          <span class="tree-meta-value font-mono" style="color: var(--gold-400); font-weight: 700;">${profile.referenceCode || 'N/A'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Sponsor / Mentor:</span>
          <span class="tree-meta-value font-mono">${profile.referredByCode || 'ROOT / Direct'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Active Status:</span>
          <span class="tree-meta-value">
            <span class="tree-status-chip ${profile.isActive ? 'active' : 'inactive'}">${profile.isActive ? '● Active Member' : '○ Inactive'}</span>
          </span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Payment Tier:</span>
          <span class="tree-meta-value">
            <span class="tree-status-chip ${profile.isPaid ? 'paid' : 'free'}">${profile.isPaid ? '🟢 PAID TIER' : '🔴 FREE TIER'}</span>
          </span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Joined On:</span>
          <span class="tree-meta-value">${profile.joinDate || 'N/A'}</span>
        </div>
      </div>

      <!-- Contact & Personal Card -->
      <div class="tree-meta-card">
        <div class="tree-meta-heading">
          <span>📍</span> Contact &amp; Location
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">City / Region:</span>
          <span class="tree-meta-value">${profile.city || 'Not specified'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Phone:</span>
          <span class="tree-meta-value font-mono">${profile.phone || 'N/A'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Email:</span>
          <span class="tree-meta-value">${profile.email || 'N/A'}</span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">Category Tag:</span>
          <span class="tree-meta-value">${profile.categoryTag || 'General'}</span>
        </div>
      </div>

      <!-- Spiritual Progress & Cleansing Status -->
      <div class="tree-meta-card">
        <div class="tree-meta-heading">
          <span>🧹</span> House Clean &amp; Sadhana Status
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">House Clean Levels:</span>
          <span class="tree-meta-value" style="color: ${hcCompleted > 0 ? '#10b981' : 'var(--text-secondary)'}; font-weight: 600;">
            ${hcCompleted} / ${hcList.length || 3} Completed
          </span>
        </div>
        <div class="tree-meta-row">
          <span class="tree-meta-label">In-Progress Sadhanas:</span>
          <span class="tree-meta-value">${traineeList.length} Active Practices</span>
        </div>
        ${details.tier <= 2 ? `
          <div class="tree-meta-row">
            <span class="tree-meta-label">Master Certifications:</span>
            <span class="tree-meta-value">${healerList.length} Completed</span>
          </div>
          <div class="tree-meta-row">
            <span class="tree-meta-label">Downline Devotees:</span>
            <span class="tree-meta-value">${netList.length} Connected</span>
          </div>
        ` : ''}
        ${profile.objective ? `
          <div style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--text-secondary); background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 6px;">
            <strong style="color: var(--gold-400);">Spiritual Goal:</strong><br>
            ${profile.objective.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
      </div>
    `;

    this.treeDrawerBody.innerHTML = html;
  }

  // ==========================================================================
  // ANDROID COMPOSE ALIGNED: HEALERS HUB & RECURSIVE HIERARCHY TREE METHODS
  // ==========================================================================

  renderAndroidHealersHub(scopedProfiles = [], activeProfile = null, roleMode = 'MASTER') {
    // 1. Summary Metrics
    const totalCount = scopedProfiles.length;
    const adminCount = scopedProfiles.filter(p => p.profileType === 'ADMIN' || p.level === 1).length;
    const healersCount = scopedProfiles.filter(p => p.profileType === 'HEALER' || p.level === 2 || p.level === 3).length;
    const traineesCount = scopedProfiles.filter(p => p.profileType === 'TRAINEE' || p.level === 4).length;
    const devoteesCount = scopedProfiles.filter(p => p.profileType === 'DEVOTEE' || p.level === 5).length;

    if (this.hubMetricTotal) this.hubMetricTotal.textContent = totalCount;
    if (this.hubMetricAdmin) this.hubMetricAdmin.textContent = adminCount;
    if (this.hubMetricHealers) this.hubMetricHealers.textContent = healersCount;
    if (this.hubMetricTrainees) this.hubMetricTrainees.textContent = traineesCount;
    if (this.hubMetricDevotees) this.hubMetricDevotees.textContent = devoteesCount;

    // 2. Category Filter Chip Counts
    const setChipText = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };
    setChipText('chip-cnt-all', totalCount);
    setChipText('chip-cnt-admin', adminCount);
    setChipText('chip-cnt-healers', healersCount);
    setChipText('chip-cnt-trainees', traineesCount);
    setChipText('chip-cnt-devotees', devoteesCount);

    // 3. Filter List by Category & Search Query
    const query = (this.healersSearchQuery || '').trim().toLowerCase();
    const category = this.healersSelectedCategory || 'ALL';

    const filtered = scopedProfiles.filter(p => {
      const matchesCategory = category === 'ALL' || p.profileType === category;
      const matchesQuery = !query ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.referenceCode && p.referenceCode.toLowerCase().includes(query)) ||
        (p.phone && p.phone.includes(query)) ||
        (p.city && p.city.toLowerCase().includes(query)) ||
        (p.level && p.level.toString() === query);
      return matchesCategory && matchesQuery;
    });

    if (!this.healersHubCardsContainer) {
      this.healersHubCardsContainer = document.getElementById('healers-hub-cards-container');
    }
    if (!this.healersHubCardsContainer) return;

    if (filtered.length === 0) {
      this.healersHubCardsContainer.innerHTML = `
        <div class="healers-empty-state">
          <div class="healers-empty-state-icon">🔍</div>
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">No profiles found</div>
          <div style="font-size: 0.82rem;">No member profiles match "${query || category}". Try adjusting search filters.</div>
        </div>
      `;
      return;
    }

    const getAvatarClass = (p) => {
      if (p.profileType === 'ADMIN' || p.level === 1) return 'avatar-admin';
      if (p.profileType === 'HEALER' || p.level === 2 || p.level === 3) return 'avatar-healer';
      if (p.profileType === 'TRAINEE' || p.level === 4) return 'avatar-trainee';
      return 'avatar-devotee';
    };

    const getBadgeClass = (p) => {
      if (p.profileType === 'ADMIN' || p.level === 1) return 'badge-pill-admin';
      if (p.profileType === 'HEALER' || p.level === 2 || p.level === 3) return 'badge-pill-healer';
      if (p.profileType === 'TRAINEE' || p.level === 4) return 'badge-pill-trainee';
      return 'badge-pill-devotee';
    };

    const getRoleName = (p) => {
      if (p.profileType === 'ADMIN' || p.level === 1) return 'Founder Master';
      if (p.profileType === 'HEALER' || p.level === 2 || p.level === 3) return 'Spiritual Healer';
      if (p.profileType === 'TRAINEE' || p.level === 4) return 'Mentorship Trainee';
      return 'Devotee Seeker';
    };

    this.healersHubCardsContainer.innerHTML = filtered.map(p => {
      const remediesCount = (p.selectedRemedies || []).length;
      const isCurrentActive = activeProfile && activeProfile.id === p.id;

      return `
        <div class="healer-member-card ${isCurrentActive ? 'active-member-card' : ''}" data-profile-id="${p.id}" style="${isCurrentActive ? 'border-color: var(--gold-400); background: rgba(212, 175, 55, 0.08);' : ''}">
          <!-- Level Avatar Box -->
          <div class="healer-member-avatar-box ${getAvatarClass(p)}">
            L${p.level || 1}
          </div>

          <!-- Main Info -->
          <div class="healer-member-info">
            <div class="healer-member-name-row">
              <span class="healer-member-name">${p.name || 'Member'}</span>
              <span class="healer-role-badge-pill ${getBadgeClass(p)}">${getRoleName(p)}</span>
              ${p.isPaid ? '<span class="stamp-indicator stamp-paid" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">PAID</span>' : '<span class="stamp-indicator stamp-free" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">FREE</span>'}
            </div>

            <div class="healer-member-contact">
              ${p.phone || '+91 98000 00000'} • ${p.city || 'National'}
            </div>

            <!-- 16-Digit Reference Code Pill with Copy -->
            <div>
              <span class="healer-ref-code-pill btn-copy-card-code" data-code="${p.referenceCode}" title="Click to copy 16-digit reference code">
                <span>📱</span>
                <span class="healer-ref-code-text">${p.referenceCode || 'SKHM-0000-0000-0000'}</span>
                <span style="font-size: 0.72rem; color: var(--text-muted);">📋</span>
              </span>
            </div>

            <!-- Referred By & Remedy Pill -->
            <div class="healer-member-meta-row">
              <span>Sponsor: ${(p.referredByCode || 'ROOT-0000-0000-0000').substring(0, 14)}...</span>
              ${remediesCount > 0 ? `<span class="healer-remedy-count-pill">🌿 ${remediesCount} Remedies</span>` : ''}
            </div>
          </div>

          <!-- 3-Dots Action Menu Trigger -->
          <div style="position: relative;">
            <button type="button" class="healer-card-actions-menu-btn btn-member-quick-opts" data-profile-id="${p.id}" title="Member Actions">
              ⋮
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAndroidHierarchyTree(profiles = [], levelFilter = 'ALL', activeProfile = null, treeScope = 'downline') {
    if (!this.hierarchyRecursiveTreeView) {
      this.hierarchyRecursiveTreeView = document.getElementById('hierarchy-recursive-tree-view');
    }
    if (!this.hierarchyRecursiveTreeView) return;

    const allProfiles = profiles || [];
    const focusNode = activeProfile || (this.allProfiles ? this.allProfiles[0] : allProfiles[0]);
    if (!focusNode) {
      this.hierarchyRecursiveTreeView.innerHTML = '<div class="healers-empty-state"><div class="healers-empty-state-icon">🌳</div><div>No tree members found.</div></div>';
      return;
    }

    // 1. Update Level Filter Chip Counts
    const setTreeCount = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };
    setTreeCount('tree-cnt-all', allProfiles.length);
    setTreeCount('tree-cnt-1', allProfiles.filter(p => p.level === 1 || p.profileType === 'ADMIN').length);
    setTreeCount('tree-cnt-2', allProfiles.filter(p => p.level === 2 || p.profileType === 'HEALER').length);
    setTreeCount('tree-cnt-3', allProfiles.filter(p => p.level === 3).length);
    setTreeCount('tree-cnt-4', allProfiles.filter(p => p.level === 4 || p.profileType === 'TRAINEE').length);
    setTreeCount('tree-cnt-5', allProfiles.filter(p => p.level === 5 || p.profileType === 'DEVOTEE').length);

    // 2. Build Ancestral Upline Breadcrumb Path (Top of Tree)
    const breadcrumbChain = [];
    let currentTrace = focusNode;
    const visitedCodes = new Set();

    while (currentTrace && !visitedCodes.has(currentTrace.referenceCode)) {
      visitedCodes.add(currentTrace.referenceCode);
      breadcrumbChain.unshift(currentTrace);
      if (!currentTrace.referredByCode || currentTrace.referredByCode === 'ROOT' || currentTrace.referredByCode === 'ROOT-0000-0000-0000') {
        break;
      }
      const parent = allProfiles.find(p => p.referenceCode === currentTrace.referredByCode);
      if (!parent || parent.id === currentTrace.id) break;
      currentTrace = parent;
    }

    const breadcrumbHtml = breadcrumbChain.map((node, idx) => {
      const isCurrent = node.id === focusNode.id;
      const roleIcon = node.profileType === 'ADMIN' ? '👑' : (node.profileType === 'HEALER' ? '🛡️' : (node.profileType === 'TRAINEE' ? '🌿' : '🌟'));
      return `
        <span class="tree-breadcrumb-item ${isCurrent ? 'current-node' : 'btn-jump-profile-trigger'}" data-profile-id="${node.id}" title="Jump to ${node.name}">
          ${roleIcon} ${node.name}
        </span>
        ${idx < breadcrumbChain.length - 1 ? '<span class="tree-breadcrumb-sep">➔</span>' : ''}
      `;
    }).join('');

    // 3. Calculate Direct and Total Downline Sub-tree for Focus Node
    const getDownlineMembers = (parentCode, visited = new Set()) => {
      const list = [];
      const direct = allProfiles.filter(p => p.referredByCode === parentCode && p.id !== focusNode.id);
      for (const d of direct) {
        if (!visited.has(d.referenceCode)) {
          visited.add(d.referenceCode);
          list.push(d);
          list.push(...getDownlineMembers(d.referenceCode, visited));
        }
      }
      return list;
    };

    const directChildren = allProfiles.filter(p => p.referredByCode === focusNode.referenceCode && p.id !== focusNode.id);
    const totalDownlines = getDownlineMembers(focusNode.referenceCode);
    const isPaid = focusNode.isPaid !== false && focusNode.paymentStatus !== 'FREE';
    const initials = (focusNode.name || 'SK').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    // 4. Render Top Focus Node Banner
    const topBannerHtml = `
      <div class="tree-focus-top-banner">
        <div class="tree-ancestral-breadcrumb">
          <span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Lineage Path:</span>
          ${breadcrumbHtml}
        </div>

        <div class="tree-focus-profile-row">
          <div class="tree-focus-avatar-group">
            <div class="tree-focus-avatar">${initials}</div>
            <div>
              <div class="tree-focus-title">${focusNode.name}</div>
              <div class="tree-focus-sub">
                <span class="role-badge" style="font-size: 0.68rem; padding: 0.15rem 0.5rem;">${focusNode.profileType} • LVL ${focusNode.level || 1}</span>
                <span style="font-family: monospace;">${focusNode.referenceCode}</span>
                <span class="stamp-indicator ${isPaid ? 'stamp-paid' : 'stamp-free'}" style="font-size: 0.65rem;">${isPaid ? 'PAID' : 'FREE'}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button type="button" class="btn btn-xs btn-outline btn-toggle-tree-view-scope" data-scope="${treeScope === 'downline' ? 'org' : 'downline'}" title="Switch between scoped downline and full org tree">
              ${treeScope === 'downline' ? '🌐 View Entire Org Tree' : '🎯 View Focus Downlines'}
            </button>
          </div>
        </div>

        <div class="tree-metrics-bar">
          <div class="tree-metric-box">
            <div class="tree-metric-label">Direct Referrals (L1)</div>
            <div class="tree-metric-val">${directChildren.length}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Total Downlines</div>
            <div class="tree-metric-val">${totalDownlines.length}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Upline Sponsor</div>
            <div class="tree-metric-val" style="font-size: 0.75rem; font-family: monospace;">${focusNode.referredByCode || 'ROOT'}</div>
          </div>
          <div class="tree-metric-box">
            <div class="tree-metric-label">Network Status</div>
            <div class="tree-metric-val" style="color: #10b981; font-size: 0.8rem;">🟢 ACTIVE</div>
          </div>
        </div>
      </div>
    `;

    // 5. Render Recursive Downline Nodes
    let treeBodyHtml = '';

    if (levelFilter !== 'ALL') {
      const targetLvl = parseInt(levelFilter, 10);
      const levelRoots = allProfiles.filter(p => p.level === targetLvl || (targetLvl === 1 && p.profileType === 'ADMIN') || (targetLvl === 2 && (p.level === 2 || p.profileType === 'HEALER')) || (targetLvl === 3 && p.level === 3) || (targetLvl === 4 && (p.level === 4 || p.profileType === 'TRAINEE')) || (targetLvl === 5 && (p.level === 5 || p.profileType === 'DEVOTEE')));

      let totalConnectedUnderLevel = 0;
      levelRoots.forEach(r => {
        totalConnectedUnderLevel += getDownlineMembers(r.referenceCode).length;
      });

      treeBodyHtml = `
        <div class="tree-scope-title" style="margin-bottom: 0.85rem; color: var(--gold-400);">
          <span>🌳</span> Level Generation ${targetLvl} Lineages &amp; Downlines (${levelRoots.length} Root Nodes • ${totalConnectedUnderLevel} Connected Downlines)
        </div>
        ${levelRoots.length > 0 ? levelRoots.map(root => this._renderRecursiveTreeBranchHtml(root, allProfiles, 0)).join('') : '<div class="healers-empty-state"><div class="healers-empty-state-icon">🌱</div><div>No members found at Level ' + targetLvl + '</div></div>'}
      `;
    } else if (treeScope === 'downline') {
      // Scoped Downline Tree under Focus Node
      if (directChildren.length === 0) {
        treeBodyHtml = `
          <div class="healers-empty-state" style="background: rgba(0,0,0,0.25); border: 1px dashed rgba(212,175,55,0.25); border-radius: 0.75rem; padding: 2rem 1rem;">
            <div class="healers-empty-state-icon">🌱</div>
            <div style="font-weight: 700; color: var(--gold-400); margin-bottom: 0.35rem;">No Downline Disciples Yet under ${focusNode.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1rem auto;">
              Share reference code <strong>${focusNode.referenceCode}</strong> or 24-Hour pairing invite from the top bar to connect new trainees and seekers under this lineage.
            </div>
            <div style="display: flex; justify-content: center; gap: 0.6rem;">
              <button type="button" class="btn btn-sm btn-gold" id="btn-tree-copy-invite" data-code="${focusNode.referenceCode}">
                📋 Copy Invite Code
              </button>
              <button type="button" class="btn btn-sm btn-outline btn-toggle-tree-view-scope" data-scope="org">
                🌐 View Full Organization Tree (${allProfiles.length})
              </button>
            </div>
          </div>
        `;
      } else {
        treeBodyHtml = `
          <div class="tree-scope-title" style="margin-bottom: 0.75rem; color: var(--gold-400);">
            <span>🌿</span> Connected Downlines under ${focusNode.name} (${totalDownlines.length} Members)
          </div>
          ${this._renderRecursiveTreeBranchHtml(focusNode, allProfiles, 0)}
        `;
      }
    } else {
      // Full Organization Tree (starting from root level 1 nodes)
      const allRefCodes = new Set(allProfiles.map(p => p.referenceCode));
      const rootProfiles = allProfiles.filter(p => p.level === 1 || p.profileType === 'ADMIN' || !allRefCodes.has(p.referredByCode));
      const effectiveRoots = rootProfiles.length > 0 ? rootProfiles : [allProfiles[0]];

      treeBodyHtml = `
        <div class="tree-scope-title" style="margin-bottom: 0.75rem; color: var(--gold-400);">
          <span>🌐</span> Full Organization Lineage Tree (${allProfiles.length} Members)
        </div>
        ${effectiveRoots.map(root => this._renderRecursiveTreeBranchHtml(root, allProfiles, 0)).join('')}
      `;
    }

    this.hierarchyRecursiveTreeView.innerHTML = topBannerHtml + treeBodyHtml;
  }

  _renderRecursiveTreeBranchHtml(node, allProfiles, indentDp) {
    const children = allProfiles.filter(p => p.referredByCode && p.referredByCode === node.referenceCode && p.id !== node.id);
    const hasChildren = children.length > 0;
    const isExpanded = true;

    const childrenHtml = hasChildren ? `
      <div class="hierarchy-node-children-branch" id="tree-branch-${node.id}">
        ${children.map(child => this._renderRecursiveTreeBranchHtml(child, allProfiles, indentDp + 16)).join('')}
      </div>
    ` : '';

    return `
      <div class="hierarchy-tree-node-wrapper" data-node-id="${node.id}">
        ${this._renderHierarchyNodeCardHtml(node, hasChildren, isExpanded, children.length, allProfiles)}
        ${childrenHtml}
      </div>
    `;
  }

  _renderHierarchyNodeCardHtml(profile, hasChildren = false, isExpanded = true, directChildrenCount = 0, allProfiles = []) {
    const getAvatarBg = (p) => {
      if (p.profileType === 'ADMIN' || p.level === 1) return 'linear-gradient(135deg, #7a1c37, #b91c1c)';
      if (p.profileType === 'HEALER' || p.level === 2 || p.level === 3) return 'linear-gradient(135deg, #fcb900, #d97706)';
      if (p.profileType === 'TRAINEE' || p.level === 4) return 'linear-gradient(135deg, #00d084, #059669)';
      return 'linear-gradient(135deg, #0088cc, #2563eb)';
    };

    return `
      <div class="hierarchy-node-card-item" data-profile-id="${profile.id}">
        ${hasChildren ? `
          <button type="button" class="hierarchy-node-expand-btn btn-toggle-tree-branch" data-node-id="${profile.id}" title="Expand / Collapse Branch">
            ${isExpanded ? '−' : '+'}
          </button>
        ` : '<span style="width: 24px;"></span>'}

        <!-- Level Circle -->
        <div class="hierarchy-node-level-circle" style="background: ${getAvatarBg(profile)};">
          L${profile.level || 1}
        </div>

        <!-- Node Info (Click to jump to profile) -->
        <div class="hierarchy-node-content btn-jump-profile-trigger" data-profile-id="${profile.id}" title="Click to view full details for ${profile.name}">
          <div class="hierarchy-node-title-row">
            <span class="hierarchy-node-name">${profile.name || 'Member'}</span>
            ${profile.isPaid ? '<span style="font-size: 0.65rem; color: #10b981; font-weight: 700;">● PAID</span>' : '<span style="font-size: 0.65rem; color: #ef4444; font-weight: 700;">○ FREE</span>'}
            ${directChildrenCount > 0 ? `<span style="font-size: 0.65rem; color: var(--gold-400); font-weight: 700; background: rgba(212,175,55,0.12); padding: 0.1rem 0.4rem; border-radius: 999px;">👥 ${directChildrenCount} Direct</span>` : ''}
          </div>
          <div class="hierarchy-node-details">
            ${profile.profileType || 'DEVOTEE'} • ${profile.referenceCode || 'SKHM-0000'} ${profile.referredByCode ? '• Sponsor: ' + profile.referredByCode : ''}
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="hierarchy-node-actions-row">
          <button type="button" class="hierarchy-node-action-btn btn-share-tree-node" data-profile-id="${profile.id}" title="Share Node Reference">
            📲 Share
          </button>
          <button type="button" class="hierarchy-node-action-btn btn-jump-profile-trigger" data-profile-id="${profile.id}" title="Inspect Details">
            👁️ View
          </button>
        </div>
      </div>
    `;
  }

}

// ============================================================== 
// 4. CONTROLLER LAYER (INTERCONNECTING ALL TABS & DRAWER ACTIONS)
// ============================================================== 
class ProfileController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this._initTheme();
    this._renderCurrentState();
    this._bindNavigationTabs();
    this._bindSadhanaCatalogEvents();
    this._bindEvents();

    window.addEventListener('online', () => {
      this.model.flushOfflineSyncQueue();
      this.view.showToast('📶 Online connection restored. Telemetry synced.');
    });
  }

  // ==========================================
  // Device OS Theme Management (Auto / Dark / Light)
  // ==========================================
  _initTheme() {
    const savedTheme = localStorage.getItem('sk_theme_preference') || 'auto';
    this._applyTheme(savedTheme, false);

    // Dynamic listener for OS theme preference changes
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        const currentPref = localStorage.getItem('sk_theme_preference') || 'auto';
        if (currentPref === 'auto') {
          this._applyTheme('auto', false);
        }
      });
    } catch (err) {
      console.warn('MatchMedia listener error', err);
    }
  }

  _applyTheme(pref, showToast = false) {
    localStorage.setItem('sk_theme_preference', pref);
    let resolvedTheme = pref;
    if (pref === 'auto') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', resolvedTheme);

    if (this.view.themeIcon && this.view.themeLabel) {
      if (pref === 'auto') {
        this.view.themeIcon.textContent = '💻';
        this.view.themeLabel.textContent = `Auto (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`;
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title = `Theme: Auto (Device OS: ${resolvedTheme === 'dark' ? 'Dark' : 'Light'}) | Click to change`;
        }
      } else if (pref === 'dark') {
        this.view.themeIcon.textContent = '🌙';
        this.view.themeLabel.textContent = 'Dark';
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title = 'Theme: Dark Mode | Click to change';
        }
      } else {
        this.view.themeIcon.textContent = '☀️';
        this.view.themeLabel.textContent = 'Light';
        if (this.view.btnThemeToggle) {
          this.view.btnThemeToggle.title = 'Theme: Light Mode | Click to change';
        }
      }
    }

    if (showToast) {
      this.view.showToast(`🎨 Theme switched to: ${pref.toUpperCase()}`);
    }
  }

  _cycleTheme() {
    const current = localStorage.getItem('sk_theme_preference') || 'auto';
    const sequence = ['auto', 'dark', 'light'];
    const nextIndex = (sequence.indexOf(current) + 1) % sequence.length;
    const nextTheme = sequence[nextIndex];
    this._applyTheme(nextTheme, true);
  }

  _renderCurrentState() {
    const active = this.model.getActiveProfile();
    const visibleProfiles = this.model.getVisibleProfiles();
    const roleMode = this.model.getRoleMode();
    const settings = this.model.settings;
    this.view.allProfiles = this.model.profiles;
    this.view.render(active, visibleProfiles, roleMode, settings);
    this._filterRemedies();
  }

  _filterRemedies() {
    const searchInput = document.getElementById('input-search-remedies');
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const activeSeg = document.querySelector('.segmented-control[data-target-section="remedies"] .segmented-item.active');
    const filterMode = activeSeg ? (activeSeg.getAttribute('data-filter') || 'ALL') : 'ALL';

    const remedyCards = document.querySelectorAll('.remedy-card-option');
    let matchCount = 0;

    remedyCards.forEach(card => {
      const titleEl = card.querySelector('.option-title');
      const tagEl = card.querySelector('.option-tag');
      const sadhanaId = card.getAttribute('data-sadhana-id') || '';
      const catalogItem = SADHANA_CATALOG[sadhanaId] || {};

      const textContent = `${titleEl ? titleEl.textContent : ''} ${tagEl ? tagEl.textContent : ''} ${catalogItem.summary || ''} ${catalogItem.mantra || ''}`.toLowerCase();
      const isPaid = card.classList.contains('tile-paid') || card.querySelector('.stamp-paid') !== null;

      const matchesSearch = query === '' || textContent.includes(query);
      const matchesFilter = filterMode === 'ALL' || (filterMode === 'PAID' && isPaid) || (filterMode === 'FREE' && !isPaid);

      if (matchesSearch && matchesFilter) {
        card.style.display = '';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Also manage category group headers visibility if all cards inside are hidden
    document.querySelectorAll('.remedy-category-group').forEach(group => {
      const visibleCards = group.querySelectorAll('.remedy-card-option:not([style*="display: none"])');
      group.style.display = visibleCards.length > 0 ? '' : 'none';
    });
  }

  switchMainTab(tabId) {
    const allTabBtns = document.querySelectorAll('.main-tab-btn');
    const allPanels = document.querySelectorAll('.main-tab-content-panel');

    allTabBtns.forEach(btn => {
      if (btn.getAttribute('data-main-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    allPanels.forEach(p => {
      if (p.id === tabId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    if (tabId === 'tab-genealogy-tree') {
      const activeProf = this.model.getActiveProfile();
      this.view.renderInBodyHierarchyTree(this.model.profiles, null, '', this.view.inBodyTreePanState?.layoutMode || 'cluster');
      if (typeof this.view.renderRespectiveTreeSection === 'function') {
        this.view.renderRespectiveTreeSection(activeProf, this.model.profiles);
      }
      setTimeout(() => {
        if (typeof this.view.smartFitInBodyTree === 'function') {
          this.view.smartFitInBodyTree();
        }
      }, 100);
    }
  }

  _bindNavigationTabs() {
    // Delegated click on any .main-tab-btn (including Box 1 Header 3rd Column Genealogy Tab and lower 4 nav bar tabs)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.main-tab-btn');
      if (btn) {
        const tabId = btn.getAttribute('data-main-tab');
        if (tabId) {
          this.switchMainTab(tabId);
        }
      }

      // Sub-tab button switching
      const subBtn = e.target.closest('.sub-tab-btn');
      if (subBtn) {
        const subTabId = subBtn.getAttribute('data-sub-tab');
        const parentPanel = subBtn.closest('.main-tab-content-panel');
        if (parentPanel && subTabId) {
          parentPanel.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
          subBtn.classList.add('active');
          parentPanel.querySelectorAll('.sub-tab-panel').forEach(p => {
            if (p.id === subTabId) p.classList.add('active');
            else p.classList.remove('active');
          });
        }
      }
    });
  }

  _bindSadhanaCatalogEvents() {
    // 1. Delegated Click on Sadhana/Remedy Card Option / Eye Trigger -> Open Slide-out Drawer
    document.addEventListener('click', (e) => {
      const eyeBtn = e.target.closest('.btn-sadhana-info-trigger');
      if (eyeBtn) {
        const sadhanaKey = eyeBtn.getAttribute('data-sadhana-id');
        if (sadhanaKey) {
          this.view.openSadhanaDrawer(sadhanaKey);
          return;
        }
      }

      // Universal Stamp Toggle on any tile
      const stampToggleBtn = e.target.closest('.btn-tile-stamp-toggle');
      if (stampToggleBtn) {
        e.stopPropagation();
        const itemId = stampToggleBtn.getAttribute('data-item-id');
        const sadhanaId = stampToggleBtn.getAttribute('data-sadhana-id');
        const profile = this.model.getActiveProfile();

        if (itemId && profile.traineeSadhanas) {
          const item = profile.traineeSadhanas.find(ts => ts.id === itemId);
          if (item) {
            const currentPaid = item.isPaid !== false && item.paymentStatus !== 'FREE';
            item.isPaid = !currentPaid;
            item.paymentStatus = item.isPaid ? 'PAID' : 'FREE';
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast(`"${item.title}" stamp set to: ${item.paymentStatus === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
            return;
          }
        }

        if (sadhanaId) {
          const item = (profile.interestedSadhanas || []).find(is => is.id === sadhanaId);
          if (item) {
            const currentPaid = item.isPaid !== false && item.paymentStatus !== 'FREE';
            item.isPaid = !currentPaid;
            item.paymentStatus = item.isPaid ? 'PAID' : 'FREE';
          }
          // Also sync with trainee sadhanas
          const tItem = (profile.traineeSadhanas || []).find(ts => ts.sadhanaKey === sadhanaId || ts.id === sadhanaId);
          if (tItem) {
            const currentPaid = tItem.isPaid !== false && tItem.paymentStatus !== 'FREE';
            tItem.isPaid = !currentPaid;
            tItem.paymentStatus = tItem.isPaid ? 'PAID' : 'FREE';
          }
          this.model.saveProfiles(this.model.profiles);
          this.view._renderInterestedSadhanas(profile.interestedSadhanas || []);
          this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas || []);
          this.view._updateJSONPreview(profile);
          this.view.showToast(`Tile stamp set to: ${(item?.paymentStatus || tItem?.paymentStatus) === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
          return;
        }
      }

      // Trainee Tile Selection -> Displays in Right Panel
      const traineeTile = e.target.closest('.trainee-card-tile');
      if (traineeTile && !e.target.closest('.tile-actions-vertical')) {
        const itemId = traineeTile.getAttribute('data-item-id');
        if (itemId) {
          this.view.selectedTraineeId = itemId;
          const p = this.model.getActiveProfile();
          this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas || []);
          return;
        }
      }

      // Catalog Remedy card click (open ritual drawer)
      const remedyCard = e.target.closest('.remedy-card-option');
      if (remedyCard && !e.target.closest('.tile-actions-vertical')) {
        const sadhanaKey = remedyCard.getAttribute('data-sadhana-id');
        if (sadhanaKey) {
          this.view.openSadhanaDrawer(sadhanaKey);
        }
      }
    });

    // Close Sadhana Drawer
    const btnCloseDrawer = document.getElementById('btn-close-sadhana-drawer');
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => this.view.closeSadhanaDrawer());
    const drawerBackdrop = document.getElementById('sadhana-drawer-backdrop');
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => this.view.closeSadhanaDrawer());

    // 2. Checkbox change: Ticking auto-syncs into Trainee Sadhak In-Progress
    document.addEventListener('change', (e) => {
      if (e.target && e.target.name === 'remedy-checkbox') {
        const cb = e.target;
        const key = cb.value;
        const isChecked = cb.checked;

        // Synchronize all checkboxes with this value across the DOM
        document.querySelectorAll(`input[name="remedy-checkbox"][value="${key}"]`).forEach(c => {
          c.checked = isChecked;
        });

        const profile = this.model.getActiveProfile();
        if (!profile.selectedRemedies) profile.selectedRemedies = [];
        if (!profile.interestedSadhanas) profile.interestedSadhanas = [];
        if (!profile.traineeSadhanas) profile.traineeSadhanas = [];

        const catalogItem = SADHANA_CATALOG[key] || { id: key, title: key, category: 'Sadhana', domain: 'sadhanas' };

        if (isChecked) {
          if (!profile.selectedRemedies.includes(key)) {
            profile.selectedRemedies.push(key);
          }
          const existing = profile.interestedSadhanas.find(is => is.id === key || is.name === catalogItem.title);
          if (!existing) {
            profile.interestedSadhanas.push({
              id: key,
              name: catalogItem.title,
              category: catalogItem.category,
              priority: 'High',
              status: 'Enrolled',
              isPaid: profile.isPaid !== false && profile.paymentStatus !== 'FREE',
              paymentStatus: profile.isPaid !== false && profile.paymentStatus !== 'FREE' ? 'PAID' : 'FREE'
            });
          }

          // Auto-sync into Trainee Sadhak In-Progress
          const traineeExisting = profile.traineeSadhanas.find(ts => ts.sadhanaKey === key || (ts.id && ts.id === key) || ts.title.toLowerCase() === catalogItem.title.toLowerCase());
          if (!traineeExisting) {
            const newTraineeItem = {
              id: 'ts-' + Date.now().toString().slice(-4),
              sadhanaKey: key,
              title: catalogItem.title,
              categoryDomain: catalogItem.domain || 'sadhanas',
              isPaid: profile.isPaid !== false && profile.paymentStatus !== 'FREE',
              paymentStatus: profile.isPaid !== false && profile.paymentStatus !== 'FREE' ? 'PAID' : 'FREE',
              level: 'Level 1 — Novice Initiation',
              dailyTarget: catalogItem.domain === 'remedies' ? 'Daily Sunset Protocol' : (catalogItem.domain === 'cleansing' ? 'Morning / Dusk Routine' : '11 Malas Daily'),
              currentStreak: '1 Day',
              progressPercent: 20,
              status: 'In Progress',
              mentorCode: profile.referredByCode || 'SKHM-ADM1-7788-9900',
              diaryNotes: `Attunement active. Timing: ${catalogItem.timing || 'Brahma Muhurta'}. Mantra: ${catalogItem.mantra || 'Om Namah Shivaya'}`,
              memos: [
                {
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  author: 'Mentor Devendra',
                  text: `Enrolled into ${catalogItem.title}. Timing: ${catalogItem.timing || 'Daily'}. Mantra frequency synchronized.`
                }
              ]
            };
            profile.traineeSadhanas.push(newTraineeItem);
            this.view.selectedTraineeId = newTraineeItem.id;
          } else {
            this.view.selectedTraineeId = traineeExisting.id;
          }

          this.view.showToast(`✓ "${catalogItem.title}" enrolled & added to Trainee In-Progress!`);
        } else {
          profile.selectedRemedies = profile.selectedRemedies.filter(k => k !== key);
          profile.interestedSadhanas = profile.interestedSadhanas.filter(is => is.id !== key && is.name !== catalogItem.title);
          this.view.showToast(`Removed "${catalogItem.title}" from Enrolled Queue.`);
        }

        this.model.saveProfiles(this.model.profiles);
        this.view._renderInterestedSadhanas(profile.interestedSadhanas);
        this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
        this.view._updateJSONPreview(profile);
      }

      // Trainee item checkbox change in Trainee left panel
      if (e.target && e.target.classList.contains('trainee-item-checkbox')) {
        const itemId = e.target.getAttribute('data-item-id');
        const profile = this.model.getActiveProfile();
        if (!e.target.checked && itemId) {
          if (confirm('Remove this sadhana from active In-Progress list?')) {
            const item = profile.traineeSadhanas.find(ts => ts.id === itemId);
            if (item) {
              const key = item.sadhanaKey || item.id;
              profile.selectedRemedies = (profile.selectedRemedies || []).filter(k => k !== key);
              profile.interestedSadhanas = (profile.interestedSadhanas || []).filter(is => is.id !== key && is.name !== item.title);
            }
            profile.traineeSadhanas = profile.traineeSadhanas.filter(ts => ts.id !== itemId);
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
            this.view._renderInterestedSadhanas(profile.interestedSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast('Removed from Trainee In-Progress.');
          } else {
            e.target.checked = true;
          }
        }
      }
    });

    // 3. Send to Trainee from Slide-out Drawer Footer Button
    if (this.view.btnDrawerSendTrainee) {
      this.view.btnDrawerSendTrainee.addEventListener('click', () => {
        const key = this.view.btnDrawerSendTrainee.getAttribute('data-sadhana-key');
        if (key) {
          const sent = this.model.sendSadhanaToTrainee(key);
          this.view.closeSadhanaDrawer();
          this.switchMainTab('tab-trainee-sadhak');
          this._renderCurrentState();
          this.view.showToast(`🚀 "${sent.title}" sent to Trainee Sadhak In-Progress!`);
        }
      });
    }

    // 4. Enroll in Queue from Drawer Footer Button
    if (this.view.btnDrawerEnroll) {
      this.view.btnDrawerEnroll.addEventListener('click', () => {
        const key = this.view.btnDrawerEnroll.getAttribute('data-sadhana-key');
        if (key) {
          const sent = this.model.sendSadhanaToTrainee(key);
          this.view.closeSadhanaDrawer();
          this._renderCurrentState();
          this.view.showToast(`✓ "${sent.title}" enrolled in Queue & Trainee In-Progress.`);
        }
      });
    }

    // 5. Goli Gyan Guide Modal Open & Close
    const btnOpenGoli = document.getElementById('btn-open-goli-gyan');
    if (btnOpenGoli) btnOpenGoli.addEventListener('click', () => this.view.toggleGoliGyanModal(true));
    const btnCloseGoli = document.getElementById('btn-close-goli-gyan-modal');
    if (btnCloseGoli) btnCloseGoli.addEventListener('click', () => this.view.toggleGoliGyanModal(false));

    // 6. Speech Recognition Engine for Universal Mic Input
    let speechRecognition = null;
    let activeRecordingBtn = null;

    const getSpeechRecognizer = () => {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        return null;
      }
      if (!speechRecognition) {
        speechRecognition = new SpeechRec();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
      }
      speechRecognition.lang = this.model.settings?.speechLang || 'en-US';
      return speechRecognition;
    };

    // 7. Global Click Handler for Universal Memo Box (Keyboard, Mic, Send, Quick Chips) & Upline Verification
    document.addEventListener('click', (e) => {
      // 7A: Keyboard Helper Trigger (Toggles quick chips & focuses textarea)
      const btnKeyboard = e.target.closest('.btn-memo-keyboard');
      if (btnKeyboard) {
        const targetId = btnKeyboard.getAttribute('data-target');
        if (targetId) {
          const textarea = document.getElementById(targetId);
          if (textarea) textarea.focus();
          const chipsWrap = document.getElementById(`quick-chips-${targetId}`);
          if (chipsWrap) {
            chipsWrap.style.display = chipsWrap.style.display === 'none' ? 'flex' : 'none';
          }
        }
        return;
      }

      // 7B: Quick Suggestion Chip Click
      const quickChip = e.target.closest('.memo-quick-chip');
      if (quickChip) {
        const targetId = quickChip.getAttribute('data-target');
        const chipText = quickChip.textContent.trim();
        if (targetId && chipText) {
          const textarea = document.getElementById(targetId);
          if (textarea) {
            const currentVal = textarea.value.trim();
            textarea.value = currentVal ? `${currentVal} • ${chipText}` : chipText;
            textarea.focus();
          }
        }
        return;
      }

      // 7C: Mic Speech-to-Text Button Click
      const btnMic = e.target.closest('.btn-memo-mic');
      if (btnMic) {
        const targetId = btnMic.getAttribute('data-target');
        const textarea = document.getElementById(targetId);
        const recognizer = getSpeechRecognizer();

        if (!recognizer) {
          const promptInput = prompt('Browser Speech API not supported directly on this browser. You can type or paste your voice transcript here:');
          if (promptInput && textarea) {
            const cur = textarea.value.trim();
            textarea.value = cur ? `${cur} ${promptInput}` : promptInput;
            textarea.focus();
          }
          return;
        }

        if (btnMic.classList.contains('is-recording')) {
          // Stop recording
          try { recognizer.stop(); } catch (err) { /* ignore */ }
          btnMic.classList.remove('is-recording');
          btnMic.title = 'Voice-to-Text Input (Microphone)';
          activeRecordingBtn = null;
          this.view.showToast('🎙️ Voice recording stopped.');
        } else {
          // Start recording
          if (activeRecordingBtn) {
            activeRecordingBtn.classList.remove('is-recording');
          }
          activeRecordingBtn = btnMic;
          btnMic.classList.add('is-recording');
          btnMic.title = 'Listening... Speak into microphone (Click to stop)';
          this.view.showToast('🎙️ Listening... Speak your memo or progress note now.');

          recognizer.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript && textarea) {
              const cur = textarea.value.trim();
              textarea.value = cur ? `${cur} ${transcript}` : transcript;
              textarea.focus();
              this.view.showToast(`🎤 Speech captured: "${transcript}"`);
            }
          };

          recognizer.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
            btnMic.classList.remove('is-recording');
            btnMic.title = 'Voice-to-Text Input (Microphone)';
            activeRecordingBtn = null;
            this.view.showToast(`⚠️ Voice input error: ${event.error}`);
          };

          recognizer.onend = () => {
            btnMic.classList.remove('is-recording');
            btnMic.title = 'Voice-to-Text Input (Microphone)';
            activeRecordingBtn = null;
          };

          try {
            recognizer.start();
          } catch (err) {
            console.warn('Speech recognition start failed', err);
            btnMic.classList.remove('is-recording');
            activeRecordingBtn = null;
          }
        }
        return;
      }

      // 7D: Memo Send / Submit Button Click
      const btnSend = e.target.closest('#btn-add-trainee-memo');
      if (btnSend) {
        const itemId = btnSend.getAttribute('data-item-id');
        const memoInput = document.getElementById('trainee-new-memo-text');
        if (memoInput && itemId) {
          const text = memoInput.value.trim();
          if (!text) {
            alert('Please enter a note or memo message before submitting.');
            return;
          }
          const activeProf = this.model.getActiveProfile();
          const author = this.model.getRoleMode() === 'MASTER' 
            ? 'Master Karim' 
            : (this.model.getRoleMode() === 'HEALER' ? (activeProf.name || 'Healer Mentor') : (activeProf.name || 'Devotee Sadhak'));
          
          const updatedItem = this.model.addTraineeMemo(itemId, text, author);
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast('✓ Progress note added with date-time stamp!');
          }
        }
        return;
      }

      // 7E: Upline Verification Request Click
      const btnVerifyRequest = e.target.closest('.btn-verify-request');
      if (btnVerifyRequest) {
        const itemId = btnVerifyRequest.getAttribute('data-item-id');
        if (itemId) {
          const updatedItem = this.model.requestTraineeVerification(itemId);
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._renderCategorizedTraineeSadhanas(this.model.getActiveProfile().traineeSadhanas);
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast(`🛡️ Progress verification request sent to Upline Sponsor (${updatedItem.mentorCode})!`);
          }
        }
        return;
      }

      // 7F: Upline Verification Approve Click
      const btnVerifyApprove = e.target.closest('.btn-verify-approve');
      if (btnVerifyApprove) {
        const itemId = btnVerifyApprove.getAttribute('data-item-id');
        if (itemId) {
          const activeProf = this.model.getActiveProfile();
          const mentorName = this.model.getRoleMode() === 'MASTER' ? 'Karim Ji (Founder)' : (activeProf.name || 'Healer Mentor');
          const mentorCode = this.model.getRoleMode() === 'MASTER' ? 'SKHM-ADM1-7788-9900' : (activeProf.referenceCode || 'SKHM-HLR2-3344-5566');

          const updatedItem = this.model.approveTraineeVerification(itemId, mentorName, mentorCode);
          if (updatedItem) {
            this.view._renderTraineeActiveDetail(updatedItem);
            this.view._renderCategorizedTraineeSadhanas(this.model.getActiveProfile().traineeSadhanas);
            this.view._updateJSONPreview(this.model.getActiveProfile());
            this.view.showToast(`✅ Progress approved & verified by ${mentorName}!`);
          }
        }
        return;
      }

      // 7G: Upline Verification Reject / Revision Click
      const btnVerifyReject = e.target.closest('.btn-verify-reject');
      if (btnVerifyReject) {
        const itemId = btnVerifyReject.getAttribute('data-item-id');
        if (itemId) {
          const reason = prompt('Enter mentor guidance or revision notes for this trainee:', 'Complete 11 additional malas daily and re-submit for seal.');
          if (reason !== null) {
            const activeProf = this.model.getActiveProfile();
            const mentorName = this.model.getRoleMode() === 'MASTER' ? 'Karim Ji (Founder)' : (activeProf.name || 'Healer Mentor');
            const updatedItem = this.model.rejectTraineeVerification(itemId, reason, mentorName);
            if (updatedItem) {
              this.view._renderTraineeActiveDetail(updatedItem);
              this.view._renderCategorizedTraineeSadhanas(this.model.getActiveProfile().traineeSadhanas);
              this.view._updateJSONPreview(this.model.getActiveProfile());
              this.view.showToast('Revision request logged in timeline.');
            }
          }
        }
        return;
      }
    });

    // 8. Keyboard shortcut (Ctrl+Enter / Cmd+Enter) for quick submit on Universal Memo textarea
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (e.target && e.target.classList.contains('universal-memo-textarea')) {
          const btn = document.getElementById('btn-add-trainee-memo');
          if (btn) btn.click();
        }
      }
    });

    // Live update of Trainee Parameters (level, progress, target, streak) from Right Panel
    document.addEventListener('change', (e) => {
      const target = e.target;
      if (!target) return;
      const itemId = target.getAttribute('data-item-id');
      if (!itemId) return;

      const profile = this.model.getActiveProfile();
      const item = (profile.traineeSadhanas || []).find(ts => ts.id === itemId);
      if (!item) return;

      if (target.classList.contains('active-ts-level-select')) {
        item.level = target.value;
      } else if (target.classList.contains('active-ts-progress-input')) {
        item.progressPercent = Math.min(100, Math.max(0, parseInt(target.value, 10) || 0));
      } else if (target.classList.contains('active-ts-target-input')) {
        item.dailyTarget = target.value.trim();
      } else if (target.classList.contains('active-ts-streak-input')) {
        item.currentStreak = target.value.trim();
      } else {
        return;
      }

      this.model.saveProfiles(this.model.profiles);
      this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
      this.view._updateJSONPreview(profile);
    });
  }

  _bindEvents() {
    // 0. Theme Switcher Event Listener
    if (this.view.btnThemeToggle) {
      this.view.btnThemeToggle.addEventListener('click', () => {
        this._cycleTheme();
      });
    }

    // ==============================================================
    // ANDROID COMPOSE ALIGNED: HEALERS HUB & RECURSIVE TREE EVENT BINDINGS
    // ==============================================================

    // 1. Search Bar in Healers Hub
    const inputHealersSearch = document.getElementById('input-healers-search');
    if (inputHealersSearch) {
      inputHealersSearch.addEventListener('input', (e) => {
        this.view.healersSearchQuery = e.target.value;
        const scoped = this.model.getScopedProfiles();
        this.view.renderAndroidHealersHub(scoped, this.model.getActiveProfile(), this.model.getRoleMode());
      });
    }

    // 2. Category Filter Chips in Healers Hub
    const filterChipsContainer = document.getElementById('healers-filter-chips-container');
    if (filterChipsContainer) {
      filterChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.healer-filter-chip');
        if (chip) {
          filterChipsContainer.querySelectorAll('.healer-filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.view.healersSelectedCategory = chip.getAttribute('data-type') || 'ALL';
          const scoped = this.model.getScopedProfiles();
          this.view.renderAndroidHealersHub(scoped, this.model.getActiveProfile(), this.model.getRoleMode());
        }
      });
    }

    // 3. Top Banner "5-Level Tree" Button Shortcut
    const btnOpenHealersTree = document.getElementById('btn-open-healers-tree');
    if (btnOpenHealersTree) {
      btnOpenHealersTree.addEventListener('click', () => {
        this.switchMainTab('tab-genealogy-tree');
        this.view.renderAndroidHierarchyTree(this.model.profiles, this.view.hierarchySelectedLevel || 'ALL');
        this.view.showToast('🌳 Switched to Organization Hierarchy Tree');
      });
    }

    // 4. Hierarchy Level Generation Filter Chips (Tab 5)
    const hierarchyLevelFilterChips = document.getElementById('hierarchy-level-filter-chips');
    if (hierarchyLevelFilterChips) {
      hierarchyLevelFilterChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.hierarchy-level-filter-chip');
        if (chip) {
          hierarchyLevelFilterChips.querySelectorAll('.hierarchy-level-filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const lvl = chip.getAttribute('data-level') || 'ALL';
          this.view.hierarchySelectedLevel = lvl;
          this.view.renderAndroidHierarchyTree(this.model.profiles, lvl);
          this.view.showToast(`🎯 Level Generation Filter: ${lvl === 'ALL' ? 'All Levels' : 'Level ' + lvl}`);
        }
      });
    }

    // 5. Segmented Tree View Toggles (Recursive List vs Canvas)
    const btnViewRecursive = document.getElementById('btn-view-recursive');
    const btnViewCanvas = document.getElementById('btn-view-canvas');
    const recursiveViewEl = document.getElementById('hierarchy-recursive-tree-view');
    const canvasViewEl = document.getElementById('hierarchy-canvas-tree-view');

    if (btnViewRecursive && btnViewCanvas) {
      btnViewRecursive.addEventListener('click', () => {
        btnViewRecursive.classList.add('active');
        btnViewCanvas.classList.remove('active');
        if (recursiveViewEl) recursiveViewEl.style.display = 'flex';
        if (canvasViewEl) canvasViewEl.style.display = 'none';
        this.view.renderAndroidHierarchyTree(this.model.profiles, this.view.hierarchySelectedLevel || 'ALL');
      });

      btnViewCanvas.addEventListener('click', () => {
        btnViewCanvas.classList.add('active');
        btnViewRecursive.classList.remove('active');
        if (recursiveViewEl) recursiveViewEl.style.display = 'none';
        if (canvasViewEl) canvasViewEl.style.display = 'block';
        setTimeout(() => this.view.smartFitInBodyTree(), 80);
      });
    }

    // 6. Global Delegate for Healer Cards & Recursive Tree Interactive Elements
    document.addEventListener('click', (e) => {
      // Copy 16-Digit Code Pill
      const copyCodeBtn = e.target.closest('.btn-copy-card-code');
      if (copyCodeBtn) {
        const code = copyCodeBtn.getAttribute('data-code');
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            this.view.showToast(`📋 Copied: ${code}`);
          });
        }
        return;
      }

      // Member 3-Dots Quick Action Menu
      const quickOptsBtn = e.target.closest('.btn-member-quick-opts');
      if (quickOptsBtn) {
        const pid = quickOptsBtn.getAttribute('data-profile-id');
        const prof = this.model.profiles.find(p => p.id === pid);
        if (prof) {
          this.view.openNodeActionDialog(prof);
        }
        return;
      }

      // Toggle Tree Recursive Branch Expand / Collapse
      const toggleBranchBtn = e.target.closest('.btn-toggle-tree-branch');
      if (toggleBranchBtn) {
        const nodeId = toggleBranchBtn.getAttribute('data-node-id');
        const branch = document.getElementById(`tree-branch-${nodeId}`);
        if (branch) {
          const isHidden = branch.style.display === 'none';
          branch.style.display = isHidden ? 'flex' : 'none';
          toggleBranchBtn.textContent = isHidden ? '−' : '+';
        }
        return;
      }

      // Share Tree Node
      const shareNodeBtn = e.target.closest('.btn-share-tree-node');
      if (shareNodeBtn) {
        const pid = shareNodeBtn.getAttribute('data-profile-id');
        const prof = this.model.profiles.find(p => p.id === pid);
        if (prof) {
          const shareText = `Spiritual Karim Member Profile:\nName: ${prof.name}\n16-Digit Code: ${prof.referenceCode}\nRole: ${prof.profileType}\nLevel: ${prof.level}\nSponsor: ${prof.referredByCode}`;
          navigator.clipboard.writeText(shareText).then(() => {
            this.view.showToast(`📲 Member reference copied for sharing!`);
          });
        }
        return;
      }

      // Inspect Tree Node in Drawer
      const inspectNodeBtn = e.target.closest('.btn-inspect-tree-node');
      if (inspectNodeBtn) {
        const pid = inspectNodeBtn.getAttribute('data-profile-id');
        const prof = this.model.profiles.find(p => p.id === pid);
        if (prof) {
          this.view.renderTreeProfileDrawer(prof);
          this.view.toggleTreeProfileDrawer(true);
        }
        return;
      }

      // Jump to Profile on Node Click
      const jumpTrigger = e.target.closest('.btn-jump-profile-trigger');
      if (jumpTrigger) {
        const pid = jumpTrigger.getAttribute('data-profile-id');
        if (pid && this.model.profiles.some(p => p.id === pid)) {
          this.model.setActiveProfileId(pid);
          this._renderCurrentState();
          this.switchMainTab('tab-devotee-personal');
          this.view.showToast(`🚀 Switched active profile to "${this.model.getActiveProfile().name}"`);
        }
        return;
      }
    });

    // 7. Live Firebase Polling Sync Loop (Every 5 seconds)
    setInterval(() => {
      this.model.fetchFromFirebaseRealtime();
    }, 5000);

    // Mobile Sidebar Off-Canvas Drawer Toggle
    if (this.view.btnMobileSidebarToggle && this.view.adminSidebar) {
      this.view.btnMobileSidebarToggle.addEventListener('click', () => {
        const isOpen = this.view.adminSidebar.classList.toggle('mobile-open');
        if (this.view.sidebarBackdrop) {
          this.view.sidebarBackdrop.classList.toggle('open', isOpen);
        }
      });
    }

    if (this.view.sidebarBackdrop && this.view.adminSidebar) {
      this.view.sidebarBackdrop.addEventListener('click', () => {
        this.view.adminSidebar.classList.remove('mobile-open');
        this.view.sidebarBackdrop.classList.remove('open');
      });
    }

    // Quick Goli Gyan Header Button Trigger
    if (this.view.btnQuickGoliGyan) {
      this.view.btnQuickGoliGyan.addEventListener('click', () => {
        this.view.toggleGoliGyanModal(true);
      });
    }

    // Quick Share & Pairing Modal Trigger
    const btnQuickSharePairing = document.getElementById('btn-quick-share-pairing');
    if (btnQuickSharePairing) {
      btnQuickSharePairing.addEventListener('click', () => {
        const profile = this.model.getActiveProfile();
        this.view.renderSharePairingModal(profile, this.model.getPairingInvites());
        this.view.toggleSharePairingModal(true);
      });
    }

    const btnCloseSharePairing = document.getElementById('btn-close-share-pairing-modal');
    if (btnCloseSharePairing) {
      btnCloseSharePairing.addEventListener('click', () => {
        this.view.toggleSharePairingModal(false);
      });
    }

    // Delegate click handler for Pairing actions in table
    document.addEventListener('click', (e) => {
      // Approve Pairing
      const btnApprove = e.target.closest('.btn-approve-pairing');
      if (btnApprove) {
        const id = btnApprove.getAttribute('data-invite-id');
        if (id) {
          const approved = this.model.approvePairingInvite(id);
          if (approved) {
            this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
            this._renderCurrentState();
            this.view.showToast(`✅ Seeker "${approved.seekerName}" officially verified & linked to lineage!`);
          }
        }
        return;
      }

      // Reject Pairing
      const btnReject = e.target.closest('.btn-reject-pairing');
      if (btnReject) {
        const id = btnReject.getAttribute('data-invite-id');
        if (id && confirm('Reject this pairing request?')) {
          this.model.rejectPairingInvite(id);
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
          this.view.showToast('Pairing request rejected.');
        }
        return;
      }

      // Resend Pairing (Refresh 24h with Exponential Backoff Check)
      const btnResend = e.target.closest('.btn-resend-pairing');
      if (btnResend) {
        const id = btnResend.getAttribute('data-invite-id');
        if (id) {
          const refreshed = this.model.resendPairingInvite(id);
          if (refreshed && refreshed.error) {
            this.view.showToast(`⚠️ ${refreshed.message}`);
          } else if (refreshed) {
            this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
            this.view.showToast(`🔄 24-Hour window refreshed for "${refreshed.seekerName}".`);
          }
        }
        return;
      }

      // Simulate New Seeker Request
      const btnSimulate = e.target.closest('#btn-simulate-new-seeker');
      if (btnSimulate) {
        const names = ['Kavita Rao', 'Rahul Sen', 'Deepak Verma', 'Meera Nair', 'Suresh Patel'];
        const models = ['Samsung Galaxy S24 Ultra', 'Google Pixel 8 Pro', 'Xiaomi 13 Pro', 'Vivo X90', 'OnePlus 12'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomModel = models[Math.floor(Math.random() * models.length)];
        const randomPhone = '+91 9' + Math.floor(100000000 + Math.random() * 900000000);

        const newInv = this.model.createPairingInvite({
          seekerName: randomName,
          seekerPhone: randomPhone,
          deviceModel: randomModel
        });
        if (newInv && newInv.error) {
          this.view.showToast(`⚠️ ${newInv.message}`);
        } else if (newInv) {
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
          this.view.showToast(`📲 New Seeker "${newInv.seekerName}" (${newInv.seekerDeviceModel}) requested pairing! 24h timer active.`);
        }
        return;
      }
    });

    // 1-Second Live Countdown Ticker Interval
    setInterval(() => {
      const countdownElements = document.querySelectorAll('.countdown-live[data-expires]');
      if (!countdownElements || countdownElements.length === 0) return;
      const now = Date.now();
      countdownElements.forEach(el => {
        const expiresAt = parseInt(el.getAttribute('data-expires'), 10);
        if (!expiresAt) return;
        const remainingMs = expiresAt - now;
        if (remainingMs <= 0) {
          el.className = 'countdown-timer-badge countdown-expired';
          el.textContent = '⏱️ Expired (24h Ended)';
          this.view.renderPendingApprovalsRows(this.model.getPairingInvites());
        } else {
          const hours = Math.floor(remainingMs / (1000 * 60 * 60));
          const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
          const pad = n => String(n).padStart(2, '0');
          el.textContent = `⏳ ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
        }
      });
    }, 1000);

    // 3D Card Flipper Global Click Handler
    document.addEventListener('click', (e) => {
      const flipper = e.target.closest('.spiritual-card-flipper');
      const btnFlip = e.target.closest('.btn-flip-trigger');
      if (btnFlip && flipper) {
        e.stopPropagation();
        flipper.classList.toggle('is-flipped');
        return;
      }
      if (flipper && !e.target.closest('button') && !e.target.closest('input') && !e.target.closest('textarea') && !e.target.closest('a')) {
        flipper.classList.toggle('is-flipped');
      }
    });

    // Accordion Listbox Expand / Collapse Toggle Handler
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (header) {
        const item = header.closest('.accordion-item');
        if (item) {
          item.classList.toggle('is-open');
        }
      }
    });

    // Left/Right Segmented Toggle Click Handler
    document.addEventListener('click', (e) => {
      const segItem = e.target.closest('.segmented-item');
      if (segItem) {
        const parent = segItem.closest('.segmented-control');
        if (parent) {
          parent.querySelectorAll('.segmented-item').forEach(btn => btn.classList.remove('active'));
          segItem.classList.add('active');
          const filterValue = segItem.getAttribute('data-filter');
          const targetSection = parent.getAttribute('data-target-section');
          if (targetSection === 'remedies') {
            this._filterRemedies();
          }
          this.view.showToast(`Filter applied: ${filterValue}`);
        }
      }
    });

    // Real-Time Regex Validations with Visual Indicators & Live Remedy Search
    document.addEventListener('input', (e) => {
      const target = e.target;
      if (!target) return;

      // Live search filter on remedies catalog
      if (target.id === 'input-search-remedies') {
        this._filterRemedies();
      }

      // Phone validation
      if (target.id === 'input-phone' || target.classList.contains('input-validate-phone')) {
        const val = target.value.trim().replace(/[\s\-]/g, '');
        if (/^(\+91)?[6789]\d{9}$/.test(val) || val.length >= 10) {
          target.classList.remove('is-invalid');
          target.classList.add('is-valid');
        } else if (val.length > 3) {
          target.classList.remove('is-valid');
          target.classList.add('is-invalid');
        } else {
          target.classList.remove('is-valid', 'is-invalid');
        }
      }

      // 16-Digit Sponsor Code validation
      if (target.id === 'input-ref-code' || target.id === 'input-sponsor-code' || target.classList.contains('input-validate-code')) {
        const val = target.value.trim();
        if (/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(val) || val.length === 19) {
          target.classList.remove('is-invalid');
          target.classList.add('is-valid');
        } else if (val.length > 5) {
          target.classList.remove('is-valid');
          target.classList.add('is-invalid');
        } else {
          target.classList.remove('is-valid', 'is-invalid');
        }
      }
    });

    // Header Stamp Badge Toggle Trigger
    if (this.view.headerStampBadge) {
      this.view.headerStampBadge.style.cursor = 'pointer';
      this.view.headerStampBadge.addEventListener('click', () => {
        const profile = this.model.getActiveProfile();
        const currentIsPaid = profile.isPaid !== false && profile.paymentStatus !== 'FREE';
        profile.isPaid = !currentIsPaid;
        profile.paymentStatus = profile.isPaid ? 'PAID' : 'FREE';
        this.model.saveProfiles(this.model.profiles);
        this.view._renderHeaderCard(profile, this.model.getRoleMode());
        if (this.view.inputPaymentStatus) {
          this.view.inputPaymentStatus.value = profile.paymentStatus;
        }
        this.view._updateJSONPreview(profile);
        this.view.showToast(`Membership stamp set to: ${profile.paymentStatus === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
      });
    }

    // Active Profile Role Dropdown Switcher (MASTER | HEALER | DEVOTEE)
    if (this.view.selectRoleMode) {
      this.view.selectRoleMode.addEventListener('change', (e) => {
        const newRole = e.target.value;
        this.model.setRoleMode(newRole);
        this._renderCurrentState();
        this.view.showToast(`Role mode switched to: ${newRole}`);
      });
    }

    // Admin & RBAC Settings Modal Actions
    if (this.view.btnAdminSettings) {
      this.view.btnAdminSettings.addEventListener('click', () => {
        this.view.populateSettings(this.model.settings);
        this.view.toggleSettingsModal(true);
      });
    }

    const btnCloseSettings = document.getElementById('btn-close-settings-modal');
    if (btnCloseSettings) btnCloseSettings.addEventListener('click', () => this.view.toggleSettingsModal(false));
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    if (btnCancelSettings) btnCancelSettings.addEventListener('click', () => this.view.toggleSettingsModal(false));

    const btnSaveSettings = document.getElementById('btn-save-settings');
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        const newSettings = this.view.readSettingsFromForm();
        this.model.saveSettings(newSettings);
        this.view.toggleSettingsModal(false);
        this._renderCurrentState();
        this.view.showToast('✓ Admin System & RBAC Permission Settings saved & synchronized!');
      });
    }

    const btnResetSettings = document.getElementById('btn-reset-settings');
    if (btnResetSettings) {
      btnResetSettings.addEventListener('click', () => {
        if (confirm('Reset system settings to factory defaults?')) {
          const defaults = this.model._getDefaultSettings();
          this.model.saveSettings(defaults);
          this.view.populateSettings(defaults);
          this.view.showToast('Settings reset to factory defaults.');
        }
      });
    }

    if (this.view.selectActiveProfile) {
      this.view.selectActiveProfile.addEventListener('change', (e) => {
        this.model.setActiveProfileId(e.target.value);
        this._renderCurrentState();
      });
    }

    if (this.view.profileDirectoryList) {
      this.view.profileDirectoryList.addEventListener('click', (e) => {
        const row = e.target.closest('.profile-item-row');
        if (row) {
          const id = row.getAttribute('data-id');
          this.model.setActiveProfileId(id);
          this._renderCurrentState();

          // Close mobile sidebar if open
          if (this.view.adminSidebar) {
            this.view.adminSidebar.classList.remove('mobile-open');
          }
          if (this.view.sidebarBackdrop) {
            this.view.sidebarBackdrop.classList.remove('open');
          }
        }
      });
    }

    // Toggle Payment Stamp in Top Box on Click
    if (this.view.displayPaymentStamp) {
      this.view.displayPaymentStamp.addEventListener('click', () => {
        const profile = this.model.getActiveProfile();
        const currentIsPaid = profile.isPaid !== false && profile.paymentStatus !== 'FREE';
        profile.isPaid = !currentIsPaid;
        profile.paymentStatus = profile.isPaid ? 'PAID' : 'FREE';
        this.model.saveProfiles(this.model.profiles);
        this.view._renderHeaderCard(profile, this.model.getRoleMode());
        if (this.view.inputPaymentStatus) {
          this.view.inputPaymentStatus.value = profile.paymentStatus;
        }
        this.view._updateJSONPreview(profile);
        this.view.showToast(`Membership stamp toggled to: ${profile.paymentStatus === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
      });
    }

    if (this.view.inputPaymentStatus) {
      this.view.inputPaymentStatus.addEventListener('change', (e) => {
        const profile = this.model.getActiveProfile();
        profile.paymentStatus = e.target.value;
        profile.isPaid = e.target.value === 'PAID';
        this.model.saveProfiles(this.model.profiles);
        this.view._renderHeaderCard(profile, this.model.getRoleMode());
        this.view._updateJSONPreview(profile);
      });
    }

    // Trainee Sadhak Stamp Click & Select Change across all 3 categories
    const bindTraineeStampEvents = (container) => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        const stampBtn = e.target.closest('.btn-toggle-trainee-stamp');
        if (stampBtn) {
          const itemId = stampBtn.getAttribute('data-item-id');
          const profile = this.model.getActiveProfile();
          const item = (profile.traineeSadhanas || []).find((ts, i) => (ts.id || i.toString()) === itemId);
          if (item) {
            const currentPaid = item.isPaid !== false && item.paymentStatus !== 'FREE';
            item.isPaid = !currentPaid;
            item.paymentStatus = item.isPaid ? 'PAID' : 'FREE';
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast(`"${item.title}" stamp set to ${item.paymentStatus === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
          }
        }
      });

      container.addEventListener('change', (e) => {
        if (e.target.classList.contains('ts-paid-select')) {
          const itemId = e.target.getAttribute('data-item-id');
          const val = e.target.value;
          const profile = this.model.getActiveProfile();
          const item = (profile.traineeSadhanas || []).find((ts, i) => (ts.id || i.toString()) === itemId);
          if (item) {
            item.paymentStatus = val;
            item.isPaid = val === 'PAID';
            this.model.saveProfiles(this.model.profiles);
            this.view._renderCategorizedTraineeSadhanas(profile.traineeSadhanas);
            this.view._updateJSONPreview(profile);
            this.view.showToast(`"${item.title}" updated to ${val === 'PAID' ? '🟢 PAID' : '🔴 FREE'}`);
          }
        }
      });
    };

    bindTraineeStampEvents(this.view.traineeGroupSadhanas);
    bindTraineeStampEvents(this.view.traineeGroupRemedies);
    bindTraineeStampEvents(this.view.traineeGroupCleansing);

    // Create / Delete Profile
    const btnCreateProfile = document.getElementById('btn-create-profile');
    if (btnCreateProfile) {
      btnCreateProfile.addEventListener('click', () => {
        const p = this.model.createNewProfile();
        this._renderCurrentState();
        this.view.showToast(`New profile created: ${p.referenceCode}`);
      });
    }

    const btnDeleteProfile = document.getElementById('btn-delete-profile');
    if (btnDeleteProfile) {
      btnDeleteProfile.addEventListener('click', () => {
        if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
          alert('Action Prohibited: Devotee role is restricted from deleting profiles. Contact Master Administrator.');
          return;
        }
        const current = this.model.getActiveProfile();
        if (confirm(`Delete profile "${current.name}"?`)) {
          if (this.model.deleteActiveProfile()) {
            this._renderCurrentState();
            this.view.showToast('Profile deleted.');
          }
        }
      });
    }

    // Reference Code Generators
    const btnGenRefCode = document.getElementById('btn-gen-ref-code');
    if (btnGenRefCode) {
      btnGenRefCode.addEventListener('click', () => {
        const prefix = this.model.getRoleMode() === 'HEALER' ? 'SKHL' : (this.model.getRoleMode() === 'DEVOTEE' ? 'SKDV' : 'SKHM');
        const code = this.model.generate16DigitCode(prefix);
        this.view.inputRefCode.value = code;
        this.view.showToast(`Generated: ${code}`);
      });
    }

    const btnCopyRefCode = document.getElementById('btn-copy-ref-code');
    if (btnCopyRefCode) {
      btnCopyRefCode.addEventListener('click', () => {
        const code = this.view.inputRefCode.value;
        navigator.clipboard.writeText(code).then(() => {
          this.view.showToast(`Copied ${code}!`);
        });
      });
    }

    // Reset Identity
    const btnResetIdentity = document.getElementById('btn-reset-identity');
    if (btnResetIdentity) {
      btnResetIdentity.addEventListener('click', () => {
        if (confirm('Reset personal identity fields?')) {
          this.view.inputName.value = '';
          this.view.inputSelfTitle.value = '';
          this.view.inputPhone.value = '';
          this.view.inputEmail.value = '';
          this.view.inputCity.value = '';
          this.view.inputAddress.value = '';
          this.view.showToast('Identity reset.');
        }
      });
    }

    // Lineage: Children Add / Delete
    const btnAddChild = document.getElementById('btn-add-child');
    if (btnAddChild) {
      btnAddChild.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.lineage) p.lineage = {};
        if (!p.lineage.currentFamily) p.lineage.currentFamily = {};
        if (!p.lineage.currentFamily.children) p.lineage.currentFamily.children = [];
        p.lineage.currentFamily.children.push({ id: 'c' + Date.now().toString().slice(-4), name: '', gender: 'Son', ageOrNote: '' });
        this.view._renderChildren(p.lineage.currentFamily.children);
      });
    }

    if (this.view.childrenContainer) {
      this.view.childrenContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-child')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete lineage entries.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.lineage.currentFamily.children.splice(idx, 1);
          this.view._renderChildren(p.lineage.currentFamily.children);
        }
      });
    }

    // Lineage: Siblings Add / Delete
    const setupSiblingBranch = (btnId, container, branchPath) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          const p = this.model.getActiveProfile();
          const branchObj = this._getBranchObject(p, branchPath);
          if (!branchObj.siblings) branchObj.siblings = [];
          branchObj.siblings.push({ id: 's' + Date.now().toString().slice(-4), name: '', relation: 'Brother', spouseName: '', childrenSummary: '', isMarried: false, notes: '' });
          this.view._renderSiblings(container, branchObj.siblings, branchPath);
        });
      }

      if (container) {
        container.addEventListener('click', (e) => {
          if (e.target.classList.contains('btn-remove-sibling')) {
            if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
              alert('Action Prohibited: Devotee cannot delete lineage entries.');
              return;
            }
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            const p = this.model.getActiveProfile();
            const branchObj = this._getBranchObject(p, branchPath);
            branchObj.siblings.splice(idx, 1);
            this.view._renderSiblings(container, branchObj.siblings, branchPath);
          }
        });
      }
    };

    setupSiblingBranch('btn-add-sibling-current', this.view.siblingsCurrentContainer, 'current');
    setupSiblingBranch('btn-add-sibling-husband', this.view.siblingsHusbandContainer, 'husband');
    setupSiblingBranch('btn-add-sibling-wife', this.view.siblingsWifeContainer, 'wife');

    // House Clean: Add / Delete
    const handleAddHouseClean = () => {
      const p = this.model.getActiveProfile();
      if (!p.houseCleanLevels) p.houseCleanLevels = [];
      const nextNum = p.houseCleanLevels.length + 1;
      p.houseCleanLevels.push({
        id: 'hc-' + Date.now().toString().slice(-4),
        levelNumber: nextNum,
        levelTitle: `Level ${nextNum} — Custom House Clean`,
        status: 'IN_PROGRESS',
        cleanPercentage: 0,
        cleanedDetails: '',
        mentorCode: null,
        mentorName: null,
        mentorRemarks: null,
        approvalDate: null
      });
      this.view._renderHouseCleanCards(p.houseCleanLevels);
      this.view.showToast(`Added Level ${nextNum} House Clean record.`);
    };

    const btnAddHc = document.getElementById('btn-add-houseclean-record');
    if (btnAddHc) btnAddHc.addEventListener('click', handleAddHouseClean);
    const btnAddSeekerHc = document.getElementById('btn-add-seeker-clean-log');
    if (btnAddSeekerHc) btnAddSeekerHc.addEventListener('click', handleAddHouseClean);

    const handleHouseCleanDelete = (container) => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-houseclean')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete house clean records.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.houseCleanLevels.splice(idx, 1);
          this.view._renderHouseCleanCards(p.houseCleanLevels);
          this.view.showToast('House clean record deleted.');
        }
      });
    };
    handleHouseCleanDelete(this.view.devoteeHouseCleanContainer);
    handleHouseCleanDelete(this.view.seekerHouseCleanSummaryContainer);

    // Seeker Purpose & Custom Sadhanas
    const btnAddGoal = document.getElementById('btn-add-purpose-goal');
    if (btnAddGoal) {
      btnAddGoal.addEventListener('click', () => {
        const goal = prompt('Enter New Spiritual Goal / Purpose:', 'Kundalini Awakening & Family Protection');
        if (goal) {
          this.view.inputObjective.value = (this.view.inputObjective.value ? this.view.inputObjective.value + '\n• ' : '• ') + goal;
          this.view.showToast('Added goal to Purpose.');
        }
      });
    }

    const btnResetPurpose = document.getElementById('btn-reset-purpose');
    if (btnResetPurpose) {
      btnResetPurpose.addEventListener('click', () => {
        if (confirm('Clear spiritual purpose fields?')) {
          this.view.inputObjective.value = '';
          this.view.seekerAfflictionDuration.value = '';
          this.view.seekerKuldeviIssues.value = '';
          this.view.seekerTargetOutcome.value = '';
          this.view.showToast('Purpose cleared.');
        }
      });
    }

    const btnAddCustomSadhana = document.getElementById('btn-add-custom-sadhana');
    if (btnAddCustomSadhana) {
      btnAddCustomSadhana.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.interestedSadhanas) p.interestedSadhanas = [];
        p.interestedSadhanas.push({ id: 'is-' + Date.now().toString().slice(-4), name: 'Custom Sadhana Title', category: 'Sadhana', priority: 'High', status: 'Interested' });
        this.view._renderInterestedSadhanas(p.interestedSadhanas);
      });
    }

    if (this.view.interestedSadhanasContainer) {
      this.view.interestedSadhanasContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-interested-sadhana')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete sadhanas from enrolled queue.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.interestedSadhanas.splice(idx, 1);
          this.view._renderInterestedSadhanas(p.interestedSadhanas);
        }
      });
    }

    // Trainee Sadhak: Add / Delete
    const btnAddTraineeSadhana = document.getElementById('btn-add-trainee-sadhana');
    if (btnAddTraineeSadhana) {
      btnAddTraineeSadhana.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.traineeSadhanas) p.traineeSadhanas = [];
        p.traineeSadhanas.push({
          id: 'ts-' + Date.now().toString().slice(-4),
          sadhanaKey: 'sri_yantra',
          title: 'New In-Progress Sadhana',
          categoryDomain: 'sadhanas',
          isPaid: p.isPaid || false,
          paymentStatus: p.isPaid ? 'PAID' : 'FREE',
          level: 'Level 1 — Novice Initiation',
          dailyTarget: '11 Malas Daily',
          currentStreak: '1 Day',
          progressPercent: 10,
          status: 'In Progress',
          mentorCode: p.referredByCode || 'SKHM-ADM1-7788-9900',
          diaryNotes: 'Initial mantra attunement started.'
        });
        this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas);
        this.view.showToast('Added In-Progress Sadhana.');
      });
    }

    const handleTraineeDelete = (container) => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-trainee-item')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete trainee sadhanas.');
            return;
          }
          const itemId = e.target.getAttribute('data-item-id');
          const p = this.model.getActiveProfile();
          p.traineeSadhanas = p.traineeSadhanas.filter((ts, i) => (ts.id || i.toString()) !== itemId);
          this.view._renderCategorizedTraineeSadhanas(p.traineeSadhanas);
          this.view.showToast('In-progress sadhana deleted.');
        }
      });
    };
    handleTraineeDelete(this.view.traineeGroupSadhanas);
    handleTraineeDelete(this.view.traineeGroupRemedies);
    handleTraineeDelete(this.view.traineeGroupCleansing);

    // Healer Connect: Add / Delete
    const btnAddCompletedSadhana = document.getElementById('btn-add-completed-sadhana');
    if (btnAddCompletedSadhana) {
      btnAddCompletedSadhana.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.healerCompletedSadhanas) p.healerCompletedSadhanas = [];
        p.healerCompletedSadhanas.push({
          id: 'hcs-' + Date.now().toString().slice(-4),
          title: 'New Completed Master Sadhana',
          levelCompleted: 'Level 3 — Healer Acharya',
          completionDate: new Date().toISOString().split('T')[0],
          status: 'Certified Master',
          seekersGuidedCount: 0,
          authorizedToGuide: true,
          sealCode: 'SKHM-SEAL-' + Math.random().toString(36).substr(2, 4).toUpperCase()
        });
        this.view._renderHealerCompleted(p.healerCompletedSadhanas);
        this.view.showToast('Added Completed Sadhana Credential.');
      });
    }

    if (this.view.healerCompletedSadhanasContainer) {
      this.view.healerCompletedSadhanasContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-healer-sadhana')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot delete master credentials.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.healerCompletedSadhanas.splice(idx, 1);
          this.view._renderHealerCompleted(p.healerCompletedSadhanas);
          this.view.showToast('Completed sadhana credential deleted.');
        }
      });
    }

    const btnAddNetDevotee = document.getElementById('btn-add-connected-devotee');
    if (btnAddNetDevotee) {
      btnAddNetDevotee.addEventListener('click', () => {
        const p = this.model.getActiveProfile();
        if (!p.healerNetwork) p.healerNetwork = [];
        p.healerNetwork.push({
          id: 'net-' + Date.now().toString().slice(-4),
          name: 'Connected Devotee Name',
          refCode: this.model.generate16DigitCode('SKHM'),
          role: 'Devotee (Level 5)',
          activeCases: 1
        });
        this.view._renderHealerNetwork(p.healerNetwork);
      });
    }

    if (this.view.healerNetworkContainer) {
      this.view.healerNetworkContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-network-devotee')) {
          if (this.model.getRoleMode() === 'DEVOTEE' && !this.model.settings.allowDevoteeDelete) {
            alert('Action Prohibited: Devotee cannot unlink network entries.');
            return;
          }
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const p = this.model.getActiveProfile();
          p.healerNetwork.splice(idx, 1);
          this.view._renderHealerNetwork(p.healerNetwork);
          this.view.showToast('Devotee unlinked.');
        }
      });
    }

    // Form Save
    if (this.view.form) {
      this.view.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._saveFormChanges();
      });
    }

    const btnSaveProfile = document.getElementById('btn-save-profile');
    if (btnSaveProfile) {
      btnSaveProfile.addEventListener('click', () => {
        this._saveFormChanges();
      });
    }

    // JSON Drawer
    const btnToggleJson = document.getElementById('btn-toggle-json-drawer');
    if (btnToggleJson) btnToggleJson.addEventListener('click', () => this.view.toggleJsonDrawer(true));
    const btnCloseJson = document.getElementById('btn-close-json-drawer');
    if (btnCloseJson) btnCloseJson.addEventListener('click', () => this.view.toggleJsonDrawer(false));
    const jsonBackdrop = document.getElementById('json-drawer-backdrop');
    if (jsonBackdrop) jsonBackdrop.addEventListener('click', () => this.view.toggleJsonDrawer(false));

    const btnCopyJson = document.getElementById('btn-copy-json-code');
    if (btnCopyJson) {
      btnCopyJson.addEventListener('click', () => {
        navigator.clipboard.writeText(this.view.jsonPreviewCode.textContent).then(() => {
          this.view.showToast('Profile JSON copied to clipboard!');
        });
      });
    }

    const btnDownloadJson = document.getElementById('btn-download-json-file');
    if (btnDownloadJson) {
      btnDownloadJson.addEventListener('click', () => {
        const active = this.model.getActiveProfile();
        const code = JSON.stringify(active, null, 2);
        const blob = new Blob([code], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `healer_profile_${active.referenceCode}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const btnImportJson = document.getElementById('btn-import-json');
    if (btnImportJson) btnImportJson.addEventListener('click', () => this.view.toggleImportModal(true));
    const btnCloseImport = document.getElementById('btn-close-import-modal');
    if (btnCloseImport) btnCloseImport.addEventListener('click', () => this.view.toggleImportModal(false));

    const btnExecImport = document.getElementById('btn-execute-import');
    if (btnExecImport) {
      btnExecImport.addEventListener('click', () => {
        const raw = document.getElementById('import-json-textarea').value.trim();
        try {
          const parsed = JSON.parse(raw);
          if (!parsed.name || !parsed.referenceCode) throw new Error('Missing name or referenceCode in payload.');
          parsed.id = parsed.id || 'prof-' + Date.now();
          this.model.profiles.push(parsed);
          this.model.saveProfiles(this.model.profiles);
          this.model.setActiveProfileId(parsed.id);
          this.view.toggleImportModal(false);
          this._renderCurrentState();
          this.view.showToast(`Imported profile: ${parsed.name}`);
        } catch (err) {
          alert('Invalid JSON payload: ' + err.message);
        }
      });
    }

    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        const all = JSON.stringify(this.model.profiles, null, 2);
        const blob = new Blob([all], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spiritual_karim_all_profiles.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.view.showToast('Exported all profiles JSON for Android app.');
      });
    }

    // App Hierarchy Tiers Legend Click -> Open Left Flyout Panel
    document.querySelectorAll('#hierarchy-legend-container .legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const tier = parseInt(item.getAttribute('data-tier'), 10);
        this.view.openTierPanel(tier, this.model.profiles, this.model.activeProfileId);
        this.view.showToast(`📂 Opened Tier ${tier} Profiles Panel`);
      });
    });

    if (this.view.btnCloseTierPanel) {
      this.view.btnCloseTierPanel.addEventListener('click', () => {
        this.view.closeTierPanel();
      });
    }

    if (this.view.tierPanelProfilesList) {
      this.view.tierPanelProfilesList.addEventListener('click', (e) => {
        const card = e.target.closest('.tier-panel-profile-card');
        if (card) {
          const id = card.getAttribute('data-id');
          this.model.setActiveProfileId(id);
          this._renderCurrentState();

          // Highlight card in tier panel
          this.view.tierPanelProfilesList.querySelectorAll('.tier-panel-profile-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          const activeP = this.model.getActiveProfile();
          this.view.showToast(`🚀 Viewing profile: ${activeP.name}`);
        }
      });
    }

    if (this.view.inputTierPanelSearch) {
      this.view.inputTierPanelSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = (this.view.currentTierProfiles || []).filter(p => 
          (p.name && p.name.toLowerCase().includes(q)) || 
          (p.referenceCode && p.referenceCode.toLowerCase().includes(q))
        );
        const metaColor = { 1: '#8b5cf6', 2: '#10b981', 3: '#f59e0b', 4: '#3b82f6' }[this.view.currentOpenTier] || '#d4af37';
        this.view._renderTierPanelCards(filtered, this.model.activeProfileId, metaColor);
      });
    }

    if (this.view.btnOpenTreeView) {
      this.view.btnOpenTreeView.addEventListener('click', () => {
        if (this.view.bodyTreeTierFilter) this.view.bodyTreeTierFilter.value = 'ALL';
        this.switchMainTab('tab-genealogy-tree');
        this.view.renderInBodyHierarchyTree(this.model.profiles, null, '', this.view.inBodyTreePanState?.layoutMode || 'cluster');
        setTimeout(() => {
          this.view.smartFitInBodyTree();
        }, 100);
      });
    }

    // In-Body Tree Search & Filter Events
    if (this.view.bodyTreeSearchInput) {
      this.view.bodyTreeSearchInput.addEventListener('input', (e) => {
        const q = e.target.value;
        const filterVal = this.view.bodyTreeTierFilter ? this.view.bodyTreeTierFilter.value : 'ALL';
        const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
        this.view.renderInBodyHierarchyTree(this.model.profiles, tier, q, this.view.inBodyTreePanState?.layoutMode || 'cluster');
      });
    }

    if (this.view.btnClearTreeSearch) {
      this.view.btnClearTreeSearch.addEventListener('click', () => {
        if (this.view.bodyTreeSearchInput) {
          this.view.bodyTreeSearchInput.value = '';
          const filterVal = this.view.bodyTreeTierFilter ? this.view.bodyTreeTierFilter.value : 'ALL';
          const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
          this.view.renderInBodyHierarchyTree(this.model.profiles, tier, '', this.view.inBodyTreePanState?.layoutMode || 'cluster');
        }
      });
    }

    if (this.view.bodyTreeTierFilter) {
      this.view.bodyTreeTierFilter.addEventListener('change', (e) => {
        const filterVal = e.target.value;
        const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
        const q = this.view.bodyTreeSearchInput ? this.view.bodyTreeSearchInput.value : '';
        this.view.renderInBodyHierarchyTree(this.model.profiles, tier, q, this.view.inBodyTreePanState?.layoutMode || 'cluster');
        setTimeout(() => this.view.smartFitInBodyTree(), 80);
      });
    }

    // Layout Mode Segmented Toggles
    if (this.view.btnLayoutCluster) {
      this.view.btnLayoutCluster.addEventListener('click', () => {
        this.view.inBodyTreePanState.layoutMode = 'cluster';
        this.view.btnLayoutCluster.classList.add('active');
        if (this.view.btnLayoutSpiderweb) this.view.btnLayoutSpiderweb.classList.remove('active');
        const filterVal = this.view.bodyTreeTierFilter ? this.view.bodyTreeTierFilter.value : 'ALL';
        const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
        const q = this.view.bodyTreeSearchInput ? this.view.bodyTreeSearchInput.value : '';
        this.view.renderInBodyHierarchyTree(this.model.profiles, tier, q, 'cluster');
        this.view.showToast('🌳 Layout switched: Clustered MLM Sub-trees');
      });
    }

    if (this.view.btnLayoutSpiderweb) {
      this.view.btnLayoutSpiderweb.addEventListener('click', () => {
        this.view.inBodyTreePanState.layoutMode = 'spiderweb';
        this.view.btnLayoutSpiderweb.classList.add('active');
        if (this.view.btnLayoutCluster) this.view.btnLayoutCluster.classList.remove('active');
        const filterVal = this.view.bodyTreeTierFilter ? this.view.bodyTreeTierFilter.value : 'ALL';
        const tier = filterVal === 'ALL' ? null : parseInt(filterVal, 10);
        const q = this.view.bodyTreeSearchInput ? this.view.bodyTreeSearchInput.value : '';
        this.view.renderInBodyHierarchyTree(this.model.profiles, tier, q, 'spiderweb');
        this.view.showToast('🕸️ Layout switched: Spiderweb Matrix Flow');
      });
    }

    // In-Body Tree Canvas Pan/Zoom Events Initialization
    this.view._initInBodyTreePanZoomEvents();

    // Node Click & Double Click on In-Body Canvas
    if (this.view.bodyTreeCanvasViewport) {
      this.view.bodyTreeCanvasViewport.addEventListener('click', (e) => {
        const node = e.target.closest('.spiderweb-node');
        if (node) {
          const profileId = node.getAttribute('data-profile-id');
          const profile = this.model.profiles.find(p => p.id === profileId) || {
            id: profileId,
            name: node.querySelector('.person-node-name')?.textContent || 'Member',
            referenceCode: 'SKHM-MEM1-8899-0011',
            level: node.getAttribute('data-tier') || 4,
            isPaid: true
          };
          this.view.renderTreeProfileDrawer(profile);
          this.view.toggleTreeProfileDrawer(true);
        }
      });

      // Double Click -> Jump straight to profile
      this.view.bodyTreeCanvasViewport.addEventListener('dblclick', (e) => {
        const node = e.target.closest('.spiderweb-node');
        if (node) {
          const profileId = node.getAttribute('data-profile-id');
          if (profileId && this.model.profiles.some(p => p.id === profileId)) {
            this.model.setActiveProfileId(profileId);
            this.view.toggleTreeProfileDrawer(false);
            this._renderCurrentState();
            this.switchMainTab('tab-devotee-personal');
            const active = this.model.getActiveProfile();
            this.view.showToast(`🚀 Switched to active workspace of "${active.name}"`);
          }
        }
      });

      // Context Menu (Right Click) -> Open Node Action Dialog
      this.view.bodyTreeCanvasViewport.addEventListener('contextmenu', (e) => {
        const node = e.target.closest('.spiderweb-node');
        if (node) {
          e.preventDefault();
          const profileId = node.getAttribute('data-profile-id');
          const profile = this.model.profiles.find(p => p.id === profileId) || {
            id: profileId,
            name: node.querySelector('.person-node-name')?.textContent || 'Member',
            referenceCode: 'SKHM-MEM1-8899-0011',
            level: node.getAttribute('data-tier') || 4
          };
          this.view.openNodeActionDialog(profile);
        }
      });
    }

    // Node Action Dialog Actions
    if (this.view.nodeActionDialog) {
      this.view.nodeActionDialog.addEventListener('click', (e) => {
        const btnEdit = e.target.closest('#btn-node-opt-edit');
        if (btnEdit) {
          const pid = btnEdit.getAttribute('data-profile-id');
          if (pid && this.model.profiles.some(p => p.id === pid)) {
            this.model.setActiveProfileId(pid);
            this._renderCurrentState();
            this.switchMainTab('tab-devotee-personal');
          }
          this.view.closeNodeActionDialog();
          return;
        }

        const btnShare = e.target.closest('#btn-node-opt-share');
        if (btnShare) {
          this.view.closeNodeActionDialog();
          const p = this.model.getActiveProfile();
          this.view.renderSharePairingModal(p, this.model.getPairingInvites(), this.model.settings);
          this.view.toggleSharePairingModal(true);
          return;
        }

        const btnCopy = e.target.closest('#btn-node-opt-copy');
        if (btnCopy) {
          const code = btnCopy.getAttribute('data-code');
          if (code) {
            navigator.clipboard.writeText(code).then(() => {
              this.view.showToast(`📋 Copied reference code: ${code}`);
            });
          }
          this.view.closeNodeActionDialog();
          return;
        }

        const btnInspect = e.target.closest('#btn-node-opt-inspect');
        if (btnInspect) {
          const pid = btnInspect.getAttribute('data-profile-id');
          const prof = this.model.profiles.find(p => p.id === pid);
          if (prof) {
            this.view.renderTreeProfileDrawer(prof);
            this.view.toggleTreeProfileDrawer(true);
          }
          this.view.closeNodeActionDialog();
          return;
        }
      });
    }

    if (this.view.btnCloseNodeDialog) {
      this.view.btnCloseNodeDialog.addEventListener('click', () => this.view.closeNodeActionDialog());
    }
    if (this.view.btnCloseNodeDialogFooter) {
      this.view.btnCloseNodeDialogFooter.addEventListener('click', () => this.view.closeNodeActionDialog());
    }

    if (this.view.btnCloseTreeModal) {
      this.view.btnCloseTreeModal.addEventListener('click', () => {
        this.view.toggleTreeModal(false);
      });
    }

    // Modal Tree fallback interactions
    if (this.view.treeCanvasViewport) {
      this.view.treeCanvasViewport.addEventListener('click', (e) => {
        const node = e.target.closest('.spiderweb-node') || e.target.closest('.mlm-tree-node');
        if (node) {
          const profileId = node.getAttribute('data-profile-id');
          const profile = this.model.profiles.find(p => p.id === profileId);
          if (profile) {
            this.view.renderTreeProfileDrawer(profile);
            this.view.toggleTreeProfileDrawer(true);
          }
        }
      });
    }

    if (this.view.btnCloseTreeDrawer) {
      this.view.btnCloseTreeDrawer.addEventListener('click', () => {
        this.view.toggleTreeProfileDrawer(false);
      });
    }

    if (this.view.treeDrawerBackdrop) {
      this.view.treeDrawerBackdrop.addEventListener('click', () => {
        this.view.toggleTreeProfileDrawer(false);
      });
    }

    if (this.view.btnTreeLoadProfile) {
      this.view.btnTreeLoadProfile.addEventListener('click', () => {
        const profileId = this.view.btnTreeLoadProfile.getAttribute('data-profile-id');
        if (profileId) {
          this.model.setActiveProfileId(profileId);
          this.view.toggleTreeProfileDrawer(false);
          this.view.toggleTreeModal(false);
          this._renderCurrentState();
          const active = this.model.getActiveProfile();
          this.view.showToast(`🚀 Switched active profile to "${active.name}"`);
        }
      });
    }

    // ==============================================================
    // Top Right: Admin Settings Modal Events
    // ==============================================================
    if (this.view.btnAdminSettings) {
      this.view.btnAdminSettings.addEventListener('click', () => {
        if (this.model.getRoleMode() !== 'MASTER') {
          this.view.showToast('🔒 Admin Settings is restricted to Master role.');
          return;
        }
        this.view.populateSettings(this.model.settings);
        this.view.toggleSettingsModal(true);
      });
    }

    if (this.view.btnCloseAdminSettings) {
      this.view.btnCloseAdminSettings.addEventListener('click', () => {
        this.view.toggleSettingsModal(false);
      });
    }

    if (this.view.btnSaveSettings) {
      this.view.btnSaveSettings.addEventListener('click', () => {
        const newSettings = this.view.readSettingsFromForm();
        this.model.saveSettings(newSettings);
        this.view.enforceRBAC(this.model.getRoleMode(), newSettings);
        this.view.toggleSettingsModal(false);
        this.view.showToast('✓ Admin Settings successfully saved & synchronized!');
      });
    }

    if (this.view.btnResetSettings) {
      this.view.btnResetSettings.addEventListener('click', () => {
        if (confirm('Factory reset all admin settings to system defaults?')) {
          const def = this.model.getDefaultSettings();
          this.model.saveSettings(def);
          this.view.populateSettings(def);
          this.view.enforceRBAC(this.model.getRoleMode(), def);
          this.view.showToast('Admin settings reset to defaults.');
        }
      });
    }

    // ==============================================================
    // Top Right: Share & Pair (24-Hour Protocol) Modal Events
    // ==============================================================
    if (this.view.btnQuickSharePairing) {
      this.view.btnQuickSharePairing.addEventListener('click', () => {
        const profile = this.model.getActiveProfile();
        const invites = this.model.getPairingInvites();
        this.view._renderSharePairingModal(profile, invites);
        this.view.toggleSharePairingModal(true);
      });
    }

    if (this.view.btnCloseSharePairingModal) {
      this.view.btnCloseSharePairingModal.addEventListener('click', () => {
        this.view.toggleSharePairingModal(false);
      });
    }

    if (this.view.sharePairingModalBody) {
      this.view.sharePairingModalBody.addEventListener('click', (e) => {
        const approveBtn = e.target.closest('.btn-approve-pairing');
        if (approveBtn) {
          const inviteId = approveBtn.getAttribute('data-invite-id');
          const approved = this.model.approvePairingInvite(inviteId);
          if (approved) {
            const profile = this.model.getActiveProfile();
            const invites = this.model.getPairingInvites();
            this.view._renderSharePairingModal(profile, invites);
            this._renderCurrentState();
            this.view.showToast(`✓ Approved & Linked "${approved.seekerName}" to your downline!`);
          }
          return;
        }

        const rejectBtn = e.target.closest('.btn-reject-pairing');
        if (rejectBtn) {
          const inviteId = rejectBtn.getAttribute('data-invite-id');
          const rejected = this.model.rejectPairingInvite(inviteId);
          if (rejected) {
            const profile = this.model.getActiveProfile();
            const invites = this.model.getPairingInvites();
            this.view._renderSharePairingModal(profile, invites);
            this.view.showToast(`Pairing request rejected for "${rejected.seekerName}".`);
          }
          return;
        }

        const resendBtn = e.target.closest('.btn-resend-pairing');
        if (resendBtn) {
          const inviteId = resendBtn.getAttribute('data-invite-id');
          const res = this.model.resendPairingInvite(inviteId);
          if (res && res.error) {
            alert(res.message);
            return;
          }
          if (res) {
            const profile = this.model.getActiveProfile();
            const invites = this.model.getPairingInvites();
            this.view._renderSharePairingModal(profile, invites);
            this.view.showToast(`🔄 24-Hour window renewed for "${res.seekerName}"!`);
          }
          return;
        }

        const simBtn = e.target.closest('#btn-simulate-new-seeker');
        if (simBtn) {
          const profile = this.model.getActiveProfile();
          const names = ['Ramesh Sharma', 'Pooja Verma', 'Amit Trivedi', 'Sunita Rao', 'Deepak Joshi'];
          const randomName = names[Math.floor(Math.random() * names.length)];
          const simInvite = {
            id: 'inv-' + Date.now().toString().slice(-6),
            seekerName: randomName,
            seekerPhone: '+91 ' + Math.floor(7000000000 + Math.random() * 2999999999),
            sponsorCode: profile.referenceCode || 'SKHM-ADM1-7788-9900',
            seekerDeviceModel: 'OnePlus / Galaxy Android 14',
            hardwareNonce: 'HW-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            status: 'PENDING',
            createdAtMs: Date.now(),
            expiresAtMs: Date.now() + 24 * 60 * 60 * 1000,
            formattedCreatedTime: 'Just Now',
            resendCount: 0
          };
          const currentInvites = this.model.getPairingInvites();
          currentInvites.unshift(simInvite);
          this.model.savePairingInvites(currentInvites);
          this.view._renderSharePairingModal(profile, currentInvites);
          this.view.showToast(`📲 Simulated incoming 24h pairing request from ${randomName}`);
        }
      });
    }
  }

  _getBranchObject(profile, branch) {
    if (!profile.lineage) profile.lineage = {};
    if (branch === 'current') {
      if (!profile.lineage.currentFamily) profile.lineage.currentFamily = {};
      return profile.lineage.currentFamily;
    }
    if (branch === 'husband') {
      if (!profile.lineage.husbandAncestral) profile.lineage.husbandAncestral = {};
      return profile.lineage.husbandAncestral;
    }
    if (branch === 'wife') {
      if (!profile.lineage.wifeAncestral) profile.lineage.wifeAncestral = {};
      return profile.lineage.wifeAncestral;
    }
    return {};
  }

  _saveFormChanges() {
    const active = this.model.getActiveProfile();

    const selectedRemedies = [];
    document.querySelectorAll('input[name="remedy-checkbox"]:checked').forEach(cb => {
      selectedRemedies.push(cb.value);
    });

    const children = [];
    if (this.view.childrenContainer) {
      this.view.childrenContainer.querySelectorAll('.dynamic-row-item').forEach(row => {
        const name = row.querySelector('.child-name-input').value.trim();
        const gender = row.querySelector('.child-gender-select').value;
        const ageOrNote = row.querySelector('.child-notes-input').value.trim();
        if (name) children.push({ id: 'c' + Math.random().toString(36).substr(2, 5), name, gender, ageOrNote });
      });
    }

    const readSiblings = (container) => {
      if (!container) return [];
      const siblings = [];
      container.querySelectorAll('.dynamic-row-item').forEach(row => {
        const name = row.querySelector('.sibling-name-input').value.trim();
        const relation = row.querySelector('.sibling-relation-select').value;
        const spouseName = row.querySelector('.sibling-spouse-input').value.trim();
        const childrenSummary = row.querySelector('.sibling-children-input').value.trim();
        if (name) {
          siblings.push({ id: 's' + Math.random().toString(36).substr(2, 5), name, relation, spouseName, childrenSummary, isMarried: spouseName.length > 0, notes: '' });
        }
      });
      return siblings;
    };

    const houseCleanLevels = [];
    if (this.view.devoteeHouseCleanContainer) {
      this.view.devoteeHouseCleanContainer.querySelectorAll('.houseclean-card').forEach((card, idx) => {
        const levelTitle = card.querySelector('.houseclean-level-title').textContent.replace('🧹', '').trim();
        const status = card.querySelector('.hc-status-select').value;
        const cleanPercentage = parseInt(card.querySelector('.hc-percentage-input').value, 10) || 0;
        const approvalDate = card.querySelector('.hc-date-input').value.trim();
        const cleanedDetails = card.querySelector('.hc-details-textarea').value.trim();
        const mentorRaw = card.querySelector('.hc-mentor-input').value.trim();
        const mentorRemarks = card.querySelector('.hc-remarks-input').value.trim();

        houseCleanLevels.push({
          id: active.houseCleanLevels?.[idx]?.id || 'hc-' + (idx + 1),
          levelNumber: idx + 1,
          levelTitle,
          status,
          cleanPercentage,
          cleanedDetails,
          mentorCode: active.houseCleanLevels?.[idx]?.mentorCode || active.referredByCode || 'SKHM-ADM1-7788-9900',
          mentorName: mentorRaw || 'Spiritual Mentor',
          mentorRemarks,
          approvalDate
        });
      });
    }

    const interestedSadhanas = [];
    if (this.view.interestedSadhanasContainer) {
      this.view.interestedSadhanasContainer.querySelectorAll('.dynamic-row-item').forEach(row => {
        const key = row.getAttribute('data-sadhana-key') || '';
        const name = row.querySelector('.is-name-input').value.trim();
        const category = row.querySelector('.is-category-input').value.trim();
        const priority = row.querySelector('.is-priority-select').value;
        const status = row.querySelector('.is-status-select').value;
        if (name) interestedSadhanas.push({ id: key || 'is-' + Math.random().toString(36).substr(2, 5), name, category, priority, status });
      });
    }

    const readTraineeCards = (container, domain) => {
      if (!container) return [];
      const items = [];
      container.querySelectorAll('.sadhana-progress-card').forEach(card => {
        const itemId = card.getAttribute('data-item-id') || '';
        const sadhanaKey = card.getAttribute('data-sadhana-key') || '';
        const title = card.querySelector('.ts-title-input').value.trim();
        const isPaidVal = card.querySelector('.ts-paid-select')?.value || (card.querySelector('.stamp-paid') ? 'PAID' : 'FREE');
        const isPaid = isPaidVal === 'PAID';
        const level = card.querySelector('.ts-level-select').value;
        const progressPercent = parseInt(card.querySelector('.ts-progress-input').value, 10) || 0;
        const dailyTarget = card.querySelector('.ts-target-input').value.trim();
        const currentStreak = card.querySelector('.ts-streak-input').value.trim();
        const diaryNotes = card.querySelector('.ts-notes-textarea').value.trim();
        if (title) {
          items.push({
            id: itemId || 'ts-' + Math.random().toString(36).substr(2, 5),
            sadhanaKey,
            title,
            categoryDomain: domain,
            isPaid,
            paymentStatus: isPaid ? 'PAID' : 'FREE',
            level,
            progressPercent,
            dailyTarget,
            currentStreak,
            diaryNotes,
            mentorCode: active.referredByCode || 'SKHM-ADM1-7788-9900'
          });
        }
      });
      return items;
    };

    const traineeSadhanas = [
      ...readTraineeCards(this.view.traineeGroupSadhanas, 'sadhanas'),
      ...readTraineeCards(this.view.traineeGroupRemedies, 'remedies'),
      ...readTraineeCards(this.view.traineeGroupCleansing, 'cleansing')
    ];

    const healerCompletedSadhanas = [];
    if (this.view.healerCompletedSadhanasContainer) {
      this.view.healerCompletedSadhanasContainer.querySelectorAll('.sadhana-progress-card').forEach(card => {
        const title = card.querySelector('.hc-comp-title-input').value.trim();
        const status = card.querySelector('.hc-comp-status-input').value.trim();
        const completionDate = card.querySelector('.hc-comp-date-input').value.trim();
        const seekersGuidedCount = parseInt(card.querySelector('.hc-comp-count-input').value, 10) || 0;
        const sealCode = card.querySelector('.hc-comp-seal-input').value.trim();
        if (title) {
          healerCompletedSadhanas.push({
            id: 'hcs-' + Math.random().toString(36).substr(2, 5),
            title,
            levelCompleted: 'Level 4 — Master Guru',
            status,
            completionDate,
            seekersGuidedCount,
            sealCode,
            authorizedToGuide: true
          });
        }
      });
    }

    const healerNetwork = [];
    if (this.view.healerNetworkContainer) {
      this.view.healerNetworkContainer.querySelectorAll('.dynamic-row-item').forEach(row => {
        const name = row.querySelector('.net-name-input').value.trim();
        const refCode = row.querySelector('.net-code-input').value.trim();
        const role = row.querySelector('.net-role-input').value.trim();
        if (name) healerNetwork.push({ id: 'net-' + Math.random().toString(36).substr(2, 5), name, refCode, role, activeCases: 1 });
      });
    }

    const paymentStatusVal = this.view.inputPaymentStatus ? this.view.inputPaymentStatus.value : (active.isPaid !== false ? 'PAID' : 'FREE');

    const updatedProfile = {
      profileType: this.view.inputProfileType ? this.view.inputProfileType.value : active.profileType,
      level: this.view.inputLevel ? (parseInt(this.view.inputLevel.value, 10) || 1) : active.level,
      categoryTag: this.view.inputCategoryTag ? this.view.inputCategoryTag.value.trim() : active.categoryTag,
      referenceCode: this.view.inputRefCode ? this.view.inputRefCode.value.trim() : active.referenceCode,
      referredByCode: this.view.inputSponsorCode ? this.view.inputSponsorCode.value.trim() : active.referredByCode,
      transferredCode: this.view.inputTransferCode ? (this.view.inputTransferCode.value.trim() || null) : active.transferredCode,
      isActive: this.view.inputIsActive ? this.view.inputIsActive.checked : active.isActive,
      isPaid: paymentStatusVal === 'PAID',
      paymentStatus: paymentStatusVal,
      joinDate: this.view.inputJoinDate ? this.view.inputJoinDate.value : active.joinDate,

      name: this.view.inputName ? this.view.inputName.value.trim() : active.name,
      phone: this.view.inputPhone ? this.view.inputPhone.value.trim() : active.phone,
      email: this.view.inputEmail ? this.view.inputEmail.value.trim() : active.email,
      city: this.view.inputCity ? this.view.inputCity.value.trim() : active.city,
      address: this.view.inputAddress ? this.view.inputAddress.value.trim() : active.address,
      objective: this.view.inputObjective ? this.view.inputObjective.value.trim() : active.objective,
      notes: this.view.inputNotes ? this.view.inputNotes.value.trim() : active.notes,
      selectedRemedies: selectedRemedies,

      seekerDiagnostics: {
        afflictionDuration: this.view.seekerAfflictionDuration ? this.view.seekerAfflictionDuration.value.trim() : (active.seekerDiagnostics?.afflictionDuration || ''),
        kuldeviIssues: this.view.seekerKuldeviIssues ? this.view.seekerKuldeviIssues.value.trim() : (active.seekerDiagnostics?.kuldeviIssues || ''),
        targetOutcome: this.view.seekerTargetOutcome ? this.view.seekerTargetOutcome.value.trim() : (active.seekerDiagnostics?.targetOutcome || '')
      },

      houseCleanLevels: houseCleanLevels.length > 0 ? houseCleanLevels : (active.houseCleanLevels || []),
      interestedSadhanas: interestedSadhanas.length > 0 ? interestedSadhanas : (active.interestedSadhanas || []),
      traineeSadhanas: traineeSadhanas.length > 0 ? traineeSadhanas : (active.traineeSadhanas || []),
      healerCompletedSadhanas: healerCompletedSadhanas.length > 0 ? healerCompletedSadhanas : (active.healerCompletedSadhanas || []),
      healerNetwork: healerNetwork.length > 0 ? healerNetwork : (active.healerNetwork || []),

      lineage: {
        currentFamily: {
          selfName: this.view.lineageSelfName ? (this.view.lineageSelfName.value.trim() || this.view.inputName?.value.trim() || active.name) : active.lineage?.currentFamily?.selfName,
          selfTitle: this.view.inputSelfTitle ? this.view.inputSelfTitle.value.trim() : (active.lineage?.currentFamily?.selfTitle || ''),
          spouseName: this.view.lineageSpouseName ? this.view.lineageSpouseName.value.trim() : (active.lineage?.currentFamily?.spouseName || ''),
          children: children.length > 0 ? children : (active.lineage?.currentFamily?.children || []),
          siblings: readSiblings(this.view.siblingsCurrentContainer)
        },
        husbandAncestral: {
          fatherName: this.view.hFatherName ? this.view.hFatherName.value.trim() : (active.lineage?.husbandAncestral?.fatherName || ''),
          motherName: this.view.hMotherName ? this.view.hMotherName.value.trim() : (active.lineage?.husbandAncestral?.motherName || ''),
          paternalGrandfather: this.view.hPaternalGf ? this.view.hPaternalGf.value.trim() : (active.lineage?.husbandAncestral?.paternalGrandfather || ''),
          paternalGrandmother: this.view.hPaternalGm ? this.view.hPaternalGm.value.trim() : (active.lineage?.husbandAncestral?.paternalGrandmother || ''),
          maternalGrandfather: this.view.hMaternalGf ? this.view.hMaternalGf.value.trim() : (active.lineage?.husbandAncestral?.maternalGrandfather || ''),
          maternalGrandmother: this.view.hMaternalGm ? this.view.hMaternalGm.value.trim() : (active.lineage?.husbandAncestral?.maternalGrandmother || ''),
          siblings: readSiblings(this.view.siblingsHusbandContainer),
          address: this.view.hAddress ? this.view.hAddress.value.trim() : (active.lineage?.husbandAncestral?.address || '')
        },
        wifeAncestral: {
          fatherName: this.view.wFatherName ? this.view.wFatherName.value.trim() : (active.lineage?.wifeAncestral?.fatherName || ''),
          motherName: this.view.wMotherName ? this.view.wMotherName.value.trim() : (active.lineage?.wifeAncestral?.motherName || ''),
          paternalGrandfather: this.view.wPaternalGf ? this.view.wPaternalGf.value.trim() : (active.lineage?.wifeAncestral?.paternalGrandfather || ''),
          paternalGrandmother: this.view.wPaternalGm ? this.view.wPaternalGm.value.trim() : (active.lineage?.wifeAncestral?.paternalGrandmother || ''),
          maternalGrandfather: this.view.wMaternalGf ? this.view.wMaternalGf.value.trim() : (active.lineage?.wifeAncestral?.maternalGrandfather || ''),
          maternalGrandmother: this.view.wMaternalGm ? this.view.wMaternalGm.value.trim() : (active.lineage?.wifeAncestral?.maternalGrandmother || ''),
          siblings: readSiblings(this.view.siblingsWifeContainer),
          address: this.view.wAddress ? this.view.wAddress.value.trim() : (active.lineage?.wifeAncestral?.address || '')
        }
      }
    };

    this.model.updateActiveProfile(updatedProfile);
    this._renderCurrentState();
    this.view.showToast('✓ Profile successfully saved & synchronized across all tabs!');

    // Dispatch minimal data-minimized node status to Firebase Realtime Database
    if (window.FirebaseSyncEngine) {
      window.FirebaseSyncEngine.publishMinimalNodeStatus(updatedProfile);
    }
  }
}

// ==============================================================
// 12. FIREBASE REALTIME DATABASE SYNC ENGINE (DATA MINIMIZATION)
// ==============================================================
class FirebaseSyncEngine {
  static init() {
    this.config = {
      apiKey: "AIzaSy_SpiritualKarim_Enterprise_Key",
      authDomain: "spritualkarim-7b5fd.firebaseapp.com",
      databaseURL: "https://spritualkarim-7b5fd-default-rtdb.firebaseio.com",
      projectId: "spritualkarim-7b5fd",
      storageBucket: "spritualkarim-7b5fd.appspot.com",
      messagingSenderId: "389274194021",
      appId: "1:389274194021:web:9c847a29e1a8b3e"
    };

    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      try {
        firebase.initializeApp(this.config);
        this.db = firebase.database();
        console.log("🔥 [Firebase RTDB] Initialized with Data Minimization Mode (Project: spritualkarim-7b5fd)");
        this.listenToOnlineNodes();
      } catch (err) {
        console.warn("Firebase RTDB init notice:", err.message);
      }
    }
  }

  /**
   * Publishes strictly pseudonymized node data to Firebase Realtime Database.
   * Strips all private contact info, real names, and ancestral tree details.
   */
  static publishMinimalNodeStatus(profile) {
    if (!this.db || !profile) return;
    try {
      const sanitizedCode = (profile.referenceCode || 'NODE_UNKNOWN').replace(/[^a-zA-Z0-9_-]/g, '_');
      const minimalPayload = {
        nodeId: sanitizedCode,
        sponsorId: (profile.referredByCode || 'ROOT').replace(/[^a-zA-Z0-9_-]/g, '_'),
        role: profile.profileType || 'DEVOTEE',
        level: profile.level || 1,
        status: profile.isActive !== false ? 'ACTIVE' : 'INACTIVE',
        lastSeenTimestamp: firebase.database.ServerValue.TIMESTAMP,
        isoTime: new Date().toISOString()
      };

      this.db.ref('authorisedNodes/' + sanitizedCode).set(minimalPayload);
      
      // Log telemetry event
      this.db.ref('logs').push().set({
        action: 'NODE_STATUS_UPDATE',
        nodeId: sanitizedCode,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });
    } catch (e) {
      console.warn("Failed to publish minimal node status to Firebase:", e);
    }
  }

  static listenToOnlineNodes() {
    if (!this.db) return;
    this.db.ref('authorisedNodes').limitToLast(20).on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("🔥 [Firebase Live Active Nodes]:", Object.keys(data).length, "devices online.");
      }
    });
  }
}

window.FirebaseSyncEngine = FirebaseSyncEngine;

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const model = new ProfileModel();
  const view = new ProfileView();
  const controller = new ProfileController(model, view);
  controller.init();
  FirebaseSyncEngine.init();
});

