const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      content: 'This is coming from the server',
      id: 'POST001',
      title: 'First server-side post'
    },
    {
      content: 'This is coming from the server',
      id: 'POST002',
      title: 'Second server-side post'
    }
  ];

  res.status(200).json({
    message: 'Post fetch successfully',
    posts: posts
  });
});

module.exports = app;
