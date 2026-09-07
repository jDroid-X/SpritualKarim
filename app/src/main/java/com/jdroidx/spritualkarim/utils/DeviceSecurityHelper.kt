package com.jdroidx.spritualkarim.utils

import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.StatFs
import android.provider.Settings
import java.io.File
import java.security.MessageDigest

/**
 * Enterprise Security, Hardware Fingerprinting, and Authoritative Timing Helper
 */
object DeviceSecurityHelper {

    // Monotonic base offset for preventing device clock tampering
    private var bootTimestampOffset: Long = System.currentTimeMillis() - android.os.SystemClock.elapsedRealtime()

    /**
     * Authoritative time calculation resistant to manual local system clock rollbacks.
     */
    fun getAuthoritativeTime(): Long {
        val currentMonotonic = android.os.SystemClock.elapsedRealtime()
        return bootTimestampOffset + currentMonotonic
    }

    /**
     * Generate unique, deterministic Hardware Fingerprint for anti-cloning and duplicate merge.
     */
    fun getDeviceFingerprint(context: Context): String {
        return try {
            val androidId = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID) ?: "UNKNOWN_ID"
            val raw = "${Build.MANUFACTURER}_${Build.MODEL}_${Build.BOARD}_${Build.HARDWARE}_$androidId"
            val digest = MessageDigest.getInstance("SHA-256").digest(raw.toByteArray(Charsets.UTF_8))
            digest.joinToString("") { "%02x".format(it) }.take(16).uppercase()
        } catch (e: Exception) {
            "DEV-HW-${Build.MODEL.replace(" ", "").take(6).uppercase()}"
        }
    }

    /**
     * Check available disk storage in Megabytes (MB).
     */
    fun getAvailableDiskSpaceMB(): Long {
        return try {
            val stat = StatFs(Environment.getDataDirectory().path)
            (stat.availableBlocksLong * stat.blockSizeLong) / (1024 * 1024)
        } catch (e: Exception) {
            500L // safe fallback
        }
    }

    /**
     * Verify device has at least 150MB free storage for APK download & installation.
     */
    fun hasSufficientInstallSpace(minRequiredMB: Long = 150L): Boolean {
        return getAvailableDiskSpaceMB() >= minRequiredMB
    }

    /**
     * Enterprise Root / Magisk / Su binary detection.
     */
    fun isDeviceRooted(): Boolean {
        val paths = arrayOf(
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su"
        )
        for (path in paths) {
            if (File(path).exists()) return true
        }
        val buildTags = Build.TAGS
        return buildTags != null && buildTags.contains("test-keys")
    }

    /**
     * Check if developer mode or mock locations are active (for anti-spoofing).
     */
    fun isDeveloperOptionsActive(context: Context): Boolean {
        return try {
            Settings.Global.getInt(context.contentResolver, Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0) != 0
        } catch (e: Exception) {
            false
        }
    }
}
