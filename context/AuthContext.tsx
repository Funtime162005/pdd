import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithGoogleFirebase, isFirebaseConfigured, signOutFirebase } from '../utils/firebase';

const API_URL = 'http://localhost:5005/api';

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
        
        const savedXp = localXpStr ? parseInt(localXpStr, 10) : 25400;
        const savedLevel = localLevel || 'Pro - Level 5';
        let savedCompleted = [];
        try { savedCompleted = localCompletedStr ? JSON.parse(localCompletedStr) : []; } catch(e) {}

        if (email) {
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
      
      const savedXp = localXpStr ? parseInt(localXpStr, 10) : 25400;
      const savedLevel = localLevel || 'Pro - Level 5';
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
      
      const savedXp = localXpStr ? parseInt(localXpStr, 10) : 25400;
      const savedLevel = localLevel || 'Pro - Level 5';
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
    const updatedUser = { ...user, completedModules: resetCompleted, level: newLevel };
    setUser(updatedUser);
    await AsyncStorage.setItem('localCompletedModules', JSON.stringify(resetCompleted));
    await AsyncStorage.setItem('localLevel', newLevel);

    // Also save XP for leaderboard
    const xpMap: Record<string, number> = { foundations: 20, communication: 30, pronunciation: 50, assessment: 100 };
    const xpGained = xpMap[moduleId] || 20;
    
    const newXp = user.xp + xpGained;
    setUser(prev => prev ? { ...prev, xp: newXp } : prev);
    await AsyncStorage.setItem('localXp', newXp.toString());

    try {
      await fetch(`${API_URL}/update-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, xpGained, completedModules: resetCompleted, level: newLevel })
      });
    } catch (e) {
      // offline mode – state already updated locally
    }

    return { leveledUp, newTier: getTier(newLevel) };
  };

  const register = async (email: string, password?: string, name?: string) => {
    setIsLoading(true);

    // Create user in Firebase first.
    // Done outside the backend try/catch so auth errors throw back to UI.
    if (password) {
      try {
        const { signUpWithEmailFirebase } = await import('../utils/firebase');
        await signUpWithEmailFirebase(email, password);
      } catch (authError) {
        setIsLoading(false);
        throw authError; // Throw so UI shows 'Registration failed' instead of proceeding!
      }
    }

    try {
      await AsyncStorage.setItem('userEmail', email);
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
      // If backend fails, fallback to offline user mode!
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
  };

  const setAssessmentLevel = async (levelTier: string, score: number) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/update-level`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, levelTier, score })
      });
      const data = await res.json();
      if (data && data.error) {
        setUser({ ...user, level: `${levelTier} - Level 1`, xp: score * 10, levelProgress: 0, completedModules: [] });
      } else {
        setUser({ ...data, learningLanguage: user.learningLanguage, completedModules: data.completedModules || [] });
      }
    } catch (e) {
      console.warn('MongoDB update-level error:', e);
      setUser({ ...user, level: `${levelTier} - Level 1`, xp: score * 10, levelProgress: 0, completedModules: [] });
    }
  };

  const updateProgress = async (xpGained: number) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/update-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, xpGained })
      });
      const data = await res.json();
      if (data && data.error) {
        setUser({ ...user, xp: user.xp + xpGained });
      } else {
        setUser({ ...data, learningLanguage: user.learningLanguage });
      }
    } catch (e) {
      console.warn('MongoDB update-progress error:', e);
      setUser({ ...user, xp: user.xp + xpGained });
    }
  };

  const updateProfile = async (name: string, avatar: string) => {
    if (!user) return;
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProgress, setAssessmentLevel, updateProfile, setLearningLanguage, loginWithGoogle, completeModule }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
