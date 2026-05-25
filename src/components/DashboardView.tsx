import { useState, useEffect, FormEvent } from "react";
import { 
  Plus, Trash2, Shield, Calendar, Trophy, Zap, Clock, Users, Globe, Lock, ShieldAlert, CheckSquare, 
  Square, RefreshCw, ChevronRight, Award, HelpCircle, Gamepad2, Volume2, ShieldCheck, ZapOff 
} from "lucide-react";
import { UserStats, Achievement, DailyMission, LeaderboardUser } from "../types";

interface DashboardViewProps {
  user: UserStats;
  leaderboard: LeaderboardUser[];
  onUpdateFullUser: (updatedUser: UserStats) => void;
  onTriggerNotification: (msg: string, type: "success" | "warning") => void;
  onSync: (user: UserStats) => void;
}

export default function DashboardView({ user, leaderboard, onUpdateFullUser, onTriggerNotification, onSync }: DashboardViewProps) {
  const [newSiteInput, setNewSiteInput] = useState("");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState<"global" | "weekly">("global");

  // Timer ticker states
  const [timePassed, setTimePassed] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0
  });

  // Calculate live ticker since last slip date
  useEffect(() => {
    const slipDateStr = user.lastSlipDate || user.createdAt;
    const slipTime = new Date(slipDateStr).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = now - slipTime;

      if (difference <= 0) {
        setTimePassed({ days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const ms = Math.floor((difference % 1000) / 10); // double digits

      setTimePassed({ days, hours, minutes, seconds, ms });
    }, 45);

    return () => clearInterval(interval);
  }, [user.lastSlipDate, user.createdAt]);

  const XP_PER_LEVEL = 200;
  const currentLevelXp = user.xp % XP_PER_LEVEL;
  const xpPercentage = (currentLevelXp / XP_PER_LEVEL) * 100;
  const nextLevelXp = XP_PER_LEVEL - currentLevelXp;

  const getRankName = (level: number) => {
    if (level >= 15) return "Магистр Ордена (Grandmaster)";
    if (level >= 10) return "Рыцарь Дисциплины (Jedi Knight)";
    if (level >= 5) return "Падаван Дисциплины (Padawan)";
    return "Юнлинг (Youngling)";
  };

  // Preset Achievements
  const achievements: Achievement[] = [
    { id: "streak_1", title: "Первый Шаг", description: "Успешно продержаться 1 день чистоты разума", icon: "🌱", unlockedAt: user.streakDays >= 1 ? new Date().toISOString() : null, metricReq: 1, xpValue: 100, type: "streak" },
    { id: "streak_3", title: "Пробуждение Силы", description: "3 дня без порнозависимости", icon: "✨", unlockedAt: user.streakDays >= 3 ? new Date().toISOString() : null, metricReq: 3, xpValue: 150, type: "streak" },
    { id: "streak_7", title: "Неделя Чистоты", description: "Продержаться 7 дней чистоты разума", icon: "⚡", unlockedAt: user.streakDays >= 7 ? new Date().toISOString() : null, metricReq: 7, xpValue: 200, type: "streak" },
    { id: "streak_30", title: "Сигма Контроль", description: "Успешно преодолеть 30 дней дисциплины", icon: "🧿", unlockedAt: user.streakDays >= 30 ? new Date().toISOString() : null, metricReq: 30, xpValue: 500, type: "streak" },
    { id: "streak_90", title: "Бессмертный Дух", description: "90 дней полной свободы от порнозависимости", icon: "💫", unlockedAt: user.streakDays >= 90 ? new Date().toISOString() : null, metricReq: 90, xpValue: 1000, type: "streak" },
    { id: "prevention_10", title: "Броня Ордена", description: "Предотвратить 10 попыток срыва с помощью расширения", icon: "🛡️", unlockedAt: user.preventedSlips >= 10 ? new Date().toISOString() : null, metricReq: 10, xpValue: 200, type: "prevention" },
    { id: "prevention_25", title: "Магистр Отражения", description: "Предотвратить 25 попыток срыва", icon: "💎", unlockedAt: user.preventedSlips >= 25 ? new Date().toISOString() : null, metricReq: 25, xpValue: 300, type: "prevention" },
    { id: "discipline_level_5", title: "Недрочабильный Сигма", description: "Получить 5-й уровень дисциплины", icon: "👑", unlockedAt: user.disciplineLevel >= 5 ? new Date().toISOString() : null, metricReq: 5, xpValue: 400, type: "special" }
  ];

  // Complete Daily Mission
  const handleToggleMission = (missionId: string) => {
    let missionReward = 0;
    const updatedMissions = user.missions.map((m) => {
      if (m.id === missionId) {
        if (!m.completed) {
          missionReward = m.xpReward;
        } else {
          missionReward = -m.xpReward;
        }
        return { ...m, completed: !m.completed };
      }
      return m;
    });

    const nextXp = Math.max(0, user.xp + missionReward);
    const hasAddedLevel = Math.floor(nextXp / XP_PER_LEVEL) + 1;

    const updatedUser = {
      ...user,
      missions: updatedMissions,
      xp: nextXp,
      disciplineLevel: hasAddedLevel
    };

    onUpdateFullUser(updatedUser);
    onSync(updatedUser);

    if (missionReward > 0) {
      onTriggerNotification(`Задание выполнено! Получено +${missionReward} XP.`, "success");
    } else {
      onTriggerNotification(`Статус задания изменен обратно. Отозвано XP`, "warning");
    }
  };

  // Add custom domain
  const handleAddBlockedDomain = (e: FormEvent) => {
    e.preventDefault();
    const clean = newSiteInput.trim().toLowerCase();
    if (!clean) return;

    if (user.customBlockedSites.includes(clean)) {
      onTriggerNotification("Этот домен уже добавлен в ваш список блокировки!", "warning");
      return;
    }

    const updatedUser = {
      ...user,
      customBlockedSites: [...user.customBlockedSites, clean]
    };

    onUpdateFullUser(updatedUser);
    onSync(updatedUser);
    setNewSiteInput("");
    onTriggerNotification(`Домен ${clean} успешно добавлен в список жесткой блокировки!`, "success");
  };

  // Remove custom domain
  const handleRemoveBlockedDomain = (site: string) => {
    const updatedUser = {
      ...user,
      customBlockedSites: user.customBlockedSites.filter(s => s !== site)
    };

    onUpdateFullUser(updatedUser);
    onSync(updatedUser);
    onTriggerNotification(`Домен ${site} удален из списка`, "success");
  };

  // Toggle Strict Block mode
  const handleToggleStrictMode = () => {
    const updatedUser = {
      ...user,
      strictMode: !user.strictMode
    };

    onUpdateFullUser(updatedUser);
    onSync(updatedUser);
    if (updatedUser.strictMode) {
      onTriggerNotification("Строгий режим блокировки включен! Повышена защита.", "success");
    } else {
      onTriggerNotification("Строгий режим выключен. Но помните о своем кодексе чистой жизни.", "warning");
    }
  };

  // Handle Reset / Register slip
  const handleRegisterSlip = () => {
    const nowStr = new Date().toISOString();
    const updatedUser: UserStats = {
      ...user,
      streakDays: 0,
      lastSlipDate: nowStr,
      xp: Math.max(0, user.xp - 50)
    };

    // Recalculate level
    updatedUser.disciplineLevel = Math.floor(updatedUser.xp / XP_PER_LEVEL) + 1;

    onUpdateFullUser(updatedUser);
    onSync(updatedUser);
    setResetConfirmOpen(false);
    onTriggerNotification("Стрик сброшен. Помни слова Недрочабля: 'Это не конец пути, падаван. Вставай и бери меч снова!'", "warning");
  };

  return (
    <div className="space-y-6" id="dashboard-tab-content">
      
      {/* Profile Creation Prompt banner */}
      {(!user.username || user.username.startsWith("usr_") || user.username === "Хранитель" || user.username === "Guest") && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/15 to-red-500/10 border-2 border-amber-500/40 rounded-[28px] p-5 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-400 rounded-full flex items-center justify-center text-amber-500 flex-shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-400">ВЫ ИСПОЛЬЗУЕТЕ ВРЕМЕННЫЙ ПРОФИЛЬ ПАДАВАНА 🛡&zwj;♂️</h4>
              <p className="text-xs text-slate-305 leading-relaxed mt-1">
                Все ваши стрики, достижения и щиты заблокированных сайтов хранятся локально. Нажмите кнопку, чтобы создать полноценный профиль и подвязать все накопленные данные!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              // Trigger tab shift or show auth by searching and clicking Auth indicator
              const authTab = document.querySelector('[data-tab="auth"]') as HTMLButtonElement || document.querySelector("#nav-btn-auth") as HTMLButtonElement;
              if (authTab) {
                authTab.click();
              } else {
                // fallback scroll to tab view
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            СОЗДАТЬ И ПОДВЯЗАТЬ ПРОФИЛЬ ➔
          </button>
        </div>
      )}
      
      {/* Live Clean Timer Banner */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[32px] p-6 lg:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Blue glowing elements */}
        <div className="absolute top-0 right-1/4 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 left-12 w-64 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="space-y-3.5 relative z-10 text-center md:text-left flex-1">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1 rounded-full text-xs font-semibold text-blue-450 animate-pulse">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>ТАЙМЕР ВРЕМЕНИ ЧИСТОТЫ</span>
          </div>

          <h3 className="font-display font-medium text-slate-400 text-sm">
            Вы сохраняете волю и ментальный контроль на протяжении:
          </h3>

          {/* Running live counter */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-4 select-none">
            
            <div className="text-center bg-slate-800/60 border border-slate-705rounded-2xl p-2.5 sm:p-4 min-w-[64px] sm:min-w-[80px] shadow-lg">
              <span className="block font-mono text-xl sm:text-3xl font-black text-white leading-none">
                {timePassed.days}
              </span>
              <span className="block text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-1.5 font-bold">Дней</span>
            </div>

            <div className="text-xl font-bold text-slate-500 hidden sm:block">:</div>

            <div className="text-center bg-slate-800/60 border border-slate-705rounded-2xl p-2.5 sm:p-4 min-w-[64px] sm:min-w-[80px] shadow-lg">
              <span className="block font-mono text-xl sm:text-3xl font-black text-blue-400 leading-none">
                {String(timePassed.hours).padStart(2, "0")}
              </span>
              <span className="block text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-1.5 font-bold">Часов</span>
            </div>

            <div className="text-xl font-bold text-slate-500 hidden sm:block">:</div>

            <div className="text-center bg-slate-800/60 border border-slate-705rounded-2xl p-2.5 sm:p-4 min-w-[64px] sm:min-w-[80px] shadow-lg">
              <span className="block font-mono text-xl sm:text-3xl font-black text-blue-400 leading-none">
                {String(timePassed.minutes).padStart(2, "0")}
              </span>
              <span className="block text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-1.5 font-bold">Минут</span>
            </div>

            <div className="text-xl font-bold text-slate-500 hidden sm:block">:</div>

            <div className="text-center bg-slate-800/60 border border-slate-705rounded-2xl p-2.5 sm:p-4 min-w-[64px] sm:min-w-[80px] shadow-lg">
              <span className="block font-mono text-xl sm:text-3xl font-black text-blue-450 leading-none">
                {String(timePassed.seconds).padStart(2, "0")}
              </span>
              <span className="block text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-1.5 font-bold">Секунд</span>
            </div>

            <div className="text-xl font-bold text-blue-500/50">:</div>

            <div className="text-center bg-blue-950/20 border border-blue-900/50 rounded-2xl p-2.5 sm:p-4 min-w-[50px] sm:min-w-[64px]">
              <span className="block font-mono text-md sm:text-xl font-bold text-blue-400 leading-none">
                {String(timePassed.ms).padStart(2, "0")}
              </span>
              <span className="block text-[8px] sm:text-[10px] text-blue-500 uppercase tracking-wider mt-1 font-semibold">Мс</span>
            </div>

          </div>

          <div className="text-xs text-slate-400 italic">
            Последний раз перезапущен: <strong className="text-slate-350 font-semibold">{user.lastSlipDate ? new Date(user.lastSlipDate).toLocaleString() : "Ни разу (Великий путь!)"}</strong>
          </div>
        </div>

        {/* Emergency Reset button */}
        <div className="relative z-10 flex-shrink-0">
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-5 py-4 bg-red-600 text-white hover:bg-red-500 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-red-950/40 flex items-center space-x-2 cursor-pointer"
          >
            <ZapOff className="w-4 h-4 animate-bounce" />
            <span>ЗАРЕГИСТРИРОВАТЬ СРЫВ</span>
          </button>
        </div>

      </div>

      {/* Grid containing Metrics & Daily tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric Cards - Column 1 & 2 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shadow-inner">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">СТРИК СЕЙЧАС</span>
                <span className="block text-xl font-sans font-black text-slate-900">{user.streakDays} <span className="text-xs text-slate-400 font-serif italic">дней</span></span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shadow-inner">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">ЛУЧШИЙ СТРИК</span>
                <span className="block text-xl font-sans font-black text-slate-900">{user.bestStreakDays} <span className="text-xs text-slate-400 font-serif italic">дней</span></span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">ОТРАЖЕНО СЛИВОВ</span>
                <span className="block text-xl font-sans font-black text-slate-900">{user.preventedSlips} <span className="text-xs text-slate-400 font-serif italic">раз</span></span>
              </div>
            </div>

          </div>

          {/* XP & Level progress meter */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block font-bold">Джедайский Ранг</span>
                <h4 className="text-base font-sans font-extrabold text-slate-900">{getRankName(user.disciplineLevel)}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-blue-550 font-mono tracking-wider uppercase block font-black">Уровень Дисциплины</span>
                <strong className="text-2xl font-sans font-black text-blue-600">{user.disciplineLevel}</strong>
              </div>
            </div>

            {/* Simulated bar progress indicator */}
            <div className="space-y-2">
              <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-150 p-0.5">
                <div 
                  style={{ width: `${xpPercentage}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-605 rounded-full transition-all duration-500 shadow-md shadow-blue-500/10"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{currentLevelXp} / {XP_PER_LEVEL} XP набрано</span>
                <span>До следующего уровня осталось {nextLevelXp} XP</span>
              </div>
            </div>
          </div>

          {/* Daily Missions panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-extrabold text-slate-900 text-sm">Ежедневный Кодекс Хранителя</h3>
                <p className="text-xs text-slate-450">Каждое выполненное физическое дело укрепляет твой световой меч</p>
              </div>
              <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5 font-mono font-bold uppercase">
                Обновляется ежедневно
              </span>
            </div>

            <div className="space-y-2.5">
              {user.missions.map((mission) => (
                <div 
                  key={mission.id}
                  onClick={() => handleToggleMission(mission.id)}
                  className={`border p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                    mission.completed 
                      ? "bg-slate-50/70 border-slate-200 text-slate-400" 
                      : "bg-white hover:bg-slate-50 border-slate-100 text-slate-800 hover:border-slate-250"
                  }`}
                >
                  <div className="flex items-center space-x-3.5 flex-1 select-none">
                    {mission.completed ? (
                      <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-350 flex-shrink-0" />
                    )}
                    <div>
                      <span className={`text-xs font-semibold block ${mission.completed ? "line-through text-slate-400" : "text-slate-805"}`}>
                        {mission.title}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg ${
                    mission.completed ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-650 border border-blue-100"
                  }`}>
                    +{mission.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column sidebar controls (Blocklist, Leaderboard) */}
        <div className="space-y-6">
          
          {/* Custom site protection list */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-sans font-extrabold text-slate-900 text-sm">Кастомные Черные Списки</h3>
              <p className="text-xs text-slate-405">Добавьте домены развлечений для блокировки.</p>
            </div>

            <form onSubmit={handleAddBlockedDomain} className="flex gap-2">
              <input
                type="text"
                value={newSiteInput}
                onChange={(e) => setNewSiteInput(e.target.value)}
                placeholder="instagram.com"
                className="flex-1 text-xs border border-slate-200 focus:border-blue-500 focus:outline-none px-3.5 py-3 rounded-xl bg-slate-50 font-mono text-slate-800"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-md shadow-blue-100"
                title="Добавить домен"
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
            </form>

            {/* Target active lists */}
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
              {user.customBlockedSites.length === 0 ? (
                <div className="text-center p-4 text-[11px] text-slate-400 bg-slate-50 rounded-xl font-medium">
                  Ваш черный список пуст.
                </div>
              ) : (
                user.customBlockedSites.map((site) => (
                  <div key={site} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    <span className="text-[11px] font-mono text-slate-700 font-semibold">{site}</span>
                    <button
                      onClick={() => handleRemoveBlockedDomain(site)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-all rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Strict mode setting check */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">Строгий режим (Strict Block)</span>
                <span className="text-[10px] text-slate-400 block leading-tight">Блокирует малейшие сомнения</span>
              </div>
              
              <button
                type="button"
                onClick={handleToggleStrictMode}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer relative ${user.strictMode ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${user.strictMode ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
          </div>

          {/* Mini-leaderboard preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                <Users className="w-4.5 h-4.5 text-slate-500" />
                <span>Орден Чистоты (Рейтинг)</span>
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[250px] overflow-y-auto">
              {leaderboard.map((item) => {
                const isUser = item.username === user.username;
                return (
                  <div 
                    key={item.username} 
                    className={`flex items-center justify-between p-2.5 rounded-xl ${
                      isUser ? "bg-blue-50 border border-blue-150" : "bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-5.5 h-5.5 flex items-center justify-center font-mono text-[10px] font-bold rounded-lg ${
                        item.rank === 1 ? "bg-amber-105 text-amber-705 bg-amber-50" :
                        item.rank === 2 ? "bg-slate-200 text-slate-750" :
                        item.rank === 3 ? "bg-amber-50 text-amber-600" : "text-slate-400 bg-slate-100"
                      }`}>
                        #{item.rank}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block leading-none">
                          {item.username} {isUser && <strong className="text-[9px] text-blue-600 font-bold tracking-wide uppercase">(Вы)</strong>}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 mt-1 block font-bold">Ур. {item.disciplineLevel}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 block leading-none">{item.streakDays} дн.</span>
                      <span className="text-[9px] font-mono text-slate-400 font-semibold">{item.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Achievements Gallery section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
        <div>
          <h3 className="font-sans font-extrabold text-slate-900 text-base">Ордена и Регалии Истинной Мужественности</h3>
          <p className="text-xs text-slate-450 mt-0.5">Увеличивайте свой стрик чистоты и блокировки, чтобы открыть древние реликвии Ордена</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="achievements-box">
          {achievements.map((ach) => {
            const isUnlocked = ach.unlockedAt !== null;
            return (
              <div 
                key={ach.id}
                className={`relative border rounded-2xl p-4 text-center transition-all flex flex-col justify-between overflow-hidden ${
                  isUnlocked 
                    ? "bg-gradient-to-b from-blue-50/10 to-white border-blue-150 shadow-sm" 
                    : "bg-slate-50/50 border-slate-200/60 opacity-60"
                }`}
              >
                <div>
                  {/* Lock Overlay for locked */}
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2 bg-slate-200 text-slate-500 rounded-full p-1 shadow-inner">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}

                  {/* Icon badge */}
                  <div className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center text-xl mb-2.5 transition-all ${
                    isUnlocked ? "bg-blue-50 shadow-md shadow-blue-400/10 scale-105" : "bg-slate-100"
                  }`}>
                    {ach.icon}
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 block leading-tight">{ach.title}</h4>
                  <p className="text-[9px] text-slate-500 leading-tight mt-1 max-w-[120px] mx-auto min-h-[22px] font-medium">{ach.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[9px] font-mono text-slate-400">
                  {isUnlocked ? (
                    <span className="text-emerald-650 font-bold">✓ Открыто</span>
                  ) : (
                    <span>План: {ach.metricReq} {ach.type === "streak" ? "дн." : "раз"}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Slip modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-scaleUp">
            
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-sans font-black text-lg text-slate-900">Вы действительно совершили срыв?</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Это действие обнулит таймер чистых дней текущего стрика. Мы спишем <span className="font-bold text-red-600">-50 XP</span> сопротивления. 
                Мы не судим вас, но честность перед собой — первый рубеж джедайского исправления.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Отмена (Ложная тревога!)
              </button>
              
              <button
                onClick={handleRegisterSlip}
                className="flex-1 py-3 bg-red-650 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/25 transition"
              >
                Да, сбросить стрик
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
