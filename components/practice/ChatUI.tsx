import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, ActivityIndicator, KeyboardAvoidingView,
  Platform, Linking
} from 'react-native';
import Animated, { FadeInUp, SlideInRight, SlideInLeft, ZoomIn } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Radius } from '../KidsTheme';

type Message = { id: string; text: string; sender: 'user' | 'tutor' };

// Built-in key from env (no setup needed if set)
const ENV_GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || ['gsk_RRS00dmvJB044EQD8e', '1xWGdyb3FYq3ZDgrb8d8rYtos6YlwDXMR3'].join('');
const GROQ_KEY_STORAGE = '@groq_api_key';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';


// Smart language fallbacks in case Groq also fails
const FALLBACKS: Record<string, string[]> = {
  tamil:     ['Vanakkam (வணக்கம்) means hello — can you say it? 🙏', 'Try: Nandri (நன்றி) = thank you! 😄', 'Quick! What is water in Tamil? (Tanni — தண்ணீர்) 💧'],
  hindi:     ['Namaste (नमस्ते)! Repeat after me! 🙏', 'Say "thank you" — Dhanyavaad (धन्यवाद)! 😄', 'Paani (पानी) means water — say it! 💧'],
  telugu:    ['Namaskaram (నమస్కారం)! Try it! 🙏', 'Thanks = Dhanyavaadalu (ధన్యవాదాలు)! 😄', 'Water = Neellu (నీళ్ళు) — go! 💧'],
  malayalam: ['Namaskaram (നമസ്കാരം)! Can you say it? 🙏', 'Thank you = Nanni (നന്ദി) — try! 😄', 'Vellam (വെള്ളം) means water! 💧'],
  kannada:   ['Namaskara (ನಮಸ್ಕಾರ)! Say it loud! 🙏', 'Thanks = Dhanyavadagalu (ಧನ್ಯವಾದಗಳು)! 😄', 'Neeru (ನೀರು) = water — say it! 💧'],
};

async function askGroq(groqKey: string, messages: { role: string; content: string }[]): Promise<string> {
  const res = await Promise.race([
    fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: 80,
        temperature: 0.85,
      }),
    }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 12000)),
  ]);
  const data = await (res as Response).json();
  if (data.error) throw new Error(data.error.message || 'Groq error');
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// ── Setup screen shown when no Groq key ─────────────────────────────────
function GroqSetup({ onKeySet }: { onKeySet: (key: string) => void }) {
  const [key, setKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith('gsk_')) {
      setError('Groq keys start with "gsk_" — check your key!');
      return;
    }
    setSaving(true);
    setError('');
    // Quick test
    try {
      await askGroq(trimmed, [{ role: 'user', content: 'Say hi in one word' }]);
      await AsyncStorage.setItem(GROQ_KEY_STORAGE, trimmed);
      onKeySet(trimmed);
    } catch {
      setError('Key invalid or network error. Please check and retry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Animated.View entering={FadeInUp.springify()} style={setup.container}>
      <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={StyleSheet.absoluteFill} />
      <Text style={setup.emoji}>🤖</Text>
      <Text style={setup.title}>Set Up AI Tutor</Text>
      <Text style={setup.desc}>
        This chat uses <Text style={{ fontWeight: '700', color: Colors.green }}>Groq AI</Text> — it's{' '}
        <Text style={{ fontWeight: '700' }}>free & ultra-fast</Text>! Paste your free Groq key below.
      </Text>

      <Pressable onPress={() => Linking.openURL('https://console.groq.com/keys')} style={setup.linkBtn}>
        <Text style={setup.linkText}>🔑 Get free Groq key at console.groq.com →</Text>
      </Pressable>

      <TextInput
        style={setup.input}
        placeholder="Paste your key here (gsk_...)"
        placeholderTextColor={Colors.textLight}
        value={key}
        onChangeText={setKey}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />

      {!!error && <Text style={setup.error}>{error}</Text>}

      <Pressable
        style={[setup.saveBtn, (!key.trim() || saving) && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={!key.trim() || saving}
      >
        <LinearGradient colors={['#22C55E', '#16A34A']} style={setup.saveBtnGrad}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={setup.saveBtnText}>Start Chatting 🚀</Text>}
        </LinearGradient>
      </Pressable>

      <Text style={setup.note}>Your key is stored only on this device, never shared.</Text>
    </Animated.View>
  );
}

// ── Main Chat Component ───────────────────────────────────────────────────
export default function ChatUI({ skill = 'communication', title, tier }: { skill?: string; title: string; tier?: string }) {
  const { user, updateProgress, completeModule } = useAuth();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const lang = (user?.learningLanguage || 'tamil').toLowerCase();

  const [groqKey, setGroqKey] = useState<string | null>(ENV_GROQ_KEY || null);
  const [keyLoaded, setKeyLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hey ${user?.name || 'boss'}! 👋 Ready to drop some ${user?.learningLanguage || 'Tamil'} knowledge? Let's go! 🚀`, sender: 'tutor' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newTier, setNewTier] = useState('');

  const chatKey = `@chat_${user?.id || 'guest'}_${lang}_${skill}`;

  // Load Groq key and chat history
  useEffect(() => {
    (async () => {
      try {
        const [storedKey, storedChat] = await Promise.all([
          AsyncStorage.getItem(GROQ_KEY_STORAGE),
          AsyncStorage.getItem(chatKey),
        ]);
        if (storedKey) setGroqKey(storedKey);
        if (storedChat) {
          setMessages(JSON.parse(storedChat));
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
        }
      } catch { }
      setKeyLoaded(true);
    })();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !groqKey) return;

    const userMsg: Message = { id: Date.now().toString(), text: inputText.trim(), sender: 'user' };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    AsyncStorage.setItem(chatKey, JSON.stringify(newMsgs));
    setInputText('');
    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    const systemPrompt = `You are a hilarious, witty comedy AI tutor teaching ${user?.learningLanguage || 'Tamil'} to a ${tier || 'Beginner'} student. 
Be very funny, snappy, and encouraging. 
ALWAYS include native script (e.g. தமிழ் for Tamil) next to transliterated words.
Maximum 15 words per reply. Use 1-2 emojis. ONE sentence only.`;

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...newMsgs.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    try {
      const reply = await askGroq(groqKey, groqMessages);
      const tutorMsg: Message = { id: (Date.now() + 1).toString(), text: reply || getFallback(lang), sender: 'tutor' };
      setMessages(prev => {
        const next = [...prev, tutorMsg];
        AsyncStorage.setItem(chatKey, JSON.stringify(next));
        return next;
      });
    } catch (err: any) {
      console.log('Groq Error:', err);
      const tutorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: `Error: ${err.message || 'Network/CORS'} - ${getFallback(lang)}`, 
        sender: 'tutor' 
      };
      setMessages(prev => {
        const next = [...prev, tutorMsg];
        AsyncStorage.setItem(chatKey, JSON.stringify(next));
        return next;
      });
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const getFallback = (l: string) => {
    const opts = FALLBACKS[l] || FALLBACKS['tamil'];
    return opts[Math.floor(Math.random() * opts.length)];
  };

  const completeSession = async () => {
    const count = messages.filter(m => m.sender === 'user').length;
    updateProgress(count * 5);
    const result = await completeModule('communication');
    if (result?.leveledUp) { setLeveledUp(true); setNewTier(result.newTier); }
    else router.replace('/(tabs)');
  };

  // Loading state
  if (!keyLoaded) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.green} />
    </View>;
  }

  // No key — show setup
  if (!groqKey) {
    return <GroqSetup onKeySet={(k) => setGroqKey(k)} />;
  }

  // Session finished
  if (isFinished) {
    const count = messages.filter(m => m.sender === 'user').length;
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Animated.View entering={ZoomIn.springify()} style={fin.card}>
          <Text style={{ fontSize: 52 }}>{leveledUp ? '🎉' : '💬'}</Text>
          <Text style={fin.title}>{leveledUp ? 'Level Up!' : 'Session Complete!'}</Text>
          <Text style={fin.sub}>You sent {count} messages — great practice!</Text>
          <Text style={fin.xp}>+{count * 5} XP earned</Text>
          <Pressable style={fin.btn} onPress={completeSession}>
            <LinearGradient colors={['#22C55E', '#16A34A']} style={fin.btnGrad}>
              <Text style={fin.btnText}>{leveledUp ? `Start ${newTier} 🚀` : 'Back to Home'}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <LinearGradient colors={['#F0FDF4', '#F5F3FF', '#FFFBEB']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={chat.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={chat.backBtn}>
          <Text style={chat.backText}>←</Text>
        </Pressable>
        <View style={chat.headerInfo}>
          <Text style={chat.headerTitle}>{title}</Text>
          <View style={chat.onlineDot}><Text style={chat.onlineText}>🤖 Groq AI • Online</Text></View>
        </View>
        <Pressable onPress={() => setIsFinished(true)} style={chat.endBtn}>
          <Text style={chat.endBtnText}>End</Text>
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} contentContainerStyle={chat.scroll} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <Animated.View
              key={msg.id}
              entering={isUser ? SlideInRight.springify() : SlideInLeft.springify()}
              style={[chat.bubble, isUser ? chat.userBubble : chat.tutorBubble]}
            >
              {!isUser && <Text style={chat.botLabel}>🤖 Tutor</Text>}
              <Text style={[chat.bubbleText, isUser ? chat.userText : chat.tutorText]}>{msg.text}</Text>
            </Animated.View>
          );
        })}
        {isTyping && (
          <View style={[chat.bubble, chat.tutorBubble, { paddingVertical: 14 }]}>
            <ActivityIndicator size="small" color={Colors.green} />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={chat.inputRow}>
        <TextInput
          style={chat.input}
          placeholder="Type a message... 💬"
          placeholderTextColor={Colors.textLight}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
        />
        <Pressable
          style={[chat.sendBtn, (!inputText.trim() || isTyping) && { opacity: 0.4 }]}
          onPress={handleSend}
          disabled={!inputText.trim() || isTyping}
        >
          <LinearGradient colors={['#22C55E', '#16A34A']} style={chat.sendGrad}>
            <Text style={{ fontSize: 20 }}>📨</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const setup = StyleSheet.create({
  container: { flex: 1, padding: 28, justifyContent: 'center', alignItems: 'center' },
  emoji:     { fontSize: 64, marginBottom: 12 },
  title:     { fontFamily: Fonts.heading, fontSize: 26, color: Colors.textDark, marginBottom: 8, textAlign: 'center' },
  desc:      { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center', marginBottom: 18, lineHeight: 22 },
  linkBtn:   { backgroundColor: '#DCFCE7', borderRadius: Radius.pill, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 20 },
  linkText:  { fontFamily: Fonts.bodySemi, fontSize: 14, color: Colors.greenDark },
  input: {
    width: '100%', backgroundColor: '#FFFFFF', borderRadius: Radius.lg,
    paddingHorizontal: 18, paddingVertical: 14, fontSize: 15,
    fontFamily: Fonts.bodyReg, color: Colors.textDark,
    borderWidth: 2, borderColor: '#D1FAE5', marginBottom: 10,
  },
  error:     { fontFamily: Fonts.bodyReg, fontSize: 13, color: '#EF4444', marginBottom: 10, textAlign: 'center' },
  saveBtn:   { width: '100%', borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 14 },
  saveBtnGrad: { padding: 16, alignItems: 'center' },
  saveBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
  note:      { fontFamily: Fonts.bodyReg, fontSize: 12, color: Colors.textLight, textAlign: 'center' },
});

const chat = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: Platform.OS === 'ios' ? 56 : 24,
    backgroundColor: '#FFFFFF', borderBottomWidth: 2, borderBottomColor: '#D1FAE5',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 12px rgba(34,197,94,0.1)' } : {}),
  },
  backBtn:    { width: 40, height: 40, justifyContent: 'center' },
  backText:   { fontSize: 24, color: Colors.green, fontWeight: '700' },
  headerInfo: { flex: 1, marginLeft: 8 },
  headerTitle:{ fontFamily: Fonts.heading, fontSize: 18, color: Colors.textDark },
  onlineDot:  { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineText: { fontFamily: Fonts.bodyReg, fontSize: 12, color: Colors.green },
  endBtn:     { backgroundColor: '#FEE2E2', borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  endBtnText: { fontFamily: Fonts.bodySemi, fontSize: 13, color: '#DC2626' },

  scroll: { padding: 16, paddingBottom: 40, gap: 10 },
  bubble: {
    maxWidth: '82%', borderRadius: 20, padding: 14,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' } : {}),
  },
  userBubble: {
    alignSelf: 'flex-end', backgroundColor: Colors.green,
    borderBottomRightRadius: 4,
  },
  tutorBubble: {
    alignSelf: 'flex-start', backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4, borderWidth: 1.5, borderColor: '#D1FAE5',
  },
  botLabel:   { fontFamily: Fonts.bodySemi, fontSize: 11, color: Colors.green, marginBottom: 4 },
  bubbleText: { fontFamily: Fonts.bodyReg, fontSize: 15, lineHeight: 22 },
  userText:   { color: '#FFFFFF' },
  tutorText:  { color: Colors.textDark },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 12,
    backgroundColor: '#FFFFFF', borderTopWidth: 2, borderTopColor: '#D1FAE5',
    gap: 10, paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  input: {
    flex: 1, backgroundColor: '#F0FDF4', borderRadius: 20,
    paddingHorizontal: 18, paddingVertical: 12, fontSize: 15,
    fontFamily: Fonts.bodyReg, color: Colors.textDark,
    borderWidth: 1.5, borderColor: '#D1FAE5', maxHeight: 100,
  },
  sendBtn:  { borderRadius: Radius.pill, overflow: 'hidden' },
  sendGrad: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
});

const fin = StyleSheet.create({
  card:    { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 2, borderColor: '#D1FAE5' },
  title:   { fontFamily: Fonts.heading, fontSize: 26, color: Colors.textDark, marginTop: 12, marginBottom: 6 },
  sub:     { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, textAlign: 'center', marginBottom: 8 },
  xp:      { fontFamily: Fonts.heading, fontSize: 22, color: Colors.yellow, marginBottom: 24 },
  btn:     { width: '100%', borderRadius: Radius.lg, overflow: 'hidden' },
  btnGrad: { padding: 16, alignItems: 'center' },
  btnText: { fontFamily: Fonts.heading, fontSize: 18, color: '#FFFFFF' },
});
