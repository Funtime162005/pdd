import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, FadeInDown, withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { SPEECH_CODES } from '../constants/translations';
import { Colors, Fonts, Radius } from '../components/KidsTheme';
import { playAudio } from '../utils/speech';
import LevelsListUI from '../components/practice/LevelsListUI';
import { getPronounceQuestions } from '../utils/gameLevels';

// Real speech accuracy algorithm using Levenshtein Distance & Word Matching
function computeSpeechAccuracy(spokenText: string, targetText: string): number {
  if (!spokenText || !spokenText.trim() || !targetText) return 0;

  const spokenWords = spokenText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const targetWords = targetText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (!spokenWords.length || !targetWords.length) return 0;

  // Word match check
  let matchedWords = 0;
  for (const tw of targetWords) {
    if (spokenWords.some(sw => sw.includes(tw) || tw.includes(sw))) {
      matchedWords++;
    }
  }

  const wordRatio = matchedWords / targetWords.length;
  if (wordRatio === 0) return 0; // Wrong word spoken completely!

  // Levenshtein character distance for accurate scoring
  const s = spokenWords.join(' ');
  const t = targetWords.join(' ');

  const matrix = Array(t.length + 1).fill(null).map(() => Array(s.length + 1).fill(null));
  for (let i = 0; i <= s.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= t.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= t.length; j++) {
    for (let i = 1; i <= s.length; i++) {
      const subCost = s[i - 1] === t[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + subCost
      );
    }
  }

  const distance = matrix[t.length][s.length];
  const maxLen = Math.max(s.length, t.length);
  const charScore = Math.max(0, (1 - distance / maxLen) * 100);

  const finalScore = Math.round((wordRatio * 50) + (charScore * 0.5));
  return Math.min(100, Math.max(0, finalScore));
}

// Game Complete Screen
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
      <LinearGradient colors={['#F472B6', '#EC4899', '#DB2777']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={gc.deco1} /><View style={gc.deco2} />
      <Animated.View style={[gc.card, style]}>
        <Text style={gc.emoji}>🎤</Text>
        <Text style={gc.congrats}>Voice Star! ⭐</Text>
        <Text style={gc.title}>Level {levelNum} Complete!</Text>
        <View style={gc.xpBadge}><Text style={gc.xpText}>⭐ +{score} XP Earned!</Text></View>
        <Text style={gc.message}>{score >= 60 ? 'Incredible pronunciation! Flawless! 🌟' : score >= 30 ? 'Great effort! Your accent is improving! 👏' : 'Keep practicing those sounds! 💪'}</Text>
        <View style={{ width: '100%', gap: 10 }}>
          <Pressable style={gc.btn} onPress={onNextLevel}>
            <LinearGradient colors={['#EC4899', '#DB2777']} style={gc.btnGrad}>
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
  deco1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)', top: -60, right: -40 },
  deco2: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.15)', bottom: -30, left: -30 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 32,
    padding: 36, alignItems: 'center', width: '85%', maxWidth: 380,
    borderWidth: 3, borderColor: 'rgba(255,255,255,1)',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 20px 60px rgba(0,0,0,0.2)' } : { elevation: 20 }),
  },
  emoji: { fontSize: 72, marginBottom: 12 },
  congrats: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.pink, marginBottom: 4 },
  title: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.textDark, marginBottom: 20 },
  xpBadge: { backgroundColor: Colors.yellowLight, borderRadius: Radius.pill, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 2.5, borderColor: Colors.yellow, marginBottom: 14 },
  xpText: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.yellowDark },
  message: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  btn: { width: '100%', borderRadius: Radius.pill, overflow: 'hidden' },
  btnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: Radius.pill },
  btnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
});

function GamePronouncePlay({ 
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
  const speechCode = SPEECH_CODES[lang] || 'ta-IN';

  const [questions, setQuestions] = useState<Array<{ word: string; meaning: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; badge: string; isWrong?: boolean } | null>(null);

  const recognitionRef = useRef<any>(null);
  const isAdvancingRef = useRef(false);
  const micScale = useSharedValue(1);
  const micStyle = useAnimatedStyle(() => ({ transform: [{ scale: micScale.value }] }));

  useEffect(() => {
    const generated = getPronounceQuestions(selectedLevelNum, lang);
    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setGameFinished(false);
    setFeedback(null);
  }, [selectedLevelNum, user, lang]);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = speechCode;

      recognitionRef.current.onresult = (e: any) => {
        let t = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          t += e.results[i][0].transcript;
        }
        setTranscript(t);
      };

      recognitionRef.current.onerror = () => stopRecording(true);
      recognitionRef.current.onend = () => {
        if (isRecording) stopRecording(false);
      };
    }
  }, [speechCode, isRecording]);

  const startRecording = () => {
    setTranscript('');
    setFeedback(null);
    setIsRecording(true);
    micScale.value = withSpring(1.25);
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch {}
    }
  };

  const handleFinish = async (finalScore: number) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    try {
      setGameFinished(true);
      if (user) {
        await updateProgress(finalScore);
        if (selectedLevelNum) {
          try {
            const saved = await AsyncStorage.getItem('@game_pronounce_completed');
            const prevMax = saved ? parseInt(saved, 10) : 0;
            if (selectedLevelNum > prevMax) {
              await AsyncStorage.setItem('@game_pronounce_completed', selectedLevelNum.toString());
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

  const stopRecording = (isErr = false) => {
    setIsRecording(false);
    micScale.value = withSpring(1);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const targetWord = currentQ ? currentQ.word : '';
    const simScore = isErr ? 0 : computeSpeechAccuracy(transcript, targetWord);

    // Strict accuracy threshold check
    if (simScore < 50) {
      setFeedback({ 
        score: simScore, 
        badge: `❌ Try Again! (${simScore}% Match)`,
        isWrong: true
      });
      return; // Do NOT advance; allow retry!
    }

    const badge = simScore >= 85 ? '🌟 Perfect!' : simScore >= 70 ? '👍 Great!' : '💪 Good Effort!';
    setFeedback({ score: simScore, badge, isWrong: false });

    const gained = Math.round(simScore / 5);
    const nextScore = score + gained;
    setScore(nextScore);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setFeedback(null);
        setTranscript('');
      } else {
        handleFinish(nextScore);
      }
    }, 1800);
  };

  const playTargetAudio = () => {
    if (currentQ) playAudio(currentQ.word, lang);
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
      <LinearGradient colors={['#FDF2F8', '#FCE7F3', '#FFF1F2']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}><Text style={styles.backTxt}>← Back</Text></Pressable>
        <Text style={styles.headerTitle}>🎤 Level {selectedLevelNum}</Text>
        <View style={styles.scorePill}><Text style={styles.scoreText}>⭐ {score}</Text></View>
      </View>

      <View style={styles.content}>
        {currentQ && (
          <>
            <Animated.View entering={FadeInDown.springify()} style={styles.wordCard}>
              <Text style={styles.wordTarget}>{currentQ.word}</Text>
              <Text style={styles.wordMeaning}>"{currentQ.meaning}"</Text>
              
              <Pressable onPress={playTargetAudio} style={styles.audioListenBtn}>
                <Text style={styles.audioListenTxt}>🔊 Listen first</Text>
              </Pressable>
            </Animated.View>

            <View style={styles.micSection}>
              {feedback ? (
                <Animated.View entering={FadeIn} style={[styles.feedbackCard, feedback.isWrong && styles.feedbackCardWrong]}>
                  <Text style={[styles.feedbackBadge, feedback.isWrong && styles.feedbackBadgeWrong]}>{feedback.badge}</Text>
                  <Text style={[styles.feedbackScore, feedback.isWrong && styles.feedbackScoreWrong]}>
                    {feedback.isWrong ? `Spoken: "${transcript || 'Nothing'}"` : `${feedback.score}% Match`}
                  </Text>
                </Animated.View>
              ) : (
                <Text style={styles.instruction}>
                  {isRecording ? 'Listening... Speak clearly! 🗣️' : 'Tap the mic & read out loud! 👇'}
                </Text>
              )}

              <Pressable onPress={isRecording ? () => stopRecording() : startRecording}>
                <Animated.View style={[styles.micBtn, micStyle, isRecording && styles.micActive]}>
                  <LinearGradient
                    colors={isRecording ? [Colors.red, '#DC2626'] as [string,string] : ['#EC4899', '#DB2777'] as [string,string]}
                    style={styles.micGrad}
                  >
                    <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎙️'}</Text>
                  </LinearGradient>
                </Animated.View>
              </Pressable>

              {transcript && !feedback ? (
                <View style={styles.transcriptBox}>
                  <Text style={styles.transcriptTxt}>"{transcript}"</Text>
                </View>
              ) : null}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default function GamePronounceScreen() {
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
          gameTitle="Speech Pronounce"
          gameIcon="🎤"
          accentColor="#DB2777"
          gameKey="pronounce"
          onSelectLevel={(num) => { 
            setSelectedLevelNum(num); 
          }} 
        />
      </View>
    );
  }

  return (
    <GamePronouncePlay 
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

  content: { flex: 1, padding: 20, justifyContent: 'space-around', alignItems: 'center' },
  wordCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: Radius.xl, padding: 28, alignItems: 'center', borderWidth: 2.5, borderColor: '#FBCFE8' },
  wordTarget: { fontFamily: Fonts.heading, fontSize: 36, color: Colors.textDark, marginBottom: 4 },
  wordMeaning: { fontFamily: Fonts.bodyReg, fontSize: 18, color: Colors.textMid, marginBottom: 16 },
  audioListenBtn: { backgroundColor: Colors.pinkLight, borderRadius: Radius.pill, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, borderColor: Colors.pink },
  audioListenTxt: { fontFamily: Fonts.body, fontSize: 14, color: Colors.pinkDark },

  micSection: { alignItems: 'center', width: '100%' },
  instruction: { fontFamily: Fonts.bodyReg, fontSize: 16, color: Colors.textMid, marginBottom: 20, textAlign: 'center' },
  micBtn: {
    borderRadius: 60, marginBottom: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(236,72,153,0.4)' } : { elevation: 12 }),
  },
  micActive: {
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(239,68,68,0.6)' } : { elevation: 16 }),
  },
  micGrad: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  micIcon: { fontSize: 54 },

  feedbackCard: { backgroundColor: '#FFFFFF', borderRadius: Radius.pill, paddingHorizontal: 24, paddingVertical: 10, borderWidth: 2, borderColor: Colors.green, marginBottom: 16, alignItems: 'center' },
  feedbackBadge: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.greenDark },
  feedbackScore: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.green },

  feedbackCardWrong: { borderColor: Colors.red, backgroundColor: Colors.redLight },
  feedbackBadgeWrong: { color: Colors.red },
  feedbackScoreWrong: { color: Colors.red },

  transcriptBox: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: Radius.md, paddingHorizontal: 16, paddingVertical: 8, marginTop: 10 },
  transcriptTxt: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, fontStyle: 'italic' },
});
