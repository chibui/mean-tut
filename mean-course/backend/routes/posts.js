const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

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

router.post(
  '',
  checkAuth,
  multer({storage: storage}).single('image'), (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}`;

    const post = new Post({
      content: req.body.content,
      creator: req.userData.userId,
      imagePath: `${url}/images/${req.file.filename}`,
      title: req.body.title
    });

    post.save().then(createdPost => {
      console.log('createdPost', createdPost);

      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(err => {
      console.log('err', err);
    });
})

router.get('', (req, res, next) => {
  const currentPage = +req.query.page;
  const pageSize = +req.query.pageSize;
  const postQuery = Post.find();
  let fetchedPosts;

  if (currentPage && pageSize) {
    postQuery
      .skip(pageSize * (currentPage -1 ))
      .limit(pageSize);
  }

  postQuery
    .then(posts => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        maxPosts: count,
        message: 'Post fetched successfully',
        posts: fetchedPosts
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

router.delete(
  '/:id',
  checkAuth,
  (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
      .then(result => {
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Post updated successfully!'});
        } else {
          res.status(401).json({ message: 'Not authorized'});
        }
      })
      .catch(err => {
        console.log('err', err);
      });
});

router.put(
  '/:id',
  checkAuth,
  multer({storage: storage}).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
      const url = `${req.protocol}://${req.get('host')}`;
      imagePath = `${url}/images/${req.file.filename}`
    }

    const post = new Post({
      content: req.body.content,
      _id: req.body.id,
      imagePath: imagePath,
      title: req.body.title
    });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Post updated successfully!'});
      } else {
        res.status(401).json({ message: 'Not authorized'});
      }
    })
    .catch(err => {
      console.log('err', err);
    }
  );
});

module.exports = router;
