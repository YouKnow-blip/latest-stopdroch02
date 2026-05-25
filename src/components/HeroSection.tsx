import { ShieldCheck, Download, Zap, Award, CheckCircle, ArrowRight, Activity, Users, Shield, Compass, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onNavigate: (tab: "hero" | "dashboard" | "tips" | "simulator" | "extension") => void;
  onOpenAuth: () => void;
  userEmail: string | undefined;
}

export default function HeroSection({ onNavigate, onOpenAuth, userEmail }: HeroSectionProps) {
  return (
    <div className="space-y-16 py-4 animate-fadeIn" id="hero-marketing-view">
      
      {/* 1. Hero Presentational Header and CTA */}
      <section className="relative overflow-hidden rounded-[36px] bg-slate-900 border border-slate-800 p-8 md:p-14 text-center md:text-left shadow-xl shadow-slate-950/20">
        
        {/* Abstract glowing ambient backgrounds */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center relative z-10">
          
          <div className="lg:col-span-3 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/70 border border-blue-900/40 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Протокол Дисциплины Ордена Активен</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-extrabold tracking-tighter leading-[0.9] text-white">
              Верни контроль <br />
              <span className="text-blue-500">над собой.</span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              СТОПДРОЧЬ помогает отказаться от порно, сохранять железную дисциплину, 
              прокачивать уровень духа и мгновенно блокировать триггеры с помощью умного Chrome Extension и Магистра Кото-Недрочабля.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate("extension")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-955/40 hover:scale-103 transition-all cursor-pointer text-sm"
              >
                <Download className="w-4.5 h-4.5 text-white" />
                <span>Установить расширение</span>
              </button>

              <button
                onClick={() => userEmail ? onNavigate("dashboard") : onOpenAuth()}
                className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg border border-slate-700/80"
              >
                <span>{userEmail ? "Регулировать Дашборд" : "Начать путь воина"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick security validation */}
            <div className="flex items-center space-x-4 pt-1.5 text-xs text-slate-500 justify-center md:justify-start font-medium font-mono">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Защищено шифрованием SSL</span>
              </div>
              <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
              <span>Безопасная синхронизация</span>
            </div>
          </div>

          {/* Jedi design HTML style mascot panel */}
          <div className="lg:col-span-2 flex justify-center w-full">
            <div className="w-full max-w-[340px] bg-slate-950 rounded-[40px] relative overflow-hidden flex flex-col items-center justify-end pb-12 pt-14 shadow-2xl min-h-[400px] border border-slate-800 group">
              {/* Blue Saber Glow Effect */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1.5 h-52 bg-blue-500 rounded-full blur-[2px] shadow-[0_0_30px_rgba(59,130,246,0.85)] animate-pulse animate-saber"></div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1.5 h-52 bg-white rounded-full opacity-90"></div>
              
              {/* Mascot silhouette */}
              <div className="relative z-10 w-44 h-44 flex flex-col items-center justify-center">
                {/* Pointy Cat ears on top of silhouette */}
                <div className="absolute top-5 w-24 flex justify-between px-3 select-none">
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-slate-800 rotate-[-15deg]" />
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-slate-800 rotate-[15deg]" />
                </div>

                <div className="w-24 h-28 bg-slate-800 rounded-t-full relative mb-[-15px] border-t border-slate-700 shadow-inner">
                  {/* Glowing neon eyes for kitty */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 flex space-x-4">
                    <div className="w-2.5 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                    <div className="w-2.5 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-5 border-b-2 border-slate-700 rounded-full opacity-40"></div>
                </div>
                <div className="w-36 h-36 bg-slate-900 rounded-full border border-slate-800 shadow-2xl flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg">
                    <Shield className="w-7 h-7 text-blue-500 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="relative z-20 text-center px-6 mt-6">
                <h3 className="text-white font-bold text-2xl tracking-tight mb-1">Кото-Недрочабль</h3>
                <p className="text-slate-400 text-sm italic font-serif leading-relaxed">
                  «Дисциплина — это единственный чистый <br/> меч твоего разума!»
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Global Metric Statistics Count section */}
      <section className="space-y-6 text-center" id="metrics-block">
        <div className="space-y-1">
          <h2 className="font-display text-blue-400 uppercase tracking-widest text-xs font-black">
            Орден Дисциплины в Числах
          </h2>
          <p className="text-xs text-slate-400">Сила сообщества против пагубной привычки</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="bg-slate-900/65 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-md">
            <span className="block font-sans font-black text-4xl text-white leading-none">12,430+</span>
            <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider mt-2.5 font-bold">Активных Джедаев</span>
          </div>

          <div className="bg-slate-900/65 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-md">
            <span className="block font-sans font-black text-4xl text-emerald-400 leading-none">142,000+</span>
            <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider mt-2.5 font-bold">Отраженных Порывов</span>
          </div>

          <div className="bg-slate-900/65 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-md">
            <div className="text-4xl font-black text-white">32 <span className="text-lg font-medium text-slate-450 font-serif italic">дня</span></div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider mt-2.5 font-bold">Средний Стрик</span>
          </div>

          <div className="bg-slate-900/65 backdrop-blur-md p-6 rounded-3xl border border-blue-900 shadow-blue-950/20 shadow-lg">
            <div className="text-4xl font-black text-blue-400">98% <span className="text-lg font-medium text-blue-300 font-serif italic">Sigma</span></div>
            <span className="block text-[10px] text-blue-300 uppercase font-mono tracking-wider mt-2.5 font-bold">Коэффициент Фокуса</span>
          </div>

        </div>
      </section>

      {/* 3. Core Platforms Advantages details */}
      <section className="space-y-8" id="advantages-section">
        <div className="text-center space-y-1">
          <h2 className="font-display font-medium text-lg text-white">Почему СТОПДРОЧЬ действительно работает?</h2>
          <p className="text-xs text-slate-400">В отличие от скучных программ, мы превратили дисциплину ума в стильную игру победы</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-900/65 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-md space-y-4 hover:scale-[1.02] transition-all duration-200 hover:border-blue-500/40">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 text-blue-400 flex items-center justify-center border border-blue-905/50 shadow-inner">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-bold text-sm text-white">Мгновенный Перехват</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              При попытке уйти на порно-сайты плагин мгновенно рендерит заградительный джедайский щит и блокирует вкладку с позором.
            </p>
          </div>

          <div className="bg-slate-900/65 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-md space-y-4 hover:scale-[1.02] transition-all duration-200 hover:border-blue-500/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-900/50 shadow-inner">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-bold text-sm text-white">Убегающая Кнопка Срыва</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Попытка кликнуть «Остаться» активирует физику побега кнопки от курсора. Нажать кнопку спуска становится математически невозможно!
            </p>
          </div>

          <div className="bg-slate-900/65 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-md space-y-4 hover:scale-[1.02] transition-all duration-200 hover:border-blue-500/40">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-500 flex items-center justify-center border border-amber-900/50 shadow-inner">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-bold text-sm text-white">Игровые Награды и XP</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Выполняйте ежедневные медитативные или спортивные квесты, накапливайте опыт, зарабатывая звание Древнего Сигмы разума.
            </p>
          </div>

          <div className="bg-slate-900/65 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-md space-y-4 hover:scale-[1.02] transition-all duration-200 hover:border-blue-500/40">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 text-purple-400 flex items-center justify-center border border-purple-900/50 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-bold text-sm text-white">Синхронизация Облака</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Каждый предотвращенный срывок на телефоне или ПК синхронизируется в единую SaaS панель. Статистика чиста везде.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Mockup Dashboard Showcase */}
      <section className="space-y-6" id="dashboard-mockup-section">
        <div className="text-center space-y-1">
          <h2 className="font-display font-medium text-lg text-white">Панель управления Дисциплиной воина</h2>
          <p className="text-xs text-slate-400">Управляйте блокировками, зарабатывайте XP и следите за здоровьем кликов</p>
        </div>

        <div className="relative p-2.5 bg-slate-950/60 rounded-[32px] border border-slate-800 shadow-xl max-w-4xl mx-auto overflow-hidden">
          
          {/* Top fake bar */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/80 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-805 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-5.5 h-5.5 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">С</div>
                <span className="text-xs font-bold text-slate-200">STOPIAP_ST_APP (Юный Джедай)</span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">В Сети ✓</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-805">
                <span className="block text-[9px] text-slate-500 font-mono tracking-wider">ДНЕЙ ЧИСТОТЫ</span>
                <span className="block text-lg font-bold text-white">5 Дней</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-805">
                <span className="block text-[9px] text-slate-500 font-mono tracking-wider">ОТРАЖЕНО ВСПЛЕСКОВ</span>
                <span className="block text-lg font-bold text-white">24 Раза</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-805">
                <span className="block text-[9px] text-slate-500 font-mono tracking-wider">РАНГ ОРДЕНА</span>
                <span className="block text-xs font-bold text-blue-450 uppercase tracking-wide mt-1.5 leading-none">Уровней 3: Падаван</span>
              </div>
            </div>

            <div className="text-right pt-1">
              <button 
                onClick={() => onNavigate("dashboard")}
                className="text-xs text-blue-400 font-bold hover:text-blue-300 inline-flex items-center space-x-1"
              >
                <span>Открыть настоящий дашборд</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Clean CTA Section Block */}
      <section className="bg-gradient-to-tr from-blue-700 to-slate-950 rounded-[36px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl border border-blue-900/50" id="hero-cta">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-0 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          <h2 className="font-display font-black text-2xl sm:text-3xl leading-snug text-white">
            Готовы разжечь синий световой меч дисциплины?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold">
            Присоединяйтесь к тысячам воинов, очистивших свое подсознание от зависимости. 
            Установите плагин, синхронизируйте профиль и победите похотливые страсти раз и навсегда.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate("extension")}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md text-xs tracking-wider transition-all cursor-pointer border border-blue-500 hover:scale-103"
            >
              СКАЧАТЬ РАСШИРЕНИЕ
            </button>
            <button
              onClick={() => userEmail ? onNavigate("dashboard") : onOpenAuth()}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold rounded-xl text-xs tracking-wider transition-all cursor-pointer"
            >
              НАЧАТЬ ПУТЬ СЕЙЧАС
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
