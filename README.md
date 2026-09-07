# Spiritual Karim 🕊️✨
### Enterprise Multi-Tier Spiritual Lineage, Sadhana & House Clean Governance Platform

[![Android](https://img.shields.io/badge/Platform-Android%20Native%20(Jetpack%20Compose)-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/jDroid-X/SpritualKarim)
[![Web](https://img.shields.io/badge/Web%20Portal-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://jdroid-x.github.io/SpritualKarim/)
[![Kotlin](https://img.shields.io/badge/Language-Kotlin%202.0-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Database](https://img.shields.io/badge/Backend-Firebase%20Realtime%20DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Custom-blue?style=for-the-badge)](#)

---

## 📖 Product Overview

**Spiritual Karim** is a spiritual development and governance ecosystem designed to bridge ancient Vedic sadhana traditions with modern lineage networking technology. It combines a **Native Android Mobile Application** (built with Jetpack Compose) and an **Interactive Enterprise Web Portal** (`SpritualKarimWeb`) to manage seeker diagnostics, ancestral karmic purification, house cleansing regimens, and multi-tier mentor-seeker relationships.

---

## 🌟 Key Capabilities & Features

### 1. 👥 Multi-Tier Persona Management
- **Role Hierarchy**: Seamlessly supports 4 distinct persona portals:
  - 👑 **Master Guide / Admin (Level 1)**: Full operational control, network reassignments, sadhana curriculum approvals.
  - 🌿 **Healer (Level 2)**: Team leadership, seeker diagnostic evaluations, siddhi transmissions.
  - 🧘 **Trainee (Level 3-4)**: In-progress practice verification, daily sadhana logging, guidance notes.
  - 🌟 **Devotee / Seeker (Level 5+)**: House clean verification, 3-Diya remedies, mantra chanting logs.

### 2. 🌳 Spiderweb MLM Genealogy & Lineage Tree
- **Interactive Canvas**: Map-like pan & zoom visual tree displaying full 12+ member lineage structures across all generations.
- **Node Inspection**: 1-tap slide-out drawer displaying member identity, 16-digit reference code, sponsor upline, and active sadhana commitments.
- **Downline Tracking**: Calculates direct child branches and total organizational descendants in real time.

### 3. 🧹 3-Level House Clean Governance
- **Comprehensive Detox Tracking**: Multi-stage home and perimeter cleansing logs with image uploads, room-by-room status, and percentage completion.
- **Mentor Approvals**: 2-way verification flow where assigned mentors inspect and certify household energetic purity.

### 4. 🕉️ Sacred Sadhana & Remedy Upaya Catalog
- **Curated Practices**: Step-by-step rituals including *Sri Yantra Sadhana*, *Kalashtami Kaal Bhairav Sadhana*, *Navratri Chamunda Anushthan*, *3-Diya Process*, and *Clove/Cardamom Legal Relief Havan*.
- **Mantra Audio & Counts**: Built-in japa counters, sacred switch words, and audio player integration.

### 5. 💬 Real-Time Lineage Messaging & Device Pairing
- **16-Digit Code Pairing**: Safe 24-hour peer-to-peer device pairing via unique cryptographic reference codes (e.g., `SKHM-ADM1-7788-9900`).
- **Telegram & WhatsApp Bot Sync**: Automated webhook bridges to synchronize member task queues and broadcast daily spiritual guidance notices.

### 6. 🔒 Enterprise Security & Offline-First Reliability
- **Offline Sync Queue**: Automatically caches transactions, house clean submissions, and profile updates when offline, syncing seamlessly upon reconnection.
- **Security Protections**: Root detection, mock GPS prevention, developer mode alerts, and encrypted token storage.

---

## 📂 Repository & Project Structure

```text
SpritualKarim/
├── app/                                # Native Android Application
│   ├── src/main/java/com/jdroidx/spritualkarim/
│   │   ├── data/
│   │   │   ├── manager/                # Settings & Language Managers
│   │   │   ├── model/                  # Data Models (Healer, Lineage, Sadhana, HouseClean)
│   │   │   └── repository/             # Repositories (Firebase, UserHub, SyncQueue, etc.)
│   │   ├── navigation/                 # Jetpack Compose Navigation Graph & Routes
│   │   ├── ui/
│   │   │   ├── components/             # Reusable UI Cards, Genealogy Canvas, Drawers
│   │   │   ├── screens/                # UserHub, Healers, Sadhana, Remedy, Settings Screens
│   │   │   └── theme/                  # Typography, Colors (Gold, Teal, Crimson), Styles
│   │   └── utils/                      # Device Security, Intent Helpers
│   └── build.gradle.kts                # Android App Build Config
│
├── SpritualKarimWeb/                   # Enterprise Web Portal
│   ├── Devotee/                        # Seeker / Devotee Sub-Portal
│   ├── Healers/                        # Healer Management Sub-Portal
│   ├── Masters/                        # Founder & Admin Governance Portal
│   ├── css/                            # Custom Theming & Responsive Layouts
│   ├── js/                             # MVC Controllers, Tree Canvas, Realtime Sync
│   ├── GOLI_GYAN_FOR_SEEKERS.html      # Comprehensive Seeker Knowledge Base
│   ├── index.html                      # Main Web Portal Entry Point
│   ├── database.rules.json             # Firebase Realtime Database Security Rules
│   ├── server.js                       # Local Development Server
│   └── sync_all.js                     # Multi-Portal Asset & Component Synchronizer
│
├── apk/                                # Compiled Android Releases
│   └── release/                        # Production Signed / Release APKs
│
├── gradle/                             # Gradle Wrapper & Version Catalogs
├── build.gradle.kts                    # Root Project Build Script
├── settings.gradle.kts                 # Project Settings
└── index.html                          # Root Web Redirector for GitHub Pages
```

---

## 🚀 Installation & Build Instructions

### Prerequisites
- **Android Studio**: Ladybug (2024.2.1) or newer
- **JDK**: Java Development Kit 17 or 21
- **Android SDK**: API Level 34 (Android 14) / Min SDK 24 (Android 7.0)
- **Node.js** *(Optional for local web hosting)*: v18.0 or higher

---

### Building the Native Android App

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jDroid-X/SpritualKarim.git
   cd SpritualKarim
   ```

2. **Open in Android Studio**:
   - Launch Android Studio and choose **Open Project**.
   - Select the `SpritualKarim` root directory and allow Gradle to sync.

3. **Build via Command Line**:
   - **Debug Build**:
     ```bash
     ./gradlew assembleDebug
     ```
   - **Release Build**:
     ```bash
     ./gradlew assembleRelease
     ```
   - Compiled APKs will be output to `app/build/outputs/apk/`.

4. **Run on Device or Emulator**:
   ```bash
   ./gradlew installDebug
   ```

---

### Running the Web Portal Locally

1. **Navigate to the Web Directory**:
   ```bash
   cd SpritualKarimWeb
   ```

2. **Launch with Node.js Server**:
   ```bash
   node server.js
   ```
   *The portal will be accessible locally at `http://localhost:3000`.*

3. **Or Open Directly**:
   - Double-click `index.html` in your web browser to test offline client capabilities.

---

## 🛡️ Security & Realtime Database Configuration

The application is backed by Firebase Realtime Database with role-based security rules defined in [`SpritualKarimWeb/database.rules.json`](SpritualKarimWeb/database.rules.json):

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null",
    "profiles": {
      "$profileId": {
        ".validate": "newData.hasChildren(['referenceCode', 'profileType'])"
      }
    }
  }
}
```

---

## 🤝 Contribution & Governance

- Follow the **OOPS-based MVC / MVVM** architecture standard.
- Avoid duplicate logic: shared components reside in `ui/components/` (Android) and `js/profile-admin.js` (Web).
- All PRs must pass `./gradlew compileDebugKotlin` verification.

---

## 📄 License & Contact

Developed with divine dedication for the **Spiritual Karim Organization**.  
For inquiries, guidance, or portal access:  
🌐 **Website**: [SpiritualKarim.com](https://spiritualkarim.com)  
📱 **Telegram**: `@SpiritualKarimBot`  
📍 **Spiritual Kendra Network**
