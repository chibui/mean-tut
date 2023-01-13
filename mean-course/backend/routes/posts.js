const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error(' Invalid mime type');

    if (isValid) {
      error = null;
    }

    callback(error, 'backend/images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + extension);
  }
});

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const post = new Post({
    content: req.body.content,
    title: req.body.title
  });

  post.save().then(result => {
    console.log('result', result);

    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  })
  .catch(err => {
    console.log('err', err);
  });
})

router.get('', (req, res, next) => {
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

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'Post not found!'
        });
      }
    })
    .catch((err) => {
      console.log('error', err);
    });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted!'});
    })
    .catch(err => {
      console.log('err', err);
    });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    content: req.body.content,
    _id: req.body.id,
    title: req.body.title
  });

  Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      console.log('update', result);
      res.status(200).json({ message: 'Post updated successfully!'});
    })
    .catch(err => {
      console.log('err', err);
    });
});

module.exports = router;
