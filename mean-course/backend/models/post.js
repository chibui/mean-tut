const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  content: {
    required: true,
    type: String
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
