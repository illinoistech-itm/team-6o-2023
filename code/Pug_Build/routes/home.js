
var express = require('express');
var router = express.Router();
const decoder = require ('jwt-decode')
require('dotenv').config();
const postController = require('../Posts/postController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Hawkstagram'});
});

router.post('/', function(req, res, next) {

  const map = JSON.parse(JSON.stringify(req.body));
  const key = Object.keys(map);
  
  const responsePayload = decoder(key.toString());
  idValue = responsePayload.sub;
  /*console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log('Family Name: ' + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);
  */
  signUp(responsePayload)
  global.email = responsePayload.email;
  res.redirect('/home/' + responsePayload.sub);
});

router.get('/:id', async function(req, res, next){
  const allPosts = await postController.findAll();
  res.render('home_logged_in',{title: 'Posts', posts: allPosts})
})

router.post('/:id', async function(req, res, next){
  await postController.create({caption: req.body.caption, uid: 1});
  res.redirect(`/home/feed`)
});

/*
async function signUp(responsePayload) {
  try {
      
      let conn = await pool.getConnection();
      const test = await conn.query("SELECT * FROM accounts WHERE email = ?",[responsePayload.email]);
      console.log(test);
      let result= String(test);
      console.log(result);
      if (result == "") {

      const loginAUTH = await conn.query("INSERT INTO accounts (first_name, email, last_name) VALUES (?,?,?)", [responsePayload.given_name, responsePayload.email, responsePayload.family_name]);
      console.log(loginAUTH);
      }
  
} catch (err) {
  throw err;
} finally {
  if (conn) return conn.end();
}
}

*/
module.exports = router;