const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: String, required: false },
  // TODO: here you can add extra fields as needed to customize the model
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema, 'messages');
