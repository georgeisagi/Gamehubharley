@echo off
echo ====================================================
echo  GameHub - Compilador Nativo Android
echo  Identificador: com.georgeisagi.gamehub
echo ====================================================
echo.

java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Java JDK 17+ nao foi encontrado no seu PATH.
    echo Baixe o OpenJDK 17 em: https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
)

echo [INFO] Compilando APK via Gradle...
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo [SUCESSO] APK gerado com sucesso!
    echo Local: app\build\outputs\apk\debug\app-debug.apk
    echo ====================================================
) else (
    echo.
    echo [DICA] Caso falte o Android SDK, abra a pasta no Android Studio
    echo ou configure a variavel ANDROID_HOME.
)
pause
