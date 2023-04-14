var express = require('express');
var router = express.Router();
const decoder = require ('jwt-decode')
const postController = require('../Posts/postController')
const accountsController = require('../accounts/accountController')
const { body, validationResult } = require ('express-validator');
const login = require('../login/login')
require('dotenv').config();
const aws = require('aws-sdk')

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'us-east-2'
})

var params = {Bucket: process.env.AWS_BUCKET_NAME, Key: ''}

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
    const editedPosts = []
    for (let i = 0; i < allPosts.length; i++) {
      let editedPost = allPosts[i]
      let emailOfPost = await accountsController.findByID(editedPost.uid)
      editedPost["email"] = emailOfPost[0].email
      if(editedPost.image != null){
        params.Key = editedPost.image
        editedPost["signedURL"] = await s3.getSignedUrlPromise('getObject', params)
      }
    editedPosts[i] = editedPost
    }
    console.log(editedPosts)
    res.render('home_logged_in',{title: 'Posts', posts: editedPosts})
  }

  else{
    res.redirect('/error/login')
  }
})

router.post('/feed/',
  body('caption').trim().notEmpty().withMessage('The caption cannot be empty!'), 
  async function(req, res, next){
    //console.log(req.session)
    if(await login.checkLogin(req.session)){

      const result = validationResult(req);
      if (result.isEmpty() != true){
        console.log("error posting")
      }

      else{
        
        if(req.files == null){
          await postController.create({caption: req.body.caption, uid: req.session.userID})
        }
        else{
          const file = req.files.image;
          const bucketParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.session.userID + Date.parse(new Date()).toString(),
            Body: file.data,
          };
          try {
            const data = await s3.upload(bucketParams).promise();
            console.log(data)
            await postController.createWithImage({caption: req.body.caption, uid: req.session.userID, image: data.key})
            res.redirect(`/home/feed`)
          } catch (err) {
            console.log("Error", err);
          }
        }
      }
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