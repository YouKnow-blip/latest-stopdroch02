import { useState, useEffect } from "react";
import { ShieldAlert, Sparkles, Volume2, ShieldCheck, HeartPulse } from "lucide-react";

const SABER_QUOTES = [
  "Мяу! Твой разум должен быть чист, как синее пламя этого меча! Слабость недопустима!",
  "Искушение временно, а вечный позор слива мужской силы — вечен! Закрой эти вкладки, падаван!",
  "Мои кошачьи вибриссы чувствуют малейшие поползновения в сторону порно-похоти. Лапы на стол и дыши глубоко!",
  "Разве секундная дофаминовая слабость достойна того, чтобы ты с позором предал силу Ордена?!",
  "Каждый раз, когда ты побеждаешь минутное влечение, ты на шаг ближе к Аватару Стальной Дисциплины!"
];

interface MascotNedrochableProps {
  disciplineLevel: number;
  streakDays: number;
}

export default function MascotNedrochable({ disciplineLevel, streakDays }: MascotNedrochableProps) {
  const [isSaberOn, setIsSaberOn] = useState(true);
  const [speech, setSpeech] = useState("Приветствую тебя, Хранитель Чистого Разума! Я — Магистр Кото-Недрочабль, хранитель твоей дисциплины.");
  const [soundMimic, setSoundMimic] = useState<string | null>(null);

  // Play synthesized sci-fi lightsaber sound using Web Audio API!
  const playSaberSound = (isOn: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isOn) {
        // High-fidelity pitch-rising sound *ВЖЖЖЖХ*
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(75, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.28);
        
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.42);
      } else {
        // Low-frequency decaying sweep *пшшшт...*
        osc.type = "sine";
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.35);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.38);
      }
    } catch (e) {
      console.log("Audio permission deferred until user interaction", e);
    }
  };

  // Play synthesized purr/meow when clicking ears or nose
  const playPurrSound = () => {
    setSoundMimic("*МЯУ-МУРРР*");
    setTimeout(() => setSoundMimic(null), 1200);
    setSpeech("Мррр... Сила дисциплины течет сквозь мои усы прямо в твою префронтальную кору! Не вздумай срываться.");
    
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const gain = ctx.createGain();
      const modGain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = 55; // Low soothing hum (Cat Purr)
      
      modulator.frequency.value = 16; // 16Hz vibration tremolo
      modGain.gain.value = 18;
      
      modulator.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.95);
      
      osc.start();
      modulator.start();
      osc.stop(ctx.currentTime + 1.0);
      modulator.stop(ctx.currentTime + 1.0);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (streakDays === 0) {
      setSpeech("Слабость преодолевается борьбой. Зажги мой синий меч, собери яйца в кулак и начни очищение!");
    } else if (streakDays >= 30) {
      setSpeech(`Мяу! ${streakDays} дней чистой защиты! Ты уже благороднейший Кот-Рыцарь нашего Ордена!`);
    } else if (streakDays >= 7) {
      setSpeech(`Целых ${streakDays} дней свободы разума! Сила Космоса крепнет в твоем теле. Горжусь твоим кременным духом.`);
    } else {
      setSpeech(`Отличный разгон! ${streakDays} дней без порнозависимости. Держи осанку, дыши ровно, джедай.`);
    }
  }, [streakDays]);

  const handleSaberToggle = () => {
    const nextState = !isSaberOn;
    setIsSaberOn(nextState);
    playSaberSound(nextState);
    if (nextState) {
      setSoundMimic("*ВЖЖЖЖЖЖ-ХХХХ*");
      setSpeech(SABER_QUOTES[Math.floor(Math.random() * SABER_QUOTES.length)]);
    } else {
      setSoundMimic("*пшшшт...*");
      setSpeech("Не оставляй меня безоружным перед волнами дофаминовых искушений интернета!");
    }
    setTimeout(() => setSoundMimic(null), 1500);
  };

  const handleGetWisdom = () => {
    const randomQuote = SABER_QUOTES[Math.floor(Math.random() * SABER_QUOTES.length)];
    setSpeech(randomQuote);
    playSaberSound(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-2xl" id="mascot-jedi-panel">
      
      {/* Decorative blue radar grid backdrop */}
      <div className="absolute inset-0 ambient-blue-glow pointer-events-none opacity-40" />
      
      {/* Floating stars indicator inside */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-400">
        <HeartPulse className="w-3 h-3 text-red-500 animate-pulse" />
        <span>Кот-Маскот v1.2</span>
      </div>

      {/* Photo Mascot Character Container */}
      <div 
        onClick={playPurrSound}
        className="relative w-44 h-56 flex-shrink-0 flex items-center justify-center bg-slate-950 rounded-2xl border-2 border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden cursor-pointer group select-none"
        title="Почесать Магистра"
      >
        {/* Futuristic background grid constellations */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-80" />
        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-ping pointer-events-none" />
        <div className="absolute bottom-3 right-4 w-1 h-1 bg-red-500/40 rounded-full animate-pulse pointer-events-none" />

        {/* Real photo representation from the uploaded source image! */}
        <img 
          src="/jedi_kitten.png" 
          alt="Магистр Недрочабль"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Floating glowing aura when Saber is on */}
        {isSaberOn && (
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-color-dodge pointer-events-none animate-pulse shadow-[inset_0_0_30px_rgba(59,130,246,0.5)]" />
        )}

        {/* Light overlay glow indicator */}
        <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md border border-slate-800 px-2 py-1 rounded-lg text-center font-mono text-[9px] font-bold text-blue-400 group-hover:text-white transition-colors">
          {isSaberOn ? "⚡ МЕЧ ЗАЖЖЕН" : "💤 ОЖИДАНИЕ"}
        </div>
        
        {/* Dynamic visual sound cue label */}
        {soundMimic && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded shadow-lg border border-blue-500 animate-pulse">
            {soundMimic}
          </div>
        )}
      </div>

      {/* Dialog Speech Bubble & Actions */}
      <div className="flex-1 flex flex-col justify-between self-stretch">
        <div className="space-y-3.5">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-950/70 text-blue-400 font-extrabold px-3.5 py-1 rounded-full text-xs flex items-center space-x-1.5 border border-blue-900/60 relative">
              <Sparkles className="w-3.5 h-3.5 text-blue-450 animate-spin" />
              <span>СТОПДРОЧЬ МАСКОТ: КОТО-ДЖЕДАЙ</span>
            </span>
            <span className="text-slate-500 text-xs font-mono font-bold">Орден Воли</span>
          </div>

          {/* Speech box */}
          <div className="relative bg-slate-950/75 border border-slate-800/80 rounded-[20px] p-4 text-xs sm:text-sm font-semibold text-slate-200 shadow-inner leading-relaxed">
            <p className="whitespace-pre-line text-left leading-relaxed">«{speech}»</p>
            {/* Arrow */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-slate-950 border-l border-b border-slate-800/80 rotate-45 hidden md:block" />
          </div>
        </div>

        {/* Action Suite */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleSaberToggle}
            className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-lg ${
              isSaberOn 
                ? "bg-slate-950 text-blue-400 hover:bg-slate-850 border border-slate-850" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-950/40"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSaberOn ? "Потушить лазерный меч" : "Зажечь световой меч (ВЖУХ)"}</span>
          </button>

          <button
            type="button"
            onClick={handleGetWisdom}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>Испросить кошачьей мудрости</span>
          </button>
        </div>
      </div>

    </div>
  );
}
