import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import { View, Image, ActivityIndicator, Animated } from 'react-native';
import 'react-native-reanimated';
import '../global.css';
import { AuthProvider } from '../context/AuthContext';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    FredokaOne_400Regular,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Hide the native splash immediately so our custom animated one can take over
      SplashScreen.hideAsync();
      
      // Keep the custom splash screen visible for 3 seconds, then fade out
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500, // smooth 0.5s fade
          useNativeDriver: true,
        }).start(() => {
          setShowSplash(false);
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFF9F0' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="language-selection" />
          <Stack.Screen name="assessment" />
          <Stack.Screen name="result" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(parent)" />
        </Stack>

        {showSplash && (
          <Animated.View style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: '#FFFFFF', 
            justifyContent: 'center', alignItems: 'center',
            opacity: fadeAnim,
            zIndex: 999 
          }}>
            <Image 
              source={require('../assets/images/langsphere_logo_padded.png')} 
              style={{ width: 250, height: 250 }} 
              resizeMode="contain" 
            />
            <ActivityIndicator size="large" color="#FF5722" style={{ marginTop: 20 }} />
          </Animated.View>
        )}
      </View>
    </AuthProvider>
  );
}
