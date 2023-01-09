const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DB_CONNECT = require('./constants');

const Post = require('./models/post');

const baseURL = '/api/posts'

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

app.post(baseURL, (req, res, next) => {
  const post = new Post({
    content: req.body.content,
    title: req.body.title
  });

  post.save();

  res.status(201).json({
    message: 'Post added successfully'
  });
})

app.get(baseURL, (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'Post fetched successfully',
        posts: posts
      });
    })
    .catch((err) => {
      console.log('error', err);
    });
});

app.delete(baseURL + '/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted!'});
    });
});

module.exports = app;
