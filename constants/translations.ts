export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  tamil: {
    learn: 'கற்க',
    games: 'விளையாட்டுகள்',
    community: 'சமூக வலைப்பின்னல்',
    leaderboard: 'முன்னிலைப்பட்டியல்',
    culture: 'பண்பாடு',
    profile: 'சுயவிவரம்',
    communityMockMessage: 'இங்கு தமிழ் கற்க ஆர்வமாக உள்ளேன்!'
  },
  hindi: {
    learn: 'सीखें',
    games: 'खेल',
    community: 'समुदाय',
    leaderboard: 'लीडरबोर्ड',
    culture: 'संस्कृति',
    profile: 'प्रोफ़ाइल',
    communityMockMessage: 'मैं यहाँ हिंदी सीखने के लिए उत्साहित हूँ!'
  },
  telugu: {
    learn: 'నేర్చుకోండి',
    games: 'ఆటలు',
    community: 'సంఘం',
    leaderboard: 'లీడర్‌బోర్డ్',
    culture: 'సంస్కృతి',
    profile: 'ప్రొఫైల్',
    communityMockMessage: 'నేను ఇక్కడ తెలుగు నేర్చుకోవడానికి ఉత్సాహంగా ఉన్నాను!'
  },
  malayalam: {
    learn: 'പഠിക്കുക',
    games: 'ഗെയിമുകൾ',
    community: 'കമ്മ്യൂണിറ്റി',
    leaderboard: 'ലീഡർബോർഡ്',
    culture: 'സംസ്കാരം',
    profile: 'പ്രൊഫൈൽ',
    communityMockMessage: 'ഞാൻ ഇവിടെ മലയാളം പഠിക്കാൻ ആവേശത്തിലാണ്!'
  },
  kannada: {
    learn: 'ಕಲಿಯಿರಿ',
    games: 'ಆಟಗಳು',
    community: 'ಸಮುದಾಯ',
    leaderboard: 'ಲೀಡರ್‌ಬೋರ್ಡ್',
    culture: 'ಸಂಸ್ಕೃತಿ',
    profile: 'ಪ್ರೊಫೈಲ್',
    communityMockMessage: 'ನಾನು ಇಲ್ಲಿ ಕನ್ನಡ ಕಲಿಯಲು ಉತ್ಸುಕನಾಗಿದ್ದೇನೆ!'
  }
};

export const SPEECH_CODES: Record<string, string> = {
  tamil: 'ta-IN',
  hindi: 'hi-IN',
  telugu: 'te-IN',
  malayalam: 'ml-IN',
  kannada: 'kn-IN'
};

export const GREETINGS: Record<string, string> = {
  tamil: 'வணக்கம்',
  hindi: 'नमस्ते',
  telugu: 'నమస్కారం',
  malayalam: 'നമസ്കാരം',
  kannada: 'ನಮಸ್ಕಾರ'
};

export const GAME_POOLS: Record<string, Array<{ text: string, audio: string }>> = {
  tamil: [
    { text: 'வணக்கம்', audio: 'வணக்கம்' },
    { text: 'நன்றி', audio: 'நன்றி' },
    { text: 'தண்ணீர்', audio: 'தண்ணீர்' },
    { text: 'உணவு', audio: 'உணவு' }
  ],
  hindi: [
    { text: 'नमस्ते', audio: 'नमस्ते' },
    { text: 'धन्यवाद', audio: 'धन्यवाद' },
    { text: 'पानी', audio: 'पानी' },
    { text: 'खाना', audio: 'खाना' }
  ],
  telugu: [
    { text: 'నమస్కారం', audio: 'నమస్కారం' },
    { text: 'ధన్యవాదాలు', audio: 'ధన్యవాదాలు' },
    { text: 'నీరు', audio: 'నీరు' },
    { text: 'ఆహారం', audio: 'ఆహారం' }
  ],
  malayalam: [
    { text: 'നമസ്കാരം', audio: 'നമസ്കാരം' },
    { text: 'നന്ദി', audio: 'നന്ദി' },
    { text: 'വെള്ളം', audio: 'വെള്ളം' },
    { text: 'ഭക്ഷണം', audio: 'ഭക്ഷണം' }
  ],
  kannada: [
    { text: 'ನಮಸ್ಕಾರ', audio: 'ನಮಸ್ಕಾರ' },
    { text: 'ಧನ್ಯವಾದ', audio: 'ಧನ್ಯವಾದ' },
    { text: 'ನೀರು', audio: 'ನೀರು' },
    { text: 'ಆಹಾರ', audio: 'ಆಹಾರ' }
  ]
};

export const LISTEN_GAME_POOLS: Record<string, Array<{ target: string, options: string[], correct: number }>> = {
  tamil: [
    { target: 'வணக்கம்', options: ['வணக்கம்', 'தண்ணீர்', 'உணவு', 'பள்ளி'], correct: 0 },
    { target: 'நன்றி', options: ['தயவுசெய்து', 'நன்றி', 'மன்னிக்கவும்', 'ஆமாம்'], correct: 1 },
    { target: 'தண்ணீர்', options: ['ஆப்பிள்', 'தண்ணீர்', 'வீடு', 'மரம்'], correct: 1 },
    { target: 'உணவு', options: ['புத்தகம்', 'நண்பன்', 'உணவு', 'பணம்'], correct: 2 },
    { target: 'பள்ளி', options: ['மருத்துவமனை', 'அலுவலகம்', 'கடை', 'பள்ளி'], correct: 3 },
  ],
  hindi: [
    { target: 'नमस्ते', options: ['नमस्ते', 'पानी', 'खाना', 'स्कूल'], correct: 0 },
    { target: 'धन्यवाद', options: ['कृपया', 'धन्यवाद', 'माफ़ करें', 'हाँ'], correct: 1 },
    { target: 'पानी', options: ['सेब', 'पानी', 'घर', 'पेड़'], correct: 1 },
    { target: 'खाना', options: ['किताब', 'दोस्त', 'खाना', 'पैसे'], correct: 2 },
    { target: 'स्कूल', options: ['अस्पताल', 'कार्यालय', 'दुकान', 'स्कूल'], correct: 3 },
  ],
  telugu: [
    { target: 'నమస్కారం', options: ['నమస్కారం', 'నీరు', 'ఆహారం', 'పాఠశాల'], correct: 0 },
    { target: 'ధన్యవాదాలు', options: ['దయచేసి', 'ధన్యవాదాలు', 'క్షమించండి', 'అవును'], correct: 1 },
    { target: 'నీరు', options: ['ఆపిల్', 'నీరు', 'ఇల్లు', 'చెట్టు'], correct: 1 },
    { target: 'ఆహారం', options: ['పుస్తకం', 'స్నేహితుడు', 'ఆహారం', 'డబ్బు'], correct: 2 },
    { target: 'పాఠశాల', options: ['ఆసుపత్రి', 'కార్యాలయం', 'దుకాణం', 'పాఠశాల'], correct: 3 },
  ],
  malayalam: [
    { target: 'നമസ്കാരം', options: ['നമസ്കാരം', 'വെള്ളം', 'ഭക്ഷണം', 'സ്കൂൾ'], correct: 0 },
    { target: 'നന്ദി', options: ['ദയവായി', 'നന്ദി', 'ക്ഷമിക്കണം', 'അതെ'], correct: 1 },
    { target: 'വെള്ളം', options: ['ആപ്പിൾ', 'വെള്ളം', 'വീട്', 'മരം'], correct: 1 },
    { target: 'ഭക്ഷണം', options: ['പുസ്തകം', 'സുഹൃത്ത്', 'ഭക്ഷണം', 'പണം'], correct: 2 },
    { target: 'സ്കൂൾ', options: ['ആശുപത്രി', 'ഓഫീസ്', 'കട', 'സ്കൂൾ'], correct: 3 },
  ],
  kannada: [
    { target: 'ನಮಸ್ಕಾರ', options: ['ನಮಸ್ಕಾರ', 'ನೀರು', 'ಆಹಾರ', 'ಶಾಲೆ'], correct: 0 },
    { target: 'ಧನ್ಯವಾದ', options: ['ದಯವಿಟ್ಟು', 'ಧನ್ಯವಾದ', 'ಕ್ಷಮಿಸಿ', 'ಹೌದು'], correct: 1 },
    { target: 'ನೀರು', options: ['ಸೇಬು', 'ನೀರು', 'ಮನೆ', 'ಮರ'], correct: 1 },
    { target: 'ಆಹಾರ', options: ['ಪುಸ್ತಕ', 'ಸ್ನೇಹಿತ', 'ಆಹಾರ', 'ಹಣ'], correct: 2 },
    { target: 'ಶಾಲೆ', options: ['ಆಸ್ಪತ್ರೆ', 'ಕಚೇರಿ', 'ಅಂಗಡಿ', 'ಶಾಲೆ'], correct: 3 },
  ]
};

export const PICTURE_GAME_POOLS: Record<string, Array<{ emoji: string, options: string[], correct: number }>> = {
  tamil: [
    { emoji: '🍎', options: ['பழம்', 'தண்ணீர்', 'வீடு', 'மரம்'], correct: 0 },
    { emoji: '🏠', options: ['பள்ளி', 'மரம்', 'வீடு', 'கோவில்'], correct: 2 },
    { emoji: '🚗', options: ['கார்', 'சைக்கிள்', 'பழம்', 'வண்டி'], correct: 0 },
    { emoji: '🐕', options: ['பூனை', 'நாய்', 'குதிரை', 'பசு'], correct: 1 },
    { emoji: '🌳', options: ['கொடி', 'மரம்', 'பூ', 'இலை'], correct: 1 },
  ],
  hindi: [
    { emoji: '🍎', options: ['फल', 'पानी', 'घर', 'पेड़'], correct: 0 },
    { emoji: '🏠', options: ['स्कूल', 'पेड़', 'घर', 'मंदिर'], correct: 2 },
    { emoji: '🚗', options: ['कार', 'साइकिल', 'फल', 'गाड़ी'], correct: 0 },
    { emoji: '🐕', options: ['बिल्ली', 'कुत्ता', 'घोड़ा', 'गाय'], correct: 1 },
    { emoji: '🌳', options: ['बेल', 'पेड़', 'फूल', 'पत्ता'], correct: 1 },
  ],
  telugu: [
    { emoji: '🍎', options: ['పండు', 'నీరు', 'ఇల్లు', 'చెట్టు'], correct: 0 },
    { emoji: '🏠', options: ['పాఠశాల', 'చెట్టు', 'ఇల్లు', 'గుడి'], correct: 2 },
    { emoji: '🚗', options: ['కారు', 'సైకిల్', 'పండు', 'బండి'], correct: 0 },
    { emoji: '🐕', options: ['పిల్లి', 'కుక్క', 'గుర్రం', 'ఆవు'], correct: 1 },
    { emoji: '🌳', options: ['తీగ', 'చెట్టు', 'పువ్వు', 'ఆకు'], correct: 1 },
  ],
  malayalam: [
    { emoji: '🍎', options: ['പഴം', 'വെള്ളം', 'വീട്', 'മരം'], correct: 0 },
    { emoji: '🏠', options: ['സ്കൂൾ', 'മരം', 'വീട്', 'അമ്പലം'], correct: 2 },
    { emoji: '🚗', options: ['കാർ', 'സൈക്കിൾ', 'പഴം', 'വണ്ടി'], correct: 0 },
    { emoji: '🐕', options: ['പൂച്ച', 'നായ', 'കുതിര', 'പശു'], correct: 1 },
    { emoji: '🌳', options: ['വള്ളി', 'മരം', 'പൂവ്', 'ഇല'], correct: 1 },
  ],
  kannada: [
    { emoji: '🍎', options: ['ಹಣ್ಣು', 'ನೀರು', 'ಮನೆ', 'ಮರ'], correct: 0 },
    { emoji: '🏠', options: ['ಶಾಲೆ', 'ಮರ', 'ಮನೆ', 'ದೇವಾಲಯ'], correct: 2 },
    { emoji: '🚗', options: ['ಕಾರು', 'ಸೈಕಲ್', 'ಹಣ್ಣು', 'ಗಾಡಿ'], correct: 0 },
    { emoji: '🐕', options: ['ಬೆಕ್ಕು', 'ನಾಯಿ', 'ಕುದುರೆ', 'ಹಸು'], correct: 1 },
    { emoji: '🌳', options: ['ಬಳ್ಳಿ', 'ಮರ', 'ಹೂವು', 'ಎಲೆ'], correct: 1 },
  ]
};

export const CULTURE_DATA: Record<string, any> = {
  tamil: {
    heroTitle: 'விருந்தோம்பல் (Virunthombal)',
    heroDesc: 'The ancient Tamil tradition of unparalleled hospitality.',
    festivals: [
      { id: 'pongal', title: 'Pongal (பொங்கல்)', desc: 'The Tamil harvest festival.', vocab: 'கரும்பு (Sugarcane)', icon: '🌾', color: '#FEF3C7' },
      { id: 'diwali', title: 'Deepavali (தீபாவளி)', desc: 'The festival of lights.', vocab: 'பட்டாசு (Firecrackers)', icon: '🪔', color: '#FEE2E2' },
      { id: 'newyear', title: 'Tamil New Year (புத்தாண்டு)', desc: 'Puthandu marks the first day of the year.', vocab: 'மாங்காய் (Mango)', icon: '🌞', color: '#D1FAE5' }
    ],
    arts: [
      { title: 'Bharatanatyam', icon: '💃', desc: 'Classical Dance' },
      { title: 'Carnatic Music', icon: '🎶', desc: 'Classical Vocal' },
      { title: 'Silambam', icon: '🎋', desc: 'Martial Art' },
      { title: 'Kolam', icon: '🏵️', desc: 'Floor Art' },
    ]
  },
  hindi: {
    heroTitle: 'अतिथि देवो भव (Atithi Devo Bhava)',
    heroDesc: 'The Sanskrit/Hindi tradition meaning "The guest is equivalent to God".',
    festivals: [
      { id: 'holi', title: 'Holi (होली)', desc: 'The festival of colors.', vocab: 'रंग (Colors)', icon: '🎨', color: '#FCE7F3' },
      { id: 'diwali', title: 'Diwali (दिवाली)', desc: 'The festival of lights.', vocab: 'दीया (Lamp)', icon: '🪔', color: '#FEE2E2' },
      { id: 'navratri', title: 'Navratri (नवरात्रि)', desc: 'A nine-night festival.', vocab: 'गरबा (Garba)', icon: '💃', color: '#E0E7FF' }
    ],
    arts: [
      { title: 'Kathak', icon: '💃', desc: 'Classical Dance' },
      { title: 'Hindustani', icon: '🎶', desc: 'Classical Vocal' },
      { title: 'Kushti', icon: '🤼', desc: 'Wrestling' },
      { title: 'Rangoli', icon: '🏵️', desc: 'Floor Art' },
    ]
  },
  telugu: {
    heroTitle: 'అతిథి మర్యాద (Atithi Maryada)',
    heroDesc: 'The Telugu tradition of deep respect and care for guests.',
    festivals: [
      { id: 'ugadi', title: 'Ugadi (ఉగాది)', desc: 'The Telugu New Year.', vocab: 'పచ్చడి (Pickle/Chutney)', icon: '🌿', color: '#D1FAE5' },
      { id: 'sankranti', title: 'Sankranti (సంక్రాంతి)', desc: 'Harvest festival.', vocab: 'గాలిపటం (Kite)', icon: '🪁', color: '#FEF3C7' },
      { id: 'bathukamma', title: 'Bathukamma (బతుకమ్మ)', desc: 'Floral festival.', vocab: 'పూలు (Flowers)', icon: '🌸', color: '#FCE7F3' }
    ],
    arts: [
      { title: 'Kuchipudi', icon: '💃', desc: 'Classical Dance' },
      { title: 'Carnatic', icon: '🎶', desc: 'Classical Vocal' },
      { title: 'Kalamkari', icon: '🎨', desc: 'Textile Art' },
      { title: 'Muggulu', icon: '🏵️', desc: 'Floor Art' },
    ]
  },
  malayalam: {
    heroTitle: 'അതിഥി സത്കാരം (Athidhi Sathkaram)',
    heroDesc: 'The Kerala tradition of warm and grand hospitality.',
    festivals: [
      { id: 'onam', title: 'Onam (ഓണം)', desc: 'The grand harvest festival of Kerala.', vocab: 'പൂക്കളം (Floral Carpet)', icon: '🌸', color: '#FEF3C7' },
      { id: 'vishu', title: 'Vishu (വിഷു)', desc: 'Kerala New Year.', vocab: 'കണി (Auspicious sight)', icon: '🌞', color: '#D1FAE5' },
      { id: 'pooram', title: 'Thrissur Pooram', desc: 'Grand temple festival.', vocab: 'ആന (Elephant)', icon: '🐘', color: '#E0E7FF' }
    ],
    arts: [
      { title: 'Kathakali', icon: '🎭', desc: 'Classical Dance' },
      { title: 'Mohiniyattam', icon: '💃', desc: 'Classical Dance' },
      { title: 'Kalaripayattu', icon: '🤺', desc: 'Martial Art' },
      { title: 'Sopana', icon: '🎶', desc: 'Temple Music' },
    ]
  },
  kannada: {
    heroTitle: 'ಅತಿಥಿ ಸತ್ಕಾರ (Atithi Satkara)',
    heroDesc: 'The Kannada tradition of welcoming guests with open arms.',
    festivals: [
      { id: 'dasara', title: 'Mysuru Dasara (ದಸರಾ)', desc: 'The grand state festival.', vocab: 'ಆನೆ (Elephant)', icon: '🐘', color: '#FEF3C7' },
      { id: 'ugadi', title: 'Ugadi (ಯುಗಾದಿ)', desc: 'The Kannada New Year.', vocab: 'ಬೇವು-ಬೆಲ್ಲ (Neem-Jaggery)', icon: '🌿', color: '#D1FAE5' },
      { id: 'sankranti', title: 'Makara Sankranti', desc: 'Harvest festival.', vocab: 'ಎಳ್ಳು (Sesame)', icon: '🪁', color: '#FEE2E2' }
    ],
    arts: [
      { title: 'Yakshagana', icon: '🎭', desc: 'Traditional Theater' },
      { title: 'Carnatic', icon: '🎶', desc: 'Classical Vocal' },
      { title: 'Dollu Kunitha', icon: '🥁', desc: 'Folk Dance' },
      { title: 'Rangoli', icon: '🏵️', desc: 'Floor Art' },
    ]
  }
};

export const SENTENCE_GAME_POOLS: Record<string, Array<{ original: string, english: string, words: string[] }>> = {
  tamil: [
    { original: 'நான் பள்ளிக்கு செல்கிறேன்', english: 'I go to school', words: ['நான்', 'செல்கிறேன்', 'பள்ளிக்கு'] },
    { original: 'அவன் தண்ணீர் குடிக்கிறான்', english: 'He is drinking water', words: ['தண்ணீர்', 'அவன்', 'குடிக்கிறான்'] },
    { original: 'நாங்கள் விளையாடுகிறோம்', english: 'We are playing', words: ['விளையாடுகிறோம்', 'நாங்கள்'] },
    { original: 'அவள் புத்தகம் படிக்கிறாள்', english: 'She is reading a book', words: ['புத்தகம்', 'அவள்', 'படிக்கிறாள்'] },
    { original: 'இது ஒரு புத்தகம்', english: 'This is a book', words: ['இது', 'ஒரு', 'புத்தகம்'] }
  ],
  hindi: [
    { original: 'मैं स्कूल जाता हूँ', english: 'I go to school', words: ['मैं', 'स्कूल', 'जाता', 'हूँ'] },
    { original: 'वह पानी पीता है', english: 'He is drinking water', words: ['पानी', 'वह', 'पीता', 'है'] },
    { original: 'हम खेल रहे हैं', english: 'We are playing', words: ['खेल', 'हम', 'रहे', 'हैं'] },
    { original: 'वह किताब पढ़ रही है', english: 'She is reading a book', words: ['किताब', 'वह', 'पढ़', 'रही', 'है'] },
    { original: 'यह एक किताब है', english: 'This is a book', words: ['यह', 'एक', 'किताब', 'है'] }
  ],
  telugu: [
    { original: 'నేను పాఠశాలకు వెళ్తాను', english: 'I go to school', words: ['నేను', 'పాఠశాలకు', 'వెళ్తాను'] },
    { original: 'అతను నీరు తాగుతున్నాడు', english: 'He is drinking water', words: ['నీరు', 'అతను', 'తాగుతున్నాడు'] },
    { original: 'మేము ఆడుతున్నాము', english: 'We are playing', words: ['ఆడుతున్నాము', 'మేము'] },
    { original: 'ఆమె పుస్తకం చదువుతోంది', english: 'She is reading a book', words: ['పుస్తకం', 'ఆమె', 'చదువుతోంది'] },
    { original: 'ఇది ఒక పుస్తకం', english: 'This is a book', words: ['ఇది', 'ఒక', 'పుస్తకం'] }
  ],
  malayalam: [
    { original: 'ഞാൻ സ്കൂളിൽ പോകുന്നു', english: 'I go to school', words: ['ഞാൻ', 'സ്കൂളിൽ', 'പോകുന്നു'] },
    { original: 'അവൻ വെള്ളം കുടിക്കുന്നു', english: 'He is drinking water', words: ['വെള്ളം', 'അവൻ', 'കുടിക്കുന്നു'] },
    { original: 'ഞങ്ങൾ കളിക്കുന്നു', english: 'We are playing', words: ['കളിക്കുന്നു', 'ഞങ്ങൾ'] },
    { original: 'അവൾ പുസ്തകം വായിക്കുന്നു', english: 'She is reading a book', words: ['പുസ്തകം', 'അവൾ', 'വായിക്കുന്നു'] },
    { original: 'ഇതൊരു പുസ്തകമാണ്', english: 'This is a book', words: ['ഇതൊരു', 'പുസ്തകമാണ്'] }
  ],
  kannada: [
    { original: 'ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ', english: 'I go to school', words: ['ನಾನು', 'ಶಾಲೆಗೆ', 'ಹೋಗುತ್ತೇನೆ'] },
    { original: 'ಅವನು ನೀರು ಕುಡಿಯುತ್ತಿದ್ದಾನೆ', english: 'He is drinking water', words: ['ನೀರು', 'ಅವನು', 'ಕುಡಿಯುತ್ತಿದ್ದಾನೆ'] },
    { original: 'ನಾವು ಆಡುತ್ತಿದ್ದೇವೆ', english: 'We are playing', words: ['ಆಡುತ್ತಿದ್ದೇವೆ', 'ನಾವು'] },
    { original: 'ಅವಳು ಪುಸ್ತಕ ಓದುತ್ತಿದ್ದಾಳೆ', english: 'She is reading a book', words: ['ಪುಸ್ತಕ', 'ಅವಳು', 'ಓದುತ್ತಿದ್ದಾಳೆ'] },
    { original: 'ಇದು ಒಂದು ಪುಸ್ತಕ', english: 'This is a book', words: ['ಇದು', 'ಒಂದು', 'ಪುಸ್ತಕ'] }
  ]
};

export const QUIZ_POOLS: Record<string, Array<{ target: string, options: string[], correct: number }>> = {
  tamil: [
    { target: 'வணக்கம்', options: ["Hello","Road","Good","Listen"], correct: 0 },
    { target: 'நன்றி', options: ["Thank you","House","Mother","Help"], correct: 0 },
    { target: 'ஆமாம்', options: ["Yes","Hello","Happy","Money"], correct: 0 },
    { target: 'இல்லை', options: ["No","Read","Big","Car"], correct: 0 },
    { target: 'தயவுசெய்து', options: ["No","Please","Water","Work"], correct: 1 },
    { target: 'தண்ணீர்', options: ["Listen","Good","Water","Friend"], correct: 2 },
    { target: 'உணவு', options: ["Write","Food","Come","Sleep"], correct: 1 },
    { target: 'வீடு', options: ["Help","House","Cat","Thank you"], correct: 1 },
    { target: 'புத்தகம்', options: ["Train","Book","Write","Sun"], correct: 1 },
    { target: 'பள்ளி', options: ["No","Tomorrow","School","Stop"], correct: 2 },
    { target: 'நண்பன்', options: ["Bad","Day","Bird","Friend"], correct: 3 },
    { target: 'குடும்பம்', options: ["Family","Road","Come","Car"], correct: 0 },
    { target: 'அம்மா', options: ["Book","Car","Yesterday","Mother"], correct: 3 },
    { target: 'அப்பா', options: ["Good","Book","Go","Father"], correct: 3 },
    { target: 'காதல்', options: ["Family","Love","Stop","Please"], correct: 1 },
    { target: 'நேரம்', options: ["Car","Mother","Time","Drink"], correct: 2 },
    { target: 'நாள்', options: ["Day","House","Car","Moon"], correct: 0 },
    { target: 'இரவு', options: ["Hello","Night","Time","Thank you"], correct: 1 },
    { target: 'இன்று', options: ["Money","Sad","Today","Hello"], correct: 2 },
    { target: 'நாளை', options: ["Look","Tomorrow","Father","Dog"], correct: 1 },
    { target: 'நேற்று', options: ["Yesterday","Water","Speak","Listen"], correct: 0 },
    { target: 'சூரியன்', options: ["Stop","Sun","Train","Car"], correct: 1 },
    { target: 'சந்திரன்', options: ["Bad","Drink","Moon","Father"], correct: 2 },
    { target: 'மரம்', options: ["Tree","Sun","Big","Yes"], correct: 0 },
    { target: 'பூ', options: ["Flower","Big","Book","Stop"], correct: 0 },
    { target: 'பூனை', options: ["Money","Help","Family","Cat"], correct: 3 },
    { target: 'நாய்', options: ["Dog","Night","Father","Train"], correct: 0 },
    { target: 'பறவை', options: ["Water","Drink","Yes","Bird"], correct: 3 },
    { target: 'சாலை', options: ["Please","Tomorrow","Road","Stop"], correct: 2 },
    { target: 'கார்', options: ["Car","Yesterday","Stop","Food"], correct: 0 },
    { target: 'ரயில்', options: ["Go","Train","Father","Sad"], correct: 1 },
    { target: 'பணம்', options: ["No","Go","Train","Money"], correct: 3 },
    { target: 'வேலை', options: ["Dog","Water","Food","Work"], correct: 3 },
    { target: 'உதவி', options: ["Tree","Night","Help","Good"], correct: 2 },
    { target: 'நிறுத்து', options: ["Stop","Mother","Day","Father"], correct: 0 },
    { target: 'செல்', options: ["Go","Flower","Today","Moon"], correct: 0 },
    { target: 'வா', options: ["Come","Look","Please","House"], correct: 0 },
    { target: 'சாப்பிடு', options: ["Food","Eat","Time","Happy"], correct: 1 },
    { target: 'குடி', options: ["Write","Speak","Drink","Bird"], correct: 2 },
    { target: 'தூங்கு', options: ["Today","Sleep","Happy","No"], correct: 1 },
    { target: 'படி', options: ["Read","Please","Water","Happy"], correct: 0 },
    { target: 'எழுது', options: ["Write","Drink","Time","Good"], correct: 0 },
    { target: 'பேசு', options: ["Speak","Book","Food","Come"], correct: 0 },
    { target: 'கேள்', options: ["Bird","Help","Sleep","Listen"], correct: 3 },
    { target: 'பார்', options: ["Look","Come","Big","Train"], correct: 0 },
    { target: 'மகிழ்ச்சி', options: ["Sun","Read","Father","Happy"], correct: 3 },
    { target: 'சோகம்', options: ["Tree","Big","Dog","Sad"], correct: 3 },
    { target: 'நல்லது', options: ["Good","Dog","Water","Car"], correct: 0 },
    { target: 'கெட்டது', options: ["Write","Bad","Road","Tomorrow"], correct: 1 },
    { target: 'பெரிய', options: ["Flower","Big","Family","Good"], correct: 1 },
  ],
  hindi: [
    { target: 'नमस्ते', options: ["Tomorrow","Happy","Hello","Bad"], correct: 2 },
    { target: 'धन्यवाद', options: ["Thank you","Good","Please","Eat"], correct: 0 },
    { target: 'हाँ', options: ["Flower","Yes","Work","Bird"], correct: 1 },
    { target: 'नहीं', options: ["Good","Car","No","Time"], correct: 2 },
    { target: 'कृपया', options: ["Please","Thank you","Car","Work"], correct: 0 },
    { target: 'पानी', options: ["Come","Food","Water","Father"], correct: 2 },
    { target: 'खाना', options: ["Food","Today","Water","Night"], correct: 0 },
    { target: 'घर', options: ["House","Day","Dog","Please"], correct: 0 },
    { target: 'किताब', options: ["Mother","Dog","Help","Book"], correct: 3 },
    { target: 'स्कूल', options: ["Day","Money","School","No"], correct: 2 },
    { target: 'दोस्त', options: ["Come","Friend","Big","Speak"], correct: 1 },
    { target: 'परिवार', options: ["Flower","Come","Today","Family"], correct: 3 },
    { target: 'माँ', options: ["Day","Mother","Work","Good"], correct: 1 },
    { target: 'पिता', options: ["Sun","Mother","Today","Father"], correct: 3 },
    { target: 'प्यार', options: ["Stop","Dog","Love","Time"], correct: 2 },
    { target: 'समय', options: ["Sun","Read","Water","Time"], correct: 3 },
    { target: 'दिन', options: ["Day","No","Write","Yesterday"], correct: 0 },
    { target: 'रात', options: ["Night","Tomorrow","Today","Eat"], correct: 0 },
    { target: 'आज', options: ["Love","Today","Thank you","Bird"], correct: 1 },
    { target: 'कल', options: ["Big","Train","Tomorrow","Good"], correct: 2 },
    { target: 'कल (बीता हुआ)', options: ["Love","Flower","Yesterday","Hello"], correct: 2 },
    { target: 'सूरज', options: ["Moon","Sun","Water","Stop"], correct: 1 },
    { target: 'चाँद', options: ["No","Eat","Moon","Speak"], correct: 2 },
    { target: 'पेड़', options: ["Tree","Water","House","Father"], correct: 0 },
    { target: 'फूल', options: ["Flower","Cat","Help","Food"], correct: 0 },
    { target: 'बिल्ली', options: ["Family","Work","Thank you","Cat"], correct: 3 },
    { target: 'कुत्ता', options: ["Dog","Help","Moon","Eat"], correct: 0 },
    { target: 'पक्षी', options: ["Stop","Cat","No","Bird"], correct: 3 },
    { target: 'सड़क', options: ["Thank you","Today","Road","Bird"], correct: 2 },
    { target: 'कार', options: ["Car","Hello","Sleep","Happy"], correct: 0 },
    { target: 'ट्रेन', options: ["Train","Friend","Water","Stop"], correct: 0 },
    { target: 'पैसे', options: ["Please","Dog","Money","Speak"], correct: 2 },
    { target: 'काम', options: ["Help","Work","Cat","Look"], correct: 1 },
    { target: 'मदद', options: ["Bad","Help","Father","Mother"], correct: 1 },
    { target: 'रुको', options: ["Stop","Sad","Sun","Bad"], correct: 0 },
    { target: 'जाओ', options: ["Car","Go","Drink","Yes"], correct: 1 },
    { target: 'आओ', options: ["Happy","Come","Work","Family"], correct: 1 },
    { target: 'खाओ', options: ["Eat","Work","Yes","Road"], correct: 0 },
    { target: 'पियो', options: ["Time","Drink","Work","Tree"], correct: 1 },
    { target: 'सो जाओ', options: ["House","Sleep","Sun","Mother"], correct: 1 },
    { target: 'पढ़ो', options: ["Read","Look","Bad","Cat"], correct: 0 },
    { target: 'लिखो', options: ["Write","Good","Time","Book"], correct: 0 },
    { target: 'बोलो', options: ["Speak","Yes","Friend","Please"], correct: 0 },
    { target: 'सुनो', options: ["Listen","Thank you","Flower","Family"], correct: 0 },
    { target: 'देखो', options: ["Look","Come","Moon","Help"], correct: 0 },
    { target: 'खुश', options: ["Happy","Love","Listen","School"], correct: 0 },
    { target: 'उदास', options: ["Sad","Good","Work","Road"], correct: 0 },
    { target: 'अच्छा', options: ["Yesterday","Good","Work","Moon"], correct: 1 },
    { target: 'बुरा', options: ["Drink","Please","Bad","Night"], correct: 2 },
    { target: 'बड़ा', options: ["Big","Work","Father","Speak"], correct: 0 },
  ],
  telugu: [
    { target: 'నమస్కారం', options: ["Hello","Tomorrow","Help","Read"], correct: 0 },
    { target: 'ధన్యవాదాలు', options: ["Sleep","Thank you","Train","Food"], correct: 1 },
    { target: 'అవును', options: ["Yes","Bird","Sun","Bad"], correct: 0 },
    { target: 'కాదు', options: ["Happy","Sun","No","Food"], correct: 2 },
    { target: 'దయచేసి', options: ["Sleep","Please","Help","Friend"], correct: 1 },
    { target: 'నీరు', options: ["Drink","Work","Flower","Water"], correct: 3 },
    { target: 'ఆహారం', options: ["Train","House","Food","Read"], correct: 2 },
    { target: 'ఇల్లు', options: ["Money","Road","Tomorrow","House"], correct: 3 },
    { target: 'పుస్తకం', options: ["Happy","Road","Thank you","Book"], correct: 3 },
    { target: 'పాఠశాల', options: ["House","School","Look","Night"], correct: 1 },
    { target: 'స్నేహితుడు', options: ["Listen","Come","Friend","Road"], correct: 2 },
    { target: 'కుటుంబం', options: ["Help","Yesterday","Listen","Family"], correct: 3 },
    { target: 'అమ్మ', options: ["Money","Look","Mother","Sun"], correct: 2 },
    { target: 'నాన్న', options: ["Father","Read","Big","Train"], correct: 0 },
    { target: 'ప్రేమ', options: ["Go","Love","Hello","House"], correct: 1 },
    { target: 'సమయం', options: ["Mother","Write","Good","Time"], correct: 3 },
    { target: 'రోజు', options: ["Family","Tomorrow","Hello","Day"], correct: 3 },
    { target: 'రాత్రి', options: ["Good","Write","Bad","Night"], correct: 3 },
    { target: 'నేడు', options: ["Go","Tomorrow","Today","Love"], correct: 2 },
    { target: 'రేపు', options: ["Please","Look","Tomorrow","School"], correct: 2 },
    { target: 'నిన్న', options: ["Yesterday","Drink","Dog","Water"], correct: 0 },
    { target: 'సూర్యుడు', options: ["Sun","Yes","Bad","Speak"], correct: 0 },
    { target: 'చంద్రుడు', options: ["Moon","Father","Please","Cat"], correct: 0 },
    { target: 'చెట్టు', options: ["Tree","Drink","Eat","House"], correct: 0 },
    { target: 'పువ్వు', options: ["Write","Sleep","Flower","Good"], correct: 2 },
    { target: 'పిల్లి', options: ["Time","Cat","Please","Help"], correct: 1 },
    { target: 'కుక్క', options: ["Listen","Flower","Help","Dog"], correct: 3 },
    { target: 'పక్షి', options: ["Thank you","Bird","Mother","Sun"], correct: 1 },
    { target: 'రహదారి', options: ["Sun","Road","Sleep","Bad"], correct: 1 },
    { target: 'కారు', options: ["Eat","Read","Water","Car"], correct: 3 },
    { target: 'రైలు', options: ["Food","Moon","Train","Tomorrow"], correct: 2 },
    { target: 'డబ్బు', options: ["Road","Money","Hello","Happy"], correct: 1 },
    { target: 'పని', options: ["Train","No","Book","Work"], correct: 3 },
    { target: 'సహాయం', options: ["Cat","Help","Water","Tomorrow"], correct: 1 },
    { target: 'ఆపు', options: ["Speak","Love","Stop","Good"], correct: 2 },
    { target: 'వెళ్ళు', options: ["School","House","Go","Water"], correct: 2 },
    { target: 'రా', options: ["Drink","Listen","Come","Work"], correct: 2 },
    { target: 'తిను', options: ["Moon","Eat","Sleep","Sun"], correct: 1 },
    { target: 'త్రాగు', options: ["Help","Drink","Listen","Look"], correct: 1 },
    { target: 'నిద్రపో', options: ["Family","Day","Sleep","Big"], correct: 2 },
    { target: 'చదువు', options: ["Big","Car","Read","Stop"], correct: 2 },
    { target: 'రాయి', options: ["Write","Happy","Friend","Train"], correct: 0 },
    { target: 'మాట్లాడు', options: ["Water","Speak","Come","Go"], correct: 1 },
    { target: 'విను', options: ["Good","Time","Listen","Tree"], correct: 2 },
    { target: 'చూడు', options: ["Look","Night","Cat","Sad"], correct: 0 },
    { target: 'సంతోషం', options: ["Tree","Sad","Happy","Dog"], correct: 2 },
    { target: 'విచారం', options: ["Flower","Sad","Eat","Cat"], correct: 1 },
    { target: 'మంచిది', options: ["Day","Good","Sun","Tomorrow"], correct: 1 },
    { target: 'చెడ్డది', options: ["House","Good","Big","Bad"], correct: 3 },
    { target: 'పెద్ద', options: ["Hello","Big","Come","Speak"], correct: 1 },
  ],
  malayalam: [
    { target: 'നമസ്കാരം', options: ["Moon","Drink","Hello","Flower"], correct: 2 },
    { target: 'നന്ദി', options: ["Come","Thank you","Go","Book"], correct: 1 },
    { target: 'അതെ', options: ["Yes","Come","Car","Bird"], correct: 0 },
    { target: 'ഇല്ല', options: ["No","Big","School","Work"], correct: 0 },
    { target: 'ദയവായി', options: ["Day","Read","Bird","Please"], correct: 3 },
    { target: 'വെള്ളം', options: ["Speak","Sleep","Water","Money"], correct: 2 },
    { target: 'ഭക്ഷണം', options: ["Food","Yesterday","Car","Hello"], correct: 0 },
    { target: 'വീട്', options: ["House","Stop","Tree","Money"], correct: 0 },
    { target: 'പുസ്തകം', options: ["Moon","Book","Hello","Cat"], correct: 1 },
    { target: 'സ്കൂൾ', options: ["Tree","Bird","School","No"], correct: 2 },
    { target: 'സുഹൃത്ത്', options: ["Friend","Yes","Stop","Train"], correct: 0 },
    { target: 'കുടുംബം', options: ["Family","Water","No","Food"], correct: 0 },
    { target: 'അമ്മ', options: ["Mother","Book","Love","Yesterday"], correct: 0 },
    { target: 'അച്ഛൻ', options: ["Father","Bad","Yesterday","Car"], correct: 0 },
    { target: 'സ്നേഹം', options: ["Sleep","Help","Love","Dog"], correct: 2 },
    { target: 'സമയം', options: ["Time","Help","Go","Listen"], correct: 0 },
    { target: 'ദിവസം', options: ["Happy","Day","Speak","Listen"], correct: 1 },
    { target: 'രാത്രി', options: ["Thank you","Night","Friend","Go"], correct: 1 },
    { target: 'ഇന്ന്', options: ["Money","Today","Read","Listen"], correct: 1 },
    { target: 'നാളെ', options: ["Train","Tomorrow","Flower","Food"], correct: 1 },
    { target: 'ഇന്നലെ', options: ["Listen","Yesterday","Big","Moon"], correct: 1 },
    { target: 'സൂര്യൻ', options: ["Mother","Yes","Sun","Bird"], correct: 2 },
    { target: 'ചന്ദ്രൻ', options: ["Sun","Moon","Stop","Friend"], correct: 1 },
    { target: 'മരം', options: ["Tree","Train","Tomorrow","Night"], correct: 0 },
    { target: 'പൂവ്', options: ["Friend","Good","Flower","Car"], correct: 2 },
    { target: 'പൂച്ച', options: ["No","Cat","Road","Sun"], correct: 1 },
    { target: 'നായ', options: ["Dog","Sun","Today","Look"], correct: 0 },
    { target: 'പക്ഷി', options: ["Bird","School","Book","Yes"], correct: 0 },
    { target: 'റോഡ്', options: ["Please","Road","Moon","Family"], correct: 1 },
    { target: 'കാർ', options: ["Car","Tree","Read","Food"], correct: 0 },
    { target: 'ട്രെയിൻ', options: ["Flower","Eat","Tomorrow","Train"], correct: 3 },
    { target: 'പണം', options: ["Family","Money","Speak","Write"], correct: 1 },
    { target: 'ജോലി', options: ["Work","Water","Bird","Read"], correct: 0 },
    { target: 'സഹായം', options: ["Help","Please","Flower","Dog"], correct: 0 },
    { target: 'നിർത്തുക', options: ["Stop","Family","Day","Moon"], correct: 0 },
    { target: 'പോവുക', options: ["Water","Go","Bad","Mother"], correct: 1 },
    { target: 'വരൂ', options: ["No","Bad","Come","Yes"], correct: 2 },
    { target: 'കഴിക്കുക', options: ["Please","Eat","Dog","Thank you"], correct: 1 },
    { target: 'കുടിക്കുക', options: ["Eat","Drink","Night","Friend"], correct: 1 },
    { target: 'ഉറങ്ങുക', options: ["Sleep","Hello","No","Day"], correct: 0 },
    { target: 'വായിക്കുക', options: ["Yes","Read","Happy","Car"], correct: 1 },
    { target: 'എഴുതുക', options: ["Go","Big","Write","Work"], correct: 2 },
    { target: 'സംസാരിക്കുക', options: ["Friend","Drink","Stop","Speak"], correct: 3 },
    { target: 'കേൾക്കുക', options: ["Happy","Father","Listen","Love"], correct: 2 },
    { target: 'നോക്കുക', options: ["Train","Come","Look","Thank you"], correct: 2 },
    { target: 'സന്തോഷം', options: ["Go","Happy","Tomorrow","Sun"], correct: 1 },
    { target: 'ദുഃഖം', options: ["Book","Sad","Food","Big"], correct: 1 },
    { target: 'നല്ലത്', options: ["School","Water","Look","Good"], correct: 3 },
    { target: 'ചീത്ത', options: ["Speak","Night","Sad","Bad"], correct: 3 },
    { target: 'വലിയ', options: ["Bad","Write","Big","Yes"], correct: 2 },
  ],
  kannada: [
    { target: 'ನಮಸ್ಕಾರ', options: ["Hello","Father","Speak","Time"], correct: 0 },
    { target: 'ಧನ್ಯವಾದ', options: ["Thank you","Yes","Sun","Today"], correct: 0 },
    { target: 'ಹೌದು', options: ["Hello","Yes","Moon","Tree"], correct: 1 },
    { target: 'ಇಲ್ಲ', options: ["Sleep","Bird","Today","No"], correct: 3 },
    { target: 'ದಯವಿಟ್ಟು', options: ["Yesterday","Go","Please","Mother"], correct: 2 },
    { target: 'ನೀರು', options: ["Water","Help","Bird","Night"], correct: 0 },
    { target: 'ಆಹಾರ', options: ["Father","Friend","Food","Money"], correct: 2 },
    { target: 'ಮನೆ', options: ["School","Come","House","Tree"], correct: 2 },
    { target: 'ಪುಸ್ತಕ', options: ["Read","Book","Go","Train"], correct: 1 },
    { target: 'ಶಾಲೆ', options: ["Water","Bird","School","Speak"], correct: 2 },
    { target: 'ಸ್ನೇಹಿತ', options: ["Listen","Speak","Friend","Yesterday"], correct: 2 },
    { target: 'ಕುಟುಂಬ', options: ["Look","Family","Hello","Tree"], correct: 1 },
    { target: 'ಅಮ್ಮ', options: ["Read","Mother","Dog","Good"], correct: 1 },
    { target: 'ಅಪ್ಪ', options: ["Yes","Time","Happy","Father"], correct: 3 },
    { target: 'ಪ್ರೀತಿ', options: ["Love","Mother","Road","Good"], correct: 0 },
    { target: 'ಸಮಯ', options: ["Book","Stop","Thank you","Time"], correct: 3 },
    { target: 'ದಿನ', options: ["Work","Day","Tree","Good"], correct: 1 },
    { target: 'ರಾತ್ರಿ', options: ["Night","Time","No","Come"], correct: 0 },
    { target: 'ಇಂದು', options: ["Sad","Sun","Today","Moon"], correct: 2 },
    { target: 'ನಾಳೆ', options: ["Tomorrow","Good","Car","Read"], correct: 0 },
    { target: 'ನಿನ್ನೆ', options: ["Yesterday","Drink","Time","Look"], correct: 0 },
    { target: 'ಸೂರ್ಯ', options: ["Sun","Mother","Sleep","Happy"], correct: 0 },
    { target: 'ಚಂದ್ರ', options: ["Read","Night","Moon","Please"], correct: 2 },
    { target: 'ಮರ', options: ["Moon","Food","Tree","Read"], correct: 2 },
    { target: 'ಹೂವು', options: ["Family","Cat","Flower","Listen"], correct: 2 },
    { target: 'ಬೆಕ್ಕು', options: ["Good","Cat","Water","Sad"], correct: 1 },
    { target: 'ನಾಯಿ', options: ["Stop","School","Hello","Dog"], correct: 3 },
    { target: 'ಹಕ್ಕಿ', options: ["Time","Book","Road","Bird"], correct: 3 },
    { target: 'ರಸ್ತೆ', options: ["Bad","Road","Thank you","Food"], correct: 1 },
    { target: 'ಕಾರು', options: ["Bird","Cat","Car","Family"], correct: 2 },
    { target: 'ರೈಲು', options: ["Good","Mother","Train","Sad"], correct: 2 },
    { target: 'ಹಣ', options: ["Sleep","Money","Speak","Thank you"], correct: 1 },
    { target: 'ಕೆಲಸ', options: ["Flower","Work","House","Sad"], correct: 1 },
    { target: 'ಸಹಾಯ', options: ["Help","School","Hello","Yesterday"], correct: 0 },
    { target: 'ನಿಲ್ಲಿಸು', options: ["Mother","Stop","Hello","Big"], correct: 1 },
    { target: 'ಹೋಗು', options: ["Go","Tomorrow","Help","Thank you"], correct: 0 },
    { target: 'ಬಾ', options: ["Drink","Stop","Come","Bird"], correct: 2 },
    { target: 'ತಿನ್ನು', options: ["Eat","Money","Stop","Go"], correct: 0 },
    { target: 'ಕುಡಿ', options: ["Drink","Listen","Sun","Help"], correct: 0 },
    { target: 'ಮಲಗು', options: ["Sun","Sleep","Tomorrow","Road"], correct: 1 },
    { target: 'ಓದು', options: ["Train","Read","Please","House"], correct: 1 },
    { target: 'ಬರೆ', options: ["Train","Read","Book","Write"], correct: 3 },
    { target: 'ಮಾತನಾಡು', options: ["Look","Write","Thank you","Speak"], correct: 3 },
    { target: 'ಕೇಳು', options: ["Big","School","Listen","Bird"], correct: 2 },
    { target: 'ನೋಡು', options: ["Time","Look","Help","Family"], correct: 1 },
    { target: 'ಸಂತೋಷ', options: ["Sad","Happy","Road","Hello"], correct: 1 },
    { target: 'ದುಃಖ', options: ["Hello","Sad","Moon","Food"], correct: 1 },
    { target: 'ಒಳ್ಳೆಯದು', options: ["Work","Good","Book","Money"], correct: 1 },
    { target: 'ಕೆಟ್ಟದು', options: ["Tomorrow","Bad","Bird","Eat"], correct: 1 },
    { target: 'ದೊಡ್ಡದು', options: ["Eat","Good","Big","Cat"], correct: 2 },
  ],
};

export const PRONOUNCE_GAME_POOLS: Record<string, Array<{ phrase: string, english: string }>> = {
  tamil: [
    { phrase: 'வணக்கம்', english: 'Hello' },
    { phrase: 'நன்றி', english: 'Thank you' },
    { phrase: 'ஆமாம்', english: 'Yes' },
    { phrase: 'இல்லை', english: 'No' },
    { phrase: 'தயவுசெய்து', english: 'Please' },
    { phrase: 'தண்ணீர்', english: 'Water' },
    { phrase: 'உணவு', english: 'Food' },
    { phrase: 'வீடு', english: 'House' },
    { phrase: 'புத்தகம்', english: 'Book' },
    { phrase: 'பள்ளி', english: 'School' },
    { phrase: 'நண்பன்', english: 'Friend' },
    { phrase: 'குடும்பம்', english: 'Family' },
    { phrase: 'அம்மா', english: 'Mother' },
    { phrase: 'அப்பா', english: 'Father' },
    { phrase: 'காதல்', english: 'Love' },
    { phrase: 'நேரம்', english: 'Time' },
    { phrase: 'நாள்', english: 'Day' },
    { phrase: 'இரவு', english: 'Night' },
    { phrase: 'இன்று', english: 'Today' },
    { phrase: 'நாளை', english: 'Tomorrow' },
    { phrase: 'நேற்று', english: 'Yesterday' },
    { phrase: 'சூரியன்', english: 'Sun' },
    { phrase: 'சந்திரன்', english: 'Moon' },
    { phrase: 'மரம்', english: 'Tree' },
    { phrase: 'பூ', english: 'Flower' },
    { phrase: 'பூனை', english: 'Cat' },
    { phrase: 'நாய்', english: 'Dog' },
    { phrase: 'பறவை', english: 'Bird' },
    { phrase: 'சாலை', english: 'Road' },
    { phrase: 'கார்', english: 'Car' },
    { phrase: 'ரயில்', english: 'Train' },
    { phrase: 'பணம்', english: 'Money' },
    { phrase: 'வேலை', english: 'Work' },
    { phrase: 'உதவி', english: 'Help' },
    { phrase: 'நிறுத்து', english: 'Stop' },
    { phrase: 'செல்', english: 'Go' },
    { phrase: 'வா', english: 'Come' },
    { phrase: 'சாப்பிடு', english: 'Eat' },
    { phrase: 'குடி', english: 'Drink' },
    { phrase: 'தூங்கு', english: 'Sleep' },
    { phrase: 'படி', english: 'Read' },
    { phrase: 'எழுது', english: 'Write' },
    { phrase: 'பேசு', english: 'Speak' },
    { phrase: 'கேள்', english: 'Listen' },
    { phrase: 'பார்', english: 'Look' },
    { phrase: 'மகிழ்ச்சி', english: 'Happy' },
    { phrase: 'சோகம்', english: 'Sad' },
    { phrase: 'நல்லது', english: 'Good' },
    { phrase: 'கெட்டது', english: 'Bad' },
    { phrase: 'பெரிய', english: 'Big' },
  ],
  hindi: [
    { phrase: 'नमस्ते', english: 'Hello' },
    { phrase: 'धन्यवाद', english: 'Thank you' },
    { phrase: 'हाँ', english: 'Yes' },
    { phrase: 'नहीं', english: 'No' },
    { phrase: 'कृपया', english: 'Please' },
    { phrase: 'पानी', english: 'Water' },
    { phrase: 'खाना', english: 'Food' },
    { phrase: 'घर', english: 'House' },
    { phrase: 'किताब', english: 'Book' },
    { phrase: 'स्कूल', english: 'School' },
    { phrase: 'दोस्त', english: 'Friend' },
    { phrase: 'परिवार', english: 'Family' },
    { phrase: 'माँ', english: 'Mother' },
    { phrase: 'पिता', english: 'Father' },
    { phrase: 'प्यार', english: 'Love' },
    { phrase: 'समय', english: 'Time' },
    { phrase: 'दिन', english: 'Day' },
    { phrase: 'रात', english: 'Night' },
    { phrase: 'आज', english: 'Today' },
    { phrase: 'कल', english: 'Tomorrow' },
    { phrase: 'कल (बीता हुआ)', english: 'Yesterday' },
    { phrase: 'सूरज', english: 'Sun' },
    { phrase: 'चाँद', english: 'Moon' },
    { phrase: 'पेड़', english: 'Tree' },
    { phrase: 'फूल', english: 'Flower' },
    { phrase: 'बिल्ली', english: 'Cat' },
    { phrase: 'कुत्ता', english: 'Dog' },
    { phrase: 'पक्षी', english: 'Bird' },
    { phrase: 'सड़क', english: 'Road' },
    { phrase: 'कार', english: 'Car' },
    { phrase: 'ट्रेन', english: 'Train' },
    { phrase: 'पैसे', english: 'Money' },
    { phrase: 'काम', english: 'Work' },
    { phrase: 'मदद', english: 'Help' },
    { phrase: 'रुको', english: 'Stop' },
    { phrase: 'जाओ', english: 'Go' },
    { phrase: 'आओ', english: 'Come' },
    { phrase: 'खाओ', english: 'Eat' },
    { phrase: 'पियो', english: 'Drink' },
    { phrase: 'सो जाओ', english: 'Sleep' },
    { phrase: 'पढ़ो', english: 'Read' },
    { phrase: 'लिखो', english: 'Write' },
    { phrase: 'बोलो', english: 'Speak' },
    { phrase: 'सुनो', english: 'Listen' },
    { phrase: 'देखो', english: 'Look' },
    { phrase: 'खुश', english: 'Happy' },
    { phrase: 'उदास', english: 'Sad' },
    { phrase: 'अच्छा', english: 'Good' },
    { phrase: 'बुरा', english: 'Bad' },
    { phrase: 'बड़ा', english: 'Big' },
  ],
  telugu: [
    { phrase: 'నమస్కారం', english: 'Hello' },
    { phrase: 'ధన్యవాదాలు', english: 'Thank you' },
    { phrase: 'అవును', english: 'Yes' },
    { phrase: 'కాదు', english: 'No' },
    { phrase: 'దయచేసి', english: 'Please' },
    { phrase: 'నీరు', english: 'Water' },
    { phrase: 'ఆహారం', english: 'Food' },
    { phrase: 'ఇల్లు', english: 'House' },
    { phrase: 'పుస్తకం', english: 'Book' },
    { phrase: 'పాఠశాల', english: 'School' },
    { phrase: 'స్నేహితుడు', english: 'Friend' },
    { phrase: 'కుటుంబం', english: 'Family' },
    { phrase: 'అమ్మ', english: 'Mother' },
    { phrase: 'నాన్న', english: 'Father' },
    { phrase: 'ప్రేమ', english: 'Love' },
    { phrase: 'సమయం', english: 'Time' },
    { phrase: 'రోజు', english: 'Day' },
    { phrase: 'రాత్రి', english: 'Night' },
    { phrase: 'నేడు', english: 'Today' },
    { phrase: 'రేపు', english: 'Tomorrow' },
    { phrase: 'నిన్న', english: 'Yesterday' },
    { phrase: 'సూర్యుడు', english: 'Sun' },
    { phrase: 'చంద్రుడు', english: 'Moon' },
    { phrase: 'చెట్టు', english: 'Tree' },
    { phrase: 'పువ్వు', english: 'Flower' },
    { phrase: 'పిల్లి', english: 'Cat' },
    { phrase: 'కుక్క', english: 'Dog' },
    { phrase: 'పక్షి', english: 'Bird' },
    { phrase: 'రహదారి', english: 'Road' },
    { phrase: 'కారు', english: 'Car' },
    { phrase: 'రైలు', english: 'Train' },
    { phrase: 'డబ్బు', english: 'Money' },
    { phrase: 'పని', english: 'Work' },
    { phrase: 'సహాయం', english: 'Help' },
    { phrase: 'ఆపు', english: 'Stop' },
    { phrase: 'వెళ్ళు', english: 'Go' },
    { phrase: 'రా', english: 'Come' },
    { phrase: 'తిను', english: 'Eat' },
    { phrase: 'త్రాగు', english: 'Drink' },
    { phrase: 'నిద్రపో', english: 'Sleep' },
    { phrase: 'చదువు', english: 'Read' },
    { phrase: 'రాయి', english: 'Write' },
    { phrase: 'మాట్లాడు', english: 'Speak' },
    { phrase: 'విను', english: 'Listen' },
    { phrase: 'చూడు', english: 'Look' },
    { phrase: 'సంతోషం', english: 'Happy' },
    { phrase: 'విచారం', english: 'Sad' },
    { phrase: 'మంచిది', english: 'Good' },
    { phrase: 'చెడ్డది', english: 'Bad' },
    { phrase: 'పెద్ద', english: 'Big' },
  ],
  malayalam: [
    { phrase: 'നമസ്കാരം', english: 'Hello' },
    { phrase: 'നന്ദി', english: 'Thank you' },
    { phrase: 'അതെ', english: 'Yes' },
    { phrase: 'ഇല്ല', english: 'No' },
    { phrase: 'ദയവായി', english: 'Please' },
    { phrase: 'വെള്ളം', english: 'Water' },
    { phrase: 'ഭക്ഷണം', english: 'Food' },
    { phrase: 'വീട്', english: 'House' },
    { phrase: 'പുസ്തകം', english: 'Book' },
    { phrase: 'സ്കൂൾ', english: 'School' },
    { phrase: 'സുഹൃത്ത്', english: 'Friend' },
    { phrase: 'കുടുംബം', english: 'Family' },
    { phrase: 'അമ്മ', english: 'Mother' },
    { phrase: 'അച്ഛൻ', english: 'Father' },
    { phrase: 'സ്നേഹം', english: 'Love' },
    { phrase: 'സമയം', english: 'Time' },
    { phrase: 'ദിവസം', english: 'Day' },
    { phrase: 'രാത്രി', english: 'Night' },
    { phrase: 'ഇന്ന്', english: 'Today' },
    { phrase: 'നാളെ', english: 'Tomorrow' },
    { phrase: 'ഇന്നലെ', english: 'Yesterday' },
    { phrase: 'സൂര്യൻ', english: 'Sun' },
    { phrase: 'ചന്ദ്രൻ', english: 'Moon' },
    { phrase: 'മരം', english: 'Tree' },
    { phrase: 'പൂവ്', english: 'Flower' },
    { phrase: 'പൂച്ച', english: 'Cat' },
    { phrase: 'നായ', english: 'Dog' },
    { phrase: 'പക്ഷി', english: 'Bird' },
    { phrase: 'റോഡ്', english: 'Road' },
    { phrase: 'കാർ', english: 'Car' },
    { phrase: 'ട്രെയിൻ', english: 'Train' },
    { phrase: 'പണം', english: 'Money' },
    { phrase: 'ജോലി', english: 'Work' },
    { phrase: 'സഹായം', english: 'Help' },
    { phrase: 'നിർത്തുക', english: 'Stop' },
    { phrase: 'പോവുക', english: 'Go' },
    { phrase: 'വരൂ', english: 'Come' },
    { phrase: 'കഴിക്കുക', english: 'Eat' },
    { phrase: 'കുടിക്കുക', english: 'Drink' },
    { phrase: 'ഉറങ്ങുക', english: 'Sleep' },
    { phrase: 'വായിക്കുക', english: 'Read' },
    { phrase: 'എഴുതുക', english: 'Write' },
    { phrase: 'സംസാരിക്കുക', english: 'Speak' },
    { phrase: 'കേൾക്കുക', english: 'Listen' },
    { phrase: 'നോക്കുക', english: 'Look' },
    { phrase: 'സന്തോഷം', english: 'Happy' },
    { phrase: 'ദുഃഖം', english: 'Sad' },
    { phrase: 'നല്ലത്', english: 'Good' },
    { phrase: 'ചീത്ത', english: 'Bad' },
    { phrase: 'വലിയ', english: 'Big' },
  ],
  kannada: [
    { phrase: 'ನಮಸ್ಕಾರ', english: 'Hello' },
    { phrase: 'ಧನ್ಯವಾದ', english: 'Thank you' },
    { phrase: 'ಹೌದು', english: 'Yes' },
    { phrase: 'ಇಲ್ಲ', english: 'No' },
    { phrase: 'ದಯವಿಟ್ಟು', english: 'Please' },
    { phrase: 'ನೀರು', english: 'Water' },
    { phrase: 'ಆಹಾರ', english: 'Food' },
    { phrase: 'ಮನೆ', english: 'House' },
    { phrase: 'ಪುಸ್ತಕ', english: 'Book' },
    { phrase: 'ಶಾಲೆ', english: 'School' },
    { phrase: 'ಸ್ನೇಹಿತ', english: 'Friend' },
    { phrase: 'ಕುಟುಂಬ', english: 'Family' },
    { phrase: 'ಅಮ್ಮ', english: 'Mother' },
    { phrase: 'ಅಪ್ಪ', english: 'Father' },
    { phrase: 'ಪ್ರೀತಿ', english: 'Love' },
    { phrase: 'ಸಮಯ', english: 'Time' },
    { phrase: 'ದಿನ', english: 'Day' },
    { phrase: 'ರಾತ್ರಿ', english: 'Night' },
    { phrase: 'ಇಂದು', english: 'Today' },
    { phrase: 'ನಾಳೆ', english: 'Tomorrow' },
    { phrase: 'ನಿನ್ನೆ', english: 'Yesterday' },
    { phrase: 'ಸೂರ್ಯ', english: 'Sun' },
    { phrase: 'ಚಂದ್ರ', english: 'Moon' },
    { phrase: 'ಮರ', english: 'Tree' },
    { phrase: 'ಹೂವು', english: 'Flower' },
    { phrase: 'ಬೆಕ್ಕು', english: 'Cat' },
    { phrase: 'ನಾಯಿ', english: 'Dog' },
    { phrase: 'ಹಕ್ಕಿ', english: 'Bird' },
    { phrase: 'ರಸ್ತೆ', english: 'Road' },
    { phrase: 'ಕಾರು', english: 'Car' },
    { phrase: 'ರೈಲು', english: 'Train' },
    { phrase: 'ಹಣ', english: 'Money' },
    { phrase: 'ಕೆಲಸ', english: 'Work' },
    { phrase: 'ಸಹಾಯ', english: 'Help' },
    { phrase: 'ನಿಲ್ಲಿಸು', english: 'Stop' },
    { phrase: 'ಹೋಗು', english: 'Go' },
    { phrase: 'ಬಾ', english: 'Come' },
    { phrase: 'ತಿನ್ನು', english: 'Eat' },
    { phrase: 'ಕುಡಿ', english: 'Drink' },
    { phrase: 'ಮಲಗು', english: 'Sleep' },
    { phrase: 'ಓದು', english: 'Read' },
    { phrase: 'ಬರೆ', english: 'Write' },
    { phrase: 'ಮಾತನಾಡು', english: 'Speak' },
    { phrase: 'ಕೇಳು', english: 'Listen' },
    { phrase: 'ನೋಡು', english: 'Look' },
    { phrase: 'ಸಂತೋಷ', english: 'Happy' },
    { phrase: 'ದುಃಖ', english: 'Sad' },
    { phrase: 'ಒಳ್ಳೆಯದು', english: 'Good' },
    { phrase: 'ಕೆಟ್ಟದು', english: 'Bad' },
    { phrase: 'ದೊಡ್ಡದು', english: 'Big' },
  ],
};

// ── INTERMEDIATE: Full Sentences ─────────────────────────────────────────────
export const PRONOUNCE_INTERMEDIATE_POOLS: Record<string, Array<{ phrase: string, english: string }>> = {
  tamil: [
    { phrase: 'நான் தமிழ் பேசுகிறேன்', english: 'I speak Tamil' },
    { phrase: 'உங்கள் பெயர் என்ன?', english: 'What is your name?' },
    { phrase: 'எனக்கு தமிழ் பிடிக்கும்', english: 'I like Tamil' },
    { phrase: 'நீங்கள் எங்கே இருக்கிறீர்கள்?', english: 'Where are you?' },
    { phrase: 'இன்று வானிலை நல்லாக இருக்கிறது', english: 'The weather is nice today' },
    { phrase: 'நான் சாப்பிட விரும்புகிறேன்', english: 'I want to eat' },
    { phrase: 'அவர் மிகவும் நல்லவர்', english: 'He is very kind' },
    { phrase: 'நாளை பள்ளிக்கு செல்வேன்', english: 'I will go to school tomorrow' },
    { phrase: 'இந்த புத்தகம் மிகவும் நல்லது', english: 'This book is very good' },
    { phrase: 'என் குடும்பம் மகிழ்ச்சியாக உள்ளது', english: 'My family is happy' },
    { phrase: 'நான் தண்ணீர் குடிக்கிறேன்', english: 'I am drinking water' },
    { phrase: 'அவள் பாட்டு பாடுகிறாள்', english: 'She is singing a song' },
    { phrase: 'நண்பர்கள் விளையாடுகின்றனர்', english: 'Friends are playing' },
    { phrase: 'அம்மா சமையல் செய்கிறார்', english: 'Mother is cooking' },
    { phrase: 'வானம் நீல நிறமாக உள்ளது', english: 'The sky is blue' },
    { phrase: 'நான் ஒரு மாணவன்', english: 'I am a student' },
    { phrase: 'இது என் வீடு', english: 'This is my house' },
    { phrase: 'நான் தினமும் உடற்பயிற்சி செய்கிறேன்', english: 'I exercise daily' },
    { phrase: 'அவர்கள் கடைக்கு சென்றனர்', english: 'They went to the shop' },
    { phrase: 'பூனை மரத்தின் மீது இருக்கிறது', english: 'The cat is on the tree' },
    { phrase: 'என்னால் நீந்த முடியும்', english: 'I can swim' },
    { phrase: 'இசை கேட்பது என் பொழுதுபோக்கு', english: 'Listening to music is my hobby' },
    { phrase: 'நான் காலையில் எழுகிறேன்', english: 'I wake up in the morning' },
    { phrase: 'அவர் மருத்துவர்', english: 'He is a doctor' },
    { phrase: 'மழை பெய்கிறது', english: 'It is raining' },
    { phrase: 'நான் ஆங்கிலம் கற்கிறேன்', english: 'I am learning English' },
    { phrase: 'வீட்டில் யாரும் இல்லை', english: 'Nobody is at home' },
    { phrase: 'கடல் அழகாக உள்ளது', english: 'The sea is beautiful' },
    { phrase: 'நான் படிக்க விரும்புகிறேன்', english: 'I want to study' },
    { phrase: 'அவள் வேகமாக ஓடுகிறாள்', english: 'She runs fast' },
    { phrase: 'இன்று சனிக்கிழமை', english: 'Today is Saturday' },
    { phrase: 'நான் காபி குடிக்கிறேன்', english: 'I drink coffee' },
    { phrase: 'அவர்கள் திரைப்படம் பார்க்கின்றனர்', english: 'They are watching a movie' },
    { phrase: 'என் அப்பா பொறியாளர்', english: 'My father is an engineer' },
    { phrase: 'நான் வீட்டில் இருக்கிறேன்', english: 'I am at home' },
    { phrase: 'குழந்தை அழுகிறது', english: 'The child is crying' },
    { phrase: 'பழங்கள் மிகவும் இனிப்பாக உள்ளன', english: 'The fruits are very sweet' },
    { phrase: 'நான் நாளை வருவேன்', english: 'I will come tomorrow' },
    { phrase: 'அவர் நல்ல ஆசிரியர்', english: 'He is a good teacher' },
    { phrase: 'நான் நடைபயணம் செய்கிறேன்', english: 'I am going for a walk' },
    { phrase: 'வீட்டை சுத்தம் செய்கிறேன்', english: 'I am cleaning the house' },
    { phrase: 'புத்தகம் மேஜையில் உள்ளது', english: 'The book is on the table' },
    { phrase: 'நான் உனை நேசிக்கிறேன்', english: 'I love you' },
    { phrase: 'அவள் படம் வரைகிறாள்', english: 'She is drawing a picture' },
    { phrase: 'நாய் வாலை ஆட்டுகிறது', english: 'The dog is wagging its tail' },
    { phrase: 'நான் தூங்க வேண்டும்', english: 'I need to sleep' },
    { phrase: 'பாலம் நதியின் மீது உள்ளது', english: 'The bridge is over the river' },
    { phrase: 'அவர் பத்திரிகை படிக்கிறார்', english: 'He is reading a newspaper' },
    { phrase: 'நான் இசை கேட்கிறேன்', english: 'I am listening to music' },
    { phrase: 'குழந்தை விளையாடுகிறது', english: 'The child is playing' },
  ],
  hindi: [
    { phrase: 'मैं हिंदी बोलता हूँ', english: 'I speak Hindi' },
    { phrase: 'आपका नाम क्या है?', english: 'What is your name?' },
    { phrase: 'मुझे हिंदी पसंद है', english: 'I like Hindi' },
    { phrase: 'आप कहाँ हैं?', english: 'Where are you?' },
    { phrase: 'आज मौसम अच्छा है', english: 'The weather is nice today' },
    { phrase: 'मैं खाना खाना चाहता हूँ', english: 'I want to eat' },
    { phrase: 'वह बहुत दयालु है', english: 'He is very kind' },
    { phrase: 'कल मैं स्कूल जाऊंगा', english: 'I will go to school tomorrow' },
    { phrase: 'यह किताब बहुत अच्छी है', english: 'This book is very good' },
    { phrase: 'मेरा परिवार खुश है', english: 'My family is happy' },
    { phrase: 'मैं पानी पी रहा हूँ', english: 'I am drinking water' },
    { phrase: 'वह गाना गा रही है', english: 'She is singing a song' },
    { phrase: 'दोस्त खेल रहे हैं', english: 'Friends are playing' },
    { phrase: 'माँ खाना बना रही है', english: 'Mother is cooking' },
    { phrase: 'आकाश नीला है', english: 'The sky is blue' },
    { phrase: 'मैं एक छात्र हूँ', english: 'I am a student' },
    { phrase: 'यह मेरा घर है', english: 'This is my house' },
    { phrase: 'मैं रोज़ व्यायाम करता हूँ', english: 'I exercise daily' },
    { phrase: 'वे दुकान गए', english: 'They went to the shop' },
    { phrase: 'बिल्ली पेड़ पर है', english: 'The cat is on the tree' },
    { phrase: 'मैं तैर सकता हूँ', english: 'I can swim' },
    { phrase: 'संगीत सुनना मेरा शौक है', english: 'Listening to music is my hobby' },
    { phrase: 'मैं सुबह उठता हूँ', english: 'I wake up in the morning' },
    { phrase: 'वह डॉक्टर है', english: 'He is a doctor' },
    { phrase: 'बारिश हो रही है', english: 'It is raining' },
    { phrase: 'मैं अंग्रेजी सीख रहा हूँ', english: 'I am learning English' },
    { phrase: 'घर पर कोई नहीं है', english: 'Nobody is at home' },
    { phrase: 'समुद्र सुंदर है', english: 'The sea is beautiful' },
    { phrase: 'मैं पढ़ना चाहता हूँ', english: 'I want to study' },
    { phrase: 'वह तेज़ दौड़ती है', english: 'She runs fast' },
    { phrase: 'आज शनिवार है', english: 'Today is Saturday' },
    { phrase: 'मैं चाय पीता हूँ', english: 'I drink tea' },
    { phrase: 'वे फिल्म देख रहे हैं', english: 'They are watching a movie' },
    { phrase: 'मेरे पिता इंजीनियर हैं', english: 'My father is an engineer' },
    { phrase: 'मैं घर पर हूँ', english: 'I am at home' },
    { phrase: 'बच्चा रो रहा है', english: 'The child is crying' },
    { phrase: 'फल बहुत मीठे हैं', english: 'The fruits are very sweet' },
    { phrase: 'मैं कल आऊंगा', english: 'I will come tomorrow' },
    { phrase: 'वह अच्छे शिक्षक हैं', english: 'He is a good teacher' },
    { phrase: 'मैं सैर के लिए जा रहा हूँ', english: 'I am going for a walk' },
    { phrase: 'घर साफ कर रहा हूँ', english: 'I am cleaning the house' },
    { phrase: 'किताब मेज़ पर है', english: 'The book is on the table' },
    { phrase: 'मैं तुमसे प्यार करता हूँ', english: 'I love you' },
    { phrase: 'वह तस्वीर बना रही है', english: 'She is drawing a picture' },
    { phrase: 'कुत्ता पूँछ हिला रहा है', english: 'The dog is wagging its tail' },
    { phrase: 'मुझे सोना है', english: 'I need to sleep' },
    { phrase: 'पुल नदी के ऊपर है', english: 'The bridge is over the river' },
    { phrase: 'वह अखबार पढ़ रहा है', english: 'He is reading a newspaper' },
    { phrase: 'मैं संगीत सुन रहा हूँ', english: 'I am listening to music' },
    { phrase: 'बच्चा खेल रहा है', english: 'The child is playing' },
    { phrase: 'मैं अपने दोस्त से मिलूंगा', english: 'I will meet my friend' },
  ],
  telugu: [
    { phrase: 'నేను తెలుగు మాట్లాడతాను', english: 'I speak Telugu' },
    { phrase: 'మీ పేరు ఏమిటి?', english: 'What is your name?' },
    { phrase: 'నాకు తెలుగు ఇష్టం', english: 'I like Telugu' },
    { phrase: 'మీరు ఎక్కడ ఉన్నారు?', english: 'Where are you?' },
    { phrase: 'ఈరోజు వాతావరణం బాగుంది', english: 'The weather is nice today' },
    { phrase: 'నాకు తినాలని ఉంది', english: 'I want to eat' },
    { phrase: 'అతను చాలా దయగలవాడు', english: 'He is very kind' },
    { phrase: 'రేపు పాఠశాలకు వెళ్తాను', english: 'I will go to school tomorrow' },
    { phrase: 'ఈ పుస్తకం చాలా మంచిది', english: 'This book is very good' },
    { phrase: 'మా కుటుంబం సంతోషంగా ఉంది', english: 'My family is happy' },
    { phrase: 'నేను నీరు త్రాగుతున్నాను', english: 'I am drinking water' },
    { phrase: 'ఆమె పాట పాడుతోంది', english: 'She is singing a song' },
    { phrase: 'స్నేహితులు ఆడుతున్నారు', english: 'Friends are playing' },
    { phrase: 'అమ్మ వంట చేస్తోంది', english: 'Mother is cooking' },
    { phrase: 'ఆకాశం నీలంగా ఉంది', english: 'The sky is blue' },
    { phrase: 'నేను ఒక విద్యార్థిని', english: 'I am a student' },
    { phrase: 'ఇది నా ఇల్లు', english: 'This is my house' },
    { phrase: 'నేను ప్రతిరోజూ వ్యాయామం చేస్తాను', english: 'I exercise daily' },
    { phrase: 'వారు దుకాణానికి వెళ్ళారు', english: 'They went to the shop' },
    { phrase: 'పిల్లి చెట్టుపై ఉంది', english: 'The cat is on the tree' },
    { phrase: 'నేను ఈత కొట్టగలను', english: 'I can swim' },
    { phrase: 'సంగీతం వినడం నా అభిరుచి', english: 'Listening to music is my hobby' },
    { phrase: 'నేను ఉదయం లేస్తాను', english: 'I wake up in the morning' },
    { phrase: 'అతను వైద్యుడు', english: 'He is a doctor' },
    { phrase: 'వర్షం పడుతోంది', english: 'It is raining' },
    { phrase: 'నేను ఆంగ్లం నేర్చుకుంటున్నాను', english: 'I am learning English' },
    { phrase: 'ఇంట్లో ఎవరూ లేరు', english: 'Nobody is at home' },
    { phrase: 'సముద్రం అందంగా ఉంది', english: 'The sea is beautiful' },
    { phrase: 'నాకు చదవాలని ఉంది', english: 'I want to study' },
    { phrase: 'ఆమె వేగంగా పరుగెడుతుంది', english: 'She runs fast' },
    { phrase: 'ఈరోజు శనివారం', english: 'Today is Saturday' },
    { phrase: 'నేను కాఫీ తాగుతాను', english: 'I drink coffee' },
    { phrase: 'వారు సినిమా చూస్తున్నారు', english: 'They are watching a movie' },
    { phrase: 'మా నాన్న ఇంజినీర్', english: 'My father is an engineer' },
    { phrase: 'నేను ఇంట్లో ఉన్నాను', english: 'I am at home' },
    { phrase: 'పిల్లవాడు ఏడుస్తున్నాడు', english: 'The child is crying' },
    { phrase: 'పండ్లు చాలా తీపిగా ఉన్నాయి', english: 'The fruits are very sweet' },
    { phrase: 'నేను రేపు వస్తాను', english: 'I will come tomorrow' },
    { phrase: 'అతను మంచి ఉపాధ్యాయుడు', english: 'He is a good teacher' },
    { phrase: 'నేను నడకకు వెళ్తున్నాను', english: 'I am going for a walk' },
    { phrase: 'ఇంటిని శుభ్రం చేస్తున్నాను', english: 'I am cleaning the house' },
    { phrase: 'పుస్తకం బల్లపై ఉంది', english: 'The book is on the table' },
    { phrase: 'నేను నిన్ను ప్రేమిస్తున్నాను', english: 'I love you' },
    { phrase: 'ఆమె చిత్రం గీస్తోంది', english: 'She is drawing a picture' },
    { phrase: 'కుక్క తోకను ఆడిస్తోంది', english: 'The dog is wagging its tail' },
    { phrase: 'నాకు నిద్ర పోవాలి', english: 'I need to sleep' },
    { phrase: 'వంతెన నది మీద ఉంది', english: 'The bridge is over the river' },
    { phrase: 'అతను వార్తాపత్రిక చదువుతున్నాడు', english: 'He is reading a newspaper' },
    { phrase: 'నేను సంగీతం వింటున్నాను', english: 'I am listening to music' },
    { phrase: 'పిల్లవాడు ఆడుతున్నాడు', english: 'The child is playing' },
    { phrase: 'నేను నా స్నేహితుడిని కలుస్తాను', english: 'I will meet my friend' },
  ],
  malayalam: [
    { phrase: 'ഞാൻ മലയാളം സംസാരിക്കുന്നു', english: 'I speak Malayalam' },
    { phrase: 'നിങ്ങളുടെ പേര് എന്താണ്?', english: 'What is your name?' },
    { phrase: 'എനിക്ക് മലയാളം ഇഷ്ടമാണ്', english: 'I like Malayalam' },
    { phrase: 'നിങ്ങൾ എവിടെ ആണ്?', english: 'Where are you?' },
    { phrase: 'ഇന്ന് കാലാവസ്ഥ നന്നാണ്', english: 'The weather is nice today' },
    { phrase: 'എനിക്ക് ഭക്ഷണം കഴിക്കണം', english: 'I want to eat' },
    { phrase: 'അദ്ദേഹം വളരെ ദയാലുവാണ്', english: 'He is very kind' },
    { phrase: 'നാളെ ഞാൻ സ്കൂളിൽ പോകും', english: 'I will go to school tomorrow' },
    { phrase: 'ഈ പുസ്തകം വളരെ നല്ലതാണ്', english: 'This book is very good' },
    { phrase: 'എന്റെ കുടുംബം സന്തോഷമായിരിക്കുന്നു', english: 'My family is happy' },
    { phrase: 'ഞാൻ വെള്ളം കുടിക്കുന്നു', english: 'I am drinking water' },
    { phrase: 'അവൾ പാട്ടു പാടുന്നു', english: 'She is singing a song' },
    { phrase: 'സ്നേഹിതർ കളിക്കുന്നു', english: 'Friends are playing' },
    { phrase: 'അമ്മ ഭക്ഷണം ഉണ്ടാക്കുന്നു', english: 'Mother is cooking' },
    { phrase: 'ആകാശം നീലനിറമാണ്', english: 'The sky is blue' },
    { phrase: 'ഞാൻ ഒരു വിദ്യാർഥിയാണ്', english: 'I am a student' },
    { phrase: 'ഇത് എന്റെ വീടാണ്', english: 'This is my house' },
    { phrase: 'ഞാൻ ദിവസവും വ്യായാമം ചെയ്യുന്നു', english: 'I exercise daily' },
    { phrase: 'അവർ കടയിൽ പോയി', english: 'They went to the shop' },
    { phrase: 'പൂച്ച മരത്തിൽ ഉണ്ട്', english: 'The cat is on the tree' },
    { phrase: 'എനിക്ക് നീന്തൽ അറിയാം', english: 'I can swim' },
    { phrase: 'സംഗീതം കേൾക്കൽ എന്റെ ഹോബിയാണ്', english: 'Listening to music is my hobby' },
    { phrase: 'ഞാൻ രാവിലെ എഴുന്നേൽക്കുന്നു', english: 'I wake up in the morning' },
    { phrase: 'അദ്ദേഹം ഒരു ഡോക്ടർ ആണ്', english: 'He is a doctor' },
    { phrase: 'മഴ പെയ്യുന്നു', english: 'It is raining' },
    { phrase: 'ഞാൻ ഇംഗ്ലീഷ് പഠിക്കുന്നു', english: 'I am learning English' },
    { phrase: 'വീട്ടിൽ ആരുമില്ല', english: 'Nobody is at home' },
    { phrase: 'കടൽ സുന്ദരമാണ്', english: 'The sea is beautiful' },
    { phrase: 'എനിക്ക് പഠിക്കണം', english: 'I want to study' },
    { phrase: 'അവൾ വേഗത്തിൽ ഓടുന്നു', english: 'She runs fast' },
    { phrase: 'ഇന്ന് ശനിയാഴ്ച ആണ്', english: 'Today is Saturday' },
    { phrase: 'ഞാൻ ചായ കുടിക്കുന്നു', english: 'I drink tea' },
    { phrase: 'അവർ സിനിമ കാണുന്നു', english: 'They are watching a movie' },
    { phrase: 'എന്റെ അച്ഛൻ ഒരു എഞ്ചിനീയർ ആണ്', english: 'My father is an engineer' },
    { phrase: 'ഞാൻ വീട്ടിൽ ഉണ്ട്', english: 'I am at home' },
    { phrase: 'കുട്ടി കരയുന്നു', english: 'The child is crying' },
    { phrase: 'പഴങ്ങൾ വളരെ മധുരമാണ്', english: 'The fruits are very sweet' },
    { phrase: 'ഞാൻ നാളെ വരും', english: 'I will come tomorrow' },
    { phrase: 'അദ്ദേഹം ഒരു നല്ല അദ്ധ്യാപകൻ ആണ്', english: 'He is a good teacher' },
    { phrase: 'ഞാൻ നടക്കാൻ പോകുന്നു', english: 'I am going for a walk' },
    { phrase: 'വീട് വൃത്തിയാക്കുന്നു', english: 'I am cleaning the house' },
    { phrase: 'പുസ്തകം മേശയിൽ ഉണ്ട്', english: 'The book is on the table' },
    { phrase: 'ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു', english: 'I love you' },
    { phrase: 'അവൾ ചിത്രം വരക്കുന്നു', english: 'She is drawing a picture' },
    { phrase: 'നായ വാൽ ആട്ടുന്നു', english: 'The dog is wagging its tail' },
    { phrase: 'എനിക്ക് ഉറങ്ങണം', english: 'I need to sleep' },
    { phrase: 'പാലം നദിക്ക് മുകളിലുണ്ട്', english: 'The bridge is over the river' },
    { phrase: 'അദ്ദേഹം പത്രം വായിക്കുന്നു', english: 'He is reading a newspaper' },
    { phrase: 'ഞാൻ സംഗീതം കേൾക്കുന്നു', english: 'I am listening to music' },
    { phrase: 'കുട്ടി കളിക്കുന്നു', english: 'The child is playing' },
  ],
  kannada: [
    { phrase: 'ನಾನು ಕನ್ನಡ ಮಾತನಾಡುತ್ತೇನೆ', english: 'I speak Kannada' },
    { phrase: 'ನಿಮ್ಮ ಹೆಸರೇನು?', english: 'What is your name?' },
    { phrase: 'ನನಗೆ ಕನ್ನಡ ಇಷ್ಟ', english: 'I like Kannada' },
    { phrase: 'ನೀವು ಎಲ್ಲಿ ಇದ್ದೀರಿ?', english: 'Where are you?' },
    { phrase: 'ಇಂದು ವಾತಾವರಣ ಚೆನ್ನಾಗಿದೆ', english: 'The weather is nice today' },
    { phrase: 'ನನಗೆ ತಿನ್ನಬೇಕು', english: 'I want to eat' },
    { phrase: 'ಅವನು ತುಂಬ ದಯಾಳು', english: 'He is very kind' },
    { phrase: 'ನಾಳೆ ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ', english: 'I will go to school tomorrow' },
    { phrase: 'ಈ ಪುಸ್ತಕ ತುಂಬ ಒಳ್ಳೆಯದು', english: 'This book is very good' },
    { phrase: 'ನನ್ನ ಕುಟುಂಬ ಸಂತೋಷವಾಗಿದೆ', english: 'My family is happy' },
    { phrase: 'ನಾನು ನೀರು ಕುಡಿಯುತ್ತಿದ್ದೇನೆ', english: 'I am drinking water' },
    { phrase: 'ಅವಳು ಹಾಡು ಹಾಡುತ್ತಿದ್ದಾಳೆ', english: 'She is singing a song' },
    { phrase: 'ಸ್ನೇಹಿತರು ಆಡುತ್ತಿದ್ದಾರೆ', english: 'Friends are playing' },
    { phrase: 'ಅಮ್ಮ ಅಡಿಗೆ ಮಾಡುತ್ತಿದ್ದಾರೆ', english: 'Mother is cooking' },
    { phrase: 'ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ', english: 'The sky is blue' },
    { phrase: 'ನಾನು ಒಬ್ಬ ವಿದ್ಯಾರ್ಥಿ', english: 'I am a student' },
    { phrase: 'ಇದು ನನ್ನ ಮನೆ', english: 'This is my house' },
    { phrase: 'ನಾನು ಪ್ರತಿದಿನ ವ್ಯಾಯಾಮ ಮಾಡುತ್ತೇನೆ', english: 'I exercise daily' },
    { phrase: 'ಅವರು ಅಂಗಡಿಗೆ ಹೋದರು', english: 'They went to the shop' },
    { phrase: 'ಬೆಕ್ಕು ಮರದ ಮೇಲಿದೆ', english: 'The cat is on the tree' },
    { phrase: 'ನನಗೆ ಈಜಲು ಬರುತ್ತದೆ', english: 'I can swim' },
    { phrase: 'ಸಂಗೀತ ಕೇಳುವುದು ನನ್ನ ಹವ್ಯಾಸ', english: 'Listening to music is my hobby' },
    { phrase: 'ನಾನು ಬೆಳಿಗ್ಗೆ ಏಳುತ್ತೇನೆ', english: 'I wake up in the morning' },
    { phrase: 'ಅವನು ವೈದ್ಯ', english: 'He is a doctor' },
    { phrase: 'ಮಳೆ ಬರುತ್ತಿದೆ', english: 'It is raining' },
    { phrase: 'ನಾನು ಇಂಗ್ಲಿಷ್ ಕಲಿಯುತ್ತಿದ್ದೇನೆ', english: 'I am learning English' },
    { phrase: 'ಮನೆಯಲ್ಲಿ ಯಾರೂ ಇಲ್ಲ', english: 'Nobody is at home' },
    { phrase: 'ಸಮುದ್ರ ಸುಂದರವಾಗಿದೆ', english: 'The sea is beautiful' },
    { phrase: 'ನನಗೆ ಓದಬೇಕು', english: 'I want to study' },
    { phrase: 'ಅವಳು ವೇಗವಾಗಿ ಓಡುತ್ತಾಳೆ', english: 'She runs fast' },
    { phrase: 'ಇಂದು ಶನಿವಾರ', english: 'Today is Saturday' },
    { phrase: 'ನಾನು ಕಾಫಿ ಕುಡಿಯುತ್ತೇನೆ', english: 'I drink coffee' },
    { phrase: 'ಅವರು ಚಲನಚಿತ್ರ ನೋಡುತ್ತಿದ್ದಾರೆ', english: 'They are watching a movie' },
    { phrase: 'ನನ್ನ ಅಪ್ಪ ಇಂಜಿನೀಯರ್', english: 'My father is an engineer' },
    { phrase: 'ನಾನು ಮನೆಯಲ್ಲಿ ಇದ್ದೇನೆ', english: 'I am at home' },
    { phrase: 'ಮಗು ಅಳುತ್ತಿದೆ', english: 'The child is crying' },
    { phrase: 'ಹಣ್ಣುಗಳು ತುಂಬ ಸಿಹಿ', english: 'The fruits are very sweet' },
    { phrase: 'ನಾನು ನಾಳೆ ಬರುತ್ತೇನೆ', english: 'I will come tomorrow' },
    { phrase: 'ಅವನು ಒಳ್ಳೆ ಶಿಕ್ಷಕ', english: 'He is a good teacher' },
    { phrase: 'ನಾನು ನಡೆಯಲು ಹೋಗುತ್ತಿದ್ದೇನೆ', english: 'I am going for a walk' },
    { phrase: 'ಮನೆ ಸ್ವಚ್ಛ ಮಾಡುತ್ತಿದ್ದೇನೆ', english: 'I am cleaning the house' },
    { phrase: 'ಪುಸ್ತಕ ಮೇಜಿನ ಮೇಲಿದೆ', english: 'The book is on the table' },
    { phrase: 'ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ', english: 'I love you' },
    { phrase: 'ಅವಳು ಚಿತ್ರ ಬಿಡಿಸುತ್ತಿದ್ದಾಳೆ', english: 'She is drawing a picture' },
    { phrase: 'ನಾಯಿ ಬಾಲ ಅಲ್ಲಾಡಿಸುತ್ತಿದೆ', english: 'The dog is wagging its tail' },
    { phrase: 'ನನಗೆ ನಿದ್ರೆ ಮಾಡಬೇಕು', english: 'I need to sleep' },
    { phrase: 'ಸೇತುವೆ ನದಿಯ ಮೇಲಿದೆ', english: 'The bridge is over the river' },
    { phrase: 'ಅವನು ಪತ್ರಿಕೆ ಓದುತ್ತಿದ್ದಾನೆ', english: 'He is reading a newspaper' },
    { phrase: 'ನಾನು ಸಂಗೀತ ಕೇಳುತ್ತಿದ್ದೇನೆ', english: 'I am listening to music' },
    { phrase: 'ಮಗು ಆಡುತ್ತಿದೆ', english: 'The child is playing' },
  ],
};

// ── PRO: Idioms & Complex Phrases ────────────────────────────────────────────
export const PRONOUNCE_PRO_POOLS: Record<string, Array<{ phrase: string, english: string }>> = {
  tamil: [
    { phrase: 'காற்றை பிடிக்க முயற்சிக்கிறான்', english: 'He tries to catch the wind (futile effort)' },
    { phrase: 'கல்லிலும் நீர் ஊறும்', english: 'Even stone can yield water (persistence pays)' },
    { phrase: 'ஆடு மேயும் இடம் தெரியும்', english: 'The goat knows where it grazes (familiar territory)' },
    { phrase: 'வீட்டில் உள்ள விளக்கு வெளியே ஒளிரும்', english: 'The lamp at home shines outside (values spread)' },
    { phrase: 'நீரில் உள்ள மீன் தாகத்தால் இறந்தது', english: 'Fish in water died of thirst (irony of ignoring abundance)' },
    { phrase: 'ஆயிரம் பேர் சொன்னால் ஆகாயம் விழும்', english: 'If a thousand say it, the sky may fall (mob mentality)' },
    { phrase: 'அன்பின் வழியது உலகம்', english: 'The world exists through love (Thirukkural wisdom)' },
    { phrase: 'யாம் பெற்ற இன்பம் பெறுக இவ்வையகம்', english: 'May the world receive the joy we have received' },
    { phrase: 'செல்வம் பெற்றாரை செல்வம் தேடும்', english: 'Wealth seeks those who already have wealth' },
    { phrase: 'விழுந்தாலும் மீசைல மண் ஒட்டல', english: 'Even when fallen, no mud on the moustache (pride)' },
    { phrase: 'இல்லறம் இனிது என்ற சொல்', english: 'Household life is sweet, as wisdom says' },
    { phrase: 'கற்றது கைமண் அளவு கல்லாதது உலகளவு', english: 'Learned is a handful of sand, unlearned is the universe' },
    { phrase: 'அகலக் கால் வைத்தால் ஆடு கிட்டும்', english: 'Spread your legs wide, the goat will come near (over-ambition)' },
    { phrase: 'துப்பறியும் திரு சிந்திக்கும் தூய்மை', english: 'One who investigates thinks with clarity' },
    { phrase: 'வலிமை உடையவனுக்கு வாய்ப்பு அதிகம்', english: 'More opportunities come to the strong' },
    { phrase: 'நல்லது நினைத்தால் நன்மை கிட்டும்', english: 'Think good and goodness will come' },
    { phrase: 'பொறுமை உடையவர் பூமியை ஆள்வார்', english: 'The patient shall rule the earth' },
    { phrase: 'இடியாப்பம் சாப்பிடுவதற்கு இல்லாமல் போனாலும்', english: 'Even if there is nothing to eat (expression of poverty)' },
    { phrase: 'காலம் கடந்து செய்யும் வேலை காலனுக்கு வேலை', english: 'Work done past its time is work for the god of death' },
    { phrase: 'அரசனுக்கு ஒரு நாள் ஆண்டிக்கு ஒரு நாள்', english: 'The king has his day, the beggar has his day' },
    { phrase: 'பழைய கிணற்றில் புதிய தண்ணீர்', english: 'New water in an old well (fresh ideas in tradition)' },
    { phrase: 'மண் சுமந்தவன் மலை ஏற மாட்டான்', english: 'One who carries mud cannot climb the mountain' },
    { phrase: 'தண்ணீரில் உப்பு கரைந்தது போல்', english: 'Like salt dissolving in water (complete integration)' },
    { phrase: 'குறைகளை மறைத்து குணங்களை வெளிக்கொண்டு வா', english: 'Hide shortcomings, bring out virtues' },
    { phrase: 'நெல்லை விதைத்தவன் நெல்லை அறுப்பான்', english: 'One who sows paddy shall harvest paddy' },
    { phrase: 'ஏரி நிறைந்தால் கிணறு நிறையும்', english: 'When the lake fills, the well fills (cause and effect)' },
    { phrase: 'சொல்லில் சுவை உணவில் சுவை', english: 'Taste in words, taste in food (eloquence matters)' },
    { phrase: 'வீரன் ஒருவனே போதும் வெற்றி தர', english: 'One brave man is enough to give victory' },
    { phrase: 'அகத்தின் அழகு முகத்தில் தெரியும்', english: 'Inner beauty shows on the face' },
    { phrase: 'கோழி முட்டை இட்ட இடத்தில் கூவும்', english: 'A hen crows where it lays its egg (possessiveness)' },
    { phrase: 'இன்று போனால் நாளை வரும்', english: 'What goes today will come tomorrow (cycles)' },
    { phrase: 'சத்தமில்லாத காரியம் சாதிக்கும்', english: 'Work done quietly gets accomplished' },
    { phrase: 'கடலில் கலைந்த உப்பு திரும்பவராது', english: 'Salt dissolved in the sea cannot return' },
    { phrase: 'அன்னை மொழியே உயர்வான மொழி', english: 'Mother tongue is the highest language' },
    { phrase: 'பொய்யான வாழ்வை விட உண்மையான மரணம் சிறந்தது', english: 'Honest death is better than a false life' },
    { phrase: 'ஊரை ஆள்பவன் ஊர் கேட்பான்', english: 'One who rules a village will be accountable to the village' },
    { phrase: 'புலியை கண்ட இடத்தில் பயப்படாமல் போ', english: 'Walk without fear where the tiger was seen (bravery)' },
    { phrase: 'தாய் தந்தையை மறந்தால் மண்ணும் மறக்கும்', english: 'Forget parents and even the earth forgets you' },
    { phrase: 'ஐந்தில் வளையாதது ஐம்பதில் வளையாது', english: 'What bends not at five bends not at fifty' },
    { phrase: 'மனிதனை மனிதன் அன்பால் வெல்லலாம்', english: 'Man can conquer man with love' },
    { phrase: 'கல் தோன்றி மண் தோன்றா காலத்தே', english: 'Before stone appeared and earth formed (Tamil antiquity)' },
    { phrase: 'தமிழ் அழியாத மொழி', english: 'Tamil is an indestructible language' },
    { phrase: 'படித்தவன் பணக்காரன் ஆவான்', english: 'The educated shall become wealthy' },
    { phrase: 'நோய்க்கு மருந்து உணவே', english: 'Food itself is the medicine for illness' },
    { phrase: 'உள்ளத்தால் உள்ளம் ஒன்றுபட வேண்டும்', english: 'Heart must unite with heart' },
    { phrase: 'திரும்பி வரும் நீரே ஓடும் நதி', english: 'Only returning water is a flowing river' },
    { phrase: 'சொற்களால் அமையும் உலகம்', english: 'The world is shaped by words' },
    { phrase: 'கடவுளை நம்பி கடல் கடந்தான்', english: 'He crossed the sea trusting in God' },
    { phrase: 'வாழ்க்கை ஒரு பாடம் கற்று கொள்', english: 'Life is a lesson, learn it' },
    { phrase: 'ஆயிரம் நட்பு ஒரு உண்மையான நட்பை விட தாழும்', english: 'A thousand friendships are less than one true friendship' },
  ],
  hindi: [
    { phrase: 'अब पछताए होत क्या जब चिड़िया चुग गई खेत', english: 'No use crying over spilled milk (birds ate the field)' },
    { phrase: 'नाच न जाने आंगन टेढ़ा', english: 'A bad dancer blames the floor' },
    { phrase: 'दूध का जला छाछ भी फूंक फूंक कर पीता है', english: 'Once burned by milk, he blows even buttermilk' },
    { phrase: 'मन चंगा तो कठौती में गंगा', english: 'If mind is pure, Ganga is in a vessel' },
    { phrase: 'अकेला चना भाड़ नहीं फोड़ सकता', english: 'One grain cannot parch a pan (unity in strength)' },
    { phrase: 'आम के आम गुठलियों के दाम', english: 'Price of mangoes and kernels both (double benefit)' },
    { phrase: 'बंदर क्या जाने अदरक का स्वाद', english: 'What does a monkey know the taste of ginger (pearls before swine)' },
    { phrase: 'एक हाथ से ताली नहीं बजती', english: 'A clap cannot come from one hand (takes two)' },
    { phrase: 'जैसी करनी वैसी भरनी', english: 'As you sow, so shall you reap' },
    { phrase: 'घर का भेदी लंका ढाए', english: 'The insider destroys Lanka (traitor within)' },
    { phrase: 'होनहार बिरवान के होत चिकने पात', english: 'A promising plant shows smooth leaves early' },
    { phrase: 'काला अक्षर भैंस बराबर', english: 'Black letters equal to a buffalo (illiteracy)' },
    { phrase: 'सौ सुनार की एक लोहार की', english: 'One blacksmith blow is worth hundred goldsmiths' },
    { phrase: 'जल में रहकर मगर से बैर', english: 'Making enemies with the crocodile while living in water' },
    { phrase: 'अंधे की लाठी भगवान', english: 'God is the blind man\'s stick (divine support)' },
    { phrase: 'थोथा चना बाजे घना', english: 'Empty vessels make the most noise' },
    { phrase: 'हाथी के दांत खाने के और दिखाने के और', english: 'Elephant has different teeth for eating and showing' },
    { phrase: 'बिन मांगे मोती मिले मांगे मिले न भीख', english: 'Gems come unasked, begging gets nothing' },
    { phrase: 'पराया धन पापियों को प्यारा', english: 'Sinners love others\' wealth' },
    { phrase: 'तेल देखो तेल की धार देखो', english: 'See the oil and its flow (patience and observation)' },
    { phrase: 'जिसकी लाठी उसकी भैंस', english: 'Whoever has the stick owns the buffalo (might is right)' },
    { phrase: 'आगे नाथ न पीछे पगहा', english: 'Neither rope ahead nor behind (complete freedom)' },
    { phrase: 'करत करत अभ्यास के जड़मति होत सुजान', english: 'By practice even a dull mind becomes sharp' },
    { phrase: 'खोदा पहाड़ निकली चुहिया', english: 'Dug a mountain and found a mouse (anti-climax)' },
    { phrase: 'चोर की दाढ़ी में तिनका', english: 'A straw in the thief\'s beard (guilt shows)' },
    { phrase: 'सच्चाई की जीत होती है', english: 'Truth always wins' },
    { phrase: 'धीरे धीरे रे मना धीरे सब कुछ होय', english: 'Slowly slowly everything happens (patience)' },
    { phrase: 'जो गरजते हैं वो बरसते नहीं', english: 'Those who thunder don\'t rain (all talk no action)' },
    { phrase: 'अपना हाथ जगन्नाथ', english: 'One\'s own hand is God (self-reliance)' },
    { phrase: 'कभी न कभी तो सुबह होगी', english: 'Someday the morning will come (hope)' },
    { phrase: 'जिंदगी और मौत खुदा के हाथ में है', english: 'Life and death are in God\'s hands' },
    { phrase: 'बड़े बड़े शहरों में ऐसी छोटी छोटी बातें होती रहती हैं', english: 'In big cities such small things keep happening' },
    { phrase: 'पत्थर पर लकीर', english: 'A line on stone (permanent mark)' },
    { phrase: 'सोने पे सुहागा', english: 'Borax on gold (perfect addition to perfection)' },
    { phrase: 'भाग्य से भगवान बड़ा', english: 'God is greater than fate' },
    { phrase: 'बुरा जो देखन मैं चला बुरा न मिलिया कोय', english: 'I went looking for evil and found none' },
    { phrase: 'रात गई बात गई', english: 'Night is gone, matter is gone (let bygones be bygones)' },
    { phrase: 'मेहनत का फल मीठा होता है', english: 'The fruit of hard work is sweet' },
    { phrase: 'जहाँ चाह वहाँ राह', english: 'Where there is a will there is a way' },
    { phrase: 'दोस्ती और दुश्मनी में फर्क कर', english: 'Know the difference between friendship and enmity' },
    { phrase: 'हिम्मते मर्दा मददे खुदा', english: 'God helps those who help themselves' },
    { phrase: 'उतना ही खींचो जितनी चादर हो', english: 'Stretch only as far as the sheet goes (live within means)' },
    { phrase: 'समय से पहले और भाग्य से अधिक कभी नहीं मिलता', english: 'Never get more than your fate before time' },
    { phrase: 'बोए पेड़ बबूल का आम कहाँ से खाय', english: 'Sow acacia, how will you eat mangoes' },
    { phrase: 'जहाँ सुमति तहाँ संपति नाना', english: 'Where wisdom is, there is abundance' },
    { phrase: 'मन के हारे हार है मन के जीते जीत', english: 'Lose in mind and you lose, win in mind and you win' },
    { phrase: 'नेकी कर दरिया में डाल', english: 'Do good and throw it in the river (expect nothing)' },
    { phrase: 'राम नाम जपना पराया माल अपना', english: 'Chanting God\'s name while stealing others\' goods (hypocrisy)' },
    { phrase: 'हर चमकती चीज़ सोना नहीं होती', english: 'All that glitters is not gold' },
    { phrase: 'इंसान वही है जो इंसान के काम आए', english: 'A true human is one who helps others' },
  ],
  telugu: [
    { phrase: 'అన్నం పెట్టిన చేయి అడ్డు పెట్టకూడదు', english: 'Do not block the hand that fed you' },
    { phrase: 'కాకికి తన పిల్లలు బంగారు పిల్లలు', english: 'To a crow its chicks are golden (partiality)' },
    { phrase: 'అడిగిన వాడికి అరక్షణం చింత', english: 'The one who asks worries for half a moment' },
    { phrase: 'ఆకలికి రుచి అడ్డురాదు', english: 'Hunger knows no taste (necessity has no standards)' },
    { phrase: 'నిప్పులో పడినా నిజం చెప్పాలి', english: 'Even in fire, tell the truth' },
    { phrase: 'తొందర పని తండ్రికి చేటు', english: 'Haste makes waste (haste ruins the father)' },
    { phrase: 'చేసిన మేలు నదిలో పారవేయాలి', english: 'Cast the good you do into the river (expect no return)' },
    { phrase: 'దేవుడు చేసిన పని దెయ్యం పాడు చేయడు', english: 'What God makes, the devil cannot ruin' },
    { phrase: 'ఆరోగ్యమే మహా భాగ్యం', english: 'Health is the greatest wealth' },
    { phrase: 'నేర్పు ఉంటే నేల మీద పడినా బ్రతుకుతావు', english: 'With skill even fallen to earth you survive' },
    { phrase: 'ఏ కులమైనా ఏ మతమైనా మనిషి మనిషే', english: 'Whatever caste or religion, a human is a human' },
    { phrase: 'కష్టపడినవాడికి కలిసివస్తుంది', english: 'Fortune favors the hardworking' },
    { phrase: 'చాటుకు చెప్పినది ఊరికి తెలుస్తుంది', english: 'What is whispered in secret reaches the town' },
    { phrase: 'అందానికి అడ్డు అహంకారం', english: 'Pride is the obstacle to beauty' },
    { phrase: 'ఉండే ఊరి మీద గిట్టింపు', english: 'Hatred for one\'s own town (self-deprecation)' },
    { phrase: 'మాటకు మాట ఒకటే వినిపించు', english: 'Speak one word for every word heard (moderation)' },
    { phrase: 'తల్లి మాట తైలం లాంటిది', english: 'Mother\'s word is like oil (soothing)' },
    { phrase: 'పరోపకారం పరమ ధర్మం', english: 'Helping others is the highest virtue' },
    { phrase: 'ఒకే రాయికి రెండు పిట్టలు', english: 'Two birds with one stone' },
    { phrase: 'సత్యమే జయించుతుంది', english: 'Truth alone triumphs' },
    { phrase: 'ఉద్యోగం పురుష లక్షణం', english: 'Industry is the mark of a man' },
    { phrase: 'బుద్ధి ఉంటే సుద్ది తోసుకుంటుంది', english: 'With intelligence even chalk will find its way' },
    { phrase: 'వేళకు వచ్చిన వెలుతురు వెలితి చేయదు', english: 'Light that comes in time leaves no darkness' },
    { phrase: 'నమ్మినవాడికి నష్టం లేదు', english: 'The faithful suffer no loss' },
    { phrase: 'ఓర్పే ఒరిపిడి', english: 'Patience is the greatest ornament' },
    { phrase: 'మంచి మాట మందు లాంటిది', english: 'A good word is like medicine' },
    { phrase: 'అనుభవమే అసలైన గురువు', english: 'Experience is the real teacher' },
    { phrase: 'ఐకమత్యమే బలం', english: 'Unity is strength' },
    { phrase: 'తెలివైన శత్రువు కంటే తెలియని మిత్రుడు మెరుగు', english: 'A foolish friend is better than a clever enemy' },
    { phrase: 'విద్య వినయమిస్తుంది', english: 'Education gives humility' },
    { phrase: 'గురువే బ్రహ్మ విష్ణు మహేశ్వర', english: 'The teacher is Brahma Vishnu and Shiva' },
    { phrase: 'పని ఉన్నచోట సంపద ఉంటుంది', english: 'Where there is work there is wealth' },
    { phrase: 'దూరపు కొండలు నున్నగా ఉంటాయి', english: 'Distant mountains appear smooth (grass is greener)' },
    { phrase: 'లేని ఊళ్ళో మారుతీ నాయుడే ప్రధాని', english: 'In a town of no one, Maruthi Naidu is the leader' },
    { phrase: 'పిడికిలి బిగిస్తే బలం', english: 'A clenched fist means strength (solidarity)' },
    { phrase: 'ముందు నిప్పు వెనక నీళ్ళు', english: 'Fire in front water behind (caught between troubles)' },
    { phrase: 'ఒకటొకటే అయినా ఒకటి కంటే ఒకటి ఎక్కువ', english: 'One by one, each is greater than the other (cumulative power)' },
    { phrase: 'తెలుగు వాడికి తెలుగు మేలు', english: 'Telugu is best for a Telugu person' },
    { phrase: 'జాతీయతే జీవితం', english: 'Nationhood is life' },
    { phrase: 'పొదుపే ఆదాయం', english: 'Savings are income' },
    { phrase: 'ఆశ ఉన్నచోట ఆలోచన ఉంటుంది', english: 'Where there is hope there is thought' },
    { phrase: 'నీరు పారే చోట నేల చల్లబడుతుంది', english: 'Where water flows the earth cools' },
    { phrase: 'కాలమే మహా వైద్యుడు', english: 'Time is the greatest healer' },
    { phrase: 'మొదలు పెట్టినది మొదటికి వస్తుంది', english: 'What started will return to start' },
    { phrase: 'స్వయంకృషే జీవితానికి మూలం', english: 'Self-effort is the foundation of life' },
    { phrase: 'ప్రతి చీకటికి వెలుతురు ఉంటుంది', english: 'Every darkness has a light' },
    { phrase: 'పసిపాప నవ్వు పరమానందం', english: 'A baby\'s smile is supreme bliss' },
    { phrase: 'సముద్రమే శ్రేష్టం నదులన్నీ దానిలో కలుస్తాయి', english: 'The ocean is greatest as all rivers merge into it' },
    { phrase: 'విజయం వెనక కష్టం దాగి ఉంటుంది', english: 'Behind every victory hard work is hidden' },
    { phrase: 'నిజమైన సంపద మనసులో ఉంటుంది', english: 'True wealth resides in the mind' },
  ],
  malayalam: [
    { phrase: 'ഇല്ലത്തെ ഉണ്ണി ഉണ്ണ്, ഒഴിഞ്ഞ കൈ ഒഴിഞ്ഞ കൈ', english: 'The son at home eats, empty hands remain empty' },
    { phrase: 'ആനക്കൊമ്പ് ആനക്കൊമ്പ് തന്നെ', english: 'Elephant tusk is always an elephant tusk (original stays original)' },
    { phrase: 'ഒരു കൈ കൊണ്ട് കൈ കൊട്ടില്ല', english: 'One hand cannot clap alone' },
    { phrase: 'ആറ്റിൽ കളഞ്ഞാലും അളന്നു കളയണം', english: 'Even if throwing in the river, measure first' },
    { phrase: 'കക്ഷത്തിൽ കത്തി കൊണ്ടിരിക്കേ', english: 'Carrying a knife under the arm (hidden danger)' },
    { phrase: 'ആദ്യം ഭക്ഷണം, പിന്നെ ഭഗവദ്ഗീത', english: 'First food, then philosophy (priorities matter)' },
    { phrase: 'ഉള്ളതു തരും ഇല്ലാത്തത് ചോദിക്കേണ്ട', english: 'Give what you have, don\'t ask for what you don\'t' },
    { phrase: 'കടം വാങ്ങിയ ഗർവ്വ് ദൈവം കൊടുക്കില്ല', english: 'God won\'t give borrowed pride' },
    { phrase: 'ഒരിക്കൽ ഒരാൾ ഒരിക്കൽ ആണ്', english: 'A man once is a man once (value of a moment)' },
    { phrase: 'കരയ്ക്ക് കയറാത്ത കടൽ ഇല്ല', english: 'There is no sea that doesn\'t reach shore' },
    { phrase: 'വിദ്യ ഒരു കൈ, ബുദ്ധി ഒരു കൈ', english: 'Knowledge is one hand, wisdom is another' },
    { phrase: 'ഭൂമി ഉള്ളിടത്ത് ആകാശം ഉണ്ട്', english: 'Where there is earth there is sky' },
    { phrase: 'ജീവിതം ഒരു യാത്ര', english: 'Life is a journey' },
    { phrase: 'അനുഭവം ജ്ഞാനം നൽകുന്നു', english: 'Experience gives wisdom' },
    { phrase: 'സ്നേഹം ഒരു ഭാഷ', english: 'Love is a language' },
    { phrase: 'ക്ഷമ ഒരു ഗുണം', english: 'Patience is a virtue' },
    { phrase: 'ഐക്യം ശക്തി', english: 'Unity is strength' },
    { phrase: 'നന്മ ചെയ്ത് മറക്കുക', english: 'Do good and forget it' },
    { phrase: 'സത്യം മാത്രം നിലനിൽക്കും', english: 'Only truth will survive' },
    { phrase: 'പ്രയത്നം വിജയം നൽകുന്നു', english: 'Effort gives success' },
    { phrase: 'വിദ്യ ഏറ്റവും വലിയ ശക്തി', english: 'Education is the greatest power' },
    { phrase: 'കഠിനാദ്ധ്വാനം സ്വർഗ്ഗദ്വാരം', english: 'Hard work is the gateway to heaven' },
    { phrase: 'ദൈവം ഉള്ളിൽ ഉണ്ട്', english: 'God is within' },
    { phrase: 'പ്രകൃതി ഏറ്റവും വലിയ ഗുരു', english: 'Nature is the greatest teacher' },
    { phrase: 'മനസ്സ് ശുദ്ധമെങ്കിൽ ജീവിതം ശുദ്ധം', english: 'If mind is pure, life is pure' },
    { phrase: 'ശ്രദ്ധ ഉള്ളവൻ ജയിക്കും', english: 'The attentive one will win' },
    { phrase: 'ഭൂതകാലം മറക്കുക, ഭാവി ആലോചിക്കുക', english: 'Forget the past, think of the future' },
    { phrase: 'സന്തോഷം ഒരു തിരഞ്ഞെടുക്കൽ', english: 'Happiness is a choice' },
    { phrase: 'ഓരോ ദിനവും ഒരു അവസരം', english: 'Every day is an opportunity' },
    { phrase: 'ജ്ഞാനം ആഴമേറുന്നു', english: 'Knowledge deepens over time' },
    { phrase: 'ആരോഗ്യം ഏറ്റവും വലിയ സമ്പത്ത്', english: 'Health is the greatest wealth' },
    { phrase: 'കടൽ ആഴം ഉള്ളത്', english: 'The sea has depth (a person of depth)' },
    { phrase: 'ഓരോ ബന്ധവും ഒരു സ്വർഗ്ഗം', english: 'Every relationship is a heaven' },
    { phrase: 'ഭൂമി ഉള്ളിടത്ത് ജീവൻ ഉണ്ട്', english: 'Where there is earth there is life' },
    { phrase: 'നദി ഒഴുകും തടസ്സം ഇല്ലാതെ', english: 'The river flows without obstacle' },
    { phrase: 'ഒരു ചെറിയ നന്മ ലോകം മാറ്റും', english: 'One small act of kindness changes the world' },
    { phrase: 'ഭ്രമം ഒരു കൂട്ട്', english: 'Illusion is a companion (often misleading)' },
    { phrase: 'ഓർമ്മകൾ ഒരു ഖജനാവ്', english: 'Memories are a treasure' },
    { phrase: 'ദൃഢനിശ്ചയം വിജയം', english: 'Determination is victory' },
    { phrase: 'കുടുംബം ഒരു ആകാശം', english: 'Family is a sky (vast and sheltering)' },
    { phrase: 'ഓരോ കണ്ണീർ ഒരു കഥ', english: 'Every tear is a story' },
    { phrase: 'പ്രാർഥന ശക്തി', english: 'Prayer is strength' },
    { phrase: 'സ്വപ്നം കാണുക ആദ്യം', english: 'Dream first' },
    { phrase: 'ആഗ്രഹം ഉള്ളിടത്ത് വഴി ഉണ്ട്', english: 'Where there is desire there is a way' },
    { phrase: 'ഭക്തി ഒരു ബലം', english: 'Devotion is a strength' },
    { phrase: 'ഇന്ന് ചെയ്ത് നാളേക്ക് ആശ്വസിക്കുക', english: 'Do today and rest for tomorrow' },
    { phrase: 'ശരീരം ക്ഷേത്രം', english: 'The body is a temple' },
    { phrase: 'ലക്ഷ്യം ഉണ്ടെങ്കിൽ ജീവിതം ഉണ്ട്', english: 'If there is a goal, there is life' },
    { phrase: 'ഓരോ നിമിഷവും വിലയേറിയത്', english: 'Every moment is precious' },
    { phrase: 'ദൈവം കൂടെ ഉണ്ടെങ്കിൽ ആർക്ക് ഭയം', english: 'If God is with you, who to fear' },
  ],
  kannada: [
    { phrase: 'ಉಪ್ಪು ತಿಂದ ಮನೆಗೆ ಉಪಕಾರ ಮಾಡು', english: 'Be grateful to the house whose salt you ate' },
    { phrase: 'ಕಾಗೆಗೆ ತನ್ನ ಮರಿ ಬಂಗಾರ', english: 'To a crow its chick is gold (partiality)' },
    { phrase: 'ಒಂದು ಕೈಯಿಂದ ಚಪ್ಪಾಳೆ ಆಗುವುದಿಲ್ಲ', english: 'One hand cannot clap alone' },
    { phrase: 'ನಿಪ್ಪಿನಲ್ಲಿ ಸಿಕ್ಕಿದರೂ ಸತ್ಯ ಹೇಳು', english: 'Even caught in fire, speak the truth' },
    { phrase: 'ಅಗ್ಗಿಷ್ಟಿಕೆ ಮಾಡಿದ ಅಡಿಗೆ ಅಮೃತ', english: 'Cooking on a hearth is nectar (homemade is best)' },
    { phrase: 'ದುಡ್ಡಿಲ್ಲದ ಮನೆ ಭೂತಂ ಇದ್ದ ಮನೆ', english: 'A house without money is a haunted house' },
    { phrase: 'ಸಾವಿರ ಕೇಳಿದರೂ ಒಂದು ನೋಡಿದ್ದು ಮೇಲು', english: 'A thousand told is less than one seen' },
    { phrase: 'ಆಲದ ಮರ ದೊಡ್ಡದು, ಅದರ ಕೆಳಗೆ ಕುಳಿತರೆ ಬೆಳಕಿಲ್ಲ', english: 'Banyan is big but sitting under it gets no sunlight' },
    { phrase: 'ಮನಸ್ಸು ಶುದ್ಧವಾಗಿದ್ದರೆ ಜೀವನ ಸುಂದರ', english: 'If mind is pure, life is beautiful' },
    { phrase: 'ಕಷ್ಟ ಕಾಲದಲ್ಲಿ ಕಲಿಯುವ ಪಾಠ ಕಠಿಣ', english: 'Lessons learned in hardship are tough' },
    { phrase: 'ಮಾತಿಗಿಂತ ಮೌನ ಮೇಲು', english: 'Silence is better than speech' },
    { phrase: 'ಶ್ರಮದ ಫಲ ಸಿಹಿ', english: 'Fruit of labor is sweet' },
    { phrase: 'ಒಳ್ಳೆಯ ಮಾತು ಮದ್ದಿನ ಹಾಗೆ', english: 'Good words are like medicine' },
    { phrase: 'ವಿದ್ಯೆ ವಿನಯ ಕೊಡುತ್ತದೆ', english: 'Education gives humility' },
    { phrase: 'ಐಕ್ಯತೆ ಬಲ', english: 'Unity is strength' },
    { phrase: 'ಸತ್ಯ ಮಾತ್ರ ಜಯಿಸುತ್ತದೆ', english: 'Only truth wins' },
    { phrase: 'ಪ್ರಯತ್ನ ಯಶಸ್ಸು ನೀಡುತ್ತದೆ', english: 'Effort gives success' },
    { phrase: 'ಅನುಭವ ಅತ್ಯಂತ ದೊಡ್ಡ ಗುರು', english: 'Experience is the greatest teacher' },
    { phrase: 'ಸ್ನೇಹ ಒಂದು ಭಾಷೆ', english: 'Friendship is a language' },
    { phrase: 'ತಾಳ್ಮೆ ಒಂದು ಗುಣ', english: 'Patience is a virtue' },
    { phrase: 'ಆರೋಗ್ಯ ಅತ್ಯಂತ ದೊಡ್ಡ ಸಂಪತ್ತು', english: 'Health is the greatest wealth' },
    { phrase: 'ಜೀವನ ಒಂದು ಪ್ರಯಾಣ', english: 'Life is a journey' },
    { phrase: 'ಭಗವಂತ ಒಳಗಿದ್ದಾನೆ', english: 'God is within' },
    { phrase: 'ಪ್ರಕೃತಿ ಅತ್ಯಂತ ದೊಡ್ಡ ಗುರು', english: 'Nature is the greatest teacher' },
    { phrase: 'ಕನಸು ಕಾಣು ಮೊದಲು', english: 'Dream first' },
    { phrase: 'ಕಾಲ ದೊಡ್ಡ ವೈದ್ಯ', english: 'Time is the greatest healer' },
    { phrase: 'ಪ್ರಾರ್ಥನೆ ಶಕ್ತಿ', english: 'Prayer is strength' },
    { phrase: 'ದೇಹ ದೇವಾಲಯ', english: 'The body is a temple' },
    { phrase: 'ಪ್ರತಿ ದಿನ ಒಂದು ಅವಕಾಶ', english: 'Every day is an opportunity' },
    { phrase: 'ಪ್ರೀತಿ ಎಲ್ಲವನ್ನೂ ಗೆಲ್ಲುತ್ತದೆ', english: 'Love conquers all' },
    { phrase: 'ಸ್ವಪ್ರಯತ್ನ ಜೀವನಕ್ಕೆ ಮೂಲ', english: 'Self-effort is the foundation of life' },
    { phrase: 'ಒಳ್ಳೆಯ ಕೆಲಸ ಒಳ್ಳೆಯ ಫಲ', english: 'Good work, good results' },
    { phrase: 'ನೆನಪುಗಳು ಒಂದು ಭಂಡಾರ', english: 'Memories are a treasure' },
    { phrase: 'ಅಭ್ಯಾಸ ಮಾಡಿದರೆ ಯಾವುದೂ ಕಷ್ಟ ಅಲ್ಲ', english: 'With practice nothing is difficult' },
    { phrase: 'ಶ್ರದ್ಧೆ ಯಶಸ್ಸಿನ ಬೀಜ', english: 'Dedication is the seed of success' },
    { phrase: 'ಸಂಸಾರ ಒಂದು ಆಕಾಶ', english: 'Family is a sky (vast and sheltering)' },
    { phrase: 'ಕ್ಷಮಿಸಿದರೆ ಬಲ ಸಿಗುತ್ತದೆ', english: 'Forgiving gives strength' },
    { phrase: 'ಹಿಂದೆ ಅಲ್ಲ ಮುಂದೆ ನೋಡು', english: 'Look not behind but ahead' },
    { phrase: 'ಸಂತೋಷ ಒಂದು ಆಯ್ಕೆ', english: 'Happiness is a choice' },
    { phrase: 'ಬಯಕೆ ಇದ್ದರೆ ದಾರಿ ಇದೆ', english: 'Where there is desire there is a way' },
    { phrase: 'ನದಿ ಹರಿಯುತ್ತದೆ ತಡೆ ಇಲ್ಲದೆ', english: 'The river flows without obstacle' },
    { phrase: 'ಗಮ್ಯ ಇದ್ದರೆ ಜೀವನ ಇದೆ', english: 'If there is a goal, there is life' },
    { phrase: 'ಒಂದು ನಗು ಅನೇಕ ತೊಂದರೆಗಳನ್ನು ಮರೆಸುತ್ತದೆ', english: 'One smile erases many troubles' },
    { phrase: 'ಮನಸ್ಸಿನ ಶಾಂತಿ ಮಹಾ ಸಿರಿ', english: 'Peace of mind is the greatest wealth' },
    { phrase: 'ಭಕ್ತಿ ಒಂದು ಶಕ್ತಿ', english: 'Devotion is a strength' },
    { phrase: 'ಜ್ಞಾನ ಕಾಲದೊಂದಿಗೆ ಹೆಚ್ಚಾಗುತ್ತದೆ', english: 'Knowledge grows with time' },
    { phrase: 'ಒಳ್ಳೆಯ ಗೆಳೆಯ ದೊಡ್ಡ ಸಂಪತ್ತು', english: 'A good friend is a great wealth' },
    { phrase: 'ಮಕ್ಕಳ ನಗು ಮನೆ ಬೆಳಗಿಸುತ್ತದೆ', english: 'Children\'s laughter lights up the home' },
    { phrase: 'ಸ್ವಾಭಿಮಾನ ಬದುಕಿನ ಆಧಾರ', english: 'Self-respect is the basis of life' },
    { phrase: 'ದೇವರ ಮೇಲೆ ನಂಬಿಕೆ ಶಕ್ತಿ', english: 'Faith in God is strength' },
  ],
};

// --- Auto-Appended Languages ---
UI_TRANSLATIONS['spanish'] = {
  "learn": "Aprender",
  "games": "Juegos",
  "community": "Comunidad",
  "leaderboard": "Clasificación",
  "culture": "Cultura",
  "profile": "Perfil",
  "communityMockMessage": "¡Emocionado de aprender español aquí!"
};
SPEECH_CODES['spanish'] = 'es-ES';
GREETINGS['spanish'] = 'Hola';
PRONOUNCE_GAME_POOLS['spanish'] = [
  {
    "phrase": "Hola",
    "english": "Hello"
  },
  {
    "phrase": "Gracias",
    "english": "Thank you"
  },
  {
    "phrase": "Sí",
    "english": "Yes"
  },
  {
    "phrase": "No",
    "english": "No"
  },
  {
    "phrase": "Por favor",
    "english": "Please"
  },
  {
    "phrase": "Agua",
    "english": "Water"
  },
  {
    "phrase": "Comida",
    "english": "Food"
  },
  {
    "phrase": "Casa",
    "english": "House"
  },
  {
    "phrase": "Libro",
    "english": "Book"
  },
  {
    "phrase": "Escuela",
    "english": "School"
  },
  {
    "phrase": "Amigo",
    "english": "Friend"
  },
  {
    "phrase": "Familia",
    "english": "Family"
  },
  {
    "phrase": "Madre",
    "english": "Mother"
  },
  {
    "phrase": "Padre",
    "english": "Father"
  },
  {
    "phrase": "Amor",
    "english": "Love"
  },
  {
    "phrase": "Tiempo",
    "english": "Time"
  },
  {
    "phrase": "Día",
    "english": "Day"
  },
  {
    "phrase": "Noche",
    "english": "Night"
  },
  {
    "phrase": "Hoy",
    "english": "Today"
  },
  {
    "phrase": "Mañana",
    "english": "Tomorrow"
  },
  {
    "phrase": "Ayer",
    "english": "Yesterday"
  },
  {
    "phrase": "Sol",
    "english": "Sun"
  },
  {
    "phrase": "Luna",
    "english": "Moon"
  },
  {
    "phrase": "Árbol",
    "english": "Tree"
  },
  {
    "phrase": "Flor",
    "english": "Flower"
  },
  {
    "phrase": "Gato",
    "english": "Cat"
  },
  {
    "phrase": "Perro",
    "english": "Dog"
  },
  {
    "phrase": "Pájaro",
    "english": "Bird"
  },
  {
    "phrase": "Camino",
    "english": "Road"
  },
  {
    "phrase": "Coche",
    "english": "Car"
  },
  {
    "phrase": "Tren",
    "english": "Train"
  },
  {
    "phrase": "Dinero",
    "english": "Money"
  },
  {
    "phrase": "Trabajo",
    "english": "Work"
  },
  {
    "phrase": "Ayuda",
    "english": "Help"
  },
  {
    "phrase": "Alto",
    "english": "Stop"
  },
  {
    "phrase": "Ir",
    "english": "Go"
  },
  {
    "phrase": "Venir",
    "english": "Come"
  },
  {
    "phrase": "Comer",
    "english": "Eat"
  },
  {
    "phrase": "Beber",
    "english": "Drink"
  },
  {
    "phrase": "Dormir",
    "english": "Sleep"
  },
  {
    "phrase": "Leer",
    "english": "Read"
  },
  {
    "phrase": "Escribir",
    "english": "Write"
  },
  {
    "phrase": "Hablar",
    "english": "Speak"
  },
  {
    "phrase": "Escuchar",
    "english": "Listen"
  },
  {
    "phrase": "Mirar",
    "english": "Look"
  },
  {
    "phrase": "Feliz",
    "english": "Happy"
  },
  {
    "phrase": "Triste",
    "english": "Sad"
  },
  {
    "phrase": "Bueno",
    "english": "Good"
  },
  {
    "phrase": "Malo",
    "english": "Bad"
  },
  {
    "phrase": "Grande",
    "english": "Big"
  }
];
QUIZ_POOLS['spanish'] = [
  {
    "target": "Hola",
    "options": [
      "Hello",
      "Night",
      "Today",
      "Love"
    ],
    "correct": 0
  },
  {
    "target": "Gracias",
    "options": [
      "Good",
      "Thank you",
      "Come",
      "Book"
    ],
    "correct": 1
  },
  {
    "target": "Sí",
    "options": [
      "Water",
      "Good",
      "Yes",
      "Train"
    ],
    "correct": 2
  },
  {
    "target": "No",
    "options": [
      "Happy",
      "Yesterday",
      "No",
      "Car"
    ],
    "correct": 2
  },
  {
    "target": "Por favor",
    "options": [
      "Speak",
      "Night",
      "Happy",
      "Please"
    ],
    "correct": 3
  },
  {
    "target": "Agua",
    "options": [
      "Water",
      "Speak",
      "Read",
      "Book"
    ],
    "correct": 0
  },
  {
    "target": "Comida",
    "options": [
      "Day",
      "Food",
      "Car",
      "Friend"
    ],
    "correct": 1
  },
  {
    "target": "Casa",
    "options": [
      "House",
      "Flower",
      "Water",
      "Tree"
    ],
    "correct": 0
  },
  {
    "target": "Libro",
    "options": [
      "Book",
      "Look",
      "Tomorrow",
      "Night"
    ],
    "correct": 0
  },
  {
    "target": "Escuela",
    "options": [
      "Flower",
      "Cat",
      "School",
      "Happy"
    ],
    "correct": 2
  },
  {
    "target": "Amigo",
    "options": [
      "Friend",
      "House",
      "Bad",
      "Write"
    ],
    "correct": 0
  },
  {
    "target": "Familia",
    "options": [
      "Family",
      "Tree",
      "Go",
      "Yesterday"
    ],
    "correct": 0
  },
  {
    "target": "Madre",
    "options": [
      "Day",
      "Car",
      "Money",
      "Mother"
    ],
    "correct": 3
  },
  {
    "target": "Padre",
    "options": [
      "Father",
      "Time",
      "Moon",
      "Sun"
    ],
    "correct": 0
  },
  {
    "target": "Amor",
    "options": [
      "Love",
      "Flower",
      "Yes",
      "Drink"
    ],
    "correct": 0
  },
  {
    "target": "Tiempo",
    "options": [
      "Sun",
      "Come",
      "Bird",
      "Time"
    ],
    "correct": 3
  },
  {
    "target": "Día",
    "options": [
      "Speak",
      "School",
      "Day",
      "Happy"
    ],
    "correct": 2
  },
  {
    "target": "Noche",
    "options": [
      "Go",
      "Night",
      "School",
      "Car"
    ],
    "correct": 1
  },
  {
    "target": "Hoy",
    "options": [
      "Water",
      "Book",
      "Mother",
      "Today"
    ],
    "correct": 3
  },
  {
    "target": "Mañana",
    "options": [
      "Look",
      "Tomorrow",
      "Bad",
      "Sad"
    ],
    "correct": 1
  },
  {
    "target": "Ayer",
    "options": [
      "Night",
      "Go",
      "Yesterday",
      "Tomorrow"
    ],
    "correct": 2
  },
  {
    "target": "Sol",
    "options": [
      "Eat",
      "No",
      "Sun",
      "Read"
    ],
    "correct": 2
  },
  {
    "target": "Luna",
    "options": [
      "Water",
      "Moon",
      "Tomorrow",
      "Mother"
    ],
    "correct": 1
  },
  {
    "target": "Árbol",
    "options": [
      "Thank you",
      "Write",
      "Tree",
      "Stop"
    ],
    "correct": 2
  },
  {
    "target": "Flor",
    "options": [
      "Bad",
      "House",
      "Flower",
      "Hello"
    ],
    "correct": 2
  },
  {
    "target": "Gato",
    "options": [
      "Tomorrow",
      "Come",
      "Cat",
      "Friend"
    ],
    "correct": 2
  },
  {
    "target": "Perro",
    "options": [
      "No",
      "Dog",
      "Come",
      "Mother"
    ],
    "correct": 1
  },
  {
    "target": "Pájaro",
    "options": [
      "Cat",
      "Work",
      "Bird",
      "Train"
    ],
    "correct": 2
  },
  {
    "target": "Camino",
    "options": [
      "Moon",
      "Father",
      "Road",
      "Hello"
    ],
    "correct": 2
  },
  {
    "target": "Coche",
    "options": [
      "Car",
      "Stop",
      "Family",
      "Food"
    ],
    "correct": 0
  },
  {
    "target": "Tren",
    "options": [
      "Train",
      "Book",
      "Dog",
      "Love"
    ],
    "correct": 0
  },
  {
    "target": "Dinero",
    "options": [
      "Come",
      "Car",
      "Drink",
      "Money"
    ],
    "correct": 3
  },
  {
    "target": "Trabajo",
    "options": [
      "Work",
      "Good",
      "Thank you",
      "Read"
    ],
    "correct": 0
  },
  {
    "target": "Ayuda",
    "options": [
      "Flower",
      "Food",
      "Help",
      "Bird"
    ],
    "correct": 2
  },
  {
    "target": "Alto",
    "options": [
      "Stop",
      "Night",
      "Drink",
      "Please"
    ],
    "correct": 0
  },
  {
    "target": "Ir",
    "options": [
      "Go",
      "Sun",
      "Car",
      "Good"
    ],
    "correct": 0
  },
  {
    "target": "Venir",
    "options": [
      "Come",
      "No",
      "Time",
      "Money"
    ],
    "correct": 0
  },
  {
    "target": "Comer",
    "options": [
      "Eat",
      "Mother",
      "No",
      "Come"
    ],
    "correct": 0
  },
  {
    "target": "Beber",
    "options": [
      "Friend",
      "Drink",
      "Food",
      "Train"
    ],
    "correct": 1
  },
  {
    "target": "Dormir",
    "options": [
      "School",
      "Hello",
      "Train",
      "Sleep"
    ],
    "correct": 3
  },
  {
    "target": "Leer",
    "options": [
      "Eat",
      "Read",
      "Write",
      "Money"
    ],
    "correct": 1
  },
  {
    "target": "Escribir",
    "options": [
      "Write",
      "Hello",
      "Listen",
      "Moon"
    ],
    "correct": 0
  },
  {
    "target": "Hablar",
    "options": [
      "Dog",
      "Work",
      "Speak",
      "Come"
    ],
    "correct": 2
  },
  {
    "target": "Escuchar",
    "options": [
      "Hello",
      "Car",
      "Listen",
      "Friend"
    ],
    "correct": 2
  },
  {
    "target": "Mirar",
    "options": [
      "Speak",
      "Help",
      "Sun",
      "Look"
    ],
    "correct": 3
  },
  {
    "target": "Feliz",
    "options": [
      "Moon",
      "Help",
      "Happy",
      "Sad"
    ],
    "correct": 2
  },
  {
    "target": "Triste",
    "options": [
      "Sad",
      "Family",
      "Cat",
      "Tree"
    ],
    "correct": 0
  },
  {
    "target": "Bueno",
    "options": [
      "Good",
      "Sad",
      "Work",
      "Come"
    ],
    "correct": 0
  },
  {
    "target": "Malo",
    "options": [
      "Listen",
      "Bad",
      "Love",
      "Stop"
    ],
    "correct": 1
  },
  {
    "target": "Grande",
    "options": [
      "Big",
      "No",
      "Book",
      "Go"
    ],
    "correct": 0
  }
];
UI_TRANSLATIONS['french'] = {
  "learn": "Apprendre",
  "games": "Jeux",
  "community": "Communauté",
  "leaderboard": "Classement",
  "culture": "Culture",
  "profile": "Profil",
  "communityMockMessage": "Ravi d'apprendre le français ici!"
};
SPEECH_CODES['french'] = 'fr-FR';
GREETINGS['french'] = 'Bonjour';
PRONOUNCE_GAME_POOLS['french'] = [
  {
    "phrase": "Bonjour",
    "english": "Hello"
  },
  {
    "phrase": "Merci",
    "english": "Thank you"
  },
  {
    "phrase": "Oui",
    "english": "Yes"
  },
  {
    "phrase": "Non",
    "english": "No"
  },
  {
    "phrase": "S'il vous plaît",
    "english": "Please"
  },
  {
    "phrase": "Eau",
    "english": "Water"
  },
  {
    "phrase": "Nourriture",
    "english": "Food"
  },
  {
    "phrase": "Maison",
    "english": "House"
  },
  {
    "phrase": "Livre",
    "english": "Book"
  },
  {
    "phrase": "École",
    "english": "School"
  },
  {
    "phrase": "Ami",
    "english": "Friend"
  },
  {
    "phrase": "Famille",
    "english": "Family"
  },
  {
    "phrase": "Mère",
    "english": "Mother"
  },
  {
    "phrase": "Père",
    "english": "Father"
  },
  {
    "phrase": "Amour",
    "english": "Love"
  },
  {
    "phrase": "Temps",
    "english": "Time"
  },
  {
    "phrase": "Jour",
    "english": "Day"
  },
  {
    "phrase": "Nuit",
    "english": "Night"
  },
  {
    "phrase": "Aujourd'hui",
    "english": "Today"
  },
  {
    "phrase": "Demain",
    "english": "Tomorrow"
  },
  {
    "phrase": "Hier",
    "english": "Yesterday"
  },
  {
    "phrase": "Soleil",
    "english": "Sun"
  },
  {
    "phrase": "Lune",
    "english": "Moon"
  },
  {
    "phrase": "Arbre",
    "english": "Tree"
  },
  {
    "phrase": "Fleur",
    "english": "Flower"
  },
  {
    "phrase": "Chat",
    "english": "Cat"
  },
  {
    "phrase": "Chien",
    "english": "Dog"
  },
  {
    "phrase": "Oiseau",
    "english": "Bird"
  },
  {
    "phrase": "Route",
    "english": "Road"
  },
  {
    "phrase": "Voiture",
    "english": "Car"
  },
  {
    "phrase": "Train",
    "english": "Train"
  },
  {
    "phrase": "Argent",
    "english": "Money"
  },
  {
    "phrase": "Travail",
    "english": "Work"
  },
  {
    "phrase": "Aide",
    "english": "Help"
  },
  {
    "phrase": "Arrêt",
    "english": "Stop"
  },
  {
    "phrase": "Aller",
    "english": "Go"
  },
  {
    "phrase": "Venir",
    "english": "Come"
  },
  {
    "phrase": "Manger",
    "english": "Eat"
  },
  {
    "phrase": "Boire",
    "english": "Drink"
  },
  {
    "phrase": "Dormir",
    "english": "Sleep"
  },
  {
    "phrase": "Lire",
    "english": "Read"
  },
  {
    "phrase": "Écrire",
    "english": "Write"
  },
  {
    "phrase": "Parler",
    "english": "Speak"
  },
  {
    "phrase": "Écouter",
    "english": "Listen"
  },
  {
    "phrase": "Regarder",
    "english": "Look"
  },
  {
    "phrase": "Heureux",
    "english": "Happy"
  },
  {
    "phrase": "Triste",
    "english": "Sad"
  },
  {
    "phrase": "Bon",
    "english": "Good"
  },
  {
    "phrase": "Mauvais",
    "english": "Bad"
  },
  {
    "phrase": "Grand",
    "english": "Big"
  }
];
QUIZ_POOLS['french'] = [
  {
    "target": "Bonjour",
    "options": [
      "Sad",
      "Hello",
      "Please",
      "Moon"
    ],
    "correct": 1
  },
  {
    "target": "Merci",
    "options": [
      "Road",
      "Today",
      "Listen",
      "Thank you"
    ],
    "correct": 3
  },
  {
    "target": "Oui",
    "options": [
      "Cat",
      "Yes",
      "Today",
      "Day"
    ],
    "correct": 1
  },
  {
    "target": "Non",
    "options": [
      "Today",
      "Sun",
      "No",
      "Big"
    ],
    "correct": 2
  },
  {
    "target": "S'il vous plaît",
    "options": [
      "Please",
      "Car",
      "Bird",
      "Today"
    ],
    "correct": 0
  },
  {
    "target": "Eau",
    "options": [
      "Yesterday",
      "Happy",
      "Bad",
      "Water"
    ],
    "correct": 3
  },
  {
    "target": "Nourriture",
    "options": [
      "Food",
      "Look",
      "Moon",
      "Read"
    ],
    "correct": 0
  },
  {
    "target": "Maison",
    "options": [
      "House",
      "Please",
      "Good",
      "Love"
    ],
    "correct": 0
  },
  {
    "target": "Livre",
    "options": [
      "Look",
      "Big",
      "Write",
      "Book"
    ],
    "correct": 3
  },
  {
    "target": "École",
    "options": [
      "Road",
      "Read",
      "Please",
      "School"
    ],
    "correct": 3
  },
  {
    "target": "Ami",
    "options": [
      "Listen",
      "Friend",
      "Work",
      "Thank you"
    ],
    "correct": 1
  },
  {
    "target": "Famille",
    "options": [
      "Food",
      "Thank you",
      "Car",
      "Family"
    ],
    "correct": 3
  },
  {
    "target": "Mère",
    "options": [
      "Drink",
      "Friend",
      "No",
      "Mother"
    ],
    "correct": 3
  },
  {
    "target": "Père",
    "options": [
      "Father",
      "Flower",
      "Drink",
      "Sun"
    ],
    "correct": 0
  },
  {
    "target": "Amour",
    "options": [
      "Come",
      "Big",
      "Love",
      "Book"
    ],
    "correct": 2
  },
  {
    "target": "Temps",
    "options": [
      "School",
      "Time",
      "Big",
      "Mother"
    ],
    "correct": 1
  },
  {
    "target": "Jour",
    "options": [
      "Day",
      "Big",
      "Road",
      "Listen"
    ],
    "correct": 0
  },
  {
    "target": "Nuit",
    "options": [
      "Night",
      "Road",
      "Drink",
      "Big"
    ],
    "correct": 0
  },
  {
    "target": "Aujourd'hui",
    "options": [
      "Today",
      "Love",
      "Yes",
      "Bird"
    ],
    "correct": 0
  },
  {
    "target": "Demain",
    "options": [
      "Bad",
      "Tomorrow",
      "Hello",
      "Look"
    ],
    "correct": 1
  },
  {
    "target": "Hier",
    "options": [
      "Mother",
      "Yesterday",
      "Write",
      "Big"
    ],
    "correct": 1
  },
  {
    "target": "Soleil",
    "options": [
      "Sun",
      "Dog",
      "Write",
      "Moon"
    ],
    "correct": 0
  },
  {
    "target": "Lune",
    "options": [
      "Tomorrow",
      "Yes",
      "Sad",
      "Moon"
    ],
    "correct": 3
  },
  {
    "target": "Arbre",
    "options": [
      "Road",
      "Happy",
      "Tree",
      "Food"
    ],
    "correct": 2
  },
  {
    "target": "Fleur",
    "options": [
      "Flower",
      "Speak",
      "Hello",
      "Go"
    ],
    "correct": 0
  },
  {
    "target": "Chat",
    "options": [
      "Love",
      "Cat",
      "Write",
      "Big"
    ],
    "correct": 1
  },
  {
    "target": "Chien",
    "options": [
      "Dog",
      "Day",
      "Yesterday",
      "Family"
    ],
    "correct": 0
  },
  {
    "target": "Oiseau",
    "options": [
      "Tree",
      "Help",
      "Bird",
      "Father"
    ],
    "correct": 2
  },
  {
    "target": "Route",
    "options": [
      "Road",
      "Yes",
      "Look",
      "Friend"
    ],
    "correct": 0
  },
  {
    "target": "Voiture",
    "options": [
      "Car",
      "Food",
      "Tomorrow",
      "Night"
    ],
    "correct": 0
  },
  {
    "target": "Train",
    "options": [
      "Money",
      "House",
      "Train",
      "Moon"
    ],
    "correct": 2
  },
  {
    "target": "Argent",
    "options": [
      "Money",
      "Please",
      "Good",
      "Sad"
    ],
    "correct": 0
  },
  {
    "target": "Travail",
    "options": [
      "Food",
      "Work",
      "School",
      "Tree"
    ],
    "correct": 1
  },
  {
    "target": "Aide",
    "options": [
      "House",
      "Mother",
      "Help",
      "Money"
    ],
    "correct": 2
  },
  {
    "target": "Arrêt",
    "options": [
      "Stop",
      "Sad",
      "Sleep",
      "Moon"
    ],
    "correct": 0
  },
  {
    "target": "Aller",
    "options": [
      "Tree",
      "Go",
      "Train",
      "Bad"
    ],
    "correct": 1
  },
  {
    "target": "Venir",
    "options": [
      "Come",
      "Mother",
      "Look",
      "Love"
    ],
    "correct": 0
  },
  {
    "target": "Manger",
    "options": [
      "Water",
      "Eat",
      "Good",
      "Father"
    ],
    "correct": 1
  },
  {
    "target": "Boire",
    "options": [
      "Sad",
      "Drink",
      "Listen",
      "Big"
    ],
    "correct": 1
  },
  {
    "target": "Dormir",
    "options": [
      "Sleep",
      "Sad",
      "Family",
      "Good"
    ],
    "correct": 0
  },
  {
    "target": "Lire",
    "options": [
      "Family",
      "Read",
      "Eat",
      "Tree"
    ],
    "correct": 1
  },
  {
    "target": "Écrire",
    "options": [
      "Write",
      "Love",
      "Road",
      "Friend"
    ],
    "correct": 0
  },
  {
    "target": "Parler",
    "options": [
      "Speak",
      "Read",
      "Hello",
      "Train"
    ],
    "correct": 0
  },
  {
    "target": "Écouter",
    "options": [
      "Look",
      "Time",
      "Dog",
      "Listen"
    ],
    "correct": 3
  },
  {
    "target": "Regarder",
    "options": [
      "Father",
      "Look",
      "Sun",
      "Write"
    ],
    "correct": 1
  },
  {
    "target": "Heureux",
    "options": [
      "Happy",
      "No",
      "Help",
      "Sleep"
    ],
    "correct": 0
  },
  {
    "target": "Triste",
    "options": [
      "Cat",
      "Sad",
      "Road",
      "House"
    ],
    "correct": 1
  },
  {
    "target": "Bon",
    "options": [
      "Good",
      "Go",
      "Yesterday",
      "Road"
    ],
    "correct": 0
  },
  {
    "target": "Mauvais",
    "options": [
      "Bad",
      "Hello",
      "Go",
      "Come"
    ],
    "correct": 0
  },
  {
    "target": "Grand",
    "options": [
      "Dog",
      "Go",
      "No",
      "Big"
    ],
    "correct": 3
  }
];
UI_TRANSLATIONS['german'] = {
  "learn": "Lernen",
  "games": "Spiele",
  "community": "Gemeinschaft",
  "leaderboard": "Bestenliste",
  "culture": "Kultur",
  "profile": "Profil",
  "communityMockMessage": "Ich freue mich darauf, hier Deutsch zu lernen!"
};
SPEECH_CODES['german'] = 'de-DE';
GREETINGS['german'] = 'Hallo';
PRONOUNCE_GAME_POOLS['german'] = [
  {
    "phrase": "Hallo",
    "english": "Hello"
  },
  {
    "phrase": "Danke",
    "english": "Thank you"
  },
  {
    "phrase": "Ja",
    "english": "Yes"
  },
  {
    "phrase": "Nein",
    "english": "No"
  },
  {
    "phrase": "Bitte",
    "english": "Please"
  },
  {
    "phrase": "Wasser",
    "english": "Water"
  },
  {
    "phrase": "Essen",
    "english": "Food"
  },
  {
    "phrase": "Haus",
    "english": "House"
  },
  {
    "phrase": "Buch",
    "english": "Book"
  },
  {
    "phrase": "Schule",
    "english": "School"
  },
  {
    "phrase": "Freund",
    "english": "Friend"
  },
  {
    "phrase": "Familie",
    "english": "Family"
  },
  {
    "phrase": "Mutter",
    "english": "Mother"
  },
  {
    "phrase": "Vater",
    "english": "Father"
  },
  {
    "phrase": "Liebe",
    "english": "Love"
  },
  {
    "phrase": "Zeit",
    "english": "Time"
  },
  {
    "phrase": "Tag",
    "english": "Day"
  },
  {
    "phrase": "Nacht",
    "english": "Night"
  },
  {
    "phrase": "Heute",
    "english": "Today"
  },
  {
    "phrase": "Morgen",
    "english": "Tomorrow"
  },
  {
    "phrase": "Gestern",
    "english": "Yesterday"
  },
  {
    "phrase": "Sonne",
    "english": "Sun"
  },
  {
    "phrase": "Mond",
    "english": "Moon"
  },
  {
    "phrase": "Baum",
    "english": "Tree"
  },
  {
    "phrase": "Blume",
    "english": "Flower"
  },
  {
    "phrase": "Katze",
    "english": "Cat"
  },
  {
    "phrase": "Hund",
    "english": "Dog"
  },
  {
    "phrase": "Vogel",
    "english": "Bird"
  },
  {
    "phrase": "Straße",
    "english": "Road"
  },
  {
    "phrase": "Auto",
    "english": "Car"
  },
  {
    "phrase": "Zug",
    "english": "Train"
  },
  {
    "phrase": "Geld",
    "english": "Money"
  },
  {
    "phrase": "Arbeit",
    "english": "Work"
  },
  {
    "phrase": "Hilfe",
    "english": "Help"
  },
  {
    "phrase": "Stopp",
    "english": "Stop"
  },
  {
    "phrase": "Gehen",
    "english": "Go"
  },
  {
    "phrase": "Kommen",
    "english": "Come"
  },
  {
    "phrase": "Essen",
    "english": "Eat"
  },
  {
    "phrase": "Trinken",
    "english": "Drink"
  },
  {
    "phrase": "Schlafen",
    "english": "Sleep"
  },
  {
    "phrase": "Lesen",
    "english": "Read"
  },
  {
    "phrase": "Schreiben",
    "english": "Write"
  },
  {
    "phrase": "Sprechen",
    "english": "Speak"
  },
  {
    "phrase": "Hören",
    "english": "Listen"
  },
  {
    "phrase": "Schauen",
    "english": "Look"
  },
  {
    "phrase": "Glücklich",
    "english": "Happy"
  },
  {
    "phrase": "Traurig",
    "english": "Sad"
  },
  {
    "phrase": "Gut",
    "english": "Good"
  },
  {
    "phrase": "Schlecht",
    "english": "Bad"
  },
  {
    "phrase": "Groß",
    "english": "Big"
  }
];
QUIZ_POOLS['german'] = [
  {
    "target": "Hallo",
    "options": [
      "Moon",
      "Water",
      "Thank you",
      "Hello"
    ],
    "correct": 3
  },
  {
    "target": "Danke",
    "options": [
      "Thank you",
      "Food",
      "Book",
      "Write"
    ],
    "correct": 0
  },
  {
    "target": "Ja",
    "options": [
      "Speak",
      "Car",
      "Listen",
      "Yes"
    ],
    "correct": 3
  },
  {
    "target": "Nein",
    "options": [
      "Cat",
      "Good",
      "Mother",
      "No"
    ],
    "correct": 3
  },
  {
    "target": "Bitte",
    "options": [
      "Eat",
      "Book",
      "Read",
      "Please"
    ],
    "correct": 3
  },
  {
    "target": "Wasser",
    "options": [
      "Night",
      "Water",
      "Flower",
      "Today"
    ],
    "correct": 1
  },
  {
    "target": "Essen",
    "options": [
      "Tree",
      "Friend",
      "Help",
      "Food"
    ],
    "correct": 3
  },
  {
    "target": "Haus",
    "options": [
      "Car",
      "Listen",
      "House",
      "Work"
    ],
    "correct": 2
  },
  {
    "target": "Buch",
    "options": [
      "Moon",
      "Food",
      "Dog",
      "Book"
    ],
    "correct": 3
  },
  {
    "target": "Schule",
    "options": [
      "Thank you",
      "Dog",
      "School",
      "Drink"
    ],
    "correct": 2
  },
  {
    "target": "Freund",
    "options": [
      "Dog",
      "Bad",
      "Friend",
      "Look"
    ],
    "correct": 2
  },
  {
    "target": "Familie",
    "options": [
      "House",
      "Father",
      "Day",
      "Family"
    ],
    "correct": 3
  },
  {
    "target": "Mutter",
    "options": [
      "Tomorrow",
      "Moon",
      "Car",
      "Mother"
    ],
    "correct": 3
  },
  {
    "target": "Vater",
    "options": [
      "Stop",
      "Dog",
      "Bad",
      "Father"
    ],
    "correct": 3
  },
  {
    "target": "Liebe",
    "options": [
      "Listen",
      "Read",
      "Family",
      "Love"
    ],
    "correct": 3
  },
  {
    "target": "Zeit",
    "options": [
      "Look",
      "Thank you",
      "Big",
      "Time"
    ],
    "correct": 3
  },
  {
    "target": "Tag",
    "options": [
      "Road",
      "Yesterday",
      "Read",
      "Day"
    ],
    "correct": 3
  },
  {
    "target": "Nacht",
    "options": [
      "Flower",
      "Mother",
      "Night",
      "Day"
    ],
    "correct": 2
  },
  {
    "target": "Heute",
    "options": [
      "Big",
      "Moon",
      "Night",
      "Today"
    ],
    "correct": 3
  },
  {
    "target": "Morgen",
    "options": [
      "Look",
      "Moon",
      "Sun",
      "Tomorrow"
    ],
    "correct": 3
  },
  {
    "target": "Gestern",
    "options": [
      "Yesterday",
      "Friend",
      "Listen",
      "Money"
    ],
    "correct": 0
  },
  {
    "target": "Sonne",
    "options": [
      "Happy",
      "House",
      "Cat",
      "Sun"
    ],
    "correct": 3
  },
  {
    "target": "Mond",
    "options": [
      "Big",
      "Listen",
      "Yesterday",
      "Moon"
    ],
    "correct": 3
  },
  {
    "target": "Baum",
    "options": [
      "Tree",
      "Listen",
      "Father",
      "Moon"
    ],
    "correct": 0
  },
  {
    "target": "Blume",
    "options": [
      "Sleep",
      "No",
      "Flower",
      "Speak"
    ],
    "correct": 2
  },
  {
    "target": "Katze",
    "options": [
      "Cat",
      "House",
      "Big",
      "Today"
    ],
    "correct": 0
  },
  {
    "target": "Hund",
    "options": [
      "Family",
      "Dog",
      "Good",
      "Book"
    ],
    "correct": 1
  },
  {
    "target": "Vogel",
    "options": [
      "Book",
      "Bird",
      "Stop",
      "Cat"
    ],
    "correct": 1
  },
  {
    "target": "Straße",
    "options": [
      "Road",
      "Love",
      "Drink",
      "Night"
    ],
    "correct": 0
  },
  {
    "target": "Auto",
    "options": [
      "Car",
      "Yesterday",
      "Come",
      "Listen"
    ],
    "correct": 0
  },
  {
    "target": "Zug",
    "options": [
      "Tree",
      "Help",
      "Drink",
      "Train"
    ],
    "correct": 3
  },
  {
    "target": "Geld",
    "options": [
      "Stop",
      "Money",
      "Today",
      "Mother"
    ],
    "correct": 1
  },
  {
    "target": "Arbeit",
    "options": [
      "Work",
      "Flower",
      "Please",
      "Sun"
    ],
    "correct": 0
  },
  {
    "target": "Hilfe",
    "options": [
      "Happy",
      "Car",
      "Listen",
      "Help"
    ],
    "correct": 3
  },
  {
    "target": "Stopp",
    "options": [
      "Friend",
      "Money",
      "Good",
      "Stop"
    ],
    "correct": 3
  },
  {
    "target": "Gehen",
    "options": [
      "Bird",
      "Thank you",
      "Go",
      "Yes"
    ],
    "correct": 2
  },
  {
    "target": "Kommen",
    "options": [
      "House",
      "Car",
      "Come",
      "Speak"
    ],
    "correct": 2
  },
  {
    "target": "Essen",
    "options": [
      "Eat",
      "Happy",
      "Flower",
      "Night"
    ],
    "correct": 0
  },
  {
    "target": "Trinken",
    "options": [
      "Please",
      "House",
      "Drink",
      "Thank you"
    ],
    "correct": 2
  },
  {
    "target": "Schlafen",
    "options": [
      "Sleep",
      "Good",
      "Please",
      "Help"
    ],
    "correct": 0
  },
  {
    "target": "Lesen",
    "options": [
      "Write",
      "Tree",
      "Read",
      "Mother"
    ],
    "correct": 2
  },
  {
    "target": "Schreiben",
    "options": [
      "House",
      "Road",
      "Cat",
      "Write"
    ],
    "correct": 3
  },
  {
    "target": "Sprechen",
    "options": [
      "Tomorrow",
      "Speak",
      "Happy",
      "Today"
    ],
    "correct": 1
  },
  {
    "target": "Hören",
    "options": [
      "Come",
      "Listen",
      "Bad",
      "Day"
    ],
    "correct": 1
  },
  {
    "target": "Schauen",
    "options": [
      "Look",
      "No",
      "Hello",
      "Listen"
    ],
    "correct": 0
  },
  {
    "target": "Glücklich",
    "options": [
      "Drink",
      "House",
      "Water",
      "Happy"
    ],
    "correct": 3
  },
  {
    "target": "Traurig",
    "options": [
      "Sad",
      "Go",
      "Thank you",
      "Dog"
    ],
    "correct": 0
  },
  {
    "target": "Gut",
    "options": [
      "Work",
      "Good",
      "Tree",
      "Food"
    ],
    "correct": 1
  },
  {
    "target": "Schlecht",
    "options": [
      "Sun",
      "Speak",
      "Road",
      "Bad"
    ],
    "correct": 3
  },
  {
    "target": "Groß",
    "options": [
      "Big",
      "Go",
      "Food",
      "Work"
    ],
    "correct": 0
  }
];

// --- Auto-Appended Minigames ---
LISTEN_GAME_POOLS['spanish'] = [
  {
    "target": "Hola",
    "options": [
      "Hola",
      "Agua",
      "Comida",
      "Escuela"
    ],
    "correct": 0
  },
  {
    "target": "Gracias",
    "options": [
      "Por favor",
      "Gracias",
      "Perdón",
      "Sí"
    ],
    "correct": 1
  },
  {
    "target": "Agua",
    "options": [
      "Manzana",
      "Agua",
      "Casa",
      "Árbol"
    ],
    "correct": 1
  },
  {
    "target": "Comida",
    "options": [
      "Libro",
      "Amigo",
      "Comida",
      "Dinero"
    ],
    "correct": 2
  },
  {
    "target": "Escuela",
    "options": [
      "Hospital",
      "Oficina",
      "Tienda",
      "Escuela"
    ],
    "correct": 3
  }
];
PICTURE_GAME_POOLS['spanish'] = [
  {
    "emoji": "🍎",
    "options": [
      "Manzana",
      "Agua",
      "Casa",
      "Árbol"
    ],
    "correct": 0
  },
  {
    "emoji": "🏠",
    "options": [
      "Escuela",
      "Árbol",
      "Casa",
      "Templo"
    ],
    "correct": 2
  },
  {
    "emoji": "🚗",
    "options": [
      "Coche",
      "Bicicleta",
      "Manzana",
      "Tren"
    ],
    "correct": 0
  },
  {
    "emoji": "🐕",
    "options": [
      "Gato",
      "Perro",
      "Caballo",
      "Vaca"
    ],
    "correct": 1
  },
  {
    "emoji": "🌳",
    "options": [
      "Flor",
      "Árbol",
      "Hoja",
      "Coche"
    ],
    "correct": 1
  }
];
SENTENCE_GAME_POOLS['spanish'] = [
  {
    "original": "Yo voy a la escuela",
    "english": "I go to school",
    "words": [
      "Yo",
      "voy",
      "a",
      "la",
      "escuela"
    ]
  },
  {
    "original": "Él bebe agua",
    "english": "He is drinking water",
    "words": [
      "Él",
      "bebe",
      "agua"
    ]
  },
  {
    "original": "Nosotros estamos jugando",
    "english": "We are playing",
    "words": [
      "Nosotros",
      "estamos",
      "jugando"
    ]
  },
  {
    "original": "Ella lee un libro",
    "english": "She reads a book",
    "words": [
      "Ella",
      "lee",
      "un",
      "libro"
    ]
  },
  {
    "original": "Este es un libro",
    "english": "This is a book",
    "words": [
      "Este",
      "es",
      "un",
      "libro"
    ]
  }
];
GAME_POOLS['spanish'] = [
  {
    "text": "Hola",
    "audio": "Hola"
  },
  {
    "text": "Gracias",
    "audio": "Gracias"
  },
  {
    "text": "Agua",
    "audio": "Agua"
  },
  {
    "text": "Comida",
    "audio": "Comida"
  }
];
LISTEN_GAME_POOLS['french'] = [
  {
    "target": "Bonjour",
    "options": [
      "Bonjour",
      "Eau",
      "Nourriture",
      "École"
    ],
    "correct": 0
  },
  {
    "target": "Merci",
    "options": [
      "S'il vous plaît",
      "Merci",
      "Désolé",
      "Oui"
    ],
    "correct": 1
  },
  {
    "target": "Eau",
    "options": [
      "Pomme",
      "Eau",
      "Maison",
      "Arbre"
    ],
    "correct": 1
  },
  {
    "target": "Nourriture",
    "options": [
      "Livre",
      "Ami",
      "Nourriture",
      "Argent"
    ],
    "correct": 2
  },
  {
    "target": "École",
    "options": [
      "Hôpital",
      "Bureau",
      "Magasin",
      "École"
    ],
    "correct": 3
  }
];
PICTURE_GAME_POOLS['french'] = [
  {
    "emoji": "🍎",
    "options": [
      "Pomme",
      "Eau",
      "Maison",
      "Arbre"
    ],
    "correct": 0
  },
  {
    "emoji": "🏠",
    "options": [
      "École",
      "Arbre",
      "Maison",
      "Temple"
    ],
    "correct": 2
  },
  {
    "emoji": "🚗",
    "options": [
      "Voiture",
      "Vélo",
      "Pomme",
      "Train"
    ],
    "correct": 0
  },
  {
    "emoji": "🐕",
    "options": [
      "Chat",
      "Chien",
      "Cheval",
      "Vache"
    ],
    "correct": 1
  },
  {
    "emoji": "🌳",
    "options": [
      "Fleur",
      "Arbre",
      "Feuille",
      "Voiture"
    ],
    "correct": 1
  }
];
SENTENCE_GAME_POOLS['french'] = [
  {
    "original": "Je vais à l'école",
    "english": "I go to school",
    "words": [
      "Je",
      "vais",
      "à",
      "l'école"
    ]
  },
  {
    "original": "Il boit de l'eau",
    "english": "He is drinking water",
    "words": [
      "Il",
      "boit",
      "de",
      "l'eau"
    ]
  },
  {
    "original": "Nous jouons",
    "english": "We are playing",
    "words": [
      "Nous",
      "jouons"
    ]
  },
  {
    "original": "Elle lit un livre",
    "english": "She reads a book",
    "words": [
      "Elle",
      "lit",
      "un",
      "livre"
    ]
  },
  {
    "original": "C'est un livre",
    "english": "This is a book",
    "words": [
      "C'est",
      "un",
      "livre"
    ]
  }
];
GAME_POOLS['french'] = [
  {
    "text": "Bonjour",
    "audio": "Bonjour"
  },
  {
    "text": "Merci",
    "audio": "Merci"
  },
  {
    "text": "Eau",
    "audio": "Eau"
  },
  {
    "text": "Nourriture",
    "audio": "Nourriture"
  }
];
LISTEN_GAME_POOLS['german'] = [
  {
    "target": "Hallo",
    "options": [
      "Hallo",
      "Wasser",
      "Essen",
      "Schule"
    ],
    "correct": 0
  },
  {
    "target": "Danke",
    "options": [
      "Bitte",
      "Danke",
      "Entschuldigung",
      "Ja"
    ],
    "correct": 1
  },
  {
    "target": "Wasser",
    "options": [
      "Apfel",
      "Wasser",
      "Haus",
      "Baum"
    ],
    "correct": 1
  },
  {
    "target": "Essen",
    "options": [
      "Buch",
      "Freund",
      "Essen",
      "Geld"
    ],
    "correct": 2
  },
  {
    "target": "Schule",
    "options": [
      "Krankenhaus",
      "Büro",
      "Geschäft",
      "Schule"
    ],
    "correct": 3
  }
];
PICTURE_GAME_POOLS['german'] = [
  {
    "emoji": "🍎",
    "options": [
      "Apfel",
      "Wasser",
      "Haus",
      "Baum"
    ],
    "correct": 0
  },
  {
    "emoji": "🏠",
    "options": [
      "Schule",
      "Baum",
      "Haus",
      "Tempel"
    ],
    "correct": 2
  },
  {
    "emoji": "🚗",
    "options": [
      "Auto",
      "Fahrrad",
      "Apfel",
      "Zug"
    ],
    "correct": 0
  },
  {
    "emoji": "🐕",
    "options": [
      "Katze",
      "Hund",
      "Pferd",
      "Kuh"
    ],
    "correct": 1
  },
  {
    "emoji": "🌳",
    "options": [
      "Blume",
      "Baum",
      "Blatt",
      "Auto"
    ],
    "correct": 1
  }
];
SENTENCE_GAME_POOLS['german'] = [
  {
    "original": "Ich gehe zur Schule",
    "english": "I go to school",
    "words": [
      "Ich",
      "gehe",
      "zur",
      "Schule"
    ]
  },
  {
    "original": "Er trinkt Wasser",
    "english": "He is drinking water",
    "words": [
      "Er",
      "trinkt",
      "Wasser"
    ]
  },
  {
    "original": "Wir spielen",
    "english": "We are playing",
    "words": [
      "Wir",
      "spielen"
    ]
  },
  {
    "original": "Sie liest ein Buch",
    "english": "She reads a book",
    "words": [
      "Sie",
      "liest",
      "ein",
      "Buch"
    ]
  },
  {
    "original": "Das ist ein Buch",
    "english": "This is a book",
    "words": [
      "Das",
      "ist",
      "ein",
      "Buch"
    ]
  }
];
GAME_POOLS['german'] = [
  {
    "text": "Hallo",
    "audio": "Hallo"
  },
  {
    "text": "Danke",
    "audio": "Danke"
  },
  {
    "text": "Wasser",
    "audio": "Wasser"
  },
  {
    "text": "Essen",
    "audio": "Essen"
  }
];
