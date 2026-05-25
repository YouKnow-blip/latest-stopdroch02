import { 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc 
} from "firebase/firestore";
import { auth, db, OperationType, handleFirestoreError } from "./firebase";
import { UserStats, DailyMission } from "../types";

// Default starting missions for a new user
const DEFAULT_MISSIONS: DailyMission[] = [
  { id: "m1", title: "Сделать 20 отжиманий", completed: false, category: "sport", xpReward: 50 },
  { id: "m2", title: "10 минут медитации Дисциплины", completed: false, category: "mind", xpReward: 50 },
  { id: "m3", title: "Прочесть 1 совет Недрочабля", completed: false, category: "discipline", xpReward: 30 },
  { id: "m4", title: "Ограничить соцсети до 30 минут", completed: false, category: "detox", xpReward: 60 }
];

/**
 * Ensures an anonymous Firebase session is active if no user is signed in.
 */
export async function ensureAnonymousSession(): Promise<FirebaseUser> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        try {
          const credential = await signInAnonymously(auth);
          resolve(credential.user);
        } catch (error) {
          console.error("Firebase Anonymous Auth failed", error);
          reject(error);
        }
      }
    });
  });
}

/**
 * Loads user profile stats from Firestore.
 * If none exist, seeds one with default local values under the user's UID.
 */
export async function loadOrCreateUserProfile(fbUser: FirebaseUser, fallbackLocalStats?: Partial<UserStats>): Promise<UserStats> {
  const docRef = doc(db, "users", fbUser.uid);
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserStats;
    } else {
      // Create new profile
      const email = fbUser.email || fallbackLocalStats?.email || "anonymous@stopdroch.app";
      const username = fbUser.displayName || fallbackLocalStats?.username || (fbUser.isAnonymous ? `Падаван #${fbUser.uid.substring(0, 5)}` : "Юный Джедай");
      
      const newStats: UserStats = {
        id: fbUser.uid,
        username,
        email,
        streakDays: fallbackLocalStats?.streakDays ?? 5,
        bestStreakDays: fallbackLocalStats?.bestStreakDays ?? 14,
        preventedSlips: fallbackLocalStats?.preventedSlips ?? 24,
        disciplineLevel: fallbackLocalStats?.disciplineLevel ?? 3,
        xp: fallbackLocalStats?.xp ?? 450,
        lastSlipDate: fallbackLocalStats?.lastSlipDate ?? new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        customBlockedSites: fallbackLocalStats?.customBlockedSites ?? ["instagram.com", "vk.com"],
        whitelistSites: fallbackLocalStats?.whitelistSites ?? [],
        strictMode: fallbackLocalStats?.strictMode ?? true,
        missions: fallbackLocalStats?.missions ?? DEFAULT_MISSIONS,
        unlockedAchievements: fallbackLocalStats?.unlockedAchievements ?? ["streak_1", "prevention_10"]
      };

      await setDoc(docRef, newStats);
      return newStats;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
    throw error;
  }
}

/**
 * Saves current user state to Firestore.
 */
export async function syncUserProfileToFirebase(userStats: UserStats): Promise<void> {
  if (!auth.currentUser) return;
  // Ensure we write with the logged in UID to comply with firestore rules
  const docRef = doc(db, "users", auth.currentUser.uid);
  try {
    const dataToWrite = {
      ...userStats,
      id: auth.currentUser.uid // match document field to security rule
    };
    await setDoc(docRef, dataToWrite, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
  }
}

/**
 * Register a user via custom email and password, transferring current anonymous stats.
 */
export async function registerWithEmail(email: string, passwordHash: string, username: string, currentStats?: UserStats): Promise<{ user: UserStats; token: string }> {
  try {
    // Create new account
    const cred = await createUserWithEmailAndPassword(auth, email, passwordHash);
    
    // Set display name
    await updateProfile(cred.user, { displayName: username });

    // Build the user data
    const newStats: UserStats = {
      id: cred.user.uid,
      username,
      email: email.toLowerCase(),
      streakDays: currentStats?.streakDays ?? 0,
      bestStreakDays: currentStats?.bestStreakDays ?? 0,
      preventedSlips: currentStats?.preventedSlips ?? 0,
      disciplineLevel: currentStats?.disciplineLevel ?? 1,
      xp: currentStats?.xp ?? 0,
      lastSlipDate: currentStats?.lastSlipDate ?? null,
      createdAt: new Date().toISOString(),
      customBlockedSites: currentStats?.customBlockedSites ?? [],
      whitelistSites: currentStats?.whitelistSites ?? [],
      strictMode: currentStats?.strictMode ?? false,
      missions: currentStats?.missions ?? DEFAULT_MISSIONS,
      unlockedAchievements: currentStats?.unlockedAchievements ?? []
    };

    // Save to Firestore
    await setDoc(doc(db, "users", cred.user.uid), newStats);
    
    return {
      user: newStats,
      token: `fb_token_${cred.user.uid}`
    };
  } catch (error: any) {
    throw new Error(error.message || "Ошибка при регистрации в Firebase Auth");
  }
}

/**
 * Login existing user with email and password.
 */
export async function loginWithEmail(email: string, passwordHash: string): Promise<{ user: UserStats; token: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, passwordHash);
    const docSnap = await getDoc(doc(db, "users", cred.user.uid));
    
    let stats: UserStats;
    if (docSnap.exists()) {
      stats = docSnap.data() as UserStats;
    } else {
      // Fallback
      stats = {
        id: cred.user.uid,
        username: cred.user.displayName || "Джедай Ордена",
        email: cred.user.email || email,
        streakDays: 5,
        bestStreakDays: 14,
        preventedSlips: 24,
        disciplineLevel: 3,
        xp: 450,
        lastSlipDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        customBlockedSites: ["instagram.com", "vk.com"],
        whitelistSites: [],
        strictMode: true,
        missions: DEFAULT_MISSIONS,
        unlockedAchievements: ["streak_1", "prevention_10"]
      };
      await setDoc(doc(db, "users", cred.user.uid), stats);
    }

    return {
      user: stats,
      token: `fb_token_${cred.user.uid}`
    };
  } catch (error: any) {
    let msg = error.message || "Ошибка авторизации";
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      msg = "Неверная комбинация email и секретного пароля";
    }
    throw new Error(msg);
  }
}

/**
 * Logout the authenticated user and fallback back to a fresh anonymous session.
 */
export async function logoutUserProfile(): Promise<UserStats> {
  await signOut(auth);
  const anonUser = await signInAnonymously(auth);
  
  const freshStats: UserStats = {
    id: anonUser.user.uid,
    username: `Падаван #${anonUser.user.uid.substring(0, 5)}`,
    email: "anonymous@stopdroch.app",
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
    missions: DEFAULT_MISSIONS,
    unlockedAchievements: []
  };

  await setDoc(doc(db, "users", anonUser.user.uid), freshStats);
  return freshStats;
}
