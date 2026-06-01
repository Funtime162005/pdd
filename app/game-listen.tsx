import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import Animated, { FadeIn, FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LISTEN_GAME_POOLS, SPEECH_CODES } from '../constants/translations';
import { Colors, Fonts, Radius, Shadow } from '../components/KidsTheme';
import { playAudio } from '../utils/speech';

// Shared: game complete screen
function GameComplete({ score, emoji, onBack }: { score: number; emoji: string; onBack: () => void }) {
  const scale = useSharedValue(0.5);
  useEffect(() => { scale.value = withSpring(1, { damping: 8, stiffness: 120 }); }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <View style={gc.container}>
      <LinearGradient colors={['#06B6D4', '#38BDF8', '#A855F7']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={gc.decoTop} /><View style={gc.decoBottom} />
      <Animated.View style={[gc.card, style]}>
        <Text style={gc.emoji}>{emoji}</Text>
        <Text style={gc.congrats}>Amazing! 🎊</Text>
        <Text style={gc.title}>Game Complete!</Text>
        <View style={gc.xpBadge}>
          <Text style={gc.xpText}>⭐ +{score} XP Earned!</Text>
        </View>
        <Text style={gc.message}>{score >= 40 ? 'Perfect score! You\'re a star! 🌟' : score >= 20 ? 'Great effort, keep it up! 💪' : 'Good try! Practice makes perfect! 🎯'}</Text>
        <Pressable style={gc.btn} onPress={onBack}>
          <LinearGradient colors={['#22C55E', '#16A34A']} style={gc.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={gc.btnText}>🎮 Back to Games</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
const gc = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  decoTop: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)', top: -60, right: -40 },
  decoBottom: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -30, left: -30 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 32,
    padding: 36, alignItems: 'center', width: '85%', maxWidth: 380,
    borderWidth: 3, borderColor: 'rgba(255,255,255,1)',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 20px 60px rgba(0,0,0,0.2)' } : { elevation: 20 }),
  },
  emoji: { fontSize: 72, marginBottom: 12 },
  congrats: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.purple, marginBottom: 4 },
  title: { fontFamily: Fonts.heading, fontSize: 30, color: Colors.textDark, marginBottom: 20 },
  xpBadge: { backgroundColor: Colors.yellowLight, borderRadius: Radius.pill, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 2.5, borderColor: Colors.yellow, marginBottom: 14 },
  xpText: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.yellowDark },
  message: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  btn: { width: '100%', borderRadius: Radius.pill, overflow: 'hidden' },
  btnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: Radius.pill },
  btnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
});

// Shared: game header bar
function GameHeader({ title, score, progress, total, onBack, accentColor }: any) {
  return (
    <View style={gh.container}>
      <Pressable onPress={onBack} style={gh.backBtn}>
        <Text style={gh.backTxt}>← Back</Text>
      </Pressable>
      <View style={gh.center}>
        <Text style={gh.title}>{title}</Text>
        <View style={gh.progressRow}>
          {Array.from({ length: total }).map((_, i) => (
            <View key={i} style={[gh.dot, i < progress && { backgroundColor: accentColor }]} />
          ))}
        </View>
      </View>
      <View style={[gh.scorePill, { backgroundColor: accentColor + '22', borderColor: accentColor }]}>
        <Text style={[gh.scoreText, { color: accentColor }]}>⭐ {score}</Text>
      </View>
    </View>
  );
}
const gh = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56, gap: 10 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, borderColor: '#E5E7EB' },
  backTxt: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid },
  center: { flex: 1, alignItems: 'center' },
  title: { fontFamily: Fonts.heading, fontSize: 16, color: Colors.textDark, marginBottom: 6 },
  progressRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5E7EB' },
  scorePill: { borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2 },
  scoreText: { fontFamily: Fonts.body, fontSize: 14 },
});

// Option button component
function OptionBtn({ text, state, onPress }: { text: string; state: 'idle' | 'correct' | 'wrong'; onPress: () => void }) {
  const scale = useSharedValue(1);
  const bgMap = { idle: '#FFFFFF', correct: Colors.greenLight, wrong: Colors.redLight };
  const borderMap = { idle: '#E5E7EB', correct: Colors.green, wrong: Colors.red };
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    if (state === 'correct') {
      scale.value = withSequence(withSpring(1.08), withSpring(1));
    } else if (state === 'wrong') {
      scale.value = withSequence(withTiming(0.94), withSpring(1));
    }
  }, [state]);

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPressIn={() => { if (state === 'idle') scale.value = withSpring(0.96); }}
        onPressOut={() => { if (state === 'idle') scale.value = withSpring(1); }}
        onPress={onPress}
        style={[opt.btn, { backgroundColor: bgMap[state], borderColor: borderMap[state] }]}
      >
        {state === 'correct' && <Text style={opt.indicator}>✅ </Text>}
        {state === 'wrong' && <Text style={opt.indicator}>❌ </Text>}
        <Text style={[opt.text, state !== 'idle' && { color: state === 'correct' ? Colors.greenDark : Colors.red }]}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
}
const opt = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: Radius.lg, borderWidth: 2.5, marginBottom: 12 },
  indicator: { fontSize: 20, marginRight: 4 },
  text: { fontFamily: Fonts.body, fontSize: 18, color: Colors.textDark },
});

// MAIN SCREEN
export default function GameListenScreen() {
  const router = useRouter();
  const { user, updateProgress } = useAuth();

  const lang = user?.learningLanguage || 'tamil';
  const QUESTION_POOL = LISTEN_GAME_POOLS[lang] || LISTEN_GAME_POOLS['tamil'];
  const speechCode = SPEECH_CODES[lang] || 'ta-IN';

  const [questions, setQuestions] = useState<typeof QUESTION_POOL>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const speakerScale = useSharedValue(1);
  const speakerStyle = useAnimatedStyle(() => ({ transform: [{ scale: speakerScale.value }] }));

  useEffect(() => {
    const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    // We intentionally removed autoplay here because browsers block it!
    // The user must tap the headphone icon manually.
  }, [currentIndex, gameFinished, questions]);

  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Reset fallback when question changes
    setShowFallback(false);
  }, [currentIndex]);

  const handlePlayAudio = () => {
    speakerScale.value = withSequence(withSpring(1.2, { damping: 8 }), withSpring(1));
    playAudio(currentQ.target, lang);
  };

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const correct = idx === currentQ.correct;
    if (correct) setScore(s => s + 10);
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedOpt(null);
      } else {
        setGameFinished(true);
        if (user) updateProgress(correct ? score + 10 : score);
      }
    }, 1500);
  };

  if (gameFinished) return <GameComplete score={score} emoji="🎧" onBack={() => router.replace('/games')} />;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ECFEFF', '#E0F2FE', '#F0F9FF']} style={StyleSheet.absoluteFill} />

      <GameHeader title="🎧 Listen & Select" score={score} progress={currentIndex} total={questions.length} onBack={() => router.replace('/games')} accentColor={Colors.sky} />

      <View style={styles.content}>
        {currentQ && (
          <>
            {/* Speaker button */}
            <Animated.View entering={FadeInDown.springify()} style={styles.audioSection}>
              <Pressable onPress={handlePlayAudio}>
                <Animated.View style={[styles.speakerBtn, speakerStyle]}>
                  <LinearGradient colors={['#06B6D4', '#0EA5E9']} style={styles.speakerGrad}>
                    <View style={styles.speakerRing} />
                    <Text style={styles.speakerIcon}>🎧</Text>
                  </LinearGradient>
                </Animated.View>
              </Pressable>
              <Text style={styles.instruction}>Tap to hear the word, then choose! 👇</Text>
              
              {!showFallback ? (
                <Pressable onPress={() => setShowFallback(true)} style={{ marginTop: 15 }}>
                  <Text style={{ fontFamily: Fonts.bodyReg, fontSize: 13, color: Colors.skyDark, textDecorationLine: 'underline' }}>
                    Voice not playing? Tap here to show word
                  </Text>
                </Pressable>
              ) : (
                <Animated.View entering={FadeIn.duration(400)} style={{ marginTop: 15, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: Radius.pill }}>
                  <Text style={{ fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark }}>{currentQ.target}</Text>
                </Animated.View>
              )}
            </Animated.View>

            {/* Options */}
            <Animated.View key={currentIndex} entering={FadeInUp.delay(200).springify()} style={styles.options}>
              {currentQ.options.map((opt: string, idx: number) => {
                let state: 'idle' | 'correct' | 'wrong' = 'idle';
                if (selectedOpt !== null) {
                  if (idx === currentQ.correct) state = 'correct';
                  else if (idx === selectedOpt) state = 'wrong';
                }
                return <OptionBtn key={idx} text={opt} state={state} onPress={() => handleSelect(idx)} />;
              })}
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  audioSection: { alignItems: 'center', marginBottom: 40 },
  speakerBtn: {
    marginBottom: 20,
    borderRadius: 70,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(6,182,212,0.5)' } : { elevation: 12, shadowColor: Colors.sky, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16 }),
  },
  speakerGrad: {
    width: 140, height: 140, borderRadius: 70,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  speakerRing: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)',
  },
  speakerIcon: { fontSize: 64 },
  instruction: { fontFamily: Fonts.bodyReg, fontSize: 16, color: Colors.textMid, textAlign: 'center' },
  options: { gap: 0 },
});
