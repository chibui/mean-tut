const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DB_CONNECT = require('./constants');

const Post = require('./models/post');

const app = express();

mongoose.connect(DB_CONNECT)
  .then(() => {
    console.log('Connected to database',);
  })
  .catch((error) => {
    console.log('Connection failed - ', error);
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Accept, Origin, Content-Type, X-Requested-With'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'DELETE, GET, OPTIONS, PATCH, POST'
  );

  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    content: req.body.content,
    title: req.body.title
  });

  post.save();

  res.status(201).json({
    message: 'Post added successfully'
  });
})

app.get('/api/posts', (req, res, next) => {
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
