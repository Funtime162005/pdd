import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Platform, Modal, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp, useSharedValue, useAnimatedStyle,
  withSpring, ZoomIn
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CultureStory, getCultureStory, STORY_CATEGORIES } from '../../utils/stories';
import { playAudio } from '../../utils/speech';

const THEME_COLORS: Record<string, [string, string]> = {
  tamil:     ['#FF6B35', '#E53E3E'],
  hindi:     ['#E91E8C', '#9C27B0'],
  telugu:    ['#0EA5E9', '#6366F1'],
  malayalam: ['#10B981', '#059669'],
  kannada:   ['#8B5CF6', '#6D28D9'],
};

const CARD_GRADIENTS: [string, string][] = [
  ['#FF6B35', '#FF8E53'],
  ['#F72585', '#B5179E'],
  ['#4CC9F0', '#4361EE'],
  ['#06D6A0', '#1B998B'],
  ['#FFB300', '#FF6F00'],
  ['#7C3AED', '#4C1D95'],
  ['#EF4444', '#DC2626'],
  ['#0EA5E9', '#0284C7'],
];

// ── Tamil voice helpers (module-level — stable, never recreated) ──────────────
function getTamilVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null;
  const synth = (window as any).speechSynthesis;
  if (!synth) return null;
  const voices: SpeechSynthesisVoice[] = synth.getVoices() || [];
  return (
    voices.find((v: SpeechSynthesisVoice) => v.lang === 'ta-IN') ||
    voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('ta')) ||
    null
  );
}

function applyTamilVoice(utt: SpeechSynthesisUtterance) {
  utt.lang = 'ta-IN';
  utt.rate = 0.82;
  const voice = getTamilVoice();
  if (voice) utt.voice = voice;
}
// ─────────────────────────────────────────────────────────────────────────────
// TTS Hook
// ─────────────────────────────────────────────────────────────────────────────
function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [currentPara, setCurrentPara] = useState(-1);
  const activeRef = useRef(false);

  const getSynth = () => (Platform.OS === 'web' ? (window as any).speechSynthesis : null);

  // Tap a single paragraph to listen (Tamil)
  const speak = useCallback((text: string, paraIdx: number) => {
    const synth = getSynth();
    const voice = getTamilVoice();
    if (!synth || !voice) {
      // If browser doesn't have a native Tamil voice, use playAudio (Google TTS)
      setSpeaking(true);
      setCurrentPara(paraIdx);
      playAudio(text, 'tamil').finally(() => {
        setSpeaking(false);
        setCurrentPara(-1);
      });
      return;
    }
    activeRef.current = false;
    synth.cancel();
    const utt = new (window as any).SpeechSynthesisUtterance(text);
    applyTamilVoice(utt);
    utt.onstart = () => { setSpeaking(true);  setCurrentPara(paraIdx); };
    utt.onend   = () => { setSpeaking(false); setCurrentPara(-1); };
    utt.onerror = () => { setSpeaking(false); setCurrentPara(-1); };
    synth.speak(utt);
  }, []);

  // Stop button
  const stop = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    activeRef.current = false;
    synth.cancel();
    setSpeaking(false);
    setCurrentPara(-1);
  }, []);

  // Read entire story — splits every paragraph into 12-word chunks.
  // WHY: Chrome's speechSynthesis silently kills any utterance longer than ~14s.
  // One paragraph = 200+ words = 60-90s → Chrome kills it after ~14s.
  // 12-word chunks = ~6-8s each → always under the Chrome limit.
  // Simple onend chaining works reliably at this chunk size. No keep-alive needed.
  const readAll = useCallback((
    paragraphs: { native: string; english: string }[],
    _showNative: boolean
  ) => {
    const synth = getSynth();
    if (!synth) return;

    activeRef.current = false;
    synth.cancel();

    // Split text into chunks of maxWords words
    const splitWords = (text: string, maxWords = 12): string[] => {
      const words = text.split(/\s+/).filter(w => w.length > 0);
      const chunks: string[] = [];
      for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(' '));
      }
      return chunks;
    };

    // Get Tamil voice once for all utterances
    const tamilVoice = getTamilVoice();

    // Build flat list of all chunks — using TAMIL (native) text
    const allChunks: { text: string; paraIdx: number }[] = [];
    paragraphs.forEach((p, pIdx) => {
      const text = (p.native || p.english || '').trim(); // Tamil first
      if (!text) return;
      splitWords(text, 10).forEach(chunk => { // 10 Tamil words ≈ 5-7s
        allChunks.push({ text: chunk, paraIdx: pIdx });
      });
    });

    if (allChunks.length === 0) return;

    setSpeaking(true);
    setCurrentPara(-1);
    activeRef.current = true;

    let pos = 0;

    const speakNext = () => {
      if (!activeRef.current || pos >= allChunks.length) {
        activeRef.current = false;
        setSpeaking(false);
        setCurrentPara(-1);
        return;
      }

      const { text, paraIdx } = allChunks[pos];
      const utt = new (window as any).SpeechSynthesisUtterance(text);
      // Use Tamil voice
      utt.lang = 'ta-IN';
      utt.rate = 0.82;
      if (tamilVoice) utt.voice = tamilVoice;

      utt.onstart = () => {
        if (activeRef.current) setCurrentPara(paraIdx);
      };

      utt.onend = () => {
        if (!activeRef.current) return;
        pos++;
        speakNext();
      };

      utt.onerror = (e: any) => {
        // User pressed Stop → activeRef was set false before cancel()
        if (!activeRef.current) {
          setSpeaking(false);
          setCurrentPara(-1);
          return;
        }
        // Any other error: skip chunk and continue
        pos++;
        speakNext();
      };

      synth.speak(utt);
    };

    // 300ms for synth.cancel() to settle
    setTimeout(speakNext, 300);
  }, []);



  return { speaking, currentPara, speak, stop, readAll };
}

// ─────────────────────────────────────────────────────────────────────────────
// Story Modal
// ─────────────────────────────────────────────────────────────────────────────
function StoryModal({ story, colors, onClose, onComplete }: {
  story: CultureStory;
  colors: [string, string];
  onClose: () => void;
  onComplete: () => void;
}) {
  const [showNative, setShowNative] = useState(true); // default Tamil
  const { speaking, currentPara, speak, stop, readAll } = useTTS();

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View entering={ZoomIn.springify()} style={styles.modalCard}>
          <LinearGradient colors={colors} style={styles.modalHeader}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.storyNumBadge}>
                <Text style={styles.storyNumTxt}>Story #{story.id}</Text>
              </View>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnTxt}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.modalEmoji}>{story.emoji}</Text>
            <Text style={styles.modalTitleNative}>{story.titleNative}</Text>
            <Text style={styles.modalTitleEng}>{story.title}</Text>
          </LinearGradient>

          <View style={styles.modalActions}>
            <Pressable style={styles.langToggleBtn} onPress={() => setShowNative(p => !p)}>
              <Text style={styles.langToggleTxt}>{showNative ? '🌐 English' : '🌺 Native'}</Text>
            </Pressable>
            <Pressable
              style={[styles.audioBtn, speaking && styles.audioBtnActive]}
              onPress={() => speaking ? stop() : readAll(story.paragraphs, showNative)}
            >
              <Text style={styles.audioBtnTxt}>{speaking ? '⏹ Stop' : '🔊 Listen Full Story'}</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.storyBody} showsVerticalScrollIndicator={false}>
            {story.paragraphs.map((p, idx) => (
              <Pressable
                key={idx}
                onPress={() => speak(p.native || p.english, idx)}
                style={[styles.paraBox, currentPara === idx && styles.paraActive]}
              >
                <Text style={styles.paraNative}>{p.native}</Text>
                <Text style={styles.paraEnglish}>{p.english}</Text>
              </Pressable>
            ))}

            <View style={styles.moralCard}>
              <Text style={styles.moralHeader}>🌟 MORAL LESSON</Text>
              <Text style={styles.moralNative}>{story.moralNative}</Text>
              <Text style={styles.moralEng}>"{story.moral}"</Text>
            </View>

            <Pressable style={styles.finishBtn} onPress={onComplete}>
              <LinearGradient colors={['#22C55E', '#16A34A']} style={styles.finishBtnGrad}>
                <Text style={styles.finishBtnTxt}>✓ Complete Story (+20 XP)</Text>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Story Card
// ─────────────────────────────────────────────────────────────────────────────
function StoryCard({ story, idx, isRead, onPress }: {
  story: CultureStory; idx: number; isRead: boolean; onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const grad = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];

  return (
    <Animated.View
      entering={FadeInUp.delay(Math.min(idx * 40, 400)).springify()}
      style={[animStyle, styles.cardWrapper]}
    >
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 14 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14 }); }}
        onPress={onPress}
        style={styles.card}
      >
        <LinearGradient colors={grad} style={styles.cardTop} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.cardTopRow}>
            <View style={styles.idBadge}>
              <Text style={styles.idTxt}>#{story.id}</Text>
            </View>
            {isRead && (
              <View style={styles.readBadge}>
                <Text style={styles.readBadgeTxt}>✓ Read</Text>
              </View>
            )}
          </View>
          <Text style={styles.storyEmoji}>{story.emoji}</Text>
        </LinearGradient>

        <View style={styles.cardBody}>
          <Text style={styles.storyNative} numberOfLines={2}>{story.titleNative}</Text>
          <Text style={styles.storyEng} numberOfLines={1}>{story.title}</Text>
          <View style={[styles.readBtn, { backgroundColor: grad[0] + '20' }]}>
            <Text style={[styles.readBtnTxt, { color: grad[0] }]}>Read Story →</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main StoriesSection
// ─────────────────────────────────────────────────────────────────────────────
export default function StoriesSection({
  language = 'tamil',
  onAddXp,
}: {
  language?: string;
  onAddXp?: (xp: number) => void;
}) {
  const colors = THEME_COLORS[language] || THEME_COLORS.tamil;
  const [selectedCat, setSelectedCat] = useState('All 500 Stories');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState<CultureStory | null>(null);
  const [readStories, setReadStories] = useState<Record<number, boolean>>({});
  const [showCount, setShowCount] = useState(30);

  useEffect(() => {
    AsyncStorage.getItem('@culture_read_stories').then(val => {
      if (val) { try { setReadStories(JSON.parse(val)); } catch (_) {} }
    });
  }, []);

  const allStories = React.useMemo(
    () => Array.from({ length: 500 }, (_, i) => getCultureStory(i + 1, language)),
    [language]
  );

  const filteredStories = React.useMemo(
    () => allStories.filter(s => {
      const matchCat = selectedCat === 'All 500 Stories' || s.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q
        || s.title.toLowerCase().includes(q)
        || s.titleNative.toLowerCase().includes(q)
        || s.id.toString() === q;
      return matchCat && matchSearch;
    }),
    [allStories, selectedCat, searchQuery]
  );

  const handleCompleteStory = async () => {
    if (!activeStory) return;
    const updated = { ...readStories, [activeStory.id]: true };
    setReadStories(updated);
    await AsyncStorage.setItem('@culture_read_stories', JSON.stringify(updated));
    if (onAddXp) onAddXp(20);
    setActiveStory(null);
  };

  const readCount = Object.keys(readStories).length;
  const pct = Math.round((readCount / 500) * 100);

  return (
    <View style={styles.container}>
      {/* Hero Banner */}
      <LinearGradient
        colors={[colors[0], colors[1]]}
        style={styles.heroBanner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />
        <Text style={styles.heroLabel}>📚 CULTURE WORLD</Text>
        <Text style={styles.heroTitle}>500 Stories</Text>
        <Text style={styles.heroSub}>Heritage · Folklore · Fables · Morals</Text>
        <View style={styles.heroProgressRow}>
          <View style={styles.heroProgressBg}>
            <View style={[styles.heroProgressFill, { width: `${pct}%` as any }]} />
          </View>
          <Text style={styles.heroProgressTxt}>{readCount}/500 Read</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search stories by title or number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94A3B8"
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
      >
        {STORY_CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCat(cat)}
            style={[
              styles.catPill,
              selectedCat === cat && { backgroundColor: colors[0], borderColor: colors[1] },
            ]}
          >
            <Text
              style={[
                styles.catTxt,
                selectedCat === cat && { color: '#FFFFFF', fontWeight: '800' },
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Count row */}
      <View style={styles.countRow}>
        <Text style={styles.countTxt}>
          Showing {Math.min(showCount, filteredStories.length)} of {filteredStories.length} Stories
        </Text>
        <View style={[styles.readPill, { backgroundColor: colors[0] + '20' }]}>
          <Text style={[styles.readPillTxt, { color: colors[0] }]}>✓ {readCount} Read</Text>
        </View>
      </View>

      {/* Stories Grid */}
      <View style={styles.grid}>
        {filteredStories.slice(0, showCount).map((story, idx) => (
          <StoryCard
            key={story.id}
            story={story}
            idx={idx}
            isRead={!!readStories[story.id]}
            onPress={() => setActiveStory(story)}
          />
        ))}
      </View>

      {/* Load More */}
      {showCount < filteredStories.length && (
        <Pressable style={styles.loadMoreBtn} onPress={() => setShowCount(c => c + 30)}>
          <LinearGradient colors={[colors[0], colors[1]]} style={styles.loadMoreGrad}>
            <Text style={styles.loadMoreTxt}>Load More Stories ↓</Text>
          </LinearGradient>
        </Pressable>
      )}

      {activeStory && (
        <StoryModal
          story={activeStory}
          colors={colors}
          onClose={() => setActiveStory(null)}
          onComplete={handleCompleteStory}
        />
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { marginTop: 8 },

  heroBanner: {
    borderRadius: 28, padding: 28, marginBottom: 20,
    overflow: 'hidden', position: 'relative',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 16px 48px rgba(0,0,0,0.2)' } : {}),
  },
  heroDeco1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)', top: -50, right: -40,
  },
  heroDeco2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)', bottom: -30, left: 10,
  },
  heroLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: 2, marginBottom: 8 },
  heroTitle: { fontSize: 42, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  heroProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroProgressBg: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' },
  heroProgressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 4 },
  heroProgressTxt: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 24,
    paddingHorizontal: 18, paddingVertical: 12,
    borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 14,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 16px rgba(0,0,0,0.07)' } : {}),
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1E293B' },
  clearSearch: { fontSize: 16, color: '#94A3B8', paddingHorizontal: 6 },

  catScroll: { marginBottom: 14 },
  catPill: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22,
    backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' } : {}),
  },
  catTxt: { fontSize: 13, color: '#475569', fontWeight: '600' },

  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  countTxt: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  readPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  readPillTxt: { fontSize: 12, fontWeight: '800' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  cardWrapper: { width: '47.5%' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(0,0,0,0.10)' } : {}),
  },
  cardTop: { height: 130, justifyContent: 'space-between', alignItems: 'center', padding: 14, paddingBottom: 10 },
  cardTopRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' },
  idBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  idTxt: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  readBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  readBadgeTxt: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  storyEmoji: { fontSize: 50 },
  cardBody: { padding: 14, paddingTop: 10 },
  storyNative: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 3, lineHeight: 20 },
  storyEng: { fontSize: 12, color: '#64748B', marginBottom: 10 },
  readBtn: { borderRadius: 12, paddingVertical: 7, paddingHorizontal: 12, alignSelf: 'flex-start' },
  readBtnTxt: { fontSize: 12, fontWeight: '800' },

  loadMoreBtn: { borderRadius: 24, overflow: 'hidden', marginTop: 20 },
  loadMoreGrad: { paddingVertical: 16, alignItems: 'center' },
  loadMoreTxt: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 500, height: '88%', backgroundColor: '#FFFFFF', borderRadius: 28, overflow: 'hidden' },
  modalHeader: { padding: 28, alignItems: 'center' },
  modalHeaderRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  storyNumBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
  storyNumTxt: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  closeBtnTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalEmoji: { fontSize: 60, marginBottom: 10 },
  modalTitleNative: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', lineHeight: 32 },
  modalTitleEng: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 4 },

  modalActions: { flexDirection: 'row', gap: 12, padding: 14, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  langToggleBtn: { flex: 1, paddingVertical: 11, backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center' },
  langToggleTxt: { fontSize: 13, fontWeight: '700', color: '#334155' },
  audioBtn: { flex: 1, paddingVertical: 11, backgroundColor: '#0EA5E9', borderRadius: 18, alignItems: 'center' },
  audioBtnActive: { backgroundColor: '#EF4444' },
  audioBtnTxt: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  storyBody: { flex: 1, padding: 20 },
  paraBox: { backgroundColor: '#F8FAFC', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: '#E2E8F0' },
  paraActive: { borderColor: '#0EA5E9', backgroundColor: '#F0F9FF' },
  paraNative: { fontSize: 18, fontWeight: '700', color: '#0F172A', lineHeight: 26, marginBottom: 6 },
  paraEnglish: { fontSize: 14, color: '#475569', lineHeight: 21 },

  moralCard: { backgroundColor: '#FEF3C7', borderRadius: 18, padding: 18, borderWidth: 1.5, borderColor: '#F59E0B', marginVertical: 14 },
  moralHeader: { fontSize: 11, fontWeight: '800', color: '#B45309', letterSpacing: 1.5, marginBottom: 6 },
  moralNative: { fontSize: 17, fontWeight: '800', color: '#78350F', marginBottom: 4, lineHeight: 24 },
  moralEng: { fontSize: 14, color: '#92400E', fontStyle: 'italic', lineHeight: 20 },

  finishBtn: { borderRadius: 24, overflow: 'hidden', marginVertical: 16, marginBottom: 32 },
  finishBtnGrad: { paddingVertical: 18, alignItems: 'center' },
  finishBtnTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
});
