import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { useAuth } from '../../context/AuthContext';

type Props = {
  gameTitle?: string;
  gameIcon?: string;
  accentColor?: string;
  gameKey?: string;
  currentLevelStr?: string;
  initialTab?: string;
  onSelectLevel: (levelNum: number, tier: string) => void;
};

const ITEM_HEIGHT = 110;

export default function LevelsListUI({
  gameTitle = 'Curriculum Map',
  gameIcon = '🗺️',
  accentColor = '#0284C7',
  gameKey = 'general',
  currentLevelStr,
  initialTab,
  onSelectLevel
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const lang = (user?.learningLanguage || 'tamil').toLowerCase();
  const userKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : (user?.id || 'guest');
  // The tier being viewed right now — this decides whether content shown at each
  // level is alphabet/word-based (Beginner), sentence/tough-word (Intermediate)
  // or hard-word/hard-sentence (Pro). Must come from initialTab (falls back to
  // currentLevelStr), never hardcoded — each tier has its own 1-1000 level map.
  const userTier = initialTab || currentLevelStr?.split(' - ')[0] || 'Beginner';
  const [completedMaxLevel, setCompletedMaxLevel] = useState<number>(0);

  useEffect(() => {
    AsyncStorage.getItem(`@game_${userKey}_${lang}_${gameKey}_${userTier}_completed`).then(val => {
      setCompletedMaxLevel(val ? parseInt(val, 10) : 0);
    });
  }, [userKey, lang, gameKey, userTier]);

  // Generate 1000 levels
  const levels = Array.from({ length: 1000 }, (_, i) => i + 1);

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const isCompleted = item <= completedMaxLevel;
    const isCurrent = item === completedMaxLevel + 1 || (completedMaxLevel === 0 && item === 1);
    const isUnlocked = isCompleted || isCurrent;
    
    const x1 = Math.sin(index * 0.6) * 70;
    const x2 = Math.sin((index + 1) * 0.6) * 70;

    const dx = x2 - x1;
    const dy = ITEM_HEIGHT;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Color theme logic
    let nodeBg = '#F8FAFC';
    let nodeBorder = '#E2E8F0';
    let textColor = '#CBD5E1';
    let badgeText = '';

    if (isCompleted) {
      nodeBg = '#22C55E'; // Solid Vibrant Green for Completed Lesson
      nodeBorder = '#16A34A';
      textColor = '#FFFFFF';
      badgeText = '✓';
    } else if (isCurrent) {
      nodeBg = '#FFFFFF'; // Bright White with theme border for Current Active Lesson
      nodeBorder = accentColor;
      textColor = accentColor;
      badgeText = '⭐';
    }

    const lineColor = isCompleted ? '#22C55E' : isCurrent ? accentColor + '88' : '#E2E8F0';

    return (
      <View style={styles.itemWrapper}>
        {/* Continuous Connected Path Line to Next Node */}
        {item < 1000 && (
          <View 
            style={[
              styles.connectorLine,
              {
                width: length,
                backgroundColor: lineColor,
                transform: [
                  { translateX: x1 },
                  { rotate: `${angle}deg` }
                ]
              }
            ]} 
          />
        )}

        {/* Level Node Button */}
        <View style={[styles.nodeContainer, { transform: [{ translateX: x1 }] }]}>
          <Pressable
            disabled={!isUnlocked}
            style={[
              styles.levelBtn,
              { backgroundColor: nodeBg, borderColor: nodeBorder },
              isCurrent && [styles.currentBtnShadow, { shadowColor: accentColor }],
              !isUnlocked && styles.lockedBtnStyle
            ]}
            onPress={() => {
              if (isUnlocked) {
                onSelectLevel(item, userTier);
              }
            }}
          >
            {isUnlocked ? (
              <Text style={[styles.levelText, { color: textColor }]}>
                {item}
              </Text>
            ) : (
              <Text style={styles.lockIcon}>🔒</Text>
            )}

            {badgeText ? (
              <View style={[styles.badgePill, isCompleted ? styles.completedBadge : styles.currentBadge]}>
                <Text style={styles.badgeTxt}>{badgeText}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: accentColor + '33' }]}>
        <Pressable style={styles.backBtn} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, { color: '#0F172A' }]}>{gameIcon} {gameTitle}</Text>
          <Text style={styles.headerSub}>
            Completed: <Text style={{ color: '#22C55E', fontWeight: '800' }}>{completedMaxLevel}</Text> / 1000 Levels
          </Text>
        </View>
      </View>

      <FlatList
        data={levels}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
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
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  itemWrapper: {
    height: ITEM_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  connectorLine: {
    position: 'absolute',
    top: 34,
    left: '50%',
    height: 6,
    borderRadius: 3,
    zIndex: 1,
    transformOrigin: '0% 50%',
  },
  nodeContainer: {
    zIndex: 2,
  },
  levelBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 20px rgba(0,0,0,0.12)' } : { elevation: 6 }),
  },
  currentBtnShadow: {
    borderWidth: 4,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 10px 25px rgba(2,132,199,0.35)' } : { elevation: 10 }),
  },
  lockedBtnStyle: {
    opacity: 0.7,
  },
  levelText: {
    fontSize: 22,
    fontWeight: '900',
  },
  lockIcon: {
    fontSize: 22,
  },
  badgePill: {
    position: 'absolute',
    bottom: -6,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  completedBadge: {
    backgroundColor: '#15803D',
  },
  currentBadge: {
    backgroundColor: '#F59E0B',
  },
  badgeTxt: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
