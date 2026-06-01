import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInLeft, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import MascotAssistant from '../../components/MascotAssistant';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';

const API_URL = 'https://nri-language-learning.onrender.com/api';

const avatars: Record<string, any> = {
  tiger: require('../../assets/avatars/tiger.png'),
  panda: require('../../assets/avatars/panda.png'),
  monkey: require('../../assets/avatars/monkey.png'),
  elephant: require('../../assets/avatars/elephant.png'),
  lion: require('../../assets/avatars/lion.png'),
  koala: require('../../assets/avatars/koala.png'),
  giraffe: require('../../assets/avatars/giraffe.png'),
  penguin: require('../../assets/avatars/penguin.png'),
};

type LeaderboardUser = { _id: string; name: string; avatar: string; xp: number; level: string; };

const PODIUM_CONFIG = [
  { gradient: ['#FACC15', '#F59E0B'] as [string, string], glow: Colors.yellow, crown: '👑', size: 90, label: '1st', height: 100 },
  { gradient: ['#94A3B8', '#CBD5E1'] as [string, string], glow: '#94A3B8', crown: '🥈', size: 75, label: '2nd', height: 75 },
  { gradient: ['#FB923C', '#EA580C'] as [string, string], glow: Colors.orange, crown: '🥉', size: 70, label: '3rd', height: 60 },
];

function FloatingStar({ top, left, right, delay = 0 }: any) {
  const ty = useSharedValue(0);
  const rot = useSharedValue(0);
  useEffect(() => {
    ty.value = withRepeat(withSequence(withTiming(-10, { duration: 1800 + delay, easing: Easing.inOut(Easing.ease) }), withTiming(0, { duration: 1800 + delay, easing: Easing.inOut(Easing.ease) })), -1, true);
    rot.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1, false);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }, { rotate: `${rot.value}deg` }] }));
  return <Animated.View style={[{ position: 'absolute', top, left, right }, style]}><Text style={{ fontSize: 20, opacity: 0.7 }}>⭐</Text></Animated.View>;
}

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/leaderboard`);
      const data = await res.json();
      if (data && data.error) {
        const mock: LeaderboardUser[] = [
          { _id: '2', name: 'Priya', avatar: 'panda', xp: 21100, level: 'Intermediate - Level 8' },
          { _id: '3', name: 'Karthik', avatar: 'tiger', xp: 18500, level: 'Beginner - Level 12' },
          { _id: '4', name: 'Meera', avatar: 'elephant', xp: 15200, level: 'Beginner - Level 10' },
          { _id: '5', name: 'Rahul', avatar: 'monkey', xp: 12000, level: 'Beginner - Level 6' },
        ];
        if (user) mock.push({ _id: user.email || '1', name: user.name, avatar: user.avatar || 'tiger', xp: user.xp > 0 ? user.xp : 25400, level: user.level || 'Pro - Level 5' });
        else mock.push({ _id: '1', name: 'Arjun', avatar: 'lion', xp: 25400, level: 'Pro - Level 5' });
        setLeaderboard(mock.sort((a, b) => b.xp - a.xp));
      } else {
        setLeaderboard(Array.isArray(data) ? data : []);
      }
    } catch { }
  };

  useEffect(() => { fetchLeaderboard(); const iv = setInterval(fetchLeaderboard, 10000); return () => clearInterval(iv); }, [user]);

  const getAvatar = (key: string) => avatars[key] || avatars.tiger;
  const getTier = (l: string) => l ? l.split(' - ')[0] : 'Beginner';
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumRankIndex = [1, 0, 2]; // maps display position to PODIUM_CONFIG index

  return (
    <View style={styles.container}>
      {/* Deep space hero header */}
      <LinearGradient colors={['#1E1B4B', '#312E81', '#6D28D9']} style={[StyleSheet.absoluteFill, { height: 320 }]} />
      <LinearGradient colors={['#FFF9F0', '#ECFDF5']} style={[StyleSheet.absoluteFill, { top: 280 }]} />

      {/* Floating stars */}
      <FloatingStar top={30} left={20} delay={0} />
      <FloatingStar top={50} right={40} delay={300} />
      <FloatingStar top={100} left={100} delay={600} />
      <FloatingStar top={60} right={120} delay={200} />
      <FloatingStar top={140} left={40} delay={500} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInDown.springify()} style={styles.header}>
          <Text style={styles.title}>🏆 Hall of Fame</Text>
          <Text style={styles.subtitle}>Who will claim the crown? 👑</Text>
        </Animated.View>

        {/* Podium */}
        {top3.length > 0 && (
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.podiumArea}>
            {podiumOrder.map((lb, i) => {
              if (!lb) return null;
              const cfg = PODIUM_CONFIG[podiumRankIndex[i]];
              const isCenter = i === 1; // 1st place is center
              return (
                <View key={lb._id} style={[styles.podiumSlot, isCenter && { marginBottom: 0 }]}>
                  {/* Crown */}
                  <Text style={[styles.podiumCrown, isCenter && { fontSize: 40 }]}>{cfg.crown}</Text>

                  {/* Avatar circle */}
                  <View style={[styles.podiumAvatarWrap, {
                    width: cfg.size + 8, height: cfg.size + 8, borderRadius: (cfg.size + 8) / 2,
                    borderColor: cfg.glow,
                    ...(Platform.OS === 'web' ? { boxShadow: `0px 8px 24px ${cfg.glow}88` } : {}),
                  }]}>
                    <LinearGradient colors={cfg.gradient} style={[styles.podiumAvatarGrad, { width: cfg.size + 8, height: cfg.size + 8, borderRadius: (cfg.size + 8) / 2 }]}>
                      <Image source={getAvatar(lb.avatar)} style={{ width: cfg.size - 4, height: cfg.size - 4, borderRadius: (cfg.size - 4) / 2 }} />
                    </LinearGradient>
                  </View>

                  <Text style={styles.podiumName} numberOfLines={1}>{lb.name}</Text>
                  <Text style={styles.podiumXP}>⭐ {lb.xp.toLocaleString()}</Text>

                  {/* Podium block */}
                  <LinearGradient colors={cfg.gradient} style={[styles.podiumBlock, { height: cfg.height }]}>
                    <Text style={styles.podiumRankText}>{cfg.label}</Text>
                  </LinearGradient>
                </View>
              );
            })}
          </Animated.View>
        )}

        {/* Rankings list */}
        <View style={styles.rankSection}>
          <Text style={styles.rankTitle}>🎖️ All Rankings</Text>

          {rest.map((lb, index) => {
            const rank = index + 4;
            const isCurrentUser = user && user.name === lb.name;
            return (
              <Animated.View
                key={lb._id || `lb-${index}`}
                entering={FadeInLeft.delay(index * 80).springify()}
                style={[styles.rankRow, isCurrentUser && styles.rankRowMe]}
              >
                {/* Rank number */}
                <View style={[styles.rankNumBubble, isCurrentUser && { backgroundColor: Colors.purple }]}>
                  <Text style={[styles.rankNumText, isCurrentUser && { color: '#FFF' }]}>#{rank}</Text>
                </View>

                {/* Avatar */}
                <View style={[styles.rankAvatarRing, { borderColor: isCurrentUser ? Colors.purple : Colors.green }]}>
                  <Image source={getAvatar(lb.avatar)} style={styles.rankAvatar} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.rankName, isCurrentUser && { color: Colors.purple }]}>
                    {lb.name}{isCurrentUser ? ' 👋 (You!)' : ''}
                  </Text>
                  <Text style={styles.rankLevel}>{getTier(lb.level)} League</Text>
                </View>

                {/* XP chip */}
                <View style={[styles.xpChip, isCurrentUser && { backgroundColor: Colors.purpleLight, borderColor: Colors.purple }]}>
                  <Text style={[styles.xpChipText, isCurrentUser && { color: Colors.purple }]}>
                    ⭐ {lb.xp.toLocaleString()}
                  </Text>
                </View>
              </Animated.View>
            );
          })}

          {leaderboard.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48 }}>🚀</Text>
              <Text style={styles.emptyText}>Be the first champion!</Text>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <MascotAssistant message="You can reach the top! 🏆" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },

  header: { paddingTop: 60, paddingHorizontal: 24, marginBottom: 16 },
  title: { fontFamily: Fonts.heading, fontSize: 36, color: '#FFFFFF' },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  podiumArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 0,
    gap: 8,
    minHeight: 280,
  },
  podiumSlot: { alignItems: 'center', flex: 1 },
  podiumCrown: { fontSize: 32, marginBottom: 6 },
  podiumAvatarWrap: { borderWidth: 4, marginBottom: 8 },
  podiumAvatarGrad: { justifyContent: 'center', alignItems: 'center' },
  podiumName: { fontFamily: Fonts.body, fontSize: 13, color: '#FFFFFF', textAlign: 'center', marginBottom: 2 },
  podiumXP: { fontFamily: Fonts.bodySemi, fontSize: 12, color: Colors.yellow, marginBottom: 8 },
  podiumBlock: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  podiumRankText: { fontFamily: Fonts.heading, fontSize: 16, color: '#FFFFFF' },

  rankSection: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    paddingTop: 28,
    minHeight: 300,
    marginTop: 8,
  },
  rankTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 20 },

  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: Radius.xl,
    marginBottom: 12,
    borderWidth: 2.5,
    borderColor: 'transparent',
    gap: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 16px rgba(0,0,0,0.06)' } : { ...Shadow.soft }),
  },
  rankRowMe: { borderColor: Colors.purple, backgroundColor: Colors.purpleLight },
  rankNumBubble: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.bgMuted,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#E5E7EB',
  },
  rankNumText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMid },
  rankAvatarRing: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, overflow: 'hidden' },
  rankAvatar: { width: 46, height: 46, borderRadius: 23 },
  rankName: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textDark },
  rankLevel: { fontFamily: Fonts.bodyReg, fontSize: 12, color: Colors.textMid, marginTop: 2 },

  xpChip: {
    backgroundColor: Colors.yellowLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 2,
    borderColor: Colors.yellow,
  },
  xpChipText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.yellowDark },

  emptyState: { alignItems: 'center', padding: 40, gap: 12 },
  emptyText: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.textMid },
});
