import { useState, useRef, MouseEvent, useEffect } from "react";
import { ShieldCheck, ArrowRight, ShieldAlert, RotateCcw, AlertOctagon, HelpCircle, Power, CheckCircle, RefreshCw, Layers } from "lucide-react";
import { UserStats } from "../types";

interface ExtensionSimulatorProps {
  user: UserStats | null;
  onUpdateStats: (xpGift: number, preventedGift: number, addedStreak?: boolean) => void;
  onTriggerNotification: (msg: string, type: "success" | "warning") => void;
}

export default function ExtensionSimulator({ user, onUpdateStats, onTriggerNotification }: ExtensionSimulatorProps) {
  const [urlInput, setUrlInput] = useState("pornhub.com");
  const [currentUrl, setCurrentUrl] = useState("google.com");
  const [isBlocked, setIsBlocked] = useState(false);
  const [showClosedTab, setShowClosedTab] = useState(false);
  const [escapeCoords, setEscapeCoords] = useState({ x: 0, y: 0 });
  const [isHoveredEscape, setIsHoveredEscape] = useState(false);
  
  // Custom blocked domain checker list
  const PORN_DOMAINS = [
    "pornhub.com", "xvideos.com", "brazzers.com", "redtube.com", "xnxx.com", "phub", "porn"
  ];

  const escapeButtonRef = useRef<HTMLButtonElement>(null);

  const handleNavigate = (targetUrl: string) => {
    let cleanUrl = targetUrl.toLowerCase().trim();
    cleanUrl = cleanUrl.replace(/^(https?:\/\/)?(www\.)?/, "");
    
    if (!cleanUrl) return;

    setCurrentUrl(cleanUrl);
    setShowClosedTab(false);

    // Check if the domain matches porn list or user added list
    const isPorn = PORN_DOMAINS.some(d => cleanUrl.includes(d)) || 
                   (user?.customBlockedSites || []).some(cs => cleanUrl.includes(cs.toLowerCase()));

    if (isPorn) {
      setIsBlocked(true);
      // Reset escape buttons coords
      setEscapeCoords({ x: 0, y: 0 });
    } else {
      setIsBlocked(false);
    }
  };

  const handleLeaveSite = () => {
    setIsBlocked(false);
    setShowClosedTab(true);
    onUpdateStats(15, 1); // Give 15 XP and increment prevented Slips by 1
    onTriggerNotification("Разум защищен! Вы получили +15 XP и +1 к предотвращенным срывам!", "success");
  };

  // Escape Logic for "Остаться" button
  const handleEscapeHover = (e: MouseEvent<HTMLButtonElement>) => {
    // Escape random formula within safety bounds
    const dx = (Math.random() - 0.5) * 260;
    const dy = (Math.random() - 0.5) * 160;

    // Avoid going too far out of screen
    setEscapeCoords({ x: dx, y: dy });
    setIsHoveredEscape(true);
  };

  const handleBypassClick = () => {
    setIsBlocked(false);
    onTriggerNotification("Внимание: Вы обошли систему! Но мы направили вас на безопасную зону Twitch.", "warning");
    // Change URL to Twitch simulate
    setCurrentUrl("twitch.tv");
  };

  return (
    <div className="space-y-6" id="simulator-tab-content">
      
      {/* Intro details */}
      <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-100 rounded-[32px] p-6">
        <h2 className="font-sans font-extrabold text-xl text-slate-900 flex items-center space-x-2">
          <Layers className="w-5.5 h-5.5 text-blue-650" />
          <span>Интерактивный Симулятор Расширения СТОПДРОЧЬ</span>
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl font-medium">
          Протестируйте работу Chrome Extension прямо сейчас внутри этого симулятора! 
          Попробуйте зайти на заблокированные домены (например, <strong>pornhub.com</strong> или созданный вами домен), 
          и посмотрите, как джедай Недрочабль отражает удар.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Helper sidebar Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Быстрые ссылки для теста</h3>
            
            <div className="flex flex-col gap-2">
              <button 
                type="button"
                onClick={() => { setUrlInput("pornhub.com"); handleNavigate("pornhub.com"); }}
                className="w-full text-left px-3.5 py-3 bg-slate-50 border border-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-150 transition-all rounded-xl text-xs font-bold text-slate-705 flex items-center justify-between cursor-pointer"
              >
                <span>🚫 pornhub.com</span>
                <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[8px] font-mono">ПОРНО</span>
              </button>

              <button 
                type="button"
                onClick={() => { setUrlInput("brazzers.com"); handleNavigate("brazzers.com"); }}
                className="w-full text-left px-3.5 py-3 bg-slate-50 border border-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-150 transition-all rounded-xl text-xs font-bold text-slate-705 flex items-center justify-between cursor-pointer"
              >
                <span>🚫 brazzers.com</span>
                <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[8px] font-mono">ПОРНО</span>
              </button>

              <button 
                type="button"
                onClick={() => { setUrlInput("github.com"); handleNavigate("github.com"); }}
                className="w-full text-left px-3.5 py-3 bg-slate-50 border border-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-150 transition-all rounded-xl text-xs font-bold text-slate-705 flex items-center justify-between cursor-pointer"
              >
                <span>✅ github.com</span>
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-mono">РАЗРЕШЕНО</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 text-white rounded-3xl p-5 space-y-3 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold z-10 relative">
              <ShieldCheck className="w-4 h-4 animate-pulse text-blue-400" />
              <span>СТАТУС РАСШИРЕНИЯ</span>
            </div>
            <p className="text-[11px] text-slate-400 z-10 relative font-medium leading-relaxed">
              Локальный плагин активен. Whitelist-эффект работает. Блокировщик фильльтрует трафик по 17 ключевым сигнатурам.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] z-10 relative font-semibold">
              <span className="text-slate-450">Строгий режим (Strict):</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${user?.strictMode ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
                {user?.strictMode ? "АКТИВЕН" : "ВЫКЛ"}
              </span>
            </div>
          </div>
        </div>

        {/* Browser Mockup Panel */}
        <div className="lg:col-span-3 border border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-slate-100 flex flex-col min-h-[500px]" id="simulated-browser">
          
          {/* Browser Header address bar */}
          <div className="bg-slate-200/90 border-b border-slate-300 p-2.5 flex items-center space-x-2.5">
            {/* Dots */}
            <div className="flex space-x-1.5 pl-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            {/* Address input */}
            <div className="flex-1 flex items-center bg-white px-3.5 py-1.5 rounded-xl border border-slate-300 shadow-inner">
              <span className="text-[11px] text-slate-400 mr-1.5 font-mono select-none">https://</span>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNavigate(urlInput)}
                className="flex-1 text-xs text-slate-800 focus:outline-none font-mono"
                placeholder="Введите адрес сайта, например pornhub.com"
              />
              <button 
                type="button"
                onClick={() => handleNavigate(urlInput)}
                className="p-1 hover:bg-slate-100 text-slate-500 rounded-md transition-all cursor-pointer"
                title="Перейти"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simulated Extension Status badge */}
            <div className="flex items-center space-x-1 bg-white border border-slate-300 px-2.5 py-1 rounded-xl shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">STOPDROCH v1.0</span>
            </div>
          </div>

          {/* Browser viewport iframe-like container */}
          <div className="flex-1 bg-white relative p-4 flex flex-col justify-center items-center overflow-hidden min-h-[400px]">
            
            {/* CASE 1: BLOCKED SITE OVERLAY DISPLAY */}
            {isBlocked ? (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none z-20 border-8 border-red-650">
                
                {/* Glowing neon pulse back lights and particles */}
                <div className="absolute top-24 w-44 h-44 rounded-full bg-red-600/20 blur-3xl" />
                <div className="absolute bottom-16 w-48 h-48 rounded-full bg-red-650/10 blur-3xl animate-pulse" />

                {/* Main branding warning */}
                <div className="space-y-4 max-w-lg relative z-10 flex flex-col items-center">
                  
                  {/* Warning Symbol */}
                  <div className="w-16 h-16 rounded-full bg-red-600 border-4 border-white flex items-center justify-center shadow-lg shadow-red-500/50 mb-3 animate-bounce">
                    <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
                  </div>

                  <h1 className="text-3xl font-black text-red-500 tracking-wider">
                    СТОПДРОЧЬ КРИТИЧЕСКИЙ РУБЕЖ!
                  </h1>
                  
                  {/* Jedi guard text */}
                  <div className="bg-red-950 border-2 border-red-800 px-4 py-2 rounded-xl">
                    <p className="text-xs font-bold text-red-300 uppercase tracking-widest animate-pulse">
                      🚫 ДОСТУП ВЫЖЖЕН СИЗОЙ СТАЛЬЮ ДИСЦИПЛИНЫ
                    </p>
                  </div>

                  <p className="text-slate-100 text-sm sm:text-base leading-relaxed mt-2 font-black">
                    «ТЫ ЧТО ТВОРИШЬ, ЖАЛКОЕ ЖИВОТНОЕ?! Похоть полностью растворила твои остатки воли? Быстро убрал руки от ширинки! Закрой эту позорную вкладку немедленно, пока твой мозг окончательно не усох до уровня слизняка! Ты слабак! Свали отсюда, пока Магистр Кото-Недрочабль не выжег твою слабость силой джедайского меча воли!»
                  </p>

                  {/* BUTTON SUITE */}
                  <div className="pt-6 w-full flex flex-col xs:flex-row items-center justify-center gap-4 relative min-h-[120px]">
                    
                    {/* Safe Button: Close / Leave tab */}
                    <button
                      type="button"
                      onClick={handleLeaveSite}
                      className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 text-xs sm:text-sm border-2 border-white transition-all flex items-center space-x-2 w-full xs:w-auto justify-center cursor-pointer relative z-10 hover:scale-105"
                    >
                      <CheckCircle className="w-4.5 h-4.5" />
                      <span>СПАСТИ СВОЮ ЧЕСТЬ И СВАЛИТЬ ОТСЮДА! (+15 XP)</span>
                    </button>

                    {/* Escaping button 'Остаться' */}
                    <div className="relative xs:absolute">
                      <button
                        type="button"
                        ref={escapeButtonRef}
                        onMouseEnter={handleEscapeHover}
                        onClick={handleBypassClick}
                        style={{
                          transform: `translate(${escapeCoords.x}px, ${escapeCoords.y}px)`,
                          transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)"
                        }}
                        className={`px-5 py-3 ${
                          isHoveredEscape ? "bg-red-600" : "bg-slate-800"
                        } text-white font-bold rounded-xl text-xs transition-all tracking-wide opacity-95 shadow-lg shadow-red-650/10 cursor-pointer border border-slate-700`}
                      >
                        {isHoveredEscape ? "ХРЕН ТЕБЕ, СЛАБАК, А НЕ КНОПКА!" : "Сдаться и дрочить (Слив)"}
                      </button>
                    </div>

                  </div>

                  {/* Small hint helper */}
                  {isHoveredEscape && (
                    <p className="text-[10px] text-red-400 italic mt-4 font-black tracking-widest uppercase">
                      💡 ДИСЦИПЛИНАРНОЕ ИГНОРИРОВАНИЕ КНОПКИ: НАЖАТЬ НЕПОСЛУШАНИЕ НЕВОЗМОЖНО!🧠
                    </p>
                  )}

                </div>

              </div>
            ) : showClosedTab ? (
              /* CASE 2: TAB CLOSED STATE */
              <div className="text-center space-y-4 max-w-md p-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-slate-805 font-bold text-lg">Вкладка безопасно защищена Орденом</h3>
                <p className="text-sm text-slate-500 font-semibold">
                  Вы сделали правильный выбор, закрыли вредоносную вкладку и сохранили стрик! Недрочабль гордится вашей непоколебимой силой воли.
                </p>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl inline-block text-xs font-extrabold text-slate-700">
                  🎉 Начислено: <span className="text-blue-650">+15 Сил Ордена (XP)</span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => { setShowClosedTab(false); setUrlInput("google.com"); handleNavigate("google.com"); }}
                    className="mt-2 px-5 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    Вернуться к серфингу
                  </button>
                </div>
              </div>
            ) : (
              /* CASE 3: GENERAL SITE BROWSER LOADING */
              <div className="w-full h-full flex flex-col justify-between items-center text-center p-4 min-h-[350px]">
                <div className="text-slate-200 mt-12">
                  <ShieldCheck className="w-16 h-16 mx-auto stroke-[1.2] text-slate-300 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-slate-750 font-sans font-bold text-sm">Безопасный веб-серфинг</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Вы находитесь на странице: <strong className="text-blue-600 font-bold">https://{currentUrl}</strong>
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl text-xs max-w-md text-slate-500 leading-relaxed font-semibold">
                  Попробуйте ввести порно-домен (например <strong className="text-slate-950 font-black">pornhub.com</strong>) в адресной строке симулятора выше, чтобы запустить защиту.
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
