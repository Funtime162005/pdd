import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming, withRepeat } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { Colors, Fonts, Radius } from '../components/KidsTheme';
import LevelsListUI from '../components/practice/LevelsListUI';
import { getSentenceQuestions } from '../utils/gameLevels';

// Game Complete
function GameComplete({ 
  score, 
  levelNum, 
  onNextLevel, 
  onBack 
}: { 
  score: number; 
  levelNum: number; 
  onNextLevel: () => void; 
  onBack: () => void; 
}) {
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
        <Text style={gc.title}>Level {levelNum} Complete!</Text>
        <View style={gc.xpBadge}><Text style={gc.xpText}>⭐ +{score} XP Earned!</Text></View>
        <Text style={gc.message}>{score >= 60 ? 'Speed demon! You crushed it! ⚡' : score >= 30 ? 'Great timing! Keep building! 🏗️' : 'Practice makes perfect! Try again! 💪'}</Text>
        <View style={{ width: '100%', gap: 10 }}>
          <Pressable style={gc.btn} onPress={onNextLevel}>
            <LinearGradient colors={['#6366F1', '#8B5CF6']} style={gc.btnGrad}>
              <Text style={gc.btnText}>Next Level ➡️</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={[gc.btn, { marginTop: 4 }]} onPress={onBack}>
            <View style={{ paddingVertical: 14, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: Radius.pill }}>
              <Text style={{ fontFamily: Fonts.heading, fontSize: 16, color: '#374151' }}>🗺️ All 1000 Levels</Text>
            </View>
          </Pressable>
        </View>
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

function GameSentencePlay({ 
  selectedLevelNum, 
  onBack, 
  onNextLevel 
}: { 
  selectedLevelNum: number; 
  onBack: () => void; 
  onNextLevel: () => void; 
}) {
  const { user, updateProgress, completeLevel } = useAuth();
  const lang = user?.learningLanguage || 'tamil';
  const MAX_TIME = 15;

  const [questions, setQuestions] = useState<Array<{ english: string; words: string[] }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [resultState, setResultState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const timerRef = useRef<any>(null);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
    const generated = getSentenceQuestions(selectedLevelNum, lang);
    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setGameFinished(false);
  }, [selectedLevelNum, user, lang]);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!currentQ || gameFinished) return;
    const shuffled = [...currentQ.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setResultState('idle');
    setTimeLeft(MAX_TIME);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, gameFinished, questions]);

  const handleFinish = async (finalScore: number) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    try {
      setGameFinished(true);
      if (user) {
        await updateProgress(finalScore);
        if (selectedLevelNum) {
          try {
            const saved = await AsyncStorage.getItem('@game_sentence_completed');
            const prevMax = saved ? parseInt(saved, 10) : 0;
            if (selectedLevelNum > prevMax) {
              await AsyncStorage.setItem('@game_sentence_completed', selectedLevelNum.toString());
            }
          } catch(e) {}
        }
      }
    } finally {
      setTimeout(() => {
        isAdvancingRef.current = false;
      }, 1000);
    }
  };

  const handleTimeOut = () => {
    setResultState('wrong');
    setTimeout(() => advanceQuestion(score), 1200);
  };

  const handleSelectWord = (word: string, index: number) => {
    if (resultState !== 'idle' || !currentQ) return;
    const newSel = [...selectedWords, word];
    const newAvail = availableWords.filter((_, i) => i !== index);
    setSelectedWords(newSel);
    setAvailableWords(newAvail);

    if (newSel.length === currentQ.words.length) {
      clearInterval(timerRef.current);
      const isCorrect = newSel.join(' ') === currentQ.words.join(' ');
      const bonus = timeLeft > 5 ? 15 : 10;
      const gained = isCorrect ? bonus : 0;
      const nextScore = score + gained;
      setResultState(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) setScore(nextScore);

      setTimeout(() => advanceQuestion(nextScore), 1200);
    }
  };

  const handleDeselectWord = (word: string, index: number) => {
    if (resultState !== 'idle') return;
    const newSel = selectedWords.filter((_, i) => i !== index);
    setSelectedWords(newSel);
    setAvailableWords([...availableWords, word]);
  };

  const advanceQuestion = (currentScore: number) => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      clearInterval(timerRef.current);
      handleFinish(currentScore);
    }
  };

  if (gameFinished) {
    return (
      <GameComplete 
        score={score} 
        levelNum={selectedLevelNum}
        onNextLevel={onNextLevel}
        onBack={onBack} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#EEF2FF', '#E0E7FF', '#F5F3FF']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}><Text style={styles.backTxt}>← Back</Text></Pressable>
        <Text style={styles.headerTitle}>🧩 Level {selectedLevelNum}</Text>
        <View style={styles.scorePill}><Text style={styles.scoreText}>⭐ {score}</Text></View>
      </View>

      <View style={styles.content}>
        {currentQ && (
          <>
            <TimerRing timeLeft={timeLeft} maxTime={MAX_TIME} />

            <Animated.View entering={FadeInDown.springify()} style={styles.englishCard}>
              <Text style={styles.englishText}>"{currentQ.english}"</Text>
              <Text style={styles.promptSub}>Build the sentence in language 👇</Text>
            </Animated.View>

            <View style={[
              styles.targetSlot,
              resultState === 'correct' && styles.targetCorrect,
              resultState === 'wrong' && styles.targetWrong,
            ]}>
              {selectedWords.length === 0 ? (
                <Text style={styles.placeholderText}>Tap words below to arrange...</Text>
              ) : (
                <View style={styles.wordRow}>
                  {selectedWords.map((w, i) => (
                    <Pressable key={i} onPress={() => handleDeselectWord(w, i)} style={styles.selectedPill}>
                      <Text style={styles.selectedPillText}>{w}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Animated.View key={currentIndex} entering={FadeInUp.delay(200).springify()} style={styles.wordBank}>
              {availableWords.map((w, i) => (
                <Pressable key={i} onPress={() => handleSelectWord(w, i)} style={styles.wordTile}>
                  <Text style={styles.wordTileText}>{w}</Text>
                </Pressable>
              ))}
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
}

export default function GameSentenceScreen() {
  const { user } = useAuth();
  const [selectedLevelNum, setSelectedLevelNum] = useState<number | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  if (!selectedLevelNum) {
    let tier = selectedTier || 'Beginner';
    if (!selectedTier && user?.level) {
      if (user.level.includes('Pro') || user.level.includes('Advanced')) tier = 'Pro';
      else if (user.level.includes('Intermediate')) tier = 'Intermediate';
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <LevelsListUI 
          gameTitle="Sentence Builder"
          gameIcon="🧩"
          accentColor="#7C3AED"
          gameKey="sentence"
          onSelectLevel={(num) => { 
            setSelectedLevelNum(num); 
          }} 
        />
      </View>
    );
  }

  return (
    <GameSentencePlay 
      key={selectedLevelNum}
      selectedLevelNum={selectedLevelNum} 
      onBack={() => setSelectedLevelNum(null)}
      onNextLevel={() => setSelectedLevelNum(prev => (prev ? prev + 1 : 2))}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 56 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, borderColor: '#E5E7EB' },
  backTxt: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid },
  headerTitle: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.textDark },
  scorePill: { backgroundColor: Colors.yellowLight, borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2, borderColor: Colors.yellow },
  scoreText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.yellowDark },

  content: { flex: 1, padding: 20, justifyContent: 'space-around' },
  englishCard: { backgroundColor: '#FFFFFF', borderRadius: Radius.xl, padding: 24, alignItems: 'center', borderWidth: 2.5, borderColor: Colors.purpleLight },
  englishText: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, textAlign: 'center', marginBottom: 6 },
  promptSub: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textMid },

  targetSlot: {
    minHeight: 80, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: Radius.xl,
    padding: 14, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: '#C7D2FE', borderStyle: 'dashed',
  },
  targetCorrect: { borderColor: Colors.green, backgroundColor: Colors.greenLight, borderStyle: 'solid' },
  targetWrong: { borderColor: Colors.red, backgroundColor: Colors.redLight, borderStyle: 'solid' },
  placeholderText: { fontFamily: Fonts.bodyReg, fontSize: 15, color: '#A5B4FC' },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  selectedPill: { backgroundColor: Colors.purple, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 8 },
  selectedPillText: { fontFamily: Fonts.heading, fontSize: 17, color: '#FFFFFF' },

  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  wordTile: {
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, paddingHorizontal: 18, paddingVertical: 12,
    borderWidth: 2.5, borderColor: '#E0E7FF',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(99,102,241,0.15)' } : { elevation: 4 }),
  },
  wordTileText: { fontFamily: Fonts.body, fontSize: 18, color: Colors.textDark },
});
