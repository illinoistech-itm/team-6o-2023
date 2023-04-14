var express = require('express');
var router = express.Router();
const postController = require('../Posts/postController')
const accountsController = require('../accounts/accountController')
const { body, validationResult } = require ('express-validator');
const login = require('../login/login')

/* GET profile page. */
router.get('/', async function(req, res, next) {
    if(await login.checkLogin(req.session)){
        const allUsersPosts = await postController.findByUID(req.session.userID)
        const userAccount = await accountsController.findByID(req.session.userID)
        res.render('profile', { title: 'Posts', posts: allUsersPosts, account: userAccount[0], userFirstName: req.session.firstName })
    }
    
    else{
      res.redirect('/error/login')
    }
});

/* GET - Edit post */
router.get('/posts/:id/edit', async function(req, res, next) {
    if(await login.checkLogin(req.session)){
        const post = await postController.findByID(req.params.id);
        let foundPost = post[0]
        res.render('post_edit', { title: 'Edit Post', post: foundPost, userFirstName: req.session.firstName });
    }
    
    else{
      res.redirect('/error/login')
    }
});
  
/* POST - Edit post */
router.post('/posts/:id/edit',
    body('caption').trim().notEmpty().withMessage('The caption cannot be empty!'),
    async function(req, res, next) {
  
    if(await login.checkLogin(req.session)){
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
            res.redirect('/profile/');
        }
    }

    else{
        res.redirect('/error/login')
    }

});
  
/* GET - Delete post */
router.get('/posts/:id/delete', async function(req, res, next) {
    if(await login.checkLogin(req.session)){
        const post = await postController.findByID(req.params.id);
        let foundPost = post[0]
        res.render('post_delete', { title: 'Delete post', post: foundPost, userFirstName: req.session.firstName});
    }
    
    else{
      res.redirect('/error/login')
    }
});
  
/* POST - Delete post */
router.post('/posts/:id/delete', async function(req, res, next) {
    if(await login.checkLogin(req.session)){
        await postController.delete(req.params.id);
        res.redirect('/profile')
    }
    
    else{
      res.redirect('/error/login')
    }
});
  
module.exports = router;