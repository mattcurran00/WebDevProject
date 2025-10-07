//ts file can be the model for the song
//we can do different files or models if u wanna 
//draw the difference between piano or guitar or whatever
//idrk whats going on

const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: String,
  instrument: { type: String, enum: ['guitar', 'piano'], required: true },
  tabs: String,             // text representation of the song tabs
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

module.exports = mongoose.model('Song', songSchema);
