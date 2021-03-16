const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    userId: { type: String, required: true },
    publicCode: { type: String, required: false},
    firstName: { type: String, required: false},
    lastName: { type: String, required: false },
    email: { type: String, required: false},
    phone: { type: String, required: false },
    company: { type: String, required: false},
    city: { type: String, required: false },
    country: { type: String, required: false},
    address: { type: String, required: false },
    postalCode: { type: String, required: false},
    description: { type: String, required: false},
    sharedDocumentsIds: { type: [String],  default: []},
    pendingDocumentsIds: { type: [String],  default: []},
    rejectedDocumentsIds: { type: [String],  default: []},
    requestedDocumentsIds: { type: [String],  default: []},
    createdAt: {type: Date, default: Date.now}
});

ProfileSchema.index({ userId: 1}, { unique: true});
module.exports = mongoose.model('Profile', ProfileSchema, 'profiles');
