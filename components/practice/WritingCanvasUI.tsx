import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Platform, ActivityIndicator, ScrollView
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown, SlideInDown,
  useSharedValue, useAnimatedStyle, withTiming, withDelay
} from 'react-native-reanimated';
import { Colors, Fonts, Radius, Shadow } from '../KidsTheme';
import { useAuth } from '../../context/AuthContext';
import ConfettiCannon from 'react-native-confetti-cannon';
import { evaluateHandwriting, HandwritingEvaluation, getWritingLevelItems } from '../../utils/ai';

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

type Props = {
  title: string;
  tier?: string;
  selectedLevelNum?: number;
  onBack?: () => void;
  onNextLevel?: () => void;
};

export default function WritingCanvasUI({ title, tier = 'Beginner', selectedLevelNum = 1, onBack, onNextLevel }: Props) {
  const router = useRouter();
  const { user, updateProgress, completeLevel } = useAuth();

  const language = user?.learningLanguage || 'tamil';

  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const currentNum = selectedLevelNum || (currentLetterIndex + 1);
  const levelInfo = getWritingLevelItems(currentNum, language, tier);
  const currentTarget = levelInfo.target;

  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const currentPathRef = useRef<Point[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<HandwritingEvaluation | null>(null);

  // Canvas size tracking for web capture
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });

  const isDrawingRef = useRef(false);

  const getCanvasCoords = (e: any) => {
    if (e.nativeEvent && typeof e.nativeEvent.locationX === 'number' && e.nativeEvent.locationX > 0) {
      return { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
    }
    const target = e.currentTarget;
    if (target && target.getBoundingClientRect) {
      const rect = target.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return { x: clientX - rect.left, y: clientY - rect.top };
    }
    return { x: e.nativeEvent?.x || 0, y: e.nativeEvent?.y || 0 };
  };

  const handleStart = (e: any) => {
    isDrawingRef.current = true;
    const pt = getCanvasCoords(e);
    currentPathRef.current = [pt];
    setCurrentPath([pt]);
  };

  const handleMove = (e: any) => {
    if (!isDrawingRef.current) return;
    const pt = getCanvasCoords(e);
    currentPathRef.current.push(pt);
    setCurrentPath([...currentPathRef.current]);
  };

  const handleEnd = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const fp = [...currentPathRef.current];
    if (fp.length > 0) {
      setPaths(prev => [...prev, fp]);
    }
    currentPathRef.current = [];
    setCurrentPath([]);
  };

  const allPaths = [...paths, ...(currentPath.length > 0 ? [currentPath] : [])];

  const generateSvgPath = (points: Point[]) => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  const handleClear = () => { setPaths([]); setCurrentPath([]); setEvaluation(null); };

  // Capture canvas strokes as base64 PNG by drawing directly onto an HTML canvas
  const captureCanvasAsBase64 = async (): Promise<string> => {
    if (Platform.OS === 'web') {
      return new Promise((resolve) => {
        try {
          const canvasEl = document.createElement('canvas');
          canvasEl.width = canvasSize.width || 400;
          canvasEl.height = canvasSize.height || 300;
          const ctx = canvasEl.getContext('2d')!;

          // White background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

          // Draw all stroke paths in purple
          ctx.strokeStyle = '#7C3AED';
          ctx.lineWidth = 14;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          paths.forEach((path) => {
            if (path.length < 2) return;
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            path.slice(1).forEach((pt) => ctx.lineTo(pt.x, pt.y));
            ctx.stroke();
          });

          const dataUrl = canvasEl.toDataURL('image/png');
          resolve(dataUrl.split(',')[1]);
        } catch (e) {
          console.warn('Canvas capture failed:', e);
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
      const base64 = await captureCanvasAsBase64();
      const evalResult = await evaluateHandwriting(base64, currentTarget, language, paths);
      setEvaluation(evalResult);
    } catch (e) {
      console.error(e);
      setEvaluation({ score: 85, feedback: `Great job tracing ${currentTarget}!`, breakdown: [] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdvancingRef = useRef(false);

  const handleNext = async (tryAgain = false) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    try {
      if (!tryAgain && evaluation && evaluation.score > 50) {
        updateProgress(15).catch(() => {});
      }

      if (!tryAgain) {
        const lang = (user?.learningLanguage || 'tamil').toLowerCase();
        const userKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : (user?.id || 'guest');
        const storageKey = `@game_${userKey}_${lang}_writing_${tier}_completed`;
        const savedVal = await AsyncStorage.getItem(storageKey);
        const prevMax = savedVal ? parseInt(savedVal, 10) : 0;
        if (currentNum > prevMax) {
          await AsyncStorage.setItem(storageKey, currentNum.toString());
        }
        await completeLevel(currentNum);
        if (onNextLevel) {
          setEvaluation(null);
          setPaths([]);
          setCurrentPath([]);
          onNextLevel();
          return;
        }
      }

      setEvaluation(null);
      setPaths([]);
      setCurrentPath([]);

      if (tryAgain) return;

      if (currentLetterIndex < 999) {
        setCurrentLetterIndex(prev => prev + 1);
      } else {
        if (onBack) onBack();
        else if (router.canGoBack()) router.back();
        else router.replace('/(tabs)');
      }
    } finally {
      setTimeout(() => {
        isAdvancingRef.current = false;
      }, 1000);
    }
  };

  const overallColor = evaluation ? getScoreColor(evaluation.score) : Colors.green;

  const webCanvasRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && webCanvasRef.current) {
      const canvas = webCanvasRef.current;
      canvas.width = canvasSize.width || 500;
      canvas.height = canvasSize.height || 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = Colors.purple;
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        allPaths.forEach((path) => {
          if (path.length === 0) return;
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }
          ctx.stroke();
        });
      }
    }
  }, [allPaths, canvasSize]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {evaluation && evaluation.score >= 80 && <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} fadeOut />}

        <View style={styles.headerBar}>
          {onBack ? (
            <Pressable style={styles.backBtnHeader} onPress={onBack}>
              <Text style={styles.backBtnHeaderText}>← Back</Text>
            </Pressable>
          ) : (
            <View style={{ width: 75 }} />
          )}

          <View style={styles.headerCenter}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{levelInfo.prompt}</Text>
          </View>

          <View style={{ width: 75 }} />
        </View>

        {/* Canvas */}
        <View
          style={styles.canvasContainer}
          onLayout={(e) => setCanvasSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
          onPointerDown={handleStart}
          onPointerMove={handleMove}
          onPointerUp={handleEnd}
          onPointerLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {/* Reference letter — rendered as plain text behind SVG */}
          <View style={[styles.referenceContainer, { paddingHorizontal: 20 }]} pointerEvents="none">
            <Text 
              adjustsFontSizeToFit 
              numberOfLines={1}
              style={[
                styles.referenceLetter,
                currentTarget.length > 2 && { fontSize: 100 }
              ]}>
              {currentTarget}
            </Text>
          </View>

          {/* Drawing layer */}
          {Platform.OS === 'web' ? (
            <canvas
              ref={webCanvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            />
          ) : (
            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
              {allPaths.map((path, pathIdx) => (
                <Path
                  key={pathIdx}
                  d={generateSvgPath(path)}
                  stroke={Colors.purple}
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
            </Svg>
          )}
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
          <Animated.View entering={SlideInDown.springify()} style={[styles.evalCard, { flex: 1, marginBottom: 20 }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
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
                <Text style={styles.targetLabel}>Target</Text>
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

              {/* Next / Try Again buttons */}
              {evaluation.score >= 50 ? (
                <Pressable style={[styles.nextBtn, { backgroundColor: overallColor }]} onPress={() => handleNext(false)}>
                  <Text style={styles.nextBtnText}>Next →</Text>
                </Pressable>
              ) : (
                <Pressable style={[styles.nextBtn, { backgroundColor: '#EF4444' }]} onPress={() => handleNext(true)}>
                  <Text style={styles.nextBtnText}>Try Again →</Text>
                </Pressable>
              )}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', width: '100%',
    maxWidth: 600, alignSelf: 'center',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  backBtnHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3E8FF',
    borderRadius: Radius.md,
  },
  backBtnHeaderText: {
    fontFamily: Fonts.heading,
    fontSize: 15,
    color: Colors.purple,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: { fontFamily: Fonts.heading, fontSize: 26, color: Colors.textDark, textAlign: 'center' },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, marginTop: 2, textAlign: 'center' },
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
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
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
