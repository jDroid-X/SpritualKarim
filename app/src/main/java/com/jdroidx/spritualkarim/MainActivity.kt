package com.jdroidx.spritualkarim

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.jdroidx.spritualkarim.ui.MainScaffold
import com.jdroidx.spritualkarim.ui.theme.SpritualKarimTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SpritualKarimTheme {
                MainScaffold()
            }
        }
    }
}
