import { View, Text, Pressable, StyleSheet, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { Colors, Fonts, Radius, Shadow } from '../components/KidsTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Floating decorative bubble
function FloatingBubble({ emoji, top, left, right, bottom, delay = 0, size = 52 }: any) {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000 + delay, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  return (
    <Animated.View style={[styles.floatingBubble, { top, left, right, bottom, width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={{ fontSize: size * 0.48 }}>{emoji}</Text>
    </Animated.View>
  );
}

// Animated floating cloud shape
function Cloud({ top, left, right, scale = 1, delay = 0 }: any) {
  const tx = useSharedValue(0);
  useEffect(() => {
    tx.value = withRepeat(
      withSequence(
        withTiming(18, { duration: 3000 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(-18, { duration: 3000 + delay, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }, { scale }] }));
  return (
    <Animated.View style={[styles.cloud, { top, left, right }, animStyle]}>
      <View style={styles.cloudBody} />
      <View style={[styles.cloudBump, { left: 12, width: 36, height: 36 }]} />
      <View style={[styles.cloudBump, { left: 36, width: 48, height: 48 }]} />
      <View style={[styles.cloudBump, { right: 12, width: 32, height: 32 }]} />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { width } = useWindowDimensions();

  const monkeyY = useSharedValue(0);
  const monkeyRot = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const starSpin = useSharedValue(0);

  useEffect(() => {
    monkeyY.value = withRepeat(
      withSequence(
        withTiming(-18, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
    monkeyRot.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(6, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
    starSpin.value = withRepeat(withTiming(360, { duration: 6000, easing: Easing.linear }), -1, false);
  }, []);

  const monkeyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: monkeyY.value }],
  }));

  const earthStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${starSpin.value}deg` }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator size="large" color={Colors.green} />
        <Text style={{ fontFamily: Fonts.body, color: Colors.textMid, marginTop: 12, fontSize: 16 }}>Loading your adventure... 🚀</Text>
      </View>
    );
  }

  if (user) return <Redirect href="/(tabs)" />;

  return (
    <View style={styles.container}>
      {/* Hero gradient background */}
      <LinearGradient colors={['#D1FAE5', '#BAE6FD', '#EDE9FE']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      {/* Cartoon clouds - now gently drifting */}
      <Cloud top={40} left={-30} scale={0.8} delay={0} />
      <Cloud top={100} right={-20} scale={0.6} delay={800} />
      <Cloud top={200} left={60} scale={0.5} delay={1400} />

      {/* Floating emoji icons */}
      <FloatingBubble emoji="📚" top={60} left={20} delay={300} size={50} />
      <FloatingBubble emoji="⭐" top={80} right={30} delay={600} size={44} />
      <FloatingBubble emoji="🎵" top={180} right={20} delay={900} size={48} />
      <FloatingBubble emoji="🌺" top={160} left={15} delay={200} size={46} />

      {/* Main content */}
      <Animated.View entering={FadeInDown.duration(900).springify()} style={[styles.content, { maxWidth: Math.min(width - 32, 460) }]}>

        {/* Title */}
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <Text style={styles.tagline}>Learn. Speak. Explore. Shine. ✨</Text>
          <Text style={[styles.title, width < 400 && { fontSize: 36, lineHeight: 42 }]}>Langsphere{'\n'}AI</Text>
          <Text style={[styles.subtitle, width < 400 && { fontSize: 16 }]}>Fun lessons. Real fluency. Every day! 🎉</Text>
        </Animated.View>

        {/* Animated earth mascot */}
        <Animated.View style={[styles.mascotWrapper, monkeyStyle]}>
          <View style={styles.mascotRing}>
            <Animated.Text style={[styles.mascotEmoji, earthStyle]}>🌍</Animated.Text>
          </View>
          {/* Speech bubble */}
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Let's go! 🚀</Text>
          </View>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View entering={FadeIn.delay(600)} style={styles.pillsRow}>
          {['🎮 Games', '🏆 Streaks', '🌍 Culture'].map((p) => (
            <View key={p} style={styles.pill}>
              <Text style={styles.pillText}>{p}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA Button */}
        <AnimatedPressable
          style={[styles.ctaButton, buttonStyle]}
          onPressIn={() => { buttonScale.value = withSpring(0.93, { damping: 10 }); }}
          onPressOut={() => { buttonScale.value = withSpring(1, { damping: 10 }); }}
          onPress={() => router.push('/(auth)/login')}
        >
          <LinearGradient
            colors={Colors.gradGreen}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Start Learning 🚀</Text>
          </LinearGradient>
        </AnimatedPressable>

        {/* Register link */}
        <Animated.View entering={FadeIn.delay(900)}>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>New here? <Text style={styles.registerLinkBold}>Create an account ✨</Text></Text>
          </Pressable>
        </Animated.View>

        {/* Parent Portal link */}
        <Animated.View entering={FadeIn.delay(1000)} style={{ marginTop: 24 }}>
          <Pressable onPress={() => router.push('/(auth)/parent-login')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 }}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>👨‍👩‍👧</Text>
            <Text style={{ fontFamily: Fonts.bodySemi, color: Colors.textDark, fontSize: 14 }}>Parent Portal</Text>
          </Pressable>
        </Animated.View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.bg,
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
    width: 140,
    height: 50,
    zIndex: 0,
  },
  cloudBody: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 14,
  },
  cloudBump: {
    position: 'absolute',
    bottom: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
  },
  floatingBubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' }
      : { elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }),
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  tagline: {
    fontFamily: Fonts.bodySemi,
    fontSize: 16,
    color: Colors.green,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 46,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 52,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Fonts.bodyReg,
    fontSize: 17,
    color: Colors.textMid,
    textAlign: 'center',
    marginBottom: 32,
  },
  mascotWrapper: {
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  mascotRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 12px 32px rgba(250,204,21,0.4)' }
      : { ...Shadow.yellow }),
  },
  mascotEmoji: {
    fontSize: 80,
  },
  speechBubble: {
    position: 'absolute',
    top: 0,
    right: -10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: Colors.purple,
  },
  speechText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textDark,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.green,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(34,197,94,0.15)' }
      : { elevation: 2 }),
  },
  pillText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.green,
  },
  ctaButton: {
    width: '100%',
    borderRadius: Radius.pill,
    marginBottom: 18,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 8px 24px rgba(34,197,94,0.45)' }
      : { ...Shadow.green }),
  },
  ctaGradient: {
    paddingVertical: 18,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  registerLink: {
    fontFamily: Fonts.bodyReg,
    fontSize: 15,
    color: Colors.textMid,
    textAlign: 'center',
  },
  registerLinkBold: {
    fontFamily: Fonts.body,
    color: Colors.purple,
  },
});
