import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { generateReadingLesson, ReadingStory } from '../../utils/ai';
import { playAudio } from '../../utils/speech';

export default function ReadingUI({ 
  skill = 'reading', 
  title, 
  tier, 
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
  const { user, updateProgress, completeModule, completeLevel } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<ReadingStory | null>(null);
  
  // 'reading' -> 'quiz' -> 'done'
  const [phase, setPhase] = useState<'reading' | 'quiz' | 'done'>('reading');
  const [showTranslations, setShowTranslations] = useState(false);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const isAdvancingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStory = async () => {
      try {
        setLoading(true);
        if (!user) return;
        const currentNum = selectedLevelNum || 1;
        const activeLevel = `Level ${currentNum} (${tier || user.level || 'Beginner'})`;
        const lang = user.learningLanguage || 'tamil';
        const fetchedStory = await generateReadingLesson(activeLevel, lang);
        if (isMounted) {
          setStory(fetchedStory);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          Alert.alert('Error', 'Failed to generate story. Please try again.');
          if (onBack) onBack();
          else router.replace('/(tabs)');
        }
      }
    };
    fetchStory();
    return () => { isMounted = false; };
  }, [user, selectedLevelNum, tier]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F43F5E" />
        <Text style={styles.loadingText}>Writing a story just for you...</Text>
      </View>
    );
  }

  if (!story) return null;

  const handleNextPhase = () => {
    setPhase('quiz');
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; // prevent multiple clicks
    
    setSelectedOption(index);
    const correct = index === story.questions[currentQuestionIndex].correctOption;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQuestionIndex < story.questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        handleFinish(correct ? score + 1 : score);
      }
    }, 1500);
  };

  const handleFinish = async (finalScore: number) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    try {
      setPhase('done');
      const currentNum = selectedLevelNum || 1;
      const xpGained = finalScore * 10;
      await updateProgress(xpGained);
      if (completeLevel) {
        await completeLevel(currentNum);
      }
      await completeModule((skill || 'reading').toLowerCase());
    } finally {
      setTimeout(() => {
        isAdvancingRef.current = false;
      }, 1000);
    }
  };

  if (phase === 'done') {
    return (
      <View style={styles.center}>
        <Text style={styles.doneTitle}>Fantastic Reading! 🎉</Text>
        <Text style={styles.doneScore}>You answered {score} out of {story.questions.length} questions correctly.</Text>
        <Text style={styles.xpText}>+{score * 10} XP</Text>
        <Pressable 
          style={styles.btn} 
          onPress={() => {
            if (onNextLevel) {
              setPhase('reading');
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setIsCorrect(null);
              setScore(0);
              onNextLevel();
            } else {
              router.replace('/(tabs)');
            }
          }}
        >
          <Text style={styles.btnText}>{onNextLevel ? "Next Level →" : "Return to Dashboard"}</Text>
        </Pressable>
      </View>
    );
  }

  if (phase === 'quiz') {
    const question = story.questions[currentQuestionIndex];
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>Comprehension Quiz</Text>
        <View style={styles.quizCard}>
          <Text style={styles.questionText}>{question.question}</Text>
          <View style={styles.optionsContainer}>
            {question.options.map((opt, idx) => {
              let btnStyle = [styles.optionBtn];
              let textStyle = [styles.optionText];
              
              if (selectedOption !== null) {
                if (idx === question.correctOption) {
                  btnStyle.push(styles.optionCorrect);
                  textStyle.push(styles.textCorrect);
                } else if (idx === selectedOption) {
                  btnStyle.push(styles.optionWrong);
                  textStyle.push(styles.textWrong);
                }
              }

              return (
                <Pressable
                  key={idx}
                  style={btnStyle}
                  onPress={() => handleOptionSelect(idx)}
                >
                  <Text style={textStyle}>{opt}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              if (onBack) onBack();
              else if (router.canGoBack()) router.back();
              else router.replace('/(tabs)');
            }} 
            style={styles.backBtn}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1E293B' }}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{title || "Story Time"}</Text>
          <Pressable onPress={() => setShowTranslations(!showTranslations)} style={styles.translateToggle}>
            <Text style={{ fontSize: 16 }}>🌐</Text>
            <Text style={styles.translateToggleText}>{showTranslations ? "Hide" : "Translate"}</Text>
          </Pressable>
        </View>

        <Text style={styles.storyTitle}>{story.title}</Text>
        {showTranslations && <Text style={styles.storyTitleEnglish}>{story.titleEnglish}</Text>}

        <View style={styles.storyContainer}>
          {story.paragraphs.map((p, i) => (
            <View key={i} style={styles.paragraphBox}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 15 }}>
                <Text style={[styles.paragraphNative, { flex: 1 }]}>{p.native}</Text>
                <Pressable onPress={() => playAudio(p.native, user?.learningLanguage || 'tamil')} style={{ padding: 10, backgroundColor: '#E0F2FE', borderRadius: 20, marginTop: 5 }}>
                  <Text style={{ fontSize: 24 }}>🎧</Text>
                </Pressable>
              </View>
              {showTranslations && (
                <Text style={styles.paragraphEnglish}>{p.english}</Text>
              )}
            </View>
          ))}
        </View>

        <Pressable style={styles.btn} onPress={handleNextPhase}>
          <Text style={styles.btnText}>Take the Quiz ➡️</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 20 },
  loadingText: { marginTop: 20, fontSize: 16, color: '#64748B' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backBtn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#F1F5F9', borderRadius: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', textAlign: 'center' },
  translateToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFE4E6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  translateToggleText: { color: '#E11D48', fontWeight: 'bold', fontSize: 14 },
  
  storyTitle: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  storyTitleEnglish: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 24, fontStyle: 'italic' },
  
  storyContainer: { backgroundColor: 'white', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, marginBottom: 30 },
  paragraphBox: { marginBottom: 20 },
  paragraphNative: { fontSize: 22, color: '#1E293B', lineHeight: 34, marginBottom: 8 },
  paragraphEnglish: { fontSize: 16, color: '#64748B', lineHeight: 24, fontStyle: 'italic', borderLeftWidth: 3, borderLeftColor: '#F43F5E', paddingLeft: 12 },
  
  btn: { backgroundColor: '#F43F5E', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16, alignItems: 'center', shadowColor: '#BE123C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  doneTitle: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  doneScore: { fontSize: 16, color: '#64748B', marginBottom: 20 },
  xpText: { fontSize: 32, fontWeight: 'bold', color: '#F43F5E', marginBottom: 40 },

  quizCard: { backgroundColor: 'white', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, marginTop: 40, marginHorizontal: 20 },
  questionText: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 24, lineHeight: 28 },
  optionsContainer: { gap: 12 },
  optionBtn: { padding: 16, borderRadius: 16, borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  optionText: { fontSize: 16, color: '#334155' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  textCorrect: { color: '#059669' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  textWrong: { color: '#B91C1C' },
});
