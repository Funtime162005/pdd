import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithGoogleFirebase, isFirebaseConfigured, signOutFirebase } from '../utils/firebase';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { API_URL } from '../constants/config';


const fetchWithTimeout = async (url: string, options: any, timeoutMs = 2000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

type UserData = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  streak: number;
  level: string;
  levelProgress: number;
  learningLanguage: string;
  completedModules: string[]; // tracks completed pillars at current tier e.g. ['foundations','communication']
};

type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<UserData | null>;
  register: (email: string, password?: string, name?: string) => Promise<UserData | null>;
  logout: () => Promise<void>;
  updateProgress: (xpGained: number) => void;
  setAssessmentLevel: (level: string, score: number) => void;
  updateProfile: (name: string, avatar: string) => Promise<void>;
  setLearningLanguage: (langId: string) => Promise<void>;
  loginWithGoogle: (email: string, name?: string) => Promise<UserData | null>;
  completeModule: (moduleId: string) => Promise<{ leveledUp: boolean; newTier: string } | null>;
  completeLevel: (levelNum: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const failsafe = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 3000);

    const loadUser = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        const lang = await AsyncStorage.getItem('learningLanguage') || 'tamil';
        const localXpStr = await AsyncStorage.getItem('localXp');
        const localLevel = await AsyncStorage.getItem('localLevel');
        const localCompletedStr = await AsyncStorage.getItem('localCompletedModules');
        
        const savedXp = localXpStr ? parseInt(localXpStr, 10) : 0;
        const savedLevel = localLevel || 'Beginner - Level 1';
        let savedCompleted = [];
        try { savedCompleted = localCompletedStr ? JSON.parse(localCompletedStr) : []; } catch(e) {}

        if (!email) {
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }
          if (isSupabaseConfigured && supabase) {
            try {
              const { data: supaProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .maybeSingle();

              if (supaProfile) {
                const userFromSupa: UserData = {
                  id: supaProfile.id,
                  email: supaProfile.email,
                  name: supaProfile.name,
                  avatar: supaProfile.avatar || 'tiger',
                  xp: supaProfile.xp || 0,
                  streak: supaProfile.streak || 1,
                  level: supaProfile.level || 'Beginner - Level 1',
                  levelProgress: supaProfile.level_progress || 0,
                  learningLanguage: supaProfile.learning_language || lang,
                  completedModules: supaProfile.completed_modules || []
                };
                setUser(userFromSupa);
                await AsyncStorage.setItem('localLevel', userFromSupa.level);
                return;
              }
            } catch (supaErr) {
              console.warn('Failed to load profile from Supabase:', supaErr);
            }
          }

          try {
            const res = await fetchWithTimeout(`${API_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data && data.error) {
              setUser({ id: 'local1', email, name: email.split('@')[0], avatar: 'tiger', xp: savedXp, streak: 5, level: savedLevel, levelProgress: 60, learningLanguage: lang, completedModules: savedCompleted });
            } else {
              setUser({ ...data, learningLanguage: data.learningLanguage || lang, completedModules: data.completedModules || [] });
            }
          } catch (e) {
            console.warn('MongoDB load error (falling back to offline mode):', e);
            setUser({ id: 'local1', email, name: email.split('@')[0], avatar: 'tiger', xp: savedXp, streak: 5, level: savedLevel, levelProgress: 60, learningLanguage: lang, completedModules: savedCompleted });
          }
      } catch (err) {
        console.warn('Fatal error in loadUser:', err);
      } finally {
        if (isMounted) {
          clearTimeout(failsafe);
          setIsLoading(false);
        }
      }
    };
    loadUser();
    return () => { isMounted = false; clearTimeout(failsafe); };
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);

    // First, try Firebase Authentication if a password is provided.
    // We do this outside the backend try/catch so auth errors are actually thrown back to the UI.
    if (password) {
      try {
        const { signInWithEmailFirebase } = await import('../utils/firebase');
        await signInWithEmailFirebase(email, password);
      } catch (authError) {
        setIsLoading(false);
        throw authError; // Throw so the UI shows 'Login failed' instead of logging them in!
      }
    }

    try {
      await AsyncStorage.setItem('userEmail', email);
      const res = await fetchWithTimeout(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      const lang = await AsyncStorage.getItem('learningLanguage') || 'tamil';
      
      const localXpStr = await AsyncStorage.getItem('localXp');
      const localLevel = await AsyncStorage.getItem('localLevel');
      const localCompletedStr = await AsyncStorage.getItem('localCompletedModules');
      
      const savedXp = localXpStr ? parseInt(localXpStr, 10) : 0;
      const savedLevel = localLevel || 'Beginner - Level 1';
      let savedCompleted = [];
      try { savedCompleted = localCompletedStr ? JSON.parse(localCompletedStr) : []; } catch(e) {}

      if (data && data.error) {
        const mockUser = { id: 'local1', email, name: email.split('@')[0], avatar: 'tiger', xp: savedXp, streak: 5, level: savedLevel, levelProgress: 60, learningLanguage: lang, completedModules: savedCompleted };
        setUser(mockUser);
        setIsLoading(false);
        return mockUser as any;
      } else {
        const fullUser = { ...data, learningLanguage: data.learningLanguage || lang };
        setUser(fullUser);
        setIsLoading(false);
        return fullUser;
      }
    } catch (e) {
      console.warn('MongoDB login error (falling back to offline mode):', e);
      const lang = await AsyncStorage.getItem('learningLanguage') || 'tamil';
      const localXpStr = await AsyncStorage.getItem('localXp');
      const localLevel = await AsyncStorage.getItem('localLevel');
      const localCompletedStr = await AsyncStorage.getItem('localCompletedModules');
      
      const savedXp = localXpStr ? parseInt(localXpStr, 10) : 0;
      const savedLevel = localLevel || 'Beginner - Level 1';
      let savedCompleted = [];
      try { savedCompleted = localCompletedStr ? JSON.parse(localCompletedStr) : []; } catch(e) {}
      
      const mockUser = { id: 'local1', email, name: email.split('@')[0], avatar: 'tiger', xp: savedXp, streak: 5, level: savedLevel, levelProgress: 60, learningLanguage: lang, completedModules: savedCompleted };
      setUser(mockUser);
      setIsLoading(false);
      return mockUser as any;
    }
  };

  // --- Module Completion & Level Up Logic ---
  const ALL_MODULES = ['foundations', 'writing', 'vocabulary', 'communication', 'reading', 'pronunciation', 'assessment'];
  const TIER_ORDER = ['Beginner', 'Intermediate', 'Pro'];

  const getTier = (levelStr: string) => {
    if (levelStr?.includes('Pro') || levelStr?.includes('Advanced')) return 'Pro';
    if (levelStr?.includes('Intermediate')) return 'Intermediate';
    return 'Beginner';
  };

  const completeModule = async (moduleId: string): Promise<{ leveledUp: boolean; newTier: string } | null> => {
    if (!user) return null;

    const currentCompleted = user.completedModules || [];
    if (currentCompleted.includes(moduleId)) {
      return { leveledUp: false, newTier: getTier(user.level) };
    }

    const newCompleted = [...currentCompleted, moduleId];
    const allDone = ALL_MODULES.every(p => newCompleted.includes(p));

    let newLevel = user.level;
    let leveledUp = false;
    let resetCompleted = newCompleted;

    if (allDone) {
      const currentTier = getTier(user.level);
      const match = user.level.match(/Level (\d+)/);
      const currentLevelNum = match ? parseInt(match[1], 10) : 1;

      if (currentLevelNum < 1000) {
        newLevel = `${currentTier} - Level ${currentLevelNum + 1}`;
        resetCompleted = [];
        leveledUp = true;
      } else {
        const currentTierIdx = TIER_ORDER.indexOf(currentTier);
        if (currentTierIdx < TIER_ORDER.length - 1) {
          const nextTier = TIER_ORDER[currentTierIdx + 1];
          newLevel = `${nextTier} - Level 1`;
          resetCompleted = []; // reset for the new level
          leveledUp = true;
        }
      }
    }

    // Persist the new state
    const targetLevel = allDone ? newLevel : user.level;
    const updatedUser = { ...user, completedModules: resetCompleted, level: targetLevel };
    setUser(updatedUser);
    await AsyncStorage.setItem('localCompletedModules', JSON.stringify(resetCompleted));
    await AsyncStorage.setItem('localLevel', targetLevel);

    // Also save XP for leaderboard
    const xpMap: Record<string, number> = { foundations: 20, communication: 30, pronunciation: 50, assessment: 100 };
    const xpGained = xpMap[moduleId] || 20;
    
    const newXp = user.xp + xpGained;
    setUser(prev => prev ? { ...prev, xp: newXp } : prev);
    await AsyncStorage.setItem('localXp', newXp.toString());

    if (isSupabaseConfigured && supabase) {
      try {
        const updatePayload: any = {
          xp: newXp,
          completed_modules: resetCompleted,
        };
        if (allDone) {
          updatePayload.level = newLevel;
        }
        await supabase
          .from('profiles')
          .update(updatePayload)
          .eq('email', user.email);
      } catch (supaErr) {
        console.warn('Supabase update progress error:', supaErr);
      }
    }

    try {
      await fetch(`${API_URL}/update-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, xpGained, completedModules: resetCompleted, level: targetLevel })
      });
    } catch (e) {
      // offline mode – state already updated locally
    }

    return { leveledUp, newTier: getTier(targetLevel) };
  };

  const completeLevel = async (levelNum: number) => {
    if (!user) return;

    const currentTier = getTier(user.level);
    const match = user.level.match(/Level (\d+)/);
    const currentMaxNum = match ? parseInt(match[1], 10) : 1;

    const nextLevelNum = Math.max(currentMaxNum, levelNum + 1);
    const newLevelStr = `${currentTier} - Level ${nextLevelNum}`;

    setUser(prev => prev ? { ...prev, level: newLevelStr } : prev);
    await AsyncStorage.setItem('localLevel', newLevelStr);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ level: newLevelStr })
          .eq('email', user.email);
      } catch (supaErr) {
        console.warn('Supabase update level error:', supaErr);
      }
    }

    try {
      await fetch(`${API_URL}/update-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, level: newLevelStr })
      });
    } catch (e) {}
  };

  // Wipes every locally-cached progress key so a newly created account never
  // inherits XP/level/completed-levels/chat-history left behind by whichever
  // account was previously signed in on this device. Local storage here isn't
  // multi-account aware (offline fallback even reuses id 'local1' for everyone),
  // so this has to run explicitly on account creation rather than relying on
  // per-user key namespacing.
  const resetLocalProgress = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const progressKeys = allKeys.filter(k =>
        k.startsWith('@game_') ||
        k.startsWith('@culture_') ||
        k.startsWith('@chat_') ||
        k === 'localXp' ||
        k === 'localLevel' ||
        k === 'localCompletedModules' ||
        k === 'learningLanguage'
      );
      if (progressKeys.length > 0) {
        await AsyncStorage.removeMany(progressKeys);
      }
    } catch (e) {
      console.warn('Failed to reset local progress for new account:', e);
    }
  };

  const register = async (email: string, password?: string, name?: string) => {
    setIsLoading(true);

    if (password) {
      try {
        const { signUpWithEmailFirebase } = await import('../utils/firebase');
        await signUpWithEmailFirebase(email, password);
      } catch (authError) {
        setIsLoading(false);
        throw authError;
      }
    }

    // Account creation succeeded (or is proceeding in offline mode) — clear any
    // stale progress from a previous account before this new one starts writing.
    await resetLocalProgress();

    try {
      await AsyncStorage.setItem('userEmail', email);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('profiles').upsert([
            {
              email,
              name: name || email.split('@')[0],
              avatar: 'tiger',
              xp: 0,
              streak: 1,
              level: 'Beginner - Level 1',
              level_progress: 0,
              completed_modules: [],
            }
          ], { onConflict: 'email' });
        } catch (supaErr) {
          console.warn('Supabase register error:', supaErr);
        }
      }

      const res = await fetchWithTimeout(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || email.split('@')[0] })
      });
      const data = await res.json();
      
      const lang = await AsyncStorage.getItem('learningLanguage') || 'tamil';
      const fullUser = { ...(data.error ? { id: 'local1', email, name: name || email.split('@')[0], avatar: 'tiger', xp: 0, streak: 0, level: 'Beginner', levelProgress: 0, completedModules: [] } : data), learningLanguage: lang };
      setUser(fullUser);
      setIsLoading(false);
      return fullUser;
    } catch (e: any) {
      const lang = await AsyncStorage.getItem('learningLanguage') || 'tamil';
      const fullUser = { id: 'local1', email, name: name || email.split('@')[0], avatar: 'tiger', xp: 0, streak: 0, level: 'Beginner', levelProgress: 0, completedModules: [], learningLanguage: lang };
      setUser(fullUser);
      setIsLoading(false);
      return fullUser;
    }
  };

  const logout = async () => {
    try {
      await signOutFirebase();
    } catch (e) {
      console.warn('Firebase logout error:', e);
    }
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('learningLanguage');
    await AsyncStorage.removeItem('localXp');
    await AsyncStorage.removeItem('localLevel');
    await AsyncStorage.removeItem('localCompletedModules');

    setUser(null);
    setIsLoading(false);
  };

  const setAssessmentLevel = async (levelTier: string, score: number) => {
    if (!user) return;
    const baseXP = score * 10;
    const newLevel = `${levelTier} - Level 1`;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            level: newLevel,
            xp: baseXP,
            level_progress: 0,
            completed_modules: [],
          })
          .eq('email', user.email);
      } catch (supaErr) {
        console.warn('Supabase setAssessmentLevel error:', supaErr);
      }
    }

    try {
      const res = await fetch(`${API_URL}/update-level`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, levelTier, score })
      });
      const data = await res.json();
      if (data && data.error) {
        setUser({ ...user, level: newLevel, xp: baseXP, levelProgress: 0, completedModules: [] });
      } else {
        setUser({ ...data, learningLanguage: user.learningLanguage, completedModules: data.completedModules || [] });
      }
    } catch (e) {
      console.warn('MongoDB update-level error:', e);
      setUser({ ...user, level: newLevel, xp: baseXP, levelProgress: 0, completedModules: [] });
    }
  };

  const updateProgress = async (xpGained: number) => {
    if (!user) return;
    const newXp = user.xp + xpGained;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ xp: newXp })
          .eq('email', user.email);
      } catch (supaErr) {
        console.warn('Supabase updateProgress error:', supaErr);
      }
    }

    try {
      const res = await fetch(`${API_URL}/update-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, xpGained })
      });
      const data = await res.json();
      if (data && data.error) {
        setUser({ ...user, xp: newXp });
      } else {
        setUser({ ...data, learningLanguage: user.learningLanguage });
      }
    } catch (e) {
      console.warn('MongoDB update-progress error:', e);
      setUser({ ...user, xp: newXp });
    }
  };

  const updateProfile = async (name: string, avatar: string) => {
    if (!user) return;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ name, avatar })
          .eq('email', user.email);
      } catch (supaErr) {
        console.warn('Supabase updateProfile error:', supaErr);
      }
    }

    try {
      const res = await fetch(`${API_URL}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name, avatar })
      });
      const data = await res.json();
      if (data && data.error) {
        setUser({ ...user, name, avatar });
      } else {
        setUser({ ...data, learningLanguage: user.learningLanguage });
      }
    } catch (e) {
      console.error('MongoDB update-profile error:', e);
      setUser({ ...user, name, avatar });
    }
  };

  const setLearningLanguage = async (langId: string) => {
    await AsyncStorage.setItem('learningLanguage', langId);
    if (user) {
      setUser({ ...user, learningLanguage: langId });

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('profiles')
            .update({ learning_language: langId })
            .eq('email', user.email);
        } catch (supaErr) {
          console.warn('Supabase setLearningLanguage error:', supaErr);
        }
      }

      try {
        await fetch(`${API_URL}/update-language`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, learningLanguage: langId })
        });
      } catch (e) {
        console.warn('MongoDB update-language error:', e);
      }
    }
  };


  const loginWithGoogle = async (email: string, name?: string) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userEmail', email);
      const res = await fetchWithTimeout(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      const lang = await AsyncStorage.getItem('learningLanguage') || 'tamil';
      
      let finalUser;
      if (data && data.error) {
        const localXpStr = await AsyncStorage.getItem('localXp');
        const localLevel = await AsyncStorage.getItem('localLevel');
        const localCompletedStr = await AsyncStorage.getItem('localCompletedModules');
        
        const savedXp = localXpStr ? parseInt(localXpStr, 10) : 0;
        const savedLevel = localLevel || 'Beginner - Level 1';
        let savedCompleted = [];
        try { savedCompleted = localCompletedStr ? JSON.parse(localCompletedStr) : []; } catch(e) {}
        
        const mockUser = { id: 'local1', email, name: name || email.split('@')[0], avatar: 'tiger', xp: savedXp, streak: 1, level: savedLevel, levelProgress: 0, learningLanguage: lang, completedModules: savedCompleted };
        finalUser = mockUser;
      } else {
        finalUser = { ...data, learningLanguage: data.learningLanguage || lang, completedModules: data.completedModules || [] };
      }

      if (name && (!data || data.name !== name)) {
        try {
          const updateRes = await fetch(`${API_URL}/update-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, avatar: finalUser.avatar || 'tiger' })
          });
          const updatedData = await updateRes.json();
          if (updatedData && !updatedData.error) {
            finalUser = { ...finalUser, name: updatedData.name };
          }
        } catch (updateErr) {
          console.warn('Failed to sync Google profile name with DB:', updateErr);
        }
      }

      setUser(finalUser);
      setIsLoading(false);
      return finalUser;
    } catch (e) {
      console.warn('MongoDB login error (falling back to offline mode):', e);
      const lang = await AsyncStorage.getItem('learningLanguage') || 'tamil';
      const localXpStr = await AsyncStorage.getItem('localXp');
      const localLevel = await AsyncStorage.getItem('localLevel');
      const localCompletedStr = await AsyncStorage.getItem('localCompletedModules');
      
      const savedXp = localXpStr ? parseInt(localXpStr, 10) : 0;
      const savedLevel = localLevel || 'Beginner - Level 1';
      let savedCompleted = [];
      try { savedCompleted = localCompletedStr ? JSON.parse(localCompletedStr) : []; } catch(e) {}
      
      const mockUser = { id: 'local1', email, name: name || email.split('@')[0], avatar: 'tiger', xp: savedXp, streak: 1, level: savedLevel, levelProgress: 0, learningLanguage: lang, completedModules: savedCompleted };
      setUser(mockUser);
      setIsLoading(false);
      return mockUser as any;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProgress, setAssessmentLevel, updateProfile, setLearningLanguage, loginWithGoogle, completeModule, completeLevel }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
