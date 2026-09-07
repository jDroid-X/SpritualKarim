package com.jdroidx.spritualkarim.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast

object IntentHelper {

    fun dialPhoneNumber(context: Context, phoneNumber: String) {
        try {
            val intent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:$phoneNumber")
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "Could not open dialer: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }

    fun openUrl(context: Context, url: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "Could not open link: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }

    fun shareText(context: Context, text: String, title: String = "Share") {
        try {
            val sendIntent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_TEXT, text)
                type = "text/plain"
            }
            val shareIntent = Intent.createChooser(sendIntent, title)
            context.startActivity(shareIntent)
        } catch (e: Exception) {
            Toast.makeText(context, "Could not share: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }

    fun shareToWhatsApp(context: Context, text: String) {
        try {
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                setPackage("com.whatsapp")
                putExtra(Intent.EXTRA_TEXT, text)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            val webUrl = "https://api.whatsapp.com/send?text=${Uri.encode(text)}"
            openUrl(context, webUrl)
        }
    }

    fun shareToTelegram(context: Context, text: String) {
        try {
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                setPackage("org.telegram.messenger")
                putExtra(Intent.EXTRA_TEXT, text)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            val webUrl = "https://t.me/share/url?url=${Uri.encode("https://github.com/jiten/SpritualKarim/releases/latest/download/app-debug.apk")}&text=${Uri.encode(text)}"
            openUrl(context, webUrl)
        }
    }

    fun sendSms(context: Context, phoneNumber: String = "", text: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = if (phoneNumber.isNotBlank()) Uri.parse("sms:$phoneNumber") else Uri.parse("sms:")
                putExtra("sms_body", text)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            shareText(context, text, "Send SMS")
        }
    }
}
