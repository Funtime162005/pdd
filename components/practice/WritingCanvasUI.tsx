import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, PanResponder, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { Colors, Fonts, Radius, Shadow } from '../KidsTheme';
import { useAuth } from '../../context/AuthContext';
import ConfettiCannon from 'react-native-confetti-cannon';
import { generateWritingChallenge, evaluateHandwriting, WritingChallenge, HandwritingEvaluation } from '../../utils/ai';
import { LinearGradient } from 'expo-linear-gradient';

const ALPHABETS: Record<string, string[]> = {
  tamil: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ'],
  hindi: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ'],
  telugu: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ'],
  malayalam: ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ'],
  kannada: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ'],
};

type Point = { x: number; y: number };

export default function WritingCanvasUI({ title, tier = 'Beginner' }: { title: string, tier?: string }) {
  const router = useRouter();
  const { user, updateProgress } = useAuth();
  
  const language = user?.learningLanguage || 'tamil';

  const isBeginner = tier === 'Beginner';

  const letters = ALPHABETS[language] || ALPHABETS['tamil'];
  
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [advancedChallenges, setAdvancedChallenges] = useState<WritingChallenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(!isBeginner);
  
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const currentPathRef = useRef<Point[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<HandwritingEvaluation | null>(null);

  useEffect(() => {
    if (!isBeginner) {
      loadChallenges();
    }
  }, [tier, language]);

  const loadChallenges = async () => {
    try {
      setLoadingChallenges(true);
      const challenges = await generateWritingChallenge(tier, language);
      setAdvancedChallenges(challenges);
    } catch (e) {
      console.error(e);
      // Fallback
      setAdvancedChallenges([{ englishWord: 'apple', expectedTranslation: 'ஆப்பிள்' }]);
    } finally {
      setLoadingChallenges(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPathRef.current = [{ x: locationX, y: locationY }];
        setCurrentPath(currentPathRef.current);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPathRef.current = [...currentPathRef.current, { x: locationX, y: locationY }];
        setCurrentPath(currentPathRef.current);
      },
      onPanResponderRelease: () => {
        const finishedPath = [...currentPathRef.current];
        if (finishedPath.length > 0) {
          setPaths((prev) => [...prev, finishedPath]);
          currentPathRef.current = [];
          setCurrentPath([]);
        }
      },
      onPanResponderTerminate: () => {
        const finishedPath = [...currentPathRef.current];
        if (finishedPath.length > 0) {
          setPaths((prev) => [...prev, finishedPath]);
          currentPathRef.current = [];
          setCurrentPath([]);
        }
      },
    })
  ).current;

  // Combine completed paths with the one currently being drawn
  const allPaths = [...paths];
  if (currentPath.length > 0) {
    allPaths.push(currentPath);
  }

  const generateSvgPath = (points: Point[]) => {
    if (points.length === 0) return '';
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return d;
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
    setEvaluation(null);
  };

  const handleSubmit = async () => {
    if (paths.length === 0 && currentPath.length === 0) return; // Didn't write anything

    if (isBeginner) {
      // Automatic pass for beginners
      setEvaluation({ score: 100, feedback: "Great tracing!" });
    } else {
      setIsSubmitting(true);
      try {
        const svgString = allPaths.map(p => generateSvgPath(p)).join('\n');
        const expectedWord = advancedChallenges[currentLetterIndex]?.expectedTranslation || '';
        const evalResult = await evaluateHandwriting(svgString, expectedWord, language);
        setEvaluation(evalResult);
      } catch (e) {
        console.error(e);
        setEvaluation({ score: 80, feedback: "Looks good, but couldn't verify with AI." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleNext = async () => {
    if (evaluation && evaluation.score > 50) {
      await updateProgress(15); // Award 15 XP
    }
    
    setEvaluation(null);
    setPaths([]);
    setCurrentPath([]);
    
    const maxItems = isBeginner ? letters.length : advancedChallenges.length;
    if (currentLetterIndex < maxItems - 1) {
      setCurrentLetterIndex(prev => prev + 1);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  if (loadingChallenges) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.purple} />
        <Text style={{ marginTop: 12, fontFamily: Fonts.bodySemi, color: Colors.textMid }}>Loading challenges...</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.springify()} style={styles.container}>
      {evaluation && evaluation.score >= 80 && <ConfettiCannon count={100} origin={{x: 200, y: 0}} fadeOut />}
      
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {isBeginner ? (
          <Text style={styles.subtitle}>Trace the letter below!</Text>
        ) : (
          <View style={styles.challengeBox}>
            <Text style={styles.challengeLabel}>Write the {language} word for:</Text>
            <Text style={styles.challengeWord}>{advancedChallenges[currentLetterIndex]?.englishWord}</Text>
          </View>
        )}
      </View>

      <View style={styles.canvasContainer}>
        {/* Background Reference Letter (Beginners Only) */}
        {isBeginner && (
          <View style={styles.referenceContainer}>
            <Text style={styles.referenceLetter}>{letters[currentLetterIndex]}</Text>
          </View>
        )}

        {/* Drawing Surface */}
        <View style={styles.drawingArea} {...panResponder.panHandlers}>
          <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
            {allPaths.map((path, index) => (
              <Path
                key={index}
                d={generateSvgPath(path)}
                stroke={Colors.purple}
                strokeWidth={isBeginner ? 16 : 8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
          </Svg>
        </View>
      </View>

      {/* Controls */}
      {!evaluation && (
        <View style={styles.controls}>
          <Pressable style={styles.clearBtn} onPress={handleClear} disabled={isSubmitting}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </Pressable>
          <Pressable style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>Check It!</Text>
            )}
          </Pressable>
        </View>
      )}

      {/* Evaluation Results Overlay */}
      {evaluation && (
        <Animated.View entering={SlideInDown.springify()} style={styles.evalCard}>
          <Text style={styles.evalScore}>Score: {evaluation.score}%</Text>
          <Text style={styles.evalFeedback}>{evaluation.feedback}</Text>
          {!isBeginner && (
            <Text style={styles.evalExpected}>Expected: {advancedChallenges[currentLetterIndex]?.expectedTranslation}</Text>
          )}
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Next →</Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontFamily: Fonts.heading, fontSize: 32, color: Colors.textDark },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 16, color: Colors.textMid },
  
  challengeBox: {
    backgroundColor: Colors.purpleLight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: Colors.purple,
  },
  challengeLabel: { fontFamily: Fonts.bodySemi, fontSize: 14, color: Colors.purpleDark },
  challengeWord: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.textDark, marginTop: 4 },

  canvasContainer: {
    width: '100%',
    flex: 1,
    minHeight: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 4,
    borderColor: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(0,0,0,0.06)' } : { ...Shadow.card }),
    marginBottom: 24,
  },
  referenceContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referenceLetter: {
    fontSize: 220,
    fontFamily: Fonts.heading,
    color: '#F3F4F6', 
    opacity: 0.6,
  },
  drawingArea: {
    ...StyleSheet.absoluteFillObject,
    ...(Platform.OS === 'web' ? { touchAction: 'none' } : {}),
  },
  
  controls: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  clearBtnText: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.textMid },
  
  submitBtn: {
    flex: 2,
    backgroundColor: Colors.greenLight,
    paddingVertical: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(34,197,94,0.3)' } : { ...Shadow.btn }),
  },
  submitBtnText: { fontFamily: Fonts.heading, fontSize: 20, color: '#FFFFFF' },

  evalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.green,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(34,197,94,0.2)' } : { ...Shadow.green }),
  },
  evalScore: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.green },
  evalFeedback: { fontFamily: Fonts.bodyReg, fontSize: 16, color: Colors.textMid, textAlign: 'center', marginVertical: 8 },
  evalExpected: { fontFamily: Fonts.bodySemi, fontSize: 18, color: Colors.purple, marginBottom: 16 },
  
  nextBtn: {
    backgroundColor: Colors.green,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    marginTop: 8,
  },
  nextBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
});
