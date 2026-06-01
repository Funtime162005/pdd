import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { generatePracticeLesson, AssessmentQuestion } from '../../utils/ai';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { QUIZ_POOLS } from '../../constants/translations';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function QuizUI({ skill, title, tier }: { skill: string, title: string, tier?: string }) {
  const { user, updateProgress, completeModule } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newTier, setNewTier] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        if (!user) return;

        // Use explicitly requested tier or fallback to calculated tier
        let activeTier = tier;
        if (!activeTier) {
          activeTier = 'Beginner';
          if (user.level?.includes('Pro') || (user.xp || 0) >= 1000) activeTier = 'Pro';
          else if (user.level?.includes('Intermediate') || (user.xp || 0) >= 300) activeTier = 'Intermediate';
        }

        if (skill === 'mini-quiz' && activeTier === 'Beginner') {
          // Beginner: use local 50-question pool
          const lang = user.learningLanguage || 'tamil';
          const pool = QUIZ_POOLS[lang] || QUIZ_POOLS['tamil'];
          const shuffled = [...pool].sort(() => Math.random() - 0.5);
          const mappedQuestions = shuffled.slice(0, 50).map((q, idx) => ({
            id: idx,
            question: `What is the translation for "${q.target}"?`,
            options: q.options,
            correctOption: q.correct,
            type: 'text' as const
          }));
          setQuestions(mappedQuestions);
        } else {
          // Intermediate / Pro: use AI to generate hard language-specific questions
          const lang = user.learningLanguage || 'Tamil';
          const levelLabel = activeTier === 'Pro'
            ? `Pro-level (native idioms, complex grammar, cultural nuances in ${lang})`
            : `Intermediate-level (sentence structure, tenses, conversational ${lang})`;
          const generated = await generatePracticeLesson(
            `${levelLabel} ${title.toLowerCase()}`,
            activeTier,
            lang
          );
          setQuestions(generated);
        }
      } catch (err) {
        setError('Failed to load the AI lesson. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [skill, user]);

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === questions[currentIndex].correctOption;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      // Finished the quiz
      // Let's check passing logic immediately to trigger completeModule if needed
      const finalScore = isCorrect ? score + 1 : score;
      setScore(finalScore);
      setIsFinished(true);
      
      const percentage = (finalScore / questions.length) * 100;
      const isPassing = percentage >= 60;
      
      if (isPassing) {
        const moduleId = skill === 'mini-quiz' ? 'assessment' : skill.toLowerCase();
        completeModule(moduleId).then(result => {
          if (result?.leveledUp) {
            setLeveledUp(true);
            setNewTier(result.newTier);
          }
        });
      }
    }
  };

  const handleContinue = () => {
    const percentage = (score / questions.length) * 100;
    const isPassing = percentage >= 60;
    
    if (isPassing) {
      const xpGained = score * 10;
      updateProgress(xpGained); // XP for leaderboard only
    }
    
    router.replace('/(tabs)');
  };

  if (isLoading) return <ActivityIndicator size="large" color="#059669" style={{ marginTop: 100 }} />;
  if (error || questions.length === 0) return <Text style={{ color: 'red', marginTop: 100, textAlign: 'center' }}>{error}</Text>;

  if (isFinished) {
    const xpGained = score * 10;
    const percentage = (score / questions.length) * 100;
    const isPassing = percentage >= 60;

    if (leveledUp) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
          <ConfettiCannon count={150} origin={{x: -10, y: 0}} fallSpeed={2500} fadeOut />
          <Animated.View entering={FadeInDown.springify()} style={[styles.card, { borderWidth: 2, borderColor: '#F59E0B' }]}>
            <Text style={{ fontSize: 60, marginBottom: 4 }}>🎉</Text>
            <Text style={styles.questionText}>Level Up!</Text>
            <Text style={{ fontSize: 16, color: '#4B5563', textAlign: 'center', marginVertical: 10 }}>All 4 modules complete! Welcome to <Text style={{ fontWeight: 'bold', color: '#10B981' }}>{newTier}</Text>!</Text>
            <Text style={{ fontSize: 18, color: '#4B5563', marginBottom: 6 }}>Score: {score}/{questions.length} ({percentage.toFixed(0)}%)</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP</Text>
            <Pressable style={[styles.nextButton, { backgroundColor: '#F59E0B' }]} onPress={handleContinue}>
              <Text style={styles.nextText}>Start {newTier} Phase 🚀</Text>
            </Pressable>
          </Animated.View>
        </View>
      );
    }
    
    if (!isPassing) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.View entering={FadeInDown.springify()} style={styles.card}>
            <Text style={{ fontSize: 40 }}>💪</Text>
            <Text style={[styles.questionText, { color: '#EF4444' }]}>Keep Practicing!</Text>
            <Text style={{ fontSize: 16, color: '#4B5563', textAlign: 'center', marginVertical: 10 }}>You scored {score} out of {questions.length} ({percentage.toFixed(0)}%).</Text>
            <Text style={{ fontSize: 16, color: '#4B5563', textAlign: 'center', marginVertical: 10, fontWeight: 'bold' }}>You need 60% or higher to pass the assessment and advance.</Text>
            <Pressable style={[styles.nextButton, { backgroundColor: '#EF4444', marginTop: 20 }]} onPress={handleContinue}>
              <Text style={styles.nextText}>Return to Dashboard</Text>
            </Pressable>
          </Animated.View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ConfettiCannon count={100} origin={{x: -10, y: 0}} />
        <Animated.View entering={FadeInDown.springify()} style={styles.card}>
          <Text style={{ fontSize: 40 }}>🎯</Text>
          <Text style={styles.questionText}>Lesson Complete!</Text>
          <Text style={{ fontSize: 18, color: '#4B5563', marginVertical: 10 }}>You scored {score} out of {questions.length} ({percentage.toFixed(0)}%)</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP</Text>
          <Pressable style={styles.nextButton} onPress={handleContinue}>
            <Text style={styles.nextText}>Continue</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Text style={{ fontSize: 24 }}>✕</Text>
        </Pressable>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#059669' }}>
          {currentIndex + 1}/{questions.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View key={currentIndex} entering={SlideInRight.springify()} style={styles.card}>
          <Text style={styles.questionText}>{currentQ.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQ.options.map((opt, idx) => (
              <Pressable
                key={idx}
                style={[styles.optionButton, selectedOption === idx && styles.optionSelected]}
                onPress={() => setSelectedOption(idx)}
              >
                <Text style={[styles.optionText, selectedOption === idx && styles.optionTextSelected]}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.nextButton, selectedOption === null && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedOption === null}
        >
          <Text style={styles.nextText}>
            {currentIndex === questions.length - 1 ? 'Finish Lesson' : 'Next Question'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  progressBarBg: { flex: 1, height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, marginHorizontal: 15, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10B981' },
  scrollContent: { paddingBottom: 120 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 30, alignItems: 'center', elevation: 5 },
  questionText: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 30 },
  optionsContainer: { width: '100%', gap: 15 },
  optionButton: { padding: 20, borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', backgroundColor: 'white', alignItems: 'center' },
  optionSelected: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  optionText: { fontSize: 18, color: '#4B5563', fontWeight: '500' },
  optionTextSelected: { color: '#065F46', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: -20, right: -20, padding: 20, paddingBottom: 40, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#F3F4F6' },
  nextButton: { backgroundColor: '#10B981', padding: 18, borderRadius: 16, alignItems: 'center' },
  nextButtonDisabled: { backgroundColor: '#9CA3AF' },
  nextText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
