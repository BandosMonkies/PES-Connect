const express = require('express');
const router = express.Router();

const User = require('../models/User.cjs');

router.post('/register', async (req, res) => {
  // Basic registration logic, no hashed passwords for demo!
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  // Basic login, no authentication for demo!
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
