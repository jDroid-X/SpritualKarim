package com.jdroidx.spritualkarim.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jdroidx.spritualkarim.R
import com.jdroidx.spritualkarim.data.repository.SpiritualContentRepository
import com.jdroidx.spritualkarim.ui.theme.*
import com.jdroidx.spritualkarim.utils.IntentHelper

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpiritualTopAppBar(
    title: String,
    onOpenDrawer: () -> Unit,
    canNavigateBack: Boolean = false,
    onNavigateBack: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    TopAppBar(
        modifier = modifier,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Image(
                    painter = painterResource(id = R.drawable.logo_spiritual_karim),
                    contentDescription = "Logo",
                    modifier = Modifier
                        .height(30.dp)
                        .padding(end = 8.dp)
                )
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    ),
                    color = SpiritualGold,
                    maxLines = 1
                )
            }
        },
        navigationIcon = {
            if (canNavigateBack) {
                IconButton(onClick = onNavigateBack) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Navigate Back",
                        tint = SpiritualGold
                    )
                }
            } else {
                IconButton(onClick = onOpenDrawer) {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "Open Navigation Menu",
                        tint = SpiritualGold
                    )
                }
            }
        },
        actions = {
            IconButton(
                onClick = { IntentHelper.dialPhoneNumber(context, SpiritualContentRepository.HELPLINE_PHONE) }
            ) {
                Icon(
                    imageVector = Icons.Default.Call,
                    contentDescription = "Helpline",
                    tint = SpiritualGold
                )
            }
            IconButton(
                onClick = { IntentHelper.openUrl(context, SpiritualContentRepository.TELEGRAM_CHANNEL) }
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Send,
                    contentDescription = "Telegram",
                    tint = SpiritualGold
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background,
            titleContentColor = MaterialTheme.colorScheme.primary,
            navigationIconContentColor = MaterialTheme.colorScheme.primary,
            actionIconContentColor = MaterialTheme.colorScheme.primary
        )
    )
}
