const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  content: {
    required: true,
    type: String
  },
  creator: {
    ref: 'User',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  imagePath: {
    required: true,
    type: String
  },
  title: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model('Post', postSchema);
