import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { isFirebaseConfigured, signInWithGoogleFirebase } from '../../utils/firebase';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';

const googleIconUri = `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'/%3E%3C/svg%3E`;

function FunInput({ label, icon, ...props }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={inputStyles.wrapper}>
      <Text style={inputStyles.label}>{icon} {label}</Text>
      <TextInput
        style={[inputStyles.input, focused && inputStyles.inputFocused]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={Colors.textLight}
        {...props}
      />
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: { marginBottom: 18 },
  label: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textDark, marginBottom: 8 },
  input: {
    backgroundColor: Colors.bgMuted,
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    borderRadius: Radius.md,
    padding: 16,
    fontSize: 16,
    fontFamily: Fonts.bodyReg,
    color: Colors.textDark,
  },
  inputFocused: {
    borderColor: Colors.green,
    backgroundColor: Colors.greenLight,
  },
});

export default function ParentLoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const userData = await login(email, password);
      if (userData) {
        router.replace('/(parent)/dashboard');
      }
    } catch (err: any) {
      alert('Login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGooglePress = async () => {
    setIsGoogleLoading(true);
    try {
      const firebaseUser = await signInWithGoogleFirebase();
      if (firebaseUser && firebaseUser.email) {
        const userData = await loginWithGoogle(firebaseUser.email, firebaseUser.displayName || firebaseUser.email.split('@')[0]);
        if (userData) {
          router.replace('/(parent)/dashboard');
        }
      }
    } catch (err: any) {
      alert('Google Sign-in failed: ' + err.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#D1FAE5', '#FEF3C7', '#EDE9FE']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      {/* Mascot peeking from top */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.mascotPeek}>
        <View style={styles.mascotBubble}>
          <Text style={styles.mascotBubbleText}>Hello, Parents! 👨‍👩‍👧</Text>
        </View>
        <Image source={require('../../assets/images/langsphere_logo.png')} style={{ width: 80, height: 80, borderRadius: 40 }} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.card}>

        <Text style={styles.title}>Parent Portal 📊</Text>
        <Text style={styles.subtitle}>Log in to view your child's progress</Text>

        <FunInput
          label="Email Address"
          icon="📧"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <FunInput
          label="Password"
          icon="🔒"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Sign In Button */}
        <Animated.View style={buttonStyle}>
          <Pressable
            style={styles.loginBtn}
            onPress={handleLogin}
            onPressIn={() => { buttonScale.value = withSpring(0.94, { damping: 10 }); }}
            onPressOut={() => { buttonScale.value = withSpring(1, { damping: 10 }); }}
            disabled={isLoading || isGoogleLoading}
          >
            <LinearGradient colors={Colors.gradGreen} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtnGrad}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginBtnText}>Sign In 🚀</Text>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Button */}
        <Pressable
          style={[styles.googleBtn, (isLoading || isGoogleLoading) && { opacity: 0.6 }]}
          onPress={handleGooglePress}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <ActivityIndicator color={Colors.textMid} />
          ) : (
            <>
              <Image source={{ uri: googleIconUri }} style={{ width: 22, height: 22, marginRight: 12 }} />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        <Pressable style={styles.linkBtn} onPress={() => router.back()}>
          <Text style={styles.linkText}>Wait, I'm a student! <Text style={styles.linkBold}>Go Back ↩️</Text></Text>
        </Pressable>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  mascotPeek: {
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 10,
  },
  mascotBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: Colors.purple,
    marginBottom: 8,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(168,85,247,0.2)' } : {}),
  },
  mascotBubbleText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textDark },
  mascotEmoji: { fontSize: 52 },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.xl,
    padding: 28,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,1)',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 16px 48px rgba(0,0,0,0.1)' } : { ...Shadow.card }),
  },
  title: { fontFamily: Fonts.heading, fontSize: 30, color: Colors.textDark, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center', marginBottom: 28 },
  loginBtn: {
    borderRadius: Radius.pill,
    marginTop: 4,
    marginBottom: 4,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 6px 20px rgba(34,197,94,0.4)' } : { ...Shadow.green }),
  },
  loginBtnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: Radius.pill },
  loginBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1.5, backgroundColor: '#E5E7EB' },
  dividerText: { fontFamily: Fonts.bodyReg, color: Colors.textLight, paddingHorizontal: 12, fontSize: 14 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 14,
    borderRadius: Radius.md,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' } : { ...Shadow.soft }),
  },
  googleBtnText: { fontFamily: Fonts.bodySemi, color: Colors.textMid, fontSize: 16 },
  linkBtn: { marginTop: 20, alignItems: 'center' },
  linkText: { fontFamily: Fonts.bodyReg, color: Colors.textMid, fontSize: 14 },
  linkBold: { fontFamily: Fonts.body, color: Colors.purple },
});
