import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Platform,
  PanResponder, ActivityIndicator, ScrollView
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown, FadeInUp, SlideInDown,
  useSharedValue, useAnimatedStyle, withTiming, withDelay
} from 'react-native-reanimated';
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

function getScoreColor(score: number) {
  if (score >= 80) return '#22C55E';
  if (score >= 55) return '#F59E0B';
  return '#EF4444';
}

function getScoreEmoji(score: number) {
  if (score >= 85) return '🌟';
  if (score >= 70) return '👍';
  if (score >= 50) return '📝';
  return '💪';
}

// Animated progress bar for breakdown
function BreakdownBar({ item, delay }: { item: { label: string; score: number; note: string }, delay: number }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(delay, withTiming(item.score, { duration: 700 }));
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%` as any,
  }));

  const color = getScoreColor(item.score);

  return (
    <View style={breakdownStyles.row}>
      <View style={breakdownStyles.labelRow}>
        <Text style={breakdownStyles.label}>{item.label}</Text>
        <Text style={[breakdownStyles.scoreText, { color }]}>{item.score}%</Text>
      </View>
      <View style={breakdownStyles.barBg}>
        <Animated.View style={[breakdownStyles.barFill, barStyle, { backgroundColor: color }]} />
      </View>
      <Text style={breakdownStyles.note}>{item.note}</Text>
    </View>
  );
}

const breakdownStyles = StyleSheet.create({
  row: { marginBottom: 14 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontFamily: Fonts.bodySemi, fontSize: 14, color: '#374151' },
  scoreText: { fontFamily: Fonts.heading, fontSize: 14 },
  barBg: { height: 10, backgroundColor: '#F3F4F6', borderRadius: 10, overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 10 },
  note: { fontFamily: Fonts.bodyReg, fontSize: 12, color: '#6B7280', marginTop: 3 },
});

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
  const svgRef = useRef<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<HandwritingEvaluation | null>(null);

  // Canvas size tracking for web capture
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });

  useEffect(() => {
    if (!isBeginner) loadChallenges();
  }, [tier, language]);

  const loadChallenges = async () => {
    try {
      setLoadingChallenges(true);
      const challenges = await generateWritingChallenge(tier, language);
      setAdvancedChallenges(challenges);
    } catch (e) {
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
        const fp = [...currentPathRef.current];
        if (fp.length > 0) { setPaths(prev => [...prev, fp]); currentPathRef.current = []; setCurrentPath([]); }
      },
      onPanResponderTerminate: () => {
        const fp = [...currentPathRef.current];
        if (fp.length > 0) { setPaths(prev => [...prev, fp]); currentPathRef.current = []; setCurrentPath([]); }
      },
    })
  ).current;

  const allPaths = [...paths, ...(currentPath.length > 0 ? [currentPath] : [])];

  const generateSvgPath = (points: Point[]) => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  const handleClear = () => { setPaths([]); setCurrentPath([]); setEvaluation(null); };

  // Capture SVG as base64 PNG using canvas (web only) or SVG serialisation
  const captureCanvasAsBase64 = async (): Promise<string> => {
    if (Platform.OS === 'web') {
      return new Promise((resolve) => {
        try {
          const svgElement = document.querySelector('.writing-canvas-svg') as SVGSVGElement;
          if (!svgElement) { resolve(''); return; }

          const serializer = new XMLSerializer();
          const svgStr = serializer.serializeToString(svgElement);
          const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = svgElement.clientWidth || 400;
            canvas.height = svgElement.clientHeight || 300;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            const dataUrl = canvas.toDataURL('image/png');
            resolve(dataUrl.split(',')[1]); // Return base64 only
          };
          img.onerror = () => { URL.revokeObjectURL(url); resolve(''); };
          img.src = url;
        } catch (e) {
          resolve('');
        }
      });
    }
    return '';
  };

  const handleSubmit = async () => {
    if (paths.length === 0) return;
    setIsSubmitting(true);

    try {
      const expectedWord = isBeginner
        ? letters[currentLetterIndex]
        : advancedChallenges[currentLetterIndex]?.expectedTranslation || '';

      const base64 = await captureCanvasAsBase64();
      const evalResult = await evaluateHandwriting(base64, expectedWord, language);
      setEvaluation(evalResult);
    } catch (e) {
      console.error(e);
      setEvaluation({ score: 75, feedback: "Looks good! Keep practicing.", breakdown: [] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (evaluation && evaluation.score > 50) await updateProgress(15);
    setEvaluation(null); setPaths([]); setCurrentPath([]);
    const maxItems = isBeginner ? letters.length : advancedChallenges.length;
    if (currentLetterIndex < maxItems - 1) {
      setCurrentLetterIndex(prev => prev + 1);
    } else {
      router.canGoBack() ? router.back() : router.replace('/(tabs)');
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

  const currentTarget = isBeginner ? letters[currentLetterIndex] : advancedChallenges[currentLetterIndex]?.expectedTranslation;
  const overallColor = evaluation ? getScoreColor(evaluation.score) : Colors.green;

  return (
    <Animated.View entering={FadeInDown.springify()} style={styles.container}>
      {evaluation && evaluation.score >= 80 && <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} fadeOut />}

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

      {/* Canvas */}
      <View
        style={styles.canvasContainer}
        onLayout={(e) => setCanvasSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      >
        {/* Reference letter — rendered as plain text behind SVG */}
        <View style={styles.referenceContainer} pointerEvents="none">
          <Text style={[
            styles.referenceLetter,
            !isBeginner && { fontSize: 90 }
          ]}>
            {isBeginner
              ? letters[currentLetterIndex]
              : (advancedChallenges[currentLetterIndex]?.expectedTranslation || '')}
          </Text>
        </View>

        {/* Transparent SVG drawing layer on top */}
        <View style={styles.drawingArea} {...panResponder.panHandlers}>
          <Svg
            height="100%"
            width="100%"
            style={{ position: 'absolute' }}
            // @ts-ignore — className for web capture
            className="writing-canvas-svg"
          >
            {allPaths.map((path, index) => (
              <Path
                key={index}
                d={generateSvgPath(path)}
                stroke={Colors.purple}
                strokeWidth={isBeginner ? 16 : 10}
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
            <Text style={styles.clearBtnText}>🗑️ Clear</Text>
          </Pressable>
          <Pressable
            style={[styles.submitBtn, (isSubmitting || paths.length === 0) && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting || paths.length === 0}
          >
            {isSubmitting ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color="#FFF" size="small" />
                <Text style={styles.submitBtnText}>Analysing...</Text>
              </View>
            ) : (
              <Text style={styles.submitBtnText}>Check It! ✓</Text>
            )}
          </Pressable>
        </View>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <Animated.View entering={SlideInDown.springify()} style={styles.evalCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Score header */}
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreEmoji}>{getScoreEmoji(evaluation.score)}</Text>
              <View>
                <Text style={[styles.evalScore, { color: overallColor }]}>
                  {evaluation.score}% Accuracy
                </Text>
                <Text style={styles.evalFeedback}>{evaluation.feedback}</Text>
              </View>
            </View>

            {/* Expected word */}
            <View style={[styles.targetBadge, { borderColor: Colors.purple }]}>
              <Text style={styles.targetLabel}>Target Character</Text>
              <Text style={styles.targetChar}>{currentTarget}</Text>
            </View>

            {/* Breakdown bars */}
            {evaluation.breakdown && evaluation.breakdown.length > 0 && (
              <View style={styles.breakdownSection}>
                <Text style={styles.breakdownTitle}>📊 Detailed Analysis</Text>
                {evaluation.breakdown.map((item, i) => (
                  <BreakdownBar key={i} item={item} delay={i * 150} />
                ))}
              </View>
            )}

            {/* Next button */}
            <Pressable style={[styles.nextBtn, { backgroundColor: overallColor }]} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {evaluation.score >= 50 ? 'Next →' : 'Try Again →'}
              </Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', width: '100%',
    maxWidth: 600, alignSelf: 'center',
  },
  header: { alignItems: 'center', marginBottom: 16 },
  title: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.textDark },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 16, color: Colors.textMid, marginTop: 4 },
  challengeBox: {
    backgroundColor: Colors.purpleLight, paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: Radius.lg, alignItems: 'center', marginTop: 10,
    borderWidth: 2, borderColor: Colors.purple,
  },
  challengeLabel: { fontFamily: Fonts.bodySemi, fontSize: 14, color: Colors.purpleDark },
  challengeWord: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.textDark, marginTop: 4 },

  canvasContainer: {
    width: '100%', flex: 1, minHeight: 240,
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg,
    borderWidth: 3, borderColor: '#E5E7EB',
    position: 'relative', overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(0,0,0,0.06)' } : { ...Shadow.card }),
    marginBottom: 16,
  },
  referenceContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  referenceLetter: {
    fontSize: 200,
    fontFamily: Fonts.heading,
    color: '#C0C0D0',
    opacity: 0.45,
    textAlign: 'center',
    userSelect: 'none' as any,
  },
  drawingArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { touchAction: 'none' } : {}),
  },

  controls: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 8 },
  clearBtn: {
    flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 16,
    borderRadius: Radius.md, alignItems: 'center',
  },
  clearBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.textMid },
  submitBtn: {
    flex: 2, backgroundColor: Colors.green, paddingVertical: 16,
    borderRadius: Radius.md, alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(34,197,94,0.3)' } : { ...Shadow.btn }),
  },
  submitBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },

  // Evaluation card
  evalCard: {
    width: '100%', maxHeight: 420,
    backgroundColor: '#FFFFFF', padding: 20,
    borderRadius: Radius.lg, borderWidth: 2, borderColor: '#E5E7EB',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(0,0,0,0.1)' } : { ...Shadow.card }),
  },
  scoreHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  scoreEmoji: { fontSize: 44 },
  evalScore: { fontFamily: Fonts.heading, fontSize: 26 },
  evalFeedback: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textMid, marginTop: 2, maxWidth: 240 },

  targetBadge: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 2, borderRadius: Radius.md, padding: 12, marginBottom: 16,
    backgroundColor: '#FAF5FF',
  },
  targetLabel: { fontFamily: Fonts.bodySemi, fontSize: 14, color: Colors.purpleDark },
  targetChar: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.purple },

  breakdownSection: { marginBottom: 16 },
  breakdownTitle: { fontFamily: Fonts.heading, fontSize: 16, color: Colors.textDark, marginBottom: 12 },

  nextBtn: {
    paddingVertical: 16, borderRadius: Radius.pill, alignItems: 'center', marginTop: 4,
  },
  nextBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFF' },
});
