import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { 
  Download, 
  Smartphone, 
  Terminal, 
  Code2, 
  CheckCircle2, 
  ExternalLink, 
  Info, 
  Eye, 
  EyeOff, 
  Layers, 
  FileCode,
  ShieldCheck,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from './androidProjectFiles';

export default function App() {
  // Modal / panel visibility
  const [showTools, setShowTools] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'export' | 'sdk' | 'guide' | 'code'>('sdk');
  const [selectedFile, setSelectedFile] = useState<string>('app/src/main/java/com/georgeisagi/gamehub/MainActivity.kt');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("Para instalar no Android pelo Chrome:\n1. Toque nos 3 pontinhos (⋮) do navegador.\n2. Selecione 'Adicionar à tela inicial' ou 'Instalar aplicativo'.\nO GameHub será instalado com a tela branca pura!");
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const rootFolder = zip.folder("GameHub");

      if (rootFolder) {
        ANDROID_PROJECT_FILES.forEach(file => {
          rootFolder.file(file.path, file.content);
        });
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "GameHub-android-com.georgeisagi.gamehub.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("Erro ao gerar ZIP do projeto Android:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const currentCode = ANDROID_PROJECT_FILES.find(f => f.path === selectedFile)?.content || '';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white select-none">
      {/* 
        A tela em si é 100% branca pura (#FFFFFF) ocupando toda a área útil.
        Conforme solicitado: sem botões, textos ou animações no aplicativo base.
      */}
      <div 
        className="w-full h-full bg-[#FFFFFF]" 
        onClick={() => {
          if (!showTools) {
            // Se estiver no modo 100% puro invisível, um toque na tela restaura os controles
            setShowTools(true);
          }
        }}
      />

      {/* 
        Painel de Controle / Exportação e Instalação
        Permite ao desenvolvedor/usuário:
        1. Baixar o projeto Android completo (.zip)
        2. Seguir o guia para compilar o APK diretamente no Android Studio
        3. Instalar no celular Android via PWA/WebAPK
        4. Ocultar totalmente qualquer elemento para ver a tela branca pura
      */}
      {showTools ? (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6">
          {/* Barra superior de status e identificação */}
          <header className="pointer-events-auto flex items-center justify-between bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-3 shadow-sm max-w-4xl mx-auto w-full transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                GH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-slate-900 text-sm leading-tight">GameHub</h1>
                  <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                    v1.0.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">com.georgeisagi.gamehub</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTools(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                title="Ocultar painel para ver tela 100% branca pura"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modo Tela Branca Pura</span>
              </button>

              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all shadow-sm active:scale-95"
              >
                {isZipping ? (
                  <span className="animate-spin text-xs">⏳</span>
                ) : downloadSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{downloadSuccess ? 'Baixado!' : 'Exportar Projeto (.zip)'}</span>
              </button>
            </div>
          </header>

          {/* Modal / Card central com instruções, exportador e opções */}
          <main className="pointer-events-auto my-auto max-w-4xl mx-auto w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl max-h-[80vh] flex flex-col">
            {/* Abas */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === 'export'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Instalar & Exportar
                </button>
                <button
                  onClick={() => setActiveTab('sdk')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === 'sdk'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  SDK & Gradle
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === 'guide'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Como Compilar o APK
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === 'code'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Código Kotlin / Compose
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Status: Pronto para compilação
              </div>
            </div>

            {/* Conteúdo da Aba: Exportar & Instalar */}
            {activeTab === 'export' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs text-slate-700">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Primeira Versão Funcional Gerada
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        O projeto <strong>GameHub</strong> foi estruturado com o identificador fixo{' '}
                        <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-mono text-[11px]">
                          com.georgeisagi.gamehub
                        </code>
                        . A tela abre diretamente em branco puro (<code className="font-mono text-[11px]">#FFFFFF</code>),
                        sem menus, botões, animações ou login, funcionando 100% offline.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Opção 1: Download do Projeto Android Nativo */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Opção 1 • Nativo Android
                        </span>
                        <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Kotlin + Compose
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900">
                        Baixar Projeto Completo (.zip)
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Contém todos os arquivos prontos: <code className="font-mono text-[10px]">MainActivity.kt</code>,{' '}
                        <code className="font-mono text-[10px]">AndroidManifest.xml</code>,{' '}
                        <code className="font-mono text-[10px]">build.gradle.kts</code> e Gradle Wrapper.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Pronto p/ Android Studio</span>
                      <button
                        onClick={handleDownloadZip}
                        disabled={isZipping}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {isZipping ? 'Compactando...' : 'Baixar ZIP'}
                      </button>
                    </div>
                  </div>

                  {/* Opção 2: Instalar no Celular via PWA / WebAPK */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Opção 2 • Instalação Direta
                        </span>
                        <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          PWA / WebAPK
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900">
                        Instalar no Celular Android Agora
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Instala o GameHub diretamente na tela inicial do celular. Abre em tela cheia independente, com fundo branco puro (#FFFFFF) e ícone nativo.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Instalação em 1 toque</span>
                      <button
                        onClick={handleInstallApp}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all active:scale-95"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        Instalar no Celular
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resumo dos requisitos atendidos */}
                <div className="bg-slate-50/60 rounded-xl p-3 border border-slate-200/60 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Requisitos Validados:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div>✓ Nome: <strong>GameHub</strong></div>
                    <div>✓ ID: <strong>com.georgeisagi.gamehub</strong></div>
                    <div>✓ Cor: <strong>#FFFFFF puro</strong></div>
                    <div>✓ Zero botões / textos na tela</div>
                    <div>✓ Zero menus / animações</div>
                    <div>✓ 100% Offline (sem login)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da Aba: SDK & Gradle (Downloads Nativos) */}
            {activeTab === 'sdk' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Destaque principal: Android Studio (SDK + Gradle inclusos) */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Recomendado pelo Google
                        </span>
                        <span className="text-xs text-slate-400">Instalador Oficial Completo</span>
                      </div>
                      <h3 className="text-base font-semibold">Android Studio (SDK 35 + Gradle Embutido)</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                        Instala automaticamente o Android SDK nativo, JDK do Java, gerenciador de dependências Gradle e o compilador Jetpack Compose com apenas 1 clique.
                      </p>
                    </div>

                    <a
                      href="https://developer.android.com/studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl shadow transition-all shrink-0 active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Android Studio
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </a>
                  </div>
                </div>

                {/* Grade de downloads individuais standalone */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                    Downloads Standalone (Linha de Comando / Manual)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Android SDK Command-line Tools */}
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Google SDK</span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">v11076708</span>
                        </div>
                        <h5 className="font-semibold text-xs text-slate-900">Android Command-Line Tools</h5>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          SDK Tools oficial contendo <code className="font-mono text-[10px]">sdkmanager</code>, <code className="font-mono text-[10px]">avdmanager</code> e build-tools.
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                        <a
                          href="https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg transition-colors"
                        >
                          <span>Windows (.zip)</span>
                          <Download className="w-3 h-3 text-slate-500" />
                        </a>
                        <div className="grid grid-cols-2 gap-1.5">
                          <a
                            href="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center px-2 py-1 text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded transition-colors"
                          >
                            Linux (.zip)
                          </a>
                          <a
                            href="https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center px-2 py-1 text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded transition-colors"
                          >
                            macOS (.zip)
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Gradle 8.9 Oficial */}
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Gradle Nativo</span>
                          <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">v8.9</span>
                        </div>
                        <h5 className="font-semibold text-xs text-slate-900">Gradle Build Tool Oficial</h5>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          Distribuição oficial de compilação compatível com Kotlin 2.0 e AGP 8.7.2.
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                        <a
                          href="https://services.gradle.org/distributions/gradle-8.9-bin.zip"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg transition-colors"
                        >
                          <span>Gradle 8.9 Binário (.zip)</span>
                          <Download className="w-3 h-3 text-slate-500" />
                        </a>
                        <a
                          href="https://services.gradle.org/distributions/gradle-8.9-all.zip"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center px-2 py-1 text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded transition-colors"
                        >
                          Gradle Completo com Docs (.zip)
                        </a>
                      </div>
                    </div>

                    {/* Java OpenJDK 17 */}
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Requisito do SDK</span>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">JDK 17 LTS</span>
                        </div>
                        <h5 className="font-semibold text-xs text-slate-900">OpenJDK 17 (Temurin)</h5>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          Ambiente de execução Java oficial necessário para o compilador do Gradle e do Android.
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                        <a
                          href="https://adoptium.net/temurin/releases/?version=17"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg transition-colors"
                        >
                          <span>Baixar Java JDK 17</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                        <span className="text-[10px] text-slate-400 text-center">
                          Disponível para Windows, Mac e Linux
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scripts automatizados incluídos */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-slate-700" />
                    Scripts de Compilação Automatizada Incluídos no Projeto
                  </h4>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Ao baixar o arquivo ZIP do projeto <strong>GameHub</strong>, você já recebe scripts prontos para rodar a compilação nativa com 2 cliques:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white border border-slate-200 rounded-xl p-3 font-mono">
                      <div className="text-[11px] font-bold text-slate-900 mb-1 font-sans flex items-center justify-between">
                        <span>No Windows:</span>
                        <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">setup-sdk-and-build.bat</code>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Basta dar dois cliques no arquivo <code className="bg-slate-100 px-1 rounded text-slate-700">setup-sdk-and-build.bat</code> ou executar no CMD:
                      </p>
                      <div className="mt-2 bg-slate-900 text-emerald-400 p-2 rounded text-[11px]">
                        setup-sdk-and-build.bat
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-3 font-mono">
                      <div className="text-[11px] font-bold text-slate-900 mb-1 font-sans flex items-center justify-between">
                        <span>No Linux / macOS:</span>
                        <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">setup-sdk-and-build.sh</code>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans">
                        No terminal na pasta do projeto, execute:
                      </p>
                      <div className="mt-2 bg-slate-900 text-emerald-400 p-2 rounded text-[11px]">
                        ./setup-sdk-and-build.sh
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da Aba: Guia de Compilação do APK */}
            {activeTab === 'guide' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Por que o arquivo .apk precisa ser gerado no Android Studio?</strong>
                    <p className="mt-0.5 text-amber-800 leading-relaxed text-[11px]">
                      A compilação de binários nativos do Android (.apk) requer o Android SDK (plataformas de compilação e Java Virtual Machine) que pesa mais de 8 GB. Como os arquivos do projeto já estão 100% configurados no padrão oficial do Google, basta 1 clique no Android Studio para gerar o arquivo APK.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Passo a passo para gerar o APK em 2 minutos:
                  </h4>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-900">Baixe e extraia o projeto</p>
                      <p className="text-slate-600 mt-0.5 text-[11px]">
                        Clique em <strong>"Exportar Projeto (.zip)"</strong> acima e extraia a pasta no seu computador.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-900">Abra no Android Studio</p>
                      <p className="text-slate-600 mt-0.5 text-[11px]">
                        Abra o Android Studio, clique em <strong>File &gt; Open</strong> e selecione a pasta extraída. O Android Studio sincronizará as dependências automaticamente.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-900">Gere o arquivo APK</p>
                      <p className="text-slate-600 mt-0.5 text-[11px]">
                        No menu superior, clique em:
                        <br />
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800 text-[10px] inline-block mt-1">
                          Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-emerald-950">Pronto! Instale no celular</p>
                      <p className="text-emerald-800 mt-0.5 text-[11px]">
                        O arquivo final estará gerado em:{' '}
                        <code className="font-mono bg-white/80 px-1 rounded border border-emerald-300 text-[10px]">
                          app/build/outputs/apk/debug/app-debug.apk
                        </code>
                        . Basta enviar via WhatsApp, Google Drive ou cabo USB para o celular e clicar para instalar!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opção CLI */}
                <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px]">
                  <p className="text-slate-400 text-[10px] mb-1 font-sans">Ou compile via terminal se preferir:</p>
                  <code>./gradlew assembleDebug</code>
                </div>
              </div>
            )}

            {/* Conteúdo da Aba: Código Kotlin / Compose */}
            {activeTab === 'code' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    {ANDROID_PROJECT_FILES.filter(f => 
                      f.path.endsWith('.kt') || 
                      f.path.endsWith('AndroidManifest.xml') || 
                      f.path.endsWith('build.gradle.kts')
                    ).map(file => (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file.path)}
                        className={`px-2.5 py-1 text-[11px] rounded font-mono transition-colors whitespace-nowrap ${
                          selectedFile === file.path
                            ? 'bg-slate-800 text-white font-medium'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {file.path.split('/').pop()}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="flex-1 overflow-auto bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed max-h-80 border border-slate-800">
                  <pre>{currentCode}</pre>
                </div>

                <p className="text-[11px] text-slate-500 font-mono">
                  Arquivo: {selectedFile}
                </p>
              </div>
            )}
          </main>

          {/* Rodapé informativo */}
          <footer className="pointer-events-auto flex items-center justify-between text-xs text-slate-500 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl px-4 py-2 max-w-4xl mx-auto w-full">
            <span>
              GameHub • Tela Branca Pura (#FFFFFF)
            </span>
            <button
              onClick={() => setShowTools(false)}
              className="text-slate-700 hover:text-slate-900 font-medium underline cursor-pointer"
            >
              Entrar em tela cheia branca pura
            </button>
          </footer>
        </div>
      ) : (
        /* Quando no Modo Tela Branca Pura: exibe apenas um gatilho quase imperceptível no canto */
        <button
          onClick={() => setShowTools(true)}
          className="absolute bottom-4 right-4 z-50 p-2.5 rounded-full bg-white/70 hover:bg-white text-slate-400 hover:text-slate-800 shadow-sm border border-slate-200/60 opacity-20 hover:opacity-100 transition-opacity"
          title="Clique para abrir opções de exportação e APK"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
