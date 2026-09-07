package com.jdroidx.spritualkarim.ui.components

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jdroidx.spritualkarim.data.model.AppNotification
import com.jdroidx.spritualkarim.data.model.NotificationType
import com.jdroidx.spritualkarim.data.repository.NotificationRepository
import com.jdroidx.spritualkarim.ui.theme.*
import java.util.Locale

// ==========================================
// 1. SPIRITUAL SWITCH (ON / OFF)
// ==========================================
/**
 * Interactive Switch with brand styling, custom track, and label.
 */
@Composable
fun SpiritualSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    icon: ImageVector? = null,
    enabled: Boolean = true
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .clickable(enabled = enabled) { onCheckedChange(!checked) }
            .padding(vertical = 6.dp, horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            if (icon != null) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (checked) SpiritualGold.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = if (checked) SpiritualGold else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
            }
            Column {
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                if (subtitle != null) {
                    Text(
                        text = subtitle,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 10.sp
                    )
                }
            }
        }

        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            enabled = enabled,
            colors = SwitchDefaults.colors(
                checkedThumbColor = DivineWhite,
                checkedTrackColor = SpiritualTeal,
                uncheckedThumbColor = MaterialTheme.colorScheme.outline,
                uncheckedTrackColor = MaterialTheme.colorScheme.surfaceVariant
            )
        )
    }
}

// ==========================================
// 2. SPIRITUAL SEGMENTED TOGGLE (LEFT / RIGHT / MULTI)
// ==========================================
/**
 * 2-way or multi-way Segmented Toggle with animated sliding pill background.
 */
@Composable
fun SpiritualSegmentedToggle(
    options: List<String>,
    selectedIndex: Int,
    onOptionSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    icons: List<ImageVector?> = emptyList()
) {
    Surface(
        shape = RoundedCornerShape(10.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(3.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            options.forEachIndexed { index, title ->
                val isSelected = selectedIndex == index
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent,
                    border = if (isSelected) BorderStroke(1.dp, SpiritualGold.copy(alpha = 0.7f)) else null,
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onOptionSelected(index) }
                ) {
                    Row(
                        modifier = Modifier.padding(vertical = 6.dp, horizontal = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        if (icons.size > index && icons[index] != null) {
                            Icon(
                                imageVector = icons[index]!!,
                                contentDescription = null,
                                tint = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                        }
                        Text(
                            text = title,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface,
                            textAlign = TextAlign.Center,
                            maxLines = 1
                        )
                    }
                }
            }
        }
    }
}

// ==========================================
// 3. SPIRITUAL 3D CARD FLIPPER
// ==========================================
/**
 * 3D Interactive Card Flipper with smooth 180-degree animated rotation.
 * Flips between Front view (Summary) and Back view (Procedures/Lineage Details).
 */
@Composable
fun SpiritualCardFlipper(
    isFlipped: Boolean,
    onFlip: () -> Unit,
    frontContent: @Composable () -> Unit,
    backContent: @Composable () -> Unit,
    modifier: Modifier = Modifier
) {
    val rotation by animateFloatAsState(
        targetValue = if (isFlipped) 180f else 0f,
        animationSpec = tween(durationMillis = 400),
        label = "cardFlipRotation"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .graphicsLayer {
                rotationY = rotation
                cameraDistance = 12f * density
            }
            .clickable { onFlip() }
    ) {
        if (rotation <= 90f) {
            Box(modifier = Modifier.fillMaxWidth()) {
                frontContent()
            }
        } else {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .graphicsLayer { rotationY = 180f }
            ) {
                backContent()
            }
        }
    }
}

/**
 * Self-managed internal state overload for SpiritualCardFlipper.
 */
@Composable
fun SpiritualCardFlipper(
    modifier: Modifier = Modifier,
    frontContent: @Composable () -> Unit,
    backContent: @Composable () -> Unit
) {
    var isFlipped by remember { mutableStateOf(false) }
    SpiritualCardFlipper(
        isFlipped = isFlipped,
        onFlip = { isFlipped = !isFlipped },
        frontContent = frontContent,
        backContent = backContent,
        modifier = modifier
    )
}

// ==========================================
// 4. SPIRITUAL DROPDOWN LIST BOX (WITH DETAILS)
// ==========================================
/**
 * Dropdown List Box with category chips, descriptions, and item selection.
 */
data class DropdownOptionItem(
    val id: String,
    val title: String,
    val subtitle: String? = null,
    val icon: ImageVector? = null,
    val badge: String? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpiritualDropdownListBox(
    label: String,
    options: List<DropdownOptionItem>,
    selectedId: String,
    onOptionSelected: (DropdownOptionItem) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Select an option..."
) {
    var isExpanded by remember { mutableStateOf(false) }
    val selectedOption = options.firstOrNull { it.id == selectedId }

    ExposedDropdownMenuBox(
        expanded = isExpanded,
        onExpandedChange = { isExpanded = !isExpanded },
        modifier = modifier.fillMaxWidth()
    ) {
        OutlinedTextField(
            value = selectedOption?.title ?: "",
            onValueChange = {},
            readOnly = true,
            label = { Text(label, fontSize = 11.sp) },
            placeholder = { Text(placeholder, fontSize = 11.sp) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = isExpanded) },
            leadingIcon = selectedOption?.icon?.let {
                { Icon(it, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(18.dp)) }
            },
            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(),
            modifier = Modifier
                .menuAnchor()
                .fillMaxWidth(),
            shape = RoundedCornerShape(10.dp)
        )

        ExposedDropdownMenu(
            expanded = isExpanded,
            onDismissRequest = { isExpanded = false },
            modifier = Modifier
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
        ) {
            options.forEach { item ->
                DropdownMenuItem(
                    text = {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(item.title, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                if (item.badge != null) {
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = SpiritualTeal.copy(alpha = 0.2f)
                                    ) {
                                        Text(
                                            text = item.badge,
                                            fontSize = 8.sp,
                                            color = SpiritualTeal,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                        )
                                    }
                                }
                            }
                            if (item.subtitle != null) {
                                Text(
                                    text = item.subtitle,
                                    fontSize = 10.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    },
                    leadingIcon = item.icon?.let {
                        { Icon(it, contentDescription = null, tint = SpiritualGold, modifier = Modifier.size(16.dp)) }
                    },
                    onClick = {
                        onOptionSelected(item)
                        isExpanded = false
                    },
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                )
            }
        }
    }
}

// ==========================================
// 5. SPIRITUAL VALIDATED TEXT FIELD (WITH SPEECH-TO-TEXT)
// ==========================================
/**
 * Text Box with live validation rules, error message banner, character counter, and mic launcher.
 */
@Composable
fun SpiritualValidatedTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    isRequired: Boolean = false,
    minCharacters: Int = 0,
    maxCharacters: Int? = null,
    validationRegex: String? = null,
    errorMessage: String? = null,
    enableSpeechToText: Boolean = true,
    singleLine: Boolean = false,
    minLines: Int = 1,
    maxLines: Int = 4
) {
    val context = LocalContext.current
    var isDirty by remember { mutableStateOf(false) }

    // Speech-to-Text Activity Launcher
    val speechLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val spokenText = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()
            if (!spokenText.isNullOrBlank()) {
                val combined = if (value.isBlank()) spokenText else "$value $spokenText"
                onValueChange(combined)
                isDirty = true
                Toast.makeText(context, "Voice input recognized", Toast.LENGTH_SHORT).show()
            }
        }
    }

    // Validation Check
    val hasError = remember(value, isDirty, isRequired, minCharacters, validationRegex) {
        if (!isDirty) false
        else if (isRequired && value.isBlank()) true
        else if (value.length < minCharacters) true
        else if (validationRegex != null && !Regex(validationRegex).matches(value)) true
        else false
    }

    val computedErrorText = remember(hasError, value, isRequired, minCharacters, errorMessage) {
        if (!hasError) null
        else if (errorMessage != null) errorMessage
        else if (isRequired && value.isBlank()) "$label is required."
        else if (value.length < minCharacters) "Must be at least $minCharacters characters."
        else "Invalid format."
    }

    Column(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = {
                if (maxCharacters == null || it.length <= maxCharacters) {
                    onValueChange(it)
                    isDirty = true
                }
            },
            label = { Text(if (isRequired) "$label *" else label, fontSize = 11.sp) },
            placeholder = { Text(placeholder, fontSize = 11.sp) },
            isError = hasError,
            singleLine = singleLine,
            minLines = minLines,
            maxLines = maxLines,
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth(),
            trailingIcon = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (value.isNotBlank()) {
                        IconButton(
                            onClick = {
                                onValueChange("")
                                isDirty = true
                            },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(Icons.Default.Close, contentDescription = "Clear", modifier = Modifier.size(15.dp))
                        }
                    }
                    if (enableSpeechToText) {
                        IconButton(
                            onClick = {
                                try {
                                    val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                                        putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                                        putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
                                        putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak $label...")
                                    }
                                    speechLauncher.launch(intent)
                                } catch (e: Exception) {
                                    Toast.makeText(context, "Speech recognizer not supported on this device", Toast.LENGTH_SHORT).show()
                                }
                            },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(Icons.Default.Mic, contentDescription = "Speech to Text", tint = SpiritualGold, modifier = Modifier.size(17.dp))
                        }
                    }
                }
            }
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 4.dp, vertical = 2.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            if (hasError && computedErrorText != null) {
                Text(
                    text = computedErrorText,
                    color = MaterialTheme.colorScheme.error,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold
                )
            } else {
                Spacer(modifier = Modifier.width(1.dp))
            }

            if (maxCharacters != null) {
                Text(
                    text = "${value.length}/$maxCharacters",
                    color = if (value.length >= maxCharacters) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 9.sp
                )
            }
        }
    }
}

// ==========================================
// 6. SPIRITUAL MULTI-OPTION DIALOG BOX
// ==========================================
/**
 * Modal Dialog Box supporting multi-selection checkboxes, radio options, and action buttons.
 */
data class DialogOptionChoice(
    val id: String,
    val title: String,
    val description: String? = null,
    val isSelected: Boolean = false
)

@Composable
fun SpiritualMultiOptionDialog(
    title: String,
    subtitle: String? = null,
    options: List<DialogOptionChoice>,
    isMultiSelect: Boolean = true,
    onDismiss: () -> Unit,
    onConfirm: (List<String>) -> Unit,
    confirmLabel: String = "Apply Selection"
) {
    var selectedIds by remember(options) {
        mutableStateOf(options.filter { it.isSelected }.map { it.id }.toSet())
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                if (subtitle != null) {
                    Text(subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 350.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    items(options, key = { it.id }) { option ->
                        val isChecked = selectedIds.contains(option.id)
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isChecked) SpiritualGold.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            border = BorderStroke(1.dp, if (isChecked) SpiritualGold else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    selectedIds = if (isMultiSelect) {
                                        if (isChecked) selectedIds - option.id else selectedIds + option.id
                                    } else {
                                        setOf(option.id)
                                    }
                                }
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                if (isMultiSelect) {
                                    Checkbox(
                                        checked = isChecked,
                                        onCheckedChange = { checked ->
                                            selectedIds = if (checked) selectedIds + option.id else selectedIds - option.id
                                        },
                                        colors = CheckboxDefaults.colors(checkedColor = SpiritualGold)
                                    )
                                } else {
                                    RadioButton(
                                        selected = isChecked,
                                        onClick = { selectedIds = setOf(option.id) },
                                        colors = RadioButtonDefaults.colors(selectedColor = SpiritualGold)
                                    )
                                }
                                Spacer(modifier = Modifier.width(6.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(option.title, fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
                                    if (option.description != null) {
                                        Text(option.description, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onConfirm(selectedIds.toList()) },
                colors = ButtonDefaults.buttonColors(containerColor = SpiritualGold),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(confirmLabel, color = MaterialTheme.colorScheme.scrim, fontWeight = FontWeight.Bold, fontSize = 11.sp)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", fontSize = 11.sp)
            }
        }
    )
}

// ==========================================
// 7. SPIRITUAL SLIDE-IN / SLIDE-OUT NOTIFICATIONS HOST (BOTTOM-RIGHT / BOTTOM)
// ==========================================
/**
 * Global Host overlay for animated Slide-In and Slide-Out notifications.
 * Renders notifications floating at the bottom right/bottom with priority status badges and action triggers.
 */
@Composable
fun SpiritualSlideNotificationHost(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val notifications by NotificationRepository.notifications.collectAsState()

    Box(modifier = modifier.fillMaxSize()) {
        // Main Screen Content
        content()

        // Notification Floating Stack Layer
        Column(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(bottom = 72.dp, end = 12.dp, start = 12.dp)
                .widthIn(max = 360.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            notifications.forEach { notif ->
                AnimatedVisibility(
                    visible = true,
                    enter = slideInHorizontally(initialOffsetX = { it }) + fadeIn(),
                    exit = slideOutHorizontally(targetOffsetX = { it }) + fadeOut()
                ) {
                    SpiritualToastNotificationItem(
                        notification = notif,
                        onDismiss = { NotificationRepository.dismissNotification(notif.id) }
                    )
                }
            }
        }
    }
}

/**
 * Single Toast Notification Card with glassmorphism, priority color accent, and action buttons.
 */
@Composable
fun SpiritualToastNotificationItem(
    notification: AppNotification,
    onDismiss: () -> Unit
) {
    val accentColor = Color(notification.type.badgeColorHex)

    Surface(
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surface.copy(alpha = 0.95f),
        border = BorderStroke(1.dp, accentColor.copy(alpha = 0.7f)),
        shadowElevation = 6.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Priority Indicator Strip
            Box(
                modifier = Modifier
                    .size(width = 4.dp, height = 36.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(accentColor)
            )

            Spacer(modifier = Modifier.width(10.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = notification.title,
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, fontSize = 12.sp),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = notification.timestamp,
                        fontSize = 8.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = notification.message,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 10.sp,
                    lineHeight = 14.sp
                )

                if (notification.actionLabel != null && notification.onAction != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    TextButton(
                        onClick = {
                            notification.onAction.invoke()
                            onDismiss()
                        },
                        contentPadding = PaddingValues(0.dp),
                        modifier = Modifier.height(24.dp)
                    ) {
                        Text(
                            text = notification.actionLabel,
                            color = accentColor,
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        )
                    }
                }
            }

            IconButton(
                onClick = onDismiss,
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Dismiss",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(14.dp)
                )
            }
        }
    }
}

// ==========================================
// 8. SPIRITUAL UNIVERSAL INPUT BOX (CHAT / MEMO / FEEDBACK / HOUSE CLEAN)
// ==========================================
/**
 * Universal text input & memo component with clean standard theme (no multi-color background).
 * Features:
 * - Multi-line text field
 * - Right-bottom quick actions: Keyboard toggle, Mic (Speech-to-Text), and Submit icon
 * - Automatically attaches a formatted date-time stamp when submitted: onSubmit(text, timestamp)
 */
@Composable
fun SpiritualUniversalInputBox(
    value: String,
    onValueChange: (String) -> Unit,
    onSubmit: (text: String, timestamp: String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Type memo, feedback, or update...",
    label: String? = null,
    minLines: Int = 2,
    maxLines: Int = 5,
    speechPrompt: String = "Speak clearly to dictate memo or message...",
    submitButtonLabel: String? = null,
    enabled: Boolean = true
) {
    val context = LocalContext.current
    val speechLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val spokenText = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()
            if (!spokenText.isNullOrBlank()) {
                val updated = if (value.isBlank()) spokenText else "$value $spokenText"
                onValueChange(updated)
            }
        }
    }

    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(10.dp)
        ) {
            if (label != null) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
            }

            OutlinedTextField(
                value = value,
                onValueChange = onValueChange,
                placeholder = {
                    Text(
                        text = placeholder,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .defaultMinSize(minHeight = (minLines * 22).dp),
                minLines = minLines,
                maxLines = maxLines,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.6f),
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface
                ),
                shape = RoundedCornerShape(8.dp),
                enabled = enabled
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Right-bottom Toolbar: Keyboard hint, Mic (Speech-to-Text), Submit
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                val currentTimestamp = remember(value) {
                    java.text.SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(java.util.Date())
                }

                Text(
                    text = "🕒 $currentTimestamp",
                    fontSize = 9.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // Speech-to-Text Internal Device Mic Button
                    FilledTonalIconButton(
                        onClick = {
                            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                                putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
                                putExtra(RecognizerIntent.EXTRA_PROMPT, speechPrompt)
                            }
                            try {
                                speechLauncher.launch(intent)
                            } catch (_: Exception) {
                                Toast.makeText(context, "Please use your keyboard voice mic", Toast.LENGTH_SHORT).show()
                            }
                        },
                        modifier = Modifier.size(32.dp),
                        shape = RoundedCornerShape(8.dp),
                        enabled = enabled
                    ) {
                        Icon(
                            imageVector = Icons.Default.Mic,
                            contentDescription = "Voice Input",
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }

                    // Submit Button with Date-Time Stamp
                    Button(
                        onClick = {
                            if (value.isNotBlank()) {
                                val ts = java.text.SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(java.util.Date())
                                onSubmit(value.trim(), ts)
                            }
                        },
                        enabled = enabled && value.isNotBlank(),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.height(32.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            disabledContainerColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Submit",
                            modifier = Modifier.size(13.dp),
                            tint = if (value.isNotBlank()) DivineWhite else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        if (submitButtonLabel != null) {
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = submitButtonLabel,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (value.isNotBlank()) DivineWhite else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Self-managed internal state overload for SpiritualUniversalInputBox.
 */
@Composable
fun SpiritualUniversalInputBox(
    modifier: Modifier = Modifier,
    initialText: String = "",
    placeholder: String = "Type memo, feedback, or update...",
    label: String? = null,
    minLines: Int = 2,
    maxLines: Int = 5,
    speechPrompt: String = "Speak clearly to dictate memo or message...",
    submitButtonLabel: String? = null,
    enabled: Boolean = true,
    onSend: (text: String, timestamp: String) -> Unit
) {
    var textState by remember(initialText) { mutableStateOf(initialText) }

    SpiritualUniversalInputBox(
        value = textState,
        onValueChange = { textState = it },
        onSubmit = { text, ts ->
            onSend(text, ts)
            textState = ""
        },
        modifier = modifier,
        placeholder = placeholder,
        label = label,
        minLines = minLines,
        maxLines = maxLines,
        speechPrompt = speechPrompt,
        submitButtonLabel = submitButtonLabel,
        enabled = enabled
    )
}

