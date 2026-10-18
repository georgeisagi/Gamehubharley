# GameHub

[![Build & Release GameHub APK](https://github.com/georgeisagi/GameHub/actions/workflows/build-apk.yml/badge.svg)](https://github.com/georgeisagi/GameHub/actions/workflows/build-apk.yml)

Aplicativo Android Nativo (Kotlin & Jetpack Compose) e Progressive Web App (PWA) de alto desempenho.

## 📱 Download Direto do APK Nativo
- **[Baixar GameHub.apk (v1.0.0)](./public/GameHub.apk)**
- **Identificador do Aplicativo:** `com.georgeisagi.gamehub`
- **Tamanho:** ~8.4 KB
- **Assinatura:** RSA 2048-bit (esquemas v1, v2 e v3 verificados)

---

## 🎯 Características da Versão 1.0.0
- **Tela:** 100% branca pura (`#FFFFFF`), preenchendo toda a tela do celular (Edge-to-Edge).
- **Sem distrações:** Zero botões, sem textos, sem menus, sem imagens e sem anúncios.
- **Offline First:** Não requer conexão com a internet nem criação de conta.
- **PWA Instalável:** Pode ser instalado no Android via Chrome (WebAPK) e iOS Safari.
- **Compatibilidade:** Android 5.0 (Lollipop) até Android 15+.

---

## 🚀 Como Enviar Este Projeto para o Seu GitHub

1. No terminal do seu computador, configure seu repositório:
```bash
git init
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/GameHub.git
git add .
git commit -m "feat: GameHub v1.0.0 - Android Nativo & PWA com tela branca pura"
git push -u origin main
```

2. Para gerar uma release oficial com o APK no GitHub:
```bash
git tag v1.0.0
git push origin v1.0.0
```
O workflow do **GitHub Actions** (`.github/workflows/build-apk.yml`) compilará e anexará automaticamente o arquivo **GameHub.apk** na aba **Releases** do seu GitHub!

---

## 💻 Estrutura do Projeto
- `android/`: Projeto completo Kotlin + Jetpack Compose para o Android Studio.
- `public/GameHub.apk`: APK compilado e pronto para download.
- `.github/workflows/build-apk.yml`: Pipeline CI/CD para compilar e gerar releases automáticas no GitHub.
- `src/`: Aplicação web e PWA com Service Worker offline e botão de instalação.
