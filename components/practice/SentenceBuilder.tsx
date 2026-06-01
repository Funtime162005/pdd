import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';
import { generateSentenceLesson, SentenceQuestion } from '../../utils/ai';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { playAudio } from '../../utils/speech';

export default function SentenceBuilder({ skill, title, selectedLevelNum, selectedTier, onBack }: { skill: string, title: string, selectedLevelNum?: number, selectedTier?: string, onBack?: () => void }) {
  const { user, updateProgress, completeModule } = useAuth();
  const router = useRouter();

  const activeTier = selectedTier || (user?.level?.split(' - ')[0] || 'Intermediate');
  const activeLevelStr = selectedLevelNum ? `${activeTier} - Level ${selectedLevelNum}` : (user?.level || 'Intermediate');

  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newTier, setNewTier] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        if (!user) return;
        const generated = await generateSentenceLesson(activeLevelStr, user.learningLanguage || "Tamil");
        setQuestions(generated);
        // Scramble the first question
        if (generated.length > 0) {
          setAvailableWords([...generated[0].scrambledWords].sort(() => Math.random() - 0.5));
        }
      } catch (err) {
        setError('Failed to load the AI lesson. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [user]);

  const handleSelectWord = (word: string) => {
    if (checked) return;
    setAvailableWords(prev => prev.filter(w => w !== word));
    setSelectedWords(prev => [...prev, word]);
  };

  const handleDeselectWord = (word: string) => {
    if (checked) return;
    setSelectedWords(prev => prev.filter(w => w !== word));
    setAvailableWords(prev => [...prev, word]);
  };

  const handleCheck = () => {
    const currentQ = questions[currentIndex];
    const correctStr = currentQ.correctOrder.join(' ');
    const selectedStr = selectedWords.join(' ');
    const correct = correctStr === selectedStr;
    setIsCorrect(correct);
    setChecked(true);
    if (correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setChecked(false);
    setIsCorrect(false);
    setSelectedWords([]);
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAvailableWords([...questions[nextIndex].scrambledWords].sort(() => Math.random() - 0.5));
    } else {
      setIsFinished(true);
    }
  };

  const handleComplete = async () => {
    const xpGained = score * 15; // More XP for sentences!
    updateProgress(xpGained); // XP for leaderboard only
    const result = await completeModule('foundations');
    if (result?.leveledUp) {
      setLeveledUp(true);
      setNewTier(result.newTier);
    } else {
      router.replace('/(tabs)');
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#059669" style={{ marginTop: 100 }} />;
  if (error || questions.length === 0) return <Text style={{ color: 'red', marginTop: 100, textAlign: 'center' }}>{error}</Text>;

  if (isFinished) {
    const xpGained = score * 15;
    if (leveledUp) {
      return (
        <Animated.View entering={FadeInUp.springify()} style={[styles.card, { borderWidth: 2, borderColor: '#F59E0B' }]}>
          <Text style={{ fontSize: 60, marginBottom: 4 }}>🎉</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 10 }}>Level Up!</Text>
          <Text style={{ fontSize: 16, color: '#4B5563', textAlign: 'center', marginVertical: 10 }}>All 4 modules complete! Welcome to <Text style={{ fontWeight: 'bold', color: '#10B981' }}>{newTier}</Text>!</Text>
          <Text style={{ fontSize: 18, color: '#4B5563', marginBottom: 6 }}>Score: {score}/{questions.length}</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP (Leaderboard)</Text>
          <Pressable style={[styles.button, { backgroundColor: '#F59E0B' }]} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.buttonText}>Start {newTier} Phase 🚀</Text>
          </Pressable>
        </Animated.View>
      );
    }
    return (
      <Animated.View entering={FadeInUp.springify()} style={styles.card}>
        <Text style={{ fontSize: 40 }}>🎯</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 10 }}>Lesson Complete!</Text>
        <Text style={{ fontSize: 18, color: '#4B5563', marginVertical: 10 }}>You scored {score} out of {questions.length}</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP (Leaderboard)</Text>
        <Pressable style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </Animated.View>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <Animated.View key={currentIndex} entering={SlideInRight.springify()} style={[styles.container, { padding: 24, paddingTop: 40 }]}>
      {onBack && (
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back to Map</Text>
        </Pressable>
      )}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSub}>Translate this sentence</Text>
      </View>

      <Text style={styles.englishText}>{currentQ.english}</Text>

      {/* Selected words dropzone */}
      <View style={styles.dropZone}>
        {selectedWords.length === 0 && (
          <Text style={styles.placeholderText}>Tap words to form the sentence</Text>
        )}
        {selectedWords.map((word, idx) => (
          <Pressable key={idx} style={[styles.wordChip, styles.wordChipSelected]} onPress={() => handleDeselectWord(word)}>
            <Text style={styles.wordText}>{word}</Text>
          </Pressable>
        ))}
      </View>

      {/* Available words */}
      <View style={styles.availableZone}>
        {availableWords.map((word, idx) => (
          <Pressable key={idx} style={styles.wordChip} onPress={() => handleSelectWord(word)}>
            <Text style={styles.wordText}>{word}</Text>
          </Pressable>
        ))}
      </View>

      {checked && (
        <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={[styles.feedbackTitle, { color: isCorrect ? '#065F46' : '#991B1B' }]}>
                {isCorrect ? 'Excellent!' : 'Incorrect'}
              </Text>
              {!isCorrect && (
                <Text style={styles.feedbackSubtitle}>Correct answer: {currentQ.correctOrder.join(' ')}</Text>
              )}
            </View>
            <Pressable onPress={() => playAudio(currentQ.correctOrder.join(' '), user?.learningLanguage || 'tamil')} style={{ padding: 10, backgroundColor: isCorrect ? '#A7F3D0' : '#FECACA', borderRadius: 20 }}>
              <Text style={{ fontSize: 24 }}>🎧</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Footer Actions */}
      <View style={styles.actionRow}>
        {!checked ? (
          <Pressable 
            style={[styles.button, selectedWords.length === 0 && styles.buttonDisabled]} 
            onPress={handleCheck}
            disabled={selectedWords.length === 0}
          >
            <Text style={styles.buttonText}>Check</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.button, { backgroundColor: isCorrect ? '#10B981' : '#EF4444' }]} onPress={handleNext}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 30, alignItems: 'center' },
  englishText: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 30 },
  dropZone: {
    minHeight: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB'
  },
  placeholderText: { color: '#9CA3AF', fontSize: 16, textAlign: 'center', width: '100%', marginTop: 25 },
  availableZone: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40
  },
  wordChip: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    boxShadow: '0px 4px 6px rgba(0,0,0,0.05)',
    elevation: 3
  },
  wordChipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981'
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  backBtnText: {
    color: '#0EA5E9',
    fontSize: 16,
    fontWeight: '700',
  },
  header: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerSub: { fontSize: 14, color: '#666' },
  wordText: { fontSize: 18, fontWeight: '600', color: '#374151' },
  feedbackBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  feedbackCorrect: { backgroundColor: '#D1FAE5' },
  feedbackIncorrect: { backgroundColor: '#FEE2E2' },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  feedbackSubtitle: { fontSize: 16, color: '#7F1D1D' },
  actionRow: { marginTop: 'auto', paddingBottom: 20 },
  button: { backgroundColor: '#10B981', padding: 18, borderRadius: 16, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#D1D5DB' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
