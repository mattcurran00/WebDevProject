/*Use this file for modelling users that will 
have information inserted into the database. 
*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] // songs they added
});

module.exports = mongoose.model('User', userSchema);