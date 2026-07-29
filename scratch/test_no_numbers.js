const VOCAB_ITEMS = {
  tamil: [
    { native: 'நாய்', english: 'Dog', emoji: '🐶', adjs: [{ native: 'நல்ல', english: 'Good' }, { native: 'வேகமான', english: 'Fast' }, { native: 'சிறிய', english: 'Small' }] },
    { native: 'பூனை', english: 'Cat', emoji: '🐱', adjs: [{ native: 'அழகான', english: 'Beautiful' }, { native: 'சிறிய', english: 'Small' }, { native: 'வெள்ளை', english: 'White' }] },
    { native: 'யானை', english: 'Elephant', emoji: '🐘', adjs: [{ native: 'பெரிய', english: 'Big' }, { native: 'கருப்பு', english: 'Black' }, { native: 'உயரமான', english: 'Tall' }] },
    { native: 'பசு', english: 'Cow', emoji: '🐮', adjs: [{ native: 'நல்ல', english: 'Gentle' }, { native: 'வெள்ளை', english: 'White' }] },
    { native: 'விமானம்', english: 'Airplane', emoji: '✈️', adjs: [{ native: 'வேகமான', english: 'Fast' }, { native: 'உயரமான', english: 'High' }] },
    { native: 'நாற்காலி', english: 'Chair', emoji: '🪑', adjs: [{ native: 'மர', english: 'Wooden' }, { native: 'அழகான', english: 'Beautiful' }] },
  ]
};

function getUniqueItemForGlobalIdx(globalIdx) {
  const items = VOCAB_ITEMS.tamil;
  const item = items[globalIdx % items.length];
  const phase = Math.floor(globalIdx / items.length);

  if (phase === 0) {
    return { native: item.native, english: item.english, emoji: item.emoji };
  } else {
    const adj = item.adjs[(phase - 1) % item.adjs.length];
    
    const actions = [
      { native: '', english: '' },
      { native: 'ஓடும் ', english: 'Running ' },
      { native: 'பறக்கும் ', english: 'Flying ' },
      { native: 'நீந்தும் ', english: 'Swimming ' },
      { native: 'நிற்கும் ', english: 'Standing ' },
    ];
    const actionIdx = Math.floor((phase - 1) / item.adjs.length) % actions.length;
    const action = actions[actionIdx];

    const nativeText = `${action.native}${adj.native} ${item.native}`.trim();
    const englishText = `${action.english}${adj.english} ${item.english}`.trim();

    return { native: nativeText, english: englishText, emoji: item.emoji };
  }
}

console.log('--- Testing High Level Items (No numbers) ---');
for (let idx = 0; idx < 40; idx++) {
  console.log(getUniqueItemForGlobalIdx(idx * 6));
}
