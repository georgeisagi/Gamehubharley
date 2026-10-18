#!/usr/bin/env bash
set -e
echo "===================================================="
echo " GameHub - Compilador Nativo Android"
echo " Identificador: com.georgeisagi.gamehub"
echo "===================================================="

if ! command -v java &> /dev/null; then
    echo "[ERRO] Java JDK 17+ não encontrado."
    echo "Instale o OpenJDK 17:"
    echo "  Ubuntu/Debian: sudo apt install openjdk-17-jdk"
    echo "  macOS: brew install openjdk@17"
    exit 1
fi

chmod +x gradlew
./gradlew assembleDebug

echo ""
echo "===================================================="
echo "[SUCESSO] APK gerado em: app/build/outputs/apk/debug/app-debug.apk"
echo "===================================================="
