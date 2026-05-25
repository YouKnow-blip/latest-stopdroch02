export interface UserStats {
  id: string;
  username: string;
  email: string;
  streakDays: number;
  bestStreakDays: number;
  preventedSlips: number;
  disciplineLevel: number; // calculated from streak and missions
  xp: number;
  lastSlipDate: string | null;
  createdAt: string;
  customBlockedSites: string[];
  whitelistSites: string[];
  strictMode: boolean;
  missions: DailyMission[];
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  xpValue: number;
  metricReq: number; // e.g. 1, 3, 7, 30 days
  type: "streak" | "prevention" | "special";
}

export interface DailyMission {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  completed: boolean;
  category: "sport" | "mind" | "discipline" | "social" | "detox";
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  streakDays: number;
  disciplineLevel: number;
  xp: number;
  isCurrentUser?: boolean;
}

export interface AdviceItem {
  id: string;
  title: string;
  category: "sport" | "sleep" | "meditation" | "detox" | "productivity" | "social";
  summary: string;
  content: string;
  actionStep: string;
}

export interface Quote {
  text: string;
  author: string;
}
