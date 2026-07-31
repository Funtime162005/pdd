import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withTiming, SlideInRight } from 'react-native-reanimated';
import { generateFlashcardLesson, Flashcard } from '../../utils/ai';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { playAudio } from '../../utils/speech';

export default function Flashcards({ 
  skill, 
  title, 
  tier, 
  selectedLevelNum, 
  onBack, 
  onNextLevel 
}: { 
  skill: string; 
  title: string; 
  tier?: string; 
  selectedLevelNum?: number; 
  onBack?: () => void; 
  onNextLevel?: () => void; 
}) {
  const { user, updateProgress, completeModule, completeLevel } = useAuth();
  const router = useRouter();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Requirements state: must flip and listen before Next Card is enabled
  const [hasFlipped, setHasFlipped] = useState(false);
  const [hasHeard, setHasHeard] = useState(false);

  const isFlipped = useSharedValue(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        if (!user) return;
        const currentNum = selectedLevelNum || 1;
        const activeLevel = `Level ${currentNum} (${tier || user.level || 'Beginner'})`;
        const generated = await generateFlashcardLesson(title, activeLevel, user.learningLanguage || "Tamil");
        setCards(generated);
      } catch (err) {
        setError('Failed to load flashcards.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [user, selectedLevelNum, tier]);

  // Reset card interaction state whenever active card index changes
  useEffect(() => {
    setHasFlipped(false);
    setHasHeard(false);
  }, [currentIndex]);

  const currentCard = cards[currentIndex];

  const flipCard = () => {
    const willFlipToBack = isFlipped.value === 0;
    isFlipped.value = withTiming(willFlipToBack ? 1 : 0, { duration: 300 });

    if (willFlipToBack && currentCard) {
      setHasFlipped(true);
      setHasHeard(true);
      // Auto-play audio when card flips to reveal the native translation
      playAudio(currentCard.term, user?.learningLanguage || 'tamil');
    }
  };

  const handleAudioPress = (e: any) => {
    e.stopPropagation();
    if (currentCard) {
      setHasHeard(true);
      playAudio(currentCard.term, user?.learningLanguage || 'tamil');
    }
  };

  const canAdvance = hasFlipped && hasHeard;

  const handleNext = () => {
    if (!canAdvance) return;
    if (currentIndex < cards.length - 1) {
      isFlipped.value = 0; // reset flip animation
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
      }, 150);
    } else {
      setIsFinished(true);
    }
  };

  const isAdvancingRef = useRef(false);

  const handleComplete = async () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    try {
      const currentNum = selectedLevelNum || 1;
      const xpGained = cards.length * 5; // 5 XP per flashcard
      await updateProgress(xpGained);
      if (completeLevel) {
        await completeLevel(currentNum);
      }
      await completeModule(skill.toLowerCase());

      if (onNextLevel) {
        setIsFinished(false);
        setCurrentIndex(0);
        isFlipped.value = 0;
        onNextLevel();
      } else {
        router.replace('/(tabs)');
      }
    } finally {
      setTimeout(() => {
        isAdvancingRef.current = false;
      }, 1000);
    }
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${isFlipped.value * 180}deg` }],
      opacity: isFlipped.value < 0.5 ? 1 : 0,
      zIndex: isFlipped.value < 0.5 ? 1 : 0
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${(isFlipped.value - 1) * 180}deg` }],
      opacity: isFlipped.value > 0.5 ? 1 : 0,
      zIndex: isFlipped.value > 0.5 ? 1 : 0
    };
  });

  if (isLoading) return <ActivityIndicator size="large" color="#059669" style={{ marginTop: 100 }} />;
  if (error || cards.length === 0) return <Text style={{ color: 'red', marginTop: 100, textAlign: 'center' }}>{error}</Text>;

  if (isFinished) {
    const xpGained = cards.length * 5;
    return (
      <Animated.View entering={FadeInUp.springify()} style={styles.resultCard}>
        <Text style={{ fontSize: 40 }}>🧠</Text>
        <Text style={styles.questionText}>Stack Complete!</Text>
        <Text style={{ fontSize: 18, color: '#4B5563', marginVertical: 10 }}>You reviewed {cards.length} terms.</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP</Text>
        <Pressable style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Continue →</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View key={currentIndex} entering={SlideInRight.springify()} style={{ flex: 1, alignItems: 'center' }}>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 }}>
        <Pressable 
          onPress={() => { 
            if (onBack) { 
              onBack(); 
            } else if (router.canGoBack()) { 
              router.back(); 
            } else { 
              router.replace('/(tabs)'); 
            } 
          }} 
          style={{ marginRight: 15, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#ECFDF5', borderRadius: 12 }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#065F46' }}>← Back</Text>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#065F46', flex: 1 }}>{title}</Text>
        <Text style={styles.counter}>{currentIndex + 1} / {cards.length}</Text>
      </View>
      
      <Pressable style={styles.cardContainer} onPress={flipCard}>
        {/* Front of Card */}
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <Text style={styles.cardHint}>👆 Tap to translate & hear</Text>
          {currentCard.emoji ? <Text style={{ fontSize: 80, marginBottom: 20 }}>{currentCard.emoji}</Text> : null}
          <Text style={styles.englishText}>{currentCard.translation}</Text>
        </Animated.View>

        {/* Back of Card */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <Text style={styles.cardHint}>🔊 Pronunciation Loaded</Text>
          {currentCard.emoji ? <Text style={{ fontSize: 80, marginBottom: 20 }}>{currentCard.emoji}</Text> : null}
          <Text style={styles.nativeText}>{currentCard.term}</Text>
        </Animated.View>
      </Pressable>

      <View style={styles.actionRow}>
        <Pressable 
          style={[styles.button, !canAdvance && { backgroundColor: '#9CA3AF', opacity: 0.65 }]} 
          onPress={handleNext}
          disabled={!canAdvance}
        >
          <Text style={styles.buttonText}>
            {canAdvance ? 'Next Card ➡️' : '👆 Tap Card to Reveal & Hear First'}
          </Text>
        </Pressable>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  resultCard: { backgroundColor: 'white', borderRadius: 24, padding: 30, alignItems: 'center' },
  questionText: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 10 },
  counter: { fontSize: 18, fontWeight: 'bold', color: '#6B7280', marginBottom: 20 },
  cardContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
    transform: [{ perspective: 1000 }]
  },
  card: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#F0FDF4',
  },
  cardHint: {
    position: 'absolute',
    top: 20,
    fontSize: 14,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  englishText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  nativeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
  },
  actionRow: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
