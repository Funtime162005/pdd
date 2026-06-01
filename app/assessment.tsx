import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Radius, Shadow } from '../components/KidsTheme';

const LEVELS = [
  { id: 'beginner', title: 'Beginner', subtitle: 'Start from the basics', score: 0, emoji: '🌱', gradient: ['#A7F3D0', '#10B981'] as [string,string] },
  { id: 'intermediate', title: 'Intermediate', subtitle: 'Build your fluency', score: 50, emoji: '🚀', gradient: ['#FDE68A', '#F59E0B'] as [string,string] },
  { id: 'pro', title: 'Pro', subtitle: 'Fine-tune your mastery', score: 100, emoji: '👑', gradient: ['#E9D5FF', '#8B5CF6'] as [string,string] },
];

function LevelCard({ level, index, onPress }: { level: typeof LEVELS[0], index: number, onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInRight.delay(index * 150).springify()} style={animStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 10 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10 }); }}
        onPress={onPress}
        style={styles.card}
      >
        <LinearGradient colors={level.gradient} style={styles.cardAccent} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{level.emoji}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{level.title}</Text>
          <Text style={styles.cardSubtitle}>{level.subtitle}</Text>
        </View>

        <View style={[styles.arrowContainer, { backgroundColor: level.gradient[0] + '33', borderColor: level.gradient[1] }]}>
          <Text style={{ fontSize: 18 }}>▶</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function LevelSelectionScreen() {
  const router = useRouter();
  const { language } = useLocalSearchParams();

  const handleSelectLevel = (score: number) => {
    if (score === 0) {
      router.replace({ pathname: '/result', params: { score } });
    } else {
      router.push({ pathname: '/placement-test', params: { language, targetScore: score } });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0FFF4', '#EFF6FF', '#FDF4FF']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.springify()} style={styles.headerSection}>
          <View style={styles.mascotBubble}>
            <View style={styles.mascotSpeech}>
              <Text style={styles.mascotSpeechText}>What's your current level?</Text>
            </View>
            <Image source={require('../assets/images/langsphere_logo.png')} style={{ width: 80, height: 80, borderRadius: 40 }} />
          </View>
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>Select your starting point to get a personalized roadmap!</Text>
        </Animated.View>

        <View style={styles.cardList}>
          {LEVELS.map((level, index) => (
            <LevelCard key={level.id} level={level} index={index} onPress={() => handleSelectLevel(level.score)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },
  
  headerSection: { alignItems: 'center', marginBottom: 40, width: '100%' },
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
  title: { fontFamily: Fonts.heading, fontSize: 32, color: Colors.textDark, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 16, color: Colors.textMid, textAlign: 'center' },

  cardList: { width: '100%', maxWidth: 480, gap: 16 },
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
  cardAccent: { width: 8, height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0 },
  emojiContainer: {
    width: 64, height: 64,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginLeft: 24,
  },
  emoji: { fontSize: 32 },
  textContainer: { flex: 1 },
  cardTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 4 },
  cardSubtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid },
  arrowContainer: {
    width: 44, height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
  },
});
