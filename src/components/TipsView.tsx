import { useState } from "react";
import { Dumbbell, ShieldAlert, Brain, Coffee, Calendar, Users, EyeOff, Sparkles, CheckCircle, Zap } from "lucide-react";
import { AdviceItem } from "../types";

interface TipsViewProps {
  onUpdateStats: (xpGift: number, preventedGift: number) => void;
  onTriggerNotification: (msg: string, type: "success" | "warning") => void;
}

export default function TipsView({ onUpdateStats, onTriggerNotification }: TipsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "sport" | "sleep" | "meditation" | "detox" | "productivity" | "social">("all");
  const [completedTips, setCompletedTips] = useState<string[]>([]);

  const tipsList: AdviceItem[] = [
    {
      id: "t_sport_1",
      category: "sport",
      title: "Холодный душ при первой мысли об урге",
      summary: "Физический контрастный шок заставляет сосуды сжиматься, моментально вымывая дофаминовую зацикленность из лимбической системы.",
      content: "Когда вы чувствуете непреодолимый позыв открыть инкогнито, ваше тело находится в режиме дефицита дофамина. Холодная вода симулирует физический стресс, заставляя надпочечники вырабатывать норадреналин. Это мгновенно отрезвляет разум.",
      actionStep: "Включите холодную воду на максимум и просто простойте под ней 45 секунд, дыша глубоко через рот."
    },
    {
      id: "t_sport_2",
      category: "sport",
      title: "Принцип 20 отжиманий / Планка",
      summary: "Замещение сексуальной энергии мышечным напряжением. Кровь отливает от паховой зоны к крупным группам мышц.",
      content: "Прилив агрессии или урга — это сырая нерастраченная физическая сила. Вместо того чтобы сливать её, превратите её в мышечные волокна.",
      actionStep: "Упадите на пол прямо сейчас и сделайте 20 отжиманий в максимальном темпе, либо простойте в планке 1.5 минуты."
    },
    {
      id: "t_sleep_1",
      category: "sleep",
      title: "Телефон за пределами спальни за 1 час до сна",
      summary: "92% срывов происходят в постели со смартфона между 22:00 и 01:00.",
      content: "Спальня должна ассоциироваться исключительно со сном. Синий свет экрана блокирует выработку мелатонина, нарушая фазы сна и делая ваш лобковой контроль на следующий день слабым.",
      actionStep: "Поставьте телефон на зарядку в другой комнате за 60 минут до отхода ко сну."
    },
    {
      id: "t_med_1",
      category: "meditation",
      title: "Дыхательный цикл «Коробка» (4-4-4-4)",
      summary: "Снижает активность миндалевидного тела и возвращает управление префронтальной коре.",
      content: "При урге дыхание становится неглубоким и частым, запуская панику. Квадратное дыхание (вдох 4с, задержка 4с, выдох 4с, задержка 4с) стабилизирует ЦНС.",
      actionStep: "Сделайте 5 полных циклов квадратного дыхания прямо сейчас перед экраном."
    },
    {
      id: "t_detox_1",
      category: "detox",
      title: "Режим серого экрана на телефоне",
      summary: "Сделайте ваш телефон скучным. Мозг перестает видеть в нем легкую конфету.",
      content: "Яркие иконки приложений и сайтов созданы для стимуляции удержания. Перевод экрана в оттенки серого рушит этот инстинкт.",
      actionStep: "Зайдите в настройки универсального доступа вашего смартфона и включите оттенки серого."
    },
    {
      id: "t_prod_1",
      category: "productivity",
      title: "Блокировка триггерных триггеров Помодоро",
      summary: "Каждые 25 минут глубокой работы очищают фокус на 3 часа.",
      content: "Прокрастинация — главный мост к порнографии. Мозг пытается сбежать от сложной интеллектуальной задачи в простую дофаминовую яму.",
      actionStep: "Запустите Помодоро таймер на 25 минут для текущей сложной задачи и уберите телефон."
    },
    {
      id: "t_social_1",
      category: "social",
      title: "Прогулка без наушников в парке",
      summary: "Снимает социальную тревожность и изоляцию — главные истоки зависимости.",
      content: "Сексуализированная зависимость процветает в изоляции. Реальный физический контакт глазами с другими людьми возвращает вас в социум.",
      actionStep: "Выйдите из комнаты на 15 минут в людное место без телефона или наушников."
    }
  ];

  const categories = [
    { id: "all", label: "Все советы", icon: Sparkles },
    { id: "sport", label: "Спорт", icon: Dumbbell },
    { id: "sleep", label: "Гигиена сна", icon: EyeOff },
    { id: "meditation", label: "Медитация", icon: Brain },
    { id: "detox", label: "Dopamine Detox", icon: Coffee },
    { id: "productivity", label: "Продуктивность", icon: Calendar },
    { id: "social", label: "Кооперация", icon: Users }
  ];

  const handleCompleteTip = (id: string) => {
    if (completedTips.includes(id)) {
      onTriggerNotification("Совет уже был выполнен вами сегодня!", "warning");
      return;
    }

    setCompletedTips([...completedTips, id]);
    onUpdateStats(20, 0); // Give 20 XP for action fulfillment!
    onTriggerNotification("Великолепно! Вы выполнили шаг действия дисциплины и получили +20 XP!", "success");
  };

  const filteredTips = selectedCategory === "all" 
    ? tipsList 
    : tipsList.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6" id="tips-tab-view">
      
      {/* Category Header Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-extrabold text-slate-905 text-lg">
            Дисциплинарная Аптека Ордена
          </h2>
          <p className="text-xs text-slate-500 mt-1">Реальные научно-доказанные практики борьбы с импульсами</p>
        </div>
      </div>

      {/* Horizontal filter capsules */}
      <div className="flex flex-wrap gap-2.5" id="tips-category-pills">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                isSelected 
                  ? "bg-slate-900 border border-slate-800 text-white shadow-lg shadow-slate-900/10" 
                  : "bg-white border border-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-sm"
              }`}
            >
              <CatIcon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="tips-cards-grid">
        {filteredTips.map((tip) => {
          const isCompleted = completedTips.includes(tip.id);
          return (
            <div 
              key={tip.id}
              className={`bg-white rounded-[32px] p-6 flex flex-col justify-between border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-105 transition-all duration-200 ${
                isCompleted ? "bg-emerald-500/5 border-emerald-100" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase py-0.5 px-2.5 rounded-full tracking-wider border border-blue-100">
                    {tip.category.toUpperCase()}
                  </span>
                  
                  {isCompleted && (
                    <span className="text-emerald-600 flex items-center space-x-1 text-xs font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Выполнено</span>
                    </span>
                  )}
                </div>

                <h3 className="font-sans font-black text-slate-900 text-base leading-tight">
                  {tip.title}
                </h3>
                
                <p className="text-xs text-slate-400 mt-2 italic font-serif">
                  {tip.summary}
                </p>

                <div className="my-4 text-xs text-slate-650 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed font-medium">
                  {tip.content}
                </div>
              </div>

              {/* Action Box */}
              <div className="pt-4 border-t border-slate-100 space-y-3.5">
                <div className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                  ⚠️ <strong>Шаг действия:</strong> {tip.actionStep}
                </div>

                <button
                  type="button"
                  onClick={() => handleCompleteTip(tip.id)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    isCompleted 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-150" 
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isCompleted ? "Шаг выполнен сегодня (+20 XP получен)" : "Выполнить шаг действия (+20 XP)"}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
