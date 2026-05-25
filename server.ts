import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db_state.json");

app.use(express.json());

// Seeding standard system records if db_state.json doesn't exist
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: {
        "drugperedaca@gmail.com": {
          id: "usr_1",
          username: "Юный Джедай",
          email: "drugperedaca@gmail.com",
          passwordHash: "$2b$10$xyz", // Mock hash
          streakDays: 5,
          bestStreakDays: 14,
          preventedSlips: 24,
          disciplineLevel: 3,
          xp: 450,
          lastSlipDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          customBlockedSites: ["vk.com/feed", "instagram.com"],
          whitelistSites: ["ai.studio/build", "github.com"],
          strictMode: true,
          missions: [
            { id: "m1", title: "Сделать 20 отжиманий", completed: true, category: "sport", xpReward: 50 },
            { id: "m2", title: "10 минут медитации Дисциплины", completed: false, category: "mind", xpReward: 50 },
            { id: "m3", title: "Прочесть 1 совет Недрочабля", completed: true, category: "discipline", xpReward: 30 },
            { id: "m4", title: "Ограничить соцсети до 30 минут", completed: false, category: "detox", xpReward: 60 }
          ],
          unlockedAchievements: ["streak_1", "prevention_10"]
        }
      },
      leaderboard: [
        { rank: 1, username: "Джедан_Магистр", streakDays: 124, disciplineLevel: 25, xp: 12400 },
        { rank: 2, username: "Сигма_Дмитрий", streakDays: 42, disciplineLevel: 11, xp: 4200 },
        { rank: 3, username: "Недрочабль_В_Капюшоне", streakDays: 28, disciplineLevel: 8, xp: 2800 },
        { rank: 4, username: "Укротитель_Дофамина", streakDays: 17, disciplineLevel: 5, xp: 1700 },
        { rank: 5, username: "Дисциплина_И_Честь", streakDays: 12, disciplineLevel: 4, xp: 1200 },
        { rank: 6, username: "Юный Джедай", streakDays: 5, disciplineLevel: 3, xp: 450 }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
}

initDB();

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (err) {
    return { users: {}, leaderboard: [] };
  }
}

function writeData(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// REST APIs
// Auth registration
app.post("/api/auth/register", (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: "Все поля обязательны для заполнения" });
  }

  const data = readData();
  const lowerEmail = email.toLowerCase();

  if (data.users[lowerEmail]) {
    return res.status(400).json({ error: "Пользователь с таким email уже существует" });
  }

  // Set new user record
  data.users[lowerEmail] = {
    id: "usr_" + Math.random().toString(36).substring(2, 9),
    username: username,
    email: lowerEmail,
    passwordHash: "$2b$10$custommockedhash", 
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

  // Add metadata for ranking
  data.leaderboard.push({
    rank: data.leaderboard.length + 1,
    username: username,
    streakDays: 0,
    disciplineLevel: 1,
    xp: 0
  });

  writeData(data);

  res.json({
    token: "jwt_mock_token_for_" + lowerEmail,
    user: data.users[lowerEmail]
  });
});

// Auth login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const data = readData();
  const lowerEmail = email.toLowerCase();
  
  const user = data.users[lowerEmail];
  if (!user) {
    return res.status(400).json({ error: "Пользователь не найден" });
  }

  // In a actual production app we compare hashes, we simulate checking here
  res.json({
    token: "jwt_mock_token_for_" + lowerEmail,
    user: user
  });
});

// Sync data (vital for Extension & web actions)
app.post("/api/user/sync", (req, res) => {
  const { email, streakDays, bestStreakDays, preventedSlips, disciplineLevel, xp, customBlockedSites, strictMode, missions, unlockedAchievements } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email пользователя обязателен" });
  }

  const data = readData();
  const lowerEmail = email.toLowerCase();

  if (!data.users[lowerEmail]) {
    return res.status(404).json({ error: "Покупатель/аккаунт не найден" });
  }

  const user = data.users[lowerEmail];
  
  if (streakDays !== undefined) user.streakDays = streakDays;
  if (bestStreakDays !== undefined) user.bestStreakDays = Math.max(user.bestStreakDays, bestStreakDays, user.streakDays);
  if (preventedSlips !== undefined) user.preventedSlips = preventedSlips;
  if (xp !== undefined) {
    user.xp = xp;
    // Keep discipline level dynamic based on XP: Level = floor(xp / 200) + 1
    user.disciplineLevel = Math.floor(user.xp / 200) + 1;
  }
  if (customBlockedSites !== undefined) user.customBlockedSites = customBlockedSites;
  if (strictMode !== undefined) user.strictMode = strictMode;
  if (missions !== undefined) user.missions = missions;
  if (unlockedAchievements !== undefined) user.unlockedAchievements = unlockedAchievements;

  // Update leaderboard with new stats
  const idx = data.leaderboard.findIndex((l: any) => l.username === user.username);
  if (idx !== -1) {
    data.leaderboard[idx].streakDays = user.streakDays;
    data.leaderboard[idx].disciplineLevel = user.disciplineLevel;
    data.leaderboard[idx].xp = user.xp;
  } else {
    data.leaderboard.push({
      rank: data.leaderboard.length + 1,
      username: user.username,
      streakDays: user.streakDays,
      disciplineLevel: user.disciplineLevel,
      xp: user.xp
    });
  }

  // Re-sort leaderboard by XP then Streak
  data.leaderboard.sort((a: any, b: any) => b.xp - a.xp || b.streakDays - a.streakDays);
  data.leaderboard.forEach((item: any, i: number) => {
    item.rank = i + 1;
  });

  writeData(data);
  res.json({ success: true, user });
});

// Return custom Quote selection
app.get("/api/quotes", (req, res) => {
  const quotes = [
    { text: "Недрочабильный дух не знает преград. Твой меч горит синим, затуши им огонь страстей.", author: "Магистр Недрочабль" },
    { text: "Дофаминовая пустыня порождает сильных воинов. Твое сопротивление сегодня — это воля завтра.", author: "Джедай Дисциплины" },
    { text: "Удовольствие длится 5 минут. Гордость за победу над собой длится всю жизнь.", author: "Мастер Кодекса" },
    { text: "Сигма парень контролирует свое семя и свой разум. Ты не раб плоти.", author: "Кодекс Сигмы" },
    { text: "Каждый предотвращенный клик — это кирпич в храм твоей чистой силы.", author: "Древо Медитации" },
    { text: "Дофаминовый загон удел слабых. Джедай владеет своей силой.", author: "Свиток Силы" }
  ];
  const rand = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(rand);
});

// Return Leaderboard info
app.get("/api/leaderboard", (req, res) => {
  const data = readData();
  res.json(data.leaderboard);
});

// Serve jedi_kitten.png static file
app.get("/jedi_kitten.png", (req, res) => {
  const imgPath = path.join(process.cwd(), "src/assets/images", "jedi_kitten_1779696044470.png");
  if (fs.existsSync(imgPath)) {
    res.sendFile(imgPath);
  } else {
    res.status(404).send("Not found");
  }
});

// Vite Setup on active server
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`STOPIAP_ST_APP is successfully running on http://0.0.0.0:${PORT}`);
  });
}

configureServer();
