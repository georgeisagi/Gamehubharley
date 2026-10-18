# GameHub (Android Nativo - Kotlin & Jetpack Compose)

## Identificador do Pacote:
`com.georgeisagi.gamehub`

## Versão:
`1.0.0` (Código de versão: `1`)

---

## 🎯 Objetivo Desta Versão:
Primeira versão funcional do aplicativo **GameHub**:
- **Tela**: 100% branca pura (`#FFFFFF`), ocupando toda a área útil do dispositivo (Edge-to-Edge).
- **Interface**: Sem botões, sem textos, sem menus, sem imagens e sem animações.
- **Conectividade**: Totalmente autônomo e offline; não requer login, autenticação nem conexão com a internet.
- **Arquitetura**: Estrutura simples, moderna e modular com Jetpack Compose (Kotlin 2.0 + Material3), pronta para expansão nas próximas versões.
- **Identificador Fixo**: `com.georgeisagi.gamehub` mantido no `build.gradle.kts` e `AndroidManifest.xml` para permitir atualizações compatíveis sem desinstalar o app.

---

## 🚀 Como Compilar o Arquivo APK Instalável (.apk)

### Método 1: Pelo Android Studio (Mais Fácil e Recomendado)
1. Baixe o arquivo ZIP do projeto gerado pelo GameHub.
2. Extraia o arquivo ZIP em uma pasta do seu computador.
3. Abra o **Android Studio** (versão Ladybug, Koala, Hedgehog ou superior).
4. Clique em **File > Open** (ou **Open Project**) e selecione a pasta do projeto GameHub extraída.
5. Aguarde o Android Studio realizar a sincronização automática do Gradle (pode demorar de 1 a 2 minutos no primeiro download de dependências).
6. No menu superior, clique em:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**
7. Quando a compilação terminar, uma notificação aparecerá no canto inferior direito dizendo *"APK(s) generated successfully"*.
8. Clique no link **locate** na notificação (ou acesse a pasta `app/build/outputs/apk/debug/app-debug.apk`).
9. Transfira o arquivo `app-debug.apk` para o seu celular Android (via cabo USB, Google Drive, Telegram, WhatsApp) e clique nele para instalar!

### Método 2: Pelo Terminal / Linha de Comando (Sem Interface Gráfica)
No diretório raiz do projeto extraído:
- No **Linux / macOS**:
  ```bash
  chmod +x gradlew
  ./gradlew assembleDebug
  ```
- No **Windows**:
  ```cmd
  gradlew.bat assembleDebug
  ```
O arquivo APK compilado estará pronto em:
`app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Estrutura do Código:
- `app/src/main/java/com/georgeisagi/gamehub/MainActivity.kt`: Atividade principal em Jetpack Compose com container `Box` cobrindo 100% da tela em `#FFFFFF`.
- `app/src/main/java/com/georgeisagi/gamehub/ui/theme/`: Definições de tema e cores em Material 3.
- `app/src/main/AndroidManifest.xml`: Manifesto Android configurado com o identificador `com.georgeisagi.gamehub`.
- `app/build.gradle.kts`: Configuração de compilação SDK 35, MinSdk 24 (compatível com praticamente todos os celulares Android modernos).
