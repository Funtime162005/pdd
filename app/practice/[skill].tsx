import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
  const router = useRouter();
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

  const [selectedLevelNum, setSelectedLevelNum] = React.useState<number | null>(null);
  const [selectedTier, setSelectedTier] = React.useState<string | null>(null);

  // Polymorphic router logic
  let PracticeComponent;

  // --- Dynamic 4-Pillar Routing ---
  if (skill === 'foundations') {
    if (selectedLevelNum && selectedTier) {
      if (selectedTier === 'Beginner') {
        PracticeComponent = <AlphabetGridUI skill={skill} title={`Level ${selectedLevelNum}`} selectedLevelNum={selectedLevelNum} onBack={() => { setSelectedLevelNum(null); setSelectedTier(null); }} />;
      } else {
        PracticeComponent = <SentenceBuilder skill={skill} title={`Level ${selectedLevelNum}`} selectedLevelNum={selectedLevelNum} selectedTier={selectedTier} onBack={() => { setSelectedLevelNum(null); setSelectedTier(null); }} />;
      }
    } else {
      PracticeComponent = <LevelsListUI currentLevelStr={user?.level} initialTab={tier} onSelectLevel={(num, selectedMapTier) => { setSelectedLevelNum(num); setSelectedTier(selectedMapTier); }} />;
    }
  } else if (skill === 'writing') {
    PracticeComponent = <WritingCanvasUI title="Writing Practice" tier={tier} />;
  } else if (skill === 'vocabulary') {
    PracticeComponent = <Flashcards skill={skill} title="Vocabulary Challenges" tier={tier} />;
  } else if (skill === 'communication') {
    PracticeComponent = <ChatUI title="AI Tutor Conversation" tier={tier} />;
  } else if (skill === 'pronunciation') {
    PracticeComponent = <VoiceRecordingUI title="Pronunciation Training" tier={tier} />;
  } else if (skill === 'reading') {
    PracticeComponent = <ReadingUI title="Reading Comprehension" tier={tier} />;
  } else if (skill === 'assessment') {
    PracticeComponent = <QuizUI skill="mini-quiz" title="Module Assessment" tier={tier} />;
  }
  // --- Legacy routing (for direct links) ---
  else if (skill?.includes('sentence') || skill?.includes('fluency') || skill?.includes('translation')) {
    PracticeComponent = <SentenceBuilder skill={skill} title={title} />;
  } else if (skill?.includes('alphabet')) {
    PracticeComponent = <AlphabetGridUI skill={skill} title={title} />;
  } else if (skill?.includes('greetings') || skill?.includes('tutor') || skill?.includes('culture') || skill?.includes('communication')) {
    PracticeComponent = <ChatUI skill={skill} title={title} />;
  } else if (skill?.includes('vocabulary')) {
    PracticeComponent = <Flashcards skill={skill} title={title} />;
  } else if (skill === 'reading') {
    PracticeComponent = <ReadingUI skill={skill} title={title} />;
  } else {
    PracticeComponent = <QuizUI skill={skill} title={title} />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ECFDF5', '#F0FDF4']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.content}>
        {PracticeComponent}
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
