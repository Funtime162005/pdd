import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInRight, FadeInLeft, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { UI_TRANSLATIONS } from '../../constants/translations';
import MascotAssistant from '../../components/MascotAssistant';
import { Colors, Fonts, Radius, Shadow } from '../../components/KidsTheme';
import { API_URL } from '../../constants/config';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';


const avatars: Record<string, any> = {
  tiger: require('../../assets/avatars/tiger.jpg'),
  panda: require('../../assets/avatars/panda.jpg'),
  monkey: require('../../assets/avatars/monkey.jpg'),
  elephant: require('../../assets/avatars/elephant.jpg'),
  lion: require('../../assets/avatars/lion.jpg'),
  koala: require('../../assets/avatars/koala.jpg'),
  giraffe: require('../../assets/avatars/giraffe.jpg'),
  penguin: require('../../assets/avatars/penguin.jpg'),
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

  const getMockMessages = () => {
    return [];
  };


  const [stats, setStats] = useState({ totalUsers: 142, totalXP: 45200 });
  const [messages, setMessages] = useState<Message[]>(getMockMessages);
  const [inputText, setInputText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvt, () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvt, () => setIsKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const fetchData = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const [msgsRes, profilesRes] = await Promise.all([
          supabase.from('messages').select('*').order('timestamp', { ascending: false }).limit(50),
          supabase.from('profiles').select('xp', { count: 'exact' })
        ]);

        if (msgsRes.data && msgsRes.data.length > 0) {
          const formattedMsgs: Message[] = msgsRes.data.map((m: any) => ({
            _id: m.id || Math.random().toString(),
            text: m.text,
            authorName: m.author_name || m.authorName || 'Friend',
            authorAvatar: m.author_avatar || m.authorAvatar || 'tiger',
            timestamp: m.timestamp || new Date().toISOString()
          }));
          setMessages(formattedMsgs);
        }

        const userCount = profilesRes.count || 142;
        const totalXP = profilesRes.data ? profilesRes.data.reduce((acc: number, cur: any) => acc + (cur.xp || 0), 0) : 45200;
        setStats({ totalUsers: userCount, totalXP });
        return;
      } catch (err) {
        console.warn('Supabase community fetchData error:', err);
      }
    }

    try {
      const [statsRes, msgsRes] = await Promise.all([
        fetch(`${API_URL}/community`).catch(() => null),
        fetch(`${API_URL}/messages`).catch(() => null)
      ]);
      
      const statsData = statsRes ? await statsRes.json().catch(() => ({})) : {};
      const msgsData = msgsRes ? await msgsRes.json().catch(() => ([])) : [];
      
      if (!statsData || statsData.error || typeof statsData.totalUsers === 'undefined') {
        setStats(prev => prev.totalUsers > 0 ? prev : { totalUsers: 142, totalXP: 45200 });
      } else {
        setStats(statsData);
      }
      
      if (!msgsData || msgsData.error || !Array.isArray(msgsData) || msgsData.length === 0) {
        setMessages(prev => prev.length > 0 ? prev : getMockMessages());
      } else {
        setMessages(msgsData);
      }
    } catch {
      setStats(prev => prev.totalUsers > 0 ? prev : { totalUsers: 142, totalXP: 45200 });
      setMessages(prev => prev.length > 0 ? prev : getMockMessages());
    }
  };

  useEffect(() => {
    fetchData();

    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          if (payload.new) {
            const newMsg: Message = {
              _id: payload.new.id || Math.random().toString(),
              text: payload.new.text,
              authorName: payload.new.author_name || 'Friend',
              authorAvatar: payload.new.author_avatar || 'tiger',
              timestamp: payload.new.timestamp || new Date().toISOString()
            };
            setMessages(prev => [newMsg, ...prev.filter(m => m._id !== newMsg._id)]);
          }
        })
        .subscribe();
    }

    const i = setInterval(fetchData, 10000);
    return () => {
      clearInterval(i);
      if (channel && supabase) supabase.removeChannel(channel);
    };
  }, [user]);

  const activeUser = user || { name: 'Learner', avatar: 'tiger' };

  const handlePost = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');
    setIsPosting(true);
    
    const senderName = activeUser.name;
    const senderAvatar = activeUser.avatar || 'tiger';

    const newLocalMsg: Message = { 
      _id: 'msg-' + Date.now(), 
      text: textToSend, 
      authorName: senderName, 
      authorAvatar: senderAvatar, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages(prev => [newLocalMsg, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: supaMsg } = await supabase
          .from('messages')
          .insert([
            {
              text: textToSend,
              author_name: senderName,
              author_avatar: senderAvatar,
            }
          ])
          .select()
          .single();

        if (supaMsg) {
          const serverMsg: Message = {
            _id: supaMsg.id,
            text: supaMsg.text,
            authorName: supaMsg.author_name,
            authorAvatar: supaMsg.author_avatar,
            timestamp: supaMsg.timestamp
          };
          setMessages(prev => prev.map(m => m._id === newLocalMsg._id ? serverMsg : m));
        }
      } catch (supaErr) {
        console.warn('Supabase post message error:', supaErr);
      }
    }

    try {
      const res = await fetch(`${API_URL}/messages`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          text: textToSend, 
          authorName: senderName, 
          authorAvatar: senderAvatar 
        }) 
      });
      const serverMsg = await res.json().catch(() => null);
      if (serverMsg && serverMsg._id) {
        setMessages(prev => prev.map(m => m._id === newLocalMsg._id ? serverMsg : m));
      }
    } catch (err) {
      console.warn('[Community] Post message error:', err);
    } finally { 
      setIsPosting(false); 
    }
  };


  const getAvatar = (key: string) => avatars[key] || avatars.tiger;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient colors={['#EFF6FF', '#FDF4FF', '#FFFDE7']} style={StyleSheet.absoluteFill} />

      {/* Floating emojis */}
      <FloatingEmoji emoji="💬" top={40} left={20} delay={0} />
      <FloatingEmoji emoji="🌍" top={70} right={30} delay={300} />
      <FloatingEmoji emoji="🎉" top={120} left={80} delay={600} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

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
                const isMe = activeUser && activeUser.name === msg.authorName;
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

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Input area - Always visible */}
      <View style={[styles.inputAreaOuter, { paddingBottom: Platform.OS === 'web' || isKeyboardVisible ? 0 : 88 }]}>
        <View style={styles.inputArea}>
          <Image source={getAvatar(activeUser.avatar || 'tiger')} style={styles.inputAvatar} />
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 10 },
  header: { marginBottom: 20 },
  title: { fontFamily: Fonts.heading, fontSize: 34, color: Colors.textDark },
  subtitle: { fontFamily: Fonts.bodyReg, fontSize: 15, color: Colors.textMid, marginTop: 4 },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: { flex: 1, minWidth: 90, alignItems: 'center', borderRadius: Radius.xl, paddingVertical: 12, paddingHorizontal: 4, borderWidth: 2.5 },
  statEmoji: { fontSize: 22, marginBottom: 2 },
  statNum: { fontFamily: Fonts.heading, fontSize: 16 },
  statLabel: { fontFamily: Fonts.bodyReg, fontSize: 11, color: Colors.textMid, marginTop: 2, textAlign: 'center' },

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

  inputAreaOuter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: Colors.greenLight,
    ...(Platform.OS === 'web' ? { boxShadow: '0px -4px 16px rgba(34,197,94,0.1)' } : {}),
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
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
