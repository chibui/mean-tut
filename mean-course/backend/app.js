const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Header',
    'Accept, Origin, Content-Type, X-Requested-With'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'DELETE, GET, OPTIONS, PATCH, POST'
  );

  next();
});

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
