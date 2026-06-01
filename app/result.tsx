import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function ResultScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams();
  const { setAssessmentLevel } = useAuth();
  
  const finalScore = parseInt(score as string) || 0;
  
  let level = 'Beginner';
  let subtitle = "Welcome! We'll start from the basics.";
  if (finalScore >= 80) {
    level = 'Pro';
    subtitle = "Incredible! Let's fine-tune your mastery.";
  } else if (finalScore >= 40) {
    level = 'Intermediate';
    subtitle = "You have a solid foundation. Let's build your fluency!";
  }

  const roadmaps = {
    Beginner: [
      { title: 'Phase 1: Basic Vocabulary', sub: 'Learn essential everyday words', active: true },
      { title: 'Phase 2: Simple Sentences', sub: 'Construct your first phrases', active: false },
      { title: 'Phase 3: Conversational Fluency', sub: 'Practice speaking with AI', active: false },
    ],
    Intermediate: [
      { title: 'Phase 1: Conversational Fluency', sub: 'Practice speaking with AI', active: true },
      { title: 'Phase 2: Advanced Grammar', sub: 'Unlock complex sentence structures', active: false },
      { title: 'Phase 3: Reading Comprehension', sub: 'Understand short stories', active: false },
    ],
    Pro: [
      { title: 'Phase 1: Advanced Grammar', sub: 'Master complex syntax', active: true },
      { title: 'Phase 2: Cultural Nuances', sub: 'Idioms and regional variations', active: false },
      { title: 'Phase 3: Native Fluency', sub: 'Speak like a local', active: false },
    ]
  };

  const currentRoadmap = roadmaps[level as keyof typeof roadmaps];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A7F3D0', '#ECFDF5']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.card}>
          <Text style={styles.congratsText}>Path Selected!</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.levelText}>{level}</Text>
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
          
          <View style={styles.roadmapCard}>
            <Text style={styles.roadmapTitle}>Your Personalized Roadmap</Text>
            
            {currentRoadmap.map((item, index) => (
              <View key={index} style={styles.roadmapItem}>
                <View style={item.active ? styles.roadmapDotActive : styles.roadmapDot} />
                {index < currentRoadmap.length - 1 && <View style={styles.roadmapLine} />}
                <View>
                  <Text style={item.active ? styles.roadmapItemTitleActive : styles.roadmapItemTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.roadmapItemSub}>{item.sub}</Text>
                </View>
              </View>
            ))}

          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.footer}>
        <Pressable 
          style={styles.button}
          onPress={() => {
            setAssessmentLevel(level, finalScore);
            router.replace('/(tabs)');
          }}
        >
          <Text style={styles.buttonText}>Go to Learning Dashboard</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  card: {
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 20,
  },
  badgeContainer: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 20,
    boxShadow: '0px 4px 10px rgba(5, 150, 105, 0.3)',
    elevation: 5,
  },
  levelText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  roadmapCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.05)',
    elevation: 5,
  },
  roadmapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  roadmapItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  roadmapDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    marginRight: 16,
    marginTop: 4,
    zIndex: 1,
  },
  roadmapDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D1D5DB',
    marginRight: 16,
    marginTop: 4,
    zIndex: 1,
  },
  roadmapLine: {
    position: 'absolute',
    left: 7,
    top: 20,
    bottom: -20,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  roadmapItemTitleActive: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  roadmapItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  roadmapItemSub: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  button: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(16, 185, 129, 0.2)',
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
