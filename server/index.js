const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); // Read from the parent project's .env

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
if (!MONGO_URI) {
  console.warn("⚠️ MONGO_URI is not defined in .env. The server will not run properly.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  avatar: { type: String, default: "tiger" },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 1 },
  lastLoginDate: { type: Date, default: Date.now },
  level: { type: String, default: "Beginner - Level 1" },
  levelProgress: { type: Number, default: 0 },
  learningLanguage: { type: String, default: "tamil" }
});

const User = mongoose.model('User', userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, default: "tiger" },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// API: Login or Create User
app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if not found
      user = new User({
        email,
        name: email.split('@')[0],
      });
      await user.save();
    } else {
      // Calculate streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastLogin = new Date(user.lastLoginDate);
      lastLogin.setHours(0, 0, 0, 0);
      
      const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
      
      user.lastLoginDate = new Date();
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Update Assessment Level
app.post('/api/update-level', async (req, res) => {
  try {
    const { email, levelTier, score } = req.body;
    const baseXP = score * 10;
    
    const user = await User.findOneAndUpdate(
      { email },
      { 
        level: `${levelTier} - Level 1`, 
        xp: baseXP,
        levelProgress: 0 
      },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Update Profile
app.post('/api/update-profile', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { name, avatar },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Update Learning Language
app.post('/api/update-language', async (req, res) => {
  try {
    const { email, learningLanguage } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { learningLanguage },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Update Progress (XP)
app.post('/api/update-progress', async (req, res) => {
  try {
    const { email, xpGained } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const newXp = user.xp + xpGained;
    const currentTotalLevel = Math.floor(user.xp / 100);
    const newTotalLevel = Math.floor(newXp / 100);
    
    let [tier, currentSubLevelStr] = user.level.split(' - Level ');
    let currentSubLevel = parseInt(currentSubLevelStr) || 1;
    
    if (newTotalLevel > currentTotalLevel) {
        const levelsGained = newTotalLevel - currentTotalLevel;
        currentSubLevel += levelsGained;
        
        // Graduation Logic
        if (tier === 'Beginner' && currentSubLevel > 10) {
            tier = 'Intermediate';
            currentSubLevel = currentSubLevel - 10;
        }
        if (tier === 'Intermediate' && currentSubLevel > 15) {
            tier = 'Pro';
            currentSubLevel = currentSubLevel - 15;
        }
        if (tier === 'Pro' && currentSubLevel > 100) {
            currentSubLevel = 100; // Cap at 100
        }
    }

    user.xp = newXp;
    user.level = `${tier} - Level ${currentSubLevel}`;
    user.levelProgress = newXp % 100;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get Global Community Stats
app.get('/api/community', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Calculate total XP across the platform
    const result = await User.aggregate([
      { $group: { _id: null, totalXP: { $sum: "$xp" } } }
    ]);
    const totalXP = result.length > 0 ? result[0].totalXP : 0;
    
    res.json({ totalUsers, totalXP });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get Messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Post Message
app.post('/api/messages', async (req, res) => {
  try {
    const { text, authorName, authorAvatar } = req.body;
    if (!text || !authorName) return res.status(400).json({ error: "Missing fields" });
    
    const newMessage = new Message({ text, authorName, authorAvatar });
    await newMessage.save();
    
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find({}, 'name avatar xp level').sort({ xp: -1 }).limit(50);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
