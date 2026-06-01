import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

type Props = {
  currentLevelStr?: string;
  onSelectLevel: (levelNum: number, tier: string) => void;
};

export default function LevelsListUI({ currentLevelStr, onSelectLevel }: Props) {
  const router = useRouter();
  const match = currentLevelStr?.match(/Level (\d+)/);
  const userMaxLevel = match ? parseInt(match[1], 10) : 1;
  const userTier = currentLevelStr?.split(' - ')[0] || 'Beginner';

  // Generate 1000 levels
  const levels = Array.from({ length: 1000 }, (_, i) => i + 1);

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    // Only unlocking up to user's max level for their current tier
    const isUnlocked = item <= userMaxLevel;
    const isCurrent = item === userMaxLevel;

    // Create a curved path effect using a sine wave
    const offsetX = Math.sin(index * 0.6) * 70; // 70 is the amplitude (how far left/right it swings)

    return (
      <Animated.View entering={FadeIn.delay(Math.min(index * 10, 500))} style={[styles.itemContainer, { transform: [{ translateX: offsetX }] }]}>
        <Pressable
          style={[
            styles.levelBtn,
            isUnlocked ? styles.unlockedBtn : styles.lockedBtn,
            isCurrent && styles.currentBtn
          ]}
          onPress={() => {
            if (isUnlocked) onSelectLevel(item, userTier);
          }}
        >
          <Text style={[
            styles.levelText,
            isUnlocked ? styles.unlockedText : styles.lockedText,
            isCurrent && styles.currentText
          ]}>
            {item}
          </Text>
        </Pressable>
        {/* Draw a connecting line to the next level */}
        {item < 1000 && (
          <View 
            style={[
              styles.connector, 
              isUnlocked ? styles.connectorUnlocked : styles.connectorLocked,
              // Calculate slight rotation to aim at the next node
              { transform: [{ rotate: `${Math.cos(index * 0.6) * -30}deg` }] }
            ]} 
          />
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Curriculum Map</Text>
          <Text style={styles.headerSub}>Select an unlocked level to begin</Text>
        </View>
      </View>

      <FlatList
        key={userTier} // Force re-render of list when tier changes
        data={levels}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 16,
    padding: 8,
  },
  backBtnText: {
    color: '#0EA5E9',
    fontSize: 16,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  listContent: {
    padding: 40,
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
  },
  levelBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#fff',
  },
  unlockedBtn: {
    borderColor: '#0EA5E9',
  },
  currentBtn: {
    borderColor: '#22C55E',
    backgroundColor: '#DCFCE7',
    transform: [{ scale: 1.1 }],
  },
  lockedBtn: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
    shadowOpacity: 0,
    elevation: 0,
  },
  levelText: {
    fontSize: 24,
    fontWeight: '800',
  },
  unlockedText: {
    color: '#0EA5E9',
  },
  currentText: {
    color: '#16A34A',
  },
  lockedText: {
    color: '#94A3B8',
  },
  connector: {
    width: 6,
    height: 40,
    marginVertical: -2,
  },
  connectorUnlocked: {
    backgroundColor: '#0EA5E9',
  },
  connectorLocked: {
    backgroundColor: '#E2E8F0',
  },
});
