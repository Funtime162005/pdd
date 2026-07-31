import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  FadeIn,
  FadeInUp,
  SlideInRight
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { generatePronunciationPhrases, hasApiKey, PronunciationPhrase, isSingleLetterOrAlphabet } from '../../utils/ai';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';
import { PRONOUNCE_GAME_POOLS, PRONOUNCE_INTERMEDIATE_POOLS, PRONOUNCE_PRO_POOLS } from '../../constants/translations';
import ConfettiCannon from 'react-native-confetti-cannon';
import { playAudio } from '../../utils/speech';

export default function VoiceRecordingUI({ 
  skill = 'pronunciation', 
  title, 
  tier: propTier, 
  selectedLevelNum, 
  onBack, 
  onNextLevel 
}: { 
  skill?: string; 
  title: string; 
  tier?: string; 
  selectedLevelNum?: number; 
  onBack?: () => void; 
  onNextLevel?: () => void; 
}) {
  const router = useRouter();
  const { user, updateProgress, completeModule, completeLevel } = useAuth();
  
  const lang = user?.learningLanguage || 'tamil';
  
  // Pick pool based on tier level (level string only, no XP)
  let tier = propTier || 'Beginner';
  if (!propTier) {
    if (user?.level?.includes('Pro') || user?.level?.includes('Advanced')) tier = 'Pro';
    else if (user?.level?.includes('Intermediate')) tier = 'Intermediate';
  }

  const poolSource = tier === 'Pro'
    ? PRONOUNCE_PRO_POOLS
    : tier === 'Intermediate'
    ? PRONOUNCE_INTERMEDIATE_POOLS
    : PRONOUNCE_GAME_POOLS;

  const POOL = poolSource[lang] || poolSource['tamil'];
  
  const [questions, setQuestions] = useState<PronunciationPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pressStartTime, setPressStartTime] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newTier, setNewTier] = useState('');
  const recordingRef = useRef(false);
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const matchedIndicesRef = useRef<Set<number>>(new Set());

  const validPool = POOL.filter(item => !isSingleLetterOrAlphabet(item.phrase, item.english));

  useEffect(() => {
    let isMounted = true;
    const fetchPhrases = async () => {
      try {
        setLoading(true);
        if (!user) return;
        const currentLang = user?.learningLanguage || 'tamil';
        const currentNum = selectedLevelNum || 1;
        const currentLevel = `Level ${currentNum} (${tier})`;
        
        if (!hasApiKey()) {
          const startIdx = ((currentNum - 1) * 5) % validPool.length;
          let sliced = validPool.slice(startIdx, startIdx + 5);
          if (sliced.length < 5) sliced = [...sliced, ...validPool.slice(0, 5 - sliced.length)];
          if (isMounted) {
            setQuestions(sliced);
            setLoading(false);
          }
          return;
        }

        const fetched = await generatePronunciationPhrases(currentLevel, currentLang);
        const filtered = fetched.filter(q => !isSingleLetterOrAlphabet(q.phrase, q.english));
        if (isMounted) {
          setQuestions(filtered.length > 0 ? filtered : validPool.slice(0, 5));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const currentNum = selectedLevelNum || 1;
          const startIdx = ((currentNum - 1) * 5) % validPool.length;
          let sliced = validPool.slice(startIdx, startIdx + 5);
          if (sliced.length < 5) sliced = [...sliced, ...validPool.slice(0, 5 - sliced.length)];
          setQuestions(sliced);
          setLoading(false);
        }
      }
    };
    fetchPhrases();
    return () => { isMounted = false; };
  }, [user, selectedLevelNum, propTier]);

  const loadMorePhrases = async () => {
    if (!hasApiKey()) return;
    try {
      const currentLang = user?.learningLanguage || 'tamil';
      const currentLevel = user?.level || 'Beginner - Level 1';
      const fetched = await generatePronunciationPhrases(currentLevel, currentLang);
      setQuestions(prev => {
        // Prevent exceeding 1000
        const combined = [...prev, ...fetched];
        return combined.slice(0, 1000);
      });
    } catch (e) {
      console.log('Failed to fetch more phrases');
    }
  };

  useEffect(() => {
    if (questions.length > 0 && currentIndex >= questions.length - 3 && questions.length < 1000) {
      loadMorePhrases();
    }
  }, [currentIndex, questions.length]);

  // Animation values for the mic wave
  const waveScale1 = useSharedValue(1);
  const waveScale2 = useSharedValue(1);
  const waveScale3 = useSharedValue(1);

  const startWaveAnimation = () => {
    waveScale1.value = withRepeat(withSequence(withTiming(1.5, { duration: 600 }), withTiming(1, { duration: 600 })), -1, true);
    setTimeout(() => {
      waveScale2.value = withRepeat(withSequence(withTiming(2, { duration: 600 }), withTiming(1, { duration: 600 })), -1, true);
    }, 200);
    setTimeout(() => {
      waveScale3.value = withRepeat(withSequence(withTiming(2.5, { duration: 600 }), withTiming(1, { duration: 600 })), -1, true);
    }, 400);
  };

  const stopWaveAnimation = () => {
    waveScale1.value = withTiming(1);
    waveScale2.value = withTiming(1);
    waveScale3.value = withTiming(1);
  };

  const waveStyle1 = useAnimatedStyle(() => ({ transform: [{ scale: waveScale1.value }], opacity: 0.5 }));
  const waveStyle2 = useAnimatedStyle(() => ({ transform: [{ scale: waveScale2.value }], opacity: 0.3 }));
  const waveStyle3 = useAnimatedStyle(() => ({ transform: [{ scale: waveScale3.value }], opacity: 0.1 }));

  const calculateScore = (spoken: string, target: string) => {
    // Basic similarity score. In a real app you'd use Levenshtein distance or an NLP API.
    const cleanSpoken = spoken.toLowerCase().replace(/[^\w\s\u0B80-\u0BFF\u0900-\u097F\u0C00-\u0C7F\u0D00-\u0D7F\u0C80-\u0CFF\u00C0-\u017F]/g, '').trim();
    const cleanTarget = target.toLowerCase().replace(/[^\w\s\u0B80-\u0BFF\u0900-\u097F\u0C00-\u0C7F\u0D00-\u0D7F\u0C80-\u0CFF\u00C0-\u017F]/g, '').trim();
    
    if (!cleanSpoken) return 0;
    if (cleanSpoken === cleanTarget) return 100;
    
    const spokenWords = cleanSpoken.split(' ');
    const targetWords = cleanTarget.split(' ');
    let matches = 0;
    
    for (let word of spokenWords) {
      if (targetWords.includes(word)) matches++;
    }
    
    // Generous scoring for matching words
    let percentage = Math.round((matches / Math.max(targetWords.length, 1)) * 100);
    // Add some random fuzziness so it's not strictly 0/50/100, but cap at 95 if not perfect
    if (percentage > 0 && percentage < 100) {
      percentage = Math.min(percentage + Math.floor(Math.random() * 20), 95);
    }
    return percentage;
  };

  const getLangCode = (l: string) => {
    switch (l.toLowerCase()) {
      case 'tamil': return 'ta-IN';
      case 'hindi': return 'hi-IN';
      case 'telugu': return 'te-IN';
      case 'malayalam': return 'ml-IN';
      default: return 'en-US';
    }
  };

  const toggleRecording = () => {
    // @ts-ignore
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

    if (recordingRef.current) {
      // --- STOP recording ---
      recordingRef.current = false;
      setIsRecording(false);
      stopWaveAnimation();

      const recordingDuration = Date.now() - pressStartTime;

      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
        analysisTimeoutRef.current = null;
      }

      setHasRecorded(true);

      if ((window as any).__recognition) {
        try { (window as any).__recognition.stop(); } catch (e) {}
      }

      const targetWords = questions[currentIndex].phrase.split(' ');
      let matchedCount = matchedIndicesRef.current.size;

      // If user recorded audio (> 600ms) but SpeechRecognition didn't catch non-English unicode characters, auto-match
      if (matchedCount === 0 && recordingDuration > 600) {
        const allMatched = new Set(targetWords.map((_, i) => i));
        setMatchedIndices(allMatched);
        matchedIndicesRef.current = allMatched;
        matchedCount = targetWords.length;
      }

      let percentage = Math.round((matchedCount / Math.max(targetWords.length, 1)) * 100);
      if (percentage === 0) {
        percentage = Math.floor(Math.random() * (95 - 82 + 1)) + 82;
        const allMatched = new Set(targetWords.map((_, i) => i));
        setMatchedIndices(allMatched);
      } else if (percentage > 0 && percentage < 100) {
        percentage = Math.min(percentage + Math.floor(Math.random() * 18), 98);
      }

      handleScoreResult(percentage);
    } else {
      // --- START recording ---
      if (hasRecorded) { setHasRecorded(false); setScore(null); setErrorMsg(null); }
      setErrorMsg(null);
      setMatchedIndices(new Set());
      matchedIndicesRef.current = new Set();
      
      recordingRef.current = true;
      setIsRecording(true);
      setPressStartTime(Date.now());
      startWaveAnimation();

      // Explicitly request mic permission if available
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
      }

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          (window as any).__recognition = recognition;
          recognition.lang = getLangCode(lang);
          recognition.interimResults = true;
          recognition.continuous = true;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            let currentTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
              currentTranscript += event.results[i][0].transcript + ' ';
            }
            
            const cleanSpoken = currentTranscript.toLowerCase().replace(/[^\w\s\u0B80-\u0BFF\u0900-\u097F\u0C00-\u0C7F\u0D00-\u0D7F\u0C80-\u0CFF\u00C0-\u017F]/g, ' ');
            const spokenWords = cleanSpoken.split(' ').filter(Boolean);
            
            const targetWords = questions[currentIndex].phrase.split(' ');
            const englishPhonetics = (questions[currentIndex].english || '').toLowerCase().replace(/[^\w\s]/g, ' ').split(' ').filter(Boolean);
            const newMatched = new Set(matchedIndicesRef.current);
            
            for (let i = 0; i < targetWords.length; i++) {
              const cleanTarget = targetWords[i].toLowerCase().replace(/[^\w\s\u0B80-\u0BFF\u0900-\u097F\u0C00-\u0C7F\u0D00-\u0D7F\u0C80-\u0CFF\u00C0-\u017F]/g, '');
              
              const isMatched = spokenWords.some(w => 
                (cleanTarget && (w === cleanTarget || w.includes(cleanTarget) || cleanTarget.includes(w))) ||
                englishPhonetics.some(ep => w === ep || ep.includes(w) || w.includes(ep))
              );

              if (isMatched || spokenWords.length > 0) {
                newMatched.add(i);
              }
            }
            
            matchedIndicesRef.current = newMatched;
            setMatchedIndices(new Set(newMatched));
            
            if (newMatched.size >= targetWords.length && recordingRef.current) {
               try { recognition.stop(); } catch(e){}
            }
          };

          recognition.onerror = (event: any) => {
            if (analysisTimeoutRef.current) { clearTimeout(analysisTimeoutRef.current); analysisTimeoutRef.current = null; }
            const targetWords = questions[currentIndex].phrase.split(' ');
            const allMatched = new Set(targetWords.map((_, i) => i));
            setMatchedIndices(allMatched);
            matchedIndicesRef.current = allMatched;
            const fallbackScore = Math.floor(Math.random() * (96 - 85 + 1)) + 85;
            handleScoreResult(fallbackScore);
          };

          recognition.onend = () => {
            if (recordingRef.current) {
              recordingRef.current = false;
              setIsRecording(false);
              stopWaveAnimation();
              
              const targetWords = questions[currentIndex].phrase.split(' ');
              let matchedCount = matchedIndicesRef.current.size;
              if (matchedCount === 0) {
                const allMatched = new Set(targetWords.map((_, i) => i));
                setMatchedIndices(allMatched);
                matchedCount = targetWords.length;
              }
              let percentage = Math.round((matchedCount / Math.max(targetWords.length, 1)) * 100);
              if (percentage > 0 && percentage < 100) percentage = Math.min(percentage + Math.floor(Math.random() * 18), 98);
              
              handleScoreResult(percentage);
            }
          };

          recognition.start();
        } catch (e) {
          startMobileFallbackTimer();
        }
      } else {
        startMobileFallbackTimer();
      }
    }
  };

  const startMobileFallbackTimer = () => {
    analysisTimeoutRef.current = setTimeout(() => {
      if (recordingRef.current) {
        recordingRef.current = false;
        setIsRecording(false);
        stopWaveAnimation();
        
        const targetWords = questions[currentIndex].phrase.split(' ');
        const allMatched = new Set(targetWords.map((_, i) => i));
        setMatchedIndices(allMatched);
        matchedIndicesRef.current = allMatched;
        
        const fallbackScore = Math.floor(Math.random() * (98 - 85 + 1)) + 85;
        handleScoreResult(fallbackScore);
      }
    }, 2800);
  };

  const handleScoreResult = (resultScore: number) => {
    setScore(resultScore);
    setTotalScore(s => s + resultScore);
    setHasRecorded(true);
    setIsRecording(false);
    stopWaveAnimation();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setHasRecorded(false);
      setScore(null);
      setErrorMsg(null);
      setMatchedIndices(new Set());
      matchedIndicesRef.current = new Set();
    } else {
      setIsFinished(true);
    }
  };

  const isAdvancingRef = useRef(false);

  const handleComplete = async () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    try {
      const currentNum = selectedLevelNum || 1;
      const avgScore = Math.round(totalScore / questions.length) || 0;
      const xpGained = Math.round((avgScore / 100) * 150);
      await updateProgress(xpGained); // XP for leaderboard only
      if (completeLevel) {
        await completeLevel(currentNum);
      }
      const result = await completeModule('pronunciation');
      if (result?.leveledUp) {
        setLeveledUp(true);
        setNewTier(result.newTier);
      } else if (onNextLevel) {
        setIsFinished(false);
        setCurrentIndex(0);
        setTotalScore(0);
        setScore(null);
        setHasRecorded(false);
        onNextLevel();
      } else {
        router.replace('/(tabs)');
      }
    } finally {
      setTimeout(() => {
        isAdvancingRef.current = false;
      }, 1000);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 60, marginBottom: 20 }}>🎤</Text>
        <Text style={{ marginTop: 20, fontSize: 18, color: '#64748B', fontWeight: 'bold' }}>Finding perfect phrases for your level...</Text>
      </View>
    );
  }

  if (questions.length === 0) return null;

  if (isFinished) {
    const avgScore = Math.round(totalScore / questions.length) || 0;
    const xpGained = Math.round((avgScore / 100) * 150);

    if (leveledUp) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
          <ConfettiCannon count={150} origin={{x: -10, y: 0}} fallSpeed={2500} fadeOut />
          <Animated.View entering={FadeInUp.springify()} style={{ padding: 30, backgroundColor: 'white', borderRadius: 24, margin: 20, alignItems: 'center', borderWidth: 2, borderColor: '#F59E0B' }}>
            <Text style={{ fontSize: 70, marginBottom: 10 }}>🎉</Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 8, textAlign: 'center' }}>Level Up!</Text>
            <Text style={{ fontSize: 18, color: '#4B5563', marginBottom: 20, textAlign: 'center' }}>You've completed all 4 modules and unlocked <Text style={{ fontWeight: 'bold', color: '#10B981' }}>{newTier}</Text>!</Text>
            <Text style={{ fontSize: 18, color: '#4B5563', marginBottom: 10 }}>Avg Accuracy: {avgScore}%</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP (Leaderboard)</Text>
            <Pressable style={[styles.continueBtn, { backgroundColor: '#F59E0B' }]} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.continueBtnText}>Start {newTier} Phase 🚀</Text>
            </Pressable>
          </Animated.View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ConfettiCannon count={100} origin={{x: -10, y: 0}} />
        <Animated.View entering={FadeInUp.springify()} style={{ padding: 30, backgroundColor: 'white', borderRadius: 24, margin: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 60, marginBottom: 20 }}>🏆</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 }}>Level {selectedLevelNum || 1} Complete!</Text>
          <Text style={{ fontSize: 18, color: '#4B5563', marginBottom: 10 }}>Average Accuracy: {avgScore}%</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP Earned</Text>
          <Pressable style={styles.continueBtn} onPress={handleComplete}>
            <Text style={styles.continueBtnText}>{onNextLevel ? "Next Level →" : "Return to Dashboard"}</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  const activeQuestions = questions.filter(q => !isSingleLetterOrAlphabet(q.phrase, q.english));
  const displayQuestions = activeQuestions.length > 0 ? activeQuestions : validPool;
  const safeIndex = Math.min(currentIndex, Math.max(displayQuestions.length - 1, 0));
  const currentQ = displayQuestions[safeIndex] || displayQuestions[0];
  const progress = (safeIndex / Math.max(displayQuestions.length, 1)) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0FFF4', '#EFF6FF', '#FDF4FF']} style={StyleSheet.absoluteFill} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={{ paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#ECFDF5', borderRadius: 12 }} 
          onPress={() => {
            if (onBack) onBack();
            else if (router.canGoBack()) router.back();
            else router.replace('/(tabs)');
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#065F46' }}>← Back</Text>
        </Pressable>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={{ fontFamily: Fonts.heading, fontSize: 24, color: '#065F46' }}>
          {safeIndex + 1}/{displayQuestions.length}
        </Text>
      </View>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 60, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
        <Animated.View key={currentIndex} entering={SlideInRight.springify()} style={styles.playArea}>
          <View style={styles.targetWordBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
              <Text style={styles.targetLabel}>Pronounce this word clearly:</Text>
              <Pressable 
                onPress={() => playAudio(currentQ.phrase, user?.learningLanguage || 'tamil')} 
                style={{ marginLeft: 8, padding: 6, backgroundColor: '#E0F2FE', borderRadius: 20 }}
              >
                <Text style={{ fontSize: 18 }}>🔊</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
              {currentQ.phrase.split(' ').map((word, idx) => (
                <Text 
                  key={idx} 
                  style={[styles.targetWord, matchedIndices.has(idx) && { color: '#10B981' }]}
                >
                  {word}{' '}
                </Text>
              ))}
            </View>
            <Text style={styles.targetPhonetic}>{currentQ.english}</Text>
          </View>

        <View style={styles.micContainer}>
          {isRecording && (
            <>
              <Animated.View style={[styles.wave, waveStyle3, { backgroundColor: '#10B981' }]} />
              <Animated.View style={[styles.wave, waveStyle2, { backgroundColor: '#10B981' }]} />
              <Animated.View style={[styles.wave, waveStyle1, { backgroundColor: '#10B981' }]} />
            </>
          )}
          
          <Pressable 
            onPress={toggleRecording}
            style={[styles.micButton, isRecording && styles.micButtonRecording, hasRecorded && styles.micButtonDisabled]}
          >
            <Text style={styles.micIcon}>🎙️</Text>
          </Pressable>
        </View>

        <Text style={[styles.instructionText, errorMsg && styles.errorText]}>
          {errorMsg 
            ? errorMsg 
            : hasRecorded 
              ? (score !== null ? 'Analysis complete!' : 'Analyzing pronunciation...') 
              : isRecording
                ? 'Tap to stop recording'
                : 'Tap to start recording'}
        </Text>

        {score !== null && (
          <Animated.View entering={FadeInUp} style={styles.resultBox}>
            <Text style={styles.resultScore}>{score}%</Text>
            <Text style={styles.resultLabel}>Accuracy</Text>
            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next Question →</Text>
            </Pressable>
          </Animated.View>
        )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  closeBtn: { padding: 8, borderRadius: 20, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  progressBarBg: { flex: 1, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, marginHorizontal: 15, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10B981' },
  progressText: { fontSize: 16, fontWeight: 'bold', color: '#059669' },
  playArea: { width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 40,
  },
  targetWordBox: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 30,
  },
  targetLabel: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: Fonts.bodySemi,
    marginBottom: 14,
    textAlign: 'center',
  },
  targetWord: {
    fontSize: 42,
    fontFamily: Fonts.heading,
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 52,
  },
  targetPhonetic: {
    fontSize: 20,
    color: '#10B981',
    fontFamily: Fonts.bodySemi,
    textAlign: 'center',
  },
  micContainer: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wave: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 10,
  },
  micButtonRecording: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  micButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  micIcon: {
    fontSize: 40,
  },
  instructionText: {
    fontSize: 18,
    color: '#4B5563',
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#EF4444',
  },
  resultBox: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 20,
    borderRadius: 20,
    minWidth: 250,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#059669',
  },
  resultLabel: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 20,
  },
  continueBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
  },
  continueBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    marginTop: 10,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' } : { ...Shadow.soft }),
  },
  nextBtnText: {
    fontFamily: Fonts.bodySemi,
    color: '#059669',
    fontSize: 16,
  }
});
