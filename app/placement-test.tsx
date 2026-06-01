import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Radius, Shadow } from '../components/KidsTheme';
import { generateAssessmentQuestions, AssessmentQuestion } from '../utils/ai';

export default function PlacementTestScreen() {
  const router = useRouter();
  const { language } = useLocalSearchParams();
  
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const q = await generateAssessmentQuestions((language as string) || 'Tamil');
      setQuestions(q);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load test');
      setLoading(false);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === questions[currentIndex].correctOption;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest(correctCount + (isCorrect ? 1 : 0));
    }
  };

  const finishTest = (finalCorrect: number) => {
    // 10 questions total.
    // 8-10 correct: Pro (100)
    // 4-7 correct: Intermediate (50)
    // 0-3 correct: Beginner (0)
    let finalScore = 0;
    if (finalCorrect >= 8) finalScore = 100;
    else if (finalCorrect >= 4) finalScore = 50;
    else finalScore = 0;

    router.replace({ pathname: '/result', params: { score: finalScore } });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <LinearGradient colors={['#F0FFF4', '#EFF6FF', '#FDF4FF']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        <ActivityIndicator size="large" color={Colors.purple} />
        <Text style={styles.loadingText}>Generating your placement test...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <LinearGradient colors={['#F0FFF4', '#EFF6FF', '#FDF4FF']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        <Text style={styles.errorText}>Oops! {error}</Text>
        <Pressable style={styles.retryButton} onPress={loadQuestions}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0FFF4', '#EFF6FF', '#FDF4FF']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      
      <View style={styles.header}>
        <Text style={styles.progressText}>Question {currentIndex + 1} of 10</Text>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: `${((currentIndex) / 10) * 100}%` }]} />
        </View>
      </View>

      <Animated.View key={currentIndex} entering={FadeInRight.springify()} style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQ.question}</Text>
        
        <View style={styles.optionsList}>
          {currentQ.options.map((opt, idx) => (
            <OptionCard key={idx} text={opt} onPress={() => handleAnswer(idx)} index={idx} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function OptionCard({ text, onPress, index }: { text: string, onPress: () => void, index: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeIn.delay(index * 100)} style={[animStyle, { width: '100%' }]}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
        style={styles.optionCard}
      >
        <Text style={styles.optionText}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 16, fontFamily: Fonts.bodySemi, fontSize: 16, color: Colors.textMid },
  errorText: { fontFamily: Fonts.bodySemi, fontSize: 16, color: Colors.textDark, marginBottom: 16 },
  retryButton: { backgroundColor: Colors.purple, padding: 12, borderRadius: Radius.md, marginTop: 12 },
  retryText: { color: '#fff', fontFamily: Fonts.heading, fontSize: 16 },
  
  header: { padding: 20, paddingTop: 60 },
  progressText: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.textDark, marginBottom: 8 },
  progressBar: { height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.greenLight },

  questionContainer: { flex: 1, padding: 20, alignItems: 'center' },
  questionText: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.textDark, textAlign: 'center', marginBottom: 40 },
  
  optionsList: { width: '100%', maxWidth: 480, gap: 16 },
  optionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' } : { ...Shadow.card }),
  },
  optionText: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.textDark },
});
