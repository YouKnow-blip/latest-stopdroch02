import { Shield, Trophy, Activity, AlertTriangle, LogIn, LogOut, User as UserIcon, Calendar, Zap } from "lucide-react";
import { UserStats } from "../types";

interface NavbarProps {
  user: UserStats | null;
  onNavigate: (tab: "hero" | "dashboard" | "tips" | "simulator" | "extension") => void;
  currentTab: string;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ user, onNavigate, currentTab, onLogout, onOpenAuth }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div 
          onClick={() => onNavigate("hero")} 
          className="flex items-center space-x-2.5 cursor-pointer group"
          id="nav-logo"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-950/50 group-hover:scale-105 transition-transform duration-200">
            <div className="w-1 h-6 bg-white rounded-full rotate-12 shadow-[0_0_8px_rgba(255,255,255,0.9)] mr-1" />
            <Shield className="w-4 h-4 text-white -ml-0.5" />
            <div className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-tighter text-white group-hover:text-blue-400 transition-colors">
              СТОПДРОЧЬ
            </span>
            <div className="text-[9px] font-mono font-bold text-blue-400/80 -mt-1 leading-none tracking-widest uppercase">
              ОРДЕН ДИСЦИПЛИНЫ
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1" id="nav-menu">
          <button
            onClick={() => onNavigate("hero")}
            className={`px-4 py-2 text-sm font-bold rounded-full tracking-tight transition-all duration-150 ${
              currentTab === "hero" ? "text-blue-400 bg-blue-950/50 border border-blue-900/30" : "text-slate-400 hover:text-white hover:bg-slate-900/50"
            }`}
          >
            Главная
          </button>
          
          <button
            onClick={() => onNavigate("dashboard")}
            className={`px-4 py-2 text-sm font-bold rounded-full tracking-tight transition-all duration-150 flex items-center space-x-1.5 ${
              currentTab === "dashboard" ? "text-blue-400 bg-blue-950/50 border border-blue-900/30" : "text-slate-400 hover:text-white hover:bg-slate-900/50"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Статистика</span>
          </button>

          <button
            onClick={() => onNavigate("tips")}
            className={`px-4 py-2 text-sm font-bold rounded-full tracking-tight transition-all duration-150 flex items-center space-x-1.5 ${
              currentTab === "tips" ? "text-blue-400 bg-blue-950/50 border border-blue-900/30" : "text-slate-400 hover:text-white hover:bg-slate-900/50"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Советы</span>
          </button>

          <button
            onClick={() => onNavigate("simulator")}
            className={`px-4 py-2 text-sm font-bold rounded-full tracking-tight transition-all duration-150 flex items-center space-x-1.5 ${
              currentTab === "simulator" ? "text-blue-405 bg-blue-950/50 border border-blue-900/30" : "text-slate-450 hover:text-white hover:bg-slate-900/50"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Симулятор</span>
            <span className="bg-amber-950 text-amber-400 border border-amber-900/60 font-bold px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
              Тест
            </span>
          </button>

          <button
            onClick={() => onNavigate("extension")}
            className={`px-4 py-2 text-sm font-bold rounded-full tracking-tight transition-all duration-150 flex items-center space-x-1.5 ${
              currentTab === "extension" ? "text-blue-400 bg-blue-950/50 border border-blue-900/30" : "text-slate-400 hover:text-white hover:bg-slate-900/50"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>Chrome Extension</span>
          </button>
        </nav>

        {/* User profile / Actions */}
        <div className="flex items-center space-x-3.5" id="nav-user-actions">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Clean counter */}
              <div className="hidden sm:flex items-center space-x-3 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-inner">
                <div className="flex items-center text-slate-400 space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-450 animate-pulse" />
                  <span>Стрик: <strong className="font-extrabold text-blue-450 font-mono">{user.streakDays} дней</strong></span>
                </div>
                <div className="h-3 w-[1px] bg-slate-800" />
                <div className="flex items-center text-slate-400 space-x-1">
                  <span className="bg-blue-600 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-black shadow-sm">
                    L
                  </span>
                  <span>Уровень: <strong className="font-extrabold text-blue-450 font-mono">{user.disciplineLevel}</strong></span>
                </div>
              </div>

              {/* Profile/Logout menu */}
              <div className="flex items-center space-x-1.5">
                <div className="bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-550/20">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-300 hidden lg:inline max-w-[120px] truncate">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Выйти"
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-900 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAuth}
                className="text-sm font-semibold px-4 py-2 text-slate-450 hover:text-white transition-colors"
              >
                Вход
              </button>
              <button
                onClick={onOpenAuth}
                className="text-sm font-semibold px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-550 transition-colors shadow-lg shadow-blue-950/40"
              >
                Начать путь
              </button>
            </div>
          )}

          {/* Quick links header for mobile */}
          <div className="flex md:hidden space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-[11px]">
            <button 
              onClick={() => onNavigate("dashboard")}
              className={`p-1.5 px-3.5 rounded-lg font-bold transition-all ${currentTab === "dashboard" ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              Дашборд
            </button>
            <button 
              onClick={() => onNavigate("simulator")}
              className={`p-1.5 px-3.5 rounded-lg font-bold transition-all ${currentTab === "simulator" ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              Тест
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
