import { useState, FormEvent } from "react";
import { ShieldCheck, Mail, Lock, User as UserIcon, Sparkles, Shield, AlertCircle, ArrowLeft } from "lucide-react";
import { UserStats } from "../types";

interface AuthViewProps {
  onAuthSuccess: (token: string, user: UserStats) => void;
  onClose: () => void;
  onTriggerNotification: (msg: string, type: "success" | "warning") => void;
}

export default function AuthView({ onAuthSuccess, onClose, onTriggerNotification }: AuthViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!email || !password || (isSignUp && !username)) {
      setErrorMsg("Пожалуйста, заполните все обязательные поля");
      setIsLoading(false);
      return;
    }

    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
    const payload = isSignUp ? { email, username, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Произошла ошибка авторизации");
      }

      onAuthSuccess(data.token, data.user);
      onTriggerNotification(`С возвращением, ${data.user.username}! Разум защищен под надежной опекой.`, "success");
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Ошибка подключения к серверу");
      onTriggerNotification(err.message || "Ошибка подключения", "warning");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4" id="auth-modal">
      
      {/* Modal Container */}
      <div className="bg-slate-950 rounded-[32px] p-6 xs:p-8 max-w-md w-full border border-slate-850 shadow-2xl relative overflow-hidden flex flex-col justify-between animate-scaleUp">
        
        {/* Soft background blue blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Back button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition cursor-pointer"
          title="Назад"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="space-y-6 pt-2">
          
          {/* Logo brand icon */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-[16px] mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            
            <h2 className="font-sans font-black text-2xl text-white tracking-tight leading-none mt-2">
              {isSignUp ? "Создать аккаунт Силы" : "Добро пожаловать в Орден"}
            </h2>
            <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed font-semibold">
              {isSignUp 
                ? "Вы на пороге изменения качества жизни и получения полного фокуса внимания" 
                : "Отследите свой прогресс, стрик наград и защитите браузер Chrome"}
            </p>
          </div>

          {/* Form error */}
          {errorMsg && (
            <div className="bg-red-950/50 border border-red-900/60 p-3.5 rounded-2xl flex items-start space-x-2 text-red-200 text-xs text-left leading-relaxed font-bold animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submittable field list */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Username for sign up */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Ваше имя / Джедайский никнейм</label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 -translate-y-1/2 left-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Например: Сигма_Дмитрий"
                    className="w-full text-xs bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none pl-11 pr-3.5 py-3 rounded-xl font-bold text-white transition placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Электронная почта (Email)</label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 left-3.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@domain.com"
                  className="w-full text-xs bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none pl-11 pr-3.5 py-3 rounded-xl font-bold text-white transition placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400">Личный Секретный Пароль</label>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 left-3.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full text-xs bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none pl-11 pr-3.5 py-3 rounded-xl font-bold text-white transition placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Action submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-extrabold rounded-2xl text-xs tracking-wider transition-all shadow-lg shadow-blue-900/30 hover:scale-[1.01] flex items-center justify-center space-x-1.5 cursor-pointer border border-blue-500"
            >
              <span>{isLoading ? "Обработка запроса..." : isSignUp ? "НАЧАТЬ ПУТЬ ДИСЦИПЛИНЫ" : "ВОЙТИ В СИСТЕМУ"}</span>
            </button>
          </form>

          {/* Toggle between states links */}
          <div className="text-center pt-3 border-t border-slate-900">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold transition cursor-pointer"
            >
              {isSignUp ? "Уже есть аккаунт? Войдите" : "Еще нет аккаунта? Начать путь"}
            </button>
          </div>

        </div>

        {/* Brand foot credit */}
        <p className="text-[10px] text-slate-500 text-center mt-6 uppercase tracking-widest font-mono font-semibold">
          Security standard: 256-Bit SSL
        </p>

      </div>

    </div>
  );
}
