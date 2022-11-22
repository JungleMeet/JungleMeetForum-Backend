const mongoose = require('mongoose');

const HashtagSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true,
      match: [/^[a-zA-Z]+$/, 'Please fill in with alphabetic characters only'],
    },
  },
  { timestamps: true }
);

HashtagSchema.index({ category: 'text' });

module.exports = mongoose.model('Hashtag', HashtagSchema);
