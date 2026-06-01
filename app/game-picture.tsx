import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PICTURE_GAME_POOLS } from '../constants/translations';
import { Colors, Fonts, Radius, Shadow } from '../components/KidsTheme';

const LANGUAGE_NAMES: Record<string, string> = {
  tamil: 'Tamil', hindi: 'Hindi', telugu: 'Telugu', malayalam: 'Malayalam', kannada: 'Kannada',
};

function GameComplete({ score, onBack }: { score: number; onBack: () => void }) {
  const scale = useSharedValue(0.5);
  useEffect(() => { scale.value = withSpring(1, { damping: 8 }); }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <View style={gc.container}>
      <LinearGradient colors={['#F59E0B', '#FB923C', '#F472B6']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={gc.deco1} /><View style={gc.deco2} />
      <Animated.View style={[gc.card, style]}>
        <Text style={gc.emoji}>🖼️</Text>
        <Text style={gc.congrats}>You nailed it! 🏆</Text>
        <Text style={gc.title}>Picture Quiz Done!</Text>
        <View style={gc.xpBadge}>
          <Text style={gc.xpText}>⭐ +{score} XP Earned!</Text>
        </View>
        <Text style={gc.message}>{score >= 40 ? 'Visual master! Outstanding! 👁️' : score >= 20 ? 'Great eyes! Keep looking! 👀' : 'Keep practicing! You\'ll get it! 💪'}</Text>
        <Pressable style={gc.btn} onPress={onBack}>
          <LinearGradient colors={['#F59E0B', '#EA580C']} style={gc.btnGrad}>
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
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 32,
    padding: 36, alignItems: 'center', width: '85%', maxWidth: 380,
    borderWidth: 3, borderColor: 'rgba(255,255,255,1)',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 20px 60px rgba(0,0,0,0.2)' } : { elevation: 20 }),
  },
  emoji: { fontSize: 72, marginBottom: 12 },
  congrats: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.orange, marginBottom: 4 },
  title: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.textDark, marginBottom: 20 },
  xpBadge: { backgroundColor: Colors.yellowLight, borderRadius: Radius.pill, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 2.5, borderColor: Colors.yellow, marginBottom: 14 },
  xpText: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.yellowDark },
  message: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  btn: { width: '100%', borderRadius: Radius.pill, overflow: 'hidden' },
  btnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: Radius.pill },
  btnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
});

function GameHeader({ score, progress, total, onBack }: any) {
  return (
    <View style={gh.container}>
      <Pressable onPress={onBack} style={gh.backBtn}><Text style={gh.backTxt}>← Back</Text></Pressable>
      <View style={gh.center}>
        <Text style={gh.title}>🖼️ Picture Quiz</Text>
        <View style={gh.dots}>{Array.from({ length: total }).map((_, i) => <View key={i} style={[gh.dot, i < progress && gh.dotActive]} />)}</View>
      </View>
      <View style={gh.scorePill}><Text style={gh.scoreText}>⭐ {score}</Text></View>
    </View>
  );
}
const gh = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56, gap: 10 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, borderColor: '#E5E7EB' },
  backTxt: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid },
  center: { flex: 1, alignItems: 'center' },
  title: { fontFamily: Fonts.heading, fontSize: 16, color: Colors.textDark, marginBottom: 6 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5E7EB' },
  dotActive: { backgroundColor: Colors.orange },
  scorePill: { backgroundColor: Colors.yellowLight, borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2, borderColor: Colors.yellow },
  scoreText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.yellowDark },
});

export default function GamePictureScreen() {
  const router = useRouter();
  const { user, updateProgress } = useAuth();

  const lang = user?.learningLanguage || 'tamil';
  const QUESTION_POOL = PICTURE_GAME_POOLS[lang] || PICTURE_GAME_POOLS['tamil'];
  const langName = LANGUAGE_NAMES[lang] || 'Tamil';

  const [questions, setQuestions] = useState<typeof QUESTION_POOL>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const emojiScale = useSharedValue(1);
  const emojiStyle = useAnimatedStyle(() => ({ transform: [{ scale: emojiScale.value }] }));

  useEffect(() => {
    const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
  }, []);

  useEffect(() => {
    emojiScale.value = withSequence(withTiming(0.8), withSpring(1.1, { damping: 6 }), withSpring(1));
  }, [currentIndex]);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (!currentQ || selectedOpt !== null) return;
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
    }, 1300);
  };

  if (gameFinished) return <GameComplete score={score} onBack={() => router.replace('/games')} />;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFF9F0', '#FEF3C7', '#FFFDE7']} style={StyleSheet.absoluteFill} />
      <GameHeader score={score} progress={currentIndex} total={questions.length} onBack={() => router.replace('/games')} />

      <View style={styles.content}>
        {currentQ && (
          <>
            {/* Emoji display */}
            <Animated.View key={`emoji-${currentIndex}`} entering={FadeInDown.springify()} style={styles.emojiSection}>
              <View style={styles.emojiFrame}>
                <LinearGradient colors={['#FEF3C7', '#FFEDD5']} style={styles.emojiFrameGrad} />
                <Animated.Text style={[styles.emoji, emojiStyle]}>{currentQ.emoji}</Animated.Text>
              </View>
              <Text style={styles.instruction}>What is this in <Text style={{ color: Colors.orange }}>{langName}</Text>? 🤔</Text>
            </Animated.View>

            {/* 2x2 Option grid */}
            <Animated.View key={`opts-${currentIndex}`} entering={FadeInUp.delay(150).springify()} style={styles.optGrid}>
              {currentQ.options.map((opt: string, idx: number) => {
                let bg = '#FFFFFF', border = '#E5E7EB', textColor = Colors.textDark;
                if (selectedOpt !== null) {
                  if (idx === currentQ.correct) { bg = Colors.greenLight; border = Colors.green; textColor = Colors.greenDark; }
                  else if (idx === selectedOpt) { bg = Colors.redLight; border = Colors.red; textColor = Colors.red; }
                }
                return (
                  <Pressable key={idx} onPress={() => handleSelect(idx)} style={[styles.optCard, { backgroundColor: bg, borderColor: border }]}>
                    {selectedOpt !== null && idx === currentQ.correct && <Text style={styles.optTick}>✅</Text>}
                    {selectedOpt !== null && idx === selectedOpt && idx !== currentQ.correct && <Text style={styles.optTick}>❌</Text>}
                    <Text style={[styles.optText, { color: textColor }]}>{opt}</Text>
                  </Pressable>
                );
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
  content: { flex: 1, padding: 20, justifyContent: 'center', gap: 24 },
  emojiSection: { alignItems: 'center' },
  emojiFrame: {
    width: 180, height: 180, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: Colors.yellow,
    overflow: 'hidden',
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(250,204,21,0.3)' } : { ...Shadow.yellow }),
  },
  emojiFrameGrad: { ...StyleSheet.absoluteFill },
  emoji: { fontSize: 96 },
  instruction: { fontFamily: Fonts.body, fontSize: 17, color: Colors.textDark, textAlign: 'center' },
  optGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  optCard: {
    width: '46%',
    minHeight: 70,
    borderRadius: Radius.lg,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.07)' } : { ...Shadow.soft }),
  },
  optTick: { fontSize: 20, marginBottom: 4 },
  optText: { fontFamily: Fonts.body, fontSize: 16, textAlign: 'center' },
});
