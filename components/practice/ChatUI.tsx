import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInUp, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateTutorResponse } from '../../utils/ai';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Message = { id: string; text: string; sender: 'user' | 'tutor' };

export default function ChatUI({ skill = 'communication', title, tier }: { skill?: string, title: string, tier?: string }) {
  const { user, updateProgress, completeModule } = useAuth();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hey ${user?.name || 'boss'}! 👋 Ready to drop some ${user?.learningLanguage || 'Tamil'} knowledge, or are we just winging it today? Let's go! 🚀`, sender: 'tutor' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newTier, setNewTier] = useState('');

  const chatStorageKey = `@chat_${user?.id || 'guest'}_${user?.learningLanguage || 'default'}_${skill}`;

  useEffect(() => {
    const loadChat = async () => {
      try {
        const stored = await AsyncStorage.getItem(chatStorageKey);
        if (stored) {
          setMessages(JSON.parse(stored));
          setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
        }
      } catch (e) {
        console.log("Failed to load chat history", e);
      }
    };
    loadChat();
  }, [chatStorageKey]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    const newUserMsg: Message = { id: Date.now().toString(), text: userMessage, sender: 'user' };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    AsyncStorage.setItem(chatStorageKey, JSON.stringify(newMessages));
    setIsTyping(true);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Build chat history string
    const historyString = newMessages.map(m => `${m.sender === 'user' ? 'User' : 'Tutor'}: ${m.text}`).join('\n');

    try {
      const activeLevel = tier || user?.level || "Beginner - Level 1";
      const response = await generateTutorResponse(historyString, userMessage, activeLevel, user?.learningLanguage || "tamil");
      setMessages(prev => {
        const next: Message[] = [...prev, { id: Date.now().toString(), text: response, sender: 'tutor' }];
        AsyncStorage.setItem(chatStorageKey, JSON.stringify(next));
        return next;
      });
    } catch (err) {
      setMessages(prev => {
        const next: Message[] = [...prev, { id: Date.now().toString(), text: "I'm having trouble connecting right now. Let's try again.", sender: 'tutor' }];
        AsyncStorage.setItem(chatStorageKey, JSON.stringify(next));
        return next;
      });
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const completeSession = async () => {
    // 5 XP per message sent by user (for leaderboard only)
    const userMessageCount = messages.filter(m => m.sender === 'user').length;
    const xpGained = userMessageCount * 5;
    updateProgress(xpGained);
    const result = await completeModule('communication');
    if (result?.leveledUp) {
      setLeveledUp(true);
      setNewTier(result.newTier);
    } else {
      router.replace('/(tabs)');
    }
  };

  if (isFinished) {
    const userMessageCount = messages.filter(m => m.sender === 'user').length;
    const xpGained = userMessageCount * 5;

    if (leveledUp) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Animated.View entering={FadeInUp.springify()} style={[styles.card, { borderWidth: 2, borderColor: '#F59E0B' }]}>
            <Text style={{ fontSize: 60 }}>🎉</Text>
            <Text style={styles.titleText}>Level Up!</Text>
            <Text style={{ fontSize: 16, color: '#4B5563', textAlign: 'center', marginVertical: 10 }}>All 4 modules complete! Welcome to <Text style={{ fontWeight: 'bold', color: '#10B981' }}>{newTier}</Text>!</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP (Leaderboard)</Text>
            <Pressable style={[styles.button, { backgroundColor: '#F59E0B' }]} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.buttonText}>Start {newTier} Phase 🚀</Text>
            </Pressable>
          </Animated.View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Animated.View entering={FadeInUp.springify()} style={styles.card}>
          <Text style={{ fontSize: 40 }}>💬</Text>
          <Text style={styles.titleText}>Session Complete!</Text>
          <Text style={{ fontSize: 18, color: '#4B5563', marginVertical: 10 }}>You sent {userMessageCount} messages.</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 30 }}>+{xpGained} XP (Leaderboard)</Text>
          <Pressable style={styles.button} onPress={completeSession}>
            <Text style={styles.buttonText}>Return to Dashboard</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={{ marginRight: 15 }}>
          <Text style={{ fontSize: 24, color: '#065F46' }}>✕</Text>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#065F46', flex: 1 }}>{title}</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <Animated.View 
              key={msg.id} 
              entering={isUser ? SlideInRight.springify() : SlideInLeft.springify()}
              style={[styles.messageBubble, isUser ? styles.userBubble : styles.tutorBubble]}
            >
              <Text style={[styles.messageText, isUser ? styles.userText : styles.tutorText]}>
                {msg.text}
              </Text>
            </Animated.View>
          );
        })}
        {isTyping && (
          <View style={[styles.messageBubble, styles.tutorBubble, { width: 60, alignItems: 'center' }]}>
            <ActivityIndicator size="small" color="#059669" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>

      <Pressable style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishText}>End Session</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 24, padding: 30, alignItems: 'center', elevation: 5 },
  titleText: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 10 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  userBubble: {
    backgroundColor: '#10B981',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  tutorBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: 'white' },
  tutorText: { color: '#1F2937' },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: 'white', fontWeight: 'bold' },
  finishButton: {
    backgroundColor: '#FEE2E2',
    padding: 15,
    alignItems: 'center',
  },
  finishText: { color: '#DC2626', fontWeight: 'bold', fontSize: 16 },
  button: { backgroundColor: '#10B981', padding: 18, borderRadius: 16, alignItems: 'center', width: '100%' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
