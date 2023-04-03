var express = require('express');
var router = express.Router();
const postController = require('../Posts/postController')
const { body, validationResult } = require ('express-validator');

/* GET profile page. */
router.get('/', async function(req, res, next) {
    const allPosts = await postController.findAll();
    res.render('profile', { title: 'Posts', posts: allPosts })
});

/* GET - Edit post */
router.get('/feed/posts/:id/edit', async function(req, res, next) {
    const post = await postController.findByID(req.params.id);
    let foundPost = post[0]
    res.render('post_edit', { title: 'Edit Post', post: foundPost });
  });
  
  /* POST - Edit post */
  router.post('/feed/posts/:id/edit',
    body('caption').trim().notEmpty().withMessage('The caption cannot be empty!'),
    async function(req, res, next) {
  
    const result = validationResult(req);
    if (result.isEmpty() != true){
        const post = await postController.findByID(req.params.id);
        res.render('post_edit', { title: 'Edit Post', post: post, message: result.array() })
    }
    else{
        const updatedPost = {
            pid: req.params.id,
            caption: req.body.caption,
        };
        await postController.update(updatedPost);
        res.redirect('/home/feed');
    }
  });
  
  /* GET - Delete post */
  router.get('/feed/posts/:id/delete', async function(req, res, next) {
    const post = await postController.findByID(req.params.id);
    let foundPost = post[0]
    res.render('post_delete', { title: 'Delete post', post: foundPost});
  });
  
  /* POST - Delete post */
  router.post('/feed/posts/:id/delete', async function(req, res, next) {
    await postController.delete(req.params.id);
    res.redirect('/home/feed')
  });
  
module.exports = router;