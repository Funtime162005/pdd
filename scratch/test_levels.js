// Test 100% Zero-Duplicate Question Generator across 1000 levels (5000 questions)

const TAMIL_VOCAB = [
  { native: 'நாய்', english: 'Dog', emoji: '🐶' },
  { native: 'பூனை', english: 'Cat', emoji: '🐱' },
  { native: 'யானை', english: 'Elephant', emoji: '🐘' },
  { native: 'சிங்கம்', english: 'Lion', emoji: '🦁' },
  { native: 'பறவை', english: 'Bird', emoji: '🐦' },
  { native: 'மீன்', english: 'Fish', emoji: '🐟' },
  { native: 'குதிரை', english: 'Horse', emoji: '🐴' },
  { native: 'கரடி', english: 'Bear', emoji: '🐻' },
  { native: 'முயல்', english: 'Rabbit', emoji: '🐰' },
  { native: 'குரங்கு', english: 'Monkey', emoji: '🐒' },
  { native: 'பசு', english: 'Cow', emoji: '🐮' },
  { native: 'ஆடு', english: 'Goat', emoji: '🐐' },
  { native: 'மான்', english: 'Deer', emoji: '🦌' },
  { native: 'புலி', english: 'Tiger', emoji: '🐅' },
  { native: 'வாத்து', english: 'Duck', emoji: '🦆' },
  { native: 'புத்தகம்', english: 'Book', emoji: '📚' },
  { native: 'வீடு', english: 'House', emoji: '🏠' },
  { native: 'பள்ளி', english: 'School', emoji: '🏫' },
  { native: 'கார்', english: 'Car', emoji: '🚗' },
  { native: 'மரம்', english: 'Tree', emoji: '🌳' },
  { native: 'பூ', english: 'Flower', emoji: '🌺' },
  { native: 'சூரியன்', english: 'Sun', emoji: '☀️' },
  { native: 'சந்திரன்', english: 'Moon', emoji: '🌙' },
  { native: 'பேனா', english: 'Pen', emoji: '🖊️' },
  { native: 'ஆப்பிள்', english: 'Apple', emoji: '🍎' },
  { native: 'வாழைப்பழம்', english: 'Banana', emoji: '🍌' },
  { native: 'தண்ணீர்', english: 'Water', emoji: '💧' },
  { native: 'ரயில்', english: 'Train', emoji: '🚆' },
  { native: 'பணம்', english: 'Money', emoji: '💵' },
  { native: 'கடிகாரம்', english: 'Clock', emoji: '⏰' },
  { native: 'சைக்கிள்', english: 'Bicycle', emoji: '🚲' },
  { native: 'விமானம்', english: 'Airplane', emoji: '✈️' },
  { native: 'பந்து', english: 'Ball', emoji: '⚽' },
  { native: 'நட்சத்திரம்', english: 'Star', emoji: '⭐' },
  { native: 'மழை', english: 'Rain', emoji: '🌧️' },
  { native: 'கடல்', english: 'Sea', emoji: '🌊' },
  { native: 'மலை', english: 'Mountain', emoji: '⛰️' },
  { native: 'பாட்டில்', english: 'Bottle', emoji: '🍼' },
  { native: 'நாற்காலி', english: 'Chair', emoji: '🪑' },
  { native: 'மேஜை', english: 'Table', emoji: '🪵' },
];

const TAMIL_ADJECTIVES = [
  { native: 'பெரிய', english: 'Big' },
  { native: 'சிறிய', english: 'Small' },
  { native: 'புதிய', english: 'New' },
  { native: 'பழைய', english: 'Old' },
  { native: 'அழகான', english: 'Beautiful' },
  { native: 'நல்ல', english: 'Good' },
  { native: 'வேகமான', english: 'Fast' },
  { native: 'இனிமையான', english: 'Sweet' },
  { native: 'சிவப்பு', english: 'Red' },
  { native: 'நீல', english: 'Blue' },
  { native: 'பச்சை', english: 'Green' },
  { native: 'மஞ்சள்', english: 'Yellow' },
  { native: 'வெள்ளை', english: 'White' },
  { native: 'கருப்பு', english: 'Black' },
  { native: 'சுவையான', english: 'Tasty' },
  { native: 'உயரமான', english: 'Tall' },
  { native: 'சூடான', english: 'Hot' },
  { native: 'குளிர்ந்த', english: 'Cold' },
];

const TAMIL_QUALIFIERS = [
  { native: 'ஓடும்', english: 'running' },
  { native: 'நிற்கும்', english: 'standing' },
  { native: 'பறக்கும்', english: 'flying' },
  { native: 'நீந்தும்', english: 'swimming' },
  { native: 'தூங்கும்', english: 'sleeping' },
  { native: 'வீட்டில் உள்ள', english: 'in house' },
  { native: 'பள்ளியில் உள்ள', english: 'at school' },
  { native: 'பூங்காவில் உள்ள', english: 'in park' },
  { native: 'காட்டில் உள்ள', english: 'in forest' },
  { native: 'சாலையில் செல்லும்', english: 'on road' },
];

function getItemForGlobalIndex(globalIdx) {
  const vLen = TAMIL_VOCAB.length;
  const aLen = TAMIL_ADJECTIVES.length;

  const vIdx = globalIdx % vLen;
  const aIdx = Math.floor(globalIdx / vLen) % aLen;

  const item = TAMIL_VOCAB[vIdx];
  const adj = TAMIL_ADJECTIVES[aIdx];

  if (globalIdx < 40) {
    return { native: item.native, english: item.english, emoji: item.emoji };
  } else if (globalIdx < 720) { // 40 * 18 = 720 unique combinations
    return { native: `${adj.native} ${item.native}`, english: `${adj.english} ${item.english}`, emoji: item.emoji };
  } else {
    // Incorporate exact unique number (e.g. 1..5000)
    const num = globalIdx - 719;
    return { native: `${num} ${adj.native} ${item.native}`, english: `${num} ${adj.english} ${item.english}s`, emoji: item.emoji };
  }
}

// Test Level 23 vs Level 24
console.log('--- LEVEL 23 ---');
for (let i = 0; i < 5; i++) {
  console.log(getItemForGlobalIndex((23 - 1) * 5 + i));
}

console.log('\n--- LEVEL 24 ---');
for (let i = 0; i < 5; i++) {
  console.log(getItemForGlobalIndex((24 - 1) * 5 + i));
}

// Test total uniqueness across 1000 levels (5000 questions)
const seen = new Set();
let duplicates = 0;
for (let lvl = 1; lvl <= 1000; lvl++) {
  for (let q = 0; q < 5; q++) {
    const gIdx = (lvl - 1) * 5 + q;
    const res = getItemForGlobalIndex(gIdx);
    if (seen.has(res.native)) {
      duplicates++;
    }
    seen.add(res.native);
  }
}
console.log(`\nTotal questions generated for 1000 levels: 5000`);
console.log(`Unique questions: ${seen.size}`);
console.log(`Duplicates: ${duplicates}`);
