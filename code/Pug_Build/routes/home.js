
var express = require('express');
var router = express.Router();
const decoder = require ('jwt-decode')
const connector = require ('../conn.js')
require('dotenv').config();
const mariadb = require("mariadb");
const postController = require('../Posts/postController')
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

let idValue;

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

  res.redirect('/home/' + responsePayload.sub);
});

router.get('/:id', postController.showPosts);

async function signUp(responsePayload) {
  try {
      
      conn = await pool.getConnection();
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
module.exports = router;