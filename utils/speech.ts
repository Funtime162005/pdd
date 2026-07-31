import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

// Map our internal app language string to BCP-47 language codes
const languageMap: Record<string, string> = {
  tamil: 'ta-IN',
  hindi: 'hi-IN',
  telugu: 'te-IN',
  malayalam: 'ml-IN',
  english: 'en-US',
};

const playGoogleTTS = (text: string, langCode: string) => {
  try {
    const cleanLang = langCode.split('-')[0];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${cleanLang}&client=tw-ob`;
    
    if (typeof window !== 'undefined' && window.Audio) {
      const audio = new window.Audio(url);
      audio.play().catch(e => console.warn('[TTS] Web Audio play fallback error:', e));
    }
  } catch (err) {
    console.warn('[TTS] Google TTS Fallback Error:', err);
  }
};

const tamilPhoneticSpeechMap: Record<string, string> = {
  'க்': 'இக்',
  'ங்': 'இங்',
  'ச்': 'இச்',
  'ஞ்': 'இஞ்',
  'ட்': 'இட்',
  'ண்': 'இண்',
  'த்': 'இத்',
  'ந்': 'இந்த்',
  'ப்': 'இப்',
  'ம்': 'இம்',
  'ய்': 'இய்',
  'ர்': 'இர்',
  'ல்': 'இல்',
  'வ்': 'இவ்',
  'ழ்': 'இழ்',
  'ள்': 'இள்',
  'ற்': 'இற்று',
  'ன்': 'இன்',
};

const englishConsonantPhoneticsMap: Record<string, string> = {
  // Mei Ezhuthu Consonants
  'க்': 'Ik',
  'ங்': 'Ing',
  'ச்': 'Ich',
  'ஞ்': 'Inj',
  'ட்': 'It',
  'ண்': 'In',
  'த்': 'Ith',
  'ந்': 'Inth',
  'ப்': 'Ip',
  'ம்': 'Im',
  'ய்': 'Iy',
  'ர்': 'Ir',
  'ல்': 'Il',
  'வ்': 'Iv',
  'ழ்': 'Zha',
  'ள்': 'Il',
  'ற்': 'Itru',
  'ன்': 'In',

  // Uyir Ezhuthu Vowels
  'அ': 'Ah',
  'ஆ': 'Aah',
  'இ': 'Ee',
  'ஈ': 'Eee',
  'உ': 'Oo',
  'ஊ': 'Ooo',
  'எ': 'Eh',
  'ஏ': 'Ay',
  'ஐ': 'Eye',
  'ஒ': 'Oh',
  'ஓ': 'Ohh',
  'ஔ': 'Ow',
  'ஃ': 'Akku',
};

declare global {
  interface Window {
    responsiveVoice?: {
      speak: (text: string, voice: string, options?: any) => void;
      cancel: () => void;
      isPlaying: () => boolean;
    };
  }
}

const responsiveVoiceMap: Record<string, string> = {
  tamil: 'Tamil Female',
  hindi: 'Hindi Female',
  telugu: 'Telugu Female',
  malayalam: 'Malayalam Female',
  english: 'US English Female',
};

const loadResponsiveVoice = () => {
  if (typeof window !== 'undefined' && !window.responsiveVoice && !document.querySelector('script[src*="responsivevoice"]')) {
    const script = document.createElement('script');
    script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=FREE';
    script.async = true;
    document.head.appendChild(script);
  }
};

if (typeof window !== 'undefined') {
  loadResponsiveVoice();
}

export const playAudio = async (text: string, language: string = 'tamil') => {
  try {
    const langLower = language.toLowerCase();
    const langCode = languageMap[langLower] || 'ta-IN';
    let spokenText = text.trim();
    
    // For pure Tamil consonants (Mei Ezhuthu), vocalize cleanly (e.g. க் -> இக்)
    if (langLower === 'tamil' && tamilPhoneticSpeechMap[spokenText]) {
      spokenText = tamilPhoneticSpeechMap[spokenText];
    }

    console.log(`[TTS] Playing audio for: "${spokenText}" (original: "${text}") in language: ${langLower}`);

    // 1. Try ResponsiveVoice on Web for studio quality human speech
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.responsiveVoice) {
        try {
          window.responsiveVoice.cancel();
          const voiceName = responsiveVoiceMap[langLower] || 'Tamil Female';
          window.responsiveVoice.speak(spokenText, voiceName, { rate: 0.9, pitch: 1 });
          return;
        } catch (rvErr) {
          console.warn('[TTS] ResponsiveVoice error, falling back to Web Speech Synthesis:', rvErr);
        }
      }

      // 2. Web Speech Synthesis Fallback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        let voices = window.speechSynthesis.getVoices();
        const taVoice = voices.find(v => 
          v.lang.toLowerCase().includes('ta') || 
          v.name.toLowerCase().includes('tamil') ||
          v.name.toLowerCase().includes('ta-in')
        );

        if (taVoice) {
          const utterance = new SpeechSynthesisUtterance(spokenText);
          utterance.voice = taVoice;
          utterance.lang = taVoice.lang;
          utterance.rate = 0.88;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
          return;
        } else {
          // If no Tamil voice installed in browser, use Google TTS (native Tamil audio)
          playGoogleTTS(spokenText, langCode);
          return;
        }
      }
    }

    // 3. Native Mobile (Android / iOS) via Expo Speech
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) await Speech.stop();
    } catch (e) {}

    const textToSpeak = tamilPhoneticSpeechMap[spokenText] || englishConsonantPhoneticsMap[spokenText] || spokenText;
    Speech.speak(textToSpeak, {
      language: langCode,
      pitch: 1.0,
      rate: 0.9,
      onStart: () => console.log('[TTS] Started native speaking'),
      onDone: () => console.log('[TTS] Finished native speaking'),
      onError: (err) => {
        console.warn('[TTS] Native speech error:', err);
        if (englishConsonantPhoneticsMap[spokenText]) {
          Speech.speak(englishConsonantPhoneticsMap[spokenText], { language: 'en-US' });
        }
      }
    });
  } catch (error) {
    console.warn('[TTS] Catch Error:', error);
  }
};


