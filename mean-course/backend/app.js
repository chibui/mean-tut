const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_ATLAS_PW)
  .then(() => {
    console.log('Connected to database',);
  })
  .catch((error) => {
    console.log('Connection failed - ', error);
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Accept, Authorization, Content-Type, Origin, X-Requested-With'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'DELETE, GET, OPTIONS, PATCH, POST, PUT'
  );

  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
