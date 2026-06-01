import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, FadeInDown, withRepeat, withTiming, withSpring, useSharedValue, useAnimatedStyle, withSequence } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRONOUNCE_GAME_POOLS, SPEECH_CODES } from '../constants/translations';
import { Colors, Fonts, Radius, Shadow } from '../components/KidsTheme';

// Game Complete
function GameComplete({ score, onBack }: { score: number; onBack: () => void }) {
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
        <Text style={gc.title}>Battle Finished!</Text>
        <View style={gc.xpBadge}><Text style={gc.xpText}>⭐ +{score} XP Earned!</Text></View>
        <Text style={gc.message}>{score >= 60 ? 'Incredible pronunciation! Flawless! 🌟' : score >= 30 ? 'Great effort! Your accent is improving! 👏' : 'Keep practicing those sounds! 💪'}</Text>
        <Pressable style={gc.btn} onPress={onBack}>
          <LinearGradient colors={['#EC4899', '#DB2777']} style={gc.btnGrad}>
            <Text style={gc.btnText}>🎮 Back to Games</Text>
          </LinearGradient>
        </Pressable>
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

export default function GamePronounceScreen() {
  const router = useRouter();
  const { user, updateProgress } = useAuth();
  
  const lang = user?.learningLanguage || 'tamil';
  const QUESTION_POOL = PRONOUNCE_GAME_POOLS[lang] || PRONOUNCE_GAME_POOLS['tamil'];
  const speechCode = SPEECH_CODES[lang] || 'ta-IN';

  const [questions, setQuestions] = useState<typeof QUESTION_POOL>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; badge: string } | null>(null);

  const recognitionRef = useRef<any>(null);
  const pulseAnim = useSharedValue(1);
  const micScale = useSharedValue(1);
  const micStyle = useAnimatedStyle(() => ({ transform: [{ scale: micScale.value }] }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseAnim.value }] }));

  useEffect(() => {
    const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 4));
  }, []);

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
        for (let i = e.resultIndex; i < e.results.length; ++i) t += e.results[i][0].transcript;
        setTranscript(t);
      };
      recognitionRef.current.onerror = () => stopRecording(true);
      recognitionRef.current.onend = () => { if (isRecording) stopRecording(); };
    }
  }, []);

  const startRecording = () => {
    micScale.value = withSequence(withSpring(0.9), withSpring(1));
    setTranscript('');
    setFeedback(null);
    setIsRecording(true);
    pulseAnim.value = withRepeat(withSequence(withTiming(1.3, { duration: 600 }), withTiming(1, { duration: 600 })), -1, false);

    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) {}
    } else {
      setTimeout(() => setTranscript(currentQ.phrase + ' (mocked)'), 1500);
      setTimeout(() => stopRecording(), 3000);
    }
  };

  const stopRecording = (isError = false) => {
    setIsRecording(false);
    pulseAnim.value = withSpring(1);
    
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (!isError) evaluatePronunciation();
  };

  const evaluatePronunciation = () => {
    if (!transcript.trim()) {
      setFeedback({ score: 0, badge: 'No Speech Detected' });
      setTimeout(() => { setFeedback(null); setTranscript(''); }, 2500);
      return;
    }
    const target = currentQ.phrase.replace(/[\s.,!?]/g, '').toLowerCase();
    const spoken = transcript.replace(/[\s.,!?]/g, '').toLowerCase();
    
    if (!spoken) {
      setFeedback({ score: 0, badge: 'Could not understand' });
      setTimeout(() => { setFeedback(null); setTranscript(''); }, 2500);
      return;
    }
    let randScore = 0;
    const isMatch = spoken === target || spoken.includes(target) || (target.includes(spoken) && spoken.length > target.length / 2);

    if (isMatch) randScore = Math.floor(Math.random() * 11 + 90);
    else randScore = Math.floor(Math.random() * 31 + 10);

    let badge = 'Bronze';
    if (randScore >= 90) badge = 'Gold';
    else if (randScore >= 80) badge = 'Silver';
    else if (randScore >= 60) badge = 'Bronze';
    else badge = 'Needs Practice';

    setFeedback({ score: randScore, badge });
    if (randScore >= 60) setScore(s => s + (randScore >= 90 ? 20 : randScore >= 80 ? 15 : 10));

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setTranscript('');
        setFeedback(null);
      } else {
        setGameFinished(true);
        if (user) updateProgress(score);
      }
    }, 2500);
  };

  if (gameFinished) return <GameComplete score={score} onBack={() => router.replace('/games')} />;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FDF2F8', '#FCE7F3', '#FBCFE8']} style={StyleSheet.absoluteFill} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/games')} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🎤 Pronunciation Battle</Text>
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
            
            <View style={styles.instructionBadge}><Text style={styles.instructionText}>Speak this phrase</Text></View>
            <Text style={styles.phraseText}>"{currentQ.phrase}"</Text>
            <Text style={styles.englishText}>({currentQ.english})</Text>

            <View style={styles.micArea}>
              <Animated.View style={[styles.micPulse, pulseStyle, isRecording && { backgroundColor: Colors.redLight }]} />
              <Animated.View style={micStyle}>
                <Pressable 
                  style={[styles.micBtn, isRecording && styles.micBtnRec]}
                  onPress={isRecording ? () => stopRecording() : startRecording}
                >
                  <Text style={styles.micIcon}>🎙️</Text>
                </Pressable>
              </Animated.View>
            </View>
            
            <Text style={[styles.statusText, isRecording && { color: Colors.red }]}>
              {isRecording ? "Listening... (Tap to stop)" : "Tap microphone to speak"}
            </Text>

            <View style={styles.bottomArea}>
              {transcript ? (
                <View style={styles.transcriptBox}>
                  <Text style={styles.transcriptLabel}>We heard:</Text>
                  <Text style={styles.transcriptText}>"{transcript}"</Text>
                </View>
              ) : <View style={{ height: 80 }} />}

              {feedback && (
                <Animated.View entering={FadeInDown.springify()} style={[styles.feedbackBox, feedback.score === 0 && { borderColor: Colors.red }]}>
                  <Text style={[styles.feedbackScore, feedback.score === 0 && { color: Colors.red }]}>
                    {feedback.score > 0 ? `${feedback.score}% Accuracy` : feedback.badge}
                  </Text>
                  {feedback.score > 0 && (
                    <View style={styles.badgeRow}>
                      <Text style={styles.badgeIcon}>{feedback.badge === 'Gold' ? '🥇' : feedback.badge === 'Silver' ? '🥈' : '🥉'}</Text>
                      <Text style={styles.badgeText}>{feedback.badge} Badge!</Text>
                    </View>
                  )}
                </Animated.View>
              )}
            </View>

          </Animated.View>
        )}
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
  dotActive: { backgroundColor: Colors.pink, transform: [{ scale: 1.2 }] },
  dotDone: { backgroundColor: Colors.green },
  scorePill: { backgroundColor: Colors.pinkLight, borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2, borderColor: Colors.pink },
  scoreTxt: { fontFamily: Fonts.body, fontSize: 14, color: Colors.pink },

  content: { flex: 1, padding: 16 },
  playCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    flex: 1,
    borderWidth: 2.5,
    borderColor: Colors.pinkLight,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(236,72,153,0.15)' } : { ...Shadow.card }),
  },
  
  instructionBadge: { backgroundColor: Colors.pinkLight, borderRadius: Radius.pill, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 16, borderWidth: 1.5, borderColor: Colors.pink },
  instructionText: { fontFamily: Fonts.bodySemi, fontSize: 13, color: Colors.pink },
  phraseText: { fontFamily: Fonts.heading, fontSize: 32, color: Colors.textDark, textAlign: 'center', marginBottom: 6 },
  englishText: { fontFamily: Fonts.bodyReg, fontSize: 18, color: Colors.textMid, textAlign: 'center', marginBottom: 40 },
  
  micArea: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  micPulse: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: Colors.pinkLight, opacity: 0.6 },
  micBtn: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.pink,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 20px rgba(236,72,153,0.4)' } : { elevation: 12 }),
  },
  micBtnRec: { backgroundColor: Colors.red, borderColor: Colors.redLight },
  micIcon: { fontSize: 44 },
  
  statusText: { fontFamily: Fonts.bodySemi, fontSize: 15, color: Colors.textMid, marginBottom: 24 },
  
  bottomArea: { width: '100%', alignItems: 'center' },
  transcriptBox: {
    backgroundColor: Colors.bgMuted,
    padding: 16, borderRadius: Radius.lg, width: '100%', alignItems: 'center',
    borderWidth: 2, borderColor: '#E5E7EB', marginBottom: 12,
  },
  transcriptLabel: { fontFamily: Fonts.bodySemi, fontSize: 12, color: Colors.textLight, letterSpacing: 0.5, marginBottom: 6 },
  transcriptText: { fontFamily: Fonts.bodyReg, fontSize: 18, color: Colors.textDark, fontStyle: 'italic' },

  feedbackBox: {
    backgroundColor: Colors.greenLight,
    padding: 16, borderRadius: Radius.lg, width: '100%', alignItems: 'center',
    borderWidth: 2.5, borderColor: Colors.green,
  },
  feedbackScore: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.greenDark, marginBottom: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeIcon: { fontSize: 24 },
  badgeText: { fontFamily: Fonts.body, fontSize: 16, color: Colors.greenDark },
});
