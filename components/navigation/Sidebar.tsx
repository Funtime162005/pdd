import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
  withRepeat, withSequence, withTiming, Easing
} from 'react-native-reanimated';
import { Colors, Fonts, Radius, Shadow } from '../KidsTheme';

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

const navItems = [
  { name: 'Learn', icon: '📚', route: '/', activeColor: Colors.green, activeGrad: ['#22C55E', '#16A34A'] as [string, string] },
  { name: 'Games', icon: '🎮', route: '/games', activeColor: Colors.purple, activeGrad: ['#A855F7', '#7C3AED'] as [string, string] },
  { name: 'Friends', icon: '🌍', route: '/two', activeColor: Colors.sky, activeGrad: ['#38BDF8', '#0EA5E9'] as [string, string] },
  { name: 'Ranks', icon: '🏆', route: '/leaderboard', activeColor: Colors.yellow, activeGrad: ['#FACC15', '#F59E0B'] as [string, string] },
  { name: 'Culture', icon: '🏛️', route: '/culture', activeColor: Colors.orange, activeGrad: ['#FB923C', '#EA580C'] as [string, string] },
  { name: 'Me', icon: '⭐', route: '/profile', activeColor: Colors.pink, activeGrad: ['#F472B6', '#EC4899'] as [string, string] },
];

function NavItem({ item, isActive, onPress }: any) {
  const scale = useSharedValue(1);
  const ty = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: ty.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 10 });
          ty.value = withSpring(-2, { damping: 10 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10 });
          ty.value = withSpring(0, { damping: 10 });
        }}
        style={[styles.navItem, isActive && styles.navItemActive]}
      >
        {isActive && (
          <LinearGradient
            colors={item.activeGrad}
            style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
          />
        )}
        <Text style={[styles.navIcon, isActive && { fontSize: 24 }]}>{item.icon}</Text>
        <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.name}</Text>

        {/* Active indicator dot */}
        {isActive && <View style={[styles.activeDot, { backgroundColor: '#FFFFFF' }]} />}
      </Pressable>
    </Animated.View>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const getAvatar = (key: string) => avatars[key] || avatars.tiger;

  const monkeyY = useSharedValue(0);
  useEffect(() => {
    monkeyY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);
  const monkeyStyle = useAnimatedStyle(() => ({ transform: [{ translateY: monkeyY.value }] }));

  return (
    <View style={styles.sidebar}>
      {/* Rainbow top bar */}
      <LinearGradient
        colors={['#22C55E', '#38BDF8', '#A855F7', '#F472B6']}
        style={styles.topRainbow}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      />

      {/* Brand + Mascot */}
      <View style={styles.brandRow}>
        <Animated.View style={[styles.mascotCircle, monkeyStyle]}>
          <Image source={require('../../assets/images/langsphere_logo.png')} style={{ width: '100%', height: '100%', borderRadius: 26 }} />
        </Animated.View>
        <View>
          <Text style={styles.brandTitle}>Langsphere AI</Text>
          <Text style={styles.brandTagline}>Learn. Speak. Explore. Shine.</Text>
        </View>
      </View>

      {/* User card */}
      {user && (
        <View style={styles.userCard}>
          <LinearGradient colors={['#EDE9FE', '#F0F9FF']} style={[StyleSheet.absoluteFill, { borderRadius: Radius.lg }]} />
          <View style={[styles.userAvatarRing]}>
            <Image source={getAvatar(user.avatar || 'tiger')} style={styles.userAvatar} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name === '[object Object]' ? 'Champion' : user.name}
            </Text>
            <Text style={styles.userLevel} numberOfLines={1}>
              {user.level?.includes('Pro') ? '👑' : user.level?.includes('Intermediate') ? '⚡' : '🌱'} {user.level || 'Beginner'}
            </Text>
          </View>
        </View>
      )}

      {/* XP & Streak */}
      {user && (
        <View style={styles.statsBar}>
          <View style={[styles.statPill, { backgroundColor: Colors.yellowLight, borderColor: Colors.yellow }]}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
            <Text style={[styles.statPillText, { color: Colors.yellowDark }]}>{user.xp.toLocaleString()}</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: Colors.orangeLight, borderColor: Colors.orange }]}>
            <Text style={{ fontSize: 16 }}>🔥</Text>
            <Text style={[styles.statPillText, { color: Colors.orangeDark }]}>{user.streak}d</Text>
          </View>
        </View>
      )}

      {/* XP progress bar */}
      {user && (
        <View style={styles.xpBarWrapper}>
          <View style={styles.xpBarTrack}>
            <LinearGradient
              colors={['#22C55E', '#38BDF8']}
              style={[styles.xpBarFill, { width: `${Math.min((user.xp / 500) * 100, 100)}%` as any }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      )}

      {/* Nav items */}
      <View style={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.route;
          return (
            <NavItem
              key={item.route}
              item={item}
              isActive={isActive}
              onPress={() => router.push(item.route as any)}
            />
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      {/* Logout */}
      <Pressable onPress={async () => {
        await logout();
        if (typeof window !== 'undefined') window.location.href = '/';
        else router.replace('/');
      }} style={styles.logoutBtn}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
    height: '100%',
    borderRightWidth: 3,
    borderColor: Colors.greenLight,
    ...(Platform.OS === 'web' ? { boxShadow: '4px 0px 24px rgba(34,197,94,0.1)' } : {}),
  },
  topRainbow: { height: 6, width: '100%' },

  brandRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, marginTop: 8 },
  mascotCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.yellowLight,
    borderWidth: 3, borderColor: Colors.yellow,
    justifyContent: 'center', alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(250,204,21,0.4)' } : { ...Shadow.yellow }),
  },
  mascotEmoji: { fontSize: 28 },
  brandName: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark },
  brandTagline: { fontFamily: Fonts.bodyReg, fontSize: 12, color: Colors.textMid },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 2.5,
    borderColor: Colors.purple + '40',
    gap: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  userAvatarRing: { width: 44, height: 44, borderRadius: 22, borderWidth: 2.5, borderColor: Colors.purple, overflow: 'hidden' },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textDark },
  userLevel: { fontFamily: Fonts.bodyReg, fontSize: 11, color: Colors.purple },

  statsBar: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 10 },
  statPill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 2 },
  statPillText: { fontFamily: Fonts.body, fontSize: 13 },

  xpBarWrapper: { paddingHorizontal: 12, marginBottom: 16 },
  xpBarTrack: { height: 10, backgroundColor: Colors.greenLight, borderRadius: 5, overflow: 'hidden', borderWidth: 1.5, borderColor: Colors.green + '40' },
  xpBarFill: { height: '100%', borderRadius: 5 },

  nav: { paddingHorizontal: 10, gap: 4 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.xl,
    gap: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  navItemActive: {},
  navIcon: { fontSize: 22 },
  navLabel: { fontFamily: Fonts.bodySemi, fontSize: 15, color: Colors.textMid },
  navLabelActive: { fontFamily: Fonts.body, color: '#FFFFFF' },
  activeDot: { position: 'absolute', right: 14, width: 8, height: 8, borderRadius: 4 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    padding: 12,
    backgroundColor: Colors.redLight,
    borderRadius: Radius.xl,
    borderWidth: 2.5,
    borderColor: Colors.red + '50',
    gap: 10,
  },
  logoutIcon: { fontSize: 20 },
  logoutText: { fontFamily: Fonts.body, fontSize: 15, color: Colors.red },
});
