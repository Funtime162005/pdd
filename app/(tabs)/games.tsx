import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, withTiming, Easing
} from 'react-native-reanimated';
import MascotAssistant from '../../components/MascotAssistant';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';

const games = [
  {
    id: 'listen',
    title: 'Listen & Select',
    description: 'Train your ears! Hear a word and pick the right answer.',
    icon: '🎧',
    gradient: ['#06B6D4', '#0EA5E9'] as [string, string],
    bgLight: '#E0F2FE',
    xp: '+15 XP',
    stars: 3,
    tag: '🎵 Listening',
    tagColor: '#0284C7',
    route: '/game-listen',
    players: '2.4k playing',
  },
  {
    id: 'picture',
    title: 'Picture Quiz',
    description: 'Match the word to the picture! Visual learning FTW!',
    icon: '🖼️',
    gradient: ['#F59E0B', '#FB923C'] as [string, string],
    bgLight: '#FEF3C7',
    xp: '+20 XP',
    stars: 2,
    tag: '👁️ Visual',
    tagColor: '#D97706',
    route: '/game-picture',
    players: '1.8k playing',
  },
  {
    id: 'sentence',
    title: 'Sentence Builder',
    description: 'Race the clock! Arrange scrambled words super fast!',
    icon: '🧩',
    gradient: ['#6366F1', '#8B5CF6'] as [string, string],
    bgLight: '#EDE9FE',
    xp: '+25 XP',
    stars: 3,
    tag: '📝 Grammar',
    tagColor: '#6D28D9',
    route: '/game-sentence',
    players: '3.1k playing',
  },
  {
    id: 'pronounce',
    title: 'Pronunciation Battle',
    description: 'Speak into the mic! Our AI scores your accent live!',
    icon: '🎤',
    gradient: ['#EC4899', '#F472B6'] as [string, string],
    bgLight: '#FCE7F3',
    xp: '+30 XP',
    stars: 3,
    tag: '🗣️ Speaking',
    tagColor: '#BE185D',
    route: '/game-pronounce',
    players: '987 playing',
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3].map(i => (
        <Text key={i} style={{ fontSize: 14, opacity: i <= count ? 1 : 0.3 }}>⭐</Text>
      ))}
    </View>
  );
}

function GameCard({ game, index }: { game: typeof games[0]; index: number }) {
  const scale = useSharedValue(1);
  const tilt = useSharedValue(0);
  const router = useRouter();

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${tilt.value}deg` }],
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 150).springify()}
      style={[styles.cardWrapper, animStyle]}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 10 });
          tilt.value = withSpring(-1.5, { damping: 8 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10 });
          tilt.value = withSpring(0, { damping: 8 });
        }}
        onPress={() => router.push(game.route as any)}
        style={styles.card}
      >
        {/* Gradient top section */}
        <LinearGradient
          colors={game.gradient}
          style={styles.cardTop}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          {/* Decorative circles */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />

          {/* XP badge */}
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>{game.xp}</Text>
          </View>

          {/* Big icon */}
          <Text style={styles.gameIcon}>{game.icon}</Text>

          {/* Players badge */}
          <View style={styles.playersBadge}>
            <Text style={styles.playersText}>👥 {game.players}</Text>
          </View>
        </LinearGradient>

        {/* Card body */}
        <View style={[styles.cardBody, { backgroundColor: game.bgLight }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <View style={[styles.tagPill, { backgroundColor: game.tagColor + '22', borderColor: game.tagColor }]}>
              <Text style={[styles.tagText, { color: game.tagColor }]}>{game.tag}</Text>
            </View>
          </View>
          <Text style={styles.gameDesc}>{game.description}</Text>

          <View style={styles.cardFooter}>
            <StarRow count={game.stars} />
            <Pressable
              style={[styles.playBtn]}
              onPress={() => router.push(game.route as any)}
            >
              <LinearGradient colors={game.gradient} style={styles.playBtnGrad}>
                <Text style={styles.playBtnText}>PLAY! 🎮</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function GamesHubScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const bannerPulse = useSharedValue(1);
  useEffect(() => {
    bannerPulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);
  const bannerStyle = useAnimatedStyle(() => ({ transform: [{ scale: bannerPulse.value }] }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#EFF6FF', '#FDF4FF', '#FFF9F0']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
          <Text style={styles.headerTitle}>🎮 Game Zone!</Text>
          <Text style={styles.headerSub}>Play games, earn XP, level up! 🌟</Text>
        </Animated.View>

        {/* Daily challenge banner */}
        <Animated.View entering={FadeInUp.delay(100).springify()} style={bannerStyle}>
          <LinearGradient colors={['#FACC15', '#FB923C']} style={styles.dailyBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.dailyEmoji}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dailyTitle}>Daily Challenge!</Text>
              <Text style={styles.dailySub}>Play 3 games to earn a bonus 🎁</Text>
            </View>
            <View style={styles.dailyBadge}>
              <Text style={styles.dailyBadgeText}>+50 XP</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Games section title */}
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <Text style={styles.sectionTitle}>🕹️ Choose Your Adventure</Text>
        </Animated.View>

        {/* Game cards */}
        <View style={[styles.grid, isDesktop && { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {games.map((game, index) => (
            <View key={game.id} style={isDesktop ? { width: '48%' } : {}}>
              <GameCard game={game} index={index} />
            </View>
          ))}
        </View>

        {/* Fun tip banner */}
        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <View style={styles.tipCard}>
            <Text style={{ fontSize: 28 }}>💡</Text>
            <Text style={styles.tipText}>Tip: Play every day to keep your streak going! 🔥</Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <MascotAssistant message="Pick a game and earn XP! 🎮" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  header: { marginBottom: 20 },
  headerTitle: { fontFamily: Fonts.heading, fontSize: 36, color: Colors.textDark },
  headerSub: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, marginTop: 4 },

  dailyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    padding: 18,
    marginBottom: 28,
    gap: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(250,204,21,0.45)' } : { ...Shadow.yellow }),
  },
  dailyEmoji: { fontSize: 36 },
  dailyTitle: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
  dailySub: { fontFamily: Fonts.bodyReg, fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  dailyBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  dailyBadgeText: { fontFamily: Fonts.body, fontSize: 14, color: '#FFFFFF' },

  sectionTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 16 },

  grid: { gap: 20, marginBottom: 24 },
  cardWrapper: {},
  card: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(0,0,0,0.12)' } : { ...Shadow.card }),
  },

  cardTop: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  decoCircle1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.12)', top: -50, right: -30 },
  decoCircle2: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -20, left: -10 },
  xpBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: Colors.yellow,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 2.5,
    borderColor: Colors.yellowDark,
  },
  xpText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textDark },
  gameIcon: { fontSize: 72 },
  playersBadge: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  playersText: { fontFamily: Fonts.bodySemi, fontSize: 11, color: '#FFFFFF' },

  cardBody: { padding: 18 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  gameTitle: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.textDark, flex: 1 },
  tagPill: { borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1.5, marginLeft: 8 },
  tagText: { fontFamily: Fonts.bodySemi, fontSize: 11 },
  gameDesc: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textMid, lineHeight: 20, marginBottom: 16 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playBtn: { borderRadius: Radius.pill, overflow: 'hidden' },
  playBtnGrad: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.pill },
  playBtnText: { fontFamily: Fonts.body, fontSize: 14, color: '#FFFFFF' },

  tipCard: {
    backgroundColor: Colors.yellowLight,
    borderRadius: Radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2.5,
    borderColor: Colors.yellow,
  },
  tipText: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textDark, flex: 1, lineHeight: 20 },
});
