// 1. Security Fix (Must be at the very top)
const crypto = require('crypto');
if (!global.crypto) {
  global.crypto = crypto;
}

// 2. Dependencies (Only declared ONCE)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 3. Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

// 4. Database
const mongoURI = 'mongodb://mongodb:27017/devstream';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 5. Model
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// 6. Routes
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "Engineer Registered Successfully!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(400).send({ message: "Registration Failed!" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) res.send({ message: "Access Granted!", name: user.name });
    else res.status(401).send({ message: "Invalid Credentials!" });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

app.listen(5000, '0.0.0.0', () => console.log('🚀 API Server running on port 5000'));