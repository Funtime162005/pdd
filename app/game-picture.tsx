import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { Colors, Fonts, Radius } from '../components/KidsTheme';
import LevelsListUI from '../components/practice/LevelsListUI';
import { getPictureQuestions } from '../utils/gameLevels';

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
      <LinearGradient colors={['#F59E0B', '#FB923C', '#F472B6']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={gc.deco1} /><View style={gc.deco2} />
      <Animated.View style={[gc.card, style]}>
        <Text style={gc.emoji}>🖼️</Text>
        <Text style={gc.congrats}>You nailed it! 🏆</Text>
        <Text style={gc.title}>Level {levelNum} Complete!</Text>
        <View style={gc.xpBadge}>
          <Text style={gc.xpText}>⭐ +{score} XP Earned!</Text>
        </View>
        <Text style={gc.message}>{score >= 40 ? 'Visual master! Outstanding! 👁️' : score >= 20 ? 'Great eyes! Keep looking! 👀' : 'Keep practicing! You\'ll get it! 💪'}</Text>
        <View style={{ width: '100%', gap: 10 }}>
          <Pressable style={gc.btn} onPress={onNextLevel}>
            <LinearGradient colors={['#F59E0B', '#EA580C']} style={gc.btnGrad}>
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

function GameHeader({ score, progress, total, onBack, levelNum }: any) {
  return (
    <View style={gh.container}>
      <Pressable onPress={onBack} style={gh.backBtn}><Text style={gh.backTxt}>← Back</Text></Pressable>
      <View style={gh.center}>
        <Text style={gh.title}>🖼️ Level {levelNum}</Text>
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

function GamePicturePlay({ 
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

  const [questions, setQuestions] = useState<Array<{ emoji: string; word: string; options: string[]; correct: number }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const isAdvancingRef = useRef(false);

  useEffect(() => {
    const generated = getPictureQuestions(selectedLevelNum, lang);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setGameFinished(false);
  }, [selectedLevelNum, user, lang]);

  const currentQ = questions[currentIndex];

  const handleFinish = async (finalScore: number) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    try {
      setGameFinished(true);
      if (user) {
        await updateProgress(finalScore);
        if (selectedLevelNum) {
          try {
            const saved = await AsyncStorage.getItem('@game_picture_completed');
            const prevMax = saved ? parseInt(saved, 10) : 0;
            if (selectedLevelNum > prevMax) {
              await AsyncStorage.setItem('@game_picture_completed', selectedLevelNum.toString());
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

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null || !currentQ) return;
    setSelectedOpt(idx);
    const correct = idx === currentQ.correct;
    const finalScore = correct ? score + 10 : score;
    if (correct) setScore(finalScore);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedOpt(null);
      } else {
        handleFinish(finalScore);
      }
    }, 1500);
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
      <LinearGradient colors={['#FFFBEB', '#FEF3C7', '#FFF7ED']} style={StyleSheet.absoluteFill} />

      <GameHeader 
        score={score} 
        progress={currentIndex} 
        total={questions.length} 
        onBack={onBack} 
        levelNum={selectedLevelNum} 
      />

      <View style={styles.content}>
        {currentQ && (
          <>
            <Animated.View entering={FadeInDown.springify()} style={styles.picSection}>
              <View style={styles.pictureFrame}>
                <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.picGrad}>
                  <Text style={styles.bigEmoji}>{currentQ.emoji}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.promptText}>Which word matches this picture? 🤔</Text>
            </Animated.View>

            <Animated.View key={currentIndex} entering={FadeInUp.delay(200).springify()} style={styles.options}>
              {currentQ.options.map((optText: string, idx: number) => {
                let isSel = selectedOpt === idx;
                let isCorr = idx === currentQ.correct;

                let btnBg = '#FFFFFF';
                let btnBorder = '#E5E7EB';
                let textColor = Colors.textDark;

                if (selectedOpt !== null) {
                  if (isCorr) {
                    btnBg = Colors.greenLight;
                    btnBorder = Colors.green;
                    textColor = Colors.greenDark;
                  } else if (isSel) {
                    btnBg = Colors.redLight;
                    btnBorder = Colors.red;
                    textColor = Colors.red;
                  }
                }

                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleSelect(idx)}
                    style={[styles.optBtn, { backgroundColor: btnBg, borderColor: btnBorder }]}
                  >
                    {selectedOpt !== null && isCorr && <Text style={{ fontSize: 20, marginRight: 6 }}>✅</Text>}
                    {selectedOpt !== null && isSel && !isCorr && <Text style={{ fontSize: 20, marginRight: 6 }}>❌</Text>}
                    <Text style={[styles.optText, { color: textColor }]}>{optText}</Text>
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

export default function GamePictureScreen() {
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
          gameTitle="Picture Match"
          gameIcon="🖼️"
          accentColor="#D97706"
          gameKey="picture"
          onSelectLevel={(num) => { 
            setSelectedLevelNum(num); 
          }} 
        />
      </View>
    );
  }

  return (
    <GamePicturePlay 
      key={selectedLevelNum}
      selectedLevelNum={selectedLevelNum} 
      onBack={() => setSelectedLevelNum(null)}
      onNextLevel={() => setSelectedLevelNum(prev => (prev ? prev + 1 : 2))}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  picSection: { alignItems: 'center', marginBottom: 36 },
  pictureFrame: {
    borderRadius: Radius.xl,
    padding: 6,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 16px 40px rgba(245,158,11,0.35)' } : { elevation: 12 }),
  },
  picGrad: { width: 170, height: 170, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center' },
  bigEmoji: { fontSize: 88 },
  promptText: { fontFamily: Fonts.bodyReg, fontSize: 17, color: Colors.textMid, textAlign: 'center' },
  options: { gap: 12 },
  optBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: Radius.lg, borderWidth: 2.5 },
  optText: { fontFamily: Fonts.body, fontSize: 19 },
});
