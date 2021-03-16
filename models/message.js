const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema, 'messages');