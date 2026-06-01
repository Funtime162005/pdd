import * as Speech from 'expo-speech';
import { Platform, Alert } from 'react-native';

// Map our internal app language string to BCP-47 language codes
const languageMap: Record<string, string> = {
  tamil: 'ta-IN',
  hindi: 'hi-IN',
  telugu: 'te-IN',
  malayalam: 'ml-IN',
  kannada: 'kn-IN',
};

export const playAudio = async (text: string, language: string = 'tamil') => {
  try {
    const langCode = languageMap[language.toLowerCase()] || 'ta-IN';
    
    console.log(`[TTS] Attempting to speak: "${text}" in language: ${langCode}`);
    
    if (Platform.OS === 'web') {
      const voices = window.speechSynthesis.getVoices();
      const hasIndicVoice = voices.some(v => v.lang.startsWith(langCode.split('-')[0]));
      
      if (!hasIndicVoice) {
        console.warn(`[TTS] No installed voice found for ${langCode}. Browser may be silent.`);
        // We will just let expo-speech try anyway. It will either play the default voice or be silent.
        // We removed the web proxy fallback because it caused too many CORS/NotSupported errors.
      }
    }

    // Native & Web (with voice) logic
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      console.log('[TTS] Stopping previous speech...');
      await Speech.stop();
    }

    Speech.speak(text, {
      language: langCode,
      pitch: 1.0,
      rate: 0.9, // Slightly slower for language learners
      onStart: () => console.log('[TTS] Started speaking'),
      onDone: () => console.log('[TTS] Finished speaking'),
      onStopped: () => console.log('[TTS] Stopped speaking'),
      onError: (err) => {
        // Use warn instead of error so it doesn't trigger the giant Expo LogBox overlay in dev mode
        console.warn('[TTS] Failed to speak:', err);
      }
    });
  } catch (error) {
    console.warn('[TTS] Catch Error:', error);
  }
};
