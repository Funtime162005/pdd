import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInRight, FadeInLeft, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { UI_TRANSLATIONS } from '../../constants/translations';
import MascotAssistant from '../../components/MascotAssistant';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';

const API_URL = 'https://nri-language-learning.onrender.com/api';

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

const BUBBLE_GRADIENTS: [string, string][] = [
  ['#BAE6FD', '#E0F2FE'],
  ['#F3E8FF', '#EDE9FE'],
  ['#DCFCE7', '#D1FAE5'],
  ['#FEF9C3', '#FEF3C7'],
  ['#FCE7F3', '#FBCFE8'],
  ['#FFEDD5', '#FED7AA'],
];
const BUBBLE_BORDERS = [Colors.sky, Colors.purple, Colors.green, Colors.yellow, Colors.pink, Colors.orange];

type Message = { _id: string; text: string; authorName: string; authorAvatar: string; timestamp: string; };

function FloatingEmoji({ emoji, top, left, right, delay = 0 }: any) {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withRepeat(withSequence(withTiming(-10, { duration: 2000 + delay, easing: Easing.inOut(Easing.ease) }), withTiming(0, { duration: 2000 + delay, easing: Easing.inOut(Easing.ease) })), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  return <Animated.View style={[{ position: 'absolute', top, left, right }, style]}><Text style={{ fontSize: 24, opacity: 0.6 }}>{emoji}</Text></Animated.View>;
}

export default function CommunityScreen() {
  const { user } = useAuth();
  const lang = user?.learningLanguage || 'tamil';
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['tamil'];

  const [stats, setStats] = useState({ totalUsers: 0, totalXP: 0 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, msgsRes] = await Promise.all([fetch(`${API_URL}/community`), fetch(`${API_URL}/messages`)]);
      const statsData = await statsRes.json();
      const msgsData = await msgsRes.json();
      if (statsData.error) setStats({ totalUsers: 142, totalXP: 45200 }); else setStats(statsData);
      if (msgsData.error) {
        const mock = [
          { _id: 'm1', text: t.communityMockMessage || 'Excited to learn here! 🎉', authorName: 'Sarah', authorAvatar: 'panda', timestamp: new Date().toISOString() },
          { _id: 'm2', text: 'Does anyone want to practice speaking later? 🎤', authorName: 'Rahul', authorAvatar: 'lion', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { _id: 'm3', text: 'The games are SO fun! Love this app 😍', authorName: 'Emily', authorAvatar: 'giraffe', timestamp: new Date(Date.now() - 7200000).toISOString() },
        ];
        if (user) mock.unshift({ _id: 'm0', text: `Hi I'm ${user.name}! Just joined! 👋`, authorName: user.name, authorAvatar: user.avatar || 'tiger', timestamp: new Date().toISOString() });
        setMessages(mock);
      } else {
        setMessages(Array.isArray(msgsData) ? msgsData : []);
      }
    } catch { }
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 10000); return () => clearInterval(i); }, [user]);

  const handlePost = async () => {
    if (!inputText.trim() || !user) return;
    setIsPosting(true);
    try {
      const res = await fetch(`${API_URL}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: inputText.trim(), authorName: user.name, authorAvatar: user.avatar || 'tiger' }) });
      const newMsg = await res.json();
      if (newMsg && !newMsg.error) setMessages([newMsg, ...(Array.isArray(messages) ? messages : [])]);
      else {
        const fallback = { _id: Math.random().toString(), text: inputText.trim(), authorName: user.name, authorAvatar: user.avatar || 'tiger', timestamp: new Date().toISOString() };
        setMessages([fallback, ...(Array.isArray(messages) ? messages : [])]);
      }
      setInputText('');
    } catch { } finally { setIsPosting(false); }
  };

  const getAvatar = (key: string) => avatars[key] || avatars.tiger;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={['#EFF6FF', '#FDF4FF', '#FFFDE7']} style={StyleSheet.absoluteFill} />

      {/* Floating emojis */}
      <FloatingEmoji emoji="💬" top={40} left={20} delay={0} />
      <FloatingEmoji emoji="🌍" top={70} right={30} delay={300} />
      <FloatingEmoji emoji="🎉" top={120} left={80} delay={600} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
          <Text style={styles.title}>🌍 Friend Zone!</Text>
          <Text style={styles.subtitle}>Connect with learners worldwide! 🤝</Text>
        </Animated.View>

        {/* Stats row */}
        <Animated.View entering={FadeInUp.delay(120).springify()} style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.skyLight, borderColor: Colors.sky }]}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={[styles.statNum, { color: Colors.skyDark }]}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.yellowLight, borderColor: Colors.yellow }]}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={[styles.statNum, { color: Colors.yellowDark }]}>{stats.totalXP.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Platform XP</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.greenLight, borderColor: Colors.green }]}>
            <Text style={styles.statEmoji}>🔴</Text>
            <Text style={[styles.statNum, { color: Colors.greenDark }]}>Live</Text>
            <Text style={styles.statLabel}>Chat</Text>
          </View>
        </Animated.View>

        {/* Fun stickers row */}
        <Animated.View entering={FadeInUp.delay(180).springify()} style={styles.stickersRow}>
          {['🎉', '💬', '🌟', '🎊', '🤝', '🚀', '💪', '🔥'].map((s, i) => (
            <View key={i} style={[styles.stickerBubble, { backgroundColor: BUBBLE_GRADIENTS[i % BUBBLE_GRADIENTS.length][0] + '88' }]}>
              <Text style={{ fontSize: 22 }}>{s}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Chat Board */}
        <Animated.View entering={FadeInUp.delay(260).springify()}>
          <Text style={styles.sectionTitle}>💬 Live Chat Board</Text>
          <View style={styles.boardCard}>
            {messages.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 30 }}>
                <Text style={{ fontSize: 48 }}>👋</Text>
                <Text style={styles.emptyText}>Be the first to say hello!</Text>
              </View>
            ) : (
              messages.map((msg, index) => {
                const isMe = user && user.name === msg.authorName;
                const grad = BUBBLE_GRADIENTS[index % BUBBLE_GRADIENTS.length];
                const borderColor = BUBBLE_BORDERS[index % BUBBLE_BORDERS.length];
                return (
                  <Animated.View
                    key={msg._id || `msg-${index}`}
                    entering={(isMe ? FadeInRight : FadeInLeft).delay(index * 60).springify()}
                    style={[styles.msgBubble, { borderColor, borderLeftWidth: 4 }]}
                  >
                    <LinearGradient colors={grad} style={[StyleSheet.absoluteFill, { borderRadius: Radius.lg }]} />
                    <Image source={getAvatar(msg.authorAvatar)} style={[styles.msgAvatar, { borderColor }]} />
                    <View style={{ flex: 1 }}>
                      <View style={styles.msgMeta}>
                        <Text style={[styles.msgAuthor, isMe && { color: Colors.purple }]}>
                          {msg.authorName || 'Friend'}{isMe ? ' (You) 👋' : ''}
                        </Text>
                        <Text style={styles.msgTime}>
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                      </View>
                      <Text style={styles.msgText}>{msg.text}</Text>
                    </View>
                  </Animated.View>
                );
              })
            )}
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Input area */}
      {user && (
        <View style={styles.inputArea}>
          <Image source={getAvatar(user.avatar || 'tiger')} style={styles.inputAvatar} />
          <TextInput
            style={styles.input}
            placeholder="Say something fun! 😊"
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handlePost}
            returnKeyType="send"
            maxLength={150}
          />
          <Pressable
            style={[styles.sendBtn, (!inputText.trim() || isPosting) && { opacity: 0.5 }]}
            onPress={handlePost}
            disabled={!inputText.trim() || isPosting}
          >
            <LinearGradient colors={Colors.gradSky} style={styles.sendBtnGrad}>
              <Text style={{ fontSize: 22 }}>✈️</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      <MascotAssistant message="Say hi to your friends! 👋" bottomOffset={100} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontFamily: Fonts.heading, fontSize: 34, color: Colors.textDark },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, marginTop: 4 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, alignItems: 'center', borderRadius: Radius.xl, padding: 14, borderWidth: 2.5 },
  statEmoji: { fontSize: 26, marginBottom: 4 },
  statNum: { fontFamily: Fonts.heading, fontSize: 18 },
  statLabel: { fontFamily: Fonts.bodyReg, fontSize: 11, color: Colors.textMid, marginTop: 2 },

  stickersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  stickerBubble: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' } : {}),
  },

  sectionTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.textDark, marginBottom: 14 },
  boardCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: Radius.xl,
    padding: 14,
    gap: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 8px 24px rgba(0,0,0,0.07)' } : { ...Shadow.soft }),
  },
  emptyText: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.textMid, marginTop: 10 },

  msgBubble: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: 12,
    gap: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  msgAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2.5 },
  msgMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  msgAuthor: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textDark },
  msgTime: { fontFamily: Fonts.bodyReg, fontSize: 11, color: Colors.textLight },
  msgText: { fontFamily: Fonts.bodyReg, fontSize: 14, color: Colors.textMid, lineHeight: 20 },

  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 3,
    borderTopColor: Colors.greenLight,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    gap: 10,
    ...(Platform.OS === 'web' ? { boxShadow: '0px -4px 16px rgba(34,197,94,0.1)' } : {}),
  },
  inputAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2.5, borderColor: Colors.green },
  input: {
    flex: 1,
    backgroundColor: Colors.bgMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.bodyReg,
    color: Colors.textDark,
    borderWidth: 2.5,
    borderColor: Colors.greenLight,
  },
  sendBtn: { borderRadius: Radius.pill, overflow: 'hidden' },
  sendBtnGrad: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
});
