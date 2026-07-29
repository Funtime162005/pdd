const VOCAB_BANKS = {
  tamil: [
    { native: 'நாய்', english: 'Dog', emoji: '🐶', adjs: [{ native: 'நல்ல', english: 'Good' }, { native: 'வேகமான', english: 'Fast' }, { native: 'சிறிய', english: 'Small' }] },
    { native: 'பூனை', english: 'Cat', emoji: '🐱', adjs: [{ native: 'அழகான', english: 'Beautiful' }, { native: 'சிறிய', english: 'Small' }, { native: 'வெள்ளை', english: 'White' }] },
    { native: 'யானை', english: 'Elephant', emoji: '🐘', adjs: [{ native: 'பெரிய', english: 'Big' }, { native: 'கருப்பு', english: 'Black' }, { native: 'உயரமான', english: 'Tall' }] },
    { native: 'சிங்கம்', english: 'Lion', emoji: '🦁', adjs: [{ native: 'கோபமான', english: 'Fierce' }, { native: 'பெரிய', english: 'Big' }, { native: 'பயங்கரமான', english: 'Strong' }] },
    { native: 'பறவை', english: 'Bird', emoji: '🐦', adjs: [{ native: 'அழகான', english: 'Beautiful' }, { native: 'சிறிய', english: 'Small' }, { native: 'பறக்கும்', english: 'Flying' }] },
    { native: 'மீன்', english: 'Fish', emoji: '🐟', adjs: [{ native: 'நீந்தும்', english: 'Swimming' }, { native: 'சிறிய', english: 'Small' }, { native: 'வண்ணமயமான', english: 'Colorful' }] },
    { native: 'குதிரை', english: 'Horse', emoji: '🐴', adjs: [{ native: 'வேகமான', english: 'Fast' }, { native: 'உயரமான', english: 'Tall' }, { native: 'பலமான', english: 'Strong' }] },
    { native: 'கரடி', english: 'Bear', emoji: '🐻', adjs: [{ native: 'பெரிய', english: 'Big' }, { native: 'கருப்பு', english: 'Black' }, { native: 'காட்டு', english: 'Wild' }] },
    { native: 'முயல்', english: 'Rabbit', emoji: '🐰', adjs: [{ native: 'வேகமான', english: 'Fast' }, { native: 'வெள்ளை', english: 'White' }, { native: 'சிறிய', english: 'Cute' }] },
    { native: 'குரங்கு', english: 'Monkey', emoji: '🐒', adjs: [{ native: 'துறுதுறுப்பான', english: 'Active' }, { native: 'சிறிய', english: 'Small' }] },
    { native: 'பசு', english: 'Cow', emoji: '🐮', adjs: [{ native: 'நல்ல', english: 'Gentle' }, { native: 'வெள்ளை', english: 'White' }] },
    { native: 'ஆடு', english: 'Goat', emoji: '🐐', adjs: [{ native: 'சிறிய', english: 'Small' }] },
    { native: 'மான்', english: 'Deer', emoji: '🦌', adjs: [{ native: 'அழகான', english: 'Beautiful' }, { native: 'வேகமான', english: 'Fast' }] },
    { native: 'புலி', english: 'Tiger', emoji: '🐅', adjs: [{ native: 'வேகமான', english: 'Fast' }, { native: 'பயங்கரமான', english: 'Fierce' }] },
    { native: 'வாத்து', english: 'Duck', emoji: '🦆', adjs: [{ native: 'வெள்ளை', english: 'White' }, { native: 'நீந்தும்', english: 'Swimming' }] },
    { native: 'புத்தகம்', english: 'Book', emoji: '📚', adjs: [{ native: 'நல்ல', english: 'Good' }, { native: 'புதிய', english: 'New' }] },
    { native: 'வீடு', english: 'House', emoji: '🏠', adjs: [{ native: 'அழகான', english: 'Beautiful' }, { native: 'பெரிய', english: 'Big' }] },
    { native: 'பள்ளி', english: 'School', emoji: '🏫', adjs: [{ native: 'பெரிய', english: 'Big' }, { native: 'நல்ல', english: 'Good' }] },
    { native: 'கார்', english: 'Car', emoji: '🚗', adjs: [{ native: 'வேகமான', english: 'Fast' }, { native: 'சிவப்பு', english: 'Red' }, { native: 'புதிய', english: 'New' }] },
    { native: 'மரம்', english: 'Tree', emoji: '🌳', adjs: [{ native: 'பச்சை', english: 'Green' }, { native: 'உயரமான', english: 'Tall' }, { native: 'பெரிய', english: 'Big' }] },
    { native: 'பூ', english: 'Flower', emoji: '🌺', adjs: [{ native: 'அழகான', english: 'Beautiful' }, { native: 'சிவப்பு', english: 'Red' }, { native: 'மஞ்சள்', english: 'Yellow' }] },
    { native: 'சூரியன்', english: 'Sun', emoji: '☀️', adjs: [{ native: 'பிரகாசமான', english: 'Bright' }, { native: 'சூடான', english: 'Hot' }, { native: 'மஞ்சள்', english: 'Yellow' }] },
    { native: 'சந்திரன்', english: 'Moon', emoji: '🌙', adjs: [{ native: 'பிரகாசமான', english: 'Bright' }, { native: 'வெள்ளை', english: 'White' }, { native: 'அழகான', english: 'Beautiful' }] },
    { native: 'பேனா', english: 'Pen', emoji: '🖊️', adjs: [{ native: 'நீல', english: 'Blue' }, { native: 'புதிய', english: 'New' }] },
    { native: 'ஆப்பிள்', english: 'Apple', emoji: '🍎', adjs: [{ native: 'சிவப்பு', english: 'Red' }, { native: 'இனிப்பான', english: 'Sweet' }, { native: 'சுவையான', english: 'Tasty' }] },
    { native: 'வாழைப்பழம்', english: 'Banana', emoji: '🍌', adjs: [{ native: 'மஞ்சள்', english: 'Yellow' }, { native: 'இனிப்பான', english: 'Sweet' }, { native: 'சுவையான', english: 'Tasty' }] },
    { native: 'தண்ணீர்', english: 'Water', emoji: '💧', adjs: [{ native: 'குளிர்ந்த', english: 'Cool' }, { native: 'சுத்தமான', english: 'Clean' }] },
    { native: 'ரயில்', english: 'Train', emoji: '🚆', adjs: [{ native: 'நீளமான', english: 'Long' }, { native: 'வேகமான', english: 'Fast' }] },
    { native: 'பணம்', english: 'Money', emoji: '💵', adjs: [{ native: 'புதிய', english: 'New' }] },
    { native: 'கடிகாரம்', english: 'Clock', emoji: '⏰', adjs: [{ native: 'வட்ட', english: 'Round' }, { native: 'அழகான', english: 'Beautiful' }] },
    { native: 'சைக்கிள்', english: 'Bicycle', emoji: '🚲', adjs: [{ native: 'சிறிய', english: 'Small' }, { native: 'புதிய', english: 'New' }] },
    { native: 'விமானம்', english: 'Airplane', emoji: '✈️', adjs: [{ native: 'வேகமான', english: 'Fast' }, { native: 'உயரமான', english: 'High' }] },
    { native: 'பந்து', english: 'Ball', emoji: '⚽', adjs: [{ native: 'வட்ட', english: 'Round' }, { native: 'வெள்ளை', english: 'White' }] },
    { native: 'நட்சத்திரம்', english: 'Star', emoji: '⭐', adjs: [{ native: 'பிரகாசமான', english: 'Bright' }, { native: 'மஞ்சள்', english: 'Yellow' }] },
    { native: 'மழை', english: 'Rain', emoji: '🌧️', adjs: [{ native: 'குளிர்ந்த', english: 'Cool' }, { native: 'சாரல்', english: 'Soft' }, { native: 'கன', english: 'Heavy' }] },
    { native: 'கடல்', english: 'Sea', emoji: '🌊', adjs: [{ native: 'நீல', english: 'Blue' }, { native: 'பெரிய', english: 'Big' }] },
    { native: 'மலை', english: 'Mountain', emoji: '⛰️', adjs: [{ native: 'உயரமான', english: 'Tall' }, { native: 'பெரிய', english: 'Big' }] },
    { native: 'பாட்டில்', english: 'Bottle', emoji: '🍼', adjs: [{ native: 'சிறிய', english: 'Small' }] },
    { native: 'நாற்காலி', english: 'Chair', emoji: '🪑', adjs: [{ native: 'மர', english: 'Wooden' }, { native: 'அழகான', english: 'Beautiful' }] },
    { native: 'மேஜை', english: 'Table', emoji: '🪵', adjs: [{ native: 'மர', english: 'Wooden' }, { native: 'பெரிய', english: 'Big' }] },
  ]
};

function getUniqueItemForGlobalIdx(globalIdx) {
  const items = VOCAB_BANKS.tamil;
  const item = items[globalIdx % items.length];
  const phase = Math.floor(globalIdx / items.length);

  if (phase === 0) {
    return { native: item.native, english: item.english, emoji: item.emoji };
  } else {
    const adj = item.adjs[(phase - 1) % item.adjs.length];
    const numPrefix = phase > item.adjs.length ? `${phase - item.adjs.length + 1} ` : '';
    return { 
      native: `${numPrefix}${adj.native} ${item.native}`, 
      english: `${numPrefix}${adj.english} ${item.english}`, 
      emoji: item.emoji 
    };
  }
}

console.log('--- Testing Rain (🌧️) at level 31 ---');
console.log(getUniqueItemForGlobalIdx(34)); // Phase 0 -> Rain
console.log(getUniqueItemForGlobalIdx(74)); // Phase 1 -> Cool Rain
console.log(getUniqueItemForGlobalIdx(114)); // Phase 2 -> Soft Rain
console.log(getUniqueItemForGlobalIdx(154)); // Phase 3 -> Heavy Rain

console.log('\n--- Testing Sun (☀️) ---');
console.log(getUniqueItemForGlobalIdx(21));
console.log(getUniqueItemForGlobalIdx(61));
console.log(getUniqueItemForGlobalIdx(101));
