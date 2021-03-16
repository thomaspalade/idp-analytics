const mongoose = require('mongoose');

const DocumentSchema = mongoose.Schema({
  userId: { type: String, required: true },
  heading: { type: String, required: false },
  description: { type: String, required: false },
  extension: { type: String, required: false },
  tags: { type: [String], required: false },
  sharedWith: { type: [String], required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema, 'documents');
