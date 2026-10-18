/**
 * Android Project Files structure for GameHub (com.georgeisagi.gamehub)
 */

export interface AndroidFile {
  path: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: "settings.gradle.kts",
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "GameHub"
include(":app")
`
  },
  {
    path: "build.gradle.kts",
    content: `// Top-level build file
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
  },
  {
    path: "gradle/libs.versions.toml",
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`
  },
  {
    path: "gradle/wrapper/gradle-wrapper.properties",
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  },
  {
    path: "app/build.gradle.kts",
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.georgeisagi.gamehub"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.georgeisagi.gamehub"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)

    debugImplementation(libs.androidx.ui.tooling)
}
`
  },
  {
    path: "app/proguard-rules.pro",
    content: `# Add project specific ProGuard rules here.
`
  },
  {
    path: "app/src/main/AndroidManifest.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.GameHub">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.GameHub">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  },
  {
    path: "app/src/main/java/com/georgeisagi/gamehub/MainActivity.kt",
    content: `package com.georgeisagi.gamehub

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.georgeisagi.gamehub.ui.theme.GameHubTheme

/**
 * GameHub - Versão 1.0
 * Identificador: com.georgeisagi.gamehub
 * 
 * Requisito: Exibir uma tela branca pura (#FFFFFF) ocupando toda a área disponível.
 * Sem botões, textos, menus, imagens ou animações.
 * Sem exigir login ou conexão com a internet.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Habilita preenchimento total de borda a borda (Edge-to-Edge)
        enableEdgeToEdge()
        setContent {
            GameHubTheme {
                // Tela branca pura (#FFFFFF) cobrindo 100% da área útil do dispositivo
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFFFFFFFF))
                )
            }
        }
    }
}
`
  },
  {
    path: "app/src/main/java/com/georgeisagi/gamehub/ui/theme/Color.kt",
    content: `package com.georgeisagi.gamehub.ui.theme

import androidx.compose.ui.graphics.Color

val PureWhite = Color(0xFFFFFFFF)
val PureWhite80 = Color(0xFFFFFFFF)
val PureWhite40 = Color(0xFFFFFFFF)
`
  },
  {
    path: "app/src/main/java/com/georgeisagi/gamehub/ui/theme/Theme.kt",
    content: `package com.georgeisagi.gamehub.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = PureWhite,
    secondary = PureWhite,
    tertiary = PureWhite,
    background = PureWhite,
    surface = PureWhite,
    onPrimary = Color.Black,
    onSecondary = Color.Black,
    onTertiary = Color.Black,
    onBackground = Color.Black,
    onSurface = Color.Black
)

@Composable
fun GameHubTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
`
  },
  {
    path: "app/src/main/res/values/strings.xml",
    content: `<resources>
    <string name="app_name">GameHub</string>
</resources>
`
  },
  {
    path: "app/src/main/res/values/colors.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="white">#FFFFFFFF</color>
</resources>
`
  },
  {
    path: "app/src/main/res/values/themes.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.GameHub" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#FFFFFFFF</item>
        <item name="android:navigationBarColor">#FFFFFFFF</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
        <item name="android:windowBackground">@color/white</item>
    </style>
</resources>
`
  },
  {
    path: "app/src/main/res/drawable/ic_launcher_background.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`
  },
  {
    path: "app/src/main/res/drawable/ic_launcher_foreground.xml",
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#1E293B"
        android:pathData="M38,36h32c8.84,0 16,7.16 16,16v4c0,8.84 -7.16,16 -16,16h-32c-8.84,0 -16,-7.16 -16,-16v-4c0,-8.84 7.16,-16 16,-16z" />
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M36,54h6M39,51v6M69,54h4M65,54h.01"
        android:strokeColor="#FFFFFF"
        android:strokeWidth="2"
        android:strokeLineCap="round" />
</vector>
`
  },
  {
    path: "app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`
  },
  {
    path: "app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`
  },
  {
    path: "gradlew",
    content: `#!/bin/sh
exec java -version > /dev/null 2>&1 && gradle "$@" || ./gradlew "$@"
`
  },
  {
    path: "gradlew.bat",
    content: `@rem Gradle startup script for Windows
gradle %*
`
  },
  {
    path: "README.md",
    content: `# GameHub (Android Nativo - Kotlin & Jetpack Compose)

## Identificador:
com.georgeisagi.gamehub

## Versão:
1.0.0

## Como compilar o APK:
1. Abra esta pasta no Android Studio.
2. Menu: Build > Build Bundle(s) / APK(s) > Build APK(s).
3. O APK gerado estará em: app/build/outputs/apk/debug/app-debug.apk.
4. Transfira para o celular e instale!
`
  }
];
