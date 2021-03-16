const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: false },
  description: { type: String, required: false },
  county: { type: String, required: false },
  city: { type: String, required: false },
  institution: { type: String, required: false },
  documentType: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Request', RequestSchema, 'requests');
