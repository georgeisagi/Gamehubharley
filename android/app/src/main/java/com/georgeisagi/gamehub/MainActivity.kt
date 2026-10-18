package com.georgeisagi.gamehub

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
        // Habilita preenchimento de borda a borda (Edge-to-Edge) cobrindo toda a tela do celular
        enableEdgeToEdge()
        setContent {
            GameHubTheme {
                // Tela branca pura (#FFFFFF) que preenche 100% da área da tela
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFFFFFFFF))
                )
            }
        }
    }
}
