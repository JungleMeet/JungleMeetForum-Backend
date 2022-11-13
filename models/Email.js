const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter your email'],
    },
    code: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

EmailSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('Email', EmailSchema);
