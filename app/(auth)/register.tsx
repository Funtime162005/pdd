import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Image, Platform, ScrollView } from 'react-native';
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
  wrapper: { marginBottom: 16 },
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
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleLight,
  },
});

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    setIsLoading(true);
    try {
      await register(email, password, name);
      router.replace('/language-selection');
    } catch (err: any) {
      if (err.message.includes('auth/email-already-in-use')) {
        alert('Registration failed: Email already in use.');
      } else {
        alert('Registration failed: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#EDE9FE', '#D1FAE5', '#FEF3C7']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      {/* Mascot greeting */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.mascotPeek}>
        <View style={styles.mascotBubble}>
          <Text style={styles.mascotBubbleText}>Your adventure awaits! 🌟</Text>
        </View>
        <Image source={require('../../assets/images/langsphere_logo.png')} style={{ width: 80, height: 80, borderRadius: 40 }} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.card}>
        <Text style={styles.title}>Join the Fun! 🎉</Text>
        <Text style={styles.subtitle}>Create your learning account</Text>

        <FunInput label="Your Name" icon="🧒" placeholder="What's your name?" value={name} onChangeText={setName} />
        <FunInput label="Email Address" icon="📧" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <FunInput label="Password" icon="🔒" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />

        <Animated.View style={buttonStyle}>
          <Pressable
            style={styles.registerBtn}
            onPress={handleRegister}
            onPressIn={() => { buttonScale.value = withSpring(0.94, { damping: 10 }); }}
            onPressOut={() => { buttonScale.value = withSpring(1, { damping: 10 }); }}
            disabled={isLoading}
          >
            <LinearGradient colors={Colors.gradPurple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.registerBtnGrad}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.registerBtnText}>Create Account ✨</Text>}
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Pressable style={styles.linkBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.linkText}>Already a member? <Text style={styles.linkBold}>Sign in 🚀</Text></Text>
        </Pressable>

      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  mascotPeek: { alignItems: 'center', marginBottom: 10 },
  mascotBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: Colors.purple,
    marginBottom: 8,
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
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center', marginBottom: 24 },
  registerBtn: {
    borderRadius: Radius.pill,
    marginTop: 4,
    marginBottom: 4,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 6px 20px rgba(168,85,247,0.4)' } : { ...Shadow.purple }),
  },
  registerBtnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: Radius.pill },
  registerBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1.5, backgroundColor: '#E5E7EB' },
  dividerText: { fontFamily: Fonts.bodyReg, color: Colors.textLight, paddingHorizontal: 12, fontSize: 14 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E5E7EB',
    padding: 14, borderRadius: Radius.md,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' } : { ...Shadow.soft }),
  },
  googleBtnText: { fontFamily: Fonts.bodySemi, color: Colors.textMid, fontSize: 16 },
  linkBtn: { marginTop: 20, alignItems: 'center' },
  linkText: { fontFamily: Fonts.bodyReg, color: Colors.textMid, fontSize: 14 },
  linkBold: { fontFamily: Fonts.body, color: Colors.purple },
});
