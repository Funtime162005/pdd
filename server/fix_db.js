const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function fixDB() {
  if (!process.env.MONGO_URI) {
    console.error("No MONGO_URI");
    process.exit(1);
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.model('User', new mongoose.Schema({
    email: String,
    learningLanguage: String
  }, { strict: false }));
  
  const users = await User.find({});
  let fixedCount = 0;
  
  for (const u of users) {
    if (!u.learningLanguage || u.learningLanguage === 'hindi') {
      u.learningLanguage = 'tamil';
      await u.save();
      fixedCount++;
    }
  }
  
  console.log(`Fixed ${fixedCount} old users!`);
  process.exit(0);
}

fixDB();
