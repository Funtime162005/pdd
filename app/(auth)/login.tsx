import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';

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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const userData = await login(email, password);
      if (userData && userData.xp > 0) {
        router.replace('/(tabs)');
      } else {
        router.replace('/language-selection');
      }
    } catch (err: any) {
      if (err.message.includes('auth/invalid-credential')) {
        alert('Login failed: Invalid email or password.');
      } else {
        alert('Login failed: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <LinearGradient colors={['#D1FAE5', '#FEF3C7', '#EDE9FE']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      {/* Mascot peeking from top */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.mascotPeek}>
        <View style={styles.mascotBubble}>
          <Text style={styles.mascotBubbleText}>Welcome back, superstar! 🌟</Text>
        </View>
        <Image source={require('../../assets/images/langsphere_logo.png')} style={{ width: 80, height: 80, borderRadius: 40 }} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.card}>

        <Text style={styles.title}>Welcome Back! 👋</Text>
        <Text style={styles.subtitle}>Jump back into your adventure</Text>

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
            disabled={isLoading}
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

        {/* Register link */}
        <Pressable style={styles.linkBtn} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>New here? <Text style={styles.linkBold}>Create account ✨</Text></Text>
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
