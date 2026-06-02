import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  useWindowDimensions, Platform, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp, FadeInRight, FadeIn,
  useSharedValue, useAnimatedStyle,
  withSpring, withRepeat, withSequence, withTiming, Easing, ZoomIn, ZoomOut
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { CULTURE_DATA } from '../../constants/translations';
import MascotAssistant from '../../components/MascotAssistant';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';
import StoriesSection from '../../components/culture/StoriesSection';

const LANGUAGE_NAMES: Record<string, string> = {
  tamil: 'Tamil Nadu 🌺',
  hindi: 'North India 🕌',
  telugu: 'Andhra Pradesh 🌾',
  malayalam: 'Kerala 🌴',
  kannada: 'Karnataka 🏛️',
};

const FEST_COLORS: [string, string][] = [
  ['#FB923C', '#F59E0B'],
  ['#F472B6', '#EC4899'],
  ['#38BDF8', '#6366F1'],
  ['#22C55E', '#10B981'],
];

// XP Toast shown after collecting
function XpToast({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onDone, 2000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.View entering={ZoomIn.springify()} exiting={ZoomOut} style={styles.xpToast}>
      <Text style={styles.xpToastText}>🎉 +20 XP Collected!</Text>
    </Animated.View>
  );
}

// Festival detail modal
function FestivalModal({ fest, colors, onClose }: { fest: any; colors: [string, string]; onClose: () => void }) {
  if (!fest) return null;
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Animated.View entering={ZoomIn.springify()} style={styles.modalCard}>
          <LinearGradient colors={colors} style={styles.modalHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.modalIcon}>{fest.icon}</Text>
          </LinearGradient>
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>{fest.title}</Text>
            <Text style={styles.modalDesc}>{fest.desc}</Text>
            <View style={[styles.vocabBox, { borderColor: colors[0] + '60', backgroundColor: colors[0] + '15' }]}>
              <Text style={styles.vocabLabel}>🔤 KEY WORD</Text>
              <Text style={[styles.vocabText, { color: colors[0] }]}>{fest.vocab}</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function FestivalCard({
  fest, index, collected, onCollect, onPress
}: {
  fest: any; index: number; collected: boolean;
  onCollect: () => void; onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const colors = FEST_COLORS[index % FEST_COLORS.length];

  return (
    <Animated.View entering={FadeInRight.delay(index * 150).springify()} style={[animStyle, styles.festCardWrapper]}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 12 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
        onPress={onPress}
        style={styles.festCard}
      >
        <LinearGradient colors={colors} style={styles.festIconArea} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.festDecoCircle1} />
          <View style={styles.festDecoCircle2} />
          <Text style={styles.festIcon}>{fest.icon}</Text>

          {/* Collect / Collected badge */}
          <Pressable
            style={[styles.collectBadge, collected && styles.collectBadgeDone]}
            onPress={(e) => { e.stopPropagation?.(); onCollect(); }}
          >
            <Text style={styles.collectText}>
              {collected ? '✅ Collected' : '✨ Collect'}
            </Text>
          </Pressable>
        </LinearGradient>

        <View style={styles.festBody}>
          <Text style={styles.festTitle}>{fest.title}</Text>
          <Text style={styles.festDesc} numberOfLines={2}>{fest.desc}</Text>
          <View style={[styles.vocabBox, { borderColor: colors[0] + '60', backgroundColor: colors[0] + '15' }]}>
            <Text style={styles.vocabLabel}>🔤 KEY WORD</Text>
            <Text style={[styles.vocabText, { color: colors[0] }]}>{fest.vocab}</Text>
          </View>
          <Text style={styles.tapHint}>Tap card to learn more →</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function FloatingShape({ color, top, left, right, size = 60, delay = 0 }: any) {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withRepeat(withSequence(
      withTiming(-12, { duration: 2400 + delay, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 2400 + delay, easing: Easing.inOut(Easing.ease) })
    ), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  return <Animated.View style={[{ position: 'absolute', top, left, right, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.12 }, style]} />;
}

function FunFactCard({ fact, index }: { fact: string; index: number }) {
  const colors = FEST_COLORS[index % FEST_COLORS.length];
  return (
    <Animated.View entering={FadeInUp.delay(300 + index * 100).springify()}>
      <View style={[styles.factCard, { borderColor: colors[0] + '50', backgroundColor: colors[0] + '12' }]}>
        <Text style={{ fontSize: 28 }}>💡</Text>
        <Text style={[styles.factText, { color: Colors.textDark }]}>{fact}</Text>
      </View>
    </Animated.View>
  );
}

export default function CultureScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { user, updateProgress } = useAuth();

  const lang = user?.learningLanguage || 'tamil';
  const data = CULTURE_DATA[lang] || CULTURE_DATA['tamil'];
  const regionName = LANGUAGE_NAMES[lang] || 'Tamil Nadu 🌺';

  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [showXpToast, setShowXpToast] = useState(false);
  const [selectedFest, setSelectedFest] = useState<any>(null);
  const [selectedColors, setSelectedColors] = useState<[string, string]>(['#FB923C', '#F59E0B']);

  // Load collected festivals from storage
  useEffect(() => {
    AsyncStorage.getItem(`collected_${lang}`).then(val => {
      if (val) setCollectedIds(new Set(JSON.parse(val)));
    });
  }, [lang]);

  const handleCollect = async (fest: any, idx: number) => {
    const id = fest.id || `${lang}_${idx}`;
    if (collectedIds.has(id)) return; // already collected

    const next = new Set(collectedIds);
    next.add(id);
    setCollectedIds(next);
    await AsyncStorage.setItem(`collected_${lang}`, JSON.stringify([...next]));

    // Award XP
    updateProgress(20).catch(() => {});
    setShowXpToast(true);
  };

  const heroScale = useSharedValue(1);
  useEffect(() => {
    heroScale.value = withRepeat(withSequence(
      withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
    ), -1, true);
  }, []);
  const heroStyle = useAnimatedStyle(() => ({ transform: [{ scale: heroScale.value }] }));

  const funFacts = data.funFacts || [
    `${regionName} has a rich cultural heritage!`,
    'Thousands of years of history!',
    'Art, music, and dance traditions!',
  ];

  const collectedCount = collectedIds.size;
  const totalFests = data.festivals.length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFF9F0', '#FEF3C7', '#ECFDF5']} style={StyleSheet.absoluteFill} />
      <FloatingShape color={Colors.orange} top={-30} right={20} size={140} delay={0} />
      <FloatingShape color={Colors.purple} top={150} left={-20} size={100} delay={400} />

      {/* XP Toast */}
      <View style={styles.toastWrapper} pointerEvents="none">
        <XpToast visible={showXpToast} onDone={() => setShowXpToast(false)} />
      </View>

      {/* Festival detail modal */}
      {selectedFest && (
        <FestivalModal
          fest={selectedFest}
          colors={selectedColors}
          onClose={() => setSelectedFest(null)}
        />
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInUp.springify()}>
          <Text style={styles.pageTitle}>🏛️ Culture World!</Text>
          <Text style={styles.pageSubtitle}>Explore the magic of {regionName}</Text>
          {/* Collection progress */}
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>🎒 Collection: {collectedCount}/{totalFests} festivals</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(collectedCount / totalFests) * 100}%` as any }]} />
            </View>
          </View>
        </Animated.View>

        {/* Hero storybook card */}
        <Animated.View entering={FadeInUp.delay(100).springify()} style={heroStyle}>
          <LinearGradient colors={['#FB923C', '#F59E0B', '#FACC15']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.heroDeco1} />
            <View style={styles.heroDeco2} />
            <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>✨ HERITAGE SPOTLIGHT</Text></View>
            <Text style={styles.heroTitle}>{data.heroTitle}</Text>
            <Text style={styles.heroDesc}>{data.heroDesc}</Text>
            <View style={styles.heroFooter}><Text style={styles.heroFooterText}>🌺 Collect all festivals below →</Text></View>
          </LinearGradient>
        </Animated.View>

        {/* Festivals horizontal scroll */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎊 Festivals & Celebrations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.festivalsScroll}>
            {data.festivals.map((fest: any, idx: number) => {
              const id = fest.id || `${lang}_${idx}`;
              return (
                <FestivalCard
                  key={id}
                  fest={fest}
                  index={idx}
                  collected={collectedIds.has(id)}
                  onCollect={() => handleCollect(fest, idx)}
                  onPress={() => {
                    setSelectedFest(fest);
                    setSelectedColors(FEST_COLORS[idx % FEST_COLORS.length]);
                  }}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Stories Section */}
        <StoriesSection language={lang} />

        {/* Traditional Arts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Traditional Arts</Text>
          <View style={[styles.artsGrid, isDesktop && { flexDirection: 'row' }]}>
            {data.arts.map((art: any, idx: number) => {
              const colors = FEST_COLORS[idx % FEST_COLORS.length];
              return (
                <Animated.View key={idx} entering={FadeInUp.delay(300 + idx * 80).springify()}
                  style={[styles.artCard, { borderColor: colors[0] + '60', backgroundColor: colors[0] + '12' }, isDesktop && { width: '23%' }]}>
                  <View style={[styles.artIconRing, { backgroundColor: colors[0] + '22', borderColor: colors[0] }]}>
                    <Text style={styles.artIcon}>{art.icon}</Text>
                  </View>
                  <Text style={styles.artTitle}>{art.title}</Text>
                  <Text style={styles.artDesc}>{art.desc}</Text>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Fun Facts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤓 Did You Know?</Text>
          <View style={{ gap: 10 }}>
            {funFacts.slice(0, 3).map((fact: string, i: number) => (
              <FunFactCard key={i} fact={fact} index={i} />
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
      <MascotAssistant message="Collect all festivals to fill your album! 🌺" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 34, color: Colors.textDark, marginBottom: 6 },
  pageSubtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, marginBottom: 12 },

  progressRow: { marginBottom: 24 },
  progressText: { fontFamily: Fonts.bodySemi, fontSize: 13, color: Colors.textMid, marginBottom: 6 },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.green, borderRadius: 4 },

  toastWrapper: { position: 'absolute', top: 80, alignSelf: 'center', zIndex: 999 },
  xpToast: {
    backgroundColor: '#1a1a2e', paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 30, alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(0,0,0,0.3)' } : {}),
  },
  xpToastText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FACC15' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: Radius.xl, overflow: 'hidden', width: '100%', maxWidth: 380 },
  modalHeader: { height: 140, justifyContent: 'center', alignItems: 'center' },
  modalIcon: { fontSize: 64 },
  modalBody: { padding: 24 },
  modalTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 8 },
  modalDesc: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, lineHeight: 22, marginBottom: 16 },
  closeBtn: { backgroundColor: Colors.purple, paddingVertical: 14, borderRadius: Radius.md, alignItems: 'center', marginTop: 8 },
  closeBtnText: { fontFamily: Fonts.heading, fontSize: 16, color: '#FFFFFF' },

  heroCard: {
    borderRadius: Radius.xl, padding: 28, marginBottom: 32,
    overflow: 'hidden', position: 'relative',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 16px 40px rgba(251,146,60,0.45)' } : { ...Shadow.yellow }),
  },
  heroDeco1: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.15)', top: -50, right: -30 },
  heroDeco2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -30, left: 20 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  heroBadgeText: { fontFamily: Fonts.body, fontSize: 11, color: '#FFFFFF', letterSpacing: 1 },
  heroTitle: { fontFamily: Fonts.heading, fontSize: 26, color: '#FFFFFF', marginBottom: 10, lineHeight: 32 },
  heroDesc: { fontFamily: Fonts.bodyReg, fontSize: 15, color: 'rgba(255,255,255,0.92)', lineHeight: 22, marginBottom: 16 },
  heroFooter: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start' },
  heroFooterText: { fontFamily: Fonts.bodySemi, fontSize: 13, color: '#FFFFFF' },

  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 16 },

  festivalsScroll: { gap: 14, paddingBottom: 10, paddingRight: 20 },
  festCardWrapper: {},
  festCard: {
    backgroundColor: '#FFFFFF', borderRadius: Radius.xl, width: 230,
    overflow: 'hidden', borderWidth: 3, borderColor: 'rgba(255,255,255,0.8)',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 10px 28px rgba(0,0,0,0.1)' } : { ...Shadow.card }),
  },
  festIconArea: { height: 110, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  festDecoCircle1: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.15)', top: -20, right: -20 },
  festDecoCircle2: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -10, left: 10 },
  festIcon: { fontSize: 52, zIndex: 1 },
  collectBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  collectBadgeDone: { backgroundColor: 'rgba(34,197,94,0.4)', borderColor: 'rgba(34,197,94,0.8)' },
  collectText: { fontFamily: Fonts.bodySemi, fontSize: 10, color: '#FFFFFF' },
  festBody: { padding: 14 },
  festTitle: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textDark, marginBottom: 4 },
  festDesc: { fontFamily: Fonts.bodyReg, fontSize: 13, color: Colors.textMid, marginBottom: 10, lineHeight: 18 },
  tapHint: { fontFamily: Fonts.bodyReg, fontSize: 11, color: Colors.textLight, marginTop: 4 },
  vocabBox: { borderRadius: Radius.md, padding: 10, borderWidth: 1.5, marginBottom: 4 },
  vocabLabel: { fontFamily: Fonts.bodySemi, fontSize: 10, color: Colors.textLight, letterSpacing: 1, marginBottom: 4 },
  vocabText: { fontFamily: Fonts.body, fontSize: 15 },

  artsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  artCard: { width: '47%', padding: 18, borderRadius: Radius.lg, alignItems: 'center', borderWidth: 2, ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' } : { ...Shadow.soft }) },
  artIconRing: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2.5 },
  artIcon: { fontSize: 30 },
  artTitle: { fontFamily: Fonts.body, fontSize: 15, color: Colors.textDark, textAlign: 'center', marginBottom: 4 },
  artDesc: { fontFamily: Fonts.bodyReg, fontSize: 12, color: Colors.textMid, textAlign: 'center', lineHeight: 17 },

  factCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radius.lg, padding: 16, borderWidth: 2 },
  factText: { fontFamily: Fonts.bodyReg, fontSize: 14, flex: 1, lineHeight: 20 },
});
