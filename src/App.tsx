import React, { useState } from 'react';
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
  ArrowDownToLine,
  CheckCircle,
  Github,
  WifiOff,
  Share2
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from './androidProjectFiles';
import { GAMEHUB_APK_BASE64 } from './apkData';
import { usePWAInstall, useOnlineStatus } from './usePWAInstall';

export default function App() {
  const [showTools, setShowTools] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa' | 'github' | 'export' | 'sdk' | 'code'>('apk');
  const [selectedFile, setSelectedFile] = useState<string>('app/src/main/java/com/georgeisagi/gamehub/MainActivity.kt');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [apkDownloadSuccess, setApkDownloadSuccess] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedGit, setCopiedGit] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

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

        // Inclui o arquivo GameHub.apk binário já compilado dentro do ZIP
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

  const gitPushCommand = `git remote add origin https://github.com/SEU_USUARIO/GameHub.git\ngit branch -M main\ngit push -u origin main --tags`;

  const handleCopyGit = () => {
    navigator.clipboard.writeText(gitPushCommand);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2500);
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

      {/* Indicador de Status Offline do PWA */}
      {!isOnline && (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs shadow-md border border-slate-700">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>Modo Offline Ativo (PWA em cache)</span>
        </div>
      )}

      {/* Painel de Controle / Central do APK, PWA e GitHub */}
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
                    APK & PWA
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

          {/* Modal / Card central com abas */}
          <main className="pointer-events-auto my-auto max-w-4xl mx-auto w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl max-h-[82vh] flex flex-col">
            {/* Barra de Abas */}
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
                  APK Nativo
                </button>
                <button
                  onClick={() => setActiveTab('pwa')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'pwa'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  PWA (Instalar)
                </button>
                <button
                  onClick={() => setActiveTab('github')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'github'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Github className="w-3.5 h-3.5 text-emerald-400" />
                  GitHub & Release
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
                  Projeto (.zip)
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
                  Código
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-600 font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                v1.0.0 Pronta
              </div>
            </div>

            {/* Aba 1: Download Direto do APK */}
            {activeTab === 'apk' && (
              <div className="space-y-4 overflow-y-auto pr-1">
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

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-slate-800" />
                    Como Instalar no Celular Android
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">1</div>
                      <p className="font-semibold text-slate-900 text-xs">Baixe o APK</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                        Toque no botão <strong>"Baixar GameHub.apk"</strong> acima diretamente no celular.
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">2</div>
                      <p className="font-semibold text-slate-900 text-xs">Abra o Arquivo</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                        Toque no download concluído. Caso o Android solicite, autorize <strong>Permitir desta fonte</strong>.
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">3</div>
                      <p className="font-semibold text-slate-900 text-xs">Toque em Instalar</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                        Toque em <strong>Instalar</strong>. O GameHub abrirá imediatamente com a tela branca pura (#FFFFFF)!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aba 2: PWA Completo */}
            {activeTab === 'pwa' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                      Progressive Web App
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Instalação Direta sem Loja (PWA / WebAPK)
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
                      O PWA adiciona o <strong>GameHub</strong> na tela inicial do celular com ícone oficial, abertura autônoma em tela cheia (Edge-to-Edge) e suporte 100% offline via Service Worker.
                    </p>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    {isInstalled ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-semibold text-xs border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        PWA Já Instalado!
                      </div>
                    ) : isInstallable ? (
                      <button
                        onClick={install}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-all active:scale-95"
                      >
                        <Smartphone className="w-4 h-4" />
                        Instalar GameHub Agora
                      </button>
                    ) : isIOS ? (
                      <button
                        onClick={() => setShowIOSModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow transition-all active:scale-95"
                      >
                        <Share2 className="w-4 h-4" />
                        Como Instalar no iPhone
                      </button>
                    ) : (
                      <button
                        onClick={install}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-all active:scale-95"
                      >
                        <Smartphone className="w-4 h-4" />
                        Instalar no Celular
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <h5 className="font-semibold text-slate-900">Service Worker Ativo</h5>
                    <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                      Armazena em cache todos os recursos para carregar a tela branca pura mesmo no modo avião.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <h5 className="font-semibold text-slate-900">Web App Manifest</h5>
                    <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                      Configurado com display <code className="text-slate-800 font-mono">standalone</code>, tema e fundo <code className="text-slate-800 font-mono">#FFFFFF</code>.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <h5 className="font-semibold text-slate-900">Ícones Adaptativos</h5>
                    <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                      Resoluções 192x192, 512x512, maskable e apple-touch-icon para Android e iOS.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Aba 3: GitHub & Release do APK */}
            {activeTab === 'github' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      Repositório Git & Workflow de Release do APK
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    O projeto local já está comitado no branch <code className="text-emerald-400 font-mono">main</code> com a tag <code className="text-emerald-400 font-mono">v1.0.0</code> e o arquivo <code className="text-emerald-400 font-mono">GameHub.apk</code> incluído.
                    Também foi criado o workflow do <strong>GitHub Actions</strong> em <code className="text-emerald-400 font-mono">.github/workflows/build-apk.yml</code> para gerar releases automáticas com o APK!
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Como enviar o projeto e o APK para o seu GitHub em 3 passos:
                    </h4>
                    <button
                      onClick={handleCopyGit}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      {copiedGit ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedGit ? 'Comandos Copiados!' : 'Copiar Comandos'}</span>
                    </button>
                  </div>

                  <div className="text-xs space-y-2">
                    <p className="text-slate-600 text-[11px]">
                      1. Crie um repositório vazio no seu GitHub: <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">github.com/new</a> com o nome <strong>GameHub</strong>.
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      2. No terminal do seu computador (na pasta do projeto extraído), cole os comandos:
                    </p>
                    <div className="bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                      <pre>{gitPushCommand}</pre>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      3. Pronto! Ao dar o push, o GitHub disponibilizará o arquivo <strong>GameHub.apk</strong> tanto no repositório quanto na aba <strong>Releases</strong> com link direto de download!
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>GitHub Actions Configurado:</strong>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Sempre que você criar uma tag ou fizer commit, o GitHub Actions compilará automaticamente o APK e criará a release para download público.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Aba 4: Projeto (.zip) */}
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

                <div className="border border-slate-200 rounded-2xl p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">
                      Baixar Projeto Completo (.zip)
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Inclui todos os fontes em Jetpack Compose, Gradle Wrapper, o APK compilado e os scripts de compilação.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadZip}
                    disabled={isZipping}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all active:scale-95 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isZipping ? 'Compactando...' : downloadSuccess ? 'Baixado!' : 'Baixar ZIP'}
                  </button>
                </div>
              </div>
            )}

            {/* Aba 5: SDK & Gradle */}
            {activeTab === 'sdk' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Recomendado pelo Google
                      </span>
                      <h3 className="text-base font-semibold mt-1">Android Studio (SDK 35 + Gradle Embutido)</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                        Instala automaticamente o Android SDK nativo, JDK do Java e Gradle oficial.
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
                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Google SDK</span>
                      <h5 className="font-semibold text-xs text-slate-900 mt-0.5">Command-Line Tools</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        SDK Tools contendo <code className="font-mono text-[10px]">sdkmanager</code>.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <a
                        href="https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg"
                      >
                        <span>Windows (.zip)</span>
                        <Download className="w-3 h-3 text-slate-500" />
                      </a>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Gradle Nativo</span>
                      <h5 className="font-semibold text-xs text-slate-900 mt-0.5">Gradle Build Tool Oficial</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Distribuição oficial v8.9.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <a
                        href="https://services.gradle.org/distributions/gradle-8.9-bin.zip"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg"
                      >
                        <span>Gradle 8.9 (.zip)</span>
                        <Download className="w-3 h-3 text-slate-500" />
                      </a>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Requisito do SDK</span>
                      <h5 className="font-semibold text-xs text-slate-900 mt-0.5">OpenJDK 17 (Temurin)</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Ambiente Java JDK 17 necessário.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <a
                        href="https://adoptium.net/temurin/releases/?version=17"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg"
                      >
                        <span>Baixar Java 17</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aba 6: Código Fonte */}
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
        <button
          onClick={() => setShowTools(true)}
          className="absolute bottom-4 right-4 z-50 p-2.5 rounded-full bg-white/70 hover:bg-white text-slate-400 hover:text-slate-800 shadow-sm border border-slate-200/60 opacity-20 hover:opacity-100 transition-opacity"
          title="Clique para abrir opções"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {/* Modal Guia iOS Safari */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl text-slate-900">
            <h3 className="text-base font-bold">Instalar no iPhone / iPad</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              1. No Safari, toque no botão <strong>Compartilhar</strong> (ícone com quadrado e seta para cima).<br />
              2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.<br />
              3. Toque em <strong>Adicionar</strong> no canto superior direito.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
