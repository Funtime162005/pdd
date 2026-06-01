import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import MascotAssistant from '../../components/MascotAssistant';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle,
  withSpring, withRepeat, withSequence, withTiming, Easing
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';

const avatars: Record<string, any> = {
  tiger: require('../../assets/avatars/tiger.png'),
  panda: require('../../assets/avatars/panda.png'),
  elephant: require('../../assets/avatars/elephant.png'),
  lion: require('../../assets/avatars/lion.png'),
  koala: require('../../assets/avatars/koala.png'),
  giraffe: require('../../assets/avatars/giraffe.png'),
  penguin: require('../../assets/avatars/penguin.png'),
};
type AvatarKey = keyof typeof avatars;

const BADGES = [
  { icon: '🥇', name: 'Quick Learner', condition: (u: any) => u.xp >= 100, color: Colors.yellowLight, border: Colors.yellow },
  { icon: '🔥', name: '5 Day Streak', condition: (u: any) => u.streak >= 5, color: Colors.orangeLight, border: Colors.orange },
  { icon: '🔥', name: '3 Day Streak', condition: (u: any) => u.streak >= 3, color: Colors.orangeLight, border: Colors.orange },
  { icon: '🧠', name: 'Brain Master', condition: (u: any) => u.level?.includes('Intermediate') || u.level?.includes('Pro'), color: Colors.purpleLight, border: Colors.purple },
  { icon: '🏆', name: 'Champion', condition: (u: any) => u.level?.includes('Pro'), color: Colors.skyLight, border: Colors.sky },
];

const TIER_GRADIENT: Record<string, [string, string]> = {
  Beginner: ['#22C55E', '#16A34A'],
  Intermediate: ['#0284C7', '#0EA5E9'],
  Pro: ['#7C3AED', '#A855F7'],
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile, setLearningLanguage } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name === '[object Object]' ? '' : (user?.name || ''));
  const [editAvatar, setEditAvatar] = useState<AvatarKey>((user?.avatar as AvatarKey) || 'tiger');
  const [editLanguage, setEditLanguage] = useState(user?.learningLanguage || 'tamil');

  const saveScale = useSharedValue(1);
  const avatarBounce = useSharedValue(1);
  const streakFlame = useSharedValue(1);

  useEffect(() => {
    avatarBounce.value = withRepeat(withSequence(withSpring(1.05, { damping: 6 }), withSpring(1, { damping: 6 })), -1, true);
    streakFlame.value = withRepeat(withSequence(withTiming(1.15, { duration: 700, easing: Easing.inOut(Easing.ease) }), withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })), -1, true);
  }, []);

  const saveStyle = useAnimatedStyle(() => ({ transform: [{ scale: saveScale.value }] }));
  const avatarStyle = useAnimatedStyle(() => ({ transform: [{ scale: avatarBounce.value }] }));
  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: streakFlame.value }] }));

  if (!user) return null;

  const currentAvatar = (user.avatar as AvatarKey) || 'tiger';
  const displayName = user.name === '[object Object]' ? 'Champion' : (user.name || 'Champion');
  const completedCount = (user.completedModules || []).length;
  const progressPct = (completedCount / 4) * 100;
  const earnedBadges = BADGES.filter(b => b.condition(user)).slice(0, 5);
  const tier = user.level?.includes('Pro') ? 'Pro' : user.level?.includes('Intermediate') ? 'Intermediate' : 'Beginner';
  const tierGrad = TIER_GRADIENT[tier] || TIER_GRADIENT.Beginner;

  const handleSave = async () => {
    await updateProfile(editName, editAvatar);
    if (setLearningLanguage && editLanguage !== user.learningLanguage) {
      await setLearningLanguage(editLanguage);
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#EDE9FE', '#F0F9FF', '#FFF9F0']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Character Hero Card */}
        <Animated.View entering={FadeInUp.springify()} style={styles.heroCard}>
          <LinearGradient colors={[...tierGrad] as [string, string]} style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]} />
          {/* Decorative blobs */}
          <View style={{ position: 'absolute', top: -30, right: -20, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.12)' }} />
          <View style={{ position: 'absolute', bottom: -20, left: -10, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.08)' }} />

          {/* Edit button top right */}
          <View style={styles.heroTopRow}>
            <View style={{ flex: 1 }} />
            <Pressable onPress={() => setIsEditing(!isEditing)} style={styles.editBtn}>
              <Text style={styles.editBtnText}>{isEditing ? '✕ Cancel' : '✏️ Edit'}</Text>
            </Pressable>
          </View>

          {!isEditing ? (
            <>
              {/* Animated avatar */}
              <Animated.View style={[styles.avatarRing, avatarStyle]}>
                <Image source={avatars[currentAvatar] || avatars['tiger']} style={styles.avatarImg} />
                {/* Level badge overlay */}
                <View style={styles.levelDot}>
                  <Text style={styles.levelDotText}>{tier === 'Pro' ? '👑' : tier === 'Intermediate' ? '⚡' : '🌱'}</Text>
                </View>
              </Animated.View>
              <Text style={styles.heroName}>{displayName}</Text>
              <Text style={styles.heroEmail}>{user.email}</Text>
              <View style={styles.heroLevelPill}>
                <Text style={styles.heroLevelText}>🎮 {user.level || 'Beginner Phase'}</Text>
              </View>
            </>
          ) : (
            <View style={styles.editContainer}>
              <Text style={styles.editLabel}>Pick Your Avatar 🎭</Text>
              <View style={styles.avatarGrid}>
                {(Object.keys(avatars) as AvatarKey[]).map(key => (
                  <Pressable key={key} onPress={() => setEditAvatar(key)}
                    style={[styles.avatarOption, editAvatar === key && styles.avatarOptionSelected]}>
                    <Image source={avatars[key]} style={styles.avatarOptionImg} />
                    {editAvatar === key && <View style={styles.avatarCheck}><Text style={{ fontSize: 12 }}>✓</Text></View>}
                  </Pressable>
                ))}
              </View>
              
              <Text style={styles.editLabel}>Target Language 🌍</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {['tamil', 'hindi', 'telugu', 'malayalam', 'kannada', 'spanish', 'french', 'german'].map(l => (
                  <Pressable key={l} onPress={() => setEditLanguage(l)} style={{ backgroundColor: editLanguage === l ? Colors.purple : 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, borderWidth: 2, borderColor: editLanguage === l ? '#FFF' : 'rgba(255,255,255,0.3)' }}>
                    <Text style={{ fontFamily: Fonts.bodySemi, color: '#FFF', textTransform: 'capitalize' }}>{l}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.editLabel}>Your Name ✏️</Text>
              <TextInput
                style={styles.nameInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your awesome name"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <Animated.View style={saveStyle}>
                <Pressable style={styles.saveBtn}
                  onPressIn={() => { saveScale.value = withSpring(0.95); }}
                  onPressOut={() => { saveScale.value = withSpring(1); }}
                  onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save Changes ✨</Text>
                </Pressable>
              </Animated.View>
            </View>
          )}
        </Animated.View>

        {!isEditing && (
          <>
            {/* Stats row */}
            <Animated.View entering={FadeInUp.delay(150).springify()} style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: Colors.orangeLight, borderColor: Colors.orange }]}>
                <Animated.Text style={[styles.statEmoji, flameStyle]}>🔥</Animated.Text>
                <Text style={[styles.statValue, { color: Colors.orangeDark }]}>{user.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: Colors.yellowLight, borderColor: Colors.yellow }]}>
                <Text style={styles.statEmoji}>⭐</Text>
                <Text style={[styles.statValue, { color: Colors.yellowDark }]}>{user.xp.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: Colors.skyLight, borderColor: Colors.sky }]}>
                <Text style={styles.statEmoji}>📚</Text>
                <Text style={[styles.statValue, { color: Colors.skyDark }]}>{completedCount}</Text>
                <Text style={styles.statLabel}>Islands</Text>
              </View>
            </Animated.View>

            {/* Progress card */}
            <Animated.View entering={FadeInUp.delay(250).springify()} style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>🗺️ Learning Map</Text>
                <Text style={styles.progressPct}>{progressPct.toFixed(0)}%</Text>
              </View>
              <Text style={styles.progressLevel}>Phase: {user.level || 'Beginner Phase'}</Text>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={[...tierGrad] as [string, string]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progressPct}%` as any }]}
                />
              </View>
              <Text style={styles.progressSub}>{completedCount} of 4 islands conquered! 🏝️</Text>
            </Animated.View>

            {/* Badges */}
            <Animated.View entering={FadeInUp.delay(350).springify()} style={styles.section}>
              <Text style={styles.sectionTitle}>🏅 My Badge Collection</Text>
              {earnedBadges.length > 0 ? (
                <View style={styles.badgesGrid}>
                  {earnedBadges.map((badge, i) => (
                    <Animated.View key={i} entering={FadeInRight.delay(i * 100).springify()}>
                      <View style={[styles.badge, { backgroundColor: badge.color, borderColor: badge.border }]}>
                        <Text style={styles.badgeIcon}>{badge.icon}</Text>
                        <Text style={styles.badgeName}>{badge.name}</Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              ) : (
                <View style={styles.noBadges}>
                  <Text style={{ fontSize: 44, marginBottom: 10 }}>🎯</Text>
                  <Text style={styles.noBadgesText}>Complete lessons to unlock badges!</Text>
                </View>
              )}
            </Animated.View>

            {/* Logout */}
            <Animated.View entering={FadeInUp.delay(450).springify()}>
              <Pressable onPress={async () => {
                await logout();
                if (typeof window !== 'undefined') window.location.href = '/';
                else router.replace('/');
              }} style={styles.logoutBtn}>
                <Text style={styles.logoutEmoji}>🚪</Text>
                <Text style={styles.logoutText}>Log Out</Text>
              </Pressable>
            </Animated.View>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  heroCard: {
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    minHeight: 220,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 16px 40px rgba(124,58,237,0.35)' } : { ...Shadow.purple }),
  },
  heroTopRow: { flexDirection: 'row', width: '100%', marginBottom: 16 },
  editBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.pill, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  editBtnText: { fontFamily: Fonts.bodySemi, fontSize: 14, color: '#FFFFFF' },

  avatarRing: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 5, borderColor: Colors.yellow,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14, position: 'relative',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(250,204,21,0.6)' } : { ...Shadow.yellow }),
  },
  avatarImg: { width: 108, height: 108, borderRadius: 54 },
  levelDot: { position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: Colors.yellow },
  levelDotText: { fontSize: 16 },

  heroName: { fontFamily: Fonts.heading, fontSize: 28, color: '#FFFFFF', marginBottom: 4 },
  heroEmail: { fontFamily: Fonts.bodyReg, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 14 },
  heroLevelPill: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.pill, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)' },
  heroLevelText: { fontFamily: Fonts.body, fontSize: 14, color: '#FFFFFF' },

  editContainer: { width: '100%', alignItems: 'center' },
  editLabel: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.9)', alignSelf: 'flex-start', marginBottom: 10, marginTop: 14 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 8 },
  avatarOption: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: 'transparent' },
  avatarOptionSelected: { borderColor: Colors.yellow },
  avatarOptionImg: { width: 58, height: 58, borderRadius: 29 },
  avatarCheck: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.yellow, borderRadius: 10, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  nameInput: { width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', borderRadius: Radius.md, padding: 14, fontSize: 16, fontFamily: Fonts.bodyReg, color: '#FFFFFF', marginBottom: 16 },
  saveBtn: { backgroundColor: Colors.yellow, borderRadius: Radius.pill, paddingVertical: 14, paddingHorizontal: 40 },
  saveBtnText: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textDark },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, overflow: 'hidden' },
  statCard: { flex: 1, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 16, borderRadius: Radius.xl, borderWidth: 2.5, overflow: 'hidden' },
  statEmoji: { fontSize: 28, marginBottom: 4 },
  statValue: { fontFamily: Fonts.heading, fontSize: 22 },
  statLabel: { fontFamily: Fonts.bodyReg, fontSize: 11, color: Colors.textMid, marginTop: 2 },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.greenLight,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 6px 20px rgba(34,197,94,0.12)' } : { ...Shadow.soft }),
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  progressTitle: { fontFamily: Fonts.body, fontSize: 17, color: Colors.textDark },
  progressPct: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.green },
  progressLevel: { fontFamily: Fonts.bodyReg, fontSize: 13, color: Colors.textMid, marginBottom: 14 },
  progressTrack: { height: 20, backgroundColor: Colors.greenLight, borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', borderRadius: 10 },
  progressSub: { fontFamily: Fonts.bodyReg, fontSize: 13, color: Colors.textMid },

  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 14 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: {
    alignItems: 'center', padding: 18, borderRadius: Radius.lg,
    borderWidth: 2.5, width: 115,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.06)' } : { ...Shadow.soft }),
  },
  badgeIcon: { fontSize: 38, marginBottom: 8 },
  badgeName: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textDark, textAlign: 'center' },
  noBadges: { backgroundColor: '#FFFFFF', borderRadius: Radius.xl, padding: 30, alignItems: 'center', borderWidth: 2.5, borderColor: Colors.greenLight },
  noBadgesText: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textMid, textAlign: 'center' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.redLight, borderRadius: Radius.xl, padding: 18, gap: 10, borderWidth: 2.5, borderColor: Colors.red },
  logoutEmoji: { fontSize: 24 },
  logoutText: { fontFamily: Fonts.body, fontSize: 17, color: Colors.red },
});
