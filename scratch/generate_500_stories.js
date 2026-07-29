const fs = require('fs');

const CATEGORIES = [
  'Panchatantra & Animals',
  'Festivals & Traditions',
  'Kings & Wise Scholars',
  'Village & Heritage',
  'Wisdom & Moral Fables',
  'Mythological Legends',
  'Arts & Craft Tales'
];

const ANIMAL_SUBJECTS = [
  { native: 'மான்கள்', eng: 'Deer', emoji: '🦌' },
  { native: 'சிங்கம்', eng: 'Lion', emoji: '🦁' },
  { native: 'யானை', eng: 'Elephant', emoji: '🐘' },
  { native: 'குரங்கு', eng: 'Monkey', emoji: '🐒' },
  { native: 'மயில்', eng: 'Peacock', emoji: '🦚' },
  { native: 'ஆமை', eng: 'Turtle', emoji: '🐢' },
  { native: 'காகம்', eng: 'Crow', emoji: '🐦' },
  { native: 'பூனை', eng: 'Cat', emoji: '🐱' },
  { native: 'நாய்', eng: 'Dog', emoji: '🐶' },
  { native: 'கிளி', eng: 'Parrot', emoji: '🦜' },
];

const ADJECTIVES = [
  { native: 'அறிவுள்ள', eng: 'Wise' },
  { native: 'அழகான', eng: 'Beautiful' },
  { native: 'வேகமான', eng: 'Fast' },
  { native: 'நல்ல', eng: 'Good' },
  { native: 'உண்மையான', eng: 'Honest' },
  { native: 'தங்க', eng: 'Golden' },
  { native: 'மகிழ்ச்சியான', eng: 'Happy' },
  { native: 'தைரியமான', eng: 'Brave' },
  { native: 'இரக்கமுள்ள', eng: 'Kind' },
  { native: 'புத்திசாலித்தனமான', eng: 'Clever' },
];

const PLACES = [
  { native: 'பச்சை காட்டில்', eng: 'in the green forest' },
  { native: 'காவேரி நதிக்கரையில்', eng: 'by the Kaveri river' },
  { native: 'அழகிய கிராமத்தில்', eng: 'in a beautiful village' },
  { native: 'அரண்மனையில்', eng: 'in the royal palace' },
  { native: 'தஞ்சாவூர் ஊரில்', eng: 'in Tanjore town' },
  { native: 'மலை கிராமத்தில்', eng: 'in a hill village' },
  { native: 'பழைய வீட்டின் அருகில்', eng: 'near an old house' },
  { native: 'பெரிய ஆலமரத்தின் அடியில்', eng: 'under a huge banyan tree' },
];

console.log('Generating 500 Stories dataset generator logic...');
