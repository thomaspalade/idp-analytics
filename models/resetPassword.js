const mongoose = require('mongoose');

const ResetPasswordSchema = mongoose.Schema({
  email: { type: String, required: true },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResetPassword', ResetPasswordSchema, 'passwordresets');
