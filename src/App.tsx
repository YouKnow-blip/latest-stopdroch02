import { useState, useEffect } from "react";
import { UserStats, LeaderboardUser } from "./types";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DashboardView from "./components/DashboardView";
import TipsView from "./components/TipsView";
import ExtensionSimulator from "./components/ExtensionSimulator";
import ExtensionDownloadView from "./components/ExtensionDownloadView";
import MascotNedrochable from "./components/MascotNedrochable";
import AuthView from "./components/AuthView";
import { ShieldCheck, Sparkles, Volume2, Calendar, Trophy, AlertTriangle, Info, Bell, X, Compass } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "warning";
}

export default function App() {
  const [user, setUser] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentTab, setCurrentTab] = useState<"hero" | "dashboard" | "tips" | "simulator" | "extension">("hero");
  const [authOpen, setAuthOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [quote, setQuote] = useState({ text: "Зажги синее пламя дисциплины.", author: "Магистр Недрочабль" });

  // Load custom quotes
  const fetchQuote = async () => {
    try {
      const res = await fetch("/api/quotes");
      if (res.ok) {
        const data = await res.json();
        setQuote(data);
      }
    } catch (e) {
      console.log("Quotes delayed", e);
    }
  };

  // Load global rankings
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (e) {
      console.log("Leaderboard loading deferred", e);
    }
  };

  // Load active user session on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("stopdroch_user");
    const savedToken = localStorage.getItem("stopdroch_token");

    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser) as UserStats;
        setUser(parsed);
      } catch (e) {
        console.error("Session parse error", e);
      }
    } else {
      // Seed a guest user by default so the dashboard is fully explorer-ready without forced blocking registrations!
      const seedGuest: UserStats = {
        id: "usr_guest",
        username: "Хранитель Воли",
        email: "drugperedaca@gmail.com",
        streakDays: 5,
        bestStreakDays: 14,
        preventedSlips: 24,
        disciplineLevel: 3,
        xp: 450,
        lastSlipDate: new Date(Date.now() - 5 * 24 * 3605 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        customBlockedSites: ["instagram.com", "vk.com"],
        whitelistSites: [],
        strictMode: true,
        missions: [
          { id: "m1", title: "Сделать 20 отжиманий", completed: true, category: "sport", xpReward: 50 },
          { id: "m2", title: "10 минут медитации Дисциплины", completed: false, category: "mind", xpReward: 50 },
          { id: "m3", title: "Прочесть 1 совет Недрочабля", completed: true, category: "discipline", xpReward: 30 },
          { id: "m4", title: "Ограничить соцсети до 30 минут", completed: false, category: "detox", xpReward: 60 }
        ],
        unlockedAchievements: ["streak_1", "prevention_10"]
      };
      setUser(seedGuest);
    }

    fetchLeaderboard();
    fetchQuote();
  }, []);

  // Update client-side user reference & save session
  const handleUpdateFullUser = (newUserState: UserStats) => {
    setUser(newUserState);
    if (newUserState.id !== "usr_guest") {
      localStorage.setItem("stopdroch_user", JSON.stringify(newUserState));
    }
  };

  // Sync data to Cloud Express DB on active states changes
  const handleCloudSync = async (newUserState: UserStats) => {
    try {
      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserState)
      });
      if (res.ok) {
        fetchLeaderboard(); // refresh leaderboard stats
      }
    } catch (err) {
      console.log("Offline stats cached", err);
    }
  };

  // Simple stats increments (gift XP/Prevents)
  const handleUpdateStats = (xpGift: number, preventedGift: number, addedStreak = false) => {
    if (!user) return;

    // Standard XP step mapping to levels: level = floor(xp / 200) + 1
    const nextXp = user.xp + xpGift;
    const nextLevel = Math.floor(nextXp / 200) + 1;
    const nextStreak = addedStreak ? user.streakDays + 1 : user.streakDays;

    const updatedUser = {
      ...user,
      xp: nextXp,
      disciplineLevel: nextLevel,
      preventedSlips: user.preventedSlips + preventedGift,
      streakDays: nextStreak,
      bestStreakDays: Math.max(user.bestStreakDays, nextStreak)
    };

    handleUpdateFullUser(updatedUser);
    handleCloudSync(updatedUser);

    if (nextLevel > user.disciplineLevel) {
      triggerNotification(`🎉 Невероятно! Вы достигли Уровня Дисциплины ${nextLevel}! Ваша воля крепнет!`, "success");
    }
  };

  const handleAuthSuccess = (token: string, loadedUser: UserStats) => {
    setUser(loadedUser);
    localStorage.setItem("stopdroch_user", JSON.stringify(loadedUser));
    localStorage.setItem("stopdroch_token", token);
    fetchLeaderboard();
  };

  const handleLogout = () => {
    localStorage.removeItem("stopdroch_user");
    localStorage.removeItem("stopdroch_token");
    
    // Fallback to fresh guest session to keep app sandbox active
    const seedGuest: UserStats = {
      id: "usr_guest",
      username: "Хранитель Воли",
      email: "drugperedaca@gmail.com",
      streakDays: 0,
      bestStreakDays: 0,
      preventedSlips: 0,
      disciplineLevel: 1,
      xp: 0,
      lastSlipDate: null,
      createdAt: new Date().toISOString(),
      customBlockedSites: [],
      whitelistSites: [],
      strictMode: false,
      missions: [
        { id: "m1", title: "Сделать 20 отжиманий", completed: false, category: "sport", xpReward: 50 },
        { id: "m2", title: "10 минут медитации Дисциплины", completed: false, category: "mind", xpReward: 50 },
        { id: "m3", title: "Прочесть 1 совет Недрочабля", completed: false, category: "discipline", xpReward: 30 },
        { id: "m4", title: "Ограничить соцсети до 30 минут", completed: false, category: "detox", xpReward: 60 }
      ],
      unlockedAchievements: []
    };
    setUser(seedGuest);
    triggerNotification("Вы вышли из учетной записи. Активен гостевой профиль.", "warning");
  };

  // Toast dispatch
  const triggerNotification = (message: string, type: "success" | "warning") => {
    const nextToast: Toast = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type
    };

    setToasts((prev) => [nextToast, ...prev].slice(0, 4)); // limit max 4 screen notifications
    
    // Auto erase
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== nextToast.id));
    }, 5500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen mesh-bg font-sans text-slate-100 flex flex-col justify-between">
      
      {/* 1. Header Navigation Bar */}
      <Navbar 
        user={user}
        currentTab={currentTab}
        onNavigate={(tab) => { setCurrentTab(tab); fetchQuote(); }}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* 2. Main app space context */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Dynamic global quote banner from counselor */}
        {currentTab !== "hero" && (
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-3xl flex items-center justify-between shadow-lg backdrop-blur-sm animate-fadeIn" id="global-quote-box">
            <div className="flex items-center space-x-3.5 text-xs text-slate-300 italic font-semibold">
              <Compass className="w-5 h-5 text-blue-450 animate-pulse" />
              <span>«{quote.text}» — <strong className="font-bold text-blue-400 font-sans">{quote.author}</strong></span>
            </div>
            
            <button 
              type="button"
              onClick={fetchQuote}
              className="text-[10px] uppercase font-mono font-black tracking-wider text-blue-400 hover:text-blue-300 transition cursor-pointer"
            >
              Сменить цитату
            </button>
          </div>
        )}

        {/* Tab router switches */}
        {currentTab === "hero" && (
          <HeroSection 
            onNavigate={(tab) => { setCurrentTab(tab); fetchQuote(); }}
            onOpenAuth={() => setAuthOpen(true)}
            userEmail={user?.email}
          />
        )}

        {currentTab === "dashboard" && user && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Jedi Companion */}
            <MascotNedrochable 
              disciplineLevel={user.disciplineLevel}
              streakDays={user.streakDays}
            />

            {/* Core dashboard indicators */}
            <DashboardView 
              user={user}
              leaderboard={leaderboard}
              onUpdateFullUser={handleUpdateFullUser}
              onTriggerNotification={triggerNotification}
              onSync={handleCloudSync}
            />
          </div>
        )}

        {currentTab === "tips" && (
          <TipsView 
            onUpdateStats={handleUpdateStats}
            onTriggerNotification={triggerNotification}
          />
        )}

        {currentTab === "simulator" && (
          <ExtensionSimulator 
            user={user}
            onUpdateStats={handleUpdateStats}
            onTriggerNotification={triggerNotification}
          />
        )}

        {currentTab === "extension" && (
          <ExtensionDownloadView 
            userEmail={user?.email}
            blockedSites={user ? user.customBlockedSites : []}
            onTriggerNotification={triggerNotification}
          />
        )}

      </main>

      {/* 3. Outer Footer credits */}
      <footer className="border-t border-slate-100 bg-white/80 py-8 text-center text-xs text-slate-400 font-mono tracking-wider">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-slate-500">© 2026 СТОПДРОЧЬ INC. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</span>
          <div className="flex space-x-4 items-center">
            <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold border border-slate-200">v1.1 Stable</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 font-extrabold uppercase">Орден Дисциплины</span>
          </div>
        </div>
      </footer>

      {/* 4. Portal slide Toast Notification system */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full font-sans">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3 animate-scaleUp transition-transform ${
              toast.type === "success" 
                ? "bg-emerald-950 border-emerald-800 text-emerald-200" 
                : "bg-slate-900 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" ? (
                <ShieldCheck className="w-5 h-5 text-emerald-450 animate-bounce" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
              )}
            </div>
            
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 5. Authorization modal view */}
      {authOpen && (
        <AuthView 
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setAuthOpen(false)}
          onTriggerNotification={triggerNotification}
        />
      )}

    </div>
  );
}
