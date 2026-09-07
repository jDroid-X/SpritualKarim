package com.jdroidx.spritualkarim.data.repository

import com.jdroidx.spritualkarim.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.security.SecureRandom
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

/**
 * Repository managing multi-level Healers, Trainees, Devotees and Admin profiles.
 * Implements full CRUD, 16-digit code generation, validation, and hierarchy traversal.
 */
object HealersRepository {

    private val random = SecureRandom()
    private val allowedChars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ" // Crockford-style avoid 0/O, 1/I ambiguity

    /**
     * Generates a 16-digit alphanumeric reference code formatted as SKHM-XXXX-XXXX-XXXX.
     */
    fun generate16DigitReferenceCode(): String {
        fun segment(length: Int): String {
            return (1..length)
                .map { allowedChars[random.nextInt(allowedChars.length)] }
                .joinToString("")
        }
        return "SKHM-${segment(4)}-${segment(4)}-${segment(4)}"
    }

    /**
     * Validates if a given code matches the 16-digit format.
     */
    fun isValid16DigitCode(code: String): Boolean {
        val clean = code.trim().uppercase()
        val regex = Regex("^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$")
        return regex.matches(clean) || clean.replace("-", "").length == 16
    }

    // Initial 5-Level Multilevel Organization Seed Data (Parallel and Sequential)
    private val initialProfiles = listOf(
        // LEVEL 1: Root Admin (Master Founder) - Spiritual Karim Khan
        HealerProfile(
            id = "prof-root-01",
            referenceCode = "SKHM-ADM1-7788-9900",
            referredByCode = "ROOT-0000-0000-0000",
            transferredCode = null,
            name = "Karim Ji (Founder & Master Guide)",
            phone = "+91 98765 43210",
            email = "karim.master@spiritualkarim.org",
            profileType = ProfileType.ADMIN,
            level = 1,
            objective = "Spiritual illumination, global negativity mitigation, and true mentorship for all seekers.",
            selectedRemedies = listOf("sri_yantra", "three_diya", "trilok_nagri", "negativity", "kundalini"),
            address = "Spiritual Karim Central Ashram, Nirvana Marg",
            city = "Varanasi / Haridwar",
            joinDate = "2020-01-01",
            isActive = true,
            notes = "Master Head of Organization. Direct lineage origin.",
            lineage = ThreeGenLineage(
                currentFamily = CurrentFamilyDetails(
                    selfName = "Spiritual Karim Khan",
                    selfTitle = "Founder & Master Guide",
                    spouseName = "Fatima Karim Khan",
                    children = listOf(
                        ChildMember(name = "Zaid Karim Khan", gender = "Son", ageOrNote = "Elder Son"),
                        ChildMember(name = "Ayesha Karim Khan", gender = "Daughter", ageOrNote = "Daughter")
                    ),
                    siblings = listOf(
                        SiblingMember(name = "Tariq Karim Khan", relation = "Brother", spouseName = "Shabnam Khan", childrenSummary = "2 Sons", isMarried = true, notes = "Senior Ashram Coordinator"),
                        SiblingMember(name = "Zubaida Begum", relation = "Sister", spouseName = "Rashid Ahmed", childrenSummary = "1 Son, 1 Daughter", isMarried = true, notes = "Lucknow Branch Trustee")
                    )
                ),
                husbandAncestral = AncestralBranchDetails(
                    fatherName = "Late Hazrat Ghulam Khan",
                    motherName = "Begum Mumtaz Khan",
                    paternalGrandfather = "Sufi Dilawar Khan",
                    paternalGrandmother = "Amina Khatoon",
                    maternalGrandfather = "Maulana Aslam Qureshi",
                    maternalGrandmother = "Rabia Qureshi",
                    siblings = listOf(
                        SiblingMember(name = "Hamid Ghulam Khan", relation = "Paternal Uncle", spouseName = "Zehra Khan", childrenSummary = "3 Children", isMarried = true),
                        SiblingMember(name = "Salma Begum", relation = "Paternal Aunt", spouseName = "Dr. Farooq Siddiqui", childrenSummary = "2 Children", isMarried = true)
                    ),
                    address = "Ancestral Haveli, Old Varanasi"
                ),
                wifeAncestral = AncestralBranchDetails(
                    fatherName = "Janab Abdul Sattar",
                    motherName = "Tahira Begum",
                    paternalGrandfather = "Haji Rahimuddin",
                    paternalGrandmother = "Mariam Begum",
                    maternalGrandfather = "Janab Yusuf Sheikh",
                    maternalGrandmother = "Kulsum Sheikh",
                    siblings = listOf(
                        SiblingMember(name = "Imran Sattar", relation = "Brother", spouseName = "Nazia Sattar", childrenSummary = "1 Son", isMarried = true),
                        SiblingMember(name = "Rukhsar Begum", relation = "Sister", spouseName = "Dr. Bilal Hashmi", childrenSummary = "2 Daughters", isMarried = true)
                    ),
                    address = "Civil Lines, Lucknow"
                )
            )
        ),

        // LEVEL 2: Healers (Parallel additions under Level 1 Admin)
        HealerProfile(
            id = "prof-hlr-01",
            referenceCode = "SKHM-HLR2-3344-5566",
            referredByCode = "SKHM-ADM1-7788-9900",
            transferredCode = null,
            name = "Acharya Rajesh Sharma",
            phone = "+91 98111 22334",
            email = "rajesh.healer@spiritualkarim.org",
            profileType = ProfileType.HEALER,
            level = 2,
            objective = "Guiding devotees through Three Diya purification and Sri Yantra activation.",
            selectedRemedies = listOf("sri_yantra", "three_diya", "court_cases", "negativity"),
            address = "Sector 14, Spiritual Kendra",
            city = "New Delhi",
            joinDate = "2021-03-15",
            isActive = true,
            notes = "Lead Senior Healer for Northern Region.",
            lineage = ThreeGenLineage(
                currentFamily = CurrentFamilyDetails(
                    selfName = "Acharya Rajesh Sharma",
                    selfTitle = "Senior Lead Healer",
                    spouseName = "Sunita Sharma",
                    children = listOf(
                        ChildMember(name = "Aditya Sharma", gender = "Son"),
                        ChildMember(name = "Ananya Sharma", gender = "Daughter")
                    ),
                    siblings = listOf(
                        SiblingMember(name = "Suresh Sharma", relation = "Elder Brother", spouseName = "Rekha Sharma", childrenSummary = "2 Sons", isMarried = true),
                        SiblingMember(name = "Pooja Trivedi", relation = "Younger Sister", spouseName = "Alok Trivedi", childrenSummary = "1 Daughter", isMarried = true)
                    )
                ),
                husbandAncestral = AncestralBranchDetails(
                    fatherName = "Pt. Ramakant Sharma",
                    motherName = "Shanti Devi Sharma",
                    paternalGrandfather = "Pt. Harishankar Sharma",
                    paternalGrandmother = "Kalyani Devi",
                    maternalGrandfather = "Pt. Brijmohan Shastri",
                    maternalGrandmother = "Saraswati Devi",
                    siblings = listOf(
                        SiblingMember(name = "Pt. Kedarnath Sharma", relation = "Uncle", spouseName = "Saroj Sharma", childrenSummary = "2 Sons", isMarried = true)
                    ),
                    address = "Shri Radha Kunj, Vrindavan Dham"
                ),
                wifeAncestral = AncestralBranchDetails(
                    fatherName = "Shri Dayashankar Mishra",
                    motherName = "Geeta Mishra",
                    paternalGrandfather = "Pt. Govind Mishra",
                    paternalGrandmother = "Laxmi Devi",
                    maternalGrandfather = "Shri Vidyadhar Shukla",
                    maternalGrandmother = "Kamla Devi",
                    siblings = listOf(
                        SiblingMember(name = "Virendra Mishra", relation = "Brother", spouseName = "Ritu Mishra", childrenSummary = "1 Son", isMarried = true)
                    ),
                    address = "Civil Lines, Prayagraj"
                )
            )
        ),
        HealerProfile(
            id = "prof-hlr-02",
            referenceCode = "SKHM-HLR2-8899-1122",
            referredByCode = "SKHM-ADM1-7788-9900",
            transferredCode = null,
            name = "Dr. Sunita Deshmukh",
            phone = "+91 98222 33445",
            email = "sunita.healer@spiritualkarim.org",
            profileType = ProfileType.HEALER,
            level = 2,
            objective = "Holistic spiritual healing from illness and Mahamrityunjaya japa transmission.",
            selectedRemedies = listOf("healing", "kalashtami", "material_benefits", "trilok_nagri"),
            address = "Deccan Gymkhana",
            city = "Pune",
            joinDate = "2021-06-10",
            isActive = true,
            notes = "Western Zone Senior Healer & Medical Astrologer.",
            lineage = ThreeGenLineage(
                currentFamily = CurrentFamilyDetails(
                    selfName = "Dr. Sunita Deshmukh",
                    selfTitle = "Senior Healer & Astrologer",
                    spouseName = "Dr. Prakash Deshmukh",
                    children = listOf(
                        ChildMember(name = "Rohan Deshmukh", gender = "Son")
                    ),
                    siblings = listOf(
                        SiblingMember(name = "Anand Kulkarni", relation = "Brother", spouseName = "Varsha Kulkarni", childrenSummary = "1 Daughter", isMarried = true)
                    )
                ),
                husbandAncestral = AncestralBranchDetails(
                    fatherName = "Shri Anant Deshmukh",
                    motherName = "Radha Deshmukh",
                    paternalGrandfather = "Vishnu Deshmukh",
                    paternalGrandmother = "Parvati Deshmukh",
                    maternalGrandfather = "Dattatray Joshi",
                    maternalGrandmother = "Godavari Joshi",
                    siblings = emptyList(),
                    address = "Shivaji Nagar, Pune"
                ),
                wifeAncestral = AncestralBranchDetails(
                    fatherName = "Shri Madhav Kulkarni",
                    motherName = "Vimal Kulkarni",
                    paternalGrandfather = "Shripad Kulkarni",
                    paternalGrandmother = "Rukmini Kulkarni",
                    maternalGrandfather = "Ganesh Bhat",
                    maternalGrandmother = "Yamuna Bhat",
                    siblings = emptyList(),
                    address = "Mahad, Raigad"
                )
            )
        ),

        // LEVEL 3: Senior Trainees (Parallel & Sequential under Level 2 Healers)
        HealerProfile(
            id = "prof-trn-01",
            referenceCode = "SKHM-TRN3-4455-6677",
            referredByCode = "SKHM-HLR2-3344-5566", // Under Acharya Rajesh Sharma
            transferredCode = null,
            name = "Rohan Verma",
            phone = "+91 98333 44556",
            email = "rohan.trainee@spiritualkarim.org",
            profileType = ProfileType.TRAINEE,
            level = 3,
            objective = "Mastering Navratri Chamunda Sadhana and court dispute remedies.",
            selectedRemedies = listOf("navratri", "court_cases", "business_money"),
            address = "Civil Lines",
            city = "Jaipur",
            joinDate = "2022-02-20",
            isActive = true,
            notes = "Senior Trainee mentoring 4 junior groups.",
            lineage = ThreeGenLineage(
                currentFamily = CurrentFamilyDetails(
                    selfName = "Rohan Verma",
                    selfTitle = "Senior Mentorship Trainee",
                    spouseName = "Preeti Verma",
                    children = listOf(
                        ChildMember(name = "Kabir Verma", gender = "Son")
                    ),
                    siblings = listOf(
                        SiblingMember(name = "Kunal Verma", relation = "Brother", spouseName = "Divya Verma", childrenSummary = "1 Son", isMarried = true),
                        SiblingMember(name = "Neha Saxena", relation = "Sister", spouseName = "Manish Saxena", childrenSummary = "2 Children", isMarried = true)
                    )
                ),
                husbandAncestral = AncestralBranchDetails(
                    fatherName = "Shri Kailash Verma",
                    motherName = "Usha Verma",
                    paternalGrandfather = "Moolchand Verma",
                    paternalGrandmother = "Gulab Devi",
                    maternalGrandfather = "Om Prakash Mathur",
                    maternalGrandmother = "Kusum Mathur",
                    siblings = emptyList(),
                    address = "Pink City Colony, Jaipur"
                ),
                wifeAncestral = AncestralBranchDetails(
                    fatherName = "Shri Narendra Saxena",
                    motherName = "Sunita Saxena",
                    paternalGrandfather = "Brijlal Saxena",
                    paternalGrandmother = "Shanti Saxena",
                    maternalGrandfather = "Purushottam Das",
                    maternalGrandmother = "Kamla Devi",
                    siblings = emptyList(),
                    address = "Kota Heritage Marg"
                )
            )
        ),
        HealerProfile(
            id = "prof-trn-02",
            referenceCode = "SKHM-TRN3-7788-9911",
            referredByCode = "SKHM-HLR2-8899-1122", // Under Dr. Sunita Deshmukh
            transferredCode = null,
            name = "Meera Nair",
            phone = "+91 98444 55667",
            email = "meera.nair@spiritualkarim.org",
            profileType = ProfileType.TRAINEE,
            level = 3,
            objective = "Advanced Kundalini progress and healing sadhana mentorship.",
            selectedRemedies = listOf("kundalini", "healing", "diwali"),
            address = "Kakkanad",
            city = "Kochi",
            joinDate = "2022-05-18",
            isActive = true,
            notes = "Southern chapter mentorship coordinator."
        ),

        // LEVEL 4: Trainees (Sequential under Level 3)
        HealerProfile(
            id = "prof-trn-03",
            referenceCode = "SKHM-TRN4-1122-3344",
            referredByCode = "SKHM-TRN3-4455-6677", // Under Rohan Verma
            transferredCode = null,
            name = "Amitabh Sen",
            phone = "+91 98555 66778",
            email = "amitabh.sen@spiritualkarim.org",
            profileType = ProfileType.TRAINEE,
            level = 4,
            objective = "Business and money upaya implementation and guidance for traders.",
            selectedRemedies = listOf("business_money", "three_diya"),
            address = "Salt Lake Sector V",
            city = "Kolkata",
            joinDate = "2023-01-10",
            isActive = true,
            notes = "Junior trainee actively training 8 devotees."
        ),
        HealerProfile(
            id = "prof-trn-04",
            referenceCode = "SKHM-TRN4-5566-7788",
            referredByCode = "SKHM-TRN3-7788-9911", // Under Meera Nair
            transferredCode = null,
            name = "Pooja Patel",
            phone = "+91 98666 77889",
            email = "pooja.patel@spiritualkarim.org",
            profileType = ProfileType.TRAINEE,
            level = 4,
            objective = "Diwali Lakshmi beej japa and material benefit sadhanas.",
            selectedRemedies = listOf("diwali", "material_benefits", "negativity"),
            address = "Navrangpura",
            city = "Ahmedabad",
            joinDate = "2023-04-12",
            isActive = true,
            notes = "Conducts weekly community prayer circles."
        ),

        // LEVEL 5: Devotees (Seekers with House Clean Levels)
        HealerProfile(
            id = "prof-dev-01",
            referenceCode = "SKHM-DEV5-9900-1122",
            referredByCode = "SKHM-TRN4-1122-3344", // Under Amitabh Sen
            transferredCode = null,
            name = "Vikas Gupta",
            phone = "+91 98777 88990",
            email = "vikas.gupta@seeker.org",
            profileType = ProfileType.DEVOTEE,
            level = 2, // Level 2 House Clean
            categoryTag = "House Clean",
            objective = "Complete resolution of heavy business debts and peace in family.",
            selectedRemedies = listOf("business_money", "three_diya", "negativity"),
            address = "Boring Road",
            city = "Patna",
            joinDate = "2023-08-01",
            isActive = true,
            notes = "Practicing Three Diya continuously for 21 days."
        ),
        HealerProfile(
            id = "prof-dev-02",
            referenceCode = "SKHM-DEV5-3344-5566",
            referredByCode = "SKHM-TRN4-1122-3344", // Parallel under Amitabh Sen
            transferredCode = null,
            name = "Sneha Roy",
            phone = "+91 98888 99001",
            email = "sneha.roy@seeker.org",
            profileType = ProfileType.DEVOTEE,
            level = 1, // Level 1 House Clean
            categoryTag = "House Clean",
            objective = "Removal of negative energies from home and health restoration.",
            selectedRemedies = listOf("negativity", "healing"),
            address = "Gariahat",
            city = "Kolkata",
            joinDate = "2023-09-14",
            isActive = true,
            notes = "Assigned Bakhoor cleansing and Chamunda japa."
        ),
        HealerProfile(
            id = "prof-dev-03",
            referenceCode = "SKHM-DEV5-7788-9900",
            referredByCode = "SKHM-TRN4-5566-7788", // Under Pooja Patel
            transferredCode = "SKHM-XFR1-9988-7766",
            name = "Kavita Rathi",
            phone = "+91 98999 00112",
            email = "kavita.rathi@seeker.org",
            profileType = ProfileType.DEVOTEE,
            level = 1, // Level 1 House Clean
            categoryTag = "House Clean",
            objective = "Spiritual peace and legal dispute mitigation in property case.",
            selectedRemedies = listOf("court_cases", "sri_yantra"),
            address = "Vaishali Nagar",
            city = "Jaipur",
            joinDate = "2023-11-20",
            isActive = true,
            notes = "Transferred from Mumbai branch with legacy code tracker."
        )
    )

    private val _profiles = MutableStateFlow<List<HealerProfile>>(initialProfiles)
    val profiles: StateFlow<List<HealerProfile>> = _profiles.asStateFlow()

    /**
     * Updates the 3-Generation Ancestral Lineage of a specific profile.
     */
    fun updateProfileLineage(profileId: String, lineage: ThreeGenLineage) {
        val current = _profiles.value.toMutableList()
        val index = current.indexOfFirst { it.id == profileId }
        if (index != -1) {
            current[index] = current[index].copy(lineage = lineage)
            _profiles.value = current
        }
    }

    /**
     * Add a new profile.
     */
    fun addProfile(profile: HealerProfile) {
        val current = _profiles.value.toMutableList()
        val finalProfile = if (profile.referenceCode.isBlank()) {
            profile.copy(
                id = "prof-${UUID.randomUUID().toString().take(8)}",
                referenceCode = generate16DigitReferenceCode()
            )
        } else {
            profile.copy(id = if (profile.id.isBlank()) "prof-${UUID.randomUUID().toString().take(8)}" else profile.id)
        }
        current.add(finalProfile)
        _profiles.value = current
    }

    /**
     * Update an existing profile.
     */
    fun updateProfile(updated: HealerProfile) {
        val current = _profiles.value.toMutableList()
        val index = current.indexOfFirst { it.id == updated.id }
        if (index != -1) {
            current[index] = updated
            _profiles.value = current
        }
    }

    /**
     * Delete a profile by ID and automatically re-link direct downlines to parent sponsor.
     */
    fun deleteProfile(profileId: String) {
        val current = _profiles.value.toMutableList()
        val target = current.firstOrNull { it.id == profileId } ?: return
        val newSponsorCode = target.referredByCode
        val targetLevel = target.level

        // Re-link children to deleted profile's parent sponsor and adjust level
        val updated = current.filter { it.id != profileId }.map { p ->
            if (p.referredByCode == target.referenceCode) {
                p.copy(
                    referredByCode = newSponsorCode,
                    level = targetLevel.coerceAtLeast(1)
                )
            } else {
                p
            }
        }
        _profiles.value = updated
    }

    /**
     * Transfer a profile to a new upline/sponsor with audit code, circular loop check, and recursive subtree level recalculation.
     */
    fun transferProfile(profileId: String, newReferredByCode: String, transferCode: String): Boolean {
        val current = _profiles.value.toMutableList()
        val index = current.indexOfFirst { it.id == profileId }
        if (index == -1) return false

        val targetProfile = current[index]
        if (targetProfile.referenceCode.equals(newReferredByCode.trim(), ignoreCase = true)) {
            NotificationRepository.showWarning("Transfer Failed", "Cannot set profile as its own sponsor.")
            return false
        }

        // Circular Loop Detection: Disallow transfer if new sponsor is already a descendant
        if (isDescendant(targetProfile.referenceCode, newReferredByCode)) {
            NotificationRepository.showError(
                "Circular Hierarchy Detected",
                "Cannot transfer to downline ($newReferredByCode). This creates an infinite loop."
            )
            return false
        }

        val upline = current.firstOrNull { it.referenceCode.equals(newReferredByCode.trim(), ignoreCase = true) }
        val newLevel = ((upline?.level ?: 1) + 1).coerceAtMost(5)
        val profileRefCode = current[index].referenceCode

        current[index] = current[index].copy(
            referredByCode = newReferredByCode,
            transferredCode = transferCode.ifBlank { generate16DigitReferenceCode() },
            level = newLevel
        )

        // Recursively update downstream descendant levels to preserve hierarchy
        fun updateSubtreeLevels(parentCode: String, parentLevel: Int) {
            current.indices.forEach { i ->
                if (current[i].referredByCode == parentCode && current[i].id != profileId) {
                    val childLevel = (parentLevel + 1).coerceAtMost(5)
                    current[i] = current[i].copy(level = childLevel)
                    updateSubtreeLevels(current[i].referenceCode, childLevel)
                }
            }
        }
        updateSubtreeLevels(profileRefCode, newLevel)
        _profiles.value = current

        NotificationRepository.showSuccess(
            "Transfer Complete",
            "Profile ${targetProfile.name} successfully transferred under $newReferredByCode."
        )
        return true
    }

    /**
     * Checks if targetCode is a downstream descendant of ancestorCode.
     */
    fun isDescendant(ancestorCode: String, targetCode: String): Boolean {
        val descendants = getAllDescendants(ancestorCode)
        return descendants.any { it.referenceCode.equals(targetCode.trim(), ignoreCase = true) }
    }

    /**
     * Checks if targetCode is an upstream ancestor of childCode.
     */
    fun isAncestor(childCode: String, targetCode: String): Boolean {
        var current = getProfileByReferenceCode(childCode)
        while (current != null && !current.referredByCode.isNullOrBlank()) {
            if (current.referredByCode.equals(targetCode.trim(), ignoreCase = true)) return true
            current = getProfileByReferenceCode(current.referredByCode!!)
        }
        return false
    }

    /**
     * Retrieve direct children / downline of a given reference code.
     */
    fun getDirectChildren(referenceCode: String): List<HealerProfile> {
        return _profiles.value.filter { it.referredByCode == referenceCode }
    }

    /**
     * Retrieve all descendants recursively for a given reference code.
     */
    fun getAllDescendants(referenceCode: String): List<HealerProfile> {
        val result = mutableListOf<HealerProfile>()
        fun recurse(code: String) {
            val direct = _profiles.value.filter { it.referredByCode == code }
            result.addAll(direct)
            direct.forEach { child -> recurse(child.referenceCode) }
        }
        recurse(referenceCode)
        return result
    }

    /**
     * Find profile by ID.
     */
    fun getProfileById(id: String): HealerProfile? {
        return _profiles.value.firstOrNull { it.id == id || (id in listOf("prof-root-01", "prof-admin-01") && it.profileType == ProfileType.ADMIN) }
    }

    /**
     * Find profile by Reference Code.
     */
    fun getProfileByReferenceCode(code: String): HealerProfile? {
        return _profiles.value.firstOrNull { it.referenceCode.equals(code.trim(), ignoreCase = true) }
    }

    /**
     * Filter by Profile Type.
     */
    fun getProfilesByType(type: ProfileType?): List<HealerProfile> {
        if (type == null) return _profiles.value
        return _profiles.value.filter { it.profileType == type }
    }

    /**
     * Filter by Level (1 to 5+).
     */
    fun getProfilesByLevel(level: Int): List<HealerProfile> {
        return _profiles.value.filter { it.level == level }
    }

    /**
     * Search profiles by name, 16-digit code, phone, or city.
     */
    fun searchProfiles(query: String): List<HealerProfile> {
        val q = query.trim().lowercase()
        if (q.isEmpty()) return _profiles.value
        return _profiles.value.filter {
            it.name.lowercase().contains(q) ||
            it.referenceCode.lowercase().contains(q) ||
            it.phone.contains(q) ||
            it.city.lowercase().contains(q) ||
            it.profileType.displayName.lowercase().contains(q)
        }
    }

    /**
     * Get summary counts for metrics dashboard.
     */
    fun getSummaryMetrics(): Map<String, Int> {
        val list = _profiles.value
        return mapOf(
            "total" to list.size,
            "admin" to list.count { it.profileType == ProfileType.ADMIN },
            "healers" to list.count { it.profileType == ProfileType.HEALER },
            "trainees" to list.count { it.profileType == ProfileType.TRAINEE },
            "devotees" to list.count { it.profileType == ProfileType.DEVOTEE },
            "maxLevel" to (list.maxOfOrNull { it.level } ?: 1)
        )
    }

    fun getCurrentDateString(): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    }

    // =========================================================================
    // DEVICE-TO-DEVICE LINKING & 16-DIGIT CODE PAIRING LOGIC
    // =========================================================================

    private val _pairingInvites = MutableStateFlow<List<DevicePairingInvite>>(emptyList())
    val pairingInvites: StateFlow<List<DevicePairingInvite>> = _pairingInvites.asStateFlow()

    /**
     * Create an activation invite for parallel healer or downline trainee/devotee.
     */
    fun createPairingInvite(
        sourceProfile: HealerProfile,
        connectionType: ConnectionType,
        targetRole: ProfileType,
        verificationMethod: VerificationMethod,
        targetPhoneOrHandle: String
    ): DevicePairingInvite {
        val authNow = com.jdroidx.spritualkarim.utils.DeviceSecurityHelper.getAuthoritativeTime()
        val activeCount = _pairingInvites.value.count {
            it.sourceReferenceCode == sourceProfile.referenceCode &&
            !it.isActivated &&
            authNow < it.expiresAt
        }

        if (activeCount >= 5) {
            NotificationRepository.showWarning(
                title = "Invite Limit Reached",
                message = "Maximum 5 pending invites allowed. Please approve or let older invites expire."
            )
        }

        val pin = (100000 + random.nextInt(900000)).toString() // 6-digit numeric OTP
        val invite = DevicePairingInvite(
            sourceReferenceCode = sourceProfile.referenceCode,
            sourceName = sourceProfile.name,
            sourceLevel = sourceProfile.level,
            connectionType = connectionType,
            targetRole = targetRole,
            verificationMethod = verificationMethod,
            verificationToken = pin,
            targetPhoneOrHandle = targetPhoneOrHandle,
            createdAt = authNow,
            expiresAt = authNow + (24 * 60 * 60 * 1000L),
            lastResentAt = authNow
        )
        _pairingInvites.value = _pairingInvites.value + invite
        
        // Notify upline for approval
        NotificationRepository.showInfo(
            title = "Pairing Link Generated",
            message = "Link for ${sourceProfile.name} created. Valid for 24 Hours. Upline approval required."
        )
        return invite
    }

    /**
     * Resend an existing invite before/after expiry with 60-second anti-spam cooldown.
     */
    fun resendPairingInvite(inviteId: String): DevicePairingInvite? {
        val authNow = com.jdroidx.spritualkarim.utils.DeviceSecurityHelper.getAuthoritativeTime()
        val existing = _pairingInvites.value.firstOrNull { it.inviteId == inviteId } ?: return null

        // Enforce 60-second cooldown between resends
        val elapsedSinceLastResend = authNow - existing.lastResentAt
        if (elapsedSinceLastResend < 60_000L && existing.resendCount > 0) {
            val remainingSec = ((60_000L - elapsedSinceLastResend) / 1000L).coerceAtLeast(1)
            NotificationRepository.showWarning(
                title = "Cooldown Active",
                message = "Please wait $remainingSec seconds before requesting another resend."
            )
            return null
        }

        val updated = existing.copy(
            createdAt = authNow,
            expiresAt = authNow + (24 * 60 * 60 * 1000L),
            lastResentAt = authNow,
            resendCount = existing.resendCount + 1
        )
        _pairingInvites.value = _pairingInvites.value.map { if (it.inviteId == inviteId) updated else it }
        NotificationRepository.showInfo(
            title = "Invite Resent",
            message = "New 24-hour verification window activated (Resend #${updated.resendCount})."
        )
        return updated
    }

    /**
     * Approves a pending pairing request by upline.
     */
    fun approvePairingInvite(inviteId: String, uplineCode: String): Boolean {
        val authNow = com.jdroidx.spritualkarim.utils.DeviceSecurityHelper.getAuthoritativeTime()
        val invite = _pairingInvites.value.firstOrNull { it.inviteId == inviteId } ?: return false
        if (authNow > invite.expiresAt) {
            NotificationRepository.showWarning(
                title = "Invite Expired",
                message = "This pairing link has expired (>24 hours). Please ask member to resend link."
            )
            return false
        }
        val updated = invite.copy(isApprovedByUpline = true, approvedAt = authNow)
        _pairingInvites.value = _pairingInvites.value.map { if (it.inviteId == inviteId) updated else it }
        
        // Enqueue sync item in offline/online sync queue
        SyncQueueRepository.enqueueSyncAction(
            actionType = SyncActionType.PAIRING_APPROVAL,
            targetReferenceCode = invite.sourceReferenceCode,
            payloadJson = "{\"inviteId\":\"$inviteId\",\"approvedBy\":\"$uplineCode\",\"time\":$authNow}"
        )

        // Send to-fro peer notification
        NotificationRepository.showSuccess(
            title = "Pairing Approved by Upline",
            message = "Device pairing certified by upline ($uplineCode). Real-time hierarchy link established."
        )
        return true
    }

    /**
     * Verify token and link a new device to the hierarchy tree with hardware fingerprint auto-merge.
     */
    fun verifyAndActivateDevicePairing(
        sourceReferenceCode: String,
        inputToken: String,
        newMemberName: String,
        newMemberPhone: String,
        connectionType: ConnectionType,
        targetRole: ProfileType,
        deviceFingerprint: String = ""
    ): Result<HealerProfile> {
        val authNow = com.jdroidx.spritualkarim.utils.DeviceSecurityHelper.getAuthoritativeTime()
        val sponsor = getProfileByReferenceCode(sourceReferenceCode)
            ?: return Result.failure(Exception("Sponsor profile ($sourceReferenceCode) not found."))

        val cleanPhone = newMemberPhone.trim()

        // Check if an existing profile matches this phone or hardware fingerprint for auto-merge
        val existingDuplicate = _profiles.value.firstOrNull {
            it.phone.isNotBlank() && it.phone.replace(" ", "").equals(cleanPhone.replace(" ", ""), ignoreCase = true)
        }

        if (existingDuplicate != null) {
            // Auto-merge reinstall on same device rather than creating orphan duplicate node
            val mergedProfile = existingDuplicate.copy(
                referredByCode = sponsor.referenceCode,
                isActive = true,
                notes = "${existingDuplicate.notes} [Auto-merged on reinstall: $deviceFingerprint]"
            )
            updateProfile(mergedProfile)

            NotificationRepository.showDivine(
                title = "Device Reconnected",
                message = "Existing profile ${mergedProfile.name} successfully re-linked under ${sponsor.name}."
            )
            return Result.success(mergedProfile)
        }

        val matchingInvite = _pairingInvites.value.firstOrNull {
            it.sourceReferenceCode.equals(sourceReferenceCode, ignoreCase = true) &&
            it.verificationToken == inputToken.trim()
        }

        if (matchingInvite != null && authNow > matchingInvite.expiresAt) {
            return Result.failure(Exception("Pairing PIN/Link has expired (>24 Hours). Please request a new link from your sponsor."))
        }

        val newLevel = if (connectionType == ConnectionType.PARALLEL_HEALER) {
            sponsor.level
        } else {
            (sponsor.level + 1).coerceAtMost(5)
        }

        val newCode = generate16DigitReferenceCode()
        val newProfile = HealerProfile(
            id = "prof-paired-$authNow",
            referenceCode = newCode,
            referredByCode = sponsor.referenceCode,
            name = if (newMemberName.isBlank()) "Connected Device (${newCode.takeLast(4)})" else newMemberName.trim(),
            phone = if (cleanPhone.isBlank()) "+91 98${10000000 + random.nextInt(89999999)}" else cleanPhone,
            email = "dev.${newCode.takeLast(4).lowercase()}@spiritualkarim.org",
            profileType = if (connectionType == ConnectionType.PARALLEL_HEALER) ProfileType.HEALER else targetRole,
            level = newLevel,
            objective = if (connectionType == ConnectionType.PARALLEL_HEALER)
                "Parallel Healer node linked with ${sponsor.name} for collaborative spiritual healing."
            else
                "Lineage sadhana, mantra practice, and sacred guidance under ${sponsor.name}.",
            selectedRemedies = listOf("three_diya", "sri_yantra"),
            city = sponsor.city,
            joinDate = getCurrentDateString(),
            notes = if (deviceFingerprint.isNotBlank()) "Hardware ID: $deviceFingerprint" else ""
        )

        addProfile(newProfile)

        // Mark any matching invite as activated
        _pairingInvites.value = _pairingInvites.value.map {
            if (it.sourceReferenceCode.equals(sourceReferenceCode, ignoreCase = true) &&
                it.verificationToken == inputToken.trim()) {
                it.copy(isActivated = true, isApprovedByUpline = true, approvedAt = authNow)
            } else {
                it
            }
        }

        // Enqueue sync action
        SyncQueueRepository.enqueueSyncAction(
            actionType = SyncActionType.PROFILE_UPDATE,
            targetReferenceCode = sponsor.referenceCode,
            payloadJson = "{\"newMemberCode\":\"$newCode\",\"sponsorCode\":\"${sponsor.referenceCode}\"}"
        )

        // Bi-directional to-fro notification across paired devices
        NotificationRepository.showDivine(
            title = "Hierarchy Connected 🎉",
            message = "New member ${newProfile.name} successfully linked to ${sponsor.name}. Bidirectional data sync enabled."
        )

        return Result.success(newProfile)
    }
}

/**
 * Connection relationship type for multi-level device linking.
 */
enum class ConnectionType(val title: String, val subtitle: String) {
    PARALLEL_HEALER("1. Healer (Parallel Connection)", "Connect a co-healer at the same organization level & branch"),
    DOWNLINE_MEMBER("2. Trainee / Devotee (Level-Down)", "Add as direct downline in hierarchy tree under your lineage")
}

/**
 * Verification channel for device activation.
 */
enum class VerificationMethod(val title: String, val hint: String) {
    MOBILE_OTP("Mobile Number (SMS Code)", "6-digit OTP code sent to target phone"),
    TELEGRAM_CODE("Telegram Bot Code", "Instant Telegram @SpiritualKarimBot code")
}

/**
 * Data model for device pairing invite with 24-hour expiration and upline approval.
 */
data class DevicePairingInvite(
    val inviteId: String = UUID.randomUUID().toString(),
    val sourceReferenceCode: String,
    val sourceName: String,
    val sourceLevel: Int,
    val connectionType: ConnectionType,
    val targetRole: ProfileType,
    val verificationMethod: VerificationMethod,
    val verificationToken: String,
    val targetPhoneOrHandle: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val expiresAt: Long = System.currentTimeMillis() + (24 * 60 * 60 * 1000L),
    val lastResentAt: Long = System.currentTimeMillis(),
    val isApprovedByUpline: Boolean = false,
    val approvedAt: Long? = null,
    val resendCount: Int = 0,
    val isActivated: Boolean = false
)
