const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const postsRoutes = require('./routes/post');
const PostModel = require('./models/post');

const app = express();

mongoose.connect('mongodb://andy:andy123@ds349065.mlab.com:49065/meanblogappposts')
  .then(() => {
    console.log('COnnected to database!');
  })
  .catch(() => {
    console.log('Connection failed!')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// first middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
  next(); // call next so that when this middlware is finished it will go to the next middleware
});

// line below is used if you use the 'routes/post' routes folder
// app.use(postsRoutes);


// create a post
app.post('/api/posts', (req, res, next) => {
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
app.get('/api/posts', (req, res, next) => {
  PostModel.find().then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: documents
    });
  });
});

// get a single post
app.get('/api/post/:id', (req, res, next) => {
  PostModel.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!!'});
    }
  });
});

// edit a post
app.put('/api/posts/:id', (req, res, next) => {
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
app.delete('/api/posts/:id', (req, res, next) => {
  PostModel.deleteOne({ _id: req.param.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted' });
  });
});

module.exports = app;


// mongodb://andy:andy123@ds349065.mlab.com:49065/meanblogappposts
