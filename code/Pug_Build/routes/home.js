var express = require('express');
var router = express.Router();
const decoder = require ('jwt-decode')
const postController = require('../Posts/postController')
const { body, validationResult } = require ('express-validator');
const login = require('../login/login')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Hawkstagram'});
});

router.post('/', async function(req, res, next) {

  const map = JSON.parse(JSON.stringify(req.body));
  const key = Object.keys(map);
  
  try {
    await login.verify(key[0])
    const responsePayload = decoder(key.toString());
    session = req.session;
    session.userID = await login.signup(responsePayload);
    session.userEmail = responsePayload.email;
    session.token = responsePayload.jti;
    console.log(req.session);
    res.redirect('/home/feed/');
  } catch (error) {
    console.log(error)
    res.redirect('/error/login');
  }

  
});

router.get('/feed/', async function(req, res, next){
  if(await login.checkLogin(req.session)){
    const allPosts = await postController.findAll();
    res.render('home_logged_in',{title: 'Posts', posts: allPosts})
  }

  else{
    res.redirect('/error/login')
  }
})

router.post('/feed/',
  body('caption').trim().notEmpty().withMessage('The caption cannot be empty!'), 
  async function(req, res, next){
    console.log(req.session)
    if(await login.checkLogin(req.session)){

      const result = validationResult(req);
      if (result.isEmpty() != true){
        console.log("error posting")
      }

      else{
        await postController.create({caption: req.body.caption, uid: req.session.userID})
      }
      
      res.redirect(`/home/feed`)
    }

    else{
      res.redirect('/error/login')
    }
});

router.get('/logout', async function(req, res, next){
    req.session.destroy();
    res.redirect('/');
})


module.exports = router;