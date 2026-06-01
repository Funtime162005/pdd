import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const ALL_MODULES = [
  { id: 'foundations', label: 'Foundations', icon: '🌱' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'vocabulary', label: 'Vocabulary', icon: '🔤' },
  { id: 'communication', label: 'Communication', icon: '🗣️' },
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'pronunciation', label: 'Pronunciation', icon: '🎙️' },
  { id: 'assessment', label: 'Assessment', icon: '📝' },
];

export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  if (!user) return <Redirect href="/" />;

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const match = user.level?.match(/Level (\d+)/);
  const currentLevelNum = match ? parseInt(match[1], 10) : 1;
  const currentTier = user.level?.split(' - ')[0] || 'Beginner';

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0FDF4', '#FEFCE8']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={styles.headerTitle}>Parent Dashboard 📊</Text>
          <Text style={styles.headerSub}>Monitoring your superstar's progress!</Text>
        </Animated.View>

        {/* Student Overview Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.card}>
          <View style={styles.profileRow}>
            <Image source={require('../../assets/images/langsphere_logo.png')} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.studentName}>{user.name}</Text>
              <Text style={styles.studentEmail}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statValue}>{currentTier}</Text>
              <Text style={styles.statLabel}>Current Tier</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>📈</Text>
              <Text style={styles.statValue}>Lvl {currentLevelNum}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{user.streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{user.xp || 0}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
          </View>
        </Animated.View>

        {/* Module Progress Card */}
        <Animated.View entering={FadeInUp.delay(300)} style={[styles.card, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Level {currentLevelNum} Progress 🚀</Text>
          <Text style={styles.sectionSub}>Modules completed to unlock the next level:</Text>
          
          <View style={styles.modulesList}>
            {ALL_MODULES.map((mod, i) => {
              const isCompleted = user.completedModules?.includes(mod.id);
              return (
                <View key={mod.id} style={[styles.moduleRow, isCompleted && styles.moduleRowCompleted]}>
                  <View style={styles.moduleIconBox}>
                    <Text style={styles.moduleIcon}>{mod.icon}</Text>
                  </View>
                  <Text style={[styles.moduleLabel, isCompleted && styles.moduleLabelCompleted]}>
                    {mod.label}
                  </Text>
                  <View style={styles.statusBadge}>
                    {isCompleted ? (
                      <Text style={styles.statusBadgeIcon}>✅</Text>
                    ) : (
                      <Text style={styles.statusBadgeIcon}>⏳</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInUp.delay(400)} style={[styles.logoutWrapper, buttonStyle]}>
          <Pressable
            style={styles.logoutBtn}
            onPress={handleLogout}
            onPressIn={() => { buttonScale.value = withSpring(0.95, { damping: 10 }); }}
            onPressOut={() => { buttonScale.value = withSpring(1, { damping: 10 }); }}
          >
            <LinearGradient colors={['#EF4444', '#B91C1C']} style={styles.logoutGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.logoutText}>Sign Out of Parent Portal</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: Colors.textDark,
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: Fonts.bodyReg,
    fontSize: 16,
    color: Colors.textMid,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: 24,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(0,0,0,0.06)' } : { ...Shadow.card }),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.green,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  studentName: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    color: Colors.textDark,
  },
  studentEmail: {
    fontFamily: Fonts.bodyReg,
    fontSize: 14,
    color: Colors.textMid,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.bgMuted,
    borderRadius: Radius.lg,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontFamily: Fonts.bodySemi,
    fontSize: 18,
    color: Colors.textDark,
  },
  statLabel: {
    fontFamily: Fonts.bodyReg,
    fontSize: 13,
    color: Colors.textMid,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    color: Colors.textDark,
    marginBottom: 4,
  },
  sectionSub: {
    fontFamily: Fonts.bodyReg,
    fontSize: 14,
    color: Colors.textMid,
    marginBottom: 20,
  },
  modulesList: {
    gap: 12,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moduleRowCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  moduleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 4px rgba(0,0,0,0.05)' } : { elevation: 1 }),
  },
  moduleIcon: {
    fontSize: 20,
  },
  moduleLabel: {
    flex: 1,
    fontFamily: Fonts.bodySemi,
    fontSize: 16,
    color: Colors.textDark,
  },
  moduleLabelCompleted: {
    color: Colors.green,
  },
  statusBadge: {
    padding: 4,
  },
  statusBadgeIcon: {
    fontSize: 18,
  },
  logoutWrapper: {
    width: '100%',
    maxWidth: 500,
    marginTop: 32,
  },
  logoutBtn: {
    borderRadius: Radius.pill,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 6px 16px rgba(239,68,68,0.3)' } : { elevation: 4 }),
  },
  logoutGrad: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    color: '#fff',
    letterSpacing: 0.5,
  },
});
