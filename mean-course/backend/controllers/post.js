const Post = require('../models/post');

exports.createPost = (req, res, next) => {
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
    res.status(500).json({
      message: 'Creating post failed'
    });
  });
}

exports.getPosts = (req, res, next) => {
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
    .catch(() => {
      res.status(500).json({
        message: 'Fetching posts failed'
      });
    });
}

exports.getPostById = (req, res, next) => {
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
    .catch(() => {
      res.status(500).json({
        message: 'Fetching post failed'
      });
    });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Post updated successfully!'});
      } else {
        res.status(401).json({ message: 'Not authorized'});
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Deleting post failed'
      });
    });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${req.file.filename}`
  }

  const post = new Post({
    content: req.body.content,
    creator: req.userData.userId,
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
    res.status(500).json({
      message: 'Updating post failed'
    });
  });
}
