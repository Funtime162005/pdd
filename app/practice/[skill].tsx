import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuizUI from '../../components/practice/QuizUI';
import SentenceBuilder from '../../components/practice/SentenceBuilder';
import Flashcards from '../../components/practice/Flashcards';
import ChatUI from '../../components/practice/ChatUI';
import AlphabetGridUI from '../../components/practice/AlphabetGridUI';
import LevelsListUI from '../../components/practice/LevelsListUI';
import VoiceRecordingUI from '../../components/practice/VoiceRecordingUI';
import ReadingUI from '../../components/practice/ReadingUI';
import WritingCanvasUI from '../../components/practice/WritingCanvasUI';
import { useAuth } from '../../context/AuthContext';

export default function PracticeScreen() {
  const { skill, tier: requestedTier } = useLocalSearchParams<{ skill: string, tier: string }>();
  const { user } = useAuth();

  // Use the explicitly requested tier, fallback to user's global level
  let tier = requestedTier;
  if (!tier) {
    tier = 'Beginner';
    if (user?.level?.includes('Pro') || user?.level?.includes('Advanced')) tier = 'Pro';
    else if (user?.level?.includes('Intermediate')) tier = 'Intermediate';
  }

  // Format the skill slug into a readable title
  const title = skill ? skill.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Practice';

  const [selectedLevelNum, setSelectedLevelNum] = useState<number | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleBack = () => {
    setSelectedLevelNum(null);
    setSelectedTier(null);
  };

  const handleNextLevel = async () => {
    if (selectedLevelNum) {
      const finishedNum = selectedLevelNum;
      const lang = (user?.learningLanguage || 'tamil').toLowerCase();
      const userKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : (user?.id || 'guest');
      const key = `@game_${userKey}_${lang}_${skill || 'general'}_${selectedTier || 'Beginner'}_completed`;
      const saved = await AsyncStorage.getItem(key);
      const prevMax = saved ? parseInt(saved, 10) : 0;
      if (finishedNum > prevMax) {
        await AsyncStorage.setItem(key, finishedNum.toString());
      }
      setSelectedLevelNum(finishedNum + 1);
    } else {
      setSelectedLevelNum(2);
    }
  };

  const handleSelectLevel = (num: number, selectedMapTier: string) => {
    setSelectedLevelNum(num);
    setSelectedTier(selectedMapTier);
  };

  const renderContent = () => {
    // 1. Foundations (Alphabet Grid or Sentence Builder)
    if (skill === 'foundations') {
      if (selectedLevelNum && selectedTier) {
        if (selectedTier === 'Beginner') {
          return (
            <AlphabetGridUI 
              key={`foundations-grid-${selectedLevelNum}`}
              skill={skill} 
              title={`Level ${selectedLevelNum}`} 
              selectedLevelNum={selectedLevelNum} 
              onBack={handleBack}
              onNextLevel={handleNextLevel}
            />
          );
        } else {
          return (
            <SentenceBuilder 
              key={`foundations-builder-${selectedLevelNum}`}
              skill={skill} 
              title={`Level ${selectedLevelNum}`} 
              selectedLevelNum={selectedLevelNum} 
              selectedTier={selectedTier} 
              onBack={handleBack}
            />
          );
        }
      }
      return <LevelsListUI gameKey={skill || 'foundations'} gameTitle={title} currentLevelStr={user?.level} initialTab={tier} onSelectLevel={handleSelectLevel} />;
    }

    // 2. Writing (Handwriting Canvas)
    if (skill === 'writing') {
      if (selectedLevelNum && selectedTier) {
        return (
          <WritingCanvasUI 
            key={`writing-${selectedLevelNum}`}
            title={`Writing - Level ${selectedLevelNum}`} 
            tier={selectedTier} 
            selectedLevelNum={selectedLevelNum}
            onBack={handleBack}
            onNextLevel={handleNextLevel}
          />
        );
      }
      return <LevelsListUI gameKey={skill || 'writing'} gameTitle={title} currentLevelStr={user?.level} initialTab={tier} onSelectLevel={handleSelectLevel} />;
    }

    // 3. Vocabulary (Flashcards)
    if (skill === 'vocabulary' || skill?.includes('vocabulary')) {
      if (selectedLevelNum && selectedTier) {
        return (
          <Flashcards 
            key={`vocab-${selectedLevelNum}`}
            skill="vocabulary" 
            title={`Vocabulary - Level ${selectedLevelNum}`} 
            tier={selectedTier} 
            selectedLevelNum={selectedLevelNum}
            onBack={handleBack}
            onNextLevel={handleNextLevel}
          />
        );
      }
      return <LevelsListUI gameKey={skill || 'vocabulary'} gameTitle={title} currentLevelStr={user?.level} initialTab={tier} onSelectLevel={handleSelectLevel} />;
    }

    // 4. Reading (Reading Stories)
    if (skill === 'reading') {
      if (selectedLevelNum && selectedTier) {
        return (
          <ReadingUI 
            key={`reading-${selectedLevelNum}`}
            skill={skill} 
            title={`Reading - Level ${selectedLevelNum}`} 
            tier={selectedTier} 
            selectedLevelNum={selectedLevelNum}
            onBack={handleBack}
            onNextLevel={handleNextLevel}
          />
        );
      }
      return <LevelsListUI gameKey={skill || 'reading'} gameTitle={title} currentLevelStr={user?.level} initialTab={tier} onSelectLevel={handleSelectLevel} />;
    }

    // 5. Communication / Chat
    if (skill === 'communication' || skill?.includes('greetings') || skill?.includes('tutor') || skill?.includes('culture')) {
      return <ChatUI skill={skill || 'communication'} title={title || "AI Tutor Conversation"} tier={tier} />;
    }

    // 6. Pronunciation / Voice
    if (skill === 'pronunciation') {
      if (selectedLevelNum && selectedTier) {
        return (
          <VoiceRecordingUI 
            key={`pronunciation-${selectedLevelNum}`}
            title={`Pronunciation - Level ${selectedLevelNum}`} 
            tier={selectedTier} 
            selectedLevelNum={selectedLevelNum}
            onBack={handleBack}
            onNextLevel={handleNextLevel}
          />
        );
      }
      return <LevelsListUI gameKey={skill || 'pronunciation'} gameTitle={title} currentLevelStr={user?.level} initialTab={tier} onSelectLevel={handleSelectLevel} />;
    }

    // 7. Assessment / Quiz
    if (skill === 'assessment') {
      if (selectedLevelNum && selectedTier) {
        return (
          <QuizUI 
            key={`assessment-${selectedLevelNum}`}
            skill="mini-quiz" 
            title={`Assessment - Level ${selectedLevelNum}`} 
            tier={selectedTier} 
            selectedLevelNum={selectedLevelNum}
            onBack={handleBack}
            onNextLevel={handleNextLevel}
          />
        );
      }
      return <LevelsListUI gameKey={skill || 'assessment'} gameTitle={title} currentLevelStr={user?.level} initialTab={tier} onSelectLevel={handleSelectLevel} />;
    }

    // 8. Sentence / Fluency / Translation
    if (skill?.includes('sentence') || skill?.includes('fluency') || skill?.includes('translation')) {
      return <SentenceBuilder skill={skill} title={title} />;
    }

    // Fallback Quiz
    return <QuizUI skill={skill || 'quiz'} title={title} />;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ECFDF5', '#F0FDF4']} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    padding: 20,
  }
});
