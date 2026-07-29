const VOCAB_ITEMS = {
  tamil: [
    { 
      emoji: '🐶', 
      variants: [
        { native: 'நாய்', english: 'Dog' },
        { native: 'நல்ல நாய்', english: 'Good Dog' },
        { native: 'வேகமான நாய்', english: 'Fast Dog' },
        { native: 'சிறிய நாய்', english: 'Small Dog' },
        { native: 'கருப்பு நாய்', english: 'Black Dog' },
        { native: 'அழகான நாய்', english: 'Beautiful Dog' },
      ]
    },
    { 
      emoji: '🐱', 
      variants: [
        { native: 'பூனை', english: 'Cat' },
        { native: 'அழகான பூனை', english: 'Beautiful Cat' },
        { native: 'சிறிய பூனை', english: 'Small Cat' },
        { native: 'வெள்ளை பூனை', english: 'White Cat' },
        { native: 'செல்லப் பூனை', english: 'Pet Cat' },
      ]
    },
    { 
      emoji: '🐘', 
      variants: [
        { native: 'யானை', english: 'Elephant' },
        { native: 'பெரிய யானை', english: 'Big Elephant' },
        { native: 'கருப்பு யானை', english: 'Black Elephant' },
        { native: 'உயரமான யானை', english: 'Tall Elephant' },
        { native: 'காட்டு யானை', english: 'Wild Elephant' },
      ]
    },
    { 
      emoji: '🦁', 
      variants: [
        { native: 'சிங்கம்', english: 'Lion' },
        { native: 'கோபமான சிங்கம்', english: 'Fierce Lion' },
        { native: 'பெரிய சிங்கம்', english: 'Big Lion' },
        { native: 'பலமான சிங்கம்', english: 'Strong Lion' },
        { native: 'காட்டுச் சிங்கம்', english: 'Wild Lion' },
      ]
    },
    { 
      emoji: '🐦', 
      variants: [
        { native: 'பறவை', english: 'Bird' },
        { native: 'அழகான பறவை', english: 'Beautiful Bird' },
        { native: 'சிறிய பறவை', english: 'Small Bird' },
        { native: 'பறக்கும் பறவை', english: 'Flying Bird' },
        { native: 'வண்ணப் பறவை', english: 'Colorful Bird' },
      ]
    },
    { 
      emoji: '🐟', 
      variants: [
        { native: 'மீன்', english: 'Fish' },
        { native: 'நீந்தும் மீன்', english: 'Swimming Fish' },
        { native: 'சிறிய மீன்', english: 'Small Fish' },
        { native: 'வண்ணமயமான மீன்', english: 'Colorful Fish' },
        { native: 'தங்க மீன்', english: 'Gold Fish' },
      ]
    },
    { 
      emoji: '🐴', 
      variants: [
        { native: 'குதிரை', english: 'Horse' },
        { native: 'வேகமான குதிரை', english: 'Fast Horse' },
        { native: 'உயரமான குதிரை', english: 'Tall Horse' },
        { native: 'பலமான குதிரை', english: 'Strong Horse' },
        { native: 'வெள்ளை குதிரை', english: 'White Horse' },
      ]
    },
    { 
      emoji: '🐻', 
      variants: [
        { native: 'கரடி', english: 'Bear' },
        { native: 'பெரிய கரடி', english: 'Big Bear' },
        { native: 'கருப்பு கரடி', english: 'Black Bear' },
        { native: 'காட்டுக் கரடி', english: 'Wild Bear' },
      ]
    },
    { 
      emoji: '🐰', 
      variants: [
        { native: 'முயல்', english: 'Rabbit' },
        { native: 'வேகமான முயல்', english: 'Fast Rabbit' },
        { native: 'வெள்ளை முயல்', english: 'White Rabbit' },
        { native: 'அழகான முயல்', english: 'Cute Rabbit' },
      ]
    },
    { 
      emoji: '🐒', 
      variants: [
        { native: 'குரங்கு', english: 'Monkey' },
        { native: 'சிறிய குரங்கு', english: 'Small Monkey' },
        { native: 'குறும்புக்கார குரங்கு', english: 'Naughty Monkey' },
      ]
    },
    { 
      emoji: '🐮', 
      variants: [
        { native: 'பசு', english: 'Cow' },
        { native: 'நல்ல பசு', english: 'Gentle Cow' },
        { native: 'வெள்ளை பசு', english: 'White Cow' },
        { native: 'பால் பசு', english: 'Milch Cow' },
      ]
    },
    { 
      emoji: '🐐', 
      variants: [
        { native: 'ஆடு', english: 'Goat' },
        { native: 'சிறிய ஆடு', english: 'Small Goat' },
        { native: 'வேகமான ஆடு', english: 'Fast Goat' },
        { native: 'வெள்ளை ஆடு', english: 'White Goat' },
      ]
    },
    { 
      emoji: '🦌', 
      variants: [
        { native: 'மான்', english: 'Deer' },
        { native: 'அழகான மான்', english: 'Beautiful Deer' },
        { native: 'வேகமான மான்', english: 'Fast Deer' },
        { native: 'புள்ளி மான்', english: 'Spotted Deer' },
      ]
    },
    { 
      emoji: '🐅', 
      variants: [
        { native: 'புலி', english: 'Tiger' },
        { native: 'வேகமான புலி', english: 'Fast Tiger' },
        { native: 'பயங்கரமான புலி', english: 'Fierce Tiger' },
        { native: 'காட்டுப் புலி', english: 'Wild Tiger' },
      ]
    },
    { 
      emoji: '🦆', 
      variants: [
        { native: 'வாத்து', english: 'Duck' },
        { native: 'வெள்ளை வாத்து', english: 'White Duck' },
        { native: 'நீந்தும் வாத்து', english: 'Swimming Duck' },
        { native: 'அழகான வாத்து', english: 'Cute Duck' },
      ]
    },
    { 
      emoji: '📚', 
      variants: [
        { native: 'புத்தகம்', english: 'Book' },
        { native: 'நல்ல புத்தகம்', english: 'Good Book' },
        { native: 'புதிய புத்தகம்', english: 'New Book' },
        { native: 'பெரிய புத்தகம்', english: 'Big Book' },
        { native: 'பாடம் புத்தகம்', english: 'Text Book' },
      ]
    },
    { 
      emoji: '🏠', 
      variants: [
        { native: 'வீடு', english: 'House' },
        { native: 'அழகான வீடு', english: 'Beautiful House' },
        { native: 'பெரிய வீடு', english: 'Big House' },
        { native: 'புதிய வீடு', english: 'New House' },
        { native: 'சின்ன வீடு', english: 'Small House' },
      ]
    },
    { 
      emoji: '🏫', 
      variants: [
        { native: 'பள்ளி', english: 'School' },
        { native: 'பெரிய பள்ளி', english: 'Big School' },
        { native: 'நல்ல பள்ளி', english: 'Good School' },
        { native: 'அழகான பள்ளி', english: 'Beautiful School' },
      ]
    },
    { 
      emoji: '🚗', 
      variants: [
        { native: 'கார்', english: 'Car' },
        { native: 'வேகமான கார்', english: 'Fast Car' },
        { native: 'சிவப்பு கார்', english: 'Red Car' },
        { native: 'புதிய கார்', english: 'New Car' },
        { native: 'அழகான கார்', english: 'Beautiful Car' },
      ]
    },
    { 
      emoji: '🌳', 
      variants: [
        { native: 'மரம்', english: 'Tree' },
        { native: 'பச்சை மரம்', english: 'Green Tree' },
        { native: 'உயரமான மரம்', english: 'Tall Tree' },
        { native: 'பெரிய மரம்', english: 'Big Tree' },
        { native: 'நிழல் மரம்', english: 'Shade Tree' },
      ]
    },
    { 
      emoji: '🌺', 
      variants: [
        { native: 'பூ', english: 'Flower' },
        { native: 'அழகான பூ', english: 'Beautiful Flower' },
        { native: 'சிவப்பு பூ', english: 'Red Flower' },
        { native: 'மஞ்சள் பூ', english: 'Yellow Flower' },
        { native: 'மணமுள்ள பூ', english: 'Fragrant Flower' },
      ]
    },
    { 
      emoji: '☀️', 
      variants: [
        { native: 'சூரியன்', english: 'Sun' },
        { native: 'பிரகாசமான சூரியன்', english: 'Bright Sun' },
        { native: 'சூடான சூரியன்', english: 'Hot Sun' },
        { native: 'மஞ்சள் சூரியன்', english: 'Yellow Sun' },
        { native: 'காலைச் சூரியன்', english: 'Morning Sun' },
      ]
    },
    { 
      emoji: '🌙', 
      variants: [
        { native: 'சந்திரன்', english: 'Moon' },
        { native: 'பிரகாசமான சந்திரன்', english: 'Bright Moon' },
        { native: 'வெள்ளை சந்திரன்', english: 'White Moon' },
        { native: 'அழகான சந்திரன்', english: 'Beautiful Moon' },
        { native: 'குளிர்ந்த சந்திரன்', english: 'Cool Moon' },
      ]
    },
    { 
      emoji: '🖊️', 
      variants: [
        { native: 'பேனா', english: 'Pen' },
        { native: 'நீல பேனா', english: 'Blue Pen' },
        { native: 'புதிய பேனா', english: 'New Pen' },
        { native: 'சிவப்பு பேனா', english: 'Red Pen' },
        { native: 'எழுதும் பேனா', english: 'Writing Pen' },
      ]
    },
    { 
      emoji: '🍎', 
      variants: [
        { native: 'ஆப்பிள்', english: 'Apple' },
        { native: 'சிவப்பு ஆப்பிள்', english: 'Red Apple' },
        { native: 'இனிப்பான ஆப்பிள்', english: 'Sweet Apple' },
        { native: 'சுவையான ஆப்பிள்', english: 'Tasty Apple' },
        { native: 'புதிய ஆப்பிள்', english: 'Fresh Apple' },
      ]
    },
    { 
      emoji: '🍌', 
      variants: [
        { native: 'வாழைப்பழம்', english: 'Banana' },
        { native: 'மஞ்சள் வாழைப்பழம்', english: 'Yellow Banana' },
        { native: 'இனிப்பான வாழைப்பழம்', english: 'Sweet Banana' },
        { native: 'சுவையான வாழைப்பழம்', english: 'Tasty Banana' },
      ]
    },
    { 
      emoji: '💧', 
      variants: [
        { native: 'தண்ணீர்', english: 'Water' },
        { native: 'குளிர்ந்த தண்ணீர்', english: 'Cool Water' },
        { native: 'சுத்தமான தண்ணீர்', english: 'Clean Water' },
        { native: 'குடி தண்ணீர்', english: 'Drinking Water' },
      ]
    },
    { 
      emoji: '🚆', 
      variants: [
        { native: 'ரயில்', english: 'Train' },
        { native: 'நீளமான ரயில்', english: 'Long Train' },
        { native: 'வேகமான ரயில்', english: 'Fast Train' },
        { native: 'புதிய ரயில்', english: 'New Train' },
      ]
    },
    { 
      emoji: '💵', 
      variants: [
        { native: 'பணம்', english: 'Money' },
        { native: 'புதிய பணம்', english: 'New Money' },
        { native: 'இந்திய பணம்', english: 'Indian Money' },
      ]
    },
    { 
      emoji: '⏰', 
      variants: [
        { native: 'கடிகாரம்', english: 'Clock' },
        { native: 'வட்ட கடிகாரம்', english: 'Round Clock' },
        { native: 'அழகான கடிகாரம்', english: 'Beautiful Clock' },
        { native: 'மணி கடிகாரம்', english: 'Wall Clock' },
      ]
    },
    { 
      emoji: '🚲', 
      variants: [
        { native: 'சைக்கிள்', english: 'Bicycle' },
        { native: 'சிறிய சைக்கிள்', english: 'Small Bicycle' },
        { native: 'புதிய சைக்கிள்', english: 'New Bicycle' },
        { native: 'வேகமான சைக்கிள்', english: 'Fast Bicycle' },
      ]
    },
    { 
      emoji: '✈️', 
      variants: [
        { native: 'விமானம்', english: 'Airplane' },
        { native: 'வேகமான விமானம்', english: 'Fast Airplane' },
        { native: 'உயரமான விமானம்', english: 'High Airplane' },
        { native: 'வெள்ளை விமானம்', english: 'White Airplane' },
      ]
    },
    { 
      emoji: '⚽', 
      variants: [
        { native: 'பந்து', english: 'Ball' },
        { native: 'வட்ட பந்து', english: 'Round Ball' },
        { native: 'வெள்ளை பந்து', english: 'White Ball' },
        { native: 'விளையாட்டு பந்து', english: 'Sports Ball' },
        { native: 'சிறிய பந்து', english: 'Small Ball' },
      ]
    },
    { 
      emoji: '⭐', 
      variants: [
        { native: 'நட்சத்திரம்', english: 'Star' },
        { native: 'பிரகாசமான நட்சத்திரம்', english: 'Bright Star' },
        { native: 'மஞ்சள் நட்சத்திரம்', english: 'Yellow Star' },
        { native: 'சின்ன நட்சத்திரம்', english: 'Small Star' },
      ]
    },
    { 
      emoji: '🌧️', 
      variants: [
        { native: 'மழை', english: 'Rain' },
        { native: 'குளிர்ந்த மழை', english: 'Cool Rain' },
        { native: 'சாரல் மழை', english: 'Soft Rain' },
        { native: 'கன மழை', english: 'Heavy Rain' },
        { native: 'மழை நீர்', english: 'Rain Water' },
      ]
    },
    { 
      emoji: '🌊', 
      variants: [
        { native: 'கடல்', english: 'Sea' },
        { native: 'நீல கடல்', english: 'Blue Sea' },
        { native: 'பெரிய கடல்', english: 'Big Sea' },
        { native: 'அலை கடல்', english: 'Wavy Sea' },
      ]
    },
    { 
      emoji: '⛰️', 
      variants: [
        { native: 'மலை', english: 'Mountain' },
        { native: 'உயரமான மலை', english: 'Tall Mountain' },
        { native: 'பெரிய மலை', english: 'Big Mountain' },
        { native: 'பச்சை மலை', english: 'Green Mountain' },
      ]
    },
    { 
      emoji: '🍼', 
      variants: [
        { native: 'பாட்டில்', english: 'Bottle' },
        { native: 'சிறிய பாட்டில்', english: 'Small Bottle' },
        { native: 'பால் பாட்டில்', english: 'Milk Bottle' },
      ]
    },
    { 
      emoji: '🪑', 
      variants: [
        { native: 'நாற்காலி', english: 'Chair' },
        { native: 'மர நாற்காலி', english: 'Wooden Chair' },
        { native: 'அழகான நாற்காலி', english: 'Beautiful Chair' },
        { native: 'சின்ன நாற்காலி', english: 'Small Chair' },
      ]
    },
    { 
      emoji: '🪵', 
      variants: [
        { native: 'மேஜை', english: 'Table' },
        { native: 'மர மேஜை', english: 'Wooden Table' },
        { native: 'பெரிய மேஜை', english: 'Big Table' },
        { native: 'வட்ட மேஜை', english: 'Round Table' },
      ]
    },
  ]
};

function getUniqueItemForGlobalIdx(globalIdx) {
  const items = VOCAB_ITEMS.tamil;
  const item = items[globalIdx % items.length];
  const phase = Math.floor(globalIdx / items.length);

  const variant = item.variants[phase % item.variants.length];
  return { native: variant.native, english: variant.english, emoji: item.emoji };
}

function getPictureQuestions(levelNum) {
  const questions = [];
  for (let qIdx = 0; qIdx < 5; qIdx++) {
    const globalIdx = (levelNum - 1) * 5 + qIdx;
    const targetItem = getUniqueItemForGlobalIdx(globalIdx);

    const d1 = getUniqueItemForGlobalIdx((globalIdx + 7) % 5000).native;
    const d2 = getUniqueItemForGlobalIdx((globalIdx + 19) % 5000).native;
    const d3 = getUniqueItemForGlobalIdx((globalIdx + 31) % 5000).native;

    const wrongs = Array.from(new Set([d1, d2, d3])).filter(x => x !== targetItem.native);
    const options = [targetItem.native, ...wrongs.slice(0, 3)];
    const correctIndex = (globalIdx + qIdx) % 4;
    [options[0], options[correctIndex]] = [options[correctIndex], options[0]];

    questions.push({ emoji: targetItem.emoji, word: targetItem.native, options });
  }
  return questions;
}

console.log('=== LEVEL 31 Soccer Ball (⚽) ===');
const q31 = getPictureQuestions(31);
q31.forEach((q, i) => console.log(`Q${i+1} (${q.emoji}): Options -> ${q.options.join(' | ')}`));
