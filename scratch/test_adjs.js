const fs = require('fs');

const VOCAB_BANKS = {
  tamil: {
    items: [
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
    ],
    adjectives: [
      { native: 'பெரிய', english: 'Big' },
      { native: 'சிறிய', english: 'Small' },
      { native: 'புதிய', english: 'New' },
      { native: 'அழகான', english: 'Beautiful' },
      { native: 'நல்ல', english: 'Good' },
      { native: 'வேகமான', english: 'Fast' },
      { native: 'இனிமையான', english: 'Sweet' },
      { native: 'சிவப்பு', english: 'Red' },
      { native: 'நீல', english: 'Blue' },
      { native: 'பச்சை', english: 'Green' },
      { native: 'மஞ்சள்', english: 'Yellow' },
      { native: 'வெள்ளை', english: 'White' },
      { native: 'பிரகாசமான', english: 'Bright' },
      { native: 'சுவையான', english: 'Tasty' },
      { native: 'வண்ணமயமான', english: 'Colorful' },
    ]
  }
};

function getUniqueItemForGlobalIdx(globalIdx, lang = 'tamil') {
  const bank = VOCAB_BANKS[lang];
  const items = bank.items;
  const adjs = bank.adjectives;

  const vLen = items.length;
  const aLen = adjs.length;

  const vIdx = globalIdx % vLen;
  const item = items[vIdx];

  if (globalIdx < vLen) {
    return { native: item.native, english: item.english, emoji: item.emoji };
  } else {
    const aIdx = (globalIdx + Math.floor(globalIdx / 3)) % aLen;
    const adj = adjs[aIdx];
    return { native: `${adj.native} ${item.native}`, english: `${adj.english} ${item.english}`, emoji: item.emoji };
  }
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

console.log('=== LEVEL 31 (Your Screenshot Level) ===');
getPictureQuestions(31).forEach((q, i) => console.log(`Q${i+1}: ${q.word} (${q.emoji}) | Options: ${q.options.join(', ')}`));

console.log('\n=== LEVEL 32 ===');
getPictureQuestions(32).forEach((q, i) => console.log(`Q${i+1}: ${q.word} (${q.emoji}) | Options: ${q.options.join(', ')}`));
