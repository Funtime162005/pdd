import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, useWindowDimensions, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp, FadeInRight, FadeInDown,
  useSharedValue, useAnimatedStyle,
  withSpring, withRepeat, withSequence, withTiming, Easing
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { GREETINGS } from '../../constants/translations';
import { useState, useEffect } from 'react';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';
import MascotAssistant from '../../components/MascotAssistant';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FloatingShape({ color, top, left, right, bottom, size = 40, delay = 0 }: any) {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2200 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2200 + delay, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  return (
    <Animated.View style={[{ position: 'absolute', top, left, right, bottom, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.15 }, style]} />
  );
}

function FlameStreak({ streak }: { streak: number }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withSpring(1.12, { damping: 6 }), withSpring(1, { damping: 6 })),
      -1, true
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[styles.streakBadge, style]}>
      <LinearGradient colors={['#FF6B35', '#FF4500']} style={styles.streakGrad}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={styles.streakNum}>{streak}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

function IslandCard({ module, isDone, onPress, index }: any) {
  const scale = useSharedValue(1);
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2500 + index * 300, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500 + index * 300, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { translateY: ty.value }] }));

  return (
    <Animated.View entering={FadeInRight.delay(150 + index * 120).springify()} style={animStyle}>
      <AnimatedPressable
        style={[styles.islandCard, isDone && styles.islandCardDone,
          { borderColor: isDone ? Colors.green : module.borderColor }]}
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 10 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10 }); }}
        onPress={onPress}
      >
        <LinearGradient colors={isDone ? ['#D1FAE5', '#A7F3D0'] : module.gradient}
          style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]} />

        {/* Top row: icon + done badge */}
        <View style={styles.islandTop}>
          <View style={[styles.islandIconCircle, { backgroundColor: isDone ? Colors.green : module.iconBg }]}>
            <Text style={styles.islandIcon}>{isDone ? '✅' : module.icon}</Text>
          </View>
          {isDone && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>Done! 🎉</Text>
            </View>
          )}
          <View style={[styles.xpBubble, { backgroundColor: isDone ? Colors.green : module.xpColor }]}>
            <Text style={styles.xpBubbleText}>{module.xp}</Text>
          </View>
        </View>

        <Text style={[styles.islandTitle, isDone && { color: Colors.greenDark }]}>{module.title}</Text>
        <Text style={[styles.islandDesc, isDone && { color: Colors.greenDark + 'CC' }]}>{module.desc}</Text>

        <View style={styles.islandFooter}>
          <Text style={styles.islandTime}>🕒 {module.duration}</Text>
          <View style={[styles.islandPlayBtn, isDone ? { backgroundColor: Colors.green } : { backgroundColor: module.btnColor }]}>
            <Text style={styles.islandPlayText}>{isDone ? 'Redo' : 'Go! →'}</Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (user) {
      setTimeout(() => setShowReward(true), 800);
      setTimeout(() => setShowReward(false), 3500);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <Image source={require('../../assets/images/langsphere_logo.png')} style={{ width: 100, height: 100, borderRadius: 50 }} />
        <ActivityIndicator size="large" color={Colors.green} style={{ marginTop: 16 }} />
        <Text style={{ fontFamily: Fonts.body, color: Colors.textMid, marginTop: 12, fontSize: 16 }}>Loading your world... 🌍</Text>
      </View>
    );
  }
  if (!user) return <Redirect href="/" />;

  let tier = 'Beginner';
  if (user?.level?.includes('Pro') || user?.level?.includes('Advanced')) tier = 'Pro';
  else if (user?.level?.includes('Intermediate')) tier = 'Intermediate';

  const match = user?.level?.match(/Level (\d+)/);
  const currentLevelNum = match ? parseInt(match[1], 10) : 1;

  const completedModules = user?.completedModules || [];
  const totalPillars = 7;
  const completedCount = completedModules.length;
  const tierProgress = (completedCount / totalPillars) * 100;
  
  // Calculate next tier or next level
  const nextTier = tier === 'Beginner' ? 'Intermediate' : tier === 'Intermediate' ? 'Pro' : 'Master';

  const ISLAND_CONFIGS = [
    { gradient: ['#38BDF8', '#0EA5E9'] as [string,string], iconBg: '#BAE6FD', xpColor: '#0284C7', btnColor: '#0284C7', borderColor: '#38BDF8', icon: 'Aa', title: 'Foundations', desc: tier === 'Beginner' ? 'Master the core letters!' : tier === 'Intermediate' ? 'Build flowing sentences!' : 'Translate complex text!', route: `/practice/foundations?tier=${tier}`, duration: '10 min', xp: '+20 XP', moduleId: 'foundations' },
    { gradient: ['#EC4899', '#BE185D'] as [string,string], iconBg: '#FCE7F3', xpColor: '#9D174D', btnColor: '#9D174D', borderColor: '#EC4899', icon: '✍️', title: 'Writing Canvas', desc: tier === 'Beginner' ? 'Trace letters and words!' : 'Write full sentences!', route: `/practice/writing?tier=${tier}`, duration: '5 min', xp: '+15 XP', moduleId: 'writing' },
    { gradient: ['#F59E0B', '#D97706'] as [string,string], iconBg: '#FEF3C7', xpColor: '#B45309', btnColor: '#B45309', borderColor: '#F59E0B', icon: '📚', title: 'Vocabulary', desc: tier === 'Beginner' ? 'Learn basic words!' : tier === 'Intermediate' ? 'Expand your lexicon!' : 'Master advanced terms!', route: `/practice/vocabulary?tier=${tier}`, duration: '10 min', xp: '+25 XP', moduleId: 'vocabulary' },
    { gradient: ['#22C55E', '#16A34A'] as [string,string], iconBg: '#DCFCE7', xpColor: '#15803D', btnColor: '#15803D', borderColor: '#22C55E', icon: '👋', title: 'Communication', desc: tier === 'Beginner' ? 'Intro yourself in style!' : tier === 'Intermediate' ? 'Chat with the AI tutor!' : 'Speak at native speed!', route: `/practice/communication?tier=${tier}`, duration: '15 min', xp: '+30 XP', moduleId: 'communication' },
    { gradient: ['#F43F5E', '#E11D48'] as [string,string], iconBg: '#FFE4E6', xpColor: '#BE123C', btnColor: '#BE123C', borderColor: '#F43F5E', icon: '📖', title: 'Reading', desc: tier === 'Beginner' ? 'Read simple stories!' : tier === 'Intermediate' ? 'Comprehend paragraphs!' : 'Analyze native texts!', route: '/practice/reading', duration: '20 min', xp: '+40 XP', moduleId: 'reading' },
    { gradient: ['#F472B6', '#EC4899'] as [string,string], iconBg: '#FCE7F3', xpColor: '#BE185D', btnColor: '#BE185D', borderColor: '#F472B6', icon: '🎙️', title: 'Pronunciation', desc: tier === 'Beginner' ? 'Perfect your accent!' : tier === 'Intermediate' ? 'Say full sentences right!' : 'Master complex idioms!', route: '/practice/pronunciation', duration: '1 hr', xp: '+50 XP', moduleId: 'pronunciation' },
    { gradient: ['#A855F7', '#7C3AED'] as [string,string], iconBg: '#F3E8FF', xpColor: '#6D28D9', btnColor: '#6D28D9', borderColor: '#A855F7', icon: '📝', title: 'Assessment', desc: tier === 'Beginner' ? 'Test what you know!' : tier === 'Intermediate' ? 'Prove your fluency!' : 'Get certified! 🏅', route: '/practice/assessment', duration: '1 hr', xp: '+100 XP', moduleId: 'assessment' },
  ];

  const earnedBadges = [];
  if (user.xp >= 100) earnedBadges.push({ icon: '🥇', name: 'Quick Learner', color: Colors.yellow });
  if (user.streak >= 5) earnedBadges.push({ icon: '🔥', name: '5 Day Streak', color: Colors.orange });
  else if (user.streak >= 3) earnedBadges.push({ icon: '🔥', name: '3 Day Streak', color: Colors.orange });
  if (tier === 'Intermediate' || tier === 'Pro') earnedBadges.push({ icon: '🧠', name: 'Brain Master', color: Colors.purple });

  const displayName = user.name === '[object Object]' ? 'Champion' : user.name;

  return (
    <View style={styles.container}>
      {/* Animated background */}
      <LinearGradient colors={['#ECFDF5', '#F0F9FF', '#FFF7ED']} style={StyleSheet.absoluteFill} />
      <FloatingShape color={Colors.green} top={-40} right={20} size={160} delay={0} />
      <FloatingShape color={Colors.sky} top={100} left={-30} size={120} delay={400} />
      <FloatingShape color={Colors.yellow} bottom={200} right={-20} size={100} delay={200} />

      {/* Daily Reward Popup */}
      {showReward && (
        <Animated.View entering={FadeInDown.springify()} style={styles.rewardPopup}>
          <LinearGradient colors={['#FACC15', '#FB923C']} style={styles.rewardGrad}>
            <Text style={{ fontSize: 32 }}>🎁</Text>
            <Text style={styles.rewardText}>Daily Bonus! +10 XP</Text>
          </LinearGradient>
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: isDesktop ? 30 : 60 }]}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInUp.delay(50).springify()} style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.helloEmoji}>{GREETINGS[user?.learningLanguage || 'tamil'] || 'Hello'} 👋</Text>
            <Text style={styles.heroName}>{displayName}!</Text>
            <Text style={styles.heroSub}>Ready for today's adventure? 🚀</Text>
          </View>
          {!isDesktop && (
            <View style={styles.headerRight}>
              <FlameStreak streak={user.streak || 0} />
              <View style={styles.xpPill}>
                <Text style={styles.xpPillText}>⭐ {user.xp.toLocaleString()}</Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Level progress card */}
        <Animated.View entering={FadeInUp.delay(180).springify()} style={styles.levelCard}>
          <LinearGradient
            colors={tier === 'Pro' ? ['#7C3AED', '#4C1D95'] : tier === 'Intermediate' ? ['#0284C7', '#0EA5E9'] : ['#22C55E', '#059669']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
          />
          {/* Decorative blobs */}
          <View style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <View style={{ position: 'absolute', bottom: -10, left: -10, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.08)' }} />

          <View style={styles.levelTop}>
            <View>
              <Text style={styles.levelLabel}>🎮 Current Phase</Text>
              <Text style={styles.levelTitle}>{tier} Adventure</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>
                {tier === 'Pro' ? '👑' : tier === 'Intermediate' ? '⚡' : '🌱'} Lvl {currentLevelNum}/1000
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              entering={FadeInUp.delay(400)}
              style={[styles.progressFill, { width: `${tierProgress}%` as any }]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>🗺️ {completedCount}/{totalPillars} Islands Conquered!</Text>
            <Text style={styles.progressText}>{currentLevelNum >= 1000 ? `Unlock ${nextTier} →` : `Reach Level ${currentLevelNum + 1} →`}</Text>
          </View>
        </Animated.View>

        {/* Island world */}
        <Animated.View entering={FadeInUp.delay(250).springify()}>
          <Text style={styles.sectionTitle}>🏝️ Your Learning Islands</Text>
          <Text style={styles.sectionSub}>Conquer all 7 to reach Level {currentLevelNum + 1}! ⬆️</Text>
        </Animated.View>

        <View style={[styles.islandGrid, isDesktop && { flexDirection: 'row', flexWrap: 'wrap', gap: 16 }]}>
          {ISLAND_CONFIGS.map((mod, i) => {
            const isDone = completedModules.includes(mod.moduleId);
            return (
              <View key={mod.moduleId} style={isDesktop ? { width: '47%' } : {}}>
                <IslandCard module={mod} isDone={isDone} index={i}
                  onPress={() => router.push(mod.route as any)} />
              </View>
            );
          })}
        </View>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>🏅 Your Badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 8 }}>
                {earnedBadges.map((b, i) => (
                  <Animated.View key={i} entering={FadeInRight.delay(i * 100).springify()}>
                    <View style={[styles.badgeCard, { borderColor: b.color }]}>
                      <Text style={{ fontSize: 36 }}>{b.icon}</Text>
                      <Text style={[styles.badgeName, { color: b.color }]}>{b.name}</Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <MascotAssistant message="Let's crush today's lesson! 💪" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingBottom: 40 },

  rewardPopup: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    zIndex: 999,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(250,204,21,0.5)' } : {}),
  },
  rewardGrad: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24, paddingVertical: 14 },
  rewardText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  headerRight: { alignItems: 'flex-end', gap: 8 },
  helloEmoji: { fontFamily: Fonts.bodySemi, fontSize: 15, color: Colors.green, marginBottom: 4 },
  heroName: { fontFamily: Fonts.heading, fontSize: 36, color: Colors.textDark, lineHeight: 40 },
  heroSub: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, marginTop: 4 },

  streakBadge: { borderRadius: Radius.pill, overflow: 'hidden' },
  streakGrad: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, gap: 4, borderRadius: Radius.pill },
  streakEmoji: { fontSize: 20 },
  streakNum: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },

  xpPill: {
    backgroundColor: Colors.yellowLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: Colors.yellow,
  },
  xpPillText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.yellowDark },

  levelCard: {
    borderRadius: Radius.xl,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    minHeight: 140,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 32px rgba(34,197,94,0.3)' } : { ...Shadow.green }),
  },
  levelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  levelLabel: { fontFamily: Fonts.bodySemi, fontSize: 13, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  levelTitle: { fontFamily: Fonts.heading, fontSize: 28, color: '#FFFFFF' },
  levelBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  levelBadgeText: { fontFamily: Fonts.body, fontSize: 13, color: '#FFFFFF' },

  progressTrack: { height: 14, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 7, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 7 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontFamily: Fonts.bodySemi, fontSize: 12, color: 'rgba(255,255,255,0.9)' },

  sectionTitle: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.textDark, marginBottom: 4 },
  sectionSub: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textMid, marginBottom: 20 },

  islandGrid: { gap: 16, marginBottom: 32 },

  islandCard: {
    borderRadius: Radius.xl,
    padding: 20,
    marginBottom: 0,
    borderWidth: 3,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 10px 30px rgba(0,0,0,0.1)' } : { ...Shadow.card }),
  },
  islandCardDone: { opacity: 0.95 },

  islandTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  islandIconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  islandIcon: { fontSize: 28 },
  completedBadge: { backgroundColor: Colors.green, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  completedText: { fontFamily: Fonts.bodySemi, fontSize: 11, color: '#FFFFFF' },
  xpBubble: { marginLeft: 'auto', borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  xpBubbleText: { fontFamily: Fonts.body, fontSize: 12, color: '#FFFFFF' },

  islandTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 6 },
  islandDesc: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textMid, lineHeight: 20, marginBottom: 16 },

  islandFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  islandTime: { fontFamily: Fonts.bodyReg, fontSize: 13, color: Colors.textMid },
  islandPlayBtn: { borderRadius: Radius.pill, paddingHorizontal: 20, paddingVertical: 10 },
  islandPlayText: { fontFamily: Fonts.body, fontSize: 14, color: '#FFFFFF' },

  badgesSection: { marginBottom: 24 },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 16,
    alignItems: 'center',
    width: 110,
    borderWidth: 2.5,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 6px 16px rgba(0,0,0,0.08)' } : { ...Shadow.soft }),
  },
  badgeName: { fontFamily: Fonts.bodySemi, fontSize: 12, textAlign: 'center', marginTop: 8 },
});
