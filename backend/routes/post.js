const express = require('express');
const PostModel = require('../models/post');

const router = express.Router();


// create a post
router.post('/api/posts', (req, res, next) => {
  const postModel = new PostModel({
    title: req.body.title,
    content: req.body.content
  });
  // save post to database
  postModel.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      postId: createdPost._id
    });
  });
});

// return all posts
router.get('/api/posts', (req, res, next) => {
  PostModel.find().then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: documents
    });
  });
});

// get a single post
router.get('/api/post/:id', (req, res, next) => {
  PostModel.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!!'});
    }
  });
});

// edit a post
router.put('/api/posts/:id', (req, res, next) => {
  const post = new PostModel({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  PostModel.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({
      message: 'Update successful'
    });
  });
});

// delete a post
router.delete('/api/posts/:id', (req, res, next) => {
  PostModel.deleteOne({ _id: req.param.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted' });
  });
});

module.exports = router;
