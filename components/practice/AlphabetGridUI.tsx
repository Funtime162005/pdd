import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { playAudio } from '../../utils/speech';
import { generateFoundationsLesson, FoundationItem } from '../../utils/ai';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

export default function AlphabetGridUI({ skill, title, selectedLevelNum, onBack }: { skill: string; title: string; selectedLevelNum?: number; onBack?: () => void }) {
  const { user, updateProgress, completeModule } = useAuth();
  const router = useRouter();
  const [leveledUp, setLeveledUp] = useState(false);
  const [newTier, setNewTier] = useState('');
  const lang = user?.learningLanguage || 'tamil';
  
  // Use selectedLevelNum if provided, otherwise fallback to the user's overall level.
  const level = selectedLevelNum ? `Beginner - Level ${selectedLevelNum}` : (user?.level || 'Beginner - Level 1');
  
  const [items, setItems] = useState<FoundationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('');
  const [activeItem, setActiveItem] = useState<FoundationItem | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchLesson();
  }, [lang, level]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const data = await generateFoundationsLesson(lang, level);
      setItems(data);
      if (data.length > 0) {
        const uniqueCategories = Array.from(new Set(data.map(i => i.category)));
        if (uniqueCategories.length > 0) {
          setActiveTab(uniqueCategories[0]);
        }
        setActiveItem(data[0]);
      }
    } catch (e) {
      console.warn("Failed to load alphabet grid", e);
    }
    setLoading(false);
  };

  const handlePress = (item: FoundationItem) => {
    setActiveItem(item);
    playAudio(item.text, lang);
    setProgress(p => Math.min(100, p + 10)); // Arbitrary progress bump per tap
  };

  const completeLesson = async () => {
    await updateProgress(20);
    const result = await completeModule('foundations');
    if (result?.leveledUp) {
      setNewTier(result.newTier);
      setLeveledUp(true);
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 4000);
    } else {
      router.replace('/(tabs)');
    }
  };

  if (leveledUp) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Animated.View entering={FadeInDown.springify()} style={{ alignItems: 'center' }}>
          <Text style={styles.levelUpEmoji}>🎉🏆🎉</Text>
          <Text style={styles.levelUpTitle}>LEVEL UP!</Text>
          <Text style={styles.levelUpSub}>You've mastered Foundations and leveled up to {newTier}!</Text>
        </Animated.View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={{ marginTop: 20, fontSize: 18, color: '#64748b', textAlign: 'center', paddingHorizontal: 20 }}>Consulting the language scholars for your next lesson...</Text>
      </View>
    );
  }

  const uniqueCategories = Array.from(new Set(items.map(i => i.category)));
  const filteredItems = items.filter(i => i.category === activeTab);

  return (
    <View style={styles.container}>
      {onBack && (
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back to Map</Text>
        </Pressable>
      )}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSub}>Tap any card to hear its sound and translation.</Text>
      </View>

      <View style={styles.tabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 24, flexGrow: 1, justifyContent: 'center' }}>
          {uniqueCategories.map(cat => (
            <Pressable key={cat} style={[styles.tab, activeTab === cat && styles.activeTab]} onPress={() => { setActiveTab(cat); setActiveItem(null); }}>
              <Text style={[styles.tabText, activeTab === cat && styles.activeTabText]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeItem !== null && (
          <Animated.View entering={FadeIn} style={styles.activeDisplayCard}>
            <Text style={styles.activeLetterText}>{activeItem.text}</Text>
            <View style={styles.activeDetailsBox}>
              <Text style={styles.activeSoundText}>/{activeItem.sound}/</Text>
              <Text style={styles.activeDescText}>{activeItem.translation}</Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.card, activeItem?.id === item.id && styles.cardActive]}
              onPress={() => handlePress(item)}
            >
              <Text style={[styles.cardText, activeItem?.id === item.id && styles.cardTextActive]}>
                {item.text}
              </Text>
            </Pressable>
          ))}
        </View>

        {progress >= 50 && (
          <Animated.View entering={FadeInDown} style={{ marginTop: 40, alignItems: 'center' }}>
            <Pressable style={styles.completeBtn} onPress={completeLesson}>
              <Text style={styles.completeBtnText}>Complete Lesson (+20 XP)</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  backBtnText: {
    color: '#0EA5E9',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: '#0EA5E9',
  },
  tabText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  activeDisplayCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  activeLetterText: {
    fontSize: 80,
    fontWeight: '800',
    color: '#0EA5E9',
    marginBottom: 16,
  },
  activeDetailsBox: {
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  activeSoundText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 4,
  },
  activeDescText: {
    fontSize: 18,
    color: '#0284C7',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    width: isDesktop ? 100 : 80,
    height: isDesktop ? 100 : 80,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
    transform: [{ scale: 1.05 }],
  },
  cardText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#334155',
  },
  cardTextActive: {
    color: '#0EA5E9',
  },
  completeBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  completeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  levelUpEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  levelUpTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0ea5e9',
  },
  levelUpSub: {
    fontSize: 20,
    color: '#64748b',
    marginTop: 10,
  }
});
