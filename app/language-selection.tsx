import { View, Text, Pressable, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInRight, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { Colors, Fonts, Radius, Shadow } from '../components/KidsTheme';

const LANGUAGES = [
  { id: 'tamil',     name: 'Tamil',     native: 'தமிழ்',    emoji: '🌺', gradient: ['#22C55E', '#16A34A'] as [string,string] },
  { id: 'hindi',     name: 'Hindi',     native: 'हिन्दी',   emoji: '🕌', gradient: ['#38BDF8', '#0284C7'] as [string,string] },
  { id: 'telugu',    name: 'Telugu',    native: 'తెలుగు',   emoji: '🦚', gradient: ['#A855F7', '#7C3AED'] as [string,string] },
  { id: 'malayalam', name: 'Malayalam', native: 'മലയാളം',  emoji: '🌴', gradient: ['#FB923C', '#EA580C'] as [string,string] },
  { id: 'kannada',   name: 'Kannada',   native: 'ಕನ್ನಡ',    emoji: '🐘', gradient: ['#F472B6', '#DB2777'] as [string,string] },
];

function LanguageCard({ lang, index, onPress }: { lang: typeof LANGUAGES[0]; index: number; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInRight.delay(index * 120).springify()} style={animStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 12 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
        onPress={onPress}
        style={styles.card}
      >
        {/* Gradient left accent */}
        <LinearGradient colors={lang.gradient} style={styles.cardAccent} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />

        {/* Emoji icon */}
        <LinearGradient colors={lang.gradient} style={styles.cardEmojiWrap} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.cardEmoji}>{lang.emoji}</Text>
        </LinearGradient>

        <View style={styles.cardText}>
          <Text style={styles.cardName}>{lang.name}</Text>
          <Text style={styles.cardNative}>{lang.native}</Text>
        </View>

        <View style={[styles.cardArrow, { backgroundColor: lang.gradient[0] + '22', borderColor: lang.gradient[0] }]}>
          <Text style={{ fontSize: 18 }}>▶</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Floating star
function FloatingStar({ top, left, right, delay = 0 }: any) {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1800 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800 + delay, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);
  const s = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  return (
    <Animated.View style={[styles.floatingStar, { top, left, right }, s]}>
      <Text style={{ fontSize: 28 }}>⭐</Text>
    </Animated.View>
  );
}

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { setLearningLanguage } = useAuth();

  const handleSelect = async (langId: string) => {
    if (setLearningLanguage) await setLearningLanguage(langId);
    router.push({ pathname: '/assessment', params: { language: langId } });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0FFF4', '#EFF6FF', '#FDF4FF']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      {/* Floating stars */}
      <FloatingStar top={60} left={20} delay={0} />
      <FloatingStar top={80} right={30} delay={400} />
      <FloatingStar top={200} left={10} delay={700} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mascot + Header */}
        <Animated.View entering={FadeInUp.springify()} style={styles.headerSection}>
          <View style={styles.mascotBubble}>
            <View style={styles.mascotSpeech}>
              <Text style={styles.mascotSpeechText}>Pick your language! 🎯</Text>
            </View>
            <Image source={require('../assets/images/langsphere_logo.png')} style={{ width: 80, height: 80, borderRadius: 40 }} />
          </View>
          <Text style={styles.title}>Which language{'\n'}do you want to learn?</Text>
          <Text style={styles.subtitle}>Choose your heritage language to get started!</Text>
        </Animated.View>

        {/* Language Cards */}
        <View style={styles.cardList}>
          {LANGUAGES.map((lang, index) => (
            <LanguageCard
              key={lang.id}
              lang={lang}
              index={index}
              onPress={() => handleSelect(lang.id)}
            />
          ))}
        </View>

        {/* Bottom note */}
        <Animated.View entering={FadeIn.delay(700)} style={styles.bottomNote}>
          <Text style={styles.bottomNoteText}>🔄 You can change this anytime in Settings</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },

  floatingStar: {
    position: 'absolute',
    zIndex: 0,
  },

  headerSection: { alignItems: 'center', marginBottom: 32, width: '100%' },
  mascotBubble: { alignItems: 'center', marginBottom: 16 },
  mascotSpeech: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: Colors.purple,
    marginBottom: 8,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(168,85,247,0.2)' } : {}),
  },
  mascotSpeechText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textDark },
  mascotEmoji: { fontSize: 56 },
  title: { fontFamily: Fonts.heading, fontSize: 32, color: Colors.textDark, textAlign: 'center', lineHeight: 40, marginBottom: 8 },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center' },

  cardList: { width: '100%', maxWidth: 480, gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#F3F4F6',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 6px 20px rgba(0,0,0,0.07)' } : { ...Shadow.card }),
  },
  cardAccent: { width: 6, height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0 },
  cardEmojiWrap: {
    width: 64, height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginLeft: 22,
  },
  cardEmoji: { fontSize: 32 },
  cardText: { flex: 1 },
  cardName: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 4 },
  cardNative: { fontFamily: Fonts.bodyReg, fontSize: 18, color: Colors.textMid },
  cardArrow: {
    width: 44, height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
  },

  bottomNote: {
    marginTop: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: Colors.greenLight,
  },
  bottomNoteText: { fontFamily: Fonts.bodySemi, fontSize: 13, color: Colors.textMid },
});
