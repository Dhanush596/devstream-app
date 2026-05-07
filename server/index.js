const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allows frontend to communicate with backend

// MongoDB Connection
const mongoURI = 'mongodb://mongodb:27017/devstream';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// Registration Route
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "Engineer Registered Successfully!" });
  } catch (error) {
    res.status(400).send({ message: "Registration Failed! Email might already exist." });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.send({ message: "Access Granted!", name: user.name });
    } else {
      res.status(401).send({ message: "Invalid Credentials!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

app.listen(5000, () => console.log('🚀 API Server running on port 5000'));