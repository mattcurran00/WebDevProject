const mongoose = require('mongoose');
const connectDB = require('../server/config/db');
const User = require('../server/models/User');
const Song = require('../server/models/Song');

connectDB();

const seed = async () => {
  try {
    // Clear old data
    await User.deleteMany();
    await Song.deleteMany();

    // Create sample songs
    const songs = await Song.insertMany([
      {
        title: "Twinkle Twinkle Little Star",
        artist: "Traditional",
        instrument: "piano",
        tabs: "C C G G A A G ...",
        difficulty: "easy"
      },
      {
        title: "Smoke on the Water",
        artist: "Deep Purple",
        instrument: "guitar",
        tabs: "G5 G5 Bb5 G5 C5 ...",
        difficulty: "medium"
      }
    ]);

    // Create sample users
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "hashed_password_here",
      savedSongs: [songs[0]._id]
    });

    console.log("Database seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();