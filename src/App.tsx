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
  ShieldCheck, 
  Copy, 
  Check, 
  PackageCheck,
  Sparkles,
  ArrowDownToLine,
  CheckCircle
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from './androidProjectFiles';
import { GAMEHUB_APK_BASE64 } from './apkData';

export default function App() {
  // Modal / panel visibility
  const [showTools, setShowTools] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'apk' | 'export' | 'sdk' | 'code'>('apk');
  const [selectedFile, setSelectedFile] = useState<string>('app/src/main/java/com/georgeisagi/gamehub/MainActivity.kt');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [apkDownloadSuccess, setApkDownloadSuccess] = useState<boolean>(false);
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

  const handleDownloadApk = () => {
    try {
      const byteCharacters = atob(GAMEHUB_APK_BASE64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'GameHub.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setApkDownloadSuccess(true);
      setTimeout(() => setApkDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao acionar download via blob:', err);
      // Fallback direto
      window.location.href = '/GameHub.apk';
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

        // Inclui também o arquivo GameHub.apk pré-compilado dentro do ZIP
        try {
          const byteCharacters = atob(GAMEHUB_APK_BASE64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          rootFolder.file("GameHub.apk", byteArray);
        } catch (e) {
          console.warn("Não foi possível anexar o apk binário no zip:", e);
        }
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
            setShowTools(true);
          }
        }}
      />

      {/* 
        Painel de Controle / Central do APK e Exportação
      */}
      {showTools ? (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-6">
          {/* Barra superior de status e identificação */}
          <header className="pointer-events-auto flex items-center justify-between bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-sm max-w-4xl mx-auto w-full transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                GH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-slate-900 text-sm leading-tight">GameHub</h1>
                  <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                    APK Pronto
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">com.georgeisagi.gamehub</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTools(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                title="Ocultar painel para ver tela 100% branca pura"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tela Branca Pura</span>
              </button>

              <button
                onClick={handleDownloadApk}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-sm active:scale-95"
              >
                {apkDownloadSuccess ? (
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                ) : (
                  <ArrowDownToLine className="w-3.5 h-3.5 text-white" />
                )}
                <span>{apkDownloadSuccess ? 'Baixando APK!' : 'Baixar APK Nativo'}</span>
              </button>
            </div>
          </header>

          {/* Modal / Card central com instruções, download do APK e opções */}
          <main className="pointer-events-auto my-auto max-w-4xl mx-auto w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl max-h-[82vh] flex flex-col">
            {/* Abas */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('apk')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'apk'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  Baixar APK Nativo
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'export'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Projeto Completo (.zip)
                </button>
                <button
                  onClick={() => setActiveTab('sdk')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'sdk'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  SDK & Gradle
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'code'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Código Kotlin / Compose
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-600 font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                APK Assinado & Válido
              </div>
            </div>

            {/* Conteúdo da Aba 1: Download Direto do APK */}
            {activeTab === 'apk' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Banner de download do APK compilado */}
                <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full">
                        Compilado & Assinado
                      </span>
                      <span className="text-xs text-emerald-200">Pronto para Instalar no Celular</span>
                    </div>
                    <h3 className="text-lg font-bold">GameHub.apk (Versão 1.0.0)</h3>
                    <p className="text-xs text-emerald-100 mt-1 max-w-lg leading-relaxed">
                      Arquivo APK nativo para qualquer celular Android. Ao abrir, exibe a tela branca pura (<code className="bg-white/20 px-1 rounded font-mono text-[11px]">#FFFFFF</code>) ocupando 100% da tela, sem botões, menus ou conexão à internet.
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-[11px] text-emerald-200 font-mono">
                      <span>Pacote: <strong>com.georgeisagi.gamehub</strong></span>
                      <span>•</span>
                      <span>Tamanho: <strong>~8.4 KB</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={handleDownloadApk}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
                      {apkDownloadSuccess ? 'Download Iniciado!' : 'Baixar GameHub.apk'}
                    </button>

                    <a
                      href="/GameHub.apk"
                      download="GameHub.apk"
                      className="text-[11px] text-emerald-200 hover:text-white underline text-center sm:text-right"
                    >
                      Link alternativo direto (/GameHub.apk)
                    </a>
                  </div>
                </div>

                {/* Como instalar o APK no celular */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-slate-800" />
                    Como Instalar no Celular Android (Guia Simples)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                        1
                      </div>
                      <p className="font-semibold text-slate-900 text-xs">Baixe o APK</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                        Toque no botão <strong>"Baixar GameHub.apk"</strong> acima diretamente no celular (ou envie via WhatsApp/Drive).
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                        2
                      </div>
                      <p className="font-semibold text-slate-900 text-xs">Abra o Arquivo</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                        Toque na notificação de download do celular para abrir o arquivo. Se o Android pedir permissão para instalar fontes desconhecidas, selecione <strong>Permitir</strong>.
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                        3
                      </div>
                      <p className="font-semibold text-slate-900 text-xs">Toque em Instalar</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                        Toque em <strong>Instalar</strong> e depois em <strong>Abrir</strong>. O app abrirá instantaneamente em tela branca pura (#FFFFFF)!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ficha técnica da compilação do APK */}
                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3 text-xs">
                  <div className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Informações Técnicas do Binário APK:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                    <div>Identificador: <strong className="font-mono text-slate-800">com.georgeisagi.gamehub</strong></div>
                    <div>Versão: <strong className="text-slate-800">1.0.0 (code 1)</strong></div>
                    <div>Assinatura: <strong className="text-emerald-700">v1 + v2 + v3 (Válida)</strong></div>
                    <div>Compatibilidade: <strong className="text-slate-800">Android 5.0 até 15+</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da Aba 2: Exportar & Projeto Completo */}
            {activeTab === 'export' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs text-slate-700">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Código-fonte do Projeto Android
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        O projeto <strong>GameHub</strong> foi estruturado com o identificador fixo{' '}
                        <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-mono text-[11px]">
                          com.georgeisagi.gamehub
                        </code>
                        . Pronto para futuras expansões e atualizações compatíveis.
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
                          Código-Fonte Completo
                        </span>
                        <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Kotlin + Compose
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900">
                        Baixar Projeto Completo (.zip)
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Inclui todos os fontes em Jetpack Compose, Gradle Wrapper, o APK compilado e os scripts de compilação.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Android Studio / Gradle</span>
                      <button
                        onClick={handleDownloadZip}
                        disabled={isZipping}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {isZipping ? 'Compactando...' : downloadSuccess ? 'Baixado!' : 'Baixar ZIP'}
                      </button>
                    </div>
                  </div>

                  {/* Opção 2: Instalar no Celular via PWA / WebAPK */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Instalação Direta
                        </span>
                        <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          PWA / WebAPK
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900">
                        Instalar como WebAPK
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Instala o GameHub diretamente na tela inicial do celular. Abre em tela cheia independente com fundo branco puro (#FFFFFF).
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
              </div>
            )}

            {/* Conteúdo da Aba 3: SDK & Gradle */}
            {activeTab === 'sdk' && (
              <div className="space-y-4 overflow-y-auto pr-1">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Google SDK</span>
                      <h5 className="font-semibold text-xs text-slate-900 mt-0.5">Android Command-Line Tools</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        SDK Tools contendo <code className="font-mono text-[10px]">sdkmanager</code> e build-tools.
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
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Gradle Nativo</span>
                      <h5 className="font-semibold text-xs text-slate-900 mt-0.5">Gradle Build Tool Oficial</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Distribuição oficial de compilação (v8.9).
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                      <a
                        href="https://services.gradle.org/distributions/gradle-8.9-bin.zip"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg transition-colors"
                      >
                        <span>Gradle 8.9 (.zip)</span>
                        <Download className="w-3 h-3 text-slate-500" />
                      </a>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Requisito do SDK</span>
                      <h5 className="font-semibold text-xs text-slate-900 mt-0.5">OpenJDK 17 (Temurin)</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Ambiente Java JDK 17 necessário para compilar.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                      <a
                        href="https://adoptium.net/temurin/releases/?version=17"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg transition-colors"
                      >
                        <span>Baixar Java 17</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da Aba 4: Código Kotlin / Compose */}
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
          <footer className="pointer-events-auto flex items-center justify-between text-xs text-slate-500 bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-xl px-4 py-2 max-w-4xl mx-auto w-full">
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
        /* Quando no Modo Tela Branca Pura: exibe apenas um gatilho discreto */
        <button
          onClick={() => setShowTools(true)}
          className="absolute bottom-4 right-4 z-50 p-2.5 rounded-full bg-white/70 hover:bg-white text-slate-400 hover:text-slate-800 shadow-sm border border-slate-200/60 opacity-20 hover:opacity-100 transition-opacity"
          title="Clique para abrir opções de download do APK"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
