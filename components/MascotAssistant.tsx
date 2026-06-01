import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Fonts, Radius, Shadow } from './KidsTheme';

interface MascotAssistantProps {
  message?: string;
  bottomOffset?: number;
}

export default function MascotAssistant({ message = "Ready to learn today? 🚀", bottomOffset = 30 }: MascotAssistantProps) {
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const shadowScale = useSharedValue(1);
  const bubbleScale = useSharedValue(0);

  useEffect(() => {
    // Float up/down
    translateY.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Gentle sway
    rotation.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Shadow breathe
    shadowScale.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Bubble pop in
    bubbleScale.value = withSpring(1, { damping: 10, stiffness: 120 });
  }, []);

  const animatedMonkeyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const animatedShadowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shadowScale.value }, { scaleY: 0.25 }],
  }));

  const bubbleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(1.15, { damping: 8 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 8 }); };

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <Animated.View style={[styles.monkeyWrapper, animatedMonkeyStyle]}>
        {/* Speech bubble */}
        <Animated.View style={[styles.bubbleWrapper, bubbleAnimStyle]}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{message}</Text>
          </View>
          <View style={styles.bubbleTail} />
        </Animated.View>

        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <View style={styles.avatarRing}>
            <Image
              source={require('../assets/avatars/monkey.png')}
              style={styles.monkeyImage}
            />
          </View>
        </Pressable>
      </Animated.View>

      {/* Pulsing ground shadow */}
      <Animated.View style={[styles.shadow, animatedShadowStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  monkeyWrapper: {
    alignItems: 'center',
    zIndex: 2,
  },
  bubbleWrapper: {
    position: 'absolute',
    top: -70,
    right: 110,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 2.5,
    borderColor: Colors.purple,
    maxWidth: 200,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 16px rgba(168,85,247,0.25)' }
      : { ...Shadow.purple }),
  },
  bubbleText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textDark,
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -12,
    right: 6,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderTopColor: Colors.purple,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: Colors.yellow,
    backgroundColor: Colors.yellowLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 8px 24px rgba(250,204,21,0.5)' }
      : { ...Shadow.yellow }),
  },
  monkeyImage: {
    width: 98,
    height: 98,
    borderRadius: 49,
  },
  shadow: {
    width: 80,
    height: 80,
    backgroundColor: Colors.purple,
    borderRadius: 40,
    position: 'absolute',
    bottom: -20,
    zIndex: 1,
    opacity: 0.2,
    ...(Platform.OS === 'web' ? { filter: 'blur(10px)' } : {}),
  },
});
