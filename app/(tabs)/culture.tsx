import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import MascotAssistant from '../../components/MascotAssistant';
import { Colors, Fonts } from '../../components/KidsTheme';
import StoriesSection from '../../components/culture/StoriesSection';

const LANGUAGE_NAMES: Record<string, string> = {
  tamil: 'Tamil Nadu 🌺',
  hindi: 'North India 🕌',
  telugu: 'Andhra Pradesh 🌾',
  malayalam: 'Kerala 🌴',
  kannada: 'Karnataka 🏛️',
};

function FloatingShape({ color, top, left, right, size = 60, delay = 0 }: any) {
  const ty = useSharedValue(0);
  React.useEffect(() => {
    ty.value = withRepeat(withSequence(
      withTiming(-12, { duration: 2400 + delay, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 2400 + delay, easing: Easing.inOut(Easing.ease) })
    ), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  return <Animated.View style={[{ position: 'absolute', top, left, right, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.12 }, style]} />;
}

export default function CultureScreen() {
  const { user } = useAuth();
  const lang = user?.learningLanguage || 'tamil';
  const regionName = LANGUAGE_NAMES[lang] || 'Tamil Nadu 🌺';

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFF9F0', '#FEF3C7', '#ECFDF5']} style={StyleSheet.absoluteFill} />
      <FloatingShape color={Colors.orange} top={-30} right={20} size={140} delay={0} />
      <FloatingShape color={Colors.purple} top={150} left={-20} size={100} delay={400} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInUp.springify()}>
          <Text style={styles.pageTitle}>🏛️ Culture World!</Text>
          <Text style={styles.pageSubtitle}>Explore 500 rich traditional stories of {regionName}</Text>
        </Animated.View>

        {/* 500 Stories Section */}
        <StoriesSection language={lang} />

        <View style={{ height: 120 }} />
      </ScrollView>
      <MascotAssistant message="Explore 500 rich traditional stories & earn XP! 📚✨" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 34, color: Colors.textDark, marginBottom: 6 },
  pageSubtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, marginBottom: 20 },
});
