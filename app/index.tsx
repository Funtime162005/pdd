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

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
});
