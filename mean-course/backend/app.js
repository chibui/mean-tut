const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const DB_CONNECT = require('./constants');
const postsRoutes = require('./routes/posts');

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
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Accept, Origin, Content-Type, X-Requested-With'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'DELETE, GET, OPTIONS, PATCH, POST, PUT'
  );

  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
