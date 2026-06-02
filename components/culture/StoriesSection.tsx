import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Platform, ActivityIndicator, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp, FadeIn, useSharedValue, useAnimatedStyle,
  withSpring, withTiming, interpolate
} from 'react-native-reanimated';
import { Colors, Fonts, Radius, Shadow } from '../KidsTheme';
import { CultureStory, STORY_THEMES, generateCultureStory } from '../../utils/stories';

const THEME_COLORS: Record<string, [string, string]> = {
  tamil:     ['#FB923C', '#F59E0B'],
  hindi:     ['#F472B6', '#EC4899'],
  telugu:    ['#38BDF8', '#6366F1'],
  malayalam: ['#22C55E', '#10B981'],
  kannada:   ['#A78BFA', '#7C3AED'],
};

// ── Web TTS ─────────────────────────────────────────────────────────────
function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [currentPara, setCurrentPara] = useState(-1);
  const utterRef = useRef<any>(null);

  const speak = useCallback((text: string, paraIdx: number) => {
    if (Platform.OS !== 'web') return;
    const synth = (window as any).speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utt = new (window as any).SpeechSynthesisUtterance(text);
    utt.rate = 0.85;
    utt.onstart  = () => { setSpeaking(true);  setCurrentPara(paraIdx); };
    utt.onend    = () => { setSpeaking(false); setCurrentPara(-1); };
    utt.onerror  = () => { setSpeaking(false); setCurrentPara(-1); };
    utterRef.current = utt;
    synth.speak(utt);
  }, []);

  const stop = useCallback(() => {
    if (Platform.OS !== 'web') return;
    (window as any).speechSynthesis?.cancel();
    setSpeaking(false);
    setCurrentPara(-1);
  }, []);

  const readAll = useCallback((paragraphs: { native: string; english: string }[], showNative: boolean) => {
    if (Platform.OS !== 'web') return;
    const synth = (window as any).speechSynthesis;
    if (!synth) return;
    synth.cancel();
    setSpeaking(true);

    let idx = 0;
    const speakNext = () => {
      if (idx >= paragraphs.length) { setSpeaking(false); setCurrentPara(-1); return; }
      const utt = new (window as any).SpeechSynthesisUtterance(
        showNative ? paragraphs[idx].native : paragraphs[idx].english
      );
      utt.rate = 0.85;
      utt.onstart = () => setCurrentPara(idx);
      utt.onend   = () => { idx++; speakNext(); };
      utt.onerror = () => { setSpeaking(false); setCurrentPara(-1); };
      synth.speak(utt);
    };
    speakNext();
  }, []);

  return { speaking, currentPara, speak, stop, readAll };
}

// ── Story Card (theme picker) ────────────────────────────────────────────
function StoryThemeCard({
  item, index, colors, onPress
}: {
  item: { emoji: string; label: string };
  index: number;
  colors: [string, string];
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const anim  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View entering={FadeInUp.delay(index * 120).springify()} style={anim}>
      <Pressable
        onPressIn ={() => { scale.value = withSpring(0.94); }}
        onPressOut={() => { scale.value = withSpring(1);    }}
        onPress={onPress}
        style={styles.themeCard}
      >
        <LinearGradient colors={colors} style={styles.themeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.themeEmoji}>{item.emoji}</Text>
        </LinearGradient>
        <Text style={styles.themeLabel}>{item.label}</Text>
        <Text style={styles.themeHint}>Tap to read →</Text>
      </Pressable>
    </Animated.View>
  );
}

// ── Full story modal ─────────────────────────────────────────────────────
function StoryModal({
  story, colors, onClose
}: {
  story: CultureStory;
  colors: [string, string];
  onClose: () => void;
}) {
  const [showNative, setShowNative] = useState(true);
  const { speaking, currentPara, speak, stop, readAll } = useTTS();

  const handleReadAll = () => {
    if (speaking) { stop(); return; }
    readAll(story.paragraphs, showNative);
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.storyModal}>
          {/* Header */}
          <LinearGradient colors={colors} style={styles.storyHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
            <Text style={styles.storyEmoji}>{story.emoji}</Text>
            <Text style={styles.storyTitleNative}>{story.titleNative}</Text>
            <Text style={styles.storyTitleEn}>{story.title}</Text>

            {/* Controls */}
            <View style={styles.controlRow}>
              {/* Language toggle */}
              <Pressable
                style={[styles.toggleBtn, showNative && styles.toggleBtnActive]}
                onPress={() => { stop(); setShowNative(true); }}
              >
                <Text style={styles.toggleBtnText}>Native</Text>
              </Pressable>
              <Pressable
                style={[styles.toggleBtn, !showNative && styles.toggleBtnActive]}
                onPress={() => { stop(); setShowNative(false); }}
              >
                <Text style={styles.toggleBtnText}>English</Text>
              </Pressable>

              {/* Read aloud */}
              {Platform.OS === 'web' && (
                <Pressable style={[styles.readBtn, speaking && styles.readBtnActive]} onPress={handleReadAll}>
                  <Text style={styles.readBtnText}>{speaking ? '⏹ Stop' : '🔊 Read Aloud'}</Text>
                </Pressable>
              )}
            </View>
          </LinearGradient>

          {/* Story body */}
          <ScrollView style={styles.storyBody} contentContainerStyle={{ padding: 20, gap: 18 }}>
            {story.paragraphs.map((para, i) => (
              <Animated.View
                key={i}
                entering={FadeInUp.delay(i * 60).springify()}
                style={[
                  styles.paraCard,
                  currentPara === i && styles.paraCardActive,
                ]}
              >
                {/* Tap paragraph to read it */}
                <Pressable onPress={() => {
                  if (speaking && currentPara === i) { stop(); }
                  else { speak(showNative ? para.native : para.english, i); }
                }}>
                  <Text style={styles.paraNumber}>Para {i + 1}</Text>
                  <Text style={[styles.paraText, showNative && styles.paraTextNative]}>
                    {showNative ? para.native : para.english}
                  </Text>
                  {!showNative && (
                    <Text style={styles.paraNativeSmall}>{para.native}</Text>
                  )}
                  {Platform.OS === 'web' && (
                    <Text style={styles.tapHint}>
                      {speaking && currentPara === i ? '🔊 Reading...' : '🔈 Tap to hear'}
                    </Text>
                  )}
                </Pressable>
              </Animated.View>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Main exported component ──────────────────────────────────────────────
export default function StoriesSection({ language }: { language: string }) {
  const themes = STORY_THEMES[language] || STORY_THEMES['tamil'];
  const colors = THEME_COLORS[language] || THEME_COLORS['tamil'];

  const [loading, setLoading] = useState(false);
  const [story, setStory]     = useState<CultureStory | null>(null);
  const [error, setError]     = useState('');

  const loadStory = async (theme: string) => {
    setLoading(true);
    setError('');
    try {
      const s = await generateCultureStory(language, theme);
      setStory(s);
    } catch (e) {
      setError('Could not load story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.section}>
      <Animated.View entering={FadeInUp.delay(200).springify()}>
        <Text style={styles.sectionTitle}>📖 Culture Stories</Text>
        <Text style={styles.sectionSub}>
          Listen to traditional folk tales in {language.charAt(0).toUpperCase() + language.slice(1)} 🎙️
        </Text>
      </Animated.View>

      {/* Theme cards */}
      <View style={styles.themeGrid}>
        {themes.map((item, i) => (
          <StoryThemeCard
            key={i}
            item={item}
            index={i}
            colors={colors}
            onPress={() => loadStory(item.theme)}
          />
        ))}
      </View>

      {/* Loading */}
      {loading && (
        <Animated.View entering={FadeIn} style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors[0]} />
          <Text style={styles.loadingText}>✨ Weaving your story...</Text>
        </Animated.View>
      )}

      {/* Error */}
      {!!error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Story modal */}
      {story && !loading && (
        <StoryModal
          story={story}
          colors={colors}
          onClose={() => setStory(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 4 },
  sectionSub:   { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textMid, marginBottom: 16 },

  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  themeCard: {
    width: 150, backgroundColor: '#FFFFFF', borderRadius: Radius.lg,
    overflow: 'hidden', borderWidth: 2, borderColor: '#F3F4F6',
    ...(Platform.OS === 'web' ? { boxShadow: '0 6px 20px rgba(0,0,0,0.08)' } : { ...Shadow.card }),
  },
  themeGradient: { height: 90, justifyContent: 'center', alignItems: 'center' },
  themeEmoji:    { fontSize: 42 },
  themeLabel:    { fontFamily: Fonts.body, fontSize: 14, color: Colors.textDark, padding: 10, paddingBottom: 2 },
  themeHint:     { fontFamily: Fonts.bodyReg, fontSize: 11, color: Colors.textLight, paddingHorizontal: 10, paddingBottom: 10 },

  loadingBox: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  loadingText: { fontFamily: Fonts.bodySemi, fontSize: 16, color: Colors.textMid },
  errorText:   { fontFamily: Fonts.bodyReg, fontSize: 14, color: '#EF4444', textAlign: 'center', marginTop: 8 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  storyModal:   {
    flex: 1, marginTop: 50, backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden',
  },
  storyHeader: { padding: 24, paddingTop: 28, alignItems: 'center', position: 'relative' },
  closeBtn:    {
    position: 'absolute', top: 16, right: 16,
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 20,
    width: 36, height: 36, justifyContent: 'center', alignItems: 'center',
  },
  closeBtnText:      { fontSize: 16, color: '#FFFFFF', fontWeight: '700' },
  storyEmoji:        { fontSize: 56, marginBottom: 8 },
  storyTitleNative:  { fontFamily: Fonts.heading, fontSize: 22, color: '#FFFFFF', textAlign: 'center', marginBottom: 4 },
  storyTitleEn:      { fontFamily: Fonts.bodyReg, fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 16 },

  controlRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  toggleBtn:  {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.pill,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  toggleBtnActive: { backgroundColor: 'rgba(255,255,255,0.55)' },
  toggleBtnText:   { fontFamily: Fonts.bodySemi, fontSize: 13, color: '#FFFFFF' },
  readBtn:         {
    paddingHorizontal: 16, paddingVertical: 7,
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: Radius.pill,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  readBtnActive:   { backgroundColor: 'rgba(239,68,68,0.5)' },
  readBtnText:     { fontFamily: Fonts.bodySemi, fontSize: 13, color: '#FFFFFF' },

  storyBody: { flex: 1 },
  paraCard:  {
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 16,
    borderWidth: 2, borderColor: '#E5E7EB',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.05)' } : {}),
  },
  paraCardActive: { borderColor: Colors.purple, backgroundColor: '#F5F3FF' },
  paraNumber:     { fontFamily: Fonts.bodySemi, fontSize: 11, color: Colors.textLight, marginBottom: 6, letterSpacing: 1 },
  paraText:       { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textDark, lineHeight: 24 },
  paraTextNative: { fontSize: 17, lineHeight: 28 },
  paraNativeSmall:{ fontFamily: Fonts.bodyReg, fontSize: 13, color: Colors.textMid, marginTop: 8, lineHeight: 20, fontStyle: 'italic' },
  tapHint:        { fontFamily: Fonts.bodyReg, fontSize: 11, color: Colors.purple, marginTop: 8 },
});
