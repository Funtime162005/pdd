import { Tabs, Redirect } from 'expo-router';
import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Sidebar from '../../components/navigation/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Colors, Fonts } from '../../components/KidsTheme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function TabBarIcon({ emoji, focused, color }: { emoji: string; focused: boolean; color: string }) {
  const scale = useSharedValue(focused ? 1.15 : 1);

  if (focused) {
    scale.value = withSpring(1.2, { damping: 8 });
  } else {
    scale.value = withSpring(1, { damping: 8 });
  }

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.iconWrap, focused && { backgroundColor: color + '22' }]}>
      <Animated.Text style={[styles.icon, style, focused && { fontSize: 26 }]}>{emoji}</Animated.Text>
      {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
    </View>
  );
}

const tabColors = {
  index: Colors.green,
  games: Colors.purple,
  two: Colors.sky,
  leaderboard: Colors.yellow,
  culture: Colors.orange,
  profile: Colors.pink,
};

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return <Redirect href="/" />;
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Colors.bg }}>
      {isDesktop && <Sidebar />}

      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.green,
            tabBarInactiveTintColor: Colors.textLight,
            tabBarStyle: isDesktop ? { display: 'none' } : {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 0,
              height: 88,
              paddingBottom: 18,
              paddingTop: 8,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              ...(Platform.OS === 'web'
                ? { boxShadow: '0px -6px 28px rgba(34,197,94,0.18)' }
                : {
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: -6 },
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 20,
                }),
            },
            tabBarLabelStyle: {
              fontFamily: Fonts.bodySemi,
              fontSize: 10,
              marginTop: 2,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Learn',
              tabBarActiveTintColor: tabColors.index,
              tabBarIcon: ({ focused }) => <TabBarIcon emoji="📚" focused={focused} color={tabColors.index} />,
            }}
          />
          <Tabs.Screen
            name="games"
            options={{
              title: 'Games',
              tabBarActiveTintColor: tabColors.games,
              tabBarIcon: ({ focused }) => <TabBarIcon emoji="🎮" focused={focused} color={tabColors.games} />,
            }}
          />
          <Tabs.Screen
            name="two"
            options={{
              title: 'Friends',
              tabBarActiveTintColor: tabColors.two,
              tabBarIcon: ({ focused }) => <TabBarIcon emoji="🌍" focused={focused} color={tabColors.two} />,
            }}
          />
          <Tabs.Screen
            name="leaderboard"
            options={{
              title: 'Ranks',
              tabBarActiveTintColor: tabColors.leaderboard,
              tabBarIcon: ({ focused }) => <TabBarIcon emoji="🏆" focused={focused} color={tabColors.leaderboard} />,
            }}
          />
          <Tabs.Screen
            name="culture"
            options={{
              title: 'Culture',
              tabBarActiveTintColor: tabColors.culture,
              tabBarIcon: ({ focused }) => <TabBarIcon emoji="🏛️" focused={focused} color={tabColors.culture} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Me',
              tabBarActiveTintColor: tabColors.profile,
              tabBarIcon: ({ focused }) => <TabBarIcon emoji="⭐" focused={focused} color={tabColors.profile} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 22,
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
