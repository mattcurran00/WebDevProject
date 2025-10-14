// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI);

// Simple CRUD for users
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // validate inputs (very basic)
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });

    // hash password (use bcrypt)
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, passwordHash });
    await user.save();
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));