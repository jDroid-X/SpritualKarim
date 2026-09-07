package com.jdroidx.spritualkarim.data.model

import java.util.UUID

/**
 * Represents a brother or sister in the family tree, including their family unit.
 */
data class SiblingMember(
    val id: String = UUID.randomUUID().toString().take(6),
    val name: String = "",
    val relation: String = "Brother", // "Brother", "Sister", "Elder Brother", "Younger Sister", etc.
    val spouseName: String = "",
    val childrenSummary: String = "", // e.g. "2 Sons, 1 Daughter" or names
    val isMarried: Boolean = false,
    val notes: String = ""
)

/**
 * Represents a child of the current family unit.
 */
data class ChildMember(
    val id: String = UUID.randomUUID().toString().take(6),
    val name: String = "",
    val gender: String = "Son", // "Son", "Daughter"
    val ageOrNote: String = ""
)

/**
 * Represents the Current Family Generation (Self, Spouse, Children, Siblings).
 */
data class CurrentFamilyDetails(
    val selfName: String = "",
    val selfTitle: String = "", // e.g., "Founder & Master Guide"
    val spouseName: String = "",
    val children: List<ChildMember> = emptyList(),
    val siblings: List<SiblingMember> = emptyList()
) {
    val childrenFormatted: String
        get() = if (children.isEmpty()) "None" else children.joinToString(", ") { it.name }

    val siblingsFormatted: String
        get() = if (siblings.isEmpty()) "None" else siblings.joinToString(", ") {
            if (it.spouseName.isNotBlank()) "${it.name} (m. ${it.spouseName})" else it.name
        }
}

/**
 * Represents Ancestral lineage details for either Husband's or Wife's family side.
 */
data class AncestralBranchDetails(
    val fatherName: String = "",
    val motherName: String = "",
    val paternalGrandfather: String = "",
    val paternalGrandmother: String = "",
    val maternalGrandfather: String = "",
    val maternalGrandmother: String = "",
    val siblings: List<SiblingMember> = emptyList(), // Siblings on this branch
    val address: String = ""
) {
    val parentsFormatted: String
        get() {
            val f = fatherName.ifBlank { "Not specified" }
            val m = motherName.ifBlank { "Not specified" }
            return "$f • $m"
        }

    val paternalGrandparentsFormatted: String
        get() {
            val gf = paternalGrandfather.ifBlank { "Not specified" }
            val gm = paternalGrandmother.ifBlank { "Not specified" }
            return "$gf • $gm"
        }

    val maternalGrandparentsFormatted: String
        get() {
            val gf = maternalGrandfather.ifBlank { "Not specified" }
            val gm = maternalGrandmother.ifBlank { "Not specified" }
            return "$gf • $gm"
        }

    val siblingsFormatted: String
        get() = if (siblings.isEmpty()) "None" else siblings.joinToString(", ") { it.name }
}

/**
 * Complete 3-Generation Ancestral Lineage Container.
 */
data class ThreeGenLineage(
    val currentFamily: CurrentFamilyDetails = CurrentFamilyDetails(),
    val husbandAncestral: AncestralBranchDetails = AncestralBranchDetails(),
    val wifeAncestral: AncestralBranchDetails = AncestralBranchDetails()
)
