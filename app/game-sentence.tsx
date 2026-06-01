import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SENTENCE_GAME_POOLS } from '../constants/translations';
import { Colors, Fonts, Radius, Shadow } from '../components/KidsTheme';

// Game Complete
function GameComplete({ score, onBack }: { score: number; onBack: () => void }) {
  const scale = useSharedValue(0.5);
  useEffect(() => { scale.value = withSpring(1, { damping: 8 }); }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <View style={gc.container}>
      <LinearGradient colors={['#6366F1', '#8B5CF6', '#A855F7']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={gc.deco1} /><View style={gc.deco2} />
      <Animated.View style={[gc.card, style]}>
        <Text style={gc.emoji}>🧩</Text>
        <Text style={gc.congrats}>Builder! 🔥</Text>
        <Text style={gc.title}>Time Attack Done!</Text>
        <View style={gc.xpBadge}><Text style={gc.xpText}>⭐ +{score} XP Earned!</Text></View>
        <Text style={gc.message}>{score >= 60 ? 'Speed demon! You crushed it! ⚡' : score >= 30 ? 'Great timing! Keep building! 🏗️' : 'Practice makes perfect! Try again! 💪'}</Text>
        <Pressable style={gc.btn} onPress={onBack}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={gc.btnGrad}>
            <Text style={gc.btnText}>🎮 Back to Games</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
const gc = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  deco1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)', top: -60, right: -40 },
  deco2: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -30, left: -30 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 32,
    padding: 36, alignItems: 'center', width: '85%', maxWidth: 380,
    borderWidth: 3, borderColor: 'rgba(255,255,255,1)',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 20px 60px rgba(0,0,0,0.2)' } : { elevation: 20 }),
  },
  emoji: { fontSize: 72, marginBottom: 12 },
  congrats: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.purple, marginBottom: 4 },
  title: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.textDark, marginBottom: 20 },
  xpBadge: { backgroundColor: Colors.yellowLight, borderRadius: Radius.pill, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 2.5, borderColor: Colors.yellow, marginBottom: 14 },
  xpText: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.yellowDark },
  message: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  btn: { width: '100%', borderRadius: Radius.pill, overflow: 'hidden' },
  btnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: Radius.pill },
  btnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
});

// Animated Timer Ring
function TimerRing({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const pct = (timeLeft / maxTime) * 100;
  const isLow = timeLeft <= 5;
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (isLow) {
      pulse.value = withRepeat(withSequence(withTiming(1.1, { duration: 300 }), withTiming(1, { duration: 300 })), -1, false);
    } else {
      pulse.value = 1;
    }
  }, [isLow]);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  return (
    <Animated.View style={[tr.container, isLow && { borderColor: Colors.red }, pulseStyle]}>
      <LinearGradient
        colors={isLow ? [Colors.red, Colors.orange] as [string,string] : [Colors.purple, Colors.sky] as [string,string]}
        style={[tr.fill, { width: `${pct}%` as any }]}
      />
      <Text style={[tr.text, isLow && { color: Colors.red }]}>⏱ {timeLeft}s</Text>
    </Animated.View>
  );
}
const tr = StyleSheet.create({
  container: {
    height: 44, borderRadius: Radius.pill, borderWidth: 2.5,
    borderColor: Colors.purple, overflow: 'hidden',
    backgroundColor: Colors.purpleLight, position: 'relative',
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: Radius.pill, opacity: 0.3 },
  text: { fontFamily: Fonts.heading, fontSize: 16, color: Colors.purple, zIndex: 1 },
});

export default function GameSentenceScreen() {
  const router = useRouter();
  const { user, updateProgress } = useAuth();

  const lang = user?.learningLanguage || 'tamil';
  const QUESTION_POOL = SENTENCE_GAME_POOLS[lang] || SENTENCE_GAME_POOLS['tamil'];
  const MAX_TIME = 15;

  const [questions, setQuestions] = useState<typeof QUESTION_POOL>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong' | 'timeout'>('playing');

  const checkBtnScale = useSharedValue(1);
  const checkBtnStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkBtnScale.value }] }));

  useEffect(() => {
    const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 4));
  }, []);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      setAvailableWords([...questions[currentIndex].words].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
      setTimeLeft(MAX_TIME);
      setStatus('playing');
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    if (status !== 'playing' || gameFinished) return;
    if (timeLeft <= 0) { handleWrong('timeout'); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status, gameFinished]);

  const selectWord = (word: string, wordIndex: number) => {
    if (status !== 'playing') return;
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(prev => { const next = [...prev]; next.splice(wordIndex, 1); return next; });
  };

  const removeWord = (word: string, wordIndex: number) => {
    if (status !== 'playing') return;
    setSelectedWords(prev => { const next = [...prev]; next.splice(wordIndex, 1); return next; });
    setAvailableWords(prev => [...prev, word]);
  };

  const checkAnswer = () => {
    const built = selectedWords.join(' ');
    if (built === currentQ.original) {
      setStatus('correct');
      setScore(s => s + (timeLeft > 10 ? 20 : 10));
      nextQuestion();
    } else {
      handleWrong('wrong');
    }
  };

  const handleWrong = (state: 'wrong' | 'timeout') => {
    setStatus(state);
    nextQuestion();
  };

  const nextQuestion = () => {
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setGameFinished(true);
        if (user) updateProgress(score);
      }
    }, 1500);
  };

  if (gameFinished) return <GameComplete score={score} onBack={() => router.replace('/games')} />;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#EEF2FF', '#F5F3FF', '#EDE9FE']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/games')} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🧩 Sentence Builder</Text>
          <View style={styles.dots}>
            {Array.from({ length: questions.length }).map((_, i) => (
              <View key={i} style={[styles.dot, i < currentIndex && styles.dotDone, i === currentIndex && styles.dotActive]} />
            ))}
          </View>
        </View>
        <View style={styles.scorePill}><Text style={styles.scoreTxt}>⭐ {score}</Text></View>
      </View>

      <View style={styles.content}>
        {currentQ && (
          <Animated.View key={currentIndex} entering={FadeInUp.springify()} style={styles.playCard}>

            {/* Timer */}
            <TimerRing timeLeft={timeLeft} maxTime={MAX_TIME} />

            {/* English prompt */}
            <View style={styles.promptBox}>
              <Text style={styles.promptLabel}>Translate this ⬇️</Text>
              <Text style={styles.promptText}>"{currentQ.english}"</Text>
            </View>

            {/* Drop zone */}
            <View style={[styles.dropZone, status === 'correct' && styles.dropZoneCorrect, status === 'wrong' && styles.dropZoneWrong, status === 'timeout' && styles.dropZoneWrong]}>
              {selectedWords.length === 0 ? (
                <Text style={styles.dropPlaceholder}>Tap words below to build ✍️</Text>
              ) : (
                <View style={styles.chipRow}>
                  {selectedWords.map((word, i) => (
                    <Pressable key={i} onPress={() => removeWord(word, i)} style={styles.selectedChip}>
                      <Text style={styles.selectedChipText}>{word}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Feedback */}
            {status === 'correct' && (
              <Animated.View entering={FadeIn.duration(300)} style={styles.feedbackSuccess}>
                <Text style={styles.feedbackText}>✅ Excellent! +{timeLeft > 10 ? 20 : 10} XP!</Text>
              </Animated.View>
            )}
            {(status === 'wrong' || status === 'timeout') && (
              <Animated.View entering={FadeIn.duration(300)} style={styles.feedbackError}>
                <Text style={styles.feedbackText}>{status === 'timeout' ? '⏰ Time\'s up!' : '❌ Not quite!'}</Text>
              </Animated.View>
            )}

            {/* Word bank */}
            <Text style={styles.bankLabel}>Word Bank 📦</Text>
            <View style={styles.wordBank}>
              {availableWords.map((word, i) => (
                <Pressable key={i} onPress={() => selectWord(word, i)} style={styles.bankChip}>
                  <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.bankChipGrad}>
                    <Text style={styles.bankChipText}>{word}</Text>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>

          </Animated.View>
        )}
      </View>

      {/* Check button */}
      <View style={styles.footer}>
        <Animated.View style={checkBtnStyle}>
          <Pressable
            style={[styles.checkBtn, (availableWords.length > 0 || status !== 'playing') && styles.checkBtnDisabled]}
            onPress={checkAnswer}
            onPressIn={() => { checkBtnScale.value = withSpring(0.95, { damping: 10 }); }}
            onPressOut={() => { checkBtnScale.value = withSpring(1, { damping: 10 }); }}
            disabled={availableWords.length > 0 || status !== 'playing'}
          >
            <LinearGradient
              colors={availableWords.length > 0 || status !== 'playing' ? ['#C4B5FD', '#A78BFA'] as [string,string] : ['#6366F1', '#8B5CF6'] as [string,string]}
              style={styles.checkGrad}
            >
              <Text style={styles.checkText}>✅ Check Answer</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56, gap: 10 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, borderColor: '#E5E7EB' },
  backTxt: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontFamily: Fonts.heading, fontSize: 16, color: Colors.textDark, marginBottom: 6 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5E7EB' },
  dotActive: { backgroundColor: Colors.purple, transform: [{ scale: 1.2 }] },
  dotDone: { backgroundColor: Colors.green },
  scorePill: { backgroundColor: Colors.purpleLight, borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2, borderColor: Colors.purple },
  scoreTxt: { fontFamily: Fonts.body, fontSize: 14, color: Colors.purple },

  content: { flex: 1, padding: 16 },
  playCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: Radius.xl,
    padding: 20,
    gap: 16,
    flex: 1,
    borderWidth: 2.5,
    borderColor: Colors.purpleLight,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(99,102,241,0.12)' } : { ...Shadow.card }),
  },

  promptBox: {
    backgroundColor: Colors.purpleLight,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.purple + '40',
  },
  promptLabel: { fontFamily: Fonts.bodySemi, fontSize: 12, color: Colors.purple, letterSpacing: 0.5, marginBottom: 6 },
  promptText: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.textDark },

  dropZone: {
    minHeight: 70,
    borderRadius: Radius.lg,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderColor: Colors.purple + '60',
    backgroundColor: Colors.bgMuted,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropZoneCorrect: { borderColor: Colors.green, backgroundColor: Colors.greenLight, borderStyle: 'solid' },
  dropZoneWrong: { borderColor: Colors.red, backgroundColor: Colors.redLight, borderStyle: 'solid' },
  dropPlaceholder: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textLight, fontStyle: 'italic' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  selectedChip: {
    backgroundColor: Colors.purple,
    borderRadius: Radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 3px 8px rgba(168,85,247,0.35)' } : {}),
  },
  selectedChipText: { fontFamily: Fonts.body, fontSize: 16, color: '#FFFFFF' },

  feedbackSuccess: { backgroundColor: Colors.greenLight, borderRadius: Radius.lg, padding: 10, borderWidth: 2, borderColor: Colors.green, alignItems: 'center' },
  feedbackError: { backgroundColor: Colors.redLight, borderRadius: Radius.lg, padding: 10, borderWidth: 2, borderColor: Colors.red, alignItems: 'center' },
  feedbackText: { fontFamily: Fonts.body, fontSize: 15, color: Colors.textDark },

  bankLabel: { fontFamily: Fonts.bodySemi, fontSize: 12, color: Colors.textMid, letterSpacing: 0.5 },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  bankChip: { borderRadius: Radius.pill, overflow: 'hidden' },
  bankChipGrad: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: Radius.pill },
  bankChipText: { fontFamily: Fonts.body, fontSize: 16, color: '#FFFFFF' },

  footer: { padding: 16, paddingBottom: 32 },
  checkBtn: { borderRadius: Radius.pill, overflow: 'hidden' },
  checkBtnDisabled: { opacity: 0.7 },
  checkGrad: { paddingVertical: 18, alignItems: 'center', borderRadius: Radius.pill },
  checkText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
});
