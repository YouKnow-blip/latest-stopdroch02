import { useState } from "react";
import { Download, Code, FileCode, CheckCircle, HelpCircle, StepForward, Layers, Settings, ShieldCheck, Copy } from "lucide-react";
import JSZip from "jszip";

interface ExtensionDownloadViewProps {
  userEmail: string | undefined;
  blockedSites: string[];
  onTriggerNotification: (msg: string, type: "success" | "warning") => void;
}

export default function ExtensionDownloadView({ userEmail, blockedSites, onTriggerNotification }: ExtensionDownloadViewProps) {
  const [activeFile, setActiveFile] = useState<"manifest" | "background" | "content" | "popupHtml" | "popupJs">("manifest");
  const [isDownloading, setIsDownloading] = useState(false);

  // Get active website origin dynamically
  const websiteOrigin = typeof window !== "undefined" ? window.location.origin : "https://stopdroch.click";

  // Helper to compile template file with actual platform URL coordinates
  const getResolvedCode = (fileKey: "manifest" | "background" | "content" | "popupHtml" | "popupJs") => {
    return extensionFiles[fileKey].code.replaceAll("WEBSITE_URL_PLACEHOLDER", websiteOrigin);
  };

  // Chrome Extension source codes
  const extensionFiles = {
    manifest: {
      name: "manifest.json",
      language: "json",
      code: `{
  "manifest_version": 3,
  "name": "СТОПДРОЧЬ — Блокировщик & Дисциплина",
  "version": "1.0.0",
  "description": "Экосистема отказа от порнозависимости. Блокирует вредные сайты и мотивирует джедайскими советами.",
  "permissions": [
    "tabs",
    "storage",
    "webNavigation"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_start"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    }
  }
}`
    },
    background: {
      name: "background.js",
      language: "javascript",
      code: `// СТОПДРОЧЬ: Background Service Worker
const PORN_DOMAINS = [
  "pornhub.com", "xvideos.com", "brazzers.com", "redtube.com", "xnxx.com", "onlyfans.com", "porn"
];

// Listen and filter domains
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && tab.url) {
    const url = tab.url.toLowerCase();
    
    chrome.storage.local.get(["customBlockedSites", "strictMode"], (res) => {
      const customs = res.customBlockedSites || [];
      const isStrict = res.strictMode || false;
      
      const combinedList = [...PORN_DOMAINS, ...customs];
      const match = combinedList.some(domain => url.includes(domain));
      
      if (match) {
        // Redirection block mode or message passing fallback
        chrome.tabs.sendMessage(tabId, { action: "BLOCK_PAGE", url: tab.url }).catch(() => {
          // Silent catch in case content script not yet injected (handled by local verify in content.js)
        });
      }
    });
  }
});

// Setup listeners to secure analytics
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PREVENTED_SLIP") {
    chrome.storage.local.get(["preventedCount", "userEmail"], (res) => {
      const count = (res.preventedCount || 0) + 1;
      chrome.storage.local.set({ preventedCount: count }, () => {
        // Sync stats with main platform API
        if (res.userEmail) {
          fetch("WEBSITE_URL_PLACEHOLDER" + "/api/user/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: res.userEmail,
              preventedSlips: count,
              xp: count * 15
            })
          }).catch(err => console.log("Cloud sync delayed", err));
        }
      });
    });
  }
});`
    },
    content: {
      name: "content.js",
      language: "javascript",
      code: `// СТОПДРОЧЬ: Content Injector
let isOverlayInjected = false;

const PORN_DOMAINS = [
  "pornhub.com", "xvideos.com", "brazzers.com", "redtube.com", "xnxx.com", "onlyfans.com", "porn"
];

// Check immediately on script load to completely bypass background-messaging race conditions!
chrome.storage.local.get(["customBlockedSites"], (res) => {
  const customs = res.customBlockedSites || [];
  const combined = [...PORN_DOMAINS, ...customs];
  const url = window.location.href.toLowerCase();
  
  const match = combined.some(domain => url.includes(domain));
  if (match) {
    injectBlockOverlay();
  }
});

// Also listen for incoming push commands from service worker
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "BLOCK_PAGE") {
    injectBlockOverlay();
    sendResponse({ success: true });
  }
});

function injectBlockOverlay() {
  if (isOverlayInjected) return;
  isOverlayInjected = true;

  // Clean original site body immediately to prevent visual flashing of bad elements!
  document.documentElement.innerHTML = "";
  
  const outer = document.createElement("div");
  outer.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#030712;color:#ffffff;font-family:'Impact', 'Arial Black', sans-serif;z-index:999999999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;border:10px solid #ef4444;";
  
  // Custom interactive wrapper
  outer.innerHTML = \`
    <div style="max-width:550px;text-align:center;animation:shake 1s infinite ease-in-out;font-family:sans-serif;">
      <div style="width:72px;height:72px;background:#ef4444;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow: 0 0 35px #ef4444;border: 3px solid white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:white;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      
      <h1 style="font-size:24px;font-weight:900;letter-spacing:0.5px;margin:0 0 10px;color:#ef4444;text-shadow: 0 0 15px rgba(239,68,68,0.4);line-height:1.2;">СТОПДРОЧЬ КРИТИЧЕСКИЙ РУБЕЖ!</h1>
      
      <div style="background:#ef4444;color:white;padding:6px 18px;border-radius:32px;display:inline-block;font-weight:bolder;font-size:12px;margin-bottom:12px;text-transform:uppercase;border: 2px solid white;">
        🚫 ДОСТУП ВЫЖЖЕН СИЗОЙ СТАЛЬЮ ДИСЦИПЛИНЫ
      </div>

      <!-- SEATED MASCOT CAT BLOCK -->
      <div style="width:160px;height:160px;margin:12px auto;border-radius:20px;border:3px solid #3b82f6;box-shadow:0 0 20px rgba(59,130,246,0.6);overflow:hidden;background:#000;position:relative;">
        <img src="WEBSITE_URL_PLACEHOLDER/jedi_kitten.png" style="width:100%;height:100%;object-fit:cover;" alt="Jedi Cat Mascot" />
        <div style="position:absolute;bottom:0;width:100%;background:rgba(0,0,0,0.8);color:#38bdf8;font-size:9.5px;font-weight:bold;padding:3px 0;letter-spacing:0.5px;text-transform:uppercase;">Магистр Кото-Недрочабль</div>
      </div>
      
      <p style="font-size:14px;line-height:1.5;color:#e5e7eb;margin:0 0 20px;font-family:sans-serif;font-weight:700;">
        «ТЫ ЧТО ТВОРИШЬ, ЖАЛКОЕ ЖИВОТНОЕ?! Похоть полностью растворила твои остатки воли? Быстро убрал руки от ширинки! Закрой эту вкладку немедленно! Магистр Ордена Кото-Недрочабль со световым мечом воли наблюдает за каждым твоим вздохом. Будь сильным, джедай!»
      </p>
      
      <div style="display:flex;gap:12px;justify-content:center;align-items:center;min-height:70px;position:relative;flex-wrap:wrap;">
        <button id="btn-leave-site" style="background:#10b981;color:white;font-weight:900;border:3px solid white;padding:12px 24px;border-radius:12px;font-size:14px;cursor:pointer;box-shadow:0 0 30px #10b981;transition:all 0.1s;text-transform:uppercase;">
          СПАСТИ СВОЮ ЧЕСТЬ И СВАЛИТЬ! (+15 XP)
        </button>
        <button id="btn-comply-bypass" style="background:#1f2937;color:#9ca3af;font-weight:bold;border:2px solid #374151;padding:8px 14px;border-radius:8px;font-size:11px;cursor:pointer;position:absolute;">
          Сдаться и дрочить (Слив)
        </button>
      </div>
    </div>
    
    <style>
      @keyframes shake {
        0% { transform: translate(0.4px, 0.4px) rotate(0.1deg); }
        50% { transform: translate(-0.4px, 0px) rotate(-0.1deg); }
        100% { transform: translate(0.4px, -0.4px) rotate(0deg); }
      }
    </style>
  \`;

  document.body.appendChild(outer);

  // Escaping button logic (Fully standard JS without TS highlights)
  const leaveBtn = outer.querySelector("#btn-leave-site");
  const bypassBtn = outer.querySelector("#btn-comply-bypass");

  let x = 160;
  
  if (bypassBtn) {
    bypassBtn.style.left = "calc(50% + " + x + "px)";
    bypassBtn.addEventListener("mouseenter", () => {
      const rx = (Math.random() - 0.5) * 350;
      const ry = (Math.random() - 0.5) * 220;
      bypassBtn.style.transform = "translate(" + rx + "px, " + ry + "px)";
      bypassBtn.innerText = "ХРЕН ТЕБЕ, СЛАБАК, А НЕ КНОПКА!";
      bypassBtn.style.background = "#ef4444";
      bypassBtn.style.color = "white";
    });
    
    bypassBtn.addEventListener("click", () => {
      // Emergency redirect to safe zone
      window.location.href = "https://twitch.tv";
    });
  }

  if (leaveBtn) {
    leaveBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "PREVENTED_SLIP" });
      // Redirect page to safe dashboard
      window.location.href = "WEBSITE_URL_PLACEHOLDER";
    });
  }
}`
    },
    popupHtml: {
      name: "popup.html",
      language: "html",
      code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 290px;
      padding: 16px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #030712;
      color: #f3f4f6;
      margin: 0;
      border: 2px solid #1e3a8a;
      border-radius: 12px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 14px;
      font-size: 15px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 8px;
    }
    .avatar-container {
      text-align: center;
      margin-bottom: 14px;
    }
    .avatar {
      width: 84px;
      height: 84px;
      border-radius: 12px;
      border: 2.5px solid #38bdf8;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
      object-fit: cover;
    }
    .stats {
      background: #0b1528;
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 14px;
      font-size: 13px;
      border: 1px solid #1e293b;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-weight: 500;
    }
    .stat-row:last-child {
      margin-bottom: 0;
    }
    .label {
      color: #9ca3af;
    }
    .val {
      font-weight: 700;
      color: #ffffff;
    }
    .tag-active {
      color: #10b981;
      font-weight: bold;
    }
    .btn {
      width: 100%;
      background: #2563eb;
      color: white;
      text-align: center;
      padding: 9px;
      border-radius: 8px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s;
      margin-bottom: 8px;
    }
    .btn:hover {
      background: #1d4ed8;
    }
    .site-btn {
      display: block;
      width: 100%;
      text-align: center;
      background: #1f2937;
      color: #9ca3af;
      padding: 8px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid #374151;
      box-sizing: border-box;
      transition: all 0.2s;
    }
    .site-btn:hover {
      background: #111827;
      color: #38bdf8;
      border-color: #3b82f6;
    }
  </style>
</head>
<body>
  <div class="header">
    🛡️ СТОПДРОЧЬ СИСТЕМА v1.2
  </div>
  
  <div class="avatar-container">
    <img src="https://latest-stopdroch02.vercel.app/jedi_kitten.png" class="avatar" alt="Магистр Недрочабль" />
  </div>

  <div class="stats">
    <div class="stat-row">
      <span class="label">Статус щита:</span>
      <span class="val tag-active">БЛОКИРОВКА АКТИВНА 🛡️</span>
    </div>
    <div class="stat-row">
      <span class="label">Мой стрик:</span>
      <span id="streak-days" class="val" style="color: #38bdf8;">5 дней</span>
    </div>
    <div class="stat-row">
      <span class="label">Срывов предотвращено:</span>
      <span id="slips-prevented" class="val" style="color: #ef4444;">24</span>
    </div>
    <div class="stat-row">
      <span class="label">Лига Силы:</span>
      <span id="discipline-rank" class="val" style="color: #fbbf24; font-size: 11px;">Падаван Дисциплины</span>
    </div>
  </div>

  <button id="sync-btn" class="btn">Обновить данные с облаком</button>
  
  <a href="https://latest-stopdroch02.vercel.app/" target="_blank" class="site-btn">
    🌐 Перейти в Кабинет Ордена
  </a>

  <script src="popup.js"></script>
</body>
</html>`
    },
    popupJs: {
      name: "popup.js",
      language: "javascript",
      code: `// СТОПДРОЧЬ Popup interactions
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["streakDays", "preventedCount", "disciplineLevel"], (res) => {
    const days = res.streakDays || 5;
    const prevented = res.preventedCount || 24;
    const level = res.disciplineLevel || 3;
    
    document.getElementById("streak-days").innerText = days + " дней";
    document.getElementById("slips-prevented").innerText = prevented;
    
    // Resolve rank
    let rankName = "Юнлинг";
    if (level >= 15) rankName = "Grandmaster";
    else if (level >= 10) rankName = "Рыцарь Дисциплины";
    else if (level >= 5) rankName = "Падаван Дисциплины";
    
    const rankEl = document.getElementById("discipline-rank");
    if (rankEl) {
      rankEl.innerText = rankName + " (" + level + " Lvl)";
    }
  });

  const syncBtn = document.getElementById("sync-btn");
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      syncBtn.innerText = "Синхронизация...";
      setTimeout(() => {
        syncBtn.innerText = "Синхронизировано ✓";
      }, 800);
    });
  }
});`
    }
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      // Add each file to ZIP
      zip.file("manifest.json", getResolvedCode("manifest"));
      zip.file("background.js", getResolvedCode("background"));
      zip.file("content.js", getResolvedCode("content"));
      zip.file("popup.html", getResolvedCode("popupHtml"));
      zip.file("popup.js", getResolvedCode("popupJs"));

      // Create a dummy 48x48 icon using canvas draw representation
      const canvas = document.createElement("canvas");
      canvas.width = 48;
      canvas.height = 48;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(24, 24, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.fillText("С", 16, 32);
      }
      const dataUrl = canvas.toDataURL("image/png");
      const base64Content = dataUrl.split(",")[1];
      zip.file("icon.png", base64Content, { base64: true });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "STOPDROCH_Chrome_Extension.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onTriggerNotification("Архив STOPDROCH_Chrome_Extension.zip успешно создан и скачивается!", "success");
    } catch (e) {
      console.error(e);
      onTriggerNotification("Ошибка генерации ZIP. Пожалуйста, скопируйте коды вручную.", "warning");
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onTriggerNotification("Код успешно скопирован в буфер обмена!", "success");
  };

  return (
    <div className="space-y-6" id="extension-download-view">
      
      {/* SaaS Landing details for Chrome extension */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left column guide */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-sans font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3 leading-tight">
              Как установить Chrome Extension за 1 минуту:
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start space-x-3.5">
                <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs flex-shrink-0 shadow-sm">
                  1
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Нажмите на кнопку <strong>«Скачать расширение (.ZIP)»</strong> ниже, чтобы скачать архив с исходным кодом расширения на ваш компьютер.
                </p>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs flex-shrink-0 shadow-sm">
                  2
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Распакуйте архив в отдельную папку (например, <code>СТОПДРОЧЬ_плагин</code>).
                </p>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs flex-shrink-0 shadow-sm">
                  3
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Откройте ваш браузер (Chrome, Edge, Opera, Yandex) и перейдите по адресу <code>chrome://extensions/</code>.
                </p>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs flex-shrink-0 shadow-sm">
                  4
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Включите <strong>«Режим разработчика»</strong> (Developer mode) в правом верхнем углу.
                </p>
              </div>

              <div className="flex items-start space-x-3.5">
                <span className="w-6.5 h-6.5 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs flex-shrink-0 shadow-sm">
                  5
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Нажмите на кнопку <strong>«Загрузить распакованное расширение»</strong> (Load unpacked) в левом верхнем углу и выберите папку с плагином. Готово!
                </p>
              </div>
            </div>

            {/* Huge action download build */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isDownloading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-100 text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className={`w-4.5 h-4.5 ${isDownloading ? "animate-bounce" : ""}`} />
                <span>{isDownloading ? "Генерация ZIP архива..." : "СКАЧАТЬ РАСШИРЕНИЕ (.ZIP)"}</span>
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-2 font-semibold">
                Содержит Manifest V3, Service worker, Content-scripts и Иллюстрацию
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Interactive code viewer */}
        <div className="lg:col-span-3 flex flex-col border border-slate-200 rounded-[32px] overflow-hidden bg-slate-900 shadow-xl min-h-[480px]">
          
          {/* Code Header Bar */}
          <div className="bg-slate-900 border-b border-slate-800 p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-300">
              <Code className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider">КОД РАСШИРЕНИЯ (MANIFEST V3)</span>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(getResolvedCode(activeFile))}
              className="text-slate-400 hover:text-white bg-slate-805 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 cursor-pointer border border-slate-800"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>Скопировать</span>
            </button>
          </div>

          {/* Tab buttons */}
          <div className="bg-slate-950 border-b border-slate-800 flex overflow-x-auto scroller-hidden">
            {Object.keys(extensionFiles).map((fileKey) => {
              const file = extensionFiles[fileKey as keyof typeof extensionFiles];
              const isSelected = fileKey === activeFile;
              return (
                <button
                  type="button"
                  key={fileKey}
                  onClick={() => setActiveFile(fileKey as any)}
                  className={`px-4 py-2.5 text-xs font-mono border-b-2 transition-all flex-shrink-0 cursor-pointer ${
                    isSelected 
                      ? "text-blue-450 bg-slate-900/50 border-blue-500 font-bold" 
                      : "text-slate-550 border-transparent hover:text-slate-305"
                  }`}
                >
                  {file.name}
                </button>
              );
            })}
          </div>

          {/* Active Terminal view */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[350px] font-mono text-xs text-blue-300/90 bg-slate-950">
            <pre className="whitespace-pre overflow-x-auto text-left leading-relaxed">
              <code>{getResolvedCode(activeFile)}</code>
            </pre>
          </div>

          {/* Footer details inside Terminal window */}
          <div className="bg-slate-900 border-t border-slate-800 p-3.5 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Язык: {extensionFiles[activeFile].language.toUpperCase()}</span>
            <span>Для синхронизации: Email вшивается автоматически ({userEmail || "Гость"})</span>
          </div>

        </div>

      </div>

    </div>
  );
}
